var themeBehavior = require('../common/behaviors/theme');

function normalizeHeight(value) {
  var raw = String(value === undefined || value === null ? '' : value).trim();
  var unitless = raw.match(/^(\d+(?:\.\d+)?)$/);
  if (unitless && Number(unitless[1]) > 0) return Math.max(1, Math.round(Number(unitless[1]))) + 'rpx';
  var dimension = raw.match(/^(\d+(?:\.\d+)?)(rpx|px)$/);
  if (dimension && Number(dimension[1]) > 0) return raw;
  return '320rpx';
}

function normalizeTarget(value) {
  return String(value === undefined || value === null ? '' : value).trim();
}

function normalizeScrollTop(value) {
  var number = Number(value);
  if (!isFinite(number)) return 0;
  return Math.max(0, number);
}

function normalizeGradientOverlayColor(value) {
  var color = String(value === undefined || value === null ? '' : value).trim();
  if (/^(#[0-9a-fA-F]{3,8}|rgba?\([0-9.,%\s]+\)|var\(--[\w-]+\))$/.test(color)) return color;
  return 'var(--pui-scroll-area-gradient-overlay-color-context)';
}

function normalizeGradientOverlaySize(value) {
  var size = String(value === undefined || value === null ? '' : value).trim().toLowerCase();
  return ['sm', 'md', 'lg'].indexOf(size) >= 0 ? size : 'md';
}

function normalizeContentPaddingBottom(value) {
  var raw = String(value === undefined || value === null ? '' : value).trim().toLowerCase();
  if (raw === '0') return '0';
  var unitless = raw.match(/^(\d+(?:\.\d+)?)$/);
  if (unitless) return Math.max(0, Math.round(Number(unitless[1]))) + 'rpx';
  var dimension = raw.match(/^(\d+(?:\.\d+)?)(rpx|px|vh)$/);
  if (dimension) return raw;
  return '10vh';
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    height: { type: String, value: '320rpx' },
    scrollTop: { type: Number, value: 0 },
    scrollIntoView: { type: String, value: '' },
    gradientOverlay: { type: Boolean, value: true },
    gradientOverlayColor: { type: String, value: '' },
    gradientOverlaySize: { type: String, value: 'md' },
    contentPaddingBottom: { type: String, value: '10vh' },
    ariaLabel: { type: String, value: '滚动内容' }
  },
  data: {
    rootClass: 'pui-scroll-area',
    rootStyle: '',
    viewportStyle: '',
    contentStyle: 'padding-bottom:10vh;',
    semanticLabel: '滚动内容',
    targetScrollTop: 0,
    targetId: '',
    showGradientOverlay: true,
    showTopGradient: false,
    showBottomGradient: false,
    gradientOverlayStyle: ''
  },
  observers: {
    'height,scrollIntoView,gradientOverlay,gradientOverlayColor,gradientOverlaySize,contentPaddingBottom,ariaLabel,colorScheme': function syncScrollArea() { this.syncState(); },
    scrollTop: function syncControlledScrollTop() { this.syncControlledScrollTop(); }
  },
  lifetimes: {
    attached: function attached() { this.syncState(); },
    ready: function ready() { this.syncGradientEdgeState(); },
    detached: function detached() { this.disconnectGradientObserver(); }
  },
  methods: {
    syncState: function syncState() {
      var enabled = this.data.gradientOverlay !== false;
      this.setData({
        rootClass: ['pui-scroll-area', this.getColorSchemeClass()].filter(Boolean).join(' '),
        rootStyle: 'height:' + normalizeHeight(this.data.height) + ';',
        viewportStyle: 'height:100%;',
        contentStyle: 'padding-bottom:' + normalizeContentPaddingBottom(this.data.contentPaddingBottom) + ';',
        semanticLabel: (this.data.ariaLabel || '滚动内容').trim() || '滚动内容',
        targetScrollTop: normalizeScrollTop(this.data.scrollTop),
        targetId: normalizeTarget(this.data.scrollIntoView),
        showGradientOverlay: enabled,
        showTopGradient: false,
        showBottomGradient: false,
        gradientOverlayStyle: '--pui-scroll-area-gradient-overlay-color:' + normalizeGradientOverlayColor(this.data.gradientOverlayColor) + ';--pui-scroll-area-gradient-overlay-size:var(--pui-scroll-area-gradient-overlay-size-' + normalizeGradientOverlaySize(this.data.gradientOverlaySize) + ');'
      });
      if (this._isReady) this.syncGradientEdgeState();
    },
    syncControlledScrollTop: function syncControlledScrollTop() {
      var targetScrollTop = normalizeScrollTop(this.data.scrollTop);
      // 父级把当前用户手势位置原样回写时，不再重新下发 scroll-top，
      // 否则 enhanced scroll-view 会在每一帧被受控定位抢走惯性。
      if (targetScrollTop === this._lastEmittedScrollTop) return;
      if (targetScrollTop === this.data.targetScrollTop) {
        // 用户从当前位置请求回到初始 target（常见为 BackTop -> 0）时，
        // 先无视觉跳变地重放当前位置，再下发目标，保证同值目标也能真实执行。
        if (isFinite(this._lastEmittedScrollTop) && this._lastEmittedScrollTop !== targetScrollTop) {
          this.setData({ targetScrollTop: this._lastEmittedScrollTop }, function replayControlledTarget() {
            this.setData({ targetScrollTop: targetScrollTop });
          });
        }
        return;
      }
      this.setData({ targetScrollTop: targetScrollTop });
    },
    syncGradientEdgeState: function syncGradientEdgeState() {
      this._isReady = true;
      this.disconnectGradientObserver();
      if (this.data.gradientOverlay === false) return;
      this.measureViewport();
      if (typeof this.createIntersectionObserver !== 'function') return;
      var self = this;
      var observer = this.createIntersectionObserver({ thresholds: [0, 0.01] });
      observer.relativeTo('.pui-scroll-area__viewport').observe('.pui-scroll-area__edge-sentinel--bottom', function onBottomEdge(result) {
        if (!self.data.showGradientOverlay) return;
        self.setGradientEdges(self._lastScrollTop > 1, !(result && result.intersectionRatio > 0));
      });
      this._gradientObserver = observer;
    },
    disconnectGradientObserver: function disconnectGradientObserver() {
      if (this._gradientObserver && typeof this._gradientObserver.disconnect === 'function') this._gradientObserver.disconnect();
      this._gradientObserver = null;
    },
    measureViewport: function measureViewport() {
      if (typeof this.createSelectorQuery !== 'function') return;
      var self = this;
      this.createSelectorQuery().select('.pui-scroll-area__viewport').boundingClientRect(function onViewportRect(rect) {
        self._viewportHeight = rect && Number(rect.height) > 0 ? Number(rect.height) : 0;
        self.syncGradientEdgesFromScroll();
      }).exec();
    },
    setGradientEdges: function setGradientEdges(top, bottom) {
      var nextTop = Boolean(this.data.showGradientOverlay && top);
      var nextBottom = Boolean(this.data.showGradientOverlay && bottom);
      if (nextTop === this.data.showTopGradient && nextBottom === this.data.showBottomGradient) return;
      this.setData({ showTopGradient: nextTop, showBottomGradient: nextBottom });
    },
    syncGradientEdgesFromScroll: function syncGradientEdgesFromScroll() {
      var top = Number(this._lastScrollTop) > 1;
      var bottom = this.data.showBottomGradient;
      if (Number(this._lastScrollHeight) > 0 && Number(this._viewportHeight) > 0) {
        bottom = Number(this._lastScrollTop) + Number(this._viewportHeight) < Number(this._lastScrollHeight) - 1;
      }
      this.setGradientEdges(top, bottom);
    },
    onViewportScroll: function onViewportScroll(event) {
      var detail = event && event.detail ? event.detail : {};
      this._lastScrollTop = Math.max(0, Number(detail.scrollTop) || 0);
      this._lastScrollHeight = Math.max(0, Number(detail.scrollHeight) || 0);
      this._lastEmittedScrollTop = this._lastScrollTop;
      this.syncGradientEdgesFromScroll();
      this.triggerEvent('scroll', { scrollTop: this._lastScrollTop, scrollHeight: this._lastScrollHeight });
    },
    onViewportScrollToLower: function onViewportScrollToLower() {
      this.setGradientEdges(Number(this._lastScrollTop) > 1, false);
    }
  }
});
