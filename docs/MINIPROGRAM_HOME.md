# PoemUI 真实微信小程序首页

当前实际工程是 `/Users/fanx/Documents/poemUI 小程序组件库/miniprogram`，AppID 为 `wx23aa017375535746`。页面只通过 `miniprogram/package.json` 的标准 npm 依赖消费 `poemui-miniprogram`，不复制 PUI 源码。

当前产品仅支持默认 WebView 渲染：`app.json` 不声明 `renderer: "skyline"`、`rendererOptions` 或 `componentFramework: "glass-easel"`。不要以 Skyline 的 CSS、GridView、宿主盒模型或真机行为作为本项目的实现与验收前提。

## 2026-07-26 当前搬迁状态

本节优先于本文后续的早期迁移记录：`miniprogram/app.json` 已登记 69 个稳定组件独立页和 5 个 `pages/guides/*` 规范页。首页目录包含“开始与规范、基础组件、浮层、布局、导航、表单组件、数据展示、反馈、高级”九分区，Search 从同一目录数据生成 74 条可导航候选；5 个规范候选以“规范 ·”前缀区别于组件。

- `ConfigProvider` 页根部使用唯一的 `visualConfig` Store，局部 Provider 只覆盖自身子树；不复制全局状态。
- `Form` 只报告本地校验，`Upload` 只回传微信本地文件选择结果；两者均不伪造发布、保存或服务器上传成功。
- `PullRefresh`、`VirtualList` 是页面滚动所有者；VirtualList 将真实剩余 px 高度换算为组件所需 rpx 数值，避免把 `604px` 这样的字符串传入 Number Prop。
- 分区合同位于 `docs/MINIPROGRAM_*_PAGES.md`，全量执行状态位于 `docs/MINIPROGRAM_REMAINING_SECTIONS_MIGRATION_PLAN.md`；390px 新页与 iOS/Android 真机仍须按 Ledger 中的 `deviceRisks` 实测，不能由 Node 测试替代。

## 原生分享

- 首页通过页面生命周期 `onShareAppMessage` 提供“发送给朋友”的分享卡片：标题固定为“Poem UI · 原生小程序组件库”，路径固定回 `/pages/index/index`，图片使用包内品牌图 `/assets/poemui-moon-lines-black.png`。它不写入外观、搜索词、当前浮层或 Tab 状态，接收者始终进入可恢复的首页。
- `index.json` 必须显式保留 `enableShareTimeline: true`，并由 `onShareTimeline` 提供同源标题和品牌图。分享只依赖微信系统菜单；不在首页增加第二个页面级分享按钮、分享成功 Toast 或前端统计伪闭环。
- 朋友圈入口和最终卡片样式取决于微信客户端、类目、基础库及上线配置；专项测试只锁定页面配置和返回载荷，不能替代真机发送。

首页采用固定三行布局：

- 第一行是非 fixed 的 `pui-navbar`。组件读取胶囊完整矩形、窗口宽度和状态栏高度，左侧搜索与外观菜单两个 `pui-button + pui-icon` 操作作为同一组位于胶囊宽度的镜像区域内；右侧仍不放业务内容。
- 中间唯一滚动上下文是 `pui-scroll-area`。页面运行时测量 Navbar、Tabbar 与窗口高度后回写有效 px 高度。
- 内容先以独立 `home-brand` 呈现白底、左文右标记的紧凑留白版头：左侧依次显示 `Poem UI / 月下成行 / 原生小程序组件库，按需组合。`，右侧以 `144rpx` `pui-image` 呈现从既有 `poemui-moon-lines-black.png` 明暗蒙版抠出的透明底黑/白完整 Logo。页面订阅 ConfigProvider 的实际主题事件，浅色读取黑标、深色和 `auto` 的实际深色状态读取白标，不依赖 CSS `filter`；品牌调用点以 Image 既有 `custom-style` 在其根内联清除默认的灰底和边框，不让页面样式隔离覆盖失效。版头上/下仅使用 `28rpx / 16rpx` 留白，描述与目录统计共用 `8rpx` 内容间距且统计不再额外顶距，为下方目录腾出空间，不改变 Navbar、ScrollArea、Collapsible、目录排序、Cell、两秒自动展开或搜索真相源。
- 首页初显保持全部目录收起；页面可见满 2 秒后自动展开“浮层”。若用户先手动切换任一分区，页面取消该自动动作，不覆盖用户当前选择；页面隐藏或卸载时也会取消未触发的定时器。
- 搜索过滤同一目录中的 69 个真实组件路由与 5 个规范路由；清空或关闭会恢复完整目录。
- 每条组件 Cell 显式显示 `chevron-right`，由 Cell 自身的 `url + jumpType=navigateTo` 执行真实导航，不在页面维护第二套点击跳转。
- 底部是非 fixed 的纯图标 `pui-tabbar`：使用组件原生 `normal + normal + split` 形态，全宽短横选中态和条目间微分隔均由组件负责。normal 是透明的屏幕附着导航布局，不带面板底色、阴影或毛玻璃；仅 round 是独立悬浮 Surface。四个真实目的地依次为首页、快速样式（`palette`）、Codex（`codex`）和我的；第二项是 `pages/styles/index`，第三项是 `pages/codex/index`，第四项 `pages/me/index` 组合 PUI 资料编辑、OpenID 复制与服务 Cell，不再使用空白占位壳。页面消费者继续通过 `change → wx.redirectTo` 路由，不让 Tabbar 组件承担自动导航。

