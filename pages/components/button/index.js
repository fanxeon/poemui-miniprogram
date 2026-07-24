var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Button',
  data: {
    loadingProps: { ariaLabel: '提交中' },
    actionCount: 0,
    lastAction: '点击任一可用按钮查看真实回写'
  },
  methods: {
    onButtonAction: function (event) {
      var action = event && event.currentTarget && event.currentTarget.dataset
        ? event.currentTarget.dataset.action
        : '';
      var count = Number(this.data.actionCount || 0) + 1;
      this.setData({
        actionCount: count,
        lastAction: '最近操作：' + (action || '按钮') + ' · ' + count + ' 次'
      });
    }
  }
}));
