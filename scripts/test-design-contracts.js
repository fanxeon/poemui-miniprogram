const fs = require('fs');
const path = require('path');
const { groups, packageComponents } = require('../metadata/components');

const root = path.resolve(__dirname, '..');

function fail(message) {
  console.error(`PoemUI design contract failed: ${message}`);
  process.exit(1);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

for (const item of groups.flatMap((group) => group.items)) {
  if (!item.nameEn || !/[\u3400-\u9fff]/.test(item.nameZh || '')) {
    fail(`${item.id} must expose separate English and Chinese catalog names.`);
  }
}

const rawControlOwners = {
  button: new Set(['button']),
  input: new Set(['input', 'input-otp']),
  textarea: new Set(['textarea']),
  image: new Set(['icon', 'avatar', 'image', 'watermark']),
  picker: new Set(['picker', 'select', 'date-time-picker']),
};

const requiredButtonComposition = new Set([
  'alert',
  'grid',
  'search',
  'stepper',
]);

const requiredInputComposition = new Set(['search', 'stepper']);

for (const component of packageComponents) {
  const wxml = read(`${component}/${component}.wxml`);
  const wxss = read(`${component}/${component}.wxss`);
  const manifest = JSON.parse(read(`${component}/${component}.json`));
  const declared = new Set(Object.keys(manifest.usingComponents || {}));

  for (const tag of Object.keys(rawControlOwners)) {
    if (new RegExp(`<${tag}\\b`).test(wxml) && !rawControlOwners[tag].has(component)) {
      fail(`${component} must compose an existing PUI component instead of raw <${tag}>.`);
    }
  }

  const usedPuiTags = new Set(Array.from(wxml.matchAll(/<\/?(pui-[a-z0-9-]+)\b/g), (match) => match[1]));
  for (const tag of usedPuiTags) {
    if (!declared.has(tag)) fail(`${component} uses <${tag}> without declaring it in usingComponents.`);
  }

  for (const buttonTag of wxml.matchAll(/<pui-button\b[^>]*>/g)) {
    const variant = buttonTag[0].match(/\bvariant="([^"{]+)"/);
    if (variant && !['base', 'outline', 'dashed', 'text', 'ghost', 'transparent'].includes(variant[1])) {
      fail(`${component} passes unsupported pui-button variant "${variant[1]}".`);
    }
  }

  if (requiredButtonComposition.has(component) && !usedPuiTags.has('pui-button')) {
    fail(`${component} must compose pui-button for its actions.`);
  }

  if (requiredInputComposition.has(component) && !usedPuiTags.has('pui-input')) {
    fail(`${component} must compose pui-input for its editable field.`);
  }

  if (component === 'form' && (!/<form\b/.test(wxml) || !/<slot\b/.test(wxml) || usedPuiTags.size)) {
    fail('form must remain a native form plus composable Slot without fixed consumer controls.');
  }

  for (const match of wxss.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)rpx/g)) {
    if (Number(match[1]) < 24) fail(`${component} contains unreadable fixed font-size ${match[1]}rpx.`);
  }
}

const theme = read('common/style/theme.wxss');
for (const token of [
  '--pui-panel-padding-compact',
  '--pui-panel-padding',
  '--pui-panel-padding-spacious',
  '--pui-section-gap',
  '--pui-content-gap',
  '--pui-font-size-mini',
  '--pui-bg-surface',
  '--pui-shadow-popup',
  '--pui-border',
]) {
  if (!theme.includes(`${token}:`)) fail(`theme is missing shared token ${token}.`);
}

for (const component of [
  'action-sheet',
  'calendar',
  'card',
  'combobox',
  'dialog',
  'dropdown-menu',
  'navigation-menu',
  'popover',
  'popup',
  'sheet',
]) {
  const componentWxss = read(`${component}/${component}.wxss`);
  if (!componentWxss.includes('--pui-panel-padding') && !componentWxss.includes('--pui-surface-inset')) {
    fail(`${component} panel must consume the shared panel padding contract.`);
  }
}

const previewCss = read('preview/styles.css');
if (/\.pui-dialog\s*>\s*div\s*\{/.test(previewCss)) {
  fail('H5 Dialog must not style every direct div; semantic Header and Content regions need independent layout ownership.');
}
for (const match of previewCss.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/g)) {
  if (Number(match[1]) < 12) fail(`preview contains unreadable fixed font-size ${match[1]}px.`);
}
for (const match of previewCss.matchAll(/line-height\s*:\s*(\d+(?:\.\d+)?)px/g)) {
  if (Number(match[1]) < 16) fail(`preview contains unreadable fixed line-height ${match[1]}px.`);
}

for (const token of [
  '--pui-preview-panel-padding-compact',
  '--pui-preview-panel-padding',
  '--pui-preview-panel-padding-spacious',
  '--pui-preview-section-gap',
  '--pui-preview-content-gap',
  '--pui-preview-doc-title-size',
  '--pui-preview-doc-body-size',
  '--pui-preview-doc-section-size',
  '--pui-preview-doc-meta-size',
]) {
  if (!previewCss.includes(`${token}:`)) fail(`preview is missing ${token}.`);
}

