var themeBehavior = require('../common/behaviors/theme');
var platformInfo = require('../common/utils/platform-info');

var PLACEMENTS = ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'];
var LEGACY_PLACEMENTS = {
  'top-left': 'top-start', 'top-right': 'top-end', 'bottom-left': 'bottom-start', 'bottom-right': 'bottom-end',
  'left-top': 'left-start', 'left-bottom': 'left-end', 'right-top': 'right-start', 'right-bottom': 'right-end',
};

function isControlled(data) { return data.visible !== null && data.visible !== undefined; }
function nextTick(callback) {
  if (typeof wx !== 'undefined' && wx.nextTick) wx.nextTick(callback);
  else setTimeout(callback, 0);
}
function placementOf(value) {
  var next = LEGACY_PLACEMENTS[value] || value;
  return PLACEMENTS.indexOf(next) > -1 ? next : 'top';
}
function oppositePlacement(value) {
  var placement = placementOf(value);
  if (placement.indexOf('top') === 0) return placement.replace('top', 'bottom');
  if (placement.indexOf('bottom') === 0) return placement.replace('bottom', 'top');
  if (placement.indexOf('left') === 0) return placement.replace('left', 'right');
  return placement.replace('right', 'left');
}
function sideOf(value) { return placementOf(value).split('-')[0]; }
function horizontalAvailable(placement, reference, viewport) {
  var gap = 8;
  return sideOf(placement) === 'left'
    ? Math.max(0, Math.floor(reference.left - gap))
    : Math.max(0, Math.floor(viewport.width - reference.right - gap));
}
function viewportSize() {
  var info = platformInfo.getWindowInfo();
  return { width: Number(info && (info.windowWidth || info.screenWidth)) || 375, height: Number(info && (info.windowHeight || info.screenHeight)) || 667 };
}
function resolvedPlacement(value, reference, panel, viewport, fits) {
  var requested = placementOf(value);
  var requestedSide = sideOf(requested);
  /* Keep a requested horizontal direction whenever that side can preserve the
     minimum readable Surface. The measured width is published only as an
     internal CSS variable: callers still have no width/offset API. */
  if (requestedSide === 'left' || requestedSide === 'right') {
    var requestedWidth = horizontalAvailable(requested, reference, viewport);
    if (requestedWidth > 0) {
      return { placement: requested, sideWidth: Math.min(panel.width, requestedWidth) };
    }
    var oppositeHorizontal = oppositePlacement(requested);
    var oppositeWidth = horizontalAvailable(oppositeHorizontal, reference, viewport);
    if (oppositeWidth > 0) {
      return { placement: oppositeHorizontal, sideWidth: Math.min(panel.width, oppositeWidth) };
    }
    var top = 'top';
    var bottom = 'bottom';
    if (fits(top, reference, panel, viewport)) return { placement: top, sideWidth: 0 };
    if (fits(bottom, reference, panel, viewport)) return { placement: bottom, sideWidth: 0 };
    return { placement: reference.top > viewport.height - reference.bottom ? top : bottom, sideWidth: 0 };
  }
  if (fits(requested, reference, panel, viewport)) return requested;
  var opposite = oppositePlacement(requested);
  if (fits(opposite, reference, panel, viewport)) return opposite;
  return { placement: opposite, sideWidth: 0 };
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, addGlobalClass: true, styleIsolation: 'shared' },
  properties: {
    visible: { type: null, value: null },
    defaultVisible: { type: Boolean, value: false },
    content: { type: String, value: '' },
    placement: { type: String, value: 'top' },
    showArrow: { type: Boolean, value: true },
    theme: { type: String, value: 'dark' },
    closeOnClickOutside: { type: Boolean, value: true },
    fixed: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '气泡浮层' },
    reduceMotion: { type: Boolean, value: false },
  },
  data: {
    rendered: false,
    active: false,
    placementClass: 'top',
    panelClass: 'pui-popover__panel pui-popover__panel--top pui-popover__panel--dark pui-popover__panel--arrow',
    panelStyle: '--pui-popover-duration:500ms;--pui-popover-ease:var(--pui-ease-standard);z-index:11500;',
    fixedStyle: '',
    sideWidth: 0,
    semanticLabel: '气泡浮层',
  },
  observers: {
    visible: function observeVisible() { this.syncVisibility(false); },
    placement: function observePlacement() {
      this._resolvedPlacement = placementOf(this.data.placement);
      this.setData({ sideWidth: 0 });
      this.syncPresentation();
      if (this.data.rendered) this.scheduleMeasure();
    },
    'showArrow,theme,fixed,ariaLabel,content,reduceMotion,colorScheme': function observePresentation() {
      this.syncPresentation();
      if (this.data.rendered) this.scheduleMeasure();
    },
  },
  lifetimes: {
    attached: function attached() {
      this._ready = true;
      this._innerVisible = Boolean(this.data.defaultVisible);
      this.syncPresentation();
      this.syncVisibility(true);
    },
    detached: function detached() {
      this._ready = false;
      clearTimeout(this._enterTimer);
      clearTimeout(this._leaveTimer);
      clearTimeout(this._measureTimer);
    },
  },
  methods: {
    motionDuration: function motionDuration() { return this.data.reduceMotion ? 1 : 500; },
    themeOf: function themeOf(value) {
      return ['dark', 'light', 'brand', 'success', 'warning', 'error'].indexOf(value) > -1 ? value : 'dark';
    },
    syncPresentation: function syncPresentation() {
      var placement = this._resolvedPlacement || placementOf(this.data.placement);
      var duration = this.motionDuration();
      this.setData({
        placementClass: placement,
        panelClass: [
          'pui-popover__panel', 'pui-popover__panel--' + placement,
          'pui-popover__panel--' + this.themeOf(this.data.theme),
          this.data.showArrow ? 'pui-popover__panel--arrow' : '',
          this.data.fixed ? 'pui-popover__panel--fixed' : '',
          this.data.active ? 'pui-popover__panel--active' : '',
        ].filter(Boolean).join(' '),
        panelStyle: '--pui-popover-duration:' + duration + 'ms;--pui-popover-ease:var(--pui-ease-standard);z-index:11500;' + (this.data.sideWidth > 0 ? '--pui-popover-side-width:' + this.data.sideWidth + 'px;' : ''),
        semanticLabel: String(this.data.ariaLabel || this.data.content || '气泡浮层'),
      });
    },
    syncVisibility: function syncVisibility(initial) {
      if (!this._ready) return;
      var visible = isControlled(this.data) ? Boolean(this.data.visible) : Boolean(this._innerVisible);
      if (visible === this._effectiveVisible && !initial) return;
      this._effectiveVisible = visible;
      this.transitionTo(visible);
    },
    transitionTo: function transitionTo(visible) {
      var self = this;
      var duration = this.motionDuration();
      clearTimeout(this._enterTimer);
      clearTimeout(this._leaveTimer);
      if (visible) {
        this.setData({ rendered: true, active: false }, function mounted() {
          self.syncPresentation();
          self.scheduleMeasure();
          nextTick(function enter() {
            if (!self._ready || !self._effectiveVisible) return;
            self.setData({ active: true }, function active() {
              self.syncPresentation();
              self.scheduleMeasure();
            });
          });
        });
        return;
      }
      if (!this.data.rendered) {
        this.setData({ active: false, fixedStyle: '', sideWidth: 0 });
        this.syncPresentation();
        return;
      }
      this.setData({ active: false }, function leaving() {
        self.syncPresentation();
        self._leaveTimer = setTimeout(function unmount() {
          if (!self._ready || self._effectiveVisible) return;
          self.setData({ rendered: false, fixedStyle: '', sideWidth: 0 });
        }, duration);
      });
    },
    requestVisibility: function requestVisibility(visible) {
      var next = Boolean(visible);
      var current = isControlled(this.data) ? Boolean(this.data.visible) : Boolean(this._innerVisible);
      if (current === next) return false;
      if (!isControlled(this.data)) {
        this._innerVisible = next;
        this._effectiveVisible = next;
        this.transitionTo(next);
      }
      this.triggerEvent('visible-change', { visible: next });
      return true;
    },
    onOutsideTap: function onOutsideTap() {
      if (!this.data.closeOnClickOutside) return false;
      return this.requestVisibility(false);
    },
    scheduleMeasure: function scheduleMeasure() {
      var self = this;
      clearTimeout(this._measureTimer);
      this._measureTimer = setTimeout(function measureLater() {
        if (self._ready && self.data.rendered) self.measurePosition();
      }, 16);
    },
    fitsPlacement: function fitsPlacement(placement, reference, panel, viewport) {
      var gap = 8;
      var side = sideOf(placement);
      if (side === 'top') return reference.top - panel.height - gap >= 0;
      if (side === 'bottom') return reference.bottom + panel.height + gap <= viewport.height;
      if (side === 'left') return reference.left - panel.width - gap >= 0;
      return reference.right + panel.width + gap <= viewport.width;
    },
    fixedCoordinates: function fixedCoordinates(placement, reference, panel) {
      var gap = 8;
      var side = sideOf(placement);
      var align = placement.split('-')[1] || 'center';
      var top = reference.top;
      var left = reference.left;
      if (side === 'top') top = reference.top - panel.height - gap;
      if (side === 'bottom') top = reference.bottom + gap;
      if (side === 'left') left = reference.left - panel.width - gap;
      if (side === 'right') left = reference.right + gap;
      if (side === 'top' || side === 'bottom') {
        if (align === 'center') left = reference.left + (reference.width - panel.width) / 2;
        if (align === 'end') left = reference.right - panel.width;
      } else {
        if (align === 'center') top = reference.top + (reference.height - panel.height) / 2;
        if (align === 'end') top = reference.bottom - panel.height;
      }
      return { top: Math.max(0, Math.round(top)), left: Math.max(0, Math.round(left)) };
    },
    measurePosition: function measurePosition() {
      var self = this;
      var query = this.createSelectorQuery();
      query.select('.pui-popover__reference').boundingClientRect();
      query.select('.pui-popover__panel').boundingClientRect();
      query.exec(function complete(result) {
        if (!self._ready || !self.data.rendered) return;
        var reference = result && result[0];
        var panel = result && result[1];
        if (!reference || !panel) return;
        var resolved = resolvedPlacement(self.data.placement, reference, panel, viewportSize(), self.fitsPlacement.bind(self));
        var actual = typeof resolved === 'string' ? resolved : resolved.placement;
        var sideWidth = typeof resolved === 'string' ? 0 : resolved.sideWidth;
        var positionedPanel = sideWidth > 0 ? { width: sideWidth, height: panel.height } : panel;
        var fixedStyle = '';
        if (self.data.fixed) {
          var point = self.fixedCoordinates(actual, reference, positionedPanel);
          fixedStyle = 'top:' + point.top + 'px;left:' + point.left + 'px;';
        }
        if (actual === self.data.placementClass && fixedStyle === self.data.fixedStyle && sideWidth === self.data.sideWidth) return;
        self._resolvedPlacement = actual;
        self.setData({ placementClass: actual, fixedStyle: fixedStyle, sideWidth: sideWidth }, function positioned() {
          self.syncPresentation();
        });
      });
    },
    noop: function noop() {},
  },
});
