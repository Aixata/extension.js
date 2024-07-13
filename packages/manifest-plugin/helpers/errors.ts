import fs from 'fs'
import rspack, {type Compilation} from '@rspack/core'
import manifestFields from 'browser-extension-manifest-fields'

import messages from './messages'
import {type Manifest} from '../types'

function manifestNotFoundError(compilation: Compilation) {
  compilation.errors.push(
    new rspack.WebpackError(
      `[manifest.json]: ${messages.manifestNotFoundError}`
    )
  )
}

function manifestInvalidError(compilation: Compilation, error: any) {
  compilation.errors.push(
    new rspack.WebpackError(`[manifest.json]: ${messages.manifestInvalidError}`)
  )
}

function handleHtmlErrors(
  compilation: Compilation,
  manifestPath: string,
  WebpackError: typeof rspack.WebpackError
) {
  const manifest: Manifest = require(manifestPath)
  const htmlFields = manifestFields(manifestPath, manifest).html

  for (const [field, value] of Object.entries(htmlFields)) {
    if (value) {
      const fieldError = messages.manifestFieldError(field, value?.html)

      if (!fs.existsSync(value.html)) {
        compilation.errors.push(new WebpackError(fieldError))
      }
    }
  }
}

function handleIconsErrors(
  compilation: Compilation,
  manifestPath: string,
  WebpackError: typeof rspack.WebpackError
) {
  const manifest: Manifest = require(manifestPath)
  const iconsFields = manifestFields(manifestPath, manifest).icons

  for (const [field, value] of Object.entries(iconsFields)) {
    if (value) {
      if (typeof value === 'string') {
        const fieldError = messages.manifestFieldError(field, value)

        if (!fs.existsSync(value)) {
          compilation.errors.push(new WebpackError(fieldError))
        }
      }
    }

    if (value != null && value.constructor.name === 'Object') {
      const icon = value as {light?: string; dark?: string}

      if (icon.light) {
        const fieldError = messages.manifestFieldError(field, icon.light)

        if (!fs.existsSync(icon.dark!)) {
          compilation.errors.push(new WebpackError(fieldError))
        }
      }

      if (icon.dark) {
        const fieldError = messages.manifestFieldError(field, icon.dark)

        if (!fs.existsSync(icon.dark)) {
          compilation.errors.push(new WebpackError(fieldError))
        }
      }
    }

    if (Array.isArray(value)) {
      for (const icon of value) {
        const fieldError = messages.manifestFieldError(field, icon as string)

        if (typeof icon === 'string') {
          if (!fs.existsSync(icon)) {
            compilation.errors.push(new WebpackError(fieldError))
          }
        }
      }
    }
  }
}

function handleJsonErrors(
  compilation: Compilation,
  manifestPath: string,

  WebpackError: typeof rspack.WebpackError
) {
  const manifest: Manifest = require(manifestPath)
  const jsonFields = manifestFields(manifestPath, manifest).json

  for (const [field, value] of Object.entries(jsonFields)) {
    if (value) {
      const valueArr: string[] = Array.isArray(value) ? value : [value]

      for (const json of valueArr) {
        const fieldError = messages.manifestFieldError(field, json)

        if (!fs.existsSync(json)) {
          compilation.errors.push(new WebpackError(fieldError))
        }
      }
    }
  }
}

function handleScriptsErrors(
  compilation: Compilation,
  manifestPath: string,

  WebpackError: typeof rspack.WebpackError
) {
  const manifest: Manifest = require(manifestPath)
  const scriptsFields = manifestFields(manifestPath, manifest).scripts

  for (const [field, value] of Object.entries(scriptsFields)) {
    if (value) {
      const valueArr = Array.isArray(value) ? value : [value]

      for (const script of valueArr) {
        if (field.startsWith('content_scripts')) {
          const [featureName, index] = field.split('-')
          const prettyFeature = `${featureName} (index ${index})`
          const fieldError = messages.manifestFieldError(prettyFeature, script)

          if (!fs.existsSync(script)) {
            compilation.errors.push(new WebpackError(fieldError))
          }
        } else {
          const fieldError = messages.manifestFieldError(field, script)

          if (!fs.existsSync(script)) {
            compilation.errors.push(new WebpackError(fieldError))
          }
        }
      }
    }
  }
}

export default {
  manifestNotFoundError,
  manifestInvalidError,
  handleHtmlErrors,
  handleIconsErrors,
  handleJsonErrors,
  handleScriptsErrors
}
