const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function json(usingComponents) {
  return `${JSON.stringify({ component: true, styleIsolation: 'shared', usingComponents: usingComponents || {} }, null, 2)}\n`;
}

const themeImport = '@import "../common/style/theme.wxss";\n';
// These components have moved beyond the early generator shells. Their source
// lives in their component directories so repeated generation cannot erase
// their controlled state and touch interaction contracts.
const preservedNativeComponents = new Set([
  'action-sheet',
  'alert',
  'aspect-ratio',
  'button-group',
  'card',
  'swiper',
  'divider',
  'avatar',
  'image',
  'grid',
  'date-time-picker',
  'empty',
  'field',
  'input-otp',
  'loading',
  'notice-bar',
  'navbar',
  'navigation-menu',
  'tabs',
  'breadcrumb',
  'tabbar',
  'steps',
  'back-top',
  'indexes',
  'popover',
  'progress',
  'rate',
  'result',
  'search',
  'select',
  'sheet',
  'skeleton',
  'slider',
  'stepper',
  'toast',
  'upload',
  'scroll-area',
]);

const specs = {
  alert: {
    json: { 'pui-icon': '../icon/icon' },
    js: `var themeBehavior = require('../common/behaviors/theme');

var allowedThemes = ['default', 'info', 'success', 'warning', 'danger'];
var defaultIcons = {
  default: 'info-circle',
  info: 'info-circle',
  success: 'success-circle',
  warning: 'warning-triangle',
  danger: 'error-circle'
};

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    theme: { type: String, value: 'default' },
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    closable: { type: Boolean, value: false },
    visible: { type: Boolean, value: true },
    icon: { type: String, value: '' },
    showIcon: { type: Boolean, value: true },
    closeIcon: { type: String, value: 'close' },
    center: { type: Boolean, value: false }
  },
  data: {
    rootClass: '',
    innerVisible: true,
    iconName: 'info-circle'
  },
  observers: {
    'theme,visible,icon,showIcon,center': function sync() {
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
      var theme = allowedThemes.indexOf(this.data.theme) > -1 ? this.data.theme : 'default';
      this.setData({
        rootClass: [
          'pui-alert',
          this.getColorSchemeClass(),
          'pui-alert--' + theme,
          this.data.center ? 'pui-alert--center' : ''
        ].filter(Boolean).join(' '),
        innerVisible: this.data.visible,
        iconName: this.data.icon || defaultIcons[theme]
      });
    },
    onClose: function onClose() {
      this.setData({ innerVisible: false });
      this.triggerEvent('close');
    }
  }
});
`,
    wxml: `<view wx:if="{{innerVisible}}" class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-alert__main">
    <pui-icon wx:if="{{showIcon}}" class="pui-alert__icon" name="{{iconName}}" size="44" color-scheme="{{colorScheme}}" />
    <view class="pui-alert__body"><view wx:if="{{title}}" class="pui-alert__title">{{title}}</view><view wx:if="{{description}}" class="pui-alert__description">{{description}}</view><slot></slot></view>
  </view>
  <button wx:if="{{closable}}" class="pui-alert__close" catchtap="onClose" aria-label="关闭提示"><pui-icon name="{{closeIcon}}" size="32" color-scheme="{{colorScheme}}" /></button>
</view>
`,
    wxss: themeImport + `.pui-alert{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--pui-space-normal);padding:var(--pui-space-step-12);color:var(--pui-text-primary);background:var(--pui-bg-muted);border:1rpx solid var(--pui-border-color);border-radius:var(--pui-radius-medium)}.pui-alert__main{display:flex;flex:1;gap:var(--pui-content-gap);min-width:0}.pui-alert__icon{flex:0 0 auto;margin-top:var(--pui-space-step-1)}.pui-alert__body{min-width:0}.pui-alert__title{font-size:28rpx;font-weight:650;line-height:40rpx}.pui-alert__description{margin-top:var(--pui-space-xxs);color:var(--pui-text-secondary);font-size:24rpx;line-height:34rpx}.pui-alert__close{display:flex;align-items:center;justify-content:center;flex:0 0 auto;width:48rpx;height:48rpx;padding:0;color:var(--pui-text-secondary);background:transparent;border:0}.pui-alert--info{background:var(--pui-color-info-light)}.pui-alert--success{background:var(--pui-color-success-light)}.pui-alert--warning{background:var(--pui-color-warning-light)}.pui-alert--danger{background:var(--pui-color-danger-light)}.pui-alert--center,.pui-alert--center .pui-alert__main{align-items:center}.pui-alert--center .pui-alert__body{text-align:center}.pui-alert--center .pui-alert__description{margin-top:var(--pui-space-step-1)}\n`,
  },
  'aspect-ratio': {
    js: `var themeBehavior = require('../common/behaviors/theme');

function getPadding(ratio) {
  var parts = String(ratio || '16 / 9').replace(':', '/').split('/');
  var width = Math.abs(Number(parts[0]));
  var height = Math.abs(Number(parts[1]));
  if (!width || !height) return 56.25;
  return Math.round((height / width) * 10000) / 100;
}

function normalizeRadius(value) {
  return ['none', 'small', 'medium', 'large'].indexOf(value) > -1 ? value : 'medium';
}

function safeBackground(value) {
  var color = String(value || '').trim();
  if (!color) return '';
  if (/^#[0-9a-f]{3,8}$/i.test(color) || /^(transparent|currentColor)$/i.test(color) || /^var\(--[a-z0-9-]+\)$/i.test(color)) return color;
  return '';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    ratio: { type: String, value: '16 / 9' },
    bordered: { type: Boolean, value: false },
    radius: { type: String, value: 'medium' },
    background: { type: String, value: '' },
    overflow: { type: Boolean, value: true }
  },
  data: {
    paddingTop: 56.25,
    rootClass: '',
    rootStyle: ''
  },
  observers: {
    'ratio,bordered,radius,background,overflow': function updateRatio() { this.syncState(); }
  },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    syncState: function syncState() {
      var background = safeBackground(this.data.background);
      this.setData({
        paddingTop: getPadding(this.data.ratio),
        rootClass: [
          'pui-aspect-ratio',
          this.getColorSchemeClass(),
          this.data.bordered ? 'pui-aspect-ratio--bordered' : '',
          'pui-aspect-ratio--radius-' + normalizeRadius(this.data.radius),
          this.data.overflow ? '' : 'pui-aspect-ratio--overflow-visible'
        ].filter(Boolean).join(' '),
        rootStyle: background ? 'background:' + background + ';' : ''
      });
    }
  }
});
`,
    wxml: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}};{{rootStyle}}padding-top:{{paddingTop}}%"><view class="pui-aspect-ratio__content"><slot></slot></view></view>
