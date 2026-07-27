var themeBehavior = require('../common/behaviors/theme');

var allowedThemes = ['default', 'info', 'success', 'warning', 'danger'];
var allowedVariants = ['soft', 'tinted'];
var allowedVerticalAlignments = ['top', 'center'];
var defaultIcons = {
  default: 'info-circle',
  info: 'info-circle',
  success: 'success-circle',
  warning: 'warning-triangle',
  danger: 'error-circle'
};
var easingMap = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  ease: 'ease',
  linear: 'linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out'
};

function isControlled(data) {
  return data.visible !== null && data.visible !== undefined;
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
    theme: { type: String, value: 'default' },
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    closable: { type: Boolean, value: false },
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: true },
    icon: { type: String, value: '' },
    showIcon: { type: Boolean, value: true },
    closeIcon: { type: String, value: 'close' },
    variant: { type: String, value: 'soft' },
    verticalAlign: { type: String, value: 'top' },
    center: { type: Boolean, value: false },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rootClass: '',
    rendered: false,
    innerVisible: false,
    iconName: 'info-circle',
    iconColor: '',
    motionStyle: 'transition-duration:500ms;transition-timing-function:cubic-bezier(0.2, 0, 0, 1);'
  },
  observers: {
    'theme,icon,showIcon,variant,verticalAlign,center,colorScheme': function syncPresentation() {
      this.syncPresentation();
    },
    'duration,easing,reduceMotion': function syncMotion() {
      this.syncMotion();
    },
    visible: function syncVisible() {
      this.syncVisibility(false);
    },
    defaultVisible: function syncDefaultVisible() {
      if (!isControlled(this.data)) this.syncVisibility(false);
    }
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this.syncPresentation();
      this.syncMotion();
      this.syncVisibility(true);
    },
    detached: function detached() {
      clearTimeout(this._showTimer);
      clearTimeout(this._hideTimer);
    }
  },
  methods: {
    syncPresentation: function syncPresentation() {
      var theme = allowedThemes.indexOf(this.data.theme) > -1 ? this.data.theme : 'default';
      var variant = allowedVariants.indexOf(this.data.variant) > -1 ? this.data.variant : 'soft';
      var verticalAlign = allowedVerticalAlignments.indexOf(this.data.verticalAlign) > -1 ? this.data.verticalAlign : 'top';
      // `center` 是既有公开能力：继续同时表达纵向居中与正文居中。
      if (this.data.center) verticalAlign = 'center';
      this.setData({
        rootClass: [
          'pui-alert',
          this.getColorSchemeClass(),
          'pui-alert--' + theme,
          'pui-alert--' + variant,
          'pui-alert--vertical-' + verticalAlign,
          this.data.center ? 'pui-alert--center' : ''
        ].filter(Boolean).join(' '),
        iconName: this.data.icon || defaultIcons[theme],
        iconColor: variant === 'tinted' ? 'var(--pui-alert-' + theme + '-tinted-fg)' : ''
      });
    },
    syncMotion: function syncMotion() {
      var duration = this.data.reduceMotion ? 1 : clampDuration(this.data.duration);
      this.setData({
        motionStyle: 'transition-duration:' + duration + 'ms;transition-timing-function:' + (easingMap[this.data.easing] || easingMap.standard) + ';'
      });
    },
    syncVisibility: function syncVisibility(isInitial) {
      if (!this._ready && !isInitial) return;
      var visible = isControlled(this.data)
        ? Boolean(this.data.visible)
        : (isInitial ? Boolean(this.data.defaultVisible) : Boolean(this._uncontrolledVisible));
      this.applyVisibility(visible);
    },
    applyVisibility: function applyVisibility(visible) {
      var component = this;
      var duration = this.data.reduceMotion ? 1 : clampDuration(this.data.duration);
      clearTimeout(this._showTimer);
      clearTimeout(this._hideTimer);
      if (visible) {
        if (this.data.rendered) {
          this.setData({ innerVisible: true });
          return;
        }
        this.setData({ rendered: true, innerVisible: false }, function afterMounted() {
          component._showTimer = setTimeout(function showAlert() {
            if (component.data.rendered) component.setData({ innerVisible: true });
          }, 16);
        });
        return;
      }
      if (!this.data.rendered) {
        this.setData({ innerVisible: false });
        return;
      }
      this.setData({ innerVisible: false });
      this._hideTimer = setTimeout(function removeAlert() {
        if (!component.data.innerVisible) component.setData({ rendered: false });
      }, duration);
    },
    requestVisibility: function requestVisibility(visible, source) {
      var next = Boolean(visible);
      if (this._requestedVisible === next && Boolean(this.data.innerVisible) === next) return;
      this._requestedVisible = next;
      if (!isControlled(this.data)) {
        this._uncontrolledVisible = next;
        this.applyVisibility(next);
      }
      var detail = { visible: next, source: source || 'programmatic' };
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      this.triggerEvent(next ? 'open' : 'close', detail);
    },
    open: function open() {
      this.requestVisibility(true, 'programmatic');
    },
    close: function close(source) {
      this.requestVisibility(false, source || 'programmatic');
    },
    onClose: function onClose() {
      if (!this.data.closable) return;
      this.close('close-button');
    }
  }
});
