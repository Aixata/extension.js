// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import {rspack} from '@rspack/core'
import {bold, red} from '@colors/colors/safe'
import getProjectPath from './steps/getProjectPath'
import compilerConfig from './rspack/rspack-config'
import * as messages from './messages/startMessage'

export interface StartOptions {
  mode?: 'development' | 'production'
  browser?: 'chrome' | 'edge' | 'firefox' | 'all'
  port?: number
  noOpen?: boolean
  userDataDir?: string | boolean
  polyfill?: boolean
}

export default async function extensionStart(
  pathOrRemoteUrl: string | undefined,
  startOptions: StartOptions = {
    mode: 'production'
  }
) {
  const projectPath = await getProjectPath(pathOrRemoteUrl)

  try {
    const browser = startOptions.browser || 'chrome'
    const rspackConfig = compilerConfig(projectPath, {
      mode: 'production',
      browser
    })

    messages.building(startOptions)

    rspack(rspackConfig).run((err, stats) => {
      if (err) {
        console.error(err.stack || err)
        process.exit(1)
      }

      if (!stats?.hasErrors()) {
        messages.startRspack(projectPath, startOptions)

        setTimeout(() => {
          messages.ready(startOptions)
        }, 1500)
      } else {
        console.log(stats.toString({colors: true}))
        process.exit(1)
      }
    })
  } catch (error: any) {
    console.log(
      `🧩 ${bold(`Extension.js`)} ${red('✖︎✖︎✖︎')} ` +
        `Error while starting the extension:\n\n${red(
          bold((error as string) || '')
        )}`
    )
    process.exit(1)
  }
}
