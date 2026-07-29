'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var GROUPS = {
  layout: ['aspect-ratio', 'direction', 'grid', 'scroll-area', 'sticky'],
  navigation: ['navbar', 'navigation-menu', 'tabs', 'breadcrumb', 'tabbar', 'steps', 'back-top', 'indexes', 'sidebar'],
  form: ['form', 'field', 'label', 'input', 'input-otp', 'textarea', 'search', 'checkbox', 'radio', 'switch', 'select', 'picker', 'combobox', 'slider', 'stepper', 'rate', 'calendar', 'date-time-picker', 'upload'],
  data: ['collapse', 'avatar', 'badge', 'bubble', 'card', 'cell', 'collapsible', 'count-down', 'image', 'list', 'swipe-cell', 'swiper', 'table', 'tag'],
  feedback: ['alert', 'dialog', 'empty', 'loading', 'notice-bar', 'progress', 'result', 'skeleton', 'toast'],
  advanced: ['area-chart', 'bar-chart', 'waffle', 'pull-refresh', 'virtual-list', 'watermark']
};
var SCROLL_OWNERS = new Set(['scroll-area', 'pull-refresh', 'virtual-list']);
var IDS = Object.keys(GROUPS).reduce(function flatten(result, group) {
  return result.concat(GROUPS[group]);
}, []);

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function literalSectionCopy(wxml) {
  return Array.from(wxml.matchAll(/\b(?:title|subtitle|description)="([^"{][^"]*)"/g))
    .map(function pick(match) { return match[1]; })
    .join('');
}

assert.strictEqual(IDS.length, 62, '质量门禁必须完整覆盖 62 个小程序独立组件页');
assert.strictEqual(new Set(IDS).size, IDS.length, '质量门禁中的组件页面不得重复');

IDS.forEach(function verifyPage(id) {
  var base = 'miniprogram/pages/components/' + id + '/index';
  var wxml = read(base + '.wxml');
  var js = read(base + '.js');
  var json = JSON.parse(read(base + '.json'));
  var ownTag = '<pui-' + id;
  var sectionCount = (wxml.match(/<component-page-section\b/g) || []).length;
  var visibleCopy = literalSectionCopy(wxml);

  assert.ok(wxml.indexOf('<pui-config-provider') !== -1 && wxml.indexOf('use-global-config') !== -1, id + ' 必须继承全局外观');
  assert.ok(wxml.indexOf('<component-page-navbar') !== -1, id + ' 必须复用共享 Navbar');
  assert.ok(wxml.indexOf(ownTag) !== -1, id + ' 页面必须展示真实 ' + ownTag + ' 组件');
  assert.ok(js.indexOf('createComponentPage(') !== -1, id + ' 必须复用共享页面工厂');
  assert.ok(json.usingComponents['pui-' + id], id + ' 必须注册真实组件依赖');
  assert.ok(wxml.indexOf('<button') === -1 && wxml.indexOf('<input') === -1 && wxml.indexOf('<textarea') === -1 && wxml.indexOf('<select') === -1, id + ' 页面不得手写平台控件');
  assert.ok(!/<component-page-section\b[^>]*\/>/.test(wxml), id + ' 不得保留自闭合空分区');
  assert.ok(!/<component-page-section\b[^>]*>\s*<\/component-page-section>/.test(wxml), id + ' 不得保留无内容分区');
  assert.ok(wxml.indexOf('title="基础用法"') === -1, id + ' 必须使用真实任务标题，不能退回通用“基础用法”');

  if (SCROLL_OWNERS.has(id)) {
    assert.strictEqual(sectionCount, 0, id + ' 是滚动所有者，不应为套分区再制造第二滚动上下文');
  } else {
    assert.ok(wxml.indexOf('<pui-scroll-area') !== -1, id + ' 必须复用唯一页面 ScrollArea');
    assert.ok(sectionCount >= 1, id + ' 至少需要一个承载真实组件的内容分区');
    assert.ok(visibleCopy.length >= 30, id + ' 的标题和说明不足以解释代表场景与关键边界');
  }
});

console.log('miniprogram component page quality tests passed for ' + IDS.length + ' pages');
