# Navbar 组件语义合同

本文是 PoemUI Navbar 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并依次查询：

```sh
npm run feedback:list -- --component navbar
npm run feedback:list -- --scope global
```

当前对照基线为 TDesign Mini Program 1.15.3 Navbar 源码，以及微信小程序的 [`navigationStyle: "custom"` 规则](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)、[`wx.getMenuButtonBoundingClientRect()`](https://developers.weixin.qq.com/miniprogram/dev/api/ui/menu/wx.getMenuButtonBoundingClientRect.html) 和 [`wx.getWindowInfo()`](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getWindowInfo.html)。参考不等于复制；公开合同只保留 PoemUI 能在微信原生端、H5、文档和测试中真实闭环的能力。

## 1. 组件定位与适用边界

- Navbar 承载页面标题、返回意图和自定义导航栏的几何安全区；不负责路由栈、请求结果、页面内容状态或微信系统胶囊的点击行为。
- 微信 `navigationStyle: "custom"` 仍保留右上原生胶囊。默认 `capsule=true` 时，Navbar 只为它留出对称轨道，右上不放任何业务按钮、文案或伪造控制。
- Navbar 不自动调用 `wx.navigateBack`；默认返回只触发 `left-click`，消费者决定真实导航。
- Props 固定为 `title/titleMaxLength/leftArrow/leftBtn/rightBtn/fixed/placeholder/safeAreaInsetTop/capsule/visible/zIndex/loading/transparent/bordered/disabled/ariaLabel/reduceMotion`（17 个）；Events 固定为 `left-click/leftBtn/rightBtn`；Slots 固定为 `left/title/right`；0 公开 Methods。

## 2. 固定结构与语义分区

```text
系统导航层（仅 navigationStyle: custom）
└─ 微信原生右上胶囊（平台所有，PUI 不绘制、不绑定）

Navbar host
├─ Navbar(optional fixed)
│  ├─ Safe area(optional)
│  └─ Content(absolute geometry layers)
│     ├─ Left: default back PUI Button，或 leftBtn/rightBtn 内建双操作，或 left Slot（原生胶囊的左镜像区）
│     ├─ Title: title Slot + PUI Loading + text（由对称安全轨约束）
│     └─ Right: capsule=true 时为空白安全轨；false 时才渲染 right Slot
└─ Placeholder(fixed + placeholder only)
```

- `capsule=true` 时，原生端必须读取菜单矩形的 `left/right/top/bottom/width/height` 与窗口的 `windowWidth/statusBarHeight`。右侧预留宽度为 `windowWidth - left`，左右使用同宽轨道，使标题按全屏几何居中。
- 左侧轨道不能只做宽度占位：它必须以 `windowWidth - right` 作为左外边距，并在真实 `width` 对应的镜像区域内居中 left Slot / 返回按钮，使左操作中心与系统胶囊中心关于屏幕中线对称。
- `safeAreaInsetTop=true` 时 Safe area 高度读取 `statusBarHeight`，内容高度按 `2 × (top - statusBarHeight) + height` 计算；关闭安全区时以页面顶部为基线计算 `2 × top + height`。因此导航内容与系统胶囊纵向中心一致，不再依赖固定 `96rpx` 猜测。
- 窗口尺寸变化时必须重新读取窗口与菜单矩形；读取失败才分别回退 `env(safe-area-inset-top)`、`96rpx` 与主题胶囊 Token。
- `capsule=false` 用于非自定义导航栏或明确由消费者管理右侧区域的页面；恢复等宽左右轨，并允许 `right` Slot。
- `placeholder` 只在 `fixed=true` 且当前节点存在时补位，安全区与导航内容高度必须一并镜像。
- `visible=false` 先完成退场再卸载 Navbar 和占位，不使用即时 `display:none`。

## 3. PUI 组合与必须复用的子组件

- 默认返回与 `leftBtn/rightBtn` 均使用 Navbar 内部的 PUI Button + PUI Icon；标题加载使用 PUI Loading。
- H5 必须调用共享 `iconButtonSample`、`buttonSample` 和 `loadingComponent`，不得手写原生 Button、图标字符或 Spinner。
- 原生胶囊属于微信平台根，不是 PUI 子组件；H5 只用 `aria-hidden`、`pointer-events:none` 的 CSS 几何镜像，不赋予点击、菜单、关闭或成功结果。
- `left/title/right` Slot 由消费者组合 PUI Tag、Badge、Button 等；Slot 内事件属于消费者。需要两个标准可监听图标入口时使用 `leftBtn/rightBtn`，不要依赖 Slot 事件跨组件边界。若其中一项必须保留 PUI Button 的 `open-type` 等平台属性，消费者可以在唯一 `left` Slot 内组合两个紧凑 PUI IconButton，并分别绑定真实平台/业务事件；Navbar 仍只负责胶囊镜像几何。

## 4. Token、间距、字号、圆角与布局

- 内容高度、内距、分割线、Surface、阴影、毛玻璃、颜色和字号都使用现有 PUI Token。
- 原生胶囊回退几何只使用 `--pui-navbar-capsule-width/height/inset-right/reserve-fallback`；实际设备优先使用 `wx.getMenuButtonBoundingClientRect()` 和 `wx.getWindowInfo()` 写入 safe/content/inset/mirror-left/width/reserve 运行时变量，不得写死某机型 `top/right/width`。
- 原生小程序端不得依赖 CSS Grid 或 Slot 百分比宽度实现胶囊安全轨。标题和左右操作均以绝对定位读取同一组运行时几何变量，避免 Skyline 与 WebView 的布局语义差异。
- H5 镜像使用对应的 `--pui-navbar-preview-capsule-*` Token（88px × 32px、7px 右侧安全距、95px 预留），仅用于与微信 chrome 对齐。
- `titleMaxLength` 只用于主动截断；单行视觉裁切仅保护导航几何，不能隐藏关键业务信息。
- 显隐与视觉状态固定使用 500ms standard easing；`reduceMotion=true` 压缩为 1ms，不公开 `duration/easing/height/actionWidth` 私有参数。

## 5. Content、Slot 与组合边界

- `title` Slot 与文字 `title` 是追加关系；消费者使用自定义标题时应省略 `title`，不增加 `customTitle` 开关。
- `leftBtn/rightBtn` 是同一组内建左侧图标操作配置，形状固定为 `{ icon, ariaLabel }`。它们任一存在时替代默认返回与 `left` Slot，分别触发 `leftBtn` / `rightBtn`，使消费者能直接写 `bind:leftBtn` / `bind:rightBtn`。
- 未配置 `leftBtn/rightBtn` 时，`left` Slot 位于默认返回之后；需要完全自定义左侧时关闭 `leftArrow`。Slot 仍适用于非标准组合，但其业务事件不由 Navbar 转发。
- 双操作 `left` Slot 使用两个 `extra-small / text / transparent / circle / icon-only` PUI Button 与共享紧密 gap，保持在真实胶囊宽度镜像轨内。消费者不得为此穿透 Navbar、增加私有 left/top 偏移，或把平台 `open-type` 操作降级为普通 `leftBtn` 事件。
- 默认 `capsule=true` 时 `right` Slot 不渲染；这是避免右上业务内容与原生胶囊重叠的硬边界。
- 仅 `capsule=false` 时可使用 `right` Slot，且仍不提供 `rightIcon/rightText/rightLoading/rightDisabled/right-click` 平行 API。

## 6. 状态优先级、取消、失败与恢复

- `disabled` 阻止默认返回和可渲染的 Slot 指针交互，但不删除标题语义；原生胶囊由平台自行决定可用性。
- `loading` 只在默认标题区域展示 PUI Loading，不伪造页面完成，不自动禁用 Slot。
- `transparent` 关闭 Navbar 自身 Surface、阴影和毛玻璃；`bordered` 默认 `false`，以 `border-bottom:0` 而非透明边框实现，不保留边框占位；显式 `true` 才显示中性底部分割线。页面与 ScrollArea 连续排布时，滚动渐隐由 ScrollArea 的真实边缘状态负责，Navbar 不以底线补偿。
- Navbar 没有 empty/error/retry、取消确认或业务恢复状态。页面取消、失败、重试和恢复必须由路由、请求容器及相邻 PUI Loading、Empty、Result、Button 真实处理；Navbar 不显示 fake success。

## 7. 受控边界与事件顺序

- `visible` 是声明式受控呈现值，不提供 `defaultVisible`、`show()`、`hide()`、`input/change/open/close`。
- 默认返回可用时每次点击只触发一次 `left-click { source:'left' }`，不自动导航、不夹带平台原始事件和冗余 icon/text。
- 配置 `leftBtn/rightBtn` 后，Navbar 内部的两个 PUI Button 分别只触发 `leftBtn { source:'leftBtn' }` 与 `rightBtn { source:'rightBtn' }`；页面直接绑定 `bind:leftBtn`、`bind:rightBtn`，无需依赖 Slot 事件冒泡。`disabled=true` 时三个事件均不触发。
- `left/title/right` Slot 的事件顺序仍完全由消费者树决定，Navbar 不捕获或转发 Slot 内业务事件。
- 标题空字符串、`titleMaxLength=0`、`visible=false`、`bordered=false` 和 `capsule=false` 都是有效边界值。

## 8. 可访问性

- 根使用 `navigation` 语义，辅助名称按 `ariaLabel > 截断后标题 > 导航栏` 回退。
- 默认返回 Button 的名称固定为“返回”；可用 Slot 内操作由消费者提供名称。
- H5 胶囊镜像始终 `aria-hidden=true` 且不可聚焦；它不能冒充原生菜单。
- disabled、loading、透明和深浅色状态必须保持标题与焦点可辨识，不能只依靠颜色差异。

## 9. 小程序与 H5 一致性

- 小程序端保留真实微信原生胶囊，读取完整菜单矩形、窗口宽度和状态栏高度进行安全区、内容高度、对称轨与左操作镜像计算；PUI 不重复绘制胶囊。
- H5 使用同一标题截断、三列安全轨、fixed、占位、层级和 500ms/1ms 动效，并让默认返回或 `leftBtn/rightBtn` 在 88px 镜像区域内居中；不可交互胶囊镜像只表达同一空间边界。
- 概览固定分为“基础用法 / 标题与组合 / 加载与禁用 / 透明导航”；默认示例不放右侧业务操作。只有将 `capsule` 显式关闭的 API 示例可展示 `right` Slot。
- 标准 Navbar 页面使用 `edge-to-edge` PreviewDevice 父布局；fixed 只在设备 viewport 内模拟，不能污染官网页面。
- API 完整显示 17 Props、3 Events、3 Slots、0 Methods；基础 WXML 不显示默认 Props，且零 `bind:*`。

## 10. 390px、主题与全局外观

- 390px 下标题必须在对称安全轨内可读，不得与真实胶囊、返回操作或页面边缘重叠，也不得制造页面级横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变背景下必须可读；Navbar 作为全宽屏幕附着组件不因大圆角开关变成浮卡。
- 外观开关不改变 96rpx 内容高度、安全区、胶囊预留、fixed 或 placeholder 几何。胶囊镜像不承担阴影或独立浮层层级。

## 11. 明确禁止

- 禁止覆盖、复制或点击微信原生胶囊；禁止把 H5 镜像实现成可用菜单、关闭按钮或 fake success。
- 禁止 `capsule=true` 时在 `right` Slot 放置业务按钮、文案、数字角标或相似字符图标。
- 禁止恢复自动 `wx.navigateBack`、`delta`、`animation/isHiddenInSpecialScene`、`titleAlign/customTitle/leftIcon/leftText/customLeft/leftLoading/leftDisabled/leftAriaLabel/rightIcon/rightText/customRight/rightLoading/rightDisabled/rightAriaLabel/height/actionWidth/duration/easing`，以及 `right-click/input/change/open/close/show()/hide()`；两个标准图标操作只通过 `leftBtn/rightBtn` 配置及同名事件公开。
- 禁止机型硬编码、fake success、局部遮罩、页面级 fixed 污染、`display:none` 瞬移、`height:auto` transition 和超过 500ms 动效。

## 12. 修改闭环与验证交付

1. 同步审计 `navbar/`、原生页面 custom-navigation 配置、PUI Button/Icon/Loading、metadata、H5、Props、WXML、API、兼容说明、`_example`、`miniprogram_dist` 与 npm/微信安装产物。
2. 运行 `node scripts/test-navbar.js`、组件合同/组合/原生控件边界、`npm run site:build`、`npm run check` 和 `npm run pack:check`。
3. 浏览器验证 H5 胶囊镜像不可交互、标题居中、`capsule` 切换、默认返回、visible 父级写回、fixed/placeholder、安全区、disabled/loading、500/1ms、390px、light/dark 与全部外观开关。
4. 产物变化后运行 `npm run example:install` 并校验源码、dist、示例安装与 tarball；再通过微信开发者工具/真机核验 `navigationStyle: custom` 下的真实菜单矩形、fixed、安全区、rpx 网格、Slot 触摸、低动效和读屏。CLI 失败时保留 `pending-cli`，不得手工冒充成功。

任何不能满足本文的实现必须写入 Feedback Ledger，不得静默绕过。

## 13. 2026-07-27 Slot 与胶囊示例

概览固定展示单按钮 Slot、双按钮 Slot 与 `leftBtn/rightBtn` 对称胶囊组合。小程序与 H5 的双操作共享同一胶囊轨道；H5 镜像仅表达微信原生胶囊的空间边界，不能冒充原生菜单。见 `navbar/`、`miniprogram/pages/components/navbar/`、`preview/*`、`PUI-FB-0425`。
