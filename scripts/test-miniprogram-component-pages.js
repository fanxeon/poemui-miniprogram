'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

var routes = {
  button: {
    title: 'Button',
    headings: ['基础用法', '组件类型', '组件状态', '组件样式']
  },
  divider: {
    title: 'Divider',
    headings: ['基础用法', '文字与对齐', '布局与线型']
  },
  icon: {
    title: 'Icon',
    headings: ['图标资源']
  },
  'aspect-ratio': {
    title: 'AspectRatio',
    headings: ['基础用法', '比例与裁切']
  },
  direction: {
    title: 'Direction',
    headings: ['基础用法', '受控切换']
  },
  grid: {
    title: 'Grid',
    headings: ['基础用法', '布局与状态']
  },
  'scroll-area': {
    title: 'ScrollArea',
    headings: []
  },
  sticky: {
    title: 'Sticky',
    headings: ['基础用法', '偏移与禁用']
  },
  navbar: {
    title: 'Navbar',
    headings: ['基础用法', '左右操作', '受控显隐'],
    miniprogramHeadings: ['左侧双操作']
  },
  'navigation-menu': {
    title: 'NavigationMenu',
    headings: ['基础用法', '状态组合'],
    miniprogramHeadings: ['水平浮层', '垂直工作区', '错误与恢复']
  },
  tabs: {
    title: 'Tabs',
    headings: ['基础用法', '横向溢出', '交互结果']
  },
  breadcrumb: {
    title: 'Breadcrumb',
    headings: ['基础用法', '长路径', '错误恢复']
  },
  tabbar: {
    title: 'Tabbar',
    headings: ['基础用法', '固定与占位', '视觉边界']
  },
  steps: {
    title: 'Steps',
    headings: ['基础用法', '纵向与状态', '边界值与禁用']
  },
  'back-top': {
    title: 'BackTop',
    headings: ['基础用法', '图标形态']
  },
  indexes: {
    title: 'Indexes',
    headings: ['基础用法', '错误恢复']
  },
  sidebar: {
    title: 'SideBar',
    headings: ['基础用法', '错误恢复']
  },
  alert: {
    title: 'Alert',
    headings: ['基础用法', '纵向居中', '同色正文', '受控显隐']
  },
  empty: {
    title: 'Empty',
    headings: ['基础用法', '下一步入口']
  },
  loading: {
    title: 'Loading',
    headings: ['基础用法', '布局与进度']
  },
  'notice-bar': {
    title: 'NoticeBar',
    headings: ['基础用法', '方向与主题']
  },
  progress: {
    title: 'Progress',
    headings: ['基础用法', '形态与状态']
  },
  result: {
    title: 'Result',
    headings: ['基础用法', '页面操作']
  },
  skeleton: {
    title: 'Skeleton',
    headings: ['基础用法', '占位形态']
  },
  toast: {
    title: 'Toast',
    headings: ['基础用法', '内容与样式']
  },
  dialog: {
    title: 'Dialog',
    headings: ['基础用法', '内容边界', '遮罩与长内容']
  },
  'top-loading': {
    title: 'TopLoading',
    headings: ['当前卡片任务', '状态回写']
  },
  'dynamic-message': {
    title: 'DynamicMessage',
    headings: ['生成任务通知', '页面仍可操作']
  },
  'area-chart': {
    title: 'AreaChart',
    headings: ['连续趋势']
  },
  'bar-chart': {
    title: 'BarChart',
    headings: ['组件分类增量', '纵向比较']
  },
  waffle: {
    title: 'Waffle',
    headings: ['组件数量点阵', '大数据缩放']
  },
  'pull-refresh': {
    title: 'PullRefresh',
    headings: []
  },
  'virtual-list': {
    title: 'VirtualList',
    headings: []
  },
  watermark: {
    title: 'Watermark',
    headings: ['基础用法', '布局与移动']
  },
  avatar: { title: 'Avatar', headings: ['基础用法', '尺寸与形状'] },
  badge: { title: 'Badge', headings: ['基础用法', '数值边界'] },
  card: { title: 'Card', headings: ['基础用法', '点击边界'] },
  image: { title: 'Image', headings: ['基础用法', '加载与错误'] },
  tag: { title: 'Tag', headings: ['基础用法', '关闭回写'] },
  cell: { title: 'Cell', headings: ['基础用法', '状态边界'] },
  list: { title: 'List', headings: ['基础用法', '加载与恢复'] },
  collapse: { title: 'Collapse', headings: ['基础用法', '集合边界'] },
  collapsible: { title: 'Collapsible', headings: ['基础用法', '状态边界'] },
  bubble: { title: 'Bubble', headings: ['基础用法', '业务边界'] },
  'swipe-cell': { title: 'SwipeCell', headings: ['基础用法', '禁用边界'] },
  'count-down': { title: 'CountDown', headings: ['基础用法', '控制边界'], miniprogramHeadings: ['数字滚动倒计时', '控制计时与风格'] },
  swiper: { title: 'Swiper', headings: ['基础用法', '状态边界'] },
  table: { title: 'Table', headings: ['基础用法', '选择与排序'] },
  'config-provider': { title: 'ConfigProvider', headings: ['全局配置', '局部覆盖'] },
  form: { title: 'Form', headings: ['基础用法'] },
  field: { title: 'Field', headings: ['基础用法'] },
  label: { title: 'Label', headings: ['基础用法', '显示配置'] },
  input: { title: 'Input', headings: ['基础用法'] },
  'input-otp': { title: 'InputOTP', headings: ['基础用法'] },
  textarea: { title: 'Textarea', headings: ['基础用法'] },
  search: { title: 'Search', headings: ['基础用法'] },
  checkbox: { title: 'Checkbox', headings: ['基础用法'] },
  radio: { title: 'Radio', headings: ['基础用法'] },
  switch: { title: 'Switch', headings: ['基础用法'] },
  select: { title: 'Select', headings: ['基础用法'] },
  picker: { title: 'Picker', headings: ['基础用法'] },
  combobox: { title: 'Combobox', headings: ['基础用法'] },
  slider: { title: 'Slider', headings: ['基础用法'] },
  stepper: { title: 'Stepper', headings: ['基础用法'] },
  rate: { title: 'Rate', headings: ['基础用法'] },
  calendar: { title: 'Calendar', headings: ['基础用法'] },
  'date-time-picker': { title: 'DateTimePicker', headings: ['基础用法'] },
  upload: { title: 'Upload', headings: ['基础用法'] },
  popup: {
    title: 'Popup',
    headings: ['基础用法', '外观配置', '三段结构']
  },
  popover: {
    title: 'Popover',
    headings: ['基础用法', '定位方式', '内容组合']
  },
  sheet: {
    title: 'Sheet',
    headings: ['基础用法', '内容状态', '三段结构']
  },
  'action-sheet': {
    title: 'ActionSheet',
    headings: ['基础用法', '动作内容']
  },
  'dropdown-menu': {
    title: 'DropdownMenu',
    headings: ['基础用法', '选项语义']
  },
  overlay: {
    title: 'Overlay',
    headings: ['基础用法', '遮罩配置']
  }
};

