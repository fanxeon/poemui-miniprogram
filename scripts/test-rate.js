const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'rate/rate.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  Date,
  isFinite,
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    if (request === '../common/utils/platform-info') return { getWindowInfo: () => ({ windowWidth: 375 }) };
    throw new Error(`Unexpected dependency: ${request}`);
  },
  Component: (value) => { definition = value; },
  wx: { getWindowInfo: () => ({ windowWidth: 375 }) },
};
vm.runInNewContext(source, sandbox, { filename: 'rate/rate.js' });
assert(definition, 'Rate component definition must be registered');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
    createSelectorQuery() {
      return { select() { return this; }, boundingClientRect(callback) { this.callback = callback; return this; }, exec() { this.callback({ left: 0, width: 120 }); } };
    },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const propNames = ['value', 'defaultValue', 'count', 'size', 'gap', 'color', 'allowHalf', 'showText', 'texts', 'disabled', 'readonly', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), propNames, 'Rate publishes the exact 13-Prop contract');

const defaults = create();
assert.strictEqual(defaults.instance.data.innerValue, 0);
assert.strictEqual(defaults.instance.data.starSize, 40);
assert.strictEqual(defaults.instance.data.starGap, 8);
assert.strictEqual(defaults.instance.data.stars.length, 5);
assert.strictEqual(defaults.instance.data.activeColor, 'var(--pui-color-warning)');
assert.strictEqual(defaults.instance.data.semanticLabel, '评分');
assert.strictEqual(defaults.instance.data.semanticValueText, '0 星');
assert(defaults.instance.data.rootStyle.includes('--pui-rate-duration:500ms'));

const boundaries = create({ defaultValue: 99, count: 99, size: 999, gap: -20, ariaLabel: '  ' });
assert.strictEqual(boundaries.instance.data.innerValue, 10);
assert.strictEqual(boundaries.instance.data.stars.length, 10);
assert.strictEqual(boundaries.instance.data.starSize, 96);
assert.strictEqual(boundaries.instance.data.starGap, 0);
assert.strictEqual(boundaries.instance.data.semanticLabel, '评分');

const strictFalse = create({ defaultValue: false });
const strictEmpty = create({ defaultValue: '' });
const controlledZero = create({ value: 0, defaultValue: 4 });
assert.strictEqual(strictFalse.instance.data.innerValue, 0, 'Boolean is not accepted as a numeric score');
assert.strictEqual(strictEmpty.instance.data.innerValue, 0, 'empty string is not accepted as a numeric score');
assert.strictEqual(controlledZero.instance.data.innerValue, 0, 'numeric zero remains controlled');

const half = create({ defaultValue: 3.3, allowHalf: true, showText: true, texts: ['差', '一般', '可用', '好', '很好'] });
assert.strictEqual(half.instance.data.innerValue, 3.5);
assert.deepStrictEqual(Array.from(half.instance.data.stars, (star) => star.fill), [100, 100, 100, 50, 0]);
assert.strictEqual(half.instance.data.text, '好');
assert.strictEqual(half.instance.data.semanticValueText, '3.5 星，好');

const colors = create({ color: 'rgb(300, 0, 0)' });
assert.strictEqual(colors.instance.data.activeColor, 'var(--pui-color-warning)');
colors.instance.data.color = 'rgb(255, 8, 0)';
colors.instance.syncState();
assert.strictEqual(colors.instance.data.activeColor, 'rgb(255, 8, 0)');
colors.instance.data.color = '';
colors.instance.data.colorScheme = 'dark';
colors.instance.syncState();
assert.strictEqual(colors.instance.data.activeColor, 'var(--pui-color-warning)');

const reduced = create({ reduceMotion: true, readonly: true });
assert(reduced.instance.data.rootClass.includes('pui-rate--readonly'));
assert(reduced.instance.data.rootStyle.includes('--pui-rate-duration:1ms'));

const uncontrolled = create({ defaultValue: 1, allowHalf: true });
uncontrolled.instance.onRateTap({ currentTarget: { dataset: { value: 2.5 } } });
assert.strictEqual(uncontrolled.instance.data.innerValue, 2.5);
assert.strictEqual(JSON.stringify(uncontrolled.events), JSON.stringify([{ name: 'change', detail: { value: 2.5, source: 'tap' } }]));
uncontrolled.instance.onRateTap({ currentTarget: { dataset: { value: 2.5 } } });
assert.strictEqual(uncontrolled.events.length, 1, 'same score emits no duplicate change');
assert(!uncontrolled.events.some((event) => event.name === 'input'), 'Rate never duplicates change through input');

const controlled = create({ value: 2, defaultValue: 5, allowHalf: true });
controlled.instance.onRateTap({ currentTarget: { dataset: { value: 4.5 } } });
assert.strictEqual(controlled.instance.data.innerValue, 2, 'controlled tap waits for parent write-back');
assert.strictEqual(JSON.stringify(controlled.events[0]), JSON.stringify({ name: 'change', detail: { value: 4.5, source: 'tap' } }));
controlled.instance.data.value = 4.5;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 4.5);
controlled.instance.data.value = null;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 4.5, 'controlled to uncontrolled preserves the last rendered value');

const dragged = create({ defaultValue: 1, allowHalf: true, count: 5, gap: 8 });
dragged.instance._rateRect = { left: 0, width: 120 };
dragged.instance._lastRequestedValue = 1;
dragged.instance.requestTouchValue(86);
assert.strictEqual(dragged.events[0].name, 'change');
assert.strictEqual(dragged.events[0].detail.source, 'drag');
assert(dragged.events[0].detail.value > 1 && dragged.events[0].detail.value <= 5);

