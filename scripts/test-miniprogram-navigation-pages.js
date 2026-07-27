'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');
var ids = ['navbar', 'navigation-menu', 'tabs', 'breadcrumb', 'tabbar', 'steps', 'back-top', 'indexes', 'sidebar'];

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

var app = JSON.parse(read('miniprogram/app.json'));
var homeJs = read('miniprogram/pages/index/index.js');
var sharedStyle = read('miniprogram/styles/navigation-pages.wxss');

assert.ok(sharedStyle.indexOf('var(--pui-') !== -1, '导航页必须使用共享 PUI Token 样式');
assert.ok(sharedStyle.indexOf('#') === -1, '导航页共享样式不得写入私有颜色');
assert.ok(sharedStyle.indexOf('.navigation-page__controls {') !== -1 && sharedStyle.indexOf('grid-template-columns: repeat(2, minmax(0, 1fr));') !== -1, 'Navigation 双操作区必须使用两列等分 Grid');
assert.ok(sharedStyle.indexOf('gap: var(--pui-content-gap);') !== -1, 'Navigation 双操作区必须保留标准内容间距');
assert.ok(homeJs.indexOf("key: 'navigation'") !== -1 && homeJs.indexOf('NAVIGATION_COMPONENTS') !== -1, '首页必须有导航分区源');

ids.forEach(function (id) {
  var base = 'miniprogram/pages/components/' + id + '/index';
  var js = read(base + '.js');
  var wxml = read(base + '.wxml');
  var json = JSON.parse(read(base + '.json'));
  assert.ok(js.indexOf('createComponentPage(') !== -1, id + ' 必须复用共享详情页工厂');
  assert.ok(wxml.indexOf('<pui-config-provider') !== -1, id + ' 缺少 ConfigProvider');
  assert.ok(wxml.indexOf('<component-page-navbar') !== -1, id + ' 缺少共享详情页 Navbar');
  assert.ok(wxml.indexOf('<pui-scroll-area') !== -1, id + ' 缺少唯一页面 ScrollArea');
  assert.ok(wxml.indexOf('height="{{scrollAreaHeight}}"') !== -1, id + ' ScrollArea 必须消费动态高度');
  assert.ok(wxml.indexOf('<component-page-section') !== -1, id + ' 缺少共享内容分区');
  assert.ok(wxml.indexOf('<scroll-view') === -1, id + ' 页面不得增加第二个页面级滚动容器');
  assert.ok(wxml.indexOf('<button') === -1, id + ' 页面不得手写原生 button');
  assert.ok(json.usingComponents['component-page-navbar'], id + ' 缺少共享 Navbar 依赖');
  assert.ok(json.usingComponents['component-page-section'], id + ' 缺少共享 Section 依赖');
  assert.ok(json.usingComponents['pui-scroll-area'], id + ' 缺少 PUI ScrollArea 依赖');
  assert.ok(app.pages.indexOf('pages/components/' + id + '/index') !== -1, 'app.json 缺少 ' + id + ' 路由');
  assert.ok(homeJs.indexOf("url: '/pages/components/" + id + "/index'") !== -1, '首页缺少 ' + id + ' 入口 URL');
});

