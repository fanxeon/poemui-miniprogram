var createComponentPage = require('../../../utils/component-page');
Page(createComponentPage({ title: 'Sticky', data: { stickyOffset: 0, stickyNavbarOffset: 0, stickyExtraOffset: 0, stickyDisabled: false, stickyStatus: '在 ScrollArea 中滚动以观察固定状态。', stickyRows: ['吸顶组件读取实际滚动位置。', '偏移量仍由页面明确传入。', '禁用时组件解除固定。', '继续滚动以验证固定占位。', '滚动内容不会穿过标题。', '较长列表仍保持连续阅读。', '返回上方时标题恢复原位。', '偏移变化不会重建列表。', '暂停吸顶后保持普通文档流。', '底部内容保持可读。'] }, onLayoutMeasured: function (layout) {
  var navbar = Math.max(0, Number(layout && layout.navbarHeight) || 0);
  this.setData({ stickyNavbarOffset: navbar, stickyOffset: navbar + (Number(this.data.stickyExtraOffset) || 0) });
}, methods: {
  onStickyHostScroll: function (event) { var detail = event && event.detail ? event.detail : {}; var sticky = this.selectComponent && this.selectComponent('#sticky-demo'); if (sticky && typeof sticky.onPageScroll === 'function') sticky.onPageScroll({ scrollTop: Number(detail.scrollTop) || 0 }); this.setData({ stickyStatus: Number(detail.scrollTop) > 80 ? '“本月更新”正在顶部保持可见。' : '继续向上滑动，观察分组标题的位置。' }); },
  onToggleStickyOffset: function () { var extra = this.data.stickyExtraOffset ? 0 : 24; var offset = (Number(this.data.stickyNavbarOffset) || 0) + extra; this.setData({ stickyExtraOffset: extra, stickyOffset: offset, stickyStatus: '吸顶位置已避开导航栏，并额外留出 ' + extra + 'px。' }); },
  onToggleStickyDisabled: function () { this.setData({ stickyDisabled: !this.data.stickyDisabled, stickyStatus: this.data.stickyDisabled ? 'Sticky 已重新启用。' : 'Sticky 已禁用并解除固定。' }); }
}}));
