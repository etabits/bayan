'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

test('with options', t => {
  var single = helpers.expandAttr({
    $: {
      enum: ['hey', 'there']
    }
  }, 'single')
  t.deepEqual(single.$, {
    dataType: String,
    enum: {
      hey: {label: 'Hey'},
      there: {label: 'There'}
    },
    htmlWidget: 'select',
    label: 'Single',
    type: null,
    path: 'single'
  })
  var many = helpers.expandAttr({
    $: {
      enum: ['hey', 'there'],
      type: [String]
    }
  }, 'many')
  t.deepEqual(many.$, {
    dataType: [String],
    enum: {
      hey: {label: 'Hey'},
      there: {label: 'There'}
    },
    htmlWidget: 'multi_select',
    label: 'Many',
    type: null,
    path: 'many'
  })
})
