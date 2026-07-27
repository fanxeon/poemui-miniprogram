'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

var appJson = JSON.parse(read('miniprogram/app.json'));
var navigation = require(path.join(ROOT, 'miniprogram/common/utils/tabbar-navigation'));
var expectedItems = [
  { label: '', value: 'home', icon: 'home', ariaLabel: '首页' },
  { label: '', value: 'styles', icon: 'palette', ariaLabel: '快速样式' },
  { label: '', value: 'codex', icon: 'codex', ariaLabel: 'Codex' },
  { label: '', value: 'me', icon: 'user', ariaLabel: '我的' }
];

assert.deepStrictEqual(navigation.getItems(), expectedItems, 'Tabbar 目的地必须是首页、快速样式、Codex 和我的');
assert.notStrictEqual(navigation.getItems(), navigation.getItems(), 'Tabbar 条目每次读取必须返回新数组');
['pages/index/index', 'pages/styles/index', 'pages/codex/index', 'pages/me/index'].forEach(function (route) {
  assert.ok(appJson.pages.indexOf(route) !== -1, 'app.json 缺少真实 Tabbar 页面 ' + route);
});
assert.strictEqual(appJson.pages.indexOf('pages/explore/index'), -1, '旧探索空白页必须从真实路由移除');

var redirectCalls = [];
global.wx = {
  redirectTo: function (options) { redirectCalls.push(options); }
};
assert.strictEqual(navigation.navigateToTab('home', 'home'), false, '当前页不能制造重复跳转');
assert.strictEqual(navigation.navigateToTab('unknown', 'home'), false, '未知目的地不能制造跳转');
assert.strictEqual(navigation.navigateToTab('styles', 'home'), true, '样式页面必须是真实目标');
assert.strictEqual(navigation.navigateToTab('codex', 'styles'), true, 'Codex 页面必须是真实目标');
assert.strictEqual(navigation.navigateToTab('me', 'codex'), true, '我的页面必须是真实目标');
assert.deepStrictEqual(redirectCalls, [
  { url: '/pages/styles/index' },
  { url: '/pages/codex/index' },
  { url: '/pages/me/index' }
], 'Tabbar 必须使用真实页面路由');
delete global.wx;

var codexJson = JSON.parse(read('miniprogram/pages/codex/index.json'));
var codexWxml = read('miniprogram/pages/codex/index.wxml');
var codexWxss = read('miniprogram/pages/codex/index.wxss');
var codexJs = read('miniprogram/pages/codex/index.js');
[
  ['pui-config-provider', 'poemui-miniprogram/config-provider/config-provider'],
  ['pui-navbar', 'poemui-miniprogram/navbar/navbar'],
  ['pui-scroll-area', 'poemui-miniprogram/scroll-area/scroll-area'],
  ['pui-tabbar', 'poemui-miniprogram/tabbar/tabbar'],
  ['pui-card', 'poemui-miniprogram/card/card'],
  ['pui-icon', 'poemui-miniprogram/icon/icon'],
  ['component-page-section', '/components/component-page-section/component-page-section'],
  ['code-snippet', '/components/code-snippet/code-snippet']
].forEach(function (entry) {
  assert.strictEqual(codexJson.usingComponents[entry[0]], entry[1], 'Codex 页面必须组合 ' + entry[0]);
});
assert.ok(codexWxml.indexOf('title="Codex"') !== -1, 'Codex 页必须提供唯一 Navbar 标题');
assert.ok(codexWxml.indexOf('title="快速开始"') !== -1 && codexWxml.indexOf('title="让你的 AI 懂得用它"') !== -1, 'Codex 页必须分成快速开始和 AI Skill 两区');
assert.strictEqual((codexWxml.match(/<code-snippet/g) || []).length, 2, '快速开始必须提供安装和页面引用两个可复制代码区');
assert(codexWxml.includes('id="codex-install-snippet"'), '安装命令代码片段必须提供稳定运行态选择器');
assert(codexWxml.includes('id="codex-usage-snippet"'), '页面引用代码片段必须提供稳定运行态选择器');
assert.ok(codexWxml.indexOf('<pui-card') !== -1 && codexWxml.indexOf('<pui-icon name="codex"') !== -1 && codexWxml.indexOf('<text>SKILL</text>') !== -1, 'SKILL 留白区必须复用 PUI Card 与 Codex Icon');
assert.ok(codexWxml.indexOf('bind:change="onTabChange"') !== -1 && codexWxml.indexOf('value="{{activeTab}}"') !== -1, 'Codex 页面必须保留受控 PUI Tabbar 导航');
assert.ok(codexJs.indexOf("npm i poemui-miniprogram -S --production") !== -1, '快速开始必须使用 README 的真实安装命令');
assert.ok(codexJs.indexOf('"pui-button": "poemui-miniprogram/button/button"') !== -1, '快速开始必须提供真实按需引用路径');
assert.ok(codexWxss.indexOf('var(--pui-font-family-mono)') !== -1 && codexWxss.indexOf('#') === -1, 'Codex 页面必须只使用 PUI Token 并让 SKILL 使用共享等宽字体');

