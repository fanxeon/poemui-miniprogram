var chartData = require('./chart-data');

var DEFAULT_PALETTE = ['violet', 'blue', 'teal', 'pink', 'amber', 'neutral'];

function stableKey(value, fallback, counts) {
  var raw = String(value === undefined || value === null || value === '' ? fallback : value);
  counts[raw] = (counts[raw] || 0) + 1;
  return counts[raw] > 1 ? raw + '-' + counts[raw] : raw;
}

function normalizeDonutItems(items, palette) {
  var source = Array.isArray(items) ? items : [];
  var themes = chartData.normalizePalette(palette || DEFAULT_PALETTE);
  var keyCounts = {};
  var normalized = source.map(function normalizeItem(raw, index) {
    var item = raw && typeof raw === 'object' ? raw : {};
    var value = chartData.finiteNonNegative(item.value);
    return {
      key: stableKey(item.key, 'segment-' + index, keyCounts),
      label: String(item.label === undefined || item.label === null ? '项目 ' + (index + 1) : item.label),
      value: value,
      valueText: chartData.formatValue(value),
      theme: chartData.normalizeTheme(item.theme, themes[index % themes.length])
    };
  });
  var total = normalized.reduce(function sum(result, item) { return result + item.value; }, 0);
  return {
    items: normalized,
    total: total,
    totalText: chartData.formatValue(total),
    legend: normalized.map(function toLegend(item) {
      return { key: item.key, label: item.label, theme: item.theme, valueText: item.valueText };
    })
  };
}

function normalizeAngle(value, fallback) {
  var angle = Number(value);
  return isFinite(angle) ? angle : fallback;
}

function buildDonutGeometry(data, options) {
  var config = options || {};
  var startAngle = normalizeAngle(config.startAngle, -90);
  var gapAngle = Math.max(0, Math.min(12, normalizeAngle(config.gapAngle, 3)));
  var visible = data.items.filter(function hasValue(item) { return item.value > 0; });
  var appliedGap = visible.length > 1 ? gapAngle : 0;
  var available = Math.max(0, 360 - appliedGap * visible.length);
  var cursor = startAngle;
  var segments = visible.map(function buildSegment(item) {
    var sweep = data.total > 0 ? available * item.value / data.total : 0;
    var segment = Object.assign({}, item, {
      startAngle: cursor,
      endAngle: cursor + sweep,
      sweepAngle: sweep,
      percent: data.total > 0 ? item.value / data.total : 0
    });
    cursor += sweep + appliedGap;
    return segment;
  });
  return {
    startAngle: startAngle,
    gapAngle: appliedGap,
    segments: segments
  };
}

function pointOnCircle(cx, cy, radius, angle) {
  var radians = angle * Math.PI / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians)
  };
}

function arcPath(cx, cy, radius, startAngle, endAngle) {
  var start = pointOnCircle(cx, cy, radius, startAngle);
  var end = pointOnCircle(cx, cy, radius, endAngle);
  var sweep = Math.max(0, endAngle - startAngle);
  if (sweep >= 359.999) {
    var middle = pointOnCircle(cx, cy, radius, startAngle + 180);
    return [
      'M', Number(start.x.toFixed(2)), Number(start.y.toFixed(2)),
      'A', radius, radius, 0, 1, 1,
      Number(middle.x.toFixed(2)), Number(middle.y.toFixed(2)),
      'A', radius, radius, 0, 1, 1,
      Number(start.x.toFixed(2)), Number(start.y.toFixed(2))
    ].join(' ');
  }
  return [
    'M', Number(start.x.toFixed(2)), Number(start.y.toFixed(2)),
    'A', radius, radius, 0, sweep > 180 ? 1 : 0, 1,
    Number(end.x.toFixed(2)), Number(end.y.toFixed(2))
  ].join(' ');
}

module.exports = {
  defaultPalette: DEFAULT_PALETTE,
  normalizeDonutItems: normalizeDonutItems,
  buildDonutGeometry: buildDonutGeometry,
  pointOnCircle: pointOnCircle,
  arcPath: arcPath
};
