'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');

var root = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

var appJson = JSON.parse(read('miniprogram/app.json'));
var navigation = require(path.join(root, 'miniprogram/common/utils/tabbar-navigation'));
var catalog = require(path.join(root, 'miniprogram/common/data/style-utilities-catalog'));
var visualConfig = { restore: function () {}, reset: function () {} };
var platformInfo = { getWindowInfo: function () { return { windowWidth: 375, windowHeight: 844 }; } };
var backgroundPreference = { get: function () { return false; }, restore: function () {}, set: function () {}, subscribe: function () { return function () {}; } };
var utilities = read('common/style/utilities.wxss');
var names = Array.from(new Set((utilities.match(/\.pui-[a-z0-9_-]+/g) || []).map(function (token) { return token.slice(1); }))).sort();
var js = read('miniprogram/pages/styles/index.js');
var json = JSON.parse(read('miniprogram/pages/styles/index.json'));
var wxml = read('miniprogram/pages/styles/index.wxml');
var wxss = read('miniprogram/pages/styles/index.wxss');
var generatedH5Catalog = read('preview/style-utilities-data.js');
var generatedH5Css = read('preview/style-utilities.css');

assert.ok(appJson.pages.indexOf('pages/styles/index') !== -1, '第二 Tab 必须注册真实 styles 页面');
assert.strictEqual(appJson.pages.indexOf('pages/ai/index'), -1, '旧 AI 空白路由必须彻底移除');
assert.strictEqual(navigation.getItems()[1].value, 'styles', '第二 Tab 必须指向 styles');
assert.strictEqual(navigation.getItems()[1].icon, 'palette', '第二 Tab 必须使用 PUI palette 图标');
assert.deepStrictEqual(catalog.items.map(function (item) { return item.name; }).sort(), names, '小程序目录必须完整覆盖发布的全部 utility class');
var previewTargets = ['layout', 'item', 'target', 'media', 'measure', 'outer', 'surface', 'items', 'text'];
catalog.items.forEach(function (item) {
  assert.ok(item.previewKind, item.name + ' 必须具有生成的 previewKind');
  assert.ok(previewTargets.indexOf(item.previewTarget) !== -1, item.name + ' 必须命中受支持的 previewTarget');
  assert.ok(item.previewSafety, item.name + ' 必须声明 previewSafety');
  assert.ok(['current', 'dark'].indexOf(item.previewTheme) !== -1, item.name + ' 必须声明预览主题范围');
  assert.ok(Array.isArray(item.previewScaffold), item.name + ' 必须声明可组合的 previewScaffold');
  assert.ok(previewTargets.indexOf(item.previewScaffoldTarget) !== -1, item.name + ' 必须声明 scaffold 的真实挂载目标');
});
var h5Window = {};
vm.runInNewContext(generatedH5Catalog, { window: h5Window }, { filename: 'preview/style-utilities-data.js' });
assert.deepStrictEqual(JSON.parse(JSON.stringify(h5Window.POEMUI_STYLE_UTILITIES)), JSON.parse(JSON.stringify(catalog)), 'H5 与小程序必须消费逐项一致的生成预览语义');
assert.ok(generatedH5Css.indexOf('@import') === -1 && generatedH5Css.indexOf('rpx') === -1, 'H5 utility CSS 必须转换为 scoped px 规则且不得导入 WXSS theme');
catalog.items.forEach(function (item) {
  assert.ok(generatedH5Css.indexOf('.' + item.name) !== -1, 'H5 生成 CSS 必须覆盖 ' + item.name);
});
assert.strictEqual(catalog.items.find(function (item) { return item.name === 'pui-aspect-video'; }).previewKind, 'aspect');
assert.strictEqual(catalog.items.find(function (item) { return item.name === 'pui-aspect-video'; }).previewTarget, 'measure');
assert.strictEqual(catalog.items.find(function (item) { return item.name === 'pui-full-height'; }).previewKind, 'height', '兼容别名必须命中真实高度目标');
assert.strictEqual(catalog.items.find(function (item) { return item.name === 'pui-col-span-2'; }).previewTarget, 'item', '跨列只作用于子项');
assert.strictEqual(catalog.items.find(function (item) { return item.name === 'pui-fixed'; }).previewSafety, 'position-contained', 'fixed 必须被局部沙盒约束');
assert.strictEqual(catalog.items.find(function (item) { return item.name === 'pui-hidden'; }).previewSafety, 'trace', '不可见结果必须保留独立轨迹');
assert.strictEqual(catalog.items.find(function (item) { return item.name === 'pui-dark-bg-muted'; }).previewTheme, 'dark', 'dark utility 必须进入局部深色范围');
assert.strictEqual(catalog.items.find(function (item) { return item.name === 'pui-theme--dark'; }).previewKind, 'theme-scope', '显式深色范围必须作为主题作用域预览');
assert.strictEqual(catalog.items.find(function (item) { return item.name === 'pui-text-cut'; }).previewKind, 'text-overflow', '文字裁切不能误归为文字颜色');
assert.deepStrictEqual(catalog.groups.map(function (group) { return group.key; }), ['layout', 'size', 'spacing', 'typography', 'background'], '小程序必须使用布局、尺寸、间距、字体、背景五个直观分区');
assert.deepStrictEqual(catalog.groups.map(function (group) { return group.label; }), ['布局', '尺寸', '间距', '字体', '背景'], '小程序 Tabs 必须不暴露含义宽泛的主题与行为分类');
assert.ok(catalog.items.some(function (item) { return item.name === 'pui-bg-gradient-ai-mist-blue-violet' && item.group === 'background'; }), 'AI 雾蓝紫必须归入背景');
assert.ok(catalog.items.some(function (item) { return item.name === 'pui-dark-bg-muted' && item.group === 'background'; }), '深色背景 variant 必须归入背景');
assert.ok(catalog.items.some(function (item) { return item.name === 'pui-dark-text-success' && item.group === 'typography'; }), '深色文字 variant 必须归入字体');
assert.ok(wxml.indexOf('<pui-tabs') !== -1 && wxml.indexOf('bind:change="onGroupChange"') !== -1, '样式页必须使用真实 PUI Tabs 分类');
assert.ok(wxml.indexOf('items="{{groupTabs}}"') !== -1, '样式页必须将目录 group key 显式映射为 Tabs value');
assert.ok(wxml.indexOf('sticky="{{false}}"') !== -1, '快速样式页不得依赖 Tabs sticky；Tabs 必须固定在工作区绝对层');
assert.ok(wxml.indexOf('swipeable="{{false}}"') !== -1, '快速样式页必须关闭 Tabs 内容区横滑，避免与唯一目录 ScrollArea 竞争手势');
assert.ok(wxml.indexOf('space-evenly=') === -1, '快速样式页必须让 PUI Tabs 按数量自动决定等分或半露横向轨道');
assert.ok(wxml.indexOf("activeGroup === 'size'") !== -1, '尺寸分类必须有真实预览，不能出现空白首屏');
assert.ok(wxml.indexOf("activeGroup === 'spacing'") !== -1 && wxml.indexOf("activeGroup === 'typography'") !== -1 && wxml.indexOf('wx:else class="styles-page__preview-visual-guide"') !== -1, '五个分类必须进入各自的语义预览目标');
assert.ok(wxml.indexOf("activeGroup === 'visual'") === -1 && wxml.indexOf("activeGroup === 'behavior'") === -1, '页面示例不得保留已删除的 visual 或 behavior group key');
assert.ok(wxml.indexOf('styles-page__intro') === -1 && wxml.indexOf('为内容搭出正确的样子') === -1, '快速样式页不得在 Navbar 下重复显示页面标题区');
assert.ok(wxml.indexOf('styles-page__example') === -1 && wxml.indexOf('activeGroupMeta') === -1 && wxml.indexOf('已选 class') === -1, 'Tabs 内不得保留分类标题、说明或已选 class 标题区');
assert.ok(!/pui-cell-group\s+title=/.test(wxml) && wxml.indexOf('全部样式') === -1, 'Tabs 内的目录不得再创建标题区');
assert.ok(wxml.indexOf('styles-page__utility-grid') !== -1, '样式目录必须使用独立的两列网格');
assert.ok(/<pui-cell title="\{\{utility\.name\}\}" selectable selected="\{\{utility\.selected\}\}" clickable/.test(wxml), '样式项必须使用真实 PUI Cell 的可选状态');
var utilityCellTag = wxml.match(/<pui-cell title="\{\{utility\.name\}\}"[^>]+>/);
assert.ok(utilityCellTag && utilityCellTag[0].indexOf('value=') === -1 && utilityCellTag[0].indexOf('arrow') === -1, '样式项不得保留查看示例文案或箭头');
assert.ok(wxml.indexOf('id="styles-workspace"') !== -1 && wxml.indexOf('styles-page__tabs') !== -1, 'Tabs 必须落在固定工作区的绝对层');
assert.ok(wxml.indexOf('id="styles-preview-layer"') !== -1 && wxml.indexOf('styles-page__utility-scroll-wrap') !== -1, '预览与目录滚动区必须有独立的 absolute 布局层');
assert.ok(wxss.indexOf('.styles-page__tabs') !== -1 && wxss.indexOf('.styles-page__preview-layer') !== -1 && wxss.indexOf('.styles-page__utility-scroll-wrap') !== -1, 'Tabs、预览和目录滚动区必须具备明确布局根');
assert.ok(wxss.indexOf('position: sticky;') === -1 && wxss.indexOf('styles-page__preview-sticky') === -1, '快速样式页不得保留 sticky 布局或旧预览类');
assert.ok(wxml.indexOf('height: {{previewHeight}}px;') !== -1 && wxss.indexOf('.styles-page__preview-layer') !== -1 && wxss.indexOf('overflow: hidden;') !== -1, '紧凑预览必须按受控高度裁切极端 utility');
assert.ok(wxml.indexOf('styles-page__preview-current-wrap') !== -1 && wxml.indexOf('styles-page__preview-current') !== -1, '预览必须只保留唯一的当前效果');
assert.ok(wxml.indexOf('styles-page__preview-compare') === -1 && wxml.indexOf('previewSides') === -1 && wxml.indexOf('styles-page__preview-arrow') === -1, '当前效果不得残留基准、结果或比较箭头');
var previewTextRule = wxss.match(/\.styles-page__preview-text\s*\{([^}]*)\}/);
assert.ok(previewTextRule && !/\bcolor\s*:/.test(previewTextRule[1]), '文字预览根不得用页面私有 color 覆盖 pui-text-* utility');
assert.ok(wxml.indexOf('bind:click="onResetPreview"') !== -1 && wxml.indexOf('disabled="{{!previewHasSelection}}"') !== -1, '唯一预览必须提供受当前分类选择状态驱动的真实恢复按钮');
assert.ok(wxml.indexOf('styles-page__preview-reset-wrap') !== -1 && wxml.indexOf('class="styles-page__preview-reset-host"') !== -1 && wxml.indexOf('custom-class="styles-page__preview-reset"') !== -1 && wxss.indexOf('justify-self: end;') !== -1, '小尺寸恢复按钮必须通过独立收缩轨道右对齐，并为内部真实 Button 暴露可验证的 external class');
var previewResetButton = wxml.match(/<pui-button[\s\S]*?custom-class="styles-page__preview-reset"[\s\S]*?\/>/);
assert.ok(previewResetButton && previewResetButton[0].indexOf('theme="default"') !== -1 && previewResetButton[0].indexOf('variant="text"') !== -1 && previewResetButton[0].indexOf('size="small"') !== -1 && previewResetButton[0].indexOf('shape="circle"') !== -1 && previewResetButton[0].indexOf('icon="refresh"') !== -1 && previewResetButton[0].indexOf('icon-only') !== -1, '恢复入口必须是低存在感的 default / text / small 圆形 PUI IconButton');
['previewLayoutClasses', 'previewItemClasses', 'previewTargetClasses', 'previewMediaClasses', 'previewMeasureClasses', 'previewOuterClasses', 'previewSurfaceClasses', 'previewItemsClasses', 'previewTextClasses'].forEach(function (binding) {
  assert.ok(wxml.indexOf(binding) !== -1, 'WXML 必须消费语义目标 ' + binding);
});
assert.ok(wxss.indexOf('--pui-style-utilities-directory-bottom-clearance') !== -1 && wxss.indexOf('padding-bottom: var(--pui-style-utilities-directory-bottom-clearance);') !== -1, '目录末行必须预留渐变遮罩和面板底部共同需要的安全空间');
assert.ok(js.indexOf('measurePreviewLayout') !== -1 && js.indexOf('utilityScrollHeight') !== -1 && js.indexOf('PREVIEW_MAX_HEIGHT_RPX = 120') !== -1 && js.indexOf('PREVIEW_GAP_RPX = 8') !== -1 && js.indexOf('UTILITY_MIN_VIEWPORT_RPX = 520') !== -1, '预览必须收敛到120rpx当前效果条，以8rpx关联间距衔接目录并保留520rpx目录预算');
assert.ok(js.indexOf("require('poemui-miniprogram/common/utils/platform-info')") !== -1, '快速样式页 rpx 换算必须复用发布包平台读取器');
assert.ok(js.indexOf('getSystemInfoSync') === -1, '快速样式页不得恢复已弃用的聚合系统信息 API');
assert.ok(js.indexOf('onResetPreview') !== -1 && js.indexOf("var prefix = groupKey + ':';") !== -1, '恢复动作必须只清空当前分类，不能重置其他分类');
assert.ok(js.indexOf("query.select('#styles-preview-layer')") === -1, '固定语义预览不得再依赖预览 DOM 回测制造布局抖动');
assert.ok(js.indexOf('activeGroupMeta') === -1 && js.indexOf('selectedUtility') === -1, '移除标题区后不得保留无消费的分类元数据或已选 class 状态');
['pui-navbar', 'pui-scroll-area', 'pui-search', 'pui-overlay', 'pui-popup', 'pui-button', 'pui-icon', 'pui-cell-group', 'pui-cell', 'pui-back-top', 'pui-tabbar', 'appearance-settings'].forEach(function (name) {
  assert.ok(json.usingComponents[name], '样式页必须组合 ' + name);
});
assert.ok(wxml.indexOf('<pui-back-top') !== -1 && wxml.indexOf('scroll-top="{{scrollTop}}"') !== -1, '快速样式页必须挂载由真实滚动位置驱动的 PUI BackTop');
assert.ok(wxml.indexOf('bind:scroll="onScrollAreaScroll"') !== -1 && wxml.indexOf('bind:to-top="onBackToTop"') !== -1, 'ScrollArea 滚动和 BackTop 点击必须形成真实页面回写链路');
assert.strictEqual((wxml.match(/<pui-scroll-area/g) || []).length, 1, '快速样式页只保留目录的唯一 ScrollArea');
assert.ok(/<pui-scroll-area[^>]+height="\{\{utilityScrollHeight\}\}"[^>]+scroll-top="\{\{scrollTop\}\}"/.test(wxml), '快速样式页必须用唯一 ScrollArea 的受控 scrollTop 驱动真实局部回顶');
assert.ok(wxml.indexOf('styles-top-anchor') === -1 && js.indexOf('scrollIntoView') === -1, '快速样式页不得继续依赖 type=list 下不稳定的 Slot 顶部锚点');
assert.ok(wxml.indexOf('--pui-back-top-bottom-offset:calc(var(--pui-tabbar-content-height) + env(safe-area-inset-bottom) + var(--pui-space-normal))') !== -1, '快速样式页 BackTop 必须消费 Tabbar 语义高度并留出操作间距');
assert.ok(utilities.indexOf('--pui-tabbar-content-height: 112rpx;') !== -1 || read('common/style/theme.wxss').indexOf('--pui-tabbar-content-height: 112rpx;') !== -1, '小程序主题必须公开 Tabbar 内容语义高度供浮动操作避让');
assert.ok(wxml.indexOf('left-btn="{{navbarLeftBtn}}"') !== -1 && wxml.indexOf('right-btn="{{navbarRightBtn}}"') !== -1, '样式页 Navbar 必须复用首页双按钮入口');
assert.ok(wxml.indexOf('bind:leftBtn="onOpenSearch"') !== -1 && wxml.indexOf('bind:rightBtn="onOpenAppearance"') !== -1, '样式页 Navbar 双按钮必须直接绑定真实方法');
assert.ok(wxml.indexOf('data-utility="{{utility.name}}"') !== -1 && wxml.indexOf('bind:click="onUtilityTap"') !== -1, '点击类名必须更新真实示例');
assert.ok(wxml.indexOf('wx.setClipboardData') === -1 && js.indexOf('wx.setClipboardData') === -1, '快速样式页不得把复制作为主要交互');
assert.ok(wxml.indexOf('previewUtilityClasses') === -1 && js.indexOf('previewUtilityClasses') === -1, 'utility 不得重新聚合到会被尺寸或定位破坏的共享预览根');
assert.ok(wxml.indexOf('previewBackgroundClass') === -1 && js.indexOf('previewBackgroundClass') === -1, '背景 utility 必须进入 surface 目标，不保留页面私有背景分支');
assert.ok(wxml.indexOf('src="/assets/poemui-moon-lines-black.png"') !== -1 && wxml.indexOf('previewMediaClasses') !== -1, 'object fit/position 必须作用于真实图片目标');
assert.ok(wxss.indexOf('.styles-page__utility-grid') !== -1 && wxss.indexOf('grid-template-columns: repeat(2, minmax(0, 1fr));') !== -1, '样式目录必须固定为两列');
assert.ok(wxss.indexOf('var(--pui-') !== -1 && wxss.indexOf('#') === -1, '样式页私有布局必须只消费 PUI Token');

