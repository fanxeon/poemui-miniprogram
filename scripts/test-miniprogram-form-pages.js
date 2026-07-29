'use strict';

var assert = require('assert');
var fs = require('fs');
var path = require('path');
var vm = require('vm');
var ROOT = path.resolve(__dirname, '..');
var pages = ['form', 'field', 'label', 'input', 'input-otp', 'textarea', 'search', 'checkbox', 'radio', 'switch', 'select', 'picker', 'combobox', 'slider', 'stepper', 'rate', 'calendar', 'date-time-picker', 'upload'];

function read(relativePath) { return fs.readFileSync(path.join(ROOT, relativePath), 'utf8'); }
function load(name) {
  var page;
  vm.runInNewContext(read('miniprogram/pages/components/' + name + '/index.js'), {
    Page: function (definition) { page = definition; },
    require: function (request) { if (request === '../../../utils/component-page') return function (config) { return Object.assign({ data: config.data || {} }, config.methods || {}); }; throw new Error('Unexpected form page dependency: ' + request); },
    Array: Array, Object: Object, Number: Number, String: String, Boolean: Boolean, Date: Date
  }, { filename: name + '/index.js' });
  assert.ok(page, name + ' 必须注册 Page');
  page.data = JSON.parse(JSON.stringify(page.data));
  page.setData = function (next) { Object.assign(page.data, next); };
  return page;
}

pages.forEach(function (name) {
  var base = 'miniprogram/pages/components/' + name + '/index';
  var wxml = read(base + '.wxml');
  var json = JSON.parse(read(base + '.json'));
  assert.ok(wxml.indexOf('<pui-config-provider') !== -1 && wxml.indexOf('use-global-config') !== -1, name + ' 必须继承全局外观');
  assert.ok(wxml.indexOf('<component-page-navbar title="{{pageTitle}}" bind:back="onBack" />') !== -1, name + ' 必须使用共享 Navbar');
  assert.ok(wxml.indexOf('<pui-scroll-area') !== -1 && wxml.indexOf('<scroll-view') === -1, name + ' 必须只有一个页面 ScrollArea');
  assert.ok(wxml.indexOf('<button') === -1 && wxml.indexOf('<input') === -1 && wxml.indexOf('<textarea') === -1 && wxml.indexOf('<select') === -1, name + ' 页面不得手写原生表单控件');
  assert.ok(wxml.indexOf('<component-page-section') !== -1, name + ' 必须复用共享详情页分区');
  assert.ok(json.usingComponents['component-page-navbar'] && json.usingComponents['component-page-section'], name + ' 必须注册共享页面设施');
});

var form = load('form');
form.onFormNameChange({ detail: { value: 'Dialog' } }); assert.strictEqual(form.data.formData.componentName, 'Dialog');
form.onFormReleaseChange({ detail: { value: true } }); assert.strictEqual(form.data.formData.publicRelease, true);
form.onFormSubmit({ detail: { valid: true } }); assert.ok(form.data.formStatus.indexOf('本地校验通过') !== -1 && form.data.formStatus.indexOf('发布成功') === -1);
form.onFormReset({ detail: { data: { componentName: '', publicRelease: false } } }); assert.strictEqual(form.data.formData.componentName, '');

