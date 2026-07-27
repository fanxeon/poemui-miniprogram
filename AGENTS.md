# PoemUI Agent 全局规则

本文件位于仓库根目录，对本仓库及所有子目录中的 agent 生效。任何后续 agent 在审计、实现、验收、修复或发布 PoemUI 时都必须遵守。

## 产品与工程原则

- 永远用中文沟通。
- 默认先审计真实代码、数据结构、路由、后端动作、现有 UI 规范和历史文档，再实施修改。
- 重视 UI/UX 一致性、业务逻辑闭环和用户动线自洽；不接受静态假 UI、fake success、断点流程或把用户导回旧流程。
- 从真实用户路径出发设计功能：入口清楚、操作少阻塞、单选/多选边界明确、确认动作克制、失败/取消/超时有下一步、390px 移动端可用。
- 默认 Less is more，克制使用 border、阴影、状态色和解释性文案。
- 优先复用项目现有技术栈、PoemUI 组件体系、业务合同和设计 Token。
- 前端交互必须真实回写；loading、禁用、成功、失败和回撤必须闭环。
- 重要 UI、业务链路和规则节点完成后，同步更新相关 Markdown 文档并运行必要验证。
- 用户明确删除某个组件或能力后，必须从当前产品面彻底移除其源码目录、发布清单、路由与迁移别名、搜索索引、H5 演示、API/WXML/兼容说明、示例、测试、反馈记录和安装产物；不得以“兼容”“历史参考”名义继续保留可被后续 agent 当作当前合同的内容。仅在用户明确要求保留的外部发布说明中可留下最小迁移说明。

## PoemUI 强制设计与实现规范

所有 Agent 修改 PoemUI 前，必须先检查现有组件、设计 Token、布局规范、路由及反馈记录。不得在已有标准之外创建重复实现。

`docs/UI_DESIGN_CONTRACT.md` 是全局 UI 语义合同；涉及组件结构、间距、Slot、预览或可读性时必须同步遵守。

`docs/components/` 保存每个组件的专属语义合同，每个组件最终都必须有一份。修改组件前必须先检查并完整阅读对应的全大写合同文件；现有组件尚未迁移时，下一次实质修改前必须基于真实源码、H5、API、示例、测试和 Ledger 建立合同，禁止批量生成空壳。Dialog 的强制合同为 `docs/components/DIALOG.md`。专属合同与真实实现、Ledger 或专项测试不一致时必须一起修正，不得只改其中一处。新会话可使用 `docs/NEW_SESSION_PROMPT.md` 进入该工作流。

### 1. PUI 组件优先

- 页面、演示和复合组件必须优先使用现有 PUI 组件。
- 例如关闭操作使用 PUI Button + PUI Icon，弹窗操作使用 PUI Button，消息组件使用 PUI Icon。
- H5 镜像若要承载 PUI Button 的默认 Slot，必须通过共享 `buttonSample.defaultSlot` 组合，并默认进入完整 `pui-button-preview` 镜像合同，保留 Button 的尺寸、禁用、ARIA、主题与变体；不得只给原生 `button` 补一个 `pui-button` 类名。只有已审计的组件自身交互根才可显式退出该合同。Badge 等 Slot 子组件也必须调用共享 PUI 镜像助手。
- 原生复合组件已经组合 Cell、Badge、Button、Icon、Loading 等 PUI 子组件时，H5 必须调用对应共享镜像助手；例如 List 条目用 Cell、Footer 用 Button，ScrollArea 的演示滚动操作用 Button。组件自身的交互根（如 Collapse Trigger、Calendar 日期格、Rate 命中区）属于基础组件底层实现，可以使用平台原生交互节点，不得为了消除原生节点而额外嵌套 PUI Button、改变组件语义。
- Form 原生字段已经组合 PUI Input，Field/Label 的默认 Slot 演示也必须放入共享 `inputControlSample`；不得在 H5 演示层手写输入框。组合父级只负责标签、反馈、方向和 gap，不得给 Form 根或 Slot 容器补第二层 Surface，也不得穿透覆盖 Input 的尺寸、padding、圆角和外观。组件别名路由的输入事件必须通过 `previewIdFor(state.current)` 判定，避免可见输入变化但运行态未回写。
- Search、Stepper、Combobox 等原生 WXML 已组合 `pui-input` 的复合组件，H5 必须调用共享 `inputControlSample`，并通过 helper 传递 prefix、clear、maxlength、min/max/step、align、bordered、disabled/readonly 和事件标识。复合组件只能有一个可见 Surface：Search/Combobox 可由 Input field 承担表面，Stepper 由组件外壳承担，嵌入 Input 必须透明且不得形成双层 border/shadow/blur。适配路由事件同样必须经 `previewIdFor(state.current)`。
- 复合组件自身声明的默认 loading/error/empty 状态必须调用共享 `loadingComponent` / `emptySample`，不得在父组件中重复拼装 Spinner、Icon、标题或 Action。状态父容器负责唯一 Surface；嵌入式 Empty 仍保留 PUI Empty 的内容、间距、语义和子组件组合，但自身必须透明、无边框、无阴影、无毛玻璃、无圆角。消费者自定义 empty Slot 不得被默认状态助手覆盖。Upload 不声明整体 loading/error/empty：空列表就是添加入口，整体状态由消费者外部组合，单文件状态使用 Progress/Tag/Retry 闭环。
- H5 原生 `button/input/select/textarea` 只允许出现在共享 PUI helper 的平台根、组件自身交互根或浏览器能力桥接层；`preview/index.html`、页面、演示和复合层只能保留 Mount 并调用 helper。所有允许边界必须进入 `scripts/test-preview-native-control-boundaries.js` 的精确清单，新增或变更前先核对真实 WXML，禁止把页面手写控件加入清单逃避复用。
- 除基础组件自身的底层实现外，不得使用原生 button、临时图标字符或重复手写已有能力。
- 新组件必须可复用、可调用、可组合，不得只服务于单个演示页面。

