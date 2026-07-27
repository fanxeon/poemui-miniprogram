const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const app = read('preview/app.js');
const styles = read('preview/styles.css');
const docs = [
  read('AGENTS.md'),
  read('docs/UI_DESIGN_CONTRACT.md'),
  read('docs/PREVIEW_INFORMATION_HIERARCHY.md'),
  read('docs/H5_PREVIEW_COMPATIBILITY.md'),
].join('\n');

function functionBlock(name) {
  const start = app.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  const next = app.indexOf('\nfunction ', start + 10);
  return app.slice(start, next >= 0 ? next : app.length);
}

const controls = functionBlock('ensureComponentViewActionControl');
for (const contract of [
  'iconButtonSample({',
  "id: 'componentViewAction'",
  "icon: 'refresh'",
  "demoAction: 'refresh-preview'",
  "id: 'componentResetAction'",
  "icon: 'undo'",
  "demoAction: 'reset-component'",
  "ariaLabel: '重置为组件默认样式'",
  "id: 'componentCopyAction'",
  "icon: 'copy'",
  "demoAction: 'copy-current-code'",
]) {
  assert(controls.includes(contract), `preview action controls are missing ${contract}`);
}
assert(!controls.includes('<button'), 'preview actions must use PUI IconButton helpers');

const shell = functionBlock('syncShell');
assert(shell.includes("const resetAction = document.querySelector('#componentResetAction')"));
assert(shell.includes("const standardOverview = overview && state.current !== 'icon'"));
assert(shell.includes("viewAction.classList.toggle('is-action-hidden', !standardOverview)"));
assert(shell.includes("resetAction.classList.toggle('is-action-hidden', !standardOverview)"));

const propWorkspace = functionBlock('propWorkspaceMarkup');
assert(propWorkspace.includes("const resetLabel = documentation ? '重置当前文档筛选' : '重置为组件默认样式'"));
assert(propWorkspace.includes("id: 'propResetAction'"));
assert(propWorkspace.includes("demoAction: 'reset-component'"));

const refresh = functionBlock('refreshCurrentPreview');
assert(!refresh.includes('delete state.props[state.current]'), 'refresh must preserve current Props');

const reset = functionBlock('resetCurrentComponent');
assert(reset.includes('delete state.props[state.current]'), 'reset must restore the component default Props source');
assert(reset.includes('state.previewElementSelection = null'), 'reset must clear stale element selection');
assert(reset.includes('refreshCurrentPreview()'), 'reset must also restore the default runtime state');

assert(app.includes("action === 'refresh-preview' && !isDocumentationPage(state.current) && state.view === 'overview'"));
assert(app.includes("action === 'reset-component' && (isDocumentationPage(state.current) || ['overview', 'prop'].includes(state.view))"));
assert(app.includes("document.querySelector('#preview').addEventListener('click'"), 'Overview and PROP reset actions must share one delegated write-back path');

assert(styles.includes('--pui-preview-actions-group-width: calc((var(--pui-preview-actions-row-height) * 3) + (var(--pui-preview-content-gap) * 2))'));
assert(styles.includes('.preview-utility-toolbar__right .component-view-action-mount'));
assert(styles.includes('flex: 0 0 var(--pui-preview-actions-group-width)'));
assert(styles.includes('gap: var(--pui-preview-content-gap)'));
assert(styles.includes('.component-view-action-mount > .is-action-hidden'));
assert(styles.includes('.component-view-action-mount > .icon-button.pui-button'));

for (const phrase of ['概览同时提供刷新与重置', '刷新保留当前 Props', '重置为组件默认 Props 与默认运行态', '属性` 只在 Props 标题区提供同一个重置']) {
  assert(docs.includes(phrase), `governance docs must include ${phrase}`);
}

console.log('Preview component reset contract passed.');
