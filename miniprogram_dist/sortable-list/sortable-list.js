var themeBehavior = require('../common/behaviors/theme');
var sortableData = require('../common/utils/sortable-list-data');

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function normalizeDuration(value, reduceMotion) {
  if (reduceMotion) return 1;
  var duration = Number(value);
  if (!isFinite(duration)) duration = 300;
  return Math.max(0, Math.min(1000, duration));
}

function normalizeLength(value, fallback) {
  if (typeof value === 'number' && isFinite(value) && value > 0) return value + 'rpx';
  var text = String(value === undefined || value === null ? '' : value).trim();
  if (/^\d+(?:\.\d+)?(?:rpx|px|vh)$/.test(text)) return text;
  return fallback;
}

function pointY(event) {
  var list = event && (event.touches && event.touches.length ? event.touches : event.changedTouches);
  var point = list && list[0];
  return point ? Number(point.clientY) : NaN;
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    items: { type: Array, value: [] },
    itemKey: { type: String, value: 'key' },
    disabledKeys: { type: Array, value: [] },
    dragFrom: { type: String, value: 'handle' },
    height: { type: null, value: '560rpx' },
    bordered: { type: Boolean, value: true },
    animated: { type: Boolean, value: true },
    duration: { type: Number, value: 300 },
    ariaLabel: { type: String, value: '可排序列表' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    normalizedItems: [],
    dragging: false,
    activeIndex: -1,
    targetIndex: -1,
    scrollTop: 0,
    rootClass: 'pui-sortable-list',
    rootStyle: '',
    semanticLabel: '可排序列表，共 0 项'
  },
  observers: {
    'items,itemKey,disabledKeys,dragFrom,height,bordered,animated,duration,ariaLabel,reduceMotion,colorScheme': function sync() {
      this.syncState();
    }
  },
  lifetimes: {
    attached: function attached() {
      this._attached = true;
      this.syncState();
    },
    detached: function detached() {
      this._attached = false;
      this._stopAutoScroll();
    }
  },
  methods: {
    syncState: function syncState() {
      var items = sortableData.normalizeItems(this.data.items, this.data.itemKey, this.data.disabledKeys);
      var dragFrom = normalizeEnum(this.data.dragFrom, ['handle', 'item'], 'handle');
      var duration = normalizeDuration(this.data.duration, this.data.reduceMotion);
      this._sourceItems = items;
      if (!this.data.dragging) {
        this.setData({
          normalizedItems: items,
          activeIndex: -1,
          targetIndex: -1
        });
      }
      this.setData({
        semanticLabel: String(this.data.ariaLabel || '可排序列表') + '，共 ' + items.length + ' 项',
        rootClass: [
          'pui-sortable-list',
          this.getColorSchemeClass(),
          'pui-sortable-list--drag-' + dragFrom,
          this.data.bordered ? 'pui-sortable-list--bordered' : '',
          this.data.animated === false ? 'pui-sortable-list--static' : '',
          this.data.reduceMotion ? 'pui-sortable-list--reduced-motion' : ''
        ].filter(Boolean).join(' '),
        rootStyle: '--pui-sortable-list-height:' + normalizeLength(this.data.height, '560rpx') + ';--pui-sortable-list-duration:' + duration + 'ms;'
      });
    },

    onScroll: function onScroll(event) {
      var top = Math.max(0, Number(event && event.detail && event.detail.scrollTop) || 0);
      this._scrollTop = top;
      if (this.data.dragging) this.setData({ scrollTop: top });
      this.triggerEvent('scroll', { scrollTop: top, dragging: this.data.dragging });
    },

    onItemLongPress: function onItemLongPress(event) {
      if (this.data.dragFrom !== 'item') return;
      this._startFromEvent(event);
    },

    onHandleLongPress: function onHandleLongPress(event) {
      if (this.data.dragFrom !== 'handle') return;
      this._startFromEvent(event);
    },

    _startFromEvent: function startFromEvent(event) {
      var index = Number(event && event.currentTarget && event.currentTarget.dataset.index);
      var item = this.data.normalizedItems[index];
      if (!item || item.disabled || this.data.dragging) return false;
      this._dragPointerY = pointY(event);
      this._measureRows(function measured(rows, viewport) {
        if (!this._attached || !rows[index]) return;
        this._rowRects = rows;
        this._viewportRect = viewport;
        this.setData({ dragging: true, activeIndex: index, targetIndex: index });
        this.triggerEvent('dragstart', { index: index, item: sortableData.publicItems([item])[0] });
      }.bind(this));
      return true;
    },

    _measureRows: function measureRows(callback) {
      var query = typeof this.createSelectorQuery === 'function' ? this.createSelectorQuery() : null;
      if (!query && typeof wx !== 'undefined' && wx.createSelectorQuery) query = wx.createSelectorQuery().in(this);
      if (!query) return;
      query
        .selectAll('.pui-sortable-list__item')
        .boundingClientRect()
        .select('.pui-sortable-list__viewport')
        .boundingClientRect()
        .exec(function resolved(results) {
          callback(results && results[0] || [], results && results[1] || null);
        });
    },

    onTouchMove: function onTouchMove(event) {
      if (!this.data.dragging) return;
      var y = pointY(event);
      if (!isFinite(y)) return;
      this._dragPointerY = y;
      var rows = this._rowRects || [];
      var next = this.data.targetIndex;
      for (var index = 0; index < rows.length; index += 1) {
        if (y < rows[index].top + rows[index].height / 2) {
          next = index;
          break;
        }
        next = index;
      }
      if (next !== this.data.targetIndex) {
        var draft = sortableData.reorder(this._sourceItems, this.data.activeIndex, next);
        this.setData({ targetIndex: next, normalizedItems: draft });
        this.triggerEvent('dragging', { from: this.data.activeIndex, to: next });
      }
      this._updateAutoScroll(y);
    },

    onTouchEnd: function onTouchEnd() {
      if (!this.data.dragging) return;
      this._finishDrag(false);
    },

    onTouchCancel: function onTouchCancel() {
      if (!this.data.dragging) return;
      this._finishDrag(true);
    },

    _finishDrag: function finishDrag(cancelled) {
      this._stopAutoScroll();
      var from = this.data.activeIndex;
      var to = this.data.targetIndex;
      var changed = !cancelled && from > -1 && to > -1 && from !== to;
      var next = changed ? sortableData.reorder(this._sourceItems, from, to) : this._sourceItems;
      this.setData({
        dragging: false,
        activeIndex: -1,
        targetIndex: -1,
        normalizedItems: next
      });
      if (cancelled) {
        this.triggerEvent('cancel', { from: from, to: to });
        return;
      }
      if (changed) {
        this.triggerEvent('change', {
          from: from,
          to: to,
          items: sortableData.publicItems(next)
        });
      }
    },

    _updateAutoScroll: function updateAutoScroll(y) {
      var viewport = this._viewportRect;
      if (!viewport) return;
      var threshold = Math.min(56, viewport.height * 0.18);
      var direction = y < viewport.top + threshold ? -1 : (y > viewport.bottom - threshold ? 1 : 0);
      if (direction === this._autoScrollDirection) return;
      this._stopAutoScroll();
      if (!direction) return;
      this._autoScrollDirection = direction;
      this._autoScrollTimer = setInterval(function scrollStep() {
        if (!this.data.dragging) return this._stopAutoScroll();
        var next = Math.max(0, (Number(this._scrollTop) || 0) + direction * 12);
        this._scrollTop = next;
        this.setData({ scrollTop: next });
      }.bind(this), 32);
    },

    _stopAutoScroll: function stopAutoScroll() {
      clearInterval(this._autoScrollTimer);
      this._autoScrollTimer = null;
      this._autoScrollDirection = 0;
    },

    move: function move(from, to) {
      var start = Math.floor(Number(from));
      var end = Math.floor(Number(to));
      if (start < 0 || end < 0 || start >= this._sourceItems.length || end >= this._sourceItems.length || start === end) return false;
      if (this._sourceItems[start].disabled) return false;
      var next = sortableData.reorder(this._sourceItems, start, end);
      this.setData({ normalizedItems: next });
      this.triggerEvent('change', { from: start, to: end, items: sortableData.publicItems(next), source: 'method' });
      return true;
    },

    cancel: function cancel() {
      if (!this.data.dragging) return false;
      this._finishDrag(true);
      return true;
    },

    getItems: function getItems() {
      return sortableData.publicItems(this.data.normalizedItems);
    }
  }
});
