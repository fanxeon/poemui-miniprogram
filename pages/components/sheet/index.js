var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Sheet',
  data: {
    sheetVisible: false,
    lastAction: '打开底部面板查看真实拖拽与内容结构。'
  },
  methods: {
    onOpenSheet: function () {
      this.setData({ sheetVisible: true, lastAction: 'Sheet 已打开' });
    },
    onSheetChange: function (event) {
      var detail = event && event.detail ? event.detail : {};
      this.setData({
        sheetVisible: Boolean(detail.visible),
        lastAction: detail.visible ? 'Sheet 已打开' : 'Sheet 已关闭'
      });
    },
    onSheetFooterAction: function () {
      this.setData({ sheetVisible: false, lastAction: '已通过 Footer 关闭 Sheet' });
    }
  }
}));
