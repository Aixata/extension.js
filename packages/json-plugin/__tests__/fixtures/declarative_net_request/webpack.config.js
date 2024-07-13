const path = require('path')
const rspack = require('@rspack/core')
const JsonPlugin = require('../../../dist/module').default

/** @type {rspack.Configuration} */
const config = {
  devtool: 'cheap-source-map',
  mode: 'development',
  entry: {},
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new JsonPlugin({
      manifestPath: path.join(__dirname, './manifest.json'),
      exclude: [path.join(__dirname, 'public', 'public_ruleset.json')]
    })
  ]
}

module.exports = config
