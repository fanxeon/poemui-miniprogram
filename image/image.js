var themeBehavior = require('../common/behaviors/theme');

var MODES = ['scaleToFill', 'aspectFit', 'aspectFill', 'widthFix', 'heightFix', 'top', 'bottom', 'center', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'];

function safeDimension(value) {
  var text = String(value || '').trim();
  return /^(?:0|[1-9]\d*(?:\.\d+)?)(?:rpx|px|%)$/.test(text) ? text : '';
}

function normalizeShape(value) {
  return ['rectangle', 'round', 'circle'].indexOf(value) > -1 ? value : 'rectangle';
}

function normalizeMode(value) {
  return MODES.indexOf(value) > -1 ? value : 'aspectFill';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    src: { type: String, value: '' },
    mode: { type: String, value: 'aspectFill' },
    width: { type: String, value: '' },
    height: { type: String, value: '' },
    shape: { type: String, value: 'rectangle' },
    lazy: { type: Boolean, value: false },
    webp: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    error: { type: Boolean, value: false },
    text: { type: String, value: '' },
    showMenuByLongpress: { type: Boolean, value: false },
    showSlot: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rootClass: '',
    rootStyle: '',
    displaySrc: '',
    resolvedMode: 'aspectFill',
    status: 'empty',
    imageStatus: 'empty',
    shouldRenderImage: false,
    imageLoaded: false,
    semanticLabel: '图片',
    forceError: false,
  },
  observers: {
    'src,mode,width,height,shape,lazy,webp,loading,error,text,showMenuByLongpress,showSlot,ariaLabel,reduceMotion,colorScheme': function sync() { this.syncState(); },
  },
  lifetimes: { attached: function attached() { this.syncState(); } },
  methods: {
    buildRootClass: function buildRootClass(shape, status) {
      return [
        'pui-image',
        this.getColorSchemeClass(),
        'pui-image--' + shape,
        'pui-image--' + status,
      ].filter(Boolean).join(' ');
    },
    resolveStatus: function resolveStatus(source, imageStatus) {
      if (this.data.error) return 'error';
      if (this.data.loading) return 'loading';
      if (!source) return 'empty';
      return imageStatus === 'error' ? 'error' : (imageStatus === 'loaded' ? 'loaded' : 'loading');
    },
    syncState: function syncState() {
      var source = this.data.src;
      var sourceChanged = source !== this.data.displaySrc;
      var forceErrorReleased = this.data.forceError && !this.data.error;
      var imageStatus = this.data.imageStatus;
      var imageLoaded = this.data.imageLoaded;
      if (sourceChanged || forceErrorReleased) {
        imageStatus = source ? 'loading' : 'empty';
        imageLoaded = false;
      }
      var status = this.resolveStatus(source, imageStatus);
      var shape = normalizeShape(this.data.shape);
      var duration = this.data.reduceMotion ? 1 : 500;
      var width = safeDimension(this.data.width);
      var height = safeDimension(this.data.height);
      var style = '--pui-image-duration:' + duration + 'ms;';
      if (width) style += 'width:' + width + ';';
      if (height) style += 'height:' + height + ';';
      this.setData({
        rootClass: this.buildRootClass(shape, status),
        rootStyle: style,
        displaySrc: source,
        resolvedMode: normalizeMode(this.data.mode),
        status: status,
        imageStatus: imageStatus,
        shouldRenderImage: !!source && status !== 'error',
        imageLoaded: imageLoaded,
        semanticLabel: (this.data.ariaLabel || this.data.text || '图片').trim() || '图片',
        forceError: !!this.data.error,
      });
    },
    onLoad: function onLoad(event) {
      var shape = normalizeShape(this.data.shape);
      var status = this.resolveStatus(this.data.displaySrc, 'loaded');
      this.setData({
        imageStatus: 'loaded',
        imageLoaded: true,
        status: status,
        rootClass: this.buildRootClass(shape, status),
      });
      this.triggerEvent('load', Object.assign({}, event.detail || {}, { src: this.data.displaySrc }));
    },
    onError: function onError(event) {
      var shape = normalizeShape(this.data.shape);
      var status = this.resolveStatus(this.data.displaySrc, 'error');
      this.setData({
        imageStatus: 'error',
        imageLoaded: false,
        status: status,
        shouldRenderImage: false,
        rootClass: this.buildRootClass(shape, status),
      });
      this.triggerEvent('error', Object.assign({}, event.detail || {}, { src: this.data.displaySrc }));
    },
  },
});
