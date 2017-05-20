'use strict'
var helpers = require('./helpers')

class Schema {
  constructor (attributes, opts) {
    this.$ = {
      attributes,
      opts,
      attributesByPath: {}
    }
    Object.assign(this, helpers.expandAttributes(attributes, opts, this.$.attributesByPath))
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

module.exports = Schema
