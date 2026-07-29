const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'input/input.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component(value) { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'input/input.js' });
assert(definition, 'Input component definition must be registered');

const PROPS = [
  'value', 'defaultValue', 'name', 'label', 'placeholder', 'type', 'maxlength', 'maxcharacter',
  'size', 'align', 'bordered', 'clearable', 'clearTrigger', 'prefix', 'prefixIcon', 'suffix', 'suffixIcon',
  'disabled', 'readonly', 'loading', 'focus', 'confirmType', 'status', 'tips', 'required',
  'cursorSpacing', 'adjustPosition', 'holdKeyboard', 'confirmHold', 'ariaLabel', 'reduceMotion',
];

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

assert.deepStrictEqual(Object.keys(definition.properties), PROPS, 'Input publishes the exact 31-Prop contract');
['password:', 'error:', 'invalid:', 'errorMessage:', 'customLabel:', 'customPrefix:', 'customSuffix:', 'customExtra:', 'setValue:'].forEach((removed) => {
  assert(!source.includes(removed), `Input keeps removed API out: ${removed}`);
});
assert.deepStrictEqual(Object.keys(definition.methods), ['isControlled', 'limits', 'syncState', 'valueDetail', 'requestValue', 'requestClear', 'onInput', 'onClear', 'onFocus', 'onBlur', 'onConfirm', 'focus', 'blur', 'clear', 'getValue']);

const defaults = create();
assert.strictEqual(defaults.instance.data.innerValue, '');
assert.strictEqual(defaults.instance.data.inputType, 'text');
assert.strictEqual(defaults.instance.data.inputPassword, false);
assert.strictEqual(defaults.instance.data.confirmTypeValue, 'done');
assert.strictEqual(defaults.instance.data.nativeMaxlength, -1);
assert.strictEqual(defaults.instance.data.interactive, true);
assert.strictEqual(defaults.instance.data.normalizedClearTrigger, 'focus');
assert.strictEqual(defaults.instance.data.showClear, false);
assert(defaults.instance.data.rootClass.includes('pui-input--medium'));
assert(defaults.instance.data.rootClass.includes('pui-input--status-default'));
assert(defaults.instance.data.rootStyle.includes('--pui-input-duration:500ms'));
assert(defaults.instance.data.rootStyle.includes('--pui-input-ease:var(--pui-ease-standard)'));

const uncontrolled = create({ value: null, defaultValue: 'PoemUI', name: 'componentName' });
uncontrolled.instance.onInput({ detail: { value: 'PoemUI Next', cursor: 11, keyCode: 84 } });
assert.strictEqual(uncontrolled.instance.data.innerValue, 'PoemUI Next');
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change']);
assert.deepStrictEqual(JSON.parse(JSON.stringify(uncontrolled.events[0].detail)), {
  value: 'PoemUI Next', previousValue: 'PoemUI', source: 'input', controlled: false, name: 'componentName', cursor: 11, keyCode: 84,
});
uncontrolled.instance.data.defaultValue = 'New default';
uncontrolled.instance.syncState();
assert.strictEqual(uncontrolled.instance.data.innerValue, 'PoemUI Next', 'defaultValue never overwrites initialized uncontrolled input');

const controlled = create({ value: 0, defaultValue: 'fallback' });
assert.strictEqual(controlled.instance.data.innerValue, '0', 'numeric zero is a legal controlled value');
controlled.instance.onInput({ detail: { value: '12' } });
assert.strictEqual(controlled.instance.data.innerValue, '0', 'controlled input waits for parent write-back');
assert.strictEqual(controlled.events[0].detail.controlled, true);
controlled.instance.data.value = false;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 'false', 'false is preserved instead of treated as missing');
controlled.instance.data.value = '';
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, '', 'empty string is a legal controlled value');
controlled.instance.data.value = 'parent latest';
controlled.instance.syncState();
controlled.instance.data.value = null;
controlled.instance.data.defaultValue = 'new fallback';
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.innerValue, 'parent latest', 'controlled-to-uncontrolled preserves the latest rendered controlled value');

