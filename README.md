# Webpack Envy

    ** WARNING: THIS IS NOT A WEBPACK BOILERPLATE NOR A SCAFFOLDING TOOL **

This is a simple utility that prevents your Webpack configurations from turning into a complex and confusing box of "if" statements. It organizes your settings by environment and delivers a full configuration object using [webpack-merge](https://github.com/survivejs/webpack-merge).

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
$ webpack-envy create
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

In your **webpack.config.js**:
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
| commonEnvName | A string to use as the key/name for configs shared across all environments | 'common' |
| root  | Directory where you run webpack. You can explicit set this if you're having trouble for whatever reason. | process.cwd()|
| env  | A string with the environment name. If not set, it'll look at *process.env.NODE_ENV* and use that string. If that isn't set too, it will default to 'development'. You'll olny need this if you have some complex logic to determine your environment before calling Webpack Envy. | process.env.NODE_ENV or 'development' |
| verbose  | Outputs Webpack Envy information to the console when running webpack | false |

## Example

If you have the following file structure:

    .
    ├── settings              # Holds project configuration files
    │   ├── development.js    # Development specific configs
    │   ├── production.js     # Production specific configs
    │   ├── shared.js         # Common configs shared across all environments
    ├── webpack.config.js     # Entry point config file picked up by Webpack

Then your **webpack.config.js** will look like this:

```javascript
const WebpackEnvy = require('webpack-envy')

const envy = new WebpackEnvy({
  path: './settings',
  filename: '[env].js',
  commonEnvName: 'shared'
})

module.exports = envy.getConfig()
```
## How should I set the environment?

I recommend you to use the **scripts** property of your **package.json**, passing **NODE_ENV=environment** for each command you specify, for example:

```javascript
  "scripts": {
    "dev": "NODE_ENV=development webpack-dev-server",
    "stage": "NODE_ENV=stage webpack",
    "build": "NODE_ENV=production webpack -p"
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

    devServer: {
      proxy: {
        '/api': 'http://localhost:8081'
      }
    }

  }
}
```

**./config/webpack.production.js**
```javascript
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = function (settings) {
  return {

    plugins: [
      new CleanWebpackPlugin(['./dist/*'])
    ]

  }
}
```

## License

This software is provided free of charge and without restriction under the [MIT License](/LICENSE)
