# sass-plus
> Sass + a little bit more

**WIP! Some features are missing and some might not work as expected.**

`sass-plus` is a convenient CLI tool for quickly generating CSS from SCSS. In addition to the "generic" Sass-compiler, `sass-plus` enables the following automatically (in exchange for opinionated defaults):

- Linting of your SCSS (stylelint)
- CSS vendor prefixing (autoprefixer)
- Minification of the generated CSS (clean-css)

And with a couple of lines of config you may also enable:

- PurgeCSS, which removes styles that are unused

## Usage

Install it locally (development dependency)...
```bash
npm i sass-plus -D
```

Or use with NPX...
```bash
npx sass-plus
```

...and use the following parameters:
```
-i or --input       Input file path
-o or --output      Output file path
-c or --config      Use config (see below for details)
-p or --production  Force production mode
```

### Examples

Compile using default options
```bash
sass-plus -i sass/styles.scss -o build/styles.css
```

Compile and use config
```bash
sass-plus -i sass/styles.scss -o build/styles.css -c
```

### Production mode

Production mode can be enabled with the `--production` flag, or by using either the `CI=true` or the `NODE_ENV=production` environment variable. In this mode lint errors will always cause `sass-plus` to exit with code 1 in production === show as an error in CI.

## Advanced configuration

Configuration is not needed to run `sass-plus`! You can, though, adapt the tool to your needs by creating a config file called `.sassplusrc`. It will be parsed using cosmiconfig, so feel free to use YAML, JSON, or any of the other supported config formats.

These are the defaults when running `sass-plus`:

```json
{
  "lint": true,
  "prefix": true,
  "clean": false,
  "minify": true
}
```

- `lint` can be set to `true` (enabled) or `false` (disabled)
- `prefix` can be set to `true` (enabled) or `false` (disabled)
- `clean` can be set to `false` (disabled) or an object with the `content` (required), `safelist`, `fontFace`, `keyframes`, and `variables` [options](https://purgecss.com/configuration.html#options) from PurgeCSS
- `minify` can be set to `true` (enabled) or `false` (disabled)

## Programmatic API

This package also exports a promise-based simple API that is configurable with the same options as mentioned above. The input and output styles are strings (the API doesn't access the filesystem).

```js
const sassplus = require('sass-plus');

// Get Sass as a string
let sass;

// Optionally, pass a config
const config = {};

// Let the magic happen
const {css, lint} = await sassplus(sass, config);

// Do something with the CSS
console.log(css);

// Do something with lint warnings
console.log(lint);
```

## Roadmap

- Test and lint both API and CLI on supported platforms
- Support source map creation?

## Versioning and supported Node versions

While the major version is `0`, please expect breaking changes when minor bumps are made. We'll follow semver as the tool is bumped to `1.0.0`.

[Currently maintained](https://github.com/nodejs/Release#release-schedule) Node versions are supported.

## Questions?

Please feel free to use the issue tracker.
