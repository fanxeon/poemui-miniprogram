var themeUtils = require('../common/utils/theme');
var visualConfig = require('../common/utils/visual-config');

Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'shared',
  },
  properties: {
    theme: {
      type: String,
      value: 'light',
    },
    customClass: {
      type: String,
      value: '',
    },
    customStyle: {
      type: String,
      value: '',
    },
    frostedGlass: {
      type: Boolean,
      value: false,
    },
    shadow: {
      type: Boolean,
      value: false,
    },
    largeRadius: {
      type: Boolean,
      value: false,
    },
    bordered: {
      type: Boolean,
      value: true,
    },
    equalSpacing: {
      type: Boolean,
      value: false,
    },
    useGlobalConfig: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    actualTheme: 'light',
    globalVisualConfig: null,
    rootClass: 'pui-config-provider pui-theme--light pui-frosted-glass--off pui-shadow--off pui-radius--normal pui-border--on pui-spacing--normal',
  },
  observers: {
    theme: function themeObserver() {
      this.updateTheme();
      this.bindSystemThemeChange();
    },
    frostedGlass: function frostedGlassObserver() {
      this.updateTheme();
    },
    shadow: function shadowObserver() {
      this.updateTheme();
    },
    largeRadius: function largeRadiusObserver() {
      this.updateTheme();
    },
    bordered: function borderedObserver() {
      this.updateTheme();
    },
    equalSpacing: function equalSpacingObserver() {
      this.updateTheme();
    },
    useGlobalConfig: function useGlobalConfigObserver() {
      if (!this._isAttached) return;
      this.bindGlobalVisualConfig();
    },
  },
  lifetimes: {
    attached: function attached() {
      this._isAttached = true;
      this.bindGlobalVisualConfig();
    },
    detached: function detached() {
      this._isAttached = false;
      this.unbindGlobalVisualConfig();
      if (this._themeChangeHandler && wx.offThemeChange) {
        wx.offThemeChange(this._themeChangeHandler);
      }
    },
  },
  methods: {
    getEffectiveConfig: function getEffectiveConfig() {
      if (this.data.useGlobalConfig) {
        var shared = this.data.globalVisualConfig || visualConfig.get();
        var effectsEnabled = shared.effectsEnabled !== false;
        return {
          theme: shared.theme,
          frostedGlass: effectsEnabled && shared.frostedGlass,
          shadow: effectsEnabled && shared.shadow,
          largeRadius: effectsEnabled && shared.largeRadius,
          bordered: shared.bordered !== false,
          equalSpacing: shared.equalSpacing === true,
          effectsEnabled: effectsEnabled,
        };
      }
      return {
        theme: this.data.theme,
        frostedGlass: this.data.frostedGlass,
        shadow: this.data.shadow,
        largeRadius: this.data.largeRadius,
        bordered: this.data.bordered,
        equalSpacing: this.data.equalSpacing,
        effectsEnabled: true,
      };
    },
    getVisualState: function getVisualState(effectiveConfig) {
      var config = effectiveConfig || this.getEffectiveConfig();
      var frostedGlass = config.frostedGlass;
      var shadow = config.shadow;
      var largeRadius = config.largeRadius;
      var bordered = config.bordered;
      var equalSpacing = config.equalSpacing === true;
      return {
        frostedGlass: frostedGlass,
        shadow: shadow,
        largeRadius: largeRadius,
        bordered: bordered,
        equalSpacing: equalSpacing,
        effectsEnabled: config.effectsEnabled,
        classes: [
          frostedGlass ? 'pui-frosted-glass--on' : 'pui-frosted-glass--off',
          shadow ? 'pui-shadow--on' : 'pui-shadow--off',
          largeRadius ? 'pui-radius--large' : 'pui-radius--normal',
          bordered ? 'pui-border--on' : 'pui-border--off',
          equalSpacing ? 'pui-spacing--equal' : 'pui-spacing--normal',
        ].join(' '),
      };
    },
    updateTheme: function updateTheme() {
      var self = this;
      var effectiveConfig = this.getEffectiveConfig();
      var actualTheme = themeUtils.resolveTheme(effectiveConfig.theme);
      var visual = this.getVisualState(effectiveConfig);
      this.setData({
        actualTheme: actualTheme,
        rootClass: 'pui-config-provider pui-theme--' + actualTheme + ' ' + visual.classes,
      }, function notifyResolvedTheme() {
        self.emitThemeChange(actualTheme, effectiveConfig, visual);
      });
    },
    emitThemeChange: function emitThemeChange(actualTheme, effectiveConfig, visual) {
      if (!this._isAttached || this._lastEmittedTheme === actualTheme) return;
      this._lastEmittedTheme = actualTheme;
      this.triggerEvent('themechange', {
        theme: actualTheme,
        source: effectiveConfig.theme,
        frostedGlass: visual.frostedGlass,
        shadow: visual.shadow,
        largeRadius: visual.largeRadius,
        bordered: visual.bordered,
        equalSpacing: visual.equalSpacing,
        effectsEnabled: visual.effectsEnabled,
        global: this.data.useGlobalConfig,
      });
    },
    bindGlobalVisualConfig: function bindGlobalVisualConfig() {
      var self = this;
      this.unbindGlobalVisualConfig();
      if (!this.data.useGlobalConfig) {
        this.setData({ globalVisualConfig: null });
        this.updateTheme();
        this.bindSystemThemeChange();
        return;
      }
      visualConfig.restore();
      this._unsubscribeVisualConfig = visualConfig.subscribe(function handleVisualConfigChange(nextConfig) {
        self.setData({ globalVisualConfig: nextConfig }, function syncProviderTheme() {
          self.updateTheme();
          self.bindSystemThemeChange();
        });
      });
    },
    unbindGlobalVisualConfig: function unbindGlobalVisualConfig() {
      if (this._unsubscribeVisualConfig) {
        this._unsubscribeVisualConfig();
        this._unsubscribeVisualConfig = null;
      }
    },
    bindSystemThemeChange: function bindSystemThemeChange() {
      var self = this;
      if (this._themeChangeHandler && wx.offThemeChange) {
        wx.offThemeChange(this._themeChangeHandler);
        this._themeChangeHandler = null;
      }
      var effectiveConfig = this.getEffectiveConfig();
      if (effectiveConfig.theme !== 'auto' || !wx.onThemeChange) {
        return;
      }
      this._themeChangeHandler = function themeChangeHandler(res) {
        var currentConfig = self.getEffectiveConfig();
        if (currentConfig.theme !== 'auto') {
          return;
        }
        var nextTheme = res && res.theme === 'dark' ? 'dark' : 'light';
        var visual = self.getVisualState(currentConfig);
        self.setData({
          actualTheme: nextTheme,
          rootClass: 'pui-config-provider pui-theme--' + nextTheme + ' ' + visual.classes,
        }, function notifySystemTheme() {
          self.emitThemeChange(nextTheme, currentConfig, visual);
        });
      };
      wx.onThemeChange(this._themeChangeHandler);
    },
  },
});
