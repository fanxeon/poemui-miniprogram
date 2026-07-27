const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const metadata = require(path.join(root, 'metadata', 'components'));
const html = read('preview/index.html');
const app = read('preview/app.js');
const styles = read('preview/styles.css');
const docs = [read('AGENTS.md'), read('docs/UI_DESIGN_CONTRACT.md'), read('docs/PREVIEW_INFORMATION_HIERARCHY.md')].join('\n');

assert(!html.includes('componentKicker') && !app.includes('componentKicker'), 'Header must remove the duplicate category kicker from DOM and runtime');
assert(html.includes('id="stageTitle"') && html.includes('id="stageDescription"'), 'Header must retain one title and one concise summary');
assert(app.includes('componentSummaries[previewId]') && app.includes("'#stageDescription').textContent = detail.summary"), 'Header must consume the concise summary source rather than the technical description');

const previewIds = [...new Set(metadata.groups.flatMap((group) => group.items.map((item) => item.previewId || item.id)))];
for (const id of previewIds) {
  const summary = metadata.componentSummaries[id];
  assert(summary, `${id} is missing its component Header summary`);
  assert([...summary].length <= 28, `${id} summary is too long for the 390px Header`);
  assert(!/(?:Props?|WXML|H5|Slot|slot|runtime|platform|done|beta|experimental)/.test(summary), `${id} summary exposes engineering vocabulary`);
}

for (const contract of [
  '--pui-site-toolbar-padding-block-start: var(--pui-preview-space-step-12);',
  '--pui-site-toolbar-padding-block-end: var(--pui-preview-space-step-12);',
  '--pui-site-toolbar-title-gap: var(--pui-preview-space-xxs);',
  'font-size: var(--pui-font-size-title-medium);',
  'font-size: var(--pui-font-size-body-small);',
  'body .app-shell[data-page-mode="interactive"] .preview-toolbar {',
  'column-gap: var(--pui-site-toolbar-column-gap);',
]) assert(styles.includes(contract), `compact Header CSS is missing ${contract}`);

assert(!/\.preview-description\s*\{[^}]*(?:text-overflow:\s*ellipsis|overflow:\s*hidden)[^}]*\}/.test(styles), 'Header summary must be source-authored instead of visually truncated');
assert(styles.includes('.component-page-tabs__control .pui-tabs-preview__button.pui-button.is-active {'), 'component page Tabs need an explicit active selector');
assert(styles.includes('color: var(--page);') && styles.includes('background: var(--text);'), 'active Tabs must use a high-contrast theme-aware foreground and selected surface');
assert(styles.includes('.component-page-tabs__control .pui-tabs-preview__button.pui-button:focus-visible {'), 'component page Tabs need a visible keyboard focus state');
assert(!styles.includes('--pui-site-tabs-hover-background'), 'page Tabs must not retain a hover-only theme token');
assert(!/\.component-page-tabs__control[^{}]*:hover/.test(styles), 'page Tabs intentionally have no private visual hover selector');
assert(/\.component-page-tabs__control \.pui-tabs-preview__button\.pui-button\s*\{[^}]*background:\s*transparent;[^}]*border-color:\s*transparent;/.test(styles), 'page Tabs must neutralize inherited PUI Button hover surfaces at the base rule');
assert(app.includes("{ value: 'prop', label: '属性' }"), 'the third page tab must use the user-facing 属性 label');
assert(!app.includes("{ value: 'prop', label: 'PROP' }"), 'the old PROP tab label must not return');
assert(app.includes("control.dataset.activeView = state.view"), 'the stable Tabs indicator must consume semantic view state');
const pageTabsRenderer = app.slice(app.indexOf('function renderComponentPageTabs()'), app.indexOf('function ensureComponentViewActionControl()'));
assert(!pageTabsRenderer.includes('indicator.style.left') && !pageTabsRenderer.includes('indicator.style.width'), 'page Tabs must not animate measured left/width geometry');
for (const contract of [
  'grid-template-columns: repeat(3, minmax(0, 1fr));',
  'width: calc(100% / 3);',
  '.component-page-tabs__control[data-active-view="api"] .pui-tabs-preview__indicator {',
  '.component-page-tabs__control[data-active-view="prop"] .pui-tabs-preview__indicator {',
  'transform: translate3d(100%, 0, 0);',
  'transform: translate3d(200%, 0, 0);',
  'transition: transform var(--pui-duration-normal) var(--pui-ease-standard),',
]) assert(styles.includes(contract), `stable transform-only Tabs animation is missing ${contract}`);

for (const phrase of ['分类 Kicker', '短摘要', '高对比选中态']) {
  assert(docs.includes(phrase), `governance docs must include ${phrase}`);
}

console.log(`Compact Header contract passed for ${previewIds.length} page summaries and high-contrast Tabs.`);
