var themeBehavior = require('../common/behaviors/theme');

function hasValue(value) {
  return value !== null && value !== undefined;
}

function textValue(value) {
  return hasValue(value) ? String(value) : '';
}

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function normalizeLimit(value, maximum) {
  var next = Math.floor(Number(value));
  if (!isFinite(next) || next < -1) return -1;
  return Math.min(maximum, next);
}

function normalizeRows(value, fallback, maximum) {
  var next = Math.floor(Number(value));
  if (!isFinite(next)) next = fallback;
  return Math.max(1, Math.min(maximum, next));
}

function safeSlice(value, length) {
  if (length < 0 || value.length <= length) return value;
  var result = value.slice(0, length);
  var last = result.charCodeAt(result.length - 1);
  var next = value.charCodeAt(result.length);
  if (last >= 0xD800 && last <= 0xDBFF && next >= 0xDC00 && next <= 0xDFFF) result = result.slice(0, -1);
  return result;
}

function characterParts(value) {
  var parts = [];
  for (var index = 0; index < value.length; index += 1) {
    var first = value.charCodeAt(index);
    if (first >= 0xD800 && first <= 0xDBFF && index + 1 < value.length) {
      var second = value.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        parts.push(value.slice(index, index + 2));
        index += 1;
        continue;
      }
    }
    parts.push(value.charAt(index));
  }
  return parts;
}

function characterWeight(character) {
  return /^[\x00-\x7F]$/.test(character) ? 1 : 2;
}

function weightedLength(value) {
  return characterParts(value).reduce(function count(total, character) {
    return total + characterWeight(character);
  }, 0);
}

function truncateWeighted(value, limit) {
  if (limit < 0) return value;
  var result = '';
  var count = 0;
  var parts = characterParts(value);
  for (var index = 0; index < parts.length; index += 1) {
    var weight = characterWeight(parts[index]);
    if (count + weight > limit) break;
    result += parts[index];
    count += weight;
  }
  return result;
}

function normalizeText(value, maxlength, maxcharacter) {
  var result = textValue(value);
  if (maxcharacter >= 0) return truncateWeighted(result, maxcharacter);
  if (maxlength >= 0) return safeSlice(result, maxlength);
  return result;
}

