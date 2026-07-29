# PoemUI UI 设计与实现合同

本文档是 PoemUI 全部组件、官网预览、示例和后续 Agent 的全局 UI 合同。具体数值以 `common/style/theme.wxss` 为事实源；本文负责说明语义关系。不能为了局部“看起来差不多”绕开 Token，也不能把某个组件的特殊结构机械复制到所有组件。

本轮已确认的跨组件展示、外观、H5 镜像与产物规则索引见 [组件共用规则索引](./COMPONENT_RULES_INDEX.md)。外观开关的逐组件资格见 [PoemUI 外观资格矩阵](./APPEARANCE_CONTRACT_MATRIX.md)。索引用于追溯和同步，不替代本合同、组件专属合同、真实源码或 Feedback Ledger。

## 0. 全局动效合同

- 所有交互进入、离开、状态切换和位移动效默认 `500ms`，调用方可在 `0–1000ms` 内调整，公开时长上限 `1000ms`。无效数值回退到 `500ms`，超出范围必须在运行时收敛，不能只依赖属性面板限制。
- `--pui-duration-fast` 与 `--pui-duration-normal` 当前都以 `500ms` 为统一基线；组件公开的 `duration` / `motionDuration` 默认值、H5 镜像 fallback、WXML/WXSS 和 API 文档必须同源。
- DynamicMessage 使用中性反色黑底而不是 `primary` Surface，浅色模式也保持独立高对比浮层。状态色装饰固定为小程序 `6rpx` / H5 `3px` 的顶部与右侧 L 形轨道，内部只能有一束对角渐变光束；它在 `expanding` 开始时以独立 transient class 连续移动一次 `1500ms`，允许跨入 `visible` 但计时结束必须清零。不得用整段上/右边框依次换色冒充流动。这是不可配置、不阻塞交互的单组件装饰例外，不改变全局公开交互动效 `1000ms` 上限。流光与状态 Icon 必须共用语义色：loading 中性灰、info 信息蓝、success 成功绿、warning 警告橙、error 危险红，禁止固定为单一颜色或用状态色整块染色 Surface。装饰层只允许改变自身 opacity/background-position，不能改写根 Surface 的背景、毛玻璃和阴影；不得恢复满高竖向 accent、形成常驻彩边或循环呼吸。装饰层必须 `aria-hidden`、不参与点击和布局，低动效完全取消。组件私有 `shadow/frostedGlass` 使用 `Boolean|null`：`null` 继承 ConfigProvider，`true/false` 只覆盖当前通知而不写入全局视觉 Store。
- `reduceMotion=true` 或系统启用低动效时，低动效统一压缩为 `1ms`；循环动画必须停止或进入稳定完成态，不能只缩短单次时长后继续闪烁。
- 小程序 WXSS 不得使用 `*`、`> *` 或 `*::before/after` 通配选择器。父组件只能通过自身已声明的时长 Token 控制自身动效；Slot 和 PUI 子组件各自处理低动效，布局需要明确的内部容器，不能穿透消费者内容。
- 小程序组件 WXSS 只能携带组件自身可用的 class 规则，禁止导入含 `page`、标签、ID 或属性选择器的全局样式。`common/style/theme.wxss` 含 `page` 默认 Token，必须仅经消费者 `app.wxss` 的 `poemui-miniprogram/theme/utilities.wxss` 或 `theme/theme.wxss` 入口加载；组件从 `pui-config-provider` 与全局级联继承 Token。H5 继续使用同名 Token 镜像，不复制 WXSS 导入链。
- 退场节点保留到真实离场完成；只过渡 `opacity`、`transform`、颜色等可插值属性，禁止对 `height:auto` 做无效 transition，也禁止用 `display:none` 制造瞬移。
- 功能计时不属于动效时长：Toast 的停留或自动关闭时间、Loading 延迟、Swiper 自动轮播间隔、CountDown 刷新周期、Watermark 位移间隔继续使用各自业务合同，不得被机械改成 `500ms` 或限制为 `1000ms`。
- 小程序组件独立页是组件的真实消费者，不是第二套实现：必须复用共享 Navbar、`use-global-config`、唯一 ScrollArea 与 PUI 组件本体；页面只能回写组件公开的父级状态或执行真实页面导航。反馈类页面不得把 Alert/NoticeBar 的关闭、Empty action、Loading/Skeleton 的显隐、Progress 的 100% 或 Toast 自动关闭描述成业务成功、请求完成或组件私有事件。
- 小程序组件详情页的反馈固定按 `none / inline / Toast / DynamicMessage` 分级：组件视觉已经明确的展开、关闭、选中、开关和当前值不增加重复反馈；字段错误、上传失败和持续限制留在控件附近；单次轻反馈使用 PUI Toast；只有重要恢复、异步任务、同 key 持续更新及需要 Action 的错误使用 DynamicMessage。需要 DynamicMessage 时必须复用 ScrollArea 外的 `component-page-feedback` 和 `createComponentPage` 真实返回值，不得逐页复制状态机、对高频事件排队或保留第二个同义 `aria-live`。完整合同见 `docs/MINIPROGRAM_PAGE_FEEDBACK.md`。
- 小程序组件独立页中同时出现两个并列操作时，必须使用共享 `component-page__row--actions` 两列 Grid，并让两个 PUI Button 以 `block` 填满各自轨道；两轨之间必须显式消费 `--pui-content-gap`（默认 `16rpx`），禁止按钮贴合。通用 `component-page__row` 继续承载 Switch、Label、Icon 与文案等内容组合，禁止为实现双按钮等分而把所有内容行改成 Grid。滚动所有者页面与 Navigation 页面双操作工具栏遵守同一两列与间距语义。
- Style Utilities 的预览基础设施不是 utility 消费目标。全部发布类必须由同一生成 Schema 声明 `previewKind / previewTarget / previewSafety / previewTheme / previewScaffold`，并同步生成小程序目录、H5 数据与 scoped utility CSS；页面、Navbar、Tabs、ScrollArea、目录和当前效果容器不得挂载被预览的 class。小程序固定使用 `120rpx`、H5 固定使用 `64px` 的单一当前效果预览，选中类只命中适格语义目标；右侧恢复使用 `default / text / small / circle / icon-only` 的 PUI Refresh IconButton，只清空当前分类并恢复默认预览，不影响其他分类。恢复是低存在感的次要回退动作，不使用 primary 实底或常驻文案。切换小程序分类 Tab 时，页面必须在替换目录数据的同一次状态更新中把唯一 ScrollArea 的受控 `scrollTop` 写为 `0`，复用原生平滑定位显示新分类首项；不得重建 ScrollArea、创建第二滚动区或扩张 Tabs API。禁止恢复 baseline/result 双栏或比较箭头。viewport、fixed、hidden、safe-area 等风险类必须在有界沙箱中裁切或保留 trace，不能改变页面几何。H5 仅有 data 属性或 class 字符串、没有真实计算样式变化时不算同步完成；H5 当前的独立五类示例区不伪造小程序单目录回顶。
- Style Utilities 的直接色相只能来自 `theme.wxss` 的精选强调色 Token；每个色相固定提供文字/边框、实色背景和柔和背景三层取值，小程序与 H5 使用同一生成源。实色背景不自动决定前景色，普通正文 Surface 优先使用柔和背景；red/orange/amber/emerald/teal/blue/violet/pink 只表达装饰与轻量强调，不能替代 success/warning/danger/info 业务语义。

## 1. 组件复用

