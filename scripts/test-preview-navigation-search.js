const assert = require('assert');
const fs = require('fs');
const path = require('path');
const metadata = require('../metadata/components');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const app = read('preview/app.js');
const styles = read('preview/styles.css');
const html = read('preview/index.html');
const contract = read('docs/UI_DESIGN_CONTRACT.md');

const expectedGroups = ['开始与规范', '基础组件', '布局', '导航', '表单组件', '数据展示', '反馈', '浮层', '高级'];
assert.deepStrictEqual(metadata.groups.map((group) => group.title), expectedGroups, 'catalogue must use the approved task taxonomy');
assert(metadata.groups.every((group) => group.items.length > 0), 'navigation must not render empty taxonomy groups');
const ids = metadata.groups.flatMap((group) => group.items.map((item) => item.id));
assert.strictEqual(ids.length, new Set(ids).size, 'each catalog route must belong to exactly one navigation group');

const groupFor = (id) => metadata.groups.find((group) => group.items.some((item) => item.id === id))?.title;
for (const [id, group] of [
  ['button', '基础组件'],
  ['spacing', '开始与规范'],
  ['direction', '布局'],
  ['shadcn-aspect-ratio', '布局'],
  ['shadcn-scroll-area', '布局'],
  ['shadcn-tabs', '导航'],
  ['shadcn-input', '表单组件'],
  ['shadcn-calendar', '表单组件'],
  ['shadcn-card', '数据展示'],
  ['shadcn-dialog', '反馈'],
  ['shadcn-popover', '浮层'],
  ['bar-chart', '高级'],
  ['waffle', '高级'],
]) {
  assert.strictEqual(groupFor(id), group, `${id} must stay in ${group}`);
}

for (const duplicateAlias of ['button-group', 'shadcn-button-group', 'shadcn-button', 'shadcn-typography', 'shadcn-direction', 'shadcn-chart']) {
  assert(!ids.includes(duplicateAlias), `${duplicateAlias} must redirect to its canonical entry instead of duplicating the catalog`);
}

assert.strictEqual(groupFor('direction'), '布局', 'native Direction must not be left in the start guide');
assert.strictEqual(groupFor('spacing'), '开始与规范', 'Spacing must stay with the start and design guidance');
assert.strictEqual(groupFor('grid'), '布局', 'Grid must be discoverable with other layout primitives');
assert.strictEqual(groupFor('sticky'), '布局', 'Sticky must be discoverable with other layout primitives');
assert.strictEqual(groupFor('cell'), '数据展示', 'Cell stays a data display primitive');

const formGroup = metadata.groups.find((group) => group.key === 'form');
assert(formGroup, 'form taxonomy group must exist');
assert.deepStrictEqual(formGroup.sections.map((section) => section.title), ['结构与校验', '文本与搜索', '选择与数值'], 'form catalog must expose the three user-task sections');
assert.deepStrictEqual(
  formGroup.sections.flatMap((section) => section.items.map((item) => item.id)).sort(),
  [...formGroup.items].map((item) => item.id).sort(),
  'form sections must partition every form catalog route exactly once',
);
for (const [id, section] of [
  ['form', '结构与校验'],
  ['shadcn-input', '文本与搜索'],
  ['shadcn-select', '选择与数值'],
  ['shadcn-calendar', '选择与数值'],
  ['shadcn-date-picker', '选择与数值'],
  ['shadcn-attachment', '选择与数值'],
]) {
  assert.strictEqual(formGroup.sections.find((entry) => entry.items.some((item) => item.id === id))?.title, section, `${id} must stay in the right form section`);
}

const foundationGroup = metadata.groups.find((group) => group.key === 'foundation');
const gettingStartedGroup = metadata.groups.find((group) => group.key === 'getting-started');
assert.deepStrictEqual(
  gettingStartedGroup.items.map((item) => item.id),
  ['getting-started', 'config-provider', 'theme-tokens', 'color', 'style-utilities', 'spacing'],
  'Spacing must be item 06 immediately after the existing item 05 in start and guidance',
);
assert.deepStrictEqual(
  foundationGroup.items.map((item) => item.id),
  ['button', 'divider', 'icon', 'typography'],
  'foundation primitives must keep their stable order',
);
for (const group of metadata.groups.filter((group) => !['getting-started', 'foundation', 'form'].includes(group.key))) {
  const visibleNames = group.items.map((item) => String(item.nameEn || item.name || '').toLocaleLowerCase());
  const sortedNames = [...visibleNames].sort((left, right) => left.localeCompare(right, 'en'));
  assert.deepStrictEqual(visibleNames, sortedNames, `${group.title} must not retain source-concatenation order`);
}
assert.deepStrictEqual(
  formGroup.items.map((item) => item.taxonomyId || item.packageId || item.id),
  ['form', 'field', 'label', 'input', 'input-otp', 'textarea', 'search', 'checkbox', 'radio', 'switch', 'select', 'picker', 'combobox', 'slider', 'stepper', 'rate', 'calendar', 'date-time-picker', 'upload'],
  'form entries must follow task order and keep date/upload selectors in the selection section',
);
assert.strictEqual(foundationGroup.items[0]?.id, 'button', 'Button must be the first foundation primitive');
assert.strictEqual(ids.indexOf('spacing') + 1, 6, 'Spacing feedback number must be 06');

