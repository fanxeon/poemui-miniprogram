# 官网预览信息层级

PoemUI 官网每个组件或基础文档页面只设置一个页面级标题。Header 只保留该标题、一句用户用途短摘要与必要的 Tabs，不显示重复的分类 Kicker；常驻左侧目录是站点级组件导航，不属于 PreviewDevice 或组件预览结构。元素选择模式中的上下文 Inspector 是概览内按需浮层，不是第三列，也不复制完整属性。

Topbar 的全站入口使用“月下成行”品牌标记：偏移双弧月牙是诗句停顿，三行是内容的节奏和留白；月牙与首行间保留明确呼吸空间。旁侧固定显示 `PoemUI` 与 `月下成行 · 原生小程序组件库`。它是站点品牌，不是组件目录中的 Icon 资源，也不增加第二个页面标题或装饰性 Surface。

左侧组件目录按真实使用任务分为九个分区：`开始与规范 / 基础组件 / 布局 / 导航 / 表单组件 / 数据展示 / 反馈 / 浮层 / 高级`。分类由 metadata 单一生成源维护，每个路由只属于一组；英文主名后的中文辅助名使用普通灰色文本，不得误用 Tag 或 Badge，分区项数才继续使用共享 PUI Badge；不暴露 done、beta 或成熟度。表单组件是唯一带可见子分区的高密度任务组，固定为结构与校验、文本与搜索、选择与数值；日期、时间和附件选择也归入选择与数值。目录编号按完整 metadata 顺序生成，筛选不重新编号，序号不写入组件名、路由、搜索语料或小程序 API。目录内 PUI Input 继续做原位过滤。用户按 `Ctrl/⌘ + K` 可打开全局快速搜索 Dialog，通过中文名、英文名或分类搜索，使用方向键、Enter、Esc 与 Tab 完成全键盘导航；结果行、关闭和输入全部组合 PUI Button/Icon/Input，不显示 done、beta 或成熟度。

## 目录分类合同

目录以 `taxonomyId` 为唯一归属依据，不能再根据源码目录或 H5 路由名临时分组。一个规范公开入口只能出现一次，不创建第二套“适配组件”分区。当前 H5 目录共 80 条规范入口，74 个为可安装的 npm 组件；其余为快速开始与设计规范文档。小程序 Search 不包含 H5 快速开始入口，因此是 74 个组件加 5 个规范页，共 79 条候选。旧 Chart 研究入口已由 AreaChart、BarChart、Waffle 三个真实组件替代。

| 分区 | 归属原则 | 代表入口 |
| --- | --- | --- |
| 开始与规范 | 完成安装、全局配置、主题、色彩、工具类与间距规范 | Getting Started、ConfigProvider、Theme Tokens、Color、Style Utilities、Spacing |
| 基础组件 | 最小、可组合的通用视觉与操作原语 | Button、Divider、Icon、Typography |
| 布局 | 负责尺寸、滚动、方向或固定定位的结构能力 | Direction、AspectRatio、Grid、ScrollArea、Sticky |
| 导航 | 改变页面、层级、步骤或当前位置的入口 | Navbar、NavigationMenu、Tabs、Breadcrumb、Tabbar、Steps、Indexes、Sidebar |
| 表单组件 | 构建、校验、填写、选择与提交表单数据；组内按三类用户任务排列 | 结构与校验：Form、Field、Label；文本与搜索：Input、InputOTP、Textarea、Search；选择与数值：Checkbox、Radio、Switch、Select、Picker、Combobox、Slider、Stepper、Rate、Calendar、DateTimePicker、Attachment |
| 数据展示 | 组织、呈现或浏览已有内容 | Cell、Card、List、Avatar、Badge、Image、Table、Swiper、Collapse |
| 反馈 | 解释状态、结果、进度或短暂消息 | Alert、Loading、Toast、Dialog、Progress、Skeleton、Empty、Result |
| 浮层 | 在当前页面上下文临时打开的菜单、面板与遮罩 | Popup、Popover、Sheet、ActionSheet、DropdownMenu、Overlay |
| 高级 | 性能、刷新、状态反馈、水印与数据图形 | BarChart、DynamicMessage、PullRefresh、TopLoading、VirtualList、Waffle、Watermark |

