const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'navigation-menu/navigation-menu.js'), 'utf8');
const semanticContract = fs.readFileSync(path.join(root, 'docs/components/NAVIGATION-MENU.md'), 'utf8');
let definition = null;
const navigationCalls = [];
const wx = {
  nextTick(callback) { callback(); },
  navigateTo(options) { navigationCalls.push({ type: 'navigateTo', options }); if (options.success) options.success({ errMsg: 'navigateTo:ok' }); },
  redirectTo(options) { navigationCalls.push({ type: 'redirectTo', options }); if (options.success) options.success({ errMsg: 'redirectTo:ok' }); },
  switchTab(options) { navigationCalls.push({ type: 'switchTab', options }); if (options.success) options.success({ errMsg: 'switchTab:ok' }); },
  reLaunch(options) { navigationCalls.push({ type: 'reLaunch', options }); if (options.success) options.success({ errMsg: 'reLaunch:ok' }); },
  navigateBack(options) { navigationCalls.push({ type: 'navigateBack', options }); if (options.success) options.success({ errMsg: 'navigateBack:ok' }); },
};
const sandbox = {
  console,
  isFinite,
  setTimeout,
  clearTimeout,
  wx,
  require: () => ({}),
  Component(value) { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'navigation-menu/navigation-menu.js' });

assert(definition, 'NavigationMenu component definition must be registered');
assert(semanticContract.includes('五重受控'));
assert(semanticContract.includes('error > loading > content > empty'));
assert(semanticContract.includes('component-only'));
assert.strictEqual(Object.keys(definition.properties).length, 60, 'NavigationMenu publishes 60 Props');

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

const ITEMS = [
  { value: 'components', label: '组件', icon: 'component', badge: 83, children: [
    { heading: '开始', items: [
      { value: false, label: '组件总览', icon: 'grid' },
      { value: 'api', label: 'API 文档', icon: 'file-text' },
      { value: 0, label: '数据展示', children: [
        { value: 'table', label: 'Table' },
        { value: 'swiper', label: 'Swiper' },
      ] },
    ] },
    { heading: '偏好', separatorBefore: true, items: [
      { value: 'guides', label: '显示说明', type: 'checkbox' },
      { value: 'comfortable', label: '舒适', type: 'radio', radioGroup: 'density' },
      { value: 'compact', label: '紧凑', type: 'radio', radioGroup: 'density' },
      { value: 'locked', label: '权限受限', disabled: true },
    ] },
  ] },
  { value: 'docs', label: '文档', type: 'link', url: '/pages/docs/index', openType: 'navigateTo' },
  { value: 'sync', label: '同步中', loading: true },
  { value: 'account', label: '账户', disabled: true },
];

const defaults = create();
assert.strictEqual(defaults.instance.data.rootItems.length, 0);
assert.strictEqual(defaults.instance.data.stateType, 'empty');
assert(defaults.instance.data.rootClass.includes('pui-navigation-menu--navigation'));
assert(defaults.instance.data.rootClass.includes('pui-navigation-menu--horizontal'));
assert(defaults.instance.data.rootClass.includes('pui-navigation-menu--scrollable'));
assert(defaults.instance.data.rootStyle.includes('--pui-navigation-menu-duration:500ms'));

const normalized = create({
  items: ITEMS,
  defaultValue: false,
  defaultExpandedValue: 'components',
  defaultCheckedValues: ['guides', 'guides'],
  defaultRadioValues: { density: 'comfortable' },
});
assert.strictEqual(normalized.instance.data.rootItems.length, 4);
assert.strictEqual(normalized.instance.data.currentValue, false, 'false remains a valid raw selected value');
assert.strictEqual(normalized.instance.data.currentExpandedValue, 'components');
assert.strictEqual(normalized.instance.data.currentCheckedValues.length, 1);
assert.strictEqual(normalized.instance.data.currentRadioValues.density, 'comfortable');
assert.strictEqual(normalized.instance.data.currentGroups.length, 2);
assert.strictEqual(normalized.instance.data.stateType, 'content');
assert.strictEqual(normalized.instance.data.rootItems[0].selected, true, 'a selected descendant marks its root');
assert.strictEqual(normalized.instance.data.currentGroups[1].items[0].checked, true);
assert.strictEqual(normalized.instance.data.currentGroups[1].items[1].checked, true);