`,
    wxss: themeImport + `.pui-aspect-ratio{position:relative;width:100%;overflow:hidden;background:var(--pui-bg-muted);border-radius:var(--pui-radius-medium)}.pui-aspect-ratio--bordered{border:1rpx solid var(--pui-border-color)}.pui-aspect-ratio--radius-none{border-radius:0}.pui-aspect-ratio--radius-small{border-radius:var(--pui-radius-small)}.pui-aspect-ratio--radius-medium{border-radius:var(--pui-radius-medium)}.pui-aspect-ratio--radius-large{border-radius:var(--pui-radius-large)}.pui-aspect-ratio--overflow-visible{overflow:visible}.pui-aspect-ratio__content{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;height:100%}\n`,
  },
  breadcrumb: {
    json: { 'pui-icon': '../icon/icon' },
    js: `var themeBehavior = require('../common/behaviors/theme');

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    separator: { type: String, value: '/' },
    separatorIcon: { type: String, value: '' },
    current: { type: Number, value: -1 },
    disabled: { type: Boolean, value: false },
    showIcon: { type: Boolean, value: true }
  },
  methods: {
    onSelect: function onSelect(event) {
      var index = Number(event.currentTarget.dataset.index);
      var item = this.data.items[index];
      if (this.data.disabled || (item && item.disabled)) return;
      var value = item && typeof item === 'object' && item.value !== undefined ? item.value : index;
      var detail = { value: value, index: index, item: item || {} };
      this.triggerEvent('click', detail);
      this.triggerEvent('change', detail);
    }
  }
});
`,
    wxml: `<view class="pui-breadcrumb {{customClass}}" style="{{customStyle}}" role="navigation"><block wx:for="{{items}}" wx:key="index"><button class="pui-breadcrumb__item {{current === index ? 'pui-breadcrumb__item--current' : ''}}" disabled="{{disabled || item.disabled}}" data-index="{{index}}" bindtap="onSelect"><pui-icon wx:if="{{showIcon && item.icon}}" class="pui-breadcrumb__icon" name="{{item.icon}}" size="28" /><text>{{item.label || item.title || item}}</text></button><block wx:if="{{index < items.length - 1}}"><pui-icon wx:if="{{separatorIcon}}" class="pui-breadcrumb__separator-icon" name="{{separatorIcon}}" size="24" /><text wx:else class="pui-breadcrumb__separator">{{separator}}</text></block></block><slot></slot></view>
