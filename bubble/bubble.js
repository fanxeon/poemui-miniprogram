var themeBehavior = require('../common/behaviors/theme');

var EASINGS = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  ease: 'ease',
  linear: 'linear',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out'
};

function normalizeEnum(value, values, fallback) {
  return values.indexOf(value) > -1 ? value : fallback;
}

function normalizeDuration(value, reduceMotion) {
  if (reduceMotion) return 1;
  var duration = Number(value);
  if (!isFinite(duration)) duration = 500;
  return Math.max(0, Math.min(1000, Math.round(duration)));
}

function normalizeLines(value) {
  var lines = Math.floor(Number(value));
  if (!isFinite(lines)) lines = 4;
  return Math.max(1, Math.min(12, lines));
}

function hasValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function normalizeContent(content, text) {
  var value = hasValue(content) ? content : text;
  return hasValue(value) ? String(value).trim() : '';
}

function normalizeReactions(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 12).map(function mapReaction(item, index) {
    var source = item && typeof item === 'object' && !Array.isArray(item) ? item : { label: item, value: item };
    var rawValue = source.value !== undefined ? source.value : (source.label !== undefined ? source.label : index);
    var label = hasValue(source.label) ? source.label : (hasValue(source.text) ? source.text : (hasValue(source.emoji) ? source.emoji : rawValue));
    var count = hasValue(source.count) ? String(source.count) : '';
    var text = String(label) + (count ? ' ' + count : '');
    return {
      key: hasValue(source.key) ? String(source.key) : String(index),
      value: rawValue,
      label: String(label),
      count: count,
      text: text,
      active: !!source.active,
      disabled: !!source.disabled,
      ariaLabel: String(source.ariaLabel || (text + (source.active ? '，已选择' : '')))
    };
  });
}

