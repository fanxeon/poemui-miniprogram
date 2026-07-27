'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var ROOT = path.resolve(__dirname, '..');
var pages = ['pull-refresh', 'virtual-list', 'watermark'];
function read(relativePath) { return fs.readFileSync(path.join(ROOT, relativePath), 'utf8'); }
function load(name) {
  var page;
  vm.runInNewContext(read('miniprogram/pages/components/' + name + '/index.js'), {
    Page: function (definition) { page = definition; },
    require: function (request) {
      if (request === '../../../utils/component-page') return function (config) { return Object.assign({ data: config.data || {} }, config.methods || {}); };
      throw new Error('Unexpected advanced page dependency: ' + request);
    },
    Array: Array,
    Object: Object,
    Number: Number,
    String: String
  }, { filename: name + '/index.js' });
  assert.ok(page, name + ' 必须注册 Page');
  page.data = JSON.parse(JSON.stringify(page.data));
  page.setData = function (next) { Object.assign(page.data, next); };
  return page;
}

pages.forEach(function (name) {
  var base = 'miniprogram/pages/components/' + name + '/index';
  var wxml = read(base + '.wxml');
  var json = JSON.parse(read(base + '.json'));
  assert.ok(wxml.indexOf('<pui-config-provider') !== -1 && wxml.indexOf('use-global-config') !== -1, name + ' 必须继承全局外观');
  assert.ok(wxml.indexOf('<component-page-navbar title="{{pageTitle}}" bind:back="onBack" />') !== -1, name + ' 必须使用共享 Navbar');
  assert.ok(wxml.indexOf('<button') === -1 && wxml.indexOf('<scroll-view') === -1, name + ' 不得手写平台控件或第二滚动根');
  assert.ok(json.usingComponents['component-page-navbar'], name + ' 必须注册共享 Navbar');
});

var pullRefresh = load('pull-refresh');
pullRefresh.onPullRefresh();
assert.strictEqual(pullRefresh.data.pullRefreshing, true, 'PullRefresh refresh 请求必须由页面写回');
pullRefresh.onCompleteLocalRefresh();
assert.strictEqual(pullRefresh.data.pullRefreshing, false, 'PullRefresh 只能由页面结束本地刷新');
assert.ok(pullRefresh.data.pullStatus.indexOf('服务器成功') === -1, 'PullRefresh 不得伪造服务器成功');

var virtualList = load('virtual-list');
var virtualListWxml = read('miniprogram/pages/components/virtual-list/index.wxml');
var advancedStyle = read('miniprogram/styles/advanced-pages.wxss');
assert.ok(advancedStyle.indexOf('.advanced-page__toolbar { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));') !== -1, 'VirtualList 双操作工具栏必须稳定等分为两列');
assert.strictEqual((virtualListWxml.match(/<pui-button block/g) || []).length, 2, 'VirtualList 两个操作按钮必须填满各自网格轨道');
assert.strictEqual(virtualList.data.virtualItems.length, 120, 'VirtualList 必须使用真实长数据而非短列表');
assert.strictEqual(virtualList.data.virtualListHeight, 1, 'VirtualList 初始必须有合法数值高度，真实高度由页面测量后换算');
virtualList.onVirtualChange({ detail: { value: 'item-10' } });
assert.strictEqual(virtualList.data.virtualValue, 'item-10', 'VirtualList 选择必须由页面回写');
virtualList.onVirtualToTop();
assert.strictEqual(virtualList.data.virtualScrollTop, 0, 'VirtualList 必须支持真实 scrollTop 回顶');
virtualList.onToggleVirtualMultiple();
assert.strictEqual(virtualList.data.virtualMultiple, true, 'VirtualList 必须能切换多选模式');

var watermark = load('watermark');
watermark.onToggleWatermarkLayout();
assert.strictEqual(watermark.data.watermarkLayout, 'hexagonal', 'Watermark 布局必须由页面回写');
watermark.onToggleWatermarkMove();
assert.strictEqual(watermark.data.watermarkMovable, true, 'Watermark 移动状态必须由页面回写');

console.log('miniprogram advanced page contract tests passed');
