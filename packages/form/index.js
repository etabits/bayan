'use strict'
var _ = {
  set: require('lodash.set')
}
var Form = module.exports = {}

Form.parseFormData = function (source, formPrefix = 'form') {
  var data = {}

  for (var key in source) {
    _.set(data, key, source[key])
  }

  return data[formPrefix]
}