## 快速样式第二 Tab

`pages/styles/index` 是真实小程序的 Style Utilities 入口，不复制官网 DOM 或 WXSS。Navbar 已承担“快速样式”唯一页面标题，因此内容区从 Tabs 直接开始；Tabs 内不再保留分类标题、说明、已选 class 或目录标题，只保留一个真实预览和无标题的当前分类目录。页面工作区固定在 Navbar 与 Tabbar 之间：`pui-tabs` Header 和预览都是该工作区内的 absolute 层，明确 `sticky=false`；唯一 `pui-scroll-area` 只承载目录。Tabs 显式 `swipeable=false`，避免横滑识别与目录纵向手势竞争。

`pages/codex/index` 是第三个一级目的地。页面使用 PUI ConfigProvider、Navbar、唯一 ScrollArea、Card、Button、Icon、Tabbar 与共享 Section 组合“快速开始 / 让你的 AI 懂得用它”两个分区。快速开始展示真实 npm 安装命令和最小页面引用，并由共享 `code-snippet` 组合 PUI Card、Icon 与圆形文字 Button 完成复制；只有代码横向阅读使用原生 `scroll-view`。SKILL 尚未交付时只保留 `SKILL` 留白和 `codex` 图标，不提供下载按钮、复制内容或假完成状态。

`pages/me/index` 是第四个一级目的地。页面使用 PUI ConfigProvider、Navbar、唯一 ScrollArea、Card、Avatar、Input、Button、Cell/CellGroup、Toast 与 Tabbar；昵称通过唯一 `user-profile` Store 本地持久化，OpenID 只读取真实登录链注入值，没有值时复制 Cell 保持禁用。隐私协议调用 `wx.openPrivacyContract`，关于诗上调用 `wx.navigateToMiniProgram` 打开正式版 `wxa1b9a4d6549c6cd1`。授权与订单尚无后端合同，因此只显示明确未开放反馈，不伪造支付、订单数据或路由。完整合同见 `docs/MINIPROGRAM_ME_PAGE.md`。

预览固定为 `120rpx` 高的透明单一当前效果条，目录以 `8rpx` 关联间距紧随其后并至少保留 `520rpx` 可视高度；预览和目录不建立第二层面板。预览右侧使用 `default / text / small / circle / icon-only` 的 PUI Refresh IconButton，只清空当前分类的选择，其余分类状态继续保留；恢复是低存在感的次要回退动作，不使用 primary 实底或常驻文案。页面只测量 Navbar、Tabbar 与 workspace，不查询或依赖会被 utility 改写的 preview DOM。`scripts/style-utilities-preview-schema.js` 为全部 562 个发布类生成 `previewKind / previewTarget / previewSafety / previewTheme / previewScaffold`，生成器同步输出小程序目录、`preview/style-utilities-data.js` 和 H5 scoped `preview/style-utilities.css`。运行时把选择结果分发到 `layout / item / target / media / measure / outer / surface / items / text` 九类适格目标；禁止把 width、height、position、display、overflow、theme 或 visibility 类挂到页面、Tabs、ScrollArea、当前效果容器或其他基础设施根。viewport、fixed、hidden、safe-area 等风险结果必须在当前效果条内裁切或留下可读 trace，不能逃出预览或制造空白。

