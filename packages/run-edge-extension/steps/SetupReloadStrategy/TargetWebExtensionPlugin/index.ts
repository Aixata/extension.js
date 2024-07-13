import fs from 'fs'
import path from 'path'
import {type Compiler} from '@rspack/core'
import WebExtension from 'webpack-target-webextension'
import {red, bold} from '@colors/colors/safe'
import {type RunEdgeExtensionInterface, type Manifest} from '../../../types'
import messages from '../../../helpers/messages'

class TargetWebExtensionPlugin {
  private readonly manifestPath?: string

  constructor(options: RunEdgeExtensionInterface) {
    this.manifestPath = options.manifestPath
  }

  private handleBackground(compiler: Compiler, manifest: Manifest) {
    const minimumBgScript = path.resolve(
      __dirname,
      'minimum-background-file.mjs'
    )
    const dirname = path.dirname(this.manifestPath!)
    const manifestBg = manifest.background

    if (manifest.manifest_version === 3) {
      const serviceWorker: string | null =
        manifestBg && manifestBg.service_worker
      if (serviceWorker) {
        const serviceWorkerPath = path.join(dirname, serviceWorker)
        this.ensureFileExists(serviceWorkerPath, 'background.service_worker')
      } else {
        this.addDefaultEntry(
          compiler,
          'background/service_worker',
          minimumBgScript
        )
      }
    } else if (manifest.manifest_version === 2) {
      const backgroundScripts: string[] | null =
        manifestBg && manifestBg.scripts
      if (backgroundScripts && backgroundScripts.length > 0) {
        const backgroundScriptPath = path.join(dirname, backgroundScripts[0])
        this.ensureFileExists(backgroundScriptPath, 'background.scripts')
      } else {
        this.addDefaultEntry(compiler, 'background/script', minimumBgScript)
      }
    }
  }

  private ensureFileExists(filePath: string, fieldName: string) {
    if (!fs.existsSync(filePath)) {
      const fieldError = messages.manifestFieldError(fieldName, filePath)
      console.error(red(bold(fieldError)))
      throw new Error(fieldError)
    }
  }

  private addDefaultEntry(
    compiler: Compiler,
    name: string,
    defaultScript: string
  ) {
    console.log(`Adding default script for ${name}`)
    compiler.options.entry = {
      ...compiler.options.entry,
      [name]: {import: [defaultScript]}
    }
  }

  private getEntryName(manifest: Manifest) {
    if (manifest.background) {
      if (manifest.manifest_version === 3) {
        return {serviceWorkerEntry: 'background/service_worker'}
      }

      if (manifest.manifest_version === 2) {
        return {pageEntry: 'background/script'}
      }
    }

    return {pageEntry: 'background'}
  }

  public apply(compiler: Compiler) {
    if (!this.manifestPath || !fs.lstatSync(this.manifestPath).isFile()) {
      return
    }

    const manifest: Manifest = require(this.manifestPath)

    this.handleBackground(compiler, manifest)

    new WebExtension({
      background: this.getEntryName(manifest),
      weakRuntimeCheck: true
      // @ts-expect-error this is a rspack plugin
    }).apply(compiler)
  }
}

export default TargetWebExtensionPlugin
