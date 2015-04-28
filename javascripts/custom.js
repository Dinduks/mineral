$(document).ready(function () {
    var out = "";
    var err = "";

    function outƒ(s) {

    }

    function err(s) {

    }

    var parser      = require('parser');
    var interpreter = require('interpreter');
    var peg         = require("./peg.js");

    var functions   = peg.parse(data);
    interpreter.evalFn('main', [], functions, out, err);
});
