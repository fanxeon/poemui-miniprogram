const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'tabs/tabs.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  clearTimeout,
  setTimeout,
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    if (request === '../common/utils/platform-info') return { getWindowInfo: () => ({ windowWidth: 375 }) };
    throw new Error(`Unexpected dependency: ${request}`);
  },
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'tabs/tabs.js' });
assert(definition, 'Tabs component definition must be registered');

const PUBLIC_PROPS = [
  'items', 'value', 'defaultValue', 'variant', 'showBottomLine', 'spaceEvenly', 'split',
  'sticky', 'stickyOffset', 'swipeable', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'Tabs publishes only the 12 reviewed Props');
['size', 'scrollable', 'indicatorColor', 'indicatorWidth', 'swipeThreshold', 'loop', 'showContent',
  'customPrefix', 'customExtra', 'disabled', 'loading', 'error', 'retryText', 'duration', 'easing']
  .forEach((key) => assert(!definition.properties[key], `${key} must not return to the public Tabs API`));

const ITEMS = [
  { label: '数字零', value: 0, icon: 'component', badge: 0 },
  { label: '字符串零', value: '0' },
  { label: '布尔值', value: false, icon: 'edit' },
  { label: '空字符串', value: '' },
  { label: '禁用', value: 'disabled', disabled: true },
];

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const uncontrolled = create({ items: ITEMS, defaultValue: 0 });
assert.strictEqual(uncontrolled.instance.data.split, true, 'Tabs 默认保留 TDesign 式分隔线');
assert(uncontrolled.instance.data.rootClass.includes('pui-tabs--overflow-peek'), '超过四项必须自动进入半露横向轨道');
assert(!uncontrolled.instance.data.rootClass.includes('pui-tabs--evenly'), '超过四项不能仍然等分压缩');
assert.strictEqual(uncontrolled.instance.data.innerValue, 0);
assert.strictEqual(uncontrolled.instance.data.activeIndex, 0);
assert.strictEqual(uncontrolled.instance.data.normalizedItems[0].badge, 0, 'badge=0 is preserved');
uncontrolled.instance.requestSelection(1, 'tap', true);
assert.strictEqual(uncontrolled.instance.data.innerValue, '0', 'number 0 and string 0 remain distinct');
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['click', 'change']);
assert.strictEqual(uncontrolled.events[1].detail.previousValue, 0);
assert.strictEqual(uncontrolled.events[1].detail.item.value, '0');
assert(!Object.prototype.hasOwnProperty.call(uncontrolled.events[1].detail.item, 'id'), 'event item excludes private geometry data');
uncontrolled.events.length = 0;
uncontrolled.instance.requestSelection(1, 'tap', true);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['click'], 'same item only emits click');
uncontrolled.events.length = 0;
uncontrolled.instance.requestSelection(2, 'tap', true);
uncontrolled.instance.requestSelection(3, 'tap', true);
assert.strictEqual(uncontrolled.instance.data.innerValue, '', 'false and empty string are distinct legal values');

const evenlyFour = create({ items: ITEMS.slice(0, 4), defaultValue: 0 });
assert(evenlyFour.instance.data.rootClass.includes('pui-tabs--evenly'), '四项及以下默认等分');
assert(!evenlyFour.instance.data.rootClass.includes('pui-tabs--overflow-peek'), '四项及以下不应进入半露轨道');
const forcedHorizontal = create({ items: ITEMS.slice(0, 3), defaultValue: 0, spaceEvenly: false });
assert(!forcedHorizontal.instance.data.rootClass.includes('pui-tabs--evenly'), 'spaceEvenly=false 仍可让四项及以下使用横向阅读轨道');
assert(!forcedHorizontal.instance.data.rootClass.includes('pui-tabs--overflow-peek'), '半露轨道只由超过四项触发');

const controlled = create({ items: ITEMS, value: 0, defaultValue: false });
controlled.instance.requestSelection(2, 'tap', true);
assert.strictEqual(controlled.instance.data.innerValue, 0, 'controlled Tabs waits for parent write-back');
assert.strictEqual(controlled.events[1].name, 'change');
assert.strictEqual(controlled.events[1].detail.controlled, true);
controlled.instance.data.value = false;
controlled.instance.syncState();
controlled.instance.data.value = null;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, false, 'controlled to uncontrolled keeps last controlled value');

