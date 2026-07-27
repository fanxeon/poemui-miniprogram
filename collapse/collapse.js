var themeBehavior = require('../common/behaviors/theme');

var THEMES = ['default', 'card'];
var MOTION_DURATION = 500;
var MOTION_EASING = 'cubic-bezier(0.2, 0, 0, 1)';

function hasValue(value) {
  return value !== null && value !== undefined;
}

function isScalar(value) {
  return typeof value === 'string'
    || typeof value === 'boolean'
    || (typeof value === 'number' && isFinite(value));
}

function valueKey(value) {
  return typeof value + ':' + String(value);
}

function firstDefined(values, fallback) {
  for (var index = 0; index < values.length; index += 1) {
    if (values[index] !== null && values[index] !== undefined) return values[index];
  }
  return fallback;
}

function normalizeTheme(value) {
  return THEMES.indexOf(value) > -1 ? value : 'default';
}

function normalizeItems(items) {
  var source = Array.isArray(items) ? items : [];
  var seen = {};
  return source.reduce(function reduceItems(result, item, index) {
    var sourceItem = item && typeof item === 'object' && !Array.isArray(item) ? item : { label: item };
    var value = isScalar(sourceItem.value) ? sourceItem.value : index;
    var id = valueKey(value);
    if (seen[id]) return result;
    seen[id] = true;
    var label = firstDefined([sourceItem.label, sourceItem.header, sourceItem.title], '面板 ' + (index + 1));
    var description = firstDefined([sourceItem.description, sourceItem.content], '');
    var note = firstDefined([sourceItem.note, sourceItem.headerRightContent], '');
    result.push({
      id: id,
      raw: sourceItem,
      label: String(label),
      value: value,
      description: String(description),
      note: String(note),
      icon: String(sourceItem.icon || sourceItem.headerLeftIcon || ''),
      expandIcon: typeof sourceItem.expandIcon === 'boolean' ? sourceItem.expandIcon : null,
      disabled: !!sourceItem.disabled,
      ariaLabel: String(firstDefined([sourceItem.ariaLabel, label], '面板 ' + (index + 1))),
      expanded: false,
      contentHeight: 0,
    });
    return result;
  }, []);
}

function normalizeValues(values, items, mutex) {
  if (!Array.isArray(values)) return [];
  var known = {};
  items.forEach(function registerItem(item) { known[item.id] = item.value; });
  var selected = [];
  var selectedKeys = {};
  values.forEach(function selectValue(value) {
    if (!isScalar(value)) return;
    var key = valueKey(value);
    if (Object.prototype.hasOwnProperty.call(known, key) && !selectedKeys[key]) {
      selected.push(known[key]);
      selectedKeys[key] = true;
    }
  });
  return mutex ? selected.slice(0, 1) : selected;
}

