const path = require('path')
const _ = require('lodash')
const merge = require('webpack-merge')

class WebpackEnvy {
  constructor (options) {
    this.defaults = {
      path: './config',
      filename: 'webpack.[env].js',
      commonEnvId: 'common',
      env: null,
      root: process.cwd(),
      verbose: false
    }

    this.settings = _.merge({}, this.defaults, options)
    this.configDir = path.resolve(this.settings.root, this.settings.path)
    this.placeholder = '[env]'
  }

  getConfig () {
    return (env) => {
      if (!this.settings.env) {
        this.settings.env = env
      }

      if (_.isString(this.settings.env)) {
        this.settings.env = {
          id: this.settings.env
        }
      }

      if (_.isPlainObject(this.settings.env) && !this.settings.env.id) {
        this.settings.env.id = process.env.NODE_ENV || 'development'
      }

      if (!_.isPlainObject(this.settings.env)) {
        throw new Error('webpack-envy: Please, provide a valid "env" option.')
      }

      if (this.settings.verbose) {
        console.log('webpack-envy: running for ' + this.settings.env.id + ' environment.')
      }

      const commonConfigFile = path.resolve(this.configDir, this.settings.filename.replace(this.placeholder, this.settings.commonEnvId))
      const envConfigFile = path.resolve(this.configDir, this.settings.filename.replace(this.placeholder, this.settings.env.id))

      this.commonConfig = require(commonConfigFile)
      this.envConfig = require(envConfigFile)

      this.config = merge(
        this.commonConfig(this.settings),
        this.envConfig(this.settings)
      )

      return this.config
    }
  }
}

module.exports = WebpackEnvy
