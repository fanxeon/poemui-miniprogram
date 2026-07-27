var themeBehavior = require('../common/behaviors/theme');

var THEME_ROWS = {
  text: [
    [{ width: '24%', height: '32rpx' }, { width: '76%', height: '32rpx' }],
    1
  ],
  avatar: [
    [{ type: 'circle', size: '96rpx' }, { height: '32rpx' }],
    1
  ],
  image: [{ type: 'rect', size: '144rpx' }],
  paragraph: [1, 1, 1, { width: '55%' }]
};

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}

function hasValue(value) {
  return value !== null && value !== undefined && value !== '';
}

function safeLength(value, kind, fallback) {
  if (!hasValue(value)) return fallback;
  var text = typeof value === 'number' ? value + 'rpx' : String(value).trim();
  var match = text.match(/^(\d+(?:\.\d+)?)(%|rpx|px)$/);
  if (!match) return fallback;
  var number = Number(match[1]);
  var unit = match[2];
  if (kind === 'width' && unit === '%') return clamp(number, 0, 100, 100) + '%';
  if (unit === 'rpx') return clamp(number, 0, kind === 'size' ? 320 : (kind === 'margin' ? 64 : 750), 0) + 'rpx';
  if (unit === 'px') return clamp(number, 0, kind === 'size' ? 160 : (kind === 'margin' ? 32 : 375), 0) + 'px';
  return fallback;
}

function safeMargin(value) {
  return safeLength(value, 'margin', '0');
}

function themeRows(value) {
  return THEME_ROWS[['avatar', 'image', 'paragraph', 'text'].indexOf(value) > -1 ? value : 'text'];
}

function normalizePart(part, index) {
  var item = part && typeof part === 'object' && !Array.isArray(part) ? part : {};
  var type = ['text', 'rect', 'circle'].indexOf(item.type) > -1 ? item.type : 'text';
  var size = safeLength(item.size, 'size', '');
  var width = size || safeLength(item.width, 'width', type === 'circle' ? '96rpx' : '');
  var height = size || safeLength(item.height, 'height', type === 'circle' ? '96rpx' : '');
  var style = '';
  if (width) style += 'width:' + width + ';';
  if (height) style += 'height:' + height + ';';
  if (item.margin) style += 'margin:' + safeMargin(item.margin) + ';';
  if (item.marginLeft) style += 'margin-left:' + safeMargin(item.marginLeft) + ';';
  if (item.marginRight) style += 'margin-right:' + safeMargin(item.marginRight) + ';';
  return { key: 'part-' + index, type: type, style: style };
}

function normalizeRows(rowCol, theme) {
  var source = Array.isArray(rowCol) && rowCol.length ? rowCol.slice(0, 12) : themeRows(theme);
  return source.map(function mapRow(row, rowIndex) {
    var parts;
    if (typeof row === 'number' && isFinite(row)) {
      parts = Array.from({ length: Math.round(clamp(row, 0, 4, 1)) }, function makeText() { return {}; });
    } else if (Array.isArray(row)) {
      parts = row.slice(0, 4);
    } else {
      parts = [row];
    }
    return {
      key: 'row-' + rowIndex,
      items: parts.map(function mapPart(part, partIndex) { return normalizePart(part, rowIndex + '-' + partIndex); })
    };
  }).filter(function keepNonEmpty(row) { return row.items.length > 0; });
}

function normalizeAnimation(value) {
  return ['gradient', 'flashed', 'none'].indexOf(value) > -1 ? value : 'none';
}

function normalizeTheme(value) {
  return ['avatar', 'image', 'paragraph', 'text'].indexOf(value) > -1 ? value : 'text';
}

function motionDuration(reduceMotion) {
  return reduceMotion ? 1 : 500;
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    animation: { type: String, value: 'none' },
    delay: { type: Number, value: 0 },
    loading: { type: Boolean, value: true },
    rowCol: { type: Array, value: [] },
    theme: { type: String, value: 'text' },
    ariaLabel: { type: String, value: '内容加载中' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rows: [],
    mounted: false,
    active: false,
    contentActive: true,
    rootClass: 'pui-skeleton pui-skeleton--text pui-skeleton--none',
    rootStyle: '',
    semanticLabel: '内容加载中'
  },
  observers: {
    'rowCol,animation,theme,ariaLabel,reduceMotion,colorScheme': function syncPresentation() {
      this.syncPresentation();
    },
    'loading,delay,reduceMotion': function syncVisibility() {
      this.syncVisibility();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this.syncPresentation();
      this.syncVisibility();
    },
    detached: function detached() {
      this._ready = false;
      this.clearTimers();
    }
  },
  methods: {
    clearTimers: function clearTimers() {
      clearTimeout(this._delayTimer);
      clearTimeout(this._enterTimer);
      clearTimeout(this._leaveTimer);
      this._delayTimer = null;
      this._enterTimer = null;
      this._leaveTimer = null;
    },
    syncPresentation: function syncPresentation() {
      var theme = normalizeTheme(this.data.theme);
      var animation = normalizeAnimation(this.data.animation);
      this.setData({
        rows: normalizeRows(this.data.rowCol, theme),
        rootClass: [
          'pui-skeleton',
          this.getColorSchemeClass(),
          'pui-skeleton--' + theme,
          'pui-skeleton--' + animation,
          this.data.reduceMotion ? 'pui-skeleton--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-skeleton-duration:' + motionDuration(this.data.reduceMotion) + 'ms;',
        semanticLabel: String(this.data.ariaLabel || '内容加载中').trim() || '内容加载中'
      });
    },
    syncVisibility: function syncVisibility() {
      var self = this;
      if (!this._ready) return;
      this.clearTimers();
      if (this.data.loading) {
        var delay = Math.round(clamp(this.data.delay, 0, 2000, 0));
        if (delay > 0 && !this.data.mounted) {
          this.setData({ mounted: false, active: false, contentActive: true });
          this._delayTimer = setTimeout(function afterDelay() {
            self._delayTimer = null;
            if (self._ready && self.data.loading) self.enterSkeleton();
          }, delay);
          return;
        }
        this.enterSkeleton();
        return;
      }
      this.setData({ contentActive: true });
      if (!this.data.mounted) return;
      this.setData({ active: false });
      this._leaveTimer = setTimeout(function afterLeave() {
        self._leaveTimer = null;
        if (self._ready && !self.data.loading) self.setData({ mounted: false, active: false, contentActive: true });
      }, motionDuration(this.data.reduceMotion));
    },
    enterSkeleton: function enterSkeleton() {
      var self = this;
      if (this.data.mounted && this.data.active) {
        this.setData({ contentActive: false });
        return;
      }
      this.setData({ mounted: true, active: false, contentActive: true }, function afterMounted() {
        self._enterTimer = setTimeout(function enterFrame() {
          self._enterTimer = null;
          if (self._ready && self.data.loading && self.data.mounted) self.setData({ active: true, contentActive: false });
        }, 16);
      });
    }
  }
});
