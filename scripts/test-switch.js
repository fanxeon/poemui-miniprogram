const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'switch/switch.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'switch/switch.js' });
assert(definition, 'Switch component definition must be registered');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : ''; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const publicProps = ['value', 'defaultValue', 'customValue', 'label', 'icon', 'size', 'disabled', 'readonly', 'loading', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), publicProps, 'Switch publishes the 11-prop public contract');

const defaults = create();
assert.strictEqual(defaults.instance.data.innerChecked, false);
assert.strictEqual(defaults.instance.data.currentValue, false);
assert.strictEqual(defaults.instance.data.controlled, false);
assert(defaults.instance.data.rootClass.includes('pui-switch--medium'));
assert(defaults.instance.data.rootStyle.includes('--pui-switch-duration:500ms'));
assert.strictEqual(defaults.instance.data.semanticLabel, '开关');

const uncontrolled = create({ defaultValue: 'enabled', customValue: ['enabled', 'disabled'], label: ['开', '关'], icon: ['check', 'close'] });
assert.strictEqual(uncontrolled.instance.data.innerChecked, true);
assert.strictEqual(uncontrolled.instance.data.currentValue, 'enabled');
assert.strictEqual(uncontrolled.instance.data.statusText, '开');
assert.strictEqual(uncontrolled.instance.data.thumbIcon, 'check');
assert(uncontrolled.instance.data.rootClass.includes('pui-switch--label'));
assert.strictEqual(uncontrolled.instance.onTrackTap(), true);
assert.strictEqual(uncontrolled.instance.data.innerChecked, false);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change']);
assert.deepStrictEqual(JSON.parse(JSON.stringify(uncontrolled.events[0].detail)), {
  value: 'disabled',
  checked: false,
  previousValue: 'enabled',
  previousChecked: true,
  source: 'track',
  controlled: false,
});

const boundaries = create({ defaultValue: 0, customValue: [0, false] });
assert.strictEqual(boundaries.instance.data.innerChecked, true, '0 remains the active raw value');
boundaries.instance.onTrackTap();
assert.strictEqual(boundaries.events[0].detail.value, false, 'false remains the inactive raw value');
const emptyString = create({ defaultValue: '', customValue: ['', 'closed'] });
assert.strictEqual(emptyString.instance.data.innerChecked, true, 'empty string remains a valid raw value');

const invalidPair = create({ defaultValue: 'same', customValue: ['same', 'same'] });
assert.strictEqual(invalidPair.instance.data.currentValue, true, 'equal custom values fall back to booleans');
const invalidObjectPair = create({ defaultValue: true, customValue: [{ id: 1 }, { id: 0 }] });
assert.strictEqual(invalidObjectPair.instance.data.currentValue, true, 'non-scalar custom values fall back safely');

const controlled = create({ value: 'off', defaultValue: 'on', customValue: ['on', 'off'] });
assert.strictEqual(controlled.instance.data.innerChecked, false);
assert.strictEqual(controlled.instance.onTrackTap(), true);
assert.strictEqual(controlled.instance.data.innerChecked, false, 'controlled Switch waits for parent write-back');
assert.strictEqual(controlled.events[0].detail.value, 'on');
assert.strictEqual(controlled.events[0].detail.controlled, true);
controlled.instance.data.value = 'on';
controlled.instance.syncState(false);
assert.strictEqual(controlled.instance.data.innerChecked, true);
controlled.instance.data.value = null;
controlled.instance.syncState(false);
assert.strictEqual(controlled.instance.data.innerChecked, true, 'leaving controlled mode preserves the last rendered state');

['disabled', 'readonly', 'loading'].forEach((key) => {
  const locked = create({ [key]: true });
  assert.strictEqual(locked.instance.onTrackTap(), false, `${key} blocks writes`);
  assert.strictEqual(locked.events.length, 0, `${key} does not publish a fake event`);
});
assert.strictEqual(create({ disabled: true }).instance.data.interactive, false);
assert.strictEqual(create({ readonly: true }).instance.data.interactive, false);
assert.strictEqual(create({ loading: true }).instance.data.interactive, false);

