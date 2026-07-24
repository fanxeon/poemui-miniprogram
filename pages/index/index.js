var BASE_COMPONENTS = [
  {
    key: 'button',
    name: 'Button',
    description: '按钮与操作入口',
    icon: 'component',
    url: '/pages/components/button/index',
    keywords: 'button 按钮'
  },
  {
    key: 'divider',
    name: 'Divider',
    description: '内容分区与节奏',
    icon: 'minus',
    url: '/pages/components/divider/index',
    keywords: 'divider 分隔线'
  },
  {
    key: 'icon',
    name: 'Icon',
    description: '本地图形与语义展示',
    icon: 'spark',
    url: '/pages/components/icon/index',
    keywords: 'icon 图标'
  }
];

var TABBAR_ITEMS = [
  { label: '', value: 'home', icon: 'home', ariaLabel: '首页' },
  { label: '', value: 'tasks', icon: 'list-bullet', ariaLabel: '任务', disabled: true },
  { label: '', value: 'me', icon: 'user', ariaLabel: '我的', disabled: true },
  { label: '', value: 'settings', icon: 'palette', ariaLabel: '设置', disabled: true }
];

var SEARCH_OVERLAY_DURATION = 500;
var visualConfig = require('poemui-miniprogram/common/utils/visual-config');
var canvasPreference = require('../../common/utils/home-canvas-preference');

function currentVisualConfig() {
  return visualConfig.get();
}

function isFruitFlavor(config, gradientEnabled) {
  return Boolean(
    config &&
    config.effectsEnabled !== false &&
    config.shadow === true &&
    config.frostedGlass === true &&
    config.largeRadius === true &&
    config.bordered === false &&
    gradientEnabled === false
  );
}

function randomSearchOptions() {
  var candidates = BASE_COMPONENTS.slice();
  for (var index = candidates.length - 1; index > 0; index -= 1) {
    var target = Math.floor(Math.random() * (index + 1));
    var current = candidates[index];
    candidates[index] = candidates[target];
    candidates[target] = current;
  }
  return candidates.map(function toOption(item) {
    return {
      label: item.name,
      value: item.url,
      description: item.description,
      icon: item.icon,
      keywords: item.keywords
    };
  });
}

function getWindowHeight() {
  return wx.getWindowInfo ? wx.getWindowInfo().windowHeight : 0;
}

