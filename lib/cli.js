#!/usr/bin/env node

const minimist = require('minimist');
const {cosmiconfig} = require('cosmiconfig');
const fs = require('fs-extra');
const sassplus = require('./sassplus');

const options = minimist(process.argv.slice(2), {alias: {i: 'input', o: 'output', c: 'config', p: 'production'}});
const explorer = cosmiconfig('sassplus');

(async () => {
  const {input, output, config} = options;

  let style = '';

  try {
    style = await fs.readFile(input, {encoding: 'utf-8'});
  } catch {
    return console.error('✕ CSS creation failed (could not read Sass)');
  }

  let userConfig = {};

  if (config) {
    try {
      ({config: userConfig} = await explorer.search());
    } catch {
      return console.error('✕ CSS creation failed (could not parse config)');
    }
  }

  let transformed = '';

  try {
    transformed = await sassplus(style, userConfig);
  } catch (error) {
    return console.error(`✕ CSS creation failed (${error})`);
  }

  const {css, lint} = transformed;

  try {
    await fs.outputFile(output, css);
  } catch {
    return console.error('✕ CSS creation failed (could not write CSS)');
  }

  console.log('✓ CSS created successfully');

  if (lint.length !== 0) {
    console.log('⚠ Lint warnings:');

    lint.forEach(({text, line, column}) => {
      console.log(`  - ${text} on ${line}:${column}`);
    });
  }
})();
