var RTL_LANGUAGES = {
  ar: true,
  arc: true,
  dv: true,
  fa: true,
  he: true,
  iw: true,
  ku: true,
  nqo: true,
  ps: true,
  sd: true,
  syr: true,
  ug: true,
  ur: true,
  yi: true,
};
var platformInfo = require('../common/utils/platform-info');

function normalizeLanguage(value) {
  return String(value || '').trim().replace(/_/g, '-').toLowerCase();
}

function languageDirection(language) {
  var base = normalizeLanguage(language).split('-')[0];
  return RTL_LANGUAGES[base] ? 'rtl' : 'ltr';
}

function normalizeFallback(value) {
  return value === 'rtl' ? 'rtl' : 'ltr';
}

function normalizeDisplay(value) {
  return ['block', 'inline-block', 'flex', 'inline-flex'].indexOf(value) >= 0 ? value : 'block';
}

function normalizeTextAlign(value) {
  return ['start', 'end', 'left', 'right', 'center'].indexOf(value) >= 0 ? value : 'start';
}

function resolvePhysicalAlign(value, direction) {
  if (value === 'center' || value === 'left' || value === 'right') return value;
  if (value === 'end') return direction === 'rtl' ? 'left' : 'right';
  return direction === 'rtl' ? 'right' : 'left';
}

function normalizeDuration(value, reduced) {
  if (reduced) return 1;
  var number = Number(value);
  if (!isFinite(number)) return 500;
  return Math.max(0, Math.min(1000, Math.round(number)));
}

