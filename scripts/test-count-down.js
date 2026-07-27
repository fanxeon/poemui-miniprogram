const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('count-down/count-down.js');
let definition = null;
let now = 100000;
let nextTimerId = 1;
let timers = new Map();

function setTimer(callback, delay) {
  const id = nextTimerId++;
  timers.set(id, { callback, delay });
  return id;
}

vm.runInNewContext(source, {
  console,
  isFinite,
  Date: { now: () => now },
  setTimeout: setTimer,
  clearTimeout: (id) => timers.delete(id),
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: 'count-down/count-down.js' });

assert(definition, 'CountDown component definition must be registered');
assert.deepStrictEqual(
  Object.keys(definition.properties),
  ['time', 'autoStart', 'paused', 'content', 'format', 'millisecond', 'size', 'theme', 'splitWithUnit', 'ariaLabel', 'reduceMotion'],
  'CountDown publishes the focused 11-Prop clock contract',
);
['finishText', 'customContent', 'pauseOnHidden', 'duration', 'easing'].forEach((legacy) => {
  assert(!Object.prototype.hasOwnProperty.call(definition.properties, legacy), `CountDown removes legacy ${legacy}`);
});

function create(overrides) {
  timers = new Map();
  now = 100000;
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, definition.methods);
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const defaults = create();
assert.strictEqual(defaults.instance.data.remaining, 0);
assert.strictEqual(defaults.instance.data.status, 'finished');
assert.strictEqual(defaults.events.length, 0, 'time=0 initialization does not fake finish');

const clock = create({ time: 2500, autoStart: false });
assert.strictEqual(clock.instance.data.status, 'idle');
assert.strictEqual(clock.instance.data.formatted, '00:00:03', 'non-millisecond display rounds upward');
assert.strictEqual(clock.instance.start(), true);
assert.strictEqual(clock.instance.start(), false, 'running start is a no-op');
assert.strictEqual(clock.events.length, 0, 'start is a method, not a public lifecycle event');
now += 550;
clock.instance.tick();
assert.strictEqual(clock.events.at(-1).name, 'change');
assert.strictEqual(clock.events.at(-1).detail.time, 1950);
assert.strictEqual(clock.events.at(-1).detail.formatted, '00:00:02');
assert.strictEqual(clock.events.at(-1).detail.totalSeconds, 1);
now += 200;
assert.strictEqual(clock.instance.pause(), true);
assert.strictEqual(clock.instance.data.remaining, 1750);
assert.strictEqual(clock.events.at(-1).name, 'change');
assert.strictEqual(clock.instance.data.status, 'paused');
assert.strictEqual(clock.instance.pause(), false, 'idle pause is a no-op');
assert.strictEqual(clock.instance.getTime(), 1750);
assert.strictEqual(clock.instance.start(), true);
now += 1750;
clock.instance.tick();
assert.deepStrictEqual(clock.events.slice(-2).map((event) => event.name), ['change', 'finish']);
assert.strictEqual(clock.events.at(-1).detail.time, 0);
const finishCount = clock.events.filter((event) => event.name === 'finish').length;
clock.instance.tick();
assert.strictEqual(clock.events.filter((event) => event.name === 'finish').length, finishCount, 'finish emits once');
assert.strictEqual(clock.instance.start(), false, 'finished clock cannot restart without reset');
assert.strictEqual(clock.instance.reset(), 2500);
assert.strictEqual(clock.events.at(-1).name, 'change');
assert.strictEqual(clock.instance.data.running, false, 'autoStart=false reset remains idle');

const controlled = create({ time: 4000, autoStart: true, paused: true });
assert.strictEqual(controlled.instance.data.running, false);
assert.strictEqual(controlled.instance._pausedByProperty, true);
controlled.instance.data.paused = false;
definition.observers.paused.call(controlled.instance, false);
assert.strictEqual(controlled.instance.data.running, true, 'clearing initial paused resumes auto-start policy');
controlled.instance.data.paused = true;
definition.observers.paused.call(controlled.instance, true);
assert.strictEqual(controlled.instance.data.running, false);
assert.strictEqual(controlled.events.length, 0, 'same-millisecond declarative pause does not fake change');

