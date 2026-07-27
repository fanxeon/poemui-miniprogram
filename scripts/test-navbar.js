const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('navbar/navbar.js');
let definition = null;
const timers = [];
let resizeHandler = null;
const nativeWx = {
  getMenuButtonBoundingClientRect() { return { left: 299, right: 387, top: 26, bottom: 58, width: 88, height: 32 }; },
  getWindowInfo() { return { windowWidth: 390, windowHeight: 844, statusBarHeight: 20 }; },
  onWindowResize(handler) { resizeHandler = handler; },
  offWindowResize(handler) { if (resizeHandler === handler) resizeHandler = null; },
};
vm.runInNewContext(source, {
  console,
  isFinite,
  wx: nativeWx,
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    if (request === '../common/utils/platform-info') return { getWindowInfo: () => nativeWx.getWindowInfo() };
    throw new Error(`Unexpected dependency: ${request}`);
  },
  setTimeout(callback, delay) { timers.push({ callback, delay }); return timers.length; },
  clearTimeout() {},
  Component(value) { definition = value; },
}, { filename: 'navbar/navbar.js' });

assert(definition, 'Navbar component definition must register');
const expectedProps = ['title', 'titleMaxLength', 'leftArrow', 'leftBtn', 'rightBtn', 'fixed', 'placeholder', 'safeAreaInsetTop', 'capsule', 'visible', 'zIndex', 'loading', 'transparent', 'bordered', 'disabled', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), expectedProps, 'Navbar publishes the accepted direct-action Props');
assert.strictEqual(definition.properties.bordered.value, false, 'Navbar defaults to a transparent bottom boundary');

function create(overrides) {
  timers.length = 0;
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, definition.methods);
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const defaults = create();
assert.strictEqual(defaults.instance.data.titleText, '');
assert.strictEqual(defaults.instance.data.semanticLabel, '导航栏');
assert.strictEqual(defaults.instance.data.resolvedDuration, 500);
assert(defaults.instance.data.rootStyle.includes('z-index:1000'));
assert(defaults.instance.data.rootStyle.includes('--pui-navbar-safe-height:20px'));
assert(defaults.instance.data.rootStyle.includes('--pui-navbar-content-height:44px'));
assert(defaults.instance.data.rootStyle.includes('--pui-navbar-capsule-width:88px'));
assert(defaults.instance.data.rootStyle.includes('--pui-navbar-capsule-height:32px'));
assert(defaults.instance.data.rootStyle.includes('--pui-navbar-capsule-inset-right:3px'));
assert(defaults.instance.data.rootStyle.includes('--pui-navbar-capsule-mirror-left:3px'));
assert(defaults.instance.data.rootStyle.includes('--pui-navbar-capsule-reserve:91px'));
assert(defaults.instance.data.rootClass.includes('pui-navbar--with-capsule'));
assert.strictEqual(typeof resizeHandler, 'function', 'Navbar refreshes native geometry after a window resize');
assert.strictEqual(timers[0].delay, 16, 'visible Navbar schedules a real entering frame');
timers[0].callback();
assert.strictEqual(defaults.instance.data.motionPhase, 'visible');

const title = create({ title: '组件发布导航栏', titleMaxLength: 4, zIndex: 0 });
assert.strictEqual(title.instance.data.titleText, '组件发布...');
assert.strictEqual(title.instance.data.semanticLabel, '组件发布...');
assert(title.instance.data.rootStyle.includes('z-index:1'));
const high = create({ zIndex: 20000, ariaLabel: '页面主导航' });
assert(high.instance.data.rootStyle.includes('z-index:12000'));
assert.strictEqual(high.instance.data.semanticLabel, '页面主导航');
const reduced = create({ reduceMotion: true });
assert.strictEqual(reduced.instance.data.resolvedDuration, 1);
assert(reduced.instance.data.rootStyle.includes('--pui-navbar-duration:1ms'));
const capsuleOff = create({ capsule: false });
assert(!capsuleOff.instance.data.rootStyle.includes('--pui-navbar-capsule-reserve:'));
assert(capsuleOff.instance.data.rootStyle.includes('--pui-navbar-safe-height:20px'));
assert(!capsuleOff.instance.data.rootClass.includes('pui-navbar--with-capsule'));

