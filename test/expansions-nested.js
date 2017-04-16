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
      htmlWidget: 'object'
    },
    sub: {
      $: {
        type: 'object',
        dataType: Object,
        label: 'Sub',
        htmlWidget: 'object'
      },
      str: {
        $: {
          type: 'text',
          dataType: String,
          label: 'Str',
          htmlWidget: 'input'
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
      htmlWidget: 'array'
    },
    '0': {
      $: {
        type: 'object',
        dataType: Object,
        htmlWidget: 'object',
        label: '0'
      },
      name: {
        $: {
          type: 'text',
          dataType: String,
          label: 'Name',
          htmlWidget: 'input'
        }
      }
    }
  })
})
