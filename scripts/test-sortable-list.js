'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const sortableData = require(path.join(root, 'common/utils/sortable-list-data'));
let definition;
vm.runInNewContext(fs.readFileSync(path.join(root, 'sortable-list/sortable-list.js'), 'utf8'), {
  Component(value) { definition = value; },
  require(request) { return request.includes('sortable-list-data') ? sortableData : {}; },
  isFinite, setTimeout, clearTimeout, setInterval, clearInterval, console,
}, { filename: 'sortable-list/sortable-list.js' });
assert(definition);
function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return ''; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, definition.methods);
  definition.lifetimes.attached.call(instance);
  instance.events = events;
  return instance;
}
const source = [
  { key: 'a', title: 'A' },
  { key: 'b', title: 'B', disabled: true },
  { key: 'c', title: 'C' },
];
const normalized = sortableData.normalizeItems(source, 'key', []);
assert.deepStrictEqual(sortableData.reorder(normalized, 0, 2).map((item) => item._key), ['b', 'c', 'a']);
assert.deepStrictEqual(sortableData.publicItems(normalized).map((item) => item.key), ['a', 'b', 'c']);
const component = create({ items: source, dragFrom: 'item', reduceMotion: true });
assert(component.data.rootClass.includes('pui-sortable-list--drag-item'));
assert(component.data.rootStyle.includes('1ms'));
assert.strictEqual(component.move(0, 2), true);
assert.deepStrictEqual(component.events.at(-1).detail.items.map((item) => item.key), ['b', 'c', 'a']);
assert.strictEqual(component.move(1, 0), false, 'disabled item cannot be a move source');
assert.deepStrictEqual(component.getItems().map((item) => item.key), ['b', 'c', 'a']);
const wxml = fs.readFileSync(path.join(root, 'sortable-list/sortable-list.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'sortable-list/sortable-list.wxss'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components'));
assert.strictEqual((wxml.match(/<scroll-view/g) || []).length, 1);
assert(wxml.includes('<pui-cell') && wxml.includes('<pui-icon'));
assert(!wxml.includes('<button'));
assert(!wxss.includes('var(--pui-shadow'));
assert.deepStrictEqual(metadata.apiProps['sortable-list'], ['items', 'itemKey', 'disabledKeys', 'dragFrom', 'height', 'bordered', 'animated', 'duration', 'ariaLabel', 'reduceMotion']);
assert.deepStrictEqual(metadata.apiEvents['sortable-list'].map((item) => item.name), ['dragstart', 'dragging', 'change', 'cancel', 'scroll']);
assert.deepStrictEqual(metadata.apiMethods['sortable-list'].map((item) => item.name), ['move(from, to)', 'cancel()', 'getItems()']);
assert(preview.includes('function bindSortableListPreviewRuntime(props)'));
assert(preview.includes("commitSortablePreviewMove(props, from, target, 'pointer')"));
assert(preview.includes("commitSortablePreviewMove(props, from, to, 'keyboard')"));
assert(previewStyles.includes('.pui-sortable-list-preview__viewport') && previewStyles.includes('overflow-y:auto'));
assert(previewStyles.includes('.pui-sortable-list-preview__item.is-dragging'));
assert(fs.readFileSync(path.join(root, 'docs/components/SORTABLE-LIST.md'), 'utf8').includes('唯一内部 `scroll-view`'));
assert(fs.readFileSync(path.join(root, 'miniprogram/pages/components/sortable-list/index.wxml'), 'utf8').includes('bind:change="onOrderChange"'));
console.log('SortableList contract tests passed.');
