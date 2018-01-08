'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

test('nested .$', t => {
  t.deepEqual(helpers.expandAttr({
    $: {
      // type: Object,
      label: 'Hey'
    },
    child1: 'Label 1'
  }), {
    $: {
      label: 'Hey',
      dataType: Object,
      type: 'object',
      path: ['']
    },
    child1: {
      $: {
        label: 'Label 1',
        dataType: String,
        type: 'string',
        path: ['', 'child1']
      }
    }
  })
})

test('nested .type', t => {
  t.deepEqual(helpers.expandAttr({
    type: {
      child1: 'Label 1'
    },
    label: 'Hey!'
  }), {
    $: {
      label: 'Hey!',
      dataType: Object,
      type: 'object',
      path: ['']
    },
    child1: {
      $: {
        label: 'Label 1',
        dataType: String,
        type: 'string',
        path: ['', 'child1']
      }
    }
  })
})
test('nested no .$ nor .type', t => {
  t.deepEqual(helpers.expandAttr({
    child1: 'Hey !',
    child2: 'Hey @'
  }), {
    $: {
      label: '',
      dataType: Object,
      type: 'object',
      path: ['']
    },
    child1: {
      $: {
        label: 'Hey !',
        dataType: String,
        type: 'string',
        path: ['', 'child1']
      }
    },
    child2: {
      $: {
        label: 'Hey @',
        dataType: String,
        type: 'string',
        path: ['', 'child2']
      }
    }
  })
})

test('object', t => {
  var nested = helpers.expandAttr({
    sub: {
      str: String
    }
  }, {name: 'nested'})
  t.deepEqual(nested, {
    $: {
      dataType: Object,
      type: 'object',
      label: 'Nested',
      path: ['nested']
    },
    sub: {
      $: {
        dataType: Object,
        type: 'object',
        label: 'Sub',
        path: ['nested', 'sub']
      },
      str: {
        $: {
          dataType: String,
          type: 'string',
          label: 'Str',
          path: ['nested', 'sub', 'str']
        }
      }
    }
  })
})

test('array', t => {
  var nested = helpers.expandAttr([{
    name: String
  }], {name: 'nested'})
  t.deepEqual(nested, {
    $: {
      dataType: Array,
      type: 'array',
      label: 'Nested',
      path: ['nested']
    },
    '0': {
      $: {
        dataType: Object,
        type: 'object',
        label: '0',
        path: ['nested', '0']
      },
      name: {
        $: {
          dataType: String,
          type: 'string',
          label: 'Name',
          path: ['nested', '0', 'name']
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