const clear = create({ value: null, defaultValue: 'clear me', clearable: true });
assert.strictEqual(clear.instance.data.hasClear, true, 'a non-empty clearable Input reserves the clear action track before focus');
assert.strictEqual(clear.instance.data.showClear, false, 'default clear trigger hides the action before native focus');
clear.instance.setData({ focused: true });
clear.instance.syncState();
assert.strictEqual(clear.instance.data.showClear, true, 'default clear trigger reveals the action after native focus');
clear.instance.onClear();
assert.strictEqual(clear.instance.data.innerValue, '');
assert.strictEqual(clear.instance.data.hasClear, false);
assert.deepStrictEqual(clear.events.map((event) => event.name), ['clear', 'change']);
assert.strictEqual(clear.events[0].detail.previousValue, 'clear me');
assert.strictEqual(clear.events[0].detail.source, 'clear');
clear.instance.setData({ focused: false });
clear.instance.syncState();
assert.strictEqual(clear.instance.data.showClear, false, 'clear action hides again after the native input loses focus');

const alwaysClear = create({ defaultValue: 'always visible', clearable: true, clearTrigger: 'always' });
assert.strictEqual(alwaysClear.instance.data.showClear, true, 'clearTrigger=always preserves the explicit always-visible strategy for composed controls');

const controlledClear = create({ value: 'locked', defaultValue: 'fallback' });
controlledClear.instance.onClear();
assert.strictEqual(controlledClear.instance.data.innerValue, 'locked');
assert.deepStrictEqual(controlledClear.events.map((event) => event.name), ['clear', 'change']);
assert.strictEqual(controlledClear.events[0].detail.controlled, true);

const limited = create({ value: null, maxlength: 3 });
limited.instance.onInput({ detail: { value: 'A😀BC' } });
assert.strictEqual(limited.instance.data.innerValue, 'A😀B', 'maxlength counts Unicode code points and keeps an emoji intact');
assert.strictEqual(limited.events[0].detail.value, 'A😀B');

const weighted = create({ value: null, maxlength: 1, maxcharacter: 5 });
weighted.instance.onInput({ detail: { value: 'AB中😀C' } });
assert.strictEqual(weighted.instance.data.innerValue, 'AB中', 'maxcharacter takes precedence and uses ASCII=1/non-ASCII=2');
assert.strictEqual(weighted.instance.data.nativeMaxlength, -1, 'weighted limit is enforced by the component, not native maxlength');

['disabled', 'readonly', 'loading'].forEach((state) => {
  const locked = create({ [state]: true, defaultValue: 'locked' });
  locked.instance.onInput({ detail: { value: 'blocked' } });
  locked.instance.onClear();
  locked.instance.onFocus({ detail: {} });
  locked.instance.onConfirm({ detail: { value: 'blocked' } });
  assert.strictEqual(locked.instance.data.interactive, false, `${state} disables write interaction`);
  assert.strictEqual(locked.instance.data.innerValue, 'locked');
  assert.strictEqual(locked.events.length, 0, `${state} blocks user events`);
  assert.strictEqual(locked.instance.focus(), false, `${state} blocks focus()`);
  assert.strictEqual(locked.instance.clear(), false, `${state} blocks clear()`);
});

const focus = create({ defaultValue: 'focus value' });
assert.strictEqual(focus.instance.focus(), true);
assert.strictEqual(focus.instance.data.inputFocus, true);
focus.instance.onFocus({ detail: { height: 240 } });
focus.instance.onConfirm({ detail: { value: 'confirmed', cursor: 9 } });
focus.instance.onBlur({ detail: { value: 'focus value' } });
assert.deepStrictEqual(focus.events.map((event) => event.name), ['focus', 'enter', 'blur']);
assert.strictEqual(focus.events[1].detail.value, 'confirmed');
assert.strictEqual(focus.events[1].detail.source, 'enter');
assert.strictEqual(focus.instance.blur(), true);
assert.strictEqual(focus.instance.data.inputFocus, false);

