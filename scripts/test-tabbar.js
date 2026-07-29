const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'tabbar/tabbar.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
}, { filename: 'tabbar/tabbar.js' });
assert(definition, 'Tabbar component definition must be registered');
assert.strictEqual(definition.options.virtualHost, undefined, 'Tabbar 不能启用 virtualHost；它会改变固定三行页面的真实高度测量语义');

const PUBLIC_PROPS = [
  'items', 'value', 'defaultValue', 'theme', 'shape', 'bordered', 'split', 'fixed',
  'placeholder', 'safeAreaInsetBottom', 'zIndex', 'disabled', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'Tabbar publishes only the 14 reviewed Props');
assert.strictEqual(definition.properties.bordered.value, false, 'Tabbar defaults to a transparent top boundary');
assert.strictEqual(definition.properties.split.value, true, 'Tabbar split defaults to the TDesign-compatible visible separator');
['scrollable', 'showIcon', 'showLabel', 'maxLabelLength', 'activeColor', 'inactiveColor',
  'customAction', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText',
  'height', 'floatingOffset', 'duration', 'easing']
  .forEach((key) => assert(!definition.properties[key], `${key} must not return to the public Tabbar API`));

const ITEMS = [
  { label: '数字零', value: 0, icon: 'number', badge: 0 },
  { label: '字符串零', value: '0', icon: 'text' },
  { label: '布尔值', value: false, icon: 'close' },
  { label: '空字符串', value: '', icon: 'minus' },
  { label: '禁用', value: 'disabled', disabled: true },
];

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const uncontrolled = create({ items: ITEMS, defaultValue: 0, fixed: false });
assert.strictEqual(uncontrolled.instance.data.innerValue, 0);
assert.strictEqual(uncontrolled.instance.data.activeIndex, 0);
assert.strictEqual(uncontrolled.instance.data.normalizedItems[0].badge, 0, 'badge=0 is preserved');
uncontrolled.instance.requestSelect(1, 'item');
assert.strictEqual(uncontrolled.instance.data.innerValue, '0', 'number 0 and string 0 remain distinct');
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['click', 'change']);
assert.strictEqual(uncontrolled.events[1].detail.previousValue, 0);
uncontrolled.events.length = 0;
uncontrolled.instance.requestSelect(1, 'item');
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['click'], 'same item only emits click');
uncontrolled.events.length = 0;
uncontrolled.instance.requestSelect(2, 'item');
uncontrolled.instance.requestSelect(3, 'item');
assert.strictEqual(uncontrolled.instance.data.innerValue, '', 'false and empty string remain distinct legal values');

const controlled = create({ items: ITEMS, value: 0, defaultValue: false });
controlled.instance.requestSelect(2, 'item');
assert.strictEqual(controlled.instance.data.innerValue, 0, 'controlled Tabbar waits for parent write-back');
assert.strictEqual(controlled.events[1].name, 'change');
assert.strictEqual(controlled.events[1].detail.controlled, true);
controlled.instance.data.value = false;
controlled.instance.syncState();
controlled.instance.data.value = null;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, false, 'controlled to uncontrolled keeps the last controlled value');

const invalidControlled = create({ items: ITEMS, value: ['home'] });
assert.strictEqual(invalidControlled.instance.data.activeIndex, -1, 'array value is not a hidden multi-select mode');
assert.strictEqual(invalidControlled.instance.data.innerValue, null, 'invalid controlled value keeps no active destination');
const invalidDefault = create({ items: ITEMS, defaultValue: { value: 'home' } });
assert.strictEqual(invalidDefault.instance.data.innerValue, 0, 'invalid non-controlled default falls back to the first available destination');
const invalidItem = create({ items: [{ label: '非法', value: ['home'] }, { label: '正常', value: 'ok' }] });
assert.strictEqual(invalidItem.instance.data.normalizedItems[0].value, 0, 'invalid item value falls back to its index');

const disabledOnly = create({ items: [{ label: '不可用', value: 'disabled', disabled: true }] });
assert.strictEqual(disabledOnly.instance.data.innerValue, null);
assert.strictEqual(disabledOnly.instance.data.activeIndex, -1, 'all-disabled items do not create a fake active destination');
assert.strictEqual(disabledOnly.instance.requestSelect(0, 'item'), false);
assert.deepStrictEqual(disabledOnly.events, []);

const empty = create({ items: [] });
assert.strictEqual(empty.instance.data.normalizedItems.length, 0);
assert.strictEqual(empty.instance.data.activeIndex, -1);

