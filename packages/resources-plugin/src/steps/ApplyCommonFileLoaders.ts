import {type Compiler} from '@rspack/core'
import {type WebResourcesPluginInterface} from '../../types'

export default class ApplyCommonFileLoaders {
  private readonly manifestPath: string

  constructor(options: WebResourcesPluginInterface) {
    this.manifestPath = options.manifestPath
  }

  private loaders() {
    const assetLoaders = [
      {
        test: /\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(txt|md|csv|tsv|xml|pdf|docx|doc|xls|xlsx|ppt|pptx|zip|gz|gzip|tgz)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(csv|tsv)$/i,
        use: ['csv-loader']
      }
    ]

    return assetLoaders
  }

  apply(compiler: Compiler) {
    const supportedLoaders = this.loaders()
    compiler.options.module?.rules.push(...supportedLoaders)
  }
}
