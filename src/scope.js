var _     = require('lodash-node');

var Scope = function (parent, arguments) {
    this.scope = {};

    if (parent != undefined)
        this.parent = parent;
    if (arguments != undefined)
        this.scope = _.merge(this.scope, arguments);

    this.setValue = function (name, value, firstCaller) {
        if (firstCaller == undefined)
            firstCaller = true;

        if (this.scope[name] != undefined) {
            this.scope[name] = value;
            return true;
        } else {
            if (this.parent != undefined) {
                var x = this.parent.setValue(name, value, false);
                if (x) return true;
            }
        }

        if (firstCaller) this.scope[name] = value;
        return false;
    };

    this.getValue = function (name) {
        var value = this.scope[name];
        if (value == undefined) {
            if (this.parent != undefined)
                value = this.parent.getValue(name);
        }
        return value;
    };
};

module.exports = Scope;
