function clampInteger(value, min, max, fallback) {
  var number = Math.floor(Number(value));
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}

function normalizePlacement(value) {
  var placements = ['auto', 'top', 'right', 'bottom', 'left'];
  return placements.indexOf(value) > -1 ? value : 'auto';
}

function normalizeSelector(value) {
  var selector = String(value === undefined || value === null ? '' : value).trim();
  return /^[#.][A-Za-z_][\w-]*$/.test(selector) ? selector : '';
}

function normalizeSteps(steps) {
  var source = Array.isArray(steps) ? steps : [];
  var counts = {};
  return source.map(function normalizeStep(raw, index) {
    var item = raw && typeof raw === 'object' ? raw : {};
    var rawKey = String(item.key === undefined || item.key === null || item.key === '' ? 'step-' + index : item.key);
    counts[rawKey] = (counts[rawKey] || 0) + 1;
    return {
      key: counts[rawKey] > 1 ? rawKey + '-' + counts[rawKey] : rawKey,
      selector: normalizeSelector(item.selector || item.target),
      title: String(item.title === undefined || item.title === null ? '步骤 ' + (index + 1) : item.title),
      content: String(item.content === undefined || item.content === null ? '' : item.content),
      placement: normalizePlacement(item.placement),
      padding: clampInteger(item.padding, 0, 24, 8)
    };
  });
}

function resolvePlacement(requested, target, viewport, minimumPanelSpace) {
  var placement = normalizePlacement(requested);
  var minimum = Math.max(120, Number(minimumPanelSpace) || 180);
  var spaces = {
    top: target.top,
    right: viewport.width - target.right,
    bottom: viewport.height - target.bottom,
    left: target.left
  };
  if (placement !== 'auto' && spaces[placement] >= minimum) return placement;
  if (spaces.bottom >= minimum) return 'bottom';
  if (spaces.top >= minimum) return 'top';
  if (spaces.right >= Math.min(220, minimum)) return 'right';
  if (spaces.left >= Math.min(220, minimum)) return 'left';
  return spaces.bottom >= spaces.top ? 'bottom' : 'top';
}

function clampTarget(rect, viewport, padding) {
  var inset = Math.max(0, Number(padding) || 0);
  var left = Math.max(0, Number(rect.left) - inset);
  var top = Math.max(0, Number(rect.top) - inset);
  var right = Math.min(viewport.width, Number(rect.right) + inset);
  var bottom = Math.min(viewport.height, Number(rect.bottom) + inset);
  return {
    left: left,
    top: top,
    right: Math.max(left, right),
    bottom: Math.max(top, bottom),
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  };
}

module.exports = {
  clampInteger: clampInteger,
  normalizePlacement: normalizePlacement,
  normalizeSelector: normalizeSelector,
  normalizeSteps: normalizeSteps,
  resolvePlacement: resolvePlacement,
  clampTarget: clampTarget
};
