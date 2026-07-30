# Changelog

## Unreleased

- 暂无。

## 0.1.4

- 修复 ActionSheet、PullRefresh、DropdownMenu 的 ConfigProvider 主题继承，Rate 默认激活色改用 warning 语义 Token。
- PullRefresh 的 H5 根与内容轨恢复为透明布局层；修复浮层阴影 Token 的晚绑定，使 H5 `data-shadow` 开关落到真实计算样式。
- 新增 DonutChart 与 RadarChart：小程序 Canvas 2D、H5 SVG、结构化数据、渐变配色、无障碍摘要和默认开启的可重播入场动画。
- 新增 SortableList：连续集合 Surface、拖拽手柄、禁用项、边缘自动滚动、父级受控回写，以及 H5 Pointer/键盘镜像。
- 新增 Tour：目标测量、四向遮罩、自动位置、步骤控制、错误关闭与焦点恢复，并同步全局阴影、毛玻璃、边框、大圆角和等距语义。
- 组件总数从 74 增至 78；包内开发版公告、Me 分类增量图表、目录、搜索、独立页、Starter Usage、组件合同和 H5 页面同步。
- npm 包、PoemUI Skill、官网快速开始、H5 更新公告和 GitHub 发布口径统一为 `0.1.4`。

## 0.1.3

- 将完整 `poemui-miniprogram` Skill 纳入 npm 包，组件安装版本、AI 使用合同和 GitHub 固定版本目录保持一致。
- 扩充 Skill 的小程序优先治理：补齐 API 准入、默认态质量、职责与状态资格、单一 Surface/滚动/焦点所有权、删除闭环和证据等级门禁。
- 组件版本真相源增加 `0.1.3=74` 里程碑；本版不伪造新增组件，Me BarChart 与更新公告明确展示 0 组件增量。
- 官网、产品落地页、小程序安装页、共享云 Skill 与更新公告统一使用固定 `0.1.3` 口径。

## 0.1.2

- 为 74 个公开组件新增统一 Starter Usage：官网常规模式与生成文档共用可复制的 `page.json / page.wxml / page.js` 最小示例；运行时安全默认、H5 当前效果和小程序独立组件页保持分层。Popup 开箱示例固定为 `<pui-popup visible="{{true}}" content="Popup 内容" />`。
- 新增 `AreaChart`、`BarChart` 与 `Waffle` 三项高级图表；小程序与 H5 共用数据、主题渐变、零基线和可重播入场语义。
- 修正 Navbar、Sticky、NavigationMenu、Breadcrumb、Tabs、Tabbar、Steps 与 Indexes 的锚点、宽度、滚动和选中状态。
- 完善 Picker、DateTimePicker、Select、Field、Input、Search、Stepper 与 Textarea 的 Header、圆角、间距、实机布局和受控输入稳定性。
- 为 Avatar、Image、List、Card、Bubble、SwipeCell、CountDown、Skeleton、NoticeBar、Dialog 与 DynamicMessage 补齐加载、菜单、动画、遮罩和恢复闭环。
- 安装页改为云端读取；“我的”页使用 AreaChart 展示公开 `0.1.0` 的 71 个组件到 `0.1.2` 的 74 个组件，并在图表上方展示组件、样式与高级组件真实数量。
- 小程序首页保持返回滚动位置，展开分区跟随全局外观，高级分区增加 Premium 图标；组件详情页增加真实反馈入口。
- `v0.1.2` 更新公告同步包内回退与共享云稳定文档；本版本直接从公共 `0.1.0` 升级，不伪造未发布的 `0.1.1` npm 版本。

- Textarea 删除输入区内置 Clear，公开合同收敛为 29 Props、6 Events、3 Slots、3 Methods；逻辑 innerValue 与原生 renderValue 分离，匹配当前草稿的父级 value echo 不再二次重绑原生 textarea，真正不同的外部 value 才覆盖输入。业务清空由父级显式写回受控 value。

- 2026-07-27：Style Utilities 从 530 扩展到 562 个选择器，新增 32 个精选色彩 utility。red、orange、amber、emerald、teal、blue、violet、pink 各提供文字、实色背景、柔和背景和边框四种直接 class；浅深色分别读取 Theme Token。H5 Color 增加 Accent 色板并从生成数据注入同名变量，不维护第二份色值。实色背景不隐式设置文字色，精选色不替代 success/warning/danger/info 业务语义。

- 2026-07-25：修复 Icon Font 闭口圆形被填成实心的问题。生成器改用 nonzero 轮廓绕向，并在导出前归一化完整 360 度 Arc；当前 59 个圆环、头像头部和轨道节点恢复镂空，24 个省略号、Radio 中心点与锚点等语义点继续实心。新增全量轮廓拓扑门禁，H5 与小程序仍消费同一 WOFF2。

- 2026-07-25：`pui-icon` 全部 209 个 `name` 在 H5 与小程序统一为真实离线 Icon Font。唯一生成链路将 PoemUI Roundline 描边纯矢量展开为 1024 UPM WOFF2，并生成稳定 PUA 码点、`icon-font-map.js`、`icon-font-catalog.js` 以及跨端逐字节一致的字体 CSS。旧 `icon-map.js`、H5 inline SVG/CSS mask/image、小程序 image/Canvas 与 `src` API 已全部移除；业务图片改用 `pui-image`。颜色直接使用 `currentColor`，支持 `var(--pui-*)` 和深浅色 Token。

- 2026-07-23：官网 favicon 更新为“月下成行”双弧月牙与三行诗句；新增深浅色 SVG favicon 与多尺寸 ICO 回退，浏览器标签、收藏和直接 `/favicon.ico` 请求不再退回通用图标。

- 2026-07-23：Navbar 新增默认 `capsule`。在微信 `navigationStyle: "custom"` 页面中，组件通过 `wx.getMenuButtonBoundingClientRect()` 与窗口宽度给原生右上胶囊留出对称安全轨；PUI 不重复绘制或绑定系统胶囊，默认也不再在右侧放置业务操作。H5 以不可交互、无障碍隐藏的 Token 化胶囊镜像保持几何对齐；仅显式 `capsule=false` 才恢复 `right` Slot。

- 2026-07-22：ScrollArea 新增默认开启的 `gradient-overlay` 与可选 `gradient-overlay-color`，并新增 `gradient-overlay-size="sm|md|lg"`。真实滚动视口的顶部使用“容器色 → 透明”、底部使用“透明 → 容器色”的无交互固定渐变；既有 `64rpx / 32px` 归为默认 `md`，另有 `sm=40rpx / 20px` 与 `lg=88rpx / 44px`。空值和非法色跟随深浅色容器，非法尺寸回退 `md`，透明根、唯一滚动上下文和 Slot 交互边界不变。

- 2026-07-22：标准组件概览维持统一的 622px PreviewDevice，但所有组件预览根现在填满设备内部 viewport：普通组件填满 shadow-safe 可用高度，屏幕附着组件 edge-to-edge 铺满完整 viewport。ScrollArea 概览同步改用填满普通可用高度的非默认演示值，组件内部仍只在唯一 PreviewDevice viewport 滚动。

- 2026-07-22：ScrollArea 官网概览与生成 WXML 现共用 18 项真实 PUI Cell Slot 内容，`1128rpx`（H5 564px）预览区填满 shadow-safe 可用高度并保留真实滚动；移除 API 示例中的伪构建状态，不扩张 ScrollArea 的公开能力。

- 2026-07-22：Popup 新增 `card` 与 `blur-overlay`。`card` 默认 `true`，保留原有左右/底部 12px 卡片安全留白；设为 `false` 后按 top、bottom、left、right、center 五个方向真实贴合对应屏幕边缘，仍保留 Header/Content/Footer 内部间距。`blur-overlay` 默认 `false`，开启时仅对已渲染遮罩应用 `--pui-popup-overlay-blur`（H5 为 `blur(10px)`），不借用全局毛玻璃开关。元素选择模式点选“打开弹层”会直接显示 `card / placement / showOverlay / blurOverlay`，点选遮罩也显示 `blurOverlay`，并与完整 Props 同源回写。官网属性、WXML、API、专项测试、跨端 Token、安装产物和 Ledger `PUI-FB-0213` 已同步。

- 2026-07-22：修复 Popup 官网预览用 `renderStage()` 替换 Overlay/Surface 节点、导致 500ms 动效瞬间跳到终态的问题。进入与离开现在保留同一节点并仅切换生命周期 class，离场完成后才卸载；390px 真实点击已采到连续 opacity/translate 中间帧与遮罩关闭链路，新增专项测试并登记 PUI-FB-0212。

- 2026-07-22：建立全局动效唯一合同：交互进入、离开、位移和状态切换默认 500ms，公开范围 0–1000ms，非法值回退 500ms，低动效为 1ms，退场节点保留到完成；功能停留、延迟、轮播和刷新计时保持各自业务语义。同步跨端 Token、组件源码与产物、官网镜像、API/专属合同和专项扫描，登记 PUI-FB-0211。

- 官网品牌“月下成行”精修月牙：以更均衡的偏移双弧与月下留白，强化诗句停顿；三行圆线、黑白扁平 Token、Topbar 文案与无障碍名称保持不变。

- 2026-07-20：修复 ButtonGroup 与 AspectRatio 的真实预览偏差。ButtonGroup 的 `block` 默认值同步为 `true`，原生与 H5 都以全宽连续集合呈现，唯一组根承接阴影，直接 PUI Button 保持零间距、零圆角和零阴影；AspectRatio 删除 `clipped content` 工程诊断、修正四档圆角镜像，仍保留真实的百分比比例布局能力。新增 `BUTTON-GROUP.md`、`ASPECT-RATIO.md`、`DIRECTION.md` 与专项测试，更新 PUI-FB-0194/0195。`feedback:generate/check`、`site:build`、完整 `check`、`example:install` 和 `pack:check` 已通过，源码/dist/示例安装三层四件套一致；微信 CLI 已启动 IDE 服务，但 `touristappid` 返回 code 10，未生成也未伪造 `miniprogram_npm`。Direction 已完成源码/API/示例审计，因仅收到“考虑删掉”而未擅自删除公开 API，待明确授权后才可进入破坏性移除流程。

- 2026-07-20：完成 Dialog 的 TDesign 1.15.3 联网对照 battle。公开合同收敛为 16 Props、5 Events、7 个具名 Slot 与 `close()`；删除根级 loading/error/empty/retry、default/header-left Slot 和预览私参，确认/action 不自动关闭，关闭统一请求父级回写 visible。官网改为基础用法/按钮与布局/具名插槽/遮罩与关闭四区，基础 WXML 零 `bind:*`；H5 与 Popup 同步补齐 overlayProps、滚动保护和 custom navbar。真实浏览器验证 Props 回写、Close/Cancel/Confirm/actions、具名插槽、遮罩空白区、disabled/loading、180/1ms、390px、light/dark 与六项外观；API 全文和基础代码复制均真实通过。`site:build`、`check`、`pack:check`、`example:install`、Ledger generate/check 均通过，源码/dist/示例安装 Dialog 四件套 SHA256 一致。微信 CLI 启动 IDE server 后因 `touristappid` 不存在返回内部 code 10，未生成微信 npm 产物并保留 `pending-cli`；本次停在 Dialog，等待合法 AppID 真机复核。

- 2026-07-20：完成 Toast 的 TDesign 1.15.3 对照 battle。公开合同收敛为 12 Props、`icon/message` 两 Slot、唯一 `close`、`show(options)/hide()`；删除受控显隐、默认 Slot、私有动效/层级参数及 `input/change/open`。官网按基础用法/主题与图标/方向与位置/遮罩与滚动保护分区，基础 WXML 零 `bind:*`；真实浏览器验证 Props 回写、PUI Button 入口、Overlay、API 全文、代码复制、390px、light/dark 与六项外观。修复 component-only 清理后隐藏态空舞台、H5 缺失 easing Token 令 transition 退化为 0s、API 把不存在 default Slot 宣传为可用能力。新增 `TOAST.md`、PUI-FB-0143～0146 和专项门禁。`site:build/check/pack:check/example:install`、Ledger generate/check 通过，源码/dist/示例安装三层四件套一致；微信 CLI 因 `touristappid` 不存在而保留 pending-cli，下一项进入 Dialog。

