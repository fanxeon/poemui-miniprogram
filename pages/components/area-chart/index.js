var createComponentPage = require('../../../utils/component-page');

var INITIAL_ITEMS = [
  { key: 'jan', label: '1月', segments: [{ key: 'desktop', label: '桌面端', value: 72, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 220, theme: 'teal' }] },
  { key: 'feb', label: '2月', segments: [{ key: 'desktop', label: '桌面端', value: 320, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 58, theme: 'teal' }] },
  { key: 'mar', label: '3月', segments: [{ key: 'desktop', label: '桌面端', value: 96, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 278, theme: 'teal' }] },
  { key: 'apr', label: '4月', segments: [{ key: 'desktop', label: '桌面端', value: 350, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 76, theme: 'teal' }] },
  { key: 'may', label: '5月', segments: [{ key: 'desktop', label: '桌面端', value: 128, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 306, theme: 'teal' }] },
  { key: 'jun', label: '6月', segments: [{ key: 'desktop', label: '桌面端', value: 286, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 112, theme: 'teal' }] }
];
var HIGH_VARIANCE_ITEMS = [
  { key: 'jan', label: '1月', segments: [{ key: 'desktop', label: '桌面端', value: 310, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 84, theme: 'teal' }] },
  { key: 'feb', label: '2月', segments: [{ key: 'desktop', label: '桌面端', value: 88, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 290, theme: 'teal' }] },
  { key: 'mar', label: '3月', segments: [{ key: 'desktop', label: '桌面端', value: 338, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 104, theme: 'teal' }] },
  { key: 'apr', label: '4月', segments: [{ key: 'desktop', label: '桌面端', value: 112, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 330, theme: 'teal' }] },
  { key: 'may', label: '5月', segments: [{ key: 'desktop', label: '桌面端', value: 360, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 92, theme: 'teal' }] },
  { key: 'jun', label: '6月', segments: [{ key: 'desktop', label: '桌面端', value: 140, theme: 'blue' }, { key: 'mobile', label: '移动端', value: 348, theme: 'teal' }] }
];

Page(createComponentPage({
  title: 'AreaChart',
  data: {
    trendItems: INITIAL_ITEMS,
    highVariance: false,
    curve: 'natural',
    stacked: false
  },
  methods: {
    onReplay: function () {
      var chart = this.selectComponent('#area-chart-demo');
      if (chart && chart.replay) chart.replay();
    },
    onToggleData: function () {
      var highVariance = !this.data.highVariance;
      this.setData({
        highVariance: highVariance,
        trendItems: highVariance ? HIGH_VARIANCE_ITEMS : INITIAL_ITEMS
      }, function replayChangedData() {
        var chart = this.selectComponent && this.selectComponent('#area-chart-demo');
        if (chart && chart.replay) chart.replay();
      });
    },
    onToggleCurve: function () {
      var sequence = ['natural', 'linear', 'step'];
      var current = sequence.indexOf(this.data.curve);
      this.setData({ curve: sequence[(current + 1) % sequence.length] });
    },
    onToggleStacked: function () {
      this.setData({ stacked: !this.data.stacked });
    }
  }
}));
