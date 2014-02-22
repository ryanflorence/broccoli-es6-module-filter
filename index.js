var Filter = require('broccoli-filter')
var Compiler = require('es6-module-transpiler').Compiler;
var extend = require('extend');

module.exports = ES6TranspilerFilter;

ES6TranspilerFilter.prototype = Object.create(Filter.prototype);
ES6TranspilerFilter.prototype.constructor = ES6TranspilerFilter;

function ES6TranspilerFilter (inputTree, options) {
  if (!(this instanceof ES6TranspilerFilter)) return new ES6TranspilerFilter(inputTree, options);
  this.inputTree = inputTree;
  this.options = extend({}, this.defaults, options);
  this.moduleType = this.options.moduleType;
  delete this.options.moduleType;
}

ES6TranspilerFilter.prototype.defaults = {
  anonymous: true,
  moduleType: 'cjs'
};

ES6TranspilerFilter.prototype.extensions = ['js']

ES6TranspilerFilter.prototype.targetExtension = 'js'

var methods = {
  'cjs': 'toCJS',
  'amd': 'toAMD',
  'globals': 'toGlobals'
};

ES6TranspilerFilter.prototype.processString = function (fileContents, filePath) {
  var name = this.options.anonymous ? null : filePath.replace('.js', '');
  var compiler = new Compiler(fileContents, name, this.options);
  return compiler[methods[this.moduleType]]();
};

