const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'textarea/textarea.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component(value) { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'textarea/textarea.js' });
assert(definition, 'Textarea component definition must be registered');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--' + this.data.colorScheme; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback.call(this); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

assert.strictEqual(Object.keys(definition.properties).length, 30, 'Textarea publishes the reviewed 30 Props');
['autoHeight', 'minRows', 'maxRows', 'showCount', 'clearIcon', 'customLabel', 'customExtra', 'customFooter', 'loadingText', 'error', 'invalid', 'errorMessage', 'duration', 'easing'].forEach((name) => {
  assert(!Object.prototype.hasOwnProperty.call(definition.properties, name), `${name} must not return as a duplicate public Prop`);
});

const defaults = create();
assert.strictEqual(defaults.instance.data.innerValue, '');
assert.strictEqual(defaults.instance.data.interactive, true);
assert.strictEqual(defaults.instance.data.minRowsValue, 4);
assert.strictEqual(defaults.instance.data.maxRowsValue, 8);
assert.strictEqual(defaults.instance.data.autoHeightValue, false);
assert.strictEqual(defaults.instance.data.confirmTypeValue, 'done');
assert(defaults.instance.data.rootClass.includes('pui-textarea--medium'));
assert(defaults.instance.data.rootClass.includes('pui-textarea--default'));
assert(defaults.instance.data.rootStyle.includes('--pui-textarea-duration:500ms'));
assert(defaults.instance.data.rootStyle.includes('--pui-textarea-ease:var(--pui-ease-standard)'));

const uncontrolled = create({ value: null, defaultValue: 'PoemUI', name: 'releaseNote', clearable: true, indicator: true });
uncontrolled.instance.onInput({ detail: { value: 'PoemUI Next', cursor: 11 } });
assert.strictEqual(uncontrolled.instance.data.innerValue, 'PoemUI Next');
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change']);
assert.strictEqual(uncontrolled.events[0].detail.value, 'PoemUI Next');
assert.strictEqual(uncontrolled.events[0].detail.previousValue, 'PoemUI');
assert.strictEqual(uncontrolled.events[0].detail.controlled, false);
assert.strictEqual(uncontrolled.events[0].detail.name, 'releaseNote');
uncontrolled.instance.data.defaultValue = 'new default';
uncontrolled.instance.syncState();
assert.strictEqual(uncontrolled.instance.data.innerValue, 'PoemUI Next', 'defaultValue only initializes uncontrolled text');

const controlled = create({ value: 0, defaultValue: 'fallback', clearable: true });
assert.strictEqual(controlled.instance.data.innerValue, '0', 'numeric zero is controlled');
const controlledReturn = controlled.instance.onInput({ detail: { value: '12' } });
assert.strictEqual(controlledReturn, '0', 'controlled native textarea restores the rendered value');
assert.strictEqual(controlled.events[0].detail.value, '12');
controlled.instance.data.value = '';
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, '', 'empty string is controlled');
controlled.instance.data.value = false;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 'false', 'false is controlled');
controlled.instance.data.value = null;
controlled.instance.data.defaultValue = 'latest default';
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 'false', 'controlled to uncontrolled preserves the last rendered value');

const utf16Limited = create({ defaultValue: '', maxlength: 3 });
const utf16Return = utf16Limited.instance.onInput({ detail: { value: 'a😀b' } });
assert.strictEqual(utf16Limited.instance.data.innerValue, 'a😀');
assert.strictEqual(utf16Return, 'a😀');
assert.strictEqual(utf16Limited.events[0].detail.truncated, true);

const weighted = create({ defaultValue: '', maxcharacter: 5, indicator: true });
weighted.instance.onInput({ detail: { value: 'ab中😀z' } });
assert.strictEqual(weighted.instance.data.innerValue, 'ab中');
assert.strictEqual(weighted.instance.data.count, 4);
assert.strictEqual(weighted.instance.data.countMode, 'character');
assert.strictEqual(weighted.instance.data.limitValue, 5);
assert.strictEqual(weighted.instance.data.maxlengthValue, -1);

const doubleLimited = create({ defaultValue: '', maxlength: 2, maxcharacter: 5 });
doubleLimited.instance.onInput({ detail: { value: 'abc中😀' } });
assert.strictEqual(doubleLimited.instance.data.innerValue, 'abc中', 'maxcharacter wins instead of applying both limits');
assert.strictEqual(doubleLimited.events[0].detail.limit, 5);

