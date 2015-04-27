#!/usr/bin/env node

var parser = require('./src/parser/parser.js');
var interpreter = require('./src/interpreter.js');

var out = console.log;
var err = function (s) { console.error('Error: ' + s); };

var fileName = process.argv[2];
if (fileName == undefined) {
    err("Please specify a Mineral script.");
    process.exit();
}

var script = parser.parseFile(fileName);
interpreter.evalFn('main', [], script, out, err);