### 2. PUI Token 强制使用

- padding、margin、gap、字号、行高、圆角、阴影和颜色必须使用现有 PUI Token 或标准布局类。
- 禁止无理由增加魔法数和页面私有间距。
- 现有 Token 无法表达需求时，应新增语义化 Token，并同步小程序端和 H5 预览端。
- 禁止引用未定义的 CSS Token；所有无 fallback 的 `var(--*)` 必须由 CSS 根或组件运行时 style/`setProperty` 提供，并通过全样式表扫描。外观开关验收必须检查代表组件的计算样式，不能只验证根节点 `data-*` 已切换。
- 同类结构必须使用同一套 Token，不能因页面不同产生视觉漂移。

### 3. 间距规则

- 所有面板和预览容器必须具备清晰、可读的内边距。
- 同一操作区域优先采用等距规则。
- 全局间距按语义使用 `36rpx` 分区、`28rpx` 面板/操作、`20rpx` 列表、`16rpx` 内容组合、`12rpx` 控件内部、`8rpx` 紧密信息；H5 按 `1px≈2rpx` 镜像。
- Header、Content、Footer 等主要分区共同使用 `--pui-section-gap`，默认 `36rpx / 18px`。
- `PreviewDevice` 外框只承担固定屏幕边界、主题、圆角和裁切，内部滚动 viewport 必须再挂统一父布局。普通组件使用 `shadow-safe`：基础 `--pui-preview-device-padding`（14px）与 `--pui-preview-shadow-bleed`（14px）合成 28px 安全内距，让组件阴影完整落在滚动裁切区内；屏幕附着和浮层组件使用显式 `edge-to-edge`（0px）布局。直接演示根固定消费 `--pui-preview-content-gap`（8px）且不得叠加首项 margin。透明组合根中的基础 Button 若后接不透明兄弟，必须使用 `pui-preview-elevation-clearance` 预留同一个 `--pui-preview-shadow-bleed`，并保持父级 overflow 可见；不得让后续 Cell/Surface 覆盖阴影。
- `.panel` 等纯分组根只有在透明、无边框、无 Surface 时才允许 `padding:0`；真正可见的元信息、属性控件、兼容项和代码面板必须分别保留 panel/spacious padding。站点 Header/Stage 的页面 gutter 使用独立 `--pui-site-*` 语义 Token，不能冒充组件面板内距。
- Dialog Footer 的左右、底部和按钮间距共同使用 `--pui-dialog-action-spacing`，默认 `28rpx / 14px`；Content→Footer 属于分区关系，使用 `--pui-dialog-section-spacing`。
- Dialog 关闭按钮尺寸为 `72rpx / 36px`；它属于 Header，不再使用独立的绝对定位 top/right。
- Dialog 不公开 `loading/error/empty/retry` 或 `header-left` 能力；业务状态必须在 `content` 具名 Slot 中组合 PUI Loading、Empty、Button 等已有组件，不能把父级请求状态伪装成 Dialog 自身状态。
- Dialog 按内容自然增高至视口上限，Header/Footer 固定可见且不收缩；只有 Content 可以 `min-height:0` 并内部滚动，任何状态不得越出 Dialog 或 PreviewDevice。
- 不允许通过多层容器弥补错误的间距结构。

