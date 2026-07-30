var themeBehavior = require('../common/behaviors/theme');
var platformInfo = require('../common/utils/platform-info');

function hasValue(value) { return value !== null && value !== undefined; }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function finiteNumber(value, fallback) {
  if (typeof value === 'boolean' || (typeof value === 'string' && !value.trim())) return fallback;
  var number = Number(value);
  return isFinite(number) ? number : fallback;
}
function countValue(value) { return Math.max(1, Math.min(10, Math.floor(finiteNumber(value, 5)))); }
function sizeValue(value) { return Math.max(24, Math.min(96, Math.round(finiteNumber(value, 40)))); }
function gapValue(value) { return Math.max(0, Math.min(32, Math.round(finiteNumber(value, 8)))); }
function safeColor(value, fallback) {
  var color = String(value || '').trim();
  if (/^(?:#[0-9a-f]{3}|#[0-9a-f]{6})$/i.test(color)) return color;
  var rgb = color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  return rgb && rgb.slice(1).every(function validChannel(channel) { return Number(channel) <= 255; }) ? color : fallback;
}
function normalize(value, count, allowHalf) {
  var next = clamp(finiteNumber(value, 0), 0, count);
  return allowHalf ? Math.round(next * 2) / 2 : Math.round(next);
}
function textFor(value, texts) {
  var index = Math.max(0, Math.ceil(value) - 1);
  return Array.isArray(texts) && texts[index] !== undefined ? String(texts[index]) : '';
}
function starsFor(value, count) {
  var stars = [];
  var index;
  for (index = 1; index <= count; index += 1) {
    stars.push({ index: index, fill: value >= index ? 100 : value === index - 0.5 ? 50 : 0 });
  }
  return stars;
}
function windowWidth() {
  return Number(platformInfo.getWindowInfo().windowWidth) || 375;
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    value: { type: null, value: null },
    defaultValue: { type: Number, value: 0 },
    count: { type: Number, value: 5 },
    size: { type: Number, value: 40 },
    gap: { type: Number, value: 8 },
    color: { type: String, value: '' },
    allowHalf: { type: Boolean, value: false },
    showText: { type: Boolean, value: false },
    texts: { type: Array, value: [] },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '评分' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    stars: [],
    innerValue: 0,
    text: '',
    rootClass: 'pui-rate',
    rootStyle: '',
    starSize: 40,
    starGap: 8,
    activeColor: '#d97706',
    semanticLabel: '评分',
    semanticValueText: '0 星'
  },
  observers: {
    'value,defaultValue,count,size,gap,color,allowHalf,showText,texts,disabled,readonly,ariaLabel,reduceMotion,colorScheme': function sync() { this.syncState(); }
  },
  lifetimes: {
    attached: function attached() { this.syncState(); }
  },
  methods: {
    isControlled: function isControlled() { return hasValue(this.data.value); },
    stateForValue: function stateForValue(value, count) {
      var text = textFor(value, this.data.texts);
      return {
        innerValue: value,
        stars: starsFor(value, count),
        text: text,
        semanticValueText: text ? value + ' 星，' + text : value + ' 星'
      };
    },
    syncState: function syncState() {
      var count = countValue(this.data.count);
      var value;
      if (this.isControlled()) {
        value = normalize(this.data.value, count, this.data.allowHalf);
        this._lastControlledValue = value;
        this._wasControlled = true;
      } else if (this._wasControlled) {
        value = normalize(this._lastControlledValue, count, this.data.allowHalf);
        this._wasControlled = false;
      } else if (!this._initialized) {
        value = normalize(this.data.defaultValue, count, this.data.allowHalf);
        this._initialized = true;
      } else {
        value = normalize(this.data.innerValue, count, this.data.allowHalf);
      }
      var motion = this.data.reduceMotion ? 1 : 500;
      this.setData(Object.assign(this.stateForValue(value, count), {
        starSize: sizeValue(this.data.size),
        starGap: gapValue(this.data.gap),
        activeColor: safeColor(this.data.color, 'var(--pui-color-warning)'),
        rootClass: ['pui-rate', this.getColorSchemeClass(), this.data.disabled ? 'pui-rate--disabled' : '', this.data.readonly ? 'pui-rate--readonly' : ''].filter(Boolean).join(' '),
        rootStyle: '--pui-rate-duration:' + motion + 'ms;',
        semanticLabel: String(this.data.ariaLabel || '').trim() || '评分'
      }));
    },
    requestValue: function requestValue(value, source) {
      var count = countValue(this.data.count);
      var nextValue = normalize(value, count, this.data.allowHalf);
      var previousValue = this._lastRequestedValue === undefined ? this.data.innerValue : this._lastRequestedValue;
      if (nextValue === previousValue) return;
      this._lastRequestedValue = nextValue;
      if (!this.isControlled()) this.setData(this.stateForValue(nextValue, count));
      this.triggerEvent('change', { value: nextValue, source: source });
    },
    onRateTap: function onRateTap(event) {
      if (this.data.disabled || this.data.readonly) return;
      if (this._suppressTapUntil && Date.now() < this._suppressTapUntil) return;
      this._lastRequestedValue = undefined;
      this.requestValue(event.currentTarget.dataset.value, 'tap');
      this._lastRequestedValue = undefined;
    },
    onTouchStart: function onTouchStart(event) {
      if (this.data.disabled || this.data.readonly) return;
      var touch = event.touches && event.touches[0];
      if (!touch) return;
      var self = this;
      this._touching = true;
      this._dragging = false;
      this._touchStartX = touch.pageX;
      this._touchX = touch.pageX;
      this._lastRequestedValue = this.data.innerValue;
      this.createSelectorQuery().select('.pui-rate__stars').boundingClientRect(function rememberRect(rect) {
        if (!self._touching || !rect) return;
        self._rateRect = rect;
      }).exec();
    },
    onTouchMove: function onTouchMove(event) {
      if (!this._touching || this.data.disabled || this.data.readonly) return;
      var touch = event.touches && event.touches[0];
      if (!touch) return;
      this._touchX = touch.pageX;
      if (!this._dragging && Math.abs(this._touchX - this._touchStartX) < 4) return;
      this._dragging = true;
      this.requestTouchValue(this._touchX);
    },
    onTouchEnd: function onTouchEnd() {
      if (this._dragging) this._suppressTapUntil = Date.now() + 300;
      this._touching = false;
      this._dragging = false;
      this._rateRect = null;
      this._lastRequestedValue = undefined;
    },
    requestTouchValue: function requestTouchValue(pageX) {
      var rect = this._rateRect;
      if (!rect || !rect.width) return;
      var count = countValue(this.data.count);
      var gapPx = gapValue(this.data.gap) * windowWidth() / 750;
      var itemWidth = Math.max(1, (rect.width - gapPx * (count - 1)) / count);
      var unit = itemWidth + gapPx;
      var position = clamp(pageX - rect.left, 0, rect.width);
      var raw = (position + gapPx) / unit;
      var whole = Math.floor(raw);
      var fraction = raw - whole;
      var value = this.data.allowHalf && fraction <= 0.5 ? whole + 0.5 : whole + 1;
      this.requestValue(clamp(value, 0, count), 'drag');
    }
  }
});
