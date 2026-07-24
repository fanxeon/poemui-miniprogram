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

Component({
  properties: {
    title: { type: String, value: '' }
  },
  data: {
    navbarLeftBtn: { icon: 'chevron-left', ariaLabel: '返回' },
    navbarRightBtn: { icon: 'menu', ariaLabel: '打开外观设置' },
    appearancePopupVisible: false,
    visualConfig: currentVisualConfig(),
    canvasGradientEnabled: canvasPreference.get(),
    fruitFlavorEnabled: isFruitFlavor(currentVisualConfig(), canvasPreference.get())
  },
  lifetimes: {
    attached: function attached() {
      var self = this;
      visualConfig.restore();
      canvasPreference.restore();
      this._unsubscribeVisualConfig = visualConfig.subscribe(function onVisualConfigChange(nextConfig) {
        self.syncAppearanceState(nextConfig, canvasPreference.get());
      });
      this._unsubscribeCanvasPreference = canvasPreference.subscribe(function onCanvasPreferenceChange(gradientEnabled) {
        self.syncAppearanceState(visualConfig.get(), gradientEnabled);
      });
    },
    detached: function detached() {
      if (this._unsubscribeVisualConfig) this._unsubscribeVisualConfig();
      if (this._unsubscribeCanvasPreference) this._unsubscribeCanvasPreference();
    }
  },
  methods: {
    onBack: function onBack() {
      this.triggerEvent('back');
    },
    onOpenAppearance: function onOpenAppearance() {
      this.setData({ appearancePopupVisible: true });
    },
    onAppearancePopupVisibleChange: function onAppearancePopupVisibleChange(event) {
      this.setData({
        appearancePopupVisible: Boolean(event && event.detail && event.detail.visible)
      });
    },
    onAppearanceSwitchChange: function onAppearanceSwitchChange(event) {
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
      visualConfig.set(patch, { source: 'miniprogram-component-page:appearance:' + setting });
    },
    onCanvasGradientChange: function onCanvasGradientChange(event) {
      canvasPreference.set(Boolean(event && event.detail && event.detail.checked), {
        source: 'miniprogram-component-page:gradient'
      });
    },
    onFruitFlavorChange: function onFruitFlavorChange(event) {
      var enabled = Boolean(event && event.detail && event.detail.checked);
      var source = enabled ? 'miniprogram-component-page:fruit' : 'miniprogram-component-page:standard';
      canvasPreference.set(false, { source: source });
      visualConfig.set(enabled ? {
        effectsEnabled: true,
        shadow: true,
        frostedGlass: true,
        largeRadius: true,
        bordered: false
      } : {
        effectsEnabled: true,
        shadow: false,
        frostedGlass: false,
        largeRadius: false,
        bordered: true
      }, { source: source });
    },
    onResetAppearance: function onResetAppearance() {
      canvasPreference.set(false, { source: 'miniprogram-component-page:appearance-reset' });
      visualConfig.reset({ source: 'miniprogram-component-page:appearance-reset' });
    },
    syncAppearanceState: function syncAppearanceState(nextVisualConfig, gradientEnabled) {
      var config = nextVisualConfig || currentVisualConfig();
      var gradient = Boolean(gradientEnabled);
      this.setData({
        visualConfig: config,
        canvasGradientEnabled: gradient,
        fruitFlavorEnabled: isFruitFlavor(config, gradient)
      });
    }
  }
});
