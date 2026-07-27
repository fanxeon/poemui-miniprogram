const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'popup/popup.js');
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
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: sourcePath });

assert(definition, 'Popup component definition must be registered');

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

const expectedProps = ['closeBtn', 'showHeader', 'title', 'subtitle', 'showFooter', 'closeOnOverlayClick', 'content', 'card', 'duration', 'overlayProps', 'placement', 'preventScrollThrough', 'showOverlay', 'blurOverlay', 'usingCustomNavbar', 'visible', 'defaultVisible', 'zIndex', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), expectedProps, 'Popup exposes the audited base API plus explicit structure, card and overlay-blur fields');
assert.deepStrictEqual(Object.keys(definition.methods).sort(), ['applyVisibility', 'currentVisible', 'motionDuration', 'noop', 'onCloseTap', 'onOverlayTap', 'requestClose', 'syncLayer', 'syncLayout', 'syncMotion', 'syncOverlay', 'syncVisibility'].sort());

const defaults = create();
assert.strictEqual(defaults.instance.data.rendered, false);
assert.strictEqual(defaults.instance.data.closeBtn, true, 'Popup Header provides its circular close control by default');
assert(defaults.instance.data.rootClass.includes('pui-popup--bottom'));
assert(defaults.instance.data.rootClass.includes('pui-popup--card'));
assert(defaults.instance.data.motionStyle.includes('500ms'));
assert(defaults.instance.data.layerStyle.includes('11500'));

const uncontrolled = create({ defaultVisible: true });
assert.strictEqual(uncontrolled.instance.data.rendered, true);
assert.strictEqual(runNextTimer(), 16);
assert.strictEqual(uncontrolled.instance.data.entered, true);
assert.strictEqual(uncontrolled.instance.onCloseTap(), true);
assert.deepStrictEqual(JSON.parse(JSON.stringify(uncontrolled.events)), [{ name: 'visible-change', detail: { visible: false, trigger: 'close-btn' } }]);
assert.strictEqual(uncontrolled.instance.data.entered, false);
assert.strictEqual(runNextTimer(), 500);
assert.strictEqual(uncontrolled.instance.data.rendered, false, 'leave keeps the node until the real motion duration elapses');

const controlled = create({ visible: true });
assert.strictEqual(runNextTimer(), 16);
assert.strictEqual(controlled.instance.onOverlayTap(), true);
assert.deepStrictEqual(JSON.parse(JSON.stringify(controlled.events)), [{ name: 'visible-change', detail: { visible: false, trigger: 'overlay' } }]);
assert.strictEqual(controlled.instance.data.rendered, true, 'controlled Popup waits for parent visible write-back');

const overlayLocked = create({ defaultVisible: true, closeOnOverlayClick: false });
runNextTimer();
assert.strictEqual(overlayLocked.instance.onOverlayTap(), false);
assert.strictEqual(overlayLocked.events.length, 0, 'a non-closeable overlay cannot emit a fake close request');

const bounds = create({ defaultVisible: true, duration: 999, zIndex: 999999, placement: 'invalid', overlayProps: { backgroundColor: 'red;display:none' }, reduceMotion: true });
assert.strictEqual(bounds.instance.motionDuration(), 1);
assert(bounds.instance.data.motionStyle.includes('1ms'));
assert(bounds.instance.data.layerStyle.includes('12000'));
assert(bounds.instance.data.rootClass.includes('pui-popup--bottom'));
assert.strictEqual(bounds.instance.data.overlayStyle, '');

const capped = create({ duration: 1600 });
assert.strictEqual(capped.instance.motionDuration(), 1000);

const edge = create({ card: false, placement: 'right', blurOverlay: true });
assert(edge.instance.data.rootClass.includes('pui-popup--edge'));
assert(edge.instance.data.rootClass.includes('pui-popup--right'));

