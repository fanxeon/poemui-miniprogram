const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'stepper/stepper.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  console,
  isFinite,
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: 'stepper/stepper.js' });
assert(definition, 'Stepper component definition must be registered');

const PROPS = [
  'value', 'defaultValue', 'min', 'max', 'step', 'integer', 'inputWidth', 'size', 'theme',
  'disabled', 'readonly', 'disableInput', 'ariaLabel', 'reduceMotion',
];

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return `pui-theme--${this.data.colorScheme}`; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

assert.deepStrictEqual(Object.keys(definition.properties), PROPS, 'Stepper publishes the exact 14-Prop contract');
assert(!source.includes('duration: {'));
assert(!source.includes('easing: {'));
assert(!source.includes("triggerEvent('input'"), 'Stepper does not duplicate change as input');

const defaults = create();
assert.strictEqual(defaults.instance.data.innerValue, 0);
assert.strictEqual(defaults.instance.data.normalizedStep, 1);
assert.strictEqual(defaults.instance.data.inputSize, 'medium');
assert.strictEqual(defaults.instance.data.normalizedInputWidth, 120);
assert(defaults.instance.data.rootStyle.includes('--pui-stepper-duration:500ms'));
assert(defaults.instance.data.rootStyle.includes('--pui-stepper-ease:var(--pui-ease-standard)'));

const uncontrolled = create({ value: null, defaultValue: 2, min: 0, max: 3, step: 1 });
uncontrolled.instance.onPlus();
assert.strictEqual(uncontrolled.instance.data.innerValue, 3);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change']);
assert.deepStrictEqual(plain(uncontrolled.events[0].detail), { value: 3, previousValue: 2, source: 'plus', controlled: false });
uncontrolled.instance.onPlus();
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change', 'overlimit']);
assert.deepStrictEqual(plain(uncontrolled.events[1].detail), { type: 'plus', value: 3, min: 0, max: 3, controlled: false });

const lowerBoundary = create({ value: null, defaultValue: -1, min: -1, max: 2, step: 0.25, integer: false });
lowerBoundary.instance.onMinus();
assert.strictEqual(lowerBoundary.events[0].name, 'overlimit');
assert.strictEqual(lowerBoundary.events[0].detail.type, 'minus');

const controlled = create({ value: 0, defaultValue: 8, min: 0, max: 10 });
assert.strictEqual(controlled.instance.data.innerValue, 0, 'zero is a legal controlled value');
controlled.instance.onPlus();
assert.strictEqual(controlled.instance.data.innerValue, 0, 'controlled Stepper waits for parent write-back');
assert.deepStrictEqual(plain(controlled.events[0].detail), { value: 1, previousValue: 0, source: 'plus', controlled: true });
controlled.instance.data.value = false;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 0, 'boolean is not coerced to 0 by accident');
controlled.instance.data.value = '';
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 0, 'empty string normalizes to the safe lower bound');
controlled.instance.data.value = 6;
controlled.instance.syncState();
controlled.instance.data.value = null;
controlled.instance.data.defaultValue = 9;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 6, 'controlled-to-uncontrolled keeps the last rendered value');

const typed = create({ value: null, defaultValue: 1.5, min: -1, max: 5, step: 0.25, integer: false });
typed.instance.onFocus({ detail: { value: '1.5' } });
typed.instance.onInputChange({ detail: { value: '4.62' } });
assert.strictEqual(typed.instance.data.displayValue, '4.62');
assert.deepStrictEqual(typed.events.map((event) => event.name), ['focus'], 'typing only updates the draft');
typed.instance.onBlur({ detail: { value: '4.62' } });
assert.strictEqual(typed.instance.data.innerValue, 4.5);
assert.deepStrictEqual(typed.events.map((event) => event.name), ['focus', 'change', 'blur']);
assert.strictEqual(typed.events[1].detail.source, 'blur');
assert.strictEqual(typed.events[2].detail.value, 4.5);

const entered = create({ value: null, defaultValue: 2, min: 0, max: 10, step: 2 });
entered.instance.onInputChange({ detail: { value: '7' } });
entered.instance.onEnter({ detail: { value: '7' } });
assert.strictEqual(entered.instance.data.innerValue, 8);
assert.deepStrictEqual(entered.events.map((event) => event.name), ['change']);
assert.strictEqual(entered.events[0].detail.source, 'enter');

const inputLocked = create({ defaultValue: 2, disableInput: true });
inputLocked.instance.onInputChange({ detail: { value: '9' } });
inputLocked.instance.onFocus({ detail: {} });
inputLocked.instance.onPlus();
assert.strictEqual(inputLocked.instance.data.innerValue, 3);
assert.deepStrictEqual(inputLocked.events.map((event) => event.name), ['change'], 'disableInput leaves buttons active');

['disabled', 'readonly'].forEach((state) => {
  const locked = create({ [state]: true, value: null, defaultValue: 0, min: 0, max: 2 });
  locked.instance.onMinus();
  locked.instance.onPlus();
  locked.instance.onInputChange({ detail: { value: '2' } });
  locked.instance.onEnter({ detail: { value: '2' } });
  locked.instance.onFocus({ detail: {} });
  locked.instance.onBlur({ detail: { value: '2' } });
  assert.strictEqual(locked.instance.data.innerValue, 0);
  assert.strictEqual(locked.events.length, 0, `${state} blocks all Stepper requests`);
});

