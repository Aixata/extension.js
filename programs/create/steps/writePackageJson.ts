//  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
// ██║     ██████╔╝█████╗  ███████║   ██║   █████╗
// ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝
// ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
//  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝

import path from 'path'
import fs from 'fs/promises'
import {bold, red, yellow} from '@colors/colors/safe'

import getTemplatePath from '../helpers/getTemplatePath'
import isExternalTemplate from '../helpers/isExternalTemplate'

const extensionCreatePackageJsonScripts = {
  dev:
    process.env.EXTENSION_ENV === 'development'
      ? 'node node_modules/@extension-create/cli dev'
      : 'extension dev',
  start:
    process.env.EXTENSION_ENV === 'development'
      ? 'node node_modules/@extension-create/cli start'
      : 'extension start',
  build:
    process.env.EXTENSION_ENV === 'development'
      ? 'node node_modules/@extension-create/cli build'
      : 'extension build'
}

export default async function writePackageJson(
  projectPath: string,
  projectName: string,
  template: string
) {
  const templatePath = getTemplatePath(process.cwd(), template)

  const packageJsonPath = isExternalTemplate(template)
    ? path.join(projectPath, 'package.json')
    : path.join(templatePath, 'template.json')

  const packageJsonContent = await fs.readFile(packageJsonPath)
  const packageJson = JSON.parse(packageJsonContent.toString())

  packageJson.scripts = packageJson.scripts || {}
  packageJson.dependencies = packageJson.dependencies || {}
  packageJson.devDependencies = {
    ...(packageJson.devDependencies || {}),
    // During development, we want to use the local version of extension-create
    extension: process.env.EXTENSION_ENV === 'development' ? '*' : 'latest'
  }

  const packageMetadata = {
    ...packageJson,
    name: path.basename(projectPath),
    private: true,
    version: '0.0.0',
    scripts: {
      ...packageJson.scripts,
      ...extensionCreatePackageJsonScripts
    },
    dependencies: packageJson.dependencies,
    devDependencies: packageJson.devDependencies
  }

  try {
    console.log(`📝 - Writing ${yellow(`package.json`)} metadata...`)
    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(packageMetadata, null, 2)
    )
  } catch (error: any) {
    console.error(
      `🧩 ${bold(`extension-create`)} ${red(`✖︎✖︎✖︎`)} Can't write ${yellow(
        `package.json`
      )} for ${bold(projectName)}. ${error}`
    )

    process.exit(1)
  }
}
