var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: '开始使用',
  data: { guideStatus: '先安装 npm 包，再由微信开发者工具构建 npm。' },
  methods: {
    onOpenQuickStyles: function () { this.setData({ guideStatus: '正在打开快速样式页。' }); wx.redirectTo({ url: '/pages/styles/index' }); }
  }
}));
