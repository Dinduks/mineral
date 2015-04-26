start
  = fns:fnDecl+ {
    var result = {};
    for (var i = 0; i < fns.length; i++) {
      result[fns[i].name] = fns[i];
    }
    return result;
  }

fnDecl
  = _ "fn" _ "(" fnName:identifier ":\n" e:exprs? _ ")" _ {
    return {
      type: 'fnDecl',
      name: fnName,
      args: [],
      body: e
    };
  }
  / _ "fn" _ "(" fnName:identifier _ fnDeclArgs:fnDeclArgs? _ ":" _ e:exprs? _ ")" _ {
    return {
      type: 'fnDecl',
      name: fnName,
      args: fnDeclArgs,
      body: e
    };
  }

fnDeclArgs
  = args:(arg:literal _ "," _ {return arg;})+ arg:literal {
    args.push(arg);
    return args;
  }
  / arg:literal {
    return arg;
  }

fnCall
  = fnName:identifier _ '(' _ fnArgs:fnArgs? _ ')' {
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
  = list
  / while
  / if
  / varAssignment
  / deconstruction
  / test
  / string
  / integer
  / varAccess
  / fnCall
  / '(' exprs:exprs ')' {
    return {
      type:  'body',
      value: exprs
    }
  }

deconstruction
  = head:literal _ ',' _ tail:literal _ '=' _ e:expr {
    return {
      type:  'deconstruction',
      head:  head,
      tail:  tail,
      value: e
    }
  }

list
  = '()' {
   return {
     type:  'list',
     value: []
   }
  }
  / '{' _ head:expr tail:(_ "," _ expr:expr {return expr;})* _ '}' {
    tail.unshift(head);
    return {
      type:  'list',
      value: tail
    }
}

if = 'if' _ '(' _ cond:expr _ truePart:expr _ falsePart:expr _ ')' {
  return {
    type:      'if',
    cond:      cond,
    truePart:  truePart,
    falsePart: falsePart
  }
}

while = 'while' _ '(' _ cond:expr _ body:(e:expr _ {return e;})+ ')' {
  return {
    type: 'while',
    cond: cond,
    body: body
  }
}

varAccess
  = varName:identifier {
    return {
      type: 'varAccess',
      varName: varName
    };
  }

varAssignment
  = varName:identifier _ '=' _ e:expr {
    return {
      type:   'varAssignment',
      varName: varName,
      e:       e
    };
  }

test
  = left:additive _ op:('<'/'>'/'=='/'!=') _ right:test {
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
  / list
  / '(' _ additive:additive _ ')' { return additive; }

exprs
  = e:(_ ie:expr {return ie;})+ {
    return e;
  }

identifier = p1:literal pN:(p:literal/p:integer {return p.value;})* {
  return p1 + pN;
}

string
  //= "'" string:(literal/integer/" ")+ "'" {
  = "'" string:([^'.]*) "'" {
    return {
      type: 'string',
      value: string.join('')
    };
  }

literal
  = text: [a-zA-Z]+ { return text.join("") }

integer "integer"
  = digits:[0-9]+ {
    return {
      type: 'integer',
      value: parseInt(digits.join(""), 10)
    };
  }

lb = [\n\r]
comment = "#" (!lb .)*

// optional whitespace
_  = ([ \t\r\n]/comment)*

// mandatory whitespace
__ = [ \t\r\n]+