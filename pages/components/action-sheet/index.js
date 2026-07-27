var createComponentPage = require('../../../utils/component-page');

var ACTION_ITEMS = [
  { label: '新建任务', icon: 'add' },
  { label: '导入文件', icon: 'upload' },
  { label: '分享结果', icon: 'share' }
];

Page(createComponentPage({
  title: 'ActionSheet',
  data: {
    actionSheetVisible: false,
    actionSheetBlurOverlay: false,
    actionItems: ACTION_ITEMS,
    lastAction: '打开动作面板选择一个真实动作。'
  },
  methods: {
    onOpenActionSheet: function () {
      this.setData({ actionSheetVisible: true, lastAction: 'ActionSheet 已打开' });
    },
    onActionSheetVisibleChange: function (event) {
      var visible = Boolean(event && event.detail && event.detail.visible);
      this.setData({ actionSheetVisible: visible, lastAction: visible ? 'ActionSheet 已打开' : 'ActionSheet 已关闭' });
    },
    onActionSelected: function (event) {
      var item = event && event.detail ? event.detail.selected : null;
      this.setData({ lastAction: '已选择：' + (item && item.label ? item.label : '动作') });
    },
    onActionCancelled: function () {
      this.setData({ lastAction: '已取消 ActionSheet' });
    },
    onActionSheetBlurChange: function (event) {
      var checked = Boolean(event && event.detail && event.detail.checked);
      this.setData({
        actionSheetBlurOverlay: checked,
        lastAction: checked ? 'ActionSheet 遮罩毛玻璃已开启' : 'ActionSheet 遮罩毛玻璃已关闭'
      });
    }
  }
}));