### 4. 容器与信息层级

- 避免面板套面板、卡片套卡片。
- 每个容器必须有明确的布局、分组或交互作用，否则删除。
- 页面标题只出现一次，不得在 Header 和内容面板中重复。
- 删除无业务意义的状态块、数据块、说明文字和导航入口。
- 默认遵循 Less is more，克制使用边框、阴影和装饰性背景。
- 外阴影只表达脱离内容流的独立 Surface（如 Card、浮层或集合根）；Cell、Field、Empty、Result、Grid、Steps 以及 Avatar、Tag、Badge、Icon、Progress、Skeleton 等条目/布局根/展示叶子不得因全局阴影开关获得外投影。选中、焦点和分隔线可保留 inset outline，不得以外阴影替代状态边界。

### 5. 字体与可读性

- 禁止使用难以阅读的过小字号。
- 页面必须统一字体族、字号层级和行高。
- 小程序与 H5 必须消费同名 `--pui-font-*` / `--pui-line-height-*` Token；官网 CSS 禁止重新写死字号、行高、字重或另一套系统字体栈。H5 代码通过本地 WOFF2 以独立族名 `PoemUI JetBrains Mono` 自托管 JetBrains Mono，并由 `--pui-font-family-mono` 消费；小程序端保留 Menlo / Consolas 系统回退且不得把官网字体塞进安装包。源码阅读区关闭字体连字并使用 Body Medium `14px / 20px`；内层 `code` 必须 `font-family:inherit`，浏览器验收必须读取 `pre`、`code` 和实际语法节点三层计算字体。
- 辅助文字也必须满足基本可读性，不得以弱化信息为理由缩得过小。
- 所有页面必须在 390px 宽度下可阅读、可操作且不产生横向溢出。
- 单行省略统一使用 `pui-text-cut`；它只适用于允许省略的次要信息，禁止用来裁掉按钮、关键状态或掩盖布局错误。`pui-text-truncate` 仅作为兼容别名保留。

### 6. 预览组件

