var Scope = require('./scope.js');
var _     = require('lodash-node');

exports.eval = eval;
exports.evalFn = evalFn;

function eval(expression, functions, scope, out, err) {
    switch (expression.type) {
        case 'binOp':
            return evalBinOp(expression, functions, scope, out, err);
        case 'body':
            return evalBody(expression, functions, scope, out, err);
        case 'deconstruction':
            return evalDeconstruction(expression, functions, scope, out, err);
        case 'fnCall':
            return evalFnCall(expression, functions, scope, out, err);
        case 'if':
            return evalIf(expression, functions, scope, out, err);
        case 'integer':
            return evalInteger(expression, functions, scope, out, err);
        case 'list':
            return evalList(expression, functions, scope, out, err);
        case 'string':
            return evalString(expression, functions, scope, out, err);
        case 'varAccess':
            return evalVarAccess(expression, functions, scope, out, err);
        case 'varAssignment':
            return evalVarAssignation(expression, functions, scope, out, err);
        case 'while':
            return evalWhile(expression, functions, scope, out, err);
        default:
            err(("Unknown expression type: " + expression.type));
            break;
    }
}

function evalFn(fnName, args, functions, out, err) {
    if (fnName == 'print') {
        if (args.length == 0) out('');
        else                  out(args.join(', '));
        return;
    }

    var fnDecl = functions[fnName];
    if (fnDecl == undefined) {
        err("Function '" + fnName + "' is undefined.");
        return;
    }

    var fnArguments = {};
    for (var i = 0; i < args.length; i++) {
        fnArguments[fnDecl.args[i]] = args[i];
    }

    if (fnDecl == null) throw new Error("No function " + fnName);
    return eval({type: 'body', value: fnDecl.body}, functions, new Scope(null, fnArguments), out, err);
}

function evalBinOp(expression, functions, scope, out, err) {
    switch (expression.op) {
        case '+':
            return eval(expression.left, functions, scope, out, err) + eval(expression.right, functions, scope, out, err);
        case '-':
            return eval(expression.left, functions, scope, out, err) - eval(expression.right, functions, scope, out, err);
        case '*':
            return eval(expression.left, functions, scope, out, err) * eval(expression.right, functions, scope, out, err);
        case '/':
            return eval(expression.left, functions, scope, out, err) / eval(expression.right, functions, scope, out, err);
        case '>':
            return eval(expression.left, functions, scope, out, err) > eval(expression.right, functions, scope, out, err);
        case '<':
            return eval(expression.left, functions, scope, out, err) < eval(expression.right, functions, scope, out, err);
        case '==':
            var left  = eval(expression.left, functions, scope, out, err);
            var right = eval(expression.right, functions, scope, out, err);
            if (_.isArray(left) && _.isArray(right))
                return (_(left).difference(right) == 0);
            return left == right;
        case '!=':
            return eval(expression.left, functions, scope, out, err) != eval(expression.right, functions, scope, out, err);
        default:
            throw new Error("Unrecognized operation.");
    }
}

function evalBody(body, functions, scope, out, err) {
    var result;
    body.value.forEach(function (expression) {
        result = eval(expression, functions, scope, out, err);
    });
    return result;
}

function evalDeconstruction(decons, functions, scope, out, err) {
    var list = eval(decons.value, functions, scope, out, err);
    if (!_.isArray(list)) {
        err("Cannot deconstruct a value which is not a list.");
        return;
    }

    scope.setValue(decons.head, list[0]);
    scope.setValue(decons.tail, list.slice(1));
}

function evalFnCall(fnCall, functions, scope, out, err) {
    var args = fnCall.args.map(function (arg) {
        return eval(arg, functions, scope, out, err);
    });

    return evalFn(fnCall.target, args, functions, out, err);
}

function evalIf(if_, functions, scope, out, err) {
    var cond = eval(if_.cond, functions, scope, out, err);
    if (cond == 0 || cond == false) {
        return eval(if_.falsePart, functions, new Scope(scope), out, err);
    } else {
        return eval(if_.truePart, functions, new Scope(scope), out, err);
    }
}

function evalInteger(expression, functions) {
    return expression.value;
}

function evalList(list, functions, scope, out, err) {
    return list.value.map(function (expr) {
        return eval(expr, functions, scope, out, err);
    });
}

function evalString(expression, functions) {
    return expression.value;
}

function evalVarAccess(expression, functions, scope, out, err) {
    if (scope.getValue(expression.varName) == undefined) {
        err("Variable '" + expression.varName + "' is undefined.");
        return;
    }
    return scope.getValue(expression.varName);
}
function evalVarAssignation(expression, functions, scope, out, err) {
    scope.setValue(expression.varName, eval(expression.e, functions, scope, out, err), true);
}

function evalWhile(while_, functions, scope, out, err) {
    while (eval(while_.cond, functions, scope, out, err) != false) {
        eval({type: 'body', value: while_.body}, functions, new Scope(scope), out, err);
    }
    return;
}
