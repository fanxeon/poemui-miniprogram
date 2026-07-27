# 小程序表单组件分区页面合同

表单组件分区的 `Form / Field / Label / Input / InputOTP / Textarea / Search / Checkbox / Radio / Switch / Select / Picker / Combobox / Slider / Stepper / Rate / Calendar / DateTimePicker / Upload` 均已迁入独立小程序页。

Stepper 独立页必须在微信 WebView 运行态确认 `minus / value / plus` 三段连续且顺序正确，并让三组主控件在透明页面轨中水平居中；不能仅以 WXML 源顺序或 H5 Flex 结果代替小程序自定义组件宿主几何验收。

- 每页复用全局 `pui-config-provider`、共享详情页 Navbar、唯一页面 `pui-scroll-area` 与 `component-page-section`；页面层不手写原生表单控件。
- 输入、选择、日期和数值类组件均以页面 data 回写公开值。Picker / DateTimePicker 先打开受控可见状态，确认或取消再回写页面状态。
- Form 只报告本地校验结果，不能把 `submit` 说成发布、保存或网络成功。
- Upload 只调用微信本地文件选择并回传 `files`；示例明确不包含服务器上传，也不伪造上传成功。单文件失败只显示一次原因和右侧文字重试，点击只请求业务重新上传，组件不会自动清除失败。
- 每页以一个明确填写或选择任务为视觉中心，并补充只读、禁用、错误、取消或本地文件状态中的至少一项关键边界；Checkbox/Radio 分别使用真实 Group 呈现多选与单选互斥。
- Checkbox/Radio 的 options 文案必须在微信运行态真实显示，不能把 Prop 文本当成具名 Slot fallback；InputOTP 在全局边框关闭时仍须以 muted Surface 显示每个输入格。
- Select 的 Trigger、Popup 和 Option 都复用 PUI Button/Popup/Icon；系统 `picker` 不再作为 Select 的可见界面。滚轮、多列与确认式任务继续使用 Picker。
- Picker / DateTimePicker 的 `type=default` 弹层必须复用 PUI Popup 三列 Header：左侧 primary Check 圆形图标确认、标题居中、右侧 default Close 圆形图标取消，滚轮位于 Content；`type=classic` 才在 Footer 提供两列取消 / 确定。Calendar 月份导航必须同时显示左右两个 IconButton。

```sh
npm run test:miniprogram:form-pages
node scripts/test-miniprogram-component-page-quality.js
node scripts/test-form.js
node scripts/test-field.js
node scripts/test-input.js
node scripts/test-input-otp.js
node scripts/test-textarea.js
node scripts/test-search.js
node scripts/test-checkbox.js
node scripts/test-radio.js
node scripts/test-switch.js
node scripts/test-select.js
node scripts/test-picker.js
node scripts/test-combobox.js
node scripts/test-slider.js
node scripts/test-stepper.js
node scripts/test-rate.js
node scripts/test-calendar.js
node scripts/test-date-time-picker.js
node scripts/test-upload.js
```

逐页场景与关键边界见 `docs/MINIPROGRAM_COMPONENT_PAGE_ACCEPTANCE.md`。390px 微信模拟器和 iOS/Android 真机仍需验证键盘顶起、Select/Picker/Calendar 遮罩、组合框展开、滑块/评分触摸命中，以及文件选择、预览、取消和权限拒绝路径。
