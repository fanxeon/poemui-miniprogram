const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'dynamic-message/dynamic-message.js'), 'utf8');
let definition = null;
let nextTimerId = 0;
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
  timer.callback();
  return true;
}
function nextTimerDelay() {
  const queue = [...timers.values()].sort((a, b) => a.delay - b.delay || a.order - b.order);
  return queue.length ? queue[0].delay : null;
}

vm.runInNewContext(source, {
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    throw new Error(`Unexpected DynamicMessage dependency: ${request}`);
  },
  Component(value) { definition = value; },
  setTimeout: setFakeTimeout,
  clearTimeout: clearFakeTimeout,
  wx: {
    getWindowInfo: () => ({ statusBarHeight: 24 }),
    getMenuButtonBoundingClientRect: () => ({ bottom: 56 }),
  },
  isFinite,
  Math,
  Object,
}, { filename: 'dynamic-message/dynamic-message.js' });

assert(definition, 'DynamicMessage definition must register');
const PUBLIC_PROPS = ['theme', 'title', 'message', 'icon', 'actionText', 'closable', 'duration', 'safeArea', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), PUBLIC_PROPS);

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
      if (callback) callback();
    },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const retained = create();
const key = retained.instance.show({ key: 'build', theme: 'loading', title: '正在构建', message: '准备组件产物' });
assert.strictEqual(key, 'build');
assert.strictEqual(retained.instance.data.rendered, true);
assert.strictEqual(retained.instance.data.active, false);
runNextTimer();
assert.strictEqual(retained.instance.data.active, true);
assert.strictEqual(retained.instance.data.phase, 'compact', 'first frame must reveal only the compact icon and title capsule');
assert.strictEqual(nextTimerDelay(), 180, 'compact entrance owns the first 180ms stage');
runNextTimer();
assert.strictEqual(retained.instance.data.phase, 'expanding', 'panel content expands only after the compact capsule has landed');
assert.strictEqual(nextTimerDelay(), 320, 'panel expansion owns the remaining 320ms');
runNextTimer();
assert.strictEqual(retained.instance.data.phase, 'visible');
assert.strictEqual(retained.instance.data.currentDuration, 0, 'loading defaults to persistent');
assert.strictEqual(timers.size, 0);
assert.strictEqual(retained.instance.update('build', { theme: 'success', title: '构建完成', duration: 20 }), true);
assert.strictEqual(retained.instance.data.rendered, true, 'same key keeps the node mounted');
assert.strictEqual(retained.instance.data.currentTheme, 'success');
assert.strictEqual(retained.instance.data.currentIcon, 'success-circle', 'theme updates must not retain the previous default icon');
retained.instance.show({ key: 'build', message: '产物已经可用' });
assert.strictEqual(retained.instance.data.currentTheme, 'success', 'same-key show must patch the retained message instead of resetting it');
assert.strictEqual(retained.instance.data.currentMessage, '产物已经可用');
runNextTimer();
assert.strictEqual(retained.instance.data.phase, 'collapsing', 'timeout first collapses the full panel back into a compact capsule');
assert.strictEqual(retained.events.length, 0);
runNextTimer();
assert.strictEqual(retained.instance.data.phase, 'leave-compact', 'compact capsule exits upward only after the panel has collapsed');
assert.strictEqual(retained.events.length, 0);
runNextTimer();
assert.deepStrictEqual(retained.events.map((event) => event.name), ['close']);
assert.strictEqual(retained.events[0].detail.reason, 'timeout');

const queued = create();
queued.instance.show({ key: 'first', title: '第一条', duration: 0 });
queued.instance.show({ key: 'second', title: '第二条', duration: 0 });
runNextTimer();
runNextTimer();
runNextTimer();
assert.strictEqual(queued.instance.data.currentKey, 'first');
assert.strictEqual(queued.instance.update('second', { theme: 'error', duration: 1200 }), true);
assert.strictEqual(queued.instance._queue[0].theme, 'error', 'queued updates must be normalized before activation');
assert.strictEqual(queued.instance.hide('second'), true, 'queued key can be removed without fake close');
assert.strictEqual(queued.events.length, 0);
assert.strictEqual(queued.instance.hide(), true);
assert.strictEqual(queued.instance.data.rendered, true, 'hide retains the node during leave');
runNextTimer();
assert.strictEqual(queued.instance.data.phase, 'leave-compact');
runNextTimer();
assert.strictEqual(queued.instance.data.rendered, false);
assert.strictEqual(queued.events[0].detail.reason, 'programmatic');

