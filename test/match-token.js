'use strict';
/*jshint asi: true*/

var test = require('trap').test
  , format = require('util').format
  , matchToken = require('..')

test('illegal inputs', function (t) {
  t.throws(function () { matchToken(null, 0) }, /string cannot be null or undefined/, 'throws when string is null')  
  t.throws(function () { matchToken() }, /string cannot be null or undefined/, 'throws when string is undefined')  
  t.throws(function () { matchToken('', 0) }, /index must be within the.+string/, 'throws out of range for empty string and index 0')  
  t.throws(function () { matchToken('a', 1) }, /index must be within the.+string/, 'throws out of range for "a" string and index 1')  
})

test('legal inputs', function (t) {
  function check(t, s, index, expected) {
    // console.log( s.split('').map(function (c, indx) { return indx + ':' + c; }).join(' ') )

    t.equal(matchToken(s, index), expected, format('matching: %s at index: %d "%s" returns %d "%s"', s, index, s[index] || '', expected, s[expected] || ''))

    if (expected > -1) {
      // matches should work in both directions
      var tmp = index;
      index = expected;
      expected = tmp;
      t.equal(matchToken(s, index), expected, format('matching: %s at index: %d "%s" returns %d "%s"\n', s, index, s[index], expected, s[expected]))
    }
  }

  t.test('complete open/close', function (t) {
    check(t, 'a', 0, -1)
    check(t, '(a)', 0, 2)
    check(t, '{{a}}', 0, 4)
    check(t, '{{a}}', 1, 3)
    check(t, '{[{a}]}', 1, 5)

    check(t, '({[{a}]})', 0, 8)

    check(t, 'function foo() { console.log("hello") "}', 12, 13)
    check(t, 'function foo() { console.log("hello") "}', 15, 39)
    check(t, 'function foo() { console.log("hello") "}', 28, 36)

    check(t, 'var a = [ { foo: "bar", bar: "foo" } ]', 8, 37)
    check(t, 'var a = [ { foo: "bar", bar: "foo" } ]', 10, 35)
  })

  t.test('incomplete open/close', function (t) {
    check(t, 'var a = [ { foo: "bar", bar: "foo" }', 8, -1)
    check(t, 'var a = [ { foo: "bar", bar: "foo" } ]', 8, 37)
  })
});
