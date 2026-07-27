const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const { groups } = require(path.join(root, 'metadata/components'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
const designContract = fs.readFileSync(path.join(root, 'docs/UI_DESIGN_CONTRACT.md'), 'utf8');

function functionBlock(name) {
  const start = preview.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  const next = preview.indexOf('\nfunction ', start + 10);
  return preview.slice(start, next >= 0 ? next : preview.length);
}

const device = functionBlock('renderPreviewDevice');
assert(device.includes('renderOverviewComponentPreview(detail.id, props)'), 'standard component overview must use the component-only renderer');
assert(!device.includes('${renderComponentPreview(detail.id, props)}'), 'PreviewDevice must not mount raw engineering showcase markup');
assert(!device.includes('phone--${state.theme}'), 'PreviewDevice must inherit the global neutral theme instead of a component-local indigo palette');
assert(device.includes("edgeToEdgePreviewIds.has(previewId) || (previewId === 'calendar' && props.usePopup) ? 'edge-to-edge' : 'shadow-safe'"), 'PreviewDevice must choose a semantic parent layout for each component, including Calendar popup mode');
assert(device.includes('preview-device__component-layout--${layoutMode}'), 'PreviewDevice must mount the shared component parent layout inside its scroll viewport');
assert(device.includes('data-preview-scroll-contract="component-preview"'), 'PreviewDevice viewport must expose the shared component-preview scroll contract');
assert(device.includes('data-preview-scroll-area="preview-device"'), 'PreviewDevice viewport must explicitly be the shared Preview ScrollArea');
assert(device.includes('data-preview-scroll-gradient="top"') && device.includes('data-preview-scroll-gradient="bottom"'), 'PreviewDevice ScrollArea must expose default top and bottom gradient siblings');
assert(preview.includes('function syncPreviewDeviceScrollAffordance(viewport)') && preview.includes('function bindPreviewDeviceScrollAffordance(viewport)'), 'PreviewDevice ScrollArea must synchronize overflow and edge state from the real viewport');
assert(preview.includes('syncPreviewDeviceScrollAffordance(previewViewport);'), 'PreviewDevice scroll events must update the default gradient visibility');
assert(preview.includes('function bindPreviewPointerDragScroll(viewport)') && preview.includes('bindPreviewPointerDragScroll(previewViewport);'), 'PreviewDevice and every nested real scroll list must support pointer drag scrolling in normal mode');
assert(preview.includes("[viewport, ...viewport.querySelectorAll('*')]") && preview.includes('getComputedStyle(node).overflowY'), 'the shared drag-scroll helper must discover all real nested scroll ports instead of keeping a component allowlist');
assert(preview.includes("const nearest = event.target.closest('[data-preview-drag-scroll=\"true\"]');"), 'nested scroll lists must take drag ownership before their PreviewDevice ancestor');
assert(preview.includes('event.target.closest(blockedTarget)'), 'drag scrolling must preserve native and horizontal component gestures');
assert(previewStyles.includes('[data-preview-drag-scroll="true"] { cursor: grab; }') && previewStyles.includes('.is-pointer-dragging'), 'drag-scroll affordance must expose grab and grabbing cursor states');
for (const previewId of ['dialog', 'popup', 'sheet', 'dropdown-menu', 'navbar', 'sidebar', 'tabbar', 'toast']) {
  assert(preview.includes(`'${previewId}',`), `screen-attached preview must be classified edge-to-edge: ${previewId}`);
}

const stage = functionBlock('renderStage');
assert(stage.includes('stage.innerHTML = renderPreviewDevice(detail, props);'), 'Overview must mount PreviewDevice directly without a redundant visible canvas panel');
assert(!stage.includes('<section class="preview-canvas"'), 'Overview must not wrap PreviewDevice in another canvas surface');

const catalogRoutes = groups.flatMap((group) => group.items);
const routeIds = catalogRoutes.map((item) => item.id);
const nonDeviceRouteIds = new Set([
  'getting-started',
  'theme-tokens',
  'color',
  'spacing',
  'style-utilities',
  'typography',
  'shadcn-chart',
  'icon',
]);
const standardPreviewRoutes = catalogRoutes.filter((item) => !nonDeviceRouteIds.has(item.id));
assert.strictEqual(routeIds.length, 76, 'the public catalog must remain the single route source for preview coverage after retired component cleanup');
assert.strictEqual(standardPreviewRoutes.length, routeIds.length - nonDeviceRouteIds.size, 'every standard component route must be covered by the shared PreviewDevice viewport');
assert.deepStrictEqual(
  routeIds.filter((id) => nonDeviceRouteIds.has(id)).sort(),
  [...nonDeviceRouteIds].sort(),
  'only documentation, unreleased Chart and the Icon resource library may opt out of a component PreviewDevice',
);
assert(stage.includes('if (isDocumentationPage(state.current))'), 'documentation routes must exit before component preview rendering');
assert(stage.includes("if (state.current === 'icon')"), 'the Icon resource library must keep its dedicated non-device renderer');
assert.deepStrictEqual(
  [...stage.matchAll(/state\.current\s*===\s*'([^']+)'/g)].map((match) => match[1]).filter((id) => id !== 'icon'),
  [],
  'standard component routes must not add private render-stage exceptions that bypass the shared scroll viewport',
);
assert(stage.indexOf('stage.innerHTML = renderPreviewDevice(detail, props);') > stage.indexOf("if (state.current === 'icon')"), 'all non-document, non-Icon overview routes must fall through to PreviewDevice');

assert(previewStyles.includes('--pui-preview-device-surface: var(--preview-stage-surface, var(--page))'), 'PreviewDevice must share the standard page/stage surface');
assert(/\.preview-device__viewport\s*\{[\s\S]*?height:\s*100%;[\s\S]*?overflow-y:\s*auto;/.test(previewStyles), 'the shared PreviewDevice viewport must be the real vertical scrolling context for every standard component preview');
assert(/\.preview-device__viewport\s*\{[\s\S]*?scrollbar-gutter:\s*stable both-edges;/.test(previewStyles), 'PreviewDevice must reserve symmetric scrollbar gutters so every preview stays geometrically centered');
assert(previewStyles.includes('.preview-device__scroll-gradient--top') && previewStyles.includes('.preview-device__scroll-gradient--bottom'), 'shared PreviewDevice ScrollArea must style both gradient overlays');
assert(previewStyles.includes('has-preview-scroll-overflow') && previewStyles.includes('pointer-events: none;'), 'PreviewDevice gradients must be non-interactive and depend on real overflow state');
assert(/\.preview-device__component-layout--shadow-safe\s*\{[\s\S]*?grid-template-rows:\s*minmax\(0,\s*auto\);[\s\S]*?height:\s*auto;[\s\S]*?min-height:\s*100%;[\s\S]*?align-content:\s*start;[\s\S]*?padding:\s*var\(--pui-preview-component-layout-padding\);/.test(previewStyles), 'shadow-safe layout must grow with overflowing content while retaining the shared safety padding');
assert(/\.preview-device__component-layout--shadow-safe\s*>\s*\*\s*\{[\s\S]*?height:\s*auto;[\s\S]*?min-height:\s*100%;/.test(previewStyles), 'normal component preview roots must fill short previews and grow naturally when content overflows');
assert(!/\.preview-device__component-layout--shadow-safe\s*>\s*\*\s*\{[\s\S]*?padding-bottom:\s*var\(--pui-preview-component-layout-padding\);/.test(previewStyles), 'normal preview roots must rely on the parent safety padding so long content receives exactly one bottom inset');
assert(/\.preview-device__component-layout--edge-to-edge > \*\s*\{[\s\S]*?height:\s*100%;[\s\S]*?min-height:\s*0;/.test(previewStyles), 'every edge-to-edge component preview root must fill the full PreviewDevice viewport');
assert(/\.pui-dialog-showcase__stage\.is-active\s*\{[^}]*background:\s*transparent;[^}]*\}/.test(previewStyles), 'Dialog layout stage must remain transparent while the real scrim and dialog own their surfaces');
for (const transparentLayoutRoot of [
  '.pui-dialog-showcase__stage',
  '.pui-dropdown-slim',
  '.pui-popover-showcase__canvas',
  '.pui-sheet-preview-host',
  '.overlay-box.pui-popup-preview-host',
  '.pui-action-sheet-showcase__canvas',
  '.pui-overlay-showcase',
]) {
  assert(previewStyles.includes(transparentLayoutRoot), `layout-only preview root must be governed by the transparent wrapper contract: ${transparentLayoutRoot}`);
}
assert(/body \.app-shell\[data-page-mode\] \.preview-device__viewport :is\([\s\S]*?\)\s*\{[\s\S]*?background:\s*transparent;[\s\S]*?border:\s*0;[\s\S]*?box-shadow:\s*none;/.test(previewStyles), 'layout-only stage/canvas/host wrappers must not create another visible panel');
assert(/body \.app-shell\[data-page-mode\] \.preview-device__component-layout--edge-to-edge > :is\([\s\S]*?\.pui-dialog-showcase,[\s\S]*?\.pui-overlay-showcase,[\s\S]*?\)\s*\{[\s\S]*?height:\s*100%;[\s\S]*?min-height:\s*100%;/.test(previewStyles), 'floating-layer showcases must fill the edge-to-edge PreviewDevice parent instead of looking like another partial panel');

const diagnostic = functionBlock('isOverviewDiagnosticNode');
for (const contract of [
  "element.classList.contains('pui-showcase-label')",
  "element.classList.contains('showcase-label')",
  "element.hasAttribute('data-popup-event')",
  'overviewNestedDiagnosticClasses.has(className)',
  '/__(?:methods|runtime|platform|meta)$/',
  '/__(?:event|[a-z0-9-]+-event)$/',
  'overviewDirectDiagnosticClasses.has(className)',
  "element.classList.contains('pui-cell')",
  '/__(?:after|boundary|summary|controls|actions|footer|composition)$/',
]) {
  assert(diagnostic.includes(contract), `overview diagnostic boundary missing: ${contract}`);
}
assert(
  diagnostic.indexOf('overviewDirectDiagnosticClasses.has(className)') < diagnostic.indexOf('element.parentElement !== root'),
  'direct diagnostic classes must be removed at any nesting depth, not only as root children',
);

for (const className of [
  'pui-calendar-preview__feedback',
  'pui-checkbox-preview__feedback',
  'pui-count-down-preview__actions',
  'pui-count-down-preview__status',
  'pui-form-preview__result',
  'pui-navbar-preview__feedback',
  'pui-table-preview__actions',
  'pui-table-preview__status',
  'pui-progress-demo__status',
  'pui-tabs-preview__feedback',
  'pui-upload-preview__feedback',
]) {
  assert(preview.includes(`'${className}',`), `component-only diagnostic allowlist must remove ${className} before live DOM`);
}

for (const replacement of [
  '边界状态与滑动',
  '状态与交互',
  '当前页面：',
  '输入内容会即时更新。',
  '点击遮罩会请求关闭。',
]) {
  assert(preview.includes(replacement), `component-only copy normalization must keep user language: ${replacement}`);
}

for (const showcaseRoot of [
  'demo-section pui-navbar-showcase',
  'demo-section pui-calendar-showcase',
  'demo-section pui-loading-showcase',
  'demo-section pui-radio-showcase',
]) {
  assert(preview.includes(showcaseRoot), `standard preview root must join component-only normalization: ${showcaseRoot}`);
}

const overview = functionBlock('renderOverviewComponentPreview');
for (const contract of [
  "document.createElement('template')",
  "template.content.querySelector('.demo-section')",
  'isOverviewDiagnosticNode(element, root)',
  'element.remove()',
  'document.createTreeWalker(root, NodeFilter.SHOW_TEXT)',
  'normalizeOverviewCopy(node.nodeValue',
  "root.dataset.previewContract = 'component-only'",
]) {
  assert(overview.includes(contract), `overview component-only renderer missing: ${contract}`);
}
assert(!overview.includes('style.display'), 'engineering diagnostics must be removed before live DOM, not hidden with private CSS');

for (const label of ['顶部打开', '左侧打开', '居中打开', '右侧打开', '底部打开', '打开面板', '打开操作面板']) {
  assert(preview.includes(label), `floating overview must keep a user-facing reopen trigger: ${label}`);
}
assert(preview.includes("content: '显示遮罩', demoAction: 'overlay-open'"), 'Overlay overview must keep the real visible trigger instead of a generic floating-panel label');
for (const forbidden of ['Dialog default slot']) {
  assert(!preview.includes(forbidden), `overview-facing copy must not expose ${forbidden}`);
}

for (const contract of [agents, designContract]) {
  assert(contract.includes('概览'), 'design governance must define the Overview boundary');
  assert(contract.includes('工程诊断'), 'design governance must place engineering diagnostics outside Overview');
  assert(contract.includes('真实触发入口'), 'design governance must preserve the real user trigger');
}

console.log('Preview overview component-only hierarchy contract passed.');
