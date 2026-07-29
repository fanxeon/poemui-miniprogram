var themeBehavior = require('../common/behaviors/theme');

var easingMap = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  ease: 'ease',
  linear: 'linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out'
};

function clampDuration(value) {
  var duration = Number(value);
  if (!isFinite(duration)) duration = 500;
  return Math.max(0, Math.min(1000, Math.round(duration)));
}

function hasValue(value) { return value !== null && value !== undefined; }

function normalizeMenuItems(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 8).map(function normalizeMenuItem(item, index) {
    var source = item && typeof item === 'object' ? item : { label: item };
    return {
      _key: 'card-menu-' + index,
      index: index,
      label: String(source.label || source.text || source.title || ('操作 ' + (index + 1))),
      value: source.value === undefined ? index : source.value,
      icon: String(source.icon || ''),
      theme: ['default', 'primary', 'success', 'warning', 'danger'].indexOf(source.theme) > -1 ? source.theme : 'default',
      disabled: Boolean(source.disabled)
    };
  });
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    showHeader: { type: Boolean, value: false },
    bordered: { type: Boolean, value: true },
    padding: { type: String, value: 'normal' },
    showFooter: { type: Boolean, value: false },
    headerBordered: { type: Boolean, value: true },
    footerBordered: { type: Boolean, value: true },
    shadow: { type: Boolean, value: false },
    clickable: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '卡片' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false }
    ,
    menuItems: { type: Array, value: [] },
    menuIcon: { type: String, value: 'more-horizontal' },
    menuVisible: { type: null, value: null },
    defaultMenuVisible: { type: Boolean, value: false }
  },
  data: { rootClass: '', rootStyle: '', normalizedMenuItems: [], innerMenuVisible: false },
  observers: {
    'showHeader,bordered,padding,showFooter,headerBordered,footerBordered,shadow,clickable,disabled,ariaLabel,duration,easing,reduceMotion,menuItems,menuIcon,colorScheme': function sync() { this.syncState(); },
    menuVisible: function observeMenuVisible() {
      if (hasValue(this.data.menuVisible)) this.setData({ innerMenuVisible: Boolean(this.data.menuVisible) });
    }
  },
  lifetimes: { attached: function attached() {
    this.setData({ innerMenuVisible: hasValue(this.data.menuVisible) ? Boolean(this.data.menuVisible) : Boolean(this.data.defaultMenuVisible) });
    this.syncState();
  } },
  methods: {
    syncState: function syncState() {
      var padding = this.data.padding === 'compact' ? 'compact' : 'normal';
      var duration = this.data.reduceMotion ? 1 : clampDuration(this.data.duration);
      this.setData({
        rootClass: [
          'pui-card',
          this.getColorSchemeClass(),
          'pui-card--' + padding,
          this.data.bordered ? 'pui-card--bordered' : '',
          this.data.headerBordered ? 'pui-card--header-bordered' : '',
          this.data.footerBordered ? 'pui-card--footer-bordered' : '',
          this.data.shadow ? 'pui-card--shadow' : '',
          this.data.clickable ? 'pui-card--clickable' : '',
          this.data.disabled ? 'pui-card--disabled' : ''
        ].filter(Boolean).join(' '),
        rootStyle: 'transition-duration:' + duration + 'ms;transition-timing-function:' + (easingMap[this.data.easing] || easingMap.standard) + ';',
        normalizedMenuItems: normalizeMenuItems(this.data.menuItems)
      });
    },
    onTap: function onTap() {
      if (!this.data.clickable || this.data.disabled) return;
      this.triggerEvent('click', { source: 'card' });
    },
    requestMenuVisible: function requestMenuVisible(visible, trigger) {
      if (this.data.disabled || !this.data.normalizedMenuItems.length) return false;
      var next = Boolean(visible);
      if (!hasValue(this.data.menuVisible)) this.setData({ innerMenuVisible: next });
      this.triggerEvent('menu-visible-change', { visible: next, trigger: trigger || 'programmatic' });
      return true;
    },
    onMenuTrigger: function onMenuTrigger() {
      return this.requestMenuVisible(!this.data.innerMenuVisible, 'trigger');
    },
    onMenuVisibleChange: function onMenuVisibleChange(event) {
      return this.requestMenuVisible(Boolean(event && event.detail && event.detail.visible), 'outside');
    },
    onMenuSelect: function onMenuSelect(event) {
      var index = Number(event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.index : -1);
      var item = this.data.normalizedMenuItems[index];
      if (!item || item.disabled) return false;
      this.triggerEvent('menu-select', { index: index, item: this.data.menuItems[index], value: item.value });
      this.requestMenuVisible(false, 'select');
      return true;
    },
    onFooterTap: function onFooterTap() {}
  }
});