var capturedCodexPage;
var codexNavigationCalls = [];
var backgroundListener;
vm.runInNewContext(codexJs, {
  Page: function (definition) { capturedCodexPage = definition; },
  setTimeout: function () { return 1; },
  clearTimeout: function () {},
  wx: {
    getWindowInfo: function () { return { windowHeight: 844 }; },
    onWindowResize: function () {},
    offWindowResize: function () {}
  },
  require: function (request) {
    if (request === '../../common/utils/tabbar-navigation') {
      return {
        getItems: function () { return expectedItems; },
        navigateToTab: function (value, activeTab) {
          codexNavigationCalls.push({ value: value, activeTab: activeTab });
        }
      };
    }
    if (request === '../../common/utils/page-background-preference') {
      return {
        get: function () { return false; },
        restore: function () {},
        subscribe: function (listener) {
          backgroundListener = listener;
          return function () {};
        }
      };
    }
    throw new Error('unexpected Codex page require ' + request);
  }
}, { filename: 'miniprogram/pages/codex/index.js' });
capturedCodexPage.setData = function (patch) { Object.assign(this.data, patch); };
assert.strictEqual(capturedCodexPage.data.activeTab, 'codex', 'Codex 页活动目的地必须为 codex');
capturedCodexPage.onLoad();
backgroundListener(true);
assert.strictEqual(capturedCodexPage.data.backgroundGradientEnabled, true, 'Codex 页必须跟随共享页面渐变偏好');
capturedCodexPage.onTabChange({ detail: { value: 'home' } });
assert.deepStrictEqual(codexNavigationCalls, [{ value: 'home', activeTab: 'codex' }], 'Codex 页必须发起真实返回首页路由');

var snippetJson = JSON.parse(read('miniprogram/components/code-snippet/code-snippet.json'));
var snippetWxml = read('miniprogram/components/code-snippet/code-snippet.wxml');
var snippetWxss = read('miniprogram/components/code-snippet/code-snippet.wxss');
var snippetJs = read('miniprogram/components/code-snippet/code-snippet.js');
assert.strictEqual(snippetJson.usingComponents['pui-card'], 'poemui-miniprogram/card/card');
assert.strictEqual(snippetJson.usingComponents['pui-button'], 'poemui-miniprogram/button/button');
assert.strictEqual(snippetJson.usingComponents['pui-icon'], 'poemui-miniprogram/icon/icon');
assert.ok(snippetWxml.indexOf('<pui-card') !== -1 && snippetWxml.indexOf('<pui-button') !== -1 && snippetWxml.indexOf('<pui-icon') !== -1, '代码区必须组合 PUI Card、Button 与 Icon');
assert.ok(snippetWxml.indexOf('variant="text"') !== -1 && snippetWxml.indexOf('shape="circle"') !== -1 && snippetWxml.indexOf('icon-only') !== -1, '复制必须使用低存在感圆形 PUI IconButton');
assert.strictEqual((snippetWxml.match(/<scroll-view/g) || []).length, 1, '代码区只允许一个原生横向阅读 scroll-view');
assert.ok(snippetWxml.indexOf('<button') === -1, '代码区不得手写原生 Button');
assert.ok(snippetWxss.indexOf('var(--pui-font-family-mono)') !== -1 && snippetWxss.indexOf('#') === -1, '代码区必须使用 PUI 等宽字体与 Token');

var capturedSnippet;
var clipboardWrites = [];
vm.runInNewContext(snippetJs, {
  Component: function (definition) { capturedSnippet = definition; },
  setTimeout: function () { return 1; },
  clearTimeout: function () {},
  wx: {
    setClipboardData: function (options) {
      clipboardWrites.push(options.data);
      options.success();
    }
  }
}, { filename: 'miniprogram/components/code-snippet/code-snippet.js' });
var snippetRuntime = {
  data: Object.assign({}, capturedSnippet.data, { code: 'npm i poemui-miniprogram -S --production' }),
  setData: function (patch) { Object.assign(this.data, patch); },
  setCopyState: capturedSnippet.methods.setCopyState
};
capturedSnippet.methods.onCopy.call(snippetRuntime);
assert.deepStrictEqual(clipboardWrites, ['npm i poemui-miniprogram -S --production'], '复制按钮必须把当前可见代码真实写入微信剪贴板');
assert.strictEqual(snippetRuntime.data.copyIcon, 'check', '复制成功必须回写真实成功图标');
assert.strictEqual(snippetRuntime.data.copyStatus, '代码已复制', '复制成功必须提供 aria-live 状态');

console.log('miniprogram tabbar destination page contract tests passed');