- 2026-07-20：完成 Loading 的 TDesign 1.15.3 对照 battle。公开合同收敛为 15 Props、`default/indicator/text` 三 Slot、0 Events、0 Methods；删除 `color/easing/showProgress/vertical` 与 `show/hide`，不把内部阶段伪装成生命周期。原生端以真实 `waiting → entering → visible → leaving → hidden` 支持 delay、0/100 进度、全屏、暂停/反向和 0–500ms/低动效；官网按基础用法/图标与文字/方向与进度/全屏与低动效分区，基础 WXML 零 `bind:*`。修复 H5 整段重绘吞掉 500ms 退场中间帧的问题，实测同一节点 opacity 中间值后再卸载。新增 `LOADING.md`、PUI-FB-0141/0142 和专项门禁。`site:build/check/pack:check/example:install`、Ledger generate/check 通过，源码/dist/示例安装三层一致；微信 CLI 因 `touristappid` 不存在而保留 pending-cli，下一项进入 Toast。
- 2026-07-20：完成 Sticky 的 TDesign 1.15.3 对照 battle。公开合同从旧 20 Props、7 Events、2 Slots、3 Methods 收敛为 `container/disabled/offsetTop/zIndex` 四个 Props、唯一 `scroll`、default Slot、0 Methods；删除页面/容器滚动目标、标题/背景/状态/动效调参、重复事件和诊断方法。原生端保留真实页面滚动测量、同高占位、NodesRef 容器底部约束与 `setData → scroll` 时序；官网按基础用法/顶部偏移/容器边界与禁用分区，以真实局部 CSS sticky 呈现，不用状态文案模拟。浏览器实测默认吸顶、40px 偏移、容器回退、disabled、`container` 空字符串、false、`zIndex=0`、重置、复制、393px 无溢出、API全文与六项外观；修复 H5 把有效 `zIndex=0` 夹紧为 1 的漂移。新增 `STICKY.md`、PUI-FB-0138/0139/0140 和专项门禁。`site:build/check/pack:check/example:install`、Ledger generate/check 通过，源码/dist/示例安装三层一致；微信 CLI 因 `touristappid` 不存在保留 pending-cli，下一项进入 Loading。
- 2026-07-20：完成 BackTop 的 TDesign 1.15.3 对照 battle。公开合同由旧 21 Props、8 Events、2 Methods 收敛为 8 Props、唯一 `to-top` Event、`icon/default` 两个 Slots、0 Methods；删除 page/container 双目标、偏移/尺寸/层级/状态/私有动效、伪平台回调和命令式方法。官网改为基础用法/显示阈值/形状与文案/主题与定位四区，基础 WXML 零 `bind:*`，H5 点击真实滚动 PreviewDevice 局部容器而不滚官网页面。联网核验 TDesign 官方页、仓库/NPM 及固定包 `back-top` props/type/JS/JSON/WXML/WXSS；修复源端未定义 `--pui-color-primary` 与 H5 通用 Button 将 dark theme 覆盖成浅色的回归，新增跨端 `--pui-bg-inverse/--pui-text-on-inverse`。新增 `BACKTOP.md`、PUI-FB-0135/0136/0137 和专项门禁。`site:build/check/pack:check/example:install`、Ledger generate/check 通过后核验源码/dist/示例安装一致；微信 CLI 仍受 `touristappid` 限制而保留 pending-cli，下一项进入 Sticky。
- 2026-07-20：完成 Sidebar / SideBarItem 的 TDesign 1.15.3 对照 battle。公开合同由旧扩展 API 收敛为 24 Props、2 Events、0 Slots、0 Methods；`value/defaultValue` 只接受严格 `String/Number`，区分 `0`、`"0"` 与空字符串，重复、布尔和对象值不触发选择。官网按基础用法/分组与徽标/主题与状态/受控与边界四区展示，基础 WXML 零 `bind:*`；真实验证受控回写、键盘选择、readonly/disabled、loading/error/retry/empty、非法 JSON、低动效、代码复制、API 全文、390px 与全部外观开关。修复 H5 API 类型与描述仍暴露旧 `select/input`、Header/Footer 和实例方法的漂移；新增 `SIDEBAR.md`、PUI-FB-0132/0133 及专项门禁。将“在线官方页面 + 官方仓库或 NPM + 固定包源码”的双证据协议写入全局 Agent 规则、对照清单和 PUI-FB-0134。`site:build/check/pack:check/example:install` 通过，源码/dist/示例安装三层一致；微信 CLI 因 `touristappid` 不存在保留 pending-cli，下一项进入 BackTop。
- 2026-07-19：完成 Indexes / IndexesAnchor 的 TDesign 1.15.3 对照 battle。公开合同由旧 value/defaultValue、8 Events、Header/Footer Slot 和4个实例方法收敛为20 Props、4 Events、0 Slots、0 Methods；分组 index 只接受严格 String/Number，区分数字0与字符串0，侧栏固定 select→change、滚动只发change、条目只发item-click。删除页面框架、重复事件/方法和私有动效；原生与H5组合 PUI Cell/Badge/Button/Loading/Empty，状态固定 error>loading>content>empty 与180/1ms。官网按基础用法/索引显示/条目与状态/受控与边界四区陈列，基础WXML零bind。390px完成真实点击、手动滚动、连续Pointer拖动、严格值、readonly/disabled、状态重试、Props、复制、API全文、深浅色与六项外观；修复错误group选择器、重复sample标识、受控事件丢失、未定义signal、Pointer/mouse冲突、复制默认源缺失与共享状态门禁。新增 `INDEXES.md`、PUI-FB-0130/0131 和专项测试；`site:build/check/pack:check/example:install` 通过，源码/dist/示例安装三层一致。微信 CLI 受 `touristappid` 限制保留 pending-cli，下一项自动进入 Sidebar。
- 2026-07-19：完成 Steps / StepItem 的 TDesign 1.15.3 对照 battle。公开合同由旧24 Props、4 Events、3 Methods、footer Slot收敛为12 Props、1 Event、0 Slots、0 Methods；严格区分 `0/"0"/false/空字符串`，仅不同可用步骤发布一次 change，重复项、readonly、disabled 静默并等待受控父级回写。删除根级业务状态、页面动作、标题截断、单项 loading 和私有动效；原生与H5组合 PUI Button/Icon，重建横纵/正反序、default/dot、局部滚动和180/1ms。官网按基础用法/方向与顺序/主题与状态/边界值与禁用四区陈列，基础 WXML 零 bind。390px 完成真实点击/键盘、严格值、空 items、非法JSON、API全文、三处复制、深浅色与六项外观；修复共享 Loading 几何清单、Tabbar 专项截取边界和 Steps Icon 尺寸镜像三处旧合同。新增 `STEPS.md`、PUI-FB-0128/0129 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例安装三层一致。微信 CLI 因 `touristappid` 不存在保留 pending-cli，下一项自动进入 Indexes。
- 2026-07-19：完成 Tabbar / TabBarItem 的 TDesign 1.15.3 对照 battle。公开合同由旧31 Props、4 Events、2 Methods、action Slot收敛为14 Props、2 Events、0 Slots、0 Methods；严格区分 `0/"0"/false/空字符串`，切换固定 click→change，同项只发 click，disabled 无事件并等待受控父级回写。删除根级业务状态、自动动作、重复事件/方法和颜色/高度/横滚/动效私有调参；原生与H5组合 PUI Button/Badge/Icon，重建 fixed/placeholder、env 安全区、normal/tag、normal/round和180/1ms。官网按基础用法/徽标与禁用/主题与形状/固定安全区与边界值四区陈列，基础 WXML 零 bind。390px 完成真实点击/键盘、严格值、空 items、API 全文、深浅色与六项外观；修复代码生成默认值缺失引发新页面 TypeError、split 被 shadow-off 清除且无边界宽度、H5 毛玻璃/阴影假开关。新增 `TABBAR.md`、PUI-FB-0125/0126/0127 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例安装三层一致。微信 CLI 因 `touristappid` 不存在保留 pending-cli，下一项自动进入 Steps。
- 2026-07-19：完成 Tabs / TabPanel 的 TDesign 1.15.3 对照 battle。公开合同由旧 30 Props、5 Events、4 Methods、3 Slots 收敛为 12 Props、2 Events、1 default Slot、0 Methods；严格区分 `0/"0"/false/空字符串`，同项只发 click，真实点击固定 click→change，swipe 只发 change 并等待受控父级回写。删除根级 loading/error/empty/retry、prefix/extra、input、实例方法和私有动效/阈值/循环；原生与 H5 重建单指示器、局部横滚、吸顶和不循环滑动。官网按基础用法/样式/徽标与禁用/受控边界与滑动四区陈列，基础 WXML 含必要 items/defaultValue 且零 bind。390px 完成点击、真实 CUA 拖动、swipeable 门禁、180/1ms、API 全文、深浅色与六项外观；修复代码生成漏必要数据绑定和安装测试错误路径静默跳过。新增 `TABS.md`、PUI-FB-0123/0124 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例安装三层一致。微信 CLI 因 `touristappid` 不存在保留 pending-cli，下一项自动进入 Tabbar。
- 2026-07-19：完成 Navbar 的 TDesign 1.15.3 对照 battle。公开合同由旧 32 Props、6 Events、2 Methods 收敛为 14 Props、1 Event、3 Slots、0 Methods；默认返回只发布 `left-click`，不自动调用 `wx.navigateBack`，右侧业务操作统一由 right Slot 内真实 PUI Button 处理。原生与 H5 重建固定三列、safe area、fixed/placeholder、声明式 visible、Loading 和 500ms/低动效 1ms。官网按基础用法/标题与操作/加载与禁用/透明导航四区陈列，基础 WXML 零 bind；390px 下完成返回、左右 Slot、显隐中间帧、空标题、titleMaxLength、disabled/loading、API 全文、Tabs 稳定、深浅色与六项外观，并修复属性面板回写 visible 后残留旧 false 反馈。新增 `NAVBAR.md`、PUI-FB-0121/0122 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例三层一致。微信 CLI 因 `touristappid` 不存在保留 pending-cli，下一项自动进入 Tabs。
- 2026-07-19：完成 Calendar 的 TDesign 1.15.3 对照 battle。公开合同收敛为 26 Props、7 Events、0 Slots、0 Methods；重建严格日期、42 格六周网格、single/range/multiple、值与显隐双受控、禁用/上限、状态优先级和真实父级回写，删除旧重复事件、Slot、实例方法与私有动效。官网重建为基础用法/范围与多选/日期限制/状态与反馈四区，基础 WXML 零 bind；390px 下完成单选、范围、受控/退控、导航、确认、disabled/readonly/loading/error/retry/empty、popup 遮罩与受控显隐、180/1ms、API 全文、Tabs 稳定、深浅色与六项外观。修复 popup 未动态进入 edge-to-edge、旧全局合同仍引用旧演示函数，以及 API 面板上限低于源码。新增 `CALENDAR.md`、PUI-FB-0119/0120 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例三层一致。微信 CLI 因 `touristappid` 不存在保留 pending-cli，下一项自动进入 Navbar。
- 2026-07-19：完成 Upload / Attachments 的 TDesign 1.15.3 对照 battle。公开合同收敛为 20 Props、8 Events、1 个 `add` Slot、0 Methods；重建真实微信选择、数量/重复/扩展名/大小校验、list/grid、逐文件状态和父级回写，不内置 fake remote upload，不照搬 `requestMethod/config/draggable/transition/gridConfig/gutter/imageProps`。官网重建为基础用法/网格与媒体/文件状态/限制与禁用四区，基础 WXML 零 bind，状态示例只展示消费者写回值。390px 下完成 Array 受控、`false/0/空字符串/null`、移除顺序、Retry 等待父级、禁用、自定义入口、accept、多列网格、180/1ms、API 全文、Tabs 稳定、深浅色与六项外观；本地 File 注入受浏览器自动化能力限制，未伪造成功。新增 `UPLOAD.md`、PUI-FB-0117/0118 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例三层一致。微信 CLI 因 `touristappid` 不存在保留 pending-cli，下一项自动进入 Calendar。
- 2026-07-19：完成 Rate 的 TDesign 1.15.3 对照 battle。公开合同收敛为 13 Props、1 Event、0 Slots、0 Methods；新增真实触摸拖动和 `gap`，删除重复 `input`、默认 Slot 与私有 `duration/easing`，严格区分数字 0、Boolean、空字符串与 null。半星从依赖背景的遮罩改为双层 PUI Icon 裁切，颜色只声明微信 Canvas 可执行值。官网重建为基础用法/半星与文案/尺寸与间距/状态与受控四区，静态样例只读，当前实例真实点击、Pointer 拖动和父级回写，基础 WXML 零 bind。390px 下完成 4.5 点击、1.5 拖动、受控/退控、禁用/只读、180/1ms、API 全文、Tabs 稳定、深浅色与六项外观；修复大尺寸样例横向溢出和透明 Rate 被全局 Surface 样式强加圆角、阴影、毛玻璃与 500ms。新增 `RATE.md`、PUI-FB-0115/0116 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例三层一致。微信 CLI 因 `touristappid` 不存在保留 pending-cli，下一项自动进入 Upload。
- 2026-07-19：完成 Slider 的 TDesign 1.15.3 对照 battle。公开合同收敛为 16 Props、2 Events、0 Slots、0 Methods；删除重复 `input`、默认 Slot、`setValue/reset/getValue/getState` 和私有 `duration/easing`，固定 500ms/1ms，严格区分数字 0、Boolean、空字符串与 null。官网重建为基础用法/边界与步长/颜色与表单/状态与受控四区，使用真实 range input 和唯一可访问名称，基础 WXML 零 bind；补齐专属 API 行为说明和真实可选值。390px 下完成受控父级回写、退控保值、负数/步长/锁定、API 全文、Tabs 稳定、深浅色与六项外观；并修复 Picker 专项测试误依赖旧 Slider `source=drag` 字符串。新增 `SLIDER.md`、PUI-FB-0113/0114 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例三层一致。微信 CLI 因 `touristappid` 不存在保留 pending-cli，下一项自动进入 Rate。
- 2026-07-19：完成 Stepper 的 TDesign 1.15.3 对照 battle。公开合同收敛为 14 Props、4 Events、0 Slots、0 Methods；删除重复 `input`、私有 `duration/easing`、误导默认 Slot 与实例方法。修复原生 Stepper 错误监听 PUI Input 不存在的 `input`，改为真实 `change/enter/focus/blur`；输入只保存草稿，Enter/失焦规整提交，失焦固定 `change → blur`，边界保留 `overlimit`。官网重建为基础用法/主题与尺寸/步长与边界/状态与输入四区，基础 WXML 零 bind；浏览器完成严格值、父级回写、小数步长、三类锁定、三主题/尺寸、390px、API 全文、深浅色与全部外观，并修复全站规则把组件 500ms 覆盖为 500ms。新增 `STEPPER.md`、PUI-FB-0110/0111/0112 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例三层一致。微信 CLI 因项目 `touristappid` 无效保留 pending-cli，下一项自动进入 Slider。
- 2026-07-19：完成 Search 的 TDesign 1.15.3 对照 battle。公开合同收敛为 17 Props、6 Events、1 default Slot、0 Methods；删除重复 `input/change`、私有 `duration/easing` 和业务 `resultList` 语义。修复原生 Search 错误监听 PUI Input 不存在的 `input/confirm`，改为真实 `change/enter`，清空固定 `clear → change`；官网重建为基础用法/搜索框形状/操作与长度/状态与受控四区，基础 WXML 零 bind，补齐 0/false/空字符串/null 退控、加权字符、父级回写、180/1ms 与 PUI Input/Button/Icon 同源组合。390px、API 全文、深浅色和全部外观通过；新增 `SEARCH.md`、PUI-FB-0108/0109 和专项门禁。`site:build/check/pack:check/example:install` 通过，源码/dist/示例三层一致；微信 CLI 因 Service Port disabled 保留 pending-cli，下一项自动进入 Stepper。
- 2026-07-19：完成 DateTimePicker 的 TDesign 1.15.3 对照 battle。公开合同从两个系统 date/time picker 与 27 Props 的分裂适配器重建为 PUI Picker 日期时间领域层，收敛为 21 Props、7 Events、0 Slots、6 Methods，支持年到秒动态列、闰年月末、范围、步长、周几、格式、值与显隐双受控和统一草稿确认；基础 WXML 零 bind。官网删除浏览器 date/time input，重建点击/键盘/wheel/Pointer drag，并分为基础用法/日期与时间精度/范围与步长/内联与状态。真实浏览器修复步长初值提交漂移和 Popup 未进入 edge-to-edge 导致越出 PreviewDevice，完成 `0`、受控回写、取消回滚、180/1ms、390px、API 全文、深浅色和全部外观。新增 `DATE-TIME-PICKER.md`、PUI-FB-0106/0107 与专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例三层一致。微信 CLI 仍因 Service Port disabled 保留 pending-cli，下一项自动进入 Search。
- 2026-07-19：完成 Picker 的 TDesign 1.15.3 对照 battle。公开合同从与 Select 重复的 `options + 标量 value` 壳重建为 25 Props、8 Events、0 Slots、6 Methods，使用真实 `picker-view` 承担单列、多列、级联、值与显隐双受控、草稿确认和 Popup/内联；严格保留 `0/false/空字符串`。官网删除原生 select 伪镜像，重建点击/键盘/滚轮/拖动交互并分为基础用法/多列与级联/状态与反馈/内联模式，基础 WXML 零 bind。浏览器修复 Popup 无中间帧、阴影/毛玻璃开关失效和全站 390px 代码正文覆盖 PreviewDevice，完成全部状态、180/1ms、API 全文、深浅色与全部外观。新增 `PICKER.md`、PUI-FB-0101～0105 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例三层五文件一致。微信 CLI 仍因 Service Port disabled 保留 pending-cli，下一项自动进入 DateTimePicker。
- 2026-07-19：完成 Form 的 TDesign 1.15.3 对照 battle。公开合同从固定 `items/value/showActions` 页面生成器收敛为 7 Props、3 Events、1 default Slot、5 Methods；Form 本体只保留原生 `form + Slot`，通过真实 Form–Field relation 集中校验受控 `data`，支持同步/异步规则、warning、首错定位、服务端消息、`validate → submit` 与父级回写 reset，完整保留 `0/false/空字符串`。官网重建为基础用法/校验与反馈/组合字段三区，组合共享 PUI Field/Input/Switch/Radio/Button，基础 WXML 零 bind 且复制代码可直接安装；浏览器完成全部 Props、失败/通过/重置、1ms、390px、API 全文、深浅色与全部外观。新增 `FORM.md`、PUI-FB-0098/0099/0100 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/tarball/示例四层一致。微信 CLI 仍因 Service Port disabled 保留 pending-cli，下一项自动进入 Picker。
- 2026-07-19：完成 Radio / RadioGroup 的 TDesign 1.15.3 对照 battle。Radio 收敛为 18 Props、1 Event、4 Slots、0 Methods，新增真实 Group 13 Props、1 Event、1 Slot、0 Methods；`checked/defaultChecked` 只管状态，`value` 保留 `0/false/空字符串` 原始身份，删除旧混合组选项、重复事件、伪 loading/empty/error/retry、私有动效和实例方法。官网重建为基础用法/原始值/组件状态/图标与内容四区，基础 WXML 零 bind；修复 H5 静态 Radio 共用 name 造成跨示例互斥和原生 borderless 无效。浏览器完成全部18 Props、allowUncheck、受控回写与退控、三类门禁、500ms中间帧/1ms、390px、API全文、深浅色与全部外观。新增`RADIO.md`、PUI-FB-0094/0095/0096/0097和专项门禁；`site:build/check/pack:check/example:install`通过，源码/dist/示例三层八文件一致。微信CLI仍因Service Port disabled保留pending-cli，下一项自动进入Form。
- 2026-07-19：完成 Checkbox / CheckboxGroup 的 TDesign 1.15.3 对照 battle。Checkbox 收敛为 19 Props、1 Event、3 Slots、0 Methods，新增真实 Group 11 Props、1 Event、1 Slot、0 Methods；`checked/defaultChecked` 只管状态，`value` 保留 `0/false/空字符串` 原始身份，删除旧状态别名、重复事件、loading/custom、私有动效和实例方法。官网重建为纵向与横向/全选与半选/状态/图标与布局四区，基础 WXML 零 bind；修复 Group 统计误含内容节点、native indeterminate 回滚、陈旧闭包和分区标题仅8px。浏览器完成全选/半选、受控回写、三类门禁、500ms中间帧/1ms、390px、API全文、深浅色与全部外观。新增`CHECKBOX.md`、PUI-FB-0090/0091/0092/0093和专项门禁；`site:build/check/pack:check/example:install`通过，源码/dist/示例/tarball四层一致。微信CLI仍因Service Port disabled保留pending-cli，下一项自动进入Radio。
- 2026-07-19：完成 Switch 的 TDesign 1.15.3 对照 battle。公开合同由旧 28 Props、4 Events、3 Slots、6 Methods 收敛为 11 Props、1 Event、0 Slots、0 Methods；删除 checked/defaultChecked、重复文案图标、外部标题说明、Slot 开关、布局/校验/私有动效、click/input/slot-click 和实例方法，保留原始 customValue、受控/非受控连续性与唯一 change。官网重建为基础开关/文字图标/状态/尺寸四区，基础 WXML 零 bind；修复 Cell value 文本容器吞掉点击、未定义 ease 使 transition 回退 0s、DOM 重建触发反向过渡缩短和分区标题仅8px。浏览器完成全部11 Props、0/false/空字符串、三类锁定、正常50/130ms中间帧与500ms完成、低动效1ms、390px、API全文、深浅色与全部外观。新增`SWITCH.md`、PUI-FB-0086/0087/0088/0089和专项门禁；`site:build/check/pack:check/example:install`通过，源码/dist/示例/tarball四层一致。微信CLI仍因Service Port disabled保留pending-cli，下一项自动进入Checkbox。
- 2026-07-19：完成 Textarea 的 TDesign 1.15.3 对照 battle。公开合同由旧 44 Props、9 Events、7 Methods 收敛为 30 Props、7 Events、3 Slots、4 Methods；删除重复自动高度/计数/错误/Slot 开关、input/confirm/linechange/reset 事件、setValue/reset/getState 和私有动效，统一 maxcharacter 优先、退控连续性、change、clear → change、enter 与 line-change。官网重建为基础用法/字符计数/自动增高/状态与交互四区，基础 WXML 零 bind；修复属性页仍复制旧合同、focus 只有 autofocus 无真实焦点、状态类互斥吞掉 error/warning、Button 几何覆盖和假 linechange。浏览器完成全部 30 Props、0/false/空字符串、父级回写、500ms中间帧/1ms、390px、API全文、深浅色与全部外观。新增 `TEXTAREA.md`、PUI-FB-0084/0085 和专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例/tarball 四层一致。微信 CLI 仍因 Service Port disabled 保留 pending-cli，下一项自动进入 Switch。
- 2026-07-19：完成 Field / FormItem 的 TDesign 1.15.3 对照 battle。公开合同由旧 8 Props 的混合状态容器收敛为 12 Props、0 Events、5 Slots、0 Methods；删除不能阻断 Slot 子控件的伪 `disabled`、重复 `description/error` 和 `orientation`，新增明确的标签/内容对齐、必填标记位置、反馈、箭头和低动效，并把 `rules/validate` 留到真实 Form relation。官网重建为基础/标签对齐/必填帮助/校验反馈四区，基础 WXML 为零 bind 的 Field + PUI Input；修复固定例继承无关 help、Field 双层 Surface，以及预览节点重建导致 500ms 状态色直接跳变。真实浏览器完成全部 12 Props、五类 Slot、输入保留、四类状态、default→error 173ms、低动效 1ms、390px、API 全文、深浅色与六项外观；新增 `FIELD.md`、PUI-FB-0082/0083 和专项门禁。微信 CLI 仍按 Service Port 状态独立保留 pending-cli，下一项自动进入 Textarea。
- 2026-07-19：完成 Input 的 TDesign 1.15.3 对照 battle。公开合同从旧 39 Props、6 Events、5 Methods 收敛为 29 Props、5 Events、6 Slots、4 Methods；删除 password/error/invalid 别名、custom* Slot 开关、重复 input/confirm、调试方法与私有动效，固定 500ms/1ms。官网重建为基础/状态/图标清空/尺寸类型四区，基础 WXML 零 bind；真实浏览器完成受控边界、加权 emoji、clear→change、Enter、三类锁定、Slot/password/error、375px、深浅色与全部外观。修复 DOM 恢复焦点覆盖 change/enter、Input 双层 Surface 与全局 Props 分组回写后折叠。新增 `INPUT.md`、PUI-FB-0079/0080/0081 与两类专项门禁；`site:build/check/pack:check/example:install` 通过，源码/dist/示例/tarball 四层一致。微信 CLI 因 Service Port disabled 以 exit 246 退出，状态保留 pending-cli，下一项自动进入 Field。
- 2026-07-19：完成 Collapse / CollapsePanel 的 TDesign 1.15.3 对照 battle。公开合同由旧多主题、多 Slot、多方法状态机收敛为 17 Props、2 Events、0 Slots、1 `collapse-panel` Generic、0 业务 Methods；删除根主题色、Header/Footer Slot、重复 input/open/close 事件、公开开关方法和私有动效参数，固定 500ms 标准动效与低动效 1ms。官网重建为基础用法/原始值与互斥/主题与自定义面板/加载空错误四区，基础 WXML 只保留 `items` 且零 `bind:*`；真实浏览器完成严格 `0/false/空字符串/"0"`、受控/非受控、互斥、disabled、键盘、Card、Generic、四状态、Retry、180/1ms、375/393px、深浅色和全部视觉开关。新增 `COLLAPSE.md`、PUI-FB-0077/0078 与专项门禁；源码、dist、示例安装和 tarball 四层四件套一致。`site:build/check/pack:check/example:install` 均通过；微信 CLI 因 Service Port disabled 以 exit 246 退出，状态保留 pending-cli，下一项自动进入 Input。
- 2026-07-19：完成 Swiper / Swiper 的 TDesign 1.15.3 对照 battle。公开合同由旧 42 Props、8 Events、3 Slots、8 Methods 收敛为 26 Props、7 Events、0 Slots、1 Generic、7 Methods；删除字段 Key、六套分页平行开关、Header/Footer/default Slot、readonly、pauseOnTouch、私有平台优化、transition 和 selectIndex。官网重建为基础用法/自动播放与导航/方向与多项/加载空错误四区，基础 WXML 零 bind；真实浏览器完成原始 `0/false/空字符串`、受控/非受控、CUA 拖拽、触摸门禁、自动播放暂停恢复、三种分页、controls、横纵与同屏、循环边界、四状态、Retry、坏图、Generic、方法、180/300/1ms、393px、深浅色和全部视觉开关。修复箭头误带默认文字、缓存 image-load 覆盖业务反馈、非内容态资源事件、Generic 注册缺失、147字符单行 WXML 和箭头固定毛玻璃。新增 `SWIPER.md`、PUI-FB-0074/0075；PUI-FB-0076 同时将微信产物改为存在即校验，避免 Service Port 关闭误阻断 Node 全库门禁。`site:build/check/pack:check/example:install` 均通过；微信 CLI exit 246，仍为 pending-cli，下一项自动进入 Collapse。
- 2026-07-19：完成 Table / Data Table 的 TDesign 1.15.3 对照 battle。公开合同由旧 39 Props、8 Events、4 Slots、11 Methods 收敛为 26 Props、7 Events、1 empty Slot、9 Methods；删除 data/items 双入口、内部尺寸与固定策略 Props、clickable、自由 header/footer/default Slots、私有 duration/easing、重复 selection-change/row-select 和左右滚动别名。官网重建为基础用法/边线与固定列/选择与排序/加载空错误四区，基础 WXML 零 bind，API 完整展示 26/7/1/9。真实浏览器完成 0/false 行键、受控/非受控选择与排序、单选/全选、cell-click→row-click、键盘排序、真实横滚、error/loading/empty/retry、500ms/1ms、390px、深浅色和全部视觉开关；修复分区 min-width 把表格撑出 PreviewDevice、bordered=false 被全站规则覆盖、全站500ms覆盖组件动效及演示固定列遮挡排序命中区。新增 `TABLE.md`、PUI-FB-0072/0073 与专项门禁；微信安装产物历史缺口和 Service Port disabled 继续保留 pending-cli，下一项自动进入 Swiper。
- 2026-07-19：完成 CountDown 的 TDesign 1.15.3 对照 battle。公开合同收敛为 11 Props、2 Events、1 default Slot、4 Methods；删除 finishText/customContent/pauseOnHidden、私有 duration/easing、重复 start/pause/reset Events、restart/getRemaining 和 prefix/suffix Slots。明确 targetTime+Date.now、autoStart 初始化策略、paused 恢复边界及 change→finish 单次顺序；官网按基础用法/主题与尺寸/单位与毫秒/控制与自定义内容四区重建，基础 WXML 零 bind，API 完整展示 Props/Events/Slots/Methods。真实浏览器完成暂停/恢复/重置/读取、3秒自然完成、运行中 autoStart=false、0/false/Slot/毫秒/单位、500ms/1ms、390px、深浅色和全部视觉开关；修复演示与源码默认混用、WXML漏time、API缺Methods、2小时上界、round魔法圆角、两端字体Token漂移和合同命名。新增 `COUNTDOWN.md`、PUI-FB-0070/0071 与专项门禁；源码、dist、tarball、示例安装一致。历史微信 `miniprogram_npm` 缺失和 Service Port disabled 使微信产物保留 pending-cli；下一项 Table 已自动开始。
- 2026-07-19：完成 Grid 的 TDesign 1.15.3 对照 battle。公开合同收敛为 14 Props、2 Events、0 Slots、0 Methods；不新增 GridItem，删除 hover、根 theme、showFooter、footer Slot 与私有 duration/easing，`column=0` 统一为组件内横向滚动。loading/error/empty 组合 PUI Loading/Empty，Retry 只请求父级真实回写；状态层以固定 500ms/低动效 1ms 保留中间帧。官网重建为基础用法/列数与间距/徽标与禁用/加载、空与错误四段，基础 WXML 零 bind，API 完整展示 14/2/0。真实浏览器完成 value=0、disabled、错误重试、默认空态、状态中间帧、390px 局部横向滚动、深浅色和全部视觉开关；新增 `GRID.md`、PUI-FB-0068/0069 与专项门禁，并修复 Empty 对旧 Image Props 的陈旧透传。npm 源码、dist、tarball 和示例 node_modules 一致；微信开发者工具 Service Port 关闭，`miniprogram_npm` 保留 pending-cli；下一项 CountDown 已自动开始。
- 2026-07-19：完成 Tag 的 TDesign 1.15.3 对照 battle。公开合同收敛为 9 Props、1 close Event、1 default Slot、0 Methods；删除与 shape 重复的 round 和展示叶子根 click，maxWidth 增加安全 px/rpx/% 门禁，Close 只请求父级真实删除。官网改为基础用法/主题与变体/尺寸与形状/可关闭与长文本四段，基础 WXML 零 bind，API 完整展示 9/1/1。真实浏览器完成 0/空字符串、Icon、Close 键盘与 disabled、非法宽度、主题/变体/尺寸/形状、源码默认重置、Inspector、390px、深浅色和全部视觉开关；修复 Tag showcase 漏 `demo-section` 导致元素选择完全失效。新增 `TAG.md`、PUI-FB-0066/0067 和专项门禁；npm 源码、dist、tarball 安装和示例 node_modules 一致。微信开发者工具 Service Port 关闭，`miniprogram_npm` 仍为 pending-cli；下一项 Grid 已自动开始。
- 2026-07-19：完成 Image 的 TDesign 1.15.3 对照 battle。公开合同由旧 17 Props/3 Events 收敛为 14 Props、2 个真实资源 Events、1 default Slot、0 Methods；删除 clickable/disabled/click 与私有 duration/easing，新增微信 webp，明确 Image 是资源展示叶子。官网改为基础用法/加载与失败/裁切模式/形状与覆盖内容四段，基础 WXML 零 bind，API 完整展示 14/2/1。真实浏览器完成 load/error/empty、外部状态优先级、0/空值、安全尺寸、裁切/形状/Slot、lazy/webp/menu、1ms、宿主门禁、Inspector、390px、深浅色和全部视觉开关；修复 H5 lazy 未写真实 img loading、源码默认重置漂移、旧 raw button 白名单和共享 Loading 合同缺口。新增 `IMAGE.md`、PUI-FB-0064/0065 和专项门禁；npm 源码、dist、tarball 安装和示例 node_modules 一致。微信开发者工具 Service Port 关闭，`miniprogram_npm` 仍为 pending-cli。
- 2026-07-19：完成 Avatar 的 TDesign 1.15.3 对照 battle。公开合同由旧 16 Props/3 Events 收敛为 11 Props、1 error Event、1 default Slot、0 Methods；删除 image 别名、clickable/disabled、自身 click/load 与私有 duration/easing，明确 Avatar 是纯展示叶子，宿主交互归 PUI Button/Cell。官网改为基础用法/图片与回退/尺寸与形状/组合用法四段，基础 WXML 零 bind，API 完整展示 11/1/1。真实浏览器完成图片成功/失败、500ms/1ms、0/空字符串、回退、宿主门禁、元素 Inspector、390px、深浅色和全部视觉开关；修复 H5 尺寸漂移、缓存图片监听、hidden 完成态仍可见、组合反馈被归一化移除，以及 border/shadow Token 未生效。新增 `AVATAR.md`、PUI-FB-0062/0063 和专项门禁；npm 源码、dist、tarball 安装和示例 node_modules 一致。微信开发者工具 Service Port 关闭，`miniprogram_npm` 仍为 pending-cli。
- 2026-07-19：完成 Badge 的 TDesign 1.15.3 对照 battle。公开合同由旧 27 Props/5 Events/2 Slots 收敛为 12 Props、0 Events、2 Slots、0 Methods；删除值别名、显隐生命周期、clickable/disabled、独立定位开关与动画参数，明确 Badge 是纯展示叶子，宿主交互归 Button/Cell/Tabs/Tabbar。官网改为基础用法/红点与上限/尺寸与形状/主题与变体/组合用法五段，基础 WXML 零 bind，API 完整展示 12/0/2。真实浏览器完成零值、空值、count Slot、颜色/偏移、组合门禁、元素 Inspector、复制、390px、深浅色和全部视觉开关，并修复重置误恢复演示初值 3。新增 `BADGE.md`、PUI-FB-0060/0061 和专项门禁；npm 源码、dist、tarball 解包/安装一致。微信开发者工具 Service Port 关闭，`miniprogram_npm` 仍为 pending-cli。
- 2026-07-19：完成 Cell 的 TDesign 1.15.3 对照 battle。公开合同由旧 45 Props/10 Events/6 Methods 收敛为 28 Props、7 Events、7 Slots、0 业务 Methods；删除 Badge/Image 全量透传、custom* 开关、过程导航事件和绕过父级回写的实例方法，复杂内容统一通过 Slot 组合。官网改为基础用法/多行与内容/状态与选择/组合内容四段，基础 WXML 为零 bind 的 `<pui-cell title="单行标题" />`，API 完整展示 28/7/7。真实浏览器修复空 title 当前代码被回退、坏图 hidden 被 display:block 覆盖，并完成受控/非受控、门禁、图片、复制、390px、深浅色和全部视觉开关。新增 `CELL.md`、PUI-FB-0056/0057/0058/0059 和专项门禁；npm 三路产物一致。微信开发者工具 Service Port 关闭，`miniprogram_npm` 仍为 pending-cli。
- 2026-07-19：完成 Divider 的 TDesign 1.15.3 对照 battle。保留 `layout/align/content/showContent/dashed/decorative/ariaLabel`、default Slot 和无事件边界；基础 WXML 收敛为零 bind 的 `<pui-divider />`。修复原生与 H5 根无条件 gap 使默认空分割线中心断开的真实缺陷，间距迁至 content，并补齐 `aria-orientation`。官网删除构建状态诊断和纵向私有 Surface，重组为基础用法/文字与对齐/布局与线型，API 完整显示 7 Props/1 Slot/0 Events，兼容说明不再虚构 click/input；后续标题间距实测恢复 18px。新增 `DIVIDER.md`、`test-divider.js`、PUI-FB-0054/0055；浏览器完成 Props、复制、390px、深浅色和全部外观开关，npm 三路产物一致。微信开发者工具 Service Port 关闭，`miniprogram_npm` 门禁保留 pending-cli。

