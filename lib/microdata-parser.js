/* global rdf */
'use strict';


var
  URIResolver = require('./uri-resolver');


var MicrodataProcessor = function () {
  this.blankCounter = 0;

  this.vocabularies = [{
    namespaceURI: 'http://schema.org/',
    isMember: function (uri) {
      return uri.indexOf(this.namespaceURI) === 0;
    },
    getProperty: function (name) {
      return this.namespaceURI + name;
    }
  }];
};

MicrodataProcessor.prototype = new URIResolver();
MicrodataProcessor.prototype.constructor = MicrodataProcessor;

MicrodataProcessor.typeNode = rdf.createNamedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
MicrodataProcessor.integerNode = rdf.createNamedNode('http://www.w3.org/2001/XMLSchema#integer');
MicrodataProcessor.doubleNode = rdf.createNamedNode('http://www.w3.org/2001/XMLSchema#double');
MicrodataProcessor.timeNode = rdf.createNamedNode('http://www.w3.org/2001/XMLSchema#time');
MicrodataProcessor.dateTimeNode = rdf.createNamedNode('http://www.w3.org/2001/XMLSchema#dateTime');
MicrodataProcessor.durationNode = rdf.createNamedNode('http://www.w3.org/2001/XMLSchema#duration');

MicrodataProcessor.absoluteURIRE = /[\w\_\-]+:\S+/;

MicrodataProcessor.prototype.resolve = function (uri) {
  return uri;
};