`,
    wxss: themeImport + `.pui-breadcrumb{display:flex;align-items:center;flex-wrap:wrap;gap:var(--pui-space-sm);color:var(--pui-text-secondary);font-size:24rpx;line-height:36rpx}.pui-breadcrumb__item{display:inline-flex;align-items:center;gap:var(--pui-space-step-3);min-height:36rpx;margin:0;padding:0;color:inherit;font-size:inherit;line-height:inherit;text-align:left;background:transparent;border:0}.pui-breadcrumb__item::after{border:0}.pui-breadcrumb__item--current{color:var(--pui-text-primary);font-weight:600}.pui-breadcrumb__item[disabled]{opacity:.42}.pui-breadcrumb__icon,.pui-breadcrumb__separator-icon{flex:0 0 auto}.pui-breadcrumb__separator,.pui-breadcrumb__separator-icon{color:var(--pui-text-placeholder)}\n`,
  },
  'button-group': {
    js: `var themeBehavior = require('../common/behaviors/theme');

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    direction: { type: String, value: 'horizontal' },
    block: { type: Boolean, value: true },
    size: { type: String, value: 'medium' },
    shape: { type: String, value: 'rectangle' },
    bordered: { type: Boolean, value: true },
    disabled: { type: Boolean, value: false }
  },
  data: { rootClass: '' },
  observers: { 'direction,block,size,shape,bordered,disabled': function sync() { this.syncState(); } },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    syncState: function syncState() {
      var direction = this.data.direction === 'vertical' ? 'vertical' : 'horizontal';
      var size = ['small', 'medium', 'large'].indexOf(this.data.size) > -1 ? this.data.size : 'medium';
      var shape = this.data.shape === 'round' ? 'round' : 'rectangle';
      this.setData({ rootClass: [
        'pui-button-group',
        this.getColorSchemeClass(),
        'pui-button-group--' + direction,
        'pui-button-group--' + size,
        'pui-button-group--' + shape,
        this.data.block ? 'pui-button-group--block' : '',
        this.data.bordered ? 'pui-button-group--bordered' : '',
        this.data.disabled ? 'pui-button-group--disabled' : ''
      ].filter(Boolean).join(' ') });
    }
  }
});
`,
    wxml: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}" role="group" aria-disabled="{{disabled}}"><slot></slot></view>
`,
    wxss: themeImport + `.pui-button-group{display:inline-flex;align-items:stretch;max-width:100%;overflow:hidden;border-radius:var(--pui-radius-medium)}.pui-button-group--bordered{border:1rpx solid var(--pui-border-color)}.pui-button-group--block{display:flex;width:100%}.pui-button-group--vertical{display:flex;flex-direction:column}.pui-button-group--round{border-radius:var(--pui-radius-round)}.pui-button-group--disabled{pointer-events:none;opacity:.56}.pui-button-group .pui-button{flex:1;min-width:0;margin:0;border:0;border-radius:0;box-shadow:none}.pui-button-group--bordered .pui-button+.pui-button{border-left:1rpx solid var(--pui-border-color)}.pui-button-group--vertical.pui-button-group--bordered .pui-button+.pui-button{border-top:1rpx solid var(--pui-border-color);border-left:0}.pui-button-group--vertical .pui-button{width:100%}.pui-button-group--small .pui-button{min-height:72rpx}.pui-button-group--medium .pui-button{min-height:88rpx}.pui-button-group--large .pui-button{min-height:100rpx}\n`,
  },
  card: {
    js: `var themeBehavior = require('../common/behaviors/theme');

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    bordered: { type: Boolean, value: true },
    padding: { type: String, value: 'normal' },
    showFooter: { type: Boolean, value: false },
    headerBordered: { type: Boolean, value: true },
    footerBordered: { type: Boolean, value: true },
    shadow: { type: Boolean, value: false },
    clickable: { type: Boolean, value: false }
  },
  data: { rootClass: '' },
  observers: {
    'bordered,padding,showFooter,headerBordered,footerBordered,shadow,clickable': function sync() { this.syncState(); }
  },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    syncState: function syncState() {
      var padding = this.data.padding === 'compact' ? 'compact' : 'normal';
      this.setData({
        rootClass: [
          'pui-card',
          this.getColorSchemeClass(),
          'pui-card--' + padding,
          this.data.bordered ? 'pui-card--bordered' : '',
          this.data.headerBordered ? 'pui-card--header-bordered' : '',
          this.data.footerBordered ? 'pui-card--footer-bordered' : '',
          this.data.shadow ? 'pui-card--shadow' : '',
          this.data.clickable ? 'pui-card--clickable' : ''
        ].filter(Boolean).join(' ')
      });
    },
    onTap: function onTap(event) {
      if (!this.data.clickable) return;
      this.triggerEvent('click', event.detail);
    }
  }
});
`,
    wxml: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}" hover-class="{{clickable ? 'pui-card--hover' : 'none'}}" bindtap="onTap"><view wx:if="{{title || description}}" class="pui-card__header"><view wx:if="{{title}}" class="pui-card__title">{{title}}</view><view wx:if="{{description}}" class="pui-card__description">{{description}}</view><slot name="header"></slot></view><view class="pui-card__content"><slot></slot></view><view wx:if="{{showFooter}}" class="pui-card__footer"><slot name="footer"></slot></view></view>
