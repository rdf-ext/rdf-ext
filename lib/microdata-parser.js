/* global rdf:true */
'use strict';

var isNode = (typeof process !== 'undefined' && process.versions && process.versions.node);



function URIResolver() {
}
URIResolver.SCHEME = /^[A-Za-z][A-Za-z0-9\+\-\.]*\:/;

URIResolver.prototype.parseURI = function(uri) {
  var match = URIResolver.SCHEME.exec(uri);
  if (!match) {
    throw "Bad URI value, no scheme: "+uri;
  }
  var parsed = { spec: uri };
  parsed.scheme = match[0].substring(0,match[0].length-1);
  parsed.schemeSpecificPart = parsed.spec.substring(match[0].length);
  if (parsed.schemeSpecificPart.charAt(0)=='/' && parsed.schemeSpecificPart.charAt(1)=='/') {
    this.parseGeneric(parsed);
  } else {
    parsed.isGeneric = false;
  }
  parsed.normalize = function() {
    if (!this.isGeneric) {
      return;
    }
    if (this.segments.length==0) {
      return;
    }
    // edge case of ending in "/."
    if (this.path.length>1 && this.path.substring(this.path.length-2)=="/.") {
      this.path = this.path.substring(0,this.path.length-1);
      this.segments.splice(this.segments.length-1,1);
      this.schemeSpecificPart = "//"+this.authority+this.path;
      if (typeof this.query != "undefined") {
        this.schemeSpecificPart += "?" + this.query;
      }
      if (typeof this.fragment != "undefined") {
        this.schemeSpecificPart += "#" + this.fragment;
      }
      this.spec = this.scheme+":"+this.schemeSpecificPart;
      return;
    }
    var end = this.path.charAt(this.path.length-1);
    if (end!="/") {
      end = "";
    }
    for (var i=0; i<this.segments.length; i++) {
      if (i>0 && this.segments[i]=="..") {
        this.segments.splice(i-1,2);
        i -= 2;
      }
      if (this.segments[i]==".") {
        this.segments.splice(i,1);
        i--;
      }
    }
    this.path = this.segments.length==0 ? "/" : "/"+this.segments.join("/")+end;
    this.schemeSpecificPart = "//"+this.authority+this.path;
    if (typeof this.query != "undefined") {
      this.schemeSpecificPart += "?" + this.query;
    }
    if (typeof this.fragment != "undefined") {
      this.schemeSpecificPart += "#" + this.fragment;
    }
    this.spec = this.scheme+":"+this.schemeSpecificPart;
  }
  parsed.resolve = function(href) {
    if (!href) {
      return this.spec;
    }
    if (href.charAt(0)=='#') {
      var lastHash = this.spec.lastIndexOf('#');
      return lastHash<0 ? this.spec+href : this.spec.substring(0,lastHash)+href;
    }
    if (!this.isGeneric) {
      throw "Cannot resolve uri against non-generic URI: "+this.spec;
    }
    var colon = href.indexOf(':');
    if (href.charAt(0)=='/') {
      return this.scheme+"://"+this.authority+href;
    } else if (href.charAt(0)=='.' && href.charAt(1)=='/') {
      if (this.path.charAt(this.path.length-1)=='/') {
        return this.scheme+"://"+this.authority+this.path+href.substring(2);
      } else {
        var last = this.path.lastIndexOf('/');
        return this.scheme+"://"+this.authority+this.path.substring(0,last)+href.substring(1);
      }
    } else if (URIResolver.SCHEME.test(href)) {
      return href;
    } else if (href.charAt(0)=="?") {
      return this.scheme+"://"+this.authority+this.path+href;
    } else {
      if (this.path.charAt(this.path.length-1)=='/') {
        return this.scheme+"://"+this.authority+this.path+href;
      } else {
        var last = this.path.lastIndexOf('/');
        return this.scheme+"://"+this.authority+this.path.substring(0,last+1)+href;
      }
    }
  };
  parsed.relativeTo = function(otherURI) {
    if (otherURI.scheme!=this.scheme) {
      return this.spec;
    }
    if (!this.isGeneric) {
      throw "A non generic URI cannot be made relative: "+this.spec;
    }
    if (!otherURI.isGeneric) {
      throw "Cannot make a relative URI against a non-generic URI: "+otherURI.spec;
    }
    if (otherURI.authority!=this.authority) {
      return this.spec;
    }
    var i=0;
    for (; i<this.segments.length && i<otherURI.segments.length; i++) {
      if (this.segments[i]!=otherURI.segments[i]) {
        //alert(this.path+" different from "+otherURI.path+" at '"+this.segments[i]+"' vs '"+otherURI.segments[i]+"'");
        var relative = "";
        for (var j=i; j<otherURI.segments.length; j++) {
          relative += "../";
        }
        for (var j=i; j<this.segments.length; j++) {
          relative += this.segments[j];
          if ((j+1)<this.segments.length) {
            relative += "/";
          }
        }
        if (this.path.charAt(this.path.length-1)=='/') {
          relative += "/";
        }
        return relative;
      }
    }
    if (this.segments.length==otherURI.segments.length) {
      return this.hash ? this.hash : (this.query ? this.query : "");
    } else if (i<this.segments.length) {
      var relative = "";
      for (var j=i; j<this.segments.length; j++) {
        relative += this.segments[j];
        if ((j+1)<this.segments.length) {
          relative += "/";
        }
      }
      if (this.path.charAt(this.path.length-1)=='/') {
        relative += "/";
      }
      return relative;
    } else {
      throw "Cannot calculate a relative URI for "+this.spec+" against "+otherURI.spec;
    }
  };
  return parsed;
}

