import rspack, {type Compilation} from '@rspack/core'

function manifestNotFoundError(compilation: Compilation) {
  const errorMessage = `A manifest file is required for this plugin to run.`

  compilation.errors.push(
    new rspack.WebpackError(`[manifest.json]: ${errorMessage}`)
  )
}

function entryNotFoundWarn(
  compilation: Compilation,
  feature: string,
  localesFilePath: string
) {
  const hintMessage = `Check the \`${feature}\` field in your \`manifest.json\` file.`
  const errorMessage = `File path \`${localesFilePath}\` not found. ${hintMessage}`

  compilation.warnings.push(
    new rspack.WebpackError(`[manifest.json]: ${errorMessage}`)
  )
}

function noValidFolderError(compilation: Compilation) {
  const hintMessage2 = `or remove the \`default_locale\` field from your \`manifest.json\` file.`
  const hintMessage = `Ensure the \`_locales\` folder is valid and available at the root of your project. ${hintMessage2}`
  const errorMessage = `Default locale was specified, but \`_locales\` subtree is missing. ${hintMessage}`

  compilation.errors.push(
    new rspack.WebpackError(`[_locales]: ${errorMessage}`)
  )
}

export default {
  manifestNotFoundError,
  entryNotFoundWarn,
  noValidFolderError
}
