var themeBehavior = require('../common/behaviors/theme');

var STATES = ['idle', 'loading', 'success'];

function clamp(value, min, max, fallback) {
  var next = Number(value);
  if (!isFinite(next)) next = fallback;
  return Math.max(min, Math.min(max, next));
}

function motionDuration(value, reduceMotion) {
  return reduceMotion ? 1 : Math.round(clamp(value, 0, 1000, 500));
}

function waitDuration(value, max, fallback) {
  return Math.round(clamp(value, 0, max, fallback));
}

function normalizedProgress(value) {
  if (value === null || value === undefined || value === '') return null;
  var next = Number(value);
  if (!isFinite(next) || next < 0) return null;
  return Math.max(0, Math.min(100, Math.round(next)));
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    state: { type: String, value: 'idle' },
    progress: { type: null, value: null },
    delay: { type: Number, value: 220 },
    minimumVisible: { type: Number, value: 500 },
    successDuration: { type: Number, value: 700 },
    duration: { type: Number, value: 500 },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    mounted: false,
    active: false,
    successful: false,
    phase: 'hidden',
    determinate: false,
    progressValue: 0,
    semanticLabel: '加载中',
    rootClass: 'pui-top-loading',
    rootStyle: ''
  },
  observers: {
    'state,progress,delay,minimumVisible,successDuration,duration,ariaLabel,reduceMotion,colorScheme': function syncTopLoading() {
      this.syncPresentation();
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._stateToken = 0;
      this.syncPresentation();
      this.syncState();
    },
    detached: function detached() {
      this._ready = false;
      this.clearTimers();
    }
  },
  methods: {
    normalizedState: function normalizedState() {
      return STATES.indexOf(this.data.state) >= 0 ? this.data.state : 'idle';
    },
    clearTimers: function clearTimers() {
      clearTimeout(this._delayTimer);
      clearTimeout(this._frameTimer);
      clearTimeout(this._successTimer);
      clearTimeout(this._leaveTimer);
      this._delayTimer = null;
      this._frameTimer = null;
      this._successTimer = null;
      this._leaveTimer = null;
    },
    syncPresentation: function syncPresentation() {
      var state = this.normalizedState();
      var progress = normalizedProgress(this.data.progress);
      var duration = motionDuration(this.data.duration, this.data.reduceMotion);
      var label = String(this.data.ariaLabel || (state === 'success' ? '加载完成' : progress === null ? '加载中' : '加载进度 ' + progress + '%')).trim();
      this.setData({
        determinate: progress !== null,
        progressValue: progress === null ? 0 : progress,
        semanticLabel: label || '加载中',
        rootClass: [
          'pui-top-loading',
          this.getColorSchemeClass(),
          this.data.reduceMotion ? 'pui-top-loading--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-top-loading-duration:' + duration + 'ms;--pui-top-loading-progress:' + (progress === null ? 0 : progress / 100) + ';'
      });
    },
    syncState: function syncState() {
      if (!this._ready) return;
      var state = this.normalizedState();
      var token = ++this._stateToken;
      this.clearTimers();
      if (state === 'loading') {
        this.enterLoading(token);
        return;
      }
      if (state === 'success') {
        this.enterSuccessWhenReady(token);
        return;
      }
      this.leave(token);
    },
    enterLoading: function enterLoading(token) {
      var self = this;
      this._successRequestedAt = 0;
      if (this.data.mounted) {
        this._visibleAt = this._visibleAt || Date.now();
        this.setData({ active: true, successful: false, phase: 'visible' });
        return;
      }
      var delay = waitDuration(this.data.delay, 5000, 220);
      this.setData({ active: false, successful: false, phase: delay ? 'waiting' : 'entering' });
      if (!delay) {
        this.mount(false, token);
        return;
      }
      this._delayTimer = setTimeout(function mountAfterDelay() {
        self._delayTimer = null;
        if (!self._ready || token !== self._stateToken || self.normalizedState() !== 'loading') return;
        self.mount(false, token);
      }, delay);
    },
    enterSuccessWhenReady: function enterSuccessWhenReady(token) {
      var self = this;
      var elapsed = this._visibleAt ? Date.now() - this._visibleAt : 0;
      var remaining = this.data.mounted
        ? Math.max(0, waitDuration(this.data.minimumVisible, 60000, 500) - elapsed)
        : 0;
      this._successRequestedAt = Date.now();
      this._successTimer = setTimeout(function showSuccess() {
        self._successTimer = null;
        if (!self._ready || token !== self._stateToken || self.normalizedState() !== 'success') return;
        if (!self.data.mounted) {
          self.mount(true, token);
          return;
        }
        self.showSuccess(token);
      }, remaining);
    },
    mount: function mount(successful, token) {
      var self = this;
      this.setData({
        mounted: true,
        active: false,
        successful: Boolean(successful),
        phase: 'entering'
      }, function afterMount() {
        self._frameTimer = setTimeout(function enterFrame() {
          self._frameTimer = null;
          if (!self._ready || token !== self._stateToken) return;
          self._visibleAt = Date.now();
          self.setData({
            active: true,
            successful: Boolean(successful),
            phase: successful ? 'success' : 'visible'
          });
          if (successful) self.scheduleSuccessHide(token);
        }, 16);
      });
    },
    showSuccess: function showSuccess(token) {
      this.setData({ active: true, successful: true, phase: 'success' });
      this.scheduleSuccessHide(token);
    },
    scheduleSuccessHide: function scheduleSuccessHide(token) {
      var self = this;
      var hold = waitDuration(this.data.successDuration, 60000, 700);
      this._successTimer = setTimeout(function hideSuccess() {
        self._successTimer = null;
        if (!self._ready || token !== self._stateToken || self.normalizedState() !== 'success') return;
        self.leave(token);
      }, hold);
    },
    leave: function leave(token) {
      var self = this;
      clearTimeout(this._delayTimer);
      if (!this.data.mounted) {
        this._visibleAt = 0;
        this.setData({ mounted: false, active: false, successful: false, phase: 'hidden' });
        return;
      }
      this.setData({ active: false, phase: 'leaving' });
      this._leaveTimer = setTimeout(function finishLeave() {
        self._leaveTimer = null;
        if (!self._ready || token !== self._stateToken) return;
        self._visibleAt = 0;
        self.setData({ mounted: false, active: false, successful: false, phase: 'hidden' });
      }, motionDuration(this.data.duration, this.data.reduceMotion));
    }
  }
});
