# match-token [![build status](https://secure.travis-ci.org/thlorenz/match-token.png)](http://next.travis-ci.org/thlorenz/match-token)

Given a string and a position, it finds the position of the token matching the one at the given position.

```js
var matchToken = require('match-token');

matchToken('{1}', 0) // -> 2
matchToken('{1}', 2) // -> 0


//          012345678901234
matchToken('var foo = "bar"', 10) // -> 14 (quotes)

matchToken('{{1}}', 0) // -> 4 (outer brace)
matchToken('{{1}}', 1) // -> 3 (inner brace)
```

## Installation

    npm i match-token

## Features

Matches the following tokens in a given string.

- `{` with `}` and vice versa
- `(` with `)` and vice versa
- `[` with `]` and vice versa
- quotes `'` and `"`

Returns position of match in the string or `-1` if it was either not found or the the inputs were invalid (i.e. the
string was `null` or `undefined` or the index was out of range).

## Caveats

Not meant to be perfect, i.e. does no code parsing in order to be able to handle incomplete code.

Simply counts opening vs. closing tokens and therefore does nothing special if a token appears in a string for instance.

```js
//          0123456789 
matchToken('{ a: "}" }', 0) // -> 6 (although it is in a string)
```

In order to disambiguate between quotes, i.e., when not sure if given quote is the opener or close, it uses the match
that puts the least distance between opening an closing quotes.
