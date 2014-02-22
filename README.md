broccoli-es6-module-filter
==========================

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
  }));

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

- `moduleType` - one of `amd`, `cjs`, and `globals`.

Currently all output is anonymous.

