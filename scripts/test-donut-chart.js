'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const chartData = require(path.join(root, 'common/utils/chart-data'));
const donutData = require(path.join(root, 'common/utils/donut-chart-data'));
let definition;
vm.runInNewContext(fs.readFileSync(path.join(root, 'donut-chart/donut-chart.js'), 'utf8'), {
  Component(value) { definition = value; },
  require(request) {
    if (request.includes('chart-data') && !request.includes('donut')) return chartData;
    if (request.includes('donut-chart-data')) return donutData;
    if (request.includes('platform-info')) return { getWindowInfo() { return { windowWidth: 375, pixelRatio: 2 }; } };
    return {};
  },
  isFinite, parseInt, setTimeout, clearTimeout, console,
}, { filename: 'donut-chart/donut-chart.js' });
assert(definition);
function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const instance = {
    data: Object.assign({}, definition.data, defaults, overrides || {}),
    getColorSchemeClass() { return ''; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
  };
  Object.assign(instance, definition.methods);
  definition.lifetimes.attached.call(instance);
  return instance;
}
const normalized = donutData.normalizeDonutItems([
  { key: 'a', label: 'A', value: 40, theme: 'blue' },
  { key: 'b', label: 'B', value: -5, theme: 'bad' },
  { key: 'a', label: 'C', value: 60, theme: 'teal' },
]);
assert.strictEqual(normalized.total, 100);
assert.deepStrictEqual(normalized.items.map((item) => item.key), ['a', 'b', 'a-2']);
assert.strictEqual(normalized.items[1].value, 0);
const geometry = donutData.buildDonutGeometry(normalized, { startAngle: -90, gapAngle: 4 });
assert.strictEqual(geometry.segments.length, 2);
assert.strictEqual(Math.round(geometry.segments.reduce((sum, item) => sum + item.sweepAngle, 0)), 352);
assert((donutData.arcPath(50, 50, 40, -90, 270).match(/ A /g) || []).length === 2, 'full circle SVG path must use two arcs');
const chart = create({ items: normalized.items, reduceMotion: true, size: 'large' });
assert.strictEqual(chart.data.totalText, '100');
assert(chart.data.rootClass.includes('pui-donut-chart--large'));
assert(chart.data.rootStyle.includes('1ms'));
assert.strictEqual(typeof chart.replay, 'function');
const wxml = fs.readFileSync(path.join(root, 'donut-chart/donut-chart.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'donut-chart/donut-chart.wxss'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components'));
assert(wxml.includes('<canvas type="2d"') && wxml.includes('role="img"'));
assert(!fs.readFileSync(path.join(root, 'donut-chart/donut-chart.js'), 'utf8').includes('triggerEvent('));
assert(wxss.includes('background:transparent;border:0;box-shadow:none'));
assert.deepStrictEqual(metadata.apiProps['donut-chart'], ['items', 'thickness', 'startAngle', 'gapAngle', 'size', 'showCenter', 'centerText', 'showLegend', 'animated', 'duration', 'ariaLabel', 'reduceMotion']);
assert.deepStrictEqual(metadata.apiMethods['donut-chart'].map((item) => item.name), ['replay()']);
assert(preview.includes('function donutChartMarkup(props)') && preview.includes("chartPreviewProps('donut-chart', props, demo)"));
assert(preview.includes("'donut-chart', 'radar-chart'].includes(id)"), 'H5 chart runtime must include both 0.1.4 chart mirrors');
assert(previewStyles.includes('.pui-donut-chart-preview__arc') && previewStyles.includes('.pui-donut-chart-preview.is-entered'));
assert(previewStyles.includes('.pui-donut-chart-preview.is-replay-reset'), 'H5 DonutChart replay reset must suppress reverse motion');
assert(fs.readFileSync(path.join(root, 'docs/components/DONUT-CHART.md'), 'utf8').includes('display-leaf'));
assert(fs.readFileSync(path.join(root, 'miniprogram/pages/components/donut-chart/index.wxml'), 'utf8').includes('<pui-donut-chart'));
console.log('DonutChart contract tests passed.');
