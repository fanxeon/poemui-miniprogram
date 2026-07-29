var tabbarNavigation = require('../../common/utils/tabbar-navigation');
var backgroundPreference = require('../../common/utils/page-background-preference');
var updateAnnouncements = require('../../common/services/update-announcements');
var componentStatus = require('../../common/data/component-status');
var styleUtilitiesCatalog = require('../../common/data/style-utilities-catalog');
var visualConfig = require('poemui-miniprogram/common/utils/visual-config');

var SHISHANG_APP_ID = 'wxa1b9a4d6549c6cd1';
var LICENSE_PAGE_ROUTE = '/pages/license/index';
var ANNOUNCEMENTS = updateAnnouncements.initial();
var LATEST_ANNOUNCEMENT = updateAnnouncements.latest(ANNOUNCEMENTS);

function dashboardTrendItems() {
  return [
    {
      key: componentStatus.previousVersion,
      label: componentStatus.previousVersion,
      segments: [{
        key: 'components',
        label: '组件总数',
        value: componentStatus.previousTotal,
        theme: 'blue'
      }]
    },
    {
      key: componentStatus.currentVersion,
      label: componentStatus.currentVersion,
      segments: [{
        key: 'components',
        label: '组件总数',
        value: componentStatus.total,
        theme: 'blue'
      }]
    }
  ];
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
    { key: 'advanced', label: '高级', value: componentCategoryValue('advanced') }
  ];
}

function getWindowHeight() {
  return wx.getWindowInfo ? Number(wx.getWindowInfo().windowHeight) : 0;
}

Page({
  data: {
    activeTab: 'me',
    tabbarItems: tabbarNavigation.getItems(),
    componentStatusMetrics: dashboardMetrics(),
    componentStatusTrendItems: dashboardTrendItems(),
    componentStatusMaximum: componentStatus.total,
    componentStatusAnimationDuration: 1000,
    componentStatusMetricsAriaLabel: 'PoemUI 当前有 ' + componentStatus.total + ' 个组件、' + styleUtilitiesCatalog.items.length + ' 个样式和 ' + componentCategoryValue('advanced') + ' 个高级组件',
    componentStatusAriaLabel: 'PoemUI 组件总数从版本 ' + componentStatus.previousVersion + ' 的 ' + componentStatus.previousTotal + ' 个增长到版本 ' + componentStatus.currentVersion + ' 的 ' + componentStatus.total + ' 个，本版新增 ' + componentStatus.incrementTotal + ' 个',
    announcements: ANNOUNCEMENTS,
    latestAnnouncementVersion: LATEST_ANNOUNCEMENT ? LATEST_ANNOUNCEMENT.version : '',
    announcementSource: 'local',
    announcementSyncError: '',
    announcementLoadingState: 'idle',
    announcementPopupVisible: false,
    appearancePopupVisible: false,
    announcementScrollTop: 0,
    announcementPopupStyle: '',
    licenseDialogVisible: false,
    licenseNavigating: false,
    licenseDialogCancelBtn: {
      content: '取消',
      ariaLabel: '取消打开商业授权详情'
    },
    licenseDialogConfirmBtn: {
      content: '前往查看',
      theme: 'primary',
      ariaLabel: '前往 PoemUI 商业授权详情'
    },
    backgroundGradientEnabled: backgroundPreference.get(),
    contentHeight: '1px',
    layoutReady: false
  },

  onLoad: function onLoad() {
    var self = this;
    backgroundPreference.restore();
    this._unsubscribeBackgroundPreference = backgroundPreference.subscribe(function onPreferenceChange(enabled) {
      self.setData({ backgroundGradientEnabled: Boolean(enabled) });
    });
    this._windowResizeHandler = this.onWindowResize.bind(this);
    if (wx.onWindowResize) wx.onWindowResize(this._windowResizeHandler);
    this.loadAnnouncements();
  },

  onShow: function onShow() {
    this.scheduleMeasureLayout();
  },

  onReady: function onReady() {
    this.scheduleMeasureLayout();
  },

  onUnload: function onUnload() {
    clearTimeout(this._measureTimer);
    if (this._unsubscribeBackgroundPreference) this._unsubscribeBackgroundPreference();
    if (wx.offWindowResize && this._windowResizeHandler) wx.offWindowResize(this._windowResizeHandler);
  },

  onPurchaseLicense: function onPurchaseLicense() {
    this.setData({
      appearancePopupVisible: false,
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
      licenseDialogConfirmBtn: {
        content: navigating ? '正在打开' : '前往查看',
        theme: 'primary',
        loading: Boolean(navigating),
        disabled: Boolean(navigating),
        ariaLabel: '前往 PoemUI 商业授权详情'
      }
    });
  },

  onConfirmLicense: function onConfirmLicense() {
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
    this.setData({
      appearancePopupVisible: false,
      announcementPopupVisible: true,
      announcementScrollTop: 0
    });
    this.loadAnnouncements();
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
      self.setData({
        announcements: announcements,
        latestAnnouncementVersion: latest ? latest.version : '',
        announcementSource: result && result.source ? result.source : 'local',
        announcementSyncError: error ? String(error.errMsg || error.message || error) : '',
        announcementLoadingState: result && result.source === 'cloud' && !error ? 'success' : 'idle'
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
    this.scheduleMeasureLayout();
  },

  scheduleMeasureLayout: function scheduleMeasureLayout() {
    clearTimeout(this._measureTimer);
    this._measureTimer = setTimeout(this.measureLayout.bind(this), 0);
  },

  measureLayout: function measureLayout() {
    var windowHeight = getWindowHeight();
    if (!windowHeight || !this.createSelectorQuery) return;
    var query = this.createSelectorQuery();
    query.select('#me-navbar').boundingClientRect();
    query.select('#me-tabbar').boundingClientRect();
    query.exec(function onMeasured(rects) {
      var navbarHeight = rects && rects[0] ? Number(rects[0].height) : 0;
      var tabbarHeight = rects && rects[1] ? Number(rects[1].height) : 0;
      if (!navbarHeight || !tabbarHeight) return;
      this.setData({
        contentHeight: Math.max(1, Math.floor(windowHeight - navbarHeight - tabbarHeight)) + 'px',
        announcementPopupStyle: 'height:calc(100vh - ' + navbarHeight + 'px - 24rpx);',
        layoutReady: true
      });
    }.bind(this));
  },

  onTabChange: function onTabChange(event) {
    var value = event && event.detail ? event.detail.value : '';
    tabbarNavigation.navigateToTab(value, this.data.activeTab);
  }
});
