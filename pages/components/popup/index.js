var createComponentPage = require('../../../utils/component-page');

var PLACEMENTS = ['top', 'bottom', 'left', 'right', 'center'];

Page(createComponentPage({
  title: 'Popup',
  data: {
    popupVisible: false,
    popupPlacement: 'bottom',
    popupCard: true,
    popupBlurOverlay: false,
    lastAction: '选择一个方向，打开真实 Popup。'
  },
  methods: {
    onOpenPopup: function (event) {
      var placement = event && event.currentTarget && event.currentTarget.dataset
        ? event.currentTarget.dataset.placement
        : 'bottom';
      if (PLACEMENTS.indexOf(placement) === -1) return;

      this.setData({
        popupPlacement: placement,
        popupVisible: true,
        lastAction: '已打开 ' + placement + ' Popup'
      });
    },

    onPopupVisibleChange: function (event) {
      var detail = event && event.detail ? event.detail : {};
      var visible = Boolean(detail.visible);
      var trigger = detail.trigger || 'state';
      this.setData({
        popupVisible: visible,
        lastAction: visible
          ? 'Popup 已打开'
          : trigger === 'overlay' ? '已通过遮罩关闭 Popup' : '已关闭 Popup'
      });
    },

    onPopupSettingChange: function (event) {
      var setting = event && event.currentTarget && event.currentTarget.dataset
        ? event.currentTarget.dataset.setting
        : '';
      var checked = Boolean(event && event.detail && event.detail.checked);
      if (setting === 'card') {
        this.setData({ popupCard: checked });
      }
      if (setting === 'blurOverlay') {
        this.setData({ popupBlurOverlay: checked });
      }
    },

    onPopupHeaderAction: function () {
      this.setData({ lastAction: '已触发 Header 左侧操作入口' });
    },

    onPopupFooterAction: function () {
      this.setData({
        popupVisible: false,
        lastAction: '已通过 Footer 操作关闭 Popup'
      });
    }
  }
}));