const presentation = create({ size: 'large', label: ['ON', 'OFF'], icon: ['check', 'close'], ariaLabel: '发布通知', reduceMotion: true, colorScheme: 'dark' });
assert(presentation.instance.data.rootClass.includes('pui-switch--large'));
assert(presentation.instance.data.rootClass.includes('pui-switch--label'));
assert(presentation.instance.data.rootClass.includes('pui-switch--reduced-motion'));
assert(presentation.instance.data.rootClass.includes('pui-theme--dark'));
assert.strictEqual(presentation.instance.data.iconSize, '28rpx');
assert.strictEqual(presentation.instance.data.semanticLabel, '发布通知');
assert(presentation.instance.data.rootStyle.includes('--pui-switch-duration:1ms'));
assert(create({ size: 'huge' }).instance.data.rootClass.includes('pui-switch--medium'));

const wxml = fs.readFileSync(path.join(root, 'switch/switch.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'switch/switch.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'switch/switch.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert(wxml.includes('role="switch"'));
assert(wxml.includes('aria-readonly="{{readonly}}"'));
assert(wxml.includes('aria-busy="{{loading}}"'));
assert(wxml.includes('catchtap="onTrackTap"'));
assert(wxml.includes('<pui-icon'));
assert(wxml.includes('<pui-loading'));
assert(!wxml.includes('<slot'), 'Switch has no public slots');
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert.strictEqual(json.usingComponents['pui-loading'], '../loading/loading');
assert(wxss.includes('transform: translateX('));
assert(wxss.includes('var(--pui-switch-duration)'));
assert(!/display\s*:\s*none/.test(wxss));
assert(!/height\s*:\s*auto/.test(wxss));
assert.deepStrictEqual(metadata.apiProps.switch, publicProps);
assert.deepStrictEqual(metadata.apiEvents.switch.map((item) => item.name), ['change']);
assert.strictEqual(metadata.apiSlots.switch, undefined);
assert.strictEqual(metadata.apiMethods.switch, undefined);
assert(metadata.packageComponents.includes('switch'));
assert(preview.includes('function switchPreviewSnapshot(props, demo)'));
assert(preview.includes('return reduced ? 1 : 500;'), 'H5 Switch keeps the source 500ms/1ms motion contract');
assert(preview.includes('function requestSwitchPreview(props, demo, nextChecked, source)'));
assert(preview.includes('function bindSwitchPreviewRuntime(props)'));
assert(preview.includes("event.propertyName === 'transform'"));
assert(preview.includes("root.dataset.switchMotionState = 'running'"));
assert(preview.includes("root.classList.add('is-motion-prime')"));
assert(preview.includes('void thumb.offsetWidth'));
assert(preview.includes('<h3>基础开关</h3>'));
assert(preview.includes('<h3>带文字与图标</h3>'));
assert(preview.includes('<h3>开关状态</h3>'));
assert(preview.includes('<h3>尺寸</h3>'));
assert(preview.includes("previewIdFor(state.current) === 'switch' && type === 'switch-toggle'"));
assert(!preview.includes('switch-method-check'));
assert(!preview.includes('switch-slot'));
assert(previewStyles.includes('.pui-switch-preview__control'));
assert(previewStyles.includes('.pui-switch-preview.is-motion-prime .pui-switch-preview__thumb'));
assert(previewStyles.includes('.pui-switch-showcase'));
assert(previewStyles.includes('gap: var(--pui-section-gap)'));
assert(previewStyles.includes('@media (prefers-reduced-motion: reduce)'));
assert(api.includes('## Switch'));
assert(api.includes('11 Props'));
assert(api.includes('`change`'));
const switchApiSection = api.slice(api.indexOf('## Switch'), api.indexOf('## Checkbox'));
assert(!switchApiSection.includes('`click → input → change`'));
assert(compatibility.includes('Switch'));
assert(exampleWxml.includes('id="delivery-switch"'));
assert(exampleWxml.includes('custom-value="{{notificationValues}}"'));
assert(exampleWxml.includes('bind:change="onSwitchChange"'));
assert(!exampleWxml.includes('bind:input="onSwitchInput"'));
assert(!exampleJs.includes('toggleReleaseSwitch'));

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = fs.readFileSync(path.join(root, `switch/switch.${extension}`));
  const distFile = fs.readFileSync(path.join(root, `miniprogram_dist/switch/switch.${extension}`));
  assert(sourceFile.equals(distFile), `source and miniprogram_dist Switch ${extension} must match`);
});

process.stdout.write('Switch contract tests passed.\n');