const uiContract = read('docs/UI_DESIGN_CONTRACT.md');
for (const required of [
  '36rpx',
  '28rpx',
  '20rpx',
  '16rpx',
  '12rpx',
  '8rpx',
  '`--pui-section-gap`',
  '`header-left`',
  'Header、Content、Footer',
  '概览 / API / 属性',
  '右侧 Inspector',
]) {
  if (!uiContract.includes(required)) fail(`global UI contract is missing ${required}.`);
}

const sharedRulesIndex = read('docs/COMPONENT_RULES_INDEX.md');
for (const required of [
  '# PoemUI 本轮组件共用规则索引',
  '`blur=true || Provider.frostedGlass=true`',
  '二者关闭时没有 `backdrop-filter`',
  '`equalSpacing`',
  'PUI-FB-0335',
  '页面不得做什么',
]) {
  if (!sharedRulesIndex.includes(required)) fail(`shared component rules index is missing ${required}.`);
}
if (!uiContract.includes('[组件共用规则索引](./COMPONENT_RULES_INDEX.md)')) {
  fail('global UI contract must link the shared component rules index.');
}
if (!read('docs/components/README.md').includes('[组件共用规则索引](../COMPONENT_RULES_INDEX.md)')) {
  fail('component contract directory must link the shared component rules index.');
}

const tagCss = read('tag/tag.wxss');
if (!/\.pui-tag\s*\{[^}]*align-items:\s*center;[^}]*justify-content:\s*center;[^}]*\}/.test(tagCss)) {
  fail('native Tag must center its content on both axes.');
}
if (!/\.pui-tag--medium\s*\{[^}]*padding:\s*0 var\(--pui-content-gap\);[^}]*\}/.test(tagCss)) {
  fail('native medium Tag must consume the shared content-gap padding.');
}
if (!/\.pui-tag\s*\{[^}]*justify-content:\s*center;[^}]*height:\s*var\(--pui-preview-space-step-24\);[^}]*padding:\s*0 var\(--pui-preview-content-gap\);[^}]*border-radius:\s*var\(--pui-preview-radius-small\);[^}]*\}/.test(previewCss)) {
  fail('H5 Tag mirror must preserve native centering, medium geometry and padding.');
}
const largeRadiusBlock = previewCss.match(/\.app-shell\[data-radius="large"\]\s*\{([^}]*)\}/);
for (const [token, value] of [
  ['--pui-preview-radius-small', '--pui-preview-radius-step-9'],
  ['--pui-preview-radius-medium', '--pui-preview-radius-step-14'],
  ['--pui-preview-radius-large', '--pui-preview-radius-step-20'],
  ['--pui-preview-radius-xlarge', '--pui-preview-radius-step-24'],
  ['--pui-preview-radius-xxlarge', '--pui-preview-radius-step-28'],
]) {
  if (!largeRadiusBlock || !largeRadiusBlock[1].includes(`${token}: var(${value});`)) {
    fail(`H5 large-radius mode must remap semantic token ${token} to ${value}.`);
  }
}
if (!/\.pui-tag--round\s*\{[^}]*border-radius:\s*var\(--pui-preview-radius-round\);[^}]*\}/.test(previewCss)
  || !/\.pui-tag--mark\s*\{[^}]*var\(--pui-preview-radius-small\)[^}]*var\(--pui-preview-radius-round\)[^}]*\}/.test(previewCss)) {
  fail('H5 Tag explicit round/mark shapes must preserve round geometry while mark consumes the semantic small radius.');
}

