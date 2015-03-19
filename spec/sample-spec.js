var lib = require("../lib/sample-lib.js");

describe("sayHello", function () {
    it("should say hello", function () {
        var maybeHello = lib.sayHello();
        expect(maybeHello).toBe("Hello.");
    });
});