当前分类目录固定为两列 selectable `pui-cell`，不显示 value、箭头或用途说明；相同语义类型按 `group:previewKind` 互斥，再点当前项取消，不同类型可以组合。五类固定为“布局、尺寸、间距、字体、背景”，目录与预览都由 `common/style/utilities.wxss` 生成，不能手写第二份分类真相源。Navbar 的 `leftBtn` 打开 PUI Search Overlay，`rightBtn` 打开与首页同合同的外观 Popup；Search 按 class 名和用途过滤，只更新分类与示例，不调用剪贴板或 Toast。

ScrollArea 与 BackTop 继续共同消费页面持有的唯一 `scrollTop`：真实 `scroll` 事件持续回写，达到 200px 后显示；点击 `to-top` 时写入 `0`，由唯一原生 `scroll-view` 的 `scroll-top + scroll-with-animation` 平滑回顶。用户切换分类 Tab 时，页面在替换 `visibleUtilities` 的同一次受控更新中也把该值写为 `0`，因此每个新分类都从首项开始；不重建 ScrollArea、不增加第二个滚动区，也不让 Tabs 反向持有滚动 API。目录 Slot 末尾继续预留渐变遮罩与底部 inset，保证最后一行 Cell 可完整滚入无遮罩区域。BackTop 使用 primary 圆形 `arrow-up` IconButton，并通过 `--pui-back-top-bottom-offset` 避开 Tabbar、安全区和操作间距。line 下划线锚在真实激活 Tab 项内；五项时 Tabs 在 390px 下显示四个完整项和第五项一半，四项及以下默认等分。

## 页面外观浮层

- 首页搜索保留受控 `pui-overlay`；首页与所有当前基础组件独立页的外观菜单都使用受控 `pui-popup`。首页打开任一入口会关闭另一个：搜索点击遮罩空白区关闭，外观 Popup 通过 `visible-change` 接收遮罩点击或自身关闭按钮的真实关闭请求。
- 外观 Popup 使用 `placement="bottom" + card=true + show-header + blur-overlay + prevent-scroll-through`；Card 形态只由 Popup 本身提供，内部不再嵌套第二张 Card。默认 Header 右侧关闭按钮常驻，左侧是 `theme="primary"` 的 `pui-button` `refresh` 纯图标重置按钮，恢复默认外观且不重复传入与 Slot 同名的 `close-btn` 属性。
- 外观控制统一使用共享 `miniprogram/components/appearance-settings`（内部组合 `pui-cell-group + pui-cell + pui-switch`），首页与详情页不再重复维护外观 WXML。边框、阴影、毛玻璃、大圆角、间距相等与深色直接写入 npm 入口的 `visualConfig` Store；每个页面根的 `use-global-config` Provider 订阅同一配置，因此不会维护页面私有的组件视觉状态。`visualConfig` 首次读取不到 `poemui-visual-config` 时使用公开默认配置，旧存储缺少 `equalSpacing` 时回退 `false`，后续每次写入和重置都会回写微信本地存储。
- “果味”不是独立保存字段：它由 `effectsEnabled + shadow + frostedGlass + largeRadius + bordered + 页面渐变` 的真实当前值推导，`equalSpacing` 不参与果味组合。开启写入 H5 同源的组合（阴影/毛玻璃/大圆角开、边框/渐变关），关闭恢复标准组合，深色主题与等距选择保持不变。
- 渐变明确不进入 `visualConfig` 或 ConfigProvider；全局开关由 `miniprogram/common/utils/page-background-preference.js` 持久化并作用首页与 Icon 页的页面背景，首次无存储时默认关闭。重置外观会同时写入 `gradient=false`，使用 `--pui-bg-page / --pui-bg-muted` 中性 Token；独立 `pui-bg-gradient-*` 不污染任何 PUI Component Surface。

## 早期组件独立页记录（历史）

下列十七个组件是第一批独立页；当前完整范围已在本文“2026-07-26 当前搬迁状态”说明。它们共同复用 `miniprogram/utils/component-page.js`、`miniprogram/styles/component-page.wxss`、`miniprogram/components/component-page-navbar/` 与 `miniprogram/components/component-page-section/`：

