'use strict';

require('./test-top-loading');
require('./test-dynamic-message');
require('./test-area-chart');
require('./test-bar-chart');
require('./test-waffle');

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var ROOT = path.resolve(__dirname, '..');
var pages = ['area-chart', 'bar-chart', 'waffle', 'top-loading', 'dynamic-message', 'pull-refresh', 'virtual-list', 'watermark'];
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

var barChart = load('bar-chart');
barChart.onToggleChartData();
assert.strictEqual(barChart.data.highVariance, true, 'BarChart 示例必须由父级真实回写高波动态');
assert.strictEqual(barChart.data.chartItems[0].segments[0].value, 48, 'BarChart 高波动态必须显著改变条形长度');
assert.strictEqual(barChart.data.chartItems[1].segments[0].value, 12, 'BarChart 高波动态必须同时包含明显下降');
barChart.onToggleChartMode();
assert.strictEqual(barChart.data.chartMode, 'grouped', 'BarChart 示例必须由父级切换布局模式');

var waffle = load('waffle');
waffle.onToggleWaffleData();
assert.strictEqual(waffle.data.highVariance, true, 'Waffle 示例必须由父级真实回写高波动态');
assert.strictEqual(waffle.data.waffleItems[0].segments[0].value, 62, 'Waffle 高波动态必须显著增加点阵数量');
assert.strictEqual(waffle.data.waffleItems[0].segments[1].value, 24, 'Waffle 高波动态必须保持分段变化可辨认');
waffle.onToggleWaffleShape();
assert.strictEqual(waffle.data.waffleShape, 'circle', 'Waffle 示例必须由父级切换单元形状');

var areaChart = load('area-chart');
areaChart.onToggleData();
assert.strictEqual(areaChart.data.highVariance, true, 'AreaChart 示例必须由父级真实回写高波动态');
assert.strictEqual(areaChart.data.trendItems[0].segments[0].value, 310, 'AreaChart 高波动态必须显著改变首个数据点');
assert.strictEqual(areaChart.data.trendItems[1].segments[0].value, 88, 'AreaChart 高波动态必须形成明显峰谷');
areaChart.onToggleCurve();
assert.strictEqual(areaChart.data.curve, 'linear', 'AreaChart 示例必须由父级切换曲线');
areaChart.onToggleStacked();
assert.strictEqual(areaChart.data.stacked, true, 'AreaChart 示例必须由父级切换堆叠模式');

var topLoading = load('top-loading');
topLoading.clearProgressTimer = function () { this._progressTimer = null; };
topLoading.onStartUnknown();
assert.strictEqual(topLoading.data.taskState, 'loading', 'TopLoading 未知进度必须由页面真实回写 loading');
assert.strictEqual(topLoading.data.taskProgress, null, 'TopLoading 未知进度必须保留 null');
topLoading.onComplete();
assert.strictEqual(topLoading.data.taskState, 'success', 'TopLoading 只有显式完成操作才能写入 success');
topLoading.onCancel();
assert.strictEqual(topLoading.data.taskState, 'idle', 'TopLoading 失败或取消必须回到 idle');

var dynamicWxml = read('miniprogram/pages/components/dynamic-message/index.wxml');
var dynamicJs = read('miniprogram/pages/components/dynamic-message/index.js');
assert.ok(dynamicWxml.indexOf('<pui-dynamic-message') !== -1, 'DynamicMessage 页面必须使用真实组件');
assert.ok(dynamicWxml.indexOf('id="dynamic-message-start"') !== -1, 'DynamicMessage 页面必须提供稳定的真实触发入口用于运行态 battle');
assert.ok(dynamicWxml.indexOf('bind:action="onNotificationAction"') !== -1 && dynamicWxml.indexOf('bind:close="onNotificationClose"') !== -1, 'DynamicMessage 页面必须承接真实事件');
assert.ok(dynamicJs.indexOf("selectComponent('#dynamic-message')") !== -1, 'DynamicMessage 页面必须调用真实实例');
assert.ok(dynamicJs.indexOf(".update('component-build'") !== -1, 'DynamicMessage 页面必须展示同 key 原位更新');
assert.ok(dynamicJs.indexOf("key = 'queue-' + Date.now()") !== -1, 'DynamicMessage 页面必须展示不同 key 队列');
assert.ok(dynamicWxml.indexOf('<pui-cell-group aria-label="DynamicMessage 外观设置">') !== -1, 'DynamicMessage 页面必须用 CellGroup 陈列私有外观设置');
assert.ok(dynamicWxml.indexOf('shadow="{{messageShadow}}"') !== -1 && dynamicWxml.indexOf('frosted-glass="{{messageFrostedGlass}}"') !== -1, 'DynamicMessage 页面必须把私有阴影与毛玻璃开关传给真实组件');
assert.ok(dynamicWxml.indexOf('<pui-switch slot="right" value="{{messageShadow}}"') !== -1 && dynamicWxml.indexOf('<pui-switch slot="right" value="{{messageFrostedGlass}}"') !== -1, 'DynamicMessage 页面必须复用 PUI Switch');
assert.ok(dynamicJs.indexOf('onMessageShadowChange') !== -1 && dynamicJs.indexOf('onMessageFrostedGlassChange') !== -1, 'DynamicMessage 页面必须真实回写私有外观 Props');

console.log('miniprogram advanced page contract tests passed');
