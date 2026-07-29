var themeBehavior = require('../common/behaviors/theme');

var EASINGS = {
  standard: 'var(--pui-ease-standard)',
  ease: 'ease',
  linear: 'linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out'
};

function sameValue(left, right) {
  return left === right || String(left) === String(right);
}

function clampDuration(value, reduceMotion) {
  if (reduceMotion) return 1;
  var next = Math.round(Number(value));
  if (!isFinite(next)) next = 500;
  return Math.max(0, Math.min(1000, next));
}

function normalizeSize(value) {
  return value === 'small' || value === 'large' ? value : 'medium';
}

function truncateLabel(value, maxLength) {
  var label = value === null || value === undefined ? '' : String(value);
  var limit = Math.max(0, Math.floor(Number(maxLength) || 0));
  if (!limit || label.length <= limit) return label;
  return label.slice(0, Math.max(1, limit - 1)) + '…';
}

function rawValue(item, index) {
  return item && typeof item === 'object' && item.value !== undefined ? item.value : index;
}

function rawLabel(item) {
  if (item && typeof item === 'object') {
    if (item.label !== undefined) return item.label;
    if (item.title !== undefined) return item.title;
    return '';
  }
  return item;
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    current: { type: Number, value: -1 },
    separator: { type: String, value: '/' },
    separatorIcon: { type: String, value: '' },
    showIcon: { type: Boolean, value: true },
    size: { type: String, value: 'medium' },
    wrap: { type: Boolean, value: false },
    maxLabelLength: { type: Number, value: 0 },
    currentClickable: { type: Boolean, value: false },
    customPrefix: { type: Boolean, value: false },
    customSuffix: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '路径加载中' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '路径加载失败' },
    retryText: { type: String, value: '重试' },
    emptyText: { type: String, value: '暂无路径' },
    ariaLabel: { type: String, value: '面包屑导航' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    innerValue: null,
    normalizedItems: [],
    selectedIndex: -1,
    selectedValue: null,
    selectedLabel: '',
    stateType: 'empty',
    rootClass: 'pui-breadcrumb',
    rootStyle: '',
    semanticLabel: '面包屑导航',
    resolvedDuration: 500,
    iconSize: 28,
    separatorIconSize: 24
  },
  observers: {
    'items,value,current,separator,separatorIcon,showIcon,size,wrap,maxLabelLength,currentClickable,customPrefix,customSuffix,disabled,loading,error,ariaLabel,duration,easing,reduceMotion,colorScheme': function syncObserver() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this.syncState();
    }
  },
  methods: {
    isValueControlled: function isValueControlled() {
      return this.data.value !== null && this.data.value !== undefined;
    },
    isIndexControlled: function isIndexControlled() {
      return !this.isValueControlled() && isFinite(Number(this.data.current)) && Number(this.data.current) >= 0;
    },
    findIndex: function findIndex(items, value) {
      for (var index = 0; index < items.length; index += 1) {
        if (sameValue(rawValue(items[index], index), value)) return index;
      }
      return -1;
    },
    initialValue: function initialValue(items) {
      if (this.data.defaultValue !== null && this.data.defaultValue !== undefined) return this.data.defaultValue;
      for (var index = 0; index < items.length; index += 1) {
        if (items[index] && typeof items[index] === 'object' && items[index].current) return rawValue(items[index], index);
      }
      for (var cursor = items.length - 1; cursor >= 0; cursor -= 1) {
        if (!(items[cursor] && typeof items[cursor] === 'object' && items[cursor].disabled)) return rawValue(items[cursor], cursor);
      }
      return null;
    },
    syncState: function syncState() {
      if (!this._ready) return;
      var items = Array.isArray(this.data.items) ? this.data.items : [];
      var selectedIndex = -1;
      var selectedValue = null;
      if (this.isValueControlled()) {
        selectedValue = this.data.value;
        selectedIndex = this.findIndex(items, selectedValue);
      } else if (this.isIndexControlled()) {
        var requestedIndex = Math.floor(Number(this.data.current));
        selectedIndex = requestedIndex >= 0 && requestedIndex < items.length ? requestedIndex : -1;
        selectedValue = selectedIndex >= 0 ? rawValue(items[selectedIndex], selectedIndex) : null;
      } else {
        if (!this._initialized) {
          if (this.data.defaultValue !== null && this.data.defaultValue !== undefined) {
            this.data.innerValue = this.data.defaultValue;
            this._initialized = true;
          } else if (items.length) {
            this.data.innerValue = this.initialValue(items);
            this._initialized = true;
          }
        }
        selectedValue = this.data.innerValue;
        selectedIndex = this.findIndex(items, selectedValue);
      }

      var maxLength = this.data.maxLabelLength;
      var disabled = this.data.disabled;
      var currentClickable = this.data.currentClickable;
      var normalized = items.map(function normalizeItem(item, index) {
        var source = item && typeof item === 'object' ? item : {};
        var label = String(rawLabel(item) === null || rawLabel(item) === undefined ? '' : rawLabel(item));
        var active = index === selectedIndex;
        return {
          id: 'pui-breadcrumb-item-' + index,
          value: rawValue(item, index),
          label: truncateLabel(label, maxLength),
          fullLabel: label,
          icon: source.icon || '',
          disabled: !!(disabled || source.disabled || (active && !currentClickable)),
          active: active,
          ariaLabel: String(source.ariaLabel || label || ('路径 ' + (index + 1))) + (active ? '，当前页面' : '')
        };
      });
      var size = normalizeSize(this.data.size);
      var resolvedDuration = clampDuration(this.data.duration, this.data.reduceMotion);
      var stateType = this.data.error ? 'error' : this.data.loading ? 'loading' : normalized.length ? 'content' : 'empty';
      this.setData({
        normalizedItems: normalized,
        selectedIndex: selectedIndex,
        selectedValue: selectedValue,
        selectedLabel: selectedIndex >= 0 ? normalized[selectedIndex].fullLabel : '',
        stateType: stateType,
        rootClass: [
          'pui-breadcrumb',
          this.getColorSchemeClass(),
          'pui-breadcrumb--' + size,
          this.data.wrap ? 'pui-breadcrumb--wrap' : 'pui-breadcrumb--nowrap',
          disabled ? 'pui-breadcrumb--disabled' : '',
          this.data.reduceMotion ? 'pui-breadcrumb--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-breadcrumb-duration:' + resolvedDuration + 'ms;--pui-breadcrumb-ease:' + (EASINGS[this.data.easing] || EASINGS.standard) + ';',
        semanticLabel: String(this.data.ariaLabel || '面包屑导航').trim() || '面包屑导航',
        resolvedDuration: resolvedDuration,
        iconSize: size === 'small' ? 24 : size === 'large' ? 32 : 28,
        separatorIconSize: size === 'small' ? 20 : size === 'large' ? 28 : 24
      });
    },
    requestSelect: function requestSelect(index, source) {
      var item = this.data.normalizedItems[index];
      var rawItem = Array.isArray(this.data.items) ? this.data.items[index] : null;
      if (!item || this.data.disabled || this.data.stateType !== 'content' || item.disabled) return false;
      var previousValue = this.data.selectedValue;
      var detail = {
        value: item.value,
        index: index,
        item: rawItem === undefined ? null : rawItem,
        previousValue: previousValue,
        previousIndex: this.data.selectedIndex,
        source: source || 'item'
      };
      this.triggerEvent('click', detail);
      if (sameValue(item.value, previousValue) && index === this.data.selectedIndex) return true;
      if (!this.isValueControlled() && !this.isIndexControlled()) {
        this.data.innerValue = item.value;
        this.syncState();
      }
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      return true;
    },
    onSelect: function onSelect(event) {
      this.requestSelect(Number(event.currentTarget.dataset.index), 'item');
    },
    onRetry: function onRetry() {
      if (this.data.disabled || !this.data.error) return;
      this.triggerEvent('retry', { source: 'retry' });
    },
    select: function select(value) {
      var index = this.findIndex(Array.isArray(this.data.items) ? this.data.items : [], value);
      return index >= 0 ? this.requestSelect(index, 'method') : false;
    },
    selectIndex: function selectIndex(index) {
      return this.requestSelect(Math.floor(Number(index)), 'method');
    },
    reset: function reset() {
      if (this.isValueControlled() || this.isIndexControlled()) return false;
      var items = Array.isArray(this.data.items) ? this.data.items : [];
      var next = this.initialValue(items);
      var index = this.findIndex(items, next);
      return index >= 0 ? this.requestSelect(index, 'reset') : false;
    }
  }
});
