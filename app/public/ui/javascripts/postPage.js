const MATERIAL_PREFIX = 'materials';
const TOOL_PREFIX = 'tools';
const STEP_PREFIX = 'steps';

function onReady() {
  initializeAutoAddSection(MATERIAL_PREFIX);
  initializeAutoAddSection(TOOL_PREFIX);
  initializeAutoAddSection(STEP_PREFIX);
}

function initializeAutoAddSection(prefix, createGroupFn) {
  var parent = '#' + prefix + '_list';
  var addAction = '#' + prefix + '_add_action';
  var cancelAction = '.' + prefix + '_cancel_action';
  $(addAction).click(function() {
  var lastChild = $(parent + ' div:last-child');
  var newChild;
    newChild = lastChild.clone();
    var newIndex = parseInt(lastChild.children().eq(0).attr('name').split('_')[2]) + 1;
    newChild.children().each(function (index, child) {
      var nameParts = child.name.split('_');
      child.name = nameParts[0] + '_' + nameParts[1] + '_' + newIndex;
      child.value = '';
    });
    newChild.appendTo(parent);
  });
  $(cancelAction).click(function() {
    $(this).parent().remove();
  });
}

