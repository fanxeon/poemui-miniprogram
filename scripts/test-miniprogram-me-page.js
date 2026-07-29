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
var appJson = JSON.parse(read('miniprogram/app.json'));
var pageWxml = read('miniprogram/pages/me/index.wxml');
var pageWxss = read('miniprogram/pages/me/index.wxss');
var pageJs = read('miniprogram/pages/me/index.js');
var componentStatus = require(path.join(ROOT, 'miniprogram/common/data/component-status'));
var styleUtilitiesCatalog = require(path.join(ROOT, 'miniprogram/common/data/style-utilities-catalog'));
var metadata = require(path.join(ROOT, 'metadata/components'));
var licensePageJson = JSON.parse(read('miniprogram/pages/license/index.json'));
var licensePageWxml = read('miniprogram/pages/license/index.wxml');
var licensePageJs = read('miniprogram/pages/license/index.js');
var announcements = require(path.join(ROOT, 'miniprogram/common/services/update-announcements'));
var packageVersion = JSON.parse(read('package.json')).version;
var expectedCurrentCategoryCounts = [
  { key: 'getting-started', label: '规范', count: 1 },
  { key: 'foundation', label: '基础', count: 3 },
  { key: 'layout', label: '布局', count: 5 },
  { key: 'navigation', label: '导航', count: 9 },
  { key: 'form', label: '表单', count: 19 },
  { key: 'data', label: '数据展示', count: 14 },
  { key: 'feedback', label: '反馈', count: 9 },
  { key: 'overlay', label: '浮层', count: 6 },
  { key: 'advanced', label: '高级', count: 8 }
];
var expectedPreviousCategoryCounts = expectedCurrentCategoryCounts.map(function (item) {
  return item.key === 'advanced'
    ? { key: item.key, label: item.label, count: 5 }
    : { key: item.key, label: item.label, count: item.count };
});

[
  ['pui-config-provider', 'poemui-miniprogram/config-provider/config-provider'],
  ['pui-navbar', 'poemui-miniprogram/navbar/navbar'],
  ['pui-scroll-area', 'poemui-miniprogram/scroll-area/scroll-area'],
  ['pui-tabbar', 'poemui-miniprogram/tabbar/tabbar'],
  ['pui-button', 'poemui-miniprogram/button/button'],
  ['pui-card', 'poemui-miniprogram/card/card'],
  ['pui-bar-chart', 'poemui-miniprogram/bar-chart/bar-chart'],
  ['pui-cell', 'poemui-miniprogram/cell/cell'],
  ['pui-cell-group', 'poemui-miniprogram/cell/cell-group'],
  ['pui-dialog', 'poemui-miniprogram/dialog/dialog'],
  ['pui-popup', 'poemui-miniprogram/popup/popup'],
  ['pui-tag', 'poemui-miniprogram/tag/tag'],
  ['pui-icon', 'poemui-miniprogram/icon/icon'],
  ['pui-top-loading', 'poemui-miniprogram/top-loading/top-loading'],
  ['pui-toast', 'poemui-miniprogram/toast/toast'],
  ['appearance-settings', '/components/appearance-settings/appearance-settings']
].forEach(function (entry) {
  assert.strictEqual(pageJson.usingComponents[entry[0]], entry[1], '我的页必须组合 ' + entry[0]);
});

