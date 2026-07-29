'use strict';

var tabbarNavigation = require('../../common/utils/tabbar-navigation');
var catalog = require('../../common/data/style-utilities-catalog');
var visualConfig = require('poemui-miniprogram/common/utils/visual-config');
var platformInfo = require('poemui-miniprogram/common/utils/platform-info');
var backgroundPreference = require('../../common/utils/page-background-preference');

var DEFAULT_GROUP = 'layout';
var SEARCH_OVERLAY_DURATION = 500;
var SEARCH_RESULT_LIMIT = 24;
var PANEL_PADDING_RPX = 28;
var PREVIEW_GAP_RPX = 8;
var PREVIEW_MAX_HEIGHT_RPX = 120;
var UTILITY_MIN_VIEWPORT_RPX = 520;
var PREVIEW_TARGETS = ['layout', 'item', 'target', 'media', 'measure', 'outer', 'surface', 'items', 'text'];

function hasGroup(groupKey) {
  return catalog.groups.some(function (group) { return group.key === groupKey; });
}

function selectionKey(item) {
  return item.group + ':' + item.previewKind;
}

function groupItems(groupKey, selections) {
  return catalog.items.filter(function (item) { return item.group === groupKey; }).map(function (item) {
    var next = Object.assign({}, item);
    next.selected = Boolean(selections && selections[selectionKey(next)] === next.name);
    return next;
  });
}

function unique(values) {
  return values.filter(function (value, index, source) { return value && source.indexOf(value) === index; });
}

function selectedItems(groupKey, selections) {
  var names = Object.keys(selections || {}).filter(function (key) {
    return key.indexOf(groupKey + ':') === 0;
  }).map(function (key) { return selections[key]; });
  return names.map(function (name) {
    return catalog.items.find(function (item) { return item.name === name && item.group === groupKey; });
  }).filter(Boolean);
}

function previewModel(groupKey, selections, focusedName) {
  var items = selectedItems(groupKey, selections);
  var focused = items.find(function (item) { return item.name === focusedName; }) || items[items.length - 1] || null;
  var classes = {};
  var scaffolds = {};
  PREVIEW_TARGETS.forEach(function (target) {
    classes[target] = [];
    scaffolds[target] = [];
  });
  items.forEach(function (item) {
    classes[item.previewTarget].push(item.name);
    (item.previewScaffold || []).forEach(function (name) {
      scaffolds[item.previewScaffoldTarget || item.previewTarget].push(name);
    });
  });
  var kinds = items.map(function (item) { return item.previewKind; });
  PREVIEW_TARGETS.forEach(function (target) {
    scaffolds[target] = scaffolds[target].filter(function (name) {
      if (name === 'pui-bg-muted' && kinds.some(function (kind) { return kind === 'background' || kind === 'dark-background'; })) return false;
      if (name === 'pui-radius-sm' && kinds.indexOf('radius') !== -1) return false;
      if (name === 'pui-border' && kinds.indexOf('border-width') !== -1) return false;
      if (/^pui-w-/.test(name) && kinds.indexOf('width') !== -1) return false;
      if (/^pui-h-/.test(name) && kinds.indexOf('height') !== -1) return false;
      return true;
    });
  });
  var model = {
    previewHasSelection: items.length > 0,
    previewKind: focused ? focused.previewKind : groupKey,
    previewSafety: focused ? focused.previewSafety : 'bounded',
    previewThemeClass: items.some(function (item) { return item.previewTheme === 'dark'; }) ? 'pui-theme--dark' : '',
    previewAriaLabel: focused ? focused.name + ' 当前效果' : '选择' + ((catalog.groups.find(function (group) { return group.key === groupKey; }) || {}).label || groupKey) + '样式后显示当前效果',
    activePreviewUtility: focused ? focused.name : ''
  };
  PREVIEW_TARGETS.forEach(function (target) {
    model['preview' + target.charAt(0).toUpperCase() + target.slice(1) + 'Classes'] = unique(scaffolds[target].concat(classes[target])).join(' ');
  });
  return model;
}

function tabItems() {
  return catalog.groups.map(function (group) {
    return {
      label: group.label,
      value: group.key,
      icon: group.icon,
      ariaLabel: group.label
    };
  });
}

function filterItems(items, query) {
  var keyword = String(query || '').trim().toLowerCase();
  if (!keyword) return items.slice(0, SEARCH_RESULT_LIMIT);
  return items.filter(function (item) {
    return [item.name, item.description, item.keywords].join(' ').toLowerCase().indexOf(keyword) !== -1;
  }).slice(0, SEARCH_RESULT_LIMIT);
}

