var themeBehavior = require('../common/behaviors/theme');
var platformInfo = require('../common/utils/platform-info');

var MAX_MARKS = 800;
var MOVE_DURATION = 500;
var LAYOUTS = ['rectangular', 'hexagonal'];
var FONT_WEIGHTS = ['normal', 'lighter', 'bold', 'bolder'];

function clamp(value, minimum, maximum, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.max(minimum, Math.min(maximum, number));
}

function rounded(value) {
  return Math.round(Number(value) * 100) / 100;
}

function safeColor(value, fallback) {
  var color = String(value || '').trim();
  if (!color || /[;{}<>]/.test(color) || /url\s*\(|expression\s*\(|@import/i.test(color)) return fallback;
  return color;
}

function safeFontFamily(value) {
  var family = String(value || '').trim();
  if (!family || !/^[a-zA-Z0-9\u4e00-\u9fa5 _-]{1,80}$/.test(family)) return 'inherit';
  return family;
}

function windowInfo() {
  var info = platformInfo.getWindowInfo();
  return Object.keys(info).length ? info : { windowWidth: 375, windowHeight: 667 };
}

function rpxRatio() {
  return clamp(windowInfo().windowWidth, 1, 4096, 375) / 750;
}

function modulo(value, divisor) {
  if (!divisor) return 0;
  return ((value % divisor) + divisor) % divisor;
}

function toNumber(value, fallback) {
  var number = Number(value);
  return isFinite(number) ? number : fallback;
}

function normalizeSegments(value) {
  var source = Array.isArray(value) ? value : [value];
  var items = [];
  source.forEach(function eachSegment(segment, index) {
    if (typeof segment === 'string' || typeof segment === 'number') {
      var plainText = String(segment).trim();
      if (plainText) items.push(textSegment({ text: plainText }, index));
      return;
    }
    if (!segment || typeof segment !== 'object') return;
    var url = String(segment.url || '').trim();
    if (url) {
      items.push({
        key: 'image-' + index,
        kind: 'image',
        url: url,
        grayscale: !!segment.isGrayscale,
        style: 'max-width:112rpx;max-height:112rpx;'
      });
      return;
    }
    if (segment.text !== undefined && segment.text !== null && String(segment.text).trim()) {
      items.push(textSegment(segment, index));
    }
  });
  return items;
}

function textSegment(segment, index) {
  var fontWeight = String(segment.fontWeight || 'normal');
  if (FONT_WEIGHTS.indexOf(fontWeight) === -1) fontWeight = 'normal';
  return {
    key: 'text-' + index,
    kind: 'text',
    text: String(segment.text).trim(),
    style: 'color:' + safeColor(segment.fontColor, 'var(--pui-text-secondary)') + ';font-family:' + safeFontFamily(segment.fontFamily) + ';font-size:' + rounded(clamp(segment.fontSize, 12, 96, 24)) + 'rpx;font-weight:' + fontWeight + ';'
  };
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  externalClasses: ['pui-class', 'pui-class-layer', 'pui-class-mark'],
  properties: {
    alpha: { type: Number, value: 1 },
    content: { type: String, value: '' },
    height: { type: Number, value: 160 },
    isRepeat: { type: Boolean, value: true },
    layout: { type: String, value: 'rectangular' },
    lineSpace: { type: Number, value: 16 },
    movable: { type: Boolean, value: false },
    moveInterval: { type: Number, value: 3000 },
    offset: { type: Array, value: function value() { return []; } },
    rotate: { type: Number, value: -22 },
    watermarkContent: { type: null, value: null },
    width: { type: Number, value: 240 },
    x: { type: Number, value: 24 },
    y: { type: Number, value: 24 },
    zIndex: { type: Number, value: 1 },
    ariaLabel: { type: String, value: '水印区域' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rootClass: 'pui-watermark',
    rootStyle: '',
    layerStyle: 'z-index:1;',
    marks: [],
    semanticLabel: '水印区域'
  },
  observers: {
    'alpha,content,height,isRepeat,layout,lineSpace,movable,moveInterval,offset,rotate,watermarkContent,width,x,y,zIndex,ariaLabel,reduceMotion,colorScheme': function watermarkObserver() {
      this.syncWatermarkLayer('property');
    }
  },
  lifetimes: {
    attached: function attached() {
      this._watermarkReady = true;
      this._watermarkToken = 0;
      this._motionStep = 0;
      this._moveTimer = null;
      this.syncWatermarkLayer('attached');
    },
    detached: function detached() {
      this._watermarkReady = false;
      this._watermarkToken += 1;
      this.stopMoving();
    }
  },
  pageLifetimes: {
    show: function show() {
      this.syncWatermarkLayer('show');
    },
    resize: function resize() {
      this.syncWatermarkLayer('resize');
    }
  },
  methods: {
    watermarkConfig: function watermarkConfig() {
      var offset = Array.isArray(this.data.offset) ? this.data.offset : [];
      var fallbackX = rounded(clamp(this.data.x, 0, 480, 24) / 2);
      var fallbackY = rounded(clamp(this.data.y, 0, 480, 24) / 2);
      var duration = this.data.reduceMotion ? 1 : MOVE_DURATION;
      var layout = String(this.data.layout || 'rectangular');
      return {
        alpha: rounded(clamp(this.data.alpha, 0, 1, 1)),
        height: rounded(clamp(this.data.height, 32, 720, 160)),
        isRepeat: this.data.isRepeat !== false,
        layout: LAYOUTS.indexOf(layout) > -1 ? layout : 'rectangular',
        lineSpace: rounded(clamp(this.data.lineSpace, 0, 160, 16)),
        movable: !!this.data.movable && !this.data.reduceMotion,
        moveInterval: Math.round(clamp(this.data.moveInterval, 400, 60000, 3000)),
        offsetX: rounded(clamp(toNumber(offset[0], fallbackX), -2400, 2400, fallbackX)),
        offsetY: rounded(clamp(toNumber(offset[1], fallbackY), -2400, 2400, fallbackY)),
        rotate: rounded(clamp(this.data.rotate, -90, 90, -22)),
        items: normalizeSegments(this.data.watermarkContent),
        width: rounded(clamp(this.data.width, 80, 720, 240)),
        x: rounded(clamp(this.data.x, 0, 480, 24)),
        y: rounded(clamp(this.data.y, 0, 480, 24)),
        zIndex: Math.round(clamp(this.data.zIndex, 0, 12000, 1)),
        duration: duration,
        label: String(this.data.ariaLabel || '水印区域').trim() || '水印区域'
      };
    },
    syncWatermarkLayer: function syncWatermarkLayer() {
      if (!this._watermarkReady) return;
      this.stopMoving();
      this._watermarkToken += 1;
      var token = this._watermarkToken;
      var config = this.watermarkConfig();
      var rootClass = [
        'pui-watermark',
        this.getColorSchemeClass(),
        config.isRepeat ? 'pui-watermark--repeat' : 'pui-watermark--single',
        this.data.reduceMotion ? 'pui-watermark--reduced-motion' : '',
        'pui-class'
      ].filter(Boolean).join(' ');
      this.setData({
        rootClass: rootClass,
        rootStyle: '--pui-watermark-duration:' + config.duration + 'ms;--pui-watermark-line-space:' + config.lineSpace + 'rpx;',
        layerStyle: 'z-index:' + config.zIndex + ';',
        semanticLabel: config.label
      });
      if (!config.items.length) {
        this.setData({ marks: [] });
        return;
      }
      this.measureWatermark(function receiveMeasurement(rect) {
        if (!this._watermarkReady || token !== this._watermarkToken || !rect || !rect.width || !rect.height) return;
        var marks = this.buildMarks(rect, config);
        this.setData({ marks: marks }, function afterWatermarkLayout() {
          if (!this._watermarkReady || token !== this._watermarkToken) return;
          this.scheduleMoving(config);
        }.bind(this));
      }.bind(this));
    },
    measureWatermark: function measureWatermark(callback) {
      if (typeof this.createSelectorQuery !== 'function') {
        callback(null);
        return;
      }
      var query = this.createSelectorQuery();
      query.select('.pui-watermark').boundingClientRect();
      query.exec(function receive(result) {
        callback(result && result[0] ? result[0] : null);
      });
    },
    buildMarks: function buildMarks(rect, config) {
      var ratio = rpxRatio();
      var containerWidth = Math.max(1, Number(rect.width) || 1) / ratio;
      var containerHeight = Math.max(1, Number(rect.height) || 1) / ratio;
      var phaseX = config.movable ? ((this._motionStep % 5) - 2) * Math.max(12, config.x / 2 + 12) : 0;
      var phaseY = config.movable ? (((Math.floor(this._motionStep / 5)) % 5) - 2) * Math.max(12, config.y / 2 + 12) : 0;
      var makeMark = function makeMark(key, left, top) {
        return {
          key: key,
          items: config.items,
          style: 'left:' + rounded(left) + 'rpx;top:' + rounded(top) + 'rpx;width:' + config.width + 'rpx;min-height:' + config.height + 'rpx;opacity:' + config.alpha + ';transform:translate(-50%,-50%) rotate(' + config.rotate + 'deg);'
        };
      };
      if (!config.isRepeat) {
        return [makeMark('single', containerWidth / 2 + config.offsetX + phaseX, containerHeight / 2 + config.offsetY + phaseY)];
      }
      var stepX = Math.max(1, config.width + config.x);
      var stepY = Math.max(1, config.height + config.y);
      var radians = Math.abs(config.rotate) * Math.PI / 180;
      var rotatedWidth = Math.abs(config.width * Math.cos(radians)) + Math.abs(config.height * Math.sin(radians));
      var rotatedHeight = Math.abs(config.width * Math.sin(radians)) + Math.abs(config.height * Math.cos(radians));
      var overscanX = Math.max(1, Math.ceil(rotatedWidth / stepX));
      var overscanY = Math.max(1, Math.ceil(rotatedHeight / stepY));
      var columns = Math.ceil(containerWidth / stepX) + overscanX * 2 + 2;
      var rows = Math.ceil(containerHeight / stepY) + overscanY * 2 + 2;
      var startX = modulo(config.offsetX + phaseX, stepX) - overscanX * stepX;
      var startY = modulo(config.offsetY + phaseY, stepY) - overscanY * stepY;
      var marks = [];
      var maximum = Math.min(MAX_MARKS, columns * rows);
      for (var index = 0; index < maximum; index += 1) {
        var row = Math.floor(index / columns);
        var column = index % columns;
        var hexOffset = config.layout === 'hexagonal' && row % 2 ? stepX / 2 : 0;
        var rowStep = config.layout === 'hexagonal' ? stepY * 0.75 : stepY;
        marks.push(makeMark(row + '-' + column, startX + column * stepX + hexOffset + config.width / 2, startY + row * rowStep + config.height / 2));
      }
      return marks;
    },
    scheduleMoving: function scheduleMoving(config) {
      if (!config.movable) return;
      this._moveTimer = setTimeout(function moveWatermark() {
        if (!this._watermarkReady) return;
        this._motionStep += 1;
        this.syncWatermarkLayer('motion');
      }.bind(this), config.moveInterval);
    },
    stopMoving: function stopMoving() {
      if (!this._moveTimer) return;
      clearTimeout(this._moveTimer);
      this._moveTimer = null;
    }
  }
});
