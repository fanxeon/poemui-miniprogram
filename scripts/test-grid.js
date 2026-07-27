const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('grid/grid.js');
let definition = null;
vm.runInNewContext(source, {
  console,
  require: () => ({}),
  Component(value) { definition = value; },
}, { filename: 'grid/grid.js' });

assert(definition, 'Grid component definition must be registered');
assert.deepStrictEqual(
  Object.keys(definition.properties),
  ['items', 'column', 'gutter', 'border', 'align', 'disabled', 'loading', 'error', 'loadingText', 'errorText', 'emptyText', 'retryText', 'ariaLabel', 'reduceMotion'],
  'Grid publishes the focused 14-Prop action contract',
);
['hover', 'theme', 'showFooter', 'duration', 'easing'].forEach((legacy) => {
  assert(!Object.prototype.hasOwnProperty.call(definition.properties, legacy), `Grid removes legacy ${legacy}`);
});

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
  instance.syncState();
  return { instance, events };
}

const defaults = create();
assert.strictEqual(defaults.instance.data.status, 'empty');
assert.strictEqual(defaults.instance.data.resolvedColumn, 4);
assert.strictEqual(defaults.instance.data.horizontal, false);
assert(defaults.instance.data.gridStyle.includes('repeat(4'));

const edge = create({
  items: [
    { label: '', description: '', value: 0, icon: '', badge: 0, theme: 'primary' },
    { label: '布尔', value: false, icon: 'component', badge: '', disabled: true },
    { label: '空值', value: '', icon: 'component', theme: 'danger' },
    true,
  ],
  column: 0,
  gutter: 80,
  align: 'left',
});
assert.strictEqual(edge.instance.data.status, 'content');
assert.strictEqual(edge.instance.data.horizontal, true);
assert(edge.instance.data.rootClass.includes('pui-grid--horizontal'));
assert(edge.instance.data.rootClass.includes('pui-grid--left'));
assert(edge.instance.data.gridStyle.includes('grid-auto-flow:column'));
assert(edge.instance.data.gridStyle.includes('gap:64rpx'));
assert.strictEqual(edge.instance.data.normalizedItems[0].label, '');
assert.strictEqual(edge.instance.data.normalizedItems[0].icon, '');
assert.strictEqual(edge.instance.data.normalizedItems[0].badge, 0);
assert.strictEqual(edge.instance.data.normalizedItems[0].showBadge, true);
assert.strictEqual(edge.instance.data.normalizedItems[0].value, 0);
assert.strictEqual(edge.instance.data.normalizedItems[1].value, false);
assert.strictEqual(edge.instance.data.normalizedItems[2].value, '');
assert.strictEqual(edge.instance.data.normalizedItems[3].value, true);

edge.instance.onItemTap({ currentTarget: { dataset: { index: 0 } }, detail: { source: 'button' } });
assert.strictEqual(edge.events[0].name, 'click');
assert.strictEqual(edge.events[0].detail.value, 0);
assert.strictEqual(edge.events[0].detail.source, 'button');
assert(!Object.prototype.hasOwnProperty.call(edge.events[0].detail.item, 'showBadge'), 'internal fields are not leaked');
edge.instance.onItemTap({ currentTarget: { dataset: { index: 1 } }, detail: {} });
assert.strictEqual(edge.events.length, 1, 'disabled item blocks click');

const status = create({ items: ['入口'], loading: true, error: true, retryText: '重试' });
assert.strictEqual(status.instance.data.status, 'error', 'error wins over loading and content');
status.instance.onRetry({ detail: { source: 'action' } });
assert.strictEqual(JSON.stringify(status.events[0]), JSON.stringify({ name: 'retry', detail: { source: 'action' } }));
assert.strictEqual(status.instance.data.status, 'error', 'retry never fabricates recovery');
assert.strictEqual(create({ error: true, reduceMotion: true }).instance.data.rootStyle, '--pui-grid-duration:1ms;');
const disabledRetry = create({ error: true, disabled: true });
disabledRetry.instance.onRetry({ detail: {} });
assert.strictEqual(disabledRetry.events.length, 0);
const hiddenRetry = create({ error: true, retryText: '' });
hiddenRetry.instance.onRetry({ detail: {} });
assert.strictEqual(hiddenRetry.events.length, 0);