var componentPageDirectory = path.join(ROOT, 'miniprogram/pages/components');
var currentComponentPages = fs.readdirSync(componentPageDirectory).filter(function (name) {
  return fs.existsSync(path.join(componentPageDirectory, name, 'index.js')) &&
    fs.existsSync(path.join(componentPageDirectory, name, 'index.wxml'));
}).sort();
assert.deepStrictEqual(currentComponentPages, Object.keys(routes).sort(), '所有当前组件详情页都必须纳入统一 Navbar 壳专项测试');

var sharedStyle = read('miniprogram/styles/component-page.wxss');
var appStyle = read('miniprogram/app.wxss');
var helperJs = read('miniprogram/utils/component-page.js');
var sharedSectionBase = 'miniprogram/components/component-page-section/component-page-section';
var sharedSectionJs = read(sharedSectionBase + '.js');
var sharedSectionWxml = read(sharedSectionBase + '.wxml');
var sharedSectionWxss = read(sharedSectionBase + '.wxss');
var sharedSectionJson = JSON.parse(read(sharedSectionBase + '.json'));
var scrollOwnerPages = ['scroll-area', 'pull-refresh', 'virtual-list'];
var taskFocusedPages = [
  'aspect-ratio', 'direction', 'grid', 'scroll-area', 'sticky',
  'navbar', 'navigation-menu', 'tabs', 'breadcrumb', 'tabbar', 'steps', 'back-top', 'indexes', 'sidebar',
  'form', 'field', 'label', 'input', 'input-otp', 'textarea', 'search', 'checkbox', 'radio', 'switch', 'select', 'picker', 'combobox', 'slider', 'stepper', 'rate', 'calendar', 'date-time-picker', 'upload',
  'collapse', 'avatar', 'badge', 'bubble', 'card', 'cell', 'collapsible', 'count-down', 'image', 'list', 'swipe-cell', 'swiper', 'table', 'tag',
  'alert', 'dialog', 'empty', 'loading', 'notice-bar', 'progress', 'result', 'skeleton', 'toast',
  'area-chart', 'bar-chart', 'waffle', 'top-loading', 'dynamic-message', 'pull-refresh', 'virtual-list', 'watermark'
];

