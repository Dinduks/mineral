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
      body: e
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
    es.push(e);
    return es;
  }
  / e:expr {
    return e;
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