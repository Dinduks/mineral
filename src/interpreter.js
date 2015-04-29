var Scope = require('./scope.js');
var _     = require('lodash-node');

exports.eval = eval;
exports.evalFn = evalFn;

function eval(expression, functions, scope, out) {
    switch (expression.type) {
        case 'binOp':
            return evalBinOp(expression, functions, scope, out);
        case 'body':
            return evalBody(expression, functions, scope, out);
        case 'deconstruction':
            return evalDeconstruction(expression, functions, scope, out);
        case 'fnCall':
            return evalFnCall(expression, functions, scope, out);
        case 'if':
            return evalIf(expression, functions, scope, out);
        case 'integer':
            return evalInteger(expression, functions, scope, out);
        case 'list':
            return evalList(expression, functions, scope, out);
        case 'string':
            return evalString(expression, functions, scope, out);
        case 'varAccess':
            return evalVarAccess(expression, functions, scope, out);
        case 'varAssignment':
            return evalVarAssignation(expression, functions, scope, out);
        case 'while':
            return evalWhile(expression, functions, scope, out);
        default:
            throw new Error("Unknown expression type: " + expression.type);
            break;
    }
}

function evalFn(fnName, args, functions, out) {
    if (fnName == 'print') {
        if (args.length == 0) out('');
        else                  out(args.join(', '));
        return;
    }

    var fnDecl = functions[fnName];
    if (fnDecl == undefined) {
        throw new Error("Function '" + fnName + "' is undefined.");
    }

    var fnArguments = {};
    for (var i = 0; i < args.length; i++) {
        fnArguments[fnDecl.args[i]] = args[i];
    }

    if (fnDecl == null) throw new Error("No function " + fnName);
    return eval({type: 'body', value: fnDecl.body}, functions, new Scope(null, fnArguments), out);
}

function evalBinOp(expression, functions, scope, out) {
    switch (expression.op) {
        case '+':
            return eval(expression.left, functions, scope, out) + eval(expression.right, functions, scope, out);
        case '-':
            return eval(expression.left, functions, scope, out) - eval(expression.right, functions, scope, out);
        case '*':
            return eval(expression.left, functions, scope, out) * eval(expression.right, functions, scope, out);
        case '/':
            return eval(expression.left, functions, scope, out) / eval(expression.right, functions, scope, out);
        case '>':
            return eval(expression.left, functions, scope, out) > eval(expression.right, functions, scope, out);
        case '<':
            return eval(expression.left, functions, scope, out) < eval(expression.right, functions, scope, out);
        case '==':
            var left  = eval(expression.left, functions, scope, out);
            var right = eval(expression.right, functions, scope, out);
            if (_.isArray(left) && _.isArray(right))
                return (_(left).difference(right) == 0);
            return left == right;
        case '!=':
            return eval(expression.left, functions, scope, out) != eval(expression.right, functions, scope, out);
        default:
            throw new Error("Unrecognized operation.");
    }
}

function evalBody(body, functions, scope, out) {
    var result;
    body.value.forEach(function (expression) {
        result = eval(expression, functions, scope, out);
    });
    return result;
}

function evalDeconstruction(decons, functions, scope, out) {
    var list = eval(decons.value, functions, scope, out);
    if (!_.isArray(list)) {
        throw new Error("Cannot deconstruct a value which is not a list.");
    }

    scope.setValue(decons.head, list[0]);
    scope.setValue(decons.tail, list.slice(1));
}

function evalFnCall(fnCall, functions, scope, out) {
    var args = fnCall.args.map(function (arg) {
        return eval(arg, functions, scope, out);
    });

    return evalFn(fnCall.target, args, functions, out);
}

function evalIf(if_, functions, scope, out) {
    var cond = eval(if_.cond, functions, scope, out);
    if (cond == 0 || cond == false) {
        return eval(if_.falsePart, functions, new Scope(scope), out);
    } else {
        return eval(if_.truePart, functions, new Scope(scope), out);
    }
}

function evalInteger(expression, functions) {
    return expression.value;
}

function evalList(list, functions, scope, out) {
    return list.value.map(function (expr) {
        return eval(expr, functions, scope, out);
    });
}

function evalString(expression, functions) {
    return expression.value;
}

function evalVarAccess(expression, functions, scope, out) {
    if (scope.getValue(expression.varName) == undefined) {
        throw new Error("Variable '" + expression.varName + "' is undefined.");
    }
    return scope.getValue(expression.varName);
}
function evalVarAssignation(expression, functions, scope, out) {
    scope.setValue(expression.varName, eval(expression.e, functions, scope, out), true);
}

function evalWhile(while_, functions, scope, out) {
    while (eval(while_.cond, functions, scope, out) != false) {
        eval({type: 'body', value: while_.body}, functions, new Scope(scope), out);
    }
    return;
}
