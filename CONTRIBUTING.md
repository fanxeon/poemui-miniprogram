# 参与 PoemUI 开发

PoemUI 的规范由“文档说明 + 自动合同 + 真实预览”共同约束。开始开发前请先阅读根目录 `AGENTS.md`；它同时是 Codex 等 AI 代理进入仓库时的强制工作说明。

任何组件修改前先检查 `docs/components/` 中的专属语义合同；尚无合同时必须先按 [组件语义合同模板](./docs/components/CONTRACT_TEMPLATE.md) 完成真实审计并建立合同。Dialog 的三区、Slot、间距、状态和预览边界以 [Dialog 组件语义合同](./docs/components/DIALOG.md) 为准；API 表仍以 `docs/COMPONENT_API.md` 为准。新 Agent 可直接使用 [新会话启动提示词](./docs/NEW_SESSION_PROMPT.md)。

## 开发流程

1. 完整阅读 `docs/COMPONENT_FEEDBACK.md`，并用 `npm run feedback:list -- --component <component-id>` 查询历史问题与决策；全局 UI 同时查询 `--scope global`。
2. 在 `metadata/components.js` 和现有目录中确认组件归属、中文名、路由与依赖。
3. 优先组合现有 PUI 组件，不复制演示专用的原生按钮、图标、输入框或弹层。
4. 使用 `common/style/theme.wxss` 与 `common/style/utilities.wxss` 中的 Token/工具类完成布局。
5. 官网预览必须调用同一套 PUI 语义和真实事件，不创建与小程序实现脱节的静态壳。
6. 发现可复现问题、重要设计决策、兼容风险或 AI 易误用点时，新增或更新 `feedback/records/*.json`；修复后运行 `npm run feedback:generate` 和 `npm run feedback:check`。
7. 修改规则或重要交互时同步更新对应文档和 `CHANGELOG.md`。`resolved` 不代表用户已验收，未经明确确认必须保持 `acceptance: pending-user`。

## UI 合同速查

