'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

test('basic simple type', t => {
  t.deepEqual(helpers.expandAttr(String), {
    $: {
      label: '',
      dataType: String,
      type: 'string',
      path: ['']
    }
  })
})

test('basic simple type plus', t => {
  t.deepEqual(helpers.expandAttr(String), {
    $: {
      label: '',
      dataType: String,
      type: 'string',
      path: ['']
    }
  })
})

test('basic simple type with defaults', t => {
  t.deepEqual(helpers.expandAttr(String, {defaults: {required: false}}), {
    $: {
      label: '',
      required: false,
      dataType: String,
      type: 'string',
      path: ['']
    }
  })
})

test('basic label', t => {
  t.deepEqual(helpers.expandAttr('Hey'), {
    $: {
      label: 'Hey',
      dataType: String,
      type: 'string',
      path: ['']
    }
  })
})

test('basic .type', t => {
  t.deepEqual(helpers.expandAttr({
    type: String,
    label: 'Hey'
  }), {
    $: {
      label: 'Hey',
      dataType: String,
      type: 'string',
      path: ['']
    }
  })
})

test('basic .$', t => {
  t.deepEqual(helpers.expandAttr({
    $: {
      type: String,
      label: 'Hey'
    }
  }), {
    $: {
      label: 'Hey',
      dataType: String,
      type: 'string',
      path: ['']
    }
  })
})

test('basic types', t => {
  t.deepEqual(helpers.expandAttr(String, {name: 'str'}), {
    $: {
      dataType: String,
      type: 'string',
      label: 'Str',
      path: ['str']
    }
  })

  t.deepEqual(helpers.expandAttr(Number, ''), {
    $: {
      dataType: Number,
      type: 'number',
      label: '',
      path: ['']
    }
  })
})

test('other input types', t => {
  t.deepEqual(helpers.expandAttr({$: {type: 'color'}}, ''), {
    $: {
      type: 'color',
      dataType: String,
      label: '',
      path: ['']
    }
  })
  t.deepEqual(helpers.expandAttr({type: 'email'}, ''), {
    $: {
      type: 'email',
      dataType: String,
      label: '',
      path: ['']
    }
  })
})
