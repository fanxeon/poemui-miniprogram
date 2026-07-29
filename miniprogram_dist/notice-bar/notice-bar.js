var themeBehavior = require('../common/behaviors/theme');

var THEME_ICONS = {
  primary: 'info-circle',
  info: 'info-circle',
  success: 'success-circle',
  warning: 'warning-triangle',
  danger: 'error-circle',
  error: 'error-circle',
};

function hasValue(value) { return value !== null && value !== undefined; }
function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}
function normalizeTheme(value) {
  if (value === 'info') return 'primary';
  if (value === 'error') return 'danger';
  return ['primary', 'success', 'warning', 'danger'].indexOf(value) > -1 ? value : 'primary';
}
function normalizeInterval(value) {
  var interval = Math.round(Number(value));
  return isFinite(interval) ? Math.max(0, interval) : 2000;
}
function stringifyContent(value) {
  if (Array.isArray(value)) return value.map(function (item) { return String(item == null ? '' : item); }).filter(Boolean).join(' · ');
  return value == null ? '' : String(value);
}
function normalizeItems(value) {
  var values = Array.isArray(value) ? value : [value];
  var items = values.map(function (item) { return stringifyContent(item); }).filter(Boolean);
  return items.length ? items : [''];
}
function normalizeIcon(value, fallback) {
  if (value === false || value === null || value === undefined || value === '') return '';
  if (value === true) return fallback || '';
  if (typeof value === 'object') return value.name ? String(value.name) : '';
  return String(value);
}
function normalizeMarquee(value) {
  if (!value) return null;
  var settings = value === true ? {} : (typeof value === 'object' ? value : {});
  var loop = settings.loop === undefined ? -1 : Math.floor(Number(settings.loop));
  if (!isFinite(loop)) loop = -1;
  return {
    speed: clamp(settings.speed, 10, 200, 50),
    loop: loop < 0 ? -1 : Math.min(100, loop),
    delay: clamp(settings.delay, 0, 10000, 0),
  };
}
function marqueeSegmentDuration(config, reduceMotion) {
  if (reduceMotion) return 1;
  return Math.round(clamp(25000 / config.speed, 120, 1000, 500));
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    content: { type: null, value: '' },
    direction: { type: String, value: 'horizontal' },
    interval: { type: Number, value: 2000 },
    marquee: { type: null, value: false },
    operation: { type: String, value: '' },
    prefixIcon: { type: null, value: true },
    suffixIcon: { type: null, value: null },
    theme: { type: String, value: 'primary' },
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: true },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rendered: false,
    innerVisible: false,
    rootClass: 'pui-notice-bar',
    rootStyle: '',
    rootRole: 'status',
    ariaLive: 'polite',
    semanticLabel: '通知',
    isVertical: false,
    swiperInterval: 2000,
    displayContent: '',
    verticalItems: [''],
    prefixIconName: '',
    suffixIconName: '',
    marqueeStyle: 'transition-duration:1ms;transform:translate3d(0,0,0);',
    marqueeActive: false,
  },
  observers: {
    visible: function syncVisible() {
      if (!this._ready) return;
      if (this.isControlled()) {
        this._wasControlled = true;
        this.applyVisibility(Boolean(this.data.visible));
      } else if (this._wasControlled) {
        this._wasControlled = false;
        this._uncontrolledVisible = Boolean(this.data.innerVisible);
      }
    },
    'content,direction,interval,marquee,operation,prefixIcon,suffixIcon,theme,ariaLabel,reduceMotion,colorScheme': function syncPresentation() {
      this.syncPresentation();
      if (this._ready) this.scheduleMarqueeMeasure();
    },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._uncontrolledVisible = Boolean(this.data.defaultVisible);
      this._wasControlled = this.isControlled();
      this.syncPresentation();
      this.applyVisibility(this.effectiveVisible(), true);
    },
    detached: function detached() {
      this._ready = false;
      this.clearVisibilityTimers();
      this.clearMarqueeTimers(false);
    },
  },
  methods: {
    isControlled: function isControlled() { return hasValue(this.data.visible); },
    effectiveVisible: function effectiveVisible() { return this.isControlled() ? Boolean(this.data.visible) : Boolean(this._uncontrolledVisible); },
    clearVisibilityTimers: function clearVisibilityTimers() {
      clearTimeout(this._showTimer);
      clearTimeout(this._hideTimer);
      this._showTimer = null;
      this._hideTimer = null;
    },
    syncPresentation: function syncPresentation() {
      var theme = normalizeTheme(this.data.theme);
      var isVertical = this.data.direction === 'vertical';
      var duration = this.data.reduceMotion ? 1 : 500;
      var label = String(this.data.ariaLabel || stringifyContent(this.data.content) || '通知').trim() || '通知';
      this.setData({
        rootClass: [
          'pui-notice-bar',
          this.getColorSchemeClass(),
          'pui-notice-bar--' + theme,
          isVertical ? 'pui-notice-bar--vertical' : '',
          this.data.reduceMotion ? 'pui-notice-bar--reduced-motion' : '',
          this.data.innerVisible ? 'pui-notice-bar--active' : 'pui-notice-bar--inactive',
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-notice-duration:' + duration + 'ms;',
        rootRole: theme === 'danger' ? 'alert' : 'status',
        ariaLive: theme === 'danger' ? 'assertive' : 'polite',
        semanticLabel: label,
        isVertical: isVertical,
        swiperInterval: normalizeInterval(this.data.interval),
        displayContent: stringifyContent(this.data.content),
        verticalItems: normalizeItems(this.data.content),
        prefixIconName: normalizeIcon(this.data.prefixIcon, THEME_ICONS[theme]),
        suffixIconName: normalizeIcon(this.data.suffixIcon, ''),
      });
    },
    applyVisibility: function applyVisibility(visible, initial) {
      var self = this;
      this.clearVisibilityTimers();
      if (visible) {
        if (this.data.rendered && this.data.innerVisible) {
          this.scheduleMarqueeMeasure();
          return;
        }
        this.setData({ rendered: true, innerVisible: false }, function mountNotice() {
          self.syncPresentation();
          self._showTimer = setTimeout(function enterNotice() {
            self._showTimer = null;
            if (!self._ready || !self.effectiveVisible() || !self.data.rendered) return;
            self.setData({ innerVisible: true }, function enteredNotice() {
              self.syncPresentation();
              self.scheduleMarqueeMeasure();
            });
          }, initial ? 0 : 16);
        });
        return;
      }
      this.clearMarqueeTimers(true);
      if (!this.data.rendered) return;
      this.setData({ innerVisible: false }, function beginLeave() { self.syncPresentation(); });
      this._hideTimer = setTimeout(function finishLeave() {
        self._hideTimer = null;
        if (!self._ready || self.effectiveVisible()) return;
        self.setData({ rendered: false, innerVisible: false });
      }, this.data.reduceMotion ? 1 : 500);
    },
    onClick: function onClick(event) {
      var trigger = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.trigger : 'content';
      if (['prefix-icon', 'content', 'operation', 'suffix-icon'].indexOf(trigger) === -1) trigger = 'content';
      this.triggerEvent('click', { trigger: trigger });
    },
    onVerticalChange: function onVerticalChange(event) {
      this.triggerEvent('change', {
        current: Number(event && event.detail ? event.detail.current : 0) || 0,
        source: 'swiper',
      });
    },
    clearMarqueeTimers: function clearMarqueeTimers(reset) {
      clearTimeout(this._marqueeTimer);
      clearTimeout(this._marqueeMeasureTimer);
      this._marqueeTimer = null;
      this._marqueeMeasureTimer = null;
      if (reset) {
        this._marqueeOffset = 0;
        this._marqueeDistance = 0;
        this._marqueeCycles = 0;
        this.setData({ marqueeActive: false, marqueeStyle: 'transition-duration:1ms;transform:translate3d(0,0,0);' });
      }
    },
    scheduleMarqueeMeasure: function scheduleMarqueeMeasure() {
      var self = this;
      var config = normalizeMarquee(this.data.marquee);
      clearTimeout(this._marqueeMeasureTimer);
      if (!this._ready || !this.data.innerVisible || this.data.isVertical || !config || !config.loop || this.data.reduceMotion) {
        this.clearMarqueeTimers(true);
        return;
      }
      this._marqueeMeasureTimer = setTimeout(function measureLater() {
        self._marqueeMeasureTimer = null;
        self.measureMarquee(config);
      }, 32);
    },
    measureMarquee: function measureMarquee(config) {
      var self = this;
      if (!this.createSelectorQuery || !this.data.innerVisible || this.data.isVertical || this.data.reduceMotion) return;
      this.createSelectorQuery()
        .select('.pui-notice-bar__viewport').boundingClientRect()
        .select('.pui-notice-bar__text').boundingClientRect()
        .exec(function measured(rects) {
          var viewport = rects && rects[0];
          var text = rects && rects[1];
          if (!viewport || !text || !self._ready) return;
          var distance = Math.max(0, Math.ceil(text.width - viewport.width));
          self.clearMarqueeTimers(true);
          if (distance <= 1) return;
          self._marqueeConfig = config;
          self._marqueeDistance = distance;
          self._marqueeTimer = setTimeout(function startMeasuredMarquee() { self.advanceMarquee(); }, config.delay);
        });
    },
    advanceMarquee: function advanceMarquee() {
      var self = this;
      var config = this._marqueeConfig;
      if (!this._ready || !this.data.innerVisible || this.data.isVertical || !config || this.data.reduceMotion || !this._marqueeDistance) return;
      var duration = marqueeSegmentDuration(config, this.data.reduceMotion);
      var next = Math.min(this._marqueeDistance, (this._marqueeOffset || 0) + 12);
      this._marqueeOffset = next;
      this.setData({ marqueeActive: true, marqueeStyle: 'transition-duration:' + duration + 'ms;transform:translate3d(-' + next + 'px,0,0);' });
      this._marqueeTimer = setTimeout(function finishSegment() {
        self._marqueeTimer = null;
        if (next < self._marqueeDistance) {
          self.advanceMarquee();
          return;
        }
        self._marqueeCycles += 1;
        if (config.loop !== -1 && self._marqueeCycles >= config.loop) return;
        self._marqueeTimer = setTimeout(function resetCycle() {
          self._marqueeOffset = 0;
          self.setData({ marqueeActive: false, marqueeStyle: 'transition-duration:1ms;transform:translate3d(0,0,0);' });
          self._marqueeTimer = setTimeout(function restartCycle() { self.advanceMarquee(); }, config.delay);
        }, duration);
      }, duration);
    },
  },
});
