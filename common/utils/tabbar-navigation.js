var TABBAR_ITEMS = [
  { label: '', value: 'home', icon: 'home', ariaLabel: '首页' },
  { label: '', value: 'styles', icon: 'palette', ariaLabel: '快速样式' },
  { label: '', value: 'codex', icon: 'codex', ariaLabel: 'Codex' },
  { label: '', value: 'me', icon: 'user', ariaLabel: '我的' }
];

var TABBAR_ROUTES = {
  home: '/pages/index/index',
  styles: '/pages/styles/index',
  codex: '/pages/codex/index',
  me: '/pages/me/index'
};

function getItems() {
  return TABBAR_ITEMS.map(function cloneItem(item) {
    return Object.assign({}, item);
  });
}

function navigateToTab(value, activeValue) {
  var target = TABBAR_ROUTES[value];
  if (!target || value === activeValue) return false;
  wx.redirectTo({ url: target });
  return true;
}

module.exports = {
  getItems: getItems,
  navigateToTab: navigateToTab
};
