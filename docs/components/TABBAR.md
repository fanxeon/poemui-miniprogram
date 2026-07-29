# Tabbar 组件语义合同

本文是 PoemUI Tabbar 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component tabbar`

当前对照基线为 TDesign Miniprogram 1.15.3 的 [TabBar 官方文档](https://tdesign.tencent.com/miniprogram/components/tab-bar)、[官方源码目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/tab-bar) 与 npm 固定包。2026-07-23 实际读取 `tab-bar/props.js`、`tab-bar/type.d.ts`、`tab-bar/tab-bar.{js,wxml,wxss}`、`tab-bar-item/props.js`、`tab-bar-item/type.d.ts`、`tab-bar-item/tab-bar-item.{js,wxml,wxss}`；参考不等于复制，Props、Events 与条目字段的完整清单以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- Tabbar 解决应用一级目的地之间的底部切换，不承担页面内分类、业务请求状态或路由守卫。
- 页面内分类使用 Tabs，侧边分类使用 Sidebar，顶部页面导航使用 Navbar。
- Tabbar 不内置 loading、empty、error、retry；目的地页面应自行组合 PUI Loading、Empty、Result、Button 等真实组件处理业务状态。

## 2. 固定结构与区域

```text
Tabbar wrapper
├─ Navigation(optional fixed)
│  ├─ Item × n(PUI Button)
│  │  ├─ Icon/activeIcon(optional PUI Icon)
│  │  ├─ Badge/dot(optional PUI Badge)
│  │  └─ Label(optional; icon-only 时省略)
│  └─ Safe-area spacer(optional)
└─ Placeholder(optional, only fixed)
```

- items 为空时不渲染假导航、空状态卡或占位；全部禁用时保留可见导航但没有活动项。
- fixed 只负责固定到当前页面或 PreviewDevice 底部；placeholder 只在 fixed 时预留同高空间。
- shape=round 是容器形状；theme=tag 保留为兼容主题标识，但不得为活动项或 Button 增加底色、边界、阴影、毛玻璃或圆角 Surface。所有主题的选中态只使用品牌短横、文字权重与语义状态，两者职责不得混用。

## 3. PUI 组合与依赖

- 每个目的地必须组合 PUI Button；`item-wrap` 内的 PUI Button 外部宿主本身是透明满宽的 Flex 等分轨道，Button 使用 `block` 填满该宿主，并固定组合 `variant="transparent" + surface="transparent"`：前者表达无底色、无边界、无外投影的 Button 视觉，后者由 Button 自身移除圆角、阴影与毛玻璃。`shape="normal"` 的 Tabbar 根在流内是透明屏幕附着布局，不是 Surface；仅 `shape="round"` 的根承担唯一独立 Surface。固定 normal 根只使用页面画布 Token 填补脱离文档流后暴露的窗口区域，不获得 Surface 材质。`surface=transparent` 必须在 Button 自己的原生根显式清除 `background-color` 与 `::after` 边框，不能依赖跨组件 `custom-class`、页面包装器或 Button 内容宽度决定轨道。图标与 badge/badgeDot 都进入 Button 的 `icon` Slot，标签只进入默认 Slot；`badge=0` 必须真实展示。显式 `label: ''` 的纯图标项必须传入 Button `iconOnly`，从真实组件树移除固定生成的空默认内容/后缀轨道，不能靠页面偏移或 CSS 隐藏补偿。
- 普通小程序组件节点不可直接被页面 SelectorQuery 测高；确实使用非 fixed Tabbar 的消费者若需要测高，只能使用明确全宽的普通 view 包装器。该包装器只承担布局和测量，不能提供对齐补丁。
- 应用一级目的地默认采用 `fixed=true + placeholder=false + safeAreaInsetBottom=true`：Tabbar 由组件自身固定在视口底部，不随中间内容轨道校准而移动。拥有唯一 ScrollArea 的页面必须在滚动视口高度中扣除 `112rpx + env(safe-area-inset-bottom)`，或在内容末尾预留同等安全空间，二者只能选一条；PoemUI 四个真实目的地使用前者，不再建立 placeholder 或页面私有 `bottom:0`。
- PoemUI 示例页调用 `common/utils/tabbar-page-layout`，按窗口、状态栏、原生胶囊、`112rpx` Tabbar 内容与底部安全区同步计算首帧与窗口变化后的内容高度。ScrollArea 从首帧直接挂载；页面不得在 `onShow/onReady` 再用 SelectorQuery 测量 Navbar/Tabbar 并二次改写内容轨道，也不得对相同高度重复 `setData`。这条 fixed 页面壳决定取代旧的“非 fixed 三行布局 + 包装器实测”示例决定。
- WXML 与 H5 都不得手写另一套 Button、Badge、Icon 或字符图标；H5 必须调用 `buttonSample.defaultSlot`、`iconComponent` 和 `badgeSample`。
- 不公开 action Slot。应用级创建操作应放在页面 Navbar、FAB 或内容区，不能混入目的地选择语义。

## 4. Token、间距与排版

- Surface、边界、阴影、毛玻璃、文字、禁用色、圆角和间距必须使用 PUI Token；H5 按 `1px≈2rpx` 镜像。
- `shape="normal"` 是贴合设备 viewport 的透明导航布局：流内默认无背景、无外投影、无毛玻璃，且 `bordered=false` 时无顶边；`fixed=true` 时消费当前页面画布 Token（小程序 `--pui-bg-page`、H5 `--page`）补齐底部窗口，但不能因为阴影或毛玻璃全局开关获得面板材质。`shape="round"` 才是独立悬浮 Surface，消费 glass surface、border、floating shadow、frosted filter 与语义圆角；它们都保持受全局视觉配置控制。
- 导航内容高度固定 112rpx / 56px，并公开为跨端语义 Token `--pui-tabbar-content-height`，供 BackTop 等屏幕浮动操作计算避让；它不是新的 Tabbar 高度 Prop。图标、标签和活动指示器在这一高度内垂直居中并保留标准 `space-xs` 内距。当任意目的地存在文案时，整条 Tabbar 的所有活动短横都固定使用带文案基线，纯图标目的地不得单独上移短横；只有全部目的地都没有文案时，根才进入 `all-icon-only` 节奏，把所有图标下移 `8rpx / 4px`、短横统一上收至底部 `40rpx / 20px`。消费者不得用页面 margin 或新增公开定位 Prop 覆盖。split 分隔使用 `56rpx / 28px` 的短线和专属低对比 Token，不得贯穿整高。round 使用标准页面内距和 xxlarge 圆角，不公开 height、floatingOffset、activeColor 或 inactiveColor 私有调参。
- Tabbar 内部 PUI Button 与其内容容器必须允许 Badge 的定位外扩可见；普通形态的根节点也不得裁切这一外扩区域。仅 `shape="round"` 的胶囊外轮廓可以裁切自身内容；不得用共享 Button 的 `overflow:hidden` 裁掉 badge=0、数字徽标或红点，也不得为规避裁切而删除标准 `space-xs` 内距、缩小 Badge、增加私有 padding 或降级成手写标记。
- 动效固定为 `500ms + --pui-ease-standard`；`reduceMotion=true` 和系统低动效压缩为 1ms，不公开 duration/easing。
- 目的地标签允许单行省略，因为它是可重复识别的次要导航标签；API 表格、事件 detail 和页面正文禁止省略。

## 5. 条目字段与组合边界

- items 条目只支持 label/text/title、value、icon、activeIcon、badge、badgeDot、badgeMaxCount、badgeColor、disabled、ariaLabel。
- 消费者传入的 `icon/activeIcon` 必须来自当前 PUI Icon manifest；应用新增品牌、AI 或工具目的地时，应先通过唯一 Icon 生成链建立稳定名称和字体码点，再写入 Tabbar items，禁止凭记忆填写不存在的图标或以字符图形兜底。
- 未声明 label 时按 text、title、序号依次回退；显式 `label: ''` 表示纯图标条目，必须提供 item.ariaLabel；缺失时组件以“目的地 n”提供最小辅助名称。条目 value 只接受字符串、数字或布尔值；缺失、`null`、数组、对象或函数回退条目索引。
- 不照搬 TDesign TabBarItem 的 url/linkType 自动导航：路由、登录校验和失败恢复属于应用职责，组件只发布真实 change 请求。
- 不提供 subTabBar；二级目的地应由页面内 Tabs、Sidebar 或 NavigationMenu 表达，避免底部导航层级失控。

## 6. 状态与优先级

- Tabbar 自身只有正常、活动、整体禁用和单项禁用状态；没有 readonly、loading、empty、error 或 retry。
- 受控 value 未命中、items 为空或全部禁用时保持无活动项，不自动激活禁用条目。
- `bordered` 默认 `false`，不渲染顶部边界；显式 `true` 才显示中性顶部分割线。split 默认 `true`，只在相邻目的地之间增加以 `space-normal` 上下收口的中性短分隔；不得使用贯穿导航整高的边框把目的地伪装成 Cell，不改变尺寸。

## 7. 交互、受控边界与事件

- `value !== null/undefined` 为受控模式；`value/defaultValue` 仅接受一个字符串、数字或布尔值，点击不同项先发布 click，再发布 change，父级回写前不改变活动项。
- 非受控模式只在首次使用 defaultValue；未命中或非法初值时选择第一个可用项，全部禁用时保持 null。非法受控值保持无活动项。
- value 使用严格原始值比较；数字 `0`、字符串 `'0'`、`false` 与空字符串必须互不碰撞。数组、对象与函数不是 Tabbar 的多选或对象值能力，不能通过 `any` 文档暗示支持。
- 重复点击当前项只发布 click；disabled 根或条目不发布任何事件。
- 不公开 input、retry、实例方法或自动路由；value/change 足以表达所有真实选择请求。

## 8. 可访问性

- 根使用 navigation，条目集合使用 tablist，每项使用 tab 并同步 aria-selected/aria-disabled。
- H5 条目支持 Enter/Space，并把事件 source 标记为 keyboard；禁用项不可获得选择事件。
- 当前项、禁用项和键盘焦点不能只靠颜色区分；活动指示与 focus-visible 必须保留。

## 9. H5 预览与跨端一致性

- 概览按 TDesign 的用法阅读顺序连续展示“基础用法 / 纯文字导航 / 纯图标导航 / 徽标与禁用 / 选中指示与悬浮”。每段均是可真实点击的 Tabbar，标题与示例间距为 8px、段间距为 18px；不得在 Tabbar 内引入 Sidebar 或场景筛选栏。
- 当前 Props 作用于“基础用法”；其余分区使用各自固定合同并维护独立非受控运行态。左侧代码区固定提供基础 WXML 与其余代表性 WXML，代码不会因预览点击而跳变。
- 基础 WXML 零 `bind:*`；完整 click/change 只进入 API Events，事件专项说明可展示最小绑定。
- Tabbar 是屏幕附着组件，必须使用 edge-to-edge PreviewDevice；`shape=normal` 必须从设备 viewport 左右边缘贴合，不能继承 `shadow-safe` 的父级内距。fixed 只固定在设备 viewport 内，不能逃逸到浏览器页面；只有 `shape=round` 可以使用自身的页面留白。
- H5 必须在共享 `pui-button-preview` 基线之后恢复普通 Tabbar 根节点、条目与其 content 容器的 `overflow:visible`，使 `badgeSample` 的定位层完整可见；`shape="round"` 可为胶囊轮廓保留裁切。此例外只服务于 Tabbar 内部的 PUI Badge，不得扩大为通用 Button 的溢出策略。

## 10. 响应式、主题与视觉配置

- 390px 下目的地等分并压缩标签，禁止页面级横向溢出；条目过多应由产品精简，不公开 scrollable 掩盖信息架构问题。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变背景下，`shape="normal"` 的流内根保持透明；fixed normal 只延续当前页面画布，不消费外投影或毛玻璃，它的 `bordered=true` 仅恢复中性顶部分割线。`shape="round"` 才保持单一独立 Tabbar 根 Surface 并消费 floating shadow、glass surface、frosted filter 与全局语义圆角。选中、非选中和禁用条目始终透明，禁用只降低语义色与可交互性，不能因共享 Button 的 disabled 后置规则、theme=tag 或全局外观开关重新获得底色、边界、阴影、毛玻璃或圆角。split 是 Divider 语义，`bordered=false` 也不得移除相邻项之间的微隔断。
- safeAreaInsetBottom 只增加系统安全区，不应用固定魔法高度冒充真实设备 inset。
- 微信真机深色首帧属于消费者 App 与 ConfigProvider 的共同边界：`app.json darkmode/themeLocation`、原生窗口背景、`page` 的 `prefers-color-scheme:dark` 启动底色和 `use-global-config` 的 attached 前快照必须一致。Tabbar 不公开页面背景 Prop，也不通过自身 Surface 遮盖错误的白色首帧；页面切换的纵向稳定由组件 `fixed` 布局承担，不由主题层或异步测高掩盖。

## 11. TDesign 取舍与明确禁止

- 保留 TDesign 1.15.3 的 bordered、fixed、placeholder、safeAreaInsetBottom、shape、`split=true`、theme、value/defaultValue、zIndex 主干。
- PoemUI 以 items 合并 TabBarItem 的展示数据，额外保留 disabled、ariaLabel、reduceMotion 三项跨组件合同。
- TDesign 的 value/defaultValue 类型还允许 Array；PoemUI Tabbar 是一级目的地单选组件，明确只保留单个 String/Number/Boolean，避免和多选导航或 Tabs 语义混淆。
- 禁止恢复 `scrollable/showIcon/showLabel/maxLabelLength/activeColor/inactiveColor/customAction/loading/loadingText/error/errorText/retryText/emptyText/height/floatingOffset/duration/easing`。
- 禁止恢复 `input/retry`、`select()/selectIndex()`、action Slot、假空态、假重试、自动 wx.navigateTo 和超过 500ms 的动效。

## 12. 修改闭环

1. 同步审计 `tabbar/`、PUI Button/Badge/Icon、`index.js`、metadata、H5、Props、WXML、API、兼容说明、`_example`、`miniprogram_dist` 与 npm/微信安装产物。
2. 运行 `node scripts/test-tabbar.js`、组合几何/原生控件边界/组件合同、`npm run site:build`、`npm run check` 和 `npm run pack:check`。
3. 浏览器真实点击和键盘，验证 click→change、重复点击、受控父级回写、非受控连续性、0/`'0'`/false/空字符串、disabled、badge=0/dot、纯文字、纯图标、normal/tag、normal/round、fixed/placeholder、安全区、500/1ms、390px、light/dark 和全部视觉开关。
4. 产物变化后运行 `npm run example:install` 并校验源码、dist、示例安装与 tarball；微信 CLI 失败时保留 `pending-cli`，不得手工冒充成功。
5. 新事实写入 Tabbar Feedback Ledger；用户已授权本 Goal 后续组件由 Agent 在完整证据后自主验收。

真机仍需复核 fixed/placeholder 页面占位、env(safe-area-inset-bottom)、rpx、触摸反馈、样式隔离、系统低动效和目标基础库 ARIA 支持。任何不能满足本文的实现必须写入 Ledger，不得静默绕过。
