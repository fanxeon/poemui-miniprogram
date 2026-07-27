const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'toast/toast.js'), 'utf8');
let definition = null;
let nextTimerId = 0;
let timers = new Map();

function setFakeTimeout(callback, delay) {
  const id = ++nextTimerId;
  timers.set(id, { callback, delay: Number(delay) || 0, order: id });
  return id;
}

function clearFakeTimeout(id) {
  timers.delete(id);
}

function runNextTimer() {
  const queue = [...timers.entries()].sort((left, right) => left[1].delay - right[1].delay || left[1].order - right[1].order);
  if (!queue.length) return false;
  const [id, timer] = queue[0];
  timers.delete(id);
  timer.callback();
  return true;
}

vm.runInNewContext(source, {
  require: (request) => {
    if (request === '../common/behaviors/theme') return {};
    throw new Error(`Unexpected Toast dependency: ${request}`);
  },
  Component: (value) => { definition = value; },
  setTimeout: setFakeTimeout,
  clearTimeout: clearFakeTimeout,
  isFinite,
}, { filename: 'toast/toast.js' });

assert(definition, 'Toast component definition must be registered');

const PUBLIC_PROPS = [
  'direction', 'duration', 'icon', 'message', 'overlayProps', 'placement',
  'preventScrollThrough', 'showOverlay', 'theme', 'usingCustomNavbar', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'Toast only publishes its reviewed 12 Props');
['visible', 'defaultVisible', 'showIcon', 'zIndex', 'motionDuration', 'easing'].forEach((key) => {
  assert(!definition.properties[key], `${key} must not return to Toast public Props`);
});

function create(overrides) {
  timers = new Map();
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    _ready: false,
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) {
      Object.assign(this.data, patch);
      if (typeof callback === 'function') callback();
    },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const defaults = create();
assert.strictEqual(defaults.instance.data.rendered, false);
assert.strictEqual(defaults.instance.data.innerVisible, false);
assert.strictEqual(defaults.instance.data.normalizedTheme, '');
assert(defaults.instance.data.layerStyle.includes('--pui-toast-duration:500ms'));

const shown = create();
shown.instance.show({
  message: '保存成功',
  theme: 'success',
  placement: 'bottom',
  direction: 'column',
  showOverlay: true,
  preventScrollThrough: true,
  overlayProps: { backgroundColor: '#101014', zIndex: 12001, duration: 900, preventScrollThrough: false },
  duration: 0,
});
assert.strictEqual(shown.instance.data.rendered, true, 'show() mounts the Toast');
assert.strictEqual(shown.instance.data.innerVisible, false, 'show() keeps the first animation frame inactive');
assert.strictEqual(shown.instance.data.overlayEnabled, true);
assert.strictEqual(shown.instance.data.overlayBackground, '#101014');
assert.strictEqual(shown.instance.data.overlayZIndex, 12000, 'Overlay zIndex is constrained');
assert.strictEqual(shown.instance.data.overlayDuration, 900, 'Overlay duration is constrained without changing a valid value');
assert.strictEqual(shown.instance.data.overlayPreventScrollThrough, true);
assert(shown.instance.data.rootClass.includes('pui-toast--bottom'));
assert(shown.instance.data.rootClass.includes('pui-toast--column'));
assert.strictEqual(runNextTimer(), true, 'show next frame activates Toast');
assert.strictEqual(shown.instance.data.innerVisible, true);
assert.strictEqual(timers.size, 0, 'duration=0 does not schedule auto-hide');
shown.instance.hide();
assert.strictEqual(shown.instance.data.innerVisible, false, 'hide() begins the retained leave phase');
assert.strictEqual(shown.instance.data.rendered, true, 'hide() keeps the node mounted until the transition ends');
assert.strictEqual(shown.events.length, 0, 'hide start is not a public event');
assert.strictEqual(runNextTimer(), true);
assert.strictEqual(shown.instance.data.rendered, false);
assert.deepStrictEqual(shown.events.map((event) => event.name), ['close']);

const automatic = create();
automatic.instance.show({ message: '自动关闭', theme: 'loading', duration: 20 });
runNextTimer();
assert.strictEqual(automatic.instance.data.innerVisible, true);
assert.strictEqual(automatic.instance.data.isLoading, true);
assert.strictEqual(runNextTimer(), true, 'duration triggers real hide()');
assert.strictEqual(automatic.instance.data.innerVisible, false);
assert.strictEqual(automatic.instance.data.rendered, true);
assert.strictEqual(runNextTimer(), true, 'leave timer unmounts after duration');
assert.strictEqual(automatic.instance.data.rendered, false);
assert.deepStrictEqual(automatic.events.map((event) => event.name), ['close']);

const boundaries = create({ theme: 'error', placement: 'side', direction: 'diagonal', reduceMotion: true, ariaLabel: '错误反馈' });
boundaries.instance.show({ overlayProps: { backgroundColor: 'red;position:fixed', zIndex: -10, duration: -1 } });
assert.strictEqual(boundaries.instance.data.normalizedTheme, 'error');
assert(boundaries.instance.data.rootClass.includes('pui-toast--middle'));
assert(boundaries.instance.data.rootClass.includes('pui-toast--row'));
assert(boundaries.instance.data.rootClass.includes('pui-toast--reduced-motion'));
assert.strictEqual(boundaries.instance.data.overlayBackground, 'transparent');
assert.strictEqual(boundaries.instance.data.overlayZIndex, 1);
assert.strictEqual(boundaries.instance.data.overlayDuration, 1, 'reduceMotion wins over Overlay duration');
assert.strictEqual(boundaries.instance.data.ariaLive, 'assertive');
assert.strictEqual(boundaries.instance.motionDuration(), 1);

