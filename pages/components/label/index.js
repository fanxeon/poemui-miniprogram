var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'Label',
  data: { labelRequired: true, labelColon: false, labelSummary: '当前显示必填标记，不显示冒号。' },
  methods: {
    onLabelRequiredChange: function (event) {
      var required = Boolean(event && event.detail && event.detail.value);
      this.setData({ labelRequired: required, labelSummary: required ? '已显示必填标记。' : '已隐藏必填标记。' });
    },
    onLabelColonChange: function (event) {
      var colon = Boolean(event && event.detail && event.detail.value);
      this.setData({ labelColon: colon, labelSummary: colon ? '已显示中文冒号。' : '已隐藏中文冒号。' });
    }
  }
}));
