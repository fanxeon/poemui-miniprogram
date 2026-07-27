'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var ROOT = path.resolve(__dirname, '..');
var pages = ['avatar', 'badge', 'card', 'image', 'tag', 'cell', 'list', 'collapse', 'collapsible', 'bubble', 'swipe-cell', 'count-down', 'swiper', 'table'];
function read(relativePath) { return fs.readFileSync(path.join(ROOT, relativePath), 'utf8'); }
function load(name) {
  var page;
  vm.runInNewContext(read('miniprogram/pages/components/' + name + '/index.js'), {
    Page: function (definition) { page = definition; },
    require: function (request) { if (request === '../../../utils/component-page') return function (config) { return Object.assign({ data: config.data || {} }, config.methods || {}); }; throw new Error('Unexpected data page dependency: ' + request); },
    Array: Array, Object: Object, Number: Number, String: String
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
  assert.ok(wxml.indexOf('<pui-scroll-area') !== -1 && wxml.indexOf('<scroll-view') === -1, name + ' 必须只有一个页面 ScrollArea');
  assert.ok(wxml.indexOf('<button') === -1, name + ' 不得手写原生 Button');
  assert.ok(json.usingComponents['component-page-navbar'] && json.usingComponents['component-page-section'], name + ' 必须注册共享页面设施');
});
var avatar = load('avatar'); avatar.onToggleAvatarShape(); assert.strictEqual(avatar.data.avatarShape, 'round');
var badge = load('badge'); badge.onCycleBadge(); assert.strictEqual(badge.data.badgeCount, 0, 'Badge 必须保留 0');
var card = load('card'); card.onCardClick(); assert.strictEqual(card.data.cardClicks, 1);
var image = load('image'); image.onToggleImageError(); assert.strictEqual(image.data.imageError, true);
var tag = load('tag'); tag.onTagClose(); assert.strictEqual(tag.data.tagVisible, false); tag.onRestoreTag(); assert.strictEqual(tag.data.tagVisible, true);
var cell = load('cell'); cell.onCellChange({ detail: { selected: true } }); assert.strictEqual(cell.data.cellSelected, true);
var list = load('list'); list.onToggleListError(); assert.strictEqual(list.data.listError, true); list.onListRetry(); assert.strictEqual(list.data.listError, true, 'List retry 不得自动伪造恢复'); list.onRestoreList(); assert.strictEqual(list.data.listError, false);
var collapse = load('collapse'); collapse.onCollapseChange({ detail: { value: ['page'] } }); assert.deepStrictEqual(collapse.data.collapseValue, ['page']);
var collapsible = load('collapsible'); collapsible.onCollapsibleChange({ detail: { open: true } }); assert.strictEqual(collapsible.data.collapsibleOpen, true);
var bubble = load('bubble'); bubble.onBubbleChange({ detail: { expanded: true } }); assert.strictEqual(bubble.data.bubbleExpanded, true);
var swipe = load('swipe-cell'); swipe.onSwipeAction({ detail: { action: { text: '删除' } } }); assert.ok(swipe.data.swipeStatus.indexOf('删除') !== -1);
var countDown = load('count-down'); countDown.onToggleCountDown(); assert.strictEqual(countDown.data.countPaused, false); countDown.onCountFinish(); assert.strictEqual(countDown.data.countPaused, true);
var swiper = load('swiper'); swiper.onSwiperChange({ detail: { value: 'page' } }); assert.strictEqual(swiper.data.swiperValue, 'page');
var table = load('table'); table.onTableChange({ detail: { value: ['button'] } }); assert.deepStrictEqual(table.data.tableSelected, ['button']);
console.log('miniprogram data page contract tests passed');
