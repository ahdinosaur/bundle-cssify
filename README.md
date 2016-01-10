# bundle-cssify

browserify transform to bundle content for `insert-css` into a css file

## what?

given a file like

```
// entry.js
var insertCss = require('insert-css')
insertCss('h1 {\n  text-align: center;\n}')
console.log("rainbows and sunshine")
```

transform into

```css
/* bundle.css */
h1 {
  text-align: center;
}
```

```js
// bundle.js
console.log("rainbows and sunshine")
```

## install

with [`npm`](https://www.npmjs.com):

```shell
npm install --save bundle-cssify
```

## usage

### cli

as a normal browserify transform:

```shell
browserify entry.js -t [ bundle-cssify -o ./bundle.css ] > bundle.js
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
      ["bundle-cssify", { "output": "./bundle.css" } ]
    ]
  }
}
```
