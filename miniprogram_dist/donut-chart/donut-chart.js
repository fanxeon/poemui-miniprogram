var themeBehavior = require('../common/behaviors/theme');
var chartData = require('../common/utils/chart-data');
var donutData = require('../common/utils/donut-chart-data');
var platformInfo = require('../common/utils/platform-info');

var LIGHT_FALLBACK = {
  neutral: '#71717a',
  violet: '#7c3aed',
  blue: '#2563eb',
  teal: '#0d9488',
  pink: '#db2777',
  amber: '#d97706',
  track: 'rgba(113,113,122,.12)'
};
var DARK_FALLBACK = {
  neutral: '#a1a1aa',
  violet: '#a78bfa',
  blue: '#60a5fa',
  teal: '#2dd4bf',
  pink: '#f472b6',
  amber: '#fbbf24',
  track: 'rgba(161,161,170,.16)'
};

function normalizeEnum(value, options, fallback) {
  return options.indexOf(value) > -1 ? value : fallback;
}

function queryFactory(component) {
  if (typeof component.createSelectorQuery === 'function') return component.createSelectorQuery();
  if (typeof wx !== 'undefined' && wx.createSelectorQuery) return wx.createSelectorQuery().in(component);
  return null;
}

function pixelRatio() {
  return Math.max(1, Number(platformInfo.getWindowInfo().pixelRatio) || 1);
}

function rpxToPx(value) {
  return Math.max(1, Number(value) || 0) * (Number(platformInfo.getWindowInfo().windowWidth) || 375) / 750;
}

