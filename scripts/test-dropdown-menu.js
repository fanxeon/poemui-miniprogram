const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'dropdown-menu/dropdown-menu.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  isFinite,
  setTimeout,
  clearTimeout,
  require: () => ({}),
  wx: { nextTick: (callback) => callback() },
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'dropdown-menu/dropdown-menu.js' });

assert(definition, 'DropdownMenu component definition must be registered');

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, clone(definition.data), clone(defaults), clone(overrides || {})),
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const items = [
  { key: 'status', label: '状态', options: [{ label: '全部', value: 0 }, { label: '已完成', value: false }, { label: '不可用', value: 'disabled', disabled: true }] },
  { key: 'kind', label: '类型', multiple: true, options: [{ label: '组件', value: 'component' }, { label: '规范', value: 'guide' }] },
];

assert.strictEqual(Object.keys(definition.properties).length, 8, 'DropdownMenu 只公开 8 个 Props');

const defaults = create();
assert.strictEqual(defaults.instance.data.mounted, false);
assert.strictEqual(defaults.instance.data.activeIndex, -1);
assert.strictEqual(defaults.instance.data.layerStyle.includes('z-index:11600'), true);

const regular = create({ items, defaultValue: { status: 0, kind: ['component'] } });
assert.strictEqual(regular.instance.data.itemViews[0].summary, '全部');
assert.strictEqual(regular.instance.data.itemViews[1].summary, '组件');
assert.strictEqual(regular.instance.onTriggerTap({ currentTarget: { dataset: { index: 0 } }, detail: { source: 'tap' } }), true);
assert.deepStrictEqual(regular.events.map((event) => event.name), ['open']);
assert.strictEqual(regular.instance.data.active, true);
assert.strictEqual(regular.instance.data.activeOptions[0].checked, true);
assert.strictEqual(regular.instance.onOptionTap({ currentTarget: { dataset: { index: 1 } }, detail: { source: 'tap' } }), true);
assert.deepStrictEqual(regular.events.map((event) => event.name), ['open', 'change', 'close']);
assert.strictEqual(regular.instance.currentValue().status, false, '非受控选择保留 false 原值');
assert.strictEqual(regular.events[1].detail.option.value, false);

const toggleClose = create({ items, defaultValue: { status: 0 } });
assert.strictEqual(toggleClose.instance.onTriggerTap({ currentTarget: { dataset: { index: 0 } }, detail: { source: 'tap' } }), true);
assert.strictEqual(toggleClose.instance.onTriggerTap({ currentTarget: { dataset: { index: 0 } }, detail: { source: 'tap' } }), true, '再次点击当前 trigger 必须关闭，而不是调用不存在的方法');
assert.deepStrictEqual(toggleClose.events.map((event) => event.name), ['open', 'close']);
assert.strictEqual(toggleClose.events[1].detail.source, 'tap');

const unselected = create({ items, defaultValue: { status: undefined, kind: [] } });
assert.strictEqual(unselected.instance.data.itemViews[0].summary, '状态：未选择');
assert.strictEqual(unselected.instance.data.itemViews[1].summary, '类型：未选择');

const controlled = create({ items, value: { status: 0, kind: [] }, defaultValue: { status: false } });
controlled.instance.onTriggerTap({ currentTarget: { dataset: { index: 0 } }, detail: {} });
controlled.instance.onOptionTap({ currentTarget: { dataset: { index: 1 } }, detail: {} });
assert.strictEqual(controlled.instance.currentValue().status, 0, '受控 value 必须等待父级写回');
assert.strictEqual(controlled.events[1].detail.value.status, false);

const multi = create({ items, defaultValue: { status: 0, kind: ['component'] } });
multi.instance.onTriggerTap({ currentTarget: { dataset: { index: 1 } }, detail: {} });
assert.strictEqual(multi.instance.onOptionTap({ currentTarget: { dataset: { index: 1 } }, detail: {} }), true);
assert.deepStrictEqual(multi.instance.currentValue().kind, ['component', 'guide']);
assert.strictEqual(multi.events[multi.events.length - 1].name, 'change', '多选只 change，不自动关闭');
assert.strictEqual(multi.instance.data.active, true);
assert.strictEqual(multi.instance.onResetTap(), true);
assert.deepStrictEqual(multi.events.slice(-2).map((event) => event.name), ['change', 'reset']);
assert.strictEqual(JSON.stringify(multi.instance.currentValue().kind), '[]');
assert.strictEqual(multi.instance.onConfirmTap(), true);
assert.deepStrictEqual(multi.events.slice(-2).map((event) => event.name), ['confirm', 'close']);

const overlay = create({ items, defaultValue: {} });
overlay.instance.onTriggerTap({ currentTarget: { dataset: { index: 0 } }, detail: {} });
assert.strictEqual(overlay.instance.onOverlayTap(), true);
assert.strictEqual(overlay.events[overlay.events.length - 1].detail.source, 'overlay');
const protectedOverlay = create({ items, closeOnClickOverlay: false });
protectedOverlay.instance.onTriggerTap({ currentTarget: { dataset: { index: 0 } }, detail: {} });
assert.strictEqual(protectedOverlay.instance.onOverlayTap(), false);
assert.strictEqual(protectedOverlay.instance.data.active, true);

