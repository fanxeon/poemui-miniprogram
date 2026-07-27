var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Stepper',
  data: { stepperValue: 1, stepperStatus: '使用加减按钮调整数量。' },
  methods: {
    onStepperChange: function (event) { var value = Number(event && event.detail && event.detail.value); this.setData({ stepperValue: value, stepperStatus: '数量已调整为 ' + value + '。' }); },
    onStepperOverlimit: function (event) { var type = event && event.detail ? event.detail.type : 'limit'; this.setData({ stepperStatus: type === 'plus' ? '已达到最大数量。' : '已达到最小数量。' }); }
  }
}));
