'use strict'

var Bayan = {
  UI: {}
}


Bayan.UI.arrayDel = function (btn) {
  $(btn).parents('.bayan-array-element').first().remove()
}

Bayan.UI.arrayAdd = function (btn) {
  var container = $(btn).parents('.bayan-sub-container').first()
  var template = container.find('.bayan-template').first()
  if (template.length>1) {
    ddd()
  }
  var number = parseInt(template.attr('data-next-number'))
  template.attr('data-next-number', number+1)
  var html = template.attr('data-template-string').replace(/{NUM}/g, number)
  var addTo = container.find('.bayan-add-array-element').last()
  console.log(html, addTo)
  $(html).attr('class', 'bayan-array-element').insertBefore(addTo)
}

$('.bayan-template').toArray().reverse().forEach(function(tpl) {
  var innerHTML = tpl.innerHTML;
  tpl.innerHTML = ''
  $(tpl).attr('data-template-string', innerHTML)
})