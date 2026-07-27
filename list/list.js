const themeBehavior = require('../common/behaviors/theme');

const EASINGS = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'];
const ALIGNS = ['top', 'middle', 'bottom'];

const clamp = (value, min, max, fallback) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
};

const toText = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const toVisibleText = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return toText(value);
    }
  }
  return toText(value);
};

const normalizeItems = (items, motion) => {
  const source = Array.isArray(items) ? items : [];
  return source.map((entry, index) => {
    const item = entry && typeof entry === 'object' ? entry : { title: entry };
    const value = item.value === null || item.value === undefined ? String(index) : item.value;
    const title = toText(
      item.title !== undefined ? item.title : item.label !== undefined ? item.label : item.text,
      `列表项 ${index + 1}`,
    );
    const badge = item.badge === null || item.badge === undefined ? '' : item.badge;
    return {
      ...item,
      id: `pui-list-item-${index}`,
      title,
      description: toText(item.description),
      note: toText(item.note),
      value,
      valueText: item.valueText === null || item.valueText === undefined ? toVisibleText(value) : toText(item.valueText),
      image: toText(item.image),
      leftIcon: toText(item.leftIcon !== undefined ? item.leftIcon : item.icon),
      rightIcon: toText(item.rightIcon),
      badge,
      badgeDot: Boolean(item.badgeDot),
      badgeVisible: Boolean(item.badgeDot || badge !== ''),
      badgeMax: clamp(item.badgeMax, 1, 9999, 99),
      badgeColor: toText(item.badgeColor),
      badgeAriaLabel: toText(item.badgeAriaLabel, `${title}徽标`),
      arrow: item.arrow !== false,
      required: Boolean(item.required),
      align: ALIGNS.includes(item.align) ? item.align : 'middle',
      clickable: item.clickable !== false,
      disabled: Boolean(item.disabled),
      loading: Boolean(item.loading),
      index,
      loadingProps: {
        size: 'small',
        ariaLabel: `${title}加载中`,
      },
    };
  });
};

