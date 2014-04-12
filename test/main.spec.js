var assert = require('assert');
var Filter = require('../index');

describe('broccoli-es6-module-filter', function() {
  describe('options', function() {
    it('sets inputTree', function() {
      var filter = new Filter(['lib']);
      assert.equal(filter.inputTree[0], 'lib');
    });

    it('separates compiler options from filter options', function() {

      var moduleGenerator = function(filePath) {};

      var filter = new Filter(['lib'], {
        moduleType: 'amd',
        anonymous: false,
        packageName: 'test',
        main: 'main',
        moduleGenerator: moduleGenerator,
        compatFix: true
      });
      assert.deepEqual(filter.options, {
        moduleType: 'amd',
        packageName: 'test',
        main: 'main',
        moduleGenerator: moduleGenerator
      });
      assert.deepEqual(filter.compilerOptions, {
        anonymous: false,
        compatFix: true
      });
    });

    it('complains if anonymous:false and neither packageName nor moduleGenerator', function() {

      var f1 = new Filter(null, { anonymous: false, packageName: 'app' });
      var f2 = new Filter(null, { anonymous: false, moduleGenerator: function(file) {} });

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

    describe('named amd', function() {
      it('prepends packageName', function() {
        var filter = new Filter(['lib'], {
          moduleType: 'amd',
          anonymous: false,
          packageName: 'hooba'
        }); 
        assert.equal(filter.getName('foo/bar.js'), 'hooba/foo/bar');
      });

      it('is packageName if the file matches the "main" option', function() {
        var filter = new Filter(['lib'], {
          moduleType: 'amd',
          anonymous: false,
          packageName: 'package-name',
          main: 'main'
        });
        assert.equal(filter.getName('main.js'), 'package-name');
      });

      it('is the result of the moduleGenerator function', function() {
        var filter = new Filter(['lib'], {
          moduleType: 'amd',
          anonymous: false,
          moduleGenerator: function(filePath) {
            return filePath;  
          }
        }); 
        assert.equal(filter.getName('foo/bar.js'), 'foo/bar.js');
      });
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
