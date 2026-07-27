var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Picker',
  data: {
    pickerVisible: false,
    pickerType: 'default',
    pickerValue: ['stable'],
    pickerColumns: [[{ label: '稳定版', value: 'stable' }, { label: '预览版', value: 'preview' }]],
    pickerStatus: '当前选择：稳定版。'
  },
  methods: {
    onOpenPicker: function (event) {
      var type = event && event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.type === 'classic' ? 'classic' : 'default';
      this.setData({ pickerVisible: true, pickerType: type, pickerStatus: type === 'classic' ? 'Classic：取消与确定显示在底部操作区。' : '默认：确定在 Header 左侧，取消在 Header 右侧。' });
    },
    onPickerVisibleChange: function (event) { var visible = Boolean(event && event.detail && event.detail.visible); this.setData({ pickerVisible: visible }); },
    onPickerChange: function (event) { var value = event && event.detail && event.detail.value ? event.detail.value : this.data.pickerValue; this.setData({ pickerValue: value, pickerStatus: value[0] === 'preview' ? '当前选择：预览版。' : '当前选择：稳定版。' }); },
    onPickerCancel: function () { this.setData({ pickerStatus: '已取消，原来的选择保持不变。' }); }
  }
}));
