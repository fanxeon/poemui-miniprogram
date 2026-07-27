var themeBehavior = require('../common/behaviors/theme');

function numericValue(value) {
  if (typeof value === 'number') return isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  var text = value.trim();
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(text)) return null;
  var number = Number(text);
  return isFinite(number) ? number : null;
}

function normalizeMax(value) {
  var max = Math.floor(Number(value));
  return isFinite(max) && max > 0 ? max : 99;
}

function formatCount(value, showZero, maxCount) {
  if (value === null || value === undefined || typeof value === 'boolean') return '';
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  var text = String(value).trim();
  if (!text) return '';
  var numeric = numericValue(value);
  if (numeric === 0 && !showZero) return '';
  var max = normalizeMax(maxCount);
  if (numeric !== null && numeric > max) return String(max) + '+';
  return text;
}

function safeColor(value) {
  var color = String(value || '').trim();
  if (!color || /[;{}<>]/.test(color)) return '';
  if (/^#[0-9a-f]{3,8}$/i.test(color)) return color;
  if (/^(transparent|currentColor)$/i.test(color)) return color;
  if (/^var\(--[a-z0-9-]+\)$/i.test(color)) return color;
  if (/^(?:rgb|rgba|hsl|hsla)\([0-9.% ,/+\-]+\)$/i.test(color)) return color;
  return '';
}

function safeOffsetLength(value) {
  if (typeof value === 'number') {
    if (!isFinite(value)) return '0rpx';
    return Math.max(-200, Math.min(200, Math.round(value))) + 'rpx';
  }
  var text = String(value === null || value === undefined ? '' : value).trim();
  var match = text.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))(rpx|px|em|rem|%)?$/i);
  if (!match) return '0rpx';
  var unit = (match[2] || 'rpx').toLowerCase();
  var number = Number(match[1]);
  var limit = unit === 'em' || unit === 'rem' ? 20 : 200;
  number = Math.max(-limit, Math.min(limit, number));
  return String(number) + unit;
}

function normalizeOffset(value) {
  var source = Array.isArray(value) ? value : [];
  return [safeOffsetLength(source[0]), safeOffsetLength(source[1])];
}

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    count: { type: null, value: 0 },
    content: { type: String, value: '' },
    dot: { type: Boolean, value: false },
    maxCount: { type: Number, value: 99 },
    showZero: { type: Boolean, value: false },
    theme: { type: String, value: 'danger' },
    variant: { type: String, value: 'solid' },
    shape: { type: String, value: 'circle' },
    size: { type: String, value: 'medium' },
    color: { type: String, value: '' },
    offset: { type: Array, value: [0, 0] },
    ariaLabel: { type: String, value: '' }
  },
  data: {
    rootClass: '',
    rootStyle: '',
    badgeText: '',
    badgeLabel: '徽标',
    rendered: false,
    useCountSlot: false
  },
  observers: {
    'count,content,dot,maxCount,showZero,theme,variant,shape,size,color,offset,ariaLabel,colorScheme': function sync() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this.syncState();
    }
  },
  methods: {
    syncState: function syncState() {
      var badgeText = formatCount(this.data.count, this.data.showZero, this.data.maxCount);
      var useCountSlot = this.data.count === null;
      var theme = normalizeEnum(this.data.theme, ['danger', 'primary', 'success', 'warning', 'neutral'], 'danger');
      var variant = normalizeEnum(this.data.variant, ['solid', 'light', 'outline'], 'solid');
      var shape = normalizeEnum(this.data.shape, ['circle', 'square'], 'circle');
      var size = normalizeEnum(this.data.size, ['small', 'medium', 'large'], 'medium');
      var offset = normalizeOffset(this.data.offset);
      var color = safeColor(this.data.color);
      var semantic = String(this.data.ariaLabel || '').trim()
        || (this.data.dot ? '新通知' : (useCountSlot ? '自定义徽标' : badgeText || '徽标'));
      var style = [
        '--pui-badge-offset-x:' + offset[0],
        '--pui-badge-offset-y:' + offset[1]
      ];
      if (color) style.push('--pui-badge-tone:' + color);
      this.setData({
        rootClass: [
          'pui-badge-wrap',
          this.getColorSchemeClass(),
          'pui-badge-wrap--' + theme,
          'pui-badge-wrap--' + variant,
          'pui-badge-wrap--' + size,
          'pui-badge-wrap--' + shape,
          color ? 'pui-badge-wrap--custom-color' : '',
          this.data.dot ? 'pui-badge-wrap--dot' : ''
        ].filter(Boolean).join(' '),
        rootStyle: style.join(';') + ';',
        badgeText: badgeText,
        badgeLabel: semantic,
        rendered: !!this.data.dot || !!badgeText || useCountSlot,
        useCountSlot: useCountSlot
      });
    }
  }
});
