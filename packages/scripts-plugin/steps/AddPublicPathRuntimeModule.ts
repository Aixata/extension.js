// This source file is adapted from
// https://github.com/awesome-webextension/webpack-target-webextension
// Released under the MIT License.

import {
  RuntimeGlobals,
  // @ts-expect-error cezaraugusto check this later
  RuntimeModule,
  Template,
  type Compiler
} from '@rspack/core'

const basic = [
  `var isBrowser = !!(() => { try { return browser.runtime.getURL("/") } catch(e) {} })()`,
  `var isChrome = !!(() => { try { return chrome.runtime.getURL("/") } catch(e) {} })()`
]

const weakRuntimeCheck = [
  ...basic,
  `var runtime = isBrowser ? browser : isChrome ? chrome : (typeof self === 'object' && self.addEventListener) ? { get runtime() { throw new Error("No chrome or browser runtime found") } } : { runtime: { getURL: x => x } }`
]

export default class AddPublicPathRuntimeModule {
  apply(compiler: Compiler) {
    const {RuntimeGlobals} = compiler.webpack

    compiler.hooks.compilation.tap('PublicPathRuntimeModule', (compilation) => {
      // @ts-expect-error cezaraugusto check this later
      compilation.hooks.runtimeRequirementInTree
        .for(RuntimeGlobals.publicPath)
        // @ts-expect-error cezaraugusto check this later
        .tap(AddPublicPathRuntimeModule.name, (chunk) => {
          const module = PublicPathRuntimeModule()
          // @ts-expect-error cezaraugusto check this later
          compilation.addRuntimeModule(chunk, module)

          return true
        })
    })
  }
}

function PublicPathRuntimeModule() {
  class PublicPathRuntimeModule extends RuntimeModule {
    constructor() {
      super('publicPath', RuntimeModule.STAGE_BASIC)
    }

    generate() {
      // @ts-expect-error cezaraugusto check this later
      const publicPath = this.compilation?.outputOptions.publicPath

      return Template.asString([
        ...weakRuntimeCheck,
        `var path = ${JSON.stringify(
          // @ts-expect-error cezaraugusto check this later
          this.compilation?.getPath(publicPath || '', {
            // @ts-expect-error cezaraugusto check this later
            hash: this.compilation.hash || 'XXXX'
          })
        )}`,
        `${RuntimeGlobals.publicPath} = typeof importScripts === 'function' || !(isBrowser || isChrome) ? path : runtime.runtime.getURL(path);`
      ])
    }
  }

  return new PublicPathRuntimeModule()
}