var capturedPage;
var clipboardWrites = [];
vm.runInNewContext(js, {
  Page: function (definition) { capturedPage = definition; },
  setTimeout: function () { return 1; },
  clearTimeout: function () {},
  wx: {
    setClipboardData: function (options) { clipboardWrites.push(options.data); if (options.success) options.success(); },
    nextTick: function (callback) { callback(); },
    getWindowInfo: function () { return { windowWidth: 375, windowHeight: 844 }; }
  },
  require: function (request) {
    if (request === '../../common/utils/tabbar-navigation') return navigation;
    if (request === '../../common/data/style-utilities-catalog') return catalog;
    if (request === 'poemui-miniprogram/common/utils/visual-config') return visualConfig;
    if (request === 'poemui-miniprogram/common/utils/tabbar-page-layout') {
      return {
        getLayout: function () {
          return { navbarHeight: 87, tabbarHeight: 92, contentHeightStyle: '665px' };
        },
        getContentHeight: function () { return '665px'; }
      };
    }
    if (request === 'poemui-miniprogram/common/utils/platform-info') return platformInfo;
    if (request === '../../common/utils/page-background-preference') return backgroundPreference;
    throw new Error('unexpected require ' + request);
  }
}, { filename: 'miniprogram/pages/styles/index.js' });

