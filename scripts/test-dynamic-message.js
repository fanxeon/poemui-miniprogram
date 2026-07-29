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
    if (request === '../common/utils/platform-info') {
      return { getWindowInfo: () => ({ statusBarHeight: 24 }) };
    }
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
assert(source.includes("require('../common/utils/platform-info')"), 'DynamicMessage safe-area placement must reuse the shared platform reader');
assert(!source.includes('getSystemInfoSync'), 'DynamicMessage must not restore the deprecated aggregate system API');
const PUBLIC_PROPS = ['theme', 'title', 'message', 'icon', 'actionText', 'closable', 'duration', 'safeArea', 'shadow', 'frostedGlass', 'ariaLabel', 'reduceMotion'];
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
assert.strictEqual(retained.instance.data.edgeFlowActive, true, 'edge flow starts with panel expansion');
assert(retained.instance.data.rootStyle.includes('--pui-dynamic-message-edge-flow-duration:1500ms'), 'edge flow owns an independent 1500ms visual duration');
runNextTimer();
assert.strictEqual(retained.instance.data.phase, 'visible');
assert.strictEqual(retained.instance.data.edgeFlowActive, true, 'edge flow continues after the 320ms panel expansion instead of disappearing too quickly');
assert.strictEqual(retained.instance.data.currentDuration, 0, 'loading defaults to persistent');
assert.strictEqual(nextTimerDelay(), 1500, 'edge flow remains scheduled for its full independent duration');
assert.strictEqual(retained.instance.update('build', { theme: 'success', title: '构建完成', duration: 20 }), true);
assert.strictEqual(retained.instance.data.rendered, true, 'same key keeps the node mounted');
assert.strictEqual(retained.instance.data.currentTheme, 'success');
assert.strictEqual(retained.instance.data.currentIcon, 'success-circle', 'theme updates must not retain the previous default icon');
retained.instance.show({ key: 'build', message: '产物已经可用' });
assert.strictEqual(retained.instance.data.currentTheme, 'success', 'same-key show must patch the retained message instead of resetting it');
assert.strictEqual(retained.instance.data.currentMessage, '产物已经可用');
runNextTimer();
assert.strictEqual(retained.instance.data.phase, 'collapsing', 'timeout first collapses the full panel back into a compact capsule');
assert.strictEqual(retained.instance.data.edgeFlowActive, false, 'leaving clears any unfinished decorative edge flow');
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
assert.strictEqual(action.instance.data.edgeFlowActive, false, 'reduceMotion must never start edge flow');
assert.strictEqual(action.instance.data.topStyle, 'top:62px;');

