const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');

assert(preview.includes('function dialogMotionEasing(props)'), '共享浮层缓动映射必须存在，避免 DropdownMenu、Overlay 路由在渲染前抛错');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'preview/index.html'), 'utf8');

function functionBlock(name) {
  const start = preview.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  const next = preview.indexOf('\nfunction ', start + 10);
  return preview.slice(start, next >= 0 ? next : preview.length);
}

const button = functionBlock('buttonSample');
assert(button.includes('props.dataAttributes'));
assert(button.includes('reservedDataAttributes'));
assert(button.includes("/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/"));
assert(button.includes('customDataAttributes'));

const previewRuntime = functionBlock('bindPreviewRuntime');
assert(previewRuntime.includes('bindDropdownPreviewRuntime();'), 'DropdownMenu runtime binding must not be replaced by API-description code.');
assert(!previewRuntime.includes('descriptions[key]'), 'runtime binding must never read the API description key.');
const apiDescriptions = functionBlock('apiPropDescription');
assert(apiDescriptions.includes("if (id === 'dropdown-menu')"));
assert(apiDescriptions.includes('descriptions[key]'));

const groups = functionBlock('renderGroups');
assert(groups.includes('buttonSample({'), 'component navigation must call the shared PUI Button mirror');
assert(groups.includes('component-item__translation'), 'left navigation Chinese names must stay a textual helper inside the shared PUI Button slot');
assert(!groups.includes('badgeSample({ count: item.nameZh'), 'left navigation Chinese names must not be rendered as Badge or Tag');
assert(groups.includes('badgeSample({ count: items.length'), 'left navigation group counts must compose through the shared Badge mirror');
assert(groups.includes("dataAttributes: { id: item.id, 'catalog-order': feedbackOrdinal }"), 'component navigation must preserve its canonical feedback order in the shared PUI Button data attributes');
assert(groups.includes('component-item__feedback-index'), 'component navigation must place the feedback order inside the shared PUI Button slot');
assert(groups.includes("ariaCurrent: active ? 'page' : ''"));
assert(!groups.includes('item.status'), 'component search and navigation labels must not expose development status');
assert(!groups.includes('成熟度'), 'component navigation must use the user-facing Chinese component name');
assert(!groups.includes('<button'), 'component navigation must not handwrite a site-only button');

assert(html.includes('id="componentSearchMount" class="component-search-mount"'));
assert(html.includes('id="deviceSelectMount" class="component-device-select-mount"'));
assert(!html.includes('<input id="componentSearch"'), 'site search must be mounted through the PUI Input helper');
assert(!html.includes('<select id="deviceSelect"'), 'device selection must be mounted through the PUI Select helper');
assert(html.includes('id="previewPreferenceControls" class="topbar__controls"'));
assert(!/<button\b/.test(html), 'site shell must not statically handwrite PUI controls');
assert(!html.includes('General / done'));

const inputControl = functionBlock('inputControlSample');
assert(inputControl.includes("'pui-input-preview'"));
assert(inputControl.includes('class="pui-input-preview__control"'));
assert(inputControl.includes('iconComponent(props.prefixIcon'));
assert(inputControl.includes('escapeHtml(semanticLabel)'));

const selectControl = functionBlock('selectControlSample');
assert(selectControl.includes("'pui-select-control'"));
assert(selectControl.includes("iconComponent('chevron-down'"));
assert(selectControl.includes('escapeHtml(item.value)'));
assert(selectControl.includes('escapeHtml(item.label)'));
assert(selectControl.includes('data-prop='));

const switchControl = functionBlock('switchControlSample');
assert(switchControl.includes("'pui-switch-preview'"));
assert(switchControl.includes("'pui-switch-control-sample'"));
assert(switchControl.includes('type="checkbox"'));
assert(switchControl.includes('data-prop='));

const textareaControl = functionBlock('textareaControlSample');
assert(textareaControl.includes("'pui-textarea-preview'"));
assert(textareaControl.includes('pui-textarea-preview__field'));
assert(textareaControl.includes('data-prop='));
assert(textareaControl.includes('data-prop-type='));

const infrastructure = functionBlock('ensureComponentInfrastructureControls');
assert(infrastructure.includes('inputControlSample({'));
assert(infrastructure.includes('selectControlSample({'));
assert(infrastructure.includes("id: 'componentSearch'"));
assert(infrastructure.includes("id: 'deviceSelect'"));
assert(infrastructure.includes("placeholder: '搜索组件 / 分类'"));
assert(!infrastructure.includes('<input'));
assert(!infrastructure.includes('<select'));

const preferences = functionBlock('ensurePreviewPreferenceControls');
assert(preferences.includes('switchPreviewMarkup('), 'global appearance controls must call the shared PUI Switch mirror');
assert(preferences.includes('switchPreviewSnapshot('));
assert(preferences.includes('iconButtonSample({'), 'global appearance controls must be collected behind the shared PUI IconButton mirror');
assert(preferences.includes("icon: 'palette'"));
assert(preferences.includes('id="appearanceMenuPanel"'));
assert(preferences.includes("customClass: 'topbar-preference'"));
assert(preferences.includes('preferenceKey: item.key'));
assert(!preferences.includes('<button'), 'global appearance controls must not duplicate Switch platform markup');

const switchPreview = functionBlock('switchPreviewMarkup');
assert(switchPreview.includes('props.customClass ||'));
assert(switchPreview.includes('data-preference-toggle'));
assert(switchPreview.includes('data-preference-root'));

