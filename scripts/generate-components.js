const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const existing = new Set(['config-provider', 'button', 'cell', 'tag', 'loading']);
// Components in this set have real maintained state, events, animation, slots,
// and edge handling. The experimental shell generator must never replace them.
const preservedNativeComponents = new Set([
  'icon',
  'divider',
  'badge',
  'bubble',
  'avatar',
  'image',
  'grid',
  'input',
  'textarea',
  'switch',
  'checkbox',
  'radio',
  'form',
  'picker',
  'date-time-picker',
  'search',
  'stepper',
  'slider',
  'rate',
  'upload',
  'toast',
  'dialog',
  'progress',
  'skeleton',
  'empty',
  'notice-bar',
  'result',
  'navbar',
  'navigation-menu',
  'tabs',
  'breadcrumb',
  'tabbar',
  'steps',
  'back-top',
  'indexes',
  'sidebar',
  'list',
  'collapse',
  'swipe-cell',
  'count-down',
  'table',
  'swiper',
  'calendar',
  'popup',
  'action-sheet',
  'dropdown-menu',
  'overlay',
  'pull-refresh',
  'virtual-list',
  'sticky',
  'watermark',
]);
const components = [
  'icon',
  'divider',
  'badge',
  'avatar',
  'image',
  'grid',
  'input',
  'textarea',
  'switch',
  'checkbox',
  'radio',
  'form',
  'picker',
  'date-time-picker',
  'search',
  'stepper',
  'slider',
  'rate',
  'upload',
  'toast',
  'dialog',
  'progress',
  'skeleton',
  'empty',
  'notice-bar',
  'result',
  'navbar',
  'navigation-menu',
  'tabs',
  'tabbar',
  'steps',
  'back-top',
  'indexes',
  'sidebar',
  'list',
  'collapse',
  'swipe-cell',
  'count-down',
  'table',
  'calendar',
  'popup',
  'action-sheet',
  'dropdown-menu',
  'overlay',
  'pull-refresh',
  'virtual-list',
  'sticky',
  'watermark',
];

const titleMap = {
  icon: '图标',
  divider: '分割线',
  badge: '徽标',
  avatar: '头像',
  image: '图片',
  grid: '宫格',
  input: '输入框',
  textarea: '文本域',
  switch: '开关',
  checkbox: '复选框',
  radio: '单选框',
  form: '表单',
  picker: '选择器',
  'date-time-picker': '时间选择',
  search: '搜索',
  stepper: '步进器',
  slider: '滑块',
  rate: '评分',
  upload: '上传',
  toast: '轻提示',
  dialog: '弹窗',
  progress: '进度',
  skeleton: '骨架屏',
  empty: '空状态',
  'notice-bar': '通知栏',
  result: '结果页',
  navbar: '导航栏',
  'navigation-menu': '导航菜单',
  tabs: '标签页',
  tabbar: '标签栏',
  steps: '步骤条',
  'back-top': '回到顶部',
  indexes: '索引',
  sidebar: '侧边导航',
  list: '列表',
  collapse: '折叠面板',
  'swipe-cell': '滑动单元格',
  'count-down': '倒计时',
  table: '表格',
  calendar: '日历',
  popup: '弹出层',
  'action-sheet': '动作面板',
  'dropdown-menu': '下拉菜单',
  overlay: '遮罩',
  'pull-refresh': '下拉刷新',
  'virtual-list': '虚拟列表',
  sticky: '粘性布局',
  watermark: '水印',
};

const optionDefaults = {
  grid: ['组件', '主题', '图标', '发布'],
  checkbox: ['选项 A', '选项 B', '选项 C'],
  radio: ['选项 A', '选项 B', '选项 C'],
  picker: ['基础组件', '表单组件', '反馈组件'],
  tabs: ['基础', '表单', '反馈'],
  tabbar: ['首页', '组件', '我的'],
  steps: ['设计', '开发', '发布'],
  indexes: ['A 组件', 'B 组件', 'C 组件'],
  sidebar: ['通用', '表单', '反馈'],
  list: ['Button 按钮', 'Input 输入框', 'Dialog 弹窗'],
  collapse: ['组件 API', '设计规则', '兼容说明'],
  table: ['Button|done|P0', 'Input|beta|P1', 'Dialog|beta|P1'],
  calendar: ['1', '2', '3', '4', '5', '6', '7'],
  'action-sheet': ['复制链接', '收藏组件', '删除'],
  'dropdown-menu': ['全部状态', 'done', 'beta', 'planned'],
  'virtual-list': ['#1001 Button', '#1002 Cell', '#1003 Input', '#1004 Dialog'],
};

