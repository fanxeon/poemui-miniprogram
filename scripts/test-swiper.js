const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'swiper/swiper.js'), 'utf8');
let definition = null;
let nextTimerId = 1;
const timers = new Map();
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
  setTimeout: (callback) => { const id = nextTimerId++; timers.set(id, callback); return id; },
  clearTimeout: (id) => timers.delete(id),
};
vm.runInNewContext(source, sandbox, { filename: 'swiper/swiper.js' });
assert(definition, 'Swiper component definition must be registered');

const PROPS = [
  'items', 'value', 'defaultValue', 'height', 'circular', 'autoplay', 'interval', 'duration', 'easingFunction', 'direction',
  'previousMargin', 'nextMargin', 'displayMultipleItems', 'disableTouch', 'navigation', 'imageMode', 'customItem', 'disabled',
  'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion',
];
const EVENTS = ['click', 'input', 'change', 'animationfinish', 'image-load', 'image-error', 'retry'];
const METHODS = ['select(value)', 'next()', 'prev()', 'reset()', 'retry()', 'getValue()', 'getState()'];
assert.deepStrictEqual(Object.keys(definition.properties), PROPS, 'Swiper publishes the exact 26-Prop contract');
assert(!source.includes('selectIndex: function'), 'selectIndex method must stay removed');

const ITEMS = [
  { title: '数字零', value: 0, icon: 'component', tag: 'Native' },
  { title: '布尔值', value: false, description: '保留 false 原始值', theme: 'success' },
  { title: '空字符串', value: '', image: '/assets/states.png' },
];

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const defaults = create();
assert.strictEqual(defaults.instance.data.stateType, 'empty');
assert.strictEqual(defaults.instance.data.resolvedHeight, 360);
assert.strictEqual(defaults.instance.data.resolvedDuration, 500);
assert.strictEqual(defaults.instance.data.semanticLabel, '轮播图');
assert.strictEqual(defaults.instance.data.navigationVisible, false, 'navigation obeys minShowNum');

const scalars = create({ items: [0, false, '', '0'] });
assert.deepStrictEqual(scalars.instance.data.normalizedItems.map((item) => item.value), [0, false, '', '0']);
assert.deepStrictEqual(scalars.instance.data.normalizedItems.map((item) => item.title), ['0', 'false', '3', '0']);

const uncontrolled = create({ items: ITEMS, defaultValue: 0 });
assert.strictEqual(uncontrolled.instance.data.currentValue, 0);
assert.strictEqual(uncontrolled.instance.next(), true);
assert.strictEqual(uncontrolled.instance.data.currentValue, false);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['input', 'change']);
assert.strictEqual(uncontrolled.events[0].detail.previousValue, 0);
assert.strictEqual(uncontrolled.events[0].detail.value, false);
assert.strictEqual(uncontrolled.events[0].detail.source, 'method-next');
assert.strictEqual(uncontrolled.instance.next(), true);
assert.strictEqual(uncontrolled.instance.data.currentValue, '');
assert.strictEqual(uncontrolled.instance.next(), true);
assert.strictEqual(uncontrolled.instance.data.currentValue, 0, 'circular next wraps');
assert.strictEqual(uncontrolled.instance.prev(), true);
assert.strictEqual(uncontrolled.instance.data.currentValue, '');
assert.strictEqual(uncontrolled.instance.select(false), true);
assert.strictEqual(uncontrolled.instance.getValue(), false);
assert.strictEqual(uncontrolled.instance.select('missing'), false);
assert.strictEqual(uncontrolled.instance.reset(), true);
assert.strictEqual(uncontrolled.instance.getValue(), 0);
assert.deepStrictEqual(JSON.parse(JSON.stringify(uncontrolled.instance.getState())), {
  value: 0, index: 0, controlled: false, count: 3, state: 'content', autoplay: false, disabled: false, direction: 'horizontal', reduceMotion: false,
});