`,
    wxss: themeImport + `.pui-card{overflow:hidden;background:var(--pui-bg-container);border-radius:var(--pui-radius-medium)}.pui-card--bordered{border:1rpx solid var(--pui-border-color)}.pui-card--shadow{box-shadow:var(--pui-shadow-card)}.pui-card--clickable{transition:opacity var(--pui-duration-fast),transform var(--pui-duration-fast)}.pui-card--hover{opacity:.82;transform:scale(.992)}.pui-card__header,.pui-card__content,.pui-card__footer{padding:var(--pui-space-lg)}.pui-card__header{padding-bottom:0}.pui-card--header-bordered .pui-card__header{padding-bottom:var(--pui-space-lg);border-bottom:1rpx solid var(--pui-border-color)}.pui-card--footer-bordered .pui-card__footer{border-top:1rpx solid var(--pui-border-color)}.pui-card__title{font-size:30rpx;font-weight:650;line-height:42rpx}.pui-card__description{margin-top:var(--pui-space-step-3);color:var(--pui-text-secondary);font-size:24rpx;line-height:34rpx}.pui-card--compact .pui-card__header,.pui-card--compact .pui-card__content,.pui-card--compact .pui-card__footer{padding:var(--pui-space-normal)}.pui-card--compact.pui-card--header-bordered .pui-card__header{padding-bottom:var(--pui-space-normal)}\n`,
  },
  field: {
    js: `var themeBehavior = require('../common/behaviors/theme');

function normalizeOrientation(value) {
  return value === 'horizontal' ? 'horizontal' : 'vertical';
}

