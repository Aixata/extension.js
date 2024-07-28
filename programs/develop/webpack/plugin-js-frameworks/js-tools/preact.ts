// ██████╗ ███████╗██╗   ██╗███████╗██╗      ██████╗ ██████╗
// ██╔══██╗██╔════╝██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗
// ██║  ██║█████╗  ██║   ██║█████╗  ██║     ██║   ██║██████╔╝
// ██║  ██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔═══╝
// ██████╔╝███████╗ ╚████╔╝ ███████╗███████╗╚██████╔╝██║
// ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝

import path from 'path'
import fs from 'fs'
import {bold, blue, cyan} from '@colors/colors/safe'

let userMessageDelivered = false

export function isUsingPreact(projectPath: string) {
  const packageJsonPath = path.join(projectPath, 'package.json')
  const manifestJsonPath = path.join(projectPath, 'manifest.json')
  const manifest = require(manifestJsonPath)

  if (!fs.existsSync(packageJsonPath)) {
    return false
  }

  const packageJson = require(packageJsonPath)
  const preactAsDevDep =
    packageJson.devDependencies && packageJson.devDependencies.preact
  const preactAsDep =
    packageJson.dependencies && packageJson.dependencies.preact

  // This message is shown for each JS loader we have, so we only want to show it once.
  if (preactAsDevDep || preactAsDep) {
    if (!userMessageDelivered) {
      console.log(
        `🧩 Extension.js ${blue('►►►')} ${manifest.name} (v${
          manifest.version
        }) ` + `is using ${cyan('Preact')}.`
      )

      userMessageDelivered = true
    }
  }

  return preactAsDevDep || preactAsDep
}

export function maybeUsePreact(projectPath: string) {
  return isUsingPreact(projectPath)
    ? {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat', // 必须放在 test-utils 下面
        'react/jsx-runtime': 'preact/jsx-runtime'
      }
    : undefined
}
