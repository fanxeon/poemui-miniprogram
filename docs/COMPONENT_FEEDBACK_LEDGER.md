# PoemUI Component Feedback Ledger

> 本文件由 `feedback/records/*.json` 自动生成，请勿手工编辑。工作流见 `docs/COMPONENT_FEEDBACK.md`。

当前 437 条记录，数据更新至 2026-07-27：open 0、investigating 1、planned 0、needs-device 1、resolved 434；pending-user 249、accepted 181。

| ID | 范围 | 类型 | 严重度 | 状态 | 验收 | 问题 |
| --- | --- | --- | --- | --- | --- | --- |
| PUI-FB-0001 | style-utilities, config-provider | capability-gap | high | resolved | pending-user | Style Utilities 缺少显式深色条件变体 |
| PUI-FB-0002 | style-utilities | preview-parity | high | resolved | pending-user | Style Utilities 分类与实时预览没有形成真实浏览链路 |
| PUI-FB-0003 | preview-site, style-utilities | visual-layout | medium | resolved | pending-user | 官网左右导航栏滚动时没有稳定撑满可视高度 |
| PUI-FB-0004 | dialog | design-decision | medium | resolved | pending-user | Dialog 分区间距与 Footer 区内间距缺少层级 |
| PUI-FB-0005 | preview-site, switch, config-provider | design-decision | medium | resolved | pending-user | 官网五项视觉偏好统一组件化、持久化与主题边界 |
| PUI-FB-0006 | dialog, button, icon | visual-layout | medium | resolved | accepted | Dialog Close 必须属于平衡 Header，而非绝对定位浮层 |
| PUI-FB-0007 | preview-site, style-utilities, dialog | design-decision | medium | resolved | pending-user | 全局 UI 缺少可执行的语义间距层级 |
| PUI-FB-0008 | tag, dialog, preview-site | preview-parity | medium | resolved | pending-user | H5 Tag 被拉伸且文字未居中 |
| PUI-FB-0009 | dialog, preview-site | preview-parity | medium | resolved | pending-user | H5 Dialog 通配直接子节点规则覆盖语义分区 |
| PUI-FB-0010 | preview-site, tag, config-provider | preview-parity | medium | resolved | pending-user | H5 全局大圆角未传递到组件语义圆角 |
| PUI-FB-0011 | dialog, preview-site, button, icon | visual-layout | medium | resolved | pending-user | Dialog 默认预览堆叠工程诊断面板并留下空黑舞台 |
| PUI-FB-0012 | style-utilities, typography, preview-site | capability-gap | low | resolved | pending-user | Style Utilities 缺少统一的 text-cut 单行省略入口 |
| PUI-FB-0013 | preview-site, tabs | design-decision | high | resolved | pending-user | 标准组件页缺少概览 API PROP 信息架构 |
| PUI-FB-0014 | preview-site, dialog | visual-layout | medium | resolved | pending-user | 组件预览缺少统一固定设备面板与空闲滚动条策略 |
| PUI-FB-0015 | preview-site, button, input, select, switch, slider, textarea, cell, icon, badge, tag, bubble, grid, list, scroll-area, navigation-menu, virtual-list, indexes, sidebar, collapse, collapsible, swipe-cell, tabs, tabbar, steps, action-sheet, dropdown-menu, popup, sheet, popover, breadcrumb, radio, table, swiper, empty, alert, combobox, calendar, 旧输入组合层, form, field, upload, search, stepper | preview-parity | medium | resolved | pending-user | H5 组合层绕过 PUI 子组件镜像 |
| PUI-FB-0016 | preview-site, calendar, dialog, combobox, action-sheet, upload, table, documentation | preview-parity | medium | resolved | pending-user | H5 组件引用未定义视觉 Token 导致样式静默失效 |
| PUI-FB-0017 | preview-site, typography, style-utilities, dialog, tabs | preview-parity | medium | resolved | pending-user | H5 官网字体指标绕过 PUI Typography Token |
| PUI-FB-0018 | preview-site, dialog, popup, sheet, popover, action-sheet, dropdown-menu, overlay | visual-layout | high | resolved | pending-user | 标准组件概览混入工程诊断与重复标签 |
| PUI-FB-0019 | preview-site, input, button, icon, dialog | design-decision | medium | resolved | pending-user | 官网左侧目录缺少任务分类与全局快速抵达 |
| PUI-FB-0020 | preview-site, button, input, select, switch, slider, textarea, icon, dialog | capability-gap | medium | resolved | pending-user | 官网预览缺少元素选择与上下文 Props 编辑模式 |
| PUI-FB-0021 | preview-site, button, icon, tabs | capability-gap | medium | resolved | pending-user | 概览缺少恢复组件默认样式的独立重置动作 |
| PUI-FB-0022 | preview-site, tabs, button, icon, select | visual-layout | medium | resolved | pending-user | 预览模式与设备操作分散且工具栏层级过重 |
| PUI-FB-0023 | preview-site, switch, config-provider, style-utilities | capability-gap | medium | resolved | pending-user | 官网缺少全局边框开关且实线工具类不可发现 |
| PUI-FB-0024 | preview-site | visual-layout | medium | resolved | pending-user | API 参数列表字号过小且缺少可选值列 |
| PUI-FB-0025 | config-provider, design-tokens | capability-gap | high | resolved | accepted | 安装端缺少跨页面统一组件主视觉的公共配置入口 |
| PUI-FB-0026 | preview-site, tabs | visual-layout | medium | resolved | pending-user | 组件页 Header 信息冗余且 Tabs 选中态过弱 |
| PUI-FB-0027 | dialog, loading, empty, popup | api-contract | high | resolved | accepted | Dialog 不再把 loading/error/retry 伪装为根级公开状态 |
| PUI-FB-0028 | preview-site, button, icon, config-provider | capability-gap | medium | resolved | pending-user | 概览工具栏缺少按当前效果复制代码的入口 |
| PUI-FB-0029 | preview-site, tabs | visual-layout | medium | resolved | pending-user | 页面 Tabs 动画不稳定且 PROP 文案过度工程化 |
| PUI-FB-0030 | preview-site, tabs | design-decision | medium | resolved | pending-user | 标准页 Tabs 不使用视觉 Hover |
| PUI-FB-0031 | preview-site, button, icon, switch | design-decision | medium | resolved | pending-user | 顶栏六项外观开关收纳为单一外观菜单 |
| PUI-FB-0032 | preview-site, switch, config-provider | design-decision | medium | resolved | pending-user | 顶栏增加一键果味复合外观预设 |
| PUI-FB-0033 | preview-site, config-provider | capability-gap | medium | resolved | pending-user | 常规预览组件用法层级与容器过重 |
| PUI-FB-0034 | preview-site, select, config-provider | compatibility | high | resolved | pending-user | 官网共享下拉菜单与浮层缺少完整深浅色合同 |
| PUI-FB-0035 | dialog, documentation | ai-usability | medium | resolved | pending-user | Dialog 规则缺少独立组件语义合同 |
| PUI-FB-0036 | dialog, button, h5-preview | design-decision | medium | resolved | pending-user | Dialog 默认取消操作不应使用线框按钮 |
| PUI-FB-0037 | documentation, agent-workflow, all-components | ai-usability | high | resolved | pending-user | 每个组件都需要可执行的专属语义合同 |
| PUI-FB-0038 | preview-site, preview-device, all-components | visual-layout | high | resolved | pending-user | 预览父布局把组件阴影裁切在滚动视口边缘 |
| PUI-FB-0041 | all-components, documentation, agent-workflow | design-decision | high | resolved | accepted | 共有组件缺少统一的 TDesign 对照治理流程 |
| PUI-FB-0042 | button, loading, icon | api-contract | high | resolved | accepted | Button 公开 API 暴露重复与组件私有配置 |
| PUI-FB-0043 | button, preview-site, documentation | ai-usability | high | resolved | accepted | Button 基础用法堆叠全部平台事件绑定 |
| PUI-FB-0044 | button, preview-site | visual-layout | medium | resolved | accepted | Button H5 镜像的 block 被父级自动宽度吞掉 |
| PUI-FB-0045 | button, loading, preview-site | accessibility | medium | resolved | accepted | Button H5 加载态未使用默认 Slot 生成可访问名称 |
| PUI-FB-0046 | preview-site, documentation, all-components | accessibility | high | resolved | accepted | API 表格使用省略号隐藏关键文字 |
| PUI-FB-0047 | button, preview-site, documentation | preview-parity | high | resolved | accepted | Button 属性页兼容说明仍展示已删除的主题与 dashed 变体 |
| PUI-FB-0048 | button, preview-site | visual-layout | medium | resolved | accepted | Button 预览分区标题上间距不足 |
| PUI-FB-0049 | preview-site, button, icon | capability-gap | medium | resolved | accepted | 官网左侧代码段缺少就近复制操作 |
| PUI-FB-0050 | config-provider, visual-config | preview-parity | high | resolved | accepted | ConfigProvider 基础示例混入高级 Store 且 H5 未执行全局优先级 |
| PUI-FB-0051 | icon, button | api-contract | high | resolved | accepted | Icon 作为展示叶子却暴露 click 与 disabled 伪交互 |
| PUI-FB-0052 | icon, preview-site | preview-parity | high | resolved | accepted | Icon 图片源着色镜像被说明文字样式覆盖 |
| PUI-FB-0053 | icon, preview-site, button | visual-layout | medium | resolved | accepted | Icon 独立资源页隐藏复制并泄漏无效选择模式 |
| PUI-FB-0054 | divider, preview-site | bug | medium | resolved | accepted | Divider 默认无内容横线被根节点间距截断 |
| PUI-FB-0055 | divider, preview-site, documentation | preview-parity | medium | resolved | accepted | Divider 概览混入工程状态且 API 与兼容说明缺少真实边界 |
| PUI-FB-0056 | cell, navigation-menu, documentation | api-contract | high | resolved | accepted | Cell 顶层 API 重复透传子组件能力并公开多条写入通道 |
| PUI-FB-0057 | cell, preview-site, documentation, example | preview-parity | high | resolved | accepted | Cell 概览以工程诊断代替用户用法且 API 缺少 Events 和 Slots |
| PUI-FB-0058 | cell, preview-site | bug | medium | resolved | accepted | Cell 当前 WXML 把空字符串 title 回退成演示文案 |
| PUI-FB-0059 | cell, preview-site | bug | medium | resolved | accepted | Cell H5 图片 error 的 hidden 被 display block 覆盖 |
| PUI-FB-0060 | badge, grid, radio, navigation-menu, documentation | api-contract | high | resolved | accepted | Badge 纯展示职责被 27 Props 和 5 Events 过度扩张 |
| PUI-FB-0061 | badge, preview-site, documentation, example | preview-parity | high | resolved | accepted | Badge 官网仍展示旧生命周期说明且重置未回到源码默认值 |
| PUI-FB-0062 | avatar, documentation, example | api-contract | high | resolved | accepted | Avatar 展示叶子被点击、禁用、别名和私有动效参数过度扩张 |
| PUI-FB-0063 | avatar, preview-site, documentation | preview-parity | high | resolved | accepted | Avatar H5 尺寸、失败完成态和全局外观与原生合同不一致 |
| PUI-FB-0064 | image, documentation, example | api-contract | high | resolved | accepted | Image 把展示资源、宿主交互和私有动效混成过量公开 API |
| PUI-FB-0065 | image, preview-site, documentation | preview-parity | high | resolved | accepted | Image H5 lazy、源码默认重置与真实资源状态未完整对齐 |
| PUI-FB-0066 | tag, documentation, example | api-contract | high | resolved | accepted | Tag 把形状别名和根点击混入展示叶子公开合同 |
| PUI-FB-0067 | tag, preview-site, documentation | preview-parity | high | resolved | accepted | Tag H5 默认值、安全宽度和元素选择入口未完整对齐 |
| PUI-FB-0068 | grid, documentation, example | api-contract | high | resolved | accepted | Grid 顶层外观与 footer 能力掩盖入口和状态主合同 |
| PUI-FB-0069 | grid, preview-site, documentation | preview-parity | high | resolved | accepted | Grid H5 默认代码、间距、事件和状态动画与原生不一致 |
| PUI-FB-0070 | count-down, documentation, example | api-contract | high | resolved | accepted | CountDown 兼容别名、可变动效与生命周期事件扩张核心计时合同 |
| PUI-FB-0071 | count-down, preview-site, documentation | preview-parity | high | resolved | accepted | CountDown 官网默认代码、重置、Methods 与真实运行态不一致 |
| PUI-FB-0072 | table, shadcn-data-table, documentation, example | api-contract | high | resolved | accepted | Table 重复布局入口、选择事件与滚动别名扩张核心数据合同 |
| PUI-FB-0073 | table, preview-site, documentation | preview-parity | high | resolved | accepted | Table 官网分区宽度、边线属性与动效被全站样式覆盖 |
| PUI-FB-0074 | swiper, shadcn-swiper, documentation, example | api-contract | high | resolved | accepted | Swiper 字段别名、分页开关与自由 Slot 扩张原生 swiper 合同 |
| PUI-FB-0075 | swiper, preview-site, documentation | preview-parity | high | resolved | accepted | Swiper 官网箭头文字、图片事件重放与代码分行偏离真实组件 |
| PUI-FB-0076 | dialog, build-tooling, example | compatibility | medium | resolved | pending-user | 全库检查被缺失的可选微信安装产物无条件阻断 |
| PUI-FB-0077 | collapse, documentation, example | api-contract | high | resolved | accepted | Collapse 字符串化值、重复事件与自由区域扩张多面板合同 |
| PUI-FB-0078 | collapse, preview-site, documentation | preview-parity | high | resolved | accepted | Collapse 官网未分区、基础代码缺数据入口且事件诊断偏离新合同 |
| PUI-FB-0079 | input, documentation, example | api-contract | high | resolved | accepted | Input 公开合同被键盘别名、重复事件和调试方法扩张 |
| PUI-FB-0080 | input, preview-site, documentation | preview-parity | high | resolved | accepted | Input 官网旧诊断演示、焦点恢复与双层 Surface 偏离真实输入 |
| PUI-FB-0081 | preview-site, props-workspace, documentation | bug | medium | resolved | accepted | 属性分组在任一 Prop 回写后被工作区重建折叠 |
| PUI-FB-0082 | field, form, documentation, example | api-contract | high | resolved | accepted | Field 旧 disabled 伪能力与状态别名扩张公开合同 |
| PUI-FB-0083 | field, preview-site, documentation | preview-parity | high | resolved | accepted | Field 官网分区噪音与预览重建使状态颜色直接跳变 |
| PUI-FB-0084 | textarea, documentation, example, npm-dist | api-contract | high | resolved | accepted | Textarea 旧 44 Props 与重复事件方法扩张公开合同 |
| PUI-FB-0085 | textarea, preview-site, documentation | preview-parity | high | resolved | accepted | Textarea 官网仍复制旧合同且焦点与状态镜像不真实 |
| PUI-FB-0086 | switch, documentation, example, npm-dist | api-contract | high | resolved | accepted | Switch 旧 28 Props 与多入口事件方法扩张公开合同 |
| PUI-FB-0087 | switch, cell, preview-site, example | bug | high | resolved | accepted | Switch 概览放入 Cell value 后点击命中父级而非开关 |
| PUI-FB-0088 | switch, preview-site, motion | preview-parity | high | resolved | accepted | Switch H5 重建与缺失缓动变量导致动画直接完成 |
| PUI-FB-0089 | switch, preview-site, documentation | visual-layout | medium | resolved | accepted | Switch 四个演示分区标题仅有 8px 间隔 |
| PUI-FB-0090 | checkbox, documentation, example, npm-dist | api-contract | high | resolved | accepted | Checkbox 旧多值别名与重复事件方法扩张公开合同 |
| PUI-FB-0091 | checkbox, checkbox-group, preview-site, example, npm-dist | capability-gap | high | resolved | accepted | CheckboxGroup 缺少真实父子状态与发布入口 |
| PUI-FB-0092 | checkbox, checkbox-group, preview-site | bug | high | resolved | accepted | Checkbox H5 全选统计误把内容节点计为选项 |
| PUI-FB-0093 | checkbox, preview-site, motion | preview-parity | high | resolved | accepted | Checkbox H5 原生 indeterminate 点击后回滚半选态 |
| PUI-FB-0094 | radio, documentation, example, npm-dist | api-contract | high | resolved | accepted | Radio 旧双模式与重复事件方法扩张公开合同 |
| PUI-FB-0095 | radio, radio-group, example, npm-dist | capability-gap | high | resolved | accepted | Radio 缺少可安装的真实 RadioGroup 关系组件 |
| PUI-FB-0096 | radio, radio-group, preview-site | bug | high | resolved | accepted | Radio H5 独立状态示例复用 name 导致意外互斥 |
| PUI-FB-0097 | radio, radio-group, h5-preview | preview-parity | medium | resolved | accepted | Radio 原生 borderless 没有可移除的 Surface |
| PUI-FB-0098 | form, field, documentation, example, npm-dist | api-contract | high | resolved | accepted | Form 旧固定字段生成器混合数据、布局与操作职责 |
| PUI-FB-0099 | form, field, input, switch, radio, example | capability-gap | high | resolved | accepted | Form 缺少真实 Field 关系、集中规则和受控重置链路 |
| PUI-FB-0100 | form, preview-site, documentation, example | preview-parity | medium | resolved | accepted | Form H5 演示与复制代码沿用固定字段和诊断式反馈 |
| PUI-FB-0101 | picker, select, documentation, metadata, example | api-contract | high | resolved | accepted | Picker 公开合同退化为与 Select 重复的单值 options API |
| PUI-FB-0102 | picker, preview-site, documentation | preview-parity | high | resolved | accepted | Picker H5 退化为原生 select 且无法镜像滚轮交互 |
| PUI-FB-0103 | picker, preview-site | bug | medium | resolved | accepted | Picker Popup 声明 transition 但插入时已是完成态 |
| PUI-FB-0104 | picker, preview-site, config-provider | visual-layout | medium | resolved | accepted | Picker Popup 阴影和毛玻璃外观开关实际不生效 |
| PUI-FB-0105 | preview-site, all-components, picker | visual-layout | high | resolved | accepted | 窄屏常规模式代码正文覆盖 PreviewDevice 下半区 |
| PUI-FB-0106 | date-time-picker, picker, documentation, example | design-decision | high | resolved | accepted | DateTimePicker 旧版拆成两个原生选择器且公开合同过量 |
| PUI-FB-0107 | date-time-picker, picker, preview-site | preview-parity | high | resolved | accepted | DateTimePicker H5 使用 date/time input 无法镜像统一草稿与动态列 |
| PUI-FB-0108 | search, input | bug | critical | resolved | accepted | Search 监听了 PUI Input 不存在的 input 与 confirm 事件 |
| PUI-FB-0109 | search, preview-site | api-contract | high | resolved | accepted | Search 公开合同和 H5 演示混入重复事件与业务结果语义 |
| PUI-FB-0110 | stepper, input | bug | critical | resolved | accepted | Stepper 监听了 PUI Input 不存在的 input 事件 |
| PUI-FB-0111 | stepper, preview-site | api-contract | high | resolved | accepted | Stepper 公开合同混入重复事件、私有动效与误导 Slot |
| PUI-FB-0112 | stepper, preview-site | preview-parity | high | resolved | accepted | 全站视觉过渡覆盖 Stepper 固定动效生命周期 |
| PUI-FB-0113 | slider, preview-site | api-contract | high | resolved | accepted | Slider 公开合同混入重复事件、实例方法、Slot 与私有动效 |
| PUI-FB-0114 | slider, preview-site | preview-parity | high | resolved | accepted | Slider 官网缺少任务分区且 API 说明落入无信息兜底 |
| PUI-FB-0115 | rate, icon, preview-site | api-contract | high | resolved | accepted | Rate 公开合同重复且缺少真实拖动与可靠半星渲染 |
| PUI-FB-0116 | rate, preview-site | preview-parity | high | resolved | accepted | Rate 官网单块诊断演示与透明组件语义不一致 |
| PUI-FB-0117 | upload, button, image, progress, tag, preview-site | api-contract | high | resolved | accepted | Upload 公开合同混入整体状态、重复事件与调试方法 |
| PUI-FB-0118 | upload, preview-site | preview-parity | high | resolved | accepted | Upload 官网单块诊断预览与真实组件结构不一致 |
| PUI-FB-0119 | calendar, button, loading, empty, preview-site | api-contract | high | resolved | accepted | Calendar 公开合同重复暴露事件、Slot、方法与动效配置 |
| PUI-FB-0120 | calendar, preview-site | preview-parity | high | resolved | accepted | Calendar 官网单块诊断预览、局部遮罩与无效高度动画 |
| PUI-FB-0121 | navbar, button, loading, preview-site | api-contract | high | resolved | accepted | Navbar 公开合同混入自动路由、重复左右操作与显隐诊断能力 |
| PUI-FB-0122 | navbar, preview-site | preview-parity | high | resolved | accepted | Navbar 官网缺少用法分区且属性回写残留陈旧显隐反馈 |
| PUI-FB-0123 | tabs, button, badge, icon, preview-site | api-contract | high | resolved | accepted | Tabs 公开合同混入状态容器、动画调参和重复选择事件 |
| PUI-FB-0124 | tabs, preview-site, documentation | preview-parity | high | resolved | accepted | Tabs 官网用法代码丢失必要数据绑定且安装专项曾静默跳过 |
| PUI-FB-0125 | tabbar, button, badge, icon, preview-site | api-contract | high | resolved | accepted | Tabbar 公开合同混入业务状态、自动动作和宽泛事件面 |
| PUI-FB-0126 | tabbar, preview-site, documentation | preview-parity | high | resolved | accepted | Tabbar 用法代码缺少源码默认值导致官网运行时崩溃 |
| PUI-FB-0127 | tabbar, preview-site, config-provider | preview-parity | high | resolved | accepted | Tabbar H5 分隔线与毛玻璃阴影开关没有真实生效 |
| PUI-FB-0128 | steps, button, icon, preview-site | api-contract | high | resolved | accepted | Steps 公开合同混入业务状态、重复事件与命令式流程控制 |
| PUI-FB-0129 | steps, preview-site, button, icon | preview-parity | high | resolved | accepted | Steps H5 演示以诊断状态壳代替真实分区用法 |
| PUI-FB-0130 | indexes, cell, badge, button, loading, empty, preview-site | api-contract | high | resolved | accepted | Indexes 公开合同混入重复值、页面框架和命令式定位能力 |
| PUI-FB-0131 | indexes, preview-site, cell, badge, button, loading, empty | preview-parity | high | resolved | accepted | Indexes H5 分区、拖动运行时与复制代码未保持同源 |
| PUI-FB-0132 | sidebar, button, badge, icon, loading, empty, preview-site | api-contract | high | resolved | accepted | Sidebar 公开合同混入页面框架、重复事件与宽松值身份 |
| PUI-FB-0133 | sidebar, preview-site, button, badge, icon, loading, empty | preview-parity | high | resolved | accepted | Sidebar H5 用法分区、API说明与复制代码未保持同源 |
| PUI-FB-0134 | preview-site, documentation, build-tooling | ai-usability | high | resolved | accepted | TDesign 对照缺少每项在线来源与固定源码版本双重证据 |
| PUI-FB-0135 | back-top, button, documentation, preview-site | api-contract | high | resolved | accepted | BackTop 公开合同暴露了无真实用户任务的滚动引擎与平台回调 |
| PUI-FB-0136 | back-top, preview-site, button, cell | preview-parity | high | resolved | accepted | BackTop H5 概览归一化后丢失真实滚动运行时绑定 |
| PUI-FB-0137 | back-top, button, preview-site, theme | preview-parity | high | resolved | accepted | BackTop 深色主题被 H5 通用 Button 规则覆盖且源端 Token 未定义 |
| PUI-FB-0138 | sticky, preview-site, documentation | api-contract | high | resolved | accepted | Sticky 将页面滚动、视觉状态和诊断方法错误暴露为公开合同 |
| PUI-FB-0139 | sticky, preview-site, cell | preview-parity | high | resolved | accepted | Sticky H5 旧预览以诊断状态模拟吸顶且用法代码与容器函数脱节 |
| PUI-FB-0140 | sticky, preview-site, usage-code | preview-parity | medium | resolved | accepted | Sticky H5 属性面板把有效的 zIndex=0 错误夹紧为 1 |
| PUI-FB-0141 | loading, preview-site, usage-code | api-contract | high | resolved | accepted | Loading 公开合同混入私有外观、方向别名和生命周期事件 |
| PUI-FB-0142 | loading, preview-site | preview-parity | high | resolved | accepted | Loading H5 在 loading=false 时重建预览节点而跳过真实退场帧 |
| PUI-FB-0143 | toast, preview-site, usage-code, shadcn-message | api-contract | high | resolved | accepted | Toast 公开合同混入受控显隐和私有动效参数 |
| PUI-FB-0144 | toast, preview-site | preview-parity | high | resolved | accepted | Toast H5 隐藏后归一化移除了唯一触发入口并留下空舞台 |
| PUI-FB-0145 | toast, preview-site | preview-parity | high | resolved | accepted | Toast H5 过渡引用未挂载的 easing Token 而退化为瞬移 |
| PUI-FB-0146 | toast, preview-site, api-reference | api-contract | medium | resolved | accepted | API 通用 Slot 引言把不存在的 default Slot 宣传为可用能力 |
| PUI-FB-0147 | dialog, popup, preview-site, usage-code | api-contract | high | resolved | accepted | Dialog 公开合同混入旧状态机、重复 Slot 和预览私参 |
| PUI-FB-0148 | dialog, popup, preview-site | preview-parity | high | resolved | accepted | Dialog H5 与 Popup 依赖未完整镜像遮罩、滚动保护和真实动作 |
| PUI-FB-0149 | progress, preview-site, usage-code | api-contract | high | resolved | accepted | Progress 公开面混入不确定态、业务事件与诊断方法 |
| PUI-FB-0150 | progress, preview-site, api-reference, metadata | preview-parity | high | resolved | accepted | Progress 已实现 label Slot 但官网 metadata 未公开 |
| PUI-FB-0151 | skeleton, preview-site, usage-code, example | api-contract | high | resolved | accepted | Skeleton 公开面混入非结构化状态、事件与私有动效 |
| PUI-FB-0152 | skeleton, preview-site, api-reference, metadata, documentation | preview-parity | high | resolved | accepted | Skeleton 元数据与 H5 兼容说明滞后于真实公开合同 |
| PUI-FB-0153 | empty, preview-site, usage-code, example, state-composition | api-contract | high | resolved | accepted | Empty 公开面混入历史操作、状态与视觉配置 |
| PUI-FB-0154 | empty, preview-site, design-tokens, responsive-layout | visual-layout | high | resolved | accepted | Empty H5 图形网格引用未定义 Preview Token |
| PUI-FB-0155 | notice-bar, preview-site, usage-code, example, metadata | api-contract | high | resolved | accepted | NoticeBar 公开面混入历史关闭、过程事件与命令式能力 |
| PUI-FB-0156 | notice-bar, preview-site, responsive-layout, animation, usage-code | preview-parity | high | resolved | accepted | NoticeBar H5 重绘吞掉生命周期且长内容撑宽公告容器 |
| PUI-FB-0157 | property-panel, preview-site, notice-bar, accessibility | accessibility | medium | resolved | accepted | 共享属性工作区的非法 JSON 只有视觉标记而没有可读错误边界 |
| PUI-FB-0158 | result, preview-site, usage-code, example, metadata | api-contract | high | resolved | accepted | Result 公开面混入动作、过程状态与伪事件 |
| PUI-FB-0159 | result, preview-site, responsive-layout, animation, design-tokens | preview-parity | high | resolved | accepted | Result 被全局预览 Surface 覆盖且动效时长漂移 |
| PUI-FB-0160 | result, test-suite, preview-site | bug | medium | resolved | accepted | 共享 Loading 覆盖测试仍要求已移除依赖的 Result |
| PUI-FB-0161 | pull-refresh, preview-site, usage-code, example, metadata | api-contract | high | resolved | accepted | PullRefresh 公开合同误含外部滚动与伪完成能力 |
| PUI-FB-0162 | pull-refresh, preview-site, responsive-layout, animation | preview-parity | high | resolved | accepted | PullRefresh H5 触摸路径曾阻断真实局部滚动 |
| PUI-FB-0163 | popup, metadata, usage-code, example, preview-site | api-contract | high | resolved | accepted | Popup 公开合同曾混入业务状态、诊断事件与实例方法 |
| PUI-FB-0164 | popup, dialog, picker, sheet, preview-site, responsive-layout, animation | preview-parity | high | resolved | accepted | Popup 精简后 H5 与上层组合仍依赖旧私有边界 |
| PUI-FB-0165 | popover, metadata, usage-code, example, preview-site | api-contract | high | resolved | accepted | Popover 公开合同曾混入业务状态、触发策略与实例方法 |
| PUI-FB-0166 | popover, preview-site, preview-styles, property-panel, documentation | preview-parity | high | resolved | accepted | Popover H5 残留旧状态层样式与兼容说明，导致正文不可见 |
| PUI-FB-0167 | popover, build-tooling, preview-site | compatibility | medium | resolved | accepted | Popover 删除 Loading 状态后共享几何覆盖名单仍保留旧依赖 |
| PUI-FB-0168 | action-sheet, preview-site, documentation, example | api-contract | high | resolved | accepted | ActionSheet 旧公开合同把业务状态容器和命令式能力误暴露为组件能力 |
| PUI-FB-0170 | action-sheet, preview-site | preview-parity | medium | resolved | accepted | ActionSheet 收敛后残留 H5 状态样式和未定义 Token |
| PUI-FB-0173 | dropdown-menu, preview-site, documentation, example | api-contract | high | resolved | accepted | DropdownMenu 旧公开合同把筛选入口误扩展为多列状态和滚动引擎 |
| PUI-FB-0174 | dropdown-menu, preview-site | preview-parity | high | resolved | accepted | H5 API 表和 DropdownMenu 路由分别引用过缺失的共享 helper |
| PUI-FB-0175 | dropdown-menu, preview-site | preview-parity | high | resolved | accepted | DropdownMenu H5 打开态的遮罩不能接收真实指针点击 |
| PUI-FB-0176 | rate, preview-site | compatibility | medium | resolved | not-required | Rate 专项测试仍断言已删除的受控提示文案 |
| PUI-FB-0177 | config-provider, preview-site | compatibility | medium | resolved | not-required | ConfigProvider 专项测试仍断言旧版 H5 Store 说明文字 |
| PUI-FB-0178 | indexes, preview-site | preview-parity | high | resolved | not-required | Indexes H5 预览缺失真实滚动与侧栏拖动监听器 |
| PUI-FB-0179 | search, preview-site | compatibility | medium | resolved | not-required | Search 专项测试仍依赖已移除的预览说明文案 |
| PUI-FB-0180 | empty, image, preview-site | compatibility | medium | resolved | not-required | Empty 专项测试错误依赖不存在的 Image 页面运行时绑定 |
| PUI-FB-0181 | slider, preview-site, documentation | preview-parity | high | resolved | not-required | Slider H5 API 缺少专属轨道与尺寸行为说明 |
| PUI-FB-0182 | overlay, preview-site, documentation, example | api-contract | high | resolved | accepted | Overlay 旧公开合同把遮罩原语误扩展为可关闭浮层容器 |
| PUI-FB-0183 | swipe-cell, preview-site, documentation, example | api-contract | high | resolved | accepted | SwipeCell 旧合同膨胀且 H5 opened 受控态在归一化后被错误收起 |
| PUI-FB-0184 | swipe-cell, preview-site | preview-parity | medium | resolved | accepted | SwipeCell H5 动作层引用未定义的反色文字 Token |
| PUI-FB-0185 | swipe-cell, preview-site, test-contract | api-contract | medium | resolved | accepted | SwipeCell 已删除 Loading 组合但共享覆盖测试仍要求 H5 镜像 |
| PUI-FB-0186 | watermark, preview-site, documentation, example, miniprogram-dist | api-contract | high | resolved | accepted | Watermark 历史合同把业务状态、事件和防移除承诺误作组件能力 |
| PUI-FB-0187 | watermark, preview-site, test-contract | preview-parity | medium | resolved | accepted | Watermark H5 把零偏移回退为默认值且遗留 Surface 改变 Slot 几何 |
| PUI-FB-0188 | scroll-area, preview-site, documentation, example, miniprogram-dist | api-contract | high | resolved | accepted | ScrollArea 将原生滚动参数、事件和方法误扩张为组件合同 |
| PUI-FB-0189 | scroll-area, preview-site, test-contract | preview-parity | high | resolved | accepted | ScrollArea H5 顶部和底部演示只改 Props 未改变真实滚动位置 |
| PUI-FB-0190 | indexes, cell, preview-site | visual-layout | high | resolved | pending-user | Indexes H5 阴影模式把连续 Cell 集合误渲染为并列卡片 |
| PUI-FB-0191 | preview-site, preview-device, all-components | visual-layout | high | resolved | pending-user | 标准组件页缺少逐路由预览滚动容器覆盖门禁 |
| PUI-FB-0192 | preview-site, sidebar, all-components | design-decision | low | resolved | pending-user | 官网组件目录缺少稳定的反馈序号 |
| PUI-FB-0193 | preview-site, config-provider, cell, avatar, tag, progress, field, empty, result, grid, steps | visual-layout | high | resolved | pending-user | 全局阴影把条目、透明布局根和展示叶子误提升为浮层 |
| PUI-FB-0195 | aspect-ratio, preview-site | preview-parity | medium | resolved | pending-user | AspectRatio 概览泄漏 clipped content 诊断且圆角类名没有镜像 WXSS |
| PUI-FB-0196 | preview-site, preview-device, button, direction | preview-parity | high | resolved | pending-user | H5 Button 镜像漏入完整变体合同并使组合阴影被后续 Surface 覆盖 |
| PUI-FB-0198 | image, preview-site, documentation | preview-parity | high | resolved | pending-user | Image H5 代码分区缺失且资源失败停留在加载态 |
| PUI-FB-0199 | scroll-area, preview-site, documentation | api-contract | high | resolved | pending-user | ScrollArea 零高度被归一化为 1rpx/1px 并坍缩预览 |
| PUI-FB-0200 | collapse, preview-site | preview-parity | high | resolved | pending-user | Collapse 初始渲染时展开面板高度为 0 导致内容不可见 |
| PUI-FB-0201 | button-group | design-decision | medium | resolved | pending-user | 删除 ButtonGroup 组件 |
| PUI-FB-0202 | preview-site, sidebar, metadata, documentation | visual-layout | high | resolved | pending-user | 官网目录遗漏布局分区并把用户任务分类退化为旧源码分组 |
| PUI-FB-0203 | dialog, preview-site | bug | high | resolved | pending-user | Dialog H5 预览遗漏运行时注册而停在透明入场态 |
| PUI-FB-0204 | dialog, preview-site, preview-device | visual-layout | high | resolved | pending-user | Dialog H5 预览把流式触发内容贴到设备边缘 |
| PUI-FB-0206 | preview-site, documentation | design-decision | medium | resolved | pending-user | 官网品牌缺少 Poem 语义且退化为无内容色块 |
| PUI-FB-0207 | input | api-contract | high | resolved | pending-user | Input 收口前置短文本组合能力 |
| PUI-FB-0208 | toast, metadata, preview-site | design-decision | medium | resolved | pending-user | 收口独立反馈队列入口 |
| PUI-FB-0209 | preview-site, metadata, form, calendar, date-time-picker, upload | design-decision | high | resolved | pending-user | 表单选择与数值统一任务分区并重排目录序号 |
| PUI-FB-0210 | popup, button, cell, preview-site | design-decision | high | resolved | pending-user | Popup 三段结构与主要动作 Slot |
| PUI-FB-0211 | preview-site, popup, loading, swiper, direction | design-decision | high | resolved | accepted | 全局动效默认 500ms 与 1000ms 上限 |
| PUI-FB-0212 | popup, preview-site | preview-parity | high | resolved | accepted | Popup 官网进退场因整段重绘丢失中间帧 |
| PUI-FB-0213 | popup, preview-site | api-contract | high | resolved | pending-user | Popup 需要明确区分卡片留白、贴边呈现与遮罩模糊 |
| PUI-FB-0214 | sheet, preview-site | preview-parity | high | resolved | accepted | Sheet 预览需要保留入口上下文并在同一节点完成底部动效 |
| PUI-FB-0215 | popover, preview-site | preview-parity | high | resolved | accepted | Popover 官网镜像重绘节点导致动效瞬移 |
| PUI-FB-0217 | preview-site, preview-device, all-components, documentation | visual-layout | high | resolved | pending-user | 标准组件预览根未填满 PreviewDevice 可用全高 |
| PUI-FB-0218 | action-sheet, preview-site | preview-parity | high | resolved | accepted | ActionSheet 官网镜像重绘底部面板导致动效瞬移 |
| PUI-FB-0220 | dropdown-menu, preview-site | preview-parity | high | resolved | accepted | DropdownMenu 官网镜像重绘菜单节点导致显隐动效瞬移 |
| PUI-FB-0221 | overlay, preview-site | preview-parity | high | resolved | accepted | Overlay 官网镜像重绘遮罩根导致显隐动效瞬移 |
| PUI-FB-0222 | dialog, preview-site | preview-parity | high | resolved | accepted | Dialog 官网镜像在显隐阶段重绘 Layer 与 Scrim |
| PUI-FB-0223 | skeleton, preview-site | preview-parity | high | resolved | accepted | Skeleton 官网交叉淡入时长与运行时接线偏离真实组件 |
| PUI-FB-0224 | notice-bar, preview-site | preview-parity | high | resolved | accepted | NoticeBar 官网显隐和纵向轮播未保留真实节点 |
| PUI-FB-0225 | switch, preview-site | preview-parity | high | resolved | accepted | Switch 官网动效时长回退为 180ms |
| PUI-FB-0226 | scroll-area, preview-site, documentation, example, miniprogram-dist | capability-gap | medium | resolved | pending-user | ScrollArea 需要主题安全的固定顶底渐变遮罩 |
| PUI-FB-0227 | grid, preview-site | preview-parity | high | resolved | accepted | Grid 状态层运行时未接入官网预览分发 |
| PUI-FB-0228 | preview-site, collapsible, combobox, table, swiper, navigation-menu, direction, overlay, pull-refresh, grid | preview-parity | high | resolved | pending-user | 多个官网预览运行时未接入共享分发器 |
| PUI-FB-0229 | combobox, preview-site | preview-parity | medium | resolved | accepted | Combobox 缺专属合同且概览暴露工程诊断 |
| PUI-FB-0230 | navigation-menu | ai-usability | medium | resolved | accepted | NavigationMenu 缺少专属语义合同 |
| PUI-FB-0231 | select, preview-site | ai-usability | medium | resolved | accepted | Select 缺少专属合同与专项回归测试 |
| PUI-FB-0232 | input-otp, preview-site | preview-parity | high | resolved | accepted | InputOTP H5 适配路由跳过输入回写 |
| PUI-FB-0233 | collapsible | ai-usability | medium | resolved | accepted | Collapsible 缺少单区开合语义合同 |
| PUI-FB-0234 | list | ai-usability | medium | resolved | accepted | List 缺少双状态优先级专项合同 |
| PUI-FB-0235 | virtual-list, preview-site | preview-parity | high | resolved | accepted | VirtualList H5 真实滚动未更新窗口 |
| PUI-FB-0236 | bubble, preview-site | preview-parity | high | resolved | accepted | Bubble H5 空白预览与语义合同缺口 |
| PUI-FB-0237 | alert, preview-site | preview-parity | high | resolved | accepted | Alert H5 受控关闭绕过父级回写 |
| PUI-FB-0238 | scroll-area, preview-site, documentation, example, miniprogram-dist | capability-gap | medium | resolved | accepted | ScrollArea 固定渐变遮罩缺少语义高度档位 |
| PUI-FB-0240 | card, preview-site, documentation, miniprogram-dist | preview-parity | high | resolved | accepted | Card H5 通用 Surface 覆盖阴影、动效、间距与 Footer 合同 |
| PUI-FB-0241 | card, preview-site, metadata | api-contract | high | resolved | accepted | Card API 生成目录未刷新，Events 与 Slots 未出现在官网 |
| PUI-FB-0242 | swiper, preview-site, documentation | preview-parity | high | resolved | accepted | Swiper 概览泄露工程诊断，状态切换和重置偏离真实默认预览 |
| PUI-FB-0243 | alert, preview-site, documentation | preview-parity | high | resolved | accepted | Alert 概览泄露工程元信息且默认误成受控，首次进入无中间帧 |
| PUI-FB-0244 | preview-site, navbar, tabbar, calendar, loading, radio, tabs, checkbox, form, count-down, table, progress, upload, pull-refresh, sidebar, cell, list | preview-parity | high | resolved | accepted | component-only 归一化遗漏展示根与新诊断类，概览泄露工程状态 |
| PUI-FB-0245 | breadcrumb, preview-site, documentation | ai-usability | medium | resolved | accepted | Breadcrumb 已发布但缺少专属合同与专项验收门禁 |
| PUI-FB-0246 | label, preview-site, documentation | api-contract | medium | resolved | accepted | Label 官网元信息错误声明 tap 与 H5 输入事件 |
| PUI-FB-0248 | preview-site, preview-device, scroll-area, all-components, documentation | preview-parity | medium | resolved | pending-user | PreviewDevice 共享 ScrollArea 缺少默认阅读渐隐遮罩 |
| PUI-FB-0249 | divider, preview-site, theme, documentation, miniprogram-dist | preview-parity | medium | resolved | pending-user | Divider 深色模式复用边界色导致细线不可辨识 |
| PUI-FB-0250 | divider, config-provider, preview-site, theme, documentation, miniprogram-dist | visual-layout | high | resolved | pending-user | 边框关闭偏好错误隐藏 Divider 内容层级 |
| PUI-FB-0251 | tag, preview-site | visual-layout | medium | resolved | pending-user | Tag 官网演示挤压标签并截断 success 文本 |
| PUI-FB-0253 | cell, popup, preview-site | capability-gap | medium | resolved | pending-user | CellGroup 作为 Cell 体系内部布局组件 |
| PUI-FB-0254 | popup, preview-site | visual-layout | low | resolved | pending-user | Popup 描述在标题区单行截断 |
| PUI-FB-0255 | popup, preview-site | design-decision | medium | resolved | pending-user | Popup 移除拖拽手柄保持紧凑 Header |
| PUI-FB-0256 | grid, preview-site | visual-layout | medium | resolved | pending-user | Grid 官网错误态 Empty 与重试按钮横向挤压 |
| PUI-FB-0257 | preview-site, preview-device, grid | visual-layout | medium | resolved | pending-user | 普通预览长内容缺失底部安全间距 |
| PUI-FB-0258 | back-top, button, fab, preview-site | capability-gap | medium | resolved | pending-user | BackTop 预览圆形操作缺少 FAB 语义且未回写局部滚动 |
| PUI-FB-0259 | back-top, preview-site | visual-layout | medium | resolved | pending-user | BackTop 预览缺少内距且示例重复、FAB 未居中 |
| PUI-FB-0260 | back-top, preview-site, preview-device | visual-layout | medium | resolved | pending-user | BackTop 预览分区标题贴边并被顶部裁切 |
| PUI-FB-0261 | back-top, preview-site | visual-layout | medium | resolved | pending-user | BackTop 预览应只保留两个列表并让 FAB 使用安全内距 |
| PUI-FB-0262 | back-top, preview-site | preview-parity | medium | resolved | pending-user | BackTop 两个预览列表的滚动内容不足 |
| PUI-FB-0263 | spacing, preview-site, metadata, documentation | design-decision | medium | resolved | pending-user | Spacing 应位于开始与规范并紧跟编号 05 |
| PUI-FB-0264 | sticky, preview-site, cell | visual-layout | medium | resolved | pending-user | Sticky 概览被四个重复滚动窗切碎且未填满可用空间 |
| PUI-FB-0265 | breadcrumb, preview-site, button, icon, tag | preview-parity | medium | resolved | pending-user | Breadcrumb 概览只有一个过载示例且缺少关键路径场景 |
| PUI-FB-0266 | indexes, button, preview-site | visual-layout | high | resolved | pending-user | Indexes H5 索引 Button 热区重叠且活动字符不可见 |
| PUI-FB-0267 | indexes, preview-site | preview-parity | medium | resolved | pending-user | Indexes H5 滚到底部时短尾分组不会成为活动项 |
| PUI-FB-0268 | indexes, button, preview-site | accessibility | high | resolved | pending-user | Indexes 隐藏状态层仍保留可键盘操作的滚动区与重试按钮 |
| PUI-FB-0269 | indexes, preview-site | preview-parity | high | resolved | pending-user | Indexes 默认侧栏未按页面 fixed 浮动 |
| PUI-FB-0270 | indexes, cell, preview-site | visual-layout | medium | resolved | pending-user | Indexes Cell 被固定侧栏预留区挤窄 |
| PUI-FB-0271 | navbar, preview-site, example, documentation | compatibility | high | resolved | pending-user | Navbar 未为微信原生胶囊保留真实安全区 |
| PUI-FB-0272 | navigation-menu, badge, button, preview-site | preview-parity | high | resolved | pending-user | NavigationMenu Trigger 后缀 Badge 锚定到菜单根并被裁切 |
| PUI-FB-0273 | steps, button, preview-site, preview-device | visual-layout | high | resolved | pending-user | Steps 概览把互斥示例纵向堆叠，无法快速筛选场景 |
| PUI-FB-0274 | steps, button, preview-site | preview-parity | high | resolved | pending-user | Steps 的 PUI Button Slot 继承固定 36px 高度而裁切指标和文案 |
| PUI-FB-0275 | navigation-menu, badge, preview-site | visual-layout | high | resolved | pending-user | NavigationMenu 垂直方向未占用右侧 Panel 内容区 |
| PUI-FB-0276 | navigation-menu, button, icon, preview-site | preview-parity | medium | resolved | pending-user | NavigationMenu Header 操作退化为透明图标 |
| PUI-FB-0277 | sidebar, badge, button, preview-site | visual-layout | high | resolved | pending-user | Sidebar 默认组合压缩为不可读窄列且尾部 Badge 被裁切 |
| PUI-FB-0278 | sidebar, cell, button, badge, icon, preview-site | preview-parity | high | resolved | pending-user | Sidebar 概览缺少消费者内容，选值结果不可见 |
| PUI-FB-0279 | steps, button, icon, preview-site | preview-parity | high | resolved | pending-user | Steps 状态预览隐藏 PUI Icon，场景导航选中态不清晰 |
| PUI-FB-0280 | tabbar, button, badge, icon, preview-site, preview-device | preview-parity | high | resolved | accepted | Tabbar 概览纵向堆叠且纯图标条目被错误回退为序号标签 |
| PUI-FB-0281 | tabbar, preview-site | api-contract | medium | resolved | accepted | Tabbar 分隔默认值与单选值类型未和实际语义收口 |
| PUI-FB-0282 | preview-site, sidebar, metadata, button, badge | ai-usability | high | resolved | pending-user | 错误将 Sidebar 组件预览诉求扩大为全局目录改造 |
| PUI-FB-0283 | preview-site, sidebar, button, badge, tag | visual-layout | medium | resolved | pending-user | 官网目录将中文辅助名误作 Badge/Tag |
| PUI-FB-0284 | tabbar, preview-site, preview-device | visual-layout | high | resolved | pending-user | Tabbar 预览缩进、整高分隔与纵向节奏错误 |
| PUI-FB-0285 | tabbar, button, badge, preview-site | preview-parity | high | resolved | pending-user | Tabbar 徽标被共享 Button 溢出裁切 |
| PUI-FB-0286 | tabs, button, badge, icon, preview-site | visual-layout | high | resolved | accepted | Tabs 默认视觉被悬浮卡片与短导航高度削弱 |
| PUI-FB-0287 | field, input, cell, preview-site | visual-layout | high | resolved | accepted | Field 默认纵向双层输入框不符合可编辑单元格语义 |
| PUI-FB-0288 | field, cell, preview-site, form | design-decision | high | resolved | accepted | Field 与 Cell 维护两套行级视觉实现 |
| PUI-FB-0289 | tabs, badge, button, preview-site | preview-parity | high | resolved | accepted | Tabs 徽标被通用 Button 裁切且原生锚点包住整段标签 |
| PUI-FB-0290 | miniprogram-home, config-provider, navbar, scroll-area, collapsible, cell, search, tabbar, image | capability-gap | high | resolved | pending-user | 真实小程序首页未接入 PUI 组件链 |
| PUI-FB-0291 | navbar, preview-site, miniprogram-home, documentation | visual-layout | high | resolved | pending-user | Navbar 只预留胶囊宽度但没有镜像原生按钮位置 |
| PUI-FB-0292 | input, search, miniprogram-home, documentation | compatibility | medium | resolved | pending-user | Input 原生值需平台归一化且自动化注值与像素重绘分裂 |
| PUI-FB-0293 | miniprogram-home, tabbar, icon | bug | medium | resolved | pending-user | 首页任务 Tabbar 引用了 Icon 清单中不存在的名称 |
| PUI-FB-0294 | icon, button, preview-site | capability-gap | medium | resolved | accepted | Icon 资源卡只回写名称，无法直接复制图标名 |
| PUI-FB-0295 | tag, divider, miniprogram | bug | high | resolved | pending-user | Tag 全量 observer 在真实页面挂载后自触发更新循环 |
| PUI-FB-0296 | cell, navbar, scroll-area, button, divider, icon, search, config-provider, miniprogram | capability-gap | high | resolved | pending-user | 首页基础组件 Cell 缺少真实独立用法页面 |
| PUI-FB-0297 | button, icon, miniprogram | preview-parity | high | resolved | pending-user | 实色主要与危险 Button 的内置 Icon 对比度不足 |
| PUI-FB-0298 | platform-runtime, icon, navbar, sheet, swipe-cell, rate, watermark, tabs, popover, direction, virtual-list, overlay, miniprogram | compatibility | high | resolved | pending-user | 组件库继续调用已弃用的 wx.getSystemInfoSync |
| PUI-FB-0299 | combobox, overlay, miniprogram-home, preview-site, theme | api-contract | medium | resolved | pending-user | 首页搜索入口需要圆形 Combobox 与可选背景模糊遮罩 |
| PUI-FB-0300 | overlay, miniprogram-home, miniprogram-dist | compatibility | high | resolved | pending-user | Overlay 低动效通配选择器导致微信 WXSS 编译失败 |
| PUI-FB-0301 | combobox, input, miniprogram-home, preview-site | api-contract | medium | resolved | pending-user | Combobox 延后展开时需使用真实 change 事件并允许满宽搜索行 |
| PUI-FB-0302 | combobox, miniprogram-home, preview-site, theme | visual-layout | medium | resolved | pending-user | Combobox round Trigger 与 Panel 使用不一致圆角 Token |
| PUI-FB-0303 | miniprogram-home, tabbar, icon | visual-layout | low | resolved | pending-user | 首页 Tabbar 需提供真实图标的设置目的地并保持禁用边界 |
| PUI-FB-0304 | tabbar, button, icon, preview-site, miniprogram-home | visual-layout | high | resolved | pending-user | Tabbar 纯图标项投影层与等分轨道导致四项横向偏移 |
| PUI-FB-0305 | button, tabbar, preview-site, miniprogram-home | visual-layout | high | resolved | pending-user | Block Button 未清除默认最小宽度导致等分导航横向溢出 |
| PUI-FB-0306 | icon, search, scroll-area, miniprogram | design-decision | medium | resolved | pending-user | 小程序 Icon 页代表性复制卡未覆盖完整图标目录 |
| PUI-FB-0307 | search, input, miniprogram | visual-layout | high | resolved | pending-user | Search 自定义组件宿主未声明全宽导致调用端缩窄 |
| PUI-FB-0308 | tabbar, miniprogram-home | design-decision | medium | resolved | pending-user | 首页未启用 Tabbar 已有 tag 与 round 视觉形态 |
| PUI-FB-0309 | miniprogram-home, navbar, overlay, popup, switch, config-provider | design-decision | medium | resolved | pending-user | 首页菜单改用底部 Popup 承载全局外观控制与果味组合 |
| PUI-FB-0310 | tabbar, miniprogram-home | design-decision | medium | resolved | pending-user | 首页 Tabbar 应使用 normal 全宽与微分隔变体 |
| PUI-FB-0311 | navbar, button, icon, miniprogram-home, preview-site | api-contract | high | resolved | pending-user | Navbar 左 Slot 图标按钮的可见性与点击命中 |
| PUI-FB-0312 | icon, miniprogram, scroll-area | visual-layout | medium | resolved | pending-user | 小程序 Icon 网格图标过小且缺少名称 |
| PUI-FB-0313 | tabbar, button, preview-site, miniprogram-home | visual-layout | high | resolved | pending-user | Tabbar 条目泄露 PUI Button 默认卡片表面 |
| PUI-FB-0314 | input, textarea, search, combobox, miniprogram | bug | high | resolved | pending-user | 原生 Input 与 Textarea 聚焦后立即丢失焦点 |
| PUI-FB-0315 | navbar, tabbar, preview-site, miniprogram-home | visual-layout | medium | resolved | pending-user | Navbar 与 Tabbar 默认可见边界破坏无边首页节奏 |
| PUI-FB-0316 | popup, preview-site, miniprogram-home | compatibility | high | resolved | pending-user | Popup WXSS 通配选择器阻断微信页面编译 |
| PUI-FB-0317 | popup, preview-site, miniprogram-home | visual-layout | high | resolved | pending-user | Popup Blur 被总 Layer 透明度延后 |
| PUI-FB-0318 | combobox, miniprogram-home, preview-site | visual-layout | medium | resolved | pending-user | Combobox 筛选后面板高度收缩 |
| PUI-FB-0319 | input, combobox, search, miniprogram-home, preview-site | visual-layout | medium | resolved | pending-user | Input 清除按钮未固定在尾部操作位 |
| PUI-FB-0320 | icon, navbar, popup, switch, config-provider, miniprogram | design-decision | medium | resolved | pending-user | Icon 独立页 Navbar 增加返回与外观菜单双操作 |
| PUI-FB-0321 | popup, button, metadata, preview-site | api-contract | medium | resolved | pending-user | Popup Header 默认缺少常驻关闭按钮 |
| PUI-FB-0322 | button, popup, preview-site, config-provider | design-decision | medium | resolved | pending-user | Button 默认操作误用玻璃卡片而非 muted 弱填充 |
| PUI-FB-0323 | action-sheet, calendar, dialog, navigation-menu, popover, sheet, swipe-cell, table, virtual-list, miniprogram | compatibility | high | resolved | pending-user | 发布组件的 WXSS 通配选择器阻断合法 AppID 上传 |
| PUI-FB-0324 | button, icon, popup, preview-site | visual-layout | medium | resolved | pending-user | Button iconOnly 未建立统一居中轨道导致关闭图标偏心 |
| PUI-FB-0325 | navbar, button, icon, popup, switch, config-provider, miniprogram | design-decision | high | resolved | pending-user | 组件详情页 Navbar 与外观 Popup 仅在 Icon 页实现 |
| PUI-FB-0327 | navbar, preview-site, miniprogram-home, miniprogram | compatibility | high | resolved | pending-user | Navbar 的 Grid Slot 百分比布局在 Skyline 真机偏离原生胶囊几何 |
| PUI-FB-0328 | button, fab, dialog, miniprogram | api-contract | medium | resolved | pending-user | Button 缺少明确的 transparent 视觉变体 |
| PUI-FB-0329 | navbar, miniprogram-home, component-page-navbar, preview-site | api-contract | high | needs-device | pending-user | Navbar 双按钮不应依赖 Slot 冒泡而失去页面监听 |
| PUI-FB-0330 | miniprogram, navbar, icon, grid, button | compatibility | high | wont-fix | pending-user | 当前小程序明确不启用 Skyline 渲染器 |
| PUI-FB-0331 | config-provider, popup, card, sheet, action-sheet, popover, dropdown-menu, navigation-menu, collapse, collapsible, combobox, select, picker, date-time-picker, calendar, upload, swiper, cell-group, preview-site | capability-gap | high | resolved | pending-user | 独立 Surface 等距模式与阴影资格需要双端统一治理 |
| PUI-FB-0332 | swiper, miniprogram, npm-dist, preview-site | compatibility | critical | resolved | pending-user | Swiper 分页 WXML 条件分支阻断合法 AppID 上传 |
| PUI-FB-0333 | config-provider, combobox, preview-site, miniprogram-home | design-decision | medium | resolved | pending-user | 全局默认外观应为大圆角阴影无边框，Combobox 局部无边框不得关闭阴影 |
| PUI-FB-0334 | tabbar, button, preview-site, miniprogram-home | visual-layout | medium | resolved | pending-user | 纯图标 Tabbar 沿用标签短横位置导致视觉脱节 |
| PUI-FB-0335 | overlay, config-provider, preview-site, miniprogram-home | design-decision | medium | resolved | pending-user | Overlay 默认遮罩需兼容全局毛玻璃与局部 blur API |
| PUI-FB-0336 | miniprogram, button, divider, icon, scroll-area | visual-layout | medium | resolved | pending-user | 小程序组件详情页需要共享标题、子标题、描述与宽松分区节奏 |
| PUI-FB-0337 | swiper, documentation, preview-site, example, npm-dist | design-decision | high | resolved | not-required | 轮播图公开英文名必须统一为 Swiper，不能残留 Carousel 双合同 |
| PUI-FB-0339 | miniprogram-home, navbar, tabbar, tabs, search, popup, style-utilities | capability-gap | medium | resolved | pending-user | 第二 Tab 不能保留空白页，需成为真实 Style Utilities 页面 |
| PUI-FB-0340 | popup, config-provider, theme, miniprogram | compatibility | high | resolved | pending-user | 组件 WXSS 导入全局主题会触发微信禁止选择器编译错误 |
| PUI-FB-0341 | miniprogram-home, popup, popover, sheet, action-sheet, dropdown-menu, overlay, collapsible | capability-gap | high | resolved | pending-user | 小程序浮层分区缺少完整独立详情页 |
| PUI-FB-0342 | popup, navbar, button, miniprogram-component-pages | visual-layout | high | resolved | pending-user | Popup 顶部与侧向几何未避开 Navbar 且侧向高度过高 |
| PUI-FB-0343 | popover, miniprogram-component-pages | visual-layout | medium | resolved | pending-user | 小程序 Popover 入口未回写显隐且横向定位偏离请求方向 |
| PUI-FB-0344 | sheet, popup, miniprogram-component-pages | visual-layout | high | resolved | pending-user | 小程序 Sheet 的 Popup 承载层与 Header end 轨必须稳定三段结构 |
| PUI-FB-0345 | sheet, config-provider, preview-site, miniprogram-component-pages | visual-layout | high | resolved | pending-user | Sheet 拖拽柄不应随全局无边框外观消失 |
| PUI-FB-0346 | action-sheet, config-provider, preview-site | visual-layout | medium | resolved | pending-user | ActionSheet 遮罩未继承全局毛玻璃且不能局部覆盖 |
| PUI-FB-0348 | action-sheet, switch, config-provider, preview-site | api-contract | high | resolved | pending-user | ActionSheet 取消没有关闭请求且独立页缺少局部毛玻璃入口 |
| PUI-FB-0349 | build-pipeline, miniprogram-dist, preview-site | compatibility | high | resolved | pending-user | site:build 在目录生成前未刷新 miniprogram_dist |
| PUI-FB-0350 | preview-site, catalog, test-suite | compatibility | medium | resolved | pending-user | Preview 阴影边界门禁遗留已下线 Tooltip 的组件数量 |
| PUI-FB-0351 | navbar, scroll-area, miniprogram-home, preview-site | visual-layout | high | resolved | pending-user | 无边 Navbar 与静态 ScrollArea 渐变遮罩产生页面视觉割裂 |
| PUI-FB-0352 | combobox, input, miniprogram-home, preview-site | bug | high | resolved | pending-user | Combobox 首次受控打开被零高度测量裁掉搜索框 |
| PUI-FB-0353 | overlay, miniprogram-component-page, preview-site | visual-layout | medium | resolved | pending-user | Overlay 独立页将展示文案误做成内容面板 |
| PUI-FB-0354 | combobox, search, miniprogram-home, preview-site | api-contract | high | resolved | pending-user | Combobox 将搜索输入误纳入基础选择组件 |
| PUI-FB-0355 | miniprogram-home, search, combobox | visual-layout | medium | resolved | pending-user | 首页搜索遗漏可导航组件且列表视口偏高 |
| PUI-FB-0356 | search, input, config-provider, miniprogram-home, preview-site | visual-layout | high | resolved | pending-user | Search round 引用未定义 Token 并绕过全局边框外观 |
| PUI-FB-0357 | miniprogram-home | capability-gap | medium | resolved | pending-user | 首页缺少微信原生分享与朋友圈页面合同 |
| PUI-FB-0358 | icon, miniprogram-home, button, divider, popup, popover, sheet, action-sheet, dropdown-menu, overlay | design-decision | high | resolved | accepted | 已落地组件在首页复用近似图标，浮层语义难以辨识 |
| PUI-FB-0359 | action-sheet, popup, preview-site, miniprogram-component-pages | visual-layout | high | resolved | pending-user | ActionSheet 共同 Layer 透明度导致遮罩先于面板完成进入 |
| PUI-FB-0360 | miniprogram-home, alert, empty, loading, notice-bar, progress, result, skeleton, toast, preview-site | capability-gap | high | resolved | pending-user | 小程序缺少反馈分区的真实组件独立页与可搜索路由 |
| PUI-FB-0361 | style-utilities, preview-site, theme-tokens | capability-gap | medium | resolved | pending-user | Style Utilities 的背景渐变必须可直接挂载到 View 与容器 |
| PUI-FB-0362 | alert, preview-site, miniprogram-component-pages | visual-layout | medium | resolved | pending-user | Alert 图标与正文使用紧凑间距导致信息层级拥挤 |
| PUI-FB-0363 | alert, preview-site, miniprogram-component-pages | api-contract | medium | resolved | pending-user | Alert 需要独立的行内纵向对齐与同色系正文 |
| PUI-FB-0364 | icon, alert | capability-gap | high | resolved | pending-user | 内置 Icon 需要真实 Icon Font 与 currentColor |
| PUI-FB-0365 | icon, image | api-contract | high | resolved | pending-user | H5 与小程序必须统一为 Icon Font 唯一运行时 |
| PUI-FB-0366 | combobox, icon, search, miniprogram-home, preview-site | visual-layout | medium | resolved | pending-user | Combobox 候选行缺少统一 inset 与图文对齐规则 |
| PUI-FB-0367 | icon, preview-site, miniprogram | visual-layout | high | resolved | pending-user | Icon Font 闭口圆形被错误填成实心 |
| PUI-FB-0368 | style-utilities, tabs, tabbar | bug | medium | resolved | pending-user | 快速样式 Tabs 将目录 key 错传为数字索引 |
| PUI-FB-0369 | style-utilities, navbar, tabs, scroll-area | visual-layout | low | resolved | pending-user | 快速样式页重复内容标题区 |
| PUI-FB-0370 | tabs, style-utilities, preview-site | visual-layout | medium | resolved | pending-user | Tabs 未按数量自动切换等分与半露阅读轨道 |
| PUI-FB-0371 | style-utilities, tabs, miniprogram | bug | medium | resolved | pending-user | 快速样式生成目录仍暴露主题与行为旧分类 |
| PUI-FB-0372 | style-utilities, tabs, scroll-area | visual-layout | medium | resolved | pending-user | 快速样式的粘性预览与 Tabs 下划线必须对齐真实轨道 |
| PUI-FB-0373 | config-provider, input, search, combobox, popup, sheet, action-sheet, tabbar, navbar, image, collapsible, preview-site | design-decision | high | resolved | pending-user | 70 个真实根组件需要共享外观资格矩阵与 effectsEnabled 总开关 |
| PUI-FB-0374 | popup, preview-site | visual-layout | medium | resolved | pending-user | H5 Popup 边缘方向切换不能复用旧的离场 Host |
| PUI-FB-0375 | style-utilities, cell | preview-parity | medium | resolved | pending-user | 快速样式两列目录必须真实应用并按类型互斥 |
| PUI-FB-0376 | tabbar | visual-layout | medium | resolved | pending-user | 无文案 Tabbar 的图标与短横需要同一视觉中心 |
| PUI-FB-0377 | tabs | visual-layout | medium | resolved | pending-user | Tabs content 区域高度过大导致 390px 窄屏下空间浪费 |
| PUI-FB-0378 | back-top, scroll-area, style-utilities | bug | high | resolved | pending-user | 快速样式页漏注册 BackTop 导致不可见且不可点击 |
| PUI-FB-0379 | back-top, fab, tabbar, scroll-area, style-utilities | bug | high | resolved | pending-user | BackTop 覆盖 Tabbar、默认视觉错误且提前伪造回顶完成 |
| PUI-FB-0380 | miniprogram-home, navbar, navigation-menu, tabs, breadcrumb, tabbar, steps, back-top, indexes, sidebar | capability-gap | high | resolved | pending-user | 小程序缺少导航分区九个真实独立页与统一路由入口 |
| PUI-FB-0381 | sidebar, miniprogram, navigation-pages | compatibility | high | resolved | pending-user | 导航组件页面共享 WXSS 通配选择器阻断全小程序渲染 |
| PUI-FB-0382 | scroll-area, back-top, style-utilities, preview-site | visual-layout | medium | resolved | pending-user | ScrollArea 受控回顶缺少真实平滑滚动 |
| PUI-FB-0383 | dropdown-menu, preview-site, miniprogram-dist | bug | high | resolved | pending-user | DropdownMenu 重复点击当前筛选项调用了不存在的关闭方法 |
| PUI-FB-0384 | style-utilities, tabs, scroll-area, back-top, miniprogram | visual-layout | high | resolved | pending-user | 快速样式页的 Tabs、预览与目录应有明确高度预算 |
| PUI-FB-0385 | miniprogram-home, dialog, feedback-pages | capability-gap | high | resolved | pending-user | 小程序反馈区缺少 Dialog 的受控独立页面与可搜索路由 |
| PUI-FB-0386 | miniprogram-home, aspect-ratio, direction, grid, scroll-area, sticky | capability-gap | high | resolved | pending-user | 小程序缺少布局区五个组件的独立页面与滚动边界 |
| PUI-FB-0387 | miniprogram-home, pull-refresh, virtual-list, watermark | capability-gap | high | resolved | pending-user | 小程序缺少高级区的滚动所有者页面与真实本地状态边界 |
| PUI-FB-0389 | miniprogram-home, form, field, label, input, input-otp, textarea, search, checkbox, radio, switch, select, picker, combobox, slider, stepper, rate, calendar, date-time-picker, upload | capability-gap | high | resolved | pending-user | 小程序缺少表单区十九个组件页及受控输入边界 |
| PUI-FB-0391 | icon, miniprogram-home, badge, cell, swipe-cell, scroll-area, dialog, tag, swiper, direction | design-decision | high | resolved | pending-user | 新组件目录需要区分通用复用、Lucide 直引与 PoemUI 专属几何 |
| PUI-FB-0392 | miniprogram-home, avatar, badge, card, image, tag, cell, list, collapse, collapsible, bubble, swipe-cell, count-down, swiper, table | capability-gap | high | resolved | pending-user | 小程序缺少数据展示区十四个组件的独立可操作页面 |
| PUI-FB-0393 | miniprogram-home, config-provider, getting-started, theme-tokens, color, spacing, typography | capability-gap | high | resolved | pending-user | 小程序缺少 ConfigProvider 页面与可检索的开始规范入口 |
| PUI-FB-0394 | scroll-area, back-top, style-utilities, miniprogram | bug | high | resolved | pending-user | ScrollArea 受控滚动回写不应抢占原生惯性 |
| PUI-FB-0395 | tabbar, preview-site, miniprogram-home | visual-layout | medium | resolved | pending-user | 普通 Tabbar 根泄露浮层面板材质 |
| PUI-FB-0396 | style-utilities, preview-site, miniprogram | preview-parity | high | resolved | pending-user | 快速样式预览必须按 utility 语义命中真实目标 |
| PUI-FB-0397 | picker, date-time-picker, popup, miniprogram | bug | high | resolved | pending-user | Picker Popup 未透传 showHeader 导致确认与取消入口消失 |
| PUI-FB-0398 | style-utilities, button, preview-site, miniprogram | design-decision | medium | resolved | pending-user | 快速样式只保留当前效果并提供分类级恢复 |
| PUI-FB-0399 | style-utilities, preview-site | bug | medium | resolved | pending-user | Style Utilities H5 兼容说明不得引用已删除目录常量 |
| PUI-FB-0400 | miniprogram-home, collapsible, popup, popover, sheet, action-sheet, dropdown-menu, overlay | visual-layout | medium | resolved | pending-user | 首页浮层分区排序与首显自动展开时机不符合阅读动线 |
| PUI-FB-0401 | miniprogram-home, image, config-provider | visual-layout | medium | resolved | pending-user | 首页品牌版头缺少左文右图的留白视觉中心 |
| PUI-FB-0402 | style-utilities, tabs, scroll-area, back-top, miniprogram | bug | medium | resolved | pending-user | 快速样式分类切换后应自动回到目录顶部 |
| PUI-FB-0403 | style-utilities, color, config-provider, preview-site, miniprogram | capability-gap | medium | resolved | pending-user | 快速样式需要可直接使用的精选色彩 utility |
| PUI-FB-0404 | navbar, navigation-menu, switch, miniprogram | visual-layout | high | resolved | pending-user | Navbar 与 NavigationMenu 小程序示例混淆组件主体和页面控制 |
| PUI-FB-0405 | miniprogram, layout, navigation, form, data-display, feedback, advanced | visual-layout | high | resolved | pending-user | 六个小程序分区的独立组件页缺少代表场景与统一内容质量门禁 |
| PUI-FB-0406 | miniprogram, component-page, button, scroll-area, sticky, virtual-list | visual-layout | medium | resolved | pending-user | 小程序双操作行应等分两列且滚动示例需要足够验证空间 |
| PUI-FB-0407 | scroll-area, navigation-menu, miniprogram | visual-layout | high | resolved | pending-user | ScrollArea 缺少统一尾部安全区并导致 NavigationMenu 末项展开受阻 |
| PUI-FB-0408 | steps, stepper, button, input, miniprogram | visual-layout | high | resolved | pending-user | Steps 连线与 Stepper 三段控件未共享稳定组合坐标 |
| PUI-FB-0409 | indexes, button, cell, miniprogram | visual-layout | high | resolved | pending-user | Indexes 独立页内容过短且活动字母错位低对比 |
| PUI-FB-0410 | miniprogram, collapsible, scroll-area | bug | high | resolved | pending-user | 首页返回后丢失上次展开分区和阅读位置 |
| PUI-FB-0411 | checkbox, miniprogram | visual-layout | high | resolved | pending-user | Checkbox 文案、未选轮廓和组选中态不可读 |
| PUI-FB-0412 | radio, miniprogram | visual-layout | high | resolved | pending-user | Radio 文案、未选轮廓和组选中态不可读 |
| PUI-FB-0413 | input-otp, miniprogram | visual-layout | high | resolved | pending-user | InputOTP 空输入格在无边框外观下不可辨 |
| PUI-FB-0414 | select, button, popup, icon, miniprogram | api-contract | high | resolved | pending-user | Select 可见选项层使用系统 Picker 而非 PUI 组件 |
| PUI-FB-0415 | sidebar, miniprogram | ai-usability | medium | resolved | pending-user | SideBar 恢复入口示例语义不清 |
| PUI-FB-0416 | picker, date-time-picker, popup, button, miniprogram | visual-layout | high | resolved | pending-user | Picker 与 DateTimePicker 弹层丢失标题和确认操作区 |
| PUI-FB-0417 | stepper, miniprogram | visual-layout | medium | resolved | pending-user | Stepper 独立页主控件未在内容区水平居中 |
| PUI-FB-0418 | calendar, button, icon, miniprogram, preview-site | visual-layout | high | resolved | pending-user | Calendar 月份导航右箭头被自定义组件宿主推离可见区域 |
| PUI-FB-0419 | upload, button, icon, progress, miniprogram, preview-site | visual-layout | high | resolved | pending-user | Upload 单文件失败态重复且 Retry 在窄屏退化为无文案大按钮 |
| PUI-FB-0420 | miniprogram, tabbar, icon, card, button, scroll-area | capability-gap | medium | resolved | pending-user | 第三 Tab 需要真实 Codex 快速开始页与 Skill 留白 |
| PUI-FB-0421 | miniprogram, tabbar, card, avatar, input, button, cell, toast | capability-gap | medium | resolved | pending-user | 第四 Tab 账户页只保留昵称与真实服务入口 |
| PUI-FB-0422 | miniprogram-home, scroll-area | bug | high | resolved | pending-user | 首页从组件页返回后分区锚点覆盖原阅读位置 |
| PUI-FB-0423 | popup, config-provider | visual-layout | high | resolved | pending-user | Popup Footer 操作轨未明确全宽且全局毛玻璃未作用遮罩 |
| PUI-FB-0424 | sticky, component-page-navbar | bug | high | resolved | pending-user | Sticky 独立页未计入组件 Navbar 高度 |
| PUI-FB-0425 | navbar, preview-site | capability-gap | medium | resolved | pending-user | Navbar 缺少左右 Slot 组合与对称胶囊演示 |
| PUI-FB-0426 | tabs, preview-site | visual-layout | high | resolved | pending-user | Tabs 在毛玻璃外观下把每个 Tab 渲染成独立按钮轮廓 |
| PUI-FB-0427 | steps | visual-layout | medium | resolved | pending-user | Steps 连线未留出图标中心两侧间距 |
| PUI-FB-0428 | indexes | visual-layout | medium | resolved | pending-user | Indexes 默认滚动预算不足影响连续浏览 |
| PUI-FB-0429 | sidebar | visual-layout | medium | resolved | pending-user | Sidebar 选中态在原图标外追加 Check 造成重复信息 |
| PUI-FB-0430 | field, input | bug | high | resolved | pending-user | Field 独立页输入控件未以可编辑单元格变体组合 |
| PUI-FB-0431 | checkbox, icon | accessibility | medium | resolved | pending-user | Checkbox 勾选标记需要明确 PUI Icon 与圆心对齐 |
| PUI-FB-0432 | card, preview-site | visual-layout | medium | resolved | pending-user | Card 演示缺乏真实任务层级和不可操作归档状态 |
| PUI-FB-0433 | dialog, popup, overlay | visual-layout | high | resolved | pending-user | Dialog Header Footer 与遮罩外观未与 Popup 结构一致 |
| PUI-FB-0434 | list, preview-site | visual-layout | low | resolved | pending-user | List 独立页条目数量不足以展示连续列表行为 |
| PUI-FB-0435 | swipe-cell, button | visual-layout | high | resolved | pending-user | SwipeCell 果味外观下动作底板透出且未闭合圆角 |
| PUI-FB-0436 | count-down | visual-layout | medium | resolved | pending-user | CountDown 时分秒单位在窄宽下被挤压断行 |
| PUI-FB-0437 | swiper, image | visual-layout | medium | resolved | pending-user | Swiper 演示缺少图片底板且错误重试未形成独立全宽行 |
| PUI-FB-0438 | table, checkbox | visual-layout | medium | resolved | pending-user | Table 选择 Checkbox 被固定列边界塑造成独立容器 |
| PUI-FB-0439 | brand-identity, icon | design-decision | medium | resolved | pending-user | 公司书写 Logo 以 poemcoder-mark 正式接入 pui-icon |
| PUI-FB-0440 | miniprogram, cell, popup, tag, icon, top-loading, button | capability-gap | medium | resolved | pending-user | 我的页缺少更新公告且共享云服务边界未建立 |
| PUI-FB-0441 | picker, popup, date-time-picker, preview-site, miniprogram | api-contract | high | resolved | pending-user | Picker / DateTimePicker 默认图标 Header 与 Classic 底部模式 |
| PUI-FB-0442 | input, button, miniprogram-me, preview-site | api-contract | medium | resolved | pending-user | Input 尾部保存操作与清除按钮需要统一组件轨道 |
| PUI-FB-0443 | top-loading, preview-site, miniprogram-advanced-page | api-contract | high | resolved | accepted | TopLoading 需要区分未知进度、精确零值与真实完成 |
| PUI-FB-0444 | dynamic-message, button, icon, loading, preview-site, miniprogram-advanced-page | preview-parity | high | resolved | pending-user | DynamicMessage 需要 retained update、队列和双阶段变形动效 |
| PUI-FB-0445 | select, button, popup, preview-site | visual-layout | medium | resolved | pending-user | Select 选中 Option 未继承全局圆角 |
| PUI-FB-0446 | combobox, sidebar | visual-layout | medium | resolved | pending-user | 独立选中 Surface 未完整跟随组件语义圆角 |
| PUI-FB-0447 | miniprogram-me, popup, scroll-area | visual-layout | high | resolved | pending-user | 更新公告缺少唯一 ScrollArea 与 78vh 内容上限 |
| PUI-FB-0448 | miniprogram-home, tag | capability-gap | low | resolved | pending-user | 首页缺少与 npm 包同源的当前版本标识 |
| PUI-FB-0449 | miniprogram-home, icon, collapsible | visual-layout | low | resolved | pending-user | 首页高级分区缺少语义标记且 premium 视觉基线偏低 |
| PUI-FB-0450 | popup, top-loading | api-contract | high | resolved | pending-user | Popup 内的 TopLoading 错贴在 Content 顶部 |
| PUI-FB-0451 | miniprogram, tabbar, scroll-area, card, empty, loading, top-loading | capability-gap | high | resolved | pending-user | 安装一级页需要由共享云驱动页面与未来 Skill 内容 |
| PUI-FB-0452 | miniprogram, tabbar, card, avatar, input, button | visual-layout | medium | resolved | pending-user | 我的页资料版头不应重复展示昵称和编辑框 |
| PUI-FB-0453 | miniprogram, card, input, cell, cell-group | visual-layout | medium | resolved | pending-user | 我的页服务 CellGroup 需要避让资料输入区的投影 |
| PUI-FB-0454 | miniprogram, button, icon, tabbar | visual-layout | low | resolved | pending-user | 我的页客服入口应进入 Navbar 左 Slot |
| PUI-FB-0455 | h5, miniprogram, npm, skill, documentation | ai-usability | high | investigating | accepted | 公共发布准备需要真实快速开始、Beta 边界与 AI Skill |

## PUI-FB-0001 · Style Utilities 缺少显式深色条件变体

- 原始记录：`feedback/records/pui-fb-0001-style-utilities-dark-variants.json`
- 范围：`component` / `style-utilities`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-17
- 用户目标：像 Tailwind dark variant 一样，为同一节点组合默认样式与明确的深色覆盖，并能在文档中筛选查看。
- 实际问题：普通颜色类会跟随主题 Token，但无法表达只在 dark 范围覆盖某一组合的意图，文档也没有独立深色分类。
- 决策：新增 32 个 pui-dark-* 文字、背景、边框和阴影变体，只在 .pui-theme--dark 同根或后代范围生效。
- 理由：保留 Token 自动主题能力，同时允许用户明确表达深色覆盖；命名静态、可打包、符合微信 WXSS 能力。

AI 必须遵守：

- 需要条件覆盖时组合默认类与 pui-dark-*，不要把普通 Token 跟随误写成显式 dark variant。
- 不要生成运行时 JIT、任意值或无法进入静态 WXSS 的 dark 类。
- 跨自定义组件边界使用 dark utility 前检查 custom-class、externalClasses 和样式隔离。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`wechat-cli build-npm`
- 真机/兼容风险：ConfigProvider slot、自定义组件 custom-class 和样式隔离边界仍需合法 AppID 真机确认。
- 真机/兼容风险：跨组件优先依赖继承 Token，pui-dark-* 用于页面 WXML 或明确开放 externalClasses 的根节点。

## PUI-FB-0002 · Style Utilities 分类与实时预览没有形成真实浏览链路

- 原始记录：`feedback/records/pui-fb-0002-style-utilities-preview-browser.json`
- 范围：`component` / `style-utilities`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：通过组件化分类快速筛选常用 utility，并确认选择的类真实作用于预览和生成的 WXML。
- 实际问题：旧分类只是不可点击文字，用户必须在右栏 select 中寻找；实时区显示类名但没有应用对应 utility，容易产生假预览。
- 决策：使用 PoemUI Button、Card、Icon、Tag 建立布局、尺寸与间距、字体与内容、背景与外观、主题与行为五类浏览器和四种主题视图，并把实时组合类真实挂载到组合节点。
- 理由：用户可以在主预览区直接筛选和比较；小程序与 H5 使用同一五类，Props、DOM、computed style 与生成 WXML 共享同一状态。

AI 必须遵守：

- 不要把 class 字符串展示当作样式已经生效，必须检查真实节点和 computed style。
- 文档分类优先使用 PoemUI 自身 Button、Card、Icon、Tag 形成真实组合样例。
- 筛选动作、Props 面板、WXML 示例和预览 DOM 必须共享同一状态。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：H5 镜像不能替代微信真机对 WXML、rpx 和组件样式隔离的最终确认。

## PUI-FB-0003 · 官网左右导航栏滚动时没有稳定撑满可视高度

- 原始记录：`feedback/records/pui-fb-0003-preview-site-full-height-rails.json`
- 范围：`global` / `preview-site`、`style-utilities`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-17
- 用户目标：官网左右导航栏在长文档滚动时持续占满顶栏以下的可视区域，主页面保持唯一纵向滚动上下文。
- 实际问题：旧布局的高度和 overflow 上下文分散，长页滚动后左右 rail 不能可靠保持相同的可视高度。
- 决策：以 57px 顶栏 Token 统一左右 rail 的 sticky top 和 100dvh 剩余高度，并保持 viewport 负责页面纵向滚动。
- 理由：左右 rail 的几何关系可直接验证，避免父级 overflow 意外成为 sticky 容器，同时移动端维持单列布局。

AI 必须遵守：

- 不要在 sticky rail 的祖先上建立意外的纵向 overflow 滚动容器。
- 修改顶栏高度时同步更新 --pui-site-topbar-height，并实测左右 rail 的 top、bottom、height。
- 桌面布局改动后必须复核 390px 页面级 scrollWidth。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：100dvh 在旧版移动 WebView 的动态工具栏行为仍需目标设备复核。

## PUI-FB-0004 · Dialog 分区间距与 Footer 区内间距缺少层级

- 原始记录：`feedback/records/pui-fb-0004-dialog-equal-action-spacing.json`
- 范围：`component` / `dialog`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：Dialog Header、Content、Footer 的分区间距应比面板和 Footer 区内间距大一级；Footer 左右、底部和按钮间仍须严格等距并使用统一 PUI Token。
- 实际问题：旧合同把 Content→Footer 也当作 Footer 区内间距并锁定为 28rpx/14px，无法表达用户确认的‘分区更宽、区内更紧’层级。
- 决策：保留 --pui-dialog-action-spacing=28rpx/14px 管理面板和 Footer 区内关系；新增 --pui-dialog-section-spacing 指向全局 --pui-section-gap=36rpx/18px，使用 Dialog Surface 的 grid gap 管理三区。
- 理由：36→28 建立清晰的区间/区内层级；Grid gap 只作用于真实渲染的语义区域，不再依赖各区 margin 拼接布局。

AI 必须遵守：

- 生成或修改 Dialog 时，Header↔Content↔Footer 必须使用 --pui-dialog-section-spacing。
- Dialog 面板安全内距及 Footer 左右、底部、按钮 gap 使用 --pui-dialog-action-spacing，不得混入 section spacing。
- 验收时分别测量 36rpx/18px 分区和 28rpx/14px 区内关系，不能只看单个 margin。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 与 WXSS Token 已保持 1px≈2rpx，但 28rpx 在不同微信设备上的视觉密度仍需真机验收。

## PUI-FB-0005 · 官网五项视觉偏好统一组件化、持久化与主题边界

- 原始记录：`feedback/records/pui-fb-0005-preview-global-preference-switches.json`
- 范围：`global` / `preview-site`、`switch`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：官网的大圆角、毛玻璃、阴影、渐变背景和深浅色必须使用同一种 PUI Switch 交互，并在刷新或再次访问时恢复全部选项值；渐变背景全局生效且兼容浅色与标准中性深色。
- 实际问题：原实现先只有 theme 写入 poemui-preview-theme，shadow、frost、radius 固定初始化且顶部存在两套控件；四项收口后又缺少 gradient 偏好模型、Switch、持久化字段和主题安全的背景 Token。
- 决策：五项入口统一使用 PUI Switch H5 镜像；以 poemui-preview-preferences JSON 对象保存 theme/shadow/frost/radius/gradient，逐项白名单校验，并继续读写旧主题键以兼容已有访问者。渐变通过 data-gradient 与 --pui-global-gradient-background 只作用于 App Shell、透明 Stage 和 PreviewDevice：浅色使用 #fafafa/#f4f4f5，深色使用 #09090b/#111113 和白灰微光，组件 Surface 不变。
- 理由：统一控件减少维护分支和认知成本，单一偏好对象可原子恢复完整视觉环境；把渐变限制在背景画布可避免容器套容器和组件视觉污染，浅深中性 Token 保持主题一致；保留旧键迁移避免升级后丢失用户已选主题。

AI 必须遵守：

- 修改官网全局视觉设置时，深浅色、阴影、毛玻璃、大圆角和渐变背景必须继续复用同一 PUI Switch 结构。
- 新增或调整站点偏好时必须白名单校验持久化值，存储异常时安全回退，不能让非法值进入 data 属性。
- 验收全局视觉偏好时必须逐项切换后刷新，并验证状态、aria-checked 和实际视觉 data 属性同时恢复。
- 渐变背景只能作用于 App Shell、透明 Stage 和 PreviewDevice 背景，禁止给组件 Surface 或布局根增加渐变。
- 浅色渐变只用 #fafafa/#f4f4f5 中性层，深色保持 #09090b/#111113 与白灰微光，禁止靛蓝、蓝紫色偏。
- 渐变开关不得改变 padding、gap、尺寸、圆角、Tabs 坐标、设备高度或横向溢出。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：该持久化只属于 H5 官网偏好；微信小程序业务端应继续由消费者通过 ConfigProvider 和自己的存储策略管理。

## PUI-FB-0006 · Dialog Close 必须属于平衡 Header，而非绝对定位浮层

- 原始记录：`feedback/records/pui-fb-0006-dialog-close-icon-button.json`
- 范围：`component` / `dialog`、`button`、`icon`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：Dialog Close 必须属于 Header，标题保持几何居中，且不把历史 header-left Slot 伪装成当前公开能力。
- 实际问题：绝对定位和历史 header-left 合同会让标题几何与真实公开 API 脱节。
- 决策：保留平衡三列 Header，但左轨为内部空轨；Close 继续由 PUI Button + Icon 组合，删除 header-left 公开合同与 absolute/top/right。
- 理由：这同时满足标题几何、可访问 Close 和 TDesign 实际 Slot 边界。

AI 必须遵守：

- Dialog Header 必须保持等宽左轨、标题、等宽右 Close。
- 除真实 WXML Slot 外不得在 API、合同或示例宣传 header-left。
- Close 禁止 absolute/top/right，必须复用 PUI Button 与 Icon。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：微信端 Header 文本基线、触摸反馈、图标光学中心和 rpx 尺寸仍需合法 AppID 真机复核。

## PUI-FB-0007 · 全局 UI 缺少可执行的语义间距层级

- 原始记录：`feedback/records/pui-fb-0007-global-ui-semantic-spacing.json`
- 范围：`global` / `preview-site`、`style-utilities`、`dialog`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：全部组件、预览和后续 Agent 必须按相同语义使用 PUI 组件、Token、容器、字体和间距规则，并把约束固化到仓库文件而不是依赖对话记忆。
- 实际问题：初版规则虽然已集中到合同，但官网最终级联仍把 Token 当作数值别名而非语义边界：PreviewDevice 的 padding 和演示根 gap 随历史规则漂移，透明分组与可见 Surface 的 padding 职责没有被专项测试区分，逻辑轴 padding 也逃过旧扫描。
- 决策：保留 --pui-section-gap=36rpx/18px 与 36/28/20/16/12/8rpx 层级。PUI-FB-0038 将 PreviewDevice 的 padding 职责移入唯一滚动 viewport 内的共享父布局：普通组件由 14px base + 14px shadow bleed 合成 28px，屏幕附着组件为 0px edge-to-edge，直接演示根保持 8px content gap+margin 0。站点 Header/Stage 继续使用独立 --pui-site-* gutter Token。
- 理由：Token 只有同时锁定语义消费者与最终级联才不会退化成换名字的魔法数；区分站点 gutter、可见 Surface 和透明分组根可以在不移动固定 Tabs 的前提下统一组件预览节奏。

AI 必须遵守：

- 修改组件前先按关系判断是分区、面板、列表、内容组合、控件内部还是紧密信息，再选择对应 PUI Token。
- 标准 PreviewDevice 外框不直接持有组件 padding；普通组件使用 28px shadow-safe 父布局，屏幕附着组件使用 0px edge-to-edge，直接演示根固定使用 8px content gap 且 margin 为 0。
- 透明分组根可以 padding 0，但任何带背景、边框、阴影或毛玻璃的可见 Surface 必须自行消费 panel padding。
- 官网页面 gutter 使用独立 --pui-site-* Token，不得借用组件 panel/content Token，也不得改变固定 Tabs 坐标。
- 新增 spacing 声明不得直接写 px/rpx；只有 pui-sr-only 的 -1rpx 是无障碍裁切例外。
- 父组件只管理 Slot 的排列和 gap，不穿透覆盖 PUI 子组件自己的 padding、尺寸、圆角和对齐。
- 涉及 UI 合同时同步更新 docs/UI_DESIGN_CONTRACT.md、双端实现、Feedback Ledger 和自动测试。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：全局 Token 与 WXSS 已通过静态合同，仍需消费者用合法 AppID 对不同设备密度和自定义 Slot 组合做真机复核。

## PUI-FB-0008 · H5 Tag 被拉伸且文字未居中

- 原始记录：`feedback/records/pui-fb-0008-tag-preview-centering.json`
- 范围：`component` / `tag`、`dialog`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：Dialog 默认 Slot 中的 Tag 必须一眼可识别为 Tag，保持内容宽度、标准 padding、标准圆角，并让文字水平垂直居中。
- 实际问题：旧 H5 Tag 被 Grid 拉伸至整行，最终 justify-content=normal，文字明显靠左；28px 高和 round 圆角又使它更像输入框而不是 Tag。
- 决策：全局 H5 Tag 明确使用 inline-flex、双轴居中、24px 高、8px 水平 padding和 small radius；Dialog Slot 的直接 Tag 使用 max-content 与 justify-self:center。
- 理由：Tag 自身负责内部几何，Slot 只负责外部排列；同时修复全局镜像和局部拉伸，才能避免同类问题在其他预览复现。

AI 必须遵守：

- 生成 Tag 镜像时必须同时保留 inline-flex、align-items:center 与 justify-content:center。
- 在 Grid Slot 中放置 Tag 时使用容器对齐或 max-content，不覆盖 Tag 自己的 padding。
- 验收 Tag 时同时测量元素宽度、文字左右留白、默认尺寸和圆角，不能只检查 text-align。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 已按 1px≈2rpx 镜像原生 Tag；小程序自定义组件宿主在不同基础库中的 Grid 收缩仍需合法 AppID 真机复核。

## PUI-FB-0009 · H5 Dialog 通配直接子节点规则覆盖语义分区

- 原始记录：`feedback/records/pui-fb-0009-dialog-preview-direct-child-cascade.json`
- 范围：`component` / `dialog`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：Dialog Content 必须按 16rpx/8px 垂直组合正文、默认 Slot 和运行状态，不能因预览站旧样式横排、重叠或破坏三区结构。
- 实际问题：旧通配直接子节点规则把所有 div 子区当成动作行，覆盖 Content 的 Grid 语义，导致三个内容子项横排并互相挤压。
- 决策：将通配直接子节点选择器收窄为语义化 .pui-dialog__actions，并用契约测试禁止恢复通配规则。
- 理由：父容器只能按明确角色管理子区；语义选择器可避免未来增加 Slot、状态层或 Header action 时再次被旧级联误伤。

AI 必须遵守：

- 新增或修改组件分区时，禁止用标签类型选择器推断子节点角色。
- 父级预览样式只能命中明确的语义类，不得覆盖 Slot 子组件或其他分区的 display/gap。
- 390px 验收 Content 时要测量计算 display、直接子项间距和重叠，而不只观察 Dialog 外框。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本问题仅存在于 H5 预览级联；原生 WXML/WXSS 不受影响，但仍需通过真实小程序 Slot 组合验收视觉一致性。

## PUI-FB-0010 · H5 全局大圆角未传递到组件语义圆角

- 原始记录：`feedback/records/pui-fb-0010-global-large-radius-semantic-tokens.json`
- 范围：`global` / `preview-site`、`tag`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：官网全局“大圆角”必须作用于 Tag 等 PUI 组件的语义圆角，而不只是改变页面和面板容器；显式 round/circle 形状仍保持满圆。
- 实际问题：H5 大圆角开关只改变站点外壳和部分容器，Tag 继续读取未变化的 --pui-preview-radius-small=6px，用户无法从组件本身看到全局设置生效。
- 决策：在 H5 data-radius=large 根节点整体重映射五档组件语义圆角，数值按 1px≈2rpx 对齐小程序；Tag 默认 small 跟随模式，round/circle 保持 999px，mark 仅语义小圆角端跟随。
- 理由：全局模式必须改变语义 Token，而不是逐组件追加选择器；这样所有正确消费 Token 的组件会自动同步，同时保留显式几何形状。

AI 必须遵守：

- 实现全局大圆角时必须修改语义 Token 根值，禁止逐组件堆叠 data-radius 选择器。
- 验收 Tag 时同时测量普通与大圆角模式；small 应为 6px→9px，round/circle 始终为满圆。
- H5 五档圆角必须与小程序 18/28/40/48/56rpx 保持 1px≈2rpx 镜像。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：小程序源码 Token 映射已存在且通过静态合同；不同基础库下 ConfigProvider 类名继承与自定义组件样式隔离仍需合法 AppID 真机复核。

## PUI-FB-0011 · Dialog 默认预览堆叠工程诊断面板并留下空黑舞台

- 原始记录：`feedback/records/pui-fb-0011-dialog-preview-engineering-panels.json`
- 范围：`component` / `dialog`、`preview-site`、`button`、`icon`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：Dialog 默认预览必须像真实用户路径，只保留打开入口和弹窗本体；隐藏后不能留下空黑底，组件下方不能堆叠方法、事件链和内部状态卡，图标与文字必须按 PUI Button 合同对齐。
- 实际问题：旧预览把实例方法、事件链和布局枚举作为三个额外块堆在 Dialog 下方；关闭后只剩空舞台和黑色嵌套 Surface，close() 工程按钮还受通用 demo 样式影响而发生 Icon 对齐与文字裁切问题。
- 决策：默认预览只保留一个 PUI Button 打开入口与受限 Dialog 舞台；移除 open()/close() 方法栏、运行状态、事件链和布局枚举卡。Dialog 不增加私有 canvas/card Surface，改为与其他组件复用全局固定 PreviewDevice；所有 Dialog 动作统一启用 PUI Button previewContract。
- 理由：演示区应回答用户如何触发和使用组件，工程诊断属于代码、API 或 PROP；统一设备边界负责稳定尺寸和滚动，Dialog 自身只负责浮层 Surface，避免重复面板。

AI 必须遵守：

- 不得在默认预览下方堆叠 open()/close()、事件链、受控状态或布局枚举卡；这些信息进入代码、API 或 Inspector。
- 浮层隐藏时显示真实触发入口，并保持固定舞台边界，禁止留下空黑 Surface 或点击后持续长高。
- 浮层已经是 Surface 时不得在全局 PreviewDevice 内再套装饰性 phone/card；演示动作必须使用 PUI Button/Icon 的真实镜像合同。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次默认预览信息层级调整仅影响 H5 官网；原生 Dialog API 与 WXML/WXSS 未变化，真机仍需合法 AppID 验证 Header Slot、Popup 遮罩与触摸关闭。

## PUI-FB-0012 · Style Utilities 缺少统一的 text-cut 单行省略入口

- 原始记录：`feedback/records/pui-fb-0012-style-utilities-text-cut.json`
- 范围：`global` / `style-utilities`、`typography`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-19
- 用户目标：把 text-cut 纳入 Style Utilities，形成可发现、可复用、跨小程序与 H5 一致的单行省略能力，同时明确它不能被用来掩盖关键内容或布局错误。
- 实际问题：公开工具层没有 pui-text-cut，团队容易重复手写 overflow/text-overflow/white-space，且缺少关于允许省略范围的约束。
- 决策：新增 pui-text-cut 作为单行省略主入口，与 pui-text-truncate 共享声明并保留兼容；同步 H5 镜像、Typography、Style Utilities、API、矩阵和示例，选择器总数更新为 521。
- 理由：别名不会破坏既有消费者，同时让团队按约定名称复用标准能力；文档明确省略只适用于可牺牲的次要单行信息。

AI 必须遵守：

- 新增单行省略时优先复用 pui-text-cut，禁止在页面私有样式重复手写三项声明。
- 按钮、主要状态、错误信息和用户必须读完的文本不得使用 text-cut。
- 出现裁切前先判断内容是否应删除、换行或修正容器；text-cut 只用于允许省略的次要单行信息。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`wechat-cli build-npm`
- 真机/兼容风险：微信 CLI build-npm 已以 touristappid 完成且 0 warnings，源码、dist、示例 node_modules、微信 miniprogram_npm 四路 utilities 哈希一致；自定义组件样式隔离下仍需通过公开 utilities 入口或明确 externalClasses 消费，合法 AppID 真机渲染待最终确认。

## PUI-FB-0013 · 标准组件页缺少概览 API PROP 信息架构

- 原始记录：`feedback/records/pui-fb-0013-component-page-tabs-information-architecture.json`
- 范围：`global` / `preview-site`、`tabs`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：所有标准组件页使用统一 Tabs 分类内容，概览只保留预览，API 与 PROP 各自承担明确任务，并彻底取消右侧 Inspector；Tabs 独占 Header 固定一级分类行，概览工具统一进入内容区透明工具栏，切换视图时 Tabs 不得跳位。
- 实际问题：旧页面使用私有预览/代码 Tab，右侧 Inspector 独立占列且 API 与预览混排；首轮重构把局部操作与 Tabs 放在同一行，二次拆行又在 API 用 display:none 折叠操作行；固定行高与稳定 DOM 后，桌面 Header 仍沿用垂直居中的 Flex，隐藏视图的机型和动作子节点仍被 hidden/display:none 移出布局，骨架合同没有彻底覆盖跨组件和空操作槽；重构完成后 H5 兼容文档还残留旧三列结构说明。
- 决策：标准组件页统一复用 PUI Tabs 的 H5 镜像；概览、API、PROP 互斥渲染，原常驻 Inspector 内容迁入 PROP，文档页用内联配置区承接原控制能力。Tabs 固定为 Header 中唯一 40px 一级行；桌面 Header 固定为标题说明 minmax(0,1fr) 与 270px 导航列的顶对齐 Grid。概览的模式、机型、刷新与重置迁入 PreviewDevice 上方的透明工具栏，模式在左，机型与动作整组居右；API/PROP 可整体隐藏该内容工具栏，PROP 重置在 Props 标题区。Tabs DOM 跨视图稳定复用，分类切换只刷新 Tabs 状态与主内容，并以 overflow-anchor 阻止滚动漂移。元素选择 Inspector 仍只作为概览内按需浮层，不承载元信息、WXML、兼容说明或完整 Props。
- 理由：三个视图分别回答看效果、查合同和调参数；Header 只承担分类，内容工具栏只承担概览操作，层级更清晰。固定导航列和稳定 Tabs 节点让几何不再依赖按钮数量或标题说明高度；透明工具栏的左右分组又让操作可扫描而不增加容器 Surface。

AI 必须遵守：

- 标准组件概览只能呈现统一预览容器和真实组件，不得追加 API、WXML 或工程诊断卡。
- API Reference 只进入 API；元信息、完整 Props、WXML 与兼容说明只进入属性页，禁止恢复常驻 Inspector 第三列。元素选择模式的上下文 Inspector 只允许显示当前元素相关的父组件公开 Props。
- Tabs 是一级分类并独占 Header 唯一一行；模式、机型、刷新和重置不得与 Tabs 并排。
- 概览工具必须进入 PreviewDevice 上方透明工具栏：模式切换在左，机型、刷新、重置和复制整组居右，复制固定在最右；API/PROP 可整体隐藏该内容工具栏。
- 桌面标准组件 Header 必须使用标题说明与固定导航列顶对齐的 Grid，禁止垂直居中让 Tabs 受两侧内容高度影响。
- 390px 下概览工具栏允许换行，但机型与动作组仍须右对齐；工具栏本体不得建立背景、边框、阴影或毛玻璃 Surface。
- Tabs 导航节点必须跨视图复用；切换只更新选中态、指示器和主内容，禁止通过 root.innerHTML + 全页面 render 重建公共导航，并必须保持当前滚动锚点。
- 概览刷新只重建演示运行态和滚动位置，必须保留用户已配置的 Props；概览重置与 PROP 重置必须共用同一默认值源并恢复默认 Props/运行态；API 不显示无关操作。
- WXML 示例默认省略与组件默认值相同的 Props，只输出调用者改动。
- 动态 PROP 内容的输入和复制交互必须绑定到持久父节点，不能依赖初始页面中不存在的静态节点。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只调整 H5 官网的信息架构，不改变小程序组件 API；真机组件行为风险不增加。

## PUI-FB-0014 · 组件预览缺少统一固定设备面板与空闲滚动条策略

- 原始记录：`feedback/records/pui-fb-0014-preview-device-fixed-scroll-surface.json`
- 范围：`global` / `preview-site`、`dialog`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：组件父容器应像固定手机屏幕一样始终有明确、统一的中性主题底色和固定高宽，长内容只在容器内部滚动，滚动条停止滚动时隐藏；设备外不再套一层不同底色的可见面板。
- 实际问题：普通组件虽然已有 622px 高度和内部 overflow，但外框合同曾分散；Dialog 先后通过透明 auto-height 外壳和 preview-canvas 私有 16px 外围内距绕过统一宽度。后续仍残留可见 preview-canvas 外层与 phone--dark 靛蓝私有主题，使深色页面、外层画布和设备出现三种底色。
- 决策：以唯一 PreviewDevice 统一设备边界：概览 Stage 直接挂载设备，删除可见 preview-canvas/body 外壳；设备 surface 读取全局 --page，桌面宽度读取机型 Token、高度固定 622px。内部 viewport 独占纵向滚动，thumb 默认透明并在滚动时短暂显示。PUI-FB-0038 进一步把父布局放入该 viewport：普通组件使用 28px shadow-safe，屏幕附着组件使用 0px edge-to-edge，外框只负责屏幕边界和裁切。
- 理由：唯一设备边界和统一中性主题让所有组件在同一可比较画布中运行，避免近似底色的多层面板竞争；内部滚动避免交互撑高页面，按活动状态显示滚动条既保留位置反馈，又减少常驻视觉噪音。

AI 必须遵守：

- 标准组件包括浮层组件不得建立透明或 height:auto 的 PreviewDevice 私有例外。
- Dialog 等浮层组件不得在 PreviewDevice 外再增加 preview-canvas 私有 padding；同机型同断点的设备外框宽度必须一致。
- PreviewDevice 桌面宽度跟随机型、高度固定 622px；390px 只收缩宽度且页面不得横向溢出。
- 长内容只能在 preview-device__viewport 内滚动，外框不得随交互增长。
- 预览滚动条默认隐藏，只在真实 scroll 活动期间显示，并在空闲后自动隐藏。
- 标准深色 PreviewDevice 必须继承 --page = #09090b，不得注入 phone--dark 等私有靛蓝主题。
- 概览 Stage 直接挂载 PreviewDevice，不得再套可见 preview-canvas 面板。
- 普通组件必须在 viewport 内使用 shadow-safe 父布局，屏幕附着组件必须使用 edge-to-edge；不得把 padding 放到滚动裁切层外。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只调整 H5 官网统一预览外壳；小程序各组件仍使用自身 scroll-view，真机滚动条、触摸惯性和嵌套滚动竞争需按组件合同复核。

## PUI-FB-0015 · H5 组合层绕过 PUI 子组件镜像

- 原始记录：`feedback/records/pui-fb-0015-h5-pui-icon-button-composition.json`
- 范围：`global` / `preview-site`、`button`、`input`、`select`、`switch`、`slider`、`textarea`、`cell`、`icon`、`badge`、`tag`、`bubble`、`grid`、`list`、`scroll-area`、`navigation-menu`、`virtual-list`、`indexes`、`sidebar`、`collapse`、`collapsible`、`swipe-cell`、`tabs`、`tabbar`、`steps`、`action-sheet`、`dropdown-menu`、`popup`、`sheet`、`popover`、`breadcrumb`、`radio`、`table`、`swiper`、`empty`、`alert`、`combobox`、`calendar`、`旧输入组合层`、`form`、`field`、`upload`、`search`、`stepper`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-20
- 用户目标：所有组件演示和组合操作尽可能调用 PoemUI 自己的组件；关闭、清空、翻页、步进、重试等纯图标动作必须统一使用 PUI Button + PUI Icon，尺寸、圆角和双轴居中不能因页面不同而漂移。
- 实际问题：旧 H5 为多个组件重复手写原生 button/input；同类操作出现私有尺寸、状态和 Surface。官网标准页、顶部四项外观开关与 Form/Field、旧输入组合层/Search/Stepper/Combobox 等演示曾只借用 class、静态原生控件或私有几何，没有通过 helper 建立真实组合树；Field 与 旧输入组合层 别名路由还会让输入 DOM 改变但运行态不回写。
- 决策：新增并扩展 Button/Icon/Input/Select/Switch/Slider/Textarea 等共享 helper，已识别的组件、官网基础设施、PROP 全字段与 Form/Field、旧输入组合层/Search/Stepper/Combobox 演示均迁入真实组合树；顶部四项外观也从静态复制迁入 switchPreviewMarkup。inputControlSample 现在承载 invalid/required/name/inputmode、clear、maxlength、range、align、bordered、autofocus 与演示事件标识；透明布局根退出全局 Surface 名单，嵌入 Input 与复合外壳只保留一个可见 Surface；别名路由统一经 previewIdFor 判定。标准页固定操作槽并删除滚动补偿，并以精确 raw-control boundary 合同证明其余原生节点只属于 helper、组件自身交互根或浏览器能力桥接。
- 理由：单一入口能同时继承尺寸、形状、禁用态、主题、动效和可访问名称；defaultSlot 让 Grid 等复合内容不必绕开 Button，同时保留父组件自己的排列职责和 option 语义。

AI 必须遵守：

- 关闭、清空、翻页、步进、重试、播放/暂停等纯图标操作必须调用 iconButtonSample，不得手写原生 button。
- 纯图标按钮必须有可访问名称，空 content 节点必须 display:none，Icon 与 Button 中心偏差必须为 0。
- 迁移 PUI 子组件时保留父容器的排列职责，但尺寸、圆角、禁用态和主题由 PUI Button 合同负责。
- 复合 Button 内容必须通过 buttonSample.defaultSlot 组合，按需传入 role、ariaSelected 或 ariaExpanded；不得只给原生 button 添加相似类名。
- Grid 等默认 Slot 内的 Badge 必须调用 badgeSample，不得手写私有徽标节点。
- 原生复合组件使用 Cell/Badge/Button 时，H5 必须调用对应共享镜像助手；List 条目不得用私有 button 重写 Cell，演示操作不得绕过 Button。
- Tag Close 等组件自有交互根保留平台节点与 Icon 组合，不得为了扫描结果再包一层 Button；H5 尺寸必须镜像 28rpx 容器与 24rpx Icon，并提供键盘操作。
- Bubble 的展开和 Reaction 属于可组合操作，必须调用 buttonSample；Bubble Surface 才属于组件自有交互根。
- NavigationMenu 根入口必须调用 buttonSample 并组合 badgeSample，默认菜单项必须调用 cellSample。
- VirtualList 外层保留 listitem 根，内部 Badge/Cell 调用共享助手。
- Combobox Trigger/Option 保留组件自有交互根，多选值直接调用 closable tagSample；禁止再包 raw button 或重复 Close Icon。
- Indexes 默认条目必须调用 cellSample，徽标调用 badgeSample，箭头调用 iconComponent；禁止手写 raw button、badge span 或字符箭头。
- Search 镜像不得渲染原生 WXML 不存在的组件目录结果或四条数据块。
- Sidebar 默认条目必须调用 buttonSample.defaultSlot，并组合 badgeSample/Icon/Loading；禁止只给 raw button 添加 PUI class。
- Collapse Trigger 与 SwipeCell Content 属于组件自有交互根，不得机械套普通 Button；H5 必须补 Enter/Space 与 source=keyboard。
- Tabs、Tabbar、Steps 的原生入口已经组合 PUI Button，H5 必须调用 buttonSample.defaultSlot；Tabs/Tabbar 徽标必须调用 badgeSample，并保留选择语义与 source=keyboard。
- Cell/Radio 保留组件根，但内部 Badge/Loading 必须调用共享助手，Radio Enter/Space 必须回传 source=keyboard。
- Table 选择列必须调用 checkboxSample，Swiper 加载态必须调用 loadingComponent；禁止私有 Checkbox Mark、加载指示器或重复 keyframes。
- Collapsible、Table、Swiper 等复合组件的默认 error/empty 必须调用 emptySample；默认 loading 的文字也必须进入 loadingComponent，不得在父状态层重拼 Icon、标题、加载指示器或 Action。
- 嵌入式 Empty 只移除重复 Surface，必须保留 PUI Empty 的内容、字号、small 内距、语义和 Button/Icon 组合；自身透明且无边框、阴影、毛玻璃和圆角，外观模式只作用于宿主状态 Surface。消费者 custom empty Slot 保持原合同。
- Combobox、VirtualList 的 Error 使用 Empty 内置 Action；NavigationMenu 使用兄弟 Retry Button；List 正文 Error 不含 Action且 Retry 只在 Footer。消费者 custom empty Slot 不得替换为默认 Empty。
- Calendar、Dialog 的 Error 使用 Empty + 兄弟 Retry Button；Collapse、Radio、Upload 使用 Empty 内置 Action。Radio/Upload 的 custom Slot 保持消费者组合，父状态区不得覆盖 PUI Button 几何。
- 新增或移除原生 pui-empty 组件时必须同步状态组合合同覆盖清单，不能只让 WXML 复用而让 H5 回退私有状态树。
- H5 为组件根补充 Enter/Space 时，事件来源必须标记 keyboard；longpress 组件的 role=button 不能成为键盘无效入口，manual 模式除外。
- 组件自身的交互根可以使用平台原生节点；不要为了静态消除原生 button 而给 Collapse Trigger、Calendar 日期格或 Rate 命中区再套 PUI Button。
- 共享 PUI Icon/Loading 的几何必须通过 helper 参数按原生 rpx 精确传递；父组件只管理排列、颜色和位置，禁止覆盖子组件 width/height/padding/border-radius 或使用 !important。
- Button 内 Icon/Loading 必须镜像 22/26/32/38rpx 四档；Checkbox、Switch、Tabbar、Steps 等使用各自原生尺寸，禁止统一回退为 generic small。
- 新增或移除原生 pui-loading 组合时必须同步 H5 Loading 覆盖清单；不存在原生公开合同且不可达的 Choice 等私有镜像必须删除。
- 官网组件目录、复制、分类和资源选择必须调用共享 Button/Icon/Badge helper；只添加 pui class 或复制组件 CSS 不算复用。
- 官网标准页概览/API/PROP 必须调用 buttonSample，刷新/重置必须调用 iconButtonSample；节点首次挂载后只更新状态，禁止用 innerHTML 清空 Button + Icon Slot 树。
- 官网搜索和机型选择必须调用 inputControlSample/selectControlSample；原生 input/select 只能位于 helper 平台层，搜索不得索引或朗读 done、成熟度等开发状态。
- 左侧目录搜索与 Icon 资源搜索必须共用 inputControlSample(prefixIcon='search')；筛选重建列表后恢复焦点和光标，不得维护 .search/.icon-search 私有表单皮肤。
- 站点控件存在标准尺寸需求时新增明确的站点语义 Token，并通过未定义变量扫描；禁止借用无关间距 Token 或引用不存在的 step。
- PROP 文本/数值、枚举/nullable boolean、boolean、range、JSON 必须分别调用 Input、Select、Switch、Slider、Textarea helper；renderPropsPanel 不得直接拼平台控件或覆盖子组件几何。
- PROP 回写后必须恢复当前字段焦点；JSON/nullable number 解析失败时保留上次有效 Props，设置 aria-invalid 和真实错误边界，禁止静默吞错或伪造成功。
- Form 字段及 Field 的 Input Slot 示例必须调用 inputControlSample；父级只管理标签、反馈、方向和 gap，不得手写 input、嵌套 label、覆盖 Input 几何或把透明布局根加入全局 Surface 名单。
- 旧输入组合层、Search、Stepper、Combobox 的 H5 必须调用 inputControlSample，由 helper 传递 prefix/clear/maxlength/range/align/bordered 与事件；Showcase/Panel 不得手写 input。
- 复合输入只允许一个可见 Surface：Search/Combobox 可由 Input field 承担外观，旧输入组合层/Stepper 由外壳承担；嵌入 Input 不得再获得 border/radius/shadow/blur。
- preview/index.html 只能保留 PUI 控件 Mount；顶部外观设置必须调用 switchPreviewMarkup，禁止静态复制 Switch 的 track/thumb/button DOM。
- H5 raw button/input/select/textarea 只允许存在于共享 helper、组件自身交互根或浏览器能力桥接，并由精确 owner/数量合同锁定；页面和复合层不得通过扩大 allowlist 绕过 PUI 复用。
- 组件存在 shadcn 等别名路由时，H5 事件分支必须通过 previewIdFor(state.current) 判断组件身份，禁止直接比较 state.current 导致可见控件变化但运行态不回写。
- Tabs 必须由固定两行和固定机型/动作槽保证位置；无操作视图只用 visibility/disabled/aria-hidden，禁止 hidden/display:none 折叠，也禁止 getBoundingClientRect + window.scrollBy 事后补偿。
- Icon 资源卡必须调用 iconComponent，不得直接注入 icon.svg；站点事件标识只能通过 buttonSample 的安全 dataAttributes 传递，禁止覆盖平台或演示保留字段。
- Button 被组合为资源卡等常驻 Surface 时，必须显式使用 surface、border 与 data-shadow 语义 Token；不能让 outline/text 变体的透明底和无阴影规则覆盖宿主外观。
- 新增 H5 组合操作后必须在 390px 和四项外观模式同时开启时验证无页面横向溢出。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次修复 H5 镜像与官网组合；原生端已使用 PUI Button/Icon，微信真机的样式隔离、触摸反馈和系统字体基线仍需合法 AppID 复核。
- 真机/兼容风险：HTTP 局域网使用 execCommand 复制回退；Codex 浏览器控制面不能读取该旧式剪贴板内容，因此本轮只确认真实返回值、反馈和 PUI Button/Icon DOM 未被破坏，最终粘贴内容仍需人工浏览器复核。HTTPS 安全上下文使用异步 Clipboard API。

## PUI-FB-0016 · H5 组件引用未定义视觉 Token 导致样式静默失效

- 原始记录：`feedback/records/pui-fb-0016-h5-undefined-shadow-token.json`
- 范围：`global` / `preview-site`、`calendar`、`dialog`、`combobox`、`action-sheet`、`upload`、`table`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：深浅色、阴影、毛玻璃和大圆角不仅要切换根节点状态，还必须真实作用于所有相关 PUI 组件并保持统一 Token 合同。
- 实际问题：根节点和 Switch 状态虽然正确切换，但未定义变量会让对应 CSS 声明在浏览器中静默失效。首次只清除 --shadow-card 后，仍有 10 个不同名称的失效引用，说明按已知名称写断言无法证明全站 Token 完整。
- 决策：删除全部 --shadow-card、--shadow-popup、--frost-filter 等无定义引用，普通 Surface 统一使用 --shadow-soft，浮层使用 --shadow，毛玻璃使用 --blur，交互/语义颜色与行高回归现有 Token；新增全样式表自定义属性引用扫描和真实计算样式验证。
- 理由：复用现有语义 Token 让四项外观与内容状态保持单一事实源；语法级扫描覆盖未来所有变量名，计算样式验证则证明根状态之外的组件声明真实生效。

AI 必须遵守：

- 新增或修改 H5 CSS Token 引用前必须确认定义存在；所有无 fallback 的 var(--*) 必须通过全样式表扫描。
- 普通组件 Surface 使用 --shadow-soft，浮层使用 --shadow，毛玻璃使用 --blur，不创建数值重复的私有别名。
- 组件运行变量必须由对应 helper 的 inline style 或 setProperty 明确提供；拼写缩写不能替代完整语义 Token。
- 验收阴影开关时除根 data 属性外，至少测量一个普通 Surface 和一个浮层 Surface 的计算 box-shadow。
- 阴影关闭时计算值应为 none；开启时需要非 none，并在 light/dark 下读取各自 Token。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本记录修复 H5 官网 Token；小程序端使用 --pui-shadow-* 原生 Token，不受 --shadow-soft 名称影响，真机阴影性能仍需目标设备复核。

## PUI-FB-0017 · H5 官网字体指标绕过 PUI Typography Token

- 原始记录：`feedback/records/pui-fb-0017-h5-global-typography-token-parity.json`
- 范围：`global` / `preview-site`、`typography`、`style-utilities`、`dialog`、`tabs`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：全部页面使用统一、清晰且可维护的 PUI 字体族、字号层级和行高；H5 不能与小程序或 Style Utilities 各自维护一套字体数值。
- 实际问题：旧 H5 虽有 Typography 文档演示，但全局组件样式仍大量写死数字并维护另一套根字体，因此文档、Style Utilities 与标准组件可能发生字体漂移，测试也只阻止小于 12px 的值而不能阻止重复实现。
- 决策：在 H5 根节点精确镜像公开 PUI Typography Token，所有官网字体声明统一改为 Token；比例行高进入主题并驱动 Style Utilities，同时新增全局扫描门禁。
- 理由：同名 Token 让小程序、H5、文档和工具类拥有单一事实源；扫描整个样式表比逐页抽样更能阻止后续组件重新写死字体指标。

AI 必须遵守：

- 新增或修改官网文字样式时必须选择现有 PUI 字体角色 Token，禁止直接写 px 字号、固定数字行高或数字字重。
- Caption 24rpx/34rpx（H5 12px/17px）是最小可见角色；辅助信息只能弱化颜色，不能继续缩小。
- 小程序与 H5 的同名字体 Token 必须保持 1px≈2rpx；深浅色、阴影、毛玻璃和大圆角不得改变字体指标。
- 比例行高工具必须读取主题 Token，不能在 Utilities 或组件页复制 none/tight/normal/relaxed 数值。
- 字体全局改动必须复验 390px 页面宽度、标准页固定 Tabs、Dialog 三区和四项外观持久化。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：系统字体的实际字形、基线和动态字体设置由设备决定；双端 Token 与构建产物已一致，微信真机回退字体和自定义组件样式隔离仍需合法 AppID 复核。

## PUI-FB-0018 · 标准组件概览混入工程诊断与重复标签

- 原始记录：`feedback/records/pui-fb-0018-standard-overview-component-only-hierarchy.json`
- 范围：`global` / `preview-site`、`dialog`、`popup`、`sheet`、`popover`、`action-sheet`、`dropdown-menu`、`overlay`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：标准组件的概览只保留稳定、可操作、用户能理解的真实组件预览，不显示 native mirror、方法名、事件链、受控状态、黑底诊断卡、重复组件标题或没有职责的底色容器；浮层关闭后仍能重新打开。
- 实际问题：旧预览把组件名、native mirror、受控状态、方法按钮排、事件链、runtime/platform/meta 与状态 Cell 一起堆在组件下方，形成黑底浮窗、面板套面板和过度工程化文案；即使诊断节点删除，部分纯布局 Stage/Canvas/Host 仍有独立底色、边框和阴影。
- 决策：新增统一 renderOverviewComponentPreview：先在离线 template 中删除 showcase label、methods/event/runtime/platform/meta、直接状态 Cell、after/boundary/summary/controls 与已知反馈节点，再转换 Slot、平台与原始值测试等实现文案，最后标记 data-preview-contract=component-only。概览 Stage 直接挂载 PreviewDevice；Dialog、Popup、Sheet、Popover、ActionSheet、已退役组件、DropdownMenu、Overlay 等纯布局 stage/canvas/host/frame/viewport 统一透明无边框无阴影，演示根铺满 PreviewDevice viewport，真实组件、scrim 和浮层保留自身 Surface。
- 理由：统一边界可以一次覆盖全部标准组件并防止新 Showcase 把调试面板泄漏回概览；在进入实时 DOM 前删除比 CSS 隐藏更符合可访问性和信息层级，独立真实触发入口又保证用户链路完整。

AI 必须遵守：

- 标准组件概览必须调用 renderOverviewComponentPreview，禁止直接挂载 renderComponentPreview 的原始 Showcase。
- showcase label、methods/event/runtime/platform/meta、直接诊断 Cell 和事件反馈必须在进入实时 DOM 前删除，禁止仅用 CSS 或 text-cut 隐藏。
- Slot、平台名、源码名、原始值与受控状态等实现词汇不得作为默认概览文案，应改成用户任务语言。
- Chart、Typography 等文档型能力不强制套 PreviewDevice，也不得用空手机壳冒充组件预览。
- PreviewDevice 内只负责定位、裁切或排列的 stage/canvas/host/frame/viewport 必须透明；真实组件、scrim 和浮层才可建立 Surface。
- 浮层的演示根和透明布局 Stage 必须铺满 PreviewDevice viewport，真实遮罩不得缩成组件附近的局部矩形底板。
- 每次新增或修改标准 Showcase 都要运行专项合同，并在 390px 全路由扫描空根、工程术语、诊断 class 和横向溢出。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次修改集中在 H5 官网信息层级，不改变原生组件 API 与 WXML；微信真机交互风险不增加。
- 真机/兼容风险：组件消费者传入的极端自定义 Slot 文案和第三方 generic 内容不经过官网固定样例归一化，仍需真实业务页面自行保证可读性。

## PUI-FB-0019 · 官网左侧目录缺少任务分类与全局快速抵达

- 原始记录：`feedback/records/pui-fb-0019-preview-navigation-taxonomy-command-search.json`
- 范围：`global` / `preview-site`、`input`、`button`、`icon`、`dialog`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：左侧导航需要按用户任务清晰分区，不能把绝大多数入口塞进一个 Components 大组；同时提供类似成熟组件库的 Ctrl/⌘ + K 全局搜索弹窗，让用户通过键盘快速抵达组件或规范。
- 实际问题：旧生成器把 shadcnCatalogItems 整体放入 Components 组件大组，已有 legacy 语义分类没有进入官网；站点也没有全局命令搜索状态、Mount、快捷键或键盘导航。
- 决策：以 metadata/components.js 为唯一分类源，将目录重建为九组中文优先任务分类，并通过 taxonomyId 把 shadcn 别名映射到对应 PoemUI 语义；左侧搜索保留原位过滤并以 PUI Button 后缀暴露 ⌘K。新增站点级搜索 Dialog，输入、结果、关闭分别调用 PUI Input、Button、IconButton，结果沿用同一分类并支持完整键盘与焦点闭环。
- 理由：任务分类帮助用户先按目的缩小范围，命令搜索帮助熟悉名称的用户直接跳转；二者共享同一生成数据可避免左栏、搜索和文档分类漂移，复用 PUI 组件可保持主题、圆角、阴影和无障碍一致。

AI 必须遵守：

- 官网左侧目录必须保持开始与规范、基础组件、布局、导航、数据录入、数据展示、反馈、浮层、高级九组，禁止恢复单一 Components 大组。
- 每个官网路由只能归属一个任务分类；左侧目录、全局搜索和生成文档必须读取同一 metadata 源。
- Ctrl/⌘ + K 快速搜索必须调用 PUI Input、Button、IconButton，并支持中文、英文和分类检索。
- 快速搜索必须支持 ArrowUp/ArrowDown 循环、Enter 打开、Esc 关闭、Tab 焦点圈、遮罩关闭和焦点恢复。
- 搜索语料和结果不得暴露 done、beta、experimental 或成熟度等开发状态。
- 命令弹窗必须固定最大边界、结果内部滚动，并验证 390px、light/dark 和五项外观模式无横向溢出。
- 站点 Ctrl/⌘ + K 不得写入或宣传为微信小程序的系统级快捷键能力。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：Ctrl/⌘ + K 只属于 H5 官网导航，不改变或扩展微信小程序的系统级快捷键能力。
- 真机/兼容风险：移动端系统软键盘和不同浏览器对 100dvh 的处理仍需目标设备复核。

## PUI-FB-0020 · 官网预览缺少元素选择与上下文 Props 编辑模式

- 原始记录：`feedback/records/pui-fb-0020-preview-element-selection-context-inspector.json`
- 范围：`global` / `preview-site`、`button`、`input`、`select`、`switch`、`slider`、`textarea`、`icon`、`dialog`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：官网预览提供可切换的常规和元素选择两种操作模式；选择预览中的不同对象时，在 PreviewDevice 左右两侧同时浮出等高等宽的工具面板，左侧编辑可自由输入的内容值，右侧编辑 Boolean、枚举、范围及其余相关 Props，并可真实调参。
- 实际问题：旧预览只有单一交互模式，没有元素到公开 Props 的语义映射、选中高亮、上下文调参面板或业务点击隔离；完整 Props 只能在独立 PROP 视图中使用。
- 决策：在标准概览内部增加复用 PUI Button/Icon 的常规与元素选择模式，并将模式组放在 PreviewDevice 上方透明工具栏左侧；机型、刷新和重置在同一栏右侧整组右对齐。选择模式在捕获阶段接管设备内 pointer/click 与 Enter/Space，按组件主体、Header、标题、Content、Footer、Close、主次操作、输入、遮罩、条目和组合子组件等语义分类并高亮。上下文 Inspector 只从当前组件公开 Prop 定义中过滤相关字段，再把 text/json/nullable-number 等自由输入内容值放入左卡片，把 Boolean、Select、Range 及其余设置放入右卡片；两侧继续复用完整 PROP 的 PUI 表单 helper、解析、错误边界和写回，没有字段时显示 PUI Empty。桌面双卡片绝对浮在固定设备左右两侧并共享 286×560px Token，间距共同使用 14px；窄屏变为预览底部等宽双栏覆盖。首次选中从设备两侧向外展开，关闭反向收回，切换元素轻量过渡，输入回写不重播入场，系统低动效为 1ms；整个浮层不建立第三列、不影响 PreviewDevice 几何。
- 理由：两种模式把看效果与查元素职责分开；左右分流又把自由输入内容与离散/布尔设置按真实操作方式分开，用户不用在一个长列表里交叉查找。捕获阶段门禁避免选择 Close、按钮或输入时意外改变业务状态，共用 Prop 定义与控件路径避免形成第二套调参系统，只暴露父级公开 API 则能保持组件封装边界。

AI 必须遵守：

- 常规模式必须保持所见即所得和真实业务交互；元素选择模式必须阻断设备内点击、Enter 和 Space 的业务副作用。
- 元素选择是语义化组件选择：空白区使用 default，可选择元素使用 pointer；不得用 crosshair 暗示坐标或像素拾取。
- 可选择对象按组件公开结构语义分类，不能依赖页面坐标或为单张截图硬编码选择区。
- 上下文 Inspector 只能从当前父组件公开 Prop 定义中过滤字段，并复用完整 PROP 的 PUI helper、校验和回写路径。
- 组合子组件没有父级公开映射时只显示边界说明，禁止伪造 Prop、直接改子节点样式或穿透私有状态。
- 上下文 Inspector 是概览内按需浮层而非常驻第三列；桌面必须分别浮在 PreviewDevice 左右两侧，窄屏使用底部等宽双栏覆盖，两种布局都不得改变固定设备尺寸。
- 左侧只放 text/json/nullable-number 等自由输入内容值；Boolean、Select、Range 及其余设置放右侧。两侧无字段时必须显示真实 PUI Empty，不得移动字段或制造假字段填满卡片。
- 左右卡片必须共享宽、高、间距、内距与 Surface Token，保持等高等宽；首次选中、切换元素、关闭分别使用可逆方向动效，输入回写不得重播入场，低动效统一为 1ms。
- 完整 Props、元信息、WXML 和兼容说明只存在于 PROP；上下文面板只提供跳转入口，不复制这些内容。
- 关闭面板、退出选择模式、切换组件、执行组件重置或进入 API/PROP 时必须清除选择和高亮。
- 模式按钮、关闭、完整 PROP 跳转、表单和空状态必须继续复用 PUI Button/Icon/Input/Select/Switch/Slider/Textarea/Empty 等现有组件。
- 模式切换必须位于概览透明工具栏左侧；机型、刷新和重置位于同栏右侧并整组右对齐，工具栏本体不得建立 Surface。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：元素语义分类和上下文 Inspector 只属于 H5 官网，不改变小程序组件公开 API 或 WXML。
- 真机/兼容风险：390px 底部等宽双栏覆盖已有静态响应式合同与横向溢出约束；当前内置浏览器不提供视口缩放接口，移动浏览器软键盘、触摸命中、极窄双栏可读性和辅助技术仍需目标设备复核。
- 真机/兼容风险：复杂消费者 Slot 无法可靠映射父级公开 API 时会明确显示无可编辑 Props，不允许穿透编辑子组件内部状态。

## PUI-FB-0021 · 概览缺少恢复组件默认样式的独立重置动作

- 原始记录：`feedback/records/pui-fb-0021-preview-component-default-reset.json`
- 范围：`global` / `preview-site`、`button`、`icon`、`tabs`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：概览与 PROP 都提供明确的重置按钮，让当前组件恢复 PoemUI 默认 Props 和默认运行态，而不是只能刷新演示或切换到 PROP 后重置。
- 实际问题：旧概览只有一个刷新 IconButton，故意保留用户配置 Props；PROP 的单一重置会删除 Props 并刷新运行态，但该能力没有在概览暴露，且刷新/重置由同一个动态按钮承担，语义容易混淆。
- 决策：概览透明工具栏右侧显示由 PUI Token 定宽的 Refresh 与 Undo 双 IconButton 操作组：前者只调用 refreshCurrentPreview，后者调用 resetCurrentComponent；PROP 在 Props 标题区使用独立 PUI Undo 节点，但与概览调用同一个 resetCurrentComponent/default Props 源。resetCurrentComponent 删除当前组件 Props 缓存，使 getProps 从 metadata/default 定义重建默认值，同时清理计时器、动画、请求、演示运行态、滚动位置和元素选择。站点外观偏好与机型不在重置范围。
- 理由：刷新和重置对用户数据的影响不同，必须并列且名称清楚；两个视图复用同一个函数和默认值源能阻止算法漂移，同时让 PROP 的重置留在当前任务附近。概览双按钮固定宽度并随机型整组右对齐，不再影响 Header Tabs。

AI 必须遵守：

- 刷新与重置必须是两个独立 PUI IconButton；刷新保留 Props，重置恢复默认 Props 和默认运行态。
- 概览与 PROP 可以使用各自位置的 PUI Reset 节点，但必须调用同一个 resetCurrentComponent/default Props 源，禁止复制重置算法。
- 组件重置必须清理计时器、动画、请求、演示状态、预览滚动和失效元素选择。
- 组件重置不得修改 theme、border、shadow、frost、radius、gradient、device 或本地偏好。
- 刷新与重置必须使用不同 Icon、title 和 aria-label，禁止使用含糊的“重新加载”覆盖两种行为。
- 概览双按钮操作组必须消费 PUI gap 和固定宽度 Token，与机型选择整组居右；PROP 的重置留在 Props 标题区，二者均不得移动 Tabs。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改变 H5 官网操作入口，不改变小程序组件 API、默认 Props 或 WXML。
- 真机/兼容风险：390px 下双按钮操作组由固定 Token 和契约测试约束；移动浏览器触摸目标与辅助技术仍需目标设备复核。

## PUI-FB-0022 · 预览模式与设备操作分散且工具栏层级过重

- 原始记录：`feedback/records/pui-fb-0022-preview-utility-toolbar-alignment.json`
- 范围：`global` / `preview-site`、`tabs`、`button`、`icon`、`select`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：把常规/选择元素、机型、刷新和重置统一到同一条无底色工具栏，模式在左，其余操作整组居右，同时让 Header 只承担 Tabs 分类，并为工具栏保留清晰的顶部内距。
- 实际问题：旧结构把设备与动作留在 Header 二级行，把模式切换单独放在有底色的区域；功能分散、容器层级偏多，且无法形成明确的左模式/右工具视觉分组。
- 决策：删除 Header 的二级操作行，Header navigation 只保留固定 PUI Tabs。概览在 PreviewDevice 前挂载统一透明工具栏：PUI 模式按钮组靠左，共享 PUI Select、Refresh IconButton、Reset IconButton 组成右侧工具组并通过 auto margin 贴右。桌面使用单行固定语义高度；390px 下模式组和右侧工具组分两行，右组仍靠右。API/PROP 隐藏概览工具栏；PROP 的同源 Reset 保留在 Props 标题区。
- 理由：分类、预览方式与设备操作各归其位后，用户能按左右分组快速理解工具职责；透明布局根避免再制造面板套面板，右侧整组对齐也能稳定不同控件的扫描顺序。

AI 必须遵守：

- 标准组件 Header 只承载唯一标题信息和固定 Tabs，不得放概览机型、刷新或重置。
- 概览模式、机型、刷新、重置和复制必须位于 PreviewDevice 上方同一透明工具栏。
- 模式切换在左；机型、刷新、重置和复制必须作为一个组通过 auto margin 居右对齐，复制固定在最右。
- 工具栏布局根必须透明、无边框、无阴影、无毛玻璃，不能形成第二层面板。
- 工具栏顶部内距固定消费 --pui-preview-content-gap（8px）并计入桌面与移动语义高度，禁止用外层 margin、空容器或魔法数补位。
- 390px 下可换为两行，但右侧工具组仍须右对齐，控件不得缩小到不可读或不可操作。
- 机型必须调用共享 PUI Select；刷新、重置与复制必须调用共享 PUI IconButton，不得手写原生控件。
- API/PROP 不显示概览工具栏；PROP 重置留在 Props 标题区并与概览共享 resetCurrentComponent/default Props 源。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只调整 H5 官网基础设施，不改变小程序组件 API 或 WXML。
- 真机/兼容风险：390px 换行与右对齐已有静态合同，真实移动浏览器字体回流、触摸与辅助技术仍需目标设备复核。

## PUI-FB-0023 · 官网缺少全局边框开关且实线工具类不可发现

- 原始记录：`feedback/records/pui-fb-0023-global-border-preference-and-solid-utility.json`
- 范围：`global` / `preview-site`、`switch`、`config-provider`、`style-utilities`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：在现有全局外观设置中增加可持久化的边框总开关，并让 Style Utilities 的 solid 边框能力可发现、可组合、双端一致。
- 实际问题：旧站点没有 border 偏好且 solid utility 不可发现；首版新增开关后又误把中性边框 Token 写在 App Shell 根作用域，组件与站点基础设施边界被一起关闭。
- 决策：以第六个共享 PUI Switch 增加 border=on/off，默认 on 并写入同一偏好对象。off 的 Token 重映射只挂在 .preview-device__viewport，使组件中性边框透明，同时让 PreviewDevice、API、PROP、导航、工具栏和文档面板继续读取站点根 Token。保留语义状态色与盒模型。复用已有 pui-border-solid，补齐视觉分类、实时组合、WXML、H5 镜像、文档和示例，不新增重复选择器。
- 理由：在组件 viewport 建立继承边界既能统一覆盖所有真实组件，又不会污染站点外壳；保留状态边界确保可访问性和操作反馈。复用已有 utility 避免同义实现漂移。

AI 必须遵守：

- 全局边框关闭不得使用 border:none 或清除焦点、错误、选中和危险操作边界。
- 官网边框 Token 重映射必须从 .preview-device__viewport 开始，禁止写在 App Shell 根节点并误伤 PreviewDevice、API、PROP、导航或文档面板；安装端使用 ConfigProvider 的 bordered/useGlobalConfig，不能照搬官网 DOM 作用域。
- 边框偏好必须使用共享 PUI Switch、白名单恢复并写入 poemui-preview-preferences.border。
- 实线边框使用 pui-border-solid，并与 pui-border 或方向边框类组合；不得重复创建同义 utility。
- 验收边框开关必须检查代表组件的计算样式和刷新持久化，不能只检查 data-border。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：官网偏好作用域已有浏览器验证；后续 PUI-FB-0025 已将 bordered 扩展为 ConfigProvider 消费者 API。pui-border-solid 和 Provider 的微信 npm 产物由静态合同覆盖，目标真机的 Token 继承与样式隔离仍需消费项目复核。

## PUI-FB-0024 · API 参数列表字号过小且缺少可选值列

- 原始记录：`feedback/records/pui-fb-0024-api-reference-readable-options-column.json`
- 范围：`global` / `preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：提高所有标准组件 API 列表的字号，并在演示初值右侧增加可选值列，用逗号分隔可选择内容。
- 实际问题：旧表只有四列、正文偏小，类型列同时承担数据类型和枚举集合，信息密度高且扫描困难。
- 决策：从既有 Prop 定义直接派生可选值：select 输出 options，boolean 输出 true/false，nullable boolean 补 null，range 输出上下界与步长，其余显示破折号。类型列恢复纯数据类型。表格正文提升到 body-medium 14px，五列在窄屏保持 820px 内容宽并由表格自身横向滚动。
- 理由：复用同一个 Prop 定义可避免 API 与 PROP 控件漂移；固定字号与表内滚动能在 390px 保持可读性且不制造页面级溢出。

AI 必须遵守：

- API 可选值必须位于演示初值右侧，枚举与布尔值用逗号分隔。
- 类型列只表达数据类型，不得重复可选值集合。
- API 表正文不得低于 --pui-font-size-body-medium；窄屏使用表内滚动，不得缩小文字或造成页面级溢出。
- 可选值优先读取 Prop options/min/max/step；没有约束时显示破折号，不得猜测。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：该改动只影响 H5 官网 API 表；移动浏览器的触摸横向滚动与系统字体差异仍需真实设备复核。

## PUI-FB-0025 · 安装端缺少跨页面统一组件主视觉的公共配置入口

- 原始记录：`feedback/records/pui-fb-0025-config-provider-global-visual-store.json`
- 范围：`component` / `config-provider`、`design-tokens`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：让安装 PoemUI 的消费者以一份配置统一控制所有页面组件的主题、阴影、毛玻璃、大圆角和边框，并获得明确、可复制的 ConfigProvider 使用说明。
- 实际问题：旧 ConfigProvider 没有边框 Prop、全局 Store、预设、总效果开关或跨页面同步能力，消费者只能在业务侧重复实现；官网也只展示局部 Props，无法指导真实安装使用。
- 决策：在 npm 入口公开 visualConfig 单例 Store，固定支持 theme/effectsEnabled/shadow/frostedGlass/largeRadius/bordered、standard/soft/glass 预设和 restore/set/applyPreset/setEffectsEnabled/reset/subscribe。ConfigProvider 新增 bordered/useGlobalConfig；每个页面根选择 use-global-config 后订阅同一 Store。App.onLaunch 只恢复存储，页面根 Provider 才承载组件树。渐变不进入 Store 或 Provider。
- 理由：小程序没有可覆盖全部页面的 App 级 WXML 根，Store + 每页根 Provider 能在遵守平台结构的同时维护唯一配置源。语义 Token 继承避免逐组件写 class，返回持久化结果使失败路径真实可处理。

AI 必须遵守：

- 跨页面视觉设置只写 visualConfig，不复制业务侧全局对象或直接修改 Provider 内部 class。
- App.onLaunch 调用 restore；每个页面根挂载 use-global-config Provider，小程序不存在一个可替代所有页面 Provider 的 App WXML 根。
- effectsEnabled 只总控 shadow/frostedGlass/largeRadius，theme 与 bordered 保持独立并保留原值。
- bordered=false 必须保留盒模型以及焦点、错误、选中和危险状态边界。
- 渐变是消费者页面画布能力，禁止加入 ConfigProvider Prop、visualConfig 预设或组件 Surface。
- set/applyPreset/setEffectsEnabled/reset 的 error 必须进入真实失败处理，不能宣称持久化必然成功。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`微信 CLI build-npm`
- 验证：`npm run pack:check`
- 真机/兼容风险：Store、Provider 源码与微信 npm 产物可由静态和 VM 合同验证，但多个真实 Page 并行挂载、wx storage 异常、系统 auto 主题回调及样式隔离继承仍需消费者使用合法 AppID 做最终真机复核。

## PUI-FB-0026 · 组件页 Header 信息冗余且 Tabs 选中态过弱

- 原始记录：`feedback/records/pui-fb-0026-compact-component-header-tabs-active-state.json`
- 范围：`global` / `preview-site`、`tabs`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：压缩页面 Header，尽量删除不必要内容，同时让右上角概览/API/PROP Tabs 的当前项清晰可辨。
- 实际问题：旧 Header 有重复分类信息和冗长描述，上下内距为 24px/17px；Tabs 选中项与非选中项的视觉差异不足。
- 决策：删除 Header 分类 Kicker DOM 及运行时写入；新增 componentSummaries 作为全量用户用途摘要源，保留 detail.desc 供 API/属性使用。Header 上下内距收为 12px，标题/摘要使用 PUI title-medium/body-small。Tabs 指示 Surface 使用 text/page 反色对比，focus-visible 保持独立；按用户最终决定不提供视觉 Hover。
- 理由：删除重复层级直接为预览释放空间；单独摘要源避免用视觉裁切掩盖冗长文案；中性反色选中态符合 PoemUI 黑白视觉并兼容深浅色。

AI 必须遵守：

- 标准组件 Header 不得恢复分类 Kicker 或重复页面标题。
- Header 摘要必须从 componentSummaries 读取，单条不超过 28 字符，不含工程词汇。
- 不得用 text-cut、ellipsis 或 overflow hidden 代替摘要文案压缩。
- Props、WXML、状态和兼容细节必须留在 API/属性。
- 页面 Tabs 活动项必须有主题感知的高对比 Surface，focus-visible 必须独立可辨；不得增加视觉 Hover。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只调整 H5 官网 Header 与页面级 Tabs，不改变小程序组件 API、WXML 或 WXSS。
- 真机/兼容风险：390px 真实移动浏览器字体回流、触摸与辅助技术仍需目标设备复核。

## PUI-FB-0027 · Dialog 不再把 loading/error/retry 伪装为根级公开状态

- 原始记录：`feedback/records/pui-fb-0027-dialog-error-header-retry-bounded-content.json`
- 范围：`component` / `dialog`、`loading`、`empty`、`popup`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：Dialog 只负责确认与承载关键内容；请求状态由内容 Slot 组合真实 PUI Loading、Empty、Button 和父级业务回写，不能留下伪状态 API。
- 实际问题：旧根级状态会把业务请求结果与 Dialog 容器混为一谈，并产生无法由组件真实完成的成功或重试暗示。
- 决策：移除根级 loading/error/empty/retry 与 Header Retry 规则；内容状态统一由消费者在公开 Slot 中组合，Dialog 保留有界 Content 布局和关闭事件。
- 理由：业务请求归属父级，Dialog 只提供可组合 Surface，才能避免 fake success 与重复状态机。

AI 必须遵守：

- 不得为 Dialog 新增 loading/error/empty/retry 根 Props。
- 需要请求状态时在 content/middle/actions Slot 组合 PUI Loading、Empty、Button。
- confirm/action 只能请求业务处理，不得自动写成功或关闭。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：微信端复杂 Slot 的动态高度、滚动、读屏与样式隔离仍需合法 AppID 真机复核。

## PUI-FB-0028 · 概览工具栏缺少按当前效果复制代码的入口

- 原始记录：`feedback/records/pui-fb-0028-preview-current-effect-code-copy.json`
- 范围：`global` / `preview-site`、`button`、`icon`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：在预览工具栏最右侧提供复制按钮，让用户直接复制与当前组件展示 Props 对应的代码，并通过注释理解视觉环境和运行态边界。
- 实际问题：旧概览没有复制入口；PROP 虽能复制 makeUsageCode，但不能从当前预览任务直接触发，也没有统一的当前视觉环境注释。
- 决策：在刷新、重置之后追加最右侧 PUI Copy IconButton。复制继续调用 makeUsageCode，并先通过 usagePropEntries 读取同一默认 Prop 源；头部注释记录当前组件、非默认 Props、theme/bordered/shadow/frostedGlass/largeRadius 和 gradientBackground，明确渐变属于页面画布，打开/滚动/焦点/动画属于临时运行态。成功切换为 Check，失败切换为 ErrorCircle，并通过 aria-live 回传；1.2 秒后恢复 Copy。
- 理由：复用 PROP 真相源可保证两个入口输出一致，默认值过滤避免把组件默认合同写死；注释能解释视觉效果中哪些由 ConfigProvider 提供、哪些不能安全转换为小程序 Props。将复制固定在最右符合完成预览后导出结果的自然顺序。

AI 必须遵守：

- 工具栏复制必须调用 makeUsageCode/usagePropEntries，禁止维护第二套 WXML 生成器。
- 复制代码只输出非默认 Props；组件默认值不应被写死。
- 复制注释必须说明当前全局视觉配置、渐变画布边界和临时运行态不序列化。
- 禁止抓取 H5 DOM 或 computed style 生成小程序代码。
- 复制必须使用最右侧 PUI IconButton，并提供成功、失败和 aria-live 反馈。
- 390px 下三按钮操作组必须保持右对齐且不得产生页面横向溢出。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：局域网 HTTP 环境通常不能使用 Clipboard API，真实复制依赖浏览器对 document.execCommand('copy') 的兼容；失败时必须保持失败反馈，不能伪报成功。
- 真机/兼容风险：复制内容记录站点视觉环境但不自动包裹消费者页面；每页根 ConfigProvider 和页面渐变仍需按业务工程结构接入。

## PUI-FB-0029 · 页面 Tabs 动画不稳定且 PROP 文案过度工程化

- 原始记录：`feedback/records/pui-fb-0029-stable-page-tabs-animation-properties-label.json`
- 范围：`global` / `preview-site`、`tabs`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：标准组件页 Tabs 使用稳定、克制且不易错位的切换动画，并把面向开发实现的 PROP 标签改成用户可理解的属性。
- 实际问题：旧实现通过 indicator.style.left/width 更新选中块并同时动画两项几何属性；第三个标签和相关可访问文案显示 PROP。
- 决策：页面 Tabs 固定使用 repeat(3, minmax(0, 1fr)) Grid；选中 Surface 宽度固定为三分之一，由 data-active-view 的 overview/api/prop 语义状态分别映射 translate3d(0/100%/200%)。过渡只包含 transform 与主题颜色，消费 --pui-duration-normal / --pui-ease-standard，现有低动效媒体查询继续压缩为 1ms。第三项及 Inspector 跳转统一显示属性，内部 state.view=prop 和 class 名保持兼容。
- 理由：轨道、按钮和选中块宽度都不随切换改变，浏览器只合成 transform，避免布局计算和双属性追赶；语义 data 状态比运行时测量更容易测试。保留内部 prop 标识避免无价值的路由迁移，用户层则使用自然中文。

AI 必须遵守：

- 标准组件页用户可见 Tabs 固定为概览/API/属性，不得重新显示 PROP。
- 页面 Tabs 使用固定三等分 Grid，按钮和轨道几何不得随切换改变。
- 选中块只能通过 transform 在固定轨道间移动，禁止动画 left/width 或测量 DOM 尺寸。
- Tabs 动效使用 --pui-duration-normal / --pui-ease-standard，系统低动效必须压缩为 1ms。
- 切换只更新 data-active-view、aria-selected、tabIndex 与内容，不得重建 Tabs DOM。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只修改 H5 官网页面级 Tabs 和用户文案，不改变小程序组件 API、WXML 或 WXSS。

## PUI-FB-0030 · 标准页 Tabs 不使用视觉 Hover

- 原始记录：`feedback/records/pui-fb-0030-page-tabs-dark-hover-contrast.json`
- 范围：`global` / `preview-site`、`tabs`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：标准组件页 Tabs 不提供额外视觉 Hover，只保留稳定、明确的选中态与键盘焦点态。
- 实际问题：旧实现存在非选中 :hover 规则；首轮修复又新增主题 Hover Token。用户明确要求不要 Hover，因此两种实现都不再符合最终交互合同。
- 决策：彻底删除 --pui-site-tabs-hover-background、主题映射、背景色 Hover 过渡和页面 Tabs 私有 :hover。Tabs Button 基础规则显式设置 transparent background 与 border-color，以较高特异性覆盖通用 PUI Button Hover Surface；保留 transform-only 高对比选中滑块、文字选中过渡和 focus-visible 轮廓。
- 理由：页面一级分类已经通过固定高对比滑块明确当前视图；取消 Hover 可减少状态噪音和跨主题适配面。基础透明规则比单纯删除 :hover 更可靠，因为它同时封住通用 Button 样式回流。

AI 必须遵守：

- 标准组件页面 Tabs 禁止新增私有 :hover 视觉规则或 Hover Token。
- Tabs Button 基础 background 与 border-color 必须保持 transparent，防止通用 PUI Button Hover 泄漏。
- 取消 Hover 不得删除高对比选中滑块、aria-selected 或键盘 focus-visible。
- 深浅色验收必须确认非选中 Tabs 指针经过前后视觉样式不变。
- 通用 PUI Button 仍可保留自身 Hover；无 Hover 决定只作用于页面分类 Tabs。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次仅取消 H5 页面级 Tabs 的指针 Hover，不改变小程序组件 API、触摸反馈或通用 PUI Button 的 Hover 合同。

## PUI-FB-0031 · 顶栏六项外观开关收纳为单一外观菜单

- 原始记录：`feedback/records/pui-fb-0031-topbar-appearance-menu.json`
- 范围：`global` / `preview-site`、`button`、`icon`、`switch`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：主页面右上角不再平铺六个详细外观开关，只保留一个外观图标按钮并用一个菜单收纳全部设置；后续允许在按钮左侧增加一个派生的果味复合预设 Switch。
- 实际问题：六个 Switch 虽已复用 PUI 组件并持久化，但入口层级没有收纳，仍直接与品牌和导航并列。
- 决策：Topbar 静态 HTML 继续只保留 previewPreferenceControls Mount；运行时调用 iconButtonSample + medium palette Icon 渲染唯一 36px 外观入口，使用 aria-haspopup=dialog、aria-expanded 和 aria-controls 连接非模态菜单。菜单内部按单列等宽行调用六次 switchPreviewMarkup；打开聚焦首个 Switch，Esc 关闭并恢复入口焦点，点击外部关闭。菜单使用 PUI Token、主题 Surface、normal/standard 动效和低动效覆盖，六项持久化模型完全不变。
- 理由：单入口降低顶栏噪音并释放导航宽度，菜单仍保留设置的可发现性；继续复用既有 PUI helper 和存储真相源可避免重新实现控件或引入第二套状态。非模态 dialog 语义比 menuitem 更适合承载多个可交互 Switch。

AI 必须遵守：

- Topbar 详细外观设置只允许一个 PUI IconButton 入口，禁止重新平铺六个详细 Switch；左侧允许一个由六项真相源推导的复合预设 Switch。
- 外观入口必须调用 iconButtonSample + palette Icon，菜单内每项继续调用 switchPreviewMarkup。
- 所有 PUI IconButton 的空内容 Slot 必须 display:none，不能让空节点与 gap 破坏图标双轴居中。
- Switch 菜单使用非模态 dialog 语义，不要把 role=switch 降级成普通 menuitem。
- 菜单必须维护 aria-expanded/controls/hidden/inert，打开聚焦首项，Esc 恢复入口焦点，点击外部关闭。
- 菜单宽高、padding、gap、圆角、Surface 和动效必须消费 PUI Token，390px 不得横向越界，低动效为 1ms。
- 收纳入口不得改变六项本地持久化字段、默认值、组件作用域或 ConfigProvider 合同。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只重组 H5 官网 Topbar 基础设施，不改变小程序组件 API、ConfigProvider 或安装端 visualConfig；触摸端辅助技术仍需目标设备复核。

## PUI-FB-0032 · 顶栏增加一键果味复合外观预设

- 原始记录：`feedback/records/pui-fb-0032-fruit-flavor-appearance-preset.json`
- 范围：`global` / `preview-site`、`switch`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：在外观图标按钮左侧增加一个一键果味 Switch；开启组合毛玻璃、大圆角、阴影并关闭边框、渐变，当前配置只要偏离果味组合就自动关闭。
- 实际问题：原实现没有复合预设入口；六项只能分别调整。
- 决策：在外观 IconButton 左侧调用 switchPreviewMarkup 渲染“一键果味”。fruit 预设固定为 shadow=on、frost=on、radius=large、border=off、gradient=off；关闭应用 standard=off/off/normal/on/off。两者都不包含 theme。previewAppearanceMatches 对五项逐项全等，syncFruitFlavorControl 据此更新 checked；所有写入继续调用 storePreviewPreferences，不增加 fruit storage 字段。移动端 Topbar 改用 position:relative 激活既有 z-index，保证毛玻璃开启时菜单仍高于页面内容。
- 理由：派生状态保证快捷入口永远反映真实效果，复用现有偏好存储可让刷新自然恢复；主题保持独立，用户可在浅色和深色下使用同一果味视觉。主动关闭恢复标准组合，符合 Switch 的双向操作预期。

AI 必须遵守：

- 果味开启固定为 shadow/frost/radius 开、border/gradient 关；关闭恢复 standard，theme 始终不变。
- 果味 checked 必须逐项比较真实偏好，禁止创建独立 Boolean 或 storage key。
- 用户在外观菜单修改任一果味字段后，syncShell 必须立即让果味 Switch 反映新的匹配结果。
- 果味入口必须调用 switchPreviewMarkup，并位于外观 IconButton 左侧，不能手写 Switch DOM。
- 390px 验收必须同时检查品牌与控件不重叠、详细菜单不越界和页面无横向溢出。
- 果味开启毛玻璃时必须验证移动端外观菜单的 elementFromPoint 命中菜单自身，不能只检查 aria-expanded。
- 官网果味预设不得冒充安装端 visualConfig 公共预设。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次果味是 H5 官网预览捷径，不新增安装端 visualConfig 预设；消费者若需要同名预设，应另行明确公共 API 与版本迁移。

## PUI-FB-0033 · 常规预览组件用法层级与容器过重

- 原始记录：`feedback/records/pui-fb-0033-preview-normal-current-code-card.json`
- 范围：`global` / `preview-site`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：标准组件常规模式左侧要成为可连续阅读和滚动的正文，而不是工程调试卡或两块独立滚动面板；组件引用与基础用法按自然文档流展示，代码仍保留明确的代码样式和可读排版。
- 实际问题：字体资源和外层 pre 已成功切到 JetBrains Mono，但实际承载源码的内层 code 命中了浏览器 User Agent 默认 font-family: monospace，覆盖了父级继承；此前只读取 pre 的计算样式，因此错误地把外层声明生效当成实际文字生效。
- 决策：继续复用 elementInspectorMount 作为常规正文与选择模式 Inspector 的互斥挂载点，并保持 article 单一纵向滚动。H5 官网自托管官方 JetBrains Mono v2.304 Regular WOFF2，以独立族名 PoemUI JetBrains Mono 注册、preload 并由 --pui-font-family-mono 优先消费；小程序主题继续只包含系统回退。代码 pre 使用标准 Body Medium 14px/20px，关闭 liga/calt；其内层 code 显式 font-family:inherit，确保浏览器默认 code 字体不能绕过 Token，所有语法 span 继续继承。代码 Surface、行号、主题语法色、键盘焦点与 overflow-x:auto 保持。previewCodeSectionSources 仍只调用 makeUsageCode；基础去注释并以 80 字符软上限、每行最多 3 个属性排版。原有 622px 左区、393×622px 设备、14px 间距、390px 有界正文和同一设备 transform 动效保持不变。
- 理由：字体文件加载成功不等于实际字符已经使用该字体；必须沿 pre→code→语法 span 检查最终计算样式。给 code 显式 inherit 是最小且语义正确的修复，可继续由父级 PUI Token 统一控制。独立 Web Font 族名排除本机同名字体碰撞，14px/20px 使用现有 Body Medium Token 提升可读性。

AI 必须遵守：

- 常规模式组件用法固定按组件引用小标题/代码块、基础用法小标题/代码块自然连续展示；不得用 Tabs 隐藏另一段，也不得切成独立纵向滚动卡片。
- 组件用法正文根只负责透明布局和唯一纵向滚动，禁止总 Header、常驻默认值说明、背景、边框、圆角、阴影、毛玻璃和 panel padding。
- 代码块必须使用 PUI code Surface、border、radius、mono Token、行号、主题语法色、键盘焦点和必要横向滚动；不得设置固定分区高度或独立纵向滚动。
- 可见基础、可见引用、工具栏复制和属性页 WXML 必须调用同一 makeUsageCode 真相源，禁止维护第二份字符串拼接。
- 可见卡片暂不显示注释；工具栏复制继续过滤默认 Props，并用注释明确视觉环境与临时运行态边界。禁止抓取 H5 DOM 或计算样式生成小程序代码。
- 多行 WXML 开始标签以 80 字符为软上限、每行最多 3 个属性成组放置 Props 与事件，不得机械地让每个属性独占一行，也不得缩小字号换取密度。
- 代码块使用 PUI mono/body-small/line-height、content/section gap、Surface 和 motion Token；外层不得冒充 panel 消费 panel padding。
- 代码字体必须统一读取 --pui-font-family-mono；源码阅读区关闭 liga/calt 连字，不得额外引入页面私有字体。
- H5 代码字体必须由官网同源自托管 JetBrains Mono WOFF2，并保留系统等宽回退；禁止依赖访问者本机安装或第三方字体 CDN。
- 官网字体资源不得进入小程序 npm 安装包；代码块只使用 Regular 时不得打包无用字重。
- 设置代码字体后必须检查 pre、code 和实际语法 span 的计算字体；内层 code 必须 font-family:inherit，不能让浏览器默认 monospace 绕过 PUI Token。
- 代码必须保留缩进和换行，显示行号与主题兼容语法色，并提供键盘焦点和必要横向滚动；纵向只滚动正文。
- 桌面常规模式必须把 PreviewDevice 对齐 Stage 右侧 gutter，并让正文从左侧 gutter 自动撑满至设备前；不得继续使用 Inspector 固定宽度。窄屏使用左下有界正文并吃满可用宽度，不得产生页面横向溢出。
- 选择元素模式必须取消常规模式的不对称分配，让 PreviewDevice 恢复 Stage 几何中心，保证双侧 Inspector 对称。
- 桌面当前代码区与 PreviewDevice 必须共同读取 622px 设备高度 Token；不得复用 Inspector 的 560px 高度。
- 常规/选择元素模式切换必须保留同一个 PreviewDevice DOM 和运行态，只通过 transform 与共享 normal/standard Token 改变位置；禁止重建 Stage，低动效压缩为 1ms。
- 常规正文与元素选择双侧 Inspector 必须互斥；切换选择元素后正文立即退出，不得重叠或恢复常驻第三列。
- 所有代码文本必须先按 Token 安全转义再插入高亮标记，消费者 Props 不得形成 HTML 注入。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：该卡片只属于 H5 官网，不改变小程序组件源码、API 或安装产物。
- 真机/兼容风险：桌面与 390px 的正文几何、滚动边界和深浅色已完成真实浏览器复核，最终视觉偏好仍等待用户在已运行的 4179 页面验收。
- 真机/兼容风险：真实移动浏览器的触摸惯性、软键盘和辅助技术朗读顺序仍需目标设备复核。

## PUI-FB-0034 · 官网共享下拉菜单与浮层缺少完整深浅色合同

- 原始记录：`feedback/records/pui-fb-0034-preview-menu-theme-coverage.json`
- 范围：`global` / `preview-site`、`select`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：机型切换菜单及所有组件菜单、浮层必须完整兼容深浅色，不能只修当前页面；共性问题应在共享 PUI 层一次收口。
- 实际问题：旧机型与属性枚举虽有 PUI 外壳和 Chevron Icon，但点击后打开的是浏览器原生选项层；该层无法由现有 PUI Surface 合同稳定控制。其他自定义浮层已大多使用主题 Token，但没有统一的全站扫描约束与原生表单 color-scheme fallback。
- 决策：保留原生 select 作为 sr-only、aria-hidden、tabindex=-1 的值和事件桥接；可见 UI 改为共享 PUI Button combobox Trigger、PUI Button option、PUI Chevron/Check Icon 与 manual Popover Menu。Menu 进入 Top Layer并按触发器和视口定位，支持外部点击、滚动/resize 关闭、Enter/Space、ArrowUp/Down、Home/End、Esc、Tab 和焦点恢复。属性回写重绘后把焦点恢复到新 Trigger，禁止聚焦隐藏 select。App Shell 与 input/select/textarea/option 同步 color-scheme；新增全站自定义浮层 Surface 扫描。
- 理由：共享实现一次覆盖机型和所有枚举属性，避免逐页补色；隐藏原生 select 继续复用现有 data-prop、解析和事件路径，不建立第二套状态。Top Layer 解决属性面板 overflow 裁切，Token Menu 让两种主题、外观开关和低动效均可预测。

AI 必须遵守：

- 机型、完整属性和上下文属性只能调用共享 selectControlSample，不得恢复页面私有 select 皮肤。
- 可见 Select 必须组合 PUI Button Trigger/Option 与 PUI Chevron/Check Icon；原生 select 必须 sr-only、aria-hidden、tabindex=-1。
- 选择后必须写回隐藏 select 并派发 bubbling input/change，继续走同一个 Props 解析和校验路径。
- 属性重绘后的焦点必须恢复到新生成的可见 combobox Trigger，禁止聚焦 aria-hidden 原生 select。
- 所有 Menu、Dialog、Popover、Dropdown、Combobox、NavigationMenu 与站点菜单必须使用主题 Surface/文字/边界 Token。
- 深浅色验收必须真实展开菜单或浮层并读取计算样式，不能只检查根 data-theme 或折叠态触发器。
- App Shell 与原生 input/select/textarea/option 必须同步 light/dark color-scheme，并为原生 option 提供 Token fallback。
- 菜单键盘合同至少覆盖 Enter/Space、ArrowUp/Down、Home/End、Esc、Tab、外部关闭和焦点恢复；低动效压缩至 1ms。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次重构属于 H5 官网基础设施，不改变小程序原生 Select/Picker 的 WXML、WXSS 或 API。
- 真机/兼容风险：390px 由 Menu 最大宽高、视口 padding、Top Layer 与既有无横向溢出合同约束；当前内置浏览器无视口缩放接口，真实移动浏览器触摸、屏幕键盘和辅助技术仍需目标设备复核。
- 真机/兼容风险：Popover API 不支持的旧浏览器会退回 aria-hidden 定位层；目标现代浏览器已验证 Top Layer，兼容基线需随官网浏览器策略持续复核。

## PUI-FB-0035 · Dialog 规则缺少独立组件语义合同

- 原始记录：`feedback/records/pui-fb-0035-dialog-dedicated-semantic-contract.json`
- 范围：`component` / `dialog`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：为 Dialog 建立一份后续 Agent 必须读取的专属文档，完整说明三区、间距、Slot、状态、预览和跨端规则，避免设计决策散落后被遗忘。
- 实际问题：旧规则虽然分别存在于全局合同、API、Ledger 和测试中，但缺少单组件的聚合语义入口；Agent 可能只读取某一份文件，遗漏其他已确认设计决策。
- 决策：新增 docs/components/README.md 作为组件语义合同索引，并新增 DIALOG.md 作为首份专属合同。AGENTS.md 强制修改前读取对应合同；README、CONTRIBUTING 和 COMPONENT_API 建立入口；test-dialog.js 把合同存在性与关键语义纳入自动门禁。后续 PUI-FB-0037 已把范围扩展为所有组件按修改即迁移建立合同，仍禁止批量空壳。
- 理由：API、Ledger 和语义合同职责分离：API 列能力，Ledger 记问题与决策证据，专属合同聚合当前不可破坏的最终规则。自动测试保证文档不是无人读取的孤岛，同时避免把全部组件细节继续堆进 AGENTS.md。

AI 必须遵守：

- 修改 Dialog 源码、H5 镜像、示例、元数据或 Token 前，先完整阅读 docs/components/DIALOG.md，再查询 dialog Feedback Ledger 原始记录。
- Dialog 结构、Slot、Token、状态优先级、预览或跨端边界变化时，必须同时更新专属合同和 scripts/test-dialog.js。
- 专属合同只记录长期语义和禁止事项，不复制完整 Props 表；API 清单继续以 COMPONENT_API.md 为准。
- 所有组件合同按真实 battle 和修改即迁移逐个建立，禁止批量生成没有证据和测试的空壳文档。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`node scripts/test-dialog.js`
- 验证：`git diff --check`
- 真机/兼容风险：本次只增加治理文档和合同测试，不改变 Dialog WXML、WXSS、JS、H5 运行态或 npm 安装产物；真机风险沿用现有 Dialog Ledger。

## PUI-FB-0036 · Dialog 默认取消操作不应使用线框按钮

- 原始记录：`feedback/records/pui-fb-0036-dialog-default-cancel-normal-button.json`
- 范围：`component` / `dialog`、`button`、`h5-preview`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：让 Dialog 默认 Cancel 使用正常的中性按钮，不以 outline 线框制造额外边界；Confirm 继续用主色表达主要动作。
- 实际问题：默认 Cancel 在小程序和 H5 两端都被硬编码为 outline，导致次要动作依赖额外线框建立层级，与当前克制边框的视觉偏好不一致。
- 决策：移除小程序 WXML 与 H5 镜像中默认 Cancel 的 outline 设置，让它使用 Button 默认 base 中性样式；Confirm 保持 primary base。自定义 actions 数组和 actions Slot 仍可由调用者显式选择 variant。
- 理由：默认动作应提供克制且稳定的主次层级。中性与主色已足够表达 Cancel/Confirm，去掉线框也符合边框总开关与 Less is more 原则，不改变按钮尺寸、操作区等距或业务语义。

AI 必须遵守：

- 生成 Dialog 默认 Footer 时，Cancel 不传 outline，Confirm 使用 primary base。
- Cancel 与 Confirm 的主次层级由中性/主色表达，继续保持同尺寸和共享 Footer gap。
- 自定义 actions 或 actions Slot 可以显式配置 variant，默认合同不得覆盖调用者选择。
- 小程序和 H5 镜像必须同步，专项测试要阻止默认 outline 回归。

验证与遗留风险：

- 验证：`node scripts/test-dialog.js`
- 验证：`npm run miniprogram:build`
- 验证：`npm run example:install`
- 验证：`微信开发者工具 CLI build-npm`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 CLI 已使用 touristappid 完成 build-npm 且 0 warnings，源码、dist、示例安装和 miniprogram_npm 一致；合法 AppID 真机的最终视觉仍需消费者在实际主题和业务文案下验收。

## PUI-FB-0037 · 每个组件都需要可执行的专属语义合同

- 原始记录：`feedback/records/pui-fb-0037-all-components-semantic-contract-workflow.json`
- 范围：`global` / `documentation`、`agent-workflow`、`all-components`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：让每个组件最终都有独立语义合同，并给新会话一段明确提示词，使后续 Agent 能找到全部规则、先审计再修改，而不是依赖对话记忆。
- 实际问题：只有 Dialog 已建立专属合同，规则仍表述为复合组件按 battle 补充；新会话需要维护者重复口头说明，其他组件也可能在没有聚合语义入口的情况下继续修改。
- 决策：把 docs/components 升级为所有组件的合同目录，采用“修改即迁移”：旧组件下一次实质修改前先真实审计并建立合同。新增合同模板、新会话启动提示词和全局合同测试，并从 AGENTS、CONTRIBUTING、README 建立入口。
- 理由：立即批量生成 83 份合同会产生未经验证的空壳，完全等待未来又无法形成约束；修改即迁移让每份合同都由真实代码和 battle 支撑，同时保证被继续开发的组件不会再绕过合同。自动门禁把会话记忆变成仓库事实。

AI 必须遵守：

- 新会话先使用 docs/NEW_SESSION_PROMPT.md，并完整阅读 AGENTS、全局合同、目标组件合同和命中的 Ledger 原始记录。
- 目标组件没有合同就先按 CONTRACT_TEMPLATE.md 审计并建立，再进行实质修改。
- 合同必须记录长期语义、取舍和禁止事项，不复制完整 API，也不批量生成未审计文档。
- 语义变化同步源码、H5、组件合同、相关全局文档、专项测试、Ledger 和安装产物。
- 新增合同必须进入 docs/components/README.md，并通过 scripts/test-component-semantic-contracts.js。

验证与遗留风险：

- 验证：`node scripts/test-component-semantic-contracts.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`git diff --check`
- 真机/兼容风险：本记录只改变 Agent 治理、文档入口和自动检查，不直接改变组件运行时；各旧组件的真实设备风险会在其后续迁移合同与 Ledger 中逐个记录。

## PUI-FB-0038 · 预览父布局把组件阴影裁切在滚动视口边缘

- 原始记录：`feedback/records/pui-fb-0038-preview-shadow-safe-parent-layout.json`
- 范围：`global` / `preview-site`、`preview-device`、`all-components`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-18
- 用户目标：所有组件开启阴影时都能完整展示，并由统一、符合组件真实使用场景的父容器布局决定安全内距或全屏贴边，而不是每个页面自行补 margin。
- 实际问题：旧 PreviewDevice 把 14px padding 写在外框，内部 viewport 自身 padding 为 0且负责 overflow 裁切，导致普通组件阴影从滚动边缘开始并被切掉；所有组件又共享同一种隐式父布局，无法表达 Card 与 Dialog 的真实父容器差异。
- 决策：PreviewDevice 外框改为 padding:0，仅负责固定设备边界、主题、圆角和裁切；唯一滚动 viewport 内增加共享 component-layout。普通组件使用 shadow-safe，由 --pui-preview-device-padding:14px 与 --pui-preview-shadow-bleed:14px 合成 28px；Dialog、Popup、Sheet、已退役组件、Navbar、Tabbar、Toast、旧队列入口 等使用 edge-to-edge:0。滚动条不再永久预留 gutter，避免 edge-to-edge 右侧缺口。
- 理由：父布局必须位于 overflow 裁切以内才真正保护阴影。28px 足以完整承载当前 PUI Card 的 0 12px 26px 阴影，同时作为固定布局在阴影关闭时继续保留，防止外观切换改变组件几何。edge-to-edge 明确保留全屏组件的真实屏幕关系。

AI 必须遵守：

- 新增组件预览时先判断真实父布局：普通 Surface 使用 shadow-safe，屏幕附着/浮层使用 edge-to-edge。
- 禁止给单个 showcase 增加私有 margin 来修复阴影裁切。
- 阴影安全区必须位于负责 overflow 的 viewport 内，外框 padding 不能替代。
- shadow-safe 固定为 14px base + 14px bleed，阴影开关不得改变该布局。
- edge-to-edge 根必须占满 viewport，不能留下永久 scrollbar gutter 或局部遮罩。
- 修改分类或父布局时同步 AGENTS、UI 合同、spacing/overview 专项测试和浏览器边界测量。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`git diff --check`
- 真机/兼容风险：本次只调整 H5 官网 PreviewDevice 父布局，不改变小程序组件源码；极窄设备下 28px 展示安全区会减少演示内容宽度，但390px已验证可读且无页面溢出。
- 真机/兼容风险：微信真机业务页面的阴影是否被消费者自己的 scroll-view/overflow 裁切，仍由各组件语义合同和业务父容器负责。

## PUI-FB-0041 · 共有组件缺少统一的 TDesign 对照治理流程

- 原始记录：`feedback/records/pui-fb-0041-tdesign-shared-component-alignment-goal.json`
- 范围：`global` / `all-components`、`documentation`、`agent-workflow`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：把 Button 已验证的 API 收敛和演示分区规则推广到 PoemUI 与 TDesign 共有的全部组件；仍逐组件真实审计和浏览器 battle，但 Button 后续无需逐项等待用户确认，由 agent 按完整证据自主连续验收。
- 实际问题：此前只有 Button 建立了明确取舍，其余组件缺少统一队列、交集边界和演示/API 信息架构基线，容易被批量照搬或继续暴露过量能力。
- 决策：新增唯一执行文档，固定 TDesign 1.15.3 为本轮参考版本，列出 55 个确认共有组件和暂缓候选；把 Button 原则写入 AGENTS 与新会话提示词。仍保持一次一个组件；Button 由用户明确验收，后续组件依据用户范围化授权，在完整证据和门禁后由 agent 自主接受或阻断并连续推进。
- 理由：版本化清单既能利用成熟组件库的公开合同减少盲区，也能防止把外部历史 API、external-classes 或不适合 PoemUI 的能力批量复制进来。

AI 必须遵守：

- 处理共有组件前必须阅读 docs/TDESIGN_COMPONENT_ALIGNMENT.md，并记录实际参考页面、版本和源码。
- 每项能力必须做保留、借鉴、收敛、拒绝或待真机决策，禁止按 Props 数量追平 TDesign。
- 一次只允许一个共有组件处于 in-progress；默认等待用户确认，当前 Goal 后续组件按用户范围化授权在完整门禁后自主验收并连续推进。
- 基础用法使用最小 WXML 且不得出现 bind:*；完整事件只进入 API Events。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：TDesign 与 PoemUI 的真机事件 detail、基础库要求和样式隔离可能不同，必须在每个组件记录中逐项保留，不能由共有名称推断兼容。

## PUI-FB-0042 · Button 公开 API 暴露重复与组件私有配置

- 原始记录：`feedback/records/pui-fb-0042-button-public-api-overexposure.json`
- 范围：`component` / `button`、`loading`、`icon`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：让 Button 的公开合同像成熟小程序组件一样克制，优先暴露日常按钮任务，避免形状、变体、动效和子组件能力重复表达。
- 实际问题：同一意图存在多个公开入口，子组件内部 API 被无边界透传，且低频平台能力与核心按钮属性处于同一信息层级。
- 决策：删除 round、ghost Boolean、iconPosition、dashed、success/warning 与私有 duration/easing；loadingProps 只允许 size/theme/text/ariaLabel，并把 29 项 Props 分为核心与平台两组。
- 理由：单一表达能降低 AI 和人工选型歧义；全局动效与子组件白名单能保持跨组件一致，平台能力仍完整保留但不打扰基础使用。

AI 必须遵守：

- 生成 Button 时优先使用 theme/variant/shape，不得恢复 round、ghost Boolean、iconPosition 或 dashed。
- success/warning 属于反馈结果，不生成 Button 主题；危险操作使用 danger。
- Button loadingProps 只生成 size/theme/text/ariaLabel，不透传 Loading 的其他能力。
- 日常文档先展示核心 Props，微信表单与开放能力放入独立高级分组。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 open-type、form-type 与十一类平台事件仍需使用合法 AppID 在真机验证，H5 只验证属性门控和原样回写，不伪造平台结果。

## PUI-FB-0043 · Button 基础用法堆叠全部平台事件绑定

- 原始记录：`feedback/records/pui-fb-0043-button-basic-usage-event-noise.json`
- 范围：`component` / `button`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Button 的基础用法必须基础，不展示 contact、手机号、设置、拉起 App 等全部 bind；完整事件应在 API Events 中按需查询。
- 实际问题：基础示例和复制代码把所有平台 bind 当成必填模板，既不基础，也会诱导 AI 生成不存在的页面处理器。
- 决策：Button 基础、当前效果和复制代码全部移除 bind；API 新增独立 Events 与 Slots；文档仅在 click、contact 等专项例中写入所需事件。
- 理由：最小示例更容易理解和复制，同时 Events 仍保持完整可查；专项示例能把事件放回真实任务语境，避免假处理器。

AI 必须遵守：

- 任何组件的基础用法都不得机械输出完整 bind 列表。
- Events 必须在 API 独立展示；事件专项示例只绑定当前能力所需事件。
- 复制当前视觉效果只序列化非默认 Props 和内容，不把临时运行态或无关事件写入代码。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：事件专项示例的微信回调仍需真机和合法 AppID；基础示例零 bind 不改变组件底层原样转发能力。

## PUI-FB-0044 · Button H5 镜像的 block 被父级自动宽度吞掉

- 原始记录：`feedback/records/pui-fb-0044-button-h5-block-width.json`
- 范围：`component` / `button`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：在 Props 中开启 block 后，当前 Button 必须真实占满可用宽度，并在 390px 及更窄设备中保持无横向溢出。
- 实际问题：Button 的 100% 宽度受收缩父级限制，属性已改变但预览没有表达真实 block 语义。
- 决策：让当前按钮的 form 跟随 block 状态切换为全宽，Button 继续由共享 helper 管理自身几何；窄设备按钮行允许自然换行。
- 理由：百分比宽度必须沿真实父布局闭环，修正父级职责比给 Button 增加魔法宽度或私有 margin 更稳定。

AI 必须遵守：

- 验证 block 时必须同时测量组件、直接父级和可用内容区宽度。
- H5 存在 form 或其他桥接父级时，父级必须参与 block 布局合同。
- 禁止用固定宽度、私有 margin 或 min-width 掩盖 block 父级问题。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`npm run check`
- 真机/兼容风险：小程序原生 block 样式仍需在真实页面父布局和样式隔离环境验证；H5 form 修复不改变原生 WXML。

## PUI-FB-0045 · Button H5 加载态未使用默认 Slot 生成可访问名称

- 原始记录：`feedback/records/pui-fb-0045-button-loading-accessible-name-parity.json`
- 范围：`component` / `button`、`loading`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Button 使用默认 Slot 且进入 loading 时，H5 与小程序都必须保留真实按钮内容，并给辅助技术稳定、可理解的加载名称。
- 实际问题：H5 属性驱动镜像没有把默认 Slot 作为内容真相源，加载时可访问名称和可见文本可能退化；静态示例重复加载文字。
- 决策：当前按钮始终把 content 或默认“按钮”送入 defaultSlot，并由 buttonSample 组合 loading 可访问名称；静态加载示例只保留一个视觉正文，Loading 使用 ariaLabel。
- 理由：默认 Slot 是 Button 最基础的内容入口，H5 必须与 WXML 使用同一真相源；视觉文字和辅助名称各司其职可避免重复。

AI 必须遵守：

- H5 Button 镜像必须通过 defaultSlot 传递基础内容，不得只读取 content Prop。
- loading 可访问名称应包含按钮任务上下文，例如“保存加载中”，不能只说“加载中”。
- Loading text 与 Button 正文不得重复渲染同一视觉文案。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`npm run check`
- 真机/兼容风险：微信开发者工具和真机对自定义组件内原生 button 的 aria-label 朗读仍需 VoiceOver/TalkBack 实测。

## PUI-FB-0046 · API 表格使用省略号隐藏关键文字

- 原始记录：`feedback/records/pui-fb-0046-api-table-full-text-visibility.json`
- 范围：`global` / `preview-site`、`documentation`、`all-components`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：API 表格中的参数、类型、初值、可选值、事件 detail、Slot 和说明必须完整可读，可以换行但不能用省略号隐藏。
- 实际问题：关键 API 文字会被省略号和单行规则裁掉，窄屏依赖超宽表格，用户无法直接看全真实合同。
- 决策：桌面保持五列但允许所有单元格自然换行和行高增长；900px 以下隐藏重复表头，以 data-label 为每个值恢复字段名并纵向排列；全局禁止 API 文本省略、单行截断和固定高度裁切。
- 理由：API 是调用合同而非次要摘要，完整性优先于单行密度；响应式标签能在窄屏同时保留字段关系与完整内容。

AI 必须遵守：

- API 单元格禁止 ellipsis、text-cut、nowrap、line-clamp 和固定高度裁切。
- 长参数、类型、枚举、事件 detail、Slot 与说明必须允许 overflow-wrap:anywhere 和自然行高。
- 窄屏 API 行必须保留字段标签并纵向重排，不能仅缩小字体或强制超宽表格。
- 浏览器验收必须检查计算样式、client/scroll 尺寸和页面级横向溢出。

验证与遗留风险：

- 验证：`node scripts/test-api-reference-readability.js`
- 验证：`node scripts/test-button.js`
- 验证：`npm run check`
- 真机/兼容风险：该变更只作用于 H5 官网 API 阅读层；真实移动浏览器字体回流、缩放和屏幕阅读器分组朗读仍需目标设备复核。

## PUI-FB-0047 · Button 属性页兼容说明仍展示已删除的主题与 dashed 变体

- 原始记录：`feedback/records/pui-fb-0047-button-h5-compatibility-copy-stale.json`
- 范围：`component` / `button`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Button 网页属性页、目录说明和架构文档必须与已经收敛的真实 API 完全一致，不能继续教用户使用已删除的主题或 dashed。
- 实际问题：Button 本体、API 和演示已收敛，但属性页兼容说明、目录 metadata 与架构示例仍在传播旧合同。
- 决策：官网属性页、目录 metadata、生成兼容表与架构示例统一改为 default/primary/danger 和 base/outline/text/ghost，并由 Button 专项测试锁定。
- 理由：兼容说明和目录同样会被用户与 AI 当成公开合同，任何旧枚举都可能生成实际回退到默认值的无效代码。

AI 必须遵守：

- 生成 Button 只能使用 default/primary/danger 与 base/outline/text/ghost。
- 修改 Button 枚举时必须同步属性兼容说明、目录 metadata、架构示例、API、合同和专项测试。
- 禁止依赖非法枚举静默回退，也不得在兼容说明中保留 dashed 或已删除主题。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`npm run catalog:generate`
- 验证：`npm run site:build`
- 真机/兼容风险：此问题属于官网说明一致性；微信真机仍需分别验证 open-type 和平台事件，但不影响主题与变体枚举结论。

## PUI-FB-0048 · Button 预览分区标题上间距不足

- 原始记录：`feedback/records/pui-fb-0048-button-preview-section-heading-spacing.json`
- 范围：`component` / `button`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Button 预览中的基础用法、组件类型、组件状态和组件样式要有清楚的视觉分区，后续标题不能紧贴上一组按钮。
- 实际问题：后续分区只使用 small 级 6px 额外 margin，叠加内容 gap 后总间距仅 14px，标题容易与上一组内容混读。
- 决策：保留 PreviewDevice 的共享 8px 内容 gap，只把第二至第四个 Button 分区的额外上间距从 --pui-preview-space-sm 改为 --pui-preview-section-gap；首个分区不增加 margin。
- 理由：调整现有 sibling 规则即可把真实间距从 14px 提升到 26px，既保持 Showcase 统一父布局，又明确区分内容组合和一级分区。

AI 必须遵守：

- Button 首个基础分区不增加额外顶部空白，后续分区标题追加 --pui-preview-section-gap。
- 组内按钮与说明继续使用 content gap，不得把一级分区和内容组合混用同一小间距。
- 不要通过边框、底色或嵌套卡片替代正确的分区间距。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：该变更只作用官网 Button 演示分区，不改变小程序 Button WXML/WXSS；移动端字体缩放后的纵向节奏仍需目标浏览器人工观感确认。

## PUI-FB-0049 · 官网左侧代码段缺少就近复制操作

- 原始记录：`feedback/records/pui-fb-0049-preview-code-block-section-copy.json`
- 范围：`global` / `preview-site`、`button`、`icon`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：标准组件概览左侧的组件引用与基础 WXML 代码段都要有就近复制按钮，用户不应为了复制一小段代码再寻找顶部工具栏或属性页。
- 实际问题：代码段只可阅读和手动选择，没有分段复制入口；已有剪贴板能力没有接入左侧代码块。
- 决策：将分段渲染收口为 previewCodeBlockSample，在每个标题行组合共享 iconButtonSample；按钮只携带 reference/basic 标识，点击时重新从 previewCodeSectionSources 读取 makeUsageCode 同源结果。复制继续复用 writePreviewClipboard 的安全上下文 Clipboard API 与非安全局域网 execCommand 回退，反馈使用 Copy/Check/ErrorCircle、aria-label、title 和共享 aria-live，1.2 秒后恢复。
- 理由：就近操作符合代码片段阅读路径；重新从同一生成器取值可避免把长代码塞入 DOM 属性或维护第二份字符串。复用 Button/Icon 与剪贴板能力能保持尺寸、主题、失败语义和无障碍一致。

AI 必须遵守：

- 左侧每个代码段必须调用 previewCodeBlockSample 与 iconButtonSample，禁止手写原生复制按钮。
- 组件引用和基础 WXML 的复制文本必须从 previewCodeSectionSources/makeUsageCode 读取，禁止维护第二份源码。
- 复制必须根据 Clipboard API 或 execCommand 的真实返回值显示 Check/ErrorCircle，并同步 aria-label、title 与 aria-live。
- 分段复制只复制当前可见代码；带视觉环境和运行态注释的完整代码继续由顶部工具栏承担。
- 390px 与深浅色验收必须确认按钮可见、代码可滚动且页面无横向溢出。

验证与遗留风险：

- 验证：`node scripts/test-preview-normal-code-card.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：该能力只属于 H5 官网文档辅助层，不改变小程序 Button 源码、API 或安装产物。
- 真机/兼容风险：局域网 HTTP 使用 document.execCommand('copy') 回退；自动化可验证真实返回值与反馈，最终粘贴内容仍建议用户在目标浏览器手工确认。

## PUI-FB-0050 · ConfigProvider 基础示例混入高级 Store 且 H5 未执行全局优先级

- 原始记录：`feedback/records/pui-fb-0050-config-provider-tdesign-alignment.json`
- 范围：`component` / `config-provider`、`visual-config`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：ConfigProvider 的基础示例保持最小可用，同时官网必须真实表达局部 Props 与全局 visualConfig 的优先级和视觉结果。
- 实际问题：基础示例混入高级 Store，H5 的局部视觉 Props 会覆盖全局配置，API 少列样式入口，事件语义没有去重保证。
- 决策：ConfigProvider 公开 8 Props、1 Event、1 Slot；基础 WXML 只保留 theme=auto 和默认 Slot，高级跨页配置单独展示；H5 增加有效配置解析，useGlobalConfig 时由全局视觉状态接管；小程序 themechange 按解析结果去重。
- 理由：局部 Provider 与跨页 Store 是不同学习层级；同一有效配置规则能保证 H5、WXML 和真实安装端一致，事件去重避免视觉开关更新被误报为主题变化。

AI 必须遵守：

- ConfigProvider 基础 WXML 只放最小 Provider 和内容，不生成 Store 代码或 bind。
- useGlobalConfig=true 时忽略局部 theme/shadow/frostedGlass/largeRadius/bordered，由 visualConfig 唯一接管。
- customClass/customStyle 只作用 Provider 根，不绕过语义 Token 修改子组件内部几何。
- themechange 只在解析后的 light/dark 真值变化时触发，视觉开关更新不得重复发出。
- 不为对齐 TDesign 数量自动加入 globalConfig/themeVars；新增公共配置必须先证明独立用户任务。

验证与遗留风险：

- 验证：`node scripts/test-config-provider.js`
- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run pack:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：当前机器微信开发者工具 Service Port 关闭，example:install 清理后的 miniprogram_npm 尚无法重建，因此本轮状态保留 pending-cli；不得把源码/dist/node_modules 一致性当作微信安装产物完成。
- 真机/兼容风险：多个真实 Page 并行订阅、wx storage 异常、系统 auto 主题回调和样式隔离继承仍需合法 AppID 真机复核。

## PUI-FB-0051 · Icon 作为展示叶子却暴露 click 与 disabled 伪交互

- 原始记录：`feedback/records/pui-fb-0051-icon-display-leaf-api-contract.json`
- 范围：`component` / `icon`、`button`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Icon 只承担稳定的本地矢量展示，交互入口通过 Button + Icon 组合，基础 API 与示例保持克制且跨端一致。
- 实际问题：旧合同把展示 Icon 伪装成不完整操作控件，示例还传入真实 API 不支持的字符串尺寸，API、WXML 和行为边界不清晰。
- 决策：Icon 收敛为 5 Props、2 资源事件和零 Slot；移除 click/disabled，交互统一组合 Button；size 固定 Number+rpx 8–256，src 独立于 name，unknown name 与 Canvas 失败均真实报错。
- 理由：展示叶子与操作控件职责分离可以避免重复禁用态、无键盘伪按钮和事件歧义；独立 src 与数字尺寸更适合小程序离线 SVG/Canvas 实现。

AI 必须遵守：

- 生成可点击图标时必须使用 pui-button 包裹 pui-icon，不得给 Icon 绑定 click 或 disabled。
- Icon size 只生成 8–256 的数字 rpx，不生成 small/medium/large 或任意 CSS 单位。
- 业务图片必须使用 src，name 只使用 PoemUI manifest 稳定名称。
- ariaLabel 为空表示装饰图标；父 Button/Cell 的可访问名称是唯一朗读来源。
- 基础 WXML 显式包含 name 且零 bind，资源事件只在 Events 或专项示例中绑定。

验证与遗留风险：

- 验证：`node scripts/test-icon.js`
- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：微信 image 与 Canvas source-in 的真实解码、颜色合成、DPR、同名 observer 时序和辅助技术朗读仍需合法 AppID 真机复核。
- 真机/兼容风险：删除 click/disabled 是有意 API 收敛；旧消费者需把事件和禁用态迁移到外层 pui-button。

## PUI-FB-0052 · Icon 图片源着色镜像被说明文字样式覆盖

- 原始记录：`feedback/records/pui-fb-0052-icon-source-color-preview-parity.json`
- 范围：`component` / `icon`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Icon 的 src + color 在 H5 必须镜像小程序 Canvas 实体着色，成功和失败只能来自真实图片资源结果。
- 实际问题：有效资源虽然真实进入 loaded，但宽泛的 .icon-library__preview span 规则把 mask 的 currentColor 改成说明文字 muted 灰色。
- 决策：为说明文本增加 icon-library__preview-copy 语义容器，只在该容器内设置 muted 文案；source mask 继续使用 currentColor，并保留 img probe 的真实 load/error。
- 理由：文档排版不能穿透改变 PUI 子组件内部图形；限定职责容器可以保持小程序 Canvas 与 H5 mask 的颜色语义一致。

AI 必须遵守：

- Icon 预览说明文字只能在专属 copy 容器内设色，禁止使用命中全部 span 的宽泛选择器。
- src + color 镜像使用 currentColor，验收必须比较根与 mask 的计算色。
- 图片完成态必须依据真实 load/naturalWidth，404 或解码失败必须进入 error 回退。

验证与遗留风险：

- 验证：`node scripts/test-icon.js`
- 验证：`node scripts/test-preview-css-token-contract.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：H5 CSS mask 只镜像单色实体着色；微信 Canvas 对跨域图片、临时文件、不同图片格式和真机 GPU 合成仍需合法 AppID 复核。

## PUI-FB-0053 · Icon 独立资源页隐藏复制并泄漏无效选择模式

- 原始记录：`feedback/records/pui-fb-0053-icon-copy-only-toolbar.json`
- 范围：`component` / `icon`、`preview-site`、`button`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Icon 独立资源页仍能就近复制当前真实 WXML，但不显示不适用的元素选择、机型、刷新或重置控件，390px 保持紧凑。
- 实际问题：旧页面完全隐藏复制；初次特例修复又因 hidden CSS 和移动双行高度泄漏无效按钮与多余空白。
- 决策：Icon 概览新增 copy-only 工具栏模式：只让同源 Copy 可见，设备/刷新/重置与选择模式退出；补齐 hidden CSS，并在 700px 以下使用 44px 单行高度。
- 理由：复制是所有组件调用任务，元素选择和设备模拟却不适用于独立资源文档；拆开能力显隐可以减少误导并保留统一 PUI Copy 反馈。

AI 必须遵守：

- Icon overview 使用 copy-only 工具栏；Copy 继续调用 makeUsageCode，禁止维护第二份 WXML。
- 元素选择、机型、刷新和重置不得在 Icon 资源页出现或仅以 disabled 伪装。
- 带 hidden 的 mount 必须有明确 display:none 合同，不能被 flex/grid 基础规则覆盖。
- 390px copy-only 工具栏固定单行语义高度，不保留双行空白。

验证与遗留风险：

- 验证：`node scripts/test-icon.js`
- 验证：`node scripts/test-design-contracts.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：局域网 HTTP 复制依赖 document.execCommand 回退；自动化已验证真实 success 反馈，最终剪贴板粘贴内容与移动浏览器辅助技术仍需目标浏览器人工复核。

## PUI-FB-0054 · Divider 默认无内容横线被根节点间距截断

- 原始记录：`feedback/records/pui-fb-0054-divider-empty-line-center-gap.json`
- 范围：`component` / `divider`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：默认 Divider 应是一条连续分割线；只有真实文字或 Slot 存在时才在内容两侧留出间距，横竖、虚线和语义跨端一致。
- 实际问题：原生 WXSS 和 H5 镜像都把内容间距放在根节点，导致默认空 Divider 仍在中心出现视觉断口；原生根也未声明方向语义。
- 决策：原生和 H5 同时从根移除 gap，把间距迁移到内容节点；保留两段横线以支持三种对齐，纵向继续只用唯一线条，并增加 orientation 派生状态与 ARIA 映射。
- 理由：内容节点拥有间距才能同时满足默认连续线和带内容分隔线，并保持现有对齐算法、Slot API 与盒模型稳定。

AI 必须遵守：

- 禁止在 Divider 根恢复无条件 gap；默认两条横线必须相接。
- content/showContent 只在横向创建内容节点，纵向始终忽略内容和对齐视觉。
- 原生与 H5 必须同时验证横竖、虚线、对齐和 aria-orientation。
- 不要用负 margin、空文字或隐藏占位节点修补中心断口。

验证与遗留风险：

- 验证：`npm run precheck`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：1rpx 实线/虚线在不同设备像素比上的抗锯齿仍需微信真机目视确认。
- 真机/兼容风险：aria-orientation 与 aria-hidden 在微信辅助技术中的朗读效果需目标基础库和真机读屏确认。

## PUI-FB-0055 · Divider 概览混入工程状态且 API 与兼容说明缺少真实边界

- 原始记录：`feedback/records/pui-fb-0055-divider-preview-api-parity.json`
- 范围：`component` / `divider`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Divider 官网应像成熟组件文档一样按真实用法分区，基础示例保持最小，完整展示 7 个 Props、Slot 和无事件边界，不用工程诊断内容冒充产品示例。
- 实际问题：旧概览主要表达构建状态，纵向线被私有卡片包装；Slots、真实说明和无事件边界缺失，分区只有 8px，无法快速比较常用能力。
- 决策：重建 Divider 概览为三段用法，第一项接受完整 Props，固定示例用于比较；纵向线与 PUI Tag 直接组合。补齐 Slot、专属 Props 文案、静态行为兼容说明、基础/文字/Slot 文档与 18px 分区优先级。
- 理由：分割线是简单展示原语，清晰比较方向、内容、对齐和线型比发布状态卡更接近用户任务；API 明确不适用状态也能避免 Agent 为覆盖清单伪造交互。

AI 必须遵守：

- Divider 概览固定按基础、文字与对齐、布局与线型分区，禁止工程构建状态 Cell。
- 第一项必须由当前 Props 驱动，固定示例只用于比较，不能覆盖用户调参结果。
- 基础 WXML 只输出 pui-divider 且零 bind；Slot、虚线和对齐进入各自示例。
- 无事件组件的兼容说明不得套用 click/input 或 triggerEvent 通用文案。
- 后续分区标题必须实测 18px 共享 section gap，不能只检查源码 Token。

验证与遗留风险：

- 验证：`npm run catalog:generate`
- 验证：`npm run precheck`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：默认 Slot 的 content 后备覆盖顺序依赖微信小程序 Slot 语义，需微信开发者工具和真机再次确认。
- 真机/兼容风险：微信 build-npm 仍因开发者工具 Service Port 关闭无法生成 miniprogram_npm，本记录保持安装端 pending-cli 风险。

## PUI-FB-0056 · Cell 顶层 API 重复透传子组件能力并公开多条写入通道

- 原始记录：`feedback/records/pui-fb-0056-cell-api-overexposure.json`
- 范围：`component` / `cell`、`navigation-menu`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Cell 应提供稳定、克制的单元格内容、状态、选择和导航合同；复杂 Badge/Image 内容通过 PoemUI 组合表达，父级只有一条清晰的状态写回路径。
- 实际问题：旧合同把内部 Image、Badge、Arrow 和 Slot 显隐策略提升为 Cell 顶层 API，并公开多组可变方法与过程事件，调用者难以判断唯一状态来源。
- 决策：公开合同收敛为 28 Props、7 Events、7 Slots、0 业务实例方法；删除 17 个重复 Props、3 个过程事件和 6 个业务方法。Image 固定 72rpx round/aspectFill，Arrow 固定 chevron-right，Badge/Tag/Button 通过 Slot 组合。
- 理由：Cell 的核心任务是表达一行信息、选择或入口；固定内部视觉语义和唯一父级写回路径能降低误用，同时保留 PoemUI 组合能力。

AI 必须遵守：

- 禁止向 Cell 恢复 Badge/Image 的全量透传 Props；复杂内容使用 media/title/description/value/note/default/right Slot。
- 禁止公开 select/unselect/toggle/reset/navigate/getState 业务方法绕过受控父级。
- selected 非 null 时只由父级回写；defaultSelected 只初始化非受控或退控状态。
- disabled/loading 完全阻断，readonly 只回传 blocked click，H5 不伪造微信导航成功。

验证与遗留风险：

- 验证：`npm run precheck`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 navigateTo/redirectTo/reLaunch/switchTab 的真实栈行为和 success/fail detail 仍需合法 AppID 真机确认。
- 真机/兼容风险：旧消费者使用已删除 badge/image 透传、right-click、navigate-complete 或实例方法时需要迁移到 Slot、Props 和事件。

## PUI-FB-0057 · Cell 概览以工程诊断代替用户用法且 API 缺少 Events 和 Slots

- 原始记录：`feedback/records/pui-fb-0057-cell-preview-api-parity.json`
- 范围：`component` / `cell`、`preview-site`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Cell 官网应像成熟组件文档一样按真实用户任务分区，基础 WXML 最小且零 bind，API 完整展示真实 Props、Events、Slots，示例可以直接筛选常见用法。
- 实际问题：旧预览把工程诊断当作主要内容，API 缺失事件/Slot 表格，示例过度绑定，无法快速筛选常见 Cell 用法。
- 决策：重建概览为四个真实分区，删除方法/事件诊断卡；基础 WXML 固定 `<pui-cell title="单行标题" />`。补齐 API Events/Slots、专属合同、H5 兼容说明和克制的真实示例。
- 理由：Cell 使用者首先需要比较单行、多行、状态和组合；事件与完整参数应在 API 检索，不能挤入基础示例。

AI 必须遵守：

- Cell 概览固定为基础、多行与内容、状态与选择、组合内容，禁止实例方法和事件日志卡。
- 第一项必须消费当前 Props，固定项只用于比较，不能覆盖用户调参结果。
- 基础 WXML 只输出单行 title，任何 bind 仅出现在事件专项示例或 API。
- 复杂内容必须调用 PUI Badge、Tag、Button helper，不得手写静态占位。

验证与遗留风险：

- 验证：`npm run catalog:generate`
- 验证：`npm run precheck`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：具名 Slot 在微信端的默认/追加顺序、right catchtap 与内部 Button 事件隔离仍需开发者工具和真机复核。
- 真机/兼容风险：微信 build-npm 因 Service Port 关闭尚未补回 miniprogram_npm，安装端状态保留 pending-cli。

## PUI-FB-0058 · Cell 当前 WXML 把空字符串 title 回退成演示文案

- 原始记录：`feedback/records/pui-fb-0058-cell-empty-title-code-parity.json`
- 范围：`component` / `cell`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：属性面板中的空字符串必须真实作用于 Cell，并由当前效果 WXML 原样表达；基础示例文案不能污染用户当前代码。
- 实际问题：旧生成器用基础演示文案覆盖空字符串，导致预览与复制代码不一致。
- 决策：当前 WXML 对 title 使用 nullish 归一化并保留空字符串；基础用法继续由独立真相源固定为单行标题。
- 理由：教学示例和当前效果代码用途不同，后者必须无损表达 Props。

AI 必须遵守：

- 不要把 Cell 基础示例的 title 回退应用到当前 WXML。
- 0、false、空字符串和未传入必须在代码生成中保持不同。

验证与遗留风险：

- 验证：`node scripts/test-cell.js`
- 验证：`npm run precheck`
- 真机/兼容风险：无已知遗留项。

## PUI-FB-0059 · Cell H5 图片 error 的 hidden 被 display block 覆盖

- 原始记录：`feedback/records/pui-fb-0059-cell-h5-broken-image-visibility.json`
- 范围：`component` / `cell`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Cell 图片失败时必须进入真实 error 边界且不显示浏览器破图占位；H5 不能用假成功或静态替身掩盖失败。
- 实际问题：旧实现的数据状态为 error，但 computed display 仍为 block，视觉与事件状态矛盾。
- 决策：error 时隐藏 img 和最近的 Cell media 外壳，并增加 scoped hidden CSS；仍保留真实 error 状态，不伪造资源成功。
- 理由：失败资源必须视觉、布局和状态一致，且不应由 H5 自行制造业务兜底。

AI 必须遵守：

- CSS 显式 display 不能覆盖 hidden 错误态。
- 图片失败不得替换成假成功资源或只更新提示文字。

验证与遗留风险：

- 验证：`node scripts/test-cell.js`
- 验证：`npm run precheck`
- 真机/兼容风险：微信端由内部 pui-image 触发 load/error，其图片失败占位和解码表现仍需真机确认。

## PUI-FB-0060 · Badge 纯展示职责被 27 Props 和 5 Events 过度扩张

- 原始记录：`feedback/records/pui-fb-0060-badge-display-leaf-api-contract.json`
- 范围：`component` / `badge`、`grid`、`radio`、`navigation-menu`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Badge 应像成熟小程序组件库一样快速表达数量和红点，不把宿主点击、显隐状态机、重复别名和视觉总开关暴露成徽标自身 API。
- 实际问题：旧合同同时承担内容别名解析、受控显隐、点击门禁、定位系统、动画生命周期和多颜色入口，调用者难以判断 Badge 与宿主的职责边界。
- 决策：公开合同收敛为 count/content/dot/maxCount/showZero/theme/variant/shape/size/color/offset/ariaLabel 12 Props、default/count 2 Slots、0 Events、0 业务 Methods；删除 15 个 Props 和全部生命周期事件。
- 理由：数量与红点是 Badge 唯一稳定用户任务；宿主内容、交互和业务状态由 PoemUI 组合完成，可减少重复真相源并保持跨端可预测。

AI 必须遵守：

- 禁止恢复 value/text 内容别名、visible 状态机、四角 position、standalone 开关或 Badge 自身 click/disabled。
- count=0 遵循 showZero，false、空白和对象隐藏，count=null 是选择 count Slot 的唯一入口。
- 没有宿主时自动独立布局，有宿主时固定右上角；特殊位置只使用安全 offset 或调整宿主结构。
- 需要点击、选择、loading、disabled、error 或 retry 时组合 Button、Cell、Tabs、Tabbar 等真实宿主。

验证与遗留风险：

- 验证：`npm run precheck`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 WXML 的 :empty 邻接选择器、动态 Slot 宽度、读屏 status 播报和极端字体回流仍需合法 AppID 真机复核。
- 真机/兼容风险：使用已删除 value/text/visible/position/standalone/clickable 或生命周期事件的旧消费者需要迁移到 count、条件渲染、offset 与宿主事件。

## PUI-FB-0061 · Badge 官网仍展示旧生命周期说明且重置未回到源码默认值

- 原始记录：`feedback/records/pui-fb-0061-badge-preview-reset-parity.json`
- 范围：`component` / `badge`、`preview-site`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Badge 官网应按常见用法分区，Props、WXML、API 与兼容说明都对应当前 12 Props 纯展示实现，重置必须恢复真实源码默认值。
- 实际问题：H5、API、兼容文案和重置状态仍保留旧 27 Props 状态机的多处事实，和新源码及用户学习路径不一致。
- 决策：概览固定为基础用法、红点与上限、尺寸与形状、主题与变体、组合用法；删除诊断状态机。Badge reset 单独读取 componentPropDefaults 源码默认，初次展示仍使用 count=3 作为可见样例；所有代码从 makeUsageCode 同源生成。
- 理由：可见初始样例和组件源码默认是两个不同概念；明确分离后既能让用户第一眼看到徽标，也能保证重置、过滤默认 Props 和复制代码语义真实。

AI 必须遵守：

- Badge 概览固定为五段用户用法，禁止恢复生命周期、事件日志、方法按钮或点击递增诊断。
- 基础 WXML 必须零 bind，完整 API 不渲染空 Events 表，default/count Slot 只在 Slots 区说明。
- 初次演示 count=3 不得冒充源码默认；重置和默认 Prop 过滤必须使用 componentPropDefaults.badge。
- 兼容说明、metadata、属性面板、示例和安装产物必须和 12 Props、0 Events、2 Slots 同步。

验证与遗留风险：

- 验证：`npm run catalog:generate`
- 验证：`npm run precheck`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：H5 用 HTML/px/absolute 映射 WXML/rpx；真实设备的字体基线、Slot 测量、1rpx 边界和读屏顺序仍需合法 AppID 真机确认。
- 真机/兼容风险：微信开发者工具 Service Port 关闭时无法补建 miniprogram_npm，安装端门禁必须保留 pending-cli。

## PUI-FB-0062 · Avatar 展示叶子被点击、禁用、别名和私有动效参数过度扩张

- 原始记录：`feedback/records/pui-fb-0062-avatar-display-leaf-api-contract.json`
- 范围：`component` / `avatar`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Avatar 应快速表达图片、Icon、文字或 Slot 头像，不把宿主点击、禁用状态、重复图片别名和可由全局 Token 管理的动效暴露成头像自身 API。
- 实际问题：旧合同把图片来源、宿主交互、禁用门禁、加载诊断和私有动画配置混在同一组件内，基础用法和调用职责都不清晰。
- 决策：公开合同收敛为 src/text/alt/icon/shape/size/bordered/hideOnLoadFailed/useSlot/ariaLabel/reduceMotion 11 Props、error 1 Event、default 1 Slot、0 业务 Methods；删除 image/clickable/disabled/duration/easing 和 click/load。
- 理由：头像的独立用户任务是稳定展示身份；点击、禁用、loading、selected 和业务反馈属于宿主，固定 500ms/1ms 动效可避免重复入口并保持跨端一致。

AI 必须遵守：

- 禁止恢复 image 别名、clickable/disabled、Avatar 自身 click/load 或私有 duration/easing。
- 基础用法只写最小 Avatar WXML，不绑定 error；完整 error 只进入 API Events 或真实失败专项示例。
- 需要 Badge 时使用外层组合，需要点击时使用 PUI Button/Cell 包裹，不新增重复透传 Prop。
- 图片 load 只改变内部 opacity；只有 error 对消费者有独立处理价值。

验证与遗留风险：

- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 image 解码、rpx 抗锯齿、Slot 字体基线、读屏图片语义和系统级低动效仍需合法 AppID 真机复核。
- 真机/兼容风险：旧消费者若使用 image/clickable/disabled/click/load/duration/easing，需要迁移到 src、外层交互组件与固定 Token 动效。

## PUI-FB-0063 · Avatar H5 尺寸、失败完成态和全局外观与原生合同不一致

- 原始记录：`feedback/records/pui-fb-0063-avatar-preview-runtime-parity.json`
- 范围：`component` / `avatar`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Avatar 官网必须真实镜像 WXML/WXSS，图片成功、失败、隐藏动效、尺寸和全局视觉开关都应可在网页中直接验收。
- 实际问题：旧镜像的尺寸、完成态、视觉 Token 和交互反馈分别与原生或标准概览规则冲突。
- 决策：统一原生/H5 三档尺寸和固定动效；为所有演示图片补缓存完成检测；失败隐藏在计时器完成后才应用 hidden；Avatar 边线和阴影改用共享 Token；宿主 Button 点击直接更新自身标签。
- 理由：这些变化不扩张 Avatar API，但让真实页面、原生安装端和全局视觉合同读取同一语义。

AI 必须遵守：

- H5 small/medium/large 固定镜像 28/40/56px，禁止建立第二套尺寸。
- hideOnLoadFailed 必须先播放 180ms 或 1ms 退场，再隐藏或卸载；hidden 完成态必须通过计算样式验证。
- 缓存 image 必须同时处理 complete/naturalWidth，不能假设 listener 一定先于 load/error。
- 标准概览中的可见交互结果放在真实宿主组件内，不恢复会被归一化删除的事件诊断卡。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 img/px/hidden 与微信 image/rpx/wx:if 只做语义镜像，真机解码失败时机、合成帧和 1rpx 边缘仍需合法 AppID 复核。
- 真机/兼容风险：微信开发者工具 Service Port 关闭时无法生成 miniprogram_npm，发布产物门禁必须保留 pending-cli。

## PUI-FB-0064 · Image 把展示资源、宿主交互和私有动效混成过量公开 API

- 原始记录：`feedback/records/pui-fb-0064-image-display-leaf-api-contract.json`
- 范围：`component` / `image`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Image 应以少而明确的 API 展示真实图片资源和状态，不把点击、禁用、私有动画参数或诊断事件塞进基础图片组件。
- 实际问题：旧合同把展示资源、宿主点击门禁、私有动效和三类基础绑定合并在一个组件中，API 与用户任务都过重。
- 决策：公开合同收敛为 src/mode/width/height/shape/lazy/webp/loading/error/text/showMenuByLongpress/showSlot/ariaLabel/reduceMotion 14 Props、load/error 2 Events、default 1 Slot、0 业务 Methods；删除 click/clickable/disabled/duration/easing。
- 理由：图片的独立任务是可靠展示资源；外部 loading/error 仍能表达真实请求状态，微信 webp 是真实平台能力，固定 500ms/1ms 动效足以维持跨端一致。

AI 必须遵守：

- 禁止恢复 Image 自身 click/clickable/disabled 或私有 duration/easing。
- 基础用法只写最小 pui-image，不绑定 load/error；完整事件只进入 API 或真实事件专项示例。
- loading/error 只表示调用者真实状态，不得伪造资源完成或业务重试成功。
- 需要可点击图片时使用外层 PUI Button/Cell，覆盖 Slot 的事件属于消费者。

验证与遗留风险：

- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 webp 解码、lazy-load 触发时机、长按菜单、widthFix/heightFix 和辅助技术仍需合法 AppID 真机复核。
- 真机/兼容风险：旧消费者若使用 clickable/disabled/click/duration/easing，需要迁移到外层 PUI Button/Cell 和固定 Token 动效。

## PUI-FB-0065 · Image H5 lazy、源码默认重置与真实资源状态未完整对齐

- 原始记录：`feedback/records/pui-fb-0065-image-preview-runtime-parity.json`
- 范围：`component` / `image`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Image 官网的每个 Props 都必须真实作用于预览，重置应回到安装端默认值，资源事件、外观和 390px 布局应能在网页中直接验收。
- 实际问题：旧镜像存在面板值已变但浏览器行为未变、源码默认与演示初值混用，以及概览结构不足以验收的三类漂移。
- 决策：H5 img 根据 lazy 写入 native loading=lazy/eager；Image 与 Avatar/Badge 一样使用源码默认值过滤和重置；概览重建为基础用法、加载与失败、裁切模式、形状与覆盖内容；状态、Slot 和宿主均调用共享 PUI helper。
- 理由：演示可以用非默认资源帮助理解，但复制和重置必须读取安装端事实源；浏览器原生属性是验证 lazy 真正生效的最低证据。

AI 必须遵守：

- lazy 必须映射 H5 img loading=lazy/eager，不能只更新 WXML 文本。
- Image reset 和默认 Prop 过滤必须读取 componentPropDefaults.image，重置代码应为最小 <pui-image />。
- 真实 load/error 同时覆盖缓存 complete/naturalWidth，禁止用按钮或计时器伪造资源结果。
- 390px 和外观验收必须读取 Image、PreviewDevice 与 API 单元格计算样式和 scrollWidth。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 img loading/object-fit/px/contextmenu 与微信 lazy-load/mode/rpx/长按菜单只是语义镜像，真实解码与布局仍需合法 AppID 设备复核。
- 真机/兼容风险：微信开发者工具 Service Port 关闭时无法更新 miniprogram_npm，发布产物门禁必须保留 pending-cli。

## PUI-FB-0066 · Tag 把形状别名和根点击混入展示叶子公开合同

- 原始记录：`feedback/records/pui-fb-0066-tag-display-leaf-api-contract.json`
- 范围：`component` / `tag`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Tag 应以少而明确的 API 展示短标签和可关闭状态，基础用法保持最小，完整事件只在 API 与事件专项场景出现。
- 实际问题：旧合同用 round 重复 shape，并公开根 click，使一个展示叶子同时承担样式别名和不清晰的业务交互。
- 决策：公开合同收敛为 theme/variant/size/shape/content/icon/closable/disabled/maxWidth 9 Props、close 1 Event、default 1 Slot、0 业务 Methods；删除 round 与根 click。
- 理由：shape 已完整表达 square/round/mark；Close 是 Tag 唯一自有交互，而一般点击应由语义更清晰的外层组件承接。

AI 必须遵守：

- 禁止恢复 round Boolean 或 Tag 根 click；形状只由 shape 表达。
- 基础用法只写最小默认 Slot，不绑定 close；完整事件只进入 API 或真实关闭专项示例。
- content 必须保留空字符串和 0，不能用真假值回退到默认标签。
- 可关闭 Tag 只请求父级删除，组件不得自行隐藏或用 Toast 伪造关闭结果。

验证与遗留风险：

- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 tap/catchtap、rpx 字号和辅助技术播报仍需合法 AppID 真机复核。
- 真机/兼容风险：旧消费者若使用 round 或 bind:click，需要迁移到 shape=round 和外层 PUI Button/Cell。

## PUI-FB-0067 · Tag H5 默认值、安全宽度和元素选择入口未完整对齐

- 原始记录：`feedback/records/pui-fb-0067-tag-preview-runtime-parity.json`
- 范围：`component` / `tag`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Tag 官网每个 Props 都要真实作用于预览，重置回安装端默认值，并能在元素选择、外观模式和 390px 页面中完整验收。
- 实际问题：旧镜像会替换合法边界值、信任宽度字符串、混用演示默认值，并因缺少标准预览根而让 Inspector 失效。
- 决策：H5 以显式空值逻辑渲染 content，校验并映射 maxWidth；Tag 使用源码默认过滤/重置；概览根接入标准 demo-section 并分为基础、主题与变体、尺寸与形状、关闭与长文本四区。
- 理由：边界值、宽度、选择器和 WXML 必须由同一真实 Props 驱动；标准预览根是元素级编辑能力的结构合同，不是装饰类名。

AI 必须遵守：

- Tag content 只能按 null/undefined 与显式空值区分，禁止用 || 回退默认标签。
- maxWidth 只接受非负数字或非负 px/rpx/%；非法值不得拼入 style。
- Tag showcase 根必须保留 demo-section，否则元素选择模式无法建立语义候选。
- Tag reset 与 WXML 默认过滤必须读取 componentPropDefaults.tag，不得使用演示初值。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 的 px/rpx 映射和浏览器键盘焦点不替代微信真机的触摸命中、字体度量和屏幕阅读器验证。
- 真机/兼容风险：微信开发者工具 Service Port 关闭时无法更新 miniprogram_npm，发布产物门禁必须保留 pending-cli。

## PUI-FB-0068 · Grid 顶层外观与 footer 能力掩盖入口和状态主合同

- 原始记录：`feedback/records/pui-fb-0068-grid-api-and-state-contract.json`
- 范围：`component` / `grid`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Grid 应以少而明确的 API 组织快捷操作，基础用法保持最小，并让加载、空、错误和重试形成真实父级闭环。
- 实际问题：旧合同用五项顶层外观/尾部/动效参数扩张入口组件，同时缺少 column=0、description、item theme 和真实 retry。
- 决策：公开合同收敛为 14 Props、click/retry 两 Events、零 Slots、零业务 Methods；增加 column=0、item description/theme 和 PUI Empty 重试，删除 hover/theme/showFooter/duration/easing。
- 理由：入口按压由 Button 固定提供，主题属于每个入口，状态动效使用全局 500ms Token；retry 必须交给父级真实请求，Grid 不应该拥有选择或导航成功状态。

AI 必须遵守：

- 禁止恢复 hover/theme/showFooter/duration/easing 或 Grid selected/active/readonly。
- column=0 必须保留为横向 scroll-view，不能被真假值回退成 4。
- items 的 0、false、空字符串、空 label/icon 和 badge=0 必须原样保留。
- 错误重试只触发 retry，组件不得自行清除 error 或伪造请求成功。

验证与遗留风险：

- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 scroll-view 惯性、Button 触摸反馈、Badge 定位、1rpx 分隔线和读屏仍需合法 AppID 真机复核。
- 真机/兼容风险：旧消费者若使用 hover/theme/showFooter/duration/easing 或 footer slot，需要迁移到 Item theme、全局 Token 与外层布局。

## PUI-FB-0069 · Grid H5 默认代码、间距、事件和状态动画与原生不一致

- 原始记录：`feedback/records/pui-fb-0069-grid-preview-api-parity.json`
- 范围：`component` / `grid`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Grid 官网必须按任务分区，所有 Props 真实作用于同一个预览，WXML、API、状态动画、390px 和外观开关与安装端一致。
- 实际问题：旧镜像用演示默认、错误单位、缺失 API 区和条件替换状态，导致看见的效果、复制代码、安装端默认和动效合同彼此漂移。
- 决策：H5 分为基础、列数与间距、徽标与禁用、加载/空/错误四区；源码默认与演示初值分离，WXML 专用生成，gutter 除以 2；四层状态常驻并由运行时跨帧切换。
- 理由：用户必须能从分区快速筛选能力，同时复制代码、重置、Props 和真实组件只认同一个默认源；常驻状态层才能兑现动效和辅助语义。

AI 必须遵守：

- Grid componentPropDefaults 必须保持源码 items=[]，演示数据只能放 release definition。
- 非空 items 的 WXML 使用 items={{entries}}，默认重置输出 <pui-grid />，基础用法不绑定事件。
- H5 gutter 必须除以 2；column=0 只允许 Grid viewport 横向滚动，禁止页面级 overflow。
- content/loading/error/empty 必须保留节点并跨帧切换，禁止条件重建或 display:none。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 DOM、px、CSS transition 与局部 overflow 只镜像 WXML、rpx、WXSS 和 scroll-view，需在目标微信基础库复核惯性与取整。
- 真机/兼容风险：微信开发者工具 Service Port 关闭时无法更新 miniprogram_npm，发布门禁必须保留 pending-cli。

## PUI-FB-0070 · CountDown 兼容别名、可变动效与生命周期事件扩张核心计时合同

- 原始记录：`feedback/records/pui-fb-0070-count-down-api-and-state-contract.json`
- 范围：`component` / `count-down`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：CountDown 应以准确、可暂停和可恢复的计时为核心，公开 API 克制，基础用法最小，并让父级可以读取和控制真实剩余时间。
- 实际问题：旧合同用多个别名、三个无独立信息量的生命周期事件和私有动效扩张 API，且 paused/autoStart 的持续策略边界不够清晰。
- 决策：公开合同收敛为 11 Props、2 Events、1 default Slot、4 Methods；删除 finishText/customContent/pauseOnHidden/duration/easing、start/pause/reset Events、restart/getRemaining 和 prefix/suffix Slots。
- 理由：time 与 targetTime 是唯一计时真相源；start/pause/reset 是命令，change/finish 才是父级需要观察的状态；动效固定 500ms并由 reduceMotion 压缩为1ms。

AI 必须遵守：

- 禁止恢复 finishText/customContent/pauseOnHidden/duration/easing 或 start/pause/reset Events。
- autoStart 只决定初始化、time 更新和 reset 后是否启动，不能被当成持续运行开关。
- paused=false 只能恢复由 paused=true 造成的暂停，不能让初始 autoStart=false 的实例自行启动。
- 自然归零必须先发布最后 change，再且仅再发布一次 finish；初始化或 reset 到0不得伪造 finish。

验证与遗留风险：

- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信后台定时器节流、页面切换后的 Date.now 校正、rpx 字体回流、辅助技术和系统低动效仍需合法 AppID 真机复核。
- 真机/兼容风险：旧消费者若使用已删除 Props、事件、方法或 prefix/suffix Slots，需要迁移到 default Slot、外层布局与 change/finish。

## PUI-FB-0071 · CountDown 官网默认代码、重置、Methods 与真实运行态不一致

- 原始记录：`feedback/records/pui-fb-0071-count-down-preview-api-parity.json`
- 范围：`component` / `count-down`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：CountDown 官网应按常见用法分区，所有 Props 与控制方法真实作用于同一计时器，WXML、API、重置、390px 和外观开关与安装端一致。
- 实际问题：旧镜像用一份演示默认同时充当源码默认，导致 WXML 和 reset 漂移，并遗漏 Methods API 分类。
- 决策：H5 分为基础、主题与尺寸、单位与毫秒、控制与自定义内容四区；源码默认与150秒演示初值分离，WXML专用生成，API增加共享Methods分类。
- 理由：用户需要快速筛选常用能力，同时复制代码、重置、Props、API 和安装端必须认同一个源码默认；Methods 是正式公开合同而非概览诊断信息。

AI 必须遵守：

- componentPropDefaults.count-down 必须保持源码 time=0，150000 只能作为 release demo 初值。
- 非默认 time 的 WXML 必须显式输出，源码重置必须恢复自闭合 <pui-count-down />。
- 概览控制必须调用真实 start/pause/reset/getTime，禁止只更新提示文字。
- 公开 Methods 必须进入 API 独立表并完整换行，不能塞进概览工程诊断区。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 DOM、px、CSS transition 与浏览器 timer 只镜像 WXML、rpx、WXSS 和微信计时器，需在目标基础库复核后台节流与取整。
- 真机/兼容风险：微信开发者工具 Service Port 关闭时无法更新 miniprogram_npm，发布门禁必须保留 pending-cli。

## PUI-FB-0072 · Table 重复布局入口、选择事件与滚动别名扩张核心数据合同

- 原始记录：`feedback/records/pui-fb-0072-table-api-and-state-contract.json`
- 范围：`component` / `table`、`shadcn-data-table`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Table 应以真实行列、局部滚动、固定列、受控选择和稳定排序为核心，公开 API 克制，基础代码最小且事件顺序清楚。
- 实际问题：旧合同把兼容别名、内部布局常量、装饰 Slot、重复事件和便捷滚动别名都提升为公开 API，使基础调用、文档和父级状态回写过度复杂。
- 决策：收敛为 26 Props、7 Events、1 empty Slot、9 Methods；删除 items/compact/minTableWidth/stickyHeader/headerHeight/rowHeight/showSelectAll/selectionFixed/clickable/customHeader/customFooter/duration/easing、重复 selection-change/row-select、header/footer/default Slots 和左右滚动别名。
- 理由：columns/data 是唯一结构真相源，列宽自然决定横滚；固定表头和选择列属于组件稳定实现；父级只需接收一次 input/change、独立 sort-change、cell/row/scroll/retry 事实。

AI 必须遵守：

- 禁止恢复 items、内部尺寸 Props、clickable、自由 header/footer/default Slots 或组件私有 duration/easing。
- 选择事件固定为 input 后 change；禁止重复发布 selection-change 或 row-select。
- 数据单元格点击先发布 cell-click，再由行根发布 row-click；Checkbox 必须阻断行 tap 冒泡。
- 列宽是横滚唯一宽度来源；固定表头、选择列和 500ms 动效属于稳定实现。

验证与遗留风险：

- 验证：`npm run precheck`
- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 scroll-view 惯性、sticky 左右列层叠、字体回流、大数据性能和辅助技术播报仍需合法 AppID 真机复核。
- 真机/兼容风险：旧消费者若使用已删除 Props、事件、Slots 或左右滚动方法，需要迁移到 columns/data、外层业务布局、input/change、empty Slot 与 scrollTo。

## PUI-FB-0073 · Table 官网分区宽度、边线属性与动效被全站样式覆盖

- 原始记录：`feedback/records/pui-fb-0073-table-preview-layout-parity.json`
- 范围：`component` / `table`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Table 官网应按常见能力分区，所有 Props 真实作用于同一表格，基础 WXML、API、390px、主题和外观开关与小程序合同一致。
- 实际问题：分区 Grid 的最小内容宽度、后置全站边线和过渡规则覆盖了 Table 自身几何与公开 Props，静态源码和构建均无法暴露。
- 决策：保留四分区并让每个 section 显式收缩；在全站外观层之后恢复 Table borderless 和固定生命周期；缩短演示固定列宽，确保窄屏可见区域可以真实点击排序列。
- 理由：Table 的横向溢出只能存在于自身 scroll 容器，组件 Prop 和生命周期必须比外观装饰规则更权威；演示列仍覆盖左右 fixed，但不能形成不可点击的遮挡。

AI 必须遵守：

- 包含宽内容的 Grid 分区子项必须 width:100%且min-width:0，不能依赖外层裁切掩盖溢出。
- 全站视觉规则之后必须保留 Table bordered=false 和固定180ms/1ms的权威覆盖。
- 演示固定列宽必须给中间列留下可点击区域，并在390px实测真实横滚和排序。
- Table 基础 WXML不得包含 bind、默认 Props、自由 Slot或方法注释。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run precheck`
- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 overflow/px/CSS sticky 只镜像微信 scroll-view/rpx/WXSS sticky，目标基础库的固定层叠和触摸惯性仍需合法 AppID 复核。
- 真机/兼容风险：微信开发者工具 Service Port 关闭或历史 miniprogram_npm 缺失时，安装产物门禁必须保持 pending-cli。

## PUI-FB-0074 · Swiper 字段别名、分页开关与自由 Slot 扩张原生 swiper 合同

- 原始记录：`feedback/records/pui-fb-0074-swiper-api-and-state-contract.json`
- 范围：`component` / `swiper`、`shadcn-swiper`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Swiper 应围绕真实 swiper、严格原始值、统一 Navigation、可组合条目和真实状态收口；基础调用克制，事件只在 API 或专项示例出现。
- 实际问题：旧合同要求调用者同时理解字段映射、六类分页开关、自由 Slot、内部优化和重复方法事件，基础 WXML 与父级回写成本远高于真实轮播目标。
- 决策：收敛为26 Props、7 Events、0 Slots、1 Generic、7 Methods；固定 SwiperItem schema，以 navigation Boolean/Object 统一 dots、dots-bar、fraction、inside/outside、controls 和 minShowNum；删除字段 Key、分页颜色与并行开关、readonly、pauseOnTouch、skipHiddenItemLayout、transition、自由 Slots 和 selectIndex。
- 理由：swiper 的真实价值是当前项、触摸/自动播放、方向/同屏、导航、资源与状态；内部触摸暂停应默认安全，结构差异只需一个 Generic，业务布局应放在组件外。

AI 必须遵守：

- 禁止恢复 itemKey/titleKey 等字段别名、分页颜色与并行开关、readonly、pauseOnTouch 或 skipHiddenItemLayout。
- 当前项事件固定为 input 后 change；受控模式必须等待父级真实回写，0、false 与空字符串不得字符串化比较。
- 业务 Header/Footer 放在组件外；Swiper 不公开 Slot，只允许 swiper-slide Generic 接管条目内容。
- Retry 只发布请求并保持 error；状态优先级固定 error > loading > content > empty。

验证与遗留风险：

- 验证：`npm run precheck`
- 验证：`npm run catalog:generate`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 swiper 的触摸惯性、纵向手势冲突、circular 多项同屏、图片内存和辅助技术播报仍需合法 AppID 真机复核。
- 真机/兼容风险：旧消费者若使用已删除字段映射、分页平行 Props、Slots、transition 或 selectIndex，需要迁移到固定 item schema、navigation、组件外布局、animationfinish 与 select。

## PUI-FB-0075 · Swiper 官网箭头文字、图片事件重放与代码分行偏离真实组件

- 原始记录：`feedback/records/pui-fb-0075-swiper-preview-runtime-parity.json`
- 范围：`component` / `swiper`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Swiper 官网必须按常见用法分区，真实点击、拖拽、自动播放、状态和属性回写；代码可复制，视觉与小程序组合一致。
- 实际问题：箭头组合、事件输出、单行代码格式与 Generic 注册分别绕过共享合同，使预览看似可操作但视觉、事件顺序和复制产物不可靠。
- 决策：保留基础用法、自动播放与导航、方向与多项、加载空错误四区；箭头迁到 iconButtonSample，图片事件在 items 不变时去重，非 content 状态不覆盖反馈；公共 WXML 格式器处理单行标签，customItem 代码注册 Generic alias。
- 理由：H5 必须镜像真实子组件组合与事件事实；缓存 DOM 重建不是新的业务资源加载，复制代码必须满足同源、可读和可运行三项合同。

AI 必须遵守：

- Swiper 纯图标 Controls 必须调用 iconButtonSample，content 为空且 aria-label 完整；不得用普通 Button 再隐藏文字。
- H5 DOM 重建不得把同一 type/index/src 的缓存图片报告成新的业务事件；items 变化后才重置资源报告。
- 单行闭合 WXML 同样必须经过 compactPreviewWxml，行长不超过80且每行最多3个属性。
- 生成 generic:swiper-slide 时必须在同一 usingComponents 代码中注册对应 alias。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run precheck`
- 验证：`npm run catalog:generate`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：当前浏览器宿主外层视口固定1280px；页面级390px由响应式合同测试覆盖，真实393px PreviewDevice已无横向溢出，仍需在可缩放宿主和真机复核整页导航换行。
- 真机/兼容风险：H5 Pointer Events、px transform 与缓存图片事件只能镜像微信 swiper/Image；真实触摸惯性、系统低动效和网络图片缓存策略仍需真机确认。

## PUI-FB-0076 · 全库检查被缺失的可选微信安装产物无条件阻断

- 原始记录：`feedback/records/pui-fb-0076-optional-wechat-artifact-check.json`
- 范围：`global` / `dialog`、`build-tooling`、`example`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-19
- 用户目标：组件逐项 battle 时应完成所有可自动执行的合同检查，同时把必须依赖微信开发者工具安全设置的产物明确保留为独立风险。
- 实际问题：Dialog 专项把外部工具生成目录视为必然存在，Service Port 关闭会把环境约束错误放大为全库源码失败。
- 决策：保留源码、dist、示例 node_modules 三路强制检查；微信 miniprogram_npm 改为存在即强制校验，不存在时通过文档、Ledger 和组件状态保留 pending-cli。
- 理由：缺失外部产物不能被伪造成成功，也不应阻断所有不依赖微信 GUI 的真实检查；条件校验同时保留了产物一旦生成后的回归能力。

AI 必须遵守：

- Node 合同测试必须强制校验源码、dist 和示例 node_modules，不得依赖微信 GUI 才能运行。
- miniprogram_npm 存在时必须加入一致性检查；缺失时不得手工镜像冒充 CLI 成功，发布状态保持 pending-cli。
- 不得自动开启微信开发者工具 Service Port 等安全设置。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`wechat-cli build-npm`
- 真机/兼容风险：微信 miniprogram_npm 尚未由官方 CLI 重建，所有组件安装端状态继续保留 pending-cli；需要用户明确开启 Service Port 后再补齐第四路一致性。

## PUI-FB-0077 · Collapse 字符串化值、重复事件与自由区域扩张多面板合同

- 原始记录：`feedback/records/pui-fb-0077-collapse-api-and-state-contract.json`
- 范围：`component` / `collapse`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Collapse 应参考 TDesign 的多面板主干，使用克制、可理解的数组值、互斥、主题、面板组合和真实状态；基础用法零 bind，事件只在 API 与受控专项示例出现。
- 实际问题：旧合同把值别名、状态色、自由区域、动效旋钮、重复事件和便捷方法同时公开，且字符串化身份会吞掉本轮必须验证的0/false/空字符串边界。
- 决策：收敛为17 Props、2 Events、0 Slots、1 Generic、0业务方法；value/defaultValue 只接受数组并严格匹配string/number/boolean，theme只保留default/card，内容差异交给collapse-panel Generic，删除customHeader/customFooter、duration/easing、input/open/close和公开方法。
- 理由：多面板组件的核心是展开值、互斥、Trigger、Content与状态；expanded 已足以区分展开和收起，change 足以表达一次值请求，业务布局和额外操作应放在组件外。

AI 必须遵守：

- value/defaultValue 只接受数组，值身份固定为typeof+value；禁止String(value)比较。
- 只发布change/retry，不恢复input/open/close或公开业务方法；受控模式等待父级回写。
- 业务Header/Footer与额外操作放在组件外；面板结构差异使用collapse-panel Generic。
- 状态优先级固定error > loading > content > empty，Retry保持error直到父级真实更新。

验证与遗留风险：

- 验证：`npm run precheck`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 SelectorQuery 的首次测量时序、rpx取整、Generic样式隔离、tap反馈和辅助技术朗读仍需合法AppID真机复核。
- 真机/兼容风险：旧消费者若使用单值value、状态色theme、Header/Footer Slot、input/open/close或公开方法，需要迁移到数组value、default/card、组件外组合与change。

## PUI-FB-0078 · Collapse 官网未分区、基础代码缺数据入口且事件诊断偏离新合同

- 原始记录：`feedback/records/pui-fb-0078-collapse-preview-runtime-parity.json`
- 范围：`component` / `collapse`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Collapse 官网应像 TDesign 演示一样按常见用法分区，真实操作同一组件状态；代码、Props、API与小程序实现一致，完整文字不省略。
- 实际问题：旧预览同时暴露已删除区域和事件，基础代码不可产生内容，视觉操作与公共API无法作为可靠筛选和复制依据。
- 决策：重建为基础用法、多开与互斥、卡片与Generic、加载空错误四区；移除Header/Footer和事件卡，面板开合只局部更新常驻内容节点；基础代码固定items数据入口，属性与工具栏继续复用makeUsageCode。
- 理由：用户需要按真实场景筛选组件，最小示例必须可产生内容；开合动画必须在同一DOM节点上可观察，Props与代码必须同源。

AI 必须遵守：

- Collapse基础WXML固定包含items数据入口且零bind；不得因演示默认过滤生成空组件。
- 面板开合只局部更新常驻内容节点，禁止整段renderStage掩盖动画。
- 概览不显示事件诊断、Header/Footer或方法卡；完整change/retry只进入API。
- default/card、Generic、状态和视觉开关必须复用真实Props与PUI helper，不创建静态占位。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run precheck`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：当前浏览器宿主外层视口固定1280px；真实393px PreviewDevice可用，页面级390px仍由响应式合同与后续可缩放宿主复核。
- 真机/兼容风险：H5 scrollHeight/px与键盘增强只能镜像微信SelectorQuery/rpx和触摸；Generic安装映射、系统低动效与真机读屏仍需确认。

## PUI-FB-0079 · Input 公开合同被键盘别名、重复事件和调试方法扩张

- 原始记录：`feedback/records/pui-fb-0079-input-api-and-state-contract.json`
- 范围：`component` / `input`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Input 应参考 TDesign 的单行输入主干，只暴露真实受控、长度、状态、组合、键盘和辅助能力；基础用法零 bind，完整事件只进 API Events。
- 实际问题：旧合同同时提供多套状态、Slot 开关、事件和方法，扩大 API 且容易让 AI 生成重复 bind 和冲突值路径。
- 决策：收敛为29 Props、5 Events、6 Slots、4 Methods；type 直接包含 password，status 固定 default/success/warning/error，Slot 用 slot 哨兵值启用，普通输入只发 change，清空固定 clear→change。
- 理由：输入组件的主干是值、键盘、长度、状态和组合；一次用户输入不应同时迫使消费者处理 input/change 两条语义相同的路径。

AI 必须遵守：

- value 只有 null/未传才是非受控；0、false 和空字符串都必须保留。
- 普通输入只发 change，清空顺序固定 clear→change，基础用法禁止绑定任何 bind。
- maxcharacter 优先于 maxlength，必须使用 Unicode 安全截断，禁止切断 emoji 代理对。
- disabled/readonly/loading 都阻断写入、清空和 focus()；禁止伪造事件或成功。

验证与遗留风险：

- 验证：`npm run precheck`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信软键盘的 cursorSpacing、adjustPosition、holdKeyboard、confirmHold、confirmType 和 focus 时序仍需合法 AppID 真机复核。
- 真机/兼容风险：输入法组合文字、emoji 和代理对的系统差异，以及读屏对 label/required/tips Slot 的朗读顺序需真机确认。

## PUI-FB-0080 · Input 官网旧诊断演示、焦点恢复与双层 Surface 偏离真实输入

- 原始记录：`feedback/records/pui-fb-0080-input-preview-runtime-parity.json`
- 范围：`component` / `input`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Input 官网应像 TDesign 一样按真实用法分区，一个个 Prop 能真实作用到输入框；基础 WXML 克制，API 全文完整。
- 实际问题：旧概览优先工程诊断，浏览器恢复焦点制造了可观察的事件顺序假象，且根/字段双层外观偏离小程序。
- 决策：概览重建为基础用法/状态与提示/图标与清空/尺寸与类型四区；删除方法和诊断卡，恢复焦点期间不发布用户 focus 反馈，根容器透明、唯一 field Surface。
- 理由：概览是用户筛选组件的产品页，应展示真实用法和可观察结果；内部 DOM 恢复不属于组件对外事件。

AI 必须遵守：

- Input 概览只保留真实用法和交互结果，禁止恢复方法卡、事件诊断卡和状态元数据卡。
- DOM 重建后的内部焦点恢复必须有独立门禁，禁止覆盖 change/enter/clear 等用户事件。
- Input 只能由 field/control 承担 Surface，根容器必须透明无边框。
- API 文字必须完整换行，不得用 ellipsis/nowrap 隐藏参数或说明。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run precheck`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：H5 password、number 与微信 safe-password/nickname/idcard 的系统键盘不等价，后三者需真机确认。
- 真机/兼容风险：微信 rpx 字体基线、Slot 动态宽度、原生清空命中区和读屏顺序仍需合法 AppID 复核。

## PUI-FB-0081 · 属性分组在任一 Prop 回写后被工作区重建折叠

- 原始记录：`feedback/records/pui-fb-0081-props-group-persistence.json`
- 范围：`global` / `preview-site`、`props-workspace`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：属性页应支持连续调整同一分组中的多个 Prop，不应每改一项就迫使用户重新展开分组。
- 实际问题：展开状态只存在可替换 DOM 上，整段 renderStage 后丢失，导致连续筛选属性的动线被打断。
- 决策：新增按 previewId 隔离的 propGroupOpen Set；capture toggle 事件保存明确展开/关闭，渲染前采集当前已挂载分组作为同步保险，新 DOM 按同一集合恢复 open。
- 理由：展开状态是工作区交互状态，必须跨局部 DOM 替换存续，同时又不应在组件路由之间串扰。

AI 必须遵守：

- 任何会整段重建 Props workspace 的路径都必须从 state.propGroupOpen 恢复分组。
- details 的明确展开和关闭都必须通过 toggle 写入，禁止只记录 open 而无法保存 close。
- 分组状态必须按 previewId 隔离，切换组件不得复用另一个组件的分组 ID。

验证与遗留风险：

- 验证：`node scripts/test-preview-prop-group-persistence.js`
- 验证：`npm run check`
- 验证：`npm run site:build`
- 真机/兼容风险：无已知遗留项。

## PUI-FB-0082 · Field 旧 disabled 伪能力与状态别名扩张公开合同

- 原始记录：`feedback/records/pui-fb-0082-field-api-and-form-boundary.json`
- 范围：`component` / `field`、`form`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Field 应参考 TDesign FormItem 的组合职责，只公开标签、布局、帮助、反馈和 Slot 能力；不能用容器透明度冒充子控件禁用，也不能在没有 Form 关系时伪造校验方法。
- 实际问题：旧合同把不能向 Slot 子树传播的 disabled 当成公开能力，同时存在重复状态命名，并缺少 label/content 对齐、具名反馈 Slot 和清晰 Form 边界。
- 决策：Field 收敛为12 Props、0 Events、5 Slots、0 Methods；删除 description/error/disabled/orientation，增加 name/help/message、requiredMarkPosition、labelAlign、contentAlign、arrow、reduceMotion；Field 为共享 field-row 的 editable 形态，Cell 为 readonly 形态；rules、showErrorMessage 和 validate 留到真实 Form 关系实现后再评估。
- 理由：容器只能公开自身能够真实执行的组合和布局职责；Slot 子控件状态必须显式传入对应控件，Form 校验必须由可追踪的父子数据关系驱动。

AI 必须遵守：

- 禁止给 Field 传 disabled/readonly/loading 期待它递归控制 Slot；必须把状态显式传给真实子控件。
- required 只显示标记，不等于 Form 规则，也不自动阻断提交。
- 在真实 Form relation 完成前禁止生成 rules、showErrorMessage、validate 或假校验事件。
- 普通文字优先 label/help/message，复杂组合才使用对应 slot 哨兵值和具名 Slot。

验证与遗留风险：

- 验证：`npm run precheck`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 rpx 下 labelWidth、箭头基线、五类 Slot 投影与读屏顺序仍需合法 AppID 真机确认。
- 真机/兼容风险：Field 与 Form 的规则注册、错误聚合、滚动定位和提交顺序尚未建立；本轮明确不承诺这组能力。

## PUI-FB-0083 · Field 官网分区噪音与预览重建使状态颜色直接跳变

- 原始记录：`feedback/records/pui-fb-0083-field-preview-motion-and-surface-parity.json`
- 范围：`component` / `field`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Field 官网应按用户能筛选的用法分区，真实组合 PUI 控件、保持单一 Surface，并能实际观察状态颜色的正常动效与低动效完成态。
- 实际问题：旧概览缺少用法结构；初版分区仍有帮助文案串扰；节点重建让 CSS transition 只存在于样式声明而没有可观察的运行过程。
- 决策：概览固定为基础用法、标签与对齐、必填与帮助、校验反馈四区；非帮助专项例清空 help；Field 使用与 Cell 同源的 field-row 行级 Surface，当前实例标记后由运行态保存上一 status，并在新节点执行500/1ms语义色 keyframe，animationend 后清理临时样式。
- 理由：分区必须帮助用户比较真实用法；在站点架构仍会替换节点时，显式继承上一语义色是对小程序同节点 property 更新动画的真实镜像，不是伪事件或提示文字。

AI 必须遵守：

- Field 与 Cell 必须复用同一 field-row 行级 Surface；普通 Input 透明嵌入，禁止形成第二层 Surface。
- 固定对照示例不得继承当前实例的无关 help/message，分区只保留本节需要比较的能力。
- 预览节点重建时若组件本体应有过渡，必须携带上一真实状态并验证 animationstart、完成态和 reduceMotion。
- Field 基础 WXML 禁止 bind，输入事件属于 pui-input，完整 Field API 只展示 Props 与 Slots。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 keyframe 只用于镜像小程序 property 更新的颜色过渡；微信 WXSS transition 的中间帧与 animationend 时序仍需真机录屏确认。
- 真机/兼容风险：毛玻璃、阴影和大圆角由 Slot 内真实子控件消费；不同小程序基础库的 backdrop-filter 支持度仍需真机确认。

## PUI-FB-0084 · Textarea 旧 44 Props 与重复事件方法扩张公开合同

- 原始记录：`feedback/records/pui-fb-0084-textarea-public-contract-overexposure.json`
- 范围：`component` / `textarea`、`documentation`、`example`、`npm-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Textarea 应参考 TDesign 的常用多行输入主干，基础用法保持基础，公开合同只保留能真实执行且不重复的值、字符、布局、状态、键盘、事件和方法。
- 实际问题：旧合同把兼容别名、内部调试方法、重复事件和视觉参数全部公开，且 maxcharacter 与 maxlength 的优先级、受控切回非受控的连续性与 Input 不一致。
- 决策：公开合同收敛为30 Props、7 Events、3 Slots、4 Methods；删除18个重复/视觉/布尔 Slot Props、input/confirm/linechange/reset 重复事件和 setValue/reset/getState；统一 change、clear → change、enter、line-change 与声明式父级回写。
- 理由：基础输入应让消费者快速找到值、上限、布局、状态和平台参数；只保留当前真实可执行且不能由现有主干表达的 PoemUI 能力。

AI 必须遵守：

- 基础 Textarea WXML 禁止 bind；事件只在 API Events 或事件专项示例按需绑定。
- value 的0、false和空字符串都是受控值；退控必须保留最后受控值，defaultValue 不重置用户输入。
- maxcharacter 非负时优先于 maxlength，ASCII=1、非 ASCII 与 emoji=2，禁止同时执行两轮截断。
- 禁止恢复 autoHeight/minRows/maxRows/showCount/error/invalid 布尔别名或 setValue/reset/getState 调试方法。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信原生 textarea 没有独立 readonly 属性，当前按合同映射为 native disabled 阻断编辑；选择复制与读屏差异需真机确认。
- 真机/兼容风险：confirmType、确认栏、选区、键盘抬升、line-change 和 keyboardheightchange 只可由合法 AppID 真机输入法真实验证。

## PUI-FB-0085 · Textarea 官网仍复制旧合同且焦点与状态镜像不真实

- 原始记录：`feedback/records/pui-fb-0085-textarea-preview-contract-parity.json`
- 范围：`component` / `textarea`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Textarea 官网应像 TDesign 一样按用法分区，属性、WXML、兼容说明和真实 H5 行为必须共同反映当前组件，而不是继续展示已删除 API 或只改变提示文字。
- 实际问题：属性数量、复制代码、兼容说明和运行镜像来自不同旧真相源，导致用户看到30 Props却复制出已删除的44 Props时代用法，focus 也只有属性没有真实行为。
- 决策：概览固定为基础用法、字符计数、自动增高、状态与交互四区；makeUsageCode 只输出非默认 Props和激活 Slot，零 bind；兼容说明改为30 Props合同；focus 增加真实 H5 运行绑定，状态、门禁、focus 类改为并行组合。
- 理由：同一属性必须在源码、Props、当前效果代码、兼容说明和 H5 运行态中只有一个可追踪解释；平台独有事件明确不伪造。

AI 必须遵守：

- Textarea 基础 WXML 只输出非默认 Props，不写任何 bind 或实例方法说明。
- focus Prop 在 H5 必须产生真实 activeElement，不能只写 autofocus；disabled/readonly/loading 继续阻断 focus。
- 状态、门禁和 focus 类必须并行组合，禁止互斥三元表达式吞掉 error/warning。
- H5 禁止凭换行数或 viewport 伪造 line-change 与 keyboardheightchange。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 自动高度按字体与行数估算，微信 auto-height、rpx 行高和软换行中间帧仍需目标基础库真机录屏确认。
- 真机/兼容风险：H5 不伪造 line-change/keyboardheightchange；微信事件 detail、高度单位、输入法确认栏和系统低动效需合法 AppID 真机确认。

## PUI-FB-0086 · Switch 旧 28 Props 与多入口事件方法扩张公开合同

- 原始记录：`feedback/records/pui-fb-0086-switch-public-contract-overexposure.json`
- 范围：`component` / `switch`、`documentation`、`example`、`npm-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Switch 应参考 TDesign 的常用开关主干，基础用法保持基础，公开合同只保留真实二元值、轨道内容、状态门禁、可访问性和低动效。
- 实际问题：旧合同同时保留兼容别名、布尔 Slot 开关、视觉参数、重复事件和调试方法，使用户与 AI 无法判断推荐入口。
- 决策：公开合同收敛为11 Props、1 Event、0 Slots、0 Methods；删除 checked/defaultChecked、外部标题说明、重复文案图标、Slot 开关、布局视觉参数、click/input/slot-click 与全部实例方法，只保留 change。
- 理由：Switch 本体只负责二元值和轨道；把标题、说明、校验与表单组合交还现有 Cell/Field/Form，可减少重复 Surface、操作区和状态真相源。

AI 必须遵守：

- 基础 Switch WXML 禁止 bind；事件只在 API Events 或事件专项示例按需绑定。
- value 的0、false和空字符串都是合法受控原始值；退控必须保留最后渲染值。
- disabled、readonly、loading 必须静默阻断，不发布 blocked click 或假 change。
- 禁止恢复 checked/defaultChecked、布尔 Slot 开关、外部标题说明、私有 duration/easing 或实例调试方法。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信自定义组件 property observer、受控父级 setData 时序、form-field 边界与辅助技术朗读仍需合法 AppID 真机复核。
- 真机/兼容风险：icon 名称和 Loading 在不同基础库、字体缩放与样式隔离下的几何仍需目标设备确认。

## PUI-FB-0087 · Switch 概览放入 Cell value 后点击命中父级而非开关

- 原始记录：`feedback/records/pui-fb-0087-switch-cell-hit-target-composition.json`
- 范围：`component` / `switch`、`cell`、`preview-site`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Switch 在官网和示例的 Cell 组合中必须是真实可点击的右侧操作，而不是看起来存在但命中父级的静态占位。
- 实际问题：旧演示把组件标记当普通 value 文本嵌入，视觉存在但点击路径被父 Cell 结构接管。
- 决策：基础和状态演示统一通过 Cell rightSlot 挂载共享 Switch 镜像；Cell 只负责标题说明与排列，Switch 保留唯一 role=switch 和点击根。
- 理由：right Slot 与原生 WXML、示例和真实用户路径一致，避免可交互组件落入文本容器或父级点击区。

AI 必须遵守：

- H5 Cell 组合可交互子组件时必须使用与原生 WXML 同名 Slot 通道。
- 禁止把 Switch、Button、Checkbox 等组件 HTML 传入 Cell value/description 文本字段。
- 父 Cell 不得代理子 Switch 切换或伪造 change 来源。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信 Cell Slot 的触摸冒泡、catchtap 消费者组合和无障碍焦点顺序仍需目标基础库真机复核。

## PUI-FB-0088 · Switch H5 重建与缺失缓动变量导致动画直接完成

- 原始记录：`feedback/records/pui-fb-0088-switch-preview-motion-prime.json`
- 范围：`component` / `switch`、`preview-site`、`motion`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Switch H5 必须对应 WXSS 的 transform 过渡，真实存在可观察中间帧、完成态和 reduceMotion，而不是重建后直接跳到终点。
- 实际问题：旧 H5 的 transition 变量链和节点重建首帧都不完整，视觉表现等价于瞬移。
- 决策：为 Switch 根补齐500ms/standard easing 默认变量；重建后的首帧通过 is-motion-prime 无过渡校准，强制布局后下一帧只执行正向 transform，transitionend 或安全超时进入 completed。
- 理由：显式首帧可让 H5 重建模型仍复现原生节点持续存在时的单向过渡，且不依赖无效 height:auto、display:none 或任意延时猜测。

AI 必须遵守：

- Switch 动画必须验证计算 transition 和至少一个真实中间帧，不能只检查最终 class。
- 动态重建完成态节点时必须先无过渡校准起点，禁止让回拉和正向切换形成反转缩短。
- 缓动变量必须有可解析默认值，不能让整个 transition 简写因未定义 var 失效。
- 禁止用 height:auto、display:none、假状态文字或 CSS keyframes 替代轨道 transform。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信真机帧率、基础库 transitionend 等价行为、系统低动效读取和快速连续点击仍需目标设备录屏复核。

## PUI-FB-0089 · Switch 四个演示分区标题仅有 8px 间隔

- 原始记录：`feedback/records/pui-fb-0089-switch-showcase-section-spacing.json`
- 范围：`component` / `switch`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Switch 的基础、文字图标、状态和尺寸分区必须一眼可分辨，分区标题上间距使用统一语义 Token。
- 实际问题：分区关系与区内组合都使用8px，标题无法形成清晰层级。
- 决策：在 H5 Token 根定义 --pui-section-gap 对应18px，并让 Switch Showcase 根在 component-only 规则后显式消费；内部 Cell 列表仍保持8px。
- 理由：分区与区内关系分别使用18px和8px，和全局36rpx/16rpx语义镜像一致，也不会改变组件本体尺寸。

AI 必须遵守：

- 演示分区间距与区内内容间距必须使用不同语义 Token。
- component-only 后置归一化不得把已声明的 section gap重新压成 content gap。
- 禁止用标题私有 margin、空容器或改变固定设备高度补分区层级。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：该问题只属于 H5 官网文档分区；微信组件本体与安装产物不受影响。

## PUI-FB-0090 · Checkbox 旧多值别名与重复事件方法扩张公开合同

- 原始记录：`feedback/records/pui-fb-0090-checkbox-public-contract-overexposure.json`
- 范围：`component` / `checkbox`、`documentation`、`example`、`npm-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Checkbox 应参考 TDesign 的常用选择主干，基础用法保持基础，公开合同只保留单一选中所有权、真实值标识、三态、状态门禁、内容和可访问性。
- 实际问题：旧合同把值标识与选中状态混为一谈，并同时暴露重复事件、视觉开关和命令式入口，使父级回写与组合语义不明确。
- 决策：公开合同收敛为19 Props、1 Event、3 Slots、0 Methods；checked/defaultChecked 唯一负责状态，value 唯一负责原始身份，删除重复值别名、click/input、loading/custom、私有动效和全部实例方法。
- 理由：单一声明式所有权能与 CheckboxGroup、Form 和父级回写组合，原始标量身份则覆盖真实数据边界而不制造字符串化碰撞。

AI 必须遵守：

- 基础 Checkbox WXML 禁止 bind；事件只进入 API Events 或事件专项示例。
- value 的0、false和空字符串都是合法身份，不得用于判断是否选中。
- 受控 Checkbox 只发布请求并等待父级回写，退控必须保留最后渲染状态。
- 禁止恢复重复状态别名、click/input、loading/custom 或命令式状态方法。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信自定义组件 observer、wx://form-field、Slot 投影、受控父级 setData 时序和辅助技术朗读仍需合法 AppID 真机复核。
- 真机/兼容风险：rpx 标记几何、Icon 字体抗锯齿和系统低动效读取需目标设备确认。

## PUI-FB-0091 · CheckboxGroup 缺少真实父子状态与发布入口

- 原始记录：`feedback/records/pui-fb-0091-checkbox-group-missing-real-composition.json`
- 范围：`component` / `checkbox`、`checkbox-group`、`preview-site`、`example`、`npm-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Checkbox 的组合、全选、半选、最大选择数和组级门禁必须由真实 CheckboxGroup 承担，而不是演示层手工拼状态。
- 实际问题：没有真实 Group，组合状态只能在 H5 或业务页面重复实现，无法保证小程序、官网、示例和安装产物一致。
- 决策：在 checkbox 包内新增 sibling CheckboxGroup，并同步 index、metadata、API、H5、示例、dist 和测试；Group 固定11 Props、1 Event、1 Slot、0 Methods。
- 理由：真实父组件让 options 数据入口和 Slot 子项共用一套状态机，也与 PoemUI 单包承载父子能力的既有发布策略一致。

AI 必须遵守：

- CheckboxGroup value/defaultValue 必须保留原始标量类型并去重，禁止一律 String 化。
- 全选取消时必须保留已选 disabled 项，max 必须阻断新增而不删除已有值。
- 组级 disabled/readonly/borderless 只在子项未显式覆盖时继承。
- options 和 default Slot 必须共用同一父级状态所有权。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 relation linked/unlinked 时序、options 与 Slot 混用、form-field 数组序列化和组级属性传播仍需合法 AppID 真机复核。

## PUI-FB-0092 · Checkbox H5 全选统计误把内容节点计为选项

- 原始记录：`feedback/records/pui-fb-0092-checkbox-preview-checkall-selector.json`
- 范围：`component` / `checkbox`、`checkbox-group`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：H5 全选、半选和取消全选必须和真实 CheckboxGroup 一致，状态由真实选项输入决定。
- 实际问题：内容节点被当作额外未选选项，使完成态持续为 mixed，演示与真实 Group 合同不一致。
- 决策：集合查询精确限定为 input[data-checkbox-option]；内容节点仍可保留事件标识，但不得参与选项总数、checked 或 indeterminate 推导。
- 理由：状态统计应以真实平台输入为唯一事实源，避免展示结构变化改变业务结果。

AI 必须遵守：

- 集合状态查询必须限定组件平台根标签与精确 data 标识。
- 不得根据展示 DOM 数量推导业务选项数量。
- 全选验收必须同时读取数组值、checked、indeterminate 与 disabled 保留。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：该缺陷属于 H5 DOM 统计；微信原生 Group 使用 relation 状态机，但其触摸与属性传播仍需真机复核。

## PUI-FB-0093 · Checkbox H5 原生 indeterminate 点击后回滚半选态

- 原始记录：`feedback/records/pui-fb-0093-checkbox-native-indeterminate-rollback.json`
- 范围：`component` / `checkbox`、`preview-site`、`motion`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：半选 Checkbox 实点后必须清除 mixed 并进入真实选中态，且普通模式存在中间帧、低动效为1ms。
- 实际问题：旧 H5 的原生默认动作与陈旧闭包覆盖父级写回，使半选态在点击完成后回滚，动画完成态也无法可信验证。
- 决策：点击逻辑读取真实 input 当前态，半选请求固定清除 indeterminate；父级回写后在默认动作结束阶段重申最终状态，动画只使用500ms opacity/background/transform，低动效1ms。
- 理由：这既保留真实平台 input 和键盘能力，也让受控父级成为最终状态所有者，不用假提示或禁用默认交互。

AI 必须遵守：

- 原生 checkbox 的 indeterminate 是 DOM property，不能只写 attribute 或依赖旧闭包。
- 受控回写必须在原生默认动作后仍保持最终状态。
- Checkbox 动画必须实际测量中间帧，不能只读取最终 class。
- 禁止用假事件文字、display:none或height:auto过渡替代真实状态。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信真机 tap、observer/setData、transitionend、连续快点和系统低动效读取仍需目标基础库录屏复核。

## PUI-FB-0094 · Radio 旧双模式与重复事件方法扩张公开合同

- 原始记录：`feedback/records/pui-fb-0094-radio-public-contract-overexposure.json`
- 范围：`component` / `radio`、`documentation`、`example`、`npm-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Radio 应参考 TDesign 的互斥选择主干，基础用法保持基础，公开合同只保留单项状态、原始身份、内容、门禁和唯一 change。
- 实际问题：旧合同把组数据、状态面板、重复事件和命令式方法全部塞进 Radio，父级回写与组件职责不清晰。
- 决策：公开合同收敛为18 Props、1 Event、4 Slots、0 Methods；删除 options 双模式、状态面板、重复事件、实例方法和私有动效参数。
- 理由：单一声明式所有权可与独立 RadioGroup、Form 和父级回写组合，减少一次选择请求的重复事件表面。

AI 必须遵守：

- 基础 Radio WXML 禁止 bind；事件只进入 API Events 或事件专项示例。
- value 的0、false和空字符串都是合法身份，不得用于判断 checked。
- 禁止恢复 options 双模式、重复事件、状态面板或命令式状态方法。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 observer、wx://form-field、Slot 投影和父级 setData 时序仍需合法 AppID 真机复核。
- 真机/兼容风险：辅助技术朗读与系统低动效读取需目标设备确认。

## PUI-FB-0095 · Radio 缺少可安装的真实 RadioGroup 关系组件

- 原始记录：`feedback/records/pui-fb-0095-radio-group-missing-real-composition.json`
- 范围：`component` / `radio`、`radio-group`、`example`、`npm-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：RadioGroup 应能独立安装和组合手动 Radio 或 options，真实管理标量值、父级状态和唯一 change，而不是由单项组件兼任。
- 实际问题：旧实现只能把 options 塞给 Radio，本体身份随 Prop 改变，手动子项无法共享父级状态或值。
- 决策：新增 radio/radio-group.js/json/wxml/wxss，以 relation 管理 options 和手动子项，固定13 Props、1 Event、1 Slot、0 Methods。
- 理由：Group 是标量选择所有者，独立组件才能统一数据驱动与 Slot 组合，并让父级状态继承可测试、可安装。

AI 必须遵守：

- 组选值必须由 pui-radio-group 所有，禁止把 options 恢复到 pui-radio。
- Group 必须严格比较0、false、空字符串和字符串值。
- options 与 default Slot 子项必须共享同一 relation 状态机。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 relation 的 linked/unlinked 顺序、options 与 Slot 混合子项及 form submit 值需合法 AppID 真机复核。
- 真机/兼容风险：动态增删 Radio 后的 relation 重排需目标基础库确认。

## PUI-FB-0096 · Radio H5 独立状态示例复用 name 导致意外互斥

- 原始记录：`feedback/records/pui-fb-0096-radio-h5-native-name-collision.json`
- 范围：`component` / `radio`、`radio-group`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：H5 状态与图标分区中的独立 Radio 必须各自保留声明的选中态，只有真实 RadioGroup 内的 input 才互斥。
- 实际问题：所有静态示例复用 release-channel，浏览器解析 DOM 时自动取消前面的 checked，预览状态与模板和小程序能力不一致。
- 决策：name 生成顺序改为 Group 显式 name、主项 Props name、静态示例唯一 key；每个上下文只影响自己的真实 input 集合。
- 理由：原生 radio 的互斥事实源就是 name，演示上下文必须在 DOM 生成时明确分组，不能靠 class 修补 checked。

AI 必须遵守：

- 只有同一个 RadioGroup 内的 input 可以共享 name。
- 主项读取 Props name，静态状态和图标示例必须使用唯一 name。
- 互斥验收必须读取真实 input.checked 和 input.name，不能只看 class。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：该缺陷属于 H5 原生 name 规则；微信端 relation 不依赖 HTML name，但其 form-field 语义仍需真机复核。

## PUI-FB-0097 · Radio 原生 borderless 没有可移除的 Surface

- 原始记录：`feedback/records/pui-fb-0097-radio-borderless-native-noop.json`
- 范围：`component` / `radio`、`radio-group`、`h5-preview`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Radio 的 borderless 和全局边框开关必须在小程序与 H5 都有真实视觉含义，同时保持盒模型、选中边界和布局稳定。
- 实际问题：原生 borderless 是无效果开关，H5 却会明显改变 Surface，文档和真实 WXSS 不一致。
- 决策：原生与 H5 都采用默认中性 Surface；borderless 移除背景、边界和附加视觉，checked 非 borderless 保留语义边界，尺寸与布局不变。
- 理由：Boolean 外观 Prop 必须能在计算样式中验证，且两端应共享同一默认与关闭语义。

AI 必须遵守：

- 新增外观 Boolean 前必须先确认默认态存在可切换的计算样式。
- borderless 与全局 border off 只能透明化中性视觉，不得改变盒模型。
- 外观验收必须读取组件计算样式和几何，不能只读 data 属性。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信真机的毛玻璃支持、阴影裁切、rpx边界抗锯齿和大圆角映射仍需目标基础库复核。

## PUI-FB-0098 · Form 旧固定字段生成器混合数据、布局与操作职责

- 原始记录：`feedback/records/pui-fb-0098-form-fixed-generator-api-overexposure.json`
- 范围：`component` / `form`、`field`、`documentation`、`example`、`npm-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Form 应参考 TDesign 的可组合父容器主干，基础用法保持最小，字段、输入控件和提交按钮由消费者使用真实 PoemUI 组件组合。
- 实际问题：旧 Form 是固定表单页面生成器，字段 schema、内部值、操作按钮和校验提示全部耦合在组件本体。
- 决策：删除固定生成器 API，Form 收敛为 data/rules/showErrorMessage/scrollToFirstError/resetType/ariaLabel/reduceMotion，并由默认 Slot 承接消费者组合。
- 理由：字段控件与操作 Button 保持独立组件所有权，Form 才能复用在不同业务结构中，并避免两份值状态。

AI 必须遵守：

- 基础 Form WXML 禁止 bind，事件全集只进入 API Events。
- Form 本体不得固定生成 Input 或 Button；字段和动作必须由默认 Slot 组合。
- 禁止恢复 items/value/defaultValue/disabled/showActions 和按钮文案 Props。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信原生 form 对自定义 Button form-type 的事件派发仍需合法 AppID 真机复核。
- 真机/兼容风险：消费者复杂 Slot 和多层自定义组件关系的渲染顺序需目标基础库确认。

## PUI-FB-0099 · Form 缺少真实 Field 关系、集中规则和受控重置链路

- 原始记录：`feedback/records/pui-fb-0099-form-field-relation-and-rule-engine-gap.json`
- 范围：`component` / `form`、`field`、`input`、`switch`、`radio`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：表单校验、提交、重置和服务端错误必须来自真实受控数据与字段关系，保留0、false、空字符串并让父级决定最终写回。
- 实际问题：旧组件只有本地 required 检查和内部值清理，不能为真实业务表单提供可组合验证闭环。
- 决策：建立 Form–Field 双向 relation；规则集中在 Form，Field 只接收内部上下文；submit、reset、clearValidate、setValidateMessage 全部遵守受控边界。
- 理由：集中规则避免 Field 与 Form 两份真相，事件结果和父级回写让校验、业务请求与视图状态可以独立闭环。

AI 必须遵守：

- 规则只放Form，Field只按name接收内部校验结果，不公开第二份rules。
- submit必须先validate再submit，valid只代表本地校验，不代表业务成功。
- reset只发布下一份data；0、false和空字符串不得被truthy判断丢失。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 relation linked/unlinked 次序、动态 Field 增删和重复 name 需合法 AppID 真机复核。
- 真机/兼容风险：wx.pageScrollTo 在自定义滚动容器内的定位边界与系统低动效需目标设备确认。
- 真机/兼容风险：异步 validator 完成期间页面卸载或连续提交的竞态仍需真实业务接入时决定取消策略。

## PUI-FB-0100 · Form H5 演示与复制代码沿用固定字段和诊断式反馈

- 原始记录：`feedback/records/pui-fb-0100-form-h5-preview-and-usage-parity.json`
- 范围：`component` / `form`、`preview-site`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：官网 Form 必须像真实小程序一样组合 PUI Field/Input/Switch/Radio/Button，按用法分区，复制代码可直接使用且不能只改提示文字伪造事件。
- 实际问题：旧 H5 与新原生合同不同源，固定字段运行态和不完整复制代码不能证明消费者组合路径。
- 决策：重建 Form H5 运行态与三分区概览，删除旧 items/formValues 分支；复制代码补齐 PUI Button，静态状态示例使用正确 placeholder/help。
- 理由：共享子组件镜像和真实 DOM form 可同时证明跨端能力、事件顺序、视觉开关与可复制安装路径。

AI 必须遵守：

- Form H5不得恢复items/formValues固定字段运行态或只更新提示文字的提交。
- 基础复制代码必须包含Form/Field/Input/Button usingComponents且零bind。
- Form和Field根在所有外观模式下必须透明，唯一Surface属于真实子控件。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 HTML form 与微信原生 form 的键盘提交、焦点滚动和辅助技术朗读仍存在平台差异。
- 真机/兼容风险：小程序端 Field 消息过渡的中间帧需目标设备录屏确认。

## PUI-FB-0101 · Picker 公开合同退化为与 Select 重复的单值 options API

- 原始记录：`feedback/records/pui-fb-0101-picker-duplicate-select-contract.json`
- 范围：`component` / `picker`、`select`、`documentation`、`metadata`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Picker 应承担滚轮、多列和级联选择，公开合同克制且能清楚区别于已有 Select，不为对齐数量暴露无关能力。
- 实际问题：旧合同只覆盖单值原生 picker，与 Select 重复，无法形成逐列 pick、确认提交、取消回滚和级联路径。
- 决策：以 columns、值数组、Popup/内联和确认草稿为核心重建 Picker；拒绝照搬 TDesign PickerItem 子组件，PoemUI 统一由数据驱动 columns 表达列。
- 理由：数据驱动列能覆盖小程序常用动态数据并减少额外注册组件，同时仍保留 TDesign 已验证的多列、级联和显隐语义。

AI 必须遵守：

- 生成 Picker 时使用 columns 与值数组，禁止恢复 options + 标量 value。
- 严格保留 0、false 和空字符串，禁止用 truthy 判断选项值。
- 基础 Picker WXML 不绑定事件；受控和事件顺序只进入专项示例与 API。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：picker-view 在 iOS/Android 的惯性、触感与 disabled 项吸附差异仍需目标真机确认。
- 真机/兼容风险：自定义 keys 与超长中文标签在低版本基础库的渲染性能需真机抽样。

## PUI-FB-0102 · Picker H5 退化为原生 select 且无法镜像滚轮交互

- 原始记录：`feedback/records/pui-fb-0102-picker-h5-native-select-parity.json`
- 范围：`component` / `picker`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：官网 Picker 必须对应真实 picker-view 能力并能实际点击、键盘、滚轮和拖动，不能用原生 select 或提示文字代替。
- 实际问题：原生 select 只能表达单列立即变更，无法证明多列、级联、草稿、事件顺序或严格值。
- 决策：删除原生 select 镜像，重建可交互 H5 滚轮；所有运行态均复用 columns/keys/value/defaultValue 语义。
- 理由：只有真实滚轮交互才能验证与 picker-view 一致的列路径、事件来源、草稿回滚和边界值。

AI 必须遵守：

- Picker H5 必须覆盖点击、键盘、wheel 和 drag，并标记真实 source。
- 滚轮只更新 draft 并触发 pick；confirm 后才写回 value。
- 原生 select 不得重新加入 Picker 的 preview control allowlist。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：H5 pointer/wheel 与微信 picker-view 原生惯性曲线不同，官网只声明能力和事件镜像，不声明像素级物理一致。

## PUI-FB-0103 · Picker Popup 声明 transition 但插入时已是完成态

- 原始记录：`feedback/records/pui-fb-0103-picker-popup-transition-no-intermediate-frame.json`
- 范围：`component` / `picker`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Picker 打开和关闭必须有不超过 500ms 的真实中间帧，reduceMotion 时压缩为 1ms。
- 实际问题：CSS 虽写 transition-duration=500ms，但 DOM 首次出现时已处于目标样式，用户看不到动画。
- 决策：加入四阶段挂载生命周期并使用插入即执行的 enter/leave keyframes，完成后再切换 entered 或卸载。
- 理由：关键帧不依赖旧 DOM 延续，能在当前重绘架构下可靠产生真实中间帧且不触碰 height:auto/display:none。

AI 必须遵守：

- 浮层整段重建时必须证明 entering/leaving 中间帧，不能只检查 transition 声明。
- Picker 动效固定 500ms，reduceMotion 固定 1ms。
- 离场完成前保持 mounted，禁止 display:none 或立即移除。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信原生 Popup 与 H5 keyframes 的合成层时序仍需低端真机录屏抽样。

## PUI-FB-0104 · Picker Popup 阴影和毛玻璃外观开关实际不生效

- 原始记录：`feedback/records/pui-fb-0104-picker-visual-switches-inert.json`
- 范围：`component` / `picker`、`preview-site`、`config-provider`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Picker 必须在深浅色、边框、阴影、毛玻璃、大圆角和渐变背景开关下真实变化且不改变布局。
- 实际问题：阴影和毛玻璃开关对 Picker panel 没有实际视觉作用，形成只切 data 属性的伪验收。
- 决策：Popup panel 统一消费 --preview-surface、--preview-border、--preview-shadow-card 和 --preview-blur；inline 外壳保持透明避免双层 Surface。
- 理由：共享 preview Token 已承载站点视觉设置，组件直接消费可同时保证持久化、主题与布局稳定。

AI 必须遵守：

- Picker H5 Surface 消费 preview-surface/shadow/blur/border Token，禁止私有未定义变量。
- 每项视觉开关必须读取代表 panel 的计算样式。
- inline Picker 只能有一个可见 Surface。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信 WebView 对 backdrop-filter 不提供同等能力；小程序端按 WXSS/Provider 能力降级，需目标机型确认视觉性能。

## PUI-FB-0105 · 窄屏常规模式代码正文覆盖 PreviewDevice 下半区

- 原始记录：`feedback/records/pui-fb-0105-preview-code-mobile-overlays-device.json`
- 范围：`global` / `preview-site`、`all-components`、`picker`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：390px 下固定 622px PreviewDevice 必须完整可操作，代码正文位于设备下方且不能覆盖或截获组件交互。
- 实际问题：代码正文仍按桌面绝对定位叠在设备上，视觉和命中测试同时失真。
- 决策：在 <=1180px 显式恢复 relative 与四向 auto，通过共享 gutter/margin 把代码正文放到 PreviewDevice 下方正常流；<=700px 同步移动端 gutter。
- 理由：正常流能从结构上消除覆盖和命中冲突，同时保持设备、代码各自独立的固定语义高度。

AI 必须遵守：

- <=1180px 必须显式清除 preview-code-mount 的绝对定位四向坐标。
- 390px 验收同时测量 device bottom、code top 和交互命中。
- 240px 只属于代码正文，PreviewDevice 永远保持 622px。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：移动 Safari 动态工具栏改变 dvh 时需实机确认 240px 代码正文滚动手感，但不会再覆盖设备。

## PUI-FB-0106 · DateTimePicker 旧版拆成两个原生选择器且公开合同过量

- 原始记录：`feedback/records/pui-fb-0106-date-time-picker-split-native-contract.json`
- 范围：`component` / `date-time-picker`、`picker`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：DateTimePicker 应像成熟小程序组件一样提供一套可确认的日期时间滚轮，API 克制、基础示例简单，并与 PUI Picker 组合而不是重复实现。
- 实际问题：旧实现是两个原生系统面板的布局壳，日期和时间无法在一次确认中联动，公开了大量展示、状态和私有动效属性。
- 决策：重建为 PUI Picker 的日期时间适配器，公开 21 Props、7 Events、0 Slots、6 Methods；移除旧分裂字段、状态装饰和私有动效 API。
- 理由：日期时间列、确认、取消、显隐和滚轮交互应只有一份事实源；DateTimePicker 只增加领域算法，避免复制 Popup、Button、Loading、Empty 和 picker-view。

AI 必须遵守：

- DateTimePicker 只维护日期时间列算法，Popup、滚轮和确认生命周期必须复用 PUI Picker。
- 基础 WXML 不得出现 bind:*，完整事件只进入 API Events。
- 本地日期算法不得虚构 loading/error/empty；可视范围日历使用 Calendar + Popover。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 picker-view 的触摸惯性、Popup relation、rpx 中间帧和真机读屏仍需合法 AppID 实机确认。

## PUI-FB-0107 · DateTimePicker H5 使用 date/time input 无法镜像统一草稿与动态列

- 原始记录：`feedback/records/pui-fb-0107-date-time-picker-h5-wheel-parity.json`
- 范围：`component` / `date-time-picker`、`picker`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：官网必须真实演示 DateTimePicker 的点击、键盘、滚轮、拖动、确认、取消和 Props 变化，不能用浏览器原生输入框冒充。
- 实际问题：浏览器 date/time input 使用系统独立面板和立即值变更，无法验证多列联动、事件顺序、显隐受控或 Picker 中间帧。
- 决策：删除 date/time input 镜像，DateTimePicker H5 直接调用 Picker 滚轮渲染与交互路径，新增四个能力分区，并将组件纳入统一 edge-to-edge PreviewDevice 布局。
- 理由：只有同一滚轮模型才能证明动态日列、步长、严格边界、草稿回滚、事件顺序和跨端外观一致性。

AI 必须遵守：

- H5 必须覆盖点击、键盘、wheel 和 drag，并保持 pick/confirm/cancel 草稿边界。
- 日期列必须随年份、月份、范围和 steps 动态重算。
- dateTimePickerShowcase:input 不得重新加入原生控件允许清单。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：H5 Pointer/wheel 与微信 picker-view 的原生惯性曲线不同，只承诺能力和事件镜像，不承诺物理曲线像素级一致。

## PUI-FB-0108 · Search 监听了 PUI Input 不存在的 input 与 confirm 事件

- 原始记录：`feedback/records/pui-fb-0108-search-child-event-mismatch.json`
- 范围：`component` / `search`、`input`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Search 必须在微信端真实接收输入、清空与确认，不得只让 H5 演示看起来可用。
- 实际问题：Search 监听不存在的 input/confirm，因此原生输入、确认和清空值回写无法形成真实闭环。
- 决策：Search 只监听 PUI Input 的 change/enter/clear/focus/blur；公开值事件收敛为 change，删除重复 input，并固定清空 clear → change。
- 理由：组合组件必须以依赖组件的真实公开事件为唯一输入，才能让源码、H5、示例和安装端共享同一生命周期。

AI 必须遵守：

- 修改复合组件前必须核对依赖组件实际 triggerEvent 名称。
- Search 真实输入只公开 change，不生成重复 input。
- 清空必须保持 Input clear 后 change 到 Search clear → change 的顺序。

验证与遗留风险：

- 验证：`node scripts/test-search.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信软键盘 confirm-type、原生焦点顺序、组件事件冒泡与读屏语义仍需合法 AppID 真机复核。

## PUI-FB-0109 · Search 公开合同和 H5 演示混入重复事件与业务结果语义

- 原始记录：`feedback/records/pui-fb-0109-search-api-preview-contract.json`
- 范围：`component` / `search`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Search 要像 TDesign 的组件文档一样分区展示常见用法，同时 API 克制、基础 WXML 最小、所有 Props 和文字完整可读。
- 实际问题：重复事件和私有动效扩大 API，业务结果块制造能力错觉，退控历史与 PUI Input 动效在 H5 中不完整。
- 决策：对照 TDesign 1.15.3 重建 Search 为 17 Props/6 Events/1 Slot/0 Methods；删除业务结果、重复 input、duration/easing，补齐严格退控、字符上限、分区演示与固定 500ms/1ms。
- 理由：搜索结果属于消费者业务；基础组件应只表达输入、清空、确认和取消，同时保留 PoemUI 已真实闭环的受控、只读、辅助与低动效能力。

AI 必须遵守：

- 基础 Search WXML 不展示 bind 事件；事件全集只进入 API Events。
- H5 必须复用 PUI Input/Button/Icon 并保持受控、退控和字符规整同源。
- 不得恢复 resultList、重复 input、duration/easing 或假搜索结果。
- API 表格必须完整换行展示真实上限，Props 面板的演示滑块范围不得冒充组件 API 上限。

验证与遗留风险：

- 验证：`node scripts/test-search.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信软键盘搜索键、focus Prop、清空按钮触摸顺序、rpx 焦点中间帧、样式隔离、系统低动效和读屏仍需合法 AppID 真机复核。

## PUI-FB-0110 · Stepper 监听了 PUI Input 不存在的 input 事件

- 原始记录：`feedback/records/pui-fb-0110-stepper-child-event-mismatch.json`
- 范围：`component` / `stepper`、`input`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Stepper 必须在微信端真实接收输入、Enter 与失焦提交，不能只让 H5 演示看起来可用。
- 实际问题：Stepper 监听不存在的 input，导致原生直接输入无法进入组件状态机，H5 旧演示的可用表象不能代表微信源码。
- 决策：Stepper 只监听 PUI Input 的 change/enter/focus/blur；输入先保存草稿，Enter 或失焦走唯一规整提交器。
- 理由：复合组件必须以依赖组件真实公开事件为唯一输入，才能让源码、H5、示例和安装端共享同一生命周期。

AI 必须遵守：

- 修改复合组件前必须核对依赖组件实际 triggerEvent 名称。
- Stepper 输入只保存草稿，Enter 或 blur 才规整并提交 change。
- 失焦提交的公开顺序固定为 change → blur。

验证与遗留风险：

- 验证：`node scripts/test-stepper.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信数字键盘 Enter、原生 focus/blur 顺序、组件事件冒泡、rpx 输入宽度和读屏语义仍需合法 AppID 真机复核。

## PUI-FB-0111 · Stepper 公开合同混入重复事件、私有动效与误导 Slot

- 原始记录：`feedback/records/pui-fb-0111-stepper-api-preview-contract.json`
- 范围：`component` / `stepper`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Stepper 应像 TDesign 文档一样分区展示真实常见用法，API 克制、基础 WXML 最小且全部文字完整可读。
- 实际问题：重复事件、私有动效和默认 Slot 扩大公共面，单一演示无法证明真实输入、边界、受控回写和状态门禁。
- 决策：对照 TDesign 1.15.3 收敛 Stepper 为 14 Props/4 Events/0 Slots/0 Methods；删除 input、duration/easing 和默认 Slot，补齐主题、尺寸、输入宽度、只读、严格退控与固定 500ms/1ms。
- 理由：Stepper 只负责一个数值的步进、输入与边界意图；单位和业务状态由消费者相邻组合，事件和动效保留单一真相源。

AI 必须遵守：

- 基础 Stepper WXML 不展示 bind 事件；事件全集只进入 API Events。
- H5 必须复用 PUI Input/Button/Icon 并保持受控、退控、输入提交和边界同源。
- 不得恢复重复 input、duration/easing、默认 Slot 或假事件面板。
- API 表格必须完整换行展示，Props 面板演示范围不得冒充组件 API 边界。

验证与遗留风险：

- 验证：`node scripts/test-stepper.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信数字键盘、focus/blur 顺序、浮点步长、rpx 中间帧、样式隔离、系统低动效和辅助技术仍需合法 AppID 真机复核。

## PUI-FB-0112 · 全站视觉过渡覆盖 Stepper 固定动效生命周期

- 原始记录：`feedback/records/pui-fb-0112-stepper-preview-motion-override.json`
- 范围：`component` / `stepper`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Stepper 的 H5 镜像必须真实遵守源码固定 500ms 和 reduceMotion 1ms，外观开关不能静默改写组件生命周期。
- 实际问题：后置共享外观规则把 Stepper 计算时长覆盖为 220ms，H5 不再对应组件源码。
- 决策：在共享外观规则之后为 Stepper 根恢复五项组件作用域过渡，全部消费 --pui-stepper-duration 与 --pui-stepper-ease。
- 理由：全局外观只能补充视觉 Token，不能改变已经有明确合同的组件动效时长；组件作用域声明可同时保留外观过渡和低动效。

AI 必须遵守：

- 外观开关规则只能改变视觉 Token，不得改写组件声明的生命周期变量。
- 动效验收必须同时读取 transition-property、transition-duration 和 reduceMotion 最终计算值。
- 新增后置共享 transition 时必须回归已有固定动效组件。

验证与遗留风险：

- 验证：`node scripts/test-stepper.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信 WXSS/rpx 中间帧、系统级减少动态效果映射和低端机合成性能仍需合法 AppID 真机复核。

## PUI-FB-0113 · Slider 公开合同混入重复事件、实例方法、Slot 与私有动效

- 原始记录：`feedback/records/pui-fb-0113-slider-api-contract-overexposure.json`
- 范围：`component` / `slider`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Slider 应参考成熟小程序组件的公开合同保持克制，基础 WXML 只表达基础选择任务，完整事件只进入 API。
- 实际问题：旧 18 Props、3 Events、1 Slot、4 Methods 把诊断、重复提交和展示组合暴露成了长期 API。
- 决策：对照 TDesign Mini Program 1.15.3 收敛为 16 Props、2 Events、0 Slots、0 Methods；删除 input、duration/easing、默认 Slot 和 setValue/reset/getValue/getState。
- 理由：微信原生 slider 已提供真实横向单值手势和表单能力；声明式 value/defaultValue 足以完成受控与非受控写入，单位和业务状态应由消费者相邻组合。

AI 必须遵守：

- 基础 Slider WXML 不展示 bind 事件，事件全集只进入 API Events。
- 不得恢复重复 input、实例方法、默认 Slot 或私有 duration/easing。
- H5 只能镜像微信已存在的横向单滑块能力，不得独自增加范围、纵向、刻度或胶囊主题。
- 数值归一化必须严格区分数字 0、Boolean、空字符串、null 与非有限数值。

验证与遗留风险：

- 验证：`node scripts/test-slider.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信原生 slider 的真机触摸采样、form 提交、blockSize/rpx、主题颜色、样式隔离、系统低动效和读屏仍需合法 AppID 复核。

## PUI-FB-0114 · Slider 官网缺少任务分区且 API 说明落入无信息兜底

- 原始记录：`feedback/records/pui-fb-0114-slider-preview-api-parity.json`
- 范围：`component` / `slider`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Slider 官网应像成熟组件文档一样分区展示真实用法，API 每个属性都要完整且有意义，不能用省略或泛化文案代替。
- 实际问题：旧官网偏向调试面板，静态与当前能力不可比较，API 多项说明只是字段名复述。
- 决策：官网重建为四个用户任务分区；每个示例使用唯一 ariaLabel 并运行真实 input/change 回写；补齐 16 个专属 API 说明和真实可选值；无属性时生成无多余空格的最小标签。
- 理由：组件文档的首要目标是帮助用户筛选可用能力并复制最小调用，工程事件诊断和静态提示不能替代真实多实例交互。

AI 必须遵守：

- Slider 概览固定为基础、边界与步长、颜色与表单、状态与受控四区。
- 每个并列交互实例必须有唯一可访问名称，浏览器 battle 不靠模糊选择器。
- API 表格完整可见只是底线，属性说明还必须给出真实行为、边界和平台含义。
- 代码生成器在没有属性时不得留下多余空格、bind 或实现诊断注释。

验证与遗留风险：

- 验证：`node scripts/test-slider.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run feedback:check`
- 真机/兼容风险：H5 原生 range 的鼠标、键盘和 px 只是微信原生 slider 的近似；真机触摸惯性、rpx 排版、系统字体和辅助技术仍需合法 AppID 复核。

## PUI-FB-0115 · Rate 公开合同重复且缺少真实拖动与可靠半星渲染

- 原始记录：`feedback/records/pui-fb-0115-rate-api-and-touch-contract.json`
- 范围：`component` / `rate`、`icon`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Rate 应对照成熟小程序组件保留真正需要的评分能力，支持点击与拖动、半星和受控回写，同时减少重复事件、私有动效与无职责 Slot。
- 实际问题：旧 14 Props、2 Events、1 Slot 扩大长期 API，却缺少真实拖动；半星和安全颜色声明与 PUI Icon 实际能力不一致。
- 决策：对照 TDesign MiniProgram 1.15.3 收敛为 13 Props、1 Event、0 Slots、0 Methods；新增 gap 和真实触摸拖动，删除 input/duration/easing/default Slot；半星改为双层 PUI Icon 裁切，颜色只接受 Canvas 可执行的十六进制与合法 rgb。
- 理由：声明式 value/defaultValue 与一个 change 足以完成评分写入；兄弟业务内容无需进入原子输入根，双层 Icon 能在透明、深色和效果背景上保持真实形状。

AI 必须遵守：

- Rate 不得恢复 input、默认 Slot、实例方法或私有 duration/easing。
- 半星必须裁切激活 Icon，禁止用固定背景色遮罩。
- 微信 Icon 着色只声明真实可执行的十六进制与合法 rgb，不宣传 CSS var/currentColor。
- TDesign 的 icon/iconPrefix/placement/variant 只有建立 PoemUI 资源、浮层和双图形真实合同后才可重新评估。

验证与遗留风险：

- 验证：`node scripts/test-rate.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 touchmove 采样、rpx 到 px 的 gap 换算、Canvas Icon 着色、样式隔离、读屏对 slider 与内部 button 的朗读和系统低动效仍需合法 AppID 真机复核。

## PUI-FB-0116 · Rate 官网单块诊断演示与透明组件语义不一致

- 原始记录：`feedback/records/pui-fb-0116-rate-preview-api-parity.json`
- 范围：`component` / `rate`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Rate 官网应像成熟组件文档一样按用法分区，属性与 API 全文可读、交互真实，并在深浅色和视觉开关下保持透明输入组件语义。
- 实际问题：旧官网偏向单例调试，缺少多用法筛选和拖动，且全局外观样式改变了 Rate 的原子输入边界。
- 决策：官网重建为基础用法、半星与文案、尺寸与间距、状态与受控四区；只有当前实例保留真实按钮和 Pointer 拖动，静态样例标为只读；API/WXML/兼容说明同步 13/1/0/0；从全局 Surface 外观选择器移除 Rate。
- 理由：用户需要快速比较真实用法并复制最小调用；透明输入根不能因为全局效果开关被误画成卡片，静态文档样例也不能保留无响应假按钮。

AI 必须遵守：

- Rate 概览固定为基础、半星文案、尺寸间距、状态受控四区。
- 只有绑定真实状态路径的实例可以保留交互按钮；静态样例必须无假交互并表达只读。
- 透明原子输入不得加入全局 Surface 阴影、毛玻璃或圆角选择器。
- 浏览器 battle 必须同时测页面与 PreviewDevice 横向边界、API 计算样式和三视图几何。

验证与遗留风险：

- 验证：`node scripts/test-rate.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run feedback:check`
- 真机/兼容风险：H5 Pointer 与 px 只近似微信触摸和 rpx；局域网旧式剪贴板回退的最终粘贴内容、真实移动浏览器字体回流和辅助技术仍需人工/真机确认。

## PUI-FB-0117 · Upload 公开合同混入整体状态、重复事件与调试方法

- 原始记录：`feedback/records/pui-fb-0117-upload-api-and-platform-contract.json`
- 范围：`component` / `upload`、`button`、`image`、`progress`、`tag`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Upload 应对照成熟小程序上传组件保留文件选择、列表和单文件状态主干，基础调用足够简单，选择成功不得冒充远端上传成功。
- 实际问题：旧合同过度暴露且基础调用噪声很大，整体状态和方法面板改变了组件职责，也让 H5 与原生长期同步成本失控。
- 决策：收敛为 files/defaultFiles/max/picker/mediaType/messageType/source/extensions/maxSize/addContent/addBtn/theme/columns/allowDuplicate/preview/removeBtn/customAdd/disabled/ariaLabel/reduceMotion；事件固定 change/add/remove/preview/retry/cancel/reject/error；只保留 add Slot，不公开实例方法。
- 理由：声明式文件列表、单一列表变化事件链和平台选择回调足以形成真实闭环；整体状态、远端请求与业务说明应由消费者在外部组合。

AI 必须遵守：

- Upload 不得恢复 input、choose-start/end、clear/exceed/file-load/file-error 或公开实例方法。
- 只有 Array files 受控；false/0/空字符串/null 不得被当作受控空列表，退控必须保留最后值。
- 选择成功只加入 ready 文件，禁止内置定时器或假请求自动改成 success。
- 整体 Loading/Empty/Error 必须在 Upload 外组合，文件 error 只提供真实 Retry 请求并等待父级回写。

验证与遗留风险：

- 验证：`node scripts/test-upload.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 wx.chooseMedia/wx.chooseMessageFile 的权限、取消、基础库返回结构、图片/视频/文档预览、rpx 网格、样式隔离和读屏仍需合法 AppID 真机复核。
- 真机/兼容风险：当前内置浏览器不提供文件注入接口，真实 input/accept/multiple/disabled 已检查，选择成功/拒绝/取消/失败回调由微信 VM 合同测试覆盖；不能把该限制冒充人工系统文件选择验收。

## PUI-FB-0118 · Upload 官网单块诊断预览与真实组件结构不一致

- 原始记录：`feedback/records/pui-fb-0118-upload-preview-and-api-parity.json`
- 范围：`component` / `upload`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Upload 官网应像成熟组件文档一样按用户用法分区，基础代码极简，Props/API 全文可读，交互与视觉必须对应真实 WXML/WXSS。
- 实际问题：旧官网偏向工程诊断且代码噪声很大；初次实现还存在受控边界、类型展示和子组件镜像偏差。
- 决策：官网重建四个用法区；基础实例使用真实透明 input 桥接并组合共享 PUI Button，静态样例移除假 input/操作；基础 WXML 零 bind；API 类型显式标注 Array/number；受控退控与 Props 视图共享同一状态源。
- 理由：用户需要快速筛选真实用法、复制最小调用并在 API 查完整事件；静态样例不能伪装可操作，H5 也不能画出原生没有的第二层 Surface。

AI 必须遵守：

- Upload 概览固定为基础、网格媒体、文件状态、限制禁用四区，分区标题保持清晰上间距。
- 基础 WXML 禁止 bind:*；完整 8 个事件只进入 API，事件专项示例只绑定所需事件。
- 静态 Upload 样例不得保留无回写 input、删除、Retry 或预览假控件。
- H5 添加入口必须调用共享 buttonSample，原生 file input 只做透明平台桥接并独占可访问操作语义。
- API 类型、说明和 detail 必须完整换行，禁止 object/string 误标或 ellipsis。

验证与遗留风险：

- 验证：`node scripts/test-upload.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run feedback:check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 File/Blob/input 只能近似微信选择器和平台预览；内置浏览器未提供 setInputFiles，因此系统文件选取仍需人工浏览器与合法 AppID 真机复核。
- 真机/兼容风险：H5 window.open 在当前内置浏览器被策略阻止时会真实显示 error，不会冒充预览成功；移动浏览器 Blob 打开、字体回流与辅助技术仍需设备确认。

## PUI-FB-0119 · Calendar 公开合同重复暴露事件、Slot、方法与动效配置

- 原始记录：`feedback/records/pui-fb-0119-calendar-api-and-state-contract.json`
- 范围：`component` / `calendar`、`button`、`loading`、`empty`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Calendar 应对照成熟小程序日历保留日期选择、面板、显隐与状态主干，基础调用简单，API 事件完整但不在基础示例堆满 bind。
- 实际问题：旧合同过度暴露且职责重复，受控与非受控连续性、状态文案和自动关闭边界难以从 API 判断。
- 决策：收敛为 26 Props；事件固定 change/limit/panel-change/visible-change/confirm/cancel/retry；localeText 统一文案与操作显隐；固定 180ms/1ms；不公开 Slot 和实例方法。
- 理由：声明式值与显隐、单一事件职责和内部 PUI 状态组合足以形成闭环；重复生命周期事件、任意 Slot 和实例写方法会让调用和跨端镜像失控。

AI 必须遵守：

- Calendar 不得恢复 select/input/month-change/year-change/input-visible/open/close/today 等重复事件。
- localeText 是 today/confirm/cancel/loading/error/retry/empty 的唯一文案与操作显隐入口。
- defaultValue/defaultVisible 只初始化一次，受控转非受控必须保留最后渲染状态。
- limit 与 retry 只发真实请求，不截断选择、不清除错误、不伪造成功。

验证与遗留风险：

- 验证：`node scripts/test-calendar.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信触摸命中、fixed 遮罩、rpx 七列网格、样式隔离、系统低动效、ARIA 与读屏顺序仍需合法 AppID 真机复核。
- 真机/兼容风险：微信开发者工具当前使用 touristappid，CLI build-npm 只能保留 pending-cli，不能冒充安装产物已在工具内成功生成。

## PUI-FB-0120 · Calendar 官网单块诊断预览、局部遮罩与无效高度动画

- 原始记录：`feedback/records/pui-fb-0120-calendar-preview-and-popup-parity.json`
- 范围：`component` / `calendar`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Calendar 官网应像成熟组件文档一样按用户用法分区，Props 真实作用，API 全文可读，弹层遮罩必须覆盖完整手机视口。
- 实际问题：旧官网偏向工程诊断，遮罩与动效偏离真实 WXML/WXSS，组件标题、子 Button 和 API 可读性不符合全局合同。
- 决策：官网重建四个用法区；静态样例只读；当前实例承担真实回写；Popup 动态切换 edge-to-edge 并覆盖完整 viewport；状态改为固定 180ms opacity/visibility/transform；API 全文换行。
- 理由：用户需要快速筛选真实用法、复制最小代码并在 API 查完整事件；H5 必须与原生固定网格和完整遮罩能力一致。

AI 必须遵守：

- Calendar 概览固定为基础、范围多选、日期限制、状态反馈四区，分区标题保留清晰上间距。
- 基础 WXML 禁止 bind:*；完整 7 个事件只进入 API，事件专项示例只绑定所需事件。
- usePopup 必须动态使用 edge-to-edge，遮罩尺寸必须等于 PreviewDevice viewport。
- Calendar 状态动画禁止 max-height、height:auto 和 display:none，固定使用 500ms opacity/visibility/transform。
- Header 不得穿透覆盖共享 PUI Button 尺寸，标题和 API 文字不得 ellipsis。

验证与遗留风险：

- 验证：`node scripts/test-calendar.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run feedback:check`
- 验证：`npm run pack:check`
- 真机/兼容风险：浏览器 Pointer/click 与 CSS fixed 只能近似微信 touch、rpx 和安全区；低端设备中间帧、系统低动效与辅助技术仍需真机复核。
- 真机/兼容风险：浏览器遮罩经坐标真实点击验证；微信 scroll-view/fixed 层级和阻止背景滚动仍需开发者工具与真机确认。

## PUI-FB-0121 · Navbar 公开合同混入自动路由、重复左右操作与显隐诊断能力

- 原始记录：`feedback/records/pui-fb-0121-navbar-api-and-navigation-contract.json`
- 范围：`component` / `navbar`、`button`、`loading`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Navbar 应参考成熟小程序导航栏保留标题、返回、固定、安全区与 Slot 主干，基础调用克制，页面继续掌握真实导航和业务结果。
- 实际问题：旧公开面把页面导航、业务操作、组件布局和工程诊断混在一起，调用复杂且 H5 无法真实镜像自动微信路由。
- 决策：收敛为 14 Props；唯一事件为 left-click { source:'left' }；固定 left/title/right Slots；声明式 visible；固定 180ms/1ms；0 公开方法；不自动导航。
- 理由：页面必须掌握真实路由与业务结果；三 Slot 足以表达复杂标题和左右内容，Navbar 只需要提供稳定三列、安全区、固定占位和返回意图。

AI 必须遵守：

- Navbar 不得自动调用 wx.navigateBack，也不得恢复 delta 或自动路由成功反馈。
- 右侧业务操作必须使用 right Slot 内真实 PUI Button，Navbar 不发布 right-click。
- visible 是唯一显隐真相源，不恢复 defaultVisible、show/hide 或 input/change/open/close。
- 标题自定义使用 title Slot 并省略 title，不恢复 customTitle 开关。

验证与遗留风险：

- 验证：`node scripts/test-navbar.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 fixed、安全区、rpx 三列几何、Slot 触摸冒泡、样式隔离、系统低动效、ARIA 和读屏仍需合法 AppID 真机复核。
- 真机/兼容风险：微信 CLI 使用 touristappid，内部 code 10 阻止 build-npm；现有 miniprogram_npm 无 Navbar，状态保留 pending-cli。

## PUI-FB-0122 · Navbar 官网缺少用法分区且属性回写残留陈旧显隐反馈

- 原始记录：`feedback/records/pui-fb-0122-navbar-preview-and-api-parity.json`
- 范围：`component` / `navbar`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Navbar 官网应按基础、组合、状态和透明导航分区陈列，Props 必须真实作用，API 全文可读，显隐和 Slot 反馈不能显示陈旧或伪造结果。
- 实际问题：旧官网偏向工程诊断，静态操作为假禁用，陈旧反馈与属性真值不一致，API 文档和基础代码无法作为真实调用参考。
- 决策：官网重建基础用法、标题与操作、加载与禁用、透明导航四区；静态 Slot 与返回可真实操作；属性回写 visible 清理陈旧反馈；fixed 只限 PreviewDevice；API 全文自然换行。
- 理由：用户需要快速比较真实用法、复制最小 WXML 并在 API 查看完整事件；提示必须反映当前真实 Prop，而不是历史操作。

AI 必须遵守：

- Navbar 概览固定为基础、标题与操作、加载与禁用、透明导航四区，分区标题保留清晰上间距。
- 基础 WXML 禁止 bind:*；完整 left-click 只进入 API，业务示例只绑定必要事件。
- 属性面板直接改变 visible 时必须清除历史 toggle 反馈，当前真值优先。
- H5 fixed 必须限制在 PreviewDevice；Navbar 全宽屏幕附着 Surface 在大圆角下仍保持 0 圆角。
- API 参数、事件和 Slot 文字必须自然换行，禁止 ellipsis、nowrap 和固定高度裁切。

验证与遗留风险：

- 验证：`node scripts/test-navbar.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run feedback:check`
- 验证：`npm run pack:check`
- 真机/兼容风险：浏览器 click、CSS sticky/absolute 和 20px 安全区只能近似微信 tap、fixed、rpx 与 env；低端设备中间帧和系统低动效仍需真机复核。
- 真机/兼容风险：微信 Slot 触摸冒泡、fixed 与页面滚动、样式隔离和读屏顺序需合法 AppID 开发者工具与真机确认。

## PUI-FB-0123 · Tabs 公开合同混入状态容器、动画调参和重复选择事件

- 原始记录：`feedback/records/pui-fb-0123-tabs-api-and-selection-contract.json`
- 范围：`component` / `tabs`、`button`、`badge`、`icon`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Tabs 应参考成熟小程序选项卡保留选择、样式、吸顶与滑动主干，基础调用克制，严格区分原始值，并把业务内容状态留给面板消费者。
- 实际问题：旧公开面把选择导航、内容业务状态、布局调试和动画调参混在一起，值身份、事件顺序和父级所有权不够可靠。
- 决策：收敛为 items/value/defaultValue/variant/showBottomLine/spaceEvenly/split/sticky/stickyOffset/swipeable/ariaLabel/reduceMotion；只保留 click/change；default Slot；0 Methods。
- 理由：选择导航只需要稳定的数据、所有权、视觉排列、吸顶和手势；内容的 loading/empty/error/retry 应由 Slot 内真实业务组件处理。

AI 必须遵守：

- Tabs 不得恢复根级 loading/error/empty/retry；业务状态在 default Slot 内组合 PUI Loading/Empty/Button。
- value 比较不得 String 化，必须区分 0、"0"、false 和空字符串。
- 同项点击只发 click，真实变化固定 click 后 change；swipe 只发 change 且 source=swipe。
- 不得恢复 input、select/next/prev/scrollToActive 或公开动画与 swipe 阈值调参。

验证与遗留风险：

- 验证：`node scripts/test-tabs.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 touchmove 采样、scroll-view 惯性、sticky/rpx 偏移、SelectorQuery 指示器、连续快点、样式隔离、系统低动效和读屏仍需合法 AppID 真机复核。
- 真机/兼容风险：微信 CLI 使用 touristappid，内部 code 10 阻止 build-npm；现有 miniprogram_npm 无 Tabs，状态保留 pending-cli。

## PUI-FB-0124 · Tabs 官网用法代码丢失必要数据绑定且安装专项曾静默跳过

- 原始记录：`feedback/records/pui-fb-0124-tabs-preview-usage-and-install-parity.json`
- 范围：`component` / `tabs`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Tabs 官网应按真实用法分区、代码可直接使用、Props 与预览同源、API 全文可读，并真实校验源码、dist 和示例 npm 安装产物。
- 实际问题：旧官网偏工程诊断，首次生成代码不可直接运行，API 陈旧；安装测试路径错误且静默跳过，可能制造假通过。
- 决策：官网重建基础用法、样式、徽标与禁用、受控边界与滑动四区；Tabs 用法单独比较 componentPropDefaults.tabs；安装路径改为 _example/node_modules/.../miniprogram_dist 并强制存在。
- 理由：用户需要复制即可运行的最小代码、快速比较真实用法和可靠的安装产物证据；缺失产物不能被当作通过。

AI 必须遵守：

- Tabs 用法代码必须以 componentPropDefaults.tabs 判断默认值，items/defaultValue 等必需非默认数据不得丢失。
- 基础 WXML 禁止 bind:*；完整 click/change 只进入 API，事件专项示例只绑定当前能力所需事件。
- Tabs 概览固定四个用户用法分区，分区标题保留 18px 上间距。
- 示例安装校验必须指向 _example/node_modules/poemui-miniprogram/miniprogram_dist，文件缺失直接失败。
- 微信 CLI 失败时保留 pending-cli，不得手工复制产物冒充 build-npm 成功。

验证与遗留风险：

- 验证：`node scripts/test-tabs.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run feedback:check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 build-npm 因 touristappid 不存在报内部 code 10，现有 miniprogram_npm 无 Tabs；必须在合法 AppID 下重新生成并核对。
- 真机/兼容风险：微信 rpx 回流、sticky 与 scroll-view、触摸/取消时序、SelectorQuery 测量、读屏和系统低动效仍需真机确认。

## PUI-FB-0125 · Tabbar 公开合同混入业务状态、自动动作和宽泛事件面

- 原始记录：`feedback/records/pui-fb-0125-tabbar-api-and-selection-contract.json`
- 范围：`component` / `tabbar`、`button`、`badge`、`icon`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Tabbar 应参考成熟小程序底部导航保留目的地选择、固定占位、安全区和视觉主干，基础调用克制，严格保留原始值，并把页面业务状态与路由交给消费者。
- 实际问题：旧公共面把一级导航、业务状态、动作入口、布局调参和路由职责混在一起，原始值身份、事件顺序和父级所有权不可靠。
- 决策：收敛为 items/value/defaultValue/theme/shape/bordered/split/fixed/placeholder/safeAreaInsetBottom/zIndex/disabled/ariaLabel/reduceMotion；只保留 click/change；0 Slots；0 Methods。
- 理由：应用一级导航只需要稳定目的地数据、值所有权、布局和平台安全区；页面请求状态、路由守卫与业务动作都应由消费页面真实闭环。

AI 必须遵守：

- Tabbar 不得恢复根级 loading/error/empty/retry、action Slot、自动路由或二级导航。
- value 比较必须严格区分 0、"0"、false 与空字符串；全部禁用时不得伪造活动项。
- 可用项点击固定 click 后 change，同项只发 click；disabled 不发布事件，受控模式等待父级回写。
- 不得恢复 input、select/selectIndex 或公开颜色、高度、横滚与动画调参。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 fixed/placeholder 页面占位、env 安全区、rpx、触摸反馈、样式隔离、系统低动效和读屏需合法 AppID 真机复核。
- 真机/兼容风险：微信 build-npm 仍受项目 touristappid 阻断时必须保留 pending-cli，不得手工生成产物冒充成功。

## PUI-FB-0126 · Tabbar 用法代码缺少源码默认值导致官网运行时崩溃

- 原始记录：`feedback/records/pui-fb-0126-tabbar-preview-default-source-runtime.json`
- 范围：`component` / `tabbar`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Tabbar 官网应按真实用法分区、代码可直接复制、Props 与运行态同源，不能因缺少生成器默认值让页面失去预览。
- 实际问题：缺少 componentPropDefaults.tabbar 让代码生成路径解引用 undefined，并暴露出只在旧会话热状态下看似可用的假稳定。
- 决策：补齐 componentPropDefaults.tabbar，并让 makeUsageCode、属性 WXML、左侧代码块和顶部复制共同读取它；四区预览与受控回写继续使用同一 Props 状态。
- 理由：演示初值与组件源码默认值职责不同；只有独立源码默认值才能正确过滤默认 Props，同时保证必要 items/value 不被丢失。

AI 必须遵守：

- Tabbar 用法代码必须以 componentPropDefaults.tabbar 判断默认值，不能用 metadata 演示初值替代。
- 组件引用、基础 WXML、属性 WXML 和顶部复制必须共同调用 makeUsageCode。
- 基础 WXML 禁止 bind:*；完整事件只进入 API Events。
- 新增代码生成分支后必须新开浏览器页确认控制台日志为空，不能只复用热会话。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：剪贴板权限在局域网非安全上下文会走 execCommand 回退；微信安装端不执行官网代码生成器。

## PUI-FB-0127 · Tabbar H5 分隔线与毛玻璃阴影开关没有真实生效

- 原始记录：`feedback/records/pui-fb-0127-tabbar-visual-switch-parity.json`
- 范围：`component` / `tabbar`、`preview-site`、`config-provider`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Tabbar H5 必须对应真实 WXSS 能力，split、边框、阴影、毛玻璃、大圆角和深浅色都要通过计算样式真实生效，不能只切根 data 属性。
- 实际问题：H5 分隔线和毛玻璃属于视觉假开关：属性值与根 data 已更新，但代表 Tabbar 的计算样式没有变化。
- 决策：原生与 H5 item 都常驻透明左边界，split 只改变相邻项边界颜色；H5 根改用 surface-strong、shadow-soft 和 blur，round 继续消费语义圆角。
- 理由：分隔是边界语义，不属于阴影效果；外观开关必须落到组件真实 Surface，透明占位还能保证开关前后尺寸不变。

AI 必须遵守：

- Tabbar split 必须用常驻透明边界切颜色，禁止用 box-shadow 模拟。
- 验收 shadow/frost/radius/border 时必须读取 Tabbar 本体计算样式，不能只看 App Shell data 属性。
- H5 Tabbar 必须消费 surface-strong、shadow-soft 和 blur，原生继续消费同义 PUI glass Token。
- 视觉开关前后必须验证 PreviewDevice 与 document 宽度不变。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信真机 backdrop-filter 支持、env 安全区、rpx 边界、样式隔离和低端设备合成性能需合法 AppID 复核。

## PUI-FB-0128 · Steps 公开合同混入业务状态、重复事件与命令式流程控制

- 原始记录：`feedback/records/pui-fb-0128-steps-api-and-value-contract.json`
- 范围：`component` / `steps`、`button`、`icon`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Steps 应参考成熟小程序步骤条，只表达阶段、当前值和选择请求；基础调用克制，严格保留原始值，页面业务状态与前后动作由消费者组合。
- 实际问题：旧公共面把阶段指示、页面请求状态、流程动作、视觉调参和命令式控制混在一起，原始值身份与父级所有权不可靠。
- 决策：收敛为 items/current/defaultCurrent/currentStatus/layout/sequence/theme/scrollable/readonly/disabled/ariaLabel/reduceMotion；只保留 change；0 Slots；0 Methods。
- 理由：步骤条需要稳定的数据、阶段状态、布局和值所有权；页面加载、失败、重试、提交和前后动作都应由消费页面用现有 PUI 组件真实闭环。

AI 必须遵守：

- Steps 不得恢复根级 loading/error/empty/retry、footer Slot、next/prev/select 或页面提交动作。
- current 比较必须严格区分 0、"0"、false 与空字符串；受控未命中和全部禁用时不得伪造当前项。
- 只在不同可用步骤被选择时发布一次 change；disabled、readonly 和重复当前项静默，受控模式等待父级回写。
- 不得恢复 click/input、标题截断、单项 loading 或公开 duration/easing。

验证与遗留风险：

- 验证：`node scripts/test-steps.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 Button 触摸、scroll-view 惯性、rpx 连接线、样式隔离、系统低动效和读屏需合法 AppID 真机复核。
- 真机/兼容风险：微信 build-npm 若继续被项目 touristappid 阻断必须保留 pending-cli，不得手工生成产物冒充成功。

## PUI-FB-0129 · Steps H5 演示以诊断状态壳代替真实分区用法

- 原始记录：`feedback/records/pui-fb-0129-steps-preview-usage-parity.json`
- 范围：`component` / `steps`、`preview-site`、`button`、`icon`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Steps 官网应像成熟组件文档一样按真实用法分区，基础示例保持最小 WXML，并让所有 Props、复制、深浅色和视觉开关作用于真实组件镜像。
- 实际问题：旧演示优先展示工程诊断和伪状态，用户难以筛选常用用法，H5、WXML、API 与真实组件职责不一致。
- 决策：删除 H5 业务状态壳、footer、retry 与诊断反馈；用四个真实 Steps 实例分区陈列，并让属性、WXML、工具栏和两段代码块共用同一默认值与代码生成真相源。
- 理由：组件概览应帮助用户快速筛选可用形态，工程详情进入 API/属性；共享 helper 和同源生成器能保证 H5 与原生调用合同一致。

AI 必须遵守：

- Steps 官网必须保留基础用法、方向与顺序、主题与状态、边界值与禁用四区。
- 基础 WXML 不展示 bind；事件只进入 API Events 与真正需要事件的专项示例。
- H5 Steps 每项必须调用共享 Button/Icon helper，受控示例必须真实更新 current Prop。
- API 和属性文字必须完整自然换行，禁止 ellipsis、nowrap、line-clamp 或固定高度裁切。

验证与遗留风险：

- 验证：`node scripts/test-steps.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信 scroll-view、Button 触摸、ARIA、系统字体换行、1rpx 连接线、样式隔离和系统低动效需合法 AppID 真机复核。

## PUI-FB-0130 · Indexes 公开合同混入重复值、页面框架和命令式定位能力

- 原始记录：`feedback/records/pui-fb-0130-indexes-api-and-index-value-contract.json`
- 范围：`component` / `indexes`、`cell`、`badge`、`button`、`loading`、`empty`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Indexes 应参考成熟小程序索引组件，只承担长分组内容、侧栏定位、滚动联动和条目请求；基础调用克制，分组 index 保留严格原始值，页面搜索和框架由消费者组合。
- 实际问题：旧公共面把索引集合、页面框架、重复事件、命令式控制和私有动效揉在一起，原始 index 身份、受控所有权与事件顺序都不稳定。
- 决策：收敛为 items/current/defaultCurrent/indexList/showFullIndex/height/sticky/stickyOffset/indexPosition/clickable/readonly/disabled/loading/loadingText/error/errorText/retryText/emptyText/ariaLabel/reduceMotion；只保留 select/change/item-click/retry；0 Slots；0 Methods。
- 理由：索引集合需要稳定的分组数据、当前活动值、侧栏定位、内容状态和值所有权；页面 Header、搜索、统计、Footer 和命令式流程应由消费者组合。

AI 必须遵守：

- Indexes 不得恢复 value/defaultValue 别名、Header/Footer Slot、scrollTo/reset/measureGroups 或页面搜索统计。
- current/defaultCurrent/indexList 必须严格区分数字 0 与字符串 0；Boolean、对象、空字符串和空白字符串不得成为分组 index。
- 侧栏操作固定 select→change，重复当前只发 select，手动滚动只发 change，条目只发 item-click。
- error 优先 loading，retry 只通知父级；不得伪造加载成功或注入假分组。

验证与遗留风险：

- 验证：`node scripts/test-indexes.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 scroll-view 惯性、scroll-into-view、SelectorQuery、touchmove 连续命中、sticky、rpx 排版、样式隔离、系统低动效和读屏需合法 AppID 真机复核。
- 真机/兼容风险：微信 build-npm 已被项目 touristappid 不存在以内部 code 10 阻断，必须保留 pending-cli，不得手工生成产物冒充成功。

## PUI-FB-0131 · Indexes H5 分区、拖动运行时与复制代码未保持同源

- 原始记录：`feedback/records/pui-fb-0131-indexes-preview-usage-parity.json`
- 范围：`component` / `indexes`、`preview-site`、`cell`、`badge`、`button`、`loading`、`empty`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Indexes 官网应像成熟组件文档一样按真实用法分区，让侧栏点击、连续拖动、滚动、状态、Props、复制、深浅色和视觉开关都作用于同一个真实组件镜像。
- 实际问题：旧演示混入页面框架与工程诊断，且运行时选择器、监听器生命周期和复制默认源彼此分裂，画面变化不能证明原生合同真实成立。
- 决策：删除 Header/Footer/方法诊断壳，改为基础用法、索引显示、条目与状态、受控与边界四区；运行时使用独立可中止监听器；复制始终输出 items/current 或 default-current/aria-label 与非默认 Props。
- 理由：概览应帮助用户筛选真实可用形态；同源状态助手、事件路径和代码生成器能证明 H5 与原生调用合同一致。

AI 必须遵守：

- Indexes 官网必须保留基础用法、索引显示、条目与状态、受控与边界四区。
- H5 侧栏必须使用可中止的 Pointer 监听器，旧鼠标回退只在无 PointerEvent 时注册。
- 受控实例必须真实更新 current Prop；滚动中间帧不得发布伪 change。
- API 和属性文字必须完整自然换行，禁止 ellipsis、nowrap、line-clamp 或固定高度裁切。

验证与遗留风险：

- 验证：`node scripts/test-indexes.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信 scroll-view 惯性、scroll-into-view、SelectorQuery、touchmove 连续命中、sticky、rpx、样式隔离、系统低动效和读屏需合法 AppID 真机复核。

## PUI-FB-0132 · Sidebar 公开合同混入页面框架、重复事件与宽松值身份

- 原始记录：`feedback/records/pui-fb-0132-sidebar-api-and-value-contract.json`
- 范围：`component` / `sidebar`、`button`、`badge`、`icon`、`loading`、`empty`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Sidebar 应参考成熟小程序 SideBar，只承担同层垂直导航、严格选值、分组与集合状态；基础调用克制，页面 Header、Footer 和业务内容由消费者在外部组合。
- 实际问题：旧公共面把页面框架、重复事件、命令式控制、私有动效和宽松值转换混在同一个组件，调用者难以确定唯一父级回写路径。
- 决策：收敛为items/value/defaultValue/theme/bordered/width/height/showGroupTitle/sticky/stickyOffset/showIcon/showDescription/showBadge/clickable/readonly/disabled/loading/loadingText/error/errorText/retryText/emptyText/ariaLabel/reduceMotion；只保留change/retry；0 Slots；0 Methods。
- 理由：同层侧边导航需要稳定数据、当前值、局部滚动、集合状态与父级所有权；页面品牌、标题、辅助操作、右侧内容和命令式流程应由消费者组合。

AI 必须遵守：

- Sidebar不得恢复customHeader/customFooter、click/select/input/scroll、五个实例方法或公开duration/easing。
- value/defaultValue与item.value只接受String/Number，必须严格区分数字0、字符串0与空字符串。
- 受控选择只发change并等待父级回写；重复当前项和所有阻断态静默。
- error优先loading，retry只通知父级；不得伪造加载成功或注入假条目。

验证与遗留风险：

- 验证：`node scripts/test-sidebar.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信scroll-view惯性、scroll-into-view、sticky、rpx排版、Button触摸、样式隔离、系统低动效和读屏需合法AppID真机复核。

## PUI-FB-0133 · Sidebar H5 用法分区、API说明与复制代码未保持同源

- 原始记录：`feedback/records/pui-fb-0133-sidebar-preview-usage-parity.json`
- 范围：`component` / `sidebar`、`preview-site`、`button`、`badge`、`icon`、`loading`、`empty`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-19
- 用户目标：Sidebar 官网应按成熟组件文档分区展示基础、分组徽标、主题状态和受控边界，所有Props、事件、复制、主题与视觉开关都作用于真实组件镜像。
- 实际问题：旧演示混入页面框架与工程诊断，API旧文案又与已收敛实现冲突，画面变化和复制结果不能证明原生合同成立。
- 决策：删除页面Header/Footer和事件方法诊断壳，改为基础用法、分组与徽标、主题与状态、受控与边界四区；基础代码只输出items/value/aria-label；API说明只表达最终24/2/0/0合同。
- 理由：概览应帮助用户快速筛选真实可用形态；同源Props、状态助手和代码生成器能证明H5与原生调用合同一致。

AI 必须遵守：

- Sidebar官网必须保留基础用法、分组与徽标、主题与状态、受控与边界四区。
- H5受控实例必须真实更新value Prop，不能只改提示文字。
- 基础WXML不得显示bind；完整change/retry只进入API Events或专项事件示例。
- API与属性文字必须完整自然换行，禁止ellipsis、nowrap、line-clamp或固定高度裁切。

验证与遗留风险：

- 验证：`node scripts/test-sidebar.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信scroll-view惯性、scroll-into-view、sticky、rpx、Button触摸、backdrop-filter、样式隔离、系统低动效和读屏需合法AppID真机复核。

## PUI-FB-0134 · TDesign 对照缺少每项在线来源与固定源码版本双重证据

- 原始记录：`feedback/records/pui-fb-0134-tdesign-online-reference-protocol.json`
- 范围：`global` / `preview-site`、`documentation`、`build-tooling`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：PoemUI 不能在不联网、不核对成熟组件最新资料的前提下闭门设计；之后所有 agent 都必须以在线资料和可复现源码共同约束 TDesign 对照。
- 实际问题：既有清单固定了 npm 版本与源码路径，但没有把每个组件的在线查询作为不可跳过的结构化证据，容易被误解为仅按本地快照设计。
- 决策：所有后续TDesign battle强制双来源：先在线核对官方页面与仓库/NPM，再固定到安装包版本和具体源码文件；在线页面用于产品信息，包内源码用于可复现API，差异必须写入组件合同、Ledger和对照摘要。
- 理由：同时保留新鲜产品语义与可重复的源码证据，避免闭门设计，也避免在线文档漂移破坏可验证性。

AI 必须遵守：

- 开始每个共有组件battle前，访问TDesign官方组件页面和官方仓库或NPM页，并记录URL与查询日期。
- 同时固定npm版本，读取props、类型、WXML和实现；在线页面与包版本不一致时必须写明差异。
- 在线页面用于产品信息，安装包源码用于可复现API；不得只凭任一侧或模型记忆设计。
- 在线来源、固定版本和源码路径必须进入组件合同、Ledger和对照摘要。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：该记录只约束研究与证据流程，不替代任何微信真机、网络权限、域名白名单或真实业务接口验收。

## PUI-FB-0135 · BackTop 公开合同暴露了无真实用户任务的滚动引擎与平台回调

- 原始记录：`feedback/records/pui-fb-0135-back-top-public-contract.json`
- 范围：`component` / `back-top`、`button`、`documentation`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：BackTop 应按 TDesign 的真实导航任务收敛，而不是把容器滚动、平台回调、加载状态和实例方法堆成难以正确使用的公开 API。
- 实际问题：旧合同把 BackTop 伪装成带目标容器、运行状态、平台回调和命令式写入的滚动引擎，导致 API、示例和 H5 都可能承诺不存在的能力。
- 决策：收敛为 fixed、icon、scrollTop、text、theme、visibilityHeight、ariaLabel、reduceMotion；只保留 to-top、icon/default Slot，删除旧目标、状态、回调和 Methods。
- 理由：回顶入口的唯一用户意图是依据页面位置提出回顶请求；外部所有权与固定事件顺序使小程序、H5、示例和文档都可真实闭环。

AI 必须遵守：

- BackTop 公开 Props 只能是 fixed、icon、scrollTop、text、theme、visibilityHeight、ariaLabel、reduceMotion。
- 可见点击固定先发布 to-top，再调用 wx.pageScrollTo；组件不得自行把外部 scrollTop 写为 0。
- loading、error、retry、容器目标、平台 success/error/complete 和实例方法不得回流 BackTop。
- 基础 WXML 零 bind；事件只在 API 或事件专项示例出现。

验证与遗留风险：

- 验证：`node scripts/test-back-top.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：需使用合法 AppID 在真实长页确认 to-top 到 wx.pageScrollTo 再到 onPageScroll 的完整顺序。
- 真机/兼容风险：fixed 安全区、rpx、Button 点击区域、样式隔离、系统低动效和读屏仍需微信真机确认。

## PUI-FB-0136 · BackTop H5 概览归一化后丢失真实滚动运行时绑定

- 原始记录：`feedback/records/pui-fb-0136-back-top-preview-runtime-parity.json`
- 范围：`component` / `back-top`、`preview-site`、`button`、`cell`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：BackTop 官网不能用静态提示冒充回顶；Props、局部真实滚动、显隐、代码和 API 必须与小程序调用合同同源。
- 实际问题：component-only 清理与运行时查询形成隐藏耦合，真实绑定被提前中止，概览有把静态状态当成交互成功的风险。
- 决策：删除对 data-back-top-event 的依赖；以 current sample 的 data-back-top-scroll 与真实 PUI Button 为运行时锚点，统一由 scrollTop 和 current visibility 驱动。
- 理由：滚动容器和可见入口是用户可见、可交互的真实节点，不应依赖已归一化删除的工程诊断 DOM。

AI 必须遵守：

- BackTop 运行时只查询当前 PreviewDevice 内的真实 scroll 根和 BackTop 交互根。
- 点击必须调用局部容器真实 scrollTo，不能只更新提示文本或滚动官网文档页。
- component-only 删除事件诊断节点后，要同步审计所有运行时选择器。
- 自动化工具不桥接原生事件时，记录限制并保留真机风险，不能伪造回写证据。

验证与遗留风险：

- 验证：`node scripts/test-back-top.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：内置浏览器工具不转发 programmatic scroll 的原生回调；需普通浏览器和微信真机复核 scroll 事件回写。
- 真机/兼容风险：微信 onPageScroll、fixed 安全区、rpx、触摸反馈、样式隔离、低动效和读屏仍需合法 AppID 真机确认。

## PUI-FB-0137 · BackTop 深色主题被 H5 通用 Button 规则覆盖且源端 Token 未定义

- 原始记录：`feedback/records/pui-fb-0137-back-top-theme-preview-precedence.json`
- 范围：`component` / `back-top`、`button`、`preview-site`、`theme`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：BackTop 的四种主题必须在真实小程序源码和 H5 中一致呈现，不能让深色选项被通用样式覆盖为浅色。
- 实际问题：H5 深色 theme 被共享 Button 规则覆盖成浅色；源端的颜色变量也不存在，造成跨端主题无法从 Token 合同保证。
- 决策：新增 --pui-bg-inverse/#242424 与 --pui-text-on-inverse/#ffffff 的跨端语义 Token，BackTop 使用它们；H5 在共享 Button 规则之后以明确 preview-stage 作用域重申 normal、dark 与 disabled 三种外观。
- 理由：深色 BackTop 是组件公开 enum 的真实能力，应从同名 Token 和可测层叠顺序获得确定结果，而非依赖通用 Button 当前的默认 Surface。

AI 必须遵守：

- 不得在组件 WXSS 引用未在主题文件声明的变量；跨端主题色优先新增同名语义 Token。
- 共享 H5 子组件的通用规则可能晚于组件专属规则；必须用最终计算样式而不是 class 名确认 theme 生效。
- theme 选择器需要覆盖 normal、dark 与 disabled 的真实优先级，不能靠切换 data 属性或提示文字声称成功。
- 浏览器自动化缺失原生 scroll 回调时，记录事实并保留真机风险，不得假设父级回写已完成。

验证与遗留风险：

- 验证：`node scripts/test-back-top.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：需用合法 AppID 在微信真机确认 --pui-bg-inverse Token、WXSS 样式隔离、fixed 安全区、Button 触摸和系统低动效。
- 真机/兼容风险：内置浏览器的程序化 scroll 回调桥接限制仍需普通浏览器和微信真机复核 onPageScroll 回写。

## PUI-FB-0138 · Sticky 将页面滚动、视觉状态和诊断方法错误暴露为公开合同

- 原始记录：`feedback/records/pui-fb-0138-sticky-public-contract-scope.json`
- 范围：`component` / `sticky`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：Sticky 要按真实滚动定位任务收敛 API，并让源码、H5、示例与文档只承诺可验证能力。
- 实际问题：旧公开合同把定位组件误做为可配置滚动和状态引擎，API、WXML、示例和 H5 容易承诺不存在或无消费者所有权的能力。
- 决策：收敛为四个 Props、唯一 scroll、默认 Slot、零公开方法；删除旧滚动目标、内容/视觉/状态/动效参数、重复事件和命令式测量方法。
- 理由：组件只保留能够在小程序端与 H5 中真实验证的定位职责，消费者继续拥有页面滚动、内容和业务反馈。

AI 必须遵守：

- Sticky 公开范围只能是 container、disabled、offsetTop、zIndex、scroll 与 default Slot。
- container 只接受返回 NodesRef 的函数；字符串选择器和静态 WXML 字面量不得被宣称为原生能力。
- 页面滚动、标题/背景、loading/error/retry、动效和实例方法不得回流 Sticky。
- 基础 WXML 只展示最小默认 Slot 调用，完整事件只进入 API 或专项示例。

验证与遗留风险：

- 验证：`node scripts/test-sticky.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 page onPageScroll、SelectorQuery、fixed、rpx、样式隔离、触摸和读屏需合法 AppID 真机确认。

## PUI-FB-0139 · Sticky H5 旧预览以诊断状态模拟吸顶且用法代码与容器函数脱节

- 原始记录：`feedback/records/pui-fb-0139-sticky-preview-runtime-parity.json`
- 范围：`component` / `sticky`、`preview-site`、`cell`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：官网 Sticky 要按真实用法分区，Props 必须实际改变局部滚动结果，WXML、API 和兼容说明不得误导用户。
- 实际问题：旧预览与调用代码被扩展合同污染，无法作为真实 WXML/WXSS 的可靠教学和验收载体。
- 决策：删除旧诊断和方法交互，改为真实可滚动局部示例；基础代码只输出非默认公开 Props，container 非空时输出 page.js 函数绑定标识。
- 理由：用户看到并操作的结构必须与真实默认 Slot、页面滚动和容器边界对应，不能用提示文字代替布局效果。

AI 必须遵守：

- H5 Sticky 每个示例必须有真实局部滚动根和 CSS sticky 结果，不能只更新提示。
- 基础用法不得出现 bind、方法按钮或工程诊断；scroll 只进入 API 或专项事件示例。
- container 输入只能映射当前 H5 边界示例；输出代码必须提示 page.js 提供 NodesRef 函数。
- Props、API、兼容说明、复制和属性重置必须读取同一四 Prop 真相源。

验证与遗留风险：

- 验证：`node scripts/test-sticky.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信 page scroll、SelectorQuery、rpx、样式隔离、触摸和系统读屏需合法 AppID 真机确认。

## PUI-FB-0140 · Sticky H5 属性面板把有效的 zIndex=0 错误夹紧为 1

- 原始记录：`feedback/records/pui-fb-0140-sticky-z-index-zero-preview-boundary.json`
- 范围：`component` / `sticky`、`preview-site`、`usage-code`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：受控 Props 面板必须真实覆盖 0、false、空字符串等边界值，不能把源码认可的值在 H5 层改写。
- 实际问题：H5 把 0 误判为缺失值并夹紧为 1，与真实小程序组件合同不一致。
- 决策：Sticky 的范围下界改为 0；预览和用法代码使用 Number.isFinite 区分非法值与 0，并将 0 原样输出。
- 理由：H5 是真实组件调用的教学与验收界面，不能收窄源码公开的数值域。

AI 必须遵守：

- 数值 Props 的 0、false 和空字符串必须分别判定，禁止用 || 作为默认值判断。
- H5 控件、预览和 WXML 生成器必须共享同一个公开数值域。

验证与遗留风险：

- 验证：`node scripts/test-sticky.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：微信 z-index 层叠与 fixed 定位需在合法 AppID 真机确认。

## PUI-FB-0141 · Loading 公开合同混入私有外观、方向别名和生命周期事件

- 原始记录：`feedback/records/pui-fb-0141-loading-public-contract-scope.json`
- 范围：`component` / `loading`、`preview-site`、`usage-code`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：以联网核验的 TDesign 主干收敛组件 API，基础用法保持最小可用，并让 API、WXML、示例和真实预览一致。
- 实际问题：旧公开面把私有视觉调参、重复方向开关和内部显隐过程误当成消费者 API，基础示例与文档无法表达最小真实调用。
- 决策：公开合同收敛为 13 个 TDesign 主干 Props 加 ariaLabel/reduceMotion、三 Slot、零 Events、零 Methods；删除 color/easing/showProgress/vertical/show/hide，并重写示例、API、WXML 生成与 H5 分区。
- 理由：Loading 只表示正在处理；可验证的无障碍和低动效属于全库横向合同，但业务结果和私有渲染过程不应进入 API。

AI 必须遵守：

- 先以在线官方文档和固定 npm 包源码确定公开 Props、Slots、Events、Methods，再决定 PoemUI 增量。
- Loading 的业务成功、失败、重试和完成不能从 show/hide 或退场阶段推导。
- 基础用法不得绑定不存在的事件；生成器只输出真实非默认 Props。

验证与遗留风险：

- 验证：`node scripts/test-loading.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 Slot 投影、rpx 尺寸、fixed 全屏、样式隔离和辅助技术需使用合法 AppID 真机确认。

## PUI-FB-0142 · Loading H5 在 loading=false 时重建预览节点而跳过真实退场帧

- 原始记录：`feedback/records/pui-fb-0142-loading-h5-exit-frame-parity.json`
- 范围：`component` / `loading`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：H5 必须对应真实 WXML/WXSS，显隐动画需要可观察中间帧和完成态，不得用重建或瞬移伪造交互。
- 实际问题：H5 通过整段 stage 重绘跳过了 CSS transition，和小程序端保留节点到 leave 完成的状态机不一致。
- 决策：增加 preserveLoadingPreviewExit：只在 overview 中 loading=true→false 且内容已可见时复用现有节点，切换 inactive、安排完成渲染；其他 Props 继续走统一真实 Props 回写路径。
- 理由：退场节点是 Loading 公开可见行为的一部分；局部 class 切换既保留共享 Button 树，也让浏览器真正执行 WXSS 对应的 opacity/scale transition。

AI 必须遵守：

- 验证动画时读取真实计算 opacity/transform/transitionDuration，并同时确认完成后卸载。
- H5 Props 回写若会替换动画节点，必须为退出分支保留节点或采用等价的 DOM 过渡结构。
- 低动效必须压缩显隐并停止无限循环，不能只改根 data 属性。

验证与遗留风险：

- 验证：`node scripts/test-loading.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信端实际帧调度、rpx 缩放、页面 fixed、样式隔离和系统低动效需使用合法 AppID 真机确认。

## PUI-FB-0143 · Toast 公开合同混入受控显隐和私有动效参数

- 原始记录：`feedback/records/pui-fb-0143-toast-public-contract-scope.json`
- 范围：`component` / `toast`、`preview-site`、`usage-code`、`shadcn-message`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：联网对照 TDesign 的真实公开能力，基础用法保持最小可用，API、源码、H5、示例和安装产物必须同源。
- 实际问题：旧公开面把受控显示、诊断事件、默认 Slot、层级与动效私参暴露为消费者合同，和在线 TDesign 参考及最小调用原则不一致。
- 决策：收敛为 10 个 TDesign 核心 Props 加 ariaLabel/reduceMotion、icon/message 两 Slot、唯一 close、show(options)/hide()；删除受控显隐、私有动效和默认 Slot。
- 理由：单条 Toast 的调用意图是命令式短反馈；可访问名称和低动效为全库横向合同，其他旧字段既重复又无法改善调用路径。

AI 必须遵守：

- 先在线核对官方页面、仓库/NPM 与固定包源码，再决定公开 Props、Slots、Events、Methods。
- 基础 WXML 只展示可安装的最小调用，完整事件只进 API 或事件专项示例。
- 自动收起与 close 只能表示提示结束，不能写成业务成功。

验证与遗留风险：

- 验证：`npm run example:install（含 site:build，2026-07-20 通过）`
- 验证：`node scripts/test-toast.js（2026-07-20 通过）`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 fixed 层、Overlay 触摸滚动门禁、rpx、安全区、Slot 投影、读屏和系统低动效仍需合法 AppID 真机确认。

## PUI-FB-0144 · Toast H5 隐藏后归一化移除了唯一触发入口并留下空舞台

- 原始记录：`feedback/records/pui-fb-0144-toast-hidden-preview-trigger-parity.json`
- 范围：`component` / `toast`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：H5 必须具有真实可操作入口和可观察动画，不接受静态占位、假事件或隐藏态空预览。
- 实际问题：旧结构靠工程诊断控件承载唯一交互，归一化后用户无法再次显示 Toast，也无法验证真实运行态。
- 决策：概览固定保留共享 PUI Button 作为 show/hide 入口，按基础/主题/方向/遮罩分区；去除事件诊断和方法面板，隐藏态不再为空。
- 理由：用户应能从预览本身完成真实操作；API 承担方法与事件说明，概览不应靠诊断块才能使用组件。

AI 必须遵守：

- 隐藏态浮层组件必须保留一个真实、可访问的 PUI 触发入口。
- 概览不展示方法面板和事件日志；方法和事件归入 API。
- 验证退场时必须读取真实节点和计算样式，不能只观察提示文字变化。

验证与遗留风险：

- 验证：`npm run example:install（含 site:build，2026-07-20 通过）`
- 验证：`node scripts/test-toast.js（2026-07-20 通过）`
- 验证：`npm run check`
- 真机/兼容风险：微信端 fixed 定位、Overlay 阻止触摸滚动、动画合成、安全区、系统低动效与读屏需使用合法 AppID 真机确认。

## PUI-FB-0145 · Toast H5 过渡引用未挂载的 easing Token 而退化为瞬移

- 原始记录：`feedback/records/pui-fb-0145-toast-h5-transition-easing-token.json`
- 范围：`component` / `toast`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：H5 必须有可观察的真实动画中间帧，不能因为未定义 CSS Token 或重绘退化为瞬移。
- 实际问题：缺失 easing 自定义属性使整条 transition 声明无效，预览虽然改变状态但没有可观察的中间帧。
- 决策：在 Toast H5 生成器直接注入 --pui-toast-ease:var(--ease-standard)，保留固定 500ms/1ms 的公共动画合同。
- 理由：动效速度不是 Toast 的公开 Props；easing 是站点 Token，必须由生成器完整提供，不能依赖未定义变量回退。

AI 必须遵守：

- 组件私有 H5 动效变量必须在生成器或全局根明确提供，并由计算样式验证。
- 固定动效合同不得借机暴露为可随意传入的公开 Props。

验证与遗留风险：

- 验证：`npm run example:install（含 site:build，2026-07-20 通过）`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信端 fixed 层的合成节奏、后台节流、rpx 与系统低动效仍需合法 AppID 真机确认。

## PUI-FB-0146 · API 通用 Slot 引言把不存在的 default Slot 宣传为可用能力

- 原始记录：`feedback/records/pui-fb-0146-api-slot-description-contract.json`
- 范围：`global` / `toast`、`preview-site`、`api-reference`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：API、WXML 和真实实现必须逐项一致；没有的 Slot 不能以通用文案虚构出来。
- 实际问题：Toast API 表格条目正确，但引言仍让调用方误以为可以传入默认 Slot。
- 决策：API 渲染器检查 detail.slots 是否包含 default：仅此时展示默认 Slot 指引，否则明确仅有列出的具名 Slot。
- 理由：这将真实元数据作为唯一 API 事实源，并同时保护其他无默认 Slot 的组件。

AI 必须遵守：

- 渲染 API 的 Slots 前先读取真实 metadata；没有 default 就不得建议使用 default Slot。
- WXML、metadata、API 表和兼容说明应由同一 Slot 集合交叉验证。

验证与遗留风险：

- 验证：`npm run example:install（含 site:build，2026-07-20 通过）`
- 验证：`npm run check`
- 真机/兼容风险：无额外真机 API 风险；小程序运行时仍需以合法 AppID 复核 named Slot 投影。

## PUI-FB-0147 · Dialog 公开合同混入旧状态机、重复 Slot 和预览私参

- 原始记录：`feedback/records/pui-fb-0147-dialog-public-contract-scope.json`
- 范围：`component` / `dialog`、`popup`、`preview-site`、`usage-code`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：联网对照 TDesign 的真实公开能力，Dialog 的源码、H5、API、示例和安装产物必须只暴露可真实闭环的最小合同；用户已授权后续组件在完整证据后自主验收。
- 实际问题：旧公开合同把不属于确认 Dialog 的业务状态、Slot 和调试参数暴露给调用方，WXML、API、H5 与示例难以保持同源。
- 决策：收敛为 visible/actions/buttonLayout/cancelBtn/closeBtn/closeOnOverlayClick/confirmBtn/content/overlayProps/preventScrollThrough/showOverlay/title/usingCustomNavbar/zIndex/ariaLabel/reduceMotion，5 Events、7 个具名 Slot 和 close()。
- 理由：保留确认、动作、遮罩与可组合内容的独立用户意图；ariaLabel/reduceMotion 是全库横向合同，其他旧字段均可由父级或 Slot 表达。

AI 必须遵守：

- 每次变更 Dialog 先联网核对官方页面、仓库/NPM 和固定包源码。
- 基础 WXML 只保留最小可安装调用，完整事件进入 API 或专项示例。
- confirm/action 不得自动关闭或写入业务成功；关闭由父级 visible 回写。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build：通过`
- 验证：`2026-07-20 npm run check：通过`
- 验证：`2026-07-20 npm run pack:check：通过`
- 验证：`2026-07-20 npm run example:install：通过`
- 验证：`2026-07-20 npm run feedback:generate && npm run feedback:check：通过；微信 CLI build-npm 因 touristappid 返回内部 code 10，未生成 miniprogram_npm，未冒充通过`
- 真机/兼容风险：微信 Popup/Overlay 层级、touchmove 阻止、rpx、安全区、具名 Slot 投影、读屏与系统低动效仍需合法 AppID 真机确认。

## PUI-FB-0148 · Dialog H5 与 Popup 依赖未完整镜像遮罩、滚动保护和真实动作

- 原始记录：`feedback/records/pui-fb-0148-dialog-popup-preview-parity.json`
- 范围：`component` / `dialog`、`popup`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：H5 必须是 WXML/WXSS 能力的真实可操作镜像，不允许只改提示文案、局部假遮罩或遗漏依赖能力；用户已授权在完整证据后自主验收。
- 实际问题：依赖和 H5 演示的能力集合未完全同源，存在局部舞台和属性只在说明层变化的风险。
- 决策：补齐 Popup 三项依赖能力；Dialog H5 改为四个真实任务分区，Close/Cancel/遮罩回写显隐、Confirm/action 保持可见，遮罩全屏覆盖 PreviewDevice。
- 理由：依赖能力、H5 交互与 WXML 只有同源，才能避免视觉正确而真实行为错误。

AI 必须遵守：

- Dialog 修改 overlayProps、滚动保护或自定义导航栏时，同时审计 Popup 源码、H5、API 与产物。
- H5 浮层必须保留真实 PUI 触发入口和实际 Surface，禁止只改事件提示。
- 遮罩验收要点真实空白区，验证完整 PreviewDevice 覆盖而非中心命中。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build：通过`
- 验证：`2026-07-20 npm run check：通过`
- 验证：`2026-07-20 npm run pack:check：通过`
- 验证：`2026-07-20 npm run example:install：通过`
- 验证：`2026-07-20 npm run feedback:generate && npm run feedback:check：通过；微信 CLI build-npm 因 touristappid 返回内部 code 10，未生成 miniprogram_npm，未冒充通过`
- 真机/兼容风险：微信 Popup 遮罩、catchtouchmove、custom navbar、安全区、样式隔离、复杂 Slot、高频触摸和系统低动效仍需合法 AppID 真机确认。

## PUI-FB-0149 · Progress 公开面混入不确定态、业务事件与诊断方法

- 原始记录：`feedback/records/pui-fb-0149-progress-public-contract-scope.json`
- 范围：`component` / `progress`、`preview-site`、`usage-code`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：以在线 TDesign 与固定源码为依据收敛 Progress 的真实确定进度能力，基础 WXML 保持最小，H5 和小程序不能用动画或 100% 假装业务完成。
- 实际问题：旧公开合同把未知进度、业务完成、动画生命周期和 H5 诊断手段写成了 Progress 的对外能力，无法和确定进度的源码、示例及文档保持一致。
- 决策：收敛为 percentage/theme/label/size/status/strokeWidth/color/trackColor/ariaLabel/reduceMotion，唯一 label Slot，0 Events、0 Methods；未知进度由 Loading 表达，业务错误/空内容/重试在外部组合。
- 理由：确定进度只应显示父级已经掌握的数值；全库 ariaLabel/reduceMotion 保持横向一致，其他历史能力没有真实、独立且可复用的组件责任。

AI 必须遵守：

- 先以在线 TDesign 页面、固定版本包和真实 WXML 三者交叉确定公开面。
- 基础 WXML 仅保留最小调用，完整事件只在组件真实存在时进入 API。
- 未知进度使用 Loading；错误、空内容和重试必须在 Progress 外部组合。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build：通过`
- 验证：`2026-07-20 npm run check：通过`
- 验证：`2026-07-20 npm run pack:check：通过（339.1 kB / 1.8 MB / 554 files）`
- 验证：`2026-07-20 npm run example:install：通过；微信 CLI build-npm 因 touristappid 不存在返回内部 code 10，未生成 miniprogram_npm，未冒充通过`
- 真机/兼容风险：微信端 rpx、双半圆环形合成、label Slot 投影、颜色模式、读屏和系统低动效仍需合法 AppID 真机确认。

## PUI-FB-0150 · Progress 已实现 label Slot 但官网 metadata 未公开

- 原始记录：`feedback/records/pui-fb-0150-progress-label-slot-metadata-parity.json`
- 范围：`component` / `progress`、`preview-site`、`api-reference`、`metadata`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：WXML、metadata、官网 API、示例和文档必须完整一致，调用方可以发现每一个真实公开 Slot，且不虚构默认 Slot。
- 实际问题：真实 WXML 能力被官网 API 隐藏，调用者无法从 metadata 驱动的参考页发现 label Slot。
- 决策：在 metadata.apiSlots 增加唯一 label 条目，并在专项测试中直接比较 Slot 名称与说明；重新生成 catalog 产物后用浏览器复验。
- 理由：metadata 是官网 API 的直接数据源，必须与 WXML 一起被测试，才能防止真实能力被遗漏或虚构。

AI 必须遵守：

- WXML、metadata.apiSlots、API 页面、组件合同和示例必须共同列入组件 battle 审计。
- 具名 Slot 存在时必须在 metadata 精确声明；没有 default Slot 时不得暗示它可用。
- metadata 改动后必须重新生成 catalog，再对运行中的真实 API 页面复验。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build：通过，生成含 Progress label Slot 的 preview/components-data.js`
- 验证：`2026-07-20 npm run check、npm run pack:check、npm run example:install：通过；微信 CLI build-npm 因 touristappid 不存在返回内部 code 10，未生成 miniprogram_npm`
- 真机/兼容风险：微信运行时仍需以合法 AppID 确认 label Slot 的投影顺序、长内容换行与读屏结果。

## PUI-FB-0151 · Skeleton 公开面混入非结构化状态、事件与私有动效

- 原始记录：`feedback/records/pui-fb-0151-skeleton-public-contract-scope.json`
- 范围：`component` / `skeleton`、`preview-site`、`usage-code`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：按在线 TDesign 与固定源码逐组件收敛 Skeleton，只保留真实可复用的结构占位能力，基础 WXML 保持最小且不以计时或内容回显伪造请求结果。
- 实际问题：历史 API 把预览诊断和不再需要的装饰控制暴露为组件合同，事件与内容出现容易被调用方误解为网络生命周期或成功结果。
- 决策：收敛为七项 Props、一个默认 Slot、零 Events/Methods；rowCol 承担安全结构配置，loading 只由父级控制，固定 180ms/1ms 是内部视觉合同。
- 理由：Skeleton 的可复用责任是预示结构而非管理请求。全库 ariaLabel/reduceMotion 保留可访问性一致性，其余历史字段没有独立且必要的组件职责。

AI 必须遵守：

- 先以在线 TDesign 页面、固定版本 npm 包和真实 WXML 三者交叉确定公开面。
- 基础 WXML 只保留最小调用；没有真实 Events 或 Methods 时不得为了演示添加 bind:* 或状态日志。
- 错误、空态、重试和成功反馈必须在 Skeleton 外部组合真实 PUI 组件。

验证与遗留风险：

- 验证：`2026-07-20 npm run feedback:generate && npm run feedback:check：通过（152 records）`
- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install：通过；tarball 338658 bytes / 554 files / shasum c5e528a6a4a3dfe7a37cfd19882da3d44cb3ea46`
- 验证：`2026-07-20 微信 CLI build-npm：IDE server 启动后 touristappid 被拒绝为不存在的 AppID（code 10），未生成 miniprogram_npm、未冒充通过`
- 真机/兼容风险：微信真机仍需以合法 AppID 确认 rpx、动画合成、复杂默认 Slot、样式隔离、读屏与系统低动效。
- 真机/兼容风险：本轮内置浏览器未提供独立 390px 页级视口改写接口；375px PreviewDevice 与响应式专项合同已覆盖，目标手机浏览器仍需最终确认。

## PUI-FB-0152 · Skeleton 元数据与 H5 兼容说明滞后于真实公开合同

- 原始记录：`feedback/records/pui-fb-0152-skeleton-h5-metadata-compatibility-parity.json`
- 范围：`component` / `skeleton`、`preview-site`、`api-reference`、`metadata`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：官网 Props、API、H5 兼容说明、WXML、示例与安装产物必须同源；所有说明完整展示真实能力，不保留被删除的事件、Slot 或动效。
- 实际问题：官网数据源和兼容说明保留历史快照，调用方会看到源码中不存在的生命周期、Slot 和动效，形成跨端公开合同漂移。
- 决策：同步 metadata Props/分组/default Slot、H5 showcase、compatibility branch、API/H5 文档、示例、shadcn 映射和专项测试；重新生成 catalog 后再浏览器复验。
- 理由：metadata 是 API Reference 与生成产物的真相源，兼容说明必须复述真实 WXML/WXSS，而不是保留旧版运行时说明。

AI 必须遵守：

- 逐项比较 JS properties、WXML Slots/Events、metadata.apiProps/apiEvents/apiSlots、API Reference、基础 WXML 和示例。
- 属性页兼容文案也属于公开合同，删除能力后必须检索并清理所有历史术语。
- metadata 变更后必须重新生成 catalog，并在真实浏览器中查看 API 和属性页。

验证与遗留风险：

- 验证：`2026-07-20 npm run feedback:generate && npm run feedback:check：通过（152 records）`
- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install：通过，catalog 与 miniprogram_dist 已同源重建`
- 验证：`2026-07-20 微信 CLI build-npm：touristappid 被拒绝为不存在 AppID（code 10），未生成 miniprogram_npm、未冒充通过`
- 真机/兼容风险：微信真机仍需以合法 AppID 验证默认 Slot 投影、长 API 文案、PUI Select/Switch 触摸命中、rpx 与读屏。
- 真机/兼容风险：内置浏览器的页级 390px 视口不能独立改写，响应式合同与 375px PreviewDevice 不替代目标手机浏览器最终复核。

## PUI-FB-0153 · Empty 公开面混入历史操作、状态与视觉配置

- 原始记录：`feedback/records/pui-fb-0153-empty-public-contract-scope.json`
- 范围：`component` / `empty`、`preview-site`、`usage-code`、`example`、`state-composition`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：按联网 TDesign 对照逐组件收敛 Empty，只保留真实空状态的图形、说明和消费者可组合入口，基础 WXML 必须是最小调用。
- 实际问题：历史 API 将父级业务操作和预览调试状态误暴露为 Empty 合同，调用方会把空态 action、资源事件或视觉切换误解为组件能力。
- 决策：收敛为五项 Props、三个具名 Slot、零 Events/Methods；图片由内部 PUI Image 管理，action Slot 中的 PUI Button 只由消费者处理，错误重试改为 Empty 的兄弟 Button 或 action Slot 内容。
- 理由：Empty 的职责是表达无内容和提供组合位置，不拥有请求、资源生命周期或业务导航。ariaLabel/reduceMotion 是 PoemUI 全库可访问性一致性补充，其余字段没有独立组件职责。

AI 必须遵守：

- 先以在线 TDesign 页面、固定版本 npm 包和真实 WXML 三者交叉确定公开面。
- 基础 WXML 只保留最小调用；没有 Events 或 Methods 时不得为了演示添加 bind:* 或日志。
- 错误、重试和成功必须由父级用 Empty 与真实 PUI Button 组合，不能恢复 Empty 内部 action。

验证与遗留风险：

- 验证：`2026-07-20 npm run feedback:generate && npm run feedback:check：通过（154 records）`
- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install：通过`
- 验证：`2026-07-20 微信 CLI build-npm：IDE server 启动后 touristappid 被拒绝为不存在的 AppID（code 10），未生成 miniprogram_npm、未冒充通过`
- 真机/兼容风险：微信真机仍需使用合法 AppID 确认 rpx、图片解码与域名、具名 Slot 投影、样式隔离、读屏和系统低动效。
- 真机/兼容风险：touristappid 无效导致 miniprogram_npm 未生成，不能以 H5 或 tarball 替代微信开发者工具产物验收。

## PUI-FB-0154 · Empty H5 图形网格引用未定义 Preview Token

- 原始记录：`feedback/records/pui-fb-0154-empty-h5-undefined-preview-token.json`
- 范围：`component` / `empty`、`preview-site`、`design-tokens`、`responsive-layout`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：Empty 的 H5 图形内容分区必须消费真实 PUI Token，在 390px、主题和视觉开关中保持可读、可用且无页面级横向溢出。
- 实际问题：未定义变量使间距回退为浏览器默认无效值，破坏了 Token 合同并使布局在主题或后续 Token 改动时不可预测。
- 决策：以已定义的 --pui-preview-space-lg 替换未定义变量，并由全局 Token 扫描和 Empty 浏览器 390px 复测共同锁定。
- 理由：间距必须消费真实语义 Token，不能用无 fallback 的私有变量碰巧依赖浏览器回退。

AI 必须遵守：

- 所有无 fallback 的 var(--*) 必须由全局 Token 或组件运行时明确提供。
- Token 修复后同时执行静态扫描、真实 390px 几何读取和主题/视觉开关检查。
- 透明展示组件不能用额外 Surface 或硬编码间距掩盖 Token 缺口。

验证与遗留风险：

- 验证：`2026-07-20 npm run check：修复后通过，未再报告 undefined custom property`
- 验证：`2026-07-20 npm run site:build、npm run pack:check、npm run example:install：通过`
- 真机/兼容风险：H5 Token 与响应式布局已验收，但小程序端 rpx 最终排版仍需合法 AppID 真机确认。

## PUI-FB-0155 · NoticeBar 公开面混入历史关闭、过程事件与命令式能力

- 原始记录：`feedback/records/pui-fb-0155-noticebar-public-contract-alignment.json`
- 范围：`component` / `notice-bar`、`preview-site`、`usage-code`、`example`、`metadata`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：以联网 TDesign、固定版本包和真实源码为依据逐项收敛 NoticeBar；基础 WXML 保持最小，组件不能伪造关闭、跳转、成功或生命周期。
- 实际问题：旧合同将业务关闭、导航、跑马过程、私有动效和命令式控制包装为组件能力，源码、H5、示例和文档会引导调用方把公告误当成可自行完成业务的反馈系统。
- 决策：收敛为 12 Props、2 Events、4 Slots、0 Methods；visible 仅在非 null 时受控，suffix-icon 与 operation 只发布 click，业务关闭/跳转完全由父级回写。defaultVisible 保持 PoemUI 的 true，以便最小调用能作为页内公告可见；此差异明确记录而非伪装成 TDesign 默认值。
- 理由：公告负责内容、区域和可访问语义，不负责业务完成。ariaLabel/reduceMotion 是全库横向一致性补充；其余旧字段没有独立且可验证的组件责任。

AI 必须遵守：

- 先用在线 TDesign 页面、固定 npm 包和真实 WXML 三者交叉确定公开面。
- 基础 WXML 只给最小调用；没有真实业务事件时不得机械展示 bind:*。
- suffix-icon 与 operation 只发布区域 click；任何 visible、导航或成功结果必须由父级实现。

验证与遗留风险：

- 验证：`2026-07-20 node scripts/test-notice-bar.js：通过`
- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install、npm run feedback:generate/check：通过`
- 验证：`2026-07-20 微信 CLI build-npm：touristappid 不存在，code 10，未生成 miniprogram_npm；源码/dist/示例安装/tarball 的 NoticeBar 四件套 SHA256 一致。`
- 真机/兼容风险：微信真机仍需用合法 AppID 验证 swiper、SelectorQuery、rpx、Slot 投影、样式隔离、读屏与系统低动效。

## PUI-FB-0156 · NoticeBar H5 重绘吞掉生命周期且长内容撑宽公告容器

- 原始记录：`feedback/records/pui-fb-0156-noticebar-h5-lifecycle-and-overflow-parity.json`
- 范围：`component` / `notice-bar`、`preview-site`、`responsive-layout`、`animation`、`usage-code`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：H5 必须镜像真实 NoticeBar WXML/WXSS：显隐有中间帧，vertical 按 interval 轮播，horizontal 只在真实溢出时跑马，390px 不让组件或页面横向溢出。
- 实际问题：H5 会以静态重绘或局部演示代替原生行为，长内容虽被设备裁切却无法触发真实跑马，且 WXML 存在重复 click 风险。
- 决策：使用同节点 requestAnimationFrame 进入、固定完成后才卸载；用一个真实 interval 计时器推进 vertical 索引；给 NoticeBar 分区与根添加宽度约束，正文保持 max-content 供 DOM 实测；WXML 只保留外层 catchtap。
- 理由：动画、溢出和事件都必须可在真实预览中观察，不能依赖文案、固定百分比或静态状态替代。

AI 必须遵守：

- 不要用整段重绘或固定百分比动画冒充 NoticeBar 的进入、退出或跑马。
- 在 Grid/Flex 演示分区中给公告根和分区显式 min-width:0/max-width:100%。
- 区域点击只保留一个公共事件路径；默认 PUI Button 不能与外层同事件重复上报。

验证与遗留风险：

- 验证：`2026-07-20 node scripts/test-notice-bar.js：通过`
- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install、npm run feedback:generate/check：通过`
- 验证：`2026-07-20 微信 CLI build-npm：touristappid 不存在，code 10，未生成 miniprogram_npm；源码/dist/示例安装/tarball 的 NoticeBar 四件套 SHA256 一致。`
- 真机/兼容风险：微信真机仍需确认 swiper 自动播放节流、SelectorQuery 实测宽度、rpx 文本回流、样式隔离和触摸命中。

## PUI-FB-0157 · 共享属性工作区的非法 JSON 只有视觉标记而没有可读错误边界

- 原始记录：`feedback/records/pui-fb-0157-property-json-validation-feedback.json`
- 范围：`global` / `property-panel`、`preview-site`、`notice-bar`、`accessibility`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：属性工作区遇到非法 JSON 或数字时，必须保留上次有效 Props、标记 aria-invalid，并给用户可读、可访问的真实错误边界。
- 实际问题：用户只能看见红色边框，读屏和非颜色用户无法得知为何输入未生效。
- 决策：新增共享 setPropControlValidity：解析失败时生成 role=alert 反馈并关联 aria-describedby，成功或 null 恢复时删除反馈；旧 Props 保持不变。
- 理由：属性工作区是官网公开可操作界面，解析失败必须像真实表单错误一样可被看见和读出，而不是靠颜色暗示。

AI 必须遵守：

- 非法 JSON/数值必须同时保留上次有效 Props、设置 aria-invalid，并渲染 role=alert 的简短原因。
- 错误信息属于属性编辑器，不应伪造为组件内部业务错误或成功状态。
- 输入恢复有效值后清除 aria-describedby 和错误节点，避免陈旧错误。

验证与遗留风险：

- 验证：`2026-07-20 node scripts/test-notice-bar.js：通过`
- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install、npm run feedback:generate/check：通过`
- 验证：`2026-07-20 微信 CLI build-npm：touristappid 不存在，code 10，未生成 miniprogram_npm；源码/dist/示例安装/tarball 的 NoticeBar 四件套 SHA256 一致。`
- 真机/兼容风险：该修复是官网 HTML 属性编辑器，不改变小程序端；真机仍需验证组件自身的业务表单错误组合。

## PUI-FB-0158 · Result 公开面混入动作、过程状态与伪事件

- 原始记录：`feedback/records/pui-fb-0158-result-public-contract-alignment.json`
- 范围：`component` / `result`、`preview-site`、`usage-code`、`example`、`metadata`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：以联网 TDesign 对照和真实源码为依据收敛 Result；基础 WXML 只展示结果，不把页面业务动作、加载或成功伪装成组件能力。
- 实际问题：历史合同把 Result 误建模为页面反馈流程和双操作入口，H5、API、示例与安装包会诱导调用者依赖不存在的业务完成、重试和事件结果。
- 决策：收敛为 7 Props、image/title/description 三个具名 Slot、0 Events、0 Methods；图形优先级固定 image → icon → image Slot，根结果语义仅由 theme/title/description 组成。
- 理由：Result 负责结果内容与可访问语义，后续提交、重试、跳转和成功确认必须由父级使用同级 PUI Button 等组件组合并自行回写。

AI 必须遵守：

- 先用在线 TDesign 页面、固定 npm 包和真实 WXML 三者交叉确定公开面。
- 基础 WXML 只给最小调用；没有真实公共事件时不得机械展示 bind:*。
- 后续操作必须由父级组合 PUI Button 并自己处理状态回写，Result 不得伪造成功或重试。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build：通过`
- 验证：`2026-07-20 npm run check：通过（Result 专项与全库门禁均通过）`
- 验证：`2026-07-20 npm run pack:check、npm run example:install：通过`
- 验证：`2026-07-20 微信 CLI build-npm：touristappid 不存在，code 10，未生成 Result miniprogram_npm。`
- 真机/兼容风险：微信真机仍需以合法 AppID 验证 image 解码与域名、rpx 图标尺寸、具名 Slot 投影、样式隔离、读屏与系统低动效。

## PUI-FB-0159 · Result 被全局预览 Surface 覆盖且动效时长漂移

- 原始记录：`feedback/records/pui-fb-0159-result-preview-surface-and-motion-parity.json`
- 范围：`component` / `result`、`preview-site`、`responsive-layout`、`animation`、`design-tokens`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：H5 必须镜像透明的 Result WXML/WXSS，不让通用卡片样式改写组件结构、边界或 500ms/1ms 动效；390px、主题和视觉开关均可用。
- 实际问题：全局预览样式把展示型 Result 重新包成卡片，且覆盖了其生命周期时长，导致 H5 与小程序 WXSS 视觉和动效均漂移。
- 决策：从所有通用 preview Surface 选择器移除 Result，只保留透明专属 H5 根；PreviewDevice 继续承载主题底色、裁切和外观开关。
- 理由：Result 自身不应再建立第二层 Surface；移除覆盖能让同一组件尺寸、边界与动效在 H5/WXSS 间保持可解释。

AI 必须遵守：

- 新增或收敛透明组件时，逐项检查其是否命中全局 preview Surface、transition 或外观选择器。
- PreviewDevice 可承载主题和视觉效果，但组件根必须保持真实 WXML/WXSS 的 Surface 责任。
- 动效验收同时读取正常和低动效计算时长；浏览器驱动无法采样中间帧时如实登记真机录屏风险。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check：通过`
- 验证：`2026-07-20 npm run example:install：通过`
- 验证：`2026-07-20 微信 CLI build-npm：touristappid 不存在，code 10。`
- 真机/兼容风险：微信真机仍需以合法 AppID 对 Result 500ms 中间帧、rpx 文本回流、图标基线、主题 Token 继承、样式隔离、读屏和系统低动效录屏确认。

## PUI-FB-0160 · 共享 Loading 覆盖测试仍要求已移除依赖的 Result

- 原始记录：`feedback/records/pui-fb-0160-result-loading-coverage-stale-test.json`
- 范围：`component` / `result`、`test-suite`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：专项与全库门禁必须从真实 WXML 依赖出发，不能让已删除的 Loading 镜像成为 Result 的假契约。
- 实际问题：历史静态映射把 Result 误列为 Loading 消费者，使正确的公开 API 收敛无法通过完整检查。
- 决策：从 loadingCoverage 删除 Result，继续由 nativeLoadingComponents 从真实 WXML 推导覆盖集合；Result 专项测试明确禁止 PUI Loading 和 H5 假 Loading。
- 理由：门禁必须反映真实组合关系，不能为了维持历史名单把不属于组件责任的 Loading 加回去。

AI 必须遵守：

- 删除组件内部依赖后，先运行依赖覆盖门禁并只更新与真实 WXML 不一致的映射。
- 不要为通过测试把已收敛的 Loading、Button 或事件壳重新加回组件。
- 测试失败先保留失败证据，再修正最小的过期合同并重跑全量门禁。

验证与遗留风险：

- 验证：`2026-07-20 首次 npm run check：因 expected 多出 result 失败`
- 验证：`2026-07-20 修正后 node scripts/test-shared-subcomponent-geometry.js、npm run check、npm run pack:check：通过`
- 真机/兼容风险：此问题仅影响源码/H5 组合门禁；微信端仍需合法 AppID 复核 Result 自身的图形、Slot、rpx 和低动效。

## PUI-FB-0161 · PullRefresh 公开合同误含外部滚动与伪完成能力

- 原始记录：`feedback/records/pui-fb-0161-pull-refresh-public-contract-alignment.json`
- 范围：`component` / `pull-refresh`、`preview-site`、`usage-code`、`example`、`metadata`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：以联网 TDesign 对照和真实源码为依据收敛 PullRefresh；基础 WXML 只展示局部下拉容器，不把外部滚动、业务完成或方法伪装成组件能力。
- 实际问题：历史合同把外部滚动控制、演示轨道完成、网络成功/失败和方法按钮混为 PullRefresh 公共能力，会诱导调用者依赖组件并未真实完成的业务流程。
- 决策：收敛为内部滚动下拉容器：保留 TDesign 形状的滚动、阈值、文案、受控状态和七个事件，额外仅保留全库 ariaLabel/reduceMotion；移除外部 scrollTop、indicator Slot、业务成功/失败与实例方法。
- 理由：组件只应表达真实拖拽和刷新请求，网络、重试、数据替换和业务成功必须由消费者在父级闭环后回写 value=false。

AI 必须遵守：

- 先用在线 TDesign 页面、固定 npm 包和真实 WXML 三者交叉确定公开面。
- 基础 WXML 只给最小调用；完整 bind 列表只能进入 Events 或事件专项示例。
- timeout 与完成轨道只能表达收起请求，业务成功、失败、重试和数据替换必须由父级处理。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install：通过`
- 验证：`2026-07-20 微信 CLI build-npm：touristappid 不存在，code 10，未生成 miniprogram_npm。`
- 真机/兼容风险：微信真机仍需以合法 AppID 验证内部 scroll-view 的惯性、边缘下拉命中、rpx 轨道高度、Slot 投影、样式隔离、读屏和系统低动效。

## PUI-FB-0162 · PullRefresh H5 触摸路径曾阻断真实局部滚动

- 原始记录：`feedback/records/pui-fb-0162-pull-refresh-h5-touch-scroll-parity.json`
- 范围：`component` / `pull-refresh`、`preview-site`、`responsive-layout`、`animation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：H5 必须把 PullRefresh 镜像为可真实滚动的局部容器，只有顶部向下手势才接管刷新；Props、低动效、主题和视觉开关必须作用于实际预览。
- 实际问题：历史 H5 的触摸策略会把垂直局部滚动错误限制为横向手势路径，导致 H5 与小程序内部 scroll-view 的可用性和门禁漂移。
- 决策：拆分非触摸 Pointer 与触摸监听；保留浏览器的纵向局部滚动，并把 scrollIntoView 改为依据实际 DOM 几何定位真实锚点。
- 理由：这既让长内容可读，又避免非顶部、横向、向上和取消手势误触发刷新；同一 Props 面板可实测改变轨道、Loading、滚动条、无障碍名称和低动效。

AI 必须遵守：

- 对于同时有局部滚动和下拉刷新能力的 H5，不得以 touch-action:pan-x 禁止阅读；只在顶部向下手势接管。
- Pointer Events 被浏览器取消时，必须有真实 Touch Events 路径，而非用定时器或静态提示伪造刷新。
- scrollIntoView 的 H5 镜像必须定位到真实内容锚点，并通过 Props 面板实测回写。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install：通过`
- 验证：`2026-07-20 微信 CLI build-npm：touristappid 不存在，code 10，未生成 miniprogram_npm。`
- 真机/兼容风险：当前浏览器使用 391px 内部 PreviewDevice 进行窄宽核验；仍需合法 AppID 真机补录真实 390px 设备窗口、触摸惯性、系统手势竞争、动画中间帧和辅助技术。

## PUI-FB-0163 · Popup 公开合同曾混入业务状态、诊断事件与实例方法

- 原始记录：`feedback/records/pui-fb-0163-popup-public-contract-alignment.json`
- 范围：`component` / `popup`、`metadata`、`usage-code`、`example`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：以联网 TDesign Popup 对照和真实 WXML 为依据收敛 Popup，只公开基础浮层实际能闭环的能力，基础 WXML 保持最小化。
- 实际问题：历史公开面把上层业务内容和预览诊断暴露为基础浮层能力，调用者会误以为 Popup 能提交、重试、管理请求状态或自行完成打开关闭流程。
- 决策：公开 14 Props：TDesign 12 项基础浮层 Props 加 PoemUI ariaLabel/reduceMotion；仅 visible-change，default/content/close-btn 三个 Slots，零 Methods。
- 理由：标题、表单、Loading、Empty、Result、业务关闭策略和网络回写属于调用方或上层组件；Popup 只应可靠地请求显隐并保留退场。

AI 必须遵守：

- 先用在线 TDesign 页面、固定 npm 包和真实 WXML 三者交叉确定基础浮层公开面。
- 基础 WXML 只保留最小调用；完整 visible-change 只进入 Events 或事件专项示例。
- 任何 loading/error/empty/retry、标题、Footer、提交和业务成功都必须留给消费者组合，不能回填 Popup 根 API。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install：以最终构建记录为准。`
- 验证：`2026-07-20 微信 CLI build-npm：最终实际结果记录在本组件进度项，不手工伪造 miniprogram_npm。`
- 真机/兼容风险：微信真机仍需以合法 AppID 验证 fixed 遮罩、rpx 位移、安全区、Slot 投影、样式隔离和读屏。

## PUI-FB-0164 · Popup 精简后 H5 与上层组合仍依赖旧私有边界

- 原始记录：`feedback/records/pui-fb-0164-popup-preview-dependency-parity.json`
- 范围：`component` / `popup`、`dialog`、`picker`、`sheet`、`preview-site`、`responsive-layout`、`animation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：H5 必须以真实 Popup WXML/WXSS 镜像完整遮罩、位置、关闭、可控回写、低动效和视觉 Token；Dialog、Picker、Sheet 不得继续调用已删除的 Popup 私有 Header、状态或生命周期。
- 实际问题：旧镜像与依赖耦合会把已删除能力继续暴露在浏览器中，或使上层组件依赖不存在的 Popup 根级内容和事件。
- 决策：H5 收敛为 bare Popup Surface；Dialog/Picker/Sheet 通过 visible-change 和自身状态机完成关闭与生命周期，Popup 不再传递业务状态或 after-*。
- 理由：这使 H5 和 WXML 的能力边界一致，同时保留上层组件真实内容、确认、滚动与事件顺序。

AI 必须遵守：

- Popup 的 Loading、Empty、Header、Footer 和业务动作必须由消费者组合，不可在 H5 复制一份根级状态壳。
- 删除 Popup 公开事件或 Slot 时，先搜索 Dialog、Picker、Sheet 等依赖，改为其自身的真实生命周期。
- 浏览器验收同时点击遮罩、closeBtn、Props 和外观菜单；用计算样式与实际几何证明开关真的作用于 Surface。

验证与遗留风险：

- 验证：`2026-07-20 npm run check：通过；最终 build、pack、example-install 与微信 CLI 结果记录在本组件进度项。`
- 真机/兼容风险：当前窄宽验证基于 391px PreviewDevice；合法 AppID 真机仍需补录真实 390px 窗口、fixed 层合成、触摸穿透、rpx 动画中间帧、系统低动效和辅助技术。

## PUI-FB-0165 · Popover 公开合同曾混入业务状态、触发策略与实例方法

- 原始记录：`feedback/records/pui-fb-0165-popover-public-contract-alignment.json`
- 范围：`component` / `popover`、`metadata`、`usage-code`、`example`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：以联网 TDesign Popover 对照和真实 WXML 为依据收敛 Popover，只公开锚点气泡实际能闭环的能力，基础 WXML 保持最小化。
- 实际问题：历史公开面把 Tooltip 的触发方式、Popup/Sheet 的业务区域和预览诊断状态混入锚点气泡，调用者会误以为 Popover 能处理加载、重试、提交或命令式开关。
- 决策：公开 10 Props：TDesign 的 visible/defaultVisible/content/placement/showArrow/theme/closeOnClickOutside/fixed 加 PoemUI ariaLabel/reduceMotion；仅 visible-change，default/content 两个 Slot，零 Methods。
- 理由：标题、表单、Loading、Empty、Result、业务关闭策略和网络回写属于调用方；Popover 只应可靠地请求显隐并完成锚点测量。

AI 必须遵守：

- 先用在线 TDesign 页面、固定 npm 包和真实 WXML 三者交叉确定基础浮层公开面。
- 基础 WXML 只保留最小调用；完整 visible-change 只进入 Events 或事件专项示例。
- 任何 loading/error/empty/retry、标题、Footer、触发策略和业务成功都必须留给消费者或 Tooltip，不能回填 Popover 根 API。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install：最终结果记录在本组件进度项。`
- 验证：`2026-07-20 微信 CLI build-npm：实际结果记录在本组件进度项，绝不手工伪造 miniprogram_npm。`
- 真机/兼容风险：微信真机仍需以合法 AppID 验证 SelectorQuery 碰撞翻转、fixed 外部点击层、rpx 位移、Slot 投影、样式隔离、触摸穿透、读屏与系统低动效。

## PUI-FB-0166 · Popover H5 残留旧状态层样式与兼容说明，导致正文不可见

- 原始记录：`feedback/records/pui-fb-0166-popover-preview-legacy-style-parity.json`
- 范围：`component` / `popover`、`preview-site`、`preview-styles`、`property-panel`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：H5 必须以真实 Popover WXML/WXSS 镜像内容、位置、主题、外部点击、受控回写和视觉 Token，不得遗留假状态或过时说明。
- 实际问题：旧层叠规则覆盖了新组件正文，且过时说明把已删除能力重新展示给用户，形成可见功能缺陷和文档误导。
- 决策：在旧层之后增加 Popover 最终 H5 合同，重置正文可见性并锁定 12 位置、主题、fixed 局部坐标、外部层和低动效；兼容说明直接描述当前最小合同。
- 理由：浏览器的级联顺序是 H5 真正运行路径，源码函数不生成旧节点不能保证旧 CSS 无害；最终组件规则必须明确胜出并被专项测试锁定。

AI 必须遵守：

- 每次删除 H5 状态节点，都要搜索同组件的 content/state/footer/title 选择器并检查最终计算样式。
- 用真实截图和 getComputedStyle 验证可见内容、动效与外观开关，不能只看 DOM 是否存在。
- 兼容说明必须与当前源码/API 同一次更新；发现过时能力立即删除，不把历史实现留在用户页面。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install：最终结果记录在本组件进度项。`
- 真机/兼容风险：H5 fixed 以 PreviewDevice 的 transform containing block 近似小程序视口；真机仍需验证 SelectorQuery 坐标、fixed 合成层、触摸穿透、rpx 箭头和样式隔离。

## PUI-FB-0167 · Popover 删除 Loading 状态后共享几何覆盖名单仍保留旧依赖

- 原始记录：`feedback/records/pui-fb-0167-popover-loading-coverage-stale-test.json`
- 范围：`component` / `popover`、`build-tooling`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：API 收敛后，专项与全库合同必须反映真实 WXML 依赖，不能为了通过旧测试把已经删除的 Loading/业务状态能力伪造回来。
- 实际问题：全量检查断言每个 Popover 都有 H5 Loading 镜像，和已收敛的 10 Props/零业务状态合同冲突。
- 决策：从 Loading 覆盖名单移除 popover，保留集合与真实 WXML 的自动比对。
- 理由：测试应约束真实依赖，而不是把历史状态壳作为发布能力反向强加回组件。

AI 必须遵守：

- 新增或移除原生 pui-loading 组合时，同步审计 H5 Loading 覆盖名单和所有状态组合专项。
- 测试与新合同冲突时，先以真实 WXML 和用户可调用 API 判断；不得为了绿灯把已删除的假能力恢复。

验证与遗留风险：

- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install：通过。`
- 真机/兼容风险：真机风险不因测试名单修复变化；仍需合法 AppID 验收 rpx、fixed、Slot、触摸和低动效。

## PUI-FB-0168 · ActionSheet 旧公开合同把业务状态容器和命令式能力误暴露为组件能力

- 原始记录：`feedback/records/pui-fb-0168-action-sheet-public-contract-alignment.json`
- 范围：`component` / `action-sheet`、`preview-site`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：按联网核对的 TDesign 合同收敛共有组件，但保留真实可用交互；基础用法只保留必要调用，业务加载、失败、成功和父级回写不能伪装成 ActionSheet 自己的能力。
- 实际问题：旧合同把 title、分组、三段 Slot、关闭策略、根级 loading/error/empty/retry、层级和动效逃生口及命令式方法都作为 ActionSheet 能力；H5 也借这些 Props 渲染状态壳，和当前组件职责及 TDesign 参考不一致。
- 决策：收敛为 align、cancelText、count、description、items、showCancel、showOverlay、theme、usingCustomNavbar、visible、defaultVisible、ariaLabel、reduceMotion；只保留 visible-change/cancel/close/selected 与 default Slot。
- 理由：这套合同可由真实小程序 WXML/WXSS 和 H5 镜像共同实现，避免把消费者业务状态或全局样式绕过能力伪装成基础组件。PoemUI 明确记录 0/false 的原始项保留与 aria/reduceMotion 扩展。

AI 必须遵守：

- 处理 ActionSheet 前先联网核对官方页面与固定 npm 源码；不能按历史 Props 数量保留能力。
- 基础 ActionSheet WXML 必须零 bind:*；完整事件只进入 API 或专项示例。
- selected、close 与 visible-change 必须维持 selected → close(select) → visible-change(false)，cancel 只通知且不自动关闭。
- items 的 0、false、空字符串必须保留原始值；disabled 项不能发 selected 或关闭请求。
- 不要给 ActionSheet 恢复 root loading/error/empty/retry、title/header/cancel Slot、关闭策略或 open/close/toggle/retry 方法。

验证与遗留风险：

- 验证：`2026-07-20 已通过 npm run site:build、npm run check、npm run pack:check、npm run example:install、npm run feedback:generate、npm run feedback:check；微信 build-npm 已执行但 touristappid 被 CLI 拒绝（code 10），未伪造 miniprogram_npm。`
- 真机/兼容风险：微信真机仍需核验 fixed 浮层、安全区、swiper 手势、Slot 投影、图标对象和系统低动效。

## PUI-FB-0170 · ActionSheet 收敛后残留 H5 状态样式和未定义 Token

- 原始记录：`feedback/records/pui-fb-0170-action-sheet-stale-preview-css.json`
- 范围：`component` / `action-sheet`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：ActionSheet 必须只保留真实动作选择能力；完成 API 收敛后，官网样式、Token 扫描和实际预览也必须不存在历史业务状态壳。
- 实际问题：旧镜像 CSS 未随 API 收敛删除，引用了失效 Token，并保留历史状态容器样式；全局 CSS Token 合同因此失败。
- 决策：删除整个旧 delivery mirror，不为它补 Token；只保留当前 ActionSheet 模板所需的透明 layout root、完整遮罩、bottom sheet、列表/宫格、分页、取消区和 500ms/1ms opacity/transform 动效。
- 理由：定义废弃 Token 只能掩盖死代码，也会让后续 Agent 误以为 ActionSheet 仍支持业务状态、分组或 max-height 动画。

AI 必须遵守：

- 全量 API/状态删除后，搜索组件专属 class、旧 state class 和对应 CSS custom property，逐项清理。
- CSS Token 合同失败时先找真实消费方；过时规则必须删除，而不是新增假 Token。
- 浮层只允许 opacity/transform 的有限动效；不得以 max-height 或 display:none 伪造状态切换。

验证与遗留风险：

- 验证：`2026-07-20 删除旧规则后上述专项通过；完整 npm run check、site:build、pack:check、example:install 和微信 build-npm 在本次组件收口中复验。`
- 真机/兼容风险：微信 WebView 仍需用合法 AppID 验证安全区、rpx、swiper 手势、样式隔离和系统低动效。

## PUI-FB-0173 · DropdownMenu 旧公开合同把筛选入口误扩展为多列状态和滚动引擎

- 原始记录：`feedback/records/pui-fb-0173-dropdown-menu-public-contract-alignment.json`
- 范围：`component` / `dropdown-menu`、`preview-site`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：联网参考 TDesign 后逐组件收敛真实可交付能力，网页、源码、示例和文档不能继续展示未由 DropdownMenu 承担的 loading、error、retry、滚动、实例方法或伪事件。
- 实际问题：旧合同把 TDesign 的父/子分工、页面请求状态和调试方法混在一个根组件，H5 与示例因此承诺了 WXML 不应拥有的交互与反馈。
- 决策：收敛为 8 Props、open/close/change/confirm/reset 五个 Events、default/footer 两个 Slots、零实例方法；items 的单个条目表达 TDesign DropdownItem 的 option/multiple 语义，固定 500ms，reduceMotion 为 1ms。
- 理由：一个 items 入口保留页面筛选的组合性，不额外创建仅为 TDesign 容器拆分而存在的公共 dropdown-item 包；ariaLabel/reduceMotion 是可验证的 PoemUI 无障碍与低动效扩展。

AI 必须遵守：

- 处理 DropdownMenu 前必须联网阅读 TDesign 官方页面、仓库和固定 npm 父/子源码，再决定是否用 items 合并公共入口。
- items 只承载 key、label、options、disabled、multiple；option 只承载 label、value、disabled，0、false、空字符串与数组必须原样保留。
- 单选严格 change → close；多选 change；reset 为 change → reset；confirm 为 confirm → close。
- 不要恢复 visible、loading/error/retry、readonly、根 disabled、滚动、placement、样式逃生口或实例方法。
- H5 trigger/option/footer 必须使用共享 PUI Button；原生 button 只可作为完整遮罩的浏览器桥接。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project "/Users/fanx/Documents/poemUI 小程序组件库/_example"（受 touristappid 无效阻断，code 10）`
- 真机/兼容风险：微信真机仍需核验 fixed 遮罩、安全区、catchtap 触摸穿透、Slot 投影、样式隔离、读屏和系统低动效；示例 touristappid 不能代替合法 AppID。

## PUI-FB-0174 · H5 API 表和 DropdownMenu 路由分别引用过缺失的共享 helper

- 原始记录：`feedback/records/pui-fb-0174-preview-api-helper-regression.json`
- 范围：`global` / `dropdown-menu`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：官网 API 表格必须完整显示所有文字，组件路由必须能运行真实预览；不能用静态标题或构建成功掩盖运行时失败。
- 实际问题：遗留重构删除了 helper 定义但保留调用点，导致实时 H5 路由/API 可能报错或不可完整展示。
- 决策：恢复固定动效 helper；将 API 值展示收敛为独立纯函数，枚举、Boolean、nullable Boolean、范围和无约束分别有明确输出，且在基础设施测试中断言其存在。
- 理由：API 表和组件预览是全站基础设施，必须由真实 Prop 定义驱动并被路由级浏览器测试覆盖。

AI 必须遵守：

- 每次修改预览共享函数后，真实打开受影响路由并查看新控制台错误。
- API 的类型、默认值和可选值必须从 Prop 定义派生，不能另维护裁切版表格。
- API 表格无约束时显示明确的“—”，枚举和 Boolean 用逗号分隔，范围显示边界和步长。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：该问题为 H5 运行态基础设施；微信真机不直接覆盖浏览器 API 表，但仍需合法 AppID 复核组件本体。

## PUI-FB-0175 · DropdownMenu H5 打开态的遮罩不能接收真实指针点击

- 原始记录：`feedback/records/pui-fb-0175-dropdown-menu-h5-overlay-pointer-parity.json`
- 范围：`component` / `dropdown-menu`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：DropdownMenu 的 H5 遮罩必须像真实小程序浮层一样可点击关闭，不能只支持键盘或改提示文字。
- 实际问题：旧 H5 只给遮罩子节点开启 pointer-events，却让父 layer 永久不接收指针；实际鼠标点击失效，键盘路径掩盖了问题。
- 决策：保持基础 layer 的 pointer-events:none，只在 `.is-active` 切换为 auto；遮罩与 panel 的 active 子规则继续决定各自的可点状态。
- 理由：这样遮罩关闭、panel 内选项和离开阶段的交互门禁都由同一真实 active 状态控制，不需要浏览器专属假事件。

AI 必须遵守：

- 检查遮罩时同时读取父 layer、遮罩子节点的 pointer-events，并用 panel 外真实坐标点击。
- active 以外的 retained leaving 节点必须不可点；不要靠 document 级假点击补救。

验证与遗留风险：

- 验证：`node scripts/test-dropdown-menu.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信真机仍需用合法 AppID 复核 catchtap、fixed 遮罩、安全区与触摸穿透。

## PUI-FB-0176 · Rate 专项测试仍断言已删除的受控提示文案

- 原始记录：`feedback/records/pui-fb-0176-rate-stale-preview-contract-test.json`
- 范围：`component` / `rate`、`preview-site`
- 状态：`resolved`，用户验收：`not-required`，更新：2026-07-20
- 用户目标：DropdownMenu 完整门禁不能被与本组件无关的过期 Rate 文案断言阻断，同时不能修改 Rate 的真实运行能力。
- 实际问题：过期字符串断言使全库 check 在 DropdownMenu 的无关位置失败，且无法证明当前 Rate 行为。
- 决策：仅将断言改为当前 value=0 受控 Rate 示例；不修改 Rate 源码、API、WXML 或浏览器行为。
- 理由：0 是该组件必须保留的关键受控边界，直接断言真实示例比文案更稳定也更贴近行为合同。

AI 必须遵守：

- 全库门禁被无关组件阻断时，先核验源码与断言是否同源；只修复过期测试，不回填已删除 UI。
- 涉及受控组件时优先覆盖 0、false、空字符串等真实边界，而不是提示文案。

验证与遗留风险：

- 验证：`npm run check`
- 真机/兼容风险：无已知遗留项。

## PUI-FB-0177 · ConfigProvider 专项测试仍断言旧版 H5 Store 说明文字

- 原始记录：`feedback/records/pui-fb-0177-config-provider-stale-preview-contract-test.json`
- 范围：`component` / `config-provider`、`preview-site`
- 状态：`resolved`，用户验收：`not-required`，更新：2026-07-20
- 用户目标：DropdownMenu 完整门禁不能被 ConfigProvider 的过期展示文案断言阻断，且不改变已存在的全局视觉配置能力。
- 实际问题：过期文案断言使全库 check 在 DropdownMenu 以外停止，而实际 H5 和小程序 Provider 的全局配置主链仍存在。
- 决策：仅更新测试为读取 state.theme 与 global/local 来源标识，不改 H5 或小程序 ConfigProvider 实现。
- 理由：测试仍覆盖全局模式覆盖局部 Props 的真实数据路径，同时允许文案按产品需要演进。

AI 必须遵守：

- 修复全库 gate 前先核验 H5 和小程序路径是否仍提供能力；只校正过期断言，不以恢复旧文案冒充修复。
- ConfigProvider H5 全局模式读取站点共享状态，小程序全局模式读取 visualConfig Store，两端都必须有可验证的来源标识。

验证与遗留风险：

- 验证：`npm run check`
- 真机/兼容风险：无已知遗留项。

## PUI-FB-0178 · Indexes H5 预览缺失真实滚动与侧栏拖动监听器

- 原始记录：`feedback/records/pui-fb-0178-indexes-h5-runtime-binding-regression.json`
- 范围：`component` / `indexes`、`preview-site`
- 状态：`resolved`，用户验收：`not-required`，更新：2026-07-20
- 用户目标：全库验证不能以静态渲染替代真实 H5 交互；Indexes 的滚动和侧栏定位必须回写当前值。
- 实际问题：运行时绑定函数缺失于 `bindPreviewRuntime` 分发，预览外观存在但真实交互链路不完整。
- 决策：恢复 Indexes 专属、可中止的 H5 绑定；只选取真实 `.pui-indexes-preview[data-indexes-sample]` 根，避免 retry Button 的同名 data 属性被误当作示例根。
- 理由：保留既有 source-of-truth、受控回写和 PreviewDevice 边界，不用 document 级代理或提示文字伪造滚动。

AI 必须遵守：

- 不能以 Showcase 静态 markup 存在推断交互已实现。
- 同名 data attribute 可能出现在嵌套 Button；监听器根选择器必须限定到组件根 class。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`node scripts/test-indexes.js`
- 验证：`npm run check`
- 真机/兼容风险：微信真机的 scroll-view 物理惯性、catchtouchmove 与安全区仍需合法 AppID 复核；本记录不是 Indexes 完整 battle 验收。

## PUI-FB-0179 · Search 专项测试仍依赖已移除的预览说明文案

- 原始记录：`feedback/records/pui-fb-0179-search-stale-preview-copy-test.json`
- 范围：`component` / `search`、`preview-site`
- 状态：`resolved`，用户验收：`not-required`，更新：2026-07-20
- 用户目标：全库门禁应验证真实 Search 清空策略，不能被页面说明文字的删改阻断。
- 实际问题：测试把已经删除的说明性文案当作行为证据，导致全库门禁在真实实现正确时失败。
- 决策：以 clearTrigger 归一化和 canClear 条件替换文案断言，Search 运行时代码保持不变。
- 理由：测试直接绑定真实逻辑分支，既不锁死文案，也能拦截策略回归。

AI 必须遵守：

- UI 说明改动后先确认断言是否应该指向实现分支。
- 当组件实现未变且测试只依赖已删除文案时，更新测试而不是恢复死文案。

验证与遗留风险：

- 验证：`node scripts/test-search.js`
- 验证：`npm run check`
- 真机/兼容风险：无新增真机风险。

## PUI-FB-0180 · Empty 专项测试错误依赖不存在的 Image 页面运行时绑定

- 原始记录：`feedback/records/pui-fb-0180-empty-cross-component-runtime-test.json`
- 范围：`component` / `empty`、`image`、`preview-site`
- 状态：`resolved`，用户验收：`not-required`，更新：2026-07-20
- 用户目标：全库测试应验证 Empty 自己的真实 PUI 组合，不应以无关页面运行时作为通过条件。
- 实际问题：跨组件的历史字符串断言让无关 Image 页面实现阻断 Empty 所在的全库门禁。
- 决策：删除无关 Image 绑定断言，改为验证 Empty 自己的嵌入式 PUI Empty 组合；运行时代码不变。
- 理由：测试覆盖真实责任边界，并防止 Empty 因无关页面重构被误报失败。

AI 必须遵守：

- 跨组件测试依赖必须有公开或共享合同依据。
- 不要为满足错误断言新增无调用的占位运行时函数。

验证与遗留风险：

- 验证：`node scripts/test-empty.js`
- 验证：`npm run check`
- 真机/兼容风险：无新增真机风险。

## PUI-FB-0181 · Slider H5 API 缺少专属轨道与尺寸行为说明

- 原始记录：`feedback/records/pui-fb-0181-slider-h5-api-description-gap.json`
- 范围：`component` / `slider`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`not-required`，更新：2026-07-20
- 用户目标：API 的每一项文字必须完整展示真实限制，不能在 H5 预览回退为无信息的泛化描述。
- 实际问题：H5 缺少 Slider 专属说明映射，无法完整表达背景轨颜色、12–28 滑块尺寸及受控边界。
- 决策：补齐 Slider 的 16 项 H5 专属 API 说明，并让专项测试锁定关键颜色与尺寸边界。
- 理由：保留一份对用户完整可见的 H5 说明，同时与现有 Markdown 事实源一致。

AI 必须遵守：

- 新增或收敛组件 API 时，同时检查 apiPropDescription 的 H5 覆盖。
- API 表的完整可见性包含说明语义完整，不能用泛化文案或截断替代。

验证与遗留风险：

- 验证：`node scripts/test-slider.js`
- 验证：`npm run check`
- 真机/兼容风险：无新增真机风险。

## PUI-FB-0182 · Overlay 旧公开合同把遮罩原语误扩展为可关闭浮层容器

- 原始记录：`feedback/records/pui-fb-0182-overlay-public-contract-alignment.json`
- 范围：`component` / `overlay`、`preview-site`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：联网参考 TDesign 后逐组件收敛真实可交付能力，遮罩不能以非受控状态、位置、内容关闭策略、生命周期、实例方法或静态反馈伪装成完整浮层。
- 实际问题：旧合同混入了 Popup/Sheet 的位置、内容、关闭和生命周期职责，H5/示例提供了小程序基础遮罩不应承诺的实例命令和事件反馈。
- 决策：收敛为 8 Props、click({ visible:false }) 一个 Event、default 一个 Slot、零 Methods；visible 始终受控，500ms opacity 过渡（reduceMotion 为 1ms），usingCustomNavbar 通过胶囊/状态栏真实距离设置根 top。
- 理由：保留 TDesign 的遮罩主干、滚动阻断、层级和导航栏上下文，同时仅补可验证的 ariaLabel/reduceMotion；默认 Slot 保持页面组合能力而不把布局提升为 Overlay API。

AI 必须遵守：

- 处理 Overlay 前必须联网阅读 TDesign 官方页、仓库和固定 npm 包，再审计点击根、过渡与 custom navbar 的实际语义。
- 只保留 visible/backgroundColor/duration/preventScrollThrough/usingCustomNavbar/zIndex 与可验证的 ariaLabel/reduceMotion；不要恢复 defaultVisible、位置、padding、安全区、disabled、easing、生命周期或 Methods。
- click 只通知 { visible:false }，Overlay 不自行关闭；H5 必须实际更新父级 Props，不能只修改提示文字。
- 默认 Slot 的布局和业务状态属于消费者；H5 触发入口与 Slot 内容优先组合 PUI Button、Cell 等，原生 button 只可承担遮罩桥接。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`PUI_VERIFY_DIST=1 node scripts/test-overlay.js`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project /Users/fanx/Documents/poemUI 小程序组件库/_example（IDE server 启动后 touristappid 不存在，code 10；未生成 miniprogram_npm）`
- 真机/兼容风险：微信 CLI 因 touristappid 不存在（code 10）未生成 miniprogram_npm，不能用 H5 或安装产物替代。
- 真机/兼容风险：合法 AppID 真机仍需核验 fixed 遮罩、胶囊距离、catchtouchmove、rpx/安全区、Slot 投影、样式隔离、读屏、系统低动效和真实 390px 设备窗口。

## PUI-FB-0183 · SwipeCell 旧合同膨胀且 H5 opened 受控态在归一化后被错误收起

- 原始记录：`feedback/records/pui-fb-0183-swipe-cell-public-contract-and-h5-opened-state.json`
- 范围：`component` / `swipe-cell`、`preview-site`、`documentation`、`example`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：联网参考 TDesign 后逐组件收敛真实可交付能力；SwipeCell 只能保留列表横向操作原语，H5 必须真实响应 Props 和手势，不能用旧的状态机、方法或提示文字伪造交互。
- 实际问题：旧合同把列表容器、手势参数和业务状态一起暴露；H5 的 opened Props 在面板中看似有效，切回概览却变为闭合，形成源码、属性面板和预览不一致。
- 决策：收敛为 disabled、left、opened、right、ariaLabel、reduceMotion 六项 Props；click({ action, source })、dragstart、dragend 三个 Events；default/left/right 三个 Slots；零公开 Methods。固定 10px 起拖、对应动作实际宽度的 30% 打开和 500ms transform 吸附，low motion 为 1ms。
- 理由：保留 TDesign 的横向操作主语义和 Slot 组合，PoemUI 仅补可验证的 ariaLabel/reduceMotion；把加载、空态、错误、重试、业务结果、Cell 文案、动作策略和内部命令留给调用方或上层组件。

AI 必须遵守：

- 处理 SwipeCell 前必须联网阅读 TDesign 官方页、官方仓库与固定 npm 包，再核对真实 WXML 触摸路径和 H5 Pointer 路径。
- 只保留 disabled、left、opened、right 及可验证的 ariaLabel/reduceMotion；不要恢复 title、动作宽度/阈值、loading/error/empty/retry、关闭策略、业务事件或公开 Methods。
- H5 opened 需要与手势共享同一个归一化位置状态；不要把已归一化的 left/right 字符串再次按 Boolean/Array 解析。
- 数组操作必须调用 PUI Button 并只上抛意图后收起；default/left/right Slot 的业务点击和成功状态始终由调用方管理。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`PUI_VERIFY_DIST=1 node scripts/test-swipe-cell.js`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project /Users/fanx/Documents/poemUI 小程序组件库/_example（touristappid 权限失败时记录 code 10，绝不手工生成 miniprogram_npm）`
- 真机/兼容风险：微信 CLI 若 touristappid 不存在会返回 code 10 且不会生成 miniprogram_npm；H5 或 tarball 一致不替代该产物。
- 真机/兼容风险：合法 AppID 真机仍需核验 touch 惯性与系统手势竞争、rpx 宽度回流、Slot 投影、样式隔离、读屏和系统低动效。

## PUI-FB-0184 · SwipeCell H5 动作层引用未定义的反色文字 Token

- 原始记录：`feedback/records/pui-fb-0184-swipe-cell-preview-token-contract.json`
- 范围：`component` / `swipe-cell`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：每个组件的 H5 预览必须使用完整的 PUI Token，完整检查不能因未定义 CSS 变量而失败。
- 实际问题：样式使用了不存在的 --text-inverse，导致全库 CSS Token 门禁失败，且在不同主题下可能解析为不透明的继承色。
- 决策：统一改为 var(--pui-text-on-inverse)，不新增 --text-inverse 别名或页面私有 fallback。
- 理由：反色文字已经有跨端语义 Token；复用它可以保持主题、可读性与全库 Token 扫描的一致性。

AI 必须遵守：

- 修改 preview/styles.css 后必须运行全样式表 Token 扫描，不以局部组件测试替代。
- 存在同义 PUI Token 时必须复用，不新增缩写别名或 fallback 掩盖未定义变量。
- Token 修复后仍要复核对应组件的 light/dark 实际交互，不能只把静态扫描绿灯当成视觉验收。

验证与遗留风险：

- 验证：`npm run check`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：合法 AppID 真机仍需核验微信 WXSS 对自定义属性、动作层样式隔离和深色反色文字的最终呈现。

## PUI-FB-0185 · SwipeCell 已删除 Loading 组合但共享覆盖测试仍要求 H5 镜像

- 原始记录：`feedback/records/pui-fb-0185-swipe-cell-loading-coverage-contract.json`
- 范围：`component` / `swipe-cell`、`preview-site`、`test-contract`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：SwipeCell 只保留横向操作原语；测试合同必须跟随真实 WXML 与 H5 能力，不能逼迫恢复已删除的假 loading。
- 实际问题：全库门禁把已删除 Loading 的 SwipeCell 仍列为镜像覆盖对象，使真实跨端收敛后的实现无法通过。
- 决策：从 loadingCoverage 移除 swipe-cell；保留动态 nativeLoadingComponents 扫描和其他真实 Loading 组件的 H5 helper 强制验证。
- 理由：测试应证明真实组合跨端镜像，而不是用旧清单迫使组件恢复被拒绝的业务状态能力。

AI 必须遵守：

- 删除某组件的 PUI 子组件组合时，同时核对所有动态扫描和硬编码覆盖名单。
- 不要为了测试绿灯恢复 loading/error/empty 等不属于当前公开合同的假能力。
- 保留共享测试对其他真实 PUI Loading 组合的跨端 helper 验证。

验证与遗留风险：

- 验证：`npm run check`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：合法 AppID 真机仍需核验 SwipeCell 触摸惯性、rpx 宽度、Slot 投影、样式隔离、读屏和系统低动效。

## PUI-FB-0186 · Watermark 历史合同把业务状态、事件和防移除承诺误作组件能力

- 原始记录：`feedback/records/pui-fb-0186-watermark-public-contract-alignment.json`
- 范围：`component` / `watermark`、`preview-site`、`documentation`、`example`、`miniprogram-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：以联网 TDesign 对照逐组件收敛可真实交付的 Watermark；基础用法保持最小，不把 H5 文案、浏览器图片结果或不可验证的保护承诺伪装成 API。
- 实际问题：旧合同把绘制工具扩展为业务状态机，并把无法证明的保护与图片结果暴露为公开能力，基础示例也被无关事件和方法污染。
- 决策：收敛为 alpha/content/height/isRepeat/layout/lineSpace/movable/moveInterval/offset/rotate/watermarkContent/width/x/y/zIndex/ariaLabel/reduceMotion 共 17 Props，content/default 两个 Slot，0 Events，0 Methods；拒绝 removable、旧业务状态和样式逃逸入口。
- 理由：保留可测的水印绘制、真实尺寸和 Slot 覆盖语义；ariaLabel/reduceMotion 是 PoemUI 可实际执行的横向补充。内容状态、图片网络结果、业务重试和防截屏/防移除必须由调用方、平台或产品安全策略承担。

AI 必须遵守：

- 先联网核对 TDesign 官方页、官方仓库和固定 npm 包；当 develop 与动态文档漂移时以固定包作为可复现合同。
- 仅公开能由真实 WXML/WXSS/JS 和 H5 共同验证的 Props、Slots、Events 与 Methods；0 Events/Methods 必须明确展示，不能套用通用事件说明。
- 不要把图片 load/error、max marks、防截图、防移除、刷新成功或业务内容状态伪装成 Watermark 组件事件。
- 基础 WXML 只保留 Watermark 与真实 Slot 内容，不写 bind:*；交互应属于 Slot 内的 PUI 组件或父级业务。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`PUI_VERIFY_DIST=1 node scripts/test-watermark.js`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project /Users/fanx/Documents/poemUI 小程序组件库/_example（touristappid 权限失败时记录 code 10，绝不手工生成 miniprogram_npm）`
- 真机/兼容风险：微信 CLI 若 touristappid 不存在会返回 code 10 且不会生成 miniprogram_npm；H5 或 tarball 一致不替代该产物。
- 真机/兼容风险：合法 AppID 真机仍需核验 SelectorQuery/rpx 回流、图片域名与解码、Slot 投影、样式隔离、读屏和系统低动效。
- 真机/兼容风险：Watermark 不能保证防截图、防爬取或恶意 DOM/画布移除；安全保护必须由服务端授权、资源策略和平台能力另行设计。

## PUI-FB-0187 · Watermark H5 把零偏移回退为默认值且遗留 Surface 改变 Slot 几何

- 原始记录：`feedback/records/pui-fb-0187-watermark-h5-zero-offset-and-surface-parity.json`
- 范围：`component` / `watermark`、`preview-site`、`test-contract`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：Watermark 的 H5 必须真实映射 WXML/WXSS 能力，Props 的 0 值、Slot 几何和透明覆盖层不能被演示层悄悄改变。
- 实际问题：H5 用 truthy 回退丢失零偏移，同时遗留通用 Surface 样式给覆盖层增加视觉与几何负担，导致跨端预览漂移。
- 决策：H5 的 offset 使用有限数值判断而不是 || 回退；Watermark 根统一为透明、无边框、无阴影、无毛玻璃、无圆角，保留 Slot 内 PUI 组件与全局外观 Token。
- 理由：使 0 边界与原生一致，并避免演示容器覆盖组件本体或用视觉开关改变布局真相。

AI 必须遵守：

- 数值 Props 的默认回退必须用有限数值判断，不能用 || 吞掉 0。
- 先检查通用预览 CSS 是否把透明根误并入卡片 Surface；视觉外观应由真实 Slot 子组件承担。
- H5 需要用真实尺寸、Props 和 DOM 重绘验证单枚/重复/移动，不能用静态图或提示文本代替。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`npm run site:build`
- 验证：`PUI_VERIFY_DIST=1 node scripts/test-watermark.js`
- 验证：`npm run check`
- 真机/兼容风险：合法 AppID 真机仍需检查 SelectorQuery 测量、rpx 取整、图片字体回流、Slot 动态高度和系统低动效。

## PUI-FB-0188 · ScrollArea 将原生滚动参数、事件和方法误扩张为组件合同

- 原始记录：`feedback/records/pui-fb-0188-scroll-area-public-contract-alignment.json`
- 范围：`component` / `scroll-area`、`preview-site`、`documentation`、`example`、`miniprogram-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：以联网 TDesign 对照逐组件收敛可真实交付的 ScrollArea；基础用法保持最小，不能把原生平台细节和演示操作伪装成 PoemUI 组件能力。
- 实际问题：旧合同把薄 ScrollView 扩张为第二套 scroll-view API，使基础用法、H5 预览和文档都承诺大量不必要且难以保持跨端一致的能力。
- 决策：收敛为 height、scrollIntoView、gradientOverlay、gradientOverlayColor、ariaLabel 五个 Props，一个 default Slot，0 Events，0 Methods；固定原生 scroll-y/enhanced/隐藏滚动条。gradientOverlay 默认开启，只增加两个与真实视口同级、无交互的固定阅读过渡层；调用方继续直接组合内容与目标 id。
- 理由：height 保证封装作为可见滚动区域可直接使用；scrollIntoView 是 TDesign 真实公开的定位能力；ariaLabel 是 PoemUI 可实际执行的语义补充。用户要求的 overlay 是有边界的 PoemUI 视觉能力，不复刻平台参数、事件或方法；其余能力由原生 scroll-view 或调用方负责，避免第二套无法长期维护的平台 API。

AI 必须遵守：

- 先联网核对 TDesign 官方页、官方仓库和固定 npm 包；固定包源码是可复现 API 事实。
- 基础 WXML 只展示 default Slot 和真实内容，零 bind:*、零默认 Props、零诊断动作。
- 没有公开 Events 或 Methods 时，API 必须明确显示为零，不能套用原生 scroll-view 的事件或实例方法。
- 需要滚动坐标、阈值、横向滚动或手势事件时，直接使用微信 scroll-view，而不是要求 ScrollArea 继续扩张。
- 固定顶底遮罩只能使用主题安全色、透明 sibling layer、pointer-events:none 与 aria-hidden；不能创建第二个滚动上下文或 Surface。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`PUI_VERIFY_DIST=1 node scripts/test-scroll-area.js`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project /Users/fanx/Documents/poemUI 小程序组件库/_example（touristappid 权限失败时记录 code 10，绝不手工生成 miniprogram_npm）`
- 真机/兼容风险：合法 AppID 真机仍需确认 enhanced scroll-view、rpx 高度、目标 id 定位、Slot 投影、样式隔离和读屏。
- 真机/兼容风险：微信 CLI 若 touristappid 不存在会返回 code 10 且不会生成 miniprogram_npm；H5、dist 或 tarball 一致不替代该产物。

## PUI-FB-0189 · ScrollArea H5 顶部和底部演示只改 Props 未改变真实滚动位置

- 原始记录：`feedback/records/pui-fb-0189-scroll-area-h5-controlled-scroll-regression.json`
- 范围：`component` / `scroll-area`、`preview-site`、`test-contract`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-20
- 用户目标：H5 预览必须对应真实 WXML/WXSS 能力；父级回写后必须真正改变滚动位置，不能只更新 Props 或提示文字。
- 实际问题：旧顶部/底部演示显示可用的 PUI Button，但点击后没有改变浏览器滚动容器，形成 fake success。
- 决策：删除不可靠的 scrollTop/顶部/底部模拟路径；H5 与原生共同收敛到 scrollIntoView，父级更新目标 id 后真实定位到 Slot anchor。
- 理由：TDesign 的实际薄封装只提供 scrollIntoView。收敛后 H5 能与 WXML 一起验证同一个用户意图，不再维护浏览器私有的受控动画和假边界事件。

AI 必须遵守：

- 任何滚动、拖拽、打开或关闭演示都要在浏览器中读真实运行态，不能只确认 Props 或状态文案改变。
- 当 H5 无法稳定镜像已扩张的平台 API 时，应收敛到原生与参考组件共有、可实际执行的用户意图。
- 删除 fake action 后，概览仍应保留真实组件本体和可用的 Props 回写路径，不能留空容器。

验证与遗留风险：

- 验证：`node scripts/test-scroll-area.js`
- 验证：`npm run site:build`
- 验证：`PUI_VERIFY_DIST=1 node scripts/test-scroll-area.js`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：合法 AppID 真机仍需确认 scroll-into-view 对动态 Slot 节点、重复 id、rpx 高度和 enhanced 行为的实际平台表现。

## PUI-FB-0190 · Indexes H5 阴影模式把连续 Cell 集合误渲染为并列卡片

- 原始记录：`feedback/records/pui-fb-0190-indexes-grouped-cell-shadow-geometry.json`
- 范围：`component` / `indexes`、`cell`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-20
- 用户目标：阴影开启后组件仍应保持清楚、可读的分组层级，不能让集合内部条目拥挤地互相叠影。
- 实际问题：H5 的全局 `.preview-stage .pui-cell` 阴影规则位于旧 Indexes 局部规则之后，覆盖了条目的 `box-shadow:none`，同时保留通用相邻 Cell 的内容间距。
- 决策：在最终 H5 Cell 合同之后增加限定到 `.pui-indexes-preview` 的覆盖：直接条目固定 transparent、transparent border、0 radius、none shadow/blur，连续直接条目 margin-top 为 0。
- 理由：这与原生 Indexes 的连续分组结构一致；`shadow-safe` 的 28px 外部安全区仍只服务集合根阴影，不能被误解为每行卡片都要增加外部间距。

AI 必须遵守：

- 先判断 Cell 是独立 Surface 还是集合内部条目；后者必须让集合根拥有唯一视觉 Surface。
- 不要用额外 gap 掩盖多重阴影；先消除错误的子级 shadow/radius/blur，再保留原生分割线。
- 组合组件的最终覆盖必须放在通用子组件视觉规则之后，并用专项测试锁定书写顺序和计算样式。

验证与遗留风险：

- 验证：`2026-07-20 node scripts/test-indexes.js：通过`
- 验证：`2026-07-20 npm run feedback:generate && npm run feedback:check：通过，190 条记录`
- 验证：`2026-07-20 npm run site:build、npm run check、npm run pack:check、npm run example:install：通过`
- 验证：`2026-07-20 微信 CLI build-npm：touristappid 不存在，code 10；未生成或伪造 miniprogram_npm。`
- 真机/兼容风险：微信真机仍需用合法 AppID 复核 scroll-view 样式隔离、1rpx 分割线、阴影裁切、触摸惯性和系统低动效；本次不修改原生产物。
- 真机/兼容风险：本轮浏览器可见 393px PreviewDevice 内部无横向溢出；最终 390px 真实手机浏览器外层布局仍应在下一次设备验收时保留复核。

## PUI-FB-0191 · 标准组件页缺少逐路由预览滚动容器覆盖门禁

- 原始记录：`feedback/records/pui-fb-0191-preview-device-route-scroll-coverage.json`
- 范围：`global` / `preview-site`、`preview-device`、`all-components`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-20
- 用户目标：每个组件概览的预览区都必须留在稳定、真实可滚动的容器内，不能因为某个路由的特殊渲染而落回页面滚动、空白画布或静态假预览。
- 实际问题：当前实现已通过同一 renderStage 回退路径正确挂载共享 viewport，但缺少按目录路由数量锁定的专项门禁；未来若增加私有分支，单个函数或 CSS 测试不足以暴露覆盖缺口。
- 决策：为共享 PreviewDevice viewport 添加 `data-preview-scroll-contract=component-preview` 标记；以目录作为唯一覆盖源，锁定 85 个标准组件概览必须落入该 viewport，且只有文档、未发布 Chart 与 Icon 资源库可以退出设备预览。
- 理由：运行时标记让浏览器与自动测试能读取同一真实滚动边界；目录覆盖把未来新增路由纳入门禁，避免通过组件私有 padding、页面滚动或第二个容器掩盖问题。

AI 必须遵守：

- 新增或迁移标准组件路由时，不得创建绕过 data-preview-scroll-contract=component-preview 的私有预览壳或页面级滚动路径。
- 先区分组件自身 scroll-view 与 PreviewDevice viewport：前者服从组件 height/slot 合同，后者固定负责 622px 设备内的预览滚动。
- 目录中的文档、未发布能力说明和资源库可以不用设备预览，但必须是显式例外，不能以空白或静态假 UI 冒充组件概览。
- 验证预览滚动时读取真实 overflow、clientHeight、scrollHeight 与 scrollTop；不要只凭 Props、截图裁切或状态文案判断。

验证与遗留风险：

- 验证：`node scripts/test-preview-overview-hierarchy.js`
- 验证：`node scripts/test-scroll-area.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project _example`
- 真机/兼容风险：本轮只强化 H5 预览基础设施门禁；微信真机仍需用合法 AppID 检查消费者页面嵌套 scroll-view 的惯性、手势竞争、样式隔离和读屏。
- 真机/兼容风险：ScrollArea 的默认 320rpx、目标定位和 enhanced 行为未修改，仍需按其组件合同在真机复核。
- 真机/兼容风险：本轮微信 CLI 虽以外层 exit 0 返回，但输出的 AppID 权限步骤为 code 10；没有生成 miniprogram_npm，需提供合法 AppID 后重跑。

## PUI-FB-0192 · 官网组件目录缺少稳定的反馈序号

- 原始记录：`feedback/records/pui-fb-0192-preview-catalog-feedback-ordinal.json`
- 范围：`global` / `preview-site`、`sidebar`、`all-components`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-20
- 用户目标：在临时审计期间为左侧目录的每个组件提供稳定、易引用的序号，方便用户精确反馈问题。
- 实际问题：旧 H5 目录没有反馈序号，用户只能描述组件名称和所属分类，长目录中的定位成本较高。
- 决策：反馈审计期间，renderGroups 从完整 allItems 生成两位起始的 feedbackOrdinalById，并在既有目录 PUI Button 的 Slot 前显示该值、以 data-catalog-order 暴露给审计工具。筛选不改变 Map；该标识仅属 H5 目录，审计结束后可整体移除这一个渲染片段、样式和对应测试断言。
- 理由：以目录唯一源生成编号可让用户用“08 Button”精确指代问题，同时不改变已有组件名称、分类、URL 或小程序公开能力。复用 Button Slot 保持点击、焦点、状态 Badge 和主题样式的单一语义边界。

AI 必须遵守：

- 反馈序号必须读取完整 metadata 目录顺序，禁止按当前筛选结果或当前组内顺序重新编号。
- 序号不得进入组件显示名称、路由、搜索语料、WXML 示例或小程序 API。
- 目录项继续组合 PUI Button 和 PUI Badge；禁止新增原生按钮、状态 Badge 或私有外层面板。
- 编号使用现有字体、颜色和间距 Token，并验证 390px、深浅色和无横向溢出。
- 这是临时反馈辅助；审计结束时应连同渲染、样式、测试和本记录的状态一并评估移除。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：该编号只属于 H5 官网目录，不修改小程序 Sidebar、WXML 或消费者 API。
- 真机/兼容风险：微信开发者工具 CLI 因 touristappid 权限返回 code 10，示例 miniprogram_npm 未生成；提供合法 AppID 后仍需复跑。

## PUI-FB-0193 · 全局阴影把条目、透明布局根和展示叶子误提升为浮层

- 原始记录：`feedback/records/pui-fb-0193-non-elevated-component-shadow-semantics.json`
- 范围：`global` / `preview-site`、`config-provider`、`cell`、`avatar`、`tag`、`progress`、`field`、`empty`、`result`、`grid`、`steps`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-20
- 用户目标：所有组件在全局阴影开启后仍保留正确的信息层级，Cell 等连续条目和展示叶子不能变成并列悬浮卡片。
- 实际问题：H5 的通用预览样式把视觉开关理解成所有组件都要加阴影，造成连续条目卡片化、展示叶子悬浮化，并与小程序 WXSS 和已有语义合同漂移。
- 决策：删除已确认的 Cell、Avatar、Tag、Progress 外投影来源，并增加置于最终级联位置的非 elevation 规则，统一保护 Cell、Field、Empty、Result、Grid、Steps、Avatar、Progress、Badge、Icon、Divider 与 Skeleton；Tag 保留 inset outline/highlight，Cell selected 与 Grid bordered 保留 inset 边界。Avatar 原生 WXSS 同步为无外投影。
- 理由：这让阴影恢复为层级信号，而不是通用装饰；保留 inset 状态边界可维持选中、聚焦和分隔信息，不会削弱可读性或交互状态。

AI 必须遵守：

- 先判断组件是否脱离内容流；只有独立 Card、浮层、集合根等 Surface 才可拥有外投影。
- Cell、Field、Empty、Result、Grid、Steps、Avatar、Tag、Badge、Icon、Progress、Skeleton 的外投影必须在原生和 H5 同时禁止。
- selected/focus/divider 的 inset outline 不属于 elevation；禁止用移除状态边界来修复阴影问题。
- 全局视觉选择器每次扩展前都必须经过组件语义合同和专项回归测试。

验证与遗留风险：

- 验证：`2026-07-20：专项 `test-non-elevated-shadow-semantics` 与 Avatar、Cell、Tag、Progress、Field、Empty、Result、Grid、Steps 测试通过。`
- 验证：`2026-07-20：`npm run feedback:generate && npm run feedback:check`、`npm run site:build`、完整 `npm run check`、`npm run example:install` 与 `npm run pack:check` 通过；打包干跑为 554 files、324.4 kB。`
- 验证：`2026-07-20：源码 `avatar/{js,json,wxml,wxss}` 与 `miniprogram_dist`、示例已安装 tarball 的对应四件套逐字节一致。`
- 验证：`2026-07-20：微信开发者工具 CLI 已实际启动 IDE server，但示例 `touristappid` 在权限阶段报 code 10；未生成也未伪造 `miniprogram_npm`。`
- 真机/兼容风险：微信真机仍需以合法 AppID 复核 rpx 边界、样式隔离、列表/横向 scroll-view 手势、图片回退、系统低动效与辅助技术；H5 不能替代该证据。

## PUI-FB-0195 · AspectRatio 概览泄漏 clipped content 诊断且圆角类名没有镜像 WXSS

- 原始记录：`feedback/records/pui-fb-0195-aspect-ratio-preview-diagnostic-leak.json`
- 范围：`component` / `aspect-ratio`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-20
- 用户目标：组件概览应只呈现用户可以理解的真实能力，不保留 clipped content 等实现诊断；H5 圆角与小程序 WXSS 保持一致。
- 实际问题：旧预览显示 `clipped content`，并因 CSS 类名不匹配丢失了默认圆角，造成概览信息层级和跨端视觉漂移。
- 决策：删除诊断 badge，将 Slot 演示改为用户可理解的媒体内容；修正 H5 四档 radius class 与真实 WXSS 映射，新增专属合同和测试。组件继续保留为跨基础库稳定比例占位能力，是否退役需用户明确授权后执行完整破坏性 API 移除。
- 理由：该组件在小程序端以百分比占位解决浏览器 CSS 不可假定的场景，仍有明确的媒体/封面 Slot 用途；先修复实际预览错误，不把一次用户疑问静默扩大为 API 删除。

AI 必须遵守：

- 只要裁切属于布局策略，就不得把 clipped/slot 等实现词写进默认概览。
- H5 生成的 class 与 CSS 选择器必须一一对应，并用专项测试锁定每个公开枚举值。
- 布局根不承担外阴影、业务状态或静态假成功。
- 删除公开组件属于破坏性 API 变更；用户只提出考虑时先完成审计和修复，再等待明确授权。

验证与遗留风险：

- 验证：`node scripts/test-aspect-ratio.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信 CLI 已实际启动 IDE 服务，但示例 `touristappid` 权限查询返回 code 10，未生成且未手工伪造 `miniprogram_npm`。合法 AppID 真机仍需验证 WXSS 百分比占位、overflow、Slot 投影和样式隔离；H5 无法证明不同基础库的相关行为。

## PUI-FB-0196 · H5 Button 镜像漏入完整变体合同并使组合阴影被后续 Surface 覆盖

- 原始记录：`feedback/records/pui-fb-0196-preview-button-elevation-boundary.json`
- 范围：`global` / `preview-site`、`preview-device`、`button`、`direction`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-20
- 用户目标：全部组件的预览必须处于一致的滚动预览区域，真实组件阴影完整可见，不能再因父容器或后续内容覆盖而被截断。
- 实际问题：Direction 中基础 Button 的外投影在到达真实 PreviewDevice 安全区前就被后续不透明 Cell 覆盖；同时 H5 helper 的调用点差异让同一 Button variant 在不同组件预览中得到不一致的阴影计算结果。
- 决策：共享 H5 Button helper 现在默认进入完整 `pui-button-preview` 合同，仅允许已审计组件自有交互根显式退出；Direction 根/slot/方法区恢复透明、无裁切布局，Button 行采用 `pui-preview-elevation-clearance` 预留 `--pui-preview-shadow-bleed`。新增全局专项合同测试，并把规则同步至全局、Button、Direction 与 H5 兼容文档。
- 理由：完整镜像应该是 PUI Button 的默认路径，不能由每个组合调用者记住私有参数。共享 Token 化安全空间既保留基础 Button 的真实层级，也不把 Cell 等连续条目错误改成有阴影的卡片。

AI 必须遵守：

- 任何 `buttonSample` 调用默认进入 `pui-button-preview`；只有已审计的组件自有交互根可显式 `previewContract:false`。
- 不要为修复裁切删除原生应有的 base Button 阴影，也不要把 Cell、Field、Empty 等非 elevation 组件加上外阴影。
- 透明组合根中基础 Button 后接不透明 sibling 时，保持 overflow visible 并使用 `pui-preview-elevation-clearance` 的共享 shadow-bleed Token。
- 每次触及预览基础设施后都要逐路由检查唯一内部 scroll viewport、390px 横向溢出和深浅色/外观开关下的计算样式。

验证与遗留风险：

- 验证：`2026-07-20：Button、Direction、Preview shadow boundary 与 PreviewDevice infrastructure 专项合同测试通过。`
- 验证：`2026-07-20：`npm run feedback:generate && npm run feedback:check`、`npm run site:build`、完整 `npm run check`、`npm run example:install` 与 `npm run pack:check` 通过；打包干跑为 554 files、325.4 kB。`
- 验证：`2026-07-20：微信 CLI `build-npm --project _example` 已实际启动 IDE server，但 `touristappid` 被权限查询拒绝为不存在的 AppID（code 10）；未生成且未手工伪造 `miniprogram_npm`。`
- 真机/兼容风险：合法 AppID 真机仍需复核 Button 的 rpx 外投影、样式隔离、方向性字体与系统低动效；H5 浏览器不能替代微信渲染证据。

## PUI-FB-0198 · Image H5 代码分区缺失且资源失败停留在加载态

- 原始记录：`feedback/records/pui-fb-0198-image-preview-code-and-resource-lifecycle.json`
- 范围：`component` / `image`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-20
- 用户目标：逐组件 battle 时，Image 的代码区应提供可筛选的真实用法示例，H5 预览必须反映真实图片资源状态，不能用提示文案伪造交互。
- 实际问题：旧代码正文只暴露引用 JSON 与基础 WXML，遗漏三个实际展示分区；H5 `<img>` 没有 load/error 监听，初始化带 src 的节点固定推断为 loading，真实失败资源没有进入 error。
- 决策：新增从 `makeUsageCode` 提取 WXML 的 Image 示例源，正文固定显示组件引用、基础、加载与失败、裁切模式、形状与覆盖内容五段；每段沿用 `previewCodeBlockSample` 的 PUI Copy IconButton。H5 Image 直接监听 img load/error，并以 complete/naturalWidth 处理缓存资源，统一更新可见状态和 aria-busy。
- 理由：这样代码与实际预览、属性默认值和复制内容同源，同时真实响应浏览器资源结果；没有扩张小程序公开 API、增加伪事件或加入状态切换按钮。

AI 必须遵守：

- 为概览补代码时，必须从同一份 WXML 生成器生成，不能另写第二份演示字符串。
- 图片、音视频等资源镜像必须处理真实成功、失败和缓存完成；不能只从初始 Props 推断永久 loading。
- 基础用法保持最小并不绑定事件；事件只进入 API 或专门事件示例。
- 复制结果必须来自真实剪贴板调用，自动化环境拿不到剪贴板时记录未验证，不能声称复制成功。

验证与遗留风险：

- 验证：`2026-07-20：`node --check preview/app.js`、`node scripts/test-image.js`、`node scripts/test-preview-normal-code-card.js`、`npm run feedback:generate && npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install` 全部通过。npm pack dry-run 为 554 files、325.4 kB、shasum cceed4d9f9f3216effeafe6b94e6e9ac898b124f。`
- 验证：`2026-07-20：微信 CLI `build-npm --project _example` 实际启动 IDE 服务，但示例 `touristappid` 权限查询返回不存在 AppID（code 10）；未生成且未手工伪造 `miniprogram_npm`。`
- 验证：`2026-07-20：Image JS/JSON/WXML/WXSS 在源码、miniprogram_dist、示例 tarball 安装中逐字节一致，SHA256 依次为 b882fda02e09c3b2eaba6f539000ea7a54408be5b1662937bedcb5bb0cdbb9db、2741d6a65c81b666a0c2bfc000aad91619246893407874def343126b9a8b99ca、9550722a3be250b44ab0c9ad18000de449b799228fbad9087a09fca3574b3644、eb470fd3a6138589b0e55849bc53bdb95781ca6f552b2e93b11bcab0422c85de。`
- 真机/兼容风险：合法 AppID 真机仍需核验微信图片域名、webp、lazy-load、widthFix/heightFix、rpx 抗锯齿、长按菜单、样式隔离、系统低动效与辅助技术。
- 真机/兼容风险：浏览器自动化环境没有暴露剪贴板读取权限；复制按钮走真实 Clipboard API / execCommand 结果，最终粘贴内容仍需在用户浏览器或真机手工确认。

## PUI-FB-0199 · ScrollArea 零高度被归一化为 1rpx/1px 并坍缩预览

- 原始记录：`feedback/records/pui-fb-0199-scroll-area-zero-height-contract.json`
- 范围：`component` / `scroll-area`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：逐组件 battle 必须验证受控与非受控边界；公开高度合同写明正数时，零值不能让真实 ScrollArea 变成不可用的极小区域。
- 实际问题：旧的两端归一化都使用 `Math.max(1, ...)` 接受零值，分别生成 `1rpx` 与 `1px`，形成没有错误提示但不可用的滚动区域。
- 决策：原生 `normalizeHeight` 与 H5 `scrollAreaPreviewHeight` 都先验证数值严格大于零；无效值统一走既有默认回退。删除未使用的 `.scroll-area-demo` Surface 样式，避免后来误把透明根重新渲染成第二层卡片。官网概览以显式 `height=1128rpx` 填满 shadow-safe 可用预览高度并演示较长 slot 内容，且从同一 Props 输出当前 WXML；公开组件默认仍为 320rpx。2026-07-22 的 gradientOverlay 扩展保持该透明定位根与唯一滚动视口：顶底遮罩为无交互同级层，不参与高度计算。
- 理由：严格按公开合同回退能让原生与 H5 对同一 Props 得到可用结果，不扩张 API、不引入伪状态或浏览器私有行为。

AI 必须遵守：

- 当 API 写明正数时，0 不是可接受边界，不能以 Math.max(1, ...) 偷偷改成极小可见尺寸。
- 每个 Props 的无效值回退必须由源码、H5、WXML 生成、文档与专项测试共同约束。
- 透明基础组件的遗留 Surface CSS 即使未被当前演示使用，也应删除或被测试阻止，不能留给后续回归重新激活。

验证与遗留风险：

- 验证：`2026-07-21：`node --check preview/app.js`、`node scripts/test-scroll-area.js`、`node scripts/test-preview-normal-code-card.js`、`PUI_VERIFY_DIST=1 node scripts/test-scroll-area.js`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`、`npm run feedback:generate`、`npm run feedback:check` 与 `git diff --check` 通过。`
- 验证：`2026-07-21：源码、`miniprogram_dist` 与 `_example/node_modules/poemui-miniprogram/miniprogram_dist` 的 ScrollArea JS/JSON/WXML/WXSS SHA256 逐项一致；微信 CLI `build-npm` 实启 IDE 后被 touristappid code 10 阻断，未生成 miniprogram_npm。`
- 验证：`2026-07-22：`node scripts/test-scroll-area.js`、`PUI_VERIFY_DIST=1 node scripts/test-scroll-area.js`、`npm run feedback:generate/check`（217 records）、`npm run site:build`、`npm run check`、`npm run example:install`、`npm run pack:check` 与 `git diff --check` 通过；微信 CLI `build-npm` 再次实际启动 IDE 后被 touristappid code 10 阻断，未生成或伪造 miniprogram_npm。`
- 验证：`2026-07-22：新增 gradient overlay 后重新通过 `node --check scroll-area/scroll-area.js`、`node --check preview/app.js`、`node scripts/test-scroll-area.js`、`PUI_VERIFY_DIST=1 node scripts/test-scroll-area.js`、`npm run feedback:generate/check`（222 records）、`npm run site:build`、完整 `npm run check`、`npm run example:install`、`npm run pack:check` 与 `git diff --check`；源码、dist、示例 npm 安装的四件套 SHA256 一致。`
- 真机/兼容风险：合法 AppID 真机仍需确认微信 scroll-view 对 rpx 小数、动态 Slot id、增强滚动、样式隔离、读屏、触摸惯性和系统低动效的实际表现。

## PUI-FB-0200 · Collapse 初始渲染时展开面板高度为 0 导致内容不可见

- 原始记录：`feedback/records/pui-fb-0200-collapse-height-initialization.json`
- 范围：`component` / `collapse`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-21
- 用户目标：Collapse 官网预览中，初始展开的面板应显示内容，而不是空白。
- 实际问题：初始渲染时，展开的面板 max-height 为 0，导致内容不可见，但 opacity 为 1。
- 决策：在 bindPreviewRuntime 中添加 collapse 分支，调用 syncCollapsePreviewHeights(true, props) 设置初始高度。
- 理由：syncCollapsePreviewHeights 已实现正确的高度计算逻辑，只需在组件挂载后调用即可。

AI 必须遵守：

- bindPreviewRuntime 必须为 collapse 调用 syncCollapsePreviewHeights(true, props)。
- syncCollapsePreviewHeights 使用 inner.scrollHeight 设置 max-height，initial 模式下禁用过渡。
- 高度设置必须在 DOM 挂载后执行，确保 scrollHeight 计算正确。

验证与遗留风险：

- 验证：`npm run precheck`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：H5 scrollHeight/px 与微信 SelectorQuery/rpx 的差异仍需真机确认。

## PUI-FB-0201 · 删除 ButtonGroup 组件

- 原始记录：`feedback/records/pui-fb-0201-button-group-removal.json`
- 范围：`component` / `button-group`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-21
- 用户目标：移除无独立语义价值的 ButtonGroup，简化组件库。
- 实际问题：ButtonGroup 存在于源码、预览、文档和测试中，占用维护资源。
- 决策：彻底删除 ButtonGroup 组件，包括源码、预览、文档、测试和所有引用。
- 理由：ButtonGroup 不提供独立语义或交互，其布局功能可通过 Button 组合或 CSS 实现。删除简化组件库，减少维护成本。

AI 必须遵守：

- 删除组件前确认无其他组件依赖。
- 同步移除所有引用：源码、预览、文档、测试、构建脚本。
- 更新反馈记录和进度文档。
- 运行完整构建和测试确保无破坏。

验证与遗留风险：

- 验证：`npm run precheck`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：删除组件可能影响已有使用 ButtonGroup 的小程序代码，需在更新日志中说明。

## PUI-FB-0202 · 官网目录遗漏布局分区并把用户任务分类退化为旧源码分组

- 原始记录：`feedback/records/pui-fb-0202-preview-catalog-task-taxonomy.json`
- 范围：`global` / `preview-site`、`sidebar`、`metadata`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：官网组件目录应按清晰的用户任务重新分组，避免把布局能力混在开始页或数据展示里；高密度的输入相关能力应以“表单组件”呈现，并让用户按建表单时的自然任务找到组件。近义基础能力要相邻，Input 的组合形态要明确是变体而非另一个输入范式。
- 实际问题：旧分类遗漏布局、使用含混的基础和输入标题，并混用旧目录的直接注入与不完整的覆盖映射；同一用户任务的组件被拆到多个分区。布局修复后，输入相关的目录项仍仅按英文名平铺，Form、字段、文本、选择、日期和上传的职责边界不可见。基础组件的英文排序也会让原语顺序随来源漂移，旧输入组合层没有可见的父级关系。390px 的横向分区带只露出每组前几项，用户无法完整浏览分区。
- 决策：建立 navigationGroupByTaxonomyId 的完整映射，所有规范目录项先合并为单一 catalogNavigationItems 再按九个稳定分区过滤；基础和输入分别更名为基础组件、表单组件，布局作为独立分区。表单组件内由 metadata 的 sections 唯一派生结构与校验、文本与搜索、选择与数值三类可见子分区，不复制路由。当前 sourceGroups 是目录、发布清单和生成物的唯一源，不保留第二份历史目录；进度文档中混入已删能力的旧战报一并移除。2026-07-22 阶段 Spacing、Direction、AspectRatio、Grid、ScrollArea、Sticky 归布局；Spacing 的当前归属已由 PUI-FB-0263 更新为开始与规范，其余布局能力不变。目录、全局搜索与源码/产物清单收敛为当前规范入口与可安装组件。开始与规范按用户完成安装的顺序排列，基础组件采用显式原语顺序；表单条目按自然任务顺序排序。旧输入组合层以 variantOf=input 投影为 Input 变体，保留独立 route/packageId/previewId；侧栏、全局搜索和读屏名称均索引该父级关系。390px 目录改为单列纵向滚动，而非截断的横向组带。
- 理由：以组件职责而不是目录来源分组，用户可按“我要排版、导航、构建表单、展示或反馈”直接定位。表单不是单一输入控件：结构、文本、选择、日期与上传是用户完成一次填写任务的真实路径。单一映射也让侧栏、全局搜索、路由与反馈编号共享同一事实源。

AI 必须遵守：

- 新增目录入口前先在 navigationGroupByTaxonomyId 写入唯一任务分区；不得再建立第二份目录源或依赖隐式默认落点。
- 每个规范公开入口只能保留一条目录行，不得为同一能力再建立第二个名称或入口。
- Spacing 的当前归属以 PUI-FB-0263 为准：属于开始与规范；Direction、AspectRatio、Grid、ScrollArea、Sticky 继续属于布局。
- 开始与规范只放安装、Provider、Token 和规范文档；表单组件只放输入、选择、筛选、提交与上传，并按结构与校验、文本与搜索、选择与数值展示。
- 每次目录重组后必须验证九组都非空、规范路由唯一、搜索含分区名、反馈序号对筛选稳定，以及 390px 的目录可以纵向浏览且无页面级横向溢出。
- 基础组件可用显式原语顺序替代纯英文排序；顺序变更必须同步侧栏、全局搜索与专项测试。
- 组件保留独立路由和 API 但属于另一组件的扩展时，用 metadata.variantOf 表达关系；侧栏、全局搜索与读屏名称要一起呈现和索引该关系，不能再建第二条公开入口。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`node scripts/test-preview-navigation-search.js`
- 验证：`node scripts/test-component-catalog-pruning.js`
- 验证：`node scripts/test-preview-overview-hierarchy.js`
- 验证：`node scripts/test-design-contracts.js`
- 验证：`node scripts/test-preview-infrastructure-composition.js`
- 真机/兼容风险：本次只变更官网目录信息架构，不修改保留小程序组件的 API。
- 真机/兼容风险：微信 CLI 已实启，但示例 `touristappid` 被平台以 code 10 拒绝，未生成也未伪造 miniprogram_npm；目标微信基础库的目录展示与示例解析仍需合法 AppID 真机复核。

## PUI-FB-0203 · Dialog H5 预览遗漏运行时注册而停在透明入场态

- 原始记录：`feedback/records/pui-fb-0203-dialog-h5-runtime-registration.json`
- 范围：`component` / `dialog`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：Dialog 官网预览必须能真实打开、关闭和操作，不能显示不可交互的透明占位层。
- 实际问题：`bindPreviewRuntime()` 未分发 dialog，导致 `bindDialogPreviewRuntime()` 从未执行，状态机一直停留在透明 entering 层。
- 决策：在共享运行时分发表显式注册 Dialog runtime，并增加专项回归断言和 H5 合同说明。
- 理由：状态机渲染与运行时绑定必须成对存在；仅让首帧挂载节点会形成不可见、不可用的伪交互。

AI 必须遵守：

- 新增 H5 runtime helper 时，在同一改动中把 previewId 分发分支和专项静态断言一并补齐。
- 浮层验收必须在动画完成后读取 phase、aria-hidden、opacity、pointer-events 和真实空白区点击结果。
- 不要用默认 opacity=1 或静态可见来掩盖缺失的状态机绑定。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只修 H5 运行时；微信 Popup 遮罩、触摸穿透、安全区、Slot 投影、读屏和系统低动效仍需合法 AppID 真机复核。

## PUI-FB-0204 · Dialog H5 预览把流式触发内容贴到设备边缘

- 原始记录：`feedback/records/pui-fb-0204-dialog-preview-safety-spacing.json`
- 范围：`component` / `dialog`、`preview-site`、`preview-device`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：Dialog 官网预览既要保持真实全屏遮罩，也要让触发内容和浮层在 PreviewDevice 内有一致、可读的安全间距。
- 实际问题：`.pui-dialog-showcase` 同时承担流式内容与绝对浮层舞台，预览根 edge-to-edge 后没有单独的内容安全区；`.pui-dialog-layer` 误用了 8px content gap。
- 决策：拆出透明 `pui-dialog-showcase__content` 承担流式分区的 14px 内距与 18px 间距，stage 保持全屏；Dialog layer 也使用 14px 安全内距。
- 理由：这样既不会裁掉或缩小真实遮罩，又能让默认阅读和触发路径遵循 PreviewDevice 的可读性间距。

AI 必须遵守：

- 不要把全屏遮罩层的 edge-to-edge 规则扩展到触发内容或说明分区。
- 浮层 Preview 同时有流内容和绝对层时，拆出透明 content layer 与 full-viewport stage，分别验证。
- Panel 进入 PreviewDevice 裁切边界时，使用共享 panel inset，不要以 8px 紧密内容 gap 代替安全边距。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project "/Users/fanx/Documents/poemUI 小程序组件库/_example"`
- 真机/兼容风险：微信 CLI 已实启，但示例 `touristappid` 被平台以 code 10 拒绝，未生成也未伪造 miniprogram_npm。合法 AppID 真机仍需复核 Popup 遮罩、安全区、触摸穿透、Slot 投影、读屏和系统低动效。

## PUI-FB-0206 · 官网品牌缺少 Poem 语义且退化为无内容色块

- 原始记录：`feedback/records/pui-fb-0206-moonlit-stanza-brand-mark.json`
- 范围：`global` / `preview-site`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：官网 Logo 应体现 Poem 的诗意，同时保持 PoemUI 组件系统的克制与可读性，不能只是无内容色块或常见组件拼图。
- 实际问题：旧 Topbar 品牌标记没有图形语义，且历史样式存在渐变与投影版本，无法表达 PoemUI 的品牌定位。
- 决策：采用“月下成行”作为唯一官网品牌标记，并将月牙精修为 5.35/6.08 偏移双弧：月牙表示诗句停顿，三条不等长 2.15 圆线表示诗行、节奏与留白；诗行整体下移，使月牙下缘与首行至少相距 1 个 viewBox 单位。Topbar 文案固定为“月下成行 · 原生小程序组件库”；网站使用同构的 SVG favicon，并保留同图形的多尺寸 ICO 回退。
- 理由：双弧让月牙的外缘饱满、内缘更轻、端点自然收尖；额外留白让“月在上、行在下”的阅读次序在 18px 图形内仍清楚。构形继续表达 Poem 的意象与 UI 的精确节奏，不依赖书本、羽毛笔或抽象组件拼图，平面黑白可直接遵循现有深浅色 Token。

AI 必须遵守：

- 品牌标记必须保持平面黑白并消费 --brand/--page，禁止渐变、外阴影、玻璃和 3D 装饰。
- 月牙必须保持偏移双弧、收尖端点以及与首行至少 1 个 viewBox 单位的留白；不能把它画回沉重色块或贴住诗行。
- 品牌副标题使用“月下成行 · 原生小程序组件库”；移动端可隐藏副标题但必须保留品牌名称与完整可访问名称。
- 品牌 SVG 不进入 pui-icon manifest；所有业务操作继续组合 PUI Button 与 PUI Icon。
- 改动品牌几何、文案或 Topbar 布局时必须验证 desktop、390px、light/dark 和全局外观偏好。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`node scripts/test-design-contracts.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：该变更仅影响官网；微信小程序原生图标、AppID 入口图标和系统图标裁切尚未接入或在真机验证。
- 真机/兼容风险：2026-07-23 已实际执行微信开发者工具 build-npm，但示例工程使用 touristappid，IDE 返回 code 10（不存在此 AppID）；因此未生成或伪造 miniprogram_npm，需换用有效 AppID 后重跑。

## PUI-FB-0207 · Input 收口前置短文本组合能力

- 原始记录：`feedback/records/pui-fb-0207-input-composition-consolidation.json`
- 范围：`component` / `input`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：输入相关能力应在一个真实组件合同中完成，不能只在目录中标成变体。
- 实际问题：原有组合层是重复组件，导致目录、API、预览与安装产物多出一份维护面。
- 决策：由 Input 吸收 prefix 属性和 Slot，并彻底移除重复组合包及其路由、文档、示例、测试和安装清单。
- 理由：将一个输入字段的结构、值和事件收口到同一组件，减少重复 API 与维护面。

AI 必须遵守：

- 合并前先验证目标组件能在 JS、WXML、WXSS、H5、API 和示例中承载该能力。
- 删除时同步清理发布入口、文档、测试、示例和生成产物。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：既有消费者若导入已移除包，需要改为 pui-input 的 prefix 或 prefix Slot。

## PUI-FB-0208 · 收口独立反馈队列入口

- 原始记录：`feedback/records/pui-fb-0208-feedback-queue-removal.json`
- 范围：`global` / `toast`、`metadata`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：删除低价值组件，避免发布目录保留不需要的内容。
- 实际问题：源码、预览、元数据、生成脚本、示例、测试和安装产物均曾包含该入口。
- 决策：删除独立队列组件的源码、路由、预览、文档、示例、测试与生成器注册。
- 理由：保持组件目录聚焦，避免保留用户已明确排除的能力。

AI 必须遵守：

- 删除组件时覆盖源码、目录、预览、文档、示例、测试、生成器与安装产物。
- 不得用静态占位或假兼容替代删除。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：既有消费者若导入已移除包，需要在应用层重新选择反馈编排方式。
- 真机/兼容风险：微信 CLI 因 touristappid code 10 未能生成 miniprogram_npm，需合法 AppID 真机复核。

## PUI-FB-0209 · 表单选择与数值统一任务分区并重排目录序号

- 原始记录：`feedback/records/pui-fb-0209-form-selection-task-order.json`
- 范围：`global` / `preview-site`、`metadata`、`form`、`calendar`、`date-time-picker`、`upload`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：选择、数值、日期时间和附件入口都应在表单组件的同一任务分区内，并按用户完成表单的自然顺序重新编号，避免旧编号和源码排序继续误导筛选。
- 实际问题：日期时间和附件仍有独立子分区，选择类能力在视觉和搜索上被人为拆散；旧目录序号随来源或英文排序变化，无法按表单自然路径阅读。
- 决策：由 metadata 的表单 sections 和 navigationOrderByGroupKey 共同生成三类子分区及任务序号；日期、时间和附件作为选择与数值的后续步骤排列，不复制任何路由。
- 理由：用户先构造字段，再输入文本，随后选择或填写数值，日期、时间和附件是同一填写流程的变体；连续序号能让官网目录和反馈记录保持可追踪。

AI 必须遵守：

- 新增表单组件先决定其唯一用户任务分区，再写入 navigationSectionsByGroupKey。
- 调整任务顺序必须同时更新 navigationOrderByGroupKey、专项合同测试和进度文档。
- 反馈序号只能由完整 metadata 顺序派生，禁止手写或沿用旧编号。
- 同一组件只保留一条目录路由，不用别名制造第二个分区入口。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 CLI build-npm 仍需合法 AppID；官网目录验证不能替代微信真机目录展示与示例解析。

## PUI-FB-0210 · Popup 三段结构与主要动作 Slot

- 原始记录：`feedback/records/pui-fb-0210-popup-three-region-structure.json`
- 范围：`component` / `popup`、`button`、`cell`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：Popup 需要有清晰的 Header、Content、Footer 结构，Header 左右是圆形图标按钮，中间标题居中，Footer 承载主要动作按钮，用户能够直接理解并组合真实业务内容。
- 实际问题：Popup 只提供 default/content/close-btn 三个 Slot，关闭按钮绝对定位，预览中的 Header/Footer 选择器没有对应真实结构；关闭态只有底部单入口，无法从同一预览直接验证其他 placement 的实际弹出结果。
- 决策：保留 Popup 的基础显隐、遮罩、位置和滚动职责，新增可选 Header/Content/Footer 结构。标题由 title/subtitle 提供，左侧动作由 header-left Slot 提供，右侧继续沿用 closeBtn/close-btn，主要动作仅由 footer Slot 内的真实 PUI Button 提供；统一采用 Surface 单层、三列 Header、唯一 Content 滚动区、Footer 主动作和 PUI spacing Token 的 UI 逻辑。H5 五向入口改为同一 showcase 内的持久底层，Popup host 以 absolute inset 覆盖该层，不再用互斥页面分支替换入口。
- 理由：结构能力能解决用户的布局与可读性问题，同时不把提交、加载、错误或业务成功伪装成 Popup 根级状态；footer action 的业务闭环仍归消费者。Header/Content/Footer 的内距和 gap 直接消费现有 PUI Token，Button、Cell、Icon 等优先复用自有组件，避免官网与小程序出现第二套几何。持久底层保留用户打开前后的空间语境，且不影响遮罩阻止其下层交互。

AI 必须遵守：

- Header 固定三列，左右轨道等宽，中间标题保持几何居中；左右按钮顶部对齐。
- 左侧主要执行图标按钮使用 primary/base，右侧 close 使用 default/base 灰色底，不能用透明 text 按钮替代。
- Popup placement 默认 bottom，同时支持 top/bottom/left/right/center 五向。
- H5 关闭态入口必须利用设备空间：顶部、左侧、居中、右侧、底部五个 PUI Button 分别写入对应 placement 后打开同一 Popup；不得只改提示文字或保留单一默认 bottom 入口。
- Content 是唯一滚动区域，Footer 不进入滚动区。
- 主要动作必须由 footer Slot 内真实 PUI Button 承担，Popup 不发布伪造 success。
- Popup Surface 使用 --pui-panel-padding，关联操作使用 --pui-content-gap，不建立私有 padding。
- H5 必须使用 buttonSample/cellSample 等共享镜像，原生 button 只保留遮罩或平台能力边界。
- 对照 TDesign 时保留其显隐、遮罩和定位边界，并明确记录 PoemUI 的结构扩展。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信真机仍需合法 AppID 验证 Header Slot 投影、Footer 内 Button 事件、fixed 位置、rpx 安全区、样式隔离和读屏表现。

## PUI-FB-0211 · 全局动效默认 500ms 与 1000ms 上限

- 原始记录：`feedback/records/pui-fb-0211-global-motion-duration-contract.json`
- 范围：`global` / `preview-site`、`popup`、`loading`、`swiper`、`direction`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：PoemUI 全部交互动效使用统一时长合同：默认 500ms，允许调用方调整但最长不超过 1000ms，同时保留低动效与业务计时的正确边界。
- 实际问题：修复前的全局规则、组件默认值、运行时 clamp、H5 fallback、API 范围与专项测试不是同一个时长合同，且旧规则仍把 400ms 当作上限。
- 决策：把 500ms 设为 PoemUI 交互动效统一默认值，把 1000ms 设为所有公开可调交互动效的硬上限；合法 0 保留为即时完成，非法值回退 500ms，低动效压缩为 1ms。所有组件源码、H5、API、专属合同和测试使用同一口径，业务停留/延迟/轮播/刷新计时不机械套用动效上限。
- 理由：默认值统一后，用户可以稳定感知组件节奏；1000ms 上限允许更慢的业务场景但避免交互长期阻塞；区分动效与功能计时可防止 Toast 提前消失、轮播过快或倒计时失真。

AI 必须遵守：

- 新增或修改交互动效时默认使用 500ms，公开范围只能是 0–1000ms。
- 运行时必须处理非法值与超上限值，不能只依赖属性面板的 min/max。
- reduceMotion 或系统低动效统一为 1ms，并保证完成态和生命周期仍执行。
- 退场节点必须保留至动效结束，不得用 display:none 或提前卸载制造瞬移。
- Toast 停留、Loading delay、Swiper interval、CountDown 刷新和 Watermark moveInterval 按业务合同保留。
- 合同变更必须同步源码、H5、API、专属合同、dist、示例安装与专项扫描。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project /Users/fanx/Documents/poemUI 小程序组件库/_example`
- 真机/兼容风险：微信 CLI 已真实执行，但项目使用 touristappid，开发者工具内部返回 code 10（不存在此 AppID），未生成或伪造 miniprogram_npm；仍需合法 AppID 在真机复核 500/1000ms 计时精度、系统 reduce motion、后台切换和动画结束回调顺序。

## PUI-FB-0212 · Popup 官网进退场因整段重绘丢失中间帧

- 原始记录：`feedback/records/pui-fb-0212-popup-h5-retained-node-motion.json`
- 范围：`component` / `popup`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：Popup 在官网预览中先显示全屏 Overlay，再让弹层从默认 bottom 方向真实升起；关闭时反向完成 500ms 动画后再卸载，不能瞬间跳到终态。
- 实际问题：旧官网运行时在阶段定时器和点击事件尾部调用 renderStage，以 stage.innerHTML 重建整棵预览树，CSS transition 的起点节点被销毁，500ms 配置只剩延迟卸载而不是真实可见动画。
- 决策：新增 Popup 局部 DOM 状态同步，只更新 active/phase class、data-popup-phase 与 aria-hidden；进入阶段不再重绘，离场等待实际 motion duration 后才卸载并重建关闭入口。
- 理由：CSS transition 只有在同一节点从起始样式切换到结束样式时才会产生中间帧；局部状态同步同时保留 Overlay 先挂载、面板 bottom 位移、滚动保护和父级显隐回写。

AI 必须遵守：

- 不得在浮层进入或离开的中间阶段调用会替换预览根 innerHTML 的整段 render。
- 验证动效不能只读 transition-duration，必须采样中间帧并核对节点身份。
- 进入时先挂载 Overlay 与起始位移 Surface，再在下一帧切换 entered；离开时先切 leaving，再按真实 duration 卸载。
- 点击事件分支完成局部生命周期处理后必须显式 return，避免落入通用重绘。
- 遮罩点击测试必须命中未被 Popup Surface 覆盖的真实可见区域。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project /Users/fanx/Documents/poemUI 小程序组件库/_example`
- 真机/兼容风险：本次修复位于官网 H5 预览运行时，不改变小程序 Popup 源码；微信 CLI 已真实执行但项目使用 touristappid，开发者工具内部返回 code 10（不存在此 AppID），未生成或伪造 miniprogram_npm。仍需合法 AppID 验证安装产物与真机动画时序，不能用 H5 结果替代真机结论。

## PUI-FB-0213 · Popup 需要明确区分卡片留白、贴边呈现与遮罩模糊

- 原始记录：`feedback/records/pui-fb-0213-popup-card-and-blur-overlay.json`
- 范围：`component` / `popup`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：Popup 默认保留当前左右留白的卡片布局，card=false 时去除外侧间距；blur-overlay=true 时遮罩必须呈现真实模糊。
- 实际问题：Popup 的五向定位规则写死了卡片 inset，公开 Props 和 H5 属性面板没有贴边选择；遮罩仅支持安全背景色，无法表达真实的遮罩模糊。
- 决策：公开 card:Boolean=true 与 blurOverlay:Boolean=false。card=false 将五向 Surface 贴合相应屏幕边缘；blurOverlay=true 仅为已渲染遮罩应用 --pui-popup-overlay-blur。元素选择 Inspector 中，Popup 打开操作公开 card/placement/showOverlay/blurOverlay，遮罩公开 blurOverlay，二者均走同一 Props 回写路径。
- 理由：默认完全保留既有观感，贴边不会破坏 Header/Content/Footer 的语义间距；独立遮罩 Token 使模糊可真实验证，并避免把显式 Popup 效果错误绑定到全局毛玻璃偏好。

AI 必须遵守：

- 新增 Popup card 视觉变体时，默认值必须保持当前发布布局，card=false 只移除外侧 inset，不可删 Content padding。
- blurOverlay 必须仅作用于 showOverlay=true 的完整遮罩，并以 backdrop-filter 计算样式验收，不能用半透明颜色或提示文字伪造。
- 五个 placement 都要有 card 与 edge 的明确几何规则，贴边角归零、非贴边角保留语义圆角。
- H5 Props 面板、WXML、API、合同和专项测试必须使用同一字段名与默认值。
- 元素选择 Inspector 的角色白名单不能因目标是触发器或遮罩而隐藏会直接改变该组件呈现的公开 Props；至少要对相应组件的打开操作和遮罩进行实测。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project /Users/fanx/Documents/poemUI 小程序组件库/_example`
- 真机/兼容风险：微信 WebView 对 backdrop-filter 的合成性能、fixed 遮罩、rpx 贴边圆角和安全区仍需合法 AppID 真机确认；touristappid 失败时不得手工伪造 miniprogram_npm。

## PUI-FB-0214 · Sheet 预览需要保留入口上下文并在同一节点完成底部动效

- 原始记录：`feedback/records/pui-fb-0214-sheet-retained-trigger-motion.json`
- 范围：`component` / `sheet`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：把 Popup battle 已确认的空间、上下文、Footer 和真实动效规则推广到全部组件，不再逐个手工指出同类缺陷。
- 实际问题：Sheet 使用 hidden/open 两个互斥 Showcase 返回分支，并将 Host 设计为可见底板；进入阶段和点击分支重建 Stage，导致入口上下文丢失且动效中间帧被吞掉。
- 决策：Sheet 改为恒存的底层 PUI Button 入口、条件挂载的透明 full-viewport Host 和真实 Sheet Surface；新增本地 DOM 阶段同步，进入在下一帧切换 active，离开只切 leaving 并在完整 duration 后卸载。事件分支显式 return，避免落入通用 Stage 重绘。
- 理由：它复用 Popup 已验证的浮层空间语义：上下文属于用户场景，遮罩是上层，Surface 是唯一可见浮层；稳定节点是 500ms 动效的必要条件。

AI 必须遵守：

- 浮层关闭态与打开态不得返回互斥的整块预览根；仅 Overlay/Surface layer 可以条件挂载。
- Host/Canvas/Stage 只承担定位、裁切或层级时必须透明、无边框、无圆角、无阴影；禁止额外可见底板。
- 进入阶段先挂载起始样式节点，再在下一帧切 active；离开先切 leaving，完整 duration 后才卸载。
- 浮层生命周期或 close/open/overlay/drag 事件分支必须显式 return，不能落入 renderStage 的 innerHTML 重建。
- 浏览器验收必须采样真实 opacity/transform 中间帧、入口保留、Host 计算样式、Footer 与底边关系和 390px 页面溢出。

验证与遗留风险：

- 验证：`node scripts/test-sheet.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改官网 H5 预览与合同，不改变 Sheet 小程序源码。合法 AppID 真机仍需复核 Popup 合成层、触摸拖拽、rpx 阈值、安全区、Slot 投影、系统低动效和读屏；不能以 H5 或 touristappid 结果替代。

## PUI-FB-0215 · Popover 官网镜像重绘节点导致动效瞬移

- 原始记录：`feedback/records/pui-fb-0215-popover-retained-node-motion.json`
- 范围：`component` / `popover`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：将 Popup battle 确定的真实状态预览与动效规则推广到全库官网组件。
- 实际问题：旧 H5 生命周期回调重绘 Stage，声明的 duration 没有稳定节点来呈现真实中间帧。
- 决策：使用 updatePopoverPreviewDom 原地切换 entering/entered/leaving，只有退场完成才重绘关闭态。
- 理由：与 Popup、Sheet 一致，CSS transition 需要稳定 DOM 身份。

AI 必须遵守：

- 阶段回调不可重绘 PreviewDevice。
- 进入/离开都要采样 opacity 或 transform 中间帧与锚点保留。

验证与遗留风险：

- 验证：`node scripts/test-popover.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改 H5；微信真机仍需验证 SelectorQuery、fixed、rpx、Slot 投影与触摸点击层。

## PUI-FB-0217 · 标准组件预览根未填满 PreviewDevice 可用全高

- 原始记录：`feedback/records/pui-fb-0217-preview-device-available-full-height.json`
- 范围：`global` / `preview-site`、`preview-device`、`all-components`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：所有标准组件页面的预览根必须填满统一 PreviewDevice 的内部全高，不能只让顶部内容占一小块、下方留下无意义空白。
- 实际问题：复验发现此前修复只写入 min-height=100%，但 shadow-safe Grid 仍以内容高度建立 auto 行；390px 下 Label 的 PreviewDevice viewport/layout 为620px/620px，直接预览根仅34px。现改为共享 Preview ScrollArea 的确定 minmax(0,1fr) 轨道，并让直接根固定 height=100%/min-height=0。
- 决策：保留固定 622px 的唯一 PreviewDevice、唯一内部 Preview ScrollArea、shadow-safe/edge-to-edge 父布局和中性设备 Surface。两类父布局以 minmax(0,1fr) 建立确定轨道，直接预览根固定 height=100%/min-height=0；shadow-safe 填满扣除四向安全内距后的564px内容高度，edge-to-edge 填满620px viewport。ScrollArea 概览显式使用 height=1128rpx（H5 564px），与当前效果 WXML 共用该非默认值。
- 理由：这样所有组件都在相同设备几何内占满自己的预览区域，同时不篡改组件自身公开高度合同，也不把组件局部滚动混入页面级滚动。

AI 必须遵守：

- 不得把组件预览根按内容自然高度留在 PreviewDevice 顶部；普通和屏幕附着布局都必须填满对应内部高度。
- 每个标准组件概览仍只能有一个 data-preview-scroll-contract=component-preview 的内部纵向滚动 viewport。
- shadow-safe 预览根填满扣除安全内距后的可用高度，edge-to-edge 预览根填满完整 viewport。
- 组件自身 scroll-view 的高度与 PreviewDevice 高度是两套语义，不能通过篡改组件公开 Props 来填满页面。

验证与遗留风险：

- 验证：`node scripts/test-preview-overview-hierarchy.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project _example`
- 真机/兼容风险：H5 的浏览器 viewport 测量不能替代微信真机中的嵌套 scroll-view 惯性、rpx 回流、样式隔离、辅助技术与系统低动效验证；2026-07-22 微信 CLI 因 touristappid code 10 未生成 miniprogram_npm，未以手工复制掩盖该失败。

## PUI-FB-0218 · ActionSheet 官网镜像重绘底部面板导致动效瞬移

- 原始记录：`feedback/records/pui-fb-0218-action-sheet-retained-node-motion.json`
- 范围：`component` / `action-sheet`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：将 Popup battle 确定的真实状态预览、空间与动效规则推广至全部官网组件。
- 实际问题：整段 Stage 重绘使 CSS transition 没有稳定的 DOM 身份。
- 决策：以 updateActionSheetPreviewDom 原地更新 phase、Surface 与 Overlay 的交互/ARIA，初始挂载和退场完成以外禁止重绘。
- 理由：全屏底部面板需要稳定节点才能真实呈现动效并保留用户触发上下文。

AI 必须遵守：

- ActionSheet 的 rAF、阶段计时和显隐事件不得重绘已挂载 canvas。
- 验收需采样打开和遮罩关闭中间帧、入口保留及 390px 溢出。

验证与遗留风险：

- 验证：`node scripts/test-action-sheet.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改 H5；合法 AppID 真机仍需验证安全区、swiper、触摸遮罩、rpx、Slot 和读屏。

## PUI-FB-0220 · DropdownMenu 官网镜像重绘菜单节点导致显隐动效瞬移

- 原始记录：`feedback/records/pui-fb-0220-dropdown-retained-node-motion.json`
- 范围：`component` / `dropdown-menu`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：将 Popup battle 确定的真实状态预览、空间与动效规则推广至全部官网组件。
- 实际问题：整段 Stage 重绘中断 CSS transition。
- 决策：已挂载菜单只原地更新 layer active、overlay disabled、panel/trigger ARIA；初次挂载和退场完成以外禁止重绘。
- 理由：菜单浮层依赖稳定 DOM 身份呈现真实中间帧。

AI 必须遵守：

- DropdownMenu entering/leaving 阶段不得重绘已挂载 layer/panel。
- 遮罩验收必须按实际可见区域点击并读取中间帧。

验证与遗留风险：

- 验证：`node scripts/test-dropdown-menu.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改 H5；合法 AppID 真机仍需验证原生多列结构、触摸遮罩、rpx、Slot、低动效与读屏。

## PUI-FB-0221 · Overlay 官网镜像重绘遮罩根导致显隐动效瞬移

- 原始记录：`feedback/records/pui-fb-0221-overlay-retained-node-motion.json`
- 范围：`component` / `overlay`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：将 Popup battle 确定的真实状态预览、空间与动效规则推广至全部官网组件。
- 实际问题：Stage 重绘中断 CSS transition。
- 决策：进入/离开只原地更新 root；初次挂载和退场完成以外禁止重绘。
- 理由：Overlay 是浮层系统的基础遮罩，稳定节点是所有上层组件连续动效的前提。

AI 必须遵守：

- 基础遮罩必须在同一 root 完成进入和离开。
- 浏览器验收采样实际点击后的 opacity 与 aria-hidden，不能只检查 data 属性。

验证与遗留风险：

- 验证：`node scripts/test-overlay.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改 H5；合法 AppID 真机仍需验证 fixed、胶囊/安全区、touchmove、rpx、Slot 和读屏。

## PUI-FB-0222 · Dialog 官网镜像在显隐阶段重绘 Layer 与 Scrim

- 原始记录：`feedback/records/pui-fb-0222-dialog-retained-node-motion.json`
- 范围：`component` / `dialog`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：将 Popup battle 确定的真实状态预览、空间与动效规则推广至全部官网组件。
- 实际问题：Stage 重绘中断 CSS transition。
- 决策：已挂载 Dialog 只更新 Layer/Scrim/Surface class 和 ARIA，初次挂载和退场完成以外禁止重绘。
- 理由：中心模态同样需要稳定 DOM 身份才能呈现真实中间帧并保持用户触发上下文。

AI 必须遵守：

- 模态进入和离开必须在同一 Layer 完成。
- 遮罩验证需使用实际可关闭场景而非默认 closeOnOverlayClick=false 场景。

验证与遗留风险：

- 验证：`node scripts/test-dialog.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改 H5；合法 AppID 真机仍需验证 Popup 依赖、fixed、安全区、Slot、焦点/读屏和低动效。

## PUI-FB-0223 · Skeleton 官网交叉淡入时长与运行时接线偏离真实组件

- 原始记录：`feedback/records/pui-fb-0223-skeleton-motion-duration-parity.json`
- 范围：`component` / `skeleton`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：将 Popup battle 确定的真实状态预览、空间与动效规则推广至全部官网组件。
- 实际问题：官网默认 180ms，且运行时未接线，点击后无法执行真实进退场。
- 决策：统一为默认 500ms、低动效 1ms，并在 bindPreviewRuntime 中分发 bindSkeletonPreviewRuntime。
- 理由：预览必须保留同一 DOM 节点，以真实时长完成可见状态转换。

AI 必须遵守：

- H5 与 WXML 的显隐中间帧采用同一默认与低动效时长。
- 每个阶段运行时必须接入 bindPreviewRuntime，并以真实点击验证计时实际运行。
- 已挂载 Skeleton 的进退场只切换 opacity/ARIA，完成后才允许卸载。

验证与遗留风险：

- 验证：`node scripts/test-skeleton.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改 H5；合法 AppID 真机仍需验证 rpx、动画合成、复杂默认 Slot、读屏和系统低动效。

## PUI-FB-0224 · NoticeBar 官网显隐和纵向轮播未保留真实节点

- 原始记录：`feedback/records/pui-fb-0224-notice-bar-retained-node-motion.json`
- 范围：`component` / `notice-bar`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：将 Popup battle 确定的真实状态预览、空间与动效规则推广至全部官网组件。
- 实际问题：官网时长偏短，初始进入计时未运行，纵向轮播重建整个 Stage。
- 决策：统一 500ms/1ms，初始和后续状态接入共享运行时，纵向轮播局部更新文本。
- 理由：公告显隐和纵向轮播都必须保留真实公告节点、ARIA 与用户触发上下文。

AI 必须遵守：

- H5 的显隐时长必须和真实组件同为默认 500ms、低动效 1ms。
- 已挂载 NoticeBar 的纵向轮播只更新文本和必要 ARIA，不得重建 Stage。
- 浏览器验证需实际通过属性面板写入 vertical 数组并等待完整 interval。

验证与遗留风险：

- 验证：`node scripts/test-notice-bar.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改 H5；合法 AppID 真机仍需验证 swiper interval、SelectorQuery 跑马测量、rpx、Slot 投影、读屏和系统低动效。

## PUI-FB-0225 · Switch 官网动效时长回退为 180ms

- 原始记录：`feedback/records/pui-fb-0225-switch-h5-motion-duration-regression.json`
- 范围：`component` / `switch`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：将 Popup battle 确定的真实状态预览、空间与动效规则推广至全部官网组件。
- 实际问题：官网默认 180ms，先于真实组件完成。
- 决策：统一 H5 时长为 500ms/1ms，并将合同测试和浏览器验收口径同步为 500ms。
- 理由：Switch 既有真实 transform 状态机必须与安装组件的视觉节奏一致。

AI 必须遵守：

- 源码、H5 与组件合同的默认和低动效时长必须一致。
- Switch 验收必须读取 thumb 的实际 transition-duration、transform 中间帧和完成态，不得只检查 checked class。
- 修改 Switch helper 后必须回归站点外观菜单与果味预设。

验证与遗留风险：

- 验证：`node scripts/test-switch.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改 H5；合法 AppID 真机仍需验证 rpx transform 合成、loading Icon、readonly/disabled、受控回写、读屏和系统低动效。

## PUI-FB-0226 · ScrollArea 需要主题安全的固定顶底渐变遮罩

- 原始记录：`feedback/records/pui-fb-0226-scroll-area-gradient-overlay.json`
- 范围：`component` / `scroll-area`、`preview-site`、`documentation`、`example`、`miniprogram-dist`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：为 ScrollArea 增加默认开启的顶底渐变遮罩，并让用户能够以公开 Prop 自定义遮罩颜色，同时保持真实滚动与跨端一致性。
- 实际问题：旧组件没有公开渐变能力；H5 与小程序都无法通过同一 Props 提供固定顶底阅读过渡。
- 决策：新增 `gradientOverlay:Boolean=true`（WXML `gradient-overlay`）与 `gradientOverlayColor:String=''`（WXML `gradient-overlay-color`）。空值或非法色回退当前 `--pui-bg-container`；顶底层为相对透明根内的 absolute sibling，固定尺寸使用跨端 Token，始终 pointer-events:none / aria-hidden。
- 理由：同级层不会随 Slot 滚动，也不会建立第二个滚动 viewport；主题 Token 使浅色自然为白、深色自然为深色容器，公开色值只允许可安全写入 inline style 的形式。

AI 必须遵守：

- 滚动遮罩固定为唯一真实视口的同级层，不能放进 Slot 或新建第二个滚动容器。
- 默认色跟随容器主题；自定义色先校验再写入跨端样式变量。
- 渐变层必须 pointer-events:none、aria-hidden，并以浏览器和真机分别验证。

验证与遗留风险：

- 验证：`node scripts/test-scroll-area.js`
- 验证：`PUI_VERIFY_DIST=1 node scripts/test-scroll-area.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：合法 AppID 真机仍需验证 enhanced scroll-view 中 absolute 渐变层的合成、触摸透传、rpx 尺寸、样式隔离、深浅色、Slot 读屏和滚动惯性；H5 不替代真机结论。

## PUI-FB-0227 · Grid 状态层运行时未接入官网预览分发

- 原始记录：`feedback/records/pui-fb-0227-grid-runtime-dispatch.json`
- 范围：`component` / `grid`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：将 Popup battle 确定的真实状态预览、空间与动效规则推广至全部官网组件。
- 实际问题：状态层运行时未接线，状态变更不能执行声明的局部切换。
- 决策：在共享分发器中调用 bindGridPreviewRuntime。
- 理由：保留节点状态组件必须让运行时实际参与渲染周期。

AI 必须遵守：

- 新增预览运行时后，静态测试必须同时断言定义和共享分发分支。
- 状态层需通过真实属性交互验证下一帧局部切换，不得只检查 helper 存在。
- 移动端属性分组默认折叠时，浏览器验收须先实际展开目标分组再判断控件命中。

验证与遗留风险：

- 验证：`node scripts/test-grid.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只改 H5；真机仍需验证 rpx 状态层、PUI Empty/Loading、横向 scroll-view、触摸与读屏。

## PUI-FB-0228 · 多个官网预览运行时未接入共享分发器

- 原始记录：`feedback/records/pui-fb-0228-preview-runtime-dispatch-coverage.json`
- 范围：`global` / `preview-site`、`collapsible`、`combobox`、`table`、`swiper`、`navigation-menu`、`direction`、`overlay`、`pull-refresh`、`grid`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-22
- 用户目标：将 Popup battle 确定的真实状态预览、空间与动效规则推广至全部官网组件。
- 实际问题：八个已定义运行时没有分发分支。
- 决策：统一接入分发器，并以独立 precheck 防止遗漏。
- 理由：阶段、手势和局部 DOM 更新只有在实际挂载后执行才是真实能力。

AI 必须遵守：

- 新增 bindXPreviewRuntime 时，必须在 bindPreviewRuntime 登记对应路由并由全局合同测试锁定。
- 共享分发门禁不能代替单组件的真实浏览器 battle。

验证与遗留风险：

- 验证：`node scripts/test-preview-runtime-dispatch.js`
- 验证：`npm run precheck`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本批只改 H5 分发；真机仍需按各组件复核手势、rpx、滚动、Slot、读屏与系统低动效。

## PUI-FB-0229 · Combobox 缺专属合同且概览暴露工程诊断

- 原始记录：`feedback/records/pui-fb-0229-combobox-overview-contract.json`
- 范围：`component` / `combobox`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的真实交互和可读性规则，自主审计并优化全库官网组件预览。
- 实际问题：概览将工程诊断混入用户预览，且组件没有专属合同，后续 Agent 缺少结构与跨端边界。
- 决策：移除概览工程诊断，保留可操作本体；新增 Combobox 专属合同并由专项测试锁定。
- 理由：用户预览需要清楚的真实路径，而工程调用和事件顺序仍应在 API、示例与自动化测试中可追溯。

AI 必须遵守：

- 建立缺失组件合同时必须先审计源码、H5、API、示例、测试和 Ledger，禁止批量空壳。
- Combobox 概览不得展示实例方法按钮、事件日志、运行时状态或实现标签。
- 受控回写、真实输入和选项交互必须保留，不能以移除诊断替代交互。

验证与遗留风险：

- 验证：`node scripts/test-combobox.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：未在合法 AppID 真机验证 scroll-view、rpx、selector query、Tag 关闭、Slot 投影、读屏与触摸/键盘差异。

## PUI-FB-0230 · NavigationMenu 缺少专属语义合同

- 原始记录：`feedback/records/pui-fb-0230-navigation-menu-semantic-contract.json`
- 范围：`component` / `navigation-menu`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的真实交互和可读性规则，自主审计并优化全库官网组件预览。
- 实际问题：NavigationMenu 已有源码和专项测试，但缺少长期语义合同。
- 决策：建立真实语义合同并接入专项测试。
- 理由：减少后续 Agent 把菜单、遮罩、导航或工程诊断误改为页面私有实现的风险。

AI 必须遵守：

- NavigationMenu 修改前必须同时审计树上限、五重受控、Layer、PUI Button/Cell 组合和导航 API。
- 官网概览的工程诊断由 component-only 归一化移除，不能重新作为用户内容。

验证与遗留风险：

- 验证：`node scripts/test-navigation-menu.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 真机/兼容风险：合法 AppID 真机仍需验证 fixed 遮罩、scroll-view、rpx、Slot、微信导航 API、触摸、读屏与低动效。

## PUI-FB-0231 · Select 缺少专属合同与专项回归测试

- 原始记录：`feedback/records/pui-fb-0231-select-contract-test-coverage.json`
- 范围：`component` / `select`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的真实交互和可读性规则，自主审计并优化全库官网组件预览。
- 实际问题：Select 只被全局检查间接覆盖，缺少自身合同和测试。
- 决策：建立 SELECT 合同和 test-select，并加入 site build 的 precheck。
- 理由：选择输入的值类型和回写路径需要组件级锁定。

AI 必须遵守：

- Select 修改前必须验证受控/非受控与0/false、禁用项及input到change顺序。
- H5 Select 选择只能经父级 value 回写，不能保留第二份最终值。

验证与遗留风险：

- 验证：`node scripts/test-select.js`
- 验证：`npm run precheck`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：合法 AppID 真机仍需验证 picker 系统面板、取消、rpx、读屏和主题。

## PUI-FB-0232 · InputOTP H5 适配路由跳过输入回写

- 原始记录：`feedback/records/pui-fb-0232-input-otp-h5-input-path-unverified.json`
- 范围：`component` / `input-otp`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的真实交互和可读性规则，自主审计并优化全库官网组件预览。
- 实际问题：分支被适配 ID 静默跳过，浏览器只改原生 input 临时值。
- 决策：统一通过 previewIdFor 判定，并保留真实 Props 回写。
- 理由：别名路由必须走同一组件行为，不能仅让可见 DOM 变化。

AI 必须遵守：

- InputOTP 的 input/keydown 分支不得直接比较 state.current。
- 验证码 H5 battle 必须实际验证单字符或粘贴、焦点和最终 value。

验证与遗留风险：

- 验证：`node scripts/test-input-otp.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 真机/兼容风险：合法 AppID 真机仍需验证微信输入、password、一次性验证码、粘贴、读屏和rpx。

## PUI-FB-0233 · Collapsible 缺少单区开合语义合同

- 原始记录：`feedback/records/pui-fb-0233-collapsible-semantic-contract.json`
- 范围：`component` / `collapsible`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的真实交互和可读性规则，自主审计并优化全库官网组件预览。
- 实际问题：缺少组件专属语义约束。
- 决策：建立 COLLAPSIBLE 合同并以专项测试锁定关键语义。
- 理由：避免单区与多面板 API、状态与动效边界漂移。

AI 必须遵守：

- Collapsible 修改前必须检查单 Trigger/Content、状态优先级和max-height transition。

验证与遗留风险：

- 验证：`node scripts/test-collapsible.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：合法AppID真机仍需验证selector query、rpx、Slot、读屏和低动效。

## PUI-FB-0234 · List 缺少双状态优先级专项合同

- 原始记录：`feedback/records/pui-fb-0234-list-semantic-contract.json`
- 范围：`component` / `list`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的真实交互和可读性规则，自主审计并优化全库官网组件预览。
- 实际问题：只有全局文档描述，没有组件级合同测试。
- 决策：建立 LIST 合同与专项测试。
- 理由：状态和Footer请求必须可独立回归。

AI 必须遵守：

- List 修改必须同时验证 error/loading/empty 与 error/loading/finished/ready。
- H5 Footer 不得用事件文本或定时器伪造追加成功。

验证与遗留风险：

- 验证：`node scripts/test-list.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：合法AppID真机仍需验证Slot、rpx、Cell触摸、Loading、Footer与读屏。

## PUI-FB-0235 · VirtualList H5 真实滚动未更新窗口

- 原始记录：`feedback/records/pui-fb-0235-virtual-list-scroll-runtime.json`
- 范围：`component` / `virtual-list`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的真实交互和可读性规则，自主审计并优化全库官网组件预览。
- 实际问题：存在 paintVirtualListWindow 但未绑定 viewport scroll，也未进入共享运行时分发。
- 决策：新增 bindVirtualListPreviewRuntime 并接入 bindPreviewRuntime。
- 理由：虚拟列表必须基于真实滚动窗口，不得仅显示静态首屏。

AI 必须遵守：

- VirtualList H5 必须由真实 viewport scroll 调用 paintVirtualListWindow。
- 新增预览运行时必须同时登记共享分发和专项测试。

验证与遗留风险：

- 验证：`node scripts/test-virtual-list.js`
- 验证：`node scripts/test-preview-runtime-dispatch.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：真机仍需验证scroll-view、rpx、触摸惯性、Slot、读屏和低动效。

## PUI-FB-0236 · Bubble H5 空白预览与语义合同缺口

- 原始记录：`feedback/records/pui-fb-0236-bubble-semantic-contract.json`
- 范围：`component` / `bubble`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的真实交互和可读性规则，自主审计并优化全库官网组件预览。
- 实际问题：跨组件私有 helper 遗留引用使渲染在进入 PreviewDevice 前中断。
- 决策：改用共享 previewMotionDuration 与独立 easing helper；建立 BUBBLE 合同并扩展专项测试。
- 理由：动效归一化是跨组件的共享能力，组件不得依赖另一个组件的私有预览函数。

AI 必须遵守：

- 新增或删除 H5 helper 后，必须真实打开所有调用路由并检查控制台错误。
- Bubble 修改前必须验证 content/text 优先级、受控展开、0/false Reaction 与真实 click/longpress。
- 概览只能保留消息组合和可见交互结果；工程方法、事件和阶段诊断不得进入实时 DOM。

验证与遗留风险：

- 验证：`node scripts/test-bubble.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run precheck`
- 真机/兼容风险：合法AppID真机仍需验证长按、selector query测量、rpx、Slot、读屏和系统低动效。

## PUI-FB-0237 · Alert H5 受控关闭绕过父级回写

- 原始记录：`feedback/records/pui-fb-0237-alert-controlled-visibility-preview.json`
- 范围：`component` / `alert`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的真实交互和可读性规则，自主审计并优化全库官网组件预览。
- 实际问题：H5 用第二份 demo visibility 覆盖受控 Props，且隐藏态操作断裂。
- 决策：建立 Alert 专属可见性解析、父级 Props 回写和隐藏恢复入口，并加入专项合同测试。
- 理由：避免预览将受控组件退化为无父级的局部静态状态。

AI 必须遵守：

- 有 visible/defaultVisible 的组件必须分别验证受控请求等待/父级回写与非受控初始化。
- 隐藏态必须保留可理解的真实恢复路径，退场节点在动效完成前不得卸载。

验证与遗留风险：

- 验证：`node scripts/test-alert.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run precheck`
- 真机/兼容风险：合法AppID真机仍需验证rpx、PUI Button事件、Slot、读屏与系统低动效。

## PUI-FB-0238 · ScrollArea 固定渐变遮罩缺少语义高度档位

- 原始记录：`feedback/records/pui-fb-0238-scroll-area-gradient-overlay-size.json`
- 范围：`component` / `scroll-area`、`preview-site`、`documentation`、`example`、`miniprogram-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：为 ScrollArea 顶底渐变遮罩提供 sm、md、lg 三个可验证的高度档位，并保持既有默认视觉、真实滚动和跨端一致性。
- 实际问题：已公开 gradientOverlaySize，并在小程序与 H5 共同限制为 sm、md、lg。默认 md 实测保留既有 64rpx / 32px；sm 与 lg 分别映射 40rpx / 20px、88rpx / 44px，非法值回退 md。
- 决策：新增 gradientOverlaySize:String='md'（WXML gradient-overlay-size），规定 sm=40rpx/20px、md=64rpx/32px、lg=88rpx/44px；原生与 H5 共同校验枚举，非法值回退 md。
- 理由：离散语义档位让调用方可表达阅读过渡强度，又不会引入任意数值、第二套间距体系或滚动 API 扩张；默认 md 保持既有视觉，降低升级风险。

AI 必须遵守：

- gradientOverlaySize 只允许 sm、md、lg；不得扩张为任意数值、方向、动画或滚动阈值 API。
- md 必须继续映射既有 64rpx / 32px，sm 与 lg 必须通过小程序 Token 与 H5 映射共同定义。
- 尺寸变化只作用于 pointer-events:none、aria-hidden 的顶底 sibling layer，不能改变 viewport、Slot、定位或父布局。
- 新增视觉枚举后必须同步源码、H5、元数据、示例、API、组件合同、全局合同、专项测试、Ledger、dist 与已安装示例。

验证与遗留风险：

- 验证：`node scripts/test-scroll-area.js`
- 验证：`PUI_VERIFY_DIST=1 node scripts/test-scroll-area.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：已实际调用微信 CLI build-npm，但 _example 使用 touristappid，开发者工具在读取 AppID 权限时返回 code 10；因此未生成、也未伪造 _example/miniprogram_npm。提供合法 AppID 后，仍需确认 enhanced scroll-view 中三档 rpx 渐变的合成、触摸透传、样式隔离、Slot 读屏与滚动惯性；H5 不能替代该结论。

## PUI-FB-0240 · Card H5 通用 Surface 覆盖阴影、动效、间距与 Footer 合同

- 原始记录：`feedback/records/pui-fb-0240-card-preview-shadow-padding-and-footer-parity.json`
- 范围：`component` / `card`、`preview-site`、`documentation`、`miniprogram-dist`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：按 Popup battle 的真实空间、状态和 Props 回写规则自主验收全库官网组件预览。
- 实际问题：H5 已以 Card 专属规则覆盖通用 Surface：shadow=false 为 none，shadow=true 才读取 --preview-shadow-card；normal/compact 改为语义面板 Token，Card transition 恢复其公开 duration/easing/reduceMotion，Footer 关闭时不再渲染额外节点。
- 决策：保留 Card 作为独立 Surface，但用更具体的 H5 选择器单独管理其材质、外投影与 motion longhand：全局配置继续提供 Theme/Border/Frost/Radius Token，只有 has-shadow 才读取 preview-shadow-card；Footer 直接按 WXML 条件省略。
- 理由：Card 的 shadow 是真实公开 Prop，不能被站点演示环境吞掉。使用现有 panel padding Token 同时修复 1px≈2rpx 映射，且不会新建私有间距或改变小程序 API。

AI 必须遵守：

- Card 的 shadow=false 必须在 H5 计算为无外投影；只在 shadow=true 时读取当前主题的卡片阴影 Token。
- 通用外观 transition 不得覆盖 Card 的 duration/easing/reduceMotion；低动效在浏览器计算样式必须为 1ms。
- 条件 Footer 在 WXML 不存在时，H5 不得用已关闭说明、事件日志或静态占位补结构。
- Card 三段内距固定使用 normal 28rpx/14px 与 compact 20rpx/10px 的语义 Token。
- Card click 与 Footer Slot 内 Button click 必须是不同边界；不要用 H5 业务成功文案冒充 Card 行为。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：合法 AppID 真机仍需确认 Footer catchtap 与嵌套 Button 的真实触摸边界。
- 真机/兼容风险：WXSS rpx、Hover、Slot 投影、样式隔离、读屏与系统低动效仍需真机确认。

## PUI-FB-0241 · Card API 生成目录未刷新，Events 与 Slots 未出现在官网

- 原始记录：`feedback/records/pui-fb-0241-card-api-generated-catalog-staleness.json`
- 范围：`component` / `card`、`preview-site`、`metadata`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：按 Popup battle 的真实空间、状态和 Props 回写规则自主验收全库官网组件预览。
- 实际问题：已通过 site:build 重新生成 H5 catalog；Card API 从 metadata 真相源读取完整事件与 Slots，专项合同防止元数据再次缺失。
- 决策：以 metadata 为唯一 API 真相源，所有 API/Slots 修改后先重建 catalog，再用真实浏览器 API Tab 复验生成结果。
- 理由：直接在 preview/components-data.js 手工补数据会造成下一次构建覆盖和双真相源；生成链路才能同时同步官网和安装产物。

AI 必须遵守：

- 新增或收敛 Props、Events、Slots、Methods 后，必须重建 catalog 并在真实 API Tab 检查生成结果。
- 不得手改 preview/components-data.js 逃避生成流程或制造第二 API 真相源。
- API 事件和 Slots 的存在必须同时被 metadata 专项测试与浏览器可见表格证明。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：原生小程序端仍需以合法 AppID 核验 Slot 投影、catchtap 与读屏边界。

## PUI-FB-0242 · Swiper 概览泄露工程诊断，状态切换和重置偏离真实默认预览

- 原始记录：`feedback/records/pui-fb-0242-swiper-component-only-state-and-reset-parity.json`
- 范围：`component` / `swiper`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的状态预览、空间语义与真实交互规则，自主修复全库官网组件预览。
- 实际问题：已移除事件/方法诊断与读取按钮，状态按钮真实写入父级 Props 后复用挂载节点切换，重置深拷贝可见 Swiper 默认数据；浏览器复验状态中间帧和默认内容均正确。
- 决策：概览保留真实可感知交互，工程事件和实例方法仅在 API/属性 battle；状态层局部更新；重置以 componentPropDefaults 的深拷贝为真相源。
- 理由：用户无法从事件日志获得组件价值，而整段重绘会伪装成动画完成；重置必须满足官网工具栏对默认 Props 与运行态的一致承诺。

AI 必须遵守：

- 组件概览的事件、方法和父级回写诊断只进入 API/属性 battle；概览保留真实触发入口和可见结果即可。
- 已有常驻状态层时，Props 驱动的状态切换必须局部更新同一节点并实测中间帧，禁止 renderStage 整段重建。
- 重置必须从可见演示的默认 Props 深拷贝，代码生成或比较用 source defaults 不能作为用户可见默认状态。

验证与遗留风险：

- 验证：`node scripts/test-swiper.js`
- 验证：`node scripts/test-preview-typography-contract.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信真机仍需使用合法 AppID 核验 swiper 惯性、循环克隆、图片解码、后台 autoplay 节流、rpx 回流、读屏与系统低动效。

## PUI-FB-0243 · Alert 概览泄露工程元信息且默认误成受控，首次进入无中间帧

- 原始记录：`feedback/records/pui-fb-0243-alert-component-only-default-visibility-and-enter-motion.json`
- 范围：`component` / `alert`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的状态预览、空间语义与真实交互规则，自主修复全库官网组件预览。
- 实际问题：已移除工程文字，Props 默认改为 nullable visible=null，新增 retained-node 进入运行时；受控和非受控关闭均由真实状态路径完成。
- 决策：默认恢复原生非受控语义，概览移除工程内容，进入/离开都在同一 Alert 节点完成。
- 理由：受控与非受控必须能被用户真实区分；组件概要不能以调试文本替代交互结果。

AI 必须遵守：

- 具有 visible/defaultVisible 的组件，Props 面板默认必须保留 nullable 未传入态，并分别实测受控与非受控。
- 概览不展示事件日志、Prop 标签或 Slot 术语；可感知结果与恢复入口即可。
- 已有进入/离开动效的 H5 必须由运行时在同一节点上驱动并验证中间帧。

验证与遗留风险：

- 验证：`node scripts/test-alert.js`
- 验证：`node scripts/test-preview-runtime-dispatch.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：合法 AppID 真机仍需验证 rpx、PUI Button catchtap、Slot、读屏和系统低动效。

## PUI-FB-0244 · component-only 归一化遗漏展示根与新诊断类，概览泄露工程状态

- 原始记录：`feedback/records/pui-fb-0244-component-only-normalizer-coverage-and-user-copy.json`
- 范围：`global` / `preview-site`、`navbar`、`tabbar`、`calendar`、`loading`、`radio`、`tabs`、`checkbox`、`form`、`count-down`、`table`、`progress`、`upload`、`pull-refresh`、`sidebar`、`cell`、`list`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：基于 Popup battle 的状态预览、空间语义与真实交互规则，自主修复全库官网组件预览。
- 实际问题：共享归一化现覆盖遗漏的展示根、feedback/status/actions 诊断类和任意嵌套的直接诊断类，并统一转换可见工程术语。Progress 等纯诊断状态已删除；Tabbar 选择、Calendar 日期选择和 CountDown 实时计时仍真实运行。
- 决策：修复共享归一化边界与展示根，不以 CSS 隐藏；将可读说明转换为用户语言，删除纯工程诊断。
- 理由：共享入口可以一次覆盖已发布路由，保留真实组件节点和运行时绑定，避免为每页重写一套遮蔽规则。

AI 必须遵守：

- 每个标准 Showcase 根都必须带 demo-section，确保进入 renderOverviewComponentPreview。
- 新增 feedback/status/actions/event 类时，先判断其是否工程诊断；概览中的纯诊断必须在离线模板删除。
- 直接诊断类不能只按根子元素删除，嵌套分区同样必须覆盖。
- 删除诊断后要实点至少一个相关组件，确认运行时没有依赖被删节点。
- 组件概览中的受控、原始值、value、事件与平台术语必须转换为用户语言或迁入 API。

验证与遗留风险：

- 验证：`node scripts/test-preview-overview-hierarchy.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`wechat cli build-npm`
- 真机/兼容风险：2026-07-22 微信 CLI 已启动 IDE server，但 touristappid 权限查询返回 code 10（不存在此 AppID）；未生成也未伪造 _example/miniprogram_npm。
- 真机/兼容风险：本项只修改官网离线模板归一化和 H5 文案；合法 AppID 真机仍需验证各组件原生事件、rpx、读屏与低动效。

## PUI-FB-0245 · Breadcrumb 已发布但缺少专属合同与专项验收门禁

- 原始记录：`feedback/records/pui-fb-0245-breadcrumb-semantic-contract-and-browser-evidence.json`
- 范围：`component` / `breadcrumb`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：全库组件预览应以真实实现、浏览器交互、合同和证据闭环验收。
- 实际问题：已建立 Breadcrumb 合同和专项测试；390px 实点选择组件路径后活动项真实更新，概览无诊断且无页面横向溢出。
- 决策：建立基于真实源码和 H5 的专属合同与专项测试。
- 理由：不改变已验证实现，只补足长期可执行的验收真相源。

AI 必须遵守：

- 全库最终收口前，以发布组件清单反查专属合同和专项测试。
- TDesign 无同名组件时记录缺失，不伪造对照。

验证与遗留风险：

- 验证：`node scripts/test-breadcrumb.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：合法 AppID 真机仍需验证 ScrollView 惯性、rpx、Slot、tap、读屏与低动效。

## PUI-FB-0246 · Label 官网元信息错误声明 tap 与 H5 输入事件

- 原始记录：`feedback/records/pui-fb-0246-label-event-metadata-and-semantic-contract.json`
- 范围：`component` / `label`、`preview-site`、`documentation`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-22
- 用户目标：全库组件预览应以真实实现、浏览器交互、合同和证据闭环验收。
- 实际问题：元信息已改为 none，并为 Label 增加专属 H5 兼容分支、语义合同和专项测试；390px 属性回写已验证 content/colon/required/disabled 真实影响预览，重置恢复默认。
- 决策：修正元信息与 H5 说明，并以真实四件套建立 Label 合同和专项测试。
- 理由：不改变 Label 已正确的展示 API，只清除会误导调用者的假交互叙述。

AI 必须遵守：

- 审计展示/组合组件时，以 triggerEvent 和 WXML 为准，明确排除通用 click/input 文案。
- 默认 Slot 的控件交互仅在调用方合同中描述，不能扩展父组件 API。

验证与遗留风险：

- 验证：`node scripts/test-label.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：合法 AppID 真机仍需验证 rpx、Slot 投影、样式隔离、文本回流、读屏及真实控件关联体验。

## PUI-FB-0248 · PreviewDevice 共享 ScrollArea 缺少默认阅读渐隐遮罩

- 原始记录：`feedback/records/pui-fb-0248-preview-device-scrollarea-default-gradient.json`
- 范围：`global` / `preview-site`、`preview-device`、`scroll-area`、`all-components`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：所有标准组件预览必须处于唯一 ScrollArea 中，并在内容可继续滚动时默认给出清楚、非阻塞的阅读提示。
- 实际问题：PreviewDevice 现在在唯一 viewport 外以两个 aria-hidden、pointer-events:none 的透明 sibling 渲染默认 md/32px 渐隐层，并由真实 scrollTop、scrollHeight、clientHeight 和 ResizeObserver 同步 overflow/边界状态；无溢出时两层都不显示。
- 决策：在 PreviewDevice 内实现共享 ScrollArea 的默认 md/32px 顶/底渐隐层，并仅将其作为唯一 viewport 的透明同级层。
- 理由：这保留每个组件原有的公开 ScrollArea/scroll-view API 和局部滚动，不会以嵌套公共 ScrollArea 制造双滚动；渐隐状态来自真实浏览器滚动几何而不是静态演示。

AI 必须遵守：

- 标准组件概览只保留 PreviewDevice 的一个纵向滚动 viewport；公共组件自身的局部滚动不能替代或重复它。
- 默认顶底渐隐层必须是 viewport 的 pointer-events:none、aria-hidden sibling，并以 scrollTop/clientHeight/scrollHeight 实时决定显示。
- 无溢出不显示；顶部只显示底部、底部只显示顶部、中段同时显示；尺寸、颜色与低动效统一消费 ScrollArea/PUI Token。

验证与遗留风险：

- 验证：`node scripts/test-preview-overview-hierarchy.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本项仅修改官网 PreviewDevice 基础设施，不改变小程序 ScrollArea 源码或 API；合法 AppID 真机仍需验证公共 ScrollArea 在 scroll-view 中的遮罩合成、惯性和样式隔离。

## PUI-FB-0249 · Divider 深色模式复用边界色导致细线不可辨识

- 原始记录：`feedback/records/pui-fb-0249-divider-dark-divider-token-contrast.json`
- 范围：`component` / `divider`、`preview-site`、`theme`、`documentation`、`miniprogram-dist`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：07 Divider 必须在深色模式中保持清楚、克制且真实的分隔线层级，不能看起来像没有适配深色。
- 实际问题：新增 --pui-divider-color：浅色与深色均为 #a1a1aa。原生实线/虚线和 H5 实线/横竖虚线均使用该 Token；border-off 只关闭 Surface 边界，不再令 Divider 透明，未改变 API、几何、Slot 或交互边界。
- 决策：新增专属 --pui-divider-color 并在小程序主题、H5 预览、实线与虚线路径统一消费；浅色和深色最终均取 #a1a1aa，border-off 不再覆写该 Token。
- 理由：Divider 是展示内容流的独立细线，需要比容器边界更可辨识但仍保持中性克制；#d4d4d8 在浅色 1px 预览中仍过轻，专属 Token 可避免把其他组件边界整体加深，也不能被关闭 Surface 边界的偏好隐藏。

AI 必须遵守：

- Divider 实线、横向虚线和纵向虚线必须共同消费 --pui-divider-color。
- 深色 Divider 细线必须由真实深色浏览器计算样式和目视检查，不得只验证 data-theme。
- bordered=false 只关闭中性 Surface 边界；Divider 作为内容层级必须保留可见 Token。
- 新增展示原语 Token 时同时提供浅色、深色及小程序/H5 同源定义；不得通过加深全局 border 修复单一组件。

验证与遗留风险：

- 验证：`node scripts/test-divider.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：微信 CLI 已实际启动 IDE server，但 touristappid 读取权限返回 code 10，未生成也未伪造 _example/miniprogram_npm；需以合法 AppID 真机确认 1rpx #a1a1aa 在 OLED/LCD、微信暗色主题和样式隔离下的实际抗锯齿与可辨识性。

## PUI-FB-0250 · 边框关闭偏好错误隐藏 Divider 内容层级

- 原始记录：`feedback/records/pui-fb-0250-divider-hidden-by-global-border-off.json`
- 范围：`global` / `divider`、`config-provider`、`preview-site`、`theme`、`documentation`、`miniprogram-dist`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：无论是否关闭卡片和表单的中性边框，Divider 都必须继续承担可见的内容分区作用。
- 实际问题：全局 border-off 重映射和原生 pui-border--off 曾把 --pui-divider-color 写为 transparent，使 DOM 中真实的 1px Divider 完全透明。
- 决策：border-off 继续透明化 --border、--border-strong、--glass-border、--preview-border 与 --pui-border-color，但不再覆写 --pui-divider-color。
- 理由：卡片边界和内容分隔线承担不同的信息职责；关闭前者不能让后者消失。

AI 必须遵守：

- 为全局 Token 增加 border-off 覆写前，先区分 Surface 边界与内容层级。
- Divider 的专属 Token 不得被全局 border-off 重写为 transparent。
- 必须同时验证 H5 data-border=off 与小程序 pui-border--off。

验证与遗留风险：

- 验证：`node scripts/test-divider.js`
- 验证：`node scripts/test-global-border-preference.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：待合法 AppID 真机确认 pui-border--off 下 1rpx Divider 与 Surface 边界的样式隔离。

## PUI-FB-0251 · Tag 官网演示挤压标签并截断 success 文本

- 原始记录：`feedback/records/pui-fb-0251-tag-preview-spacing-and-label-width.json`
- 范围：`component` / `tag`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Tag 演示中的多组标签应按自身内容自然排列，行间有清楚的上下间距，success 等完整文字不能被预览布局截断。
- 实际问题：固定 64px 最小轨道会压缩带图标的 success 标签，造成 content clientWidth 小于 scrollWidth；主题矩阵上下间距均使用单一 8px gap，长文本示例还使用过窄的 180rpx；修复固定轨道后，两个兄弟行容器之间仍没有独立垂直间距；官网 light 变体的语义浅底色不够明确，用户难以快速区分 Tag 与普通文本。
- 决策：保留 Tag 组件本身的安全 maxWidth 语义，只修正官网演示容器与预览语义：用内容宽度 flex-wrap 承载标签，水平继续使用 content gap，行内换行与兄弟行之间都使用独立 10px Token；light 变体明确使用 PoemUI 语义浅底色，outline/dark 保持对比变体；长文本示例扩大到 240rpx。
- 理由：展示区不应通过固定小轨道改变 Tag 的真实尺寸；自然换行既能保留完整 success 文本，也能在 390px 下稳定使用，兄弟行间距则避免分区内的多排标签贴合；light 填充让 Tag 的展示语义可被快速识别。

AI 必须遵守：

- Tag 展示矩阵使用内容宽度 flex-wrap 或等价的 intrinsic layout，禁止用 64px 等固定窄轨道压缩文本和 Icon。
- 标签组必须分别定义 column-gap 与 row-gap；不同排列行的兄弟容器也要使用同一语义垂直 Token，不要让多行上下贴合。
- 只有明确 maxWidth 的 Tag 才允许省略；普通主题/变体 Tag 必须保持内容宽度和完整可读文本。

验证与遗留风险：

- 验证：`node scripts/test-tag.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信真机仍需复核 rpx 到实际字体回流后的标签宽度、连续换行和样式隔离；本轮未改变 Tag 小程序公开 API。

## PUI-FB-0253 · CellGroup 作为 Cell 体系内部布局组件

- 原始记录：`feedback/records/pui-fb-0253-cell-group-layout-component.json`
- 范围：`component` / `cell`、`popup`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：多个 Cell 需要有统一的标题、间距和卡片外观，并且这套分组能力要能在小程序和官网预览中复用。
- 实际问题：仓库只有 Cell，预览中的 pui-cell-group 只是页面私有 HTML 结构，无法在小程序端直接复用，也没有统一的 card/title 语义。
- 决策：新增 cell/cell-group 四件套并纳入 Cell 专项测试；不加入 metadata/packageComponents，不新增目录编号或独立官网路由。
- 理由：CellGroup 是 Cell 的布局组合能力而非独立业务组件；内部路径可供小程序复用，同时避免组件目录和 API 规模膨胀。

AI 必须遵守：

- CellGroup 默认只负责布局；card=true 才建立一次圆角卡片 Surface，组内 Cell 不再各自形成卡片。
- CellGroup 不加入顶层 metadata、目录编号或组件搜索；小程序通过 cell/cell-group 路径复用。
- 不同语义层的 Cell 必须分成不同 CellGroup，弹窗内容与外部演示配置不能混组。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：合法 AppID 真机仍需复核 styleIsolation: shared 下组根对内部 pui-cell 的透明 Surface、圆角裁切、Slot 投影、rpx 行高和辅助技术朗读。

## PUI-FB-0254 · Popup 描述在标题区单行截断

- 原始记录：`feedback/records/pui-fb-0254-popup-subtitle-single-line.json`
- 范围：`component` / `popup`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Popup 标题下的描述保持紧凑单行，过长时不撑高 Header，用户仍能看到明确的省略提示。
- 实际问题：H5 scoped 样式将 Popup 描述覆盖为可换行，小程序端也没有统一的单行截断语义。
- 决策：H5 与小程序端统一使用单行省略；不改变标题、Header 高度或 Content Slot 语义。
- 理由：Popup Header 只承载紧凑上下文，长文本应进入内容区，避免影响左右按钮对齐和弹窗几何。

AI 必须遵守：

- 标题区描述必须保持单行并使用省略号，不能用换行撑高 Header。
- 需要完整说明时放入 Popup Content Slot，不扩展 subtitle 语义。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信字体度量与 text-overflow 视觉差异仍需合法 AppID 真机确认

## PUI-FB-0255 · Popup 移除拖拽手柄保持紧凑 Header

- 原始记录：`feedback/records/pui-fb-0255-popup-remove-drag-handle.json`
- 范围：`component` / `popup`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Popup 保持紧凑的 Header 排版，不展示拖拽手柄，也不让基础浮层承担拖拽关闭语义。
- 实际问题：Popup 原生、H5、Props、文档和示例仍包含 showHandle/draggable 与 drag 事件语义。
- 决策：从 Popup 源码、生成物、预览、metadata、API、兼容说明、示例和测试中移除拖拽手柄与拖拽关闭能力；Sheet 继续承载完整拖拽语义。
- 理由：Popup 保持轻量基础浮层边界，避免与 Sheet 的拖拽、阈值和状态优先级重复。

AI 必须遵守：

- 不要给 Popup 增加 showHandle、draggable 或 drag 事件；这些能力属于 Sheet。
- 删除能力时必须同步移除源码、H5、metadata、API、兼容说明、示例、专项测试和生成物。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：合法 AppID 真机仍需确认移除手柄后 Header Slot 投影、样式隔离和字体回流。

## PUI-FB-0256 · Grid 官网错误态 Empty 与重试按钮横向挤压

- 原始记录：`feedback/records/pui-fb-0256-grid-preview-error-state-layout.json`
- 范围：`component` / `grid`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Grid 的加载、空和错误示例在窄屏预览中应保持清晰分层，错误态的 Empty 与重试动作不能互相挤压。
- 实际问题：Grid 原生与 H5 预览的状态容器都是横向 flex。错误态的 Empty 与独立重试 Button 被挤在同一行，Empty 的可用宽度被动作按钮侵占。
- 决策：原生 WXSS 与 H5 镜像统一把 Grid 状态层改为 column flex，并分别使用 pui-space-normal 与 pui-preview-content-gap 作为垂直间距；保留所有状态层常驻和独立重试动作。
- 理由：Error 状态是 Empty 说明与用户动作的上下级关系，垂直堆叠能保证 390px 可读性，同时不改变 retry 事件、状态优先级或消费者回写责任。

AI 必须遵守：

- 状态容器同时包含 Empty 与外置动作时，先按信息层级选择 column flex，再用语义 gap Token 控制间距。
- H5 镜像的状态布局必须与真实 WXML 组合树一致，不能只通过缩小文字或固定宽度掩盖挤压。
- 修复预览布局后仍要验证 390px 页面级 scrollWidth，以及 loading/error/empty 状态层的真实切换和 retry 回写。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信真机仍需复核 rpx gap、PUI Empty/Button 样式隔离、读屏顺序和触摸命中；当前示例 touristappid 可能阻断 build-npm。

## PUI-FB-0257 · 普通预览长内容缺失底部安全间距

- 原始记录：`feedback/records/pui-fb-0257-preview-bottom-inset-overflow.json`
- 范围：`global` / `preview-site`、`preview-device`、`grid`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：普通组件预览滚动到最后一项后，内容与设备底部之间仍应保留清晰、可读且稳定的间距。
- 实际问题：shadow-safe 父级和直接演示根都固定为 height: 100%，长内容溢出固定高度后绕过父级底部 padding，最后一项贴近滚动内容底部。
- 决策：共享 shadow-safe 布局改为自然高度并保留 min-height:100%，直接演示根同步使用 height:auto 与 min-height:100%；继续由父级统一消费 28px 四向安全内距。
- 理由：这样短内容仍填满固定 PreviewDevice viewport，长内容可以随唯一滚动上下文增长，且最后一项始终获得一次一致的底部留白，不需要给每个组件重复补私有 margin/padding。

AI 必须遵守：

- shadow-safe 父级负责唯一四向安全 padding，直接组件根不得重复补 padding-bottom。
- 可滚动预览根使用 height:auto + min-height:100%，让短内容填满、长内容自然增长。
- 浏览器验收必须同时读取 clientHeight/scrollHeight、最后内容与布局底部差值，以及 390px document/body scrollWidth。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：本轮仅修改官网共享预览 CSS 与契约测试，未改小程序组件产物；合法 AppID 真机仍需复核组件内容在微信 scroll-view 中的 rpx 高度、字体回流和触摸滚动边界。

## PUI-FB-0258 · BackTop 预览圆形操作缺少 FAB 语义且未回写局部滚动

- 原始记录：`feedback/records/pui-fb-0258-backtop-fab-preview.json`
- 范围：`component` / `back-top`、`button`、`fab`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：BackTop 预览中的圆形操作应读作真正的 FAB，固定按钮要浮在滚动内容上方，局部滚动和回顶动作必须真实改变可见状态与 Props。
- 实际问题：直接 Button 同时承担了 FAB 的尺寸、主题和定位语义，静态示例看起来像列表下方普通按钮；基础预览没有把局部 scrollTop 回写到运行态。
- 决策：在 button/fab 下新增不占目录编号的 Button 家族内部 FAB 原语；BackTop 原生端和 H5 端统一复用它，固定/静态定位仍由 BackTop 父级负责；绑定当前局部滚动容器的 scroll 事件并回写 Props。
- 理由：圆形/扩展浮动动作需要稳定的尺寸、主题、阴影和文案规则，但不应让每个复合组件复制一套 Button CSS；滚动状态必须来自真实 DOM scrollTop，不能由提示文字或静态类名伪造。

AI 必须遵守：

- 不要把 FAB 识别为普通 Button 后在复合组件里复制尺寸/主题 CSS；建立 Button 家族内部原语并继续复用 Button 交互树。
- 预览中的 fixed FAB 必须覆盖其滚动内容区，而不是作为列表后的普通流按钮；静态示例也要明确表达定位差异。
- scrollTop、显隐和回顶后的状态必须来自真实滚动容器与真实 scroll 行为，不能只更新提示文字或静态属性。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：合法 AppID 真机仍需复核 pui-fab 样式隔离、wx.pageScrollTo、fixed 安全区、Button 触摸命中和读屏；当前示例 touristappid 可能阻断 build-npm。

## PUI-FB-0259 · BackTop 预览缺少内距且示例重复、FAB 未居中

- 原始记录：`feedback/records/pui-fb-0259-backtop-preview-spacing-dedup-center.json`
- 范围：`component` / `back-top`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：BackTop 各分区应有稳定可读的预览内距，示例只展示有区分度的内容，形状和主题示例的 FAB 应在舞台中居中。
- 实际问题：预览内距不足导致 Cell 贴近舞台边缘，四个区重复堆叠十行列表，FAB 的右下定位让形状与主题示例看起来没有居中。
- 决策：由 BackTop 预览舞台统一消费共享安全内距；仅基础用法保留完整局部滚动，阈值用精简列表，外观/主题样例改为居中 FAB 舞台，并让主题与定位样例真实使用 fixed/static 两种定位。
- 理由：示例应优先表达当前分区的差异，而不是重复相同内容；共享内距能让阴影、Cell 和 390px 预览保持稳定边界，居中舞台能清楚展示形状与主题。

AI 必须遵守：

- 每个普通预览舞台消费共享 PreviewDevice 内距，组件内容不得贴边或重复私有 padding。
- 真实交互长列表只保留在需要验证滚动的基础用法，其他分区应精简到能表达当前差异。
- 仅展示形状/主题的浮动组件使用独立居中舞台；fixed/static 差异必须由真实定位和可见几何表达。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：本轮未改小程序组件四件套；合法 AppID 真机仍需复核预览外不适用的 fixed/static、rpx 内距、样式隔离、FAB 命中区和系统低动效。

## PUI-FB-0260 · BackTop 预览分区标题贴边并被顶部裁切

- 原始记录：`feedback/records/pui-fb-0260-backtop-heading-inset.json`
- 范围：`component` / `back-top`、`preview-site`、`preview-device`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：BackTop 预览的分区标题应在设备安全内距内完整显示，并与下方内容保持一致的左右基线。
- 实际问题：标题直接位于 edge-to-edge 预览顶部和左右边缘，首字可能被圆角/滚动遮罩裁切，标题与下方 Cell 的左右间距不一致。
- 决策：BackTop 使用 shadow-safe PreviewDevice 父布局，并给四个分区标题增加共享设备内距；不在 BackTop 页面私有增加任意魔法 margin。
- 理由：共享父布局负责统一上下左右安全区，标题只补齐与 frame 内容相同的语义内缩，能同时解决顶部裁切和左右基线漂移。

AI 必须遵守：

- 只有真正覆盖屏幕的浮层或屏幕附着组件使用 edge-to-edge，普通 BackTop 使用 shadow-safe。
- 标题不能贴着 PreviewDevice 裁切边缘；应消费共享设备安全内距并检查首字是否完整。
- 标题与内容 frame 的左右基线必须用同一 Token 验证，不能只看组件本体是否有 padding。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本轮仅修改官网预览布局；合法 AppID 真机仍需复核 BackTop fixed 位置、rpx 安全区和系统滚动遮罩。

## PUI-FB-0261 · BackTop 预览应只保留两个列表并让 FAB 使用安全内距

- 原始记录：`feedback/records/pui-fb-0261-backtop-two-lists.json`
- 范围：`component` / `back-top`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：BackTop 预览只展示两个有区分度的列表；Cell 列表在内容区视觉居中，FAB 保持右下浮动但不得越出编辑预览边距。
- 实际问题：第一轮修复移除了独立 FAB 舞台，但错误地把“视觉水平居中”理解为 FAB 居中，导致 BackTop 的右下浮动语义丢失。
- 决策：概览收敛为两个真实列表；形状、主题和定位保留在 Props/API，不额外占用预览；局部滚动条不占横向布局，Cell 列表水平居中，FAB 恢复右下定位并使用共享安全内距。
- 理由：两个列表足以表达滚动和阈值任务；BackTop 的 FAB 是右下浮动入口，视觉居中应由列表内容承担，FAB 只需与 Cell 内容边界一致。

AI 必须遵守：

- 概览只保留能表达用户任务的真实示例，组件外观枚举放入 Props/API，不为每个枚举复制舞台。
- 先确认用户描述中的视觉对象；不能把 Cell 的居中要求错误应用到 FAB。
- 浮动操作的 fixed/static 语义由父级保留，预览几何必须限制在共享 frame 内并与内容边界对齐。
- 需要滚动验证的长列表只保留必要分区；释放的设备高度优先给真实内容和可操作空间。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本轮仅修改官网预览；合法 AppID 真机仍需复核 fixed/static、rpx、FAB 触摸命中和样式隔离。

## PUI-FB-0262 · BackTop 两个预览列表的滚动内容不足

- 原始记录：`feedback/records/pui-fb-0262-backtop-list-length.json`
- 范围：`component` / `back-top`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：基础用法和显示阈值两个列表都要有足够长的真实 Cell 内容，使 BackTop 的滚动、阈值和回顶行为清楚可见。
- 实际问题：列表项数量偏少，尤其阈值列表接近一屏，BackTop 的长页语义和滚动距离不充分。
- 决策：固定可视窗口仍为 260px，基础列表使用 18 个 Cell，阈值列表使用 12 个 Cell；不通过增高 PreviewDevice 或复制更多分区制造长度。
- 理由：增加内容数量可以提供足够滚动距离，同时保持设备尺寸、Cell 中线、FAB 安全内距和两个分区结构稳定。

AI 必须遵守：

- 减少重复示例不等于削短真实任务场景；BackTop 列表必须提供明显滚动距离。
- 列表需要变长时优先增加真实 Cell 数量，不通过增高设备或增加无关分区制造长度。
- 修改列表数量后必须实测 clientHeight、scrollHeight、最大滚动距离和点击回顶。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本轮只修改官网列表内容数量；合法 AppID 真机的 wx.pageScrollTo、fixed 安全区和触摸滚动风险不变。

## PUI-FB-0263 · Spacing 应位于开始与规范并紧跟编号 05

- 原始记录：`feedback/records/pui-fb-0263-spacing-start-guidance-order.json`
- 范围：`global` / `spacing`、`preview-site`、`metadata`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Spacing 是设计规范入口，应归入开始与规范，并紧跟现有编号 05 Style Utilities 成为编号 06。
- 实际问题：Spacing 位于布局分区并显示为编号 14，开始与规范在 05 后直接结束。
- 决策：Spacing 从布局移动到开始与规范，固定排列在 Style Utilities 后，目录编号由统一 metadata 顺序自动生成并显示为 06。
- 理由：Spacing 是 Token 与 utility 使用规范，不是独立布局组件；与 Theme、Color、Style Utilities 连续陈列更符合设计系统学习路径。

AI 必须遵守：

- Spacing 只在开始与规范出现一次，不得重新放回布局或建立第二入口。
- 开始与规范顺序固定为 Getting Started、ConfigProvider、Theme Tokens、Color、Style Utilities、Spacing。
- 反馈编号必须从完整 metadata 顺序派生，禁止页面写死编号。
- 目录归属调整必须同步专项测试、生成物、信息层级文档、Ledger 和真实浏览器搜索验证。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本次只修改官网目录信息架构和文档，不改变小程序组件、Token、工具类或 npm API。

## PUI-FB-0264 · Sticky 概览被四个重复滚动窗切碎且未填满可用空间

- 原始记录：`feedback/records/pui-fb-0264-sticky-single-full-preview.json`
- 范围：`component` / `sticky`、`preview-site`、`cell`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Sticky 概览只展示基础用法，让真实滚动演示填满 PreviewDevice，并保留上下呼吸空间、Sticky 层级阴影、连续无间距的正文 Cell 和左右对称布局。
- 实际问题：概览重复渲染四个矮小滚动窗，大量 Cell 文案相同，核心吸顶效果难以聚焦。
- 决策：概览只保留一个填满完整宽高的基础滚动示例；隐藏不对称占位的局部滚动条，内容上下使用共享设备内距，Sticky Header 使用共享阴影，正文 Cell 取消间距和独立圆角；所有 Props 继续在属性页作用于该示例。
- 理由：Sticky 只需通过一次真实滚动说明吸顶关系；参数差异属于属性调试，不应复制组件主体。

AI 必须遵守：

- Sticky 概览只能保留一个真实局部滚动根，禁止为 offset、container 或 disabled 复制演示窗。
- Sticky 局部滚动根必须填满 PreviewDevice 的完整宽高，基础预览固定提供 50 项连续 Cell，内容上下消费共享设备内距。
- Sticky Header 使用共享阴影表达浮起层级，正文 Cell 连续排列且不得保留独立间距或圆角卡片。
- Sticky 局部滚动条不得占用单侧 gutter；保留真实滚动能力但保证列表左右几何对称。
- 全部公开 Props 必须作用于同一预览，不能只更新说明文字。

验证与遗留风险：

- 验证：`node scripts/test-sticky.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本轮只调整官网 H5 概览；微信 page scroll、SelectorQuery、container NodesRef、rpx 和样式隔离仍需合法 AppID 真机确认。

## PUI-FB-0265 · Breadcrumb 概览只有一个过载示例且缺少关键路径场景

- 原始记录：`feedback/records/pui-fb-0265-breadcrumb-preview-examples.json`
- 范围：`component` / `breadcrumb`、`preview-site`、`button`、`icon`、`tag`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：说明第 17 号 Breadcrumb 当前预览表达的能力，并增加足够清楚、可以真实操作的典型示例。
- 实际问题：旧概览只有一个信息过载的组合示例，既不能快速看懂基础调用，也无法直接筛选长路径和窄屏策略。
- 决策：新增四个清晰分区；基础、横滚和换行示例使用受约束教学数据，图标与扩展示例继续承接属性面板当前 Props；所有路径按钮仍复用 PUI Button 和同一个 Breadcrumb 选择函数。
- 理由：Breadcrumb 的关键差异集中在路径复杂度、横向策略和扩展位，拆分后更容易比较，同时真实独立状态避免静态假交互。

AI 必须遵守：

- 基础示例只说明最小路径，不得混入前后扩展和所有图标能力。
- 长路径必须用真实 nowrap 内部横滚证明窄屏策略，不能依赖页面横向滚动。
- 多个同组件示例必须共享真实交互合同并隔离运行态，禁止用无动作按钮充当演示。
- 示例分区之间固定消费 18px section gap，不能被全局 8px shell gap 覆盖。

验证与遗留风险：

- 验证：`node --check preview/app.js`
- 验证：`node scripts/test-breadcrumb.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：本轮只修改官网 H5 概览；微信真机仍需验证 scroll-view 惯性、rpx、Slot 投影、PUI Button tap、读屏与系统低动效。

## PUI-FB-0266 · Indexes H5 索引 Button 热区重叠且活动字符不可见

- 原始记录：`feedback/records/pui-fb-0266-indexes-bar-button-overlap-and-contrast.json`
- 范围：`component` / `indexes`、`button`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：第 18 号 Indexes 的侧栏索引必须看得清、点得准，深浅色和 390px 下都不能出现空白当前项或误选相邻分组。
- 实际问题：全局 Button 最终尺寸与颜色规则覆盖 Indexes 的局部规则，导致热区高度翻倍、相邻入口重叠，活动 Button 字符又与白色活动底色相同。
- 决策：在共享 Button 最终规则之后增加仅限 Indexes bar-item 的尺寸与颜色覆盖，并把包装 span 改为 Grid 精确居中，保持原生 custom-class 的组合语义。
- 理由：Indexes 仍然复用 PUI Button，只恢复该组件原生已经声明的紧凑 custom-class；限定作用域不会改变其他 Button 的尺寸或主题。

AI 必须遵守：

- 不能只读取声明 CSS；必须比较包装轨道和实际 Button 的 getBoundingClientRect。
- 紧凑索引入口必须让包装与点击热区完全重合，禁止相邻 Button 互相覆盖。
- 活动态颜色要读取 Button 子节点的最终计算色，父级颜色正确不代表文字真实可见。
- 组件 scoped custom-class 必须置于共享子组件最终规则之后并由专项测试锁定。

验证与遗留风险：

- 验证：`2026-07-23 node --check preview/app.js 与 node scripts/test-indexes.js：通过`
- 验证：`2026-07-23 npm run site:build、npm run check、npm run pack:check、npm run example:install：通过`
- 验证：`2026-07-23 微信 CLI build-npm：IDE server 已启动，touristappid 不存在，code 10；未生成或伪造 miniprogram_npm`
- 真机/兼容风险：微信真机仍需用合法 AppID 复核 custom-class 样式隔离、PUI Button tap 热区、touchmove 连续命中、rpx 与读屏。

## PUI-FB-0267 · Indexes H5 滚到底部时短尾分组不会成为活动项

- 原始记录：`feedback/records/pui-fb-0267-indexes-short-tail-scroll-boundary.json`
- 范围：`component` / `indexes`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Indexes 的滚动联动必须准确，最后一组内容较短时滚到底部也要明确显示最后一个索引。
- 实际问题：H5 缺少原生的短尾底边判断，仅按分组顶部与 scrollTop 比较，最后一组永远无法通过该条件。
- 决策：在 H5 scroll handler 中先计算 `scrollTop + clientHeight >= scrollHeight - 2`，到达底部时直接采用最后一个真实 marker。
- 理由：两像素容差和原生完全一致，不增加新 API，也不会影响中间分组、程序化滚动抑制或严格 index 身份。

AI 必须遵守：

- 审计索引滚动时同时比较最后分组 offsetTop 与真实 maxScrollTop。
- 最后分组无法贴顶时使用容器底边判断，不得塞空白占位伪造可滚距离。
- H5 镜像必须逐项同步原生 scroll 边界，而不是只复制常规路径。
- 程序化滚动和手动滚动的事件抑制仍需保持独立。

验证与遗留风险：

- 验证：`2026-07-23 node --check preview/app.js 与 node scripts/test-indexes.js：通过`
- 验证：`2026-07-23 npm run site:build 与 npm run check：通过`
- 验证：`2026-07-23 微信 CLI build-npm：IDE server 已启动，touristappid 不存在，code 10；未生成或伪造 miniprogram_npm`
- 真机/兼容风险：微信真机仍需复核 scroll-view 惯性、scrollHeight detail、底边回弹和 touchmove 与 scroll 事件交错。

## PUI-FB-0268 · Indexes 隐藏状态层仍保留可键盘操作的滚动区与重试按钮

- 原始记录：`feedback/records/pui-fb-0268-indexes-hidden-state-focus.json`
- 范围：`component` / `indexes`、`button`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Indexes 在 content、loading、error、empty 间切换时，键盘和读屏只能接触当前真实状态，不能操作视觉上已经隐藏的内容。
- 实际问题：隐藏层只在视觉和指针层面不可见，滚动区与 Retry Button 仍可能被键盘聚焦，形成不可见操作和读屏噪音。
- 决策：H5 为非当前内容、导航和状态层增加 inert 与 aria-hidden，并把隐藏滚动区 tabindex 改为 -1；原生 Retry 增加 stateType 锁定。
- 理由：保留节点和 500ms 视觉状态结构不变，同时把键盘与辅助技术的可操作范围限制到当前真实状态。

AI 必须遵守：

- 检查隐藏层时枚举真实 focusable 后代，不能只看 opacity 或 pointer-events。
- H5 非当前 retained layer 使用 aria-hidden + inert，显式 tabindex 同步切到 -1。
- 原生隐藏状态中的可操作子组件必须同步 disabled，不能依赖父级透明。
- 不得用 display:none 简化问题而破坏中间帧与完成态合同。

验证与遗留风险：

- 验证：`2026-07-23 node --check preview/app.js 与 node scripts/test-indexes.js：通过`
- 验证：`2026-07-23 npm run site:build、npm run check 与 npm run example:install：通过`
- 验证：`2026-07-23 微信 CLI build-npm：IDE server 已启动，touristappid 不存在，code 10；未生成或伪造 miniprogram_npm`
- 真机/兼容风险：微信 WXML 没有浏览器 inert；合法 AppID 真机仍需验证 aria-hidden、disabled Button、scroll-view 与读屏组合行为。

## PUI-FB-0269 · Indexes 默认侧栏未按页面 fixed 浮动

- 原始记录：`feedback/records/pui-fb-0269-indexes-fixed-sidebar.json`
- 范围：`component` / `indexes`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Indexes 默认索引入口应固定浮动在页面视口中央，内容滚动时侧栏保持可见且不随列表内容流移动。
- 实际问题：原生侧栏仅 absolute 在组件卡片内部；H5 也按组件根绝对定位，未记录真实页面 fixed 语义。
- 决策：原生 pui-indexes__bar 改为 fixed、top:50%、左右边界和垂直居中；H5 保持 absolute 但改为 PreviewDevice 内 top:50% 的边界受限 fixed 视觉镜像。
- 理由：小程序必须复现页面级可持续可见的 Indexes 入口，官网则不能让 fixed 逃出手机预览设备；两端在各自运行时保留同一产品语义。

AI 必须遵守：

- 对照 TDesign 时要分别确认 sidebar 和 anchor 的定位语义，不能把页面 fixed 简化成组件 absolute。
- 小程序 fixed 组件必须检查页面滚动、安全区和 touch 命中，H5 fixed 预览必须检查设备裁切。
- 固定定位改变属于 API/预览合同变化，必须同步原生 WXSS、H5 CSS、专项测试、Ledger 和产物。

验证与遗留风险：

- 验证：`2026-07-23 node scripts/test-indexes.js：通过`
- 验证：`2026-07-23 npm run site:build、npm run check、npm run pack:check、npm run example:install：通过；npm pack 522 files / 297.8 kB / shasum 5707e44e3a58aca87b4bb5fefe5a0861b1e76cf4`
- 验证：`2026-07-23 微信 CLI build-npm：IDE server 已启动，但 touristappid 不存在（code 10）；未生成或伪造 miniprogram_npm`
- 真机/兼容风险：微信真机仍需验证页面 fixed 与页面滚动、系统安全区、横竖屏、touchmove 和样式隔离的组合行为。

## PUI-FB-0270 · Indexes Cell 被固定侧栏预留区挤窄

- 原始记录：`feedback/records/pui-fb-0270-indexes-cell-full-width.json`
- 范围：`component` / `indexes`、`cell`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Indexes 内的 Cell 应撑满内容列，固定索引栏作为浮层存在，不应额外压缩列表宽度。
- 实际问题：修复前 H5 PreviewDevice 中 Cell 为 279px，而滚动内容列为 322px，右侧存在 32px 预留空白。
- 决策：移除 Indexes 滚动容器针对左右侧栏的 32px padding，让 Cell 撑满内容列；侧栏继续作为独立 fixed/PreviewDevice bounded 浮层。
- 理由：fixed 浮层不应改变内容列盒模型；视觉遮挡风险由侧栏自身的独立命中区承担，而不是把所有 Cell 压窄。

AI 必须遵守：

- 先区分浮层命中区和内容布局区；fixed sidebar 不应成为列表的 grid/flex 子项。
- Cell 满宽指充满内容列，同时保留 PreviewDevice 和滚动条的真实安全边界。

验证与遗留风险：

- 验证：`2026-07-23 site:build、example:install、Indexes 专项、npm run check、npm run pack:check：通过`
- 验证：`2026-07-23 feedback:generate、feedback:check：通过`
- 真机/兼容风险：合法 AppID 真机仍需确认 fixed 侧栏覆盖 Cell 最右侧内容时的触摸命中、读屏顺序和安全区表现。

## PUI-FB-0271 · Navbar 未为微信原生胶囊保留真实安全区

- 原始记录：`feedback/records/pui-fb-0271-navbar-native-capsule-safe-area.json`
- 范围：`component` / `navbar`、`preview-site`、`example`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：微信小程序自定义导航栏要与右上原生胶囊样式和空间对齐，右侧不得再放业务内容，H5 预览也必须真实表达这一边界。
- 实际问题：修复前 Navbar 假定固定等宽轨并鼓励 right Slot 业务操作，不能在不同设备的原生胶囊位置上保持标题和操作边界。
- 决策：默认 capsule=true。原生端以 windowWidth-left 生成左右对称标题轨，以 windowWidth-right 和 width 建立左操作镜像区，并用 top/bottom/height/statusBarHeight 计算纵向内容高度；H5 同步镜像左操作位置与不可交互 88px×32px 胶囊。仅 capsule=false 渲染 right Slot。
- 理由：系统胶囊的真实位置会随设备变化，动态测量才能保护标题居中和右上系统命中区；H5 需要表达空间边界但不能伪造成微信菜单。

AI 必须遵守：

- capsule=true 时，right Slot 必须不渲染，H5 镜像必须 aria-hidden 且 pointer-events:none。
- 必须读取菜单矩形 left/right/top/bottom/width/height 与 windowWidth/statusBarHeight；只计算 windowWidth-left 不能证明左操作与系统胶囊对称。
- 左操作以 windowWidth-right 为外边距，并在 width 对应的镜像区域内居中；导航内容按胶囊相对状态栏的上下等距计算。
- 任何例外必须显式 capsule=false，并同步说明其不是 custom-navigation 默认布局。

验证与遗留风险：

- 验证：`node scripts/test-navbar.js 通过。`
- 验证：`npm run feedback:generate && npm run feedback:check 通过。`
- 验证：`npm run site:build 通过。`
- 验证：`npm run check 通过。`
- 验证：`npm run example:install 通过。`
- 验证：`npm run pack:check 通过。`
- 真机/兼容风险：需使用合法 AppID 真机确认不同设备的 getMenuButtonBoundingClientRect、原生胶囊触摸命中、fixed/安全区、rpx 三列、样式隔离、读屏和系统低动效。
- 真机/兼容风险：touristappid 或未生成 miniprogram_npm 不能作为微信构建成功证据。

## PUI-FB-0272 · NavigationMenu Trigger 后缀 Badge 锚定到菜单根并被裁切

- 原始记录：`feedback/records/pui-fb-0272-navigation-menu-suffix-badge-anchor.json`
- 范围：`component` / `navigation-menu`、`badge`、`button`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：NavigationMenu 根入口的 Badge 必须准确落在 Button suffix 内，完整可见且不影响触发器布局。
- 实际问题：修复前 Badge 的定位坐标落在整个菜单根右上角，超出当前 Trigger 约 210px，视觉上被截断或与错误锚点重叠。
- 决策：NavigationMenu 根 Trigger 的 Badge 显式使用 standalone=true；组件作用域 CSS 再锁定 static、flex 子项与无 transform。
- 理由：Button suffix 是内联排列区域，静态 Badge 同时保持原生空宿主语义、正确锚点和完整点击区。

AI 必须遵守：

- 先核对原生 Badge 是否有内容宿主；空宿主的 H5 镜像必须使用 standalone。
- Badge 在 Button suffix 中必须以当前 Trigger 为唯一布局边界，不能让 overflow 裁切掩盖错误锚点。
- 修复锚点时继续复用 badgeSample，不得手写私有徽标或用负间距补偿。

验证与遗留风险：

- 验证：`feedback:generate/check（263 records）、site:build、check、pack:check 与 example:install 均通过；微信 CLI 实际启动 IDE server，但 touristappid 查询报 code 10，未将其伪报为 build-npm 成功。`
- 真机/兼容风险：合法 AppID 真机仍需确认 PUI Button suffix Slot 中 Badge 的 rpx 尺寸、样式隔离、触摸命中和读屏顺序。

## PUI-FB-0273 · Steps 概览把互斥示例纵向堆叠，无法快速筛选场景

- 原始记录：`feedback/records/pui-fb-0273-steps-scenario-selector-preview.json`
- 范围：`component` / `steps`、`button`、`preview-site`、`preview-device`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Steps 的示例不能作为多个独立长区块同时出现；用户应在左侧选择用法，右侧展示对应的真实视图。
- 实际问题：旧概览把四个实例作为彼此独立的纵向内容块堆叠，信息密度高且不符合用户需要的左选右看动线。
- 决策：Steps 概览改为基础、方向、状态、边界四个左侧 PUI Button 场景；右侧始终只有一个真实 Steps view，场景状态写入 demo.stepsScenario。
- 理由：用户能迅速筛选一个阶段形态，同时仍能操作实际 Steps、验证 current 回写和各项布局能力。

AI 必须遵守：

- 场景切换必须改变真实组件 Props 或运行态，不能只更新标题、提示或日志。
- 场景入口必须复用 PUI Button 与 Icon，并带可访问名称和选中态。
- PreviewDevice 内只保留当前场景的组件实例，避免多个示例同时挤压固定屏幕。

验证与遗留风险：

- 验证：`scripts/test-steps.js、feedback:generate/check（265 records）、site:build、check、pack:check 和 example:install 均通过；微信 CLI 实际启动 IDE server，但 touristappid 权限查询报 code 10，未伪报 build-npm 成功。`
- 真机/兼容风险：合法 AppID 真机仍需验证小程序本体的横向手势、rpx、Button Slot、读屏与系统低动效。

## PUI-FB-0274 · Steps 的 PUI Button Slot 继承固定 36px 高度而裁切指标和文案

- 原始记录：`feedback/records/pui-fb-0274-steps-button-slot-clipping.json`
- 范围：`component` / `steps`、`button`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Steps 的数字徽标、图标、标题和说明必须完整展示，不能因预览容器或通用 Button 尺寸被截断。
- 实际问题：修复前 390px 实测首项 Button 为 36px 高、List 为 44px 高，但标题 bottom=744.48px 超过 List bottom=737.48px。
- 决策：用 Steps 作用域的高特异性 PUI Button 样式改为内容高度、完整可见溢出和 86px 水平最小高度；纵向布局保留紧凑 48px 起点。
- 理由：由 Steps 父级承担排列和内容高度，Button 仍保留既有语义、禁用、ARIA、主题与变体合同。

AI 必须遵守：

- 先读取 Button 和 Steps 的计算高度与 overflow，确认裁切根因后再修复。
- 保持 buttonSample 组合，父级只覆盖排列、可读高度和内容溢出。
- 验收必须量测指标、标题、List 和根容器边界，不能只看页面没有横向滚动。

验证与遗留风险：

- 验证：`scripts/test-steps.js、feedback:generate/check（265 records）、site:build、check、pack:check 和 example:install 均通过；Steps 源码、miniprogram_dist 与示例安装产物四件套逐字节一致；微信 CLI 在 touristappid 权限查询 code 10 阻断。`
- 真机/兼容风险：合法 AppID 真机仍需验证 rpx 行高、Button Slot 样式隔离、横向滚动与读屏顺序。

## PUI-FB-0275 · NavigationMenu 垂直方向未占用右侧 Panel 内容区

- 原始记录：`feedback/records/pui-fb-0275-navigation-menu-vertical-panel-workspace.json`
- 范围：`component` / `navigation-menu`、`badge`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：垂直导航需要左侧菜单与右侧真实内容区并列，徽标完整可读。
- 实际问题：修复前 Panel 位于 Root rail 下方，右侧空白；用户截图中根菜单与 Badge 视觉上显得被截断。
- 决策：vertical 固定为两列工作区：左 Rail、右 Panel；horizontal 才继续由 placement 控制上下展开。Badge/Indicator 固定为不收缩的 Trigger suffix。
- 理由：垂直导航的可见内容需要与选择入口同时呈现，避免把右侧可用空间留空或让关键 Badge 被文本挤压。

AI 必须遵守：

- NavigationMenu vertical 必须同时显示 left rail 与 right Panel；不得沿用 horizontal 的 top/bottom Layer 定位。
- 关键 Badge/Indicator 是不收缩 suffix；窄宽时只能截断普通文字，不能裁掉状态。
- 跨端布局语义变化必须同步 WXML/WXSS、H5、API、合同、专项测试和安装产物。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`node scripts/test-navigation-menu.js`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：合法 AppID 真机仍需复核微信 CSS Grid 支持、scroll-view 高度、rpx 两列比例、fixed 遮罩、Badge suffix Slot 样式隔离与触摸命中。微信 CLI build-npm 已实际启动 IDE server，但 touristappid 的 AppID 详情查询报 code 10，未生成也未伪造 miniprogram_npm。

## PUI-FB-0276 · NavigationMenu Header 操作退化为透明图标

- 原始记录：`feedback/records/pui-fb-0276-navigation-menu-header-icon-button-visibility.json`
- 范围：`component` / `navigation-menu`、`button`、`icon`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：NavigationMenu Header 的可用返回与关闭应是清楚、可点击的 PUI 圆形图标按钮；根层不可返回时不得留下半透明幽灵按钮。
- 实际问题：第一次修复把 back/close 改为 outline 圆形 Button，却让根层 disabled back 长期显示；在小程序玻璃 Panel 上，返回与关闭退化成图标近乎不可见的半透明色块。
- 决策：根层 canBack=false 时用 56rpx/28px 无 Surface 空轨代替 disabled back；进入子层后才渲染实底 icon-only 返回按钮，关闭始终使用同尺寸实底 icon-only Button；H5 同步相同结构。
- 理由：标题平衡只需要几何占位，不需要伪装成不可用控件；真实操作必须同时具备明确图标、实底圆形 Surface 与可访问名称。

AI 必须遵守：

- Header 的 close/back 必须使用 iconButtonSample 或原生 pui-button + pui-icon 的圆形 Button 合同，不得以透明裸图标替代。
- 视觉检查必须读取最终 background、border、width/height 和 border-radius；通用 Button variant 的高特异性规则可能覆盖组件 CSS。
- 根层不可返回时使用同尺寸 inert spacer 平衡三列标题，禁止渲染 disabled ghost Button。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`node scripts/test-navigation-menu.js`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`wechatide build_npm`
- 真机/兼容风险：iOS/Android 真机仍需验证 pui-button external class 的 base/circle/icon-only 级联、56rpx 点击区、子菜单 back、Slot 样式隔离和触摸命中。

## PUI-FB-0277 · Sidebar 默认组合压缩为不可读窄列且尾部 Badge 被裁切

- 原始记录：`feedback/records/pui-fb-0277-sidebar-readable-preview-and-inline-badge.json`
- 范围：`component` / `sidebar`、`badge`、`button`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Sidebar 预览必须像真实可用的同层导航一样完整可读，不能把默认的图标、描述和徽标压成无法辨识的窄列。
- 实际问题：默认富信息组合被压缩为 112px 窄列，标题、描述和徽标难以阅读，且徽标出现右侧和顶部裁切。
- 决策：Sidebar 原生默认宽度调整为360rpx；H5 基础示例使用360rpx × 1128rpx可读基线，其余分区改为单列且不再使用窄列尺寸；标题使用正文中号 Token；尾部 Badge 显式 standalone。
- 理由：360rpx 在默认富信息组合下保留足够的文字宽度，1128rpx 让官网预览能展示真实局部滚动；窄宽度仍作为调用者显式选择，用于只显示短标题的场景。

AI 必须遵守：

- 先按默认开启的内容计算文字可用宽度，不能以窄列加省略号当作可读布局。
- 官网四区示例不得为了同屏排列把 Sidebar 压成不可读的多列。
- Badge 位于 Sidebar trailing 时必须使用 standalone，继续复用 badgeSample。
- Sidebar 只提供导航本体；官网可在组件外组合右侧消费者内容，但不得把它新增为 Sidebar API、Slot 或业务面板职责。

验证与遗留风险：

- 验证：`node scripts/test-sidebar.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信 scroll-view 惯性、sticky、rpx 实际排版、Button 触摸命中、样式隔离和读屏仍需合法 AppID 真机复核。

## PUI-FB-0278 · Sidebar 概览缺少消费者内容，选值结果不可见

- 原始记录：`feedback/records/pui-fb-0278-sidebar-consumer-content-workspace.json`
- 范围：`component` / `sidebar`、`cell`、`button`、`badge`、`icon`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Sidebar 预览右侧必须显示会随左侧选项切换的内容，让用户看见导航选择的真实结果。
- 实际问题：旧概览把四个示例纵向堆叠，没有右侧结果区，用户无法从视觉上确认左侧切换的价值。
- 决策：Sidebar 官网概览改为唯一全高工作区：左栏为真实 Sidebar，右栏为外部消费者内容；右栏使用 PUI CellGroup/Cell 呈现并由同一个 current value 驱动。Sidebar 公开 API 仍为24 Props、2 Events、0 Slots、0 Methods。
- 理由：这样既可让用户直观看到选择结果，也不把页面内容、路由或业务数据错误塞进 Sidebar 组件本身。

AI 必须遵守：

- 当导航项切换时，右侧消费者内容必须读取同一个受控或非受控 current value 真实更新。
- 右侧演示内容优先组合 PUI CellGroup 和 Cell，不要用静态提示文字冒充结果。
- Sidebar 仍只负责选值、局部滚动和集合状态；右侧内容不得新增为 Slot、Prop 或业务职责。

验证与遗留风险：

- 验证：`node scripts/test-sidebar.js`
- 验证：`node scripts/test-preview-overview-hierarchy.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：右侧消费者内容是官网演示层，不替代微信页面路由；真机仍需确认 Sidebar 自身 rpx、scroll-view、sticky、Button 触摸和读屏。

## PUI-FB-0279 · Steps 状态预览隐藏 PUI Icon，场景导航选中态不清晰

- 原始记录：`feedback/records/pui-fb-0279-steps-status-icon-and-scenario-selection.json`
- 范围：`component` / `steps`、`button`、`icon`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Steps 的状态演示要使用 PoemUI Icon，并让左侧场景导航清楚表明当前选中项。
- 实际问题：状态示例只显示黑点、红点和空圈，左侧方向/状态/边界入口没有足够清晰的选中反馈。
- 决策：保留 dot 作为 Steps 的公开主题能力，但状态场景使用 default indicator：完成显示 PUI check，错误显示 PUI error-circle，未开始保留序号。场景入口统一为 PUI Button + Icon 的 tablist/tab/tabpanel，并以 aria-selected、aria-current 和反色高对比选中态表达当前场景；390px 不隐藏 Icon。
- 理由：状态演示必须把状态语义看清，不能让主题简化掩盖 PUI Icon；导航的可见状态和读屏状态必须同步。

AI 必须遵守：

- 完成与错误状态优先调用 PUI check/error-circle Icon，禁止用字符或私有伪元素代替。
- 凡是 PUI Icon 能表达的可见图形，包括 Steps 场景入口，必须经 pui-icon 或共享 iconComponent；数字序号、dot 与连接线是组件进度语义，保留其原生表达。
- dot 可作为组件主题，但状态说明场景必须保留可见的 PUI 状态图形。
- 场景导航使用 PUI Button + Icon 时，选中项必须同步 aria-selected、aria-current 与高对比视觉状态；390px 不得把全部 Icon 隐藏。

验证与遗留风险：

- 验证：`node scripts/test-steps.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：需要合法 AppID 真机复核 pui-icon 样式隔离、rpx 指示器大小、触摸选择、横向滚动与读屏。

## PUI-FB-0280 · Tabbar 概览纵向堆叠且纯图标条目被错误回退为序号标签

- 原始记录：`feedback/records/pui-fb-0280-tabbar-scenario-icon-only-preview.json`
- 范围：`component` / `tabbar`、`button`、`badge`、`icon`、`preview-site`、`preview-device`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-23
- 用户目标：参照 TDesign 的清晰用法组织重做 Tabbar：不要把 Sidebar 或场景筛选器强塞进组件预览；纯图标、徽标、禁用与浮动状态都要完整可读。
- 实际问题：旧概览存在多实例挤压；错误的 Sidebar 场景导航又造成宽度压缩与错位；纯图标可见标签不符合 WXML 意图；tag 选中项虽有状态类，但最终计算背景被后置共享样式清空。
- 决策：概览改为五个 TDesign 式连续用法分区，不使用 Sidebar；每段维持可交互的真实 Tabbar，标题到示例 8px、段间 18px。label 是否存在以属性是否显式声明判断；tag active 用更具体且位于共享 Button 基线之后的选择器锁定品牌背景。
- 理由：文档型组件预览应由用法分区解释，而不是引入与组件无关的导航；每段都保持完整横向空间，H5/WXML 都准确表达条目语义。

AI 必须遵守：

- Tabbar 示例可以按 TDesign 式文档流连续分区；不要为筛选或切换目的强行加入 Sidebar。
- H5 与 WXML 都要用属性是否显式声明判断 label: ''，并为纯图标提供可访问名称。
- 徽标 0、dot、99+、disabled 与受控回写必须在真实浏览器场景中单独实点，不得只依赖静态 DOM。
- 活动态颜色或背景修复后必须读取最终计算样式，排查共享 Button/Switch 等后置规则的级联覆盖。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 DevTools CLI build-npm`
- 真机/兼容风险：需要合法 AppID 真机复核 fixed/placeholder、env(safe-area-inset-bottom)、rpx 分隔、触摸选择、backdrop-filter、样式隔离、系统低动效和读屏。

## PUI-FB-0281 · Tabbar 分隔默认值与单选值类型未和实际语义收口

- 原始记录：`feedback/records/pui-fb-0281-tabbar-single-value-and-split-default.json`
- 范围：`component` / `tabbar`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-23
- 用户目标：按 TDesign 对照继续收口 Tabbar，但不把不符合 PoemUI 一级目的地单选语义的数组能力带入公开 API。
- 实际问题：默认视觉与对照不一致，H5 分隔线也因共享 Button 基线不可见；类型文档宽于组件的单选实现，调用者可能误以为数组会形成多选或多活动项。
- 决策：split 默认 true，H5 分隔线显式恢复 1px 中性边界；value/defaultValue 与条目 value 收紧为单个 String/Number/Boolean，非法受控值无选中，非法非受控初值或条目值按既定回退处理。
- 理由：默认视觉应与参考基线一致，而一级目的地导航不应伪装成多选数据控件。

AI 必须遵守：

- 对照组件时同时核对 Prop 是否存在、默认值、类型和实现状态机。
- Tabbar 的 value/defaultValue 不得恢复数组、对象或函数多选暗示。
- 保留 0、字符串 0、false 和空字符串的严格身份，并在源码、H5、文档与测试同步。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：合法 AppID 真机仍需复核 rpx 分隔、fixed 安全区、触摸与读屏。

## PUI-FB-0282 · 错误将 Sidebar 组件预览诉求扩大为全局目录改造

- 原始记录：`feedback/records/pui-fb-0282-flat-catalog-no-sidebar-badge-misuse.json`
- 范围：`global` / `preview-site`、`sidebar`、`metadata`、`button`、`badge`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：保留官网全局 Sidebar；用户指出的问题仅属于 Sidebar 组件的 PreviewDevice 预览区，不能扩大为站点导航重构。
- 实际问题：错误修改曾移除全局 Sidebar 并把 #/catalog 作为详情页之外的目录入口，导致站点导航职责与组件预览职责混淆。
- 决策：撤回全局目录平铺与 #/catalog 改动，恢复全局 Sidebar；后续 Sidebar 相关视觉修改仅在 #/components/sidebar 的 PreviewDevice、Sidebar 专属合同、专项测试与其 H5 镜像中进行。
- 理由：全局站点导航和组件演示是两层不同职责。修复预览不能改变用户未要求改变的站点导航。

AI 必须遵守：

- 先区分站点 Shell、PreviewDevice 和组件自身三层 DOM；只修改用户点名的层级。
- 全局 Sidebar 是目录、搜索和反馈序号的站点导航，除非用户明确要求，不得因组件预览问题移除或替换。
- Sidebar 组件预览变更必须先阅读 SIDEBAR 合同和原始 Ledger，再同步专属测试；不能只靠全局目录截图推断。
- 若范围存在歧义，先恢复未授权的扩大改动，再以路由和截图确认目标。

验证与遗留风险：

- 验证：`node scripts/test-preview-navigation-search.js`
- 验证：`node scripts/test-preview-infrastructure-composition.js`
- 验证：`node scripts/test-design-contracts.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本项只恢复 H5 官网站点导航，不修改小程序 Sidebar 源码或公开 API。微信真机下 Sidebar scroll-view、sticky、rpx、Button 触摸与读屏仍需合法 AppID 验证。

## PUI-FB-0283 · 官网目录将中文辅助名误作 Badge/Tag

- 原始记录：`feedback/records/pui-fb-0283-catalog-chinese-label-not-badge.json`
- 范围：`global` / `preview-site`、`sidebar`、`button`、`badge`、`tag`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：官网全局目录右侧的中文说明应是低层级灰色文字，不应显示为 Tag 或 Badge。
- 实际问题：中文辅助名被渲染为 standalone Badge，视觉上误导为状态或数量标记。
- 决策：中文辅助名固定为 PUI Button default Slot 内的灰色文本；只有分区项数等真实计数保留 PUI Badge。
- 理由：中文名用于解释英文主名，不传达状态、数量或筛选结果；文本层级比 Badge/Tag 更符合其语义，且不改变目录按钮、筛选和无障碍名称。

AI 必须遵守：

- 目录英文主名后的中文辅助名必须是普通灰色文本，不能调用 tagSample 或 badgeSample。
- 分区总数等真实计数仍调用 badgeSample，不能为统一外观改成私有文本徽标。
- 修改目录 Slot 后保留 Button 的默认 Slot、aria-label、搜索语料和稳定反馈序号。

验证与遗留风险：

- 验证：`node scripts/test-preview-navigation-search.js`
- 验证：`node scripts/test-preview-infrastructure-composition.js`
- 验证：`node scripts/test-design-contracts.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：本项仅调整 H5 官网站点目录，不修改小程序 Sidebar 的公开 API、WXML 或 WXSS；微信真机不受此文本层级变更影响。

## PUI-FB-0284 · Tabbar 预览缩进、整高分隔与纵向节奏错误

- 原始记录：`feedback/records/pui-fb-0284-tabbar-edge-to-edge-inset-divider.json`
- 范围：`component` / `tabbar`、`preview-site`、`preview-device`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：普通 Tabbar 必须全宽贴合预览底部，不被画成四个拥挤的 Cell。
- 实际问题：预览视觉像被放进内层面板，整高分隔把四项误读为连续 Cell，52px 高度与内边距使图标、文字和分隔线显得过挤。
- 决策：normal Tabbar 保持 edge-to-edge；split 改为 item wrapper 的短 ::before 分隔；导航高度统一为 56px/112rpx。
- 理由：分隔仍保留一级目的地的可扫描边界，但不再改变导航的连续整体感；height 调整只改善内部节奏，不新增公开调参。

AI 必须遵守：

- shape=normal 的 Tabbar 不得继承 PreviewDevice shadow-safe 左右内距。
- split 只能用上下收口的中性短分隔，禁止整高 border-left。
- 图标、标签、活动指示器应在固定 56px/112rpx 导航高度内保留 Token 化垂直节奏。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run check`
- 验证：`npm run site:build`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 cli build-npm --project _example`
- 真机/兼容风险：微信真机尚未复核 112rpx 高度、safe-area、样式隔离和触摸热区。
- 真机/兼容风险：微信 CLI 已启动 IDE 但 touristappid 返回 code 10 不存在，miniprogram_npm 未生成；需要合法 AppID 后重新执行 build-npm。

## PUI-FB-0285 · Tabbar 徽标被共享 Button 溢出裁切

- 原始记录：`feedback/records/pui-fb-0285-tabbar-badge-overflow-clipping.json`
- 范围：`component` / `tabbar`、`button`、`badge`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-23
- 用户目标：Tabbar 的图标、文字和徽标应完整可见，不能因内部 padding 或层级错误被截断。
- 实际问题：视觉上徽标贴近图标上缘时会被截断，容易被误判为需要增大 padding 或调整 Badge 层级。
- 决策：仅在普通 Tabbar 根、条目和其内部 Button content 恢复 overflow:visible；round 胶囊保留边界裁切，Badge 继续使用原有 PUI Badge helper 和 WXML 组件树。
- 理由：问题是裁切边界而非内距或层级；组件级例外可以完整保留 Badge 定位，同时不让普通 Button 的长文案失去截断保护。

AI 必须遵守：

- Tabbar 内 PUI Badge 必须继续复用 badgeSample 和 pui-badge，不得降级成私有标记。
- 只有普通 Tabbar 根、条目与其 content 可覆盖共享 Button 的 overflow:hidden；round 胶囊和普通 Button 保持各自裁切合同。
- 修复后必须验证数字、0、dot 三类徽标以及图标和标签均完整可见。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信真机仍需复核 custom component 样式隔离下的 overflow 覆盖、徽标偏移和 safe-area。

## PUI-FB-0286 · Tabs 默认视觉被悬浮卡片与短导航高度削弱

- 原始记录：`feedback/records/pui-fb-0286-tabs-tdesign-visual-structure.json`
- 范围：`component` / `tabs`、`button`、`badge`、`icon`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-23
- 用户目标：24 Tabs 要具有清晰的组件特征，参考 TDesign 的真实视觉结构重新设计，而不是保留黑白小卡片式导航。
- 实际问题：原生与 H5 都把默认 Header 做成 40px 的悬浮 Surface，基础分类信息拥挤，视觉结构与 TDesign 文档中的基础/等距/图标/徽标/tag 分区不一致。
- 决策：默认 line 改为 96rpx / 48px 平面 Header，默认 split=true、spaceEvenly=true，活动项使用 PUI brand 色 32rpx / 16px 宽、6rpx / 3px 高指示器；公开 visual enum 为 line/tag，历史 pills 输入只映射为 tag；默认示例只放文字分类，图标/徽标迁入专属分区。
- 理由：这复用 TDesign 清楚的分类阅读结构，同时仍消费 PoemUI 的品牌、主题、PUI Button/Badge/Icon、严格值和受控合同。

AI 必须遵守：

- Tabs line Header 默认使用 96rpx / 48px 平面结构、split=true 与 PUI brand 短指示器；不得恢复默认外阴影或毛玻璃。
- Tabs 的图标和徽标不能挤进基础文字分类示例；分别在专属分区调用 PUI Icon 和 Badge。
- 公开 visual enum 仅使用 line/tag；不要重新公开 pills 或新增 card，除非有独立用户任务和全链路验收。
- 学习 TDesign 时先读官方页面和固定源码；官网页面无法抓取时要记录差异，不得用模型记忆补齐。

验证与遗留风险：

- 验证：`node scripts/test-tabs.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`npm run feedback:check`
- 真机/兼容风险：2026-07-23 实跑微信 CLI build-npm：IDE server 已启动，但 touristappid 查询返回 code 10（不存在此 AppID）；未生成 miniprogram_npm，也未手工伪造安装产物。
- 真机/兼容风险：微信 ScrollView 横向惯性、sticky、SelectorQuery 测量、rpx 指示器、触摸取消、样式隔离和系统低动效仍需真机复核。

## PUI-FB-0287 · Field 默认纵向双层输入框不符合可编辑单元格语义

- 原始记录：`feedback/records/pui-fb-0287-field-editable-cell-surface.json`
- 范围：`component` / `field`、`input`、`cell`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-23
- 用户目标：Field 的视觉应接近 Cell 的可编辑版本，而不是标签在上、输入框另起一层的普通表单布局。
- 实际问题：此前 Field 根透明且默认 top 布局，默认 Input 是第二个独立 Surface，形成纵向双层结构。
- 决策：Field 保持 12 Props、0 Events、5 Slots、0 Methods；默认 labelAlign 改为 left，根承担唯一 Cell 式行级 Surface，默认 PUI Input 普通态透明，top 保留给多行内容。
- 理由：不扩大 API 或接管子控件值即可获得清晰、紧凑的设置行，同时避免 Cell 外壳与 Input 外壳叠加。

AI 必须遵守：

- Field 默认 labelAlign=left；top 仅用于多行或长控件，不能把默认重新改回纵向堆叠。
- Field 承担 Cell 式唯一 Surface 时，嵌入的默认 PUI Input 普通态必须透明；不要形成双层背景、边框、圆角或阴影。
- Field 仍不接管 Slot 子控件的 value、disabled、readonly、loading、change 或 submit；这些能力只属于真实子控件或 Form。
- Field 与 Cell 都是非 elevation 行级元素，shadow 开关不得添加外投影；error、focus 与 divider 只能使用状态边界。

验证与遗留风险：

- 验证：`node scripts/test-field.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`npm run feedback:check`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project _example`
- 真机/兼容风险：合法 AppID 真机仍需复核 WXSS 共享样式隔离下 Input 扁平化、rpx 标签基线、focus/readonly 状态与五类 Slot。
- 真机/兼容风险：微信 build-npm 仍受 touristappid code 10 阻断；未生成也不会伪造 miniprogram_npm。

## PUI-FB-0288 · Field 与 Cell 维护两套行级视觉实现

- 原始记录：`feedback/records/pui-fb-0288-field-cell-shared-row-core.json`
- 范围：`component` / `field`、`cell`、`preview-site`、`form`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-23
- 用户目标：Cell 是 Field 的只读版；两者必须是一套字段行逻辑，而不是两份近似却会漂移的视觉实现。
- 实际问题：此前 Field 与 Cell 的根样式和 H5 镜像分别维护，后续调整高度、内距、圆角、主题或动效时可能发生视觉漂移。
- 决策：新增内部 field-row 原语：Field 为 editable，Cell 为 readonly。公开 Field 12 Props 和 Cell 28 Props、事件、Slot、Form relation 与导航选择能力均保持不变。
- 理由：用户只需学习一套字段行视觉；内部复用避免后续间距和主题漂移，同时不把 Form 或导航 API 混入另一个组件。

AI 必须遵守：

- 修改 Field 或 Cell 的行高、内距、背景、边框、圆角、毛玻璃、无外投影或动效时，先修改 field-row 内核，不得复制第二套根样式。
- Field 保留 Form relation、标签、帮助和校验反馈；Cell 保留导航、选择、媒体和只读内容，禁止跨组件透传 API。
- H5 Field 与 Cell 根必须共同使用 pui-field-row-preview，并分别标记 editable/readonly。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`npm run feedback:check`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project _example`
- 真机/兼容风险：合法 AppID 真机仍需复核共享 WXSS import、Field Input 样式隔离、Cell Slot/导航选择与 rpx 基线。

## PUI-FB-0289 · Tabs 徽标被通用 Button 裁切且原生锚点包住整段标签

- 原始记录：`feedback/records/pui-fb-0289-tabs-badge-readable-inline-layout.json`
- 范围：`component` / `tabs`、`badge`、`button`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-24
- 用户目标：Tabs 的徽标与禁用示例必须完整展示，不能再次出现数量徽标被截断的情况。
- 实际问题：通用 Button 文本裁切把 Tabs 的 Badge 一并当成可省略内容；原生 Badge 锚点结构也无法保证越界数量完整可见。
- 决策：Tabs 两端都将 Badge 设为标签文字后的独立 PUI 子组件；文字单独持有 overflow/text-overflow，Badge 固定不收缩。H5 在通用 Button 基线之后以更高优先级恢复 Tabs Button/content 的 visible overflow。
- 理由：保留 PUI Badge 与 Button 的真实组合，同时将可省略的次要标签文字和必须完整呈现的状态数量分离，避免用扩大宽度、缩小 Badge 或隐藏内容掩盖问题。

AI 必须遵守：

- 组合 Button、Icon、Badge 时，先明确谁可收缩：文字单独成为可截断节点，Badge 必须是独立 flex:none/standalone 节点。
- 组件级 overflow 修复必须检查其是否会被后置的共享 Button 基线覆盖，并以最终计算样式与 DOM Rect 验证。
- H5 组合结构变更若涉及 PUI 子组件锚点，同步审计 WXML；不得只补官网 CSS。

验证与遗留风险：

- 验证：`node scripts/test-tabs.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`npm run feedback:check`
- 真机/兼容风险：微信端仍需用合法 AppID 真机确认 pui-badge external class、Slot 布局、rpx 字体回流和 ScrollView 横向惯性。
- 真机/兼容风险：微信 CLI 若 touristappid 仍返回 code 10，不能将 H5 与安装产物验证伪报成 miniprogram_npm 成功。

## PUI-FB-0290 · 真实小程序首页未接入 PUI 组件链

- 原始记录：`feedback/records/pui-fb-0290-real-miniprogram-home-pui-composition.json`
- 范围：`component` / `miniprogram-home`、`config-provider`、`navbar`、`scroll-area`、`collapsible`、`cell`、`search`、`tabbar`、`image`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：真实微信小程序首页必须由既有 PUI 组件完成可用的导航、滚动、搜索、列表和底部导航闭环。
- 实际问题：旧首页没有真实 PUI 组件组合、没有搜索与目录状态，也没有标准 npm 依赖声明和首页专项门禁。
- 决策：仅在 miniprogram/ 实施真实首页组合；共享组件行为不变，因此不虚构 H5 首页镜像；标准 npm 构建交给微信开发者工具。
- 理由：用户目标是验证既有 PUI 组件在真实小程序页面中的组合与交互，不需要扩张共享组件 API，也不能以静态页面或手工 miniprogram_npm 替代实际 npm 流程。

AI 必须遵守：

- miniprogram/ 是当前唯一真实工程，禁止用 _example/ 代替页面开发或复制 PUI 源码。
- ScrollArea 高度必须来自窗口与真实 Navbar/Tabbar 节点测量，不能写死默认 320rpx、底部安全区或机型尺寸。
- 未完成页面只能用 disabled Tabbar 项保留信息架构，禁止假 change、假路由和 Toast 冒充完成。

验证与遗留风险：

- 验证：`npm install --ignore-scripts --no-audit --no-fund (miniprogram/)`
- 验证：`npm run site:build`
- 验证：`微信开发者工具：工具 → 构建 npm`
- 验证：`微信开发者工具：普通编译/模拟器 pages/index/index`
- 真机/兼容风险：微信开发者工具模拟器 URL 的运行时 AppID 与 miniprogram/project.config.json 不一致，需确认开发者工具项目缓存是否已切换到 wx23aa017375535746。
- 真机/兼容风险：原生胶囊不重叠、selector query 高度、安全区、390px 深浅色和真实触摸交互仍需微信真机复核。

## PUI-FB-0291 · Navbar 只预留胶囊宽度但没有镜像原生按钮位置

- 原始记录：`feedback/records/pui-fb-0291-navbar-capsule-mirror-geometry.json`
- 范围：`component` / `navbar`、`preview-site`、`miniprogram-home`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：自定义 Navbar 的左侧搜索按钮必须与微信右上原生胶囊关于屏幕中线对称，标题和纵向导航高度也必须来自真实平台几何。
- 实际问题：旧代码只保护标题宽度，没有计算左操作的镜像外边距、胶囊宽度区域或状态栏到胶囊的上下等距。
- 决策：保留现有 15 Props，不新增页面调参；共享 Navbar 改为完整平台几何计算，H5 同步左操作镜像位置，fixed placeholder 复用同一运行时高度。
- 理由：原生胶囊位置是设备和窗口运行态，必须由平台矩形派生；页面私有 padding 或固定高度无法证明对称，也会在窗口变化时漂移。

AI 必须遵守：

- windowWidth-left 只用于对称标题轨，不能单独证明左操作位置正确。
- 左操作必须以 windowWidth-right 为外边距，并在菜单 width 的镜像区域内居中。
- 内容高度必须使用 top/bottom/height 与 statusBarHeight，窗口尺寸变化后重新测量。
- 禁止用页面私有 margin、固定状态栏高度或重绘系统胶囊修补共享 Navbar。

验证与遗留风险：

- 验证：`node scripts/test-navbar.js`
- 验证：`npm run miniprogram:build`
- 验证：`微信开发者工具：工具 → 构建 npm`
- 验证：`微信开发者工具：普通编译`
- 真机/兼容风险：微信真机仍需确认真实胶囊中心差、状态栏高度、横竖屏重测、样式隔离与读屏。

## PUI-FB-0292 · Input 原生值需平台归一化且自动化注值与像素重绘分裂

- 原始记录：`feedback/records/pui-fb-0292-input-native-value-color.json`
- 范围：`component` / `input`、`search`、`miniprogram-home`、`documentation`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页 Search 输入的真实值必须在深浅色下可见，过滤、清空和恢复不能只在状态层生效。
- 实际问题：开发者工具自动化把像素重绘和小程序 input 事件拆成两条路径，无法仅凭单条自动化证明真机端二者同时成立；共享 Input 原生根原先也缺少完整平台样式归一化。
- 决策：不改变 Input/Search API 或受控状态机；Input 原生根直接消费主题文字/caret Token、独立 placeholder Token，并补齐固定版 TDesign 1.15.3 同类平台归一化。自动化分裂保留为真机风险。
- 理由：只保留源代码与固定参考能支持的共享改动；不以页面假文字、硬编码颜色或未证实的 nextTick 行为掩盖自动化限制。

AI 必须遵守：

- Input/Search 验收必须同时观察输入值与过滤结果，状态更新不等于文字可见。
- 原生 input 的 value 与 caret 直接消费 --pui-text-primary，placeholder-class 消费 --pui-text-placeholder；H5 input 直接消费 --text。
- Input 原生根明确归一化 display、box-sizing、margin、padding、background 和 border。
- 辅助功能注值只证明 AX/事件，逐键输入只证明当前模拟器像素时，不得宣称真机同一路径已通过。
- 禁止在消费者页面硬编码颜色或复制一套 Search 皮肤。

验证与遗留风险：

- 验证：`node scripts/test-input.js`
- 验证：`node scripts/test-search.js`
- 验证：`npm run miniprogram:build`
- 验证：`微信开发者工具：工具 → 构建 npm`
- 验证：`微信开发者工具：普通编译`
- 真机/兼容风险：微信真机仍需用真实软键盘确认文字显示与过滤在同一路径同时成立，并覆盖不同系统输入法、光标颜色、自动填充、disabled/readonly 及 dark theme。

## PUI-FB-0293 · 首页任务 Tabbar 引用了 Icon 清单中不存在的名称

- 原始记录：`feedback/records/pui-fb-0293-home-tabbar-invalid-icon.json`
- 范围：`component` / `miniprogram-home`、`tabbar`、`icon`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页、任务、我的三个纯图标 Tabbar 项必须全部由真实 PUI Icon 显示，禁用项也不能成为空白入口。
- 实际问题：任务项引用不存在的图标名称，导致底部三个目的地中间项缺失可见图形。
- 决策：只修正真实首页 item.icon 为 list-bullet，不改变共享 Tabbar/Icon API，不新增页面或事件。
- 理由：这是消费者配置错误，有现成 PUI Icon 可直接复用；任务和我的仍是未完成且 disabled 的信息项。

AI 必须遵守：

- Tabbar item.icon 必须来自当前 PUI Icon manifest，禁止凭通用名称猜测。
- 纯图标项继续显式 label 为空并提供 ariaLabel。
- 禁用目的地不添加假路由、假 change 或即将上线提示。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`微信开发者工具：普通编译`
- 真机/兼容风险：微信真机仍需确认三个图标的字体/基线、触摸命中和读屏名称。

## PUI-FB-0294 · Icon 资源卡只回写名称，无法直接复制图标名

- 原始记录：`feedback/records/pui-fb-0294-icon-library-card-copy-name.json`
- 范围：`component` / `icon`、`button`、`preview-site`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-24
- 用户目标：官网 Icon 资源库中点击任意图标后，应直接复制对应稳定图标名，方便开发者粘贴到 WXML。
- 实际问题：资源卡可筛选并回写 Icon 的 name，但没有复制动作、失败分支或连续点击的异步结果保护；首次修复后虽有行内状态文字，仍不足以作为明确的短时提示。
- 决策：资源卡的单次点击固定为 name 回写后复制同一稳定名称；反馈复用 Toast 的 H5 镜像并以 success/error 主题呈现，实际复制失败显示失败而不伪造成功，连续点击只允许最后一次结果更新反馈。
- 理由：名称选择与复制属于同一个资源发现任务；复用共享 clipboard helper 可同时覆盖安全上下文 Clipboard API 与 LAN HTTP 的真实 document.execCommand fallback。

AI 必须遵守：

- 图标资源库卡片必须由共享 PUI Button 和同源 iconComponent 组成，不能把图标 SVG 本体变成点击根。
- 复制必须复用 writePreviewClipboard 并依真实返回值以 Toast success 或 error 提示，不得只更新提示文字伪造成功。
- 异步复制连续触发时必须让旧请求结果失效，避免反馈名称与当前 name 不一致。

验证与遗留风险：

- 验证：`node scripts/test-icon.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 CLI build-npm（已尝试，touristappid code 10）`
- 真机/兼容风险：本次仅修改官网资源库，不改变小程序 Icon 四件套或微信事件；小程序 Canvas、src 着色和读屏风险仍按 PUI-FB-0051 由合法 AppID 真机复核。
- 真机/兼容风险：HTTP 局域网预览可能走 document.execCommand fallback；真实系统剪贴板权限策略仍取决于用户浏览器。
- 真机/兼容风险：微信 CLI 已实际尝试，但 touristappid 查询 AppID 详情返回 code 10，未生成也未伪造 miniprogram_npm。

## PUI-FB-0295 · Tag 全量 observer 在真实页面挂载后自触发更新循环

- 原始记录：`feedback/records/pui-fb-0295-tag-public-prop-observer-stability.json`
- 范围：`component` / `tag`、`divider`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：Divider 独立页面必须能真实挂载 PUI Tag 组合并保持可滚动，不因共享组件内部同步而阻塞页面。
- 实际问题：全量 observer 同时观察公开 Props 与内部派生 data，真实运行中 setData 再次触发同一 observer，形成自触发更新循环并阻塞页面。
- 决策：只观察 theme、variant、shape、icon、maxWidth、disabled、content、size、closable 和 colorScheme；attached 继续执行首次同步，内部派生字段不参与观察。
- 理由：显式输入列表保留全部公开视觉响应，同时切断内部 setData 自触发路径，不改变 Tag API、WXML、WXSS 或 H5 镜像语义。

AI 必须遵守：

- 任何 observer 内调用 setData 前必须确认写入字段不在该 observer 的依赖集合中。
- 真实页面挂载超时时应逐项隔离组合子组件，并在微信运行时复核，不得只扩大自动化超时。
- 消费者页面不得通过移除真实 PUI 组合掩盖共享组件的自触发循环。

验证与遗留风险：

- 验证：`node scripts/test-tag.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`node scripts/test-divider.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：开发者工具模拟器已证明观察器收敛，但不同基础库与 iOS/Android 真机的生命周期时序仍需复核。
- 真机/兼容风险：Tag 的触摸 Close、rpx 取整、Slot 投影和读屏不属于本页面挂载验收，继续保留真机风险。

## PUI-FB-0296 · 首页基础组件 Cell 缺少真实独立用法页面

- 原始记录：`feedback/records/pui-fb-0296-miniprogram-component-detail-pages.json`
- 范围：`component` / `cell`、`navbar`、`scroll-area`、`button`、`divider`、`icon`、`search`、`config-provider`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页 Button、Divider、Icon Cell 应显示右箭头并进入真实独立页面，详情页保持正确 Navbar、全高宽 ScrollArea，并展示 H5 同源用法。
- 实际问题：首页条目没有导航能力，组件用法只能从 H5 站点查看；小程序端不存在对应路由、页面壳、真实交互或独立滚动上下文。
- 决策：为三个组件增加真实路由；Cell 复用自身 arrow/url/jumpType；详情页共用 Navbar + ScrollArea 两行壳，不放 Tabbar；内容按 H5 概览分区并只使用 PUI 组件，所有可用动作真实回写。
- 理由：Cell 原生导航合同可避免页面重复处理点击；共用测量壳保证 Navbar 胶囊和剩余高度一致，H5 分区真相源避免两端用法信息架构漂移。

AI 必须遵守：

- 已有 Cell url/jumpType 能完成导航时不得在页面复制 wx.navigateTo 事件。
- 详情页只保留 Navbar 与唯一 ScrollArea，不为未完成目的地复制 Tabbar。
- 详情页用法分区以 H5 概览真相源为信息结构，但必须重新组合真实小程序 PUI 组件与平台事件。
- Navbar 返回必须执行 navigateBack，并为直接打开页面提供真实首页恢复路径。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 验证：`微信 CLI preview`
- 真机/兼容风险：开发者工具 390px 模拟器不等于 iOS/Android 真机；真实触摸滚动、软键盘、系统剪贴板、横竖屏安全区和读屏仍需复核。
- 真机/兼容风险：Icon 当前仅展示代表性资源而非 200 个完整图标库，符合本轮页面范围；后续扩展必须继续使用真实搜索与复制。
- 真机/兼容风险：Button/Divider 长内容已存在真实 ScrollArea，但不同真机的惯性滚动、渐变遮罩触摸穿透与字体回流仍未确认。

## PUI-FB-0297 · 实色主要与危险 Button 的内置 Icon 对比度不足

- 原始记录：`feedback/records/pui-fb-0297-button-solid-icon-contrast.json`
- 范围：`component` / `button`、`icon`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：Button 独立页面与外观 Popup 的主要图标按钮应与 H5 概览一致，在浅色和深色下都清晰可读。
- 实际问题：小程序 pui-icon 根把组合宿主的反色前景重置为正文黑色，refresh 落在黑色主要 Button 上不可见；页面若私自补白会掩盖共享组件缺陷。
- 决策：将小程序 Icon 根的默认颜色改为 inherit，由同一 Font Glyph 的 currentColor 继承页面或 Button 组合宿主前景；显式 color Prop 仍通过内联样式覆盖。不新增 Button 私有颜色，不在外观 Popup 写补丁。
- 理由：Icon 是展示叶子，默认颜色应属于消费方语义；inherit 同时覆盖 primary/danger Button、Navbar 与其他组合宿主，且与 H5 currentColor 运行时一致。

AI 必须遵守：

- primary/danger base Button 的内置单色 Icon 必须与反色正文保持一致。
- 只对实色 base 变体应用反色；outline、text、ghost 和独立 Icon 不得被全局反色。
- Icon 根不得把消费方的 currentColor 重置为 --pui-text-primary；显式 color Prop 才能覆盖继承色。
- 发现 H5 currentColor 与小程序 Font 运行时差异时，应先核对字形是否存在，再检查组合前景继承链，并同步合同、测试、Ledger 和安装产物。

验证与遗留风险：

- 验证：`node scripts/test-icon.js`
- 验证：`node scripts/test-button.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：开发者工具截图不能替代 iOS/Android 真机对 Icon Font currentColor 继承和字形抗锯齿的视觉复核。

## PUI-FB-0298 · 组件库继续调用已弃用的 wx.getSystemInfoSync

- 原始记录：`feedback/records/pui-fb-0298-deprecated-system-info-migration.json`
- 范围：`global` / `platform-runtime`、`icon`、`navbar`、`sheet`、`swipe-cell`、`rate`、`watermark`、`tabs`、`popover`、`direction`、`virtual-list`、`overlay`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：微信开发者工具不再输出 wx.getSystemInfoSync 已弃用告警，组件库应改用当前官方拆分接口。
- 实际问题：组件分别从已弃用的聚合接口读取 windowWidth、windowHeight、statusBarHeight、language、theme 或 platform，导致真实开发者工具控制台报告弃用警告。
- 决策：新增 platform-info 共享读取器：窗口几何统一 getWindowInfo，设备平台统一 getDeviceInfo，语言和主题统一 getAppBaseInfo；不调用无业务需要的 getSystemSetting 或 getAppAuthorizeSetting。
- 理由：按字段使用官方拆分接口可消除弃用告警，保持读取最小化，并让失败回退由每个组件既有安全默认值负责。

AI 必须遵守：

- 窗口宽高、状态栏和安全区使用 getWindowInfo。
- platform 使用 getDeviceInfo，language/theme 使用 getAppBaseInfo。
- 只有真实需要系统设置或授权状态时才调用 getSystemSetting 或 getAppAuthorizeSetting。
- 新组件不得直接读取平台信息；优先复用 common/utils/platform-info，并以专项扫描防回归。

验证与遗留风险：

- 验证：`node scripts/test-platform-info.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 验证：`node /tmp/pui-verify-home-button.js`
- 验证：`node /tmp/pui-verify-icon.js`
- 真机/兼容风险：开发者工具验证不能替代 iOS/Android 真机对不同基础库、窗口变化和系统主题的确认。
- 真机/兼容风险：低于当前拆分接口支持范围的历史基础库不再调用旧接口；会使用组件既有安全默认值，兼容范围需由消费者按目标基础库确认。

## PUI-FB-0299 · 首页搜索入口需要圆形 Combobox 与可选背景模糊遮罩

- 原始记录：`feedback/records/pui-fb-0299-home-combobox-overlay-blur.json`
- 范围：`global` / `combobox`、`overlay`、`miniprogram-home`、`preview-site`、`theme`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页左上搜索入口打开居中的圆形 pui-combobox，并通过 pui-overlay 隔离背景；当前不接入业务搜索，Overlay 必须让调用方显式选择 blur。
- 实际问题：原首页把 pui-search 和筛选结果放进内容滚动区，Overlay 没有 blur Prop，Combobox 不能声明满圆 Trigger。
- 决策：Combobox 新增 shape=rectangle|round，round 只作用于 Trigger；Overlay 新增 blur:Boolean，固定消费 --pui-overlay-blur。首页以 searchOverlayVisible 受控 Overlay，不保存查询词、不筛选目录、不伪造搜索结果。
- 理由：将形状与模糊收敛为组件公开能力，首页只组合既有组件和状态，避免页面穿透修改 PUI 子组件几何或用私有 backdrop-filter 复制遮罩。

AI 必须遵守：

- Combobox 的 round 只改变 Trigger，Panel 继续使用语义圆角。
- Overlay blur 必须是显式 Boolean Prop，并消费共享 --pui-overlay-blur Token。
- Overlay 不因 blur 增加第二事件、关闭策略、业务状态或第二个 Surface。
- 未授权业务搜索时，页面只管理 Overlay 显隐，不创建筛选结果、假入口或成功提示。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：微信真机仍需确认 fixed Overlay、backdrop-filter 性能与支持度、catchtouchmove、Slot 投影、系统低动效和读屏。

## PUI-FB-0300 · Overlay 低动效通配选择器导致微信 WXSS 编译失败

- 原始记录：`feedback/records/pui-fb-0300-overlay-reduced-wxss-compatibility.json`
- 范围：`global` / `overlay`、`miniprogram-home`、`miniprogram-dist`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页通过 pui-overlay 打开圆形 Combobox，且必须在真实微信开发者工具中可编译运行。
- 实际问题：Overlay 的低动效规则将根选择器与通配后代选择器并列，导致整个首页渲染层无法编译，自动化也无法取得页面元数据。
- 决策：低动效规则只作用于 Overlay 自身遮罩根；Slot 内容继续由其各自组件的 reduceMotion 或系统低动效合同控制。
- 理由：Overlay 唯一自有动效是 opacity，去除不可编译的后代选择器即可保留组件职责并让首页重新可编译。

AI 必须遵守：

- Overlay 低动效首先保证自身 opacity 动画，Slot 后代的低动效由各自组件管理。
- 当前微信 WXSS 编译器报错的通配后代选择器不能保留为兼容代码。
- 组件构建通过不等于页面渲染层已编译；实际引用后仍需开发者工具验证。

验证与遗留风险：

- 验证：`node scripts/test-overlay.js`
- 验证：`npm run check`
- 验证：`npm run site:build`
- 验证：`微信 CLI build-npm`
- 验证：`微信开发者工具实际编译`
- 真机/兼容风险：真机仍需确认 Overlay backdrop-filter 支持、低动效与复杂 Slot 内容的视觉过渡。

## PUI-FB-0301 · Combobox 延后展开时需使用真实 change 事件并允许满宽搜索行

- 原始记录：`feedback/records/pui-fb-0301-combobox-trigger-input.json`
- 范围：`global` / `combobox`、`input`、`miniprogram-home`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页点击普通 Combobox Trigger 后先显示 Overlay，再展开 Panel；Panel 中仅保留满宽真实搜索框和三个可跳转组件候选，不能保留底部操作按钮。
- 实际问题：Combobox 与 Overlay 同帧展开，且全屏 Slot 根截获了所有 tap，输入型 Trigger 偏离当前交互决策，嵌入 Input 的绑定事件不正确，Panel 搜索行也被固定收起按钮占用。
- 决策：删除 triggerInput 方案；新增 showPanelClose:Boolean=true。Panel 内 PUI Input 统一 bind:change 到 onQueryInput。首页先受控显示 Overlay，并复用 Overlay 默认 500ms 时长延后设置 Combobox visible=true；遮罩关闭或候选选择都会取消延时。Slot 内容改为中部绝对定位、只包裹 Combobox，catchtap 仅阻止候选区冒泡；其余遮罩空白区由 Overlay click({visible:false}) 真实关闭。传入 show-panel-close=false，不传 footer；每次打开随机排列 Button、Divider、Icon，选择后关闭 Overlay 并 wx.navigateTo。
- 理由：保留 Combobox 的单一 Trigger/Panel 结构与三重受控能力，让遮罩先完成进入、搜索框再展开；候选及跳转均对应当前可运行页面。

AI 必须遵守：

- PUI Input 的值回写事件是 change；组合父级必须绑定真实公共事件。
- 普通 Trigger 与 Panel 内唯一搜索 Input 共同构成自动展开 Combobox，不得把 Input 伪装成 Trigger。
- 首页候选必须映射到真实可运行路由；没有对应页面时不得制造假导航或应用按钮。
- 需要遮罩后展开内容时，页面必须复用显式 Overlay duration 并在关闭、选择和卸载时取消延时；Overlay 自身仍只发布 click 请求。
- Overlay Slot 内的 catchtap 容器只能包裹实际交互内容；不得以全屏或 min-height:100% 布局截获遮罩空白区关闭。

验证与遗留风险：

- 验证：`node scripts/test-combobox.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：真机仍需确认 iOS/Android 软键盘、焦点、清空命中、Overlay 触摸阻断、backdrop-filter 性能与读屏。

## PUI-FB-0302 · Combobox round Trigger 与 Panel 使用不一致圆角 Token

- 原始记录：`feedback/records/pui-fb-0302-combobox-radius-token-unification.json`
- 范围：`global` / `combobox`、`miniprogram-home`、`preview-site`、`theme`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：Combobox 的 Trigger 与下方展开 Panel 必须使用一个统一的圆角 Token，不能显著不一致。
- 实际问题：round 仅影响 Trigger，Panel 固定 medium，造成视觉断裂。
- 决策：Combobox 根新增 --pui-combobox-radius：默认映射 --pui-radius-medium，shape=round 映射 --pui-radius-xxlarge；Trigger 与 Panel inner 都只消费该变量。H5 使用等价 --pui-combobox-preview-radius。
- 理由：xxlarge 对标准高度 Trigger 仍近似满圆，同时让更高的 Panel 保持可读的圆角矩形；单一映射也会自动跟随 largeRadius Token。

AI 必须遵守：

- Trigger 与 Panel inner 的 border-radius 必须共同消费 --pui-combobox-radius 或 H5 等价变量。
- round 形态使用 xxlarge 而非 round，保证 Trigger 近似满圆、Panel 仍可读。
- 圆角 Token 修改必须同步小程序、H5、专属合同、专项测试、Ledger 和分发产物。

验证与遗留风险：

- 验证：`node scripts/test-combobox.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：iOS/Android 真机仍需确认不同字体、基础库和 largeRadius 外观下的圆角裁切与模糊 Surface。

## PUI-FB-0303 · 首页 Tabbar 需提供真实图标的设置目的地并保持禁用边界

- 原始记录：`feedback/records/pui-fb-0303-home-tabbar-settings-destination.json`
- 范围：`component` / `miniprogram-home`、`tabbar`、`icon`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页底部 Tabbar 增加第四项，最右侧为设置；尚无设置页时不得产生假路由或状态切换。
- 实际问题：首页 Tabbar 只有三个目的地，未提供设置项。
- 决策：在首页 TABBAR_ITEMS 末尾加入 value=settings、icon=palette、ariaLabel=设置、disabled=true 的纯图标项；不新增设置页、路由、change 事件或提示。
- 理由：palette 已存在于 PUI Icon manifest，语义上指向设置中的外观入口；禁用状态如实反映设置页尚未实装。

AI 必须遵守：

- Tabbar item.icon 必须来自当前 PUI Icon manifest。
- 纯图标项继续显式 label 为空并提供 ariaLabel。
- 未实装目的地必须 disabled，且不添加假路由、假 change 或提示。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 真机/兼容风险：微信真机仍需确认四个图标的基线、触摸命中和读屏名称。

## PUI-FB-0304 · Tabbar 纯图标项投影层与等分轨道导致四项横向偏移

- 原始记录：`feedback/records/pui-fb-0304-tabbar-icon-slot-alignment.json`
- 范围：`component` / `tabbar`、`button`、`icon`、`preview-site`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页四项纯图标 Tabbar 必须在 390px 和底部安全区内等分、居中并完整可见。
- 实际问题：纯图标项保留了 Button 固定生成的空默认内容区，仍和 icon Slot 一起参与水平排布；同时各等分轨道与 block Button 的可收缩边界不完整，四项图标整体右移，最右设置被裁切。
- 决策：Tabbar 保持普通组件节点；图标与 Badge 均使用 icon Slot，标签使用默认 Slot。显式空标签项传入 Button iconOnly，在 Button 的真实组件树移除空默认内容/后缀区块；item-wrap 内的 PUI Button 外部宿主自身使用 button-host Flex 等分轨道，内置 Button 以 block 填满。H5 buttonSample 按相同分工镜像。页面仅以全宽普通 view 测量 Tabbar 高度，不参与横向视觉几何。
- 理由：Button 的真实 icon Slot 保留 Badge 定位能力，空内容轨道退出后纯图标与活动指示器共用同一等分中心；把组件宿主而不是额外 view 放入等分轨道后，内置 block Button 以真实可用宽度排布，无需页面私有偏移或新增 Tabbar API。

AI 必须遵守：

- Tabbar 使用 icon Slot 时，显式 label:'' 的纯图标项必须传入 Button iconOnly，使空默认内容/后缀轨道从真实组件树移除；item-wrap 内的 PUI Button 外部宿主应以透明满宽 Flex 子项固定等分轨道，并让 Button block 填满它。
- 小程序 SelectorQuery 不能直接测量常规自定义组件节点时，消费者可以使用全宽普通 view 包装器测量高度，但不能在该层添加横向定位或宽度补丁。
- 纯图标 Tabbar 必须让图标中心和活动指示器中心落在同一等分轨道。
- 跨端修复 Slot 几何时，同步原生 WXML、H5 helper/镜像、合同、专项测试、Ledger 和安装产物。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：iOS/Android 真机仍需确认 env(safe-area-inset-bottom)、外部 Slot 样式隔离、四项触摸热区、图标基线与读屏名称。

## PUI-FB-0305 · Block Button 未清除默认最小宽度导致等分导航横向溢出

- 原始记录：`feedback/records/pui-fb-0305-button-block-min-width-flex-constraint.json`
- 范围：`component` / `button`、`tabbar`、`preview-site`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：四项纯图标 Tabbar 在 390px 内等分且完整可见，不能被内部 Button 最小宽度撑出屏幕。
- 实际问题：block 仅写入 width:100%，没有 min-width:0，继承 Button 基础最小宽度并撑开窄等分布局。
- 决策：pui-button--block 在小程序与 H5 同步使用 width:100% + min-width:0；Tabbar 不使用偏移、缩放、私有 padding 或减少目的地来掩盖问题。
- 理由：block 的语义就是占满当前父级而非强制保留常规按钮宽度；这一修复同时改善所有 Grid/Flex 窄轨道中的 PUI Button。

AI 必须遵守：

- pui-button--block 必须同时声明 width:100% 与 min-width:0。
- 等分导航溢出先检查子组件最小宽度，不用页面偏移或缩放补偿。
- 共享 Button 几何变更必须同步小程序、H5、合同、专项测试、Ledger 和安装产物。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：iOS/Android 真机仍需确认实际安全区、字体回流、Button 触摸热区、Slot 样式隔离与读屏。

## PUI-FB-0306 · 小程序 Icon 页代表性复制卡未覆盖完整图标目录

- 原始记录：`feedback/records/pui-fb-0306-miniprogram-icon-full-catalog-grid.json`
- 范围：`component` / `icon`、`search`、`scroll-area`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：Icon 独立页的搜索框必须全宽，全部真实 PUI 图标以三列纯图标网格展示，并通过目录与分类文案提供足够的浏览引导。
- 实际问题：旧页面以私有 12 项样本数组和复制卡片代替完整目录，信息密度、搜索范围与用户目标不一致。
- 决策：小程序 Icon 页直接消费已安装 poemui-miniprogram 的 icon-font-catalog，按真实分类分区；搜索过滤全量目录，页面与分类标题提供文案与数量，网格叶子只保留 pui-icon 与可见名称。
- 理由：npm 图标映射是安装端唯一可复现的目录真相源，避免手写或复制 200 项名单；纯图标网格保持浏览密度，而目录文案和分区留白保证用户不面对裸图标墙。

AI 必须遵守：

- 图标目录来自 npm 已构建的 icon-font-catalog 时，页面不得维护平行图标名单。
- 用户要求纯图标网格时，叶子只渲染 pui-icon；名称、复制卡片和无对应交互的 Button 一并移除，但页面与分区仍须提供可读浏览文案。
- 页面组合变更不改变共享 Icon API 时，不为同步而修改 H5 图标资源库。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`node scripts/test-icon.js`
- 验证：`node scripts/test-search.js`
- 验证：`node scripts/test-scroll-area.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`微信开发者工具普通编译`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：iOS/Android 真机仍需确认 200 图标长列表的惯性滚动、Search 软键盘、SVG 加载和读屏 ariaLabel。
- 真机/兼容风险：当前开发者工具辅助功能 set_value 会显示输入值但不派发小程序 Search change，不能单独作为筛选真机证据；页面运行态专项测试已验证 arrow 过滤与清空恢复。
- 真机/兼容风险：H5 图标资源库的名称复制能力由 PUI-FB-0294 与 ICON 合同单独约束，本轮未改动。

## PUI-FB-0307 · Search 自定义组件宿主未声明全宽导致调用端缩窄

- 原始记录：`feedback/records/pui-fb-0307-search-full-width-host.json`
- 范围：`component` / `search`、`input`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：在 Icon 小程序详情页中，PUI Search 必须占满 ScrollArea 的可用内容宽度，不能只让内部字段相对缩窄宿主达到 100%。
- 实际问题：调用者看到的是占满缩窄宿主的字段；补齐 Search 宿主后，内部 PUI Input 宿主仍收缩，Icon 页面继续显示明显短于内容宽度的搜索框。
- 决策：Search 在小程序 WXSS 使用 :host 声明 block、width/max-width:100%、min-width:0，并让内部 PUI Input 宿主及根作为 flex:1 占用剩余宽度；H5 镜像根同步全宽可收缩。Icon 页面只保留正常全宽布局行，不维护跨组件视觉补丁。
- 理由：宽度是 Search 组件自身的布局职责，必须同时覆盖 Search 与其内部 Input 两层自定义组件宿主；放在共享组件能够让任意页面组合获得一致行为，并符合微信组件宿主样式边界。

AI 必须遵守：

- 当页面内 PUI 字段缩窄时，先区分调用者 wrapper、组件宿主和组件内部根三层几何。
- 共享组件宿主宽度问题应使用组件自身 :host 修复，并同步 H5、合同、测试和安装产物。
- 禁止在页面用 pui-search 标签选择器或复制 Input 皮肤绕过组件样式隔离。

验证与遗留风险：

- 验证：`node scripts/test-search.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 验证：`微信开发者工具普通编译`
- 真机/兼容风险：iOS/Android 真机仍需确认自定义组件 :host 几何、软键盘、长搜索词、深浅色和系统字体回流。

## PUI-FB-0308 · 首页未启用 Tabbar 已有 tag 与 round 视觉形态

- 原始记录：`feedback/records/pui-fb-0308-home-tabbar-tag-round-composition.json`
- 范围：`component` / `tabbar`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页底部导航不应退化为弱短指示器，应调用 PUI Tabbar 已有的更完整视觉形态，同时保持四等分、安全区、非 fixed 根布局和真实禁用语义。
- 实际问题：组件具备可用形态，但首页把它固定为 normal/normal，视觉表现弱于可复用组件已有能力。
- 决策：首页 Tabbar 改为 theme=tag + shape=round；home-tabbar 保持用于真实高度测量的普通 view，并仅使用 panel/content Token 提供外部留白。
- 理由：theme 和 shape 是 Tabbar 已公开且已测试的组件 API；页面只承担卡片在根布局中的摆放，四等分、选中、禁用、安全区和外观开关继续由组件负责。

AI 必须遵守：

- Tabbar 的 theme=tag 与 shape=round 职责不同，允许组合使用，不要用页面 CSS 模拟。
- 非 fixed 的三行根布局仍由普通 view 测量 Tabbar 高度，round 外部留白不能变成 fixed 或横向补丁。
- 页面组合既有 Tabbar Props 不改变共享组件 API 时，不为同步而改 H5 组件预览。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`微信开发者工具普通编译`
- 真机/兼容风险：iOS/Android 真机仍需确认 round 容器在不同安全区、全局 bordered/shadow/frostedGlass/largeRadius 与字体回流下的视觉和触摸区。

## PUI-FB-0309 · 首页菜单改用底部 Popup 承载全局外观控制与果味组合

- 原始记录：`feedback/records/pui-fb-0309-home-appearance-overlay-and-fruit-preset.json`
- 范围：`global` / `miniprogram-home`、`navbar`、`overlay`、`popup`、`switch`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页 Navbar 左侧同时提供搜索和菜单；搜索保留现有浮层，菜单改为从底部弹出的 Card 版受控 Popup，提供 H5 同源的外观控制、一键果味开关和恢复默认图标按钮；外观首次无本地存储时使用默认配置，后续修改与重置必须持久化。
- 实际问题：搜索入口曾占用菜单语义，外观控制只能在 H5 官网操作；首次菜单使用居中 Overlay，不符合底部 Popup 的用户动线。若直接把渐变塞进 visualConfig 会破坏固定公共 Store 合同。
- 决策：Navbar 左侧组合独立 Search/Menu 图标按钮；搜索保留受控 blur Overlay，外观改为 `placement=bottom + card=true + showHeader + closeBtn + blurOverlay` 的受控 Popup。Card 只由 Popup 自身提供，内部 CellGroup 不重复标题或第二张卡片；Header 左侧通过 `theme=primary` 的真实 PUI Button refresh 图标执行重置，右侧继续由 Popup 提供默认关闭按钮。组件视觉五项写 visualConfig，果味直接写/推导现有字段；渐变保留在首页画布偏好；两份 Store 均在首次无存储时回退公开默认值，修改和重置均持久化。
- 理由：这复用既有 PUI Popup、Button、Cell 与 Switch 的职责边界和 H5 已确认的组合语义，同时遵守 visualConfig 的固定字段、Provider 单一职责与渐变只属于画布的边界。

AI 必须遵守：

- Navbar 的每个图标操作都使用独立 PUI Button + Icon、准确 ariaLabel 和真实事件，不能复用错误语义。
- 搜索 Overlay 与外观 Popup 必须分别由父级受控、相互排斥，并让遮罩关闭请求真实回写到对应 visible 状态。
- 底部外观面板使用 Popup 的 placement=bottom、card=true、visible-change、closeBtn、blurOverlay 与 preventScrollThrough；Popup 是唯一 Card Surface，内部 CellGroup 不重复 card 或标题。
- 边框、阴影、毛玻璃、大圆角和主题只通过 visualConfig 写入；不能复制页面级视觉总控对象。
- 果味开启为 shadow/frostedGlass/largeRadius 开、bordered/gradient 关，关闭恢复标准组合且 theme 不变；checked 必须按真实当前值推导。
- 渐变只用于页面画布；禁止加入 ConfigProvider、visualConfig 或组件 Surface。
- Header 左侧重置必须使用 theme=primary 的 PUI Button + refresh Icon，并同时调用 visualConfig.reset 与画布偏好 false；首次无本地存储必须恢复公开默认值，不能用页面私有默认对象代替 Store。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`node scripts/test-page-background-preference.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具普通编译`
- 真机/兼容风险：iOS/Android 真机仍需确认原生胶囊镜像左轨内双按钮触摸区、Card Popup backdrop-filter、遮罩关闭、重置后 storage 写回、深浅色/安全区、果味组合和读屏。

## PUI-FB-0310 · 首页 Tabbar 应使用 normal 全宽与微分隔变体

- 原始记录：`feedback/records/pui-fb-0310-home-tabbar-normal-split-composition.json`
- 范围：`component` / `tabbar`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页底部导航要采用既有 Tabbar 的全宽短横选中态，并在四个图标目的地之间保留细微分隔，不要使用圆角卡片或弱色标签面。
- 实际问题：首页使用 tag/round 卡片组合，活动项为弱色面，外层还增加了仅服务圆角卡片的页面内距。
- 决策：首页改用 theme=normal、shape=normal、split=true，并移除圆角卡片专用的页面边距。
- 理由：三项均为已公开、已有双端合同的 Tabbar Props；页面只选择变体，不复制选中态或分隔线。

AI 必须遵守：

- 用户指定全宽短横和微分隔时，首页使用 theme=normal、shape=normal、split=true。
- Tabbar 的活动态、分隔、等分和安全区均属于共享组件职责，页面只组合 Props。
- 改变页面组合不改变共享行为时，不要虚构 H5 首页同步。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`微信开发者工具热重载`
- 真机/兼容风险：iOS/Android 真机仍需确认实际 safe area、四项触摸热区、rpx 分隔线、外观切换和读屏。

## PUI-FB-0311 · Navbar 左 Slot 图标按钮的可见性与点击命中

- 原始记录：`feedback/records/pui-fb-0311-navbar-left-slot-multiple-actions-clipping.json`
- 范围：`component` / `navbar`、`button`、`icon`、`miniprogram-home`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页 Navbar 左上必须同时可见并可点击搜索与菜单两个真实 PUI 图标按钮，同时继续与右上微信原生胶囊保持镜像对称。
- 实际问题：两个按钮可渲染，但用户报告搜索按钮始终不能打开搜索布局；此前专项测试只锁定了几何和 WXML 绑定，未锁定跨命名 Slot 的 click 事件选项。
- 决策：Navbar 左 action 继续允许镜像轨内的 Slot 内容可见；首页双按钮分组继续填满轨道；PUI Button 的 click 明确为 bubbles + composed，使搜索与菜单可以直接使用各自真实 bind:click，H5 组合预览继续展示两个图标操作。
- 理由：多个左侧操作仍属于 Navbar 的既有 left Slot。点击事件应由 Button 作为可组合的叶子操作向消费者透传，不应为 Navbar 新增业务 API，也不应由页面叠加私有 tap 兜底。

AI 必须遵守：

- 多个 left Slot 操作保持 PUI Button + Icon、各自 ariaLabel 和真实 click；被放入复合命名 Slot 的 Button click 必须使用 bubbles:true、composed:true。
- Navbar 负责镜像轨几何，页面分组只填满并居中该轨，不写左右偏移。
- 修复 Slot 几何时同步原生 WXSS、H5 镜像、合同、专项测试、Ledger、dist 和示例安装。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`node scripts/test-navbar.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具热重载`
- 真机/兼容风险：当前开发者工具焦点是另一项目，尚未在 PoemUI 模拟器重新实点；iOS/Android 真机仍需确认不同原生胶囊宽度、横竖屏、Slot 事件组合、双按钮热区和读屏。

## PUI-FB-0312 · 小程序 Icon 网格图标过小且缺少名称

- 原始记录：`feedback/records/pui-fb-0312-miniprogram-icon-grid-size-and-label.json`
- 范围：`component` / `icon`、`miniprogram`、`scroll-area`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：小程序 Icon 独立页的图标展示应在现有基础上放大两个尺寸档位，并在每个图标下方显示可读名称。
- 实际问题：网格图标尺寸为 40rpx，且没有名称文本。
- 决策：在不改变共享 Icon API、完整 npm icon-map、三列网格和唯一 ScrollArea 的前提下，将页面图标从 40rpx 提升至 56rpx，并在下方添加完整可换行的名称文本。
- 理由：当前请求覆盖 PUI-FB-0306 对小程序页面纯图标叶子的旧展示取舍；56rpx 对应 40→48→56 两个既有 8rpx 递进，名称文本消除仅凭图形猜测的识别负担。

AI 必须遵守：

- 用户对独立页面展示密度的最新明确要求覆盖此前纯图标展示取舍。
- 图标尺寸以数值 rpx 传入 pui-icon；40rpx 增大两个 8rpx 档位应为 56rpx。
- 名称属于关键识别信息，必须完整换行显示；不要使用 ellipsis 或将图标伪装成 Button。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`微信开发者工具 RC 2.02.2607161：自动热重载并打开 pages/components/icon/index`
- 真机/兼容风险：需在 390px 微信模拟器与真机复核长名称换行后的列表密度、惯性滚动、深浅色对比和读屏。

## PUI-FB-0313 · Tabbar 条目泄露 PUI Button 默认卡片表面

- 原始记录：`feedback/records/pui-fb-0313-tabbar-transparent-button-surface.json`
- 范围：`component` / `tabbar`、`button`、`preview-site`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：normal 全宽 Tabbar 的每个目的地必须是平整的图标导航项，只保留活动短横和微分隔，不能露出独立 Button 的圆角卡片、边界或阴影。
- 实际问题：Tabbar 的 normal 样式仍泄露 Button 自身背景；H5 的后置 disabled 规则还可恢复中性边框，视觉被误读为一组独立小按钮。
- 决策：PUI Button 保持受控 variant=transparent + surface=transparent。前者表达无底色、无边界、无外投影的 Button 视觉，后者在自身原生根强制设定 transparent background-color 并清除 ::after 边框，使 Tabbar 根维持唯一 Surface；H5 同时让禁用条目越过通用 disabled 表面回退。两者都保留原生 button 的交互、禁用、slot 与无障碍语义。所有主题的活动与非活动条目都保持透明，活动项仅以品牌短横、文字权重与语义状态区分。
- 理由：透明表面属于 Button 在已有唯一容器 Surface 内的明确组合边界，且必须在平台原生根收口；页面 CSS、行内 style 或跨组件 custom-class 都不是修复路径。

AI 必须遵守：

- Tabbar 条目固定组合 PUI Button 的 variant=transparent + surface=transparent，不用页面 CSS 或行内 style 擦除 Button Surface。
- surface=transparent 必须在 Button 原生根明确覆盖 background-color 并移除 ::after；H5 复合容器须拦截共享 Button 的 disabled 表面回退；不要假定透明 shorthand 会覆盖平台默认底色。
- transparent Button 仍保留真实原生 button、disabled、click、slot 与 aria；不能改成 view 或无事件图标。
- normal/tag 的活动与非活动 Tabbar 条目都必须透明；不得以 item-wrap、Button 后置规则或全局外观开关恢复任何条目底色。
- 修改共享 Button 表面边界时同步原生、H5、合同、API、专项测试、Ledger、dist、示例安装与微信 npm 产物。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`node scripts/test-tabbar.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：iOS/Android 真机仍需确认安全区、原生 Button hover、样式隔离、tag 活动 Surface、四项触摸热区与读屏。

## PUI-FB-0314 · 原生 Input 与 Textarea 聚焦后立即丢失焦点

- 原始记录：`feedback/records/pui-fb-0314-native-input-focus-retention.json`
- 范围：`component` / `input`、`textarea`、`search`、`combobox`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：小程序中的所有文字输入入口在用户点击聚焦后必须保持焦点和键盘，直到用户实际失焦或显式调用 blur。
- 实际问题：syncState 只计算外部 focus Prop 与 methodFocus，遗漏 focused；用户手动聚焦后下一帧被强制失焦。
- 决策：Input 与 Textarea 的 inputFocus 固定由 interactive && (外部 focus || methodFocus || focused) 推导；onBlur/blur()/不可交互状态负责清除 focused 或 methodFocus。
- 理由：同一个焦点真相源同时覆盖声明式、方法和用户原生交互，不改变公开 Props、Events、Methods 或 Search/Combobox 的组合合同。

AI 必须遵守：

- 任何维护 inputFocus 的 syncState 都必须在 manual bindfocus 后保持 true，直到真实 blur 或显式释放。
- Search、Combobox 等使用 pui-input 的组合组件应复用核心修复，不要另建页面级焦点状态机。
- 修复焦点链时同时回归 Input 与 Textarea，并保留外部 focus Prop、focus()/blur() 与不可交互门禁。

验证与遗留风险：

- 验证：`node scripts/test-input.js`
- 验证：`node scripts/test-textarea.js`
- 验证：`node scripts/test-search.js`
- 验证：`node scripts/test-combobox.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具构建 npm 并在 390px 模拟器验证`
- 真机/兼容风险：微信开发者工具无障碍输入注入无法稳定操作模拟器原生 input，因此连续键入的运行态验收仍需用户在当前 390px 模拟器或真机手动确认。
- 真机/兼容风险：iOS/Android 真机仍需确认中文输入法候选、键盘高度、readonly/loading 切换与连续输入不会改变焦点。

## PUI-FB-0315 · Navbar 与 Tabbar 默认可见边界破坏无边首页节奏

- 原始记录：`feedback/records/pui-fb-0315-navbar-tabbar-transparent-default-boundaries.json`
- 范围：`component` / `navbar`、`tabbar`、`preview-site`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：Navbar 底边和 Tabbar 顶边默认不渲染；需要边界的消费者仍可显式开启，不影响 Tabbar 项目之间的微分隔。
- 实际问题：透明 1rpx 外边界虽然不可见，仍保留非必要盒模型，用户明确要求默认状态直接无边框。
- 决策：Navbar 与 Tabbar 的 bordered 默认值统一为 false；bordered=false 两端均不渲染外边界，bordered=true 是唯一显示中性外边界的入口。
- 理由：默认无边布局不应携带不可见边框；需要分区的消费者可显式开启，Tabbar split 继续独立表达目的地之间的微分隔。

AI 必须遵守：

- 不要用页面私有样式覆盖 Navbar/Tabbar 外边界来修复默认视觉，修改必须落在共享组件 Props 默认值。
- bordered=false 不得保留透明边框或边框占位；显式 bordered=true 才建立对应外边界。
- Tabbar split 是目的地间的独立微分隔，不能被 bordered 默认值或外边界开关一并移除。
- 修改共享屏幕附着组件时同步 H5、合同、API、专项测试、Ledger、dist、示例安装与微信 npm 产物。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run example:install`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：iOS/Android 真机仍需确认安全区、深浅色、全局 bordered 开关、原生 Button hover 与 fixed 三行布局。

## PUI-FB-0316 · Popup WXSS 通配选择器阻断微信页面编译

- 原始记录：`feedback/records/pui-fb-0316-popup-wxss-universal-selector-compatibility.json`
- 范围：`component` / `popup`、`preview-site`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页菜单改用底部 pui-popup 后，合法 AppID 的微信小程序必须可以真实编译并保持 Popup 的受控关闭、Slot 和低动效合同。
- 实际问题：Popup 源码以 `*` 选择 Footer Slot 子节点并把低动效穿透到全部后代，当前微信 WXSS 编译器拒绝该 token，首页无法渲染。
- 决策：移除 `.pui-popup__footer > *` 与 `.pui-popup--reduced *`；Footer 只提供分区容器，满宽动作由调用方的 PUI Button `block` Props 表达。H5 低动效仅作用 Popup Mask 与 Surface，Slot 内 PUI 子组件仍由各自合同控制。
- 理由：这同时满足微信 WXSS 编译限制、Popup 只管理浮层几何的职责边界，以及 PUI 子组件各自低动效和尺寸语义。

AI 必须遵守：

- 任何共享组件首次被真实小程序页面引用后，都必须在微信开发者工具实际渲染层编译，JS 静态测试与 build-npm 成功不能代替 WXSS 编译证据。
- WXSS 不得用 `*` 或 `> *` 穿透消费者 Slot；需要布局时由组件公开容器、调用方 PUI Props 或明确 Slot 内布局表达。
- 父级 reduceMotion 只缩短自己声明的动画；PUI 子组件的低动效必须继续按各自合同生效。
- 发现共享组件阻断页面编译时，修复必须同步 H5、合同、专项测试、Ledger、dist、示例安装与微信 npm 产物，不能用页面私有样式掩盖。

验证与遗留风险：

- 验证：`node scripts/test-popup.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：iOS/Android 真机仍需确认 Popup fixed 遮罩、Slot 投影、触摸关闭、backdrop-filter、safe-area、读屏和系统低动效。

## PUI-FB-0317 · Popup Blur 被总 Layer 透明度延后

- 原始记录：`feedback/records/pui-fb-0317-popup-blur-enters-with-surface.json`
- 范围：`component` / `popup`、`preview-site`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页底部 Popup 打开时，背景 Blur 必须与 Popup Surface 同时开始出现，不能等遮罩淡入结束后才模糊。
- 实际问题：总 Layer 的 opacity 统一控制遮罩与 Surface，导致 blurOverlay 的模糊效果被延后。
- 决策：Popup Layer 只承担层级、指针边界和退场保留；Mask 自己从 opacity 0 进入 1，Popup Surface 保持独立 opacity/transform。blurOverlay 在 Layer 挂载时就应用 backdrop-filter。
- 理由：这样保留单一完整遮罩和受控退场，又让 Blur 与 Popup Surface 在同一进入帧呈现，不增加页面私有遮罩或第二个滚动上下文。

AI 必须遵守：

- 需要 backdrop-filter 的 Popup 遮罩不能把 opacity 过渡放在共同 Layer；Mask 自己管理色遮淡入。
- Layer 只管理 z-index、完整覆盖、指针边界和退场保留，不能承担所有子层视觉透明度。
- 小程序与 H5 必须共享同一进入阶段：Mask 与 Surface 同时进入，Blur 不等待遮罩动画结束。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`node scripts/test-popup.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：当前开发者工具焦点仍是另一项目，尚未在 PoemUI 390px 模拟器重放 Popup 的进入中间帧；iOS/Android 真机仍需确认 backdrop-filter 合成时机、性能、低动效、fixed 遮罩与读屏。

## PUI-FB-0318 · Combobox 筛选后面板高度收缩

- 原始记录：`feedback/records/pui-fb-0318-combobox-stable-panel-height.json`
- 范围：`global` / `combobox`、`miniprogram-home`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：Combobox 内容区域应保持固定高度，候选数量因搜索过滤减少时不能让面板随之变矮。
- 实际问题：原实现只把测得高度传给 max-height。max-height 只是上限，Panel 仍按较少子内容自然收缩。
- 决策：小程序与 H5 都把 Panel 高度记录为单调递增的稳定测量值；Panel 使用真实 height、Panel inner 使用同值 min-height，并继续以 max-height 进出动画。候选数量减少不会降低高度，更多内容仍可通过既有 scroll-view/maxHeight 边界增长和滚动。
- 理由：保留原有 0–500ms max-height 动效与局部滚动上下文，同时消除搜索输入时的浮层跳动。

AI 必须遵守：

- 筛选、选择、创建和空结果不能降低已建立的 Combobox Panel 高度。
- 小程序和 H5 都必须使用真实 height 占位并保留 max-height/opacity/transform 动效。
- 不要在页面消费者中为 Combobox 手写 min-height 补丁。

验证与遗留风险：

- 验证：`node scripts/test-combobox.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：仍需在 iOS/Android 真机确认软键盘筛选、较长选项、空结果和不同基础库下的固定高度与局部滚动。

## PUI-FB-0319 · Input 清除按钮未固定在尾部操作位

- 原始记录：`feedback/records/pui-fb-0319-input-clear-trailing-alignment.json`
- 范围：`global` / `input`、`combobox`、`search`、`miniprogram-home`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：Combobox 搜索框中的清除按钮必须位于输入框最右侧。
- 实际问题：native input 的 width:100% 与 flex:1 叠加，尾部 Button 的空间在微信布局中不稳定。
- 决策：Input 原生 control 与 H5 镜像均使用 flex:1 1 0、width:0、max-width:100% 作为剩余轨道；Clear 保持 flex:0 0 auto 并以 margin-left:auto 固定到尾部。
- 理由：由 Input 组件维护统一字段几何，Combobox/Search 等消费者无需复制或穿透样式。

AI 必须遵守：

- 不要让 flex:1 的原生 input 同时持有 width:100%。
- 没有 suffix 时 Clear 必须贴齐 Field 最右侧；有 suffix 时 suffix 仍可占最右语义轨。
- Combobox/Search 等消费者不得为 Clear 写页面私有定位补丁。

验证与遗留风险：

- 验证：`node scripts/test-input.js`
- 验证：`node scripts/test-combobox.js`
- 验证：`node scripts/test-search.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：iOS/Android 真机仍需确认中文输入法、长文本、prefix/suffix 同时存在与不同基础库下的尾部触摸区。

## PUI-FB-0320 · Icon 独立页 Navbar 增加返回与外观菜单双操作

- 原始记录：`feedback/records/pui-fb-0320-icon-navbar-appearance-popup.json`
- 范围：`component` / `icon`、`navbar`、`popup`、`switch`、`config-provider`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：Icon 独立页的 Navbar 与主页保持同一操作模型，提供一个真实返回按钮和一个菜单按钮；菜单打开可修改并持久化全局外观的底部 Card Popup，并在 Header 左侧提供恢复默认图标按钮。
- 实际问题：Icon 页只有默认返回箭头；外观设置只能返回首页后再打开，组件浏览动线被中断。
- 决策：Icon 页关闭 Navbar 默认 leftArrow，在胶囊镜像左 Slot 中等分放置 chevron-left 返回与 menu 两个 PUI 图标按钮；完全沿用首页双按钮的直接 bind:click 结构，返回绑定 onBack、菜单绑定 onOpenAppearance。菜单打开与首页同合同的 bottom Card Popup；Header 左侧 theme=primary 的 PUI refresh 按钮执行 visualConfig.reset 与背景渐变关闭。组件视觉写入 visualConfig，页面渐变复用持久化画布偏好，果味由实际组合推导。
- 理由：Navbar 的 capsule 合同禁止在系统胶囊右轨叠加业务按钮；左侧镜像轨已经被主页验证可承载两个独立操作。复用 Popup、Cell、Switch 与 visualConfig 可保持当前路径完整且不创建页面私有视觉状态。

AI 必须遵守：

- capsule=true 时禁止在 Navbar right Slot 放业务按钮；返回和菜单等多个操作应在左 Slot 镜像轨内等分组合。
- 每个 Navbar 操作使用独立 PUI Button + Icon、准确 ariaLabel，并像首页一样在 Button 上直接 bind:click；Icon 页返回使用 chevron-left 并调用共享 onBack，菜单使用 menu 并调用 onOpenAppearance。
- 外观 Popup 使用 placement=bottom、card=true、showHeader、closeBtn、blurOverlay、preventScrollThrough，并由 visible-change 回写受控状态；Card 只由 Popup 本身提供。
- 边框、阴影、毛玻璃、大圆角与主题只写 visualConfig；渐变只作用页面画布；果味 checked 由真实组合推导。
- Header 左侧重置使用 theme=primary 的 PUI Button + refresh Icon，同时调用 visualConfig.reset 与画布偏好 false；不要复制页面私有默认外观对象。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`node scripts/test-navbar.js`
- 验证：`node scripts/test-popup.js`
- 验证：`node scripts/test-config-provider.js`
- 验证：`node scripts/test-switch.js`
- 验证：`node scripts/test-page-background-preference.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`当前微信开发者工具热重载`
- 真机/兼容风险：iOS/Android 真机仍需确认原生胶囊镜像左轨内双按钮触摸区、Card Popup backdrop-filter 合成、安全区、重置后 storage 写回、软键盘与菜单切换、深浅色及读屏。

## PUI-FB-0321 · Popup Header 默认缺少常驻关闭按钮

- 原始记录：`feedback/records/pui-fb-0321-popup-persistent-header-close.json`
- 范围：`component` / `popup`、`button`、`metadata`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：Popup 的 Header 右侧应始终提供可见的圆形 PUI 关闭图标按钮，标题继续保持三列几何居中。
- 实际问题：小程序 Popup 的默认值为 closeBtn=false；官网预览已使用 true，导致跨端默认行为和 API 文档发生漂移。开发者工具进一步显示：即使页面不传同名属性，只要 Popup 接收默认 Content Slot，嵌在命名 close-btn Slot 内的 fallback Button 仍不会出现在 Header 右轨。
- 决策：将 closeBtn 的小程序默认值改为 true，并将默认关闭 Button 移为 Header 右轨独立的 iconOnly 节点；用 Button 尺寸和 round radius Token 固定其原生根几何，移除消费者中与 close-btn Slot 同名的冗余属性，并把合同、API 与 Slot 描述明确为 Header 右侧默认常驻关闭控件。需要自定义 Slot 时，调用方以 closeBtn=false 关闭默认节点后再提供替换控件。
- 理由：默认 Header 必须提供可发现、可访问且在微信默认 Content Slot 组合下真实可见的退出入口，同时保留已有调用方在少数受限流程中显式隐藏默认控件并以 Slot 替换的能力；三列轨道和标题几何不变。

AI 必须遵守：

- 修改 Popup Header 时同时核对小程序 properties、H5 默认 Props、元数据、API、合同与专项测试。
- showHeader=true 的默认状态必须提供默认圆形关闭 Button；仅显式 closeBtn=false 才隐藏其 fallback。
- close-btn Slot 可替换默认控件，但必须提供等价关闭交互与可访问名称。

验证与遗留风险：

- 验证：`node scripts/test-popup.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：仍需在合法 AppID 的 390px 开发者工具及 iOS/Android 真机确认 Header 默认关闭按钮、close-btn Slot、触摸命中区、Slot 投影和读屏表现。

## PUI-FB-0322 · Button 默认操作误用玻璃卡片而非 muted 弱填充

- 原始记录：`feedback/records/pui-fb-0322-button-default-muted-surface.json`
- 范围：`global` / `button`、`popup`、`preview-site`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：所有 PUI Button 的 default 默认视觉应是 muted 弱填充，Popup Header 的圆形关闭按钮也应复用这一统一形态。
- 实际问题：默认中性 Button 被渲染为独立玻璃卡片，视觉层级强于其取消、关闭和辅助操作角色，且 Popup Header 的关闭入口无法复用预期的 muted 形态。
- 决策：在 Button 组件级别增加 default/base 的唯一视觉选择器：小程序使用 --pui-button-soft（--pui-bg-muted），H5 使用同名镜像 Token（--surface-soft），两端保留中性边界并清除外投影；不新增 API 或无效 mute variant。
- 理由：以已有 Token 改变现有合法组合，可以使所有默认 Button 和 Popup 的关闭入口立即同源，不需要页面私有 class 或破坏 Button 已收敛的 theme/variant 合同。

AI 必须遵守：

- 需要弱化中性 Button 时使用 theme=default + variant=base，不增加 muted theme 或 variant。
- default/base 的背景、边界、阴影资格必须由 Button 组件级 Token 规则提供，页面和 Popup 不得私有覆盖。
- 变更默认视觉时同步小程序 WXSS、H5 CSS、全局与组件合同、专项测试、Ledger 和发布产物。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`node scripts/test-popup.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：仍需在合法 AppID 的 390px 开发者工具和 iOS/Android 真机确认默认 Button 在深浅色、边框、阴影、毛玻璃和大圆角下的 Token 继承、样式隔离、触摸命中和读屏表现。

## PUI-FB-0323 · 发布组件的 WXSS 通配选择器阻断合法 AppID 上传

- 原始记录：`feedback/records/pui-fb-0323-wxss-universal-selector-upload-compatibility.json`
- 范围：`global` / `action-sheet`、`calendar`、`dialog`、`navigation-menu`、`popover`、`sheet`、`swipe-cell`、`table`、`virtual-list`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：合法 AppID 的小程序包必须能通过微信上传前 WXSS 编译，不能再因共享组件的通配选择器失败。
- 实际问题：十个已发布组件沿用了 Web CSS 的 * 或 > * 选择器，当前微信 WXSS 编译器拒绝解析，上传被整体阻断。
- 决策：删除九处不必要的后代低动效覆盖：组件根注入的 --pui-*-duration 已继承到自身内部动效，PUI 子组件继续接收各自 reduceMotion。SwipeCell 以明确的 content-inner 容器承担默认 Slot 的全宽几何。
- 理由：保持低动效、Slot 组合和布局职责，同时使所有 WXSS selector 可被微信编译器解析。

AI 必须遵守：

- 任何发布 WXSS 禁止 *、> * 与 *::before/after 选择器，并通过发布前门禁扫描。
- 默认 Slot 的布局应由明确内部容器或调用方 PUI Props 表达，不得用选择器穿透消费者节点。
- 修复上传阻断时必须更新源、dist、示例安装和真实开发者工具 npm 构建，不能手工修改 miniprogram_npm。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`当前微信开发者工具构建 npm`
- 真机/兼容风险：仍需由用户实际上传，并在 iOS/Android 真机确认 Slot 样式隔离、低动效和触摸表现。

## PUI-FB-0324 · Button iconOnly 未建立统一居中轨道导致关闭图标偏心

- 原始记录：`feedback/records/pui-fb-0324-button-icon-only-center-track.json`
- 范围：`component` / `button`、`icon`、`popup`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：圆形 PUI Button 中的 PUI Icon 必须视觉精确居中，不出现白色默认根或 Popup 私有补丁。
- 实际问题：Button 只移除了内容和 suffix，没有建立 iconOnly 的专属单轨布局；Popup 只能额外传入 custom-style 试图固定圆形根。移除消费者补丁后的开发者工具热重载还显示，WXSS 尺寸类不足以完全约束原生 Button 根宽度。
- 决策：Button 内部新增 pui-button--icon-only：根在运行时写入 --pui-button-size 的 width/min/max-width/height/flex/padding 和圆角 Token，Icon 区域以同一尺寸填满并居中、清除行高基线；H5 同步类与几何。Popup 删除 custom-style，继续通过 icon=close 让 Button 内部渲染 pui-icon。
- 理由：同时保留 icon 属性和 icon slot 的现有公开合同，把像素几何归属回唯一的 Button 组件，可供 Navbar、Tabbar、Popup 和其他消费者复用。

AI 必须遵守：

- 优先使用 icon 属性让 Button 内部渲染 pui-icon；需要自定义时使用 icon slot，不用字符图标。
- iconOnly 必须让原生根、Icon 容器和 PUI Icon 共用 Button 尺寸轨道，且内容/后缀从真实树移除。
- 消费者不得以 custom-style、绝对定位或白底遮盖修复共享 Button 的图标居中。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`node scripts/test-button.js`
- 验证：`node scripts/test-popup.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：仍需在合法 AppID 的 390px 开发者工具与 iOS/Android 真机确认不同主题、边框、阴影、毛玻璃、大圆角、系统字体和触摸反馈下的视觉同心与命中区。

## PUI-FB-0325 · 组件详情页 Navbar 与外观 Popup 仅在 Icon 页实现

- 原始记录：`feedback/records/pui-fb-0325-component-detail-navbar-shared-shell.json`
- 范围：`component` / `navbar`、`button`、`icon`、`popup`、`switch`、`config-provider`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：所有组件详情页的 Navbar 都应与 Icon 页一致，拥有真实返回、菜单和外观控制，且后续不再逐页复制。
- 实际问题：公共页面壳只复用了返回和剩余高度测量，Navbar/PUI 组合仍逐页手写。只有 Icon 页拥有菜单和可用的外观 Popup，Button 与 Divider 的用户路径不一致。
- 决策：新增 miniprogram/components/component-page-navbar：内部固定组合 pui-navbar、两个 iconOnly PUI Button、pui-icon、受控 bottom Popup、CellGroup、Cell、Switch、visualConfig 和页面渐变偏好。Button、Divider、Icon 的页面 WXML 都仅渲染该组件并以 back 事件调用共享 onBack。
- 理由：共享头部将胶囊镜像、真实 PUI 操作、Popup 关闭、全局视觉 Store 和渐变偏好的职责维持在唯一位置；页面只保留各自内容与路由回退，无需复制视觉控件或维护第二份外观状态。

AI 必须遵守：

- 所有当前组件详情页必须使用 component-page-navbar，并在新增详情页时纳入动态专项枚举。
- 共享 Navbar 左轨固定使用 PUI Button + PUI Icon 的 chevron-left 与 menu，right Slot 保持为空以尊重微信胶囊。
- 菜单必须真实打开受控 Popup；视觉设置只写 visualConfig，渐变只写页面画布偏好。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：仍需在合法 AppID 的 390px 开发者工具、iOS 与 Android 真机确认所有详情路由的胶囊镜像双按钮、Popup 模糊遮罩、状态持久化、横竖屏和读屏。

## PUI-FB-0327 · Navbar 的 Grid Slot 百分比布局在 Skyline 真机偏离原生胶囊几何

- 原始记录：`feedback/records/pui-fb-0327-navbar-skyline-capsule-absolute-geometry.json`
- 范围：`component` / `navbar`、`preview-site`、`miniprogram-home`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：自定义 Navbar 在微信真机必须遵循原生胶囊的真实位置，标题、左侧多个操作和安全区不能与开发者工具 WebView 出现明显差异。
- 实际问题：旧实现将原生胶囊 Token 填入 CSS Grid，并由 left Slot 分组的 width:100% 决定内部宽度。WebView 画面正常，但 Skyline 真机未保持同一轨道约束，导致顶部几何明显偏离。
- 决策：Navbar 组件级改为绝对几何层：left action 固定在 windowWidth-right 外边距和原生胶囊 width 对应的镜像区，title 固定在 windowWidth-left 对称安全轨，right action 只在 capsule=false 时存在。H5 镜像同步相同模型。
- 理由：运行时矩形仍由微信平台提供，但命中区与标题约束不再交给 Grid 或投影 Slot 计算，因此 WebView、Skyline 和不同胶囊尺寸都消费同一组明确坐标。

AI 必须遵守：

- capsule=true 时，left action 的 left 必须等于 windowWidth-right，width 必须等于原生胶囊 width。
- title 必须以 windowWidth-left 作为左右对称安全轨，不能被 left Slot 的内容宽度或数量推开。
- 小程序 Navbar 禁止以 CSS Grid 或 Slot width:100% 计算原生胶囊几何；页面不得用私有偏移补丁。
- 变更原生几何时同步 H5 镜像、dist、专项测试、Ledger 和真机风险声明。

验证与遗留风险：

- 验证：`node scripts/test-navbar.js`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具热重载后重新构建 npm`
- 真机/兼容风险：需由用户在 iOS/Android 真机确认当前设备的 rect、双按钮命中区、横竖屏、系统低动效和读屏；本轮未读取用户手机的运行时 rect 原始值。

## PUI-FB-0328 · Button 缺少明确的 transparent 视觉变体

- 原始记录：`feedback/records/pui-fb-0328-button-transparent-visual-variant.json`
- 范围：`component` / `button`、`fab`、`dialog`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：为 pui-button 新增 transparent 版，使它无边框、无底色且可作为真实通用 Button 使用。
- 实际问题：没有明确 transparent variant；surface=transparent 被误认为可替代的透明 Button，导致通用视觉与复合容器边界的职责混淆。
- 决策：新增 variant=transparent；Button、H5 buttonSample、属性枚举、Dialog 动作配置、FAB 与组件详情示例接受该值。transparent 复用 Token 化无底色、无边界、无外投影级联，保留常规 Button 几何。
- 理由：把通用视觉意图和复合结构边界拆开，消费者无需为透明 Button 改用 Tabbar 专用 surface 或写页面私有 CSS。

AI 必须遵守：

- variant=transparent 必须保留常规 Button 几何与交互，只移除背景、边界和外投影。
- surface=transparent 继续仅用于父级承载唯一 Surface 的 Tabbar 等组合边界，并移除 Button 自身圆角。
- Button 的视觉枚举不得滥用 type；微信表单动作继续使用 formType。
- 所有接收 Button 配置对象的共享组件和 H5 helper 必须显式接受 transparent，不得静默回退为 base。

验证与遗留风险：

- 验证：`node scripts/test-button.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm --project miniprogram`
- 真机/兼容风险：仍需在合法 AppID 的 iOS 与 Android 真机确认 transparent 在深浅色、border/shadow/frostedGlass/largeRadius 开关下的对比、触摸命中、禁用态、Slot 样式隔离与系统低动效。

## PUI-FB-0329 · Navbar 双按钮不应依赖 Slot 冒泡而失去页面监听

- 原始记录：`feedback/records/pui-fb-0329-navbar-direct-dual-action-events.json`
- 范围：`component` / `navbar`、`miniprogram-home`、`component-page-navbar`、`preview-site`
- 状态：`needs-device`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：Navbar 的搜索与菜单两个标准操作必须能够由页面直接绑定并可靠触发。
- 实际问题：双按钮已改由 Navbar 内建 PUI Button 并公开 direct event；此前 iOS/Android Skyline 真机仅命中最左按钮，但当前产品已移除 Skyline。开发者工具 WebView 与 JS 直接方法测试仍不能替代 WebView 真机点击验收。
- 决策：保留 leftBtn/rightBtn 的正式 API 和组件内事件发布；本项目不再为 Skyline 添加包装命中层。该记录保留为 needs-device，后续只以 WebView 真机确认两个入口。
- 理由：用户已明确 WebView 是当前产品边界，不能为了未启用渲染器扩大 Navbar API 或引入无需求的布局分支；VM 直接调用仍不能替代受支持目标的真机触摸验收。

AI 必须遵守：

- 标准双图标入口使用 leftBtn/rightBtn 配置，页面使用 bind:leftBtn/bind:rightBtn。
- leftBtn/rightBtn 任一存在时替代默认返回与 left Slot，避免三套左侧交互并存。
- 双操作必须由 Navbar 内部 PUI Button 渲染，并在 disabled 时全部阻断。
- 当前项目只验收 WebView；若未来重新启用 Skyline，必须先恢复独立的设备布局与命中验证计划，不能沿用 WebView 结论。
- 变更必须同步 H5、API 元数据、组件合同、页面消费者、专项测试和 npm 安装产物。

验证与遗留风险：

- 验证：`node scripts/test-navbar.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 真机/兼容风险：WebView iOS/Android 真机仍需确认两个按钮的独立命中、原生胶囊矩形、横竖屏与读屏；Skyline 不属于当前支持范围。

## PUI-FB-0330 · 当前小程序明确不启用 Skyline 渲染器

- 原始记录：`feedback/records/pui-fb-0330-skyline-device-layout-and-hit-target-regression.json`
- 范围：`global` / `miniprogram`、`navbar`、`icon`、`grid`、`button`
- 状态：`wont-fix`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：当前小程序作为 WebView 项目交付，不启用也不支持 Skyline；此前 Skyline 真机问题不能驱动当前组件库或页面的额外分支。
- 实际问题：历史配置错误地启用了 Skyline，导致两个未承诺支持的真机兼容问题被误当作当前产品缺陷。
- 决策：删除 miniprogram/app.json 的 Skyline 与 glass-easel 开关，当前产品只支持默认 WebView；不为 Skyline 修改 Icon、Grid 或 Navbar。
- 理由：这与用户明确的产品定位一致，避免为未启用渲染器引入额外 API、布局分支或伪造的跨渲染器兼容承诺。

AI 必须遵守：

- 当前 WebView 项目不得在 app.json 声明 renderer=skyline、rendererOptions 或 componentFramework=glass-easel。
- WebView 模拟器、WebView 真机和 Skyline 是三种不同证据层；只验收已声明支持的渲染器。
- 未来若重新启用 Skyline，必须新增独立兼容 Goal、真机矩形/事件取证和组件级专项门禁，不能复用本记录的 WebView 结论。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`微信开发者工具普通编译`
- 真机/兼容风险：WebView iOS/Android 真机仍需验证 Navbar 两项点击、Icon 三列、胶囊安全区、ScrollArea 与读屏；Skyline 不在当前支持范围。

## PUI-FB-0331 · 独立 Surface 等距模式与阴影资格需要双端统一治理

- 原始记录：`feedback/records/pui-fb-0331-equal-spacing-surface-governance.json`
- 范围：`global` / `config-provider`、`popup`、`card`、`sheet`、`action-sheet`、`popover`、`dropdown-menu`、`navigation-menu`、`collapse`、`collapsible`、`combobox`、`select`、`picker`、`date-time-picker`、`calendar`、`upload`、`swiper`、`cell-group`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：通过外观菜单一键切换等距模式，并让阴影只作用于具备独立 Surface 资格的组件，同时保持小程序与 H5 一致。
- 实际问题：原有 Store、Provider、Popup 与 H5 菜单没有 equalSpacing 公共字段或 Surface 专用别名，首页与详情页存在重复设置面板。
- 决策：扩展现有 visualConfig 字段而不升级存储版本，equalSpacing 独立于 effectsEnabled 与果味预设；以三项 Surface 别名约束组件级消费；浮层、展开面板、独立容器按真实根节点迁移；共享 appearance-settings 消除小程序重复 WXML。
- 理由：保持旧存储可恢复、避免全局间距污染，并让组件自行决定 Surface 资格，才能同时满足一键调整与局部几何稳定。

AI 必须遵守：

- 只在独立 Surface 根消费 Surface inset/stack/section 别名。
- 连续列表行、控件内部、展示叶子和 PreviewDevice 基础设施不得因 equalSpacing 获得大间距或外投影。
- visualConfig.equalSpacing 不参与 effectsEnabled 或果味组合。
- 首页和详情页外观入口优先复用 miniprogram/components/appearance-settings。

验证与遗留风险：

- 验证：`npm run test:equal-spacing`
- 验证：`npm run test:appearance-settings`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：微信开发者工具热重载窗口已完成首页 → Icon → 首页、清除文件缓存后的开关恢复验证；真实 iOS/Android 真机的 rpx、安全区、触摸命中、系统胶囊与读屏仍未验证。
- 真机/兼容风险：H5 Popup/Card 浏览器计算几何已完成，其余迁移组件的浏览器组合矩阵仍未逐项完成；Popup 真机唯一滚动区与 390px 边界仍需真机确认。

## PUI-FB-0332 · Swiper 分页 WXML 条件分支阻断合法 AppID 上传

- 原始记录：`feedback/records/pui-fb-0332-swiper-wxml-upload-conditional-compatibility.json`
- 范围：`component` / `swiper`、`miniprogram`、`npm-dist`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：合法 AppID 的小程序上传不得因 Swiper 的 WXML 条件分支而被编译器阻断。
- 实际问题：上传编译器报告 `Bad attr wx:else` 和 `wx:if not found`，导致上传失败；源、miniprogram_dist 与已有 npm 产物含同一非法结构。
- 决策：inside 与 outside Navigation 均保留 fraction 的 wx:if，并将 dots/dots-bar 改为独立 `navigationType !== 'fraction'` block；不改变公开 API、渲染结果或 H5 行为。
- 理由：两条显式条件分支消除上传编译器的结构歧义，同时保持 fraction 与指标列表的互斥关系和现有 current 真相源。

AI 必须遵守：

- 不得让带 wx:for 的节点以 wx:else 跟随 `<block wx:if>`；使用两个完整 wx:if block 表达互斥分支。
- 上传阻断必须从组件源、dist 和标准 npm 构建修复，禁止手改 miniprogram_npm。
- WXML 语法修复也要同步 Swiper 合同、H5 兼容说明、专项测试、Ledger 和安装产物。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具构建 npm`
- 验证：`微信开发者工具普通编译`
- 真机/兼容风险：修复后仍需由用户重新执行一次实际上传，确认其上传编译器版本接受新的 npm 产物；iOS/Android WebView 真机的 swiper 手势和分页命中不由本次编译修复替代。

## PUI-FB-0333 · 全局默认外观应为大圆角阴影无边框，Combobox 局部无边框不得关闭阴影

- 原始记录：`feedback/records/pui-fb-0333-global-default-borderless-radius-shadow.json`
- 范围：`global` / `config-provider`、`combobox`、`preview-site`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：让首次安装和重置后的全局外观默认使用大圆角与阴影且不显示中性边框；Combobox 同步跟随全局边框，而不是局部无边框时连阴影一起消失。
- 实际问题：默认和 standard 预设仍是普通圆角、无阴影、有边框；Combobox 本地 borderless 将无边框与无阴影耦合。
- 决策：维持既有 visualConfig API 与存储键，更新 DEFAULT_CONFIG、standard 预设和 H5 镜像默认；保留 Combobox bordered 作为兼容的局部中性边界覆盖，但它不得影响 Provider shadow Token。
- 理由：默认与 reset 可立即获得一致的产品外观，同时不破坏已保存的用户选择；边框和阴影是独立视觉开关，局部选择不应越权修改全局效果。

AI 必须遵守：

- 改动 visualConfig 默认值时同步 DEFAULT_CONFIG、standard 预设、H5 初始偏好、合同、测试和安装产物。
- 不得通过清空已有本地存储来伪造新默认已经生效。
- 局部 bordered=false 只能改变对应 Surface 的中性边界，不得关闭 Provider 的 shadow、frostedGlass 或 radius 语义。
- global bordered=false 应通过共享边界 Token 覆盖同类 Trigger 与 Panel，保留盒模型和状态边界。

验证与遗留风险：

- 验证：`node scripts/test-config-provider.js`
- 验证：`node scripts/test-combobox.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`node scripts/test-appearance-settings.js`
- 验证：`node scripts/test-preview-fruit-flavor-preset.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：真实 iOS/Android 首次安装、点击外观重置和现有 poemui-visual-config 恢复仍未验证。
- 真机/兼容风险：微信 WebView 对无中性边框且保留阴影的 Combobox Trigger/Panel 组合、触摸命中与 rpx 回流仍需 390px 真机确认。

## PUI-FB-0334 · 纯图标 Tabbar 沿用标签短横位置导致视觉脱节

- 原始记录：`feedback/records/pui-fb-0334-tabbar-icon-only-indicator-rhythm.json`
- 范围：`component` / `tabbar`、`button`、`preview-site`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：首页纯图标 Tabbar 的活动短横应靠近图标，不能沿用给图标加文案预留的远距离底部位置。
- 实际问题：纯图标项沿用图标+标签项的底部短横位置，空出的标签轨道使图标与活动指示器的距离过大。
- 决策：Tabbar 在 item wrap 派生 icon-only 结构类，活动短横对纯图标项改用 space-normal 上移；带标签条目保留原位置。H5 用 is-icon-only 镜像同一状态与同义 Token。
- 理由：标签是否存在是已有的组件数据语义，短横属于 Tabbar 自身而不是页面职责；只移动短横能保留固定导航高度、原生 Button 命中区、安全区和分隔线合同。

AI 必须遵守：

- 显式 label:'' 的 Tabbar 条目必须同时触发 Button iconOnly 与 Tabbar 自身 icon-only 指示器节奏。
- 纯图标项只移动活动短横；不要改变 112rpx/56px 导航高度、Button 命中区、安全区或 split 分隔。
- 原生与 H5 使用同名 icon-only 状态和同义间距 Token；不得在首页或预览页面写私有定位补丁。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具构建 npm`
- 真机/兼容风险：iOS/Android 真机仍需确认 rpx 垂直几何、触摸热区、安全区和系统低动效。

## PUI-FB-0335 · Overlay 默认遮罩需兼容全局毛玻璃与局部 blur API

- 原始记录：`feedback/records/pui-fb-0335-overlay-global-frosted-and-local-blur.json`
- 范围：`global` / `overlay`、`config-provider`、`preview-site`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：pui-overlay 默认保持半透明遮罩；全局外观打开毛玻璃时自动获得 blur，同时调用方继续可以通过 blur API 单独请求 Overlay 模糊。
- 实际问题：原生和 H5 都只读取局部 blur Prop，遗漏了已存在的全局 frostedGlass Token 边界。
- 决策：保留 blur:Boolean API；Overlay WXSS 以 .pui-overlay-layer--blurred 和 .pui-frosted-glass--on .pui-overlay-layer 共同消费 --pui-overlay-blur。H5 以 props.blur || state.frost === 'on' 计算同一 filter。
- 理由：局部 API 继续满足调用方的显式需求，而全局外观能对整个 Provider 子树保持一致；两者都关闭时没有 backdrop-filter，默认遮罩仍克制且可预测。

AI 必须遵守：

- blur=true 必须继续是 Overlay 的公开 Boolean Prop，不能因全局外观接入而删除。
- Provider 的 pui-frosted-glass--on 必须让其子树 Overlay 自动消费同名 --pui-overlay-blur Token。
- 两项都关闭时 Overlay 只保留半透明背景色；不要残留 backdrop-filter。
- 局部与全局 blur 都不能改变 Overlay 的 Slot、点击回写、滚动阻断、zIndex 或几何。
- H5 使用 App Shell 的 data-frost 与 Props.blur 同步同一优先级，禁止单端例外。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：真机仍需确认 iOS/Android 的 backdrop-filter 支持与性能、fixed Overlay、catchtouchmove、Slot 投影、读屏和系统低动效。

## PUI-FB-0336 · 小程序组件详情页需要共享标题、子标题、描述与宽松分区节奏

- 原始记录：`feedback/records/pui-fb-0336-miniprogram-component-page-section-hierarchy.json`
- 范围：`global` / `miniprogram`、`button`、`divider`、`icon`、`scroll-area`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-24
- 用户目标：Divider 独立页的分区应有更充足的上下空间，并让所有当前组件独立页复用标题、子标题与描述的信息结构。
- 实际问题：页面各自维护标题结构，Divider 空间偏紧，Icon 的标题样式与 Button/Divider 分叉。
- 决策：新增仅供 miniprogram 页面组合使用的 component-page-section，不提升为 npm PUI 组件；默认 spacious 为独立组件用法提供 section/content Token 的上下节奏，regular 只供图标等高密度长目录使用。
- 理由：把正文层级统一到透明共享布局可消除复制并提升 Divider 阅读节奏，又不把页面信息架构误做成新的视觉控件或 Surface。

AI 必须遵守：

- 当前组件独立页必须通过 component-page-section 提供 title、subtitle、description 与默认 Slot，不得复制 section-header。
- spacious 用于组件用法分区，regular 只用于图标库等长目录；两者都必须消费现有 PUI Token。
- 共享分区组件是透明布局，不得加入背景、边框、阴影、毛玻璃或页面私有颜色。
- 只改变小程序页面组合时不要虚构 H5 页面；共享 PUI API、Token 或行为没有变化就不启动 H5 同步。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 真机/兼容风险：合法 AppID 的 390px 模拟器、iOS/Android 真机尚未确认宽松分区下的字体回流、ScrollArea 惯性和深浅色外观组合。
- 真机/兼容风险：默认 Slot 的页面组合及透明布局不会改变 PUI API，但仍需确认微信 WebView 的组件样式隔离与语义阅读顺序。

## PUI-FB-0337 · 轮播图公开英文名必须统一为 Swiper，不能残留 Carousel 双合同

- 原始记录：`feedback/records/pui-fb-0337-swiper-canonical-name.json`
- 范围：`component` / `swiper`、`documentation`、`preview-site`、`example`、`npm-dist`
- 状态：`resolved`，用户验收：`not-required`，更新：2026-07-24
- 用户目标：将轮播图组件的英文正式名称统一为 Swiper，并让源码、官网、安装入口、文档和后续 AI 记忆使用同一名称。
- 实际问题：旧公开合同以 Carousel 为名，虽然真实底层是微信 swiper，造成命名和外部参照不一致。
- 决策：正式名称固定为 Swiper，组件 ID、目录、PUI 标签、H5 路由与 npm 路径均为 swiper；customItem 的唯一 Generic 固定为 swiper-slide；删除 Carousel/carousel 与 shadcn-carousel 当前别名。
- 理由：统一为平台与 TDesign 已使用的术语，消除双合同，并避免 swiper-item 作为自定义 Generic 时与微信原生标签发生语义冲突。

AI 必须遵守：

- 生成、搜索或文档化轮播图时只使用 swiper、Swiper、pui-swiper 和 #/components/swiper，不生成 carousel 或 shadcn-carousel 别名。
- 微信原生 swiper-item 不能作为 PoemUI componentGeneric；customItem 固定绑定 generic:swiper-slide。
- 名称迁移必须同步源码、元数据、官网、示例、专项测试、Ledger、dist 和安装产物，不能只改展示标题。
- 全库门禁若因无关既有页面合同失败，必须精确报告失败文件和断言，不得为追求全绿覆盖用户当前文案。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：微信开发者工具 build-npm 已实际尝试，但 touristappid 查询详细信息返回 code 10，未生成也未手工伪造 miniprogram_npm；仍需合法 AppID 真机确认新 swiper 路径被安装端重新识别。

## PUI-FB-0339 · 第二 Tab 不能保留空白页，需成为真实 Style Utilities 页面

- 原始记录：`feedback/records/pui-fb-0339-miniprogram-tabbar-placeholder-destinations.json`
- 范围：`component` / `miniprogram-home`、`navbar`、`tabbar`、`tabs`、`search`、`popup`、`style-utilities`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：第二个 Tab 必须成为示例优先的 Style Utilities 页面；先完成五类分类，并复用首页 Navbar 搜索和外观入口，不能保留空白占位或把复制作为主要操作。
- 实际问题：原空白路由已删除，styles 页面以生成目录完整覆盖 530 个 class，并提供五分区、示例优先的搜索 Overlay 与首页同合同的外观 Popup；不调用剪贴板或 Toast。
- 决策：以 pages/styles/index 替换旧空白页面；Tabbar 第二项为 styles/palette。目录由 utilities.wxss 生成，Tabs 归纳为布局、尺寸与间距、字体与内容、背景与外观、主题与行为；Navbar 复用首页的 leftBtn 搜索和 rightBtn 外观入口。
- 理由：不复制 WXSS 或 H5 DOM，目录始终与发布 class 同步；移动端先呈现用户能观察的五类示例，选择 class 只切换示例，不把复制当成页面任务。

AI 必须遵守：

- 不要复制 utilities.wxss 或手写完整 class 清单；从公开源码生成目录并纳入构建。
- Tabs 用于五类页面内分类，Tabbar 只负责一级目的地。
- Navbar 的双图标入口必须使用 leftBtn/rightBtn 与 bind:leftBtn/bind:rightBtn，不能依赖 Slot 事件跨组件边界。
- 选择 class 只更新当前分类与示例，不能把 wx.setClipboardData 或 Toast 作为快速样式的默认行为。
- 背景渐变可直接挂在业务 View 或布局容器，不能作为 CellGroup 或组件内部 Surface 背景。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 DevTools build-npm --project miniprogram（成功，warnings=[]）`
- 验证：`微信 DevTools build-npm --project _example（touristappid code 10，未伪造产物）`
- 真机/兼容风险：微信真机仍需验证 390px 下五个 Tabs 的横滚、长目录惯性滚动、搜索焦点、外观 Popup、安全区和深浅色。
- 真机/兼容风险：_example 的 DevTools build-npm 受 touristappid code 10 阻断，需使用有效 AppID 后重跑。

## PUI-FB-0340 · 组件 WXSS 导入全局主题会触发微信禁止选择器编译错误

- 原始记录：`feedback/records/pui-fb-0340-component-wxss-global-theme-import.json`
- 范围：`global` / `popup`、`config-provider`、`theme`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：消除 Popup 在微信开发者工具中因不受组件 WXSS 支持的选择器导致的编译错误，并保证所有 PUI 组件沿用同一修复边界。
- 实际问题：75 个组件样式直接导入含 page 默认 Token 的 common/style/theme.wxss，微信在编译任一使用这些组件的页面时将导入链归因到组件 WXSS 并拒绝该选择器。
- 决策：保留 common/style/theme.wxss 作为应用级主题源，删除 74 个发布组件对它的直接导入；消费者统一在 app.wxss 通过 poemui-miniprogram/theme/utilities.wxss 或 theme/theme.wxss 引入一次，组件从页面根 ConfigProvider 与全局级联继承 Token。
- 理由：真实工程与示例的 app.wxss 已是主题入口，且所有页面根都挂载 ConfigProvider。移除重复组件导入既修复 Popup 又消除同类组件的潜在编译错误，不需要手改 miniprogram_npm。

AI 必须遵守：

- 新增或修改 PUI 组件时，组件 WXSS 不得直接导入 common/style/theme.wxss。
- 安装文档和示例必须在 app.wxss 导入 poemui-miniprogram/theme/utilities.wxss 或 theme/theme.wxss。
- 遇到组件 WXSS 的禁止选择器报错时先追踪导入链，不要仅修改报错组件或手工编辑 miniprogram_npm。
- H5 使用同名 Token 镜像，但不复制小程序 WXSS 的全局导入链。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run miniprogram:build`
- 验证：`npm run example:install`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具：工具 -> 构建 npm`
- 真机/兼容风险：需在合法 AppID 的 390px 模拟器与 iOS/Android 真机确认主题 Token 在 component style isolation 下均从页面根 Provider 正确继承。
- 真机/兼容风险：本记录不将开发者工具构建或静态测试等同于真机上传验收；真机与上传仍待用户或后续实机流程确认。

## PUI-FB-0341 · 小程序浮层分区缺少完整独立详情页

- 原始记录：`feedback/records/pui-fb-0341-miniprogram-overlay-pages-catalog-gap.json`
- 范围：`component` / `miniprogram-home`、`popup`、`popover`、`sheet`、`action-sheet`、`dropdown-menu`、`overlay`、`collapsible`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：首页浮层分区应完整展示当前已实装浮层组件，并且每个入口都进入复用统一 Navbar、全高 ScrollArea 和分区标题体系的独立详情页。
- 实际问题：修复前首页只维护基础组件列表，且没有浮层独立详情页。
- 决策：在首页新增默认展开的受控浮层分区，一次纳入当前真实浮层清单的八个组件；使用 activeCatalogSection 单一状态保证基础与浮层最多同时展开一个；为八个组件分别创建独立详情页并全部复用 component-page 页面骨架。
- 理由：浮层是用户任务中的独立分区，完整入口比只展示 Popup 更符合现有目录合同；父级协调 Collapsible 的互斥状态可以保持 Collapsible 单区域 API 不变，同时让每个详情页拥有真实组件交互和统一视觉入口。

AI 必须遵守：

- 先从 metadata 的浮层分区和真实小程序组件目录确认清单，再创建页面入口。
- 多个 Collapsible 的互斥展开在消费者页面协调，不给单区域 Collapsible 添加 Accordion 公共 API。
- 组件独立页必须使用 ConfigProvider、共享 Navbar、动态 ScrollArea 和 ComponentPageSection，并保留真实组件事件回写。
- 没有真实小程序实现或事件闭环的浮层不得创建可点击假入口。

验证与遗留风险：

- 验证：`npm run test:miniprogram-overlay-pages`
- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具：构建 npm、热重载编译`
- 真机/兼容风险：微信开发者工具与 iOS/Android 真机仍需确认八个浮层页面的触摸命中、fixed 遮罩、安全区、Slot 样式隔离、系统低动效和真机滚动行为。

## PUI-FB-0342 · Popup 顶部与侧向几何未避开 Navbar 且侧向高度过高

- 原始记录：`feedback/records/pui-fb-0342-popup-placement-geometry.json`
- 范围：`component` / `popup`、`navbar`、`button`、`miniprogram-component-pages`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：Popup Footer 动作全宽；左右弹出面板约占 68vw 宽、70vh 高；顶部 Popup 覆盖顶部但有效内容必须低于自定义 Navbar。
- 实际问题：Footer 的直接子级选择器无法稳定命中微信 Slot 展开后的 pui-button 宿主，且 Button 的 block 几何只停留在样式类，导致原生 Button 可满宽、组件宿主仍按内容宽度收缩；left/right 使用 max-height 时会随内容减少而变矮；top Popup 使用固定小顶部间距，未消费详情页真实 Navbar 高度，card 模式透明化时曾连内容面板一起消失。
- 决策：Popup Footer 为 Slot Button 宿主提供满宽 Flex 轨道，并改用可命中 Slot 展开节点的后代选择器；Button 的 block 同时在根节点写入 width/max-width 与满宽 Flex 几何。left/right 改为 50% 垂直居中并固定使用 68vw 宽、70vh 高；top 贴住视口顶部并去除顶部圆角，card 模式采用透明外层承载层加真实内层 Surface 面板，外层设置 overflow:visible 让内层 Token 阴影不被裁切，内层从页面真实 navbarHeight 加额外 Token 间距之后开始，Header/Content 不再重复补偿。H5 镜像同步同一几何规则。
- 理由：几何限制属于 Popup 共享组件合同，必须由组件级 Surface 与详情页实际 Navbar 测量共同解决，不能在单个按钮或页面上添加定位补丁。

AI 必须遵守：

- Footer 满宽动作由 Popup 的 Slot 宿主 Flex 轨道与 Button block 根节点的满宽几何共同完成；不要依赖直接子级选择器或页面私有绝对定位。
- left/right Popup 统一使用 68vw × 70vh 和垂直居中规则，不能用 top/bottom 铺满或仅 max-height 替代。
- using-custom-navbar 的 top Popup 必须消费真实 Navbar 高度，并额外保留 Token 化安全间距；top card 模式外层不得绘制第二层 Surface，但必须保留从 Navbar 下方开始的独立真实内层内容面板，并允许其 Token 阴影越出透明承载层。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:check`
- 真机/兼容风险：微信 iOS/Android 真机仍需确认 68vw × 70vh、fixed Surface、Navbar 实际测量值继承和顶部内容触摸命中。

## PUI-FB-0343 · 小程序 Popover 入口未回写显隐且横向定位偏离请求方向

- 原始记录：`feedback/records/pui-fb-0343-miniprogram-popover-horizontal-width.json`
- 范围：`component` / `popover`、`miniprogram-component-pages`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：小程序 Popover 的显示气泡入口必须真实打开；左右触发时保持可读宽度且绝不移出屏幕。
- 实际问题：入口没有页面级对齐容器或 click 回写；横向 placement 没有宽度合同；方向控制曾被错误实现为第二组 Popover 锚点。
- 决策：页面以 popover-page__reference 建立 width:100% + justify-content:center 的唯一入口轨，并由 Button click 写回受控 visible；方向按钮只切换同一 Popover 的 placement；组件横向 Surface 默认 360rpx，测量后以内部 side-width Token 收窄至请求侧可用宽度，只要请求侧仍有物理宽度就保留左右方向，只有该侧为 0 才翻向或在两侧皆为 0 时回落 top/bottom。
- 理由：详情页必须以一个稳定 default Slot 演示各 placement；气泡宽度、请求方向优先级与碰撞回退属于 Popover Surface 职责；内部 CSS 变量不扩张公开 API，也不接管消费者 Slot 样式。

AI 必须遵守：

- 不要把 H5 镜像 CSS 当作小程序组件修复的证据。
- left/right Popover 必须以自身 Surface 声明默认可读宽度，测量后只能通过内部 Token 收窄，不能向 Slot 子树写宽度。
- 详情页使用一个居中的 default Slot 作为唯一锚点；方向按钮只切换 placement 并触发该实例。
- left/right 必须先保留请求侧；只要该侧仍有物理宽度就以组件自身 side-width Token 收窄，只有该侧为 0 才翻向，两个方向都为 0 才回落 top 或 bottom。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：尚未在合法 AppID 的 390px 模拟器或 iOS/Android 真机热重载确认入口点击、左右收窄后的箭头指向、最终边界与触摸外部关闭。

## PUI-FB-0344 · 小程序 Sheet 的 Popup 承载层与 Header end 轨必须稳定三段结构

- 原始记录：`feedback/records/pui-fb-0344-miniprogram-sheet-three-region-inset.json`
- 范围：`component` / `sheet`、`popup`、`miniprogram-component-pages`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：小程序 Sheet 像 Popup 一样拥有紧凑、全宽的 Header、Content、Footer；关闭按钮在 Header 最右侧，Footer 的主 Button 占满动作区。
- 实际问题：Popup Content 与 Sheet 分区叠加两层 padding，Footer 直接投影 Slot，缺少组件级的满宽动作轨和 Header end 对齐轨；首轮修复还遗漏纵向 flex 方向，造成 Sheet 三段内容横向折叠并被裁切。后续 Header 虽出现关闭入口，但仍使用 text 变体、缺少 iconOnly，并没有固定 end 轨；拖拽柄区域也没有使用 Popup 同源的外侧 inset，且绝对触摸区一度引用未定义 Token。
- 决策：Sheet 根禁用 Popup section gap，并把 pui-popup__content 设为零 padding、全宽、flex-direction:column 的承载层；Header action、Body ScrollView、Footer action-track 都成为明确内部结构。Sheet Header 的顶、左、右外侧统一别名为 --pui-sheet-header-inset:var(--pui-surface-inset)，与 Popup Header 的 panel inset 同源；拖拽柄改为居中的绝对定位触摸区，不占用 Header 文档流，并使用已定义的 step-24 宽 / step-12 高 Token。默认 Header 改为标题区 + 固定 72rpx end 轨，使用 default/base、circle、small、iconOnly 的 PUI Button。Footer action-track 采用 column + stretch，不使用 WXSS 通配选择器触碰 Slot 子树。
- 理由：继承 Popup 的 Surface 不等于继承其 Content inset。三段容器必须先在同一纵向轨中排列，再由 Sheet 自身统一管理几何，同时保留消费者 Footer Slot 的业务边界。关闭是标准图标操作，必须复用 Button 的圆形 iconOnly 几何，而不是由空内容的 text Button 偶然呈现。

AI 必须遵守：

- 不要让 Popup 默认 Content padding 与 Sheet 分区 padding 叠加。
- 把 Popup ScrollView 变为 Sheet 承载 flex 层时，必须显式声明 flex-direction:column；默认 row 会让 Header、Body、Footer 横向折叠并在裁切边界中消失。
- Header 的关闭操作必须放在独立 end 轨，默认关闭固定复用 default/base、circle、small、iconOnly 的 PUI Button；Footer 的单一主操作必须使用内部满宽 action track。
- 不得用 WXSS 通配选择器重写消费者 Footer Slot；以明确内部容器的 flex stretch 表达几何。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：尚未在当前合法 AppID 开发者工具的 390px 模拟器或 iOS/Android 真机确认 Popup 内层 ScrollView 与 Sheet Body 的最终滚动仲裁、rpx 内距、拖拽、Footer 伸展和安全区。

## PUI-FB-0345 · Sheet 拖拽柄不应随全局无边框外观消失

- 原始记录：`feedback/records/pui-fb-0345-sheet-handle-borderless-visibility.json`
- 范围：`component` / `sheet`、`config-provider`、`preview-site`、`miniprogram-component-pages`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：Sheet 默认保留可见、可拖动的顶部拖拽柄，不能在全局无边框外观下消失。
- 实际问题：Sheet 拖拽柄仍存在于 WXML 和手势事件中，但其背景被全局无边框 Token 透明化，视觉上消失。
- 决策：小程序 Sheet 拖拽柄改用 --pui-text-placeholder，H5 镜像改用 --subtle；拖拽中仍提升为既有 secondary/muted 状态。
- 理由：拖拽柄是独立交互提示，不是可移除的 Surface 边界；它必须同时适配无边框、深浅色和全局外观配置。

AI 必须遵守：

- 拖拽柄、状态点和操作提示不得消费会被 bordered=false 透明化的边界 Token。
- 组件级可见性修复必须同步小程序、H5、合同、测试、Ledger 和分发产物。
- 不要以页面私有颜色掩盖全局外观 Token 的语义错误。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run site:build`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：尚未在当前合法 AppID 的 iOS/Android WebView 真实设备确认无边框、深浅色与拖拽过程中的拖拽柄对比度及手势。

## PUI-FB-0346 · ActionSheet 遮罩未继承全局毛玻璃且不能局部覆盖

- 原始记录：`feedback/records/pui-fb-0346-action-sheet-overlay-blur-inheritance.json`
- 范围：`component` / `action-sheet`、`config-provider`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：ActionSheet 遮罩默认跟随全局毛玻璃，同时调用方可单独启用或关闭当前遮罩模糊。
- 实际问题：旧遮罩固定 rgba 背景，既不消费 Provider 毛玻璃类，也无局部覆盖路径。
- 决策：新增 nullable blurOverlay；null 继承全局，true/false 仅覆盖当前遮罩。
- 理由：继承默认保证外观开关完整同步，显式值保留组件消费者的局部控制。

AI 必须遵守：

- 不要把固定 rgba 遮罩当作已适配 frostedGlass。
- 局部 blur API 必须区分继承、强制开启和强制关闭。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：未在合法 AppID 真机确认 iOS/Android backdrop-filter、系统低动效与 390px 遮罩边界。

## PUI-FB-0348 · ActionSheet 取消没有关闭请求且独立页缺少局部毛玻璃入口

- 原始记录：`feedback/records/pui-fb-0348-action-sheet-cancel-close-and-page-blur-control.json`
- 范围：`component` / `action-sheet`、`switch`、`config-provider`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：点击 ActionSheet 取消应得到可见关闭结果；组件独立页需要直接控制当前遮罩是否使用毛玻璃。
- 实际问题：取消只发出 cancel，受控页面没有关闭回写；页面没有局部毛玻璃入口。
- 决策：将取消定义为固定关闭路径，并在 ActionSheet 独立页增加局部毛玻璃 PUI Switch。
- 理由：取消是退出动作，必须有可见结果；局部开关复用 nullable blurOverlay，而不复制全局外观状态。

AI 必须遵守：

- 取消需要保留 cancel 业务通知，但随后必须发 close(cancel) 与 visible-change(false)。
- 独立页的局部毛玻璃必须使用 PUI Switch 并绑定现有 blurOverlay，不复制全局外观对象。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：未在合法 AppID 真机确认 iOS/Android backdrop-filter、取消触摸命中及 390px 安全区。

## PUI-FB-0349 · site:build 在目录生成前未刷新 miniprogram_dist

- 原始记录：`feedback/records/pui-fb-0349-site-build-dist-catalog-order.json`
- 范围：`global` / `build-pipeline`、`miniprogram-dist`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：共享组件 API 变更后，site:build 必须一次生成可被 check 验证的 miniprogram_dist、官网目录与预览属性数据，不能让用户额外猜测生成顺序。
- 实际问题：旧 site:build 成功退出但留下已过期的 preview/components-data.js，完整 check 在 metadata stale 报错。
- 决策：site:build 固定为 feedback:generate → miniprogram:build → catalog:generate；新增顺序门禁并纳入 npm run check。
- 理由：目录与预览属性必须以本次构建的真实发布产物为准，构建命令自身应保持闭环而不是依赖人为重跑。

AI 必须遵守：

- 不要让 site:build 依赖修改后人工重复运行生成器。
- 每次改 properties 后，以 check-package 验证 preview/components-data.js 与当前 dist 同步。
- 发布目录是目录/API 生成的真实输入时，任何生成顺序调整都要有自动化门禁。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：无已知遗留项。

## PUI-FB-0350 · Preview 阴影边界门禁遗留已下线 Tooltip 的组件数量

- 原始记录：`feedback/records/pui-fb-0350-preview-shadow-boundary-release-count.json`
- 范围：`global` / `preview-site`、`catalog`、`test-suite`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：全量 check 必须验证当前发布组件集，不得因已完成的 Tooltip 下线保留过期数量并阻断无关组件交付。
- 实际问题：阴影门禁保留 Tooltip 下线前的 71 常量，概览层级门禁保留 78 条 route 常量，在当前 70 组件/77 route 发布集中依次失败。
- 决策：阴影门禁改为比较 packageComponents 与 releaseComponentIds；概览层级门禁同步为当前 77 条公开路由，70 个组件的固定范围继续由 test-component-catalog-pruning.js 独立锁定。
- 理由：阴影测试应关注其自身布局语义，同时从统一发布集读取数量，避免在无关测试内复制可漂移的 catalog 常量。

AI 必须遵守：

- 组件下线后先搜索硬编码数量和遗留 ID，不能只删目录。
- 和组件数量无关的专项测试必须读取 metadata 的单一发布集真相。
- 不要为让历史计数通过而恢复已删除组件。

验证与遗留风险：

- 验证：`npm run check`
- 真机/兼容风险：无已知遗留项。

## PUI-FB-0351 · 无边 Navbar 与静态 ScrollArea 渐变遮罩产生页面视觉割裂

- 原始记录：`feedback/records/pui-fb-0351-navbar-scroll-area-continuous-edge-affordance.json`
- 范围：`component` / `navbar`、`scroll-area`、`miniprogram-home`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：Navbar 保持无下边框时，ScrollArea 的阅读渐隐不能在未滚动或无溢出时制造半透明色带和页面分区错觉。
- 实际问题：Navbar 无边界合同已正确，但 ScrollArea 将两个固定渐变始终挂载，且默认容器色可能与页面画布不同。
- 决策：保留 Navbar bordered=false 的组件默认，以 border-bottom:0 实现；ScrollArea 内部读取原生滚动边缘，页面壳将遮罩上下文色指向 --pui-bg-page。
- 理由：边框与滚动可继续阅读是两个独立语义：前者不应以透明占位存在，后者必须由真实滚动几何驱动。

AI 必须遵守：

- bordered=false 必须用 border-bottom:0，不保留透明边框或占位。
- ScrollArea 顶部仅底层、底部仅顶层、中段两层、无溢出零层；内部监听不得扩张为公开滚动 API。
- 连续页面壳应通过上下文 Token 对齐 ScrollArea 渐变色，不以页面私有遮罩补丁修复。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：未在合法 AppID 真机确认 createIntersectionObserver 相对 enhanced scroll-view 的边缘回调、iOS/Android 惯性滚动和 390px 渐变合成。

## PUI-FB-0352 · Combobox 首次受控打开被零高度测量裁掉搜索框

- 原始记录：`feedback/records/pui-fb-0352-combobox-first-open-bootstrap-height.json`
- 范围：`component` / `combobox`、`input`、`miniprogram-home`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：首页搜索打开后，Combobox 内的真实搜索输入必须可见、可聚焦并筛选组件候选。
- 实际问题：旧实现把零高度视为有效测量结果，首次受控打开可能持续保持 0px，首页只剩 Trigger；受控打开也不会经过内部 requestVisible 的自动聚焦分支。
- 决策：Combobox 仅接受非零测量值作为稳定 Panel 高度；首次可见且尚未测得高度时使用内部 160px 引导轨道。受控和非受控打开共同从 visible 状态推导 queryFocus；H5 使用同名引导轨道和真实 input focus。
- 理由：引导轨道只覆盖无法测量的首帧，首个真实高度立即接管，不改变公开 Prop、事件、滚动上下文或既有稳定高度规则。

AI 必须遵守：

- Panel 的稳定高度只能由非零实测结果建立，0px 回调必须保留当前引导或既有高度。
- 受控 visible=true 与 Trigger 打开必须使用同一搜索 Input 焦点语义。
- 首开兜底只属于 Combobox 内部实现，不新增页面私有 min-height 或第二个搜索输入。

验证与遗留风险：

- 验证：`node scripts/test-combobox.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：仍需在 iOS 和 Android 真机确认 SelectorQuery 首帧、软键盘、中文输入法候选、Overlay 触摸阻断与焦点保持。

## PUI-FB-0353 · Overlay 独立页将展示文案误做成内容面板

- 原始记录：`feedback/records/pui-fb-0353-overlay-greeting-without-panel.json`
- 范围：`component` / `overlay`、`miniprogram-component-page`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：Overlay 独立页打开后只展示居中的大号 Hi PoemCoder，不应出现内容面板。
- 实际问题：旧独立页与 H5 概览均把默认 Slot 组织为带 Cell 和 Button 的内容面板，干扰 Overlay 作为纯遮罩原语的展示。
- 决策：小程序独立页和 H5 概览统一以居中的 display 级 Hi PoemCoder 作为默认 Slot 展示；不改 Overlay 的 Props、click 回写、滚动阻断或局部/全局 blur 规则。
- 理由：纯文本能直接验证遮罩覆盖与 Slot 投影，同时避免给 Overlay 演示新增第二个可见 Surface。

AI 必须遵守：

- Overlay 示例 Slot 的展示文本不得被 Cell、Card、Popup 或 Button 面板包裹。
- 展示级文字使用 pui-text-display 与同名字体 Token，小程序和 H5 同步。
- 页面示例变更不得改变 Overlay 的受控 click、blur 或滚动阻断公开合同。

验证与遗留风险：

- 验证：`node scripts/test-overlay.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：仍需在合法 AppID 的 iOS 和 Android 真机确认 fixed 遮罩内 display 文案的垂直居中、深浅色对比、Slot 投影与点击穿透边界。

## PUI-FB-0354 · Combobox 将搜索输入误纳入基础选择组件

- 原始记录：`feedback/records/pui-fb-0354-combobox-fixed-viewport-external-search.json`
- 范围：`component` / `combobox`、`search`、`miniprogram-home`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：Combobox 只提供默认固定高度的可滚动选项内容；Search 是独立组件，不应成为 Combobox 内部结构。
- 实际问题：原组件公开 query、filterable、allowCreate 等搜索 API，并内嵌 Input、首开测量和创建项；拆分后首页又给 Search 私自设置 640rpx 最大宽度，而 Combobox 占满 Overlay 轨道，造成左右间距不等。
- 决策：删除 Combobox 的内部 Input、query/defaultQuery/searchPlaceholder/filterable/allowCreate/createText/showPanelClose/maxHeight API；新增 listHeight，默认 480rpx，范围 160–800rpx。首页用独立 pui-search 的 change 过滤 options，并以 round + center 展示；Search 与 Combobox 共同占满同一条 Overlay 宽度轨道。
- 理由：选择、搜索和业务创建分别由清晰组件或页面组合承担，固定视口使小程序与 H5 的滚动边界和开合几何可预测。

AI 必须遵守：

- Combobox 不得重新公开或内嵌 query、filterable、Search Input、create 或首开高度测量。
- 固定 listHeight 只定义 Panel 和唯一列表滚动区；内容数量、空态和加载态不得改变它。
- 需要搜索时用 pui-search 真实回写 query，过滤后的 options 再传给 Combobox。
- 页面组合不得用私有 input 替代 pui-search。
- round + center 的 Search 仍须消费父级完整可用宽度；与 Combobox 相邻时两者必须共享同一左右 inset。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run pack:check`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run site:build`
- 验证：`npm run example:install`
- 真机/兼容风险：尚需在合法 AppID 的 iOS 和 Android 真机确认圆形 Search 的软键盘、Overlay 居中、固定 scroll-view 惯性滚动与触摸关闭边界。

## PUI-FB-0355 · 首页搜索遗漏可导航组件且列表视口偏高

- 原始记录：`feedback/records/pui-fb-0355-home-search-catalog-viewport.json`
- 范围：`component` / `miniprogram-home`、`search`、`combobox`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：首页搜索列表应展示所有真实组件，并在每次打开时随机排序；Combobox 内容区需要更紧凑。
- 实际问题：首页候选遗漏六个浮层组件，且没有为 Overlay 场景覆盖较紧凑的列表高度。
- 决策：搜索候选由 CATALOG_SECTIONS 的全部当前可导航条目汇集，每次 Overlay 打开时随机排序；首页单独传入 list-height=360，组件默认 480rpx 保持不变。
- 理由：搜索只能导航到真实独立页，随机顺序避免目录首项长期垄断，同时页面级紧凑高度不污染 Combobox 的通用默认值。

AI 必须遵守：

- 搜索候选必须从当前真实组件目录汇集，不能只保留某个分区，也不能伪造没有路由的组件入口。
- 每次打开首页搜索时再随机排列候选，筛选只在该次顺序上进行。
- 页面级 listHeight 应作为消费者 Prop 覆盖，Combobox 继续保持唯一滚动区与组件级默认值。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：仍需在合法 AppID 真机确认 360rpx 列表的惯性滚动、随机顺序与九个入口的触摸可达性。

## PUI-FB-0356 · Search round 引用未定义 Token 并绕过全局边框外观

- 原始记录：`feedback/records/pui-fb-0356-search-round-provider-token.json`
- 范围：`component` / `search`、`input`、`config-provider`、`miniprogram-home`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：圆形居中 Search 必须显示满圆胶囊，并正确跟随全局主题、边框和普通圆角外观。
- 实际问题：round 回退为 Input 的普通圆角，Search 无法响应全局边框开关。
- 决策：Input 新增内部 --pui-input-field-radius 语义变量；Search 按 shape 注入 --pui-radius-round 或 --pui-radius-medium，nested Input 保持 bordered=true；H5 同步改为 bordered=true。
- 理由：让圆角与外观由同一 Token 链继承，避免跨组件几何覆写；explicit round 保持稳定的圆形语义。

AI 必须遵守：

- 禁用 Token 扫描未定义变量；--pui-radius-full 不是主题 Token，圆形使用 --pui-radius-round。
- Search 不得以 bordered=false 绕过 Provider；中性边框可见性由 --pui-border-color 决定。
- Search 等组合组件不得用跨组件 selector 重写 Input Field 的高度、padding、背景、边框或圆角；只允许 Input 内部公开的语义变量。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run site:build`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：需在合法 AppID 真机验证 round Search、border 开关、浅深色和圆角开关的计算样式与触摸输入。

## PUI-FB-0357 · 首页缺少微信原生分享与朋友圈页面合同

- 原始记录：`feedback/records/pui-fb-0357-miniprogram-home-native-share.json`
- 范围：`component` / `miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：首页可以通过微信系统菜单稳定分享给好友，并在条件允许时分享到朋友圈。
- 实际问题：首页没有声明任何原生分享返回载荷或朋友圈页面开关。
- 决策：首页通过 onShareAppMessage 返回标题、/pages/index/index 与包内品牌图；通过 onShareTimeline 返回同源标题和品牌图，并在页面 JSON 开启 enableShareTimeline。
- 理由：使用微信原生系统菜单可保证接收者进入可恢复首页，不增加重复分享按钮、前端成功提示或无法验证的统计。

AI 必须遵守：

- 需要分享的页面必须实现 onShareAppMessage，并只返回可恢复的公开路径和包内或合规网络图片。
- 需要朋友圈能力时，在页面 JSON 设置 enableShareTimeline=true，并实现 onShareTimeline。
- 分享路径不得携带临时 UI 状态、用户偏好或未经同意的用户数据。
- 分享发送结果与朋友圈可用性只能由合法 AppID 和真机确认，不能由 H5 或静态测试冒充。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run site:build`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：需以合法 AppID 在真实微信客户端确认系统菜单中的好友分享、朋友圈入口、卡片图、标题和回流路径；朋友圈入口受微信类目、基础库和客户端条件限制。

## PUI-FB-0358 · 已落地组件在首页复用近似图标，浮层语义难以辨识

- 原始记录：`feedback/records/pui-fb-0358-component-dedicated-icon-system.json`
- 范围：`component` / `icon`、`miniprogram-home`、`button`、`divider`、`popup`、`popover`、`sheet`、`action-sheet`、`dropdown-menu`、`overlay`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-25
- 用户目标：为真实小程序现有的九个组件独立页设计可辨识的 PoemUI Roundline 图标，并经 pui-icon 的唯一生成链路在首页与 Icon 资源页正式提供。
- 实际问题：初始首页把多个不同组件映射到相近通用图标；首轮专属稿把组件说明图压入 24×24，整体被用户否决；第二版 Popup 的局部错层背板仍有复制/叠层歧义，随后的开放角标又没有直接表达真实手机与 Popup 卡片的覆盖关系。
- 决策：保留 components / 组件 分类和九个公开名称，以每枚最多 3 个可见图元的减线几何生成；Popup 改为一条中断式竖向手机轮廓与一张从右下方覆盖的较小方形卡片。继续以锁定 lucide-static 骨架结合 take、append、transform 生成 SVG、Icon Font 目录、H5 数据和九宫格辨识稿。
- 理由：manifest 仍是小程序、H5、npm 和首页唯一可复现的图标真相源；竖向长方形建立手机视口语义，较小方卡建立前景 Popup，手机右边与底边在遮挡处中断，从而用两个图元直接表达真实层级且不产生穿透线。

AI 必须遵守：

- 首页组件目录的 icon 必须是当前 pui-icon manifest 中的稳定名称，禁止凭相近语义复用或猜测。
- 24×24 组件图标先建立不超过 3 个可见图元的复杂度预算，禁止同时画完整视口、组件外壳和多行内容。
- Popup 固定使用后方竖向手机轮廓与下方覆盖上来的较小方卡；手机被遮挡的边线必须中断，禁止让背景轮廓穿过前景卡片。
- Popup、Popover、Sheet、ActionSheet、DropdownMenu、Overlay 必须分别表达手机上的覆盖卡、锚点连接、底边贴合、操作行、Trigger 下拉和覆盖焦点区。
- 新增图标分类时同步生成 manifest、SVG、Icon Font 目录、H5 数据、miniprogram_dist、示例安装和微信 npm 构建，不维护页面私有图标名单。
- 没有用户最终视觉确认时，记录保持 resolved / pending-user；微信 CLI 或真机失败必须保留真实错误，不能用静态图或构建替代。

验证与遗留风险：

- 验证：`npm run icons:generate`
- 验证：`node scripts/test-icon.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`node scripts/test-miniprogram-overlay-pages.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project miniprogram`
- 真机/兼容风险：iOS 与 Android WebView 真机仍需确认 20rpx 浮层家族辨识、56rpx 长名称换行、深浅色 currentColor、长目录惯性滚动、读屏与点击命中。
- 真机/兼容风险：当前项目不支持 Skyline；其布局或命中结果不作为本记录的验收范围。

## PUI-FB-0359 · ActionSheet 共同 Layer 透明度导致遮罩先于面板完成进入

- 原始记录：`feedback/records/pui-fb-0359-action-sheet-mask-surface-enter-timing.json`
- 范围：`component` / `action-sheet`、`popup`、`preview-site`、`miniprogram-component-pages`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：ActionSheet 打开时遮罩、Blur 与底部 Surface 像 Popup 一样在同一进入帧开始，不能先完成遮罩再出现面板。
- 实际问题：共同 Layer 额外执行 500ms opacity，Mask 与 Surface 又各自执行 500ms 动效，形成双重透明度并让 Surface 视觉晚于遮罩。
- 决策：将 ActionSheet Layer 收敛为无视觉动画的全屏挂载层；保留现有 active/phase 生命周期，由 Mask 和 Surface 在同一个 active 帧分别开始 opacity 与 translateY。
- 理由：复用 Popup 已验证的职责划分即可消除视觉延迟，不改变 ActionSheet API、500ms/1ms 时长、受控显隐、事件顺序或退场卸载。

AI 必须遵守：

- 任何带 Blur 的浮层不得在共同 Layer 上动画 opacity；否则 backdrop-filter 与 Surface 会被父级透明度延后。
- ActionSheet Mask 自己管理色遮 opacity，Surface 自己管理 opacity/translateY，两者共享同一 active 帧和时长。
- 修复浮层时序必须同步小程序、H5 镜像断言、组件合同、Ledger、dist、示例安装和微信 npm 产物。

验证与遗留风险：

- 验证：`node scripts/test-action-sheet.js`
- 验证：`PUI_VERIFY_DIST=1 node scripts/test-action-sheet.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project '/Users/fanx/Documents/poemUI 小程序组件库/miniprogram'`
- 验证：`shasum action-sheet/action-sheet.wxss miniprogram_dist/action-sheet/action-sheet.wxss _example/node_modules/poemui-miniprogram/miniprogram_dist/action-sheet/action-sheet.wxss miniprogram/miniprogram_npm/poemui-miniprogram/action-sheet/action-sheet.wxss`
- 真机/兼容风险：iOS/Android 真机仍需确认 backdrop-filter 性能、系统低动效、fixed 遮罩和触摸命中。

## PUI-FB-0360 · 小程序缺少反馈分区的真实组件独立页与可搜索路由

- 原始记录：`feedback/records/pui-fb-0360-miniprogram-feedback-section-pages.json`
- 范围：`global` / `miniprogram-home`、`alert`、`empty`、`loading`、`notice-bar`、`progress`、`result`、`skeleton`、`toast`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：将完整的反馈组件分区迁移到真实微信小程序首页和独立页面，并保持 H5 与小程序的组件合同同步。
- 实际问题：迁移前反馈组件只能在 H5 预览或包级示例中查看，小程序用户无法从首页进入，也没有页面级交互和验收门禁。
- 决策：新增反馈分区和八个独立页，复用现有组件页面基础设施；小程序页面只承担父级状态与导航，H5 保持现有组件镜像作为并行验证面。
- 理由：复用统一页面壳能维持 Navbar、外观、唯一滚动区和 390px 边界，同时不污染八个组件已经确定的公开 API。

AI 必须遵守：

- 新增独立页必须复用 ConfigProvider、共享 Navbar、单一 ScrollArea 和 component-page-section。
- 页面只组合组件的公开 API；组件没有业务完成、重试或 action 事件时不得在页面把视觉变化叙述为业务结果。
- 首页目录、搜索候选、app.json 路由和页面专项测试必须同批更新；H5 镜像继续检查而不复制其 DOM。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-feedback-pages.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：合法 AppID 真机仍需验证 390px 长页滚动、NoticeBar 和 Toast 触摸、rpx、读屏、系统低动效、深浅色与全部全局外观组合。

## PUI-FB-0361 · Style Utilities 的背景渐变必须可直接挂载到 View 与容器

- 原始记录：`feedback/records/pui-fb-0361-style-utilities-background-gradient-presets.json`
- 范围：`global` / `style-utilities`、`preview-site`、`theme-tokens`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：快速样式开发需要流金粉、高级黑、水泥白、黑金、浅金，以及 AI 色、粉蓝紫等可筛选、可复用的渐变背景预设。
- 实际问题：原先仅有官网内部中性渐变开关，npm utilities 没有命名预设，也没有选择和持久化路径；现已补齐九个主题感知预设，其中新增 AI 雾蓝紫、赛博粉蓝、极光紫。
- 决策：以 theme.wxss 的九组 light/dark Background Gradient Token 为唯一色值源，utilities 发布 pui-bg-gradient-*；调用者可直接将类写入业务 View 或布局容器，官网 gradientPreset 继续只控制 App Shell、Preview Stage 和 PreviewDevice。
- 理由：预设成为可直接组合的背景能力，同时保持主题文字对比、组件 Surface 语义和现有渐变开关的布局零副作用。

AI 必须遵守：

- pui-bg-gradient-* 可直接挂在业务 View 或布局容器；不要穿透覆盖 PUI 组件内部 Surface。
- 新增预设必须同时提供 light/dark Token、官网 Select、持久化白名单和 source/dist 契约。
- 预设不能改变主题、间距、圆角、层级或组件业务状态。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：浏览器 390px 的选择、刷新恢复和深浅色对比尚待真实页面点击验证。
- 真机/兼容风险：微信小程序目标基础库的 CSS 变量继承、渐变渲染与性能尚待合法 AppID 真机验证。

## PUI-FB-0362 · Alert 图标与正文使用紧凑间距导致信息层级拥挤

- 原始记录：`feedback/records/pui-fb-0362-alert-icon-content-normal-gap.json`
- 范围：`component` / `alert`、`preview-site`、`miniprogram-component-pages`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：Alert 的图标与正文要有清晰呼吸感，同时保持外壳左内距和关闭操作轨道不变。
- 实际问题：修复前 Icon 与正文共用 small 间距，视觉上小于同级信息块的正常阅读节奏。
- 决策：仅将 .pui-alert__main 的 gap 改为 --pui-space-normal；不改变 Alert 左右 padding、Icon 尺寸、关闭操作轨、API 或动效。
- 理由：normal 是既有 Token 中 Icon 与可换行正文的语义组合层级，增加 8rpx 而不会引入页面私有尺寸或压缩 390px 可用宽度。

AI 必须遵守：

- Alert 外壳 left/right padding 使用 large，Icon 与正文使用 normal，主内容与关闭操作使用 small。
- 修正 Alert 阅读节奏时不得扩大页面或组件外壳 padding，也不得使用魔法 rpx。
- 小程序与 H5 必须使用同一 normal 语义层级，并由专项测试共同锁定。

验证与遗留风险：

- 验证：`node scripts/test-alert.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project '/Users/fanx/Documents/poemUI 小程序组件库/miniprogram'`
- 验证：`shasum alert/alert.wxss miniprogram_dist/alert/alert.wxss _example/node_modules/poemui-miniprogram/miniprogram_dist/alert/alert.wxss miniprogram/miniprogram_npm/poemui-miniprogram/alert/alert.wxss`
- 真机/兼容风险：iOS/Android 真机仍需确认 rpx 计算、系统字体基线、深浅色/全局外观与触摸命中。

## PUI-FB-0363 · Alert 需要独立的行内纵向对齐与同色系正文

- 原始记录：`feedback/records/pui-fb-0363-alert-contrast-and-vertical-align.json`
- 范围：`component` / `alert`、`preview-site`、`miniprogram-component-pages`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：Alert 需要可单独控制内容垂直居中，并保留原有轻量主题底色、将文字换为同色系深色；小程序独立页要展示多种真实示例。
- 实际问题：修复前 center 无法单独表达纵向对齐，且没有共享的 tinted 外观 API 或 Token。首轮 tinted 虽改变了 Alert 文本 Token，但旧 Icon 将内置 SVG 当作 image 并通过 Canvas 着色，CSS 变量不能作为 Canvas 颜色，因此曾需要额外实体色表。
- 决策：新增 verticalAlign='top|center' 与 variant='soft|tinted'。center 保留为兼容别名语义：强制 verticalAlign=center 并继续居中文本。tinted 保留既有 theme light 背景，并使用 common/style/theme.wxss 与 H5 同名的 per-theme 前景/辅助前景 Token。PUI-FB-0364 将内置 pui-icon 改为 currentColor 字体字形后，Alert 删除 JS 实体色镜像表并直接把同名 CSS Token 传给 Icon；H5 继续传同一 Token。
- 理由：布局轴与视觉层级是独立需求；Token 化可让深浅色、全局外观和 H5 镜像共享同一语义，而不是将浅色提示改为反白深底或在页面写死颜色。

AI 必须遵守：

- 新增布局 API 时先拆分轴向含义，并保留既有公开 Props 的组合语义。
- tinted 必须保留原有 theme light 背景，并按 theme 提供 foreground/secondary Token，标题、Icon、说明和关闭入口共同消费；内置 Icon Font 直接接收同名 CSS Token，不得在 Alert 复制第二份深浅色实体颜色表。
- H5、WXML、API、独立页示例和专项测试必须同步；多示例中至少保留一个真实受控显隐链路。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project '/Users/fanx/Documents/poemUI 小程序组件库/miniprogram'`
- 真机/兼容风险：iOS/Android 真机仍需确认本地 Icon Font 的首次解析、currentColor、rpx、系统字体基线、深浅色和全局外观切换后的图标重绘及触摸命中。

## PUI-FB-0364 · 内置 Icon 需要真实 Icon Font 与 currentColor

- 原始记录：`feedback/records/pui-fb-0364-icon-font-current-color-runtime.json`
- 范围：`component` / `icon`、`alert`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：pui-icon 的内置名称采用真正的 Icon Font 方案，使实体颜色、PUI CSS Token、深浅色和组件继承色都能像主流小程序组件库一样直接生效。
- 实际问题：旧实现把内置 name 映射为 SVG 路径并统一走 image；传 color 后依赖 Canvas source-in，因此 CSS Token、继承色和部分组件语义色无法直接生效，并产生额外图片解码与画布节点。
- 决策：全部 209 个内置 name 只从生成的 icon-font-map.js 解析为本地 WOFF2 字形并使用 currentColor，pui-icon 小程序运行时不再导入 icon-map，也不存在 SVG/image/Canvas 回退。PUI-FB-0365 进一步将公共 API 收敛为 name/size/color/ariaLabel，删除本记录初版曾保留的 src/load/error 图片通道；生成器维护稳定 PUA 码点、字体映射、字体 WXSS、H5 同源字体数据与 manifest。
- 理由：字体字形是微信 WebView 中让内置单色图标继承 CSS Token 的直接方案；本地 data URI 同时满足离线、无 CDN 和标准 npm 交付。跨端纯 Icon Font 合同已经由 PUI-FB-0365 固化，图片职责只属于 pui-image。

AI 必须遵守：

- 新增图标必须进入 scripts/generate-icons.js、稳定码点登记和唯一生成链路，禁止手改字体 map 或 WXSS。
- pui-icon 小程序运行时不得导入 icon-map、SVG 路径表或为内置 name 增加 image/Canvas 回退；icon-map 只服务 H5、资源目录和审计。
- 内置 name 的 color 优先使用 PUI Token 或安全实体色，直接依赖 currentColor，不为每个消费组件复制颜色表。
- 禁止给 pui-icon 恢复 src；业务图片和品牌图必须使用 pui-image。
- 字体生成必须先把 Roundline 描边纯矢量展开为封闭轮廓，并视觉检查 20rpx、32rpx、56rpx。
- Icon 仍是展示叶子；可点击操作继续使用 PUI Button + Icon。

验证与遗留风险：

- 验证：`npm run icons:generate`
- 验证：`node scripts/test-icon.js`
- 验证：`node scripts/test-alert.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`npm run miniprogram:build`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project '/Users/fanx/Documents/poemUI 小程序组件库/miniprogram'`
- 真机/兼容风险：iOS/Android 真机仍需确认内嵌 WOFF2 data URI 的首次解析、字体基线、20rpx 小尺寸抗锯齿、样式隔离和低端设备内存表现。
- 真机/兼容风险：移除 src 是有意的 API 收敛；旧消费者必须迁移到 pui-image，不能依赖静默兼容。

## PUI-FB-0365 · H5 与小程序必须统一为 Icon Font 唯一运行时

- 原始记录：`feedback/records/pui-fb-0365-cross-platform-icon-font-only-runtime.json`
- 范围：`component` / `icon`、`image`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：所有 pui-icon 在 H5 与微信小程序中都必须使用同一 Icon Font，并把 inline SVG、icon-map、图片、CSS mask 和 Canvas 旧运行时彻底移出当前环境。
- 实际问题：跨端运行时不一致，旧 src 与 SVG/image/mask/Canvas 分支仍存在于源码、H5 数据、目录页、测试、文档和发布检查中。
- 决策：pui-icon 公共 API 收敛为 name/size/color/ariaLabel；生成器输出 icon-font-map.js、icon-font-catalog.js 及跨端一致的内嵌 WOFF2 CSS。H5 和小程序只渲染字体字形，删除 icon-map.js、inline SVG、CSS mask/image、小程序 image/Canvas 和 src API。SVG 仅作为字体生成与审计真相源，业务图片统一使用 pui-image。
- 理由：单一字体运行时才能保证名称、几何、码点、颜色继承和安装产物跨端一致，也能避免旧兼容分支持续增加解码、Canvas 和双重测试成本。

AI 必须遵守：

- 禁止恢复 icon-map.js、inline SVG、CSS mask/image 或小程序 image/Canvas 图标分支。
- 禁止给 pui-icon 恢复 src；业务图片和品牌图必须使用 pui-image。
- H5 与小程序字体 CSS 必须由同一生成调用输出并逐字节一致。
- Icon 目录只能消费生成的 icon-font-catalog.js 或同源 H5 字体目录，不维护页面私有名单。
- 新增图标必须进入 SVG 设计真相源、稳定码点和唯一字体生成链路。

验证与遗留风险：

- 验证：`npm run icons:generate`
- 验证：`node scripts/test-icon.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project '/Users/fanx/Documents/poemUI 小程序组件库/miniprogram'`
- 真机/兼容风险：iOS/Android 真机仍需确认内嵌 WOFF2 data URI 的首次解析、字体基线、20rpx 抗锯齿、缓存和不同基础库表现。
- 真机/兼容风险：移除 src 是有意的 API 收敛；旧消费者必须迁移到 pui-image，不能依赖静默兼容。

## PUI-FB-0366 · Combobox 候选行缺少统一 inset 与图文对齐规则

- 原始记录：`feedback/records/pui-fb-0366-combobox-option-inset-icon-copy-alignment.json`
- 范围：`component` / `combobox`、`icon`、`search`、`miniprogram-home`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：首页搜索候选的左右内距必须一致；有 Icon 时，Icon 与正文之间保留明确空间，右侧 Check 或正文末端仍与左侧 Icon 起点保持对称。
- 实际问题：候选行只直接消费通用 padding/gap，缺少可追溯的 Option 几何边界，页面容易以局部样式补偿首页候选。
- 决策：Combobox 根新增内部 option inline/block inset 与 option gap Token；WXML 与 H5 都采用 Icon、正文、Check 三轨。Icon 起点与右侧 Check 或正文末端共享同一 inline inset，Icon→正文固定为 content gap。
- 理由：候选项是选择组件的内部交互根，不应改用页面 Cell 或由首页私有 padding 修补；内部语义 Token 可保持标准几何并同步双端。

AI 必须遵守：

- 不要把 Combobox option 替换为 Cell，也不要在首页为候选行添加私有 padding。
- Option 的 Icon 起点和右侧 Check/正文末端必须消费同一横向 inset。
- Icon 与正文只消费 option content gap；它不参与 equalSpacing 的 Surface 结构间距。
- 修改 option 几何时同步小程序 WXML/WXSS、H5 结构/CSS、合同、Ledger、专项测试和发布产物。

验证与遗留风险：

- 验证：`node scripts/test-combobox.js`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：尚需在微信 390px 模拟器与 iOS/Android 真机确认长描述、带 Check、深浅色、大圆角和等距模式下的真实几何与触摸命中。

## PUI-FB-0367 · Icon Font 闭口圆形被错误填成实心

- 原始记录：`feedback/records/pui-fb-0367-icon-font-closed-circle-holes.json`
- 范围：`component` / `icon`、`preview-site`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：PoemUI Roundline 中表达圆环、头像、轨道节点等闭口圆形的描边必须保持镂空，不能在转换为 Icon Font 后被填成实心。
- 实际问题：生成器以 Maker.js 默认 evenodd 路径导出描边轮廓，再交给使用非零填充的字体格式；内外轮廓同向时内腔被填满。Maker.js 对 360 度 Arc 的 nonzero 导出也未正确反转嵌套内环。
- 决策：字体生成统一使用 Maker.js nonzero 轮廓导出；导出前把完整 360 度 Arc 转为 Circle，使包含关系能够为内环分配相反绕向。仅当 circle 半径大于半描边宽度时保留内腔；不满足该几何条件的省略号、Radio 内点、Popover 锚点等继续作为语义实心点。
- 理由：字体格式本身没有 SVG evenodd fill-rule，必须在唯一生成链路中正确编码轮廓方向。区分圆环与语义点既修复用户看到的实心化，也避免给本应实心的微小点制造抗锯齿针孔。

AI 必须遵守：

- 不得用运行时白色遮盖或逐图标补丁修复字体孔洞，必须修 SVG 描边到字体轮廓的唯一生成链路。
- 完整 360 度 Arc 在 nonzero 导出前必须归一化为 Circle，确保内外轮廓方向相反。
- circle 半径大于半描边宽度时必须保留内腔；不大于该边界的省略号、Radio 内点等语义点不得制造针孔。
- 修改轮廓工具或字体生成算法后必须运行全量 topology 测试，并在 20rpx、32rpx、56rpx 与 390px 真实字体渲染中复核。

验证与遗留风险：

- 验证：`npm run icons:generate`
- 验证：`node scripts/test-icon-font-outlines.js`
- 验证：`node scripts/test-icon.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：iOS/Android 真机仍需确认 20rpx 下最小圆环内腔、字体抗锯齿、基线和首次 WOFF2 解析。

## PUI-FB-0368 · 快速样式 Tabs 将目录 key 错传为数字索引

- 原始记录：`feedback/records/pui-fb-0368-style-utilities-tab-value-mapping.json`
- 范围：`component` / `style-utilities`、`tabs`、`tabbar`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：快速样式页切换任一分类 Tab 后，当前分类的标题、示例和完整候选内容必须立即切换。
- 实际问题：原始目录对象缺少 value，Tabs 退化为数字索引，受控父级忽略 change，页面内容不切换。
- 决策：快速样式页保留生成目录作为业务真相源，并派生 groupTabs 仅供 PUI Tabs 使用；每项明确提供 label、value、icon 和 ariaLabel。
- 理由：不改变 Tabs 的公共 value 合同，也不向生成目录添加 UI 组件专用字段；页面适配层保证受控选择始终使用稳定字符串 key。

AI 必须遵守：

- PUI Tabs 的受控 value 必须与每个 items[].value 严格同型、同值。
- 不要把缺少 value 的业务目录对象直接传给 Tabs。
- 页面 Tab 切换必须有专项测试验证真实 change detail 能更新可见内容。
- H5 若采用独立筛选控件，必须明确其状态写入路径，不能声称与小程序自动同构。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-style-utilities-page.js`
- 验证：`node scripts/test-tabs.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：尚需在微信 390px 模拟器与 iOS/Android 真机确认分类点击、横向滚动、触摸取消和深浅色外观组合。

## PUI-FB-0369 · 快速样式页重复内容标题区

- 原始记录：`feedback/records/pui-fb-0369-style-utilities-remove-duplicate-content-header.json`
- 范围：`component` / `style-utilities`、`navbar`、`tabs`、`scroll-area`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：快速样式页顶部不保留重复的内容 Header 标题区，首屏应直接进入分类和内容。
- 实际问题：内容区重复建立页面 Header，首屏分类与可操作内容被向下推移。
- 决策：删除内容 Header 与专属样式，仅保留分类示例内部的当前分组标题和说明。
- 理由：当前分类说明直接服务于已选内容，而页面标题在 Navbar 已经完整表达；移除重复层级可提高首屏操作密度。

AI 必须遵守：

- 页面标题只能存在于 Navbar 或内容 Header 的其中一处。
- 移除重复 Header 时保留当前分类、当前组件或当前任务所需的局部标题。
- 同步删除无引用样式，并用页面专项测试禁止旧 DOM 回归。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-style-utilities-page.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：尚需在微信 390px 模拟器和 iOS/Android 真机确认首屏密度、Tabs 横滚、ScrollArea 渐变遮罩与安全区。

## PUI-FB-0370 · Tabs 未按数量自动切换等分与半露阅读轨道

- 原始记录：`feedback/records/pui-fb-0370-tabs-horizontal-overflow-peek-and-even-spacing.json`
- 范围：`component` / `tabs`、`style-utilities`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：Tabs 数量大于四时固定露出四个完整项和第五项的一半，让用户知道右侧还有可横滚内容；四项及以下按等分展示。
- 实际问题：布局判定只读取调用方的 spaceEvenly，五项快速样式页需要页面私有 false；既有横向最小宽度也不能保证精确的 4.5 项可见几何。
- 决策：Tabs 内部以数量自动布局：items≤4 且 spaceEvenly!==false 时使用 flex:1 1 0 + min-width:0 等分；items>4 固定在小程序/H5 使用 22.222222% 项宽，形成四个完整项加第五项一半。H5 仅在等分轨道向 Button 传 block；快速样式页删除页面私有 space-evenly=false。
- 理由：数量是用户能否一屏理解分类的真实边界；用真实下一项局部可见传达可滚动性，不增加页面私有箭头、遮罩或第二套导航。

AI 必须遵守：

- 不要以页面私有箭头或遮罩提示 Tabs 横滚。
- 横向 Tabs 的半露出几何必须由 Tabs 内部 22.222222% 轨道管理，并同步 H5。
- 超过四项时不得由页面传 spaceEvenly=false 或其他私有宽度补丁触发半露；仅标签文字允许裁切。
- 390px 下不允许 Tabs 造成页面级横向溢出。

验证与遗留风险：

- 验证：`node scripts/test-tabs.js`
- 验证：`node scripts/test-miniprogram-style-utilities-page.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：尚需在微信 390px 模拟器和 iOS/Android 真机确认第五项半露宽度、惯性横滚、选中项自动滚入、指示器测量、触摸取消及深浅色外观组合。

## PUI-FB-0371 · 快速样式生成目录仍暴露主题与行为旧分类

- 原始记录：`feedback/records/pui-fb-0371-miniprogram-style-utilities-five-clear-groups.json`
- 范围：`component` / `style-utilities`、`tabs`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：快速样式的五个 Tabs 必须使用布局、尺寸、间距、字体、背景等可理解分类，不保留含义不清的主题与行为。
- 实际问题：生成器源码和文档已使用五类，但没有刷新运行页读取的生成目录，页面仍展示旧的主题与行为分类；刷新目录后页面示例仍保留 visual/behavior 条件，background 无法命中示例。
- 决策：以生成器的五类 key 作为唯一目录真相；通过 site:build 刷新运行目录，页面继续将 group key 显式派生为 PUI Tabs 的 value，并把示例条件改为 background、移除 visual/behavior。
- 理由：分类只在生成器维护，避免在页面层手写同一份 utility 清单或用文案转换掩盖过期生成物。

AI 必须遵守：

- 修改 style utilities 分组后必须运行 site:build，再读取 miniprogram/common/data/style-utilities-catalog.js 验证真实输出。
- PUI Tabs 必须接收由 group key 显式派生的 value，不能依赖对象顺序或旧标签。
- 深色文字归字体，深色背景、边框和阴影归背景；溢出、动效、展示和辅助类归布局。
- 微信 CLI code 10 或 islogin=false 只能说明环境登录阻断，不能声称小程序已编译或真机已验收。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 验证：`微信 CLI islogin`
- 真机/兼容风险：2026-07-25 已在新版微信开发者工具 Stable 2.01.2510290 回读 islogin=true，并以 AppID wx23aa017375535746 完成官方 CLI build-npm（1854ms、0 warnings）；微信 390px 模拟器和 iOS/Android 真机仍尚未复验五项横向滚动、触摸和深浅色外观组合。

## PUI-FB-0372 · 快速样式的粘性预览与 Tabs 下划线必须对齐真实轨道

- 原始记录：`feedback/records/pui-fb-0372-style-utilities-sticky-preview-and-tabs-indicator.json`
- 范围：`component` / `style-utilities`、`tabs`、`scroll-area`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：快速样式页只保留粘性预览和无标题目录；Tabs 与预览都能随滚动保持可见，下划线准确落在当前项。
- 实际问题：尺寸分类可出现空白，目录额外占用标题空间；line 下划线与真实 Button 分属不同坐标/宽度约束，首项可能显成空位。
- 决策：补齐尺寸预览，移除目录标题；保留同一 ScrollArea 的 Tabs Header 与预览 sticky。line Indicator 直接放进激活 pui-button，并用 Button 的 block 能力让点击根填满当前轨道。
- 理由：预览必须覆盖每个可选分类；唯一 ScrollArea 保证用户滚动目录时始终能看到效果。下划线和标签共用同一个 Button 根后不再需要预测或测量横向 ScrollView 坐标。

AI 必须遵守：

- Tab 分类增加或保留时，必须同时提供对应预览，不能留下可点击空白分类。
- Tabs 内容只允许预览和实际目录；不要恢复分类标题、说明、已选 class 或目录标题区。
- 粘性 Header 与粘性预览必须共享同一个 ScrollArea，不能增加第二个滚动容器。
- Tabs 必须传入 PUI Button 的 block，不能靠外部 class 覆盖其 small 默认最小宽；line Indicator 直接从激活 Button 的中心定位，不计算 ScrollView 坐标。

验证与遗留风险：

- 验证：`node scripts/test-tabs.js`
- 验证：`node scripts/test-miniprogram-style-utilities-page.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 真机/兼容风险：iOS/Android 真机仍需确认 ScrollView 横向惯性、系统低动效与不同基础库上的吸顶时序。

## PUI-FB-0373 · 70 个真实根组件需要共享外观资格矩阵与 effectsEnabled 总开关

- 原始记录：`feedback/records/pui-fb-0373-appearance-eligibility-matrix-and-effects-gate.json`
- 范围：`global` / `config-provider`、`input`、`search`、`combobox`、`popup`、`sheet`、`action-sheet`、`tabbar`、`navbar`、`image`、`collapsible`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：深浅色、边框、阴影、毛玻璃、大圆角、等距和渐变在全部小程序组件页与 H5 中应遵守同一组件语义；非 Surface 组件不能因为全局阴影开关获得外投影，关闭总效果也不能破坏布局或已保存偏好。
- 实际问题：scripts/appearance-contract-matrix.js 与专项测试现覆盖 70 个根组件：完整搬迁新增的布局、表单、数据展示和高级组件按 Surface 角色获得资格；Input 同时保留独立字段 Surface 和 Search/Combobox 嵌入规则。
- 决策：以 70 根矩阵作为小程序与 H5 的资格真源；独立 Surface 才能消费外投影、毛玻璃和语义圆角，条目/叶子与布局根保持无外投影；effectsEnabled=false 只暂停 shadow/frost/largeRadius，有效边框、主题、等距、布局和持久化单项保持独立。
- 理由：把视觉开关的影响范围从“所有节点”收敛到真实组件语义，避免 Cell/Icon/Image/Collapsible 等展示叶子被错误装饰，也避免关闭效果时发生布局漂移。

AI 必须遵守：

- 新增真实 pui-* 根组件前先更新外观资格矩阵和对应专项测试。
- 非独立 Surface 的 Cell、Icon、Image、Collapsible、Badge、Tag、Progress、Skeleton 不得因全局 shadow 获得外投影。
- effectsEnabled=false 不得清除 shadow/frost/radius 的持久化值，也不得改变 theme/border/equalSpacing。
- Navbar、Tabbar、Popup、Sheet、ActionSheet 的阴影方向必须由真实附着边决定。

验证与遗留风险：

- 验证：`node scripts/test-appearance-contract-matrix.js`
- 验证：`node scripts/test-preview-appearance-menu.js`
- 验证：`node scripts/test-preview-fruit-flavor-preset.js`
- 验证：`node scripts/test-non-elevated-shadow-semantics.js`
- 真机/兼容风险：微信开发者工具热重载后的 390px、深浅色和多页面 Store 订阅尚需本轮最终回归。
- 真机/兼容风险：iOS/Android 真机的 WXSS 样式隔离、系统字体和合成阴影仍需合法 AppID 实机确认。

## PUI-FB-0374 · H5 Popup 边缘方向切换不能复用旧的离场 Host

- 原始记录：`feedback/records/pui-fb-0374-h5-popup-retained-host-direction-switch.json`
- 范围：`component` / `popup`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：Popup 从左、右、上、下或居中打开时，入口方向、动画方向和阴影方向必须对应当前选择，不能被上一个仍在离场的浮层节点污染。
- 实际问题：已在 popup-open 分支同时检查 previousPlacement、existingHost 和 hostPlacementChanged；只要存在旧 Host 就清理 timer、mounted、active、phase，再通过统一可见性函数重建当前方向。
- 决策：方向切换以 DOM retained host 的 class 为最终防护；目标方向与旧 Host 不一致时先清理旧节点状态，再进入统一 Popup visibility 生命周期。
- 理由：保留离场动画的同时消除旧方向节点复用，避免通过强制立即卸载牺牲真实动画或依赖点击时序。

AI 必须遵守：

- 浮层 placement 变化必须先写回真实 Props，再检查 retained host 是否与目标方向一致。
- 旧 Host 与目标方向不一致时清理其 timer、mounted、active 和 phase，再复用统一 visibility 函数。
- 连续入口点击必须用真实浏览器验证方向 class 和阴影方向，不能只做静态字符串检查。

验证与遗留风险：

- 验证：`node scripts/test-popup.js`
- 验证：`node scripts/test-appearance-contract-matrix.js`
- 真机/兼容风险：微信开发者工具和 iOS/Android 真机仍需确认连续快速点击、触摸事件与 WXSS 动画合成。

## PUI-FB-0375 · 快速样式两列目录必须真实应用并按类型互斥

- 原始记录：`feedback/records/pui-fb-0375-style-utilities-two-column-applied-selection.json`
- 范围：`component` / `style-utilities`、`cell`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：快速样式目录使用两列，不显示查看示例或箭头；被应用到预览的样式需要可见选中态，同类样式单选互斥且可取消。
- 实际问题：旧目录占用单列和尾部动作空间，只有背景渐变有预览回写，其它选择没有统一状态合同。
- 决策：目录改为两列 selectable pui-cell；移除 description、value 和 arrow。以 group:previewKind 键存储选择，同键替换、同项再次点击删除；选择结果由生成语义分发到单一当前效果中的适格目标，恢复只清空当前分类，禁止把 utility 挂到页面或预览基础设施根。
- 理由：两列降低长目录浏览成本；按类型而非整组互斥，允许用户叠加不同维度的样式，同时避免同一 CSS 属性的冲突。

AI 必须遵守：

- 两列样式目录使用 selectable PUI Cell，不要恢复查看示例、箭头或无消费的说明文本。
- 任何 selected 状态都必须对应适格语义目标已应用的 class，禁止把所有 class 拼到预览或页面基础设施根。
- 同类 utility 的互斥键必须包含 group 与 previewKind，避免跨分类意外替换或不同 CSS 语义互相覆盖。
- 恢复按钮只清空 activeGroup 对应的 group:previewKind 键，不得清空其他分类组合。

验证与遗留风险：

- 验证：`npm run styles:catalog:generate`
- 验证：`node scripts/test-miniprogram-style-utilities-page.js`
- 验证：`node scripts/test-style-utilities.js`
- 验证：`npm run site:build`
- 验证：`npm run example:install`
- 验证：`微信开发者工具 cli build-npm`
- 真机/兼容风险：iOS/Android 真机仍需确认长类名在两列中的自然换行与点击命中区。

## PUI-FB-0376 · 无文案 Tabbar 的图标与短横需要同一视觉中心

- 原始记录：`feedback/records/pui-fb-0376-icon-only-tabbar-visual-center.json`
- 范围：`component` / `tabbar`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-25
- 用户目标：无文案 Tabbar 不应让图标偏上、选中短横偏下；分隔线应更短、更浅。
- 实际问题：纯图标图文轨道被删除后没有重新收拢视觉重心，短横仍过低，分隔线像贯穿的 Cell 边框。
- 决策：纯图标项图标下移 8rpx/4px，活动短横上收到距底 40rpx/20px；split 改为 56rpx/28px 短线并使用专属弱色 Token。
- 理由：图标与短横作为一个导航识别组需要共同落在视觉中心；短分隔只提示边界，不应抢占图标的视觉层级。

AI 必须遵守：

- 显式 label:'' 时在 Tabbar 组件内调整视觉锚点，不能由页面 margin 补位。
- Tabbar split 使用专属弱色 Token，不能复用一般 Divider 的强对比色。
- 小程序和 H5 镜像必须同步图标偏移、短横锚点与分隔线长度。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run site:build`
- 验证：`npm run example:install`
- 验证：`微信开发者工具 cli build-npm`
- 真机/兼容风险：iOS/Android 真机仍需复核系统字体、safe area 与 WebView 合成后的最终视觉位置。

## PUI-FB-0377 · Tabs content 区域高度过大导致 390px 窄屏下空间浪费

- 原始记录：`feedback/records/pui-fb-0377-tabs-content-height-excessive.json`
- 范围：`component` / `tabs`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：Tabs 组件不应占用过多垂直空间，特别是在 390px 窄屏下。
- 实际问题：content 区域 min-height 和 padding-top 过大，在 390px 窄屏下显得臃肿。
- 决策：min-height 从 96rpx 减少到 48rpx，padding-top 从 space-normal (20rpx) 减少到 space-sm (12rpx)；H5 同步调整。
- 理由：在 390px 窄屏下，每节省 14px 的垂直空间都能显著提升内容可见性；48rpx 的最小高度仍能保证空状态下的基本可读性。

AI 必须遵守：

- Tabs content 区域使用 space-sm 作为顶部间距，避免占用过多垂直空间。
- min-height 保持 48rpx 以确保空状态下的基本可读性。
- 小程序和 H5 镜像必须同步高度和间距调整。

验证与遗留风险：

- 验证：`node scripts/test-tabs.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 真机/兼容风险：真机仍需复核 tabs 高度在不同内容量下的表现

## PUI-FB-0378 · 快速样式页漏注册 BackTop 导致不可见且不可点击

- 原始记录：`feedback/records/pui-fb-0378-styles-page-backtop-integration.json`
- 范围：`component` / `back-top`、`scroll-area`、`style-utilities`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：快速样式页面的 BackTop 默认隐藏，滑过阈值后出现，并且点击后真实回到唯一 ScrollArea 顶部。
- 实际问题：页面具备 scrollTop、scrollIntoView、scroll/to-top 处理和 BackTop WXML，但 usingComponents 漏掉 pui-back-top，微信运行时未创建组件，所以既不显示也不能点击。
- 决策：注册真实 pui-back-top，使用 ScrollArea 已公开的 scroll 事件驱动 scrollTop 与 200px 显隐阈值；点击 to-top 后由页面通过 scrollIntoView 定位同一 ScrollArea 的 styles-top-anchor。BackTop fixed 层级增加 1000 fallback，确保普通页面内可见可点且仍低于业务浮层。
- 理由：BackTop 组件已具备阈值显隐和 PUI FAB 交互；消费者只需提供真实局部滚动坐标并处理局部回顶，无需复制普通 Button 或新增滚动上下文。

AI 必须遵守：

- WXML 新增 PUI 自定义组件时，页面 JSON 和专项必需组件清单必须同步注册。
- BackTop 初始隐藏，只有真实 scrollTop 达到 visibilityHeight 后显示。
- 局部 ScrollArea 回顶由消费者响应 to-top 并写入 scrollIntoView；不能仅调用 wx.pageScrollTo。
- 不得用常驻普通 Button 替代 BackTop 的 FAB、阈值显隐和可访问性合同。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-style-utilities-page.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：iOS/Android 真机仍需复核 scroll 事件频率、fixed FAB 与底部 Tabbar 的距离、触摸命中和安全区；本轮只完成微信模拟器交互验收。

## PUI-FB-0379 · BackTop 覆盖 Tabbar、默认视觉错误且提前伪造回顶完成

- 原始记录：`feedback/records/pui-fb-0379-backtop-tabbar-clearance-and-real-scroll.json`
- 范围：`component` / `back-top`、`fab`、`tabbar`、`scroll-area`、`style-utilities`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：快速样式页的 BackTop 在滚动后显示为避开 Tabbar 的 primary 圆形向上箭头按钮，并在点击后真实回到当前 ScrollArea 顶部。
- 实际问题：BackTop 默认 icon 为空、普通 round 主题映射 default FAB；fixed bottom 只考虑 safe-area；快速样式页 onBackToTop 在 scroll-into-view 生效前直接写 scrollTop=0，造成视觉假回顶。
- 决策：BackTop 普通 round/half-round 默认映射 primary FAB，icon 默认 arrow-up；无文案 FAB 使用真实 iconOnly。新增跨端 --pui-tabbar-content-height 和 BackTop 内部 --pui-back-top-bottom-offset 消费点，快速样式 App Shell 组合导航高度、安全区与 space-normal。ScrollArea 组件级新增受控 scrollTop 与真实 scroll Event；页面把同一 scrollTop 传给 ScrollArea 与 BackTop，点击时写 0，由唯一原生 scroll-view 的 scroll-top 真正回顶。
- 理由：回顶入口必须一眼可识别且不能遮挡一级导航；BackTop 保持八项公共 API 不变，由语义 Token 处理 App Shell 几何。局部滚动控制属于 ScrollArea，受控 scrollTop 比 type=list 下重复行为不稳定的 Slot 锚点更可验证，也不需要第二滚动容器或实例方法。

AI 必须遵守：

- 无文案 BackTop 必须使用 primary circle arrow-up 与真实 iconOnly 结构。
- 存在 Tabbar 时用 --pui-back-top-bottom-offset 组合 --pui-tabbar-content-height、安全区和标准间距，不恢复 public bottom Prop。
- 局部 ScrollArea 与 BackTop 必须消费同一个受控 scrollTop；只改 BackTop 显隐不是回顶。
- enhanced type=list 下不得依赖重复 Slot 顶部锚点；用 ScrollArea scrollTop + scroll 建立数值受控闭环。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run example:install`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：开发者工具模拟器与 H5 不能替代 iOS/Android 真机；仍需确认实际触摸命中、安全区、惯性与 scroll-top 回写。

## PUI-FB-0380 · 小程序缺少导航分区九个真实独立页与统一路由入口

- 原始记录：`feedback/records/pui-fb-0380-miniprogram-navigation-section-pages.json`
- 范围：`global` / `miniprogram-home`、`navbar`、`navigation-menu`、`tabs`、`breadcrumb`、`tabbar`、`steps`、`back-top`、`indexes`、`sidebar`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：把导航区的九个组件搬到真实微信小程序，并让用户能从首页导航分区、搜索和独立路由进入可操作的组件示例。
- 实际问题：迁移前小程序没有导航分区的九个独立页面和对应专项契约，用户只能从其他端或包级示例了解这些组件。
- 决策：新增导航首页分区、九条显式路由和九个薄页面适配层；共享页面行为使用 createComponentPage，组件差异由各页自己的 usingComponents、Slot 和事件处理承接。
- 理由：共享页面壳可以稳定 Navbar、外观、唯一滚动区和 390px 布局，独立路由则保留九个组件真实不同的公开 API 和交互边界。

AI 必须遵守：

- 九个导航组件保留独立路由，页面行为可以共享但组件 API、Slot 和事件边界不能被查询参数路由压平。
- Tabs 必须同时覆盖四项等分和超过四项半露；BackTop 必须等待真实 ScrollArea scroll 回写，不得提前伪造回顶完成。
- 导航页面错误态的 retry 只表示父级恢复请求；不得把显示、隐藏或状态切换叙述成业务成功。
- 真机和 390px 视觉未实测时保持 pending-user 与 deviceRisks，不以 check、build 或 npm 产物代替设备验收。

验证与遗留风险：

- 验证：`npm run feedback:generate && npm run feedback:check：通过（364 records）`
- 验证：`npm run site:build：通过（530 classes、69 component directories）`
- 验证：`npm run check：通过`
- 验证：`npm run example:install：通过`
- 验证：`npm run pack:check：通过`
- 验证：`微信 CLI islogin：true；build-npm：通过（cost=1383ms、warnings=[]）`
- 真机/兼容风险：本轮在记录生成时尚未完成微信 390px 模拟器与 iOS/Android 真机逐页验收；Tabs 横向惯性、BackTop 局部回顶、fixed Tabbar 安全区、深浅色、读屏和低动效仍需真实设备确认。

## PUI-FB-0381 · 导航组件页面共享 WXSS 通配选择器阻断全小程序渲染

- 原始记录：`feedback/records/pui-fb-0381-navigation-page-wxss-universal-selector.json`
- 范围：`component` / `sidebar`、`miniprogram`、`navigation-pages`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：快速样式 BackTop 验收时，当前合法 AppID 小程序必须能继续使用热重载并真实渲染，而不能被无关共享页面 WXSS 编译错误阻断。
- 实际问题：通配子选择器使所有引用该共享样式的页面在当前微信编译器中失败，BackTop 真实验收也被空白页阻断。
- 决策：为 Sidebar 宿主补充明确语义 class，并将通配/标签规则替换成两个 class-only 规则；不改变 Sidebar 公共 API、H5 镜像或页面结构。
- 理由：类选择器既满足微信编译器，也让共享页面只控制自己明确拥有的两个布局节点，不穿透未知后代。

AI 必须遵守：

- 小程序共享和组件 WXSS 禁止 `*`、`> *`、标签、ID 与属性选择器。
- 需要控制组件宿主布局时给宿主显式语义 class，不得依赖 pui-* 标签选择器。
- 编译阻断修复后必须在当前已打开的开发者工具中确认真实页面恢复，不能只跑静态扫描。

验证与遗留风险：

- 验证：`node scripts/test-wxss-universal-selector-compatibility.js`
- 验证：`微信开发者工具普通编译`
- 真机/兼容风险：iOS/Android 真机仍需确认 Sidebar 两栏在 rpx、样式隔离和触摸滚动下保持原几何。

## PUI-FB-0382 · ScrollArea 受控回顶缺少真实平滑滚动

- 原始记录：`feedback/records/pui-fb-0382-scroll-area-controlled-position-smooth-motion.json`
- 范围：`component` / `scroll-area`、`back-top`、`style-utilities`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：点击快速样式页的 BackTop 后，唯一 ScrollArea 应真实、连续地向顶部滚动，而不是瞬间跳到 0。
- 实际问题：小程序原生 scroll-view 未声明 scroll-with-animation；H5 镜像直接写 area.scrollTop，两个端都瞬移。
- 决策：ScrollArea 内部固定开启微信 scroll-with-animation；H5 统一通过 scrollTo({ behavior: prefers-reduced-motion ? 'auto' : 'smooth' }) 镜像。现有 scrollTop、scrollIntoView 与 scroll 事件合同不变，禁止新增 scrollWithAnimation、duration、easing、reduceMotion Props 或滚动 Methods。
- 理由：平滑定位是 ScrollArea 受控位置的默认体验，不应要求每个 BackTop 消费者重复配置平台细节；保留最小公共 API同时让小程序/H5 都执行真实滚动，而不是只做按钮动画或状态回显。

AI 必须遵守：

- ScrollArea 唯一原生 scroll-view 固定 scroll-with-animation=true；不要让页面重复传平台动画属性。
- H5 受控 scrollTop 与 scrollIntoView 必须调用真实 scrollTo smooth，系统低动效使用 auto。
- 不得为平滑回顶恢复 scrollWithAnimation、duration、easing、reduceMotion Props 或滚动 Methods。
- 验收必须采样非零中间 scrollTop 和最终 0；只看到按钮隐藏或最终位置不算动画通过。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：开发者工具模拟器和 H5 不能替代 iOS/Android 真机；仍需确认长距离平台动画、快速重复点击、用户中途反向手势与不同基础库表现。

## PUI-FB-0383 · DropdownMenu 重复点击当前筛选项调用了不存在的关闭方法

- 原始记录：`feedback/records/pui-fb-0383-dropdown-menu-trigger-close-runtime.json`
- 范围：`component` / `dropdown-menu`、`preview-site`、`miniprogram-dist`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：下拉筛选打开后再次点击同一触发项应自然关闭，不能导致小程序页面抛出运行时异常。
- 实际问题：源码误调用不存在的 requestClose，导致 this.requestClose is not a function；H5 镜像已正确调用 closeDropdownPreviewSlim，双端行为失配。
- 决策：将同项分支改为调用 publishClose，并为小程序和 H5 对齐语义加入回归断言。
- 理由：复用既有关闭状态机可保留 close 事件、leaving 动效和定时卸载，不扩大公共 API。

AI 必须遵守：

- 同一已展开 trigger 的第二次激活必须走 publishClose 并发布 close，不新增公开方法。
- 状态机分支修改必须至少覆盖首次打开、同项关闭、切换项、遮罩关闭和单选关闭。
- H5 已有等价交互时，小程序状态机必须逐分支对齐，而不是只验证首次打开。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具普通编译`
- 真机/兼容风险：尚未在 iOS/Android 真机复验连续点击；需确认动画中的快速连点、Slot 投影和不同基础库事件顺序。

## PUI-FB-0384 · 快速样式页的 Tabs、预览与目录应有明确高度预算

- 原始记录：`feedback/records/pui-fb-0384-style-utilities-absolute-workspace-layout.json`
- 范围：`component` / `style-utilities`、`tabs`、`scroll-area`、`back-top`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：快速样式页不再使用 sticky；Tabs 与预览应固定在工作区，目录只在下方唯一滚动区滚动；预览不得过高，目录最后一行必须完整可见。
- 实际问题：页面曾使用 sticky=true 和 preview sticky，预览的 top 仅假定 Tabs Header 高度，无法以真实预览边界约束目录可滚动区域；改为 absolute 后，224rpx 预览上限在 390px 下仍显著压缩目录首屏。
- 决策：保留既有 Tabs、ScrollArea 与 BackTop API，但把页面中间区改为 absolute workspace：Tabs 根填充工作区，页面关闭 Tabs content swipe；Header 下方固定 120rpx 单一当前效果预览，目录以 8rpx 关联间距紧随其后，且至少保留 520rpx 可视高度。页面不再查询 preview DOM，utility 只作用于内部语义目标；唯一目录 ScrollArea 继续为末行预留渐变遮罩与底部 inset。
- 理由：页面级几何责任留在页面，既去除 sticky 的平台时序依赖，也优先为真实目录保留可连续滚动的首屏高度，同时保持真正的横向 Tabs、预览选择和受控平滑回顶。

AI 必须遵守：

- 快速样式页的 Tabs 必须 sticky=false；Tabs、预览和目录分别使用清晰的 absolute 层。
- 含有唯一纵向 ScrollArea 的快速样式 Tabs 必须关闭 content swipe；分类切换只通过 Header 点击，不能和目录纵向手势竞争。
- 只保留一个目录 ScrollArea 和一个 scrollTop 真相源，BackTop 不得切到页面滚动或嵌套容器。
- 目录 top/height 必须由稳定的工作区预算计算，消费 120rpx 单一当前效果、8rpx 关联间距和 520rpx 最小目录视口；不得查询会被 utility 改写的 preview DOM。
- 预览窗口必须裁切预算外内容；带渐变遮罩的目录 Slot 必须在内容末尾预留遮罩高度和底部 inset，不能让最后一行停在遮罩下。
- 小程序与 H5 必须共享生成的 previewKind/previewTarget/previewSafety 语义，不得各自手写类别判断。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具普通编译`
- 真机/兼容风险：iOS/Android 真机仍需验证横向 Tabs 惯性、唯一 ScrollArea 惯性、BackTop 动画和安全区。

## PUI-FB-0385 · 小程序反馈区缺少 Dialog 的受控独立页面与可搜索路由

- 原始记录：`feedback/records/pui-fb-0385-miniprogram-dialog-feedback-page.json`
- 范围：`global` / `miniprogram-home`、`dialog`、`feedback-pages`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：补齐反馈区的 Dialog 页面，使用户可从首页和搜索进入真实的受控对话框示例。
- 实际问题：反馈目录、app.json、搜索候选和专项页面测试均未登记 Dialog，导致已发布组件在小程序中不可进入。
- 决策：新增 Dialog 独立路由和页面；基础 Dialog 由 confirm/cancel/close/overlay-click 交给父级回写，长内容 Dialog 显式关闭遮罩关闭，Loading 与 Empty 仅作为 content Slot 内容。
- 理由：这与 Dialog 的公开合同一致，同时让小程序端具备可操作、可返回且不伪造业务结果的示例。

AI 必须遵守：

- Dialog 的 confirm、cancel、close 和 overlay-click 都是父级意图，页面必须决定是否以及何时写回 visible。
- closeOnOverlayClick=false 时点击遮罩不得提前收起；Header 关闭仍走同一父级 close 回写。
- Loading、Empty、Cell 等只能作为 content Slot 的业务组合，不能新增 Dialog 请求状态或成功提示。
- 反馈区新增页面时，同步更新 app.json、首页目录、Search、专项测试、页面文档和 Ledger。

验证与遗留风险：

- 验证：`node scripts/test-dialog.js：通过`
- 验证：`node scripts/test-miniprogram-home.js：通过`
- 验证：`node scripts/test-miniprogram-component-pages.js：通过`
- 验证：`node scripts/test-miniprogram-feedback-pages.js：通过`
- 真机/兼容风险：尚未在微信 390px 模拟器、iOS 或 Android 真机验证 Dialog 的内容滚动、遮罩命中、系统焦点、低动效和外观组合；当前通过的 Node 合同测试不能替代这些验收。

## PUI-FB-0386 · 小程序缺少布局区五个组件的独立页面与滚动边界

- 原始记录：`feedback/records/pui-fb-0386-miniprogram-layout-pages.json`
- 范围：`global` / `miniprogram-home`、`aspect-ratio`、`direction`、`grid`、`scroll-area`、`sticky`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：将布局组件迁移为可从小程序首页和搜索进入的真实独立页面，并保持各自滚动语义。
- 实际问题：布局区此前无小程序页面，用户无法在微信端操作比例、方向、网格、滚动区或吸顶行为。
- 决策：新增五条显式路由与布局首页分区；标准页面复用 component-page，ScrollArea 自身承担唯一滚动，Sticky 将宿主真实 scroll 转给组件定位逻辑。
- 理由：独立页保留组件公开 Props 和真实滚动边界，避免静态演示或错误的双滚动。

AI 必须遵守：

- ScrollArea 页面不能再包裹第二个同向滚动宿主。
- Sticky 必须接收真实滚动事实，不能仅写 CSS fixed。
- Grid retry 只恢复入口状态，不描述业务成功。
- 新增页面同步首页目录、Search、路由、专项测试和文档。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-layout-pages.js：通过`
- 验证：`node scripts/test-miniprogram-home.js：通过`
- 验证：`node scripts/test-miniprogram-component-pages.js：通过`
- 真机/兼容风险：390px 微信模拟器和 iOS/Android 真机尚未验证比例裁切、RTL、Grid 列宽、Sticky 定位和惯性滚动。

## PUI-FB-0387 · 小程序缺少高级区的滚动所有者页面与真实本地状态边界

- 原始记录：`feedback/records/pui-fb-0387-miniprogram-advanced-pages.json`
- 范围：`global` / `miniprogram-home`、`pull-refresh`、`virtual-list`、`watermark`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：把高级稳定组件迁入微信小程序，并避免伪刷新、伪虚拟化和水印遮挡操作。
- 实际问题：高级区此前没有微信页面，无法验证真实手势、长数据和水印配置。
- 决策：新增三条显式路由与高级分区；PullRefresh、VirtualList 使用滚动所有者模型，Watermark 使用标准详情页壳。
- 理由：避免嵌套滚动并保留组件实际事件和公开状态边界。

AI 必须遵守：

- PullRefresh 结束必须由父级显式回写 value=false。
- VirtualList 必须使用足够长的真实数据和受控选择，不用短数组伪造窗口化。
- Watermark 只负责展示层，不阻断业务操作或读屏。
- 滚动所有者页禁止再嵌套同方向 ScrollArea。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-advanced-pages.js：通过`
- 验证：`node scripts/test-miniprogram-home.js：通过`
- 验证：`node scripts/test-miniprogram-component-pages.js：通过`
- 真机/兼容风险：尚未在390px模拟器、iOS或Android真机验证下拉手势、虚拟窗口时序、惯性、安全区、水印渲染和系统低动效。

## PUI-FB-0389 · 小程序缺少表单区十九个组件页及受控输入边界

- 原始记录：`feedback/records/pui-fb-0389-miniprogram-form-pages.json`
- 范围：`global` / `miniprogram-home`、`form`、`field`、`label`、`input`、`input-otp`、`textarea`、`search`、`checkbox`、`radio`、`switch`、`select`、`picker`、`combobox`、`slider`、`stepper`、`rate`、`calendar`、`date-time-picker`、`upload`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：将全部稳定表单组件迁入微信小程序，保留受控值、确认取消、校验与文件选择的真实边界。
- 实际问题：此前没有独立路由、受控示例或专项页面验证，用户无法在微信端探索表单组件。
- 决策：新增十九条路由与表单分区；输入、选择、日期、数值和上传事件统一由页面 data 接收并回写。
- 理由：小程序示例可以真实操作且不扩张组件 API 或伪造业务网络状态。

AI 必须遵守：

- 页面层不得手写原生 input、textarea、select 或 button。
- Form submit 只代表校验事件，业务提交需要调用方另行实现。
- Picker 与 DateTimePicker 分清草稿、确认、取消和 visible 回写。
- Upload 只处理微信文件选择与 files，未经业务实现不得声明上传成功。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-form-pages.js：通过`
- 验证：`node scripts/test-miniprogram-home.js：通过`
- 验证：`npm run check：通过`
- 验证：`微信开发者工具 build-npm：通过，warnings=[]`
- 真机/兼容风险：其余十八页尚未完成 390px 逐页实测；iOS/Android 真机仍未验证键盘、遮罩、组合框、滑块评分触摸、文件权限、取消和预览。

## PUI-FB-0391 · 新组件目录需要区分通用复用、Lucide 直引与 PoemUI 专属几何

- 原始记录：`feedback/records/pui-fb-0391-component-icon-selective-expansion.json`
- 范围：`component` / `icon`、`miniprogram-home`、`badge`、`cell`、`swipe-cell`、`scroll-area`、`dialog`、`tag`、`swiper`、`direction`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：为新增组件目录选择清楚、克制且可复现的图标，只在现有通用图形无法表达时绘制 PoemUI 专属几何。
- 实际问题：修改前既有无效名称，也有 bell/list-bullet/layers/arrow-left-right 等近似复用；如果按全部组件同名重画，又会重复制造复杂、难维护且没有额外辨识价值的图形。
- 决策：Avatar、Card、Image、List、Collapse、Collapsible、Bubble、CountDown、Table 复用 user、panel-top、image、list-bullet、rows、chevron-down、message、clock、table；Tag、Swiper、Direction 新增锁定版 Lucide tag、gallery-horizontal、arrow-left-right；Badge、Cell、SwipeCell、ScrollArea、Dialog 进入 components 分类并使用 2、2、2、2、3 个图元的 PoemUI 专属几何。
- 理由：先复用可减少目录学习成本和维护面，Lucide 直引保持上游成熟构形，专属几何只解决真实辨识冲突；三种路径仍由同一 sourceAliases、manifest、Icon Font 与 H5 数据链路生成。

AI 必须遵守：

- 首页任何 icon 名称都必须存在于当前生成的 icon-font-catalog，禁止依靠首字符回退伪装成功。
- 组件名不自动产生同名专属图标；先检查现有通用图形是否已准确表达用户心智。
- Lucide 已有成熟通用构形时使用锁定 sourceAlias，不为品牌感重复造形。
- 专属组件图标最多 3 个可见图元，并在 56、32、20px 的真实 SVG 渲染中检查。
- Cell 与 SwipeCell 必须共享单行外壳，并通过右 Chevron、动作分隔和左滑 Chevron 区分。
- 新增图标必须经唯一生成脚本同步 SVG、manifest、Icon Font、H5 数据、发布镜像、示例安装和微信 npm 产物。
- 没有用户最终视觉确认时 acceptance 保持 pending-user；开发者工具或真机失败必须保留真实错误。

验证与遗留风险：

- 验证：`npm run icons:generate：通过，生成 217 个图标、17 类和 22404 byte WOFF2`
- 验证：`node scripts/test-icon.js：通过`
- 验证：`node scripts/test-miniprogram-home.js：通过，首页所有 icon 名称均存在于真实 icon-font-catalog`
- 验证：`node scripts/check-package.js：通过，锁定 217 个图标和 components 14 项`
- 验证：`node scripts/test-miniprogram-data-pages.js、test-miniprogram-layout-pages.js、test-miniprogram-feedback-pages.js、test-miniprogram-form-pages.js：通过`
- 验证：`npm run feedback:generate && npm run feedback:check：通过，Ledger 共 375 条记录`
- 验证：`npm run miniprogram:build：通过，生成 69 个组件目录`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project miniprogram：通过，AppID wx23aa017375535746，cost 1380ms，warnings []`
- 验证：`npm run site:build：通过`
- 验证：`npm run example:install：通过，audited 2 packages，0 vulnerabilities`
- 验证：`npm run pack:check：通过，333.9 kB package、1.6 MB unpacked、533 files，sha1 13ce193cd7cfc9def4c629e2ad562c227fa833da`
- 验证：`npm run check：未通过；与本图标改动无关的并行 appearance-contract-matrix 新页面根清单未同步，测试拒绝把不完整基线视为成功`
- 验证：`node scripts/test-miniprogram-component-pages.js：未通过；并行新增 ConfigProvider 页面已进入真实路由，但该专项测试的统一 Navbar 预期名单尚未同步`
- 真机/兼容风险：iOS 与 Android 真机仍需确认 20rpx 下 Cell/SwipeCell、Dialog/Overlay 的最终辨识、字体抗锯齿、触摸、读屏和惯性滚动。
- 真机/兼容风险：当前项目不启用 Skyline；Skyline 不属于本记录验收范围。

## PUI-FB-0392 · 小程序缺少数据展示区十四个组件的独立可操作页面

- 原始记录：`feedback/records/pui-fb-0392-miniprogram-data-pages.json`
- 范围：`global` / `miniprogram-home`、`avatar`、`badge`、`card`、`image`、`tag`、`cell`、`list`、`collapse`、`collapsible`、`bubble`、`swipe-cell`、`count-down`、`swiper`、`table`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：将稳定数据展示组件迁入微信小程序，保留各自公开状态与用户可操作的真实边界。
- 实际问题：此前仅有包级组件与 H5 镜像，小程序目录和搜索入口缺失。
- 决策：新增十四条显式路由、首页数据展示分区和专项页面测试，并让页面只处理组件事件与本地状态。
- 理由：保留组件各自的公开合同，避免用静态展示或不存在的业务结果替代交互。

AI 必须遵守：

- Cell 仅导航到工程存在的真实路由。
- SwipeCell、Swiper、Table 和 Collapse 的状态必须由页面回写。
- 倒计时归零、Bubble 操作和图片事件不得宣称业务成功。
- 新增页面同步首页、Search、专项测试、文档和 Ledger。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-data-pages.js：通过`
- 验证：`node scripts/test-miniprogram-home.js：通过`
- 验证：`npm run check：通过`
- 验证：`微信开发者工具 build-npm：通过，warnings=[]`
- 真机/兼容风险：其余十三页尚未完成 390px 逐页实测；iOS/Android 真机仍未验证图片长按、SwipeCell 手势、倒计时、Swiper 惯性、Table 固定列和读屏。

## PUI-FB-0393 · 小程序缺少 ConfigProvider 页面与可检索的开始规范入口

- 原始记录：`feedback/records/pui-fb-0393-miniprogram-guides-and-config-provider.json`
- 范围：`global` / `miniprogram-home`、`config-provider`、`getting-started`、`theme-tokens`、`color`、`spacing`、`typography`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：补齐最后一个稳定组件和五个小程序规范页，并让用户能从首页搜索区分规范与组件。
- 实际问题：用户此前只能在源码和 H5 中发现这些能力，小程序没有对应入口。
- 决策：新增 ConfigProvider 与五个 guides 路由，将开始与规范置于首页首个分区，并在 Search 描述中显式添加规范标识。
- 理由：保持安装组件与阅读型规范之间的语义边界，同时让用户能从小程序中发现全部内容。

AI 必须遵守：

- 规范页使用 pages/guides 路由，不得伪装成 components 安装入口。
- Search 结果必须有可见规范标识，并允许导航至 guides 路由。
- ConfigProvider 根使用唯一 global visualConfig；局部覆盖不得复制全局 Store。
- 规范页不得再写一套色值、字体或间距变量。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-guide-pages.js：通过`
- 验证：`node scripts/test-miniprogram-home.js：通过`
- 验证：`npm run check：通过`
- 验证：`微信开发者工具 build-npm：通过，warnings=[]`
- 真机/兼容风险：ConfigProvider 与其余四个规范页尚未完成 390px 逐页实测；iOS/Android 真机仍未验证局部 Provider 边界、长文本换行、深浅色对比和快速样式跳转。

## PUI-FB-0394 · ScrollArea 受控滚动回写不应抢占原生惯性

- 原始记录：`feedback/records/pui-fb-0394-scroll-area-controlled-scroll-feedback-performance.json`
- 范围：`component` / `scroll-area`、`back-top`、`style-utilities`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：快速样式目录必须能够自然纵向滚动，不能出现拖不动或明显发涩的感觉。
- 实际问题：每个 scrollTop 回写曾执行完整配置同步；拆分后仍可能每帧重设原生定位，目录滚动缺乏惯性并显得发涩。
- 决策：保留 ScrollArea 全部公开 Props、Events、Slots 与 H5 行为；小程序端将 scrollTop 同步拆出完整配置路径，并把等于最后一次用户事件位置的父级值作为回声忽略；不同目标才下发原生定位，回到初始 target 时内部重放当前位置后再请求目标。
- 理由：页面继续使用同一 scrollTop 真相源驱动 BackTop 与平滑回顶，同时避免用户手势期间被受控定位和无关配置同步反复抢占。

AI 必须遵守：

- 用户滚动回写等于本次 scroll 事件位置时不得重新下发原生 scroll-top；不得重新设置根样式、重新测量或重建观察器。
- 不得为性能问题扩张 ScrollArea 的公开 API；继续保留唯一 scrollTop 真相源与内部 scroll-with-animation。
- H5 镜像必须保留原生 passive scroll 驱动的渐变边缘；与当前真实位置相同的受控值也必须跳过，不能通过 scrollTo 重启用户惯性。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 真机/兼容风险：iOS/Android 真机仍需验证长目录惯性、BackTop 中间帧和增强 scroll-view 与渐变观察器的配合。

## PUI-FB-0395 · 普通 Tabbar 根泄露浮层面板材质

- 原始记录：`feedback/records/pui-fb-0395-tabbar-normal-transparent-layout-root.json`
- 范围：`component` / `tabbar`、`preview-site`、`miniprogram-home`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：普通全宽 Tabbar 应是透明的屏幕附着导航，不应在设备底部呈现一张独立面板。
- 实际问题：普通 Tabbar 根像一张浮起的白色面板，视觉上与设备底部和内容区断裂。
- 决策：shape=normal 固定为透明、无外投影、无毛玻璃的屏幕附着布局；glass、shadow、frosted filter 仅由 shape=round 根消费。
- 理由：全宽贴边导航不是脱离内容流的独立容器；把 Surface 材质限定给 round 可以保留浮动变体，同时消除底部面板断裂。

AI 必须遵守：

- 不要用页面 CSS 修 normal Tabbar 的根材质；在组件根和 H5 镜像同步限定 Surface 资格。
- normal 不得消费背景、外投影或毛玻璃；bordered=true 只恢复中性顶部分割线。
- round 才消费 glass、floating shadow、frosted filter 和语义圆角，条目本身始终透明。

验证与遗留风险：

- 验证：`node scripts/test-tabbar.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 cli build-npm`
- 真机/兼容风险：iOS/Android 真机仍需复核安全区、深浅色和外观开关组合下的最终合成视觉。

## PUI-FB-0396 · 快速样式预览必须按 utility 语义命中真实目标

- 原始记录：`feedback/records/pui-fb-0396-style-utilities-semantic-preview-targets.json`
- 范围：`component` / `style-utilities`、`preview-site`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：快速样式页应以紧凑、准确的单一当前效果预览不同类型的 utility；尺寸类不能留下大片空白，定位、隐藏、比例和 viewport 类不能破坏页面或逃出预览，并且用户可以恢复当前分类默认状态。
- 实际问题：旧预览只有按分类写死的容器，未表达 utility 应该作用于布局根、子项、媒体、测量块、外层、Surface、集合或文本；一个共享 class 串无法安全覆盖 530 种语义。首次 H5 同步只输出 data 属性并把代表 class 挂到统一 mini 根，且没有加载完整 utility CSS，导致 pui-w-full 无效、pui-text-headline 污染整个预览。
- 决策：建立由 utilities.wxss 目录生成链驱动的语义预览 Schema；小程序使用固定 120rpx、透明、无面板的单一当前效果，只在指定目标挂载 class，并以 PUI 圆形恢复按钮清空当前分类。viewport/fixed/hidden/safe-area 等使用有界裁切或 trace，不改变页面布局。H5 加载同一份生成数据和 scoped px CSS，使用固定 64px 单一当前效果，示例点击与分类级恢复都是真实交互。
- 理由：目标级路由能让 530 个类共享一个稳定渲染器，同时保留真实 CSS 应用；单一当前效果减少重复内容和横向压缩，分类级恢复提供明确回退，又为目录释放首屏空间。

AI 必须遵守：

- 新增 utility 时必须由同一生成 Schema 给出 previewKind、previewTarget、previewSafety、previewTheme 与 scaffold，并同时生成小程序目录、H5 数据与 scoped CSS。
- 尺寸、定位、display、overflow、主题和可见性类不得作用于预览基础设施根。
- 预览固定使用单一当前效果；选中 utility 只挂到适格目标，恢复只清空当前分类；H5 必须读取计算样式证明点击与恢复都真实生效。
- viewport、fixed、hidden、safe-area 与状态类必须有界裁切或留下可读 trace，不能逃出预览或制造空白。
- 构建通过不等于视觉完成；必须分别记录 H5 390px、微信模拟器和 iOS/Android 真机验证状态。

验证与遗留风险：

- 验证：`npm run styles:catalog:generate`
- 验证：`node scripts/test-miniprogram-style-utilities-page.js`
- 验证：`node scripts/test-style-utilities.js`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 cli build-npm`
- 真机/兼容风险：微信模拟器仍需验证单一当前效果、分类级恢复、五类切换、120rpx/8rpx 几何、长目录滚动、BackTop 显隐/点击/平滑回顶、极端类有界裁切与页面无横向溢出。
- 真机/兼容风险：iOS/Android 真机仍需验证 object-fit、fixed containment、screen size 裁切、safe-area、长目录惯性和 BackTop 动画。

## PUI-FB-0397 · Picker Popup 未透传 showHeader 导致确认与取消入口消失

- 原始记录：`feedback/records/pui-fb-0397-picker-popup-header-forwarding.json`
- 范围：`component` / `picker`、`date-time-picker`、`popup`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：Picker 与 DateTimePicker 在小程序中必须保留草稿、确认、取消和受控显隐的完整可操作边界。
- 实际问题：Picker 将 Header Slot 放入 Popup，但 Popup 默认 showHeader=false，导致 Header Slot 不渲染，草稿确认合同在真实小程序页面中不可达。
- 决策：在 Picker 挂载的 PUI Popup 上显式绑定 show-header={{showHeader}}，不改变 Picker、DateTimePicker 的公开 API 或事件模型。
- 理由：Header 的存在是既有 Picker/DateTimePicker 草稿确认合同的一部分；透传同名属性能以最小改动恢复两个组件共享的真实入口。

AI 必须遵守：

- Picker usePopup=true 且 showHeader=true 时，pui-popup 必须接收 show-header={{showHeader}}。
- 遮罩关闭只表示 visible-change 与 close，不能代替 Picker 的 cancel 或 confirm。
- 修改 Picker Popup 结构后必须同时用 DateTimePicker 组合页和 390px 小程序验证确认、取消、遮罩三条路径。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run site:build`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 390x844 自动化`
- 真机/兼容风险：iOS/Android 真机仍需验证 picker-view 惯性滚动、Popup 遮罩命中与安全区。

## PUI-FB-0398 · 快速样式只保留当前效果并提供分类级恢复

- 原始记录：`feedback/records/pui-fb-0398-style-utilities-single-current-preview-reset.json`
- 范围：`component` / `style-utilities`、`button`、`preview-site`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：快速样式不需要基准与结果比较，只显示最新选择后的当前效果，同时提供一个可以恢复默认状态的按钮。
- 实际问题：旧结构固定渲染 baseline/result 双栏和箭头；只能再次点击已选项逐个取消，没有明确的一键恢复。
- 决策：小程序固定 120rpx、H5 固定 64px，只保留单一当前效果；恢复入口复用 default / text / small / circle / icon-only 的 PUI Refresh Button，位于独立右侧网格轨道并保持低存在感。恢复范围固定为 activeGroup，不改变其他分类。
- 理由：唯一结果与用户的“当前选择”心智一致；独立恢复按钮可一次回到分类默认，同时保留跨分类组合上下文。

AI 必须遵守：

- 不得恢复 baseline/result、比较箭头或两份语义样例。
- 选中 utility 必须直接更新唯一当前效果，并继续使用生成的 target/scaffold 路由。
- 恢复按钮必须复用 default / text / small / circle / icon-only 的 PUI Refresh Button，未选择时禁用，不能改成 primary 实底、常驻文案或绝对覆盖语义目标。
- 恢复只删除 activeGroup 的 group:previewKind 选择，其他分类必须保留。
- 小程序与 H5 必须同步交互和固定高度，并分别做 390px 真实验收。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-style-utilities-page.js`
- 验证：`node scripts/test-style-utilities.js`
- 真机/兼容风险：微信 390px 模拟器已确认视觉、37x37px 几何、禁用态与 click 事件恢复；automator 的物理 tap 无法穿透自定义组件宿主，iOS/Android 真机仍需确认真实手指命中、按压反馈与跨分类状态保留。

## PUI-FB-0399 · Style Utilities H5 兼容说明不得引用已删除目录常量

- 原始记录：`feedback/records/pui-fb-0399-style-utilities-h5-compat-data-source.json`
- 范围：`component` / `style-utilities`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：快速样式 H5 必须在真实交互和重绘时保持可用，兼容说明也应读取与预览相同的生成数据。
- 实际问题：makeCompatNotes 仍读取已删除的 STYLE_UTILITY_ITEMS，全页虽然能继续显示，但每次重绘都会产生未捕获错误。
- 决策：兼容说明统一读取 styleUtilitiesData.items.length，并在 Style Utilities 专项中禁止 STYLE_UTILITY_ITEMS 标识。
- 理由：入口已经对生成数据做 530 项完整性校验，复用同一对象可避免第二份目录常量和运行时漂移。

AI 必须遵守：

- Style Utilities H5 数据唯一入口是 styleUtilitiesData，也就是 window.POEMUI_STYLE_UTILITIES 的已校验绑定。
- 兼容说明、分类预览、选择验证和数量展示必须读取同一生成对象。
- 运行验收必须检查重绘后的新增 error 日志，不能只看页面仍可显示。

验证与遗留风险：

- 验证：`node scripts/test-style-utilities.js`
- 真机/兼容风险：无已知遗留项。

## PUI-FB-0400 · 首页浮层分区排序与首显自动展开时机不符合阅读动线

- 原始记录：`feedback/records/pui-fb-0400-home-overlay-section-entry-timing.json`
- 范围：`component` / `miniprogram-home`、`collapsible`、`popup`、`popover`、`sheet`、`action-sheet`、`dropdown-menu`、`overlay`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：首页应把浮层紧接在基础组件之后，并在用户进入首页两秒后自动展开该分区，同时不覆盖用户的手动选择。
- 实际问题：浮层分区排序靠后，且页面数据初值立即展开浮层，没有用户可见的首显等待和取消边界。
- 决策：将 overlay 移至 basic 后，初始 activeCatalogSection 设为空，并在 onShow 后以 2000ms 定时器受控写回 overlay；用户分区操作、onHide 和 onUnload 都取消未完成的定时器。
- 理由：页面进入先让用户建立首页层级，再显示浮层入口；由页面维护唯一展开状态和取消条件，继续复用 Collapsible 的公开 open/change 合同。

AI 必须遵守：

- 首页目录排序只修改 CATALOG_SECTIONS，Search 必须继续由同一数据源扁平化生成。
- 延迟展开前 activeCatalogSection 保持空值；不得以默认展开或 CSS 动画伪造等待。
- 任何手动分区 change、onHide 和 onUnload 都必须清理首页自动展开定时器，不能覆盖用户的当前选择。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run site:build`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机仍需确认首页首显计时、后台前台切换、Collapsible 动效与读屏提示。

## PUI-FB-0401 · 首页品牌版头缺少左文右图的留白视觉中心

- 原始记录：`feedback/records/pui-fb-0401-miniprogram-home-brand-title-plate.json`
- 范围：`component` / `miniprogram-home`、`image`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：首页采用白底、左文右图的紧凑留白排版气质；Logo 必须无底色并真实兼容深色模式，描述、目录统计和首个 Collapsible 的纵向节奏必须紧凑，但不得修改 Navbar 或下方 Collapsible 内容区的结构、顺序、样式与交互。
- 实际问题：旧版头只有单一品牌图与描述句，缺少能组织组件库入口的视觉节奏和明确的排版层级；首版透明 Logo 还遗留了 Image 默认灰底与边框，紧凑版初稿的下方留白仍偏大。
- 决策：仅重构 home-brand 为紧凑的白底左文右图版头：Poem UI、月下成行、原生小程序组件库，按需组合；右侧以 144rpx pui-image 呈现从既有 PNG 抠出的两张完整透明底 Logo，并以 Image 既有 custom-style 清除其默认灰底和边框，按 Provider 实际主题切换黑/白资产；版头内距改为上 28rpx、下 16rpx、左右 56rpx，目录统计移除额外 24rpx 顶距；组件和规范数量从目录真相源计算；其余首页结构与行为不动。
- 理由：留白、左对齐和右侧小型意象把品牌与目录起点连成一个安静的入口；压缩只发生在版头，既让描述、统计与首个目录形成连续阅读路径，也为实际组件目录保留更多首屏空间，不依赖小程序滤镜支持。

AI 必须遵守：

- 选定留白左文右图版头时只调整 home-brand WXML/WXSS 与其目录统计派生数据，不改变 Navbar、ScrollArea、Collapsible、Cell、目录排序或自动展开状态。
- 月下成行标记必须优先从既有 Logo 精确抠出透明底黑/白版本，经 pui-image 呈现；调用点必须用 Image 既有 custom-style 清除默认灰底和边框，不得用页面 WXSS 跨组件抢占，也不得用通用图标近似或为版头新增渐变、阴影、玻璃和另一套图标资产。
- 版头在 light、dark 和 auto 的实际深色状态下都必须切换对应透明底资产；禁止依赖 CSS filter，也不能替换为另一套近似图形。
- 需要为目录腾出空间时只能压缩 home-brand 的 Token 化 padding、gap、标记尺寸和辅助文字；描述与统计不得再叠加额外 margin，不得挤压 Navbar、ScrollArea、Collapsible 或目录行。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机仍需确认图标字体加载、深色文本对比、rpx 字体基线、Collapsible 展开后的滚动起点与读屏。

## PUI-FB-0402 · 快速样式分类切换后应自动回到目录顶部

- 原始记录：`feedback/records/pui-fb-0402-style-utilities-tab-change-scroll-reset.json`
- 范围：`component` / `style-utilities`、`tabs`、`scroll-area`、`back-top`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-26
- 用户目标：用户切换快速样式分类 Tab 后，应立即从新分类的第一项开始浏览，不需要手动寻找顶部或再点击 BackTop。
- 实际问题：onGroupChange 只更新 activeGroup、visibleUtilities 和预览模型，没有重置页面持有的 scrollTop，新分类沿用旧目录滚动位置。
- 决策：由快速样式页面在 Tabs change 的同一次状态更新中把唯一 ScrollArea 的受控 scrollTop 写为 0，复用 ScrollArea 固定的原生平滑定位。
- 理由：滚动位置属于页面消费者持有的目录状态；现有 ScrollArea 已提供受控位置、回声保护和同值目标重放，Tabs 只需继续发布分类变化。

AI 必须遵守：

- Tabs 只发布分类值，不得持有消费者 ScrollArea 或页面滚动 API。
- 同一 ScrollArea 替换长目录数据时，父级应在同一次受控状态更新中把 scrollTop 写为 0。
- 必须复用既有 ScrollArea 平滑定位、回声保护与唯一滚动上下文，不得重挂载组件。
- H5 没有同构单目录分类切换时应记录差异，不得用静态脚本伪造同步。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-style-utilities-page.js`
- 验证：`node scripts/test-scroll-area.js`
- 验证：`node scripts/test-tabs.js`
- 真机/兼容风险：微信开发者工具 390px 已验证 Tabs change 绑定、受控位置归零、内部原生目标和新分类首项；自动化使用宿主 change 事件而非物理触点，iOS/Android 真机的手指点击、惯性与动画中间帧仍未验证。

## PUI-FB-0403 · 快速样式需要可直接使用的精选色彩 utility

- 原始记录：`feedback/records/pui-fb-0403-style-utilities-curated-color-palette.json`
- 范围：`component` / `style-utilities`、`color`、`config-provider`、`preview-site`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：快速样式需要像 text-blue、bg-red 一样可直接写入 class 的颜色能力，但色板应由 PoemUI 统一挑选和治理，而不是无边界复制完整色阶。
- 实际问题：用户只能借用 info/danger 等业务语义类，或在页面写私有固定色，容易把装饰意图误写成状态并造成跨主题漂移。
- 决策：选取 red、orange、amber、emerald、teal、blue、violet、pink 八个色相；每个只公开 pui-text-{hue}、pui-bg-{hue}、pui-bg-{hue}-soft、pui-border-{hue} 四类，共 32 个 utility。
- 理由：八色足以覆盖常见强调表达，同时避免 50–950 全量色阶膨胀。基础 Token 服务文字与边框，solid 服务饱和色面，soft 服务可承载普通内容的弱背景；深浅色分别调校。H5 从生成的 theme 数据注入同名变量，不维护第二份色板。

AI 必须遵守：

- 装饰与轻量强调使用 pui-text-{hue}、pui-bg-{hue}、pui-bg-{hue}-soft、pui-border-{hue}，不要在页面写固定色。
- 错误、警告、成功和信息状态必须继续使用 danger/warning/success/info，不得用相近 hue 冒充业务语义。
- pui-bg-{hue} 不隐式设置文字颜色；承载普通正文时优先使用 pui-bg-{hue}-soft 并显式组合中性文字。
- 新增颜色必须先进入 theme.wxss 的 light/dark Token，再由生成链同步小程序与 H5；禁止逐端硬编码。
- 小程序目录与 H5 分类浏览器都必须逐项暴露全部 32 个精选色彩 utility，不能只保留少数代表色预览。
- 预览目标不得用页面私有声明覆盖正在演示的属性；状态里出现 utility class 不等于视觉已实装，必须读取运行态计算样式。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`wechat-cli build-npm`
- 真机/兼容风险：H5 390px 的 light/dark 计算样式、边框 scaffold、Color accent 色板和零横向溢出已验证；微信开发者工具与 iOS/Android 真机的色彩管理、字体抗锯齿和可读性仍需合法 AppID 最终复核。
- 真机/兼容风险：实色背景不自动设置文字颜色，消费者必须显式选择可读前景；普通正文优先使用 soft 背景。

## PUI-FB-0404 · Navbar 与 NavigationMenu 小程序示例混淆组件主体和页面控制

- 原始记录：`feedback/records/pui-fb-0404-miniprogram-navbar-navigation-menu-example-hierarchy.json`
- 范围：`component` / `navbar`、`navigation-menu`、`switch`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Navbar 页面应像首页一样在左侧胶囊镜像轨展示双操作，右侧必须留给微信原生胶囊，显隐必须作用于 Navbar 本体；NavigationMenu 页面应由组件自身入口展开，并区分水平浮层、垂直工作区和按需错误恢复。
- 实际问题：修复前示例重复组件和入口、混合互斥几何；首次收敛又错误占用 Navbar 右 Slot。NavigationMenu 的诊断按钮与永久错误浮层同时抢占视觉和交互中心。
- 决策：Navbar 合并为一个与首页同源的左侧双操作受控示例，leftBtn/rightBtn 都位于胶囊镜像轨，capsule=true 保护右侧原生胶囊，PUI Switch 直接回写 visible；NavigationMenu 删除外部打开按钮，水平浮层、垂直双栏和错误恢复分别受控；两个浮层实例互斥且活动实例独占高层级，Retry 由页面移除 error。
- 理由：用户应先看到并操作组件本体，页面控制只解释受控边界；互斥布局拆开后，每个示例都能对应一条真实调用路径。

AI 必须遵守：

- 微信 custom navigation 的 Navbar 双操作必须复用 leftBtn/rightBtn，并在 capsule=true 时都渲染于左侧胶囊镜像轨；不得向 right Slot 放业务内容。
- Navbar visible 控制必须直接绑定 Navbar，本体隐藏后由稳定舞台承接布局，不用主按钮替代。
- NavigationMenu 不得在默认 Trigger 外再增加打开按钮。
- NavigationMenu 水平浮层与垂直双栏必须拆分实例；垂直模式关闭 Overlay 且不配置无意义的 placement。
- 同页多个 NavigationMenu 浮层必须互斥，并让活动实例高于常驻工作区，禁止后序实例穿透 Overlay。
- Error NavigationMenu 不得永久 visible=true，retry 必须由页面真实回写 error Props。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-navigation-pages.js`
- 验证：`node scripts/test-navbar.js`
- 验证：`node scripts/test-navigation-menu.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`wechatide simulator_open_page / simulator_screenshot / automation_evaluate`
- 真机/兼容风险：WechatIDE automator 对自定义组件宿主执行 tap 不穿透内部原生 Button；当前已验证事件绑定与 Props 回写，但水平 Overlay 的真实手指点击、关闭和截图仍需真机复核。
- 真机/兼容风险：微信真机的 Navbar 双操作触摸、系统胶囊几何、全屏 Overlay、低动效和读屏仍需 iOS 与 Android 复核。

## PUI-FB-0405 · 六个小程序分区的独立组件页缺少代表场景与统一内容质量门禁

- 原始记录：`feedback/records/pui-fb-0405-miniprogram-component-page-content-quality.json`
- 范围：`global` / `miniprogram`、`layout`、`navigation`、`form`、`data-display`、`feedback`、`advanced`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：除开始与规范、基础组件、浮层外，逐个验证并修缮每个小程序独立组件页，让示例的代表性、可读性、重要性和完整性更突出，并由 Agent 自主完成一轮验收。
- 实际问题：修复前页面质量依赖人工记忆，旧测试还在锁定自动恢复、未公开实例方法和 H5 同名分区标题，无法阻止空分区、技术文案或弱示例重新出现。
- 决策：完整重写六个分区的 59 个独立页内容，统一采用任务标题、代表场景和关键状态；修正 Group 语义、retry 恢复边界、BackTop 公开 scroll-top、Cell selected 等错误；新增逐页验收矩阵与全量质量测试并纳入 npm run check。
- 理由：逐页内容矩阵让示例选择可审查，自动门禁负责阻止结构和命名退化；组件专项测试继续锁定真实事件与状态边界，两层证据共同避免静态假成功。

AI 必须遵守：

- 独立页标题必须使用用户任务语言，不得以“基础用法”、Props、Slot、value 或事件日志作为视觉中心。
- 每页必须真实挂载自身 PUI 组件并覆盖至少一个重要状态或关键边界；禁止空分区和静态假结果。
- retry 只提出请求，不能自动清除 error；恢复必须由页面在真实数据准备好后明确回写。
- 滚动所有者不得再嵌套同方向 ScrollArea；BackTop 只使用公开 scroll-top，不调用未公开实例方法。
- Checkbox/Radio 应使用 Group 呈现多选与单选语义；Cell 使用 selectable/selected，不回退旧 checked 字段。
- 逐页质量测试、分区专项测试、微信开发者工具运行态和逐页验收文档必须同批更新。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-component-page-quality.js`
- 验证：`node scripts/test-miniprogram-component-pages.js`
- 验证：`node scripts/test-miniprogram-layout-pages.js`
- 验证：`node scripts/test-miniprogram-navigation-pages.js`
- 验证：`node scripts/test-miniprogram-form-pages.js`
- 验证：`node scripts/test-miniprogram-data-pages.js`
- 验证：`node scripts/test-miniprogram-feedback-pages.js`
- 验证：`node scripts/test-miniprogram-advanced-pages.js`
- 验证：`node scripts/test-appearance-contract-matrix.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：尚未在 iOS/Android 真机验证键盘顶起、Picker/Calendar 遮罩、SwipeCell/Swiper/下拉刷新手势、虚拟列表惯性和安全区。
- 真机/兼容风险：读屏、系统字体放大、系统低动效和弱网/权限拒绝仍需合法 AppID 真机复核。

## PUI-FB-0406 · 小程序双操作行应等分两列且滚动示例需要足够验证空间

- 原始记录：`feedback/records/pui-fb-0406-miniprogram-two-column-actions-and-scroll-controls.json`
- 范围：`global` / `miniprogram`、`component-page`、`button`、`scroll-area`、`sticky`、`virtual-list`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：组件独立页中的两个操作按钮应稳定等分为两列并保留标准间距；Sticky 需要更长正文验证吸顶；ScrollArea 需要直接控制遮罩显隐与尺寸。
- 实际问题：双按钮曾使用通用可换行 Flex；Sticky 只有五条正文；ScrollArea 遮罩为固定 WXML 值。
- 决策：新增 component-page__row--actions 两列 Grid，并让双操作 PUI Button 使用 block 与 --pui-content-gap；VirtualList、Navigation 与 Steps 双操作工具栏同步两列和 16rpx 间距。Sticky 固定十条正文。ScrollArea 在自身唯一 Slot 中组合遮罩 Switch 与尺寸增减按钮，尺寸严格限制为 sm/md/lg 并在边界禁用按钮。
- 理由：独立操作语义避免误伤 Switch、Label、Icon 和文案行；直接绑定真实公开 Props 能让演示结果与组件合同一致，且不增加第二滚动区或新 API。

AI 必须遵守：

- 恰好两个并列 PUI Button 使用共享两列 Grid，并以 block 填满各自轨道。
- 两列 Button 之间必须显式消费 --pui-content-gap，默认 16rpx，禁止贴合。
- 不得把通用 component-page__row 改成 Grid；Switch、Label、Icon 与文案组合继续使用 Flex。
- Sticky 小程序独立页至少保留十条连续正文，确保能够观察吸顶进入、保持和恢复。
- ScrollArea 遮罩控制必须直接绑定 gradientOverlay 与 gradientOverlaySize，尺寸只允许 sm、md、lg，不得创建第二滚动区或扩张 API。

验证与遗留风险：

- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机的 Sticky 惯性滚动、fixed 边界与 ScrollArea 遮罩过渡仍需合法 AppID 复核。
- 真机/兼容风险：读屏、系统字体放大与低动效仍需真机复核。

## PUI-FB-0407 · ScrollArea 缺少统一尾部安全区并导致 NavigationMenu 末项展开受阻

- 原始记录：`feedback/records/pui-fb-0407-scroll-area-bottom-safety-and-navigation-menu-clearance.json`
- 范围：`component` / `scroll-area`、`navigation-menu`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：所有 ScrollArea 默认保留 10vh 尾部空间；NavigationMenu 右侧卡片阴影完整显示，最底部分区展开后仍可滚动查看全部内容。
- 实际问题：ScrollArea 没有统一内容尾距；NavigationMenu 常驻 Panel 和底部绝对定位浮层都可能被后续内容或滚动边界裁切。
- 决策：新增唯一纵向 API contentPaddingBottom，默认 10vh；内容轨负责 padding，根和 viewport 保持透明。NavigationMenu 常驻双栏使用现有空间 Token 保护阴影，底部浮层显隐真实回写父级安全区。
- 理由：一个受约束的纵向 API 能覆盖所有末项可达性，同时允许绝对定位浮层按真实高度临时提高空间，不引入四向布局系统。

AI 必须遵守：

- ScrollArea contentPaddingBottom 默认 10vh，只允许非负裸数、rpx、px、vh 或 0。
- 绝对定位浮层打开时必须提高父级内容安全区，关闭后恢复默认。
- Panel 阴影必须用现有 Token 预留外扩空间，不能用页面私有 margin 补丁。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机的 vh 计算、惯性滚动、底部安全区与浮层触摸仍需复核。

## PUI-FB-0408 · Steps 连线与 Stepper 三段控件未共享稳定组合坐标

- 原始记录：`feedback/records/pui-fb-0408-steps-stepper-composition-geometry.json`
- 范围：`component` / `steps`、`stepper`、`button`、`input`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：修正 Steppper/Steps 的连接位置，让步骤连线穿过指示器中心，数值步进器保持 minus、value、plus 紧密连接。
- 实际问题：Steps 的 connector 与 indicator 使用不同坐标上下文；Stepper 的 Button/Input 宿主与内部根没有共享稳定轨道。
- 决策：Steps 的 PUI Button 只承担全项交互，视觉 body、indicator 和 connector 由组件自身布局；Stepper 继续复用 PUI Button/Input，但在小程序 WebView 使用实测后的固定坐标轨和有界裁切。
- 理由：交互语义继续复用 PUI，视觉几何回到父组件唯一坐标系，避免跨组件 Slot/宿主参与定位。

AI 必须遵守：

- Steps 的 PUI Button 只承担整项交互，不把 connector 放进 Button 默认 Slot。
- Steps 默认 indicator 的中心为 22rpx，dot 中心为 26rpx。
- Stepper 必须在微信运行态验证 minus/value/plus 顺序，不能只看 WXML 源顺序。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机的自定义组件宿主投影、输入法、触摸和字体缩放仍需复核。

## PUI-FB-0409 · Indexes 独立页内容过短且活动字母错位低对比

- 原始记录：`feedback/records/pui-fb-0409-indexes-long-list-and-active-letter.json`
- 范围：`component` / `indexes`、`button`、`cell`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Indexes 列表需要足够长以验证滚动，右侧索引当前项必须清楚、居中且不与列表内容冲突。
- 实际问题：分组过短，活动字母部分落出选中底色，列表右侧内容会进入索引轨；末端程序定位还会被滚动回调覆盖为最后一组。
- 决策：独立页扩展为十四分组；小程序 Button 使用 content prop、内联紧凑几何和 Token 化光学校正；索引栏限制在组件 body，条目内容按左右位置预留索引轨并隐藏重复原生滚动条；程序定位保护覆盖 500ms 动画与 120ms 收敛余量。
- 理由：保留 PUI Button 的真实交互与可访问名称，同时让紧凑索引视觉和内容区各自拥有明确几何。

AI 必须遵守：

- Indexes 独立页至少十二个分组。
- 活动字母必须在 42rpx×36rpx 轨内黑底白字居中。
- 索引轨不得覆盖 Badge、箭头或内容操作区。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机的 touchmove 字母命中、惯性滚动、sticky 与读屏顺序仍需复核。

## PUI-FB-0410 · 首页返回后丢失上次展开分区和阅读位置

- 原始记录：`feedback/records/pui-fb-0410-home-catalog-section-restore.json`
- 范围：`global` / `miniprogram`、`collapsible`、`scroll-area`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：从组件页返回首页时继续看到上次打开的目录分区，并将该分区适当地带回可见区域。
- 实际问题：旧实现只在本次页面实例内保存 activeCatalogSection，并可能再次被两秒自动展开浮层覆盖。
- 决策：只持久化最后一次打开的合法目录 key；onLoad/onShow 恢复并标记为用户选择，从而阻止两秒浮层默认行为覆盖；ScrollArea 使用稳定 id 执行一次适度定位。
- 理由：保留用户最后阅读上下文，同时继续使用现有受控 Collapsible 和唯一滚动容器，不引入页面级滚动或第二套目录状态。

AI 必须遵守：

- 只持久化当前目录清单中存在的分区 key。
- 恢复的用户分区优先于首屏自动展开策略。
- 滚动定位必须复用首页唯一 ScrollArea 和稳定分区 id。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`npm run miniprogram:build`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机返回栈、低端设备 setStorageSync 和滚动锚点时序仍需复核。

## PUI-FB-0411 · Checkbox 文案、未选轮廓和组选中态不可读

- 原始记录：`feedback/records/pui-fb-0411-checkbox-visible-label-and-group-state.json`
- 范围：`component` / `checkbox`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Checkbox 独立页必须清楚看到选项文案、未选边界、当前选中项与组选中变化。
- 实际问题：命名 Slot 的 fallback 子节点在微信运行态不显示；控件轮廓错误使用可透明化的 Surface border Token；生成项只依赖 relation 子组件回写。
- 决策：Prop 文案与命名 Slot 分离渲染；CheckboxGroup 统一从 value 装饰 generated options；复选框轮廓使用独立 control outline Token，并同步 H5。
- 理由：三处分别修正内容投影、受控状态和交互可见性，不改变 Checkbox 的公开选中语义。

AI 必须遵守：

- label/content Prop 与同名 Slot 必须分别显式渲染。
- options 生成的组选项必须由组 value 计算 checked。
- Checkbox 未选轮廓使用 control outline，而不是可透明化的 Surface border。

验证与遗留风险：

- 验证：`node scripts/test-checkbox.js`
- 验证：`npm run miniprogram:build`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机的 2rpx 轮廓、触摸命中和读屏分组语义仍需复核。

## PUI-FB-0412 · Radio 文案、未选轮廓和组选中态不可读

- 原始记录：`feedback/records/pui-fb-0412-radio-visible-label-and-group-state.json`
- 范围：`component` / `radio`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Radio 独立页必须清楚看到每个选项、当前唯一选中项和未选圆环。
- 实际问题：命名 Slot fallback 在微信端为空；轮廓随 Surface 边框开关被透明化；generated options 没有显式 checked 映射。
- 决策：显式渲染 Prop 文案；RadioGroup 统一装饰 generated options；Radio 未选圆环使用 control outline Token，并同步 H5。
- 理由：确保所有调用方式共享同一单选真相源，同时不把交互边界误当作可关闭的 Surface 装饰。

AI 必须遵守：

- Radio Prop 文案不能依赖命名 Slot fallback。
- RadioGroup generated options 必须严格按 value 计算唯一 checked。
- 未选圆环不得随 Surface bordered 开关消失。

验证与遗留风险：

- 验证：`node scripts/test-radio.js`
- 验证：`npm run miniprogram:build`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机的圆环抗锯齿、互斥点击和读屏 radiogroup 语义仍需复核。

## PUI-FB-0413 · InputOTP 空输入格在无边框外观下不可辨

- 原始记录：`feedback/records/pui-fb-0413-input-otp-empty-cell-visibility.json`
- 范围：`component` / `input-otp`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：InputOTP 尚未输入时也能一眼识别验证码位数、每格范围和当前焦点。
- 实际问题：空格与父级同为 container 背景，bordered=false 后缺少任何可读结构。
- 决策：空格默认消费 bg-muted，焦点格消费 bg-container 和既有焦点边界；不新增私有描边或页面补丁。
- 理由：背景层级在 bordered=false 时仍可读，同时保持 Less is more 和现有焦点、错误 Token。

AI 必须遵守：

- InputOTP 空格使用 muted Surface 保持位数可见。
- 焦点格恢复 container Surface 并保留焦点状态边界。
- 不得通过页面私有样式或外阴影补救。

验证与遗留风险：

- 验证：`node scripts/test-input-otp.js`
- 验证：`npm run miniprogram:build`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机键盘唤起、自动填充、光标时序和深色对比度仍需复核。

## PUI-FB-0414 · Select 可见选项层使用系统 Picker 而非 PUI 组件

- 原始记录：`feedback/records/pui-fb-0414-select-pui-popup-composition.json`
- 范围：`component` / `select`、`button`、`popup`、`icon`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Select 的触发器和弹出选项都应使用 PoemUI 自身组件，具备一致的深浅色、外观、选中态和关闭体验。
- 实际问题：旧实现由原生 picker 控制可见菜单，仅 change 事件可用，无法表达 PUI Popup 的遮罩、标题、关闭和选项状态。
- 决策：Select 保留简单单选 API，但可见层统一为 Button Trigger + bottom Popup + Button options + Icon；删除生成器中的废弃 picker 模板，并继续把 Select 列入原生实现保护清单。
- 理由：获得跨端一致的外观、遮罩、关闭和选中反馈，同时不把多列滚轮 Picker 的复杂 API强加给 Select。

AI 必须遵守：

- Select WXML 不得包含微信原生 picker。
- 选项值使用严格相等，0 与 false 不得被字符串化合并。
- 选择事件顺序固定为 input 后 change，遮罩或关闭触发 cancel。

验证与遗留风险：

- 验证：`node scripts/test-select.js`
- 验证：`npm run site:build`
- 验证：`npm run miniprogram:build`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机的遮罩触摸、焦点、返回键、长选项滚动和读屏 listbox 语义仍需复核。

## PUI-FB-0415 · SideBar 恢复入口示例语义不清

- 原始记录：`feedback/records/pui-fb-0415-sidebar-readonly-example-language.json`
- 范围：`component` / `sidebar`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：SideBar 页面应展示真实且容易理解的核心状态，不出现无法解释的恢复入口。
- 实际问题：页面把业务请求失败和 retry 伪装成 SideBar 自身能力，增加无来源的恢复按钮。
- 决策：删除错误和恢复入口；保留基础受控切换，再用 readonly=true 展示固定分类的真实能力与限制。
- 理由：示例只呈现 SideBar 自身存在的交互状态，不伪造业务请求、失败或 retry。

AI 必须遵守：

- SideBar 示例只展示组件真实公开状态。
- readonly 示例明确说明可查看但不可切换。
- 没有真实 retry 动作时不显示恢复按钮。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-navigation-pages.js`
- 验证：`npm run miniprogram:build`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机的只读触摸反馈和读屏 disabled/readonly 表述仍需复核。

## PUI-FB-0416 · Picker 与 DateTimePicker 弹层丢失标题和确认操作区

- 原始记录：`feedback/records/pui-fb-0416-picker-popup-three-region-regression.json`
- 范围：`component` / `picker`、`date-time-picker`、`popup`、`button`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Picker 和 DateTimePicker 的底部弹层使用 Popup 的统一风格，并完整显示标题、滚轮、取消和确认。
- 实际问题：无效 header Slot 使 Toolbar 未进入 Popup 渲染树，用户无法在可见界面确认或取消草稿。
- 决策：Popup 模式使用 PUI Popup title Header、默认 Content 与两列 Footer，动效统一为 500ms/1ms；内联模式继续保留 Picker 自身单行 Toolbar。
- 理由：直接复用 Popup 的 Surface、间距、滚动与操作区合同，同时保留 Picker 草稿确认和 DateTimePicker 单一组合边界。

AI 必须遵守：

- Picker Popup 标题必须通过 Popup title 传入。
- 滚轮只进入 Popup Content，取消和确认固定进入两列 Footer。
- DateTimePicker 只继承 Picker 修复，不复制第二份 Popup。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机的 picker-view 透明 mask、惯性、Footer 触摸、遮罩关闭、底部安全区和读屏顺序仍需复核。

## PUI-FB-0417 · Stepper 独立页主控件未在内容区水平居中

- 原始记录：`feedback/records/pui-fb-0417-stepper-page-horizontal-center.json`
- 范围：`component` / `stepper`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Stepper 的独立演示在页面内容区水平居中，同时保持 minus/value/plus 的组件内部几何。
- 实际问题：共享 component-page__inline 只设置 align-items，没有设置水平居中。
- 决策：新增透明页面修饰类 component-page__inline--center，并只用于 Stepper 三组演示。
- 理由：把页面排版职责留在页面父级，不修改 Stepper 公共组件的默认布局或消费者调用方式。

AI 必须遵守：

- 页面居中使用透明 Flex 修饰类。
- 不得改动 Stepper 公共根的默认 margin 或 width。
- 居中后仍需确认三段固定轨的微信运行态顺序。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机字体缩放与不同窗口宽度下的视觉中心仍需复核。

## PUI-FB-0418 · Calendar 月份导航右箭头被自定义组件宿主推离可见区域

- 原始记录：`feedback/records/pui-fb-0418-calendar-navigation-visible-tracks.json`
- 范围：`component` / `calendar`、`button`、`icon`、`miniprogram`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Calendar 月份栏必须同时清楚显示上一月和下一月箭头。
- 实际问题：Flex 与自定义组件宿主的宽度投影把右侧 Button 推离可见轨，只留下左箭头。
- 决策：月份栏改为固定三列 Grid；左右 Button 明确使用 icon-only，H5 使用同义 36px 轨。
- 理由：让两个操作和月份标题共享唯一稳定坐标，同时继续复用 PUI Button/Icon 的尺寸、主题与可访问语义。

AI 必须遵守：

- 纯图标月份操作必须声明 icon-only。
- 小程序月份栏固定为 72rpx/1fr/72rpx，H5 固定为 36px/1fr/36px。
- 不得依赖 Flex 自动分配自定义 Button 宿主宽度。

验证与遗留风险：

- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run example:install`
- 验证：`npm run pack:check`
- 验证：`微信开发者工具 build-npm`
- 真机/兼容风险：iOS/Android 真机的箭头触摸命中、禁用色、读屏和字体缩放仍需复核。

## PUI-FB-0419 · Upload 单文件失败态重复且 Retry 在窄屏退化为无文案大按钮

- 原始记录：`feedback/records/pui-fb-0419-upload-file-error-recovery-layout.json`
- 范围：`component` / `upload`、`button`、`icon`、`progress`、`miniprogram`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：文件处理状态中的失败项应清楚、克制，并让右侧重试操作位置和语义都正确。
- 实际问题：失败信息重复、视觉权重过重，Retry 位置和文案错误，而且示例未闭合事件回执。
- 决策：失败文件使用中性 Surface、内嵌危险色原因区和右侧“重试”中性 Button；失败时不渲染 Tag 与 Progress。独立页只回执 retry 请求，不自动把文件改为 uploading 或 success。
- 理由：失败信息只需一个视觉中心；重试属于恢复而非危险动作。保留父级 error 能守住 Upload 不执行远端上传的公共合同。

AI 必须遵守：

- error 文件不得同时显示失败 Tag、错误 Progress、整卡危险边界和错误原因。
- 失败时 Progress 退出，Retry 使用可见文字 Button 并保持在右侧 action 轨。
- Retry 是中性恢复操作，不使用 danger 主题。
- retry 只发布请求，组件和示例都不得自动把 error 改成 uploading 或 success。

验证与遗留风险：

- 验证：`npm run site:build：通过`
- 验证：`npm run check：通过`
- 验证：`npm run example:install：通过`
- 验证：`npm run pack:check：通过`
- 验证：`微信开发者工具 build-npm：通过，warnings=[]`
- 真机/兼容风险：iOS/Android 真机的按钮命中、长文件名、系统字体放大、读屏和真实上传业务回写仍需复核。

## PUI-FB-0420 · 第三 Tab 需要真实 Codex 快速开始页与 Skill 留白

- 原始记录：`feedback/records/pui-fb-0420-miniprogram-codex-tab-quick-start-skill.json`
- 范围：`component` / `miniprogram`、`tabbar`、`icon`、`card`、`button`、`scroll-area`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：把第三个纯图标 Tabbar 目的地改为 Codex，并提供可复制的快速开始代码区；另设“让你的 AI 懂得用它”分区，Skill 尚未完成时保持明确留白。
- 实际问题：旧 explore 页面没有内容，orbit 也不能表达 Codex；未建立代码阅读和复制路径，Skill 无明确但克制的占位边界。
- 决策：删除 pages/explore/index，新增 pages/codex/index；第三 Tab value/icon/ariaLabel 当前为 codex/code/Codex。新增页面级共享 code-snippet，以 PUI Card、Button、Icon 组合代码 Surface，原生 scroll-view 只承担横向阅读，复制使用真实微信剪贴板。Skill 区仍显示 PUI Card + codex Icon + SKILL。
- 理由：目的地语义、图标资源和页面路由保持一致；复制结果由平台回调证明。Skill 未交付前明确留白，避免空白页面和假下载两种极端。小程序应用页面不伪造成 H5 组件页，但 codex glyph 通过同一生成字体同步 H5 Icon 资源。

AI 必须遵守：

- Codex 目的地 value 保持 codex，但 Tabbar 图标使用当前 Icon manifest 的 code；不要因名称不同而改错真实路由。
- 一级目的地语义改变时同步 value、ariaLabel、真实路由、app.json、页面状态和专项测试，不保留旧空白别名。
- 小程序代码区优先组合 PUI Card/Button/Icon；原生 scroll-view 只承担代码横向阅读。
- 复制成功或失败必须来自 wx.setClipboardData 回调，不能在点击时直接显示成功。
- Skill 未交付前只保留 SKILL 留白，不提供假下载、假复制或示例内容。
- 小程序应用页不伪造成 H5 组件页；共享 Icon 字体和已有 H5 代码块合同必须继续同步。

验证与遗留风险：

- 验证：`npm run icons:generate`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`微信 DevTools build-npm`
- 真机/兼容风险：iOS/Android 真机仍需确认 Tabbar code glyph 与页面 codex glyph 的字体抗锯齿、基线、触摸命中、代码横向滚动、选择文本、剪贴板权限和读屏；本轮未把模拟器结论冒充真机。
- 真机/兼容风险：小程序 Codex 页面深色及边框、阴影、毛玻璃、大圆角、等距组合的运行态视觉仍未逐项检查。
- 真机/兼容风险：SKILL 尚未实现；当前留白不是可安装或可复制能力。

## PUI-FB-0421 · 第四 Tab 账户页只保留昵称与真实服务入口

- 原始记录：`feedback/records/pui-fb-0421-miniprogram-me-account-services-page.json`
- 范围：`component` / `miniprogram`、`tabbar`、`card`、`avatar`、`input`、`button`、`cell`、`toast`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：把“我的”页面保持为克制可用的账户页：可修改昵称并访问真实服务入口，同时彻底删除 OpenID 展示、获取、兼容读取和复制链路。
- 实际问题：昵称与服务入口已经可用，但 OpenID Cell、页面状态、剪贴板方法、App.globalData/旧存储读取和 setOpenId 桥接仍存在。
- 决策：保留真实 pages/me/index 与 nickname Store，但删除 OpenID Cell、页面状态、脱敏函数、剪贴板动作、App.globalData/旧存储读取和 setOpenId 桥接；下一次昵称保存只写入 nickname。隐私和关于诗上继续调用微信真实平台能力；高级版商业授权使用“查阅详情”语义并明确提示详情正在准备中，订单在真实查询链完成前继续明确反馈未开放。服务 CellGroup 相对资料卡额外使用一个 --pui-section-gap，为资料 Input 与 Surface 阴影保留稳定安全空间；客服入口投影到 Navbar 最左侧 left Slot，以 text/transparent/small/circle/iconOnly 的透明 PUI Button 保留 open-type=contact。
- 理由：用户已经撤销客户端 OpenID 入口；完整删除读取与桥接可以避免敏感身份残留和后续 Agent 误恢复。旧存储不做主动破坏性清理，但不再读取，保存昵称时资料对象自然收敛为单字段。

AI 必须遵守：

- 我的页不得展示、读取、缓存或复制 OpenID，也不得从 App.globalData 或旧 openid 存储键恢复身份字段。
- user-profile Store 只公开 restore 和 setNickname，持久化对象只包含 nickname。
- 微信隐私合同和跨小程序跳转必须使用平台 API，并由失败回调反馈，不能以静态页面或成功文案替代。
- 客服使用 Navbar 最左侧 left Slot 的透明 PUI IconButton，保留 open-type=contact；capsule=true 时禁用 right Slot，leftBtn 不能替代平台开放能力。
- 服务 CellGroup 与资料卡的额外间距使用 --pui-section-gap；它同时为资料 Input/Surface 阴影留出稳定空间，不得增加页面魔法数或第二层 Surface。
- 没有支付、订单或登录后端时明确显示未开放，不建立假路由、假数据或假成功。
- 应用一级目的地优先组合 PUI 组件；应用页面不伪造成 H5 标准组件页。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-me-page.js：通过`
- 验证：`node scripts/test-miniprogram-tabbar-pages.js：通过`
- 验证：`node scripts/test-miniprogram-home.js：通过`
- 验证：`npm run check：通过`
- 验证：`npm run site:build：通过`
- 验证：`npm run example:install：通过`
- 验证：`npm run pack:check：通过`
- 验证：`微信 DevTools build-npm：982ms，warnings=[]`
- 真机/兼容风险：iOS/Android 真机仍需确认昵称软键盘与焦点、隐私合同弹层、跨小程序跳转、safe-area、深浅色和读屏。
- 真机/兼容风险：微信客服会话依赖小程序后台客服配置；模拟器属性存在不等于真机客服链路已经可用，仍需 iOS/Android 点击、进入、返回和失败回调验收。
- 真机/兼容风险：小程序深色及边框、阴影、毛玻璃、大圆角、等距组合仍未在本页逐项运行验证。
- 真机/兼容风险：未来若新增登录，必须另建服务端身份合同，不能恢复本地昵称 Store 中的 OpenID 字段。
- 真机/兼容风险：高级版商业授权详情与订单服务尚未交付；授权 Cell 使用“查阅详情”语义并明确提示正在准备中，订单继续提供未开放反馈。
- 真机/兼容风险：iOS/Android 真机仍未验证资料旧对象在用户下一次保存昵称后自然收敛为单字段。

## PUI-FB-0422 · 首页从组件页返回后分区锚点覆盖原阅读位置

- 原始记录：`feedback/records/pui-fb-0422-home-scroll-return-exact.json`
- 范围：`component` / `miniprogram-home`、`scroll-area`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：从首页进入任一组件页并返回时，首页应保持离开时的真实阅读位置。
- 实际问题：旧实现总是执行 scroll-into-view，覆盖了用户离开前的位置。
- 决策：以 ScrollArea scroll 事件保存本次页面实例的 scrollTop；返回栈恢复时清空锚点。
- 理由：滚动位置属于阅读上下文，不能由目录状态反推。

AI 必须遵守：

- 不要用展开分区锚点覆盖用户已有滚动位置。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-home.js`
- 真机/兼容风险：微信返回栈与 ScrollArea scroll 事件时序仍需真机确认。

## PUI-FB-0423 · Popup Footer 操作轨未明确全宽且全局毛玻璃未作用遮罩

- 原始记录：`feedback/records/pui-fb-0423-popup-footer-full-width-and-global-frost.json`
- 范围：`component` / `popup`、`config-provider`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Popup 底部默认操作使用完整宽度，并让遮罩跟随全局毛玻璃语义。
- 实际问题：Footer 未明确全宽轨道，Popup 遮罩只依赖局部 blurOverlay。
- 决策：Footer 保持唯一 100% flex 轨道，按钮通过公开 block 能力填满；遮罩合并局部与全局模糊。
- 理由：避免穿透 Slot 节点，同时保持双端外观语义一致。

AI 必须遵守：

- Footer Button 使用公开 block，而非 Popup 的标签选择器。

验证与遗留风险：

- 验证：`node scripts/test-popup.js`
- 真机/兼容风险：WXSS Slot 宿主尺寸和 backdrop-filter 仍需合法 AppID 真机确认。

## PUI-FB-0424 · Sticky 独立页未计入组件 Navbar 高度

- 原始记录：`feedback/records/pui-fb-0424-sticky-navbar-offset.json`
- 范围：`component` / `sticky`、`component-page-navbar`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Sticky 吸顶后不能占用页面 Navbar。
- 实际问题：页面只传业务偏移，固定节点从视口顶部覆盖 Navbar。
- 决策：在 component-page 布局测量后回调页面，Sticky 将实测 navbarHeight 传入 offsetTop。
- 理由：Navbar 几何属于页面布局事实，不能硬编码。

AI 必须遵守：

- 禁止用固定 navbar 高度修正 Sticky。

验证与遗留风险：

- 验证：`node scripts/test-sticky.js`
- 真机/兼容风险：安全区和 SelectorQuery 测量仍需真机验证。

## PUI-FB-0425 · Navbar 缺少左右 Slot 组合与对称胶囊演示

- 原始记录：`feedback/records/pui-fb-0425-navbar-slot-and-capsule-examples.json`
- 范围：`component` / `navbar`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Navbar 独立页应展示单按钮 Slot、双按钮 Slot 和与微信胶囊对称的操作组合。
- 实际问题：旧概览未完整展示 Slot 组合，双操作没有共享胶囊外壳。
- 决策：为三种用法提供真实 PUI Button 与 Icon，并让配置双按钮共用圆角胶囊轨道。
- 理由：演示必须展示可组合能力且不仿造可点击原生微信胶囊。

AI 必须遵守：

- 胶囊仅表达镜像空间，原生菜单不可被 PUI 接管。

验证与遗留风险：

- 验证：`node scripts/test-navbar.js`
- 真机/兼容风险：原生微信胶囊矩形和安全区仍需真机确认。

## PUI-FB-0426 · Tabs 在毛玻璃外观下把每个 Tab 渲染成独立按钮轮廓

- 原始记录：`feedback/records/pui-fb-0426-tabs-surface-not-button-outline.json`
- 范围：`component` / `tabs`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Tabs 的外观设置应作用整条导航 Surface，而不是为每个 Tab 增加按钮轮廓。
- 实际问题：共享 Button 外观泄漏到单个 Tab，出现重复边框和毛玻璃。
- 决策：Tab 使用透明 Button 表面，Tabs Header 是唯一承接边框和毛玻璃的导航 Surface。
- 理由：Tab 是连续导航轨道，不是并排按钮卡。

AI 必须遵守：

- 不要让共享 Button 的 frost/border 泄漏到单个 Tab。

验证与遗留风险：

- 验证：`node scripts/test-tabs.js`
- 真机/兼容风险：WXSS Button 样式隔离仍需真机确认。

## PUI-FB-0427 · Steps 连线未留出图标中心两侧间距

- 原始记录：`feedback/records/pui-fb-0427-steps-connector-center-gap.json`
- 范围：`component` / `steps`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：步骤 1、2、3 的连线位于图标垂直中心且两端保留视觉间距。
- 实际问题：连线锚点沿用旧尺寸，视觉上直接连接图标。
- 决策：水平和垂直连线均从指标中心偏移后的安全点开始与结束。
- 理由：数字指标保持独立可读，连线只表达步骤关系。

AI 必须遵守：

- 不要让 connector 直接贴住数字图标。

验证与遗留风险：

- 验证：`node scripts/test-steps.js`
- 真机/兼容风险：不同字体与 rpx 回流仍需真机确认。

## PUI-FB-0428 · Indexes 默认滚动预算不足影响连续浏览

- 原始记录：`feedback/records/pui-fb-0428-indexes-scroll-budget.json`
- 范围：`component` / `indexes`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Indexes 列表滚动区域提高约 30%，便于用户连续浏览。
- 实际问题：默认和页面高度为 640rpx 或更低，连续浏览空间不足。
- 决策：默认与独立页主示例统一使用 680rpx，H5 以同一 rpx 镜像。
- 理由：增加可浏览内容而不改变索引导航 API。

AI 必须遵守：

- 调整高度时同步小程序与 H5 默认值。

验证与遗留风险：

- 验证：`node scripts/test-indexes.js`
- 验证：`npm run example:install`
- 真机/兼容风险：微信惯性滚动和 sticky 标题仍需真机确认。

## PUI-FB-0429 · Sidebar 选中态在原图标外追加 Check 造成重复信息

- 原始记录：`feedback/records/pui-fb-0429-sidebar-selected-icon-replacement.json`
- 范围：`component` / `sidebar`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Sidebar 被选中时 Check 应替换左侧图标，不应在右侧再塞一个图标。
- 实际问题：旧布局保留左图标并新增右侧 Check。
- 决策：选中项用 Check 覆盖 left icon，右侧不再追加 Check。
- 理由：状态只有一次视觉表达，减少条目噪音。

AI 必须遵守：

- 选中态不能同时保留左图标和右侧 Check。

验证与遗留风险：

- 验证：`node scripts/test-sidebar.js`
- 真机/兼容风险：小程序 slot 图标与 Check 对齐仍需真机确认。

## PUI-FB-0430 · Field 独立页输入控件未以可编辑单元格变体组合

- 原始记录：`feedback/records/pui-fb-0430-field-editable-input-composition.json`
- 范围：`component` / `field`、`input`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Field 示例必须可以输入，并保持单一可编辑 Cell Surface。
- 实际问题：页面组合遗留 Input 自身边框，容易表现为双层控件并遮蔽编辑反馈。
- 决策：保留真实 PUI Input，统一以 bordered=false 作为 Field 默认内容变体。
- 理由：既保留可输入能力，也避免双 Surface。

AI 必须遵守：

- Field 演示中的 Input 默认传 bordered=false。

验证与遗留风险：

- 验证：`node scripts/test-field.js`
- 真机/兼容风险：微信 Input focus 与 Slot 投影仍需真机确认。

## PUI-FB-0431 · Checkbox 勾选标记需要明确 PUI Icon 与圆心对齐

- 原始记录：`feedback/records/pui-fb-0431-checkbox-pui-icon-centering.json`
- 范围：`component` / `checkbox`、`icon`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Checkbox 勾选图标必须使用 PUI Icon，并在圆形标记中准确居中。
- 实际问题：图标宿主未声明统一 flex 几何，存在基线偏移风险。
- 决策：三态统一使用 PUI Icon 并以 28rpx flex 容器居中。
- 理由：避免字符图标和字体基线差异。

AI 必须遵守：

- 禁止以字符勾号替代 pui-icon。

验证与遗留风险：

- 验证：`node scripts/test-checkbox.js`
- 真机/兼容风险：WXSS 自定义组件宿主基线仍需真机确认。

## PUI-FB-0432 · Card 演示缺乏真实任务层级和不可操作归档状态

- 原始记录：`feedback/records/pui-fb-0432-card-release-check-showcase.json`
- 范围：`component` / `card`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：重做 Card 演示，使其能展示清楚的内容层级、真实动作和禁用归档。
- 实际问题：旧演示以 slot 工程术语和诊断内容为主，难以理解。
- 决策：改为发布前检查场景，保留 Card click 的真实父级展开结果与归档阅读态。
- 理由：展示 Card 的内容、footer 和 disabled 语义，无额外卡片层。

AI 必须遵守：

- Card 点击必须改变真实父级内容，不能只显示日志。

验证与遗留风险：

- 验证：`node scripts/test-card.js`
- 真机/兼容风险：真机 Slot footer 触摸冒泡仍需验证。

## PUI-FB-0433 · Dialog Header Footer 与遮罩外观未与 Popup 结构一致

- 原始记录：`feedback/records/pui-fb-0433-dialog-popup-header-footer-overlay.json`
- 范围：`component` / `dialog`、`popup`、`overlay`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Dialog Header 参考 Popup 三轨设计，Footer 按按钮数量全宽布局，Overlay 跟随全局外观。
- 实际问题：Header 与 Popup 几何漂移，Footer 叠加错位，遮罩未统一外观。
- 决策：对齐 Popup Header 的安全轨与 padding；Footer 只由真实按钮数决定单/双列；Overlay 接入全局 frosted。
- 理由：Dialog 是 Popup 的语义组合，结构与外观不能分叉。

AI 必须遵守：

- Footer 列数只取真实按钮数量的一或二列。

验证与遗留风险：

- 验证：`node scripts/test-dialog.js`
- 验证：`node scripts/test-popup.js`
- 真机/兼容风险：微信 Overlay 过滤、Footer Slot 和安全区仍需真机确认。

## PUI-FB-0434 · List 独立页条目数量不足以展示连续列表行为

- 原始记录：`feedback/records/pui-fb-0434-list-longer-browsing-example.json`
- 范围：`component` / `list`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：List 示例应展示更多真实条目，便于观察滚动、禁用和尾部状态。
- 实际问题：旧页面只有三条，无法体现列表浏览和底部动作。
- 决策：增加连续可操作条目与末尾禁用条目，状态闭环不自动伪造加载成功。
- 理由：让 List 的 Cell 组合、浏览和 Footer 有真实空间。

AI 必须遵守：

- 保留禁用和 Footer 状态但不伪造加载完成。

验证与遗留风险：

- 验证：`node scripts/test-list.js`
- 真机/兼容风险：真机滚动惯性仍需确认。

## PUI-FB-0435 · SwipeCell 果味外观下动作底板透出且未闭合圆角

- 原始记录：`feedback/records/pui-fb-0435-swipe-cell-fruit-underlay.json`
- 范围：`component` / `swipe-cell`、`button`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：SwipeCell 在果味毛玻璃外观下应保持完整圆角动作底板，primary/danger 不透出为独立按钮。
- 实际问题：内层 Button 的 Surface 被毛玻璃影响，底板没有统一裁切和主题色。
- 决策：SwipeCell 外壳承担圆角与裁切；动作 wrapper 承担 theme 色；Button 仅透明交互根。
- 理由：动作层是同一组件的底板，不是多张并排毛玻璃卡。

AI 必须遵守：

- 不要让 SwipeCell 动作 Button 自己成为毛玻璃 Surface。

验证与遗留风险：

- 验证：`node scripts/test-swipe-cell.js`
- 真机/兼容风险：WXSS backdrop-filter 与触摸拖动需真机验证。

## PUI-FB-0436 · CountDown 时分秒单位在窄宽下被挤压断行

- 原始记录：`feedback/records/pui-fb-0436-countdown-unit-no-wrap.json`
- 范围：`component` / `count-down`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：倒计时时分秒与单位标签在 390px 下保持完整可读。
- 实际问题：内联段允许收缩，单位标签有被挤压和断行风险。
- 决策：segments nowrap，numeric/单位 flex none 和 white-space nowrap。
- 理由：倒计时数值与单位是一组语义，不能拆行。

AI 必须遵守：

- 不要以压缩或换行处理时分秒单位。

验证与遗留风险：

- 验证：`node scripts/test-count-down.js`
- 真机/兼容风险：系统字体宽度和 rpx 回流仍需真机确认。

## PUI-FB-0437 · Swiper 演示缺少图片底板且错误重试未形成独立全宽行

- 原始记录：`feedback/records/pui-fb-0437-swiper-image-backdrop-and-retry-row.json`
- 范围：`component` / `swiper`、`image`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Swiper 使用真实图片作为底板，无法读取时重新加载按钮应独占一行。
- 实际问题：旧演示主要是图标底板，错误 Retry 与文本竞争同一行。
- 决策：采用三张远程图片作为轮播底板；错误层将 Retry 改为独立全宽行。
- 理由：让正常内容和恢复入口均具有清楚的视觉主次。

AI 必须遵守：

- 远程示例资源必须在小程序域名策略下另行验证。

验证与遗留风险：

- 验证：`node scripts/test-swiper.js`
- 真机/兼容风险：小程序 downloadFile 域名白名单和弱网图片加载仍需真机确认。

## PUI-FB-0438 · Table 选择 Checkbox 被固定列边界塑造成独立容器

- 原始记录：`feedback/records/pui-fb-0438-table-selection-integrated-cell.json`
- 范围：`component` / `table`、`checkbox`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Table 前置选中控件应与表格一体，不应有额外底色、圆角或固定列分隔容器。
- 实际问题：选择列带有 fixed-edge 边线，Checkbox 容器外观与表格分离。
- 决策：选择列继续 sticky 但不使用 edge divider，Checkbox 使用 borderless 变体。
- 理由：选择是 Table 内置列而非独立卡片。

AI 必须遵守：

- selection cell 可 sticky 但不可继承 fixed-edge divider。

验证与遗留风险：

- 验证：`node scripts/test-table.js`
- 真机/兼容风险：微信 sticky 层叠与 Checkbox 点击仍需真机确认。

## PUI-FB-0439 · 公司书写 Logo 以 poemcoder-mark 正式接入 pui-icon

- 原始记录：`feedback/records/pui-fb-0439-poemcoder-mark-public-pui-icon.json`
- 范围：`global` / `brand-identity`、`icon`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：把公司现有书写 Logo 转为可直接通过 `<pui-icon name="poemcoder-mark" />` 使用的 SVG 与 Icon Font 字形。
- 实际问题：调整前公司字标与公共 manifest、map、catalog 和 PoemUI Roundline 字体隔离，调用 `<pui-icon name="poemcoder-mark" />` 会进入 unknown-icon。
- 决策：将五段闭合 Logo 轮廓以 `poemcoder-mark` 收录到 `abstract / 抽象` 分类，source 固定为 `user-owned:poemcoder-mark`，只追加稳定码点 U+E0DB；目录由 218 增至 219，分类仍为 17。删除 company-mark 独立字体、脚本、资产与旧别名，site:build 在 miniprogram_dist 之前运行 icons:generate。
- 理由：用户明确指定了 pui-icon 调用方式与公开名称；将登记自有轮廓放入现有唯一字体链可以保持 currentColor、离线交付、跨端码点和 Icon 页面目录同源，同时不伪称为 Lucide 派生。

AI 必须遵守：

- 自有 Logo 进入 pui-icon 时必须在 manifest 记录 user-owned 来源，禁止冒充 Lucide 派生。
- Logo 字形使用少量闭合轮廓和稳定内腔，不把位图或自动描摹噪点写入发布资产。
- 公开名称变更后删除旧别名、独立字体和第二生成链；页面继续只消费生成 catalog。
- 新增 glyph 只从 nextCodepoint 追加，禁止改写既有码点。
- 没有用户最终视觉确认前 acceptance 保持 pending-user；未经过真机验证时保留平台字体风险。

验证与遗留风险：

- 验证：`npm run icons:generate：通过，生成 219 个名称、17 个分类和 22712-byte PoemUI Roundline WOFF2。`
- 验证：`node scripts/test-icon.js：通过。`
- 验证：`node scripts/test-icon-font-outlines.js：通过，59 个镂空圆与 25 个语义点保持原拓扑。`
- 验证：`node scripts/check-package.js：通过；manifest、219 个磁盘 SVG、map、catalog 与字体一致。`
- 验证：`npm run site:build：通过；icons:generate 在 miniprogram_dist 之前执行，生成 69 个组件目录。`
- 验证：`npm run example:install：通过；当前 tarball 安装到 _example，0 vulnerabilities。`
- 验证：`微信开发者工具 cli build-npm --project miniprogram：清理旧生成包后标准重建通过；最终复跑 AppID wx23aa017375535746，cost 1031ms，warnings 为空。`
- 验证：`四层发布哈希一致：icon-font-map.js=974d30d709ac6ed8900735cd6031a3b58e3bd7edd5e84ad0e23c04fc3f4a25a6，icon-font-catalog.js=a548461ece5538f9fe8db1432684ba8b1a5292bbedcda9e538a99f807e676c1c，icon-font.wxss=bb3020112ce0a2b4272472aa75ffc9abd24088b9fd61d8c416585321fa9d16cd，manifest.json=9c85e64d2a78e0d836dd9154c660f60f2588cc65324e9300fb111bb9f9bc643e；源码、miniprogram_dist、示例安装和 miniprogram_npm 逐字节一致。`
- 验证：`npm run pack:check：通过；340.8 kB、解包 1.6 MB、535 files、shasum 03f67304e7645d0731b45ea1d008c39340b685bb，包含 poemcoder-mark.svg 且不包含 company-mark。`
- 验证：`npm run check：precheck 含 Icon 在内全部通过；正式 check 的 Ledger、site:build 顺序和 WXSS 门禁通过，随后被并行 dirty worktree 新增 dynamic-message / top-loading 但未同步 test-component-catalog-pruning.js 的发布集合阻断，本记录未覆盖该无关组件工作。`
- 真机/兼容风险：用户已确认公开名称，但公司字标最终轮廓的 acceptance 仍保持 pending-user。
- 真机/兼容风险：H5 与微信开发者工具已经复核；iOS/Android 真机的 20rpx 抗锯齿、字体基线与不同系统字体栅格器表现仍未验证。

## PUI-FB-0440 · 我的页缺少更新公告且共享云服务边界未建立

- 原始记录：`feedback/records/pui-fb-0440-miniprogram-update-announcement-shared-cloud.json`
- 范围：`component` / `miniprogram`、`cell`、`popup`、`tag`、`icon`、`top-loading`、`button`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：在我的页增加更新公告 Cell，点击后使用 Popup 陈列真实更新内容；接入共享环境 poemcoder-1gkbkid139b08f45 的 pui_updatelog，并突出版本、日期和组件改动。
- 实际问题：页面没有公告能力，共享云服务的环境共享、跨主体接入和权限分区也没有文档合同。
- 决策：新增更新公告 Cell、受控底部 PUI Popup 和独立公告 Service；Service 使用 wx.cloud.Cloud 的 resourceAppid/resourceEnv 读取共享生产环境 pui_updatelog，只消费 published 公告，成功缓存，失败回退缓存或包内同形数据并保留来源。Popup 使用唯一滚动 Content，以组件 Tag、Icon、标题和说明突出组件改动，Content 顶部使用受控 TopLoading 表达请求状态，Footer 为全宽 Button。只有真实 cloud 且无 error 的结果进入 success，缓存、本地回退或异常直接回到 idle。后续 PUI 云集合统一使用 pui_ 前缀。
- 理由：共享环境和集合已经由用户确认，直接使用微信环境共享可以复用现有生产资源；独立 Cloud 实例避免污染默认环境，稳定 Schema 与缓存保证弱网可读，来源字段防止 fallback 被误报为云端成功。

AI 必须遵守：

- 应用公告入口使用真实 Cell 和受控 Popup，不在页面重写 Overlay、Header、Content 或 Footer。
- Popup Content 是唯一公告滚动区，Footer Button 通过 block 使用全宽操作轨。
- 公告请求使用受控 TopLoading；只有真实云端成功进入 success，缓存、本地回退和异常都回到 idle，不得保留居中 Spinner 或用停止加载推断成功。
- 公告 Service 使用独立 Shared Cloud，返回副本并保持稳定 Schema；远程失败时不得把缓存或包内回退冒充刚从云端刷新。
- 所有 PoemUI 专属云集合使用 pui_ 前缀；更新公告固定使用 pui_updatelog。
- 同主体小程序可评估微信云开发环境共享；跨主体或多端使用独立 HTTPS/CloudBase HTTP 服务。
- 共享用户、授权或订单必须由服务端按可信 AppID 和用户身份分区，不能信任客户端传入的 appId/openid。
- 没有环境 ID、主体授权和部署证据时不得宣称云服务已经接入。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-me-page.js：通过`
- 验证：`node scripts/test-popup.js：通过`
- 验证：`node scripts/test-cell.js：通过`
- 验证：`node scripts/test-tag.js：通过`
- 验证：`cloud_db_write_doc：insertedCount=1，insertedIds=[pui-v0-1-0-20260727]`
- 验证：`cloud_db_read_doc：写后回读唯一文档成功`
- 验证：`微信开发者工具 pages/me/index：announcementSource=cloud、announcementSyncError 为空，版本与五组 highlights 来自共享集合`
- 真机/兼容风险：390x844 微信模拟器已验证 Popup 视觉层级；长公告真实滚动边界和 Footer 点击仍需回归。
- 真机/兼容风险：深浅色、边框、阴影、毛玻璃、大圆角、等距组合及 iOS/Android 真机仍待验证。
- 真机/兼容风险：开发者工具已验证调用方能读 published 文档；客户端禁止读取草稿、写入、更新和删除的完整安全规则仍需在资源方控制台专项验收。
- 真机/兼容风险：共享环境的配额、费用、日志、告警和备份仍需在资源方控制台治理。

## PUI-FB-0441 · Picker / DateTimePicker 默认图标 Header 与 Classic 底部模式

- 原始记录：`feedback/records/pui-fb-0441-picker-default-header-actions-and-classic-type.json`
- 范围：`component` / `picker`、`popup`、`date-time-picker`、`preview-site`、`miniprogram`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Picker 默认类型应像 Popup 一样使用三轨 Header：左侧为 primary Check 圆形图标确认、标题居中、右侧为 default Close 圆形图标取消；DateTimePicker 同步这一 API，旧底部双按钮版本命名为 classic。
- 实际问题：上一版虽已把操作移入 Popup Header，但仍使用左右文字按钮；DateTimePicker 未公开 type，H5 也未镜像 Popup 的 36px 三轨图标 Header。
- 决策：Picker 与 DateTimePicker 都公开 type: 'default' | 'classic'；默认 Header 为左 primary Check 圆形图标确认、标题、右 default Close 圆形图标取消，classic 复用原有 Footer 两列。
- 理由：以 Popup 已存在的三列 Header、header-left 和 close-btn Slot 组合真实 PUI IconButton；DateTimePicker 只把 type 透传给 Picker，不在页面或 H5 单独复制 Header。

AI 必须遵守：

- 默认 Picker Popup 通过 Popup header-left 放 primary/base/circle Check 确认、close-btn 放 default/base/circle Close 取消，并显式关闭 Popup 默认 closeBtn。
- Classic Footer 只能由公开 type=classic 启用，不能作为页面私有旧样式。
- 切换操作位置不得改变 confirm/cancel 的草稿、受控值、显隐或事件顺序。
- DateTimePicker 只组合 Picker；公开 type 时只能透传给 Picker，而不能复制 Header 结构。

验证与遗留风险：

- 验证：`node scripts/test-picker.js（通过）`
- 验证：`node scripts/test-popup.js（通过）`
- 验证：`node scripts/test-date-time-picker.js（通过）`
- 验证：`node scripts/test-miniprogram-form-pages.js（通过）`
- 验证：`node --check preview/app.js（通过）`
- 验证：`npm run miniprogram:build（通过，生成 71 个组件目录）`
- 验证：`npm run site:build（通过）`
- 验证：`npm run example:install（通过）`
- 验证：`微信开发者工具：工具 → 构建 npm（通过，414ms，问题面板 0）`
- 验证：`npm run pack:check（通过，npm pack --dry-run）`
- 验证：`npm run check（未通过：scripts/test-component-catalog-pruning.js 仍断言 69 个组件，当前工作区已有 top-loading / dynamic-message 后实际为 71；与本条 Picker / DateTimePicker 改动无直接关系）`
- 真机/兼容风险：微信开发者工具已完成 npm 构建，但模拟器对首页组件入口和调试控制台路由命令未产生页面跳转；本轮未能在模拟器实际执行 Picker / DateTimePicker 的点击链，标记 pending-device。
- 真机/兼容风险：微信真机需复核 Popup 命名 Slot 投影、圆形图标命中区、picker-view 惯性、遮罩、底部安全区、深浅色、毛玻璃和读屏顺序。

## PUI-FB-0442 · Input 尾部保存操作与清除按钮需要统一组件轨道

- 原始记录：`feedback/records/pui-fb-0442-input-trailing-action-slot.json`
- 范围：`component` / `input`、`button`、`miniprogram-me`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：昵称保存应成为满宽 Input 内的单图标右侧操作，并与 Clear 同时稳定可用；该能力必须属于 Input 公共组件合同。
- 实际问题：保存按钮位于 Input 外部，页面重复编排字段操作，无法直接复用 Input 的尾部组合合同。
- 决策：复用既有 suffix="slot" 作为可选右侧操作 API；新增共享 Trailing 布局轨，昵称保存改为 Slot 内单图标 PUI Button，并同步 H5、文档、测试与发布产物。
- 理由：TDesign 1.15.3 的固定 WXML 同样在 Clear 后投影 suffix Slot，官方示例用其承载操作；复用现有语义能减少重复 API，同时由组件保证跨页面几何一致。

AI 必须遵守：

- 存在 suffix Slot 时不要再新增语义重叠的 right/action Prop。
- 输入主轨必须可收缩，尾部轨不越界并以 auto margin 贴右。
- Clear 与 suffix 操作同时存在时固定 Clear 在前、业务操作在后。
- Slot 内业务 Button 由消费者绑定事件和结果，Input 不代理业务成功。

验证与遗留风险：

- 验证：`node scripts/test-input.js：通过`
- 验证：`node scripts/test-miniprogram-me-page.js：通过`
- 验证：`npm run feedback:generate：通过，共生成 424 条记录`
- 验证：`npm run feedback:check：通过`
- 验证：`npm run site:build：通过`
- 验证：`npm run example:install：通过，0 vulnerabilities`
- 验证：`npm run pack:check：通过，346.2 kB / 1.7 MB / 543 files`
- 验证：`微信开发者工具 build-npm：960ms，warnings=[]`
- 真机/兼容风险：微信 iOS/Android 真机仍需确认中文输入法聚焦时点击 Slot Button 的键盘与 blur 顺序。
- 真机/兼容风险：小程序自定义组件 Slot 样式隔离、Clear + 保存双触摸区和读屏顺序仍需合法 AppID 真机复核。

## PUI-FB-0443 · TopLoading 需要区分未知进度、精确零值与真实完成

- 原始记录：`feedback/records/pui-fb-0443-top-loading-explicit-progress-contract.json`
- 范围：`component` / `top-loading`、`preview-site`、`miniprogram-advanced-page`
- 状态：`resolved`，用户验收：`accepted`，更新：2026-07-27
- 用户目标：新增卡片或页面顶部的真实加载反馈；短请求不闪烁、未知总量和精确进度可区分，只有业务明确完成时才显示成功。
- 实际问题：新增前没有可发布 TopLoading 合同；首版 H5 概览按钮还会被 component-only 归一化移除，属性面板也曾回退到错误的通用默认值。
- 决策：用受控 state + progress 建立单一状态机，保留 null 与 0；以普通演示触发区通过 PUI Button 驱动真实运行态，失败和取消只回到 idle；默认动效 500ms、上限 1000ms、低动效 1ms。
- 理由：请求结果由业务层掌握，组件只渲染明确状态；独立的 delay/minimumVisible/successDuration 能避免把停留时间误当动画时长。

AI 必须遵守：

- 未知总量使用 progress=null，精确起点必须保留 progress=0。
- 失败和取消回写 idle，不得借 progress 或提示文字伪造 success。
- delay、minimumVisible、successDuration 和 duration 不得混为一个时间字段。
- H5 概览必须保留至少一个真实触发入口并复用 PUI Button。

验证与遗留风险：

- 验证：`node scripts/test-top-loading.js：通过`
- 验证：`node scripts/test-miniprogram-advanced-pages.js：通过`
- 验证：`npm run site:build：通过`
- 验证：`npm run check：通过`
- 验证：`npm run pack:check：通过，346.3 kB / 1.7 MB / 543 files`
- 验证：`npm run example:install：通过，0 vulnerabilities`
- 验证：`真实 miniprogram 微信 build-npm：1187ms，warnings=[]`
- 真机/兼容风险：微信 iOS/Android 真机仍需确认高频 setData 时双轨动画帧率与安全区顶部裁切。
- 真机/兼容风险：极短请求在不同基础库计时精度下的 delay 防闪烁仍需真机压力回归。
- 真机/兼容风险：通用 _example 保持 touristappid，微信 CLI 返回 code 10；真实 miniprogram 已完成官方 build-npm。

## PUI-FB-0444 · DynamicMessage 需要 retained update、队列和双阶段变形动效

- 原始记录：`feedback/records/pui-fb-0444-dynamic-message-retained-queue-preview.json`
- 范围：`component` / `dynamic-message`、`button`、`icon`、`loading`、`preview-site`、`miniprogram-advanced-page`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：新增类似 iOS 灵动岛的顶部非模态通知：先从顶部弹出 Icon + 标题的紧凑胶囊，再展开长出完整面板；退场严格反向，同时保证同一任务原位更新、不同任务排队、真实 Action/关闭事件，并同步 H5 与小程序独立页面。
- 实际问题：新增前没有该组件；首版修复 retained update 和队列后，视觉仍把整张 Surface、标题、正文和操作放进同一次 translateY + scale 过渡，退场仅移除 active class，没有先收拢面板、再退出胶囊的分段语义。
- 决策：保留单一 retained Surface、currentCustomIcon、同 key patch、FIFO 和 H5 事件隔离；双端新增 entering/compact/expanding/visible/collapsing/leave-compact/hidden 状态机。compact 固定 180ms，只呈现 PUI Icon/Loading + title；panel 固定 320ms，通过明确 max-width/min-height/max-height 边界长开正文与操作；退场反向执行后才卸载并发出 close。
- 理由：灵动通知的识别度来自内容层级和形态连续变化，而不是整卡缩放。显式阶段既能保持文字不被缩放，又能让 close、队列、自动关闭和低动效继续绑定真实生命周期。

AI 必须遵守：

- 进场必须是 compact 180ms 后 expanding 320ms；退场必须先 collapsing 320ms 再 leave-compact 180ms。
- compact 只显示 PUI Icon/Loading 与 title；message、Action、Close 和 accent 只能在完整面板阶段出现。
- 不得用单段 scale 缩放标题正文，不得 transition height:auto 或用 display:none 制造瞬移。
- 同 key 更新不得销毁当前节点或重播完整入场。
- 消费者未传 icon 时主题变化必须同步刷新默认 PUI Icon。
- 不同 key 使用 FIFO，不得覆盖当前消息或同时堆叠多座通知。
- H5 局部 demo action 被消费后必须阻止全局 renderStage 清空运行态。
- 通知保持非模态，页面列表必须仍可鼠标按住拖动和滚动。

验证与遗留风险：

- 验证：`node scripts/test-dynamic-message.js：通过`
- 验证：`node scripts/test-miniprogram-advanced-pages.js：通过`
- 验证：`npm run site:build：通过`
- 验证：`npm run check：通过`
- 验证：`npm run pack:check：通过，347.0 kB / 1.7 MB / 543 files`
- 验证：`npm run example:install：通过，0 vulnerabilities`
- 验证：`真实 miniprogram 微信 build-npm：1292ms，warnings=[]`
- 真机/兼容风险：微信 iOS/Android 真机仍需验证状态栏与胶囊差异下 safeArea 顶部定位。
- 真机/兼容风险：真机 VoiceOver/TalkBack 对 retained live region 的连续播报、Action 与 Close 顺序仍需确认。
- 真机/兼容风险：低端 Android 连续更新和长队列下的动画帧率、内存释放仍需压力回归。
- 真机/兼容风险：通用 _example 保持 touristappid，微信 CLI 返回 code 10；真实 miniprogram 已完成官方 build-npm。

## PUI-FB-0445 · Select 选中 Option 未继承全局圆角

- 原始记录：`feedback/records/pui-fb-0445-select-selected-option-radius-inheritance.json`
- 范围：`component` / `select`、`button`、`popup`、`preview-site`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：Select 的选中框必须跟随全局圆角外观，不能在大圆角或果味外观下保留直角。
- 实际问题：小程序端依赖 PUI Button 的隐式继承；H5 透明 PUI Button 的高优先级规则将 Option 设为 `border-radius: 0` 并强制透明背景，选中态既没有可见柔和 Surface，也和 Trigger 脱节。
- 决策：小程序 Option 显式使用 `--pui-radius-medium`；H5 Select Option 以组件专属高优先级规则使用 `--pui-site-radius-control`，选中态同时恢复 `--pui-button-soft` 柔和 Surface 和品牌文字；该 Token 与 Trigger 的 PUI Button 控制圆角相同。
- 理由：选择项本身仍是 PUI Button，选中背景是其真实可见 Surface，应该继承同一全局圆角语义，而非菜单 Surface 半径或固定像素。

AI 必须遵守：

- 修改 Select Option 的选中背景时，同时检查普通/选中、正常/大圆角和 Trigger 的计算圆角。
- H5 不得以固定 px、`border-radius: 0` 或透明背景覆盖选中 Option；必须消费控制圆角 Token 与 PUI 柔和 Surface。
- 小程序 Option 必须使用 PUI Button 圆角 Token，不在页面或消费者样式中补丁。

验证与遗留风险：

- 验证：`node scripts/test-select.js：通过`
- 验证：`npm run feedback:generate：通过（427 records）`
- 验证：`npm run feedback:check：通过（427 records）`
- 验证：`npm run site:build：通过，生成71个组件目录`
- 验证：`npm run example:install：通过，0 vulnerabilities`
- 验证：`微信 DevTools CLI build-npm --project miniprogram：通过，1327ms，warnings=[]`
- 验证：`npm run check：通过`
- 验证：`npm run pack:check：通过，347.0 kB / 1.7 MB / 543 files`
- 验证：`git diff --check：通过`
- 真机/兼容风险：微信 DevTools 已实际完成合法 AppID build-npm 和390px首页表单目录展开，但当前会话未到 Select 独立页，Select 的模拟器展开、选择、取消和运行日志仍待补。
- 真机/兼容风险：微信 iOS/Android 真机仍需确认 Popup 内 PUI Button 的 WXSS 变量继承、rpx 圆角、触摸命中、样式隔离和读屏；H5 浏览器验收不能替代真机，当前状态为 pending-device。

## PUI-FB-0446 · 独立选中 Surface 未完整跟随组件语义圆角

- 原始记录：`feedback/records/pui-fb-0446-selection-surface-radius-parity.json`
- 范围：`component` / `combobox`、`sidebar`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：审计与 Select 相似的选中框，只有真实独立选中 Surface 才必须跟随全局圆角，并在组件源码与 H5 镜像一起修复。
- 实际问题：Combobox 选中背景没有圆角；Sidebar card 的 H5 圆角与小程序 medium Token 不一致。
- 决策：Combobox Option 在小程序显式使用 medium、H5 使用站点 control radius；Sidebar 只将 card 条目的 H5 圆角更正为 preview medium，默认连续轨道维持零圆角。
- 理由：选中背景只有在作为独立可见 Surface 时才需要随大圆角变化；以现有语义 Token 绑定可避免页面私有数值与跨端漂移。

AI 必须遵守：

- 先从实际背景、DOM/WXML 根与 H5 镜像判断是否是独立 Surface，禁止按 selected class 机械批量改样式。
- 独立选择 Surface 使用组件既有 medium/control 圆角 Token，不写固定半径或页面私有补丁。
- 组件级视觉修复必须同步小程序、H5、组件合同、专项测试与 Feedback Ledger。

验证与遗留风险：

- 验证：`node scripts/test-combobox.js`
- 验证：`node scripts/test-sidebar.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 验证：`npm run site:build`
- 验证：`npm run example:install`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`微信 CLI build-npm`
- 真机/兼容风险：微信 iOS/Android 真机仍需验证 card 条目和 Combobox Option 的 rpx 圆角裁切、ScrollView/触摸命中以及毛玻璃合成。

## PUI-FB-0447 · 更新公告缺少唯一 ScrollArea 与 78vh 内容上限

- 原始记录：`feedback/records/pui-fb-0447-update-announcement-scroll-area-78vh.json`
- 范围：`component` / `miniprogram-me`、`popup`、`scroll-area`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：更新公告 Popup 的内部内容必须使用 PUI ScrollArea，滚动区域最大高度为 78vh，Header 与 Footer 固定在滚动区外。
- 实际问题：公告只使用 Popup 默认内容滚动，无法消费 ScrollArea 的遮罩、尾部安全区和统一滚动合同。
- 决策：Popup 新增默认 true 的 contentScrollable；false 时保留 Content 分区但关闭 scroll-y。ScrollArea height 同步接受正 vh。更新公告使用 contentScrollable=false、height=78vh、contentPaddingBottom=0，Footer 固定在滚动区外。
- 理由：显式滚动所有权比嵌套两个 scroll-view 更稳定；复用现有 ScrollArea 能共享渐变、滚动和可访问性合同，正 vh 同步小程序/H5。

AI 必须遵守：

- Popup contentScrollable 默认 true；只有消费者提供唯一 PUI ScrollArea 时才设为 false。
- ScrollArea 正 vh 高度必须在小程序和 H5 同步，非法值继续安全回退。
- 更新公告 ScrollArea 最大 78vh，Header/Footer 固定在滚动区外。
- 已有固定 Footer 时按业务需要关闭 ScrollArea 默认 10vh 尾部空白。

验证与遗留风险：

- 验证：`node scripts/test-popup.js：通过`
- 验证：`node scripts/test-scroll-area.js：通过`
- 验证：`node scripts/test-miniprogram-me-page.js：通过`
- 验证：`npm run feedback:generate：通过，共 429 条记录`
- 验证：`npm run feedback:check：通过`
- 验证：`npm run site:build：通过`
- 真机/兼容风险：微信开发者工具已验证受控滚动和固定 Footer；真实手指连续拖动、边缘渐变显隐仍需真机复核。
- 真机/兼容风险：iOS/Android 真机的嵌套组件触摸、vh 计算、惯性滚动和读屏顺序仍待验证。

## PUI-FB-0448 · 首页缺少与 npm 包同源的当前版本标识

- 原始记录：`feedback/records/pui-fb-0448-home-current-version-package-source.json`
- 范围：`component` / `miniprogram-home`、`tag`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：在小程序首页找到克制且清晰的位置展示当前 PoemUI 版本号，并确保版本不会和发布包发生漂移。
- 实际问题：用户只能从更新公告或工程文件间接推断版本，首页没有当前版本标识。
- 决策：在 home-brand 名称行组合小尺寸默认浅色圆形 PUI Tag；构建脚本从 package.json.version 生成 miniprogram_dist/version.js，页面通过 require('poemui-miniprogram/version') 读取并添加 v 前缀。
- 理由：名称行能让版本与产品身份关联但不抢占 Navbar；轻量子入口避免页面维护版本字符串，也避免加载 poemui-miniprogram 总入口时把全部组件拉入微信模块图。

AI 必须遵守：

- 首页不得维护第二份版本字符串；读取 poemui-miniprogram/version 轻量子入口。
- 小程序页面不得为读取版本加载 poemui-miniprogram 组件总入口。
- 版本使用低干扰 PUI Tag，不修改 Navbar 双按钮和胶囊几何。
- 发版验证必须同时检查公开 version 与首页可见值。

验证与遗留风险：

- 验证：`npm run miniprogram:build`
- 验证：`node scripts/test-miniprogram-home.js`
- 验证：`微信开发者工具 build-npm：982ms，warnings=[]`
- 真机/兼容风险：iOS/Android 真机仍需确认版本 Tag 在系统字体缩放下不挤压品牌名或右侧标记。
- 真机/兼容风险：深色与全部外观组合下的 Tag 对比度仍需运行态复核。

## PUI-FB-0449 · 首页高级分区缺少语义标记且 premium 视觉基线偏低

- 原始记录：`feedback/records/pui-fb-0449-home-advanced-premium-icon.json`
- 范围：`component` / `miniprogram-home`、`icon`、`collapsible`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：在 index 首页“高级”文字右侧添加公开 PUI premium 图标，清楚表达高级组件分区。
- 实际问题：高级目录最初沿用 Collapsible 的纯文本默认 Trigger且 Icon Font 不公开 premium；首轮新增后父级 Flex 已正确居中，但 Lucide crown 的可见轮廓在自身 em 方框内偏下。
- 决策：新增稳定 premium Icon Font 名称，映射既有 Lucide crown，并为高级分区提供单一 hasPremiumIcon 数据标记；仅该标记启用 Collapsible trigger Slot，将无障碍隐藏的 30rpx 图标放在标题右侧。premium 在字体生成前独立应用 translate(0 -1.5)，通用 crown 和首页 CSS 不变。
- 理由：复用同一 Icon Font 和 Collapsible 公开 Slot可保持跨端资源、触发语义与目录结构同源；显式数据标记避免循环内表达式造成的 Slot 投射漂移。把光学校正放入 premium 语义字形可让小程序与 H5 所有调用一致，同时避免页面负 margin、相对定位或 transform 形成第二套不可追溯规则。

AI 必须遵守：

- 页面需要新图标名时先审计现有 catalog；不存在则在生成源建立稳定语义别名，不手写字符或 SVG。
- 首页分区局部标题组合优先使用 Collapsible trigger Slot，不复制 Trigger、开合和 ARIA。
- 新增公开 Icon 名称必须同步小程序字体、H5 catalog、合同、专项测试和生成物。
- 语义别名字形需要和特定文本场景对齐时，在唯一生成链中做可测试的独立光学校正；消费页面不得重复偏移。

验证与遗留风险：

- 验证：`npm run icons:generate 通过：生成 220 个图标、17 个分类与 22952B 本地 WOFF2；premium SVG 明确包含 translate(0 -1.5)，crown 保持无偏移。`
- 验证：`npm run site:build 与 npm run example:install 通过，均重新生成 71 个 miniprogram_dist 组件目录与图标产物。`
- 验证：`微信 CLI build-npm 通过：合法 AppID wx23aa017375535746，1036ms，warnings=[]。`
- 验证：`node scripts/test-icon.js、node scripts/test-icon-font-outlines.js、node scripts/test-miniprogram-home.js 均通过，锁定 premium 独立校正、crown 不变和首页禁止页面偏移。`
- 验证：`源码、miniprogram_dist、真实 miniprogram_npm 与 H5 preview 的 icon-font CSS SHA256 均为 5cfde3e0a042094e5aaf2ccef5595c38ba668929ab8c64a957b722eb8e1e84f7。`
- 验证：`npm run feedback:generate 与 npm run feedback:check 通过：完整 check 执行时为 434 条记录。`
- 验证：`npm run check 通过。`
- 验证：`npm run pack:check 通过：545 个文件，包大小 347.7kB；git diff --check 通过。`
- 真机/兼容风险：iOS/Android 真机仍需确认 30rpx premium 字体字形、系统字体缩放和 Collapsible Trigger 触摸命中。

## PUI-FB-0450 · Popup 内的 TopLoading 错贴在 Content 顶部

- 原始记录：`feedback/records/pui-fb-0450-popup-surface-top-loading-slot.json`
- 范围：`component` / `popup`、`top-loading`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：更新公告的顶部加载轨必须贴住 Popup 面板顶边，并成为可复用的组件级组合能力。
- 实际问题：TopLoading 被放进 Content，只能从 Content 内距后的顶部开始，和 Popup 顶边框之间存在明显距离。
- 决策：Popup 新增 surface-top Slot；Surface 统一提供相对定位和圆角裁切，TopLoading 状态仍由消费者真实请求控制。
- 理由：顶边反馈是独立 Surface 的可复用结构能力，不应依赖页面知道 Popup 的内部 padding 或圆角。

AI 必须遵守：

- Popup TopLoading 只能放入 surface-top Slot。
- Popup 负责定位和裁切，消费者负责真实加载状态。
- surface-top 不占布局高度，也不承接标题、操作栏或第二个 Surface。

验证与遗留风险：

- 验证：`node scripts/test-popup.js`
- 验证：`node scripts/test-miniprogram-me-page.js`
- 验证：`node scripts/test-top-loading.js`
- 验证：`npm run feedback:generate`
- 验证：`npm run feedback:check`
- 真机/兼容风险：iOS/Android 真机仍需确认具名 Slot 投影、4rpx 轨道抗锯齿、圆角裁切和请求快速完成时的动效。

## PUI-FB-0451 · 安装一级页需要由共享云驱动页面与未来 Skill 内容

- 原始记录：`feedback/records/pui-fb-0451-codex-cloud-driven-page-content.json`
- 范围：`component` / `miniprogram`、`tabbar`、`scroll-area`、`card`、`empty`、`loading`、`top-loading`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：让安装 Tabbar 页全部从云开发读取，建立可承载未来 Skill 的 pui-codepage 集合与字段合同；用户可见名称为“安装”，内部 route/data key 保持 codex。
- 实际问题：pui-codepage 与首条已发布 page 文档已创建，管理端写后按 _id 读回完整字段；用户可见名称已更新为“安装”，代码阅读区已使用 muted Token。集合设置为 READONLY 并完成权限传播后，调用方小程序同条件查询返回 1 条 title=安装，390px 真实页面展示两段云端代码和 Skill 空态。
- 决策：采用 pui-codepage 单集合的 kind=page 与 kind=skill 两类文档；客户端仅直连已授权共享环境并读取 published 内容。page 文档存放两个页面分区和 snippets，skill 文档预留 skillId、版本、能力、图标、安装代码与排序。用户可见名称固定为“安装”，内部 route/data key 继续使用 codex 以保持已有云端数据契约。共享 code-snippet 的代码阅读区使用 muted Token、语义小圆角和内容内距，避免正文与 Card 背景混在一起；浅色呈淡灰，深色自动跟随主题。集合使用 READONLY，管理端更新一律使用 $set 并写后读回，再由调用方小程序读取验收。
- 理由：页面正文与未来 Skill 可独立发布，仍由稳定的 pageKey/product/status 分区；不用本地 fallback 可避免把过期或假内容误报为云端同步。

AI 必须遵守：

- 所有 PoemUI 专属集合使用 pui_ 前缀，并以 product、pageKey、status 分区。
- 用户可见页面名使用“安装”；不要因为名称改动而更改稳定的 codex 路由、pageKey、组件 ID 或云端查询条件。
- 客户端只读取 published；draft 和 archived 既不展示，也不得作为本地回退。
- 未来 Skill 使用独立 kind=skill 文档，必须有稳定 skillId、name、summary；安装代码缺失时不渲染复制入口。
- 云端失败必须有 PUI Loading/Empty/Button 的真实恢复路径，用户文案不得暴露集合名、数据库错误或内部链接。
- 代码阅读底使用 --pui-bg-muted、--pui-radius-small 与 --pui-content-gap；不得写死浅灰色或为深色另建页面私有配色。
- 云端已发布文档更新必须使用 $set；写后先按 _id 验证完整字段，再以调用方小程序同条件查询验证客户端可读。
- 没有集合写后回读和小程序运行态 source=cloud 证据前，不得标记 resolved 或声称页面已云端同步。

验证与遗留风险：

- 验证：`node scripts/test-codex-page-cloud-service.js：通过。`
- 验证：`node scripts/test-miniprogram-tabbar-pages.js：通过。`
- 验证：`npm run feedback:generate && npm run feedback:check：通过。`
- 验证：`npm run check：通过。`
- 验证：`npm run pack:check：通过。`
- 验证：`git diff --check：通过。`
- 验证：`微信开发者工具 compile_wxml / compile_wxss：通过。`
- 验证：`cloud_db_read_doc requestId=f9a50101-4ed9-415d-b11b-29883ca13a35：完整 page 文档读回。`
- 验证：`微信开发者工具 automation_evaluate：调用方 published 查询 pui-codepage 返回 1 条，title=安装。`
- 真机/兼容风险：iOS/Android 真机的共享环境鉴权、弱网、字体、读屏、Tabbar 触摸和外观组合仍未验证。

## PUI-FB-0452 · 我的页资料版头不应重复展示昵称和编辑框

- 原始记录：`feedback/records/pui-fb-0452-me-profile-inline-nickname-editor.json`
- 范围：`component` / `miniprogram`、`tabbar`、`card`、`avatar`、`input`、`button`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：优化“我的”Tab 的版头，将昵称展示与编辑昵称合并为更紧凑、清晰的一组资料信息。
- 实际问题：静态昵称摘要与编辑 Input 分两行，造成重复信息与过高的资料版头。
- 决策：保留 Card、Avatar、Input、Input suffix IconButton 与 user-profile Store；删除静态昵称和身份副标题，改为 Avatar 左侧、带 label 的 Input 右侧的一行资料编辑布局。
- 理由：昵称是唯一资料字段，单一可编辑 Field 同时承担展示和编辑，减少高度并保留清晰字段语义。

AI 必须遵守：

- 页面资料行的 Avatar 只能展示，昵称编辑由唯一 PUI Input 承担。
- 保存必须继续通过 Input suffix Slot 的 PUI IconButton 触发既有 Store，不创建页面私有编辑机制。
- 资料行的 gap、宽度和文字均使用 PUI Token；编辑区必须可收缩，390px 不得横向溢出。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-me-page.js：通过。`
- 验证：`node scripts/test-miniprogram-tabbar-pages.js：通过。`
- 验证：`微信开发者工具 compile_wxml / compile_wxss：通过。`
- 真机/兼容风险：浅色 390px 模拟器已验证；深色、毛玻璃和大圆角组合仍需在本页运行验证。
- 真机/兼容风险：iOS/Android 真机的触摸、系统字体、中文输入法、键盘与读屏仍未验证。

## PUI-FB-0453 · 我的页服务 CellGroup 需要避让资料输入区的投影

- 原始记录：`feedback/records/pui-fb-0453-me-services-shadow-clearance.json`
- 范围：`component` / `miniprogram`、`card`、`input`、`cell`、`cell-group`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：将“我的”页的服务 Cell 卡片下移，为资料区在阴影外观下留下足够空间。
- 实际问题：服务区仅使用内容组合间距，不能表达相邻独立 Surface 的安全距离。
- 决策：保留正文的 --pui-section-gap，并将服务区自身 margin-top 从 --pui-content-gap 提升为 --pui-section-gap；两段标准 Token 间距共同避让投影，阴影关闭时也不收缩布局。
- 理由：资料编辑与服务入口是两个独立任务分区，使用已有 section Token 既避免阴影被覆盖，也不创建页面私有尺寸。

AI 必须遵守：

- 相邻独立任务分区优先使用 --pui-section-gap；--pui-content-gap 只用于同一分区内部组合。
- 阴影安全空间必须在 shadow 关闭时继续保留，不能依赖条件 margin。
- 连续 CellGroup 不拆成单行卡片，也不以页面私有 margin 修补投影。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-me-page.js：通过。`
- 验证：`node scripts/test-miniprogram-tabbar-pages.js：通过。`
- 验证：`微信开发者工具 compile_wxss：通过。`
- 真机/兼容风险：默认阴影 390px 模拟器已验证；深色、毛玻璃与大圆角组合仍需在本页运行验证。
- 真机/兼容风险：iOS/Android 真机的投影渲染、安全区与惯性滚动仍未验证。

## PUI-FB-0454 · 我的页客服入口应进入 Navbar 左 Slot

- 原始记录：`feedback/records/pui-fb-0454-me-contact-icon-button-placement.json`
- 范围：`component` / `miniprogram`、`button`、`icon`、`tabbar`
- 状态：`resolved`，用户验收：`pending-user`，更新：2026-07-27
- 用户目标：将“我的”页联系客服改成无灰底的低存在感圆形图标按钮，并放入 Navbar 最左侧公开 Slot。
- 实际问题：客服入口最初是 CellGroup 下方的满宽 base Button；首轮收敛后仍位于正文，不符合用户最终指定的 Navbar Slot 位置。
- 决策：删除正文客服节点和 me-page__contact 样式；在 pui-navbar 内投影 slot=left 的 PUI Button，使用 theme=default、variant=text、surface=transparent、size=small、shape=circle、icon=comment、iconOnly 与 open-type=contact。
- 理由：Navbar left Slot 能保留真实 PUI Button 及微信开放能力，并由组件按原生胶囊矩形提供对称镜像轨；right Slot 在 capsule=true 时不渲染，leftBtn 又不能透传 open-type，因此真实 left Slot 是唯一符合当前合同的组合。

AI 必须遵守：

- 微信客服必须保留 PUI Button openType=contact 与 error 回调，不得用普通点击或 Toast 伪造。
- 账户页低频客服入口使用 text/transparent/small/circle/iconOnly，不显示灰底、边框或外投影，并提供准确 ariaLabel。
- capsule=true 时客服按钮只能投影到 Navbar left Slot；right Slot 不渲染，leftBtn 也不能代替需要 openType 的真实 Button。
- 正文不得保留第二个客服节点或定位样式；按钮尺寸、圆形、图标居中由 PUI Button 合同负责，胶囊镜像位置由 Navbar 合同负责。

验证与遗留风险：

- 验证：`node scripts/test-miniprogram-me-page.js：通过。`
- 验证：`node scripts/test-navbar.js：通过。`
- 验证：`node scripts/test-miniprogram-tabbar-pages.js：通过。`
- 验证：`PUI-FB-0454 standalone validateFeedbackRecord：通过。`
- 验证：`本范围 git diff --check：通过。`
- 验证：`全局 feedback:generate/check 当前被范围外 PUI-FB-0451 的 cloud-read/runtime 非法 evidence kind 阻断；Slot 修改前同轮 436 条记录、site:build、example:install、check 与 545 文件 pack:check 曾通过，不能替代当前全局 Ledger 闭环。`
- 真机/兼容风险：微信客服会话依赖小程序后台客服配置；模拟器属性与点击不能替代 iOS/Android 真机进入、返回和失败回调验收。
- 真机/兼容风险：深色、毛玻璃、大圆角和等距组合仍需在我的页运行态确认按钮的低强调层级。

## PUI-FB-0455 · 公共发布准备需要真实快速开始、Beta 边界与 AI Skill

- 原始记录：`feedback/records/pui-fb-0455-public-beta-quick-start-ai-skill.json`
- 范围：`global` / `h5`、`miniprogram`、`npm`、`skill`、`documentation`
- 状态：`investigating`，用户验收：`accepted`，更新：2026-07-27
- 用户目标：把 PoemUI 从本地完成态推进到可公开验证的受限 Beta：H5 提供真实快速开始与 AI Skill，公告不混淆 MIT Core、未来 Pro、本地构建和公共发布。
- 实际问题：H5 快速开始、Beta 公告、标准 Skill、PoemCoder 落地页和独立 H5 公网容器已经完成并通过运行态验收；公共 npm、GitHub、云端 pui-codepage 写入、正式小程序码与真机仍保持明确未完成状态，页面不显示假成功。
- 决策：采用 MIT Core + 未来独立 Pro；H5 安装入口升级为快速开始；建立 poemui-miniprogram Skill 与两个只读验证脚本；npm/GitHub 未真实发布时禁用安装复制并显示尚未发布。
- 理由：将用户可执行动作绑定到 Registry、公开仓库、浏览器和微信运行态证据，既保留当前 Beta 的开放体验，也不追溯限制已经以 MIT 交付的代码。

AI 必须遵守：

- 公共 npm 未能通过 npm view 读取目标版本时，不展示可复制的 npm 安装动作。
- GitHub 未绑定远端和公开 clone 前，不展示 Skill 一键网络安装或声称源码已公开。
- Skill 从固定版本的包入口和组件合同工作，不复制会漂移的完整 API。
- 已经进入 MIT 根包的代码继续属于 MIT Core；未来 Pro 只包含独立发行的新能力。
- 快速开始的复制结果必须来自真实剪贴板成功或失败，并复用 PUI Button/Icon。
- H5、npm、GitHub、微信模拟器、真机和 Docker 公网发布分别验收，不能相互替代。

验证与遗留风险：

- 验证：`/tmp/poemui-skill-validator/bin/python /Users/fanx/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/poemui-miniprogram：通过。`
- 验证：`npm run site:build`
- 验证：`npm run check`
- 验证：`npm run pack:check`
- 验证：`npm run example:install`
- 验证：`/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project "/Users/fanx/Documents/poemUI 小程序组件库/miniprogram"：AppID wx23aa017375535746 通过，warnings=[]。`
- 验证：`miniprogram_dist、_example/node_modules 安装目录与真实 miniprogram_npm：540 个文件逐文件 SHA-256 一致。`
- 验证：`node skills/poemui-miniprogram/scripts/inspect-project.mjs .`
- 验证：`node skills/poemui-miniprogram/scripts/verify-install.mjs .`
- 真机/兼容风险：公共 npm 尚未登录和发布，Registry 安装链未验证。
- 真机/兼容风险：GitHub owner/repository 尚未确认，公开 clone、Tag、Release 和 Skill 网络安装未验证。
- 真机/兼容风险：_example 使用 touristappid，微信 CLI 返回 code 10，不存在此 AppID；真实 AppID 工程已通过，但游客安装示例未生成 miniprogram_npm。
- 真机/兼容风险：小程序 pui-codepage 云端更新仍等待数据库写操作确认，未把待确认任务报告成成功。
- 真机/兼容风险：正式小程序码、微信审核/发布以及 iOS/Android 真机的组件、Skill 指导产物和共享云安装页仍需发布版本复核。

