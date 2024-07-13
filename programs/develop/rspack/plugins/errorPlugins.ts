// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import path from 'path'
import {Compiler} from '@rspack/core'
import CommonErrorsPlugin from 'webpack-browser-extension-common-errors'
import {type DevOptions} from '../../extensionDev'

export default function errorPlugins(
  projectPath: string,
  {mode, browser}: DevOptions
) {
  return {
    constructor: {name: 'ErrorPlugin'},
    apply: (compiler: Compiler) => {
      const manifestPath = path.resolve(projectPath, 'manifest.json')

      // TODO: combine all extension context errors into one.
      // new CombinedErrorsPlugin().apply(compiler)

      // TODO: Combine common config errors and output a nice error display.
      // new ErrorLayerPlugin().apply(compiler)

      // Handle common user mistakes and rspack errors.
      new CommonErrorsPlugin({
        manifestPath
      }).apply(compiler)
    }
  }
}
