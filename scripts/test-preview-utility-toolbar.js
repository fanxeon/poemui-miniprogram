const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('preview/index.html');
const app = read('preview/app.js');
const styles = read('preview/styles.css');
const docs = [
  read('AGENTS.md'),
  read('docs/UI_DESIGN_CONTRACT.md'),
  read('docs/PREVIEW_INFORMATION_HIERARCHY.md'),
  read('docs/H5_PREVIEW_COMPATIBILITY.md'),
].join('\n');

const toolbarStart = html.indexOf('id="previewUtilityToolbar"');
const modeStart = html.indexOf('id="previewModeMount"', toolbarStart);
const rightStart = html.indexOf('class="preview-utility-toolbar__right"', modeStart);
const deviceStart = html.indexOf('id="deviceSelectMount"', rightStart);
const actionsStart = html.indexOf('id="componentViewActionMount"', deviceStart);
const stageStart = html.indexOf('id="previewStage"', actionsStart);

assert(toolbarStart >= 0, 'Overview must own a unified preview utility toolbar');
assert(toolbarStart < modeStart && modeStart < rightStart && rightStart < deviceStart && deviceStart < actionsStart && actionsStart < stageStart,
  'mode controls must stay left and device/refresh/reset must form the right group before PreviewDevice');
assert(!html.includes('id="componentViewActions"'), 'the Header must not keep a second action row');
assert(!html.includes('<select id="deviceSelect"') && !html.includes('<button id="componentViewAction"'),
  'the toolbar must mount shared PUI controls instead of static native controls');

for (const contract of [
  '.preview-utility-toolbar {',
  'justify-content: space-between;',
  'padding-block-start: var(--pui-preview-content-gap);',
  'background: transparent;',
  'border: 0;',
  'box-shadow: none;',
  'backdrop-filter: none;',
  '.preview-utility-toolbar__right {',
  'justify-content: flex-end;',
  'margin-left: auto;',
  '--pui-site-preview-device-control-width: 180px;',
  'flex: 0 0 var(--pui-site-preview-device-control-width);',
  '@media (max-width: 700px)',
  'flex-wrap: wrap;',
]) {
  assert(styles.includes(contract), `preview utility toolbar CSS is missing ${contract}`);
}

assert(styles.includes('--pui-site-preview-utility-toolbar-height: calc(var(--pui-preview-actions-row-height) + var(--pui-preview-content-gap));'),
  'desktop toolbar semantic height must include its top content-gap padding');
assert(styles.includes('--pui-site-preview-utility-toolbar-height-mobile: calc((var(--pui-preview-actions-row-height) * 2) + (var(--pui-preview-content-gap) * 2));'),
  'mobile toolbar semantic height must include top padding and the row gap');

assert(app.includes('selectControlSample({'), 'device selection must reuse the shared PUI Select helper');
assert(app.includes("id: 'componentViewAction'"));
assert(app.includes("id: 'componentResetAction'"));
assert(app.includes("id: 'componentCopyAction'"));
assert(app.includes("demoAction: 'copy-current-code'"));
assert(app.includes("id: 'propResetAction'"), 'PROP must keep its own local PUI reset action');
assert(app.includes("const toolbar = document.querySelector('#previewUtilityToolbar')"));
assert(app.includes('toolbar.hidden = !(available || iconOverview)'), 'the Overview toolbar must leave API/PROP views clean while Icon keeps copy-only overview');
assert(app.includes("iconOverview ? 'copy-only' : 'unavailable'"), 'Icon overview must expose only its same-source copy action');

for (const phrase of ['模式切换在左', '机型、刷新、重置和复制', '右对齐', '透明工具栏']) {
  assert(docs.includes(phrase), `governance docs must include ${phrase}`);
}

console.log('Preview utility toolbar contract passed.');
