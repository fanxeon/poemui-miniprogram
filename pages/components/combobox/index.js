var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Combobox',
  data: {
    comboboxVisible: false,
    comboboxValue: 'input',
    comboboxOptions: [
      { label: 'Input', value: 'input', description: '单行文本输入', icon: 'edit' },
      { label: 'Textarea', value: 'textarea', description: '多行文本输入', icon: 'align-left' },
      { label: 'Search', value: 'search', description: '关键词检索', icon: 'search' }
    ],
    comboboxStatus: '当前选择：Input。'
  },
  methods: {
    onComboboxVisibleChange: function (event) { this.setData({ comboboxVisible: Boolean(event && event.detail && event.detail.visible) }); },
    onComboboxChange: function (event) { var value = event && event.detail ? event.detail.value : null; var labels = { input: 'Input', textarea: 'Textarea', search: 'Search' }; this.setData({ comboboxValue: value, comboboxStatus: '当前选择：' + (labels[value] || '未选择') + '。' }); }
  }
}));
