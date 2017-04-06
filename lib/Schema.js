'use strict'

var _ = require('lodash')

class Schema {
  constructor(attributes) {
    this.$ = {
      attributes
    }
    Object.assign(this, expandAttributes(attributes))
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
  var attribute = {}
  var children = {}
  var metas = {}

  if ('string'==typeof attr) {
    attr = {
      $: {
        label: attr,
        type: String
      }
    }
  }
  // .type
  var typeofType = typeof attr.type
  if ('undefined'!=typeofType && 'undefined'==typeof attr.$) {
    if ('object'==typeofType) { // Nested
      if (Array.isArray(attr.type)) {
        var nattr = Object.assign({}, {
          $: Object.assign({}, attr)
        })
      console.log(require('util').inspect({attr, nattr}, {colors: true, breakLength: 0, depth: 3}))
        // delete nattr.$.type
        attr = nattr

      } else {
        var nattr = Object.assign({}, attr.type, {
          $: Object.assign({}, attr)
        })
        delete nattr.$.type
        attr = nattr
      }

    } else { // Normal
      attr = {
        $: attr
      }
    }
  }

  // console.log('!', attr)
  if ('object'==typeof attr) {
    if (Array.isArray(attr)) {
      children = {'0': attr[0]}
      metas.type = Array
      // metas.
    } else {
      children = Object.assign({}, attr)
      if ('undefined'!=typeof attr.$) {
        metas = Object.assign({}, attr.$)
        delete children.$
      }
      metas.type = metas.type || Object
    }
  } else {
    metas.type = attr
  }

  // Filling metas
  metas.dataType = metas.type.name
  if (!metas.label) {
    metas.label = _.startCase(attrName)
  }

  if (metas.enum) {
    console.log('>>', metas)
    if (!metas.fieldType) {
      metas.fieldType = Array.isArray(metas.type)
      ? 'multi_select'
      : 'select'
    }
    metas.enum = fixEnum(metas.enum)
  }
  if (!metas.fieldType) {
    metas.fieldType = metas.dataType.toLowerCase()
  }

  // Summing up!
  for (var key in children) {
    attribute[key] = expandAttr(children[key], key)
  }
  attribute.$ = metas

  // console.log('>', attrName, metas, children)
  return attribute;


  if ('undefined'===typeof attr.type) {
    delete attribute.$.type
    Object.assign(attribute, attr.type)
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

function fixEnum(old) {
  var ne = {}
  if (Array.isArray(old)) {
    for (var i = 0; i<old.length; ++i) {
      ne[old[i]] = {label: old[i]}
    }
  } else {
    for (var key in old) {
      if ('object'!=typeof old[key]) {
        ne[key] = {label: old[key]}
      } else {
        ne[key] = old[key]
        if (!ne[key].label) ne[key].label = _.startCase(key)
      }
    }
  }


  // console.log('>>>', old, ne)
  return ne;
}

function expandSelectItem(item) {
  if ('object'==typeof item) return item

  return {
    value: item,
    label: _.startCase(item)
  }
}

module.exports = Schema
