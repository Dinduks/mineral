#!/usr/bin/env node

var parser = require('./src/parser/parser.js');
var interpreter = require('./src/interpreter.js');

var fileName = process.argv[2];
if (fileName == undefined) {
    throw new Error("Please specify a Mineral script.");
}

var script = parser.parseFile(fileName);
interpreter.evalFn('main', [], script);