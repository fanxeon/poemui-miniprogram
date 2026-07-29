var LICENSE_URL = 'https://poemcoder.com/poem-ui';

Page({
  data: {
    licenseUrl: LICENSE_URL
  },

  onWebViewError: function onWebViewError() {
    wx.showModal({
      title: '页面打开失败',
      content: '请检查网络后重试，或复制链接到浏览器打开。',
      cancelText: '返回',
      confirmText: '复制链接',
      success: function success(result) {
        if (result && result.confirm && typeof wx.setClipboardData === 'function') {
          wx.setClipboardData({ data: LICENSE_URL });
          return;
        }
        if (typeof wx.navigateBack === 'function') wx.navigateBack();
      }
    });
  }
});
