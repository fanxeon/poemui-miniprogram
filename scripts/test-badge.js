const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('badge/badge.js');
let definition = null;
const sandbox = {
  console,
  isFinite,
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'badge/badge.js' });

assert(definition, 'Badge component definition must be registered');

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
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  instance.syncState();
  return { instance, events };
}

assert.deepStrictEqual(
  Object.keys(definition.properties),
  ['count', 'content', 'dot', 'maxCount', 'showZero', 'theme', 'variant', 'shape', 'size', 'color', 'offset', 'ariaLabel'],
  'Badge publishes the focused 12-Prop display contract',
);
assert.deepStrictEqual(Object.keys(definition.methods), ['syncState'], 'Badge has no public business methods');
assert(!source.includes('triggerEvent'), 'Badge is a display leaf and must not publish fake interaction events');
assert(!source.includes('setTimeout'), 'Badge does not own lifecycle timers');

const empty = create();
assert.strictEqual(empty.instance.data.rendered, false, 'count=0 is hidden by default');
assert.strictEqual(empty.instance.data.badgeText, '');

const maximum = create({ count: 128, maxCount: 99 });
assert.strictEqual(maximum.instance.data.badgeText, '99+');
assert.strictEqual(maximum.instance.data.rendered, true);

const zero = create({ count: 0, showZero: true });
assert.strictEqual(zero.instance.data.badgeText, '0');
assert.strictEqual(zero.instance.data.rendered, true);
const stringZero = create({ count: '0', showZero: false });
assert.strictEqual(stringZero.instance.data.rendered, false, 'string zero follows showZero');

[false, true, {}, [], '', '   ', undefined].forEach((count) => {
  const invalidCount = create({ count });
  assert.strictEqual(invalidCount.instance.data.rendered, false, `unsupported count ${String(count)} stays hidden`);
});

const hostContent = create({ count: 0, content: '消息', showZero: false });
assert.strictEqual(hostContent.instance.data.rendered, false, 'content is the host text and never aliases count');

const slot = create({ count: null });
assert.strictEqual(slot.instance.data.useCountSlot, true);
assert.strictEqual(slot.instance.data.rendered, true, 'count=null explicitly selects the named count slot');
assert.strictEqual(slot.instance.data.badgeLabel, '自定义徽标');

const dot = create({ dot: true, count: 128 });
assert.strictEqual(dot.instance.data.badgeText, '99+');
assert.strictEqual(dot.instance.data.badgeLabel, '新通知');
assert(dot.instance.data.rootClass.includes('pui-badge-wrap--dot'));

const invalid = create({
  count: ' 12 ',
  theme: 'invalid',
  variant: 'invalid',
  shape: 'invalid',
  size: 'invalid',
  offset: [999, -999],
  color: 'red;display:none',
});
assert(invalid.instance.data.rootClass.includes('pui-badge-wrap--danger'));
assert(invalid.instance.data.rootClass.includes('pui-badge-wrap--solid'));
assert(invalid.instance.data.rootClass.includes('pui-badge-wrap--circle'));
assert(invalid.instance.data.rootClass.includes('pui-badge-wrap--medium'));
assert(invalid.instance.data.rootStyle.includes('--pui-badge-offset-x:200rpx'));
assert(invalid.instance.data.rootStyle.includes('--pui-badge-offset-y:-200rpx'));
assert(!invalid.instance.data.rootStyle.includes('display:none'));
assert(!invalid.instance.data.rootStyle.includes('red;'));

const safeStyle = create({ count: 1, color: '#123456', offset: ['12px', '-2rem'] }).instance.data.rootStyle;
assert(safeStyle.includes('--pui-badge-tone:#123456'));
assert(safeStyle.includes('--pui-badge-offset-x:12px'));
assert(safeStyle.includes('--pui-badge-offset-y:-2rem'));
assert(create({ count: 1, offset: ['bad', '300%'] }).instance.data.rootStyle.includes('--pui-badge-offset-y:200%'));