Component({
  behaviors: [themeBehavior],
  options: {
    multipleSlots: true,
    addGlobalClass: true,
    styleIsolation: 'shared',
  },

  properties: {
    items: { type: Array, value: [] },
    title: { type: String, value: '' },
    description: { type: String, value: '' },
    showHeader: { type: Boolean, value: false },
    customHeader: { type: Boolean, value: false },
    useSlot: { type: Boolean, value: false },
    showIcon: { type: Boolean, value: true },
    showDescription: { type: Boolean, value: true },
    showValue: { type: Boolean, value: true },
    showBadge: { type: Boolean, value: true },
    showArrow: { type: Boolean, value: true },
    clickable: { type: Boolean, value: true },
    bordered: { type: Boolean, value: true },
    divided: { type: Boolean, value: true },
    compact: { type: Boolean, value: false },
    showFooter: { type: Boolean, value: true },
    customFooter: { type: Boolean, value: false },
    customEmpty: { type: Boolean, value: false },
    disabled: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    loadText: { type: String, value: '加载更多' },
    loadingText: { type: String, value: '加载中' },
    finished: { type: Boolean, value: false },
    finishedText: { type: String, value: '没有更多了' },
    error: { type: Boolean, value: false },
    errorText: { type: String, value: '加载失败，点击重试' },
    emptyText: { type: String, value: '暂无列表数据' },
    ariaLabel: { type: String, value: '列表' },
    duration: { type: Number, value: 500 },
    easing: { type: String, value: 'ease-out' },
    reduceMotion: { type: Boolean, value: false },
  },

  data: {
    normalizedItems: [],
    rootClass: 'pui-list pui-list--empty',
    rootStyle: '',
    stateType: 'empty',
    footerState: 'ready',
    footerText: '加载更多',
    footerIcon: 'chevron-down',
    footerDisabled: false,
    semanticLabel: '列表',
    loadingProps: { size: 'small', text: '加载中' },
  },

  observers: {
    'items,title,description,showHeader,customHeader,useSlot,showIcon,showDescription,showValue,showBadge,showArrow,clickable,bordered,divided,compact,showFooter,customFooter,customEmpty,disabled,loading,loadText,loadingText,finished,finishedText,error,errorText,emptyText,ariaLabel,duration,easing,reduceMotion,colorScheme': function sync() {
      this.syncState();
    },
  },

  lifetimes: {
    attached() {
      this._ready = true;
      this.syncState();
    },
    detached() {
      this._ready = false;
    },
  },

  methods: {
    syncState() {
      if (!this._ready) return;
      const reduceMotion = Boolean(this.properties.reduceMotion);
      const duration = reduceMotion ? 1 : clamp(this.properties.duration, 0, 1000, 500);
      const easing = EASINGS.includes(this.properties.easing) ? this.properties.easing : 'ease-out';
      const normalizedItems = normalizeItems(this.properties.items, { duration, easing, reduceMotion });
      const hasContent = Boolean(this.properties.useSlot || normalizedItems.length);
      const stateType = hasContent
        ? 'content'
        : this.properties.error
          ? 'error'
          : this.properties.loading
            ? 'loading'
            : 'empty';
      const footerState = this.properties.error
        ? 'error'
        : this.properties.loading
          ? 'loading'
          : this.properties.finished
            ? 'finished'
            : 'ready';
      const footerText = footerState === 'error'
        ? toText(this.properties.errorText, '加载失败，点击重试')
        : footerState === 'loading'
          ? toText(this.properties.loadingText, '加载中')
          : footerState === 'finished'
            ? toText(this.properties.finishedText, '没有更多了')
            : toText(this.properties.loadText, '加载更多');
      const footerIcon = footerState === 'error'
        ? 'refresh'
        : footerState === 'finished'
          ? 'check-circle'
          : footerState === 'ready'
            ? 'chevron-down'
            : '';
      const footerDisabled = Boolean(
        this.properties.disabled
        || (footerState !== 'error' && (this.properties.loading || this.properties.finished))
        || !footerText,
      );
      const rootClass = [
        'pui-list',
        this.getColorSchemeClass(),
        `pui-list--${stateType}`,
        `pui-list--footer-${footerState}`,
        this.properties.bordered ? 'pui-list--bordered' : 'pui-list--borderless',
        this.properties.divided ? 'pui-list--divided' : '',
        this.properties.compact ? 'pui-list--compact' : '',
        this.properties.clickable ? 'pui-list--clickable' : '',
        this.properties.disabled ? 'pui-list--disabled' : '',
        reduceMotion ? 'pui-list--reduced' : '',
      ].filter(Boolean).join(' ');

      this.setData({
        normalizedItems,
        rootClass,
        rootStyle: `--pui-list-duration:${duration}ms;--pui-list-easing:${easing}`,
        stateType,
        footerState,
        footerText,
        footerIcon,
        footerDisabled,
        semanticLabel: toText(this.properties.ariaLabel, '列表'),
        loadingProps: {
          size: 'small',
          text: toText(this.properties.loadingText, '加载中'),
          ariaLabel: toText(this.properties.loadingText, '加载中'),
        },
      });
    },

    onItemTap(event) {
      const index = Math.trunc(Number(event.currentTarget.dataset.index));
      const item = this.data.normalizedItems[index];
      if (
        !item
        || this.properties.disabled
        || this.properties.clickable === false
        || item.clickable === false
        || item.disabled
        || item.loading
      ) return false;
      this.triggerEvent('click', {
        value: item.value,
        valueText: item.valueText,
        item,
        index,
        source: 'tap',
      });
      return true;
    },

    requestFooter(source) {
      if (
        this.properties.disabled
        || (!this.properties.error && (this.properties.loading || this.properties.finished))
        || !this.data.footerText
      ) return false;
      const detail = {
        source,
        itemCount: this.data.normalizedItems.length,
      };
      if (this.properties.error) this.triggerEvent('retry', detail);
      else this.triggerEvent('load', detail);
      return true;
    },

    onFooterTap() {
      return this.requestFooter('tap');
    },

    loadMore() {
      if (this.properties.error) return false;
      return this.requestFooter('method');
    },

    retry() {
      if (!this.properties.error) return false;
      return this.requestFooter('method');
    },
  },
});
