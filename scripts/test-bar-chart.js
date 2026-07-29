'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const chartData = require(path.join(root, 'common/utils/chart-data'));
const source = fs.readFileSync(path.join(root, 'bar-chart/bar-chart.js'), 'utf8');
let definition = null;
vm.runInNewContext(source, {
  console, isFinite, clearTimeout, setTimeout,
  require(request) { return request.includes('chart-data') ? chartData : {}; },
  Component(value) { definition = value; },
}, { filename: 'bar-chart/bar-chart.js' });
assert(definition, 'BarChart component definition must be registered');
function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const instance = { data: Object.assign({}, definition.data, defaults, overrides || {}), getColorSchemeClass() { return 'pui-theme--light'; }, setData(patch) { Object.assign(this.data, patch); } };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return instance;
}
assert.deepStrictEqual(Object.keys(definition.properties).sort(), ['animated', 'ariaLabel', 'duration', 'items', 'max', 'mode', 'orientation', 'reduceMotion', 'showGrid', 'showLegend', 'showValue', 'size']);
assert.strictEqual(definition.properties.animated.value, true);
assert.strictEqual(definition.properties.duration.value, 500);
assert.strictEqual(typeof definition.methods.replay, 'function');
assert(source.includes('function resetCommitted()') && source.includes('this.data.reduceMotion ? 0 : 32'), 'BarChart replay must commit a reset frame before re-entering');
const normalized = chartData.normalizeItems([{ key: 'x', label: '分类', segments: [{ label: '旧', value: -2, theme: 'bad' }, { label: '新', value: 0, theme: 'violet' }] }]);
assert.strictEqual(normalized.items[0].segments[0].value, 0);
assert.strictEqual(normalized.items[0].segments[1].value, 0);
assert.strictEqual(normalized.items[0].segments[0].theme, 'neutral');
const sourceItems = [
  { key: 'a', label: 'A', segments: [{ label: '已有', value: 8, theme: 'neutral' }, { label: '新增', value: 2, theme: 'violet' }] },
  { key: 'b', label: 'B', value: 5, theme: 'blue' },
];
const stacked = create({ items: sourceItems, showGrid: true });
assert.strictEqual(stacked.data.scaleMax, 10);
assert(stacked.data.chartItems[0].segments[0].style.includes('80%'));
assert(stacked.data.rootClass.includes('pui-bar-chart--grid'));
assert(stacked.data.semanticLabel.includes('A 10'));
const grouped = create({ items: sourceItems, mode: 'grouped', orientation: 'vertical', size: 'large', max: 20, reduceMotion: true });
assert.strictEqual(grouped.data.scaleMax, 20);
assert(grouped.data.rootClass.includes('pui-bar-chart--vertical'));
assert(grouped.data.rootClass.includes('pui-bar-chart--grouped'));
assert(grouped.data.rootStyle.includes('1ms'));
const defaultPalette = create({
  items: [
    { key: 'single-a', label: 'A', value: 1 },
    { key: 'single-b', label: 'B', value: 2 },
    { key: 'single-c', label: 'C', value: 3 },
    { key: 'segmented', label: 'D', segments: [{ label: '已有', value: 4 }, { label: '新增', value: 1 }] },
  ],
});
assert.deepStrictEqual(
  defaultPalette.data.chartItems.slice(0, 3).map((item) => item.segments[0].theme),
  ['blue', 'blue', 'blue'],
  'single-series BarChart categories share one blue visual meaning',
);
assert.deepStrictEqual(
  defaultPalette.data.chartItems[3].segments.map((segment) => segment.theme),
  ['blue', 'teal'],
  'multi-segment BarChart data keeps a stable blue baseline and teal increment',
);
const explicitPalette = create({ items: [{ key: 'explicit', label: '显式主题', value: 1, theme: 'pink' }] });
assert.strictEqual(explicitPalette.data.chartItems[0].segments[0].theme, 'pink', 'explicit valid themes still override BarChart defaults');
const wxml = fs.readFileSync(path.join(root, 'bar-chart/bar-chart.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'bar-chart/bar-chart.wxss'), 'utf8');
const theme = fs.readFileSync(path.join(root, 'common/style/theme.wxss'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/BAR-CHART.md'), 'utf8');
const metadata = require(path.join(root, 'metadata/components'));
const miniPage = fs.readFileSync(path.join(root, 'miniprogram/pages/components/bar-chart/index.wxml'), 'utf8');
assert(wxml.includes('role="img"'));
assert(!source.includes('triggerEvent('));
assert(!wxml.includes('<canvas'));
assert(wxml.includes('<block wx:else>'), 'grouped mode must use a non-rendering conditional wrapper');
assert(!/<[^>]+\bwx:else\b[^>]*\bwx:for\b|<[^>]+\bwx:for\b[^>]*\bwx:else\b/.test(wxml), 'WeChat WXML compiler must not receive wx:else and wx:for on the same node');
assert(wxml.includes('class="pui-bar-chart__scale"') && wxml.includes('<text>0</text>') && wxml.includes('{{scaleMax}}'), 'showGrid must expose the horizontal zero and maximum endpoints');
assert(!wxss.includes('box-shadow:var(--pui-shadow'));
assert(wxss.includes('background:var(--pui-chart-gradient)'));
assert(wxss.includes('box-shadow:inset -2rpx 0 0 var(--pui-chart-accent)'), 'horizontal BarChart must pair the transparent fill with one solid terminal line');
assert(wxss.includes('box-shadow:inset 0 2rpx 0 var(--pui-chart-accent)'), 'vertical BarChart must pair the transparent fill with one solid terminal line');
assert(wxss.includes('var(--pui-chart-grid-line)'), 'BarChart grid must consume the dedicated low-contrast grid token');
assert(!wxss.includes('var(--pui-chart-fade-outline) 25%'), 'BarChart grid must not reuse the stronger Waffle outline token');
assert(!wxss.includes('color-mix('));
assert(theme.includes('--pui-chart-gradient-violet'));
assert(theme.includes('--pui-chart-gradient-vertical-violet'));
[
  ['neutral', '113, 113, 122', '161, 161, 170'],
  ['violet', '124, 58, 237', '167, 139, 250'],
  ['blue', '37, 99, 235', '96, 165, 250'],
  ['teal', '13, 148, 136', '45, 212, 191'],
  ['pink', '219, 39, 119', '244, 114, 182'],
  ['amber', '217, 119, 6', '251, 191, 36'],
].forEach(([name, lightRgb, darkRgb]) => {
  assert(theme.includes(`--pui-chart-gradient-${name}: linear-gradient(90deg, rgba(${lightRgb}, 0.04) 0%, rgba(${lightRgb}, 0.42) 100%)`), `${name} light horizontal fill must mirror AreaChart transparency`);
  assert(theme.includes(`--pui-chart-gradient-vertical-${name}: linear-gradient(0deg, rgba(${lightRgb}, 0.04) 0%, rgba(${lightRgb}, 0.42) 100%)`), `${name} light vertical fill must mirror AreaChart transparency`);
  assert(theme.includes(`--pui-chart-gradient-${name}: linear-gradient(90deg, rgba(${darkRgb}, 0.04) 0%, rgba(${darkRgb}, 0.42) 100%)`), `${name} dark horizontal fill must mirror AreaChart transparency`);
  assert(theme.includes(`--pui-chart-gradient-vertical-${name}: linear-gradient(0deg, rgba(${darkRgb}, 0.04) 0%, rgba(${darkRgb}, 0.42) 100%)`), `${name} dark vertical fill must mirror AreaChart transparency`);
});
assert(!/--pui-chart-gradient(?:-vertical)?-[^:]+:[^;]+0\.28\) 0%[^;]+0\.66\) 46%[^;]+1\) 100%/.test(theme), 'BarChart tokens must not regress to the previous opaque three-stop gradient');
assert(theme.includes('--pui-chart-grid-line: rgba(24, 24, 27, 0.07)'), 'light theme must define the softened chart grid token');
assert(theme.includes('--pui-chart-grid-line: rgba(250, 250, 250, 0.1)'), 'dark theme must define the softened chart grid token');
assert(wxss.includes('background:var(--pui-chart-gradient-vertical)'));
assert(wxss.includes('transform:scaleX(0)'));
assert(wxss.includes('pui-bar-chart--entered'));
assert(metadata.packageComponents.includes('bar-chart'));
assert.deepStrictEqual(metadata.apiProps['bar-chart'], ['items', 'orientation', 'mode', 'max', 'size', 'showValue', 'showLegend', 'showGrid', 'animated', 'duration', 'ariaLabel', 'reduceMotion']);
assert.strictEqual((metadata.apiEvents['bar-chart'] || []).length, 0);
assert.strictEqual((metadata.apiSlots['bar-chart'] || []).length, 0);
assert.deepStrictEqual((metadata.apiMethods['bar-chart'] || []).map((item) => item.name), ['replay()']);
assert(preview.includes('function barChartShowcase(props, demo)'));
assert(preview.includes("chartItemsFromProps(props.items, ['blue', 'teal', 'violet'], { cycleSingleItems: false })"), 'H5 must use the same single-series blue and segmented palette semantics');
assert(preview.includes("chartPreviewProps('bar-chart', props, demo)") && preview.includes("chartDataToggleButton('bar-chart', demo)"), 'H5 BarChart must expose a visibly different parent-owned dataset');
assert(preview.includes('pui-bar-chart-preview__scale') && preview.includes('<span>0</span>'), 'H5 must mirror the visible zero endpoint');
assert(previewStyles.includes('.pui-bar-chart-preview'));
assert(previewStyles.includes('.pui-bar-chart-preview__scale'));
assert(previewStyles.includes('background:var(--pui-chart-gradient-vertical)'));
assert(previewStyles.includes('var(--pui-chart-grid-line) 25%'), 'H5 BarChart grid must consume the dedicated token');
assert(previewStyles.includes('--pui-chart-grid-line: rgba(24, 24, 27, .07)'), 'H5 light theme must expose the softened chart grid token');
assert(previewStyles.includes('--pui-chart-grid-line: rgba(250, 250, 250, .1)'), 'H5 dark theme must expose the softened chart grid token');
assert(previewStyles.includes('background:transparent;border:0;box-shadow:none'));
assert(previewStyles.includes('.pui-bar-chart-preview.is-entered'));
assert(preview.includes("type === 'chart-replay'") && preview.includes('replayChartEntrancePreviewRuntime(props)'), 'H5 chart replay action must use the shared committed-reset runtime');
assert(previewStyles.includes('.pui-bar-chart-preview.is-replay-reset .pui-bar-chart-preview__segment'), 'BarChart reset frame must disable reverse transition');
assert(contract.includes('display-leaf'));
assert(contract.includes('`animated'));
assert(contract.includes('`replay()`'));
assert(contract.includes('`wx:else` 与 `wx:for`'));
assert(miniPage.includes('<pui-bar-chart'));
assert(miniPage.includes('bind:click="onReplay"'));
assert(miniPage.includes('bind:click="onToggleChartData"') && !miniPage.includes('高级 +1'), 'BarChart page must replace the imperceptible +1 demo with a high-variance data toggle');
console.log('BarChart contract tests passed.');
