import path from 'path'
import fs from 'fs'
import WebSocket from 'ws'
import {Compiler} from 'webpack'
import * as messages from '../../../../lib/messages'
import {type Manifest} from '../../../../webpack-types'
import {getHardcodedMessage, isFirstRun} from '../../../../lib/utils'
import {DevOptions} from '../../../../../module'
import {CERTIFICATE_DESTINATION_PATH} from '../../../../lib/constants'
import {httpsServer} from './https-server'

interface Data {
  id: string
  manifest: Manifest
  management: chrome.management.ExtensionInfo
}

interface Message {
  data?: Data | undefined
  status: string
}

export function startServer(compiler: Compiler, options: DevOptions) {
  const projectPath = compiler.options.context || ''
  const manifest = require(path.join(projectPath, 'manifest.json'))
  const manifestName = manifest.name || 'Extension.js'

  let webSocketServer: WebSocket.Server

  if (options.browser === 'firefox') {
    const {server} = httpsServer(manifestName, options.port as number)
    webSocketServer = new WebSocket.Server({server})
  } else {
    webSocketServer = new WebSocket.Server({
      host: 'localhost',
      port: options.port
    })
  }

  webSocketServer.on('connection', (ws) => {
    ws.send(JSON.stringify({status: 'serverReady'}))

    ws.on('error', (error) => {
      console.log(messages.webSocketError(manifestName, error))
      webSocketServer.close()
    })

    ws.on('close', () => {
      webSocketServer.close()
    })

    // We're only ready when the extension says so
    ws.on('message', (msg) => {
      const message: Message = JSON.parse(msg.toString())

      if (message.status === 'clientReady') {
        const manifest: Manifest = require(
          path.join(projectPath, 'manifest.json')
        )
        console.log(messages.runningInDevelopment(manifest, message))
        console.log('')
        console.log(
          messages.stdoutData(
            options.mode,
            options.browser,
            message.data?.management.enabled || false
          )
        )

        if (isFirstRun(options.browser)) {
          setTimeout(() => {
            console.log(messages.isFirstRun(options.browser))
          }, 2500)
        }
      }
    })
  })

  if (options.browser === 'firefox') {
    if (!fs.existsSync(CERTIFICATE_DESTINATION_PATH)) {
      const hardcodedMessage = getHardcodedMessage(manifest)
      console.log(messages.runningInDevelopment(manifest, hardcodedMessage))
      console.log('')

      if (isFirstRun('firefox')) {
        console.log(messages.certRequired())
        console.log('')
      }
    }
  }

  return webSocketServer
}
