const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'overlay/overlay.js');
const source = fs.readFileSync(sourcePath, 'utf8');
let definition = null;
let nextTimerId = 1;
let timers = new Map();

function setTimer(callback, delay) {
  const id = nextTimerId++;
  timers.set(id, { callback, delay: Number(delay) || 0, order: id });
  return id;
}

function clearTimer(id) { timers.delete(id); }

function runNextTimer() {
  const next = Array.from(timers.entries()).sort((left, right) => left[1].delay - right[1].delay || left[1].order - right[1].order)[0];
  if (!next) return null;
  timers.delete(next[0]);
  next[1].callback();
  return next[1].delay;
}

vm.runInNewContext(source, {
  console,
  isFinite,
  setTimeout: setTimer,
  clearTimeout: clearTimer,
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    if (request === '../common/utils/platform-info') return { getWindowInfo: () => ({ statusBarHeight: 20 }) };
    throw new Error(`Unexpected dependency: ${request}`);
  },
  wx: {
    getMenuButtonBoundingClientRect() { return { top: 24, bottom: 56 }; },
  },
  Component(value) { definition = value; },
}, { filename: sourcePath });

assert(definition, 'Overlay component definition must be registered');

function create(overrides) {
  timers = new Map();
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return `pui-theme--${this.data.colorScheme}`; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const expectedProps = ['visible', 'backgroundColor', 'blur', 'duration', 'preventScrollThrough', 'usingCustomNavbar', 'zIndex', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), expectedProps, 'Overlay only exposes the TDesign-shaped mask Props plus PoemUI accessibility/motion fields');
assert.deepStrictEqual(Object.keys(definition.methods).sort(), ['motionDuration', 'noop', 'onTap', 'syncPresentation', 'syncVisibility'].sort());

const defaults = create();
assert.strictEqual(defaults.instance.data.rendered, false);
assert.strictEqual(defaults.instance.data.entered, false);
assert(defaults.instance.data.layerStyle.includes('z-index:11000'));
assert(defaults.instance.data.layerStyle.includes('--pui-overlay-duration:500ms'));
assert.strictEqual(defaults.instance.onTap(), false, 'hidden Overlay cannot fabricate click events');

const visible = create({ visible: true, usingCustomNavbar: true });
assert.strictEqual(visible.instance.data.rendered, true);
assert(visible.instance.data.layerStyle.includes('top:60px'), 'usingCustomNavbar must use the real capsule/status-bar distance');
assert.strictEqual(runNextTimer(), 16);
assert.strictEqual(visible.instance.data.entered, true);
assert.strictEqual(visible.instance.onTap(), true);
assert.deepStrictEqual(JSON.parse(JSON.stringify(visible.events)), [{ name: 'click', detail: { visible: false } }]);
assert.strictEqual(visible.instance.data.visible, true, 'Overlay click must wait for its parent to write visible=false');
visible.instance.data.visible = false;
definition.observers.visible.call(visible.instance);
assert.strictEqual(visible.instance.data.entered, false);
assert.strictEqual(runNextTimer(), 500);
assert.strictEqual(visible.instance.data.rendered, false, 'leave keeps one real node until the opacity transition completes');
const blurred = create({ visible: true, blur: true });
assert(blurred.instance.data.rootClass.includes('pui-overlay-layer--blurred'));

const bounds = create({ visible: true, duration: 999, zIndex: 999999, backgroundColor: 'red;display:none', reduceMotion: true });
assert.strictEqual(bounds.instance.motionDuration(), 1);
assert(bounds.instance.data.layerStyle.includes('z-index:12000'));
assert(bounds.instance.data.layerStyle.includes('--pui-overlay-duration:1ms'));
assert(!bounds.instance.data.layerStyle.includes('red;display:none'));

const wxml = fs.readFileSync(path.join(root, 'overlay/overlay.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'overlay/overlay.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'overlay/overlay.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/OVERLAY.md'), 'utf8');
const contractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const componentPageWxml = fs.readFileSync(path.join(root, 'miniprogram/pages/components/overlay/index.wxml'), 'utf8');
const componentPageWxss = fs.readFileSync(path.join(root, 'miniprogram/pages/components/overlay/index.wxss'), 'utf8');
const componentPageJson = JSON.parse(fs.readFileSync(path.join(root, 'miniprogram/pages/components/overlay/index.json'), 'utf8'));

assert(wxml.includes('catchtouchmove="noop"'));
assert(wxml.includes('bind:tap="onTap"'));
assert.strictEqual((wxml.match(/<slot><\/slot>/g) || []).length, 2, 'both scroll-through branches must preserve only the default Slot');
assert(!/content-click|visible-change|after-open|after-close|position=|padding=|disabled/.test(wxml));
assert.deepStrictEqual(Object.keys(json.usingComponents), []);
assert(!/height\s*:\s*auto[^;]*;[^}]*transition|display\s*:\s*none/.test(wxss));
assert(wxss.includes('transition: opacity var(--pui-overlay-duration)'));
assert(wxss.includes('var(--pui-overlay-blur)'));
assert(wxss.includes('.pui-frosted-glass--on .pui-overlay-layer'), 'Provider frostedGlass must automatically blur Overlay descendants');
assert(!wxss.includes('.pui-overlay-layer--reduced *'), 'Overlay WXSS must remain compilable in the current WeChat CSS compiler');

assert.deepStrictEqual(metadata.apiProps.overlay, expectedProps);
assert.deepStrictEqual(metadata.apiEvents.overlay.map((event) => event.name), ['click']);
assert.deepStrictEqual(metadata.apiSlots.overlay.map((slot) => slot.name), ['default']);
assert.strictEqual(metadata.apiMethods.overlay, undefined);

