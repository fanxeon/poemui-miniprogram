const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'date-time-picker/date-time-picker.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  Date,
  Object,
  Array,
  String,
  Number,
  Math,
  isFinite,
  isNaN,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'date-time-picker/date-time-picker.js' });
assert(definition, 'DateTimePicker component definition must be registered');

const expectedProps = [
  'value', 'defaultValue', 'visible', 'defaultVisible', 'mode', 'start', 'end', 'format', 'steps', 'showWeek',
  'title', 'type', 'cancelText', 'confirmText', 'showHeader', 'usePopup', 'autoClose', 'closeOnOverlayClick',
  'disabled', 'readonly', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), expectedProps, 'DateTimePicker publishes the 22-prop wheel contract');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const pickerCalls = [];
  const picker = {
    open() { pickerCalls.push(['open']); return true; },
    close(sourceValue) { pickerCalls.push(['close', sourceValue]); return true; },
    confirm(sourceValue) { pickerCalls.push(['confirm', sourceValue]); return true; },
    cancel(sourceValue) { pickerCalls.push(['cancel', sourceValue]); return true; },
  };
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
    selectComponent(selector) { assert.strictEqual(selector, '#dateTimePickerCore'); return picker; },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events, pickerCalls };
}

const leap = create({
  defaultValue: '2024-02-29',
  start: '2024-01-01',
  end: '2024-12-31',
  mode: 'date',
  showWeek: true,
});
assert.strictEqual(leap.instance.data.pickerColumns.length, 3);
assert.deepStrictEqual(Array.from(leap.instance.data.pickerValue), [2024, 2, 29]);
assert.strictEqual(leap.instance.data.pickerColumns[2].length, 29, 'leap February exposes 29 days');
assert(leap.instance.data.pickerColumns[2][28].label.includes('周四'), 'showWeek decorates the date label');
assert.strictEqual(leap.instance.getValue().value, '2024-02-29');

const precision = create({
  defaultValue: '2026-07-15 09:37:42',
  start: '2026-07-15 09:00:00',
  end: '2026-07-15 18:00:00',
  mode: ['date', 'second'],
  format: 'YYYY/MM/DD HH:mm:ss',
  steps: { minute: 15, second: 20 },
});
assert.strictEqual(precision.instance.data.pickerColumns.length, 6);
assert.deepStrictEqual(Array.from(precision.instance.data.pickerColumns[4], (item) => item.value), [0, 15, 30, 45, 59]);
assert.deepStrictEqual(Array.from(precision.instance.data.pickerColumns[5], (item) => item.value), [0, 20, 40, 59]);
assert.strictEqual(precision.instance.getValue().value, '2026/07/15 09:30:40');

const zero = create({
  value: 0,
  start: 0,
  end: 86400000,
  mode: ['date', 'second'],
  format: 'YYYY-MM-DD HH:mm:ss',
});
assert.strictEqual(zero.instance.isControlledValue(), true, 'timestamp 0 is a controlled value');
assert.strictEqual(zero.instance.getValue().timestamp, 0);

const controlled = create({
  value: '2026-07-15 09:30',
  start: '2026-01-01 00:00',
  end: '2026-12-31 23:59',
  mode: ['date', 'minute'],
});
controlled.instance.onPickerPick({ detail: { value: [2026, 8, 20, 10, 45], column: 2, index: 19, source: 'picker' } });
assert.strictEqual(controlled.events[0].name, 'pick');
assert.strictEqual(controlled.events[0].detail.unit, 'date');
controlled.instance.onPickerConfirm({ detail: { value: [2026, 8, 20, 10, 45], source: 'confirm-button' } });
assert.deepStrictEqual(controlled.events.slice(1).map((item) => item.name), ['confirm', 'change']);
assert.strictEqual(controlled.events[2].detail.value, '2026-08-20 10:45');
assert.strictEqual(controlled.instance.getValue().value, '2026-07-15 09:30', 'controlled confirm waits for parent write-back');

const uncontrolled = create({
  defaultValue: '2026-01-31',
  start: '2026-01-01',
  end: '2026-12-31',
  mode: 'date',
});
uncontrolled.instance.onPickerPick({ detail: { value: [2026, 2, 31], column: 1, index: 1, source: 'picker' } });
assert.deepStrictEqual(Array.from(uncontrolled.instance.data.pickerValue), [2026, 2, 28], 'month change clamps invalid month-end');
uncontrolled.instance.onPickerConfirm({ detail: { value: [2026, 2, 28], source: 'confirm-button' } });
assert.strictEqual(uncontrolled.instance.getValue().value, '2026-02-28');
uncontrolled.instance.onPickerPick({ detail: { value: [2026, 3, 15], column: 1, index: 2, source: 'picker' } });
uncontrolled.instance.onPickerCancel({ detail: { source: 'cancel-button' } });
assert.strictEqual(uncontrolled.instance.getValue().value, '2026-02-28', 'cancel retains committed value');
assert.deepStrictEqual(Array.from(uncontrolled.instance.data.pickerValue), [2026, 2, 28]);

