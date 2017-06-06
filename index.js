const path = require('path')
const _ = require('lodash')
const merge = require('webpack-merge')

class WebpackEnvy {
  constructor (options) {
    this.defaults = {
      path: './config',
      filename: 'webpack.[env].js',
      commonEnvName: 'common',
      root: process.cwd(),
      env: process.env.NODE_ENV || 'development',
      verbose: false
    }

    this.settings = _.merge({}, this.defaults, options)
    this.dir = path.resolve(this.settings.root, this.settings.path)
    this.placeholder = '[env]'

    if (this.settings.verbose) {
      console.log('webpack-envy: running for ' + this.settings.env + ' environment.')
    }

    const commonConfigFile = path.resolve(this.dir, this.settings.filename.replace(this.placeholder, this.settings.commonEnvName))
    const envConfigFile = path.resolve(this.dir, this.settings.filename.replace(this.placeholder, this.settings.env))

    this.commonConfig = require(commonConfigFile)
    this.envConfig = require(envConfigFile)

    this.config = merge(
      this.commonConfig(this.settings),
      this.envConfig(this.settings)
    )
  }

  getConfig () {
    return this.config
  }
}

module.exports = WebpackEnvy