function rpxToPx(rpx) {
  var info = platformInfo.getWindowInfo();
  var width = Number(info && info.windowWidth) || 375;
  return width * Number(rpx || 0) / 750;
}

Page({
  data: {
    activeTab: 'styles',
    tabbarItems: tabbarNavigation.getItems(),
    navbarLeftBtn: { icon: 'search', ariaLabel: '搜索样式' },
    navbarRightBtn: { icon: 'menu', ariaLabel: '打开外观设置' },
    groupTabs: tabItems(),
    activeGroup: DEFAULT_GROUP,
    visibleUtilities: groupItems(DEFAULT_GROUP, {}),
    activeSelections: {},
    previewHasSelection: false,
    previewKind: DEFAULT_GROUP,
    previewSafety: 'bounded',
    previewThemeClass: '',
    previewAriaLabel: '选择布局样式后显示当前效果',
    activePreviewUtility: '',
    previewLayoutClasses: '',
    previewItemClasses: '',
    previewTargetClasses: '',
    previewMediaClasses: '',
    previewMeasureClasses: '',
    previewOuterClasses: '',
    previewSurfaceClasses: '',
    previewItemsClasses: '',
    previewTextClasses: '',
    searchOverlayVisible: false,
    searchOverlayDuration: SEARCH_OVERLAY_DURATION,
    searchInputFocus: false,
    searchQuery: '',
    searchResults: filterItems(catalog.items, ''),
    appearancePopupVisible: false,
    backgroundGradientEnabled: backgroundPreference.get(),
    scrollAreaHeight: '1px',
    previewHeight: 1,
    utilityScrollTop: 1,
    utilityScrollHeight: '1px',
    layoutReady: false,
    scrollTop: 0
  },

  onLoad: function () {
    var self = this;
    visualConfig.restore();
    backgroundPreference.restore();
    this._unsubscribeBackgroundPreference = backgroundPreference.subscribe(function (enabled) {
      self.setData({ backgroundGradientEnabled: Boolean(enabled) });
    });
    this._windowResizeHandler = this.onWindowResize.bind(this);
    if (wx.onWindowResize) wx.onWindowResize(this._windowResizeHandler);
  },

  onShow: function () {
    this.scheduleMeasureLayout();
  },

  onReady: function () {
    this.scheduleMeasureLayout();
  },

  onUnload: function () {
    clearTimeout(this._measureTimer);
    clearTimeout(this._searchFocusTimer);
    if (this._unsubscribeBackgroundPreference) this._unsubscribeBackgroundPreference();
    if (wx.offWindowResize && this._windowResizeHandler) wx.offWindowResize(this._windowResizeHandler);
  },

  onWindowResize: function () {
    this.scheduleMeasureLayout();
  },

  scheduleMeasureLayout: function () {
    clearTimeout(this._measureTimer);
    this._measureTimer = setTimeout(this.measureLayout.bind(this), 0);
  },

  measureLayout: function () {
    var windowHeight = wx.getWindowInfo ? Number(wx.getWindowInfo().windowHeight) : 0;
    if (!windowHeight || !this.createSelectorQuery) return;
    var query = this.createSelectorQuery();
    query.select('#styles-navbar').boundingClientRect();
    query.select('#styles-tabbar').boundingClientRect();
    query.exec(function (rects) {
      var navbarHeight = rects && rects[0] ? Number(rects[0].height) : 0;
      var tabbarHeight = rects && rects[1] ? Number(rects[1].height) : 0;
      if (!navbarHeight || !tabbarHeight) return;
      this.setData({
        scrollAreaHeight: Math.max(1, Math.floor(windowHeight - navbarHeight - tabbarHeight)) + 'px',
        layoutReady: true
      }, function () {
        this._workspaceHeight = Math.max(1, Math.floor(windowHeight - navbarHeight - tabbarHeight));
        this.measurePreviewLayout();
      }.bind(this));
    }.bind(this));
  },

  scheduleMeasurePreview: function () {
    this.measurePreviewLayout();
  },

  measurePreviewLayout: function () {
    var workspaceHeight = Number(this._workspaceHeight) || parseFloat(this.data.scrollAreaHeight);
    if (!this.data.layoutReady || !workspaceHeight) return;
    var topInset = rpxToPx(PANEL_PADDING_RPX);
    var bottomInset = rpxToPx(PANEL_PADDING_RPX);
    var previewGap = rpxToPx(PREVIEW_GAP_RPX);
    var previewBudget = Math.max(1, workspaceHeight - topInset - previewGap - bottomInset - rpxToPx(UTILITY_MIN_VIEWPORT_RPX));
    var previewHeight = Math.max(1, Math.floor(Math.min(rpxToPx(PREVIEW_MAX_HEIGHT_RPX), previewBudget)));
    var top = Math.ceil(Math.max(1, topInset + previewHeight + previewGap));
    var height = Math.max(1, Math.floor(workspaceHeight - top - bottomInset));
    this.setData({
      previewHeight: previewHeight,
      utilityScrollTop: top,
      utilityScrollHeight: height + 'px'
    });
  },

  selectUtility: function (name, groupKey) {
    if (!name) return;
    var nextGroup = hasGroup(groupKey) ? groupKey : this.data.activeGroup;
    var next = {};
    if (nextGroup !== this.data.activeGroup) {
      next.activeGroup = nextGroup;
      next.visibleUtilities = groupItems(nextGroup);
    }
    var matching = catalog.items.find(function (item) { return item.name === name && item.group === nextGroup; });
    if (!matching) return;
    var selections = Object.assign({}, this.data.activeSelections);
    var key = selectionKey(matching);
    var wasSelected = selections[key] === name;
    if (wasSelected) delete selections[key];
    else selections[key] = name;
    next.activeSelections = selections;
    next.visibleUtilities = groupItems(nextGroup, selections);
    Object.assign(next, previewModel(nextGroup, selections, wasSelected ? '' : name));
    this.setData(next);
  },

  onGroupChange: function (event) {
    var value = event && event.detail ? event.detail.value : '';
    if (!hasGroup(value)) return;
    var next = {
      activeGroup: value,
      visibleUtilities: groupItems(value, this.data.activeSelections),
      scrollTop: 0
    };
    Object.assign(next, previewModel(value, this.data.activeSelections, ''));
    this.setData(next);
  },

  onUtilityTap: function (event) {
    var dataset = event && event.currentTarget ? event.currentTarget.dataset : {};
    this.selectUtility(String(dataset.utility || ''), String(dataset.group || this.data.activeGroup));
  },

  onResetPreview: function () {
    var groupKey = this.data.activeGroup;
    var prefix = groupKey + ':';
    var selections = Object.assign({}, this.data.activeSelections);
    Object.keys(selections).forEach(function (key) {
      if (key.indexOf(prefix) === 0) delete selections[key];
    });
    var next = {
      activeSelections: selections,
      visibleUtilities: groupItems(groupKey, selections)
    };
    Object.assign(next, previewModel(groupKey, selections, ''));
    this.setData(next);
  },

  onOpenSearch: function () {
    clearTimeout(this._searchFocusTimer);
    this.setData({
      searchOverlayVisible: true,
      appearancePopupVisible: false,
      searchInputFocus: false,
      searchQuery: '',
      searchResults: filterItems(catalog.items, '')
    });
    this._searchFocusTimer = setTimeout(function () {
      if (this.data.searchOverlayVisible) this.setData({ searchInputFocus: true });
    }.bind(this), 0);
  },

  onSearchOverlayClick: function () {
    clearTimeout(this._searchFocusTimer);
    this.setData({ searchOverlayVisible: false, searchInputFocus: false, searchQuery: '' });
  },

  onSearchContentTap: function () {},

  onStyleSearchChange: function (event) {
    var query = String(event && event.detail && event.detail.value !== undefined ? event.detail.value : '');
    this.setData({ searchQuery: query, searchResults: filterItems(catalog.items, query) });
  },

  onStyleSearchClear: function () {
    this.setData({ searchQuery: '', searchResults: filterItems(catalog.items, '') });
  },

  onSearchResultTap: function (event) {
    var dataset = event && event.currentTarget ? event.currentTarget.dataset : {};
    this.selectUtility(String(dataset.utility || ''), String(dataset.group || ''));
    this.onSearchOverlayClick();
  },

  onOpenAppearance: function () {
    clearTimeout(this._searchFocusTimer);
    this.setData({ searchOverlayVisible: false, searchInputFocus: false, appearancePopupVisible: true });
  },

  onAppearancePopupVisibleChange: function (event) {
    this.setData({ appearancePopupVisible: Boolean(event && event.detail && event.detail.visible) });
  },

  onResetAppearance: function () {
    backgroundPreference.set(false, { source: 'miniprogram-styles:appearance-reset' });
    visualConfig.reset({ source: 'miniprogram-styles:appearance-reset' });
  },

  onTabChange: function (event) {
    var value = event && event.detail ? event.detail.value : '';
    tabbarNavigation.navigateToTab(value, this.data.activeTab);
  },

  onScrollAreaScroll: function (event) {
    var detail = event && event.detail ? event.detail : {};
    var scrollTop = Number(detail.scrollTop) || 0;
    this.setData({ scrollTop: scrollTop });
  },

  onBackToTop: function () {
    this.setData({ scrollTop: 0 });
  }
});
