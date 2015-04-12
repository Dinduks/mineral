var peg = require('../mineral.js');

describe('Interpreter', function () {
    it('interprets test.script', function () {
        var script = parser.parseFile(fileName);
        interpret(script.main, script);
    });
});
