var themeBehavior = require('../common/behaviors/theme');
var chartData = require('../common/utils/chart-data');

function normalizeEnum(value, options, fallback) {
  return options.indexOf(value) > -1 ? value : fallback;
}

function opacityFor(index, count) {
  if (count <= 1) return 1;
  return Math.round((1 - (index / (count - 1)) * 0.72) * 100) / 100;
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    columns: { type: Number, value: 10 },
    groupColumns: { type: Number, value: 0 },
    shape: { type: String, value: 'rounded' },
    size: { type: String, value: 'medium' },
    unit: { type: Number, value: 1 },
    maxCells: { type: Number, value: 100 },
    showValue: { type: Boolean, value: true },
    showLegend: { type: Boolean, value: true },
    animated: { type: Boolean, value: true },
    duration: { type: Number, value: 500 },
    ariaLabel: { type: String, value: '组件点阵图' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    chartItems: [],
    legend: [],
    empty: true,
    effectiveUnit: 1,
    scaled: false,
    entered: false,
    rootClass: 'pui-waffle pui-waffle--rounded pui-waffle--medium',
    rootStyle: '',
    semanticLabel: '组件点阵图：暂无数据'
  },
  observers: {
    'items,columns,groupColumns,shape,size,unit,maxCells,showValue,showLegend,animated,duration,ariaLabel,reduceMotion,colorScheme': function sync() {
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
      var normalized = chartData.normalizeItems(this.data.items);
      var columns = chartData.clampInteger(this.data.columns, 4, 12, 10);
      var groupColumns = Number(this.data.groupColumns) > 0 ? chartData.clampInteger(this.data.groupColumns, 1, columns, columns) : 0;
      var maxCells = chartData.clampInteger(this.data.maxCells, 1, 200, 100);
      var requestedUnit = chartData.finiteNonNegative(this.data.unit) || 1;
      var total = normalized.items.reduce(function totalItems(result, item) { return result + item.total; }, 0);
      var effectiveUnit = Math.max(requestedUnit, total > 0 ? Math.ceil(total / maxCells) : requestedUnit);
      var remaining = maxCells;
      var animationIndex = 0;
      var chartItems = normalized.items.map(function prepareItem(item) {
        var cells = [];
        item.segments.forEach(function prepareSegment(segment) {
          var count = Math.min(remaining, Math.ceil(segment.value / effectiveUnit));
          for (var index = 0; index < count; index += 1) {
            var cellIndex = cells.length;
            cells.push({
              key: item.key + '-' + segment.key + '-' + index,
              theme: segment.theme,
              groupStart: !!(groupColumns && cellIndex > 0 && cellIndex % groupColumns === 0 && cellIndex % columns !== 0),
              style: '--pui-waffle-opacity:' + opacityFor(index, count) + ';--pui-chart-delay:' + chartData.entranceDelay(animationIndex, 14, 224) + 'ms;'
            });
            animationIndex += 1;
          }
          remaining -= count;
        });
        return {
          key: item.key,
          label: item.label,
          total: item.total,
          valueText: item.valueText,
          cells: cells
        };
      });
      var shape = normalizeEnum(this.data.shape, ['rounded', 'circle', 'square'], 'rounded');
      var size = normalizeEnum(this.data.size, ['small', 'medium', 'large'], 'medium');
      var semantic = (this.data.ariaLabel || '组件点阵图') + (chartItems.length
        ? '：' + chartItems.map(function summarize(item) { return item.label + ' ' + item.valueText; }).join('，') + (effectiveUnit > requestedUnit ? '；每格代表 ' + chartData.formatValue(effectiveUnit) : '')
        : '：暂无数据');
      this.setData({
        chartItems: chartItems,
        legend: normalized.legend,
        empty: chartItems.length === 0,
        effectiveUnit: chartData.formatValue(effectiveUnit),
        scaled: effectiveUnit > requestedUnit,
        semanticLabel: semantic,
        rootClass: [
          'pui-waffle',
          this.getColorSchemeClass(),
          'pui-waffle--' + shape,
          'pui-waffle--' + size,
          groupColumns ? 'pui-waffle--grouped' : '',
          this.data.reduceMotion ? 'pui-waffle--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        entered: this.data.animated === false ? true : this.data.entered,
        rootStyle: '--pui-waffle-columns:' + columns + ';--pui-waffle-group-columns:' + (groupColumns || columns) + ';--pui-chart-duration:' + (this.data.reduceMotion ? '1ms' : chartData.normalizeDuration(this.data.duration, 500) + 'ms') + ';'
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
