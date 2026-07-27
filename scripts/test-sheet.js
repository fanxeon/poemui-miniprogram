const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'sheet/sheet.js');
const source = fs.readFileSync(sourcePath, 'utf8');
let definition = null;
let timerId = 0;
let timers = new Map();

function setTimer(callback, delay) {
  const id = ++timerId;
  timers.set(id, { id, callback, delay: Number(delay) || 0 });
  return id;
}
function clearTimer(id) { timers.delete(id); }
function runNextTimer() {
  const next = [...timers.values()].sort((a, b) => a.delay - b.delay || a.id - b.id)[0];
  if (!next) return null;
  timers.delete(next.id);
  next.callback();
  return next.delay;
}

vm.runInNewContext(source, {
  Component(value) { definition = value; },
  clearTimeout: clearTimer,
  console,
  isFinite,
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    if (request === '../common/utils/platform-info') return { getWindowInfo: () => ({ windowWidth: 375 }) };
    throw new Error(`Unexpected dependency: ${request}`);
  },
  setTimeout: setTimer,
  wx: { getWindowInfo() { return { windowWidth: 375 }; } },
}, { filename: sourcePath });
assert(definition, 'Sheet must register a component definition');

function create(overrides) {
  timers = new Map();
  timerId = 0;
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const expectedProps = [
  'visible', 'defaultVisible', 'title', 'description', 'content', 'showHeader', 'showClose', 'showHandle',
  'draggable', 'dragThreshold', 'velocityThreshold', 'closeOnOverlayClick', 'showOverlay', 'customHeader',
  'showFooter', 'customFooter', 'disabled', 'loading', 'loadingText', 'error', 'errorText', 'retryText',
  'empty', 'emptyText', 'minHeight', 'height', 'maxHeight', 'zIndex', 'safeArea', 'ariaLabel', 'duration',
  'easing', 'reduceMotion',
].sort();
assert.deepStrictEqual(Object.keys(definition.properties).sort(), expectedProps, 'Sheet public Props must remain the documented source contract');

const defaults = create();
assert.strictEqual(defaults.instance.data.innerVisible, false);
assert.strictEqual(defaults.instance.open('programmatic'), true);
assert.deepStrictEqual(JSON.parse(JSON.stringify(defaults.events.map((event) => event.name))), ['input', 'change', 'open']);
assert.strictEqual(defaults.instance.data.innerVisible, true, 'uncontrolled open must update its internal visible state');
assert.strictEqual(runNextTimer(), 500, 'after-open must wait for the real default motion duration');
assert.strictEqual(defaults.events.at(-1).name, 'after-open');

const controlled = create({ visible: true });
assert.strictEqual(controlled.instance.close('close'), true);
assert.strictEqual(controlled.instance.data.innerVisible, true, 'controlled Sheet must wait for parent visible write-back');
assert.deepStrictEqual(JSON.parse(JSON.stringify(controlled.events.slice(0, 3).map((event) => event.name))), ['input', 'change', 'close']);

const error = create({ defaultVisible: true, error: true });
assert.strictEqual(error.instance.retry('button'), true);
assert.deepStrictEqual(JSON.parse(JSON.stringify(error.events.map((event) => event.name))), ['retry']);
const disabled = create({ defaultVisible: true, error: true, disabled: true });
assert.strictEqual(disabled.instance.retry('button'), false, 'disabled Sheet must block retry request');
assert.strictEqual(disabled.instance.onCloseTap(), false, 'disabled Sheet must block close button');
const reduced = create({ defaultVisible: true, reduceMotion: true });
assert.strictEqual(reduced.instance.motionConfig().duration, 1);

const wxml = fs.readFileSync(path.join(root, 'sheet/sheet.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'sheet/sheet.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'sheet/sheet.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/SHEET.md'), 'utf8');
const contractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');
const example = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert(wxml.includes('<pui-popup') && wxml.includes('placement="bottom"'));
assert(wxml.includes('bind:visible-change="onPopupVisibleChange"'));
assert(wxml.includes('<scroll-view scroll-y') && wxml.includes('bindscroll="onScroll"'));
assert(wxml.includes('<slot wx:if="{{customHeader}}" name="header"></slot>'));
assert(wxml.includes('<slot name="footer"></slot>'));
assert(wxml.includes('class="pui-sheet__header-action"'), 'Sheet close Button must live in the dedicated Header end track');
assert(wxml.includes('theme="default" variant="base" shape="circle" size="small" icon="close" icon-only'), 'Sheet default close must be the shared default/base circular icon-only PUI Button');
assert(wxml.includes('class="pui-sheet__footer-content"'), 'Sheet Footer must expose a full-width action track around its Slot');
assert(wxml.includes('<pui-loading') && wxml.includes('<pui-empty') && wxml.includes('bind:click="onRetry"'));
assert.deepStrictEqual(json.usingComponents, {
  'pui-popup': '../popup/popup', 'pui-button': '../button/button', 'pui-empty': '../empty/empty', 'pui-loading': '../loading/loading',
});
assert(!/height:\s*auto[^;]*;[^}]*transition|display:\s*none/.test(wxss), 'Sheet must not fake height or visibility animation');
assert(/\.pui-popup\.pui-sheet\s+\.pui-popup__content\s*\{[\s\S]*?width:\s*100%;[\s\S]*?flex-direction:\s*column;[\s\S]*?padding:\s*0;[\s\S]*?overflow:\s*hidden;[\s\S]*?\}/.test(wxss), 'Popup-backed Sheet must be a vertical zero-inset transport layer; without column flow Header, Body and Footer collapse into one horizontal row');
assert(/\.pui-popup\.pui-sheet\s*\{[\s\S]*?--pui-sheet-header-inset:\s*var\(--pui-surface-inset\);[\s\S]*?\}/.test(wxss), 'Sheet Header outer inset must use the same Surface token as Popup Header');
assert(/\.pui-sheet__handle-area\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?top:\s*var\(--pui-space-xs\);[\s\S]*?width:\s*var\(--pui-space-step-24\);[\s\S]*?min-height:\s*var\(--pui-space-step-12\);[\s\S]*?transform:\s*translateX\(-50%\);[\s\S]*?\}/.test(wxss), 'Sheet drag handle must float in a centered absolute touch track without consuming Header flow');
assert(/\.pui-sheet__header-row\s*\{[\s\S]*?padding:\s*var\(--pui-sheet-header-inset\) var\(--pui-sheet-header-inset\) 0;[\s\S]*?\}/.test(wxss), 'Sheet title row must use the same top and inline inset as Popup Header');
assert(/\.pui-sheet__header-row\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) 72rpx;[\s\S]*?\}/.test(wxss), 'Sheet Header must reserve a fixed right-end rail for the close action');
assert(/\.pui-sheet__header-action\s*\{[\s\S]*?width:\s*72rpx;[\s\S]*?height:\s*72rpx;[\s\S]*?justify-items:\s*end;[\s\S]*?\}/.test(wxss), 'Sheet close action must attach the default circle Button to the Header end edge');
assert(/\.pui-sheet__handle\s*\{[\s\S]*?background:\s*var\(--pui-text-placeholder\);[\s\S]*?\}/.test(wxss), 'Sheet drag handle must remain visible when global neutral borders are disabled');
assert(/\.pui-sheet__footer-content\s*\{[\s\S]*?width:\s*100%;[\s\S]*?flex-direction:\s*column;[\s\S]*?align-items:\s*stretch;[\s\S]*?\}/.test(wxss), 'Sheet Footer action track must stretch one primary action to the full available width');
assert(/\.pui-sheet__footer\s*\{[\s\S]*?width:\s*100%;[\s\S]*?padding:\s*0 var\(--pui-panel-padding\) var\(--pui-panel-padding\);[\s\S]*?\}/.test(wxss), 'Sheet Footer must own a full-width Surface region with one inset policy');

