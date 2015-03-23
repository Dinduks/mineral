var peg = require('../parser/peg.js');

describe('Parser', function () {
    it('returns a map of functions', function () {
        var r = peg.parse('fn(foo:\nbar())');
        expect(r).toEqual(jasmine.any(Object));
    });

    describe('fnDecl', function () {
        it('contains the name and the body info', function () {
            var r = peg.parse("fn(foo:\nbar()\n3\n'hello')");
            expect(r.foo.name).toEqual('foo');
            expect(r.foo.body.length).toEqual(3);
        });
    });

    describe("fnCall", function () {
        it("contains the target and the arguments info", function () {
            var r = peg.parse("fn(foo:\nbar(42, 'hello'))");
            expect(r.foo.body[0].type).toEqual('fnCall');
            expect(r.foo.body[0].target).toEqual('bar');
            expect(r.foo.body[0].args).toEqual(jasmine.any(Array));
        });
    });

    describe('integer', function () {
        it('contains the type and the value', function () {
            var r = peg.parse('fn(foo:\n42)');
            expect(r.foo.body[0].type).toEqual('integer');
            expect(r.foo.body[0].value).toEqual(42);
        });
    });

    describe('string', function () {
        it('contains the type and the value', function () {
            var r = peg.parse("fn(foo:\n'hello world')");
            expect(r.foo.body[0].type).toEqual('string');
            expect(r.foo.body[0].value).toEqual('hello world');
        });
    });
});
