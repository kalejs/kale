#! /usr/bin/env node

'use strict';

var generators = require('./generators');
var program = require('commander');
var s = require('underscore.string');

program
  .command('new <NAME>')
  .description('Generate a new kale app with a default directory structure and configuration')
  .action(generators.app);

program
  .command('generate <GENERATOR> <NAME>')
  .usage('<controller|model|scaffold|migration> <NAME>')
  .description('Generate a new model, controller, scaffold, or migration for a Kale.js app')
  .option('-e, --empty', 'generate the file, but do not include any content')
  .action(function(generator, name, options) {
    name = s.underscored(name);

    switch (generator) {
      case 'controller':
        generators.controller(name, options);
        break;
      case 'model':
        generators.model(name, options);
        break;
      case 'scaffold':
        generators.scaffold(name, options);
        break;
      case 'migration':
        generators.migration(name, options);
        break;
      default:
        console.log(`Unknown generator ${generator}`);
        process.exit(1);
    }
  });

program.parse(process.argv);
