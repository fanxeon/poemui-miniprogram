'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

var hostBase = 'miniprogram/components/component-page-feedback/component-page-feedback';
var hostJson = JSON.parse(read(hostBase + '.json'));
var hostWxml = read(hostBase + '.wxml');
var hostStyle = read(hostBase + '.wxss');
var capturedHost;

vm.runInNewContext(read(hostBase + '.js'), {
  Component: function Component(definition) {
    capturedHost = definition;
  }
}, { filename: hostBase + '.js' });

assert.ok(capturedHost && capturedHost.methods, 'component-page-feedback 必须注册真实共享组件');
assert.strictEqual(hostJson.usingComponents['pui-dynamic-message'], 'poemui-miniprogram/dynamic-message/dynamic-message', '共享反馈宿主必须组合发布包内的 DynamicMessage');
assert.ok(hostWxml.indexOf('id="page-feedback-message"') !== -1, '共享反馈宿主必须提供稳定 DynamicMessage 实例');
assert.ok(hostWxml.indexOf('bind:click="onMessageClick"') !== -1 && hostWxml.indexOf('bind:action="onMessageAction"') !== -1 && hostWxml.indexOf('bind:close="onMessageClose"') !== -1, '共享反馈宿主必须透传真实 click/action/close');
assert.ok(hostStyle.indexOf('height: 0') !== -1, '共享反馈宿主不得占用页面文档流高度');

var shownOptions;
var updatedArgs;
var hiddenKey;
var relayedEvents = [];
var messageMock = {
  show: function show(options) {
    shownOptions = options;
    return options.key;
  },
  update: function update(key, patch) {
    updatedArgs = [key, patch];
    return true;
  },
  hide: function hide(key) {
    hiddenKey = key;
    return true;
  }
};
var hostInstance = Object.assign({
  selectComponent: function selectComponent(selector) {
    assert.strictEqual(selector, '#page-feedback-message');
    return messageMock;
  },
  triggerEvent: function triggerEvent(name, detail) {
    relayedEvents.push([name, detail]);
  }
}, capturedHost.methods);

assert.strictEqual(hostInstance.show({ key: 'recovery', theme: 'success' }), 'recovery', '共享反馈宿主必须返回 DynamicMessage 的真实 key');
assert.deepStrictEqual(shownOptions, { key: 'recovery', theme: 'success' });
assert.strictEqual(hostInstance.update('recovery', { theme: 'error' }), true, '共享反馈宿主必须返回真实 update 命中结果');
assert.deepStrictEqual(updatedArgs, ['recovery', { theme: 'error' }]);
assert.strictEqual(hostInstance.hide('recovery'), true, '共享反馈宿主必须返回真实 hide 结果');
assert.strictEqual(hiddenKey, 'recovery');
hostInstance.onMessageClick({ detail: { key: 'recovery' } });
hostInstance.onMessageAction({ detail: { key: 'recovery' } });
hostInstance.onMessageClose({ detail: { key: 'recovery', reason: 'timeout' } });
assert.deepStrictEqual(relayedEvents, [
  ['click', { key: 'recovery' }],
  ['action', { key: 'recovery' }],
  ['close', { key: 'recovery', reason: 'timeout' }]
], '共享反馈宿主不得改写 DynamicMessage 事件 detail');

var createComponentPage = require(path.join(ROOT, 'miniprogram/utils/component-page.js'));
var page = createComponentPage({ title: 'FeedbackContract' });
var pageFeedback = {
  show: messageMock.show,
  update: messageMock.update,
  hide: messageMock.hide
};
page.selectComponent = function selectPageComponent(selector) {
  assert.strictEqual(selector, '#component-page-feedback');
  return pageFeedback;
};
assert.strictEqual(page.showPageFeedback({ key: 'page-task', theme: 'loading' }), 'page-task', '页面工厂必须返回宿主 show 的真实 key');
assert.strictEqual(page.updatePageFeedback('page-task', { theme: 'success' }), true, '页面工厂必须返回宿主 update 的真实布尔结果');
assert.strictEqual(page.hidePageFeedback('page-task'), true, '页面工厂必须返回宿主 hide 的真实布尔结果');
delete page.selectComponent;
assert.strictEqual(page.showPageFeedback({ key: 'missing' }), '', '未挂载宿主时不得伪造 show 成功');
assert.strictEqual(page.updatePageFeedback('missing', {}), false, '未挂载宿主时不得伪造 update 命中');
assert.strictEqual(page.hidePageFeedback('missing'), false, '未挂载宿主时不得伪造 hide 成功');

var navigationBase = 'miniprogram/pages/components/navigation-menu/index';
var navigationJs = read(navigationBase + '.js');
var navigationWxml = read(navigationBase + '.wxml');
var navigationJson = JSON.parse(read(navigationBase + '.json'));
var feedbackIndex = navigationWxml.indexOf('<component-page-feedback id="component-page-feedback"');
var scrollEndIndex = navigationWxml.indexOf('</pui-scroll-area>');

assert.ok(feedbackIndex > scrollEndIndex, '页面反馈宿主必须位于唯一 ScrollArea 外，不能随内容滚动或被裁切');
assert.strictEqual(navigationJson.usingComponents['component-page-feedback'], '/components/component-page-feedback/component-page-feedback', 'NavigationMenu 必须注册共享反馈宿主');
assert.ok(navigationWxml.indexOf('navigation-page__status') === -1, 'NavigationMenu 不得保留“已展开/已关闭”等低识别度重复状态文字');
assert.ok(navigationJs.indexOf('horizontalMenuStatus') === -1 && navigationJs.indexOf('verticalMenuStatus') === -1 && navigationJs.indexOf('errorMenuStatus') === -1, 'NavigationMenu 不得继续维护已移除的重复状态真相源');
assert.ok(navigationJs.indexOf("key: 'navigation-menu-recovery'") !== -1 && navigationJs.indexOf("theme: 'success'") !== -1, 'NavigationMenu 只在目录真实恢复后使用稳定 key 发布重要结果');
assert.ok(navigationJs.indexOf('function afterRecovery()') !== -1, '目录恢复通知必须等待 error Prop 真实回写完成');

console.log('miniprogram page feedback contract tests passed');
