var themeBehavior = require('../common/behaviors/theme');

function hasValue(value) {
  return value !== null && value !== undefined;
}

function numericValue(value, fallback) {
  if (typeof value === 'boolean') return fallback;
  if (typeof value === 'string' && !value.trim()) return fallback;
  var number = Number(value);
  return isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function bounds(min, max) {
  var lower = numericValue(min, 0);
  var upper = numericValue(max, lower);
  if (upper < lower) upper = lower;
  return { min: lower, max: upper };
}

function stepSize(step, integer) {
  var size = Math.abs(numericValue(step, 1));
  if (!size) size = 1;
  return integer ? Math.max(1, Math.round(size)) : size;
}

function normalize(value, min, max, step, integer) {
  var number = numericValue(value, min);
  if (number <= min) return Number(min.toFixed(8));
  if (number >= max) return Number(max.toFixed(8));
  var next = min + Math.round((number - min) / step) * step;
  if (integer) next = Math.round(next);
  return Number(clamp(next, min, max).toFixed(8));
}

function inputWidth(value) {
  var width = Math.round(numericValue(value, 120));
  return Math.max(80, Math.min(480, width));
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    value: { type: null, value: null },
    defaultValue: { type: null, value: 0 },
    min: { type: Number, value: 0 },
    max: { type: Number, value: 100 },
    step: { type: Number, value: 1 },
    integer: { type: Boolean, value: true },
    inputWidth: { type: Number, value: 120 },
    size: { type: String, value: 'medium' },
    theme: { type: String, value: 'normal' },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    disableInput: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '数值步进器' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    innerValue: 0,
    displayValue: 0,
    lowerBound: 0,
    upperBound: 100,
    normalizedStep: 1,
    normalizedInputWidth: 120,
    buttonTrackSize: 88,
    inputType: 'number',
    inputSize: 'medium',
    buttonSize: 'medium',
    rootClass: '',
    rootStyle: '',
    semanticLabel: '数值步进器',
    minusLabel: '减少 1',
    plusLabel: '增加 1',
    atMin: false,
    atMax: false,
    locked: false,
    inputLocked: false
  },
  observers: {
    'value,defaultValue,min,max,step,integer,inputWidth,size,theme,disabled,readonly,disableInput,ariaLabel,reduceMotion,colorScheme': function syncStateObserver() {
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
    syncState: function syncState() {
      var range = bounds(this.data.min, this.data.max);
      var size = stepSize(this.data.step, this.data.integer);
      var controlled = this.isControlled();
      var next;
      var controlledChanged = false;

      if (controlled) {
        next = normalize(this.data.value, range.min, range.max, size, this.data.integer);
        controlledChanged = this._lastControlledValue !== undefined && this._lastControlledValue !== next;
        this._lastControlledValue = next;
      } else if (!this._initialized) {
        next = normalize(this.data.defaultValue, range.min, range.max, size, this.data.integer);
      } else if (this._wasControlled) {
        next = normalize(this._lastControlledValue, range.min, range.max, size, this.data.integer);
      } else {
        next = normalize(this.data.innerValue, range.min, range.max, size, this.data.integer);
      }

      var locked = !!this.data.disabled || !!this.data.readonly;
      if (controlledChanged || locked) this._editing = false;
      var keepDraft = !!this._editing && !controlledChanged && !locked;
      var normalizedSize = normalizeEnum(this.data.size, ['small', 'medium', 'large'], 'medium');
      var normalizedTheme = normalizeEnum(this.data.theme, ['normal', 'filled', 'outline'], 'normal');
      var width = inputWidth(this.data.inputWidth);
      var buttonTrackSize = normalizedSize === 'small' ? 72 : normalizedSize === 'large' ? 100 : 88;
      var label = String(this.data.ariaLabel || '数值步进器').trim() || '数值步进器';
      var atMin = next <= range.min;
      var atMax = next >= range.max;

      this._initialized = true;
      this._wasControlled = controlled;
      this.setData({
        innerValue: next,
        displayValue: keepDraft ? this.data.displayValue : next,
        lowerBound: range.min,
        upperBound: range.max,
        normalizedStep: size,
        normalizedInputWidth: width,
        buttonTrackSize: buttonTrackSize,
        inputType: this.data.integer ? 'number' : 'digit',
        inputSize: normalizedSize,
        buttonSize: normalizedSize,
        rootClass: [
          'pui-stepper',
          this.getColorSchemeClass(),
          'pui-stepper--' + normalizedSize,
          'pui-stepper--' + normalizedTheme,
          this.data.disabled ? 'pui-stepper--disabled' : '',
          this.data.readonly ? 'pui-stepper--readonly' : '',
          this.data.disableInput ? 'pui-stepper--input-disabled' : '',
          this.data.reduceMotion ? 'pui-stepper--reduced' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-stepper-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;--pui-stepper-ease:var(--pui-ease-standard);--pui-stepper-input-width:' + width + 'rpx;--pui-stepper-button-track-size:' + buttonTrackSize + 'rpx;--pui-stepper-control-width:' + (width + buttonTrackSize * 2) + 'rpx;',
        semanticLabel: label,
        minusLabel: atMin ? '已到最小值 ' + range.min + '，不能减少' : '减少 ' + size,
        plusLabel: atMax ? '已到最大值 ' + range.max + '，不能增加' : '增加 ' + size,
        atMin: atMin,
        atMax: atMax,
        locked: locked,
        inputLocked: locked || !!this.data.disableInput
      });
    },
    changeDetail: function changeDetail(value, previousValue, source) {
      return {
        value: value,
        previousValue: previousValue,
        source: source,
        controlled: this.isControlled()
      };
    },
    emitOverlimit: function emitOverlimit(type) {
      if (this.data.locked) return false;
      var detail = {
        type: type,
        value: this.data.innerValue,
        min: this.data.lowerBound,
        max: this.data.upperBound,
        controlled: this.isControlled()
      };
      this.triggerEvent('overlimit', detail);
      return detail;
    },
    requestValue: function requestValue(value, source) {
      if (this.data.locked) return false;
      var previousValue = this.data.innerValue;
      var next = normalize(value, this.data.lowerBound, this.data.upperBound, this.data.normalizedStep, this.data.integer);
      if (next === previousValue) {
        this._editing = false;
        this.setData({ displayValue: previousValue });
        return false;
      }
      if (!this.isControlled()) {
        this.setData({ innerValue: next, displayValue: next });
      } else {
        this.setData({ displayValue: previousValue });
      }
      this._editing = false;
      var detail = this.changeDetail(next, previousValue, source);
      this.triggerEvent('change', detail);
      this.syncState();
      return detail;
    },
    onMinus: function onMinus() {
      if (this.data.locked) return;
      if (this.data.atMin) {
        this.emitOverlimit('minus');
        return;
      }
      this.requestValue(Math.max(this.data.lowerBound, this.data.innerValue - this.data.normalizedStep), 'minus');
    },
    onPlus: function onPlus() {
      if (this.data.locked) return;
      if (this.data.atMax) {
        this.emitOverlimit('plus');
        return;
      }
      this.requestValue(Math.min(this.data.upperBound, this.data.innerValue + this.data.normalizedStep), 'plus');
    },
    onInputChange: function onInputChange(event) {
      if (this.data.inputLocked) return;
      var detail = event && event.detail ? event.detail : {};
      this._editing = true;
      this.setData({ displayValue: hasValue(detail.value) ? detail.value : '' });
    },
    commitDraft: function commitDraft(source, nativeDetail) {
      if (this.data.inputLocked) return false;
      var raw = nativeDetail && hasValue(nativeDetail.value) ? nativeDetail.value : this.data.displayValue;
      return this.requestValue(raw, source);
    },
    onEnter: function onEnter(event) {
      this.commitDraft('enter', event && event.detail ? event.detail : {});
    },
    onFocus: function onFocus(event) {
      if (this.data.inputLocked) return;
      this._editing = true;
      this.triggerEvent('focus', {
        value: this.data.innerValue,
        source: 'focus',
        controlled: this.isControlled(),
        detail: event && event.detail ? event.detail : {}
      });
    },
    onBlur: function onBlur(event) {
      if (this.data.inputLocked) return;
      var nativeDetail = event && event.detail ? event.detail : {};
      var committed = this.commitDraft('blur', nativeDetail);
      this._editing = false;
      this.triggerEvent('blur', {
        value: committed ? committed.value : this.data.innerValue,
        source: 'blur',
        controlled: this.isControlled(),
        detail: nativeDetail
      });
    }
  }
});