const controlled = create({ items: ITEMS, value: false, defaultValue: 0 });
assert.strictEqual(controlled.instance.next(), true);
assert.strictEqual(controlled.instance.data.currentValue, false, 'controlled methods wait for parent write-back');
assert.strictEqual(controlled.events[0].detail.value, '');
assert.strictEqual(controlled.events[0].detail.controlled, true);
controlled.instance.data.value = '';
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.currentValue, '');
controlled.instance.data.value = null;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.currentValue, '', 'leaving control preserves the latest controlled value');

const swipe = create({ items: ITEMS, defaultValue: 0 });
swipe.instance.onSwiperChange({ detail: { current: 1, source: 'touch' } });
assert.strictEqual(swipe.instance.data.currentValue, false);
assert.strictEqual(swipe.events[0].detail.source, 'swipe');
swipe.instance.onAnimationFinish({ detail: { source: 'touch' } });
assert.strictEqual(swipe.events.at(-1).name, 'animationfinish');

const boundaries = create({
  items: ITEMS, height: 9999, interval: 10, duration: 900, direction: 'vertical', previousMargin: -20, nextMargin: 999,
  displayMultipleItems: 8, easingFunction: 'spring', navigation: { type: 'fraction', position: 'outside', showControls: true, minShowNum: 1 },
});
assert.strictEqual(boundaries.instance.data.resolvedHeight, 1200);
assert.strictEqual(boundaries.instance.data.resolvedInterval, 1000);
assert.strictEqual(boundaries.instance.data.resolvedDuration, 900);
assert.strictEqual(boundaries.instance.data.resolvedPreviousMargin, '0rpx');
assert.strictEqual(boundaries.instance.data.resolvedNextMargin, '240rpx');
assert.strictEqual(boundaries.instance.data.resolvedDisplayMultipleItems, 3);
assert.strictEqual(boundaries.instance.data.resolvedEasingFunction, 'default');
assert.strictEqual(boundaries.instance.data.resolvedVertical, true);
assert.strictEqual(boundaries.instance.data.navigationType, 'fraction');
assert.strictEqual(boundaries.instance.data.navigationPosition, 'outside');
assert.strictEqual(boundaries.instance.data.navigationShowControls, true);

const cappedDuration = create({ items: ITEMS, duration: 1600 });
assert.strictEqual(cappedDuration.instance.data.resolvedDuration, 1000);

const autoplay = create({ items: ITEMS, autoplay: true });
assert.strictEqual(autoplay.instance.data.resolvedAutoplay, true);
autoplay.instance.onTouchStart();
assert.strictEqual(autoplay.instance.data.resolvedAutoplay, false);
autoplay.instance.onTouchEnd();
assert.strictEqual(autoplay.instance.data.resolvedAutoplay, true);
autoplay.instance.data.reduceMotion = true;
autoplay.instance.syncState();
assert.strictEqual(autoplay.instance.data.resolvedDuration, 1);
assert.strictEqual(autoplay.instance.data.resolvedAutoplay, false, 'reduceMotion disables autoplay');

const states = create({ items: ITEMS, loading: true, error: true });
assert.strictEqual(states.instance.data.stateType, 'error', 'error wins over loading/content/empty');
assert.strictEqual(states.instance.retry(), false, 'loading locks retry even when error has priority');
states.instance.data.loading = false;
states.instance.syncState();
assert.strictEqual(states.instance.retry(), true);
assert.strictEqual(states.events[0].name, 'retry');
const disabled = create({ items: ITEMS, disabled: true, autoplay: true });
assert.strictEqual(disabled.instance.next(), false);
assert.strictEqual(disabled.instance.data.resolvedAutoplay, false);
assert.strictEqual(disabled.events.length, 0);
const touchOnly = create({ items: ITEMS, disableTouch: true });
assert.strictEqual(touchOnly.instance.data.resolvedDisableTouch, true);
assert.strictEqual(touchOnly.instance.next(), true, 'disableTouch keeps controls and methods usable');

const itemEvent = create({ items: ITEMS });
itemEvent.instance.onItemTap({ currentTarget: { dataset: { index: 0 } } });
assert.strictEqual(itemEvent.events[0].name, 'click');
assert.strictEqual(itemEvent.events[0].detail.value, 0);
itemEvent.instance.onImageLoad({ currentTarget: { dataset: { index: 0 } }, detail: { width: 320, height: 180 } });
itemEvent.instance.onImageError({ currentTarget: { dataset: { index: 1 } }, detail: { errMsg: 'failed' } });
assert.deepStrictEqual(itemEvent.events.slice(-2).map((event) => event.name), ['image-load', 'image-error']);

