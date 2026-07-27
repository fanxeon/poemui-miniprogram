var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Switch',
  data: { switchValue: false, switchLabels: ['开启', '关闭'], switchStatus: '更新通知已关闭。' },
  methods: {
    onSwitchChange: function (event) { var value = Boolean(event && event.detail && event.detail.value); this.setData({ switchValue: value, switchStatus: value ? '已开启通知。' : '已关闭通知。' }); }
  }
}));
