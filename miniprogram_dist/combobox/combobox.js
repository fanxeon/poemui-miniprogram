var themeBehavior = require('../common/behaviors/theme');

var EASING = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  ease: 'ease',
  linear: 'linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
};
var PLACEMENTS = ['bottom', 'top'];
var SIZES = ['small', 'medium', 'large'];
var SHAPES = ['rectangle', 'round'];

function hasValue(value) { return value !== null && value !== undefined; }
function firstDefined(values, fallback) {
  for (var index = 0; index < values.length; index += 1) {
    if (values[index] !== null && values[index] !== undefined) return values[index];
  }
  return fallback;
}
function valueKey(value) {
  if (value === null) return 'null:null';
  var type = typeof value;
  if (type === 'object') {
    try { return type + ':' + JSON.stringify(value); } catch (error) { return type + ':' + String(value); }
  }
  return type + ':' + String(value);
}
function publicOption(item) {
  if (!item) return null;
  return { label: item.label, value: item.value, description: item.description, icon: item.icon, group: item.group, disabled: item.disabled, raw: item.raw };
}
function normalizeOptions(options) {
  var flattened = [];
  (Array.isArray(options) ? options : []).forEach(function flatten(option, index) {
    if (option && typeof option === 'object' && Array.isArray(option.options)) {
      var group = String(firstDefined([option.label, option.title, option.group], ''));
      option.options.forEach(function flattenGroupItem(item, childIndex) { flattened.push({ source: item, index: index + '-' + childIndex, group: group }); });
      return;
    }
    flattened.push({ source: option, index: index, group: '' });
  });
  var seen = {};
  return flattened.reduce(function normalize(result, entry) {
    var source = entry.source && typeof entry.source === 'object' ? entry.source : { label: entry.source, value: entry.source };
    var value = source.value === undefined ? String(entry.index) : source.value;
    var key = valueKey(value);
    if (seen[key]) return result;
    seen[key] = true;
    result.push({
      key: key,
      index: result.length,
      label: String(firstDefined([source.label, source.text, source.title], value)),
      value: value,
      description: String(firstDefined([source.description, source.content], '')),
      icon: String(source.icon || ''),
      group: String(firstDefined([source.group, entry.group], '')),
      disabled: !!source.disabled,
      selected: false,
      showGroupHeader: false,
      raw: entry.source,
    });
    return result;
  }, []);
}
function asValues(value, multiple) { return multiple ? (Array.isArray(value) ? value.slice() : (hasValue(value) ? [value] : [])) : (hasValue(value) ? [value] : []); }
function selectedItems(value, items, multiple) {
  var lookup = {};
  items.forEach(function register(item) { lookup[item.key] = item; });
  var seen = {};
  return asValues(value, multiple).reduce(function select(result, selectedValue) {
    var key = valueKey(selectedValue);
    if (seen[key]) return result;
    seen[key] = true;
    result.push(lookup[key] || { key: key, index: -1, label: String(selectedValue), value: selectedValue, description: '', icon: '', group: '', disabled: false, raw: selectedValue });
    return result;
  }, []);
}
function selectionValue(items, multiple) { return multiple ? items.map(function valueOf(item) { return item.value; }) : (items.length ? items[0].value : null); }
function equalSelection(left, right, multiple) {
  var a = asValues(left, multiple).map(valueKey);
  var b = asValues(right, multiple).map(valueKey);
  if (a.length !== b.length) return false;
  for (var index = 0; index < a.length; index += 1) if (a[index] !== b[index]) return false;
  return true;
}
function clampDuration(value) { var next = Math.round(Number(value)); return Math.max(0, Math.min(1000, isFinite(next) ? next : 500)); }
function clampListHeight(value) { var next = Math.round(Number(value)); return Math.max(160, Math.min(800, isFinite(next) ? next : 480)); }
function clampMaxSelected(value) { var next = Math.round(Number(value)); return Math.max(0, Math.min(100, isFinite(next) ? next : 0)); }

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    options: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: false },
    multiple: { type: Boolean, value: false },
    maxSelected: { type: Number, value: 0 },
    placeholder: { type: String, value: '请选择' },
    clearable: { type: Boolean, value: true },
    showIcon: { type: Boolean, value: true },
    showDescription: { type: Boolean, value: true },
    showGroup: { type: Boolean, value: true },
    showCheck: { type: Boolean, value: true },
    closeOnSelect: { type: null, value: null },
    customTrigger: { type: Boolean, value: false },
    customEmpty: { type: Boolean, value: false },
    customFooter: { type: Boolean, value: false },
    placement: { type: String, value: 'bottom' },
    size: { type: String, value: 'medium' },
    shape: { type: String, value: 'rectangle' },
    bordered: { type: Boolean, value: true },
    block: { type: Boolean, value: true },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '选项加载中…' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '选项加载失败' },
    retryText: { type: String, value: '重试' },
    emptyText: { type: String, value: '暂无选项' },
    listHeight: { type: Number, value: 480 },
    ariaLabel: { type: String, value: '组合框' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: { rootClass: 'pui-combobox', rootStyle: '', normalizedOptions: [], optionItems: [], selectedItems: [], currentValue: null, currentVisible: false, valueControlled: false, visibleControlled: false, stateType: 'empty', listViewportHeight: 480, semanticLabel: '组合框', motionDuration: 500, motionEasing: EASING.standard },
  observers: {
    'options,value,defaultValue,visible,defaultVisible,multiple,maxSelected,placeholder,clearable,showIcon,showDescription,showGroup,showCheck,closeOnSelect,customTrigger,customEmpty,customFooter,placement,size,shape,bordered,block,disabled,readonly,loading,loadingText,error,errorText,retryText,emptyText,listHeight,ariaLabel,duration,easing,reduceMotion,colorScheme': function sync() { this.syncState(); },
  },
  lifetimes: { attached: function attached() { this.syncState(true); } },
  methods: {
    syncState: function syncState(initial) {
      var valueControlled = hasValue(this.data.value);
      var visibleControlled = hasValue(this.data.visible);
      if (initial || !this._comboboxInitialized) {
        this._selectionValue = valueControlled ? this.data.value : this.data.defaultValue;
        this._visibleValue = visibleControlled ? !!this.data.visible : !!this.data.defaultVisible;
        this._comboboxInitialized = true;
      } else {
        if (valueControlled) this._selectionValue = this.data.value;
        else if (this._wasValueControlled) this._selectionValue = this.data.defaultValue;
        if (visibleControlled) this._visibleValue = !!this.data.visible;
        else if (this._wasVisibleControlled) this._visibleValue = !!this.data.defaultVisible;
      }
      this._wasValueControlled = valueControlled;
      this._wasVisibleControlled = visibleControlled;
      var options = normalizeOptions(this.data.options);
      var selected = selectedItems(this._selectionValue, options, this.data.multiple);
      var selectedKeys = {};
      selected.forEach(function mark(item) { selectedKeys[item.key] = true; });
      var previousGroup = null;
      var optionItems = options.map(function present(item) {
        var copy = Object.assign({}, item);
        copy.selected = !!selectedKeys[copy.key];
        copy.showGroupHeader = !!this.data.showGroup && !!copy.group && copy.group !== previousGroup;
        previousGroup = copy.group;
        return copy;
      }.bind(this));
      var stateType = this.data.error ? 'error' : (this.data.loading ? 'loading' : (optionItems.length ? 'content' : 'empty'));
      var placement = PLACEMENTS.indexOf(this.data.placement) > -1 ? this.data.placement : 'bottom';
      var size = SIZES.indexOf(this.data.size) > -1 ? this.data.size : 'medium';
      var shape = SHAPES.indexOf(this.data.shape) > -1 ? this.data.shape : 'rectangle';
      var duration = this.data.reduceMotion ? 1 : clampDuration(this.data.duration);
      this.setData({
        rootClass: ['pui-combobox', this.getColorSchemeClass(), 'pui-combobox--' + placement, 'pui-combobox--' + size, 'pui-combobox--' + shape, this.data.block ? 'pui-combobox--block' : 'pui-combobox--inline', this.data.bordered ? 'pui-combobox--bordered' : 'pui-combobox--borderless', this._visibleValue ? 'pui-combobox--open' : 'pui-combobox--closed', this.data.multiple ? 'pui-combobox--multiple' : 'pui-combobox--single', selected.length ? 'pui-combobox--selected' : 'pui-combobox--placeholder', this.data.disabled ? 'pui-combobox--disabled' : '', this.data.readonly ? 'pui-combobox--readonly' : '', 'pui-combobox--' + stateType].filter(Boolean).join(' '),
        rootStyle: '--pui-combobox-duration:' + duration + 'ms;--pui-combobox-ease:' + (EASING[this.data.easing] || EASING.standard) + ';', normalizedOptions: options, optionItems: optionItems, selectedItems: selected, currentValue: selectionValue(selected, this.data.multiple), currentVisible: !!this._visibleValue, valueControlled: valueControlled, visibleControlled: visibleControlled, stateType: stateType, listViewportHeight: clampListHeight(this.data.listHeight), semanticLabel: (this.data.ariaLabel || this.data.placeholder || '组合框').trim() || '组合框', motionDuration: duration, motionEasing: EASING[this.data.easing] || EASING.standard,
      });
    },
    onTriggerTap: function onTriggerTap() { if (this.data.disabled) return; this.triggerEvent('click', { visible: !this.data.currentVisible, previousVisible: !!this.data.currentVisible, source: 'trigger', readonly: !!this.data.readonly }); this.requestVisible(!this.data.currentVisible, 'trigger'); },
    onPanelClose: function onPanelClose() { this.requestVisible(false, 'panel-close'); },
    requestVisible: function requestVisible(nextVisible, source) {
      if (this.data.disabled) return false;
      var previousVisible = !!this.data.currentVisible;
      var next = !!nextVisible;
      if (next === previousVisible) return false;
      var detail = { visible: next, value: next, previousVisible: previousVisible, source: source || 'programmatic', controlled: !!this.data.visibleControlled };
      if (!this.data.visibleControlled) this._visibleValue = next;
      this._afterVisible = null;
      this.triggerEvent('visible-input', detail); this.triggerEvent('visible-change', detail); this.triggerEvent(next ? 'open' : 'close', detail);
      this.syncState();
      return true;
    },
    onTransitionEnd: function onTransitionEnd(event) {
      var propertyName = event && event.detail && event.detail.propertyName;
      if (propertyName && propertyName !== 'height') return;
      var visible = !!this.data.currentVisible;
      if (this._afterVisible === visible) return;
      this._afterVisible = visible;
      this.triggerEvent(visible ? 'after-open' : 'after-close', { visible: visible, value: visible, source: 'transitionend', controlled: !!this.data.visibleControlled });
    },
    onOptionTap: function onOptionTap(event) { this.requestOption(Number(event.currentTarget.dataset.index), 'option'); },
    requestOption: function requestOption(index, source) {
      if (this.data.disabled || this.data.readonly || this.data.loading || this.data.error) return false;
      var item = this.data.optionItems[index];
      if (!item || item.disabled) return false;
      var current = this.data.selectedItems.slice();
      var existing = current.map(function keyOf(entry) { return entry.key; }).indexOf(item.key);
      var selected = existing === -1;
      var next;
      if (this.data.multiple) {
        if (selected) { var limit = clampMaxSelected(this.data.maxSelected); if (limit && current.length >= limit) { this.triggerEvent('exceed', { maxSelected: limit, option: publicOption(item), source: source || 'option' }); return false; } next = current.concat(item); }
        else next = current.filter(function remove(entry) { return entry.key !== item.key; });
      } else { if (!selected) { if (this.resolveCloseOnSelect()) this.requestVisible(false, 'select'); return false; } next = [item]; }
      return this.commitSelection(next, selected ? 'select' : 'remove', item, source || 'option');
    },
    commitSelection: function commitSelection(nextItems, action, item, source) {
      var previousValue = this.data.currentValue;
      var nextValue = selectionValue(nextItems, this.data.multiple);
      if (equalSelection(previousValue, nextValue, this.data.multiple)) return false;
      var detail = { value: nextValue, previousValue: previousValue, option: publicOption(item), index: item ? item.index : -1, selected: action === 'select', multiple: !!this.data.multiple, source: source || action, controlled: !!this.data.valueControlled };
      if (!this.data.valueControlled) this._selectionValue = nextValue;
      this.triggerEvent('input', detail); this.triggerEvent('change', detail); this.triggerEvent(action, detail);
      if (action === 'select' && this.resolveCloseOnSelect()) this.requestVisible(false, 'select');
      this.syncState();
      return true;
    },
    resolveCloseOnSelect: function resolveCloseOnSelect() { return hasValue(this.data.closeOnSelect) ? !!this.data.closeOnSelect : !this.data.multiple; },
    onTagClose: function onTagClose(event) { this.removeAt(Number(event.currentTarget.dataset.index), 'tag-remove'); },
    removeAt: function removeAt(index, source) { if (this.data.disabled || this.data.readonly) return false; var item = this.data.selectedItems[index]; if (!item) return false; return this.commitSelection(this.data.selectedItems.filter(function remove(_, itemIndex) { return itemIndex !== index; }), 'remove', item, source || 'remove'); },
    onClearTap: function onClearTap() { this.clear('clear-button'); },
    clear: function clear(source) { if (this.data.disabled || this.data.readonly || !this.data.selectedItems.length) return false; var previousValue = this.data.currentValue; var nextValue = this.data.multiple ? [] : null; var detail = { value: nextValue, previousValue: previousValue, source: source || 'method-clear', multiple: !!this.data.multiple, controlled: !!this.data.valueControlled }; if (!this.data.valueControlled) this._selectionValue = nextValue; this.triggerEvent('input', detail); this.triggerEvent('change', detail); this.triggerEvent('clear', detail); this.syncState(); return true; },
    onRetry: function onRetry() { if (this.data.disabled || !this.data.error || !this.data.retryText) return; this.triggerEvent('retry', { source: 'retry', visible: !!this.data.currentVisible }); },
    onScroll: function onScroll(event) { this.triggerEvent('scroll', { scrollTop: Number(event.detail && event.detail.scrollTop) || 0, scrollHeight: Number(event.detail && event.detail.scrollHeight) || 0, source: 'scroll' }); },
    open: function open() { return this.requestVisible(true, 'method-open'); }, close: function close() { return this.requestVisible(false, 'method-close'); }, toggle: function toggle() { return this.requestVisible(!this.data.currentVisible, 'method-toggle'); }, focus: function focus() { return this.requestVisible(true, 'method-focus'); },
    reset: function reset() {
      if (this.data.disabled || this.data.readonly) return false;
      var previousValue = this.data.currentValue;
      var previousVisible = !!this.data.currentVisible;
      var nextItems = selectedItems(this.data.defaultValue, this.data.normalizedOptions, this.data.multiple);
      var nextValue = selectionValue(nextItems, this.data.multiple);
      var nextVisible = !!this.data.defaultVisible;
      if (!this.data.valueControlled) this._selectionValue = this.data.defaultValue;
      if (!this.data.visibleControlled) this._visibleValue = nextVisible;
      if (!equalSelection(previousValue, nextValue, this.data.multiple)) { var detail = { value: nextValue, previousValue: previousValue, source: 'method-reset', multiple: !!this.data.multiple, controlled: !!this.data.valueControlled }; this.triggerEvent('input', detail); this.triggerEvent('change', detail); }
      if (nextVisible !== previousVisible) { var visibleDetail = { visible: nextVisible, value: nextVisible, previousVisible: previousVisible, source: 'method-reset', controlled: !!this.data.visibleControlled }; this._afterVisible = null; this.triggerEvent('visible-input', visibleDetail); this.triggerEvent('visible-change', visibleDetail); this.triggerEvent(nextVisible ? 'open' : 'close', visibleDetail); }
      this.triggerEvent('reset', { value: nextValue, visible: nextVisible, source: 'method-reset', valueControlled: !!this.data.valueControlled, visibleControlled: !!this.data.visibleControlled }); this.syncState(); return true;
    },
    select: function select(value) { if (this.data.disabled || this.data.readonly || this.data.loading || this.data.error) return false; var key = valueKey(value); var item = this.data.normalizedOptions.filter(function find(entry) { return entry.key === key; })[0]; if (!item || item.disabled || this.data.selectedItems.some(function exists(entry) { return entry.key === key; })) return false; var limit = clampMaxSelected(this.data.maxSelected); if (this.data.multiple && limit && this.data.selectedItems.length >= limit) { this.triggerEvent('exceed', { maxSelected: limit, option: publicOption(item), source: 'method-select' }); return false; } return this.commitSelection(this.data.multiple ? this.data.selectedItems.concat(item) : [item], 'select', item, 'method-select'); },
    deselect: function deselect(value) { var key = valueKey(value); var index = this.data.selectedItems.map(function keyOf(item) { return item.key; }).indexOf(key); return index > -1 ? this.removeAt(index, 'method-deselect') : false; }, retry: function retry() { this.onRetry(); },
  },
});
