const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'button/fab/fab.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: 'button/fab/fab.js' });
assert(definition, 'FAB component definition must be registered');
assert.deepStrictEqual(Object.keys(definition.properties), ['theme', 'variant', 'icon', 'content', 'size', 'loading', 'disabled', 'ariaLabel', 'reduceMotion']);

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--' + this.data.colorScheme; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const circle = create();
assert(circle.instance.data.rootClass.includes('pui-fab--default'));
assert(circle.instance.data.rootClass.includes('pui-fab--medium'));
assert.strictEqual(circle.instance.data.buttonShape, 'circle');
assert.strictEqual(circle.instance.data.buttonTheme, 'default');

const extended = create({ content: '发布', theme: 'inverse', variant: 'base' });
assert(extended.instance.data.rootClass.includes('pui-fab--extended'));
assert.strictEqual(extended.instance.data.buttonShape, 'round');
assert.strictEqual(extended.instance.data.buttonTheme, 'default', 'inverse maps to Button default and owns its surface in FAB');
extended.instance.onButtonClick({ detail: { source: 'button' } });
assert.strictEqual(JSON.stringify(extended.events), JSON.stringify([{ name: 'click', detail: { source: 'fab' } }]));

const disabled = create({ disabled: true });
disabled.instance.onButtonClick({ detail: {} });
assert.strictEqual(JSON.stringify(disabled.events), '[]');
const loading = create({ loading: true });
loading.instance.onButtonClick({ detail: {} });
assert.strictEqual(JSON.stringify(loading.events), '[]');

const wxml = fs.readFileSync(path.join(root, 'button/fab/fab.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'button/fab/fab.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'button/fab/fab.json'), 'utf8'));
const backTopJson = JSON.parse(fs.readFileSync(path.join(root, 'back-top/back-top.json'), 'utf8'));
const backTopWxml = fs.readFileSync(path.join(root, 'back-top/back-top.wxml'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
assert(wxml.includes('<pui-button'));
assert(wxml.includes('bind:click="onButtonClick"'));
assert(wxml.includes('icon-only="{{!buttonContent}}"'), 'icon-only FAB must remove empty Button content tracks and keep its icon geometrically centered');
assert(wxml.includes('<slot name="icon"></slot>') && wxml.includes('<slot></slot>'));
assert(!/<button\b/.test(wxml), 'FAB WXML must not add a native button root');
assert.deepStrictEqual(Object.keys(json.usingComponents), ['pui-button']);
assert(wxss.includes('var(--pui-space-normal)'));
assert(wxss.includes('var(--pui-bg-inverse)'));
assert(!wxss.includes('display: none'));
assert(!/\b(?:[4-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss));
assert.deepStrictEqual(Object.keys(backTopJson.usingComponents), ['pui-fab']);
assert(backTopWxml.includes('<pui-fab'));
assert(preview.includes('function fabSample(props = {})'));
assert(previewStyles.includes('.pui-fab-preview'));

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = path.join(root, `button/fab/fab.${extension}`);
  const distFile = path.join(root, `miniprogram_dist/button/fab/fab.${extension}`);
  assert(fs.existsSync(distFile), `FAB dist ${extension} must exist after site:build`);
  assert.strictEqual(sha(sourceFile), sha(distFile), `FAB source/dist ${extension} must stay identical`);
  const installedFile = path.join(root, `_example/node_modules/poemui-miniprogram/miniprogram_dist/button/fab/fab.${extension}`);
  assert(fs.existsSync(installedFile), `FAB example install ${extension} must exist`);
  assert.strictEqual(sha(sourceFile), sha(installedFile), `FAB source/example install ${extension} must stay identical`);
  const wechatFile = path.join(root, `_example/miniprogram/miniprogram_npm/poemui-miniprogram/button/fab/fab.${extension}`);
  if (fs.existsSync(wechatFile)) assert.strictEqual(sha(sourceFile), sha(wechatFile), `FAB source/WeChat npm ${extension} must stay identical`);
});

console.log('FAB contract tests passed.');