var navbarWxml = read('miniprogram/pages/components/navbar/index.wxml');
var navbarJs = read('miniprogram/pages/components/navbar/index.js');
var navbarJson = JSON.parse(read('miniprogram/pages/components/navbar/index.json'));
var navbarStyle = read('miniprogram/pages/components/navbar/index.wxss');
assert.ok(navbarWxml.indexOf('left-btn="{{navbarLeftBtn}}"') !== -1 && navbarWxml.indexOf('right-btn="{{navbarRightBtn}}"') !== -1, 'Navbar 页面必须复用首页的组件级左侧双操作');
assert.ok(navbarWxml.indexOf('id="navbar-demo"') !== -1, 'Navbar 页面必须提供稳定的运行态验收目标');
assert.ok(navbarWxml.indexOf('bind:leftBtn="onNavbarLeftBtnClick"') !== -1 && navbarWxml.indexOf('bind:rightBtn="onNavbarRightBtnClick"') !== -1, 'Navbar 左侧双操作必须通过组件事件直达页面');
assert.ok(navbarWxml.indexOf('capsule="{{true}}"') !== -1, 'Navbar 页面必须为微信原生胶囊保留右侧安全轨');
assert.ok(navbarWxml.indexOf('slot="right"') === -1, 'capsule=true 的 Navbar 页面不得向右 Slot 放置业务内容');
assert.ok(navbarJs.indexOf("navbarLeftBtn: { icon: 'search', ariaLabel: '搜索组件' }") !== -1, 'Navbar 左侧第一操作必须提供可访问搜索配置');
assert.ok(navbarJs.indexOf("navbarRightBtn: { icon: 'menu', ariaLabel: '打开页面菜单' }") !== -1, 'Navbar 左侧第二操作必须提供可访问菜单配置');
assert.ok(navbarWxml.indexOf('visible="{{navbarVisible}}"') !== -1, 'Navbar visible 必须直接作用于 Navbar 本体');
assert.ok(navbarWxml.indexOf('<pui-switch') !== -1 && navbarWxml.indexOf('value="{{navbarVisible}}"') !== -1, 'Navbar 显隐必须由独立 Switch 控制同一 visible 真相源');
assert.ok(navbarWxml.indexOf('content="隐藏导航栏"') === -1 && navbarWxml.indexOf('content="重新显示导航栏"') === -1, 'Navbar 页面不得用大按钮替代组件显隐示例');
assert.ok(navbarJson.usingComponents['pui-switch'], 'Navbar 页面缺少 PUI Switch 依赖');
assert.ok(navbarStyle.indexOf('min-height: var(--pui-navbar-content-height-fallback)') !== -1, 'Navbar 隐藏后必须保留稳定演示区域');

var navigationMenuWxml = read('miniprogram/pages/components/navigation-menu/index.wxml');
var navigationMenuJson = JSON.parse(read('miniprogram/pages/components/navigation-menu/index.json'));
assert.ok(navigationMenuWxml.indexOf('content="打开导航菜单"') === -1, 'NavigationMenu 页面不得在组件 Trigger 外增加重复打开按钮');
assert.ok(navigationMenuWxml.indexOf('direction="horizontal"') !== -1, 'NavigationMenu 页面必须展示水平浮层');
assert.ok(navigationMenuWxml.indexOf('direction="vertical"') !== -1, 'NavigationMenu 页面必须展示垂直双栏工作区');
assert.ok(navigationMenuWxml.indexOf('show-overlay="{{false}}"') !== -1, 'NavigationMenu 垂直工作区必须关闭全屏 Overlay');
assert.ok(navigationMenuWxml.indexOf('visible="{{true}}"') === -1, 'NavigationMenu 页面不得保留永久可见的诊断浮层');
assert.ok(navigationMenuWxml.indexOf('error="{{errorMenuError}}"') !== -1 && navigationMenuWxml.indexOf('bind:retry="onErrorMenuRetry"') !== -1, 'NavigationMenu 错误态必须由页面控制并闭环 Retry');
assert.ok(navigationMenuWxml.indexOf('z-index="{{horizontalMenuVisible ? 3200 : 1000}}"') !== -1, 'NavigationMenu 活动水平浮层必须高于同页工作区');
assert.ok(navigationMenuWxml.indexOf('z-index="{{errorMenuVisible ? 3200 : 800}}"') !== -1, 'NavigationMenu 活动错误浮层必须高于同页工作区');
assert.ok(navigationMenuWxml.indexOf('content-padding-bottom="{{pageContentPaddingBottom}}"') !== -1, 'NavigationMenu 最后一个浮层必须通过 ScrollArea 公开安全区 API 预留展开空间');
assert.ok(navigationMenuJson.usingComponents['pui-switch'], 'NavigationMenu 页面缺少 PUI Switch 依赖');

var tabsWxml = read('miniprogram/pages/components/tabs/index.wxml');
assert.ok(tabsWxml.indexOf('space-evenly="{{true}}"') !== -1, 'Tabs 页面必须覆盖四项等分');
assert.ok(tabsWxml.indexOf('space-evenly="{{false}}"') !== -1, 'Tabs 页面必须覆盖超过四项半露');
assert.ok(tabsWxml.indexOf('sticky="{{true}}"') !== -1, 'Tabs 页面必须覆盖 sticky');
assert.ok(tabsWxml.indexOf('bind:change="onEvenTabsChange"') !== -1 && tabsWxml.indexOf('bind:change="onOverflowTabsChange"') !== -1, 'Tabs 两种模式都必须真实回写');

