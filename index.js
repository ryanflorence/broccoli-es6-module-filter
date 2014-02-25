var BroccoliFilter = require('broccoli-filter')
var Compiler = require('es6-module-transpiler').Compiler;
var extend = require('extend');

module.exports = Filter;
Filter.prototype = Object.create(BroccoliFilter.prototype);
Filter.prototype.constructor = Filter;

function Filter(inputTree, options) {
  if (!(this instanceof Filter)) {
    return new Filter(inputTree, options);
  }
  this.inputTree = inputTree;
  this.setOptions(options);
}

Filter.prototype.defaults = {
  anonymous: true,
  moduleType: 'amd',
  packageName: null,
  main: null
};

Filter.prototype.extensions = ['js']

Filter.prototype.targetExtension = 'js'

Filter.prototype.setOptions = function(options) {
  var merged = extend({}, this.defaults, options);
  this.options = rip(merged, ['moduleType', 'packageName', 'main']);
  this.compilerOptions = merged;
  this.validateOptions();
}

Filter.prototype.validateOptions = function() {
  if (this.compilerOptions.anonymous === false && !this.options.packageName) {
    throw new Error('You must specify a `packageName` option when using the `anonymous: false` option');
  }
}

var methods = {
  'cjs': 'toCJS',
  'amd': 'toAMD',
  'globals': 'toGlobals'
};

Filter.prototype.getName = function (filePath) {
  if (this.compilerOptions.anonymous) return null;
  var name = filePath.replace(/.js$/, '');
  var main = this.options.main;
  var packageName = this.options.packageName;
  return name === main ? packageName : packageName+'/'+name;
};

Filter.prototype.processString = function (fileContents, filePath) {
  var name = this.getName(filePath);
  var compiler = new Compiler(fileContents, name, this.options);
  return compiler[methods[this.options.moduleType]]();
};

function rip(obj, props) {
  return props.reduce(function(ripped, prop) {
    if (obj[prop]) {
      ripped[prop] = obj[prop];
      delete obj[prop];
    }
    return ripped;
  }, {});
}

