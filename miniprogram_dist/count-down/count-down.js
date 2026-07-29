var themeBehavior = require('../common/behaviors/theme');

var MAX_TIME = 31536000000;
var SIZES = ['small', 'medium', 'large'];
var THEMES = ['default', 'round', 'square'];
var CONTENT_MODES = ['default', 'slot'];
var ANIMATIONS = ['pulse', 'roll'];

function clampTime(value) {
  var time = Number(value);
  if (!isFinite(time)) time = 0;
  return Math.max(0, Math.min(MAX_TIME, Math.round(time)));
}

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function normalizeFormat(value) {
  var format = String(value || '').slice(0, 80);
  return format || 'HH:mm:ss';
}

function pad(number, length) {
  var result = String(Math.max(0, Math.floor(number)));
  while (result.length < length) result = '0' + result;
  return result;
}

function timeParts(time) {
  var milliseconds = clampTime(time);
  return {
    days: Math.floor(milliseconds / 86400000),
    hours: Math.floor(milliseconds % 86400000 / 3600000),
    minutes: Math.floor(milliseconds % 3600000 / 60000),
    seconds: Math.floor(milliseconds % 60000 / 1000),
    milliseconds: milliseconds % 1000,
    totalHours: Math.floor(milliseconds / 3600000),
    totalMinutes: Math.floor(milliseconds / 60000),
    totalSeconds: Math.floor(milliseconds / 1000),
  };
}

function buildSegments(time, formatValue, splitWithUnit) {
  var format = normalizeFormat(formatValue);
  var parts = timeParts(time);
  var hasDay = format.indexOf('DD') > -1;
  var hasHour = format.indexOf('HH') > -1;
  var hasMinute = format.indexOf('mm') > -1;
  var values = {
    DD: pad(parts.days, 2),
    HH: pad(hasDay ? parts.hours : parts.totalHours, 2),
    mm: pad(hasDay || hasHour ? parts.minutes : parts.totalMinutes, 2),
    ss: pad(hasDay || hasHour || hasMinute ? parts.seconds : parts.totalSeconds, 2),
    SSS: pad(parts.milliseconds, 3),
  };
  var units = { DD: '天', HH: '时', mm: '分', ss: '秒', SSS: '毫秒' };
  var segments = [];
  format.split(/(SSS|DD|HH|mm|ss)/g).forEach(function appendPart(part, index) {
    if (!part) return;
    if (values[part] !== undefined) {
      segments.push({ key: 'number-' + index, token: part, value: values[part], unit: splitWithUnit ? units[part] : '', numeric: true });
    } else {
      segments.push({ key: 'literal-' + index, token: '', value: part, unit: '', numeric: false });
    }
  });
  return segments;
}

function formattedText(segments) {
  return segments.map(function mapSegment(item) { return item.value + (item.unit || ''); }).join('');
}

function digitModels(segment, previousSegment, animation, animate, motionIndex) {
  var value = String(segment.value);
  var previousValue = previousSegment && previousSegment.numeric && previousSegment.token === segment.token
    ? String(previousSegment.value)
    : value;
  while (previousValue.length < value.length) previousValue = ' ' + previousValue;
  var previousDigits = previousValue.slice(-value.length).split('');
  return value.split('').map(function mapDigit(digit, index) {
    var previous = previousDigits[index];
    var rolling = animation === 'roll'
      && segment.token !== 'SSS'
      && !!animate
      && previous !== ' '
      && previous !== digit;
    return {
      key: 'digit-' + index,
      value: digit,
      previous: rolling ? previous : digit,
      rolling: rolling,
      motionClass: rolling ? 'pui-count-down__digit-reel--motion-' + (motionIndex % 2 ? 'a' : 'b') : '',
    };
  });
}