分类重构会有意改变反馈序号的完整目录基线；筛选后的序号仍不变。不能用 CSS 视觉隐藏、搜索别名或另建“其他”分区绕过该表。

“开始与规范”按安装与规范阅读顺序排列；基础组件按可操作原语与稳定顺序排列；表单组件按三类任务及其内部的自然使用顺序排列，选择、日期、时间和附件入口统一进入选择与数值；其余分区按用户可见英文组件名稳定排序，不让数据来源的拼接先后决定位置。

390px 下，左侧目录在站点头部下方提供有界的真实纵向浏览区；分区与条目完整可达，不建立横向分区带，也不影响 PreviewDevice 的唯一内部滚动 viewport。页面级横向滚动仍必须为零。

页面容器按职责保留：

- 设备边界用于验证 375–430px 小程序宽度，可以保留单层边框。
- 组件自身的弹层、输入、卡片和状态表面属于真实组件能力，应继续展示其边界。
- 标准组件页统一复用 PUI Tabs，固定为 `概览 / API / 属性` 三个互斥视图；`prop` 仅作为内部状态名存在。
- Tabs 独占 Header 中的一级分类行。概览在内容区顶部使用一条透明工具栏：常规/选择元素的模式切换在左，机型、刷新、重置和复制组成一组居右对齐，复制当前组件效果代码固定在最右；工具栏没有背景、边框、阴影或毛玻璃，不与 Tabs 并排争夺层级。工具栏顶部使用 8px PUI content gap 内距，并纳入自身语义高度，保证控件不会紧贴上方内容。复制复用 PROP 的 WXML 生成器，只输出非默认 Props，并用注释说明全局视觉与临时运行态边界。
- Tabs 行使用固定语义高度。桌面 Header 使用标题说明与固定导航列顶对齐的 Grid，不能再由两侧内容高度做垂直居中。概览工具栏属于视图内容，不承担 Tabs 占位；API/属性可隐藏它。Tabs DOM 跨视图稳定复用，切换只更新状态与内容；概览、API、属性三态以及不同组件页的 Tabs 外框几何和视口坐标必须一致，不得靠滚动补偿修正结构问题。三个标签固定为等宽 Grid，选中块只用 transform 沿固定轨道移动，不过渡 left/width、不读取 DOM 尺寸。390px 下透明工具栏允许分成两行，右侧工具组仍保持右对齐。
- 用户用途短摘要由 metadata 单独维护，工程说明移入 API/属性；不对摘要使用 text-cut、省略号或隐藏溢出。Tabs 的当前项使用深浅色均清晰的高对比选中态，非选中项不提供视觉 Hover，键盘焦点与选中态独立。
- 左侧搜索与概览机型选择分别复用 PUI Input / Select helper。机型、完整属性与上下文属性共用同一个 PUI Select：可见 Trigger/Option/Menu 使用 PUI Button、Icon 和主题 Surface，原生 select 仅作为隐藏且不进入无障碍树的值/事件桥接。菜单展开态必须与 light/dark `color-scheme` 同步，用户界面不展示 `done`、成熟度等开发状态。
- 概览只保留设备预览和真实组件路径，不再在预览下方追加 API、WXML 或工程诊断。
- 概览透明工具栏右侧显示机型选择，并同时提供刷新与重置两个 PUI 图标按钮。刷新保留当前 Props，只重建演示运行态并回到预览起点；重置为组件默认 Props 与默认运行态，并清除失效的元素选择。
- 概览预览提供常规模式与元素选择模式。常规模式保留真实交互；元素选择模式拦截设备内点击与 Enter/Space，只选中和高亮元素，不触发业务操作。设备空白区保持默认光标，可选择语义元素使用 `pointer`，不使用代表像素拾取的十字光标。
- 常规模式左侧常驻透明、可滚动的组件用法正文，按“组件引用”小标题与 `page.json usingComponents` 代码块、“基础用法”小标题与当前 WXML 代码块自然展示；两段不使用 Tabs，也不形成独立滚动卡片。总 Header 和常驻默认值说明删除，正文根不建立 Surface、边界、圆角、阴影或 padding，并承担唯一纵向滚动。两个标题行分别通过共享 CodeBlock helper 组合 PUI Copy IconButton，复制当前段的引用 JSON 或基础 WXML，并以 Check/ErrorCircle、可访问名称和 `aria-live` 反馈真实结果。两区与工具栏复制复用同一 `makeUsageCode` 生成源并过滤默认 Props；工具栏复制仍可补充环境边界。代码块保留 code Surface、可读等宽字体、行号、层级缩进、语法颜色、键盘焦点与必要横向滚动。基础开始标签以 `80` 字符软上限、每行最多 3 个属性合并。桌面把 PreviewDevice 推到 Stage 右侧 gutter，正文从左侧 gutter 撑满至设备前并保留 14px 间距，两者同为 622px 高；窄于 `1180px` 时正文落到左下满宽 240px 有界区域。切换选择元素后设备恢复居中，由双侧 Inspector 接管该辅助层。模式切换保留同一个设备 DOM 和组件运行态，低动效压缩为 1ms。
- 窄于 `1180px` 时，常规模式代码正文必须退出绝对定位并进入 PreviewDevice 下方正常文档流；不得覆盖 PreviewDevice 或浮层，也不得拦截设备内点击、滚轮和拖动。`240px` 是代码正文的独立高度上限，不得改变设备固定 `622px` 高度。
- 元素选择模式在设备左右两侧同时浮出上下文 Inspector：左卡片只放 `text/json/nullable-number` 等可自由输入的内容值，右卡片放 Switch、Select、Slider 等其余设置；两侧只展示该元素可由父组件公开 Props 控制的字段，并复用 PROP 的 PUI 控件与回写路径。两张卡片消费同一宽高 Token，始终等高等宽并独立滚动；窄于 `1180px` 时改为设备底部等宽双栏覆盖，不能挤动或撑大 PreviewDevice。首次选中从设备两侧展开、关闭反向收回，切换元素轻量过渡，低动效压缩为 `1ms`，连续输入不得重复播放入场。组合子组件无公开映射时只显示真实空状态。
- API Reference 全部进入 API；参数表固定展示参数、类型、演示初值、可选值、说明五列，正文至少使用 14px 的 PUI body-medium Token。可选值紧跟演示初值，枚举与布尔值用逗号分隔，范围显示边界与步长。原常驻 Inspector 的元信息、完整 Props、WXML 与兼容说明全部进入 PROP，不保留右侧副本。
- API 不显示概览工具栏；PROP 只在 Props 标题区提供同一个重置且不显示机型选择。概览与 PROP 的重置读取同一默认值源，不改变深浅色、边框、阴影、毛玻璃、大圆角、渐变背景或机型。
- PROP 的各任务保留为扁平区段，Props 字段使用统一 PUI Token，不恢复“外层面板 + 字段卡片”的双层容器。
- PROP 的文本、枚举、布尔、范围与 JSON 控件分别复用 PUI Input、Select、Switch、Slider、Textarea helper；字段卡只承担标签与排列，不能再维护一套私有原生表单皮肤。输入回写后保持焦点，非法 JSON/数值只反馈错误、不覆盖上次有效 Props。
- WXML 只展示相对默认值发生变化的 Props，避免把组件默认合同误写成调用方必须配置的样板代码。
- 文档页直接进入规范正文，筛选和用法以内联区段承接；标题、说明、路径和状态不在正文中重复一次。

