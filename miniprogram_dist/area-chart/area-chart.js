var themeBehavior = require('../common/behaviors/theme');
var chartData = require('../common/utils/chart-data');
var areaChartData = require('../common/utils/area-chart-data');
var platformInfo = require('../common/utils/platform-info');

var LIGHT_FALLBACK = {
  neutral: '#71717a',
  violet: '#7c3aed',
  blue: '#2563eb',
  teal: '#0d9488',
  pink: '#db2777',
  amber: '#d97706',
  grid: 'rgba(24,24,27,.07)'
};
var DARK_FALLBACK = {
  neutral: '#a1a1aa',
  violet: '#a78bfa',
  blue: '#60a5fa',
  teal: '#2dd4bf',
  pink: '#f472b6',
  amber: '#fbbf24',
  grid: 'rgba(250,250,250,.1)'
};

function normalizeEnum(value, options, fallback) {
  return options.indexOf(value) > -1 ? value : fallback;
}

function colorWithAlpha(color, alpha) {
  var value = String(color || '').trim();
  var opacity = Math.max(0, Math.min(1, Number(alpha)));
  var rgb = value.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (rgb) return 'rgba(' + rgb[1] + ',' + rgb[2] + ',' + rgb[3] + ',' + opacity + ')';
  var hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    var number = parseInt(hex[1], 16);
    return 'rgba(' + ((number >> 16) & 255) + ',' + ((number >> 8) & 255) + ',' + (number & 255) + ',' + opacity + ')';
  }
  return value;
}

function axisLabels(points) {
  var count = points.length;
  var step = count > 6 ? Math.ceil((count - 1) / 5) : 1;
  return points.map(function toAxisLabel(point, index) {
    return {
      key: point.key,
      label: point.label,
      visible: index === 0 || index === count - 1 || index % step === 0
    };
  });
}

function queryFactory(component) {
  if (typeof component.createSelectorQuery === 'function') return component.createSelectorQuery();
  if (typeof wx !== 'undefined' && wx.createSelectorQuery) return wx.createSelectorQuery().in(component);
  return null;
}

function pixelRatio() {
  return Math.max(1, Number(platformInfo.getWindowInfo().pixelRatio) || 1);
}

