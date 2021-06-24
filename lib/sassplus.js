const stylelint = require('stylelint');
const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const CleanCSS = require('clean-css');
const {PurgeCSS} = require('purgecss');

async function process(style, config) {
  // Config can't be undefined
  if (!config) {
    config = {};
  }

  const {lint = true, prefix = true, clean = false, minify = true} = config;
  let linted = false;

  // Lint if enabled
  if (lint !== false) {
    linted = await stylelint.lint({config: {extends: ['stylelint-config-recommended', 'stylelint-config-sass-guidelines']}, code: style});
  }

  // Compile the SCSS
  // Using renderSync() because of performance -- might revisit this later
  ({css: currentCSS} = sass.renderSync({data: style, includePaths: ['node_modules'], sourceMapEmbed: true}));

  // Prefix if enabled
  if (prefix !== false) {
    ({css: currentCSS} = await postcss([autoprefixer]).process(currentCSS, {from: undefined}));
  }

  // Clean if enabled
  if (clean !== false) {
    ([{css: currentCSS}] = await new PurgeCSS().purge({css: [{raw: currentCSS}], content: ['test.html']}));
  }

  // Minify if enabled
  if (minify !== false) {
    ({styles: currentCSS} = await new CleanCSS({returnPromise: true}).minify(currentCSS));
  }

  return {
    css: currentCSS,
    lint: linted.results[0].warnings,
  };
}

module.exports = process;