function pascal(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeGeneratedFile(file, content) {
  fs.writeFileSync(file, content);
}

function json(name) {
  return `${JSON.stringify(
    {
      component: true,
      styleIsolation: 'shared',
      usingComponents: {},
    },
    null,
    2,
  )}\n`;
}

function js(name) {
  const defaultOptions = optionDefaults[name] || ['选项一', '选项二', '选项三'];
  const componentTitle = titleMap[name] || pascal(name);
  return `var themeBehavior = require('../common/behaviors/theme');

var componentName = '${name}';
var defaultOptions = ${JSON.stringify(defaultOptions)};
var defaultTitle = '${componentTitle}';

function clamp(value, min, max) {
  var number = Number(value);
  if (isNaN(number)) {
    number = 0;
  }
  return Math.max(min, Math.min(max, number));
}

function normalizeOptions(options) {
  if (Array.isArray(options) && options.length) {
    return options.map(function mapOption(item, index) {
      var label;
      if (typeof item === 'object') {
        label = item.label || item.text || item.title || String(index + 1);
        return {
          label: label,
          value: item.value || item.label || item.text || String(index),
          description: item.description || '',
          status: item.status || '',
          checked: !!item.checked,
          disabled: !!item.disabled,
          initial: String(label).charAt(0).toUpperCase(),
        };
      }
      var text = String(item);
      if (componentName === 'table' && text.indexOf('|') > -1) {
        var cells = text.split('|');
        return { label: cells[0], value: cells[1] || '', description: cells[2] || '', status: '', checked: false, disabled: false, initial: String(cells[0]).charAt(0).toUpperCase() };
      }
      return { label: text, value: text, description: '', status: '', checked: false, disabled: false, initial: text.charAt(0).toUpperCase() };
    });
  }
  return defaultOptions.map(function mapDefault(text, index) {
    return { label: text, value: text, description: '', status: index === 0 ? 'active' : '', checked: index === 0, disabled: false, initial: String(text).charAt(0).toUpperCase() };
  });
}

Component({
  behaviors: [themeBehavior],
  options: {
    multipleSlots: true,
    styleIsolation: 'shared',
  },
  properties: {
    theme: { type: String, value: 'default' },
    variant: { type: String, value: 'base' },
    size: { type: String, value: 'medium' },
    title: { type: String, value: defaultTitle },
    text: { type: String, value: '' },
    description: { type: String, value: '' },
    subtitle: { type: String, value: '' },
    value: { type: String, optionalTypes: [Number, Boolean, Array, Object], value: '' },
    placeholder: { type: String, optionalTypes: [Boolean], value: '请输入' },
    label: { type: String, value: '' },
    src: { type: String, value: '' },
    name: { type: String, value: componentName },
    icon: { type: String, value: '' },
    status: { type: String, value: 'default' },
    mode: { type: String, value: '' },
    position: { type: String, value: 'bottom' },
    placement: { type: String, value: '' },
    options: { type: Array, value: defaultOptions },
    items: { type: Array, value: [] },
    actions: { type: Array, value: [] },
    keys: { type: Object, value: {} },
    marks: { type: null, value: {} },
    texts: { type: Array, value: [] },
    files: { type: Array, value: [] },
    defaultFiles: { type: Array, value: [] },
    defaultValue: { type: null, value: null },
    defaultVisible: { type: Boolean, value: false },
    defaultChecked: { type: Boolean, value: false },
    defaultCurrent: { type: null, value: null },
    columns: { type: Number, value: 4 },
    column: { type: Number, value: 4 },
    percent: { type: Number, value: 60 },
    percentage: { type: Number, value: 60 },
    max: { type: Number, value: 100 },
    min: { type: Number, value: 0 },
    step: { type: Number, value: 1 },
    count: { type: Number, value: 5 },
    current: { type: null, value: null },
    titleMaxLength: { type: Number, value: 0 },
    visibleItemCount: { type: Number, value: 5 },
    zIndex: { type: Number, value: 1 },
    duration: { type: Number, value: 500 },
    delay: { type: Number, value: 0 },
    gutter: { type: Number, value: 16 },
    minDate: { type: Number, value: 0 },
    maxDate: { type: Number, value: 0 },
    firstDayOfWeek: { type: Number, value: 0 },
    visibilityHeight: { type: Number, value: 200 },
    offsetTop: { type: Number, value: 0 },
    cursor: { type: Number, value: -1 },
    cursorSpacing: { type: Number, value: 0 },
    selectionStart: { type: Number, value: -1 },
    selectionEnd: { type: Number, value: -1 },
    maxlength: { type: Number, value: -1 },
    maxcharacter: { type: Number, value: 0 },
    inputWidth: { type: Number, value: 0 },
    strokeWidth: { type: Number, value: 0 },
    type: { type: String, value: '' },
    shape: { type: String, value: '' },
    align: { type: String, value: '' },
    layout: { type: String, value: '' },
    content: { type: String, value: '' },
    note: { type: String, value: '' },
    tips: { type: String, value: '' },
    suffix: { type: String, value: '' },
    leftAction1Icon: { type: String, value: '✓' },
    leftAction2Icon: { type: String, value: '' },
    rightAction1Icon: { type: String, value: '' },
    rightAction2Icon: { type: String, value: '×' },
    cancelText: { type: String, value: '取消' },
    cancelBtn: { type: null, value: '' },
    confirmBtn: { type: null, value: '' },
    buttonLayout: { type: String, value: 'horizontal' },
    header: { type: String, value: '' },
    start: { type: String, value: '' },
    end: { type: String, value: '' },
    format: { type: null, value: '' },
    themeProps: { type: Object, value: {} },
    overlayProps: { type: Object, value: {} },
    popupProps: { type: Object, value: {} },
    gridConfig: { type: Object, value: {} },
    imageProps: { type: Object, value: {} },
    loadingProps: { type: Object, value: {} },
    localeText: { type: Object, value: {} },
    checked: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    readonly: { type: Boolean, value: false },
    readOnly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    visible: { type: Boolean, value: true },
    open: { type: Boolean, value: true },
    dot: { type: Boolean, value: false },
    round: { type: Boolean, value: false },
    closable: { type: Boolean, value: false },
    closeBtn: { type: null, value: false },
    closeOnOverlayClick: { type: Boolean, value: true },
    showOverlay: { type: Boolean, value: true },
    preventScrollThrough: { type: Boolean, value: true },
    usingCustomNavbar: { type: Boolean, value: false },
    borderless: { type: Boolean, value: false },
    bordered: { type: Boolean, value: true },
    clearable: { type: null, value: false },
    clearTrigger: { type: String, value: 'always' },
    autoFocus: { type: Boolean, value: false },
    focus: { type: Boolean, value: false },
    allowInputOverMax: { type: Boolean, value: false },
    confirmHold: { type: Boolean, value: false },
    holdKeyboard: { type: Boolean, value: false },
    showConfirmBar: { type: Boolean, value: true },
    indicator: { type: Boolean, value: true },
    disableInput: { type: Boolean, value: false },
    integer: { type: Boolean, value: true },
    range: { type: Boolean, value: false },
    showExtremeValue: { type: Boolean, value: false },
    allowHalf: { type: Boolean, value: false },
    showText: { type: Boolean, value: false },
    addBtn: { type: Boolean, value: true },
    removeBtn: { type: Boolean, value: true },
    preview: { type: Boolean, value: true },
    autoClose: { type: Boolean, value: true },
    fixed: { type: Boolean, value: false },
    placeholderFlag: { type: Boolean, value: false },
    placeholderBool: { type: Boolean, value: false },
    safeAreaInsetBottom: { type: Boolean, value: true },
    safeAreaInsetTop: { type: Boolean, value: true },
    split: { type: Boolean, value: true },
    sticky: { type: Boolean, value: false },
    swipeable: { type: Boolean, value: true },
    showBottomLine: { type: Boolean, value: true },
    spaceEvenly: { type: Boolean, value: true },
    readonlyCalendar: { type: Boolean, value: false },
    vertical: { type: Boolean, value: false },
    multiple: { type: Boolean, value: false },
    safeArea: { type: Boolean, value: true },
    showHeader: { type: Boolean, value: true },
    showLeftCheck: { type: Boolean, value: true },
    showLeftSecond: { type: Boolean, value: false },
    showRightFirst: { type: Boolean, value: false },
    showClose: { type: Boolean, value: true },
  },
  data: {
    componentName: componentName,
    rootClass: '',
    normalizedOptions: [],
    innerValue: '',
    innerLength: 0,
    innerChecked: false,
    innerVisible: true,
    displayPosition: 'bottom',
    activeLabel: '',
    titleInitial: '',
    nameInitial: '',
    activeIndex: 0,
    expandedIndex: 0,
    percentValue: 60,
    rateItems: [],
    calendarDays: [],
    uploadedFiles: [],
    countdownText: '00:00:00',
  },
  observers: {
    '**': function allObserver() {
      this.syncState();
    },
  },
  lifetimes: {
    attached: function attached() {
      this.syncState();
      if (componentName === 'count-down') {
        this.startCountdown();
      }
    },
    detached: function detached() {
      if (this._timer) {
        clearInterval(this._timer);
      }
    },
  },
  methods: {
    syncState: function syncState() {
      var sourceOptions = this.data.items && this.data.items.length ? this.data.items : this.data.options;
      if (componentName === 'action-sheet' && this.data.actions && this.data.actions.length) {
        sourceOptions = this.data.actions;
      }
      var options = normalizeOptions(sourceOptions);
      var value = this.data.value === '' || this.data.value === null || this.data.value === undefined ? '' : this.data.value;
      var activeItem = options[this.data.activeIndex] || options[0] || { label: '' };
      var percentValue = clamp(this.data.percentage || this.data.percent || value || 0, 0, 100);
      var count = Math.max(1, Number(this.data.count) || 5);
      var rateValue = clamp(value || percentValue / 20, 0, count);
      var rateItems = [];
      var i;
      for (i = 0; i < count; i += 1) {
        rateItems.push({ index: i, active: i < Math.round(rateValue) });
      }
      var calendarDays = [];
      for (i = 1; i <= 30; i += 1) {
        calendarDays.push({ value: i, active: String(i) === String(value || 18) });
      }
      var classes = [
        'pui-' + componentName,
        this.getColorSchemeClass(),
        'pui-' + componentName + '--' + this.data.size,
        this.data.theme !== 'default' ? 'pui-' + componentName + '--' + this.data.theme : '',
        this.data.variant !== 'base' ? 'pui-' + componentName + '--' + this.data.variant : '',
        this.data.disabled ? 'pui-' + componentName + '--disabled' : '',
        this.data.round ? 'pui-' + componentName + '--round' : '',
        this.data.vertical ? 'pui-' + componentName + '--vertical' : '',
        this.data.status !== 'default' ? 'pui-' + componentName + '--' + this.data.status : '',
      ];
      this.setData({
        rootClass: classes.filter(Boolean).join(' '),
        normalizedOptions: options,
        innerValue: value,
        innerLength: String(value).length,
        innerChecked: !!this.data.checked,
        innerVisible: !!(this.data.visible || this.data.open || this.data.defaultVisible),
        displayPosition: this.data.placement || this.data.position || 'bottom',
        activeLabel: activeItem.label,
        titleInitial: String(this.data.title || defaultTitle).charAt(0).toUpperCase(),
        nameInitial: String(this.data.name || componentName).charAt(0).toUpperCase(),
        percentValue: percentValue,
        rateItems: rateItems,
        calendarDays: calendarDays,
      });
    },
    emitChange: function emitChange(value, extra) {
      var detail = extra || {};
      detail.value = value;
      this.triggerEvent('change', detail);
    },
    onTap: function onTap(event) {
      if (this.data.disabled) return;
      this.triggerEvent('click', event.detail);
    },
    noop: function noop() {},
    onInput: function onInput(event) {
      var value = event.detail.value;
      this.setData({ innerValue: value, innerLength: String(value).length });
      this.triggerEvent('input', { value: value });
      this.emitChange(value);
    },
    onClear: function onClear() {
      if (this.data.disabled || this.data.readonly) return;
      this.setData({ innerValue: '', innerLength: 0 });
      this.triggerEvent('clear', {});
      this.emitChange('');
    },
    toggleChecked: function toggleChecked() {
      if (this.data.disabled || this.data.readonly) return;
      var checked = !this.data.innerChecked;
      this.setData({ innerChecked: checked });
      this.emitChange(checked, { checked: checked });
    },
    selectOption: function selectOption(event) {
      if (this.data.disabled) return;
      var index = Number(event.currentTarget.dataset.index || 0);
      var item = this.data.normalizedOptions[index];
      if (!item || item.disabled) return;
      this.setData({ activeIndex: index, innerValue: item.value, activeLabel: item.label });
      this.emitChange(item.value, { index: index, item: item });
    },
    toggleVisible: function toggleVisible() {
      if (this.data.disabled) return;
      var visible = !this.data.innerVisible;
      this.setData({ innerVisible: visible });
      this.triggerEvent(visible ? 'open' : 'close', { visible: visible });
    },
    close: function close() {
      this.setData({ innerVisible: false });
      this.triggerEvent('close', {});
    },
    toggleExpand: function toggleExpand(event) {
      var index = Number(event.currentTarget.dataset.index || 0);
      this.setData({ expandedIndex: this.data.expandedIndex === index ? -1 : index });
      this.emitChange(index, { index: index });
    },
    increment: function increment() {
      if (this.data.disabled) return;
      var value = clamp(Number(this.data.innerValue || 0) + Number(this.data.step || 1), Number(this.data.min), Number(this.data.max));
      this.setData({ innerValue: value });
      this.emitChange(value);
    },
    decrement: function decrement() {
      if (this.data.disabled) return;
      var value = clamp(Number(this.data.innerValue || 0) - Number(this.data.step || 1), Number(this.data.min), Number(this.data.max));
      this.setData({ innerValue: value });
      this.emitChange(value);
    },
    onSliderChange: function onSliderChange(event) {
      var value = event.detail.value;
      this.setData({ percentValue: value, innerValue: value });
      this.emitChange(value);
    },
    onRateTap: function onRateTap(event) {
      if (this.data.disabled || this.data.readonly) return;
      var value = Number(event.currentTarget.dataset.index || 0) + 1;
      this.setData({ innerValue: value });
      this.emitChange(value);
    },
    onPickerChange: function onPickerChange(event) {
      var index = Number(event.detail.value || 0);
      var item = this.data.normalizedOptions[index];
      this.setData({ activeIndex: index, innerValue: item ? item.value : '', activeLabel: item ? item.label : '' });
      this.emitChange(item ? item.value : '', { index: index, item: item });
    },
    onDateChange: function onDateChange(event) {
      this.setData({ innerValue: event.detail.value, innerLength: String(event.detail.value).length });
      this.emitChange(event.detail.value);
    },
    chooseFile: function chooseFile() {
      var self = this;
      if (this.data.disabled) return;
      var choose = wx.chooseMedia || wx.chooseImage;
      if (!choose) {
        this.triggerEvent('error', { message: 'choose api unavailable' });
        return;
      }
      choose({
        count: 1,
        success: function success(res) {
          var files = res.tempFiles || (res.tempFilePaths || []).map(function mapPath(filePath) { return { tempFilePath: filePath }; });
          self.setData({ uploadedFiles: files });
          self.triggerEvent('success', { files: files });
          self.emitChange(files);
        },
        fail: function fail(error) {
          self.triggerEvent('error', error);
        },
      });
    },
    startCountdown: function startCountdown() {
      var self = this;
      var remain = Number(this.data.value || 3661);
      function render() {
        var hours = Math.floor(remain / 3600);
        var minutes = Math.floor((remain % 3600) / 60);
        var seconds = remain % 60;
        self.setData({
          countdownText: [hours, minutes, seconds].map(function pad(number) { return number < 10 ? '0' + number : String(number); }).join(':'),
        });
        if (remain <= 0) {
          clearInterval(self._timer);
          self.triggerEvent('finish', {});
        }
        remain -= 1;
      }
      render();
      this._timer = setInterval(render, 1000);
    },
    refresh: function refresh() {
      this.triggerEvent('refresh', {});
      this.setData({ loading: true });
      var self = this;
      setTimeout(function done() {
        self.setData({ loading: false });
      }, 600);
    },
    backTop: function backTop() {
      this.triggerEvent('backtop', {});
      if (wx.pageScrollTo) {
        wx.pageScrollTo({ scrollTop: 0, duration: 500 });
      }
    },
    submit: function submit() {
      this.triggerEvent('submit', { value: this.data.innerValue });
    },
    reset: function reset() {
      this.setData({ innerValue: '', innerLength: 0 });
      this.triggerEvent('reset', {});
    },
  },
});
`;
}

function wxml(name) {
  const templates = {
    icon: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}; color: {{color || ''}};">
  <text class="pui-icon__glyph">{{fontGlyph || nameInitial}}</text>
</view>
`,
    divider: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-divider__line"></view>
  <view wx:if="{{text || title}}" class="pui-divider__text">{{text || title}}</view>
  <view class="pui-divider__line"></view>
</view>
`,
    badge: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <slot></slot>
  <view wx:if="{{dot}}" class="pui-badge__dot"></view>
  <view wx:else class="pui-badge__content">{{value || text || count}}</view>
</view>
`,
    avatar: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}" bindtap="onTap">
  <image wx:if="{{src}}" class="pui-avatar__image" src="{{src}}" mode="aspectFill" />
  <view wx:else class="pui-avatar__text">{{text || titleInitial}}</view>
</view>
`,
    image: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <image wx:if="{{src}}" class="pui-image__node" src="{{src}}" mode="{{mode || 'aspectFill'}}" bindload="emitChange" binderror="emitChange" />
  <view wx:else class="pui-image__fallback">{{text || 'Image'}}</view>
</view>
`,
    grid: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}; --pui-grid-columns: {{columns}};">
  <view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-grid__item" data-index="{{index}}" bindtap="selectOption">
    <view class="pui-grid__icon">{{item.initial}}</view>
    <view class="pui-grid__text">{{item.label}}</view>
  </view>
</view>
`,
    input: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:if="{{label || title}}" class="pui-field__label">{{label || title}}</view>
  <input class="pui-field__input" value="{{innerValue}}" placeholder="{{placeholder}}" disabled="{{disabled}}" bindinput="onInput" />
  <view wx:if="{{innerValue && !disabled}}" class="pui-field__clear" catchtap="onClear">×</view>
</view>
`,
    textarea: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:if="{{label || title}}" class="pui-field__label">{{label || title}}</view>
  <textarea class="pui-textarea__input" value="{{innerValue}}" placeholder="{{placeholder}}" disabled="{{disabled}}" bindinput="onInput" />
  <view class="pui-textarea__count">{{innerLength}}/{{max}}</view>
</view>
`,
    switch: `<view class="{{rootClass}} {{innerChecked ? 'pui-switch--checked' : ''}} {{customClass}}" style="{{customStyle}}" bindtap="toggleChecked">
  <view class="pui-switch__thumb"></view>
</view>
`,
    checkbox: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-choice {{item.checked || activeIndex === index ? 'pui-choice--checked' : ''}}" data-index="{{index}}" bindtap="selectOption">
    <view class="pui-choice__mark">✓</view>
    <view class="pui-choice__text">{{item.label}}</view>
  </view>
</view>
`,
    radio: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-choice pui-choice--radio {{activeIndex === index ? 'pui-choice--checked' : ''}}" data-index="{{index}}" bindtap="selectOption">
    <view class="pui-choice__mark"></view>
    <view class="pui-choice__text">{{item.label}}</view>
  </view>
</view>
`,
    form: `<form class="{{rootClass}} {{customClass}}" style="{{customStyle}};{{rootStyle}}" role="form" aria-label="{{ariaLabel || '表单'}}" bindsubmit="onNativeSubmit" bindreset="onNativeReset">
  <slot></slot>
</form>
`,
    picker: `<picker range="{{normalizedOptions}}" range-key="label" value="{{activeIndex}}" bindchange="onPickerChange">
  <view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
    <view><view class="pui-picker__title">{{title}}</view><view class="pui-picker__value">{{innerValue || activeLabel}}</view></view>
    <view class="pui-picker__arrow"></view>
  </view>
</picker>
`,
    'date-time-picker': `<picker mode="{{mode || 'date'}}" value="{{innerValue}}" bindchange="onDateChange">
  <view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
    <view><view class="pui-picker__title">{{title}}</view><view class="pui-picker__value">{{innerValue || '请选择时间'}}</view></view>
    <view class="pui-picker__arrow"></view>
  </view>
</picker>
`,
    search: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-search__icon">⌕</view>
  <input class="pui-search__input" value="{{innerValue}}" placeholder="{{placeholder || '搜索'}}" bindinput="onInput" confirm-type="search" />
  <view wx:if="{{innerValue}}" class="pui-search__clear" catchtap="onClear">×</view>
  <view class="pui-search__cancel" bindtap="onClear">取消</view>
</view>
`,
    stepper: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <button class="pui-stepper__button" disabled="{{disabled}}" bindtap="decrement">-</button>
  <input class="pui-stepper__input" type="number" value="{{innerValue || min}}" disabled="{{disabled}}" bindinput="onInput" />
  <button class="pui-stepper__button" disabled="{{disabled}}" bindtap="increment">+</button>
</view>
`,
    slider: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <slider value="{{percentValue}}" min="{{min}}" max="{{max}}" step="{{step}}" disabled="{{disabled}}" activeColor="var(--pui-color-brand)" backgroundColor="var(--pui-bg-muted)" bindchange="onSliderChange" />
  <view class="pui-slider__value">{{percentValue}}%</view>
</view>
`,
    rate: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:for="{{rateItems}}" wx:key="index" class="pui-rate__star {{item.active ? 'pui-rate__star--active' : ''}}" data-index="{{index}}" bindtap="onRateTap">★</view>
</view>
`,
    upload: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-upload__button" bindtap="chooseFile">＋ {{text || title}}</view>
  <view wx:for="{{uploadedFiles}}" wx:key="tempFilePath" class="pui-upload__file">{{item.tempFilePath || item.path}}</view>
</view>
`,
    toast: `<view wx:if="{{innerVisible}}" class="{{rootClass}} {{customClass}}" style="{{customStyle}}" bindtap="close">
  <view class="pui-toast__icon">{{icon || '✓'}}</view>
  <view>{{text || title}}</view>
</view>
`,
    dialog: `<view wx:if="{{innerVisible}}" class="pui-layer">
  <view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
    <view class="pui-dialog__title">{{title}}</view>
    <view class="pui-dialog__desc">{{description || text}}</view>
    <slot></slot>
    <view class="pui-dialog__actions"><button bindtap="close">取消</button><button bindtap="submit">确认</button></view>
  </view>
</view>
`,
    progress: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-progress__track"><view class="pui-progress__bar" style="width: {{percentValue}}%;"></view></view>
  <view class="pui-progress__text">{{percentValue}}%</view>
</view>
`,
    skeleton: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-skeleton__avatar"></view>
  <view class="pui-skeleton__content"><view></view><view></view><view></view></view>
</view>
`,
    empty: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-empty__icon">∅</view>
  <view class="pui-empty__title">{{title}}</view>
  <view class="pui-empty__desc">{{description || text}}</view>
  <slot></slot>
</view>
`,
    'notice-bar': `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-notice-bar__icon">!</view>
  <view class="pui-notice-bar__text">{{text || title}}</view>
  <view wx:if="{{closable}}" class="pui-notice-bar__close" catchtap="close">×</view>
</view>
`,
    result: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-result__icon">{{icon || '✓'}}</view>
  <view class="pui-result__title">{{title}}</view>
  <view class="pui-result__desc">{{description || text}}</view>
  <slot></slot>
</view>
`,
    navbar: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-navbar__left" bindtap="backTop">‹</view>
  <view class="pui-navbar__title">{{title}}</view>
  <view class="pui-navbar__right"><slot name="right"></slot></view>
</view>
`,
    tabs: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-tabs__item {{activeIndex === index ? 'pui-tabs__item--active' : ''}}" data-index="{{index}}" bindtap="selectOption">{{item.label}}</view>
</view>
`,
    tabbar: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-tabbar__item {{activeIndex === index ? 'pui-tabbar__item--active' : ''}}" data-index="{{index}}" bindtap="selectOption"><view class="pui-tabbar__icon">{{item.initial}}</view><view>{{item.label}}</view></view>
</view>
`,
    steps: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-steps__item {{index <= activeIndex ? 'pui-steps__item--active' : ''}}" data-index="{{index}}" bindtap="selectOption"><view class="pui-steps__dot">{{index + 1}}</view><view>{{item.label}}</view></view>
</view>
`,
    'back-top': `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}" bindtap="backTop">↑</view>
`,
    indexes: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-indexes__list"><view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-indexes__item">{{item.label}}</view></view>
  <view class="pui-indexes__bar"><view wx:for="{{normalizedOptions}}" wx:key="value" data-index="{{index}}" bindtap="selectOption">{{item.initial}}</view></view>
</view>
`,
    sidebar: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-sidebar__item {{activeIndex === index ? 'pui-sidebar__item--active' : ''}}" data-index="{{index}}" bindtap="selectOption">{{item.label}}</view>
</view>
`,
    list: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-list__item" data-index="{{index}}" bindtap="selectOption"><view>{{item.label}}</view><view>{{item.status || value}}</view></view>
  <view class="pui-list__footer">{{loading ? '加载中' : '没有更多了'}}</view>
</view>
`,
    collapse: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-collapse__item">
    <view class="pui-collapse__title" data-index="{{index}}" bindtap="toggleExpand">{{item.label}} <text>⌄</text></view>
    <view wx:if="{{expandedIndex === index}}" class="pui-collapse__content">{{item.description || description || '这里是折叠内容'}}</view>
  </view>
</view>
`,
    'swipe-cell': `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-swipe-cell__content"><slot>{{title}}</slot></view>
  <view class="pui-swipe-cell__actions"><button bindtap="submit">置顶</button><button class="pui-danger" bindtap="close">删除</button></view>
</view>
`,
    'count-down': `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">{{countdownText}}</view>
`,
    table: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view class="pui-table__row pui-table__row--head"><view>组件</view><view>状态</view><view>优先级</view></view>
  <view wx:for="{{normalizedOptions}}" wx:key="label" class="pui-table__row"><view>{{item.label}}</view><view>{{item.value}}</view><view>{{item.description}}</view></view>
</view>
`,
    calendar: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}">
  <view wx:for="{{calendarDays}}" wx:key="value" class="pui-calendar__day {{item.active ? 'pui-calendar__day--active' : ''}}" data-index="{{index}}" bindtap="selectOption">{{item.value}}</view>