- 页面、预览和复合组件优先组合已有 PUI Button、Icon、Cell、Tag、Loading、Empty、Switch 等组件。
- 除基础组件自身的底层实现外，不使用原生控件、字符图标或重复手写已有能力。
- 新组件必须可调用、可复用、可组合；演示代码也必须展示真实组合路径。
- Slot 中的子组件保留自己的尺寸与 padding，父组件只管理 Slot 容器的排列和 gap，不穿透覆盖子组件内部布局。
- H5 预览中的纯图标操作必须统一调用 `iconButtonSample`，由 PUI Button + PUI Icon 镜像生成；禁止在各组件预览中重新手写原生 `button`。小程序与 H5 的 `iconOnly` 都必须由 Button 组件把原生根、Icon 区域和 PUI Icon 收敛为同一尺寸的居中轨道：小程序清除基线行高，H5 使用等尺寸 Flex 居中；两端均为 `gap=0`。空文字节点必须退出布局，不得产生额外 gap、白色默认根或让图标偏心。
- H5 需要镜像 PUI Button 默认 Slot 时统一使用 `buttonSample.defaultSlot`，由共享 Button 根节点承载 Icon、Badge、Tag 与内容结构；语义角色和选择态通过共享 `role / ariaSelected / ariaChecked / ariaExpanded / ariaHaspopup` 参数输出。Grid、Tabs、Tabbar、Steps、ActionSheet、DropdownMenu、Breadcrumb 等原生已使用 PUI Button 的复合入口不得绕过该入口手写交互根；Badge 必须继续调用 `badgeSample`，不能在 Button Slot 内退回私有徽标。
- `buttonSample` 默认必须进入完整 `pui-button-preview` 镜像合同；`base/outline/text/ghost/transparent` 的计算样式、禁用、ARIA 与阴影资格不得因调用点漏传私有开关而漂移。`variant=transparent` 是保留常规 Button 几何的无底色、无边界、无外投影视觉变体；`surface=transparent` 仍仅用于复合容器边界，并额外移除 Button 自身圆角。只有已审计的组件自身交互根才可明确传入 `previewContract:false`。
- Button 的弱化默认操作统一是 `theme=default + variant=base`：两端都消费 muted 背景 Token、保留中性边界且没有外投影或毛玻璃；不得在页面或复合组件中另画一套“灰色按钮”。`primary/danger + base` 才拥有实色独立操作 Surface。
- 官网自身的组件目录、复制、筛选和资源选择同样属于产品操作，必须调用共享 PUI Button/Icon/Badge helper；只添加 `pui-*` class 或复制相似 CSS 不算复用。Icon 资源卡必须通过 `iconComponent` 读取当前图标，不得绕过 Icon 合同直接注入目录中的原始 SVG。Button 被组合为卡片等常驻 Surface 时，必须显式恢复 `surface`、`border` 和外观开关 Token，不能让 `outline/text` 变体的透明底或无阴影规则改变宿主语义。
- 官网搜索与机型选择分别调用共享 `inputControlSample`、`selectControlSample`，原生 `input/select` 仅作为 helper 内的平台控件。站点外壳不得静态手写相似输入框、字符/伪元素图标或独立 Select 皮肤；搜索语料只包含组件名和分类，不包含 `done`、成熟度等工程状态。
- `selectControlSample` 的可见层固定由 PUI Button Trigger、PUI Button Option、PUI Icon Chevron/Check 和 Token 化 Menu 组成；原生 select 必须 `pui-sr-only + aria-hidden + tabindex=-1`，只承担值、`data-prop` 与 `input/change` 桥接。机型、完整属性和上下文属性不得各自维护菜单皮肤；键盘需覆盖 Enter/Space、方向键、Home/End、Esc、Tab 关闭和焦点恢复。
- 主题合同覆盖关闭态与展开态。全站 Menu/Dialog/Popover/Dropdown/Combobox/NavigationMenu/Search Dialog/外观菜单统一使用 `--surface* / --text* / --border*`，App Shell 在 light/dark 下分别声明 `color-scheme`，原生 input/select/textarea/option 继承该值并提供 Token fallback。不得用硬编码白底、只验证根 `data-theme`，或把系统原生下拉层视为 PUI 深浅色兼容。
- 左侧目录搜索和 Icon 资源搜索共用同一个 Input 组合合同：Search Icon 通过 `prefixIcon` 调用 PUI Icon，页面只负责查询语料与结果编排。实时筛选重建列表后必须恢复输入焦点与光标；Icon 页需要通过站点语义 Token 固定工具栏输入高度，不得创建未定义的间距变量或私有表单几何。
- PROP 字段同样属于官网产品界面：文本/数值使用 `inputControlSample`，枚举与 nullable boolean 使用 `selectControlSample`，boolean 使用 `switchControlSample`，范围使用 `sliderSample`，JSON 使用 `textareaControlSample`。`renderPropsPanel` 只负责字段编排和标签，不得直接拼原生 `input/select/textarea` 或覆盖 PUI 子组件几何。所有字段输入后保持焦点；非法值不得写入 Props，必须以 `aria-invalid` 和危险色边界反馈。
- Form 的字段在原生 WXML 中组合 PUI Input，H5 必须逐项调用 `inputControlSample` 并保留 name、required、invalid、输入模式、真实回写与焦点；Field/Label 的 Slot 示例也必须组合同一个 Input helper。Form、Field、Label 父级只承担标签、反馈、方向与 gap，不得手写原生输入框、嵌套 HTML label，或用全局 Surface 名单把透明布局根重新变成 Input 外的第二层面板。别名路由的事件判断统一使用 `previewIdFor(state.current)`。
- Search、Stepper、Combobox 等原生已组合 PUI Input 的复合组件，H5 输入主体必须调用 `inputControlSample`，由 helper 承接 prefix Icon、clear Button、maxlength、min/max/step、align、bordered、focus 与事件数据，组件函数内不得再次手写 `<input>`。复合结构只允许一个可见 Surface：Search/Combobox 的 Input field 可直接消费全局圆角、阴影和毛玻璃；Stepper 由外壳消费外观，嵌入式 Input field 保持透明、无 border/radius/shadow/blur。父级可按原生 WXSS 管理列宽和排列，但不得让外壳与 Input 同时形成两层面板。所有适配路由的 input/confirm/clear 分支统一使用 `previewIdFor(state.current)`。
- Input 的 `suffix="slot"` 是公开的右侧尾部操作位：可以承载后置短文本，也可以组合一个紧凑 PUI Button/IconButton。Field 内部固定为“可收缩原生 input + trailing 轨”，trailing 依次承载 Clear、Loading、suffix 与 suffix-icon 并贴齐最右边界；页面不得在 Input 下方再放一个同义保存按钮，也不得新增与 suffix 重叠的 right/action Prop。Slot 子组件保留自己的尺寸、禁用、ARIA 和点击事件，Input 只管理排列与控件内部 gap。
- Input 的 Clear 默认采用 `clearTrigger=focus`：只有非空、可交互且真实聚焦时显示；显式 `always` 只用于需要常驻清空入口的公开组件策略。H5 以 `:focus-within` 镜像，小程序以原生 focus/blur 状态镜像；两端隐藏 Clear 时不得卸载 suffix 或改变 Trailing 几何。Input Field 阴影始终读取 Provider/App Shell 的语义 Shadow Token，页面不得写死投影或用页面 class 模拟开关。
- 复合组件的原生 WXML 已组合 PUI Cell/Badge/Button/Icon/Loading 时，H5 必须沿同一组件树调用共享镜像助手；组件自身的交互根可以保留平台原生节点，禁止再套一层 PUI Button 改变事件、ARIA 或布局边界。
- H5 原生 `button/input/select/textarea` 的合法边界只有三类：共享 PUI helper 的平台根、组件自身交互根、浏览器能力桥接。`preview/index.html`、页面、演示和复合层只保留 Mount/编排，不得复制 PUI DOM。`scripts/test-preview-native-control-boundaries.js` 必须精确锁定所有合法 owner 与数量；只有核对原生 WXML 后才能更新清单，不能把新增页面控件直接列为例外。
- Cell、Radio 等组件可以保留自己的交互根，但根内的 Badge、Loading、Icon 等子组件仍必须调用 `badgeSample`、`loadingComponent`、`iconComponent` 等共享镜像；不得以“组件根特殊”为由手写私有徽标或 Spinner。
- Select 的小程序可见层固定组合 PUI Button Trigger、PUI Popup 与 PUI Button Option；系统 picker 不是 Select 的最终 UI。H5 Trigger/Option 同样调用共享 Button 镜像，浏览器原生 select 只能作为不可见事件桥接。Picker 独占滚轮、多列、草稿与确认式选择。
- Picker / DateTimePicker 必须真实消费 Popup 的三分区：标题进入 Header，滚轮进入唯一滚动 Content，取消/确认进入两列 Footer。不得向 Popup 不存在的具名 Slot 投递操作区，也不得在 Popup Surface 内再建立第二个私有面板。
- Popup Header 直接标注下方 Content 时，Header→Content 只允许一个紧凑结构间距：普通模式使用 `--pui-content-gap`，等距模式重映射为 `--pui-surface-inset`；Surface 不再叠加 `--pui-section-gap`，Content 也不能同时保留完整顶部 panel padding。无 Header 时 Content 继续使用四向 `--pui-panel-padding`。Select、Picker 的 Options/Wheel 不得再重复增加 panel padding，可见项数、行高和中心选中几何也不用于补偿结构间距。
- Table 选择列必须调用共享 `checkboxSample` 镜像 PUI Checkbox，Swiper 加载态必须调用 `loadingComponent`；禁止为父组件再画私有 Checkbox Mark 或 Spinner。Table 表头、Swiper 指示器等组件自有交互根保留自身语义，不为了静态消除原生节点机械套普通 Button。
- Checkbox/Radio 未选 Mark 属于输入控件的必要轮廓，不是可移除的 Surface 边框；小程序和 H5 都必须使用 `--pui-control-outline-color`，全局 `bordered=false` 不得将其透明化。
- 复合组件的默认 loading/error/empty 状态必须继续调用共享 `loadingComponent` / `emptySample`，不能在父组件里重新拼 Icon、标题或 Spinner。嵌入式 Empty 保留 PUI Empty 的内容、字号、间距、语义和图形组合；它本身没有内置 Action，父级若需操作必须以同级 PUI Button 或 `action` Slot 内容组合。Surface 职责仍归父状态容器：嵌入 Empty 必须透明、无边框、无阴影、无毛玻璃、无圆角，避免面板套面板；消费者提供的 custom empty Slot 不得被强行替换。
- 状态 Action 的位置必须逐组件服从原生 WXML，不得为了统一外观机械改树：Calendar、Collapse、Radio 等错误态使用 `Empty + 兄弟 Retry Button`；Dialog 不拥有请求状态，消费者在其 `content` Slot 中组合 Loading、Empty 和 Action；消费者 custom empty/error Slot 必须保持消费者组合。Upload 只管理文件选择、文件列表与单文件状态，空列表就是添加入口，整体 Loading/Empty/Error 由消费者在外部组合。父状态区只排列子组件，不得穿透重写 PUI Button 的尺寸、padding 或圆角。
- Upload 单文件失败态必须收敛为中性文件 Surface 内的一处失败原因和右侧可见 Retry：不重复叠加失败 Tag、整卡危险色边界与 `0%` Progress。Retry 是恢复请求，不是危险操作，也不能自动清除消费者提供的 `error`。
- 所有 CSS `var(--*)` 必须引用已定义 Token。阴影开关开启后至少验证一个普通 Surface 与一个浮层 Surface 的计算 `box-shadow` 非 `none`；禁止只切换 `data-shadow` 却让组件引用不存在的私有变量。
- 阴影的资格由语义而不是全局开关决定：Card、浮层、集合根等独立 Surface 可以消费外阴影；Cell、Field、Empty、Result、Grid、Steps 等连续条目或透明布局根，以及 Avatar、Tag、Badge、Icon、Progress、Skeleton 等展示叶子必须保持无外投影。selected/focus 的 inset outline 与 Cell/Grid 分隔线不属于 elevation，必须保持可见。
- Collapsible 默认仍是无外投影的连续内容集合根；只有调用方显式传入 `shadow=true` 且处于 open 状态时，根才提升为可消费 `--pui-shadow-card` 的 Surface。关闭态始终扁平，毛玻璃和阴影分别读取 ConfigProvider 的有效 Token；页面不得在外层重复添加背景或阴影。

