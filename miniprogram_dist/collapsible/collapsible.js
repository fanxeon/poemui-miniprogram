var themeBehavior = require('../common/behaviors/theme');

var EASING = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  ease: 'ease',
  linear: 'linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
};
var THEMES = ['default', 'primary', 'success', 'warning', 'danger'];
var ICON_POSITIONS = ['left', 'right'];

function clampDuration(value) {
  var duration = Number(value);
  if (!isFinite(duration)) duration = 500;
  return Math.max(0, Math.min(1000, Math.round(duration)));
}

function normalizeTheme(value) {
  return THEMES.indexOf(value) > -1 ? value : 'default';
}

function normalizeIconPosition(value) {
  return ICON_POSITIONS.indexOf(value) > -1 ? value : 'right';
}

function hasControlledValue(value) {
  return value !== null && value !== undefined;
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    open: { type: null, value: null },
    defaultOpen: { type: Boolean, value: false },
    label: { type: String, value: '展开详情' },
    content: { type: String, value: '' },
    customTrigger: { type: Boolean, value: false },
    customContent: { type: Boolean, value: false },
    icon: { type: String, value: '' },
    expandIcon: { type: Boolean, value: true },
    iconPosition: { type: String, value: 'right' },
    theme: { type: String, value: 'default' },
    bordered: { type: Boolean, value: true },
    shadow: { type: Boolean, value: false },
    block: { type: Boolean, value: true },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingText: { type: String, value: '内容加载中…' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '内容加载失败' },
    retryText: { type: String, value: '重试' },
    emptyText: { type: String, value: '暂无详情' },
    ariaLabel: { type: String, value: '' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rootClass: 'pui-collapsible',
    rootStyle: '',
    innerOpen: false,
    controlled: false,
    contentHeight: 0,
    contentState: 'empty',
    semanticLabel: '展开详情',
    motionDuration: 500,
    motionEasing: EASING.standard,
  },
  observers: {
    'open,defaultOpen,label,content,customTrigger,customContent,icon,expandIcon,iconPosition,theme,bordered,shadow,block,disabled,readonly,loading,loadingText,error,errorText,retryText,emptyText,ariaLabel,duration,easing,reduceMotion,colorScheme': function sync() {
      this.syncState();
    },
  },
  lifetimes: {
    attached: function attached() {
      this.syncState(true);
    },
  },
  methods: {
    syncState: function syncState(initial) {
      var controlled = hasControlledValue(this.data.open);
      if (controlled) {
        this._wasControlled = true;
      } else if (initial || !this._initialized || this._wasControlled) {
        this._innerOpen = !!this.data.defaultOpen;
        this._initialized = true;
        this._wasControlled = false;
      }
      var innerOpen = controlled ? !!this.data.open : !!this._innerOpen;
      var theme = normalizeTheme(this.data.theme);
      var iconPosition = normalizeIconPosition(this.data.iconPosition);
      var duration = this.data.reduceMotion ? 1 : clampDuration(this.data.duration);
      var contentState = this.data.error
        ? 'error'
        : (this.data.loading
          ? 'loading'
          : ((this.data.customContent || this.data.content) ? 'content' : 'empty'));
      var classes = [
        'pui-collapsible',
        this.getColorSchemeClass(),
        'pui-collapsible--' + theme,
        'pui-collapsible--icon-' + iconPosition,
        this.data.block ? 'pui-collapsible--block' : 'pui-collapsible--inline',
        this.data.bordered ? 'pui-collapsible--bordered' : 'pui-collapsible--borderless',
        this.data.shadow ? 'pui-collapsible--shadow' : '',
        innerOpen ? 'pui-collapsible--open' : 'pui-collapsible--closed',
        this.data.disabled ? 'pui-collapsible--disabled' : '',
        this.data.readonly ? 'pui-collapsible--readonly' : '',
        this.data.loading ? 'pui-collapsible--loading' : '',
        'pui-collapsible--' + contentState,
      ];
      this.setData({
        rootClass: classes.filter(Boolean).join(' '),
        rootStyle: '--pui-collapsible-duration: ' + duration + 'ms; --pui-collapsible-easing: ' + (EASING[this.data.easing] || EASING.standard) + ';',
        innerOpen: innerOpen,
        controlled: controlled,
        contentState: contentState,
        semanticLabel: this.data.ariaLabel || this.data.label || '折叠内容',
        motionDuration: duration,
        motionEasing: EASING[this.data.easing] || EASING.standard,
      }, this.measure.bind(this));
    },
    measure: function measure() {
      var component = this;
      if (!this.createSelectorQuery) return;
      this.createSelectorQuery().in(this).select('.pui-collapsible__content-inner').boundingClientRect().exec(function measured(result) {
        var rect = result && result[0];
        if (!rect) return;
        component.setData({ contentHeight: Math.max(0, Math.ceil(Number(rect.height) || 0)) });
      });
    },
    onTriggerTap: function onTriggerTap() {
      this.requestOpen(!this.data.innerOpen, 'trigger', true);
    },
    requestOpen: function requestOpen(nextOpen, source, clicked) {
      if (this.data.disabled) return false;
      var previousOpen = !!this.data.innerOpen;
      var next = !!nextOpen;
      var detail = {
        open: next,
        value: next,
        previousOpen: previousOpen,
        source: source || 'programmatic',
        controlled: !!this.data.controlled,
        blocked: !!this.data.readonly,
      };
      if (this.data.readonly) {
        if (clicked) this.triggerEvent('click', detail);
        return false;
      }
      if (next === previousOpen) return false;
      if (clicked) this.triggerEvent('click', detail);
      if (!this.data.controlled) this._innerOpen = next;
      this._afterState = null;
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      this.triggerEvent(next ? 'open' : 'close', detail);
      this.syncState();
      return true;
    },
    onTransitionEnd: function onTransitionEnd(event) {
      var propertyName = event && event.detail && event.detail.propertyName;
      if (propertyName && propertyName !== 'max-height') return;
      var open = !!this.data.innerOpen;
      if (this._afterState === open) return;
      this._afterState = open;
      this.triggerEvent(open ? 'after-open' : 'after-close', {
        open: open,
        value: open,
        source: 'transitionend',
        controlled: !!this.data.controlled,
      });
    },
    onRetry: function onRetry() {
      if (this.data.disabled || !this.data.error || !this.data.retryText) return;
      this.triggerEvent('retry', { source: 'retry', open: !!this.data.innerOpen });
    },
    open: function open() {
      return this.requestOpen(true, 'method-open', false);
    },
    close: function close() {
      return this.requestOpen(false, 'method-close', false);
    },
    toggle: function toggle() {
      return this.requestOpen(!this.data.innerOpen, 'method-toggle', false);
    },
    retry: function retry() {
      this.onRetry();
    },
  },
});
