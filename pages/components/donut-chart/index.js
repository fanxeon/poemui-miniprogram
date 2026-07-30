var createComponentPage = require('../../../utils/component-page');

var INITIAL_ITEMS = [
  { key: 'basic', label: '基础', value: 24, theme: 'blue' },
  { key: 'form', label: '表单', value: 18, theme: 'teal' },
  { key: 'data', label: '数据', value: 22, theme: 'pink' },
  { key: 'advanced', label: '高级', value: 14, theme: 'violet' }
];
var ALTERNATE_ITEMS = [
  { key: 'basic', label: '基础', value: 12, theme: 'blue' },
  { key: 'form', label: '表单', value: 36, theme: 'teal' },
  { key: 'data', label: '数据', value: 8, theme: 'pink' },
  { key: 'advanced', label: '高级', value: 28, theme: 'violet' }
];

Page(createComponentPage({
  title: 'DonutChart',
  data: {
    donutItems: INITIAL_ITEMS,
    alternate: false,
    gapAngle: 3
  },
  methods: {
    onReplay: function () {
      var chart = this.selectComponent('#donut-chart-demo');
      if (chart && chart.replay) chart.replay();
    },
    onToggleData: function () {
      var alternate = !this.data.alternate;
      this.setData({
        alternate: alternate,
        donutItems: alternate ? ALTERNATE_ITEMS : INITIAL_ITEMS
      }, this.onReplay.bind(this));
    },
    onToggleGap: function () {
      this.setData({ gapAngle: this.data.gapAngle === 3 ? 8 : 3 });
    }
  }
}));
