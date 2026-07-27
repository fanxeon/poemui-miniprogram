const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'loading/loading.js'), 'utf8');
let definition = null;
let nextTimerId = 0;
const timers = new Map();

function setFakeTimeout(callback, delay) {
  const id = ++nextTimerId;
  timers.set(id, { callback, delay: Number(delay) || 0 });
  return id;
}

function clearFakeTimeout(id) {
  timers.delete(id);
}

function runTimers() {
  while (timers.size) {
    const [id, timer] = [...timers.entries()].sort((left, right) => left[1].delay - right[1].delay)[0];
    timers.delete(id);
    timer.callback();
  }
}

vm.runInNewContext(source, {
  require: (request) => {
    if (request === '../common/behaviors/theme') return {};
    throw new Error(`Unexpected Loading dependency: ${request}`);
  },
  Component: (value) => { definition = value; },
  setTimeout: setFakeTimeout,
  clearTimeout: clearFakeTimeout,
}, { filename: 'loading/loading.js' });
assert(definition, 'Loading component definition must be registered');

const PUBLIC_PROPS = [
  'delay', 'duration', 'fullscreen', 'indicator', 'inheritColor', 'layout', 'loading', 'pause',
  'progress', 'reverse', 'size', 'text', 'theme', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS, 'Loading publishes only the reviewed Props');
['color', 'easing', 'showProgress', 'vertical', 'show', 'hide']
  .forEach((key) => assert(!definition.properties[key], `${key} must not return to Loading`));