## 2. 全局间距层级

| 语义关系 | Token | 小程序 | H5 镜像 | 适用范围 |
| --- | --- | ---: | ---: | --- |
| 主要分区 | `--pui-section-gap` | `36rpx` | `18px` | 同一表面内 Header、Content、Footer 等平级区域 |
| 面板与操作区 | `--pui-panel-padding` | `28rpx` | `14px` | 常规表面安全内距、操作按钮间距 |
| 默认列表节奏 | `--pui-space-normal` | `20rpx` | `10px` | 列表项、表单项等独立内容节奏 |
| 内容组合 | `--pui-content-gap` | `16rpx` | `8px` | 同一 Content 内直接关联的兄弟元素 |
| 控件内部 | `--pui-space-sm` | `12rpx` | `6px` | 图标与文字、紧凑控件内部 |
| 紧密信息 | `--pui-space-xs` | `8rpx` | `4px` | 标题与说明等强关联信息 |

规则：

1. 同一层级使用容器 `gap` 管理兄弟关系，不给每个子项分别增加 `margin-top`。
2. 分区不存在时不保留空容器或幽灵间距。
3. 面板 padding 与分区 gap 是不同语义：常规面板可以使用 `28rpx` 安全内距，同时使用 `36rpx` 分隔主要区域。
4. 组件内部确需精细几何时才使用 `--pui-space-step-*`；公开页面和组合代码优先使用语义 Token。
5. 深浅色、边框、阴影、毛玻璃、大圆角和渐变背景只能改变视觉 Token，不得改写上述布局关系。
6. 大圆角模式必须重映射 `small/medium/large/xlarge/xxlarge` 整套语义圆角；H5 与小程序保持 `1px≈2rpx`。显式 `round/circle` 形状保持满圆，不得被模式改成圆角方块。
7. 可见面板与透明分组根必须分开：可见 Surface 使用 panel padding；只有透明、无边框、无背景、无阴影的纯编排根才允许 `padding:0`，不能用 `.panel` 类名推断视觉语义。
8. H5 `PreviewDevice` 外框不直接持有内容 padding；其唯一内部 viewport 是所有标准组件共用的 Preview ScrollArea，并以 `data-preview-scroll-area="preview-device"` 标记。滚动 viewport 内统一挂载父布局。普通组件使用 `shadow-safe`，由 `--pui-preview-device-padding:14px` 与 `--pui-preview-shadow-bleed:14px` 合成 `28px` 四向安全内距；屏幕附着/浮层组件使用 `edge-to-edge:0`。edge-to-edge viewport 不得为 classic scrollbar 设置 `both-edges` 对称 gutter，Tabbar、Navbar 等 normal 贴边组件必须占满设备可见宽度；滚动条只允许占用其平台真实一侧或以 overlay 呈现。两种父布局都必须以单一 `minmax(0, 1fr)` 网格轨道建立确定可用高度，直接预览根固定 `height:100%/min-height:0`，不得依赖会退化为内容高度的 `min-height:100%`。其中 `.demo-section` 使用 `--pui-preview-content-gap:8px` 且 `margin:0`。组件私有规则不得改写父布局。
9. 透明组合根中若基础 Button 的外阴影后方紧接不透明 Cell、状态块或其他 Surface，组合容器必须以 `pui-preview-elevation-clearance` 预留 `--pui-preview-shadow-bleed`；根不得用 `overflow:hidden` 裁切子 Button 的外阴影。该空间始终保留，不能随阴影开关改变布局。
10. 官网 Header/Stage 的页面 gutter 属于站点布局，统一使用 `--pui-site-page-gutter*` 与 `--pui-site-*-padding-block-*`；它们不得复用或反向覆盖组件 panel/content Token。
11. 全部源码 WXSS 与官网 CSS 的 padding、margin、gap 必须消费 PUI Token；唯一固定负值例外是 `pui-sr-only` 为无障碍裁切使用的 `-1rpx`，不得扩展为视觉布局手段。
12. Indexes 等“集合根 + 内部 Cell”的连续列表，集合根是唯一可见 Surface：根承接面板 padding、阴影、毛玻璃和语义圆角；直接 Cell 条目保持透明、无外层阴影和圆角，连续条目使用 Cell 自身分割线而非 `content-gap` 拉成并列卡片。外观开关不得改变这一分组几何。

## 3. Header / Content / Footer

- 拥有三段式结构的组件必须把 Header、Content、Footer 建模为平级语义区域。
- Header 只承载标题、说明和头部操作；Content 承载正文、默认 Slot 和内容状态；Footer 承载确认、取消及其他 Actions。
- 默认 H5 预览不展示方法名、事件链、受控状态或布局枚举；这些工程诊断进入 API 或 PROP。确属组件用户反馈的信息才放入对应语义区域，不能成为第四个伪分区。
- 标准组件概览在挂入实时 DOM 前必须形成 `component-only` 结构：移除 showcase label、methods/event/runtime/platform/meta、直接状态 Cell 与事件反馈节点，并把 Slot、平台名、源码名和原始值测试等实现文案转为用户可理解的业务文案。禁止用 `display:none` 或裁切掩盖这些节点；浮层关闭后仍要保留真实 PUI Button 触发入口。
- Content 不默认增加边框、背景或内层面板；确需独立内容块时组合明确的 PUI Cell、Card 等组件。
- Header、Footer 没有真实内容时不渲染；不得依赖空壳容器制造间距。