const iconOnly = create({ items: [{ label: '', value: 'home', icon: 'home', ariaLabel: '首页' }], fixed: false });
assert.strictEqual(iconOnly.instance.data.normalizedItems[0].label, '', 'an explicit empty label enables the icon-only Tabbar form');
assert.strictEqual(iconOnly.instance.data.normalizedItems[0].ariaLabel, '首页', 'icon-only items retain an accessible destination name');
assert(iconOnly.instance.data.rootClass.includes('pui-tabbar--all-icon-only'), 'all-icon Tabbar uses the alternate shared indicator baseline');
const mixedLabels = create({ items: [{ label: '首页', value: 'home', icon: 'home' }, { label: '', value: 'profile', icon: 'profile', ariaLabel: '我的' }], fixed: false });
assert(!mixedLabels.instance.data.rootClass.includes('pui-tabbar--all-icon-only'), 'one visible label keeps every item on the common labeled indicator baseline');

const motion = create({ items: ITEMS, defaultValue: 0, reduceMotion: false });
assert(motion.instance.data.rootStyle.includes('500ms'), 'Tabbar motion is fixed at 500ms');
motion.instance.data.reduceMotion = true;
motion.instance.syncState();
assert(motion.instance.data.rootStyle.includes('1ms'), 'reduceMotion compresses motion to 1ms');

const wxml = fs.readFileSync(path.join(root, 'tabbar/tabbar.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'tabbar/tabbar.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'tabbar/tabbar.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const alignment = fs.readFileSync(path.join(root, 'docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'utf8');

assert(wxml.includes('wx:if="{{normalizedItems.length}}"'), 'empty items do not render a fake shell');
assert(wxml.includes('<pui-button'));
assert(wxml.includes('<pui-badge'));
assert(wxml.includes('<pui-icon'));
assert(wxml.includes('<pui-button class="pui-tabbar__button-host" block="{{true}}" custom-class="pui-tabbar__item" theme="default" variant="transparent" surface="transparent"'), 'native Tabbar 必须组合 PUI Button 的 transparent 视觉变体与 transparent surface，消除条目卡片外观并让宿主成为等分轨道');
assert(!wxml.includes('custom-style="box-sizing:border-box;display:flex;'), 'Tabbar 不能用 Button 行内样式绕过组件宿主的布局问题');
assert(wxml.includes('icon-only="{{!item.label}}"'), '纯图标 Tabbar 必须通过 Button iconOnly 真实移除空默认内容轨道');
assert(wxml.includes("pui-tabbar__item-wrap--icon-only"), '纯图标 Tabbar 必须由组件公开自身结构状态，以调整短横而非由页面补位');
assert(wxml.includes('wx:if="{{item.resolvedIcon}}" slot="icon" class="pui-tabbar__icon"'), 'Tabbar 图标必须进入 PUI Button icon Slot，与标签默认 Slot 分工');
assert(wxml.includes('wx:if="{{item.label}}"'), 'an icon-only item does not leave an empty text node in native WXML');
assert(!wxml.includes('pui-loading'));
assert(!wxml.includes('stateType'));
assert(!wxml.includes('slot name="action"'));
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert.strictEqual(json.usingComponents['pui-badge'], '../badge/badge');
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert(!json.usingComponents['pui-loading']);
assert(!/transition\s*:[^;]*\bheight\b/.test(wxss), 'Tabbar does not transition height:auto');
assert(wxss.includes('.pui-tabbar--split .pui-tabbar__item-wrap + .pui-tabbar__item-wrap::before'), 'split uses an inset separator owned by the item wrapper');
assert(wxss.includes('border-top: 0;'), 'Tabbar default renders no top boundary');
assert(wxss.includes('.pui-tabbar--bordered { border-top: 1rpx solid var(--pui-glass-border); }'), 'Tabbar bordered=true restores the neutral top divider');
assert(wxss.includes('/* normal 是屏幕附着的透明导航布局，不应伪装成独立 Surface。 */\n  background: transparent;\n  border-top: 0;\n  box-shadow: none;\n  -webkit-backdrop-filter: none;\n  backdrop-filter: none;'), 'native normal Tabbar remains transparent and never consumes a panel shadow or frosted filter');
assert(wxss.includes('.pui-tabbar--shape-round {\n  overflow: hidden;\n  background: var(--pui-glass-surface-strong);') && wxss.includes('box-shadow: var(--pui-shadow-card);\n  -webkit-backdrop-filter: var(--pui-frosted-filter);\n  backdrop-filter: var(--pui-frosted-filter);'), 'native round Tabbar is the only independent Surface that consumes glass, shadow, and frost');
assert(wxss.includes('top: var(--pui-space-step-28);') && wxss.includes('bottom: var(--pui-space-step-28);'), 'native split separator uses the shorter 28px visual rhythm rather than a full-height Cell border');
assert(wxss.includes('.pui-tabbar__button-host') && wxss.includes('flex: 1;') && wxss.includes('width: 0;') && wxss.includes('height: 112rpx;'), 'native Tabbar 等分轨道 host 以微信兼容的 flex:1 + width:0 固定等分并采用统一导航高度');
assert(wxss.includes('min-height: 112rpx;'), 'native Tabbar reserves a calm 56px navigation rhythm');
assert(wxss.includes('.pui-tabbar__item .pui-button__content { overflow: visible; }'), 'native Tabbar Badge is not clipped by the shared Button content baseline');
assert(wxss.includes('.pui-tabbar--all-icon-only .pui-tabbar__item-wrap::after { bottom: var(--pui-space-step-20); }'), 'native all-icon Tabbar raises one shared indicator baseline');
assert(wxss.includes('.pui-tabbar--all-icon-only .pui-tabbar__icon { transform: translateY(var(--pui-space-step-4)); }'), 'native all-icon Tabbar lowers every icon with the same shared rhythm');
assert(!wxss.includes('.pui-tabbar__item-wrap--icon-only::after'), 'mixed-label Tabbar must not move an individual item indicator');
assert(!wxss.includes('.pui-tabbar__item {') || wxss.includes('background: transparent;'), 'Tabbar custom class can arrange contents but cannot reintroduce a Button-owned surface');
const buttonWxss = fs.readFileSync(path.join(root, 'button/button.wxss'), 'utf8');
assert(buttonWxss.includes('.pui-button--surface-transparent::after { border: 0 !important; }'), 'Tabbar 依赖 Button 组件根清除微信原生 ::after，不能以页面样式补丁隐藏未激活项底色');
assert(buttonWxss.includes('background-color: transparent !important;'), 'Tabbar 的 transparent surface 必须强制覆盖微信原生 button 默认底色');
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss), 'Tabbar CSS has no motion longer than 500ms');

