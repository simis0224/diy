const MATERIAL_LIST_CLASS = '.materialList';
const TOOL_LIST_CLASS = '.toolList';
const MATERIAL_PREFIX = 'materials';
const TOOL_PREFIX = 'tools';


function onReady() {
  bindFocusEventOnLastInput(MATERIAL_LIST_CLASS, MATERIAL_PREFIX);
  bindFocusEventOnLastInput(TOOL_LIST_CLASS, TOOL_PREFIX);
}

function bindFocusEventOnLastInput(parent, prefix) {
  $(parent).children().each(function(index, child) {
    $(parent).children().eq(index).children().eq(0).focus(function() {
      if(isLastChild(parent, $(this))) {
        appendChild(parent, prefix);
      }
    });

    $(parent).children().eq(index).children().eq(2).click(function() {
      $(this).parent().remove();
    });
  });
}

function isLastChild(parent, child) {
  var lastChildName = $(parent + ' div:last-child').children().eq(0).attr('name');
  var currentElementName = child.attr('name');
  return lastChildName ===  currentElementName;
}

function appendChild(parent, prefix) {
  var lastChild = $(parent + ' div:last-child');
  var newChild = lastChild.clone();
  var newIndex =  parseInt(lastChild.children().eq(0).attr('name').split('_')[2]) + 1;
  var nameInput = newChild.children().eq(0);
  nameInput.attr('name', prefix + '_name_' + newIndex);
  nameInput.focus(function() {
    if(isLastChild(parent, $(this))) {
      appendChild(parent);
    }
  })
  newChild.children().eq(1).attr('name', prefix + '_quantity_' + newIndex);
  var cancelElement = newChild.children().eq(2);
  cancelElement.eq(2).attr('name', prefix + '_cancel_' + newIndex);
  cancelElement.click(function() {
    cancelElement.parent().remove();
  })
  newChild.appendTo(parent);
}