### Popup 操作面板规则

Popup 是 PoemUI 的“操作面板”基础原语，不是业务表单、确认框或成功提示。所有 Popup 及其官网镜像必须遵守以下组合顺序：

1. **Surface 只有一层**：Popup 根负责唯一可见 Surface、主题、边框、圆角、阴影和毛玻璃；Header、Content、Footer 是同一 Surface 内的结构分区，不再套 Card 或第二层面板。
2. **卡片与贴边是同一 Surface 的定位选择**：`card=true` 默认保留 `--pui-space-step-12` 视口留白；`card=false` 只让 Surface 贴合弹出边缘并把贴边圆角归零，不能删除 Header、Content、Footer 的既有内边距或另造一层容器。
3. **遮罩模糊只属于遮罩**：`blurOverlay=true` 仅在 `showOverlay=true` 的完整遮罩上应用 `--pui-popup-overlay-blur`，不得改写 Popup Surface、全局毛玻璃偏好或用半透明颜色假装模糊。
4. **Header 三列稳定对齐**：左列放调用方提供的带底色圆形 `pui-button` 主要执行操作，右列放带 muted 弱填充的 `close-btn` 或默认圆形 `pui-button` 关闭操作，中间只放标题与副标题。左右列始终等宽，按钮顶部对齐且共享上间距，标题区域自身垂直水平居中；没有左操作时保留空轨道，不能用绝对定位补位。
5. **Content 只有一个滚动上下文**：Content 是 Popup 内唯一可滚动区，表单、Cell、Loading、Empty 等业务内容必须通过 Slot 组合；Popup 不穿透修改 Slot 子组件的 padding、圆角、尺寸或状态。`content` 文本只作为没有 Slot 内容时的轻量回退。
6. **Footer 只承载主要动作**：Footer 位于滚动区之外，主要动作必须是调用方提供的真实 `pui-button`，由父级处理提交、loading、失败、重试、成功和关闭回写。Popup 根不新增 `confirm`、`submit`、`success` 等业务 Props。
7. **间距按层级消费 Token**：Surface 四周使用 `--pui-panel-padding`（28rpx）作安全内距；Header 标题与图标、Header→Content 和 Footer 按钮之间使用 `--pui-content-gap`（16rpx）。Header 存在时 Content 顶部只消费这一个 gap，不再同时叠加 `--pui-section-gap + --pui-panel-padding`；Header 不存在时 Content 恢复完整四向 panel padding。Content 内的兄弟组件沿用各自 PUI 组件间距。不能写死第二套 padding，也不能用负 margin 抵消父级留白。
8. **动作优先复用 PUI**：关闭、左侧快捷动作和 Footer 主操作优先使用 `pui-button`；Cell、Icon、Loading、Empty 等内容也沿用 PoemUI 组件。原生节点只允许作为 Popup 的平台层、滚动层或遮罩层，不得手写伪 Button。
9. **视觉开关不改变几何**：light/dark、border、shadow、frostedGlass、largeRadius 和 gradient 只改变对应 Token；Popup 的 Header 三列、Content 滚动边界、Footer 高度和左右 padding 保持不变。390px 下标题自然换行，不使用省略号隐藏关键文案。
10. **动效只作用于 Surface 与遮罩**：进入/离开仅使用 opacity/transform，默认 500ms、最长 1000ms；Overlay 与 Popup Surface 在完整进退场期间必须保留同一 DOM/小程序节点，只更新阶段 class，退场完成后才能重建关闭入口。`reduceMotion` 或系统低动效压缩为 1ms，不对 `height:auto` 或 `display:none` 做无效 transition。
11. **方向默认值明确**：`placement` 默认是 `bottom`，同时支持 `top / bottom / left / right / center`；官网预览入口在 Popup 未打开时固定放在预览区底部，左右和底部留白等距。

这套规则同时约束 Popup 的小程序 WXML/WXSS、H5 `popupSample`、组件合同、API 示例和专项测试；后续 Dialog、Sheet 等上层组件可以复用几何原则，但必须保留各自的业务语义。

## 4. Dialog 专项结构

Dialog Surface 内部固定为 Header、Content、Footer 三个平级区域：

```text
Dialog Surface
├── Header：Left Action / Heading / Close
├── Content
└── Footer：Actions
```

- Header 使用三列 Grid：`72rpx | minmax(0, 1fr) | 72rpx`，H5 为 `36px | minmax(0, 1fr) | 36px`。
- 左列公开可选 `header-left` Slot，只允许一个紧凑 PUI 图标按钮；无内容时保留平衡轨道，并始终与右侧默认 Close 保持同宽。
- Dialog 不公开 `loading/error/empty/retry` 状态；请求状态由消费者在 `content` Slot 中组合 PUI Loading、Empty 与 Action，不能以 Dialog 私有状态回写。
- 中列承载 `title` Slot 或标题文本，长文本允许换行且始终位于 Dialog 几何中心。
- 右列承载 `PUI Button + PUI Icon` Close；Close 属于 Header，禁止放到 Header 外绝对定位。
- Dialog 作为 Popup 的唯一 Surface 时必须清除 Popup Content 的重复 padding；Header、Content、Footer 直接消费 Dialog 自身 inset，禁止双层内距。
- Dialog 表面安全内距和 Footer 内按钮间距使用 `--pui-dialog-action-spacing: var(--pui-panel-padding)`，默认 `28rpx / 14px`。
- Content 直接子元素使用 `--pui-dialog-content-gap: var(--pui-content-gap)`，默认 `16rpx / 8px`。
- Close 尺寸使用 `--pui-dialog-close-size`，默认 `72rpx / 36px`；图标必须双轴居中，圆形不能被大圆角模式改成圆角方块。
- Dialog 高度按内容自然增长，但必须设置视口最大边界并 `overflow:hidden`；Header 和 Footer 固定可见且不收缩，只有 Content 使用 `min-height:0 + overflow-y:auto` 承担极端长内容。任何由 `content` Slot 组合的 Loading、Empty 或长内容都不得越出 Dialog 或 PreviewDevice。

## 5. Tag 与 Slot

- 默认 Medium Tag 为 `48rpx / 24px` 高，水平 padding 使用 `--pui-content-gap`。
- 默认 Tag 使用 `--pui-radius-small`：普通模式 `12rpx / 6px`，大圆角模式 `18rpx / 9px`；H5 镜像使用对应的 `--pui-preview-radius-small`。
- Tag 使用 `inline-flex + align-items:center + justify-content:center`，默认保持内容宽度。
- Grid/Flex Slot 不得无意把 Tag 拉伸成整行；需要居中时使用容器对齐，不覆盖 Tag padding。
- `round` Tag 始终使用满圆 Token；`mark` Tag 的语义小圆角端跟随全局模式，胶囊端保持满圆。
- 需要整行内容块时使用 PUI Cell、Card 等块级组件，不能把 Tag 拉宽冒充输入框或内容面板。

## 6. 容器、可读性与预览

- 首页目录一次只展开一个分区；用户打开分区时持久化最后一个有效分区 key。页面从组件详情返回或重新进入时恢复该分区，并通过 PUI ScrollArea 的 `scrollIntoView` 定位到稳定锚点；不得直接操作内部 `scroll-view`、保存像素偏移或让两秒自动展开覆盖用户记忆。