assert.ok(appStyle.indexOf('height: 100vh') !== -1 && appStyle.indexOf('overflow: hidden') !== -1, '小程序 App 根必须提供全屏且不滚动的页面基础');
assert.ok(!/^page\s*\{/m.test(sharedStyle), '被详情页导入的共享 WXSS 不得包含微信组件不支持的标签选择器');
assert.ok(sharedStyle.indexOf('var(--pui-') !== -1, '组件页样式必须消费 PUI Token');
assert.ok(sharedStyle.indexOf('#') === -1, '组件页共享样式不得写入私有颜色');
assert.ok(sharedStyle.indexOf('.component-page__row--actions') !== -1, '双操作行必须使用独立语义类，不能改写通用内容行');
assert.ok(sharedStyle.indexOf('grid-template-columns: repeat(2, minmax(0, 1fr))') !== -1, '双操作行必须稳定等分为两列');
assert.ok(sharedStyle.indexOf('gap: var(--pui-content-gap);') !== -1, '双操作行必须显式保留 16rpx 标准内容间距');
assert.ok(helperJs.indexOf('getWindowInfo') !== -1, '组件页必须读取真实窗口高度');
assert.ok(helperJs.indexOf("select('#component-navbar')") !== -1, '组件页必须测量真实 Navbar');
assert.ok(helperJs.indexOf('windowHeight - navbarHeight') !== -1, 'ScrollArea 高度必须由真实剩余空间计算');
assert.ok(helperJs.indexOf('wx.navigateBack') !== -1, 'Navbar 返回必须调用真实 navigateBack');
assert.ok(helperJs.indexOf("wx.reLaunch({ url: '/pages/index/index' })") !== -1, '直接打开详情页时必须有真实首页恢复路径');
assert.ok(helperJs.indexOf("require('../common/utils/page-background-preference')") !== -1, '详情页壳必须订阅共享页面渐变偏好');
assert.strictEqual(sharedSectionJson.component, true, '详情页分区必须是可复用小程序组件');
assert.ok(sharedSectionJs.indexOf("spacing: { type: String, value: 'spacious' }") !== -1, '详情页分区默认必须使用宽松节奏');
['title', 'subtitle', 'description', '<slot />'].forEach(function (contract) {
  assert.ok(sharedSectionWxml.indexOf(contract) !== -1, '详情页分区缺少共享 ' + contract + ' 结构');
});
['var(--pui-section-gap)', 'var(--pui-content-gap)', 'var(--pui-space-xs)'].forEach(function (token) {
  assert.ok(sharedSectionWxss.indexOf(token) !== -1, '详情页分区必须消费 ' + token);
});
assert.ok(sharedSectionWxss.indexOf('padding-block: var(--pui-content-gap)') !== -1, '宽松分区必须用内容 Token 补足上下阅读空间');
assert.ok(sharedSectionWxss.indexOf('.component-page-section--regular') !== -1, '长目录必须能在同一共享分区组件中选择常规密度');

Object.keys(routes).forEach(function (name) {
  var base = 'miniprogram/pages/components/' + name + '/index';
  var wxml = read(base + '.wxml');
  var wxss = read(base + '.wxss');
  var pageJson = JSON.parse(read(base + '.json'));

  assert.ok(wxml.indexOf('<pui-config-provider') !== -1, name + ' 页面缺少 ConfigProvider');
  assert.ok(wxml.indexOf('use-global-config') !== -1, name + ' 页面必须接入 global visualConfig');
  assert.ok(wxml.indexOf('<component-page-navbar title="{{pageTitle}}" bind:back="onBack" />') !== -1, name + ' 页面必须只消费共享详情页 Navbar');
  if (name !== 'navbar') assert.ok(wxml.indexOf('<pui-navbar') === -1, name + ' 页面不得重新手写 Navbar');
  if (scrollOwnerPages.indexOf(name) === -1) {
    assert.ok(wxml.indexOf('<pui-scroll-area') !== -1, name + ' 页面缺少 ScrollArea');
    assert.ok(wxml.indexOf('height="{{scrollAreaHeight}}"') !== -1, name + ' ScrollArea 必须消费动态 px 高度');
    assert.ok(wxml.indexOf('gradient-overlay') !== -1, name + ' ScrollArea 必须保留默认渐变遮罩');
  } else if (name === 'pull-refresh') {
    assert.ok(wxml.indexOf('<pui-pull-refresh') !== -1 && wxml.indexOf('custom-style="height:{{scrollAreaHeight}};"') !== -1, 'PullRefresh 必须自身承担动态高度滚动');
  } else if (name === 'virtual-list') {
    assert.ok(wxml.indexOf('<pui-virtual-list') !== -1 && wxml.indexOf('height="{{virtualListHeight}}"') !== -1, 'VirtualList 必须以真实剩余 px 高度换算 rpx 后承担动态滚动');
  } else {
    assert.ok(wxml.indexOf('<pui-scroll-area') !== -1 && wxml.indexOf('aria-label="可滚动的组件更新记录"') !== -1, 'ScrollArea 页面必须由被测组件承担唯一滚动区');
  }
  assert.ok(wxml.indexOf('<scroll-view') === -1, name + ' 页面不得创建第二滚动容器');
  assert.ok(wxml.indexOf('<button') === -1, name + ' 页面不得手写原生 Button');
  Array.from(wxml.matchAll(/<view class="([^"]*\bcomponent-page__row\b[^"]*)">([\s\S]*?)<\/view>/g)).forEach(function (match) {
    var buttons = match[2].match(/<pui-button\b[^>]*>/g) || [];
    if (buttons.length !== 2) return;
    assert.ok(match[1].indexOf('component-page__row--actions') !== -1, name + ' 的双按钮操作行必须使用两列语义类');
    buttons.forEach(function (button) {
      assert.ok(/\bblock\b/.test(button), name + ' 的两列按钮必须填满各自网格轨道');
    });
  });
  if (name !== 'tabbar') assert.ok(wxml.indexOf('<pui-tabbar') === -1, name + ' 详情页不应伪造底部目的地');
  if (scrollOwnerPages.indexOf(name) === -1) {
    assert.ok(wxml.indexOf('<component-page-section') !== -1, name + ' 页面必须复用共享详情页分区');
    assert.ok(wxml.indexOf('component-page__section-header') === -1, name + ' 页面不得重新手写分区标题区');
  }
  if (name === 'icon') {
    assert.ok(wxss.indexOf('@import "../../../styles/component-page.wxss";') === 0, 'Icon 页面必须复用共享页面壳样式');
    assert.ok(wxss.indexOf('grid-template-columns: repeat(3, minmax(0, 1fr));') !== -1, 'Icon 页面必须使用三列图标网格');
    assert.ok(wxss.indexOf('var(--pui-') !== -1, 'Icon 页面私有布局必须消费 PUI Token');
    assert.ok(wxss.indexOf('var(--pui-text-secondary)') !== -1, 'Icon 分区标题必须消费既有文字 Token');
    assert.ok(wxss.indexOf('#') === -1, 'Icon 页面不得写入私有颜色');
  } else if (['popup', 'popover'].indexOf(name) !== -1) {
    assert.ok(wxss.indexOf('@import "../../../styles/component-page.wxss";') === 0, name + ' 页面必须复用共享页面壳样式');
    assert.ok(wxss.indexOf('grid-template-columns: repeat(2, minmax(0, 1fr));') !== -1, name + ' 入口必须使用响应式 Token 网格');
    assert.ok(wxss.indexOf('var(--pui-') !== -1, name + ' 页面私有布局必须消费 PUI Token');
    assert.ok(wxss.indexOf('#') === -1, name + ' 页面不得写入私有颜色');
  } else if (name === 'overlay') {
    assert.ok(wxss.indexOf('@import "../../../styles/component-page.wxss";') === 0, 'Overlay 页面必须复用共享页面壳样式');
    assert.ok(wxss.indexOf('.overlay-page__greeting') !== -1, 'Overlay 页面必须保留居中展示文案布局');
    assert.ok(wxss.indexOf('var(--pui-') !== -1, 'Overlay 页面私有布局必须消费 PUI Token');
    assert.ok(wxss.indexOf('#') === -1, 'Overlay 页面不得写入私有颜色');
  } else if (name === 'alert') {
    assert.ok(wxss.indexOf('@import "../../../styles/component-page.wxss";') === 0, 'Alert 页面必须复用共享页面壳样式');
    assert.ok(wxss.indexOf('.alert-page__stack') !== -1, 'Alert 多个 tinted 示例必须使用唯一 Token 化堆叠布局');
    assert.ok(wxss.indexOf('var(--pui-space-normal)') !== -1, 'Alert 示例堆叠必须使用内容组合 Token');
    assert.ok(wxss.indexOf('#') === -1, 'Alert 页面不得写入私有颜色');
  } else if (name === 'dialog') {
    assert.ok(wxss.indexOf('@import "../../../styles/component-page.wxss";') === 0, 'Dialog 页面必须复用共享页面壳样式');
    assert.ok(wxss.indexOf('.dialog-page__content') !== -1, 'Dialog 内容 Slot 必须使用唯一 Token 化组合布局');
    assert.ok(wxss.indexOf('var(--pui-content-gap)') !== -1, 'Dialog 内容组合必须消费已有内容间距 Token');
    assert.ok(wxss.indexOf('#') === -1, 'Dialog 页面不得写入私有颜色');
  } else if (['aspect-ratio', 'watermark'].indexOf(name) !== -1) {
    assert.ok(wxss.indexOf('@import "../../../styles/component-page.wxss";') === 0, name + ' 页面必须复用共享页面壳样式');
    assert.ok(wxss.indexOf('@import "../../../styles/') !== -1, name + ' 页面必须复用分区共享布局样式');
    assert.ok(wxss.indexOf('#') === -1, name + ' 页面不得写入私有颜色');
  } else if (['avatar', 'badge', 'tag'].indexOf(name) !== -1) {
    assert.ok(wxss.indexOf('@import "../../../styles/component-page.wxss";') === 0, name + ' 页面必须复用共享页面壳样式');
    assert.ok(wxss.indexOf('@import "../../../styles/data-pages.wxss";') !== -1, name + ' 页面必须复用数据展示组合布局');
    assert.ok(wxss.indexOf('#') === -1, name + ' 页面不得写入私有颜色');
  } else if (['top-loading', 'dynamic-message', 'pull-refresh', 'virtual-list'].indexOf(name) !== -1) {
    assert.ok(wxss.indexOf('@import "../../../styles/component-page.wxss";') === 0, name + ' 页面必须复用共享页面壳样式');
    assert.ok(wxss.indexOf('@import "../../../styles/advanced-pages.wxss";') !== -1, name + ' 页面必须使用滚动所有者布局');
    assert.ok(wxss.indexOf('#') === -1, name + ' 页面不得写入私有颜色');
  } else if (['navbar', 'navigation-menu', 'tabs', 'breadcrumb', 'tabbar', 'steps', 'back-top', 'indexes', 'sidebar'].indexOf(name) !== -1) {
    assert.ok(wxss.indexOf('@import "../../../styles/component-page.wxss";') === 0, name + ' 页面必须复用共享页面壳样式');
    assert.ok(wxss.indexOf('@import "../../../styles/navigation-pages.wxss";') !== -1, name + ' 页面必须复用导航页面共享样式');
    assert.ok((wxss + read('miniprogram/styles/navigation-pages.wxss')).indexOf('var(--pui-') !== -1, name + ' 页面私有布局必须消费 PUI Token');
    assert.ok(wxss.indexOf('#') === -1, name + ' 页面不得写入私有颜色');
  } else {
    assert.strictEqual(wxss.trim(), '@import "../../../styles/component-page.wxss";');
  }
  assert.strictEqual(pageJson.usingComponents['component-page-navbar'], '/components/component-page-navbar/component-page-navbar');
  if (scrollOwnerPages.indexOf(name) === -1) {
    assert.strictEqual(pageJson.usingComponents['component-page-section'], '/components/component-page-section/component-page-section');
    assert.strictEqual(pageJson.usingComponents['pui-scroll-area'], 'poemui-miniprogram/scroll-area/scroll-area');
  } else if (name === 'scroll-area') {
    assert.strictEqual(pageJson.usingComponents['pui-scroll-area'], 'poemui-miniprogram/scroll-area/scroll-area');
  }

  if (taskFocusedPages.indexOf(name) === -1) {
    var expectedHeadings = routes[name].miniprogramHeadings || routes[name].headings;
    expectedHeadings.forEach(function (heading) {
      var headingSource = routes[name].miniprogramHeadings ? '独立示例契约分区 ' : 'H5 同源分区 ';
      assert.ok(wxml.indexOf('title="' + heading + '"') !== -1, name + ' 页面缺少 ' + headingSource + heading);
    });
  }
});

var popupWxml = read('miniprogram/pages/components/popup/index.wxml');
var popupJs = read('miniprogram/pages/components/popup/index.js');
var popupJson = JSON.parse(read('miniprogram/pages/components/popup/index.json'));
assert.ok(popupWxml.indexOf('<pui-popup') !== -1, 'Popup 详情页必须展示真实 PUI Popup');
assert.ok(popupWxml.indexOf('bind:visible-change="onPopupVisibleChange"') !== -1, 'Popup 详情页必须真实回写 visible-change');
assert.ok(popupWxml.indexOf('using-custom-navbar') !== -1, 'Popup 详情页必须尊重自定义 Navbar 安全区');
assert.ok(popupWxml.indexOf('blur-overlay="{{popupBlurOverlay}}"') !== -1, 'Popup 详情页必须真实控制遮罩模糊');
assert.ok(popupWxml.indexOf('slot="header-left"') !== -1 && popupWxml.indexOf('slot="content"') !== -1 && popupWxml.indexOf('slot="footer"') !== -1, 'Popup 详情页必须展示 Header/Content/Footer 三段 Slot');
assert.ok(popupWxml.indexOf('<pui-cell-group') !== -1 && popupWxml.indexOf('<pui-switch') !== -1, 'Popup 详情页必须复用 CellGroup 与 Switch');
assert.ok(popupJs.indexOf('popupPlacement') !== -1 && popupJs.indexOf('popupVisible') !== -1, 'Popup 详情页必须有真实受控状态');
['onOpenPopup', 'onPopupVisibleChange', 'onPopupSettingChange', 'onPopupFooterAction'].forEach(function (method) {
  assert.ok(popupJs.indexOf(method + ': function') !== -1, 'Popup 详情页缺少真实交互方法 ' + method);
});
['pui-popup', 'pui-cell', 'pui-cell-group', 'pui-switch'].forEach(function (componentName) {
  assert.ok(popupJson.usingComponents[componentName], 'Popup 详情页缺少 ' + componentName + ' 依赖');
});

var buttonWxml = read('miniprogram/pages/components/button/index.wxml');
var buttonJs = read('miniprogram/pages/components/button/index.js');
assert.ok(buttonWxml.indexOf('bind:click="onButtonAction"') !== -1, 'Button 可用示例必须有真实回写');
assert.ok(buttonWxml.indexOf('<pui-badge slot="suffix"') !== -1, 'Button 组合内容必须复用 PUI Badge');
assert.ok(buttonWxml.indexOf('variant="transparent"') !== -1, 'Button 详情页必须展示真实 transparent 变体');
assert.ok(buttonJs.indexOf('lastAction') !== -1, 'Button 点击结果必须真实写入页面状态');
['aspect-ratio', 'direction', 'grid', 'form', 'progress', 'scroll-area', 'sticky', 'watermark'].forEach(function (name) {
  var actionWxml = read('miniprogram/pages/components/' + name + '/index.wxml');
  assert.ok(actionWxml.indexOf('component-page__row--actions') !== -1, name + ' 的双操作区必须使用共享两列布局');
});

var dividerWxml = read('miniprogram/pages/components/divider/index.wxml');
assert.ok(dividerWxml.indexOf('align="left"') !== -1, 'Divider 必须展示左对齐文字');
assert.ok(dividerWxml.indexOf('align="right"') !== -1, 'Divider 必须展示右对齐文字');
assert.ok(dividerWxml.indexOf('layout="vertical"') !== -1, 'Divider 必须展示纵向布局');
assert.ok(dividerWxml.indexOf('<pui-tag') !== -1, 'Divider Slot 与纵向示例必须复用 PUI Tag');
assert.ok((dividerWxml.match(/<component-page-section/g) || []).length === 3, 'Divider 三段内容都必须共享宽松分区布局');
['subtitle="内容分区"', 'subtitle="层级标记"', 'subtitle="阅读节奏"'].forEach(function (subtitle) {
  assert.ok(dividerWxml.indexOf(subtitle) !== -1, 'Divider 分区缺少用户可读子标题：' + subtitle);
});

var iconWxml = read('miniprogram/pages/components/icon/index.wxml');
var iconJs = read('miniprogram/pages/components/icon/index.js');
assert.ok(iconWxml.indexOf('<pui-search') !== -1, 'Icon 资源必须提供真实 PUI Search');
assert.ok(iconWxml.indexOf('class="component-page__icon-search-row"') !== -1, 'Icon 搜索框必须放入全宽布局行');
assert.ok(iconWxml.indexOf('custom-class="component-page__icon-search"') !== -1, 'Icon 搜索根必须接收全宽布局类');
assert.ok(iconWxml.indexOf('style="display:flex;flex:1;min-width:0;width:100%;"') !== -1, 'Icon 搜索组件宿主必须占满全宽布局行');
assert.ok(iconWxml.indexOf('custom-style="width:100%;max-width:100%;flex:1;min-width:0;"') !== -1, 'Icon 搜索根必须显式占满布局行');
assert.ok(iconWxml.indexOf('共 {{iconCatalog.length}} 个图标') !== -1, 'Icon 页面必须提供目录范围说明');
assert.ok(iconWxml.indexOf('subtitle="{{group.description}}"') !== -1, 'Icon 分区必须通过共享子标题提供真实分类说明');
assert.ok(iconWxml.indexOf('description="{{group.count}} 个可用图标"') !== -1, 'Icon 分区必须通过共享描述提供真实分类数量');
assert.ok(iconWxml.indexOf('spacing="regular"') !== -1, 'Icon 长目录必须在共享分区中使用常规密度');
assert.ok(iconWxml.indexOf('size="{{56}}"') !== -1, 'Icon 网格图标必须在原有 40rpx 基础上放大两个 8rpx 档位');
assert.ok(iconWxml.indexOf('component-page__icon-grid-name') !== -1, 'Icon 网格必须在图标下方显示名称');
assert.ok(iconWxml.indexOf('aria-label="{{icon.name}}"') === -1, '有可见名称时 Icon 叶子不应重复朗读图标名称');
var iconScrollMarkup = iconWxml.slice(iconWxml.indexOf('<pui-scroll-area'), iconWxml.indexOf('</pui-scroll-area>'));
assert.ok(iconScrollMarkup.indexOf('<pui-button') === -1, 'Icon 网格只展示 PUI Icon，不得制造复制卡片');
assert.ok(iconWxml.indexOf('visibleIconGroups') !== -1, 'Icon 页面必须按真实分类渲染');
assert.ok(iconWxml.indexOf('wx:for-item="group"') !== -1, 'Icon 页面必须保留分类循环');
assert.ok(iconWxml.indexOf('<pui-icon') !== -1, 'Icon 网格必须渲染真实 PUI Icon');
assert.ok(iconJs.indexOf("require('poemui-miniprogram/icon/icon-font-catalog')") !== -1, 'Icon 页面必须从已安装 PUI 包读取真实字体图标目录');
assert.ok(iconJs.indexOf('ICON_FONT_CATALOG.icons.map') !== -1, 'Icon 页面不得维护手写图标名单');
assert.ok(iconJs.indexOf('CATEGORY_DESCRIPTIONS') !== -1, 'Icon 页面必须为真实分类提供浏览说明');
assert.ok(iconJs.indexOf("'layout', 'components', 'abstract'") !== -1, 'Icon 页面必须把 components 放入真实分类顺序');
assert.ok(iconJs.indexOf("components: '组件'") !== -1, 'Icon 页面必须展示用户可理解的组件分类名称');
assert.ok(iconJs.indexOf("components: 'PoemUI 已落地组件'") !== -1, 'Icon 页面必须说明 components 分类语义');
assert.ok(iconJs.indexOf('visibleIconGroups') !== -1, 'Icon 搜索必须真实过滤图标分区');
assert.ok(iconJs.indexOf('wx.setClipboardData') === -1, '纯图标网格不得保留不可见复制行为');

var sharedNavbarBase = 'miniprogram/components/component-page-navbar/component-page-navbar';
var sharedNavbarJs = read(sharedNavbarBase + '.js');
var sharedNavbarWxml = read(sharedNavbarBase + '.wxml');
var sharedNavbarWxss = read(sharedNavbarBase + '.wxss');
var sharedNavbarJson = JSON.parse(read(sharedNavbarBase + '.json'));
assert.strictEqual(sharedNavbarJson.component, true, '详情页 Navbar 必须是可复用小程序组件');
['pui-navbar', 'pui-button', 'pui-popup', 'appearance-settings'].forEach(function (componentName) {
  assert.ok(sharedNavbarJson.usingComponents[componentName], '共享详情页 Navbar 缺少 ' + componentName + ' 组合');
});
assert.ok(sharedNavbarWxml.indexOf('left-arrow="{{false}}"') !== -1, '共享详情页 Navbar 必须关闭默认返回并使用统一左侧双操作');
assert.ok(sharedNavbarWxml.indexOf('bordered="{{false}}"') !== -1, '共享详情页 Navbar 必须明确保持无底线');
assert.ok(sharedNavbarWxml.indexOf('capsule="{{true}}"') !== -1 && sharedNavbarWxml.indexOf('fixed="{{false}}"') !== -1, '共享详情页 Navbar 必须保留原生胶囊并处于根布局首行');
assert.ok(sharedNavbarWxml.indexOf('left-btn="{{navbarLeftBtn}}"') !== -1 && sharedNavbarWxml.indexOf('right-btn="{{navbarRightBtn}}"') !== -1, '共享详情页 Navbar 必须通过组件级双操作配置承载返回与菜单');
assert.ok(sharedNavbarWxml.indexOf('bind:leftBtn="onBack"') !== -1, '共享详情页返回必须直接监听 Navbar leftBtn');
assert.ok(sharedNavbarWxml.indexOf('bind:rightBtn="onOpenAppearance"') !== -1, '共享详情页菜单必须直接监听 Navbar rightBtn');
assert.ok(sharedNavbarJs.indexOf("navbarLeftBtn: { icon: 'chevron-left', ariaLabel: '返回' }") !== -1, '共享详情页返回必须使用 chevron-left 配置');
assert.ok(sharedNavbarJs.indexOf("navbarRightBtn: { icon: 'menu', ariaLabel: '打开外观设置' }") !== -1, '共享详情页菜单必须使用 menu 配置');
assert.ok(sharedNavbarWxml.indexOf('visible="{{appearancePopupVisible}}"') !== -1, '共享详情页外观 Popup 必须由自身受控');
assert.ok(sharedNavbarWxml.indexOf('placement="bottom"') !== -1 && sharedNavbarWxml.indexOf('card="{{true}}"') !== -1, '共享详情页外观设置必须使用 Popup 自身 Card 形态');
assert.ok(sharedNavbarWxml.indexOf('show-header') !== -1 && sharedNavbarWxml.indexOf('title="外观"') !== -1 && sharedNavbarWxml.indexOf('close-btn') === -1, '共享详情页外观 Popup 必须消费 Popup 默认常驻关闭按钮');
assert.ok(sharedNavbarWxml.indexOf('slot="header-left"') !== -1 && sharedNavbarWxml.indexOf('icon="refresh"') !== -1 && sharedNavbarWxml.indexOf('bind:click="onResetAppearance"') !== -1, '共享详情页 Popup Header 左侧必须有真实 PUI 重置按钮');
assert.ok(sharedNavbarWxml.indexOf('theme="primary"') !== -1, '共享详情页重置必须使用 primary PUI Button 外观');
assert.ok(sharedNavbarWxml.indexOf('blur-overlay') !== -1 && sharedNavbarWxml.indexOf('prevent-scroll-through') !== -1, '共享详情页外观 Popup 必须提供模糊遮罩与滚动防护');
assert.ok(sharedNavbarWxml.indexOf('<appearance-settings />') !== -1, '共享详情页外观 Popup 必须复用 appearance-settings');
var sharedAppearanceWxml = read('miniprogram/components/appearance-settings/appearance-settings.wxml');
['果味', '边框', '阴影', '毛玻璃', '大圆角', '间距相等', '渐变', '深色'].forEach(function (label) {
  assert.ok(sharedAppearanceWxml.indexOf('title="' + label + '"') !== -1, '共享详情页外观 Popup 缺少 ' + label + ' 设置');
});
assert.ok(sharedNavbarJs.indexOf("require('poemui-miniprogram/common/utils/visual-config')") !== -1, '共享详情页外观必须写入 visualConfig Store');
assert.ok(sharedNavbarJs.indexOf("require('../../common/utils/page-background-preference')") !== -1, '共享详情页渐变必须复用持久化画布偏好');
assert.ok(sharedNavbarJs.indexOf("triggerEvent('back')") !== -1, '共享详情页 Navbar 必须把真实返回意图交给页面路由处理');
assert.ok(sharedNavbarWxss.trim() === '', '共享详情页不得保留 Navbar 双按钮的页面私有布局样式');

var sharedVisualState = { theme: 'light', effectsEnabled: true, shadow: true, frostedGlass: false, largeRadius: true, bordered: false, equalSpacing: false };
var sharedVisualListeners = [];
var sharedCanvasGradient = false;
var sharedCanvasListeners = [];
var sharedVisualConfigMock = {
  get: function () { return Object.assign({}, sharedVisualState); },
  restore: function () { return { config: this.get(), restored: true, error: null }; },
  set: function (patch) {
    Object.keys(patch || {}).forEach(function (key) { sharedVisualState[key] = patch[key]; });
    sharedVisualListeners.slice().forEach(function (listener) { listener(this.get()); }, this);
    return { config: this.get(), changed: true, persisted: true, error: null };
  },
  reset: function () {
    sharedVisualState = { theme: 'light', effectsEnabled: true, shadow: true, frostedGlass: false, largeRadius: true, bordered: false, equalSpacing: false };
    sharedVisualListeners.slice().forEach(function (listener) { listener(this.get()); }, this);
    return { config: this.get(), changed: true, persisted: true, error: null };
  },
  subscribe: function (listener) {
    sharedVisualListeners.push(listener);
    listener(this.get());
    return function () { sharedVisualListeners = sharedVisualListeners.filter(function (entry) { return entry !== listener; }); };
  }
};
var sharedBackgroundPreferenceMock = {
  get: function () { return sharedCanvasGradient; },
  restore: function () { return { value: sharedCanvasGradient, restored: true, error: null }; },
  set: function (next) {
    sharedCanvasGradient = Boolean(next);
    sharedCanvasListeners.slice().forEach(function (listener) { listener(sharedCanvasGradient); });
    return { value: sharedCanvasGradient, changed: true, persisted: true, error: null };
  },
  subscribe: function (listener) {
    sharedCanvasListeners.push(listener);
    listener(sharedCanvasGradient);
    return function () { sharedCanvasListeners = sharedCanvasListeners.filter(function (entry) { return entry !== listener; }); };
  }
};
var sharedNavbarDefinition;
vm.runInNewContext(sharedNavbarJs, {
  Object: Object,
  Boolean: Boolean,
  require: function (request) {
    if (request === 'poemui-miniprogram/common/utils/visual-config') return sharedVisualConfigMock;
    if (request === '../../common/utils/page-background-preference') return sharedBackgroundPreferenceMock;
    throw new Error('Unexpected shared Navbar dependency: ' + request);
  },
  Component: function (definition) { sharedNavbarDefinition = definition; }
}, { filename: 'miniprogram/components/component-page-navbar/component-page-navbar.js' });
var sharedNavbarRuntime = {
  data: JSON.parse(JSON.stringify(sharedNavbarDefinition.data)),
  events: [],
  setData: function (next) { Object.assign(this.data, next); },
  triggerEvent: function (name) { this.events.push(name); }
};
Object.keys(sharedNavbarDefinition.methods).forEach(function (key) { sharedNavbarRuntime[key] = sharedNavbarDefinition.methods[key]; });
sharedNavbarDefinition.lifetimes.attached.call(sharedNavbarRuntime);
sharedNavbarRuntime.onBack();
assert.deepStrictEqual(sharedNavbarRuntime.events, ['back'], '共享详情页 Navbar 返回必须真实发给页面路由');
sharedNavbarRuntime.onOpenAppearance();
assert.strictEqual(sharedNavbarRuntime.data.appearancePopupVisible, true, '共享详情页菜单必须真实打开外观 Popup');
sharedNavbarRuntime.onAppearanceSwitchChange({ currentTarget: { dataset: { setting: 'shadow' } }, detail: { checked: true } });
assert.strictEqual(sharedNavbarRuntime.data.visualConfig.shadow, true, '共享详情页阴影设置必须通过 visualConfig 回写');
sharedNavbarRuntime.onBackgroundGradientChange({ detail: { checked: true } });
assert.strictEqual(sharedNavbarRuntime.data.backgroundGradientEnabled, true, '共享详情页渐变必须真实写入画布偏好');
sharedNavbarRuntime.onFruitFlavorChange({ detail: { checked: true } });
assert.strictEqual(sharedNavbarRuntime.data.backgroundGradientEnabled, false, '共享详情页果味必须关闭页面渐变');
assert.strictEqual(sharedNavbarRuntime.data.visualConfig.bordered, false, '共享详情页果味必须真实关闭组件边框');
assert.strictEqual(sharedNavbarRuntime.data.fruitFlavorEnabled, true, '共享详情页果味必须从实际配置推导');
sharedNavbarRuntime.onResetAppearance();
assert.deepStrictEqual(sharedNavbarRuntime.data.visualConfig, { theme: 'light', effectsEnabled: true, shadow: true, frostedGlass: false, largeRadius: true, bordered: false, equalSpacing: false }, '共享详情页重置必须写回公开默认视觉配置');
assert.strictEqual(sharedNavbarRuntime.data.backgroundGradientEnabled, false, '共享详情页重置必须关闭页面背景渐变');
assert.strictEqual(sharedNavbarRuntime.data.fruitFlavorEnabled, false, '共享详情页默认配置不能伪装为果味预设');
sharedNavbarRuntime.onAppearancePopupVisibleChange({ detail: { visible: false } });
assert.strictEqual(sharedNavbarRuntime.data.appearancePopupVisible, false, '共享详情页 Popup 的遮罩或关闭请求必须真实回写');
sharedNavbarDefinition.lifetimes.detached.call(sharedNavbarRuntime);

var iconWxss = read('miniprogram/pages/components/icon/index.wxss');
assert.ok(iconWxss.indexOf('grid-template-columns: repeat(3, minmax(0, 1fr))') !== -1, 'Icon 网格必须保持三列');
assert.ok(iconWxss.indexOf('flex-direction: column') !== -1, 'Icon 网格项必须让名称位于图标下方');
assert.ok(iconWxss.indexOf('overflow-wrap: anywhere') !== -1, 'Icon 名称必须换行而不是横向溢出或截断');

var installedIconFontCatalog = require(path.join(ROOT, 'miniprogram/miniprogram_npm/poemui-miniprogram/icon/icon-font-catalog.js'));
var iconPageDefinition;
vm.runInNewContext(iconJs, {
  Object: Object,
  String: String,
  require: function (request) {
    if (request === '../../../utils/component-page') {
      return function (config) {
        return Object.assign({
          data: config.data
        }, config.methods);
      };
    }
    if (request === 'poemui-miniprogram/icon/icon-font-catalog') return installedIconFontCatalog;
    throw new Error('Unexpected Icon page dependency: ' + request);
  },
  Page: function (definition) { iconPageDefinition = definition; }
}, { filename: 'miniprogram/pages/components/icon/index.js' });
assert.strictEqual(installedIconFontCatalog.icons.length, 220, '微信 npm 字体图标目录必须包含当前 220 个真实图标');
assert.strictEqual(iconPageDefinition.data.iconCatalog.length, 220, 'Icon 页面必须把完整 npm 目录作为运行态真相源');
var iconRuntime = {
  data: JSON.parse(JSON.stringify(iconPageDefinition.data)),
  setData: function (next) { Object.assign(this.data, next); }
};
Object.keys(iconPageDefinition).forEach(function (key) {
  if (key !== 'data') iconRuntime[key] = iconPageDefinition[key];
});
iconPageDefinition.applyIconSearch.call(iconRuntime, 'arrow');
assert.deepStrictEqual(JSON.parse(JSON.stringify(iconRuntime.data.visibleIconGroups.map(function (group) {
  return [group.key, group.count];
}))), [['navigation', 5]], 'Icon 搜索必须真实过滤完整目录并保留分类');
iconPageDefinition.applyIconSearch.call(iconRuntime, '');
assert.strictEqual(iconRuntime.data.visibleIconGroups.length, 17, '清空 Icon 搜索必须恢复全部真实分类');
iconPageDefinition.applyIconSearch.call(iconRuntime, 'sheet');
assert.deepStrictEqual(JSON.parse(JSON.stringify(iconRuntime.data.visibleIconGroups.map(function (group) {
  return [group.key, group.icons.map(function (icon) { return icon.name; })];
}))), [['components', ['sheet', 'action-sheet']]], 'Icon 搜索必须从 npm Icon Font 目录中真实检索组件专属图标');
iconPageDefinition.applyIconSearch.call(iconRuntime, 'poemcoder-mark');
assert.deepStrictEqual(JSON.parse(JSON.stringify(iconRuntime.data.visibleIconGroups.map(function (group) {
  return [group.key, group.icons.map(function (icon) { return icon.name; })];
}))), [['abstract', ['poemcoder-mark']]], 'Icon 页面必须从 npm Icon Font 目录检索公开 PoemCoder Mark');

var previousWx = global.wx;
var previousPage = global.Page;
var navigateCalls = 0;
global.wx = {
  getWindowInfo: function () { return { windowHeight: 812 }; },
  onWindowResize: function () {},
  offWindowResize: function () {},
  navigateBack: function (options) {
    navigateCalls += 1;
    if (options && options.success) options.success();
  },
  reLaunch: function () {}
};

var createComponentPage = require(path.join(ROOT, 'miniprogram/utils/component-page.js'));
var page = createComponentPage({ title: 'Button' });
page.data = Object.assign({}, page.data);
page.setData = function (next) { Object.assign(page.data, next); };
page.createSelectorQuery = function () {
  return {
    select: function (selector) {
      assert.strictEqual(selector, '#component-navbar');
      return this;
    },
    boundingClientRect: function (callback) {
      callback({ height: 96 });
      return this;
    },
    exec: function () {}
  };
};
page.measureLayout();
assert.strictEqual(page.data.scrollAreaHeight, '716px');
assert.strictEqual(page.data.layoutReady, true);
page.onBack();
assert.strictEqual(navigateCalls, 1);

global.wx = previousWx;
global.Page = previousPage;

console.log('miniprogram component page contract tests passed');
require('./test-miniprogram-navigation-pages');
