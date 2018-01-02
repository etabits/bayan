'use strict'
var helpers = {}

helpers.startCase = (str) => str.replace(/(^[a-z]|[A-Z])/g, (a) => ' ' + a.toUpperCase()).trim()

helpers.expandAttributes = function (attributes, opts, collect) {
  var ret = {}
  for (var attrName in attributes) {
    ret[attrName] = helpers.expandAttr(attributes[attrName], attrName, opts || {}, collect)
  }
  return ret
}
helpers.alternativeExpansion = function (attr, metas) {
  var typeofType = typeof attr.type
  // console.log(typeofType, attr)
  if (typeofType !== 'undefined' && typeof attr.$ === 'undefined') {
    if (typeofType === 'object') { // Nested
      var nattr
      if (Array.isArray(attr.type)) {
        // nattr = Object.assign({}, {
        //   $: Object.assign({}, attr)
        // })
        // delete nattr.$.type
        Object.assign(metas, attr)
        delete metas.type
        attr = attr.type
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

  return attr
}
helpers.expandAttr = function (attr, attrName = '', opts = {}, collect = null) {
  var attribute = {}
  var children = {}
  var metas = opts.defaults? Object.assign({}, opts.defaults) : {}
  var attrPath
  if (typeof attrName === 'string') {
    attrPath = [attrName]
  } else {
    attrPath = attrName
    attrName = attrPath[attrPath.length - 1]
  }
  // console.log(attrName, attrPath)

  if (typeof attr === 'string') {
    attr = {
      $: {
        label: attr,
        type: String
      }
    }
  }
  // .type
  if (opts.attributeTransformer) {
    attr = opts.attributeTransformer(attr)
  }
  attr = helpers.alternativeExpansion(attr, metas)
  // console.log(attrName, metas, attr)

  if (typeof attr === 'object') {
    if (Array.isArray(attr)) {
      children = {'0': attr[0]}
      metas.type = Array
      // metas.
    } else {
      children = Object.assign({}, attr)
      if (typeof attr.$ !== 'undefined') {
        metas = Object.assign({}, opts.defaults || {}, attr.$)
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
  } else if (metas.ref && metas.type !== 'file') {
    metas.htmlWidget = 'chips'
    if (!metas.endpoint) {
      metas.endpoint = `/admin/${metas.refPlural || metas.ref.toLowerCase() + 's'}.json?q=%s`
    }
  }

  if ('undefined'==typeof metas.required) {
    metas.required = metas.validate === true
  }

  // This should be a post-hook provided by -form
  if (!metas.htmlWidget) {
    // 'checkbox', 'file',
    if (['color', 'date', 'email', 'number', 'password', 'tel', 'text', 'time'].indexOf(metas.type) !== -1) {
      metas.htmlWidget = 'input'
    } else if (metas.type === 'boolean') {
      metas.htmlWidget = 'checkbox'
    } else {
      metas.htmlWidget = metas.type
    }
  }

  // Summing up!
  for (var key in children) {
    attribute[key] = helpers.expandAttr(children[key], attrPath.concat([key]), opts, collect)
  }
  metas.path = attrPath.join('.')
  attribute.$ = metas

  if (collect) {
    // console.log(attrPath, metas.path)
    collect[metas.path] = attribute
  }
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