- 页面标题只出现一次；每个容器必须承担布局、分组或交互职责，否则删除。
- 避免面板套面板、卡片套卡片，克制使用边框、阴影、状态色和解释性文案。
- 小程序固定字号不低于 `24rpx`，H5 固定字号不低于 `12px`。
- 小程序与 H5 统一消费 `--pui-font-family-*`、`--pui-font-size-*`、`--pui-line-height-*`、`--pui-font-weight-*`；H5 同名 Token 按 `1px≈2rpx` 精确镜像，禁止在官网组件规则中重新写死字号、固定行高、数字字重或另一套系统字体栈。H5 的 `--pui-font-family-mono` 优先使用官网本地自托管、独立注册为 `PoemUI JetBrains Mono` 的 JetBrains Mono WOFF2，排除本机同名字体与旧缓存碰撞；小程序端保留 Menlo / Consolas 系统回退且不承担字体包体。源码阅读区必须关闭字体连字，正文使用 Body Medium `14px / 20px`；内层语义 `code` 必须显式继承字体，并按 `pre → code → 实际语法节点` 验证计算样式，禁止只检查外层容器。
- H5 的每个无 fallback CSS 自定义属性引用必须有可追踪定义；静态主题变量在 CSS 根定义，组件运行变量由对应 helper 的 inline style 或 `setProperty` 提供。禁止引用未定义 Token，也禁止为修复报错创建与现有 `--shadow/--shadow-soft/--blur/--brand/--brand-soft` 同值的私有别名。
- Caption 是最小可见角色：`24rpx / 34rpx`，H5 为 `12px / 17px`。需要更弱的信息只能改变语义颜色或层级，不能继续缩小文字。
- `none/tight/normal/relaxed` 比例行高也必须读取 `--pui-line-height-*` Token；Style Utilities 不得把比例值复制为第二套事实源。
- 所有组件和预览在 `390px` 下必须可读、可操作且没有横向溢出。
- 标准组件概览统一使用 `PreviewDevice`：桌面宽度跟随 `375/393/430px` 机型选择，高度固定为 `--pui-preview-device-height: 622px`；390px 等窄屏只收缩宽度，不改变高度或产生页面横向溢出。所有组件的预览根必须在该固定设备内填满可用高度：`shadow-safe` 扣除四向 28px 安全内距，`edge-to-edge` 铺满完整 viewport。
- `PreviewDevice` 是唯一功能性设备边界，必须始终保留 `--pui-preview-device-surface` 底色、边框、语义圆角和 `overflow:hidden`；任何组件包括 Dialog 都不得通过透明、`height:auto` 或取消边界建立私有例外。
- 概览 Stage 必须直接挂载 `PreviewDevice`，不再使用可见的 `preview-canvas / preview-canvas__body` 外层面板。设备底色与页面主题使用同一语义：标准浅色为 `--page = #fafafa`，标准深色为 `--page = #09090b`；`--surface-soft = #18181b` 只用于真实浮起的深色组件 Surface，禁止用私有靛蓝或蓝灰色设备主题替代。
- 纯布局用途的 stage、canvas、host、frame、viewport 必须透明、无边框、无阴影和无毛玻璃；只有真实组件本体、组件遮罩、浮层或承担明确分组职责的 Surface 可以不透明。不能靠相邻的多层近似底色表达层级。
- 浮层演示根与透明布局 Stage 必须至少铺满 PreviewDevice viewport，让真实 scrim/overlay 覆盖完整设备内容区；不得把局部遮罩画成悬在设备中的另一张矩形卡片。
- `PreviewDevice` 必须在唯一滚动 viewport 内提供两种共享父布局：普通组件使用 `shadow-safe`，固定消费 14px 基础内距与 14px 阴影外扩区，最终四向为 28px；Dialog、Popup、Sheet、Popover、ActionSheet、DropdownMenu、Overlay、Navbar、Tabbar、Toast 等屏幕附着组件使用 `edge-to-edge`，padding 为 0 并覆盖完整 viewport。外框自身 padding 为 0，避免安全区落在滚动裁切边界之外。两种布局都以确定轨道和直接根 `height:100%/min-height:0` 填满可用高度；直接 `.demo-section` 固定使用 `8px` content gap 和 `margin:0`。阴影开关不得增删安全区或改变布局。
- 只有 `.preview-device__viewport` 可以纵向滚动；外框不随内容、浮层或交互增长。组件预览根必须填满对应内部 viewport，不能只让首个内容块占据顶部后留下无职责空白。该共享 Preview ScrollArea 默认复用 ScrollArea 的 `md / 32px` 顶底主题渐隐层：两层必须是 viewport 的透明同级、`pointer-events:none`、`aria-hidden=true`，只在真实 overflow 时出现；位于顶部仅显示底层、位于底部仅显示顶层，中段两层同时出现。不得创建第二个滚动上下文、遮罩 Surface 或用静态 class 假装滚动状态。滚动条默认透明隐藏，真实滚动时以 `.is-scrolling` 显示，停止后自动恢复隐藏；PreviewDevice 用 `scrollbar-gutter: stable both-edges` 保持所有组件预览的左右可用宽度和安全边距对称。常规模式下，PreviewDevice 及其内部每一个真实溢出滚动口都必须支持鼠标左键按住后纵向拖动，并兼容主触点和触控笔；最内层滚动口优先接管，超过 6px 才进入拖动并抑制 click，输入、Picker、Slider、Swiper、SwipeCell、PullRefresh、Sheet 与 Rate 的专属手势不得被劫持。
- 原生滚动组件若提供固定顶/底渐变遮罩，只能以同一滚动视口的透明、无交互 sibling layer 实现：遮罩必须 `pointer-events:none`、`aria-hidden`，并由真实边缘状态决定——顶部仅底层、底部仅顶层、中段两层、无溢出零层；颜色走组件语义 Token 或已校验的公开色值。依赖容器色的上下文别名必须在 light/dark 两个主题作用域分别解析，不能让深色子树继承浅色根已经计算的白色值。无边 Navbar 与相邻 ScrollArea 连续排布时，Navbar 用 `border-bottom:0` 不保留透明边框，页面壳将 ScrollArea 的上下文色指向同一画布 Token；若公开尺寸，只能使用组件合同中定义的离散语义档位与跨端 Token，默认档不得改变既有布局。不得放进可滚动 Slot、增加第二个 viewport、阻断内容或把透明根变成 Surface。
- 微信小程序使用 `navigationStyle: "custom"` 时，右上原生胶囊仍由系统绘制和响应；页面级 Navbar 必须读取 `wx.getMenuButtonBoundingClientRect()` 的 `left/right/top/bottom/width/height` 与 `wx.getWindowInfo()` 的 `windowWidth/statusBarHeight`。左右轨道以 `windowWidth - left` 对称保护标题；左操作以 `windowWidth - right` 为外边距，在真实胶囊宽度的镜像区域内居中；导航内容高度按胶囊相对状态栏的上下等距计算。右侧不得再放置业务操作。H5 仅可用不可交互、`aria-hidden` 的 Token 化视觉镜像对齐同一空间，不能复制为假菜单、假关闭或假成功。任何组件若允许退出该模式，必须以显式非默认 Prop 声明，并在组件合同、API、H5 与真机验收中同步说明。
- 自定义导航栏需要两个标准图标操作时优先使用 Navbar `leftBtn/rightBtn`；若其中一项必须保留 PUI Button 的 `open-type` 等平台属性，则两个操作共同进入唯一 `left` Slot，并组合两个 `extra-small / text / transparent / circle / icon-only` PUI Button。Slot 分组只使用共享 Flex 与紧密间距 utility，不增加页面私有偏移、Surface 或字符图标；每个操作独立提供可访问名称和真实事件闭环。
- 组件目录中的每个标准组件概览必须进入同一个 `PreviewDevice`，并在其唯一 `.preview-device__viewport[data-preview-scroll-contract="component-preview"]` 内运行；不得为某个组件恢复页面级滚动、第二个预览滚动根或私有设备壳。文档页与 Icon 资源库是明确例外，不能冒充手机组件概览。AreaChart、BarChart、Waffle 已是标准组件，必须遵守同一设备合同。
- 浮层隐藏时显示真实触发入口，不能保留空黑底或空遮罩舞台；浮层本身已是 Surface 时，不再在统一设备边界内部套装饰性 Card。
- 复合组件的状态容器是唯一 Surface；嵌入其中的 PUI Empty 使用 `small` 尺寸和 `28rpx 20rpx / 14px 10px` 原生内距镜像，但不得再创建第二层底色、边框、阴影或毛玻璃。外观开关只改变宿主 Surface，不改变嵌入 Empty 的透明边界。
- 复合组件中的 PUI Icon、Loading 必须通过共享 helper 的尺寸参数传递原生几何；父组件只管理排列、颜色和位置，不得穿透修改子组件的 `width/height/padding/border-radius`，更不得用 `!important` 抢占组件合同。
- Button 内 Icon/Loading 必须按原生四档 `22/26/32/38rpx` 镜像；Checkbox 标记按 `24/28/32rpx`、Switch Thumb 子图标按 `20/24/28rpx`，Tabbar/Steps 等组件使用各自 WXML/WXSS 的明确尺寸，禁止回退为一个通用 small 值。
- BackTop 等 fixed 浮动操作必须避开同页底部 Tabbar：Tabbar 内容高度统一读取 `--pui-tabbar-content-height:112rpx / 56px`，BackTop 通过 `--pui-back-top-bottom-offset` 组合导航高度、系统安全区和标准操作间距。不得让浮动按钮覆盖目的地导航，也不得恢复任意 `bottom` 公共 Prop。无文案 BackTop 固定是 primary 圆形 IconButton，默认 `arrow-up`，并使用真实 `iconOnly` 结构。
- Tabbar 的 `shape="normal"` 是透明屏幕附着布局根，不是独立 Surface：默认无背景、外投影和毛玻璃，`bordered=true` 只恢复中性顶部分割线；只有 `shape="round"` 可以作为独立悬浮 Surface 消费 glass、floating shadow、frosted filter 与语义圆角。不得让 normal 因全局阴影或毛玻璃开关重新呈现底部面板。
- 预览默认只呈现用户路径：入口、组件本体、必要结果。`open()`、`close()`、事件链、状态枚举等工程诊断只能出现在 API 或 PROP。
- 单行省略统一使用 `pui-text-cut`；`pui-text-truncate` 仅为兼容别名。关键操作、主要状态和布局错误不得通过 text-cut 隐藏。

