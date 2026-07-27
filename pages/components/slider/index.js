var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Slider',
  data: { sliderValue: 40, sliderStatus: '拖动滑块调整百分比。' },
  methods: {
    onSliderChanging: function (event) { var value = Number(event && event.detail && event.detail.value); this.setData({ sliderValue: value, sliderStatus: '正在调整为 ' + value + '%。' }); },
    onSliderChange: function (event) { var value = Number(event && event.detail && event.detail.value); this.setData({ sliderValue: value, sliderStatus: '已确认 ' + value + '%。' }); }
  }
}));
