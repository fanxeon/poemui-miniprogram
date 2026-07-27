var themeBehavior = require('../common/behaviors/theme');

function normalizeSize(value) {
  return ['small', 'medium', 'large'].indexOf(value) > -1 ? value : 'medium';
}

function normalizeShape(value) {
  return ['circle', 'round', 'square'].indexOf(value) > -1 ? value : 'circle';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    src: { type: String, value: '' },
    text: { type: String, value: '' },
    alt: { type: String, value: '' },
    icon: { type: String, value: '' },
    shape: { type: String, value: 'circle' },
    size: { type: String, value: 'medium' },
    bordered: { type: Boolean, value: false },
    hideOnLoadFailed: { type: Boolean, value: false },
    useSlot: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rootClass: '',
    rootStyle: '',
    displaySrc: '',
    fallbackText: '',
    iconSize: 36,
    imageFailed: false,
    imageLoaded: false,
    visible: true,
    semanticLabel: '头像',
    motionDuration: 500,
  },
  observers: {
    'src,text,alt,icon,shape,size,bordered,hideOnLoadFailed,useSlot,ariaLabel,reduceMotion,colorScheme': function sync() { this.syncState(); },
  },
  lifetimes: {
    attached: function attached() { this.syncState(); },
    detached: function detached() { this.clearHideTimer(); },
  },
  methods: {
    clearHideTimer: function clearHideTimer() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
    },
    buildRootClass: function buildRootClass(size, shape, leaving) {
      return [
        'pui-avatar',
        this.getColorSchemeClass(),
        'pui-avatar--' + size,
        'pui-avatar--' + shape,
        this.data.bordered ? 'pui-avatar--bordered' : '',
        leaving ? 'pui-avatar--leaving' : '',
      ].filter(Boolean).join(' ');
    },
    syncState: function syncState() {
      this.clearHideTimer();
      var source = this.data.src;
      var fallbackText = (this.data.text || this.data.alt || '?').trim().charAt(0).toUpperCase() || '?';
      var size = normalizeSize(this.data.size);
      var shape = normalizeShape(this.data.shape);
      var duration = this.data.reduceMotion ? 1 : 500;
      var semanticLabel = (this.data.ariaLabel || this.data.alt || this.data.text || this.data.icon || '头像').trim() || '头像';
      this.setData({
        rootClass: this.buildRootClass(size, shape, false),
        rootStyle: '--pui-avatar-duration:' + duration + 'ms;',
        displaySrc: source,
        fallbackText: fallbackText,
        iconSize: size === 'small' ? 28 : (size === 'large' ? 46 : 36),
        imageFailed: false,
        imageLoaded: false,
        visible: true,
        semanticLabel: semanticLabel,
        motionDuration: duration,
      });
    },
    onImageLoad: function onImageLoad() {
      this.setData({ imageLoaded: true });
    },
    onImageError: function onImageError(event) {
      var detail = Object.assign({}, event.detail || {}, { src: this.data.displaySrc });
      this.clearHideTimer();
      if (!this.data.hideOnLoadFailed) {
        this.setData({ imageFailed: true, imageLoaded: false });
        this.triggerEvent('error', detail);
        return;
      }
      var size = normalizeSize(this.data.size);
      var shape = normalizeShape(this.data.shape);
      var duration = this.data.motionDuration;
      this.setData({
        imageFailed: true,
        imageLoaded: false,
        rootClass: this.buildRootClass(size, shape, true),
      });
      this.triggerEvent('error', detail);
      var component = this;
      this.hideTimer = setTimeout(function hideAfterLeave() {
        component.hideTimer = null;
        component.setData({ visible: false });
      }, duration);
    },
  },
});
