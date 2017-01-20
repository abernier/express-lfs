var express = require('express')
var app = express()

var p = require('path');

var PUBLICPATH = p.join(__dirname, 'public');

var cache = {};

// http://stackoverflow.com/questions/39118884/intercept-request-for-a-static-file-in-express-js
var staticlfs = require('./index');
app.use(staticlfs('public', {
  oids: require('./oids.json')
}))

/*app.use(express.static(PUBLICPATH, {
	setHeaders: function (res, path, stat) {
  	//console.log('setHeaders', arguments);
	}
}))*/

app.get('/', function (req, res) {
  res.send('Hello World!!')
})

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port '+port+'!')
})