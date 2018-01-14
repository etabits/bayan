'use strict'
var helpers = {}

helpers.startCase = (str) => str.replace(/(^[a-z]|[A-Z])/g, (a) => ' ' + a.toUpperCase()).trim()

helpers.expandAttributes = function (attributes, ctxt) {
  var ret = {}
  for (var attrName in attributes) {
    ret[attrName] = helpers.expandAttr(attributes[attrName], Object.assign({}, ctxt, {
      name: attrName,
      path: ctxt.path || []
    }))
  }
  return ret
}

helpers.expandAttr = function (attr, ctxt) {
  ctxt = Object.assign({
    name: '',
    path: [],
    hooks: [],
    collect: null
  }, ctxt)

  var hooks = ctxt.hooks
  if (attr.widget) {
    hooks = ctxt.hooks.concat(attr.widget.constructor.hooks)
  }

  hooks.filter((h) => h.type === 'pre').forEach(function (h) {
    attr = h.handler(attr)
  }) // FIXME maybe should not return attr, just handle it!

  var typeofAttr = typeof attr
  var metas = Object.assign({}, ctxt.defaults)
  var children = {}

  if (typeof attr.$ !== 'undefined') { // .$ metas markup
    Object.assign(metas, attr.$)
    Object.assign(children, attr)
    delete children.$
    if (typeof metas.type === 'object') {
      throw new Error('You cannot set a complex .$.type')
    }
  } else if (typeof attr.type === 'object') { // Nested, Mongoose-like markup
    children = attr.type
    Object.assign(metas, attr)
    delete metas.type
  } else if (typeof attr.type !== 'undefined') { // type is `String` for example
    Object.assign(metas, attr)
  } else if (typeofAttr === 'string') { // Shorthand: using label as attr
    Object.assign(metas, {
      type: String, // Otherwise label will be considered a child!
      label: attr
    })
  } else if (typeofAttr === 'function') { // Shorthand: directly using String/Boolean/etc. as attr
    Object.assign(metas, {
      type: attr
    })
  } else { // all are children!
    children = attr
  }

  var attribute = {}
  metas.path = ctxt.path.concat(ctxt.name)
  if (Object.keys(children).length > 0) {
    if (typeof metas.type !== 'undefined' && metas.type !== Object) {
      throw new Error('When nesting children, type cannot be set to anything but Object!')
    }
    metas.type = Array.isArray(children) ? Array : Object

    // expanding children!
    Object.assign(attribute, helpers.expandAttributes(children, Object.assign({}, ctxt, {
      path: metas.path
    })))
  } else if (ctxt.collect) {
    ctxt.collect[metas.path.join('.')] = attribute
  }

  // Filling defaults
  if (!metas.label) {
    metas.label = helpers.startCase(ctxt.name)
  }
  // .type & .dataType
  if (typeof metas.type === 'string') {
    metas.dataType = String
  } else {
    metas.dataType = metas.type
    metas.type = metas.dataType.name && metas.dataType.name.toLowerCase()
  }

  attribute.$ = metas

  hooks.filter((h) => h.type === 'post').forEach(function (h) {
    attribute = h.handler(attribute)
  })

  return attribute
}

module.exports = helpers
