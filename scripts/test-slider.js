const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'slider/slider.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'slider/slider.js' });
assert(definition, 'Slider component definition must be registered');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const propNames = ['value', 'defaultValue', 'min', 'max', 'step', 'color', 'trackColor', 'name', 'blockSize', 'disabled', 'readonly', 'showValue', 'showMinMax', 'valueSuffix', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), propNames, 'Slider publishes the exact 16-Prop contract');

const defaults = create();
assert.strictEqual(defaults.instance.data.innerValue, 0);
assert.strictEqual(defaults.instance.data.lowerBound, 0);
assert.strictEqual(defaults.instance.data.upperBound, 100);
assert.strictEqual(defaults.instance.data.normalizedStep, 1);
assert.strictEqual(defaults.instance.data.normalizedBlockSize, 28);
assert(defaults.instance.data.rootClass.includes('pui-slider'));
assert(defaults.instance.data.rootStyle.includes('--pui-slider-duration:500ms'));
assert(defaults.instance.data.rootStyle.includes('var(--pui-ease-standard)'));
assert.strictEqual(defaults.instance.data.semanticLabel, '滑块');

const boundaries = create({ min: 10, max: 5, step: 0, defaultValue: 999, blockSize: 99, ariaLabel: '  ' });
assert.strictEqual(boundaries.instance.data.lowerBound, 10);
assert.strictEqual(boundaries.instance.data.upperBound, 10);
assert.strictEqual(boundaries.instance.data.innerValue, 10);
assert.strictEqual(boundaries.instance.data.normalizedStep, 1);
assert.strictEqual(boundaries.instance.data.normalizedBlockSize, 28);
assert.strictEqual(boundaries.instance.data.semanticLabel, '滑块');

const strictFalse = create({ min: -10, max: 10, defaultValue: false });
assert.strictEqual(strictFalse.instance.data.innerValue, -10, 'Boolean is not coerced to 0');
const strictEmpty = create({ min: -10, max: 10, defaultValue: '' });
assert.strictEqual(strictEmpty.instance.data.innerValue, -10, 'empty string is not coerced to 0');
const controlledZero = create({ min: -10, max: 10, value: 0 });
assert.strictEqual(controlledZero.instance.data.innerValue, 0, 'numeric zero remains a controlled value');

const fractional = create({ min: 0.1, max: 1, step: 0.2, defaultValue: 0.58, blockSize: 2 });
assert.strictEqual(fractional.instance.data.innerValue, 0.5, 'step snaps from min');
assert.strictEqual(fractional.instance.data.normalizedBlockSize, 12);

const colors = create({ color: 'rgb(300, 0, 0)', trackColor: '#abc' });
assert.strictEqual(colors.instance.data.activeColor, '#18181b', 'out-of-range rgb falls back');
assert.strictEqual(colors.instance.data.inactiveColor, '#abc');
colors.instance.data.color = 'rgb(255, 8, 0)';
colors.instance.data.trackColor = '#123456';
colors.instance.syncState();
assert.strictEqual(colors.instance.data.activeColor, 'rgb(255, 8, 0)');
assert.strictEqual(colors.instance.data.inactiveColor, '#123456');

const reduced = create({ reduceMotion: true, readonly: true });
assert(reduced.instance.data.rootClass.includes('pui-slider--readonly'));
assert(reduced.instance.data.rootClass.includes('pui-slider--reduced-motion'));
assert(reduced.instance.data.rootStyle.includes('--pui-slider-duration:1ms'));

const uncontrolled = create({ defaultValue: 0, min: 0, max: 100, step: 5, name: 'progress' });
uncontrolled.instance.onChanging({ detail: { value: 23 } });
uncontrolled.instance.onChanging({ detail: { value: 28 } });
assert.strictEqual(uncontrolled.instance.data.innerValue, 30);
assert.strictEqual(uncontrolled.events[0].name, 'changing');
assert.strictEqual(uncontrolled.events[0].detail.value, 25);
assert.strictEqual(uncontrolled.events[0].detail.previousValue, 0);
assert.strictEqual(uncontrolled.events[1].detail.previousValue, 25, 'continuous changing tracks the previous request');
uncontrolled.instance.onChange({ detail: { value: 30 } });
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['changing', 'changing', 'change']);
assert.strictEqual(uncontrolled.events[2].detail.previousValue, 0, 'change reports the drag start');
assert.strictEqual(uncontrolled.events[2].detail.source, 'drag');
assert.strictEqual(uncontrolled.events[2].detail.controlled, false);
assert.strictEqual(uncontrolled.events[2].detail.step, 5);
assert(!uncontrolled.events.some((event) => event.name === 'input'), 'Slider never duplicates change through input');