const wxml = fs.readFileSync(path.join(root, 'swiper/swiper.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'swiper/swiper.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'swiper/swiper.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/SWIPER.md'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert.strictEqual(
  (wxml.match(/wx:if="{{navigationType !== 'fraction'}}"/g) || []).length,
  2,
  'inside/outside navigation must use explicit non-fraction WXML branches',
);
assert(
  !/<block wx:if="{{navigationType === 'fraction'}}">[\s\S]*?<\/block>\s*<view\s+wx:else[\s\S]*?wx:for="{{normalizedItems}}"/.test(wxml),
  'WXML upload compiler must not receive wx:else on a wx:for view after a fraction block',
);

assert(wxml.includes('<swiper'));
assert(wxml.includes('easing-function="{{resolvedEasingFunction}}"'));
assert(wxml.includes('bindanimationfinish="onAnimationFinish"'));
assert(!wxml.includes('bindtransition='));
assert(wxml.includes('<swiper-slide'));
assert(wxml.includes('<pui-image'));
assert(wxml.includes('<pui-tag'));
assert(wxml.includes('<pui-loading'));
assert(wxml.includes('<pui-empty'));
assert(wxml.includes('<pui-button'));
assert(!/<slot\b/.test(wxml), 'Swiper publishes no Slots');
const imageMarkup = wxml.slice(wxml.indexOf('<pui-image'), wxml.indexOf('/>', wxml.indexOf('<pui-image')) + 2);
assert(!/clickable=|duration=|easing=/.test(imageMarkup), 'Swiper only forwards current Image Props');
assert(!/skip-hidden-item-layout|pause-on-touch|indicator-dots|show-arrows|show-counter/.test(wxml));
assert(!/<button\b|scroll-view/.test(wxml), 'native Swiper uses swiper and PoemUI controls');
assert(!/:empty/.test(wxss));
assert(!/scroll-snap/.test(wxss));
assert(!/\b(?:1[1-9]\d\d|[2-9]\d{3,})ms\b/.test(wxss));
assert.strictEqual(json.componentGenerics['swiper-slide'].default, '../card/card');
assert.strictEqual(json.usingComponents['pui-image'], '../image/image');
assert.deepStrictEqual(metadata.apiProps.swiper, PROPS);
assert.deepStrictEqual(metadata.apiEvents.swiper.map((item) => item.name), EVENTS);
assert.strictEqual((metadata.apiSlots.swiper || []).length, 0);
assert.deepStrictEqual(metadata.apiMethods.swiper.map((item) => item.name), METHODS);
assert(shadcn.includes('26 Props'));

const previewStart = preview.indexOf('function swiperPreviewItems(props)');
const previewEnd = preview.indexOf('function navigationMenuH5Field(', previewStart);
const previewSource = preview.slice(previewStart, previewEnd);
assert(previewStart >= 0 && !/scroll-snap/.test(previewSource));
for (const title of ['基础用法', '自动播放与导航', '方向与多项', '加载、空与错误']) assert(previewSource.includes(`<h3>${title}</h3>`));
for (const removed of ['props.itemKey', 'props.titleKey', 'props.vertical', 'props.pauseOnTouch', 'props.indicatorDots', 'props.showArrows', 'props.customHeader', 'props.readonly', 'swiper-method-select']) assert(!previewSource.includes(removed), `H5 must not retain ${removed}`);
assert(previewSource.includes("iconButtonSample({ icon: snapshot.vertical"), 'Swiper arrows must reuse the shared IconButton mirror');
assert(previewSource.includes('demo.swiperImageReports[reportKey]'), 'cached image reports must be deduplicated across H5 rerenders');
assert(preview.includes('"swiper-card": "poemui-miniprogram/card/card"'), 'customItem copied code must register its Generic component alias');
assert(previewSource.includes("loadingComponent({ size: 'medium'"));
assert(previewSource.includes('emptySample({ embedded: true'));
assert(!previewSource.includes('data-swiper-status'), 'Overview must not render engineering event or state diagnostics');
assert(!previewSource.includes('swiper-method-'), 'Instance methods belong to API, not the overview demo');
assert(previewSource.includes('function updateSwiperPreviewStateDom(props, demo)'), 'state controls must retain the mounted Swiper node');
assert(previewSource.includes('updateProps({\n        loading: mode === \'loading\''), 'state controls must write the real parent Props');
assert(previewSource.includes('}, true);'), 'state controls must avoid renderStage() and preserve transition layers');
assert(preview.includes('const defaults = componentPropDefaults.swiper;'), 'Swiper reset must use the visible component defaults');
assert(preview.includes('items: defaults.items.map((item) => ({ ...item }))'), 'Swiper reset must clone the default items instead of reusing or clearing them');
assert(!preview.includes('state.props[state.current] = { ...swiperSourceDefaults, items: [] };'), 'Swiper reset must never turn the default preview into an empty state');
assert(previewStyles.includes('--pui-swiper-preview-motion-duration: 500ms'));
assert(previewStyles.includes('backdrop-filter: var(--preview-blur, none)'), 'Swiper controls must follow the frosted-glass switch');
assert(!previewStyles.includes('.pui-swiper-preview__arrows .pui-button { position: absolute; top: 50%; width: 32px; min-width: 32px; height: 32px; padding: 0; transform: translateY(-50%); pointer-events: auto; background: color-mix(in srgb, var(--preview-surface, var(--surface-solid)) 78%, transparent); backdrop-filter: blur(8px); }'));
assert(previewStyles.includes('.pui-swiper-preview__actions'));
assert(wxml.includes('pui-swiper__state--error') && wxss.includes('.pui-swiper__state--error { flex-direction: column;'), 'Swiper error retry is a full-width row under the error copy');
assert(!previewStyles.includes('.pui-swiper-preview__methods'));
assert(!previewStyles.includes('.pui-swiper-preview__event'));

const compactStart = preview.indexOf('function previewWxmlTagEnd(source)');
const compactEnd = preview.indexOf('function previewCodeSectionSources(detail, props)', compactStart);
const compactSandbox = {};
vm.runInNewContext(`${preview.slice(compactStart, compactEnd)}\nresult = compactPreviewWxml('<pui-swiper items="{{swiperItems}}" default-value="{{swiperDefaultValue}}" navigation="{{swiperNavigation}}" aria-label="PoemUI 组件能力轮播" />');`, compactSandbox);
const compactLines = compactSandbox.result.split('\n');
assert(compactLines.length > 1, 'single-line Swiper WXML must wrap');
assert(compactLines.every((line) => line.length <= 80), 'visible Swiper WXML lines must respect the 80-character soft limit');
assert(compactLines.every((line) => (line.match(/\s[a-z][\w:-]*=/g) || []).length <= 3), 'visible Swiper WXML lines must contain at most three attributes');

assert(api.includes('## Swiper 轮播图'));
assert(api.includes('`SwiperNavigation` 固定为'));
assert(api.includes('<pui-swiper items="{{slides}}" />'));
assert(/\d+\. Swiper/.test(compatibility));
assert(compatibility.includes('26 Props'));
assert(contract.includes('当前公开合同固定为 26 Props、7 Events、0 Slots'));
assert(contract.includes('TDesign 1.15.3'));
assert(exampleWxml.includes('navigation="{{swiperNavigation}}"'));
assert(!exampleWxml.includes('bind:transition="onSwiperTransition"'));
assert(exampleJs.includes('swiperNavigation'));
assert(!exampleJs.includes('onSwiperTransition: function'));

for (const extension of ['js', 'json', 'wxml', 'wxss']) {
  assert.strictEqual(
    fs.readFileSync(path.join(root, `swiper/swiper.${extension}`), 'utf8'),
    fs.readFileSync(path.join(root, `miniprogram_dist/swiper/swiper.${extension}`), 'utf8'),
    `swiper source/dist ${extension} must stay identical`,
  );
}

console.log('Swiper contract tests passed.');
