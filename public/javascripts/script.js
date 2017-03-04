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
  Bayan.processNewElements()
}

Bayan.init = function() {
  $('.bayan-template').toArray().reverse().forEach(function(tpl) {
    var innerHTML = tpl.innerHTML;
    tpl.innerHTML = ''
    $(tpl).attr('data-template-string', innerHTML)
  })
  $(document).ready(Bayan.processNewElements)
}

Bayan.processNewElements = function() {
  $('select').material_select();

  $('.autocomplete').each(function(c, elem) {
    var $elem = $(elem)
    var options = $elem.attr('data-options')
    $elem.attr('data-options', null)
    if (!options) return;
    options = JSON.parse(options).map(function(opt) {
      return {
        id: opt.value,
        text: opt.label
      }
    })
    console.log(options)
    $elem.materialize_autocomplete({
      limit: 20,
      multiple: {
          enable: true,
      },
      getData: function (value, callback) {
        // ...
        // callback(value, data);
        callback(value, options)
      }
    });
  })


  $('.chips-autocomplete').each(function(c, elem) {
    var $elem = $(elem)
    var options = $elem.attr('data-options')
    $elem.attr('data-options', null)
    var hiddenFieldsContainer = $elem.siblings('.bayan-hidden-fileds')
    var fieldName = $elem.attr('data-field')
    if (!options) return;
    options = JSON.parse(options);
    console.log(options)
    $elem.material_chip({
      autocompleteData: options,
      secondaryPlaceholder: $elem.attr('data-placeholder') || '+'
    });
    $elem.on('chip.add chip.delete', function() {
      var data = $(this).material_chip('data')
      hiddenFieldsContainer.innerHTML = ''
      for (var i = 0; i<data.length; ++i) {
        var value = data[i].id
        if (!value) continue
        $('<input />').attr({
          type: 'hidden',
          name: fieldName+'[]',
          value: value
        }).appendTo(hiddenFieldsContainer)
      }
    })
  })
}

Bayan.init()