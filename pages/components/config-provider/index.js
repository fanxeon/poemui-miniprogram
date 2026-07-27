var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'ConfigProvider',
  data: { localTheme: 'dark', localShadow: true, localBordered: false, providerStatus: '页面根使用全局 visualConfig；下方区域使用局部 Provider 覆盖。' },
  methods: {
    onLocalThemeChange: function (event) { var dark = Boolean(event && event.detail && event.detail.value); this.setData({ localTheme: dark ? 'dark' : 'light', providerStatus: '局部 Provider 已切换为' + (dark ? '深色' : '浅色') + '，全局设置未被写入。' }); },
    onLocalShadowChange: function (event) { var shadow = Boolean(event && event.detail && event.detail.value); this.setData({ localShadow: shadow, providerStatus: '局部阴影已更新；共享 visualConfig 不会被复制或覆盖。' }); },
    onLocalBorderedChange: function (event) { var bordered = Boolean(event && event.detail && event.detail.value); this.setData({ localBordered: bordered, providerStatus: '局部边框已更新，页面根仍订阅全局 visualConfig。' }); }
  }
}));
