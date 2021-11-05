#!/usr/bin/env node

const minimist = require('minimist');
const {cosmiconfig} = require('cosmiconfig');
const fs = require('fs-extra');
const sassplus = require('./sassplus');

const options = minimist(process.argv.slice(2), {alias: {i: 'input', o: 'output', c: 'config', p: 'production'}});
const explorer = cosmiconfig('sassplus');

(async () => {
  const {input, output, config, production} = options;

  if (!input || !output) {
    return console.log('ℹ Check the docs to get started!');
  }

  let style = '';

  try {
    style = await fs.readFile(input, {encoding: 'utf-8'});
  } catch {
    process.exitCode = 1;
    return console.error('✕ CSS creation failed (could not read Sass)');
  }

  let userConfig = {};

  if (config) {
    try {
      ({config: userConfig} = await explorer.search());
    } catch {
      process.exitCode = 1;
      return console.error('✕ CSS creation failed (could not parse config)');
    }
  }

  let transformed = '';

  try {
    transformed = await sassplus(style, userConfig);
  } catch (error) {
    process.exitCode = 1;
    return console.error(`✕ CSS creation failed (${error})`);
  }

  const {css, lint} = transformed;

  try {
    await fs.outputFile(output, css);
  } catch {
    process.exitCode = 1;
    return console.error('✕ CSS creation failed (could not write CSS)');
  }

  console.log('✓ CSS created successfully');

  const errorOnLintWarning = production || process.env.CI === 'true' || process.env.NODE_ENV === 'production';

  if (lint.length !== 0) {
    if (errorOnLintWarning === true) {
      process.exitCode = 1;
    }

    console.log('⚠ Lint warnings:');

    lint.forEach(({text, line, column}) => {
      console.log(`  - ${text} on ${line}:${column}`);
    });
  }
})();