function normalizeStatus(value) {
  return ['default', 'success', 'warning', 'error'].indexOf(value) > -1 ? value : 'default';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    label: { type: String, value: '' },
    description: { type: String, value: '' },
    error: { type: String, value: '' },
    required: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    orientation: { type: String, value: 'vertical' },
    labelWidth: { type: Number, value: 0 },
    status: { type: String, value: 'default' }
  },
  data: { rootClass: '', rootStyle: '' },
  observers: {
    'disabled,orientation,labelWidth,status,error,colorScheme': function sync() { this.syncState(); }
  },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    syncState: function syncState() {
      var orientation = normalizeOrientation(this.data.orientation);
      var status = this.data.error ? 'error' : normalizeStatus(this.data.status);
      var width = Math.max(0, Math.min(360, Number(this.data.labelWidth) || 0));
      this.setData({
        rootClass: ['pui-field', this.getColorSchemeClass(), 'pui-field--' + orientation, 'pui-field--' + status, this.data.disabled ? 'pui-field--disabled' : ''].filter(Boolean).join(' '),
        rootStyle: orientation === 'horizontal' ? '--pui-field-label-width:' + (width || 160) + 'rpx;' : ''
      });
    }
  }
});
`,
    wxml: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}};{{rootStyle}}"><view wx:if="{{label}}" class="pui-field__label">{{label}}<text wx:if="{{required}}" class="pui-field__required">*</text></view><view class="pui-field__control"><slot></slot></view><view class="pui-field__feedback"><view wx:if="{{error}}" class="pui-field__error">{{error}}</view><view wx:elif="{{description}}" class="pui-field__description">{{description}}</view></view></view>
`,
    wxss: themeImport + `.pui-field{box-sizing:border-box;color:var(--pui-text-primary)}.pui-field--disabled{opacity:.55}.pui-field--vertical .pui-field__label{margin-bottom:var(--pui-space-sm)}.pui-field--horizontal{display:flex;align-items:flex-start;flex-wrap:wrap;column-gap:var(--pui-space-normal)}.pui-field--horizontal .pui-field__label{box-sizing:border-box;flex:0 0 var(--pui-field-label-width);width:var(--pui-field-label-width);padding-top:var(--pui-space-normal)}.pui-field--horizontal .pui-field__control{flex:1;min-width:0}.pui-field--horizontal .pui-field__feedback{flex-basis:100%}.pui-field__label{font-size:26rpx;font-weight:600;line-height:38rpx}.pui-field__required,.pui-field__error{color:var(--pui-color-danger)}.pui-field__required{margin-left:var(--pui-space-step-3)}.pui-field__feedback{min-width:0}.pui-field__description,.pui-field__error{margin-top:var(--pui-space-step-5);font-size:22rpx;line-height:32rpx}.pui-field__description{color:var(--pui-text-secondary)}.pui-field--success .pui-field__description{color:var(--pui-color-success)}.pui-field--warning .pui-field__description{color:var(--pui-color-warning)}\n`,
  },
  'input-otp': {
    js: `var themeBehavior = require('../common/behaviors/theme');

function makeCells(value, length) {
  var cells = [];
  var source = String(value || '');
  var index;
  for (index = 0; index < length; index += 1) cells.push({ index: index, value: source.charAt(index) });
  return cells;
}

function normalizeLength(value) {
  return Math.max(1, Math.min(8, Math.floor(Number(value) || 6)));
}

function normalizeType(value) {
  return ['text', 'number', 'digit', 'idcard', 'safe-password'].indexOf(value) > -1 ? value : 'number';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    value: { type: String, value: '' },
    length: { type: Number, value: 6 },
    type: { type: String, value: 'number' },
    mask: { type: Boolean, value: false },
    focus: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    error: { type: Boolean, value: false },
    errorMessage: { type: String, value: '' }
  },
  data: { cells: [], activeIndex: -1, rootClass: '', inputType: 'number', errorText: '' },
  observers: { 'value,length,focus,disabled,error,errorMessage,type,colorScheme': function sync() { this.syncState(); } },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    syncState: function syncState() {
      var length = normalizeLength(this.data.length);
      this.setData({
        cells: makeCells(this.data.value, length),
        activeIndex: this.data.focus && !this.data.disabled ? 0 : -1,
        rootClass: ['pui-input-otp', this.getColorSchemeClass(), this.data.error ? 'pui-input-otp--error' : '', this.data.disabled ? 'pui-input-otp--disabled' : ''].filter(Boolean).join(' '),
        inputType: normalizeType(this.data.type),
        errorText: this.data.errorMessage || '请检查验证码'
      });
    },
    onInput: function onInput(event) {
      if (this.data.disabled) return;
      var index = Number(event.currentTarget.dataset.index);
      var cells = this.data.cells.map(function copy(item) { return item.value; });
      var chars = String(event.detail.value || '').replace(/\\s/g, '').split('');
      var length = normalizeLength(this.data.length);
      var position;
      for (position = 0; position < chars.length && index + position < length; position += 1) cells[index + position] = chars[position];
      var value = cells.join('');
      var complete = cells.every(function hasValue(item) { return !!item; });
      var nextIndex = complete ? -1 : Math.min(length - 1, index + Math.max(1, chars.length));
      this.setData({ cells: makeCells(value, length), activeIndex: nextIndex });
      this.triggerEvent('input', { value: value, index: index, complete: complete });
      this.triggerEvent('change', { value: value, index: index, complete: complete });
      if (complete) this.triggerEvent('complete', { value: value });
    },
    onFocus: function onFocus(event) { var index = Number(event.currentTarget.dataset.index); this.setData({ activeIndex: index }); this.triggerEvent('focus', { index: index, detail: event.detail }); },
    onBlur: function onBlur(event) { this.triggerEvent('blur', { index: Number(event.currentTarget.dataset.index), detail: event.detail }); }
  }
});
`,
    wxml: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}"><input wx:for="{{cells}}" wx:key="index" class="pui-input-otp__cell" value="{{item.value}}" maxlength="{{index === activeIndex ? 8 : 1}}" type="{{inputType}}" password="{{mask}}" focus="{{activeIndex === index}}" disabled="{{disabled}}" data-index="{{index}}" bindinput="onInput" bindfocus="onFocus" bindblur="onBlur" /><text wx:if="{{error}}" class="pui-input-otp__error">{{errorText}}</text></view>
