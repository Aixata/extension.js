//  ██████╗██████╗ ███████╗ █████╗ ████████╗███████╗
// ██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
// ██║     ██████╔╝█████╗  ███████║   ██║   █████╗
// ██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══╝
// ╚██████╗██║  ██║███████╗██║  ██║   ██║   ███████╗
//  ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝

const path = require('path')

const spawn = require('cross-spawn')
const { log } = require('log-md')

const abortProjectAndClean = require('./abortProjectAndClean')

module.exports = async function (workingDir, projectName) {
  const projectPath = path.resolve(workingDir, projectName)
  const projectPackageJson = path.join(projectPath, 'package.json')
  const packageMetadata = require(projectPackageJson)

  const dependencies = packageMetadata.dependencies || []
  const devDependencies = packageMetadata.devDependencies || []

  if (
    dependencies.length === 0 &&
    devDependencies.length === 0
  ) {
    log('⏭  - No dependencies. Skipping install step...')

    return
  }

  const command = 'npm'
  const commonArgs = ['--prefix', projectPath]

  try {
    log('🛠  - Installing extension-create as devDependency...')
    // Link instead of download in local env
    if (process.env.NODE_ENV === 'development') {
      spawn(command, ['link'], { stdio: 'inherit' })

      const linkSelfArgs = [
        commonArgs,
        `${projectPath}/node_modules`,
        'link',
        'extension-create'
      ]

      spawn(command, linkSelfArgs, { stdio: 'inherit' })
    } else {
      const installSelfArgs = [
        ...commonArgs,
        'install',
        '-D',
        'extension-create'
      ]

      spawn(command, installSelfArgs, { stdio: 'inherit' })
    }

    log('⚙️  - Installing package dependencies...')
    const installArgs = [...commonArgs, 'install', '--exact']

    spawn(command, installArgs, { stdio: 'inherit' })
    await Promise.resolve()
  } catch (error) {
    abortProjectAndClean(error, workingDir, projectName)
  }
}
