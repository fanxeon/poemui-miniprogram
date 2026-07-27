var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'DateTimePicker',
  data: {
    dateTimeVisible: false,
    dateTimeValue: Date.parse('2026-07-27T09:00:00'),
    dateTimeMode: ['date', 'minute'],
    dateTimeSteps: { minute: 5 },
    dateTimeStatus: '当前安排：2026-07-27 09:00。'
  },
  methods: {
    onOpenDateTimePicker: function () { this.setData({ dateTimeVisible: true, dateTimeStatus: '请选择日期和时间，确认后生效。' }); },
    onDateTimeVisibleChange: function (event) { this.setData({ dateTimeVisible: Boolean(event && event.detail && event.detail.visible) }); },
    onDateTimeChange: function (event) { var value = Number(event && event.detail && event.detail.value); this.setData({ dateTimeValue: value, dateTimeStatus: '已更新发布时间。' }); },
    onDateTimeCancel: function () { this.setData({ dateTimeStatus: '已取消，原来的发布时间保持不变。' }); }
  }
}));
