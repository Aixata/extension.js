import path from 'path'
import type webpack from 'webpack'
import colors from '@colors/colors/safe'

import SpecialFoldersPlugin from './SpecialFoldersPlugin'
import {type DevOptions} from '../../extensionDev'

export default function boringPlugins(projectPath: string, {mode}: DevOptions) {
  const project = require(`${projectPath}/manifest.json`)
  const projectName = project.name
  const projectVersion = project.version

  return {
    name: 'BoringPlugin',
    apply: (compiler: webpack.Compiler) => {
      // Writes the project name and version to the terminal
      compiler.hooks.done.tap('BoringPlugin', (stats) => {
        const divider = stats.hasErrors()
          ? colors.red('✖︎✖︎✖︎')
          : colors.green('►►►')
        stats.compilation.name = `🧩 extension-create ${divider} ${projectName} (v${projectVersion})`
      })

      // Plugin to add special folders (public, pages, scripts) to the extension
      new SpecialFoldersPlugin({
        manifestPath: path.join(projectPath, 'manifest.json')
      }).apply(compiler)
    }
  }
}
