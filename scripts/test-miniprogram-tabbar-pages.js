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
  { label: '', value: 'codex', icon: 'code', ariaLabel: '安装' },
  { label: '', value: 'me', icon: 'user', ariaLabel: '我的' }
];

assert.deepStrictEqual(navigation.getItems(), expectedItems, 'Tabbar 目的地必须是首页、快速样式、安装和我的');
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
assert.strictEqual(navigation.navigateToTab('codex', 'styles'), true, '安装页面必须是真实目标');
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
  ['pui-tag', 'poemui-miniprogram/tag/tag'],
  ['pui-empty', 'poemui-miniprogram/empty/empty'],
  ['pui-loading', 'poemui-miniprogram/loading/loading'],
  ['pui-top-loading', 'poemui-miniprogram/top-loading/top-loading'],
  ['pui-button', 'poemui-miniprogram/button/button'],
  ['pui-popup', 'poemui-miniprogram/popup/popup'],
  ['pui-dialog', 'poemui-miniprogram/dialog/dialog'],
  ['appearance-settings', '/components/appearance-settings/appearance-settings'],
  ['component-page-section', '/components/component-page-section/component-page-section'],
  ['code-snippet', '/components/code-snippet/code-snippet']
].forEach(function (entry) {
  assert.strictEqual(codexJson.usingComponents[entry[0]], entry[1], '安装页面必须组合 ' + entry[0]);
});
assert.ok(codexWxml.indexOf('title="安装"') !== -1, '安装页必须提供唯一 Navbar 标题');
var codexNavbarBlock = codexWxml.slice(codexWxml.indexOf('<pui-navbar'), codexWxml.indexOf('</pui-navbar>') + '</pui-navbar>'.length);
assert.ok(codexNavbarBlock.indexOf('slot="left"') !== -1 && codexNavbarBlock.indexOf('pui-gap-xxs') !== -1, '安装页 Navbar 必须使用共享间距类承载左侧双 Slot 操作');
[
  'id="codex-info"',
  'icon="info-circle"',
  'bind:click="onOpenInfo"',
  'id="codex-appearance-menu"',
  'icon="menu"',
  'bind:click="onOpenAppearance"'
].forEach(function (fragment) {
  assert.ok(codexNavbarBlock.indexOf(fragment) !== -1, '安装页 Navbar 双操作缺少：' + fragment);
});
assert.strictEqual((codexNavbarBlock.match(/<pui-button/g) || []).length, 2, '安装页 Navbar 左 Slot 必须只包含 Info 与菜单');
assert.ok(codexWxml.indexOf('id="codex-info-dialog"') !== -1 && codexWxml.indexOf('visible="{{infoDialogVisible}}"') !== -1 && codexWxml.indexOf('confirm-btn="{{infoDialogConfirmBtn}}"') !== -1, 'Info 操作必须打开受控 PUI Dialog');
var codexAppearancePopup = codexWxml.slice(codexWxml.indexOf('id="codex-appearance-popup"'), codexWxml.indexOf('id="codex-tabbar"'));
['visible="{{appearancePopupVisible}}"', 'title="外观"', 'blur-overlay', 'slot="header-left"', 'icon="refresh"', '<appearance-settings />', 'bind:visible-change="onAppearancePopupVisibleChange"'].forEach(function (fragment) {
  assert.ok(codexAppearancePopup.indexOf(fragment) !== -1, '安装页外观 Popup 缺少首页同源结构：' + fragment);
});
assert.ok(codexWxml.indexOf('title="{{codePage.quickStart.title}}"') !== -1 && codexWxml.indexOf('title="{{codePage.skillSection.title}}"') !== -1, 'Codex 页必须从云端 page 文档读取快速开始和 AI Skill 分区');
assert.ok(codexWxml.indexOf('wx:for="{{codePage.quickStart.snippets}}"') !== -1 && codexWxml.indexOf('id="codex-snippet-{{item.id}}"') !== -1, '快速开始必须从云端 snippets 渲染稳定可复制代码区');
assert.ok(codexWxml.indexOf('wx:for="{{skills}}"') !== -1 && codexWxml.indexOf('<pui-icon name="{{item.icon}}"') !== -1, '已发布 Skill 必须从云端数据渲染 PUI Card 与 PUI Icon');
assert.ok(codexWxml.indexOf('codePageLoadState === \'loading\'') !== -1 && codexWxml.indexOf('codePageLoadState === \'error\'') !== -1 && codexWxml.indexOf('codePageLoadState === \'empty\'') !== -1, 'Codex 页必须完整区分云端 loading、error、empty 状态');
assert.ok(codexWxml.indexOf('bind:click="onRetryCodePage"') !== -1 && codexWxml.indexOf('<pui-button slot="action"') !== -1, '云端失败和空状态必须由 PUI Button 发起真实重试');
assert.ok(codexWxml.indexOf('state="{{codePageLoadingState}}"') !== -1, '云端读取必须用 PUI TopLoading 表达请求状态');
assert.ok(codexWxml.indexOf('bind:change="onTabChange"') !== -1 && codexWxml.indexOf('value="{{activeTab}}"') !== -1, 'Codex 页面必须保留受控 PUI Tabbar 导航');
assert.ok(codexJs.indexOf("require('../../common/services/codex-page')") !== -1 && codexJs.indexOf('codexPage.load()') !== -1, 'Codex 页面必须通过独立云服务读取内容');
assert.strictEqual(codexJs.indexOf('npm i poemui-miniprogram -S --production'), -1, 'Codex 页面不得保留包内安装代码回退');
assert.ok(codexJs.indexOf("codePageError: '暂时无法读取云端 Code 内容，请稍后重试。'") !== -1, '云端失败必须向用户展示可理解的恢复提示，而不是原始平台错误');
assert.ok(codexWxss.indexOf('var(--pui-') !== -1 && codexWxss.indexOf('#') === -1, 'Codex 页面必须只使用 PUI Token');

