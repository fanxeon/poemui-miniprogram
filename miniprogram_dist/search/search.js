var themeBehavior = require('../common/behaviors/theme');

function hasValue(value) { return value !== null && value !== undefined; }
function textValue(value) { return hasValue(value) ? String(value) : ''; }
function normalizeEnum(value, values, fallback) { return values.indexOf(value) > -1 ? value : fallback; }
function normalizeLimit(value, maximum) {
  var next = Math.floor(Number(value));
  if (!isFinite(next) || next < 0) return -1;
  return Math.min(maximum, next);
}
function textParts(value) {
  var text = textValue(value);
  var output = [];
  var index = 0;
  while (index < text.length) {
    var first = text.charCodeAt(index);
    if (first >= 0xD800 && first <= 0xDBFF && index + 1 < text.length) {
      var second = text.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        output.push(text.slice(index, index + 2));
        index += 2;
        continue;
      }
    }
    output.push(text.charAt(index));
    index += 1;
  }
  return output;
}
function characterWeight(character) { return /^[\x00-\x7F]$/.test(character) ? 1 : 2; }
function cancelTextWidthClass(value) {
  var units = textParts(value || '取消').reduce(function sum(total, character) {
    if (/^\s$/.test(character)) return total + 0.35;
    return total + (/^[\x00-\x7F]$/.test(character) ? 0.55 : 1);
  }, 0);
  if (units <= 2.25) return 'compact';
  if (units <= 3.5) return 'regular';
  if (units <= 5.5) return 'wide';
  return 'xwide';
}
function normalizeText(value, maxlength, maxcharacter) {
  var parts = textParts(value);
  if (maxcharacter >= 0) {
    var weighted = [];
    var count = 0;
    parts.some(function append(character) {
      var weight = characterWeight(character);
      if (count + weight > maxcharacter) return true;
      weighted.push(character);
      count += weight;
      return false;
    });
    return weighted.join('');
  }
  return maxlength >= 0 ? parts.slice(0, maxlength).join('') : parts.join('');
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    value: { type: null, value: null },
    defaultValue: { type: null, value: '' },
    placeholder: { type: String, value: '搜索' },
    clearable: { type: Boolean, value: true },
    clearTrigger: { type: String, value: 'always' },
    showCancel: { type: Boolean, value: false },
    cancelText: { type: String, value: '取消' },
    shape: { type: String, value: 'square' },
    center: { type: Boolean, value: false },
    maxlength: { type: Number, value: -1 },
    maxcharacter: { type: Number, value: -1 },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    focus: { type: Boolean, value: false },
    confirmType: { type: String, value: 'search' },
    ariaLabel: { type: String, value: '搜索' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    innerValue: '',
    focused: false,
    rootClass: '',
    rootStyle: '',
    confirmTypeValue: 'search',
    semanticLabel: '搜索',
    normalizedShape: 'square',
    inputStyle: 'display:flex;flex:1;min-width:0;width:100%;--pui-input-field-radius:var(--pui-radius-medium);',
    nativeMaxlength: -1,
    normalizedMaxcharacter: -1,
    normalizedClearTrigger: 'always',
    cancelHostClass: 'pui-search__cancel-host pui-search__cancel-host--compact',
    showClear: false
  },
  observers: {
    'value,defaultValue,placeholder,clearable,clearTrigger,showCancel,cancelText,shape,center,maxlength,maxcharacter,disabled,readonly,focus,confirmType,ariaLabel,reduceMotion,colorScheme': function sync() { this.syncState(); }
  },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    isControlled: function isControlled() { return hasValue(this.data.value); },
    limits: function limits() {
      return {
        maxlength: normalizeLimit(this.data.maxlength, 10000),
        maxcharacter: normalizeLimit(this.data.maxcharacter, 20000)
      };
    },
    syncState: function syncState() {
      var controlled = this.isControlled();
      var limits = this.limits();
      var value = this.data.innerValue;
      if (controlled) {
        value = normalizeText(this.data.value, limits.maxlength, limits.maxcharacter);
        this._lastControlledValue = value;
      } else if (!this._initialized) {
        value = normalizeText(this.data.defaultValue, limits.maxlength, limits.maxcharacter);
      } else if (this._wasControlled) {
        value = textValue(this._lastControlledValue);
      } else {
        value = normalizeText(value, limits.maxlength, limits.maxcharacter);
      }
      this._initialized = true;
      this._wasControlled = controlled;

      var shape = normalizeEnum(this.data.shape, ['square', 'round'], 'square');
      var clearTrigger = normalizeEnum(this.data.clearTrigger, ['always', 'focus'], 'always');
      var confirmType = normalizeEnum(this.data.confirmType, ['done', 'go', 'next', 'search', 'send'], 'search');
      var interactive = !(this.data.disabled || this.data.readonly);
      var focused = !!(this.data.focused || this.data.focus);
      var semanticLabel = (this.data.ariaLabel || this.data.placeholder || '搜索').trim() || '搜索';
      this.setData({
        innerValue: value,
        rootClass: [
          'pui-search',
          this.getColorSchemeClass(),
          'pui-search--' + shape,
          this.data.center ? 'pui-search--center' : '',
          this.data.disabled ? 'pui-search--disabled' : '',
          this.data.readonly ? 'pui-search--readonly' : '',
          focused ? 'pui-search--focus' : '',
          this.data.reduceMotion ? 'pui-search--reduced' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-search-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;--pui-search-ease:var(--pui-ease-standard);',
        confirmTypeValue: confirmType,
        semanticLabel: semanticLabel,
        normalizedShape: shape,
        inputStyle: 'display:flex;flex:1;min-width:0;width:100%;--pui-input-field-radius:' + (shape === 'round' ? 'var(--pui-radius-round)' : 'var(--pui-radius-medium)') + ';',
        nativeMaxlength: limits.maxcharacter >= 0 ? -1 : limits.maxlength,
        normalizedMaxcharacter: limits.maxcharacter,
        normalizedClearTrigger: clearTrigger,
        cancelHostClass: 'pui-search__cancel-host pui-search__cancel-host--' + cancelTextWidthClass(this.data.cancelText),
        showClear: !!(this.data.clearable && value && interactive && (clearTrigger === 'always' || focused))
      });
    },
    eventDetail: function eventDetail(value, previousValue, source, nativeDetail) {
      return {
        value: textValue(value),
        previousValue: textValue(previousValue),
        source: source,
        controlled: this.isControlled(),
        detail: nativeDetail || {}
      };
    },
    requestValue: function requestValue(value, source, nativeDetail) {
      if (this.data.disabled || this.data.readonly) return false;
      var previousValue = this.data.innerValue;
      var limits = this.limits();
      var nextValue = normalizeText(value, limits.maxlength, limits.maxcharacter);
      if (!this.isControlled()) this.setData({ innerValue: nextValue });
      var detail = this.eventDetail(nextValue, previousValue, source, nativeDetail);
      this.triggerEvent('change', detail);
      this.syncState();
      return detail;
    },
    onInputChange: function onInputChange(event) {
      var detail = event && event.detail ? event.detail : {};
      this.requestValue(detail.value, detail.source === 'clear' ? 'clear' : 'input', detail);
    },
    onInputClear: function onInputClear(event) {
      if (this.data.disabled || this.data.readonly || !this.data.innerValue) return;
      var nativeDetail = event && event.detail ? event.detail : {};
      this.triggerEvent('clear', this.eventDetail('', this.data.innerValue, 'clear', nativeDetail));
    },
    onSearch: function onSearch(event) {
      if (this.data.disabled || this.data.readonly) return;
      var nativeDetail = event && event.detail ? event.detail : {};
      var value = hasValue(nativeDetail.value) ? nativeDetail.value : this.data.innerValue;
      this.triggerEvent('search', this.eventDetail(value, this.data.innerValue, 'confirm', nativeDetail));
    },
    onFocus: function onFocus(event) {
      if (this.data.disabled || this.data.readonly) return;
      this.setData({ focused: true });
      this.syncState();
      this.triggerEvent('focus', this.eventDetail(this.data.innerValue, this.data.innerValue, 'focus', event && event.detail));
    },
    onBlur: function onBlur(event) {
      var wasFocused = this.data.focused;
      this.setData({ focused: false });
      this.syncState();
      if (!wasFocused && (this.data.disabled || this.data.readonly)) return;
      this.triggerEvent('blur', this.eventDetail(this.data.innerValue, this.data.innerValue, 'blur', event && event.detail));
    },
    onCancel: function onCancel() {
      if (this.data.disabled || this.data.readonly) return;
      this.triggerEvent('cancel', this.eventDetail(this.data.innerValue, this.data.innerValue, 'cancel'));
    }
  }
});
