var createComponentPage = require('../../../utils/component-page');

function rpxHeight(px, windowWidth) {
  var ratio = Number(windowWidth) / 750;
  return Math.max(1, Math.floor(Number(px) / (ratio || 0.5)));
}
var NAMES = ['Button', 'Input', 'Cell', 'Tabs', 'Dialog', 'Table', 'Calendar', 'Toast'];
var GROUPS = ['基础组件', '表单组件', '数据展示', '导航组件'];
function items() {
  return Array.from({ length: 120 }, function (_, index) {
    var name = NAMES[index % NAMES.length];
    return {
      value: 'item-' + index,
      label: name + ' 示例 ' + String(index + 1).padStart(3, '0'),
      description: GROUPS[index % GROUPS.length] + ' · 最近更新于 ' + ((index % 12) + 1) + ' 月',
      icon: 'component',
      disabled: index === 7
    };
  });
}
Page(createComponentPage({ title: 'VirtualList', data: { virtualItems: items(), virtualValue: 'item-0', virtualScrollTop: 0, virtualListHeight: 1, virtualMultiple: false, virtualStatus: '共有 120 条资源，滚动时只绘制屏幕附近的内容。' }, methods: {
  measureLayout: function () {
    var windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : {};
    var windowHeight = Number(windowInfo.windowHeight);
    if (!windowHeight || !this.createSelectorQuery) return;
    this.createSelectorQuery().select('#component-navbar').boundingClientRect(function (navbarRect) {
      var navbarHeight = navbarRect && Number(navbarRect.height);
      if (!navbarHeight) return;
      var contentHeight = Math.max(1, Math.floor(windowHeight - navbarHeight));
      this.setData({
        navbarHeight: Math.max(1, Math.floor(navbarHeight)) + 'px',
        scrollAreaHeight: contentHeight + 'px',
        virtualListHeight: rpxHeight(contentHeight, windowInfo.windowWidth),
        layoutReady: true
      });
    }.bind(this)).exec();
  },
  onVirtualChange: function (event) { var detail = event && event.detail ? event.detail : {}; this.setData({ virtualValue: detail.value, virtualStatus: this.data.virtualMultiple ? '已更新批量选择。' : '已选择一条资源。' }); },
  onVirtualItemClick: function (event) { var detail = event && event.detail ? event.detail : {}; this.setData({ virtualStatus: '已点击第 ' + ((Number(detail.index) || 0) + 1) + ' 项。' }); },
  onVirtualScroll: function (event) { var detail = event && event.detail ? event.detail : {}; this.setData({ virtualStatus: '当前窗口 ' + detail.visibleStart + '–' + detail.visibleEnd + '。' }); },
  onVirtualToTop: function () { this.setData({ virtualScrollTop: 0, virtualStatus: '列表已回到顶部。' }); },
  onToggleVirtualMultiple: function () { this.setData({ virtualMultiple: !this.data.virtualMultiple, virtualValue: this.data.virtualMultiple ? 'item-0' : ['item-0'], virtualStatus: this.data.virtualMultiple ? '已切换为单选。' : '已切换为批量选择。' }); },
  onVirtualRetry: function () { this.setData({ virtualStatus: '已收到重新加载请求，当前列表保持不变。' }); }
}}));