Page({
  data: {
    brandLogo: '/assets/poemui-moon-lines-black.png',
    navbarLeftBtn: { icon: 'search', ariaLabel: '搜索组件' },
    navbarRightBtn: { icon: 'menu', ariaLabel: '打开外观设置' },
    componentCatalog: BASE_COMPONENTS,
    searchOverlayVisible: false,
    searchOverlayDuration: SEARCH_OVERLAY_DURATION,
    searchComboboxVisible: false,
    searchQuery: '',
    searchOptions: randomSearchOptions(),
    appearancePopupVisible: false,
    visualConfig: currentVisualConfig(),
    canvasGradientEnabled: canvasPreference.get(),
    fruitFlavorEnabled: isFruitFlavor(currentVisualConfig(), canvasPreference.get()),
    componentsOpen: true,
    activeTab: 'home',
    tabbarItems: TABBAR_ITEMS,
    scrollAreaHeight: '1px',
    layoutReady: false
  },

  onLoad: function () {
    var self = this;
    visualConfig.restore();
    canvasPreference.restore();
    this._unsubscribeVisualConfig = visualConfig.subscribe(function onVisualConfigChange(nextConfig) {
      self.syncAppearanceState(nextConfig, canvasPreference.get());
    });
    this._unsubscribeCanvasPreference = canvasPreference.subscribe(function onCanvasPreferenceChange(gradientEnabled) {
      self.syncAppearanceState(visualConfig.get(), gradientEnabled);
    });
    this._windowResizeHandler = this.onWindowResize.bind(this);
    if (wx.onWindowResize) {
      wx.onWindowResize(this._windowResizeHandler);
    }
  },

  onShow: function () {
    this.scheduleMeasureLayout();
  },

  onReady: function () {
    this.scheduleMeasureLayout();
  },

  onUnload: function () {
    clearTimeout(this._measureTimer);
    clearTimeout(this._searchExpandTimer);
    if (this._unsubscribeVisualConfig) this._unsubscribeVisualConfig();
    if (this._unsubscribeCanvasPreference) this._unsubscribeCanvasPreference();
    if (wx.offWindowResize && this._windowResizeHandler) {
      wx.offWindowResize(this._windowResizeHandler);
    }
  },

  onWindowResize: function () {
    this.scheduleMeasureLayout();
  },

  scheduleMeasureLayout: function () {
    clearTimeout(this._measureTimer);
    this._measureTimer = setTimeout(this.measureLayout.bind(this), 0);
  },

  measureLayout: function () {
    var windowHeight = Number(getWindowHeight());
    if (!windowHeight || !this.createSelectorQuery) {
      return;
    }

    var query = this.createSelectorQuery();
    query.select('#home-navbar').boundingClientRect();
    query.select('#home-tabbar').boundingClientRect();
    query.exec(function (rects) {
      var navbarRect = rects && rects[0];
      var tabbarRect = rects && rects[1];
      var navbarHeight = navbarRect && Number(navbarRect.height);
      var tabbarHeight = tabbarRect && Number(tabbarRect.height);

      if (!navbarHeight || !tabbarHeight) {
        return;
      }

      var remainingHeight = Math.max(1, Math.floor(windowHeight - navbarHeight - tabbarHeight));
      this.setData({
        scrollAreaHeight: remainingHeight + 'px',
        layoutReady: true
      });
    }.bind(this));
  },

  onOpenSearch: function () {
    clearTimeout(this._searchExpandTimer);
    this.setData({
      searchOverlayVisible: true,
      appearancePopupVisible: false,
      searchComboboxVisible: false,
      searchOptions: randomSearchOptions(),
      searchQuery: ''
    });
    this._searchExpandTimer = setTimeout(function expandSearchCombobox() {
      this._searchExpandTimer = null;
      if (!this.data.searchOverlayVisible) return;
      this.setData({ searchComboboxVisible: true });
    }.bind(this), SEARCH_OVERLAY_DURATION);
  },

  onSearchOverlayClick: function (event) {
    clearTimeout(this._searchExpandTimer);
    this._searchExpandTimer = null;
    this.setData({
      searchOverlayVisible: Boolean(event && event.detail && event.detail.visible),
      searchComboboxVisible: false,
      searchQuery: ''
    });
  },

  onSearchQueryInput: function (event) {
    this.setData({
      searchQuery: String(event && event.detail && event.detail.query !== undefined ? event.detail.query : '')
    });
  },

  onSearchVisibleInput: function (event) {
    this.setData({
      searchComboboxVisible: Boolean(event && event.detail && event.detail.visible)
    });
  },

  onSearchSelect: function (event) {
    var option = event && event.detail && event.detail.option;
    var url = option && option.value;
    if (typeof url !== 'string' || url.indexOf('/pages/components/') !== 0) return;
    clearTimeout(this._searchExpandTimer);
    this._searchExpandTimer = null;
    this.setData({
      searchOverlayVisible: false,
      searchComboboxVisible: false,
      searchQuery: ''
    });
    wx.navigateTo({ url: url });
  },

  onSearchContentTap: function () {},

  onOpenAppearance: function () {
    clearTimeout(this._searchExpandTimer);
    this._searchExpandTimer = null;
    this.setData({
      searchOverlayVisible: false,
      searchComboboxVisible: false,
      searchQuery: '',
      appearancePopupVisible: true
    });
  },

  onAppearancePopupVisibleChange: function (event) {
    this.setData({
      appearancePopupVisible: Boolean(event && event.detail && event.detail.visible)
    });
  },

  onAppearanceSwitchChange: function (event) {
    var setting = event && event.currentTarget && event.currentTarget.dataset
      ? event.currentTarget.dataset.setting
      : '';
    var checked = Boolean(event && event.detail && event.detail.checked);
    var patch = {};
    if (setting === 'theme') patch.theme = checked ? 'dark' : 'light';
    if (setting === 'bordered') patch.bordered = checked;
    if (setting === 'shadow') patch.shadow = checked;
    if (setting === 'frostedGlass') patch.frostedGlass = checked;
    if (setting === 'largeRadius') patch.largeRadius = checked;
    if (!Object.keys(patch).length) return;
    visualConfig.set(patch, { source: 'miniprogram-home:appearance:' + setting });
  },

  onCanvasGradientChange: function (event) {
    canvasPreference.set(Boolean(event && event.detail && event.detail.checked), {
      source: 'miniprogram-home:gradient'
    });
  },

  onFruitFlavorChange: function (event) {
    var enabled = Boolean(event && event.detail && event.detail.checked);
    if (enabled) {
      canvasPreference.set(false, { source: 'miniprogram-home:fruit' });
      visualConfig.set({
        effectsEnabled: true,
        shadow: true,
        frostedGlass: true,
        largeRadius: true,
        bordered: false
      }, { source: 'miniprogram-home:fruit' });
      return;
    }
    canvasPreference.set(false, { source: 'miniprogram-home:standard' });
    visualConfig.set({
      effectsEnabled: true,
      shadow: false,
      frostedGlass: false,
      largeRadius: false,
      bordered: true
    }, { source: 'miniprogram-home:standard' });
  },

  onResetAppearance: function () {
    canvasPreference.set(false, { source: 'miniprogram-home:appearance-reset' });
    visualConfig.reset({ source: 'miniprogram-home:appearance-reset' });
  },

  syncAppearanceState: function (nextVisualConfig, gradientEnabled) {
    var config = nextVisualConfig || currentVisualConfig();
    var gradient = Boolean(gradientEnabled);
    this.setData({
      visualConfig: config,
      canvasGradientEnabled: gradient,
      fruitFlavorEnabled: isFruitFlavor(config, gradient)
    });
  },

  onComponentsToggle: function (event) {
    this.setData({
      componentsOpen: Boolean(event && event.detail && event.detail.open)
    });
  },

  onTabChange: function (event) {
    var value = event && event.detail ? event.detail.value : '';
    if (value === 'home') {
      this.setData({ activeTab: 'home' });
    }
  }
});
