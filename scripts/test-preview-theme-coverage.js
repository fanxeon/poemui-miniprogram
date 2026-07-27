const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const docs = [
  'AGENTS.md',
  'CONTRIBUTING.md',
  'docs/UI_DESIGN_CONTRACT.md',
  'docs/H5_PREVIEW_COMPATIBILITY.md',
].map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');

function functionBlock(name) {
  const start = app.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  const next = app.indexOf('\nfunction ', start + 10);
  return app.slice(start, next >= 0 ? next : app.length);
}

function ruleBlock(selector) {
  const start = styles.indexOf(selector);
  assert(start >= 0, `missing theme surface selector: ${selector}`);
  const open = styles.indexOf('{', start);
  const close = styles.indexOf('}', open);
  return styles.slice(open + 1, close);
}

function hasRuleDeclaration(selector, declaration) {
  let cursor = 0;
  while ((cursor = styles.indexOf(selector, cursor)) >= 0) {
    const open = styles.indexOf('{', cursor);
    const close = styles.indexOf('}', open);
    if (open >= 0 && close >= 0 && styles.slice(open + 1, close).includes(declaration)) return true;
    cursor += selector.length;
  }
  return false;
}

const select = functionBlock('selectControlSample');
for (const contract of [
  'buttonSample({',
  "role: 'combobox'",
  "role: 'option'",
  'class="pui-sr-only pui-select-control__native"',
  'aria-hidden="true"',
  'role="listbox"',
  'popover="manual"',
  "iconComponent('chevron-down'",
  "iconComponent('check'",
]) assert(select.includes(contract), `shared PUI Select must include ${contract}`);

for (const helper of ['openSelectControl', 'closeSelectControl', 'positionSelectControlMenu', 'commitSelectControlOption']) {
  assert(app.includes(`function ${helper}(`), `shared PUI Select must implement ${helper}`);
}
const commit = functionBlock('commitSelectControlOption');
assert(commit.includes("new Event('input', { bubbles: true })"));
assert(commit.includes("new Event('change', { bubbles: true })"));
assert(app.includes("event.target.closest('[data-select-control-trigger]')"));
assert(app.includes("event.target.closest('[data-select-control-option]')"));
assert(app.includes("['ArrowDown', 'ArrowUp', 'Home', 'End']"));
const propsInput = functionBlock('handlePropsPanelInput');
assert(propsInput.includes("nextControl.matches('.pui-select-control__native')"));
assert(propsInput.includes("querySelector('[data-select-control-trigger]')"));
assert(propsInput.includes("focus({ preventScroll: true })"));

const selectMenu = ruleBlock('body .app-shell[data-page-mode] .pui-select-control__menu[popover]');
for (const contract of [
  'color: var(--text)',
  'color-scheme: inherit',
  'background: var(--surface-solid)',
  'border: 1px solid var(--border)',
  'border-radius: var(--pui-preview-radius-control)',
]) assert(selectMenu.includes(contract), `shared PUI Select menu must include ${contract}`);

assert(styles.includes('.app-shell {\n  min-height: 100vh;\n  overflow-x: hidden;\n  color-scheme: light;'));
assert(styles.includes('.app-shell[data-theme="dark"] {\n  color-scheme: dark;'));
assert(styles.includes('.app-shell :is(input, select, textarea, option, optgroup)'));
assert(styles.includes('.app-shell select option,\n.app-shell select optgroup'));
assert(styles.includes('background-color: var(--surface-solid)'));
assert(!styles.includes('.pui-select-control select {'), 'visible shared Select must not fall back to native browser menu styling');

const themedSurfaces = [
  ['body .app-shell[data-page-mode] .preview-stage .pui-popover-preview--light', 'background: var(--surface-solid)'],
  ['body .app-shell[data-page-mode] .preview-stage .pui-dropdown-slim__panel', 'background: var(--surface-solid)'],
  ['body .app-shell[data-page-mode] .preview-stage .pui-combobox-preview__panel-inner', 'background: var(--surface)'],
  ['.pui-navigation-menu-preview__panel', 'background: var(--preview-surface, var(--surface))'],
  ['.app-shell .global-search-dialog.pui-dialog', 'background: var(--surface-solid)'],
  ['.appearance-menu__panel', 'background: var(--surface-solid)'],
];
for (const [selector, declaration] of themedSurfaces) {
  assert(hasRuleDeclaration(selector, declaration), `${selector} must consume ${declaration}`);
}

for (const phrase of ['菜单', '浮层', '深浅色', 'color-scheme', '共享 PUI Select', '原生 select']) {
  assert(docs.includes(phrase), `theme governance docs must include ${phrase}`);
}

console.log('Preview light/dark menu and overlay coverage contract passed.');
