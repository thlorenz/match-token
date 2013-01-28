'use strict';

var tokenRegex = /[{}()"'\[\]]/g
  , openClose = { 
       '{': '}'
     , '[': ']'
     , '(': ')'
    }
  , closeOpen = { };

Object.keys(openClose).forEach(function (k) { closeOpen[openClose[k]] = k; });

function findCloser(s, index, opener, closer) {
  var neededClosers = 1;
  
  for(var i = index + 1; i < s.length; i++) {
    if (s[i] === opener) neededClosers++;
    if (s[i] === closer) neededClosers--;
    if (neededClosers === 0) return i;
  }
  return -1;
}

function findOpener(s, index, closer, opener) {
  var neededOpeners = 1;
  
  for(var i = index - 1; i > -1; i--) {
    if (s[i] === closer) neededOpeners++;
    if (s[i] === opener) neededOpeners--;
    if (neededOpeners === 0) return i;
  }
  return -1;
}

module.exports = function matchToken(s, index) {

  if (s === null || s === undefined) throw new Error('The given string cannot be null or undefined');

  var len = s.length;
  if (index >= len) throw new Error('The given index must be within the given string');

  // short cut if no desired tokens are contained in the string
  // if (!tokenRegex.test(s)) return -1; // breaks if multiple tests run together

  var c = s[index]
    , matching = openClose[c];

  if (matching) return findCloser(s, index, c, matching);
  matching = closeOpen[c];
  if (matching) return findOpener(s, index, c, matching);

  return -1;
};
