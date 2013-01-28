'use strict';

var tokenRegex = /[{}()"'\[\]]/g
  , openClose = { 
       '{': '}'
     , '[': ']'
     , '(': ')'
    }
  , closeOpen = { }
  , quotes = { '\'': true, '"': true };

Object.keys(openClose).forEach(function (k) { closeOpen[openClose[k]] = k; });

function findCloser(s, index, opener, closer) {
  var neededClosers = 1;
  
  for(var i = index + 1; i < s.length; i++) {
    if (s[i] === closer) neededClosers--;
    else if (s[i] === opener) neededClosers++;

    if (neededClosers === 0) return i;
  }
  return -1;
}

function findOpener(s, index, closer, opener) {
  var neededOpeners = 1;
  
  for(var i = index - 1; i > -1; i--) {
    if (s[i] === opener) neededOpeners--;
    else if (s[i] === closer) neededOpeners++;

    if (neededOpeners === 0) return i;
  }
  return -1;
}

module.exports = function matchToken(s, index) {
  // TODO:
  // Sweep string, mark tokens NOT inside quotes, mark quotes as openers/closers
  // Possibly collect potential matches in to array, i.e. for } collect all {s so we can count backwards to later find the match

  if (s === null || s === undefined) return -1;
  if (index >= s.length) return -1;

  // short cut if no desired tokens are contained in the string
  // if (!tokenRegex.test(s)) return -1; // breaks if multiple tests run together

  var c = s[index]
    , matching = openClose[c];

  if (matching) return findCloser(s, index, c, matching);

  matching = closeOpen[c];
  if (matching) return findOpener(s, index, c, matching);

  matching = quotes[c];
  if (matching) { 
    var quoteOpener = findOpener(s, index, c, c)
      , quoteCloser = findCloser(s, index, c, c);
    
    // right now we are not smart about finding the match in the right direction
    // so at this point we select the closest one
    if (quoteOpener < 0) return quoteCloser;
    if (quoteCloser < 0) return quoteOpener;
    
    var openerDist = index - quoteOpener
      , closerDist = quoteCloser - index;

    return openerDist < closerDist ? quoteOpener : quoteCloser;
  }

  return -1;
};