### 标准组件页信息架构

- 官网左侧目录使用中文优先的任务分类：`开始与规范 / 基础组件 / 布局 / 导航 / 表单组件 / 数据展示 / 反馈 / 浮层 / 高级`。表单组件内固定按 `结构与校验 / 文本与搜索 / 选择与数值` 组织可见条目，日期、时间和附件选择统一属于选择与数值；分类来自 `metadata/components.js` 的生成源，每个路由只能出现一次，子分区不得复制路由或建立第二个 API 入口。条目的英文主名后可显示中文辅助名，但它是普通灰色文本，不得用 Tag 或 Badge 冒充状态；分区项数仍可使用 PUI Badge。禁止把所有组件塞入单一 Components 大组，也禁止按 done/beta 等开发状态组织用户导航。
- 左侧 PUI Input 保留当前目录过滤，同时以 PUI Button 后缀展示 `⌘K` 入口。`Ctrl/⌘ + K` 必须打开站点级快速搜索 Dialog；Dialog 的输入、结果、关闭分别调用共享 PUI Input、Button、IconButton，结果按同一任务分类分组，并支持中文/英文/分类搜索、上下方向键循环、Enter 打开、Esc 关闭、Tab 焦点圈和遮罩关闭。
- 快速搜索是 H5 官网导航能力，不伪装成微信小程序的系统级快捷键能力。弹窗使用固定最大边界和内部滚动，390px 下不得横向溢出；深浅色和六项外观模式只改变 Token，不得改变结果行或弹窗结构。

- 每个标准组件页统一复用 PUI Tabs，固定为 `概览 / API / 属性` 三个互斥视图，不得重新创建私有 Tab 按钮；内部状态名可保留 `prop`，用户可见文案统一使用“属性”。页面 Tabs 不提供视觉 Hover，只保留高对比选中态和 `focus-visible`；按钮基础 Surface 必须保持透明，禁止继承通用 Button Hover 或新增私有 Hover Token。
- 官网的三项分类必须逐项调用共享 `buttonSample`，刷新/重置必须调用 `iconButtonSample`；只给手写原生 `button` 添加 `pui-*` 类名不算复用。两类控件首次挂载后保持节点稳定，切换视图只更新状态。
- 顶栏详细外观入口固定为一个调用 `iconButtonSample` 的 Palette 图标按钮；按钮通过 `aria-haspopup="dialog" / aria-expanded / aria-controls` 连接同一个非模态外观菜单，不得重新平铺七项详细开关。按钮左侧固定一个“一键果味”共享 PUI Switch：开启写入 `shadow=on / frost=on / radius=large / border=off / gradient=off / gradientPreset=neutral`，关闭写入标准组合，两个方向都保持当前 theme。果味 Switch 的 checked 必须由六项逐项全等实时推导，禁止创建独立 storage key；菜单内任一项让配置偏离后必须立即自动关闭，刷新时也从已恢复的六项重新推导。菜单内边框、阴影、毛玻璃、大圆角、渐变背景、深浅色、间距相等七项必须调用共享 `switchPreviewMarkup`；`effectsEnabled` 只保留为开发者 Store/API 和预设内部闸门，不得再渲染为第八项用户开关。旧用户偏好中的 `effectsEnabled=false` 在外观设置 UI 初始化时迁移为 `true`，同时保留三个单项原值，避免隐藏闸门锁死可见控制。渐变开启后使用同菜单内的共享 `selectControlSample` 选择预设，静态 HTML 只提供 Mount。打开后聚焦首个 Switch，Esc 关闭并恢复入口焦点，点击外部关闭；轨道与标签都属于 Switch 的真实交互路径，刷新后必须恢复同一持久化状态。菜单使用 PUI panel/content spacing、主题 Surface 和 normal/standard 动效，390px 不得越界，低动效压缩为 1ms。
- 渐变背景是全局背景画布 Token：开启时页面 Stage 与 PreviewDevice 共享同一套预设渐变，组件 Surface、Scrim 和浮层仍保留各自语义。预设固定为 `neutral / flowing-gold-pink / premium-black / cement-white / black-gold / light-gold / ai-mist-blue-violet / cyber-pink-blue / aurora-violet`，后三项分别为 AI 雾蓝紫、赛博粉蓝、极光紫；每项都有 light/dark 同名 Token，避免当前主题正文失去对比度；`neutral` 浅色使用 `#fafafa / #f4f4f5`，深色使用 `#09090b / #111113`。预设只能作用于消费者页面画布，不得改变间距、尺寸、圆角和定位，也不得复活旧靛蓝设备主题或进入组件 Surface。
- 边框总开关默认关闭，以 `data-border=on/off` 持久化，但 Token 重映射必须从 `.preview-device__viewport` 开始，只作用于其内部真实 PUI 组件树。关闭时组件的中性 Surface 边界透明；Divider、状态边界、PreviewDevice 外框、API、PROP、导航、工具栏和文档面板保持可见。Divider 表达内容层级，不得被误当成 Surface 边框。焦点、错误、选中、危险操作等状态边界继续可见，盒模型不变；显式 `pui-border-solid` 只负责 `solid` 线型，不私自写入宽度和颜色。
- Tabs 是一级页面分类，必须独占 Header 中唯一一行。概览的模式切换、机型选择、刷新、重置和复制属于预览内容工具，统一放在 PreviewDevice 上方的透明工具栏，不得与 Tabs 并排。
- Tabs 行固定使用 `--pui-preview-tabs-row-height`；标准组件 Header 在桌面端必须使用“标题说明 `minmax(0, 1fr)` + 导航固定列”的顶对齐 Grid，禁止用 `align-items:center` 根据左右内容高度重新居中 Tabs。概览透明工具栏固定使用站点语义高度，模式切换在左，机型、刷新、重置和复制组成一组居右对齐，复制当前组件效果代码固定为最右侧 PUI IconButton；工具栏必须为透明、无边框、无阴影、无毛玻璃，只有具体控件可以拥有交互 Surface。工具栏顶部内距固定为 `--pui-preview-content-gap`（8px），桌面高度因此为 44px，390px 两行高度为 88px；该内距必须计入语义高度，不得用外层 margin 或空容器代替。390px 下允许右侧工具组换到下一行，但继续右对齐。API/属性可整体隐藏该内容工具栏；Tabs 节点仍须跨视图稳定复用，切换只更新选中态、指示器与内容区，不得整段重建导航 DOM；跨视图及跨组件的 Tabs 几何位置和视口坐标必须完全一致，禁止通过 `getBoundingClientRect + window.scrollBy` 做事后滚动补偿。页面 Tabs 的三个轨道固定为等分 Grid，选中块宽度固定为三分之一，只用 `transform: translate3d()` 在轨道间移动；禁止同时过渡 `left/width`、运行时测量宽度或重建 Tabs。动效消费 `--pui-duration-normal` / `--pui-ease-standard`，系统低动效压缩为 `1ms`。
- 工具栏复制必须与 PROP WXML 共用 `makeUsageCode` 真相源，按当前组件 Props 生成并只输出非默认 Props。复制文本必须包含注释，说明当前主题、边框、阴影、毛玻璃、大圆角、页面渐变边界，以及打开、滚动、焦点和动画等临时运行态不进入复制代码；不得抓取 H5 DOM 或把浏览器像素样式冒充小程序代码。
- Header 不显示重复的分类 Kicker，只保留唯一标题和一句面向用途的短摘要。摘要由全量 metadata 维护且单条不超过 28 个字符，不得包含 Props、WXML、H5、Slot 或交付状态等工程词汇，不得用视觉裁切充当文案压缩。Header 内距使用站点语义 Token，标题使用 `title-medium`，摘要使用 `body-small`。右侧 Tabs 的活动项使用主题感知的高对比选中态，非活动项保持稳定，`focus-visible` 独立可辨；不增加视觉 Hover。
- `概览` 的主内容只展示统一 PUI 预览容器与真实组件演示；常规模式当前代码只允许作为设备左侧辅助卡片存在。API 表、完整 Props 表单、兼容说明和工程状态不得堆在预览下方。
- 标准概览必须提供 `常规模式 / 元素选择模式`：常规模式保持所见即所得与真实业务交互；元素选择模式在捕获阶段接管 PreviewDevice 内点击与 Enter/Space，只选择和高亮元素，明确不触发组件业务操作。PreviewDevice 空白区使用默认光标，具备语义选择能力的元素使用 `pointer`；`crosshair` 只属于坐标/像素拾取工具，不得用于组件元素 Inspector。
- 常规模式左侧固定显示透明、可滚动的组件用法正文，按“组件引用”小标题、`usingComponents` 代码块、“基础用法”小标题、Starter WXML 代码块自然排列；需要数组、对象或命令式显示入口时继续显示“页面数据/页面逻辑”。禁止用 Tabs 隐藏内容，也禁止把各段切成固定高度或独立纵向滚动卡片。删除重复的总 Header 与“当前效果 / 默认值已省略”常驻说明；正文根只负责几何和唯一纵向滚动，必须透明、无边框、无圆角、无阴影、无毛玻璃和无 panel padding。每段代码标题行必须调用共享 `previewCodeBlockSample + iconButtonSample` 提供独立 Copy 操作，成功切换为 Check、失败切换为 ErrorCircle，并通过 `aria-live` 回传真实剪贴板结果；禁止手写原生按钮或伪报成功。代码块继续消费 PUI code Surface、border、radius、mono/body-small/line-height、content gap，带行号、主题兼容语法色、键盘焦点和必要的横向滚动。可见引用文档由 `metadata/component-starter-usage.js` 驱动；运行时默认值继续保证无副作用，H5 Showcase 初始 Props 和小程序独立组件页均不得读取 Starter Usage。Starter 可以显式写入非默认 Prop，例如 `<pui-popup visible="{{true}}" content="Popup 内容" />`，以保证复制后立即可见。工具栏复制仍通过 `makeUsageCode(detail, props)` 输出当前实时效果。基础代码多行开始标签按 `80` 字符软上限、每行最多 3 个属性重新成组排版。桌面常规模式使用左右分配关系：PreviewDevice 右边缘对齐 Stage 的 `--pui-site-page-gutter`，正文左边缘对齐同名 gutter，并自动撑满至设备前，只保留 `--pui-site-element-inspector-offset`（14px）；正文与设备高度共同读取 `--pui-preview-device-height`（622px）。窄于 `1180px` 时成为左下方满可用宽度、`240px` 高的有界正文。进入元素选择模式后正文退出，PreviewDevice 恢复居中并让位给双侧 Inspector。切换模式时复用同一个 PreviewDevice DOM，不丢失组件运行态；设备只用 `transform` 与共享 normal/standard Token 在右侧和几何中心间平滑横移，低动效统一为 `1ms`。
- 窄于 `1180px` 时，常规模式代码正文必须退出绝对定位并进入 PreviewDevice 下方正常文档流；不得覆盖设备、浮层或拦截设备内交互。`240px` 只限制代码正文自身高度，不得缩短或遮住固定 `622px` 的 PreviewDevice。
- 元素选择后的上下文 Inspector 只显示当前元素可由父组件公开 Props 控制的字段，并与完整属性页复用相同 PUI Input、Select、Switch、Slider、Textarea helper、校验与回写路径。字段按交互方式拆分：左侧只放可自由输入的 `text/json/nullable-number` 内容值，右侧放 Boolean、枚举、范围及其余设置；任一侧没有字段时显示真实 PUI Empty。组合子组件没有父级公开映射时显示说明，不得创建假 Prop 或穿透修改子组件私有状态。
- 上下文 Inspector 只是概览内按需双侧浮层，不是常驻第三列：桌面分别浮在 PreviewDevice 左右两侧，两张卡片共享宽、高、内距和 Surface Token，必须等高等宽且各自内部滚动；窄于 `1180px` 时变为预览底部的等宽双栏覆盖。它不得改变固定设备尺寸、Stage 布局或组件几何。首次选中使用左右相反的展开动效，关闭反向收回，切换元素只做轻量过渡；动效统一使用 normal duration/standard easing 并支持系统低动效，连续输入回写不得重播入场。关闭、退出模式、切换组件或进入 API/属性必须清除选择；完整属性仍只存在于属性视图。
- `概览` 的演示根必须标记 `data-preview-contract="component-only"`。组件本体的 Header/Content/Footer、真实输入/选择/开合结果可以保留；组件名重复标签、方法按钮排、事件链、受控/非受控标签、runtime/platform/meta 卡片和直接诊断 Cell 必须在进入实时 DOM 前删除。Typography 等文档型能力继续走独立正文，不纳入手机设备合同；AreaChart、BarChart、Waffle 不得使用该例外。