const wxml = read('badge/badge.wxml');
const wxss = read('badge/badge.wxss');
assert(!/<button\b/.test(wxml), 'Badge does not need a native button');
assert(!/bind(?:tap|click|longpress)=/.test(wxml), 'Badge leaves interaction to its host component');
assert(wxml.includes('<slot wx:else></slot>'), 'Badge keeps the default host slot');
assert(wxml.includes('name="count"'), 'Badge publishes the named count slot');
assert(wxml.includes('wx:if="{{useCountSlot && !dot}}"'), 'count slot follows the explicit null sentinel');
assert(wxml.includes('aria-live="polite"'), 'Badge count is announced as status content');
assert(wxss.includes('.pui-badge__content:empty + .pui-badge'), 'Badge automatically becomes standalone without a host');
assert(wxss.includes('position: absolute'), 'Badge anchors to the host top-right corner');
assert(!/\.pui-badge\s*\{[^}]*display\s*:\s*none/s.test(wxss), 'Badge status node is not hidden through display:none');
assert(!/transition\s*:/.test(wxss), 'Badge owns no lifecycle animation');

const metadata = require(path.join(root, 'metadata/components.js'));
assert(metadata.details.badge, 'Badge metadata exists');
assert.strictEqual(metadata.apiProps.badge.length, 12, 'metadata mirrors the 12-Prop contract');
assert.deepStrictEqual((metadata.apiEvents.badge || []).map((item) => item.name), [], 'metadata publishes no Badge events');
assert.deepStrictEqual(metadata.apiSlots.badge.map((item) => item.name), ['default', 'count']);

const shadcn = require(path.join(root, 'metadata/shadcn.js'));
assert.strictEqual(shadcn.shadcnComponents.find((item) => item.poem === 'badge').trigger, 'none', 'Badge comparison declares no trigger');

const preview = read('preview/app.js');
['基础用法', '红点与上限', '尺寸与形状', '主题与变体', '组合用法'].forEach((title) => {
  assert(preview.includes(title), `Badge preview includes ${title}`);
});
assert(!preview.includes('Badge native mirror'), 'Badge preview no longer exposes diagnostics');
assert(!preview.includes('onBadgeShow'), 'Badge preview does not teach removed lifecycle events');
assert(!/case ['"]badge['"][\s\S]{0,1600}bind:/.test(preview), 'Badge usage code stays event-free');
assert(preview.includes("state.props[state.current] = { ...componentPropDefaults.badge"), 'Badge reset restores source defaults instead of the illustrative count=3');
assert(preview.includes('<pui-badge${attrs ? ` ${attrs}` : \'\'}>'), 'Badge usage code does not leave a trailing space when all Props equal source defaults');

const example = read('_example/miniprogram/pages/components/index.wxml');
assert(example.includes('<pui-badge count="128"'));
assert(example.includes('slot="count"'), 'example demonstrates the named count slot');
assert(!/<pui-badge[^>]*bind:/.test(example), 'basic Badge example binds no fake events');

const internalBadgeUsages = [
  'grid/grid.wxml',
  'radio/radio.wxml',
  'navigation-menu/navigation-menu.wxml',
].map(read).join('\n');
const internalBadgeTags = internalBadgeUsages.match(/<pui-badge\b[^>]*>/g) || [];
['value=', 'text=', 'visible=', 'text-color=', 'border-color=', 'standalone=', 'use-content-slot=', 'clickable=', 'aria-live=', 'reduce-motion='].forEach((legacy) => {
  assert(!internalBadgeTags.some((tag) => tag.includes(legacy)), `internal Badge consumers do not use removed ${legacy}`);
});

assert(read('docs/components/BADGE.md').includes('TDesign 1.15.3 对照决定'), 'Badge semantic contract records the reference version');

process.stdout.write('Badge contract tests passed.\n');