- 所有组件演示必须放入统一、稳定的 PUI 预览容器。
- 标准组件概览必须统一使用 `PreviewDevice`：桌面按所选机型宽度、全端固定 `622px` 高度，窄屏只允许宽度收缩；设备面板必须始终保留主题底色、边框、圆角和裁切，组件不得建立 `height:auto` 或透明外壳例外。所有组件的预览根必须填满设备内部 viewport：普通 `shadow-safe` 根填满扣除四向安全内距后的可用高度，屏幕附着 `edge-to-edge` 根填满完整 viewport。
- `PreviewDevice` 必须直接挂载到概览 Stage，不得再套可见 `preview-canvas` 面板；标准深色屏幕底色读取 `--page = #09090b`，浅色读取 `--page = #fafafa`。禁止使用 `phone--dark` 等组件私有靛蓝/蓝灰调色板覆盖全局中性色主题。
- 设备底只表达屏幕背景；只有真实组件本体、遮罩、弹层和有分组职责的 Surface 可以不透明。纯布局用途的 stage、canvas、host、frame、viewport 必须透明、无边框和阴影，不得形成“容器套容器”的第二层底色。
- Dialog、Popup、Sheet、Popover、ActionSheet、DropdownMenu、Overlay，以及 Navbar、Tabbar、Toast 等屏幕附着组件必须使用统一 `edge-to-edge` 父布局；浮层遮罩覆盖完整 PreviewDevice viewport，禁止用只覆盖组件附近的局部色块模拟全屏遮罩。
- 普通组件预览必须使用统一 `shadow-safe` 父布局，固定由 14px 基础内距 + 14px 阴影外扩区组成 28px 四向安全内距；不得把 padding 写在滚动 viewport 外，也不得由组件页面增加私有 margin。这个安全区在阴影开关关闭时仍保留，避免外观切换改变组件布局。直接 Showcase 只使用 8px content gap。
- `PreviewDevice` 只有内部 viewport 可以滚动，外框尺寸不得随内容或交互变化；滚动条空闲时隐藏，只在真实滚动期间显示，停止滚动后自动收起。
- 目录内每个标准组件的“概览”必须落入同一个带 `data-preview-scroll` 的 `PreviewDevice` 内部 viewport；不得为单个路由旁路为页面滚动或私有容器。文档页、未发布的 Chart 说明与 Icon 资源库是明确的非设备视图例外，不能伪装为组件预览。
- 用户点击、打开弹窗或切换状态时，不得导致预览容器持续自动增长。
- Dialog、Popup、Dropdown、Popover 等浮层必须被限制在预览舞台中。
- 预览容器需要定义明确的最小高度、最大边界、溢出和滚动策略。
- 修复预览问题时必须检查同类组件，不能只针对当前截图打补丁。
- H5 镜像不得改变 PUI 子组件的尺寸、padding、圆角和对齐语义；Tag 等内联组件不能被 Slot 布局无意拉伸成整行。
- 默认预览只展示用户能理解的真实入口、组件本体和必要结果；`open()`、`close()`、事件链、受控状态和布局枚举等工程诊断必须放入 API 或属性，不得堆在组件下方冒充内容卡。
- 标准组件概览必须在进入实时 DOM 前执行 `component-only` 归一化：删除 showcase label、方法/事件/runtime/platform/meta 面板、直接状态 Cell 与事件反馈，不得仅用 CSS 隐藏；Slot、H5、WXML、原始值等实现术语应转换为用户文案。归一化后必须仍保留组件本体、至少一个真实触发入口和可见交互结果，Chart、Typography 等明确的文档型页面不伪装成手机组件预览。
- 浮层隐藏时必须显示真实触发入口，不能留下空的黑底或遮罩舞台；显隐前后继续复用同一个功能性 `PreviewDevice`，不得在其内部再套装饰性手机面板，禁止持续增长。
- 每个标准组件页必须复用 PUI Tabs，固定为 `概览 / API / 属性`：概览只放预览，API 只放 API Reference，属性完整承接元信息、Props、WXML 和 H5 兼容说明；内部路由状态可继续使用 `prop`，但用户界面不得显示 `PROP`。
- 官网标准页的三项分类必须逐项调用共享 `buttonSample`，刷新/重置必须调用 `iconButtonSample`；手写原生 `button` 再补 `pui-*` 类名不算复用。状态同步只能更新属性与 Slot 内容，不得用 `innerHTML` 破坏 Button + Icon 组合树。
- 官网搜索、机型等基础设施表单必须分别调用共享 `inputControlSample`、`selectControlSample`；原生 `input/select` 只允许作为 helper 内的平台控件，禁止在 `index.html` 静态手写另一套外观、Icon 或状态。搜索只索引用户可理解的组件名与分类，不暴露 `done`、成熟度等开发状态。
- 共享 PUI Select 的可见 Trigger、Option 和 Menu 必须由 PUI Button + PUI Icon 与主题 Surface Token 组合；原生 select 只能作为 `pui-sr-only`、`aria-hidden` 的值/事件桥接层，不能把浏览器或系统下拉菜单当作官网最终 UI。机型选择、属性枚举与上下文 Inspector 必须复用同一实现，支持 Enter/Space、方向键、Home/End、Esc、焦点恢复和真实 `input/change` 回写。
- 全站菜单、浮层和浏览器原生桥接控件必须同时验证深浅色：可见 Surface 使用 `--surface/--surface-solid`、文字使用 `--text/--muted`、边界使用 `--border*`；App Shell 必须声明 light/dark `color-scheme`，原生 input/select/textarea/option 继承它。禁止只给触发按钮换色、让展开层仍使用固定浅色或系统不确定配色。
- 左侧组件搜索与 Icon 资源搜索都属于同一站点 Input 合同：必须调用 `inputControlSample` 并通过 `prefixIcon` 组合 PUI Icon。实时筛选导致内容重绘时必须恢复输入焦点和光标，不得退回页面私有 `.search/.icon-search` 表单皮肤。
- 属性工作区是标准组件页的一部分，不得因其属于调试配置而绕过 PUI。文本、枚举、布尔、数值范围和 JSON 字段必须分别调用共享 Input、Select、Switch、Slider、Textarea helper；原生表单节点只作为 helper 内的平台控件。字段回写后必须恢复焦点，非法 JSON/数值保留上次有效 Props、设置 `aria-invalid` 并显示真实错误边界。
- Tabs 是一级页面分类，必须独占 Header 中唯一一行。概览的模式切换、机型选择、刷新、重置和复制统一进入 PreviewDevice 上方的透明工具栏：模式切换在左，机型、刷新、重置和复制组成一组居右对齐，复制必须是最右侧 PUI IconButton；工具栏不得建立背景、边框、阴影或毛玻璃 Surface。工具栏顶部内距固定消费 `--pui-preview-content-gap`（8px），并计入桌面与移动语义高度，禁止用外层空容器或魔法数补位。390px 下右侧工具组允许换到下一行，但仍须右对齐。刷新保留当前 Props，只恢复默认运行态；重置恢复组件默认 Props 与默认运行态；复制当前组件效果代码时必须复用 PROP 的 WXML 生成器，只输出非默认 Props，并用注释说明当前视觉环境与临时运行态不进入复制代码。API 不显示无关操作，PROP 只在 Props 标题区提供同源重置和完整 WXML。
- 组件重置不得改变深浅色、边框、阴影、毛玻璃、大圆角、渐变背景、机型或其他站点级偏好；重置后 WXML、完整属性与上下文 Inspector 必须读取同一个默认 Prop 源。
- API 必须完整展示组件真实存在的 Props、Events、Slots 与 Methods；某类不存在时不伪造空能力。参数列表正文不得低于 `--pui-font-size-body-medium`；固定按“参数、类型、演示初值、可选值、说明”展示。可选值位于演示初值右侧，枚举和布尔值用逗号分隔，范围显示上下界与步长，无约束时显示 `—`，不得把枚举重复塞进类型列。Methods 必须完整展示方法名、返回值和说明。所有表头和单元格文字必须完整展示，允许自然换行和窄屏纵向重排，禁止 `ellipsis`、`text-overflow`、`text-cut`、单行 `nowrap` 或固定高度裁切。
- 标准组件页的 Tabs 行使用固定语义高度；桌面 Header 必须使用标题说明与固定导航列顶对齐的 Grid，不得用垂直居中让 Tabs 受两侧内容高度影响。概览透明工具栏使用独立语义高度，不参与 Header 或 Tabs 几何；进入 API/属性时可整体退出，因为它属于内容视图而非一级分类占位。Tabs DOM 必须跨视图稳定复用，不能因切换内容整段销毁重建；切换 `概览 / API / 属性` 或更换组件页时，Tabs 的 top、left、width、height 必须保持一致，禁止用 `window.scrollBy` 或测量后补偿掩盖结构位移。页面 Tabs 固定使用三等分 Grid，选中块只允许用 `transform` 在固定轨道间移动；不得同时动画 `left/width`、读取元素宽度或重建节点。动效使用 `--pui-duration-normal` / `--pui-ease-standard`，低动效为 `1ms`。
- 标准组件 Header 只保留唯一标题、一句用户用途短摘要与 Tabs；删除重复的分类 Kicker。短摘要必须在 metadata 中直接写短，不得用 `text-cut`、省略号或裁切掩盖冗长工程说明；Props、WXML、状态与兼容细节只进入 API/属性。页面 Tabs 只使用深浅色均清晰的高对比选中态与独立键盘焦点态，不提供视觉 Hover；Tabs Button 基础规则必须保持透明，不能继承通用 PUI Button Hover Surface。
- 常驻右侧 Inspector 及三列工作区已经废弃，禁止恢复或把完整 Props、元信息、WXML、兼容说明在 PROP 与侧栏复制两份；基础文档筛选以内联区段承接。
- 标准组件概览提供 `常规模式 / 元素选择模式`。常规模式保留所见即所得和真实组件交互；元素选择模式在捕获阶段接管 PreviewDevice 内的指针与 Enter/Space，只执行选中和高亮，不触发组件业务操作。设备空白区保持默认光标，可选择的语义元素使用 `pointer`，禁止使用像素拾取语义的 `crosshair`。
- 常规模式左侧必须是透明、可滚动的组件用法正文，并按自然文档流固定为“组件引用”小标题、`usingComponents` 代码块、“基础用法”小标题、当前 WXML 代码块；这不是 Tabs，也不是两张独立滚动卡片。唯一纵向滚动上下文属于正文，标题和代码块随正文共同滚动；代码块只负责必要的横向滚动、键盘焦点、行号和主题语法色。禁止增加“组件用法 / 当前效果 / 默认值已省略”等总 Header，也不得给正文根增加背景、边框、圆角、阴影、毛玻璃或 panel padding；代码内容仍使用 PUI code Surface、border、radius、mono/body-small/line-height Token。每个代码段必须通过共享 `previewCodeBlockSample` 组合 `iconButtonSample` Copy 操作，分别复制当前引用 JSON 或基础 WXML，并按真实剪贴板结果显示 Check/ErrorCircle 与 `aria-live`；禁止手写原生按钮或伪成功。两区与工具栏复制必须共同调用 `makeUsageCode` 真相源并过滤组件默认 Props，禁止维护第二份 WXML 或引用拼接逻辑；可见区不显示注释，工具栏复制仍可附带视觉环境和运行态注释。基础代码开始标签以 `80` 字符为软上限、每行最多 3 个属性成组换行，不得把每个 Prop 或 `bind:*` 机械拆成一行，也不得用超小字号塞入长行。桌面常规模式必须把 PreviewDevice 右移并对齐 Stage 右侧 gutter，正文从左侧 gutter 撑满到设备前，仅保留共享 14px offset，且高度与 PreviewDevice 共同读取 `--pui-preview-device-height`。窄于 `1180px` 时改为左下方满可用宽度的 240px 有界正文。切换到元素选择模式后正文退出，PreviewDevice 恢复居中并让位给双侧上下文 Inspector。模式切换必须保留同一个 PreviewDevice DOM 与组件运行态，只更新布局状态并用共享 normal duration/standard easing 平滑横移；禁止调用整段 Stage 重建制造跳变，系统低动效压缩为 `1ms`。
- 窄于 `1180px` 的常规模式代码正文必须退出绝对定位并进入 PreviewDevice 下方正常文档流；不得覆盖设备、浮层或拦截设备内交互。240px 只限制代码正文自身高度，不能缩短或遮住固定 622px PreviewDevice。
- 元素选择模式按需在 PreviewDevice 左右两侧同时浮出上下文 Inspector：左侧只承接可自由输入的内容值字段（`text/json/nullable-number`，使用 PUI Input/Textarea），右侧承接 Boolean、枚举、范围及其余设置（使用 PUI Switch/Select/Slider 等）。两侧只能展示当前元素能够由父组件公开 Props 控制的字段，并复用完整属性页的 PUI 表单 helper、校验和回写路径；组合子组件没有父级公开映射时显示对应真实空状态，不得伪造 Props。
- 双侧 Inspector 不参与 PreviewDevice 尺寸计算：桌面分别浮在设备左、右侧，两张卡片必须消费同一宽高 Token 并保持等高等宽；窄于 `1180px` 时以等宽双栏覆盖在预览底部，各自内部滚动，仍不得挤压设备。首次选中从设备两侧向外展开，关闭反向收回，切换元素轻量过渡；动效使用 `--pui-duration-normal` / `--pui-ease-standard`，系统低动效压缩为 `1ms`，字段输入回写不得重复播放入场动画。关闭、退出选择模式、切换组件或进入 API/属性时必须清除选中态。完整属性始终只存在于属性视图。
- WXML 示例不输出与组件默认值相同的 Props，只展示调用者真实改动。

