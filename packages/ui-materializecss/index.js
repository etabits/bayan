'use strict'

// We have limited basic html form elements; mainly
// input, textarea, select

// .htmlWidget should be one of these three, otherwise that
// should be expressed using .pugMixin

exports.register = function (bayan) {
  bayan.Schema.registerHooks('bayan-ui-materializecss', [{
    type: 'post',
    handler: attr => {
      if (!attr.$.htmlType) {
        attr.$.htmlType = (attr.$.type === 'string')? 'text' : attr.$.type
      }
      if (!attr.$.htmlWidget) {
        if (attr.$.enum) {
          attr.$.htmlWidget = 'select'
        } else {
          attr.$.htmlWidget = ['array', 'object', 'date', 'boolean', 'file'].includes(attr.$.type)? attr.$.type : 'input'
        }
      }
      if (!attr.$.pugMixin) {
        attr.$.pugMixin = '_bayan_widget_' + attr.$.htmlWidget
      }
      return attr
    }
  }])
}
