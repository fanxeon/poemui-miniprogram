const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'select/select.js'), 'utf8');
const wxml = fs.readFileSync(path.join(root, 'select/select.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'select/select.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'select/select.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/SELECT.md'), 'utf8');
const generator = fs.readFileSync(path.join(root, 'scripts/generate-shadcn-components.js'), 'utf8');
let definition;
vm.runInNewContext(source, { Component(value) { definition = value; }, require() { return {}; }, isFinite }, { filename: 'select/select.js' });
assert(definition);
assert.strictEqual(Object.keys(definition.properties).length, 11);
assert(!wxml.includes('<picker'), 'Select 不得继续把系统 picker 当作最终可见 UI');
assert(wxml.includes('<pui-button'), 'Select Trigger 和选项必须复用 PUI Button');
assert(wxml.includes('<pui-popup'), 'Select 选项层必须复用 PUI Popup');
assert(wxml.includes('custom-style="--pui-popup-section-gap:var(--pui-select-title-options-gap);"'), 'Select Popup 必须使用组件语义变量收口标题到选项的分区间距');
assert(wxml.includes('bind:click="onOptionClick"'));
assert(wxml.includes('bind:visible-change="onPopupVisibleChange"'));
assert(wxss.includes('--pui-select-title-options-gap:0'), 'Select 普通模式不得在 Popup Content inset 外重复叠加 section gap');
assert(wxss.includes('.pui-select.pui-spacing--equal{--pui-select-title-options-gap:var(--pui-surface-inset)}'), 'Select 等距模式只恢复一个 Surface inset');
assert(wxss.includes('.pui-select__options{display:flex;flex-direction:column;gap:var(--pui-control-gap);padding:0}'), 'Select Options 不得在 Popup Content padding 内再叠一层 panel padding');
assert(wxss.includes('border-radius:var(--pui-radius-medium)'), '小程序 Option 必须显式继承 PUI Button 的 medium 圆角 Token');
assert(json.usingComponents['pui-button']);
assert(json.usingComponents['pui-icon']);
assert(json.usingComponents['pui-popup']);
assert(contract.includes('input → change'));
assert(contract.includes('0` 和 `false`'));
assert(contract.includes('PUI Button'));
assert(contract.includes('PUI Popup'));
assert(preview.includes('function selectShowcase(props, options)'));
assert(preview.includes("select: { options: [{ label: 'Button', value: 'button' }, { label: 'Card', value: 'card' }, { label: 'Select', value: 'select' }, { label: 'Popover', value: 'popover', disabled: true }]"), 'H5 Select 默认演示必须保留四个候选项');
assert(preview.includes("updateCurrentProp('value', selected.value)"));
assert(preview.includes("if (type === 'select-option')"));
assert(previewStyles.includes('body .app-shell[data-page-mode] .preview-stage .pui-select-menu .pui-select-menu__option.pui-button {\n  border-radius: var(--pui-site-radius-control);\n}'), 'H5 选中 Option 必须恢复与 Trigger 相同的控制圆角，而不能被透明 Button 规则归零');
assert(previewStyles.includes('body .app-shell[data-page-mode] .preview-stage .pui-select-menu .pui-select-menu__option.is-selected.pui-button {\n  color: var(--brand);\n  background: var(--pui-button-soft);\n  background-color: var(--pui-button-soft) !important;\n  border-color: transparent;\n}'), 'H5 选中 Option 必须恢复真实可见的 PUI Button 选中 Surface，不能被透明背景规则覆盖');
assert(generator.includes("'select',"), 'Select 必须继续进入原生组件保护清单');
assert(!generator.includes('wxml: `<picker class="{{rootClass}}'), '生成器不得保留已废弃的系统 picker Select 模板');

function create(overrides) {
  const defaults = Object.fromEntries(Object.entries(definition.properties).map(([key, value]) => [key, value.value]));
  const events = [];
  const instance = {
    data: { ...definition.data, ...defaults, ...overrides },
    getColorSchemeClass() { return 'pui-theme-light'; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, definition.methods);
  instance.syncOptions();
  return { instance, events };
}

const options = [{ label: '零', value: 0 }, { label: '假', value: false }, { label: '禁用', value: 'blocked', disabled: true }];
const uncontrolled = create({ options, defaultValue: 0 });
assert.strictEqual(uncontrolled.instance.data.selectedIndex, 0);
assert.strictEqual(uncontrolled.instance.onTriggerClick(), true);
assert.strictEqual(uncontrolled.instance.data.menuVisible, true);
uncontrolled.instance.onOptionClick({ currentTarget: { dataset: { index: 1 } } });
assert.strictEqual(uncontrolled.instance.data.innerValue, false);
assert.strictEqual(uncontrolled.instance.data.menuVisible, false);
assert.deepStrictEqual(uncontrolled.events.map((event) => event.name), ['input', 'change']);
assert.strictEqual(uncontrolled.events[0].detail.source, 'option');

const controlled = create({ options, value: 0 });
controlled.instance.onTriggerClick();
controlled.instance.onOptionClick({ currentTarget: { dataset: { index: 1 } } });
assert.strictEqual(controlled.instance.data.innerValue, 0);
assert.strictEqual(controlled.events[0].detail.value, false);

const blocked = create({ options, disabled: true });
assert.strictEqual(blocked.instance.onTriggerClick(), false);
blocked.instance.onOptionClick({ currentTarget: { dataset: { index: 0 } } });
assert.strictEqual(blocked.events.length, 0);

const disabledOption = create({ options });
disabledOption.instance.onTriggerClick();
disabledOption.instance.onOptionClick({ currentTarget: { dataset: { index: 2 } } });
assert.strictEqual(disabledOption.events.length, 0);
assert.strictEqual(disabledOption.instance.data.menuVisible, true);

const cancelled = create({ options, defaultValue: false });
cancelled.instance.onTriggerClick();
cancelled.instance.onPopupVisibleChange({ detail: { visible: false, trigger: 'overlay' } });
assert.strictEqual(cancelled.instance.data.menuVisible, false);
assert.deepStrictEqual(cancelled.events.map((event) => event.name), ['cancel']);
assert.strictEqual(cancelled.events[0].detail.source, 'overlay');

console.log('Select contract tests passed.');
