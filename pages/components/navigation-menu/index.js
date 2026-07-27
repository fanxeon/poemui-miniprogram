var createComponentPage = require('../../../utils/component-page');

var MENU_LABELS = {
  start: '开始使用',
  basic: '基础组件',
  navigation: '导航组件',
  components: '组件分类'
};

Page(createComponentPage({
  title: 'NavigationMenu',
  data: {
    menuItems: [
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
    ],
    horizontalMenuVisible: false,
    horizontalMenuValue: 'start',
    horizontalMenuExpandedValue: 'components',
    horizontalMenuCheckedValues: [],
    horizontalMenuRadioValues: { theme: 'light' },
    horizontalMenuStatus: '点击任一根入口展开浮层目录。',
    verticalMenuVisible: true,
    verticalMenuValue: 'basic',
    verticalMenuExpandedValue: 'components',
    verticalMenuCheckedValues: [],
    verticalMenuRadioValues: { theme: 'light' },
    verticalMenuStatus: '双栏目录已展开，可在左侧切换分类。',
    errorMenuVisible: false,
    errorMenuExpandedValue: 'components',
    errorMenuError: true,
    errorMenuStatus: '打开菜单后会看到加载失败和重新加载入口。',
    pageContentPaddingBottom: '10vh'
  },
  methods: {
    onHorizontalMenuVisibleChange: function onHorizontalMenuVisibleChange(event) {
      var visible = Boolean(event && event.detail && event.detail.visible);
      this.setData({
        horizontalMenuVisible: visible,
        errorMenuVisible: visible ? false : this.data.errorMenuVisible,
        horizontalMenuStatus: visible ? '目录已展开。' : '目录已关闭。'
      });
    },
    onHorizontalMenuChange: function onHorizontalMenuChange(event) {
      var value = event && event.detail ? event.detail.value : '';
      if (value !== undefined) {
        this.setData({
          horizontalMenuValue: value,
          horizontalMenuStatus: '已选择：' + (MENU_LABELS[value] || '菜单项') + '。'
        });
      }
    },
    onHorizontalMenuExpandedChange: function onHorizontalMenuExpandedChange(event) {
      var value = event && event.detail ? event.detail.expandedValue : null;
      this.setData({ horizontalMenuExpandedValue: value });
    },
    onHorizontalMenuCheckedChange: function onHorizontalMenuCheckedChange(event) {
      var values = event && event.detail ? event.detail.checkedValues : [];
      this.setData({
        horizontalMenuCheckedValues: values || [],
        horizontalMenuStatus: '通知设置已更新。'
      });
    },
    onHorizontalMenuRadioChange: function onHorizontalMenuRadioChange(event) {
      var values = event && event.detail ? event.detail.radioValues : {};
      this.setData({
        horizontalMenuRadioValues: values || {},
        horizontalMenuStatus: '主题选择已更新。'
      });
    },
    onVerticalMenuVisibleChange: function onVerticalMenuVisibleChange(event) {
      var visible = Boolean(event && event.detail && event.detail.visible);
      this.setData({
        verticalMenuVisible: visible,
        verticalMenuStatus: visible ? '双栏目录已展开。' : '双栏目录已收起。'
      });
    },
    onVerticalMenuChange: function onVerticalMenuChange(event) {
      var value = event && event.detail ? event.detail.value : '';
      if (value !== undefined) {
        this.setData({
          verticalMenuValue: value,
          verticalMenuStatus: '当前分类：' + (MENU_LABELS[value] || '未选择') + '。'
        });
      }
    },
    onVerticalMenuExpandedChange: function onVerticalMenuExpandedChange(event) {
      var value = event && event.detail ? event.detail.expandedValue : null;
      this.setData({
        verticalMenuExpandedValue: value,
        verticalMenuStatus: value ? '已展开分类：' + (MENU_LABELS[value] || '组件分类') + '。' : '分类已收起。'
      });
    },
    onVerticalMenuCheckedChange: function onVerticalMenuCheckedChange(event) {
      var values = event && event.detail ? event.detail.checkedValues : [];
      this.setData({
        verticalMenuCheckedValues: values || [],
        verticalMenuStatus: '通知设置已更新。'
      });
    },
    onVerticalMenuRadioChange: function onVerticalMenuRadioChange(event) {
      var values = event && event.detail ? event.detail.radioValues : {};
      this.setData({
        verticalMenuRadioValues: values || {},
        verticalMenuStatus: '主题选择已更新。'
      });
    },
    onErrorMenuVisibleChange: function onErrorMenuVisibleChange(event) {
      var visible = Boolean(event && event.detail && event.detail.visible);
      this.setData({
        errorMenuVisible: visible,
        horizontalMenuVisible: visible ? false : this.data.horizontalMenuVisible,
        pageContentPaddingBottom: visible ? '680rpx' : '10vh',
        errorMenuStatus: visible
          ? (this.data.errorMenuError ? '目录加载失败，可重新加载。' : '目录已恢复。')
          : '恢复示例已关闭。'
      });
    },
    onErrorMenuExpandedChange: function onErrorMenuExpandedChange(event) {
      var value = event && event.detail ? event.detail.expandedValue : null;
      this.setData({ errorMenuExpandedValue: value });
    },
    onErrorMenuRetry: function onErrorMenuRetry() {
      this.setData({
        errorMenuError: false,
        errorMenuStatus: '目录已重新加载。'
      });
    },
    onErrorModeChange: function onErrorModeChange(event) {
      var error = Boolean(event && event.detail && event.detail.checked);
      this.setData({
        errorMenuError: error,
        errorMenuStatus: error
          ? '加载失败已开启，打开菜单查看恢复入口。'
          : '目录当前可正常打开。'
      });
    }
  }
}));