const strict = create({
  items: [
    { id: 0, text: '数字零', nodes: [{ id: false, text: '布尔 false' }, { id: 'false', text: '字符串 false' }, { id: false, text: '重复' }] },
    { id: false, text: '跨树重复应过滤' },
  ],
  itemKey: 'id',
  labelKey: 'text',
  childrenKey: 'nodes',
  defaultExpandedValue: 0,
});
assert.strictEqual(strict.instance.data.rootItems.length, 1, 'typed duplicates are removed globally');
assert.strictEqual(strict.instance.data.rootItems[0].value, 0);
assert.deepStrictEqual(Array.from(strict.instance.data.rootItems[0].descendants, (item) => item.value), [false, 'false']);

const many = Array.from({ length: 15 }, (_, rootIndex) => ({
  value: `root-${rootIndex}`,
  label: `Root ${rootIndex}`,
  children: Array.from({ length: 60 }, (_, itemIndex) => ({ value: `${rootIndex}-${itemIndex}`, label: `Item ${itemIndex}` })),
}));
const limited = create({ items: many, defaultExpandedValue: 'root-0' });
assert.strictEqual(limited.instance.data.rootItems.length, 2, 'global 100-item limit stops later roots after normalization');
assert.strictEqual(limited.instance.data.rootItems[0].groups[0].items.length, 50, 'each level is capped at 50');
const normalizedTotal = limited.instance.data.rootItems.reduce((count, item) => count + 1 + item.descendants.length, 0);
assert.strictEqual(normalizedTotal, 100, 'the full tree is capped at 100 non-separator items');

const selection = create({ items: ITEMS, defaultExpandedValue: 'components', defaultValue: 'api' });
assert(selection.instance.select(false));
assert.strictEqual(selection.instance.data.currentValue, false);
assert.deepStrictEqual(selection.events.slice(0, 4).map((event) => event.name), ['item-click', 'input', 'change', 'select']);
assert.strictEqual(selection.events[1].detail.previousValue, 'api');
assert.strictEqual(selection.events[1].detail.value, false);

const checks = create({ items: ITEMS, defaultExpandedValue: 'components', defaultCheckedValues: ['guides'], defaultRadioValues: { density: 'comfortable' } });
assert(checks.instance.select('guides'));
assert.deepStrictEqual(Array.from(checks.instance.data.currentCheckedValues), []);
assert(checks.events.some((event) => event.name === 'checked-input' && event.detail.checked === false));
assert(checks.instance.select('compact'));
assert.strictEqual(checks.instance.data.currentRadioValues.density, 'compact');
assert(checks.events.some((event) => event.name === 'radio-change' && event.detail.group === 'density'));

const submenu = create({ items: ITEMS, defaultExpandedValue: 'components' });
assert.strictEqual(submenu.instance.openSubmenu(0), true, 'raw numeric submenu value is addressable');
assert.strictEqual(submenu.instance.data.currentDepth, 1);
assert.deepStrictEqual(Array.from(submenu.instance.data.currentGroups[0].items, (item) => item.value), ['table', 'swiper']);
assert.strictEqual(submenu.instance.back(), true);
assert.strictEqual(submenu.instance.data.currentDepth, 0);
assert(submenu.events.some((event) => event.name === 'submenu-open'));
assert(submenu.events.some((event) => event.name === 'submenu-close'));