- 根布局只有 Navbar 与剩余高度 ScrollArea 两行；详情页不重复 Tabbar，也不创建原生 `scroll-view`。
- Navbar 保持与首页同一共享组件、原生胶囊几何和非 fixed 结构。所有当前详情页在同一胶囊镜像左轨内等分组合 PUI `chevron-left` 返回与 `menu` 外观入口；菜单由共享头部打开与首页同合同的外观 Popup。返回点击执行 `wx.navigateBack`，直接打开详情页时失败回退到真实首页路由；`capsule=true` 时右侧继续留给微信系统胶囊，不渲染自定义业务操作。
- ScrollArea 在 `show / ready / window resize` 时以窗口高度减去真实 Navbar 节点高度，回写有效 px 高度并填满全部宽度。
- 内容分区读取 H5 概览的组件语义：Button 为“基础用法 / 组件类型 / 组件状态 / 组件样式”，Divider 为“基础用法 / 文字与对齐 / 布局与线型”，Icon 为“基础用法 / 尺寸与颜色 / 图标资源”；反馈页分别提供最小真实入口与可观察结果，不把 H5 的工程诊断或属性面板搬进小程序。
- 每个独立页的内容分区必须使用 `component-page-section`，统一传入 `title / subtitle / description`，示例放在默认 Slot；不得重新手写 `section-header`。默认 `spacious` 消费 section/content Token，并以内容 Token 补足上下阅读空间；长目录可显式用同一组件的 `regular` 密度，不能另建页面私有标题样式。
- 全屏页面根只在 `miniprogram/app.wxss` 声明；被各详情页导入的 `component-page.wxss` 与共享分区组件不得使用 `page`、`:host` 等可能触发组件 WXSS 选择器警告的宿主/标签选择器。
- Button 的可用示例真实回写最近操作；Divider 组合真实 PUI Tag；Icon 使用 PUI Search 过滤 npm `icon-font-catalog` 的完整字体目录，按分类展示三列图标；每个图标使用 `56rpx`（相对原 `40rpx` 提升两个 `8rpx` 档位），下方完整显示图标名称。名称是唯一朗读文本，Icon 叶子保持无交互且不重复朗读；Navbar 菜单只控制页面外观，不改变图标目录或搜索状态。
- 首页目录的二十六项均使用 `pui-icon` 字体目录中的真实图标名；目录名称、简介、关键词与 URL 仅在 `miniprogram/pages/index/index.js` 的分区数据维护，Search 从该数据扁平化生成候选，禁止再建立平行搜索名单。

## 反馈分区独立页

反馈分区包含 `Alert / Empty / Loading / NoticeBar / Progress / Result / Skeleton / Toast` 八页，对应路由位于 `miniprogram/pages/components/<component>/index`。它们都使用同一 Navbar、外观 Popup、ConfigProvider 与唯一 ScrollArea；组件 API、动效、主题和外观仍来自 npm 包，页面只负责真实父级编排：

- Alert 关闭的 `change` 由页面受控回写，隐藏后提供重新显示入口；不把关闭解释为业务成功。
- Empty 的 `action` Slot 内 Button 只请求父级清除筛选；Loading 与 Skeleton 的显示状态由页面切换，不模拟网络成功。
- NoticeBar 的 `operation` click 由页面隐藏并可重新显示；Progress 只改变演示用确定值，未知进度仍使用 Loading。
- Result 的下一步使用页面真实 `navigateBack`；Toast 通过实例 `show(options)` 和 `close` 事件运行，自动关闭只表示提示结束。
- H5 已有八个同名组件镜像；小程序迁移不得复制 H5 组件树、属性面板或事件日志。两端必须继续使用各自组件合同、同名视觉 Token 与 `visualConfig`，并分别验收。

## 导航分区独立页

导航分区包含 `Navbar / NavigationMenu / Tabs / Breadcrumb / Tabbar / Steps / BackTop / Indexes / SideBar` 九页，对应路由位于 `miniprogram/pages/components/<component>/index`。首页目录与搜索候选均来自 `miniprogram/pages/index/index.js` 的同一份 `NAVIGATION_COMPONENTS`，路由由 `miniprogram/app.json` 显式登记，不使用查询参数拼装出第二套页面。