### 7. 图标按钮

- Close、More、Search 等纯图标操作必须使用 PUI 图标按钮。
- 图标必须在按钮内水平、垂直精确居中。
- 图标按钮必须提供可访问名称。
- 圆形图标按钮在大圆角、阴影、毛玻璃和深浅色模式下必须保持圆形。
- H5 预览的纯图标操作必须复用统一 `iconButtonSample`（PUI Button + PUI Icon 镜像），不得在组件演示中手写私有原生 `button`；空文字节点不得占据 gap。
- Dialog Header 固定使用左右等宽的三列 Grid：左列是保留的平衡轨道，中间承载 `title` Slot 或标题文本，右侧为可选 Close；无左侧 Slot 时仍保留空轨道，保证标题几何居中。

### 8. 外观设置与持久化

- 深浅色、边框、大圆角、毛玻璃、阴影和渐变背景必须使用 PUI Switch 控制。
- 安装端需要跨页面统一组件视觉时，必须使用 npm 入口公开的 `visualConfig` Store，并在每个页面根挂载 `<pui-config-provider use-global-config>`。小程序没有覆盖整个 App 的单一 WXML 根，禁止声称只在 `app.js` 配置一次即可自动包裹所有页面。
- `visualConfig` 的公共字段固定为 `theme / effectsEnabled / shadow / frostedGlass / largeRadius / bordered / equalSpacing`；`restore / set / applyPreset / setEffectsEnabled / reset / subscribe` 是唯一共享写入与订阅路径。业务不得复制第二份全局对象或直接写 Provider 内部 class。
- `effectsEnabled=false` 只暂停阴影、毛玻璃和大圆角，不能覆盖主题或组件边框；重新开启后恢复此前保存的单项值。`bordered=false` 只透明化中性边界并保留盒模型、焦点、错误、选中和危险状态边界。
- 官网右上角的详细外观入口只保留一个“外观”PUI IconButton（`iconButtonSample + palette Icon`），点击后在同一个非模态外观菜单中承载六项设置；不得把六个详细 Switch 重新平铺回 Topbar。IconButton 左侧允许一个“一键果味”PUI Switch 作为复合预设：开启固定写入 `shadow=on / frost=on / radius=large / border=off / gradient=off`，主题保持不变；关闭恢复标准组合 `shadow=on / frost=off / radius=large / border=off / gradient=off`。果味 checked 必须由五项当前值实时推导，禁止单独存储；任一项偏离果味组合时立即自动关闭。菜单内六项与果味入口都必须由共享 `switchPreviewMarkup` 挂载，静态 HTML 只保留 `previewPreferenceControls` Mount，不得复制 Button、Icon 或 Switch 的 track/thumb/platform DOM。菜单必须支持 `aria-expanded/controls`、打开后聚焦首个 Switch、Esc 恢复入口焦点、点击外部关闭、低动效和 390px 边界。
- 渐变背景只作用于全局页面画布、Preview Stage 和 PreviewDevice 背景，不得给组件增加第二层 Surface，不得改变间距、尺寸、圆角或定位。浅色使用黑灰中性渐变，深色必须保持 `#09090b` 基底并只使用白灰中性微光，禁止重新引入靛蓝/蓝灰主题。
- 边框总开关默认关闭，且只作用于 `PreviewDevice` 内真实 PUI 组件树；关闭时只透明化组件的中性 Surface 边界，不得影响 Divider、PreviewDevice 外框、API、属性、导航、工具栏或文档面板。Divider 表达内容层级，不是可移除的 Surface 边框；焦点、错误、选中、危险操作等状态边界继续保留，尺寸与布局不变。显式 `pui-border-solid` 只设置线型，仍需和边框宽度、颜色工具类组合。
- 所有外观选项必须保存到本地存储，并在页面初始化时恢复。
- 不允许刷新后丢失用户选择。
- 外观模式不得破坏组件尺寸、布局和可读性。
- 大圆角必须重映射 `small/medium/large/xlarge/xxlarge` 全部语义圆角 Token，不能只改变页面容器；Tag 等组件跟随对应语义 Token，显式 `round/circle` 保持满圆。

