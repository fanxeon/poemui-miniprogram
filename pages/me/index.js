var tabbarNavigation = require('../../common/utils/tabbar-navigation');
var backgroundPreference = require('../../common/utils/page-background-preference');
var updateAnnouncements = require('../../common/services/update-announcements');
var componentStatus = require('../../common/data/component-status');
var styleUtilitiesCatalog = require('../../common/data/style-utilities-catalog');
var visualConfig = require('poemui-miniprogram/common/utils/visual-config');
var tabbarPageLayout = require('poemui-miniprogram/common/utils/tabbar-page-layout');
var INITIAL_TABBAR_PAGE_LAYOUT = tabbarPageLayout.getLayout();

var SHISHANG_APP_ID = 'wxa1b9a4d6549c6cd1';
var LICENSE_PAGE_ROUTE = '/pages/license/index';
var LICENSE_URL = 'https://poemcoder.com/poem-ui';
var CHART_VERSION_THEMES = ['blue', 'teal', 'violet', 'amber', 'pink', 'neutral'];
var COLLAPSED_CATEGORY_COUNT = 4;
var HIDDEN_CHART_CATEGORIES = {
  'getting-started': true
};
var ANNOUNCEMENTS = updateAnnouncements.initial();
var LATEST_ANNOUNCEMENT = updateAnnouncements.latest(ANNOUNCEMENTS);

function categoryCountMap(announcement) {
  var result = {};
  var categories = announcement && Array.isArray(announcement.categoryCounts)
    ? announcement.categoryCounts
    : [];
  categories.forEach(function rememberCategory(category) {
    result[category.key] = Math.max(0, Number(category.count) || 0);
  });
  return result;
}

function compareVersionLabels(left, right) {
  var leftParts = String(left || '').replace(/^v/, '').split('.');
  var rightParts = String(right || '').replace(/^v/, '').split('.');
  var length = Math.max(leftParts.length, rightParts.length);
  for (var index = 0; index < length; index += 1) {
    var difference = (Number(leftParts[index]) || 0) - (Number(rightParts[index]) || 0);
    if (difference) return difference;
  }
  return 0;
}

function chartItemSummary(item) {
  var total = item.segments.reduce(function sumSegments(sum, segment) {
    return sum + segment.value;
  }, 0);
  return item.label + '共 ' + total + ' 个（' + item.segments.map(function summarizeSegment(segment) {
    return segment.label + ' ' + segment.value + ' 个';
  }).join('，') + '）';
}

function prioritizeIncrementedCategories(items) {
  return items.map(function rememberSourceOrder(item, index) {
    return {
      item: item,
      index: index,
      hasIncrement: item.segments.slice(1).some(function hasPositiveIncrement(segment) {
        return segment.value > 0;
      })
    };
  }).sort(function sortIncrementedFirst(left, right) {
    if (left.hasIncrement !== right.hasIncrement) return left.hasIncrement ? -1 : 1;
    return left.index - right.index;
  }).map(function restoreItem(entry) {
    return entry.item;
  });
}

function chartVersionTagStyle(theme) {
  var normalizedTheme = CHART_VERSION_THEMES.indexOf(theme) >= 0 ? theme : 'neutral';
  var backgroundToken = normalizedTheme === 'neutral'
    ? '--pui-bg-secondary'
    : '--pui-color-' + normalizedTheme + '-soft';
  return 'color:var(--pui-chart-accent-' + normalizedTheme + ');'
    + 'background:var(' + backgroundToken + ');'
    + 'box-shadow:none;';
}

function chartVersionLegend(items) {
  var seen = {};
  return items.reduce(function collectLegend(result, item) {
    item.segments.forEach(function collectSegment(segment) {
      var key = segment.theme + ':' + segment.label;
      if (seen[key]) return;
      seen[key] = true;
      result.push({
        key: key,
        label: segment.label,
        theme: segment.theme,
        customStyle: chartVersionTagStyle(segment.theme)
      });
    });
    return result;
  }, []);
}

function visibleCategoryChart(chart, expanded) {
  var visibleItems = expanded
    ? chart.items
    : chart.items.slice(0, COLLAPSED_CATEGORY_COUNT);
  return {
    items: visibleItems,
    ariaLabel: chart.ariaPrefix
      + '；' + (expanded
        ? '已展开全部 ' + chart.items.length + ' 类：'
        : '已折叠，当前显示前 ' + visibleItems.length + ' 类：')
      + visibleItems.map(chartItemSummary).join('；')
  };
}

