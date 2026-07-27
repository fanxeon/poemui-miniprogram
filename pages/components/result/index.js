var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Result',
  data: { resultStatus: '检查完成后可以返回组件目录。' },
  methods: {
    onReturnCatalog: function () {
      this.setData({ resultStatus: '正在返回组件目录。' });
      this.onBack();
    }
  }
}));
