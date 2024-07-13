// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import path from 'path'
import {exec} from 'child_process'
import type {DevOptions} from '../extensionDev'

export default async function startRspackDevServer(
  projectPath: string,
  devOptions: DevOptions
) {
  return new Promise<void>((resolve, reject) => {
    const rspackArgs = ['dev']

    if (devOptions.port) {
      rspackArgs.push('--port', devOptions.port.toString())
    }

    const command = `npm run ${rspackArgs.join(' ')}`

    const server = exec(
      command,
      {cwd: projectPath},
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error starting Rspack server: ${error.message}`)
          reject(error)
          return
        }
        if (stderr) {
          console.error(`Rspack server stderr: ${stderr}`)
        }
        console.log(`Rspack server stdout: ${stdout}`)
      }
    )

    server.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Rspack server process exited with code ${code}`))
      } else {
        resolve()
      }
    })
  })
}