### 数据图形展示叶子

- `AreaChart`、`BarChart` 与 `Waffle` 是透明、只读的 `display-leaf`，以结构化数据和共享零基线表达趋势或数量，不自带 Card、Surface、请求状态、Tooltip 或点击选择。
- AreaChart 小程序端允许并要求使用原生 Canvas 2D，H5 使用同数据合同的真实 SVG；BarChart/Waffle 使用 WXML View、Flex/Grid。三者均禁止图片快照、静态写死图形和运行时图表插件，H5 不得以截图替代。
- `neutral/violet/blue/teal/pink/amber` 只是视觉编码，必须同时提供标签、数值、图例或可访问摘要，不能只靠颜色传达意义。
- BarChart 省略合法主题时，单序列分类统一使用 `blue`，同一分类的多段数据才按 `blue → teal → violet` 分配；显式主题仍优先。`showGrid=true` 的横向布局必须显示真实 `0 → 共享上限` 端点，并使用比 Waffle 描边更弱的专用 `--pui-chart-grid-line`，页面不得通过私有文案、绝对定位或第二套坐标轴伪造零基线。
- BarChart 的强调段沿数值方向使用 AreaChart 式 `0.04 → 0.42` 透明填充，并在真实数据端使用实体强调色 inset 终点线；横向与纵向必须分别使用同义方向 Token。Waffle 的每个 segment 独立从 `1` 衰减至 `0.28`，低透明格保留 inset outline。渐变与终点线都不得建立根 Surface 或外投影。
- AreaChart 的实体强调色描边与竖向渐变填充必须使用 `--pui-chart-accent-*` 和 `--pui-chart-area-fill-start/end`；填充回到共享零基线或前一堆叠系列。natural/linear/step、叠加/堆叠和横轴/图例在小程序 Canvas 与 H5 SVG 保持同义。
- 三类图表统一公开 `animated=true`、`duration=500` 和 `replay()`。入场只表达图形出现：Area 淡入/描边展开、Bar 从零基线伸展、Waffle 顺序缩放淡入；不得表达请求或业务成功。关闭动画直接显示完成态，低动效为 1ms 且移除级联延迟。
- 应用页用 BarChart 比较分类，用 AreaChart 表达至少三个有意义的连续顺序点，用 Waffle 表达当前总量的组成或小幅增量；不能只因已有旧实现就混用图表语义。版本数量必须由目录真相源和显式版本差集生成，不能按日期、文件数量或页面文案猜测。只有两个累计版本点且差值很小时，不得用近似水平的 AreaChart 冒充趋势；应直接表达“已有 + 新增 = 当前总量”，并用图例与读屏文字避免只靠颜色传达。无监控源时不得补月份、健康度、使用量或未来版本制造更丰富曲线。图表上方需要并列摘要时，使用同一消费者 Surface 内的透明等分 Grid，不为每个数字再建 Card/边框/阴影；数值必须引用真实生成源。
- Waffle 超过 `maxCells` 时必须提高有效单位并始终显示“1 格 = N”，即使 `showValue=false` 也不能隐藏缩放事实；`groupColumns` 仅增加组边界节奏，不改变列数、数据值或单元数量。
- 所有发布 WXML 都禁止在同一个节点上组合 `wx:else` 与 `wx:for`；需要循环的 else 分支必须使用紧邻前序 `wx:if` 的 `<block wx:else>` 包裹循环节点，或改为两条完整互斥 `wx:if`。`block` 不得被替换成仅用于规避编译器的实体布局节点。
- `概览` 透明工具栏右侧显示机型选择，并同时提供刷新与重置两个 PUI 图标按钮。刷新保留当前 Props，只重建演示运行态并恢复预览滚动起点；重置为组件默认 Props 与默认运行态，同时清除失效的元素选中态。两个图标按钮必须有不同且明确的 `aria-label`，并保持 PUI Button 的 Icon/Content Slot 结构，状态同步不得用 `innerHTML` 重写组件内部节点。
- `API` 只承载 API Reference，并完整展示组件真实存在的 Props、Events、Slots 与 Methods；某类不存在时不伪造空能力。参数表固定为“参数、类型、演示初值、可选值、说明”五列，正文使用 `--pui-font-size-body-medium`；可选值位于演示初值右侧，枚举与布尔值用逗号分隔，范围显示上下界和步长，无约束显示 `—`。表头、参数、类型、初值、可选值、事件 detail、Slot、Method 返回值和说明都必须完整展示：桌面允许行高自然增长，窄屏改为带字段标签的纵向行；禁止省略号、单行截断、行数钳制或固定高度隐藏 API 文字。
- `API` 不显示机型选择、刷新或重置等与当前阅读任务无关的概览工具；Tabs 位置由 Header 单行结构固定，不依赖内容工具栏占位。
- `PROP` 完整承接原常驻右侧 Inspector 的元信息、完整 Props 控件、WXML 引入和 H5 兼容说明；独立第三列布局必须删除。概览的元素选择 Inspector 只能呈现当前元素相关的父组件公开 Props，不得复制整份 PROP。
- `属性` 只在 Props 标题区提供同一个重置，不显示机型选择；它必须与概览重置调用相同默认值源和运行态清理函数。刷新与重置不得共用含糊的可访问名称，组件重置不得修改六项外观偏好或机型选择。
- PROP 内各区段使用 `--pui-preview-section-gap`，区段内部使用面板 padding/content gap；不得恢复面板套面板。
- 官网页面外层 gutter 使用独立 `--pui-site-*` Token，保持 Tabs 的文档坐标稳定；它不属于组件面板 padding。透明 `.panel` 仅负责分组，元信息、PROP 字段、兼容项与代码等真正可见 Surface 必须自行消费 panel/spacious padding。
- WXML 引入只输出相对组件默认值发生变化的 Props；默认值不得作为冗余属性写入示例。
- 基础规范与文档页不伪装成标准组件；其筛选和用法可在正文后以内联区段呈现，但不得恢复右侧 Inspector。

