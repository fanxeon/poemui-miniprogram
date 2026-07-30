'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var ROOT = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

var wxml = read('miniprogram/pages/index/index.wxml');
var wxss = read('miniprogram/pages/index/index.wxss');
var pageJs = read('miniprogram/pages/index/index.js');
var pageJson = JSON.parse(read('miniprogram/pages/index/index.json'));
var projectConfig = JSON.parse(read('miniprogram/project.config.json'));
var pagePackage = JSON.parse(read('miniprogram/package.json'));
var appJson = JSON.parse(read('miniprogram/app.json'));
var appJs = read('miniprogram/app.js');
var themeJson = JSON.parse(read('miniprogram/theme.json'));
var iconCatalog = require(path.join(ROOT, 'icon/icon-font-catalog.js'));
var packageVersion = JSON.parse(read('package.json')).version;
var distVersionSource = read('miniprogram_dist/version.js');

assert.ok(wxml.indexOf('<pui-config-provider') !== -1, '首页必须使用 ConfigProvider');
assert.ok(wxml.indexOf('use-global-config') !== -1, '首页必须接入全局视觉配置');
assert.ok(wxml.indexOf('bind:themechange="onProviderThemeChange"') !== -1, '首页必须读取 Provider 解析后的主题，以切换透明底品牌标记');
['pui-navbar', 'pui-button', 'pui-icon', 'pui-tag', 'pui-scroll-area', 'pui-collapsible', 'pui-cell', 'pui-combobox', 'pui-overlay', 'pui-popup', 'appearance-settings', 'pui-tabbar'].forEach(function (component) {
  assert.ok(wxml.indexOf('<' + component) !== -1, '首页缺少 ' + component);
});
assert.ok(wxml.indexOf('<navigation-bar') === -1, '首页不能继续引用旧 navigation-bar');
assert.ok(wxml.indexOf('bordered="{{false}}"') !== -1, '首页 Navbar 必须明确保持无底线，不依赖透明边框占位');
assert.ok(wxml.indexOf('<scroll-view') === -1, '首页只能由 pui-scroll-area 承担滚动');
assert.ok(wxml.indexOf('title="Poem UI"') !== -1, 'Navbar 标题不正确');
assert.ok(wxml.indexOf('left-arrow="{{false}}"') !== -1, 'Navbar 必须关闭返回箭头');
assert.ok(wxml.indexOf('capsule="{{true}}"') !== -1, 'Navbar 必须尊重原生胶囊');
assert.ok(/<pui-navbar[\s\S]*?fixed="\{\{false\}\}"/.test(wxml), 'Navbar 必须继续作为页面首行参与布局');
assert.ok(wxml.indexOf('<view id="home-tabbar" class="home-tabbar">') !== -1, 'Tabbar 必须保留稳定的页面语义锚点');
var homeTabbarWxml = wxml.slice(wxml.indexOf('<view id="home-tabbar"'), wxml.indexOf('</view>\n  </view>\n</pui-config-provider>'));
assert.ok(homeTabbarWxml.indexOf('theme="normal"') !== -1, '首页 Tabbar 必须使用组件 normal 短横活动形态');
assert.ok(homeTabbarWxml.indexOf('shape="normal"') !== -1, '首页 Tabbar 必须保持 normal 全宽容器形态');
assert.ok(homeTabbarWxml.indexOf('split="{{true}}"') !== -1, '首页 Tabbar 必须显式启用组件的微分隔线');
assert.ok(homeTabbarWxml.indexOf('fixed="{{true}}"') !== -1 && homeTabbarWxml.indexOf('placeholder="{{false}}"') !== -1, '首页必须通过 PUI Tabbar fixed API 固定到底部且不建立双占位');
assert.ok(wxml.indexOf('left-btn="{{navbarLeftBtn}}"') !== -1, '搜索入口必须通过 Navbar leftBtn 配置');
assert.ok(wxml.indexOf('right-btn="{{navbarRightBtn}}"') !== -1, '外观入口必须通过 Navbar rightBtn 配置');
assert.ok(wxml.indexOf('bind:leftBtn="onOpenSearch"') !== -1, '搜索按钮必须直接监听 Navbar leftBtn 事件');
assert.ok(wxml.indexOf('bind:rightBtn="onOpenAppearance"') !== -1, '外观菜单必须直接监听 Navbar rightBtn 事件');
assert.ok(pageJs.indexOf("navbarLeftBtn: { icon: 'search', ariaLabel: '搜索组件' }") !== -1, '搜索入口必须使用 PUI 搜索图标及准确名称');
assert.ok(pageJs.indexOf("navbarRightBtn: { icon: 'menu', ariaLabel: '打开外观设置' }") !== -1, '外观入口必须使用 PUI menu 图标及准确名称');
assert.ok(wxml.indexOf('<pui-search') !== -1, '首页搜索必须组合独立 pui-search');
assert.ok(wxml.indexOf('bind:change="onSearchChange"') !== -1, '独立 Search 必须真实回写页面 query');
assert.ok(wxml.indexOf('shape="round"') !== -1 && wxml.indexOf('center') !== -1, '首页 Search 必须为圆形居中版本');
assert.ok(wxml.indexOf('query="{{searchQuery}}"') === -1, 'Combobox 不得持有搜索 query');
assert.ok(wxml.indexOf('visible="{{searchComboboxVisible}}"') !== -1, '搜索 Combobox 必须由页面控制并自动展开');
assert.ok(wxml.indexOf('list-height="360"') !== -1, '首页搜索 Combobox 必须使用更紧凑的 360rpx 固定内容视口');
assert.ok(wxml.indexOf('show-panel-close') === -1, 'Combobox 不得公开内部搜索行控制');
assert.ok(wxml.indexOf('custom-footer') === -1, '搜索候选不能伪造底部操作');
assert.ok(wxml.indexOf('bind:select="onSearchSelect"') !== -1, '候选项必须真实跳转');
assert.ok(wxml.indexOf('blur') !== -1, '搜索 Overlay 必须显式开启 blur');
assert.ok(wxml.indexOf('bind:click="onSearchOverlayClick"') !== -1, '搜索 Overlay 必须有真实关闭回写');
assert.ok(wxml.indexOf('duration="{{searchOverlayDuration}}"') !== -1, 'Overlay 时长必须与延后展开共用同一页面状态');
assert.ok(wxml.indexOf('class="home-search-overlay__content" catchtap="onSearchContentTap"') !== -1, '候选交互必须阻止向 Overlay 根冒泡');
assert.ok(wxml.indexOf('visible="{{appearancePopupVisible}}"') !== -1, '外观 Popup 必须由页面受控');
assert.ok(wxml.indexOf('placement="bottom"') !== -1, '外观设置必须从底部弹出');
assert.ok(wxml.indexOf('card="{{true}}"') !== -1, '底部外观 Popup 必须使用组件自身 Card 形态');
assert.ok(wxml.indexOf('show-header') !== -1 && wxml.indexOf('title="外观"') !== -1, '外观 Popup 必须由自身 Header 承担唯一标题');
assert.ok(wxml.indexOf('close-btn') === -1, '外观 Popup 必须消费 Popup 默认常驻关闭按钮，而非重复传入同名属性');
assert.ok(wxml.indexOf('slot="header-left"') !== -1 && wxml.indexOf('icon="refresh"') !== -1 && wxml.indexOf('bind:click="onResetAppearance"') !== -1, '外观 Popup Header 左侧必须有真实 PUI 重置图标按钮');
assert.ok(wxml.indexOf('icon-only') !== -1 && wxml.indexOf('aria-label="恢复默认外观"') !== -1, '外观重置必须是可访问的纯图标 PUI Button');
assert.ok(wxml.indexOf('theme="primary"') !== -1, '外观重置必须使用 primary PUI Button 外观');
assert.ok(wxml.indexOf('blur-overlay') !== -1, '外观 Popup 必须显式启用模糊遮罩');
assert.ok(wxml.indexOf('bind:visible-change="onAppearancePopupVisibleChange"') !== -1, 'Popup 遮罩与关闭按钮必须真实回写可见状态');
assert.ok(wxml.indexOf('home-appearance-overlay__content') === -1, '外观不能继续保留页面私有 Overlay 内容容器');
assert.ok(wxml.indexOf('<appearance-settings />') !== -1, '首页与详情页必须复用共享 appearance-settings 组件');
assert.ok(fs.readFileSync(path.join(ROOT, 'miniprogram/components/appearance-settings/appearance-settings.wxml'), 'utf8').indexOf('title="间距相等"') !== -1, '共享外观设置必须包含等距开关');
var appearanceWxml = fs.readFileSync(path.join(ROOT, 'miniprogram/components/appearance-settings/appearance-settings.wxml'), 'utf8');
['果味', '边框', '阴影', '毛玻璃', '大圆角', '间距相等', '渐变', '深色'].forEach(function (label) {
  assert.ok(appearanceWxml.indexOf('title="' + label + '"') !== -1, '外观面板缺少 ' + label + ' 设置');
});
assert.ok(appearanceWxml.indexOf('bind:change="onFruitFlavorChange"') !== -1, '果味必须真实回写预设');
assert.ok(appearanceWxml.indexOf('bind:change="onAppearanceSwitchChange"') !== -1, '组件视觉开关必须真实回写 Store');
assert.ok(appearanceWxml.indexOf('bind:change="onBackgroundGradientChange"') !== -1, '渐变开关必须真实回写页面画布设置');
assert.ok(wxml.indexOf('height="{{scrollAreaHeight}}"') !== -1, 'ScrollArea 必须消费动态高度');
assert.ok(wxml.indexOf('height="320rpx"') === -1, '首页不能使用 ScrollArea 默认高度');
assert.ok(wxml.indexOf('title="Poem UI"') !== -1 && wxml.indexOf('bind:leftBtn="onOpenSearch"') !== -1 && wxml.indexOf('bind:rightBtn="onOpenAppearance"') !== -1, '版头重构不得改变现有 Navbar 的标题与两个真实入口');
assert.ok(wxml.indexOf('class="home-brand__headline"') !== -1, '首页版头必须建立左文右图的独立头部轨道');
assert.ok(wxml.indexOf('class="home-brand__name">Poem UI</text>') !== -1, '首页版头必须保留 Poem UI 品牌名');
assert.ok(wxml.indexOf('content="{{currentVersion}}"') !== -1 && wxml.indexOf("aria-label=\"{{'当前版本 ' + currentVersion}}\"") !== -1, '首页品牌名旁必须通过 PUI Tag 展示当前版本');
assert.ok(pageJs.indexOf("var poemuiVersion = require('poemui-miniprogram/version');") !== -1 && pageJs.indexOf("currentVersion: 'v' + poemuiVersion") !== -1, '首页版本必须读取 npm 轻量 version 子入口，不能加载组件总入口或维护第二份版本字符串');
assert.ok(distVersionSource.indexOf('module.exports = ' + JSON.stringify(packageVersion)) !== -1, '发布 version 子入口必须由 package.json.version 生成');
assert.ok(wxml.indexOf('class="home-brand__stanza">月下成行</text>') !== -1, '首页版头必须保留月下成行品牌语义');
assert.ok(wxml.indexOf('class="home-brand__description">面向 AI 的原生小程序组件库。</text>') !== -1, '首页版头必须明确面向 AI 的原生组件库定位');
assert.ok(wxml.indexOf('src="{{brandMark}}"') !== -1 && wxml.indexOf('width="144rpx"') !== -1 && wxml.indexOf('height="144rpx"') !== -1, '首页版头必须通过更紧凑的 PUI Image 呈现完整月下成行标记');
assert.ok(wxml.indexOf('catalogSummary.componentCount') !== -1 && wxml.indexOf('catalogSummary.guideCount') !== -1, '首页目录统计必须读取同一份目录数据');
assert.ok(pageJs.indexOf('function makeCatalogSummary()') !== -1 && pageJs.indexOf('function brandMarkForTheme(theme)') !== -1, '首页必须从目录真相源生成统计信息并按真实主题选择透明底品牌标记');
assert.ok(fs.existsSync(path.join(ROOT, 'miniprogram/assets/poemui-moon-lines-mark-dark.png')) && fs.existsSync(path.join(ROOT, 'miniprogram/assets/poemui-moon-lines-mark-light.png')), '首页必须同时保留黑白两张透明底完整品牌标记');
assert.ok(wxml.indexOf('slot="content"') === -1, 'Collapsible 内容必须使用默认 Slot');
assert.ok(pageJs.indexOf("label: '浮层'") !== -1, '首页必须新增浮层分区');
assert.ok(pageJs.indexOf("label: '导航'") !== -1, '首页必须新增导航分区');
assert.ok(
  pageJs.indexOf("{ key: 'basic', label: '基础组件'") < pageJs.indexOf("{ key: 'overlay', label: '浮层'") &&
  pageJs.indexOf("{ key: 'overlay', label: '浮层'") < pageJs.indexOf("{ key: 'layout', label: '布局'"),
  '浮层分区必须紧接在基础组件之后'
);
assert.ok(wxml.indexOf('activeCatalogSection === section.key') !== -1, '首页分区必须由单一活动状态受控');
assert.ok(wxml.indexOf('data-section="{{section.key}}"') !== -1, '首页分区必须传递互斥状态键');
assert.ok(wxml.indexOf('scroll-into-view="{{homeScrollIntoView}}"') !== -1, '首页必须通过 ScrollArea 公开 API 恢复上次分区位置');
assert.ok(wxml.indexOf('<view id="home-section-{{section.key}}" class="home-components">') !== -1, '每个首页分区必须在 ScrollArea Slot 内提供可被原生 scroll-view 识别的 view 锚点');
assert.ok(wxml.indexOf('<pui-collapsible\n                id="home-section-{{section.key}}"') === -1, '滚动锚点不得只挂在自定义组件宿主上');
assert.ok(wxml.indexOf('duration="{{catalogSectionMotionDuration}}"') !== -1, '首页必须向 Collapsible 显式传递与定位等待相同的动效时长');
assert.ok(/<pui-collapsible[\s\S]*?open="\{\{activeCatalogSection === section\.key\}\}"[\s\S]*?\n\s+shadow(?:\s|\n)/.test(wxml), '首页分区必须通过 Collapsible 公共 shadow 能力让唯一展开 Surface 跟随外观设置');
assert.ok(pageJs.indexOf('var HOME_CATALOG_SECTION_MOTION_DURATION = 500;') !== -1, '首页分区定位必须复用 Collapsible 的明确 500ms 动效时长');
assert.ok(pageJs.indexOf('var HOME_CATALOG_SECTION_TOP_OFFSET_RPX = 48;') !== -1, '首页分区标题必须保留 PUI 48rpx 顶部阅读留白');
assert.ok(pageJs.indexOf('this.scheduleCatalogSectionScroll(section, HOME_CATALOG_SECTION_MOTION_DURATION);') !== -1, '用户打开分区后必须等待互斥开合完成再测量标题位置');
assert.ok(pageJs.indexOf("query.select('.home-scroll-row').boundingClientRect();") !== -1, '首页分区滚动必须测量真实 ScrollArea 视口');
assert.ok(pageJs.indexOf("query.select('#home-section-' + section).boundingClientRect();") !== -1, '首页分区滚动必须测量真实标题锚点');
assert.ok(pageJs.indexOf('HOME_CATALOG_SECTION_TOP_OFFSET_RPX * Math.max(0, Number(getWindowWidth()) || 0) / 750') !== -1, '首页分区顶部留白必须按真实窗口宽度将 48rpx 转为 px');
assert.ok(pageJs.indexOf('currentScrollTop + Number(sectionRect.top) - Number(viewportRect.top) - topOffsetPx') !== -1, '首页分区滚动必须基于当前真实位置与顶部留白计算目标 scrollTop');
assert.ok(pageJs.indexOf("hasPremiumIcon: true") !== -1, '高级分区必须提供单一数据标记，避免 WXML 内联比较造成 Slot 组合漂移');
assert.ok(wxml.indexOf('custom-trigger="{{section.hasPremiumIcon}}"') !== -1, '高级分区必须通过 Collapsible 真实 trigger Slot 承载专属标题组合');
assert.ok(wxml.indexOf('wx:if="{{section.hasPremiumIcon}}" slot="trigger"') !== -1, '高级图标 Slot 必须与同一数据标记联动');
assert.ok(wxml.indexOf('slot="trigger" class="home-components__advanced-trigger"') !== -1, '高级分区图标必须位于 trigger Slot，不能另建页面标题');
assert.ok(wxml.indexOf('<pui-icon name="premium" size="30" custom-class="home-components__advanced-icon" />') !== -1, '高级标题右侧必须使用公开 PUI premium 图标');
assert.ok(/\.home-components__advanced-trigger\s*\{[\s\S]*?gap:\s*var\(--pui-space-xs\);[\s\S]*?color:\s*var\(--pui-text-primary\);/.test(wxss), '高级标题组合必须使用现有 Token 管理间距与前景色');
assert.ok(/\.home-components__advanced-label\s*\{[\s\S]*?font-size:\s*var\(--pui-font-size-medium\);[\s\S]*?font-weight:\s*var\(--pui-font-weight-semibold\);/.test(wxss), '自定义 trigger 标题必须保持 Collapsible 的文字层级');
var advancedIconRule = wxss.match(/\.home-components__advanced-icon\s*\{([\s\S]*?)\}/);
assert.ok(advancedIconRule, '高级标题必须保留单独的图标类用于收缩边界');
assert.ok(!/\b(?:transform|margin|top|bottom)\s*:/.test(advancedIconRule[1]), '首页不得用页面偏移修补 premium 基线，光学校正必须归属 Icon 生成链');
assert.ok(pageJs.indexOf('if (this.data.homeScrollTop !== scrollTop) this.setData({ homeScrollTop: scrollTop });') !== -1, '首页真实滚动必须同步受控位置，返回时不能退回旧锚点');
assert.ok(pageJs.indexOf('catalogSections: CATALOG_SECTIONS') !== -1, '首页目录必须按分区组织');
assert.ok(pageJs.indexOf("activeCatalogSection: ''") !== -1, '首页初始不应抢占用户视线展开任何分区');
assert.ok(pageJs.indexOf("var HOME_CATALOG_SECTION_STORAGE_KEY = 'poemui.home.activeCatalogSection';") !== -1, '首页分区记忆必须使用稳定本地存储键');
assert.ok(pageJs.indexOf('var HOME_OVERLAY_AUTO_EXPAND_DELAY = 2000;') !== -1, '首页浮层必须在两秒后展开');
assert.ok(pageJs.indexOf('CATALOG_SECTIONS.reduce(function flatten') !== -1, '首页搜索必须从全部已发布组件分区汇集候选项，而不是只取基础组件');
assert.ok(pageJs.indexOf('Math.random()') !== -1, '首页每次打开搜索必须随机排列组件候选项');
assert.ok(wxml.indexOf('arrow') !== -1, '组件 Cell 必须显示 chevron-right');
assert.ok(wxml.indexOf('clickable') !== -1, '组件 Cell 必须启用真实点击门禁');
assert.ok(wxml.indexOf('jump-type="navigateTo"') !== -1, '组件 Cell 必须使用真实 navigateTo');
['Button', 'Divider', 'Icon'].forEach(function (name) {
  assert.ok(pageJs.indexOf("name: '" + name + "'") !== -1, '基础组件目录缺少 ' + name);
});
assert.ok(pageJs.indexOf("name: 'Popup'") !== -1, '浮层目录缺少 Popup');
assert.ok(pageJs.indexOf("label: '浮层'") !== -1, '首页目录缺少浮层分区');
assert.ok(pageJs.indexOf("label: '导航'") !== -1, '首页目录缺少导航分区');
[
  ['button', 'Button'],
  ['divider', 'Divider'],
  ['icon', 'Icon'],
  ['menu', 'Navbar'],
  ['layers', 'NavigationMenu'],
  ['list-bullet', 'Tabs'],
  ['route', 'Breadcrumb'],
  ['navigation-pointer', 'Tabbar'],
  ['list-number', 'Steps'],
  ['arrow-up', 'BackTop'],
  ['sidebar-left', 'SideBar'],
  ['popup', 'Popup'],
  ['popover', 'Popover'],
  ['sheet', 'Sheet'],
  ['action-sheet', 'ActionSheet'],
  ['dropdown-menu', 'DropdownMenu'],
  ['overlay', 'Overlay'],
  ['scroll-area', 'ScrollArea'],
  ['dialog', 'Dialog'],
  ['badge', 'Badge'],
  ['panel-top', 'Card'],
  ['tag', 'Tag'],
  ['cell', 'Cell'],
  ['list-bullet', 'List'],
  ['rows', 'Collapse'],
  ['chevron-down', 'Collapsible'],
  ['message', 'Bubble'],
  ['swipe-cell', 'SwipeCell'],
  ['clock', 'CountDown'],
  ['gallery-horizontal', 'Swiper'],
  ['table', 'Table']
].forEach(function (item) {
  var icon = item[0];
  var name = item[1];
  var itemPattern = new RegExp("name: '" + name + "'[\\s\\S]*?icon: '" + icon + "'");
  assert.ok(itemPattern.test(pageJs), name + ' 目录必须使用对应的专属 PUI Icon：' + icon);
});
var publishedIconNames = new Set(iconCatalog.icons.map(function (icon) { return icon.name; }));
var homepageIconNames = Array.from(pageJs.matchAll(/icon: '([^']+)'/g)).map(function (match) { return match[1]; });
assert.deepStrictEqual(
  homepageIconNames.filter(function (name) { return !publishedIconNames.has(name); }),
  [],
  '首页目录不得引用真实 Icon Font 目录之外的名称'
);
[
  'pages/components/button/index',
  'pages/components/divider/index',
  'pages/components/icon/index',
  'pages/components/aspect-ratio/index',
  'pages/components/direction/index',
  'pages/components/grid/index',
  'pages/components/scroll-area/index',
  'pages/components/sticky/index',
  'pages/components/navbar/index',
  'pages/components/navigation-menu/index',
  'pages/components/tabs/index',
  'pages/components/breadcrumb/index',
  'pages/components/tabbar/index',
  'pages/components/steps/index',
  'pages/components/back-top/index',
  'pages/components/indexes/index',
  'pages/components/sidebar/index',
  'pages/components/alert/index',
  'pages/components/empty/index',
  'pages/components/loading/index',
  'pages/components/notice-bar/index',
  'pages/components/progress/index',
  'pages/components/result/index',
  'pages/components/skeleton/index',
  'pages/components/toast/index',
  'pages/components/dialog/index',
  'pages/components/popup/index',
  'pages/components/popover/index',
  'pages/components/sheet/index',
  'pages/components/action-sheet/index',
  'pages/components/dropdown-menu/index',
  'pages/components/overlay/index'
  ,'pages/components/top-loading/index'
  ,'pages/components/dynamic-message/index'
  ,'pages/components/pull-refresh/index'
  ,'pages/components/virtual-list/index'
  ,'pages/components/watermark/index'
  ,'pages/components/avatar/index'
  ,'pages/components/badge/index'
  ,'pages/components/card/index'
  ,'pages/components/image/index'
  ,'pages/components/tag/index'
  ,'pages/components/cell/index'
  ,'pages/components/list/index'
  ,'pages/components/collapse/index'
  ,'pages/components/collapsible/index'
  ,'pages/components/bubble/index'
  ,'pages/components/swipe-cell/index'
  ,'pages/components/count-down/index'
  ,'pages/components/swiper/index'
  ,'pages/components/table/index'
  ,'pages/components/form/index'
  ,'pages/components/field/index'
  ,'pages/components/label/index'
  ,'pages/components/input/index'
  ,'pages/components/input-otp/index'
  ,'pages/components/textarea/index'
  ,'pages/components/search/index'
  ,'pages/components/checkbox/index'
  ,'pages/components/radio/index'
  ,'pages/components/switch/index'
  ,'pages/components/select/index'
  ,'pages/components/picker/index'
  ,'pages/components/combobox/index'
  ,'pages/components/slider/index'
  ,'pages/components/stepper/index'
  ,'pages/components/rate/index'
  ,'pages/components/calendar/index'
  ,'pages/components/date-time-picker/index'
  ,'pages/components/upload/index'
  ,'pages/components/config-provider/index'
].forEach(function (route) {
  assert.ok(appJson.pages.indexOf(route) !== -1, 'app.json 缺少真实组件页面 ' + route);
  assert.ok(pageJs.indexOf("url: '/" + route + "'") !== -1, '首页目录缺少真实组件 URL ' + route);
});
[
  'pages/guides/getting-started/index',
  'pages/guides/theme-tokens/index',
  'pages/guides/color/index',
  'pages/guides/spacing/index',
  'pages/guides/typography/index'
].forEach(function (route) {
  assert.ok(appJson.pages.indexOf(route) !== -1, 'app.json 缺少真实规范页面 ' + route);
  assert.ok(pageJs.indexOf("url: '/" + route + "'") !== -1, '首页目录缺少真实规范 URL ' + route);
});
assert.ok(pageJs.indexOf("tabbarNavigation.getItems()") !== -1, '首页 Tabbar 必须复用共享目的地配置');
assert.ok(pageJs.indexOf("tabbarNavigation.navigateToTab(value, this.data.activeTab)") !== -1, '首页 Tabbar 必须由页面消费者执行真实路由');
assert.ok(pageJs.indexOf('Typography') === -1, '首页不能伪造 Typography 入口');
['onOpenSearch', 'onSearchOverlayClick', 'onSearchChange', 'onSearchVisibleInput', 'onSearchSelect', 'onSearchContentTap', 'onOpenAppearance', 'onAppearancePopupVisibleChange', 'onAppearanceSwitchChange', 'onBackgroundGradientChange', 'onFruitFlavorChange', 'onResetAppearance', 'syncAppearanceState', 'onProviderThemeChange', 'scheduleOverlayAutoExpand', 'onCatalogSectionChange'].forEach(function (method) {
  assert.ok(pageJs.indexOf(method + ': function') !== -1, '首页缺少真实交互方法 ' + method);
});
assert.ok(pageJs.indexOf('getWindowInfo') !== -1, '首页必须读取真实窗口高度');
assert.ok(pageJs.indexOf('tabbarPageLayout.getLayout()') !== -1 && pageJs.indexOf('tabbarPageLayout.getContentHeight()') !== -1, '首页必须通过共享 helper 同步计算首帧与窗口变化后的高度');
assert.ok(pageJs.indexOf("select('#home-navbar')") === -1 && pageJs.indexOf("select('#home-tabbar')") === -1, '首页不得再对 Navbar/Tabbar 执行二次页面测高');
assert.ok(wxss.indexOf('var(--pui-') !== -1, '首页样式必须使用 PUI Token');
assert.ok(wxss.indexOf('#') === -1, '首页样式不能写入私有颜色');
assert.ok(wxss.indexOf('.home-page--gradient') !== -1, '渐变只能由首页画布 class 承担');
assert.ok(wxss.indexOf('linear-gradient(145deg, var(--pui-bg-page), var(--pui-bg-muted))') !== -1, '首页渐变必须只消费页面 Token');
assert.ok(wxss.indexOf('.home-navbar-actions') === -1 && wxss.indexOf('.home-navbar-action') === -1, 'Navbar 双操作几何必须由共享组件承载，首页不得保留私有轨道样式');
assert.ok(wxss.indexOf('.home-tabbar {\n  min-width: 0;\n}') !== -1, '全宽 Tabbar 容器只保留收缩约束，不写页面私有视觉补丁');
assert.ok(wxss.indexOf('.home-brand__headline') !== -1 && wxss.indexOf('justify-content: space-between;') !== -1, '首页版头必须保持左文右图而非居中题牌');
assert.ok(wxml.indexOf('custom-style="background: transparent; border: 0;"') !== -1, '首页版头右侧 PUI Image 必须在自身根内清除默认灰底与边框，露出透明底原 Logo');
assert.ok(wxss.indexOf('filter:') === -1, '首页深色主题必须切换透明底白色资产，不能依赖未确认的滤镜兼容性');
assert.ok(wxss.indexOf('padding: var(--pui-panel-padding) var(--pui-space-step-28) var(--pui-content-gap);') !== -1 && wxss.indexOf('gap: var(--pui-content-gap);') !== -1, '首页版头必须以较小的顶部与底部 Token 收紧留白，为目录内容腾出空间');
var catalogStylesStart = wxss.indexOf('.home-brand__catalog {');
var catalogStyles = wxss.slice(catalogStylesStart, wxss.indexOf('}', catalogStylesStart));
assert.ok(catalogStyles.indexOf('margin-top:') === -1, '目录统计必须紧接产品描述，不能额外制造纵向留白');
assert.ok(wxss.indexOf('.home-brand {') < wxss.indexOf('.home-components,'), '首页版头样式必须与目录样式分离，不能覆盖 Collapsible');
assert.ok(wxss.indexOf('.home-brand {\n  --home-brand-muted: var(--pui-text-secondary);') !== -1, '首页版头必须先定义同主题的辅助文字 Token');
var overlayContentStart = wxss.indexOf('.home-search-overlay__content');
var overlayContentStyles = wxss.slice(overlayContentStart, wxss.indexOf('}', overlayContentStart));
assert.ok(overlayContentStyles.indexOf('position: absolute') !== -1, 'Overlay Slot 内容只能包裹自身，不能占满遮罩');
assert.ok(overlayContentStyles.indexOf('min-height: 100%') === -1, 'Overlay Slot 内容占满全屏会阻断空白遮罩关闭');
assert.ok(wxss.indexOf('.home-search-input,\n.home-search-combobox {\n  align-self: stretch;\n  width: 100%;\n  max-width: 100%;\n}') !== -1, '圆形居中 Search 与 Combobox 必须共享同一条全宽轨道，左右边界一致');
assert.ok(wxss.indexOf('max-width: 640rpx') === -1, 'Search 不得在首页额外缩窄，避免与 Combobox 产生不等左右间距');
assert.strictEqual(pageJson.usingComponents['pui-navbar'], 'poemui-miniprogram/navbar/navbar');
assert.strictEqual(pageJson.usingComponents['pui-image'], 'poemui-miniprogram/image/image');
assert.strictEqual(pageJson.usingComponents['pui-tag'], 'poemui-miniprogram/tag/tag');
assert.strictEqual(pageJson.usingComponents['pui-button'], 'poemui-miniprogram/button/button');
assert.strictEqual(pageJson.usingComponents['pui-cell-group'], 'poemui-miniprogram/cell/cell-group');
assert.strictEqual(pageJson.usingComponents['pui-switch'], 'poemui-miniprogram/switch/switch');
assert.strictEqual(pageJson.usingComponents['pui-search'], 'poemui-miniprogram/search/search');
assert.strictEqual(pageJson.usingComponents['pui-combobox'], 'poemui-miniprogram/combobox/combobox');
assert.strictEqual(pageJson.usingComponents['pui-overlay'], 'poemui-miniprogram/overlay/overlay');
assert.strictEqual(pageJson.usingComponents['pui-popup'], 'poemui-miniprogram/popup/popup');
assert.strictEqual(pageJson.usingComponents['pui-tabbar'], 'poemui-miniprogram/tabbar/tabbar');
assert.strictEqual(Object.prototype.hasOwnProperty.call(pageJson, 'enableShareTimeline'), false, '当前微信页面 JSON 不接受 enableShareTimeline，首页必须只通过 Page 生命周期声明分享');
assert.ok(pageJs.indexOf('onShareAppMessage: function') !== -1, '首页必须保留发送给朋友的 Page 生命周期');
assert.ok(pageJs.indexOf('onShareTimeline: function') !== -1, '首页必须保留朋友圈分享的 Page 生命周期');
assert.strictEqual(
  pagePackage.dependencies['poemui-miniprogram'],
  '0.1.4',
  '真实产品小程序清单必须固定消费 Registry 发布版 0.1.4'
);
assert.ok(pagePackage.dependencies['poemui-miniprogram'].indexOf('file:') !== 0, '真实产品小程序清单不得为了本地开发改成不可复现的 file: 依赖');
assert.strictEqual(packageVersion, '0.1.4', '组件包与真实产品小程序清单必须统一为 0.1.4');
assert.ok(appJs.indexOf("require('poemui-miniprogram/common/utils/visual-config')") !== -1, 'App 必须通过 npm 包路径恢复 visualConfig');
assert.ok(appJs.indexOf("require('poemui-miniprogram/common/utils/theme')") !== -1, 'App 必须复用发布包 theme helper 读取当前系统主题');
assert.strictEqual(appJson.darkmode, true, '真实小程序必须启用微信 DarkMode，系统主题事件才会触发');
assert.strictEqual(appJson.themeLocation, 'theme.json', 'DarkMode 必须指向真实 theme.json');
assert.deepStrictEqual(Object.keys(themeJson).sort(), ['dark', 'light'], 'theme.json 必须同时声明 light 与 dark 变量');
assert.strictEqual(appJson.window.navigationBarTextStyle, '@navigationBarTextStyle');
assert.strictEqual(appJson.window.backgroundColor, '@backgroundColor');
assert.strictEqual(appJson.window.backgroundTextStyle, '@backgroundTextStyle');
assert.strictEqual(themeJson.light.navigationBarTextStyle, 'black');
assert.strictEqual(themeJson.dark.navigationBarTextStyle, 'white');
assert.strictEqual(themeJson.light.backgroundColor, '#ffffff');
assert.strictEqual(themeJson.dark.backgroundColor, '#09090b');
assert.strictEqual(appJson.renderer, undefined, '当前小程序只支持默认 WebView，不能启用 Skyline renderer');
assert.strictEqual(appJson.rendererOptions, undefined, '当前小程序不能保留 Skyline rendererOptions');
assert.strictEqual(appJson.componentFramework, undefined, '当前小程序不能启用 glass-easel 组件框架');
assert.strictEqual(projectConfig.appid, 'wx23aa017375535746');
assert.strictEqual(projectConfig.setting.packNpmManually, true);
assert.strictEqual(projectConfig.setting.packNpmRelationList[0].packageJsonPath, './package.json');

var capturedApp = null;
var appVisualTheme = 'light';
var appVisualCalls = [];
var appVisualListeners = [];
var nativeBackgroundCalls = [];
var systemTheme = 'dark';
vm.runInNewContext(appJs, {
  App: function App(definition) { capturedApp = definition; },
  wx: {
    setBackgroundColor: function setBackgroundColor(options) {
      nativeBackgroundCalls.push(options);
    }
  },
  require: function requireAppDependency(request) {
    if (request === 'poemui-miniprogram/common/utils/visual-config') {
      return {
        restore: function restore() {
          appVisualCalls.push({ type: 'restore' });
          return { config: { theme: appVisualTheme }, restored: true, error: null };
        },
        set: function set(patch, options) {
          appVisualTheme = patch.theme;
          appVisualCalls.push({ type: 'set', patch: patch, options: options });
          appVisualListeners.slice().forEach(function notify(listener) {
            listener({ theme: appVisualTheme });
          });
          return { config: { theme: appVisualTheme }, changed: true, persisted: options.persist !== false, error: null };
        },
        subscribe: function subscribe(listener) {
          appVisualListeners.push(listener);
          listener({ theme: appVisualTheme });
          return function unsubscribe() {};
        }
      };
    }
    if (request === 'poemui-miniprogram/common/utils/theme') {
      return {
        getSystemTheme: function getSystemTheme() { return systemTheme; },
        resolveTheme: function resolveTheme(theme) { return theme === 'dark' ? 'dark' : 'light'; }
      };
    }
    throw new Error('Unexpected app dependency: ' + request);
  }
}, { filename: 'miniprogram/app.js' });
assert.ok(capturedApp, 'App runtime definition must be registered');
capturedApp.onLaunch();
assert.deepStrictEqual(appVisualCalls.map(function callType(call) { return call.type; }), ['restore', 'set'], 'launch must restore the Store before applying the current system theme');
assert.strictEqual(appVisualTheme, 'dark', 'launch must resolve the current system dark theme into the shared visual state');
assert.strictEqual(appVisualCalls[1].options.persist, false, 'system-derived theme must not overwrite the user storage record');
assert.strictEqual(nativeBackgroundCalls[nativeBackgroundCalls.length - 1].backgroundColor, '#09090b', '冷启动必须在页面组件挂载前把微信原生窗口背景同步为深色');
assert.strictEqual(nativeBackgroundCalls[nativeBackgroundCalls.length - 1].backgroundColorTop, '#09090b', '冷启动必须同步原生窗口顶部深色背景');
assert.strictEqual(nativeBackgroundCalls[nativeBackgroundCalls.length - 1].backgroundColorBottom, '#09090b', '冷启动必须同步原生窗口底部深色背景');
systemTheme = 'light';
capturedApp.onShow();
assert.strictEqual(appVisualTheme, 'light', 'returning to the miniprogram must re-read and apply the current system theme');
assert.strictEqual(nativeBackgroundCalls[nativeBackgroundCalls.length - 1].backgroundColor, '#ffffff', '回到前台切为浅色时必须同步原生窗口背景');
capturedApp.onThemeChange({ theme: 'dark' });
assert.strictEqual(appVisualTheme, 'dark', 'App.onThemeChange must update the Store so Appearance settings and every Provider stay synchronized');
assert.strictEqual(nativeBackgroundCalls[nativeBackgroundCalls.length - 1].backgroundColor, '#09090b', '系统切换深色时必须先同步原生窗口背景');
capturedApp.onThemeChange({ theme: 'unexpected' });
assert.strictEqual(appVisualTheme, 'light', 'invalid theme events must fail closed to light');

var capturedPage;
var navigations = [];
var timers = [];
var visualState = {
  theme: 'light',
  effectsEnabled: true,
  shadow: true,
  frostedGlass: false,
  largeRadius: true,
  bordered: false,
  equalSpacing: false
};
var visualListeners = [];
var canvasGradient = false;
var canvasListeners = [];
var tabbarNavigationCalls = [];
var storage = {};
var tabbarNavigationMock = {
  getItems: function () {
    return [
      { label: '', value: 'home', icon: 'home', ariaLabel: '首页' },
      { label: '', value: 'styles', icon: 'palette', ariaLabel: '快速样式' },
      { label: '', value: 'codex', icon: 'code', ariaLabel: 'Codex' },
      { label: '', value: 'me', icon: 'user', ariaLabel: '我的' }
    ];
  },
  navigateToTab: function (value, activeTab) {
    tabbarNavigationCalls.push({ value: value, activeTab: activeTab });
    return value !== activeTab;
  }
};
var visualConfigMock = {
  get: function () { return Object.assign({}, visualState); },
  restore: function () { return { config: this.get(), restored: true, error: null }; },
  set: function (patch) {
    Object.keys(patch || {}).forEach(function (key) { visualState[key] = patch[key]; });
    visualListeners.slice().forEach(function (listener) { listener(Object.assign({}, visualState)); });
    return { config: Object.assign({}, visualState), changed: true, persisted: true, error: null };
  },
  reset: function () {
    visualState = { theme: 'light', effectsEnabled: true, shadow: true, frostedGlass: false, largeRadius: true, bordered: false, equalSpacing: false };
    visualListeners.slice().forEach(function (listener) { listener(Object.assign({}, visualState)); });
    return { config: Object.assign({}, visualState), changed: true, persisted: true, error: null };
  },
  subscribe: function (listener) {
    visualListeners.push(listener);
    listener(Object.assign({}, visualState));
    return function () { visualListeners = visualListeners.filter(function (entry) { return entry !== listener; }); };
  }
};
var backgroundPreferenceMock = {
  get: function () { return canvasGradient; },
  restore: function () { return { value: canvasGradient, restored: true, error: null }; },
  set: function (next) {
    canvasGradient = Boolean(next);
    canvasListeners.slice().forEach(function (listener) { listener(canvasGradient); });
    return { value: canvasGradient, changed: true, persisted: true, error: null };
  },
  subscribe: function (listener) {
    canvasListeners.push(listener);
    listener(canvasGradient);
    return function () { canvasListeners = canvasListeners.filter(function (entry) { return entry !== listener; }); };
  }
};
var sandbox = {
  wx: {
    getWindowInfo: function () { return { windowHeight: 812, windowWidth: 390 }; },
    onWindowResize: function () {},
    offWindowResize: function () {},
    navigateTo: function (options) { navigations.push(options); },
    getStorageSync: function (key) { return storage[key]; },
    setStorageSync: function (key, value) { storage[key] = value; }
  },
  require: function (request) {
    if (request === 'poemui-miniprogram/version') return packageVersion;
    if (request === 'poemui-miniprogram/common/utils/visual-config') return visualConfigMock;
    if (request === 'poemui-miniprogram/common/utils/tabbar-page-layout') {
      return {
        getLayout: function () {
          return { navbarHeight: 87, tabbarHeight: 92, contentHeightStyle: '665px' };
        },
        getContentHeight: function () { return '665px'; }
      };
    }
    if (request === '../../common/utils/page-background-preference') return backgroundPreferenceMock;
    if (request === '../../common/utils/tabbar-navigation') return tabbarNavigationMock;
    throw new Error('Unexpected page dependency: ' + request);
  },
  Page: function (definition) { capturedPage = definition; },
  setTimeout: function (callback, delay) {
    var timer = { callback: callback, delay: delay, cleared: false };
    timers.push(timer);
    return timer;
  },
  clearTimeout: function (timer) {
    if (timer) timer.cleared = true;
  }
};
vm.runInNewContext(pageJs, sandbox, { filename: 'miniprogram/pages/index/index.js' });
assert.ok(capturedPage, '首页必须注册 Page');
assert.strictEqual(capturedPage.data.currentVersion, 'v' + packageVersion, '首页运行态版本必须读取当前包版本并保留 v 前缀');
capturedPage.data = Object.assign({}, capturedPage.data);
capturedPage.setData = function (next) { Object.assign(capturedPage.data, next); };
capturedPage.onLoad();
assert.strictEqual(capturedPage.data.activeCatalogSection, '', '首页初显不应立即展开浮层');
capturedPage.onShow();
var overlayAutoExpandTimer = timers.filter(function (timer) { return timer.delay === 2000; }).pop();
assert.ok(overlayAutoExpandTimer, '首页进入后必须安排浮层两秒延迟展开');
overlayAutoExpandTimer.callback();
assert.strictEqual(capturedPage.data.activeCatalogSection, 'overlay', '首页可见两秒后必须自动展开浮层分区');
capturedPage._overlayAutoExpanded = false;
capturedPage._catalogSectionInteracted = false;
capturedPage._overlayAutoExpandTimer = null;
capturedPage.setData({ activeCatalogSection: '' });
capturedPage.scheduleOverlayAutoExpand();
var manuallyCancelledAutoExpandTimer = timers.filter(function (timer) { return timer.delay === 2000; }).pop();
capturedPage.onCatalogSectionChange({ currentTarget: { dataset: { section: 'basic' } }, detail: { open: true } });
assert.strictEqual(manuallyCancelledAutoExpandTimer.cleared, true, '用户先切换分区时必须取消自动展开定时器');
manuallyCancelledAutoExpandTimer.callback();
assert.strictEqual(capturedPage.data.activeCatalogSection, 'basic', '已手动选择基础组件后不得被自动浮层覆盖');
assert.strictEqual(storage['poemui.home.activeCatalogSection'], 'basic', '用户打开的分区必须写入本地记忆');
capturedPage._homeScrollTop = 240;
capturedPage.setData({ homeScrollTop: 240 });
capturedPage.createSelectorQuery = function () {
  var query = {
    select: function () { return query; },
    boundingClientRect: function () { return query; },
    exec: function (callback) { callback([{ top: 120 }, { top: 420 }]); }
  };
  return query;
};
var manualSectionScrollTimer = timers.filter(function (timer) { return timer.delay === 500 && !timer.cleared; }).pop();
assert.ok(manualSectionScrollTimer, '用户打开分区后必须等待 Collapsible 动效完成再安排 ScrollArea 定位');
manualSectionScrollTimer.callback();
assert.strictEqual(capturedPage.data.homeScrollTop, 515, '打开分区后必须用实测坐标把对应标题定位到 ScrollArea 顶部以下 48rpx');
assert.strictEqual(capturedPage.data.homeScrollIntoView, '', '实测 scrollTop 定位不得残留跨组件 Slot 不可靠的 scrollIntoView 目标');
capturedPage._catalogSectionInteracted = false;
capturedPage._overlayAutoExpandTimer = null;
capturedPage.setData({ activeCatalogSection: '' });
capturedPage.scheduleOverlayAutoExpand();
var hiddenAutoExpandTimer = timers.filter(function (timer) { return timer.delay === 2000; }).pop();
capturedPage.onHide();
assert.strictEqual(hiddenAutoExpandTimer.cleared, true, '首页隐藏时必须取消未触发的自动展开定时器');
assert.strictEqual(capturedPage._overlayAutoExpandTimer, null, '首页隐藏后不得残留自动展开定时器');
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(capturedPage.onShareAppMessage())),
  {
    title: 'Poem UI · 原生小程序组件库',
    path: '/pages/index/index',
    imageUrl: '/assets/poemui-moon-lines-black.png'
  },
  '首页分享给好友必须回到首页并使用应用内品牌图'
);
assert.deepStrictEqual(
  JSON.parse(JSON.stringify(capturedPage.onShareTimeline())),
  {
    title: 'Poem UI · 原生小程序组件库',
    imageUrl: '/assets/poemui-moon-lines-black.png'
  },
  '首页分享到朋友圈必须使用同一品牌标题和图片'
);
assert.strictEqual(capturedPage.data.tabbarItems.length, 4, '首页 Tabbar 必须有四个等宽目的地');
assert.deepStrictEqual(capturedPage.data.tabbarItems, tabbarNavigationMock.getItems(), '首页必须读取共享的四个真实目的地');
assert.strictEqual(capturedPage.data.scrollAreaHeight, '665px');
assert.strictEqual(capturedPage.data.layoutReady, true, '首页首帧必须直接挂载 ScrollArea，不能等待异步测高');
assert.strictEqual(capturedPage.syncPageLayout(), false, '同步几何未变化时不得重复 setData 触发布局');
capturedPage.onOpenSearch();
assert.strictEqual(capturedPage.data.searchOverlayVisible, true);
assert.strictEqual(capturedPage.data.searchOverlayDuration, 500);
assert.strictEqual(capturedPage.data.searchComboboxVisible, false, 'Overlay 进入期间不应立刻展开 Combobox');
assert.strictEqual(capturedPage.data.searchOptions.length, 0, 'Overlay 进入期间不渲染尚未显示的候选列表');
timers[timers.length - 1].callback();
assert.strictEqual(capturedPage.data.searchComboboxVisible, true, 'Overlay 进入结束后才展开 Combobox');
assert.strictEqual(capturedPage.data.searchInputFocus, true, 'Overlay 进入后聚焦独立 Search');
assert.strictEqual(capturedPage.data.searchOptions.length, 83, '首页搜索打开后必须展示全部 78 个组件和 5 个规范页');
['Button', 'Divider', 'Icon', 'ConfigProvider', 'AspectRatio', 'Direction', 'Grid', 'ScrollArea', 'Sticky', 'Navbar', 'NavigationMenu', 'Tabs', 'Breadcrumb', 'Tabbar', 'Steps', 'BackTop', 'Indexes', 'SideBar', 'Alert', 'Empty', 'Loading', 'NoticeBar', 'Progress', 'Result', 'Skeleton', 'Toast', 'Dialog', 'Popup', 'Popover', 'Sheet', 'ActionSheet', 'DropdownMenu', 'Overlay', 'AreaChart', 'BarChart', 'Waffle', 'DonutChart', 'RadarChart', 'SortableList', 'Tour', 'PullRefresh', 'VirtualList', 'Watermark', 'Avatar', 'Badge', 'Card', 'Image', 'Tag', 'Cell', 'List', 'Collapse', 'Collapsible', 'Bubble', 'SwipeCell', 'CountDown', 'Swiper', 'Table', 'Form', 'Field', 'Label', 'Input', 'InputOTP', 'Textarea', 'Search', 'Checkbox', 'Radio', 'Switch', 'Select', 'Picker', 'Combobox', 'Slider', 'Stepper', 'Rate', 'Calendar', 'DateTimePicker', 'Upload', '开始使用', '主题 Token', '颜色', '间距', '字体排版'].forEach(function (name) {
  assert.ok(capturedPage.data.searchOptions.some(function (option) { return option.label === name; }), '搜索候选缺少真实组件 ' + name);
});
assert.ok(capturedPage.data.searchOptions.some(function (option) { return option.label === '开始使用' && option.description.indexOf('规范 ·') === 0; }), '搜索结果必须将规范页与组件区分');
capturedPage.onSearchOverlayClick({ detail: { visible: false } });
assert.strictEqual(capturedPage.data.searchOverlayVisible, false);
assert.strictEqual(capturedPage.data.searchComboboxVisible, false, '点击遮罩必须关闭 Combobox');
capturedPage.onSearchChange({ detail: { value: 'button' } });
assert.strictEqual(capturedPage.data.searchQuery, 'button');
assert.strictEqual(capturedPage.data.searchOptions.length, 1, '独立 Search 负责过滤后传入 Combobox');
capturedPage.onSearchSelect({ detail: { option: { value: '/pages/components/button/index' } } });
assert.strictEqual(navigations[0].url, '/pages/components/button/index');
capturedPage.onSearchSelect({ detail: { option: { value: '/pages/guides/spacing/index' } } });
assert.strictEqual(navigations[1].url, '/pages/guides/spacing/index');
capturedPage.onOpenAppearance();
assert.strictEqual(capturedPage.data.searchOverlayVisible, false, '打开外观时必须关闭搜索 Overlay');
assert.strictEqual(capturedPage.data.appearancePopupVisible, true);
capturedPage.onAppearanceSwitchChange({ currentTarget: { dataset: { setting: 'shadow' } }, detail: { checked: true } });
assert.strictEqual(capturedPage.data.visualConfig.shadow, true, '阴影必须经 visualConfig Store 回写');
capturedPage.onAppearanceSwitchChange({ currentTarget: { dataset: { setting: 'theme' } }, detail: { checked: true } });
assert.strictEqual(capturedPage.data.visualConfig.theme, 'dark', '深色必须经 visualConfig Store 回写');
assert.strictEqual(capturedPage.data.brandMark, '/assets/poemui-moon-lines-mark-light.png', '显式深色模式必须换成透明底白色完整品牌标记');
capturedPage.setData({ visualConfig: Object.assign({}, capturedPage.data.visualConfig, { theme: 'auto' }) });
capturedPage.onProviderThemeChange({ detail: { theme: 'dark' } });
assert.strictEqual(capturedPage.data.brandMark, '/assets/poemui-moon-lines-mark-light.png', 'auto 模式解析为深色时必须换成透明底白色完整品牌标记');
capturedPage.onProviderThemeChange({ detail: { theme: 'light' } });
assert.strictEqual(capturedPage.data.brandMark, '/assets/poemui-moon-lines-mark-dark.png', 'auto 模式解析为浅色时必须恢复透明底黑色完整品牌标记');
capturedPage.onBackgroundGradientChange({ detail: { checked: true } });
assert.strictEqual(capturedPage.data.backgroundGradientEnabled, true, '渐变必须真实回写首页画布偏好');
capturedPage.onFruitFlavorChange({ detail: { checked: true } });
assert.strictEqual(capturedPage.data.backgroundGradientEnabled, false, '果味必须关闭背景渐变');
assert.strictEqual(capturedPage.data.fruitFlavorEnabled, true, '果味必须由实际视觉配置推导');
assert.strictEqual(capturedPage.data.visualConfig.bordered, false);
capturedPage.onAppearanceSwitchChange({ currentTarget: { dataset: { setting: 'bordered' } }, detail: { checked: true } });
assert.strictEqual(capturedPage.data.fruitFlavorEnabled, false, '任一果味字段偏离时果味必须自动关闭');
capturedPage.onResetAppearance();
assert.deepStrictEqual(capturedPage.data.visualConfig, { theme: 'light', effectsEnabled: true, shadow: true, frostedGlass: false, largeRadius: true, bordered: false, equalSpacing: false }, '重置必须写回公开默认视觉配置');
assert.strictEqual(capturedPage.data.brandMark, '/assets/poemui-moon-lines-mark-dark.png', '重置浅色主题必须恢复透明底黑色完整品牌标记');
assert.strictEqual(capturedPage.data.backgroundGradientEnabled, false, '重置必须关闭并持久化页面背景渐变');
assert.strictEqual(capturedPage.data.fruitFlavorEnabled, false, '默认配置不能伪装为果味预设');
capturedPage.onAppearancePopupVisibleChange({ detail: { visible: false } });
assert.strictEqual(capturedPage.data.appearancePopupVisible, false, '点击遮罩或关闭按钮必须关闭底部 Popup');
capturedPage.onCatalogSectionChange({ currentTarget: { dataset: { section: 'navigation' } }, detail: { open: true } });
assert.strictEqual(capturedPage.data.activeCatalogSection, 'navigation', '打开导航分区必须关闭其他分区');
assert.strictEqual(capturedPage._overlayAutoExpandTimer, null, '用户手动切换分区后不得保留自动展开定时器');
capturedPage.onCatalogSectionChange({ currentTarget: { dataset: { section: 'overlay' } }, detail: { open: true } });
assert.strictEqual(capturedPage.data.activeCatalogSection, 'overlay', '打开浮层分区必须关闭基础组件分区');
capturedPage.onCatalogSectionChange({ currentTarget: { dataset: { section: 'basic' } }, detail: { open: true } });
assert.strictEqual(capturedPage.data.activeCatalogSection, 'basic', '打开基础组件分区必须关闭浮层分区');
var pendingBasicSectionScrollTimer = timers.filter(function (timer) { return timer.delay === 500 && !timer.cleared; }).pop();
capturedPage.onCatalogSectionChange({ currentTarget: { dataset: { section: 'basic' } }, detail: { open: false } });
assert.strictEqual(capturedPage.data.activeCatalogSection, '', '关闭当前分区后允许所有分区收起');
assert.strictEqual(pendingBasicSectionScrollTimer.cleared, true, '关闭分区时必须取消尚未执行的锚点定位');
assert.strictEqual(capturedPage.data.homeScrollIntoView, '', '关闭分区后不得保留会抢占阅读位置的锚点');
capturedPage.onHomeScroll({ detail: { scrollTop: 736 } });
capturedPage.setData({ homeScrollIntoView: 'home-section-basic' });
capturedPage.onHide();
capturedPage.setData({ homeScrollTop: 0, homeScrollIntoView: 'home-section-navigation' });
capturedPage.onShow();
assert.strictEqual(capturedPage.data.activeCatalogSection, 'basic', '返回首页时必须恢复上次打开的分区');
assert.strictEqual(capturedPage.data.homeScrollTop, 736, '返回首页必须恢复离开前的实际滚动位置');
assert.strictEqual(capturedPage.data.homeScrollIntoView, '', '返回首页不能再用分区锚点覆盖用户原来的滚动上下文');
capturedPage.onTabChange({ detail: { value: 'ai' } });
assert.deepStrictEqual(tabbarNavigationCalls, [{ value: 'ai', activeTab: 'home' }], '首页必须将 Tabbar 选择交给真实路由工具');

console.log('miniprogram home contract tests passed');
