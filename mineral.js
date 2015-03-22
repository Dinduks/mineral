#!/usr/bin/env node

var fs = require('fs');

var fileName = process.argv[2];

if (fileName == undefined) {
    throw new Error("Please specify a Mineral script.");
}

fs.readFile(fileName, "utf8", function (error, data) {
    if (error) {
        throw new Error("Error while reading the file: " + error);
    }

    var peg = require("./parser/peg.js");
    var script = peg.parse(data);

    interpret(script);
});

function interpret(script) {
    if (script.main === undefined) {
        throw new Error("No main function declared.");
    }

    console.log(script);
}
