const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'field/field.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component(value) { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'field/field.js' });
assert(definition, 'Field component definition must be registered');

const PROPS = [
  'name', 'label', 'help', 'message', 'status', 'required', 'requiredMarkPosition',
  'labelAlign', 'contentAlign', 'labelWidth', 'arrow', 'reduceMotion',
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

assert.deepStrictEqual(Object.keys(definition.properties), PROPS, 'Field publishes the exact 12-Prop contract');
['description:', 'error:', 'disabled:', 'orientation:', 'rules:', 'validate:'].forEach((removed) => {
  assert(!source.includes(removed), `Field keeps removed or unimplemented API out: ${removed}`);
});
assert.deepStrictEqual(Object.keys(definition.methods), ['syncState', 'getFieldName', 'syncFormContext', 'applyFormValidation', 'clearFormValidation', 'scrollIntoView'], 'Field only adds internal Form relation methods');
assert.deepStrictEqual(Object.keys(definition.relations), ['../form/form'], 'Field owns one real Form parent relation');

const defaults = create();
assert(defaults.instance.data.rootClass.includes('pui-field--label-left'));
assert(defaults.instance.data.rootClass.includes('pui-field-row--editable'));
assert(defaults.instance.data.rootClass.includes('pui-field--content-left'));
assert(defaults.instance.data.rootClass.includes('pui-field--status-default'));
assert(defaults.instance.data.rootStyle.includes('--pui-field-label-width:160rpx'));
assert(defaults.instance.data.rootStyle.includes('--pui-field-duration:500ms'));
assert(defaults.instance.data.rootStyle.includes('--pui-field-row-duration:500ms'));
assert.strictEqual(defaults.instance.data.semanticLabel, '字段');
assert.strictEqual(defaults.events.length, 0, 'Field never fabricates business events');

const configured = create({
  name: 'packageName', label: 'npm 包名', help: '发布后不可修改', message: '包名已存在',
  status: 'error', required: true, requiredMarkPosition: 'right', labelAlign: 'right',
  contentAlign: 'right', labelWidth: 500, arrow: true, reduceMotion: true, colorScheme: 'dark',
});
assert(configured.instance.data.rootClass.includes('pui-theme--dark'));
assert(configured.instance.data.rootClass.includes('pui-field--label-right'));
assert(configured.instance.data.rootClass.includes('pui-field--content-right'));
assert(configured.instance.data.rootClass.includes('pui-field--status-error'));
assert(configured.instance.data.rootClass.includes('pui-field--arrow'));
assert(configured.instance.data.rootClass.includes('pui-field--reduced'));
assert(configured.instance.data.rootStyle.includes('--pui-field-label-width:360rpx'));
assert(configured.instance.data.rootStyle.includes('--pui-field-duration:1ms'));
assert.strictEqual(configured.instance.data.normalizedRequiredMarkPosition, 'right');
assert.strictEqual(configured.instance.data.semanticLabel, 'npm 包名');

configured.instance.syncFormContext({ required: true, showErrorMessage: true, reduceMotion: true });
configured.instance.applyFormValidation([{ type: 'warning', message: '服务端需要确认' }], true);
assert.strictEqual(configured.instance.data.effectiveRequired, true, 'Form required context merges with explicit Field state');
assert.strictEqual(configured.instance.data.normalizedStatus, 'warning');
assert.strictEqual(configured.instance.data.displayMessage, '服务端需要确认');
configured.instance.applyFormValidation([{ type: 'error', message: '隐藏的错误详情' }], false);
assert.strictEqual(configured.instance.data.normalizedStatus, 'error', 'hidden Form messages keep the real invalid state');
assert.strictEqual(configured.instance.data.displayMessage, '包名已存在', 'explicit standalone message remains visible when parent messages are hidden');
configured.instance.clearFormValidation();
assert.strictEqual(configured.instance.data.formMessages.length, 0);

const boundary = create({ status: 'danger', labelAlign: 'horizontal', contentAlign: 'center', requiredMarkPosition: 'middle', labelWidth: 9999 });
assert(boundary.instance.data.rootClass.includes('pui-field--status-default'));
assert(boundary.instance.data.rootClass.includes('pui-field--label-left'));
assert(boundary.instance.data.rootClass.includes('pui-field--content-left'));
assert(boundary.instance.data.rootStyle.includes('--pui-field-label-width:360rpx'));
assert.strictEqual(boundary.instance.data.normalizedRequiredMarkPosition, 'left');

const slotLabel = create({ name: 'slotName', label: 'slot' });
assert.strictEqual(slotLabel.instance.data.semanticLabel, 'slotName', 'label Slot falls back to name for semantics');

const wxml = fs.readFileSync(path.join(root, 'field/field.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'field/field.wxss'), 'utf8');
const fieldRowStyles = fs.readFileSync(path.join(root, 'common/style/field-row.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'field/field.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/FIELD.md'), 'utf8');
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const exampleJson = JSON.parse(fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.json'), 'utf8'));
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert.strictEqual((wxml.match(/<slot\b/g) || []).length, 5, 'Field exposes exactly five Slot projections');
['name="label"', 'name="help"', 'name="message"', 'name="extra"', '<slot></slot>'].forEach((slot) => assert(wxml.includes(slot), `Field exposes ${slot}`));
assert(wxml.includes('<pui-icon wx:if="{{arrow}}"'), 'Field arrow composes PUI Icon');
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert(!/<input\b|<button\b|bind:/.test(wxml), 'Field owns no native input/button or business binding');
assert(wxss.includes('grid-template-columns: var(--pui-field-label-width) minmax(0, 1fr) auto'));
assert(wxss.includes('transition: color var(--pui-field-duration)'));
assert(wxss.includes('@import "../common/style/field-row.wxss";'), 'Field imports the shared field-row primitive');
['min-height: 104rpx', 'padding: var(--pui-space-xs) var(--pui-space-normal)', 'background: var(--pui-glass-surface)', 'border-radius: var(--pui-radius-medium)', 'box-shadow: none', 'backdrop-filter: var(--pui-frosted-filter)'].forEach((rule) => assert(fieldRowStyles.includes(rule), `Field-row primitive keeps editable Cell rule: ${rule}`));
assert(wxss.includes('.pui-field__content .pui-input__field'), 'Field flattens the default PUI Input into its editable Cell surface');
assert(wxss.includes('padding: 0 var(--pui-space-sm);'), 'transparent embedded Input retains control-internal horizontal spacing');
assert(wxss.includes('border-radius: var(--pui-radius-medium);'), 'transparent embedded Input retains semantic focus and status radius');

assert.strictEqual(metadata.apiProps.field.length, 12);
assert.strictEqual((metadata.apiEvents.field || []).length, 0);
assert.strictEqual(metadata.apiSlots.field.length, 5);
assert.strictEqual((metadata.apiMethods.field || []).length, 0);
assert.deepStrictEqual(metadata.apiProps.field, PROPS);

const previewHelper = preview.slice(preview.indexOf('function fieldPreviewMarkup('), preview.indexOf('function fieldShowcase('));
const previewShowcase = preview.slice(preview.indexOf('function fieldShowcase('), preview.indexOf('function selectShowcase('));
assert(previewHelper.includes('inputControlSample({'), 'Field H5 default Slot composes shared PUI Input mirror');
assert(!previewHelper.includes('<input'), 'Field H5 never handwrites a raw input');
assert(previewHelper.includes("iconComponent('chevron-right'"), 'Field H5 arrow composes the shared PUI Icon mirror');
assert(previewHelper.includes('data-field-current'), 'Field marks the current instance for runtime-preserving transitions');
['基础用法', '标签与对齐', '必填与帮助', '校验反馈'].forEach((title) => assert(previewShowcase.includes(`<h3>${title}</h3>`), `Field overview includes ${title}`));
assert(previewShowcase.includes("content: 'extra Slot'"), 'Field overview exposes the consumer extra Slot position');
const previewBinder = preview.slice(preview.indexOf('function bindFieldPreviewRuntime('), preview.indexOf('function fieldShowcase('));
assert(previewBinder.includes('demo.fieldRenderedStatus'), 'Field keeps the previous rendered status for a real color transition after preview refresh');
assert(previewBinder.includes("message.classList.add('is-changing')"), 'Field runs a real color animation instead of jumping to the final state after preview refresh');
assert(previewBinder.includes("message.addEventListener('animationstart'"), 'Field records the real browser animation start boundary');
assert(previewBinder.includes("message.addEventListener('animationend'"), 'Field cleans up the temporary animation state on completion');
const usageBlock = preview.slice(preview.indexOf("if (runtimeId === 'field')"), preview.indexOf("if (runtimeId === 'textarea')"));
assert(!usageBlock.includes('bind:'), 'Field basic copied WXML contains zero bind declarations');
assert(usageBlock.includes('<pui-input ${inputAttrs} />'), 'Field copied WXML includes a real PUI Input child');
assert(preview.includes("action === 'field-input' && previewIdFor(state.current) === 'field'"));
assert(previewStyles.includes('.pui-field-showcase > .pui-showcase-section + .pui-showcase-section'));
assert(previewStyles.includes('margin-top: var(--pui-preview-section-gap)'));
const previewRowRoot = previewStyles.match(/\.pui-field-row-preview \{[\s\S]*?\}/)[0];
['min-height: 52px', 'background: var(--surface-solid)', 'border-radius: var(--pui-preview-radius-medium)', 'box-shadow: none', 'backdrop-filter: var(--preview-blur)'].forEach((rule) => assert(previewRowRoot.includes(rule), `Field H5 shared row primitive keeps editable Cell rule: ${rule}`));
assert(previewHelper.includes('bordered: false'), 'Field H5 flattens the shared Input helper into the Field surface');
assert(previewHelper.includes('pui-field-row-preview--editable'), 'Field H5 uses the shared editable field-row preview primitive');
assert(/\.pui-field__content > pui-input,[\s\S]*?flex:\s*1 1 0;[\s\S]*?width:\s*100%;/.test(wxss), 'Field slot must reserve the full control column for a PUI Input');
assert(previewStyles.includes('.pui-field-preview__input .pui-input-preview__control'), 'Field H5 removes the nested Input surface in its normal state');
assert(previewStyles.includes('padding: 0 var(--pui-preview-space-sm);'), 'Field H5 keeps the same embedded Input horizontal spacing');
assert(previewStyles.includes('border-radius: var(--pui-preview-radius-control, var(--pui-preview-radius-medium));'), 'Field H5 keeps the same semantic embedded radius');
assert(previewStyles.includes('body .app-shell[data-page-mode] .preview-stage .pui-field-preview__input .pui-input-preview__control'), 'Field H5 transparent Input must override the later global frosted-input rule');
assert(previewStyles.includes('padding-right: var(--pui-preview-space-sm);\n  padding-left: var(--pui-preview-space-sm);\n  background: transparent;'), 'Field H5 keeps its inset while remaining a transparent single Surface under fruit appearance');
assert(previewStyles.includes('@media (prefers-reduced-motion: reduce)'));
assert(previewStyles.includes('@keyframes pui-field-preview-message-color'));
assert(previewStyles.includes('animation-duration: 1ms'));

assert(api.includes('Field：TDesign FormItem 对照后的 12 Props'));
assert(api.includes('Field 没有公开事件和实例方法'));
assert(/\d+\. Field .*H5 镜像必须.*共享 12 Props/.test(compatibility));
assert(compatibility.includes('通过真实内部 relation 接收 required'));
assert(contract.includes('12 Props / 0 Events / 5 Slots / 0 Methods'));
assert(contract.includes('TDesign Mini Program 1.15.3'));
assert(shadcn.includes("['Field', 'field', 'native', 'none'"));
assert(shadcn.includes('12 Props和5 Slots'));
assert.strictEqual(exampleJson.usingComponents['pui-field'], 'poemui-miniprogram/field/field');
assert(exampleWxml.includes('<pui-field name="componentName" label="组件名称"'));
assert(exampleWxml.includes('<pui-input\n          id="deliveryInput"'));

console.log('Field contract tests passed.');
