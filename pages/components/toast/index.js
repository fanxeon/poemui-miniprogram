var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Toast',
  data: { toastStatus: '请选择一种提示样式。' },
  methods: {
    onShowToast: function (event) {
      var theme = event && event.currentTarget && event.currentTarget.dataset
        ? event.currentTarget.dataset.theme
        : '';
      var toast = this.selectComponent('#feedback-toast');
      if (!toast || typeof toast.show !== 'function') return;
      toast.show({
        message: theme === 'loading' ? '正在保存草稿' : '草稿已保存',
        theme: theme,
        placement: 'middle'
      });
      this.setData({ toastStatus: theme === 'loading' ? '正在保存，不会提前显示成功。' : '保存结果提示已显示。' });
    },
    onToastClose: function () {
      this.setData({ toastStatus: '提示已结束。' });
    }
  }
}));