const wxml = fs.readFileSync(path.join(root, 'toast/toast.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'toast/toast.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'toast/toast.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const generator = fs.readFileSync(path.join(root, 'scripts/generate-components.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const alignment = fs.readFileSync(path.join(root, 'docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'utf8');

['<pui-overlay', '<pui-loading', '<pui-icon', '<slot name="icon"></slot>', '<slot name="message"></slot>']
  .forEach((token) => assert(wxml.includes(token), `Toast WXML must retain ${token}`));
assert(!wxml.includes('<slot></slot>'), 'Toast no longer claims a default Slot');
assert(!wxml.includes('bind:'), 'Toast does not emit fake WXML lifecycle events');
assert(!/<button\b|<input\b|<image\b/.test(wxml), 'Toast contains no raw replacement controls');
assert(wxss.includes('var(--pui-toast-duration)'));
assert(wxss.includes('.pui-toast--reduced-motion{transition-duration:1ms}'));
assert(!/transition\s*:[^;]*\bheight\s*:\s*auto/.test(wxss));
assert(!wxss.includes('display:none'));
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert.strictEqual(json.usingComponents['pui-loading'], '../loading/loading');
assert.strictEqual(json.usingComponents['pui-overlay'], '../overlay/overlay');

assert.deepStrictEqual(metadata.apiProps.toast, PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiPropGroups.toast.flatMap((group) => group.keys), [
  'message', 'theme', 'icon', 'direction', 'placement', 'duration', 'showOverlay',
  'preventScrollThrough', 'overlayProps', 'usingCustomNavbar', 'ariaLabel', 'reduceMotion',
]);
assert.deepStrictEqual(metadata.apiEvents.toast.map((event) => event.name), ['close']);
assert.deepStrictEqual(metadata.apiSlots.toast.map((slot) => slot.name), ['icon', 'message']);
assert.deepStrictEqual(metadata.apiMethods.toast.map((method) => method.name), ['show(options?)', 'hide()']);

const previewSource = preview.slice(preview.indexOf('function toastPreviewMotionDuration'), preview.indexOf('function dialogMotionDuration'));
['<h3>基础用法</h3>', '<h3>主题与图标</h3>', '<h3>方向与位置</h3>', '<h3>遮罩与滚动保护</h3>', 'demoAction: current.visible ? \'toast-hide\' : \'toast-show\'', 'function requestToastPreviewVisibility(props, demo, visible, source)', 'function toastPreviewMarkup(', 'data-toast-root data-toast-state="${escapeHtml(phase)}"']
  .forEach((token) => assert(previewSource.includes(token), `Toast preview must retain ${token}`));
assert(previewSource.includes('--pui-toast-ease:var(--ease-standard)'), 'Toast H5 transition must provide its easing token');
['defaultVisible', 'props.visible', 'toastUncontrolledVisible', 'toastPendingSource', 'toast-close', 'input → change'].forEach((legacy) => {
  assert(!previewSource.includes(legacy), `${legacy} must not remain in the Toast preview`);
});
assert(preview.includes('<pui-toast id="delivery-toast" />'));
assert(!preview.includes('bind:open="onToastOpen"'));
assert(preview.includes('未列出的 default Slot 不存在。'));
assert(previewStyles.includes('.toast-demo-section'));
assert(previewStyles.includes('.toast-theme-list'));
assert(previewStyles.includes('.toast-preview-scrim'));
assert(previewStyles.includes('.toast-demo { transition-duration: 1ms !important; }'));
assert(api.includes('`show(options)`'));
assert(api.includes('`hide()`'));
assert(api.includes('| `close` | 无 |'));
assert(!api.slice(api.indexOf('## Toast'), api.indexOf('## Dialog')).includes('| `visible`'));
assert(compatibility.includes('Toast 不公开 `visible/defaultVisible`'));
assert(shadcn.includes("['Toast', 'toast', 'adapter', 'tap'"));
assert(shadcn.includes('show(options)/hide()'));
assert(generator.includes("  'toast',"), 'experimental generator protects Toast');
assert(exampleWxml.includes('<pui-toast id="delivery-toast" bind:close="onToastClose">'));
assert(!exampleWxml.includes('visible="{{toastVisible}}"'));
assert(exampleJs.includes("selectComponent('#delivery-toast')"));
assert(!exampleJs.includes('onToastInput'));
assert(fs.existsSync(path.join(root, 'docs/components/TOAST.md')));
assert(alignment.includes('## 45. Toast 对照摘要'));

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = path.join(root, `toast/toast.${extension}`);
  const distFile = path.join(root, `miniprogram_dist/toast/toast.${extension}`);
  assert.strictEqual(sha(sourceFile), sha(distFile), `Toast source/dist ${extension} must stay identical`);
  const installedFile = path.join(root, `_example/node_modules/poemui-miniprogram/miniprogram_dist/toast/toast.${extension}`);
  assert(fs.existsSync(installedFile), `Toast example install ${extension} must exist`);
  assert.strictEqual(sha(sourceFile), sha(installedFile), `Toast source/example install ${extension} must stay identical`);
  const wechatFile = path.join(root, `_example/miniprogram/miniprogram_npm/poemui-miniprogram/toast/toast.${extension}`);
  if (fs.existsSync(wechatFile)) assert.strictEqual(sha(sourceFile), sha(wechatFile), `Toast source/WeChat npm ${extension} must stay identical`);
});

[defaults, shown, automatic, boundaries].forEach(({ instance }) => definition.lifetimes.detached.call(instance));

console.log('Toast contract tests passed.');