const boundaries = create({ value: false, min: 5, max: 2, step: 0, size: 'huge', theme: 'ghost', inputWidth: 999, reduceMotion: true });
assert.strictEqual(boundaries.instance.data.lowerBound, 5);
assert.strictEqual(boundaries.instance.data.upperBound, 5);
assert.strictEqual(boundaries.instance.data.innerValue, 5);
assert.strictEqual(boundaries.instance.data.normalizedStep, 1);
assert.strictEqual(boundaries.instance.data.inputSize, 'medium');
assert(boundaries.instance.data.rootClass.includes('pui-stepper--normal'));
assert.strictEqual(boundaries.instance.data.normalizedInputWidth, 480);
assert(boundaries.instance.data.rootStyle.includes('--pui-stepper-duration:1ms'));

const wxml = fs.readFileSync(path.join(root, 'stepper/stepper.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'stepper/stepper.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'stepper/stepper.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/STEPPER.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert.strictEqual(json.usingComponents['pui-input'], '../input/input');
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert(wxml.includes('bind:change="onInputChange"'));
assert(wxml.includes('custom-style="position:absolute;top:50%;left:{{buttonTrackSize}}rpx;width:{{normalizedInputWidth}}rpx;transform:translateY(-50%);"'), 'Stepper must constrain the PUI Input root to the fixed middle track');
assert(wxml.includes('bind:enter="onEnter"'));
assert(!wxml.includes('bind:input='));
assert(!wxml.includes('<slot'));
assert(wxml.includes('disabled="{{locked}}"'), 'boundary buttons stay clickable while the whole Stepper can lock');
assert(!wxss.includes('!important'));
assert(wxml.includes('custom-style="position:absolute;top:0;right:0;"') && wxml.includes('custom-style="position:absolute;top:0;left:0;"'), 'Stepper must compensate WeChat custom-component host projection with explicit edge coordinates');
assert(source.includes('buttonTrackSize: buttonTrackSize'), 'Stepper must expose its normalized button track to the Input coordinate');
assert(source.includes('--pui-stepper-control-width:'), 'Stepper root width must derive from the two standard Button tracks and inputWidth');
assert(!/\.pui-stepper__button\s*\{[^}]*\b(?:width|height|padding)\s*:/.test(wxss), 'Stepper does not override the internal Button geometry');
assert(!/\.pui-stepper__input \.pui-input__field[^}]*\b(?:height|min-height|padding)\s*:/.test(wxss), 'Stepper does not override Input geometry');
assert.strictEqual(metadata.apiProps.stepper.length, 14);
assert.strictEqual(metadata.apiEvents.stepper.length, 4);
assert.strictEqual(metadata.apiSlots.stepper, undefined);
assert.strictEqual(metadata.apiMethods.stepper, undefined);
assert.deepStrictEqual(metadata.apiEvents.stepper.map((event) => event.name), ['change', 'overlimit', 'focus', 'blur']);

['基础用法', '主题与尺寸', '步长与边界', '状态与输入'].forEach((title) => assert(preview.includes(`<strong>${title}</strong>`), `Stepper overview includes ${title}`));
assert(preview.includes('function stepperPreviewSnapshot('));
assert(preview.includes('function stepperPreviewMarkup('));
assert(preview.includes('function bindStepperPreviewRuntime('));
assert(preview.includes("source === 'blur') demo.stepperEventSequences[key] = sequence.concat('change', 'blur')"));
assert(!preview.includes('Stepper states'));
assert(styles.includes('.pui-stepper-demo-group + .pui-stepper-demo-group'));
assert(styles.includes('.pui-stepper--outline .pui-stepper__input'));
assert(styles.includes('.preview-stage .pui-stepper {'), 'appearance rules preserve the Stepper lifecycle selector');
assert(styles.includes('opacity var(--pui-stepper-duration, 500ms)'), 'appearance rules preserve the Stepper 500ms/1ms motion contract');

assert(api.includes('Stepper：TDesign 对照后的 14 Props'));
assert(api.includes('`change → blur`'));
assert(compatibility.includes('Stepper 的 H5 镜像'));
assert(compatibility.includes('固定 500ms/1ms'));
assert(contract.includes('输入时只保留草稿'));
assert(contract.includes('TDesign Mini Program 1.15.3'));
assert(exampleWxml.includes('<pui-stepper'));

for (const layer of ['stepper', 'miniprogram_dist/stepper', '_example/node_modules/poemui-miniprogram/miniprogram_dist/stepper']) {
  if (!fs.existsSync(path.join(root, layer))) continue;
  for (const extension of ['js', 'json', 'wxml', 'wxss']) {
    assert.strictEqual(
      fs.readFileSync(path.join(root, layer, `stepper.${extension}`), 'utf8'),
      fs.readFileSync(path.join(root, 'stepper', `stepper.${extension}`), 'utf8'),
      `${layer} stepper.${extension} matches source`,
    );
  }
}

console.log('Stepper contract tests passed.');