const disabledOnly = create({ items: [{ label: 'A', value: 'a', disabled: true }] });
assert.strictEqual(disabledOnly.instance.data.innerValue, null);
assert.strictEqual(disabledOnly.instance.data.activeIndex, -1, 'all-disabled items do not create a fake active tab');
assert.strictEqual(disabledOnly.instance.requestSelection(0, 'tap', true), false);
assert.deepStrictEqual(disabledOnly.events, []);

const motion = create({ items: ITEMS, defaultValue: 0, reduceMotion: false, stickyOffset: 900 });
assert(motion.instance.data.rootStyle.includes('500ms'), 'Tabs motion is fixed at 500ms');
assert.strictEqual(motion.instance.data.stickyStyle, 'top:400rpx;');
motion.instance.data.reduceMotion = true;
motion.instance.syncState();
assert(motion.instance.data.rootStyle.includes('1ms'), 'reduceMotion compresses motion to 1ms');

const swipe = create({ items: ITEMS, defaultValue: '0', swipeable: true });
swipe.instance.onTouchStart({ touches: [{ clientX: 120, clientY: 40 }] });
swipe.instance.onTouchEnd({ changedTouches: [{ clientX: 40, clientY: 44 }] });
assert.strictEqual(swipe.instance.data.innerValue, false);
assert.strictEqual(swipe.events[0].name, 'change');
assert.strictEqual(swipe.events[0].detail.source, 'swipe');
swipe.instance.onTouchStart({ touches: [{ clientX: 100, clientY: 20 }] });
swipe.instance.onTouchEnd({ changedTouches: [{ clientX: 96, clientY: 100 }] });
assert.strictEqual(swipe.instance.data.innerValue, false, 'vertical gesture does not switch tabs');
swipe.instance.onTouchStart({ touches: [{ clientX: 100, clientY: 20 }] });
swipe.instance.onTouchCancel();
swipe.instance.onTouchEnd({ changedTouches: [{ clientX: 10, clientY: 20 }] });
assert.strictEqual(swipe.instance.data.innerValue, false, 'touchcancel clears the gesture');
swipe.instance.data.defaultValue = '';
swipe.instance._uncontrolledValue = '';
swipe.instance.syncState();
assert.strictEqual(swipe.instance.move(1, 'swipe'), false, 'swipe does not loop past the final available item');

const wxml = fs.readFileSync(path.join(root, 'tabs/tabs.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'tabs/tabs.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'tabs/tabs.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const alignment = fs.readFileSync(path.join(root, 'docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'utf8');
const contract = path.join(root, 'docs/components/TABS.md');

assert(wxml.includes('<pui-button'));
assert(wxml.includes('<pui-badge'));
assert(wxml.includes('<pui-icon'));
assert(wxml.includes('custom-class="pui-tabs__badge"'), '徽标必须作为标签后的独立 PUI Badge，而不是包住整段 Tab 标签');
assert(wxml.includes('class="pui-tabs__label-text"'), '只有标签文字允许省略，Badge 必须保持独立可读');
assert(!/pui-badge[^>]*>\s*<view class="pui-tabs__label"/.test(wxml), 'Tabs 不得再用 Badge 包裹整段标签造成绝对定位徽标被父级裁切');
assert(!wxml.includes('pui-loading'));
assert(!wxml.includes('stateType'));
assert(!wxml.includes('slot name="prefix"'));
assert(!wxml.includes('slot name="extra"'));
assert(wxml.includes('<slot></slot>'));
assert(wxml.includes('bindtouchcancel="onTouchCancel"'));
assert(wxml.includes("item.active && showBottomLine"), 'Line Indicator 必须直接挂在真实激活 Button 内，而不是在横向轨道上另算坐标');
assert(/<pui-button[\s\S]*?\n\s*block\n/.test(wxml), 'Tabs 必须使用 PUI Button 的 block 能力，让真实点击根收进当前轨道');
assert(!source.includes('createSelectorQuery'), 'Tabs 下划线不得依赖 ScrollView 的异步 rect 测量');
assert(!source.includes('fixedIndicatorStyle'), 'Tabs 下划线不得依赖预测轨道公式');
assert(wxss.includes('left: 50%;') && wxss.includes('transform: translateX(-50%);'), 'Indicator 必须以激活 Tab 自身中心为锚点');
assert(wxss.includes('min-width: 0;'), 'Tabs 专用 Button 必须允许 block Button 在当前轨道收缩');
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert.strictEqual(json.usingComponents['pui-badge'], '../badge/badge');
assert(!json.usingComponents['pui-loading']);
assert(wxss.includes('.pui-tabs--tag .pui-tabs__header'));
assert(wxss.includes('--pui-tabs-header-height: 96rpx;'), 'Tabs 必须公开继承用的 Header 语义高度 Token');
assert(wxss.includes('min-height: var(--pui-tabs-header-height);'));
assert(wxss.includes('height: 6rpx;'));
assert(wxss.includes('--pui-tabs-scroll-item-min-width: 160rpx;'), '横向 Tabs 必须使用统一的半露出轨宽 Token');
assert(wxss.includes('min-width: var(--pui-tabs-scroll-item-min-width);'), '横向 Tabs 必须消费统一的最小轨宽');
assert(wxss.includes('.pui-tabs--evenly .pui-tabs__item') && wxss.includes('flex: 1 1 0;'), 'spaceEvenly 必须允许等分轨道收缩');
assert(wxss.includes('.pui-tabs--overflow-peek .pui-tabs__item') && wxss.includes('flex: 0 0 22.222222%;'), '超过四项必须固定为四个完整项加半个下一项');
assert(wxss.includes('.pui-tabs--overflow-peek .pui-tabs__row') && wxss.includes('width: 100%;'), '半露轨道必须以 ScrollView 宽度为百分比基准');
assert(wxss.includes('.pui-tabs__label-text'));
assert(wxss.includes('.pui-tabs__badge'));
assert(wxss.includes('overflow: visible;'), 'Tabs 条目必须为独立 Badge 留出可见空间');
assert(!wxss.includes('box-shadow: var(--pui-glass-shadow-soft);'), '默认 Tabs Header 不是悬浮卡片');
assert(!/\.pui-tabs--without-indicator[\s\S]{0,100}display\s*:\s*none/.test(wxss));
assert(!/transition\s*:[^;]*\bheight\b/.test(wxss), 'Tabs does not transition height:auto');
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss), 'Tabs CSS has no motion longer than 500ms');