const nativeFocus = create({ defaultValue: 'native focus value' });
assert.strictEqual(nativeFocus.instance.data.inputFocus, false);
nativeFocus.instance.onFocus({ detail: { height: 240 } });
assert.strictEqual(nativeFocus.instance.data.focused, true);
assert.strictEqual(nativeFocus.instance.data.inputFocus, true, 'manual native focus must remain bound until an actual blur');
nativeFocus.instance.onBlur({ detail: { value: 'native focus value' } });
assert.strictEqual(nativeFocus.instance.data.inputFocus, false, 'actual native blur releases the focus binding');

const methods = create({ value: null, defaultValue: 'initial' });
assert.strictEqual(methods.instance.getValue(), 'initial');
const clearDetail = methods.instance.clear();
assert.strictEqual(methods.instance.getValue(), '');
assert.strictEqual(clearDetail.source, 'method-clear');
assert.deepStrictEqual(methods.events.map((event) => event.name), ['clear', 'change']);

const boundaries = create({
  type: 'unsupported', confirmType: 'unsupported', clearTrigger: 'hover', maxlength: -99, maxcharacter: -2, size: 'huge', align: 'end', status: 'danger', reduceMotion: true,
});
assert.strictEqual(boundaries.instance.data.inputType, 'text');
assert.strictEqual(boundaries.instance.data.confirmTypeValue, 'done');
assert.strictEqual(boundaries.instance.data.nativeMaxlength, -1);
assert(boundaries.instance.data.rootClass.includes('pui-input--medium'));
assert(boundaries.instance.data.rootClass.includes('pui-input--align-left'));
assert(boundaries.instance.data.rootClass.includes('pui-input--status-default'));
assert.strictEqual(boundaries.instance.data.normalizedClearTrigger, 'focus');
assert(boundaries.instance.data.rootStyle.includes('--pui-input-duration:1ms'));

const password = create({ type: 'password', status: 'error', tips: '密码错误' });
assert.strictEqual(password.instance.data.inputType, 'text');
assert.strictEqual(password.instance.data.inputPassword, true);
assert.strictEqual(password.instance.data.invalidState, true);
assert(password.instance.data.rootClass.includes('pui-input--status-error'));

