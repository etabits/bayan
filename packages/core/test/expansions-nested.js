'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

test('object', t => {
  var nested = helpers.expandAttr({
    sub: {
      str: String
    }
  }, 'nested')
  t.deepEqual(nested, {
    $: {
      type: 'object',
      dataType: Object,
      label: 'Nested',
      htmlWidget: 'object',
      path: 'nested'
    },
    sub: {
      $: {
        type: 'object',
        dataType: Object,
        label: 'Sub',
        htmlWidget: 'object',
        path: 'nested.sub'
      },
      str: {
        $: {
          type: 'text',
          dataType: String,
          label: 'Str',
          htmlWidget: 'input',
          path: 'nested.sub.str'
        }
      }
    }
  })
})

test('array', t => {
  var nested = helpers.expandAttr([{
    name: String
  }], 'nested')
  t.deepEqual(nested, {
    $: {
      type: 'array',
      dataType: Array,
      label: 'Nested',
      htmlWidget: 'array',
      path: 'nested'
    },
    '0': {
      $: {
        type: 'object',
        dataType: Object,
        htmlWidget: 'object',
        label: '0',
        path: 'nested.0'
      },
      name: {
        $: {
          type: 'text',
          dataType: String,
          label: 'Name',
          htmlWidget: 'input',
          path: 'nested.0.name'
        }
      }
    }
  })
})

test('match', t => {
  var a = helpers.expandAttr({
    type: {
      sub1: String,
      sub2: String
    },
    meta1: 1,
    meta2: 2
  })
  var b = helpers.expandAttr({
    $: {
      meta1: 1,
      meta2: 2
    },
    sub1: String,
    sub2: String
  })
  t.deepEqual(a, b)
})