const wxml = fs.readFileSync(path.join(root, 'popup/popup.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'popup/popup.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'popup/popup.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/POPUP.md'), 'utf8');
const contractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');
const pickerWxml = fs.readFileSync(path.join(root, 'picker/picker.wxml'), 'utf8');
const sheetWxml = fs.readFileSync(path.join(root, 'sheet/sheet.wxml'), 'utf8');
const dialogWxml = fs.readFileSync(path.join(root, 'dialog/dialog.wxml'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');

assert(wxml.includes('class="pui-popup__content"'));
assert(wxml.includes('class="pui-popup__header"'));
assert(wxml.includes('class="pui-popup__surface"'), 'Popup must keep a real inner Surface when its outer host becomes transparent');
assert(!wxml.includes('pui-popup__handle'));
assert(!wxml.includes('onDrag'));
assert(wxml.includes('class="pui-popup__header-side pui-popup__header-side--left"'));
assert(wxml.includes('<slot name="header-left"></slot>'));
assert(wxml.includes('class="pui-popup__title-area"'));
assert(wxml.includes('class="pui-popup__footer"'));
assert(wxml.includes('class="pui-popup__footer-content"'));
assert(wxml.includes('<slot name="footer"></slot>'));
assert(wxss.includes('.pui-popup__footer-content { display: grid;') && wxss.includes('grid-template-columns: minmax(0, 1fr);'), 'Popup footer must stretch its projected block Button through a one-column grid track');
assert(previewStyles.includes('.pui-popup-preview__footer {\n  display: grid;'), 'H5 Popup footer mirrors the single full-width action track');
assert(wxml.includes('<slot name="content"></slot>'));
assert(wxml.includes('<slot></slot>'));
assert(wxml.includes('<slot name="close-btn">'));
assert(wxml.includes('theme="default" variant="base" shape="circle"'));
assert(wxml.includes('icon="close" icon-only'), 'default close control must use Button iconOnly so its native root remains circular');
assert(!wxml.includes('custom-style="width:var(--pui-button-size);'), 'Popup close control must consume Button iconOnly geometry rather than patch the native root');
assert(wxml.includes('wx:if="{{closeBtn}}"'), 'closeBtn=false remains the explicit compatibility opt-out for the default close control');
const closeSlotIndex = wxml.indexOf('<slot name="close-btn">');
const closeButtonIndex = wxml.indexOf('<pui-button wx:if="{{closeBtn}}"');
assert(closeButtonIndex < closeSlotIndex, 'default close Button must be an independent Header node, not named-slot fallback content that WeChat can suppress when Content Slot is present');
assert(wxml.includes('bind:click="onCloseTap"'));
assert(wxml.includes('catchtouchmove="noop"'));
assert(wxml.includes("blurOverlay ? 'pui-popup__mask--blurred' : ''"));
assert(!/pui-loading|pui-empty|customBody|submit|retry|after-open|after-close/.test(wxml));
assert.deepStrictEqual(Object.keys(json.usingComponents), ['pui-button']);
assert(!/height\s*:\s*auto[^;]*;[^}]*transition|display\s*:\s*none/.test(wxss));
assert(wxss.includes('transform: translateY(-32rpx)'));
assert(wxss.includes('transform: translateY(32rpx)'));
assert(wxss.includes('transform: translate(-32rpx, -50%)'));
assert(wxss.includes('transform: translate(32rpx, -50%)'));
assert(wxss.includes('width: 68vw; max-width: 68vw; height: 70vh; max-height: 70vh'));
assert(wxss.includes('.pui-popup--top.pui-popup--card { overflow: visible; background: transparent; border: 0; box-shadow: none;'));
assert(wxss.includes('.pui-popup--custom-navbar.pui-popup--top .pui-popup__content'));
assert(wxss.includes('--pui-popup-navbar-space'));
assert(wxss.includes('.pui-popup--custom-navbar.pui-popup--top.pui-popup--card .pui-popup__surface { margin-top: var(--pui-popup-navbar-space); }'));
assert(wxss.includes('align-items: stretch'));
assert(wxss.includes('grid-template-columns: minmax(0, 1fr);'), 'Popup Footer must provide a full-width grid track to slotted Button hosts');
assert(!/\.pui-popup__footer-content\s+pui-button/.test(wxss), 'Popup WXSS must not use a tag selector to penetrate a slotted Button host');
assert(wxss.includes('Footer 只提供唯一的全宽操作轨'), 'Popup Footer 必须将全宽操作轨作为组件语义，而不是穿透 Slot 改写子组件');
assert(wxss.includes('.pui-frosted-glass--on .pui-popup__mask'), '全局毛玻璃打开时 Popup 遮罩必须同步获得背景模糊');
assert(wxss.includes('--pui-popup-panel-padding: var(--pui-surface-inset)'));
assert(wxss.includes('--pui-popup-content-gap: var(--pui-surface-stack-gap)'));
assert(wxss.includes('--pui-popup-section-gap: var(--pui-surface-section-gap)'));
assert(wxss.includes('padding: var(--pui-popup-panel-padding)'));
assert(wxss.includes('gap: var(--pui-popup-content-gap)'));
assert(wxss.includes('.pui-popup--edge.pui-popup--bottom'));
assert(wxss.includes('.pui-popup__mask--blurred'));
assert(wxss.includes('--pui-popup-overlay-blur'));
assert(!/\.pui-popup-layer\s*\{[^}]*opacity\s*:/.test(wxss), 'Popup Layer only owns stacking and cannot fade away the blurred backdrop');
assert(/\.pui-popup__mask\s*\{[^}]*opacity:\s*0;[^}]*transition:\s*opacity/.test(wxss), 'Popup mask owns its own color-overlay fade');
assert(wxss.includes('.pui-popup-layer--entered .pui-popup__mask { opacity: 1; }'), 'Popup mask and Surface must enter together from the same Layer phase');
assert(!wxss.includes('pui-popup__handle'));
assert(!/\.pui-popup__footer\s*>\s*\*/.test(wxss), '微信 WXSS 不支持通配选择器，Popup 不得穿透改写 Footer Slot 子节点');
assert(!/\.pui-popup--reduced[^\{]*\*/.test(wxss), '低动效只能作用 Popup 自身，不能用 WXSS 通配选择器穿透 Slot');
assert(!wxss.includes('@import "../common/style/theme.wxss";'), 'Popup 不得将含 page 选择器的全局主题导入组件 WXSS；Token 由消费者 app.wxss 的主题入口提供');
assert(wxss.includes('.pui-popup--reduced { animation-duration: 1ms !important; transition-duration: 1ms !important; }'));

assert.deepStrictEqual(metadata.apiProps.popup, expectedProps);
assert.deepStrictEqual(metadata.apiEvents.popup.map((event) => event.name), ['visible-change']);
assert(!metadata.apiEvents.popup[0].detail.includes('drag'));
assert.deepStrictEqual(metadata.apiPropGroups.popup.flatMap((group) => group.keys), expectedProps);
assert.deepStrictEqual(metadata.apiSlots.popup.map((slot) => slot.name), ['default', 'content', 'header-left', 'close-btn', 'footer']);
assert.strictEqual(metadata.apiMethods.popup, undefined);

const popupUsage = preview.slice(preview.indexOf("if (runtimeId === 'popup')"), preview.indexOf("if (runtimeId === 'sheet')"));
assert(popupUsage.includes('<pui-popup${attrs ? ` ${attrs}` : \'\'} />'));
assert(!popupUsage.includes('bind:'), 'Popup basic WXML must stay minimal and bind-free');
assert(preview.includes('function popupSample(props, demo)'));
assert(preview.includes('function bindPopupPreviewRuntime(props)'));
const popupSource = preview.slice(preview.indexOf('function popupSample(props, demo)'), preview.indexOf('function bindPopupPreviewRuntime(props)'));
assert(preview.includes('function updatePopupPreviewDom(demo)'));
assert(preview.includes("host.classList.toggle('is-active', !!demo.popupActive)"));
assert(preview.includes("host.dataset.popupPhase = phase"));
assert(preview.includes("if (demo.popupPhase === 'entering') schedulePopupPreviewPhase(demo, 16, 'entering')"));
assert(preview.includes("schedulePopupPreviewPhase(demo, popupMotionDuration(getProps(state.current)), 'leaving')"));
assert(preview.includes('if (existingHost && demo.popupMounted)'));
assert(preview.includes('data-popup-preview-host data-popup-phase="${current.phase}"'));
assert(preview.includes("props.card !== false"));
assert(!popupSource.includes('data-popup-handle'));
assert(!popupSource.includes('props.showHandle'));
assert(!popupSource.includes('props.draggable'));
assert(!popupSource.includes("trigger: 'drag'"));
assert(preview.includes("pui-popup-preview--edge"));
assert(preview.includes('pui-popup-preview__surface'), 'H5 Popup must mirror the native inner Surface');
assert(preview.includes("pui-popup-preview__mask--blurred"));
assert(preview.includes("'card', 'placement', 'showOverlay', 'blurOverlay'"), 'Popup trigger Inspector must expose card and blurOverlay in its contextual settings');
assert(preview.includes("'showOverlay', 'blurOverlay', 'closeOnOverlayClick'"), 'Popup overlay Inspector must expose blurOverlay with overlay settings');
assert(preview.includes('pui-popup-showcase--closed'));
assert(preview.includes('const triggerMarkup ='), 'Popup triggers must be shared by closed and mounted preview states');
assert(preview.includes('pui-popup-showcase--open'), 'Popup opening must preserve the trigger layer beneath the overlay');
assert(preview.includes("placementAction('top', '顶部打开', 'arrow-up')"));
assert(preview.includes("placementAction('left', '左侧打开', 'arrow-left', 'outline')"));
assert(preview.includes("placementAction('center', '居中打开', 'component', 'outline')"));
assert(preview.includes("placementAction('right', '右侧打开', 'arrow-right', 'outline')"));
assert(preview.includes("placementAction('bottom', '底部打开', 'arrow-down')"));
assert(preview.includes('demoValue: placementName'));
assert(preview.includes("state.props[state.current].placement = placement;"), 'Popup placement triggers must write the actual placement prop before opening');
assert(preview.includes('const previousPlacement = popupPlacement(getProps(state.current));'), 'Popup direction changes must compare against the current rendered placement');
assert(preview.includes("const existingHost = document.querySelector('#previewStage .pui-popup-preview-host');"), 'Popup direction changes must inspect the retained host rather than trusting stale state');
assert(preview.includes("demo.popupMounted = false;\n        demo.popupActive = false;\n        demo.popupPhase = 'hidden';"), 'Popup direction changes must discard a leaving host before reopening');
assert(preview.includes("theme: 'primary', variant: 'base', shape: 'circle', size: 'small', icon: 'user-add'"));
assert(preview.includes("theme: 'default', variant: 'base', shape: 'circle', size: 'small', icon: 'close'"));
assert(preview.includes("icon: 'close', iconOnly: true, content: '', ariaLabel: '关闭弹出层'"), 'H5 Popup mirror uses Button\'s shared icon-only close geometry');
assert(preview.includes("closeBtn: { type: 'boolean', value: true }"), 'H5 Popup defaults to the same persistent close control');
assert(preview.includes("placement: 'bottom'"));
assert(preview.includes("requestPopupPreviewVisibility(props, demo, false, 'close-btn')"));
const popupClickBranches = preview.slice(preview.indexOf("} else if (type === 'popup-open')"), preview.indexOf("} else if (type === 'popup-header-left')"));
assert.strictEqual((popupClickBranches.match(/return;/g) || []).length, 5, 'Popup open, preference, overlay and close branches must not fall through to an unrelated Stage rebuild');
assert(preview.includes('visible-change：{ visible: false'));
assert(previewStyles.includes('.pui-popup-preview__scroll'));
assert(previewStyles.includes('.pui-popup-preview__header'));
assert(previewStyles.includes('.pui-popup-preview__footer'));
assert(previewStyles.includes('.pui-popup-preview--custom-navbar'));
assert(previewStyles.includes('.pui-popup-preview--edge'));
assert(previewStyles.includes('.pui-popup-preview__mask--blurred'));
assert(previewStyles.includes('--pui-popup-overlay-blur'));
assert(/\.pui-popup-preview__mask\s*\{[\s\S]{0,300}?opacity:\s*0;[\s\S]{0,300}?transition:\s*opacity/.test(previewStyles), 'H5 mirror keeps the mask-owned opacity transition used by the mini-program Popup');
assert(previewStyles.includes('.pui-popup-preview-host.is-active .pui-popup-preview__mask {\n  opacity: 1;\n}'), 'H5 mirror activates mask opacity in the same host phase as the Popup Surface');
assert(previewStyles.includes('.pui-popup-preview__mask,\n  body .app-shell[data-page-mode] .preview-stage .pui-popup-preview {'), 'H5 低动效只压缩 Popup Mask 与 Surface');
assert(!previewStyles.includes('.pui-popup-preview-host *,'), 'H5 低动效不能穿透覆盖 Popup Slot 子组件');
assert(!previewStyles.includes('.pui-popup-preview__handle-wrap'));
assert(!previewStyles.includes('.pui-popup-preview--bottom.is-dragging'));
assert(previewStyles.includes('pui-popup-preview__title-area {\n  position: relative;\n  display: flex;\n  min-width: 0;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: var(--pui-preview-space-step-2);'));
assert(previewStyles.includes('pui-popup-preview__title-area span {\n  color: var(--subtle);'));
assert(previewStyles.includes('.pui-popup-showcase {'));
assert(previewStyles.includes('.pui-popup-showcase > .pui-popup-preview-host'));
assert(previewStyles.includes('.pui-popup-showcase__trigger--middle'));
assert(preview.includes('pui-popup-showcase__trigger-center'));
assert(preview.includes('pui-popup-showcase__trigger-sides'));
assert(previewStyles.includes('.pui-popup-showcase__trigger-sides'));
assert(previewStyles.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
assert(previewStyles.includes('align-items: start'));
const popupPreviewTail = previewStyles.slice(previewStyles.lastIndexOf('/* Popup mirrors the native retained-node lifecycle'));
assert(popupPreviewTail.includes('text-overflow: clip'));
assert(popupPreviewTail.includes('white-space: normal'));
const bottomPopupRuleStart = popupPreviewTail.indexOf('.overlay-box--bottom .pui-popup-preview');
assert(bottomPopupRuleStart >= 0 && popupPreviewTail.slice(bottomPopupRuleStart, bottomPopupRuleStart + 260).includes('top: auto'), 'bottom popup placement must clear the generic top inset');
const centerPopupRuleStart = popupPreviewTail.indexOf('.overlay-box--center .pui-popup-preview');
assert(centerPopupRuleStart >= 0 && popupPreviewTail.slice(centerPopupRuleStart, centerPopupRuleStart + 360).includes('scale(.96)'), 'center popup must enter from its own center instead of translating upward from bottom');
assert(popupPreviewTail.includes('pui-popup-preview--center {\n  opacity: 1;\n  transform: translate(-50%, -50%) scale(1);'), 'center popup completion state must keep a centered scale transform');
assert(popupPreviewTail.includes('.overlay-box--left .pui-popup-preview__scroll') && popupPreviewTail.includes('max-height: none;'), 'side popup content must flex to the constrained footer');
assert(popupPreviewTail.includes('width: 68vw') && popupPreviewTail.includes('height: 70vh'), 'side popup surface must use the requested 68vw by 70vh geometry');
assert(popupPreviewTail.includes('.overlay-box--top .pui-popup-preview--card') && popupPreviewTail.includes('overflow: visible;') && popupPreviewTail.includes('background: transparent;'), 'top card popup mirror must keep its outer surface transparent and let the inner Surface shadow bleed');
assert(popupPreviewTail.includes('pui-popup-preview--custom-navbar .pui-popup-preview__content') || popupPreviewTail.includes('pui-popup-preview--custom-navbar .pui-popup-preview__scroll'), 'top custom-navbar popup must reserve content space below the navbar');
assert(popupPreviewTail.includes('pui-popup-preview--custom-navbar.pui-popup-preview--card .pui-popup-preview__surface') && popupPreviewTail.includes('margin-top: calc(var(--pui-navbar-preview-safe-height) + var(--pui-navbar-preview-content-height) + var(--pui-preview-space-step-12));'), 'top card popup mirror must start its inner panel below the navbar');
assert(!preview.includes('popup-submit'));
assert(!preview.includes('popup-retry'));
assert(preview.includes('const triggerMarkup ='), 'Popup preview must derive a single reusable trigger layer');
assert(preview.includes('pui-popup-showcase--open'), 'Popup preview must keep an open-state showcase root');
assert(preview.includes('function cellGroupSample(options = {})'), 'Popup preview must use the shared CellGroup mirror helper');
assert(preview.includes("className: 'pui-popup-showcase__preferences'"), 'Popup preview must compose card and overlay-blur controls as one CellGroup');
assert(preview.includes("className: 'pui-popup-preview__content-group'"), 'Popup content cells must be grouped as a CellGroup');
assert(preview.includes('class="pui-text-cut">${escapeHtml(props.subtitle)}</span>'), 'Popup preview subtitle uses the shared single-line text utility');
assert(preview.includes("preferenceSwitch('card', '卡片模式')") && preview.includes("preferenceSwitch('blurOverlay', '毛玻璃遮罩')"), 'Popup preference cells must use shared PUI Switch mirrors');
assert(preview.includes('motion: props.reduceMotion ? 1 : 500,'), 'Popup preference Switch mirrors keep the global 500ms/1ms motion contract');
assert(preview.includes("type === 'popup-toggle-card' || type === 'popup-toggle-blur-overlay'"), 'Popup preference switches must write real component props');
const popupOpenShowcase = preview.slice(preview.indexOf('pui-popup-showcase--open'), preview.indexOf('function bindPopupPreviewRuntime'));
assert(popupOpenShowcase.indexOf('${triggerMarkup}') < popupOpenShowcase.indexOf('pui-popup-preview-host'), 'Popup overlay must layer above, not replace, the trigger content');
assert(previewStyles.includes('.pui-popup-showcase > .pui-popup-preview-host'), 'Popup preview host must be explicitly layered above the base content');
assert(previewStyles.includes('.pui-popup-showcase__preferences') && previewStyles.includes('.pui-popup-showcase__preferences .pui-cell + .pui-cell'), 'Popup Cell group must provide a single grouped surface and row divider');
assert(previewStyles.includes('.pui-popup-preview__title-area span {') && previewStyles.includes('text-overflow: ellipsis;'), 'Popup preview subtitle truncates on one line');
assert(wxss.includes('text-overflow: ellipsis') && wxss.includes('white-space: nowrap'), 'Popup mini-program subtitle truncates on one line');

const popupApi = api.slice(api.indexOf('## Popup'), api.indexOf('## Popover'));
assert(popupApi.includes('基础浮层'));
assert(popupApi.includes('`visible-change`'));
assert(popupApi.includes('<pui-popup />'));
assert(popupApi.includes('`card`'));
assert(popupApi.includes('`blurOverlay`'));
assert(!popupApi.includes('`showHandle`'));
assert(!popupApi.includes('`draggable`'));
assert(!popupApi.includes("trigger='drag'"));
assert(!/`position`|`confirmLoading`|`after-close`|`retry\(`/.test(popupApi));
assert(compatibility.slice(compatibility.indexOf('49. Popup'), compatibility.indexOf('50. Popover')).includes('Header/Content/Footer'));
assert(compatibility.slice(compatibility.indexOf('49. Popup'), compatibility.indexOf('50. Popover')).includes('blurOverlay'));
for (const heading of ['## 1. 组件定位', '## 2. 固定结构与区域', '## 3. PUI 组合与依赖', '## 4. Token、间距与排版', '## 5. 内容、Slot 与组合边界', '## 6. 状态与优先级', '## 7. 交互、受控边界与事件', '## 8. 可访问性', '## 9. H5 预览与跨端一致性', '## 10. 响应式、主题与视觉配置', '## 11. 明确禁止', '## 12. 修改闭环']) assert(contract.includes(heading), `Popup contract must include ${heading}`);
assert(contractIndex.includes('[Popup](./POPUP.md)'));
assert(contract.includes('tdesign-miniprogram@1.15.3'));
assert(contract.includes('Header 采用三列网格'));
assert(contract.includes('不能嵌入命名 Slot 的 fallback'));
assert(contract.includes('`card=true`'));
assert(contract.includes('`blurOverlay=true`'));
const uiContract = fs.readFileSync(path.join(root, 'docs/UI_DESIGN_CONTRACT.md'), 'utf8');
assert(uiContract.includes('### Popup 操作面板规则'));
assert(uiContract.includes('Footer 只承载主要动作'));
assert(uiContract.includes('间距按层级消费 Token'));

assert(pickerWxml.includes('bind:visible-change="onPopupVisibleChange"'));
assert(sheetWxml.includes('bind:visible-change="onPopupVisibleChange"'));
assert(dialogWxml.includes('bind:visible-change="onPopupVisibleChange"'));
assert(exampleWxml.includes('bind:visible-change="onPopupVisibleChange"'));
assert(exampleJs.includes('onPopupVisibleChange'));
assert(!/popupLoading|popupError|popupSaving|onPopupSubmit|onPopupRetry/.test(exampleJs));

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const distPath = path.join(root, `miniprogram_dist/popup/popup.${extension}`);
  if (!fs.existsSync(distPath)) return;
  const current = fs.readFileSync(path.join(root, `popup/popup.${extension}`));
  const dist = fs.readFileSync(distPath);
  assert(current.equals(dist), `generated Popup ${extension} must match source`);
});

console.log('Popup contract tests passed');