### 安装端 ConfigProvider 合同

- 跨页面组件视觉统一使用包入口公开的 `visualConfig` Store；每个页面根挂载 `<pui-config-provider use-global-config>`，由 Provider 订阅同一 Store 并把 Token 传给该页面组件树。
- 小程序不存在覆盖所有页面的 App 级 WXML 根；`App.onLaunch` 可负责 `visualConfig.restore()` 和消费者级系统主题同步，但不能替代页面根 Provider，也不能宣称在 App 配置一次就自动包裹所有页面。需要跟随系统的产品必须启用微信 `darkmode/themeLocation`，在启动、回前台和系统主题变化时写入唯一 Store；系统派生写入不得另建页面状态或静默覆盖持久偏好。
- 公共配置固定为 `theme / effectsEnabled / shadow / frostedGlass / largeRadius / bordered / equalSpacing`。`effectsEnabled=false` 只暂停 shadow、frostedGlass、largeRadius；theme、bordered 与 equalSpacing 保持独立，重新开启后恢复此前保存的单项值。31 个真实根组件与 Search/Combobox 内嵌 Input 的具体资格必须遵守 [外观资格矩阵](./APPEARANCE_CONTRACT_MATRIX.md)，不得只切换 Provider class 就声称所有组件都应获得外投影。
- Overlay 默认是半透明纯颜色遮罩；Provider 的 `frostedGlass=true` 让其子树 Overlay 自动消费 `--pui-overlay-blur`，调用方仍可通过 Overlay 的 `blur=true` 单独请求同一效果。有效模糊为全局毛玻璃与局部 API 的并集，二者均关闭时不得保留 blur；这不改变 Overlay 的遮罩色、层级、Slot、事件或几何。
- `equalSpacing` 只作用于具备独立 Surface 资格的结构块：四向 inset、直接结构块 gap、Header/Content/Footer 分区 gap 使用该 Surface 的 `--pui-surface-inset`；不得覆写全局 `--pui-space-*`、`--pui-content-gap`、`--pui-section-gap`，不得污染连续列表行、展示叶子、控件内部微间距或 PreviewDevice 基础设施。
- `bordered=false` 只透明化中性组件边界，必须保留盒模型、焦点、错误、选中和危险状态边界。渐变属于消费者页面画布，不进入 ConfigProvider、visualConfig 预设或组件 Surface。
- Store 写入必须经过 `restore / set / applyPreset / setEffectsEnabled / reset`，订阅使用 `subscribe` 并在页面或业务订阅者卸载时取消。写入方法返回持久化结果，业务必须能处理 `error`，不得伪造存储成功。

## 7. 验收闭环

重要 UI 修改必须同步小程序与 H5、更新设计文档和 Feedback Ledger、补充契约测试，并运行：

```bash
npm run feedback:generate
npm run feedback:check
npm run site:build
npm run check
npm run pack:check
```

浏览器至少验证 `390px`、light/dark、阴影、毛玻璃和大圆角；组件状态和事件仍以真实业务回写为准，不能用静态文案伪造成功。

## 8. 官网页面品牌标记

- 官网 Topbar 的唯一品牌标记为“月下成行”：一枚由偏移双弧组成、端点收尖的月牙对应诗的停顿，三条不等长圆线对应诗行、节奏与留白；月牙下缘与首行至少留出 `1` 个 viewBox 单位，不能贴合成无呼吸的图块。
- 品牌本体是 `24×24` 的单色 SVG，外层深浅反转方形只服务于应用入口；必须使用现有 `--brand`、`--page`、圆角和尺寸 Token，不能使用渐变、投影、玻璃或附加装饰。
- 浏览器标签、收藏与直接 `/favicon.ico` 请求必须复用同一月下成行几何：`favicon.svg` 为深浅反白首选，`favicon.ico` 必须含多尺寸回退；不得改用首字母、Emoji 或另一套图形。
- 官网固定文案为 `PoemUI` 与 `月下成行 · 原生小程序组件库`；移动端可在保留可访问名称的前提下隐藏副标题，但不得隐藏品牌名称或标记。
- 该标记不属于 `pui-icon` 资源库，也不替代任何交互 Icon；业务操作继续组合 PUI Button 与 PUI Icon。详细几何与使用边界见 `docs/BRAND_IDENTITY.md`。

### 当前外观设置统一补充（2026-07-25）

当前实现的外观菜单由七项真实 PUI Switch 组成：`border`、`shadow`、`frost`、`radius`、`gradient`、`equalSpacing`、`theme`；渐变开启后的 `gradientPreset` 使用共享 Select。`effectsEnabled` 继续存在于公共 Store、ConfigProvider、持久化 Schema、预设与 `setEffectsEnabled()` API，但不再作为用户可见开关；外观 UI 读取旧的 `false` 时恢复为 `true` 并保留 shadow/frost/radius 单项。开发者单独调用 `effectsEnabled=false` 时仍只暂停三项有效值，不改变主题、边框、等距、组件尺寸或布局。果味预设由 `effectsEnabled=true / shadow=on / frost=on / radius=large / border=off / gradient=off / gradientPreset=neutral` 逐项推导，`theme` 与 `equalSpacing` 不参与预设，不建立独立果味存储键。组件层资格以 [外观资格矩阵](./APPEARANCE_CONTRACT_MATRIX.md) 为准。
