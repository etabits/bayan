'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

test('basic types', t => {
  var actual = helpers.expandAttr({
    type: String,
    label: 'Author',
    any: 'TEST'
  }, 'str')
  var expected = {
    $: {
      type: 'text',
      label: 'Author',
      any: 'TEST',
      dataType: String,
      htmlWidget: 'input',
      path: 'str'
    }
  }
  // console.log(require('util').inspect({actual, expected}, {colors: true, breakLength: 0, depth: 3}))
  // console.log(expected)
  t.deepEqual(actual, expected)
})
test('array simple', t => {
  var a = helpers.expandAttr([{a: Number, b: String}])
  var b = helpers.expandAttr({
    type: [{a: Number, b: String}]
  })

  t.deepEqual(a, b)

  // console.log(require('util').inspect({a, b}, {colors: true, breakLength: 0, depth: 3}))
})

test('array', t => {
  var a = helpers.expandAttr([{
    name: String,
    people: [{
      ref: 'Entity',
      type: String
      // $: {refPlural: 'entities'}
    }]
  }], 'credits')
  var b = helpers.expandAttr({
    type: [{
      name: String,
      people: [{
        ref: 'Entity',
        type: String
        // $: {refPlural: 'entities'}
      }]
    }]
  }, 'credits')
  // console.log(require('util').inspect({a, b}, {colors: true, breakLength: 0, depth: 3}))
  // console.log(expected)
  t.deepEqual(a, b)
})
