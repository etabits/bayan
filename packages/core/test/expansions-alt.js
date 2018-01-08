'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

test('basic types', t => {
  var actual = helpers.expandAttr({
    type: String,
    label: 'Author',
    any: 'TEST'
  }, {name: 'str'})
  var expected = {
    $: {
      type: 'string',
      label: 'Author',
      any: 'TEST',
      dataType: String,
      path: ['str']
    }
  }
  t.deepEqual(actual, expected)
})

test('array simple', t => {
  var a = helpers.expandAttr([{a: Number, b: String}])
  var b = helpers.expandAttr({
    type: [{a: Number, b: String}]
  })

  t.deepEqual(a, b)
})

test('array', t => {
  var a = helpers.expandAttr([{
    name: String,
    people: [{
      ref: 'Entity',
      type: String
    }]
  }], 'credits')
  var b = helpers.expandAttr({
    type: [{
      name: String,
      people: [{
        ref: 'Entity',
        type: String
      }]
    }]
  }, 'credits')
  t.deepEqual(a, b)
})
