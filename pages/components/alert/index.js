var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Alert',
  data: {
    alertVisible: true,
    alertStatus: '这条提醒可以关闭。'
  },
  methods: {
    onAlertChange: function (event) {
      var visible = Boolean(event && event.detail && event.detail.visible);
      this.setData({
        alertVisible: visible,
        alertStatus: visible ? '提醒已重新显示。' : '提醒已关闭，草稿仍会继续保存。'
      });
    },
    onReopenAlert: function () {
      this.setData({ alertVisible: true, alertStatus: '提醒已重新显示。' });
    }
  }
}));
