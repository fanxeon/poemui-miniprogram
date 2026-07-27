var createComponentPage = require('../../../utils/component-page');
Page(createComponentPage({ title: 'Card', data: { cardClicks: 0, cardStatus: '点击卡片或底部操作查看不同反馈。' }, methods: { onCardClick: function () { var count = this.data.cardClicks + 1; this.setData({ cardClicks: count, cardStatus: '已选择 Tabs 组件验收卡。' }); }, onCardAction: function () { this.setData({ cardStatus: '正在查看验收结果。' }); } }}));
