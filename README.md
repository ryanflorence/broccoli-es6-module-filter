broccoli-es6-module-filter
==========================

[![Build Status](https://travis-ci.org/rpflorence/broccoli-es6-module-filter.png?branch=master)](https://travis-ci.org/rpflorence/broccoli-es6-module-filter)

Transpile modules authored in ES6 to other module types.

Installation
------------

```sh
npm install --save broccoli-es6-module-filter
```

Usage (Sample Brocfile.js)
--------------------------

```js
var filterES6Modules = require('broccoli-es6-module-filter');
var pickFiles = require('broccoli-static-compiler');

module.exports = function (broccoli) {

  // say we're creating a third-party component, we'd house our
  // source code in './lib'
  var tree = broccoli.makeTree('lib');

  // create a CJS version
  var cjsTree = filterES6Modules(pickFiles(tree, {
    srcDir: '/',
    destDir: '/cjs'
  }), {
    moduleType: 'cjs'
  });

  // and AMD
  var amdTree = filterES6Modules(pickFiles(tree, {
    srcDir: '/',
    destDir: '/amd'
  }), {
    moduleType: 'amd'
  });

  return [cjsTree, amdTree];
};
```

And then from the command line:

```sh
$ broccoli build output
```

Options
-------

- `moduleType` - `amd` (default) or `cjs`
- `anonymous` - for amd output, whether or not to name your modules.
- `packageName` - for named-amd output, prepends `packageName/` to your
  module names
- `main` - for named-amd output, which file is the main entry point of
  your module that will be returned with `require(['your-package'])`
- every other option supported by the [transpiler][transpiler]



  [transpiler]:https://github.com/square/es6-module-transpiler