const controlled = create({
  items: ITEMS,
  value: 'api',
  expandedValue: 'components',
  visible: false,
  checkedValues: ['guides'],
  radioValues: { density: 'comfortable' },
});
assert(controlled.instance.select(false));
assert.strictEqual(controlled.instance.data.currentValue, 'api', 'controlled value waits for parent write-back');
assert(controlled.instance.select('guides'));
assert.deepStrictEqual(Array.from(controlled.instance.data.currentCheckedValues), ['guides'], 'controlled checks wait for parent write-back');
assert(controlled.instance.open('components'));
assert.strictEqual(controlled.instance.data.currentVisible, false, 'controlled visible waits for parent write-back');
assert(controlled.events.some((event) => event.name === 'visible-input' && event.detail.visible === true && event.detail.controlled));

const direct = create({ items: ITEMS, defaultExpandedValue: 'components', autoNavigate: false });
assert(direct.instance.select('docs'));
assert(direct.events.some((event) => event.name === 'navigate'));
assert(!direct.events.some((event) => event.name === 'navigate-success'), 'manual navigation does not fake success');
navigationCalls.length = 0;
const automatic = create({ items: ITEMS, defaultExpandedValue: 'components', autoNavigate: true });
assert(automatic.instance.select('docs'));
assert.strictEqual(navigationCalls.length, 1);
assert.strictEqual(navigationCalls[0].type, 'navigateTo');
assert(automatic.events.some((event) => event.name === 'navigate-success'), 'auto navigation forwards the real wx success callback');

const locked = create({ items: ITEMS, defaultExpandedValue: 'components', disabled: true, error: true });
assert.strictEqual(locked.instance.data.stateType, 'error');
assert.strictEqual(locked.instance.select(false), false);
assert.strictEqual(locked.instance.open(), false);
assert.strictEqual(locked.instance.retry(), false);
const readonly = create({ items: ITEMS, defaultExpandedValue: 'components', readonly: true });
assert.strictEqual(readonly.instance.select(false), false);
assert.strictEqual(readonly.instance.openSubmenu(0), false);
assert.strictEqual(readonly.instance.reset(), false);
const statePriority = create({ items: ITEMS, defaultExpandedValue: 'components', loading: true, error: true });
assert.strictEqual(statePriority.instance.data.stateType, 'error');
const customContent = create({ items: [], customContent: true, defaultVisible: false });
assert.strictEqual(customContent.instance.data.stateType, 'content');

const presentation = create({
  items: ITEMS,
  mode: 'menubar', direction: 'vertical', placement: 'top', variant: 'soft', size: 'large', block: false, wrap: true,
  scrollable: false, panelWidth: 9999, maxHeight: -1, offset: 999, zIndex: 99999, duration: 999, easing: 'spring', reduceMotion: false,
});
['menubar', 'vertical', 'top', 'soft', 'large', 'wrap'].forEach((name) => assert(presentation.instance.data.rootClass.includes(`pui-navigation-menu--${name}`)));
assert(presentation.instance.data.rootClass.includes('pui-navigation-menu--fixed'));
assert(presentation.instance.data.rootStyle.includes('--pui-navigation-menu-duration:999ms'));
assert(presentation.instance.data.rootStyle.includes('--pui-navigation-menu-panel-width:1200rpx'));
assert(presentation.instance.data.rootStyle.includes('--pui-navigation-menu-max-height:240rpx'));
assert(presentation.instance.data.rootStyle.includes('--pui-navigation-menu-offset:96rpx'));
assert(presentation.instance.data.rootStyle.includes('z-index:12000'));
const reduced = create({ items: ITEMS, duration: 400, reduceMotion: true });
assert(reduced.instance.data.rootStyle.includes('--pui-navigation-menu-duration:1ms'));
assert(reduced.instance.data.rootClass.includes('pui-navigation-menu--reduced'));

const cappedDuration = create({ items: ITEMS, duration: 1600 });
assert(cappedDuration.instance.data.rootStyle.includes('--pui-navigation-menu-duration:1000ms'));

