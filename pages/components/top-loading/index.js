var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'TopLoading',
  data: {
    taskState: 'idle',
    taskProgress: null,
    taskStatus: '等待开始；TopLoading 只反馈当前 Card 内的任务。',
    reduceMotion: false
  },
  onUnload: function () {
    clearInterval(this._progressTimer);
  },
  methods: {
    clearProgressTimer: function () {
      clearInterval(this._progressTimer);
      this._progressTimer = null;
    },
    onStartUnknown: function () {
      this.clearProgressTimer();
      this.setData({ taskState: 'loading', taskProgress: null, taskStatus: '正在处理未知总量任务。' });
    },
    onStartExact: function () {
      var self = this;
      this.clearProgressTimer();
      this.setData({ taskState: 'loading', taskProgress: 0, taskStatus: '精确进度从 0% 开始。' });
      this._progressTimer = setInterval(function () {
        var progress = Math.min(90, Number(self.data.taskProgress || 0) + 10);
        self.setData({ taskProgress: progress, taskStatus: '当前精确进度 ' + progress + '%；不会自动宣布成功。' });
        if (progress >= 90) self.clearProgressTimer();
      }, 500);
    },
    onComplete: function () {
      this.clearProgressTimer();
      this.setData({ taskState: 'success', taskProgress: 100, taskStatus: '调用方已显式确认完成；轨道填满后会真实退场。' });
    },
    onCancel: function () {
      this.clearProgressTimer();
      this.setData({ taskState: 'idle', taskStatus: '任务已失败或取消；组件不会显示成功色。' });
    },
    onToggleMotion: function () {
      var reduceMotion = !this.data.reduceMotion;
      this.setData({ reduceMotion: reduceMotion, taskStatus: reduceMotion ? '低动效已开启，过渡压缩为 1ms。' : '标准 500ms 动效已恢复。' });
    }
  }
}));