const sheetShowcase = preview.slice(preview.indexOf('function sheetShowcase('), preview.indexOf('\nfunction bindSheetPreviewRuntime', preview.indexOf('function sheetShowcase(')));
assert(sheetShowcase.includes('const triggerLayer ='), 'Sheet preview must derive a single persistent trigger layer');
assert(sheetShowcase.includes('pui-sheet-showcase__trigger') && sheetShowcase.includes('data-sheet-trigger-layer'));
assert(sheetShowcase.includes("theme: 'default', variant: 'base', shape: 'circle', size: 'small', icon: 'close', iconOnly: true"), 'Sheet H5 preview must mirror the default/base circular icon-only close Button');
assert(sheetShowcase.includes('pui-sheet-preview__header-action'), 'Sheet H5 preview must reserve an explicit Header end rail');
assert(/\.pui-sheet-preview__handle\s*\{[\s\S]*?background:\s*var\(--subtle\);[\s\S]*?\}/.test(previewStyles), 'Sheet H5 drag handle must not inherit the border-off token');
assert(/\.pui-sheet-preview__handle-area\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?width:\s*var\(--pui-preview-space-step-24\);[\s\S]*?min-height:\s*var\(--pui-preview-space-step-12\);[\s\S]*?transform:\s*translateX\(-50%\);[\s\S]*?\}/.test(previewStyles), 'Sheet H5 handle must float in the same absolute centered track');
assert(/\.pui-sheet-preview__head\s*\{[\s\S]*?padding:\s*var\(--pui-preview-panel-padding\) var\(--pui-preview-panel-padding\) var\(--pui-preview-space-step-8\);[\s\S]*?\}/.test(previewStyles), 'Sheet H5 Header must use the Popup-aligned outer inset');
assert(!sheetShowcase.includes('if (!current.mounted)'), 'hidden and opened Sheet states must not return mutually exclusive preview roots');
assert(sheetShowcase.includes('const layer = current.mounted ?'), 'only the floating layer may mount and unmount');
assert(sheetShowcase.indexOf('${triggerLayer}') < sheetShowcase.indexOf('${layer}'), 'Sheet overlay must layer above the retained trigger');
assert(sheetShowcase.includes('data-sheet-preview-host data-sheet-phase'));
assert(sheetShowcase.includes('data-sheet-live') && !sheetShowcase.includes('data-sheet-event'));
assert(preview.includes("const status = document.querySelector('#previewStage [data-sheet-live]');"));
assert(preview.includes('function updateSheetPreviewDom(demo)'));
assert(preview.includes("scheduleSheetPreviewPhase(demo, 16, 'entering')"));
assert(preview.includes("scheduleSheetPreviewPhase(demo, sheetMotionDuration(props), 'leaving')"));
assert(preview.includes('if (existingHost && demo.sheetMounted)'));
const sheetActionBranches = preview.slice(preview.indexOf("} else if (type === 'sheet-preview-open')"), preview.indexOf("} else if (type === 'popover-trigger')"));
assert((sheetActionBranches.match(/return;/g) || []).length >= 7, 'Sheet lifecycle and action branches must return before a Stage rebuild');
assert(!sheetActionBranches.includes('renderStage()'), 'Sheet lifecycle and action branches must not replace the preview root during motion');
const sheetStyleStart = previewStyles.indexOf('/* Sheet mirror: a persistent trigger scene');
const sheetStyleEnd = previewStyles.indexOf('/* DropdownMenu', sheetStyleStart);
const sheetStyles = previewStyles.slice(sheetStyleStart, sheetStyleEnd);
assert(sheetStyles.includes('.pui-sheet-showcase__trigger'));
assert(/\.pui-sheet-preview-host\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?inset:\s*0;[\s\S]*?pointer-events:\s*none;/.test(sheetStyles), 'Sheet host must be a transparent full-viewport layout layer');
assert(sheetStyles.includes('.pui-sheet-preview-host > :is(.pui-sheet-preview__overlay, .pui-sheet-preview)'));
const sheetHostBlock = sheetStyles.match(/\.pui-sheet-preview-host\s*\{([^}]*)\}/)?.[1] || '';
assert(!/(?:background:|border:|border-radius:)/.test(sheetHostBlock), 'transparent Sheet host must not create a second Surface');

