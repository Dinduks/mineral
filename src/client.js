(function () {
    var $code   = $('#code');
    var $result = $('#result');

    var parser      = require('./parser/parser');
    var interpreter = require('./interpreter');
    var peg         = require("./parser/peg.js");

    $(document).ready(function () {
        window.onerror = err;
        eval();
    });

    $code.on('keyup', function () {
        $result.val('');
        eval();
    });

    function out(s) {
        $result.css('color', 'black');
        $result.val($result.val() + s + '\n');
    }

    function err(s) {
        $result.css('color', 'red');
        var err = s + '\n';
        $result.val(err);
    }

    function eval() {
        var functions   = peg.parse($code.val());
        interpreter.evalFn('main', [], functions, out, err);
    }
})();
