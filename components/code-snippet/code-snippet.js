Component({
  options: {
    styleIsolation: 'shared'
  },
  properties: {
    title: { type: String, value: '代码' },
    code: { type: String, value: '' },
    ariaLabel: { type: String, value: '' }
  },
  data: {
    copyIcon: 'copy',
    copyLabel: '复制代码',
    copyStatus: ''
  },
  lifetimes: {
    detached: function detached() {
      clearTimeout(this._copyStatusTimer);
    }
  },
  methods: {
    onCopy: function onCopy() {
      var code = String(this.data.code || '');
      if (!code) return;
      var requestId = (this._copyRequestId || 0) + 1;
      this._copyRequestId = requestId;
      wx.setClipboardData({
        data: code,
        success: function success() {
          if (this._copyRequestId !== requestId) return;
          this.setCopyState('check', '已复制', '代码已复制');
        }.bind(this),
        fail: function fail() {
          if (this._copyRequestId !== requestId) return;
          this.setCopyState('error-circle', '重新复制', '复制失败');
        }.bind(this)
      });
    },
    setCopyState: function setCopyState(icon, label, status) {
      clearTimeout(this._copyStatusTimer);
      this.setData({
        copyIcon: icon,
        copyLabel: label,
        copyStatus: status
      });
      this._copyStatusTimer = setTimeout(function resetCopyState() {
        this.setData({
          copyIcon: 'copy',
          copyLabel: '复制代码',
          copyStatus: ''
        });
      }.bind(this), 1600);
    }
  }
});