const wxml = fs.readFileSync(path.join(root, 'navigation-menu/navigation-menu.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'navigation-menu/navigation-menu.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'navigation-menu/navigation-menu.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const matrix = fs.readFileSync(path.join(root, 'docs/COMPONENT_MATRIX.md'), 'utf8');
const generator = fs.readFileSync(path.join(root, 'scripts/generate-components.js'), 'utf8');
const shadcnGenerator = fs.readFileSync(path.join(root, 'scripts/generate-shadcn-components.js'), 'utf8');
const exampleJson = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.json'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert(wxml.includes('<navigation-trigger'));
assert(wxml.includes('<navigation-item'));
assert(wxml.includes('scroll-x="{{normalizedDirection === \'horizontal\' && scrollable && !wrap}}"'), 'Horizontal NavigationMenu roots scroll only when adaptive scrolling is enabled and wrapping is disabled');
assert(wxml.includes('</scroll-view>\n\n  <view wx:if="{{panelRendered}}" class="pui-navigation-menu__layer'), 'Panel and Overlay must remain siblings of the clipped trigger viewport');
assert(wxml.includes('<view class="pui-navigation-menu__trigger-host">'), 'Each root trigger needs a real flex host so a custom component cannot escape the equal track');
assert((wxml.match(/class="pui-navigation-menu__trigger-component"/g) || []).length === 2, 'Default and generic trigger component hosts must both fill the readable track');
assert(wxml.includes('<pui-button'));
assert(wxml.includes('wx:if="{{!canBack}}" class="pui-navigation-menu__header-spacer"'), 'NavigationMenu root Header must balance the title with an inert spacer instead of a disabled ghost Button');
assert(/wx:else\s+class="pui-navigation-menu__header-control pui-navigation-menu__header-control--back"\s+custom-class="pui-navigation-menu__header-action"/.test(wxml) && wxml.includes('icon="chevron-left"') && wxml.includes('icon-only'), 'NavigationMenu submenu back must use a visible PUI circular IconButton');
assert(wxml.includes('icon="close"\n            icon-only'), 'NavigationMenu Header close must use a visible PUI circular IconButton');
assert((wxml.match(/variant="base"/g) || []).length >= 2, 'NavigationMenu Header actions must use solid base Button surfaces');
assert(wxml.includes('<pui-cell'));
assert(wxml.includes('<pui-badge'));
assert(wxml.includes('<pui-icon'));
assert(wxml.includes('<pui-loading'));
assert(wxml.includes('<pui-empty'));
assert(wxml.includes('<slot name="header"'));
assert(wxml.includes('<slot name="footer"'));
assert(wxml.includes('name="empty"></slot>'));
assert(wxml.includes('<slot wx:if="{{customContent}}"></slot>'));
assert(wxml.includes('class="pui-navigation-menu__header-control pui-navigation-menu__header-control--back"'), 'NavigationMenu Back uses an explicit top-left Header host track');
assert(wxml.includes('class="pui-navigation-menu__header-control pui-navigation-menu__header-control--close"'), 'NavigationMenu Close uses an explicit top-right Header host track');
assert(wxml.includes('pui-navigation-menu__menu-layer--outgoing'));
assert(!wxml.includes('group-placeholder'), 'submenu outgoing pane renders real menu snapshots');
assert(!/<button\b|<input\b|<image\b/.test(wxml), 'NavigationMenu uses PoemUI components instead of raw replacement controls');
assert(!/:empty/.test(wxss));
assert(!/color-mix\(/.test(wxss));
assert(!/display\s*:\s*none/.test(wxss), 'retained state layers do not use display:none jumps');
assert(wxss.includes('var(--pui-navigation-menu-duration)'));
assert(wxss.includes('.pui-navigation-menu__header-action,\n.pui-navigation-menu__header-spacer {\n  flex: 0 0 auto;\n  width: 56rpx;\n  min-width: 56rpx;\n  height: 56rpx;\n}'), 'NavigationMenu Header action and inert spacer must share the 56rpx balance track');
assert(wxss.includes('.pui-navigation-menu__header-control {\n  align-self: start;\n  width: 56rpx;\n  height: 56rpx;\n}'), 'NavigationMenu Header control host owns the 56rpx top-aligned Grid geometry');
assert(wxss.includes('.pui-navigation-menu__header-control--close {\n  justify-self: end;\n}'), 'NavigationMenu Close host is explicitly right aligned');
assert(wxss.includes('.pui-navigation-menu__header-action {\n  padding: 0;\n  color: var(--pui-text-primary);\n  background: var(--pui-bg-muted);\n  border-color: transparent;\n}'), 'NavigationMenu Header actions keep a solid high-contrast circular PUI Button surface');
assert(wxss.includes('.pui-navigation-menu__header-spacer {\n  pointer-events: none;\n}'), 'NavigationMenu root Header spacer must remain inert');
assert(!/\.pui-navigation-menu--reduced[^\{]*\*/.test(wxss), '低动效时长通过根节点 Token 继承，WXSS 不得穿透后代');
assert(wxss.includes('.pui-navigation-menu--vertical {\n  display: grid;\n  box-sizing: border-box;\n  grid-template-columns: minmax(240rpx, 42%) minmax(0, 1fr);'), 'Vertical mini-program NavigationMenu reserves the adjacent panel column');
assert(wxss.includes('gap: calc(var(--pui-navigation-menu-offset) + var(--pui-space-normal));'), 'Vertical mini-program NavigationMenu reserves complete left shadow clearance beside the panel');
assert(wxss.includes('.pui-navigation-menu__trigger-scroll {\n  position: relative;') && wxss.includes('  overflow: hidden;'), 'NavigationMenu trigger viewport clips overflow without clipping the independent panel layer');
assert(wxss.includes('.pui-navigation-menu__triggers {\n  display: flex;') && wxss.includes('  overflow: visible;\n  padding: var(--pui-space-xxs);'), 'Only the trigger viewport clips; the track stays visible so complete hosts define the scroll width');
assert(wxss.includes('.pui-navigation-menu--horizontal.pui-navigation-menu--fixed .pui-navigation-menu__trigger-host {\n  flex: 1 1 0;'), 'Fixed horizontal roots keep strict equal tracks');
assert(wxss.includes('.pui-navigation-menu--horizontal.pui-navigation-menu--scrollable:not(.pui-navigation-menu--wrap) .pui-navigation-menu__trigger-host {\n  flex: 1 0 208rpx;\n  min-width: 208rpx;'), 'Scrollable horizontal roots retain a readable minimum before local overflow');
assert(wxss.includes('.pui-navigation-menu__trigger-component {\n  display: block;\n  box-sizing: border-box;\n  width: 100%;\n  min-width: 0;\n  max-width: 100%;'), 'The actual custom-component host must fill its flex track instead of overflowing from intrinsic Button width');
assert(wxss.includes('.pui-navigation-menu__trigger {\n  width: 100%;\n  min-width: 0;\n  max-width: 100%;'), 'The PUI Button root must consume its host track before label truncation');
assert(wxss.includes('.pui-navigation-menu--horizontal.pui-navigation-menu--wrap .pui-navigation-menu__trigger-host {\n  flex: 1 0 208rpx;\n  min-width: 208rpx;'), 'Horizontal wrap mode keeps the same readable minimum track while moving overflow to a new line');
assert(wxss.includes('.pui-navigation-menu__trigger-suffix {\n  display: inline-flex;\n  flex: 0 0 auto;'), 'Badge and indicator stay in a non-shrinking suffix while only label text truncates');
assert(wxss.includes('.pui-navigation-menu--vertical .pui-navigation-menu__trigger .pui-button__suffix {\n  margin-left: auto;\n}'), 'Vertical root Badge and indicator use the right-aligned Button suffix track');
assert(wxss.includes('padding-bottom: var(--pui-space-xl);'), 'Vertical mini-program NavigationMenu must reserve tokenized clearance for the retained panel shadow');
assert(wxss.includes('.pui-navigation-menu--vertical .pui-navigation-menu__layer {\n  position: relative;'), 'Vertical mini-program layer must share the root row with its trigger rail');
assert(wxss.includes('.pui-navigation-menu--vertical .pui-navigation-menu__panel--entered {\n  transform: translateX(0) scale(1);\n}'), 'Vertical panel must finish at its layer origin instead of retaining the entrance transform');
assert(wxss.includes('grid-template-columns: 56rpx minmax(0, 1fr) 56rpx;\n  align-items: start;\n  gap: var(--pui-space-xs);\n  padding: var(--pui-panel-padding-compact);'), 'NavigationMenu Header keeps equal 56rpx action tracks and equal top/right compact insets');
assert(wxss.includes('.pui-navigation-menu__heading {\n  align-self: center;'), 'NavigationMenu heading remains vertically centered while Header actions stay top aligned');
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss), 'NavigationMenu CSS has no fixed motion longer than 500ms');
assert.strictEqual(json.componentGenerics['navigation-trigger'].default, '../button/button');
assert.strictEqual(json.componentGenerics['navigation-item'].default, '../cell/cell');
assert.strictEqual(json.usingComponents['pui-badge'], '../badge/badge');
assert.strictEqual(metadata.apiProps['navigation-menu'].length, 60);
assert(metadata.packageComponents.includes('navigation-menu'));
assert(metadata.releaseComponentIds.has('navigation-menu'));
assert(shadcn.includes("['Navigation Menu', 'navigation-menu', 'adapter', 'tap'"));
assert(preview.includes("if (runtimeId === 'navigation-menu')"));
assert(preview.includes('function navigationMenuShowcase(props, demo)'));
assert(preview.includes("snapshot.path.length ? iconButtonSample({ customClass: 'pui-navigation-menu-preview__header-action', icon: 'chevron-left', size: 'extra-small', variant: 'base', shape: 'circle'"), 'NavigationMenu H5 submenu back must use the shared solid PUI IconButton helper');
assert(preview.includes("'<span class=\"pui-navigation-menu-preview__header-spacer\" aria-hidden=\"true\"></span>'"), 'NavigationMenu H5 root Header must mirror the inert spacer');
assert(preview.includes("iconButtonSample({ customClass: 'pui-navigation-menu-preview__header-action', icon: 'close', size: 'extra-small', variant: 'base', shape: 'circle'"), 'NavigationMenu H5 Header close must use the shared solid PUI IconButton helper');
assert(preview.includes("theme: item.theme, standalone: true, customClass: 'pui-navigation-menu-preview__badge'"), 'NavigationMenu root Badge must mirror the native empty-host inline layout inside the PUI Button suffix');
assert(preview.includes('function bindNavigationMenuPreviewRuntime(props)'));
assert(preview.includes('function executeNavigationMenuPreviewItem(props, demo, item'));
assert(preview.includes('data-navigation-menu-state="content"'));
assert(preview.includes('navigate-error：H5 预览不调用微信导航 API，未伪造 success'));
assert(previewStyles.includes('.pui-navigation-menu-preview__panel'));
assert(previewStyles.includes('.pui-navigation-menu-preview.is-scrollable:not(.is-wrap):not(.is-vertical) .pui-navigation-menu-preview__trigger'), 'Scrollable horizontal H5 roots must share the native readable-width overflow contract');
assert(previewStyles.includes('min-width: 104px;\n  flex: 1 0 104px;'), 'H5 horizontal scrollable and wrap roots must mirror the native 208rpx readable track');
assert(previewStyles.includes('.pui-navigation-menu-preview.is-vertical .pui-navigation-menu-preview__layer.is-active .pui-navigation-menu-preview__panel { transform: translateX(0) scale(1); }'), 'Vertical H5 panel must clear its entrance translation after opening');
assert(previewStyles.includes('.pui-navigation-menu-preview__header-spacer {\n  width: 28px;\n  min-width: 28px;\n  height: 28px;\n  pointer-events: none;\n}'), 'NavigationMenu H5 root Header spacer must retain geometry without a ghost Surface');
assert(previewStyles.includes('body .app-shell[data-page-mode] .preview-stage .pui-navigation-menu-preview__header .pui-navigation-menu-preview__header-action.pui-button-preview {\n  --pui-button-size: 28px;\n  width: var(--pui-button-size);\n  min-width: var(--pui-button-size);\n  height: var(--pui-button-size);\n  min-height: var(--pui-button-size);\n  padding: 0;\n  color: var(--text);\n  background: var(--border);\n  border-color: transparent;\n  border-radius: var(--pui-preview-radius-round);\n}'), 'NavigationMenu H5 Header actions retain a solid high-contrast 28px circular PUI surface');
assert(previewStyles.includes('.pui-navigation-menu-preview__badge {\n  position: static;'), 'NavigationMenu suffix Badge must not anchor to the menu root and be clipped by its Trigger');
assert(previewStyles.includes('.pui-navigation-menu-preview.is-vertical {\n  display: grid;\n  grid-template-columns: minmax(96px, 42%) minmax(0, 1fr);'), 'Vertical H5 NavigationMenu reserves a right-hand panel column instead of leaving it empty');
assert(previewStyles.includes('gap: calc(var(--pui-navigation-menu-preview-offset, var(--pui-preview-space-step-7)) + var(--pui-preview-space-sm));'), 'Vertical H5 panel keeps the same left shadow clearance');
assert(previewStyles.includes('flex: 1 1 0;\n  max-width: none;'), 'H5 fixed horizontal roots must distribute equally without a private maximum width');
assert(previewStyles.includes('.pui-navigation-menu-preview__overlay {\n  appearance: none;\n  position: fixed;\n  z-index: 0;\n  inset: 0;'), 'H5 NavigationMenu overlay mirrors the component viewport instead of a magic translucent band');
assert(previewStyles.includes('.pui-navigation-menu-preview.is-vertical .pui-navigation-menu-preview__layer {\n  position: relative;'), 'Vertical H5 layer must occupy the adjacent content column rather than opening underneath the roots');
assert(previewStyles.includes('flex: 0 0 auto; align-items: center; gap: var(--pui-preview-space-step-5); margin-left: auto; overflow: visible;'), 'NavigationMenu suffix remains a non-shrinking visible inline region for Badge and indicator');
assert(previewStyles.includes('.pui-navigation-menu-preview__state.is-active'));
assert(previewStyles.includes('@media (prefers-reduced-motion: reduce)'));
assert(api.includes('## NavigationMenu'));
assert(api.includes('navigate-success` | navigate detail'));
assert(api.includes('五类 `*-input`'));
assert(/\d+\. NavigationMenu 的 H5 镜像/.test(compatibility));
assert(compatibility.includes('navigate-success/error 必须来自真实 API 回调'));
assert(matrix.includes('| Navigation Menu | done | `poemui-miniprogram/navigation-menu/navigation-menu`'));
assert(generator.includes("  'navigation-menu',"));
assert(shadcnGenerator.includes("  'navigation-menu',"));
assert(exampleJson.includes('poemui-miniprogram/navigation-menu/navigation-menu'));
assert(exampleWxml.includes('id="deliveryNavigationMenu"'));
assert(exampleWxml.includes('bind:navigate-success="onNavigationMenuNavigateSuccess"'));
assert(exampleJs.includes('onNavigationMenuVisibleInput: function onNavigationMenuVisibleInput'));

for (const extension of ['js', 'json', 'wxml', 'wxss']) {
  assert.strictEqual(
    fs.readFileSync(path.join(root, `navigation-menu/navigation-menu.${extension}`), 'utf8'),
    fs.readFileSync(path.join(root, `miniprogram_dist/navigation-menu/navigation-menu.${extension}`), 'utf8'),
    `navigation-menu source/dist ${extension} must stay identical`,
  );
}

console.log('NavigationMenu contract tests passed.');
