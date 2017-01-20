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
  res.type('html').send(`
    <h1>expresslfs</h1>
    <h2>Serve your big files with git-lfs</h2>

    <p>For example that big one PSD: <a href="dirA/banner.psd">banner.psd</a> (~400Mo)</p>

    <p><em>Fork-me on <a href="https://github.com/goodenough/express-lfs">Github</a></em></p>
  `)
})

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port '+port+'!')
})