const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

assert(html.includes('aria-label="组件用法与元素属性工具"'));
assert(html.indexOf('id="previewStage"') < html.indexOf('id="elementInspectorMount"'), 'code document must stay adjacent to PreviewDevice instead of nesting inside its runtime');

const renderer = functionBlock('renderPreviewCodeDocument');
assert(renderer.includes('previewCodeBlockSample('));
assert(renderer.includes("value: 'reference', label: '组件引用'"));
assert(renderer.includes("value: 'basic', label: '基础用法'"));
assert(renderer.indexOf("label: '组件引用'") < renderer.indexOf("label: '基础用法'"), 'reference section must appear before basic WXML');
assert(!renderer.includes('makeCurrentPreviewCopyCode(detail, props)'), 'visible sections must omit copy-only comments');
assert(renderer.includes('组件用法'));
assert(!renderer.includes('当前效果 · 默认值已省略'));
assert(!renderer.includes('preview-code-document__header'));
assert(renderer.includes('<article class="preview-code-document"'));
assert(renderer.includes("mount.dataset.panelMode = 'code'"));
assert(renderer.includes('sources.dataSection ? previewCodeBlockSample(sources.dataSection, detail, sources.data)'));

const sectionSources = functionBlock('previewCodeSectionSources');
for (const contract of ['starterUsageByComponent[runtimeId]', 'starter?.source || makeUsageCode(detail, props)', 'starter?.wxml || previewWxmlSource(usage)', 'compactPreviewWxml', 'previewUsingComponentsCode']) {
  assert(sectionSources.includes(contract), `visible sections must use Starter Usage with fallback through ${contract}`);
}
assert(sectionSources.includes("label: '页面数据'"), 'data-backed starters must expose copyable page data');
assert(sectionSources.includes("label: '页面逻辑'"), 'imperative starters must expose copyable page logic');
const wxmlSource = functionBlock('previewWxmlSource');
for (const contract of ['stripPreviewUsageComments', '^\\s*<(?!\\/)[a-z][\\w-]*']) {
  assert(wxmlSource.includes(contract), `visible WXML extraction must preserve ${contract}`);
}
const sectionMarkup = functionBlock('previewCodeBlockSample');
for (const contract of ['preview-code-document__section-header', 'preview-code-document__section-title', 'preview-code-document__block', '<h3', '<pre', 'tabindex="0"', 'previewCodeMarkup(source)', 'iconButtonSample({', "demoAction: 'copy-preview-code-section'", "icon: 'copy'", "'preview-code-section': section.value"]) {
  assert(sectionMarkup.includes(contract), `stacked code sections must include ${contract}`);
}
assert(!sectionMarkup.includes('<button'), 'code sections must use the shared PUI IconButton helper');
assert(!app.includes('previewCodeSectionTabsMarkup'));
assert(!app.includes('data-preview-code-section'));

const comments = functionBlock('stripPreviewUsageComments');
for (const contract of ['<!--', '\\/\\*', '^\\s*\\/\\/']) assert(comments.includes(contract), `visible code must remove ${contract} comments`);
const compact = functionBlock('compactPreviewWxml');
for (const contract of ['maxLineLength = 80', 'maxAttributesPerLine = 3', 'previewWxmlAttributeTokens', 'candidate.length <= maxLineLength', 'attributeCounts[currentLine] < maxAttributesPerLine']) assert(compact.includes(contract), `visible WXML must compact attributes with ${contract}`);
const compactContext = {};
vm.runInNewContext([
  functionBlock('previewWxmlTagEnd'),
  functionBlock('previewWxmlAttributeTokens'),
  compact,
].join('\n'), compactContext);
const compactedDialog = compactContext.compactPreviewWxml(`<pui-dialog
  id="delivery-dialog"
  bind:input="onDialogInput"
  bind:open="onDialogOpen"
  bind:close="onDialogClose"
  bind:confirm="onDialogConfirm"
  bind:cancel="onDialogCancel"
  bind:after-open="onDialogAfterOpen"
  bind:after-close="onDialogAfterClose"
>`);
const compactedDialogLines = compactedDialog.split('\n');
assert(compactedDialogLines.every((line) => line.length <= 80), 'sample WXML lines must stay within the 80-character soft boundary');
assert(compactedDialogLines.length >= 4, 'sample WXML must remain grouped instead of collapsing into one long line');
assert(compactedDialogLines.length <= 5, 'sample WXML must not regress to one attribute per line');
const compactedNested = compactContext.compactPreviewWxml(`<view id="scroll-area-source">
  <pui-cell title="组件源码" description="JS、JSON、WXML、WXSS" />
</view>`);
const compactedNestedLines = compactedNested.split('\n');
assert(compactedNestedLines.every((line) => line.length <= 80), 'nested WXML lines must stay within the 80-character soft boundary');
assert(compactedNestedLines.some((line) => line.includes('<view id="scroll-area-source">') && !line.includes('<pui-cell')), 'a child tag must not be appended after its parent opening tag');
assert.strictEqual(
  compactContext.compactPreviewWxml('<pui-popup visible="{{true}}" content="Popup 内容" />'),
  '<pui-popup visible="{{true}}" content="Popup 内容" />',
  'Starter Usage 的标准自闭合空格必须在官网展示与复制链保持不变',
);

const copyCode = functionBlock('makeCurrentPreviewCopyCode');
assert(copyCode.includes('makeUsageCode(detail, props)'), 'toolbar copy must continue to reuse the canonical usage generator');
assert(copyCode.includes('PoemUI 当前预览'), 'toolbar copy may retain environment comments');

