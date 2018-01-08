'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

var overwriteTests = {
  'basic type': Boolean,
  'basic .$': {
    $: {
      type: Boolean,
      label: 'Hey'
    }
  },
  'basic .type': {
    type: Number,
    label: 'Hola'
  },
  'nested': {
    sub1: 'label 1',
    sub2: 'label 2'
  },
  'nested .type': {
    type: {
      sub1: 'label 1',
      sub2: 'label 2'
    },
    label: 'parent'
  }
}

for (var label in overwriteTests) {
  /* jshint loopfunc: true */
  ;(function (label) {
    test('two passes yield same result: ' + label, t => {
      var copiedAttribute = (typeof overwriteTests[label] === 'object') ? Object.assign({}, overwriteTests[label]) : overwriteTests[label]
      var pass1 = helpers.expandAttr(overwriteTests[label])
      var pass2 = helpers.expandAttr(overwriteTests[label])

      t.deepEqual(pass1, pass2)
      t.deepEqual(copiedAttribute, overwriteTests[label])
    })
  })(label)
}