assert.deepStrictEqual(metadata.apiProps.tabs, PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiPropGroups.tabs.flatMap((group) => group.keys), PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiEvents.tabs.map((event) => event.name), ['click', 'change']);
assert.deepStrictEqual(metadata.apiSlots.tabs.map((slot) => slot.name), ['default']);
assert.strictEqual(metadata.apiMethods.tabs, undefined);
assert(metadata.packageComponents.includes('tabs'));

const tabsPreviewSource = preview.slice(preview.indexOf('function tabsSameValue'), preview.indexOf('function navbarPreviewMotion'));
assert(tabsPreviewSource.includes('function tabsPreviewMarkup'));
assert(tabsPreviewSource.includes('<h3>基础用法</h3>'));
assert(tabsPreviewSource.includes('<h3>标签样式</h3>'));
assert(tabsPreviewSource.includes('<h3>徽标与禁用</h3>'));
assert(tabsPreviewSource.includes('<h3>可横向浏览</h3>'));
assert(tabsPreviewSource.includes("item.badge === '' ? '' : badgeSample({ count: item.badge, size: 'small', standalone: true, customClass: 'pui-tabs-preview__badge'"));
assert(tabsPreviewSource.includes('pui-tabs-preview__tab-content'));
assert(tabsPreviewSource.includes("dataAttributes: { 'tabs-sample': sampleId }"));
assert(tabsPreviewSource.includes('function tabsPreviewLayout'), 'H5 必须复用和小程序一致的自动轨道判定');
assert(tabsPreviewSource.includes('block: layout.evenly'), 'H5 仅在自动等分轨道向 Button 传 block');
assert(tabsPreviewSource.includes("layout.overflowPeek ? 'is-overflow-peek' : ''"), 'H5 必须公开半露轨道状态类');
assert(tabsPreviewSource.includes("props.variant === 'tag' || props.variant === 'pills' ? 'tag' : 'line'"));
assert(tabsPreviewSource.includes('function bindTabsPreviewRuntime'));
assert(tabsPreviewSource.includes("panel.addEventListener('pointercancel'"));
assert(tabsPreviewSource.includes('Math.abs(deltaX) < 36'));
assert(!tabsPreviewSource.includes('tabs-select-method'));
assert(!tabsPreviewSource.includes('tabs-retry'));
assert(!tabsPreviewSource.includes('loadingComponent'));
assert(!tabsPreviewSource.includes('data-tabs-event'), '概览不保留工程事件提示');
assert(previewStyles.includes('.pui-tabs-showcase > .pui-showcase-section + .pui-showcase-section'));
assert(previewStyles.includes('.pui-tabs-preview.is-reduced-motion'));
assert(previewStyles.includes('.pui-tabs-preview--tag .pui-tabs__header') === false, 'H5 class 不得误引用原生类');
assert(previewStyles.includes('.pui-tabs-preview--tag .pui-tabs-preview__header'));
assert(previewStyles.includes('min-height: 48px;'));
assert(previewStyles.includes('height: 3px;'));
assert(previewStyles.includes('--pui-tabs-preview-scroll-item-min-width: 80px;'), 'H5 必须镜像横向 Tabs 的半露出轨宽');
assert(previewStyles.includes('body .app-shell[data-page-mode] .preview-stage .pui-tabs-preview:not(.is-evenly) .pui-tabs-preview__button.pui-button-preview.pui-button--text'), 'H5 Tabs 必须抵消共享 text Button 的最小宽覆盖');
assert(previewStyles.includes('pui-tabs-preview.is-evenly .pui-tabs-preview__button.pui-button-preview') && previewStyles.includes('flex: 1 1 0;'), 'H5 spaceEvenly 必须允许等分轨道收缩');
assert(previewStyles.includes('pui-tabs-preview.is-overflow-peek .pui-tabs-preview__button.pui-button-preview.pui-button--text') && previewStyles.includes('flex: 0 0 22.222222%;'), 'H5 超过四项必须镜像四个完整项加半个下一项');
assert(previewStyles.includes('body .app-shell[data-page-mode] .preview-stage .pui-tabs-preview__button.pui-button-preview > .pui-button-preview__content'));
assert(previewStyles.includes('body .app-shell[data-page-mode] .pui-tabs-preview > .pui-tabs-preview__header .pui-tabs-preview__button.pui-button-preview'), 'Tabs frost must be owned by the shared header instead of each Button');
assert(previewStyles.includes('body .app-shell[data-page-mode][data-frost="on"] .pui-tabs-preview > .pui-tabs-preview__header'), 'Tabs header receives the global frost effect');
assert(previewStyles.includes('pui-tabs-preview__tab-content > .pui-tabs-preview__badge.pui-badge-demo'));
assert(!previewStyles.includes('.pui-tabs-preview__feedback'));

