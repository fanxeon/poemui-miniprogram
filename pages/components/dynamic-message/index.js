var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'DynamicMessage',
  data: {
    notificationStatus: '选择一个真实入口查看通知；页面滚动不会被阻断。',
    updatePercent: 0,
    reduceMotion: false,
    feedRows: [1, 2, 3, 4, 5, 6, 7, 8]
  },
  methods: {
    getDynamicMessage: function () {
      return this.selectComponent('#dynamic-message');
    },
    onStartTask: function () {
      this.getDynamicMessage().show({
        key: 'component-build',
        theme: 'loading',
        title: '正在生成组件',
        message: '分析源码并同步 H5 与小程序实现。',
        duration: 0
      });
      this.setData({ updatePercent: 0, notificationStatus: 'loading 通知持续显示，等待真实 update。' });
    },
    onUpdateTask: function () {
      var percent = Math.min(90, this.data.updatePercent + 30);
      var updated = this.getDynamicMessage().update('component-build', {
        theme: 'info',
        title: '正在生成组件',
        message: '双端交付进度 ' + percent + '%。',
        duration: 0
      });
      this.setData({ updatePercent: updated ? percent : this.data.updatePercent, notificationStatus: updated ? '相同 key 已在原节点更新到 ' + percent + '%。' : '当前没有 component-build 消息，请先开始生成。' });
    },
    onCompleteTask: function () {
      var updated = this.getDynamicMessage().update('component-build', {
        theme: 'success',
        title: '组件已生成',
        message: '合同测试通过，正在准备最终产物。',
        duration: 3000
      });
      this.setData({ notificationStatus: updated ? '真实 success 已写入，同一节点稍后自动退场。' : '当前没有可完成的生成任务。' });
    },
    onFailTask: function () {
      var updated = this.getDynamicMessage().update('component-build', {
        theme: 'error',
        title: '构建未通过',
        message: '请查看失败项并重试。',
        actionText: '查看',
        duration: 0
      });
      this.setData({ notificationStatus: updated ? '错误原位替换；Action 只发布事件，不伪造修复。' : '当前没有可标记失败的生成任务。' });
    },
    onQueueMessage: function () {
      var key = 'queue-' + Date.now();
      this.getDynamicMessage().show({ key: key, theme: 'warning', title: '等待发布', message: '上一条通知退场后按顺序展示。', duration: 3000 });
      this.setData({ notificationStatus: '消息 ' + key + ' 已进入真实队列。' });
    },
    onCloseCurrent: function () {
      var hidden = this.getDynamicMessage().hide();
      this.setData({ notificationStatus: hidden ? '当前通知正在播放退场。' : '当前没有可关闭的通知。' });
    },
    onNotificationClick: function (event) {
      this.setData({ notificationStatus: 'click：' + event.detail.key + '，主题 ' + event.detail.theme + '。' });
    },
    onNotificationAction: function (event) {
      this.setData({ notificationStatus: 'action：' + event.detail.key + '；业务页面决定下一步。' });
    },
    onNotificationClose: function (event) {
      this.setData({ notificationStatus: 'close：' + event.detail.key + '，原因 ' + event.detail.reason + '。' });
    },
    onToggleMotion: function () {
      var reduceMotion = !this.data.reduceMotion;
      this.setData({ reduceMotion: reduceMotion, notificationStatus: reduceMotion ? '低动效已开启，进退场压缩为 1ms。' : '标准 500ms 灵动动效已恢复。' });
    }
  }
}));