装饰性信息不应重新出现：假状态栏、组件同名手机标题、Interactive Preview 容器头、重复的视觉开关摘要，以及不承载新决策的状态汇总。

深浅色、边框、阴影、毛玻璃、大圆角和渐变背景属于同一组站点级用户偏好。Topbar 的详细设置只展示一个“外观”PUI Palette IconButton，六项 PUI Switch 收纳在同一个锚定的非模态菜单中，避免与主导航争抢宽度；其左侧保留“一键果味”PUI Switch 作为复合捷径。果味开启等价于阴影/毛玻璃/大圆角开、边框/渐变关，关闭恢复标准组合，theme 始终独立；checked 从五项实时推导，用户单改任一项后自动关闭，不单独持久化。菜单支持入口展开语义、首项聚焦、Esc/点击外部关闭、焦点恢复、低动效和 390px 边界。六项继续复用 PUI Switch 的 H5 镜像和 `role="switch"` 语义。官网以 `poemui-preview-preferences` 对象持久化六项，并兼容迁移旧主题键；非法值分别回退为 `theme=light / border=off / shadow=on / frost=off / radius=large / gradient=off`。边框总开关默认关闭，只从 PreviewDevice 的内部 viewport 向真实 PUI 组件树传递：关闭后组件中性 Surface 与分割线透明，PreviewDevice 外框、API、属性、导航、工具栏及文档面板保持原边界；焦点、错误、选中、危险操作边界仍然可见，盒模型不变。显式 `pui-border-solid` 仍只负责线型。渐变背景只改变页面与 PreviewDevice 的单一背景画布，不增加组件 Surface，也不得改变间距、尺寸、圆角或定位。