assert.ok(pageWxml.indexOf('<pui-config-provider') !== -1 && pageWxml.indexOf('use-global-config') !== -1, '我的页必须继承全局外观');
assert.ok(pageWxml.indexOf('title="我的"') !== -1, '我的页必须提供唯一 Navbar 标题');
assert.strictEqual((pageWxml.match(/<pui-scroll-area/g) || []).length, 2, '我的页必须分别为页面正文和公告 Popup 提供一个场景内唯一 ScrollArea');
assert.ok(pageWxml.indexOf('id="me-services"') !== -1, '服务区必须提供稳定的几何验收锚点');
assert.ok(pageWxml.indexOf('id="me-component-status"') !== -1, '组件状态仪表盘必须提供稳定的几何验收锚点');
assert.ok(pageWxml.indexOf('style="min-height: {{contentHeight}};"') !== -1, '正文必须至少填满 Navbar 与 Tabbar 之间的真实剩余高度');
['pui-avatar', 'pui-input'].forEach(function (component) {
  assert.strictEqual(pageJson.usingComponents[component], undefined, '非用户中心页面不得继续注册 ' + component);
});
['<pui-avatar', '<pui-input', 'me-profile', 'me-nickname-input', 'me-save-nickname', 'nicknameDraft', '保存昵称', '编辑昵称'].forEach(function (fragment) {
  assert.ok(pageWxml.indexOf(fragment) === -1, '我的页必须彻底移除头像昵称资料链：' + fragment);
});
assert.strictEqual((pageWxml.match(/<pui-card/g) || []).length, 1, '我的页只允许组件状态仪表盘建立一个 PUI Card Surface');
assert.strictEqual((pageWxml.match(/<pui-bar-chart/g) || []).length, 1, '我的页只展示一个 BarChart，不保留 AreaChart、Waffle 或第二个图表');
assert.strictEqual((pageWxml.match(/<pui-waffle/g) || []).length, 0, '我的页必须移除未采用的 Waffle 方案');
assert.strictEqual((pageWxml.match(/<pui-area-chart/g) || []).length, 0, '我的页必须移除已被类别增量方案替代的 AreaChart');
['items="{{componentStatusVisibleCategoryItems}}"', 'max="{{componentStatusMaximum}}"', 'orientation="horizontal"', 'mode="stacked"', 'size="small"', 'duration="{{componentStatusAnimationDuration}}"', 'show-value', 'show-legend="{{false}}"'].forEach(function (fragment) {
  assert.ok(pageWxml.indexOf(fragment) !== -1, '组件状态仪表盘缺少：' + fragment);
});
assert.ok(pageWxml.indexOf('show-grid') === -1, 'Me 页面必须关闭 BarChart 刻度与网格，不显示顶部 0 / max');
var versionTagBlock = pageWxml.slice(
  pageWxml.indexOf('class="me-page__dashboard-version-tags"'),
  pageWxml.indexOf('id="me-component-status-chart-toggle"')
);
['wx:for="{{componentStatusVersionLegendItems}}"', 'content="{{item.label}}"', 'size="small"', 'shape="round"', 'custom-style="{{item.customStyle}}"'].forEach(function (fragment) {
  assert.ok(versionTagBlock.indexOf(fragment) !== -1, '版本图例必须使用最小尺寸上色 PUI Tag：' + fragment);
});
var metricLabelBlock = pageWxml.slice(
  pageWxml.indexOf('class="me-page__dashboard-metric-label-row"'),
  pageWxml.indexOf('class="me-page__dashboard-chart"')
);
['{{item.label}}', 'wx:if="{{item.icon}}"', 'name="{{item.icon}}"', 'size="{{20}}"', 'color="{{item.iconColor}}"'].forEach(function (fragment) {
  assert.ok(metricLabelBlock.indexOf(fragment) !== -1, '新增数据块必须在“新增”标签右侧组合小尺寸真实 PUI Icon：' + fragment);
});
assert.ok(pageWxml.indexOf('class="me-page__dashboard-metric-value-row"') === -1 && pageWxml.indexOf('size="{{28}}"') === -1, 'Sparkles 不得继续贴在数值右侧或保留旧 28rpx 尺寸');
['description="{{componentStatusSummary}}"', 'v0.1.2 · 74 个组件 · 本版 +3', 'title="组件状态"'].forEach(function (fragment) {
  assert.ok(pageWxml.indexOf(fragment) === -1, '仪表盘不得保留旧版头文案：' + fragment);
});
assert.ok(pageWxml.indexOf('class="me-page__dashboard-content"') !== -1 && pageWxml.indexOf('id="me-component-status-metrics"') !== -1 && pageWxml.indexOf('wx:for="{{componentStatusMetrics}}"') !== -1, '图表上方必须使用同一卡片透明布局容器内的四列数据摘要');
assert.ok(pageWxml.indexOf('{{item.value}}') !== -1 && pageWxml.indexOf('{{item.label}}') !== -1, '数据摘要必须由页面真实数据驱动');
assert.ok(pageWxml.indexOf('id="me-component-status-chart"') !== -1, 'BarChart 必须保留稳定运行态锚点');
assert.ok(pageWxml.indexOf('wx:if="{{!announcementPopupVisible && !licenseDialogVisible && !appearancePopupVisible}}"') === -1, 'View/WXSS BarChart 不得继承 Canvas 图表的浮层卸载分支');
[
  'id="me-component-status-chart-viewport"',
  'bindtransitionend="onComponentStatusChartTransitionEnd"',
  'id="me-component-status-chart-toggle"',
  'theme="default"',
  'variant="transparent"',
  'size="small"',
  'icon="{{componentStatusChartToggleIcon}}"',
  'content="{{componentStatusChartToggleLabel}}"',
  'disabled="{{componentStatusChartTransitioning}}"',
  'bind:click="onToggleComponentStatusChart"'
].forEach(function (fragment) {
  assert.ok(pageWxml.indexOf(fragment) !== -1, '长图表展开链缺少：' + fragment);
});
assert.strictEqual((pageWxml.match(/id="me-component-status-chart-toggle"/g) || []).length, 1, '图表只允许一个真实 PUI 展开操作');
assert.strictEqual(componentStatus.baseline, 0, '组件状态基线必须从 0 开始');
assert.strictEqual(componentStatus.currentVersion, packageVersion, '组件状态当前版本必须来自包版本');
assert.strictEqual(componentStatus.previousVersion, '0.1.0', '0.1.2 增量必须以公开 0.1.0 为前序版本');
assert.strictEqual(componentStatus.total, metadata.packageComponents.length, '组件状态总数必须来自当前发布组件集');
assert.strictEqual(componentStatus.previousTotal, 71, '0.1.0 目录基线必须保持 71 个组件');
assert.strictEqual(componentStatus.incrementTotal, 3, '0.1.2 必须只统计 AreaChart、BarChart 与 Waffle 三个真实新增组件');
assert.deepStrictEqual(componentStatus.versions(), [
  { version: '0.1.0', total: 71 },
  { version: '0.1.1', total: 74 },
  { version: '0.1.2', total: 74 }
], '生成型组件状态必须保留 0.1.0 / 0.1.1 / 0.1.2 三个版本里程碑');
var versionStatusClone = componentStatus.versions();
versionStatusClone[0].total = 999;
assert.notStrictEqual(componentStatus.versions()[0].total, 999, '版本里程碑读取必须返回副本');
assert.strictEqual(componentStatus.items().reduce(function (sum, item) { return sum + item.value; }, 0), componentStatus.total, '分类数量之和必须等于发布组件总数');
assert.deepStrictEqual(componentStatus.items().filter(function (item) { return item.increment > 0; }).map(function (item) {
  return { key: item.key, previousValue: item.previousValue, increment: item.increment, themes: item.segments.map(function (segment) { return segment.theme; }) };
}), [{ key: 'advanced', previousValue: 5, increment: 3, themes: ['blue', 'teal'] }], '只有高级分类获得 0.1.2 的 Blue / Teal 增量分段');
assert.strictEqual(componentStatus.maximum, Math.max.apply(Math, componentStatus.items().map(function (item) { return item.value; })), '生成状态仍须保留真实分类最大值');
var componentStatusClone = componentStatus.items();
componentStatusClone[0].value = 999;
componentStatusClone[0].segments[0].value = 999;
assert.notStrictEqual(componentStatus.items()[0].value, 999, '组件状态读取必须返回副本，页面不能污染生成真相源');
assert.notStrictEqual(componentStatus.items()[0].segments[0].value, 999, '组件状态分段也必须深拷贝');
assert.ok(pageJs.indexOf('dashboardCategoryChart(ANNOUNCEMENTS)') !== -1, 'BarChart 初始数据必须读取公告统计，而不是页面手写分类值');
assert.ok(pageJs.indexOf('CHART_VERSION_THEMES') !== -1 && pageJs.indexOf('versions.map') !== -1, 'BarChart 必须为每个公告版本生成稳定色彩分段');
assert.ok(pageJs.indexOf("'--pui-color-' + normalizedTheme + '-soft'") !== -1, '版本 Tag 必须使用同色系纯色 soft Surface，不得复用图表渐变');
assert.ok(pageJs.indexOf("'--pui-bg-secondary'") !== -1, '未知版本主题必须回退到已定义的中性 Surface Token');
assert.ok(pageJs.indexOf("'background:var(--pui-chart-gradient-'") === -1, '版本 Tag 不得继续使用 Chart 渐变背景');
assert.ok(pageJs.indexOf("'box-shadow:none;'") !== -1, '版本 Tag 必须显式移除默认 inset 框');
assert.ok(pageJs.indexOf("key: 'version-' + versionIndex") !== -1, '逐版本分段必须使用稳定 key');
assert.ok(pageJs.indexOf('prioritizeIncrementedCategories(items)') !== -1, 'Me 图表必须把存在版本增量的分类稳定提高到顶部');
assert.ok(pageJs.indexOf("'getting-started': true") !== -1 && pageJs.indexOf('HIDDEN_CHART_CATEGORIES') !== -1, 'Me 图表必须只在展示层过滤“规范”类别');
assert.ok(pageJs.indexOf('COLLAPSED_CATEGORY_COUNT = 4') !== -1, '长图表默认必须只显示四类');
assert.ok(pageJs.indexOf("componentCategoryValue('advanced')") !== -1, '高级数量必须从生成分类状态读取');
assert.ok(pageJs.indexOf('styleUtilitiesCatalog.items.length') !== -1, '样式数量必须从生成 Style Utilities 目录读取');
assert.ok(pageWxss.indexOf('grid-template-columns: repeat(4, minmax(0, 1fr))') !== -1, '四个摘要块必须在一行等分且允许窄屏收缩');
assert.ok(/\.me-page__dashboard-content\s*\{[^}]*gap:\s*var\(--pui-content-gap\)/.test(pageWxss), '数据摘要与图表必须由唯一透明父容器使用内容组合间距');
assert.ok(!/\.me-page__dashboard-metrics\s*\{[^}]*margin-bottom:/.test(pageWxss), '数据摘要不得再以子级 margin 与父级 gap 叠加图表间距');
assert.ok(/\.me-page__dashboard-chart\s*\{[^}]*gap:\s*var\(--pui-content-gap\)/.test(pageWxss), '图表下方的版本 Tag 与操作必须和图表上方统一使用内容组合间距');
assert.ok(/\.me-page__dashboard-metric-label-row\s*\{[^}]*align-items:\s*center[^}]*justify-content:\s*center[^}]*gap:\s*var\(--pui-space-xxs\)/.test(pageWxss), '“新增”和小尺寸 Icon 必须以最紧密 Token 同轴居中');
assert.ok(pageWxss.indexOf('.me-page__dashboard-metric') !== -1 && pageWxss.indexOf('var(--pui-font-size-title-medium)') !== -1, '摘要排版必须消费 PUI 字体 Token');
assert.ok(/\.me-page__content\s*\{[^}]*gap:\s*var\(--pui-section-gap\)/.test(pageWxss), '仪表盘与服务集合必须使用较大的标准分区间距');
assert.ok(!/\.me-page__services\s*\{[^}]*margin-top:\s*auto[^}]*\}/.test(pageWxss), '服务集合必须紧跟仪表盘，不能再被 auto margin 推到底部');
assert.ok(pageWxss.indexOf('transition-property: height') !== -1, '图表展开与收起必须对真实高度做平滑过渡');
assert.ok(pageWxss.indexOf('transition-duration: var(--pui-duration-normal)') !== -1 && pageWxss.indexOf('transition-timing-function: var(--pui-ease-standard)') !== -1, '高度过渡必须消费共享 Motion Token');
assert.ok(pageWxss.indexOf('@media (prefers-reduced-motion: reduce)') !== -1 && pageWxss.indexOf('transition-duration: 1ms') !== -1, '系统低动效必须压缩高度过渡');
assert.ok(/\.me-page__dashboard-version-tags\s*\{[^}]*flex-wrap:\s*wrap[^}]*gap:\s*var\(--pui-space-xs\)/.test(pageWxss), '版本 Tag 组必须使用共享紧密间距并允许 390px 换行');
assert.ok(pageWxml.indexOf('OpenID') === -1 && pageWxml.indexOf('onCopyOpenId') === -1, '我的页必须彻底移除 OpenID 展示与复制入口');
['高级版商业授权', '我的订单', '更新公告', '用户私隐协议', '关于诗上'].forEach(function (label) {
  assert.ok(pageWxml.indexOf(label) !== -1, '我的页缺少服务 Cell：' + label);
});
assert.ok(pageWxml.indexOf('value="查阅详情"') !== -1 && pageWxml.indexOf('aria-label="查阅高级版商业授权详情"') !== -1, '授权入口必须使用查阅详情语义');
assert.ok(pageWxml.indexOf('购买高级版授权') === -1 && pageWxml.indexOf('value="尚未开放"') === -1, '授权 Cell 不得保留购买或尚未开放文案');
assert.ok(pageWxml.indexOf('id="me-license-dialog"') !== -1 && pageWxml.indexOf('visible="{{licenseDialogVisible}}"') !== -1, '授权入口必须打开受控 PUI Dialog');
['title="前往商业授权详情？"', 'cancel-btn="{{licenseDialogCancelBtn}}"', 'confirm-btn="{{licenseDialogConfirmBtn}}"', 'bind:confirm="onConfirmLicense"', 'bind:close="onLicenseDialogClose"'].forEach(function (fragment) {
  assert.ok(pageWxml.indexOf(fragment) !== -1, '商业授权 Dialog 缺少真实确认链：' + fragment);
});
assert.ok(appJson.pages.indexOf('pages/license/index') !== -1, 'app.json 必须注册商业授权 WebView 页面');
assert.strictEqual(licensePageJson.navigationStyle, 'default', '商业授权 WebView 必须保留微信原生返回栏');
assert.ok(licensePageWxml.indexOf('<web-view') !== -1 && licensePageWxml.indexOf('src="{{licenseUrl}}"') !== -1 && licensePageWxml.indexOf('bind:error="onWebViewError"') !== -1, '商业授权页面必须使用真实微信 WebView 并处理加载失败');
assert.ok(licensePageJs.indexOf("https://poemcoder.com/poem-ui") !== -1, '商业授权 WebView 地址不得漂移');
assert.ok(licensePageJs.indexOf('wx.showModal') !== -1 && licensePageJs.indexOf('wx.setClipboardData') !== -1, 'WebView 失败时必须提供复制链接的真实恢复动作');
assert.ok(pageWxml.indexOf('id="me-update-announcement-cell"') !== -1 && pageWxml.indexOf('bind:click="onOpenAnnouncements"') !== -1, '更新公告 Cell 必须打开真实 Popup');
assert.ok(pageWxml.indexOf('id="me-update-announcement-popup"') !== -1 && pageWxml.indexOf('<pui-popup') !== -1, '更新公告必须使用 PUI Popup');
['show-header', 'show-footer', 'slot="content"', 'slot="footer"', 'content="知道了"', 'bind:visible-change="onAnnouncementPopupVisibleChange"'].forEach(function (fragment) {
  assert.ok(pageWxml.indexOf(fragment) !== -1, '更新公告 Popup 缺少结构：' + fragment);
});
assert.ok(pageWxml.indexOf('custom-style="{{announcementPopupStyle}}"') !== -1 && pageJs.indexOf("announcementPopupStyle: 'max-height:calc(100vh - ' + navbarHeight + 'px - 24rpx);'") !== -1, '长公告 Popup 必须用实测 Navbar 高度限制上限，而不是固定成近全屏高度');
assert.ok(pageWxml.indexOf('content-scrollable="{{false}}"') !== -1, '公告 Popup 必须关闭自身 Content 滚动，避免与内部 ScrollArea 形成双滚动所有者');
assert.ok(pageWxml.indexOf('height="auto"') !== -1 && pageWxml.indexOf('max-height="60vh"') !== -1 && pageWxml.indexOf('aria-label="PoemUI 更新公告内容"') !== -1, '公告内容必须自然增高，并仅在超过 60vh 后由 PUI ScrollArea 滚动');
assert.ok(pageWxml.indexOf('height="78vh"') === -1 && pageWxml.indexOf('custom-style="max-height:100%;"') === -1, '公告不得保留固定 78vh 与页面私有高度补丁');
assert.ok(pageWxml.indexOf('id="me-announcement-scroll-area"') !== -1 && pageWxml.indexOf('id="me-announcement-close"') !== -1, '公告滚动区与固定 Footer 操作必须有稳定运行态验收锚点');
assert.ok(pageWxml.indexOf('id="me-announcement-top-loading"') !== -1 && pageWxml.indexOf('state="{{announcementLoadingState}}"') !== -1, '公告云请求必须使用受控 PUI TopLoading');
assert.ok(/<pui-top-loading[\s\S]*?slot="surface-top"[\s\S]*?\/>/.test(pageWxml), '公告 TopLoading 必须通过 Popup surface-top Slot 贴住 Surface 顶边');
assert.ok(pageWxml.indexOf('<pui-loading') === -1 && pageWxml.indexOf('正在同步云端公告') === -1, '公告读取不得保留居中 Spinner 或重复加载文案');
assert.ok(pageWxml.indexOf('content-padding-bottom="0"') !== -1, '固定 Footer 已提供底部操作区时，公告 ScrollArea 不应再制造默认 10vh 空白');
assert.ok(pageWxml.indexOf('scroll-top="{{announcementScrollTop}}"') !== -1 && pageJs.indexOf('announcementScrollTop: 0') !== -1, '公告打开时必须保留可验证的顶部定位源');
assert.ok(pageWxml.indexOf('bind:scroll="onAnnouncementScroll"') !== -1 && pageJs.indexOf('onAnnouncementScroll') !== -1, '公告必须回写真实滚动位置，确保再次打开时 0 是不同的受控目标并能回到顶部');
assert.ok(pageWxml.indexOf('scroll-into-view="{{announcementScrollTarget}}"') !== -1 && pageWxml.indexOf('id="me-announcement-top-a"') !== -1 && pageWxml.indexOf('id="me-announcement-top-b"') !== -1, '公告每次打开必须切换真实顶部锚点，不能依赖同值 scrollTop 触发平台定位');
assert.ok(pageJs.indexOf('wx.nextTick(function scrollAnnouncementToTop()') !== -1, '顶部锚点必须在 Popup 可见状态提交后再切换，避免隐藏 ScrollArea 丢失定位请求');
assert.ok(pageWxml.indexOf('<pui-tag') !== -1 && pageWxml.indexOf('<pui-icon') !== -1, '公告必须使用 PUI Tag 突出组件名并使用 PUI Icon 展示组件图标');
assert.ok(pageWxml.indexOf('announcement.highlights') !== -1 && pageWxml.indexOf('{{highlight.component}}') !== -1, '公告必须按组件改动而非无层级字符串陈列');
['{{announcement.componentCount}}', 'wx:for="{{announcement.categoryCounts}}"', '{{category.label}}', '{{category.count}}', 'class="me-announcement__category-grid"', 'class="me-announcement__stats"'].forEach(function (fragment) {
  assert.ok(pageWxml.indexOf(fragment) === -1, '公告 Popup 不得直接展示图表数据：' + fragment);
});
assert.ok(pageWxml.indexOf('<pui-toast id="me-toast"') !== -1, '页面反馈必须复用 PUI Toast');
var contactButton = pageWxml.match(/<pui-button[\s\S]*?id="me-contact-service"[\s\S]*?\/>/);
assert.ok(contactButton && contactButton[0].indexOf('open-type="contact"') !== -1, '联系客服必须使用 PUI Button 的微信 contact 能力');
['variant="text"', 'surface="transparent"', 'size="extra-small"', 'shape="circle"', 'icon="comment"', 'icon-only', 'aria-label="联系 PoemUI 客服"'].forEach(function (fragment) {
  assert.ok(contactButton[0].indexOf(fragment) !== -1, '联系客服圆形图标按钮缺少：' + fragment);
});
assert.ok(contactButton[0].indexOf('content=') === -1 && contactButton[0].indexOf('block') === -1, '低强调客服入口不得恢复满宽文案按钮');
var navbarBlock = pageWxml.slice(pageWxml.indexOf('<pui-navbar'), pageWxml.indexOf('</pui-navbar>') + '</pui-navbar>'.length);
assert.ok(navbarBlock.indexOf('id="me-contact-service"') !== -1, '客服 Button 必须投影到 Navbar 左 Slot，不能留在正文或另建浮动入口');
assert.ok(navbarBlock.indexOf('slot="left"') !== -1 && navbarBlock.indexOf('pui-gap-xxs') !== -1, 'Navbar 左 Slot 必须用共享间距类承载双操作');
['id="me-appearance-menu"', 'icon="menu"', 'aria-label="打开外观设置"', 'bind:click="onOpenAppearance"'].forEach(function (fragment) {
  assert.ok(navbarBlock.indexOf(fragment) !== -1, '我的页 Navbar 外观菜单缺少：' + fragment);
});
assert.strictEqual((navbarBlock.match(/<pui-button/g) || []).length, 2, '我的页 Navbar 左 Slot 必须只包含客服与菜单两个操作');
assert.strictEqual((pageWxml.match(/id="me-contact-service"/g) || []).length, 1, '客服入口在页面中必须唯一');
assert.ok(pageWxml.indexOf('bind:error="onContactError"') !== -1 && pageJs.indexOf('onContactError') !== -1, '客服平台失败必须由页面真实反馈');
var appearancePopup = pageWxml.slice(pageWxml.indexOf('id="me-appearance-popup"'), pageWxml.indexOf('id="me-tabbar"'));
['visible="{{appearancePopupVisible}}"', 'title="外观"', 'blur-overlay', 'slot="header-left"', 'icon="refresh"', '<appearance-settings />', 'bind:visible-change="onAppearancePopupVisibleChange"'].forEach(function (fragment) {
  assert.ok(appearancePopup.indexOf(fragment) !== -1, '我的页外观 Popup 缺少首页同源结构：' + fragment);
});
assert.ok(pageWxml.indexOf('<input') === -1 && pageWxml.indexOf('<button') === -1, '我的页不得手写原生 Input 或 Button');
assert.ok(pageWxml.indexOf('tabbar-placeholder') === -1, '我的页不得继续使用空白占位壳');
assert.ok(!fs.existsSync(path.join(ROOT, 'miniprogram/components/tabbar-placeholder')), '失去消费者的 Tabbar 占位组件必须移除');
assert.ok(pageWxss.indexOf('var(--pui-') !== -1 && !/#[0-9a-f]{3,8}/i.test(pageWxss), '页面布局必须只消费 PUI Token');
assert.ok(pageWxss.indexOf('.me-profile') === -1, '头像昵称退出后必须删除资料版头样式');
assert.ok(pageWxss.indexOf('4vh') === -1, '页面不得用视口魔法数挤压服务列表');
assert.ok(pageWxss.indexOf('.me-page__contact') === -1, '客服移入 Navbar Slot 后必须删除正文定位样式');
assert.ok(!/\.me-announcement-popup__content\s*\{[^}]*position:\s*relative/.test(pageWxss), '公告 Content 不得再承担 Surface 顶部加载的定位');
assert.ok(!/\.me-announcement-popup__content\s*\{[^}]*height:\s*100%/.test(pageWxss), '公告 Content 必须让内容自然决定高度，不能继续强制填满 Popup');
assert.ok(pageWxss.indexOf('.me-announcement__category-grid') === -1 && pageWxss.indexOf('.me-announcement__stats-total') === -1, '公告统计退出可见层后必须删除失去消费者的样式');
assert.ok(pageJs.indexOf("wx.openPrivacyContract") !== -1, '隐私协议必须调用微信真实能力');
assert.ok(pageJs.indexOf("wx.navigateToMiniProgram") !== -1 && pageJs.indexOf("wxa1b9a4d6549c6cd1") !== -1 && pageJs.indexOf("envVersion: 'release'") !== -1, '关于诗上必须跳转指定正式版小程序');
assert.ok(!/openid|openId|OpenID|setClipboardData/.test(pageJs), '我的页 JS 不得继续读取、展示或复制 OpenID');
assert.ok(!/user-profile|userProfile|nickname|avatarText|restoreProfile|onNicknameChange|onSaveNickname/.test(pageJs), '页面 JS 必须彻底移除头像昵称资料状态、Store 与事件');
assert.ok(!fs.existsSync(path.join(ROOT, 'miniprogram/common/utils/user-profile.js')), '失去消费者的 user-profile Store 必须删除');
assert.ok(pageJs.indexOf('wx.requestPayment') === -1, '尚未交付的授权入口不得伪造支付');

var localAnnouncements = announcements.list();
assert.ok(localAnnouncements.length > 0, '本地公告数据源必须至少提供一条可见公告');
assert.strictEqual(announcements.latest().id, localAnnouncements[0].id, 'latest 必须返回列表首条公告');
assert.strictEqual(localAnnouncements[0].id, 'pui-v0-1-2-20260729', '包内 fallback 首条必须与云端 0.1.2 公告使用同一稳定 ID');
assert.ok(localAnnouncements[0].highlights.some(function (highlight) {
  return highlight.component === '小程序'
    && highlight.title === '状态页与首页修正'
    && highlight.description.indexOf('BarChart 按八类展示 v0.1.0、v0.1.1、v0.1.2 增量并平滑展开') !== -1
    && highlight.description.indexOf('无效分享配置') !== -1;
}), '0.1.2 包内公告必须同步 Me BarChart 与首页无效分享配置修复');
assert.ok(localAnnouncements[0].highlights.every(function (highlight) {
  return highlight.description.indexOf('全宽 Waffle') === -1;
}), '0.1.2 当前公告不得继续描述未采用的 Waffle 方案');
assert.strictEqual(localAnnouncements[0].version, 'v0.1.2', '最新公告必须对应当前发布版本 0.1.2');
assert.strictEqual(localAnnouncements[0].date, '2026-07-29', '0.1.2 公告必须提供确定日期');
assert.strictEqual(localAnnouncements[0].componentCount, componentStatus.total, '0.1.2 公告组件总数必须来自生成型当前总数');
assert.deepStrictEqual(localAnnouncements[0].categoryCounts, expectedCurrentCategoryCounts, '0.1.2 公告必须保留九类当前数量供图表使用');
assert.strictEqual(localAnnouncements[1].componentCount, 74, '0.1.1 历史工作树公告必须记录当时 74 个组件');
assert.deepStrictEqual(localAnnouncements[1].categoryCounts, expectedCurrentCategoryCounts, '0.1.1 公告九类数量必须与当时 74 个组件口径一致');
assert.strictEqual(localAnnouncements[2].componentCount, componentStatus.previousTotal, '0.1.0 公告组件总数必须来自生成型前序总数');
assert.deepStrictEqual(localAnnouncements[2].categoryCounts, expectedPreviousCategoryCounts, '0.1.0 公告必须记录高级 5、总计 71 的九类数量');
localAnnouncements.forEach(function (announcement) {
  assert.strictEqual(announcement.schemaVersion, 2, announcement.version + ' 公告必须使用含统计字段的 Schema v2');
  assert.strictEqual(announcement.categoryCounts.length, 9, announcement.version + ' 公告必须包含全部九类');
  assert.strictEqual(announcement.categoryCounts.reduce(function (sum, category) {
    return sum + category.count;
  }, 0), announcement.componentCount, announcement.version + ' 各类别数量之和必须等于组件总数');
  assert.strictEqual(new Set(announcement.categoryCounts.map(function (category) {
    return category.key;
  })).size, 9, announcement.version + ' 类别 key 不得重复');
});
assert.deepStrictEqual(localAnnouncements[0].highlights.map(function (item) { return item.component; }), ['高级图表', '导航与表单', '展示与反馈', '浮层', '小程序'], '0.1.2 公告必须按用户任务分组并保持精简');
assert.ok(localAnnouncements[0].highlights[4].description.indexOf('v0.1.0、v0.1.1、v0.1.2') !== -1 && localAnnouncements[0].highlights[4].description.indexOf('八类') !== -1, '小程序公告必须说明 BarChart 的逐版本与展示类别口径');
assert.ok(localAnnouncements[0].summary.length <= 30, '0.1.2 公告摘要必须保持精简');
localAnnouncements[0].highlights.forEach(function (item) {
  assert.ok(item.description.length <= 60, '0.1.2 公告说明必须避免冗长：' + item.component);
});
assert.ok(/^v\d+\.\d+\.\d+$/.test(localAnnouncements[0].version), '公告版本必须使用可识别的语义版本');
assert.ok(localAnnouncements[0].highlights.length >= 3, '公告必须陈列实际组件改动');
localAnnouncements[0].highlights[0].component = '测试污染';
localAnnouncements[0].categoryCounts[0].count = 999;
assert.notStrictEqual(announcements.list()[0].highlights[0].component, '测试污染', '公告读取必须返回深副本，页面不能污染真相源');
assert.notStrictEqual(announcements.list()[0].categoryCounts[0].count, 999, '公告分类统计读取必须返回深副本');
assert.strictEqual(announcements.RESOURCE_APP_ID, 'wxa1b9a4d6549c6cd1', '公告必须连接诗上资源小程序');
assert.strictEqual(announcements.RESOURCE_ENV, 'poemcoder-1gkbkid139b08f45', '公告必须连接已授权的生产共享环境');
assert.strictEqual(announcements.COLLECTION_NAME, 'pui_updatelog', 'PUI 云集合必须遵守 pui_ 前缀');
assert.ok(pageJs.indexOf('loadAnnouncements') !== -1, '页面加载与打开 Popup 时必须刷新云端公告');

var capturedPage;
var navigationCalls = [];
var privacyCalls = [];
var miniProgramCalls = [];
var licenseNavigationCalls = [];
var licenseNavigationShouldFail = false;
var toastCalls = [];
var backgroundListener;
var backgroundSetCalls = [];
var visualConfigResetCalls = [];
var chartMeasuredHeight = 420;
vm.runInNewContext(pageJs, {
  Page: function (definition) { capturedPage = definition; },
  setTimeout: function () { return 1; },
  clearTimeout: function () {},
  wx: {
    getWindowInfo: function () { return { windowHeight: 844 }; },
    onWindowResize: function () {},
    offWindowResize: function () {},
    nextTick: function (callback) { callback(); },
    openPrivacyContract: function (options) {
      privacyCalls.push(options || {});
    },
    navigateTo: function (options) {
      licenseNavigationCalls.push(options);
      if (licenseNavigationShouldFail) {
        if (options.fail) options.fail({ errMsg: 'navigateTo:fail' });
        return;
      }
      if (options.success) options.success({ errMsg: 'navigateTo:ok' });
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
        set: function (value, options) {
          backgroundSetCalls.push({ value: value, options: options });
        },
        subscribe: function (listener) {
          backgroundListener = listener;
          return function () {};
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
    if (request === '../../common/data/component-status') {
      return componentStatus;
    }
    if (request === '../../common/data/style-utilities-catalog') {
      return styleUtilitiesCatalog;
    }
    if (request === 'poemui-miniprogram/common/utils/visual-config') {
      return {
        reset: function (options) {
          visualConfigResetCalls.push(options);
        }
      };
    }
    throw new Error('unexpected require ' + request);
  }
}, { filename: 'miniprogram/pages/me/index.js' });

var runtime = {
  data: JSON.parse(JSON.stringify(capturedPage.data)),
  setData: function (patch, callback) {
    Object.assign(this.data, patch);
    if (typeof callback === 'function') callback.call(this);
  },
  selectComponent: function (selector) {
    if (selector === '#me-toast') {
      return {
        show: function (options) { toastCalls.push(options); }
      };
    }
    if (selector === '#me-component-status-chart') {
      return {
        createSelectorQuery: function () {
          return {
            select: function (target) {
              assert.strictEqual(target, '.pui-bar-chart');
              return this;
            },
            boundingClientRect: function () { return this; },
            exec: function (callback) {
              callback([{ height: chartMeasuredHeight }]);
            }
          };
        }
      };
    }
    throw new Error('unexpected component selector ' + selector);
  }
};
Object.keys(capturedPage).forEach(function (key) {
  if (typeof capturedPage[key] === 'function') runtime[key] = capturedPage[key];
});

runtime.onLoad();
assert.strictEqual(runtime.data.announcementLoadingState, 'loading', '公告请求开始必须立即驱动 TopLoading loading');
assert.strictEqual(runtime.data.openid, undefined, '页面状态不得保留 OpenID');
assert.strictEqual(runtime.data.openIdDisplay, undefined, '页面状态不得保留 OpenID 展示值');
assert.strictEqual(runtime.data.hasOpenId, undefined, '页面状态不得保留 OpenID 门禁');
assert.strictEqual(runtime.data.componentStatusSummary, undefined, '旧版头摘要必须从页面状态移除');
assert.deepStrictEqual(runtime.data.componentStatusMetrics.map(function (item) {
  return { key: item.key, label: item.label, value: item.value };
}), [
  { key: 'components', label: '组件', value: componentStatus.total },
  { key: 'styles', label: '样式', value: styleUtilitiesCatalog.items.length },
  { key: 'advanced', label: '高级', value: 8 },
  { key: 'increment', label: '新增', value: componentStatus.incrementTotal }
], '四列摘要必须依次展示真实组件、样式、高级和新增数量');
assert.strictEqual(runtime.data.componentStatusMetrics[3].icon, 'sparkles', '新增数量右侧必须使用 sparkles PUI Icon');
assert.strictEqual(runtime.data.componentStatusMetrics[3].iconColor, 'var(--pui-chart-accent-violet)', '新增 Icon 必须使用最新版本 Violet accent');
assert.ok(runtime.data.componentStatusMetricsAriaLabel.indexOf(componentStatus.total + ' 个组件') !== -1 && runtime.data.componentStatusMetricsAriaLabel.indexOf(styleUtilitiesCatalog.items.length + ' 个样式') !== -1 && runtime.data.componentStatusMetricsAriaLabel.indexOf('8 个高级组件') !== -1 && runtime.data.componentStatusMetricsAriaLabel.indexOf('本版新增 ' + componentStatus.incrementTotal + ' 个组件') !== -1, '四列摘要必须提供完整读屏名称');
assert.ok(runtime.data.componentStatusAriaLabel.indexOf('依次展示 v0.1.0、v0.1.1、v0.1.2') !== -1 && runtime.data.componentStatusAriaLabel.indexOf('已折叠，当前显示前 4 类') !== -1, '图表读屏名称必须解释逐版本与折叠状态');
assert.deepStrictEqual(runtime.data.componentStatusCategoryItems.map(function (item) {
  return {
    key: item.key,
    label: item.label,
    values: item.segments.map(function (segment) { return segment.value; }),
    labels: item.segments.map(function (segment) { return segment.label; }),
    themes: item.segments.map(function (segment) { return segment.theme; })
  };
}), [
  { key: 'advanced', label: '高级', values: [5, 3, 0], labels: ['v0.1.0', 'v0.1.1', 'v0.1.2'], themes: ['blue', 'teal', 'violet'] },
  { key: 'foundation', label: '基础', values: [3, 0, 0], labels: ['v0.1.0', 'v0.1.1', 'v0.1.2'], themes: ['blue', 'teal', 'violet'] },
  { key: 'layout', label: '布局', values: [5, 0, 0], labels: ['v0.1.0', 'v0.1.1', 'v0.1.2'], themes: ['blue', 'teal', 'violet'] },
  { key: 'navigation', label: '导航', values: [9, 0, 0], labels: ['v0.1.0', 'v0.1.1', 'v0.1.2'], themes: ['blue', 'teal', 'violet'] },
  { key: 'form', label: '表单', values: [19, 0, 0], labels: ['v0.1.0', 'v0.1.1', 'v0.1.2'], themes: ['blue', 'teal', 'violet'] },
  { key: 'data', label: '数据展示', values: [14, 0, 0], labels: ['v0.1.0', 'v0.1.1', 'v0.1.2'], themes: ['blue', 'teal', 'violet'] },
  { key: 'feedback', label: '反馈', values: [9, 0, 0], labels: ['v0.1.0', 'v0.1.1', 'v0.1.2'], themes: ['blue', 'teal', 'violet'] },
  { key: 'overlay', label: '浮层', values: [6, 0, 0], labels: ['v0.1.0', 'v0.1.1', 'v0.1.2'], themes: ['blue', 'teal', 'violet'] }
], 'BarChart 必须隐藏“规范”、把有新增的分类置顶，并以纯版本号展示真实逐版本增量');
assert.deepStrictEqual(runtime.data.componentStatusVisibleCategoryItems.map(function (item) { return item.key; }), ['advanced', 'foundation', 'layout', 'navigation'], '图表初始必须优先显示有新增的分类，再按原顺序补足四类');
assert.ok(runtime.data.componentStatusCategoryItems.every(function (item) {
  return item.segments.every(function (segment) {
    return segment.label.indexOf('已有') === -1 && segment.label.indexOf('新增') === -1;
  });
}), '图例标签必须只展示版本号，不附加已有或新增');
assert.deepStrictEqual(runtime.data.componentStatusVersionLegendItems.map(function (item) {
  return {
    label: item.label,
    theme: item.theme,
    usesAccent: item.customStyle.indexOf('--pui-chart-accent-' + item.theme) !== -1,
    usesSoftSurface: item.customStyle.indexOf('--pui-color-' + item.theme + '-soft') !== -1,
    usesGradient: item.customStyle.indexOf('--pui-chart-gradient-' + item.theme) !== -1,
    hasNoFrame: item.customStyle.indexOf('box-shadow:none') !== -1
  };
}), [
  { label: 'v0.1.0', theme: 'blue', usesAccent: true, usesSoftSurface: true, usesGradient: false, hasNoFrame: true },
  { label: 'v0.1.1', theme: 'teal', usesAccent: true, usesSoftSurface: true, usesGradient: false, hasNoFrame: true },
  { label: 'v0.1.2', theme: 'violet', usesAccent: true, usesSoftSurface: true, usesGradient: false, hasNoFrame: true }
], '版本图例必须以无框最小 PUI Tag 复用同色系纯色 soft Surface 与 Chart accent，且不能使用渐变');
assert.strictEqual(runtime.data.componentStatusVersionLegendAriaLabel, '版本颜色：v0.1.0、v0.1.1、v0.1.2', '版本 Tag 组必须提供完整读屏名称');
assert.strictEqual(runtime.data.componentStatusChartExpanded, false, '图表初始必须折叠');
assert.strictEqual(runtime.data.componentStatusChartToggleLabel, '查看更多', '折叠态操作必须表达查看更多');
assert.strictEqual(runtime.data.componentStatusChartToggleIcon, 'chevron-down', '折叠态操作必须使用向下图标');
assert.strictEqual(runtime.data.componentStatusChartToggleVisible, true, '八类图表必须提供展开入口');
assert.strictEqual(runtime.data.componentStatusCompositionItems, undefined, '页面状态不得保留旧的两段版本构成点阵');
assert.strictEqual(runtime.data.componentStatusVersionItems, undefined, '页面状态不得保留未采用的 Waffle 版本行');
assert.strictEqual(runtime.data.componentStatusMaximum, 19, 'BarChart 显式上限必须等于类别当前最大值');
assert.strictEqual(runtime.data.componentStatusAnimationDuration, 1000, 'BarChart 页面动效必须保留 1000ms 节奏');
runtime._componentStatusChartCollapsedHeight = 240;
runtime.onComponentStatusChartTransitionEnd({ detail: { propertyName: 'transform' } });
assert.strictEqual(runtime.data.componentStatusChartTransitioning, false, '非高度 transitionend 不得改变图表状态');
assert.strictEqual(runtime.onToggleComponentStatusChart(), true, '点击查看更多必须进入展开链');
assert.strictEqual(runtime.data.componentStatusChartExpanded, true, '查看更多必须回写展开态');
assert.strictEqual(runtime.data.componentStatusVisibleCategoryItems.length, 8, '展开态必须渲染全部八类');
assert.strictEqual(runtime.data.componentStatusChartToggleLabel, '收起', '展开态操作必须表达收起');
assert.strictEqual(runtime.data.componentStatusChartToggleIcon, 'chevron-up', '展开态操作必须使用向上图标');
assert.strictEqual(runtime.data.componentStatusChartViewportStyle, 'height:420px;', '展开链必须测量真实内容高度');
assert.strictEqual(runtime.data.componentStatusChartTransitioning, true, '高度过渡期间必须禁用重复操作');
runtime.onComponentStatusChartTransitionEnd({ detail: { propertyName: 'height' } });
assert.strictEqual(runtime.data.componentStatusChartTransitioning, false, '展开高度过渡结束后必须恢复操作');
assert.strictEqual(runtime.onToggleComponentStatusChart(), true, '点击收起必须进入收起链');
assert.strictEqual(runtime.data.componentStatusChartExpanded, false, '收起必须立即回写折叠语义');
assert.strictEqual(runtime.data.componentStatusVisibleCategoryItems.length, 8, '收起动画期间必须保留完整内容，避免跳变');
assert.strictEqual(runtime.data.componentStatusChartViewportStyle, 'height:240px;', '收起链必须回到缓存的四类高度');
runtime.onComponentStatusChartTransitionEnd({ detail: { propertyName: 'height' } });
assert.deepStrictEqual(runtime.data.componentStatusVisibleCategoryItems.map(function (item) { return item.key; }), ['advanced', 'foundation', 'layout', 'navigation'], '收起动画结束后才允许卸载后四类，并继续保持增量分类优先');
assert.strictEqual(runtime.data.componentStatusChartTransitioning, false, '收起完成必须恢复操作');
backgroundListener(true);
assert.strictEqual(runtime.data.backgroundGradientEnabled, true, '我的页必须跟随共享背景偏好');

assert.strictEqual(runtime.onOpenPrivacy(), true, '支持能力时必须打开微信隐私合同');
assert.strictEqual(privacyCalls.length, 1, '隐私合同只能调用一次');
assert.strictEqual(runtime.onOpenShishang(), true, '支持能力时必须发起小程序跳转');
assert.strictEqual(miniProgramCalls[0].appId, 'wxa1b9a4d6549c6cd1', '诗上科技 AppID 不得漂移');
assert.strictEqual(miniProgramCalls[0].envVersion, 'release', '关于诗上必须进入正式版');
assert.strictEqual(runtime.onPurchaseLicense(), true, '商业授权 Cell 必须打开确认 Dialog');
assert.strictEqual(runtime.data.licenseDialogVisible, true, '点击授权入口后 Dialog 必须保持受控可见');
assert.strictEqual(runtime.onConfirmLicense(), true, '确认后必须发起真实页面导航');
assert.strictEqual(licenseNavigationCalls[0].url, '/pages/license/index', '确认后必须进入商业授权 WebView 页面');
assert.strictEqual(runtime.data.licenseDialogVisible, false, '真实导航成功后必须关闭确认 Dialog');
assert.strictEqual(runtime.data.licenseNavigating, false, '真实导航成功后必须结束 loading');
runtime.onPurchaseLicense();
licenseNavigationShouldFail = true;
assert.strictEqual(runtime.onConfirmLicense(), true, '导航失败也必须完成一次真实平台调用');
assert.strictEqual(runtime.data.licenseDialogVisible, true, '导航失败后保留 Dialog 以便重试或取消');
assert.strictEqual(runtime.data.licenseNavigating, false, '导航失败后必须恢复确认按钮');
assert.strictEqual(runtime.onLicenseDialogClose(), true, '导航失败后必须允许用户取消');
assert.strictEqual(runtime.data.licenseDialogVisible, false, '取消必须关闭受控 Dialog');
runtime.onOpenOrders();
runtime.onContactError();
assert.ok(toastCalls.some(function (entry) { return entry.message === '暂时无法打开商业授权详情'; }), '授权详情导航失败必须明确反馈');
assert.ok(toastCalls.some(function (entry) { return entry.message === '订单服务尚未开放'; }), '未开放订单必须明确反馈');
assert.ok(toastCalls.some(function (entry) { return entry.message === '暂时无法打开客服会话'; }), '客服平台失败必须明确反馈');
runtime.onOpenAnnouncements();
assert.strictEqual(runtime.data.announcementPopupVisible, true, '点击更新公告必须打开受控 Popup');
var firstAnnouncementScrollTarget = runtime.data.announcementScrollTarget;
runtime.onAnnouncementScroll({ detail: { scrollTop: 420, scrollHeight: 1200 } });
assert.strictEqual(runtime.data.announcementScrollTop, 420, '公告必须回写 ScrollArea 的真实滚动位置');
runtime.onAnnouncementPopupVisibleChange({ detail: { visible: false, trigger: 'overlay' } });
assert.strictEqual(runtime.data.announcementPopupVisible, false, 'Popup 遮罩关闭请求必须由页面回写');
runtime.onOpenAnnouncements();
assert.strictEqual(runtime.data.announcementScrollTop, 0, '滚动后再次打开公告必须把受控目标改回顶部');
assert.notStrictEqual(runtime.data.announcementScrollTarget, firstAnnouncementScrollTarget, '公告重开必须切换顶部锚点并触发真实 scrollIntoView');
runtime.onCloseAnnouncements();
assert.strictEqual(runtime.data.announcementPopupVisible, false, 'Footer 按钮必须真实关闭公告');
runtime.onOpenAnnouncements();
runtime.onOpenAppearance();
assert.strictEqual(runtime.data.appearancePopupVisible, true, 'Navbar 菜单必须打开受控外观 Popup');
assert.strictEqual(runtime.data.announcementPopupVisible, false, '打开外观设置时必须关闭公告 Popup，避免浮层叠加');
runtime.onAppearancePopupVisibleChange({ detail: { visible: false, trigger: 'overlay' } });
assert.strictEqual(runtime.data.appearancePopupVisible, false, '外观 Popup 遮罩关闭请求必须由页面回写');
runtime.onResetAppearance();
assert.strictEqual(backgroundSetCalls[0].value, false, '我的页恢复默认必须同步关闭页面渐变');
assert.strictEqual(backgroundSetCalls[0].options.source, 'miniprogram-me:appearance-reset', '我的页渐变重置必须记录调用来源');
assert.strictEqual(visualConfigResetCalls[0].source, 'miniprogram-me:appearance-reset', '我的页恢复默认必须调用共享 visualConfig');
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
  componentCount: 3,
  categoryCounts: [
    { key: 'foundation', label: '基础', count: 3 }
  ],
  highlights: [
    {
      component: 'Popup',
      icon: 'popup',
      title: '组件改动',
      description: '公告必须从共享集合读取。'
    }
  ],
  status: 'published',
  schemaVersion: 2
};
vm.runInNewContext(serviceSource, {
  module: serviceModule,
  exports: serviceModule.exports,
  require: function (request) {
    if (request === '../data/component-status') return componentStatus;
    throw new Error('unexpected service require ' + request);
  },
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
  assert.strictEqual(result.announcements[0].componentCount, 3, '云公告必须保留组件总数字段');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(result.announcements[0].categoryCounts)), [
    { key: 'foundation', label: '基础', count: 3 }
  ], '云公告必须保留类别数量字段');
  assert.strictEqual(cachedAnnouncements[0].version, 'v9.9.9', '云端成功结果必须写入离线缓存');
  console.log('miniprogram me page contract tests passed');
}).catch(function (error) {
  console.error(error);
  process.exitCode = 1;
});
