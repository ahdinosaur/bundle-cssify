# bundle-cssify

[![stability][stability-image]][stability-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

**superseded by [`css-extract`](https://github.com/stackcss/css-extract)**

browserify transform to extract css for `insert-css` into external css files

## what?

given a file like

```js
// entry.js
var insertCss = require('insert-css')
insertCss('h1 {\n  text-align: center;\n}')
console.log("rainbows and sunshine")
```

transform into

```js
// bundle.js
console.log("rainbows and sunshine")
```

and

```css
/* css/86bffed652227c2fc7321a8a.css */
h1 {
  text-align: center;
}
```

where each extracted css file will be named by the hash of its content.

## install

with [`npm`](https://www.npmjs.com):

```shell
npm install --save bundle-cssify
```

## usage

### cli

as a normal browserify transform:

```shell
browserify entry.js -t [ bundle-cssify -d ./css ] > bundle.js
```

replace `-t` with `-g` to run as a global transform (where "the transform will operate on ALL files, despite whether they exist up a level in a `node_modules/` directory")

### package.json

as a normal browserify transform:

```json
{
  "scripts": {
    "build": "browserify entry.js > bundle.js"
  },
  "browserify": {
    "transform": [
      ["bundle-cssify", { "directory": "./css" } ]
    ]
  }
}
```

[stability-image]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[stability-url]: https://nodejs.org/api/documentation.html#documentation_stability_index
[npm-image]: https://img.shields.io/npm/v/bundle-cssify.svg?style=flat-square
[npm-url]: https://npmjs.org/package/bundle-cssify
[downloads-image]: http://img.shields.io/npm/dm/bundle-cssify.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/bundle-cssify
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