const unchanged = create({ defaultValue: 20 });
unchanged.instance.onChange({ detail: { value: 20 } });
assert.strictEqual(unchanged.events.length, 0, 'unchanged release emits no change');

const controlled = create({ value: 20, defaultValue: 5, step: 10 });
controlled.instance.onChanging({ detail: { value: 34 } });
assert.strictEqual(controlled.instance.data.innerValue, 20, 'controlled drag waits for parent write-back');
assert.strictEqual(controlled.events[0].detail.value, 30);
assert.strictEqual(controlled.events[0].detail.controlled, true);
controlled.instance.onChange({ detail: { value: 34 } });
assert.deepStrictEqual(controlled.events.map((event) => event.name), ['changing', 'change']);
assert.strictEqual(controlled.instance.data.innerValue, 20, 'controlled release still waits for parent');
controlled.instance.data.value = 30;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 30, 'parent write-back commits controlled value');
controlled.instance.data.value = null;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 30, 'leaving controlled mode preserves the last rendered value');

const readonly = create({ defaultValue: 20, readonly: true });
readonly.instance.onChanging({ detail: { value: 40 } });
readonly.instance.onChange({ detail: { value: 40 } });
assert.strictEqual(readonly.instance.data.innerValue, 20);
assert.strictEqual(readonly.events.length, 0);
const disabled = create({ defaultValue: 20, disabled: true });
disabled.instance.onChanging({ detail: { value: 40 } });
disabled.instance.onChange({ detail: { value: 40 } });
assert.strictEqual(disabled.instance.data.innerValue, 20);
assert.strictEqual(disabled.events.length, 0);
['setValue', 'reset', 'getValue', 'getState'].forEach((name) => assert.strictEqual(definition.methods[name], undefined, `Slider must not expose ${name}`));

const wxml = fs.readFileSync(path.join(root, 'slider/slider.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'slider/slider.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'slider/slider.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/SLIDER.md'), 'utf8');
const generator = fs.readFileSync(path.join(root, 'scripts/generate-components.js'), 'utf8');
const exampleJson = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.json'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const entry = fs.readFileSync(path.join(root, 'index.js'), 'utf8');

assert(wxml.includes('<slider class="pui-slider__native"'));
assert(wxml.includes('step="{{normalizedStep}}"'));
assert(wxml.includes('block-size="{{normalizedBlockSize}}"'));
assert(wxml.includes('disabled="{{disabled || readonly}}"'));
assert(wxml.includes('aria-valuetext="{{innerValue}}{{valueSuffix}}"'));
assert(wxml.includes('wx:if="{{showMinMax}}"'));
assert(wxml.includes('{{innerValue}}{{valueSuffix}}'));
assert(!/<slot\b/.test(wxml), 'Slider publishes no Slots');
assert(!/<button\b|<input\b|<image\b/.test(wxml), 'Slider uses the native slider instead of replacement controls');
assert(wxss.includes('.pui-slider--readonly'));
assert(wxss.includes('.pui-slider--reduced-motion'));
assert(wxss.includes('overflow-wrap:anywhere'));
assert(!/ellipsis|text-overflow|white-space:\s*nowrap/.test(wxss), 'Slider values are never truncated');
assert(!/display\s*:\s*none/.test(wxss));
assert(!/height\s*:\s*auto/.test(wxss));
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss), 'Slider CSS has no motion longer than 500ms');
assert.deepStrictEqual(json.usingComponents || {}, {});