const readonly = create({ defaultValue: 2, readonly: true });
readonly.instance.onRateTap({ currentTarget: { dataset: { value: 4 } } });
readonly.instance.onTouchStart({ touches: [{ pageX: 10 }] });
assert.strictEqual(readonly.instance.data.innerValue, 2);
assert.strictEqual(readonly.events.length, 0);
const disabled = create({ defaultValue: 2, disabled: true });
disabled.instance.onRateTap({ currentTarget: { dataset: { value: 4 } } });
assert.strictEqual(disabled.instance.data.innerValue, 2);
assert.strictEqual(disabled.events.length, 0);
['setValue', 'reset', 'getValue', 'getState'].forEach((name) => assert.strictEqual(definition.methods[name], undefined, `Rate must not expose ${name}`));

const wxml = fs.readFileSync(path.join(root, 'rate/rate.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'rate/rate.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'rate/rate.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/RATE.md'), 'utf8');
const exampleJson = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.json'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const entry = fs.readFileSync(path.join(root, 'index.js'), 'utf8');

assert(wxml.includes('role="slider"'));
assert(wxml.includes('aria-valuenow="{{innerValue}}"'));
assert(wxml.includes('bindtouchstart="onTouchStart"'));
assert(wxml.includes('catchtouchmove="onTouchMove"'));
assert.strictEqual((wxml.match(/<pui-icon name="star"/g) || []).length, 2, 'Rate uses base and clipped active PUI Icon layers');
assert(wxml.includes('style="width:{{item.fill}}%;"'));
assert(!/<slot\b/.test(wxml), 'Rate publishes no Slots');
assert(!/<button\b|<input\b|<image\b/.test(wxml), 'Rate keeps platform interaction roots and PUI Icon only');
assert(wxss.includes('touch-action:none'));
assert(wxss.includes('var(--pui-font-size-body-small)'));
assert(!/::after/.test(wxss), 'Rate half stars do not use a background-color mask');
assert(!/display\s*:\s*none/.test(wxss));
assert(!/height\s*:\s*auto/.test(wxss));
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss), 'Rate CSS has no motion longer than 500ms');
assert.deepStrictEqual(json.usingComponents, { 'pui-icon': '../icon/icon' });

assert.deepStrictEqual(metadata.apiProps.rate, propNames);
assert.deepStrictEqual(metadata.apiEvents.rate.map((event) => event.name), ['change']);
assert.strictEqual((metadata.apiSlots.rate || []).length, 0);
assert.strictEqual((metadata.apiMethods.rate || []).length, 0);
assert(metadata.packageComponents.includes('rate'));
assert(entry.includes("    'rate',"), 'npm entry exports Rate');

assert(preview.includes('function ratePreviewState(props, demo = {})'));
assert(preview.includes('function requestRatePreview(props, demo, nextValue, source, render = true)'));
assert(preview.includes('function bindRatePreviewRuntime()'));
['基础用法', '半星与文案', '尺寸与间距', '状态与受控'].forEach((title) => assert(preview.includes(`<h3>${title}</h3>`), `Rate preview includes ${title}`));
assert(preview.includes("state.props[state.current].value = next"));
assert(preview.includes("window.matchMedia('(prefers-reduced-motion: reduce)').matches"));
assert(preview.includes("gap: { type: 'range', value: 8, min: 0, max: 32"));
assert(preview.includes("rateStaticProps({ value: 0, showText: true"), 'Rate 概览必须保留 value=0 的真实受控评分示例。');
assert(!preview.includes('pui-rate-composition'));
assert(!preview.includes('默认 slot 可组合评分状态'));
assert(previewStyles.includes('.pui-rate-preview__fill'));
assert(previewStyles.includes('.pui-rate-showcase__stack'));
assert(previewStyles.includes('@media (prefers-reduced-motion: reduce)'));

const rateApi = api.slice(api.indexOf('## Rate'), api.indexOf('\n## ', api.indexOf('## Rate') + 4));
assert(rateApi.includes('13 Props'));
assert(rateApi.includes('| `change` |'));
assert(rateApi.includes('<pui-rate></pui-rate>'));
assert(rateApi.includes('Rate 无 Slot 或实例方法'));
assert(!rateApi.includes('`input`、`change`'));
assert(!rateApi.includes('`duration`、`easing`'));
assert(/\d+\. Rate/.test(compatibility));
assert(compatibility.includes('Rate 无 Slot、实例方法'));
assert(contract.includes('Props 固定为 `value/defaultValue/count/size/gap/color/allowHalf/showText/texts/disabled/readonly/ariaLabel/reduceMotion`'));
assert(contract.includes('基础 WXML 为 `<pui-rate></pui-rate>` 且零 `bind:*`'));

assert(exampleJson.includes('"pui-rate": "poemui-miniprogram/rate/rate"'));
assert(exampleWxml.includes('<pui-rate value="{{componentRating}}"'));
assert(exampleWxml.includes('bind:change="onComponentRatingChange"'));
assert(!exampleWxml.includes('<pui-rate value="{{componentRating}}" count="5" allow-half'));
assert(exampleJs.includes('onComponentRatingChange: function onComponentRatingChange'));
assert(exampleJs.includes("event.detail.source"));

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = fs.readFileSync(path.join(root, `rate/rate.${extension}`));
  const distFile = fs.readFileSync(path.join(root, `miniprogram_dist/rate/rate.${extension}`));
  assert(sourceFile.equals(distFile), `source and miniprogram_dist Rate ${extension} must match`);
});

console.log('Rate contract tests passed.');
