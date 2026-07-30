var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'SortableList',
  data: {
    sortableItems: [
      { key: 'install', title: '安装组件', description: '构建 npm 并注册组件', icon: 'download' },
      { key: 'theme', title: '配置主题', description: '挂载 ConfigProvider', icon: 'palette' },
      { key: 'compose', title: '组合页面', description: '优先复用 PUI 组件', icon: 'component' },
      { key: 'verify', title: '完成验收', description: '同步 H5、合同与测试', icon: 'check-circle' },
      { key: 'publish', title: '准备发布', description: '当前版本只打包，不发布', icon: 'package', disabled: true }
    ],
    dragFrom: 'handle',
    orderStatus: '长按右侧句柄调整顺序。'
  },
  methods: {
    onOrderChange: function (event) {
      var detail = event && event.detail || {};
      this.setData({
        sortableItems: detail.items || this.data.sortableItems,
        orderStatus: '已调整第 ' + (Number(detail.from) + 1) + ' 项到第 ' + (Number(detail.to) + 1) + ' 项；本页已按事件回写。'
      });
    },
    onOrderCancel: function () {
      this.setData({ orderStatus: '本次拖动已取消，顺序没有改变。' });
    },
    onToggleDragFrom: function () {
      var next = this.data.dragFrom === 'handle' ? 'item' : 'handle';
      this.setData({
        dragFrom: next,
        orderStatus: next === 'handle' ? '长按右侧句柄调整顺序。' : '长按整行调整顺序。'
      });
    }
  }
}));
