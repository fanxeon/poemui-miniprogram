# PoemUI 外观资格矩阵

本文是 `visualConfig` 外观开关在当前真实小程序组件树与 H5 镜像中的共享资格合同。70 个根组件来自 `miniprogram/**/*.wxml` 的真实 `<pui-*>` 标签；`Input` 现在既有独立页根，也继续作为 `Search`、`Combobox` 的嵌入式字段，因此保留组合规则约束唯一字段 Surface。

## 开关语义

| 字段 | 语义 |
| --- | --- |
| `effectsEnabled` | 总开关，只暂停 `shadow`、`frostedGlass`、`largeRadius` 的有效值；不改变主题、边框、等距或布局。重新开启恢复此前保存的单项值。 |
| `shadow` | 只有具备独立 Surface 的组件获得外投影；`none` 表示即使全局阴影开启也不得增加外投影。`edge-*` 表示阴影方向与附着边相反。 |
| `frostedGlass` | 只作用于组件自己拥有的可见 Surface 或遮罩，不给透明布局根、条目和图标叶子添加第二层背景。 |
| `largeRadius` | 只重映射组件实际消费的语义圆角；`round/circle` 等显式满圆形态不被改成圆角方块。 |
| `bordered` | 只透明化中性边界，保留盒模型、Divider、焦点、错误、选中和危险状态边界。 |
| `equalSpacing` | 只作用于具备分区职责的 Surface 的 inset、直接结构块 gap 和 Header/Content/Footer gap；不改变连续行、控件内部微间距和页面布局。 |
| `gradient` | 仅属于页面画布、Stage 和 PreviewDevice 背景；矩阵中的组件一律为 `false`。 |

## 70 个真实根组件

`阴影资格` 的值为 `none / card / floating / directional / edge-top / edge-bottom`。`边框`、`毛玻璃`、`大圆角`、`等距` 是该组件是否有资格消费对应开关，不表示开关默认值。

| 组件 | Surface 角色 | 阴影资格 | 边框 | 毛玻璃 | 大圆角 | 等距 | 渐变 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ActionSheet | 边缘附着 Surface | edge-bottom | ✓ | ✓ | ✓ | ✓ | — |
| Alert | 行内 Surface | none | ✓ | ✓ | ✓ | — | — |
| Badge | 展示叶子 | none | — | — | ✓ | — | — |
| Button | 控件 Surface | card | ✓ | ✓ | ✓ | — | — |
| Cell | 连续列表条目 | none | ✓ | — | ✓ | — | — |
| CellGroup | 集合根 | none | ✓ | — | ✓ | ✓ | — |
| Collapsible | 集合根 | none | ✓ | ✓ | ✓ | ✓ | — |
| Combobox | 锚定 Surface | floating | ✓ | ✓ | ✓ | ✓ | — |
| ConfigProvider | Token 边界 | none | — | — | — | — | — |
| Divider | 层级标记 | none | — | — | — | — | — |
| DropdownMenu | 锚定 Surface | floating | ✓ | ✓ | ✓ | ✓ | — |
| Empty | 内容状态 | none | — | — | ✓ | — | — |
| Icon | 展示叶子 | none | — | — | — | — | — |
| Image | 媒体叶子 | none | ✓ | — | ✓ | — | — |
| Loading | 展示叶子 | none | — | — | — | — | — |
| Navbar | 顶部附着 Surface | edge-top | ✓ | ✓ | — | — | — |
| NoticeBar | 行内 Surface | none | ✓ | ✓ | ✓ | — | — |
| Overlay | 遮罩 | none | — | ✓ | — | — | — |
| Popover | 锚定 Surface | floating | ✓ | ✓ | ✓ | ✓ | — |
| Popup | 脱离 Surface | directional | ✓ | ✓ | ✓ | ✓ | — |
| Progress | 内容状态 | none | — | — | — | — | — |
| Result | 内容状态 | none | — | — | ✓ | — | — |
| ScrollArea | 布局根 | none | — | — | — | — | — |
| Search | 组合字段 | card | ✓ | ✓ | ✓ | — | — |
| Sheet | 底部附着 Surface | edge-bottom | ✓ | ✓ | ✓ | ✓ | — |
| Skeleton | 内容状态 | none | — | — | ✓ | — | — |
| Switch | 控件叶子 | none | — | — | ✓ | — | — |
| Tabbar | 屏幕附着布局（normal） | none | ✓ | — | — | — | — |
| Tabs | 导航控件 | none | ✓ | — | ✓ | — | — |
| Tag | 展示叶子 | none | ✓ | ✓ | ✓ | — | — |
| Toast | 脱离 Surface | floating | ✓ | ✓ | ✓ | — | — |

