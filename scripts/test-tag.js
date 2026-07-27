const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('tag/tag.js');
let definition = null;
vm.runInNewContext(source, {
  console,
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: 'tag/tag.js' });

assert(definition, 'Tag component definition must be registered');
assert.deepStrictEqual(
  Object.keys(definition.properties),
  ['theme', 'variant', 'shape', 'icon', 'maxWidth', 'disabled', 'content', 'size', 'closable'],
  'Tag publishes the focused 9-Prop display and close contract',
);
assert(!/^\s{4}round:/m.test(source), 'Tag removes the duplicate round property');
assert(!source.includes("triggerEvent('click'"), 'Tag root publishes no click event');
assert(!Object.prototype.hasOwnProperty.call(definition.observers, '**'), 'Tag must not observe internal setData with a catch-all observer');
assert.strictEqual(
  Object.keys(definition.observers)[0],
  'theme, variant, shape, icon, maxWidth, disabled, content, size, closable, colorScheme',
  'Tag observes only public appearance inputs so updateClass cannot trigger itself',
);

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return ''; },
    setData(patch) { Object.assign(this.data, patch); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.assign(instance, definition.methods);
  instance.updateClass();
  return { instance, events };
}

const defaults = create();
assert(defaults.instance.data.rootClass.includes('pui-tag--medium'));
assert(!defaults.instance.data.rootClass.includes('pui-tag--round'));
assert.strictEqual(defaults.instance.data.maxWidthStyle, '');
assert.strictEqual(defaults.instance.data.resolvedIcon, '');

const observerKey = Object.keys(definition.observers)[0];
const observerInstance = create().instance;
let observerRuns = 0;
const originalSetData = observerInstance.setData;
observerInstance.setData = function setDataWithoutObserverLoop(patch) {
  originalSetData.call(this, patch);
  assert(!Object.keys(patch).some((key) => observerKey.split(',').map((item) => item.trim()).includes(key)), 'derived state must not retrigger the public-Prop observer');
};
definition.observers[observerKey].call(observerInstance);
observerRuns += 1;
assert.strictEqual(observerRuns, 1, 'one public-Prop update converges after one observer run');

const round = create({ theme: 'success', variant: 'dark', size: 'large', shape: 'round', icon: ' check-circle ', maxWidth: '180rpx' });
['pui-tag--success', 'pui-tag--dark', 'pui-tag--large', 'pui-tag--round'].forEach((name) => assert(round.instance.data.rootClass.includes(name)));
assert.strictEqual(round.instance.data.maxWidthStyle, 'max-width:180rpx;');
assert.strictEqual(round.instance.data.resolvedIcon, 'check-circle');

const invalid = create({ theme: 'brand', variant: 'ghost', size: 'tiny', shape: 'pill', maxWidth: '100px;color:red' });
assert(invalid.instance.data.rootClass.includes('pui-tag--medium'));
assert(!invalid.instance.data.rootClass.includes('pui-tag--brand'));
assert(!invalid.instance.data.rootClass.includes('pui-tag--ghost'));
assert(!invalid.instance.data.rootClass.includes('pui-tag--pill'));
assert.strictEqual(invalid.instance.data.maxWidthStyle, '');

assert.strictEqual(create({ maxWidth: 0 }).instance.data.maxWidthStyle, 'max-width:0px;');
assert.strictEqual(create({ maxWidth: 120 }).instance.data.maxWidthStyle, 'max-width:120px;');
assert.strictEqual(create({ maxWidth: '42%' }).instance.data.maxWidthStyle, 'max-width:42%;');
assert.strictEqual(create({ maxWidth: '-1px' }).instance.data.maxWidthStyle, '');
assert.strictEqual(create({ maxWidth: 'calc(100%)' }).instance.data.maxWidthStyle, '');

const closable = create({ closable: true });
closable.instance.onClose();
assert.strictEqual(JSON.stringify(closable.events), JSON.stringify([{ name: 'close', detail: { source: 'close' } }]));
const disabled = create({ closable: true, disabled: true });
disabled.instance.onClose();
assert.strictEqual(disabled.events.length, 0, 'disabled Close is a real event gate');

const wxml = read('tag/tag.wxml');
const wxss = read('tag/tag.wxss');
const json = JSON.parse(read('tag/tag.json'));
assert(!/bindtap=/.test(wxml), 'Tag root is not clickable');
assert(wxml.includes('aria-disabled="{{disabled}}"'));
assert(wxml.includes('catchtap="onClose"'));
assert(wxml.includes('wx:if="{{content !== \'\'}}"'));
assert(wxml.includes('style="{{customStyle}};{{maxWidthStyle}}"'));
assert(wxml.includes('<slot></slot>'));
assert.strictEqual(json.usingComponents['pui-icon'], '../icon/icon');
assert(wxss.includes('.pui-tag__content'));
assert(wxss.includes('.pui-tag--success.pui-tag--dark'));
assert(wxss.includes('width: 28rpx'));
assert(wxss.includes('height: 28rpx'));

