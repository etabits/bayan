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

// TODO: make all enums id-keyed objects

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
      type: attr
    }
  }
  attribute.label = attr.label || _.startCase(attrName)
  if (attribute.enum) {
    if (!attribute.fieldType) {
      attribute.fieldType = Array.isArray(attribute.type)
      ? 'multi_select'
      : 'select'
      
    }
    attribute.enum = attribute.enum.map(expandSelectItem)
  } else if ('object'==typeof attribute.type) {
    if (Array.isArray(attribute.type)) {
      attribute.extendedType = [expandAttr(attribute.type[0], '')]
      attribute.type = Array
    } else {
      attribute.extendedType = expandAttributes(attribute.type)
      attribute.type = Object
    }
  }

  attribute.dataType = attr.dataType || attribute.type.name
  // console.log(attrName, attr, attribute)
  if (!attribute.fieldType) {
    attribute.fieldType = attribute.dataType.toLowerCase()
  }

  return attribute
}

function expandSelectItem(item) {
  if ('object'==typeof item) return item

  return {
    value: item,
    label: _.startCase(item)
  }
}

module.exports = Schema