下列 33 项由全量小程序迁移新增并已写入同一可执行矩阵。它们的逐项开关资格以 `scripts/appearance-contract-matrix.js` 为真源；此处记录角色分组，避免页面层以全局阴影或毛玻璃装饰布局根、条目和叶子。

| 角色 | 组件 | 外观边界 |
| --- | --- | --- |
| 布局根 | AspectRatio、Direction、Form、Field、Grid、CheckboxGroup、RadioGroup、PullRefresh、Sticky、Watermark | 不接受外投影、毛玻璃、边框、等距或页面渐变。 |
| 展示叶子 | Avatar、CountDown、Label、Rate、Slider | 不接受外投影；只有 Avatar 跟随语义大圆角。 |
| 字段与控件 | Input、InputOTP、Textarea、Select、Checkbox、Radio、Stepper | Input/Textarea/Select 作为字段 Surface 可以消费 card 阴影、毛玻璃、圆角与中性边框；其余控件不获得外投影。 |
| 集合与列表 | Calendar、Collapse、List、Table、Upload、VirtualList | 不获得外投影；可消费自身圆角、边框与等距，Calendar 还可消费自身毛玻璃 Surface。 |
| 脱离或消息 Surface | Card、Bubble、Dialog、Picker、DateTimePicker、Swiper | Card 可消费 card 阴影；Dialog 浮动阴影；Picker/DateTimePicker 方向性阴影；Bubble/Swiper 无外投影。 |
| 连续条目 | SwipeCell | 保留状态边界和语义圆角，不获得外投影或页面渐变。 |

## 嵌入式 Input 规则

`pui-input` 只在 `Search`、`Combobox` 内形成可见字段 Surface：字段消费全局圆角、阴影、毛玻璃和边框；复合根只负责排列和定位，不再叠加第二层 Surface。Stepper 等嵌入式 Input 必须保持透明，由外壳承担唯一 Surface。H5 必须调用 `inputControlSample`，小程序必须继续使用标准 npm 组件链路。

## 跨端实现约束

- 小程序 Token 真源是 `common/style/theme.wxss`；H5 镜像必须提供同名语义，方向性阴影使用 `--shadow-edge-top/bottom/left/right`，浮动面板使用 `--shadow-floating`。
- Image、Collapsible、Cell、Icon、Badge、Tag、Progress、Skeleton 等非独立 Surface 不得因阴影开关获得外投影；其中 Collapsible/Tag 可以保留自身透明度与毛玻璃背景语义，但不得因此获得外投影；状态 inset outline 和 Divider 不属于外投影。
- Navbar、Popup、Sheet、ActionSheet 的方向性阴影必须跟随真实附着边。Tabbar 的默认 `shape="normal"` 是透明屏幕附着布局，阴影与毛玻璃资格均为 `none`；只有 `shape="round"` 可按 `docs/components/TABBAR.md` 作为独立悬浮 Surface 消费 glass、floating shadow、frosted filter 与语义圆角。Tabbar 的 `split` 是 Divider 语义，不应因 `bordered=false` 消失。
- H5 的 `effectsEnabled=false` 只在 PreviewDevice 组件树上切换有效 Token，保留存储中的 `shadow/frost/radius` 原值；小程序由 ConfigProvider 的 `visualConfig` Store 执行同一有效值规则。
- 组件合同、专项测试、Ledger 和生成产物发生变化时，必须运行 `npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run example:install` 和 `npm run pack:check`。

可执行来源：`scripts/appearance-contract-matrix.js`；专项测试：`scripts/test-appearance-contract-matrix.js`。
