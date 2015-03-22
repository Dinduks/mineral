#!/usr/bin/env node

var fs = require('fs');

var fileName = process.argv[2];

if (fileName == undefined) {
    console.error("Please specify a Mineral script.");
}

fs.readFile(fileName, "utf8", function (error, data) {
    if (error) {
        console.error("Error while reading the file: " + error);
        return;
    }

    var peg = require("./parser/peg.js");
    var script = peg.parse(data);

    interpret(script);
});

function interpret(script) {
    console.log(script);
}
