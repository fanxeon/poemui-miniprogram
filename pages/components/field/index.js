var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Field',
  data: { fieldValue: '', fieldStatus: 'default', fieldMessage: '', fieldSummary: '输入后会立即检查长度。' },
  methods: {
    onFieldValueChange: function (event) {
      var value = event && event.detail ? String(event.detail.value || '') : '';
      var invalid = value.length > 0 && value.length < 3;
      this.setData({ fieldValue: value, fieldStatus: invalid ? 'error' : 'default', fieldMessage: invalid ? '至少输入 3 个字符' : '', fieldSummary: invalid ? '名称太短，请继续输入。' : (value ? '名称长度合适。' : '输入后会立即检查长度。') });
    }
  }
}));