`,
    wxss: themeImport + `.pui-input-otp{display:flex;flex-wrap:wrap;gap:var(--pui-space-sm)}.pui-input-otp--disabled{opacity:.5}.pui-input-otp__cell{box-sizing:border-box;width:76rpx;height:84rpx;color:var(--pui-text-primary);font-size:32rpx;font-weight:650;line-height:84rpx;text-align:center;background:var(--pui-bg-container);border:1rpx solid var(--pui-border-color);border-radius:var(--pui-radius-small)}.pui-input-otp__cell:focus{border-color:var(--pui-color-brand)}.pui-input-otp--error .pui-input-otp__cell{border-color:var(--pui-color-danger)}.pui-input-otp__error{flex-basis:100%;color:var(--pui-color-danger);font-size:22rpx;line-height:32rpx}\n`,
  },
  label: {
    js: `var themeBehavior = require('../common/behaviors/theme');

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    content: { type: String, value: '' },
    required: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    colon: { type: Boolean, value: false }
  }
});
`,
    wxml: `<view class="pui-label {{disabled ? 'pui-label--disabled' : ''}} {{customClass}}" style="{{customStyle}}"><text>{{content}}</text><text wx:if="{{colon && content}}" class="pui-label__colon">：</text><text wx:if="{{required}}" class="pui-label__required">*</text><slot></slot></view>
`,
    wxss: themeImport + `.pui-label{display:flex;align-items:center;gap:var(--pui-space-step-3);color:var(--pui-text-primary);font-size:26rpx;font-weight:600;line-height:38rpx}.pui-label--disabled{color:var(--pui-text-disabled)}.pui-label__required{color:var(--pui-color-danger)}\n`,
  },
  popover: {
    json: { 'pui-popup': '../popup/popup' },
    js: `var themeBehavior = require('../common/behaviors/theme');

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    visible: { type: Boolean, value: false },
    defaultVisible: { type: Boolean, value: false },
    placement: { type: String, value: 'bottom' },
    title: { type: String, value: '' },
    content: { type: String, value: '' },
    closeOnOverlayClick: { type: Boolean, value: true }
  },
  data: { innerVisible: false },
  observers: { 'visible,defaultVisible': function sync() { this.setData({ innerVisible: this.data.visible || this.data.defaultVisible }); } },
  lifetimes: { attached: function attached() { this.setData({ innerVisible: this.data.visible || this.data.defaultVisible }); } },
  methods: {
    open: function open() { this.setData({ innerVisible: true }); this.triggerEvent('open'); },
    close: function close() { this.setData({ innerVisible: false }); this.triggerEvent('close'); },
    onReferenceTap: function onReferenceTap() { this.open(); }
  }
});
`,
    wxml: `<view class="pui-popover {{customClass}}" style="{{customStyle}}"><view bindtap="onReferenceTap"><slot name="reference"></slot></view><pui-popup visible="{{innerVisible}}" placement="{{placement}}" title="{{title}}" content="{{content}}" show-left-check="{{false}}" close-on-overlay-click="{{closeOnOverlayClick}}" bind:close="close"><slot></slot></pui-popup></view>
