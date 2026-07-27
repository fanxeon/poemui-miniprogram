const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');

function functionBlock(name) {
  const start = preview.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  const next = preview.indexOf('\nfunction ', start + 10);
  return preview.slice(start, next >= 0 ? next : preview.length);
}

const nativeForm = fs.readFileSync(path.join(root, 'form/form.wxml'), 'utf8');
const nativeField = fs.readFileSync(path.join(root, 'field/field.wxml'), 'utf8');
assert(nativeForm.includes('<form'), 'native Form must use the platform form root');
assert(nativeForm.includes('<slot>'), 'native Form must expose one composable default Slot');
assert(!nativeForm.includes('<pui-input'), 'native Form must not own consumer fields');
assert(!nativeForm.includes('<pui-button'), 'native Form must not own consumer actions');
assert(nativeField.includes('<slot>'), 'native Field control must expose a consumer Slot');

const inputControl = functionBlock('inputControlSample');
for (const contract of ["props.invalid ? 'pui-input-preview--error'", 'data-demo-action=', 'data-name=', 'aria-required=']) {
  assert(inputControl.includes(contract), `shared Input helper is missing ${contract}`);
}

const field = functionBlock('fieldPreviewMarkup');
assert(field.includes('inputControlSample({'), 'Field Slot demo must call the shared PUI Input mirror');
assert(field.includes("customClass: 'pui-field-preview__input'"));
assert(field.includes("demoAction: options.inputAction || (options.current ? 'field-input' : '')"));
assert(!field.includes('<input'), 'Field demo must not handwrite the Slot input');
assert(!field.includes('<label class="pui-field-preview'), 'Field root must not nest a platform label root');

const previewInputHandler = preview.slice(
  preview.indexOf("document.querySelector('#previewStage').addEventListener('input'"),
  preview.indexOf("document.querySelector('#previewStage').addEventListener('change'")
);
assert(previewInputHandler.includes("action === 'field-input' && previewIdFor(state.current) === 'field'"));
assert(previewInputHandler.includes("action === 'form-field-input' && previewIdFor(state.current) === 'form'"));
assert(!previewInputHandler.includes("state.current === 'field'"), 'Field aliases must not break Slot input events');

const form = functionBlock('formShowcase');
const formField = functionBlock('formPreviewField');
assert(form.includes('formPreviewField('), 'Form showcase must compose the shared Field mirror');
assert(formField.includes('fieldPreviewMarkup({'), 'Form fields must call the shared PUI Field mirror');
assert(formField.includes("inputAction: options.current && !controlMarkup ? 'form-field-input' : ''"));
assert(formField.includes('controlMarkup'), 'Form must allow real PUI Switch and Radio field controls');
assert(form.includes('buttonSample({'), 'Form actions must continue to call the shared PUI Button mirror');
assert(!form.includes('<input'), 'Form demo must not handwrite field inputs');
assert(!formField.includes('<input'), 'Form field composition must not handwrite inputs');

for (const forbidden of ['.form-demo-card,', '.form-demo-field input', '.form-demo-field.is-error input', '.form-demo-card', '.form-demo-actions', '.pui-field-preview__content .pui-input-preview__control']) {
  assert(!styles.includes(forbidden), `parent layout must not override PUI Input geometry: ${forbidden}`);
}
assert(styles.includes('.pui-field-preview__input { min-width: 0; max-width: 100%; }'));
assert(styles.includes('.pui-form-preview {'));
assert(styles.includes('background: transparent;'));
assert(styles.includes('grid-template-columns: auto minmax(0, 1fr)'));
assert(styles.includes('color: var(--success)'));
assert(styles.includes('color: var(--warning)'));

console.log('Form / Field PUI composition contract tests passed.');
