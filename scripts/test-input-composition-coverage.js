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

for (const component of ['search', 'stepper']) {
  const wxml = fs.readFileSync(path.join(root, component, `${component}.wxml`), 'utf8');
  assert(wxml.includes('<pui-input'), `${component} WXML must compose PUI Input`);
}

const comboboxWxml = fs.readFileSync(path.join(root, 'combobox/combobox.wxml'), 'utf8');
assert(!comboboxWxml.includes('<pui-input'), 'Combobox must remain a selection-only surface; compose Search externally when filtering is needed');

const helper = functionBlock('inputControlSample');
for (const contract of [
  "`pui-input-preview--align-${align}`",
  "props.bordered === false ? 'pui-input-preview--borderless'",
  'const maxLengthAttr =',
  "['min', 'max', 'step']",
  'props.clearAction',
  "props.autofocus ? ' autofocus'",
]) {
  assert(helper.includes(contract), `shared Input helper is missing ${contract}`);
}

const cases = [
  ['searchPreviewMarkup', "customClass: 'pui-search__field'", "demoAction: current ? 'search-input' : ''"],
  ['stepperPreviewMarkup', "customClass: 'pui-stepper__input'", "demoAction: 'stepper-input'"],
];

for (const [name, customClass, action] of cases) {
  const block = functionBlock(name);
  assert(block.includes('inputControlSample({'), `${name} must call the shared PUI Input mirror`);
  assert(block.includes(customClass), `${name} must expose its semantic PUI Input class`);
  assert(block.includes(action), `${name} must preserve its input event contract`);
  assert(!block.includes('<input'), `${name} must not handwrite a native input`);
}

const search = functionBlock('searchPreviewMarkup');
assert(search.includes("prefixIcon: 'search'"));
assert(search.includes('bordered: true'), 'Search 必须把中性边框可见性交给 ConfigProvider，而非本地强制关闭');
assert(search.includes("clearAction: current ? 'search-clear' : ''"));

const stepper = functionBlock('stepperPreviewMarkup');
assert(stepper.includes('size: snapshot.size'));
assert(stepper.includes("align: 'center'"));
assert(stepper.includes('bordered: false'));
assert(stepper.includes('min, max, step'));
assert(stepper.includes("inputMode: props.integer === false ? 'decimal' : 'numeric'"));

const inputHandler = preview.slice(
  preview.indexOf("document.querySelector('#previewStage').addEventListener('input'"),
  preview.indexOf("document.querySelector('#previewStage').addEventListener('change'")
);
// The preview also owns a capture-phase keydown listener for element-selection mode.
// Inspect the main component keyboard handler rather than assuming the first listener owns it.
const keyHandlerStart = preview.lastIndexOf("document.querySelector('#previewStage').addEventListener('keydown'");
const keyHandler = preview.slice(
  keyHandlerStart,
  preview.indexOf("document.querySelector('#previewStage').addEventListener('click'", keyHandlerStart)
);
assert(!inputHandler.includes('旧输入组合层-input'), 'removed 旧输入组合层 interaction must not remain in H5 input handlers');
assert(!keyHandler.includes('旧输入组合层-input'), 'removed 旧输入组合层 keyboard bridge must not remain in H5 input handlers');

for (const forbidden of [
  '.pui-search input',
  '.pui-combobox-preview__search input',
  '.pui-combobox-preview__search button',
  '.pui-stepper__input:disabled',
]) {
  assert(!styles.includes(forbidden), `composition CSS must not target a handwritten native control: ${forbidden}`);
}

assert(styles.includes('.pui-search__field.pui-input-preview'));
assert(styles.includes('.pui-stepper__input.pui-input-preview'));
assert(!styles.includes('.pui-combobox-preview__search.pui-input-preview'), 'Combobox must not retain an internal H5 Input mirror');
assert(styles.includes('.preview-stage .pui-stepper,'), 'Stepper surface must participate in global appearance modes');
assert(styles.includes('body .app-shell[data-page-mode] .preview-stage .pui-stepper,'), 'Stepper surface must use the global radius token');

console.log('Input / Search / Stepper / Combobox PUI Input composition tests passed.');
