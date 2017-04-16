'use strict'
var helpers = {}

helpers.startCase = (str) => str.replace(/(^|\b)(.)/g, (a, b, l) => b + l.toUpperCase())

helpers.expandAttributes = function (attributes) {
  var ret = {}
  for (var attrName in attributes) {
    ret[attrName] = helpers.expandAttr(attributes[attrName], attrName)
  }
  return ret
}

helpers.expandAttr = function (attr, attrName = '') {
  var attribute = {}
  var children = {}
  var metas = {}

  if (typeof attr === 'string') {
    attr = {
      $: {
        label: attr,
        type: String
      }
    }
  }
  // .type
  var typeofType = typeof attr.type
  if (typeofType !== 'undefined' && typeof attr.$ === 'undefined') {
    if (typeofType === 'object') { // Nested
      var nattr
      if (Array.isArray(attr.type)) {
        nattr = Object.assign({}, {
          $: Object.assign({}, attr)
        })
        // delete nattr.$.type
        attr = nattr
      } else {
        nattr = Object.assign({}, attr.type, {
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

  if (typeof attr === 'object') {
    if (Array.isArray(attr)) {
      children = {'0': attr[0]}
      metas.type = Array
      // metas.
    } else {
      children = Object.assign({}, attr)
      if (typeof attr.$ !== 'undefined') {
        metas = Object.assign({}, attr.$)
        delete children.$
      }
      if (!metas.type && Object.keys(children).length > 0) {
        metas.type = Object
      }
    }
  } else {
    metas.type = attr
  }

  // Filling metas
  if (!metas.label) {
    metas.label = helpers.startCase(attrName)
  }
  if (!metas.dataType) {
    if (typeof metas.type === 'string') {
      metas.dataType = String
    } else {
      metas.dataType = metas.type
      metas.type = (metas.dataType && metas.dataType.name) ? metas.dataType.name.toLowerCase() : null
      if (metas.type === 'string') {
        metas.type = 'text'
      }
    }
  }

  if (metas.enum) {
    if (!metas.dataType) {
      metas.dataType = String
    }
    if (!metas.htmlWidget) {
      metas.htmlWidget = Array.isArray(metas.dataType) ? 'multi_select' : 'select'
    }
    metas.enum = helpers.fixEnum(metas.enum)
  }

  // This should be a post-hook provided by -form
  if (!metas.htmlWidget) {
    // 'checkbox',
    if (['color', 'date', 'email', 'file', 'number', 'password', 'tel', 'text', 'time'].indexOf(metas.type) !== -1) {
      metas.htmlWidget = 'input'
    } else if (metas.type === 'boolean') {
      metas.htmlWidget = 'checkbox'
    } else {
      metas.htmlWidget = metas.type
    }
  }

  // Summing up!
  for (var key in children) {
    attribute[key] = helpers.expandAttr(children[key], key)
  }
  attribute.$ = metas

  return attribute
}

helpers.fixEnum = function (old) {
  var ne = {}
  if (Array.isArray(old)) {
    for (var i = 0; i < old.length; ++i) {
      ne[old[i]] = {label: helpers.startCase(old[i])}
    }
  } else {
    for (var key in old) {
      if (typeof old[key] !== 'object') {
        ne[key] = {label: old[key]}
      } else {
        ne[key] = old[key]
        if (!ne[key].label) ne[key].label = helpers.startCase(key)
      }
    }
  }

  return ne
}

module.exports = helpers
