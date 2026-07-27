const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const app = read('preview/app.js');
const html = read('preview/index.html');
const styles = read('preview/styles.css');
const docs = [
  read('AGENTS.md'),
  read('CONTRIBUTING.md'),
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

const toolbar = functionBlock('ensureComponentViewActionControl');
const refreshIndex = toolbar.indexOf("id: 'componentViewAction'");
const resetIndex = toolbar.indexOf("id: 'componentResetAction'");
const copyIndex = toolbar.indexOf("id: 'componentCopyAction'");
assert(refreshIndex >= 0 && refreshIndex < resetIndex && resetIndex < copyIndex,
  'toolbar actions must stay refresh, reset, copy from left to right');
assert(toolbar.includes("icon: 'copy'"));
assert(toolbar.includes("demoAction: 'copy-current-code'"));
assert(toolbar.includes("ariaLabel: '复制当前组件效果代码'"));
assert(!toolbar.includes('<button'), 'toolbar copy must use the shared PUI IconButton helper');

const copyCode = functionBlock('makeCurrentPreviewCopyCode');
for (const contract of [
  'usagePropEntries(detail, props)',
  'makeUsageCode(detail, props)',
  '非默认 Props',
  'pui-config-provider',
  'gradientBackground',
  '临时运行态',
]) {
  assert(copyCode.includes(contract), `current preview copy code is missing ${contract}`);
}

const clipboard = functionBlock('writePreviewClipboard');
assert(clipboard.includes('navigator.clipboard.writeText(text)'));
assert(clipboard.includes("document.execCommand('copy')"));

const feedback = functionBlock('updatePreviewCopyIconButton');
assert(feedback.includes("idle: { icon: 'copy'"));
assert(feedback.includes("success: { icon: 'check'"));
assert(feedback.includes("error: { icon: 'error-circle'"));
assert(feedback.includes("document.querySelector('#previewCopyStatus')"));
assert(feedback.includes('icon.outerHTML = iconComponent'));

assert(app.includes("event.target.closest('[data-demo-action=\"copy-current-code\"]')"));
assert(app.includes('makeCurrentPreviewCopyCode(createDetail(state.current), getProps(state.current))'));
assert(app.includes('await writePreviewClipboard(code)'));
assert(app.includes("updatePreviewCopyIconButton(copyButton, copied ? 'success' : 'error')"));

assert(html.includes('id="previewCopyStatus"'));
assert(html.includes('aria-live="polite"'));
assert(styles.includes('--pui-preview-actions-group-width: calc((var(--pui-preview-actions-row-height) * 3) + (var(--pui-preview-content-gap) * 2));'));
assert(styles.includes('#componentCopyAction[data-copy-state="success"]'));
assert(styles.includes('#componentCopyAction[data-copy-state="error"]'));
assert(styles.includes('.pui-sr-only {'));
assert(styles.includes('position: absolute;'));

for (const phrase of ['复制当前组件效果代码', '只输出非默认 Props', '临时运行态不进入复制代码']) {
  assert(docs.includes(phrase), `governance docs must include ${phrase}`);
}

console.log('Preview current-effect code copy contract passed.');
