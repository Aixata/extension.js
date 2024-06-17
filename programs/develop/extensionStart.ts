// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import {bold, red} from '@colors/colors/safe'
import getProjectPath from './steps/getProjectPath'
import buildWebpack from './webpack/buildWebpack'

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
  {...startOptions}: StartOptions = {
    mode: 'production'
  }
) {
  const projectPath = await getProjectPath(pathOrRemoteUrl)

  try {
    buildWebpack(projectPath, {
      ...startOptions,
      silent: true
    })
  } catch (error: any) {
    console.log(
      `🧩 ${bold(`Extension.js`)} ${red('✖︎✖︎✖︎')} ` +
        `Error while developing the extension:\n\n${red(
          bold((error as string) || '')
        )}`
    )
    process.exit(1)
  }
}
