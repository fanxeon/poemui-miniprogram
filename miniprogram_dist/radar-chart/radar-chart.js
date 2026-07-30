var themeBehavior = require('../common/behaviors/theme');
var chartData = require('../common/utils/chart-data');
var radarData = require('../common/utils/radar-chart-data');
var platformInfo = require('../common/utils/platform-info');

var LIGHT_FALLBACK = {
  neutral: '#71717a', violet: '#7c3aed', blue: '#2563eb', teal: '#0d9488', pink: '#db2777', amber: '#d97706',
  grid: 'rgba(24,24,27,.08)', text: '#71717a'
};
var DARK_FALLBACK = {
  neutral: '#a1a1aa', violet: '#a78bfa', blue: '#60a5fa', teal: '#2dd4bf', pink: '#f472b6', amber: '#fbbf24',
  grid: 'rgba(250,250,250,.12)', text: '#a1a1aa'
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

function tracePolygon(ctx, points) {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(function line(point) { ctx.lineTo(point.x, point.y); });
  ctx.closePath();
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    indicators: { type: Array, value: [] },
    series: { type: Array, value: [] },
    levels: { type: Number, value: 4 },
    size: { type: String, value: 'medium' },
    showGrid: { type: Boolean, value: true },
    showLegend: { type: Boolean, value: true },
    showDots: { type: Boolean, value: true },
    animated: { type: Boolean, value: true },
    duration: { type: Number, value: 500 },
    ariaLabel: { type: String, value: '雷达图' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    chartSeries: [],
    legend: [],
    empty: true,
    entered: false,
    rootClass: 'pui-radar-chart pui-radar-chart--medium',
    rootStyle: '',
    semanticLabel: '雷达图：暂无数据'
  },
  observers: {
    'indicators,series,levels,size,showGrid,showLegend,showDots,animated,duration,ariaLabel,reduceMotion,colorScheme': function sync() {
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
      var normalized = radarData.normalizeRadarData(this.data.indicators, this.data.series);
      var size = normalizeEnum(this.data.size, ['small', 'medium', 'large'], 'medium');
      var duration = chartData.normalizeDuration(this.data.duration, 500);
      var semantic = (this.data.ariaLabel || '雷达图') + (normalized.valid
        ? '：' + normalized.series.map(function summarize(item) {
          return item.label + '，' + normalized.indicators.map(function dimension(indicator, index) {
            return indicator.label + ' ' + chartData.formatValue(item.values[index]);
          }).join('，');
        }).join('；')
        : '：至少需要三个维度和一个数据系列');
      this._radarData = normalized;
      this.setData({
        chartSeries: normalized.series.map(function summary(item) {
          return { key: item.key, label: item.label, theme: item.theme };
        }),
        legend: normalized.legend,
        empty: !normalized.valid,
        entered: this.data.animated === false ? true : this.data.entered,
        semanticLabel: semantic,
        rootClass: [
          'pui-radar-chart',
          this.getColorSchemeClass(),
          'pui-radar-chart--' + size,
          this.data.showGrid ? 'pui-radar-chart--grid' : '',
          this.data.reduceMotion ? 'pui-radar-chart--reduced-motion' : ''
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
      if (!this._radarData || !this._radarData.valid) return;
      var query = queryFactory(this);
      if (!query) return;
      query
        .select('.pui-radar-chart__canvas')
        .fields({ node: true, size: true })
        .selectAll('.pui-radar-chart__probe')
        .fields({ dataset: true, computedStyle: ['background-color', 'color'] })
        .exec(function render(results) {
          var canvasInfo = results && results[0];
          if (!canvasInfo || !canvasInfo.node || !canvasInfo.width || !canvasInfo.height) return;
          var fallback = this.data.colorScheme === 'dark' ? DARK_FALLBACK : LIGHT_FALLBACK;
          var colors = {};
          (results[1] || []).forEach(function readProbe(probe) {
            var dataset = probe.dataset || {};
            var background = probe['background-color'] || probe.backgroundColor || '';
            if (dataset.role === 'series') colors[dataset.key] = background;
            if (dataset.role === 'grid') colors.grid = background;
            if (dataset.role === 'text') colors.text = probe.color || background;
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
          var geometry = radarData.buildRadarGeometry(this._radarData, {
            width: width,
            height: height,
            padding: Math.min(width, height) * 0.16,
            levels: this.data.levels
          });
          if (this.data.showGrid) {
            ctx.save();
            ctx.strokeStyle = colors.grid || fallback.grid;
            ctx.lineWidth = 1;
            geometry.rings.forEach(function drawRing(ring) {
              tracePolygon(ctx, ring.points);
              ctx.stroke();
            });
            geometry.axes.forEach(function drawAxis(axis) {
              ctx.beginPath();
              ctx.moveTo(axis.start.x, axis.start.y);
              ctx.lineTo(axis.end.x, axis.end.y);
              ctx.stroke();
            });
            ctx.restore();
          }
          geometry.series.forEach(function drawSeries(series) {
            var color = colors[series.key] || fallback[series.theme] || fallback.blue;
            ctx.save();
            tracePolygon(ctx, series.points);
            var gradient = ctx.createRadialGradient(geometry.cx, geometry.cy, 0, geometry.cx, geometry.cy, geometry.radius);
            gradient.addColorStop(0, colorWithAlpha(color, 0.08));
            gradient.addColorStop(0.72, colorWithAlpha(color, 0.22));
            gradient.addColorStop(1, colorWithAlpha(color, 0.38));
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';
            ctx.stroke();
            if (this.data.showDots) {
              series.points.forEach(function drawDot(point) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2.8, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
              });
            }
            ctx.restore();
          }, this);
          ctx.save();
          ctx.fillStyle = colors.text || fallback.text;
          ctx.font = Math.max(10, Math.min(12, width / 26)) + 'px sans-serif';
          ctx.textBaseline = 'middle';
          geometry.axes.forEach(function drawLabel(axis) {
            var cosine = Math.cos(axis.labelPoint.angle);
            ctx.textAlign = Math.abs(cosine) < 0.25 ? 'center' : (cosine > 0 ? 'left' : 'right');
            ctx.fillText(axis.label, axis.labelPoint.x, axis.labelPoint.y);
          });
          ctx.restore();
        }.bind(this));
    }
  }
});
