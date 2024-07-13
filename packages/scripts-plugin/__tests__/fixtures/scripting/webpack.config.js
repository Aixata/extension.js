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
  experiments: {
    css: true
  },
  plugins: [
    new ScriptsPlugin({
      manifestPath: path.join(__dirname, 'manifest.json'),
      include: [path.join(__dirname, 'scripts', 'content-script.js')],
      exclude: [
        path.join(__dirname, 'public', 'css', 'file.css'),
        path.join(__dirname, 'public', 'js', 'file.js'),
        path.join(__dirname, 'public', 'img', 'icon.png'),
        path.join(__dirname, 'public', 'html', 'file.html')
      ]
    })
  ]
}

module.exports = config
