var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Tabbar',
  data: {
    tabbarItems: [
      { label: '首页', value: 'home', icon: 'home', ariaLabel: '首页' },
      { label: '收藏', value: 'saved', icon: 'bookmark', badge: 2, ariaLabel: '收藏' },
      { label: '', value: 'create', icon: 'add', ariaLabel: '创建' },
      { label: '我的', value: 'me', icon: 'user', ariaLabel: '我的' }
    ],
    tabbarValue: 'home',
    tabbarFixed: false,
    tabbarStatus: '当前目的地：首页。'
  },
  methods: {
    onTabbarChange: function onTabbarChange(event) {
      var value = event && event.detail ? event.detail.value : '';
      var labels = { home: '首页', saved: '收藏', create: '创建', me: '我的' };
      this.setData({ tabbarValue: value, tabbarStatus: '当前目的地：' + (labels[value] || value) + '。' });
    },
    onToggleTabbarFixed: function onToggleTabbarFixed() {
      var fixed = !this.data.tabbarFixed;
      this.setData({ tabbarFixed: fixed, tabbarStatus: fixed ? 'Tabbar 已固定到页面底部。' : 'Tabbar 已回到内容流。' });
    }
  }
}));
