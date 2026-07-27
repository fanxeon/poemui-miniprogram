var tabbarNavigation = require('../../common/utils/tabbar-navigation');
var backgroundPreference = require('../../common/utils/page-background-preference');
var userProfile = require('../../common/utils/user-profile');
var updateAnnouncements = require('../../common/services/update-announcements');

var SHISHANG_APP_ID = 'wxa1b9a4d6549c6cd1';
var ANNOUNCEMENTS = updateAnnouncements.initial();
var LATEST_ANNOUNCEMENT = updateAnnouncements.latest(ANNOUNCEMENTS);

function getWindowHeight() {
  return wx.getWindowInfo ? Number(wx.getWindowInfo().windowHeight) : 0;
}

function avatarText(nickname) {
  return Array.from(String(nickname || userProfile.DEFAULT_NICKNAME))[0] || 'P';
}

Page({
  data: {
    activeTab: 'me',
    tabbarItems: tabbarNavigation.getItems(),
    nickname: userProfile.DEFAULT_NICKNAME,
    nicknameDraft: userProfile.DEFAULT_NICKNAME,
    nicknameError: '',
    avatarText: 'P',
    announcements: ANNOUNCEMENTS,
    latestAnnouncementVersion: LATEST_ANNOUNCEMENT ? LATEST_ANNOUNCEMENT.version : '',
    announcementSource: 'local',
    announcementSyncError: '',
    announcementLoadingState: 'idle',
    announcementPopupVisible: false,
    announcementScrollTop: 0,
    announcementPopupStyle: '',
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
    this.restoreProfile();
    this.loadAnnouncements();
  },

  onShow: function onShow() {
    this.restoreProfile();
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

  restoreProfile: function restoreProfile() {
    var profile = userProfile.restore();
    var nickname = profile.nickname || userProfile.DEFAULT_NICKNAME;
    this.setData({
      nickname: nickname,
      nicknameDraft: nickname,
      nicknameError: '',
      avatarText: avatarText(nickname)
    });
  },

  onNicknameChange: function onNicknameChange(event) {
    var value = event && event.detail ? String(event.detail.value || '') : '';
    this.setData({ nicknameDraft: value, nicknameError: '' });
  },

  onSaveNickname: function onSaveNickname(event) {
    var eventValue = event && event.detail && event.detail.value;
    var draft = eventValue === undefined ? this.data.nicknameDraft : eventValue;
    var nickname = String(draft || '').trim();
    if (!nickname) {
      this.setData({ nicknameError: '昵称不能为空' });
      this.showToast('请输入昵称', 'warning');
      return false;
    }
    var result = userProfile.setNickname(nickname);
    if (!result.saved) {
      this.setData({ nicknameError: '昵称保存失败，请重试' });
      this.showToast('昵称保存失败', 'error');
      return false;
    }
    this.setData({
      nickname: result.profile.nickname,
      nicknameDraft: result.profile.nickname,
      nicknameError: '',
      avatarText: avatarText(result.profile.nickname)
    });
    this.showToast('昵称已保存', 'success');
    return true;
  },

  onPurchaseLicense: function onPurchaseLicense() {
    this.showToast('授权详情正在准备中', 'warning');
  },

  onOpenOrders: function onOpenOrders() {
    this.showToast('订单服务尚未开放', 'warning');
  },

  onOpenAnnouncements: function onOpenAnnouncements() {
    this.setData({ announcementPopupVisible: true, announcementScrollTop: 0 });
    this.loadAnnouncements();
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
