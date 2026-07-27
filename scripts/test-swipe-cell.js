const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'swipe-cell/swipe-cell.js');
const source = fs.readFileSync(sourcePath, 'utf8');
let definition = null;

vm.runInNewContext(source, {
  console,
  Array,
  Number,
  String,
  Math,
  setTimeout(callback) { callback(); return 1; },
  clearTimeout() {},
  require(request) {
    if (request === '../common/behaviors/theme') return {};
    if (request === '../common/utils/platform-info') return { getWindowInfo: () => ({ windowWidth: 375 }) };
    throw new Error(`Unexpected dependency: ${request}`);
  },
  wx: { getWindowInfo() { return { windowWidth: 375 }; } },
  Component(value) { definition = value; },
}, { filename: sourcePath });

assert(definition, 'SwipeCell component definition must be registered');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return `pui-theme--${this.data.colorScheme}`; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

const expectedProps = ['disabled', 'left', 'opened', 'right', 'ariaLabel', 'reduceMotion'];
assert.deepStrictEqual(Object.keys(definition.properties), expectedProps, 'SwipeCell only exposes the TDesign-shaped props plus PoemUI accessibility/motion fields');

const defaults = create();
assert.strictEqual(defaults.instance.data.currentPosition, '');
assert.strictEqual(defaults.instance.data.leftWidth, 0);
assert.strictEqual(defaults.instance.data.rightWidth, 0);

const rightOpened = create({ left: [{ text: '收藏' }], right: [{ text: '删除' }], opened: true });
assert.strictEqual(rightOpened.instance.data.currentPosition, 'right', 'Boolean opened prioritizes right actions just like TDesign');
assert.strictEqual(rightOpened.instance.data.offset, -136);

const leftOpened = create({ left: [{ text: '收藏' }], right: [{ text: '删除' }], opened: [true, false] });
assert.strictEqual(leftOpened.instance.data.currentPosition, 'left');
assert.strictEqual(leftOpened.instance.data.offset, 136);

const customWidth = create({ left: [{ text: '收藏', style: 'width:200rpx;background:#000' }], right: [{ text: '删除', style: 'width:80px' }], opened: [true, false] });
assert.strictEqual(customWidth.instance.data.leftWidth, 200, 'rpx action widths must affect the native action layer and threshold');
assert.strictEqual(customWidth.instance.data.rightWidth, 160, 'px action widths must convert through the real rpx scale');
assert.strictEqual(customWidth.instance.data.offset, 200, 'opened position must use the resolved custom width');

const gesture = create({ left: [{ text: '收藏' }], right: [{ text: '删除' }] });
gesture.instance.onTouchStart({ touches: [{ clientX: 100, clientY: 80 }] });
gesture.instance.onTouchMove({ touches: [{ clientX: 170, clientY: 80 }] });
assert.deepStrictEqual(JSON.parse(JSON.stringify(gesture.events)), [{ name: 'dragstart' }]);
assert.strictEqual(gesture.instance.data.dragging, true);
gesture.instance.onTouchEnd();
assert.strictEqual(gesture.instance.data.currentPosition, 'left', 'horizontal travel beyond 30% opens the matching side');
assert.deepStrictEqual(JSON.parse(JSON.stringify(gesture.events)), [{ name: 'dragstart' }, { name: 'dragend' }]);

gesture.instance.onContentTap();
assert.strictEqual(gesture.instance.data.currentPosition, '', 'content tap closes an opened action layer');

const action = create({ right: [{ text: '删除', icon: 'delete', style: 'background:red' }], opened: true });
action.instance.onActionTap({ currentTarget: { dataset: { position: 'right', index: 0 } } });
assert.deepStrictEqual(JSON.parse(JSON.stringify(action.events)), [{ name: 'click', detail: { action: { text: '删除', icon: 'delete', style: 'background:red' }, source: 'right' } }]);
assert.strictEqual(action.instance.data.currentPosition, '', 'an array action closes the layer but does not fabricate business success');

const disabled = create({ disabled: true, right: [{ text: '删除' }] });
disabled.instance.onTouchStart({ touches: [{ clientX: 100, clientY: 80 }] });
disabled.instance.onTouchMove({ touches: [{ clientX: 20, clientY: 80 }] });
disabled.instance.onTouchEnd();
disabled.instance.onActionTap({ currentTarget: { dataset: { position: 'right', index: 0 } } });
assert.deepStrictEqual(JSON.parse(JSON.stringify(disabled.events)), []);

const reduced = create({ right: [{ text: '删除' }], opened: true, reduceMotion: true });
assert(reduced.instance.data.contentStyle.includes('transition-duration:1ms'));