assert.deepStrictEqual(metadata.apiProps.tabbar, PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiPropGroups.tabbar.flatMap((group) => group.keys), PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiEvents.tabbar.map((event) => event.name), ['click', 'change']);
assert.strictEqual(metadata.apiSlots.tabbar, undefined);
assert.strictEqual(metadata.apiMethods.tabbar, undefined);
assert(metadata.packageComponents.includes('tabbar'));

const tabbarPreviewSource = preview.slice(preview.indexOf('function tabbarSameValue'), preview.indexOf('function stepsStatus'));
assert(tabbarPreviewSource.includes('return left === right'));
assert(tabbarPreviewSource.includes('function isTabbarSelectionValue'));
assert(preview.includes("split: { type: 'boolean', value: true }"), 'H5 Props starts with split enabled');
assert(preview.includes("bordered: { type: 'boolean', value: false }, split: { type: 'boolean', value: true }"), 'H5 Tabbar shares the transparent-border default');
assert(tabbarPreviewSource.includes('function tabbarPreviewValueText'));
assert(tabbarPreviewSource.includes('function tabbarScenarios'));
assert(tabbarPreviewSource.includes("id: 'text'"));
assert(tabbarPreviewSource.includes("id: 'icon'"));
assert(tabbarPreviewSource.includes("id: 'badge'"));
assert(tabbarPreviewSource.includes("id: 'round'"));
assert(tabbarPreviewSource.includes('data-tabbar-demo-section'));
assert(tabbarPreviewSource.includes('class="pui-tabbar-demo-section"'));
assert(!tabbarPreviewSource.includes("demoAction: 'tabbar-scenario'"));
assert(tabbarPreviewSource.includes("item.hasBadge ? badgeSample"));
assert(tabbarPreviewSource.includes("hasExplicitLabel"), 'H5 uses the same explicit-empty-label contract as native');
assert(tabbarPreviewSource.includes('const iconSlot = visual ?'), 'H5 Tabbar 必须把图标投影到与小程序一致的 PUI Button icon Slot');
assert(tabbarPreviewSource.includes('iconOnly: !item.label,'), 'H5 纯图标 Tabbar 必须通过共享 Button 镜像移除空默认内容轨道');
assert(tabbarPreviewSource.includes("${!item.label ? 'is-icon-only' : ''}"), 'H5 mirrors the native icon-only indicator state');
assert(tabbarPreviewSource.includes("allIconOnly ? 'is-all-icon-only' : ''"), 'H5 derives the alternate baseline from the whole Tabbar, not one item');
assert(tabbarPreviewSource.includes('block: true,'), 'H5 Tabbar 必须镜像原生 Button 的 block 等分轨道');
assert(tabbarPreviewSource.includes("variant: 'transparent',"), 'H5 Tabbar 必须镜像原生的 transparent Button 视觉变体');
assert(tabbarPreviewSource.includes("surface: 'transparent',"), 'H5 Tabbar must use the same transparent Button surface composition');
assert(tabbarPreviewSource.includes('defaultSlot: item.label ? `<span class="pui-tabbar-preview__label">'), 'H5 omits the label node for icon-only items');
assert(tabbarPreviewSource.includes("dataAttributes: { 'tabbar-sample': sampleId }"));
assert(tabbarPreviewSource.includes('data-tabbar-event-sequence'), 'normalized overview retains machine-verifiable event order on the component viewport');
assert(preview.includes("preview-device__viewport--edge-to-edge"), 'edge-to-edge previews opt out of symmetric scrollbar gutters');
assert(tabbarPreviewSource.includes("eventTarget.setAttribute('data-tabbar-event-sequence', demo.tabbarEvent)"));
assert(tabbarPreviewSource.includes('state.props[state.current].value = item.value'), 'H5 controlled sample performs a real parent Prop write-back');
assert(!tabbarPreviewSource.includes('loadingComponent'));
assert(!tabbarPreviewSource.includes('tabbar-retry'));
assert(!tabbarPreviewSource.includes('tabbar-action'));
assert(previewStyles.includes('.pui-tabbar-demo-section'));
assert(!previewStyles.includes('.pui-tabbar-scenario__nav'));
assert(previewStyles.includes('.pui-tabbar-showcase.demo-section'));
assert(previewStyles.includes('gap: var(--pui-preview-section-gap);'));
assert(previewStyles.includes('.pui-tabbar-preview.is-reduced-motion'));
assert(previewStyles.includes('.pui-tabbar-preview.is-split .pui-tabbar-preview__item + .pui-tabbar-preview__item::before'), 'split uses an inset separator rather than a full-height Cell border');
assert(previewStyles.includes('top: var(--pui-preview-space-step-28);') && previewStyles.includes('bottom: var(--pui-preview-space-step-28);'), 'H5 split separator mirrors the native shorter inset');
assert(previewStyles.includes('min-height: 56px;'), 'H5 Tabbar mirrors the native 56px navigation rhythm');
assert(previewStyles.includes('.preview-device__viewport--edge-to-edge { scrollbar-gutter: auto; }'), 'edge-to-edge Tabbar fills the visible PreviewDevice width');
assert(previewStyles.includes('.preview-device__viewport--edge-to-edge::-webkit-scrollbar { display: none; }'), 'edge-to-edge Tabbar does not lose its right edge to a classic scrollbar gutter');
assert(previewStyles.includes('--pui-button-size: 56px;'), 'shared small Button sizing cannot compress the Tabbar hit area');
assert(previewStyles.includes('.pui-tabbar-preview__item.pui-button-preview > .pui-button-preview__content'), 'H5 Tabbar restores Badge overflow after the shared Button baseline');
assert(previewStyles.includes('.pui-tabbar-preview {') && previewStyles.includes('/* 普通形态的 Badge 可越过图标锚点；根节点不能成为裁切边界。 */\n  overflow: visible;'), 'normal H5 Tabbar root cannot clip a positioned Badge');
assert(previewStyles.includes('.pui-tabbar-preview--shape-round {\n  overflow: hidden;'), 'round H5 Tabbar keeps its capsule clipping boundary');
assert(previewStyles.includes('/* normal 是屏幕附着的透明导航布局，不应伪装成独立 Surface。 */\n  background: transparent;\n  border-top: 0;\n  box-shadow: none;\n  -webkit-backdrop-filter: none;\n  backdrop-filter: none;'), 'H5 normal Tabbar remains transparent and never consumes a panel shadow or frosted filter');
assert(previewStyles.includes('.pui-tabbar-preview--shape-round {\n  overflow: hidden;\n  background: var(--surface-strong);') && previewStyles.includes('box-shadow: var(--shadow-floating);\n  -webkit-backdrop-filter: var(--blur);\n  backdrop-filter: var(--blur);'), 'H5 round Tabbar is the only independent Surface that consumes glass, shadow, and frost');
assert(previewStyles.includes('border-top: 0;'), 'H5 Tabbar default renders no top boundary');
assert(previewStyles.includes('.pui-tabbar-preview.is-bordered { border-top: 1px solid var(--border); }'), 'H5 Tabbar bordered=true restores the neutral top divider');
assert(previewStyles.includes('body .app-shell[data-page-mode] .preview-stage .pui-tabbar-preview {\n  box-shadow: none;\n}'), 'page-mode cascade cannot reintroduce an edge shadow for normal H5 Tabbar');
assert(previewStyles.includes('.pui-tabbar-preview .pui-tabbar-preview__item.is-active { color: var(--brand); }'), 'H5 active item uses the semantic primary token');
assert(previewStyles.includes('.pui-tabbar-preview .pui-tabbar-preview__item.pui-button-preview:disabled {\n  background: transparent;\n  background-color: transparent !important;\n  border-color: transparent;'), 'H5 disabled Tabbar item remains part of the unique transparent navigation surface');
assert(previewStyles.includes('.pui-tabbar-preview__item::after'), 'H5 Tabbar uses a theme-independent active indicator');
assert(previewStyles.includes('.pui-tabbar-preview.is-all-icon-only .pui-tabbar-preview__item::after { bottom: var(--pui-preview-space-step-20); }'), 'H5 all-icon Tabbar raises one shared indicator baseline');
assert(previewStyles.includes('.pui-tabbar-preview.is-all-icon-only .pui-tabbar-preview__icon { transform: translateY(var(--pui-preview-space-step-4)); }'), 'H5 all-icon Tabbar mirrors the shared icon offset');
assert(!previewStyles.includes('pui-tabbar-preview--theme-tag .pui-tabbar-preview__item.is-active'), 'H5 tag theme must not reintroduce an active item Surface');
assert(wxss.includes('.pui-tabbar__item-wrap--active .pui-tabbar__item { color: var(--pui-color-brand);'), 'native active item uses the semantic primary token');
assert(wxss.includes('.pui-tabbar__item-wrap--active::after'), 'native active indicator applies without a themed item Surface');
assert(!wxss.includes('.pui-tabbar--theme-tag .pui-tabbar__item-wrap--active'), 'native tag theme must not reintroduce an active item Surface');