### 9. 导航规范

- 顶部导航只保留真实有效的入口。
- 版本号放在 PoemUI 名称之后。
- 左侧导航使用用户可理解的中文组件名，不显示 done 等开发状态。
- 左侧目录固定按用户任务分为“开始与规范、基础组件、布局、导航、表单组件、数据展示、反馈、浮层、高级”；每个入口只能属于一个分区，禁止退回单一 Components 大组或按交付状态分组。表单组件内按“结构与校验、文本与搜索、选择与数值”展示，日期、时间和附件选择统一进入选择与数值；子分区只能整理可见目录，不能复制路由或另建 API。
- 官网必须提供 `Ctrl/⌘ + K` 全局快速搜索。命令弹窗必须组合 PUI Input、Button、Icon，支持中文名、英文名和分类检索，以及 ArrowUp/ArrowDown、Enter、Esc、Tab 焦点闭环；不得把开发状态作为搜索语料。
- 废弃页面及无意义搜索数据块应直接删除，不保留空壳入口。

### 10. 修改闭环

每次重要 UI 修改必须：

1. 检查是否已有 PUI 组件和 Token。
2. 同步小程序端与 H5 预览端。
3. 更新相关设计规范文档。
4. 为关键布局增加契约测试。
5. 在反馈记录中登记问题、原因、决策和验证结果。
6. 验证 390px、深浅色和相关外观模式。
7. 运行完整构建、组件测试、设计规范检查和打包检查。