const sheetApi = api.slice(api.indexOf('## Sheet'), api.indexOf('## Dialog'));
assert(sheetApi.includes('`error > loading > empty > content`') && sheetApi.includes('`after-open`、`after-close`'));
assert(compatibility.slice(compatibility.indexOf('23. Sheet'), compatibility.indexOf('24. DateTimePicker')).includes('底层入口'));
for (const heading of ['## 1. 组件定位', '## 2. 固定结构与区域', '## 3. PUI 组合与依赖', '## 4. Token、间距与排版', '## 5. 内容、Slot 与组合边界', '## 6. 状态与优先级', '## 7. 交互、受控边界与事件', '## 8. 可访问性', '## 9. H5 预览与跨端一致性', '## 10. 响应式、主题与视觉配置', '## 11. 明确禁止', '## 12. 修改闭环']) assert(contract.includes(heading), `Sheet contract must include ${heading}`);
assert(contract.includes('tdesign-miniprogram@1.15.3'));
assert(contractIndex.includes('[Sheet](./SHEET.md)'));
assert(example.includes('<pui-sheet') && example.includes('bind:drag-end="onSheetDragEnd"'));

if (process.env.PUI_VERIFY_DIST === '1') {
  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    const sourceFile = path.join(root, `sheet/sheet.${extension}`);
    const distFile = path.join(root, `miniprogram_dist/sheet/sheet.${extension}`);
    assert(fs.existsSync(distFile), `generated Sheet ${extension} must exist`);
    assert(fs.readFileSync(sourceFile).equals(fs.readFileSync(distFile)), `generated Sheet ${extension} must match source`);
  });
}

console.log('Sheet component contract tests passed');
