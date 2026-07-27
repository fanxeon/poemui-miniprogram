const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

function loadDefinition(file) {
  let definition = null;
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  vm.runInNewContext(source, {
    console,
    isFinite,
    require: () => ({}),
    Component: (value) => { definition = value; },
  }, { filename: file });
  assert(definition, `${file} must register a component`);
  return definition;
}

const checkbox = loadDefinition('checkbox/checkbox.js');
const group = loadDefinition('checkbox/checkbox-group.js');

function propertyDefaults(definition) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  return defaults;
}

function createChild(overrides) {
  const events = [];
  const instance = {
    data: Object.assign({}, checkbox.data, propertyDefaults(checkbox), overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : ''; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, checkbox.methods);
  checkbox.lifetimes.attached.call(instance);
  return { instance, events };
}

function createGroup(overrides, children) {
  const events = [];
  const childList = children || [];
  const instance = {
    data: Object.assign({}, group.data, propertyDefaults(group), overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : ''; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
    getRelationNodes() { return childList.map((entry) => entry.instance); },
  };
  Object.assign(instance, group.methods);
  group.lifetimes.attached.call(instance);
  childList.forEach((entry) => { entry.instance._checkboxGroup = instance; });
  instance.syncChildren();
  return { instance, events, children: childList };
}

const checkboxProps = ['checked', 'defaultChecked', 'value', 'label', 'content', 'icon', 'indeterminate', 'checkAll', 'block', 'borderless', 'contentDisabled', 'disabled', 'readonly', 'name', 'placement', 'maxLabelRow', 'maxContentRow', 'ariaLabel', 'reduceMotion'];
const groupProps = ['options', 'value', 'defaultValue', 'keys', 'max', 'name', 'borderless', 'disabled', 'readonly', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(checkbox.properties), checkboxProps, 'Checkbox publishes the 19-prop contract');
assert.deepStrictEqual(Object.keys(group.properties), groupProps, 'CheckboxGroup publishes the 11-prop contract');

const defaults = createChild();
assert.strictEqual(defaults.instance.data.innerChecked, false);
assert(defaults.instance.data.rootClass.includes('pui-checkbox--block'));
assert(defaults.instance.data.rootClass.includes('pui-checkbox--left'));
assert(defaults.instance.data.rootStyle.includes('500ms'));
assert.strictEqual(defaults.instance.data.semanticLabel, '复选框');

const uncontrolled = createChild({ value: 0, label: '数字零', defaultChecked: true });
assert.strictEqual(uncontrolled.instance.data.innerChecked, true);
assert.strictEqual(uncontrolled.instance.onMarkTap(), true);
assert.strictEqual(uncontrolled.instance.data.innerChecked, false);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['change']);
assert.deepStrictEqual(JSON.parse(JSON.stringify(uncontrolled.events[0].detail)), {
  checked: false,
  previousChecked: true,
  value: 0,
  label: '数字零',
  indeterminate: false,
  checkAll: false,
  source: 'mark',
  controlled: false,
});

const falseValue = createChild({ value: false });
falseValue.instance.onMarkTap();
assert.strictEqual(falseValue.events[0].detail.value, false, 'false remains a raw option identity');
const emptyValue = createChild({ value: '' });
emptyValue.instance.onMarkTap();
assert.strictEqual(emptyValue.events[0].detail.value, '', 'empty string remains a raw option identity');

const controlled = createChild({ checked: false, defaultChecked: true });
assert.strictEqual(controlled.instance.onMarkTap(), true);
assert.strictEqual(controlled.instance.data.innerChecked, false, 'controlled Checkbox waits for parent write-back');
assert.strictEqual(controlled.events[0].detail.checked, true);
controlled.instance.data.checked = true;
controlled.instance.syncState(false);
assert.strictEqual(controlled.instance.data.innerChecked, true);
controlled.instance.data.checked = null;
controlled.instance.syncState(false);
assert.strictEqual(controlled.instance.data.innerChecked, true, 'leaving controlled mode preserves last rendered state');

['disabled', 'readonly'].forEach((key) => {
  const locked = createChild({ [key]: true });
  assert.strictEqual(locked.instance.onMarkTap(), false, `${key} blocks writes silently`);
  assert.strictEqual(locked.events.length, 0);
});
const contentLocked = createChild({ contentDisabled: true });
assert.strictEqual(contentLocked.instance.onContentTap(), false);
assert.strictEqual(contentLocked.instance.onMarkTap(), true, 'contentDisabled keeps the mark writable');

const presentation = createChild({ icon: ['success-circle', 'circle', 'minus-circle'], placement: 'right', borderless: true, maxLabelRow: 2, maxContentRow: 4, reduceMotion: true, colorScheme: 'dark' });
assert(presentation.instance.data.rootClass.includes('pui-checkbox--right'));
assert(presentation.instance.data.rootClass.includes('pui-checkbox--borderless'));
assert(presentation.instance.data.rootClass.includes('pui-checkbox--reduced-motion'));
assert(presentation.instance.data.rootClass.includes('pui-theme--dark'));
assert.strictEqual(presentation.instance.data.checkedIcon, 'success-circle');
assert.strictEqual(presentation.instance.data.uncheckedIcon, 'circle');
assert.strictEqual(presentation.instance.data.indeterminateIcon, 'minus-circle');
assert.strictEqual(presentation.instance.data.labelStyle, '-webkit-line-clamp:2;');
assert.strictEqual(presentation.instance.data.contentStyle, '-webkit-line-clamp:4;');
assert(presentation.instance.data.rootStyle.includes('1ms'));
assert.strictEqual(createChild({ icon: 'none' }).instance.data.markVisible, false);

const all = createChild({ value: 'all', label: '全选', checkAll: true, borderless: true });
const zero = createChild({ value: 0, label: '数字零' });
const disabledFalse = createChild({ value: false, label: '布尔 false', disabled: true });
const empty = createChild({ value: '', label: '空字符串' });
const relationGroup = createGroup({ defaultValue: [0, false], max: 3 }, [all, zero, disabledFalse, empty]);
assert.deepStrictEqual(Array.from(relationGroup.instance.data.currentValue), [0, false]);
assert.strictEqual(all.instance.data.innerChecked, false);
assert.strictEqual(all.instance.data.innerIndeterminate, true, 'check-all is mixed when some available items are selected');
assert.strictEqual(zero.instance.data.innerChecked, true);
assert.strictEqual(disabledFalse.instance.data.innerChecked, true);
assert.strictEqual(empty.instance.data.innerChecked, false);
assert.strictEqual(all.instance.onMarkTap(), true);
assert.deepStrictEqual(Array.from(relationGroup.events[0].detail.value), [0, false, '']);
assert.strictEqual(relationGroup.events[0].detail.checkAll, true);
assert.strictEqual(all.instance.data.innerChecked, true);
assert.strictEqual(all.instance.onMarkTap(), true);
assert.deepStrictEqual(Array.from(relationGroup.events[1].detail.value), [false], 'unselect all preserves disabled selected values');

const maxZero = createChild({ value: 0 });
const maxFalse = createChild({ value: false, disabled: true });
const maxEmpty = createChild({ value: '' });
const maxGroup = createGroup({ defaultValue: [0, false], max: 2 }, [maxZero, maxFalse, maxEmpty]);
assert.strictEqual(maxEmpty.instance.onMarkTap(), false, 'max silently blocks a new value');
assert.strictEqual(maxGroup.events.length, 0, 'max does not publish fake change');

const controlledZero = createChild({ value: 0 });
const controlledEmpty = createChild({ value: '' });
const controlledGroup = createGroup({ value: [0], defaultValue: [false] }, [controlledZero, controlledEmpty]);
assert.strictEqual(controlledEmpty.instance.onMarkTap(), true);
assert.deepStrictEqual(Array.from(controlledGroup.events[0].detail.value), [0, '']);
assert.deepStrictEqual(Array.from(controlledGroup.instance.data.currentValue), [0], 'controlled Group waits for parent write-back');
controlledGroup.instance.data.value = [0, ''];
controlledGroup.instance.syncState(false);
controlledGroup.instance.data.value = null;
controlledGroup.instance.syncState(false);
assert.deepStrictEqual(Array.from(controlledGroup.instance.data.currentValue), [0, ''], 'Group controlled to uncontrolled preserves last rendered value');

const inherited = createChild({ value: 'inherit' });
createGroup({ disabled: true, readonly: true, borderless: true }, [inherited]);
assert.strictEqual(inherited.instance.data.effectiveDisabled, true);
assert.strictEqual(inherited.instance.data.effectiveReadonly, true);
assert.strictEqual(inherited.instance.data.effectiveBorderless, true);
const override = createChild({ value: 'override', disabled: false, readonly: false, borderless: false });
createGroup({ disabled: true, readonly: true, borderless: true }, [override]);
assert.strictEqual(override.instance.data.effectiveDisabled, false, 'explicit child false overrides inherited disabled');
assert.strictEqual(override.instance.data.effectiveReadonly, false);
assert.strictEqual(override.instance.data.effectiveBorderless, false);

const optionsGroup = createGroup({
  options: [{ code: false, title: '布尔值', help: '保留原始值' }, { code: false, title: '重复' }, 0, ''],
  keys: { value: 'code', label: 'title', content: 'help' },
}, []);
assert.strictEqual(optionsGroup.instance.data.normalizedOptions.length, 3);
assert.strictEqual(optionsGroup.instance.data.normalizedOptions[0].value, false);
assert.strictEqual(optionsGroup.instance.data.normalizedOptions[1].value, 0);
assert.strictEqual(optionsGroup.instance.data.normalizedOptions[2].value, '');

const wxml = fs.readFileSync(path.join(root, 'checkbox/checkbox.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'checkbox/checkbox.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'checkbox/checkbox.json'), 'utf8'));
const groupWxml = fs.readFileSync(path.join(root, 'checkbox/checkbox-group.wxml'), 'utf8');
const groupJson = JSON.parse(fs.readFileSync(path.join(root, 'checkbox/checkbox-group.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJson = JSON.parse(fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.json'), 'utf8'));

