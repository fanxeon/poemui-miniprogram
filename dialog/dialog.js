var themeBehavior = require('../common/behaviors/theme');

var BUTTON_THEMES = ['default', 'primary', 'danger'];
var BUTTON_VARIANTS = ['base', 'outline', 'text', 'ghost', 'transparent'];
var BUTTON_SIZES = ['extra-small', 'small', 'medium', 'large'];
var BUTTON_SHAPES = ['rectangle', 'square', 'round', 'circle'];

function oneOf(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function clamp(value, min, max, fallback) {
  var number = Number(value);
  if (!isFinite(number)) number = fallback;
  return Math.min(max, Math.max(min, number));
}

function textOf(value) {
  return value === null || value === undefined ? '' : String(value);
}

function buttonConfig(value, fallbackTheme) {
  if (value === null || value === undefined || value === false || value === '') return null;
  var source = value && typeof value === 'object' && !Array.isArray(value) ? value : { content: value };
  var content = source.content;
  if (content === undefined) content = source.text;
  if (content === undefined) content = source.label;
  return {
    content: textOf(content),
    theme: oneOf(source.theme, BUTTON_THEMES, fallbackTheme || 'default'),
    variant: oneOf(source.variant, BUTTON_VARIANTS, 'base'),
    size: oneOf(source.size, BUTTON_SIZES, 'medium'),
    shape: oneOf(source.shape, BUTTON_SHAPES, 'rectangle'),
    icon: textOf(source.icon),
    loading: Boolean(source.loading),
    disabled: Boolean(source.disabled),
    ariaLabel: textOf(source.ariaLabel),
  };
}

function closeConfig(value) {
  if (!value) return null;
  var source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    icon: textOf(source.icon || 'close'),
    disabled: Boolean(source.disabled),
    ariaLabel: textOf(source.ariaLabel || '关闭对话框'),
  };
}

function normalizeActions(actions) {
  if (!Array.isArray(actions)) return [];
  return actions.map(function normalizeAction(item, index) {
    var config = buttonConfig(item, index === actions.length - 1 ? 'primary' : 'default') || buttonConfig('操作 ' + (index + 1), index === actions.length - 1 ? 'primary' : 'default');
    config.key = 'dialog-action-' + index;
    config.index = index;
    return config;
  });
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    visible: { type: Boolean, value: false },
    actions: { type: Array, value: [] },
    buttonLayout: { type: String, value: 'horizontal' },
    cancelBtn: { type: null, value: null },
    closeBtn: { type: null, value: false },
    closeOnOverlayClick: { type: Boolean, value: false },
    confirmBtn: { type: null, value: null },
    content: { type: String, value: '' },
    overlayProps: { type: Object, value: {} },
    preventScrollThrough: { type: Boolean, value: true },
    showOverlay: { type: Boolean, value: true },
    title: { type: String, value: '' },
    usingCustomNavbar: { type: Boolean, value: false },
    zIndex: { type: Number, value: 11500 },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rootClass: 'pui-dialog',
    normalizedActions: [],
    normalizedButtonLayout: 'horizontal',
    normalizedCancelBtn: null,
    normalizedConfirmBtn: null,
    normalizedCloseBtn: null,
    footerColumnCount: 1,
    hasHeader: false,
    semanticLabel: '对话框',
    resolvedZIndex: 11500,
  },
  observers: {
    'actions,buttonLayout,cancelBtn,closeBtn,confirmBtn,title,content,zIndex,ariaLabel,reduceMotion,colorScheme': function observeState() {
      this.syncState();
    },
  },
  lifetimes: {
    attached: function attached() { this.syncState(); },
  },
  methods: {
    syncState: function syncState() {
      var actions = normalizeActions(this.data.actions);
      var cancelBtn = buttonConfig(this.data.cancelBtn, 'default');
      var confirmBtn = buttonConfig(this.data.confirmBtn, 'primary');
      var closeBtn = closeConfig(this.data.closeBtn);
      var layout = this.data.buttonLayout === 'vertical' ? 'vertical' : 'horizontal';
      var actionCount = actions.length || (cancelBtn ? 1 : 0) + (confirmBtn ? 1 : 0);
      this.setData({
        rootClass: ['pui-dialog', this.getColorSchemeClass(), 'pui-dialog--' + layout, this.data.reduceMotion ? 'pui-dialog--reduced' : ''].filter(Boolean).join(' '),
        normalizedActions: actions,
        normalizedButtonLayout: layout,
        normalizedCancelBtn: cancelBtn,
        normalizedConfirmBtn: confirmBtn,
        normalizedCloseBtn: closeBtn,
        footerColumnCount: Math.min(2, Math.max(1, actionCount)),
        hasHeader: Boolean(this.data.title || closeBtn),
        semanticLabel: textOf(this.data.ariaLabel || this.data.title || '对话框').trim() || '对话框',
        resolvedZIndex: Math.round(clamp(this.data.zIndex, 1, 12000, 11500)),
      });
    },
    requestClose: function requestClose(trigger) {
      if (!this.data.visible) return false;
      this.triggerEvent('close', { trigger: trigger || 'programmatic' });
      return true;
    },
    close: function close() { return this.requestClose('programmatic'); },
    onPopupVisibleChange: function onPopupVisibleChange(event) {
      var trigger = event && event.detail ? event.detail.trigger : 'programmatic';
      if (trigger === 'overlay') {
        this.triggerEvent('overlay-click');
        if (!this.data.closeOnOverlayClick) return false;
      }
      return this.requestClose(trigger);
    },
    onCloseTap: function onCloseTap() {
      if (this.data.normalizedCloseBtn && this.data.normalizedCloseBtn.disabled) return false;
      return this.requestClose('close-btn');
    },
    onConfirm: function onConfirm() {
      var button = this.data.normalizedConfirmBtn;
      if (!button || button.loading || button.disabled) return false;
      this.triggerEvent('confirm');
      return true;
    },
    onCancel: function onCancel() {
      var button = this.data.normalizedCancelBtn;
      if (!button || button.loading || button.disabled) return false;
      this.triggerEvent('cancel');
      return this.requestClose('cancel');
    },
    onAction: function onAction(event) {
      var index = Number(event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.index : -1);
      var button = this.data.normalizedActions[index];
      if (!button || button.loading || button.disabled) return false;
      this.triggerEvent('action', { index: index });
      return true;
    },
  },
});