const display = create({ time: 90061001, autoStart: false, format: 'DD:HH:mm:ss.SSS', millisecond: true, splitWithUnit: true, theme: 'round', size: 'large' });
assert.strictEqual(display.instance.data.formatted, '01天:01时:01分:01秒.001毫秒');
assert(display.instance.data.rootClass.includes('pui-count-down--round'));
assert(display.instance.data.rootClass.includes('pui-count-down--large'));
const fallback = create({ time: 1000, autoStart: false, theme: 'danger', size: 'tiny', content: 'custom' });
assert(fallback.instance.data.rootClass.includes('pui-count-down--default'));
assert(fallback.instance.data.rootClass.includes('pui-count-down--medium'));
assert.strictEqual(fallback.instance.data.contentMode, 'default');
assert.strictEqual(create({ time: 1000, autoStart: false, content: 'slot' }).instance.data.contentMode, 'slot');
assert.strictEqual(create({ time: 1000, autoStart: false, reduceMotion: true }).instance.data.rootStyle, '--pui-count-down-duration:1ms;');

const wxml = read('count-down/count-down.wxml');
const wxss = read('count-down/count-down.wxss');
assert(wxml.includes('contentMode === \'slot\''));
assert.strictEqual((wxml.match(/<slot/g) || []).length, 1);
assert(!wxml.includes('slot name='));
assert(!wxml.includes('finishText'));
assert(wxss.includes('.pui-count-down--round .pui-count-down__part--numeric'));
assert(wxss.includes('.pui-count-down--square .pui-count-down__part--numeric'));
assert(wxss.includes('var(--pui-count-down-duration)'));
assert(wxss.includes('.pui-count-down__part--numeric .pui-count-down__unit { flex: 0 0 auto; white-space: nowrap; }'), 'CountDown native units keep time labels intact');
assert(!/\b(?:1[1-9]\d\d|[2-9]\d{3,})ms\b/.test(wxss), 'CountDown source animation never exceeds 1000ms');

const metadata = require(path.join(root, 'metadata/components.js'));
assert.deepStrictEqual(metadata.apiProps['count-down'], Object.keys(definition.properties));
assert.deepStrictEqual(metadata.apiEvents['count-down'].map((item) => item.name), ['change', 'finish']);
assert.deepStrictEqual(metadata.apiSlots['count-down'].map((item) => item.name), ['default']);
assert.deepStrictEqual(metadata.apiMethods['count-down'].map((item) => item.name), ['start()', 'pause()', 'reset()', 'getTime()']);
assert.deepStrictEqual(metadata.apiPropGroups['count-down'].flatMap((item) => item.keys), metadata.apiProps['count-down']);

const preview = read('preview/app.js');
['基础用法', '主题与尺寸', '单位与毫秒', '控制与自定义内容'].forEach((title) => assert(preview.includes(title)));
const usage = preview.slice(preview.indexOf("if (runtimeId === 'count-down')"), preview.indexOf("if (runtimeId === 'tabs')"));
['bind:start', 'bind:pause', 'bind:reset', 'bind:finish', 'bind:change', 'restart()', 'getRemaining()'].forEach((legacy) => assert(!usage.includes(legacy), `basic WXML excludes ${legacy}`));
assert(usage.includes('<pui-count-down${countDownAttrs ? ` ${countDownAttrs}` : \'\'} />'));
assert(preview.includes('const countDownSourceDefaults = Object.freeze({ time: 0'));
assert(usage.includes('countDownSourceDefaults'));
assert(preview.includes("['badge', 'avatar', 'image', 'tag', 'grid', 'count-down'].includes(runtimeId)"));
assert(preview.includes("previewId === 'count-down'"));
assert(preview.includes('state.props[state.current] = { ...countDownSourceDefaults };'));
assert(preview.includes('apiMethodsByComponent'));
assert(preview.includes('api-table api-table--methods'));
assert(read('preview/styles.css').includes('.pui-count-down-showcase__examples'));
assert(read('preview/styles.css').includes('.pui-count-down-preview__part--numeric small { flex: 0 0 auto; white-space: nowrap; }'), 'CountDown H5 unit labels keep time labels intact');

const exampleWxml = read('_example/miniprogram/pages/components/index.wxml');
const exampleJs = read('_example/miniprogram/pages/components/index.js');
assert(exampleWxml.includes('bind:change="onCountDownChange"'));
assert(exampleWxml.includes('bind:finish="onCountDownFinish"'));
assert(!exampleWxml.includes('bind:start="onCountDownStart"'));
assert(!exampleWxml.includes('bind:pause="onCountDownPause"'));
assert(!exampleWxml.includes('bind:reset="onCountDownReset"'));
assert(!exampleJs.includes('restartCountDown'));
assert(exampleJs.includes('countDown.getTime()'));

assert(read('docs/components/COUNTDOWN.md').includes('TDesign 1.15.3 对照决定'));
assert(read('docs/components/README.md').includes('[CountDown](./COUNTDOWN.md)'));
assert(/\d+\. CountDown 的 H5 镜像/.test(read('docs/H5_PREVIEW_COMPATIBILITY.md')));

process.stdout.write('CountDown contract tests passed.\n');
