const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('table/table.js');
let definition = null;
vm.runInNewContext(source, {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
}, { filename: 'table/table.js' });

assert(definition, 'Table component definition must be registered');

const PROP_KEYS = [
  'columns', 'data', 'rowKey', 'bordered', 'stripe', 'height', 'showHeader', 'emptyValue',
  'selectable', 'selectedRowKeys', 'defaultSelectedRowKeys', 'multiple', 'selectOnRowClick',
  'sortable', 'sort', 'defaultSort', 'customEmpty', 'disabled', 'loading', 'loadingText',
  'error', 'errorText', 'retryText', 'emptyText', 'ariaLabel', 'reduceMotion',
];
const EVENT_KEYS = ['row-click', 'cell-click', 'input', 'change', 'sort-change', 'scroll', 'retry'];
const METHOD_KEYS = ['selectAll', 'clearSelection', 'toggleRow', 'sortBy', 'clearSort', 'scrollTo', 'retry', 'getSelection', 'getSort'];
const COLUMNS = [
  { key: 'name', title: '组件', width: 220, fixed: 'left', sortable: true, headerIcon: 'component' },
  { key: 'status', title: '状态', width: 160, align: 'center', type: 'tag', valueMap: { done: '已完成' }, themeMap: { done: 'success' } },
  { key: 'priority', title: '优先级', width: 140, align: 'right', sortable: true },
  { key: 'meta.version', title: '版本', width: 150, fixed: 'right' },
];
const ROWS = [
  { id: 0, name: 'Button', status: 'done', priority: 2, meta: { version: '0.1.0' } },
  { id: false, name: 'Dialog', status: 'beta', priority: 1, meta: { version: '0.1.0' } },
  { id: 'calendar', name: 'Calendar', status: '', priority: 2, meta: { version: '0.2.0' } },
  { id: 'locked', name: 'Legacy', status: 'done', priority: 9, meta: { version: '0.0.8' }, disabled: true },
];

function plain(value) { return JSON.parse(JSON.stringify(value)); }

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

assert.deepStrictEqual(Object.keys(definition.properties), PROP_KEYS, 'Table publishes exactly the 26 reviewed Props');
assert(!source.includes('scrollToLeft') && !source.includes('scrollToRight'));
assert(!source.includes("triggerEvent('selection-change'") && !source.includes("triggerEvent('row-select'"));

const empty = create();
assert.strictEqual(empty.instance.data.stateType, 'empty');
assert.strictEqual(empty.instance.data.hasStructure, false);
assert(empty.instance.data.rootClass.includes('pui-table--empty'));

const normalized = create({
  columns: COLUMNS, data: ROWS, selectable: true, defaultSelectedRowKeys: [0, false, 'missing'],
  sortable: true, height: 300, stripe: true,
});
assert.strictEqual(normalized.instance.data.stateType, 'content');
assert.deepStrictEqual(Array.from(normalized.instance.getSelection()), [0, false], '0 and false remain distinct row keys');
assert.strictEqual(normalized.instance.data.normalizedColumns[0].fixedStyle, 'left:80rpx;');
assert.strictEqual(normalized.instance.data.normalizedColumns[3].fixedStyle, 'right:0rpx;');
assert.strictEqual(normalized.instance.data.rows[0].cells[1].text, '已完成');
assert.strictEqual(normalized.instance.data.rows[0].cells[1].tagTheme, 'success');
assert.strictEqual(normalized.instance.data.rows[2].cells[1].text, '—');
assert.strictEqual(normalized.instance.data.tableWidth, 750, 'column widths plus fixed selection column are the only width source');
assert.strictEqual(normalized.instance.data.scrollY, true);
assert(normalized.instance.data.scrollStyle.includes('height:300rpx'));

const primitive = create({ columns: [{ key: 'value', title: '值' }], data: [0, false, '文本'] });
assert.deepStrictEqual(Array.from(primitive.instance.data.rows, (row) => row.cells[0].text), ['0', 'false', '文本']);

const uncontrolled = create({ columns: COLUMNS, data: ROWS, selectable: true, defaultSelectedRowKeys: [0] });
assert.strictEqual(uncontrolled.instance.toggleRow(false, true), true);
assert.deepStrictEqual(Array.from(uncontrolled.instance.getSelection()), [0, false]);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['input', 'change']);
assert.strictEqual(uncontrolled.events[0].detail.source, 'method');