- 2026-07-18：修复全部组件预览的阴影安全区放错层级问题。PreviewDevice 外框不再把 padding 放在滚动裁切区之外，viewport 内新增统一父布局：普通组件使用 `shadow-safe = 14px base + 14px bleed = 28px`，Dialog、Popup、Navbar、Tabbar、Toast 等屏幕附着组件使用 `edge-to-edge = 0`。阴影开关不改变布局；390px Card 阴影完整、Dialog 遮罩仍铺满设备。新增 PUI-FB-0038。

- 2026-07-18：Dialog 默认 Cancel 从 `outline` 改为普通中性 PUI Button，默认 Confirm 继续使用主色 Button；主次通过中性/主色表达，不再依赖额外线框。小程序、H5、API、Dialog 专属合同和专项测试同步，新增 PUI-FB-0036。

- 2026-07-18：组件语义合同从“复合组件按 battle 补充”升级为“每个组件最终必须拥有”。旧组件采用“修改即迁移”：下一次实质修改前先审计真实源码、H5、API、示例、测试和 Ledger，再建立合同，禁止批量空壳。新增通用合同模板、可复制的新会话启动提示词、全局自动门禁及 PUI-FB-0037。

- 2026-07-18：建立 `docs/components/` 组件语义合同体系，并以 Dialog 作为首份强制合同。`DIALOG.md` 聚合三区结构、Header 三列、36/28/16rpx 间距、四类 Slot、状态与动作优先级、Content 唯一滚动、生命周期、外观、H5 预览、可访问性和禁止事项；AGENTS、README、CONTRIBUTING、API 均建立入口，`test-dialog.js` 增加文档结构与关键语义门禁。新增 PUI-FB-0035，后续组件按真实 battle 逐个补充，不批量生成空壳。