const metadata = require(path.join(root, 'metadata/components.js'));
assert.deepStrictEqual(metadata.apiProps.tag, ['theme', 'variant', 'size', 'shape', 'content', 'icon', 'closable', 'disabled', 'maxWidth']);
assert.deepStrictEqual(metadata.apiEvents.tag.map((item) => item.name), ['close']);
assert.deepStrictEqual(metadata.apiSlots.tag.map((item) => item.name), ['default']);
assert.deepStrictEqual(metadata.apiPropGroups.tag.flatMap((item) => item.keys), ['content', 'icon', 'closable', 'disabled', 'maxWidth', 'theme', 'variant', 'size', 'shape']);

const preview = read('preview/app.js');
['基础用法', '主题与变体', '尺寸与形状', '可关闭与长文本'].forEach((title) => assert(preview.includes(title)));
assert(preview.includes("['badge', 'avatar', 'image', 'tag', 'grid', 'count-down'].includes(runtimeId)"), 'Tag WXML generation uses source defaults');
assert(preview.includes("['avatar', 'image', 'tag', 'grid'].includes(previewId)"), 'reset restores true Tag source defaults');
assert(preview.includes("shape: { type: 'select', value: 'square', options: ['square', 'round', 'mark'] }"));
assert(!preview.includes("round: { type: 'boolean', value: false },\n  },\n  loading"));
const tagHelper = preview.slice(preview.indexOf('function tagSample'), preview.indexOf('function safeCssDimension'));
assert(tagHelper.includes('<section class="demo-section pui-tag-showcase">'), 'Tag showcase keeps the standard selectable preview root');
assert(tagHelper.includes('function tagPreviewMaxWidth'));
assert(tagHelper.includes('data-tag-content'));
assert(tagHelper.includes("maxWidth: '240rpx'"), 'Tag long-text showcase keeps enough width to remain readable');
assert(!tagHelper.includes("maxWidth: '180rpx'"), 'Tag showcase must not use an overly narrow long-text width');
assert(!tagHelper.includes("props.content || '标签'"));
assert(!tagHelper.includes('props.round'));
assert(tagHelper.includes("content: '父级重新挂载标签'"));
assert(preview.includes("type === 'tag-close' && previewIdFor(state.current) === 'tag' && !props.disabled"));

const previewCss = read('preview/styles.css');
assert(previewCss.includes('.pui-tag--large'));
assert(previewCss.includes('height: var(--pui-preview-space-step-29)'));
assert(previewCss.includes('.pui-tag--primary.pui-tag--light'), 'Tag preview renders primary light tags as filled semantic chips');
assert(previewCss.includes('background: color-mix(in srgb, var(--brand) 14%, var(--surface-solid));'), 'Tag preview primary fill uses PoemUI brand tokens');
assert(previewCss.includes('.pui-tag--success.pui-tag--light'), 'Tag preview renders success light tags as filled semantic chips');
assert(previewCss.includes('.pui-tag-showcase'));
assert(previewCss.includes('column-gap: var(--pui-preview-content-gap);\n  row-gap: var(--pui-preview-space-step-10);'), 'Tag showcase keeps separate horizontal and vertical spacing tokens');
assert(previewCss.includes('.pui-tag-showcase__grid + .pui-tag-showcase__row,\n.pui-tag-showcase__row + .pui-tag-showcase__row {\n  margin-top: var(--pui-preview-space-step-10);\n}'), 'Tag showcase keeps a vertical gap between sibling rows');
assert(!previewCss.includes('grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));'), 'Tag showcase must not squeeze labels into fixed 64px grid tracks');
assert(!previewCss.includes('[data-shadow="on"][data-page-mode] .preview-stage .pui-tag'), 'Tag must not gain an outer shadow from the global preference');
assert(previewCss.includes('[data-frost="on"][data-page-mode] .preview-stage .pui-tag:not(.pui-tag--outline):not(.pui-tag--dark)'));
assert(read('docs/components/TAG.md').includes('禁止外投影'), 'Tag contract locks the display-leaf shadow boundary');

const exampleWxml = read('_example/miniprogram/pages/index/index.wxml');
const exampleJs = read('_example/miniprogram/pages/index/index.js');
assert(exampleWxml.includes('wx:if="{{tagVisible}}"'));
assert(exampleWxml.includes('bind:click="restoreTag"'));
assert(exampleJs.includes('this.setData({ tagVisible: false })'));
assert(exampleJs.includes('this.setData({ tagVisible: true })'));
assert(!/onTagClose[\s\S]{0,180}showToast/.test(exampleJs), 'example uses parent state instead of a fake close toast');

const api = read('docs/COMPONENT_API.md');
assert(api.includes('## Tag'));
assert(api.includes("`close` | `{ source: 'close' }`"));
assert(api.includes('<pui-tag>标签</pui-tag>'));
assert(api.includes('TDesign 1.15.3 Tag'));
assert(read('docs/components/TAG.md').includes('TDesign 1.15.3 对照决定'));
assert(read('docs/components/README.md').includes('[Tag](./TAG.md)'));
assert(/\d+\. Tag 的 H5 镜像/.test(read('docs/H5_PREVIEW_COMPATIBILITY.md')));

process.stdout.write('Tag contract tests passed.\n');
