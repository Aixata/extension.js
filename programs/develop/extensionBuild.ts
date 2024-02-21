// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import {bold, red} from '@colors/colors/safe'
import getProjectPath from './steps/getProjectPath'
import buildWebpack from './webpack/buildWebpack'

export interface BuildOptions {
  browser?: 'chrome' | 'edge'
  polyfill?: boolean
}

export default async function extensionBuild(
  pathOrRemoteUrl: string | undefined,
  {...buildOptions}: BuildOptions
) {
  const projectPath = await getProjectPath(pathOrRemoteUrl)

  try {
    buildWebpack(projectPath, {...buildOptions})
  } catch (error: any) {
    console.log(
      `🧩 ${bold(`extension-create`)} ${red('✖︎✖︎✖︎')} ` +
        `Error while developing the extension:\n\n${red(bold(error.toString() || ''))}`
    )
    process.exit(1)
  }
}
