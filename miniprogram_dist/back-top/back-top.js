var themeBehavior = require('../common/behaviors/theme');

function clamp(value, minimum, maximum, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.max(minimum, Math.min(maximum, number));
}

function normalizeTheme(value) {
  return ['round', 'half-round', 'round-dark', 'half-round-dark'].indexOf(value) >= 0 ? value : 'round';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    fixed: { type: Boolean, value: true },
    icon: { type: String, value: 'arrow-up' },
    scrollTop: { type: Number, value: 0 },
    text: { type: String, value: '' },
    theme: { type: String, value: 'round' },
    visibilityHeight: { type: Number, value: 200 },
    ariaLabel: { type: String, value: '回到顶部' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rootClass: 'pui-back-top pui-back-top--round pui-back-top--hidden',
    rootStyle: '',
    visible: false,
    buttonShape: 'circle',
    buttonTheme: 'primary',
    buttonIcon: 'arrow-up',
    buttonContent: '',
    semanticLabel: '回到顶部'
  },
  observers: {
    'fixed,icon,scrollTop,text,theme,visibilityHeight,ariaLabel,reduceMotion,colorScheme': function syncObserver() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this.syncState();
    }
  },
  methods: {
    syncState: function syncState() {
      if (!this._ready) return;
      var scrollTop = clamp(this.data.scrollTop, 0, Number.MAX_SAFE_INTEGER, 0);
      var threshold = clamp(this.data.visibilityHeight, 0, Number.MAX_SAFE_INTEGER, 200);
      var text = String(this.data.text || '');
      var theme = normalizeTheme(this.data.theme);
      var visible = scrollTop >= threshold;
      var semanticLabel = String(this.data.ariaLabel || text || '回到顶部').trim() || '回到顶部';
      this.setData({
        visible: visible,
        buttonShape: text ? 'round' : 'circle',
        buttonTheme: theme.indexOf('dark') > -1 ? 'inverse' : 'primary',
        buttonIcon: String(this.data.icon || ''),
        buttonContent: text,
        semanticLabel: semanticLabel,
        rootClass: [
          'pui-back-top',
          this.getColorSchemeClass(),
          'pui-back-top--' + theme,
          this.data.fixed ? 'pui-back-top--fixed' : 'pui-back-top--static',
          visible ? 'pui-back-top--visible' : 'pui-back-top--hidden',
          text ? 'pui-back-top--has-text' : '',
          this.data.reduceMotion ? 'pui-back-top--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-back-top-duration:' + (this.data.reduceMotion ? '1ms' : '500ms') + ';'
      });
    },
    onTap: function onTap() {
      if (!this.data.visible) return false;
      var scrollTop = clamp(this.data.scrollTop, 0, Number.MAX_SAFE_INTEGER, 0);
      this.triggerEvent('to-top', { scrollTop: scrollTop, source: 'tap' });
      if (typeof wx !== 'undefined' && typeof wx.pageScrollTo === 'function') {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: this.data.reduceMotion ? 0 : 500
        });
      }
      return true;
    }
  }
});
