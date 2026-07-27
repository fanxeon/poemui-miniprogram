var themeBehavior = require('../common/behaviors/theme');

var STATUS_ICONS = {
  success: 'success-circle',
  warning: 'warning-triangle',
  error: 'error-circle'
};

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.max(min, Math.min(max, number));
}

function percentage(value) {
  return Math.round(clamp(value, 0, 100, 0) * 100) / 100;
}

function normalizeTheme(value) {
  return ['line', 'plump', 'circle'].indexOf(value) > -1 ? value : 'line';
}

function normalizeStatus(value, current) {
  if (['success', 'warning', 'error', 'active'].indexOf(value) > -1) return value;
  return current >= 100 ? 'success' : 'active';
}

function safeColor(value) {
  var color = String(value || '').trim();
  if (!color) return '';
  if (/^#[0-9a-f]{3,8}$/i.test(color)) return color;
  if (/^(rgba?|hsla?)\(\s*[-+.%\d\s,]+\)$/i.test(color)) return color;
  if (/^(transparent|currentColor)$/i.test(color)) return color;
  if (/^var\(--[a-z0-9-]+\)$/i.test(color)) return color;
  return '';
}

function statusColor(status) {
  if (status === 'success') return 'var(--pui-color-success)';
  if (status === 'warning') return 'var(--pui-color-warning)';
  if (status === 'error') return 'var(--pui-color-danger)';
  if (status === 'active') return 'var(--pui-color-info)';
  return 'var(--pui-color-brand)';
}

function formatPercentage(value) {
  return Number(value) % 1 === 0 ? String(value) : String(Number(value).toFixed(2)).replace(/0+$/, '').replace(/\.$/, '');
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    percentage: { type: Number, value: 0 },
    theme: { type: String, value: 'line' },
    label: { type: null, value: true },
    size: { type: Number, value: 160 },
    status: { type: String, value: '' },
    strokeWidth: { type: Number, value: 12 },
    color: { type: String, value: '' },
    trackColor: { type: String, value: '' },
    ariaLabel: { type: String, value: '进度' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    normalizedPercentage: 0,
    currentTheme: 'line',
    currentStatus: 'active',
    statusIcon: '',
    iconColor: 'var(--pui-color-info)',
    labelText: '0%',
    showLabel: true,
    semanticLabel: '进度：0%',
    rootClass: 'pui-progress pui-progress--line pui-progress--active',
    rootStyle: '',
    trackStyle: '',
    circleStyle: '',
    circleClipStyle: '',
    circleSpinnerStyle: '',
    halfRotation: 0,
    fullRotation: 0
  },
  observers: {
    'percentage,theme,label,size,status,strokeWidth,color,trackColor,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this.syncState();
    }
  },
  methods: {
    syncState: function syncState() {
      var current = percentage(this.data.percentage);
      var theme = normalizeTheme(this.data.theme);
      var status = normalizeStatus(this.data.status, current);
      var size = Math.round(clamp(this.data.size, 80, 320, 160));
      var stroke = Math.round(clamp(this.data.strokeWidth, 4, Math.min(48, size / 3), 12));
      var activeColor = safeColor(this.data.color) || statusColor(status);
      var trackColor = safeColor(this.data.trackColor) || 'var(--pui-bg-muted)';
      var showLabel = this.data.label !== false && this.data.label !== '';
      var labelText = typeof this.data.label === 'string' ? this.data.label : formatPercentage(current) + '%';
      var label = this.data.ariaLabel || '进度';
      var half = current * 1.8;
      var duration = this.data.reduceMotion ? '1ms' : 'var(--pui-duration-normal)';
      var rootClass = [
        'pui-progress',
        this.getColorSchemeClass(),
        'pui-progress--' + theme,
        'pui-progress--' + status,
        this.data.reduceMotion ? 'pui-progress--reduced-motion' : ''
      ].filter(Boolean).join(' ');

      this.setData({
        normalizedPercentage: current,
        currentTheme: theme,
        currentStatus: status,
        statusIcon: STATUS_ICONS[status] || '',
        iconColor: activeColor,
        labelText: labelText,
        showLabel: showLabel,
        semanticLabel: label + '：' + labelText,
        rootClass: rootClass,
        rootStyle: '--pui-progress-duration:' + duration + ';--pui-progress-ease:var(--pui-ease-standard);--pui-progress-color:' + activeColor + ';--pui-progress-track:' + trackColor + ';',
        trackStyle: 'height:' + stroke + 'rpx;',
        barStyle: 'width:' + current + '%;',
        circleStyle: 'width:' + size + 'rpx;height:' + size + 'rpx;',
        circleClipStyle: 'width:' + size + 'rpx;height:' + size + 'rpx;clip:rect(0rpx,' + size + 'rpx,' + size + 'rpx,' + (size / 2) + 'rpx);',
        fillClipStyle: 'width:' + size + 'rpx;height:' + size + 'rpx;clip:rect(0rpx,' + (size / 2) + 'rpx,' + size + 'rpx,0rpx);',
        circleTrackStyle: 'width:' + size + 'rpx;height:' + size + 'rpx;',
        circleInnerStyle: 'top:' + stroke + 'rpx;right:' + stroke + 'rpx;bottom:' + stroke + 'rpx;left:' + stroke + 'rpx;',
        halfRotation: half,
        fullRotation: half * 2
      });
    }
  }
});
