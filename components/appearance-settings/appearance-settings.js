var visualConfig = require('poemui-miniprogram/common/utils/visual-config');
var backgroundPreference = require('../../common/utils/page-background-preference');

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
  options: { styleIsolation: 'shared' },
  data: {
    visualConfig: visualConfig.get(),
    backgroundGradientEnabled: backgroundPreference.get(),
    fruitFlavorEnabled: isFruitFlavor(visualConfig.get(), backgroundPreference.get())
  },
  lifetimes: {
    attached: function attached() {
      var self = this;
      visualConfig.restore();
      if (visualConfig.get().effectsEnabled === false) {
        visualConfig.set({ effectsEnabled: true }, {
          source: 'miniprogram-appearance-settings:hidden-effects-gate-migration'
        });
      }
      backgroundPreference.restore();
      this._unsubscribeVisualConfig = visualConfig.subscribe(function onVisualConfigChange(nextConfig) {
        self.syncState(nextConfig, backgroundPreference.get());
      });
      this._unsubscribeBackgroundPreference = backgroundPreference.subscribe(function onBackgroundPreferenceChange(nextGradient) {
        self.syncState(visualConfig.get(), nextGradient);
      });
    },
    detached: function detached() {
      if (this._unsubscribeVisualConfig) this._unsubscribeVisualConfig();
      if (this._unsubscribeBackgroundPreference) this._unsubscribeBackgroundPreference();
    }
  },
  methods: {
    syncState: function syncState(nextConfig, gradientEnabled) {
      var config = nextConfig || visualConfig.get();
      var gradient = Boolean(gradientEnabled);
      this.setData({
        visualConfig: config,
        backgroundGradientEnabled: gradient,
        fruitFlavorEnabled: isFruitFlavor(config, gradient)
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
      if (setting === 'equalSpacing') patch.equalSpacing = checked;
      if (!Object.keys(patch).length) return;
      visualConfig.set(patch, { source: 'miniprogram-appearance-settings:' + setting });
    },
    onBackgroundGradientChange: function onBackgroundGradientChange(event) {
      backgroundPreference.set(Boolean(event && event.detail && event.detail.checked), {
        source: 'miniprogram-appearance-settings:gradient'
      });
    },
    onFruitFlavorChange: function onFruitFlavorChange(event) {
      var enabled = Boolean(event && event.detail && event.detail.checked);
      var source = enabled ? 'miniprogram-appearance-settings:fruit' : 'miniprogram-appearance-settings:standard';
      backgroundPreference.set(false, { source: source });
      visualConfig.set(enabled ? {
        effectsEnabled: true,
        shadow: true,
        frostedGlass: true,
        largeRadius: true,
        bordered: false
      } : {
        effectsEnabled: true,
        shadow: true,
        frostedGlass: false,
        largeRadius: true,
        bordered: false
      }, { source: source });
    }
  }
});
