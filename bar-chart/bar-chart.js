var themeBehavior = require('../common/behaviors/theme');
var chartData = require('../common/utils/chart-data');

function normalizeEnum(value, options, fallback) {
  return options.indexOf(value) > -1 ? value : fallback;
}

function ratio(value, maximum) {
  if (!maximum) return 0;
  return Math.max(0, Math.min(100, Math.round((value / maximum) * 10000) / 100));
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    orientation: { type: String, value: 'horizontal' },
    mode: { type: String, value: 'stacked' },
    max: { type: Number, value: 0 },
    size: { type: String, value: 'medium' },
    showValue: { type: Boolean, value: true },
    showLegend: { type: Boolean, value: true },
    showGrid: { type: Boolean, value: false },
    animated: { type: Boolean, value: true },
    duration: { type: Number, value: 500 },
    ariaLabel: { type: String, value: '条形图' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    chartItems: [],
    legend: [],
    scaleMax: 1,
    empty: true,
    entered: false,
    rootClass: 'pui-bar-chart pui-bar-chart--horizontal pui-bar-chart--stacked pui-bar-chart--medium',
    rootStyle: '',
    semanticLabel: '条形图：暂无数据'
  },
  observers: {
    'items,orientation,mode,max,size,showValue,showLegend,showGrid,animated,duration,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._attached = true;
      this.syncState();
      this._playEntrance();
    },
    detached: function detached() {
      this._attached = false;
      clearTimeout(this._entranceTimer);
    }
  },
  methods: {
    syncState: function syncState() {
      var normalized = chartData.normalizeItems(
        this.data.items,
        ['blue', 'teal', 'violet'],
        { cycleSingleItems: false }
      );
      var orientation = normalizeEnum(this.data.orientation, ['horizontal', 'vertical'], 'horizontal');
      var mode = normalizeEnum(this.data.mode, ['stacked', 'grouped'], 'stacked');
      var size = normalizeEnum(this.data.size, ['small', 'medium', 'large'], 'medium');
      var derivedMax = normalized.items.reduce(function findMaximum(result, item) {
        if (mode === 'grouped') {
          return Math.max(result, item.segments.reduce(function segmentMax(maximum, segment) {
            return Math.max(maximum, segment.value);
          }, 0));
        }
        return Math.max(result, item.total);
      }, 0);
      var explicitMax = chartData.finiteNonNegative(this.data.max);
      var scaleMax = explicitMax > 0 ? explicitMax : (derivedMax || 1);
      var chartItems = normalized.items.map(function prepareItem(item, itemIndex) {
        return {
          key: item.key,
          label: item.label,
          total: item.total,
          valueText: item.valueText,
          style: '--pui-chart-delay:' + chartData.entranceDelay(itemIndex, 45, 225) + 'ms;',
          segments: item.segments.map(function prepareSegment(segment) {
            return {
              key: segment.key,
              label: segment.label,
              value: segment.value,
              valueText: segment.valueText,
              theme: segment.theme,
              style: '--pui-bar-ratio:' + ratio(segment.value, scaleMax) + '%;'
            };
          })
        };
      });
      var semantic = (this.data.ariaLabel || '条形图') + (chartItems.length
        ? '：' + chartItems.map(function summarize(item) { return item.label + ' ' + item.valueText; }).join('，')
        : '：暂无数据');
      this.setData({
        chartItems: chartItems,
        legend: normalized.legend,
        scaleMax: scaleMax,
        empty: chartItems.length === 0,
        semanticLabel: semantic,
        rootClass: [
          'pui-bar-chart',
          this.getColorSchemeClass(),
          'pui-bar-chart--' + orientation,
          'pui-bar-chart--' + mode,
          'pui-bar-chart--' + size,
          this.data.showGrid ? 'pui-bar-chart--grid' : '',
          this.data.reduceMotion ? 'pui-bar-chart--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        entered: this.data.animated === false ? true : this.data.entered,
        rootStyle: '--pui-chart-duration:' + (this.data.reduceMotion ? '1ms' : chartData.normalizeDuration(this.data.duration, 500) + 'ms') + ';'
      });
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
    }
  }
});
