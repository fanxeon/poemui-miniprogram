var themeBehavior = require('../common/behaviors/theme');

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function normalizeDelay(value, fallback) {
  var delay = Number(value);
  if (!isFinite(delay)) delay = fallback;
  return Math.max(0, Math.min(1000, Math.round(delay)));
}

function normalizeLoadingProps(value, size) {
  var source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  var defaultSize = size === 'extra-small' ? '22rpx' : size === 'small' ? '26rpx' : size === 'large' ? '38rpx' : '32rpx';
  return {
    size: source.size || defaultSize,
    theme: normalizeEnum(source.theme, ['circular', 'dots'], 'circular'),
    text: source.text || '',
    ariaLabel: source.ariaLabel || '按钮加载中'
  };
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    theme: { type: String, value: 'default' },
    variant: { type: String, value: 'base' },
    surface: { type: String, value: 'default' },
    content: { type: String, value: '' },
    size: { type: String, value: 'medium' },
    shape: { type: String, value: 'rectangle' },
    block: { type: Boolean, value: false },
    icon: { type: null, value: null },
    iconOnly: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadingProps: { type: Object, value: {} },
    disabled: { type: Boolean, value: false },
    openType: { type: String, value: '' },
    formType: { type: String, value: '' },
    lang: { type: String, value: 'en' },
    sessionFrom: { type: String, value: '' },
    sendMessageTitle: { type: String, value: '' },
    sendMessagePath: { type: String, value: '' },
    sendMessageImg: { type: String, value: '' },
    showMessageCard: { type: Boolean, value: false },
    appParameter: { type: String, value: '' },
    hoverClass: { type: String, value: 'pui-button--hover' },
    hoverStartTime: { type: Number, value: 20 },
    hoverStayTime: { type: Number, value: 70 },
    hoverStopPropagation: { type: Boolean, value: false },
    phoneNumberNoQuotaToast: { type: Boolean, value: true },
    activityType: { type: null, value: null },
    entrancePath: { type: String, value: '' },
    needShowEntrance: { type: Boolean, value: true },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rootClass: '',
    rootStyle: '',
    buttonLabel: '按钮',
    normalizedFormType: '',
    normalizedLang: 'en',
    normalizedHoverClass: 'pui-button--hover',
    normalizedHoverStartTime: 20,
    normalizedHoverStayTime: 70,
    normalizedActivityType: '',
    interactive: true,
    loadingSize: '32rpx',
    iconSize: 32,
    loadingTheme: 'circular',
    loadingText: '',
    loadingAriaLabel: '按钮加载中'
  },
  observers: {
    'theme,variant,surface,content,size,shape,block,icon,iconOnly,loading,loadingProps,disabled,openType,formType,lang,hoverClass,hoverStartTime,hoverStayTime,activityType,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() { this.syncState(); }
  },
  methods: {
    syncState: function syncState() {
      var theme = normalizeEnum(this.data.theme, ['default', 'primary', 'danger'], 'default');
      var variant = normalizeEnum(this.data.variant, ['base', 'outline', 'text', 'ghost', 'transparent'], 'base');
      var surface = normalizeEnum(this.data.surface, ['default', 'transparent'], 'default');
      var size = normalizeEnum(this.data.size, ['extra-small', 'small', 'medium', 'large'], 'medium');
      var shape = normalizeEnum(this.data.shape, ['rectangle', 'square', 'round', 'circle'], 'rectangle');
      var loading = normalizeLoadingProps(this.data.loadingProps, size);
      var interactive = !this.data.disabled && !this.data.loading;
      var activityType = this.data.activityType === null || this.data.activityType === undefined || this.data.activityType === '' ? '' : Number(this.data.activityType);
      if (activityType !== '' && !isFinite(activityType)) activityType = '';
      var rootStyle = [];
      if (this.data.block) rootStyle.push('display:flex;width:100%;min-width:0;max-width:100%;flex:1 1 100%;align-self:stretch;');
      if (this.data.iconOnly) {
        rootStyle.push('width:var(--pui-button-size);min-width:var(--pui-button-size);max-width:var(--pui-button-size);height:var(--pui-button-size);min-height:var(--pui-button-size);padding:0;flex:0 0 var(--pui-button-size);');
        if (shape === 'circle' || shape === 'round') rootStyle.push('border-radius:var(--pui-radius-round);');
      }
      if (this.data.reduceMotion) rootStyle.push('--pui-button-duration:1ms;--pui-button-ease:linear;');
      this.setData({
        rootClass: [
          'pui-button',
          this.getColorSchemeClass(),
          'pui-button--' + theme,
          'pui-button--' + variant,
          'pui-button--surface-' + surface,
          'pui-button--' + size,
          'pui-button--' + shape,
          this.data.iconOnly ? 'pui-button--icon-only' : '',
          this.data.block ? 'pui-button--block' : '',
          this.data.disabled ? 'pui-button--disabled' : '',
          this.data.loading ? 'pui-button--loading' : ''
        ].filter(Boolean).join(' '),
        rootStyle: rootStyle.join(''),
        buttonLabel: String(this.data.ariaLabel || '').trim() || String(this.data.content || '').trim() || (this.data.loading ? loading.ariaLabel : '按钮'),
        normalizedFormType: normalizeEnum(this.data.formType, ['', 'submit', 'reset'], ''),
        normalizedLang: normalizeEnum(this.data.lang, ['en', 'zh_CN', 'zh_TW'], 'en'),
        normalizedHoverClass: String(this.data.hoverClass || 'none'),
        normalizedHoverStartTime: normalizeDelay(this.data.hoverStartTime, 20),
        normalizedHoverStayTime: normalizeDelay(this.data.hoverStayTime, 70),
        normalizedActivityType: activityType,
        interactive: interactive,
        loadingSize: loading.size,
        iconSize: size === 'extra-small' ? 22 : size === 'small' ? 26 : size === 'large' ? 38 : 32,
        loadingTheme: loading.theme,
        loadingText: loading.text,
        loadingAriaLabel: loading.ariaLabel
      });
    },
    buildClickDetail: function buildClickDetail(event) {
      return Object.assign({}, event && event.detail ? event.detail : {}, { source: 'button' });
    },
    onTap: function onTap(event) {
      if (!this.data.interactive) return;
      this.triggerEvent('click', this.buildClickDetail(event), {
        bubbles: true,
        composed: true,
      });
    },
    forwardGetUserInfo: function forwardGetUserInfo(event) { this.triggerEvent('getuserinfo', event.detail || {}); },
    forwardContact: function forwardContact(event) { this.triggerEvent('contact', event.detail || {}); },
    forwardCreateLiveActivity: function forwardCreateLiveActivity(event) { this.triggerEvent('createliveactivity', event.detail || {}); },
    forwardGetPhoneNumber: function forwardGetPhoneNumber(event) { this.triggerEvent('getphonenumber', event.detail || {}); },
    forwardGetRealtimePhoneNumber: function forwardGetRealtimePhoneNumber(event) { this.triggerEvent('getrealtimephonenumber', event.detail || {}); },
    forwardError: function forwardError(event) { this.triggerEvent('error', event.detail || {}); },
    forwardOpenSetting: function forwardOpenSetting(event) { this.triggerEvent('opensetting', event.detail || {}); },
    forwardLaunchApp: function forwardLaunchApp(event) { this.triggerEvent('launchapp', event.detail || {}); },
    forwardChooseAvatar: function forwardChooseAvatar(event) { this.triggerEvent('chooseavatar', event.detail || {}); },
    forwardAgreePrivacyAuthorization: function forwardAgreePrivacyAuthorization(event) { this.triggerEvent('agreeprivacyauthorization', event.detail || {}); },
    forwardPhoneOneClickLogin: function forwardPhoneOneClickLogin(event) { this.triggerEvent('phoneoneclicklogin', event.detail || {}); }
  }
});