function colorWithAlpha(color, alpha) {
  var value = String(color || '').trim();
  var opacity = Math.max(0, Math.min(1, Number(alpha)));
  var rgb = value.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (rgb) return 'rgba(' + rgb[1] + ',' + rgb[2] + ',' + rgb[3] + ',' + opacity + ')';
  var hex = value.match(/^#([0-9a-f]{6})$/i);
  if (!hex) return value;
  var number = parseInt(hex[1], 16);
  return 'rgba(' + ((number >> 16) & 255) + ',' + ((number >> 8) & 255) + ',' + (number & 255) + ',' + opacity + ')';
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    thickness: { type: Number, value: 40 },
    startAngle: { type: Number, value: -90 },
    gapAngle: { type: Number, value: 3 },
    size: { type: String, value: 'medium' },
    showCenter: { type: Boolean, value: true },
    centerText: { type: String, value: '' },
    showLegend: { type: Boolean, value: true },
    animated: { type: Boolean, value: true },
    duration: { type: Number, value: 500 },
    ariaLabel: { type: String, value: '圆环图' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    chartItems: [],
    legend: [],
    totalText: '0',
    resolvedCenterText: '',
    empty: true,
    entered: false,
    rootClass: 'pui-donut-chart pui-donut-chart--medium',
    rootStyle: '',
    semanticLabel: '圆环图：暂无数据'
  },
  observers: {
    'items,thickness,startAngle,gapAngle,size,showCenter,centerText,showLegend,animated,duration,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._attached = true;
      this.syncState();
    },
    ready: function ready() {
      this._ready = true;
      this.draw();
      this._playEntrance();
    },
    detached: function detached() {
      this._attached = false;
      this._ready = false;
      clearTimeout(this._drawTimer);
      clearTimeout(this._entranceTimer);
    }
  },
  methods: {
    syncState: function syncState() {
      var normalized = donutData.normalizeDonutItems(this.data.items);
      var geometry = donutData.buildDonutGeometry(normalized, {
        startAngle: this.data.startAngle,
        gapAngle: this.data.gapAngle
      });
      var size = normalizeEnum(this.data.size, ['small', 'medium', 'large'], 'medium');
      var duration = chartData.normalizeDuration(this.data.duration, 500);
      var semantic = (this.data.ariaLabel || '圆环图') + (normalized.total > 0
        ? '：总计 ' + normalized.totalText + '；' + normalized.items.map(function summarize(item) {
          return item.label + ' ' + item.valueText;
        }).join('，')
        : '：暂无数据');
      this._donutData = normalized;
      this._donutGeometry = geometry;
      this.setData({
        chartItems: normalized.items,
        legend: normalized.legend,
        totalText: normalized.totalText,
        resolvedCenterText: String(this.data.centerText || '').trim() || normalized.totalText,
        empty: normalized.total <= 0 || geometry.segments.length === 0,
        entered: this.data.animated === false ? true : this.data.entered,
        semanticLabel: semantic,
        rootClass: [
          'pui-donut-chart',
          this.getColorSchemeClass(),
          'pui-donut-chart--' + size,
          this.data.reduceMotion ? 'pui-donut-chart--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-chart-duration:' + (this.data.reduceMotion ? '1ms' : duration + 'ms') + ';'
      }, function afterState() {
        if (this._ready) this._scheduleDraw();
      });
    },
    _scheduleDraw: function scheduleDraw() {
      clearTimeout(this._drawTimer);
      this._drawTimer = setTimeout(function drawSoon() {
        if (this._attached && this._ready) this.draw();
      }.bind(this), 0);
    },
    _playEntrance: function playEntrance() {
      clearTimeout(this._entranceTimer);
      if (this.data.animated === false) {
        this.setData({ entered: true });
        return;
      }
      this.setData({ entered: false }, function resetCommitted() {
        this._entranceTimer = setTimeout(function enter() {
          if (this._attached) this.setData({ entered: true });
        }.bind(this), this.data.reduceMotion ? 0 : 32);
      }.bind(this));
    },
    replay: function replay() {
      this._playEntrance();
    },
    draw: function draw() {
      if (!this._donutGeometry || !this._donutGeometry.segments.length) return;
      var query = queryFactory(this);
      if (!query) return;
      query
        .select('.pui-donut-chart__canvas')
        .fields({ node: true, size: true })
        .selectAll('.pui-donut-chart__probe')
        .fields({ dataset: true, computedStyle: ['background-color'] })
        .exec(function render(results) {
          var canvasInfo = results && results[0];
          if (!canvasInfo || !canvasInfo.node || !canvasInfo.width || !canvasInfo.height) return;
          var fallback = this.data.colorScheme === 'dark' ? DARK_FALLBACK : LIGHT_FALLBACK;
          var colors = {};
          (results[1] || []).forEach(function readProbe(probe) {
            var dataset = probe.dataset || {};
            var color = probe['background-color'] || probe.backgroundColor || '';
            if (dataset.role === 'series') colors[dataset.key] = color;
            if (dataset.role === 'track') colors.track = color;
          });
          var ratio = pixelRatio();
          var canvas = canvasInfo.node;
          var width = canvasInfo.width;
          var height = canvasInfo.height;
          canvas.width = Math.round(width * ratio);
          canvas.height = Math.round(height * ratio);
          var ctx = canvas.getContext('2d');
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
          ctx.clearRect(0, 0, width, height);
          var cx = width / 2;
          var cy = height / 2;
          var lineWidth = Math.max(4, Math.min(Math.min(width, height) * 0.42, rpxToPx(this.data.thickness)));
          var radius = Math.max(1, Math.min(width, height) / 2 - lineWidth / 2 - 3);
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.strokeStyle = colors.track || fallback.track;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
          ctx.restore();
          this._donutGeometry.segments.forEach(function drawSegment(segment) {
            var color = colors[segment.key] || fallback[segment.theme] || fallback.violet;
            var start = segment.startAngle * Math.PI / 180;
            var end = segment.endAngle * Math.PI / 180;
            var startPoint = donutData.pointOnCircle(cx, cy, radius, segment.startAngle);
            var endPoint = donutData.pointOnCircle(cx, cy, radius, segment.endAngle);
            var gradient = ctx.createLinearGradient(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
            gradient.addColorStop(0, colorWithAlpha(color, 0.2));
            gradient.addColorStop(0.72, colorWithAlpha(color, 0.62));
            gradient.addColorStop(1, colorWithAlpha(color, 0.88));
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, radius, start, end);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(endPoint.x, endPoint.y, Math.max(2, lineWidth * 0.12), 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.restore();
          });
        }.bind(this));
    }
  }
});