function dashboardCategoryChart(announcements) {
  var list = Array.isArray(announcements) ? announcements : [];
  var versions = list.filter(function validVersion(announcement) {
    return announcement
      && announcement.version
      && Array.isArray(announcement.categoryCounts)
      && announcement.categoryCounts.length;
  }).slice().sort(function oldestFirst(left, right) {
    var dateOrder = String(left.date || '').localeCompare(String(right.date || ''));
    return dateOrder || compareVersionLabels(left.version, right.version);
  });
  var current = versions[versions.length - 1];
  var baseline = versions[0];
  var currentCategories = current && Array.isArray(current.categoryCounts)
    ? current.categoryCounts
    : [];
  var versionCategoryMaps = versions.map(categoryCountMap);
  var currentVersion = current && current.version ? current.version : '当前版本';
  var baselineVersion = baseline && baseline.version ? baseline.version : '前序版本';
  var items = currentCategories.filter(function visibleCategory(category) {
    return !HIDDEN_CHART_CATEGORIES[category.key];
  }).map(function mapCategory(category) {
    var currentCount = Math.max(0, Number(category.count) || 0);
    var allocated = 0;
    return {
      key: category.key,
      label: category.label,
      segments: versions.map(function mapVersion(announcement, versionIndex) {
        var versionCount = Math.min(
          currentCount,
          versionCategoryMaps[versionIndex][category.key] || 0
        );
        var value = versionIndex === 0
          ? versionCount
          : Math.max(0, versionCount - allocated);
        allocated += value;
        return {
          key: 'version-' + versionIndex,
          label: announcement.version,
          value: value,
          theme: CHART_VERSION_THEMES[versionIndex % CHART_VERSION_THEMES.length]
        };
      })
    };
  });
  if (!items.length) {
    items = componentStatus.items().filter(function visibleGeneratedCategory(category) {
      return !HIDDEN_CHART_CATEGORIES[category.key];
    }).map(function mapGeneratedCategory(category) {
      return {
        key: category.key,
        label: category.label,
        segments: category.segments.map(function mapSegment(segment) {
          return {
            key: segment.key === 'previous' ? 'baseline' : segment.key,
            label: String(segment.label || '').replace(/\s+(已有|新增)$/, ''),
            value: segment.value,
            theme: segment.theme
          };
        })
      };
    });
  }
  items = prioritizeIncrementedCategories(items);
  var maximum = items.reduce(function findMaximum(result, item) {
    return Math.max(result, item.segments.reduce(function sumSegments(sum, segment) {
      return sum + segment.value;
    }, 0));
  }, 0);
  var totalIncrement = Math.max(
    0,
    Number(current && current.componentCount) - Number(baseline && baseline.componentCount)
  ) || 0;
  var versionLabels = versions.map(function versionLabel(announcement) {
    return announcement.version;
  });
  var legendItems = chartVersionLegend(items);
  var ariaPrefix = 'PoemUI 组件分类分版本增量，'
    + (versionLabels.length ? '依次展示 ' + versionLabels.join('、') : '展示可用版本')
    + '；从 ' + baselineVersion + ' 到 ' + currentVersion
    + ' 共新增 ' + totalIncrement + ' 个';
  return {
    items: items,
    maximum: maximum,
    ariaPrefix: ariaPrefix,
    legendItems: legendItems,
    legendAriaLabel: '版本颜色：' + legendItems.map(function legendLabel(item) {
      return item.label;
    }).join('、')
  };
}

function componentCategoryValue(key) {
  var items = componentStatus.items();
  for (var index = 0; index < items.length; index += 1) {
    if (items[index].key === key) return Number(items[index].value) || 0;
  }
  return 0;
}

function dashboardMetrics() {
  return [
    { key: 'components', label: '组件', value: componentStatus.total },
    { key: 'styles', label: '样式', value: styleUtilitiesCatalog.items.length },
    { key: 'advanced', label: '高级', value: componentCategoryValue('advanced') },
    {
      key: 'increment',
      label: '新增',
      value: componentStatus.incrementTotal,
      icon: 'sparkles',
      iconColor: 'var(--pui-chart-accent-violet)'
    }
  ];
}

