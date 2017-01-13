#!/usr/bin/env node
exec = require('child_process').exec;

var async = require('async');

//var lfsfiles = exec("")

exec("git lfs ls-files | awk '{print $3}'", (er, stdout, stderr) => {
  if (er) {
  	console.error(er)
    return process.exit(1);
  }

  var lfsfiles = stdout.trim().split(/\r?\n/);

  var tasks = {};
  lfsfiles.forEach(function (lfsfile) {
    //console.log(lfsfile);

    tasks[lfsfile] = function (cb) {
      exec(`git show HEAD:${lfsfile}`, (er, stdout, stderr) => {
        if (er) return cb(er);

        var lines = stdout.trim().split(/\r?\n/);

        var oid = lines[1].split(':')[1];
        var size = lines[2].split('size ')[1];

        cb(null, {
          oid: oid,
          size: size
        });
      });
    };
	});

  async.series(tasks, function (er, results) {
    if (er) {
      console.error(er);
      return process.exit(1);
    }

    console.log(JSON.stringify(results, null, 2)); // null, 2 to indent with 2 spaces
  });
});