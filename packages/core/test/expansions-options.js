'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

test('with options', t => {
  var single = helpers.expandAttr({
    $: {
      enum: ['hey', 'there'],
      type: String
    }
  }, {name: 'single'})
  t.deepEqual(single.$, {
    dataType: String,
    enum: ['hey', 'there'],
    label: 'Single',
    type: 'string',
    path: ['single']
  })
  var many = helpers.expandAttr({
    $: {
      enum: ['hey', 'there'],
      type: Array // FIXME should accept [String] or [Number]
    }
  }, {name: 'many'})
  t.deepEqual(many.$, {
    dataType: Array,
    enum: ['hey', 'there'],
    label: 'Many',
    type: 'array',
    path: ['many']
  })
})
