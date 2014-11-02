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

MicrodataProcessor.prototype.getProperty = function(value,vocabulary) {
  if (MicrodataProcessor.absoluteURIRE.exec(value)) {
    return value;
  }
  return vocabulary ? vocabulary.getProperty(value) : null;
}

MicrodataProcessor.valueMappings = {
  "meta" : function(node,base) { return node.getAttribute("content"); },
  "audio" : function(node,base) { return base.resolve(node.getAttribute("src")); },
  "a" : function(node,base) { return base.resolve(node.getAttribute("href")); },
  "object" : function(node,base) { return base.resolve(node.getAttribute("data")); },
  "time" : function(node,base) { var datetime = node.getAttribute("datetime"); return datetime ? datetime : node.textContent; }
};
MicrodataProcessor.valueMappings["embed"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["iframe"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["img"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["source"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["track"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["video"] = MicrodataProcessor.valueMappings["audio"];
MicrodataProcessor.valueMappings["area"] = MicrodataProcessor.valueMappings["a"];
MicrodataProcessor.valueMappings["link"] = MicrodataProcessor.valueMappings["a"];
MicrodataProcessor.prototype.getValue = function(node,base) {
  var converter = MicrodataProcessor.valueMappings[node.localName];

  if (converter != null) {
    return {
      type: null,
      value: converter(node, base)
    }
  }

  return {
    type: MicrodataProcessor.PlainLiteralURI,
    value: node.textContent
  }
}

MicrodataProcessor.objectURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#object";
MicrodataProcessor.PlainLiteralURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral";
MicrodataProcessor.typeURI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

MicrodataProcessor.prototype.process = function(node, callback, base) {
  if (node.nodeType==node.DOCUMENT_NODE) {
    node = node.documentElement;
  }

  base = this.parseURI(base);

  var queue = [];
  queue.push({ current: node, context: this.push(null,null) });
  while (queue.length>0) {
    var item = queue.shift();
    var current = item.current;
    var context = item.context;
    //var base = this.createBaseURI(current.baseURI);
    var subject = null;
    var vocabulary = context.vocabulary;
    var itemScope = current.hasAttribute("itemscope");
    if (itemScope) {
      //console.log("Item at "+current.tagName+", parent.subject="+context.subject);
      var itemType = current.getAttribute("itemtype");
      var itemId = current.getAttribute("itemid");
      if (itemType) {
        vocabulary = this.getVocabulary(itemType);
        subject = itemId ? itemId : this.newBlankNode();
        callback(this.addTriple(current,subject,MicrodataProcessor.typeURI, {type: MicrodataProcessor.objectURI, value: itemType}));
      }
    }
    var itemProp = current.getAttribute("itemprop");
    if (itemProp) {
      //console.log("Property "+itemProp+" at "+current.tagName+", parent.subject="+context.subject);
      var tokens = MicrodataProcessor.tokenize(itemProp);
      if (itemScope) {
        // Only make a triple if there is both a parent subject and new subject
        if (context.subject && subject) {
          // make a triple with the new subject as the object
          callback(this.addTriple(current, context.subject, this.getProperty(itemProp, vocabulary), { type: MicrodataProcessor.objectURI, value: subject}));
        }
      } else if (vocabulary) {
        if (!subject) {
          subject = context.subject;
        }
        if (subject) {
          var value = this.getValue(current,base);
          // make a triple with the new subject and predicate
          for (var i=0; i<tokens.length; i++) {
            var prop = tokens[i].length>0 ? this.getProperty(tokens[i],vocabulary) : null;
            if (!prop) {
              continue;
            }
            callback(this.addTriple(current, subject, prop, value));
          }
        }
      }
    }
    for (var child = current.lastChild; child; child = child.previousSibling) {
      if (child.nodeType==child.ELEMENT_NODE) {
        queue.unshift({ current: child, context: this.push(context,subject,vocabulary)});
      }
    }
  }
}

MicrodataProcessor.prototype.push = function(parent,subject,vocabulary) {
  return {
    parent: parent,
    subject: subject ? subject : (parent ? parent.subject : null),
    vocabulary: vocabulary ? vocabulary : (parent ? parent.vocabulary : null)
  };
}


var nodeCache = {};

var getNode = function (node) {
  if (typeof node === 'object') {
    if (node.type === 'http://www.w3.org/1999/02/22-rdf-syntax-ns#PlainLiteral') {
      return rdf.createLiteral(node.value);
    } else {
      node = node.value;
    }
  }

  // is it a blank node?
  if (node.indexOf('_:') === 0) {
    // is there already a node?
    if (node in nodeCache) {
      return nodeCache[node];
    }

    return nodeCache[node] = rdf.createBlankNode(node);
  }

  return rdf.createNamedNode(node);
};


MicrodataProcessor.prototype.addTriple = function(origin, subject, predicate, object) {
  return rdf.createTriple(
    getNode(subject),
    getNode(predicate),
    getNode(object)
  );
};

var MicrodataParser = function (rdf, options) {
  if (options == null) {
    options = {};
  }

  if (isNode) {
    //TODO: change to jsdom
    // Node.js handles the XMLDOM dependency
    // use options.parseXml in the browser if you want to parse a string
    var jsdom = require('jsdom');

    options.parseDom = function (toparse, base, callback) {
      /*jsdom.env({html: toparse, url: base, done: function(error, window) {
        if (error != null) {
          callback(null);
        } else {
          callback(window.document);
        }
      }});*/

      var DOMParser = require('xmldom').DOMParser;

      var parser = new DOMParser();

      callback(parser.parseFromString(toparse, 'text/html'));
    };
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

    //var subjects = [];

    options.parseDom(data, base, function(document) {
      processor.process(document, callback, base);

      done(true);
    });

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