const overlayUsage = preview.slice(preview.indexOf("if (runtimeId === 'overlay')"), preview.indexOf("if (runtimeId === 'pull-refresh')"));
const overlayPreview = preview.slice(preview.indexOf('function overlayPreviewMotion('), preview.indexOf('function virtualListNumber('));
assert(overlayUsage.includes('<pui-overlay ${attrs} />'));
assert(!overlayUsage.includes('bind:'), 'Overlay basic WXML must stay minimal and bind-free');
assert(preview.includes('function overlayShowcase(props, demo)'));
assert(preview.includes('function updateOverlayPreviewDom(demo)'));
assert(preview.includes("props.blur || state.frost === 'on'"), 'H5 Overlay blur must be the union of its public blur Prop and global frosted appearance');
const overlayActions = preview.slice(preview.indexOf("type === 'overlay-open'"), preview.indexOf("type === 'virtual-item'"));
assert(!overlayActions.includes('renderStage()'), 'Overlay actions retain the mounted layer during transitions');
assert(preview.includes("requestOverlayPreviewVisibility(props, demo, false, 'click')"));
assert(!/overlay-open-method|overlay-close-method|overlay-toggle-method|overlay-content|content-click/.test(overlayPreview));
assert(previewStyles.includes('.pui-overlay-showcase {'));
assert(previewStyles.includes('height: 100%;'));
assert(previewStyles.includes('top: var(--pui-overlay-preview-top, 0px);'));
assert(previewStyles.includes('var(--pui-overlay-preview-filter, none)'));
assert(!previewStyles.includes('.pui-overlay-preview__canvas'));
assert(preview.includes('aria-hidden="true">Hi PoemCoder</div>'), 'Overlay H5 showcase must keep the default Slot as a centered display greeting instead of a panel');
assert(previewStyles.includes('font-size: var(--pui-font-size-display);'));
assert(previewStyles.includes('pointer-events: none;'));
assert(componentPageWxml.includes('overlay-page__greeting pui-text-display">Hi PoemCoder</text>'));
const componentPageOverlaySlot = componentPageWxml.slice(componentPageWxml.indexOf('<pui-overlay'), componentPageWxml.indexOf('</pui-overlay>'));
assert(!componentPageOverlaySlot.includes('<pui-cell-group'), 'Overlay default Slot must not turn the centered greeting into a panel');
assert(!componentPageOverlaySlot.includes('content="关闭遮罩"'));
assert(componentPageWxss.includes('color: var(--pui-text-on-inverse);'));
assert(componentPageWxss.includes('transform: translateY(-50%);'));
assert(!Object.prototype.hasOwnProperty.call(componentPageJson.usingComponents, 'pui-cell-group'));

const overlayApi = api.slice(api.indexOf('## Overlay'), api.indexOf('## PullRefresh'));
assert(overlayApi.includes('Overlay 有 9 个 Props、1 个 Event、1 个 Slot，没有公开 Methods。'));
assert(overlayApi.includes('`blur`'));
assert(overlayApi.includes('只有两者均为 `false` 时保持仅颜色遮罩'));
assert(overlayApi.includes('<pui-overlay />'));
assert(!/\| `defaultVisible`|\| `position`|`content-click`：|`after-open`|实例方法为/.test(overlayApi));
assert(/\d+\. Overlay 的 H5 镜像只实现真实遮罩原语/.test(compatibility));
assert(compatibility.includes('二者取并集而非互相覆盖'));
assert(compatibility.includes('居中的展示级 `Hi PoemCoder`'));
const overlayCompatibility = preview.slice(preview.indexOf("if (compatId === 'overlay')"), preview.indexOf("if (compatId === 'pull-refresh')"));
assert(overlayCompatibility.includes('click({ visible: false })'));
assert(!/visible-input|visible-change|after-open|after-close|defaultVisible/.test(overlayCompatibility), 'Overlay H5 compatibility rows must not retain removed contracts');
assert(overlayCompatibility.includes('不提供 content-click、关闭策略或实例方法。'));
for (const heading of ['## 1. 组件定位', '## 2. 固定结构与区域', '## 3. PUI 组合与依赖', '## 4. Token、间距与排版', '## 5. 内容、Slot 与组合边界', '## 6. 状态与优先级', '## 7. 交互、受控边界与事件', '## 8. 可访问性', '## 9. H5 预览与跨端一致性', '## 10. 响应式、主题与视觉配置', '## 11. 明确禁止', '## 12. 修改闭环']) assert(contract.includes(heading), `Overlay contract must include ${heading}`);
assert(contractIndex.includes('[Overlay](./OVERLAY.md)'));
assert(contract.includes('tdesign-miniprogram@1.15.3'));
assert(contract.includes('居中的展示级 `Hi PoemCoder` 默认 Slot'));
assert(contract.includes('`--pui-text-on-inverse`'));

assert(exampleWxml.includes('bind:click="onOverlayClick"'));
assert(exampleJs.includes('this.setData({ overlayVisible: !!event.detail.visible })'));
assert(!/selectComponent\('#deliveryOverlay'\)|overlayPosition|onOverlayVisibleInput|onOverlayAfterClose/.test(exampleJs));

if (process.env.PUI_VERIFY_DIST === '1') {
  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    const sourceFile = fs.readFileSync(path.join(root, 'overlay', `overlay.${extension}`), 'utf8');
    const distFile = fs.readFileSync(path.join(root, 'miniprogram_dist/overlay', `overlay.${extension}`), 'utf8');
    assert.strictEqual(distFile, sourceFile, `dist Overlay ${extension} must match source`);
  });
}

console.log('Overlay contract tests passed.');
