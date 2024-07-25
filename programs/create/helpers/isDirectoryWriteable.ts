//  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
// ██║     ██████╔╝█████╗  ███████║   ██║   █████╗
// ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝
// ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
//  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝

import fs from 'fs/promises'
import {green} from '@colors/colors/safe'

export default async function isDirectoryWriteable(
  directory: string,
  projectName: string
): Promise<boolean> {
  try {
    console.log(`🤝 - Ensuring ${green(projectName)} folder exists...`)

    await fs.mkdir(directory, {recursive: true})

    return true
  } catch (err) {
    console.error('Error while checking directory writability:', err)
    return false
  }
}
