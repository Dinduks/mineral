var Scope = require('../src/scope.js');

describe('Scope', function () {
    it('stores and returns the variables', function () {
        var scope = new Scope();
        scope.setValue('a', 1);
        expect(scope.getValue('a')).toEqual(1);
        expect(scope.getValue('?')).toBeUndefined();
    });

    it('updates the parent\'s variables', function () {
        var parent = new Scope();
        parent.setValue('a', 1);

        var scope = new Scope(parent);
        scope.setValue('a', 2);
        scope.setValue('b', 3);

        expect(scope.getValue('a')).toEqual(2);
        expect(scope.getValue('b')).toEqual(3);
        expect(parent.getValue('a')).toEqual(2);
        expect(parent.getValue('b')).toBeUndefined();
    });

    it('accepts an object containing variables', function () {
        var vars = { 'a': 1, 'b': 2 };
        var scope = new Scope(null, vars);

        expect(scope.getValue('a')).toEqual(1);
        expect(scope.getValue('b')).toEqual(2);
    });
});
