var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'BackTop',
  data: {
    pageScrollTop: 0,
    backTopStatus: '向下滚动页面，回到顶部入口会出现。',
    backTopRows: [
      '导航组件需要在长内容中保持可抵达。',
      '滚动位置由唯一的页面 ScrollArea 真实维护。',
      'BackTop 只负责表达回顶意图，不接管业务状态。',
      '点击回顶后，同一个滚动区的位置会回到零。',
      '这样不会额外创建第二个滚动容器。',
      '反馈组件补充明确的下一步操作。',
      '浮层组件统一限制在屏幕边界内。',
      '表单输入保留错误和取消结果。',
      '数据展示组件减少重复状态面板。',
      '高级组件保持唯一滚动上下文。',
      '390px 页面继续保证文字可读。',
      '深色模式使用同一套语义颜色。',
      '最后一项用于确认回顶距离充足。'
    ]
  },
  methods: {
    onPageScroll: function onPageScroll(event) {
      var top = Number(event && event.detail && event.detail.scrollTop) || 0;
      this.setData({ pageScrollTop: top });
    },
    onBackTop: function onBackTop() {
      this.setData({ pageScrollTop: 0, backTopStatus: '已请求回到页面顶部。' });
    }
  }
}));
