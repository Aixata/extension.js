//  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
// ██║     ██████╔╝█████╗  ███████║   ██║   █████╗
// ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝
// ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
//  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝

import path from 'path'
// @ts-ignore
import prefersYarn from 'prefers-yarn'
import {bold, blue, green, underline} from '@colors/colors/safe'

export default function successfullInstall(
  workingDir: string,
  projectName: string
) {
  const projectPath = path.join(workingDir, projectName)
  const relativePath = path.relative(workingDir, projectPath)

  console.log(
    `🧩 - ${bold(green('Success!'))} Extension ${bold(projectName)} created.`
  )

  const packageManager = prefersYarn() ? 'yarn' : 'npm run'
  console.log(`
Now ${blue(bold(`cd`))} ${underline(relativePath)} and ${blue(
    bold(`${packageManager} dev`)
  )} to open a new browser instance
with your extension installed, loaded, and enabled for development.

You are ready. Time to hack on your extension!
  `)
}