function create(overrides) {
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

const active = create({ theme: 'spinner', layout: 'vertical', progress: 0, size: '200rpx', duration: 500, text: '同步组件产物' });
assert.strictEqual(active.instance.data.phase, 'entering', 'default loading mounts into entering phase');
assert.strictEqual(active.instance.data.mounted, true);
runTimers();
assert.strictEqual(active.instance.data.phase, 'visible', 'enter timer enters the visible phase');
assert.strictEqual(active.instance.data.active, true);
assert.strictEqual(active.instance.data.normalizedTheme, 'spinner');
assert.strictEqual(active.instance.data.normalizedLayout, 'vertical');
assert.strictEqual(active.instance.data.progressValue, 0, 'progress=0 remains a valid visible boundary');
assert.strictEqual(active.instance.data.showProgressValue, true);
assert(active.instance.data.rootStyle.includes('--pui-loading-size:128rpx;'), 'size is clamped safely');
assert(active.instance.data.rootStyle.includes('--pui-loading-duration:500ms;'));
assert.strictEqual(active.events.length, 0, 'render stages do not emit public lifecycle events');

active.instance.data.loading = false;
active.instance.syncVisibility();
assert.strictEqual(active.instance.data.phase, 'leaving', 'loading=false starts the retained leave phase');
assert.strictEqual(active.instance.data.mounted, true, 'leave frame keeps the node mounted');
runTimers();
assert.strictEqual(active.instance.data.phase, 'hidden');
assert.strictEqual(active.instance.data.mounted, false, 'node unmounts after the leave duration');
assert.strictEqual(active.events.length, 0, 'leave completion is not a business event');

const waiting = create({ loading: true, delay: 120 });
assert.strictEqual(waiting.instance.data.phase, 'waiting');
assert.strictEqual(waiting.instance.data.mounted, false);
waiting.instance.data.loading = false;
waiting.instance.syncVisibility();
runTimers();
assert.strictEqual(waiting.instance.data.phase, 'hidden', 'cancelling while waiting clears the delayed mount');
assert.strictEqual(waiting.instance.data.mounted, false);

const reduced = create({ reduceMotion: true, duration: 400, theme: 'dots', progress: -1, inheritColor: true, fullscreen: true });
assert(reduced.instance.data.rootStyle.includes('--pui-loading-duration:1ms;'), 'reduceMotion compresses all motion to 1ms');
assert(reduced.instance.data.rootClass.includes('pui-loading--reduced-motion'));
assert(reduced.instance.data.rootClass.includes('pui-loading--fullscreen'));
assert.strictEqual(reduced.instance.data.showProgressValue, false, 'negative progress hides the optional progress text');
assert(reduced.instance.data.rootStyle.includes('--pui-loading-color:currentColor;'));
runTimers();

const wxml = fs.readFileSync(path.join(root, 'loading/loading.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'loading/loading.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'loading/loading.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const alignment = fs.readFileSync(path.join(root, 'docs/TDESIGN_COMPONENT_ALIGNMENT.md'), 'utf8');

assert.strictEqual(json.usingComponents, undefined, 'Loading is a base component and has no child component registrations');
['<slot name="indicator"></slot>', '<slot name="text"></slot>', '<slot></slot>', 'role="status"', 'aria-live="polite"']
  .forEach((token) => assert(wxml.includes(token), `Loading WXML must retain ${token}`));
assert(!wxml.includes('bind:'));
assert(!source.includes('triggerEvent('), 'Loading must not publish lifecycle or business events');
assert(!/transition\s*:[^;]*\bheight\s*:\s*auto/.test(wxss));
assert(!wxss.includes('display: none'));
assert(!wxss.includes('text-overflow: ellipsis'));
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss));

assert.deepStrictEqual(metadata.apiProps.loading, PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiPropGroups.loading.flatMap((group) => group.keys), [
  'theme', 'size', 'text', 'indicator', 'layout', 'progress', 'inheritColor',
  'loading', 'delay', 'duration', 'pause', 'reverse', 'fullscreen', 'ariaLabel', 'reduceMotion',
]);
assert.strictEqual(metadata.apiEvents.loading, undefined);
assert.strictEqual(metadata.apiMethods.loading, undefined);
assert.deepStrictEqual(metadata.apiSlots.loading.map((slot) => slot.name), ['default', 'indicator', 'text']);

const previewSource = preview.slice(preview.indexOf('function loadingPreviewSize'), preview.indexOf('function browserInputType'));
['<h3>基础用法</h3>', '<h3>图标与文字</h3>', '<h3>方向与进度</h3>', '<h3>全屏与低动效</h3>', 'buttonSample({', 'loadingPreviewMarkup', 'data-loading-preview-current', 'preserveLoadingPreviewExit', 'pui-spinner--ticks']
  .forEach((token) => assert(previewSource.includes(token), `Loading preview must contain ${token}`));
['showProgress', 'loadingEvent', 'cellSample({'].forEach((legacy) => assert(!previewSource.includes(legacy), `${legacy} must not remain in the Loading preview`));
assert(previewStyles.includes('.pui-loading-preview__indicator--spinner'));
assert(previewStyles.includes('.pui-spinner--ticks'));
assert(previewStyles.includes('.pui-loading-preview.is-fullscreen'));

const usageSource = preview.slice(preview.indexOf("if (runtimeId === 'loading')"), preview.indexOf("if (runtimeId === 'button')", preview.indexOf("if (runtimeId === 'loading')")));
assert(usageSource.includes('sourceDefaults'));
assert(usageSource.includes('<pui-loading'));
assert(!usageSource.includes('bind:'), 'Loading basic WXML does not bind nonexistent lifecycle events');

const exampleSection = exampleWxml.slice(exampleWxml.indexOf('<view class="loading-example">'), exampleWxml.indexOf('<view class="toast-example-action">'));
assert(exampleSection.includes('<pui-loading text="同步组件产物" progress="68" aria-label="组件产物同步状态">'));
assert(!exampleSection.includes('bind:'), 'Loading example basic usage contains no events');
assert(!exampleSection.includes('show-progress'));
['exampleLoading', 'loadingStatus', 'toggleExampleLoading', 'onLoadingShow', 'onLoadingHide']
  .forEach((name) => assert(!exampleJs.includes(name), `${name} must not remain in the example`));

const apiSection = api.slice(api.indexOf('## Loading'), api.indexOf('## Message'));
assert(apiSection.includes('Loading 不公开 Events 或实例方法'));
assert(apiSection.includes('`indicator`'));
assert(apiSection.includes('`text`'));
assert(!apiSection.includes('`showProgress`'));
assert(/\d+\. Loading 的 H5 镜像必须保留 waiting、entering、visible、leaving、hidden 阶段/.test(compatibility));
assert(fs.existsSync(path.join(root, 'docs/components/LOADING.md')));
assert(alignment.includes('## 44. Loading 对照摘要'));

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = path.join(root, `loading/loading.${extension}`);
  const distFile = path.join(root, `miniprogram_dist/loading/loading.${extension}`);
  assert.strictEqual(sha(sourceFile), sha(distFile), `Loading source/dist ${extension} must stay identical`);
  const installedFile = path.join(root, `_example/node_modules/poemui-miniprogram/miniprogram_dist/loading/loading.${extension}`);
  assert(fs.existsSync(installedFile), `Loading example install ${extension} must exist`);
  assert.strictEqual(sha(sourceFile), sha(installedFile), `Loading source/example install ${extension} must stay identical`);
  const wechatFile = path.join(root, `_example/miniprogram/miniprogram_npm/poemui-miniprogram/loading/loading.${extension}`);
  if (fs.existsSync(wechatFile)) assert.strictEqual(sha(sourceFile), sha(wechatFile), `Loading source/WeChat npm ${extension} must stay identical`);
});

definition.lifetimes.detached.call(active.instance);
definition.lifetimes.detached.call(waiting.instance);
definition.lifetimes.detached.call(reduced.instance);

console.log('Loading contract tests passed.');
