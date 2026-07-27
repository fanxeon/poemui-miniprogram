const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'collapse/collapse.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'collapse/collapse.js' });
assert(definition, 'Collapse component definition must be registered');

const PROPS = [
  'items', 'value', 'defaultValue', 'theme', 'disabled', 'expandIcon', 'expandMutex', 'defaultExpandAll',
  'customPanel', 'loading', 'loadingText', 'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion',
];
const EVENTS = ['change', 'retry'];
assert.deepStrictEqual(Object.keys(definition.properties), PROPS, 'Collapse publishes the exact 17-Prop contract');
for (const removed of ['open: function', 'close: function', 'toggle: function', "triggerEvent('input'", "triggerEvent('open'", "triggerEvent('close'"]) {
  assert(!source.includes(removed), `Collapse must keep removed API out: ${removed}`);
}

const ITEMS = [
  { label: '数字零', value: 0, description: 'number zero' },
  { header: '布尔值', value: false, content: 'boolean false', headerRightContent: 'false' },
  { label: '空字符串', value: '', description: 'empty string' },
  { label: '字符串零', value: '0', description: 'string zero' },
  { label: '锁定', value: 'locked', disabled: true },
  { label: '重复数字零', value: 0 },
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
assert.strictEqual(defaults.instance.data.motionDuration, 500);
assert.strictEqual(defaults.instance.data.motionEasing, 'cubic-bezier(0.2, 0, 0, 1)');

const strict = create({ items: ITEMS, defaultValue: [0, false, '', '0'] });
assert.deepStrictEqual(Array.from(strict.instance.data.normalizedItems, (item) => item.value), [0, false, '', '0', 'locked']);
assert.deepStrictEqual(Array.from(strict.instance.data.expandedValues), [0, false, '', '0']);
assert.strictEqual(strict.instance.data.normalizedItems[1].label, '布尔值');
assert.strictEqual(strict.instance.data.normalizedItems[1].description, 'boolean false');
assert.strictEqual(strict.instance.data.normalizedItems[1].note, 'false');

const uncontrolled = create({ items: ITEMS, defaultValue: [0] });
assert.strictEqual(uncontrolled.instance.requestToggle(1, 'tap'), true);
assert.deepStrictEqual(Array.from(uncontrolled.instance.data.expandedValues), [0, false]);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change']);
assert.strictEqual(uncontrolled.events[0].detail.value[1], false);
assert.strictEqual(uncontrolled.events[0].detail.expanded, true);
assert.strictEqual(uncontrolled.events[0].detail.controlled, false);
assert.strictEqual(uncontrolled.instance.requestToggle(0, 'keyboard'), true);
assert.deepStrictEqual(Array.from(uncontrolled.instance.data.expandedValues), [false]);
assert.strictEqual(uncontrolled.events[1].detail.source, 'keyboard');

const controlled = create({ items: ITEMS, value: [0], defaultValue: [false] });
assert.strictEqual(controlled.instance.requestToggle(1, 'tap'), true);
assert.deepStrictEqual(Array.from(controlled.instance.data.expandedValues), [0], 'controlled interaction waits for parent write-back');
assert.deepStrictEqual(Array.from(controlled.events[0].detail.value), [0, false]);
assert.strictEqual(controlled.events[0].detail.controlled, true);
controlled.instance.data.value = [false, '', '0'];
controlled.instance.syncState();
assert.deepStrictEqual(Array.from(controlled.instance.data.expandedValues), [false, '', '0']);
controlled.instance.data.value = null;
controlled.instance.syncState();
assert.deepStrictEqual(Array.from(controlled.instance.data.expandedValues), [false, '', '0'], 'leaving control preserves latest controlled values');

const mutex = create({ items: ITEMS, defaultValue: [0, false], expandMutex: true });
assert.deepStrictEqual(Array.from(mutex.instance.data.expandedValues), [0]);
assert.strictEqual(mutex.instance.requestToggle(1, 'tap'), true);
assert.deepStrictEqual(Array.from(mutex.instance.data.expandedValues), [false]);

const delayed = create({ items: [], defaultExpandAll: true });
assert.deepStrictEqual(Array.from(delayed.instance.data.expandedValues), []);
delayed.instance.data.items = ITEMS;
delayed.instance.syncState();
assert.deepStrictEqual(Array.from(delayed.instance.data.expandedValues), [0, false, '', '0', 'locked']);

const blocked = create({ items: ITEMS, disabled: true });
assert.strictEqual(blocked.instance.requestToggle(0, 'tap'), false);
assert.strictEqual(blocked.instance.requestToggle(4, 'tap'), false);
assert.strictEqual(blocked.events.length, 0);
const states = create({ items: ITEMS, loading: true, error: true });
assert.strictEqual(states.instance.data.stateType, 'error');
states.instance.onRetry();
assert.deepStrictEqual(states.events.map((event) => event.name), ['retry']);
assert.strictEqual(states.events[0].detail.errorText, '加载失败，请重试');
states.instance.data.disabled = true;
states.instance.onRetry();
assert.strictEqual(states.events.length, 1);
const reduced = create({ items: ITEMS, reduceMotion: true });
assert.strictEqual(reduced.instance.data.motionDuration, 1);

const wxml = fs.readFileSync(path.join(root, 'collapse/collapse.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'collapse/collapse.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'collapse/collapse.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/COLLAPSE.md'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert(wxml.includes('<collapse-panel'));
assert(wxml.includes('<pui-loading'));
assert(wxml.includes('<pui-empty'));
assert(!wxml.includes('bind:action="onRetry"'), 'Empty no longer publishes an action event');
assert(wxml.includes('<pui-button wx:if="{{retryText}}"'));
assert(wxml.includes('bind:click="onRetry"'));
assert(wxml.includes('max-height: {{item.expanded ? item.contentHeight : 0}}px'));
assert(!/<slot\b/.test(wxml), 'Collapse publishes no Slots');
assert(!/<button\b/.test(wxml), 'Collapse trigger stays the component-owned view root');
assert(!/display\s*:\s*none|height\s*:\s*auto|max-height\s*:\s*none/.test(wxss));
assert(!/text-overflow\s*:\s*ellipsis/.test(wxss), 'Collapse key text must remain complete');
assert.strictEqual(json.componentGenerics['collapse-panel'].default, '../cell/cell');
assert.strictEqual(json.usingComponents['pui-loading'], '../loading/loading');
assert.deepStrictEqual(metadata.apiProps.collapse, PROPS);
assert.deepStrictEqual(metadata.apiEvents.collapse.map((item) => item.name), EVENTS);
assert.strictEqual((metadata.apiSlots.collapse || []).length, 0);
assert.strictEqual((metadata.apiMethods.collapse || []).length, 0);

const previewStart = preview.indexOf('function collapseValueIsScalar(value)');
const previewEnd = preview.indexOf('function listItemsFromProps(props)', previewStart);
const previewSource = preview.slice(previewStart, previewEnd);
for (const title of ['基础用法', '多开与互斥', '卡片与 Generic', '加载、空与错误']) assert(previewSource.includes(`<h3>${title}</h3>`));
assert(previewSource.includes('collapseValueKey'));
assert(previewSource.includes("loadingComponent({ size: 'small'"));
assert(previewSource.includes('emptySample({ embedded: true'));
assert(previewSource.includes('cellSample({ title: item.label'));
assert(!/String\(entry\.value\) === String|input \/ change \/|collapse-header|collapse-footer/.test(previewSource));
const usageStart = preview.indexOf("if (runtimeId === 'collapse')");
const usageEnd = preview.indexOf('\n  if (runtimeId ===', usageStart + 1);
const usageSource = preview.slice(usageStart, usageEnd);
assert(usageSource.includes('<pui-collapse items="{{sections}}"${generic}${collapseAttrs'));
assert(!/bind:/.test(usageSource), 'Collapse basic copied WXML must contain zero binds');
assert(previewStyles.includes('.pui-collapse-preview.is-card'));
assert(previewStyles.includes('@media (prefers-reduced-motion: reduce)'));
assert(!previewStyles.includes('.pui-collapse-preview__event'));
assert(!previewStyles.includes('.pui-collapse-demo--primary'));

assert(api.includes('当前公开合同固定为') === false || contract.includes('当前公开合同固定为 17 Props、2 Events、0 Slots'));
assert(api.includes('`collapse-panel` Generic'));
assert(api.includes('不公开业务实例方法'));
assert(compatibility.includes('固定 500ms/1ms 合同'));
assert(contract.includes('TDesign 1.15.3'));
assert(exampleWxml.includes('bind:change="onCollapseChange"'));
assert(!/bind:(?:input|open|close)="onCollapse/.test(exampleWxml));
assert(!/onCollapse(?:Input|Open|Close): function/.test(exampleJs));

for (const extension of ['js', 'json', 'wxml', 'wxss']) {
  assert.strictEqual(
    fs.readFileSync(path.join(root, `collapse/collapse.${extension}`), 'utf8'),
    fs.readFileSync(path.join(root, `miniprogram_dist/collapse/collapse.${extension}`), 'utf8'),
    `collapse source/dist ${extension} must stay identical`,
  );
}

console.log('Collapse contract tests passed.');
