# Tabs 组件语义合同

本文是 PoemUI Tabs 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component tabs`

当前对照基线为 TDesign Miniprogram 1.15.3 的 Tabs / TabPanel 文档与 npm 源码。参考不等于复制；Props、Events 与 Slot 的完整清单以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- Tabs 解决同一信息层级中少量内容分类的切换，不承担页面主导航、底部应用导航或内容请求状态。
- 页面主导航使用 Navbar，应用底部导航使用 Tabbar；大量筛选条件应使用 Select、Sidebar 或 DropdownMenu。
- Tabs 不内置 loading、empty、error、retry；当前面板的业务状态由消费者组合 PUI Loading、Empty、Button、Result 等真实组件处理。

## 2. 固定结构与区域

```text
Tabs region
├─ Header(optional sticky)
│  └─ horizontal ScrollView
│     └─ TabList
│        ├─ Tab × n(PUI Button + optional Icon/Badge)
│        └─ active Tab Indicator
└─ TabPanel(default Slot, always mounted)
```

- Header、TabList 与默认 TabPanel 固定存在；空 items 不生成假 Tab，也不把面板替换成私有空状态。
- 当前 line Tab 的 Indicator 直接作为激活项的视觉子元素定位；`showBottomLine=false` 不渲染该标记，也不改变 Header 高度。
- Tab 数量 `≤4` 时，`spaceEvenly` 默认/传入 `true` 使用等分轨道：每项可收缩，只有文字可省略；传入 `false` 可改为横向阅读。Tab 数量 `>4` 时始终使用内部横向半露轨道：每项固定为可视宽度的 `22.222222%`，故意显示四个完整项加第五项的一半，提示用户还能向右浏览；`spaceEvenly` 不再覆盖这个可发现性规则。所有横滚只发生在组件内部 ScrollView。

## 3. PUI 组合与依赖

- 每个 Tab 必须组合 PUI Button 并传入 `block`，让真实点击根严格填满当前轨道；item.icon 使用 PUI Icon，item.badge 使用 PUI Badge，`badge=0` 必须保留。Badge 必须是标签文字后的独立、不收缩单元，只有标签文字可省略；不得让 Badge 包住整段标签并以绝对定位越出再被 Tab、Button 或 PreviewDevice 裁掉。
- WXML 与 H5 都不得手写另一套 Button、Badge、Icon 或字符图标；H5 必须调用 `buttonSample.defaultSlot`、`iconComponent` 和 `badgeSample`。
- ScrollView 与触摸区属于 Tabs 自身底层能力，可以使用平台原生节点；不能为消除原生根再套一层 PUI Button。

## 4. Token、间距与排版

- Header Surface、边界、阴影、毛玻璃、文字、禁用色、圆角和间距必须使用 PUI Token；H5 按 `1px≈2rpx` 镜像。
- 四项及以下的显式横向阅读轨道使用内部 `--pui-tabs-scroll-item-min-width`（默认 `160rpx`）；它表达可发现性的最小项宽，不是页面私有宽度，也不参与 equalSpacing。超过四项使用固定 `22.222222%` 的 4.5 轨道；tag 同时取消轨道 gap，确保第五项恰好半露。H5 同义 Token 为 `--pui-tabs-preview-scroll-item-min-width: 80px`。
- 默认 Tab 高度为 96rpx / 48px；tag 为 64rpx / 32px。line Indicator 固定 32rpx / 16px、6rpx / 3px 高；tag Indicator 按当前 Tab 实宽减 16rpx / 8px。
- Content 区域最小高度为 48rpx / 24px，顶部间距使用 `space-sm`（12rpx / 6px），避免在 390px 窄屏下占用过多空间。
- 默认 line Header 是平面内容 Surface：保留底线与分隔，不使用外阴影或毛玻璃；当前项使用 PUI brand 色。tag Header 透明，标签自身使用次级 Surface 与 brand-light 当前态，避免形成第二层卡片。
- 动效固定为 `500ms + --pui-ease-standard`；`reduceMotion=true` 和系统低动效压缩为 1ms，不公开 duration/easing/indicatorWidth/indicatorColor 私有调参。
- Tab 文案允许单行省略，因为它是可重复识别的次要导航标签；图标与 Badge 不允许因文案省略、禁用态或通用 Button 裁切规则缺失。API 表格、事件 detail 和面板业务正文禁止省略。

## 5. 内容、Slot 与组合边界

- 只公开 default Slot，承载当前 TabPanel；消费者根据 value 或自身业务状态渲染真实内容。
- item 的 label/icon/badge/disabled 属于导航数据，不为每项建立动态 Slot 或 TabPanel 子组件 relation。
- 不公开 prefix/extra Slot 和对应布尔开关；额外页面操作应放在 Tabs 外部的 Navbar、Cell、ButtonGroup 等明确区域。

## 6. 状态与优先级

- Tabs 自身只有正常、活动和单项禁用状态；没有根级 disabled、readonly、loading、empty、error 或 retry。
- items 为空、全部禁用、受控 value 未命中时保持无活动项；不选择禁用项、不回退到不存在的值。
- 内容面板状态与 Tabs 选择互不覆盖。失败重试由面板消费者发起并真实更新业务数据，不由 Tabs 伪造恢复。

## 7. 交互、受控边界与事件

- `value !== null/undefined` 为受控模式；点击或 swipe 只发布 change，父级回写前不改变活动项。退出受控时延续最后已渲染值。
- 非受控模式只在首次使用 defaultValue；值无匹配时选择第一个可用项，全禁用时保持 null。
- value 使用严格原始值比较；数字 `0`、字符串 `'0'`、`false` 与空字符串必须互不碰撞。
- 点击可用项先发布 click；不同值紧接 change。重复点击当前项只发布 click。swipe 只发布 change，source 为 swipe。
- swipe 使用固定 72rpx 水平阈值，必须大于垂直位移，跳过禁用项且不首尾循环；touchcancel/pointercancel 必须清理手势。
- 不公开 input、retry、animationend 或实例方法；受控 value 已能表达所有真实切换请求。

## 8. 可访问性

- 根使用 region，内部使用 tablist/tab/tabpanel；每项同步 aria-selected/aria-disabled，区域名称按 ariaLabel > “选项卡”回退。
- H5 Tab 按钮支持 Enter/Space，并将事件 source 标记为 keyboard；禁用项不可触发 click/change。
- 当前项、禁用项和焦点不能只靠颜色区分；高对比指示器与 `focus-visible` 必须保留。

## 9. H5 预览与跨端一致性

- 小程序 line Indicator 直接挂在真实激活 Tab 项内，以该项自身中心定位；不使用 ScrollView 的视觉坐标、百分比轨道推算或 SelectorQuery。H5 保持其既有 DOM 布局镜像；内容区用 Pointer Events 镜像微信 touch。
- 概览固定分为“基础用法 / 标签样式 / 徽标与禁用 / 可横向浏览”，每个真实 Tab 都调用共享 PUI helper；基础用法只呈现文字分类，图标和徽标留在专门分区。
- 当前 Props 作用于基础用法；其他分区是可真实点击的固定合同样例。基础 WXML 零 `bind:*`，Events 只在 API 展示。
- 标准 Tabs 页面使用 `shadow-safe` PreviewDevice 父布局；组件自身 Surface 阴影由统一 28px 安全区承接，不增加页面私有 margin。
- H5 的 Pointer Events、overflow 滚动和 sticky 只是能力镜像；微信 ScrollView 惯性、SelectorQuery 时序、rpx 与触摸反馈必须真机复核。

## 10. 响应式、主题与视觉配置

- 390px 下 TabList 只允许组件内部横向滚动，禁止页面级横向溢出；超过四项时必须稳定保留四个完整项和第五项的一半作为继续浏览提示，不能用页面私有箭头或把剩余分类完全藏住。内容面板和分区标题自然换行。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变背景下，Header 与 Panel 必须保持单一 Surface 层级。
- 边框关闭只透明化中性 Header 底线和分隔线；阴影、毛玻璃、大圆角开关不得改变 Tab 高度、Indicator 锚点或 ScrollView 宽度。
- tag 跟随语义圆角 Token；line Header 和内容不能因大圆角开关变成不连续的卡片套卡片。

## 11. TDesign 取舍与明确禁止

- 保留 TDesign 1.15.3 的 value/defaultValue、showBottomLine、spaceEvenly、split、sticky、swipeable 主干；`spaceEvenly=true`、`split=true` 与 96rpx line Header 对齐其默认阅读结构。PoemUI 额外把等分规则约束为最多四项，超过四项固定 4.5 轨道以提供横滚可发现性；用 items 合并 TabPanel 的 label/value/icon/badge/disabled 数据。
- PoemUI 保留 line/tag 两种克制变体，不照搬 card，也不暴露 animation、bottomLineMode、stickyProps 对象；现有 Token 与 stickyOffset 已能真实闭环。历史 `pills` 输入只在运行时映射到 `tag`，不再作为公开选项。
- 禁止恢复 `size/scrollable/indicatorColor/indicatorWidth/swipeThreshold/loop/showContent/customPrefix/customExtra/disabled/loading/loadingText/error/errorText/retryText/emptyText/duration/easing`。
- 禁止恢复 `input/retry/animationend`、`select()/next()/prev()/scrollToActive()`，或以方法绕过受控 value。
- 禁止 fake success、私有状态卡、通过 ScrollView 坐标推算 Indicator、`display:none` 瞬移、`height:auto` transition 和超过 500ms 的动效。

## 12. 修改闭环

1. 同步审计 `tabs/`、PUI Button/Badge/Icon、`index.js`、metadata、H5、Props、WXML、API、兼容说明、`_example`、`miniprogram_dist` 与 npm/微信安装产物。
2. 运行 `node scripts/test-tabs.js`、组合几何/原生控件边界/组件合同、`npm run site:build`、`npm run check` 和 `npm run pack:check`。
3. 浏览器真实点击、键盘和 Pointer swipe，验证受控父级回写、非受控连续性、0/`'0'`/false/空字符串、禁用跳过、自动横滚、line/tag、500/1ms、390px、light/dark 和全部视觉开关。
4. 产物变化后运行 `npm run example:install` 并校验源码、dist、示例安装与 tarball；微信 CLI 失败时保留 `pending-cli`，不得手工冒充成功。
5. 新事实写入 Tabs Feedback Ledger；用户已授权本 Goal 后续组件由 Agent 在完整证据后自主验收。

真机仍需复核微信 ScrollView 横向惯性、sticky、rpx 指示器、触摸取消、样式隔离、系统低动效和目标基础库 ARIA 支持。任何不能满足本文的实现必须写入 Ledger，不得静默绕过。
