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
      type: 'string',
      label: 'Name',
      path: ['name']
    }
  })
})
test('basic schema with hooks', t => {
  var schemaDefinition = {
    name: {
      type: String,
      label: 'Hey'
    }
  }
  var s = new Schema(schemaDefinition, {
    hooks: [{
      type: 'pre',
      handler: (attr) => {
        attr.label += '!'
        return attr
      }
    }, {
      type: 'post',
      handler: (attr) => {
        attr.$.label += ' : )'
        return attr
      }
    }]
  })
  t.deepEqual(s.$.attributes, schemaDefinition)
  t.deepEqual(s.name, {
    $: {
      dataType: String,
      type: 'string',
      label: 'Hey! : )',
      path: ['name']
    }
  })
})

test('nested schema', t => {
  var schemaDefinition = {
    name: {
      first: 'First Name',
      last: String
    },
    birthdate: Date
  }
  var s = new Schema(schemaDefinition)
  var expectedExpansion = {
    name: {
      $: {
        dataType: Object,
        type: 'object',
        label: 'Name',
        path: ['name']
      },
      first: {
        $: {
          dataType: String,
          type: 'string',
          path: ['name', 'first'],
          label: 'First Name'
        }
      },
      last: {
        $: {
          dataType: String,
          type: 'string',
          path: ['name', 'last'],
          label: 'Last'
        }
      }
    },
    birthdate: {
      $: {
        dataType: Date,
        type: 'date',
        label: 'Birthdate',
        path: ['birthdate']
      }
    }
  }
  t.deepEqual(s.$, {
    attributes: schemaDefinition,
    opts: {},
    attributesByPath: {
      'name.first': expectedExpansion.name.first,
      'name.last': expectedExpansion.name.last,
      'birthdate': expectedExpansion.birthdate
    }
  })
  t.deepEqual({
    name: s.name,
    birthdate: s.birthdate
  }, expectedExpansion)
})
