#!/usr/bin/env node

'use strict';

var gbfy     = require('../')
  , log = require('npmlog')
  , minimist = require('minimist')
  , path     = require('path')
  , fs       = require('fs')

function usage() {
  var usageFile = path.join(__dirname, 'usage.txt');
  fs.createReadStream(usageFile).pipe(process.stdout);
  return;
}

(function () {

var argv = minimist(process.argv.slice(2)
  , { boolean: [ 'h', 'help' ]
    , string: [ 'loglevel', 'l', 'outdir', 'o' ]
  });

argv.loglevel = argv.loglevel || argv.l || 'info';

if (argv.h || argv.help) return usage();

var outdir = argv.outdir || argv.o;
if (!outdir) {
  log.error('docme', 'Missing outdir!');
  return usage();
}

var md_file = argv._.shift();
if (!md_file) {
  log.error('docme', 'Missing input file!');
  return usage();
}

gbfy(md_file, outdir, function (err) {
  if (err) return log.error('gitbookify', err);
  log.info('gitbookify', 'Everything is OK');
})

})()