任何无法满足上述规则的实现，必须说明原因，不得静默绕过。

## Component Feedback Ledger（强制）

Feedback Ledger 是 PoemUI 关于真实问题、设计决策、兼容风险和 AI 使用规则的唯一结构化事实源。`docs/COMPONENT_DEVELOPMENT_PROGRESS.md` 继续记录交付时间线，但不能替代 Ledger。

所有 agent 必须执行以下流程：

1. 开始组件或全局 UI 工作前，先完整阅读 `docs/COMPONENT_FEEDBACK.md`。
2. 查询当前范围的历史记录：`npm run feedback:list -- --component <component-id>`；全局工作同时运行 `npm run feedback:list -- --scope global`。命中记录后必须阅读 `feedback/records/` 中对应原始 JSON，不能只看生成摘要。
3. 审计或真实 battle 中发现可复现问题、能力缺口、API/预览差异、兼容风险、设计取舍或 AI 易误用点时，必须新增或更新一条结构化记录。不要为凑数量记录猜测、无证据意见或一次性过程噪音。
4. 一条记录只描述一个可独立决策的问题。必须写明用户目标、复现、期望/实际、证据、根因或待确认项、决定、影响范围、验证和可复用 AI 规则。
5. 修复完成只能把 `status` 设为 `resolved`；默认没有用户明确确认时，battle 记录的 `acceptance` 必须保持 `pending-user`。若用户对当前 Goal 明确授予“后续组件无需逐项确认、由 agent 按完整证据自主验收”的范围化授权，agent 可在该范围内完成全部审计、真实浏览器、专项测试、文档与构建门禁后标记 `accepted`，并必须在 Ledger 记录该授权及验收证据；不得因 metadata done 或局部测试自行通过。`resolved` 本身仍不等于 `battle-passed`。
6. 真实问题必须有证据引用；已解决问题必须关联专项测试或验证命令。真机未确认的风险要保留在 `verification.deviceRisks`，不能因 H5 或构建通过而删除。
7. 修改记录后运行 `npm run feedback:generate` 和 `npm run feedback:check`。不要手工编辑生成文件 `docs/COMPONENT_FEEDBACK_LEDGER.md`。
8. 最终报告要说明新增/更新了哪些 Ledger ID；若没有产生值得沉淀的新事实，明确说明没有新增，不得伪造记录。

