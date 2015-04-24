var parser = require('../src/parser/parser.js');

// From http://stackoverflow.com/a/15516475/604041
function commandToString(cmd, args, cb) {
    var spawn = require('child_process').spawn;
    var command = spawn(cmd, args);
    var result = '';
    command.stdout.on('data', function(data) {
        result += data.toString();
    });
    command.on('close', function(code) {
        cb(result);
    });
}

function runSpecForScript(scriptName, expected) {
    it('correctly interprets ' + scriptName + '.script', function () {
        runs(function () {
            flag = false;
            commandToString('./mineral.js', ['scripts/' + scriptName + '.script'], function(result) {
                output = result;
                flag = true;
            });
        });

        waitsFor(function () {
            return flag;
        }, 'The test for ' + scriptName + ' timed out.', 1000);

        runs(function () {
            expect(output).toEqual(expected);
        });
    });
}

describe('Interpreter', function () {
    runSpecForScript("hello", "hello world\n");
    runSpecForScript("bignum", (2 * 123456789123456789) + "\n");
    runSpecForScript("fun", "1\nfoo\n");
});
