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

export function isUsingReact(projectDir: string) {
  const packageJsonPath = path.join(projectDir, 'package.json')
  const manifestJsonPath = path.join(projectDir, 'manifest.json')
  const manifest = require(manifestJsonPath)

  if (!fs.existsSync(packageJsonPath)) {
    return false
  }

  const packageJson = require(packageJsonPath)
  const reactAsDevDep =
    packageJson.devDependencies && packageJson.devDependencies.react
  const reactAsDep = packageJson.dependencies && packageJson.dependencies.react

  // This message is shown for each JS loader we have, so we only want to show it once.
  if (reactAsDevDep || reactAsDep) {
    if (!userMessageDelivered) {
      console.log(
        bold(
          `🧩 extension-create ${blue('►►►')} ${manifest.name} (v${
            manifest.version
          }) `
        ) + `is using ${bold(cyan('React'))}.`
      )

      userMessageDelivered = true
    }
  }

  return reactAsDevDep || reactAsDep
}
