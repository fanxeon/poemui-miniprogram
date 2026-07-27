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
var announcements = require(path.join(ROOT, 'miniprogram/common/services/update-announcements'));

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
  ['pui-popup', 'poemui-miniprogram/popup/popup'],
  ['pui-tag', 'poemui-miniprogram/tag/tag'],
  ['pui-icon', 'poemui-miniprogram/icon/icon'],
  ['pui-top-loading', 'poemui-miniprogram/top-loading/top-loading'],
  ['pui-toast', 'poemui-miniprogram/toast/toast']
].forEach(function (entry) {
  assert.strictEqual(pageJson.usingComponents[entry[0]], entry[1], '我的页必须组合 ' + entry[0]);
});

assert.ok(pageWxml.indexOf('<pui-config-provider') !== -1 && pageWxml.indexOf('use-global-config') !== -1, '我的页必须继承全局外观');
assert.ok(pageWxml.indexOf('title="我的"') !== -1, '我的页必须提供唯一 Navbar 标题');
assert.strictEqual((pageWxml.match(/<pui-scroll-area/g) || []).length, 2, '我的页必须分别为页面正文和公告 Popup 提供一个场景内唯一 ScrollArea');
assert.ok(pageWxml.indexOf('id="me-nickname-input"') !== -1 && pageWxml.indexOf('bind:change="onNicknameChange"') !== -1 && pageWxml.indexOf('bind:enter="onSaveNickname"') !== -1, '昵称必须由真实 PUI Input 编辑和回写');
assert.ok(pageWxml.indexOf('suffix="slot"') !== -1 && pageWxml.indexOf('slot="suffix"') !== -1, '昵称保存必须进入 Input 公共 suffix 尾部操作 Slot');
assert.ok(pageWxml.indexOf('id="me-save-nickname"') !== -1 && pageWxml.indexOf('icon="check"') !== -1 && pageWxml.indexOf('icon-only') !== -1, '昵称保存必须使用单图标 PUI Button');
assert.ok(/<view class="me-profile">\s*<pui-avatar[\s\S]*?<view class="me-profile__editor">\s*<pui-input/.test(pageWxml), '资料版头必须把头像与唯一昵称编辑框合并为同一行');
assert.ok(pageWxml.indexOf('me-profile__summary') === -1 && pageWxml.indexOf('me-profile__identity') === -1 && pageWxml.indexOf('me-profile__nickname') === -1, '资料版头不得重复渲染不可编辑昵称摘要');
assert.ok(pageWxml.indexOf('PoemUI 用户') === -1, '资料版头不得再保留与昵称编辑无关的重复身份文案');
assert.ok(pageWxml.indexOf('id="me-profile-card"') !== -1 && pageWxml.indexOf('id="me-services"') !== -1, '资料卡和服务区必须提供稳定的几何验收锚点');
var nicknameSaveButton = pageWxml.match(/<pui-button[\s\S]*?id="me-save-nickname"[\s\S]*?\/>/);
assert.ok(nicknameSaveButton && nicknameSaveButton[0].indexOf('content=') === -1 && nicknameSaveButton[0].indexOf('block') === -1, '昵称保存不得保留 Input 下方的满宽文案按钮');
assert.ok(pageWxml.indexOf('OpenID') === -1 && pageWxml.indexOf('onCopyOpenId') === -1, '我的页必须彻底移除 OpenID 展示与复制入口');
['高级版商业授权', '我的订单', '更新公告', '用户私隐协议', '关于诗上'].forEach(function (label) {
  assert.ok(pageWxml.indexOf(label) !== -1, '我的页缺少服务 Cell：' + label);
});
assert.ok(pageWxml.indexOf('value="查阅详情"') !== -1 && pageWxml.indexOf('aria-label="查阅高级版商业授权详情"') !== -1, '授权入口必须使用查阅详情语义');
assert.ok(pageWxml.indexOf('购买高级版授权') === -1 && pageWxml.indexOf('value="尚未开放"') === -1, '授权 Cell 不得保留购买或尚未开放文案');
assert.ok(pageWxml.indexOf('id="me-update-announcement-cell"') !== -1 && pageWxml.indexOf('bind:click="onOpenAnnouncements"') !== -1, '更新公告 Cell 必须打开真实 Popup');
assert.ok(pageWxml.indexOf('id="me-update-announcement-popup"') !== -1 && pageWxml.indexOf('<pui-popup') !== -1, '更新公告必须使用 PUI Popup');
['show-header', 'show-footer', 'slot="content"', 'slot="footer"', 'content="知道了"', 'bind:visible-change="onAnnouncementPopupVisibleChange"'].forEach(function (fragment) {
  assert.ok(pageWxml.indexOf(fragment) !== -1, '更新公告 Popup 缺少结构：' + fragment);
});
assert.ok(pageWxml.indexOf('custom-style="{{announcementPopupStyle}}"') !== -1 && pageJs.indexOf("announcementPopupStyle: 'height:calc(100vh - ' + navbarHeight + 'px - 24rpx);'") !== -1, '长公告 Popup 必须用实测 Navbar 高度保留胶囊安全区并固定 Footer');
assert.ok(pageWxml.indexOf('content-scrollable="{{false}}"') !== -1, '公告 Popup 必须关闭自身 Content 滚动，避免与内部 ScrollArea 形成双滚动所有者');
assert.ok(pageWxml.indexOf('height="78vh"') !== -1 && pageWxml.indexOf('aria-label="PoemUI 更新公告内容"') !== -1, '公告内容必须使用 78vh 上限的 PUI ScrollArea');
assert.ok(pageWxml.indexOf('id="me-announcement-scroll-area"') !== -1 && pageWxml.indexOf('id="me-announcement-close"') !== -1, '公告滚动区与固定 Footer 操作必须有稳定运行态验收锚点');
assert.ok(pageWxml.indexOf('id="me-announcement-top-loading"') !== -1 && pageWxml.indexOf('state="{{announcementLoadingState}}"') !== -1, '公告云请求必须使用受控 PUI TopLoading');
assert.ok(/<pui-top-loading[\s\S]*?slot="surface-top"[\s\S]*?\/>/.test(pageWxml), '公告 TopLoading 必须通过 Popup surface-top Slot 贴住 Surface 顶边');
assert.ok(pageWxml.indexOf('<pui-loading') === -1 && pageWxml.indexOf('正在同步云端公告') === -1, '公告读取不得保留居中 Spinner 或重复加载文案');
assert.ok(pageWxml.indexOf('content-padding-bottom="0"') !== -1, '固定 Footer 已提供底部操作区时，公告 ScrollArea 不应再制造默认 10vh 空白');
assert.ok(pageWxml.indexOf('scroll-top="{{announcementScrollTop}}"') !== -1 && pageJs.indexOf('announcementScrollTop: 0') !== -1, '公告打开时必须保留可验证的顶部定位源');
assert.ok(pageWxml.indexOf('<pui-tag') !== -1 && pageWxml.indexOf('<pui-icon') !== -1, '公告必须使用 PUI Tag 突出组件名并使用 PUI Icon 展示组件图标');
assert.ok(pageWxml.indexOf('announcement.highlights') !== -1 && pageWxml.indexOf('{{highlight.component}}') !== -1, '公告必须按组件改动而非无层级字符串陈列');
assert.ok(pageWxml.indexOf('<pui-toast id="me-toast"') !== -1, '页面反馈必须复用 PUI Toast');
var contactButton = pageWxml.match(/<pui-button[\s\S]*?id="me-contact-service"[\s\S]*?\/>/);
assert.ok(contactButton && contactButton[0].indexOf('open-type="contact"') !== -1, '联系客服必须使用 PUI Button 的微信 contact 能力');
['slot="left"', 'variant="text"', 'surface="transparent"', 'size="small"', 'shape="circle"', 'icon="comment"', 'icon-only', 'aria-label="联系 PoemUI 客服"'].forEach(function (fragment) {
  assert.ok(contactButton[0].indexOf(fragment) !== -1, '联系客服圆形图标按钮缺少：' + fragment);
});
assert.ok(contactButton[0].indexOf('content=') === -1 && contactButton[0].indexOf('block') === -1, '低强调客服入口不得恢复满宽文案按钮');
var navbarBlock = pageWxml.slice(pageWxml.indexOf('<pui-navbar'), pageWxml.indexOf('</pui-navbar>') + '</pui-navbar>'.length);
assert.ok(navbarBlock.indexOf('id="me-contact-service"') !== -1, '客服 Button 必须投影到 Navbar 左 Slot，不能留在正文或另建浮动入口');
assert.strictEqual((pageWxml.match(/id="me-contact-service"/g) || []).length, 1, '客服入口在页面中必须唯一');
assert.ok(pageWxml.indexOf('bind:error="onContactError"') !== -1 && pageJs.indexOf('onContactError') !== -1, '客服平台失败必须由页面真实反馈');
assert.ok(pageWxml.indexOf('<input') === -1 && pageWxml.indexOf('<button') === -1, '我的页不得手写原生 Input 或 Button');
assert.ok(pageWxml.indexOf('tabbar-placeholder') === -1, '我的页不得继续使用空白占位壳');
assert.ok(!fs.existsSync(path.join(ROOT, 'miniprogram/components/tabbar-placeholder')), '失去消费者的 Tabbar 占位组件必须移除');
assert.ok(pageWxss.indexOf('var(--pui-') !== -1 && !/#[0-9a-f]{3,8}/i.test(pageWxss), '页面布局必须只消费 PUI Token');
assert.ok(/\.me-profile\s*\{[\s\S]*align-items:\s*center[\s\S]*gap:\s*var\(--pui-content-gap\)/.test(pageWxss), '资料版头必须以标准 Token 将头像与编辑区置于同一行');
assert.ok(/\.me-profile__editor\s*\{[\s\S]*flex:\s*1 1 0/.test(pageWxss), '昵称编辑区必须消费头像以外的剩余宽度，避免 390px 挤压');
assert.ok(/\.me-page__services\s*\{[\s\S]*margin-top:\s*var\(--pui-section-gap\)/.test(pageWxss), '服务 CellGroup 必须使用标准分区间距为资料 Input 的投影保留安全空间');
assert.ok(pageWxss.indexOf('.me-page__contact') === -1, '客服移入 Navbar Slot 后必须删除正文定位样式');
assert.ok(!/\.me-announcement-popup__content\s*\{[^}]*position:\s*relative/.test(pageWxss), '公告 Content 不得再承担 Surface 顶部加载的定位');
assert.ok(pageJs.indexOf("wx.openPrivacyContract") !== -1, '隐私协议必须调用微信真实能力');
assert.ok(pageJs.indexOf("wx.navigateToMiniProgram") !== -1 && pageJs.indexOf("wxa1b9a4d6549c6cd1") !== -1 && pageJs.indexOf("envVersion: 'release'") !== -1, '关于诗上必须跳转指定正式版小程序');
assert.ok(!/openid|openId|OpenID|setClipboardData/.test(pageJs), '我的页 JS 不得继续读取、展示或复制 OpenID');
assert.ok(!/openid|openId|OpenID|setOpenId|getApp/.test(profileJs), '资料 Store 必须只持久化昵称，不得保留 OpenID 获取或兼容读取');
assert.ok(pageJs.indexOf('wx.requestPayment') === -1, '尚未交付的授权入口不得伪造支付');

var localAnnouncements = announcements.list();
assert.ok(localAnnouncements.length > 0, '本地公告数据源必须至少提供一条可见公告');
assert.strictEqual(announcements.latest().id, localAnnouncements[0].id, 'latest 必须返回列表首条公告');
assert.ok(/^v\d+\.\d+\.\d+$/.test(localAnnouncements[0].version), '公告版本必须使用可识别的语义版本');
assert.ok(localAnnouncements[0].highlights.length >= 3, '公告必须陈列实际组件改动');
localAnnouncements[0].highlights[0].component = '测试污染';
assert.notStrictEqual(announcements.list()[0].highlights[0].component, '测试污染', '公告读取必须返回深副本，页面不能污染真相源');
assert.strictEqual(announcements.RESOURCE_APP_ID, 'wxa1b9a4d6549c6cd1', '公告必须连接诗上资源小程序');
assert.strictEqual(announcements.RESOURCE_ENV, 'poemcoder-1gkbkid139b08f45', '公告必须连接已授权的生产共享环境');
assert.strictEqual(announcements.COLLECTION_NAME, 'pui_updatelog', 'PUI 云集合必须遵守 pui_ 前缀');
assert.ok(pageJs.indexOf('loadAnnouncements') !== -1, '页面加载与打开 Popup 时必须刷新云端公告');

var storageState = {
  'poemui-user-profile': { nickname: '已保存昵称', openid: '旧数据不再读取' },
  openid: '旧兼容键不再读取'
};
var storageReads = [];
var storageWrites = [];
var profileModule = { exports: {} };
vm.runInNewContext(profileJs, {
  module: profileModule,
  exports: profileModule.exports,
  Error: Error,
  wx: {
    getStorageSync: function (key) {
      storageReads.push(key);
      return storageState[key];
    },
    setStorageSync: function (key, value) {
      storageState[key] = value;
      storageWrites.push({ key: key, value: value });
    }
  }
}, { filename: 'miniprogram/common/utils/user-profile.js' });
var profileStore = profileModule.exports;
assert.deepStrictEqual(JSON.parse(JSON.stringify(profileStore.restore())), {
  nickname: '已保存昵称',
  error: null
}, '资料恢复必须只返回昵称');
assert.deepStrictEqual(storageReads, ['poemui-user-profile'], '资料 Store 不得读取旧 OpenID 存储键');
assert.strictEqual(profileStore.setNickname('  新昵称  ').saved, true, '合法昵称必须真实持久化');
assert.deepStrictEqual(JSON.parse(JSON.stringify(storageWrites[0])), {
  key: 'poemui-user-profile',
  value: { nickname: '新昵称' }
}, '保存昵称必须覆盖为仅含昵称的资料结构');
assert.strictEqual(profileStore.setNickname('   ').saved, false, '空昵称不得覆盖已保存资料');
assert.strictEqual(profileStore.setOpenId, undefined, '资料 Store 不再公开 OpenID 写入桥接');

var capturedPage;
var navigationCalls = [];
var privacyCalls = [];
var miniProgramCalls = [];
var toastCalls = [];
var backgroundListener;
var savedNicknames = [];
var profileFixture = { nickname: '诗上用户' };
vm.runInNewContext(pageJs, {
  Page: function (definition) { capturedPage = definition; },
  setTimeout: function () { return 1; },
  clearTimeout: function () {},
  wx: {
    getWindowInfo: function () { return { windowHeight: 844 }; },
    onWindowResize: function () {},
    offWindowResize: function () {},
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
    if (request === '../../common/services/update-announcements') {
      return {
        initial: function () { return announcements.list(); },
        list: function () { return announcements.list(); },
        latest: function (list) { return announcements.latest(list); },
        load: function () {
          return Promise.resolve({
            announcements: announcements.list(),
            source: 'cloud',
            error: null
          });
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
assert.strictEqual(runtime.data.announcementLoadingState, 'loading', '公告请求开始必须立即驱动 TopLoading loading');
assert.strictEqual(runtime.data.openid, undefined, '页面状态不得保留 OpenID');
assert.strictEqual(runtime.data.openIdDisplay, undefined, '页面状态不得保留 OpenID 展示值');
assert.strictEqual(runtime.data.hasOpenId, undefined, '页面状态不得保留 OpenID 门禁');
backgroundListener(true);
assert.strictEqual(runtime.data.backgroundGradientEnabled, true, '我的页必须跟随共享背景偏好');

runtime.onNicknameChange({ detail: { value: '新页面昵称' } });
assert.strictEqual(runtime.onSaveNickname(), true, '保存按钮必须提交当前草稿');
assert.deepStrictEqual(savedNicknames, ['新页面昵称'], '页面必须调用唯一资料 Store');
assert.strictEqual(runtime.data.nickname, '新页面昵称', '保存成功必须回写可见昵称');
runtime.onNicknameChange({ detail: { value: '   ' } });
assert.strictEqual(runtime.onSaveNickname(), false, '空昵称必须在页面被阻止');
assert.strictEqual(runtime.data.nicknameError, '昵称不能为空', '空昵称必须提供真实错误状态');

assert.strictEqual(runtime.onOpenPrivacy(), true, '支持能力时必须打开微信隐私合同');
assert.strictEqual(privacyCalls.length, 1, '隐私合同只能调用一次');
assert.strictEqual(runtime.onOpenShishang(), true, '支持能力时必须发起小程序跳转');
assert.strictEqual(miniProgramCalls[0].appId, 'wxa1b9a4d6549c6cd1', '诗上科技 AppID 不得漂移');
assert.strictEqual(miniProgramCalls[0].envVersion, 'release', '关于诗上必须进入正式版');
runtime.onPurchaseLicense();
runtime.onOpenOrders();
runtime.onContactError();
assert.ok(toastCalls.some(function (entry) { return entry.message === '授权详情正在准备中'; }), '尚未接入的授权详情必须明确反馈');
assert.ok(toastCalls.some(function (entry) { return entry.message === '订单服务尚未开放'; }), '未开放订单必须明确反馈');
assert.ok(toastCalls.some(function (entry) { return entry.message === '暂时无法打开客服会话'; }), '客服平台失败必须明确反馈');
runtime.onOpenAnnouncements();
assert.strictEqual(runtime.data.announcementPopupVisible, true, '点击更新公告必须打开受控 Popup');
runtime.onAnnouncementPopupVisibleChange({ detail: { visible: false, trigger: 'overlay' } });
assert.strictEqual(runtime.data.announcementPopupVisible, false, 'Popup 遮罩关闭请求必须由页面回写');
runtime.onOpenAnnouncements();
runtime.onCloseAnnouncements();
assert.strictEqual(runtime.data.announcementPopupVisible, false, 'Footer 按钮必须真实关闭公告');
runtime.onTabChange({ detail: { value: 'home' } });
assert.deepStrictEqual(navigationCalls, [{ value: 'home', activeTab: 'me' }], '我的页必须保留真实 Tabbar 导航');

var serviceSource = read('miniprogram/common/services/update-announcements.js');
var serviceModule = { exports: {} };
var sharedCloudConfig;
var queriedCollection = '';
var cachedAnnouncements;
var cloudAnnouncement = {
  _id: 'pui-cloud-contract',
  product: 'poemui',
  version: 'v9.9.9',
  date: '2026-07-27',
  title: '云端契约公告',
  summary: '验证共享云读取。',
  highlights: [
    {
      component: 'Popup',
      icon: 'popup',
      title: '组件改动',
      description: '公告必须从共享集合读取。'
    }
  ],
  status: 'published',
  schemaVersion: 1
};
vm.runInNewContext(serviceSource, {
  module: serviceModule,
  exports: serviceModule.exports,
  Error: Error,
  Promise: Promise,
  Array: Array,
  Number: Number,
  String: String,
  Object: Object,
  wx: {
    getStorageSync: function () { return null; },
    setStorageSync: function (key, value) {
      assert.strictEqual(key, 'poemui-update-announcements');
      cachedAnnouncements = value;
    },
    cloud: {
      Cloud: function Cloud(config) {
        sharedCloudConfig = config;
        return {
          init: function () { return Promise.resolve(); },
          database: function () {
            return {
              collection: function (name) {
                queriedCollection = name;
                return {
                  where: function (query) {
                    assert.deepStrictEqual(JSON.parse(JSON.stringify(query)), {
                      status: 'published'
                    });
                    return this;
                  },
                  limit: function (limit) {
                    assert.strictEqual(limit, 20);
                    return this;
                  },
                  get: function () {
                    return Promise.resolve({ data: [cloudAnnouncement] });
                  }
                };
              }
            };
          }
        };
      }
    }
  }
}, { filename: 'miniprogram/common/services/update-announcements.js' });

runtime.loadAnnouncements().then(function (pageResult) {
  assert.strictEqual(pageResult.source, 'cloud', '页面公告加载测试必须使用真实云端语义');
  assert.strictEqual(runtime.data.announcementLoadingState, 'success', '真实云端公告成功必须显式驱动 TopLoading success');
  return serviceModule.exports.load();
}).then(function (result) {
  assert.deepStrictEqual(JSON.parse(JSON.stringify(sharedCloudConfig)), {
    resourceAppid: 'wxa1b9a4d6549c6cd1',
    resourceEnv: 'poemcoder-1gkbkid139b08f45'
  }, '共享云实例必须同时指定资源 AppID 与环境 ID');
  assert.strictEqual(queriedCollection, 'pui_updatelog', '共享云只能读取 PUI 命名空间集合');
  assert.strictEqual(result.source, 'cloud', '成功读取后必须标记真实云端来源');
  assert.strictEqual(result.announcements[0].id, 'pui-cloud-contract', '云文档 _id 必须归一化为页面 id');
  assert.strictEqual(cachedAnnouncements[0].version, 'v9.9.9', '云端成功结果必须写入离线缓存');
  console.log('miniprogram me page contract tests passed');
}).catch(function (error) {
  console.error(error);
  process.exitCode = 1;
});