var field = load('field'); field.onFieldValueChange({ detail: { value: 'ab' } }); assert.strictEqual(field.data.fieldStatus, 'error'); field.onFieldValueChange({ detail: { value: 'abc' } }); assert.strictEqual(field.data.fieldStatus, 'default');
var label = load('label'); label.onLabelRequiredChange({ detail: { value: false } }); assert.strictEqual(label.data.labelRequired, false); label.onLabelColonChange({ detail: { value: true } }); assert.strictEqual(label.data.labelColon, true);
var input = load('input'); input.onInputChange({ detail: { value: 'Button' } }); assert.strictEqual(input.data.inputValue, 'Button'); input.onInputClear(); assert.strictEqual(input.data.inputValue, '');
var otp = load('input-otp'); otp.onOtpChange({ detail: { value: '123456' } }); assert.strictEqual(otp.data.otpValue, '123456'); otp.onOtpComplete({ detail: { value: '123456' } }); assert.ok(otp.data.otpStatus.indexOf('不会验证') !== -1);
var textareaWxml = read('miniprogram/pages/components/textarea/index.wxml');
assert.ok(textareaWxml.indexOf('id="textarea-primary"') !== -1, 'Textarea 主示例必须保留真实运行态量测锚点');
var textarea = load('textarea'); textarea.onTextareaChange({ detail: { value: '多行内容' } }); assert.strictEqual(textarea.data.textareaValue, '多行内容'); assert.strictEqual(typeof textarea.onTextareaClear, 'undefined');
var search = load('search'); assert.ok(read('miniprogram/pages/components/search/index.wxml').indexOf('id="search-primary"') !== -1, 'Search 主示例必须保留真实运行态量测锚点'); search.onSearchChange({ detail: { value: 'tabs' } }); assert.strictEqual(search.data.searchValue, 'tabs'); search.onSearchConfirm({ detail: { value: 'tabs' } }); assert.ok(search.data.searchStatus.indexOf('tabs') !== -1); search.onSearchCancel(); assert.strictEqual(search.data.searchValue, '');
var checkbox = load('checkbox'); checkbox.onCheckboxChange({ detail: { checked: true } }); assert.strictEqual(checkbox.data.checkboxChecked, true);
var radio = load('radio'); radio.onRadioChange({ currentTarget: { dataset: { value: 'preview' } }, detail: { checked: true } }); assert.strictEqual(radio.data.radioValue, 'preview');
var switchPage = load('switch'); switchPage.onSwitchChange({ detail: { value: true } }); assert.strictEqual(switchPage.data.switchValue, true);
var select = load('select'); assert.strictEqual(select.data.selectOptions.length, 4); select.onSelectChange({ detail: { value: 'candidate' } }); assert.strictEqual(select.data.selectValue, 'candidate'); assert.ok(select.data.selectStatus.indexOf('候选版') !== -1);
var picker = load('picker'); assert.strictEqual(picker.data.pickerColumns[0].length, 4); picker.onOpenPicker(); assert.strictEqual(picker.data.pickerVisible, true); picker.onPickerChange({ detail: { value: ['candidate'] } }); assert.deepStrictEqual(picker.data.pickerValue, ['candidate']); assert.strictEqual(picker.data.pickerValueLabel, '候选版'); picker.onPickerVisibleChange({ detail: { visible: false } }); assert.strictEqual(picker.data.pickerVisible, false);
var combobox = load('combobox'); combobox.onComboboxVisibleChange({ detail: { visible: true } }); assert.strictEqual(combobox.data.comboboxVisible, true); combobox.onComboboxChange({ detail: { value: 'search' } }); assert.strictEqual(combobox.data.comboboxValue, 'search');
var slider = load('slider'); slider.onSliderChanging({ detail: { value: 55 } }); assert.strictEqual(slider.data.sliderValue, 55); slider.onSliderChange({ detail: { value: 60 } }); assert.strictEqual(slider.data.sliderValue, 60);
var stepper = load('stepper'); stepper.onStepperChange({ detail: { value: 2 } }); assert.strictEqual(stepper.data.stepperValue, 2); stepper.onStepperOverlimit({ detail: { type: 'plus' } }); assert.ok(stepper.data.stepperStatus.indexOf('最大') !== -1);
assert.strictEqual((read('miniprogram/pages/components/stepper/index.wxml').match(/component-page__inline--center/g) || []).length, 3, 'Stepper 页面三组演示都必须水平居中');
var rate = load('rate'); rate.onRateChange({ detail: { value: 4.5 } }); assert.strictEqual(rate.data.rateValue, 4.5);
var calendar = load('calendar'); calendar.onCalendarChange({ detail: { value: '2026-07-27' } }); assert.strictEqual(calendar.data.calendarValue, '2026-07-27'); calendar.onCalendarConfirm({ detail: { value: '2026-07-27' } }); assert.ok(calendar.data.calendarStatus.indexOf('确认') !== -1);
var dateTime = load('date-time-picker'); dateTime.onOpenDateTimePicker(); assert.strictEqual(dateTime.data.dateTimeVisible, true); dateTime.onDateTimeChange({ detail: { value: 1785056400000 } }); assert.strictEqual(dateTime.data.dateTimeValue, 1785056400000); dateTime.onDateTimeVisibleChange({ detail: { visible: false } }); assert.strictEqual(dateTime.data.dateTimeVisible, false);
var upload = load('upload'); upload.onUploadChange({ detail: { files: [{ name: 'demo.png' }] } }); assert.strictEqual(upload.data.uploadFiles.length, 1); assert.ok(upload.data.uploadStatus.indexOf('未上传到服务器') !== -1); upload.onUploadAdd({ detail: { addedFiles: [{ name: 'demo.png' }] } }); assert.ok(upload.data.uploadStatus.indexOf('尚未上传') !== -1); upload.onUploadRetry({ detail: { file: { name: '真机截图.png' } } }); assert.ok(upload.data.uploadStateStatus.indexOf('等待业务重新上传') !== -1); assert.strictEqual(upload.data.uploadStateFiles[2].status, 'error'); assert.ok(read('miniprogram/pages/components/upload/index.wxml').indexOf('id="upload-state-demo"') !== -1);

console.log('miniprogram form page contract tests passed');