const usageSource = preview.slice(preview.indexOf("if (runtimeId === 'tabbar')"), preview.indexOf("if (runtimeId === 'table')"));
assert(!usageSource.includes('bind:'), 'Tabbar basic WXML contains no event bindings');
assert(usageSource.includes('const tabbarSourceDefaults = componentPropDefaults.tabbar'));
assert(usageSource.includes("items: 'tabbarItems'"));
assert(usageSource.includes("value: 'tabbarValue'"));
assert(preview.includes('function tabbarPreviewCodeExamples'));
assert(preview.includes('function tabbarScenarioWxml'));
assert(preview.includes('textTabbarItems'));
assert(preview.includes('iconTabbarItems'));
assert(preview.includes('messageTabbarItems'));
assert(preview.includes('accountTabbarItems'));
const exampleSection = exampleWxml.slice(exampleWxml.indexOf('<pui-card title="Tabbar 基础用法"'), exampleWxml.indexOf('<pui-card title="Steps'));
assert(exampleSection.includes('<pui-tabbar'));
assert(!exampleSection.includes('bind:'), 'example basic Tabbar contains no binds');
assert(!exampleJs.includes('onTabbarInput'));
assert(!exampleJs.includes('onTabbarRetry'));

assert(api.includes('## Tabbar'));
assert(/\d+\. Tabbar/.test(compatibility));
assert(alignment.includes('| 32 | Tabbar | TabBar / TabBarItem |'));
assert(fs.existsSync(path.join(root, 'docs/components/TABBAR.md')), 'Tabbar semantic contract must exist');

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = path.join(root, `tabbar/tabbar.${extension}`);
  const distFile = path.join(root, `miniprogram_dist/tabbar/tabbar.${extension}`);
  assert.strictEqual(sha(sourceFile), sha(distFile), `tabbar source/dist ${extension} must stay identical`);
  const installedFile = path.join(root, `_example/node_modules/poemui-miniprogram/miniprogram_dist/tabbar/tabbar.${extension}`);
  assert(fs.existsSync(installedFile), `tabbar example install ${extension} must exist`);
  assert.strictEqual(sha(sourceFile), sha(installedFile), `tabbar source/example install ${extension} must stay identical`);
  const wechatFile = path.join(root, `_example/miniprogram/miniprogram_npm/poemui-miniprogram/tabbar/tabbar.${extension}`);
  if (fs.existsSync(wechatFile)) assert.strictEqual(sha(sourceFile), sha(wechatFile), `tabbar source/WeChat npm ${extension} must stay identical`);
});

console.log('Tabbar contract tests passed.');
