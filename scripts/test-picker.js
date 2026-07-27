const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'picker/picker.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  console,
  isFinite,
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: 'picker/picker.js' });
assert(definition, 'Picker component definition must be registered');

const PROPS = [
  'columns', 'value', 'defaultValue', 'visible', 'defaultVisible', 'title', 'type', 'cancelText', 'confirmText', 'showHeader', 'usePopup',
  'closeOnOverlayClick', 'autoClose', 'keys', 'visibleItemCount', 'itemHeight', 'disabled', 'readonly', 'loading', 'loadingText',
  'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion',
];
const EVENTS = ['visible-change', 'open', 'pick', 'confirm', 'change', 'cancel', 'close', 'retry'];
const METHODS = ['open()', 'close(source?)', 'confirm(source?)', 'cancel(source?)', 'reset()', 'getValue()'];

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : ''; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail: plain(detail) }); },
  };
  Object.assign(instance, definition.methods);
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

function cascadeColumns() {
  return [
    { label: '基础组件', value: 'basic', children: [
      { label: 'Button', value: 'button' },
      { label: 'Icon', value: 0, icon: 'spark' },
    ] },
    { label: '数据录入', value: 'input', children: [
      { label: 'Input', value: 'input' },
      { label: 'Picker', value: false },
      { label: '停用项', value: '', disabled: true },
    ] },
  ];
}

assert.deepStrictEqual(Object.keys(definition.properties), PROPS, 'Picker publishes the exact 26-Prop contract');

const empty = create();
assert.strictEqual(empty.instance.data.stateType, 'empty');
assert.strictEqual(empty.instance.data.currentVisible, false);
assert.strictEqual(empty.instance.data.pickerBlocked, true);
assert(empty.instance.data.rootClass.includes('pui-picker--popup'));
assert(empty.instance.data.rootClass.includes('pui-picker--empty'));
assert(empty.instance.data.rootClass.includes('pui-picker--default'));
assert.strictEqual(empty.instance.data.pickerType, 'default');
assert.strictEqual(empty.instance.data.showClassicFooter, false);
assert(empty.instance.data.rootStyle.includes('--pui-picker-duration:500ms'));

const cascade = create({ columns: cascadeColumns(), defaultValue: ['basic', 0], title: '选择组件' });
assert.deepStrictEqual(plain(cascade.instance.data.selectedValue), ['basic', 0]);
assert.deepStrictEqual(plain(cascade.instance.data.selectedLabel), ['基础组件', 'Icon']);
assert.strictEqual(cascade.instance.data.mode, 'cascade');
assert.strictEqual(cascade.instance.data.stateType, 'content');
assert.strictEqual(cascade.instance.open(), true);
assert.deepStrictEqual(cascade.events.map((event) => event.name), ['visible-change', 'open']);
assert.strictEqual(cascade.instance.onPickerChange({ detail: { value: [1, 0] } }), true);
assert.deepStrictEqual(plain(cascade.instance.data.draftValue), ['input', 'input']);
assert.strictEqual(cascade.events.at(-1).name, 'pick');
assert.strictEqual(cascade.events.at(-1).detail.column, 0);
assert.strictEqual(cascade.instance.onPickerChange({ detail: { value: [1, 1] } }), true);
assert.deepStrictEqual(plain(cascade.instance.data.draftValue), ['input', false], 'boolean false remains a strict option value');
assert.strictEqual(cascade.instance.confirm(), true);
assert.deepStrictEqual(plain(cascade.instance.getValue()), ['input', false]);
assert.deepStrictEqual(cascade.events.map((event) => event.name), ['visible-change', 'open', 'pick', 'pick', 'confirm', 'change', 'visible-change', 'close']);
assert.strictEqual(cascade.events[4].detail.controlled, false);
assert.strictEqual(cascade.events[5].detail.value[1], false);