const wxml = fs.readFileSync(path.join(root, 'input/input.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'input/input.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'input/input.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/INPUT.md'), 'utf8');
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const generator = fs.readFileSync(path.join(root, 'scripts/generate-components.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');

assert(wxss.includes('--pui-input-field-radius: var(--pui-radius-medium);'), 'Input 必须提供由组合组件覆写的语义圆角变量');
assert(wxss.includes('border-radius: var(--pui-input-field-radius);'), 'Input Field 必须消费语义圆角变量，继续继承 ConfigProvider Token');

assert.strictEqual((wxml.match(/<input\b/g) || []).length, 1, 'Input intentionally owns one native input root');
assert(!/<button\b/.test(wxml), 'Input composes PoemUI Button instead of a raw clear button');
assert(wxss.includes('flex: 1 1 0;') && wxss.includes('width: 0;') && wxss.includes('max-width: 100%;'), 'native input must shrink within its Field so trailing actions retain their edge');
assert(wxml.includes('class="pui-input__trailing"'), 'Clear, loading, suffix and suffix-icon share one optional trailing track');
assert(wxml.includes('wx:if="{{hasClear || loading || suffix || suffixIcon}}"'), 'Input reserves its trailing track while a clear action can become visible');
assert(wxml.includes('wx:if="{{hasClear}}"') && wxml.includes("showClear ? 'pui-input__clear-host--visible' : 'pui-input__clear-host--hidden'"), 'Input preserves clear geometry and only changes visibility at the component-level trigger boundary');
assert(wxml.includes('disabled="{{!showClear}}"') && wxml.includes('aria-hidden="{{!showClear}}"'), 'a visually hidden clear action must also leave the interactive and accessibility trees');
assert(wxml.includes('pui-input__clear-host') && wxml.includes('class="pui-input__loading-host"'), 'nested PUI components use shrink-wrapped hosts inside the trailing flex track');
assert(/\.pui-input__trailing\s*\{[^}]*margin-left:\s*auto;/.test(wxss), 'the trailing track must occupy the Field edge');
assert(/\.pui-input__trailing\s*\{[^}]*gap:\s*var\(--pui-space-sm\);/.test(wxss), 'Clear and suffix action use the control-internal gap');
assert(/\.pui-input__clear-host,[\s\S]*?\.pui-input__loading-host\s*\{[^}]*flex:\s*0 0 auto;/.test(wxss), 'nested trailing PUI component hosts remain unshrinkable without filling the Field');
assert(wxss.includes('--pui-input-action-size: var(--pui-space-step-32);') && wxss.includes('width: var(--pui-input-action-size);'), 'Clear host mirrors the selected extra-small icon Button size instead of stretching as a custom-component host');
assert(/\.pui-input__clear-host--hidden\s*\{[^}]*pointer-events:\s*none;[^}]*opacity:\s*0;[^}]*visibility:\s*hidden;/.test(wxss), 'a blurred focus-trigger clear action keeps geometry but cannot receive input');
['pui-button', 'pui-icon', 'pui-loading'].forEach((name) => assert(json.usingComponents[name], `${name} is declared`));
['name="label"', 'name="prefix"', 'name="prefix-icon"', 'name="suffix"', 'name="suffix-icon"', 'name="tips"', 'name="extra"'].forEach((slot) => assert(wxml.includes(slot), `Input exposes ${slot}`));
['cursor-spacing="{{cursorSpacing}}"', 'adjust-position="{{adjustPosition}}"', 'hold-keyboard="{{holdKeyboard}}"', 'confirm-hold="{{confirmHold}}"'].forEach((attr) => assert(wxml.includes(attr), `Input maps ${attr}`));
assert(wxml.includes('bindconfirm="onConfirm"'));
assert(wxss.includes('var(--pui-input-duration)'));
assert(wxss.includes('color: var(--pui-text-primary)'));
assert(wxss.includes('caret-color: var(--pui-text-primary)'));
['box-sizing: border-box', 'display: block', 'margin: 0', 'padding: 0', 'background: transparent', 'border: 0'].forEach((rule) => {
  assert(wxss.includes(rule), `native input resets ${rule}`);
});
assert(wxml.includes('placeholder-class="pui-input__placeholder"'));
assert(wxss.includes('color: var(--pui-text-placeholder)'));
assert(!/\.pui-input__control\s*\{[^}]*color:\s*inherit/s.test(wxss), 'native input text must consume the token directly');
assert(wxss.includes('.pui-input--status-success'));
assert(wxss.includes('.pui-input--status-warning'));
assert(wxss.includes('.pui-input--status-error'));
assert.strictEqual(metadata.apiProps.input.length, 31);
assert.strictEqual(metadata.apiEvents.input.length, 5);
assert.strictEqual(metadata.apiSlots.input.length, 7);
assert.strictEqual(metadata.apiMethods.input.length, 4);
assert.deepStrictEqual(metadata.apiEvents.input.map((event) => event.name), ['change', 'clear', 'focus', 'blur', 'enter']);
assert.deepStrictEqual(metadata.apiMethods.input.map((method) => method.name), ['focus()', 'blur()', 'clear()', 'getValue()']);

