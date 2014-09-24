# gitbookify [![build status](https://secure.travis-ci.org/thlorenz/gitbookify.png)](http://travis-ci.org/thlorenz/gitbookify)

Generates gitbook chapters and sections from a given markdown file.

## Installation

    npm install -g gitbookify

### Usage

```
gitbookify <file.md> --outdir <outdir> <gitbookify options>

  Generates gitbook chapters and sections from a given markdown file.

OPTIONS:

  -o, --outdir    the directory to which to write the generated files used to generate a gitbook
  -l, --loglevel  level at which to log: silly|verbose|info|warn|error|silent -- default: info
  -h, --help      Print this help message.

EXAMPLES:
  
  Generate with default options and launch gitbook server afterwards:
    
    gitbookify README.md --outdir ./my-gitbook && gitbook serve ./my-gitbook

  Override loglevel:

    gitbookify API.md --loglevel silly -o ./my-gitbook
```

Sections are created by separating on each `# ` header. If headers have the same name they go into the same chapter. For
more info [review this example](https://raw.githubusercontent.com/thlorenz/gitbookify/master/test/fixtures/addon-slides.md).

After generating the chapters you can use [gitbook](https://github.com/GitbookIO/gitbook) to either serve them `gitbook
serve ./my-gitbook` or [do all the other gitbook things](https://github.com/GitbookIO/gitbook#how-to-use-it).

## License

MIT