var INITIAL_CATEGORY_CHART = dashboardCategoryChart(ANNOUNCEMENTS);
var INITIAL_VISIBLE_CATEGORY_CHART = visibleCategoryChart(INITIAL_CATEGORY_CHART, false);

Page({
  data: {
    activeTab: 'me',
    tabbarItems: tabbarNavigation.getItems(),
    componentStatusMetrics: dashboardMetrics(),
    componentStatusCategoryItems: INITIAL_CATEGORY_CHART.items,
    componentStatusVisibleCategoryItems: INITIAL_VISIBLE_CATEGORY_CHART.items,
    componentStatusMaximum: INITIAL_CATEGORY_CHART.maximum,
    componentStatusVersionLegendItems: INITIAL_CATEGORY_CHART.legendItems,
    componentStatusVersionLegendAriaLabel: INITIAL_CATEGORY_CHART.legendAriaLabel,
    componentStatusAnimationDuration: 1000,
    componentStatusMetricsAriaLabel: 'PoemUI 当前有 ' + componentStatus.total + ' 个组件、' + styleUtilitiesCatalog.items.length + ' 个样式、' + componentCategoryValue('advanced') + ' 个高级组件，本版新增 ' + componentStatus.incrementTotal + ' 个组件',
    componentStatusAriaPrefix: INITIAL_CATEGORY_CHART.ariaPrefix,
    componentStatusAriaLabel: INITIAL_VISIBLE_CATEGORY_CHART.ariaLabel,
    componentStatusChartExpanded: false,
    componentStatusChartToggleVisible: INITIAL_CATEGORY_CHART.items.length > COLLAPSED_CATEGORY_COUNT,
    componentStatusChartToggleLabel: '查看更多',
    componentStatusChartToggleIcon: 'chevron-down',
    componentStatusChartTransitioning: false,
    componentStatusChartViewportStyle: '',
    announcements: ANNOUNCEMENTS,
    latestAnnouncementVersion: LATEST_ANNOUNCEMENT ? LATEST_ANNOUNCEMENT.version : '',
    announcementSource: 'local',
    announcementSyncError: '',
    announcementLoadingState: 'idle',
    announcementPopupVisible: false,
    appearancePopupVisible: false,
    announcementScrollTop: 0,
    announcementScrollTarget: 'me-announcement-top-a',
    announcementPopupStyle: 'max-height:calc(100vh - ' + INITIAL_TABBAR_PAGE_LAYOUT.navbarHeight + 'px - 24rpx);',
    licenseDialogVisible: false,
    licenseNavigating: false,
    licenseDialogActions: [
      {
        content: '复制链接',
        variant: 'outline',
        ariaLabel: '复制 PoemUI 商业授权链接'
      },
      {
        content: '直接访问',
        theme: 'primary',
        ariaLabel: '通过小程序 WebView 访问商业授权页面'
      }
    ],
    backgroundGradientEnabled: backgroundPreference.get(),
    contentHeight: INITIAL_TABBAR_PAGE_LAYOUT.contentHeightStyle,
    layoutReady: true
  },

  onLoad: function onLoad() {
    var self = this;
    this._componentStatusChart = INITIAL_CATEGORY_CHART;
    backgroundPreference.restore();
    this._unsubscribeBackgroundPreference = backgroundPreference.subscribe(function onPreferenceChange(enabled) {
      self.setData({ backgroundGradientEnabled: Boolean(enabled) });
    });
    this._windowResizeHandler = this.onWindowResize.bind(this);
    if (wx.onWindowResize) wx.onWindowResize(this._windowResizeHandler);
    this.loadAnnouncements();
  },

  onShow: function onShow() {
    this.syncPageLayout();
  },

  onReady: function onReady() {
    this.scheduleMeasureComponentStatusChart();
  },

  onUnload: function onUnload() {
    clearTimeout(this._componentStatusChartMeasureTimer);
    if (this._unsubscribeBackgroundPreference) this._unsubscribeBackgroundPreference();
    if (wx.offWindowResize && this._windowResizeHandler) wx.offWindowResize(this._windowResizeHandler);
  },

  onOpenLicense: function onOpenLicense() {
    this.setData({
      appearancePopupVisible: false,
      announcementPopupVisible: false,
      licenseDialogVisible: true
    });
    return true;
  },

  onLicenseDialogClose: function onLicenseDialogClose() {
    if (this.data.licenseNavigating) return false;
    this.setData({ licenseDialogVisible: false });
    return true;
  },

  setLicenseNavigating: function setLicenseNavigating(navigating) {
    this.setData({
      licenseNavigating: Boolean(navigating),
      licenseDialogActions: [
        {
          content: '复制链接',
          variant: 'outline',
          disabled: Boolean(navigating),
          ariaLabel: '复制 PoemUI 商业授权链接'
        },
        {
          content: navigating ? '正在打开' : '直接访问',
          theme: 'primary',
          loading: Boolean(navigating),
          disabled: Boolean(navigating),
          ariaLabel: '通过小程序 WebView 访问商业授权页面'
        }
      ]
    });
  },

  onLicenseDialogAction: function onLicenseDialogAction(event) {
    var index = Number(event && event.detail ? event.detail.index : -1);
    if (index === 0) return this.onCopyLicenseLink();
    if (index === 1) return this.onVisitLicenseWebView();
    return false;
  },

  onCopyLicenseLink: function onCopyLicenseLink() {
    var self = this;
    if (this.data.licenseNavigating) return false;
    if (typeof wx.setClipboardData !== 'function') {
      this.showToast('当前微信版本无法复制链接', 'error');
      return false;
    }
    wx.setClipboardData({
      data: LICENSE_URL,
      success: function success() {
        self.setData({ licenseDialogVisible: false });
        self.showToast('链接已复制，可在桌面端打开', 'success');
      },
      fail: function fail() {
        self.showToast('复制失败，请稍后重试', 'error');
      }
    });
    return true;
  },

  onVisitLicenseWebView: function onVisitLicenseWebView() {
    var self = this;
    if (this.data.licenseNavigating) return false;
    if (typeof wx.navigateTo !== 'function') {
      this.showToast('当前微信版本无法打开授权详情', 'error');
      return false;
    }
    this.setLicenseNavigating(true);
    wx.navigateTo({
      url: LICENSE_PAGE_ROUTE,
      success: function success() {
        self.setLicenseNavigating(false);
        self.setData({ licenseDialogVisible: false });
      },
      fail: function fail() {
        self.setLicenseNavigating(false);
        self.showToast('暂时无法打开商业授权详情', 'error');
      }
    });
    return true;
  },

  onOpenOrders: function onOpenOrders() {
    this.showToast('订单服务尚未开放', 'warning');
  },

  onOpenAnnouncements: function onOpenAnnouncements() {
    var self = this;
    var nextScrollTarget = this.data.announcementScrollTarget === 'me-announcement-top-a'
      ? 'me-announcement-top-b'
      : 'me-announcement-top-a';
    this.setData({
      appearancePopupVisible: false,
      announcementPopupVisible: true,
      announcementScrollTop: 0
    }, function announcementPopupOpened() {
      wx.nextTick(function scrollAnnouncementToTop() {
        self.setData({ announcementScrollTarget: nextScrollTarget });
      });
    });
    this.loadAnnouncements();
  },

  onAnnouncementScroll: function onAnnouncementScroll(event) {
    var detail = event && event.detail ? event.detail : {};
    var scrollTop = Math.max(0, Number(detail.scrollTop) || 0);
    if (scrollTop === this.data.announcementScrollTop) return;
    this.setData({ announcementScrollTop: scrollTop });
  },

  onOpenAppearance: function onOpenAppearance() {
    this.setData({
      announcementPopupVisible: false,
      appearancePopupVisible: true
    });
  },

  onAppearancePopupVisibleChange: function onAppearancePopupVisibleChange(event) {
    this.setData({
      appearancePopupVisible: Boolean(event && event.detail && event.detail.visible)
    });
  },

  onResetAppearance: function onResetAppearance() {
    backgroundPreference.set(false, { source: 'miniprogram-me:appearance-reset' });
    visualConfig.reset({ source: 'miniprogram-me:appearance-reset' });
  },

  loadAnnouncements: function loadAnnouncements() {
    var self = this;
    this.setData({
      announcementLoadingState: 'loading'
    });
    return updateAnnouncements.load().then(function onLoaded(result) {
      var announcements = result && Array.isArray(result.announcements)
        ? result.announcements
        : [];
      var latest = updateAnnouncements.latest(announcements);
      var error = result && result.error;
      var categoryChart = dashboardCategoryChart(announcements);
      var expanded = Boolean(self.data.componentStatusChartExpanded);
      var visibleChart = visibleCategoryChart(categoryChart, expanded);
      self._componentStatusChart = categoryChart;
      self.setData({
        announcements: announcements,
        componentStatusCategoryItems: categoryChart.items,
        componentStatusVisibleCategoryItems: visibleChart.items,
        componentStatusMaximum: categoryChart.maximum,
        componentStatusVersionLegendItems: categoryChart.legendItems,
        componentStatusVersionLegendAriaLabel: categoryChart.legendAriaLabel,
        componentStatusAriaPrefix: categoryChart.ariaPrefix,
        componentStatusAriaLabel: visibleChart.ariaLabel,
        componentStatusChartToggleVisible: categoryChart.items.length > COLLAPSED_CATEGORY_COUNT,
        latestAnnouncementVersion: latest ? latest.version : '',
        announcementSource: result && result.source ? result.source : 'local',
        announcementSyncError: error ? String(error.errMsg || error.message || error) : '',
        announcementLoadingState: result && result.source === 'cloud' && !error ? 'success' : 'idle'
      }, function announcementsCommitted() {
        self.scheduleMeasureComponentStatusChart();
      });
      return result;
    }).catch(function onLoadFailed(error) {
      self.setData({
        announcementSyncError: String(error && (error.errMsg || error.message || error) || ''),
        announcementLoadingState: 'idle'
      });
      return {
        announcements: self.data.announcements,
        source: self.data.announcementSource,
        error: error
      };
    });
  },

  onAnnouncementPopupVisibleChange: function onAnnouncementPopupVisibleChange(event) {
    var visible = event && event.detail ? Boolean(event.detail.visible) : false;
    this.setData({ announcementPopupVisible: visible });
  },

  onCloseAnnouncements: function onCloseAnnouncements() {
    this.setData({ announcementPopupVisible: false });
  },

  onContactError: function onContactError() {
    this.showToast('暂时无法打开客服会话', 'error');
  },

  onOpenPrivacy: function onOpenPrivacy() {
    var self = this;
    if (typeof wx.openPrivacyContract !== 'function') {
      this.showToast('当前微信版本不支持查看隐私协议', 'error');
      return false;
    }
    wx.openPrivacyContract({
      fail: function fail() {
        self.showToast('隐私协议打开失败', 'error');
      }
    });
    return true;
  },

  onOpenShishang: function onOpenShishang() {
    var self = this;
    if (typeof wx.navigateToMiniProgram !== 'function') {
      this.showToast('当前微信版本不支持小程序跳转', 'error');
      return false;
    }
    wx.navigateToMiniProgram({
      appId: SHISHANG_APP_ID,
      envVersion: 'release',
      fail: function fail() {
        self.showToast('暂时无法打开诗上科技', 'error');
      }
    });
    return true;
  },

  showToast: function showToast(message, theme) {
    var toast = this.selectComponent('#me-toast');
    if (!toast || typeof toast.show !== 'function') return false;
    toast.show({ message: message, theme: theme || '', placement: 'middle' });
    return true;
  },

  onWindowResize: function onWindowResize() {
    this.syncPageLayout();
    this.scheduleMeasureComponentStatusChart();
  },

  scheduleMeasureComponentStatusChart: function scheduleMeasureComponentStatusChart() {
    clearTimeout(this._componentStatusChartMeasureTimer);
    this._componentStatusChartMeasureTimer = setTimeout(
      this.syncComponentStatusChartHeight.bind(this),
      0
    );
  },

  measureComponentStatusChart: function measureComponentStatusChart(callback) {
    var chart = this.selectComponent && this.selectComponent('#me-component-status-chart');
    if (!chart || typeof chart.createSelectorQuery !== 'function') return false;
    chart.createSelectorQuery().select('.pui-bar-chart').boundingClientRect().exec(function measured(rects) {
      var height = rects && rects[0] ? Math.ceil(Number(rects[0].height) || 0) : 0;
      if (height > 0 && typeof callback === 'function') callback(height);
    });
    return true;
  },

  syncComponentStatusChartHeight: function syncComponentStatusChartHeight() {
    var self = this;
    this.measureComponentStatusChart(function applyMeasuredHeight(height) {
      if (self.data.componentStatusChartExpanded) {
        self._componentStatusChartExpandedHeight = height;
      } else {
        self._componentStatusChartCollapsedHeight = height;
      }
      self.setData({
        componentStatusChartViewportStyle: 'height:' + height + 'px;'
      });
    });
  },

  onToggleComponentStatusChart: function onToggleComponentStatusChart() {
    if (this.data.componentStatusChartTransitioning) return false;
    var nextExpanded = !this.data.componentStatusChartExpanded;
    var chart = this._componentStatusChart || {
      items: this.data.componentStatusCategoryItems,
      ariaPrefix: this.data.componentStatusAriaPrefix
    };
    var visibleChart = visibleCategoryChart(chart, nextExpanded);
    var self = this;
    if (!nextExpanded) {
      var collapsedHeight = Number(this._componentStatusChartCollapsedHeight) || 0;
      if (!collapsedHeight) {
        this.setData({
          componentStatusChartExpanded: false,
          componentStatusVisibleCategoryItems: visibleChart.items,
          componentStatusAriaLabel: visibleChart.ariaLabel,
          componentStatusChartToggleLabel: '查看更多',
          componentStatusChartToggleIcon: 'chevron-down',
          componentStatusChartTransitioning: false
        }, function collapsedWithoutCachedHeight() {
          self.scheduleMeasureComponentStatusChart();
        });
        return true;
      }
      this.setData({
        componentStatusChartExpanded: false,
        componentStatusAriaLabel: visibleChart.ariaLabel,
        componentStatusChartToggleLabel: '查看更多',
        componentStatusChartToggleIcon: 'chevron-down',
        componentStatusChartTransitioning: true,
        componentStatusChartViewportStyle: 'height:' + collapsedHeight + 'px;'
      });
      return true;
    }
    this.setData({
      componentStatusChartExpanded: true,
      componentStatusVisibleCategoryItems: visibleChart.items,
      componentStatusAriaLabel: visibleChart.ariaLabel,
      componentStatusChartToggleLabel: '收起',
      componentStatusChartToggleIcon: 'chevron-up',
      componentStatusChartTransitioning: true
    }, function expandedItemsCommitted() {
      var measureExpanded = function measureExpanded() {
        self.measureComponentStatusChart(function applyExpandedHeight(height) {
          self._componentStatusChartExpandedHeight = height;
          self.setData({
            componentStatusChartViewportStyle: 'height:' + height + 'px;'
          });
        });
      };
      if (typeof wx.nextTick === 'function') {
        wx.nextTick(measureExpanded);
      } else {
        setTimeout(measureExpanded, 0);
      }
    });
    return true;
  },

  onComponentStatusChartTransitionEnd: function onComponentStatusChartTransitionEnd(event) {
    var propertyName = event && event.detail && event.detail.propertyName;
    if (propertyName && propertyName !== 'height') return;
    if (this.data.componentStatusChartExpanded) {
      this.setData({ componentStatusChartTransitioning: false });
      return;
    }
    var chart = this._componentStatusChart || {
      items: this.data.componentStatusCategoryItems,
      ariaPrefix: this.data.componentStatusAriaPrefix
    };
    var visibleChart = visibleCategoryChart(chart, false);
    this.setData({
      componentStatusVisibleCategoryItems: visibleChart.items,
      componentStatusAriaLabel: visibleChart.ariaLabel,
      componentStatusChartTransitioning: false
    });
  },

  syncPageLayout: function syncPageLayout() {
    var layout = tabbarPageLayout.getLayout();
    var contentHeight = layout.contentHeightStyle;
    var announcementPopupStyle = 'max-height:calc(100vh - ' + layout.navbarHeight + 'px - 24rpx);';
    if (
      this.data.contentHeight === contentHeight &&
      this.data.announcementPopupStyle === announcementPopupStyle &&
      this.data.layoutReady
    ) {
      return false;
    }
    this.setData({
      contentHeight: contentHeight,
      announcementPopupStyle: announcementPopupStyle,
      layoutReady: true
    });
    return true;
  },

  onTabChange: function onTabChange(event) {
    var value = event && event.detail ? event.detail.value : '';
    tabbarNavigation.navigateToTab(value, this.data.activeTab);
  }
});
