'use strict';

var mkdir = require('mkdirp')
  , path = require('path')
  , fs = require('fs')
  , log = require('npmlog')
  , runnel = require('runnel')

var regex = /^# /;

exports = module.exports = function gitbookify(file, tgt, cb) {
  fs.readFile(file, 'utf8', function onread(err, md) {
    if (err) return cb(err);
    var slides = deserialize(md);
    writeout(tgt, slides, cb);
  })
}

var deserialize = exports.deserialize = function deserialize(md) {
  var lines = md.split('\n')
  var slides = [], i = 0, currentSlide, chapter;

  // ignore everything up to first header (including empty lines)
  while (!regex.test(lines[i])) i++;

  for (; i < lines.length; i++) {
    if (regex.test(lines[i])) { 

      chapter = lines[i]
        .replace(regex, '')
        .replace(/ /g, '_')
        .replace(/[\/?:\[\]`.,()*"';{}+<>]/g, '_')
        .trim()
        .toLowerCase()

      currentSlide = { chapter: chapter, header: lines[i].replace(regex, ''), content: [ lines[i] ] };
      slides.push(currentSlide)
      continue;
    }

    currentSlide.content.push(lines[i]);
  }

  return slides;
}

var createSummary = exports.createSummary = function createSummary (slides) {
  var currentChapter = null
    , currentSection = 1

  return slides.reduce(function onslide(acc, slide) {
    var sectionName;

    if (!currentChapter || currentChapter !== slide.chapter) {
      acc.push(' * [' + slide.header + '](' + slide.chapter + '/' + slide.chapter + '_0.md)')
      currentSection = 1;
      currentChapter = slide.chapter;
      return acc;
    }

    sectionName = slide.chapter + '_' + currentSection;
    acc.push('    * [' + slide.header + ' ' + currentSection + '](' + slide.chapter + '/' + sectionName + '.md)')
    currentSection++;
    return acc;
  }, []);
}

function writeChapters(tgt, slides, cb) {
  log.info('gitbookify', 'Writing gitbook chapters');
  var currentChapter = null
    , currentSection = 0

  function processSlide(slide, cb_) {
    var filename;

    if (currentChapter && currentChapter === slide.chapter) {
      log.verbose('gitbookfiy', 'Adding section %d to chapter %s', currentSection, slide.chapter);
      currentSection++;
      filename = path.join(tgt, slide.chapter, slide.chapter + '_' + currentSection + '.md');
      return fs.writeFile(filename, slide.content.join('\n'), 'utf8', cb_);
    }

    log.verbose('gitbookify', 'Creating new chapter', slide.chapter)

    currentChapter = slide.chapter;
    currentSection = 0;

    filename = path.join(tgt, currentChapter, currentChapter + '_' + currentSection + '.md');

    var dirname = path.dirname(filename);
    mkdir(dirname, function (err) {
      if (err) return cb_(err);
      fs.writeFile(filename, slide.content.join('\n'), function onwroteReadme(err) {
        if (err) return cb_(err);
        cb_()
      })
    })
  }

  var tasks = slides.map(function process (x) { return processSlide.bind(null, x) });
  runnel(tasks.concat(cb));
}

function writeSummary(tgt, slides, cb) {
  log.info('gitbookify', 'Writing gitbook summary');
  var summary = createSummary(slides).join('\n');
  fs.writeFile(path.join(tgt, 'SUMMARY.md'), summary, 'utf8', cb)
}

function writeReadme(tgt, slides, cb) {
  log.info('gitbookify', 'Writing gitbook readme');
  var readme = slides[0].content[0];
  fs.writeFile(path.join(tgt, 'README.md'), readme, 'utf8', cb)
}

var writeout =  exports.writeout = function writeout(tgt, slides, cb) {
  fs.exists(tgt, function (itdoes) {
    if (itdoes) return cb(new Error('Target directory ' + tgt + ' already exists, please remove it first or choose another one.'));  

    mkdir(tgt, function onmkdir(err) {
      if (err) return cb(err);
      writeChapters(tgt, slides, onwroteChapters)
    })
  })

  function onwroteChapters(err) {
    if (err) return cb(err);
    writeSummary(tgt, slides, onwroteSummary); 
  }

  function onwroteSummary(err) {
    if (err) return cb(err);
    writeReadme(tgt, slides, cb)
  }
}

// Test
if (!module.parent && typeof window === 'undefined') {
  var file = __dirname + '/test/fixtures/addon-slides.md';
  var tgt = __dirname + '/test/results/addon-slides';
  exports(file, tgt,  function (err) {
    if (err) return console.error(err);
    log.info('gitbookify', 'Done')  
  })
}
