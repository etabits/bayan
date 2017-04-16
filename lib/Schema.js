'use strict'
var helpers = require('./helpers')

class Schema {
  constructor (attributes) {
    this.$ = {
      attributes
    }
    Object.assign(this, helpers.expandAttributes(attributes))
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
