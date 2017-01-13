var express = require('express')
var app = express()

var p = require('path');

var oids = require('./oids.json');
var request = require("request");

var PUBLICPATH = p.join(__dirname, 'public');

var cache = {};

// http://stackoverflow.com/questions/39118884/intercept-request-for-a-static-file-in-express-js
app.use(function (req, res, next) {
  console.log('lfs', req.path);

  var path = 'public' + req.path;

  //var relativePath = p.relative(__dirname, path);
  var relativePath = path;
  console.log(relativePath);

  if (relativePath in oids) {
    console.log('LFS file', relativePath, oids[relativePath]);

    var oid = oids[relativePath].oid;
    var size = +oids[relativePath].size;

    // once href retrieved
    function pipe(href) {
      request.get(href).pipe(res).on('error', next);
    }

    if (oid in cache && (new Date(cache[oid].expires_at) > new Date())) {
      console.log('IN cache', cache[oid]);
      // In cache and still valid
      pipe(cache[oid].href);
    } else {
      // Not in cache or expired

      // https://github.com/git-lfs/git-lfs/blob/v1.5.5/docs/api/batch.md
      request({
        url: "https://github.com/goodenough/express-lfs.git/info/lfs/objects/batch",
        method: 'POST',
        json: true,
        headers: {
          'Accept': 'application/vnd.git-lfs+json',
          'Content-Type': 'application/vnd.git-lfs+json'
        },
        body: {
          "operation": "download",
          "transfers": ["basic"],
          "objects": [{
              "oid": oid,
              "size": size
          }]
        }
      }, function (er, resp, data) {
        // Error
        if (er || (resp && resp.statusCode >= 400) || data && data.objects[0].error) {
          er || (er = new Error(JSON.stringify(data)));
          er.status = resp && resp.statusCode;

          return next(er);
        }

        var href = data.objects[0].actions.download.href;
        var expires_at = data.objects[0].actions.download.expires_at;

        cache[oid] = {
          href: href,
          expires_at: expires_at
        };

        pipe(href);
      });
    }
  } else {
    next();
  }
})

/*app.use(express.static(PUBLICPATH, {
	setHeaders: function (res, path, stat) {
  	//console.log('setHeaders', arguments);
	}
}))*/

app.get('/', function (req, res) {
  res.send('Hello World!!')
})

app.get('/test', function (req, res) {
  res.send('Hello test World!!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})