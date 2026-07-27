var themeBehavior = require('../common/behaviors/theme');

var easingMap = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  ease: 'ease',
  linear: 'linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out'
};

function clampDuration(value) {
  var duration = Number(value);
  if (!isFinite(duration)) duration = 500;
  return Math.max(0, Math.min(1000, Math.round(duration)));
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    showHeader: { type: Boolean, value: false },
    bordered: { type: Boolean, value: true },
    padding: { type: String, value: 'normal' },
    showFooter: { type: Boolean, value: false },
    headerBordered: { type: Boolean, value: true },
    footerBordered: { type: Boolean, value: true },
    shadow: { type: Boolean, value: false },
    clickable: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '卡片' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: { rootClass: '', rootStyle: '' },
  observers: {
    'showHeader,bordered,padding,showFooter,headerBordered,footerBordered,shadow,clickable,disabled,ariaLabel,duration,easing,reduceMotion,colorScheme': function sync() { this.syncState(); }
  },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    syncState: function syncState() {
      var padding = this.data.padding === 'compact' ? 'compact' : 'normal';
      var duration = this.data.reduceMotion ? 1 : clampDuration(this.data.duration);
      this.setData({
        rootClass: [
          'pui-card',
          this.getColorSchemeClass(),
          'pui-card--' + padding,
          this.data.bordered ? 'pui-card--bordered' : '',
          this.data.headerBordered ? 'pui-card--header-bordered' : '',
          this.data.footerBordered ? 'pui-card--footer-bordered' : '',
          this.data.shadow ? 'pui-card--shadow' : '',
          this.data.clickable ? 'pui-card--clickable' : '',
          this.data.disabled ? 'pui-card--disabled' : ''
        ].filter(Boolean).join(' '),
        rootStyle: 'transition-duration:' + duration + 'ms;transition-timing-function:' + (easingMap[this.data.easing] || easingMap.standard) + ';'
      });
    },
    onTap: function onTap() {
      if (!this.data.clickable || this.data.disabled) return;
      this.triggerEvent('click', { source: 'card' });
    },
    onFooterTap: function onFooterTap() {}
  }
});
