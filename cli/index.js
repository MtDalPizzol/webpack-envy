#!/usr/bin/env node

const prog = require('caporal')
const createCmd = require('./lib/create')

prog
  .version('1.0.0')
  .command('create', 'Create the configuration file structure.')
  .option('--preset <preset>', 'Which preset to use for the structure.')
  .action(createCmd)

prog.parse(process.argv)
