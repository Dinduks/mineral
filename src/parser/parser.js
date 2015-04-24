var fs  = require('fs');
var peg = require("./peg.js");

exports.parseFile = function (fileName) {
    var data = fs.readFileSync(fileName, "utf8");
    var functions = peg.parse(data);

    if (functions.main === undefined) {
        throw new Error("No main function declared.");
    }

    return functions;
};