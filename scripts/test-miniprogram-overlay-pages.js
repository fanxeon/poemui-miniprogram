'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');
var pages = ['popup', 'popover', 'sheet', 'action-sheet', 'dropdown-menu', 'overlay'];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function loadPage(name) {
  var captured;
  vm.runInNewContext(read('miniprogram/pages/components/' + name + '/index.js'), {
    Page: function (definition) { captured = definition; },
    require: function (request) {
      if (request === '../../../utils/component-page') {
        return function createComponentPage(config) {
          return Object.assign({ data: config.data || {} }, config.methods || {});
        };
      }
      throw new Error('Unexpected overlay page dependency: ' + request);
    }
  }, { filename: 'miniprogram/pages/components/' + name + '/index.js' });
  assert.ok(captured, name + ' 必须注册 Page');
  captured.data = JSON.parse(JSON.stringify(captured.data));
  captured.setData = function (next) { Object.assign(captured.data, next); };
  return captured;
}

var popup = loadPage('popup');
popup.onOpenPopup({ currentTarget: { dataset: { placement: 'center' } } });
assert.strictEqual(popup.data.popupVisible, true);
assert.strictEqual(popup.data.popupPlacement, 'center');
popup.onPopupVisibleChange({ detail: { visible: false, trigger: 'overlay' } });
assert.strictEqual(popup.data.popupVisible, false);

var popover = loadPage('popover');
popover.onOpenPopover({ currentTarget: { dataset: { placement: 'right' } } });
assert.strictEqual(popover.data.popoverVisible, true);
popover.onPopoverVisibleChange({ detail: { visible: false } });
assert.strictEqual(popover.data.popoverVisible, false);

var sheet = loadPage('sheet');
sheet.onOpenSheet();
assert.strictEqual(sheet.data.sheetVisible, true);
sheet.onSheetChange({ detail: { visible: false } });
assert.strictEqual(sheet.data.sheetVisible, false);

var actionSheet = loadPage('action-sheet');
actionSheet.onOpenActionSheet();
assert.strictEqual(actionSheet.data.actionSheetVisible, true);
actionSheet.onActionSelected({ detail: { selected: { label: '新建任务' } } });
assert.ok(actionSheet.data.lastAction.indexOf('新建任务') !== -1);
actionSheet.onActionSheetVisibleChange({ detail: { visible: false } });
assert.strictEqual(actionSheet.data.actionSheetVisible, false);
actionSheet.onActionSheetBlurChange({ detail: { checked: true } });
assert.strictEqual(actionSheet.data.actionSheetBlurOverlay, true);
assert.ok(actionSheet.data.lastAction.indexOf('毛玻璃已开启') !== -1);

var dropdown = loadPage('dropdown-menu');
dropdown.onDropdownChange({ detail: { value: { framework: 'h5', mode: 'default' } } });
assert.strictEqual(dropdown.data.dropdownValue.framework, 'h5');

var overlay = loadPage('overlay');
overlay.onOpenOverlay();
assert.strictEqual(overlay.data.overlayVisible, true);
overlay.onOverlayBlurChange({ detail: { checked: false } });
assert.strictEqual(overlay.data.overlayBlur, false);
overlay.onOverlayClick();
assert.strictEqual(overlay.data.overlayVisible, false);

pages.forEach(function (name) {
  assert.ok(fs.existsSync(path.join(ROOT, 'miniprogram/pages/components/' + name + '/index.wxml')), name + ' 缺少 WXML');
  assert.ok(fs.existsSync(path.join(ROOT, 'miniprogram/pages/components/' + name + '/index.json')), name + ' 缺少 JSON');
});

var actionSheetWxml = read('miniprogram/pages/components/action-sheet/index.wxml');
var actionSheetJson = JSON.parse(read('miniprogram/pages/components/action-sheet/index.json'));
assert.ok(actionSheetWxml.indexOf('blur-overlay="{{actionSheetBlurOverlay}}"') !== -1, 'ActionSheet 页面必须把局部毛玻璃开关传给组件');
assert.ok(actionSheetWxml.indexOf('<pui-switch') !== -1, 'ActionSheet 页面必须提供真实 PUI Switch 毛玻璃入口');
assert.strictEqual(actionSheetJson.usingComponents['pui-switch'], 'poemui-miniprogram/switch/switch');

console.log('miniprogram overlay page contract tests passed');
