'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const chartData = require(path.join(root, 'common/utils/chart-data'));
const areaChartData = require(path.join(root, 'common/utils/area-chart-data'));
const source = fs.readFileSync(path.join(root, 'area-chart/area-chart.js'), 'utf8');
let definition = null;

vm.runInNewContext(source, {
  console,
  isFinite,
  require(request) {
    if (request.includes('area-chart-data')) return areaChartData;
    if (request.includes('chart-data')) return chartData;
    return {};
  },
  Component(value) { definition = value; },
}, { filename: 'area-chart/area-chart.js' });

assert(definition, 'AreaChart component definition must be registered');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return 'pui-theme--light'; },
    setData(patch, callback) {
      Object.assign(this.data, patch);
      if (callback) callback.call(this);
    },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return instance;
}

assert.deepStrictEqual(
  Object.keys(definition.properties).sort(),
  ['animated', 'ariaLabel', 'curve', 'duration', 'items', 'max', 'reduceMotion', 'showDots', 'showGrid', 'showLegend', 'showXAxis', 'size', 'stacked'],
);
assert.strictEqual(definition.properties.animated.value, true);
assert.strictEqual(definition.properties.duration.value, 500);
assert.strictEqual(typeof definition.methods.replay, 'function');
assert(source.includes('function resetCommitted()') && source.includes('this.data.reduceMotion ? 0 : 32'), 'AreaChart replay must commit a reset frame before re-entering');

const normalized = areaChartData.normalizeAreaItems([
  { key: 'jan', label: '1月', segments: [{ key: 'desktop', label: '桌面', value: 10, theme: 'blue' }, { key: 'mobile', label: '移动', value: -2, theme: 'bad' }] },
  { key: 'feb', label: '2月', segments: [{ key: 'desktop', label: '桌面', value: 20, theme: 'blue' }, { key: 'mobile', label: '移动', value: 5, theme: 'teal' }] },
]);
assert.strictEqual(normalized.points.length, 2);
assert.deepStrictEqual(normalized.series[0].values, [10, 20]);
assert.deepStrictEqual(normalized.series[1].values, [0, 5]);
assert.strictEqual(normalized.series[1].theme, 'teal');
assert.strictEqual(areaChartData.scaleMaximum(normalized, 0, false), 20);
assert.strictEqual(areaChartData.scaleMaximum(normalized, 0, true), 25);

const natural = areaChartData.buildAreaGeometry(normalized, { width: 300, height: 160, curve: 'natural' });
const linear = areaChartData.buildAreaGeometry(normalized, { width: 300, height: 160, curve: 'linear' });
const step = areaChartData.buildAreaGeometry(normalized, { width: 300, height: 160, curve: 'step', stacked: true });
assert(natural.series[0].linePath.includes(' C '), 'natural curve must use cubic commands');
assert(linear.series[0].linePath.includes(' L '), 'linear curve must use line commands');
assert(step.series[0].linePath.match(/ L /g).length >= 2, 'step curve must use two line commands per interval');
assert.strictEqual(natural.series[0].lowerPoints[0].y, natural.baselineY, 'non-stacked fill must return to the shared zero baseline');
assert(step.series[1].lowerPoints[1].y < step.baselineY, 'stacked series must start from the preceding series');

const component = create({
  items: [
    { key: 'jan', label: '1月', value: 10, theme: 'blue' },
    { key: 'feb', label: '2月', value: 20, theme: 'blue' },
  ],
  animated: false,
  reduceMotion: true,
});
assert.strictEqual(component.data.empty, false);
assert.strictEqual(component.data.entered, true);
assert(component.data.rootClass.includes('pui-area-chart--natural'));
assert(component.data.rootStyle.includes('1ms'));
assert(component.data.semanticLabel.includes('1月'));

const wxml = fs.readFileSync(path.join(root, 'area-chart/area-chart.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'area-chart/area-chart.wxss'), 'utf8');
const theme = fs.readFileSync(path.join(root, 'common/style/theme.wxss'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/AREA-CHART.md'), 'utf8');
const metadata = require(path.join(root, 'metadata/components'));
const miniPage = fs.readFileSync(path.join(root, 'miniprogram/pages/components/area-chart/index.wxml'), 'utf8');

assert(wxml.includes('<canvas type="2d"'));
assert(wxml.includes('role="img"'));
assert(wxml.includes('pui-area-chart__probe--fill-start'));
assert(!source.includes('triggerEvent('));
assert(!wxss.includes('var(--pui-shadow'));
assert(theme.includes('--pui-chart-area-fill-start'));
assert(theme.includes('--pui-chart-area-fill-end'));
assert(metadata.packageComponents.includes('area-chart'));
assert.deepStrictEqual(metadata.apiProps['area-chart'], ['items', 'max', 'curve', 'stacked', 'size', 'showGrid', 'showXAxis', 'showLegend', 'showDots', 'animated', 'duration', 'ariaLabel', 'reduceMotion']);
assert.strictEqual((metadata.apiEvents['area-chart'] || []).length, 0);
assert.strictEqual((metadata.apiSlots['area-chart'] || []).length, 0);
assert.deepStrictEqual((metadata.apiMethods['area-chart'] || []).map((item) => item.name), ['replay()']);
assert(preview.includes('function areaChartShowcase(props, demo)'));
assert(preview.includes('<linearGradient'));
assert(preview.includes('data-chart-entrance'));
assert(preview.includes("chartPreviewProps('area-chart', props, demo)") && preview.includes("chartDataToggleButton('area-chart', demo)"), 'H5 AreaChart must switch between visibly different parent-owned datasets');
assert(preview.includes("type === 'chart-data-toggle'") && preview.includes('demo.chartHighVariance = !demo.chartHighVariance'), 'H5 chart data toggle must update real retained demo state');
assert(preview.includes("type === 'chart-replay'") && preview.includes('replayChartEntrancePreviewRuntime(props)'), 'H5 chart replay action must use the shared committed-reset runtime');
assert(preview.includes("root.classList.add('is-replay-reset')") && preview.includes("root.classList.remove('is-replay-reset')"), 'H5 replay must commit a transition-free reset before re-entering');
assert(previewStyles.includes('.pui-area-chart-preview__area'));
assert(previewStyles.includes('stroke-dashoffset:1'));
assert(previewStyles.includes('.pui-area-chart-preview.is-replay-reset .pui-area-chart-preview__area'), 'AreaChart reset frame must disable reverse transition');
assert(contract.includes('Canvas 2D'));
assert(contract.includes('`animated'));
assert(contract.includes('`replay()`'));
assert(miniPage.includes('<pui-area-chart'));
assert(miniPage.includes('bind:click="onReplay"'));
assert(miniPage.includes('bind:click="onToggleData"') && miniPage.includes('切换高波动数据'), 'AreaChart page must expose a large data change instead of only replaying the same shape');

if (process.env.PUI_VERIFY_DIST === '1') {
  ['area-chart.js', 'area-chart.json', 'area-chart.wxml', 'area-chart.wxss'].forEach((file) => {
    assert.strictEqual(
      fs.readFileSync(path.join(root, 'area-chart', file), 'utf8'),
      fs.readFileSync(path.join(root, 'miniprogram_dist/area-chart', file), 'utf8'),
      'AreaChart dist must match source: ' + file,
    );
  });
}

console.log('AreaChart contract tests passed.');
