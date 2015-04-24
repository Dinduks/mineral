start
  = fns:fnDecl+ {
    var result = {};
    for (var i = 0; i < fns.length; i++) {
      result[fns[i].name] = fns[i];
    }
    return result;
  }

fnDecl
  = "fn" _ "(" fnName:literal ":\n" e:exprs? _ ")" _ {
    return {
      type: 'fnDecl',
      name: fnName,
      args: [],
      body: e
    };
  }
  / "fn" _ "(" fnName:literal _ arg:literal _ ":" _ e:expr _ ")" _ {
    return {
      type: 'fnDecl',
      name: fnName,
      args: [arg],
      body: [e]
    };
  }

fnCall
  = fnName:literal "(" _ fnArgs:fnArgs? _ ")" {
    if (fnArgs === null) {
      fnArgs = [];
    } else if (typeof fnArgs === "object" && !Array.isArray(fnArgs)) {
      fnArgs = [fnArgs];
    }
    return {
      type: 'fnCall',
      target: fnName,
      args: fnArgs
    }
  }

fnArgs
  = es:(iw:expr _ "," _ {return iw;})+ e:expr {
    es.push(e);
    return es;
  }
  / e:expr {
    return e;
  }

expr
  = if
  / varAssignment
  / test
  / string
  / integer
  / varAccess
  / fnCall


if = 'if' _ '(' _ cond:expr _ truePart:expr _ falsePart:expr _ ')' {
  return {
    type:      'if',
    cond:      cond,
    truePart:  truePart,
    falsePart: falsePart
  }
}

varAccess
  = varName:literal {
    return {
      type: 'varAccess',
      varName: varName
    };
  }

varAssignment
  = varName:literal _ '=' _ e:expr {
    return {
      type:   'varAssignment',
      varName: varName,
      e:       e
    };
  }

test
  = left:additive _ op:('<'/'>') _ right:test {
    return {
      type:  'binOp',
      left:  left,
      right: right,
      op:    op
    }
  }
  / additive

additive
  = left:multiplicative _ op:('+'/'-') _ right:additive {
    return {
      type:  'binOp',
      left:  left,
      right: right,
      op:    op
    }
  }
  / multiplicative

multiplicative
  = left:primary _ op:('*'/'/') _ right:multiplicative {
    return {
      type:  'binOp',
      left:  left,
      right: right,
      op:    op
    }
  }
  / primary

primary
  = integer
  / fnCall
  / varAccess
  / '(' _ additive:additive _ ')' { return additive; }

exprs
  = e:(_ ie:expr {return ie;})+ {
    return e;
  }

string
  = "'" string:(literal/integer/" ")+ "'" {
    return {
      type: 'string',
      value: string.join('')
    };
  }

literal
  = text: [a-z]+ { return text.join("") }

integer "integer"
  = digits:[0-9]+ {
    return {
      type: 'integer',
      value: parseInt(digits.join(""), 10)
    };
  }

// optional whitespace
_  = [ \t\r\n]*

// mandatory whitespace
__ = [ \t\r\n]+