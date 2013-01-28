'use strict';
/*jshint asi: true*/

var test = require('trap').test
  , format = require('util').format
  , matchToken = require('..')

function check(t, s, index, expected) {
  // console.log( s.split('').map(function (c, indx) { return indx + ':' + c; }).join(' ') )

  t.equal(matchToken(s, index), expected, format('matching: %s at index: %d "%s" returns %d "%s"', s, index, (s && s[index]) || '', expected, (s && s[expected]) || ''))

  if (expected > -1) {
    // matches should work in both directions
    var tmp = index;
    index = expected;
    expected = tmp;
    t.equal(matchToken(s, index), expected, format('matching: %s at index: %d "%s" returns %d "%s"', s, index, (s && s[index]) || '', expected, (s && s[expected]) || ''))
  }
}

test('empty and out of range', function (t) {
  check(t, null, 0, -1)
  check(t, undefined, 0, -1)
  check(t, '', 0, -1)
  check(t, 'a', 1, -1)
})

test('complete open/close', function (t) {
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

test('incomplete open/close', function (t) {
  check(t, 'var a = [ { foo: "bar", bar: "foo" }', 8, -1)
  check(t, 'var a = [ { foo: "bar", bar: "foo" } ]', 8, 37)
})

test('quotes', function (t) {
  check(t, '"a"', 0, 2)
  check(t, "'a'", 0, 2)
  check(t, 'var a = [ { foo: "bar", bar: "foo" } ]', 17, 21)
  check(t, 'var a = [ { foo: "bar", bar: "foo" } ]', 29, 33)
})