const wxml = read('grid/grid.wxml');
const wxss = read('grid/grid.wxss');
const json = JSON.parse(read('grid/grid.json'));
assert(!wxml.includes('showFooter'));
assert(!wxml.includes('slot name="footer"'));
assert(!/wx:(?:if|elif)="{{status/.test(wxml), 'all primary state layers remain mounted');
assert(wxml.includes('<scroll-view'));
assert(wxml.includes('<pui-button'));
assert(wxml.includes('<pui-badge'));
assert(wxml.includes('<pui-loading'));
assert.strictEqual((wxml.match(/<pui-empty/g) || []).length, 2);
assert(!wxml.includes('bind:action="onRetry"'), 'Empty no longer publishes an action event');
assert(wxml.includes('<pui-button wx:if="{{retryText !== \'\'}}"'), 'Grid retry remains a consumer-owned PUI Button next to Empty');
assert(wxml.includes('bind:click="onRetry"'));
assert(wxml.includes('aria-busy="{{status === \'loading\'}}"'));
assert(wxml.includes('aria-invalid="{{status === \'error\'}}"'));
assert.strictEqual(json.usingComponents['pui-empty'], '../empty/empty');
assert(wxss.includes('.pui-grid__layer--active'));
assert(wxss.includes('visibility: hidden'));
assert(!wxss.includes('display: none'));
assert(wxss.includes('transition-duration: 1ms'));
assert(wxss.includes('.pui-grid__state .pui-empty'));
assert(wxss.includes('flex-direction: column;') && wxss.includes('gap: var(--pui-space-normal);'), 'Grid state content stacks Empty and retry vertically with a token gap');

const metadata = require(path.join(root, 'metadata/components.js'));
assert.deepStrictEqual(metadata.apiProps.grid, ['items', 'column', 'gutter', 'border', 'align', 'disabled', 'loading', 'error', 'loadingText', 'errorText', 'emptyText', 'retryText', 'ariaLabel', 'reduceMotion']);
assert.deepStrictEqual(metadata.apiEvents.grid.map((item) => item.name), ['click', 'retry']);
assert.strictEqual(metadata.apiSlots.grid, undefined);
assert.deepStrictEqual(metadata.apiPropGroups.grid.flatMap((item) => item.keys), metadata.apiProps.grid);

const preview = read('preview/app.js');
['基础用法', '列数与间距', '徽标与禁用', '加载、空与错误'].forEach((title) => assert(preview.includes(title)));
const gridPreview = preview.slice(preview.indexOf('function previewGridItems'), preview.indexOf('function tabsSameValue'));
['gridPreview', 'loadingComponent', 'emptySample', "demoAction: 'grid-click'", "demoAction: options.current ? 'grid-retry'", 'gap = Math.max(0, Math.min(64, Number(props.gutter) || 0)) / 2', 'function bindGridPreviewRuntime', 'data-grid-layer'].forEach((contract) => assert(gridPreview.includes(contract)));
assert(preview.includes("if (id === 'grid') {\n    bindGridPreviewRuntime();\n    return;\n  }"), 'Grid retained state layers are connected to the shared preview runtime');
['props.hover', 'props.theme', 'props.showFooter', 'props.duration', 'props.easing'].forEach((legacy) => assert(!gridPreview.includes(legacy)));
assert(preview.includes("['badge', 'avatar', 'image', 'tag', 'grid', 'count-down'].includes(runtimeId)"));
assert(preview.includes("['avatar', 'image', 'tag', 'grid'].includes(previewId)"));
assert(preview.includes("gridAttrs.unshift('items=\"{{entries}}\"')"));
assert(preview.includes("type === 'grid-retry' && previewIdFor(state.current) === 'grid'"));
const previewCss = read('preview/styles.css');
assert(previewCss.includes('.pui-grid-showcase__states'));
assert(previewCss.includes('.pui-grid-preview__state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--pui-preview-content-gap);'), 'H5 Grid state content stacks Empty and retry vertically with the shared preview gap');

const exampleWxml = read('_example/miniprogram/pages/components/index.wxml');
const exampleJs = read('_example/miniprogram/pages/components/index.js');
assert(exampleWxml.includes('bind:retry="onGridRetry"'));
assert(!/<pui-grid[^>]*show-footer/.test(exampleWxml));
assert(exampleJs.includes("gridLoading: true"), 'example parent starts a real retry state');
assert(exampleJs.includes('restoreGrid'), 'example exposes explicit parent recovery');

const api = read('docs/COMPONENT_API.md');
assert(api.includes('## Grid'));
assert(api.includes('| `retry` | `{ source }` |'));
assert(api.includes('<pui-grid items="{{entries}}" />'));
assert(api.includes('TDesign 1.15.3 Grid/GridItem'));
assert(read('docs/components/GRID.md').includes('TDesign 1.15.3 对照决定'));
assert(read('docs/components/README.md').includes('[Grid](./GRID.md)'));
assert(/\d+\. Grid 的 H5 镜像/.test(read('docs/H5_PREVIEW_COMPATIBILITY.md')));

process.stdout.write('Grid contract tests passed.\n');