Component({
  behaviors: [themeBehavior],
  options: { multipleSlots: true, styleIsolation: 'shared' },
  properties: {
    content: { type: String, value: '' },
    text: { type: String, value: '' },
    variant: { type: String, value: 'default' },
    align: { type: String, value: 'start' },
    groupPosition: { type: String, value: 'single' },
    reactions: { type: Array, value: [] },
    reactionSide: { type: String, value: 'bottom' },
    reactionAlign: { type: String, value: 'end' },
    customContent: { type: Boolean, value: false },
    customReactions: { type: Boolean, value: false },
    collapsible: { type: Boolean, value: false },
    expanded: { type: null, value: null },
    defaultExpanded: { type: Boolean, value: false },
    maxLines: { type: Number, value: 4 },
    expandText: { type: String, value: '展开' },
    collapseText: { type: String, value: '收起' },
    selectable: { type: Boolean, value: true },
    visible: { type: Boolean, value: true },
    clickable: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    ariaLabel: { type: String, value: '' },
    ariaLive: { type: String, value: 'off' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'standard' },
    reduceMotion: { type: Boolean, value: false }
  },
  data: {
    rootClass: '',
    rootStyle: '',
    measureStyle: '',
    displayContent: '',
    bubbleLabel: '消息气泡',
    bubbleAriaLive: 'off',
    bubbleVariant: 'default',
    bubbleAlign: 'start',
    reactionItems: [],
    hasReactions: false,
    expandedState: false,
    normalizedMaxLines: 4,
    showToggle: false,
    desiredVisible: false,
    rendered: false,
    active: false,
    phase: 'hidden',
    interactive: false,
    motionDuration: 500
  },
  observers: {
    'content,text,variant,align,groupPosition,reactions,reactionSide,reactionAlign,customContent,customReactions,collapsible,expanded,defaultExpanded,maxLines,expandText,collapseText,selectable,visible,clickable,disabled,ariaLabel,ariaLive,duration,easing,reduceMotion,colorScheme': function sync() {
      this.syncState(false);
    }
  },
  lifetimes: {
    attached: function attached() {
      this._bubbleMounted = true;
      this.syncState(true);
    },
    detached: function detached() {
      this._bubbleMounted = false;
      this.clearTimers();
    }
  },
  methods: {
    clearTimers: function clearTimers() {
      if (this._bubbleFrameTimer) clearTimeout(this._bubbleFrameTimer);
      if (this._bubbleMotionTimer) clearTimeout(this._bubbleMotionTimer);
      if (this._bubbleMeasureTimer) clearTimeout(this._bubbleMeasureTimer);
      this._bubbleFrameTimer = null;
      this._bubbleMotionTimer = null;
      this._bubbleMeasureTimer = null;
    },
    buildDetail: function buildDetail(source) {
      return {
        source: source || 'bubble',
        content: this.data.displayContent,
        variant: this.data.bubbleVariant,
        align: this.data.bubbleAlign,
        expanded: !!this.data.expandedState,
        visible: !!this.data.rendered && this.data.phase !== 'leaving' && this.data.phase !== 'hidden'
      };
    },
    syncState: function syncState(initial) {
      var displayContent = normalizeContent(this.data.content, this.data.text);
      var variant = normalizeEnum(this.data.variant, ['default', 'secondary', 'muted', 'tinted', 'outline', 'ghost', 'destructive'], 'default');
      var align = normalizeEnum(this.data.align, ['start', 'end'], 'start');
      var groupPosition = normalizeEnum(this.data.groupPosition, ['single', 'first', 'middle', 'last'], 'single');
      var reactionSide = normalizeEnum(this.data.reactionSide, ['top', 'bottom'], 'bottom');
      var reactionAlign = normalizeEnum(this.data.reactionAlign, ['start', 'end'], 'end');
      var ariaLive = normalizeEnum(this.data.ariaLive, ['off', 'polite', 'assertive'], 'off');
      var duration = normalizeDuration(this.data.duration, this.data.reduceMotion);
      var easing = EASINGS[this.data.easing] || EASINGS.standard;
      var maxLines = normalizeLines(this.data.maxLines);
      var reactionItems = normalizeReactions(this.data.reactions);
      var controlled = typeof this.data.expanded === 'boolean';
      if (!this._bubbleExpansionInitialized) {
        this._bubbleExpansionInitialized = true;
        this.data.expandedState = controlled ? !!this.data.expanded : !!this.data.defaultExpanded;
      } else if (controlled) {
        this.data.expandedState = !!this.data.expanded;
      }
      var expandedState = !!this.data.expandedState;
      var hasReactions = !!this.data.customReactions || reactionItems.length > 0;
      var shouldShow = !!this.data.visible && (!!this.data.customContent || !!displayContent);
      var semantic = String(this.data.ariaLabel || '').trim() || displayContent || (this.data.customContent ? '自定义消息气泡' : '消息气泡');
      var rootClass = [
        'pui-bubble',
        this.getColorSchemeClass(),
        'pui-bubble--' + variant,
        'pui-bubble--' + align,
        'pui-bubble--group-' + groupPosition,
        'pui-bubble--reaction-' + reactionSide,
        'pui-bubble--reaction-align-' + reactionAlign,
        hasReactions ? 'pui-bubble--has-reactions' : '',
        this.data.collapsible ? 'pui-bubble--collapsible' : '',
        expandedState ? 'pui-bubble--expanded' : 'pui-bubble--collapsed',
        this.data.clickable ? 'pui-bubble--clickable' : '',
        this.data.disabled ? 'pui-bubble--disabled' : ''
      ].filter(Boolean).join(' ');
      this.setData({
        rootClass: rootClass,
        rootStyle: [
          '--pui-bubble-duration:' + duration + 'ms',
          '--pui-bubble-ease:' + easing,
          '--pui-bubble-lines:' + maxLines,
          '--pui-bubble-collapsed-height:' + (maxLines * 40) + 'rpx',
          '--pui-bubble-expanded-height:2400rpx'
        ].join(';') + ';',
        measureStyle: '',
        displayContent: displayContent,
        bubbleLabel: semantic,
        bubbleAriaLive: ariaLive,
        bubbleVariant: variant,
        bubbleAlign: align,
        reactionItems: reactionItems,
        hasReactions: hasReactions,
        expandedState: expandedState,
        normalizedMaxLines: maxLines,
        showToggle: !!this.data.collapsible && !!this.data.customContent,
        desiredVisible: shouldShow,
        interactive: !!this.data.clickable && !this.data.disabled,
        motionDuration: duration
      });
      this.syncVisibility(shouldShow, duration, !!initial || !this._bubbleMounted);
      this.scheduleMeasure();
    },
    syncVisibility: function syncVisibility(shouldShow, duration, initial) {
      if (initial) {
        this.clearTimers();
        this.setData({ rendered: shouldShow, active: shouldShow, phase: shouldShow ? 'active' : 'hidden' });
        return;
      }
      if (shouldShow) {
        if (this.data.rendered && this.data.phase !== 'leaving' && this.data.phase !== 'hidden') return;
        this.clearTimers();
        this.setData({ rendered: true, active: false, phase: 'entering' });
        this.triggerEvent('show', this.buildDetail('property'));
        if (duration === 0) {
          this.setData({ active: true, phase: 'active' });
          this.triggerEvent('after-show', this.buildDetail('property'));
          return;
        }
        var component = this;
        this._bubbleFrameTimer = setTimeout(function enterFrame() {
          component._bubbleFrameTimer = null;
          if (!component._bubbleMounted || !component.data.desiredVisible) return;
          component.setData({ active: true, phase: 'active' });
          component._bubbleMotionTimer = setTimeout(function afterShow() {
            component._bubbleMotionTimer = null;
            if (!component._bubbleMounted || !component.data.active) return;
            component.triggerEvent('after-show', component.buildDetail('property'));
          }, duration);
        }, 16);
        return;
      }
      if (!this.data.rendered || this.data.phase === 'leaving' || this.data.phase === 'hidden') return;
      this.clearTimers();
      this.setData({ active: false, phase: 'leaving' });
      this.triggerEvent('hide', this.buildDetail('property'));
      if (duration === 0) {
        this.setData({ rendered: false, phase: 'hidden' });
        this.triggerEvent('after-hide', this.buildDetail('property'));
        return;
      }
      var component = this;
      this._bubbleMotionTimer = setTimeout(function afterHide() {
        component._bubbleMotionTimer = null;
        if (!component._bubbleMounted || component.data.active || component.data.desiredVisible) return;
        component.setData({ rendered: false, phase: 'hidden' });
        component.triggerEvent('after-hide', component.buildDetail('property'));
      }, duration);
    },
    scheduleMeasure: function scheduleMeasure() {
      if (!this._bubbleMounted || !this.data.rendered || !this.data.collapsible || this.data.customContent) return;
      if (this._bubbleMeasureTimer) clearTimeout(this._bubbleMeasureTimer);
      var component = this;
      this._bubbleMeasureTimer = setTimeout(function measureLater() {
        component._bubbleMeasureTimer = null;
        component.measureContent();
      }, 0);
    },
    measureContent: function measureContent() {
      if (!this.createSelectorQuery || !this.data.collapsible || this.data.customContent || !this.data.rendered) return;
      var component = this;
      var query = this.createSelectorQuery();
      query.select('.pui-bubble__measure--full').boundingClientRect();
      query.select('.pui-bubble__measure--clamped').boundingClientRect();
      query.exec(function onMeasured(rects) {
        var full = rects && rects[0];
        var clamped = rects && rects[1];
        if (!full || !clamped || !component._bubbleMounted) return;
        var fullHeight = Math.max(0, Math.ceil(Number(full.height) || 0));
        var collapsedHeight = Math.max(0, Math.ceil(Number(clamped.height) || 0));
        component.setData({
          showToggle: fullHeight > collapsedHeight + 1,
          measureStyle: '--pui-bubble-collapsed-height:' + collapsedHeight + 'px;--pui-bubble-expanded-height:' + (fullHeight + 1) + 'px;'
        });
      });
    },
    requestExpanded: function requestExpanded(next, source) {
      if (!this.data.collapsible || this.data.disabled) return;
      var previous = !!this.data.expandedState;
      next = !!next;
      if (next === previous) return;
      var controlled = typeof this.data.expanded === 'boolean';
      var detail = {
        value: next,
        expanded: next,
        previousValue: previous,
        source: source || 'toggle'
      };
      this.triggerEvent('input', detail);
      this.triggerEvent('change', detail);
      this.triggerEvent(next ? 'expand' : 'collapse', detail);
      if (!controlled) {
        this.setData({ expandedState: next });
        this.syncState(false);
      }
    },
    onToggleTap: function onToggleTap() {
      this.requestExpanded(!this.data.expandedState, 'toggle');
    },
    onContentTap: function onContentTap() {
      if (!this.data.clickable || this.data.disabled) return;
      this.triggerEvent('click', this.buildDetail('content'));
    },
    onContentLongPress: function onContentLongPress() {
      if (!this.data.clickable || this.data.disabled) return;
      this.triggerEvent('longpress', this.buildDetail('content'));
    },
    onReactionTap: function onReactionTap(event) {
      if (this.data.disabled) return;
      var index = Number(event.currentTarget.dataset.index);
      var item = this.data.reactionItems[index];
      if (!item || item.disabled) return;
      this.triggerEvent('reaction', {
        index: index,
        item: item,
        value: item.value,
        active: !!item.active,
        source: 'reaction'
      });
    },
    stopTap: function stopTap() {},
    expand: function expand() { this.requestExpanded(true, 'method'); },
    collapse: function collapse() { this.requestExpanded(false, 'method'); },
    toggle: function toggle() { this.requestExpanded(!this.data.expandedState, 'method'); }
  }
});