- 2026-07-18：常规模式左侧从“引用区与基础区各自滚动”的卡片模型改为单一滚动正文；小标题和代码块按自然文档流共同滚动，代码块仅保留 PUI 代码样式、行号、主题语法色、键盘焦点与必要横向滚动。移除引用区固定高度 Token，并将实现语义由 `preview-code-card` 更新为 `preview-code-document`。

- 2026-07-18：完成官网菜单与浮层深浅色审计并修复共享 Select 根因。机型选择和属性枚举的可见下拉不再依赖浏览器原生菜单，统一由 PUI Button Trigger/Option、PUI Chevron/Check Icon 与 Token 化 Popover Menu 组成；隐藏原生 select 只保留值和 `input/change` 桥接并退出无障碍树。补齐方向键/Home/End/Enter/Space/Esc/Tab、焦点恢复、外部关闭、视口定位与低动效。App Shell 及原生表单桥接层同步 light/dark `color-scheme`，全站 Command、Tooltip、Popover、Dropdown、Combobox、ContextMenu、NavigationMenu、快速搜索和外观菜单进入主题 Surface 合同。新增 PUI-FB-0034 与专项扫描。
- 2026-07-18：常规模式组件用法区进一步去工程面板化：删除“组件用法 / 当前效果 / 默认值已省略”总 Header，外层改为透明且无边框、圆角、阴影、毛玻璃和 panel padding，只保留“组件引用 / 基础用法”两个真实代码 Surface。引用按内容自然高度排列并设置安全上限，基础用法填充剩余高度，两块各自横纵滚动；WXML 开始标签改为 80 字符软上限、每行最多 3 个属性。继续复用 `makeUsageCode`、默认值过滤、行号、主题语法色与 PUI Token。更新 PUI-FB-0033、专项合同与全局规范。
- 2026-07-18：标准组件常规模式左侧新增“当前代码”卡片，与工具栏复制和属性页 WXML 共用 `makeCurrentPreviewCopyCode → makeUsageCode` 单一代码源，继续省略默认 Props并保留视觉/运行态注释。代码区使用 PUI mono 13px/19px、行号、主题语法色、缩进保留、键盘焦点和独立双向滚动；桌面把 PreviewDevice 右移至 32px Stage gutter，代码卡从左侧 32px gutter 自动撑满到设备前，1280px 下为 550×622px，与 393×622px 设备等高且间距 14px。常规/选择元素切换不再重建 Stage，同一个设备节点以 500ms standard easing 在 x=840 与中心 x=558 间平滑横移，低动效为 1ms；代码卡与 Inspector 同步进退并保留组件运行态。390px 为 351×240px 左下实色满宽覆盖、设备不横移且页面 375/375 无横向溢出。更新 PUI-FB-0033 与专项合同。
- 2026-07-18：外观 IconButton 左侧新增共享 PUI Switch“一键果味”。开启时一次写入阴影、毛玻璃、大圆角开启，边框、渐变关闭；关闭恢复标准视觉组合，两个方向都不改深浅色。Switch 不新增持久化字段，而是从五项当前偏好实时推导：菜单内任一项偏离后立即自动关闭，刷新后也从已恢复配置重新判定。390px 下果味入口 66×22px、外观按钮 36×36px，品牌与控件保留 20px 间隔且页面 375/375 无横向溢出。新增 PUI-FB-0032 与专项合同。
- 2026-07-18：主页面右上角六项外观 Switch 收纳为一个 PUI Palette IconButton + 非模态外观菜单，释放主导航空间；菜单内仍调用共享 `switchPreviewMarkup`，本地持久化和六项作用域不变。入口补齐 `aria-haspopup/expanded/controls`，打开后聚焦首个 Switch，Esc 关闭并恢复焦点，点击外部关闭；菜单使用 PUI spacing/radius/surface 与 normal/standard 动效，低动效为 1ms，390px 和深浅色下不越界。新增 PUI-FB-0031 与专项合同。
- 2026-07-18：按用户最终决定撤销标准页 Tabs 的视觉 Hover。删除 `--pui-site-tabs-hover-background`、深浅色 Hover 映射和私有 `:hover` 规则；Tabs Button 基础 Surface 显式保持透明，防止通用 PUI Button Hover 泄漏。页面分类现在只保留高对比选中态与键盘 `focus-visible`。PUI-FB-0030 更新为已接受的无 Hover 设计决策。
- 2026-07-18：修复标准页 Tabs 非选中 hover 在深色模式下不可见：旧 hover 与父容器都解析为 `#18181b`。新增 `--pui-site-tabs-hover-background: var(--border)`，浅色/深色分别得到 `#e4e4e7/#27272a`，并用 PUI normal duration/standard easing 过渡文字与背景；选中项和 focus-visible 保持独立。新增 PUI-FB-0030 与专项合同。
- 2026-07-18：标准组件页第三个 Tabs 从工程词 `PROP` 更名为用户可理解的“属性”。页签选中动画改为固定三等分 Grid + 单一 `transform: translate3d()` 滑块：不再同时过渡 `left/width`，不读取 DOM 尺寸，也不重建 Tabs；按钮、轨道和 Header 几何保持不动，深浅色沿用高对比选中态，系统低动效压缩为 1ms。新增 PUI-FB-0029 与专项合同。

- 2026-07-18：标准组件概览工具栏最右侧新增 PUI Copy IconButton。它按当前 Props 复用 PROP 的 `makeUsageCode` 真相源，复制可安装的小程序用法并自动省略默认 Props；代码头注释记录组件名、非默认 Props、主题/边框/阴影/毛玻璃/大圆角、页面渐变边界，并明确不序列化打开、滚动、焦点和动画等临时运行态。Clipboard API 不可用时继续使用真实 `execCommand` 回退，成功/失败通过 PUI Icon 与 `aria-live` 反馈；三按钮操作组在 390px 继续居右且无额外 Surface。

- 2026-07-18：修复 Dialog 错误态因 Content 内 `Empty + 文字重试按钮` 撑高并裁切 Footer。重试迁入 Header 左轨，复用 36px / 72rpx 圆形 PUI IconButton 和 `error-circle` 失败图标；其他状态继续使用 `header-left` Slot。Dialog 改为自然高度至视口上限，Header/Footer 固定不收缩，只有 Content 在极端内容下内部滚动；H5、小程序、API、设计合同和专项测试同步，登记 PUI-FB-0027。

- 2026-07-18：压缩标准组件页 Header：删除重复分类 Kicker，90 个标准页面改用独立 metadata 用户用途短摘要，技术描述继续留在 API/PROP；桌面 Header 上下内距收至 12px，标题/摘要分别使用 PUI title-medium/body-small。右上角 `概览 / API / PROP` 从弱字重提示改为深浅色自适应的高对比选中 Surface，补齐 hover 与键盘焦点态。

- 2026-07-18：元素选择模式的上下文 Inspector 从设备右侧单卡片改为围绕 PreviewDevice 的左右双侧面板。左侧只承接 `text/json/nullable-number` 等自由输入内容值，右侧承接 Boolean、枚举、范围及其余设置；两侧复用完整 PROP 的 PUI 表单 helper、校验与回写，没有字段时显示真实 PUI Empty。桌面共享 286×560px 宽高 Token并以 14px 等距贴合设备两侧，窄屏变为底部等宽双栏覆盖；首次选中、切换元素和关闭使用方向明确的 500ms 动效，输入回写不重播入场，系统低动效压缩为 1ms。更新 PUI-FB-0020 与专项合同。

- 2026-07-18：ConfigProvider 新增 `bordered` 与 `use-global-config`，包入口新增持久化 `visualConfig` Store，让安装者以一份 `theme/effectsEnabled/shadow/frostedGlass/largeRadius/bordered` 配置同步所有已挂载页面根 Provider。Store 提供 `restore/set/applyPreset/setEffectsEnabled/reset/subscribe` 和 standard/soft/glass 预设；总效果开关只暂停阴影、毛玻璃和大圆角，主题与边框保持独立。组件边框关闭以 Token 透明化保留盒模型与语义状态边界；渐变明确留给消费者页面画布。ConfigProvider 官网概览、API、PROP、WXML、README、示例与安装产物同步更新，新增 PUI-FB-0025 和专项合同。

- 2026-07-18：增加预览区透明工具栏的顶部内距，统一消费 `--pui-preview-content-gap`（8px）；桌面语义高度由 36px 调整为 44px，390px 两行高度由 80px 调整为 88px。间距计入工具栏自身高度，不新增 Surface、空容器或页面魔法数，Tabs、右侧对齐和 PreviewDevice 几何保持原合同。更新 PUI-FB-0022。

- 2026-07-18：元素选择模式改用语义化光标：PreviewDevice 空白区保持 `default`，可选择组件元素使用 `pointer`；移除容易被理解为坐标/像素拾取的 `crosshair`，悬停轮廓、选中高亮和业务事件拦截保持不变。更新 PUI-FB-0020。

- 2026-07-18：所有标准组件 API Reference 改为“参数 / 类型 / 演示初值 / 可选值 / 说明”五列，正文由 12px caption 提升为 `body-medium` 14px；可选值直接从 Prop 的 `options/min/max/step` 派生，枚举和布尔值用逗号分隔，范围展示上下界与步长，类型列不再重复枚举。390px 使用表内横向滚动保持字号与页面边界。新增专项合同与 PUI-FB-0024。
- 2026-07-18：官网新增默认开启且可持久化的“组件边框”PUI Switch，作为第六项外观偏好；修正首版错误的 App Shell 根级作用域，Token 现在只从 PreviewDevice 内部 viewport 传给真实 PUI 组件树。关闭时组件中性 Surface 与分割线透明，PreviewDevice 外框、API、PROP、导航、工具栏和文档面板边界保持不变；焦点、错误、选中与危险状态边界继续保留且盒模型不变。复用已发布的 `pui-border-solid`，补齐 Style Utilities 分类、实时组合、WXML、H5 镜像、文档和测试。更新 PUI-FB-0023。

- 2026-07-18：重组标准组件概览工具栏：Header 只保留固定 `概览 / API / PROP` Tabs；原本分散的常规/选择元素、机型、刷新和重置统一迁入 PreviewDevice 上方的透明工具栏，模式切换在左，机型与两个 PUI IconButton 整组居右。工具栏不建立背景、边框、阴影或毛玻璃，390px 下允许换行但右侧工具组仍右对齐；PROP 的同源重置保留在 Props 标题区。新增专项布局合同与 PUI-FB-0022。

- 2026-07-18：标准组件概览操作行新增独立“重置为组件默认样式”PUI IconButton，并保留原“刷新预览”。刷新只恢复运行态和滚动、保留当前 Props；概览与 PROP 的重置共用同一函数，恢复默认 Props、默认运行态并清除失效元素选择，但不改变深浅色、阴影、毛玻璃、大圆角、渐变背景或机型。两个动作使用不同 Icon、title 与 aria-label；固定操作组宽度由 PUI Token 表达，Tabs 位置不受按钮数量影响。新增专项合同与 PUI-FB-0021。

- 2026-07-18：官网标准组件概览新增“常规 / 选择元素”双模式。常规模式保持所见即所得与真实业务交互；选择模式在捕获阶段接管 PreviewDevice 内点击和键盘选择，按 Header、Content、Footer、Close、组件主体等语义高亮元素，并在设备右侧浮出上下文 Inspector。面板仅显示当前元素可由父组件公开 Props 控制的字段，复用完整 PROP 的 PUI Input/Select/Switch/Slider/Textarea helper、校验和写回；组合子组件无父级映射时明确说明而不伪造 Prop。桌面右浮、窄屏底部覆盖均不改变固定设备几何，完整 PROP 继续只存在于 PROP 视图。新增专项合同与 PUI-FB-0020。

- 2026-07-18：重构官网左侧目录和全局搜索。生成源从“Foundation + 单一 Components 大组”改为中文优先的九组任务分类：开始与规范、基础组件、布局、导航、数据录入、数据展示、反馈、浮层、高级；组标题显示可见数量并保持清晰分区。新增 `Ctrl/⌘ + K` 快速搜索 Dialog，组合共享 PUI Input、Button、IconButton，支持中文/英文/分类搜索、方向键、Enter、Esc、Tab 焦点圈、遮罩关闭及 390px 内部滚动。新增专项合同并登记 PUI-FB-0019。

- 2026-07-18：官网新增第五项全局外观偏好“渐变背景”：入口调用共享 PUI Switch，与 theme/shadow/frost/radius 一起写入 `poemui-preview-preferences` 并逐项恢复。渐变只作用于 App Shell、透明 Preview Stage 与唯一 PreviewDevice 背景画布，组件 Surface、Scrim、浮层和布局尺寸保持不变；浅色限定 `#fafafa / #f4f4f5` 中性灰，深色保持 `#09090b / #111113` 中性黑并禁止旧靛蓝色偏。新增专项合同并更新 PUI-FB-0005。

- 2026-07-18：收口官网模拟器的深色与容器层级：删除概览中 `preview-canvas / preview-canvas__body` 可见外壳，让 Stage 直接挂载唯一 `PreviewDevice`；移除设备的旧 `phone--dark` 靛蓝调色板，统一继承全局中性主题（浅色 `#fafafa`、深色 `#09090b`，浮起 Surface 才使用 `#18181b`）。Dialog 与浮层、反馈、导航等演示中的纯布局 stage/canvas/host/frame/viewport 改为透明无边框无阴影，真实组件、scrim 与浮层 Surface 保持不变；九类浮层演示根铺满设备 viewport，遮罩不再成为局部矩形底板。更新 PUI-FB-0014、PUI-FB-0018 与专项合同。


- 2026-07-18：完成全仓 spacing 语义复核：PreviewDevice 在所有断点统一为 `14px` panel padding，viewport 直接演示根统一为 `8px` content gap 且取消首项 margin；删除 Dialog 外层私有 `16px` canvas inset，使同机型设备宽度与其他组件一致。官网 Header/Stage 原有坐标改由独立 `--pui-site-*` gutter Token 表达，固定 Tabs 两行骨架不变。清理官网 21 处 `padding-inline/block` 固定 px，全部回归 PUI step/semantic Token；新增 `test-spacing-token-contract.js` 扫描全部源码 WXSS 与官网 CSS，并锁定透明分组根与可见 PROP Surface 的 padding 边界。更新 PUI-FB-0007、PUI-FB-0014。

- 2026-07-18：继续收口 H5 原生控件边界：顶部阴影、毛玻璃、大圆角、深浅色从 `preview/index.html` 的四份静态 Switch DOM 迁入共享 `switchPreviewMarkup`，静态页面只保留 Mount；轨道和标签都走同一 Switch 交互与本地持久化。新增 `test-preview-native-control-boundaries.js`，精确锁定 44 个合法平台根，页面/演示/复合层新增 raw `button/input/select/textarea` 会直接失败。390x844 下四项全开刷新后保持，概览/API/PROP 的 Tabs 始终 `12/402/351×40px`、操作行始终 `12/450/351×36px`，零横向溢出；验收后恢复浅色全关。

