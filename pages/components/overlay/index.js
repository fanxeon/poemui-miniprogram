var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Overlay',
  data: {
    overlayVisible: false,
    overlayBlur: true,
    lastAction: '打开遮罩查看全屏覆盖与滚动保护。'
  },
  methods: {
    onOpenOverlay: function () {
      this.setData({ overlayVisible: true, lastAction: 'Overlay 已打开' });
    },
    onOverlayClick: function () {
      this.setData({ overlayVisible: false, lastAction: '已点击遮罩关闭 Overlay' });
    },
    onOverlayBlurChange: function (event) {
      this.setData({ overlayBlur: Boolean(event && event.detail && event.detail.checked) });
    }
  }
}));