cascade.events.length = 0;
assert.strictEqual(cascade.instance.open(), true);
assert.strictEqual(cascade.instance.onPickerChange({ detail: { value: [0, 0] } }), true);
assert.deepStrictEqual(plain(cascade.instance.data.draftValue), ['basic', 'button']);
assert.strictEqual(cascade.instance.cancel(), true);
assert.deepStrictEqual(plain(cascade.instance.getValue()), ['input', false], 'cancel discards the draft without changing committed value');
assert.deepStrictEqual(cascade.events.map((event) => event.name), ['visible-change', 'open', 'pick', 'cancel', 'visible-change', 'close']);

const matrix = create({
  columns: [
    [{ label: '数字零', value: 0 }, { label: '布尔假', value: false }, { label: '空字符串', value: '' }],
    [{ label: 'A', value: 'a' }, { label: '停用', value: 'disabled', disabled: true }],
  ],
  defaultValue: [0, 'a'],
  defaultVisible: true,
});
assert.strictEqual(matrix.instance.data.mode, 'multiple');
assert.strictEqual(matrix.instance.onPickerChange({ detail: { value: [1, 1] } }), true);
assert.deepStrictEqual(plain(matrix.instance.data.draftValue), [false, 'a'], 'disabled target snaps to the nearest enabled option');
matrix.instance.onPickerChange({ detail: { value: [2, 0] } });
assert.deepStrictEqual(plain(matrix.instance.data.draftValue), ['', 'a'], 'empty string remains selectable and distinct from false/zero');

const controlled = create({ columns: cascadeColumns(), value: ['basic', 0], visible: false });
assert.strictEqual(controlled.instance.open(), true);
assert.strictEqual(controlled.instance.data.currentVisible, false, 'controlled visible waits for parent write-back');
assert.deepStrictEqual(controlled.events.map((event) => event.name), ['visible-change', 'open']);
controlled.instance.data.visible = true;
controlled.instance.syncState();
controlled.events.length = 0;
controlled.instance.onPickerChange({ detail: { value: [0, 0] } });
controlled.instance.confirm('method');
assert.deepStrictEqual(plain(controlled.instance.data.selectedValue), ['basic', 0], 'controlled value does not mutate before parent write-back');
assert.deepStrictEqual(controlled.events.map((event) => event.name), ['pick', 'confirm', 'change', 'visible-change', 'close']);
assert.strictEqual(controlled.events[1].detail.controlled, true);
assert.deepStrictEqual(controlled.events[2].detail.value, ['basic', 'button']);
assert.strictEqual(controlled.instance.data.currentVisible, true, 'controlled close also waits for parent write-back');

const noChange = create({ columns: cascadeColumns(), defaultValue: ['basic', 0], defaultVisible: true });
assert.strictEqual(noChange.instance.confirm(), true);
assert.deepStrictEqual(noChange.events.map((event) => event.name), ['confirm', 'visible-change', 'close'], 'confirm reports the action but omits duplicate change');

const inline = create({ columns: cascadeColumns(), defaultValue: ['basic', 0], usePopup: false, defaultVisible: false });
assert.strictEqual(inline.instance.data.currentVisible, true);
assert(inline.instance.data.rootClass.includes('pui-picker--inline'));
assert.strictEqual(inline.instance.open(), false);
assert.strictEqual(inline.instance.close(), false);

const classic = create({ columns: cascadeColumns(), defaultValue: ['basic', 0], type: 'classic' });
assert.strictEqual(classic.instance.data.pickerType, 'classic');
assert(classic.instance.data.rootClass.includes('pui-picker--classic'));
assert.strictEqual(classic.instance.data.showClassicFooter, true, 'classic Popup keeps the bottom action row');
const unknownType = create({ columns: cascadeColumns(), defaultValue: ['basic', 0], type: 'legacy' });
assert.strictEqual(unknownType.instance.data.pickerType, 'default', 'unsupported types safely resolve to the default Header action layout');
assert.strictEqual(unknownType.instance.data.showClassicFooter, false);

