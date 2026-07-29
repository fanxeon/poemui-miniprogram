'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');
var pages = ['alert', 'empty', 'loading', 'notice-bar', 'progress', 'result', 'skeleton', 'toast', 'dialog'];

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
      throw new Error('Unexpected feedback page dependency: ' + request);
    }
  }, { filename: 'miniprogram/pages/components/' + name + '/index.js' });
  assert.ok(captured, name + ' 必须注册 Page');
  captured.data = JSON.parse(JSON.stringify(captured.data));
  captured.setData = function (next) { Object.assign(captured.data, next); };
  return captured;
}

pages.forEach(function (name) {
  var base = 'miniprogram/pages/components/' + name + '/index';
  var wxml = read(base + '.wxml');
  var json = JSON.parse(read(base + '.json'));
  assert.ok(wxml.indexOf('<pui-config-provider') !== -1, name + ' 必须接入全局外观');
  assert.ok(wxml.indexOf('use-global-config') !== -1, name + ' 必须使用 visualConfig');
  assert.ok(wxml.indexOf('<component-page-navbar title="{{pageTitle}}" bind:back="onBack" />') !== -1, name + ' 必须复用共享 Navbar');
  assert.ok(wxml.indexOf('<pui-scroll-area') !== -1 && wxml.indexOf('<scroll-view') === -1, name + ' 必须只有一个 ScrollArea');
  assert.ok(wxml.indexOf('<button') === -1, name + ' 不得手写原生 Button');
  assert.strictEqual(json.usingComponents['component-page-navbar'], '/components/component-page-navbar/component-page-navbar');
  assert.strictEqual(json.usingComponents['component-page-section'], '/components/component-page-section/component-page-section');
});

var alert = loadPage('alert');
alert.onAlertChange({ detail: { visible: false } });
assert.strictEqual(alert.data.alertVisible, false, 'Alert 关闭请求必须由页面受控回写');
alert.onReopenAlert();
assert.strictEqual(alert.data.alertVisible, true, 'Alert 隐藏后必须有真实恢复入口');

var empty = loadPage('empty');
empty.onClearFilter();
assert.ok(empty.data.emptyStatus.indexOf('已清除') !== -1, 'Empty action 必须由页面提供真实下一步');

var loading = loadPage('loading');
loading.onToggleLoading();
assert.strictEqual(loading.data.loadingVisible, false, 'Loading 必须允许页面控制可见性');

var noticeBar = loadPage('notice-bar');
noticeBar.onNoticeClick({ detail: { trigger: 'suffix-icon' } });
assert.strictEqual(noticeBar.data.noticeVisible, false, 'NoticeBar suffix Close 必须由页面处理');
noticeBar.onReopenNotice();
assert.strictEqual(noticeBar.data.noticeVisible, true, 'NoticeBar 必须有页面恢复入口');
assert.deepStrictEqual(Array.from(noticeBar.data.verticalNotices), ['新增 12 个表单组件示例', '深色模式对比度已优化'], 'NoticeBar 垂直内容必须来自页面数据');

var progress = loadPage('progress');
progress.onAdvanceProgress();
assert.strictEqual(progress.data.progressValue, 60, 'Progress 示例必须真实更新确定进度');
progress.onResetProgress();
assert.strictEqual(progress.data.progressValue, 0, 'Progress 示例必须能重置展示值');

var skeleton = loadPage('skeleton');
skeleton.onToggleSkeleton();
assert.strictEqual(skeleton.data.skeletonLoading, false, 'Skeleton 必须由页面控制占位与内容切换');
assert.ok(Array.isArray(skeleton.data.skeletonRows) && skeleton.data.skeletonRows.length > 0, 'Skeleton 行配置必须来自页面数据而非 WXML 字面量');
assert.strictEqual(skeleton.data.skeletonAvatarRows[0].type, 'circle', 'Skeleton 头像示例必须通过 rowCol circle 使用共享组件能力');
assert.strictEqual(skeleton.data.skeletonAvatarRows[0].size, '72rpx', 'Skeleton 头像示例必须用 size 同源约束宽高，不得用页面 CSS 补圆');

var toast = loadPage('toast');
var shown;
toast.selectComponent = function () {
  return { show: function (options) { shown = options; } };
};
toast.onShowToast({ currentTarget: { dataset: { theme: 'loading' } } });
assert.strictEqual(shown.theme, 'loading', 'Toast 必须经真实 show(options) 调用');
toast.onToastClose();
assert.ok(toast.data.toastStatus.indexOf('结束') !== -1, 'Toast close 只能表达提示结束');

var toastWxml = read('miniprogram/pages/components/toast/index.wxml');
assert.ok(toastWxml.indexOf('id="feedback-toast"') !== -1 && toastWxml.indexOf('bind:close="onToastClose"') !== -1, 'Toast 页面必须挂载并监听真实 Toast 实例');

var dialog = loadPage('dialog');
dialog.onOpenDialog();
assert.strictEqual(dialog.data.dialogVisible, true, 'Dialog 打开必须由页面写回 visible');
dialog.onDialogConfirm();
assert.strictEqual(dialog.data.dialogVisible, false, 'Dialog confirm 必须由页面决定收起');
dialog.onOpenDialog();
dialog.onDialogClose({ detail: { trigger: 'close-btn' } });
assert.strictEqual(dialog.data.dialogVisible, false, 'Dialog close 必须由页面写回 visible');
dialog.onOpenLockedDialog();
assert.strictEqual(dialog.data.lockedDialogVisible, true, '长内容 Dialog 必须有独立受控显隐状态');
dialog.onLockedDialogOverlayClick();
assert.strictEqual(dialog.data.lockedDialogVisible, true, '禁止遮罩关闭时，页面不得伪造关闭');
dialog.onLockedDialogClose({ detail: { trigger: 'close-btn' } });
assert.strictEqual(dialog.data.lockedDialogVisible, false, 'Header 关闭请求必须由页面回写');
dialog.onToggleDialogContent();
assert.strictEqual(dialog.data.dialogContentState, 'loading', 'Dialog 内容状态只能由页面组合状态切换');

var dialogWxml = read('miniprogram/pages/components/dialog/index.wxml');
var dialogJson = JSON.parse(read('miniprogram/pages/components/dialog/index.json'));
assert.ok(dialogWxml.indexOf('<pui-dialog') !== -1, 'Dialog 页面必须组合真实 Dialog');
['bind:confirm="onDialogConfirm"', 'bind:cancel="onDialogCancel"', 'bind:close="onDialogClose"', 'bind:overlay-click="onDialogOverlayClick"'].forEach(function (binding) {
  assert.ok(dialogWxml.indexOf(binding) !== -1, 'Dialog 页面必须真实处理 ' + binding);
});
assert.ok(dialogWxml.indexOf('close-on-overlay-click="{{false}}"') !== -1, 'Dialog 页面必须展示禁止遮罩关闭的真实边界');
assert.ok(dialogWxml.indexOf('slot="content"') !== -1, 'Dialog 内容状态必须放入 content Slot');
assert.ok(dialogWxml.indexOf('<pui-loading') !== -1 && dialogWxml.indexOf('<pui-empty') !== -1, 'Dialog 页面必须由内容 Slot 组合 Loading 与 Empty');
assert.ok(dialogJson.usingComponents['pui-dialog'], 'poemui-miniprogram/dialog/dialog');

console.log('miniprogram feedback page contract tests passed');