const inspector = functionBlock('renderElementInspector');
assert(inspector.includes("state.previewMode === 'normal'"));
assert(inspector.includes('renderPreviewCodeDocument(mount, detail, getProps(state.current))'));
assert(inspector.indexOf("state.previewMode === 'normal'") < inspector.indexOf("state.previewMode !== 'select'"), 'normal code document must render before select-mode Inspector gating');

const lineMarkup = functionBlock('previewCodeLineMarkup');
for (const token of ['previewCodeTokenMarkup', 'escapeHtml', 'pattern.exec']) assert(lineMarkup.includes(token));
const codeMarkup = functionBlock('previewCodeMarkup');
assert(codeMarkup.includes('preview-code-document__line-number'));
assert(codeMarkup.includes('preview-code-document__source'));

for (const contract of [
  '.preview-code-document {',
  'overflow-y: auto',
  'overscroll-behavior: contain',
  'background: transparent',
  'border: 0',
  'box-shadow: none',
  '.preview-code-document__body',
  'flex-direction: column',
  'gap: var(--pui-preview-section-gap)',
  '.preview-code-document__section-title',
  '.preview-code-document__section-header',
  'justify-content: space-between',
  '.preview-code-document__copy.pui-button',
  '.preview-code-document__copy[data-copy-state="success"]',
  '.preview-code-document__copy[data-copy-state="error"]',
  '.preview-code-document__block',
  'background: var(--surface-soft)',
  'border: 1px solid var(--border)',
  'overflow-x: auto',
  'font-family: var(--pui-font-family-mono)',
  'font-feature-settings: "liga" 0, "calt" 0',
  'font-variant-ligatures: none',
  '.preview-code-document__block code',
  'font-family: inherit',
  'font-size: var(--pui-font-size-body-medium)',
  'line-height: var(--pui-line-height-body-medium)',
  'white-space: pre',
  'position: sticky',
  '.preview-code-token--comment',
  '.preview-code-token--tag',
  '.preview-code-token--string',
  '.element-inspector-mount.preview-code-mount',
  '--pui-site-preview-code-gutter: var(--pui-site-page-gutter)',
  '.preview-experience[data-preview-mode="normal"] .preview-stage--overview .preview-device',
  '50cqw - (var(--device-width, var(--pui-preview-device-width-default)) / 2)',
  'transition: transform var(--pui-site-element-inspector-duration) var(--pui-site-element-inspector-ease)',
  '.preview-experience[data-preview-mode="normal"] .preview-code-document',
  'left: var(--pui-site-preview-code-gutter)',
  'width: auto',
  'height: var(--pui-preview-device-height)',
  'grid-template-columns: minmax(0, 1fr)',
  'background: transparent',
  '--pui-site-preview-code-mobile-height: 240px',
]) assert(styles.includes(contract), `normal code document styles must include ${contract}`);

const sectionCopyFeedback = functionBlock('updatePreviewCodeSectionCopyButton');
for (const contract of ["idle: { icon: 'copy'", "success: { icon: 'check'", "error: { icon: 'error-circle'", "document.querySelector('#previewCopyStatus')"]) {
  assert(sectionCopyFeedback.includes(contract), `section copy feedback must include ${contract}`);
}
assert(app.includes("event.target.closest('[data-demo-action=\"copy-preview-code-section\"]')"));
assert(app.includes('previewCodeSectionSources(createDetail(state.current), getProps(state.current))[section]'));
assert(app.includes('await writePreviewClipboard(source)'));
assert(app.includes("updatePreviewCodeSectionCopyButton(copyButton, copied ? 'success' : 'error')"));
assert(styles.includes('right: calc(50% + (var(--device-width, var(--pui-preview-device-width-default)) / 2) + var(--pui-site-element-inspector-offset))'));
assert(styles.includes('height: min(100%, var(--pui-site-element-inspector-height))'));
assert(styles.includes('@media (max-width: 1180px)'));
assert(/@media \(max-width: 1180px\)[\s\S]*?\.element-inspector-mount\.preview-code-mount\s*\{[\s\S]*?position:\s*relative;[\s\S]*?top:\s*auto;[\s\S]*?right:\s*auto;[\s\S]*?bottom:\s*auto;[\s\S]*?left:\s*auto;[\s\S]*?width:\s*calc\(100% - \(var\(--pui-site-page-gutter\) \* 2\)\);[\s\S]*?margin:\s*var\(--pui-preview-content-gap\) var\(--pui-site-page-gutter\) 0;/.test(styles), 'narrow code document must enter normal flow below PreviewDevice');
assert(styles.includes('@media (max-width: 700px)'));
assert(styles.includes('@media (prefers-reduced-motion: reduce)'));
assert(!styles.includes('preview-code-reference-max-height'), 'document flow must not split reference and basic usage into fixed-height panes');
assert(!styles.includes('preview-code-card'), 'normal mode must use document semantics instead of the retired card model');

for (const phrase of ['常规模式左侧', '滚动正文', '基础用法', '组件引用', 'usingComponents', '不显示注释', '80', '每行最多 3 个属性', '行号', 'makeUsageCode', '正文撑满', 'PreviewDevice 恢复居中', '退出绝对定位', 'PreviewDevice 下方正常文档流', '不得覆盖设备']) {
  assert(docs.includes(phrase), `governance docs must include ${phrase}`);
}

console.log('Preview normal-mode component-usage document contract passed.');