const wxml = fs.readFileSync(path.join(root, 'swipe-cell/swipe-cell.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'swipe-cell/swipe-cell.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'swipe-cell/swipe-cell.json'), 'utf8'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components.js'));
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/SWIPE-CELL.md'), 'utf8');
const contractIndex = fs.readFileSync(path.join(root, 'docs/components/README.md'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');

assert(wxml.includes('<slot name="left"></slot>') && wxml.includes('<slot name="right"></slot>') && wxml.includes('<slot></slot>'));
assert(wxml.includes('bindtouchstart="onTouchStart"') && wxml.includes('bindtouchend="onTouchEnd"'));
assert(wxml.includes('style="width:{{item.width}}rpx;{{item.style}}"'), 'array action style widths must reach the native layout');
assert(!/title=|description=|loading=|left-actions|right-actions|bind:input|bind:change|bind:open|bind:close|bind:action/.test(wxml));
assert.deepStrictEqual(Object.keys(json.usingComponents), ['pui-button']);
assert(!/height\s*:\s*auto[^;]*transition|display\s*:\s*none/.test(wxss));
assert(wxss.includes('transition-property: transform'));

assert.deepStrictEqual(metadata.apiProps['swipe-cell'], expectedProps);
assert.deepStrictEqual(metadata.apiEvents['swipe-cell'].map((event) => event.name), ['click', 'dragstart', 'dragend']);
assert.deepStrictEqual(metadata.apiSlots['swipe-cell'].map((slot) => slot.name), ['default', 'left', 'right']);
assert.strictEqual(metadata.apiMethods['swipe-cell'], undefined);

const usage = preview.slice(preview.indexOf("if (runtimeId === 'swipe-cell')"), preview.indexOf("if (runtimeId === 'count-down')"));
const showcase = preview.slice(preview.indexOf('const SWIPE_ACTION_WIDTH'), preview.indexOf('function countDownClamp'));
assert(usage.includes('<pui-swipe-cell${attrs ? ` ${attrs}` : \'\'}>'));
assert(!usage.includes('bind:'), 'SwipeCell basic WXML must stay bind-free');
assert(showcase.includes('function bindSwipeCellPreviewRuntime(props)'));
assert(showcase.includes('function swipeActionWidth(action)'));
assert(showcase.includes('function swipeH5ActionStyle(style)'));
assert(showcase.includes("if (demo.swipePosition === 'left' && left.length) return 'left';"), 'H5 opened state must retain the resolved left position after props are normalized');
assert(showcase.includes("if (demo.swipePosition === 'right' && right.length) return 'right';"), 'H5 opened state must retain the resolved right position after props are normalized');
assert(showcase.includes("emitSwipePreviewEvent(root, 'dragstart')"));
assert(showcase.includes("emitSwipePreviewEvent(root, 'dragend')"));
assert(preview.includes("emitSwipePreviewEvent(root, 'click', { action: swipeAction.source, source: position })"));
assert(!/swipe-open-left|swipe-open-right|swipe-close|pui-swipe-cell-preview__methods|pui-swipe-cell-preview__event/.test(showcase));
assert(styles.includes('.pui-swipe-cell-preview__content {') && styles.includes('transition: transform 500ms'));
assert(/\.pui-swipe-cell-preview\s*\{[^}]*overflow:\s*hidden;[^}]*border-radius:\s*var\(--pui-preview-radius-medium\);[^}]*isolation:\s*isolate;/.test(styles), 'SwipeCell H5 owns the clipping radius for frosted action underlays');
assert(preview.includes("left: [{ text: '收藏', icon: 'star', theme: 'primary' }]") && preview.includes("right: [{ text: '删除', icon: 'delete', theme: 'danger' }]"), 'SwipeCell default actions use opaque semantic themes instead of translucent inline surfaces');

const swipeApi = api.slice(api.indexOf('## SwipeCell'), api.indexOf('## Alert'));
assert(swipeApi.includes('SwipeCell 有 6 个 Props、3 个 Events、3 个 Slots，没有公开 Methods。'));
assert(swipeApi.includes('<pui-swipe-cell>'));
assert(!/\| `title`|\| `leftActions`|\| `actionWidth`|\| `defaultOpened`|\| `input` \/ `change`/.test(swipeApi));
assert(/\d+\. SwipeCell 的 H5 镜像只实现/.test(compatibility));
assert(contract.includes('tdesign-miniprogram@1.15.3'));
assert(contractIndex.includes('[SwipeCell](./SWIPE-CELL.md)'));
assert(exampleWxml.includes('<pui-swipe-cell') && !exampleWxml.includes('bind:click="onSwipeCell'));

if (process.env.PUI_VERIFY_DIST === '1') {
  ['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    assert.strictEqual(
      fs.readFileSync(path.join(root, 'miniprogram_dist/swipe-cell', `swipe-cell.${extension}`), 'utf8'),
      fs.readFileSync(path.join(root, 'swipe-cell', `swipe-cell.${extension}`), 'utf8'),
      `dist SwipeCell ${extension} must match source`,
    );
  });
}

console.log('SwipeCell contract tests passed.');
