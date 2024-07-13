import rspack, {type Compilation} from '@rspack/core'

function entryNotFoundWarn(
  compilation: Compilation,
  feature: string,
  iconFilePath: string
) {
  const hintMessage = `Check the \`${feature}\` field in your \`manifest.json\` file.`
  const errorMessage = `File path \`${iconFilePath}\` not found. ${hintMessage}`

  compilation.warnings.push(
    new rspack.WebpackError(`[manifest.json]: ${errorMessage}`)
  )
}

export default {
  entryNotFoundWarn
}