var runtime = Object.assign({}, capturedPage, { data: JSON.parse(JSON.stringify(capturedPage.data)) });
runtime.setData = function (patch, callback) { Object.assign(this.data, patch); if (callback) callback.call(this); };
var toastCalls = [];
runtime.selectComponent = function () { return { show: function (options) { toastCalls.push(options); } }; };
assert.deepStrictEqual(runtime.data.groupTabs.map(function (item) { return item.value; }), catalog.groups.map(function (group) { return group.key; }), 'Tabs value 必须保持目录分组 key，不能退化为数字索引');
runtime.onScrollAreaScroll({ detail: { scrollTop: 240, scrollHeight: 1200 } });
runtime.onGroupChange({ detail: { value: runtime.data.groupTabs[1].value } });
assert.strictEqual(runtime.data.activeGroup, 'size', 'Tabs 切换必须真实回写尺寸分区');
assert.strictEqual(runtime.data.scrollTop, 0, 'Tabs 切换分类必须把唯一目录 ScrollArea 自动回到顶部');
assert.ok(runtime.data.visibleUtilities.length > 20, '尺寸分区必须呈现完整 utility 目录');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-w-half', group: 'size' } } });
assert.ok(runtime.data.previewMeasureClasses.indexOf('pui-w-half') !== -1 && runtime.data.previewMeasureClasses.indexOf('pui-h-half') !== -1, '宽度 utility 必须只进入带可见高度 scaffold 的 measure 目标');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-aspect-video', group: 'size' } } });
assert.ok(runtime.data.previewMeasureClasses.indexOf('pui-w-half') !== -1 && runtime.data.previewMeasureClasses.indexOf('pui-aspect-video') !== -1, '宽度和比例属于不同 CSS 属性，必须能在同一 measure 目标组合');
assert.strictEqual(runtime.data.previewKind, 'aspect', '最近选择的比例 utility 必须切换到对应当前效果几何');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-w-quarter', group: 'size' } } });
assert.ok(runtime.data.previewMeasureClasses.indexOf('pui-w-half') === -1 && runtime.data.previewMeasureClasses.indexOf('pui-w-quarter') !== -1, '同一 width 类型必须替换，不能把冲突类同时挂到结果');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-bg-gradient-cyber-pink-blue', group: 'background' } } });
assert.strictEqual(runtime.data.activeGroup, 'background', '点击样式必须切换到它所属分类');
assert.ok(runtime.data.previewSurfaceClasses.indexOf('pui-bg-gradient-cyber-pink-blue') !== -1, '背景渐变必须只附加到当前 Surface');
assert.strictEqual(runtime.data.previewLayoutClasses, '', '背景 utility 不得污染布局根');
assert.strictEqual(runtime.data.visibleUtilities.find(function (item) { return item.name === 'pui-bg-gradient-cyber-pink-blue'; }).selected, true, '已应用样式必须有真实选中态');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-bg-gradient-black-gold', group: 'background' } } });
assert.strictEqual(runtime.data.visibleUtilities.find(function (item) { return item.name === 'pui-bg-gradient-cyber-pink-blue'; }).selected, false, '同一类型的新样式必须取消旧项');
assert.strictEqual(runtime.data.visibleUtilities.find(function (item) { return item.name === 'pui-bg-gradient-black-gold'; }).selected, true, '同一类型只能保留一个选中项');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-bg-gradient-black-gold', group: 'background' } } });
assert.strictEqual(runtime.data.visibleUtilities.find(function (item) { return item.name === 'pui-bg-gradient-black-gold'; }).selected, false, '再次点击已选项必须允许取消选择');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-dark-bg-muted', group: 'background' } } });
assert.strictEqual(runtime.data.previewThemeClass, 'pui-theme--dark', 'dark utility 的当前效果必须进入局部深色主题范围');
assert.ok(runtime.data.previewSurfaceClasses.indexOf('pui-dark-bg-muted') !== -1, 'dark background 必须仍作用于 Surface');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-p-lg', group: 'spacing' } } });
assert.ok(runtime.data.previewSurfaceClasses.indexOf('pui-p-lg') !== -1, 'padding utility 必须作用于 spacing Surface');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-gap-y-xl', group: 'spacing' } } });
assert.ok(runtime.data.previewItemsClasses.indexOf('pui-gap-y-xl') !== -1, 'gap utility 必须作用于子项容器');
var backgroundSelectionCount = Object.keys(runtime.data.activeSelections).filter(function (key) { return key.indexOf('background:') === 0; }).length;
runtime.onResetPreview();
assert.strictEqual(runtime.data.previewHasSelection, false, '恢复当前分类后唯一预览必须回到默认状态');
assert.strictEqual(runtime.data.previewSurfaceClasses, '', '恢复间距分类必须清空它的 Surface utility');
assert.strictEqual(runtime.data.previewItemsClasses, '', '恢复间距分类必须清空它的 items utility');
assert.strictEqual(Object.keys(runtime.data.activeSelections).filter(function (key) { return key.indexOf('spacing:') === 0; }).length, 0, '恢复不得残留当前分类选择');
assert.strictEqual(Object.keys(runtime.data.activeSelections).filter(function (key) { return key.indexOf('background:') === 0; }).length, backgroundSelectionCount, '恢复当前分类不得清空其他分类选择');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-text-cut', group: 'typography' } } });
assert.ok(runtime.data.previewTextClasses.indexOf('pui-text-cut') !== -1, '文字裁切必须只作用于真实 Text 目标');
assert.strictEqual(runtime.data.previewSafety, 'trace', '不可见或裁切效果必须在唯一预览中保留轨迹');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-text-pink', group: 'typography' } } });
assert.ok(runtime.data.previewTextClasses.indexOf('pui-text-pink') !== -1, '精选文字色必须真实挂载到 Text 目标');
assert.deepStrictEqual(clipboardWrites, [], '样式选择不得调用微信剪贴板');
runtime.onOpenSearch();
runtime.onStyleSearchChange({ detail: { value: 'grid-cols-3' } });
assert.deepStrictEqual(runtime.data.searchResults.map(function (item) { return item.name; }), ['pui-grid-cols-3'], 'Navbar 搜索必须过滤完整 utility 目录');
runtime.onSearchResultTap({ currentTarget: { dataset: { utility: 'pui-grid-cols-3', group: 'layout' } } });
assert.strictEqual(runtime.data.activeGroup, 'layout', '搜索结果必须回到所属分类');
assert.strictEqual(runtime.data.visibleUtilities[0].group, 'layout', '搜索结果切换分类后必须回写对应的完整 utility 列表');
assert.ok(runtime.data.previewLayoutClasses.indexOf('pui-grid-layout') !== -1 && runtime.data.previewLayoutClasses.indexOf('pui-grid-cols-3') !== -1, 'grid 轨道必须作用于 layout 目标并包含真实 grid scaffold');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-col-span-2', group: 'layout' } } });
assert.ok(runtime.data.previewItemClasses.indexOf('pui-col-span-2') !== -1, 'col-span 必须作用于主子项而不是整个预览根');
runtime.onUtilityTap({ currentTarget: { dataset: { utility: 'pui-hidden', group: 'layout' } } });
assert.ok(runtime.data.previewTargetClasses.indexOf('pui-hidden') !== -1 && runtime.data.previewSafety === 'trace', 'hidden 必须隐藏目标，同时由当前效果容器保留轨迹');
runtime.onScrollAreaScroll({ detail: { scrollTop: 240, scrollHeight: 1200 } });
assert.strictEqual(runtime.data.scrollTop, 240, 'ScrollArea 滑动后必须把真实 scrollTop 回写给 BackTop');
runtime.onBackToTop();
assert.strictEqual(runtime.data.scrollTop, 0, 'BackTop 点击必须把同一个受控值写回 ScrollArea 与 BackTop，原生 scroll-top 负责真实回顶');
runtime.onScrollAreaScroll({ detail: { scrollTop: 0, scrollHeight: 1200 } });
assert.strictEqual(runtime.data.scrollTop, 0, '真实 scroll 事件回写仍必须保持顶部完成态');
runtime.onScrollAreaScroll({ detail: { scrollTop: 260, scrollHeight: 1200 } });
runtime.onBackToTop();
assert.strictEqual(runtime.data.scrollTop, 0, '重复滚动后再次点击必须继续使用受控 scrollTop 回到顶部');
runtime.data.layoutReady = true;
runtime._workspaceHeight = 600;
runtime.measurePreviewLayout();
assert.strictEqual(runtime.data.previewHeight, 60, '390px 下预览必须固定收敛为120rpx当前效果条');
assert.strictEqual(runtime.data.utilityScrollTop, 78, '目录必须从14px页面 inset、60px当前效果条和4px关联间距后开始');
assert.strictEqual(runtime.data.utilityScrollHeight, '508px', '目录必须占用当前效果条之外的全部剩余工作区并保留底部 inset');

console.log('miniprogram Style Utilities second-tab contract tests passed');
