function buildVirtualListItems() {
  var icons = ['component', 'file-text', 'shield-check', 'package'];
  return Array.from({ length: 120 }, function makeItem(_, index) {
    return {
      value: index === 0 ? 0 : 'delivery-' + (index + 1),
      label: '交付记录 #' + String(index + 1).padStart(3, '0'),
      description: index % 3 === 0 ? '源码、文档与产物已同步' : '固定行高窗口化渲染',
      valueText: index % 2 === 0 ? 'ready' : 'pending',
      icon: icons[index % icons.length],
      badge: index === 0 ? 0 : (index % 17 === 0 ? index : ''),
      badgeDot: index > 0 && index % 19 === 0,
      disabled: index === 7,
      loading: index === 12,
    };
  });
}

Page({
  data: {
    theme: 'light',
    frostedGlass: false,
    shadow: false,
    largeRadius: false,
    name: 'PoemUI',
    inputStatus: '等待 input / clear / focus / blur / confirm / method',
    deliveryFormData: { componentName: 'PoemUI', publicRelease: false },
    deliveryFormRules: {
      componentName: [{ required: true, message: '组件名称不能为空' }, { min: 3, message: '组件名称至少三个字符' }],
      publicRelease: [{ enum: [true], type: 'warning', message: '当前尚未公开发布' }],
    },
    deliveryFormStatus: '等待 validate / submit / reset',
    textareaValue: 'PoemUI 原生组件已进入发布验收。',
    textareaAutosize: { minRows: 3, maxRows: 6 },
    textareaLoading: false,
    textareaStatus: '等待 change / clear / focus / enter / line-change / keyboardheightchange',
    deliveryCellSelected: false,
    deliveryCellChecked: false,
    componentSearch: '',
    deliveryPickerColumns: [
      { label: '基础组件', value: 'basic', children: [
        { label: 'Button', value: 'button', icon: 'component' },
        { label: 'Icon', value: 0, icon: 'spark' },
      ] },
      { label: '表单组件', value: 'input', children: [
        { label: 'Input', value: 'input' },
        { label: 'Picker', value: false },
        { label: '停用项', value: '', disabled: true },
      ] },
    ],
    deliveryPickerDefaultValue: ['basic', 0],
    deliveryPickerValue: ['basic', 0],
    deliveryPickerVisible: false,
    deliveryPickerStatus: '等待 open / pick / confirm / change / cancel / close',
    bubbleVisible: true,
    bubbleExpanded: false,
    bubbleStatus: '等待 click / longpress / reaction / expand / visible',
    bubbleReactions: [
      { value: 0, label: '👍', count: 2, active: true },
      { value: false, label: '🔥', count: 1 },
      { value: 'locked', label: '🔒', disabled: true },
    ],
    deliveryButtonLoading: false,
    deliveryButtonDisabled: false,
    deliveryButtonStatus: '等待 click / submit / contact / error',
    deliveryCheckboxChecked: false,
    deliveryCheckboxIndeterminate: true,
    deliveryCheckboxValue: [0, false],
    deliveryCheckboxOptions: [
      { label: '全选', value: 'all', checkAll: true, borderless: true },
      { label: 'API 文档', content: '原始值 0', value: 0 },
      { label: 'H5 预览', content: '原始值 false，禁用但保留已选', value: false, disabled: true },
      { label: '真机复核', content: '原始值为空字符串', value: '' },
    ],
    deliveryCheckboxStatus: '父级 value=[0,false]，当前为半选',
    deliveryCollapsibleOpen: true,
    deliveryCollapsibleLoading: false,
    deliveryCollapsibleError: false,
    deliveryCollapsibleReadonly: false,
    deliveryCollapsibleStatus: '等待 click / input / change / open / close / after-*',
    deliveryComboboxValue: 'next',
    deliveryComboboxQuery: '',
    deliveryComboboxVisible: false,
    deliveryComboboxMultiple: false,
    deliveryComboboxLoading: false,
    deliveryComboboxError: false,
    deliveryComboboxStatus: '等待 query / visible / input / change / select / create / retry',
    deliveryComboboxOptions: [
      { label: 'React 生态', options: [
        { label: 'Next.js', value: 'next', description: 'React 全栈框架', icon: 'layers', keywords: ['react', 'ssr'] },
        { label: 'Remix', value: 'remix', description: 'Web 标准优先', icon: 'route', keywords: ['react', 'web'] },
      ] },
      { label: 'Vue 生态', options: [
        { label: 'Nuxt', value: 'nuxt', description: 'Vue 全栈框架', icon: 'command', keywords: ['vue', 'ssr'] },
        { label: '内部实验', value: 'locked', description: '单项 disabled', icon: 'lock', disabled: true },
      ] },
    ],
    stockCount: 2,
    stockCountStatus: '等待 change / overlimit',
    releaseProgress: 60,
    releaseProgressStatus: '60% · 等待拖动',
    componentRating: 3.5,
    componentRatingStatus: '3.5 / 5 · 等待评分',
    ratingTexts: ['较差', '一般', '可用', '良好', '优秀'],
    uploadFiles: [],
    uploadPicker: 'message',
    uploadPickerText: '聊天文件',
    uploadMediaTypes: ['image', 'video'],
    uploadMaxSize: 5242880,
    uploadStatus: '0 / 3 · 等待选择附件',
    toastStatus: '等待调用 show()',
    topLoadingState: 'idle',
    topLoadingProgress: null,
    dynamicMessageStatus: '等待调用 show()',
    deliveryProgress: 64,
    deliveryProgressType: 'line',
    deliveryProgressStatus: '等待页面推进',
    deliveryRadioValue: 'stable',
    deliveryRadioStatus: '等待 RadioGroup change',
    deliveryRadioOptions: [
      { label: '稳定版', value: 'stable', content: '推荐用于生产环境' },
      { label: '候选版', value: 0, content: '保留 number 0' },
      { label: '实验版', value: false, content: '保留 boolean false' },
      { label: '未命名通道', value: '', content: '保留空字符串' },
    ],
    skeletonLoading: true,
    skeletonRows: [
      { width: '42%', height: '30rpx' },
      [{ width: '58%', height: '26rpx' }, { width: '30%', height: '26rpx', type: 'rect' }],
      { width: '76%', height: '26rpx' },
    ],
    emptyStatus: '等待 action Slot 内 Button 的父级回写',
    noticeVisible: true,
    noticeItems: ['第一条纵向公告：组件目录已同步。', '第二条纵向公告：请检查 API 参数。', '第三条纵向公告：真机结果由页面记录。'],
    noticeStatus: '等待 click 或 vertical change',
    navbarStatus: '右侧已为微信原生胶囊保留；等待 left-click',
    tabsItems: [
      { label: '基础', value: 'base', icon: 'component', badge: 3, description: '通用组件与设计 token' },
      { label: '表单', value: 'form', icon: 'edit', description: '输入与选择控件' },
      { label: '反馈', value: 'feedback', icon: 'bell', badge: 0, description: '提示、加载与结果状态' },
      { label: '禁用', value: 'disabled', icon: 'lock', disabled: true },
    ],
    breadcrumbValue: 'breadcrumb',
    breadcrumbMode: 'content',
    breadcrumbStatus: '等待 click / input / change / retry',
    breadcrumbItems: [
      { label: '首页', value: 'home', icon: 'home' },
      { label: '组件', value: 'components', icon: 'component' },
      { label: '导航', value: 'navigation', icon: 'command' },
      { label: '权限受限', value: 'locked', icon: 'lock', disabled: true },
      { label: 'Breadcrumb', value: 'breadcrumb', icon: 'file-text' },
    ],
    breadcrumbDisplayItems: [
      { label: '首页', value: 'home', icon: 'home' },
      { label: '组件', value: 'components', icon: 'component' },
      { label: '导航', value: 'navigation', icon: 'command' },
      { label: '权限受限', value: 'locked', icon: 'lock', disabled: true },
      { label: 'Breadcrumb', value: 'breadcrumb', icon: 'file-text' },
    ],
    tabbarItems: [
      { label: '首页', value: 'home', icon: 'home', activeIcon: 'app' },
      { label: '组件', value: 'components', icon: 'component', badge: 3 },
      { label: '通知', value: 'notifications', icon: 'bell', badgeDot: true },
      { label: '我的', value: 'profile', icon: 'profile', badge: 0 },
    ],
    stepsItems: [
      { title: '设计', content: '确认组件规范', value: 'design', icon: 'palette' },
      { title: '开发', content: '实现源码与交互', value: 'develop', icon: 'component' },
      { title: '验证', content: '运行构建门禁', value: 'verify', icon: 'check-circle' },
      { title: '发布', content: '生成 npm 产物', value: 'release', icon: 'upload', disabled: true },
    ],
    backTopScroll: 0,
    indexesItems: [
      { index: '★', title: '常用', items: [{ label: 'Button', description: '基础操作组件', value: 'button', icon: 'component', badge: 3, arrow: true }, { label: 'Avatar', description: '头像展示组件', value: 'avatar', icon: 'profile' }] },
      { index: 'A', items: [{ label: 'Alert', description: '提示反馈组件', value: 'alert', icon: 'info-circle' }, { label: 'Accordion', description: '手风琴组合', value: 'accordion', icon: 'layers' }] },
      { index: 'B', items: [{ label: 'Badge', description: '徽标提示组件', value: 'badge', badgeDot: true }, { label: 'Breadcrumb', description: '路径导航组件', value: 'breadcrumb', disabled: true }] },
      { index: 'C', items: [{ label: 'Cell', description: '单元格组件', value: 'cell', arrow: true }, { label: 'Card', description: '内容容器组件', value: 'card', note: '支持组合' }] },
      { index: '#', title: '其他', items: [{ label: '更多组件', description: '持续交付中', value: 'more' }] },
    ],
    sidebarItems: [
      { title: '组件', items: [{ label: '概览', value: 'overview', description: '交付状态', icon: 'dashboard', activeIcon: 'activity', badge: 0 }, { label: '基础', value: 'foundation', description: 'Button 与 Icon', icon: 'component', badgeDot: true }, { label: '表单', value: 'form', description: 'Input 与 Select', icon: 'edit' }] },
      { title: '工作区', items: [{ label: '反馈', value: 'feedback', description: 'Toast 与 Dialog', icon: 'message', badge: 3 }, { label: '数据', value: 'data', description: 'List 与 Table', icon: 'database' }, { label: '实验', value: 'lab', description: '暂不可用', icon: 'atom', disabled: true }] },
    ],
    listMode: 'content',
    listCompact: false,
    listDisabled: false,
    listStatus: '等待 click / load / retry / method',
    listItems: [
      { title: '组件 API', description: '属性、事件和 slot 合同', value: 0, valueText: '31 Props', icon: 'component', badge: 0, arrow: true },
      { title: '设计规则', description: '间距、状态和主题 token', value: false, valueText: '已同步', icon: 'palette', badgeDot: true, arrow: true },
      { title: '兼容说明', description: 'WXML / WXSS 平台边界', value: 'compatibility', valueText: '查看', icon: 'help-circle', arrow: true },
      { title: '受限条目', description: '单项 disabled 不影响其他项', value: 'locked', icon: 'lock', disabled: true },
    ],
    listDisplayItems: [
      { title: '组件 API', description: '属性、事件和 slot 合同', value: 0, valueText: '31 Props', icon: 'component', badge: 0, arrow: true },
      { title: '设计规则', description: '间距、状态和主题 token', value: false, valueText: '已同步', icon: 'palette', badgeDot: true, arrow: true },
      { title: '兼容说明', description: 'WXML / WXSS 平台边界', value: 'compatibility', valueText: '查看', icon: 'help-circle', arrow: true },
      { title: '受限条目', description: '单项 disabled 不影响其他项', value: 'locked', icon: 'lock', disabled: true },
    ],
    notification: true,
    notificationValue: 'enabled',
    notificationValues: ['enabled', 'disabled'],
    switchStatus: '等待 change',
    alertVisible: true,
    alertStatus: '等待关闭或重新打开',
    popupVisible: false,
    popupResult: '等待页面打开或 visible-change 回写',
    popoverVisible: false,
    popoverResult: '点击更多操作打开；外部点击等待 visible-change 回写',
    sheetVisible: false,
    sheetLoading: false,
    sheetError: false,
    sheetEmpty: false,
    sheetResult: '等待 open / close / drag / overlay / retry / scroll / after-*',
    actionSheetVisible: false,
    actionSheetResult: '等待 visible-change / selected / close / cancel',
    actionSheetItems: [
      { label: '复制链接', value: 0, icon: 'copy', suffixIcon: 'chevron-right' },
      { label: '分享组件', value: false, icon: 'share' },
      { label: '删除组件', value: 'delete', color: '#dc2626', icon: 'trash-2' },
      { label: '暂不可用', value: 'locked', disabled: true, icon: 'lock' },
    ],
    dropdownValue: { status: 0, sort: ['new'] },
    dropdownDefaultValue: { status: 0, sort: ['new'] },
    dropdownResult: '点击筛选项后查看 open、change、confirm、reset、close 的真实顺序',
    dropdownItems: [
      {
        key: 'status',
        label: '状态',
        options: [
          { label: '全部组件', value: 0 },
          { label: '已完成', value: false },
          { label: '权限受限', value: 'locked', disabled: true },
        ],
      },
      {
        key: 'sort',
        label: '排序',
        multiple: true,
        options: [
          { label: '最近更新', value: 'new' },
          { label: '最受欢迎', value: 'popular' },
        ],
      },
    ],
    overlayVisible: false,
    pullRefreshValue: false,
    pullRefreshDisabled: false,
    pullRefreshTexts: ['下拉刷新', '松手刷新', '正在刷新', '刷新完成'],
    pullRefreshStatus: '等待内部滚动区顶部下拉',
    virtualListItems: buildVirtualListItems(),
    virtualListValue: 0,
    virtualListMultiple: false,
    virtualListLoading: false,
    virtualListError: false,
    virtualListStatus: '等待 item/selection/scroll/retry',
    stickyRows: [
      { title: '组件源码', description: 'WXML / WXSS / JS / JSON', value: 'ready' },
      { title: '页面滚动', description: '页面 onPageScroll 驱动吸顶', value: 'page' },
      { title: '占位高度', description: 'fixed 后正文不发生跳动', value: 'stable' },
      { title: '顶部偏移', description: '由 offsetTop 真实控制', value: 'offset' },
      { title: '主题开关', description: '阴影、毛玻璃和大圆角继承 ConfigProvider', value: 'token' },
    ],
    watermarkContent: [
      { text: '内部资料', fontSize: 24, fontWeight: 'bold', fontColor: '#71717a' },
    ],
    channels: [
      { label: 'npm', value: 'npm' },
      { label: '私有仓库', value: 'private' },
      { label: '内测', value: 'beta' },
    ],
    channel: 'npm',
    isPublic: false,
    publishScopes: [
      { label: '团队', value: 'team', icon: 'users' },
      { label: '组织', value: 'org', icon: 'profile' },
      { label: '公开', value: 'public', icon: 'globe' },
    ],
    publishScope: 'team',
    publishAt: '2026-07-15 09:30',
    deliveryDateTimeMode: ['date', 'minute'],
    deliveryDateTimeVisible: false,
    deliveryDateTimeSteps: { minute: 15 },
    publishAtStatus: '等待打开日期时间滚轮',
    selectedIcon: 'spark',
    iconColor: '#2563eb',
    iconStatus: '等待图标载入',
    collapseItems: [
      { label: '组件 API', value: 0, description: 'value 数组严格保留数字 0，不与字符串 0 混淆。', note: '0', icon: 'component' },
      { label: '布尔边界', value: false, description: 'false 是合法面板值，可与数字 0 同时展开。', note: 'false', icon: 'check-circle' },
      { label: '空字符串', value: '', description: '空字符串同样保留原始类型。', note: 'empty', icon: 'brackets' },
      { label: '字符串零', value: '0', description: '字符串 0 是独立面板值。', note: '"0"', icon: 'code' },
      { label: '锁定项', value: 'locked', description: '此项不可操作。', icon: 'lock', disabled: true },
    ],
    collapseValue: [0],
    collapseStatus: '已展开 1 项',
    swipeLeftActions: [{ text: '收藏', icon: 'star', style: 'background: #f3f4f6;' }],
    swipeRightActions: [{ text: '删除', icon: 'delete', style: 'background: #ef4444;' }],
    countDownTime: 15000,
    countDownRunning: true,
    countDownState: { formatted: '00:15', time: 15000 },
    countDownStatus: '等待 change / finish 或实例方法',
    tableColumns: [
      { key: 'name', title: '组件', width: 220, fixed: 'left', sortable: true, headerIcon: 'component' },
      { key: 'status', title: '状态', width: 160, align: 'center', type: 'tag', valueMap: { done: '已完成', beta: 'Beta', planned: '计划中' }, themeMap: { done: 'success', beta: 'warning', planned: 'default' } },
      { key: 'priority', title: '优先级', width: 140, align: 'right', sortable: true },
      { key: 'owner', title: '维护者', width: 180 },
      { key: 'version', title: '版本', width: 150, align: 'right', fixed: 'right' },
    ],
    tableRows: [
      { id: 0, name: 'Button', status: 'done', priority: 1, owner: 'Poem', version: '0.1.0' },
      { id: false, name: 'Dialog', status: 'beta', priority: 2, owner: 'UI Team', version: '0.1.0' },
      { id: 'calendar', name: 'Calendar', status: 'planned', priority: 3, owner: 'Poem', version: '0.2.0' },
      { id: 'locked', name: 'Legacy', status: 'done', priority: 9, owner: 'Archive', version: '0.0.8', disabled: true },
    ],
    tableSelectedRowKeys: [0],
    tableSort: null,
    tableStatus: '等待选择 / 排序 / 行点击 / scroll / retry',
    swiperItems: [
      { title: '原生 swiper 交付', value: 0, description: '触摸、箭头与分页共享同一受控合同', icon: 'component', tag: 'Native', tagTheme: 'primary', theme: 'primary' },
      { title: '组合式内容', value: false, description: 'Image、Icon、Tag、Button 与 Generic 可自由组合', icon: 'layers', tag: 'Composable', tagTheme: 'success', theme: 'success' },
      { title: '真实状态闭环', value: 'states', description: 'error、loading、content、empty 保留节点平滑切换', icon: 'activity', tag: 'States', tagTheme: 'warning', theme: 'warning' },
    ],
    swiperDisplayItems: [
      { title: '原生 swiper 交付', value: 0, description: '触摸、箭头与分页共享同一受控合同', icon: 'component', tag: 'Native', tagTheme: 'primary', theme: 'primary' },
      { title: '组合式内容', value: false, description: 'Image、Icon、Tag、Button 与 Generic 可自由组合', icon: 'layers', tag: 'Composable', tagTheme: 'success', theme: 'success' },
      { title: '真实状态闭环', value: 'states', description: 'error、loading、content、empty 保留节点平滑切换', icon: 'activity', tag: 'States', tagTheme: 'warning', theme: 'warning' },
    ],
    swiperValue: 0,
    swiperNavigation: { type: 'dots-bar', position: 'inside', showControls: true, minShowNum: 2 },
    swiperMode: 'content',
    swiperStatus: '等待 swipe / click / input / change / animationfinish / retry',
    navigationMenuItems: [
      { value: 'components', label: '组件', icon: 'component', description: 'PoemUI 原生组件', badge: 82, children: [
        { heading: '开始', description: '严格保留原始值', items: [
          { value: false, label: '组件总览', icon: 'grid', description: '保留 false 原始值' },
          { value: 'api', label: 'API 文档', icon: 'file-text', description: '由消费者处理业务跳转' },
          { value: 0, label: '数据展示', icon: 'layers', description: '进入下一级菜单', children: [
            { value: 'table', label: 'Table', icon: 'table', description: '滚动、选择与排序' },
            { value: 'swiper', label: 'Swiper', icon: 'images', description: '原生 swiper 轮播' },
          ] },
        ] },
        { heading: '偏好', separatorBefore: true, items: [
          { value: 'guides', label: '显示设计说明', type: 'checkbox', icon: 'info-circle', shortcut: 'On/Off' },
          { value: 'comfortable', label: '舒适密度', type: 'radio', radioGroup: 'density' },
          { value: 'compact', label: '紧凑密度', type: 'radio', radioGroup: 'density' },
          { value: 'locked', label: '权限受限', icon: 'lock', disabled: true },
        ] },
      ] },
      { value: 'docs', label: '文档', icon: 'file-text', description: '微信 API 真实导航项', type: 'link', url: '/pages/components/index', openType: 'navigateTo' },
      { value: 'sync', label: '同步中', icon: 'refresh', loading: true },
      { value: 'account', label: '账户', icon: 'user', disabled: true },
    ],
    navigationMenuDisplayItems: [
      { value: 'components', label: '组件', icon: 'component', description: 'PoemUI 原生组件', badge: 82, children: [
        { heading: '开始', description: '严格保留原始值', items: [
          { value: false, label: '组件总览', icon: 'grid', description: '保留 false 原始值' },
          { value: 'api', label: 'API 文档', icon: 'file-text', description: '由消费者处理业务跳转' },
          { value: 0, label: '数据展示', icon: 'layers', description: '进入下一级菜单', children: [
            { value: 'table', label: 'Table', icon: 'table', description: '滚动、选择与排序' },
            { value: 'swiper', label: 'Swiper', icon: 'images', description: '原生 swiper 轮播' },
          ] },
        ] },
        { heading: '偏好', separatorBefore: true, items: [
          { value: 'guides', label: '显示设计说明', type: 'checkbox', icon: 'info-circle', shortcut: 'On/Off' },
          { value: 'comfortable', label: '舒适密度', type: 'radio', radioGroup: 'density' },
          { value: 'compact', label: '紧凑密度', type: 'radio', radioGroup: 'density' },
          { value: 'locked', label: '权限受限', icon: 'lock', disabled: true },
        ] },
      ] },
      { value: 'docs', label: '文档', icon: 'file-text', description: '微信 API 真实导航项', type: 'link', url: '/pages/components/index', openType: 'navigateTo' },
      { value: 'sync', label: '同步中', icon: 'refresh', loading: true },
      { value: 'account', label: '账户', icon: 'user', disabled: true },
    ],
    navigationMenuValue: false,
    navigationMenuExpanded: 'components',
    navigationMenuVisible: false,
    navigationMenuChecked: ['guides'],
    navigationMenuDefaultChecked: ['guides'],
    navigationMenuRadio: { density: 'comfortable' },
    navigationMenuDefaultRadio: { density: 'comfortable' },
    navigationMenuMode: 'navigation',
    navigationMenuState: 'content',
    navigationMenuReadonly: false,
    navigationMenuAutoNavigate: false,
    navigationMenuStatus: '等待 click / expanded / visible / select / checked / radio / submenu / navigate',
    calendarValue: ['2026-07-10', '2026-07-15'],
    calendarVisible: false,
    calendarDisabledDates: ['2026-07-08', '2026-07-22'],
    calendarLocaleText: { today: '今天', confirm: '确认', cancel: '取消' },
    calendarStatus: '等待 change / limit / panel-change / visible-change / confirm / cancel / retry',
    dialogVisible: false,
    dialogConfirmBtn: { content: '确认发布', theme: 'primary' },
    dialogStatus: '等待打开',
    deliveryDirection: 'ltr',
    deliveryDirectionLanguage: 'zh-CN',
    deliveryDirectionStatus: '等待 resolve / ready / change / after-change',
    cardStatus: '等待 Card click',
    cardFooterStatus: '等待 footer Button click',
    avatarStatus: '等待真实图片 error',
    imageStatus: '等待真实图片 error',
    gridStatus: '等待 Grid click',
    gridError: false,
    gridLoading: false,
    scrollAreaTarget: '',
    scrollAreaStatus: '未请求定位',
    gridItems: [
      { label: '组件', value: 'components', icon: 'component', badge: 3, theme: 'primary' },
      { label: '主题', description: '视觉设置', value: 0, icon: 'palette' },
      { label: '文档', value: false, icon: 'file-text' },
    ],
  },
  onNameChange: function onNameChange(event) {
    this.setData({ name: event.detail.value, inputStatus: 'change：父级回写 value=' + (event.detail.value || 'empty') + ' · ' + event.detail.source });
  },
  onDeliveryFormNameChange: function onDeliveryFormNameChange(event) {
    this.setData({
      'deliveryFormData.componentName': event.detail.value,
      deliveryFormStatus: 'Input change：父级已回写 data.componentName',
    });
  },
  onDeliveryFormPublicChange: function onDeliveryFormPublicChange(event) {
    this.setData({
      'deliveryFormData.publicRelease': event.detail.value,
      deliveryFormStatus: 'Switch change：父级已回写 data.publicRelease=' + event.detail.value,
    });
  },
  onDeliveryFormValidate: function onDeliveryFormValidate(event) {
    var errorCount = Object.keys(event.detail.errors || {}).length;
    var warningCount = Object.keys(event.detail.warnings || {}).length;
    this.setData({ deliveryFormStatus: 'validate：valid=' + event.detail.valid + ' · errors=' + errorCount + ' · warnings=' + warningCount });
  },
  onDeliveryFormSubmit: function onDeliveryFormSubmit(event) {
    this.setData({
      deliveryFormStatus: event.detail.valid ? 'submit：校验通过，业务请求尚未执行' : 'submit：校验未通过，未执行业务请求',
    });
  },
  onDeliveryFormReset: function onDeliveryFormReset(event) {
    this.setData({
      deliveryFormData: event.detail.data,
      deliveryFormStatus: 'reset：父级已回写 ' + event.detail.type + ' 数据',
    });
  },
  onNameClear: function onNameClear(event) {
    this.setData({ inputStatus: 'clear：' + event.detail.previousValue + ' → empty · controlled=' + event.detail.controlled });
  },
  onNameFocus: function onNameFocus(event) {
    this.setData({ inputStatus: 'focus：value=' + (event.detail.value || 'empty') });
  },
  onNameBlur: function onNameBlur(event) {
    this.setData({ inputStatus: 'blur：value=' + (event.detail.value || 'empty') });
  },
  onNameEnter: function onNameEnter(event) {
    this.setData({ inputStatus: 'enter：value=' + (event.detail.value || 'empty') });
  },
  focusNameInput: function focusNameInput() {
    var component = this.selectComponent('#deliveryInput');
    var focused = component && component.focus();
    this.setData({ inputStatus: 'method focus()：' + (focused ? '已请求原生焦点' : '当前不可聚焦') });
  },
  clearNameInput: function clearNameInput() {
    var component = this.selectComponent('#deliveryInput');
    if (component) component.clear();
  },
  resetNameInput: function resetNameInput() {
    this.setData({ name: 'PoemUI', inputStatus: '父级 reset：value=PoemUI' });
  },
  readNameInput: function readNameInput() {
    var component = this.selectComponent('#deliveryInput');
    var value = component ? component.getValue() : '';
    this.setData({ inputStatus: 'getValue()：' + (value || 'empty') });
  },
  onTextareaChange: function onTextareaChange(event) {
    this.setData({
      textareaValue: event.detail.value,
      textareaStatus: 'change：父级回写 value · count=' + event.detail.count + ' · mode=' + event.detail.countMode,
    });
  },
  onTextareaClear: function onTextareaClear(event) {
    this.setData({ textareaStatus: 'clear：' + (event.detail.previousValue || 'empty') + ' → empty' });
  },
  onTextareaFocus: function onTextareaFocus(event) {
    this.setData({ textareaStatus: 'focus：value=' + (event.detail.value || 'empty') });
  },
  onTextareaBlur: function onTextareaBlur(event) {
    this.setData({ textareaStatus: 'blur：value=' + (event.detail.value || 'empty') });
  },
  onTextareaEnter: function onTextareaEnter(event) {
    this.setData({ textareaStatus: 'enter：value=' + (event.detail.value || 'empty') });
  },
  onTextareaLineChange: function onTextareaLineChange(event) {
    this.setData({ textareaStatus: 'line-change：' + event.detail.lineCount + ' 行 · ' + event.detail.heightRpx + 'rpx' });
  },
  onTextareaKeyboardHeightChange: function onTextareaKeyboardHeightChange(event) {
    this.setData({ textareaStatus: 'keyboardheightchange：height=' + event.detail.height + ' · duration=' + event.detail.duration });
  },
  focusTextarea: function focusTextarea() {
    var component = this.selectComponent('#deliveryTextarea');
    var focused = component && component.focus();
    this.setData({ textareaStatus: 'focus()：' + (focused ? '已请求原生焦点' : '当前不可聚焦') });
  },
  clearTextarea: function clearTextarea() {
    var component = this.selectComponent('#deliveryTextarea');
    if (component) component.clear('method-clear');
  },
  readTextareaValue: function readTextareaValue() {
    var component = this.selectComponent('#deliveryTextarea');
    var value = component ? component.getValue() : '';
    this.setData({ textareaStatus: component ? 'getValue()：' + (value || 'empty') : 'Textarea 实例不存在' });
  },
  toggleTextareaLoading: function toggleTextareaLoading() {
    var next = !this.data.textareaLoading;
    this.setData({ textareaLoading: next, textareaStatus: '父级回写 loading=' + next });
  },
  onDeliveryCellInput: function onDeliveryCellInput(event) {
    this.setData({ deliveryCellSelected: !!event.detail.selected });
  },
  onDeliveryCellRightAction: function onDeliveryCellRightAction() {
    this.setData({ deliveryCellChecked: !this.data.deliveryCellChecked });
  },
  onComponentSearchChange: function onComponentSearchChange(event) {
    this.setData({ componentSearch: event.detail.value });
  },
  onComponentSearch: function onComponentSearch(event) {
    this.setData({ componentSearch: event.detail.value });
  },
  onComponentSearchCancel: function onComponentSearchCancel() {
    this.setData({ componentSearch: '' });
  },
  openDeliveryPicker: function openDeliveryPicker() {
    var picker = this.selectComponent('#deliveryPicker');
    if (picker) picker.open();
  },
  resetDeliveryPicker: function resetDeliveryPicker() {
    var picker = this.selectComponent('#deliveryPicker');
    if (picker) picker.reset();
  },
  readDeliveryPicker: function readDeliveryPicker() {
    var picker = this.selectComponent('#deliveryPicker');
    if (!picker) return;
    this.setData({ deliveryPickerStatus: 'getValue：' + JSON.stringify(picker.getValue()) });
  },
  onDeliveryPickerVisibleChange: function onDeliveryPickerVisibleChange(event) {
    this.setData({
      deliveryPickerVisible: !!event.detail.visible,
      deliveryPickerStatus: 'visible-change：' + String(event.detail.visible) + ' · ' + event.detail.source + ' · 父级已回写',
    });
  },
  onDeliveryPickerPick: function onDeliveryPickerPick(event) {
    this.setData({ deliveryPickerStatus: 'pick：第 ' + (event.detail.column + 1) + ' 列 · ' + JSON.stringify(event.detail.value) });
  },
  onDeliveryPickerConfirm: function onDeliveryPickerConfirm(event) {
    this.setData({ deliveryPickerStatus: 'confirm：' + event.detail.label.join(' / ') + ' · 等待 change' });
  },
  onDeliveryPickerChange: function onDeliveryPickerChange(event) {
    this.setData({ deliveryPickerValue: event.detail.value, deliveryPickerStatus: 'change：父级已回写 ' + JSON.stringify(event.detail.value) });
  },
  onDeliveryPickerCancel: function onDeliveryPickerCancel() {
    this.setData({ deliveryPickerStatus: 'cancel：草稿已丢弃，当前值不变' });
  },
  onDeliveryPickerClose: function onDeliveryPickerClose(event) {
    this.setData({ deliveryPickerStatus: 'close：' + event.detail.source + ' · 当前 ' + JSON.stringify(this.data.deliveryPickerValue) });
  },
  onStockCountChange: function onStockCountChange(event) {
    this.setData({
      stockCount: event.detail.value,
      stockCountStatus: 'change：' + event.detail.previousValue + ' → ' + event.detail.value + ' · ' + event.detail.source,
    });
  },
  onStockCountOverlimit: function onStockCountOverlimit(event) {
    this.setData({ stockCountStatus: 'overlimit：' + event.detail.type + ' · 当前 ' + event.detail.value });
  },
  onReleaseProgressChanging: function onReleaseProgressChanging(event) {
    this.setData({ releaseProgress: event.detail.value, releaseProgressStatus: event.detail.value + '% · changing · previous ' + event.detail.previousValue });
  },
  onReleaseProgressChange: function onReleaseProgressChange(event) {
    this.setData({ releaseProgress: event.detail.value, releaseProgressStatus: event.detail.value + '% · change 已提交 · from ' + event.detail.previousValue });
  },
  onComponentRatingChange: function onComponentRatingChange(event) {
    var value = event.detail.value;
    var text = value > 0 ? this.data.ratingTexts[Math.max(0, Math.ceil(value) - 1)] : '未评分';
    this.setData({ componentRating: value, componentRatingStatus: value + ' / 5 · ' + text + ' · ' + event.detail.source });
  },
  onUploadChange: function onUploadChange(event) {
    var files = event.detail.files || [];
    this.setData({ uploadFiles: files, uploadStatus: files.length + ' / 3 · change：' + event.detail.source });
  },
  toggleUploadPicker: function toggleUploadPicker() {
    var picker = this.data.uploadPicker === 'media' ? 'message' : 'media';
    this.setData({
      uploadPicker: picker,
      uploadPickerText: picker === 'media' ? '相册 / 相机' : '聊天文件',
      uploadStatus: this.data.uploadFiles.length + ' / 3 · picker：' + picker,
    });
  },
  onUploadAdd: function onUploadAdd(event) {
    this.setData({ uploadStatus: (event.detail.files || []).length + ' / 3 · add：新增 ' + (event.detail.addedFiles || []).length + ' 个 ready 附件，等待业务上传' });
  },
  onUploadReject: function onUploadReject(event) {
    this.setData({ uploadStatus: this.data.uploadFiles.length + ' / 3 · reject：' + (event.detail.rejectedFiles || []).length + ' 个附件' });
  },
  onUploadError: function onUploadError(event) {
    this.setData({ uploadStatus: this.data.uploadFiles.length + ' / 3 · error：' + (event.detail.errMsg || event.detail.message || event.detail.source) });
  },
  openExampleToast: function openExampleToast() {
    var toast = this.selectComponent('#delivery-toast');
    if (!toast) {
      this.setData({ toastStatus: '未找到 Toast 实例' });
      return;
    }
    toast.show({
      message: 'PoemUI Toast 示例',
      theme: 'success',
      placement: 'bottom',
      duration: 1600,
      ariaLabel: 'PoemUI Toast 示例'
    });
    this.setData({ toastStatus: '已调用 show()，1600ms 后自动收起' });
  },
  onToastClose: function onToastClose() {
    this.setData({ toastStatus: 'close：提示已收起，不表示业务提交成功' });
  },
  startExampleTopLoading: function startExampleTopLoading() {
    this.setData({ topLoadingState: 'loading', topLoadingProgress: 0 });
  },
  advanceExampleTopLoading: function advanceExampleTopLoading() {
    var next = Math.min(100, Number(this.data.topLoadingProgress || 0) + 25);
    this.setData({ topLoadingState: next === 100 ? 'success' : 'loading', topLoadingProgress: next });
  },
  showExampleDynamicMessage: function showExampleDynamicMessage() {
    var component = this.selectComponent('#delivery-dynamic-message');
    if (!component) return;
    component.show({ key: 'install-check', theme: 'loading', title: '正在检查安装产物', message: '同一条通知会原位更新。', duration: 0 });
    this.setData({ dynamicMessageStatus: 'loading 已展示' });
  },
  completeExampleDynamicMessage: function completeExampleDynamicMessage() {
    var component = this.selectComponent('#delivery-dynamic-message');
    var updated = component && component.update('install-check', { theme: 'success', title: '安装产物可用', message: '真实 npm 组件已被示例项目调用。', duration: 1600 });
    this.setData({ dynamicMessageStatus: updated ? '同 key 已原位更新' : '请先显示灵动通知' });
  },
  onDynamicMessageClose: function onDynamicMessageClose(event) {
    this.setData({ dynamicMessageStatus: 'close：' + event.detail.reason });
  },
  advanceDeliveryProgress: function advanceDeliveryProgress() {
    var next = Math.min(100, this.data.deliveryProgress + 10);
    this.setData({ deliveryProgress: next, deliveryProgressStatus: '页面已真实回写 ' + next + '%' });
  },
  resetDeliveryProgress: function resetDeliveryProgress() {
    this.setData({ deliveryProgress: 0, deliveryProgressStatus: '页面已回写 0%' });
  },
  toggleDeliveryProgressType: function toggleDeliveryProgressType() {
    var current = this.data.deliveryProgressType;
    var next = current === 'line' ? 'plump' : (current === 'plump' ? 'circle' : 'line');
    this.setData({ deliveryProgressType: next, deliveryProgressStatus: '切换为 ' + next + ' 形态' });
  },
  onDeliveryRadioChange: function onDeliveryRadioChange(event) {
    this.setData({
      deliveryRadioValue: event.detail.value,
      deliveryRadioStatus: 'change：' + JSON.stringify(event.detail.previousValue) + ' → ' + JSON.stringify(event.detail.value) + '；父级已回写',
    });
  },
  toggleExampleSkeleton: function toggleExampleSkeleton() {
    this.setData({ skeletonLoading: !this.data.skeletonLoading });
  },
  onEmptyAction: function onEmptyAction(event) {
    this.setData({ emptyStatus: 'action Slot 内 Button click：父级已接收创建组件请求' });
  },
  openExampleNotice: function openExampleNotice() {
    this.setData({ noticeVisible: true, noticeStatus: '页面回写 visible=true' });
  },
  onNoticeChange: function onNoticeChange(event) {
    this.setData({ noticeStatus: 'vertical change：current=' + event.detail.current });
  },
  onNoticeClick: function onNoticeClick(event) {
    var trigger = event.detail && event.detail.trigger;
    if (trigger === 'suffix-icon') {
      this.setData({ noticeVisible: false, noticeStatus: 'click：suffix-icon；页面已回写 visible=false' });
      return;
    }
    if (trigger === 'operation') {
      this.setData({ noticeStatus: 'click：operation；页面已收到查看 API 请求' });
      return;
    }
    this.setData({ noticeStatus: 'click：' + trigger });
  },
  onNavbarLeft: function onNavbarLeft(event) {
    this.setData({ navbarStatus: 'left-click：' + event.detail.source + '；由页面决定如何返回' });
  },
  onBreadcrumbInput: function onBreadcrumbInput(event) {
    this.setData({ breadcrumbValue: event.detail.value, breadcrumbStatus: 'input：' + event.detail.previousValue + ' → ' + event.detail.value + ' · ' + event.detail.source });
  },
  onBreadcrumbChange: function onBreadcrumbChange(event) {
    this.setData({ breadcrumbStatus: 'change：' + event.detail.previousValue + ' → ' + event.detail.value + ' · ' + event.detail.source });
  },
  onBreadcrumbClick: function onBreadcrumbClick(event) {
    this.setData({ breadcrumbStatus: 'click：' + event.detail.value + ' · index=' + event.detail.index + ' · ' + event.detail.source });
  },
  onBreadcrumbRetry: function onBreadcrumbRetry(event) {
    this.setData({ breadcrumbMode: 'loading', breadcrumbStatus: 'retry：' + event.detail.source + '；页面进入真实 loading，等待外部请求回写' });
  },
  onBreadcrumbSuffix: function onBreadcrumbSuffix() {
    this.setData({ breadcrumbStatus: 'suffix slot 消费者 Button click；Breadcrumb change 未触发' });
  },
  setBreadcrumbMode: function setBreadcrumbMode(event) {
    var mode = event.currentTarget.dataset.mode;
    this.setData({
      breadcrumbMode: mode,
      breadcrumbDisplayItems: mode === 'empty' ? [] : this.data.breadcrumbItems,
      breadcrumbStatus: '页面回写状态：' + mode,
    });
  },
  onPageScroll: function onPageScroll(event) {
    this.setData({ backTopScroll: Math.max(0, Number(event.scrollTop) || 0) });
  },
  onListClick: function onListClick(event) {
    this.setData({ listStatus: 'click：value=' + event.detail.valueText + ' · index=' + event.detail.index + ' · ' + event.detail.source });
  },
  onListLoad: function onListLoad(event) {
    this.setData({ listMode: 'loading', listDisplayItems: [], listStatus: 'load：itemCount=' + event.detail.itemCount + '；页面进入真实 loading，等待外部请求回写' });
  },
  onListRetry: function onListRetry(event) {
    this.setData({ listMode: 'loading', listDisplayItems: [], listStatus: 'retry：' + event.detail.source + '；页面进入真实 loading，等待外部请求回写' });
  },
  requestListLoad: function requestListLoad() {
    var list = this.selectComponent('#listExample');
    if (!list || !list.loadMore()) this.setData({ listStatus: 'method：loadMore() 被当前状态阻止' });
  },
  toggleListCompact: function toggleListCompact() {
    this.setData({ listCompact: !this.data.listCompact, listStatus: '页面回写 compact=' + !this.data.listCompact });
  },
  toggleListDisabled: function toggleListDisabled() {
    this.setData({ listDisabled: !this.data.listDisabled, listStatus: '页面回写 disabled=' + !this.data.listDisabled });
  },
  setListMode: function setListMode(event) {
    var mode = event.currentTarget.dataset.mode;
    this.setData({
      listMode: mode,
      listDisplayItems: mode === 'content' || mode === 'finished' ? this.data.listItems : [],
      listStatus: '页面回写状态：' + mode,
    });
  },
  onSwitchChange: function onSwitchChange(event) {
    this.setData({
      notification: !!event.detail.checked,
      notificationValue: event.detail.value,
      switchStatus: 'change：' + JSON.stringify(event.detail.previousValue) + ' → ' + JSON.stringify(event.detail.value),
    });
  },
  openAlert: function openAlert() {
    this.setData({ alertVisible: true, alertStatus: '请求打开 Alert' });
  },
  onAlertInput: function onAlertInput(event) {
    this.setData({ alertVisible: !!event.detail.visible, alertStatus: 'input：' + event.detail.source });
  },
  onAlertChange: function onAlertChange(event) {
    this.setData({ alertVisible: !!event.detail.visible, alertStatus: 'change：' + event.detail.source });
  },
  onAlertClose: function onAlertClose(event) {
    this.setData({ alertStatus: 'close：' + event.detail.source });
  },
  onChannelChange: function onChannelChange(event) {
    this.setData({ channel: event.detail.value });
  },
  onPublicChange: function onPublicChange(event) {
    this.setData({ isPublic: !!event.detail.value });
  },
  onPublishScopeChange: function onPublishScopeChange(event) {
    this.setData({ publishScope: event.detail.value });
  },
  openDeliveryDateTimePicker: function openDeliveryDateTimePicker() {
    var picker = this.selectComponent('#deliveryDateTimePicker');
    if (picker) picker.open();
  },
  onDeliveryDateTimeVisibleChange: function onDeliveryDateTimeVisibleChange(event) {
    this.setData({ deliveryDateTimeVisible: !!event.detail.visible });
  },
  onDeliveryDateTimeConfirm: function onDeliveryDateTimeConfirm(event) {
    this.setData({ publishAtStatus: 'confirm：' + event.detail.value + '，等待 change 回写' });
  },
  onDeliveryDateTimeChange: function onDeliveryDateTimeChange(event) {
    this.setData({ publishAt: event.detail.value, publishAtStatus: 'change：父级已回写 ' + event.detail.value });
  },
  onDeliveryDateTimeCancel: function onDeliveryDateTimeCancel(event) {
    this.setData({ publishAtStatus: 'cancel：保留 ' + event.detail.value });
  },
  selectIcon: function selectIcon(event) {
    this.setData({ selectedIcon: event.currentTarget.dataset.icon, iconStatus: '已切换到 ' + event.currentTarget.dataset.icon });
  },
  onIconLoad: function onIconLoad() {
    this.setData({ iconStatus: 'load 事件：着色图标已完成渲染' });
  },
  onIconError: function onIconError(event) {
    this.setData({ iconStatus: 'error 事件：' + (event.detail.name || 'unknown') });
  },
  onDeliveryButtonClick: function onDeliveryButtonClick(event) {
    this.setData({ deliveryButtonStatus: 'click：source=' + event.detail.source + ' / theme=' + event.detail.theme + ' / formType=' + event.detail.formType });
  },
  onDeliveryButtonSubmit: function onDeliveryButtonSubmit(event) {
    this.setData({ deliveryButtonStatus: 'submit：真实 form 事件 / value=' + JSON.stringify(event.detail.value || {}) });
  },
  onDeliveryButtonContact: function onDeliveryButtonContact(event) {
    this.setData({ deliveryButtonStatus: 'contact：微信平台已回调 / path=' + String(event.detail.path || '') });
  },
  onDeliveryButtonError: function onDeliveryButtonError(event) {
    this.setData({ deliveryButtonStatus: 'error：' + String(event.detail.errMsg || '平台能力失败') });
  },
  toggleDeliveryButtonLoading: function toggleDeliveryButtonLoading() {
    this.setData({
      deliveryButtonLoading: !this.data.deliveryButtonLoading,
      deliveryButtonStatus: '父级回写 loading=' + String(!this.data.deliveryButtonLoading),
    });
  },
  toggleDeliveryButtonDisabled: function toggleDeliveryButtonDisabled() {
    this.setData({
      deliveryButtonDisabled: !this.data.deliveryButtonDisabled,
      deliveryButtonStatus: '父级回写 disabled=' + String(!this.data.deliveryButtonDisabled),
    });
  },
  onDeliveryCheckboxChange: function onDeliveryCheckboxChange(event) {
    this.setData({
      deliveryCheckboxChecked: event.detail.checked,
      deliveryCheckboxIndeterminate: false,
      deliveryCheckboxStatus: '单项 change：value=' + String(event.detail.value) + ' / checked=' + String(event.detail.checked) + ' / source=' + event.detail.source,
    });
  },
  onDeliveryCheckboxGroupChange: function onDeliveryCheckboxGroupChange(event) {
    this.setData({
      deliveryCheckboxValue: event.detail.value,
      deliveryCheckboxStatus: 'Group change：value=' + JSON.stringify(event.detail.value) + ' / checkAll=' + String(event.detail.checkAll),
    });
  },
  onDeliveryCollapsibleClick: function onDeliveryCollapsibleClick(event) {
    if (event.detail.blocked) {
      this.setData({ deliveryCollapsibleStatus: 'click：source=' + event.detail.source + ' / blocked=readonly' });
    }
  },
  onDeliveryCollapsibleInput: function onDeliveryCollapsibleInput(event) {
    this.setData({ deliveryCollapsibleOpen: !!event.detail.open });
  },
  onDeliveryCollapsibleChange: function onDeliveryCollapsibleChange(event) {
    this.setData({ deliveryCollapsibleStatus: 'change：source=' + event.detail.source + ' / open=' + String(event.detail.open) + ' / parent write-back' });
  },
  onDeliveryCollapsibleOpen: function onDeliveryCollapsibleOpen(event) {
    this.setData({ deliveryCollapsibleStatus: 'open：source=' + event.detail.source + ' / 等待真实 transitionend' });
  },
  onDeliveryCollapsibleClose: function onDeliveryCollapsibleClose(event) {
    this.setData({ deliveryCollapsibleStatus: 'close：source=' + event.detail.source + ' / 等待真实 transitionend' });
  },
  onDeliveryCollapsibleAfterOpen: function onDeliveryCollapsibleAfterOpen(event) {
    this.setData({ deliveryCollapsibleStatus: 'after-open：source=' + event.detail.source });
  },
  onDeliveryCollapsibleAfterClose: function onDeliveryCollapsibleAfterClose(event) {
    this.setData({ deliveryCollapsibleStatus: 'after-close：source=' + event.detail.source });
  },
  onDeliveryCollapsibleRetry: function onDeliveryCollapsibleRetry() {
    this.setData({ deliveryCollapsibleStatus: 'retry：等待消费者重新请求，错误态未被伪造为成功' });
  },
  onDeliveryCollapsibleContentAction: function onDeliveryCollapsibleContentAction() {
    this.setData({ deliveryCollapsibleStatus: 'default slot Button click：未触发 Collapsible change' });
  },
  openDeliveryCollapsible: function openDeliveryCollapsible() {
    var component = this.selectComponent('#deliveryCollapsible');
    if (component) component.open();
  },
  closeDeliveryCollapsible: function closeDeliveryCollapsible() {
    var component = this.selectComponent('#deliveryCollapsible');
    if (component) component.close();
  },
  toggleDeliveryCollapsible: function toggleDeliveryCollapsible() {
    var component = this.selectComponent('#deliveryCollapsible');
    if (component) component.toggle();
  },
  measureDeliveryCollapsible: function measureDeliveryCollapsible() {
    var component = this.selectComponent('#deliveryCollapsible');
    if (component) component.measure();
    this.setData({ deliveryCollapsibleStatus: 'measure()：已重新执行 selector query，不改变 open' });
  },
  toggleDeliveryCollapsibleLoading: function toggleDeliveryCollapsibleLoading() {
    this.setData({
      deliveryCollapsibleLoading: !this.data.deliveryCollapsibleLoading,
      deliveryCollapsibleStatus: '父级回写 loading=' + String(!this.data.deliveryCollapsibleLoading),
    });
  },
  toggleDeliveryCollapsibleError: function toggleDeliveryCollapsibleError() {
    this.setData({
      deliveryCollapsibleError: !this.data.deliveryCollapsibleError,
      deliveryCollapsibleStatus: '父级回写 error=' + String(!this.data.deliveryCollapsibleError),
    });
  },
  toggleDeliveryCollapsibleReadonly: function toggleDeliveryCollapsibleReadonly() {
    this.setData({
      deliveryCollapsibleReadonly: !this.data.deliveryCollapsibleReadonly,
      deliveryCollapsibleStatus: '父级回写 readonly=' + String(!this.data.deliveryCollapsibleReadonly),
    });
  },
  onDeliveryComboboxQueryInput: function onDeliveryComboboxQueryInput(event) {
    this.setData({ deliveryComboboxQuery: event.detail.query });
  },
  onDeliveryComboboxVisibleInput: function onDeliveryComboboxVisibleInput(event) {
    this.setData({ deliveryComboboxVisible: !!event.detail.visible });
  },
  onDeliveryComboboxInput: function onDeliveryComboboxInput(event) {
    this.setData({ deliveryComboboxValue: event.detail.value });
  },
  onDeliveryComboboxChange: function onDeliveryComboboxChange(event) {
    this.setData({ deliveryComboboxStatus: 'change：source=' + event.detail.source + ' / value=' + JSON.stringify(event.detail.value) + ' / parent write-back' });
  },
  onDeliveryComboboxQueryChange: function onDeliveryComboboxQueryChange(event) {
    this.setData({ deliveryComboboxStatus: 'query-change：source=' + event.detail.source + ' / query=' + event.detail.query });
  },
  onDeliveryComboboxVisibleChange: function onDeliveryComboboxVisibleChange(event) {
    this.setData({ deliveryComboboxStatus: 'visible-change：source=' + event.detail.source + ' / visible=' + event.detail.visible });
  },
  onDeliveryComboboxSelect: function onDeliveryComboboxSelect(event) {
    this.setData({ deliveryComboboxStatus: 'select：' + event.detail.option.label + ' / source=' + event.detail.source });
  },
  onDeliveryComboboxRemove: function onDeliveryComboboxRemove(event) {
    this.setData({ deliveryComboboxStatus: 'remove：' + event.detail.option.label + ' / source=' + event.detail.source });
  },
  onDeliveryComboboxClear: function onDeliveryComboboxClear() {
    this.setData({ deliveryComboboxStatus: 'clear：选值已由页面真实回写' });
  },
  onDeliveryComboboxCreate: function onDeliveryComboboxCreate(event) {
    this.setData({ deliveryComboboxStatus: 'create：' + event.detail.value + ' / 随后进入真实选择合同' });
  },
  onDeliveryComboboxExceed: function onDeliveryComboboxExceed(event) {
    this.setData({ deliveryComboboxStatus: 'exceed：最多选择 ' + event.detail.maxSelected + ' 项，value 未改变' });
  },
  onDeliveryComboboxOpen: function onDeliveryComboboxOpen(event) {
    this.setData({ deliveryComboboxStatus: 'open：source=' + event.detail.source + ' / 等待真实 transitionend' });
  },
  onDeliveryComboboxClose: function onDeliveryComboboxClose(event) {
    this.setData({ deliveryComboboxStatus: 'close：source=' + event.detail.source + ' / 等待真实 transitionend' });
  },
  onDeliveryComboboxAfterOpen: function onDeliveryComboboxAfterOpen(event) {
    this.setData({ deliveryComboboxStatus: 'after-open：source=' + event.detail.source });
  },
  onDeliveryComboboxAfterClose: function onDeliveryComboboxAfterClose(event) {
    this.setData({ deliveryComboboxStatus: 'after-close：source=' + event.detail.source });
  },
  onDeliveryComboboxReset: function onDeliveryComboboxReset(event) {
    this.setData({ deliveryComboboxStatus: 'reset：value=' + JSON.stringify(event.detail.value) + ' / query=' + event.detail.query + ' / visible=' + event.detail.visible });
  },
  onDeliveryComboboxRetry: function onDeliveryComboboxRetry() {
    this.setData({ deliveryComboboxStatus: 'retry：等待消费者重新请求，错误态未被伪造为成功' });
  },
  onDeliveryComboboxFooter: function onDeliveryComboboxFooter() {
    this.setData({ deliveryComboboxStatus: 'footer slot Button click：未伪造提交或关闭' });
  },
  openDeliveryCombobox: function openDeliveryCombobox() {
    var component = this.selectComponent('#deliveryCombobox');
    if (component) component.open();
  },
  closeDeliveryCombobox: function closeDeliveryCombobox() {
    var component = this.selectComponent('#deliveryCombobox');
    if (component) component.close();
  },
  clearDeliveryCombobox: function clearDeliveryCombobox() {
    var component = this.selectComponent('#deliveryCombobox');
    if (component) component.clear();
  },
  resetDeliveryCombobox: function resetDeliveryCombobox() {
    var component = this.selectComponent('#deliveryCombobox');
    if (component) component.reset();
  },
  focusDeliveryCombobox: function focusDeliveryCombobox() {
    var component = this.selectComponent('#deliveryCombobox');
    if (component) component.focus();
  },
  selectNextDeliveryCombobox: function selectNextDeliveryCombobox() {
    var component = this.selectComponent('#deliveryCombobox');
    if (component) component.select('next');
  },
  toggleDeliveryComboboxMultiple: function toggleDeliveryComboboxMultiple() {
    var next = !this.data.deliveryComboboxMultiple;
    var current = this.data.deliveryComboboxValue;
    this.setData({
      deliveryComboboxMultiple: next,
      deliveryComboboxValue: next ? (Array.isArray(current) ? current : (current === null ? [] : [current])) : (Array.isArray(current) ? (current[0] === undefined ? null : current[0]) : current),
      deliveryComboboxStatus: '页面回写 multiple=' + next + ' 并同步 value 形状',
    });
  },
  toggleDeliveryComboboxLoading: function toggleDeliveryComboboxLoading() {
    var next = !this.data.deliveryComboboxLoading;
    this.setData({ deliveryComboboxLoading: next, deliveryComboboxError: false, deliveryComboboxStatus: '页面回写 loading=' + next });
  },
  toggleDeliveryComboboxError: function toggleDeliveryComboboxError() {
    var next = !this.data.deliveryComboboxError;
    this.setData({ deliveryComboboxError: next, deliveryComboboxLoading: false, deliveryComboboxStatus: '页面回写 error=' + next });
  },
  onBubbleClick: function onBubbleClick(event) {
    this.setData({ bubbleStatus: 'click：' + event.detail.source });
  },
  onBubbleLongpress: function onBubbleLongpress(event) {
    this.setData({ bubbleStatus: 'longpress：' + event.detail.source });
  },
  onBubbleReaction: function onBubbleReaction(event) {
    this.setData({ bubbleStatus: 'reaction：value=' + String(event.detail.value) + ' / active=' + String(event.detail.active) + '（未改计数）' });
  },
  onBubbleExpandedInput: function onBubbleExpandedInput(event) {
    this.setData({ bubbleExpanded: !!event.detail.value, bubbleStatus: 'input：父级回写 expanded=' + String(!!event.detail.value) });
  },
  onBubbleExpandedChange: function onBubbleExpandedChange(event) {
    this.setData({ bubbleStatus: 'change：' + event.detail.source + ' / expanded=' + String(!!event.detail.value) });
  },
  onBubbleExpand: function onBubbleExpand(event) {
    this.setData({ bubbleStatus: 'expand：' + event.detail.source + ' / 父级已回写' });
  },
  onBubbleCollapse: function onBubbleCollapse(event) {
    this.setData({ bubbleStatus: 'collapse：' + event.detail.source + ' / 父级已回写' });
  },
  toggleBubbleVisible: function toggleBubbleVisible() {
    this.setData({ bubbleVisible: !this.data.bubbleVisible });
  },
  toggleBubbleExpandedWithMethod: function toggleBubbleExpandedWithMethod() {
    var bubble = this.selectComponent('#delivery-bubble');
    if (bubble) bubble.toggle();
  },
  onBubbleShow: function onBubbleShow() {
    this.setData({ bubbleStatus: 'show：进入动画开始' });
  },
  onBubbleHide: function onBubbleHide() {
    this.setData({ bubbleStatus: 'hide：退场动画开始' });
  },
  onBubbleAfterShow: function onBubbleAfterShow() {
    this.setData({ bubbleStatus: 'after-show：Bubble 已显示' });
  },
  onBubbleAfterHide: function onBubbleAfterHide() {
    this.setData({ bubbleStatus: 'after-hide：Bubble 节点已卸载' });
  },
  onExampleCardClick: function onExampleCardClick(event) {
    this.setData({ cardStatus: 'Card click：' + event.detail.source });
  },
  onExampleCardFooterClick: function onExampleCardFooterClick() {
    this.setData({ cardFooterStatus: 'footer Button click：已保存草稿' });
  },
  onAvatarError: function onAvatarError(event) {
    this.setData({ avatarStatus: 'error：' + (event.detail.src || '图片资源') });
  },
  onImageError: function onImageError(event) {
    this.setData({ imageStatus: 'error：' + (event.detail.src || '图片资源') });
  },
  onGridClick: function onGridClick(event) {
    this.setData({ gridStatus: 'click：' + event.detail.item.label + ' / ' + String(event.detail.value) + ' / ' + event.detail.source });
  },
  onGridRetry: function onGridRetry(event) {
    this.setData({ gridError: false, gridLoading: true, gridStatus: 'retry：' + event.detail.source + '；父级已开始真实重试，等待结果' });
  },
  showGridError: function showGridError() {
    this.setData({ gridError: true, gridLoading: false, gridStatus: '父级请求失败；可点击 Grid 重试' });
  },
  restoreGrid: function restoreGrid() {
    this.setData({ gridError: false, gridLoading: false, gridStatus: '父级已回写可用入口' });
  },
  setScrollAreaTarget: function setScrollAreaTarget(event) {
    var target = event.currentTarget.dataset.target || '';
    this.setData({ scrollAreaTarget: target, scrollAreaStatus: target ? '父级已回写 ' + target : '未请求定位' });
  },
  onCollapseChange: function onCollapseChange(event) {
    var value = event.detail.value;
    this.setData({ collapseValue: value, collapseStatus: 'change：' + (value.length ? JSON.stringify(value) : '全部收起') });
  },
  startCountDown: function startCountDown() {
    var countDown = this.selectComponent('#countDownExample');
    if (!countDown) return;
    if (countDown.start()) this.setData({ countDownRunning: true, countDownStatus: 'start()：继续当前剩余时间' });
  },
  pauseCountDown: function pauseCountDown() {
    var countDown = this.selectComponent('#countDownExample');
    if (!countDown) return;
    if (countDown.pause()) this.setData({ countDownRunning: false, countDownStatus: 'pause()：保存精确剩余时间' });
  },
  resetCountDown: function resetCountDown() {
    var countDown = this.selectComponent('#countDownExample');
    if (!countDown) return;
    countDown.reset();
    this.setData({ countDownRunning: true, countDownStatus: 'reset()：恢复 time 并按 autoStart 运行' });
  },
  readCountDownTime: function readCountDownTime() {
    var countDown = this.selectComponent('#countDownExample');
    if (!countDown) return;
    this.setData({ countDownStatus: 'getTime()：' + countDown.getTime() + 'ms' });
  },
  onCountDownChange: function onCountDownChange(event) {
    this.setData({ countDownState: event.detail, countDownStatus: 'change：' + event.detail.time + 'ms · ' + event.detail.formatted });
  },
  onCountDownFinish: function onCountDownFinish(event) {
    this.setData({ countDownRunning: false, countDownState: event.detail, countDownStatus: 'finish：time=0 · ' + event.detail.formatted });
  },
  onTableRowClick: function onTableRowClick(event) {
    this.setData({ tableStatus: 'row-click：key=' + event.detail.key + ' · index=' + event.detail.index });
  },
  onTableCellClick: function onTableCellClick(event) {
    this.setData({ tableStatus: 'cell-click：key=' + event.detail.key + ' · column=' + event.detail.column.key });
  },
  onTableInput: function onTableInput(event) {
    this.setData({ tableSelectedRowKeys: event.detail.value, tableStatus: 'input：已选择 ' + event.detail.value.length + ' 行' });
  },
  onTableChange: function onTableChange(event) {
    this.setData({ tableStatus: 'change：已选择 ' + event.detail.selectedRowKeys.length + ' 行 · ' + event.detail.source });
  },
  onTableSortChange: function onTableSortChange(event) {
    this.setData({ tableSort: event.detail.sort, tableStatus: 'sort-change：' + (event.detail.key || '—') + ' / ' + (event.detail.order || 'none') });
  },
  onTableScroll: function onTableScroll(event) {
    this.setData({ tableStatus: 'scroll：left=' + Math.round(event.detail.scrollLeft) + ' · top=' + Math.round(event.detail.scrollTop) });
  },
  onTableRetry: function onTableRetry(event) {
    this.setData({ tableStatus: 'retry：' + event.detail.source + ' · 等待业务重新请求' });
  },
  tableScrollLeft: function tableScrollLeft() {
    var table = this.selectComponent('#deliveryTable');
    if (table) table.scrollTo({ left: 0 });
  },
  tableScrollRight: function tableScrollRight() {
    var table = this.selectComponent('#deliveryTable');
    if (table) table.scrollTo({ left: 100000 });
  },
  tableClearSelection: function tableClearSelection() {
    var table = this.selectComponent('#deliveryTable');
    if (table) table.clearSelection();
  },
  tableClearSort: function tableClearSort() {
    var table = this.selectComponent('#deliveryTable');
    if (table) table.clearSort();
  },
  onSwiperClick: function onSwiperClick(event) {
    this.setData({ swiperStatus: 'click：value=' + JSON.stringify(event.detail.value) + ' · index=' + event.detail.index + ' · active=' + event.detail.active });
  },
  onSwiperInput: function onSwiperInput(event) {
    this.setData({ swiperValue: event.detail.value, swiperStatus: 'input：父级回写 value=' + JSON.stringify(event.detail.value) + ' · source=' + event.detail.source });
  },
  onSwiperChange: function onSwiperChange(event) {
    this.setData({ swiperStatus: 'change：' + JSON.stringify(event.detail.previousValue) + ' → ' + JSON.stringify(event.detail.value) + ' · ' + event.detail.source });
  },
  onSwiperAnimationFinish: function onSwiperAnimationFinish(event) {
    this.setData({ swiperStatus: 'animationfinish：value=' + JSON.stringify(event.detail.value) + ' · index=' + event.detail.index });
  },
  onSwiperImageLoad: function onSwiperImageLoad(event) {
    this.setData({ swiperStatus: 'image-load：index=' + event.detail.index });
  },
  onSwiperImageError: function onSwiperImageError(event) {
    this.setData({ swiperStatus: 'image-error：index=' + event.detail.index });
  },
  onSwiperRetry: function onSwiperRetry(event) {
    this.setData({ swiperMode: 'loading', swiperStatus: 'retry：' + event.detail.source + '；页面进入真实 loading，等待外部请求回写' });
  },
  setSwiperMode: function setSwiperMode(event) {
    var mode = event.currentTarget.dataset.mode;
    this.setData({
      swiperMode: mode,
      swiperDisplayItems: mode === 'empty' ? [] : this.data.swiperItems,
      swiperStatus: '页面回写状态：' + mode,
    });
  },
  swiperPrevious: function swiperPrevious() {
    var swiper = this.selectComponent('#deliverySwiper');
    if (swiper) swiper.prev();
  },
  swiperNext: function swiperNext() {
    var swiper = this.selectComponent('#deliverySwiper');
    if (swiper) swiper.next();
  },
  swiperReset: function swiperReset() {
    var swiper = this.selectComponent('#deliverySwiper');
    if (swiper) swiper.reset();
  },
  swiperGetState: function swiperGetState() {
    var swiper = this.selectComponent('#deliverySwiper');
    var state = swiper ? swiper.getState() : null;
    this.setData({ swiperStatus: state ? 'getState()：value=' + JSON.stringify(state.value) + ' · index=' + state.index + ' · controlled=' + state.controlled : 'Swiper 实例不存在' });
  },
  onNavigationMenuClick: function onNavigationMenuClick(event) {
    this.setData({ navigationMenuStatus: 'click：root=' + JSON.stringify(event.detail.value) + ' · hasChildren=' + event.detail.hasChildren });
  },
  onNavigationMenuItemClick: function onNavigationMenuItemClick(event) {
    this.setData({ navigationMenuStatus: 'item-click：value=' + JSON.stringify(event.detail.value) + ' · type=' + event.detail.type + ' · depth=' + event.detail.depth });
  },
  onNavigationMenuInput: function onNavigationMenuInput(event) {
    this.setData({ navigationMenuValue: event.detail.value, navigationMenuStatus: 'input：父级回写 value=' + JSON.stringify(event.detail.value) + ' · source=' + event.detail.source });
  },
  onNavigationMenuChange: function onNavigationMenuChange(event) {
    this.setData({ navigationMenuStatus: 'change：' + JSON.stringify(event.detail.previousValue) + ' → ' + JSON.stringify(event.detail.value) + ' · controlled=' + event.detail.controlled });
  },
  onNavigationMenuSelect: function onNavigationMenuSelect(event) {
    this.setData({ navigationMenuStatus: 'select：value=' + JSON.stringify(event.detail.value) + ' · changed=' + event.detail.changed + ' · source=' + event.detail.source });
  },
  onNavigationMenuExpandedInput: function onNavigationMenuExpandedInput(event) {
    this.setData({ navigationMenuExpanded: event.detail.expandedValue, navigationMenuStatus: 'expanded-input：父级回写 ' + JSON.stringify(event.detail.expandedValue) });
  },
  onNavigationMenuExpandedChange: function onNavigationMenuExpandedChange(event) {
    this.setData({ navigationMenuStatus: 'expanded-change：' + JSON.stringify(event.detail.previousExpandedValue) + ' → ' + JSON.stringify(event.detail.expandedValue) });
  },
  onNavigationMenuVisibleInput: function onNavigationMenuVisibleInput(event) {
    this.setData({ navigationMenuVisible: event.detail.visible, navigationMenuStatus: 'visible-input：父级回写 visible=' + event.detail.visible + ' · ' + event.detail.source });
  },
  onNavigationMenuVisibleChange: function onNavigationMenuVisibleChange(event) {
    this.setData({ navigationMenuStatus: 'visible-change：' + event.detail.previousVisible + ' → ' + event.detail.visible + ' · ' + event.detail.source });
  },
  onNavigationMenuOpen: function onNavigationMenuOpen(event) {
    this.setData({ navigationMenuStatus: 'open：source=' + event.detail.source + ' · expanded=' + JSON.stringify(event.detail.expandedValue) });
  },
  onNavigationMenuClose: function onNavigationMenuClose(event) {
    this.setData({ navigationMenuStatus: 'close：source=' + event.detail.source + ' · 等待真实退场' });
  },
  onNavigationMenuAfterOpen: function onNavigationMenuAfterOpen(event) {
    this.setData({ navigationMenuStatus: 'after-open：source=' + event.detail.source + ' · 面板进场完成' });
  },
  onNavigationMenuAfterClose: function onNavigationMenuAfterClose(event) {
    this.setData({ navigationMenuStatus: 'after-close：source=' + event.detail.source + ' · path=' + JSON.stringify(event.detail.path || []) });
  },
  onNavigationMenuCheckedInput: function onNavigationMenuCheckedInput(event) {
    this.setData({ navigationMenuChecked: event.detail.checkedValues, navigationMenuStatus: 'checked-input：父级回写 ' + JSON.stringify(event.detail.checkedValues) });
  },
  onNavigationMenuCheckedChange: function onNavigationMenuCheckedChange(event) {
    this.setData({ navigationMenuStatus: 'checked-change：value=' + JSON.stringify(event.detail.value) + ' · checked=' + event.detail.checked });
  },
  onNavigationMenuRadioInput: function onNavigationMenuRadioInput(event) {
    this.setData({ navigationMenuRadio: event.detail.radioValues, navigationMenuStatus: 'radio-input：父级回写 ' + event.detail.group + '=' + JSON.stringify(event.detail.value) });
  },
  onNavigationMenuRadioChange: function onNavigationMenuRadioChange(event) {
    this.setData({ navigationMenuStatus: 'radio-change：group=' + event.detail.group + ' · value=' + JSON.stringify(event.detail.value) });
  },
  onNavigationMenuSubmenuOpen: function onNavigationMenuSubmenuOpen(event) {
    this.setData({ navigationMenuStatus: 'submenu-open：depth=' + event.detail.depth + ' · path=' + JSON.stringify(event.detail.path) });
  },
  onNavigationMenuSubmenuClose: function onNavigationMenuSubmenuClose(event) {
    this.setData({ navigationMenuStatus: 'submenu-close：depth=' + event.detail.depth + ' · path=' + JSON.stringify(event.detail.path) });
  },
  onNavigationMenuNavigate: function onNavigationMenuNavigate(event) {
    this.setData({ navigationMenuStatus: 'navigate：' + event.detail.openType + ' ' + (event.detail.url || 'delta=' + event.detail.delta) + ' · auto=' + event.detail.auto + '；等待平台结果' });
  },
  onNavigationMenuNavigateSuccess: function onNavigationMenuNavigateSuccess(event) {
    this.setData({ navigationMenuStatus: 'navigate-success：微信 ' + event.detail.openType + ' 真实回调' });
  },
  onNavigationMenuNavigateError: function onNavigationMenuNavigateError(event) {
    this.setData({ navigationMenuStatus: 'navigate-error：' + ((event.detail.error && event.detail.error.errMsg) || '微信导航失败') });
  },
  onNavigationMenuOverlay: function onNavigationMenuOverlay(event) {
    this.setData({ navigationMenuStatus: 'overlay-click：close=' + event.detail.close });
  },
  onNavigationMenuRetry: function onNavigationMenuRetry(event) {
    this.setData({ navigationMenuStatus: 'retry：source=' + event.detail.source + '；等待消费者重新请求，不伪造恢复' });
  },
  onNavigationMenuScroll: function onNavigationMenuScroll(event) {
    var now = Date.now();
    if (this.navigationMenuScrollAt && now - this.navigationMenuScrollAt < 180) return;
    this.navigationMenuScrollAt = now;
    this.setData({ navigationMenuStatus: 'scroll：source=' + event.detail.source + ' · top=' + Math.round(event.detail.scrollTop || 0) + ' · left=' + Math.round(event.detail.scrollLeft || 0) });
  },
  onNavigationMenuReset: function onNavigationMenuReset(event) {
    this.setData({ navigationMenuStatus: 'reset：value=' + JSON.stringify(event.detail.value) + ' · expanded=' + JSON.stringify(event.detail.expandedValue) });
  },
  navigationMenuOpen: function navigationMenuOpen() {
    var component = this.selectComponent('#deliveryNavigationMenu');
    if (component) component.open('components', 'method-open');
  },
  navigationMenuClose: function navigationMenuClose() {
    var component = this.selectComponent('#deliveryNavigationMenu');
    if (component) component.close('method-close');
  },
  navigationMenuToggle: function navigationMenuToggle() {
    var component = this.selectComponent('#deliveryNavigationMenu');
    if (component) component.toggle('components', 'method-toggle');
  },
  navigationMenuBack: function navigationMenuBack() {
    var component = this.selectComponent('#deliveryNavigationMenu');
    if (component && !component.back('method-back')) this.setData({ navigationMenuStatus: 'back()：当前已是根层' });
  },
  navigationMenuSelectFalse: function navigationMenuSelectFalse() {
    var component = this.selectComponent('#deliveryNavigationMenu');
    if (component) component.select(false, 'method-select');
  },
  navigationMenuOpenSubmenu: function navigationMenuOpenSubmenu() {
    var component = this.selectComponent('#deliveryNavigationMenu');
    if (component && !component.openSubmenu(0, 'method-submenu')) this.setData({ navigationMenuStatus: 'openSubmenu(0)：当前状态不可进入' });
  },
  navigationMenuReset: function navigationMenuReset() {
    var component = this.selectComponent('#deliveryNavigationMenu');
    if (component) component.reset('method-reset');
  },
  navigationMenuGetState: function navigationMenuGetState() {
    var component = this.selectComponent('#deliveryNavigationMenu');
    var componentState = component ? component.getState() : null;
    this.setData({ navigationMenuStatus: componentState ? 'getState()：value=' + JSON.stringify(componentState.value) + ' · expanded=' + JSON.stringify(componentState.expandedValue) + ' · visible=' + componentState.visible + ' · depth=' + componentState.depth + ' · state=' + componentState.stateType : 'NavigationMenu 实例不存在' });
  },
  setNavigationMenuState: function setNavigationMenuState(event) {
    var mode = event.currentTarget.dataset.mode;
    this.setData({
      navigationMenuState: mode,
      navigationMenuDisplayItems: mode === 'empty' ? [] : this.data.navigationMenuItems,
      navigationMenuStatus: '页面回写状态：' + mode,
    });
  },
  toggleNavigationMenuMode: function toggleNavigationMenuMode() {
    var next = this.data.navigationMenuMode === 'navigation' ? 'menubar' : 'navigation';
    this.setData({ navigationMenuMode: next, navigationMenuStatus: '页面回写 mode=' + next });
  },
  toggleNavigationMenuReadonly: function toggleNavigationMenuReadonly() {
    var next = !this.data.navigationMenuReadonly;
    this.setData({ navigationMenuReadonly: next, navigationMenuStatus: '页面回写 readonly=' + next });
  },
  toggleNavigationMenuAutoNavigate: function toggleNavigationMenuAutoNavigate() {
    var next = !this.data.navigationMenuAutoNavigate;
    this.setData({ navigationMenuAutoNavigate: next, navigationMenuStatus: next ? 'autoNavigate=true：link 将调用真实微信 API' : 'autoNavigate=false：link 只派发 navigate 请求' });
  },
  openCalendar: function openCalendar() {
    this.setData({ calendarVisible: true, calendarStatus: '页面回写 visible=true' });
  },
  onCalendarChange: function onCalendarChange(event) {
    this.setData({ calendarValue: event.detail.value, calendarStatus: 'change：父级回写 · ' + (event.detail.values.join(' ~ ') || '已清空') });
  },
  onCalendarLimit: function onCalendarLimit(event) {
    this.setData({ calendarStatus: 'limit：' + event.detail.type + ' 最多 ' + event.detail.max });
  },
  onCalendarPanelChange: function onCalendarPanelChange(event) {
    this.setData({ calendarStatus: 'panel-change：' + event.detail.month + ' · ' + event.detail.source });
  },
  onCalendarVisibleChange: function onCalendarVisibleChange(event) {
    this.setData({ calendarVisible: event.detail.visible, calendarStatus: 'visible-change：' + event.detail.visible + ' · ' + event.detail.source });
  },
  onCalendarConfirm: function onCalendarConfirm(event) {
    this.setData({ calendarStatus: 'confirm：' + (event.detail.values.join(' ~ ') || '未选择') });
  },
  onCalendarCancel: function onCalendarCancel() {
    this.setData({ calendarStatus: 'cancel：等待 visible 回写' });
  },
  onCalendarRetry: function onCalendarRetry(event) {
    this.setData({ calendarStatus: 'retry：' + event.detail.month + ' · 等待业务重新请求' });
  },
  openDialog: function openDialog() {
    this.setData({ dialogVisible: true, dialogStatus: '请求打开 Dialog' });
  },
  onDialogConfirm: function onDialogConfirm() {
    this.setData({ dialogStatus: 'confirm：页面继续处理发布业务' });
  },
  onDialogCancel: function onDialogCancel() {
    this.setData({ dialogStatus: 'cancel：随后等待 close 回写' });
  },
  onDialogClose: function onDialogClose(event) {
    this.setData({ dialogVisible: false, dialogStatus: 'close：' + (event.detail.trigger || 'programmatic') });
  },
  onDialogOverlayClick: function onDialogOverlayClick() {
    this.setData({ dialogStatus: 'overlay-click：等待 close 回写' });
  },
  toggleDeliveryDirection: function toggleDeliveryDirection() {
    var next = this.data.deliveryDirection === 'rtl' ? 'ltr' : 'rtl';
    this.setData({
      deliveryDirection: next,
      deliveryDirectionStatus: '页面回写 direction=' + next + '，等待组件解析',
    });
  },
  refreshDeliveryDirection: function refreshDeliveryDirection() {
    var direction = this.selectComponent('#deliveryDirection');
    if (!direction) {
      this.setData({ deliveryDirectionStatus: 'Direction 实例尚未就绪' });
      return;
    }
    var state = direction.refresh('example-refresh');
    this.setData({ deliveryDirectionStatus: 'refresh()：direction=' + state.direction + ' · source=example-refresh' });
  },
  getDeliveryDirectionState: function getDeliveryDirectionState() {
    var direction = this.selectComponent('#deliveryDirection');
    if (!direction) {
      this.setData({ deliveryDirectionStatus: 'Direction 实例尚未就绪' });
      return;
    }
    var state = direction.getState();
    this.setData({
      deliveryDirectionStatus: 'getState()：' + state.direction + ' · language=' + (state.language || 'none') + ' · align=' + state.textAlign,
    });
  },
  onDirectionResolve: function onDirectionResolve(event) {
    this.setData({
      deliveryDirectionStatus: 'resolve：' + event.detail.requestedDirection + ' → ' + event.detail.direction + ' · ' + event.detail.languageSource,
    });
  },
  onDirectionReady: function onDirectionReady(event) {
    this.setData({ deliveryDirectionStatus: 'ready：direction=' + event.detail.direction });
  },
  onDirectionChange: function onDirectionChange(event) {
    this.setData({
      deliveryDirectionStatus: 'change：' + event.detail.previousDirection + ' → ' + event.detail.direction,
    });
  },
  onDirectionAfterChange: function onDirectionAfterChange(event) {
    this.setData({ deliveryDirectionStatus: 'after-change：direction=' + event.detail.direction + ' · 动效完成' });
  },
  openPopup: function openPopup() {
    this.setData({ popupVisible: true, popupResult: '页面请求 visible=true' });
  },
  onPopupVisibleChange: function onPopupVisibleChange(event) {
    var detail = event && event.detail ? event.detail : {};
    this.setData({ popupVisible: Boolean(detail.visible), popupResult: 'visible-change：' + (detail.trigger || 'unknown') + ' → ' + Boolean(detail.visible) });
  },
  openPopover: function openPopover() {
    this.setData({ popoverVisible: true, popoverResult: '页面回写 visible=true' });
  },
  onPopoverVisibleChange: function onPopoverVisibleChange(event) {
    var detail = event && event.detail ? event.detail : {};
    this.setData({ popoverVisible: !!detail.visible, popoverResult: 'visible-change：' + !!detail.visible + '，页面已回写' });
  },
  openActionSheet: function openActionSheet() {
    this.setData({ actionSheetVisible: true, actionSheetResult: '页面回写 visible=true' });
  },
  closeActionSheet: function closeActionSheet() {
    this.setData({ actionSheetVisible: false, actionSheetResult: '页面回写 visible=false' });
  },
  onActionSheetVisibleChange: function onActionSheetVisibleChange(event) {
    this.setData({ actionSheetVisible: !!event.detail.visible, actionSheetResult: 'visible-change：visible=' + !!event.detail.visible });
  },
  onActionSheetClose: function onActionSheetClose(event) {
    this.setData({ actionSheetResult: 'close：trigger=' + event.detail.trigger });
  },
  onActionSheetSelected: function onActionSheetSelected(event) {
    this.setData({ actionSheetResult: 'selected：index=' + event.detail.index + ' · 由页面继续业务处理' });
  },
  onActionSheetCancel: function onActionSheetCancel() {
    this.setData({ actionSheetResult: 'cancel：面板保持打开，由页面决定是否关闭' });
  },
  onDropdownChange: function onDropdownChange(event) {
    this.setData({
      dropdownValue: event.detail.value,
      dropdownResult: 'change：' + JSON.stringify(event.detail.value) + ' · source=' + event.detail.source + '；页面已回写 value',
    });
  },
  onDropdownOpen: function onDropdownOpen(event) {
    this.setData({ dropdownResult: 'open：index=' + event.detail.index + ' · source=' + event.detail.source });
  },
  onDropdownClose: function onDropdownClose(event) {
    this.setData({ dropdownResult: 'close：index=' + event.detail.index + ' · source=' + event.detail.source });
  },
  onDropdownConfirm: function onDropdownConfirm(event) {
    this.setData({ dropdownResult: 'confirm：' + JSON.stringify(event.detail.value) + '；随后由组件关闭菜单' });
  },
  onDropdownReset: function onDropdownReset(event) {
    this.setData({ dropdownResult: 'change → reset：' + JSON.stringify(event.detail.value) });
  },
  onDropdownContent: function onDropdownContent() {
    this.setData({ dropdownResult: 'default Slot：页面回调已触发；DropdownMenu 不伪造筛选成功' });
  },
  applyDropdown: function applyDropdown() {
    this.setData({ dropdownResult: 'footer Slot：页面决定后续业务，当前 value=' + JSON.stringify(this.data.dropdownValue) });
  },
  openOverlay: function openOverlay() {
    this.setData({ overlayVisible: true });
  },
  onOverlayClick: function onOverlayClick(event) {
    this.setData({ overlayVisible: !!event.detail.visible });
  },
  completePullRefresh: function completePullRefresh() {
    this.setData({ pullRefreshValue: false, pullRefreshStatus: '父级已回写 value=false；刷新轨道收起不代表业务成功' });
  },
  togglePullRefreshDisabled: function togglePullRefreshDisabled() {
    this.setData({ pullRefreshDisabled: !this.data.pullRefreshDisabled, pullRefreshStatus: '页面回写 disabled=' + !this.data.pullRefreshDisabled });
  },
  onPullRefreshDragStart: function onPullRefreshDragStart(event) {
    this.setData({ pullRefreshStatus: 'dragstart：scrollTop=' + event.detail.scrollTop });
  },
  onPullRefreshDragging: function onPullRefreshDragging(event) {
    this.setData({ pullRefreshStatus: 'dragging：' + Math.round(event.detail.distance) + 'px · ' + event.detail.status });
  },
  onPullRefreshDragEnd: function onPullRefreshDragEnd(event) {
    this.setData({ pullRefreshStatus: 'dragend：refresh=' + event.detail.refresh });
  },
  onPullRefreshChange: function onPullRefreshChange(event) {
    this.setData({ pullRefreshValue: !!event.detail.value, pullRefreshStatus: 'change：value=' + event.detail.value + ' · source=' + event.detail.source });
  },
  onPullRefreshRequest: function onPullRefreshRequest(event) {
    this.setData({ pullRefreshStatus: 'refresh：source=' + event.detail.source + '；等待真实业务完成后由父级回写 value=false' });
  },
  onPullRefreshTimeout: function onPullRefreshTimeout(event) {
    this.setData({ pullRefreshValue: false, pullRefreshStatus: 'timeout：' + event.detail.timeout + 'ms；已请求收起，不表示业务成功' });
  },
  scrollVirtualListTop: function scrollVirtualListTop() {
    var component = this.selectComponent('#deliveryVirtualList');
    if (component) component.scrollToTop(true);
  },
  scrollVirtualListCenter: function scrollVirtualListCenter() {
    var component = this.selectComponent('#deliveryVirtualList');
    if (component) component.scrollToIndex(64, { align: 'center', source: 'example-button' });
  },
  scrollVirtualListFirstKey: function scrollVirtualListFirstKey() {
    var component = this.selectComponent('#deliveryVirtualList');
    if (component) component.scrollToKey(0, 'start', true);
  },
  clearVirtualListSelection: function clearVirtualListSelection() {
    var component = this.selectComponent('#deliveryVirtualList');
    if (component) component.clearSelection('example-button');
  },
  resetVirtualListSelection: function resetVirtualListSelection() {
    var component = this.selectComponent('#deliveryVirtualList');
    if (component) component.reset('example-button');
  },
  toggleVirtualListMultiple: function toggleVirtualListMultiple() {
    var multiple = !this.data.virtualListMultiple;
    var current = this.data.virtualListValue;
    var value = multiple ? (Array.isArray(current) ? current : (current === null || current === undefined ? [] : [current])) : (Array.isArray(current) ? (current[0] === undefined ? null : current[0]) : current);
    this.setData({ virtualListMultiple: multiple, virtualListValue: value, virtualListStatus: '页面回写 multiple=' + multiple + ' · value=' + JSON.stringify(value) });
  },
  toggleVirtualListLoading: function toggleVirtualListLoading() {
    this.setData({ virtualListLoading: !this.data.virtualListLoading, virtualListStatus: '页面回写 loading=' + !this.data.virtualListLoading });
  },
  toggleVirtualListError: function toggleVirtualListError() {
    this.setData({ virtualListError: !this.data.virtualListError, virtualListStatus: '页面回写 error=' + !this.data.virtualListError });
  },
  toggleVirtualListEmpty: function toggleVirtualListEmpty() {
    var empty = this.data.virtualListItems.length > 0;
    this.setData({ virtualListItems: empty ? [] : buildVirtualListItems(), virtualListStatus: empty ? 'items=[]：显示消费者 empty slot' : '恢复 120 条真实数据' });
  },
  onVirtualListItemClick: function onVirtualListItemClick(event) {
    this.setData({ virtualListStatus: 'item-click：index=' + event.detail.index + ' · key=' + event.detail.key });
  },
  onVirtualListInput: function onVirtualListInput(event) {
    this.setData({ virtualListValue: event.detail.value, virtualListStatus: 'input：' + JSON.stringify(event.detail.previousValue) + ' → ' + JSON.stringify(event.detail.value) });
  },
  onVirtualListChange: function onVirtualListChange(event) {
    this.setData({ virtualListValue: event.detail.value, virtualListStatus: 'change：selected=' + event.detail.selected + ' · controlled=' + event.detail.controlled });
  },
  onVirtualListSelectionChange: function onVirtualListSelectionChange(event) {
    this.setData({ virtualListStatus: 'selection-change：value=' + JSON.stringify(event.detail.value) + ' · source=' + event.detail.source });
  },
  onVirtualListScroll: function onVirtualListScroll(event) {
    this.setData({ virtualListStatus: 'scroll：top=' + Math.round(event.detail.scrollTop) + ' · visible=' + event.detail.visibleStart + '-' + event.detail.visibleEnd + ' · render=' + event.detail.renderStart + '-' + event.detail.renderEnd });
  },
  onVirtualListUpper: function onVirtualListUpper(event) {
    this.setData({ virtualListStatus: 'scrolltoupper / reach-start：top=' + Math.round(event.detail.scrollTop) });
  },
  onVirtualListLower: function onVirtualListLower(event) {
    this.setData({ virtualListStatus: 'scrolltolower / reach-end：top=' + Math.round(event.detail.scrollTop) });
  },
  onVirtualListScrollTo: function onVirtualListScrollTo(event) {
    this.setData({ virtualListStatus: 'scroll-to：top=' + Math.round(event.detail.scrollTop) + ' · source=' + event.detail.source });
  },
  onVirtualListRetry: function onVirtualListRetry() {
    this.setData({ virtualListStatus: 'retry：等待消费者真实重新加载，不自动清除 error' });
  },
  onVirtualListReset: function onVirtualListReset(event) {
    this.setData({ virtualListStatus: 'reset：value=' + JSON.stringify(event.detail.value) });
  },
  openSheet: function openSheet() {
    var sheet = this.selectComponent('#deliverySheet');
    if (sheet) sheet.open('programmatic');
  },
  closeSheet: function closeSheet() {
    var sheet = this.selectComponent('#deliverySheet');
    if (sheet) sheet.close('programmatic');
  },
  onSheetInput: function onSheetInput(event) {
    this.setData({ sheetVisible: !!event.detail.visible, sheetResult: 'input：' + event.detail.source + ' · controlled=' + event.detail.controlled });
  },
  onSheetChange: function onSheetChange(event) {
    this.setData({ sheetVisible: !!event.detail.visible, sheetResult: 'change：' + event.detail.source });
  },
  onSheetOpen: function onSheetOpen(event) {
    this.setData({ sheetResult: 'open：' + event.detail.source });
  },
  onSheetClose: function onSheetClose(event) {
    this.setData({ sheetResult: 'close：' + event.detail.source });
  },
  onSheetOverlayClick: function onSheetOverlayClick(event) {
    this.setData({ sheetResult: 'overlay-click：close=' + event.detail.close });
  },
  onSheetRetry: function onSheetRetry(event) {
    this.setData({ sheetResult: 'retry：' + event.detail.source + '；等待业务重新请求，不伪造恢复' });
  },
  onSheetDragStart: function onSheetDragStart() {
    this.setData({ sheetResult: 'drag-start：从 handle 开始' });
  },
  onSheetDragEnd: function onSheetDragEnd(event) {
    this.setData({ sheetResult: 'drag-end：offset=' + event.detail.offset + 'rpx · close=' + event.detail.close });
  },
  onSheetScroll: function onSheetScroll(event) {
    this.setData({ sheetResult: 'scroll：scrollTop=' + Math.round(event.detail.scrollTop || 0) });
  },
  onSheetAfterOpen: function onSheetAfterOpen(event) {
    this.setData({ sheetResult: 'after-open：' + event.detail.source });
  },
  onSheetAfterClose: function onSheetAfterClose(event) {
    this.setData({ sheetResult: 'after-close：' + event.detail.source });
  },
  onSheetFooterPrimary: function onSheetFooterPrimary() {
    this.setData({ sheetResult: 'footer slot：消费者继续回调；未伪造保存成功或自动关闭' });
  },
  toggleSheetLoading: function toggleSheetLoading() {
    this.setData({ sheetLoading: !this.data.sheetLoading, sheetResult: '页面回写 loading=' + !this.data.sheetLoading });
  },
  toggleSheetError: function toggleSheetError() {
    this.setData({ sheetError: !this.data.sheetError, sheetResult: '页面回写 error=' + !this.data.sheetError });
  },
  toggleSheetEmpty: function toggleSheetEmpty() {
    this.setData({ sheetEmpty: !this.data.sheetEmpty, sheetResult: '页面回写 empty=' + !this.data.sheetEmpty });
  },
  onGlobalThemeChange: function onGlobalThemeChange(event) {
    this.setData({ theme: event.detail.theme });
  },
  goBack: function goBack() {
    wx.navigateBack();
  },
});
