var themeBehavior = require('../common/behaviors/theme');

var WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
var TYPES = ['single', 'range', 'multiple'];
var LOCALE = {
  today: '今天',
  confirm: '确认',
  cancel: '',
  loading: '日历加载中',
  error: '日历加载失败',
  retry: '重试',
  empty: '本月无可选日期',
};

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}
function pad(value) { return String(value).padStart(2, '0'); }
function dayStart(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }
function dateKey(date) { return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()); }
function parseDate(value) {
  if (value === null || value === undefined || value === '') return null;
  var date;
  if (typeof value === 'number') date = isFinite(value) ? new Date(value) : null;
  else {
    var match = String(value).match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (!match) return null;
    date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if (date.getFullYear() !== Number(match[1]) || date.getMonth() !== Number(match[2]) - 1 || date.getDate() !== Number(match[3])) return null;
  }
  return date && !isNaN(date.getTime()) ? dayStart(date) : null;
}
function typeOf(value) { return TYPES.indexOf(value) > -1 ? value : 'single'; }
function normalizeValues(value, type) {
  var source = Array.isArray(value) ? value : (value === null || value === undefined || value === '' ? [] : [value]);
  var seen = {};
  var values = source.map(parseDate).filter(Boolean).map(dateKey).filter(function unique(key) {
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  }).sort();
  if (type === 'range') return values.slice(0, 2);
  if (type === 'multiple') return values;
  return values.slice(0, 1);
}
function valueFor(values, type) { return type === 'single' ? (values[0] || '') : values.slice(); }
function signature(value) { try { return JSON.stringify(value); } catch (error) { return String(value); } }
function dayOrdinal(value) {
  var date = parseDate(value);
  return date ? Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000) : 0;
}
function daysBetween(left, right) { return Math.abs(dayOrdinal(right) - dayOrdinal(left)) + 1; }
function monthIndex(date) { return date.getFullYear() * 12 + date.getMonth(); }
function resolveLocale(value) {
  var source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  var result = {};
  Object.keys(LOCALE).forEach(function each(key) {
    result[key] = source[key] === undefined || source[key] === null ? LOCALE[key] : String(source[key]);
  });
  return result;
}

