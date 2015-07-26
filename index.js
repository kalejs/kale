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
  .action(function(generator, name) {
    name = s.underscored(name);

    switch (generator) {
      case 'controller':
        generators.controller(name);
        break;
      case 'model':
        generators.model(name);
        break;
      case 'scaffold':
        generators.scaffold(name);
        break;
      case 'migration':
        generators.migration(name);
        break;
      default:
        console.log(`Unknown generator ${generator}`);
        process.exit(1);
    }
  });

program.parse(process.argv);
