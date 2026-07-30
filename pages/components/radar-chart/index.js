var createComponentPage = require('../../../utils/component-page');

var INDICATORS = [
  { key: 'api', label: 'API', max: 100 },
  { key: 'theme', label: '主题', max: 100 },
  { key: 'motion', label: '动效', max: 100 },
  { key: 'a11y', label: '无障碍', max: 100 },
  { key: 'docs', label: '文档', max: 100 }
];
var INITIAL_SERIES = [
  { key: 'current', label: '当前版本', values: [88, 92, 78, 84, 90], theme: 'violet' },
  { key: 'baseline', label: '基线', values: [72, 75, 66, 70, 74], theme: 'blue' }
];
var ALTERNATE_SERIES = [
  { key: 'current', label: '当前版本', values: [96, 80, 92, 72, 94], theme: 'violet' },
  { key: 'baseline', label: '基线', values: [62, 86, 58, 88, 64], theme: 'blue' }
];

Page(createComponentPage({
  title: 'RadarChart',
  data: {
    radarIndicators: INDICATORS,
    radarSeries: INITIAL_SERIES,
    alternate: false,
    showDots: true
  },
  methods: {
    onReplay: function () {
      var chart = this.selectComponent('#radar-chart-demo');
      if (chart && chart.replay) chart.replay();
    },
    onToggleData: function () {
      var alternate = !this.data.alternate;
      this.setData({
        alternate: alternate,
        radarSeries: alternate ? ALTERNATE_SERIES : INITIAL_SERIES
      }, this.onReplay.bind(this));
    },
    onToggleDots: function () {
      this.setData({ showDots: !this.data.showDots });
    }
  }
}));