Component({
  behaviors: [themeBehavior],
  options: { addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    value: { type: null, value: null },
    defaultValue: { type: null, value: null },
    title: { type: String, value: '选择日期' },
    type: { type: String, value: 'single' },
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: true },
    minDate: { type: null, value: null },
    maxDate: { type: null, value: null },
    disabledDates: { type: Array, value: [] },
    disableWeekends: { type: Boolean, value: false },
    firstDayOfWeek: { type: Number, value: 0 },
    switchMode: { type: String, value: 'month' },
    showOutsideDays: { type: Boolean, value: true },
    allowSameDay: { type: Boolean, value: false },
    maxRange: { type: Number, value: 0 },
    maxMultiple: { type: Number, value: 0 },
    localeText: { type: Object, value: {} },
    autoClose: { type: Boolean, value: false },
    usePopup: { type: Boolean, value: false },
    closeOnOverlayClick: { type: Boolean, value: true },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    error: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '日期选择' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    days: [], weekdayNames: [], monthText: '', selectedValues: [],
    rootClass: 'pui-calendar', rootStyle: '', hostClass: 'pui-calendar-host',
    currentVisible: true, mounted: true, active: true, stateType: 'content',
    previousDisabled: false, nextDisabled: false, selectableCount: 0,
    semanticLabel: '日期选择', resolvedType: 'single', locale: LOCALE,
  },
  observers: {
    'value,title,type,visible,minDate,maxDate,disabledDates,disableWeekends,firstDayOfWeek,switchMode,showOutsideDays,allowSameDay,maxRange,maxMultiple,localeText,autoClose,usePopup,closeOnOverlayClick,disabled,readonly,loading,error,ariaLabel,reduceMotion,colorScheme': function sync() { this.syncState(); },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._innerValues = normalizeValues(this.data.defaultValue, typeOf(this.data.type));
      this._lastControlledValues = [];
      this._valueWasControlled = false;
      this._innerVisible = Boolean(this.data.defaultVisible);
      this._lastControlledVisible = this._innerVisible;
      this._visibleWasControlled = false;
      this.syncState();
    },
    detached: function detached() { this._ready = false; clearTimeout(this._visibilityTimer); },
  },
  methods: {
    bounds: function bounds() {
      var min = parseDate(this.data.minDate);
      var max = parseDate(this.data.maxDate);
      if (min && max && min > max) { var swap = min; min = max; max = swap; }
      return { min: min, max: max };
    },
    syncState: function syncState() {
      if (!this._ready) return;
      var type = typeOf(this.data.type);
      var controlled = this.data.value !== null && this.data.value !== undefined;
      var values;
      if (controlled) {
        values = normalizeValues(this.data.value, type);
        this._lastControlledValues = values.slice();
      } else if (this._valueWasControlled) {
        values = normalizeValues(this._lastControlledValues, type);
        this._innerValues = values.slice();
      } else {
        values = normalizeValues(this._innerValues, type);
        this._innerValues = values.slice();
      }
      this._valueWasControlled = controlled;
      var bounds = this.bounds();
      values = values.filter(function filter(key) {
        var date = parseDate(key);
        return (!bounds.min || date >= bounds.min) && (!bounds.max || date <= bounds.max);
      });
      if (!controlled) this._innerValues = values.slice();

      var valueSignature = signature(values);
      var anchor = parseDate(values[0]) || bounds.min || new Date();
      if (!this._month || this._lastType !== type || (controlled && this._controlledValueSignature !== valueSignature)) {
        this._month = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
      }
      this._controlledValueSignature = controlled ? valueSignature : '';
      if (bounds.min && monthIndex(this._month) < monthIndex(bounds.min)) this._month = new Date(bounds.min.getFullYear(), bounds.min.getMonth(), 1);
      if (bounds.max && monthIndex(this._month) > monthIndex(bounds.max)) this._month = new Date(bounds.max.getFullYear(), bounds.max.getMonth(), 1);
      this._lastType = type;

      var visibleControlled = this.data.visible !== null && this.data.visible !== undefined;
      var currentVisible;
      if (visibleControlled) {
        currentVisible = Boolean(this.data.visible);
        this._lastControlledVisible = currentVisible;
      } else if (this._visibleWasControlled) {
        currentVisible = Boolean(this._lastControlledVisible);
        this._innerVisible = currentVisible;
      } else currentVisible = Boolean(this._innerVisible);
      this._visibleWasControlled = visibleControlled;
      var motion = this.data.reduceMotion ? 1 : 500;
      this.setData({
        selectedValues: values,
        resolvedType: type,
        locale: resolveLocale(this.data.localeText),
        rootClass: ['pui-calendar', this.getColorSchemeClass(), this.data.readonly ? 'pui-calendar--readonly' : '', this.data.disabled ? 'pui-calendar--disabled' : '', this.data.reduceMotion ? 'pui-calendar--reduced' : ''].filter(Boolean).join(' '),
        rootStyle: '--pui-calendar-duration:' + motion + 'ms;',
        hostClass: ['pui-calendar-host', this.data.usePopup ? 'pui-calendar-host--popup' : 'pui-calendar-host--inline', currentVisible ? 'pui-calendar-host--visible' : 'pui-calendar-host--hidden'].join(' '),
        semanticLabel: String(this.data.ariaLabel || this.data.title || '日期选择'),
        currentVisible: currentVisible,
      });
      this.syncVisibility(currentVisible, motion);
      this.renderMonth();
    },
    syncVisibility: function syncVisibility(visible, duration) {
      var self = this;
      clearTimeout(this._visibilityTimer);
      if (visible) {
        if (!this.data.mounted) this.setData({ mounted: true, active: false }, function enter() {
          setTimeout(function activate() { if (self._ready && self.data.currentVisible) self.setData({ active: true }); }, 16);
        });
        else if (!this.data.active) this.setData({ active: true });
        return;
      }
      if (!this.data.mounted) return;
      this.setData({ active: false });
      this._visibilityTimer = setTimeout(function unmount() {
        if (self._ready && !self.data.currentVisible) self.setData({ mounted: false });
      }, duration);
    },
    renderMonth: function renderMonth() {
      var month = this._month || new Date();
      var firstIndex = Math.round(clamp(this.data.firstDayOfWeek, 0, 6, 0));
      var first = new Date(month.getFullYear(), month.getMonth(), 1);
      var startOffset = (first.getDay() - firstIndex + 7) % 7;
      var gridStart = new Date(month.getFullYear(), month.getMonth(), 1 - startOffset);
      var bounds = this.bounds();
      var disabledSet = {};
      (Array.isArray(this.data.disabledDates) ? this.data.disabledDates : []).forEach(function each(value) {
        var date = parseDate(value);
        if (date) disabledSet[dateKey(date)] = true;
      });
      var selected = this.data.selectedValues || [];
      var self = this;
      var selectableCount = 0;
      var todayKey = dateKey(new Date());
      var days = Array.from({ length: 42 }, function map(_, index) {
        var date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
        var key = dateKey(date);
        var current = date.getMonth() === month.getMonth();
        var visible = self.data.showOutsideDays || current;
        var disabled = !visible || Boolean((bounds.min && date < bounds.min) || (bounds.max && date > bounds.max) || disabledSet[key] || (self.data.disableWeekends && (date.getDay() === 0 || date.getDay() === 6)));
        if (!disabled) selectableCount += 1;
        return {
          key: key,
          label: visible ? date.getDate() : '',
          current: current,
          disabled: disabled,
          selected: selected.indexOf(key) > -1,
          between: selected.length === 2 && key > selected[0] && key < selected[1],
          start: selected[0] === key,
          end: selected[selected.length - 1] === key,
          today: key === todayKey,
          ariaLabel: key + (disabled ? ' 不可选择' : selected.indexOf(key) > -1 ? ' 已选择' : ''),
        };
      });
      var step = this.data.switchMode === 'year' ? 12 : 1;
      var previousMonth = new Date(month.getFullYear(), month.getMonth() - step, 1);
      var nextMonth = new Date(month.getFullYear(), month.getMonth() + step, 1);
      var stateType = this.data.error ? 'error' : this.data.loading ? 'loading' : selectableCount ? 'content' : 'empty';
      this.setData({
        days: days,
        weekdayNames: WEEKDAYS.slice(firstIndex).concat(WEEKDAYS.slice(0, firstIndex)),
        monthText: month.getFullYear() + ' 年 ' + (month.getMonth() + 1) + ' 月',
        selectableCount: selectableCount,
        stateType: stateType,
        previousDisabled: Boolean(this.data.disabled || (bounds.min && monthIndex(previousMonth) < monthIndex(bounds.min))),
        nextDisabled: Boolean(this.data.disabled || (bounds.max && monthIndex(nextMonth) > monthIndex(bounds.max))),
      });
    },
    changeMonth: function changeMonth(delta, source) {
      if (this.data.disabled || this.data.loading || this.data.error) return false;
      var step = this.data.switchMode === 'year' ? 12 : 1;
      var next = new Date(this._month.getFullYear(), this._month.getMonth() + delta * step, 1);
      var bounds = this.bounds();
      if ((bounds.min && monthIndex(next) < monthIndex(bounds.min)) || (bounds.max && monthIndex(next) > monthIndex(bounds.max))) return false;
      this._month = next;
      this.renderMonth();
      this.triggerEvent('panel-change', { month: dateKey(next), year: next.getFullYear(), monthIndex: next.getMonth(), source: source || 'navigation' });
      return true;
    },
    onPrevious: function onPrevious() { return this.changeMonth(-1, 'previous'); },
    onNext: function onNext() { return this.changeMonth(1, 'next'); },
    commitValues: function commitValues(next, source, day) {
      var type = this.data.resolvedType;
      var controlled = this.data.value !== null && this.data.value !== undefined;
      if (!controlled) {
        this._innerValues = next.slice();
        this.setData({ selectedValues: next.slice() });
        this.renderMonth();
      }
      var detail = { value: valueFor(next, type), values: next.slice(), date: day ? day.key : '', source: source };
      this.triggerEvent('change', detail);
      if (this.data.autoClose && (type === 'single' || (type === 'range' && next.length === 2))) this.requestVisible(false, 'select');
      return true;
    },
    onDateTap: function onDateTap(event) {
      if (this.data.disabled || this.data.readonly || this.data.loading || this.data.error) return false;
      var day = this.data.days[Math.trunc(Number(event.currentTarget.dataset.index))];
      if (!day || day.disabled || !day.label) return false;
      var next = (this.data.selectedValues || []).slice();
      var type = this.data.resolvedType;
      if (type === 'range') {
        if (!next.length || next.length === 2) next = [day.key];
        else {
          next = [next[0], day.key].sort();
          if (!this.data.allowSameDay && next[0] === next[1]) next = [day.key];
          var maxRange = Math.round(clamp(this.data.maxRange, 0, 3660, 0));
          if (maxRange && next.length === 2 && daysBetween(next[0], next[1]) > maxRange) {
            this.triggerEvent('limit', { type: 'range', max: maxRange, value: next.slice(), source: 'date' });
            return false;
          }
        }
      } else if (type === 'multiple') {
        var position = next.indexOf(day.key);
        if (position > -1) next.splice(position, 1);
        else {
          var maxMultiple = Math.round(clamp(this.data.maxMultiple, 0, 366, 0));
          if (maxMultiple && next.length >= maxMultiple) {
            this.triggerEvent('limit', { type: 'multiple', max: maxMultiple, value: next.slice(), source: 'date' });
            return false;
          }
          next.push(day.key);
          next.sort();
        }
      } else next = [day.key];
      if (!day.current) {
        var outside = parseDate(day.key);
        this._month = new Date(outside.getFullYear(), outside.getMonth(), 1);
      }
      return this.commitValues(next, 'date', day);
    },
    requestVisible: function requestVisible(visible, source) {
      if (this.data.disabled) return false;
      var controlled = this.data.visible !== null && this.data.visible !== undefined;
      if (!controlled) this._innerVisible = Boolean(visible);
      this.triggerEvent('visible-change', { visible: Boolean(visible), source: source || 'component' });
      if (!controlled) this.syncState();
      return true;
    },
    onOverlayTap: function onOverlayTap() {
      if (this.data.usePopup && this.data.closeOnOverlayClick) return this.requestVisible(false, 'overlay');
      return false;
    },
    onConfirm: function onConfirm() {
      if (this.data.disabled || this.data.loading || this.data.error) return false;
      var detail = { value: valueFor(this.data.selectedValues || [], this.data.resolvedType), values: (this.data.selectedValues || []).slice(), source: 'button' };
      this.triggerEvent('confirm', detail);
      if (this.data.autoClose) this.requestVisible(false, 'confirm');
      return true;
    },
    onCancel: function onCancel() {
      if (this.data.disabled) return false;
      this.triggerEvent('cancel', { source: 'button' });
      return this.requestVisible(false, 'cancel');
    },
    onToday: function onToday() {
      if (this.data.disabled || this.data.loading || this.data.error) return false;
      var today = new Date();
      var target = new Date(today.getFullYear(), today.getMonth(), 1);
      var bounds = this.bounds();
      if ((bounds.min && monthIndex(target) < monthIndex(bounds.min)) || (bounds.max && monthIndex(target) > monthIndex(bounds.max))) return false;
      this._month = target;
      this.renderMonth();
      this.triggerEvent('panel-change', { month: dateKey(target), year: target.getFullYear(), monthIndex: target.getMonth(), source: 'today' });
      return true;
    },
    onRetry: function onRetry() {
      if (!this.data.error || this.data.disabled) return false;
      this.triggerEvent('retry', { source: 'button', month: dateKey(this._month) });
      return true;
    },
  },
});
