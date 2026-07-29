var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Breadcrumb',
  data: {
    breadcrumbItems: [
      { label: '首页', value: 'home', icon: 'home' },
      { label: '组件库', value: 'library', icon: 'grid' },
      { label: '导航', value: 'navigation', icon: 'route' },
      { label: 'Breadcrumb', value: 'breadcrumb', icon: 'route' }
    ],
    breadcrumbValue: 'breadcrumb',
    breadcrumbError: true,
    breadcrumbLoading: false,
    breadcrumbStatus: '当前位置：Breadcrumb。'
  },
  onUnload: function onUnload() {
    clearTimeout(this._breadcrumbRetryTimer);
  },
  methods: {
    onBreadcrumbChange: function onBreadcrumbChange(event) {
      var value = event && event.detail ? event.detail.value : '';
      var labels = { home: '首页', library: '组件库', navigation: '导航', breadcrumb: 'Breadcrumb' };
      this.setData({ breadcrumbValue: value, breadcrumbStatus: '当前位置：' + (labels[value] || value) + '。' });
    },
    onBreadcrumbRetry: function onBreadcrumbRetry() {
      clearTimeout(this._breadcrumbRetryTimer);
      this.setData({
        breadcrumbError: false,
        breadcrumbLoading: true,
        breadcrumbStatus: '正在重新加载路径。'
      });
      this._breadcrumbRetryTimer = setTimeout(function finishBreadcrumbReload() {
        this._breadcrumbRetryTimer = null;
        this.setData({
          breadcrumbLoading: false,
          breadcrumbStatus: '路径已重新加载。'
        });
      }.bind(this), 600);
    }
  }
}));