const inputUsage = preview.slice(preview.indexOf("if (runtimeId === 'input')"), preview.indexOf("if (runtimeId === 'textarea')"));
assert(!/bind:/.test(inputUsage), 'Input basic copied WXML contains zero bind declarations');
assert(!/setValue|input-reset|pui-input-state-grid|pui-input-showcase__methods/.test(inputUsage), 'Input basic copied WXML excludes removed diagnostics');
['基础用法', '状态与提示', '图标与清空', '尺寸与类型'].forEach((title) => assert(preview.includes(`<h3>${title}</h3>`), `Input overview includes ${title}`));
assert(preview.includes("demoAction: current ? 'input-clear' : 'input-static-clear'"));
assert(preview.includes('inputPreviewNormalizeValue(event.target.value, snapshot.maxlength, snapshot.maxcharacter)'));
assert(preview.includes('demo.inputRestoringFocus = true'));
assert(preview.includes('if (demo.inputRestoringFocus)'));
assert(preview.includes('clear → change'));
assert(preview.includes('enter：value='));
assert(!previewStyles.includes('.pui-input-state-grid'));
assert(!previewStyles.includes('.pui-input-showcase__methods'));
assert(previewStyles.includes('.pui-input-preview__control input {\n  flex: 1 1 0;\n  width: 0;'), 'H5 input geometry mirrors the shrinkable native input track');
assert(preview.includes('class="pui-input-preview__trailing"'), 'H5 helper and Input mirror expose the same trailing track');
assert(preview.includes("const clearTrigger = ['focus', 'always'].includes(props.clearTrigger) ? props.clearTrigger : 'focus';"), 'H5 Input defaults clear visibility to native focus');
assert(preview.includes('class="pui-input-preview__clear-host"') && preview.includes('class="pui-input-preview__loading-host"'), 'H5 mirrors the nested PUI component host boundaries');
assert(/\.pui-input-preview__trailing\s*\{[^}]*margin-left:\s*auto;/.test(previewStyles), 'H5 trailing track mirrors the native edge placement');
assert(preview.includes("iconButtonSample({ icon: 'check', ariaLabel: '保存输入内容' })"), 'H5 suffix Slot demonstrates a shared PUI icon action');
assert(preview.includes("defaultValue: 'PoemUI', label: 'slot', prefix: 'slot', prefixIcon: 'slot', suffix: 'slot', clearable: true"), 'H5 overview verifies clear and suffix action together');
assert(previewStyles.includes('.pui-input-showcase > .pui-showcase-section + .pui-showcase-section'));
assert(previewStyles.includes('.pui-input-preview--status-error'));
assert(previewStyles.includes('.pui-input-preview--clear-focus:not(:focus-within) .pui-input-preview__clear-host'), 'H5 hides the Input clear action until the field owns focus');
const genericSurface = previewStyles.slice(previewStyles.indexOf('.pui-field,'), previewStyles.indexOf('.pui-switch {'));
assert(!genericSurface.includes('.pui-input-preview,'), 'Input root remains transparent so only its inner field owns the Surface');
assert(previewStyles.includes('.pui-input-preview--status-error:focus-within .pui-input-preview__control'), 'error status remains visible while focused');
assert(preview.includes("if (compatId === 'input')"));
assert(preview.includes('普通输入只发出 change，清空顺序固定为 clear → change'));

assert(api.includes('Input：TDesign 对照后的 31 Props'));
assert(api.includes('`clear → change`'));
assert(/\d+\. Input 的 H5 镜像/.test(compatibility));
assert(compatibility.includes('固定 500ms/1ms'));
assert(contract.includes('31 Props / 5 Events / 7 Slots / 4 Methods'));
assert(contract.includes('TDesign Mini Program 1.15.3'));
assert(shadcn.includes("['Input', 'input', 'adapter', 'input'"));
assert(shadcn.includes('30 Props、受控/非受控文本'));
assert(generator.includes("  'input',"), 'experimental generator protects Input');
assert(exampleWxml.includes('id="deliveryInput"'));
assert(exampleWxml.includes('bind:change="onNameChange"'));
assert(exampleWxml.includes('bind:enter="onNameEnter"'));
assert(!exampleWxml.includes('bind:input="onNameInput"'));
assert(!exampleWxml.includes('bind:confirm="onNameConfirm"'));
assert(exampleJs.includes('onNameChange: function onNameChange(event)'));
assert(exampleJs.includes('onNameEnter: function onNameEnter(event)'));
assert(exampleJs.includes('focusNameInput: function focusNameInput()'));
assert(exampleJs.includes('component.clear()'));

console.log('Input contract tests passed.');