</view>
`,
    popup: `<view wx:if="{{innerVisible}}" class="pui-layer pui-layer--{{displayPosition}}">
  <view class="{{rootClass}} pui-popup--{{displayPosition}} {{customClass}}" style="{{customStyle}}" catchtap="noop">
    <view wx:if="{{showHeader}}" class="pui-popup__header">
      <view class="pui-popup__actions pui-popup__actions--left">
        <button wx:if="{{showLeftCheck}}" class="pui-popup__icon-button pui-popup__icon-button--check" type="default" catchtap="submit" aria-label="确认">
          <slot name="left-action-1"></slot>
          <text wx:if="{{leftAction1Icon}}">{{leftAction1Icon}}</text>
        </button>
        <button wx:if="{{showLeftSecond}}" class="pui-popup__icon-button" type="default" catchtap="onTap" aria-label="左侧操作">
          <slot name="left-action-2"></slot>
          <text wx:if="{{leftAction2Icon}}">{{leftAction2Icon}}</text>
        </button>
      </view>
      <view class="pui-popup__title-area">
        <slot name="title"><view class="pui-popup__title">{{title}}</view></slot>
        <slot name="subtitle"><view wx:if="{{subtitle || description}}" class="pui-popup__subtitle">{{subtitle || description}}</view></slot>
      </view>
      <view class="pui-popup__actions pui-popup__actions--right">
        <button wx:if="{{showRightFirst}}" class="pui-popup__icon-button" type="default" catchtap="onTap" aria-label="右侧操作">
          <slot name="right-action-1"></slot>
          <text wx:if="{{rightAction1Icon}}">{{rightAction1Icon}}</text>
        </button>
        <button wx:if="{{showClose}}" class="pui-popup__icon-button pui-popup__icon-button--close" type="default" catchtap="close" aria-label="关闭">
          <slot name="right-action-2"></slot>
          <text wx:if="{{rightAction2Icon}}">{{rightAction2Icon}}</text>
        </button>
      </view>
    </view>
    <view class="pui-popup__body">
      <slot>{{content || text || note || title}}</slot>
    </view>
  </view>