const action = create({ reduceMotion: true });
action.instance.show({ key: 'review', theme: 'warning', title: '需要确认', actionText: '查看', duration: 0 });
runNextTimer();
action.instance.onIslandTap();
action.instance.onActionTap();
assert.deepStrictEqual(action.events.map((event) => event.name), ['click', 'action']);
action.instance.onCloseTap();
runNextTimer();
assert.strictEqual(action.events[2].name, 'close');
assert.strictEqual(action.events[2].detail.reason, 'manual');
assert(action.instance.data.rootStyle.includes('1ms'));
assert.strictEqual(action.instance.data.topStyle, 'top:62px;');

const wxml = fs.readFileSync(path.join(root, 'dynamic-message/dynamic-message.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'dynamic-message/dynamic-message.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'dynamic-message/dynamic-message.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const previewSource = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const miniprogramPage = fs.readFileSync(path.join(root, 'miniprogram/pages/components/dynamic-message/index.wxml'), 'utf8');
const examplePage = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
['<pui-loading', '<pui-icon', '<pui-button', 'role="status"', 'bind:click="onActionTap"']
  .forEach((token) => assert(wxml.includes(token), `DynamicMessage WXML must retain ${token}`));
assert(!/<button\b|<input\b/.test(wxml));
assert(wxss.includes('pui-dynamic-message--phase-compact'));
assert(wxss.includes('pui-dynamic-message--phase-expanding'));
assert(wxss.includes('pui-dynamic-message--phase-collapsing'));
assert(wxss.includes('pui-dynamic-message--phase-leave-compact'));
assert(wxss.includes('--pui-dynamic-message-compact-width:360rpx'));
assert(wxss.includes('max-width var(--pui-dynamic-message-panel-duration)'));
assert(!wxss.includes('scale(.34,.52)'));
assert(!/transition:height/.test(wxss));
assert(!wxss.includes('height:auto'));
assert(!wxss.includes('display:none'));
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert.strictEqual(json.usingComponents['pui-loading'], '../loading/loading');
assert.deepStrictEqual(metadata.apiProps['dynamic-message'], PUBLIC_PROPS);
assert.deepStrictEqual(metadata.apiEvents['dynamic-message'].map((event) => event.name), ['click', 'action', 'close']);
assert.deepStrictEqual(metadata.apiMethods['dynamic-message'].map((method) => method.name), ['show(options)', 'update(key, patch)', 'hide(key?)']);
assert(fs.existsSync(path.join(root, 'docs/components/DYNAMIC-MESSAGE.md')));
['dynamicMessageShowcase', 'bindDynamicMessagePreviewRuntime', "demoAction: 'dynamic-show'", "demoAction: 'dynamic-queue'"]
  .forEach((token) => assert(previewSource.includes(token), `DynamicMessage H5 must retain ${token}`));
['event.composedPath()', 'event.stopImmediatePropagation()', "'dynamic-message': {"]
  .forEach((token) => assert(previewSource.includes(token), `DynamicMessage H5 runtime must retain ${token}`));
assert(previewSource.includes("duration: { type: 'range', value: 3000, min: 0, max: 60000, step: 100 }"));
['.pui-dynamic-message-preview', '.pui-dynamic-message-preview.is-phase-compact', '.pui-dynamic-message-preview.is-phase-expanding', '.pui-dynamic-message-preview.is-phase-collapsing', '.pui-dynamic-message-preview.is-phase-leave-compact']
  .forEach((token) => assert(previewStyles.includes(token), `DynamicMessage H5 styles must retain ${token}`));
['compactMotion = props.reduceMotion ? 1 : 180', 'panelMotion = props.reduceMotion ? 1 : 320', "setPhase('compact')", "setPhase('expanding')", "setPhase('collapsing')", "setPhase('leave-compact')"]
  .forEach((token) => assert(previewSource.includes(token), `DynamicMessage H5 staged motion must retain ${token}`));
assert(previewStyles.includes('border-radius: var(--pui-preview-radius-xlarge)'));
assert(previewStyles.includes('box-shadow: var(--shadow)'));
assert(previewStyles.includes('backdrop-filter: var(--blur)'));
assert(!previewStyles.includes('var(--radius-xl)'));
assert(!previewStyles.includes('var(--radius-round)'));
assert(!previewStyles.includes('var(--radius-large)'));
assert(miniprogramPage.includes('<pui-dynamic-message'));
assert(miniprogramPage.includes('bind:click="onQueueMessage"'));
assert(examplePage.includes('<pui-dynamic-message'));

[retained, queued, action].forEach(({ instance }) => definition.lifetimes.detached.call(instance));
console.log('DynamicMessage contract tests passed.');