const usageSource = preview.slice(preview.indexOf("if (runtimeId === 'tabs')"), preview.indexOf("if (runtimeId === 'table')"));
assert(!usageSource.includes('bind:'), 'Tabs basic WXML contains no event bindings');
assert(usageSource.includes('const tabsSourceDefaults = componentPropDefaults.tabs'), 'Tabs usage code compares against source defaults');
assert(usageSource.includes("items: 'tabItems'"), 'Tabs usage code preserves the data-driven items binding');
assert(usageSource.includes("defaultValue: 'defaultTabValue'"), 'Tabs usage code preserves the uncontrolled initial value binding');
assert(!usageSource.includes('实例方法'));
assert(!usageSource.includes('customPrefix'));
assert(exampleWxml.includes('<pui-tabs items="{{tabsItems}}" default-value="base" aria-label="组件分类">'));
assert(!exampleWxml.slice(exampleWxml.indexOf('<pui-card title="Tabs 基础用法"'), exampleWxml.indexOf('<pui-card title="Breadcrumb')).includes('bind:'), 'example basic Tabs contains no binds');
assert(!exampleJs.includes('onTabsInput'));
assert(!exampleJs.includes('onTabsRetry'));

assert(api.includes('## Tabs'));
assert(/\d+\. Tabs/.test(compatibility));
assert(alignment.includes('| 31 | Tabs | Tabs / TabPanel |'));
assert(fs.existsSync(contract), 'Tabs semantic contract must exist');

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = path.join(root, `tabs/tabs.${extension}`);
  const distFile = path.join(root, `miniprogram_dist/tabs/tabs.${extension}`);
  assert.strictEqual(sha(sourceFile), sha(distFile), `tabs source/dist ${extension} must stay identical`);
  const installedFile = path.join(root, `_example/node_modules/poemui-miniprogram/miniprogram_dist/tabs/tabs.${extension}`);
  assert(fs.existsSync(installedFile), `tabs example install ${extension} must exist`);
  assert.strictEqual(sha(sourceFile), sha(installedFile), `tabs source/example install ${extension} must stay identical`);
  const wechatFile = path.join(root, `_example/miniprogram/miniprogram_npm/poemui-miniprogram/tabs/tabs.${extension}`);
  if (fs.existsSync(wechatFile)) assert.strictEqual(sha(sourceFile), sha(wechatFile), `tabs source/WeChat npm ${extension} must stay identical`);
});

console.log('Tabs contract tests passed.');
