var themeBehavior = require('../common/behaviors/theme');

var DATE_UNITS = ['year', 'month', 'date'];
var TIME_UNITS = ['hour', 'minute', 'second'];
var ALL_UNITS = DATE_UNITS.concat(TIME_UNITS);
var WEEK_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

function hasValue(value) { return value !== null && value !== undefined; }
function safeText(value, fallback) {
  if (value === null || value === undefined) return fallback === undefined ? '' : fallback;
  return String(value);
}
function pad(value) { return String(Math.max(0, Math.floor(Number(value) || 0))).padStart(2, '0'); }
function finiteNumber(value, fallback) {
  var number = Number(value);
  return isFinite(number) ? number : fallback;
}
function cloneParts(parts) {
  return { year: parts.year, month: parts.month, date: parts.date, hour: parts.hour, minute: parts.minute, second: parts.second };
}
function partsFromDate(date) {
  return { year: date.getFullYear(), month: date.getMonth() + 1, date: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };
}
function daysInMonth(year, month) { return new Date(year, month, 0).getDate(); }
function normalizeParts(parts) {
  var result = cloneParts(parts);
  result.month = Math.max(1, Math.min(12, Math.round(result.month)));
  result.date = Math.max(1, Math.min(daysInMonth(result.year, result.month), Math.round(result.date)));
  result.hour = Math.max(0, Math.min(23, Math.round(result.hour)));
  result.minute = Math.max(0, Math.min(59, Math.round(result.minute)));
  result.second = Math.max(0, Math.min(59, Math.round(result.second)));
  return result;
}
function timestampFromParts(parts) {
  var value = normalizeParts(parts);
  return new Date(value.year, value.month - 1, value.date, value.hour, value.minute, value.second, 0).getTime();
}
function parseInput(value, fallbackTimestamp, timeOnly) {
  if (value instanceof Date && !isNaN(value.getTime())) return value.getTime();
  if (typeof value === 'number' && isFinite(value)) return value;
  var text = safeText(value).trim();
  if (!text) return fallbackTimestamp;
  var dateTime = text.match(/^([0-9]{4})[-\/]([0-9]{1,2})(?:[-\/]([0-9]{1,2}))?(?:[T\s]+([0-9]{1,2})(?::([0-9]{1,2}))?(?::([0-9]{1,2}))?)?$/);
  if (dateTime) {
    var candidate = {
      year: Number(dateTime[1]), month: Number(dateTime[2]), date: Number(dateTime[3] || 1),
      hour: Number(dateTime[4] || 0), minute: Number(dateTime[5] || 0), second: Number(dateTime[6] || 0),
    };
    var normalized = normalizeParts(candidate);
    if (normalized.year === candidate.year && normalized.month === candidate.month && normalized.date === candidate.date && normalized.hour === candidate.hour && normalized.minute === candidate.minute && normalized.second === candidate.second) return timestampFromParts(normalized);
  }
  var time = text.match(/^([0-9]{1,2})(?::([0-9]{1,2}))?(?::([0-9]{1,2}))?$/);
  if (time && timeOnly) {
    var base = partsFromDate(new Date(fallbackTimestamp));
    var timeParts = Object.assign(base, { hour: Number(time[1]), minute: Number(time[2] || 0), second: Number(time[3] || 0) });
    var normalizedTime = normalizeParts(timeParts);
    if (normalizedTime.hour === Number(time[1]) && normalizedTime.minute === Number(time[2] || 0) && normalizedTime.second === Number(time[3] || 0)) return timestampFromParts(normalizedTime);
  }
  return fallbackTimestamp;
}
function unitsForMode(mode) {
  if (Array.isArray(mode)) {
    if (mode.length === 1) return unitsForMode(mode[0]);
    var dateUnit = DATE_UNITS.indexOf(mode[0]) > -1 ? mode[0] : 'date';
    var timeUnit = TIME_UNITS.indexOf(mode[1]) > -1 ? mode[1] : 'minute';
    return DATE_UNITS.slice(0, DATE_UNITS.indexOf(dateUnit) + 1).concat(TIME_UNITS.slice(0, TIME_UNITS.indexOf(timeUnit) + 1));
  }
  var value = safeText(mode, 'date').trim();
  if (value === 'datetime') return DATE_UNITS.concat(TIME_UNITS.slice(0, 2));
  if (value === 'time') return TIME_UNITS.slice(0, 2);
  var dateIndex = DATE_UNITS.indexOf(value);
  if (dateIndex > -1) return DATE_UNITS.slice(0, dateIndex + 1);
  var timeIndex = TIME_UNITS.indexOf(value);
  if (timeIndex > -1) return TIME_UNITS.slice(0, timeIndex + 1);
  return DATE_UNITS.slice();
}
function modeValue(mode, units) {
  if (safeText(mode) === 'datetime') return ['date', 'minute'];
  if (safeText(mode) === 'time') return 'minute';
  if (Array.isArray(mode)) {
    var dateUnits = units.filter(function filterDate(unit) { return DATE_UNITS.indexOf(unit) > -1; });
    var timeUnits = units.filter(function filterTime(unit) { return TIME_UNITS.indexOf(unit) > -1; });
    if (dateUnits.length && timeUnits.length) return [dateUnits[dateUnits.length - 1], timeUnits[timeUnits.length - 1]];
    return (dateUnits.length ? dateUnits : timeUnits).slice(-1)[0] || 'date';
  }
  return safeText(mode, 'date') || 'date';
}
function isTimeOnly(units) { return units.length > 0 && TIME_UNITS.indexOf(units[0]) > -1; }
function defaultBounds(nowTimestamp, units) {
  if (isTimeOnly(units)) {
    var base = partsFromDate(new Date(nowTimestamp));
    return {
      start: timestampFromParts(Object.assign(base, { hour: 0, minute: 0, second: 0 })),
      end: timestampFromParts(Object.assign(base, { hour: 23, minute: 59, second: 59 })),
    };
  }
  var start = new Date(nowTimestamp);
  var end = new Date(nowTimestamp);
  start.setFullYear(start.getFullYear() - 10);
  end.setFullYear(end.getFullYear() + 10);
  return { start: start.getTime(), end: end.getTime() };
}
function resolveBounds(start, end, units, nowTimestamp) {
  var defaults = defaultBounds(nowTimestamp, units);
  var lower = parseInput(start, defaults.start, isTimeOnly(units));
  var upper = parseInput(end, defaults.end, isTimeOnly(units));
  return lower <= upper ? { start: lower, end: upper } : { start: upper, end: lower };
}
function clipTimestamp(value, bounds) { return Math.min(bounds.end, Math.max(bounds.start, value)); }
function unitStep(steps, unit) {
  var source = steps && typeof steps === 'object' && !Array.isArray(steps) ? steps : {};
  var value = Math.round(finiteNumber(source[unit], 1));
  return Math.max(1, value);
}
function samePrefix(parts, edge, unit) {
  var index = ALL_UNITS.indexOf(unit);
  for (var cursor = 0; cursor < index; cursor += 1) if (parts[ALL_UNITS[cursor]] !== edge[ALL_UNITS[cursor]]) return false;
  return true;
}
function rangeForUnit(unit, parts, startParts, endParts) {
  var natural = { year: [startParts.year, endParts.year], month: [1, 12], date: [1, daysInMonth(parts.year, parts.month)], hour: [0, 23], minute: [0, 59], second: [0, 59] }[unit];
  var min = samePrefix(parts, startParts, unit) ? startParts[unit] : natural[0];
  var max = samePrefix(parts, endParts, unit) ? endParts[unit] : natural[1];
  return [Math.max(natural[0], min), Math.min(natural[1], max)];
}
function valuesInRange(min, max, step) {
  var values = [];
  for (var value = min; value <= max; value += step) values.push(value);
  if (!values.length || values[values.length - 1] !== max) values.push(max);
  return values;
}
function closestValue(values, target) {
  var result = values[0];
  values.forEach(function compare(value) { if (Math.abs(value - target) < Math.abs(result - target)) result = value; });
  return result;
}
function optionLabel(unit, value, parts, showWeek) {
  if (unit === 'year') return value + '年';
  if (unit === 'month') return value + '月';
  if (unit === 'date') {
    var suffix = showWeek ? ' 周' + WEEK_LABELS[new Date(parts.year, parts.month - 1, value).getDay()] : '';
    return value + '日' + suffix;
  }
  return pad(value) + ({ hour: '时', minute: '分', second: '秒' }[unit] || '');
}
function buildColumns(timestamp, bounds, units, steps, showWeek) {
  var parts = partsFromDate(new Date(clipTimestamp(timestamp, bounds)));
  var startParts = partsFromDate(new Date(bounds.start));
  var endParts = partsFromDate(new Date(bounds.end));
  var columns = [];
  var values = [];
  units.forEach(function eachUnit(unit) {
    var range = rangeForUnit(unit, parts, startParts, endParts);
    var available = valuesInRange(range[0], range[1], unitStep(steps, unit));
    parts[unit] = closestValue(available, parts[unit]);
    if (unit === 'month') parts.date = Math.min(parts.date, daysInMonth(parts.year, parts.month));
    columns.push(available.map(function makeOption(value) { return { label: optionLabel(unit, value, parts, showWeek), value: value }; }));
    values.push(parts[unit]);
  });
  var resolvedTimestamp = clipTimestamp(timestampFromParts(parts), bounds);
  return { columns: columns, value: values, parts: partsFromDate(new Date(resolvedTimestamp)), timestamp: resolvedTimestamp };
}
function partsFromValues(values, units, baseParts) {
  var parts = cloneParts(baseParts);
  units.forEach(function applyValue(unit, index) {
    if (index < values.length && isFinite(Number(values[index]))) parts[unit] = Number(values[index]);
  });
  return normalizeParts(parts);
}
function autoFormat(units) {
  var lastDate = -1;
  var lastTime = -1;
  units.forEach(function findUnit(unit) {
    if (DATE_UNITS.indexOf(unit) > -1) lastDate = Math.max(lastDate, DATE_UNITS.indexOf(unit));
    if (TIME_UNITS.indexOf(unit) > -1) lastTime = Math.max(lastTime, TIME_UNITS.indexOf(unit));
  });
  var date = lastDate < 0 ? '' : ['YYYY', 'YYYY-MM', 'YYYY-MM-DD'][lastDate];
  var time = lastTime < 0 ? '' : ['HH', 'HH:mm', 'HH:mm:ss'][lastTime];
  return [date, time].filter(Boolean).join(' ');
}
function formatParts(parts, pattern, units) {
  var template = safeText(pattern).trim() || autoFormat(units);
  var tokens = { YYYY: String(parts.year).padStart(4, '0'), MM: pad(parts.month), DD: pad(parts.date), HH: pad(parts.hour), mm: pad(parts.minute), ss: pad(parts.second) };
  return template.replace(/YYYY|MM|DD|HH|mm|ss/g, function replace(token) { return tokens[token]; });
}

