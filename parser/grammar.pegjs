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
      expressions: e
    };
  }

fnCall
  = fnName:literal "(" _ fnArgs:fnArgs? _ ")" {
    return {
      type: 'fnCall',
      target: fnName,
      args: fnArgs
    }
  }

fnArgs
  = es:(iw:expr _ "," _ {return iw;})+ e:expr {
    es = es.push(e);
    return {
      type: 'fnArgs',
      value: es
    };
  }
  / e:expr {
    return {
      type: 'fnArgs',
      value: e
    };
  }

expr
  = integer
  / string
  / fnCall

exprs
  = e:(_ ie:expr {return ie;})+ {
    return e;
  }

string
  = string:"'" (literal/integer/" ")+ "'" {
    return {
      type: 'string',
      value: string.substr(1, string.length - 1)
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