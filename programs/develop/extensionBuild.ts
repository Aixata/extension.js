// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import {bold, red} from '@colors/colors/safe'
import getProjectPath from './steps/getProjectPath'
import {rspack} from '@rspack/core'
import compilerConfig from './rspack/rspack-config'
import {getOutputPath} from './rspack/config/getPath'
import generateZip from './steps/generateZip'
import * as messages from './messages/buildMessage'

export interface BuildOptions {
  browser?: 'chrome' | 'edge' | 'firefox' | 'all'
  zipFilename?: string
  zip?: boolean
  zipSource?: boolean
  polyfill?: boolean
}

export default async function extensionBuild(
  pathOrRemoteUrl: string | undefined,
  buildOptions: BuildOptions
) {
  const projectPath = await getProjectPath(pathOrRemoteUrl)

  try {
    const browser = buildOptions.browser || 'chrome'
    const rspackConfig = compilerConfig(projectPath, {
      mode: 'production',
      browser
    })

    // BrowserPlugin can run in production but never in the build command.
    const allPluginsButBrowserRunners = rspackConfig.plugins?.filter(
      (plugin) => plugin?.constructor.name !== 'BrowserPlugin'
    )

    const rspackConfigNoBrowser = {
      ...rspackConfig,
      plugins: allPluginsButBrowserRunners
    }

    rspack(rspackConfigNoBrowser).run((err, stats) => {
      if (err) {
        console.error(err.stack || err)
        process.exit(1)
      }

      const outputPath =
        rspackConfigNoBrowser.output?.path ||
        getOutputPath(projectPath, browser)

      messages.buildRspack(projectPath, stats, outputPath, browser)

      if (buildOptions.zip || buildOptions.zipSource) {
        generateZip(projectPath, {...buildOptions, browser})
      }

      if (!stats?.hasErrors()) {
        messages.ready()
      } else {
        console.log(stats.toString({colors: true}))
        process.exit(1)
      }
    })
  } catch (error: any) {
    console.log(
      `🧩 ${bold(`Extension.js`)} ${red('✖︎✖︎✖︎')} ` +
        `Error while building the extension:\n\n${red(
          bold((error as string) || '')
        )}`
    )
    process.exit(1)
  }
}