## 组件 battle 约束

- `docs/TDESIGN_COMPONENT_ALIGNMENT.md` 是共有组件 TDesign 对照治理的唯一执行清单。处理清单内组件前必须完整阅读，并记录实际参考的 TDesign 版本、文档与源码；参考不等于照搬，所有 API 取舍仍以 PoemUI 真实用户目标和实现闭环为准。
- 每次进入 TDesign 共有组件 battle 前，必须联网访问该组件的 TDesign 官方页面与官方仓库或 NPM 发布页，并在组件合同、Ledger 与对照摘要记录 URL、查询日期、固定版本和实际读取的包内源码文件。在线页面用于产品信息，固定包源码用于可复现 API；两者不一致、页面动态不可抓取或版本漂移时必须明确写出差异，禁止只凭本地快照、metadata 或模型记忆设计。
- 共有组件必须按清单一次处理一个。Button 已确立全局演示基线：基础用法使用最小可用 WXML、不得出现任何 `bind:*`；完整事件只进入 API Events，只有事件专项示例绑定当前能力必需的事件。
- 一次只聚焦一个组件。默认完成并由用户确认后才能进入下一个；若用户已对当前 Goal 明确授权自主连续验收，则由 agent 在当前组件全部门禁和 Ledger 收口后自行作出接受/不接受决定，再按执行清单进入下一项，仍禁止并行批量扫组件或跳过单组件证据。
- 不相信 metadata 的 `done` 就直接宣布完成；必须检查真实源码、依赖、预览、Props、WXML、文档、示例和安装产物。
- H5 必须对应真实 WXML/WXSS 能力，不能使用假事件、静态占位或只更新提示文字的伪交互。
- 交互动效默认 `500ms`，公开可调范围为 `0–1000ms`；低动效统一压缩为 `1ms`。功能计时不属于动效时长。不得对 `height:auto` 做无效 transition，不使用 `display:none` 制造瞬移。
- 390px、light/dark、边框、阴影、毛玻璃、大圆角、渐变背景、低动效和真实事件顺序均按组件能力验收。
- 涉及产物时检查源码、`miniprogram_dist`、示例安装、npm tarball 和微信 `miniprogram_npm` 一致性。