const inheritedEffects = create();
assert(inheritedEffects.instance.data.rootClass.includes('pui-dynamic-message--shadow-inherit'));
assert(inheritedEffects.instance.data.rootClass.includes('pui-dynamic-message--frosted-inherit'));
const forcedEffects = create({ shadow: true, frostedGlass: true });
assert(forcedEffects.instance.data.rootClass.includes('pui-dynamic-message--shadow-on'));
assert(forcedEffects.instance.data.rootClass.includes('pui-dynamic-message--frosted-on'));
const disabledEffects = create({ shadow: false, frostedGlass: false });
assert(disabledEffects.instance.data.rootClass.includes('pui-dynamic-message--shadow-off'));
assert(disabledEffects.instance.data.rootClass.includes('pui-dynamic-message--frosted-off'));

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
assert(wxml.includes('class="pui-dynamic-message__edge-flow" aria-hidden="true"'), 'DynamicMessage must expose a decorative, hidden edge-flow layer');
assert(wxml.includes('class="pui-dynamic-message__edge-beam"'), 'DynamicMessage edge flow must use one continuous beam');
assert(!wxml.includes('pui-dynamic-message__accent'), 'DynamicMessage must remove the full-height vertical accent bar');
assert(wxss.includes('pui-dynamic-message--phase-compact'));
assert(wxss.includes('pui-dynamic-message--phase-expanding'));
assert(wxss.includes('pui-dynamic-message--phase-collapsing'));
assert(wxss.includes('pui-dynamic-message--phase-leave-compact'));
assert(wxss.includes('@keyframes pui-dynamic-message-edge-flow'), 'DynamicMessage must define a bounded edge-flow keyframe');
assert(wxss.includes('clip-path:polygon(0 0,100% 0,100% 100%,calc(100% - 6rpx) 100%,calc(100% - 6rpx) 6rpx,0 6rpx)'), 'DynamicMessage edge flow must expose only a 6rpx top-and-right track');
assert(wxss.includes('background-image:linear-gradient(135deg'), 'DynamicMessage edge flow must use one diagonal beam instead of staged full-edge colors');
assert(wxss.includes('background-size:240% 240%') && wxss.includes('background-position:0 0'), 'DynamicMessage beam must start at the top track on a movable background plane');
assert(wxss.includes('--pui-dynamic-message-accent:var(--pui-dynamic-message-secondary,#d4d4d8)'), 'loading edge flow must stay visible against the inverse island surface');
[
  ['info', 'var(--pui-color-info)'],
  ['success', 'var(--pui-color-success)'],
  ['warning', 'var(--pui-color-warning)'],
  ['error', 'var(--pui-color-danger)']
].forEach(([theme, color]) => {
  assert(
    wxss.includes(`.pui-dynamic-message--${theme}{--pui-dynamic-message-accent:${color}}`),
    `native ${theme} edge flow must consume its PUI semantic color`
  );
});
assert(wxml.includes("edgeFlowActive ? 'pui-dynamic-message--edge-flowing'"), 'DynamicMessage must decouple edge flow lifetime from the panel phase');
assert(wxss.includes('.pui-dynamic-message--edge-flowing .pui-dynamic-message__edge-beam{animation:'), 'the single beam must use the independent transient state');
assert(wxss.includes('var(--pui-dynamic-message-edge-flow-duration,1500ms)'), 'native edge flow must last 1500ms');
assert(!wxss.includes('.pui-dynamic-message--phase-visible .pui-dynamic-message__edge-flow'), 'settled visible state must not own a permanent colored border');
assert(wxss.includes('.pui-dynamic-message--reduced-motion .pui-dynamic-message__edge-flow{opacity:0}'), 'reduceMotion must hide the decorative track');
assert(wxss.includes('.pui-dynamic-message--reduced-motion .pui-dynamic-message__edge-beam{animation:none}'), 'reduceMotion must remove the decorative beam animation');
assert(wxss.includes('border-radius:inherit'), 'edge flow must follow the current compact or expanded semantic radius');
assert(!wxss.includes('border-left-color:var(--pui-dynamic-message-accent') && !wxss.includes('border-right-color:var(--pui-dynamic-message-accent'), 'edge flow must not fake movement by toggling whole border sides');
assert(wxss.includes('@keyframes pui-dynamic-message-edge-flow{0%{background-position:0 0;opacity:0}') && wxss.includes('100%{background-position:100% 100%;opacity:0}'), 'one beam must travel continuously from the top track around the top-right corner and down the right track');
assert(wxss.includes('-webkit-backdrop-filter:var(--pui-frosted-filter-soft)') && wxss.includes('backdrop-filter:var(--pui-frosted-filter-soft)'), 'inherited DynamicMessage frost must remain on the persistent Surface');
assert(wxss.includes('--pui-dynamic-message-frosted-filter-on:blur(18rpx) saturate(140%)'), 'local frostedGlass=true must consume a component semantic effect token');
assert(wxss.includes('.pui-dynamic-message--frosted-on{--pui-dynamic-message-bg:rgba(9,9,11,.78);'), 'local frostedGlass=true must force the inverse glass Surface');
assert(wxss.includes('.pui-dynamic-message--frosted-off{--pui-dynamic-message-bg:#09090b;'), 'local frostedGlass=false must restore the solid inverse Surface');
assert(wxss.includes('--pui-dynamic-message-shadow-on:0 12rpx 32rpx rgba(0,0,0,.32)') && wxss.includes('.pui-dynamic-message--shadow-on{box-shadow:var(--pui-dynamic-message-shadow-on)}'), 'local shadow=true must force the component semantic floating elevation');
assert(wxss.includes('.pui-dynamic-message--shadow-off{box-shadow:none}'), 'local shadow=false must remove only the Surface shadow');
assert(!wxss.includes('.pui-dynamic-message--edge-flowing{background:') && !wxss.includes('.pui-dynamic-message--edge-flowing{backdrop-filter:'), 'edge flow lifetime must never replace the Surface background or frost');
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
assert(previewSource.includes('<i class="pui-dynamic-message-preview__edge-flow" aria-hidden="true"><i class="pui-dynamic-message-preview__edge-beam"></i></i>'), 'H5 mirror must compose the same single-beam edge-flow layer');
assert(!previewSource.includes('pui-dynamic-message-preview__accent'), 'H5 mirror must remove the old vertical accent element');
assert(previewSource.includes("${props.reduceMotion ? 'is-reduced-motion' : ''}"), 'H5 mirror must expose component-level reduced-motion state');
assert(previewStyles.includes('@keyframes pui-dynamic-message-edge-flow'), 'H5 mirror must define the same bounded edge-flow keyframe');
assert(previewStyles.includes('clip-path: polygon(0 0, 100% 0, 100% 100%, calc(100% - 3px) 100%, calc(100% - 3px) 3px, 0 3px)'), 'H5 edge flow must mirror the 3px top-and-right track');
assert(previewStyles.includes('.pui-dynamic-message-preview__edge-beam') && previewStyles.includes('background-image: linear-gradient(135deg'), 'H5 edge flow must mirror the single diagonal beam');
assert(previewStyles.includes('.pui-dynamic-message-preview.is-loading { --pui-dynamic-message-accent: #d4d4d8; }'), 'H5 loading edge flow must remain visible on the inverse surface');
[
  ['info', 'var(--info)'],
  ['success', 'var(--success)'],
  ['warning', 'var(--warning)'],
  ['error', 'var(--danger)']
].forEach(([theme, color]) => {
  assert(
    previewStyles.includes(`.pui-dynamic-message-preview.is-${theme} { --pui-dynamic-message-accent: ${color}; }`),
    `H5 ${theme} edge flow must mirror its semantic color`
  );
});
assert(previewSource.includes('const edgeFlowMotion = props.reduceMotion ? 1 : 1500'), 'H5 runtime must own the same independent 1500ms edge-flow duration');
assert(previewSource.includes("root.classList.add('is-edge-flowing')"), 'H5 runtime must explicitly start the transient edge-flow state');
assert(previewSource.includes("root.classList.remove('is-edge-flowing')"), 'H5 runtime must clear the transient edge-flow state');
assert(previewSource.includes("if (demo.dynamicCurrent) {\n    paint(demo.dynamicCurrent);\n    setPhase('visible');\n    schedule();\n  }"), 'H5 runtime must restore a retained current message after the overview DOM is rebuilt');
assert(previewSource.includes("compatId === 'dynamic-message'") && previewSource.includes('shadow 与 frostedGlass 是组件私有三态覆盖'), 'H5 compatibility copy must describe the real local Surface API');
assert(previewStyles.includes('.pui-dynamic-message-preview.is-edge-flowing .pui-dynamic-message-preview__edge-beam'), 'H5 beam must use its independent transient class');
assert(previewStyles.includes('var(--pui-dynamic-message-edge-flow-duration, 1500ms)'), 'H5 edge flow must last 1500ms');
assert(!previewStyles.includes('.pui-dynamic-message-preview.is-phase-visible .pui-dynamic-message-preview__edge-flow'), 'settled H5 visible state must not own a permanent colored border');
assert(previewStyles.includes('.pui-dynamic-message-preview.is-reduced-motion .pui-dynamic-message-preview__edge-flow'), 'H5 reduceMotion Prop must remove the decorative edge flow');
assert(previewStyles.includes('.pui-dynamic-message-preview__edge-beam { animation: none !important; }'), 'H5 system reduced-motion must remove the decorative beam');
assert(previewSource.includes("props.shadow === true ? 'is-shadow-on'") && previewSource.includes("props.frostedGlass === true ? 'is-frosted-on'"), 'H5 runtime must expose local Surface effect overrides');
assert(previewStyles.includes('.pui-dynamic-message-preview.is-frosted-on') && previewStyles.includes('.pui-dynamic-message-preview.is-frosted-off'), 'H5 must mirror local frosted Surface on/off');
assert(previewStyles.includes('body .app-shell[data-page-mode][data-shadow="off"] .preview-stage .pui-dynamic-message-preview.is-shadow-on') && previewStyles.includes('box-shadow: var(--pui-dynamic-message-shadow-on) !important;') && previewStyles.includes('.pui-dynamic-message-preview.is-shadow-off'), 'H5 local shadow=true must override the site-level shadow-off reset without changing other components');
['compactMotion = props.reduceMotion ? 1 : 180', 'panelMotion = props.reduceMotion ? 1 : 320', 'edgeFlowMotion = props.reduceMotion ? 1 : 1500', "setPhase('compact')", "setPhase('expanding')", "setPhase('collapsing')", "setPhase('leave-compact')"]
  .forEach((token) => assert(previewSource.includes(token), `DynamicMessage H5 staged motion must retain ${token}`));
assert(previewStyles.includes('border-radius: var(--pui-preview-radius-xlarge)'));
assert(previewStyles.includes('box-shadow: var(--shadow)'));
assert(previewStyles.includes('backdrop-filter: var(--blur)'));
assert(!previewStyles.includes('var(--radius-xl)'));
assert(!previewStyles.includes('var(--radius-round)'));
assert(!previewStyles.includes('var(--radius-large)'));
assert(miniprogramPage.includes('<pui-dynamic-message'));
assert(miniprogramPage.includes('bind:click="onQueueMessage"'));
assert(miniprogramPage.includes('shadow="{{messageShadow}}"') && miniprogramPage.includes('frosted-glass="{{messageFrostedGlass}}"'), 'DynamicMessage independent page must expose its local Surface switches');
assert(examplePage.includes('<pui-dynamic-message'));

[retained, queued, action].forEach(({ instance }) => definition.lifetimes.detached.call(instance));
console.log('DynamicMessage contract tests passed.');
