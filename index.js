var fs = require('fs');
var p = require('path');

var _ = require('underscore');
var request = require('request');

var url = require('url');

var mime = require('mime');

module.exports = function (batchapi, options) {
  options || (options = {});
  _.defaults(options, {
    publicpath: 'public',
    oids: {},
    cache: false,
    setHeaders: undefined
  });
  console.log('lfs options', options)


  // href
  var cache = {
    // 'public/foo.txt': {
    //   href: '',
    //   expires_at: ''
    // }
  };

  // Extract auth from batchapi url
  var auth;
  batchapi = url.parse(batchapi);
  if (batchapi.auth) {
    auth = batchapi.auth.split(':')
    batchapi.auth = null;
  }
  batchapi = url.format(batchapi);

  //
  // Git LFS Batch API
  // https://github.com/git-lfs/git-lfs/blob/v1.5.5/docs/api/batch.md
  //
  function api(body, cb) {
    var opts = {
      //proxy: 'http://localhost:8888',
      url: batchapi,
      method: 'POST',
      json: true,
      headers: {
        'Accept': 'application/vnd.git-lfs+json',
        'Content-Type': 'application/vnd.git-lfs+json'
      },
      body: body
    };

    if (auth) {
      opts.auth = {
        user: auth[0],
        pass: auth[1]
      }
    }

    request(opts, function (er, resp, data) {
      // Error
      if (er || (resp && resp.statusCode >= 400) || (data && data.objects && data.objects[0] && data.objects[0].error)) {
        er || (er = new Error(JSON.stringify(data)));
        er.status = resp && resp.statusCode;

        return cb(er);
      }

      cb(null, data);
    });
  }

  return function middleware(req, res, next) {
    console.log('lfs middleware', req.path);

    var path = options.publicpath + req.path;

    var oids = options.oids;

    //var relativePath = p.relative(__dirname, path);
    var relativePath = path;
    console.log('relativePath', relativePath);

    if (!(relativePath in oids)) return next();

    console.log('LFS file', relativePath, oids[relativePath]);

    var oid = oids[relativePath].oid;
    var size = +oids[relativePath].size;

    // https://github.com/request/request/tree/v2.79.1#streaming
    function pipe(url) {
      console.log(`GET ${url}`);

      request.get(url)
        .on('error', function (er) {next(er);})
        .on('response', function (response) {
          console.log('on response');

          var contentType = mime.lookup(relativePath);
          response.headers['content-type'] = contentType;

          // TODO: setHeaders
        })
        .pipe(res);
    }

    if (options.cache && (oid in cache) && (new Date(cache[oid].expires_at) > new Date())) {
      console.log('IN cache', cache[oid]);
      // In cache and still valid
      pipe(cache[oid].href);
    } else {
      // Not in cache or expired

      //
      // Retrieve object URL from its oid/size
      //
      api({
        "operation": "download",
        "transfers": ["basic"],
        "objects": [{
          "oid": oid,
          "size": size
        }]
      }, function (er, data) {
        var href = data.objects[0].actions.download.href;
        var expires_at = data.objects[0].actions.download.expires_at;

        // 
        cache[oid] = {
          href: href,
          expires_at: expires_at
        };

        pipe(href);
      })
    }  
  };
};