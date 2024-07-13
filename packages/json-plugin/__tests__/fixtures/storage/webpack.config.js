const path = require('path')
const rspack = require('@rspack/core')
const Jsonlugin = require('../../../dist/module').default

/** @type {rspack.Configuration} */
const config = {
  devtool: 'cheap-source-map',
  mode: 'development',
  entry: {},
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new Jsonlugin({
      manifestPath: path.join(__dirname, './manifest.json'),
      exclude: [path.join(__dirname, 'public', 'schema.json')]
    })
  ]
}

module.exports = config
