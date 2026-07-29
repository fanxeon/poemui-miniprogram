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

function characterWeight(character) {
  return /^[\x00-\x7F]$/.test(character) ? 1 : 2;
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
    name: { type: String, value: '' },
    label: { type: String, value: '' },
    placeholder: { type: String, value: '请输入' },
    type: { type: String, value: 'text' },
    maxlength: { type: Number, value: -1 },
    maxcharacter: { type: Number, value: -1 },
    size: { type: String, value: 'medium' },
    align: { type: String, value: 'left' },
    bordered: { type: Boolean, value: true },
    clearable: { type: Boolean, value: false },
    clearTrigger: { type: String, value: 'focus' },
    prefix: { type: String, value: '' },
    prefixIcon: { type: String, value: '' },
    suffix: { type: String, value: '' },
    suffixIcon: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    focus: { type: Boolean, value: false },
    confirmType: { type: String, value: 'done' },
    status: { type: String, value: 'default' },
    tips: { type: String, value: '' },
    required: { type: Boolean, value: false },
    cursorSpacing: { type: Number, value: 0 },
    adjustPosition: { type: Boolean, value: true },
    holdKeyboard: { type: Boolean, value: false },
    confirmHold: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    innerValue: '',
    focused: false,
    methodFocus: false,
    rootClass: '',
    rootStyle: '',
    inputType: 'text',
    inputPassword: false,
    confirmTypeValue: 'done',
    nativeMaxlength: -1,
    invalidState: false,
    interactive: true,
    semanticLabel: '输入框',
    normalizedStatus: 'default',
    normalizedClearTrigger: 'focus',
    hasClear: false,
    showClear: false
  },
  observers: {
    'value,defaultValue,name,label,placeholder,type,maxlength,maxcharacter,size,align,bordered,clearable,clearTrigger,prefix,prefixIcon,suffix,suffixIcon,disabled,readonly,loading,focus,confirmType,status,tips,required,cursorSpacing,adjustPosition,holdKeyboard,confirmHold,ariaLabel,reduceMotion,colorScheme': function syncStateObserver() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this.syncState();
    }
  },
  methods: {
    isControlled: function isControlled() {
      return hasValue(this.data.value);
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
        innerValue = normalizeText(this.data.value, limits.maxlength, limits.maxcharacter);
        this._lastControlledValue = innerValue;
      } else if (!this._initialized) {
        innerValue = normalizeText(this.data.defaultValue, limits.maxlength, limits.maxcharacter);
      } else if (this._wasControlled) {
        innerValue = textValue(this._lastControlledValue);
      } else {
        innerValue = normalizeText(innerValue, limits.maxlength, limits.maxcharacter);
      }
      this._initialized = true;
      this._wasControlled = controlled;

      var size = normalizeEnum(this.data.size, ['small', 'medium', 'large'], 'medium');
      var align = normalizeEnum(this.data.align, ['left', 'center', 'right'], 'left');
      var status = normalizeEnum(this.data.status, ['default', 'success', 'warning', 'error'], 'default');
      var clearTrigger = normalizeEnum(this.data.clearTrigger, ['focus', 'always'], 'focus');
      var interactive = !(this.data.disabled || this.data.readonly || this.data.loading);
      var inputFocus = interactive && !!(this.data.focus || this.data.methodFocus || this.data.focused);
      var type = normalizeEnum(this.data.type, ['text', 'number', 'idcard', 'digit', 'safe-password', 'password', 'nickname'], 'text');
      var confirmType = normalizeEnum(this.data.confirmType, ['done', 'go', 'next', 'search', 'send'], 'done');
      var label = this.data.label === 'slot' ? '' : this.data.label;
      var semanticLabel = (this.data.ariaLabel || label || this.data.placeholder || '输入框').trim() || '输入框';
      var hasClear = !!(this.data.clearable && innerValue && interactive);

      this.setData({
        innerValue: innerValue,
        rootClass: [
          'pui-input',
          this.getColorSchemeClass(),
          'pui-input--' + size,
          'pui-input--align-' + align,
          'pui-input--status-' + status,
          this.data.bordered ? 'pui-input--bordered' : 'pui-input--borderless',
          this.data.disabled ? 'pui-input--disabled' : '',
          this.data.readonly ? 'pui-input--readonly' : '',
          this.data.loading ? 'pui-input--loading' : '',
          this.data.focused || inputFocus ? 'pui-input--focus' : '',
          this.data.reduceMotion ? 'pui-input--reduced' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-input-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;--pui-input-ease:var(--pui-ease-standard);',
        inputType: type === 'password' ? 'text' : type,
        inputPassword: type === 'password',
        confirmTypeValue: confirmType,
        nativeMaxlength: limits.maxcharacter >= 0 ? -1 : limits.maxlength,
        invalidState: status === 'error',
        interactive: interactive,
        semanticLabel: semanticLabel,
        normalizedStatus: status,
        normalizedClearTrigger: clearTrigger,
        hasClear: hasClear,
        showClear: !!(hasClear && (clearTrigger === 'always' || this.data.focused)),
        inputFocus: inputFocus
      });
    },
    valueDetail: function valueDetail(value, previousValue, source, nativeDetail) {
      var detail = nativeDetail || {};
      return {
        value: textValue(value),
        previousValue: textValue(previousValue),
        source: source,
        controlled: this.isControlled(),
        name: this.data.name || '',
        cursor: hasValue(detail.cursor) ? detail.cursor : undefined,
        keyCode: hasValue(detail.keyCode) ? detail.keyCode : undefined
      };
    },
    requestValue: function requestValue(value, source, nativeDetail) {
      if (!this.data.interactive) return false;
      var previousValue = this.data.innerValue;
      var limits = this.limits();
      var nextValue = normalizeText(value, limits.maxlength, limits.maxcharacter);
      if (!this.isControlled()) this.setData({ innerValue: nextValue });
      var detail = this.valueDetail(nextValue, previousValue, source, nativeDetail);
      this.triggerEvent('change', detail);
      this.syncState();
      return detail;
    },
    requestClear: function requestClear(source) {
      if (!this.data.interactive || !this.data.innerValue) return false;
      var previousValue = this.data.innerValue;
      if (!this.isControlled()) this.setData({ innerValue: '' });
      var detail = this.valueDetail('', previousValue, source || 'clear');
      this.triggerEvent('clear', detail);
      this.triggerEvent('change', detail);
      this.syncState();
      return detail;
    },
    onInput: function onInput(event) {
      var nativeDetail = event && event.detail ? event.detail : {};
      this.requestValue(nativeDetail.value, 'input', nativeDetail);
    },
    onClear: function onClear() {
      this.requestClear('clear');
    },
    onFocus: function onFocus(event) {
      if (!this.data.interactive) return;
      this.setData({ focused: true, methodFocus: false });
      this.syncState();
      this.triggerEvent('focus', {
        value: this.data.innerValue,
        source: 'focus',
        controlled: this.isControlled(),
        name: this.data.name || '',
        detail: event && event.detail ? event.detail : {}
      });
    },
    onBlur: function onBlur(event) {
      var wasFocused = this.data.focused || this.data.methodFocus;
      this.setData({ focused: false, methodFocus: false });
      this.syncState();
      if (!wasFocused && !this.data.interactive) return;
      this.triggerEvent('blur', {
        value: this.data.innerValue,
        source: 'blur',
        controlled: this.isControlled(),
        name: this.data.name || '',
        detail: event && event.detail ? event.detail : {}
      });
    },
    onConfirm: function onConfirm(event) {
      if (!this.data.interactive) return;
      var nativeDetail = event && event.detail ? event.detail : {};
      this.triggerEvent('enter', {
        value: hasValue(nativeDetail.value) ? textValue(nativeDetail.value) : this.data.innerValue,
        source: 'enter',
        controlled: this.isControlled(),
        name: this.data.name || '',
        detail: nativeDetail
      });
    },
    focus: function focus() {
      if (!this.data.interactive) return false;
      this.setData({ methodFocus: true });
      this.syncState();
      return true;
    },
    blur: function blur() {
      this.setData({ methodFocus: false, focused: false });
      this.syncState();
      return true;
    },
    clear: function clear() {
      return this.requestClear('method-clear');
    },
    getValue: function getValue() {
      return this.data.innerValue;
    }
  }
});
