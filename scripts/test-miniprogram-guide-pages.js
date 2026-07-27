'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var ROOT = path.resolve(__dirname, '..');
var guides = ['getting-started', 'theme-tokens', 'color', 'spacing', 'typography'];

function read(relativePath) { return fs.readFileSync(path.join(ROOT, relativePath), 'utf8'); }
function load(name, redirects) {
  var page;
  vm.runInNewContext(read('miniprogram/pages/guides/' + name + '/index.js'), {
    Page: function (definition) { page = definition; },
    require: function (request) { if (request === '../../../utils/component-page') return function (config) { return Object.assign({ data: config.data || {} }, config.methods || {}); }; throw new Error('Unexpected guide page dependency: ' + request); },
    Object: Object, Array: Array, String: String, Boolean: Boolean,
    wx: { redirectTo: function (options) { redirects.push(options); } }
  }, { filename: name + '/index.js' });
  assert.ok(page, name + ' 必须注册 Page');
  page.data = JSON.parse(JSON.stringify(page.data));
  page.setData = function (next) { Object.assign(page.data, next); };
  return page;
}

guides.forEach(function (name) {
  var base = 'miniprogram/pages/guides/' + name + '/index';
  var wxml = read(base + '.wxml');
  var json = JSON.parse(read(base + '.json'));
  assert.ok(wxml.indexOf('<pui-config-provider') !== -1 && wxml.indexOf('use-global-config') !== -1, name + ' 规范页必须接入全局外观');
  assert.ok(wxml.indexOf('<component-page-navbar title="{{pageTitle}}" bind:back="onBack" />') !== -1, name + ' 规范页必须使用共享 Navbar');
  assert.ok(wxml.indexOf('<pui-scroll-area') !== -1 && wxml.indexOf('<scroll-view') === -1, name + ' 规范页必须仅有一个页面 ScrollArea');
  assert.ok(wxml.indexOf('<button') === -1 && wxml.indexOf('<input') === -1 && wxml.indexOf('<textarea') === -1 && wxml.indexOf('<select') === -1, name + ' 规范页不得手写平台控件');
  assert.ok(wxml.indexOf('<component-page-section') !== -1, name + ' 规范页必须使用共享内容分区');
  assert.ok(json.usingComponents['component-page-navbar'] && json.usingComponents['component-page-section'], name + ' 必须注册共享页面设施');
});

var redirects = [];
var gettingStarted = load('getting-started', redirects);
gettingStarted.onOpenQuickStyles();
assert.strictEqual(redirects[0].url, '/pages/styles/index', '开始使用页必须跳转到真实快速样式路由');
assert.ok(gettingStarted.data.guideStatus.indexOf('正在打开') !== -1, '开始使用页必须回写真实跳转意图');

console.log('miniprogram guide page contract tests passed');
