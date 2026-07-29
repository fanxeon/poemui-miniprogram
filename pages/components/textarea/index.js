var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Textarea',
  data: { textareaValue: '', textareaStatus: '最多可填写 120 个字符。' },
  methods: {
    onTextareaChange: function (event) { var value = event && event.detail ? String(event.detail.value || '') : ''; this.setData({ textareaValue: value, textareaStatus: value ? '已输入 ' + value.length + ' 个字符。' : '尚未输入内容。' }); }
  }
}));