assert(wxml.includes('role="checkbox"'));
assert(wxml.includes('aria-checked="{{innerIndeterminate'));
assert(wxml.includes('slot name="label"'));
assert(wxml.includes('slot name="content"'));
assert(wxml.includes('<text wx:if="{{label}}">{{label}}</text><slot name="label"></slot>'), 'Checkbox 的 label Prop 必须独立渲染，不能依赖微信具名 Slot 不支持的 fallback');
assert(wxml.includes('<text wx:if="{{content}}">{{content}}</text><slot name="content"></slot>'), 'Checkbox 的 content Prop 必须独立渲染，不能依赖微信具名 Slot 不支持的 fallback');
assert(wxml.includes('<slot></slot>'));
assert(!wxml.includes('pui-loading'));
assert(!wxml.includes('customIcon'));
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert(wxml.includes('<pui-icon') && /\.pui-checkbox__icon\s*\{\s*display:flex;align-items:center;justify-content:center;/.test(wxss), 'Checkbox mark is a centered PUI Icon host');
assert.strictEqual(json.usingComponents['pui-loading'], undefined);
assert(groupWxml.includes('<pui-checkbox'));
assert(groupWxml.includes('<slot></slot>'));
assert(groupWxml.includes('checked="{{item.checked}}"') && groupWxml.includes('bind:change="onOptionChange"'), 'CheckboxGroup options 必须显式同步选中态并接收子项 change，不能只依赖 npm 运行态 relation');
assert.strictEqual(groupJson.usingComponents['pui-checkbox'], './checkbox');
const optionsFallbackGroup = createGroup({ options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], value: ['a'] }, []);
assert.strictEqual(optionsFallbackGroup.instance.data.normalizedOptions[0].checked, true);
optionsFallbackGroup.instance.onOptionChange({ currentTarget: { dataset: { index: 1 } }, detail: { checked: true, source: 'mark' } });
assert.deepStrictEqual(Array.from(optionsFallbackGroup.events[0].detail.value), ['a', 'b'], 'CheckboxGroup options 在 relation 不可用时仍必须发布真实选择请求');
assert(wxss.includes('var(--pui-checkbox-duration)'));
assert(wxss.includes('border:2rpx solid var(--pui-control-outline-color)'), 'Checkbox Mark 必须在全局边框关闭时仍保留可识别轮廓');
assert(!/display\s*:\s*none/.test(wxss));
assert(!/height\s*:\s*auto/.test(wxss));
assert.deepStrictEqual(metadata.apiProps.checkbox, checkboxProps);
assert.deepStrictEqual(metadata.apiEvents.checkbox.map((item) => item.name), ['change']);
assert.deepStrictEqual(metadata.apiSlots.checkbox.map((item) => item.name), ['default', 'label', 'content']);
assert.strictEqual(metadata.apiMethods.checkbox, undefined);
assert(preview.includes('<h3>纵向与横向</h3>'));
assert(preview.includes('<h3>全选与半选</h3>'));
assert(preview.includes('<h3>状态</h3>'));
assert(preview.includes('<h3>图标与布局</h3>'));
assert(preview.includes('function checkboxGroupMarkup'));
assert(preview.includes('function syncCheckboxGroupPreview'));
assert(preview.includes('CheckboxGroup Events'));
assert(!preview.includes('checkbox-method-check'));
assert(!preview.includes('不伪装 CheckboxGroup API'));
assert(previewStyles.includes('gap: var(--pui-section-gap)'));
assert(previewStyles.includes('.pui-checkbox-preview__group.is-horizontal'));
assert(api.includes('### CheckboxGroup'));
assert(api.includes('基础用法零 bind'));
assert(compatibility.includes('relation 同步子项'));
assert.strictEqual(exampleJson.usingComponents['pui-checkbox-group'], 'poemui-miniprogram/checkbox/checkbox-group');
assert(exampleWxml.includes('bind:change="onDeliveryCheckboxGroupChange"'));
assert(!exampleWxml.includes('bind:input="onDeliveryCheckboxInput"'));
assert(!exampleJs.includes('checkDeliveryCheckbox'));

['checkbox', 'checkbox-group'].forEach((name) => {
  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    const sourceFile = fs.readFileSync(path.join(root, `checkbox/${name}.${extension}`));
    const distFile = fs.readFileSync(path.join(root, `miniprogram_dist/checkbox/${name}.${extension}`));
    assert(sourceFile.equals(distFile), `source and miniprogram_dist ${name} ${extension} must match`);
  });
});

process.stdout.write('Checkbox and CheckboxGroup contract tests passed.\n');
