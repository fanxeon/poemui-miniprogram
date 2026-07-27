const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'progress/progress.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
}, { filename: 'progress/progress.js' });

assert(definition, 'Progress component definition must be registered');
function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name) { events.push(name); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

assert.strictEqual(Object.keys(definition.properties).length, 10, 'Progress only publishes 10 Props');
assert.deepStrictEqual(Object.keys(definition.properties).sort(), ['ariaLabel', 'color', 'label', 'percentage', 'reduceMotion', 'size', 'status', 'strokeWidth', 'theme', 'trackColor']);
const defaults = create();
assert.strictEqual(defaults.instance.data.normalizedPercentage, 0);
assert.strictEqual(defaults.instance.data.currentTheme, 'line');
assert.strictEqual(defaults.instance.data.currentStatus, 'active');
assert.strictEqual(defaults.instance.data.showLabel, true);
assert.strictEqual(defaults.instance.data.iconColor, 'var(--pui-color-info)');
assert.strictEqual(defaults.events.length, 0);
assert.strictEqual(typeof defaults.instance.getProgress, 'undefined');

const boundary = create({ percentage: 120, theme: 'bad', status: 'danger', size: 20, strokeWidth: 100, color: 'url(javascript:1)', trackColor: 'red' });
assert.strictEqual(boundary.instance.data.normalizedPercentage, 100);
assert.strictEqual(boundary.instance.data.currentTheme, 'line');
assert.strictEqual(boundary.instance.data.currentStatus, 'success');
assert(boundary.instance.data.rootStyle.includes('--pui-progress-color:var(--pui-color-success)'));
assert(boundary.instance.data.rootStyle.includes('--pui-progress-track:var(--pui-bg-muted)'));
assert.strictEqual(boundary.instance.data.iconColor, 'var(--pui-color-success)');

const circle = create({ percentage: 25, theme: 'circle', label: '四分之一', size: 160, strokeWidth: 12 });
assert.strictEqual(circle.instance.data.currentTheme, 'circle');
assert.strictEqual(circle.instance.data.halfRotation, 45);
assert.strictEqual(circle.instance.data.labelText, '四分之一');
assert(circle.instance.data.circleStyle.includes('width:160rpx'));
const reduced = create({ reduceMotion: true, theme: 'plump', label: false });
assert.strictEqual(reduced.instance.data.currentTheme, 'plump');
assert.strictEqual(reduced.instance.data.showLabel, false);
assert(reduced.instance.data.rootStyle.includes('--pui-progress-duration:1ms'));

const wxml = fs.readFileSync(path.join(root, 'progress/progress.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'progress/progress.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'progress/progress.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/PROGRESS.md'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const example = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert(wxml.includes("currentTheme === 'plump'"));
assert(wxml.includes('<slot name="label"></slot>'));
assert(!wxml.includes('<slot></slot>'));
assert(wxml.includes('color="{{iconColor}}"'));
assert(!source.includes('triggerEvent('));
assert(!source.includes('indeterminate'));
assert(!source.includes('getProgress'));
assert(wxss.includes('.pui-progress__track--plump'));
assert(!wxss.includes('font-size:22rpx'), 'Progress readable text must not fall below 24rpx');
assert(wxss.includes('color:var(--pui-text-on-inverse)'), 'Progress plump label must use a defined inverse-text token');
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert.deepStrictEqual(metadata.apiProps.progress, ['percentage', 'theme', 'label', 'size', 'status', 'strokeWidth', 'color', 'trackColor', 'ariaLabel', 'reduceMotion']);
assert.deepStrictEqual(metadata.apiSlots.progress, [
  { name: 'label', description: '追加在可见进度读数附近的短内容；不改变 percentage、状态或任务完成语义。' },
]);
assert(preview.includes("theme: { type: 'select', value: 'line', options: ['line', 'plump', 'circle'] }"));
assert(!preview.includes("demoAction: 'progress-indeterminate'"));
assert(!preview.includes("demoAction: 'progress-get'"));
assert(preview.includes('pui-progress-demo__interaction'));
assert(previewStyles.includes('color: var(--pui-text-on-inverse);'));
assert(preview.includes("${detail.slots.length} Slot${detail.slots.length === 1 ? '' : 's'}"));
assert(api.includes('10 个 Props'));
assert(compatibility.includes('Progress 的 H5 镜像必须与原生共享 `percentage`'));
assert(contract.includes('## 1. 组件定位与公开边界'));
assert(example.includes('theme="{{deliveryProgressType}}"'));
assert(!example.includes('bind:complete="onDeliveryProgressComplete"'));

console.log('Progress contract tests passed.');
