var themeBehavior = require('../common/behaviors/theme');

var DEFAULT_KEYS = { label: 'label', value: 'value', children: 'children', disabled: 'disabled', icon: 'icon' };
var MAX_COLUMNS = 8;

function hasOwn(object, key) { return Object.prototype.hasOwnProperty.call(object || {}, key); }
function asArray(value) { return Array.isArray(value) ? value.slice() : []; }
function sameValue(left, right) { return left === right || (typeof left === 'number' && typeof right === 'number' && isNaN(left) && isNaN(right)); }
function sameValues(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
  for (var index = 0; index < left.length; index += 1) if (!sameValue(left[index], right[index])) return false;
  return true;
}
function boundedNumber(value, min, max, fallback) {
  var number = Math.round(Number(value));
  if (!isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}
function normalizeKeys(keys) {
  var source = keys && typeof keys === 'object' && !Array.isArray(keys) ? keys : {};
  var result = {};
  Object.keys(DEFAULT_KEYS).forEach(function eachKey(key) {
    var value = String(source[key] || DEFAULT_KEYS[key]).trim();
    result[key] = value || DEFAULT_KEYS[key];
  });
  return result;
}
function normalizeOption(option, index, keys) {
  var object = option && typeof option === 'object' && !Array.isArray(option) ? option : null;
  var labelValue = object && hasOwn(object, keys.label) ? object[keys.label] : option;
  if (labelValue === undefined || labelValue === null) labelValue = '选项 ' + (index + 1);
  var value = object && hasOwn(object, keys.value) ? object[keys.value] : (object ? index : option);
  if (value === undefined) value = index;
  return {
    label: String(labelValue),
    value: value,
    disabled: Boolean(object && object[keys.disabled]),
    icon: object && object[keys.icon] ? String(object[keys.icon]) : '',
    children: object && Array.isArray(object[keys.children]) ? object[keys.children] : [],
    raw: option,
  };
}
function normalizeColumn(options, keys) {
  return (Array.isArray(options) ? options : []).map(function mapOption(option, index) { return normalizeOption(option, index, keys); });
}
function firstEnabled(options) {
  for (var index = 0; index < options.length; index += 1) if (!options[index].disabled) return index;
  return -1;
}
function findValue(options, value) {
  for (var index = 0; index < options.length; index += 1) if (sameValue(options[index].value, value)) return index;
  return -1;
}
function enabledIndex(options, target, previous) {
  if (!options.length) return -1;
  var index = boundedNumber(target, 0, options.length - 1, 0);
  if (!options[index].disabled) return index;
  var direction = index >= Number(previous) ? 1 : -1;
  for (var offset = 1; offset < options.length; offset += 1) {
    var next = index + (offset * direction);
    if (next >= 0 && next < options.length && !options[next].disabled) return next;
  }
  for (var reverseOffset = 1; reverseOffset < options.length; reverseOffset += 1) {
    var reverse = index - (reverseOffset * direction);
    if (reverse >= 0 && reverse < options.length && !options[reverse].disabled) return reverse;
  }
  return firstEnabled(options);
}
function isMatrix(columns) { return Array.isArray(columns) && columns.length > 0 && columns.every(Array.isArray); }
function buildModel(source, requestedValues, preferredIndexes, keys) {
  var values = asArray(requestedValues);
  var previousIndexes = asArray(preferredIndexes);
  var columns = [];
  var indexes = [];
  var selected = [];
  var labels = [];
  var selectedOptions = [];
  var matrix = isMatrix(source);
  var rawColumn = matrix ? null : (Array.isArray(source) ? source : []);
  var total = matrix ? Math.min(source.length, MAX_COLUMNS) : MAX_COLUMNS;
  for (var columnIndex = 0; columnIndex < total; columnIndex += 1) {
    var raw = matrix ? source[columnIndex] : rawColumn;
    var options = normalizeColumn(raw, keys);
    if (!options.length) {
      if (columnIndex === 0 || matrix) {
        columns.push([]);
        indexes.push(0);
      }
      break;
    }
    var requested = columnIndex < values.length ? findValue(options, values[columnIndex]) : -1;
    var preferred = requested > -1 ? requested : (columnIndex < previousIndexes.length ? previousIndexes[columnIndex] : firstEnabled(options));
    var resolved = enabledIndex(options, preferred, previousIndexes[columnIndex]);
    if (resolved < 0) resolved = 0;
    var option = options[resolved];
    columns.push(options);
    indexes.push(resolved);
    selected.push(option.value);
    labels.push(option.label);
    selectedOptions.push(option.raw);
    if (matrix) continue;
    rawColumn = option.children;
    if (!rawColumn.length) break;
  }
  return { columns: columns, indexes: indexes, value: selected, label: labels, options: selectedOptions, mode: matrix ? 'multiple' : (columns.length > 1 ? 'cascade' : 'single') };
}
function isControlledValue(data) { return data.value !== null && data.value !== undefined; }
function isControlledVisible(data) { return data.visible !== null && data.visible !== undefined; }

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    columns: { type: Array, value: [] },
    value: { type: null, value: null },
    defaultValue: { type: Array, value: [] },
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: false },
    title: { type: String, value: '' },
    cancelText: { type: String, value: '取消' },
    confirmText: { type: String, value: '确定' },
    showHeader: { type: Boolean, value: true },
    usePopup: { type: Boolean, value: true },
    closeOnOverlayClick: { type: Boolean, value: true },
    autoClose: { type: Boolean, value: true },
    keys: { type: Object, value: {} },
    visibleItemCount: { type: Number, value: 5 },
    itemHeight: { type: Number, value: 80 },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '选项加载中' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '选项加载失败' },
    retryText: { type: String, value: '重试' },
    emptyText: { type: String, value: '暂无可选项' },
    ariaLabel: { type: String, value: '滚轮选择器' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    currentVisible: false,
    columnsData: [],
    draftIndexes: [],
    draftValue: [],
    draftLabel: [],
    selectedValue: [],
    selectedLabel: [],
    selectedOptions: [],
    mode: 'single',
    stateType: 'empty',
    pickerBlocked: true,
    confirmDisabled: true,
    showRetry: false,
    itemHeightValue: 80,
    viewportHeight: 400,
    indicatorStyle: 'height:80rpx;',
    rootClass: 'pui-picker pui-picker--popup pui-picker--empty',
    rootStyle: '--pui-picker-duration:500ms;',
    semanticLabel: '滚轮选择器',
  },
  observers: {
    'columns,value,defaultValue,visible,defaultVisible,title,usePopup,keys,visibleItemCount,itemHeight,disabled,readonly,loading,error,retryText,ariaLabel,reduceMotion,colorScheme': function observeAll() { this.syncState(); },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._valueInitialized = false;
      this._visibleInitialized = false;
      this._draftDirty = false;
      this.syncState();
    },
    detached: function detached() { this._ready = false; },
  },
  methods: {
    committedValue: function committedValue() {
      if (isControlledValue(this.data)) return asArray(this.data.value);
      if (!this._valueInitialized) {
        this._innerValue = asArray(this.data.defaultValue);
        this._valueInitialized = true;
      }
      return asArray(this._innerValue);
    },
    resolvedVisible: function resolvedVisible() {
      if (!this.data.usePopup) return true;
      if (isControlledVisible(this.data)) return Boolean(this.data.visible);
      if (!this._visibleInitialized) {
        this._innerVisible = Boolean(this.data.defaultVisible);
        this._visibleInitialized = true;
      }
      return Boolean(this._innerVisible);
    },
    syncState: function syncState() {
      if (!this._ready) return;
      var keys = normalizeKeys(this.data.keys);
      var selectedModel = buildModel(this.data.columns, this.committedValue(), [], keys);
      var visible = this.resolvedVisible();
      var draftModel = visible && this._draftDirty
        ? buildModel(this.data.columns, this._draftValue, this.data.draftIndexes, keys)
        : selectedModel;
      var count = boundedNumber(this.data.visibleItemCount, 3, 7, 5);
      if (count % 2 === 0) count += count === 7 ? -1 : 1;
      var itemHeight = boundedNumber(this.data.itemHeight, 64, 112, 80);
      var empty = !draftModel.columns.length || !draftModel.columns[0].length || draftModel.columns.some(function everyColumn(column) { return firstEnabled(column) < 0; });
      var stateType = this.data.error ? 'error' : this.data.loading ? 'loading' : (empty ? 'empty' : 'content');
      var blocked = Boolean(this.data.disabled || this.data.readonly || stateType !== 'content');
      var rootClass = ['pui-picker', this.getColorSchemeClass(), this.data.usePopup ? 'pui-picker--popup' : 'pui-picker--inline', 'pui-picker--' + stateType, this.data.disabled ? 'pui-picker--disabled' : '', this.data.readonly ? 'pui-picker--readonly' : '', this.data.reduceMotion ? 'pui-picker--reduced' : ''].filter(Boolean).join(' ');
      this._selectedModel = selectedModel;
      this._draftValue = draftModel.value.slice();
      this.setData({
        currentVisible: visible,
        columnsData: draftModel.columns,
        draftIndexes: draftModel.indexes,
        draftValue: draftModel.value,
        draftLabel: draftModel.label,
        selectedValue: selectedModel.value,
        selectedLabel: selectedModel.label,
        selectedOptions: selectedModel.options,
        mode: draftModel.mode,
        stateType: stateType,
        pickerBlocked: blocked,
        confirmDisabled: blocked,
        showRetry: Boolean(this.data.error && this.data.retryText && !this.data.disabled),
        itemHeightValue: itemHeight,
        viewportHeight: itemHeight * count,
        indicatorStyle: 'height:' + itemHeight + 'rpx;',
        rootClass: rootClass,
        rootStyle: '--pui-picker-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;',
        semanticLabel: String(this.data.ariaLabel || this.data.title || '滚轮选择器').trim() || '滚轮选择器',
      });
    },
    detailFromModel: function detailFromModel(model, source, extra) {
      return Object.assign({ value: model.value.slice(), label: model.label.slice(), columns: model.options.slice(), source: source || 'programmatic', controlled: isControlledValue(this.data) }, extra || {});
    },
    requestVisible: function requestVisible(next, source) {
      if (!this.data.usePopup) return false;
      var visible = Boolean(next);
      if (visible && (this.data.disabled || this.data.readonly)) return false;
      if (visible === Boolean(this.data.currentVisible)) return false;
      if (visible) {
        this._draftDirty = false;
        this._draftValue = this._selectedModel ? this._selectedModel.value.slice() : [];
      }
      if (!isControlledVisible(this.data)) {
        this._innerVisible = visible;
        this.setData({ currentVisible: visible });
        if (visible) this.syncState();
      }
      var detail = { visible: visible, source: source || 'programmatic', controlled: isControlledVisible(this.data) };
      this.triggerEvent('visible-change', detail);
      this.triggerEvent(visible ? 'open' : 'close', detail);
      return true;
    },
    open: function open() { return this.requestVisible(true, 'programmatic'); },
    close: function close(source) { return this.requestVisible(false, typeof source === 'string' ? source : 'programmatic'); },
    onPopupVisibleChange: function onPopupVisibleChange(event) {
      if (!event || !event.detail || event.detail.visible !== false) return;
      this.requestVisible(false, event.detail.trigger || 'overlay');
    },
    onPickerChange: function onPickerChange(event) {
      if (this.data.pickerBlocked) return false;
      var requestedIndexes = asArray(event && event.detail && event.detail.value).map(Number);
      var previousIndexes = asArray(this.data.draftIndexes);
      var changedColumn = 0;
      for (var index = 0; index < Math.max(requestedIndexes.length, previousIndexes.length); index += 1) {
        if (requestedIndexes[index] !== previousIndexes[index]) { changedColumn = index; break; }
      }
      var requestedValues = asArray(this.data.draftValue);
      if (this.data.mode === 'multiple') {
        this.data.columnsData.forEach(function eachColumn(column, columnIndex) {
          var resolved = enabledIndex(column, requestedIndexes[columnIndex], previousIndexes[columnIndex]);
          if (resolved > -1 && column[resolved]) requestedValues[columnIndex] = column[resolved].value;
          requestedIndexes[columnIndex] = resolved > -1 ? resolved : previousIndexes[columnIndex];
        });
      } else {
        requestedValues = requestedValues.slice(0, changedColumn);
        var column = this.data.columnsData[changedColumn] || [];
        var resolvedIndex = enabledIndex(column, requestedIndexes[changedColumn], previousIndexes[changedColumn]);
        if (resolvedIndex > -1 && column[resolvedIndex]) requestedValues.push(column[resolvedIndex].value);
        requestedIndexes = previousIndexes.slice(0, changedColumn).concat(resolvedIndex > -1 ? [resolvedIndex] : []);
      }
      var model = buildModel(this.data.columns, requestedValues, requestedIndexes, normalizeKeys(this.data.keys));
      this._draftDirty = true;
      this._draftValue = model.value.slice();
      this.setData({ columnsData: model.columns, draftIndexes: model.indexes, draftValue: model.value, draftLabel: model.label, mode: model.mode });
      var detail = this.detailFromModel(model, 'picker', { column: changedColumn, index: model.indexes[changedColumn], option: model.options[changedColumn] });
      this.triggerEvent('pick', detail);
      return true;
    },
    confirm: function confirm(source) {
      if (this.data.confirmDisabled) return false;
      var model = buildModel(this.data.columns, this._draftValue, this.data.draftIndexes, normalizeKeys(this.data.keys));
      var origin = source || 'confirm-button';
      this.triggerEvent('confirm', this.detailFromModel(model, origin));
      if (!sameValues(this.data.selectedValue, model.value)) {
        if (!isControlledValue(this.data)) {
          this._innerValue = model.value.slice();
          this._selectedModel = model;
          this.setData({ selectedValue: model.value, selectedLabel: model.label, selectedOptions: model.options });
        }
        this.triggerEvent('change', this.detailFromModel(model, origin));
      }
      this._draftDirty = false;
      if (this.data.autoClose) this.requestVisible(false, origin);
      return true;
    },
    onConfirmTap: function onConfirmTap() { return this.confirm('confirm-button'); },
    cancel: function cancel(source) {
      if (this.data.disabled) return false;
      var model = this._selectedModel || buildModel(this.data.columns, this.committedValue(), [], normalizeKeys(this.data.keys));
      this._draftDirty = false;
      this._draftValue = model.value.slice();
      this.setData({ columnsData: model.columns, draftIndexes: model.indexes, draftValue: model.value, draftLabel: model.label, mode: model.mode });
      this.triggerEvent('cancel', this.detailFromModel(model, source || 'cancel-button'));
      if (this.data.autoClose) this.requestVisible(false, source || 'cancel-button');
      return true;
    },
    onCancelTap: function onCancelTap() { return this.cancel('cancel-button'); },
    reset: function reset() {
      if (this.data.pickerBlocked) return false;
      var model = buildModel(this.data.columns, asArray(this.data.defaultValue), [], normalizeKeys(this.data.keys));
      if (!isControlledValue(this.data)) {
        this._innerValue = model.value.slice();
        this._selectedModel = model;
        this.setData({ selectedValue: model.value, selectedLabel: model.label, selectedOptions: model.options });
      }
      this._draftValue = model.value.slice();
      this._draftDirty = false;
      this.setData({ columnsData: model.columns, draftIndexes: model.indexes, draftValue: model.value, draftLabel: model.label, mode: model.mode });
      this.triggerEvent('change', this.detailFromModel(model, 'reset'));
      return model.value.slice();
    },
    getValue: function getValue() { return asArray(this.data.selectedValue); },
    retry: function retry(source) {
      if (!this.data.error || this.data.disabled) return false;
      this.triggerEvent('retry', { source: source || 'button' });
      return true;
    },
    onRetryTap: function onRetryTap() { return this.retry('button'); },
    noop: function noop() {},
  },
});
