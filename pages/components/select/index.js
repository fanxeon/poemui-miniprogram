var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Select',
  data: { selectValue: 'stable', selectOptions: [{ label: '稳定版', value: 'stable' }, { label: '预览版', value: 'preview' }], selectStatus: '当前发布通道：稳定版。' },
  methods: {
    onSelectChange: function (event) { var value = event && event.detail ? event.detail.value : ''; this.setData({ selectValue: value, selectStatus: value === 'preview' ? '当前发布通道：预览版。' : '当前发布通道：稳定版。' }); }
  }
}));
