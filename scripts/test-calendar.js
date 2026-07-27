const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'calendar/calendar.js'), 'utf8');
let definition = null;
const sandbox = {
  console,
  Date,
  isFinite,
  setTimeout: (callback) => { callback(); return 1; },
  clearTimeout: () => {},
  require: () => ({}),
  Component: (value) => { definition = value; },
};
vm.runInNewContext(source, sandbox, { filename: 'calendar/calendar.js' });
assert(definition, 'Calendar component definition must register');

function create(overrides) {
  const defaults = {};
  Object.keys(definition.properties).forEach((key) => { defaults[key] = definition.properties[key].value; });
  const events = [];
  const instance = {
    data: Object.assign({}, definition.data, defaults, { colorScheme: 'light' }, overrides || {}),
    getColorSchemeClass() { return this.data.colorScheme === 'dark' ? 'pui-theme--dark' : 'pui-theme--light'; },
    setData(patch, callback) { Object.assign(this.data, patch); if (callback) callback(); },
    triggerEvent(name, detail) { events.push({ name, detail }); },
  };
  Object.keys(definition.methods).forEach((key) => { instance[key] = definition.methods[key]; });
  definition.lifetimes.attached.call(instance);
  return { instance, events };
}

function tap(instance, key) {
  const index = instance.data.days.findIndex((day) => day.key === key);
  assert(index >= 0, `date ${key} must exist in current 42-cell panel`);
  return instance.onDateTap({ currentTarget: { dataset: { index } } });
}

function eventNames(context) { return context.events.map((event) => event.name); }

const expectedProps = [
  'value', 'defaultValue', 'title', 'type', 'visible', 'defaultVisible', 'minDate', 'maxDate', 'disabledDates', 'disableWeekends',
  'firstDayOfWeek', 'switchMode', 'showOutsideDays', 'allowSameDay', 'maxRange', 'maxMultiple', 'localeText', 'autoClose', 'usePopup',
  'closeOnOverlayClick', 'disabled', 'readonly', 'loading', 'error', 'ariaLabel', 'reduceMotion',
];
assert.deepStrictEqual(Object.keys(definition.properties), expectedProps, 'Calendar publishes exactly the 26 accepted Props');

const defaults = create();
assert.strictEqual(defaults.instance.data.days.length, 42);
assert.strictEqual(defaults.instance.data.weekdayNames.join(''), '日一二三四五六');
assert.strictEqual(defaults.instance.data.currentVisible, true);
assert.strictEqual(defaults.instance.data.stateType, 'content');
assert.strictEqual(defaults.instance.data.locale.cancel, '');
assert(defaults.instance.data.rootStyle.includes('--pui-calendar-duration:500ms'));

const reduced = create({ reduceMotion: true, firstDayOfWeek: 1, localeText: { today: '', confirm: '', cancel: '返回', retry: '' } });
assert(reduced.instance.data.rootStyle.includes('--pui-calendar-duration:1ms'));
assert.strictEqual(reduced.instance.data.weekdayNames.join(''), '一二三四五六日');
assert.strictEqual(reduced.instance.data.locale.today, '');
assert.strictEqual(reduced.instance.data.locale.confirm, '');
assert.strictEqual(reduced.instance.data.locale.cancel, '返回');
assert.strictEqual(reduced.instance.data.locale.retry, '');

const strict = create({ defaultValue: ['2026-02-29', '2026-07-10', 'not-a-date', '2026-07-10'], type: 'multiple' });
assert.strictEqual(JSON.stringify(strict.instance.data.selectedValues), JSON.stringify(['2026-07-10']), 'invalid and duplicate dates are filtered');
const swapped = create({ minDate: '2026-07-20', maxDate: '2026-07-01', defaultValue: '2026-07-10' });
assert.strictEqual(swapped.instance.bounds().min.getDate(), 1);
assert.strictEqual(swapped.instance.bounds().max.getDate(), 20);
assert.strictEqual(swapped.instance.data.selectedValues[0], '2026-07-10');

const uncontrolled = create({ defaultValue: '2026-07-10' });
tap(uncontrolled.instance, '2026-07-12');
assert.strictEqual(uncontrolled.instance.data.selectedValues[0], '2026-07-12');
assert.strictEqual(JSON.stringify(eventNames(uncontrolled)), JSON.stringify(['change']));
assert.strictEqual(uncontrolled.events[0].detail.value, '2026-07-12');

const controlled = create({ value: '2026-07-10', defaultValue: '2026-07-01' });
tap(controlled.instance, '2026-07-12');
assert.strictEqual(controlled.instance.data.selectedValues[0], '2026-07-10', 'controlled date waits for parent write-back');
assert.strictEqual(controlled.events[0].detail.value, '2026-07-12');
controlled.instance.data.value = '2026-07-12';
controlled.instance.syncState();
controlled.instance.data.value = null;
controlled.instance.syncState();
assert.strictEqual(controlled.instance.data.selectedValues[0], '2026-07-12', 'controlled to uncontrolled preserves the last rendered value');

