var visualConfig = require('poemui-miniprogram').visualConfig;

Page({
  data: {
    theme: 'light',
    actualTheme: 'light',
    frostedGlass: false,
    frostedGlassText: '关',
    shadow: false,
    shadowText: '关',
    largeRadius: false,
    largeRadiusText: '关',
    bordered: true,
    borderedText: '开',
    effectsEnabled: true,
    effectsEnabledText: '开',
    visualPreset: 'standard',
    popupVisible: false,
    popupResult: '等待操作',
    tagVisible: true,
  },
  onLoad: function onLoad() {
    var restored = visualConfig.restore();
    this.handleVisualConfigResult(restored);
    this._unsubscribeVisualConfig = visualConfig.subscribe(this.syncVisualConfig.bind(this));
  },
  onUnload: function onUnload() {
    if (this._unsubscribeVisualConfig) this._unsubscribeVisualConfig();
  },
  syncVisualConfig: function syncVisualConfig(next) {
    this.setData({
      theme: next.theme,
      frostedGlass: next.frostedGlass,
      frostedGlassText: next.frostedGlass ? '开' : '关',
      shadow: next.shadow,
      shadowText: next.shadow ? '开' : '关',
      largeRadius: next.largeRadius,
      largeRadiusText: next.largeRadius ? '开' : '关',
      bordered: next.bordered,
      borderedText: next.bordered ? '开' : '关',
      effectsEnabled: next.effectsEnabled,
      effectsEnabledText: next.effectsEnabled ? '开' : '关',
    });
  },
  handleVisualConfigResult: function handleVisualConfigResult(result) {
    if (!result || !result.error) return;
    wx.showToast({ title: '视觉配置保存失败', icon: 'none' });
  },
  updateVisualConfig: function updateVisualConfig(patch) {
    this.handleVisualConfigResult(visualConfig.set(patch));
  },
  setLight: function setLight() {
    this.updateVisualConfig({ theme: 'light' });
  },
  setDark: function setDark() {
    this.updateVisualConfig({ theme: 'dark' });
  },
  setAuto: function setAuto() {
    this.updateVisualConfig({ theme: 'auto' });
  },
  onThemeChange: function onThemeChange(event) {
    this.setData({ actualTheme: event.detail.theme });
  },
  toggleFrostedGlass: function toggleFrostedGlass() {
    this.updateVisualConfig({ frostedGlass: !this.data.frostedGlass });
  },
  toggleShadow: function toggleShadow() {
    this.updateVisualConfig({ shadow: !this.data.shadow });
  },
  toggleLargeRadius: function toggleLargeRadius() {
    this.updateVisualConfig({ largeRadius: !this.data.largeRadius });
  },
  toggleBordered: function toggleBordered() {
    this.updateVisualConfig({ bordered: !this.data.bordered });
  },
  toggleEffectsEnabled: function toggleEffectsEnabled() {
    this.handleVisualConfigResult(visualConfig.setEffectsEnabled(!this.data.effectsEnabled));
  },
  applyStandardPreset: function applyStandardPreset() {
    this.handleVisualConfigResult(visualConfig.applyPreset('standard'));
    this.setData({ visualPreset: 'standard' });
  },
  applySoftPreset: function applySoftPreset() {
    this.handleVisualConfigResult(visualConfig.applyPreset('soft'));
    this.setData({ visualPreset: 'soft' });
  },
  applyGlassPreset: function applyGlassPreset() {
    this.handleVisualConfigResult(visualConfig.applyPreset('glass'));
    this.setData({ visualPreset: 'glass' });
  },
  openPopup: function openPopup() {
    this.setData({ popupVisible: true });
  },
  onPopupVisibleChange: function onPopupVisibleChange(event) {
    var detail = event && event.detail ? event.detail : {};
    this.setData({ popupVisible: Boolean(detail.visible), popupResult: '关闭请求：' + (detail.trigger || 'unknown') });
  },
  openComponentPage: function openComponentPage() {
    wx.navigateTo({ url: '/pages/components/index' });
  },
  onTagClose: function onTagClose() {
    this.setData({ tagVisible: false });
  },
  restoreTag: function restoreTag() {
    this.setData({ tagVisible: true });
  },
});
