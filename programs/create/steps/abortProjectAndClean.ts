//  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
// ██║     ██████╔╝█████╗  ███████║   ██║   █████╗
// ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝
// ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
//  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝

import fs from 'fs/promises'
import {bold, underline, blue, red} from '@colors/colors/safe'

export default async function abortProjectAndClean(
  error: any,
  projectPath: string,
  projectName: string
) {
  console.log(
    `🧩 ${bold(`extension-create`)} ${red(`✖︎✖︎✖︎`)} Aborting installation of ${projectName}.`
  )

  if (error.command) {
    console.log(
      `🧩 ${bold(`extension-create`)} ${red(`✖︎✖︎✖︎`)} ${
        error.command
      } has failed.`
    )
  } else {
    console.log(
      `🧩 ${bold(
        `extension-create`
      )} 🚨🚨🚨 Unexpected creation error. This is a bug. ` +
        `Please report: "${error}"`
    )
    console.log(
      blue(
        underline('https://github.com/cezaraugusto/extension-create/issues/')
      )
    )
  }

  console.log('🧹 - Removing files generated from project in:')
  console.log(`\`${projectPath}\``)
  await fs.mkdir(projectPath, {recursive: true})
  await fs.rm(projectPath, {recursive: true, force: true})

  process.exit(1)
}
