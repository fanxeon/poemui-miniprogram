var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Rate',
  data: { rateValue: 3, rateStatus: '当前评分：3 星，一般。', rateTexts: ['很差', '较差', '一般', '满意', '很好'] },
  methods: {
    onRateChange: function (event) { var value = Number(event && event.detail && event.detail.value); this.setData({ rateValue: value, rateStatus: '已评分 ' + value + ' 星。' }); }
  }
}));
