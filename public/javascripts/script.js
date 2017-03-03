'use strict'

var Bayan = {
  UI: {}
}


Bayan.UI.arrayDel = function (btn) {
  $(btn).parents('.bayan-array-element').first().remove()
}

Bayan.UI.arrayAdd = function (btn) {
  var container = $(btn).parents('.bayan-sub-container').first()
  var template = container.find('script')
  var number = template.attr('data-next-number')
  var html = template.text().replace(/{NUM}/g, number)
  console.log(html)
  $(html).attr('class', 'bayan-array-element').insertBefore(container.find('.bayan-add-array-element'))
}