for (const selector of [
  '.utility-doc__summary h3',
  '.utility-doc__summary p',
  '.utility-doc__facts strong',
  '.utility-doc__live h4',
  '.utility-doc__category h4',
  '.utility-doc__category p',
]) {
  const block = previewCss.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\s*\\{([\\s\\S]*?)\\}`));
  if (!block || !block[1].includes('--pui-preview-doc-')) {
    fail(`${selector} must consume the shared documentation typography contract.`);
  }
}

const previewApp = read('preview/app.js');
if (!previewApp.includes('component-item__translation')
  || previewApp.includes('badgeSample({ count: item.nameZh')
  || previewApp.includes("customClass: 'component-item__status status-dot'")
  || previewApp.includes('content: item.status,')
  || previewApp.includes('>${item.status}</span>')) {
  fail('the global navigation must display Chinese names as grey helper text without exposing delivery status or misusing Badge/Tag.');
}
if (previewApp.includes('<b>×</b>') || previewApp.includes("props.arrow ? '<b>›</b>'")) {
  fail('preview must render close and navigation glyphs through the PUI Icon mirror.');
}
if (!previewApp.includes('function badgeSample(props = {})')
  || !previewApp.includes('function iconButtonSample(props = {})')
  || !previewApp.includes('previewContract: true,')
  || !previewApp.includes('const defaultSlot = props.defaultSlot !== undefined')
  || !previewApp.includes('pui-badge-demo--standalone')
  || !previewApp.includes('pui-badge-demo--${theme}')
  || !previewApp.includes('pui-badge-demo--${variant}')
  || !previewApp.includes('props.ariaSelected !== undefined')
  || !previewCss.includes('.pui-button-preview__content:empty')) {
  fail('H5 composition must share the PUI Badge/Button/Icon helpers, support default slots and remove the empty content gap.');
}
if (previewApp.includes('pui-cell-preview__badge')
  || previewCss.includes('.pui-cell-preview__badge')
  || previewApp.includes('pui-radio-preview__badge')
  || previewCss.includes('.pui-radio-preview__badge')
  || !previewApp.includes("badgeSample({ count: checked ? '已检查' : 2")
  || !previewApp.includes("loadingComponent({ size: '28rpx', duration: current.motion")
  || !previewCss.includes('.pui-badge-demo--outline')
  || !previewCss.includes('.pui-badge-demo--light')) {
  fail('Cell must compose shared Badge/Loading mirrors instead of private duplicates.');
}
if (!previewApp.includes('function checkboxSample(options = {})')
  || !previewApp.includes('return checkboxSample({')
  || previewApp.includes('pui-table-preview__checkbox')
  || previewCss.includes('.pui-table-preview__checkbox')
  || !previewCss.includes('.pui-table-preview__cell.is-selection > .pui-checkbox-sample')
  || !previewApp.includes("loadingComponent({ size: 'medium', text: props.loadingText || '轮播加载中'")
  || previewApp.includes('pui-swiper-preview__spinner')
  || previewCss.includes('.pui-swiper-preview__spinner')
  || previewCss.includes('@keyframes pui-swiper-spin')) {
  fail('Table selection must compose the shared PUI Checkbox mirror and Swiper loading must compose shared PUI Loading.');
}
if (!previewApp.includes('function emptySample(props = {})')
  || !previewApp.includes('data-pui-empty-sample')
  || !previewApp.includes("emptySample({ embedded: true, role: 'alert', description: props.errorText || '内容加载失败'")
  || !previewApp.includes("emptySample({ embedded: true, description: props.errorText || '表格加载失败'")
  || !previewApp.includes("emptySample({ embedded: true, description: props.errorText || '轮播加载失败'")
  || !previewCss.includes('.pui-empty-sample.is-embedded')
  || !previewCss.includes('.pui-table-preview__state > .pui-empty-sample')
  || !previewCss.includes('.pui-swiper-preview__state > .pui-empty-sample')) {
  fail('Collapsible, Table and Swiper states must compose the shared embedded PUI Empty mirror without nested surfaces.');
}
for (const action of [
  'alert-close',
  'calendar-month',
  'upload-remove',
  'search-clear',
  'stepper-minus',
  'stepper-plus',
]) {
  const rawIconButton = new RegExp(`<button[^>]*data-demo-action=["']${action}["']`);
  const composedIconButton = new RegExp(`iconButtonSample\\(\\{[\\s\\S]{0,400}?demoAction:[^\\n]{0,80}["']${action}["']`);
  const composedInputClear = new RegExp(`inputControlSample\\(\\{[\\s\\S]{0,900}?clearAction:[^\\n]{0,80}["']${action}["']`);
  if (rawIconButton.test(previewApp) || (!composedIconButton.test(previewApp) && !composedInputClear.test(previewApp))) {
    fail(`${action} must compose the reusable PUI Icon Button mirror instead of a private raw button.`);
  }
}
for (const action of ['tag-reset', 'bubble-reaction', 'bubble-toggle', 'calendar-retry', 'calendar-cancel', 'calendar-confirm', 'search-cancel', 'upload-retry']) {
  const rawActionButton = new RegExp(`<button[^>]*data-demo-action=["']${action}["']`);
  const composedButton = new RegExp(`buttonSample\\(\\{[^\\n]*demoAction: (?:current \\? )?["']${action}["']`);
  if (rawActionButton.test(previewApp) || !composedButton.test(previewApp)) {
    fail(`${action} must compose the reusable PUI Button mirror instead of a private raw button.`);
  }
}
if (/<button[^>]*data-demo-action=["']tag-close["']/.test(previewApp)
  || !previewApp.includes('class="pui-tag__close" role="button"')
  || !previewApp.includes("iconComponent('close', { pxSize: 12 })")
  || !previewApp.includes("closeAction: props.closable ? 'tag-close' : ''")
  || !previewApp.includes("action === 'tag-close' && previewIdFor(state.current) === 'tag'")
  || !previewCss.includes('.pui-tag__close[tabindex]')) {
  fail('Tag close must remain the component-owned Icon interaction, while the demo reset action composes PUI Button.');
}
if (!previewApp.includes('function bindScrollAreaPreviewRuntime(props)')
  || !previewApp.includes("cellSample({ title: entry.title")
  || !previewApp.includes('data-scroll-area-anchor')
  || /scroll-area-(?:top|bottom)|applyScrollAreaPreviewPosition|scrollAreaEvent/.test(previewApp)
  || !previewCss.includes('.pui-scroll-area-preview__entry')
  || previewCss.includes('.pui-scroll-area-showcase__toolbar')) {
  fail('ScrollArea must mirror the native thin ScrollView contract through a real scroll container and PUI Cell slot content, without demo controls or synthetic scroll events.');
}
for (const action of ['grid-click']) {
  const rawActionButton = new RegExp(`<button[^>]*data-demo-action=["']${action}["']`);
  const composedButton = new RegExp(`buttonSample\\(\\{[^\\n]*demoAction: ["']${action}["']`);
  if (rawActionButton.test(previewApp) || !composedButton.test(previewApp)) {
    fail(`${action} must compose the reusable PUI Button default-slot mirror instead of a private raw button.`);
  }
}
if (!previewApp.includes("badgeSample({ count: String(item.badge)")
  || !previewCss.includes('.pui-grid-preview__item.pui-button-preview')) {
  fail('Grid must preserve its PUI Button/Badge default-slot composition in the H5 mirror.');
}
if (previewApp.includes('<button type="button" class="pui-list-preview__item')
  || /<button[^>]*data-demo-action=["']list-(?:load|retry)["']/.test(previewApp)
  || !/const cell = cellSample\(\{[\s\S]*?demoAction: 'list-item'/.test(previewApp)
  || !previewApp.includes("badgeSample({ count: badgeText")
  || !previewApp.includes("demoAction: footerState === 'error' ? 'list-retry' : 'list-load'")
  || !previewApp.includes("action === 'list-item' && previewIdFor(state.current) === 'list'")
  || !previewCss.includes('.pui-list-preview__footer-button.pui-button')) {
  fail('List must compose Cell/Badge/Button in the H5 mirror.');
}
if (!previewApp.includes('props.demoKey !== undefined')
  || /<button[^>]*data-demo-action=["']navigation-menu-(?:root|item)["']/.test(previewApp)
  || !/buttonSample\(\{[^\n]*demoAction: 'navigation-menu-root'/.test(previewApp)
  || !/cellSample\(\{[^\n]*demoAction: 'navigation-menu-item'/.test(previewApp)
  || !previewApp.includes("badgeSample({ count: item.badge, dot: item.badgeDot")
  || !previewApp.includes("action === 'navigation-menu-item' && previewIdFor(state.current) === 'navigation-menu'")
  || !previewApp.includes("executeNavigationMenuPreviewItem(currentProps, demo, item, action.dataset.activationSource || 'tap')")) {
  fail('NavigationMenu roots/items must mirror WXML through shared Button/Badge/Cell helpers with stable keys and keyboard activation.');
}
if (/<button[^>]*data-demo-action=["']virtual-item["']/.test(previewApp)
  || !previewApp.includes('role="listitem" aria-label="${escapeHtml(item.label)}"')
  || !previewApp.includes("return badgeSample({ count: item.badge, dot: item.badgeDot")
  || !previewApp.includes("action === 'virtual-item' && previewIdFor(state.current) === 'virtual-list'")
  || !previewApp.includes("virtualListRequestSelection(props, demo, index, action.dataset.activationSource || 'tap')")
  || !previewCss.includes('.virtual-list-preview__item[aria-disabled="false"]')) {
  fail('VirtualList must keep a component-owned listitem root while composing Cell/Badge/Icon/Loading and keyboard semantics.');
}
if (previewCss.includes('var(--shadow-card)')
  || !previewCss.includes('box-shadow: var(--shadow-soft);')) {
  fail('H5 appearance styles must consume defined shadow tokens instead of unresolved private variables.');
}
if (/<button\b[^>]*data-demo-action="combobox-(?:toggle|option|remove)"/.test(previewApp)
  || !previewApp.includes('closeAction: \'combobox-remove\', closeIndex: index')
  || !previewApp.includes('role="combobox"')
  || !previewApp.includes('role="option" aria-selected=')
  || !previewApp.includes("['combobox-toggle', 'combobox-option', 'combobox-remove'].includes(action)")
  || !previewCss.includes('.pui-combobox-preview__option[aria-disabled="false"]:hover')) {
  fail('Combobox H5 must retain component-owned trigger/options, compose removable PUI Tags, and expose keyboard parity without raw action buttons.');
}
if (/<button\b[^>]*data-demo-action="indexes-item"/.test(previewApp)
  || previewApp.includes("item.arrow ? '<b>›</b>'")
  || !previewApp.includes("customClass: 'pui-indexes-preview__entry'")
  || !previewApp.includes('demoGroupIndex: group.groupIndex')
  || !previewApp.includes('badgeSample({ count: item.badge')
  || !previewApp.includes("type === 'indexes-item'")
  || !previewApp.includes("action.dataset.activationSource || 'tap'")) {
  fail('Indexes entries must compose Cell/Badge/Icon helpers with semantic keyboard activation and no raw button or glyph arrow.');
}
if (previewApp.includes('class="pui-search-results"')
  || previewApp.includes('class="pui-search-result"')
  || previewApp.includes("type === 'search-result-select'")
  || previewCss.includes('.pui-search-results')
  || previewCss.includes('.pui-search-result')) {
  fail('Search preview must not invent the four non-component catalog result blocks below the native control.');
}
if (previewApp.includes('return `<button type="button" id="${item.id}" class="pui-button pui-button--text pui-button--small pui-sidebar-preview__item')
  || !previewApp.includes("return buttonSample({ previewContract: true, id: item.id, customClass: `pui-sidebar-preview__item")
  || !previewApp.includes('badgeSample({ count: item.badge, dot: item.badgeDot, maxCount: item.badgeMax')
  || !previewApp.includes('demoSidebarKey: item.valueKey')
  || !previewApp.includes("dataAttributes: { 'sidebar-sample': 'current' }")
  || !previewApp.includes("action === 'sidebar-select'")
  || !previewCss.includes('.pui-sidebar-preview__item > .pui-button-preview__content')) {
  fail('Sidebar items must call the shared PUI Button/Badge/Icon mirrors and retain native key, loading, selection, and keyboard semantics.');
}
if (/<button\b[^>]*data-demo-action="collapse-toggle"/.test(previewApp)
  || !previewApp.includes('class="pui-collapse-demo__trigger" data-demo-action="collapse-toggle"')
  || !previewApp.includes('role="button" aria-label="${escapeHtml(item.ariaLabel)}"')
  || !previewApp.includes("action === 'collapse-toggle'")
  || !previewCss.includes('.pui-collapse-demo__trigger:focus-visible')) {
  fail('Collapse Trigger must retain the component-owned role=button root from WXML and provide keyboard parity without a nested PUI/raw Button.');
}
if (!previewApp.includes("action === 'swipe-content'")
  || !previewApp.includes("emitSwipePreviewEvent(root, 'dragstart')")
  || !previewApp.includes("emitSwipePreviewEvent(root, 'dragend')")
  || !previewApp.includes("emitSwipePreviewEvent(root, 'click', { action: swipeAction.source, source: position })")
  || !previewApp.includes("buttonSample({ content: action.text")
  || !previewApp.includes("cellSample({ title: '待处理消息'")) {
  fail('SwipeCell must compose PUI Button/Cell, mirror real dragstart/dragend/click events, and keep its component-owned content root keyboard-operable.');
}
for (const action of ['tabs-select', 'tabbar-select', 'step-select']) {
  const rawActionButton = new RegExp(`<button[^>]*data-demo-action=["']${action}["']`);
  const composedButton = new RegExp(`buttonSample\\(\\{[\\s\\S]{0,700}?demoAction: ["']${action}["']`);
  if (rawActionButton.test(previewApp) || !composedButton.test(previewApp)) {
    fail(`${action} must compose the reusable PUI Button default-slot mirror instead of a private raw button.`);
  }
}
if (!previewApp.includes("item.badge === '' ? '' : badgeSample")
  || !previewApp.includes("requestTabsPreviewSelection(sampleProps, sampleDemo, index, action.dataset.activationSource || 'tap'")
  || !previewApp.includes("['tabs-select', 'tabbar-select', 'step-select'].includes(action)")) {
  fail('Tabs must mirror WXML through shared Button/Badge/Icon helpers, preserve per-sample state, and retain keyboard activation sources.');
}
if (!previewApp.includes("item.hasBadge ? badgeSample")
  || !previewApp.includes("requestTabbarPreviewSelection(sampleProps, sampleDemo, index, action.dataset.activationSource || 'item', { current: sampleId === 'current', sampleId })")
  || !previewApp.includes('state.props[state.current].value = item.value')
  || !previewApp.includes("requestStepsPreviewSelection(sampleProps, sampleDemo, index, action.dataset.activationSource || 'item'")
  || !previewCss.includes('.pui-tabbar-preview__item > .pui-button-preview__content')
  || previewCss.includes('.pui-tabbar-preview__icon > em')
  || !previewCss.includes('.pui-steps-preview .pui-steps-preview__button > .pui-button-preview__content')) {
  fail('Tabbar and Steps must mirror WXML through shared Button/Badge/Icon helpers with stable default-slot layout and keyboard sources.');
}
for (const action of ['action-sheet-select', 'dropdown-trigger-slim', 'dropdown-select-slim', 'breadcrumb-select']) {
  const rawActionButton = new RegExp(`<button[^>]*data-demo-action=["']${action}["']`);
  const composedButton = new RegExp(`buttonSample\\(\\{[\\s\\S]{0,1200}?demoAction: ["']${action}["']`);
  if (rawActionButton.test(previewApp) || !composedButton.test(previewApp)) {
    fail(`${action} must compose the reusable PUI Button default-slot mirror instead of a private raw button.`);
  }
}
if (previewApp.includes('pui-dropdown-preview__badge')
  || previewCss.includes('.pui-dropdown-preview__badge')
  || previewCss.includes('.pui-dropdown-preview__badge')
  || !previewApp.includes("['action-sheet-select', 'dropdown-trigger-slim', 'dropdown-select-slim', 'breadcrumb-select'].includes(action)")
  || !previewApp.includes("requestBreadcrumbPreviewSelection(sampleProps, sampleDemo, index, action.dataset.activationSource || 'item', { current: sampleId === 'current' })")
  || !previewApp.includes("dataAttributes: { 'breadcrumb-sample': sampleId }")
  || !previewApp.includes('class="pui-breadcrumb-preview__item-wrap"')
  || !previewCss.includes('.pui-dropdown-slim__option > .pui-button-preview__content')) {
  fail('ActionSheet、DropdownMenu 和 Breadcrumb 必须通过共享 Button/Icon helper 镜像真实 WXML 与键盘来源。');
}

const previewIndex = read('preview/index.html');
const h5Compatibility = read('docs/H5_PREVIEW_COMPATIBILITY.md');
if (h5Compatibility.includes('中间：手机尺寸镜像预览、示例/代码切换、设备尺寸切换')
  || h5Compatibility.includes('右侧：组件说明、状态、npm 路径、Props 控制、WXML 示例和兼容说明')
  || !h5Compatibility.includes('主区 Header：唯一页面标题，以及固定的 `概览 / API / 属性` PUI Tabs')
  || !h5Compatibility.includes('不再存在常驻右侧 Inspector 或“预览/代码”私有切换')
  || !h5Compatibility.includes('父组件公开 Props')
  || !h5Compatibility.includes('不触发组件业务操作')) {
  fail('H5 compatibility documentation must describe the current Tabs information architecture, not the retired Inspector layout.');
}
if (!/<div class="brand">[\s\S]*?<a class="brand__home"[\s\S]*?<span class="brand__name">PoemUI<\/span>[\s\S]*?<\/a>[\s\S]*?<span id="releaseNotesTriggerMount"/.test(previewIndex)
  || !previewApp.includes("customClass: `brand__version${current ? ' is-active' : ''}`")
  || !previewApp.includes("demoAction: 'release-notes-open'")) {
  fail('the version must remain next to the PoemUI brand and use a real PUI Button to open the update page.');
}
if (!previewIndex.includes('aria-label="PoemUI 月下成行首页"')
  || !previewIndex.includes('class="brand__glyph"')
  || !previewIndex.includes('class="brand__moon"')
  || !previewIndex.includes('class="brand__lines"')
  || !previewIndex.includes('M18.05 2.85a5.35 5.35 0 1 0 2.78 10.08 6.08 6.08 0 0 1-2.78-10.08Z')
  || !previewIndex.includes('月下成行 · 原生小程序组件库')) {
  fail('官网品牌必须呈现双弧月牙、三行诗句、可访问名称与统一设计文案。');
}
const finalBrandStyles = previewCss.slice(previewCss.lastIndexOf('/* PoemUI 月下成行：'));
const finalBrandMarkBlock = finalBrandStyles.match(/\.brand__mark\s*\{([\s\S]*?)\}/)?.[1] || '';
if (!finalBrandStyles.includes('.brand__glyph')
  || !finalBrandStyles.includes('color: var(--page);')
  || /linear-gradient/.test(finalBrandMarkBlock)
  || !/box-shadow:\s*none\s*;/.test(finalBrandMarkBlock)) {
  fail('月下成行品牌标记必须保持 Token 驱动的黑白平面几何，不能恢复渐变或投影。');
}
const faviconSvg = read('preview/favicon.svg');
const faviconIco = fs.readFileSync(path.join(root, 'preview/favicon.ico'));
if (!previewIndex.includes('<link rel="icon" href="./favicon.svg" type="image/svg+xml" />')
  || !previewIndex.includes('<link rel="icon" href="./favicon.ico" sizes="any" type="image/x-icon" />')
  || !faviconSvg.includes('M18.05 2.85a5.35 5.35 0 1 0 2.78 10.08 6.08 6.08 0 0 1-2.78-10.08Z')
  || !faviconSvg.includes('M4.7 14.15h9.6M7.1 17.35h6M4.7 20.55h8.35')
  || !faviconSvg.includes('@media (prefers-color-scheme: dark)')
  || faviconIco.length < 128
  || faviconIco[0] !== 0 || faviconIco[1] !== 0 || faviconIco[2] !== 1 || faviconIco[3] !== 0) {
  fail('官网 favicon 必须复用月下成行几何，并提供 SVG 与有效 ICO 回退。');
}
for (const duplicateShell of [
  'id="componentTitle"',
  'id="componentDesc"',
  'id="componentStatus"',
  'class="phone__title"',
  'class="phone__status"',
  'preview-canvas__bar',
  'document-stage__header',
  '当前预览状态',
  '文档状态',
]) {
  if (previewApp.includes(duplicateShell) || previewIndex.includes(duplicateShell)) {
    fail(`the preview shell must not repeat page information through ${duplicateShell}.`);
  }
}
if (!previewIndex.includes('id="stageDescription"') || !previewApp.includes("'#stageDescription'")) {
  fail('the single page header must own the component description.');
}
if (!previewIndex.includes('id="componentPageTabs"')
  || !previewIndex.includes('class="component-page-navigation"')
  || !previewIndex.includes('id="previewUtilityToolbar" class="preview-utility-toolbar"')
  || !/id="previewModeMount"[\s\S]*class="preview-utility-toolbar__right"[\s\S]*id="deviceSelectMount"[\s\S]*id="componentViewActionMount"/.test(previewIndex)
  || !previewIndex.includes('id="componentViewActionMount" class="component-view-action-mount"')
  || !previewIndex.includes('id="deviceSelectMount" class="component-device-select-mount"')
  || !previewIndex.includes('id="componentSearchMount" class="component-search-mount"')
  || previewIndex.includes('<input id="componentSearch"')
  || previewIndex.includes('<select id="deviceSelect"')
  || previewIndex.includes('<button id="componentViewAction"')
  || previewIndex.includes('class="toolbar-actions"')
  || previewIndex.includes('id="componentViewActions"')
  || previewIndex.includes('class="inspector"')
  || previewIndex.includes('data-view="preview"')
  || previewIndex.includes('data-view="code"')) {
  fail('standard component pages must use the main-column PUI Tabs architecture without a legacy Inspector rail or preview/code tabs.');
}
for (const informationArchitectureContract of [
  "{ value: 'overview', label: '概览' }",
  "{ value: 'api', label: 'API' }",
  "{ value: 'prop', label: '属性' }",
  'class="pui-tabs-preview pui-tabs-preview--small is-evenly component-page-tabs__control"',
  "if (!root.querySelector('.component-page-tabs__control'))",
  "customClass: 'pui-tabs-preview__button'",
  "dataAttributes: { 'component-view': item.value }",
  'function ensureComponentViewActionControl()',
  'function ensureComponentInfrastructureControls()',
  'inputControlSample({',
  'selectControlSample({',
  'mount.innerHTML = [',
  "id: 'componentViewAction'",
  "id: 'componentResetAction'",
  'ensureComponentViewActionControl();',
  "button.tabIndex = active ? 0 : -1",
  'function renderComponentPageView()',
  'renderComponentPageView();',
  'class="component-api-workspace"',
  'class="component-prop-workspace',
  "const overview = !documentation && state.view === 'overview'",
  "const standardOverview = overview && state.current !== 'icon'",
  "deviceSelect.setAttribute('aria-hidden', 'true')",
  'deviceSelect.disabled = !standardOverview',
  "viewAction.setAttribute('aria-hidden', String(!standardOverview))",
  'viewAction.disabled = !standardOverview',
  "resetAction.setAttribute('aria-hidden', String(!standardOverview))",
  'resetAction.disabled = !standardOverview',
  "id: 'propResetAction'",
  "demoAction: 'refresh-preview'",
  "demoAction: 'reset-component'",
  'function refreshCurrentPreview()',
  'function resetCurrentComponent()',
  "if (action === 'refresh-preview' && !isDocumentationPage(state.current) && state.view === 'overview')",
  "if (action === 'reset-component' && (isDocumentationPage(state.current) || ['overview', 'prop'].includes(state.view)))",
  "if (state.view === 'api')",
  "if (state.view === 'prop')",
  'usagePropEntries(detail, props)',
]) {
  if (!previewApp.includes(informationArchitectureContract)) {
    fail(`standard component information architecture is missing ${informationArchitectureContract}.`);
  }
}
const componentPageViewBlockStart = previewApp.indexOf('function renderComponentPageView()');
const componentPageViewBlockEnd = previewApp.indexOf('\nfunction ', componentPageViewBlockStart + 10);
const componentPageViewBlock = previewApp.slice(componentPageViewBlockStart, componentPageViewBlockEnd);
if (componentPageViewBlock.includes('window.scrollBy') || componentPageViewBlock.includes('getBoundingClientRect')) {
  fail('Tabs must remain fixed through reserved layout slots, not viewport scroll compensation.');
}
if (!previewCss.includes('grid-template-columns: 244px minmax(0, 1fr);')
  || !previewCss.includes('.preview-stage--overview')
  || !previewCss.includes('.component-page-navigation {')
  || !previewCss.includes('--pui-preview-tabs-row-height: 40px;')
  || !previewCss.includes('--pui-preview-actions-row-height: var(--pui-preview-space-step-36);')
  || !previewCss.includes('grid-template-rows: var(--pui-preview-tabs-row-height);')
  || !previewCss.includes('height: var(--pui-preview-tabs-row-height);')
  || !previewCss.includes('grid-row: 1;')
  || !previewCss.includes('--pui-preview-actions-group-width: calc((var(--pui-preview-actions-row-height) * 3) + (var(--pui-preview-content-gap) * 2));')
  || !previewCss.includes('.preview-utility-toolbar {')
  || !previewCss.includes('.preview-utility-toolbar__right {')
  || !previewCss.includes('margin-left: auto;')
  || !previewCss.includes('background: transparent;')
  || !previewCss.includes('contain: layout;')
  || !previewCss.includes('.component-device-select-mount')
  || !previewCss.includes('overflow-anchor: none;')
  || !previewCss.includes('visibility: hidden;')
  || !previewCss.includes('grid-template-columns: minmax(0, 1fr) minmax(210px, 270px);')
  || !previewCss.includes('width: min(270px, 42vw);')
  || !previewCss.includes('gap: var(--pui-preview-content-gap);')
  || !previewCss.includes('.component-view-action-mount > .icon-button.pui-button')
  || !previewCss.includes('grid-column: 2;')
  || !previewCss.includes('.component-prop-workspace .props-panel')) {
  fail('the preview layout must remove the third rail and provide tokenized Overview/PROP workspaces.');
}
for (const preferencePersistenceContract of [
  "const themeStorageKey = 'poemui-preview-theme'",
  "const previewPreferencesStorageKey = 'poemui-preview-preferences'",
  'function normalizePreviewPreferences(value)',
  'function readStoredPreviewPreferences()',
  'function storePreviewPreferences(value)',
  'window.localStorage.getItem(previewPreferencesStorageKey)',
  'window.localStorage.setItem(previewPreferencesStorageKey, JSON.stringify(normalized))',
  'const storedPreviewPreferences = readStoredPreviewPreferences()',
  'theme: storedPreviewPreferences.theme',
  'shadow: storedPreviewPreferences.shadow',
  'frost: storedPreviewPreferences.frost',
  'radius: storedPreviewPreferences.radius',
  'gradient: storedPreviewPreferences.gradient',
  'border: storedPreviewPreferences.border',
  'storePreviewPreferences(state)',
]) {
  if (!previewApp.includes(preferencePersistenceContract)) {
    fail(`the preview preferences must persist through ${preferencePersistenceContract}.`);
  }
}
for (const preference of ['border', 'shadow', 'frost', 'radius', 'gradient', 'theme']) {
  if (!previewApp.includes(`key: '${preference}'`)) {
    fail(`the global ${preference} preference must render through a reusable PUI Switch control.`);
  }
}
if (!previewIndex.includes('id="previewPreferenceControls" class="topbar__controls"')
  || /<(?:button|input|select|textarea)\b/.test(previewIndex)
  || !previewApp.includes('function ensurePreviewPreferenceControls()')
  || !previewApp.includes("icon: 'palette'")
  || !previewApp.includes('id="appearanceMenuPanel"')
  || !previewApp.includes('function syncAppearanceMenu()')
  || !previewApp.includes('switchPreviewMarkup(props, switchPreviewSnapshot(props, {}), {')
  || !previewApp.includes('preferenceKey: item.key')
  || !previewApp.includes('data-preference-toggle')
  || !previewApp.includes('data-preference-root')) {
  fail('the six global preview preferences must mount through the shared PUI Switch mirror instead of static platform markup.');
}
if (previewIndex.includes('class="visual-toggle"') || previewIndex.includes('class="theme-toggle"')) {
  fail('legacy dot and custom theme buttons must not replace PUI Switch controls.');
}
for (const preferenceStyle of [
  '.appearance-menu__trigger.pui-button-preview',
  '.appearance-menu__panel',
  '.topbar-preference',
  '.topbar-preference .pui-switch-preview__control',
  'width: min(var(--pui-site-appearance-menu-width)',
]) {
  if (!previewCss.includes(preferenceStyle)) {
    fail(`the responsive global preference controls must include ${preferenceStyle}.`);
  }
}
for (const previewDeviceContract of [
  'function renderPreviewDevice(detail, props)',
  'class="preview-device phone',
  'data-preview-scroll',
  'previewScrollPositions',
  'previewDeviceScrollbarTimer',
  "previewViewport.classList.add('is-scrolling')",
  "previewViewport.classList.remove('is-scrolling')",
  'scrollbar-gutter: stable',
  'scrollbar-color: transparent transparent',
  '.preview-device__viewport.is-scrolling::-webkit-scrollbar-thumb',
  'overflow-y: auto',
  'width: min(100%, var(--device-width, 393px))',
  'height: var(--pui-preview-device-height)',
  'min-height: var(--pui-preview-device-height)',
  'max-height: var(--pui-preview-device-height)',
  '--pui-preview-device-surface: var(--preview-stage-surface, var(--page))',
  'background: var(--pui-preview-device-surface)',
  '.preview-device__viewport .pui-badge-showcase__stage',
  '.preview-device__viewport .pui-navigation-menu-preview__overlay',
]) {
  if (!previewApp.includes(previewDeviceContract) && !previewCss.includes(previewDeviceContract)) {
    fail(`the reusable preview device must include ${previewDeviceContract}.`);
  }
}
for (const previewDeviceDocumentationContract of [
  '`--pui-preview-device-height: 622px`',
  '滚动条默认透明隐藏',
  '任何组件包括 Dialog 都不得',
]) {
  if (!uiContract.includes(previewDeviceDocumentationContract)) {
    fail(`the UI contract must document the reusable PreviewDevice rule: ${previewDeviceDocumentationContract}.`);
  }
}
const publicCatalogSources = [read('metadata/components.js'), previewApp, previewIndex];
if (publicCatalogSources.some((source) => source.includes('shadcn-compatibility'))) {
  fail('the internal shadcn compatibility matrix must not be exposed as a public catalog page.');
}

if ([previewIndex, previewApp, previewCss].some((source) => source.includes('library-summary'))
  || ['componentCount', 'doneCount', 'betaCount', 'experimentalCount'].some((id) => previewIndex.includes(`id="${id}"`))) {
  fail('the component catalogue search must not expose non-actionable status summary blocks.');
}

for (const page of [
  '_example/miniprogram/pages/index/index.wxss',
  '_example/miniprogram/pages/components/index.wxss',
]) {
  const css = read(page);
  for (const match of css.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)rpx/g)) {
    if (Number(match[1]) < 24) fail(`${page} contains unreadable fixed font-size ${match[1]}rpx.`);
  }
}

require('./test-release-notes');
require('./test-api-reference-readability');
console.log(`PoemUI design contracts passed for ${packageComponents.length} components.`);