- 2026-07-18：继续按真实 WXML 收口 旧输入组合层、Search、Stepper、Combobox 的 H5 输入组合：输入主体统一调用 `inputControlSample`，共享 helper 补齐 clear、maxlength、min/max/step、align、bordered 与 autofocus；前缀和清空继续调用 PUI Icon/Button。修复 `shadcn-旧输入组合层` 适配路由因直接比较 `state.current` 而无法回写输入、计数与 confirm 的问题。Search/Combobox 由 Input field 承担外观，旧输入组合层/Stepper 由唯一外壳承担 Surface，内部 Input 不再形成双层面板；Stepper 纳入全局阴影、毛玻璃和大圆角。新增四组件组合合同；390px 输入、过滤、清空、加减、四项外观持久化与零横向溢出均通过浏览器验证，验收后恢复浅色全关。

- 2026-07-18：Form、Field、Label 的 H5 演示按真实 WXML 收口 PUI Input 组合：Form 字段与两个 Slot 示例统一调用 `inputControlSample`，保留 required/invalid/name/inputmode、真实回写与焦点；修复 `shadcn-field` 别名路由只改变输入 DOM、未更新运行态的问题。删除 Form/Field/Label 外层私有输入几何及旧全局 Surface 名单，透明布局根不再套第二层面板。新增专项组合合同；390px、必填错误态、四项外观持久化和固定 Tabs 已通过浏览器验证。

- 2026-07-18：完成 H5 CSS 自定义属性闭环：继续发现并清除 3 处未定义 `--shadow-popup`、2 处 `--frost-filter`，以及状态色、Table 按压色、Upload 进度色和文档行高共 5 处未定义/拼写错误引用；分别回归 `--shadow`、`--blur`、`--subtle/surface-soft`、`--brand-soft`、`--brand` 与既有行高 Token。新增全样式表扫描，任何无 fallback 的 `var(--*)` 都必须能追溯到 CSS 或组件运行时定义。同步修正 H5 兼容文档中已废弃的三列 Inspector 页面结构。

- 2026-07-18：继续把标准组件页导航纳入 PUI 组合合同：`概览 / API / PROP` 三个入口由手写原生按钮改为共享 `buttonSample`，刷新/重置由静态按钮改为 `iconButtonSample` 挂载，状态同步不再覆盖 Button + Icon Slot 树。固定的 `40px + 8px + 36px` 两行骨架、空操作位、稳定 DOM 和滚动锚点保持不变；基础设施合同新增 raw button 回归扫描。

- 2026-07-18：完成官网全局 Typography Token 收口：H5 新增与小程序同名且按 `1px≈2rpx` 镜像的字体族、10 档角色字号/行高、5 档字重与 4 档比例行高；`preview/styles.css` 中 661 处字号、320 处行高、227 处字重及全部字体族声明改为 PUI Token，Style Utilities 比例行高也回归主题事实源。新增全局字体扫描门禁，阻止页面重新写死数字或引入第二套字体栈。

- 2026-07-18：把官网基础设施纳入 PUI 复用合同：左侧组件目录改为共享 Button + Badge，保留中文组件名、当前页语义和搜索事件；PROP 复制改为 Button + Icon；Icon 分类与资源卡改为共享 Button，卡片图形通过 `iconComponent` 渲染，不再直接注入原始 SVG。`buttonSample` 新增安全白名单 `dataAttributes` 以承接站点事件标识，复制反馈只更新 Button 内容 Slot、不再破坏 Icon；Icon 卡用 `surface/border/preview-shadow-card` Token 锁定常驻底色和四项外观。新增基础设施组合扫描门禁；组件自身平台交互根保持原合同，不机械包 Button。

- 2026-07-18：继续收口共享子组件几何：Button 内 Icon/Loading 改为精确镜像原生四档 `22/26/32/38rpx`，Checkbox、Switch、Tabbar、Steps、Radio、Rate、Upload 等组合显式向 PUI Icon/Loading helper 传入原生尺寸；删除父组件对共享子组件宽高、padding、圆角与 `!important` 的穿透覆盖，并清除不可达的私有 Choice 镜像。新增全仓原生 `pui-loading`→H5 覆盖扫描和父级几何禁写合同；标准页 Tabs 继续固定为 `40px + 8px + 36px` 两行结构，API 无按钮只隐藏内容、不折叠占位。

- 2026-07-18：完成原生 `pui-empty` 组件的 H5 状态组合总覆盖：Calendar、Collapse、Dialog、Radio、Upload 的默认 error/empty 迁入共享 `emptySample`，loading 继续调用 `loadingComponent`；严格保留 Calendar/Dialog 兄弟 Retry、Collapse/Radio/Upload Empty 内置 Action，以及 Radio/Upload 消费者 Slot。清除 Calendar/Footer、Upload 状态与方法区对 PUI Button 几何的父级覆盖，并新增全仓原生 Empty 覆盖断言；390px、真实 retry、四项外观持久化与固定 Tabs 通过浏览器验证。

- 2026-07-18：继续反查列表/菜单类 H5 默认状态：Combobox、Command、ContextMenu、NavigationMenu、List、VirtualList 的 error/empty 全部迁入共享 `emptySample`，并严格保留 Empty 内置 Action、兄弟 Retry 与 List Footer Retry 三种原生结构；消费者 custom empty Slot 保持独立。新增六组件状态组合合同，390px、真实 retry、四项外观持久化与固定 Tabs 通过浏览器验证。


- 2026-07-18：H5 复合状态继续按真实 WXML 收口：新增共享 `emptySample`，Collapsible、Table、Swiper 的默认 error/empty 不再私有拼 Icon/标题，Table Loading 文案直接交给共享 Loading。嵌入 Empty 仅移除重复 Surface，保留 PUI Empty 的小尺寸内距、语义与 Button/Icon 组合；390px、四项外观持久化、真实 retry 与固定 Tabs 几何通过浏览器验证。

- 再次固定标准组件页 Tabs：桌面 Header 从会按两侧内容高度垂直居中的 Flex 收口为“标题说明 + 270px 导航列”顶对齐 Grid；API 与 PROP 不再给机型/动作节点设置 `hidden`，节点保留原尺寸，仅以 `is-slot-hidden + visibility:hidden + disabled + aria-hidden` 退出视觉和交互。390px 的概览/API/PROP/概览四态 Tabs 始终为 `12/401.93/351×40px`，桌面 Dialog/Button/Table/Collapsible 均为 `963/81/270×40px`；API 的空操作槽仍保留 164×32px 与 36×36px，切换时页面无横向溢出。

- 继续按原生 WXML 收口 H5 组合：Data Table / Table 选择列删除私有 Checkbox Mark，统一调用共享 `checkboxSample`，全选 indeterminate、行选择和受控边界保持不变；表头 Enter/Space 排序补齐 `source=keyboard`。Swiper 加载态删除私有 `<i>` Spinner 与专用 keyframes，改用共享 `loadingComponent`。390px 下 Table 五个 Checkbox 的 28px 点击区与 15px Mark 中心偏差为 0，Swiper Loading 为 18px，页面/设备无横向溢出；四项外观刷新持久化并已恢复浅色全关。

- 固定标准组件页 Tabs 的导航几何并再次跨组件复验：`概览 / API / PROP` 继续占固定 40px 一级行，二级操作固定 36px；API 无按钮时只用 `visibility:hidden` 隐藏内容，导航父区保持 84px。390px 与 1280px 三态实测坐标完全一致。同步收口 Cell、Radio 的 H5 组合：Cell 内 Badge/Loading、Radio 内 Badge 改用共享 PUI 镜像，Radio Enter/Space 补齐 `source=keyboard`。


- 继续收口导航与流程组件的 H5 PUI 组合：Tabs、Tabbar、Steps 的入口全部从私有 raw button 迁入共享 Button default Slot；Tabs/Tabbar 徽标统一调用 Badge，Icon/Loading 和 ARIA 选择语义保持与 WXML 一致，Enter/Space 回传 `source=keyboard`。390px 下三页页面/设备无横向溢出；概览/API/PROP/概览的 Tabs top 始终为 401.93px，导航父区固定 84px，API 仅隐藏操作行内容。

- 继续收口列表型复合组件的 H5 PUI 组合：Sidebar 六个默认条目从“raw button + PUI class + 私有 Badge”迁入共享 Button default Slot，并调用 Badge/Icon/Loading；Collapse Trigger 恢复与 WXML 一致的组件自有 `DIV[role=button]`，不机械套普通 Button；SwipeCell 保留组件拖动根，动作/正文继续调用 Button/Cell，并补齐键盘来源。390px 下三页均无横向溢出；四项外观同时开启时 SwipeCell 计算为 20px 圆角、真实 blur 与 shadow。

- 固定标准组件页 Tabs 的两级导航几何：Tabs 始终占 40px 一级行，机型/刷新/重置始终占 36px 二级行，API 无按钮时只隐藏内容、不折叠结构。390px 下在 Combobox 概览/API/PROP/概览四次切换中 Tabs top 始终为 402.93px、导航区始终为 84px。同步继续收口 H5 组合：Combobox Trigger/Option 保留组件根并直接组合可关闭 Tag，Indexes 条目统一调用 Cell/Badge/Icon，Search 删除原生 WXML 不存在的四条目录结果块；三者补齐或保留真实键盘/事件边界。

- 继续收口复杂组件的 H5 PUI 组合：NavigationMenu 根入口改为共享 Button + Badge，默认菜单项改为共享 Cell；ContextMenu Trigger 保留组件根并让默认内容调用 Cell，六个动作统一调用 Button；VirtualList 外层保留 `listitem` 根，内部 Badge/Cell 调用共享助手。三者补齐 Enter/Space 的 `source=keyboard`，longpress ContextMenu 在非 manual 模式获得真实键盘打开路径。390px 与深色+阴影+毛玻璃+大圆角验证均无横向溢出。
- 继续收口官网 PUI 组合：Tag 移除包住整个组件的原生 button，Close 保留与 WXML 一致的组件自有交互根，按 14px 容器 + 12px PUI Icon 镜像并补齐 Enter/Space；隐藏态恢复入口调用 PUI Button。Bubble 的展开和 Reaction 全部改用 PUI Button，只有 Bubble Surface 保留组件根平台节点。390px 下两页无横向溢出，组件操作均真实回写且不伪造 Reaction 计数。
- 继续收口官网 PUI 组合：List 默认条目从私有原生 button 迁入共享 PUI Cell，徽标调用 Badge，Footer 调用 PUI Button，并为 Cell 补齐 Enter/Space；ScrollArea 的“顶部/底部”演示操作改为 PUI Button。同步明确 Collapse Trigger、Calendar 日期格、Rate 命中区等组件自身交互根不应被机械包进普通 Button。390px 下 List 点击真实回写、ScrollArea 内部滚动真实到达 366px，深色+阴影+毛玻璃+大圆角均无横向溢出。

- 再次收紧官网标准组件页 Tabs 的位置合同：导航父区现在显式固定为 `40px Tabs + 8px 分层间距 + 36px 操作行`，不再让父区高度依赖当前 Tab 是否有机型、刷新或重置按钮；API 继续只隐藏操作内容并保留第二行，390px 切换四次后 Tabs、操作行、工具栏和内容起点坐标均完全一致。

- 扩展官网共享 PUI 组合入口：`buttonSample` 新增默认 Slot、`role / ariaSelected / ariaExpanded`，并新增紧凑 `badgeSample`。Grid 六个入口改为 PUI Button + Badge + Icon，Command option、自定义 Trigger 与关闭操作改为 PUI Button 默认 Slot/图标按钮，保留真实禁用、`role=option`、选择态与事件，不再靠私有原生 button 维持镜像。

- 修复官网阴影开关的静默失效：Command、ContextMenu、Calendar、Dialog、Combobox 共八处引用了未定义的 `--shadow-card`，现统一消费已有 `--shadow-soft` 或既有浮层阴影 Token，并增加未定义阴影变量合同。390px 深色+阴影+毛玻璃+大圆角下，代表 Surface 的计算阴影已真实非 `none`。

- 固定官网标准组件页 Tabs：`概览 / API / PROP` 导航跨视图复用同一组 DOM，只更新选中态、`tabIndex` 与指示器；40px Tabs 行和 36px 二级操作行显式占据独立 Grid 行，API 无按钮时仅隐藏控件。分类切换改为最小范围渲染并保持滚动锚点，390px 与桌面真实坐标点击下三态 Tabs 的视口坐标完全一致。

- 收口官网 H5 组合操作：新增统一 `iconButtonSample`，把 Alert、Combobox、Command、Calendar、旧输入组合层、Upload、Search、Stepper、Spinner 的关闭、清空、翻页、步进、重试和播放/暂停迁入 PUI Button + PUI Icon 镜像；Calendar、Search、Upload、Toggle/ToggleGroup 的相邻文字操作同步复用 `buttonSample`。纯图标按钮空 content 不再占据 gap，390px 四项外观模式同时开启时 32/36px 图标按钮均保持双轴居中且无页面横向溢出。

- 统一官网组件预览设备：所有标准组件（含 Dialog）复用常驻底色的固定 `PreviewDevice`，桌面宽度跟随 375/393/430px 机型、高度固定 622px，窄屏仅收缩宽度；长内容只在内部 viewport 滚动，滚动条空闲隐藏、滚动期间显示，取消 Dialog 的透明 `height:auto` 私有例外。

- 重构官网标准组件页信息架构：统一复用 PUI Tabs 提供 `概览 / API / PROP`，概览只保留稳定预览，API Reference 独立进入 API，原右侧 Inspector 的元信息、Props、WXML 与 H5 兼容说明完整迁入 PROP；删除三列工作区和旧“预览/代码”私有 Tab。Tabs 独占固定一级分类行，机型选择与 PUI 图标刷新/重置位于固定二级行并按当前视图显隐；API 隐藏控件但保留行高，避免 Tabs 跳位。概览刷新只重建演示运行态并保留 Props。Props 与复制交互改为主内容区事件委托，WXML 示例开始过滤组件默认值，文档页筛选以内联区段承接。

- 收敛 Dialog 官网默认预览：删除 `open()/close()` 方法栏、事件链、运行状态和布局枚举等工程诊断块，隐藏态改为真实 PUI Button 打开入口；取消额外 canvas/card 装饰并复用全局固定设备面板，显隐两态高度稳定，所有动作统一使用 PUI Button/Icon 镜像合同，避免空黑 Surface、面板套面板、图标偏位和关键文字裁切。

- Style Utilities 新增 `pui-text-cut` 单行省略主入口，并保留 `pui-text-truncate` 兼容别名；小程序 WXSS、H5 镜像、Typography/Style Utilities 真实示例、文档、示例安装和 npm 产物同步更新，选择器总数增至 521。全局规则同时明确：该能力只用于允许省略的次要单行信息，不得掩盖按钮、主要状态、错误信息或布局问题。

- 修正官网全局“大圆角”只影响页面容器、没有传递到 Tag 等 PUI 组件的问题：H5 现在与小程序 `pui-radius--large` 一致，整体重映射 small/medium/large/xlarge/xxlarge 语义圆角；Tag 从普通 `6px` 切换为大圆角 `9px`，显式 round/circle 继续保持满圆，mark 仅语义小圆角端跟随模式。

- 重构 Dialog 语义结构：Header 改为 `header-left / heading / close` 三列等宽边轨，Close 回归 Header 正常文档流；Header、Content、Footer 以 `--pui-section-gap` 的 `36rpx / 18px` 分区，Footer 内部继续使用 `28rpx / 14px`，Content 直接子项统一为 `16rpx / 8px`。H5 Tag 镜像同步修复默认尺寸、圆角、拉伸和文字居中，并新增全局 `UI_DESIGN_CONTRACT.md` 固化 PUI 复用、间距层级、Slot 与预览规则。

- 收口 Dialog close 图标按钮：原生与 H5 统一使用 `72rpx / 36px` 的 PUI small circle Button、PUI close Icon 和双轴居中布局；上、右 inset 统一复用 `--pui-dialog-action-spacing`（`28rpx / 14px`），并提高最终样式优先级，防止通用 Button 规则再次把 close 覆盖成圆角方块或使空内容节点挤偏图标。

- 重构官网全局视觉偏好：深浅色、阴影、毛玻璃和大圆角全部复用 PUI Switch H5 镜像与 `role=switch` 语义，移除三种圆点按钮和独立主题控件；四项统一写入 `poemui-preview-preferences`，刷新后逐项恢复，并兼容迁移原 `poemui-preview-theme`。

