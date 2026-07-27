var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Popover',
  data: {
    popoverVisible: false,
    popoverPlacement: 'top',
    lastAction: '点击锚点查看气泡浮层。'
  },
  methods: {
    onOpenPopover: function (event) {
      var placement = event && event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.placement;
      placement = placement || this.data.popoverPlacement || 'top';
      this.setData({
        popoverPlacement: placement,
        popoverVisible: true,
        lastAction: '已打开气泡'
      });
    },
    onPopoverVisibleChange: function (event) {
      var visible = Boolean(event && event.detail && event.detail.visible);
      this.setData({
        popoverVisible: visible,
        lastAction: visible ? 'Popover 已打开' : 'Popover 已关闭'
      });
    }
  }
}));
