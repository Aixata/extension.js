// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import {Compiler} from '@rspack/core'
import {type DevOptions} from '../../extensionDev'
import ReactRefreshPlugin from '@rspack/plugin-react-refresh'
import {isUsingReact} from '../options/react'
import {isUsingPreact} from '../options/preact'

export default function reloadPlugins(projectPath: string, {mode}: DevOptions) {
  return {
    constructor: {name: 'ReloadPlugins'},
    apply: (compiler: Compiler) => {
      if (mode !== 'development') return

      if (isUsingReact(projectPath) || isUsingPreact(projectPath)) {
        new ReactRefreshPlugin().apply(compiler)
      }
    }
  }
}
