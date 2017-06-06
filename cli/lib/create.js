const path = require('path')
const fs = require('fs')
const shell = require('shelljs')

module.exports = (args, options, logger) => {
  const preset = options.preset || 'empty'
  const presetPath = path.resolve(__dirname, '../presets/', preset)
  const destPath = process.cwd()

  if (fs.existsSync(presetPath)) {
    logger.info('Copying files…')
    shell.cp('-R', `${presetPath}/*`, destPath)
    logger.info('Configuration structure created!')
  } else {
    logger.error(`The "${preset}" preset wasn't found.`)
    process.exit(1)
  }
}
