var test = require('tape')
var fs = require('fs')
var bl = require('bl')
var browserify = require('browserify')
var join = require('path').join
var dto = require('directory-to-object')
var rimraf = require('rimraf')
var parallel = require('run-parallel')

test('basic transform', function (t) {
  var fixturesDir = join(__dirname, 'fixtures')

  rimraf.sync(join(fixturesDir, 'css-out', '*.css'))

  t.plan(7)

  browserify({
    entries: [join(__dirname, 'fixtures', 'input.js')],
    transform: [
      [require('../'), { directory: join(fixturesDir, 'css-out') }]
    ]
  })
  .bundle()
  .pipe(bl(function (err, data) {
    t.error(err, 'no error bundling js')
    var actual = data.toString()
    var expectedPath = join(fixturesDir, 'expected-bundle.js')

    fs.readFile(expectedPath, 'utf8', function (err, expected) {
      if (err) { throw err }
      t.equal(actual, expected, 'actual bundled js matches expected.')
    })

    dto(fixturesDir, function (err, res) {
      if (err) { throw err }
      var expectedFiles = res['css-expected']
      var actualFiles = res['css-out'].filter(function (name) {
        return name !== '.gitkeep'
      })
      setEqual(t, actualFiles, expectedFiles)
      parallel(
        actualFiles.map(function (name) {
          return function (cb) {
            parallel([
              fs.readFile.bind(fs, join(fixturesDir, 'css-out', name), 'utf8'),
              fs.readFile.bind(fs, join(fixturesDir, 'css-expected', name), 'utf8')
            ], function (err, result) {
              if (err) { throw err }
              var actual = result[0]
              var expected = result[1]
              t.equal(actual, expected, 'extracted css matches expected.')
            })
          }
        })
      )
    })
  }))
})

function setEqual (t, a, b) {
  t.equal(a.length, b.length)
  for (var i = 0; i < a.length; i++) {
    t.ok(b.indexOf(a[i]) !== -1)
  }
}
