var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Picker',
  data: {
    pickerVisible: false,
    pickerValue: ['stable'],
    pickerColumns: [[{ label: '稳定版', value: 'stable' }, { label: '预览版', value: 'preview' }]],
    pickerStatus: '当前选择：稳定版。'
  },
  methods: {
    onOpenPicker: function () { this.setData({ pickerVisible: true, pickerStatus: '滚动查看选项，确认后才会更改。' }); },
    onPickerVisibleChange: function (event) { var visible = Boolean(event && event.detail && event.detail.visible); this.setData({ pickerVisible: visible }); },
    onPickerChange: function (event) { var value = event && event.detail && event.detail.value ? event.detail.value : this.data.pickerValue; this.setData({ pickerValue: value, pickerStatus: value[0] === 'preview' ? '当前选择：预览版。' : '当前选择：稳定版。' }); },
    onPickerCancel: function () { this.setData({ pickerStatus: '已取消，原来的选择保持不变。' }); }
  }
}));