const clear = create({ defaultValue: 'clear me', clearable: true });
clear.instance.onClear();
assert.strictEqual(clear.instance.data.innerValue, '');
assert.deepStrictEqual(clear.events.map((event) => event.name), ['clear', 'change']);
assert.strictEqual(clear.events[0].detail.previousValue, 'clear me');
assert.strictEqual(clear.instance.clear(), false, 'empty clear does not publish fake events');

const controlledClear = create({ value: 'locked', defaultValue: 'fallback', clearable: true });
const controlledClearDetail = controlledClear.instance.clear();
assert.strictEqual(controlledClear.instance.data.innerValue, 'locked');
assert.strictEqual(controlledClearDetail.value, '');
assert.deepStrictEqual(controlledClear.events.map((event) => event.name), ['clear', 'change']);

['disabled', 'readonly', 'loading'].forEach((state) => {
  const locked = create({ [state]: true, defaultValue: 'locked', clearable: true });
  assert.strictEqual(locked.instance.data.interactive, false, `${state} blocks writes`);
  assert.strictEqual(locked.instance.onInput({ detail: { value: 'blocked' } }), 'locked');
  locked.instance.onClear();
  locked.instance.onFocus({ detail: {} });
  locked.instance.onConfirm({ detail: { value: 'blocked' } });
  assert.strictEqual(locked.instance.focus(), false);
  assert.strictEqual(locked.instance.getValue(), 'locked');
  assert.strictEqual(locked.events.length, 0);
});

const focus = create({ defaultValue: 'focus value' });
assert.strictEqual(focus.instance.focus(), true);
focus.instance.onFocus({ detail: { height: 240 } });
focus.instance.onConfirm({ detail: { value: 'confirmed', cursor: 9 } });
focus.instance.onLineChange({ detail: { lineCount: 2, height: 84, heightRpx: 168 } });
focus.instance.onKeyboardHeightChange({ detail: { height: 320, duration: 220 } });
focus.instance.onBlur({ detail: { value: 'focus value' } });
assert.deepStrictEqual(focus.events.map((event) => event.name), ['focus', 'enter', 'line-change', 'keyboardheightchange', 'blur']);
assert.strictEqual(focus.events[1].detail.source, 'enter');
assert.strictEqual(focus.events[2].detail.lineCount, 2);
assert.strictEqual(focus.events[3].detail.height, 320);
assert.strictEqual(focus.instance.blur(), true);

const nativeFocus = create({ defaultValue: 'native focus value' });
assert.strictEqual(nativeFocus.instance.data.inputFocus, false);
nativeFocus.instance.onFocus({ detail: { height: 240 } });
assert.strictEqual(nativeFocus.instance.data.focused, true);
assert.strictEqual(nativeFocus.instance.data.inputFocus, true, 'manual native focus must remain bound until an actual blur');
nativeFocus.instance.onBlur({ detail: { value: 'native focus value' } });
assert.strictEqual(nativeFocus.instance.data.inputFocus, false, 'actual native blur releases the focus binding');

const autosize = create({ autosize: { minRows: 3, maxRows: 6 }, size: 'large' });
assert.strictEqual(autosize.instance.data.autoHeightValue, true);
assert.strictEqual(autosize.instance.data.minRowsValue, 3);
assert.strictEqual(autosize.instance.data.maxRowsValue, 6);
assert(autosize.instance.data.controlStyle.includes('min-height:144rpx'));
assert(!autosize.instance.data.controlStyle.includes(';height:'));

const autosizeBoundary = create({ autosize: { minRows: 30, maxRows: 0 }, size: 'unknown' });
assert.strictEqual(autosizeBoundary.instance.data.minRowsValue, 20);
assert.strictEqual(autosizeBoundary.instance.data.maxRowsValue, 20);
assert(autosizeBoundary.instance.data.rootClass.includes('pui-textarea--medium'));

const states = create({ status: 'warning', tips: '注意长度', indicator: true });
assert.strictEqual(states.instance.data.statusValue, 'warning');
assert.strictEqual(states.instance.data.statusIcon, 'warning-triangle');
assert.strictEqual(states.instance.data.showIndicator, true);
assert.strictEqual(states.instance.data.hasFeedback, true);
states.instance.data.status = 'error';
states.instance.data.tips = 'slot';
states.instance.syncState();
assert.strictEqual(states.instance.data.statusValue, 'error');
assert.strictEqual(states.instance.data.tipsText, '');
assert.strictEqual(states.instance.data.hasFeedback, true);

