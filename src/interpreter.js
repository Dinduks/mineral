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
    return interpret({type: 'body', value: fnDecl.body}, functions, fnArguments);
};

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
        case 'while':
            return interpretWhile(expression, functions, env);
        default:
            console.warn(("Unknown expression type: " + expression.type));
            break;
    }
};

function interpretIf(if_, functions, env) {
    var cond = interpret(if_.cond, functions, env);
    var oldVars = Object.keys(env);
    if (cond == 0 || cond == false) {
        return interpret(if_.falsePart, functions, env);
    } else {
        return interpret(if_.truePart, functions, env);
    }
    for (var varName in env) if (oldVars.indexOf(varName) < 0) delete(env[varName]);
}

function interpretWhile(while_, functions, env) {
    var oldVars = Object.keys(env);

    while (interpret(while_.cond, functions, env) != false) {
        interpret({type: 'body', value: while_.body}, functions, env);
    }

    for (var varName in env) if (oldVars.indexOf(varName) < 0) delete(env[varName]);

    return null;
}

function interpretBody(body, functions, env) {
    var result;
    body.value.forEach(function (expression) {
        result = interpret(expression, functions, env);
    });
    return result;
}

function interpretFnCall(fnCall, functions, env) {
    var args = fnCall.args.map(function (arg) {
        return interpret(arg, functions, env);
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
            return interpret(expression.left, functions, env) > interpret(expression.right, functions, env);
        case '<':
            return interpret(expression.left, functions, env) < interpret(expression.right, functions, env);
        case '==':
            return interpret(expression.left, functions, env) == interpret(expression.right, functions, env);
        case '!=':
            return interpret(expression.left, functions, env) != interpret(expression.right, functions, env);
        default:
            throw new Error("Unrecognized operation.");
    }
}

function interpretVarAssignation(expression, functions, env) {
    env[expression.varName] = interpret(expression.e, functions, env);
}

function interpretVarAccess(expression, functions, env) {
    return env[expression.varName];
}

exports.interpret = interpret;
exports.interpretFn = interpretFn;