var tabbarWxml = read('miniprogram/pages/components/tabbar/index.wxml');
assert.ok(tabbarWxml.indexOf('fixed="{{tabbarFixed}}"') !== -1 && tabbarWxml.indexOf('placeholder="{{tabbarFixed}}"') !== -1, 'Tabbar 页面必须覆盖 fixed 与 placeholder');
assert.ok(tabbarWxml.indexOf('safe-area-inset-bottom="{{true}}"') !== -1, 'Tabbar 页面必须覆盖底部安全区');

var backTopWxml = read('miniprogram/pages/components/back-top/index.wxml');
var backTopJs = read('miniprogram/pages/components/back-top/index.js');
assert.ok(backTopWxml.indexOf('bind:scroll="onPageScroll"') !== -1, 'BackTop 必须读取页面 ScrollArea 滚动');
assert.ok(backTopWxml.indexOf('bind:to-top="onBackTop"') !== -1, 'BackTop 必须真实回写 to-top');
assert.ok(backTopWxml.indexOf('scroll-top="{{pageScrollTop}}"') !== -1, 'BackTop 必须通过 ScrollArea 的公开 scroll-top 控制同一滚动区');
assert.ok(backTopJs.indexOf('selectComponent') === -1 && backTopJs.indexOf('scrollToTop') === -1, 'BackTop 页面不得调用 ScrollArea 未公开的实例方法');

function loadPage(id) {
  var captured;
  var pageFactory = require(path.join(ROOT, 'miniprogram/utils/component-page.js'));
  var sandbox = {
    Page: function Page(definition) { captured = definition; },
    require: function required(request) {
      if (request === '../../../utils/component-page') return pageFactory;
      throw new Error('Unexpected page dependency: ' + request);
    }
  };
  vm.runInNewContext(read('miniprogram/pages/components/' + id + '/index.js'), sandbox, { filename: id + '/index.js' });
  assert.ok(captured, id + ' 必须注册 Page');
  captured.data = JSON.parse(JSON.stringify(captured.data));
  captured.setData = function setData(next) { Object.assign(captured.data, next); };
  return captured;
}

var navbar = loadPage('navbar');
navbar.onNavbarLeftBtnClick();
assert.ok(navbar.data.navbarStatus.indexOf('搜索操作') !== -1, 'Navbar 左侧第一操作必须由页面接收');
navbar.onNavbarRightBtnClick();
assert.ok(navbar.data.navbarStatus.indexOf('菜单操作') !== -1, 'Navbar 左侧第二操作必须由页面接收');
navbar.onNavbarVisibilityChange({ detail: { checked: false } });
assert.strictEqual(navbar.data.navbarVisible, false, 'Navbar 隐藏必须由页面状态控制');
navbar.onNavbarVisibilityChange({ detail: { checked: true } });
assert.strictEqual(navbar.data.navbarVisible, true, 'Navbar 必须提供恢复入口');

var tabs = loadPage('tabs');
tabs.onEvenTabsChange({ detail: { value: 'api' } });
assert.strictEqual(tabs.data.evenTabValue, 'api', 'Tabs 等分模式必须回写 value');
tabs.onOverflowTabsChange({ detail: { value: 'background' } });
assert.strictEqual(tabs.data.overflowTabValue, 'background', 'Tabs 溢出模式必须回写 value');

var tabbar = loadPage('tabbar');
tabbar.onTabbarChange({ detail: { value: 'saved' } });
assert.strictEqual(tabbar.data.tabbarValue, 'saved', 'Tabbar 必须回写当前目的地');
tabbar.onToggleTabbarFixed();
assert.strictEqual(tabbar.data.tabbarFixed, true, 'Tabbar fixed 必须由页面真实切换');

var breadcrumb = loadPage('breadcrumb');
breadcrumb.onBreadcrumbChange({ detail: { value: 'library' } });
assert.strictEqual(breadcrumb.data.breadcrumbValue, 'library', 'Breadcrumb 必须回写路径');

var steps = loadPage('steps');
assert.ok((read('miniprogram/pages/components/steps/index.wxml').match(/<pui-button block/g) || []).length >= 2, 'Steps 上一步与下一步必须以 block 填满两列轨道');
steps.onNextStep();
assert.strictEqual(steps.data.stepValue, 'confirm', 'Steps 下一步必须真实推进');
steps.onPreviousStep();
assert.strictEqual(steps.data.stepValue, 'info', 'Steps 上一步必须真实回退');

