var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

var p = require('path');

var PUBLICPATH = p.join(__dirname, 'public');
app.use(express.static(PUBLICPATH, {
	setHeaders: function (res, path, stat) {
  	//console.log('setHeaders', arguments);

  	console.log(p.relative(PUBLICPATH, path));
	}
}))
app.use('/public/:file', function (req, res, next) {
  console.log('file=', req.params.file)
  next()
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})