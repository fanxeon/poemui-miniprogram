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

const radio = loadDefinition('radio/radio.js');
const group = loadDefinition('radio/radio-group.js');

function propertyDefaults(definition) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  return defaults;
}

function createRadio(overrides) {
  const events = [];
  const instance = {
    data: Object.assign({}, radio.data, propertyDefaults(radio), overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : ''; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, radio.methods);
  radio.lifetimes.attached.call(instance);
  return { instance, events };
}

function createGroup(overrides, radios) {
  const events = [];
  const childList = radios || [];
  const instance = {
    data: Object.assign({}, group.data, propertyDefaults(group), overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : ''; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
    getRelationNodes() { return childList.map((entry) => entry.instance); },
  };
  Object.assign(instance, group.methods);
  group.lifetimes.attached.call(instance);
  childList.forEach((entry) => { entry.instance._radioGroup = instance; });
  instance.syncChildren();
  return { instance, events, radios: childList };
}

const radioProps = ['checked', 'defaultChecked', 'value', 'label', 'content', 'icon', 'allowUncheck', 'block', 'borderless', 'contentDisabled', 'disabled', 'readonly', 'name', 'placement', 'maxLabelRow', 'maxContentRow', 'ariaLabel', 'reduceMotion'];
const groupProps = ['options', 'value', 'defaultValue', 'keys', 'name', 'allowUncheck', 'icon', 'placement', 'borderless', 'disabled', 'readonly', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(radio.properties), radioProps, 'Radio publishes the 18-prop contract');
assert.deepStrictEqual(Object.keys(group.properties), groupProps, 'RadioGroup publishes the 13-prop contract');

const defaults = createRadio();
assert.strictEqual(defaults.instance.data.innerChecked, false);
assert(defaults.instance.data.rootClass.includes('pui-radio--block'));
assert(defaults.instance.data.rootClass.includes('pui-radio--left'));
assert(defaults.instance.data.rootClass.includes('pui-radio--icon-circle'));
assert(defaults.instance.data.rootStyle.includes('500ms'));
assert.strictEqual(defaults.instance.data.semanticLabel, '单选框');

const rawZero = createRadio({ value: 0, label: '数字零' });
assert.strictEqual(rawZero.instance.onMarkTap(), true);
assert.deepStrictEqual(rawZero.events.map((event) => event.name), ['change']);
assert.deepStrictEqual(JSON.parse(JSON.stringify(rawZero.events[0].detail)), {
  checked: true,
  previousChecked: false,
  value: 0,
  label: '数字零',
  source: 'mark',
  controlled: false,
});
assert.strictEqual(createRadio({ value: false }).instance.onMarkTap(), true, 'boolean false remains a valid identity');
const rawEmpty = createRadio({ value: '' });
rawEmpty.instance.onMarkTap();
assert.strictEqual(rawEmpty.events[0].detail.value, '', 'empty string remains a valid identity');

const noUncheck = createRadio({ defaultChecked: true });
assert.strictEqual(noUncheck.instance.onMarkTap(), false, 'selected Radio stays selected by default');
assert.strictEqual(noUncheck.events.length, 0, 'repeat selection publishes no fake change');
const uncheck = createRadio({ defaultChecked: true, allowUncheck: true });
assert.strictEqual(uncheck.instance.onContentTap(), true);
assert.strictEqual(uncheck.instance.data.innerChecked, false);
assert.strictEqual(uncheck.events[0].detail.source, 'content');

const controlled = createRadio({ checked: false, defaultChecked: true });
assert.strictEqual(controlled.instance.onMarkTap(), true);
assert.strictEqual(controlled.instance.data.innerChecked, false, 'controlled Radio waits for parent write-back');
assert.strictEqual(controlled.events[0].detail.checked, true);
assert.strictEqual(controlled.events[0].detail.controlled, true);
controlled.instance.data.checked = true;
controlled.instance.syncState(false);
controlled.instance.data.checked = null;
controlled.instance.syncState(false);
assert.strictEqual(controlled.instance.data.innerChecked, true, 'leaving control preserves last rendered state');

['disabled', 'readonly'].forEach((key) => {
  const locked = createRadio({ [key]: true });
  assert.strictEqual(locked.instance.onMarkTap(), false, `${key} blocks writes silently`);
  assert.strictEqual(locked.events.length, 0);
});
const contentLocked = createRadio({ contentDisabled: true });
assert.strictEqual(contentLocked.instance.onContentTap(), false);
assert.strictEqual(contentLocked.instance.onMarkTap(), true, 'contentDisabled keeps the mark writable');

const presentation = createRadio({ icon: ['success-circle', 'circle'], placement: 'right', borderless: true, maxLabelRow: 2, maxContentRow: 4, reduceMotion: true, colorScheme: 'dark' });
assert(presentation.instance.data.rootClass.includes('pui-radio--right'));
assert(presentation.instance.data.rootClass.includes('pui-radio--borderless'));
assert(presentation.instance.data.rootClass.includes('pui-radio--reduced-motion'));
assert(presentation.instance.data.rootClass.includes('pui-theme--dark'));
assert.strictEqual(presentation.instance.data.checkedIcon, 'success-circle');
assert.strictEqual(presentation.instance.data.uncheckedIcon, 'circle');
assert.strictEqual(presentation.instance.data.labelStyle, '-webkit-line-clamp:2;');
assert.strictEqual(presentation.instance.data.contentStyle, '-webkit-line-clamp:4;');
assert(presentation.instance.data.rootStyle.includes('1ms'));

const stable = createRadio({ value: 'stable', label: '稳定版' });
const zero = createRadio({ value: 0, label: '数值零' });
const falseValue = createRadio({ value: false, label: '布尔 false' });
const emptyValue = createRadio({ value: '', label: '空字符串' });
const relationGroup = createGroup({ defaultValue: 0 }, [stable, zero, falseValue, emptyValue]);
assert.strictEqual(relationGroup.instance.data.currentValue, 0);
assert.strictEqual(zero.instance.data.innerChecked, true);
assert.strictEqual(falseValue.instance.onMarkTap(), true);
assert.strictEqual(relationGroup.instance.data.currentValue, false);
assert.strictEqual(relationGroup.events.length, 1);
assert.deepStrictEqual(JSON.parse(JSON.stringify(relationGroup.events[0].detail)), {
  value: false,
  previousValue: 0,
  option: { value: false, label: '布尔 false', content: '' },
  index: -1,
  source: 'mark',
  controlled: false,
});
assert.strictEqual(falseValue.instance.onMarkTap(), false, 'same group option does not publish change by default');

const allowChild = createRadio({ value: '', allowUncheck: true });
const allowGroup = createGroup({ defaultValue: '' }, [allowChild]);
assert.strictEqual(allowChild.instance.data.innerChecked, true);
assert.strictEqual(allowChild.instance.onMarkTap(), true);
assert.strictEqual(allowGroup.instance.data.currentValue, null);
assert.strictEqual(allowGroup.events[0].detail.value, null);

const controlledZero = createRadio({ value: 0 });
const controlledEmpty = createRadio({ value: '' });
const controlledGroup = createGroup({ value: 0, defaultValue: false }, [controlledZero, controlledEmpty]);
assert.strictEqual(controlledEmpty.instance.onMarkTap(), true);
assert.strictEqual(controlledGroup.events[0].detail.value, '');
assert.strictEqual(controlledGroup.instance.data.currentValue, 0, 'controlled RadioGroup waits for parent write-back');
controlledGroup.instance.data.value = '';
controlledGroup.instance.syncState(false);
controlledGroup.instance.data.value = null;
controlledGroup.instance.syncState(false);
assert.strictEqual(controlledGroup.instance.data.currentValue, '', 'RadioGroup controlled to uncontrolled preserves last rendered value');

const inherited = createRadio({ value: 'inherit' });
createGroup({ disabled: true, readonly: true, borderless: true, icon: 'dot', placement: 'right' }, [inherited]);
assert.strictEqual(inherited.instance.data.effectiveDisabled, true);
assert.strictEqual(inherited.instance.data.effectiveReadonly, true);
assert.strictEqual(inherited.instance.data.effectiveBorderless, true);
assert(inherited.instance.data.rootClass.includes('pui-radio--icon-dot'));
assert(inherited.instance.data.rootClass.includes('pui-radio--right'));
const override = createRadio({ value: 'override', disabled: false, readonly: false, borderless: false, icon: 'line', placement: 'left' });
createGroup({ disabled: true, readonly: true, borderless: true, icon: 'dot', placement: 'right' }, [override]);
assert.strictEqual(override.instance.data.effectiveDisabled, false, 'explicit child false overrides inherited disabled');
assert.strictEqual(override.instance.data.effectiveReadonly, false);
assert.strictEqual(override.instance.data.effectiveBorderless, false);
assert(override.instance.data.rootClass.includes('pui-radio--icon-line'));

const optionsGroup = createGroup({
  options: [{ code: false, title: '布尔值', help: '保留原始值' }, { code: false, title: '重复' }, 0, '', Infinity, {}],
  keys: { value: 'code', label: 'title', content: 'help' },
}, []);
assert.strictEqual(optionsGroup.instance.data.normalizedOptions.length, 4);
assert.strictEqual(optionsGroup.instance.data.normalizedOptions[0].value, false);
assert.strictEqual(optionsGroup.instance.data.normalizedOptions[1].value, 0);
assert.strictEqual(optionsGroup.instance.data.normalizedOptions[2].value, '');
assert.strictEqual(optionsGroup.instance.data.normalizedOptions[3].value, 5, 'object without mapped value receives its source index');

const wxml = fs.readFileSync(path.join(root, 'radio/radio.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'radio/radio.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'radio/radio.json'), 'utf8'));
const groupWxml = fs.readFileSync(path.join(root, 'radio/radio-group.wxml'), 'utf8');
const groupJson = JSON.parse(fs.readFileSync(path.join(root, 'radio/radio-group.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/RADIO.md'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const exampleJson = JSON.parse(fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.json'), 'utf8'));

assert(wxml.includes('role="radio"'));
assert(wxml.includes('slot name="label"'));
assert(wxml.includes('slot name="content"'));
assert(wxml.includes('<text wx:if="{{label}}">{{label}}</text><slot name="label"></slot>'), 'Radio 的 label Prop 必须独立渲染，不能依赖微信具名 Slot 不支持的 fallback');
assert(wxml.includes('<text wx:if="{{content}}">{{content}}</text><slot name="content"></slot>'), 'Radio 的 content Prop 必须独立渲染，不能依赖微信具名 Slot 不支持的 fallback');
assert(wxml.includes('slot name="icon"'));
assert(wxml.includes('<slot></slot>'));
assert(!wxml.includes('pui-loading'));
assert(!wxml.includes('pui-empty'));
assert(!wxml.includes('pui-badge'));
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert.strictEqual(json.usingComponents['pui-loading'], undefined);
assert(groupWxml.includes('<pui-radio'));
assert(groupWxml.includes('<slot></slot>'));
assert(groupWxml.includes('checked="{{item.checked}}"') && groupWxml.includes('bind:change="onOptionChange"'), 'RadioGroup options 必须显式同步选中态并接收子项 change，不能只依赖 npm 运行态 relation');
assert.strictEqual(groupJson.usingComponents['pui-radio'], './radio');
const optionsFallbackGroup = createGroup({ options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], value: 'a' }, []);
assert.strictEqual(optionsFallbackGroup.instance.data.normalizedOptions[0].checked, true);
optionsFallbackGroup.instance.onOptionChange({ currentTarget: { dataset: { index: 1 } }, detail: { source: 'mark' } });
assert.strictEqual(optionsFallbackGroup.events[0].detail.value, 'b', 'RadioGroup options 在 relation 不可用时仍必须发布真实选择请求');
assert(wxss.includes('var(--pui-radio-duration)'));
assert(wxss.includes('border:2rpx solid var(--pui-control-outline-color)'), 'Radio Mark 必须在全局边框关闭时仍保留可识别轮廓');
assert(!/display\s*:\s*none/.test(wxss));
assert(!/height\s*:\s*auto/.test(wxss));
assert.deepStrictEqual(metadata.apiProps.radio, radioProps);
assert.deepStrictEqual(metadata.apiEvents.radio.map((item) => item.name), ['change']);
assert.deepStrictEqual(metadata.apiSlots.radio.map((item) => item.name), ['default', 'label', 'content', 'icon']);
assert.strictEqual(metadata.apiMethods.radio, undefined);
assert(preview.includes('id="radio-basic-title">基础用法'));
assert(preview.includes('id="radio-raw-title">原始值'));
assert(preview.includes('id="radio-state-title">组件状态'));
assert(preview.includes('id="radio-icon-title">图标与内容'));
assert(preview.includes('type="radio"'));
assert(preview.includes('function bindRadioPreviewRuntime(props)'));
assert(preview.includes("options.main\n      ? (props.name || 'radio-preview-main')"));
assert(preview.includes("`radio-preview-${options.key || 'static'}`"));
assert(preview.includes('RadioGroup Events'));
assert(!preview.includes('radio-method-select'));
assert(!preview.includes('requestRadioPreviewOption'));
assert(previewStyles.includes('gap: var(--pui-section-gap)'));
assert(previewStyles.includes('.pui-radio-preview__native'));
assert(api.includes('### RadioGroup Props'));
assert(api.includes('基础用法零 bind'));
assert(compatibility.includes('两个独立、可安装的原生组件'));
assert(contract.includes('Radio：18 Props / 1 Event / 4 Slots / 0 Methods'));
assert.strictEqual(exampleJson.usingComponents['pui-radio-group'], 'poemui-miniprogram/radio/radio-group');
assert(exampleWxml.includes('bind:change="onDeliveryRadioChange"'));
assert(!exampleWxml.includes('bind:item-click="onDeliveryRadioItemClick"'));
assert(!exampleJs.includes('selectNextDeliveryRadio'));

['radio', 'radio-group'].forEach((name) => {
  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    const sourceFile = fs.readFileSync(path.join(root, `radio/${name}.${extension}`));
    const distFile = fs.readFileSync(path.join(root, `miniprogram_dist/radio/${name}.${extension}`));
    assert(sourceFile.equals(distFile), `source and miniprogram_dist ${name} ${extension} must match`);
  });
});

process.stdout.write('Radio and RadioGroup contract tests passed.\n');
