'use strict';
/*jshint asi: true */

var test = require('tap').test
  , fs = require('fs')
  , gbfy = require('../')
  , rmrf = require('rimraf')
  , slides

var tgt = __dirname + '/results/addon-slides';
rmrf.sync(tgt)
var file = __dirname + '/fixtures/addon-slides.md';

test('\ndeserialize', function (t) {
  var md = fs.readFileSync(file, 'utf8');
  slides = gbfy.deserialize(md);
  t.deepEqual(
      slides
    , [ { chapter: 'what_is_a_node_js_addon_',
          header: 'What Is a Node.js Addon?',
          content:
          [ '# What Is a Node.js Addon?',
            '',
            '- any library that needs to access C/C++ functionality',
            '' ] },
        { chapter: 'what_is_a_node_js_addon_',
          header: 'What Is a Node.js Addon?',
          content:
          [ '# What Is a Node.js Addon?',
            '',
            '- Node.js itself works like an addon',
            '- ???',
            '' ] },
        { chapter: 'looking_at_node_js',
          header: 'Looking at Node.js',
          content:
          [ '# Looking at Node.js',
            '',
            '- embedds v8 to *run* JavaScript',
            '- calls out to **libuv** to handle system calls',
            '- additional libraries used for other tasks, i.e. **http-parser**',
            '' ] },
        { chapter: 'fs_module',
          header: 'fs module',
          content:
          [ '# fs module',
            '',
            '- `/lib/fs.js` *binds* `/src/file.cc`',
            '' ] },
        { chapter: 'fs_module',
          header: 'fs module',
          content:
          [ '# fs module',
            '',
            '```js',
            '// fs.js',
            'var binding = process.binding(\'fs\');',
            '```',
            '' ] },
        { chapter: 'fs_module',
          header: 'fs module',
          content:
          [ '# fs module',
            '',
            '- allows creating \'fs\' object in JavaScript land with methods like `readdir`',
            '- calling `fs.readdir` calls C++ `ReadDir` passing along JS parameters in `args` array',
            '' ] } ]
    , 'correctly deserializes slides'
  )
  t.end()
})

test('\nsummary', function (t) {
  var summary = gbfy.createSummary(slides)
  t.deepEqual(
      summary
    , [ ' * [What Is a Node.js Addon?](what_is_a_node_js_addon_/what_is_a_node_js_addon__0.md)',
        '    * [What Is a Node.js Addon? 1](what_is_a_node_js_addon_/what_is_a_node_js_addon__1.md)',
        ' * [Looking at Node.js](looking_at_node_js/looking_at_node_js_0.md)',
        ' * [fs module](fs_module/fs_module_0.md)',
        '    * [fs module 1](fs_module/fs_module_1.md)',
        '    * [fs module 2](fs_module/fs_module_2.md)' ] 
    , 'creates correct summary'
  )
  t.end()
})

test('\ngitbookify', function (t) {
  gbfy(file, tgt, function (err) {
    if (err) return console.error(err);

    [ 'fs_module/fs_module_0.md'
    , 'fs_module/fs_module_1.md'
    , 'fs_module/fs_module_2.md'
    , 'looking_at_node_js/looking_at_node_js_0.md'
    , 'what_is_a_node_js_addon_/what_is_a_node_js_addon__0.md'
    , 'what_is_a_node_js_addon_/what_is_a_node_js_addon__1.md'
    , 'README.md'
    , 'SUMMARY.md'
    ].forEach(function (x) {
      t.ok(fs.existsSync(tgt + '/' + x), 'creates ' + x)
    })
    t.end()    
  })
})