交互预览统一使用 `PreviewDevice` 设备面板，并由概览 Stage 直接挂载，不再增加可见的 canvas 外壳。桌面按机型选择使用 375/393/430px 宽度、高度固定为 622px；窄屏只压缩可用宽度。所有组件预览根必须填满这块完整设备内容区：普通组件填满 shadow-safe 安全内距后的空间，浮层和屏幕附着组件填满 edge-to-edge viewport。设备底与页面共享中性色主题，标准浅色为 `#fafafa`、标准深色为 `#09090b`，不得用组件私有靛蓝主题覆盖。面板始终保留主题底色、边框、圆角和裁切，Dialog 等浮层不得绕过统一外框。每个标准组件概览必须复用唯一 `.preview-device__viewport[data-preview-scroll-contract="component-preview"]`；组件状态、事件日志和长内容只能在这里滚动，不得改变外框尺寸、改回页面级滚动或新建路由私有滚动根。滚动条仅在真实滚动期间显示，空闲时隐藏，状态重渲染继续恢复原滚动位置。文档页和 Icon 资源库不属于手机组件预览，继续使用各自正文或资源库布局；BarChart、Waffle 不适用该例外。

## 全量设备预览回归

2026-07-17 按 npm 组件目录逐页检查 83 个组件：

- 所有标准组件包括 Dialog 使用同一个 `PreviewDevice`，初始态与交互后的外框高度均固定为 622px，并始终存在可区分的主题底色。
- `PreviewDevice` 内只有真实组件、遮罩和浮层可以建立不透明 Surface；stage/canvas/host/frame/viewport 等纯布局根必须透明，不能再套第二层底色、边框、阴影或毛玻璃。
- 81 个设备预览页的内容 `scrollWidth` 均不大于 `clientWidth`。
- 71 个存在安全按钮操作的页面完成一次真实点击与重渲染检查；静态或只含输入交互的页面验证初始尺寸。
- ConfigProvider 与 Icon 分别使用专用文档布局和图标库布局，不套设备视口。
- 回归中发现并修复 Badge 7px 固有宽度溢出、NavigationMenu 遮罩 14px 负 inset 溢出。

机器可读结果保存在本轮审计目录的 `all-components-preview-audit.json`。

### 当前外观设置统一补充（2026-07-25）

当前官网真实菜单承载七项外观 Switch：边框、阴影、毛玻璃、大圆角、渐变、等距和深色；渐变预设由共享 Select 承载。`effectsEnabled` 只保留为内部 Store/API 与预设字段，不进入菜单；旧 H5 偏好中的 `false` 会迁移为 `true` 并保留 shadow/frost/radius 单项，避免用户面对不可达的暂停状态。果味 checked 由预设字段实时推导，theme 与 equalSpacing 独立。小程序页面根通过 `visualConfig` Store 复用同一有效值语义，组件是否有资格消费某个开关以 [外观资格矩阵](./APPEARANCE_CONTRACT_MATRIX.md) 为准。
