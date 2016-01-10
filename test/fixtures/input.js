var insertCss = require('insert-css')

insertCss('h1 {\n  text-align: center;\n}')

var h1 = document.createElement('h1')
document.body.appendChild(h1)