const propsPanel = functionBlock('propControlMarkup');
for (const helper of ['selectControlSample({', 'switchControlSample({', 'inputControlSample({', 'sliderSample({', 'textareaControlSample({']) {
  assert(propsPanel.includes(helper), `PROP controls must call shared ${helper.replace('({', '')}`);
}
assert(propsPanel.includes("class=\"prop-control__label\""));
assert(!propsPanel.includes('<input'), 'PROP workspace must not handwrite raw Input controls');
assert(!propsPanel.includes('<select'), 'PROP workspace must not handwrite raw Select controls');
assert(!propsPanel.includes('<textarea'), 'PROP workspace must not handwrite raw Textarea controls');

const prop = functionBlock('propWorkspaceMarkup');
assert(prop.includes("id: 'copyCode'"));
assert(prop.includes("icon: 'copy'"));
assert(prop.includes("content: '复制'"));
assert(!prop.includes('<button'), 'PROP copy must not handwrite a site-only button');

const pageTabs = functionBlock('renderComponentPageTabs');
assert(pageTabs.includes('buttonSample({'), 'standard page Tabs must call the shared PUI Button mirror');
assert(pageTabs.includes("dataAttributes: { 'component-view': item.value }"));
assert(pageTabs.includes("role: 'tab'"));
assert(pageTabs.includes('ariaSelected: item.value === state.view'));
assert(!pageTabs.includes('<button'), 'standard page Tabs must not only borrow PUI classes on handwritten buttons');

const viewAction = functionBlock('ensureComponentViewActionControl');
assert(viewAction.includes('iconButtonSample({'), 'standard page refresh/reset must call the shared PUI IconButton mirror');
assert(viewAction.includes("id: 'componentViewAction'"));
assert(viewAction.includes("id: 'componentResetAction'"));
assert(viewAction.includes("id: 'componentCopyAction'"));
assert(viewAction.includes("icon: 'refresh'"));
assert(viewAction.includes("icon: 'undo'"));
assert(viewAction.includes("icon: 'copy'"));
assert(viewAction.includes("demoAction: 'refresh-preview'"));
assert(viewAction.includes("demoAction: 'reset-component'"));
assert(viewAction.includes("demoAction: 'copy-current-code'"));
assert(!viewAction.includes('<button'), 'standard page refresh/reset must not handwrite a site-only icon button');

const clipboard = functionBlock('writePreviewClipboard');
assert(clipboard.includes("window.isSecureContext && navigator.clipboard"));
assert(clipboard.includes('navigator.clipboard.writeText(text)'));
assert(clipboard.includes("document.execCommand('copy')"));
assert(clipboard.includes('return copied;'));
const copyFeedback = functionBlock('updatePreviewCopyButton');
assert(copyFeedback.includes("button.querySelector('.pui-button-preview__content')"));
assert(copyFeedback.includes('content.textContent = label'));
assert(!preview.includes("copyButton.textContent ="), 'copy feedback must preserve the PUI Button Icon and content Slot tree');

const icons = functionBlock('renderIconLibrary');
assert(icons.includes('const categoryButton ='));
assert(icons.includes('inputControlSample({'));
assert(icons.includes("id: 'iconSearch'"));
assert(icons.includes("prefixIcon: 'search'"));
assert(icons.includes('buttonSample({'));
assert(icons.includes('ariaPressed: state.iconCategory === key'));
assert(icons.includes("dataAttributes: { category: key }"));
assert(icons.includes('iconComponent(icon.name, { pxSize: 28 })'));
assert(icons.includes("dataAttributes: { icon: icon.name }"));
assert(!icons.includes('<button'), 'Icon filters/cards must not handwrite site-only buttons');
assert(!icons.includes('<input'), 'Icon search must call the shared PUI Input mirror');
assert(!icons.includes('${icon.svg}'), 'Icon cards must call the shared PUI Icon mirror instead of injecting raw SVG');

for (const contract of [
  '.app-shell .sidebar .component-item.pui-button-preview',
  '.app-shell .sidebar .component-item > .pui-button-preview__content',
  'body .app-shell[data-page-mode] .preview-stage .mini-action.pui-button-preview',
  'body .app-shell[data-page-mode] .preview-stage .icon-category.pui-button-preview',
  'body .app-shell[data-page-mode] .preview-stage .icon-card.pui-button-preview',
  'body .app-shell[data-page-mode] .preview-stage .icon-card.pui-button-preview > .pui-button-preview__content',
  'body .app-shell[data-page-mode] .preview-stage .icon-card.pui-button-preview[data-icon]',
  '.icon-search-control.pui-input-preview',
  '.component-search-control.pui-input-preview',
  'body .app-shell[data-page-mode] .pui-select-control',
  'body .app-shell[data-page-mode] .component-device-select-mount',
  'body .app-shell[data-page-mode] .component-prop-workspace .prop-control__input',
  'body .app-shell[data-page-mode] .component-prop-workspace .prop-control__select',
  'body .app-shell[data-page-mode] .component-prop-workspace .prop-control__textarea',
  'body .app-shell[data-page-mode] .component-prop-workspace .pui-switch-control-sample',
  '--pui-preview-prop-json-height: 120px;',
  'background: var(--surface)',
  'border-color: var(--border)',
  'body .app-shell[data-shadow="on"][data-page-mode] .preview-stage .icon-card.pui-button-preview',
  'box-shadow: var(--preview-shadow-card)',
]) {
  assert(styles.includes(contract), `missing infrastructure composition layout contract: ${contract}`);
}

console.log('Preview infrastructure PUI composition contract tests passed.');
