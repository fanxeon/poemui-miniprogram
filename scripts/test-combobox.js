const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'combobox/combobox.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, { console, isFinite, require: () => ({}), Component: (value) => { definition = value; } }, { filename: 'combobox/combobox.js' });
assert(definition, 'Combobox component definition must be registered');

const OPTIONS = [
  { label: '前端框架', options: [{ label: 'Next.js', value: 'next', description: 'React 全栈框架', icon: 'layers' }, { label: 'Nuxt', value: 'nuxt', description: 'Vue 全栈框架', icon: 'command' }, { label: '禁用框架', value: 'disabled', disabled: true }] },
  { label: '原始值', options: [{ label: '数字零', value: 0 }, { label: '布尔假', value: false }, { label: '重复值应忽略', value: 0 }] },
];
function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = { data: Object.assign({}, definition.data, defaults, overrides || {}), getColorSchemeClass() { return 'pui-theme-light'; }, setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); }, triggerEvent(name, detail) { events.push({ name, detail }); } };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  instance.syncState(true);
  return { instance, events };
}

assert.strictEqual(Object.keys(definition.properties).length, 35, 'Combobox publishes only selection and viewport Props');
['query', 'defaultQuery', 'filterable', 'searchPlaceholder', 'allowCreate', 'createText', 'showPanelClose', 'maxHeight'].forEach((key) => assert.ok(!definition.properties[key], `${key} must belong outside Combobox`));
assert.ok(definition.properties.listHeight, 'Combobox exposes fixed listHeight');

const defaults = create();
assert.strictEqual(defaults.instance.data.listViewportHeight, 480);
assert.strictEqual(defaults.instance.data.stateType, 'empty');
assert.strictEqual(defaults.instance.data.currentVisible, false);

const fixed = create({ options: OPTIONS, defaultVisible: true, listHeight: 10 });
assert.strictEqual(fixed.instance.data.listViewportHeight, 160, 'listHeight is clamped at the fixed viewport lower bound');
fixed.instance.data.options = OPTIONS.slice(0, 1);
fixed.instance.syncState();
assert.strictEqual(fixed.instance.data.listViewportHeight, 160, 'changing result count cannot change viewport height');
fixed.instance.data.listHeight = 999;
fixed.instance.syncState();
assert.strictEqual(fixed.instance.data.listViewportHeight, 800);

const normalized = create({ options: OPTIONS, defaultValue: false, defaultVisible: true });
assert.strictEqual(normalized.instance.data.normalizedOptions.length, 5);
assert.strictEqual(normalized.instance.data.currentValue, false);
assert.strictEqual(normalized.instance.data.optionItems[0].showGroupHeader, true);
assert.strictEqual(normalized.instance.data.optionItems[1].showGroupHeader, false);
assert.strictEqual(normalized.instance.data.optionItems[3].showGroupHeader, true);

const controlled = create({ options: OPTIONS, visible: false, value: 'next' });
controlled.instance.onTriggerTap();
assert.strictEqual(controlled.instance.data.currentVisible, false, 'controlled visible waits for parent write-back');
assert.deepStrictEqual(controlled.events.map((event) => event.name), ['click', 'visible-input', 'visible-change', 'open']);
assert.strictEqual(controlled.instance.requestOption(1), true);
assert.strictEqual(controlled.instance.data.currentValue, 'next', 'controlled selection waits for parent write-back');

const single = create({ options: OPTIONS, defaultVisible: true });
assert.strictEqual(single.instance.requestOption(0), true);
assert.strictEqual(single.instance.data.currentValue, 'next');
assert.strictEqual(single.instance.data.currentVisible, false);
assert.deepStrictEqual(single.events.map((event) => event.name), ['input', 'change', 'select', 'visible-input', 'visible-change', 'close']);

const multiple = create({ options: OPTIONS, multiple: true, defaultValue: ['next'], defaultVisible: true, maxSelected: 2 });
assert.strictEqual(multiple.instance.requestOption(1), true);
assert.deepStrictEqual(Array.from(multiple.instance.data.currentValue), ['next', 'nuxt']);
assert.strictEqual(multiple.instance.requestOption(3), false);
assert.strictEqual(multiple.events.at(-1).name, 'exceed');
assert.strictEqual(multiple.instance.requestOption(0), true);
assert.deepStrictEqual(Array.from(multiple.instance.data.currentValue), ['nuxt']);

const raw = create({ options: OPTIONS, multiple: true });
assert.strictEqual(raw.instance.select(false), true);
assert.strictEqual(raw.instance.select(0), true);
assert.deepStrictEqual(Array.from(raw.instance.data.currentValue), [false, 0]);
assert.strictEqual(raw.instance.clear(), true);
assert.deepStrictEqual(Array.from(raw.instance.data.currentValue), []);

const readonly = create({ options: OPTIONS, readonly: true });
readonly.instance.onTriggerTap();
assert.strictEqual(readonly.instance.data.currentVisible, true);
assert.strictEqual(readonly.instance.requestOption(0), false);
assert.strictEqual(readonly.instance.focus(), false, 'readonly focus cannot write a new visible state');
const disabled = create({ options: OPTIONS, disabled: true, error: true });
disabled.instance.open(); disabled.instance.select('next'); disabled.instance.retry();
assert.strictEqual(disabled.events.length, 0);

const after = create({ options: OPTIONS });
after.instance.open();
after.instance.onTransitionEnd({ detail: { propertyName: 'max-height' } });
assert.ok(!after.events.some((event) => event.name === 'after-open'));
after.instance.onTransitionEnd({ detail: { propertyName: 'height' } });
assert.strictEqual(after.events.at(-1).name, 'after-open');

const wxml = fs.readFileSync(path.join(root, 'combobox/combobox.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'combobox/combobox.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'combobox/combobox.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const componentApi = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/COMBOBOX.md'), 'utf8');
assert(wxml.includes('height: {{currentVisible ? listViewportHeight : 0}}rpx'));
assert(wxml.includes('style="height: {{listViewportHeight}}rpx;"'));
assert(wxml.includes('class="pui-combobox__list" scroll-y'));
assert(!wxml.includes('<pui-input'));
assert(!wxml.includes('onQuery'));
assert(!wxml.includes('onCreateTap'));
assert(!json.usingComponents['pui-input']);
assert(wxss.includes('transition-property: height, opacity, transform'));
assert(wxss.includes('--pui-combobox-option-inset-inline: var(--pui-panel-padding)'));
assert(wxss.includes('--pui-combobox-option-gap: var(--pui-content-gap)'));
assert(wxss.includes('padding: var(--pui-combobox-option-inset-block) var(--pui-combobox-option-inset-inline)'));
assert(wxml.includes('pui-combobox__option-icon'));
assert(wxml.includes('pui-combobox__option-check'));
assert(!wxss.includes('pui-combobox__search-row'));
assert(preview.includes('listHeight: Math.max(80, Math.min(800'));
assert(preview.includes('pui-combobox-preview__option-copy'));
assert(preview.includes('pui-combobox-preview__option-icon'));
assert(previewStyles.includes('--pui-combobox-preview-option-inset-inline: var(--pui-preview-panel-padding)'));
assert(previewStyles.includes('gap: var(--pui-combobox-preview-option-gap)'));
assert(!componentApi.includes('| `query`、`defaultQuery` |'));
assert(componentApi.includes('| `listHeight` |'));
assert(compatibility.includes('搜索不属于 Combobox'));
assert(contract.includes('`pui-search` 是独立搜索组件'));
console.log('combobox fixed viewport contract tests passed');
