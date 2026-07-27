var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Empty',
  data: { emptyStatus: '当前筛选没有匹配内容。' },
  methods: {
    onClearFilter: function () {
      this.setData({ emptyStatus: '筛选条件已清除，可以重新浏览全部组件。' });
    }
  }
}));
