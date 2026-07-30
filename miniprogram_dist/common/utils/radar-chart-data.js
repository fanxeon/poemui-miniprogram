var chartData = require('./chart-data');

var DEFAULT_PALETTE = ['blue', 'violet', 'teal', 'pink'];

function stableKey(value, fallback, counts) {
  var raw = String(value === undefined || value === null || value === '' ? fallback : value);
  counts[raw] = (counts[raw] || 0) + 1;
  return counts[raw] > 1 ? raw + '-' + counts[raw] : raw;
}

function normalizeIndicators(indicators) {
  var source = Array.isArray(indicators) ? indicators.slice(0, 8) : [];
  var counts = {};
  return source.map(function normalizeIndicator(raw, index) {
    var item = raw && typeof raw === 'object' ? raw : {};
    var max = Number(item.max);
    if (!isFinite(max) || max <= 0) max = 100;
    return {
      key: stableKey(item.key, 'indicator-' + index, counts),
      label: String(item.label === undefined || item.label === null ? '维度 ' + (index + 1) : item.label),
      max: max
    };
  });
}

function normalizeSeries(series, indicators, palette) {
  var source = Array.isArray(series) ? series.slice(0, 4) : [];
  var themes = chartData.normalizePalette(palette || DEFAULT_PALETTE);
  var counts = {};
  return source.map(function normalizeEntry(raw, index) {
    var item = raw && typeof raw === 'object' ? raw : {};
    var values = Array.isArray(item.values) ? item.values : [];
    return {
      key: stableKey(item.key, 'series-' + index, counts),
      label: String(item.label === undefined || item.label === null ? '系列 ' + (index + 1) : item.label),
      theme: chartData.normalizeTheme(item.theme, themes[index % themes.length]),
      values: indicators.map(function normalizeValue(indicator, valueIndex) {
        return Math.min(indicator.max, chartData.finiteNonNegative(values[valueIndex]));
      })
    };
  });
}

function normalizeRadarData(indicators, series, palette) {
  var normalizedIndicators = normalizeIndicators(indicators);
  var normalizedSeries = normalizeSeries(series, normalizedIndicators, palette);
  return {
    indicators: normalizedIndicators,
    series: normalizedSeries,
    legend: normalizedSeries.map(function toLegend(item) {
      return { key: item.key, label: item.label, theme: item.theme };
    }),
    valid: normalizedIndicators.length >= 3 && normalizedSeries.length > 0
  };
}

function pointFor(index, count, radius, cx, cy) {
  var angle = -Math.PI / 2 + Math.PI * 2 * index / count;
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
    angle: angle
  };
}

function buildRadarGeometry(data, options) {
  var config = options || {};
  var width = Math.max(1, Number(config.width) || 300);
  var height = Math.max(1, Number(config.height) || 300);
  var padding = Math.max(12, Number(config.padding) || 34);
  var levels = chartData.clampInteger(config.levels, 2, 8, 4);
  var cx = width / 2;
  var cy = height / 2;
  var radius = Math.max(1, Math.min(width, height) / 2 - padding);
  var count = data.indicators.length;
  var axes = data.indicators.map(function buildAxis(indicator, index) {
    var end = pointFor(index, count, radius, cx, cy);
    var label = pointFor(index, count, radius + Math.min(18, padding * 0.58), cx, cy);
    return { key: indicator.key, label: indicator.label, start: { x: cx, y: cy }, end: end, labelPoint: label };
  });
  var rings = [];
  for (var level = 1; level <= levels; level += 1) {
    rings.push({
      key: 'level-' + level,
      points: data.indicators.map(function ringPoint(indicator, index) {
        return pointFor(index, count, radius * level / levels, cx, cy);
      })
    });
  }
  var series = data.series.map(function buildSeries(item) {
    return Object.assign({}, item, {
      points: data.indicators.map(function seriesPoint(indicator, index) {
        return pointFor(index, count, radius * item.values[index] / indicator.max, cx, cy);
      })
    });
  });
  return { width: width, height: height, cx: cx, cy: cy, radius: radius, axes: axes, rings: rings, series: series };
}

function pointsAttribute(points) {
  return points.map(function pointText(point) {
    return Number(point.x.toFixed(2)) + ',' + Number(point.y.toFixed(2));
  }).join(' ');
}

module.exports = {
  defaultPalette: DEFAULT_PALETTE,
  normalizeIndicators: normalizeIndicators,
  normalizeSeries: normalizeSeries,
  normalizeRadarData: normalizeRadarData,
  buildRadarGeometry: buildRadarGeometry,
  pointsAttribute: pointsAttribute
};
