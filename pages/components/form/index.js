var createComponentPage = require('../../../utils/component-page');

function nextData(current, patch) {
  return Object.assign({}, current, patch);
}

Page(createComponentPage({
  title: 'Form',
  data: {
    formData: { componentName: '', publicRelease: false },
    formRules: {
      componentName: [{ required: true, message: '请输入组件名称' }, { min: 3, message: '至少输入 3 个字符' }]
    },
    formStatus: '填写完成后，可先在本页检查内容。'
  },
  methods: {
    onFormNameChange: function (event) {
      var value = event && event.detail ? String(event.detail.value || '') : '';
      this.setData({ formData: nextData(this.data.formData, { componentName: value }), formStatus: value ? '已填写组件名称。' : '组件名称不能为空。' });
    },
    onFormReleaseChange: function (event) {
      var value = Boolean(event && event.detail && event.detail.value);
      this.setData({ formData: nextData(this.data.formData, { publicRelease: value }), formStatus: value ? '将作为公开组件提交。' : '将作为当前草稿提交。' });
    },
    onFormValidate: function (event) {
      var valid = Boolean(event && event.detail && event.detail.valid);
      this.setData({ formStatus: valid ? '本地校验通过，尚未执行任何发布动作。' : '请按字段提示补全内容。' });
    },
    onFormSubmit: function (event) {
      var valid = Boolean(event && event.detail && event.detail.valid);
      this.setData({ formStatus: valid ? '本地校验通过，尚未执行任何发布动作。' : '内容未提交，请先修正错误。' });
    },
    onFormReset: function (event) {
      var data = event && event.detail && event.detail.data ? event.detail.data : { componentName: '', publicRelease: false };
      this.setData({ formData: data, formStatus: '已恢复为空白表单。' });
    }
  }
}));