MicrodataProcessor.trim = function (str) {
  str = str || '';

  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

MicrodataProcessor.tokenize = function (str) {
  return MicrodataProcessor
    .trim(str)
    .split(/\s+/)
    .reduce(function (tokens, token) {
      if (token) {
        tokens.push(token);
      }

      return tokens;
    }, []);
};

MicrodataProcessor.prototype.getVocabulary = function (uri) {
  for (var i=0; i<this.vocabularies.length; i++) {
    if (this.vocabularies[i].isMember(uri)) {
      return this.vocabularies[i];
    }
  }

  var makeVocab = function(ns) {
    return {
      namespaceURI: ns,
      getProperty: function(name) {
        return this.namespaceURI + name;
      }
    };
  };

  var hash = uri.indexOf("#");

  if (hash >= 0) {
    return makeVocab(uri.substring(0,hash+1));
  }

  var lastSlash = uri.lastIndexOf('/');

  if (lastSlash >= 0) {
    return makeVocab(uri.substring(0,lastSlash+1));
  }

  return makeVocab(uri);
};

MicrodataProcessor.prototype.getProperty = function (value, vocabulary) {
  if (MicrodataProcessor.absoluteURIRE.exec(value)) {
    return value;
  }

  return vocabulary ? vocabulary.getProperty(value) : base.resolve('#' + value);
};

MicrodataProcessor.valueMappings = {
  link: function(node,base) {
    return rdf.createNamedNode(base.resolve(node.getAttribute('href')));
  },
  media: function (node, base) {
    return rdf.createNamedNode(base.resolve(node.getAttribute('src')));
  },
  meta: function (node) {
    var
      value = node.getAttribute('content'),
      lang = node.getAttribute('lang');

    return rdf.createLiteral(value, lang ? lang : null);
  },
  number: function (node) {
    var value = node.getAttribute('value');

    if (value === parseInt(value).toString()) {
      return rdf.createLiteral(value, null, MicrodataProcessor.integerNode);
    } else if (value === parseFloat(value).toString()) {
      return rdf.createLiteral(value, null, MicrodataProcessor.doubleNode);
    } else {
      return rdf.createLiteral(value);
    }
  },
  object: function (node, base) {
    return rdf.createNamedNode(base.resolve(node.getAttribute('data')));
  },
  time: function(node) {
    var
      value = node.getAttribute('datetime'),
      lang = node.getAttribute('lang');

    //TODO: add http://www.w3.org/2001/XMLSchema#gYearMonth.
    //TODO: add http://www.w3.org/2001/XMLSchema#gYear.
    //TODO: use RegExp
    if (value.length === 9) {
      return rdf.createLiteral(value, null, MicrodataProcessor.timeNode);
    } else if (value.length === 20) {
      return rdf.createLiteral(value, null, MicrodataProcessor.dateTimeNode);
    } else if (value.substr(0, 1) === 'P') {
      return rdf.createLiteral(value, null, MicrodataProcessor.durationNode);
    } else {
      return rdf.createLiteral(value, lang ? lang : null);
    }
  }
};

MicrodataProcessor.valueMappings.a = MicrodataProcessor.valueMappings.link;
MicrodataProcessor.valueMappings.area = MicrodataProcessor.valueMappings.a;
MicrodataProcessor.valueMappings.audio = MicrodataProcessor.valueMappings.media;
MicrodataProcessor.valueMappings.data = MicrodataProcessor.valueMappings.number;
MicrodataProcessor.valueMappings.embed = MicrodataProcessor.valueMappings.media;
MicrodataProcessor.valueMappings.iframe = MicrodataProcessor.valueMappings.media;
MicrodataProcessor.valueMappings.img = MicrodataProcessor.valueMappings.media;
MicrodataProcessor.valueMappings.meter = MicrodataProcessor.valueMappings.number;
MicrodataProcessor.valueMappings.source = MicrodataProcessor.valueMappings.media;
MicrodataProcessor.valueMappings.track = MicrodataProcessor.valueMappings.media;
MicrodataProcessor.valueMappings.video = MicrodataProcessor.valueMappings.media;

MicrodataProcessor.prototype.getValue = function(node, base) {
  var converter = MicrodataProcessor.valueMappings[node.localName];

  if (converter) {
    return converter(node, base);
  }

  return rdf.createLiteral(node.textContent);
};

MicrodataProcessor.prototype.process = function (node, callback, base) {
  var
    self = this;

  if (node.nodeType === node.DOCUMENT_NODE) {
    node = node.documentElement;
  }

  base = self.parseURI(base);

  var createContext = function (memory, subject, type, vocabulary) {
    return {
      memory: memory ? memory : {},
      subject: subject,
      type: type,
      vocabulary: vocabulary
    };
  };

  var processChildren = function (current, type) {
    var
      context,
      itemProp,
      itemScope,
      predicate,
      subject,
      value;

    for (var child = current.item.firstChild; child; child = child.nextSibling) {
      if (child.nodeType !== child.ELEMENT_NODE) {
        continue;
      }

      itemProp = child.getAttribute('itemprop');
      itemScope = child.hasAttribute('itemscope');

      // spec 6.3.9.1.1
      context = createContext(current.context.memory, current.context.subject, type, current.context.vocabulary);

      subject = generateTriple({item: child, context: context});

      if (itemProp) {
        // spec 6.3.9.1
        MicrodataProcessor.tokenize(itemProp).forEach(function (token) {
          // spec 6.3.9.1.2
          //TODO: Let predicate be the result of generate predicate URI using context and name
          if (MicrodataProcessor.absoluteURIRE.test(token)) {
            predicate = rdf.createNamedNode(token);
          } else if (context.vocabulary) {
            predicate = rdf.createNamedNode(context.vocabulary + token);
          } else {
            predicate = rdf.createNamedNode(base.resolve('#' + token));
          }

          // spec 6.3.9.1.3
          //TODO: Let value be the property value of element
          value = self.getValue(child, base);

          // spec 6.3.9.1.4
          //TODO: If value is an item, then generate the triples for value using context. Replace value by the subject returned from those steps
          if (itemScope) {
            value = subject;
          }

          // spec 6.3.9.1.5

          callback(rdf.createTriple(
            current.context.subject,
            predicate,
            value
          ));

          // spec 6.3.9.1.6
          //TODO: If an entry exists in the registry for name in the vocabulary associated with vocab having the key subPropertyOf or equivalentProperty, for each such value equiv, generate the following triple:
        });
      }
    }
  };

  var processSubject = function (current) {
    var
      itemType = current.item.getAttribute('itemtype'),
      type,
      vocab;

    // spec 6.3.3
    MicrodataProcessor.tokenize(itemType).forEach(function (token) {
      if (!MicrodataProcessor.absoluteURIRE.test(token)) {
        return;
      }

      // spec 6.3.4
      if (!type) {
        type = token;
      }

      callback(rdf.createTriple(
        current.context.subject,
        MicrodataProcessor.typeNode,
        rdf.createNamedNode(base.resolve(token))));
    });

    // spec 6.3.5
    if (!type) {
      type = current.context.type;
    }

    // spec 6.3.6
    //TODO: If the registry contains a URI prefix that is a character for character match of type up to the length of the URI prefix, set vocab as that URI prefix
    // spec 6.3.7
    //TODO: Otherwise, if type is not empty, construct vocab by removing everything following the last SOLIDUS U+002F ("/") or NUMBER SIGN U+0023 ("#") from the path component of type
    if (type) {
      vocab = self.getVocabulary(type); //TODO: return only uri string
      vocab = vocab ? vocab.namespaceURI : null;
    }

    // spec 6.3.8
    //TODO: Update evaluation context setting current vocabulary to vocab
    if (vocab) {
      current.context.vocabulary = vocab;
    }

    // spec 6.3.9
    processChildren(current, type);
  };

  var generateTriple = function (current) {
    var
      id = current.item.getAttribute('id'),
      itemId = current.item.getAttribute('itemid'),
      itemRef = current.item.getAttribute('itemref'),
      itemScope = current.item.hasAttribute('itemscope');

    // spec 6.3.1
    if (id in current.context.memory) {
      current.context.memory[id].forEach(function (context) {
        processSubject({item: current.item, context: context});
      });
    } else {
      if (itemScope) {
        if (itemId) {
          current.context.subject = rdf.createNamedNode(base.resolve(itemId));
        } else {
          current.context.subject = rdf.createBlankNode();
        }

        // spec 6.3.2
        //TODO: Add a mapping from item to subject in memory
        MicrodataProcessor.tokenize(itemRef).forEach(function (token) {
          if (!(token in current.context.memory)) {
            current.context.memory[token] = [];
          }

          current.context.memory[token].push(current.context);
        });
      }

      processSubject(current);
    }

    return current.context.subject;
  };

  generateTriple({item: node, context: createContext(null, null, null, null)});
};

var MicrodataParser = function (rdf) {
  var processor = new MicrodataProcessor();

  this.process = function (data, callback, base, filter, done) {
    base = base || '';
    filter = filter || function () { return true; };
    done = done || function () {};

    processor.process(rdf.parseHtml(data, base), callback, base);

    done(true);

    return true;
  };

  this.parse = function (data, callback, base, filter, graph) {
    graph = graph || rdf.createGraph();

    return this.process(
      data,
      function (triple) { graph.add(triple); },
      base,
      filter,
      function (success) { callback(success ? graph : null); });
  };
};


module.exports = function (rdf) {
  rdf.MicrodataParser = MicrodataParser.bind(null, rdf);

  var parser = new MicrodataParser(rdf);
  rdf.parseMicrodata = parser.parse.bind(parser);
};
