var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Calendar',
  data: { calendarValue: '2026-07-27', calendarStatus: '当前发布日期：2026-07-27。' },
  methods: {
    onCalendarChange: function (event) { var value = event && event.detail ? event.detail.value : ''; this.setData({ calendarValue: value, calendarStatus: '已选择日期：' + value + '。' }); },
    onCalendarConfirm: function (event) { var value = event && event.detail ? event.detail.value : this.data.calendarValue; this.setData({ calendarStatus: '已确认日期：' + value + '。' }); }
  }
}));
