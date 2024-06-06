import path from 'path'
import {type Compiler} from 'webpack'
import {log, error} from 'console'
import {
  underline,
  bold,
  bgWhite,
  green,
  blue,
  red,
  yellow,
  magenta,
  cyan
} from '@colors/colors/safe'
// @ts-ignore
import prefersYarn from 'prefers-yarn'
import getDirectorySize from '../steps/calculateDirSize'
import {type ManifestBase} from '../manifest-types'

interface Data {
  id: string
  manifest: ManifestBase
  management: chrome.management.ExtensionInfo
}

function manifestFieldError(feature: string, htmlFilePath: string) {
  const hintMessage = `Check the ${bold(
    feature
  )} field in your manifest.json file and try again.`

  const errorMessage = `[manifest.json] File path ${underline(
    htmlFilePath
  )} not found. ${hintMessage}`
  return errorMessage
}

function manifestNotFound() {
  log(`
${bold("Error! Can't find the project's manifest file.")}

Check your extension ${yellow(
    'manifest.json'
  )} file and ensure its path points to
one of the options above, and try again.
`)
}

function extensionData(
  compiler: Compiler,
  message: {data?: Data},
  isFirstRun?: boolean
) {
  if (!message.data) {
    // TODO: cezaraugusto this happens when the extension
    // can't reach the background script. This can be many
    // things such as a mismatch config or if after an error
    // the extension starts disabled. Improve this error.
    error(`[⛔️] ${bgWhite(cyan(bold(` safari-browser `)))} ${red(
      '✖︎✖︎✖︎'
    )} No data received from client.

Ensure your extension is enabled and that no hanging Safari instance is open then try again.`)

    process.exit(1)
  }

  const compilerOptions = compiler.options
  const {id, management} = message.data

  if (!management) {
    if (process.env.EXTENSION_ENV === 'development') {
      error(
        `[⛔️] ${bgWhite(cyan(bold(` safari-browser `)))} ${green(
          '►►►'
        )} No management API info received from client. Investigate.`
      )
    }
  }

  const {name, description, version, hostPermissions, permissions} = management

  const manifestPath = path.join(compilerOptions.context || '', 'manifest.json')
  const manifestFromCompiler = require(manifestPath)
  const permissionsBefore: string[] = manifestFromCompiler.permissions || []
  const permissionsAfter: string[] = permissions || []
  // If a permission is used in the post compilation but not
  // in the pre-compilation step, add a "dev only" string to it.
  const permissionsParsed: string[] = permissionsAfter.map((permission) => {
    if (permissionsBefore.includes(permission)) return permission
    return `${permission} (dev only)`
  })
  const fixedId = manifestFromCompiler.id === id
  const hasHost = hostPermissions && hostPermissions.length

  log('')
  log(`${bold(`• Name:`)} ${name}`)
  description && log(`${bold(`• Description:`)} ${description}`)
  log(`${bold(`• Version:`)} ${version}`)
  log(
    `${bold(`• Size:`)} ${getDirectorySize(
      compilerOptions.output.path || 'dist'
    )}`
  )
  log(`${bold(`• ID:`)} ${id} (${fixedId ? 'permantent' : 'temporary'})`)
  hasHost &&
    log(`${bold(`• Host Permissions`)}: ${hostPermissions.sort().join(', ')}`)
  log(
    `${bold(`• Permissions:`)} ${permissionsParsed.sort().join(', ')}` ||
      '(Using defaults)'
  )
  log(
    `${bold(`• Settings URL`)}: ${underline(
      blue(`safari://extensions/?id=${id}`)
    )}\n`
  )
}

function stdoutData(compiler: Compiler, message: {data?: Data}) {
  const compilerOptions = compiler.options
  const management = message.data?.management
  const safariRuntime = bgWhite(cyan(bold(` safari-browser `)))
  const modeColor = compilerOptions.mode === 'production' ? magenta : cyan

  log(
    `${safariRuntime} ${green('►►►')} Running Safari in ${bold(
      modeColor(compilerOptions.mode || 'unknown')
    )} mode. Browser ${management?.type} ${bold(
      management?.enabled ? 'enabled' : 'disabled'
    )}.`
  )
}

function isFirstRun() {
  log('')
  log('This is your first run using 🧩 Extension.js. Welcome! 🎉')
  log(
    `To start developing your extension, terminate this process and run ${bold(
      blue(prefersYarn() ? `yarn dev` : `npm run dev`)
    )}.`
  )
  log(`\n🧩 Learn more at ${blue(underline(`https://extension.js.org`))}`)
}

function watchModeClosed(code: number, reason: Buffer) {
  const message = reason.toString()

  log(
    `[😓] ${bgWhite(cyan(bold(` safari-browser `)))} ${red(
      '✖︎✖︎✖︎'
    )} Watch mode closed (code ${code}). ${
      message && '\n\nReason: ' + message + '\n'
    }Exiting...\n`
  )
}

function browserNotFound(safariPath: string) {
  error(
    `${bgWhite(cyan(bold(` safari-browser `)))} ${red(
      '✖︎✖︎✖︎'
    )} Safari not found at ${safariPath}`
  )
}

function webSocketError(error: any) {
  error(
    `[⛔️] ${bgWhite(cyan(bold(` safari-browser `)))} ${red(
      '✖︎✖︎✖︎'
    )} WebSocket error`,
    error
  )
}

function parseFileError(error: any, filepath: string) {
  error(
    `[⛔️] ${bgWhite(cyan(bold(` safari-browser `)))} ${red(
      '✖︎✖︎✖︎'
    )} Error parsing file: ${filepath}. Reason: ${error.message}`
  )
}

function macOsOnly() {
  error(
    `${bgWhite(cyan(bold(` safari-browser `)))} ${red(
      '✖︎✖︎✖︎'
    )} Safari is only available on macOS.`
  )
}

function converterNotFound() {
  error(
    `${bgWhite(cyan(bold(` safari-browser `)))} ${red(
      '✖︎✖︎✖︎'
    )} Safari browser extension converter not found.\n\n` +
      `To install Xcode and its command line tools, run the following command and try again:\n\n` +
      `  \`xcode-select --install\``
  )
}

export default {
  manifestFieldError,
  manifestNotFound,
  extensionData,
  stdoutData,
  isFirstRun,
  watchModeClosed,
  browserNotFound,
  webSocketError,
  parseFileError,
  macOsOnly,
  converterNotFound
}