- 九页共同复用 `miniprogram/utils/component-page.js`、`component-page-navbar`、`component-page-section`、`pui-config-provider use-global-config` 和唯一 `pui-scroll-area`；页面适配层只承接组件公开 Props、事件回写和消费者内容。
- `Navbar` 展示左/右操作和受控显隐；`NavigationMenu` 展示可见、选中、展开、复选、单选和错误恢复；`Tabs` 同时锁定四项等分与超过四项的半露横向提示；`Breadcrumb` 展示受控当前位置、长路径和 retry；`Tabbar` 展示文案、Badge、纯图标、fixed/placeholder 与安全区。
- `Steps` 展示水平、纵向、完成和禁用边界；`BackTop` 将父级真实 ScrollArea 的 `scroll` 事件回写给组件，并由消费者调用 `scrollToTop`；`Indexes` 展示索引定位和错误重试；`SideBar` 展示左侧 value 与右侧消费者内容的真实联动。
- 页面不复制 H5 预览 DOM，不把事件日志或属性面板搬进小程序；错误态的 retry 只表示组件向父级请求恢复，不能被页面叙述为业务已成功。

导航页专项门禁：

```sh
node scripts/test-miniprogram-navigation-pages.js
node scripts/test-miniprogram-home.js
node scripts/test-miniprogram-component-pages.js
```

详情页专项门禁：

```sh
node scripts/test-miniprogram-component-pages.js
node scripts/test-miniprogram-feedback-pages.js
```

首页初次验收发现 Navbar 只保护了标题宽度，没有把左操作中心与原生胶囊对称，也没有使用胶囊纵向矩形计算内容高度；共享 Navbar 修复同步进入原生实现、H5 镜像、合同、专项测试、Ledger、dist 与安装产物。Search 验收另发现开发者工具自动化注入存在“状态/像素分裂”：AX 注值能过滤但不重绘，逐键事件能重绘但不触发小程序 input；因此只保留 Input 平台根与主题 Token 的证据化归一化，不以页面假文字或未证实的受控时序改动掩盖。首页不虚构第二套 H5 页面。

本页专项门禁：

```sh
node scripts/test-miniprogram-home.js
node scripts/test-miniprogram-tabbar-pages.js
node scripts/test-miniprogram-me-page.js
```

真实 npm 构建必须由微信开发者工具对该目录执行“构建 npm”；不得手工创建 `miniprogram/miniprogram_npm`。开发者工具与真机验证结果必须回写交接记录。

2026-07-24 开发者工具 RC 2.02.2607161 已对 `miniprogram/` 完成首次“构建 npm”，耗时 438 毫秒并生成真实 `miniprogram/miniprogram_npm`。首次模拟器验收随后发现 Navbar/搜索文字和任务图标问题，不能把该次编译视为最终通过。修复后关闭项目并从项目列表重新打开，运行 URL 已确认 `appid=wx23aa017375535746`；该身份下再次“构建 npm”完成，耗时 283 毫秒，并完成普通编译，iPhone 12/13 Pro 390px WebView 模拟器正常加载首页。

本轮模拟器已验证 Navbar 搜索按钮与系统胶囊不重叠且视觉中心对称、Search 展开/过滤/清空/关闭的真实状态链、Collapsible 展开收起、三个 Tabbar 图标与 disabled 项不切换。Search 的辅助功能注值与逐键输入仍受开发者工具自动化分裂限制，真实软键盘的“文字显示与过滤同时发生”必须保留到真机确认；当前内容未超过一屏，因此 ScrollArea 的唯一滚动结构与剩余高度测量已通过合同和布局验证，但没有用长内容完成真机惯性滚动。深色模式、全局外观组合、横竖屏重测、safe-area 与读屏也仍需真机最终确认。

2026-07-24 独立页面复验使用开发者工具 RC 2.02.2607161、合法 AppID 与 iPhone 12/13 Pro 390×844 模拟器：Cell 内部真实交互根进入 Button 路由，Navbar 返回进入首页；三个详情页 Navbar 均为 `390×88px`，ScrollArea 均为 `390×756px`，文档宽度均为 `390px`。Button 点击真实更新计数；Divider 挂载 2 个纵向 Divider、2 个虚线 Divider 和 4 个 Tag；Icon 搜索 `status` 得到 4 项，点击资源卡后真实回写“已复制图标名：check-circle”。Icon 页已验证 dark 与 shadow/frostedGlass/largeRadius/bordered=false 的 Provider 传递并恢复。Tag 挂载过程中发现并修复全量 observer 自触发循环；Button 实色主题中的黑色内置 Icon 对比度也在共享组合层修复。