const range = create({ type: 'range', defaultValue: '2026-07-10', maxRange: 5 });
assert.strictEqual(tap(range.instance, '2026-07-20'), false);
assert.strictEqual(JSON.stringify(eventNames(range)), JSON.stringify(['limit']));
assert.strictEqual(range.events[0].detail.type, 'range');
assert.strictEqual(range.instance.data.selectedValues.join(','), '2026-07-10');
const sameDay = create({ type: 'range', defaultValue: '2026-07-10', allowSameDay: false });
tap(sameDay.instance, '2026-07-10');
assert.strictEqual(sameDay.instance.data.selectedValues.join(','), '2026-07-10');

const multiple = create({ type: 'multiple', defaultValue: ['2026-07-10', '2026-07-11'], maxMultiple: 2 });
assert.strictEqual(tap(multiple.instance, '2026-07-12'), false);
assert.strictEqual(multiple.events[0].name, 'limit');
assert.strictEqual(multiple.instance.data.selectedValues.length, 2);

const autoClose = create({ defaultValue: '2026-07-10', autoClose: true });
tap(autoClose.instance, '2026-07-12');
assert.strictEqual(JSON.stringify(eventNames(autoClose)), JSON.stringify(['change', 'visible-change']));
assert.strictEqual(autoClose.events[1].detail.visible, false);
const controlledVisible = create({ visible: true });
controlledVisible.instance.requestVisible(false, 'overlay');
assert.strictEqual(controlledVisible.instance.data.currentVisible, true, 'controlled visible waits for parent write-back');
controlledVisible.instance.data.visible = false;
controlledVisible.instance.syncState();
assert.strictEqual(controlledVisible.instance.data.currentVisible, false);
controlledVisible.instance.data.visible = null;
controlledVisible.instance.syncState();
assert.strictEqual(controlledVisible.instance.data.currentVisible, false, 'visible controlled to uncontrolled preserves the last state');

const navigation = create({ defaultValue: '2026-07-10' });
navigation.instance.onNext();
assert.strictEqual(navigation.events[0].name, 'panel-change');
assert.strictEqual(navigation.events[0].detail.source, 'next');
const disabled = create({ defaultValue: '2026-07-10', disabled: true });
tap(disabled.instance, '2026-07-12');
disabled.instance.onNext();
assert.strictEqual(disabled.events.length, 0);
const readonly = create({ defaultValue: '2026-07-10', readonly: true });
tap(readonly.instance, '2026-07-12');
assert.strictEqual(readonly.events.length, 0);
assert.strictEqual(readonly.instance.onNext(), true, 'readonly still allows panel navigation');

const priority = create({ loading: true, error: true });
assert.strictEqual(priority.instance.data.stateType, 'error');
const empty = create({ minDate: '2026-08-01', maxDate: '2026-08-02', disabledDates: ['2026-08-01', '2026-08-02'] });
assert.strictEqual(empty.instance.data.stateType, 'empty');
const retry = create({ error: true });
assert.strictEqual(retry.instance.onRetry(), true);
assert.strictEqual(retry.events[0].name, 'retry');
assert.strictEqual(retry.instance.data.error, true, 'retry never fakes recovery');

for (const removed of ['open', 'close', 'clear', 'goToMonth', 'goToToday', 'confirm', 'cancel', 'retry']) {
  assert.strictEqual(definition.methods[removed], undefined, `Calendar must not expose legacy public method ${removed}`);
}
for (const removedEvent of ["triggerEvent('select'", "triggerEvent('input'", "triggerEvent('month-change'", "triggerEvent('year-change'", "triggerEvent('input-visible'", "triggerEvent('open'", "triggerEvent('close'", "triggerEvent('today'"]) {
  assert(!source.includes(removedEvent), `Calendar must not publish legacy event ${removedEvent}`);
}

const wxml = fs.readFileSync(path.join(root, 'calendar/calendar.wxml'), 'utf8');
const wxss = fs.readFileSync(path.join(root, 'calendar/calendar.wxss'), 'utf8');
const json = JSON.parse(fs.readFileSync(path.join(root, 'calendar/calendar.json'), 'utf8'));
const metadata = require(path.join(root, 'metadata/components.js'));
const preview = fs.readFileSync(path.join(root, 'preview/app.js'), 'utf8');
const previewStyles = fs.readFileSync(path.join(root, 'preview/styles.css'), 'utf8');
const api = fs.readFileSync(path.join(root, 'docs/COMPONENT_API.md'), 'utf8');
const compatibility = fs.readFileSync(path.join(root, 'docs/H5_PREVIEW_COMPATIBILITY.md'), 'utf8');
const contract = fs.readFileSync(path.join(root, 'docs/components/CALENDAR.md'), 'utf8');
const exampleJs = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.js'), 'utf8');
const exampleWxml = fs.readFileSync(path.join(root, '_example/miniprogram/pages/components/index.wxml'), 'utf8');
const entry = fs.readFileSync(path.join(root, 'index.js'), 'utf8');

