const MATERIAL_LIST_CLASS = '.materialList';
const MATERIAL_NAME_INPUT_PREFIX = 'materialName_';
const MATERIAL_QUANTITY_INPUT_PREFIX = 'materialQuantity_';
const MATERIAL_QUANTITY_CANCEL_PREFIX = 'materialCancel_';


function onReady() {
  bindFocusEventOnLastInput(MATERIAL_LIST_CLASS);
}

function bindFocusEventOnLastInput(parent) {
  $(parent).children().each(function(index, child) {
    $(parent).children().eq(index).children().eq(0).focus(function() {
      if(isLastChild(parent, $(this))) {
        appendChild(parent);
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

function appendChild(parent) {
  var lastChild = $(parent + ' div:last-child');
  var newChild = lastChild.clone();
  var newIndex =  parseInt(lastChild.children().eq(0).attr('name').split('_')[1]) + 1;
  var nameInput = newChild.children().eq(0);
  nameInput.attr('name', MATERIAL_NAME_INPUT_PREFIX + newIndex);
  nameInput.focus(function() {
    if(isLastChild(parent, $(this))) {
      appendChild(parent);
    }
  })
  newChild.children().eq(1).attr('name', MATERIAL_QUANTITY_INPUT_PREFIX + newIndex);
  var cancelElement = newChild.children().eq(2);
  cancelElement.eq(2).attr('name', MATERIAL_QUANTITY_CANCEL_PREFIX + newIndex);
  cancelElement.click(function() {
    cancelElement.parent().remove();
  })
  newChild.appendTo(parent);
}
