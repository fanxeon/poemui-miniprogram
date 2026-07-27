var themeBehavior = require('../common/behaviors/theme');

var easingMap = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  ease: 'ease',
  linear: 'linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out'
};

function getPadding(ratio) {
  var parts = String(ratio || '16 / 9').replace(':', '/').split('/');
  var width = Math.abs(Number(parts[0]));
  var height = Math.abs(Number(parts[1]));
  if (!width || !height) return 56.25;
  return Math.round((height / width) * 10000) / 100;
}

function normalizeRadius(value) {
  return ['none', 'small', 'medium', 'large'].indexOf(value) > -1 ? value : 'medium';
}

function safeBackground(value) {
  var color = String(value || '').trim();
  if (!color) return '';
  if (/^#[0-9a-f]{3,8}$/i.test(color) || /^(transparent|currentColor)$/i.test(color) || /^var(--[a-z0-9-]+)$/i.test(color)) return color;
  return '';
}

function clampDuration(value) {
  var duration = Number(value);
  if (!isFinite(duration)) duration = 500;
  return Math.max(0, Math.min(1000, Math.round(duration)));
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    ratio: { type: String, value: '16 / 9' },
    bordered: { type: Boolean, value: false },
    radius: { type: String, value: 'medium' },
    background: { type: String, value: '' },
    overflow: { type: Boolean, value: true },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    paddingTop: 56.25,
    rootClass: '',
    rootStyle: ''
  },
  observers: {
    'ratio,bordered,radius,background,overflow,duration,easing,reduceMotion,colorScheme': function updateRatio() { this.syncState(); }
  },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    syncState: function syncState() {
      var background = safeBackground(this.data.background);
      var duration = this.data.reduceMotion ? 1 : clampDuration(this.data.duration);
      this.setData({
        paddingTop: getPadding(this.data.ratio),
        rootClass: [
          'pui-aspect-ratio',
          this.getColorSchemeClass(),
          this.data.bordered ? 'pui-aspect-ratio--bordered' : '',
          'pui-aspect-ratio--radius-' + normalizeRadius(this.data.radius),
          this.data.overflow ? '' : 'pui-aspect-ratio--overflow-visible'
        ].filter(Boolean).join(' '),
        rootStyle: (background ? 'background:' + background + ';' : '') + 'transition-duration:' + duration + 'ms;transition-timing-function:' + (easingMap[this.data.easing] || easingMap.standard) + ';'
      });
    }
  }
});