assert.deepStrictEqual(Object.keys(json.usingComponents).sort(), ['pui-button', 'pui-empty', 'pui-loading']);
assert(!/<slot\b/.test(wxml), 'Calendar publishes no Slots');
assert(wxml.includes('<pui-loading') && wxml.includes('<pui-empty') && wxml.includes('<pui-button'));
assert.strictEqual((wxml.match(/\bicon-only\b/g) || []).length, 2, 'Calendar month navigation must use two true PUI IconButtons');
assert(wxss.includes('grid-template-columns: 72rpx minmax(0, 1fr) 72rpx'), 'Calendar month navigation keeps two fixed visible icon tracks');
assert(wxml.includes('wx:for="{{days}}"') && wxml.includes('aria-readonly="{{readonly}}"'));
assert(!/display\s*:\s*none/.test(wxss));
assert(!/height\s*:\s*auto/.test(wxss));
assert(!/max-height\s*:/.test(wxss), 'Calendar state motion must not use max-height tricks');
assert(!/\b(?:[5-9]\d\d|[1-9]\d{3,})ms\b/.test(wxss));

assert.deepStrictEqual(metadata.apiProps.calendar, expectedProps);
assert.deepStrictEqual(metadata.apiEvents.calendar.map((event) => event.name), ['change', 'limit', 'panel-change', 'visible-change', 'confirm', 'cancel', 'retry']);
assert.strictEqual((metadata.apiSlots.calendar || []).length, 0);
assert.strictEqual((metadata.apiMethods.calendar || []).length, 0);
assert(metadata.packageComponents.includes('calendar'));
assert(entry.includes("    'calendar',"));

for (const title of ['基础用法', '范围与多选', '日期限制', '状态与反馈']) assert(preview.includes(`<h3>${title}</h3>`));
assert(preview.includes('function calendarPreviewMarkup(props, demo, options = {})'));
assert(preview.includes("maxRange: { type: 'range', value: 0, min: 0, max: 3660, step: 1 }"));
assert(preview.includes("maxMultiple: { type: 'range', value: 0, min: 0, max: 366, step: 1 }"));
assert(preview.includes("previewId === 'calendar' && props.usePopup"));
assert(preview.includes('state.props[state.current].value = value'));
assert(!preview.includes('calendarPreviewEasing'));
assert(!preview.includes('calendar-clear'));
assert(previewStyles.includes('.pui-calendar-preview__content { opacity: 0; visibility: hidden;'));
assert(previewStyles.includes('grid-template-columns: 36px minmax(0, 1fr) 36px'), 'H5 Calendar mirrors the fixed month navigation tracks');
assert(!previewStyles.includes('.pui-calendar-preview__content { max-height: 0;'));

const calendarApi = api.slice(api.indexOf('## Calendar'), api.indexOf('\n## ', api.indexOf('## Calendar') + 4));
assert(calendarApi.includes('26 Props'));
assert(calendarApi.includes('### 7 Events'));
assert(calendarApi.includes('<pui-calendar />'));
assert(calendarApi.includes('不公开 Slot 或实例方法'));
assert(!calendarApi.includes('outsideDaySelectable'));
assert(!calendarApi.includes('month-change'));
assert(compatibility.includes('Calendar'));
assert(compatibility.includes('集中承载 today/confirm/cancel/loading/error/retry/empty'));
assert(contract.includes('0 Slots、0 公开 Methods'));
assert(contract.includes('基础 WXML 为 `<pui-calendar />` 且零 `bind:*`'));

assert(exampleWxml.includes('locale-text="{{calendarLocaleText}}"'));
assert(exampleWxml.includes('bind:panel-change="onCalendarPanelChange"'));
assert(!exampleWxml.includes('bind:select="onCalendarSelect"'));
assert(!exampleWxml.includes('id="deliveryCalendar"'));
assert(exampleJs.includes('calendarVisible: true'));
assert(exampleJs.includes('calendarValue: event.detail.value'));

['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
  const sourceFile = fs.readFileSync(path.join(root, `calendar/calendar.${extension}`));
  const distFile = fs.readFileSync(path.join(root, `miniprogram_dist/calendar/calendar.${extension}`));
  assert(sourceFile.equals(distFile), `source and miniprogram_dist Calendar ${extension} must match`);
});

console.log('Calendar contract tests passed.');
