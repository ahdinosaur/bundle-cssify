var test = require('tape')
var fs = require('fs')
var bl = require('bl')
var browserify = require('browserify')
var join = require('path').join
var stream = require('readable-stream')

test("basic transform", function (t) {
  var output = stream.PassThrough()

  t.plan(4)

  browserify({
    entries: [join(__dirname, 'fixtures', 'input.js')],
    transform: [
      [require('../'), { output: output }]
    ]
  })
  .bundle()
  .pipe(bl(function (err, data) {
    t.error(err, 'no error bundling js')
    var actual = data.toString()
    var expectedPath = join(__dirname, 'fixtures', 'expected-bundle.js')
    fs.readFile(expectedPath, 'utf8', function (err, expected) {
      if (err) { throw err }
      t.equal(actual, expected, 'actual bundled js matches expected.')
    })
  }))

  output
  .pipe(bl(function (err, data) {
    t.error(err, 'no error bundling css')
    var actual = data.toString()
    var expectedPath = join(__dirname, 'fixtures', 'expected-bundle.css')
    fs.readFile(expectedPath, 'utf8', function (err, expected) {
      if (err) { throw err }
      t.equal(actual, expected, 'actual bundled css matches expected.')
    })
  }))
})
