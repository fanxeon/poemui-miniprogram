var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Checkbox',
  data: {
    checkboxChecked: false,
    checkboxValues: ['theme'],
    checkboxOptions: [
      { label: '深色主题', value: 'theme', content: '跟随系统外观。' },
      { label: '低动效', value: 'motion', content: '减少位移动画。' },
      { label: '实验能力', value: 'preview', content: '最多选择两项。' }
    ],
    checkboxStatus: '已选择 1 项，最多可选择 2 项。'
  },
  methods: {
    onCheckboxGroupChange: function (event) {
      var value = event && event.detail && Array.isArray(event.detail.value) ? event.detail.value : [];
      this.setData({ checkboxValues: value, checkboxStatus: '已选择 ' + value.length + ' 项，最多可选择 2 项。' });
    },
    onCheckboxChange: function (event) {
      var checked = Boolean(event && event.detail && event.detail.checked);
      this.setData({ checkboxChecked: checked, checkboxStatus: checked ? '已选择当前选项。' : '已取消当前选项。' });
    }
  }
}));