</view>
`,
    'action-sheet': `<view wx:if="{{innerVisible}}" class="pui-layer"><view class="{{rootClass}} {{customClass}}" style="{{customStyle}}"><view class="pui-action-sheet__title">{{title}}</view><view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-action-sheet__item" data-index="{{index}}" bindtap="selectOption">{{item.label}}</view><view class="pui-action-sheet__cancel" catchtap="close">取消</view></view></view>
`,
    'dropdown-menu': `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}"><view class="pui-dropdown-menu__bar" bindtap="toggleVisible">{{title}} ▾</view><view wx:if="{{innerVisible}}" class="pui-dropdown-menu__panel"><view wx:for="{{normalizedOptions}}" wx:key="value" data-index="{{index}}" bindtap="selectOption">{{item.label}}</view></view></view>
`,
    overlay: `<view wx:if="{{innerVisible}}" class="{{rootClass}} {{customClass}}" style="{{customStyle}}" bindtap="close"><slot></slot></view>
`,
    'pull-refresh': `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}"><view class="pui-pull-refresh__head" bindtap="refresh">{{loading ? '刷新中' : '点击刷新'}}</view><slot></slot></view>
`,
    'virtual-list': `<scroll-view scroll-y class="{{rootClass}} {{customClass}}" style="{{customStyle}}"><view wx:for="{{normalizedOptions}}" wx:key="value" class="pui-virtual-list__item">{{item.label}}</view></scroll-view>
