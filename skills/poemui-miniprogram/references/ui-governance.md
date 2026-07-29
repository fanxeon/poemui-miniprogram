# UI 治理

## PoemUI 设计语言

PoemUI 以原生微信小程序为真相源，核心是：**中性画布、语义留白、单层 Surface、克制操作、真实状态**。

- 黑白中性色是品牌主轴，语义色只表达真实成功、警告、危险和信息；不把强调色、渐变或毛玻璃当作默认品牌表面。
- 以 `36 / 28 / 20 / 16 / 12 / 8rpx` 的语义层级组织节奏；圆角、阴影和边界表达结构资格，不用于装饰每一个节点。
- 连续内容保持连续，独立操作和浮层才增加视觉重量；默认操作低存在感，Primary/Danger 只在真实动作层级中强调。
- 页面标题只出现一次，文字层级依靠字号、行高和内容职责建立；`24rpx` 是可读文字下限。
- 用户已能直接看到的选中、展开、切换和关闭不追加重复 Toast；错误就近、短反馈用 Toast、重要异步状态使用更持久的反馈组件。
- H5 只镜像小程序已确认的用户语义、结构和 Token，绝不反向决定小程序实现。

## Surface 与间距

- 一个可见容器必须有明确的布局、分组或交互职责；删除无职责 wrapper，避免面板套面板、卡片套卡片和重复标题。
- 阴影仅授予脱离内容流的独立 Surface：Card、Popup、Sheet、ActionSheet、Popover、Dropdown、NavigationMenu 和展开面板。Cell、Field、Empty、Result、Grid、Steps、Avatar、Tag、Badge、Icon、Progress、Skeleton 与 PreviewDevice 不因外观开关获得外投影。
- `equalSpacing` 只作用于独立 Surface：同一 Surface 的四向 inset、直接结构块 gap、Header/Content/Footer 分区 gap 共同等于该 Surface inset。不要覆写 `--pui-space-*`、`--pui-content-gap` 或 `--pui-section-gap`；为 Surface 新增语义别名。
- CellGroup/List/表格等连续集合维持集合根和行节奏，不拆成大间距卡片。控件内部微间距与展示叶子不受等距模式污染。

## 外观与 Token

- `visualConfig` 公共字段仅为 `theme / effectsEnabled / shadow / frostedGlass / largeRadius / bordered / equalSpacing`，写入只走 `restore / set / applyPreset / setEffectsEnabled / reset / subscribe`。
- `effectsEnabled=false` 仅暂停阴影、毛玻璃和大圆角；不改变主题、边框或等距。渐变是页面画布偏好，不写入 `visualConfig`。
- 每个页面根挂 ConfigProvider；H5 App Shell 同步 `data-theme / shadow / frost / radius / border / spacing`，并让真实镜像组件消费同名 Token。
- `bordered=false` 只透明化中性 Surface 边界；保留盒模型、分隔线、焦点、错误、选中和危险状态。大圆角重映射全部语义 radius，显式圆形保持圆形。

## 组件级交互规则

- Input/textarea 不得因父级同步而一聚焦即失焦；clear 默认只在 focus 内出现，suffix action 通过公开 slot/API 组合紧凑 PUI IconButton，阴影跟随 Provider。
- Navbar 按真实小程序胶囊安全区排版。独立双按钮直接公开 `bind:leftBtn` / `bind:rightBtn`，不要依赖 Slot 冒泡猜来源；需要 `open-type` 的能力仍使用真实 Button slot。
- Tabbar 所有未激活项保持透明；纯图标项和带文案项分别使用组件语义的 indicator 几何，不能由页面单独偏移。
- Overlay 默认半透明；有效 blur 是局部 `blur=true` 与 Provider `frostedGlass=true` 的并集。局部 API 不被全局配置抹掉。
- Popup/Sheet/Dialog 等浮层是单一 Surface，Header/Content/Footer 同层，Content 是唯一垂直滚动区；Header 关闭操作留在 Header，Footer 操作保留完整宽度与分区节奏。

## H5 与预览

- 普通组件使用 `shadow-safe`，屏幕附着/浮层用 `edge-to-edge`。PreviewDevice 只承载屏幕边界与裁切，不成为第二个 Surface。
- H5 页面、预览和复合层通过共享 Button/Input/Icon/Loading/Empty helper 组合 PUI；真实组件样式和状态写在组件镜像而不是页面补丁。
- 390px、深浅色、边框、阴影、毛玻璃、大圆角、等距和低动效都必须保持可读、可点、无横向溢出。需要几何结论时测量代表 Surface 的真实边界和 gap。

更多组件细节以 `docs/COMPONENT_RULES_INDEX.md`、专属合同和原始 Ledger 为准；本资料不替代它们。
