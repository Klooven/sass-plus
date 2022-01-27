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

  const {lint = true, prefix = true, clean = false, minify = true, _sassInclude = []} = config;

  let lintWarnings = [];

  // Lint if enabled
  if (lint !== false) {
    try {
      ({results: [{warnings: lintWarnings}]} = await stylelint.lint({config: {extends: ['stylelint-config-standard-scss']}, code: style}));
    } catch {
      throw new Error('Linting failed');
    }
  }

  let currentCSS = '';

  // Compile the SCSS
  // Using synchronous compileString() because of performance -- might revisit this later
  try {
    ({css: currentCSS} = sass.compileString(style, {loadPaths: ['node_modules', ..._sassInclude]}));
  } catch {
    throw new Error('Sass compilation failed');
  }

  // Prefix if enabled
  if (prefix !== false) {
    try {
      ({css: currentCSS} = await postcss([autoprefixer]).process(currentCSS, {from: undefined}));
    } catch {
      throw new Error('CSS prefixing failed');
    }
  }

  // Clean if enabled
  if (clean !== false) {
    try {
      const {content, safelist} = clean;
      ([{css: currentCSS}] = await new PurgeCSS().purge({css: [{raw: currentCSS}], content, safelist}));
    } catch {
      throw new Error('CSS cleaning failed');
    }
  }

  // Minify if enabled
  if (minify !== false) {
    try {
      ({styles: currentCSS} = await new CleanCSS({returnPromise: true}).minify(currentCSS));
    } catch {
      throw new Error('CSS minification failed');
    }
  }

  return {
    css: currentCSS,
    lint: lintWarnings,
  };
}

module.exports = process;
