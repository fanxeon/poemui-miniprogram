var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Tour',
  data: {
    tourVisible: false,
    tourCurrent: 0,
    tourStatus: '点击开始引导。',
    tourSteps: [
      { key: 'search', selector: '#tour-search-target', title: '快速搜索', content: '这个入口用于快速找到组件。', placement: 'bottom' },
      { key: 'appearance', selector: '#tour-appearance-target', title: '外观设置', content: '这里可以切换主题和视觉效果。', placement: 'top' }
    ]
  },
  methods: {
    onOpenTour: function () {
      this.setData({ tourCurrent: 0, tourVisible: true, tourStatus: '引导已打开。' });
    },
    onTourVisibleChange: function (event) {
      var detail = event && event.detail || {};
      this.setData({
        tourVisible: Boolean(detail.visible),
        tourStatus: detail.visible ? '引导已打开。' : '引导已关闭：' + String(detail.reason || 'unknown')
      });
    },
    onTourCurrentChange: function (event) {
      var detail = event && event.detail || {};
      this.setData({ tourCurrent: Number(detail.current) || 0 });
    },
    onTourFinish: function () {
      this.setData({ tourStatus: '已完成全部引导。' });
    },
    onTourError: function (event) {
      var detail = event && event.detail || {};
      this.setData({ tourStatus: '目标不可用：' + String(detail.message || detail.code || 'unknown') });
    }
  }
}));
