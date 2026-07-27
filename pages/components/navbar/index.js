var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Navbar',
  data: {
    navbarLeftBtn: { icon: 'search', ariaLabel: '搜索组件' },
    navbarRightBtn: { icon: 'menu', ariaLabel: '打开页面菜单' },
    navbarVisible: true,
    navbarStatus: '可使用左侧的搜索和菜单操作。'
  },
  methods: {
    onNavbarSingleSlotClick: function onNavbarSingleSlotClick() {
      this.setData({ navbarStatus: '页面已收到单按钮 Slot 的搜索操作。' });
    },
    onNavbarLeftSlotClick: function onNavbarLeftSlotClick() {
      this.setData({ navbarStatus: '页面已收到双按钮 Slot 的搜索操作。' });
    },
    onNavbarRightSlotClick: function onNavbarRightSlotClick() {
      this.setData({ navbarStatus: '页面已收到双按钮 Slot 的菜单操作。' });
    },
    onNavbarLeftBtnClick: function onNavbarLeftBtnClick() {
      this.setData({ navbarStatus: '页面已收到搜索操作。' });
    },
    onNavbarRightBtnClick: function onNavbarRightBtnClick() {
      this.setData({ navbarStatus: '页面已收到菜单操作。' });
    },
    onNavbarVisibilityChange: function onNavbarVisibilityChange(event) {
      var visible = Boolean(event && event.detail && event.detail.checked);
      this.setData({
        navbarVisible: visible,
        navbarStatus: visible
          ? '示例导航已显示。'
          : '示例导航已隐藏，页面位置保持不变。'
      });
    }
  }
}));