const visible = create({ defaultValue: '2026-07-15', defaultVisible: false, start: '2026-01-01', end: '2026-12-31' });
assert.strictEqual(visible.instance.open(), true);
assert.deepStrictEqual(visible.pickerCalls[0], ['open']);
visible.instance.onPickerVisibleChange({ detail: { visible: true, source: 'programmatic' } });
visible.instance.onPickerOpen({ detail: { source: 'programmatic' } });
visible.instance.onPickerCancel({ detail: { source: 'cancel-button' } });
visible.instance.onPickerVisibleChange({ detail: { visible: false, source: 'cancel-button' } });
visible.instance.onPickerClose({ detail: { source: 'cancel-button' } });
assert.deepStrictEqual(visible.events.map((item) => item.name), ['visible-change', 'open', 'cancel', 'visible-change', 'close']);

['disabled', 'readonly'].forEach((state) => {
  const blocked = create({ defaultValue: '2026-07-15', [state]: true });
  assert.strictEqual(blocked.instance.open(), false);
  assert.strictEqual(blocked.instance.confirm(), false);
  assert.strictEqual(blocked.instance.reset(), false);
});

const reset = create({ value: '2026-08-20', defaultValue: '2026-07-15', start: '2026-01-01', end: '2026-12-31' });
assert.strictEqual(reset.instance.reset().value, '2026-07-15');
assert.strictEqual(reset.events[0].name, 'change');
assert.strictEqual(reset.instance.getValue().value, '2026-08-20', 'controlled reset keeps rendered value');

const wxml = fs.readFileSync(path.join(root, 'date-time-picker/date-time-picker.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'date-time-picker/date-time-picker.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'date-time-picker/date-time-picker.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const example = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert.strictEqual((wxml.match(/<pui-picker\b/g) || []).length, 1, 'DateTimePicker composes one PUI Picker');
assert(!/<picker\b|<picker-view\b|<input\b|<button\b|<slot\b/.test(wxml), 'DateTimePicker does not duplicate Picker internals or expose slots');
assert(wxml.includes('type="{{type}}"'), 'DateTimePicker forwards the public default/classic presentation type to its one Picker child');
assert(wxml.includes('bind:pick="onPickerPick"'));
assert(wxml.includes('bind:confirm="onPickerConfirm"'));
assert.strictEqual(json.usingComponents['pui-picker'], '../picker/picker');
assert(wxss.includes(':host') && !wxss.includes('box-shadow'), 'wrapper stays layout-only');
assert(preview.includes("'date-time-picker': ['value', 'defaultValue', 'visible', 'defaultVisible', 'mode'"));
assert(preview.includes('function dateTimePickerShowcase'));
assert(preview.includes('dateTimePickerH5Model'));
assert(preview.includes("title: '选择发布时间', type: 'default', cancelText: '取消'"), 'DateTimePicker H5 default exposes the public type');
assert(preview.includes("type: { type: 'select', value: 'default', options: ['default', 'classic'] }"), 'DateTimePicker H5 Props workspace exposes the same type enum');
assert(preview.includes("type: props.type === 'classic' ? 'classic' : 'default',"), 'DateTimePicker H5 normalizes and forwards type through the shared Picker model');
assert(/edgeToEdgePreviewIds[\s\S]*'date-time-picker'/.test(preview), 'DateTimePicker Popup stays inside the edge-to-edge PreviewDevice');
assert(api.includes('## DateTimePicker'));
assert(api.includes('22 Props'));
assert(compatibility.includes('DateTimePicker 直接组合 PUI Picker'));
assert(example.includes('id="deliveryDateTimePicker"'));
assert(example.includes('bind:confirm="onDeliveryDateTimeConfirm"'));

const distFiles = ['date-time-picker.js', 'date-time-picker.json', 'date-time-picker.wxml', 'date-time-picker.wxss'];
distFiles.forEach((file) => {
  const distPath = path.join(root, 'miniprogram_dist/date-time-picker', file);
  if (fs.existsSync(distPath)) assert.strictEqual(fs.readFileSync(distPath, 'utf8'), fs.readFileSync(path.join(root, 'date-time-picker', file), 'utf8'), `dist ${file} matches source`);
});

console.log('DateTimePicker wheel contract tests passed.');
