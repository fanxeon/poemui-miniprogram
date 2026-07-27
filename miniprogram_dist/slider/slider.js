var themeBehavior = require('../common/behaviors/theme');

function hasValue(value) { return value !== null && value !== undefined; }
function finiteNumber(value, fallback) {
  if (typeof value === 'boolean' || (typeof value === 'string' && !value.trim())) return fallback;
  var number = Number(value);
  return isFinite(number) ? number : fallback;
}
function bounds(min, max) {
  var lower = finiteNumber(min, 0);
  var upper = finiteNumber(max, lower);
  if (upper < lower) upper = lower;
  return { min: lower, max: upper };
}
function stepSize(value) {
  var size = Math.abs(finiteNumber(value, 1));
  return !isFinite(size) || size <= 0 ? 1 : size;
}
function normalize(value, min, max, step) {
  var range = bounds(min, max);
  var size = stepSize(step);
  var number = finiteNumber(value, range.min);
  number = Math.max(range.min, Math.min(range.max, number));
  number = range.min + Math.round((number - range.min) / size) * size;
  return Number(Math.max(range.min, Math.min(range.max, number)).toFixed(8));
}
function safeColor(value, fallback) {
  var color = String(value || '').trim();
  if (/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(color)) return color;
  var rgb = color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgb && Number(rgb[1]) <= 255 && Number(rgb[2]) <= 255 && Number(rgb[3]) <= 255) return color;
  return fallback;
}

function blockSize(value) {
  var size = Math.round(Number(value));
  if (!isFinite(size)) size = 28;
  return Math.max(12, Math.min(28, size));
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    value: { type: null, value: null },
    defaultValue: { type: Number, value: 0 },
    min: { type: Number, value: 0 },
    max: { type: Number, value: 100 },
    step: { type: Number, value: 1 },
    color: { type: String, value: '' },
    trackColor: { type: String, value: '' },
    name: { type: String, value: '' },
    blockSize: { type: Number, value: 28 },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    showValue: { type: Boolean, value: false },
    showMinMax: { type: Boolean, value: false },
    valueSuffix: { type: String, value: '' },
    ariaLabel: { type: String, value: '滑块' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: { innerValue: 0, lowerBound: 0, upperBound: 100, normalizedStep: 1, normalizedBlockSize: 28, rootClass: '', rootStyle: '', activeColor: '#18181b', inactiveColor: '#e4e4e7', blockColor: '#ffffff', semanticLabel: '滑块' },
  observers: {
    'value,defaultValue,min,max,step,color,trackColor,name,blockSize,disabled,readonly,showValue,showMinMax,valueSuffix,ariaLabel,reduceMotion,colorScheme': function syncValue() { this.syncState(); }
  },
  lifetimes: {
    attached: function attached() { this.syncState(); }
  },
  methods: {
    isControlled: function isControlled() { return hasValue(this.data.value); },
    syncState: function syncState() {
      var range = bounds(this.data.min, this.data.max);
      var controlled = this.isControlled();
      var value;
      if (controlled) { value = normalize(this.data.value, range.min, range.max, this.data.step); this._initialized = true; }
      else if (!this._initialized) { value = normalize(this.data.defaultValue, range.min, range.max, this.data.step); this._initialized = true; }
      else value = normalize(this.data.innerValue, range.min, range.max, this.data.step);
      var dark = this.data.colorScheme === 'dark';
      this.setData({
        innerValue: value,
        lowerBound: range.min,
        upperBound: range.max,
        normalizedStep: stepSize(this.data.step),
        normalizedBlockSize: blockSize(this.data.blockSize),
        rootClass: ['pui-slider', this.getColorSchemeClass(), this.data.disabled ? 'pui-slider--disabled' : '', this.data.readonly ? 'pui-slider--readonly' : '', this.data.reduceMotion ? 'pui-slider--reduced-motion' : ''].filter(Boolean).join(' '),
        rootStyle: '--pui-slider-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;--pui-slider-ease:var(--pui-ease-standard);',
        activeColor: safeColor(this.data.color, dark ? '#f4f4f5' : '#18181b'),
        inactiveColor: safeColor(this.data.trackColor, dark ? '#3f3f46' : '#e4e4e7'),
        blockColor: dark ? '#f4f4f5' : '#ffffff',
        semanticLabel: (this.data.ariaLabel || '滑块').trim() || '滑块'
      });
    },
    onChanging: function onChanging(event) {
      if (this.data.disabled || this.data.readonly) return;
      var value = normalize(event.detail.value, this.data.lowerBound, this.data.upperBound, this.data.step);
      var previousValue = this._lastDragValue === undefined ? this.data.innerValue : this._lastDragValue;
      if (value === previousValue) return;
      if (this._dragStartValue === undefined) this._dragStartValue = this.data.innerValue;
      this._lastDragValue = value;
      if (!this.isControlled()) this.setData({ innerValue: value });
      this.triggerEvent('changing', this.eventDetail(value, previousValue, 'drag'));
    },
    onChange: function onChange(event) {
      if (this.data.disabled || this.data.readonly) return;
      var value = normalize(event.detail.value, this.data.lowerBound, this.data.upperBound, this.data.step);
      var previousValue = this._dragStartValue === undefined ? this.data.innerValue : this._dragStartValue;
      if (!this.isControlled()) this.setData({ innerValue: value });
      this._dragStartValue = undefined;
      this._lastDragValue = undefined;
      if (value !== previousValue) this.triggerEvent('change', this.eventDetail(value, previousValue, 'drag'));
    },
    eventDetail: function eventDetail(value, previousValue, source) {
      return {
        value: value,
        previousValue: previousValue,
        source: source,
        controlled: this.isControlled(),
        min: this.data.lowerBound,
        max: this.data.upperBound,
        step: this.data.normalizedStep
      };
    }
  }
});
