var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Select',
  data: {
    selectValue: 'stable',
    selectOptions: [
      { label: '稳定版', value: 'stable' },
      { label: '候选版', value: 'candidate' },
      { label: '测试版', value: 'beta' },
      { label: '开发版', value: 'canary' }
    ],
    selectStatus: '当前发布通道：稳定版。'
  },
  methods: {
    onSelectChange: function (event) {
      var value = event && event.detail ? event.detail.value : '';
      var labels = { stable: '稳定版', candidate: '候选版', beta: '测试版', canary: '开发版' };
      this.setData({ selectValue: value, selectStatus: '当前发布通道：' + (labels[value] || '未选择') + '。' });
    }
  }
}));