const boundaries = create({ maxlength: 99999, maxcharacter: 99999, confirmType: 'unsupported', status: 'unsupported' });
assert.strictEqual(boundaries.instance.data.limitValue, 20000);
assert.strictEqual(boundaries.instance.data.confirmTypeValue, 'done');
assert.strictEqual(boundaries.instance.data.statusValue, 'default');
boundaries.instance.data.reduceMotion = true;
boundaries.instance.syncState();
assert(boundaries.instance.data.rootStyle.includes('--pui-textarea-duration:1ms'));
assert(boundaries.instance.data.rootClass.includes('pui-textarea--reduced-motion'));

['setValue', 'reset', 'getState'].forEach((name) => assert.strictEqual(typeof defaults.instance[name], 'undefined', `${name} must stay out of the public method contract`));

const wxml = fs.readFileSync(path.join(root, 'textarea/textarea.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'textarea/textarea.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'textarea/textarea.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contractPath = path.join(root, 'docs/components/TEXTAREA.md');
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');

assert.strictEqual((wxml.match(/<textarea\b/g) || []).length, 1, 'Textarea owns one native platform root');
assert(!/<button\b/.test(wxml), 'Textarea composes PUI Button');
['pui-button', 'pui-icon', 'pui-loading'].forEach((name) => assert(json.usingComponents[name], `${name} is declared`));
['name="label"', 'name="tips"', 'name="extra"'].forEach((slot) => assert(wxml.includes(slot), `Textarea exposes ${slot}`));
['name="footer"', 'name="extra" class="pui-textarea__extra"'].forEach((slot) => assert(!wxml.includes(slot), `${slot} legacy structure is removed`));
['show-confirm-bar="{{showConfirmBar}}"', 'cursor-spacing="{{cursorSpacing}}"', 'selection-start="{{selectionStart}}"', 'selection-end="{{selectionEnd}}"', 'adjust-position="{{adjustPosition}}"', 'hold-keyboard="{{holdKeyboard}}"', 'confirm-hold="{{confirmHold}}"', 'disable-default-padding="{{disableDefaultPadding}}"'].forEach((attr) => assert(wxml.includes(attr), `Textarea maps ${attr}`));
assert(wxml.includes('aria-disabled="{{disabled || loading}}"'));
assert(!/\.pui-textarea__clear[^}]*\{[^}]*(?:width|height|padding|border-radius)\s*:[^;}]*!important/s.test(wxss), 'Textarea does not override PUI Button geometry');
assert(wxss.includes('grid-template-rows: 0fr'));
assert(wxss.includes('grid-template-rows: 1fr'));
assert(!/height\s*:\s*auto[^;]*transition/.test(wxss));
assert(!/\.pui-textarea__feedback-shell[^}]*display\s*:\s*none/s.test(wxss));
assert.strictEqual(metadata.apiProps.textarea.length, 30);
assert.strictEqual(metadata.apiEvents.textarea.length, 7);
assert.strictEqual(metadata.apiSlots.textarea.length, 3);
assert.strictEqual(metadata.apiMethods.textarea.length, 4);
assert(preview.includes('function textareaPreviewSnapshot(props, demo)'));
assert(previewStyles.includes('--pui-textarea-preview-duration'));
assert(preview.includes("${!snapshot.interactive ? ' disabled' : ''}${props.readonly ? ' readonly' : ''}"), 'H5 mirrors the WeChat readonly platform boundary');
assert(preview.includes("control.focus({ preventScroll: true })"), 'focus Prop performs a real H5 focus action');
assert(preview.includes('const stateClasses = ['), 'H5 composes status, lock and focus classes instead of discarding status');
assert(!preview.includes('bind:input="onTextareaInput"'), 'generated basic WXML omits event bindings');
assert(!preview.includes('bind:reset="onTextareaReset"'), 'generated WXML omits removed reset event');
assert(!preview.includes('value 非 null 时 input/change/clear/reset/setValue'), 'H5 compatibility uses the current controlled contract');
assert(preview.includes('清空固定为 clear → change'), 'H5 compatibility documents the current event order');
assert(api.includes('## Textarea'));
assert(api.includes('| `Textarea` | 30 Props：'), 'Textarea summary table uses the current contract');
assert(compatibility.includes('Textarea'));
assert(fs.existsSync(contractPath), 'Textarea semantic contract exists');
assert(changelog.includes('Textarea'));
assert(exampleWxml.includes('id="deliveryTextarea"'));
assert(exampleWxml.includes('bind:change="onTextareaChange"'));
assert(exampleWxml.includes('bind:enter="onTextareaEnter"'));
assert(exampleJs.includes('onTextareaChange: function onTextareaChange'));
assert(!exampleJs.includes("component.setValue('"), 'example does not teach removed setValue');

console.log('Textarea contract tests passed.');