const back = create({ leftArrow: true });
back.instance.onLeftClick();
assert.strictEqual(JSON.stringify(back.events), JSON.stringify([{ name: 'left-click', detail: { source: 'left' } }]));
const noArrow = create({ leftArrow: false });
noArrow.instance.onLeftClick();
assert.strictEqual(noArrow.events.length, 0);
const disabled = create({ leftArrow: true, disabled: true });
disabled.instance.onLeftClick();
assert.strictEqual(disabled.events.length, 0);
const directActions = create({ leftBtn: { icon: 'search', ariaLabel: '搜索组件' }, rightBtn: { icon: 'menu', ariaLabel: '打开外观设置' } });
directActions.instance.onLeftBtnClick();
directActions.instance.onRightBtnClick();
assert.strictEqual(JSON.stringify(directActions.events), JSON.stringify([
  { name: 'leftBtn', detail: { source: 'leftBtn' } },
  { name: 'rightBtn', detail: { source: 'rightBtn' } },
]));
const disabledDirectActions = create({ leftBtn: { icon: 'search' }, rightBtn: { icon: 'menu' }, disabled: true });
disabledDirectActions.instance.onLeftBtnClick();
disabledDirectActions.instance.onRightBtnClick();
assert.strictEqual(disabledDirectActions.events.length, 0);

const hidden = create({ visible: false });
assert.strictEqual(hidden.instance.data.showNode, false);
assert.strictEqual(hidden.instance.data.motionPhase, 'hidden');
hidden.instance.data.visible = true;
hidden.instance.syncState();
assert.strictEqual(hidden.instance.data.showNode, true);
assert.strictEqual(hidden.instance.data.motionPhase, 'entering');
timers[timers.length - 1].callback();
hidden.instance.data.visible = false;
hidden.instance.syncState();
assert.strictEqual(hidden.instance.data.motionPhase, 'leaving');
const leaveTimer = timers[timers.length - 1];
assert.strictEqual(leaveTimer.delay, 500);
leaveTimer.callback();
assert.strictEqual(hidden.instance.data.showNode, false);
assert.strictEqual(hidden.instance.data.motionPhase, 'hidden');

for (const removed of ['show', 'hide', 'open', 'close']) assert.strictEqual(definition.methods[removed], undefined, `Navbar must not expose ${removed}()`);
for (const removedEvent of ['right-click', 'input', 'change', 'open', 'close']) assert(!source.includes(`triggerEvent('${removedEvent}'`), `Navbar must not publish ${removedEvent}`);

const wxml = read('navbar/navbar.wxml');
const wxss = read('navbar/navbar.wxss');
const json = JSON.parse(read('navbar/navbar.json'));
assert.deepStrictEqual(Object.keys(json.usingComponents).sort(), ['pui-button', 'pui-loading']);
assert(wxml.includes('<pui-button') && wxml.includes('<pui-loading'));
for (const slot of ['left', 'title']) assert(wxml.includes(`<slot name="${slot}"></slot>`));
assert(wxml.includes('<slot wx:if="{{!capsule}}" name="right"></slot>'));
assert(wxml.includes('wx:if="{{leftBtn || rightBtn}}"'));
assert(wxml.includes('bind:click="onLeftBtnClick"'));
assert(wxml.includes('bind:click="onRightBtnClick"'));
assert(wxml.includes('class="pui-navbar__placeholder" style="{{rootStyle}}"'));
assert(wxml.includes('showNode && fixed && placeholder'));
assert(!/display\s*:\s*none/.test(wxss));
assert(!/height\s*:\s*auto/.test(wxss));
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss));
assert(wxss.includes('pui-navbar--with-capsule .pui-navbar__content'));
assert(wxss.includes('var(--pui-navbar-capsule-reserve)'));
assert(!wxss.includes('grid-template-columns'), 'native Navbar cannot depend on Skyline Grid slot sizing');
assert(wxss.includes('height: var(--pui-navbar-content-height)'));
assert(wxss.includes('left: var(--pui-navbar-capsule-mirror-left)'));
assert(wxss.includes('width: var(--pui-navbar-capsule-width)'));
assert(wxss.includes('right: var(--pui-navbar-capsule-reserve)'));
assert(wxss.includes('var(--pui-navbar-action-width)'));
assert(wxss.includes('.pui-navbar--bordered {\n  border-bottom: 1rpx solid var(--pui-glass-border);\n}'), 'Navbar bordered=true restores the neutral bottom divider');
assert(wxss.includes('.pui-navbar--borderless {\n  border-bottom: 0;\n}'), 'Navbar default renders no bottom boundary');
assert(/\.pui-navbar__action--left\s*\{[\s\S]*?justify-content:\s*flex-start;[\s\S]*?overflow:\s*visible;[\s\S]*?\}/.test(wxss), 'multiple left Slot actions must not be clipped by the mirrored capsule rail');
assert(read('common/style/theme.wxss').includes('--pui-navbar-capsule-reserve-fallback'));

