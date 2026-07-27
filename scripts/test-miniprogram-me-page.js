'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

var pageJson = JSON.parse(read('miniprogram/pages/me/index.json'));
var pageWxml = read('miniprogram/pages/me/index.wxml');
var pageWxss = read('miniprogram/pages/me/index.wxss');
var pageJs = read('miniprogram/pages/me/index.js');
var profileJs = read('miniprogram/common/utils/user-profile.js');

[
  ['pui-config-provider', 'poemui-miniprogram/config-provider/config-provider'],
  ['pui-navbar', 'poemui-miniprogram/navbar/navbar'],
  ['pui-scroll-area', 'poemui-miniprogram/scroll-area/scroll-area'],
  ['pui-tabbar', 'poemui-miniprogram/tabbar/tabbar'],
  ['pui-card', 'poemui-miniprogram/card/card'],
  ['pui-avatar', 'poemui-miniprogram/avatar/avatar'],
  ['pui-input', 'poemui-miniprogram/input/input'],
  ['pui-button', 'poemui-miniprogram/button/button'],
  ['pui-cell', 'poemui-miniprogram/cell/cell'],
  ['pui-cell-group', 'poemui-miniprogram/cell/cell-group'],
  ['pui-toast', 'poemui-miniprogram/toast/toast']
].forEach(function (entry) {
  assert.strictEqual(pageJson.usingComponents[entry[0]], entry[1], '我的页必须组合 ' + entry[0]);
});