const controlled = create({ columns: COLUMNS, data: ROWS, selectable: true, selectedRowKeys: [false], defaultSelectedRowKeys: [0] });
controlled.instance.toggleRow(false, false);
assert.deepStrictEqual(Array.from(controlled.instance.getSelection()), [false], 'controlled selection waits for parent write-back');
controlled.instance.data.defaultSelectedRowKeys = ['calendar'];
controlled.instance.syncState();
controlled.instance.data.selectedRowKeys = null;
controlled.instance.syncState();
assert.deepStrictEqual(Array.from(controlled.instance.getSelection()), ['calendar'], 'controlled to uncontrolled selection uses latest default');

const single = create({ columns: COLUMNS, data: ROWS, selectable: true, multiple: false, defaultSelectedRowKeys: [0] });
single.instance.toggleRow(false, true);
assert.deepStrictEqual(Array.from(single.instance.getSelection()), [false]);
assert.strictEqual(single.instance.selectAll(), false);
assert.strictEqual(single.instance.toggleRow('locked'), false);

const preserveDisabled = create({ columns: COLUMNS, data: ROWS, selectable: true, defaultSelectedRowKeys: ['locked', 0] });
preserveDisabled.instance.selectAll(false);
assert.deepStrictEqual(Array.from(preserveDisabled.instance.getSelection()), ['locked']);

const sorting = create({ columns: COLUMNS, data: ROWS, sortable: true, defaultSort: { key: 'priority', order: 'asc' } });
assert.deepStrictEqual(Array.from(sorting.instance.data.rows, (row) => row.key), [false, 0, 'calendar', 'locked']);
sorting.instance.onHeaderTap({ currentTarget: { dataset: { index: 2 } } });
assert.strictEqual(sorting.instance.getSort().order, 'desc');
sorting.instance.onHeaderTap({ currentTarget: { dataset: { index: 2 } } });
assert.strictEqual(sorting.instance.getSort(), null);
assert.deepStrictEqual(sorting.events.map((event) => event.name), ['sort-change', 'sort-change']);

const controlledSort = create({ columns: COLUMNS, data: ROWS, sortable: true, sort: { key: 'priority', order: 'asc' }, defaultSort: { key: 'priority', order: 'desc' } });
controlledSort.instance.sortBy('name', 'desc');
assert.deepStrictEqual(plain(controlledSort.instance.getSort()), { key: 'priority', order: 'asc' });
controlledSort.instance.data.defaultSort = { key: 'name', order: 'desc' };
controlledSort.instance.syncState();
controlledSort.instance.data.sort = null;
controlledSort.instance.syncState();
assert.deepStrictEqual(plain(controlledSort.instance.getSort()), { key: 'name', order: 'desc' });

const rowActions = create({ columns: COLUMNS, data: ROWS, selectable: true, selectOnRowClick: true });
rowActions.instance.onCellTap({ currentTarget: { dataset: { rowIndex: 0, cellIndex: 1 } } });
rowActions.instance.onRowTap({ currentTarget: { dataset: { index: 0 } } });
assert.deepStrictEqual(rowActions.events.map((event) => event.name), ['cell-click', 'input', 'change', 'row-click']);
assert.strictEqual(rowActions.events[0].detail.columnKey, 'status');

const states = create({ columns: COLUMNS, data: ROWS, loading: true, error: true });
assert.strictEqual(states.instance.data.stateType, 'error');
assert.strictEqual(states.instance.retry('test'), true);
assert.strictEqual(states.events.at(-1).name, 'retry');
assert.strictEqual(states.events.at(-1).detail.rowCount, 4);
states.instance.data.error = false;
states.instance.syncState();
assert.strictEqual(states.instance.data.stateType, 'loading');
states.instance.data.loading = false;
states.instance.data.data = [];
states.instance.syncState();
assert.strictEqual(states.instance.data.stateType, 'empty');

const disabled = create({ columns: COLUMNS, data: ROWS, selectable: true, sortable: true, disabled: true, error: true });
disabled.instance.toggleRow(0);
disabled.instance.sortBy('priority');
disabled.instance.retry();
assert.strictEqual(disabled.events.length, 0);

const scroll = create({ columns: COLUMNS, data: ROWS, height: 300 });
assert.deepStrictEqual(plain(scroll.instance.scrollTo({ left: 99999, top: -20 })), { left: 670, top: 0 });
scroll.instance.onScroll({ detail: { scrollLeft: 80, scrollTop: 12, scrollWidth: 670, scrollHeight: 400, deltaX: 4, deltaY: 2 } });
assert.strictEqual(scroll.events.at(-1).name, 'scroll');
assert.strictEqual(scroll.events.at(-1).detail.scrollLeft, 80);

