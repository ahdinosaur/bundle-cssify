var staticModule = require('static-module')
var stream = require('readable-stream')
var path = require('path')
var fs = require('fs')
var resolve = require('resolve')
var pump = require('pump')
var fromString = require('from2-string')
var crypto = require('crypto')

module.exports = transform

function transform (filename, options) {
  var basedir = path.dirname(filename)
  var vars = {
    __filename: filename,
    __dirname: basedir,
    require: { resolve: resolver }
  }

  options = options || {}

  var directory = options.directory || options.dir || options.d
  if (directory == null) {
    throw new Error('bundle-css: expected `directory`, `dir`, or `d` option.')
  }
  directory = path.resolve(process.cwd(), directory)

  if (options.vars) {
    Object.keys(options.vars).forEach(function (key) {
      vars[key] = options.vars[key]
    })
  }

  var sm = staticModule(
    { 'insert-css': bundleCss },
    { vars: vars, varModules: { path: path } }
  )

  return sm

  function bundleCss (css, cssOptions) {
    cssOptions = cssOptions || {}

    var pts = stream.PassThrough()
    var cssStream = fromString(css)
    var outStream = fs.createWriteStream(
      path.join(directory, hash(css) + '.css')
    )

    pts.write('null')

    pump(cssStream, outStream)
    .on('error', function (err) { sm.emit('error', err) })
    .on('finish', function () {
      pts.end(null)
    })

    return pts
  }

  function resolver (p) {
    return resolve.sync(p, { basedir: path.dirname(filename) })
  }
}

function hash (content) {
  return crypto.createHash('md5')
    .update(content)
    .digest('hex')
    .slice(0, 24)
}
