//  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
// ██║     ██████╔╝█████╗  ███████║   ██║   █████╗
// ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝
// ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
//  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝

import path from 'path'
import fs from 'fs/promises'
import pacote from 'pacote'
import {getExternalImportInfo} from '../helpers/getImportInfo'

export default async function importExternalTemplate(
  workingDir: string,
  projectName: string,
  template: string
) {
  const projectPath = path.join(workingDir, projectName)
  const importInfo = getExternalImportInfo(template)
  const templateName = path.basename(template)

  try {
    await fs.mkdir(projectPath, {recursive: true})

    const {name, version} = await pacote.manifest(importInfo)
    console.log(
      `🧰 - Installing **${projectName}** from template \`${templateName}\``
    )
    await pacote.extract(`${name}@${version}`, projectPath)
  } catch (error: any) {
    console.error(`😕❓ Can't find template __${templateName}__. ${error}`)
    process.exit(1)
  }
}