- 间距与定位：`padding`、`margin`、`gap`、`top/right/bottom/left/inset` 使用 `--pui-space-*`、面板 Token 或组件命名变量。
- 圆角：使用 `--pui-radius-small/medium/large/xlarge/xxlarge/round`，不写固定值或 `50%`。
- 字号：小程序固定值不低于 `24rpx`，官网固定值不低于 `12px`。
- 字体族、字号、行高和字重必须使用 `--pui-font-*` / `--pui-line-height-*` Token；H5 按 `1px≈2rpx` 镜像同名 Token，不得维护独立数字或 Segoe 等页面私有字体栈。H5 代码通过本地 WOFF2 以独立族名 `PoemUI JetBrains Mono` 自托管 JetBrains Mono，小程序使用 Menlo / Consolas 系统回退；两端都由 `--pui-font-family-mono` 承接，源码阅读区关闭字体连字并使用 Body Medium `14px / 20px`。
- H5 新增 `var(--*)` 前必须确认 CSS 根、helper inline style 或 `setProperty` 有定义；无 fallback 的引用必须通过全样式表 Token 扫描，禁止用同值私有别名绕过现有语义 Token。
- 面板：正文有安全内距，不重复页面标题，不用无意义的面板套面板。
- 响应式：以 `390px` 为最低验收宽度，页面和设备预览不得横向溢出。
- 交互预览：PreviewDevice 外框高度稳定，内容内部滚动，连续点击不能撑大页面。
- 预览模式：常规模式保留真实交互；元素选择模式只选择语义元素并显示该元素相关的父组件公开 Props，不触发业务操作、不伪造子组件 Props，也不恢复常驻第三列 Inspector。选择模式空白区使用默认光标，可选择元素使用 `pointer`；不要使用代表坐标或像素拾取的 `crosshair`。
- 组件用法：常规模式左侧是单一可滚动正文，按“组件引用”小标题与 `usingComponents` 代码块、“基础用法”小标题与当前 WXML 代码块自然排列，不使用 Tabs，也不把两段做成独立滚动卡片。正文根透明、无边框、无圆角、无阴影、无毛玻璃和无 panel padding，并独占纵向滚动；代码块保留 PUI code Surface、行号、主题语法色、键盘焦点与必要的横向滚动。每段通过共享 `previewCodeBlockSample` 组合 PUI Copy IconButton，真实复制引用 JSON 或基础 WXML，并提供 Check/ErrorCircle 与 `aria-live` 反馈。两区与工具栏复制都必须复用 `makeUsageCode` 并过滤默认 Props，工具栏复制可以保留环境说明。开始标签按 `80` 字符软上限、每行最多 3 个属性成组换行。桌面把 PreviewDevice 对齐右侧站点 gutter，正文撑满左侧 gutter 到设备前的可用宽度，中间只留共享 14px offset，并与设备共同使用 622px 语义高度；`<=1180px` 时以左下满宽 240px 有界正文呈现。进入元素选择模式后手机恢复居中，正文让位给双侧 Inspector。两种模式只切换布局状态，必须复用同一个 PreviewDevice DOM 并以 normal/standard Token 平滑移动；不得为模式切换重建 Stage，低动效为 `1ms`。
- 窄于 `1180px` 的代码正文必须退出绝对定位，进入 PreviewDevice 下方正常文档流；不得覆盖设备或拦截设备交互。`240px` 仅限制代码正文，PreviewDevice 继续保持固定 `622px` 高度。
- 菜单与主题：机型选择、属性枚举和上下文 Inspector 必须调用同一个共享 PUI Select。可见 Trigger/Option/Menu 使用 PUI Button、PUI Icon 与 `surface/text/border` Token；原生 select 只保留为 `pui-sr-only + aria-hidden` 的值/事件桥接。所有 Menu、Popover、Dialog、Dropdown、Combobox 与站点菜单都必须在 light/dark 展开态检查计算样式；App Shell 和原生表单桥接节点必须同步 `color-scheme`，不得只验证关闭态或触发器。
- 预览工具栏：概览将模式切换放左侧，将机型、刷新、重置和复制放在同一透明工具栏的右侧并整组右对齐，复制当前组件效果代码固定在最右；顶部内距统一使用 `--pui-preview-content-gap`（8px）并计入工具栏语义高度，不用外层空容器补位。390px 允许换行但不改变右对齐。复制必须复用属性页的 WXML 生成器、只输出非默认 Props，并以注释说明视觉环境与临时运行态不进入复制代码。Header 只保留固定 `概览 / API / 属性` Tabs，属性重置留在 Props 标题区。页面 Tabs 固定三等分，只用 transform 移动选中块，不动画 left/width 或测量 DOM。
- Tabs 交互状态：页面分类 Tabs 只保留选中与 `focus-visible`，不提供视觉 Hover。Tabs Button 基础样式必须显式保持透明，避免通用 PUI Button Hover Surface 泄漏；不得新增 Tabs 私有 Hover Token 或选择器。
- 组件页 Header：删除分类 Kicker，只保留唯一标题、metadata 用户用途短摘要和 Tabs。摘要不超过 28 字符，不得用 text-cut 裁掉工程说明。Tabs 活动项必须使用主题感知的高对比选中态，并保留独立 `focus-visible`。
- 组件恢复：概览提供“刷新运行态”和“恢复组件默认值”两个独立动作，PROP 复用同一个恢复动作；恢复组件不得清空站点外观偏好。
- 全局视觉偏好：顶栏的详细设置只放一个调用 PUI Button + Palette Icon 的“外观”图标按钮，六项设置统一收进一个锚定菜单，不平铺占用导航空间。按钮左侧提供一个共享 PUI Switch“一键果味”：开启为阴影/毛玻璃/大圆角开、边框/渐变关，主题不变；关闭恢复标准组合。果味状态只由这五项实时推导，不新建本地字段，任一项被单独修改后立即显示关闭。菜单里的深浅色、边框、阴影、毛玻璃、大圆角和渐变背景继续使用 PUI Switch，并共同写入经过校验的本地偏好对象，刷新后逐项恢复；菜单支持 Esc、点击外部关闭、焦点恢复、低动效和 390px 边界。边框总开关默认开启，只控制 PreviewDevice 内真实 PUI 组件的中性边界；PreviewDevice 外框、API、属性、导航、工具栏和文档面板不受影响，焦点、错误、选中等状态边界继续保留。渐变仅改变中性背景画布。两者都不得影响组件布局或建立重复 Surface，显式实线样式复用 `pui-border-solid`。
- 安装端全局控制：消费者通过包入口的 `visualConfig` 维护唯一视觉配置，每个小程序页面根使用 `<pui-config-provider use-global-config>` 订阅。`effectsEnabled` 只总控 shadow/frostedGlass/largeRadius，theme 与 bordered 始终独立；渐变继续由消费者页面画布负责，不属于组件 Provider。
- 大圆角映射：必须重映射全部语义圆角 Token；Tag 等组件跟随自身语义层级，显式 `round/circle` 保持满圆。
- 间距层级：主要分区、面板/操作、列表、内容组合、控件内部、紧密信息依次使用 `36/28/20/16/12/8rpx` 的共享语义 Token。
- Dialog 操作区：左右、底部与按钮间共用 `--pui-dialog-action-spacing`；Header↔Content↔Footer 使用更高一级的 `--pui-dialog-section-spacing`。
- Dialog Header：固定为左图标按钮 Slot、中间标题、右 Close 三列；左右等宽，Close 使用圆形 PUI Button + PUI Icon 并留在 Header 正常文档流中。
- Dialog 状态：错误重试使用 Header 左轨的 `error-circle` 圆形 PUI IconButton，Content 不追加文字按钮；Dialog 自然增高至上限，只有 Content 可滚动，Header/Footer 始终可见。
- Slot：父组件只管理排列与 gap，不覆盖 Tag、Cell、Button 等子组件自己的 padding、尺寸和圆角。
- 官网导航：左侧固定使用“开始与规范、基础组件、布局、导航、表单组件、数据展示、反馈、浮层、高级”九组任务分类；表单组件内按结构与校验、文本与搜索、选择与数值整理，日期、时间和附件选择统一进入选择与数值；`Ctrl/⌘ + K` 快速搜索必须复用 PUI Input/Button/Icon，支持中文、英文、分类和完整键盘闭环。

完整规则见：

- [设计 Token](docs/DESIGN_TOKENS.md)
- [UI 设计与实现合同](docs/UI_DESIGN_CONTRACT.md)
- [间距规则](docs/SPACING.md)
- [排版规则](docs/TYPOGRAPHY.md)
- [工具类](docs/STYLE_UTILITIES.md)
- [预览信息层级](docs/PREVIEW_INFORMATION_HIERARCHY.md)
- [问题与决策收集规范](docs/COMPONENT_FEEDBACK.md)
- [问题与决策索引](docs/COMPONENT_FEEDBACK_LEDGER.md)

## 必须通过的检查

```bash
npm ci
npm run site:build
npm run check
npm run pack:check
```

`npm run check` 会扫描全部发布组件、生成器与官网预览。违反组件组合、最小字号、布局 Token、圆角、重复标题或专项状态事件合同的代码会直接失败。

不要直接编辑 `miniprogram_dist/`；它由 `npm run site:build` 从源码重新生成。