function publicItem(item) {
  return {
    label: item.label,
    value: item.value,
    description: item.description,
    note: item.note,
    icon: item.icon,
    expandIcon: item.expandIcon,
    disabled: item.disabled,
    ariaLabel: item.ariaLabel,
  };
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    theme: { type: String, value: 'default' },
    disabled: { type: Boolean, value: false },
    expandIcon: { type: Boolean, value: true },
    expandMutex: { type: Boolean, value: false },
    defaultExpandAll: { type: Boolean, value: false },
    customPanel: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '加载中…' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '加载失败，请重试' },
    retryText: { type: String, value: '重试' },
    emptyText: { type: String, value: '暂无可展开内容' },
    ariaLabel: { type: String, value: '折叠面板' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rootClass: 'pui-collapse',
    normalizedItems: [],
    expandedValues: [],
    stateType: 'empty',
    motionDuration: MOTION_DURATION,
    motionEasing: MOTION_EASING,
  },
  observers: {
    'items,value,defaultValue,theme,disabled,expandMutex,defaultExpandAll,customPanel,loading,error,reduceMotion,colorScheme': function sync() {
      this.syncState();
    },
  },
  lifetimes: {
    attached: function attached() { this.syncState(); },
  },
  methods: {
    syncState: function syncState() {
      var component = this;
      var items = normalizeItems(this.data.items);
      var isControlled = Array.isArray(this.data.value);
      var values = [];
      if (isControlled) {
        values = normalizeValues(this.data.value, items, this.data.expandMutex);
        this._lastControlledValues = values.slice();
        this._wasControlled = true;
      } else {
        if (this._wasControlled) {
          this._uncontrolledValues = normalizeValues(this._lastControlledValues || [], items, this.data.expandMutex);
          this._hasInitialized = true;
        } else if (!this._hasInitialized && items.length) {
          var initial = Array.isArray(this.data.defaultValue)
            ? this.data.defaultValue
            : (this.data.defaultExpandAll ? items.map(function mapItem(item) { return item.value; }) : []);
          this._uncontrolledValues = normalizeValues(initial, items, this.data.expandMutex);
          this._hasInitialized = true;
        } else if (this._hasInitialized) {
          this._uncontrolledValues = normalizeValues(this._uncontrolledValues, items, this.data.expandMutex);
        }
        values = this._uncontrolledValues || [];
        this._wasControlled = false;
      }
      var selected = {};
      values.forEach(function remember(value) { selected[valueKey(value)] = true; });
      var heights = this._contentHeights || {};
      items.forEach(function mapExpanded(item) {
        item.expanded = !!selected[item.id];
        item.contentHeight = Number(heights[item.id]) || 0;
      });
      var theme = normalizeTheme(this.data.theme);
      var stateType = this.data.error ? 'error' : (this.data.loading ? 'loading' : (items.length ? 'content' : 'empty'));
      var classes = [
        'pui-collapse',
        this.getColorSchemeClass(),
        'pui-collapse--' + theme,
        this.data.disabled ? 'pui-collapse--disabled' : '',
        'pui-collapse--' + stateType,
      ];
      this.setData({
        rootClass: classes.filter(Boolean).join(' '),
        normalizedItems: items,
        expandedValues: values,
        stateType: stateType,
        motionDuration: this.data.reduceMotion ? 1 : MOTION_DURATION,
        motionEasing: MOTION_EASING,
      }, function afterSync() { component.measureContentHeights(); });
    },
    measureContentHeights: function measureContentHeights() {
      var component = this;
      if (!this.createSelectorQuery || !this.data.normalizedItems.length || this.data.stateType !== 'content') return;
      this.createSelectorQuery().in(this).selectAll('.pui-collapse__content-inner').boundingClientRect().exec(function onMeasured(result) {
        var rects = result && result[0];
        if (!Array.isArray(rects)) return;
        var nextHeights = {};
        rects.forEach(function mapRect(rect, index) {
          var item = component.data.normalizedItems[index];
          if (item && rect) nextHeights[item.id] = Math.max(0, Math.ceil(Number(rect.height) || 0));
        });
        component._contentHeights = nextHeights;
        var items = component.data.normalizedItems.map(function withHeight(item) {
          return Object.assign({}, item, { contentHeight: nextHeights[item.id] || 0 });
        });
        component.setData({ normalizedItems: items });
      });
    },
    onToggle: function onToggle(event) {
      this.requestToggle(Number(event.currentTarget.dataset.index), 'tap');
    },
    requestToggle: function requestToggle(index, source) {
      if (this.data.disabled || this.data.stateType !== 'content') return false;
      var item = this.data.normalizedItems[index];
      if (!item || item.disabled) return false;
      var current = this.data.expandedValues.slice();
      var currentKeys = {};
      current.forEach(function remember(value) { currentKeys[valueKey(value)] = true; });
      var expanded = !currentKeys[item.id];
      var next = expanded
        ? (this.data.expandMutex ? [item.value] : current.concat(item.value))
        : current.filter(function filterValue(value) { return valueKey(value) !== item.id; });
      next = normalizeValues(next, this.data.normalizedItems, this.data.expandMutex);
      var controlled = Array.isArray(this.data.value);
      if (!controlled) this._uncontrolledValues = next.slice();
      this.triggerEvent('change', {
        value: next,
        item: publicItem(item),
        index: index,
        expanded: expanded,
        source: source || 'tap',
        controlled: controlled,
      });
      this.syncState();
      return true;
    },
    onRetry: function onRetry() {
      if (this.data.disabled || !this.data.error || !this.data.retryText) return;
      this.triggerEvent('retry', { source: 'retry', errorText: this.data.errorText });
    },
  },
});