function resolveEasing(value) {
  var easings = {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    ease: 'ease',
    linear: 'linear',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
  };
  return easings[value] || easings.standard;
}

Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'shared',
  },
  externalClasses: ['custom-class'],
  properties: {
    direction: { type: String, value: 'ltr' },
    language: { type: String, value: '' },
    fallbackDirection: { type: String, value: 'ltr' },
    textAlign: { type: String, value: 'start' },
    display: { type: String, value: 'block' },
    content: { type: String, value: '' },
    useSlot: { type: Boolean, value: true },
    selectable: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '阅读方向容器' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false },
    customClass: { type: String, value: '' },
    customStyle: { type: String, value: '' },
  },
  data: {
    resolvedDirection: 'ltr',
    resolvedLanguage: '',
    languageSource: 'explicit',
    fallbackUsed: false,
    resolvedTextAlign: 'left',
    resolvedDisplay: 'block',
    motionDuration: 500,
    motionPhase: 250,
    changing: false,
    ready: false,
    rootClass: 'pui-direction pui-direction--ltr pui-direction--align-left pui-direction--block',
    rootStyle: '--pui-direction-duration:250ms;--pui-direction-ease:cubic-bezier(0.2, 0, 0, 1)',
  },
  observers: {
    'direction,language,fallbackDirection,textAlign,display,duration,easing,reduceMotion': function directionObserver() {
      if (this._directionAttached) this.syncDirection('property');
    },
  },
  lifetimes: {
    attached: function attached() {
      this._directionAttached = true;
      this.syncDirection('attached');
    },
    detached: function detached() {
      this._directionAttached = false;
      this.clearDirectionTimers();
    },
  },
  methods: {
    clearDirectionTimers: function clearDirectionTimers() {
      clearTimeout(this._directionSwapTimer);
      clearTimeout(this._directionAfterTimer);
      this._directionSwapTimer = null;
      this._directionAfterTimer = null;
    },
    readSystemLanguage: function readSystemLanguage() {
      var appBase = platformInfo.getAppBaseInfo();
      if (appBase.language) return { language: normalizeLanguage(appBase.language), source: 'system', error: '' };
      return { language: '', source: 'fallback', error: '' };
    },
    resolveDirectionState: function resolveDirectionState() {
      var requested = String(this.data.direction || '').trim().toLowerCase();
      var fallback = normalizeFallback(this.data.fallbackDirection);
      var explicitLanguage = normalizeLanguage(this.data.language);
      var languageInfo = explicitLanguage
        ? { language: explicitLanguage, source: 'property', error: '' }
        : { language: '', source: 'explicit', error: '' };
      var resolved = fallback;
      var fallbackUsed = false;

      if (requested === 'ltr' || requested === 'rtl') {
        resolved = requested;
      } else if (requested === 'auto') {
        if (!explicitLanguage) languageInfo = this.readSystemLanguage();
        if (languageInfo.language) resolved = languageDirection(languageInfo.language);
        else fallbackUsed = true;
      } else {
        requested = fallback;
        resolved = fallback;
        fallbackUsed = true;
        languageInfo.source = 'fallback';
      }

      var align = normalizeTextAlign(this.data.textAlign);
      var display = normalizeDisplay(this.data.display);
      var duration = normalizeDuration(this.data.duration, this.data.reduceMotion);
      var phase = duration > 1 ? Math.max(1, Math.floor(duration / 2)) : duration;
      var easing = resolveEasing(this.data.easing);
      var physicalAlign = resolvePhysicalAlign(align, resolved);
      return {
        requestedDirection: requested,
        direction: resolved,
        language: languageInfo.language,
        languageSource: languageInfo.source,
        fallbackUsed: fallbackUsed,
        error: languageInfo.error || '',
        textAlign: physicalAlign,
        display: display,
        duration: duration,
        phase: phase,
        easing: easing,
        rootClass: [
          'pui-direction',
          'pui-direction--' + resolved,
          'pui-direction--align-' + physicalAlign,
          'pui-direction--' + display,
        ].join(' '),
        rootStyle: '--pui-direction-duration:' + phase + 'ms;--pui-direction-ease:' + easing,
      };
    },
    eventDetail: function eventDetail(state, source, previousDirection) {
      return {
        requestedDirection: state.requestedDirection,
        direction: state.direction,
        previousDirection: previousDirection || '',
        language: state.language,
        languageSource: state.languageSource,
        fallbackUsed: state.fallbackUsed,
        textAlign: state.textAlign,
        display: state.display,
        source: source,
        error: state.error,
      };
    },
    syncDirection: function syncDirection(source) {
      var state = this.resolveDirectionState();
      var wasReady = !!this.data.ready;
      var previousDirection = this.data.resolvedDirection;
      var changed = wasReady && previousDirection !== state.direction;
      var self = this;
      this.clearDirectionTimers();
      this.setData({
        resolvedDirection: state.direction,
        resolvedLanguage: state.language,
        languageSource: state.languageSource,
        fallbackUsed: state.fallbackUsed,
        resolvedTextAlign: state.textAlign,
        resolvedDisplay: state.display,
        motionDuration: state.duration,
        motionPhase: state.phase,
        changing: changed && state.duration > 0,
        ready: true,
        rootClass: state.rootClass,
        rootStyle: state.rootStyle,
      }, function afterDirectionSync() {
        var detail = self.eventDetail(state, source || 'property', previousDirection);
        self.triggerEvent('resolve', detail);
        if (!wasReady) {
          self.triggerEvent('ready', detail);
          return;
        }
        if (!changed) return;
        self.triggerEvent('change', detail);
        if (!state.duration) {
          self.triggerEvent('after-change', detail);
          return;
        }
        var firstPhase = state.phase;
        var secondPhase = Math.max(0, state.duration - firstPhase);
        self._directionSwapTimer = setTimeout(function releaseDirectionFade() {
          self.setData({ changing: false });
          self._directionAfterTimer = setTimeout(function completeDirectionChange() {
            self._directionAfterTimer = null;
            self.triggerEvent('after-change', detail);
          }, secondPhase);
        }, firstPhase);
      });
      return state;
    },
    refresh: function refresh(source) {
      return this.syncDirection(source || 'refresh');
    },
    getDirection: function getDirection() {
      return this.data.resolvedDirection;
    },
    getState: function getState() {
      return {
        requestedDirection: String(this.data.direction || ''),
        direction: this.data.resolvedDirection,
        language: this.data.resolvedLanguage,
        languageSource: this.data.languageSource,
        fallbackUsed: this.data.fallbackUsed,
        textAlign: this.data.resolvedTextAlign,
        display: this.data.resolvedDisplay,
        changing: this.data.changing,
      };
    },
  },
});
