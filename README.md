# bundle-cssify

browserify transform to bundle content for `insert-css` into a css file

## install

with [`npm`](https://www.npmjs.com):

```shell
npm install --save bundle-cssify
```

## usage

### cli

as a normal browserify transform:

```shell
browserify entry.js -t [ bundle-cssify -o ./bundle.css ]
```

replace `-t` with `-g` to run as a global transform (where "the transform will operate on ALL files, despite whether they exist up a level in a `node_modules/` directory")

### package.json

as a normal browserify transform:

```json
{
  "browserify": {
    "transform": [
      ["bundle-cssify", { "output": "./bundle.css" } ]
    ]
  }
}
```