`,
    sticky: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}"><view class="pui-sticky__inner">{{title}}</view><slot></slot></view>
`,
    watermark: `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}"><slot></slot><view class="pui-watermark__mark">{{text || title}}</view><view class="pui-watermark__mark pui-watermark__mark--b">{{text || title}}</view></view>
`,
  };
  return templates[name] || `<view class="{{rootClass}} {{customClass}}" style="{{customStyle}}" bindtap="onTap">{{text || title}}</view>\n`;
}

function wxss(name) {
  return `@import "../common/style/theme.wxss";

.pui-${name} {
  box-sizing: border-box;
  color: var(--pui-text-primary);
}

.pui-${name}--disabled {
  color: var(--pui-text-disabled);
  opacity: 0.56;
  pointer-events: none;
}

.pui-icon {
  display: inline-grid;
  place-items: center;
  width: 44rpx;
  height: 44rpx;
  color: var(--pui-color-brand);
}

.pui-icon__glyph {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  font-size: 24rpx;
  font-weight: 800;
  background: var(--pui-color-brand-light);
  border-radius: var(--pui-radius-small);
}

.pui-divider {
  display: flex;
  align-items: center;
  gap: var(--pui-space-normal);
  color: var(--pui-text-placeholder);
  font-size: var(--pui-font-size-small);
}

.pui-divider__line {
  flex: 1;
  height: 1rpx;
  background: var(--pui-border-color);
}

.pui-badge {
  position: relative;
  display: inline-flex;
}

.pui-badge__content,
.pui-badge__dot {
  position: absolute;
  top: calc(0rpx - var(--pui-space-sm));
  right: calc(0rpx - var(--pui-space-sm));
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 var(--pui-space-xs);
  color: #fff;
  font-size: 20rpx;
  line-height: 32rpx;
  text-align: center;
  background: var(--pui-color-danger);
  border-radius: var(--pui-radius-round);
}

.pui-badge__dot {
  min-width: 16rpx;
  width: 16rpx;
  height: 16rpx;
  padding: 0;
}

.pui-avatar {
  display: inline-grid;
  place-items: center;
  width: 88rpx;
  height: 88rpx;
  overflow: hidden;
  color: var(--pui-text-inverse);
  font-size: 34rpx;
  font-weight: 800;
  background: linear-gradient(135deg, var(--pui-color-brand), var(--pui-color-brand-gradient-end));
  border-radius: var(--pui-radius-large);
  box-shadow: var(--pui-shadow-card);
}

.pui-avatar--round {
  border-radius: var(--pui-radius-round);
}

.pui-avatar__image {
  width: 100%;
  height: 100%;
}

.pui-image {
  display: grid;
  place-items: center;
  min-height: 220rpx;
  overflow: hidden;
  background: var(--pui-bg-muted);
  border-radius: var(--pui-radius-large);
}

.pui-image__node {
  width: 100%;
  height: 100%;
  min-height: 220rpx;
}

.pui-image__fallback {
  color: var(--pui-text-placeholder);
  font-size: var(--pui-font-size-small);
}

.pui-grid {
  display: grid;
  grid-template-columns: repeat(var(--pui-grid-columns, 4), 1fr);
  overflow: hidden;
  background: var(--pui-glass-surface);
  border-radius: var(--pui-radius-large);
  box-shadow: var(--pui-shadow-card);
}

.pui-grid__item {
  display: grid;
  place-items: center;
  gap: var(--pui-space-step-5);
  min-height: 150rpx;
  padding: var(--pui-space-normal);
  box-shadow: inset -1rpx -1rpx 0 var(--pui-border-color);
}

.pui-grid__icon {
  display: grid;
  place-items: center;
  width: 54rpx;
  height: 54rpx;
  color: var(--pui-color-brand);
  background: var(--pui-color-brand-light);
  border-radius: var(--pui-radius-medium);
  font-weight: 800;
}

.pui-grid__text {
  color: var(--pui-text-secondary);
  font-size: var(--pui-font-size-small);
}

.pui-input,
.pui-textarea,
.pui-search,
.pui-picker,
.pui-date-time-picker {
  display: flex;
  align-items: center;
  gap: var(--pui-content-gap);
  min-height: 84rpx;
  padding: var(--pui-space-step-9) var(--pui-space-step-12);
  background: var(--pui-glass-surface);
  border-radius: var(--pui-radius-large);
  box-shadow: inset 0 0 0 1rpx var(--pui-glass-border), var(--pui-glass-shadow-soft);
  -webkit-backdrop-filter: var(--pui-frosted-filter);
  backdrop-filter: var(--pui-frosted-filter);
}

.pui-textarea {
  display: block;
}

.pui-field__label,
.pui-picker__title {
  color: var(--pui-text-secondary);
  font-size: var(--pui-font-size-small);
  font-weight: 700;
}

.pui-field__input,
.pui-textarea__input,
.pui-search__input,
.pui-stepper__input {
  flex: 1;
  min-width: 0;
  color: var(--pui-text-primary);
  background: transparent;
  border: 0;
}

.pui-textarea__input {
  width: 100%;
  min-height: 150rpx;
}

.pui-field__clear,
.pui-search__clear,
.pui-search__cancel {
  color: var(--pui-text-placeholder);
  font-size: var(--pui-font-size-small);
}

.pui-textarea__count,
.pui-slider__value,
.pui-progress__text {
  margin-top: var(--pui-space-xs);
  color: var(--pui-text-placeholder);
  font-size: var(--pui-font-size-small);
  text-align: right;
}

.pui-switch {
  position: relative;
  width: 92rpx;
  height: 56rpx;
  background: var(--pui-bg-muted);
  border-radius: var(--pui-radius-round);
  transition: background var(--pui-duration-normal);
}

.pui-switch--checked {
  background: var(--pui-color-brand);
}

.pui-switch__thumb {
  position: absolute;
  top: var(--pui-space-step-3);
  left: var(--pui-space-step-3);
  width: 44rpx;
  height: 44rpx;
  background: #fff;
  border-radius: var(--pui-radius-round);
  box-shadow: var(--pui-glass-shadow-soft);
  transition: left var(--pui-duration-normal);
}

.pui-switch--checked .pui-switch__thumb {
  left: var(--pui-space-step-21);
}

.pui-checkbox,
.pui-radio {
  display: grid;
  gap: var(--pui-space-sm);
}

.pui-choice {
  display: flex;
  align-items: center;
  gap: var(--pui-content-gap);
  min-height: 72rpx;
}

.pui-choice__mark {
  display: grid;
  place-items: center;
  width: 36rpx;
  height: 36rpx;
  color: transparent;
  border: 3rpx solid var(--pui-border-color);
  border-radius: var(--pui-radius-small);
}

.pui-choice--radio .pui-choice__mark {
  border-radius: var(--pui-radius-round);
}

.pui-choice--checked .pui-choice__mark {
  color: var(--pui-text-inverse);
  background: var(--pui-color-brand);
  border-color: var(--pui-color-brand);
}

.pui-form {
  display: grid;
  min-width: 0;
  gap: var(--pui-section-gap);
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}

.pui-picker__value {
  margin-top: var(--pui-space-xxs);
  color: var(--pui-text-primary);
  font-size: var(--pui-font-size-medium);
}

.pui-picker__arrow {
  width: 16rpx;
  height: 16rpx;
  margin-left: auto;
  border-top: 3rpx solid var(--pui-text-placeholder);
  border-right: 3rpx solid var(--pui-text-placeholder);
  transform: rotate(45deg);
}

.pui-search__icon {
  color: var(--pui-text-placeholder);
}

.pui-stepper {
  display: inline-grid;
  grid-template-columns: 64rpx 96rpx 64rpx;
  overflow: hidden;
  background: var(--pui-glass-surface);
  border-radius: var(--pui-radius-medium);
  box-shadow: inset 0 0 0 1rpx var(--pui-border-color);
}

.pui-stepper__button {
  height: 64rpx;
  color: var(--pui-color-brand);
  background: transparent;
  border: 0;
}

.pui-progress__track {
  height: 16rpx;
  overflow: hidden;
  background: var(--pui-bg-muted);
  border-radius: var(--pui-radius-round);
}

.pui-progress__bar {
  height: 100%;
  background: var(--pui-color-brand);
  border-radius: inherit;
}

.pui-rate {
  display: inline-flex;
  gap: var(--pui-space-xs);
}

.pui-rate__star {
  color: var(--pui-bg-muted);
  font-size: 42rpx;
}

.pui-rate__star--active {
  color: var(--pui-color-warning);
}

.pui-upload__button,
.pui-empty,
.pui-result,
.pui-skeleton,
.pui-toast,
.pui-dialog,
.pui-popup,
.pui-action-sheet,
.pui-dropdown-menu__panel {
  padding: var(--pui-space-lg);
  background: var(--pui-glass-surface);
  border-radius: var(--pui-radius-large);
  box-shadow: var(--pui-shadow-card);
  -webkit-backdrop-filter: var(--pui-frosted-filter);
  backdrop-filter: var(--pui-frosted-filter);
}

.pui-upload__button {
  color: var(--pui-color-brand);
  text-align: center;
}

.pui-upload__file {
  margin-top: var(--pui-space-sm);
  color: var(--pui-text-secondary);
  font-size: var(--pui-font-size-small);
}

.pui-layer {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--pui-space-step-16);
  background: rgba(0, 0, 0, 0.38);
}

.pui-toast {
  display: inline-flex;
  align-items: center;
  gap: var(--pui-space-sm);
  color: var(--pui-text-inverse);
  background: rgba(17, 18, 23, 0.86);
}

.pui-dialog__title,
.pui-result__title,
.pui-empty__title,
.pui-action-sheet__title {
  font-size: var(--pui-font-size-large);
  font-weight: 800;
}

.pui-dialog__desc,
.pui-result__desc,
.pui-empty__desc {
  margin-top: var(--pui-space-step-5);
  color: var(--pui-text-secondary);
  font-size: var(--pui-font-size-small);
}

.pui-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--pui-space-sm);
  margin-top: var(--pui-space-step-12);
}

.pui-dialog__actions button,
.pui-action-sheet__item,
.pui-action-sheet__cancel,
.pui-layer__close {
  min-height: 68rpx;
  color: var(--pui-color-brand);
  background: var(--pui-color-brand-light);
  border: 0;
  border-radius: var(--pui-radius-medium);
  text-align: center;
  line-height: 68rpx;
}

.pui-skeleton {
  display: flex;
  gap: var(--pui-space-normal);
}

.pui-skeleton__avatar,
.pui-skeleton__content view {
  background: linear-gradient(90deg, var(--pui-bg-muted), var(--pui-glass-surface-strong), var(--pui-bg-muted));
  border-radius: var(--pui-radius-medium);
}

.pui-skeleton__avatar {
  width: 72rpx;
  height: 72rpx;
}

.pui-skeleton__content {
  flex: 1;
}

.pui-skeleton__content view {
  height: 20rpx;
  margin: var(--pui-space-xs) 0;
}

.pui-empty,
.pui-result {
  display: grid;
  place-items: center;
  text-align: center;
}

.pui-empty__icon,
.pui-result__icon {
  display: grid;
  place-items: center;
  width: 96rpx;
  height: 96rpx;
  color: var(--pui-color-brand);
  background: var(--pui-color-brand-light);
  border-radius: var(--pui-radius-large);
  font-size: 44rpx;
}

.pui-notice-bar {
  display: flex;
  align-items: center;
  gap: var(--pui-space-step-7);
  min-height: 72rpx;
  padding: 0 var(--pui-space-step-12);
  color: var(--pui-color-warning);
  background: var(--pui-color-warning-light);
  border-radius: var(--pui-radius-medium);
}

.pui-notice-bar__text {
  flex: 1;
}

.pui-navbar,
.pui-tabs,
.pui-tabbar,
.pui-steps {
  display: flex;
  align-items: center;
  background: var(--pui-glass-surface);
  border-radius: var(--pui-radius-large);
  box-shadow: var(--pui-shadow-card);
}

.pui-navbar {
  justify-content: space-between;
  min-height: 88rpx;
  padding: 0 var(--pui-space-step-12);
}

.pui-navbar__title {
  font-weight: 800;
}

.pui-tabs,
.pui-tabbar {
  gap: var(--pui-space-xs);
  padding: var(--pui-space-xs);
}

.pui-tabs__item,
.pui-tabbar__item,
.pui-sidebar__item {
  flex: 1;
  min-height: 64rpx;
  padding: 0 var(--pui-space-normal);
  color: var(--pui-text-secondary);
  border-radius: var(--pui-radius-medium);
  line-height: 64rpx;
  text-align: center;
}

.pui-tabs__item--active,
.pui-tabbar__item--active,
.pui-sidebar__item--active {
  color: var(--pui-text-inverse);
  background: var(--pui-color-brand);
}

.pui-tabbar__item {
  display: grid;
  place-items: center;
  line-height: 1.2;
  font-size: var(--pui-font-size-small);
}

.pui-steps {
  justify-content: space-between;
  padding: var(--pui-space-step-12);
}

.pui-steps__item {
  flex: 1;
  color: var(--pui-text-placeholder);
  text-align: center;
}

.pui-steps__item--active {
  color: var(--pui-color-brand);
}

.pui-steps__dot {
  display: grid;
  place-items: center;
  width: 44rpx;
  height: 44rpx;
  margin: 0 auto var(--pui-space-xs);
  color: var(--pui-text-inverse);
  background: currentColor;
  border-radius: var(--pui-radius-round);
}

.pui-back-top {
  display: grid;
  place-items: center;
  width: 88rpx;
  height: 88rpx;
  color: var(--pui-text-inverse);
  background: var(--pui-color-brand);
  border-radius: var(--pui-radius-round);
  box-shadow: var(--pui-shadow-brand);
}

.pui-indexes {
  position: relative;
  padding-right: var(--pui-space-xl);
}

.pui-indexes__item,
.pui-list__item,
.pui-collapse__title,
.pui-collapse__content,
.pui-virtual-list__item {
  padding: var(--pui-space-step-11) var(--pui-space-step-12);
  background: var(--pui-glass-surface);
  box-shadow: inset 0 -1rpx 0 var(--pui-border-color);
}

.pui-indexes__bar {
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  gap: var(--pui-space-xs);
  color: var(--pui-color-brand);
  font-size: 20rpx;
  font-weight: 800;
}

.pui-sidebar {
  display: grid;
  gap: var(--pui-space-xs);
}

.pui-list {
  overflow: hidden;
  border-radius: var(--pui-radius-large);
}

.pui-list__item {
  display: flex;
  justify-content: space-between;
}

.pui-list__footer {
  padding: var(--pui-space-normal);
  color: var(--pui-text-placeholder);
  text-align: center;
}

.pui-collapse {
  overflow: hidden;
  border-radius: var(--pui-radius-large);
}

.pui-collapse__content {
  color: var(--pui-text-secondary);
  background: var(--pui-bg-muted);
}

.pui-swipe-cell {
  display: grid;
  grid-template-columns: 1fr auto;
  overflow: hidden;
  border-radius: var(--pui-radius-large);
}

.pui-swipe-cell__content {
  padding: var(--pui-space-step-12);
  background: var(--pui-glass-surface);
}

.pui-swipe-cell__actions {
  display: flex;
}

.pui-swipe-cell__actions button {
  width: 96rpx;
  color: #fff;
  background: var(--pui-color-brand);
  border: 0;
}

.pui-swipe-cell__actions .pui-danger {
  background: var(--pui-color-danger);
}

.pui-count-down {
  display: inline-flex;
  padding: var(--pui-content-gap) var(--pui-space-step-12);
  color: var(--pui-color-brand);
  font-size: 36rpx;
  font-weight: 900;
  background: var(--pui-color-brand-light);
  border-radius: var(--pui-radius-medium);
}

.pui-table {
  overflow: auto;
  border-radius: var(--pui-radius-large);
}

.pui-table__row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  min-width: 520rpx;
}

.pui-table__row view {
  padding: var(--pui-space-step-9);
  box-shadow: inset -1rpx -1rpx 0 var(--pui-border-color);
}

.pui-table__row--head {
  color: var(--pui-text-primary);
  font-weight: 800;
  background: var(--pui-bg-muted);
}

.pui-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--pui-space-xs);
}

.pui-calendar__day {
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  background: var(--pui-glass-surface);
  border-radius: var(--pui-radius-small);
}

.pui-calendar__day--active {
  color: var(--pui-text-inverse);
  background: var(--pui-color-brand);
}

.pui-popup,
.pui-action-sheet {
  position: absolute;
  right: var(--pui-space-step-16);
  bottom: var(--pui-space-step-16);
  left: var(--pui-space-step-16);
}

.pui-popup {
  min-height: 300rpx;
  padding: 0;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.78);
  border: 1rpx solid rgba(255, 255, 255, 0.72);
  border-radius: var(--pui-radius-xxlarge);
  box-shadow: var(--pui-glass-shadow);
}

.pui-popup--top {
  top: var(--pui-space-step-16);
  bottom: auto;
}

.pui-popup--left,
.pui-popup--right {
  top: var(--pui-space-step-16);
  bottom: var(--pui-space-step-16);
  width: 78vw;
}

.pui-popup--left {
  right: auto;
}

.pui-popup--right {
  left: auto;
}

.pui-popup__header {
  display: grid;
  grid-template-columns: 112rpx minmax(0, 1fr) 112rpx;
  align-items: start;
  gap: var(--pui-space-sm);
  min-height: 104rpx;
  padding: var(--pui-space-normal) var(--pui-space-normal) var(--pui-space-xs);
}

.pui-popup__actions {
  display: flex;
  align-items: center;
  gap: var(--pui-space-xs);
  min-width: 0;
}

.pui-popup__actions--right {
  justify-content: flex-end;
}

.pui-popup__icon-button {
  display: grid;
  place-items: center;
  width: 48rpx;
  height: 48rpx;
  min-width: 48rpx;
  min-height: 48rpx;
  padding: 0;
  color: var(--pui-text-primary);
  font-size: 30rpx;
  font-weight: 850;
  line-height: 1;
  background: rgba(255, 255, 255, 0.64);
  border: 0;
  border-radius: var(--pui-radius-round);
  box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.72), var(--pui-glass-shadow-soft);
  -webkit-backdrop-filter: var(--pui-frosted-filter);
  backdrop-filter: var(--pui-frosted-filter);
}

.pui-popup__icon-button::after {
  border: 0;
}

.pui-popup__icon-button--check {
  color: var(--pui-color-success);
}

.pui-popup__icon-button--close {
  color: var(--pui-text-secondary);
}

.pui-popup__title-area {
  min-width: 0;
  padding-top: var(--pui-space-step-1);
  text-align: center;
}

.pui-popup__title {
  overflow: hidden;
  color: var(--pui-text-primary);
  font-size: 32rpx;
  font-weight: 850;
  line-height: 40rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pui-popup__subtitle {
  margin-top: var(--pui-space-xxs);
  overflow: hidden;
  color: var(--pui-text-secondary);
  font-size: 22rpx;
  font-weight: 650;
  line-height: 30rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pui-popup__body {
  padding: var(--pui-space-xs) var(--pui-space-lg) var(--pui-space-step-15);
  color: var(--pui-text-secondary);
  font-size: var(--pui-font-size-base);
  line-height: 1.55;
}

[data-pui-theme='dark'] .pui-popup,
.pui-dark .pui-popup {
  background: rgba(30, 31, 36, 0.78);
  border-color: rgba(255, 255, 255, 0.12);
}

[data-pui-theme='dark'] .pui-popup__icon-button,
.pui-dark .pui-popup__icon-button {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.14), var(--pui-glass-shadow-soft);
}

.pui-dropdown-menu {
  position: relative;
}

.pui-dropdown-menu__bar {
  min-height: 72rpx;
  padding: 0 var(--pui-space-step-12);
  background: var(--pui-glass-surface);
  border-radius: var(--pui-radius-medium);
  line-height: 72rpx;
}

.pui-dropdown-menu__panel {
  position: absolute;
  z-index: 2;
  right: 0;
  left: 0;
  margin-top: var(--pui-space-xs);
}

.pui-overlay {
  position: fixed;
  z-index: 999;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.38);
}

.pui-pull-refresh__head {
  padding: var(--pui-space-normal);
  color: var(--pui-color-brand);
  text-align: center;
}

.pui-virtual-list {
  max-height: 420rpx;
  border-radius: var(--pui-radius-large);
}

.pui-sticky__inner {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: var(--pui-space-normal);
  color: var(--pui-color-brand);
  background: var(--pui-glass-surface-strong);
  border-radius: var(--pui-radius-medium);
  box-shadow: var(--pui-shadow-card);
}

.pui-watermark {
  --pui-watermark-mark-b-top: 136rpx;
  --pui-watermark-mark-b-left: 180rpx;
  position: relative;
  min-height: 240rpx;
  overflow: hidden;
}

.pui-watermark__mark {
  position: absolute;
  top: var(--pui-space-xl);
  left: var(--pui-space-normal);
  color: rgba(17, 18, 23, 0.12);
  font-size: 42rpx;
  font-weight: 900;
  transform: rotate(-24deg);
}

.pui-watermark__mark--b {
  top: var(--pui-watermark-mark-b-top);
  left: var(--pui-watermark-mark-b-left);
}
`;
}

let generatedCount = 0;
for (const name of components) {
  if (existing.has(name) || preservedNativeComponents.has(name)) continue;
  const dir = path.join(root, name);
  ensureDir(dir);
  writeGeneratedFile(path.join(dir, `${name}.json`), json(name));
  writeGeneratedFile(path.join(dir, `${name}.js`), js(name));
  writeGeneratedFile(path.join(dir, `${name}.wxml`), wxml(name));
  writeGeneratedFile(path.join(dir, `${name}.wxss`), wxss(name));
  generatedCount += 1;
}

console.log(`Generated ${generatedCount} component directories; preserved maintained native components.`);
