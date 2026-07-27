var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Radio',
  data: {
    radioValue: 'stable',
    radioOptions: [
      { label: '稳定版', value: 'stable', content: '适合正式项目。' },
      { label: '预览版', value: 'preview', content: '优先体验最新能力。' }
    ],
    radioStatus: '当前选择：稳定版。'
  },
  methods: {
    onRadioGroupChange: function (event) {
      var value = event && event.detail ? event.detail.value : 'stable';
      this.setData({ radioValue: value, radioStatus: value === 'preview' ? '当前选择：预览版。' : '当前选择：稳定版。' });
    },
    onRadioChange: function (event) {
      var value = event && event.currentTarget && event.currentTarget.dataset ? event.currentTarget.dataset.value : 'stable';
      var checked = Boolean(event && event.detail && event.detail.checked);
      if (checked) this.setData({ radioValue: value, radioStatus: '已选择“' + value + '”。' });
    }
  }
}));
