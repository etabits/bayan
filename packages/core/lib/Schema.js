'use strict'
var helpers = require('./helpers')

var _ = {
  get: require('lodash.get')
}

class Schema {
  constructor (attributes, opts) {
    this.$ = {
      attributes,
      opts,
      attributesByPath: {}
    }
    Object.assign(this, helpers.expandAttributes(attributes, opts, this.$.attributesByPath))
  }

  validate (data) {
    var self = this

    var errors = []
    for (var key in self.$.attributesByPath) {
      var field = self.$.attributesByPath[key]
      if (!field.$.validate) continue;
      var value = _.get(data, key);
      if (field.$.required && !value) {
        errors.push({field: key, code: 'required'})
      }
    }
    return errors
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
