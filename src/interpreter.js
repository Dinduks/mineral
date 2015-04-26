var Scope = require('./scope.js');
var _     = require('lodash-node');

var evalFn = function (fnName, args, functions) {
    if (fnName == 'print') {
        if (args.length == 0) console.log('null');
        else                  console.log(args.join(','));
        return;
    }

    var fnDecl = functions[fnName];
    if (fnDecl == undefined) {
        console.error("Function '" + fnName + "' is undefined.");
        process.exit();
    }

    var fnArguments = {};
    for (var i = 0; i < args.length; i++) {
        fnArguments[fnDecl.args[i]] = args[i];
    }

    if (fnDecl == null) throw new Error("No function " + fnName);
    return eval({type: 'body', value: fnDecl.body}, functions, new Scope(null, fnArguments));
};

var eval = function (expression, functions, scope) {
    switch (expression.type) {
        case 'body':
            return evalBody(expression, functions, scope);
        case 'fnCall':
            return evalFnCall(expression, functions, scope);
        case 'string':
            return evalString(expression, functions);
        case 'integer':
            return evalInteger(expression, functions);
        case 'binOp':
            return evalBinOp(expression, functions, scope);
        case 'varAssignment':
            return evalVarAssignation(expression, functions, scope);
        case 'varAccess':
            return evalVarAccess(expression, functions, scope);
        case 'if':
            return evalIf(expression, functions, scope);
        case 'while':
            return evalWhile(expression, functions, scope);
        case 'list':
            return evalList(expression, functions, scope);
        case 'deconstruction':
            return evalDeconstruction(expression, functions, scope);
            break;
        default:
            console.error(("Unknown expression type: " + expression.type));
            break;
    }
};

function evalIf(if_, functions, scope) {
    var cond = eval(if_.cond, functions, scope);
    if (cond == 0 || cond == false) {
        return eval(if_.falsePart, functions, new Scope(scope));
    } else {
        return eval(if_.truePart, functions, new Scope(scope));
    }
}

function evalWhile(while_, functions, scope) {
    while (eval(while_.cond, functions, scope) != false) {
        eval({type: 'body', value: while_.body}, functions, new Scope(scope));
    }

    return null;
}

function evalDeconstruction(decons, functions, scope) {
    var list = eval(decons.value, functions, scope);
    if (!_.isArray(list)) {
        console.error("Cannot deconstruct a value which is not a list.")
        process.exit();
    }

    scope.setValue(decons.head, list[0]);
    scope.setValue(decons.tail, list.slice(1));
}

function evalList(list, functions, scope) {
    return list.value.map(function (expr) {
        return eval(expr, functions, scope);
    });
}

function evalBody(body, functions, scope) {
    var result;
    body.value.forEach(function (expression) {
        result = eval(expression, functions, scope);
    });
    return result;
}

function evalFnCall(fnCall, functions, scope) {
    var args = fnCall.args.map(function (arg) {
        return eval(arg, functions, scope);
    });

    return evalFn(fnCall.target, args, functions);
}

function evalString(expression, functions) {
    return expression.value;
}

function evalInteger(expression, functions) {
    return expression.value;
}

function evalBinOp(expression, functions, scope) {
    switch (expression.op) {
        case '+':
            return eval(expression.left, functions, scope) + eval(expression.right, functions, scope);
        case '-':
            return eval(expression.left, functions, scope) - eval(expression.right, functions, scope);
        case '*':
            return eval(expression.left, functions, scope) * eval(expression.right, functions, scope);
        case '/':
            return eval(expression.left, functions, scope) / eval(expression.right, functions, scope);
        case '>':
            return eval(expression.left, functions, scope) > eval(expression.right, functions, scope);
        case '<':
            return eval(expression.left, functions, scope) < eval(expression.right, functions, scope);
        case '==':
            var left  = eval(expression.left, functions, scope);
            var right = eval(expression.right, functions, scope);
            if (_.isArray(left) && _.isArray(right))
                return (_(left).difference(right) == 0);
            return left == right;
        case '!=':
            return eval(expression.left, functions, scope) != eval(expression.right, functions, scope);
        default:
            throw new Error("Unrecognized operation.");
    }
}

function evalVarAssignation(expression, functions, scope) {
    scope.setValue(expression.varName, eval(expression.e, functions, scope), true);
}

function evalVarAccess(expression, functions, scope) {
    if (scope.getValue(expression.varName) == undefined) {
        console.error("Variable '" + expression.varName + "' is undefined.");
        process.exit();
    }
    return scope.getValue(expression.varName);
}

exports.eval = eval;
exports.evalFn = evalFn;