var backTop = loadPage('back-top');
backTop.data.pageScrollTop = 480;
backTop.onBackTop();
assert.strictEqual(backTop.data.pageScrollTop, 0, 'BackTop 必须通过 ScrollArea 的公开 scroll-top 回写页面位置');
assert.ok(read('miniprogram/pages/components/back-top/index.wxml').indexOf('scroll-top="{{pageScrollTop}}"') !== -1, 'BackTop 页面必须把同一 scrollTop 同步给 ScrollArea');

var indexes = loadPage('indexes');
assert.ok(indexes.data.indexGroups.length >= 12, 'Indexes 核心示例必须有足够长的分组列表验证滚动与右侧索引');
indexes.onIndexesChange({ detail: { current: 'T' } });
assert.strictEqual(indexes.data.indexCurrent, 'T', 'Indexes 必须回写当前分组');
indexes.onIndexesItemClick({ detail: { valueText: 'Tabs' } });
assert.ok(indexes.data.indexesStatus.indexOf('Tabs') !== -1, 'Indexes 条目点击必须给出真实结果');

var sidebar = loadPage('sidebar');
sidebar.onSidebarChange({ detail: { value: 'navigation' } });
assert.strictEqual(sidebar.data.sidebarValue, 'navigation', 'SideBar 必须回写消费者 value');
var sidebarWxml = read('miniprogram/pages/components/sidebar/index.wxml');
assert.ok(sidebarWxml.indexOf('subtitle="只读状态"') !== -1 && sidebarWxml.indexOf('readonly="{{true}}"') !== -1, 'SideBar 第二场景必须使用用户可理解的只读分类');
assert.ok(sidebarWxml.indexOf('恢复入口') === -1 && sidebarWxml.indexOf('onSidebarRetry') === -1, 'SideBar 页面不得再用含糊的恢复入口作为主要示例');

var menu = loadPage('navigation-menu');
menu.onHorizontalMenuVisibleChange({ detail: { visible: true } });
assert.strictEqual(menu.data.horizontalMenuVisible, true, 'NavigationMenu 水平浮层必须真实打开');
assert.strictEqual(menu.data.errorMenuVisible, false, 'NavigationMenu 水平浮层打开时必须关闭错误浮层');
menu.onHorizontalMenuChange({ detail: { value: 'basic' } });
assert.strictEqual(menu.data.horizontalMenuValue, 'basic', 'NavigationMenu 水平浮层必须回写选择值');
menu.onHorizontalMenuVisibleChange({ detail: { visible: false } });
assert.strictEqual(menu.data.horizontalMenuVisible, false, 'NavigationMenu 水平浮层必须真实关闭');
menu.onVerticalMenuVisibleChange({ detail: { visible: false } });
assert.strictEqual(menu.data.verticalMenuVisible, false, 'NavigationMenu 垂直工作区必须回写可见状态');
menu.onVerticalMenuExpandedChange({ detail: { expandedValue: 'components' } });
assert.strictEqual(menu.data.verticalMenuExpandedValue, 'components', 'NavigationMenu 垂直工作区必须回写展开项');
menu.onErrorMenuRetry();
assert.strictEqual(menu.data.errorMenuError, false, 'NavigationMenu Retry 必须等待页面移除 error Prop');
menu.onErrorMenuVisibleChange({ detail: { visible: true } });
assert.strictEqual(menu.data.horizontalMenuVisible, false, 'NavigationMenu 错误浮层打开时必须关闭水平浮层');
assert.strictEqual(menu.data.pageContentPaddingBottom, '680rpx', 'NavigationMenu 底部浮层打开时必须真实扩大 ScrollArea 内容尾部安全区');
menu.onErrorMenuVisibleChange({ detail: { visible: false } });
assert.strictEqual(menu.data.pageContentPaddingBottom, '10vh', 'NavigationMenu 底部浮层关闭后必须恢复 ScrollArea 默认尾部安全区');
menu.onErrorModeChange({ detail: { checked: true } });
assert.strictEqual(menu.data.errorMenuError, true, 'NavigationMenu 错误状态必须可由页面重新控制');

console.log('miniprogram navigation pages contract tests passed');
