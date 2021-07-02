#!/usr/bin/env node

const minimist = require('minimist');
const {cosmiconfig} = require('cosmiconfig');
const fs = require('fs-extra');
const sassplus = require('./sassplus');

const options = minimist(process.argv.slice(2), {alias: {i: 'input', o: 'output', c: 'config', p: 'production'}});
const explorer = cosmiconfig('sassplus');

(async () => {
  const {input, output, config} = options;
  const style = await fs.readFile(input, {encoding: 'utf-8'});

  let userConfig = {};

  if (config) {
    ({config: userConfig} = await explorer.search());
  }

  const transformed = await sassplus(style, userConfig);
  const {css, lint} = transformed;

  await fs.outputFile(output, css);

  console.log('✓ CSS created successfully');

  if (lint !== []) {
    console.log('⚠ Lint warnings:');

    lint.forEach(({text, line, column}) => {
      console.log(`  - ${text} on ${line}:${column}`);
    });
  }
})();
