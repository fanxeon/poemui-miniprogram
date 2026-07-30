var themeBehavior = require('../common/behaviors/theme');
var platformInfo = require('../common/utils/platform-info');
var tourData = require('../common/utils/tour-data');

function hasControl(value) {
  return value !== null && value !== undefined;
}

function normalizeDuration(value, reduceMotion) {
  if (reduceMotion) return 1;
  var duration = Number(value);
  if (!isFinite(duration)) duration = 400;
  return Math.max(0, Math.min(1000, Math.round(duration)));
}

function px(value) {
  return Math.max(0, Number(value) || 0).toFixed(2).replace(/\.00$/, '') + 'px';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    steps: { type: Array, value: [] },
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: false },
    current: { type: null, value: null },
    defaultCurrent: { type: Number, value: 0 },
    closeOnOverlay: { type: Boolean, value: true },
    overlayBlur: { type: Boolean, value: false },
    showSkip: { type: Boolean, value: true },
    showIndicators: { type: Boolean, value: true },
    zIndex: { type: Number, value: 11500 },
    duration: { type: Number, value: 400 },
    ariaLabel: { type: String, value: '功能引导' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    normalizedSteps: [],
    rendered: false,
    entered: false,
    opened: false,
    activeIndex: 0,
    activeStep: {},
    placement: 'bottom',
    rootClass: 'pui-tour',
    rootStyle: '',
    targetStyle: '',
    panelStyle: '',
    maskTopStyle: '',
    maskRightStyle: '',
    maskBottomStyle: '',
    maskLeftStyle: '',
    semanticLabel: '功能引导'
  },
  observers: {
    'steps,visible,defaultVisible,current,defaultCurrent,closeOnOverlay,overlayBlur,showSkip,showIndicators,zIndex,duration,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState(false);
    }
  },
  lifetimes: {
    attached: function attached() {
      this._attached = true;
      this.syncState(true);
    },
    detached: function detached() {
      this._attached = false;
      clearTimeout(this._enterTimer);
      clearTimeout(this._leaveTimer);
      clearTimeout(this._measureTimer);
    }
  },
  methods: {
    syncState: function syncState(initial) {
      var steps = tourData.normalizeSteps(this.data.steps);
      var visibleControlled = hasControl(this.data.visible);
      var currentControlled = hasControl(this.data.current);
      if (initial || !this._initialized) {
        this._initialized = true;
        this._visible = visibleControlled ? Boolean(this.data.visible) : Boolean(this.data.defaultVisible);
        this._current = tourData.clampInteger(currentControlled ? this.data.current : this.data.defaultCurrent, 0, Math.max(0, steps.length - 1), 0);
      } else {
        if (visibleControlled) this._visible = Boolean(this.data.visible);
        if (currentControlled) this._current = tourData.clampInteger(this.data.current, 0, Math.max(0, steps.length - 1), 0);
        else this._current = tourData.clampInteger(this._current, 0, Math.max(0, steps.length - 1), 0);
      }
      this._visibleControlled = visibleControlled;
      this._currentControlled = currentControlled;
      var duration = normalizeDuration(this.data.duration, this.data.reduceMotion);
      var activeStep = steps[this._current] || {};
      this.setData({
        normalizedSteps: steps,
        activeIndex: this._current,
        activeStep: activeStep,
        semanticLabel: String(this.data.ariaLabel || '功能引导') + (steps.length ? '，第 ' + (this._current + 1) + ' 步，共 ' + steps.length + ' 步' : ''),
        rootClass: [
          'pui-tour',
          this.getColorSchemeClass(),
          this.data.overlayBlur ? 'pui-tour--overlay-blur' : '',
          this.data.reduceMotion ? 'pui-tour--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: 'z-index:' + Math.max(1, Math.min(12000, Math.round(Number(this.data.zIndex) || 11500))) + ';--pui-tour-duration:' + duration + 'ms;'
      });
      this._syncVisibility(steps);
    },

    _syncVisibility: function syncVisibility(steps) {
      clearTimeout(this._enterTimer);
      clearTimeout(this._leaveTimer);
      if (this._visible) {
        if (!steps.length) {
          this._fail('empty-steps', 'Tour 至少需要一个步骤');
          return;
        }
        this.setData({ rendered: true, opened: true, entered: false }, function mounted() {
          this._measureActiveStep();
          this._enterTimer = setTimeout(function enter() {
            if (this._attached && this._visible) this.setData({ entered: true });
          }.bind(this), this.data.reduceMotion ? 0 : 16);
        }.bind(this));
        return;
      }
      if (!this.data.rendered) return;
      this.setData({ opened: false, entered: false });
      this._leaveTimer = setTimeout(function unmount() {
        if (this._attached && !this._visible) this.setData({ rendered: false });
      }.bind(this), normalizeDuration(this.data.duration, this.data.reduceMotion));
    },

    _measureActiveStep: function measureActiveStep() {
      clearTimeout(this._measureTimer);
      var step = this.data.normalizedSteps[this._current];
      if (!step || !step.selector) {
        this._fail('invalid-selector', '当前步骤缺少可用的 #id 或 .class 目标选择器');
        return;
      }
      var query = typeof wx !== 'undefined' && wx.createSelectorQuery ? wx.createSelectorQuery() : null;
      if (!query) {
        this._fail('query-unavailable', '当前环境无法测量引导目标');
        return;
      }
      query.select(step.selector).boundingClientRect().exec(function measured(result) {
        var rect = result && result[0];
        if (!rect || !rect.width || !rect.height) {
          this._fail('target-not-found', '未找到引导目标 ' + step.selector);
          return;
        }
        this._applyTargetGeometry(rect, step);
      }.bind(this));
    },

    _applyTargetGeometry: function applyTargetGeometry(rect, step) {
      var info = platformInfo.getWindowInfo();
      var viewport = {
        width: Math.max(1, Number(info.windowWidth) || 375),
        height: Math.max(1, Number(info.windowHeight) || 667)
      };
      var target = tourData.clampTarget(rect, viewport, step.padding);
      var placement = tourData.resolvePlacement(step.placement, target, viewport, 180);
      var gap = 12;
      var edge = 16;
      var panelWidth = Math.min(320, viewport.width - edge * 2);
      var panelStyle = 'width:' + px(panelWidth) + ';';
      if (placement === 'bottom' || placement === 'top') {
        var horizontal = Math.max(edge, Math.min(viewport.width - panelWidth - edge, target.left + target.width / 2 - panelWidth / 2));
        panelStyle += 'left:' + px(horizontal) + ';';
        if (placement === 'bottom') {
          panelStyle += 'top:' + px(target.bottom + gap) + ';max-height:' + px(Math.max(120, viewport.height - target.bottom - gap - edge)) + ';';
        } else {
          panelStyle += 'bottom:' + px(viewport.height - target.top + gap) + ';max-height:' + px(Math.max(120, target.top - gap - edge)) + ';';
        }
      } else {
        var available = placement === 'right' ? viewport.width - target.right - gap - edge : target.left - gap - edge;
        panelWidth = Math.max(180, Math.min(280, available));
        var vertical = Math.max(edge, Math.min(viewport.height - 220 - edge, target.top + target.height / 2 - 110));
        panelStyle = 'width:' + px(panelWidth) + ';top:' + px(vertical) + ';max-height:' + px(viewport.height - vertical - edge) + ';';
        panelStyle += placement === 'right' ? 'left:' + px(target.right + gap) + ';' : 'right:' + px(viewport.width - target.left + gap) + ';';
      }
      this.setData({
        placement: placement,
        targetStyle: 'left:' + px(target.left) + ';top:' + px(target.top) + ';width:' + px(target.width) + ';height:' + px(target.height) + ';',
        maskTopStyle: 'left:0;top:0;width:100%;height:' + px(target.top) + ';',
        maskBottomStyle: 'left:0;top:' + px(target.bottom) + ';width:100%;height:' + px(viewport.height - target.bottom) + ';',
        maskLeftStyle: 'left:0;top:' + px(target.top) + ';width:' + px(target.left) + ';height:' + px(target.height) + ';',
        maskRightStyle: 'left:' + px(target.right) + ';top:' + px(target.top) + ';width:' + px(viewport.width - target.right) + ';height:' + px(target.height) + ';',
        panelStyle: panelStyle
      });
    },

    _fail: function fail(code, message) {
      this.triggerEvent('error', { code: code, message: message, index: this._current });
      this._requestVisible(false, 'error');
    },

    _requestVisible: function requestVisible(next, reason) {
      var value = Boolean(next);
      if (!this._visibleControlled) this._visible = value;
      this.triggerEvent('visible-change', { visible: value, reason: reason || 'method', current: this._current });
      if (!this._visibleControlled) this._syncVisibility(this.data.normalizedSteps);
    },

    _requestCurrent: function requestCurrent(next, reason) {
      var index = tourData.clampInteger(next, 0, Math.max(0, this.data.normalizedSteps.length - 1), 0);
      var previous = this._current;
      if (index === previous) return false;
      if (!this._currentControlled) this._current = index;
      var detail = { current: index, previous: previous, reason: reason || 'method', step: this.data.normalizedSteps[index] };
      this.triggerEvent('current-change', detail);
      this.triggerEvent('change', detail);
      if (!this._currentControlled) {
        this.setData({ activeIndex: index, activeStep: this.data.normalizedSteps[index], entered: false }, function changed() {
          this._measureActiveStep();
          this._enterTimer = setTimeout(function enter() {
            if (this._attached && this._visible) this.setData({ entered: true });
          }.bind(this), this.data.reduceMotion ? 0 : 16);
        }.bind(this));
      }
      return true;
    },

    open: function open(index) {
      if (index !== undefined && index !== null) {
        var normalized = tourData.clampInteger(index, 0, Math.max(0, this.data.normalizedSteps.length - 1), 0);
        if (!this._currentControlled) this._current = normalized;
      }
      this._requestVisible(true, 'method-open');
      return true;
    },

    close: function close(reason) {
      if (!this._visible) return false;
      this.triggerEvent('close', { current: this._current, reason: reason || 'method-close' });
      this._requestVisible(false, reason || 'method-close');
      return true;
    },

    next: function next() {
      if (this._current >= this.data.normalizedSteps.length - 1) {
        this.triggerEvent('finish', { current: this._current, step: this.data.activeStep });
        this.close('finish');
        return true;
      }
      return this._requestCurrent(this._current + 1, 'next');
    },

    prev: function prev() {
      return this._requestCurrent(this._current - 1, 'prev');
    },

    onNext: function onNext() { this.next(); },
    onPrev: function onPrev() { this.prev(); },
    onClose: function onClose() { this.close('close-button'); },
    onSkip: function onSkip() {
      this.triggerEvent('skip', { current: this._current, step: this.data.activeStep });
      this.close('skip');
    },
    onOverlayTap: function onOverlayTap() {
      if (this.data.closeOnOverlay) this.close('overlay');
    },
    noop: function noop() {}
  }
});