URIResolver.prototype.parseGeneric = function(parsed) {
  if (parsed.schemeSpecificPart.charAt(0)!='/' || parsed.schemeSpecificPart.charAt(1)!='/') {
    throw "Generic URI values should start with '//':"+parsed.spec;
  }

  var work = parsed.schemeSpecificPart.substring(2);
  var pathStart = work.indexOf("/");
  parsed.authority = pathStart<0 ? work : work.substring(0,pathStart);
  parsed.path = pathStart<0 ? "" : work.substring(pathStart);
  var hash = parsed.path.indexOf('#');
  if (hash>=0) {
    parsed.fragment = parsed.path.substring(hash+1);
    parsed.path = parsed.path.substring(0,hash);
  }
  var questionMark = parsed.path.indexOf('?');
  if (questionMark>=0) {
    parsed.query = parsed.path.substring(questionMark+1);
    parsed.path = parsed.path.substring(0,questionMark);
  }
  if (parsed.path=="/" || parsed.path=="") {
    parsed.segments = [];
  } else {
    parsed.segments = parsed.path.split(/\//);
    if (parsed.segments.length>0 && parsed.segments[0]=='' && parsed.path.length>1 && parsed.path.charAt(1)!='/') {
      // empty segment at the start, remove it
      parsed.segments.shift();
    }
    if (parsed.segments.length>0 && parsed.path.length>0 && parsed.path.charAt(parsed.path.length-1)=='/' && parsed.segments[parsed.segments.length-1]=='') {
      // we may have an empty the end
      // check to see if it is legimate
      if (parsed.path.length>1 && parsed.path.charAt(parsed.path.length-2)!='/') {
        parsed.segments.pop();
      }
    }
    // check for non-escaped characters
    for (var i=0; i<parsed.segments.length; i++) {
      var check = parsed.segments[i].split(/%[A-Za-z0-9][A-Za-z0-9]|[\ud800-\udfff][\ud800-\udfff]|[A-Za-z0-9\-\._~!$&'()*+,;=@:\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/);

      for (var j=0; j<check.length; j++) {
        if (check[j].length>0) {
          throw "Unecaped character "+check[j].charAt(0)+" ("+check[j].charCodeAt(0)+") in URI "+parsed.spec;
        }
      }
    }
  }
  parsed.isGeneric = true;
}



//var MicrodataProcessor = {};
MicrodataProcessor.prototype = new URIResolver();
MicrodataProcessor.prototype.constructor=MicrodataProcessor;
function MicrodataProcessor() {
  this.blankCounter = 0;
  this.vocabularies = [
    { namespaceURI: "http://schema.org/",
      isMember: function(uri) {
        return uri.indexOf(this.namespaceURI)==0;
      },
      getProperty: function(name) {
        return this.namespaceURI+name;
      }
    }
  ];
}
MicrodataProcessor.absoluteURIRE = /[\w\_\-]+:\S+/;

MicrodataProcessor.prototype.newBlankNode = function() {
  this.blankCounter++;
  return "_:"+this.blankCounter;
};

MicrodataProcessor.prototype.resolve = function (uri) {
  return uri;
};

MicrodataProcessor.prototype.createBaseURI = function(baseURI) {
  var hash = baseURI.indexOf("#");
  if (hash>=0) {
    baseURI = baseURI.substring(0,hash);
  }
  return this.parseURI(baseURI);
}

MicrodataProcessor.trim = function(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

MicrodataProcessor.tokenize = function(str) {
  return MicrodataProcessor.trim(str).split(/\s+/);
}


MicrodataProcessor.prototype.getVocabulary = function(uri) {
  for (var i=0; i<this.vocabularies.length; i++) {
    if (this.vocabularies[i].isMember(uri)) {
      return this.vocabularies[i];
    }
  }
  var makeVocab = function(ns) {
    return {
      namespaceURI: ns,
      getProperty: function(name) {
        return this.namespaceURI+name;
      }
    };
  };
  var hash = uri.indexOf("#")
  if (hash>=0) {
    return makeVocab(uri.substring(0,hash+1));
  }
  var lastSlash = uri.lastIndexOf("/");
  if (lastSlash>=0) {
    return makeVocab(uri.substring(0,lastSlash+1));
  }
  return makeVocab(uri);
}

MicrodataProcessor.prototype.getProperty = function(value,vocabulary,base) {
  if (MicrodataProcessor.absoluteURIRE.exec(value)) {
    return value;
  }
  return vocabulary ? vocabulary.getProperty(value) : base.resolve('#' + value);
}

MicrodataProcessor.valueMappings = {
  "meta" : function(node) {
    return rdf.createLiteral(node.getAttribute("content"));
  },
  "audio" : function(node,base) {
    return rdf.createNamedNode(base.resolve(node.getAttribute("src")));
  },
  "a" : function(node,base) {
    return rdf.createNamedNode(base.resolve(node.getAttribute("href")));
  },
  'data': function (node) {
    var
      value = node.getAttribute('value'),
      type = null;

    if (value === parseInt(value).toString()) {
      type = 'http://www.w3.org/2001/XMLSchema#integer';
    } else if (value === parseFloat(value).toString()) {
      type = 'http://www.w3.org/2001/XMLSchema#double';
    }

    if (type != null) {
      return rdf.createLiteral(value, null, rdf.createNamedNode(type));
    } else {
      return rdf.createLiteral(value);
    }
  },
  "object" : function(node,base) {
    return rdf.createNamedNode(base.resolve(node.getAttribute("data")));
  },
  "time" : function(node) {
    var
      datetime = node.getAttribute("datetime"),
      type = null;

    //TODO: use RegExp
    if (datetime.length === 9) {
      type = 'http://www.w3.org/2001/XMLSchema#time';
    } else if (datetime.length === 20) {
      type = 'http://www.w3.org/2001/XMLSchema#dateTime';
    } else if (datetime.substr(0, 1) === 'P') {
      type = 'http://www.w3.org/2001/XMLSchema#duration';
    }

    if (type != null) {
      return rdf.createLiteral(datetime, null, rdf.createNamedNode(type));
    } else {
      return rdf.createLiteral(datetime);
    }
  }
};

MicrodataProcessor.valueMappings["embed"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["iframe"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["img"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["source"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["track"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["video"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["area"] = MicrodataProcessor.valueMappings["a"];
MicrodataProcessor.valueMappings["link"] = MicrodataProcessor.valueMappings["a"];
MicrodataProcessor.valueMappings['meter'] = MicrodataProcessor.valueMappings['data'];

MicrodataProcessor.prototype.getValue = function(node,base) {
  var converter = MicrodataProcessor.valueMappings[node.localName];

  if (converter != null) {
    return converter(node, base);
  }

  return rdf.createLiteral(node.textContent);
};

MicrodataProcessor.objectURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#object";
MicrodataProcessor.PlainLiteralURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral";
MicrodataProcessor.typeURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

MicrodataProcessor.prototype.process = function(node, callback, base) {
  var
    self = this,
    itemScopMap = {};

  if (node.nodeType == node.DOCUMENT_NODE) {
    node = node.documentElement;
  }

  base = this.parseURI(base);

  var queue = [{ current: node, context: this.push(null,null) }];

  var processScope = function (current, context) {
    // if there is an itemId we create a NamedNode otherwise a BlankNode
    var itemId = current.getAttribute("itemid");

    context.subject = itemId ?  rdf.createNamedNode(base.resolve(itemId)) : rdf.createBlankNode();

    // process all defined itemTypes
    var itemType = current.getAttribute("itemtype");

    if (itemType) {
      var tokens = MicrodataProcessor.tokenize(itemType);

      for (var i=0; i<tokens.length; i++) {
        try {
          // check if token is a valid URI
          self.parseURI(tokens[i]);

          if (i === 0) {
            context.vocabulary = self.getVocabulary(itemType);
          }

          callback(rdf.createTriple(
            context.subject,
            rdf.createNamedNode(MicrodataProcessor.typeURI),
            rdf.createNamedNode(tokens[i])));
        } catch (e) {}
      }
    }

    var itemRef = current.getAttribute("itemref");

    if (itemRef) {
      var tokens = MicrodataProcessor.tokenize(itemRef);

      tokens.forEach(function (token) {
        if (!(token in itemScopMap)) {
          itemScopMap[token] = [];
        }

        itemScopMap[token].push(context);
      });
    }
  };

  var processProp = function (current, context) {
    var
      itemProp = current.getAttribute("itemprop"),
      itemPropReverse = current.getAttribute('itemprop-reverse'),
      tokens,
      value;

    if (itemPropReverse) {
      itemProp = itemPropReverse;
    }

    if (!itemProp) {
      return;
    }

    if (!context.subject) {
      return;
    }

    tokens = MicrodataProcessor.tokenize(itemProp);
    value = self.getValue(current, base);

    // make triples with the new subject and predicates
    for (var i=0; i<tokens.length; i++) {
      var prop = tokens[i].length > 0 ? self.getProperty(tokens[i], context.vocabulary, base) : null;

      if (!prop) {
        continue;
      }

      if (context.parent && context.parent.subject && context.subject && context.parent.subject != context.subject) {
        if (!itemPropReverse) {
          callback(rdf.createTriple(
            context.parent.subject,
            rdf.createNamedNode(self.getProperty(prop, context.vocabulary)),
            context.subject));
        } else {
          callback(rdf.createTriple(
            context.subject,
            rdf.createNamedNode(self.getProperty(prop, context.vocabulary)),
            context.parent.subject));
        }
      } else {
        if (!itemPropReverse) {
          callback(rdf.createTriple(
            context.subject,
            rdf.createNamedNode(prop),
            value));
        } else {
          callback(rdf.createTriple(
            value,
            rdf.createNamedNode(prop),
            context.subject));
        }
      }
    }
  };

  var enqueueChildren = function (current, context) {
    for (var child = current.lastChild; child; child = child.previousSibling) {
      if (child.nodeType == child.ELEMENT_NODE) {
        queue.unshift({ current: child, context: self.push(context)});
      }
    }
  };

  while (queue.length > 0) {
    var
      item = queue.shift(),
      current = item.current,
      context = item.context;

    var itemScope = current.hasAttribute("itemscope");

    if (itemScope) {
      processScope(current, context);
    } else {
      var id = current.getAttribute('id');

      if (id in itemScopMap) {
        itemScopMap[id].forEach(function (refContext) {
          processProp(current, refContext);

          enqueueChildren(current, refContext);
        });
      }
    }

    processProp(current, context);

    enqueueChildren(current, context);

    /*for (var child = current.lastChild; child; child = child.previousSibling) {
      if (child.nodeType == child.ELEMENT_NODE) {
        queue.unshift({ current: child, context: this.push(context)});
      }
    }*/
  }
};

MicrodataProcessor.prototype.push = function(parent, subject, vocabulary) {
  return {
    parent: parent,
    subject: subject ? subject : (parent ? parent.subject : null),
    vocabulary: vocabulary ? vocabulary : (parent ? parent.vocabulary : null)
  };
};

var MicrodataParser = function (rdf, options) {
  if (options == null) {
    options = {};
  }

  if (!('parseXml' in options)) {
    if (isNode) {
      options.parseDom = function (toparse, base) {
        var parser = new (require('xmldom').DOMParser);

        return parser.parseFromString(toparse, 'text/html');
      };
    } else {
      options.parseDom = function (toparse, base) {
        var parser = new DOMParser();

        return parser.parseFromString(toparse, 'text/html');
      }
    }
  }

  var processor = new MicrodataProcessor();

  this.process = function (data, callback, base, filter, done) {
    if (base == null) {
      base = '';
    }

    if (filter == null) {
      filter = function () { return true; };
    }

    if (done == null) {
      done = function () {};
    }

    processor.process(options.parseDom(data, base), callback, base);

    done(true);

    return true;
  };

  this.parse = function (data, callback, base, filter, graph) {
    if (graph == null) {
      graph = rdf.createGraph();
    }

    return this.process(
      data,
      function (triple) { graph.add(triple); },
      base,
      filter,
      function (success) { callback(success ? graph : null); });
  };
};


if (isNode) {
  module.exports = function (rdf) {
    rdf.MicrodataParser = MicrodataParser.bind(null, rdf);

    var parser = new MicrodataParser(rdf);
    rdf.parseMicrodata = parser.parse.bind(parser);
  };

  module.exports.parser = MicrodataParser;
} else {
  if (typeof rdf === 'undefined') {
    rdf = {};
  }

  rdf.MicrodataParser = MicrodataParser.bind(null, rdf);

  var parser = new MicrodataParser(rdf);
  rdf.parseMicrodata = parser.parse.bind(parser);
}