const regularMotion = create({ columns: COLUMNS, data: ROWS });
const reduced = create({ columns: COLUMNS, data: ROWS, reduceMotion: true });
assert(regularMotion.instance.data.rootStyle.includes('--pui-table-duration:500ms'));
assert(reduced.instance.data.rootStyle.includes('--pui-table-duration:1ms'));

const wxml = read('table/table.wxml');
const wxss = read('table/table.wxss');
const json = JSON.parse(read('table/table.json'));
const preview = read('preview/app.js');
const previewStyles = read('preview/styles.css');
const metadata = read('metadata/components.js');
const api = read('docs/COMPONENT_API.md');
const contract = read('docs/components/TABLE.md');
const example = read('_example/miniprogram/pages/components/index.wxml');

assert(wxml.includes('<scroll-view'));
['<pui-checkbox', '<pui-tag', '<pui-icon', '<pui-loading', '<pui-empty', '<pui-button'].forEach((needle) => assert(wxml.includes(needle)));
assert(wxml.includes('bindtap="onCellTap"'));
assert.strictEqual((wxml.match(/<slot\b/g) || []).length, 1, 'only empty Slot remains');
assert(!/<button\b|<input\b|<image\b/.test(wxml));
assert(wxss.includes('.pui-table__cell--fixed { position: sticky;'));
assert(wxss.includes('var(--pui-ease-standard)'));
assert(!/\.pui-table--reduced[^\{]*\*/.test(wxss), '低动效时长通过 rootStyle 注入，WXSS 不得穿透后代');
assert.strictEqual(json.usingComponents['pui-checkbox'], '../checkbox/checkbox');

assert(preview.includes('const tableSourceDefaults = Object.freeze({'));
assert(preview.includes('<h3>基础用法</h3>'));
assert(preview.includes('<h3>边线与固定列</h3>'));
assert(preview.includes('<h3>选择与排序</h3>'));
assert(preview.includes('<h3>加载、空与错误</h3>'));
assert(preview.includes('data-demo-action="table-cell"'));
assert(preview.includes("cell-click：key=${String(row.key)}"));
assert(preview.includes('function checkboxSample(options = {})'));
assert(preview.includes("selectAll.indeterminate = selectAll.dataset.indeterminate === 'true'"));
assert(!preview.includes('pui-table-preview__checkbox'));
assert(previewStyles.includes('.pui-table-preview__cell.is-selection > .pui-checkbox-sample'));
assert(!source.includes("selectionColumnClass: 'pui-table__cell--fixed"), 'Table selection column must remain part of the scrolling table grid');
assert(preview.includes("const selectionClass = '';"), 'H5 Table selection cell has no separate fixed-edge container');
assert(previewStyles.includes('background: transparent !important;') && previewStyles.includes('backdrop-filter: none !important;'), 'Table selection checkbox cannot inherit frost card styling');
assert(!previewStyles.includes('.pui-table-preview__spinner'));
assert(previewStyles.includes('.pui-table-showcase > .pui-showcase-section { width: 100%; min-width: 0; }'), 'partition sections must not widen the PreviewDevice');
assert(previewStyles.includes('.preview-stage .pui-table-preview.is-borderless { border-color: transparent; }'), 'component bordered=false must win over the site appearance layer');
assert(previewStyles.includes('background-color var(--pui-table-preview-duration) var(--pui-table-preview-easing)'), 'site appearance transitions must preserve the fixed Table lifecycle');

const tableUsageBlock = preview.slice(preview.indexOf("if (runtimeId === 'table')"), preview.indexOf("if (runtimeId === 'swiper')"));
assert(!tableUsageBlock.includes('bind:'), 'Table basic WXML must not publish any event binding');
assert(!tableUsageBlock.includes('customHeader') && !tableUsageBlock.includes('customFooter'));
assert(example.includes('bind:cell-click="onTableCellClick"'));
assert(!example.includes('bind:row-select="onTableRowSelect"'));
assert(!example.includes('bind:selection-change="onTableSelectionChange"'));

PROP_KEYS.forEach((key) => assert(metadata.includes(`'${key}'`) || metadata.includes(`${key}:`), `metadata includes ${key}`));
EVENT_KEYS.forEach((key) => assert(metadata.includes(`name: '${key}'`), `metadata includes ${key}`));
METHOD_KEYS.forEach((key) => assert(metadata.includes(`name: '${key}(`) || metadata.includes(`name: '${key}()'`), `metadata includes ${key}`));
assert(api.includes('## Table'));
assert(api.includes('`cell-click`'));
assert(contract.includes('TDesign 1.15.3'));
assert(contract.includes('26 Props'));
assert(contract.includes('7 Events'));
assert(contract.includes('9 Methods'));

console.log('Table / Data Table contract tests passed.');
