'use strict'
import test from 'ava'

var helpers = require('../lib/helpers')

function doTests (tests) {
  var firstLabel
  for (var label in tests) {
    if (!firstLabel) {
      firstLabel = label
      continue
    }

    /* jshint loopfunc: true */
    (function (label) {
      test(firstLabel + ' === ' + label, t => {
        t.deepEqual(helpers.expandAttr(tests[firstLabel]), helpers.expandAttr(tests[label]))
      })
    })(label)
  }
}

doTests({
  'String': String,
  '{type: String}': {
    type: String
  },
  '{$:{type: String}}': {
    $: {
      type: String
    }
  }
})

doTests({
  'type with outside metas': {
    type: String,
    meta1: 1,
    meta2: 2
  },
  'type with $ metas': {
    $: {
      type: String,
      meta1: 1,
      meta2: 2
    }
  }
})

doTests({
  'top level array': [{
    ref: 'Being',
    type: String
  }],
  '.type is array': {
    type: [{
      ref: 'Being',
      type: String
    }]
  }
})
