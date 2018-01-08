'use strict'
var helpers = require('./helpers')

class Schema {
  static registerHooks (label, hooks) {
    if (Schema.registerHookLabels.includes(label)) return false
    Schema.registerHookLabels.push(label)
    Schema.globalHooks = Schema.globalHooks.concat(hooks)
  }

  constructor (attributes, opts = {}) {
    this.$ = {
      attributes,
      opts,
      attributesByPath: {}
    }

    Object.assign(this, helpers.expandAttributes(attributes, Object.assign({}, opts, {
      hooks: (opts.hooks || []).concat(Schema.globalHooks),
      collect: this.$.attributesByPath
    })))
  }
}

Schema.globalHooks = []
Schema.registerHookLabels = []

module.exports = Schema
