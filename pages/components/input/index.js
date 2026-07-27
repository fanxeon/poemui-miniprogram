var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Input',
  data: { inputValue: '', inputStatus: '输入后可清除，也可按键盘确认。' },
  methods: {
    onInputChange: function (event) { var value = event && event.detail ? String(event.detail.value || '') : ''; this.setData({ inputValue: value, inputStatus: value ? '已输入：' + value : '输入已清空。' }); },
    onInputClear: function () { this.setData({ inputValue: '', inputStatus: '内容已清空。' }); },
    onInputEnter: function (event) { var value = event && event.detail ? String(event.detail.value || '') : this.data.inputValue; this.setData({ inputStatus: value ? '已收到确认输入：' + value : '没有可确认的输入内容。' }); }
  }
}));
