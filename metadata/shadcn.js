/*
 * shadcn/ui component taxonomy mapped to native WeChat Mini Program behavior.
 * This is a planning and documentation source only. It intentionally does not
 * import React, Radix, Tailwind, browser portals, or hover-only interactions.
 */
const shadcnComponents = [
  ['Accordion', 'collapse', 'native', 'tap', '原生 Collapse 提供原始类型值、受控/非受控展开、单开多开、测量高度动画、内部状态组件、真实 retry 与 header/footer slot。'],
  ['Alert', 'alert', 'native', 'tap', '原生提示块提供受控/非受控显隐、关闭回写、状态色、默认 slot 与平滑退场。'],
  ['Aspect Ratio', 'aspect-ratio', 'native', 'none', '以 WXSS 百分比占位维持内容比例，默认 slot 可组合 Icon、Tag，比例变化支持低动效。'],
  ['Attachment', 'upload', 'adapter', 'tap', '原生 Attachment/Upload 适配器提供媒体与聊天文件选择、受控/非受控列表、扩展名/大小校验、文件状态/进度、真实平台预览、内部组件组合、slot、完整事件和实例方法。', 'done'],
  ['Avatar', 'avatar', 'native', 'none', '原生头像提供图片、Icon/text/slot 回退和真实 error；点击、禁用与选择由外层交互组件承担。'],
  ['Badge', 'badge', 'native', 'none', '原生 Badge 是纯展示数量/短文字/红点组件，提供默认/count slot、右上角偏移和语义主题/变体；交互由宿主 Button、Cell、Tabs 或 Tabbar 承担。', 'done'],
  ['Breadcrumb', 'breadcrumb', 'native', 'tap', '多级路径通过 tap 触发 change。'],
  ['Bubble', 'bubble', 'adapter', 'tap/longpress', '原生 Bubble 映射七种消息表面、start/end、连续分组、回应、内容/回应 slot、受控展开、真实触摸与完整显隐事件；头像、时间和会话状态留给 Message 层组合。', 'done'],
  ['Button', 'button', 'adapter', 'tap', '使用微信原生 button/open-type，提供 default/primary/danger 三类主题、base/outline/text/ghost/transparent 五种变体、四种尺寸与形状、Icon/Loading/slot、表单行为、平台参数、完整能力事件转发和共享低动效。', 'done'],
  ['Calendar', 'calendar', 'native', 'tap', '原生 Calendar 提供单选、范围、多选、受控弹层、禁用规则、完整状态、slot 与 0–500ms 低动效。'],
  ['Card', 'card', 'native', 'tap', 'Header、Content、Footer 使用具名 slot；showHeader 可保留纯 header slot，click 仅在 clickable 且非 disabled 时触发。'],
  ['Swiper', 'swiper', 'adapter', 'swipe', '独立原生 Swiper 基于微信 swiper 提供 26 Props、严格原始值受控/非受控切换、统一 Navigation、Generic 条目、内部状态组合和 0–500ms/1ms 动效；H5 使用 Pointer Events 的 transform 镜像，不以滚动吸附冒充小程序能力。', 'done'],
  ['Chart', 'chart', 'research', 'tap', '需要以 canvas 或插件实现，不能虚假宣称等价。'],
  ['Checkbox', 'checkbox', 'adapter', 'tap', '原生 Checkbox 提供受控/非受控选中与半选、mark/content 分区交互、内部 Icon/Loading、标签说明与 slot、只读/加载/错误边界、完整事件方法和 0–500ms 低动效。', 'done'],
  ['Collapsible', 'collapsible', 'adapter', 'tap', '独立原生 Collapsible 提供单触发器/单内容区、受控/非受控 open、trigger/default slot、实测高度动画、完整状态与实例方法；多面板仍由 Collapse/Accordion 承担。', 'done'],
  ['Combobox', 'combobox', 'adapter', 'input/tap', '独立原生 Combobox 提供真实搜索过滤、受控选值/查询/显隐、单选/多选、分组、创建、状态、slot、完整事件方法和测量高度动画；普通 picker 继续由 Select 承担。', 'done'],
  ['Date Picker', 'date-time-picker', 'adapter', 'tap', 'DateTimePicker 直接组合 PUI Picker，提供年到秒精度、动态日期列、范围、步长、格式、值与显隐双受控、Popup/内联和草稿确认；Calendar + Popover 继续承担可视月历与范围选择。', 'done'],
  ['Dialog', 'dialog', 'native', 'tap', '原生 Dialog 提供 16 Props、受控显隐、Header/Content/Footer 三区、七个具名 slot、按钮 actions、遮罩滚动保护与 close()。请求状态由 content slot 组合 PUI Loading/Empty/Button 承担。', 'done'],
  ['Direction', 'direction', 'native', 'none', '原生 Direction Provider 为子树提供 ltr/rtl/auto 阅读方向、语言解析、逻辑对齐、容器形态、默认 slot、完整解析/变更事件和实例查询；不会伪称旧物理 left/right 样式或所有图标会自动镜像。', 'done'],
  ['Dropdown Menu', 'dropdown-menu', 'adapter', 'tap', '原生 DropdownMenu 以 8 Props 的筛选项数组承载单选/多选选项，提供受控选值、禁用项、遮罩关闭、默认/footer Slot、change/open/close/confirm/reset 与固定低动效；不承担业务状态、滚动控制或实例方法。', 'done'],
  ['Empty', 'empty', 'adapter', 'none', '原生 Empty 以 Image/Icon 提供图形与说明，image、description、action 由具名 Slot 组合；无组件事件、实例方法或内部业务操作。', 'done'],
  ['Field', 'field', 'native', 'none', '透明字段布局容器，以12 Props和5 Slots组合标签、帮助、反馈、PUI Input与箭头；不伪造值、禁用、校验事件或 Form 关系。'],
  ['Input', 'input', 'adapter', 'input', '原生 Input 提供 30 Props、受控/非受控文本、maxlength/maxcharacter、常用微信键盘参数、三档尺寸/对齐、前后缀与 Icon、七类 slot、四类状态、清空/焦点/确认事件和固定 500ms/1ms 低动效。', 'done'],
  ['Input OTP', 'input-otp', 'native', 'input', '多格验证码输入和 complete 事件。'],
  ['Label', 'label', 'native', 'none', '表单标签、必填标记与默认 Slot 的透明组合根；不管理关联控件，也不公开事件或实例方法。'],
  ['Navigation Menu', 'navigation-menu', 'adapter', 'tap', '原生 NavigationMenu 以横向/纵向导航项和固定高度弹层提供链接集合、受控显隐/展开/选值、分组、钻取子菜单、真实微信导航回调、slot/generic、完整状态和低动效。', 'done'],
  ['Notice Bar', 'notice-bar', 'adapter', 'tap', '原生 NoticeBar 提供横向单条公告、纵向 swiper 条目、真实溢出跑马、受控显隐、四个具名 Slot 与 click/change 事件；不把页面公告伪装成 Toast 或消息队列。', 'done'],
  ['Popover', 'popover', 'native', 'tap/longpress', '原生锚点气泡层；支持触摸触发、箭头与实例控制。'],
  ['Progress', 'progress', 'adapter', 'none', '线形/饱满线形/环形确定进度、percentage、四类状态、唯一 label Slot、固定 500ms 与低动效；无事件和实例方法。', 'done'],
  ['Radio Group', 'radio', 'adapter', 'tap', '独立原生 Radio 与 RadioGroup 通过 relation 提供单项和标量互斥选择，严格保留 0/false/空字符串，支持受控回写、父级状态继承、四类 Slot、唯一 change 与固定 500ms/1ms 低动效。', 'done'],
  ['Scroll Area', 'scroll-area', 'native', 'scroll', '固定高度的原生 scroll-view 薄封装；默认提供可关闭、主题安全且可选 sm/md/lg 高度的顶底渐变阅读遮罩。'],
  ['Select', 'select', 'native', 'tap', '使用触摸选择器。'],
  ['Sheet', 'sheet', 'native', 'tap', '底部 Sheet 复用 Popup 的安全区、标题与关闭语义。'],
  ['Sidebar', 'sidebar', 'native', 'tap', '原生分组侧边导航，支持受控/非受控值、内部组合、状态优先级与低动效。'],
  ['Skeleton', 'skeleton', 'adapter', 'none', '原生 Skeleton 只提供 7 个加载结构 Props：安全 rowCol、avatar/image/paragraph/text 主题、gradient/flashed/none、延迟和默认 Slot 内容回显。它不发布业务事件、实例方法或成功/失败/重试状态；H5 与微信端共享固定 500ms/低动效交叉淡入。', 'done'],
  ['Slider', 'slider', 'adapter', 'drag', '原生单滑块提供受控/非受控值、表单字段、边界步长、只读/禁用、实时与提交事件、实例方法和低动效；多滑块与纵向布局不虚构为微信原生能力。', 'done'],
  ['Switch', 'switch', 'adapter', 'tap', '原生 Switch 提供精简的 value/defaultValue/customValue、文字/图标、三尺寸、禁用/只读/加载、唯一 change 事件和固定500ms/1ms低动效；外部说明由 Cell/Field 组合。', 'done'],
  ['Table', 'table', 'adapter', 'scroll', '原生 Table 提供真实横纵滚动、sticky 表头与左右固定列、原始类型行键、受控/非受控选择和排序、内部 Checkbox/Tag/Icon/Loading/Empty/Button、四类 slot、状态优先级、完整事件方法与 0–500ms 低动效。', 'done'],
  ['Tabs', 'tabs', 'adapter', 'swipe', '原生 Tabs 提供严格原始值、受控/非受控选择、Button/Badge/Icon 组合、单一测量指示器、自动横向滚动、禁用项跳过、默认 Slot、click/change 与固定 500ms/1ms 低动效。', 'done'],
  ['Textarea', 'textarea', 'adapter', 'input', '原生 Textarea 提供 30 Props、受控/非受控文本、maxlength/maxcharacter 双上限、自动增高、三档尺寸与四类状态、内部 Button/Icon/Loading、label/tips/extra slot、微信键盘参数、7 类事件、4 个实例方法和固定 500ms/1ms 低动效。', 'done'],
  ['Toast', 'toast', 'adapter', 'tap', '原生 Toast 提供 12 Props、show(options)/hide()、进入完成后自动关闭、success/warning/error/loading、内部 Icon/Loading、icon/message Slot、close 和固定 500ms/1ms 低动效。', 'done'],
  ['Typography', 'typography', 'document', 'none', '通过 token 和文档规范交付。'],
].map(function createEntry(item) {
  return {
    source: item[0],
    poem: item[1],
    status: item[2],
    trigger: item[3],
    note: item[4],
    delivery: item[5] || '',
  };
});

module.exports = {
  shadcnComponents,
};
