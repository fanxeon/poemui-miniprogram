var themeBehavior = require('../common/behaviors/theme');

function includes(list, value) {
  return list.indexOf(value) >= 0;
}

function normalizeMaxWidth(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? value + 'px' : '';
  }
  var text = String(value === null || value === undefined ? '' : value).trim();
  if (!text) return '';
  var match = text.match(/^(0|[1-9]\d*(?:\.\d+)?)(rpx|px|%)?$/);
  if (!match) return '';
  return match[1] + (match[2] || 'px');
}

Component({
  behaviors: [themeBehavior],
  options: {
    multipleSlots: true,
    styleIsolation: 'shared',
  },
  properties: {
    theme: {
      type: String,
      value: 'default',
    },
    variant: {
      type: String,
      value: 'light',
    },
    shape: {
      type: String,
      value: 'square',
    },
    icon: {
      type: String,
      value: '',
    },
    maxWidth: {
      type: null,
      value: '',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    content: {
      type: String,
      value: '',
    },
    size: {
      type: String,
      value: 'medium',
    },
    closable: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    rootClass: '',
    maxWidthStyle: '',
    resolvedIcon: '',
  },
  observers: {
    'theme, variant, shape, icon, maxWidth, disabled, content, size, closable, colorScheme': function publicPropsObserver() {
      this.updateClass();
    },
  },
  lifetimes: {
    attached: function attached() {
      this.updateClass();
    },
  },
  methods: {
    updateClass: function updateClass() {
      var data = this.data;
      var size = includes(['small', 'medium', 'large'], data.size) ? data.size : 'medium';
      var theme = includes(['default', 'primary', 'success', 'warning', 'danger'], data.theme) ? data.theme : 'default';
      var variant = includes(['light', 'outline', 'dark'], data.variant) ? data.variant : 'light';
      var shape = includes(['square', 'round', 'mark'], data.shape) ? data.shape : 'square';
      var classes = [
        'pui-tag',
        this.getColorSchemeClass(),
        'pui-tag--' + size,
        theme !== 'default' ? 'pui-tag--' + theme : '',
        variant !== 'light' ? 'pui-tag--' + variant : '',
        shape !== 'square' ? 'pui-tag--' + shape : '',
        data.disabled ? 'pui-tag--disabled' : '',
      ];
      this.setData({
        rootClass: classes.filter(Boolean).join(' '),
        maxWidthStyle: normalizeMaxWidth(data.maxWidth) ? 'max-width:' + normalizeMaxWidth(data.maxWidth) + ';' : '',
        resolvedIcon: String(data.icon || '').trim(),
      });
    },
    onClose: function onClose() {
      if (this.data.disabled) return;
      this.triggerEvent('close', { source: 'close' });
    },
  },
});