Component({
  behaviors: [themeBehavior],
  options: { addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: false },
    mode: { type: null, value: 'date' },
    start: { type: null, value: null },
    end: { type: null, value: null },
    format: { type: String, value: '' },
    steps: { type: Object, value: {} },
    showWeek: { type: Boolean, value: false },
    title: { type: String, value: '' },
    type: { type: String, value: 'default' },
    cancelText: { type: String, value: '取消' },
    confirmText: { type: String, value: '确定' },
    showHeader: { type: Boolean, value: true },
    usePopup: { type: Boolean, value: true },
    autoClose: { type: Boolean, value: true },
    closeOnOverlayClick: { type: Boolean, value: true },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '日期时间选择器' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    pickerColumns: [],
    pickerValue: [],
    currentVisible: false,
    semanticLabel: '日期时间选择器',
  },
  observers: {
    'value,defaultValue,visible,defaultVisible,mode,start,end,format,steps,showWeek,title,type,usePopup,disabled,readonly,ariaLabel,reduceMotion,colorScheme': function observeAll() { this.syncState(); },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._valueInitialized = false;
      this._visibleInitialized = false;
      this._wasControlled = false;
      this._draftDirty = false;
      this.syncState();
    },
    detached: function detached() { this._ready = false; },
  },
  methods: {
    isControlledValue: function isControlledValue() { return hasValue(this.data.value); },
    isControlledVisible: function isControlledVisible() { return hasValue(this.data.visible); },
    context: function context() {
      var now = Date.now();
      var units = unitsForMode(this.data.mode);
      var bounds = resolveBounds(this.data.start, this.data.end, units, now);
      return { now: now, units: units, bounds: bounds };
    },
    resolveCommittedTimestamp: function resolveCommittedTimestamp(context) {
      var controlled = this.isControlledValue();
      var source;
      if (controlled) source = this.data.value;
      else if (!this._valueInitialized) {
        source = this.data.defaultValue;
        this._valueInitialized = true;
      } else if (this._wasControlled) source = this._lastRenderedTimestamp;
      else return clipTimestamp(this._innerTimestamp, context.bounds);
      var fallback = clipTimestamp(context.now, context.bounds);
      var timestamp = clipTimestamp(parseInput(source, fallback, isTimeOnly(context.units)), context.bounds);
      if (!controlled) this._innerTimestamp = timestamp;
      this._wasControlled = controlled;
      this._lastRenderedTimestamp = timestamp;
      return timestamp;
    },
    resolveVisible: function resolveVisible() {
      if (!this.data.usePopup) return true;
      if (this.isControlledVisible()) return Boolean(this.data.visible);
      if (!this._visibleInitialized) {
        this._innerVisible = Boolean(this.data.defaultVisible);
        this._visibleInitialized = true;
      }
      return Boolean(this._innerVisible);
    },
    syncState: function syncState() {
      if (!this._ready) return;
      var context = this.context();
      var committed = this.resolveCommittedTimestamp(context);
      var visible = this.resolveVisible();
      this._context = context;
      var committedModel = buildColumns(committed, context.bounds, context.units, this.data.steps, this.data.showWeek);
      committed = committedModel.timestamp;
      this._committedTimestamp = committed;
      this._lastRenderedTimestamp = committed;
      if (!this.isControlledValue()) this._innerTimestamp = committed;
      if (!visible || !this._draftDirty) this._draftTimestamp = committed;
      var model = buildColumns(this._draftTimestamp, context.bounds, context.units, this.data.steps, this.data.showWeek);
      this._draftTimestamp = model.timestamp;
      this.setData({
        pickerColumns: model.columns,
        pickerValue: model.value,
        currentVisible: visible,
        semanticLabel: safeText(this.data.ariaLabel || this.data.title || '日期时间选择器').trim() || '日期时间选择器',
      });
    },
    modelFromValues: function modelFromValues(values) {
      var context = this._context || this.context();
      var base = partsFromDate(new Date(this._draftTimestamp || this._committedTimestamp || context.now));
      var timestamp = timestampFromParts(partsFromValues(Array.isArray(values) ? values : [], context.units, base));
      return buildColumns(timestamp, context.bounds, context.units, this.data.steps, this.data.showWeek);
    },
    detailFor: function detailFor(timestamp, source, extra) {
      var context = this._context || this.context();
      var parts = partsFromDate(new Date(timestamp));
      return Object.assign({
        value: formatParts(parts, this.data.format, context.units),
        timestamp: timestamp,
        parts: parts,
        mode: modeValue(this.data.mode, context.units),
        source: source || 'programmatic',
        controlled: this.isControlledValue(),
      }, extra || {});
    },
    onPickerPick: function onPickerPick(event) {
      if (this.data.disabled || this.data.readonly) return false;
      var model = this.modelFromValues(event && event.detail ? event.detail.value : []);
      this._draftDirty = true;
      this._draftTimestamp = model.timestamp;
      this.setData({ pickerColumns: model.columns, pickerValue: model.value });
      var column = event && event.detail ? Number(event.detail.column) || 0 : 0;
      this.triggerEvent('pick', this.detailFor(model.timestamp, event && event.detail ? event.detail.source : 'picker', { column: column, unit: (this._context || this.context()).units[column] || '', index: event && event.detail ? event.detail.index : -1 }));
      return true;
    },
    onPickerConfirm: function onPickerConfirm(event) {
      if (this.data.disabled || this.data.readonly) return false;
      var model = this.modelFromValues(event && event.detail ? event.detail.value : this.data.pickerValue);
      var source = event && event.detail ? event.detail.source : 'confirm-button';
      var detail = this.detailFor(model.timestamp, source);
      this.triggerEvent('confirm', detail);
      if (model.timestamp !== this._committedTimestamp) {
        if (!this.isControlledValue()) {
          this._innerTimestamp = model.timestamp;
          this._committedTimestamp = model.timestamp;
          this._lastRenderedTimestamp = model.timestamp;
        }
        this.triggerEvent('change', detail);
      }
      this._draftDirty = false;
      this._draftTimestamp = this.isControlledValue() ? this._committedTimestamp : model.timestamp;
      var displayModel = buildColumns(this._draftTimestamp, (this._context || this.context()).bounds, (this._context || this.context()).units, this.data.steps, this.data.showWeek);
      this.setData({ pickerColumns: displayModel.columns, pickerValue: displayModel.value });
      return true;
    },
    onPickerChange: function onPickerChange() { return true; },
    onPickerCancel: function onPickerCancel(event) {
      var context = this._context || this.context();
      var model = buildColumns(this._committedTimestamp, context.bounds, context.units, this.data.steps, this.data.showWeek);
      this._draftDirty = false;
      this._draftTimestamp = this._committedTimestamp;
      this.setData({ pickerColumns: model.columns, pickerValue: model.value });
      this.triggerEvent('cancel', this.detailFor(this._committedTimestamp, event && event.detail ? event.detail.source : 'cancel-button'));
      return true;
    },
    onPickerVisibleChange: function onPickerVisibleChange(event) {
      var detail = event && event.detail ? event.detail : { visible: false, source: 'programmatic' };
      if (!this.isControlledVisible()) {
        this._innerVisible = Boolean(detail.visible);
        this.setData({ currentVisible: Boolean(detail.visible) });
      }
      if (detail.visible) {
        this._draftDirty = false;
        this._draftTimestamp = this._committedTimestamp;
        this.syncState();
      } else {
        var context = this._context || this.context();
        var model = buildColumns(this._committedTimestamp, context.bounds, context.units, this.data.steps, this.data.showWeek);
        this._draftDirty = false;
        this._draftTimestamp = this._committedTimestamp;
        this.setData({ pickerColumns: model.columns, pickerValue: model.value });
      }
      this.triggerEvent('visible-change', { visible: Boolean(detail.visible), source: detail.source || 'programmatic', controlled: this.isControlledVisible() });
    },
    onPickerOpen: function onPickerOpen(event) {
      this.triggerEvent('open', { visible: true, source: event && event.detail ? event.detail.source : 'programmatic', controlled: this.isControlledVisible() });
    },
    onPickerClose: function onPickerClose(event) {
      this.triggerEvent('close', { visible: false, source: event && event.detail ? event.detail.source : 'programmatic', controlled: this.isControlledVisible() });
    },
    picker: function picker() { return this.selectComponent('#dateTimePickerCore'); },
    open: function open() {
      if (this.data.disabled || this.data.readonly || !this.data.usePopup) return false;
      var picker = this.picker();
      return picker ? picker.open() : false;
    },
    close: function close(source) {
      if (!this.data.usePopup) return false;
      var picker = this.picker();
      return picker ? picker.close(typeof source === 'string' ? source : 'programmatic') : false;
    },
    confirm: function confirm(source) {
      if (this.data.disabled || this.data.readonly) return false;
      var picker = this.picker();
      return picker ? picker.confirm(typeof source === 'string' ? source : 'programmatic') : false;
    },
    cancel: function cancel(source) {
      if (this.data.disabled) return false;
      var picker = this.picker();
      return picker ? picker.cancel(typeof source === 'string' ? source : 'programmatic') : false;
    },
    reset: function reset() {
      if (this.data.disabled || this.data.readonly) return false;
      var context = this._context || this.context();
      var fallback = clipTimestamp(context.now, context.bounds);
      var timestamp = clipTimestamp(parseInput(this.data.defaultValue, fallback, isTimeOnly(context.units)), context.bounds);
      var model = buildColumns(timestamp, context.bounds, context.units, this.data.steps, this.data.showWeek);
      var detail = this.detailFor(model.timestamp, 'reset');
      if (!this.isControlledValue()) {
        this._innerTimestamp = model.timestamp;
        this._committedTimestamp = model.timestamp;
        this._lastRenderedTimestamp = model.timestamp;
      }
      this._draftTimestamp = this.isControlledValue() ? this._committedTimestamp : model.timestamp;
      this._draftDirty = false;
      var displayModel = buildColumns(this._draftTimestamp, context.bounds, context.units, this.data.steps, this.data.showWeek);
      this.setData({ pickerColumns: displayModel.columns, pickerValue: displayModel.value });
      this.triggerEvent('change', detail);
      return detail;
    },
    getValue: function getValue() { return this.detailFor(this._committedTimestamp, 'get-value'); },
  },
});
