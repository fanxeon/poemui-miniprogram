'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const chartData = require(path.join(root, 'common/utils/chart-data'));
const radarData = require(path.join(root, 'common/utils/radar-chart-data'));
let definition;
vm.runInNewContext(fs.readFileSync(path.join(root, 'radar-chart/radar-chart.js'), 'utf8'), {
  Component(value) { definition = value; },
  require(request) {
    if (request.includes('chart-data') && !request.includes('radar')) return chartData;
    if (request.includes('radar-chart-data')) return radarData;
    if (request.includes('platform-info')) return { getWindowInfo() { return { windowWidth: 375, pixelRatio: 2 }; } };
    return {};
  },
  isFinite, parseInt, setTimeout, clearTimeout, console,
}, { filename: 'radar-chart/radar-chart.js' });
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
const data = radarData.normalizeRadarData(
  [{ key: 'a', label: 'A', max: 10 }, { key: 'b', label: 'B', max: 0 }, { key: 'c', label: 'C', max: 20 }],
  [{ key: 'x', label: 'X', values: [12, -3, 10], theme: 'bad' }],
);
assert.strictEqual(data.valid, true);
assert.deepStrictEqual(data.series[0].values, [10, 0, 10]);
assert.strictEqual(data.indicators[1].max, 100);
const geometry = radarData.buildRadarGeometry(data, { width: 300, height: 260, levels: 5 });
assert.strictEqual(geometry.rings.length, 5);
assert.strictEqual(geometry.axes.length, 3);
assert.strictEqual(geometry.series[0].points.length, 3);
const chart = create({ indicators: data.indicators, series: data.series, size: 'small', reduceMotion: true });
assert.strictEqual(chart.data.empty, false);
assert(chart.data.rootClass.includes('pui-radar-chart--small'));
assert(chart.data.rootStyle.includes('1ms'));
const invalid = create({ indicators: data.indicators.slice(0, 2), series: data.series });
assert.strictEqual(invalid.data.empty, true);
const wxml = fs.readFileSync(path.join(root, 'radar-chart/radar-chart.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'radar-chart/radar-chart.wxss'), 'utf8');
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const metadata = require(path.join(root, 'metadata/components'));
assert(wxml.includes('<canvas type="2d"') && wxml.includes('role="img"'));
assert(wxss.includes('background:transparent;border:0;box-shadow:none'));
assert.deepStrictEqual(metadata.apiProps['radar-chart'], ['indicators', 'series', 'levels', 'size', 'showGrid', 'showLegend', 'showDots', 'animated', 'duration', 'ariaLabel', 'reduceMotion']);
assert.deepStrictEqual(metadata.apiMethods['radar-chart'].map((item) => item.name), ['replay()']);
assert(preview.includes('function radarChartMarkup(props)') && preview.includes("chartPreviewProps('radar-chart', props, demo)"));
assert(preview.includes('setTourPreviewVisible') && preview.includes('bindSortableListPreviewRuntime'), 'H5 advanced runtime must be wired rather than statically illustrated');
assert(previewStyles.includes('.pui-radar-chart-preview__series') && previewStyles.includes('.pui-radar-chart-preview.is-entered'));
assert(previewStyles.includes('.pui-radar-chart-preview.is-replay-reset'), 'H5 RadarChart replay reset must suppress reverse motion');
assert(fs.readFileSync(path.join(root, 'docs/components/RADAR-CHART.md'), 'utf8').includes('display-leaf'));
assert(fs.readFileSync(path.join(root, 'miniprogram/pages/components/radar-chart/index.wxml'), 'utf8').includes('<pui-radar-chart'));
console.log('RadarChart contract tests passed.');
