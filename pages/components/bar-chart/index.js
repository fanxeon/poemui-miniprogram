var createComponentPage = require('../../../utils/component-page');

var INITIAL_ITEMS = [
  { key: 'foundation', label: '基础', segments: [{ key: 'existing', label: '已有', value: 8 }, { key: 'added', label: '本次新增', value: 2 }] },
  { key: 'form', label: '表单', segments: [{ key: 'existing', label: '已有', value: 38 }, { key: 'added', label: '本次新增', value: 6 }] },
  { key: 'data', label: '数据展示', segments: [{ key: 'existing', label: '已有', value: 18 }, { key: 'added', label: '本次新增', value: 26 }] },
  { key: 'advanced', label: '高级', segments: [{ key: 'existing', label: '已有', value: 52 }, { key: 'added', label: '本次新增', value: 8 }] }
];
var HIGH_VARIANCE_ITEMS = [
  { key: 'foundation', label: '基础', segments: [{ key: 'existing', label: '已有', value: 48 }, { key: 'added', label: '本次新增', value: 14 }] },
  { key: 'form', label: '表单', segments: [{ key: 'existing', label: '已有', value: 12 }, { key: 'added', label: '本次新增', value: 4 }] },
  { key: 'data', label: '数据展示', segments: [{ key: 'existing', label: '已有', value: 44 }, { key: 'added', label: '本次新增', value: 18 }] },
  { key: 'advanced', label: '高级', segments: [{ key: 'existing', label: '已有', value: 14 }, { key: 'added', label: '本次新增', value: 34 }] }
];

Page(createComponentPage({
  title: 'BarChart',
  data: {
    chartItems: INITIAL_ITEMS,
    highVariance: false,
    chartMode: 'stacked'
  },
  methods: {
    onToggleChartData: function () {
      var highVariance = !this.data.highVariance;
      this.setData({
        highVariance: highVariance,
        chartItems: highVariance ? HIGH_VARIANCE_ITEMS : INITIAL_ITEMS
      }, function replayChangedData() {
        var chart = this.selectComponent && this.selectComponent('#bar-chart-demo');
        if (chart && chart.replay) chart.replay();
      });
    },
    onToggleChartMode: function () {
      this.setData({ chartMode: this.data.chartMode === 'stacked' ? 'grouped' : 'stacked' });
    },
    onReplay: function () {
      var chart = this.selectComponent('#bar-chart-demo');
      if (chart && chart.replay) chart.replay();
    }
  }
}));
