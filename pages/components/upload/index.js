var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Upload',
  data: {
    uploadFiles: [],
    uploadStateFiles: [
      { path: '/assets/poemui-moon-lines-black.png', name: '组件封面.png', status: 'ready', size: 184320 },
      { path: '/assets/poemui-moon-lines-black.png?uploading', name: '深色预览.png', status: 'uploading', progress: 64, size: 225280 },
      { path: '/assets/poemui-moon-lines-black.png?error', name: '真机截图.png', status: 'error', message: '网络中断', size: 143360 }
    ],
    uploadStatus: '尚未选择图片。',
    uploadStateStatus: '失败项尚未重新上传。'
  },
  methods: {
    onUploadChange: function (event) { var files = event && event.detail && Array.isArray(event.detail.files) ? event.detail.files : []; this.setData({ uploadFiles: files, uploadStatus: '文件列表已由页面回写，共 ' + files.length + ' 个；未上传到服务器。' }); },
    onUploadAdd: function (event) { var added = event && event.detail && Array.isArray(event.detail.addedFiles) ? event.detail.addedFiles.length : 0; this.setData({ uploadStatus: '已接收 ' + added + ' 个本地文件；尚未上传到服务器。' }); },
    onUploadReject: function () { this.setData({ uploadStatus: '部分文件未通过本地数量、类型或大小限制。' }); },
    onUploadError: function (event) { var message = event && event.detail && event.detail.message ? event.detail.message : '文件选择未完成'; this.setData({ uploadStatus: message + '。' }); },
    onUploadRetry: function (event) {
      var file = event && event.detail && event.detail.file;
      var name = file && file.name ? file.name : '失败文件';
      this.setData({ uploadStateStatus: '已请求重试「' + name + '」；等待业务重新上传，失败状态不会被组件自动清除。' });
    }
  }
}));
