'use strict'

var _ = require('lodash')

class Schema {
  constructor(attributes) {
    this.originalAttributes = attributes
    this.attributes = expandAttributes(attributes)
  }
  bind(data) {
    var ret = new Schema(this.originalAttributes)
    bindDataToAttributes(data, ret.attributes)
    return ret
  }
}

/*
Features to cover
Y nested object
  nested schema
Y array of strings
Y array of objects
  array of schema
  array of sechma (embedded)
  multi nested
*/

function bindDataToAttributes() {
  
}

function expandAttributes(attributes) {
  var ret = {}
  for (var attrName in attributes) {
    ret[attrName] = expandAttr(attributes[attrName], attrName)
  }
  return ret
}

function expandAttr(attr, attrName) {
  var attribute = Object.assign({}, attr)
  if ('undefined'===typeof attr.type) {
    attribute = {
      label: _.startCase(attrName)
    }
    if ('object'==typeof attr) {
      attribute.type = Array.isArray(attr)? Array : Object
      attribute.extendedType = expandAttributes(attr)
    } else {
      attribute.type = attr
    }
  }

  attribute.dataType = attr.dataType || attribute.type.name
  attribute.fieldType = attr.fieldType || attribute.dataType.toLowerCase()

  return attribute
}

module.exports = Schema
