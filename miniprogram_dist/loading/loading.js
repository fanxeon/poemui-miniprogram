var themeBehavior = require('../common/behaviors/theme');

function clamp(value, min, max, fallback) {
  var next = Number(value);
  if (!isFinite(next)) next = fallback;
  return Math.max(min, Math.min(max, next));
}

function motionDuration(value, reduceMotion) {
  if (reduceMotion) return 1;
  return Math.round(clamp(value, 0, 1000, 500));
}

function visibilityDelay(value) {
  return Math.round(clamp(value, 0, 2000, 0));
}

function safeSize(value) {
  var presets = { small: '28rpx', medium: '36rpx', large: '48rpx' };
  var text = String(value || '').trim();
  if (presets[text]) text = presets[text];
  var match = text.match(/^(\d+(?:\.\d+)?)(rpx|px)$/);
  if (!match) return presets.medium;
  var unit = match[2];
  var size = clamp(match[1], unit === 'rpx' ? 16 : 8, unit === 'rpx' ? 128 : 64, unit === 'rpx' ? 36 : 18);
  return size + unit;
}

function normalizedProgress(value) {
  var next = Number(value);
  if (!isFinite(next) || next < 0) return null;
  return Math.round(Math.max(0, Math.min(100, next)));
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    delay: { type: Number, value: 0 },
    duration: { type: Number, value: 500 },
    fullscreen: { type: Boolean, value: false },
    indicator: { type: Boolean, value: true },
    inheritColor: { type: Boolean, value: false },
    layout: { type: String, value: 'horizontal' },
    loading: { type: Boolean, value: true },
    pause: { type: Boolean, value: false },
    progress: { type: Number, value: -1 },
    reverse: { type: Boolean, value: false },
    size: { type: String, value: '36rpx' },
    text: { type: String, value: '' },
    theme: { type: String, value: 'circular' },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    mounted: false,
    active: false,
    waiting: false,
    phase: 'hidden',
    normalizedTheme: 'circular',
    normalizedLayout: 'horizontal',
    progressValue: 0,
    showProgressValue: false,
    spinnerDots: Array.from({ length: 12 }),
    rootClass: 'pui-loading',
    rootStyle: '',
    dotDelayOne: 60,
    dotDelayTwo: 120,
    semanticLabel: '加载中'
  },
  observers: {
    'duration,fullscreen,indicator,inheritColor,layout,pause,progress,reverse,size,text,theme,ariaLabel,reduceMotion,colorScheme': function syncPresentation() {
      this.syncPresentation();
    },
    'loading,delay,duration,reduceMotion': function syncVisibility() {
      this.syncVisibility();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this.syncPresentation();
      this.syncVisibility();
    },
    detached: function detached() {
      this._ready = false;
      this.clearVisibilityTimers();
    }
  },
  methods: {
    clearVisibilityTimers: function clearVisibilityTimers() {
      clearTimeout(this._delayTimer);
      clearTimeout(this._enterTimer);
      clearTimeout(this._leaveTimer);
      this._delayTimer = null;
      this._enterTimer = null;
      this._leaveTimer = null;
    },
    syncPresentation: function syncPresentation() {
      var theme = ['circular', 'spinner', 'dots'].indexOf(this.data.theme) >= 0 ? this.data.theme : 'circular';
      var layout = this.data.layout === 'vertical' ? 'vertical' : 'horizontal';
      var duration = motionDuration(this.data.duration, this.data.reduceMotion);
      var progress = normalizedProgress(this.data.progress);
      var label = String(this.data.ariaLabel || this.data.text || (progress === null ? '加载中' : '加载进度 ' + progress + '%')).trim() || '加载中';
      var dotDelay = this.data.reduceMotion ? 0 : Math.min(120, Math.round(duration / 3));
      this.setData({
        normalizedTheme: theme,
        normalizedLayout: layout,
        progressValue: progress === null ? 0 : progress,
        showProgressValue: progress !== null,
        rootClass: [
          'pui-loading',
          this.getColorSchemeClass(),
          'pui-loading--' + theme,
          'pui-loading--' + layout,
          this.data.fullscreen ? 'pui-loading--fullscreen' : '',
          this.data.pause ? 'pui-loading--pause' : '',
          this.data.reverse ? 'pui-loading--reverse' : '',
          this.data.reduceMotion || duration === 0 ? 'pui-loading--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-loading-size:' + safeSize(this.data.size) + ';--pui-loading-color:' + (this.data.inheritColor ? 'currentColor' : 'var(--pui-color-brand)') + ';--pui-loading-duration:' + duration + 'ms;',
        dotDelayOne: dotDelay,
        dotDelayTwo: dotDelay * 2,
        semanticLabel: label
      });
    },
    syncVisibility: function syncVisibility() {
      var self = this;
      if (!this._ready) return;
      this.clearVisibilityTimers();
      if (this.data.loading) {
        if (this.data.mounted) {
          if (this.data.waiting) this.setData({ waiting: false, phase: 'entering' });
          if (this.data.phase === 'leaving') this.enterLoading();
          return;
        }
        var delay = visibilityDelay(this.data.delay);
        if (delay > 0) {
          this.setData({ mounted: false, active: false, waiting: true, phase: 'waiting' });
          this._delayTimer = setTimeout(function afterDelay() {
            self._delayTimer = null;
            if (self._ready && self.data.loading) self.mountLoading();
          }, delay);
          return;
        }
        this.mountLoading();
        return;
      }
      if (!this.data.mounted) {
        this.setData({ mounted: false, active: false, waiting: false, phase: 'hidden' });
        return;
      }
      if (this.data.phase === 'leaving') {
        this.scheduleLeave();
        return;
      }
      if (!this.data.active) {
        this.setData({ mounted: false, active: false, waiting: false, phase: 'hidden' });
        return;
      }
      this.setData({ active: false, waiting: false, phase: 'leaving' });
      this.scheduleLeave();
    },
    mountLoading: function mountLoading() {
      var self = this;
      this.setData({ mounted: true, active: false, waiting: false, phase: 'entering' }, function afterMounted() {
        self.enterLoading();
      });
    },
    enterLoading: function enterLoading() {
      var self = this;
      clearTimeout(this._enterTimer);
      this._enterTimer = setTimeout(function afterEnterFrame() {
        self._enterTimer = null;
        if (!self._ready || !self.data.loading || !self.data.mounted) return;
        self.setData({ active: true, phase: 'visible' });
      }, 16);
    },
    scheduleLeave: function scheduleLeave() {
      var self = this;
      var duration = motionDuration(this.data.duration, this.data.reduceMotion);
      this._leaveTimer = setTimeout(function afterLeave() {
        self._leaveTimer = null;
        if (self._ready && !self.data.loading) self.finishHide();
      }, duration);
    },
    finishHide: function finishHide() {
      this.setData({ mounted: false, active: false, waiting: false, phase: 'hidden' });
    },
    blockTouchMove: function blockTouchMove() {}
  }
});
