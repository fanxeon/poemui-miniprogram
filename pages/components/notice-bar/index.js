var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'NoticeBar',
  data: {
    noticeVisible: true,
    noticeStatus: '公告正在显示。',
    verticalNotices: ['新增 12 个表单组件示例', '深色模式对比度已优化']
  },
  methods: {
    onNoticeClick: function (event) {
      var trigger = event && event.detail ? event.detail.trigger : '';
      if (trigger === 'operation') {
        this.setData({ noticeVisible: false, noticeStatus: '公告已由页面隐藏。' });
      }
    },
    onReopenNotice: function () {
      this.setData({ noticeVisible: true, noticeStatus: '公告已重新显示。' });
    }
  }
}));
