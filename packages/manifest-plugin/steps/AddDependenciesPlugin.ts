import fs from 'fs'
import {type Compiler} from '@rspack/core'

export default class AddDependenciesPlugin {
  private readonly dependencyList: string[]

  constructor(dependencyList: string[]) {
    this.dependencyList = dependencyList
  }

  apply(compiler: Compiler): void {
    compiler.hooks.afterCompile.tap(
      'ManifestPlugin (AddDependenciesPlugin)',
      (compilation) => {
        if (compilation.errors?.length) return

        const fileDependencies = new Set(compilation.fileDependencies)

        if (this.dependencyList) {
          this.dependencyList.forEach((dependency) => {
            if (!fs.existsSync(dependency)) return

            if (!fileDependencies.has(dependency)) {
              fileDependencies.add(dependency)
              compilation.fileDependencies.add(dependency)
            }
          })
        }
      }
    )
  }
}