function textCount(value, maxcharacter) {
  return maxcharacter >= 0 ? weightedLength(value) : value.length;
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    value: { type: null, value: null },
    defaultValue: { type: null, value: '' },
    name: { type: String, value: '' },
    label: { type: String, value: '' },
    placeholder: { type: String, value: '请输入' },
    maxlength: { type: Number, value: -1 },
    maxcharacter: { type: Number, value: -1 },
    autosize: { type: null, value: false },
    indicator: { type: Boolean, value: false },
    bordered: { type: Boolean, value: true },
    size: { type: String, value: 'medium' },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    focus: { type: Boolean, value: false },
    status: { type: String, value: 'default' },
    tips: { type: String, value: '' },
    required: { type: Boolean, value: false },
    confirmType: { type: String, value: 'done' },
    showConfirmBar: { type: Boolean, value: true },
    cursorSpacing: { type: Number, value: 0 },
    selectionStart: { type: Number, value: -1 },
    selectionEnd: { type: Number, value: -1 },
    adjustPosition: { type: Boolean, value: true },
    holdKeyboard: { type: Boolean, value: false },
    confirmHold: { type: Boolean, value: false },
    disableDefaultPadding: { type: Boolean, value: true },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    innerValue: '',
    renderValue: '',
    count: 0,
    limitValue: -1,
    countMode: 'length',
    showIndicator: false,
    focused: false,
    methodFocus: false,
    inputFocus: false,
    rootClass: '',
    rootStyle: '',
    controlStyle: '',
    semanticLabel: '文本域',
    invalidState: false,
    statusValue: 'default',
    statusIcon: '',
    tipsText: '',
    interactive: true,
    confirmTypeValue: 'done',
    maxlengthValue: -1,
    autoHeightValue: false,
    minRowsValue: 4,
    maxRowsValue: 8,
    hasFeedback: false,
    resolvedDuration: 500
  },
  observers: {
    'value,defaultValue,name,label,placeholder,maxlength,maxcharacter,autosize,indicator,bordered,size,disabled,readonly,loading,focus,status,tips,required,confirmType,showConfirmBar,cursorSpacing,selectionStart,selectionEnd,adjustPosition,holdKeyboard,confirmHold,disableDefaultPadding,ariaLabel,reduceMotion,colorScheme': function syncStateObserver() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this.syncState();
    }
  },
  methods: {
    setChangedData: function setChangedData(nextState, callback) {
      var patch = {};
      Object.keys(nextState).forEach(function collectChangedValue(key) {
        if (this.data[key] !== nextState[key]) patch[key] = nextState[key];
      }, this);
      if (!Object.keys(patch).length) {
        if (callback) callback.call(this);
        return false;
      }
      this.setData(patch, callback);
      return true;
    },
    isControlled: function isControlled() {
      return hasValue(this.data.value);
    },
    currentValue: function currentValue() {
      return this._nativeValue === undefined ? this.data.innerValue : this._nativeValue;
    },
    limits: function limits() {
      return {
        maxlength: normalizeLimit(this.data.maxlength, 10000),
        maxcharacter: normalizeLimit(this.data.maxcharacter, 20000)
      };
    },
    syncState: function syncState() {
      var controlled = this.isControlled();
      var limits = this.limits();
      var innerValue = this.data.innerValue;
      if (controlled) {
        innerValue = textValue(this.data.value);
        this._lastControlledValue = innerValue;
      } else if (!this._initialized) {
        innerValue = textValue(this.data.defaultValue);
      } else if (this._wasControlled) {
        innerValue = textValue(this._lastControlledValue);
      }
      innerValue = normalizeText(innerValue, limits.maxlength, limits.maxcharacter);
      var pendingNativeEcho = this._pendingNativeValue !== undefined && innerValue === this._pendingNativeValue;
      var preserveNativeDraft = pendingNativeEcho || (
        this.data.focused &&
        this._nativeValue !== undefined &&
        innerValue === this._nativeValue
      );
      var renderValue = preserveNativeDraft ? this.data.renderValue : innerValue;
      this._nativeValue = innerValue;
      if (pendingNativeEcho) this._pendingNativeValue = undefined;
      this._initialized = true;
      this._wasControlled = controlled;

      var autosize = this.data.autosize;
      var autosizeObject = autosize && typeof autosize === 'object';
      var autoHeight = autosizeObject || autosize === true;
      var minRows = normalizeRows(autosizeObject ? autosize.minRows : 4, 4, 20);
      var maxRows = normalizeRows(autosizeObject ? autosize.maxRows : 8, 8, 40);
      maxRows = Math.max(minRows, maxRows);
      var size = normalizeEnum(this.data.size, ['small', 'medium', 'large'], 'medium');
      var lineHeight = size === 'small' ? 36 : size === 'large' ? 48 : 42;
      var status = normalizeEnum(this.data.status, ['default', 'error', 'warning', 'success'], 'default');
      var invalidState = status === 'error';
      var interactive = !(this.data.disabled || this.data.readonly || this.data.loading);
      var methodFocus = this.data.methodFocus;
      var focused = this.data.focused;
      if (!interactive) {
        methodFocus = false;
        focused = false;
      }
      var inputFocus = interactive && !!(this.data.focus || methodFocus || focused);
      var showIndicator = !!this.data.indicator;
      var limitValue = limits.maxcharacter >= 0 ? limits.maxcharacter : limits.maxlength;
      var count = textCount(innerValue, limits.maxcharacter);
      var tipsText = this.data.tips === 'slot' ? '' : this.data.tips;
      var statusIcon = status === 'error' ? 'error-circle' : status === 'warning' ? 'warning-triangle' : status === 'success' ? 'success-circle' : '';
      var motion = this.data.reduceMotion ? 1 : 500;
      var semanticLabel = (this.data.ariaLabel || (this.data.label === 'slot' ? '' : this.data.label) || this.data.placeholder || '文本域').trim() || '文本域';

      this.setChangedData({
        innerValue: innerValue,
        renderValue: renderValue,
        count: count,
        limitValue: limitValue,
        countMode: limits.maxcharacter >= 0 ? 'character' : 'length',
        showIndicator: showIndicator,
        focused: focused,
        methodFocus: methodFocus,
        inputFocus: inputFocus,
        rootClass: [
          'pui-textarea',
          this.getColorSchemeClass(),
          'pui-textarea--' + size,
          'pui-textarea--' + status,
          this.data.bordered ? 'pui-textarea--bordered' : 'pui-textarea--borderless',
          this.data.disabled ? 'pui-textarea--disabled' : '',
          this.data.readonly ? 'pui-textarea--readonly' : '',
          this.data.loading ? 'pui-textarea--loading' : '',
          focused || inputFocus ? 'pui-textarea--focus' : '',
          this.data.reduceMotion ? 'pui-textarea--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-textarea-duration:' + motion + 'ms;--pui-textarea-ease:var(--pui-ease-standard);',
        controlStyle: 'min-height:' + (minRows * lineHeight) + 'rpx;max-height:' + (maxRows * lineHeight) + 'rpx;' + (autoHeight ? '' : 'height:' + (minRows * lineHeight) + 'rpx;'),
        semanticLabel: semanticLabel,
        invalidState: invalidState,
        statusValue: status,
        statusIcon: statusIcon,
        tipsText: tipsText,
        interactive: interactive,
        confirmTypeValue: normalizeEnum(this.data.confirmType, ['done', 'go', 'next', 'search', 'send'], 'done'),
        maxlengthValue: limits.maxcharacter >= 0 ? -1 : limits.maxlength,
        autoHeightValue: autoHeight,
        minRowsValue: minRows,
        maxRowsValue: maxRows,
        hasFeedback: !!(this.data.tips || showIndicator),
        resolvedDuration: motion
      });
    },
    valueDetail: function valueDetail(value, previousValue, source, nativeDetail) {
      var limits = this.limits();
      var next = normalizeText(value, limits.maxlength, limits.maxcharacter);
      return {
        value: next,
        previousValue: textValue(previousValue),
        count: textCount(next, limits.maxcharacter),
        limit: limits.maxcharacter >= 0 ? limits.maxcharacter : limits.maxlength,
        countMode: limits.maxcharacter >= 0 ? 'character' : 'length',
        truncated: next !== textValue(value),
        source: source,
        controlled: this.isControlled(),
        name: this.data.name || '',
        detail: nativeDetail || {}
      };
    },
    requestValue: function requestValue(value, source, nativeDetail) {
      if (!this.data.interactive) return false;
      var previousValue = this.currentValue();
      var detail = this.valueDetail(value, previousValue, source, nativeDetail);
      this._nativeValue = detail.value;
      if (detail.controlled) this._pendingNativeValue = detail.value;
      var nextState = { innerValue: detail.value, count: detail.count };
      if (detail.value !== textValue(value)) nextState.renderValue = detail.value;
      this.setChangedData(nextState);
      this.triggerEvent('change', detail);
      return detail;
    },
    onInput: function onInput(event) {
      if (!this.data.interactive) return this.data.innerValue;
      var nativeDetail = event && event.detail ? event.detail : {};
      var rawValue = textValue(nativeDetail.value);
      var detail = this.requestValue(rawValue, 'input', nativeDetail);
      if (!detail) return this.data.innerValue;
      if (detail.value !== rawValue) return detail.value;
      return undefined;
    },
    onFocus: function onFocus(event) {
      if (!this.data.interactive) return;
      this.setChangedData({ focused: true, methodFocus: false }, function afterFocusState() {
        this.syncState();
        var value = this.currentValue();
        this.triggerEvent('focus', this.valueDetail(value, value, 'focus', event && event.detail));
      });
    },
    onBlur: function onBlur(event) {
      var wasFocused = this.data.focused;
      this.setChangedData({ focused: false, methodFocus: false }, function afterBlurState() {
        this.syncState();
        if (!wasFocused && !this.data.interactive) return;
        var value = this.currentValue();
        this.triggerEvent('blur', this.valueDetail(value, value, 'blur', event && event.detail));
      });
    },
    onConfirm: function onConfirm(event) {
      if (!this.data.interactive) return;
      var nativeDetail = event && event.detail ? event.detail : {};
      var currentValue = this.currentValue();
      var value = hasValue(nativeDetail.value) ? nativeDetail.value : currentValue;
      this.triggerEvent('enter', this.valueDetail(value, currentValue, 'enter', nativeDetail));
    },
    onLineChange: function onLineChange(event) {
      var nativeDetail = event && event.detail ? event.detail : {};
      var value = this.currentValue();
      var detail = this.valueDetail(value, value, 'line-change', nativeDetail);
      detail.lineCount = Number(nativeDetail.lineCount) || 0;
      detail.height = Number(nativeDetail.height) || 0;
      detail.heightRpx = Number(nativeDetail.heightRpx) || 0;
      this.triggerEvent('line-change', detail);
    },
    onKeyboardHeightChange: function onKeyboardHeightChange(event) {
      var nativeDetail = event && event.detail ? event.detail : {};
      this.triggerEvent('keyboardheightchange', {
        value: this.currentValue(),
        height: Number(nativeDetail.height) || 0,
        duration: Number(nativeDetail.duration) || 0,
        source: 'keyboard',
        name: this.data.name || '',
        detail: nativeDetail
      });
    },
    focus: function focus() {
      if (!this.data.interactive) return false;
      this.setChangedData({ methodFocus: true }, function afterMethodFocus() {
        this.syncState();
      });
      return true;
    },
    blur: function blur() {
      this.setChangedData({ methodFocus: false, focused: false }, function afterMethodBlur() {
        this.syncState();
      });
      return true;
    },
    getValue: function getValue() {
      return this.currentValue();
    }
  }
});