var capturedCodexPage;
var codexNavigationCalls = [];
var backgroundListener;
var codePageLoadCalls = 0;
var codexBackgroundSetCalls = [];
var codexVisualConfigResetCalls = [];
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
        set: function (value, options) {
          codexBackgroundSetCalls.push({ value: value, options: options });
        },
        subscribe: function (listener) {
          backgroundListener = listener;
          return function () {};
        }
      };
    }
    if (request === '../../common/services/codex-page') {
      return {
        load: function () {
          codePageLoadCalls += 1;
          return Promise.resolve({ page: null, skills: [], source: 'cloud' });
        }
      };
    }
    if (request === 'poemui-miniprogram/common/utils/visual-config') {
      return {
        reset: function (options) {
          codexVisualConfigResetCalls.push(options);
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
assert.strictEqual(codePageLoadCalls, 1, 'Codex 页面首次载入必须真实请求云端内容');
capturedCodexPage.onRetryCodePage();
assert.strictEqual(codePageLoadCalls, 2, 'Codex 页面重试必须再次真实请求云端内容');
capturedCodexPage.onOpenInfo();
assert.strictEqual(capturedCodexPage.data.infoDialogVisible, true, 'Info 操作必须打开受控说明 Dialog');
assert.strictEqual(capturedCodexPage.data.appearancePopupVisible, false, '打开 Info 时不得叠加外观 Popup');
capturedCodexPage.onOpenAppearance();
assert.strictEqual(capturedCodexPage.data.infoDialogVisible, false, '打开外观设置时必须关闭 Info Dialog');
assert.strictEqual(capturedCodexPage.data.appearancePopupVisible, true, '菜单操作必须打开受控外观 Popup');
capturedCodexPage.onAppearancePopupVisibleChange({ detail: { visible: false, trigger: 'overlay' } });
assert.strictEqual(capturedCodexPage.data.appearancePopupVisible, false, '外观 Popup 关闭请求必须由页面回写');
capturedCodexPage.onResetAppearance();
assert.strictEqual(codexBackgroundSetCalls[0].value, false, '安装页恢复默认必须同步关闭页面渐变');
assert.strictEqual(codexBackgroundSetCalls[0].options.source, 'miniprogram-codepage:appearance-reset', '安装页渐变重置必须记录调用来源');
assert.strictEqual(codexVisualConfigResetCalls[0].source, 'miniprogram-codepage:appearance-reset', '安装页恢复默认必须调用共享 visualConfig');
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
assert.ok(snippetWxss.indexOf('background: var(--pui-bg-muted)') !== -1, '代码正文必须使用 PUI muted Token 形成浅色阅读底');
assert.ok(snippetWxss.indexOf('border-radius: var(--pui-radius-small)') !== -1 && snippetWxss.indexOf('padding: var(--pui-content-gap)') !== -1, '代码阅读底必须使用语义圆角与标准内容内距');

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