- 统一 Dialog 操作区直接间距：新增 `--pui-dialog-action-spacing` 并默认指向 `--pui-panel-padding`，小程序以 `28rpx`、官网以 `14px` 同源镜像；弹窗左右/底部边距、双按钮间距和操作区上间距全部引用同一变量，Dialog 专项测试与 Feedback Ledger 阻止四处间距再次分裂。

- 建立 Component Feedback Ledger：新增结构化 JSON Schema、逐问题记录、GitHub 信息收集表单、按组件/范围/状态/类型/标签查询、自动生成索引和强制合同检查；根目录 `AGENTS.md` 规定所有后续 agent 开工前必须查询历史记录，发现可复现问题或长期设计决策必须回写。首批沉淀 Style Utilities 深色能力、真实分类预览和官网双侧栏满高三条记录，并以独立 `acceptance` 阻止 agent 把 `resolved` 自行宣布为用户已验收。

- 建立长期工程治理入口：新增根目录 `AGENTS.md` 约束后续 AI/自动化代理，新增 `CONTRIBUTING.md` 提供开发者工作流，并新增 GitHub Actions 在 push/PR 中强制执行站点构建、全部设计/布局/组件合同和 npm 打包检查；README 同步提供入口，避免 PUI 复用、Token、390px 与预览稳定性规则只存在于单次对话。


- 重建官网交互预览设备：新增可复用 `PreviewDevice` 视口，外框固定高度，长内容改为内部滚动并在状态重渲染后恢复滚动位置；同时约束 Cell 事件值的固有宽度，修复 Dialog 点击后画布增长、393px 预览被撑到 657px并横向裁切的问题。进一步逐页回归全部 83 个 npm 组件：81 个设备预览页均通过固定高度与零横向溢出检查，72 页完成一次真实点击前后测量，ConfigProvider 与 Icon 按专用文档/图标布局验收；额外修复 Badge 的固有宽度和 NavigationMenu 遮罩负 inset 溢出。

- 官网深浅色模式改为本地记忆：仅持久化合法的 `light` / `dark`，刷新与再次访问时恢复上次选择；受限浏览器中本地存储不可用或数据异常时安全回退浅色。

- 收敛官网页面信息层级：每页只保留主栏唯一组件标题与说明，删除右侧重复标题、手机假状态栏/标题、预览容器头、文档二次标题和重复的预览/文档状态汇总；设备边界与真实组件表面继续保留，右侧 Props 从“面板套字段卡片”改为分隔式表单，API 说明维持独立职责。

- Style Utilities 补齐显式深色模式与组件化分类浏览器：新增 32 个只在 `pui-theme--dark` 范围内生效的 `pui-dark-*` 文本、背景、边框和阴影变体，总选择器增至 520；官网以 PoemUI Button、Card、Icon、Tag 提供 10 类可点击筛选，并增加 compare/current/light/dark Token 对照和动态 ConfigProvider WXML。

- 左侧组件目录改为“英文主名 + 中文副名”：移除可见的 done、beta、experimental 文案，为 Foundation、shadcn 映射和 PoemUI 原生扩展统一生成 `nameEn` / `nameZh`；成熟度继续保留在数据、搜索与悬浮说明中。

- 调整官网顶部品牌区：版本号收进品牌标题行并紧跟在 PoemUI 后方，修正静态回退版本为 0.1.0；移动端继续显示版本号，避免与品牌名称脱节。

- 移除官网组件目录搜索框下方的组件总数、done、beta、experimental 四块静态统计，并清理对应计算与响应式样式；组件分组现在直接承接搜索入口，减少无操作价值的信息占位。

- 移除官网公开的“shadcn/ui 组件体系”导航、目录项和独立页面；旧路由回退到组件首页。内部 `metadata/shadcn.js` 映射与 `docs/SHADCN_COMPATIBILITY.md` 兼容矩阵继续保留，仅作为 PUI 命名和平台适配维护资料，不影响原生组件与 npm 产物。

- 统一 Style Utilities 与 Typography、Spacing 等基础文档页的字体层级：新增共享文档标题/正文/区块/元信息字号与行高 Token，移除该页独有的 22px 标题、18px 指标和全大写指标标签；代码与类名仍保留等宽字体。

- 建立全库可读性与组件组合合同：新增面板 compact/default/spacious 内距和 content gap Token，将 Body Small/Label 提升到 26rpx，并清理全部低于 24rpx 的组件与示例固定字号、低于 12px 的 H5 固定字号；Alert、Grid、Form、Search、Stepper、Toggle/ToggleGroup 改为组合 PUI Button/Input，Tag 与 H5 Cell/Tag 改用 PUI Icon，Input/Textarea 清空动作改用 Button 正式支持的 text 变体；补齐历史主题别名，并新增覆盖发布组件的自动设计合同检查。

- 重建 Style Utilities 为面向微信小程序的 utility-first 快速样式层：从 193 扩展到 487 个选择器，补齐 display/flex/grid、8 档正向 spacing 与 gap-x/y、常用分数尺寸、position/z-index、overflow/object-fit、字体、背景/边框/圆角/阴影、透明度、安全区和 120/500ms 低动效 transition；官网新增 9 类目录与实时布局组合，示例小程序真实消费 npm WXSS，并统一桌面左右侧栏的 57px 顶栏和 `100dvh` 满高计算。

- 完成 shadcn Navigation Menu / Menubar 共享映射验收：新增独立原生 `pui-navigation-menu` 四件套和 60 Props，提供最多 12 个根、每层 50 项、全树 100 项与 3 层深的平铺/分组规整，保留原始 `0/false`，支持 action/link/checkbox/radio/submenu/separator、value/expandedValue/visible/checkedValues/radioValues 五重受控、双模式/方向/位置、内部 Button/Cell/Badge/Icon/Loading/Empty、header/default/footer/empty slot、trigger/item generics、真实微信导航回调、完整事件与 10 个实例方法；H5 同步可点击根项、固定高度四状态层、钻取双 pane、Props 父级回写、390px 与 0–500ms/低动效，不依赖 hover/桌面快捷键，不离开官网或伪造 navigate-success。


- 完成 shadcn Swiper 映射验收：新增独立原生 `pui-swiper` 四件套和 42 Props，以微信 `swiper` 落地原始值受控/非受控状态、自动播放/触摸暂停、横纵/循环/margin/同屏项、可点击分页、内部箭头、计数、Image/Icon/Tag/Loading/Empty/Button、header/footer/default slot、`swiper-slide` generic、完整事件与 7 个实例方法；H5 使用 Pointer Events + transform 与循环克隆项真实镜像父级回写和 0–500ms/低动效，不以 scroll-snap、静态卡片、假恢复或假成功替代组件能力。

- 完成 shadcn Toast 公开映射验收：复用原生 `pui-toast` 的 13 Props、受控/非受控单条显隐、进入后自动关闭请求、default/success/warning/error/loading、Icon/Loading/默认 slot、`input/change/open/close`、`show()/close()` 和 0–500ms/低动效；修复 H5 进入/退场通过整段重绘吞掉 transition，以及生命周期状态选择器覆盖 Toast 内容的问题，改为同一已挂载节点切换 class、退场结束后卸载。Message 与 Toast 继续承担单条反馈，多条队列由独立 旧队列入口 提供。

- Textarea 完成 44 Props 原生交付：重建 value/defaultValue 受控/非受控状态机，补齐 maxlength UTF-16 安全截断、maxcharacter 加权计数、autosize 行数边界、三档尺寸/四类状态、Button/Icon/Loading、label/extra/footer slot、微信键盘参数、9 类事件、7 个实例方法和 0–500ms/低动效；H5 同步真实 textarea、Props 父级回写、字符截断、自动高度、方法调试、390px 与 prefers-reduced-motion，不伪造 keyboardheightchange 或业务成功。

- 完成 shadcn Tabs 映射验收：保留并收紧原生 Tabs 的 30 Props、受控/非受控值、内部 Button/Badge/Icon/Loading、单一 SelectorQuery 指示器、滚动居中、真实 touch swipe、prefix/extra/default slot、完整事件方法与 0–500ms/低动效；修复全 disabled 仍伪造活动项、touchcancel 未清理手势、指示器 opacity 也误报 animationend，以及原生/H5 用条件渲染或 display:none 令指示器和状态瞬移的问题。两端改为 grid-template-rows/opacity/transform 保留节点切换，H5 同步 DOM rect、Pointer cancel、完整 WXML 调试代码与无伪恢复边界。

- 完成 shadcn Table 映射验收：复用已交付的 39 Props 原生 Table/Data Table 状态机、真实横纵滚动、sticky 表头/左右固定列、受控选择与排序、内部 Checkbox/Tag/Icon/Loading/Empty/Button、四类 slot、完整事件方法和 0–500ms/低动效；移除 H5 独立 720ms spinner，改为 PoemUI Loading 并随 duration/easing/reduceMotion 立即生效，同时为原生与 H5 grid 补齐 loading/error 辅助语义。

- 完成 Switch 原生二元输入交付：从 6 Props 静态壳扩展为 28 项 Props，修复非受控 observer 重置和受控提前移动，补齐 value/checked/defaultValue/defaultChecked、customValue 原始值、track/label/content 来源、Icon/Loading、label/thumb/default slot、click/input/change/slot-click、6 个实例方法、三档真实尺寸和 0–500ms/低动效；H5 同步真实 role=switch、父级 Props 回写、方法调试、390px 与 prefers-reduced-motion，不把通知保存或发布结果伪造成成功。

- 完成独立 旧队列入口 消息队列交付：不再以单条 Toast/Message 冒充多条通知，补齐 30 项 Props、受控/非受控队列、maxQueue/maxVisible、仅可见条目计时、暂停/恢复余量、操作/关闭、横向滑动、header/footer/default slot、旧队列入口-item generic、完整事件与 11 个实例方法；原生四件套使用 Cell/Icon/Loading/Button 组合，H5 同步 Pointer 交互、Props 即时调试、390px 和 prefers-reduced-motion，不伪造关闭或业务成功。

- 完成 Slider 原生单滑块交付：扩展为 18 项 Props，补齐 name/blockSize、readonly、边界与数值辅助、受控/非受控合同、changing/input/change 详情、4 个实例方法、安全颜色和 0–500ms/低动效；H5 修复 shadcn 路由拖动、普通 Props 误重置、重复 slider 语义与拖动追赶动画，并以真实 range input、键盘增强、方法控制和 PoemUI Tag/Button/Cell 组合镜像，不虚构微信原生多拇指或纵向能力。

- 完成 shadcn Skeleton 映射验收：保留并收紧原生 Skeleton 的 16 Props、安全 rowCol 行列/尺寸过滤、头像与 placeholder slot、waiting/entering/visible/leaving/hidden、真实 show/hide、交叉淡入和 pulse/wave/none；修复进入首帧内容与占位同时透明造成短暂空白、退场期间修改 duration/reduceMotion 会直接卸载并丢失 hide，以及 `shadcn-skeleton` 计时器只识别字面量路由的问题。H5 改为在同一 DOM 节点上触发过渡并响应系统低动效，延迟/进入取消不伪造生命周期，也不把 loading 切换冒充数据请求成功。
- 完成 shadcn Resizable 映射与原生组件交付：新增触摸优先的双面板分栏四件套，补齐 26 项 Props、受控/非受控百分比、横纵/反向轴向、min/max/step、折叠阈值与最近展开值、first/second/handle slot、完整拖拽/取消回退事件、8 个实例方法和 0–500ms/低动效；H5 同步 Pointer Events、ARIA slider、键盘增强、Props 父级回写与 PoemUI Cell/Icon/Tag/Button 组合，不以桌面鼠标伪装小程序能力，也不把请求值冒充受控持久化结果。
- 完成 shadcn Radio Group 映射与原生 Radio 重建：以同一个 `pui-radio` 提供 options 组模式和未传 options 的单项兼容模式，补齐 32 项 Props、原始 `0/false` 值与严格去重、value/checked 受控及 default 回退、方向/位置/尺寸/表面、Icon/Badge/Loading/Empty、header/empty/content/footer/mark slot、`error > loading > content > empty`、逐项状态、完整事件、9 个实例方法和 0–500ms/低动效；H5 同步真实 button/ARIA、Props 父级回写、390px 组合和无伪发布/恢复语义，小程序 slot 直接投影且不依赖 `:empty`。
- 完成 shadcn Progress 映射验收：保留并验证原生 Progress 的 18 Props、percentage/value 优先级、线形/纯 WXML 双半圆环形、六类状态、安全颜色、Icon/label/default slot、确定/不确定态、change/complete/animationend 和 0–500ms/低动效；修复进入 indeterminate 后上一轮 animationend 仍误触发、H5 0/非法 strokeWidth/size/duration 边界与原生不一致、active 状态不跟随深色 info token、paused 错误冻结确定进度，以及低动效没有 animationend 回退的问题，补齐完整 WXML、兼容说明与持久化合同测试，不伪造业务进度或循环完成。
- 完成 shadcn Message Scroller / NoticeBar 兼容映射验收：保留并验证原生 NoticeBar 的 21 Props、受控/非受控显隐、SelectorQuery 真实溢出测量、12px 分段跑马、触摸暂停、Icon/Button/三类 slot、8 类事件和 0–500ms 生命周期；修复 0ms 非受控关闭时 close 早于 input/change、H5 受控/非受控模式切换但有效 visible 未变仍重播 entering/open、全局视觉过渡覆盖组件 duration/easing，以及官网缺失标准 easing token 导致默认 transition 整条失效的问题，补齐完整 WXML、兼容说明与持久化合同测试，不将行内公告混同为 Message/Toast 或消息队列。
- 完成 shadcn Message 兼容映射验收：保留并验证原生 Toast 的 13 Props、受控/非受控自动关闭、Icon/Loading/slot 与 0–1000ms 生命周期，修复 `shadcn-message` 路由因计时器只识别字面量 `toast` 而永久停在 entering、无法自动关闭的问题；补齐完整事件 WXML、Message/Toast 差异说明和持久化合同测试，不把自动关闭冒充业务成功，也不把 旧队列入口 队列混入单条 Message 合同。

## Unreleased


- 2026-07-24：`pui-button` 新增 `variant="transparent"`。它是保留常规 Button 尺寸、圆角、命中区与原生能力的无底色、无边界、无外投影视觉变体；`ghost` 继续兼容，Tabbar 等组合容器专用的 `surface="transparent"` 仍是独立结构边界，不与视觉变体混用。

- 2026-07-20：修复全库 H5 预览中共享 Button helper 偶尔仅输出 `.pui-button`、漏入完整变体合同的问题。现在 helper 默认进入 `pui-button-preview`，base/outline/text/ghost 分别镜像真实 Button 的 Surface 与阴影语义；Direction 恢复为透明 Provider，并在 Button 后接不透明 Cell 等 sibling 时使用 `pui-preview-elevation-clearance` 的 `--pui-preview-shadow-bleed` 安全空间，避免真实 Button 阴影被后续内容覆盖。新增跨组件阴影边界合同测试，持续保护 PreviewDevice 的滚动预览一致性。

- 2026-07-18：Icon 资源页搜索从页面私有 `.icon-search + raw input` 迁入共享 `inputControlSample(prefixIcon='search')`，Search 图形调用 PUI Icon，页面只保留查询和结果编排；新增 `--pui-site-icon-search-height` 固定 40px 工具栏控件高度，未定义 Token 扫描阻止回退到虚构的间距变量。390x844 下默认 200 项，输入 `action` 后真实筛为 16 项并在列表重绘后保持焦点，清空恢复 200 项；四项外观开启并刷新后保持，Input 为 9px 大圆角、真实 blur/shadow，document 始终 375/375px，验收后恢复浅色全关。

- 2026-07-18：继续收口标准组件页 PROP 基础设施：`renderPropsPanel` 的文本、枚举、boolean、nullable boolean、范围和 JSON 字段分别迁入共享 PUI Input、Select、Switch、Slider、Textarea helper，不再由字段卡直接手写原生 `input/select/textarea` 或私有表单皮肤；原生节点只保留为 helper 的 H5 平台层。输入、选择、开关、拖动和 JSON 均真实回写 Props/WXML并恢复焦点，非法 JSON 保留上次有效值、设置 `aria-invalid` 和危险色边界。390x844 下 Button 的 34 个字段实测为 11 Input + 9 Select + 10 Switch + 3 Slider + 1 Textarea，最小标签字号 12px、document 375/375；四项外观开启并刷新后保持，Input/Select/Textarea 为 9px 大圆角且获得真实 blur/shadow，验收后恢复浅色全关。