assert.deepStrictEqual(metadata.apiProps.slider, propNames);
assert.strictEqual(metadata.apiEvents.slider.length, 2);
assert.deepStrictEqual(metadata.apiEvents.slider.map((event) => event.name), ['changing', 'change']);
assert.strictEqual((metadata.apiSlots.slider || []).length, 0);
assert.strictEqual((metadata.apiMethods.slider || []).length, 0);
assert(metadata.packageComponents.includes('slider'));
assert(shadcn.includes("['Slider', 'slider', 'adapter', 'drag'"));
assert(shadcn.includes("不虚构为微信原生能力。', 'done']"));
assert(generator.includes("  'slider',"), 'experimental generator protects Slider');
assert(entry.includes("    'slider',"), 'npm entry exports Slider');

assert(preview.includes("if (runtimeId === 'slider')"));
assert(preview.includes('function sliderPreviewBounds(props)'));
assert(preview.includes('function sliderPreviewSnapshot(props, demo, key, initialValue)'));
assert(preview.includes('function sliderPreviewMarkup(props, demo, key, initialValue)'));
assert(preview.includes('function sliderShowcase(props)'));
['基础用法', '边界与步长', '颜色与表单', '状态与受控'].forEach((title) => assert(preview.includes(`<strong>${title}</strong>`), `Slider preview includes ${title}`));
assert(preview.includes("previewIdFor(state.current) === 'slider'"));
assert(preview.includes('state.props[state.current].value = next'));
assert(preview.includes("window.matchMedia('(prefers-reduced-motion: reduce)').matches"));
assert(preview.includes("const sliderAttributes = attrs ? ` ${attrs}` : ''"));
assert(preview.includes('<pui-slider${sliderAttributes}></pui-slider>'));
assert(preview.includes('基础调用不需要 bind:*'));
assert(preview.includes("apiOptions: '正数；非法值或 0 回退 1'"));
assert(preview.includes("trackColor: '微信原生背景轨颜色；只接受安全十六进制或 rgb，非法值回退当前主题中性轨道色。'"));
assert(preview.includes("blockSize: '微信原生滑块尺寸，运行时限制为 12–28。'"));
assert(!preview.includes('function commitSliderPreviewValue(props, demo, requestedValue, source)'));
assert(!preview.includes('pui-slider-methods'));
assert(!preview.includes('pui-slider-composition'));
assert(preview.includes("if (compatId === 'slider')"));
assert(previewStyles.includes('.pui-slider.is-dragging'));
assert(previewStyles.includes('.pui-slider-demo-group + .pui-slider-demo-group'));
assert(previewStyles.includes('@media (prefers-reduced-motion: reduce)'));
assert(!previewStyles.includes('.pui-slider-methods'));

assert(api.includes('## Slider'));
assert(api.includes('TDesign 对照后的 16 Props'));
assert(api.includes('| `changing` |'));
assert(api.includes('| `change` |'));
assert(api.includes('Slider 不公开 Slot 或实例方法'));
assert(!api.slice(api.indexOf('## Slider'), api.indexOf('\n## ', api.indexOf('## Slider') + 4)).includes('`input` |'), 'Slider API section has no input event');
assert(/\d+\. Slider/.test(compatibility));
assert(compatibility.includes('Slider 无 Slot 或实例方法'));
assert(contract.includes('16 Props、2 Events、0 Slots、0 Methods'));
assert(contract.includes('range/vertical/marks/theme= capsule'));

assert(exampleJson.includes('"pui-slider": "poemui-miniprogram/slider/slider"'));
assert(exampleWxml.includes('<pui-slider value="{{releaseProgress}}"'));
assert(exampleWxml.includes('bind:changing="onReleaseProgressChanging"'));
assert(exampleWxml.includes('bind:change="onReleaseProgressChange"'));
assert(!exampleWxml.includes('bind:input="onReleaseProgressInput"'));
assert(exampleJs.includes('onReleaseProgressChanging: function onReleaseProgressChanging'));
assert(exampleJs.includes('onReleaseProgressChange: function onReleaseProgressChange'));
assert(!exampleJs.includes('resetReleaseSlider'));
assert(!exampleJs.includes('readReleaseSlider'));

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = fs.readFileSync(path.join(root, `slider/slider.${extension}`));
  const distFile = fs.readFileSync(path.join(root, `miniprogram_dist/slider/slider.${extension}`));
  assert(sourceFile.equals(distFile), `source and miniprogram_dist Slider ${extension} must match`);
});

console.log('Slider contract tests passed.');
