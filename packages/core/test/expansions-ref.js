'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

test('basic types', t => {
  var actual = helpers.expandAttr({
    $: {
      ref: 'Author',
      type: [String]
    }
  }, 'author')
  var expected = {
    $: {
      dataType: [String],
      label: 'Author',
      htmlWidget: 'chips',
      ref: 'Author',
      type: null,
      endpoint: '/admin/authors.json?q=%s', // temp FIXMEPLZ
      path: 'author'

    }
  }
  // console.log(console.log(require('util').inspect({actual, expected}, {colors: true, breakLength: 0, depth: 3})))
  // console.log(expected)
  t.deepEqual(actual, expected)
})