- 2026-07-18：再次固定标准组件页 Tabs：操作行改为稳定的“机型弹性槽 + 36px 动作槽”Grid，概览/API/PROP 只切换 Mount 的 `visibility/disabled/aria-hidden`，不再因按钮有无改变轨道；删除 `getBoundingClientRect + window.scrollBy` 的事后滚动补偿。390x844 实测四次切换 Tabs 始终为 `12/402/351×40px`、操作行始终为 `12/450/351×36px`，API 中两个槽位仍分别保持 `307×36px` 与 `36×36px`。同时把官网搜索和机型选择迁入共享 PUI Input/Select helper，移除静态原生控件、伪元素搜索图标及 `done/成熟度` 搜索语料。

- 新增独立 Direction Provider：补齐 14 项 Props、ltr/rtl/auto、显式语言/微信系统语言/fallback 解析、start/end 逻辑对齐、block/inline-block/flex/inline-flex、slot/content、resolve/ready/change/after-change、refresh/getDirection/getState 和 0–500ms/低动效；H5 同步真实 dir、navigator.language、Props 即时渲染、组合 Button/Cell/Tag 与 390px 三视觉开关，修复 1ms 低动效解析已完成但 DOM 卡在 changing 的竞态和 phone content-box 令 375/393px 镜像被横向裁切的问题，并明确不伪造旧物理 left/right 样式自动迁移或方向性图标翻转。
- 新增独立 ContextMenu：移除原先指向 ActionSheet 的 shadcn alias，补齐 48 项 Props、longpress/tap/both/manual、visible/checkedValues/radioValues 三重受控、平铺/分组动作、原始 `0/false` 值、action/checkbox/radio/submenu/separator、多组单选、平滑钻取子菜单、trigger/empty/footer slot、内部 ActionSheet/Button/Cell/Empty/Icon/Divider/Tag、`error > loading > content > empty`、完整事件和 9 个实例方法；H5 同步真实右键、500ms Pointer 长按、父级回写、双 pane 动效、390px 三视觉开关及无桌面坐标伪兼容/伪业务成功边界。
- 新增独立 Command：不复用 Combobox 选值，补齐 46 项 Props、inline/dialog、query/visible/activeValue 三重受控、平铺/分组命令、原始 `0/false` 值、关键词过滤、forceMount、循环导航、Input confirm、trigger/empty/footer slot、内部 Button/Empty/Icon/Input/Loading/Divider/Tag、`error > loading > content > empty`、完整事件、11 个实例方法和 selector query 面板高度动画；H5 同步真实输入、键盘/触摸导航、父级回写、390px 三视觉开关及无全局快捷键/伪执行成功边界。
- 新增独立 Combobox：不再把 shadcn 的可搜索组合输入映射成原生 picker Select，补齐 40 项 Props、平铺/分组选项、原始 0/false 值、value/query/visible 三重受控、单选/多选与 maxSelected、搜索关键词、创建、Tag 移除、trigger/empty/footer slot、内部 Input/Icon/Tag/Button/Loading/Empty、error > loading > content > empty、完整事件、9 个实例方法和 selector query 面板高度动画；H5 同步真实 search input、option button、局部滚动、父级回写、transitionend、390px 三视觉开关及无伪成功边界。
- 新增独立 Collapsible：不再把 shadcn 单触发器语义混入多面板 Collapse，补齐 24 项 Props、受控/非受控 open、trigger/default slot、五类主题、Icon/Loading/Empty、`error > loading > content > empty`、真实 retry、click/input/change/open/close/after-*、五个实例方法和 selector query 像素高度动画；H5 同步真实 button、scrollHeight、父级回写、transitionend、390px 三视觉开关及无伪恢复边界。
- 重建 Checkbox：移除旧 7 Props、受控点击越界、defaultChecked 重算和 H5 按钮伪复选，补齐 25 项 Props、value 兼容别名、受控/非受控选中与半选、mark/content 分区来源、三档尺寸/左右位置、block/bordered/checkAll、contentDisabled、disabled/readonly/loading/invalid/required、内部 Icon/Loading、icon/content/default slot、click/input/change、4 个实例方法和 0–500ms/低动效；H5 同步真实 input/change/indeterminate、父级回写、可操作组合清单与 390px 三视觉开关。
- 重建 Button：保留旧 theme/variant/size/shape/round/ghost/block/content/icon/loading/openType/formType 合同，扩展为 34 项 Props、五类主题、四种变体/尺寸/形状、icon 左右位置、默认/icon/suffix slot、完整 Loading 参数、原生表单与平台参数、11 类 open-type 结果事件转发和 0–500ms/低动效；loading/disabled 真实禁用根 button 并清空 open-type/form-type。H5 同步真实 click/submit/reset、平台属性检查、390px 组合和无伪授权/分享/手机号成功边界。
- 新增 Bubble：不再以静态聊天样例替代组件，补齐 25 项 Props、七种消息表面、start/end、连续消息圆角、`0/false` 回应值、默认/reactions slot、受控/非受控展开、隐藏节点高度测量、内部 Button、selectable、click/longpress/reaction、完整显隐生命周期、3 个实例方法和 0–500ms/低动效；H5 同步真实父级回写、line-clamp 外完整高度测量、深色反差、390px 三视觉开关和无伪发送/已读/AI/回应计数边界。
- 重建 Badge / Marker：移除旧 11 Props 右上角静态壳和 H5 三块假样例，保留 `count > content > value > text` 兼容优先级并补齐 27 项 Props、数值/字符串零值与上限、dot/visible、五类主题/三种变体、安全前景/背景/边框色、四角 position/offset、standalone、默认/content slot、clickable/disabled、ARIA、`click/show/hide/after-*` 和 0–500ms 保留节点进退场；H5 同步真实点击、生命周期、390px 布局和 1ms/prefers-reduced-motion，不再用点击伪造计数变化。
- 重建 Attachment / Upload：在保留 `upload/upload` npm 路径和受控 files 合同的基础上，补齐 `wx.chooseMedia` / `wx.chooseMessageFile` 双选择器、扩展名/真实大小校验、ready/uploading/success/error/paused 文件状态与 Progress、图片/视频/本地文档平台预览、loading/error/empty、files/add/empty/error slot、选择生命周期/拒绝/重试/清空/缩略图事件、6 个实例方法和 0–500ms/低动效；原生 WXML 全部改为 PoemUI Button/Image/Icon/Tag/Progress/Loading/Empty 组合，H5 使用真实 file input、Blob URL、受控回写和无伪上传成功语义。
- 完成 Spacing 间距文档交付：将 planned 的 3–5 根固定高度条和错误 px 口径替换为从 `common/style/theme.wxss` 构建的 8 档 `4–72rpx` 真实 Token，完整记录 `theme/utilities.wxss` 的 margin、padding、gap、x/y 与四向工具类、normal 无后缀规则、负间距禁用和 390px 收缩边界；官网支持档位、padding/gap/margin、数值和紧凑筛选，小程序示例直接消费 npm 工具类，不新增虚假组件目录或事件。
- 完成 Typography 字体文档交付：将 planned 的 3 行静态样例替换为由 `common/style/theme.wxss` 构建的真实字体数据，补齐 10 个 display/headline/title/body/label/caption 角色、5 档字重、系统/等宽字体、字间距、旧 small/medium/large 兼容别名，以及 `theme/utilities.wxss` 中可直接组合的角色、颜色、截断、两行省略、强制换行和等宽数字工具类；官网支持角色/字符集/指标/紧凑筛选，小程序示例直接消费 npm 工具类，不新增虚假组件目录或事件。
- 完成 Color 色彩文档交付：将 planned 的 4 个硬编码色块和错误 `<pui-color>` 代码示例替换为从 `common/style/theme.wxss` 构建的真实 light/dark Token 数据，覆盖 brand 1–10、主要动作、success/warning/danger/info、文本/背景/边框角色、对比度边界、文档筛选与可复制 WXSS/WXML；官网使用无手机外壳的文档布局，小程序示例直接消费 npm 主题变量，不新增虚假组件目录或事件。
- 重建 Watermark：移除旧 13 Props、固定 5×4 节点和 disabled 误伤默认 slot 的静态壳，补齐 26 项 Props、文字/图片组合、selector query/窗口实测、旋转包围盒 overscan、repeat/单枚、gap/offset、fullscreen、empty/disabled/ready/error、maxMarks 安全裁剪、真实 image-load/image-error、ready/change/refresh/error、refresh/getState 和 0–500ms/低动效；H5 同步真实容器测量、ResizeObserver、Props 即时铺排、390px 三视觉开关和不拦截正文操作的组合示例。
- 重建 Sticky：移除旧 6 Props `position:sticky` 自包含壳和 H5 CSS 假吸顶，补齐 20 项 Props、页面/容器滚动目标、占位测量、fixed 原始 left/width、外部 NodesRef/选择器容器边界、fullWidth/安全区、默认/content slot、真实 normal/fixed/boundary/disabled、ready/scroll/change/fixed/unfixed/boundary/error、update/refresh/getState、页面原 onPageScroll 复用恢复和 0–500ms/低动效；H5 同步局部真实滚动、边界状态、实例方法、Props 即时调试与 390px 三视觉开关。
- 重建 VirtualList：移除旧 8 Props 固定行高壳、H5“动态高度”错误描述、无受控边界和全量简化按钮列表，补齐 39 项 Props、固定行高 visible/overscan/spacer 窗口、原始 `0/false` itemKey、受控/非受控单多选、内部 Cell/Badge/Icon/Loading/Empty、header/footer/empty slot、componentGenerics item、`error > loading > content > empty`、真实 scroll-view 与 upper/lower/reach/scroll-to、完整选择/重试事件、8 个实例方法、disabled/readonly/clickable 边界和 0–500ms/低动效；H5 同步真实局部滚动窗口、父级回写、375px 三视觉开关和无伪恢复 retry。
- 重建 PullRefresh：移除旧指示器不可见、双倍位移、任意滚动位置都接管触摸和 H5 定时假成功，补齐 19 项 Props、scrollTop 顶端门禁、横纵手势/touchcancel、maxPullDistance/resistance、受控/非受控 loading、成功/失败、内部 Icon/Loading、indicator/default slot、完整 pull/ready/end/cancel/finish/reset 事件、实例方法、disabled 边界和 0–500ms/低动效；H5 同步 Pointer Events 真下拉、父级回写、390px 三视觉开关和显式 finish(true/false)。
- 重建 Overlay：移除旧 7 Props 即时 `wx:if`、受控状态越界、defaultVisible 重算和遮罩/slot 点击混用，补齐 15 项 Props、受控/非受控显隐、center/top/bottom/stretch、spacing padding、安全区、安全背景色、独立 click/content-click 关闭策略、preventScrollThrough、disabled、完整 visible/open/close/after-* 事件、实例方法和 0–500ms/低动效；H5 同步真实父级回写、保留节点进退场、局部 wheel/touchmove 阻止、390px 三视觉开关与 PoemUI 组件组合。
- 重建 DropdownMenu：移除旧 12 Props 即时条件渲染、受控状态越界、default 重算、字符串比较与平铺静态菜单，补齐 43 项 Props、单列 items/多列 columns、禁用列顺序迁移与全禁用锁定、独立受控/非受控 visible/value、原始 `0/false` 与 badge=0/dot、内部 Button/Badge/Icon/Loading/Empty、trigger/header/default/footer slot、`error > loading > content > empty`、真实 scroll-view、clickable/readonly/disabled、规范遮罩策略及旧别名、完整 visible/value/column/click/select/overlay/retry/scroll/after-* 事件、实例方法和 0–500ms/低动效；H5 同步父级回写、真实多列切换与滚动、390px 三视觉开关和无伪成功消费者回调。
- 重建 ActionSheet：移除旧 12 Props 即时 `wx:if`、受控状态越界、平铺假分组和原生/H5 裸 button，补齐 32 项 Props、受控/非受控 visible、平铺/二维/命名分组动作、原始 `0/false` value、list/grid 2–4 列、内部 Button/Loading/Empty、header/default/cancel slot、`error > loading > content > empty`、真实局部滚动、动作/取消/遮罩决策、完整 item/retry/scroll/after-* 事件、实例方法和 0–500ms/低动效；H5 同步父级回写、真实滚动、375px 四列宫格、三视觉开关和无伪成功消费者回调。
- 重建 Tooltip：移除旧 9 Props 即时 `wx:if`、静态 H5 提示和伪长按，补齐 19 项 Props、受控/非受控 visible、tap/longpress/manual、top/bottom/left/right 与 start/center/end、default reference/content slot、显示延迟与进入完成后自动隐藏、内容点击关闭、完整 reference/content/after-* 事件、`show()/hide()/toggle()` 和 0–500ms/低动效；H5 同步真实 Pointer Events 长按、父级回写、空内容保护、375px 四向布局和三视觉开关。本轮进一步统一非法 trigger、disabled 事件门禁及 offset/maxWidth/zIndex 的跨端边界，并把 Tooltip 映射同步晋级 done。
- 重建 Sheet：修复默认 slot 被嵌套 Popup 正文合同吞掉、静态把手和旧 13 Props 壳，补齐 33 项 Props、受控/非受控 visible、真实距离/速度下拉关闭、正文尺寸与 scroll-view、内部 Button/Loading/Empty、header/default/footer slot、`error > loading > empty > content`、overlay/retry/drag/scroll/after-* 事件、实例方法和 0–500ms/低动效；H5 同步 Pointer Events、window 指针收尾、实际正文滚动、375px 深色与三视觉开关、真实父级回写和无伪成功消费者回调。
- 重建 Popover：移除旧 10 Props 静态气泡、即时条件渲染、裸 H5 button 与四向简化描述，补齐 28 项 Props、受控/非受控 visible、tap/longpress/manual、top/bottom/left/right/center 五向保留节点进退场、内部 Button/Loading/Empty、title/default/footer slot、error > loading > content > empty、透明外部层/内容点击关闭、reference/overlay/content/retry/after-* 事件、实例方法和 0–500ms/低动效；H5 同步真实父级回写、375px 五向布局和无伪成功事件。
- 重建 Popup：移除原生裸 button、旧 H5 假 preventScrollThrough、内容静态壳和 duration/aria 变更重放进入动画的问题，补齐 39 项 Props、受控/非受控 visible、top/bottom/left/right/center 五向保留节点进退场、内部 Button/Loading/Empty、header/default/footer 与标题操作 slot、error > loading > content > empty、确认 loading/disabled、overlay-click/action/submit/retry/after-open/after-close、实例方法和 0–500ms/低动效；H5 同步真实父级回写、三段组合、390px 适配和无伪成功事件。
- 重建 Calendar：修复受控 value 提前变更、不存在日期滚动溢出、外月/边界与导航规则不一致以及旧 H5 仅单/范围静态壳，补齐 40 项 Props、严格日期解析、single/range/multiple、受控/非受控 value/visible、六周网格、周末/指定日期/外月禁用、maxRange/maxMultiple、月/年导航、内部 Button/Loading/Empty、header/footer/default slot、error > loading > content > empty、完整事件/实例方法和 0–500ms/低动效；H5 同步父级回写、弹层进退场和无伪成功 retry/limit。
- 重建 Data Table / Table：移除空 data/items 的三行假数据、普通 HTML table 镜像和未兑现的固定列描述，补齐 39 项 Props、原始类型 rowKey、点路径、列 valueMap/themeMap/text/tag/icon、左右固定列/sticky 表头、受控/非受控 Checkbox 选择、稳定排序、真实横纵 scroll、内部 Tag/Icon/Loading/Empty/Button、header/footer/empty/default slot、error > loading > content > empty、retry、完整事件/实例方法和 0–500ms/低动效；H5 同步真实 sticky/overflow、Props 回写和无伪成功事件，并修复退控未使用最新 default*、固定列遮盖条纹/选中背景的问题。
- 重建 CountDown：将 setInterval 次数驱动壳改为 targetTime + Date.now 的准确时钟，修复 start 前先发 change、暂停归零后重复 pause/finish、非毫秒提前显示 00、format 高位缺失时错误取模和动态刷新节奏不更新；补齐 15 项 Props、paused/autoStart 运行策略、总小时/分钟/秒、毫秒自动刷新、完成文案、prefix/suffix/default slot、页面隐藏策略、完整时间快照事件、实例方法、语义和 0–500ms/低动效，H5 只局部更新计时 DOM并使用 PoemUI Button/Icon/Tag 组合。
- 重建 List：移除 `items=[]` 假默认数据、550ms 假成功和假追加条目，补齐 31 项 Props、原始类型 value、`badge=0`、内部 Cell/Badge/Button/Empty/Loading、header/default/footer/empty slot、展示开关、边界/密度、单项与整体状态、无内容 `error > loading > empty`、有内容 footer `error > loading > finished > ready`、click/load/retry、实例方法和 0–500ms/低动效；H5 同步真实 Props、保留节点动画、消费者 slot 边界与无伪成功事件反馈。
- 重建 Sidebar：移除 items=[] 的假导航、受控 value 提前变更、defaultValue 重算、badge=0 丢失和原生裸 button/badge，补齐平铺/分组数据、原始类型 value、内部 Button/Badge/Icon/Loading、受控/非受控、default/card、尺寸/sticky、header/footer slot、clickable/readonly/disabled、error>loading>content>empty、完整事件/方法和 0–500ms/低动效；H5 同步真实 Props 回写、局部滚动、状态/插槽交互与 390px 组合预览，并抑制恢复滚动覆盖点击事件。
- 重建 Indexes：移除 items=[] 时注入的假分组、受控 value 提前变更、defaultValue 重算、裸 button 索引条和固定高度壳，补齐内部 Cell/Badge/Button/Icon/Loading、受控/非受控分组定位、手动滚动联动及程序化中间态抑制、短尾分组底边界、左右索引、sticky/标题、条目 click/select、header/footer slot、error 优先且可重试、loading/error/empty、完整事件/方法和 0–500ms/低动效；H5 同步真实局部滚动、Props 回写、stickyOffset、showIndex 内距释放和 390px 组合预览，并修复全局视觉过渡覆盖组件 duration/easing 的问题。
- 重建 BackTop：将原生裸 button、即时 `wx:if` 和无条件页面回顶壳改为内部 Button/Icon/Loading、保留节点平滑显隐和外部 scrollTop 状态机，补齐 page/container 目标、方向正确的 reach、真实 `wx.pageScrollTo` success/error/complete、受控 input/change、slot、loading/disabled、安全区、尺寸边界、实例方法和 0–500ms/低动效；H5 同步局部真实滚动、Props 回写并明确不伪造小程序页面 API 回调。
- 重建 Steps：修复受控 current 提前切换、defaultCurrent 重算、原生 button 与静态状态壳，补齐 current=-1、currentStatus/显式 item.status、内部 Button/Icon/Loading、横纵/正反序、default/dot、横滚、标题截断、description、footer slot、readonly/disabled、单项 loading、error>loading>content>empty、完整事件/方法和 0–500ms/低动效；H5 同步真实 Props 回写、状态优先级和窄屏横滚。
- 重建 Tabbar：修复受控 value 提前切换、defaultValue 重算、badge=0 丢失、裸 button/badge 和固定安全区常数占位，补齐内部 Button/Badge/Icon/Loading、受控/非受控、icon/activeIcon、badge=0/dot、单项 loading/disabled、横滚、安全颜色、action slot、error>loading>content>empty、fixed/floating + env 安全区占位、完整事件和 0–500ms/低动效；H5 同步局部 fixed、真实 Props 回写和窄屏横滚。
- 重建 Breadcrumb：修复原生裸 button、无受控边界、重复点击误报 change 和生成器覆盖风险，补齐 value/defaultValue、current 兼容入口、value=0、内部 Button/Icon/Loading、独立禁用、当前页语义、换行/横滚、字符截断、prefix/suffix slot、error>loading>content>empty、完整事件和 0–500ms/低动效；H5 同步真实 Props 回写与窄屏横滚。
- 重建 Tabs：修复受控 value 点击后提前变更、defaultValue 重算、swipeable 未实现和每项伪元素指示器瞬移，改为内部 Button/Badge/Icon/Loading、受控/非受控状态机、SelectorQuery 单一测量指示器、活动项滚动居中、真实 touch 滑动、禁用项跳过、prefix/extra/default slot、error>loading>content>empty、完整事件和 0–500ms/低动效；H5 同步 DOM 测量与 pointer 手势。
- 重建 Navbar：将原生 button 与即时 `wx:if` 壳改为内部 Button/Icon/Loading 组合，补齐左右文字与 left/title/right slot、分侧 loading/disabled、标题对齐/截断、安全区、fixed/placeholder、透明/边线、尺寸边界、受控 `input`/`change` 与保留节点 `open`/`close`、语义和 0–500ms/低动效；H5 同步局部 fixed、真实 Props 回写和 slot 消费者事件边界。
- 为 Button 补入 `ariaLabel`，使 Navbar 等图标操作在复用内部 Button 时拥有真实可访问名称；同时保护已维护组件，避免两个历史生成脚本再次覆盖真实状态机源码。
- 重建 Result：将直接 image 与原生双 button 壳改为内部 Image/Icon/Loading/Button 组合，补齐 success/error/warning/info/loading、图片 mode/size、双操作独立 loading/disabled 与整体锁定、横竖布局、default/image/actions slot、真实 `load`/`error`/`primary`/`secondary`、语义和 0–500ms/低动效；H5 同步完整 Props 与真实图片回调。
- 重建 NoticeBar：修复受控 close 越过父级、即时 `wx:if`、原生 button 和固定 8s/-8% 假跑马，补齐受控/非受控进退场、内部 Icon/Button、内容/图标/操作 slot、真实宽度 120–500ms 分段跑马、触摸暂停、完整事件、语义和低动效；H5 同步 DOM 测量和 Props 回写。
- 重建 Empty：将静态图文与原生 button 壳改为内部 Image/Icon/Button 组合，补齐图片 mode/size 边界、default/image/action slot、真实 `load`/`error`/`action`、操作 loading/disabled、主题尺寸、语义和 0–500ms/低动效；本轮进一步统一负数 imageSize、dashed Button、actionTheme/actionVariant 事件详情与 H5 可见图片错误回退。
- 重建 Skeleton：修复 rowCol 任意样式拼接、loading 即时替换内容和 1.4s pulse 超限，补齐安全嵌套行列、头像尺寸/形状、custom placeholder、延迟/交叉淡入状态机、wave/pulse/none、`show`/`hide`、语义和 0–500ms/低动效；H5 与原生示例同步真实 loading Props 回写。
- 重建 Progress：将静态宽度条扩展为线形/环形确定进度与不确定态，保留 `percentage/value` 兼容优先级，补齐状态图标、安全颜色、`change`/`complete`/`animationend`、语义、默认 slot 和 0–500ms/低动效；H5 与原生示例通过 PoemUI ButtonGroup 真实回写 Props。
- 重建 Toast：修复受控 visible 被内部计时器直接隐藏、实例方法绕过父级和即时 `wx:if` 退场，补齐受控/非受控 `input`/`change`、进入/退场后的 `open`/`close`、内部 Icon/Loading、语义、层级和 0–500ms 低动效；H5 与原生示例同步真实 Props 回写。
- 重建 Loading：将旧 500ms 即时 `wx:if` 壳改为延迟、进入、可见、退场、卸载状态机，补齐安全尺寸/颜色、全屏 token、0% 进度、默认 slot、`show`/`hide`、语义和静态低动效；Button 的内部 Loading 透传同步收敛到 0–500ms，H5 以真实 Button 回写显隐 Props。
- 完成 Upload 原生整改：以 `wx.chooseMedia` 提供受控/非受控媒体选择、删除和平台预览，补齐取消、失败、超限、语义及 0–500ms 低动效；H5 使用真实文件 input、类型/数量过滤和 Blob 预览，示例通过 change 回写受控文件。
- 完成 Rate 原生整改：修复受控值提前变更和 defaultValue 重置，补齐整星/半星触点、星数/尺寸/颜色边界、事件来源、语义和 0–500ms 低动效；H5 受控评分只走 Props 回写，示例同步真实组件评分。
- 完成 Slider 原生整改：修复受控值提前变更与 defaultValue 重置，补齐拖动起点、边界/步长和安全颜色规整、语义及 0–500ms 低动效；H5 使用真实 range input 区分 changing/change，示例同步受控发布进度。
- 完成 Stepper 原生整改：修复受控值提前变更与 defaultValue 重置，补齐边界/浮点步长规整、`previousValue` 与来源事件、焦点语义和 0–500ms 低动效；H5 受控加减与输入仅走 Props 回写，示例同步真实库存状态。
- 完成 Search 原生整改：修复受控输入和清空提前变更，补齐事件来源、语义和 0–500ms 低动效；H5 的受控输入与清空仅走 Props 回写。
- 完成 Date Picker / DateTimePicker 可交付重建：扩展为 27 个真实 Props，补齐 date/time/datetime、日期/时间独立边界和倒置交换、受控切回默认值、clear/reset/cancel、内部 Button/Icon/Loading、loading/invalid/disabled/readonly、slot、实例方法与 0–500ms 低动效；H5 同步真实浏览器 date/time input 和 Props 回写，并明确 Calendar + Popover 的可视范围选择职责，不伪造 visible/confirm/cancel。
- 完成 Popup/Sheet 浮层动效基础整改：Popup 关闭时保留节点完成 0–500ms 退场，新增语义和低动效；Sheet 透传动效配置，H5 受控显隐改为 Props 回写路径。
- 完成 Select 原生整改：`pui-select` 修复受控 value 提前变更，补齐 `0` 值、空 options、取消、禁用项边界、语义与 0–500ms 低动效；官网选择同步为 Props 回写路径。
- 完成 ScrollArea 原生整改：`pui-scroll-area` 补齐安全高度、token 内距、边线、主题、语义、disabled 触摸拦截和受控位置方法；官网回写真实 `scrollTop` 并显示原生滚动边界，示例同步 Cell + Tag 组合。
- 完成 Grid 原生整改：`pui-grid` 移除空数组默认入口与伪选中态，补齐 error/loading/empty、Badge/Loading/footer slot、语义、间距上限和 0–500ms 低动效；官网与示例同步真实 click 事件。
- 完成 Image 原生整改：`pui-image` 重建真实资源状态机，过滤 width/height、规整 mode、补齐默认 slot、禁用/语义和 0–1000ms 淡入；官网改为监听真实 image load/error，示例同步 Image + Tag slot 组合。
- 完成 Avatar 原生整改：`pui-avatar` 补齐图片/slot/Icon/文本回退优先级、真实 `load`/`error`/`click`、禁用与语义边界、0–500ms 淡入/淡出和低动效；官网改为监听真实图片事件，示例同步 Avatar + Icon slot 组合。
- 完成 Badge 原生整改：`pui-badge` 补齐安全 color、字符串数值上限/零值、尺寸/形状回退和状态语义；官网移除伪计数点击，示例同步 Badge + Icon 组合。
- 完成 Divider 原生整改：`pui-divider` 补齐 `showContent` 默认 slot、语义标签、布局规整和窄屏文本截断；官网与示例使用真实 `Tag` slot，未为纯展示组件伪造事件。
- 完成 Card 原生整改：`pui-card` 增加 `showHeader`、disabled/语义/低动效配置，修正纯 header slot、Card click 与 footer 子 Button click 的边界；官网移除伪“展开”状态，示例同步 header/content/footer 组合与真实事件回写。
- 完成 ButtonGroup 原生整改：`pui-button-group` 补齐主题同步、统一子 Button 尺寸、组级 disabled 透明拦截层、语义标签和 0–500ms 低动效；官网去除虚构的组级 `change`，改为呈现真实子 Button `click`，示例同步组合用法。
- 完成 Aspect Ratio 原生交付：`pui-aspect-ratio` 以 WXSS 百分比占位维持比例，补齐边框、圆角、安全背景、溢出、`0–500ms` 比例过渡和低动效；官网与示例同步默认 slot 的 `Icon + Tag` 组合，不再将浏览器 `aspect-ratio` 当作小程序实现。
- 完成 Alert 原生状态机整改：`pui-alert` 支持受控/非受控显隐、关闭回写、默认 slot、`input`/`change`/`open`/`close` 事件、`open()` / `close()` 方法、0–500ms 退场动画和低动效；官网与示例同步真实运行态。
- 重建 Dialog 原生交付：修复 Popup `custom-body` 缺失导致默认 slot 无法进入内容区的问题，具备稳定显隐、默认/数组/slot 动作、loading/error/empty、`overlay-click` / `retry` / `after-open` / `after-close`、实例方法和单一 Popup 进退场；官网同步真实父级回写、动作原始值、Escape 浏览器增强与 390px 镜像，并修复 icon-only 关闭按钮回退“按钮”文案、1ms 低动效生命周期卡在 entering、旧通用 Dialog grid 规则导致窄屏横向裁切，以及代码页缺失完整事件绑定的问题。
- 完成 Accordion / Collapsible 原生交付：`pui-collapse` 具备原始类型值、受控/非受控展开、异步迟到数据初始化、单开规整、0–500ms 测量高度动画、低动效、内部 Loading/Empty/Button、error > loading > empty > content 状态、`header` / `footer` slot、真实 `retry` 与 `input`/`change`/`open`/`close` 事件；官网预览和示例小程序均使用同一组交互语义。
- 完成 SwipeCell 原生交付：移除默认假动作和裸 button，新增左右动作、原始类型 value、受控/非受控方向、横纵手势判定、设备 rpx 换算、速度/距离吸附、touchcancel/滑动 click 抑制、内部 Cell/Button/Loading、默认 slot、完整事件、实例方法和 0–500ms/低动效；H5 使用 Pointer Events 镜像同一合同。
- 将 Icon 提升为 `done`：补齐小程序端 `color` 的 Canvas 实际着色、`load` / `error` 资源反馈、尺寸边界和 H5 选择与 Props/WXML 同步；示例小程序新增真实着色与事件回写场景。
- 将 PullRefresh、VirtualList、Sticky、Watermark 提升为 `done`：四者均替换历史通用壳，提供独立原生属性、交互和官网 API 调参预览；高级组件不再保留 `experimental` 发布层级。
- PullRefresh 支持触摸阈值、受控/非受控 loading、`refresh()` / `finish()`；VirtualList 支持固定行高可视窗口、overscan、滚动定位和 `item-click`；Sticky 与 Watermark 分别采用 WXSS 原生吸顶和非阻塞重复水印层。
- 将 Popup、Popover、Sheet、Tooltip 提升为 `done`：四者采用一致的受控/非受控显隐语义，显隐请求回传 `input`、`change` 和带 `source` 的生命周期事件。
- 将 shadcn Input 适配入口提升为 `done`：把旧受控提前改值的输入壳重建为 39 Props 原生状态机，补齐受控/非受控切换、微信键盘参数、尺寸/对齐、Button/Icon/Loading 与四类 slot、完整事件方法、0–500ms/低动效、H5 真输入镜像和持久化合同测试。
- 将 shadcn Item 适配入口提升为 `done`：把旧 15 Props 静态 Cell 重建为 45 Props 原生条目状态机，补齐受控/非受控 selected、`0/false`、Image/Icon/Badge/Loading、六类内容区域、right slot 事件隔离、readonly/disabled/loading、微信导航真实回调、完整实例方法、H5 可操作镜像和持久化合同测试。
- Popover 改为原生锚点气泡层，支持 `tap`、`longpress`、`manual`、四向定位、箭头和透明点击层；Tooltip 支持受控显隐、实例 `show()` / `hide()`、自动隐藏和四向定位。
- Sheet 复用 Popup 的 iOS 风格标题、安全区与遮罩能力，新增拖拽柄、回退正文与完整 API；官网预览同步展示全部属性和真实事件反馈。

## 0.1.0

- 提供可发布的微信原生 npm 运行时目录 `miniprogram_dist/`，并将全部 72 个组件目录纳入微信开发者工具的 npm 构建依赖图。
- 完成 `ConfigProvider`、`Button`、`Cell`、`Tag`、`Loading` 五个稳定组件，以及 33 个 beta 组件的公开属性、事件和 H5 参数预览。
- 完成 `Icon`、`Popup`、输入与选择、数值与进度、Tabs、Toast、Dialog 的独立原生实现；修复 `false`、`0`、空字符串等合法受控值被默认值覆盖的问题。
- 增加深浅色 token、阴影、毛玻璃和大圆角三个独立视觉开关，以及页面级快速样式集。
- 增加静态官网构建、组件目录、参数面板、设备预览、图标浏览和 H5/WXML 兼容说明。
- 增加 `_example` 真机示例；通过 tarball 安装到隔离消费者工程后，微信开发者工具 CLI 已成功构建完整运行时目录。
- 明确 34 个历史目录为 `experimental`，不再将未独立验收的兼容实现描述为生产 API。

## 0.0.1

- 初始化 PoemUI 工程、基础主题 token 和组件目录规划。
