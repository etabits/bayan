'use strict'
import test from 'ava'

const mongoose = require('mongoose')
const bayan = require('bayan-core')
const MongooseConnector = require('../')

var mongooseSchemaObj = {
  title: {type: String, $: {label: 'Title'}},
  published: Boolean,
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'Author', $: {htmlWidget: 'select'}},
  connections: [{
    ref: 'Author',
    type: mongoose.Schema.Types.ObjectId
  }]
}

var bayanSchemaObj = {
  title: {
    $: {
      type: String,
      label: 'Title'
    }
  },
  published: Boolean,
  author: {$: {htmlWidget: 'select', type: mongoose.Schema.Types.ObjectId, ref: 'Author'}},
  connections: {
    $: {
      ref: 'Author',
      type: [String]
    }
  }
}

test('from mongoose to bayan', t => {
  t.plan(Object.keys(mongooseSchemaObj).length)
  for (var fieldName in mongooseSchemaObj) {
    var i = MongooseConnector.attrFrom(mongooseSchemaObj[fieldName])
    var m = bayan.helpers.expandAttr(i)
    var b = bayan.helpers.expandAttr(bayanSchemaObj[fieldName])

    // console.log(require('util').inspect({fieldName, i, m, b}, {colors: true, breakLength: 0, depth: 3}))
    t.deepEqual(m, b)
  }
})

test('full bayan from mongoose', t => {
  t.plan(1 + Object.keys(mongooseSchemaObj).length)
  var mongooseSchema = mongoose.Schema(mongooseSchemaObj)
  var mongooseModel = mongoose.model('Article', mongooseSchema)
  var mc = new MongooseConnector(mongooseModel)
  var bayanSchema = new bayan.Schema(bayanSchemaObj)
  t.is(mongooseSchema.obj, mongooseSchemaObj)

  for (var fieldName in mongooseSchemaObj) {
    var actual = bayanSchema[fieldName]
    var expected = mc.bayanSchema[fieldName]

    // console.log(require('util').inspect({fieldName, actual, expected}, {colors: true, breakLength: 0, depth: 3}))
    t.deepEqual(actual, expected)
  }
})