const metadata = require(path.join(root, 'metadata/components.js'));
assert.deepStrictEqual(metadata.apiProps.navbar, expectedProps);
assert.deepStrictEqual(metadata.apiEvents.navbar.map((event) => event.name), ['left-click', 'leftBtn', 'rightBtn']);
assert.deepStrictEqual(metadata.apiSlots.navbar.map((slot) => slot.name), ['left', 'title', 'right']);
assert.strictEqual((metadata.apiMethods.navbar || []).length, 0);
assert.deepStrictEqual(metadata.apiPropGroups.navbar.flatMap((group) => group.keys), expectedProps);

const preview = read('preview/app.js');
const styles = read('preview/styles.css');
for (const titleText of ['基础用法', 'Slot 操作', '胶囊式按钮', '加载与禁用', '透明导航']) assert(preview.includes(`<h3>${titleText}</h3>`));
assert(preview.includes('componentPropDefaults = {'));
assert(preview.includes("navbar: {\n    title: '', titleMaxLength: 0"));
assert(preview.includes('leftBtn: null, rightBtn: null'));
assert(preview.includes('capsule: true, visible: true'));
assert(preview.includes("transparent: false, bordered: false, disabled: false"), 'H5 Navbar shares the transparent-border default');
assert(preview.includes('const rightSlot = !capsule && options.rightSlot'));
assert(preview.includes('pui-navbar-preview__capsule" aria-hidden="true"'));
assert(preview.includes("if (key === 'visible' && !demo.navbarPendingSource) delete demo.navbarEvent"), 'property-panel visible write-back clears stale toggle feedback');
assert(!preview.includes("type === 'navbar-show'"));
assert(!preview.includes("type === 'navbar-hide'"));
assert(styles.includes('.pui-navbar-showcase'));
assert(styles.includes('position: sticky'));
assert(styles.includes('--pui-navbar-preview-duration'));
assert(styles.includes('--pui-navbar-preview-capsule-reserve'));
assert(styles.includes('--pui-navbar-preview-capsule-mirror-left'));
assert(styles.includes('.pui-navbar-preview.has-capsule .pui-navbar-preview__action.is-left'));
assert(!styles.includes('grid-template-columns: minmax(0, 56px)'), 'H5 mirror follows the native absolute geometry model');
assert(styles.includes('left: var(--pui-navbar-preview-capsule-mirror-left)'));
assert(styles.includes('width: var(--pui-navbar-preview-capsule-width)'));
assert(styles.includes('right: var(--pui-navbar-preview-capsule-reserve)'));
assert(styles.includes('var(--pui-navbar-preview-action-width)'));
assert(preview.includes("const singleSlot = navbarPreviewMarkup"), 'H5 必须展示单按钮 Slot');
assert(preview.includes("const doubleSlot = navbarPreviewMarkup"), 'H5 必须展示双按钮 Slot');
assert(preview.includes('pui-navbar-preview__mirror-capsule'), 'H5 胶囊操作必须共享左右对称的镜像容器');
assert(/\.pui-navbar-preview__action\.is-left\s*\{[\s\S]*?justify-content:\s*flex-start;[\s\S]*?overflow:\s*visible;[\s\S]*?\}/.test(styles), 'H5 Navbar mirrors the native multi-action left Slot rail');
assert(styles.includes('pointer-events: none'));
assert(styles.includes('.pui-navbar-preview.is-bordered {\n  border-bottom: 1px solid var(--glass-border);\n}'));
assert(styles.includes('.pui-navbar-preview.is-borderless {\n  border-bottom: 0;\n}'));
assert(preview.includes("icon: 'search', ariaLabel: '搜索组件'"), 'H5 Navbar composition preview exposes the same two real left icon actions');
assert(preview.includes("icon: 'menu', ariaLabel: '打开左侧菜单'"), 'H5 Navbar composition preview exposes the menu action without a fake capsule control');
assert(preview.includes("'navbar-left-btn'"));
assert(preview.includes("'navbar-right-btn'"));