['disabled', 'readonly'].forEach((state) => {
  const blocked = create({ columns: cascadeColumns(), defaultValue: ['basic', 0], [state]: true });
  assert.strictEqual(blocked.instance.data.pickerBlocked, true);
  assert.strictEqual(blocked.instance.open(), false);
  assert.strictEqual(blocked.instance.onPickerChange({ detail: { value: [1, 0] } }), false);
  assert.strictEqual(blocked.instance.confirm(), false);
  assert.strictEqual(blocked.instance.reset(), false);
  assert.strictEqual(blocked.events.length, 0);
});

const loading = create({ columns: cascadeColumns(), defaultValue: ['basic', 0], loading: true });
assert.strictEqual(loading.instance.data.pickerBlocked, true);
assert.strictEqual(loading.instance.open(), true, 'loading can be opened to present the real state');
assert.strictEqual(loading.instance.onPickerChange({ detail: { value: [1, 0] } }), false);
assert.strictEqual(loading.instance.confirm(), false);
assert.strictEqual(loading.instance.reset(), false);
assert.deepStrictEqual(loading.events.map((event) => event.name), ['visible-change', 'open']);

const error = create({ columns: cascadeColumns(), error: true, loading: true, retryText: '重新加载' });
assert.strictEqual(error.instance.data.stateType, 'error', 'error takes priority over loading/content');
assert.strictEqual(error.instance.data.showRetry, true);
assert.strictEqual(error.instance.retry(), true);
assert.deepStrictEqual(error.events, [{ name: 'retry', detail: { source: 'button' } }]);
assert.strictEqual(error.instance.data.error, true, 'retry does not fabricate a successful reload');

const normalized = create({ columns: cascadeColumns(), visibleItemCount: 6, itemHeight: 999, reduceMotion: true, colorScheme: 'dark' });
assert.strictEqual(normalized.instance.data.viewportHeight, 112 * 7);
assert.strictEqual(normalized.instance.data.itemHeightValue, 112);
assert(normalized.instance.data.rootClass.includes('pui-theme--dark'));
assert(normalized.instance.data.rootClass.includes('pui-picker--reduced'));
assert(normalized.instance.data.rootStyle.includes('--pui-picker-duration:1ms'));

const reset = create({ columns: cascadeColumns(), value: ['input', false], defaultValue: ['basic', 0] });
assert.deepStrictEqual(plain(reset.instance.reset()), ['basic', 0]);
assert.deepStrictEqual(plain(reset.instance.getValue()), ['input', false], 'controlled reset only requests parent write-back');
assert.deepStrictEqual(reset.events.map((event) => event.name), ['change']);
assert.strictEqual(reset.events[0].detail.source, 'reset');

