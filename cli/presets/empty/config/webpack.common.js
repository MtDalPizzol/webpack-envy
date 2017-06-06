const path = require('path')

module.exports = (settings) => {
  return {
    entry: {
      'bundle': path.resolve(settings.root, 'src', 'index.js')
    },
    output: {
      path: path.resolve(settings.root, 'dist'),
      filename: '[name].[chunkhash].js'
    }
  }
}
