var THEMES = ['neutral', 'violet', 'blue', 'teal', 'pink', 'amber'];
var DEFAULT_PALETTE = ['neutral', 'violet'];

function finiteNonNegative(value) {
  var number = Number(value);
  return isFinite(number) && number >= 0 ? number : 0;
}

function formatValue(value) {
  var number = finiteNonNegative(value);
  if (number % 1 === 0) return String(number);
  return String(Number(number.toFixed(2))).replace(/0+$/, '').replace(/\.$/, '');
}

function normalizeTheme(value, fallback) {
  var theme = String(value || '').toLowerCase();
  return THEMES.indexOf(theme) > -1 ? theme : (fallback || 'violet');
}

function normalizePalette(palette) {
  var source = Array.isArray(palette) ? palette : DEFAULT_PALETTE;
  var normalized = source.filter(function validTheme(theme, index) {
    return THEMES.indexOf(theme) > -1 && source.indexOf(theme) === index;
  });
  return normalized.length ? normalized : DEFAULT_PALETTE;
}

function normalizeItems(items, palette, options) {
  var source = Array.isArray(items) ? items : [];
  var fallbackPalette = normalizePalette(palette);
  var cycleSingleItems = !(options && options.cycleSingleItems === false);
  var keyCounts = {};
  var legend = [];
  var legendKeys = {};
  var normalized = source.map(function normalizeItem(raw, itemIndex) {
    var item = raw && typeof raw === 'object' ? raw : {};
    var rawKey = String(item.key === undefined || item.key === null ? 'item-' + itemIndex : item.key);
    keyCounts[rawKey] = (keyCounts[rawKey] || 0) + 1;
    var itemKey = keyCounts[rawKey] > 1 ? rawKey + '-' + keyCounts[rawKey] : rawKey;
    var segmentSource = Array.isArray(item.segments) && item.segments.length ? item.segments : [item];
    var segments = segmentSource.map(function normalizeSegment(rawSegment, segmentIndex) {
      var segment = rawSegment && typeof rawSegment === 'object' ? rawSegment : {};
      var fallbackIndex = segmentSource.length === 1 && cycleSingleItems ? itemIndex : segmentIndex;
      var theme = normalizeTheme(segment.theme, fallbackPalette[fallbackIndex % fallbackPalette.length]);
      var value = finiteNonNegative(segment.value);
      var segmentKey = String(segment.key === undefined || segment.key === null ? itemKey + '-segment-' + segmentIndex : segment.key);
      var label = String(segment.label === undefined || segment.label === null ? (segmentIndex === 0 ? '数值' : '分段 ' + (segmentIndex + 1)) : segment.label);
      if (!legendKeys[theme + ':' + label]) {
        legendKeys[theme + ':' + label] = true;
        legend.push({ key: theme + '-' + legend.length, label: label, theme: theme });
      }
      return {
        key: segmentKey,
        label: label,
        value: value,
        valueText: formatValue(value),
        theme: theme
      };
    });
    var total = segments.reduce(function sum(result, segment) { return result + segment.value; }, 0);
    return {
      key: itemKey,
      label: String(item.label === undefined || item.label === null ? '项目 ' + (itemIndex + 1) : item.label),
      total: total,
      valueText: formatValue(total),
      segments: segments
    };
  });
  return { items: normalized, legend: legend };
}

function clampInteger(value, min, max, fallback) {
  var number = Math.floor(Number(value));
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}

function normalizeDuration(value, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback === undefined ? 500 : Number(fallback);
  return Math.max(0, Math.min(1000, number));
}

function entranceDelay(index, step, maximum) {
  var itemIndex = Math.max(0, Math.floor(Number(index) || 0));
  var delayStep = Math.max(0, Number(step) || 0);
  var delayMaximum = Math.max(0, Number(maximum) || 0);
  return Math.min(delayMaximum, itemIndex * delayStep);
}

module.exports = {
  themes: THEMES,
  finiteNonNegative: finiteNonNegative,
  formatValue: formatValue,
  normalizeTheme: normalizeTheme,
  normalizePalette: normalizePalette,
  normalizeItems: normalizeItems,
  clampInteger: clampInteger,
  normalizeDuration: normalizeDuration,
  entranceDelay: entranceDelay
};