const wxml = fs.readFileSync(path.join(root, 'picker/picker.wxml'), 'utf8');
const template = fs.readFileSync(path.join(root, 'picker/template.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'picker/picker.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'picker/picker.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/PICKER.md'), 'utf8');
const example = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert(wxml.includes('<pui-popup'));
assert(wxml.includes('show-header="{{showHeader}}"'), 'Popup mode forwards Picker showHeader so cancel and confirm remain reachable');
assert(wxml.includes('title="{{title}}"'), 'Popup mode forwards the Picker title into the shared Popup Header');
assert(wxml.includes('show-footer="{{showClassicFooter}}"'), 'only classic Popup mode exposes the shared Popup Footer');
assert(wxml.includes('slot="header-left"'), 'default Popup mode puts confirm in the shared Popup Header left slot');
assert(wxml.includes('slot="close-btn"'), 'default Popup mode puts cancel in the shared Popup Header right slot');
assert(wxml.includes('theme="primary"') && wxml.includes('variant="base"') && wxml.includes('shape="circle"') && wxml.includes('icon="check"') && wxml.includes('icon-only'), 'default Header confirm uses the primary circular Check PUI IconButton');
assert(wxml.includes('theme="default"') && wxml.includes('icon="close"'), 'default Header cancel uses the default circular Close PUI IconButton');
assert(wxml.includes('wx:if="{{showClassicFooter}}" slot="footer" class="pui-picker__actions"'), 'classic Popup actions render in the shared Popup Footer');
assert(wxml.includes("pickerType === 'default'"), 'Picker template switches Header actions from the normalized type state');
assert(wxml.includes('duration="{{reduceMotion ? 1 : 500}}"'), 'Picker and Popup share the 500ms/1ms motion contract');
assert(!template.includes('slot="header"'), 'Picker must not target the removed Popup header slot');
assert(template.includes('<picker-view'));
assert(template.includes('<picker-view-column'));
assert(template.includes('mask-style="background:transparent;"'), 'Picker must disable the native fixed-light mask in dark mode');
assert(template.includes("draftIndexes[columnIndex] === optionIndex ? 'pui-picker__item--selected'"), 'Picker renders an explicit cross-theme selected option state');
assert(template.includes('class="pui-picker__item-text"'), 'Picker item label keeps a semantic class instead of relying on an unsupported WXSS tag selector');
assert(wxss.includes('.pui-picker__item-text'), 'Picker item label overflow styling uses the semantic class');
assert(!wxss.includes('.pui-picker__item text'), 'Picker avoids unsupported WXSS tag selectors');
assert(wxml.includes('<pui-button'));
assert(template.includes('<pui-icon'));
assert(template.includes('<pui-loading'));
assert(template.includes('<pui-empty'));
assert(!/<(?:button|input|select|textarea)\b/.test(`${wxml}\n${template}`), 'Picker composes PUI controls around its native picker-view root');
assert.deepStrictEqual(Object.keys(json.usingComponents).sort(), ['pui-button', 'pui-empty', 'pui-icon', 'pui-loading', 'pui-popup']);
assert(!/display\s*:\s*none|height\s*:\s*auto/.test(wxss));
assert(wxss.includes('var(--pui-picker-duration)'));

assert.deepStrictEqual(metadata.apiProps.picker, PROPS);
assert.strictEqual(metadata.details.picker.props.find((prop) => prop.key === 'defaultVisible').value, false);
assert.deepStrictEqual(metadata.details.picker.props.find((prop) => prop.key === 'type').options, ['default', 'classic']);
assert.deepStrictEqual(metadata.apiEvents.picker.map((item) => item.name), EVENTS);
assert.strictEqual(metadata.apiSlots.picker, undefined);
assert.deepStrictEqual(metadata.apiMethods.picker.map((item) => item.name), METHODS);
assert.strictEqual(metadata.apiPropGroups.picker.length, 4);

