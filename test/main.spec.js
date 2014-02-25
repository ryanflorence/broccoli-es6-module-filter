var assert = require('assert');
var Filter = require('../index');

describe('broccoli-es6-module-filter', function() {
  describe('options', function() {
    it('sets inputTree', function() {
      var filter = new Filter(['lib']);
      assert.equal(filter.inputTree[0], 'lib');
    });

    it('separates compiler options from filter options', function() {
      var filter = new Filter(['lib'], {
        moduleType: 'amd',
        anonymous: false,
        packageName: 'test',
        main: 'main',
        compatFix: true
      });
      assert.deepEqual(filter.options, {
        moduleType: 'amd',
        packageName: 'test',
        main: 'main'
      });
      assert.deepEqual(filter.compilerOptions, {
        anonymous: false,
        compatFix: true
      });
    });

    it('complains if anonymous:false and no packageName', function() {
      assert.throws(function() {
        new Filter(null, { anonymous: false });
      }, Error);
    });
  });

  describe('getName', function() {
    it('does not return a name when anonymous:true', function() {
      var filter = new Filter(['lib'], {
        anonymous: true
      });
      assert.equal(filter.getName('foo/bar.js'), null);
    });

    it('prepends packageName', function() {
      var filter = new Filter(['lib'], {
        anonymous: false,
        packageName: 'hooba'
      }); 
      assert.equal(filter.getName('foo/bar.js'), 'hooba/foo/bar');
    });

    it('is packageName if the file matches the "main" option', function() {
      var filter = new Filter(['lib'], {
        anonymous: false,
        packageName: 'package-name',
        main: 'main'
      });
      assert.equal(filter.getName('main.js'), 'package-name');
    });
  });

  describe('processString', function() {
    it('actually works', function() {
      var filter = new Filter(null, { moduleType: 'cjs' });
      var out = filter.processString('import Foo from "foo";', 'bar.js');
      assert.equal(out, [
        '"use strict";',
        'var Foo = require("foo")["default"];'
      ].join('\n'));
    });
  });
});
