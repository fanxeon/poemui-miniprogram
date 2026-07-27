var createPageScrollBehavior = require('../common/behaviors/page-scroll');

function number(value, fallback) {
  var result = Number(value);
  return isFinite(result) ? result : fallback;
}

function createRectQuery(instance, selector, callback) {
  if (!instance || typeof instance.createSelectorQuery !== 'function') {
    callback(null);
    return;
  }
  var query = instance.createSelectorQuery();
  query.select(selector).boundingClientRect();
  query.exec(function receive(result) {
    callback(result && result[0] ? result[0] : null);
  });
}

Component({
  behaviors: [createPageScrollBehavior('onPageScroll')],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  externalClasses: ['pui-class', 'pui-class-content'],
  properties: {
    container: { type: null, value: null },
    disabled: { type: Boolean, value: false },
    offsetTop: { type: null, value: 0 },
    zIndex: { type: Number, value: 99 }
  },
  data: {
    containerStyle: '',
    contentStyle: '',
    isFixed: false
  },
  observers: {
    'container,disabled,offsetTop,zIndex': function syncSticky() {
      this.onPageScroll();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._stickyScrollTop = 0;
      this.onPageScroll();
    }
  },
  methods: {
    onPageScroll: function onPageScroll(event) {
      var detail = event || {};
      if (isFinite(Number(detail.scrollTop))) this._stickyScrollTop = Number(detail.scrollTop);
      if (this.data.disabled) {
        this.applyPosition({ isFixed: false, transform: 0, height: 0 });
        return;
      }

      var self = this;
      createRectQuery(this, '.pui-sticky', function receiveRoot(rootRect) {
        if (!rootRect) return;
        var container = self.data.container;
        if (typeof container !== 'function') {
          self.resolvePosition(rootRect, null);
          return;
        }
        var nodesRef;
        try {
          nodesRef = container.call(self);
        } catch (error) {
          return;
        }
        if (!nodesRef || typeof nodesRef.boundingClientRect !== 'function') {
          self.resolvePosition(rootRect, null);
          return;
        }
        nodesRef.boundingClientRect(function receiveContainer(containerRect) {
          self.resolvePosition(rootRect, containerRect || null);
        }).exec();
      });
    },
    resolvePosition: function resolvePosition(rootRect, containerRect) {
      var offsetTop = number(this.data.offsetTop, 0);
      var result = { isFixed: false, height: 0, transform: 0 };
      if (containerRect) {
        if (offsetTop + number(rootRect.height, 0) > number(containerRect.height, 0) + number(containerRect.top, 0)) {
          result.transform = number(containerRect.height, 0) - number(rootRect.height, 0);
        } else if (offsetTop >= number(rootRect.top, 0)) {
          result.isFixed = true;
          result.height = number(rootRect.height, 0);
        }
      } else if (offsetTop >= number(rootRect.top, 0)) {
        result.isFixed = true;
        result.height = number(rootRect.height, 0);
      }
      this.applyPosition(result);
    },
    applyPosition: function applyPosition(result) {
      var isFixed = !!result.isFixed;
      var height = Math.max(0, number(result.height, 0));
      var transform = number(result.transform, 0);
      var offsetTop = number(this.data.offsetTop, 0);
      var zIndex = number(this.data.zIndex, 99);
      var containerStyle = isFixed ? 'height:' + height + 'px;' : '';
      var contentStyle = '';
      if (isFixed) contentStyle += 'position:fixed;top:' + offsetTop + 'px;left:0;right:0;';
      if (transform) contentStyle += 'transform:translate3d(0,' + transform + 'px,0);';
      if (this.data.containerStyle === containerStyle && this.data.contentStyle === contentStyle && this.data.isFixed === isFixed) {
        this.triggerEvent('scroll', { scrollTop: this._stickyScrollTop || 0, isFixed: isFixed });
        return;
      }
      var self = this;
      this.setData({
        containerStyle: containerStyle,
        contentStyle: contentStyle,
        isFixed: isFixed,
        zIndex: zIndex
      }, function afterPosition() {
        self.triggerEvent('scroll', { scrollTop: self._stickyScrollTop || 0, isFixed: isFixed });
      });
    }
  }
});