assert.ok(pageWxml.indexOf('<pui-config-provider') !== -1 && pageWxml.indexOf('use-global-config') !== -1, '我的页必须继承全局外观');
assert.ok(pageWxml.indexOf('title="我的"') !== -1, '我的页必须提供唯一 Navbar 标题');
assert.strictEqual((pageWxml.match(/<pui-scroll-area/g) || []).length, 1, '我的页只能有一个滚动所有者');
assert.ok(pageWxml.indexOf('id="me-nickname-input"') !== -1 && pageWxml.indexOf('bind:change="onNicknameChange"') !== -1 && pageWxml.indexOf('bind:enter="onSaveNickname"') !== -1, '昵称必须由真实 PUI Input 编辑和回写');
assert.ok(pageWxml.indexOf('id="me-save-nickname"') !== -1 && pageWxml.indexOf('content="保存昵称"') !== -1, '昵称保存必须使用真实 PUI Button');
assert.ok(pageWxml.indexOf('id="me-openid-cell"') !== -1 && pageWxml.indexOf('bind:click="onCopyOpenId"') !== -1, 'OpenID Cell 必须绑定真实复制动作');
['购买高级版授权', '我的订单', '用户私隐协议', '关于诗上'].forEach(function (label) {
  assert.ok(pageWxml.indexOf(label) !== -1, '我的页缺少服务 Cell：' + label);
});
assert.ok(pageWxml.indexOf('<pui-toast id="me-toast"') !== -1, '页面反馈必须复用 PUI Toast');
assert.ok(pageWxml.indexOf('<input') === -1 && pageWxml.indexOf('<button') === -1, '我的页不得手写原生 Input 或 Button');
assert.ok(pageWxml.indexOf('tabbar-placeholder') === -1, '我的页不得继续使用空白占位壳');
assert.ok(!fs.existsSync(path.join(ROOT, 'miniprogram/components/tabbar-placeholder')), '失去消费者的 Tabbar 占位组件必须移除');
assert.ok(pageWxss.indexOf('var(--pui-') !== -1 && !/#[0-9a-f]{3,8}/i.test(pageWxss), '页面布局必须只消费 PUI Token');
assert.ok(pageJs.indexOf("wx.openPrivacyContract") !== -1, '隐私协议必须调用微信真实能力');
assert.ok(pageJs.indexOf("wx.navigateToMiniProgram") !== -1 && pageJs.indexOf("wxa1b9a4d6549c6cd1") !== -1 && pageJs.indexOf("envVersion: 'release'") !== -1, '关于诗上必须跳转指定正式版小程序');
assert.ok(pageJs.indexOf('wx.setClipboardData') !== -1, 'OpenID 必须通过真实剪贴板 API 复制');
assert.ok(pageJs.indexOf('wx.requestPayment') === -1, '尚未交付的授权入口不得伪造支付');

var storageState = {
  'poemui-user-profile': { nickname: '已保存昵称', openid: 'stored-openid' },
  openid: 'legacy-openid'
};
var storageWrites = [];
var profileModule = { exports: {} };
vm.runInNewContext(profileJs, {
  module: profileModule,
  exports: profileModule.exports,
  Error: Error,
  getApp: function () {
    return { globalData: { openid: 'global-real-openid' } };
  },
  wx: {
    getStorageSync: function (key) { return storageState[key]; },
    setStorageSync: function (key, value) {
      storageState[key] = value;
      storageWrites.push({ key: key, value: value });
    }
  }
}, { filename: 'miniprogram/common/utils/user-profile.js' });
var profileStore = profileModule.exports;
assert.deepStrictEqual(JSON.parse(JSON.stringify(profileStore.restore())), {
  nickname: '已保存昵称',
  openid: 'global-real-openid',
  error: null
}, '恢复时 App 登录态 OpenID 必须优先于旧存储');
assert.strictEqual(profileStore.setNickname('  新昵称  ').saved, true, '合法昵称必须真实持久化');
assert.deepStrictEqual(JSON.parse(JSON.stringify(storageWrites[0])), {
  key: 'poemui-user-profile',
  value: { nickname: '新昵称', openid: 'global-real-openid' }
}, '保存昵称不得丢失真实 OpenID');
assert.strictEqual(profileStore.setNickname('   ').saved, false, '空昵称不得覆盖已保存资料');
assert.strictEqual(profileStore.setOpenId('future-login-openid').saved, true, '登录桥接必须能够持久化真实 OpenID');
assert.strictEqual(storageState['poemui-user-profile'].nickname, '新昵称', '登录桥接不得覆盖昵称');

var capturedPage;
var navigationCalls = [];
var clipboardCalls = [];
var privacyCalls = [];
var miniProgramCalls = [];
var toastCalls = [];
var backgroundListener;
var savedNicknames = [];
var profileFixture = { nickname: '诗上用户', openid: 'o1234567890abcdef' };
vm.runInNewContext(pageJs, {
  Page: function (definition) { capturedPage = definition; },
  setTimeout: function () { return 1; },
  clearTimeout: function () {},
  wx: {
    getWindowInfo: function () { return { windowHeight: 844 }; },
    onWindowResize: function () {},
    offWindowResize: function () {},
    setClipboardData: function (options) {
      clipboardCalls.push(options.data);
      options.success();
    },
    openPrivacyContract: function (options) {
      privacyCalls.push(options || {});
    },
    navigateToMiniProgram: function (options) {
      miniProgramCalls.push(options);
    }
  },
  require: function (request) {
    if (request === '../../common/utils/tabbar-navigation') {
      return {
        getItems: function () { return [{ value: 'me' }]; },
        navigateToTab: function (value, activeTab) {
          navigationCalls.push({ value: value, activeTab: activeTab });
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
    if (request === '../../common/utils/user-profile') {
      return {
        DEFAULT_NICKNAME: 'PoemUI 用户',
        restore: function () { return Object.assign({}, profileFixture); },
        setNickname: function (nickname) {
          savedNicknames.push(nickname);
          profileFixture.nickname = nickname;
          return { saved: true, profile: Object.assign({}, profileFixture), error: null };
        }
      };
    }
    throw new Error('unexpected require ' + request);
  }
}, { filename: 'miniprogram/pages/me/index.js' });

var runtime = {
  data: JSON.parse(JSON.stringify(capturedPage.data)),
  setData: function (patch) { Object.assign(this.data, patch); },
  selectComponent: function (selector) {
    assert.strictEqual(selector, '#me-toast');
    return {
      show: function (options) { toastCalls.push(options); }
    };
  }
};
Object.keys(capturedPage).forEach(function (key) {
  if (typeof capturedPage[key] === 'function') runtime[key] = capturedPage[key];
});

runtime.onLoad();
assert.strictEqual(runtime.data.nickname, '诗上用户', '页面加载必须恢复昵称');
assert.strictEqual(runtime.data.openid, 'o1234567890abcdef', '页面加载必须恢复真实 OpenID');
assert.strictEqual(runtime.data.openIdDisplay, 'o123456…bcdef', '页面只展示脱敏 OpenID');
assert.strictEqual(runtime.data.hasOpenId, true, '存在 OpenID 时复制 Cell 必须启用');
backgroundListener(true);
assert.strictEqual(runtime.data.backgroundGradientEnabled, true, '我的页必须跟随共享背景偏好');

runtime.onNicknameChange({ detail: { value: '新页面昵称' } });
assert.strictEqual(runtime.onSaveNickname(), true, '保存按钮必须提交当前草稿');
assert.deepStrictEqual(savedNicknames, ['新页面昵称'], '页面必须调用唯一资料 Store');
assert.strictEqual(runtime.data.nickname, '新页面昵称', '保存成功必须回写可见昵称');
runtime.onNicknameChange({ detail: { value: '   ' } });
assert.strictEqual(runtime.onSaveNickname(), false, '空昵称必须在页面被阻止');
assert.strictEqual(runtime.data.nicknameError, '昵称不能为空', '空昵称必须提供真实错误状态');

assert.strictEqual(runtime.onCopyOpenId(), true, '存在 OpenID 时复制动作必须启动');
assert.deepStrictEqual(clipboardCalls, ['o1234567890abcdef'], '剪贴板必须写入完整 OpenID 而非脱敏值');
assert.strictEqual(runtime.onOpenPrivacy(), true, '支持能力时必须打开微信隐私合同');
assert.strictEqual(privacyCalls.length, 1, '隐私合同只能调用一次');
assert.strictEqual(runtime.onOpenShishang(), true, '支持能力时必须发起小程序跳转');
assert.strictEqual(miniProgramCalls[0].appId, 'wxa1b9a4d6549c6cd1', '诗上科技 AppID 不得漂移');
assert.strictEqual(miniProgramCalls[0].envVersion, 'release', '关于诗上必须进入正式版');
runtime.onPurchaseLicense();
runtime.onOpenOrders();
assert.ok(toastCalls.some(function (entry) { return entry.message === '高级版授权尚未开放'; }), '未开放授权必须明确反馈');
assert.ok(toastCalls.some(function (entry) { return entry.message === '订单服务尚未开放'; }), '未开放订单必须明确反馈');
runtime.onTabChange({ detail: { value: 'home' } });
assert.deepStrictEqual(navigationCalls, [{ value: 'home', activeTab: 'me' }], '我的页必须保留真实 Tabbar 导航');

runtime.data.openid = '';
assert.strictEqual(runtime.onCopyOpenId(), false, '无真实 OpenID 时不得写入剪贴板');
assert.strictEqual(clipboardCalls.length, 1, '无真实 OpenID 时不得制造第二次复制');

console.log('miniprogram me page contract tests passed');