Component({
  behaviors: [themeBehavior],
  options: { styleIsolation: 'shared' },
  properties: {
    time: { type: Number, value: 0 },
    autoStart: { type: Boolean, value: true },
    paused: { type: Boolean, value: false },
    content: { type: String, value: 'default' },
    format: { type: String, value: 'HH:mm:ss' },
    millisecond: { type: Boolean, value: false },
    size: { type: String, value: 'medium' },
    theme: { type: String, value: 'default' },
    splitWithUnit: { type: Boolean, value: false },
    animation: { type: String, value: 'pulse' },
    ariaLabel: { type: String, value: '倒计时' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    segments: [],
    remaining: 0,
    formatted: '',
    running: false,
    finished: true,
    status: 'finished',
    contentMode: 'default',
    rootClass: 'pui-count-down',
    rootStyle: '',
    motionClass: '',
    animationMode: 'pulse',
  },
  observers: {
    time: function onTimeChange() {
      if (this._ready) this._reset(true, this.data.autoStart && !this.data.paused);
    },
    paused: function onPausedChange(value) {
      if (!this._ready) return;
      if (value) {
        this._pausedByProperty = this.data.running;
        this._pause(true);
      } else if (this._pausedByProperty) {
        this._pausedByProperty = false;
        this._start();
      }
    },
    autoStart: function onAutoStartChange(value) {
      if (!this._ready || !value || this.data.paused || this._hasStarted || this.data.remaining <= 0) return;
      this._start();
    },
    'content,format,millisecond,size,theme,splitWithUnit,animation,reduceMotion,colorScheme': function refresh() {
      if (!this._ready) return;
      this.renderTime(false);
      if (this.data.running) this.scheduleTick();
    },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._reset(false, this.data.autoStart && !this.data.paused);
    },
    detached: function detached() {
      this.stopTimer();
      this._ready = false;
    },
  },
  methods: {
    usesMillisecond: function usesMillisecond() {
      return this.data.millisecond || normalizeFormat(this.data.format).indexOf('SSS') > -1;
    },
    displayTime: function displayTime(time) {
      return this.usesMillisecond() ? clampTime(time) : Math.min(MAX_TIME, Math.ceil(clampTime(time) / 1000) * 1000);
    },
    rootState: function rootState() {
      if (this.data.remaining <= 0) return 'finished';
      if (this.data.running) return 'running';
      return this._hasStarted ? 'paused' : 'idle';
    },
    snapshot: function snapshot(time) {
      var normalized = clampTime(time);
      var parts = timeParts(normalized);
      var segments = buildSegments(this.displayTime(normalized), this.data.format, this.data.splitWithUnit);
      return {
        time: normalized,
        days: parts.days,
        hours: parts.hours,
        minutes: parts.minutes,
        seconds: parts.seconds,
        milliseconds: parts.milliseconds,
        totalHours: parts.totalHours,
        totalMinutes: parts.totalMinutes,
        totalSeconds: parts.totalSeconds,
        formatted: formattedText(segments),
      };
    },
    renderTime: function renderTime(animate) {
      var size = normalizeEnum(this.data.size, SIZES, 'medium');
      var theme = normalizeEnum(this.data.theme, THEMES, 'default');
      var contentMode = normalizeEnum(this.data.content, CONTENT_MODES, 'default');
      var animation = normalizeEnum(this.data.animation, ANIMATIONS, 'pulse');
      var state = this.rootState();
      var segments = buildSegments(this.displayTime(this.data.remaining), this.data.format, this.data.splitWithUnit);
      var nextFormatted = formattedText(segments);
      var shouldAnimate = !!animate && this._lastFormatted !== undefined && this._lastFormatted !== nextFormatted;
      if (shouldAnimate) this._motionIndex = (this._motionIndex || 0) + 1;
      var previousSegments = this.data.segments || [];
      var motionIndex = this._motionIndex || 0;
      segments = segments.map(function mapSegment(segment, index) {
        if (!segment.numeric) return segment;
        segment.digits = digitModels(segment, previousSegments[index], animation, shouldAnimate, motionIndex);
        return segment;
      });
      var classes = [
        'pui-count-down',
        this.getColorSchemeClass(),
        'pui-count-down--' + size,
        'pui-count-down--' + theme,
        'pui-count-down--' + state,
        'pui-count-down--animation-' + animation,
        contentMode === 'slot' ? 'pui-count-down--slot' : '',
      ];
      this._lastFormatted = nextFormatted;
      this.setData({
        segments: segments,
        formatted: nextFormatted,
        finished: this.data.remaining <= 0,
        status: state,
        contentMode: contentMode,
        rootClass: classes.filter(Boolean).join(' '),
        rootStyle: '--pui-count-down-duration:' + (this.data.reduceMotion ? 1 : 500) + 'ms;',
        motionClass: shouldAnimate && animation === 'pulse' ? 'pui-count-down__value--motion-' + (motionIndex % 2 ? 'a' : 'b') : '',
        animationMode: animation,
      });
    },
    emitChange: function emitChange(time) {
      this.triggerEvent('change', this.snapshot(time));
    },
    setRemaining: function setRemaining(time, emitChange, callback) {
      var component = this;
      var remaining = clampTime(time);
      var previous = this.data.remaining;
      this.setData({ remaining: remaining }, function afterSetRemaining() {
        component.renderTime(previous !== remaining);
        if (emitChange && previous !== remaining) component.emitChange(remaining);
        if (callback) callback();
      });
    },
    tick: function tick() {
      if (!this.data.running) return;
      var remaining = Math.max(0, Number(this._targetTime || Date.now()) - Date.now());
      if (remaining <= 0) {
        this.stopTimer();
        this.setData({ running: false, remaining: 0 }, function onFinished() {
          this.renderTime(true);
          this.emitChange(0);
          if (!this._finishEmitted) {
            this._finishEmitted = true;
            this.triggerEvent('finish', this.snapshot(0));
          }
        }.bind(this));
        return;
      }
      this.setRemaining(remaining, true, this.scheduleTick.bind(this));
    },
    scheduleTick: function scheduleTick() {
      this.stopTimer();
      if (!this.data.running) return;
      var delay = 50;
      if (!this.usesMillisecond()) {
        var remainder = clampTime(this.data.remaining) % 1000;
        delay = Math.max(16, Math.min(1000, remainder || 1000));
      }
      this._timer = setTimeout(this.tick.bind(this), delay);
    },
    _start: function _start() {
      if (!this._ready || this.data.running || this.data.paused || this.data.remaining <= 0) return false;
      this.stopTimer();
      this._hasStarted = true;
      this._finishEmitted = false;
      this._targetTime = Date.now() + clampTime(this.data.remaining);
      this.setData({ running: true }, function afterStart() {
        this.renderTime(false);
        this.scheduleTick();
      }.bind(this));
      return true;
    },
    start: function start() {
      return this._start();
    },
    _pause: function _pause(emitChange) {
      if (!this.data.running) return false;
      var remaining = Math.max(0, Number(this._targetTime || Date.now()) - Date.now());
      var previous = this.data.remaining;
      this.stopTimer();
      this.setData({ running: false, remaining: remaining }, function afterPause() {
        this.renderTime(previous !== remaining);
        if (emitChange !== false && previous !== remaining) this.emitChange(remaining);
        if (remaining <= 0 && !this._finishEmitted) {
          this._finishEmitted = true;
          this.triggerEvent('finish', this.snapshot(0));
        }
      }.bind(this));
      return true;
    },
    pause: function pause() {
      return this._pause(true);
    },
    _reset: function _reset(emitChange, shouldStart) {
      this.stopTimer();
      this._finishEmitted = false;
      this._hasStarted = false;
      var remaining = clampTime(this.data.time);
      this._pausedByProperty = !!this.data.paused && !!this.data.autoStart && remaining > 0;
      this.setData({ remaining: remaining, running: false }, function afterReset() {
        this.renderTime(false);
        if (emitChange) this.emitChange(remaining);
        if (shouldStart && remaining > 0) this._start();
      }.bind(this));
      return remaining;
    },
    reset: function reset() {
      return this._reset(true, this.data.autoStart && !this.data.paused);
    },
    getTime: function getTime() {
      return clampTime(this.data.running ? Math.max(0, Number(this._targetTime || Date.now()) - Date.now()) : this.data.remaining);
    },
    stopTimer: function stopTimer() {
      if (!this._timer) return;
      clearTimeout(this._timer);
      this._timer = null;
    },
  },
});