function trace(ctx, points, curve) {
  if (!points.length) return;
  ctx.moveTo(points[0].x, points[0].y);
  areaChartData.executeCommands(ctx, areaChartData.curveCommands(points, curve));
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    max: { type: Number, value: 0 },
    curve: { type: String, value: 'natural' },
    stacked: { type: Boolean, value: false },
    size: { type: String, value: 'medium' },
    showGrid: { type: Boolean, value: true },
    showXAxis: { type: Boolean, value: true },
    showLegend: { type: Boolean, value: true },
    showDots: { type: Boolean, value: false },
    animated: { type: Boolean, value: true },
    duration: { type: Number, value: 500 },
    ariaLabel: { type: String, value: '面积图' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    chartSeries: [],
    legend: [],
    axisLabels: [],
    empty: true,
    entered: false,
    rootClass: 'pui-area-chart pui-area-chart--natural pui-area-chart--medium',
    rootStyle: '',
    semanticLabel: '面积图：暂无数据'
  },
  observers: {
    'items,max,curve,stacked,size,showGrid,showXAxis,showLegend,showDots,animated,duration,ariaLabel,reduceMotion,colorScheme': function sync() {
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
      var normalized = areaChartData.normalizeAreaItems(this.data.items);
      var curve = normalizeEnum(this.data.curve, ['natural', 'linear', 'step'], 'natural');
      var size = normalizeEnum(this.data.size, ['small', 'medium', 'large'], 'medium');
      var duration = chartData.normalizeDuration(this.data.duration, 500);
      var semantic = (this.data.ariaLabel || '面积图') + (normalized.points.length
        ? '：' + normalized.points.map(function summarize(point) {
          var values = normalized.series.map(function seriesValue(series) {
            return series.label + ' ' + chartData.formatValue(series.values[normalized.points.indexOf(point)]);
          }).join('，');
          return point.label + ' ' + values;
        }).join('；')
        : '：暂无数据');
      this._areaData = normalized;
      this.setData({
        chartSeries: normalized.series.map(function seriesSummary(series) {
          return { key: series.key, label: series.label, theme: series.theme };
        }),
        legend: normalized.legend,
        axisLabels: axisLabels(normalized.points),
        empty: normalized.points.length === 0 || normalized.series.length === 0,
        entered: this.data.animated === false ? true : this.data.entered,
        semanticLabel: semantic,
        rootClass: [
          'pui-area-chart',
          this.getColorSchemeClass(),
          'pui-area-chart--' + curve,
          'pui-area-chart--' + size,
          this.data.stacked ? 'pui-area-chart--stacked' : '',
          this.data.showGrid ? 'pui-area-chart--grid' : '',
          this.data.reduceMotion ? 'pui-area-chart--reduced-motion' : ''
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
      if (!this._areaData || !this._areaData.points.length || !this._areaData.series.length) return;
      var query = queryFactory(this);
      if (!query) return;
      query
        .select('.pui-area-chart__canvas')
        .fields({ node: true, size: true })
        .selectAll('.pui-area-chart__probe')
        .fields({ dataset: true, computedStyle: ['background-color', 'opacity'] })
        .exec(function render(results) {
          var canvasInfo = results && results[0];
          if (!canvasInfo || !canvasInfo.node || !canvasInfo.width || !canvasInfo.height) return;
          var probes = results[1] || [];
          var fallback = this.data.colorScheme === 'dark' ? DARK_FALLBACK : LIGHT_FALLBACK;
          var colors = {};
          var fillStart = 0.42;
          var fillEnd = 0.04;
          probes.forEach(function readProbe(probe) {
            var dataset = probe.dataset || {};
            var background = probe['background-color'] || probe.backgroundColor || '';
            if (dataset.role === 'series') colors[dataset.key] = background || fallback.blue;
            if (dataset.role === 'grid') colors.grid = background || fallback.grid;
            if (dataset.role === 'fill-start') fillStart = Number(probe.opacity) || fillStart;
            if (dataset.role === 'fill-end') fillEnd = Number(probe.opacity) || fillEnd;
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
          var geometry = areaChartData.buildAreaGeometry(this._areaData, {
            width: width,
            height: height,
            max: this.data.max,
            stacked: this.data.stacked,
            curve: this.data.curve,
            padding: { top: 8, right: 5, bottom: 3, left: 5 }
          });
          if (this.data.showGrid) {
            ctx.save();
            ctx.strokeStyle = colors.grid || fallback.grid;
            ctx.lineWidth = 1;
            for (var gridIndex = 0; gridIndex < 4; gridIndex += 1) {
              var gridY = 8 + (geometry.plotHeight / 3) * gridIndex;
              ctx.beginPath();
              ctx.moveTo(5, gridY);
              ctx.lineTo(width - 5, gridY);
              ctx.stroke();
            }
            ctx.restore();
          }
          geometry.series.forEach(function drawSeries(series) {
            var color = colors[series.key] || fallback[series.theme] || fallback.blue;
            var reversedLower = series.lowerPoints.slice().reverse();
            ctx.save();
            ctx.beginPath();
            trace(ctx, series.upperPoints, this.data.curve);
            ctx.lineTo(reversedLower[0].x, reversedLower[0].y);
            areaChartData.executeCommands(ctx, areaChartData.curveCommands(reversedLower, this.data.curve));
            ctx.closePath();
            var gradient = ctx.createLinearGradient(0, 8, 0, geometry.baselineY);
            gradient.addColorStop(0, colorWithAlpha(color, fillStart));
            gradient.addColorStop(0.95, colorWithAlpha(color, fillEnd));
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.beginPath();
            trace(ctx, series.upperPoints, this.data.curve);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            if (this.data.showDots) {
              series.upperPoints.forEach(function drawDot(point) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
              });
            }
            ctx.restore();
          }, this);
        }.bind(this));
    }
  }
});
