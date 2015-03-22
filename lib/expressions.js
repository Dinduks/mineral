var expressions = {};

exports.Literal = function (constant) {
    this.constant = constant;
};

exports.Block = function (expressions) {
    this.expressions = expressions;
};

exports.Parameter = function (name) {
    this.name = name;
};

exports.VarAccess = function (name) {
    this.name = name;
};

exports.VarAssignement = function (names, expressions) {
    this.names = names;
    this.expressions = expressions;
};

exports.Call = function (op, name, expressions) {
    this.op = op;
    this.name = name;
    this.expressions = expressions;
};

exports.If = function (condition, truePart, falsePart) {
    this.condition = condition;
    this.truePart = truePart;
    this.falsePart = falsePart;
};

exports.While = function (condition, body) {
    this.condition = condition;
    this.body = body;
};

exports.Record = function (expressions) {
    this.expressions = expressions;
};

exports.Function = function (name, parameters, body) {
    this.name = name;
    this.parameters = parameters;
    this.body = body;
};