2026-07-26 快速样式页在同一 `390×844` 开发者工具会话中以首页第二 Tab 进入，确认五项横向 Tabs、固定预览和其下唯一目录 ScrollArea 同时存在；点击“尺寸”会实时换成尺寸类目录，控制台为 `0 errors`。长目录惯性、BackTop 回顶与 iOS/Android 真机安全区仍未验证。

详情页 Navbar 已收敛为唯一的 `component-page-navbar`：当前二十六个组件路由只声明 `title + bind:back`，共享组件内部固定组合 `chevron-left` 返回、`menu` 外观入口和受控底部 Popup。新增详情页或调整 Navbar 时必须先扩展这一组件与专项测试，不得在页面重新手写 PUI Navbar、Button、Icon、Popup 或外观 Store 订阅。

2026-07-24 起，详情页正文也收敛为 `component-page-section`。这是一层透明的共享信息结构，不是新的 PUI Surface：Divider 的三段以默认宽松节奏增加上下留白，Button 同步复用，Icon 资源搜索区使用宽松节奏、长分类目录使用常规节奏。该修改只重组当前小程序页面，未改变任何共享 PUI API 或 H5 组件预览。

2026-07-25 图标目录的唯一生成源扩充为 17 个分类、209 个图标；其中 `components / 组件` 固定收录 `button`、`divider`、`icon`、`popup`、`popover`、`sheet`、`action-sheet`、`dropdown-menu`、`overlay` 九项。开发者工具 RC 2.02.2607161 已在 AppID `wx23aa017375535746` 下完成标准 `build-npm`（无 warnings），iPhone 12/13 Pro 390px WebView 实测此分类的 9 项三列 56rpx 网格、完整换行名称、首页→Icon→首页路由及浅深色图标可读性后恢复浅色。iOS/Android 真机仍需复核触摸、读屏、惯性滚动与 20rpx 浮层家族的最终辨识。

2026-07-26 当前图标目录继续由同一生成源扩充到 17 类、217 个图标。新批次不按组件名机械重画：Avatar/Card/Image/List/Collapse/Collapsible/Bubble/CountDown/Table 复用已有通用图标，Tag/Swiper/Direction 使用锁定版 Lucide 直接来源；Badge/Cell/SwipeCell/ScrollArea/Dialog 才进入 `components / 组件` 的专属减线几何，因此该分类现为 14 项。首页目录只引用真实 `icon-font-catalog` 名称；本轮开发者工具、390px 和真机结论必须以 2026-07-26 的后续验收记录为准。

2026-07-26 后续验收复用微信开发者工具 Stable v2.01.2510290 的现有会话，在 AppID `wx23aa017375535746`、iPhone 12/13 Pro `390px`、主 WebView 下重新编译并完成标准 `build-npm`（1380ms，`warnings: []`）。首页的数据展示、布局与反馈分区已实际滚动检查：新增的 Badge、Cell、SwipeCell、ScrollArea、Dialog 在 `20rpx` 目录尺寸可辨，点击 Dialog 可进入真实独立页并返回；Icon 页显示 `217` 个图标、`components 14`，三列 `56rpx` 网格名称完整换行且无横向溢出，浅深色 `currentColor` 均正常。运行面板为 `0 errors`，但已有“文章推荐”和环境噪音 warnings 没有伪装为零。H5 `#/icons` 也在真实 `390×844` 视口完成同一分类的三列、完整名称、浅深色与无横向溢出检查，控制台 `0 error / 0 warning`。iOS、Android 真机的字体抗锯齿、触摸、读屏和惯性滚动仍未验证。

## 2026-07-27 返回位置修缮

从首页进入组件页再返回时，当前页面实例必须保留 `pui-scroll-area` 的真实 `scrollTop`；已展开目录只在冷启动时提供锚点，不能覆盖用户离开前的阅读位置。实现与回归证据见 `miniprogram/pages/index/index.js`、`miniprogram/pages/index/index.wxml`、`scripts/test-miniprogram-home.js` 和 `PUI-FB-0422`。
