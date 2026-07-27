var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'DateTimePicker',
  data: {
    dateTimeVisible: false,
    dateTimeType: 'default',
    dateTimeValue: Date.parse('2026-07-27T09:00:00'),
    dateTimeMode: ['date', 'minute'],
    dateTimeSteps: { minute: 5 },
    dateTimeStatus: '当前安排：2026-07-27 09:00。'
  },
  methods: {
    onOpenDateTimePicker: function (event) {
      var type = event && event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.type === 'classic' ? 'classic' : 'default';
      this.setData({
        dateTimeVisible: true,
        dateTimeType: type,
        dateTimeStatus: type === 'classic' ? 'Classic：取消与确定显示在底部操作区。' : '默认：确认图标在 Header 左侧，关闭图标在 Header 右侧。'
      });
    },
    onDateTimeVisibleChange: function (event) { this.setData({ dateTimeVisible: Boolean(event && event.detail && event.detail.visible) }); },
    onDateTimeChange: function (event) { var value = Number(event && event.detail && event.detail.value); this.setData({ dateTimeValue: value, dateTimeStatus: '已更新发布时间。' }); },
    onDateTimeCancel: function () { this.setData({ dateTimeStatus: '已取消，原来的发布时间保持不变。' }); }
  }
}));
