'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

test('basic types', t => {
  var actual = helpers.expandAttr({
    $: {
      ref: 'Author',
      type: Array
    }
  }, {name: 'authors'})
  var expected = {
    $: {
      dataType: Array,
      label: 'Authors',
      ref: 'Author',
      type: 'array',
      path: ['authors']
    }
  }
  t.deepEqual(actual, expected)
})
