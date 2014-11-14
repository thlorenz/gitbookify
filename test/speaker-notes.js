'use strict';
/*jshint asi: true */

var test = require('tap').test
  , fs = require('fs')
  , gbfy = require('../')

var file = __dirname + '/fixtures/speaker-notes.md';

test('\nactivate speaker notes for slide with notes', function (t) {
 
  var res = gbfy.activateSpeakerNotes(fs.readFileSync(file, 'utf8').split('\n'));

  t.deepEqual(
      res
    , [ '# What Is a Node.js Addon?',
        '',
        '- any library that needs to access C/C++ functionality',
        '',
        '<script>',
        'typeof console.clear === \'function\' && console.clear()',
        'console.log(',
        'function speakerNotes() {',
        '/*',
        '- first speaker note',
        '  - indented sub note',
        ,
        '*/}',
        '.toString().split(\'\\n\').slice(2, -1).join(\'\\n\'))',
        '</script>',
        '',
        '# What Is a Node.js Addon?',
        '',
        '- Node.js itself works like an addon',
        '- ???',
        '',
        '<script>',
        'typeof console.clear === \'function\' && console.clear()',
        'console.log(',
        'function speakerNotes() {',
        '/*',
        '- second speaker note',
        '  - indented sub note',
        '- third speaker note',
        ,
        '*/}',
        '.toString().split(\'\\n\').slice(2, -1).join(\'\\n\'))',
        '</script>',
        '' ]  
    , 'correctly activates speaker notes by making them to the console'
  )
  t.end()
})

test('\ndeserialize slide with notes', function (t) {
 
 var res = gbfy.deserialize(fs.readFileSync(file, 'utf8'));
  t.deepEqual(
      res
    , [ { chapter: 'what_is_a_node_js_addon_',
          header: 'What Is a Node.js Addon?',
          content:
          [ '# What Is a Node.js Addon?',
            '',
            '- any library that needs to access C/C++ functionality',
            '',
            '<script>',
            'typeof console.clear === \'function\' && console.clear()',
            'console.log(',
            'function speakerNotes() {',
            '/*',
            '- first speaker note',
            '  - indented sub note',
            undefined,
            '*/}',
            '.toString().split(\'\\n\').slice(2, -1).join(\'\\n\'))',
            '</script>',
            '' ] },
        { chapter: 'what_is_a_node_js_addon_',
          header: 'What Is a Node.js Addon?',
          content:
          [ '# What Is a Node.js Addon?',
            '',
            '- Node.js itself works like an addon',
            '- ???',
            '',
            '<script>',
            'typeof console.clear === \'function\' && console.clear()',
            'console.log(',
            'function speakerNotes() {',
            '/*',
            '- second speaker note',
            '  - indented sub note',
            '- third speaker note',
            undefined,
            '*/}',
            '.toString().split(\'\\n\').slice(2, -1).join(\'\\n\'))',
            '</script>',
            '' ] } ] 
    , 'deserializes it including activated speaker notes'
  )
  t.end()
})