for (const sourceContract of [
  'function globalSearchResults()',
  'function renderGlobalSearchDialog()',
  'function openGlobalSearch()',
  'function closeGlobalSearch(',
  'function chooseGlobalSearchResult()',
  "dataAttributes: { 'global-search-open': true }",
  "event.key.toLowerCase() !== 'k'",
  "event.key === 'ArrowDown' || event.key === 'ArrowUp'",
  "event.key === 'Enter'",
  "event.key === 'Escape'",
  "event.key === 'Tab'",
  "role: 'option'",
  "inputControlSample({ id: 'globalSearchInput'",
  "iconButtonSample({ icon: 'close'",
  'buttonSample({',
]) {
  assert(app.includes(sourceContract), `global command-search contract missing: ${sourceContract}`);
}

const renderGroupsStart = app.indexOf('function renderGroups()');
const renderGroupsEnd = app.indexOf('function globalSearchResults()');
const renderGroupsSource = app.slice(renderGroupsStart, renderGroupsEnd);
assert(app.includes("const feedbackOrdinalById = new Map(allItems.map((item, index) => [item.id, String(index + 1).padStart(2, '0')]))"), 'catalog feedback numbering must derive from the complete metadata order');
assert(app.includes('function feedbackOrdinalFor(id)'), 'catalog feedback numbering must have one lookup helper');
assert(renderGroupsSource.includes('const feedbackOrdinal = feedbackOrdinalFor(item.id);'), 'filtered navigation must keep each item\'s canonical feedback number');
assert(renderGroupsSource.includes('component-item__feedback-index'), 'catalogue items must render their feedback number inside the PUI Button slot');
assert(renderGroupsSource.includes("dataAttributes: { id: item.id, 'catalog-order': feedbackOrdinal }"), 'catalogue entries must expose their canonical catalog order for review tooling');
assert(renderGroupsSource.includes('component-group__section'), 'dense form catalog must expose semantic internal sections without changing route ownership');
assert(renderGroupsSource.includes('group.sections'), 'catalogue sections must render from metadata instead of a page-local grouping list');
assert(renderGroupsSource.includes('catalogSectionTitleFor(group, item)'), 'catalogue filtering must index the visible form-section title');
assert(renderGroupsSource.includes('component-item__translation'), 'left navigation must render Chinese names as a textual helper label');
assert(!renderGroupsSource.includes('badgeSample({ count: item.nameZh'), 'left navigation Chinese names must not be rendered as Badge or Tag');
assert(renderGroupsSource.includes('badgeSample({ count: items.length'), 'left navigation must keep PUI Badge group counts');

assert(html.includes('id="globalSearchMount" class="global-search-mount"'), 'site shell must expose one global search mount');
assert(html.includes('<aside class="sidebar">'), 'site shell must retain the global component sidebar');
assert(!html.includes('role="dialog"'), 'static shell must not duplicate the runtime PUI command dialog');
assert(app.includes("item.nameZh || ''"), 'search must index Chinese component names');
assert(app.includes('item.group.title'), 'search must index navigation group names');
assert(app.includes('catalogSectionTitleFor(item.group, item)'), 'global search must index form-section titles');
assert(!app.slice(app.indexOf('function globalSearchResults()'), app.indexOf('function renderGlobalSearchDialog()')).includes('item.status'), 'global search must not expose development status');

for (const styleContract of [
  '--pui-site-command-width:',
  '--pui-site-command-max-height:',
  '.component-group__title {',
  '.component-group__section-title {',
  '.component-item__feedback-index {',
  '.app-shell .sidebar .component-item.pui-button-preview',
  '.app-shell .sidebar .component-item > .pui-button-preview__content',
  'grid-template-columns: auto minmax(0, 1fr) auto auto;',
  '.app-shell .sidebar .component-item__translation',
  '.global-search-overlay {',
  '.app-shell .global-search-dialog.pui-dialog {',
  'grid-template-columns: var(--pui-preview-space-step-36) minmax(0, 1fr) var(--pui-preview-space-step-36);',
  '.global-search-results {',
  'overflow-y: auto;',
  '@media (max-width: 700px)',
  'grid-template-columns: minmax(0, 1fr);',
  'overflow-x: hidden;',
]) {
  assert(styles.includes(styleContract), `navigation/search style contract missing: ${styleContract}`);
}

for (const documentation of [contract, read('AGENTS.md')]) {
  assert(documentation.includes('Ctrl/⌘ + K'), 'global governance must document the command-search shortcut');
  assert(documentation.includes('开始与规范'), 'global governance must document the navigation taxonomy');
}

assert(read('docs/PREVIEW_INFORMATION_HIERARCHY.md').includes('筛选不重新编号'), 'preview hierarchy documentation must keep feedback numbering stable through filtering');
assert(read('docs/PREVIEW_INFORMATION_HIERARCHY.md').includes('稳定排序'), 'preview hierarchy documentation must explain catalog ordering');

console.log('Preview navigation taxonomy and command-search contract passed.');
