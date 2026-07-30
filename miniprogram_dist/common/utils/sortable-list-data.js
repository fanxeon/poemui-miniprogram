function stableKey(value, fallback, counts) {
  var raw = String(value === undefined || value === null || value === '' ? fallback : value);
  counts[raw] = (counts[raw] || 0) + 1;
  return counts[raw] > 1 ? raw + '-' + counts[raw] : raw;
}

function normalizeItems(items, itemKey, disabledKeys) {
  var source = Array.isArray(items) ? items : [];
  var keyField = String(itemKey || 'key');
  var disabled = Array.isArray(disabledKeys) ? disabledKeys.map(String) : [];
  var counts = {};
  return source.map(function normalizeItem(raw, index) {
    var item = raw && typeof raw === 'object' ? raw : { title: raw };
    var key = stableKey(item[keyField], 'item-' + index, counts);
    return Object.assign({}, item, {
      _key: key,
      _index: index,
      title: String(item.title === undefined || item.title === null ? '项目 ' + (index + 1) : item.title),
      description: String(item.description === undefined || item.description === null ? '' : item.description),
      disabled: Boolean(item.disabled || disabled.indexOf(key) > -1)
    });
  });
}

function reorder(items, from, to) {
  var source = Array.isArray(items) ? items.slice() : [];
  var start = Math.floor(Number(from));
  var end = Math.floor(Number(to));
  if (!isFinite(start) || !isFinite(end) || start < 0 || end < 0 || start >= source.length || end >= source.length || start === end) {
    return source;
  }
  var moved = source.splice(start, 1)[0];
  source.splice(end, 0, moved);
  return source;
}

function publicItems(items) {
  return (Array.isArray(items) ? items : []).map(function stripInternal(item) {
    var result = {};
    Object.keys(item || {}).forEach(function copy(key) {
      if (key.charAt(0) !== '_') result[key] = item[key];
    });
    return result;
  });
}

module.exports = {
  normalizeItems: normalizeItems,
  reorder: reorder,
  publicItems: publicItems
};
