var themeBehavior = require('../common/behaviors/theme');
var iconFontMap = require('./icon-font-map');

function toSize(value) {
  var size = Number(value);
  if (isNaN(size)) return 44;
  return Math.max(8, Math.min(256, size));
}

function getFallback(name) {
  return String(name || '?').charAt(0).toUpperCase();
}

function safeCssColor(value) {
  var color = String(value || '').trim();
  if (!color) return '';
  if (/^var\(--pui-[a-z0-9-]+\)$/i.test(color)) return color;
  if (/^#[0-9a-f]{3,8}$/i.test(color)) return color;
  if (/^(?:rgb|rgba|hsl|hsla)\([\d\s.,%+-]+\)$/i.test(color)) return color;
  if (/^[a-z]+$/i.test(color) && color !== 'expression') return color;
  return '';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    name: { type: String, value: '' },
    size: { type: Number, value: 44 },
    color: { type: String, value: '' },
    ariaLabel: { type: String, value: '' }
  },
  data: {
    rootClass: 'pui-icon',
    fontGlyph: '',
    iconStyle: '',
    fallbackGlyph: '?'
  },
  observers: {
    'name,size,color,colorScheme': function syncIcon() {
      this.syncIcon();
    }
  },
  lifetimes: {
    attached: function attached() {
      this.syncIcon();
    }
  },
  methods: {
    syncIcon: function syncIcon() {
      var size = toSize(this.data.size);
      var requestedColor = String(this.data.color || '').trim();
      var color = safeCssColor(requestedColor);
      var hasFontEntry = Object.prototype.hasOwnProperty.call(iconFontMap, this.data.name);
      var fontGlyph = hasFontEntry ? (iconFontMap[this.data.name] || '') : '';
      var unknownName = !!(this.data.name && !hasFontEntry);
      var missingFontGlyph = !!(this.data.name && hasFontEntry && !fontGlyph);
      var self = this;
      this.setData({
        rootClass: ['pui-icon', this.getColorSchemeClass()].filter(Boolean).join(' '),
        fontGlyph: fontGlyph,
        iconStyle: 'width:' + size + 'rpx;height:' + size + 'rpx;font-size:' + size + 'rpx;' + (color ? 'color:' + color + ';' : ''),
        fallbackGlyph: getFallback(this.data.name)
      }, function afterSyncIcon() {
        if (missingFontGlyph) {
          self.triggerEvent('error', { name: self.data.name, error: 'font-glyph-unavailable' });
        } else if (unknownName && self._lastUnknownName !== self.data.name) {
          self._lastUnknownName = self.data.name;
          self.triggerEvent('error', { name: self.data.name, error: 'unknown-icon' });
        } else if (!unknownName) {
          self._lastUnknownName = '';
        }
        if (fontGlyph) {
          if (self._lastFontLoadName !== self.data.name) {
            self._lastFontLoadName = self.data.name;
            self.triggerEvent('load', { name: self.data.name, source: 'font' });
          }
        } else {
          self._lastFontLoadName = '';
        }
      });
    }
  }
});
