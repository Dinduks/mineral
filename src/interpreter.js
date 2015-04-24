var interpret = function (expression, functions, env) {
    switch (expression.type) {
        case 'body':
            return interpretBody(expression, functions, env);
        case 'fnCall':
            return interpretFnCall(expression, functions, env);
        case 'string':
            return interpretString(expression, functions);
        case 'integer':
            return interpretInteger(expression, functions);
        case 'binOp':
            return interpretBinOp(expression, functions, env);
        case 'varAssignment':
            return interpretVarAssignation(expression, functions, env);
        case 'varAccess':
            return interpretVarAccess(expression, functions, env);
        case 'if':
            return interpretIf(expression, functions, env);
        default:
            console.warn(("Unknown expression type: " + expression.type));
            break;
    }
};

function interpretIf(if_, functions, env) {
    var cond = interpret(if_.cond, functions, env);
    if (cond == 0 || cond == false) {
        return interpret(if_.falsePart, functions, merge({}, env));
    } else {
        return interpret(if_.truePart, functions, merge({}, env));
    }
}

function interpretBody(body, functions, env) {
    var result;
    body.value.forEach(function (expression) {
        result = exports.interpret(expression, functions, env);
    });
    return result;
}

var interpretFn = function (fnName, args, functions) {
    if (fnName == 'print') {
        if (args.length == 0) console.log('null');
        else                  console.log(args.join(','));
        return;
    }

    var fnDecl = functions[fnName];

    var fnArguments = {};
    for (var i = 0; i < args.length; i++) {
        fnArguments[fnDecl.args[i]] = args[i];
    }

    if (fnDecl == null) throw new Error("No function " + fnName);
    return exports.interpret({type: 'body', value: fnDecl.body}, functions, fnArguments);
};

function interpretFnCall(fnCall, functions, env) {
    var args = fnCall.args.map(function (arg) {
        return exports.interpret(arg, functions, env);
    });

    return interpretFn(fnCall.target, args, functions);
}

function interpretString(expression, functions) {
    return expression.value;
}

function interpretInteger(expression, functions) {
    return expression.value;
}

function interpretBinOp(expression, functions, env) {
    switch (expression.op) {
        case '+':
            return interpret(expression.left, functions, env) + interpret(expression.right, functions, env);
        case '-':
            return interpret(expression.left, functions, env) - interpret(expression.right, functions, env);
        case '*':
            return interpret(expression.left, functions, env) * interpret(expression.right, functions, env);
        case '/':
            return interpret(expression.left, functions, env) / interpret(expression.right, functions, env);
        case '>':
            return interpret(expression.left, functions, env) < interpret(expression.right, functions, env);
        case '<':
            return interpret(expression.left, functions, env) < interpret(expression.right, functions, env);
        default:
            throw new Error("Unrecognized operation.");
    }
}

function interpretVarAssignation(expression, functions, env) {
    env[expression.varName] = exports.interpret(expression.e, functions, env);
}

function interpretVarAccess(expression, functions, env) {
    return env[expression.varName];
}

// From: http://stackoverflow.com/a/8625261/604041
var merge = function() {
    var obj = {},
    i = 0,
    il = arguments.length,
    key;
    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                obj[key] = arguments[i][key];
            }
        }
    }
    return obj;
};

exports.interpret = interpret;
exports.interpretFn = interpretFn;