const disabled = create({ items: [{ key: 'locked', label: '锁定', disabled: true, options: [{ label: 'x', value: 0 }] }, items[0]] });
assert.strictEqual(disabled.instance.onTriggerTap({ currentTarget: { dataset: { index: 0 } }, detail: {} }), false);
disabled.instance.onTriggerTap({ currentTarget: { dataset: { index: 1 } }, detail: {} });
assert.strictEqual(disabled.instance.onOptionTap({ currentTarget: { dataset: { index: 2 } }, detail: {} }), false, '禁用选项不得变更');

const empty = create({ items: [{ key: 'empty', label: '空筛选', options: [] }] });
empty.instance.onTriggerTap({ currentTarget: { dataset: { index: 0 } }, detail: {} });
assert.strictEqual(empty.instance.data.activeOptions.length, 0, '空项由真实 Empty 呈现，但不伪造 error/retry');

const presentation = create({ items, zIndex: 99999, reduceMotion: true });
assert(presentation.instance.data.layerStyle.includes('z-index:12000'));
assert(presentation.instance.data.layerStyle.includes('--pui-dropdown-duration:1ms'));

const wxml = fs.readFileSync(path.join(root, 'dropdown-menu/dropdown-menu.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'dropdown-menu/dropdown-menu.wxss'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'dropdown-menu/dropdown-menu.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const shadcn = fs.readFileSync(path.join(root, 'metadata/shadcn.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert(wxml.includes('<pui-button'));
assert(wxml.includes('<pui-icon'));
assert(wxml.includes('<pui-empty'));
assert(wxml.includes('onConfirmTap'));
assert(!/<button\b|<input\b|<image\b/.test(wxml), '原生 DropdownMenu 只组合 PoemUI 控件');
assert(!wxml.includes('pui-loading'));
assert(wxss.includes('--pui-dropdown-duration'));
assert(!wxss.includes('height:auto'));
assert.strictEqual(json.usingComponents['pui-button'], '../button/button');
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert.strictEqual(json.usingComponents['pui-empty'], '../empty/empty');
assert.strictEqual(json.usingComponents['pui-loading'], undefined);
assert.strictEqual(metadata.apiProps['dropdown-menu'].length, 8, 'metadata 必须与原生 8 Props 同源');
assert(preview.includes('function dropdownPreviewSlim'));
assert(preview.includes('function updateDropdownPreviewDomSlim(demo)'));
assert(preview.includes("demoAction: 'dropdown-trigger-slim'"));
assert(preview.includes("if (current.mounted && current.active && current.activeIndex === index) return closeDropdownPreviewSlim(props, demo, source);"), 'H5 与小程序均须再次点击当前 trigger 关闭');
assert(preview.includes('aria-live="polite"'));
assert(preview.includes("return labels.length ? labels.join('、') : `${item.label}：未选择`;"));
assert(preview.includes("closeDropdownPreviewSlim(props, demo, 'confirm', confirmText);"));
assert(preview.includes("demo.dropdownSlimPhase = 'leaving';\n  const closeText"));
assert(preview.includes("demo.actionText = precedingEvent ? `${precedingEvent} → ${closeText}` : closeText;\n  updateDropdownPreviewDomSlim(demo);\n  state.previewDropdownTimer"), 'H5 关闭态必须在同一节点切 leaving，再在时长后卸载。');
assert(preview.includes("if (current.mounted) updateDropdownPreviewDomSlim(demo);\n  else renderStage();\n  requestAnimationFrame"), 'H5 打开态只在初次挂载渲染，已挂载节点必须原地进入最终帧。');
assert(styles.includes('.pui-dropdown-slim__layer.is-active {\n  pointer-events: auto;'), '打开态的真实遮罩必须可接收鼠标/触摸点击。');
assert(styles.includes('.pui-dropdown-slim__layer.is-active .pui-dropdown-slim__overlay {\n  pointer-events: auto;'), '打开态遮罩本身必须可点击关闭。');
assert(styles.includes('--pui-dropdown-slim-panel-offset: calc(var(--pui-preview-space-step-64) + var(--pui-preview-space-step-2));'), 'DropdownMenu 面板偏移必须由 PUI spacing Token 派生。');
assert(styles.includes('top: var(--pui-dropdown-slim-panel-offset);'), 'DropdownMenu 面板不得使用魔法 top 值。');
assert(!preview.includes('function dropdownMenuShowcase'));
assert(!preview.includes("demoAction: 'dropdown-select'"));
assert(api.includes('## DropdownMenu'));
assert(api.includes('不提供 loading、error、retry'));
assert(compatibility.includes('DropdownMenu 的 H5 镜像只实现'));
assert(shadcn.includes("['Dropdown Menu', 'dropdown-menu', 'adapter', 'tap'"));
assert(shadcn.includes('8 Props'));
assert(exampleWxml.includes('bind:change="onDropdownChange"'));
assert(!exampleWxml.includes('bind:scroll="onDropdownScroll"'));

console.log('DropdownMenu contract tests passed.');