['基础用法', '多列与级联', '状态与反馈', '内联模式'].forEach((title) => assert(preview.includes(`<h3>${title}</h3>`)));
assert(preview.includes('function pickerH5Select'));
assert(preview.includes("const pickerType = props.type === 'classic' ? 'classic' : 'default';"));
assert(preview.includes('pui-picker-h5__panel--${pickerType}'));
assert(preview.includes("iconButtonSample({ theme: 'primary', variant: 'base', shape: 'circle', size: 'small', icon: 'check'"), 'H5 default Header confirm uses the shared primary Check IconButton');
assert(preview.includes("iconButtonSample({ theme: 'default', variant: 'base', shape: 'circle', size: 'small', icon: 'close'"), 'H5 default Header cancel uses the shared default Close IconButton');
assert(preview.includes("title: '选择组件', type: 'default', cancelText: '取消'"), 'H5 Picker runtime defaults expose the public type');
assert(preview.includes("type: { type: 'select', value: 'default', options: ['default', 'classic'] }"), 'H5 Props workspace exposes the same type enum');
const pickerRuntimeBlock = preview.slice(preview.indexOf('function bindPickerPreviewRuntime'), preview.indexOf('const dateTimePreviewDateUnits'));
assert(pickerRuntimeBlock.includes("onStep(pointer.index - Math.round(distance / itemHeight), 'drag')"), 'Picker Pointer release reports its own drag source');
assert(preview.includes("type === 'picker-retry'"));
assert(preview.includes("demo.pickerPhase = popupVisible ? 'entering' : 'leaving'"));
assert(preview.includes('state.previewPickerTimers[previewId] = setTimeout'));
assert(preview.includes("snapshot.phase === 'entered' ? 'is-open' : ''"));
assert(!preview.includes("action === 'picker-select'"));
const showcaseBlock = preview.slice(preview.indexOf('function pickerShowcase'), preview.indexOf('function bindPickerPreviewRuntime'));
assert(!/<select\b/.test(showcaseBlock), 'Picker H5 no longer falls back to a native select');
const usageBlock = preview.slice(preview.indexOf("if (runtimeId === 'picker')"), preview.indexOf("if (runtimeId === 'button')"));
assert(usageBlock.includes('columns="{{pickerColumns}}"'));
assert(!usageBlock.includes('bind:'), 'Picker basic usage contains zero event bindings');
assert(previewStyles.includes('.pui-picker-h5__layer.is-open'));
assert(previewStyles.includes('.pui-picker-h5__layer.is-entering'));
assert(previewStyles.includes('.pui-picker-h5__layer.is-leaving'));
assert(previewStyles.includes('@keyframes pui-picker-panel-enter'));
assert(previewStyles.includes('@keyframes pui-picker-panel-leave'));
assert(previewStyles.includes('background: var(--preview-surface, var(--surface-solid))'));
assert(previewStyles.includes('box-shadow: var(--preview-shadow-card, none)'));
assert(previewStyles.includes('backdrop-filter: var(--preview-blur, none)'));
assert(previewStyles.includes('.pui-picker-h5__wheel.is-dragging'));
assert(previewStyles.includes('.pui-picker-h5__header--popup'));
assert(previewStyles.includes('.pui-picker-h5__header--popup.is-header-actions'));
assert(previewStyles.includes('.pui-picker-h5__header--popup.is-header-actions { grid-template-columns: 36px minmax(0, 1fr) 36px; }'), 'H5 default Header retains Popup-equivalent three-track icon geometry');
assert(previewStyles.includes('.pui-picker-h5__footer'));
assert(previewStyles.includes('.element-inspector-mount.preview-code-mount'));

assert(api.includes('## Picker'));
assert(api.includes('26 Props / 8 Events / 0 Slots / 6 Methods') || contract.includes('26 Props / 8 Events / 0 Slots / 6 Methods'));
assert(api.includes("| `type` | `'default' \\| 'classic'` | `'default'` | `default`、`classic` |"), 'Picker API documents the default/classic presentation API');
assert(api.includes('confirm → change（值变化时）→ visible-change → close'));
assert(compatibility.includes('Picker 的 H5 镜像必须与原生共享 26 Props'));
assert(contract.includes('禁止恢复旧 `options + 单个标量 value + 原生 <picker>`'));
assert(contract.includes('`type` 只接受 `default | classic`'));
assert(example.includes('id="deliveryPicker"'));
assert(example.includes('bind:visible-change="onDeliveryPickerVisibleChange"'));

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = fs.readFileSync(path.join(root, `picker/picker.${extension}`));
  const distFile = fs.readFileSync(path.join(root, `miniprogram_dist/picker/picker.${extension}`));
  assert(sourceFile.equals(distFile), `source and miniprogram_dist picker.${extension} must match`);
});
assert(fs.readFileSync(path.join(root, 'picker/template.wxml')).equals(fs.readFileSync(path.join(root, 'miniprogram_dist/picker/template.wxml'))));

process.stdout.write('Picker contract tests passed.\n');