`,
    wxss: themeImport + `.pui-popover{display:inline-block}\n`,
  },
  sheet: {
    json: { 'pui-popup': '../popup/popup' },
    js: `var themeBehavior = require('../common/behaviors/theme');

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    visible: { type: Boolean, value: false },
    defaultVisible: { type: Boolean, value: false },
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    closeOnOverlayClick: { type: Boolean, value: true }
  },
  data: { innerVisible: false },
  observers: { 'visible,defaultVisible': function sync() { this.setData({ innerVisible: this.data.visible || this.data.defaultVisible }); } },
  lifetimes: { attached: function attached() { this.setData({ innerVisible: this.data.visible || this.data.defaultVisible }); } },
  methods: {
    close: function close() { this.setData({ innerVisible: false }); this.triggerEvent('close'); },
    open: function open() { this.setData({ innerVisible: true }); this.triggerEvent('open'); }
  }
});
`,
    wxml: `<pui-popup class="{{customClass}}" style="{{customStyle}}" visible="{{innerVisible}}" placement="bottom" title="{{title}}" subtitle="{{description}}" show-left-check="{{false}}" close-on-overlay-click="{{closeOnOverlayClick}}" bind:close="close"><slot></slot></pui-popup>
`,
    wxss: themeImport,
  },
  'scroll-area': {
    js: `var themeBehavior = require('../common/behaviors/theme');

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    height: { type: String, value: '320rpx' },
    scrollY: { type: Boolean, value: true },
    scrollX: { type: Boolean, value: false },
    showScrollbar: { type: Boolean, value: true },
    scrollTop: { type: Number, value: 0 },
    scrollLeft: { type: Number, value: 0 },
    scrollWithAnimation: { type: Boolean, value: false },
    upperThreshold: { type: Number, value: 50 },
    lowerThreshold: { type: Number, value: 50 }
  },
  methods: {
    onScroll: function onScroll(event) { this.triggerEvent('scroll', event.detail); },
    onScrollToUpper: function onScrollToUpper(event) { this.triggerEvent('scrolltoupper', event.detail); },
    onScrollToLower: function onScrollToLower(event) { this.triggerEvent('scrolltolower', event.detail); }
  }
});
`,
    wxml: `<scroll-view class="pui-scroll-area {{customClass}}" style="{{customStyle}};height:{{height}}" scroll-y="{{scrollY}}" scroll-x="{{scrollX}}" scroll-top="{{scrollTop}}" scroll-left="{{scrollLeft}}" scroll-with-animation="{{scrollWithAnimation}}" upper-threshold="{{upperThreshold}}" lower-threshold="{{lowerThreshold}}" show-scrollbar="{{showScrollbar}}" bindscroll="onScroll" bindscrolltoupper="onScrollToUpper" bindscrolltolower="onScrollToLower"><slot></slot></scroll-view>
`,
    wxss: themeImport + `.pui-scroll-area{box-sizing:border-box;width:100%;background:var(--pui-bg-container);border-radius:var(--pui-radius-medium)}\n`,
  },
};

let generatedCount = 0;
for (const [name, spec] of Object.entries(specs)) {
  if (preservedNativeComponents.has(name)) continue;
  const dir = path.join(root, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}.json`), json(spec.json));
  fs.writeFileSync(path.join(dir, `${name}.js`), spec.js);
  fs.writeFileSync(path.join(dir, `${name}.wxml`), spec.wxml);
  fs.writeFileSync(path.join(dir, `${name}.wxss`), spec.wxss);
  generatedCount += 1;
}

console.log(`Generated ${generatedCount} shadcn-aligned native components; preserved maintained native components.`);
