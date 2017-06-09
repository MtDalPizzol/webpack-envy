# Webpack Envy
> An organizer for your Webpack configurations.

This is a simple utility that prevents your Webpack configurations from turning into a complex and confusing box of `if` statements. It organizes your settings by environment and delivers a full configuration object using [webpack-merge](https://github.com/survivejs/webpack-merge).

This module is inspired by the ideas explained by [Juho Vepsäläinen](https://github.com/bebraw) in his [webpack book](https://survivejs.com/webpack/preface/), more specifically in the [Composing Configuration](https://survivejs.com/webpack/developing/composing-configuration/) chapter.

## Installation

```bash
# Using Yarn
$ yarn add webpack-envy --dev

# Using NPM
$ npm install webpack-envy --save-dev
```

## What does it do for you?

**If you're starting fresh**, Webpack Envy CLI can create the following folder structure and wire it all up so you can focus on writing your configuration instead of organizing it.

```bash
$ ./node_modules/.bin/webpack-envy create
```
    .
    ├── config                        # Holds project configuration files
    │   ├── webpack.common.js         # Common configs shared across all environments
    │   ├── webpack.development.js    # Development specific configs
    │   ├── webpack.production.js     # Production specific configs
    ├── dist                          # Holds the built files for distribution
    ├── src                           # Holds the application source code
    │   ├── index.js                  # Application entry point
    ├── webpack.config.js             # Entry point config file picked up by Webpack

## Already have the project structured?

Using the CLI **isn't** mandatory. If you want/need to use a different folder structure, you can use the Webpack Envy lib to wire up your configurations manually and change it in whatever way you want.

In your `webpack.config.js`:
```javascript
const WebpackEnvy = require('webpack-envy')

const envy = new WebpackEnvy({ /* options */ })

module.exports = envy.getConfig()
```

## Options
| Key  | Description | Default
| ------------- | ------------- | ----- |
| path| Directory where your config files will be placed. Relative to the *root* option. | './config' |
| filename | The pattern for looking up config files into the configuration directory. | 'webpack.[env].js' |
| commonEnvId | A string to use as the identifier for configs shared across all environments | 'common' |
| root  | Directory where you run webpack. You can explicit set this if you're having trouble for whatever reason. | `process.cwd()`|
| env  | A `String` with the environment id (name) or an `Object`. If not set, it will look at `process.env.NODE_ENV` and use that string. If that also isn't set, it will default to 'development'. You'll olny need this if you have some complex logic to determine your environment before calling Webpack Envy. | `process.env.NODE_ENV` fallback to 'development' |
| verbose  | Outputs Webpack Envy information to the console when running webpack | false |

## Example

If you have the following folder structure:

    .
    ├── settings              # Holds project configuration files
    │   ├── development.js    # Development specific configs
    │   ├── production.js     # Production specific configs
    │   ├── shared.js         # Common configs shared across all environments
    ├── webpack.config.js     # Entry point config file picked up by Webpack

Then your `webpack.config.js` will look like this:

```javascript
const WebpackEnvy = require('webpack-envy')

const envy = new WebpackEnvy({
  path: './settings',
  filename: '[env].js',
  commonEnvId: 'shared'
})

module.exports = envy.getConfig()
```
## How should I set the environment?

I recommend you to use the `--env` option of the `webpack` CLI in the `scripts` property of your `package.json`, passing `--env environment` for each command you specify. For example:

```javascript
  "scripts": {
    "start": "webpack-dev-server --env development",
    "build": "webpack --env production -p",
    "stats": "webpack --env.id production --env.stats true -p"
  }
```

## What is up with `--env.id production --env.stats true`?

**This is a Webpack feature** and it will parse this dot notation to an `Object`. This way you aren't limited to a simple `String` and will be able to pass custom params to your config, if needed.

In your config files, `--env.id production --env.stats true` will turn into:    
```javascript
  console.log(settings.env);

  // {
  //   id: 'production',
  //   stats: true
  // }
```

## What if I need to set my environment programmatically?

You can determine your environment using the Webpack Envy `env` option. If you go this way,  Webpack's CLI `--env` will be ignored. You can pass this a `String` or an `Object`.

If you go with an object, **it must have an `id` property** which will be used as the environment identifier. If `id` isn't present, Webpack Envy will look at `process.env.NODE_ENV` and if this also isn't set, it will default to `'development'`.

If you pass a `String`, internally,  Webpack Envy will use this string as the `id` property of the `env` object.

```javascript
let environment = myComplexEnvironmentGetter(); // return 'production'

const envy = new WebpackEnvy({
  env: environment
})

// Then, you can access the string in your config files, for example:
if (settings.env.id === 'production') {
  // production specifics
}
```

```javascript
let environment = myComplexEnvironmentGetter(); // return 'production'

const envy = new WebpackEnvy({
  env: {
    id: environment,
    customParam1: '1',
    customParam2: '2'
  }
})

// Then, you can access all properties in your config files like this:
console.log(settings.env.id); // production
console.log(settings.env.customParam1); // 1
console.log(settings.env.customParam2); // 2
```

## Can I have additional environments?

Of course you can. All you have to do is:

  * Create an environment file under your config directory matching the environment id. For example:    


    .
    ├── config
    │   ├── webpack.mynewenv.js

  * Pass the environment id to the
  initialization.

```javascript
  "scripts": {
    "my:task": "webpack --env mynewenv"  
  }
```

## Where should I put my Webpack configurations on this thing?

Each file in the configuration directory exports a function that receives the settings from Webpack Envy and returns an object with specific portions of a full Webpack configuration object. Webpack Envy then merges this objects together - according to the environment you're running - to produce the full Webpack configuration object. Here's an example:

**./config/webpack.common.js**
```javascript
const path = require('path')
const Html = require('html-webpack-plugin')
const ExtractText = require('extract-text-webpack-plugin')

module.exports = function (settings) {
  return {
    entry: {
      'bundle': path.resolve(settings.root, 'src', 'index.js')
    },
    output: {
      path: path.resolve(settings.root, 'dist'),
      filename: '[name].[chunkhash].js'
    },
    module: { ... },
    plugins: [
      new Html({
        template: path.resolve(settings.root, 'src', 'index.html')
      }),
      new ExtractText('styles.[chunkhash].css')
    ]
  }
}    
```

**./config/webpack.development.js**
```javascript
module.exports = function (settings) {
  return {
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      proxy: {
        '/': {
          target: 'http://localhost:8081/'
        }
      },
      overlay: {
        errors: true,
        warnings: true
      }
    }
  }
}
```

**./config/webpack.production.js**
```javascript
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = function (settings) {
  const config = {
    devtool: 'source-map',
    plugins: [
      new Clean(['./dist/*'], {
        root: settings.root
      })
    ]
  }

  if (settings.env.stats) {
    var BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

    config.plugins.push(
      new BundleAnalyzer({
        generateStatsFile: true
      })
    )
  }

  return config
}
```

## Changelog

Be aware of breaking changes, bug fixes and more. Take a look at our [**changelog**](/CHANGELOG.md) or the [**release notes**](https://github.com/MtDalPizzol/webpack-envy/releases).

## License

This software is provided free of charge and without restriction under the [MIT License](/LICENSE)
