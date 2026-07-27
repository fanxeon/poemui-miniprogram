const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'notice-bar/notice-bar.js'), 'utf8');
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
  const queue = Array.from(timers.entries()).sort((left, right) => left[1].delay - right[1].delay || left[1].order - right[1].order);
  if (!queue.length) return false;
  const [id, timer] = queue[0];
  timers.delete(id);
  timer.callback();
  return true;
}

const sandbox = {
  console,
  isFinite,
  setTimeout: setTimer,
  clearTimeout: clearTimer,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'notice-bar/notice-bar.js' });
assert(definition, 'NoticeBar component definition must be registered');

function create(overrides, rectWidths) {
  timers = new Map();
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const widths = rectWidths || [100, 160];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
    createSelectorQuery() {
      const query = {
        select() { return query; },
        boundingClientRect() { return query; },
        exec(callback) { callback([{ width: widths[0] }, { width: widths[1] }]); },
      };
      return query;
    },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

assert.strictEqual(Object.keys(definition.properties).length, 12, 'NoticeBar only publishes the TDesign-aligned 12 Props');
assert.deepStrictEqual(Object.keys(definition.properties), ['content', 'direction', 'interval', 'marquee', 'operation', 'prefixIcon', 'suffixIcon', 'theme', 'visible', 'defaultVisible', 'ariaLabel', 'reduceMotion']);
assert.strictEqual(typeof definition.methods.open, 'undefined', 'NoticeBar has no public instance methods');

const hidden = create({ defaultVisible: false });
assert.strictEqual(hidden.instance.data.rendered, false);
assert.strictEqual(hidden.instance.data.rootRole, 'status');
assert.strictEqual(hidden.instance.data.prefixIconName, 'info-circle');
assert(hidden.instance.data.rootStyle.includes('--pui-notice-duration:500ms'));

const visible = create({ defaultVisible: true, content: ['第一条', '第二条'], direction: 'vertical', theme: 'error' });
assert.strictEqual(visible.instance.data.rendered, true);
assert.strictEqual(visible.instance.data.innerVisible, false);
runNextTimer();
assert.strictEqual(visible.instance.data.innerVisible, true);
assert.strictEqual(visible.instance.data.isVertical, true);
assert.strictEqual(visible.instance.data.swiperInterval, 2000);
assert.deepStrictEqual(JSON.parse(JSON.stringify(visible.instance.data.verticalItems)), ['第一条', '第二条']);
assert.strictEqual(visible.instance.data.rootRole, 'alert');
assert.strictEqual(visible.instance.data.ariaLive, 'assertive');
visible.instance.onVerticalChange({ detail: { current: 1 } });
visible.instance.onClick({ currentTarget: { dataset: { trigger: 'suffix-icon' } } });
assert.deepStrictEqual(JSON.parse(JSON.stringify(visible.events)), [
  { name: 'change', detail: { current: 1, source: 'swiper' } },
  { name: 'click', detail: { trigger: 'suffix-icon' } },
]);

const controlled = create({ visible: true, reduceMotion: false });
runNextTimer();
assert.strictEqual(controlled.instance.data.innerVisible, true);
controlled.instance.data.visible = false;
definition.observers.visible.call(controlled.instance);
assert.strictEqual(controlled.instance.data.rendered, true, 'controlled false enters a real leaving phase');
assert.strictEqual(controlled.instance.data.innerVisible, false);
assert.strictEqual(runNextTimer(), true);
assert.strictEqual(controlled.instance.data.rendered, false, 'only the completed 500ms leave unmounts NoticeBar');
assert.strictEqual(controlled.events.length, 0, 'visibility lifecycle is not a public event');

const reduced = create({ defaultVisible: true, marquee: { speed: 50, loop: -1, delay: 0 }, reduceMotion: true });
runNextTimer();
assert.strictEqual(reduced.instance.data.innerVisible, true);
assert.strictEqual(timers.size, 0, 'reduceMotion stops marquee measurement and loop');
assert(reduced.instance.data.rootStyle.includes('--pui-notice-duration:1ms'));

const marquee = create({ defaultVisible: true, marquee: { speed: 50, loop: 1, delay: 0 } }, [100, 160]);
runNextTimer();
assert.strictEqual(runNextTimer(), true, 'visible horizontal NoticeBar measures actual overflow');
assert.strictEqual(marquee.instance._marqueeDistance, 60);
assert.strictEqual(runNextTimer(), true, 'overflow starts a measured marquee segment');
assert.strictEqual(marquee.instance._marqueeOffset, 12);
assert(marquee.instance.data.marqueeStyle.includes('translate3d(-12px'));
assert(marquee.instance.data.marqueeStyle.includes('500ms'));

const boundary = create({ defaultVisible: false, prefixIcon: { name: 'bell' }, suffixIcon: false, marquee: { speed: 999, loop: -3, delay: -1 }, ariaLabel: '紧急公告' });
assert.strictEqual(boundary.instance.data.prefixIconName, 'bell');
assert.strictEqual(boundary.instance.data.suffixIconName, '');
assert.strictEqual(boundary.instance.data.semanticLabel, '紧急公告');
assert.strictEqual(boundary.instance.data.swiperInterval, 2000);

const wxml = fs.readFileSync(path.join(root, 'notice-bar/notice-bar.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'notice-bar/notice-bar.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'notice-bar/notice-bar.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/NOTICEBAR.md'), 'utf8');
const metadata = fs.readFileSync(path.join(root, 'metadata/components.js'), 'utf8');
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const generator = fs.readFileSync(path.join(root, 'scripts/generate-components.js'), 'utf8');
const example = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const noticeExample = example.slice(example.indexOf('<pui-card title="NoticeBar'), example.indexOf('<pui-card title="Result'));

assert(wxml.includes('wx:if="{{rendered}}"'));
assert(wxml.includes('<swiper class="pui-notice-bar__swiper"'));
assert(wxml.includes('<slot name="prefix-icon">'));
assert(wxml.includes('<slot name="content">'));
assert(wxml.includes('<slot name="operation">'));
assert(wxml.includes('<slot name="suffix-icon">'));
assert(!/<button\b|<input\b|<image\b/.test(wxml), 'NoticeBar contains no raw replacement controls');
assert(!wxml.includes('slot=""'), 'NoticeBar has no default slot');
assert(!wxml.includes('bind:click="onClick"'), 'One wrapper tap path prevents duplicate PUI Button click events');
assert(wxss.includes('max-height var(--pui-notice-duration'));
assert(wxss.includes('transition-property: transform'));
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert.strictEqual(json.usingComponents['pui-icon'], undefined);
assert(preview.includes("if (runtimeId === 'notice-bar')"));
assert(preview.includes('return noticePreviewIsReduced(props) ? 1 : 500;'), 'H5 NoticeBar keeps the source 500ms/1ms motion contract');
assert(preview.includes('function bindNoticePreviewRuntime(props)'));
assert(preview.includes("if (id === 'notice-bar') {\n    bindNoticePreviewRuntime(props);\n    return;\n  }"), 'NoticeBar lifecycle is connected to the shared preview runtime');
assert(preview.includes('updateNoticePreviewDom(props, demo);\n    scheduleNoticePreviewVertical(props, demo);'), 'vertical tick updates the retained NoticeBar node before scheduling the next item');
assert(preview.includes('noticePreviewMarquee'));
assert(preview.includes('noticeVerticalNextAt'));
assert(preview.includes("setPropControlValidity(control, '请输入合法 JSON')"));
assert(preview.includes('查看下一条纵向公告'));
assert(!preview.includes('bind:marqueestart="onNoticeMarqueeStart"'));
assert(!preview.includes('notice-operation'));
assert(previewStyles.includes('.pui-notice-showcase__stack'));
assert(previewStyles.includes('.pui-notice-showcase > .pui-showcase-section { min-width: 0; max-width: 100%; }'));
assert(previewStyles.includes('.pui-notice-preview { box-sizing: border-box; display: flex; width: 100%; max-width: 100%;'));
assert(previewStyles.includes('.pui-notice-preview__text { display: inline-flex; width: max-content; min-width: 100%; flex: none;'));
assert(!previewStyles.includes('.pui-notice-preview__event'));
assert(api.includes('`prefix-icon`、`content`、`operation`、`suffix-icon`'));
assert(api.includes('没有默认 Slot 和实例方法'));
assert(compatibility.includes('vertical 必须镜像 content 数组的真实 swiper 条目'));
assert(contract.includes('禁止恢复 `icon/showIcon/customIcon/closable'));
assert(metadata.includes("'notice-bar': ['content', 'direction', 'interval', 'marquee'"));
assert(shadcn.includes("['Notice Bar', 'notice-bar', 'adapter', 'tap'"));
assert(generator.includes("  'notice-bar',"), 'experimental generator protects NoticeBar');
assert(noticeExample.includes('direction="vertical" content="{{noticeItems}}"'));
assert(noticeExample.includes('bind:click="onNoticeClick"'));
assert(!noticeExample.includes('custom-content'));
assert(!noticeExample.includes('bind:marqueestart'));

console.log('NoticeBar contract tests passed.');
