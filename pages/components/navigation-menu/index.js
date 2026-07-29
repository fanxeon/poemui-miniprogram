var createComponentPage = require('../../../utils/component-page');

var MENU_ITEMS = [
  { label: '开始使用', value: 'start', type: 'action', icon: 'home', description: '从组件目录开始', badge: 1 },
  {
    label: '组件分类', value: 'components', type: 'submenu', icon: 'layers', description: '进入分层目录', children: [
      { label: '基础组件', value: 'basic', type: 'link', icon: 'grid', description: '按钮与图标' },
      { label: '导航组件', value: 'navigation', type: 'link', icon: 'route', description: '页面与路径' }
    ]
  },
  { label: '显示通知', value: 'notice', type: 'checkbox', icon: 'bell', description: '保留通知入口', badgeDot: true },
  { label: '浅色主题', value: 'light', type: 'radio', radioGroup: 'theme', icon: 'sun' },
  { label: '深色主题', value: 'dark', type: 'radio', radioGroup: 'theme', icon: 'moon' }
];

Page(createComponentPage({
  title: 'NavigationMenu',
  data: {
    menuItems: MENU_ITEMS,
    horizontalMenuItems: MENU_ITEMS.slice(0, 3),
    horizontalMenuVisible: false,
    horizontalMenuValue: 'start',
    horizontalMenuExpandedValue: 'components',
    horizontalMenuCheckedValues: [],
    horizontalMenuRadioValues: { theme: 'light' },
    verticalMenuVisible: true,
    verticalMenuValue: 'basic',
    verticalMenuExpandedValue: 'components',
    verticalMenuCheckedValues: [],
    verticalMenuRadioValues: { theme: 'light' },
    errorMenuVisible: false,
    errorMenuExpandedValue: 'components',
    errorMenuError: true,
    pageContentPaddingBottom: '10vh'
  },
  methods: {
    onHorizontalMenuVisibleChange: function onHorizontalMenuVisibleChange(event) {
      var visible = Boolean(event && event.detail && event.detail.visible);
      this.setData({
        horizontalMenuVisible: visible,
        errorMenuVisible: visible ? false : this.data.errorMenuVisible
      });
    },
    onHorizontalMenuChange: function onHorizontalMenuChange(event) {
      var value = event && event.detail ? event.detail.value : '';
      if (value !== undefined) {
        this.setData({ horizontalMenuValue: value });
      }
    },
    onHorizontalMenuExpandedChange: function onHorizontalMenuExpandedChange(event) {
      var value = event && event.detail ? event.detail.expandedValue : null;
      this.setData({ horizontalMenuExpandedValue: value });
    },
    onHorizontalMenuCheckedChange: function onHorizontalMenuCheckedChange(event) {
      var values = event && event.detail ? event.detail.checkedValues : [];
      this.setData({ horizontalMenuCheckedValues: values || [] });
    },
    onHorizontalMenuRadioChange: function onHorizontalMenuRadioChange(event) {
      var values = event && event.detail ? event.detail.radioValues : {};
      this.setData({ horizontalMenuRadioValues: values || {} });
    },
    onVerticalMenuVisibleChange: function onVerticalMenuVisibleChange(event) {
      var visible = Boolean(event && event.detail && event.detail.visible);
      this.setData({ verticalMenuVisible: visible });
    },
    onVerticalMenuChange: function onVerticalMenuChange(event) {
      var value = event && event.detail ? event.detail.value : '';
      if (value !== undefined) {
        this.setData({ verticalMenuValue: value });
      }
    },
    onVerticalMenuExpandedChange: function onVerticalMenuExpandedChange(event) {
      var value = event && event.detail ? event.detail.expandedValue : null;
      this.setData({ verticalMenuExpandedValue: value });
    },
    onVerticalMenuCheckedChange: function onVerticalMenuCheckedChange(event) {
      var values = event && event.detail ? event.detail.checkedValues : [];
      this.setData({ verticalMenuCheckedValues: values || [] });
    },
    onVerticalMenuRadioChange: function onVerticalMenuRadioChange(event) {
      var values = event && event.detail ? event.detail.radioValues : {};
      this.setData({ verticalMenuRadioValues: values || {} });
    },
    onErrorMenuVisibleChange: function onErrorMenuVisibleChange(event) {
      var visible = Boolean(event && event.detail && event.detail.visible);
      this.setData({
        errorMenuVisible: visible,
        horizontalMenuVisible: visible ? false : this.data.horizontalMenuVisible,
        pageContentPaddingBottom: visible ? '680rpx' : '10vh'
      });
    },
    onErrorMenuExpandedChange: function onErrorMenuExpandedChange(event) {
      var value = event && event.detail ? event.detail.expandedValue : null;
      this.setData({ errorMenuExpandedValue: value });
    },
    onErrorMenuRetry: function onErrorMenuRetry() {
      var self = this;
      this.setData({ errorMenuError: false }, function afterRecovery() {
        self.showPageFeedback({
          key: 'navigation-menu-recovery',
          theme: 'success',
          title: '目录已恢复',
          message: '组件分类已经重新提供，可以继续浏览。',
          closable: false
        });
      });
    },
    onErrorModeChange: function onErrorModeChange(event) {
      var error = Boolean(event && event.detail && event.detail.checked);
      this.setData({ errorMenuError: error });
    }
  }
}));
