var createComponentPage = require('../../../utils/component-page');

var INITIAL_ITEMS = [
  {
    key: 'components',
    label: '组件总量',
    segments: [
      { key: 'existing', label: '已有', value: 24, theme: 'neutral' },
      { key: 'added', label: '本次新增', value: 8, theme: 'violet' }
    ]
  }
];
var HIGH_VARIANCE_ITEMS = [
  {
    key: 'components',
    label: '组件总量',
    segments: [
      { key: 'existing', label: '已有', value: 62, theme: 'neutral' },
      { key: 'added', label: '本次新增', value: 24, theme: 'violet' }
    ]
  }
];

Page(createComponentPage({
  title: 'Waffle',
  data: {
    waffleItems: INITIAL_ITEMS,
    scaledWaffleItems: [{ key: 'coverage', label: '测试用例', value: 486, theme: 'teal' }],
    highVariance: false,
    waffleShape: 'rounded'
  },
  methods: {
    onToggleWaffleData: function () {
      var highVariance = !this.data.highVariance;
      this.setData({
        highVariance: highVariance,
        waffleItems: highVariance ? HIGH_VARIANCE_ITEMS : INITIAL_ITEMS
      }, function replayChangedData() {
        var chart = this.selectComponent && this.selectComponent('#waffle-demo');
        if (chart && chart.replay) chart.replay();
      });
    },
    onToggleWaffleShape: function () {
      this.setData({ waffleShape: this.data.waffleShape === 'rounded' ? 'circle' : 'rounded' });
    },
    onReplay: function () {
      var chart = this.selectComponent('#waffle-demo');
      if (chart && chart.replay) chart.replay();
    }
  }
}));
