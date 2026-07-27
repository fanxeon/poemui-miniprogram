const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'cell/cell-group.js'), 'utf8');
let definition = null;
const sandbox = {
  require: () => ({}),
  Component(value) { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'cell/cell-group.js' });
assert(definition, 'CellGroup component definition must be registered');
assert.deepStrictEqual(Object.keys(definition.properties), ['title', 'description', 'card', 'bordered', 'ariaLabel']);

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--' + this.data.colorScheme; },
    setData(patch) { Object.assign(this.data, patch); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return instance;
}

const defaults = create();
assert.strictEqual(defaults.data.hasHeader, false);
assert(defaults.data.rootClass.includes('pui-cell-group'));
assert(defaults.data.rootClass.includes('pui-cell-group--bordered'));
assert(!defaults.data.rootClass.includes('pui-cell-group--card'));

const card = create({ title: 0, description: false, card: true, bordered: true, ariaLabel: '' });
assert.strictEqual(card.data.displayTitle, '0');
assert.strictEqual(card.data.displayDescription, 'false');
assert.strictEqual(card.data.hasHeader, true);
assert(card.data.rootClass.includes('pui-cell-group--card'));
assert(card.data.rootClass.includes('pui-cell-group--bordered'));
assert.strictEqual(card.data.semanticLabel, '0');

const borderless = create({ title: '设置', card: true, bordered: false, ariaLabel: '设置分组' });
assert(!borderless.data.rootClass.includes('pui-cell-group--bordered'));
assert.strictEqual(borderless.data.semanticLabel, '设置分组');

const wxml = fs.readFileSync(path.join(root, 'cell/cell-group.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'cell/cell-group.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'cell/cell-group.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
assert.strictEqual(json.component, true);
assert(wxml.includes('name="title"') && wxml.includes('name="description"') && wxml.includes('name="header"'));
assert(wxml.includes('<slot></slot>'));
assert(wxml.includes('role="group"'));
assert(wxss.includes('var(--pui-radius-large)'));
assert(wxss.includes('var(--pui-space-normal)'));
assert(wxss.includes('pui-cell-group--card'));
assert(preview.includes('function cellGroupSample(options = {})'));
assert(previewStyles.includes('.pui-cell-group--card .pui-cell-group__content'));

console.log('CellGroup contract tests passed.');
