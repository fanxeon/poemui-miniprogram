const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'form/form.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  console,
  isFinite,
  Promise,
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: 'form/form.js' });
assert(definition, 'Form component definition must be registered');

const PROPS = ['data', 'rules', 'showErrorMessage', 'scrollToFirstError', 'resetType', 'ariaLabel', 'reduceMotion'];

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function field(name) {
  return {
    data: { name },
    contexts: [],
    validations: [],
    scrolls: [],
    getFieldName() { return name; },
    syncFormContext(context) { this.contexts.push(plain(context)); },
    applyFormValidation(messages, show) { this.validations.push({ messages: plain(messages), show }); },
    clearFormValidation() { this.validations.push({ cleared: true }); },
    scrollIntoView(behavior, reduced) { this.scrolls.push({ behavior, reduced }); },
  };
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
  definition.lifetimes.ready.call(instance);
  return { instance, events };
}

async function main() {
  assert.deepStrictEqual(Object.keys(definition.properties), PROPS, 'Form publishes the exact seven-Prop contract');
  assert.deepStrictEqual(Object.keys(definition.relations), ['../field/field'], 'Form owns one real Field child relation');

  const empty = create();
  assert(empty.instance.data.rootClass.includes('pui-form'));
  assert(empty.instance.data.rootStyle.includes('--pui-form-duration:500ms'));
  assert.strictEqual(empty.instance.data.normalizedResetType, 'initial');
  assert.strictEqual(empty.instance.data.normalizedScrollToFirstError, '');

  const nameField = field('name');
  const packageField = field('packageName');
  const form = create({
    data: { name: 'Po', packageName: 'invalid', count: 0, enabled: false, zero: 0, empty: '', publicRelease: false },
    rules: {
      name: [{ required: true }, { min: 3, message: '至少三个字符' }],
      packageName: [{ validator: async (value) => value === 'poemui-miniprogram' || '包名不可用' }],
      count: [{ number: true }],
      enabled: [{ boolean: true }],
      zero: [{ enum: [0] }],
      empty: [{ max: 4 }],
      publicRelease: [{ enum: [true], type: 'warning', message: '尚未公开发布' }],
    },
    showErrorMessage: true,
    scrollToFirstError: 'smooth',
  });
  form.instance.registerField(nameField);
  form.instance.registerField(packageField);
  assert.strictEqual(form.instance.data.registeredFields, 2);
  assert.strictEqual(nameField.contexts.at(-1).required, true, 'required rule is inherited through the Form relation');

  const invalid = await form.instance.validate();
  assert.strictEqual(invalid.valid, false);
  assert.deepStrictEqual(plain(invalid.data), { name: 'Po', packageName: 'invalid', count: 0, enabled: false, zero: 0, empty: '', publicRelease: false });
  assert.strictEqual(invalid.errors.name[0].message, '至少三个字符');
  assert.strictEqual(invalid.errors.packageName[0].message, '包名不可用');
  assert.strictEqual(invalid.warnings.publicRelease[0].message, '尚未公开发布');
  assert.strictEqual(invalid.errors.count, undefined, 'numeric zero remains a valid number');
  assert.strictEqual(invalid.errors.enabled, undefined, 'boolean false remains a valid boolean');
  assert.strictEqual(invalid.errors.zero, undefined, 'zero remains a valid enum member');
  assert.strictEqual(invalid.errors.empty, undefined, 'an optional empty string skips non-required constraints');
  assert.deepStrictEqual(form.events.map((event) => event.name), ['validate']);
  assert.deepStrictEqual(nameField.scrolls, [{ behavior: 'smooth', reduced: false }]);

  form.events.length = 0;
  form.instance.data.data = { ...form.instance.data.data, name: 'PoemUI', packageName: 'poemui-miniprogram' };
  const submitted = await form.instance.submit();
  assert.strictEqual(submitted.valid, true, 'warnings do not fabricate an error or block submit reporting');
  assert.deepStrictEqual(form.events.map((event) => event.name), ['validate', 'submit'], 'submit event order is fixed');

  const initialReset = form.instance.reset();
  assert.strictEqual(initialReset.controlled, true);
  assert.strictEqual(initialReset.data.name, 'Po', 'initial reset returns the attached data snapshot');
  assert.strictEqual(form.instance.data.data.name, 'PoemUI', 'Form never mutates the controlled data prop during reset');
  const emptyReset = form.instance.reset({ type: 'empty' });
  assert.strictEqual(emptyReset.data.count, 0);
  assert.strictEqual(emptyReset.data.enabled, false);
  assert.strictEqual(emptyReset.data.name, '');

  const external = form.instance.setValidateMessage({ name: '服务端已占用', publicRelease: [{ type: 'warning', message: '需要管理员确认' }] });
  assert.deepStrictEqual(plain(external), {
    name: [{ type: 'error', message: '服务端已占用' }],
    publicRelease: [{ type: 'warning', message: '需要管理员确认' }],
  });
  assert.strictEqual(form.instance.data.lastValid, false);
  form.instance.clearValidate(['name']);
  assert.strictEqual(nameField.validations.at(-1).cleared, true);

  const reduced = create({ reduceMotion: true, resetType: 'unknown', scrollToFirstError: 'invalid', colorScheme: 'dark' });
  assert(reduced.instance.data.rootClass.includes('pui-theme--dark'));
  assert(reduced.instance.data.rootStyle.includes('--pui-form-duration:1ms'));
  assert.strictEqual(reduced.instance.data.normalizedResetType, 'initial');
  assert.strictEqual(reduced.instance.data.normalizedScrollToFirstError, '');

  const wxml = fs.readFileSync(path.join(root, 'form/form.wxml'), 'utf8');
  const wxss = fs.readFileSync(path.join(root, 'form/form.wxss'), 'utf8');
  const json = JSON.parse(fs.readFileSync(path.join(root, 'form/form.json'), 'utf8'));
  const metadata = require(path.join(root, 'metadata/components.js'));
  const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
  const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
  const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
  const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
  const contract = fs.readFileSync(path.join(root, 'docs/components/FORM.md'), 'utf8');

  assert(wxml.includes('<form'));
  assert(wxml.includes('bindsubmit="onNativeSubmit"'));
  assert(wxml.includes('bindreset="onNativeReset"'));
  assert.strictEqual((wxml.match(/<slot\b/g) || []).length, 1);
  assert(!/<pui-input|<pui-button/.test(wxml), 'Form owns no fixed consumer fields or actions');
  assert.deepStrictEqual(json.usingComponents || {}, {});
  assert(!/display\s*:\s*none|height\s*:\s*auto/.test(wxss));
  const rootRule = wxss.match(/\.pui-form \{[\s\S]*?\}/)[0];
  ['background: transparent', 'border: 0', 'border-radius: 0', 'box-shadow: none', 'padding: 0'].forEach((rule) => assert(rootRule.includes(rule)));

  assert.deepStrictEqual(metadata.apiProps.form, PROPS);
  assert.deepStrictEqual(metadata.apiEvents.form.map((item) => item.name), ['validate', 'submit', 'reset']);
  assert.deepStrictEqual(metadata.apiSlots.form.map((item) => item.name), ['default']);
  assert.deepStrictEqual(metadata.apiMethods.form.map((item) => item.name), ['validate(options?)', 'submit(options?)', 'reset(options?)', 'clearValidate(fields?)', 'setValidateMessage(messages)']);
  ['基础用法', '校验与反馈', '组合字段'].forEach((title) => assert(preview.includes(`<h3>${title}</h3>`)));
  assert(preview.includes('function bindFormPreviewRuntime(props)'));
  assert(preview.includes("formEventOrder = ['validate', 'submit']"));
  assert(preview.includes("action === 'form-field-input' && previewIdFor(state.current) === 'form'"));
  const usageBlock = preview.slice(preview.indexOf("if (runtimeId === 'form')"), preview.indexOf("if (runtimeId === 'button')"));
  assert(usageBlock.includes('"pui-button": "poemui-miniprogram/button/button"'));
  assert(usageBlock.includes('<pui-button variant="outline" form-type="reset">重置</pui-button>'));
  assert(usageBlock.includes('<pui-button form-type="submit">提交</pui-button>'));
  assert(!usageBlock.includes('bind:'), 'Form basic usage contains zero event bindings');
  assert(!preview.includes('formFields(props.items)'));
  assert(previewStyles.includes('.pui-form-preview {'));
  assert(api.includes('Form：可组合父容器与真实规则校验'));
  assert(compatibility.includes('Form 的 H5 镜像必须与原生共享 7 Props'));
  assert(contract.includes('7 Props / 3 Events / 1 Slot / 5 Methods'));

  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    const sourceFile = fs.readFileSync(path.join(root, `form/form.${extension}`));
    const distFile = fs.readFileSync(path.join(root, `miniprogram_dist/form/form.${extension}`));
    assert(sourceFile.equals(distFile), `source and miniprogram_dist form.${extension} must match`);
  });

  process.stdout.write('Form contract tests passed.\n');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
