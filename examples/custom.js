$(document).ready(function () {
    var out = "";
    var err = "";

    function outƒ(s) {

    }

    function err(s) {

    }

    var parser      = require("../src/parser/parser");
    var interpreter = require("../src/interpreter");
    var peg         = require("../src/parser/peg");

    var functions   = peg.parse(data);
    interpreter.evalFn('main', [], functions, out, err);
});
