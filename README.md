# gitbookify [![build status](https://secure.travis-ci.org/thlorenz/gitbookify.png)](http://travis-ci.org/thlorenz/gitbookify)

Generates gitbook chapters and sections from a given markdown file.

## Installation

    npm install -g gitbookify

## Usage

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

## Speaker Notes

Simply enclose your speaker notes in a `notes` comment as shown below. The notes will be printed to the browser console
when you open the particular page in the gitbook.

```html
<!-- notes
- first speaker note
  - indented sub note
-->
```

## Images

There are two ways to add images to your gitbook.

### Linking Remote URLS

That is easy since they take absolute paths like `https://path.to/img.png` and work at all times.

**Disadvantage**: You have to be online when presenting/reading the book and as we all know good network is not a given
at conferences

### Linking to Local Directory

You can also link to a directory relative to the markdown file you create, i.e. `img/my-image.png`. 

The problem is that the resulting pages of the book are placed somewhere else and cannot find that `img` directory. In
order to fix that use this simple function in order to create softlinks from each book page to the main `img` directory.

```sh
link_img() {
  for D in *; do
    if [ -d "${D}" ]; then
      ln -s ../../img $D/img
    fi
  done
}
```

You can then use it in your script that builds the book:

```sh
rm -rf ./gitbook
gitbookify slides.md -o gitbook      && \
  rm -rf ./book                      && \
  gitbook build ./gitbook -o  ./book && \
  cd ./book                          && \
  link_img
```

[here is a full example](https://github.com/thlorenz/talks/blob/e27198bc7ded08bb9513b47d510c8f01db51ce90/memory-profiling/build.sh) of such script.

## License

MIT
