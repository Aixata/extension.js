const path = require('path')
const rspack = require('@rspack/core')
const ScriptsPlugin = require('../../../dist/module').default

/** @type {rspack.Configuration} */
const config = {
  devtool: 'cheap-source-map',
  mode: 'development',
  entry: {},
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  context: path.resolve(__dirname),
  experiments: {
    css: true
  },
  plugins: [
    new ScriptsPlugin({
      manifestPath: path.join(__dirname, './manifest.json')
    })
  ]
}

module.exports = config
