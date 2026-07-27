var createComponentPage = require('../../../utils/component-page');

Page(createComponentPage({
  title: 'InputOTP',
  data: { otpValue: '', otpStatus: '请输入短信中的六位数字。' },
  methods: {
    onOtpChange: function (event) { var value = event && event.detail ? String(event.detail.value || '') : ''; this.setData({ otpValue: value, otpStatus: '当前已输入 ' + value.length + ' 位。' }); },
    onOtpComplete: function (event) { var value = event && event.detail ? String(event.detail.value || '') : this.data.otpValue; this.setData({ otpValue: value, otpStatus: '已完成 6 位输入；此示例不会验证验证码。' }); }
  }
}));
