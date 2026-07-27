'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var ROOT = path.resolve(__dirname, '..');
var pages = ['aspect-ratio', 'direction', 'grid', 'scroll-area', 'sticky'];

function read(relativePath) { return fs.readFileSync(path.join(ROOT, relativePath), 'utf8'); }
function load(name) {
  var page;
  vm.runInNewContext(read('miniprogram/pages/components/' + name + '/index.js'), {
    Page: function (definition) { page = definition; },
    require: function (request) {
      if (request === '../../../utils/component-page') return function (config) { return Object.assign({ data: config.data || {} }, config.methods || {}); };
      throw new Error('Unexpected layout page dependency: ' + request);
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

var aspect = load('aspect-ratio');
aspect.onChangeRatio();
assert.strictEqual(aspect.data.ratio, '1 / 1', 'AspectRatio 必须回写比例');
aspect.onToggleOverflow();
assert.strictEqual(aspect.data.overflow, false, 'AspectRatio 必须回写 overflow');

var direction = load('direction');
direction.onCycleDirection();
assert.strictEqual(direction.data.directionValue, 'rtl', 'Direction 必须循环至 RTL');
direction.onToggleLanguage();
assert.strictEqual(direction.data.directionLanguage, 'en', 'Direction auto 语言必须由页面回写');

var grid = load('grid');
grid.onToggleGridLayout();
assert.strictEqual(grid.data.gridColumn, 3, 'Grid 列数必须由页面回写');
grid.onSetGridError();
assert.strictEqual(grid.data.gridError, true, 'Grid 必须能够进入 error 状态');
grid.onGridRetry();
assert.strictEqual(grid.data.gridError, true, 'Grid retry 只通知页面，不得自动伪造恢复');
grid.onRestoreGrid();
assert.strictEqual(grid.data.gridError, false, 'Grid 必须由页面在内容真实恢复后清除 error');

var scrollArea = load('scroll-area');
scrollArea.onAreaScroll({ detail: { scrollTop: 120, scrollHeight: 680 } });
assert.strictEqual(scrollArea.data.areaScrollTop, 120, 'ScrollArea 必须回写真实 scrollTop');
assert.ok(scrollArea.data.areaRows.length >= 10, 'ScrollArea 页面必须提供足够长的真实滚动内容');
assert.strictEqual(scrollArea.data.areaGradientOverlaySize, 'md', 'ScrollArea 遮罩尺寸必须从合同默认档开始');
scrollArea.onAreaGradientChange({ detail: { checked: false } });
assert.strictEqual(scrollArea.data.areaGradientOverlay, false, 'ScrollArea 页面必须能真实关闭自身遮罩');
scrollArea.onAreaGradientChange({ detail: { checked: true } });
assert.strictEqual(scrollArea.data.areaGradientOverlay, true, 'ScrollArea 页面必须能真实开启自身遮罩');
scrollArea.onDecreaseAreaGradient();
assert.strictEqual(scrollArea.data.areaGradientOverlaySize, 'sm', 'ScrollArea 页面必须能减小到 sm 遮罩');
assert.strictEqual(scrollArea.data.areaGradientCanDecrease, false, 'ScrollArea 到达最小遮罩后必须禁用继续减小');
scrollArea.onDecreaseAreaGradient();
assert.strictEqual(scrollArea.data.areaGradientOverlaySize, 'sm', 'ScrollArea 遮罩尺寸不得小于公开 sm 档');
scrollArea.onIncreaseAreaGradient();
scrollArea.onIncreaseAreaGradient();
assert.strictEqual(scrollArea.data.areaGradientOverlaySize, 'lg', 'ScrollArea 页面必须能增大到 lg 遮罩');
assert.strictEqual(scrollArea.data.areaGradientCanIncrease, false, 'ScrollArea 到达最大遮罩后必须禁用继续增大');
scrollArea.onIncreaseAreaGradient();
assert.strictEqual(scrollArea.data.areaGradientOverlaySize, 'lg', 'ScrollArea 遮罩尺寸不得大于公开 lg 档');
var scrollAreaWxml = read('miniprogram/pages/components/scroll-area/index.wxml');
var scrollAreaJson = JSON.parse(read('miniprogram/pages/components/scroll-area/index.json'));
assert.ok(scrollAreaWxml.indexOf('gradient-overlay="{{areaGradientOverlay}}"') !== -1, 'ScrollArea 开关必须直接控制被测组件 Prop');
assert.ok(scrollAreaWxml.indexOf('gradient-overlay-size="{{areaGradientOverlaySize}}"') !== -1, 'ScrollArea 尺寸按钮必须直接控制被测组件 Prop');
assert.ok(scrollAreaWxml.indexOf('component-page__row--actions') !== -1, 'ScrollArea 尺寸操作必须使用两列操作行');
assert.ok(scrollAreaJson.usingComponents['pui-switch'] && scrollAreaJson.usingComponents['pui-button'], 'ScrollArea 控制区必须复用 PUI Switch 与 Button');

var sticky = load('sticky');
assert.strictEqual(sticky.data.stickyRows.length, 10, 'Sticky 演示正文必须由五条加倍到十条，形成足够滚动距离');
var forwarded;
sticky.selectComponent = function () { return { onPageScroll: function (event) { forwarded = event; } }; };
sticky.onStickyHostScroll({ detail: { scrollTop: 88 } });
assert.strictEqual(forwarded.scrollTop, 88, 'Sticky 必须把宿主真实滚动交给组件定位逻辑');
sticky.onToggleStickyOffset();
assert.strictEqual(sticky.data.stickyOffset, 24, 'Sticky 偏移必须由页面回写');
sticky.onToggleStickyDisabled();
assert.strictEqual(sticky.data.stickyDisabled, true, 'Sticky disabled 必须由页面回写');

console.log('miniprogram layout page contract tests passed');
