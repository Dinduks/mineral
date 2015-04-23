exports.interpret = function (expression, functions) {
    switch (expression.type) {
        case 'fnDecl':
            return interpretFnDecl(expression, functions);
            break;
        case 'fnCall':
            return interpretFnCall(expression, functions);
            break;
        case 'string':
            return interpretString(expression, functions);
            break;
        case 'binOp':
            return interpretBinOp(expression, functions);
            break;
        default:
            console.warn(("Unknown expression type: " + expression.type));
            break;
    }
};

function interpretFnDecl(expression, functions) {
    expression.body.forEach(function (expression) {
        exports.interpret(expression, functions);
    });
}

function interpretFnCall(expression, functions) {
    if (expression.target == "print") {
        console.log(exports.interpret(expression.args));
        return;
    }

    throw new Error("Not implemented yet.");
}

function interpretString(expression, functions) {
    return expression.value;
}

function interpretBinOp(expression, functions) {
    switch (expression.value.op) {
        case '+':
            return expression.value.left.value + expression.value.right.value;
        case '-':
            return expression.value.left.value - expression.value.right.value;
        case '*':
            return expression.value.left.value * expression.value.right.value;
        case '/':
            return expression.value.left.value / expression.value.right.value;
        default:
            throw new Error("Unrecognized operation.");
    }
}
