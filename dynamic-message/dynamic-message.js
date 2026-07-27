var themeBehavior = require('../common/behaviors/theme');

var THEMES = ['loading', 'info', 'success', 'warning', 'error'];
var THEME_ICONS = {
  info: 'info-circle',
  success: 'success-circle',
  warning: 'warning-triangle',
  error: 'error-circle'
};

function clamp(value, min, max, fallback) {
  var next = Number(value);
  if (!isFinite(next)) next = fallback;
  return Math.max(min, Math.min(max, next));
}

function plainObject(value) {
  return value && Object.prototype.toString.call(value) === '[object Object]' ? value : {};
}

function text(value) {
  return String(value === null || value === undefined ? '' : value).trim();
}

function allowed(value, values, fallback) {
  return values.indexOf(value) >= 0 ? value : fallback;
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    theme: { type: String, value: 'info' },
    title: { type: String, value: '' },
    message: { type: String, value: '' },
    icon: { type: String, value: '' },
    actionText: { type: String, value: '' },
    closable: { type: Boolean, value: true },
    duration: { type: Number, value: 3000 },
    safeArea: { type: Boolean, value: true },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rendered: false,
    active: false,
    phase: 'hidden',
    currentKey: '',
    currentTheme: 'info',
    currentTitle: '',
    currentMessage: '',
    currentIcon: 'info-circle',
    currentCustomIcon: '',
    currentActionText: '',
    currentClosable: true,
    currentDuration: 3000,
    isLoading: false,
    topStyle: 'top:24px;',
    rootClass: 'pui-dynamic-message',
    rootStyle: '--pui-dynamic-message-duration:500ms;--pui-dynamic-message-compact-duration:180ms;--pui-dynamic-message-panel-duration:320ms;',
    semanticLabel: '通知',
    ariaLive: 'polite'
  },
  observers: {
    'theme,title,message,icon,actionText,closable,duration,safeArea,ariaLabel,reduceMotion,colorScheme': function syncDefaults() {
      this.syncPresentation();
      this.syncTopOffset();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._queue = [];
      this._sequence = 0;
      this.syncPresentation();
      this.syncTopOffset();
    },
    detached: function detached() {
      this._ready = false;
      this.clearTimers();
      this._queue = [];
    }
  },
  methods: {
    motionDuration: function motionDuration() {
      return this.data.reduceMotion ? 1 : 500;
    },
    compactMotionDuration: function compactMotionDuration() {
      return this.data.reduceMotion ? 1 : 180;
    },
    panelMotionDuration: function panelMotionDuration() {
      return this.data.reduceMotion ? 1 : 320;
    },
    clearTimers: function clearTimers() {
      clearTimeout(this._frameTimer);
      clearTimeout(this._stageTimer);
      clearTimeout(this._completeTimer);
      clearTimeout(this._autoTimer);
      clearTimeout(this._leaveTimer);
      this._frameTimer = null;
      this._stageTimer = null;
      this._completeTimer = null;
      this._autoTimer = null;
      this._leaveTimer = null;
    },
    syncTopOffset: function syncTopOffset() {
      var top = 12;
      if (this.data.safeArea && typeof wx !== 'undefined') {
        try {
          var windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
          top = Number(windowInfo.statusBarHeight) || top;
          if (wx.getMenuButtonBoundingClientRect) {
            var menu = wx.getMenuButtonBoundingClientRect();
            if (menu && isFinite(Number(menu.bottom))) top = Math.max(top, Number(menu.bottom));
          }
          top += 6;
        } catch (error) {
          top = 12;
        }
      }
      this.setData({ topStyle: 'top:' + Math.round(top) + 'px;' });
    },
    defaultRequest: function defaultRequest(options) {
      var input = plainObject(options);
      var theme = allowed(Object.prototype.hasOwnProperty.call(input, 'theme') ? input.theme : this.data.theme, THEMES, 'info');
      var durationValue = Object.prototype.hasOwnProperty.call(input, 'duration')
        ? input.duration
        : theme === 'loading' ? 0 : this.data.duration;
      var key = text(input.key) || 'dynamic-message-' + (++this._sequence);
      return {
        key: key,
        theme: theme,
        title: text(Object.prototype.hasOwnProperty.call(input, 'title') ? input.title : this.data.title),
        message: text(Object.prototype.hasOwnProperty.call(input, 'message') ? input.message : this.data.message),
        icon: text(Object.prototype.hasOwnProperty.call(input, 'icon') ? input.icon : this.data.icon),
        actionText: text(Object.prototype.hasOwnProperty.call(input, 'actionText') ? input.actionText : this.data.actionText),
        closable: Object.prototype.hasOwnProperty.call(input, 'closable') ? Boolean(input.closable) : Boolean(this.data.closable),
        duration: Math.round(clamp(durationValue, 0, 60000, theme === 'loading' ? 0 : 3000)),
        ariaLabel: text(Object.prototype.hasOwnProperty.call(input, 'ariaLabel') ? input.ariaLabel : this.data.ariaLabel)
      };
    },
    applyRequest: function applyRequest(request, callback) {
      var icon = request.icon || THEME_ICONS[request.theme] || '';
      var label = request.ariaLabel || request.title || request.message || (request.theme === 'loading' ? '处理中' : '通知');
      this.setData({
        currentKey: request.key,
        currentTheme: request.theme,
        currentTitle: request.title,
        currentMessage: request.message,
        currentIcon: icon,
        currentCustomIcon: request.icon,
        currentActionText: request.actionText,
        currentClosable: request.closable,
        currentDuration: request.duration,
        isLoading: request.theme === 'loading' && !request.icon,
        semanticLabel: label,
        ariaLive: request.theme === 'error' ? 'assertive' : 'polite'
      }, callback);
    },
    syncPresentation: function syncPresentation() {
      var duration = this.motionDuration();
      var compactDuration = this.compactMotionDuration();
      var panelDuration = this.panelMotionDuration();
      this.setData({
        rootClass: [
          'pui-dynamic-message',
          this.getColorSchemeClass(),
          this.data.reduceMotion ? 'pui-dynamic-message--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: [
          '--pui-dynamic-message-duration:' + duration + 'ms',
          '--pui-dynamic-message-compact-duration:' + compactDuration + 'ms',
          '--pui-dynamic-message-panel-duration:' + panelDuration + 'ms'
        ].join(';') + ';'
      });
    },
    show: function show(options) {
      var input = plainObject(options);
      var requestedKey = text(input.key);
      if (this.data.rendered && requestedKey && requestedKey === this.data.currentKey) {
        this.update(requestedKey, input);
        return requestedKey;
      }
      var request = this.defaultRequest(options);
      var queuedIndex = this._queue.findIndex(function findQueued(item) { return item.key === request.key; });
      if (queuedIndex >= 0) this._queue[queuedIndex] = request;
      else this._queue.push(request);
      if (!this.data.rendered) this.activateNext();
      return request.key;
    },
    update: function update(key, patch) {
      var targetKey = text(key);
      var input = plainObject(patch);
      if (!targetKey) return false;
      if (this.data.rendered && targetKey === this.data.currentKey) {
        var request = this.defaultRequest(Object.assign({}, {
          key: targetKey,
          theme: this.data.currentTheme,
          title: this.data.currentTitle,
          message: this.data.currentMessage,
          icon: this.data.currentCustomIcon,
          actionText: this.data.currentActionText,
          closable: this.data.currentClosable,
          duration: this.data.currentDuration
        }, input));
        this.updateCurrent(request);
        return true;
      }
      var index = this._queue.findIndex(function findQueued(item) { return item.key === targetKey; });
      if (index < 0) return false;
      this._queue[index] = this.defaultRequest(Object.assign({}, this._queue[index], input, { key: targetKey }));
      return true;
    },
    hide: function hide(key) {
      var targetKey = text(key);
      if (targetKey && targetKey !== this.data.currentKey) {
        var before = this._queue.length;
        this._queue = this._queue.filter(function retainQueued(item) { return item.key !== targetKey; });
        return this._queue.length !== before;
      }
      if (!this.data.rendered) return false;
      this.beginHide('programmatic');
      return true;
    },
    updateCurrent: function updateCurrent(request) {
      var self = this;
      clearTimeout(this._leaveTimer);
      clearTimeout(this._autoTimer);
      this._leaveTimer = null;
      this._autoTimer = null;
      this.applyRequest(request, function afterUpdate() {
        if (!self._ready) return;
        if (self.data.phase === 'collapsing' || self.data.phase === 'leave-compact') {
          clearTimeout(self._stageTimer);
          clearTimeout(self._completeTimer);
          self.setData({ active: true, phase: 'expanding' });
          self._completeTimer = setTimeout(function finishReopen() {
            self._completeTimer = null;
            if (!self._ready || !self.data.rendered) return;
            self.setData({ active: true, phase: 'visible' });
            self.scheduleAutoHide();
          }, self.data.reduceMotion ? 1 : self.panelMotionDuration());
          return;
        }
        if (self.data.phase === 'compact' || self.data.phase === 'expanding' || self.data.phase === 'entering') return;
        self.setData({ active: true, phase: 'visible' });
        self.scheduleAutoHide();
      });
    },
    activateNext: function activateNext() {
      var self = this;
      if (!this._ready || this.data.rendered || !this._queue.length) return;
      var request = this._queue.shift();
      this.applyRequest(request, function afterRequest() {
        self.setData({ rendered: true, active: false, phase: 'entering' }, function afterMount() {
          self._frameTimer = setTimeout(function enterFrame() {
            self._frameTimer = null;
            if (!self._ready || !self.data.rendered) return;
            if (self.data.reduceMotion) {
              self.setData({ active: true, phase: 'visible' });
              self.scheduleAutoHide();
              return;
            }
            self.setData({ active: true, phase: 'compact' });
            self._stageTimer = setTimeout(function expandPanel() {
              self._stageTimer = null;
              if (!self._ready || !self.data.rendered) return;
              self.setData({ active: true, phase: 'expanding' });
              self._completeTimer = setTimeout(function finishExpand() {
                self._completeTimer = null;
                if (!self._ready || !self.data.rendered) return;
                self.setData({ active: true, phase: 'visible' });
                self.scheduleAutoHide();
              }, self.panelMotionDuration());
            }, self.compactMotionDuration());
          }, 16);
        });
      });
    },
    scheduleAutoHide: function scheduleAutoHide() {
      var self = this;
      clearTimeout(this._autoTimer);
      this._autoTimer = null;
      if (!this.data.currentDuration || !this.data.active) return;
      this._autoTimer = setTimeout(function timeoutHide() {
        self._autoTimer = null;
        self.beginHide('timeout');
      }, this.data.currentDuration);
    },
    beginHide: function beginHide(reason) {
      var self = this;
      if (!this.data.rendered || this.data.phase === 'collapsing' || this.data.phase === 'leave-compact') return;
      clearTimeout(this._frameTimer);
      clearTimeout(this._stageTimer);
      clearTimeout(this._completeTimer);
      clearTimeout(this._autoTimer);
      this._frameTimer = null;
      this._stageTimer = null;
      this._completeTimer = null;
      this._autoTimer = null;
      var closed = { key: this.data.currentKey, theme: this.data.currentTheme, reason: reason };
      var finishHide = function finishHide() {
        self._leaveTimer = null;
        if (!self._ready || !self.data.rendered) return;
        self.setData({
          rendered: false,
          active: false,
          phase: 'hidden',
          currentKey: ''
        }, function afterHide() {
          self.triggerEvent('close', closed);
          self.activateNext();
        });
      };
      if (this.data.reduceMotion) {
        this.setData({ active: false, phase: 'leave-compact' });
        this._leaveTimer = setTimeout(finishHide, 1);
        return;
      }
      this.setData({ active: true, phase: 'collapsing' });
      this._stageTimer = setTimeout(function leaveCompact() {
        self._stageTimer = null;
        if (!self._ready || !self.data.rendered) return;
        self.setData({ active: false, phase: 'leave-compact' });
        self._leaveTimer = setTimeout(finishHide, self.compactMotionDuration());
      }, this.panelMotionDuration());
    },
    onIslandTap: function onIslandTap() {
      this.triggerEvent('click', { key: this.data.currentKey, theme: this.data.currentTheme });
    },
    onActionTap: function onActionTap() {
      this.triggerEvent('action', { key: this.data.currentKey, theme: this.data.currentTheme });
    },
    onCloseTap: function onCloseTap() {
      this.beginHide('manual');
    }
  }
});
