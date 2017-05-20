'use strict'
import test from 'ava'

const Schema = require('../lib/Schema')

test('basic schema', t => {
  var schemaDefinition = {
    name: String
  }
  var s = new Schema(schemaDefinition)
  t.deepEqual(s.$.attributes, schemaDefinition)
  t.deepEqual(s.name, {
    $: {
      dataType: String,
      htmlWidget: 'input',
      type: 'text',
      label: 'Name',
      path: 'name'
    }
  })
})
