var createComponentPage = require('../../../utils/component-page');

var DROPDOWN_ITEMS = [
  {
    key: 'framework',
    label: '框架',
    options: [
      { label: '原生小程序', value: 'native' },
      { label: 'H5 镜像', value: 'h5' }
    ]
  },
  {
    key: 'mode',
    label: '模式',
    options: [
      { label: '默认', value: 'default' },
      { label: '紧凑', value: 'compact' }
    ]
  }
];

Page(createComponentPage({
  title: 'DropdownMenu',
  data: {
    dropdownItems: DROPDOWN_ITEMS,
    dropdownValue: { framework: 'native', mode: 'default' },
    lastAction: '打开下拉菜单选择筛选项。'
  },
  methods: {
    onDropdownChange: function (event) {
      var value = event && event.detail ? event.detail.value : {};
      this.setData({ dropdownValue: value, lastAction: '筛选已更新' });
    }
  }
}));
