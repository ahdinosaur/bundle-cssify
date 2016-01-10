var staticModule = require('static-module')
var stream = require('readable-stream')
var path = require('path')
var fs = require('fs')
var resolve = require('resolve')
var pump = require('pump')
var fromString = require('from2-string')

module.exports = transform

function transform (filename, options) {
  var basedir = path.dirname(filename)
  var vars = {
    __filename: filename,
    __dirname: basedir,
    require: { resolve: resolver }
  }

  options = options || {}

  var output = options.output || options.out || options.o
  if (output == null) {
    throw new Error('bundle-css: expected `output`, `out`, or `o` option.')
  }

  if (options.vars) {
    Object.keys(options.vars).forEach(function (key) {
      vars[key] = options.vars[key]
    })
  }

  var sm = staticModule(
    { 'insert-css': staticInsertCss },
    { vars: vars, varModules: { path: path } }
  )

  return sm

  function staticInsertCss (css, cssOptions) {
    cssOptions = cssOptions || {}
    cssOptions.basedir = cssOptions.basedir || basedir

    var pts = stream.PassThrough()
    var cssStream = fromString(css)
    var outStream = output
    if (typeof outStream === 'string') {
      outStream = fs.createWriteStream(
        path.join(process.cwd(), output)
      )
    }

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
