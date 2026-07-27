var createComponentPage = require('../../../utils/component-page');

var CONTENT_STATES = ['content', 'loading', 'empty'];

function nextContentState(current) {
  var index = CONTENT_STATES.indexOf(current);
  return CONTENT_STATES[(index + 1) % CONTENT_STATES.length];
}

Page(createComponentPage({
  title: 'Dialog',
  data: {
    dialogVisible: false,
    lockedDialogVisible: false,
    dialogContentState: 'content',
    dialogStatus: '草稿仍在，你可以先查看确认信息。',
    dialogCancelBtn: { content: '取消', ariaLabel: '取消当前操作' },
    dialogConfirmBtn: { content: '确认', theme: 'primary', ariaLabel: '确认当前操作' },
    dialogActions: [
      { content: '暂不处理', theme: 'default', ariaLabel: '暂不处理' },
      { content: '继续查看', theme: 'primary', ariaLabel: '继续查看详情' }
    ]
  },
  methods: {
    onOpenDialog: function () {
      this.setData({
        dialogVisible: true,
        dialogStatus: '请确认是否删除这份草稿。'
      });
    },
    onDialogConfirm: function () {
      this.setData({
        dialogVisible: false,
        dialogStatus: '删除选择已确认；示例不会真的删除内容。'
      });
    },
    onDialogCancel: function () {
      this.setData({ dialogStatus: '已取消删除，草稿保持不变。' });
    },
    onDialogClose: function (event) {
      var trigger = event && event.detail ? event.detail.trigger : '';
      this.setData({
        dialogVisible: false,
        dialogStatus: trigger === 'overlay' ? '已点击背景并关闭确认框。' : '确认框已关闭。'
      });
    },
    onDialogOverlayClick: function () {
      this.setData({ dialogStatus: '已点击背景，本确认框允许关闭。' });
    },
    onToggleDialogContent: function () {
      var next = nextContentState(this.data.dialogContentState);
      this.setData({
        dialogContentState: next,
        dialogStatus: next === 'loading' ? '正在读取说明。' : (next === 'empty' ? '当前没有补充说明。' : '发布说明已准备好。')
      });
    },
    onDialogAction: function (event) {
      var index = Number(event && event.detail ? event.detail.index : -1);
      this.setData({ dialogStatus: index === 0 ? '选择了暂不处理，说明仍保持打开。' : '选择了继续查看，说明仍保持打开。' });
    },
    onOpenLockedDialog: function () {
      this.setData({
        lockedDialogVisible: true,
        dialogStatus: '发布说明已打开，点击背景不会关闭。'
      });
    },
    onLockedDialogClose: function (event) {
      this.setData({
        lockedDialogVisible: false,
        dialogStatus: '发布说明已关闭。'
      });
    },
    onLockedDialogOverlayClick: function () {
      this.setData({ dialogStatus: '点击背景不会关闭，请使用顶部关闭按钮。' });
    }
  }
}));
