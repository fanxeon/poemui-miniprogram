const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'top-loading/top-loading.js'), 'utf8');
let definition = null;
let nextTimerId = 0;
let now = 0;
let timers = new Map();

function setFakeTimeout(callback, delay) {
  const id = ++nextTimerId;
  timers.set(id, { callback, delay: Number(delay) || 0, order: id });
  return id;
}
function clearFakeTimeout(id) { timers.delete(id); }
function runNextTimer() {
  const queue = [...timers.entries()].sort((a, b) => a[1].delay - b[1].delay || a[1].order - b[1].order);
  if (!queue.length) return false;
  const [id, timer] = queue[0];
  timers.delete(id);
  now += timer.delay;
  timer.callback();
  return true;
}

vm.runInNewContext(source, {
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    throw new Error(`Unexpected TopLoading dependency: ${request}`);
  },
  Component(value) { definition = value; },
  setTimeout: setFakeTimeout,
  clearTimeout: clearFakeTimeout,
  Date: { now: () => now },
  isFinite,
  Math,
}, { filename: 'top-loading/top-loading.js' });

assert(definition, 'TopLoading definition must register');
const PUBLIC_PROPS = ['state', 'progress', 'delay', 'minimumVisible', 'successDuration', 'duration', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS);

function create(overrides) {
  timers = new Map();
  now = 0;
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const instance = {
    _ready: false,
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) {
      Object.assign(this.data, patch);
      if (callback) callback();
    },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return instance;
}

const waiting = create({ state: 'loading', delay: 220, progress: null });
assert.strictEqual(waiting.data.phase, 'waiting');
assert.strictEqual(waiting.data.mounted, false);
assert.strictEqual(waiting.data.determinate, false);
waiting.data.state = 'idle';
waiting.syncState();
while (runNextTimer());
assert.strictEqual(waiting.data.mounted, false, 'short cancelled loading never flashes');

const exact = create({ state: 'loading', delay: 0, progress: 0 });
runNextTimer();
assert.strictEqual(exact.data.mounted, true);
assert.strictEqual(exact.data.active, true);
assert.strictEqual(exact.data.determinate, true);
assert.strictEqual(exact.data.progressValue, 0, 'progress=0 remains exact');
exact.data.progress = 68;
exact.syncPresentation();
assert.strictEqual(exact.data.progressValue, 68);

exact.data.state = 'success';
exact.syncState();
runNextTimer();
assert.strictEqual(exact.data.successful, true, 'only explicit success enters completion');
assert.strictEqual(exact.data.phase, 'success');
runNextTimer();
assert.strictEqual(exact.data.phase, 'leaving');
runNextTimer();
assert.strictEqual(exact.data.mounted, false);

const cancelled = create({ state: 'loading', delay: 0, minimumVisible: 500 });
runNextTimer();
cancelled.data.state = 'idle';
cancelled.syncState();
assert.strictEqual(cancelled.data.successful, false);
assert.strictEqual(cancelled.data.phase, 'leaving', 'failure/cancel does not wait for minimumVisible');
runNextTimer();
assert.strictEqual(cancelled.data.mounted, false);

const reduced = create({ state: 'loading', delay: 0, reduceMotion: true, duration: 900 });
assert(reduced.data.rootStyle.includes('--pui-top-loading-duration:1ms'));

const wxml = fs.readFileSync(path.join(root, 'top-loading/top-loading.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'top-loading/top-loading.wxss'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const previewSource = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const miniprogramPage = fs.readFileSync(path.join(root, 'miniprogram/pages/components/top-loading/index.wxml'), 'utf8');
const examplePage = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
assert(wxml.includes('role="progressbar"'));
assert(wxml.includes('aria-valuenow'));
assert(!/<button\b|<input\b/.test(wxml));
assert(wxss.includes('transform:scaleX(var(--pui-top-loading-progress))'));
assert(wxss.includes('@keyframes pui-top-loading-one'));
assert(!/transition[^;]*(?:width|left|height)/.test(wxss));
assert(!wxss.includes('display:none'));
assert.deepStrictEqual(metadata.apiProps['top-loading'], PUBLIC_PROPS);
assert.strictEqual(metadata.apiEvents['top-loading'], undefined);
assert.strictEqual(metadata.apiMethods['top-loading'], undefined);
assert(fs.existsSync(path.join(root, 'docs/components/TOP-LOADING.md')));
['topLoadingShowcase', 'bindTopLoadingPreviewRuntime', "demoAction: 'top-loading-unknown'", "demoAction: 'top-loading-success'"]
  .forEach((token) => assert(previewSource.includes(token), `TopLoading H5 must retain ${token}`));
assert(previewSource.includes("'top-loading': {"));
assert(previewSource.includes("delay: { type: 'range', value: 220, min: 0, max: 5000, step: 20 }"));
assert(previewSource.includes("duration: { type: 'range', value: 500, min: 0, max: 1000, step: 20 }"));
['.pui-top-loading-preview', '@keyframes pui-top-loading-preview-one']
  .forEach((token) => assert(previewStyles.includes(token), `TopLoading H5 styles must retain ${token}`));
assert(previewSource.includes('pui-top-loading-showcase__triggers'));
assert(!previewSource.includes('pui-top-loading-showcase__controls'));
assert(miniprogramPage.includes('<pui-top-loading'));
assert(miniprogramPage.includes('bind:click="onStartExact"'));
assert(examplePage.includes('<pui-top-loading'));

[waiting, exact, cancelled, reduced].forEach((instance) => definition.lifetimes.detached.call(instance));
console.log('TopLoading contract tests passed.');
