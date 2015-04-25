var Scope = require('../src/scope.js');

describe('Scope', function () {
    it('stores and returns the variables', function () {
        var env = new Scope();
        env.setValue('a', 1);
        expect(env.getValue('a')).toEqual(1);
        expect(env.getValue('?')).toBeUndefined();
    });

    it('updates the parent\'s variables', function () {
        var parent = new Scope();
        parent.setValue('a', 1);

        var env = new Scope(parent);
        env.setValue('a', 2);
        env.setValue('b', 3);

        expect(env.getValue('a')).toEqual(2);
        expect(env.getValue('b')).toEqual(3);
        expect(parent.getValue('a')).toEqual(2);
        expect(parent.getValue('b')).toBeUndefined();
    });

    it('accepts an object containing variables', function () {
        var vars = { 'a': 1, 'b': 2 };
        var env = new Scope(null, vars);

        expect(env.getValue('a')).toEqual(1);
        expect(env.getValue('b')).toEqual(2);
    });
});
