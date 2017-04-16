'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

test('basic types', t => {
  t.deepEqual(helpers.expandAttr(String, 'str'), {
    $: {
      type: 'text',
      dataType: String,
      htmlWidget: 'input',
      label: 'Str'
    }
  })

  t.deepEqual(helpers.expandAttr(Number, ''), {
    $: {
      type: 'number',
      dataType: Number,
      htmlWidget: 'input',
      label: ''
    }
  })
})

test('other input types', t => {
  t.deepEqual(helpers.expandAttr({$: {type: 'color'}}, ''), {
    $: {
      type: 'color',
      dataType: String,
      htmlWidget: 'input',
      label: ''
    }
  })
  t.deepEqual(helpers.expandAttr({$: {type: 'email'}}, ''), {
    $: {
      type: 'email',
      dataType: String,
      htmlWidget: 'input',
      label: ''
    }
  })
})