const api = read('docs/COMPONENT_API.md');
const navbarApi = api.slice(api.indexOf('## Navbar'), api.indexOf('\n## Tabs'));
assert(navbarApi.includes('17 Props'));
assert(navbarApi.includes('### 3 Events'));
assert(navbarApi.includes('### 3 Slots'));
assert(navbarApi.includes('Navbar 不公开实例方法'));
assert(navbarApi.includes('<pui-navbar title="组件详情" left-arrow placeholder aria-label="组件详情导航栏" />'));
assert(!navbarApi.includes('| `right-click` |'));
assert(navbarApi.includes('bind:leftBtn'));
assert(navbarApi.includes('bind:rightBtn'));
assert(!navbarApi.includes('实例方法为 `show()`'));
assert(read('docs/components/NAVBAR.md').includes('0 公开 Methods'));
assert(read('docs/components/NAVBAR.md').includes('leftBtn/rightBtn'));
assert(read('docs/components/NAVBAR.md').includes('wx.getMenuButtonBoundingClientRect'));
assert(read('docs/components/README.md').includes('[Navbar](./NAVBAR.md)'));
assert(read('docs/H5_PREVIEW_COMPATIBILITY.md').includes('Navbar 不承载 empty/error/retry'));
assert(read('docs/UI_DESIGN_CONTRACT.md').includes('右上原生胶囊仍由系统绘制和响应'));

const exampleJs = read('_example/miniprogram/pages/components/index.js');
const exampleWxml = read('_example/miniprogram/pages/components/index.wxml');
const exampleNavbar = exampleWxml.slice(exampleWxml.indexOf('<pui-card title="Navbar'), exampleWxml.indexOf('<pui-card title="Tabs 基础用法"'));
assert(exampleWxml.includes('bind:left-click="onNavbarLeft"'));
assert(!exampleNavbar.includes('slot="right"'));
assert(!exampleNavbar.includes('onNavbarPublish'));
assert(!exampleWxml.includes('bind:right-click="onNavbarRight"'));
assert(!exampleWxml.includes('id="navbarExample"'));
assert(exampleJs.includes('右侧已为微信原生胶囊保留'));
assert(!exampleJs.includes('toggleExampleNavbarBusy'));
assert(!exampleJs.includes('selectComponent(\'#navbarExample\')'));

const feedback = JSON.parse(read('feedback/records/pui-fb-0271-navbar-native-capsule-safe-area.json'));
assert.strictEqual(feedback.id, 'PUI-FB-0271');
assert.strictEqual(feedback.status, 'resolved');

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = fs.readFileSync(path.join(root, `navbar/navbar.${extension}`));
  const distFile = fs.readFileSync(path.join(root, `miniprogram_dist/navbar/navbar.${extension}`));
  assert(sourceFile.equals(distFile), `source and miniprogram_dist Navbar ${extension} must match`);
});

console.log('Navbar contract tests passed.');
