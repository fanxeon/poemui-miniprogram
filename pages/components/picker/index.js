var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Picker',
  data: {
    pickerVisible: false,
    pickerType: 'default',
    pickerValue: ['stable'],
    pickerValueLabel: '稳定版',
    pickerColumns: [[
      { label: '稳定版', value: 'stable' },
      { label: '候选版', value: 'candidate' },
      { label: '测试版', value: 'beta' },
      { label: '开发版', value: 'canary' }
    ]],
    pickerStatus: '当前选择：稳定版。'
  },
  methods: {
    onOpenPicker: function (event) {
      var type = event && event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.type === 'classic' ? 'classic' : 'default';
      this.setData({ pickerVisible: true, pickerType: type, pickerStatus: type === 'classic' ? 'Classic：取消与确定显示在底部操作区。' : '默认：确定在 Header 左侧，取消在 Header 右侧。' });
    },
    onPickerVisibleChange: function (event) { var visible = Boolean(event && event.detail && event.detail.visible); this.setData({ pickerVisible: visible }); },
    onPickerChange: function (event) {
      var value = event && event.detail && event.detail.value ? event.detail.value : this.data.pickerValue;
      var labels = { stable: '稳定版', candidate: '候选版', beta: '测试版', canary: '开发版' };
      var label = labels[value[0]] || '未选择';
      this.setData({ pickerValue: value, pickerValueLabel: label, pickerStatus: '当前选择：' + label + '。' });
    },
    onPickerCancel: function () { this.setData({ pickerStatus: '已取消，原来的选择保持不变。' }); }
  }
}));
