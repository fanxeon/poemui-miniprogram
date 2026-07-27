# PoemUI × TDesign 共有组件对照治理

本文是 PoemUI 全组件 TDesign 对照 Goal 的唯一执行清单。它用于借鉴成熟小程序组件库的公开合同与演示信息架构，不把 PoemUI 改造成 TDesign 的复制品。

## 1. Goal

对 PoemUI 与 TDesign 微信小程序版共有的组件逐个执行真实 battle：审计源码和安装产物，对照双方 Props、Events、Slots、实例方法、状态和示例，再以 PoemUI 的产品语义收敛公开 API、官网演示和文档。

Button 是首个基线组件。它已经确立以下全局原则：

- 基础用法只展示完成最小任务所需的 WXML，不出现任何 `bind:*`。
- Events 在 API 的独立区域完整展示；只有事件专项示例绑定该例必需的事件。
- 常用 Props 与平台/高级 Props 分组，避免把低频能力塞进第一屏。
- 演示按用户任务分区，不展示 Props 数量、内部状态、假事件日志或平台能力假成功。
- TDesign 只提供对照证据；是否采用由 PoemUI 真实实现、微信能力、设计 Token 和用户路径共同决定。

## 2. 对照基线

- TDesign 微信小程序文档：<https://tdesign.tencent.com/miniprogram/overview>
- TDesign 官方源码：<https://github.com/Tencent/tdesign-miniprogram>
- 本轮固定 npm 参考版本：`tdesign-miniprogram@1.15.3`（2026-07-19 查询）；每项以该版本安装包内 `miniprogram_dist/<component>/props.js`、`type.d.ts`、WXML 与实现为可复现源码证据，不只读取官网表格。
- 每次进入一个组件时，必须重新访问其 TDesign 官方在线页面和官方仓库/NPM 发布页，并在该组件的合同、Ledger 与本节摘要记录 URL、查询日期、固定版本及实际读取的源码文件。官网为动态渲染、内容不可抓取或与固定包版本不一致时，在线页面仍作为产品信息来源，安装包源码才是可复现 API 事实；不得把二者之一静默省略，也不得只凭记忆设计。
- PoemUI 事实源：目标组件四件套、`metadata/components.js`、`preview/app.js`、`docs/COMPONENT_API.md`、组件专属合同、专项测试、`_example`、`miniprogram_dist` 与 Feedback Ledger。

每个组件开始时都要记录实际参考的 TDesign 页面、版本和源码文件。TDesign 后续升级不会自动改变已验收的 PoemUI 合同；要升级参考基线必须产生新的 Ledger 决策。

## 3. 共有组件判定

进入队列必须满足以下任一条件：

1. 双方存在同名公开组件；
2. 名称不同但用户任务与核心交互合同明确相同，例如 `TabBar ↔ tabbar`、`Swiper ↔ swiper`；
3. TDesign 使用父子包拆分，而 PoemUI 在一个包内承载相同能力，例如 `FormItem ↔ field`、`CheckboxGroup ↔ checkbox`。

不因局部视觉相似就强行映射。以下候选暂不进入本轮：`Segmented`、`CheckTag`、`Row/Col ↔ Grid/Direction`、`ImageViewer ↔ Image`。其中 Segmented 与 CheckTag 当前没有对应的 PoemUI 发布组件；只有真实合同审计证明用户任务一致后，才通过 Ledger 加入队列。

## 4. 每个组件的强制对照维度

### 4.1 真实实现

- PoemUI：JS/JSON/WXML/WXSS、内部依赖、npm 入口、metadata、H5 helper/showcase、Props 面板、WXML 生成、API、专属合同、示例和安装产物。
- TDesign：当前组件文档、Props、Events、Slots、External Classes、实例方法、示例分区，以及对应源码的真实默认值和事件 detail。
- 对每一项做 `保留 / 借鉴 / 收敛 / 拒绝 / 待真机` 决策，不以数量接近为目标。

### 4.2 API 取舍

- 保留能表达独立用户意图、且真实实现可闭环的能力。
- 删除重复别名、可由 Slot/组合表达的顶层 Prop、组件私有动效参数和无消费方的诊断参数。
- 常用能力放入核心 Props；微信开放能力、平台桥接和低频布局能力放入明确的高级分组。
- 受控/非受控、`0`、`false`、空字符串、禁用、只读、加载、空、错误和重试必须有确定合同。
- 不为追平 TDesign 数量复制 `external-classes`、历史兼容别名或 PoemUI 无法真实支持的能力。

### 4.3 演示与文档

- 概览按真实用户任务分区，第一组固定为“基础用法”。其 WXML 必须是最小可用示例，零 `bind:*`、零默认 Prop、零诊断信息。
- 类型、状态、样式、布局、组合等分区按组件实际需要选择，不机械复制 Button 的四组标题。
- API 固定分别展示 Props、Events、Slots、Methods；没有某类能力就不渲染空表。
- API 表格内所有文字必须完整展示；允许自然换行和窄屏纵向重排，禁止省略号、单行截断或固定高度裁切。
- 事件完整清单只在 Events；事件专项示例只绑定当前能力需要的一个或少数事件。
- H5 必须镜像真实 WXML/WXSS 和事件回写，不伪造微信授权、支付、客服、手机号等平台成功。

### 4.4 验收闭环

- 浏览器真实操作默认、active/selected、disabled/readonly、loading/empty/error/retry、受控/非受控、边界值、事件顺序、方法、动效和回写。
- 验证 390px（可用更窄设备补强）、light/dark、边框、阴影、毛玻璃、大圆角、渐变和低动效。
- 补专项合同测试；更新组件专属合同、API、H5 兼容说明、进度和 Ledger。
- 运行 `npm run site:build`、`npm run check`、`npm run pack:check`；涉及产物时再运行 `npm run example:install` 和微信 `build-npm`，核对四处文件一致性。
- `resolved` 只表示代码和验证完成；battle 的 `acceptance` 默认在用户明确确认前保持 `pending-user`。本 Goal 已在 2026-07-19 获得用户对后续组件的范围化自主验收授权：agent 只有在单组件完整审计、真实浏览器、专项测试、文档、Ledger 和构建门禁全部完成后才能标记 `accepted`，不能用授权跳过证据。

## 5. 执行队列

一次只允许一个 `in-progress`。Button 已由用户明确确认；后续组件按用户授权由 agent 逐项自主验收，当前组件完成全部门禁并记录证据后才标记 `accepted` 并进入下一项。授权只取消逐项等待，不取消顺序、battle 深度或失败阻断。

| 顺序 | PoemUI | TDesign 对照 | 状态 |
| ---: | --- | --- | --- |
| 1 | Button | Button | accepted / pending-cli |
| 2 | ConfigProvider | ConfigProvider | accepted / pending-cli |
| 3 | Icon | Icon | accepted / pending-cli |
| 4 | Divider | Divider | accepted / pending-cli |
| 5 | Cell | Cell / CellGroup | accepted / pending-cli |
| 6 | Badge | Badge | accepted / pending-cli |
| 7 | Avatar | Avatar / AvatarGroup | accepted / pending-cli |
| 8 | Image | Image | accepted / pending-cli |
| 9 | Tag | Tag | accepted / pending-cli |
| 10 | Grid | Grid / GridItem | accepted / pending-cli |
| 11 | CountDown | CountDown | accepted / pending-cli |
| 12 | Table | Table | accepted / pending-cli |
| 13 | Swiper | Swiper / SwiperNav | accepted / pending-cli |
| 14 | Collapse | Collapse / CollapsePanel | accepted / pending-cli |
| 15 | Input | Input | accepted / pending-cli |
| 16 | Field | FormItem | accepted / pending-cli |
| 17 | Textarea | Textarea | accepted / pending-cli |
| 18 | Switch | Switch | accepted / pending-cli |
| 19 | Checkbox | Checkbox / CheckboxGroup | accepted / pending-cli |
| 20 | Radio | Radio / RadioGroup | accepted / pending-cli |
| 21 | Form | Form | accepted / pending-cli |
| 22 | Picker | Picker / PickerItem | accepted / pending-cli |
| 23 | DateTimePicker | DateTimePicker | accepted / pending-cli |
| 24 | Search | Search | accepted / pending-cli |
| 25 | Stepper | Stepper | accepted / pending-cli |
| 26 | Slider | Slider | accepted / pending-cli |
| 27 | Rate | Rate | accepted / pending-cli |
| 28 | Upload | Attachments / Upload | accepted / pending-cli |
| 29 | Calendar | Calendar | accepted / pending-cli |
| 30 | Navbar | Navbar | accepted / pending-cli |
| 31 | Tabs | Tabs / TabPanel | accepted / pending-cli |
| 32 | Tabbar | TabBar / TabBarItem | accepted / pending-cli |
| 33 | Steps | Steps / StepItem | accepted / pending-cli |
| 34 | Indexes | Indexes / IndexesAnchor | accepted / pending-cli |
| 35 | Sidebar | SideBar / SideBarItem | accepted / pending-cli |
| 36 | BackTop | BackTop | accepted / pending-cli |
| 37 | Sticky | Sticky | accepted / pending-cli |
| 38 | Loading | Loading | accepted / pending-cli |
| 39 | Toast | Toast | accepted / pending-cli |
| 40 | Dialog | Dialog | accepted / pending-cli |
| 41 | Progress | Progress | accepted / pending-cli |
| 42 | Skeleton | Skeleton | accepted / pending-cli |
| 43 | Empty | Empty | accepted / pending-cli |
| 44 | NoticeBar | NoticeBar | accepted / pending-cli |
| 45 | Result | Result | accepted / pending-cli |
| 46 | PullRefresh | PullDownRefresh | accepted / pending-cli |
| 47 | Popup | Popup | accepted / pending-cli |
| 48 | Popover | Popover | accepted / pending-cli |
| 49 | ActionSheet | ActionSheet | accepted / pending-cli |
| 51 | DropdownMenu | DropdownMenu / DropdownItem | accepted / pending-cli |
| 52 | Overlay | Overlay | accepted / pending-cli |
| 53 | SwipeCell | SwipeCell | accepted / pending-cli |
| 54 | Watermark | Watermark | accepted / pending-cli |
| 55 | ScrollArea | ScrollView | accepted / pending-cli |

## 6. 单组件交付记录模板

每完成一项，在本节下追加一条摘要，并把详细事实写入组件专属合同、进度文档和 Ledger。

```text
组件：
TDesign 参考版本/页面/源码：
PoemUI 审计范围：
保留：
借鉴：
收敛或删除：
明确拒绝：
基础 WXML：
Events/Slots/Methods：
浏览器实测：
构建与产物：
Ledger：
真机风险：
验收：pending-user | user-accepted | autonomous-accepted | blocked
```

## 7. Button 基线摘要

- TDesign 1.15.3 的安装包 `button/props.js` 实际声明 30 项属性；PoemUI 当前为 29 项。共有 26 项，差异不是追求数量一致，而是下表中的有意取舍。

| 对照项 | TDesign 1.15.3 | PoemUI 决定 |
| --- | --- | --- |
| 操作主题 | `default/primary/danger/light` | 保留 `default/primary/danger`；轻量视觉由 `variant` 表达，不再增加 `light` 主题。 |
| 视觉变体 | `base/outline/dashed/text` + `ghost` Boolean | PoemUI 使用 `base/outline/text/ghost/transparent` 单一 `variant`；`transparent` 是保留常规 Button 几何的显式透明视觉，`ghost` 保留兼容，拒绝 `dashed`。`surface=transparent` 仍仅是复合容器边界。 |
| 表单动作 | `type` 映射微信 `form-type` | 使用语义更明确、与平台属性一致的 `formType`。 |
| 透传标识 | `tId/customDataset` | 不作为 Button 核心 API；调用者在组件宿主和业务闭包管理身份，不把调试标识塞入基础合同。 |
| 动效与可访问性 | 依赖公共基类与 Loading 配置 | 显式提供 `ariaLabel/reduceMotion`，共享全局动效 Token。 |
| Loading 配置 | 基本透传完整 Loading Props | 只允许 `size/theme/text/ariaLabel`，保证 Button 布局、文案和可访问名称稳定。 |
| 事件 | `tap` + 11 个微信平台事件 | `click` + 同 11 个平台事件；底层原样转发，但不进入基础 WXML。 |
| 内容区域 | `content` slot、默认 slot、suffix | 默认 slot、icon、suffix；简单正文优先默认 slot，前置图标保持明确组合边界。 |

- 核心 Props 与微信平台 Props 已分组；Events 和 Slots 已进入独立 API 区域。
- 基础 WXML 为 `<pui-button>按钮</pui-button>`，不输出任何 `bind:*`。
- 概览分为基础用法、组件类型、组件状态、组件样式；平台事件不再挤入基础演示。
- 后续演示分区标题使用语义化 section gap 与上一段内容拉开层级，首个“基础用法”不增加无意义的顶部空白。
- `loading/disabled` 阻断点击、表单和开放能力；H5 不伪造授权结果。
- 属性页兼容说明、目录 metadata 与架构示例已经同步为 `default/primary/danger` 和 `base/outline/text/ghost/transparent`；专项测试禁止重新出现旧的五主题或 `dashed`，并锁定 `variant=transparent` 与 `surface=transparent` 的职责分离，对应 Ledger 为 `PUI-FB-0047`、`PUI-FB-0328`。
- `site:build`、全库 `check`、`pack:check` 和 `example:install` 已通过；源码、`miniprogram_dist`、tarball 安装三路 Button 四件套逐字节一致。
- Button 已由用户明确验收；微信开发者工具服务端口关闭，`build-npm` 尚未生成 `miniprogram_npm`，该发布门禁继续保留为 `pending-cli`，不得把网页验收等同真机产物完成。

### Button · 2026-07-24 透明视觉变体复验

- 当日联网重读 [TDesign Button 文档](https://tdesign.tencent.com/miniprogram/components/button) 与 [官方 Button 源码目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/button)：产品文档使用 `theme`、`variant=base/outline/text` 与 `ghost`，表单动作名称为 `type`；仓库目录实际包含 `props.ts`、`type.ts`、`button.ts`、`button.wxml`、`button.less`。动态文档不作为可复现源码，项目固定对照基线仍为 `tdesign-miniprogram@1.15.3`，本次未借此升级参考包。
- 用户要求的是无边框、无底色的明确 Button 视觉入口。PoemUI 因此新增 `variant=transparent`；它保留常规 Button 尺寸、圆角、命中区、禁用和原生能力。旧 `ghost` 继续兼容，TDesign 的 `type` 继续不进入 PoemUI 的视觉 API，表单动作仍用 `formType`。
- `surface=transparent` 不复用为 `variant`：它只服务 Tabbar 等父级已承载唯一 Surface 的组合边界，并额外移除 Button 自身圆角；Tabbar 固定组合 `variant=transparent + surface=transparent`。该职责分离由 `PUI-FB-0328`、Button/Tabbar 专项测试和 H5/WXSS 同步保护。

## 8. ConfigProvider 对照摘要

- 固定参考 TDesign `1.15.3` 的官方 ConfigProvider 文档、`props.js`、`type.d.ts`、WXML 与响应式配置 Store。TDesign 公开 `globalConfig/themeVars`；PoemUI 保留面向主题和视觉效果的 8 项语义 Props、1 个 Event、1 个默认 Slot，不为了数量一致复制任意对象或任意 Token 入口。
- 借鉴 Provider + Store 的分发结构，但职责保持 PoemUI 语义：局部模式读取 Provider Props；`useGlobalConfig=true` 时由 `visualConfig` 唯一接管 `theme/shadow/frostedGlass/largeRadius/bordered`，局部相反值不再造成跨页漂移。
- 基础 WXML 收敛为 `<pui-config-provider theme="auto"><view>页面内容</view></pui-config-provider>`，零 `bind:*`；Store 初始化和每页根接入进入独立“配置作用域”说明。
- `themechange` 只在 attached 后解析出的真实 `light/dark` 变化时发出；shadow、毛玻璃、圆角和边框更新不会重复触发主题事件。
- 浏览器真实验证 8 Props、1 Event、1 Slot，局部/全局优先级、auto/light/dark、五项外观、`customClass/customStyle`、基础代码复制和 API 全文换行。390px 下 document `375/375`、PreviewDevice `351×622`、组件组 `285/285`，无横向溢出，日志为空。
- `test-config-provider`、语义合同、Button 治理合同、Dialog 以外的全库检查均通过；`pack:check` 为 324.6kB、解包 1.8MB、545 files，源码、dist 和示例 node_modules 中 ConfigProvider/Store 逐字节一致。
- `site:build`、完整 `check`、`feedback:generate/check` 和 `example:install` 当前只被既有 PUI-FB-0012 引用的微信 `miniprogram_npm` 缺失阻断；开发者工具 Service Port 关闭使 `build-npm` 无法恢复该目录。ConfigProvider 自主验收为 `accepted / pending-cli`，Ledger 为 `PUI-FB-0025`、`PUI-FB-0050`。

## 9. Icon 对照摘要

- 2026-07-25 决策升级：按用户明确要求，PoemUI 不再保留 TDesign/Vant 的图片 URL 分流，而是把全部 `pui-icon` 收敛为跨 H5/小程序一致的本地 Icon Font。公共 API 从 5 Props 收敛为 `name/size/color/ariaLabel` 4 Props；`src`、inline SVG、`icon-map.js`、CSS mask/image 与 Canvas 着色全部退出当前合同，业务图片改用 `pui-image`。生成链路新增 `icon-font-catalog.js`，H5 与小程序加载逐字节一致的内嵌 WOFF2；见 `PUI-FB-0365`。
- 2026-07-25 历史迁移说明：`PUI-FB-0364` 曾短暂保留 TDesign/Vant 的图片 URL 分流，但该过渡合同已被 `PUI-FB-0365` 明确取代。当前固定参考仍为 TDesign `1.15.3` 的 Icon 文档与安装包源码；PoemUI 只借鉴内置名称采用字体字形这一点，不保留其图片 URL 分支。当前公共 API 只有 `name/size/color/ariaLabel`，图片一律使用 `pui-image`，不得恢复 `src/load/error`、image、Canvas 或 CSS mask。
- Icon 是展示叶子：不公开 `disabled/click`，交互统一组合 PUI Button + Icon；`name` 只表示 220 个 manifest 稳定名称并映射本地嵌入 WOFF2，`premium` 固定映射既有 Lucide `crown` 的公开语义名并在生成轮廓中独立上移对齐标题视觉基线，通用 `crown` 与消费页面不承担该校正；`size` 固定 Number+rpx 且限制 8–256。基础 WXML 显式输出 `<pui-icon name="spark" />` 且零 `bind:*`；成功返回 `{ name, source: "font" }`，未知名称按名称去重报告 `unknown-icon` 并显示首字符回退，空 `ariaLabel` 为装饰性 `aria-hidden`。
- 概览按“基础用法 / 尺寸与颜色 / 图标资源”分区。搜索复用 PUI Input，分类和资源卡复用 PUI Button；Icon 独立资源页使用 copy-only 工具栏，只保留同源 WXML 复制，不泄漏元素选择、机型、刷新或重置。
- 浏览器真实验证 action 搜索 16 项、空字符串清除、status 分类 12 项、error-circle 选择与复制成功；unknown name/空 aria/8rpx 得到红色 4px `M` 回退，256rpx 得到 128px；有效 PNG 为 loaded/naturalWidth=1254，失败 SVG 为 error/naturalWidth=0，mask 与根色均为 `rgb(220,38,38)`。API 为 5 Props、2 Events、0 Slots，桌面与 390px 无截断；390px document `375/375`、grid 两列、工具区 `349/349`、copy-only 工具栏 44px。light/dark、阴影、毛玻璃、大圆角、边框、渐变和 Esc 焦点恢复均实测，结束后恢复标准浅色外观。
- `test-icon`、语义合同、设计/布局、基础设施组合、共享子组件与 CSS Token 合同通过；`pack:check` 为 324.6kB、解包 1.8MB、545 files、shasum `2eee8c2669a654f63f731a3c76634d5b38d6bc8e`。
- `site:build`、完整 `check`、`feedback:generate/check` 和 `example:install` 仍只被既有 PUI-FB-0012 引用的微信 `miniprogram_npm` 缺失阻断；开发者工具 Service Port 关闭，微信 `build-npm` 待补。Icon 自主验收为 `accepted / pending-cli`，Ledger 为 `PUI-FB-0051`、`PUI-FB-0052`、`PUI-FB-0053`；下一项 Divider 已进入 `in-progress`。

## 10. Divider 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Divider 文档、GitHub `packages/components/divider` 与安装包 `props.js/type.d.ts/WXML/WXSS`。TDesign 公开 `align/content/dashed/layout` 和命名 `content` Slot；PoemUI 保留同名 4 项核心能力，并保留解决默认 Slot 显隐确定性的 `showContent`、可访问性 `decorative/ariaLabel`，最终为 7 Props、0 Events、1 默认 Slot、0 Methods。
- 不追求 API 数量一致：继续使用稳定的默认 Slot，不破坏性改为命名 Slot；拒绝 `lineColor`、external class 和重复 style 入口。基础 WXML 收敛为 `<pui-divider />` 且零 `bind:*`，文字、对齐、虚线和 Slot 分别进入专项示例。
- 修复原生与 H5 的同一结构缺陷：根节点无条件 gap 会让默认两段横线中心断开。现在间距只属于真实 content 节点；默认实测两段 `167.5px + 167.5px`、中心 gap `0`，内容态两侧各 `10px`，left/right 短线分别为 `16px`，vertical+dashed 只保留 `1×32px` 唯一线条。原生同步增加 `aria-orientation` 派生状态。
- 概览删除“构建结果/npm 包检查/发布状态/分割线参数”等工程诊断和纵向私有 Surface，改为“基础用法 / 文字与对齐 / 布局与线型”；第一项由当前 Props 驱动，固定项只负责比较。全局 component-only 规则曾把分区 gap 压回 `8px`，现以同路径作用域修复为共享 `18px`，浏览器计算值与相邻分区几何均确认。
- 浏览器真实操作 7 个 Props：输入文字、清空到空字符串、`showContent=true` 的 PUI Tag Slot、left/right、vertical、dashed、`decorative=false` 和 ariaLabel；复制进入 success 且 WXML 零伪事件。API 为 7 Props/1 Slot/0 Events，专属说明完整换行；属性页明确 disabled/readonly/loading/empty/error/retry、受控/非受控、事件、方法和动画均不适用。390px 下 document/body/main/shell 均 `375/375`、PreviewDevice `349/349`、Showcase `293/293`、API `clipped=[]`。
- light/dark、阴影、毛玻璃、大圆角、渐变、边框和 Esc 焦点恢复均实测；五项效果组合前后 Divider 几何保持 `293×28px`，深色更新线色，边框关闭按全局中性边界合同透明化，验收后恢复 light/border-on/其余关闭。浏览器日志为空，本地与局域网服务均为 HTTP 200。
- 新增 `DIVIDER.md`、`test-divider.js` 和 Ledger `PUI-FB-0054/0055`；`precheck`、语义/设计/布局/间距/概览/复制/重置/工具栏专项合同通过，完整 `check` 除历史微信产物依赖外为 `59/60`，唯一额外失败仍是 `test-dialog` 读取缺失的微信 `miniprogram_npm`。`pack:check` 为 324.6kB、解包 1.8MB、545 files、shasum `524eac4662f46ab4bc3535d671616997f74779da`。
- `catalog:generate` 与 `miniprogram:build` 通过；直接 tarball 安装后源码、dist、示例 node_modules 的 Divider 四件套逐字节一致，JS/JSON/WXML/WXSS SHA256 分别为 `e6c8528565cb4cad30815ba97e88fb4265958ab6426de64cdf4c311a6ad15e7a`、`356076a5f7eadd08fdbb120b822968eb3d563862c43a22918de2db5c6f699e9e`、`5f6eac73c97bc06df65d4d465c405435a305caed17c18da64706c6bad16f00e6`、`23c35e804cf9622a871097e9ce0cf04ddc7de1390bad14b6038cafb02e03fd09`。
- `feedback:generate/site:build/check/example:install` 仍被 PUI-FB-0012 引用但缺失的微信 `miniprogram_npm/.../utilities.wxss` 阻断；微信 CLI 明确返回 Service Port disabled（exit 246），无法补建第四路产物。因此 Divider 自主验收为 `accepted / pending-cli`；1rpx 抗锯齿、Slot 后备顺序和微信读屏仍需合法 AppID 真机复核。下一项 Cell 已进入 `in-progress`。

## 11. Cell 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Cell 页面与 GitHub `packages/components/cell` 源码。TDesign Cell 实际为 13 Props、1 click Event、6 Slots；PoemUI 不按数量追平，最终保留能真实闭环的 28 Props、7 Events、7 Slots、0 业务 Methods。CellGroup 不作为顶层发布组件新增，而是在 `cell/cell-group` 提供 Cell 体系内部布局：负责标题、说明、Cell 间距与可选 card Surface，不承接 Cell 的业务事件或状态。
- 收敛 17 个重复 Props、3 个过程事件和 6 个实例方法：删除 Image/Badge 全量透传、custom* Slot 开关、可变 arrowIcon、delta 和 select/toggle/reset/navigate/getState 等多写入通道。Image 固定为内部 72rpx round/aspectFill，Arrow 固定 chevron-right；Badge、Tag、Button 等复杂内容通过 Slot 组合。NavigationMenu 已迁移为 value Slot 内真实 pui-badge。
- 选择合同只有 `selected/defaultSelected + click/input/change`：受控时由属性面板这个真实父级回写，非受控维护内部值，退控采用最新默认值；`allowUnselect=false` 保持已选。disabled/loading 完全阻断，readonly 只回传 blocked click；导航只在交互门禁通过后调用微信真实 API，H5 不伪造 success。
- 基础 WXML 为 `<pui-cell title="单行标题" />` 且零 `bind:*`。概览重建为“基础用法 / 多行与内容 / 状态与选择 / 组合内容”，删除方法和事件诊断卡；API 完整展示 28 Props、7 Events、7 Slots，示例只保留最小基础、受控选择、真实导航、loading 和 Slot 组合。
- 浏览器真实验证点击、Enter、受控回写、禁止反选、disabled/readonly/loading、`0/false/空字符串`、500ms/1ms 低动效、图片 load/error、组合 Button 更新 Badge、基础/当前复制、API 全文和所有视觉开关。修复当前 WXML 把空 title 回退成演示文案，以及 H5 图片 error 的 hidden 被 display:block 覆盖而仍显示破图的两个现场缺陷。
- 390px 真实 viewport 下 innerWidth `390`、document/client `375/375`、PreviewDevice `351px`、Cell `282/280px`、工具栏 `375/375`，API 四表的 190 个单元格 `clipped=[]`；light/dark、边框、阴影、毛玻璃、大圆角、渐变均实测，结束后恢复标准浅色外观，浏览器 warn/error 为 0。
- 新增 `CELL.md`、重写 `test-cell.js` 并把它纳入 `precheck`；NavigationMenu、语义、设计、概览、原生控件边界、API 可读性和共享 Loading 几何合同通过。排除既有 Ledger 前置与微信产物依赖后的全库 `59/59` 通过；`pack:check` 为 324.0kB、解包 1.8MB、545 files、shasum `20fc497ba9057d99dfbdf1da3ade0ae29ae63577`。
- 直接 tarball 安装成功；源码、`miniprogram_dist`、示例 node_modules 的 Cell 四件套逐字节一致，JS/JSON/WXML/WXSS SHA256 为 `5f84185e516f5621c85d2a43650719620bde7af4d8b9ff2a7f96ea4da1dd71f9`、`1bd8568dcd5438e696fa786e86cce3230a590b63f1ddb93b542c0cdf1c0bfccf`、`f8c06b193045462988019347ef801d4f6ba38eed5245e97f4574509bd2230637`、`5c336fbe8a40a9dacca1beb2d0736403a56af29dba26db85fdafef977d88d2a8`。
- Ledger 为 `PUI-FB-0056/0057/0058/0059`。`feedback:generate/site:build/check/example:install` 仍先被 PUI-FB-0012 引用但缺失的微信 `miniprogram_npm/.../utilities.wxss` 阻断；微信 CLI 继续返回 Service Port disabled，第四路产物未生成。Cell 自主验收为 `accepted / pending-cli`；微信导航栈、Slot 顺序、right catchtap、Image 解码和辅助技术需合法 AppID 真机复核。下一项 Badge 已进入 `in-progress`。

## 12. Badge 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Badge 文档、GitHub `packages/components/badge` 与安装包 `badge/props.js/type.d.ts/WXML/WXSS`。TDesign 实际公开 9 Props、0 Events、default/count 两个 Slots；PoemUI 最终保留 12 Props、0 Events、default/count 两个 Slots、0 Methods，其中 `theme/variant/ariaLabel` 是 PoemUI 设计语义与可访问性增量。
- 将旧 27 Props 交互状态机收敛为纯展示叶子：删除 `value/text` 别名、visible/lifecycle、可点击/禁用、独立定位开关、文字/边框颜色和动画参数。`count` 只接受 string/number/null；`0` 与字符串 `0` 服从 `showZero`，`null` 选择 count Slot，`content` 只表示宿主短文本，复杂宿主统一放 default Slot；Badge 不再拥有点击、成功或生命周期假事件。
- 基础 WXML 为 `<pui-badge count="3">消息</pui-badge>` 且零 `bind:*`。概览按“基础用法 / 红点与上限 / 尺寸与形状 / 主题与变体 / 组合用法”分区；API 完整展示 12 Props、2 Slots、0 Events，属性页与元素 Inspector 共同回写同一 Props 真相源。Grid、Radio、NavigationMenu 与示例中的旧参数同步迁移。
- 浏览器真实验证 number/string/null/false/空字符串、`showZero`、`maxCount`、dot、count Slot、content 宿主、offset、颜色、主题、变体、形状、尺寸与 ariaLabel；组合 Message Button 可点击、disabled Button 保持禁用，Badge 本身不截获或伪造事件。发现并修复“演示初值 3 被误当组件默认值，重置后仍显示 3”的真实缺陷，组件默认现稳定恢复为 `count=0`。
- 390px 下 innerWidth `390`、document/main `375/375`、PreviewDevice `349/349`、五个演示分区 `282/282`，API 64 个字段全部 `client=scroll`、`white-space:normal/text-overflow:clip`；dark、边框、阴影、毛玻璃、大圆角和渐变均实测。宿主 Cell 在组合效果下获得真实暗色 Surface、24px 圆角、shadow 与 blur，Badge 保持自身 20.03×18px 语义几何；dot 为 8×8px/999px，页面无横向溢出，浏览器日志为空，结束后恢复标准浅色外观。
- 新增 `BADGE.md`、重写 `test-badge.js` 并纳入 `precheck`，更新共享子组件和设计合同锁；Badge 专项、语义、设计、概览、复制、元素 Inspector、原生控件边界、API 可读性和排除既有环境依赖后的其余全库检查通过。`pack:check` 为 324.0kB、解包 1.8MB、545 files、shasum `7df9791eb2f2f80e5495bd25f6f640d334aef96a`。
- `catalog:generate` 与 `miniprogram:build` 通过；源码、`miniprogram_dist`、tarball 解包和直接安装的 Badge 四件套逐字节一致，JS/JSON/WXML/WXSS SHA256 分别为 `a881187991c9b1f64914d43d3469fb528508d791958eec8d53179d79a617b2ed`、`356076a5f7eadd08fdbb120b822968eb3d563862c43a22918de2db5c6f699e9e`、`9b18678563badd98af4860e5282655d05c1b511705c2a85627e0cf69a25ed6f1`、`ff533eac226619410ac6a09cf09c4ddeccd11f8130021c60abed2db60c3ae103`。
- Ledger 为 `PUI-FB-0060/0061`。`feedback:generate/site:build/check/example:install` 仍被历史 PUI-FB-0012 引用但缺失的微信 `miniprogram_npm/.../utilities.wxss` 阻断；微信 CLI 返回 Service Port disabled（exit 246），第四路产物未生成。Badge 自主验收为 `accepted / pending-cli`；rpx/px 边缘定位、Slot 动态宽度、字体回流和辅助技术仍需合法 AppID 真机复核。下一项 Avatar 已进入 `in-progress`。

## 13. Avatar 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Avatar 文档、GitHub `packages/components/avatar` 与安装包 `avatar/props.js/type.d.ts/WXML/JS`。TDesign 安装源码为 9 Props、1 error Event、默认 Slot，AvatarGroup 另有独立合同；PoemUI 最终保留 11 Props、1 error Event、1 default Slot、0 业务 Methods，不新增原本不存在的 AvatarGroup 包。
- Avatar 明确收敛为展示叶子：删除 `image` 别名、`clickable/disabled`、自身 `click/load` 和私有 `duration/easing`；保留 `src/text/alt/icon/useSlot` 回退、三档尺寸/形状、bordered、失败隐藏、ARIA 与 reduceMotion。图片 load 只更新内部 opacity，失败才向消费者发布 error；交互、disabled/loading/selected 由外层 PUI Button/Cell 承担。
- 基础 WXML 为 `<pui-avatar text="P" />` 且零 `bind:*`。概览按“基础用法 / 图片与回退 / 尺寸与形状 / 组合用法”分区，组合区使用真实 Avatar + Badge + PUI Button；点击后按钮自身回写“资料已打开”，禁用宿主保持 disabled，Avatar 内部始终没有 button。
- 浏览器真实验证有效图片、失败回退、`hideOnLoadFailed`、500ms 中间/完成态、reduceMotion=1ms、`text=0`、空字符串、Icon/Slot、尺寸/形状/边线、宿主门禁、元素选择、重置和 API 11/1/1。修复 H5 三档尺寸由旧 34/46/58px 漂移为原生 28/40/56px、缓存 image 监听、hidden 被 inline-flex 覆盖、组合反馈不可见，以及 Avatar 未消费全局 border/shadow Token。
- 390px 下 innerWidth `390`、document/main `375/375`，API 四表纵向重排，抽查与专项合同确认 `white-space:normal / text-overflow:clip / clientWidth=scrollWidth`；dark + shadow + frost + large-radius + gradient + border-off 下 Avatar 为 `40×40px / 999px`、真实 soft shadow 和透明边线，宿主 Button 为 `blur(18px) / 20px`，无页面级横向溢出，日志为空，结束后恢复标准浅色外观。
- 新增 `AVATAR.md`、`test-avatar.js`、Ledger `PUI-FB-0062/0063`，专项、语义、设计、布局、预览组合及排除既有环境依赖后的其余全库检查通过。`pack:check` 为 324.1kB、解包 1.8MB、545 files、shasum `f3bed11bff97a85da0627b00c2bdd593b1c47d4d`，tar SHA256 `957dfcf7a8fc033f292b48ba2e636f82cd20b8d347523256e60af7fc75615a87`；源码、dist、tarball 直接安装和示例 node_modules 的 Avatar 四件套逐字节一致。
- `feedback:generate/site:build/check/example:install` 外层仍被 PUI-FB-0012 引用但缺失的微信 `miniprogram_npm/.../utilities.wxss` 阻断；已直接执行其实际安装子步骤 `prepare-example.js` 并通过示例安装哈希，微信 CLI 仍返回 Service Port disabled（exit 246）。Avatar 自主验收为 `accepted / pending-cli`；微信 image 解码、rpx 抗锯齿、Slot 字体基线、辅助技术和系统低动效需合法 AppID 真机复核。下一项 Image 已进入 `in-progress`。

## 14. Image 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Image 文档、GitHub `packages/components/image` 与安装包 `image/props.js/type.d.ts/WXML/WXSS/JS`。TDesign 安装源码为 11 Props、`load/error` 两个 Events 与 `loading/error` 两个具名 Slots；PoemUI 最终保留 14 Props、2 Events、1 default Slot、0 业务 Methods。
- Image 明确收敛为资源展示叶子：删除 `clickable/disabled/click` 与私有 `duration/easing`；保留安全尺寸、十四种微信 mode、三种 shape、外部 loading/error、统一状态文案、覆盖 Slot、ARIA 与低动效，并新增真实微信 `webp`。资源状态优先级固定为 `error > loading > empty > 原生资源状态`，外部状态不伪造 load/error。
- 基础 WXML 为 `<pui-image src="{{coverUrl}}" />` 且零 `bind:*`。概览重建为“基础用法 / 加载与失败 / 裁切模式 / 形状与覆盖内容”；loading 调用共享 PUI Loading，覆盖内容调用 Tag，打开与禁用由外层 PUI Button 承担，Image 根始终是 `role=img`。
- 浏览器真实验证有效图片、缺失图片、空 `src`、缓存完成、外部 loading/error 及释放重载、`text="0"`、合法/非法尺寸、top-right/circle/Slot、lazy/webp/长按菜单、180ms/1ms、外层 Button 门禁、源码默认重置和元素 Inspector。发现并修复 H5 `lazy=true` 只改 Props/WXML 而真实 img 未写 `loading=lazy`，以及重置/默认过滤误用演示初值的两条跨端缺陷。
- 390px 下 innerWidth `390`、document/main `375/375`、PreviewDevice `349/349`、showcase `282/282`、current `280/280`；API 完整展示 14 Props、2 Events、1 Slot，所有字段 `white-space:normal / text-overflow:clip` 且无内容裁切。dark + border-off + shadow + frost + large-radius + gradient 下 Image 获得透明边线、真实 `0 8px 22px` shadow、`blur(14px)`，rectangle 大圆角为 14px，页面无横向溢出，日志为空，结束后恢复标准浅色外观。
- 新增 `IMAGE.md`、`test-image.js`、Ledger `PUI-FB-0064/0065`，并把 Image 纳入共享 Loading 几何合同、从原生控件白名单删除旧 raw button。Image 专项与排除两个既有微信产物依赖后的其余全库 `59/59` 通过；`pack:check` 为 324466 bytes、解包 1786111 bytes、545 files、shasum `46eb6693ff690a04b8d30263e8389e52d47247d3`、integrity `sha512-sj057uPx4Z5sXCh34pXWFQZpe9Ofkij7dFxeEbSyTOiwCVWr0c2mE5LKR7W90bzh8XIG/kOrxdBv/dS6YNWUFw==`，tar SHA256 `a33fb00d8a4da63dedc7271d668e91d9b5a3116ad5682114388ef087eead1c4f`。
- `catalog:generate`、`miniprogram:build` 与直接 `prepare-example.js` 通过；源码、dist、tarball 安装和示例 node_modules 的 Image 四件套逐字节一致，JS/JSON/WXML/WXSS SHA256 分别为 `b882fda02e09c3b2eaba6f539000ea7a54408be5b1662937bedcb5bb0cdbb9db`、`2741d6a65c81b666a0c2bfc000aad91619246893407874def343126b9a8b99ca`、`9550722a3be250b44ab0c9ad18000de449b799228fbad9087a09fca3574b3644`、`eb470fd3a6138589b0e55849bc53bdb95781ca6f552b2e93b11bcab0422c85de`。
- 历史 PUI-FB-0012 引用缺失的微信 `miniprogram_npm/.../utilities.wxss`，使 `feedback:generate/site:build/check/example:install` 外层前置失败；新增两条 Ledger 已单独通过 schema/路径验证，实际示例安装子步骤已通过。微信 CLI 仍为 Service Port disabled（exit 246），Image 自主验收为 `accepted / pending-cli`；微信 webp、lazy-load、长按菜单、widthFix/heightFix、rpx 抗锯齿和辅助技术需合法 AppID 真机复核。下一项 Tag 已进入 `in-progress`。
- 2026-07-20 回归 battle 再次联网读取 [官方 Image 页面](https://tdesign.tencent.com/miniprogram/components/image)、[官方源码目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/image)，并固定读取 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/image/{props.js,type.d.ts,image.js,image.wxml,image.wxss,image-info.json}`。发现 Image 常规代码区虽然已有四个演示分区，却只显示组件引用和基础用法；同时 H5 `<img>` 未监听 `load/error`，缺失资源会永久停在“加载中”。现改为同源 WXML 的五段代码正文（组件引用、基础、加载与失败、裁切、形状与覆盖内容）及 PUI Copy IconButton；H5 使用真实资源事件和缓存完成检测更新状态，外部 loading/error 仍不伪造事件。此回归的 Ledger 为 `PUI-FB-0198`，用户验收待当前完整门禁后确认。

## 15. Tag 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Tag 文档与安装包 `miniprogram_dist/tag/props.js`、`type.d.ts`、WXML/WXSS/JS。TDesign 实际公开 `closable/disabled/icon/maxWidth/shape/size/theme/variant` 8 Props、`click/close` 两个 Events 和默认内容入口；PoemUI 最终保留 9 Props、1 close Event、1 default Slot、0 业务 Methods。
- Tag 明确为展示叶子：删除与 `shape` 重复的 `round` Boolean 和无明确职责的根 `click`；保留数据驱动 `content`，普通静态文字优先默认 Slot。`shape` 单独表达 `square/round/mark`，`maxWidth` 只接受非负数字或非负 `px/rpx/%`，非法与注入式字符串直接忽略；Close 只发布 `{source:'close'}` 请求，disabled 时完全阻断。
- 基础 WXML 为 `<pui-tag>标签</pui-tag>` 且零 `bind:*`。概览按“基础用法 / 主题与变体 / 尺寸与形状 / 可关闭与长文本”分区；Close 后由父级真实卸载 Tag，并通过 PUI Button 重新挂载，不使用 Toast 或假事件日志。API 完整展示 9 Props、1 Event、1 Slot。
- 浏览器真实验证 `content=0`、空字符串、Icon、closable/disabled、120rpx 长文本、非法 `100px;color:red`、五种 theme、三种 variant/size/shape、Enter/Space Close、源码默认重置与代码复制。danger/dark/large/round 实测高度 29px、圆角 999px；120rpx 解析为 60px，内容真实 ellipsis，Close 为 14×14px 且双轴居中。发现并修复概览根遗漏 `demo-section` 导致元素选择候选为 0；修复后产生 42 个语义候选，Tag 本体 Inspector 为左侧 3 字段、右侧 6 字段。
- 390px 下 innerWidth `390`、document/body `375/375`、PreviewDevice `349/349`、四个分区均 `293/293`，页面与 Tag 无横向溢出；API 四表为 `5+4 Props / 1 Event / 1 Slot`，65 个单元格无 overflow、nowrap 或 ellipsis。dark + border-off + shadow + frost + large-radius + gradient 下 Tag 得到透明边线、`0 8px 22px` 阴影、`blur(14px)`、方形 9px 圆角，round 仍保持 999px；刷新持久化，验收后恢复标准浅色，浏览器日志为空。
- 新增 `TAG.md`、`test-tag.js`、Ledger `PUI-FB-0066/0067`，修复 H5 兼容条目连续编号合同的固定长度假设。Tag precheck 7/7 通过；排除历史 Ledger 前置后全库 59/60 通过，唯一失败是 `test-dialog.js` 读取同一缺失微信安装产物。`pack:check` 为 324847 bytes、解包 1787602 bytes、545 files、shasum `3da965e4f09742dfd40e4fa27cfe44f8b27961a9`、integrity `sha512-ekuw+NNJz8br0BpB43r+MtdcZxAta6F3RNyK7bMML8xckSv1YbsetnDRULqnBG9hHMweTouqEGsm4nVQnmkXYA==`，tar SHA256 `6e4f12159c92969712d708b34382323da4d916de101c8f52f79c120ab9d96408`。
- `catalog:generate`、`miniprogram:build` 与直接 `prepare-example.js` 通过；源码、dist、tarball 安装和示例 node_modules 的 Tag 四件套逐字节一致，JS/JSON/WXML/WXSS SHA256 分别为 `8b57e6d8fc39910406c6a17c066a84a16ac88c35ef9b6b0565e58fb94e5015c4`、`dab5863f45171fa76233ffd427dcdab92b3884ca0eee2fb44f9836e46ac11cff`、`1353f364b8aaac5b3ae70e45e2ca082a909eda76f369fc8e7074edbc1d6405dc`、`0ea90d1d407a66e7ff4a90e71eacf24ba9ec72a7eda1384f2b1bfd9403cc6349`。
- 历史 PUI-FB-0012 引用缺失的微信 `miniprogram_npm/.../utilities.wxss`，使 `feedback:generate/site:build/check/example:install` 外层前置失败；新增 Ledger 已单独通过 schema/路径验证，实际示例安装通过。微信 CLI 仍返回 Service Port disabled（exit 246），Tag 自主验收为 `accepted / pending-cli`；微信 tap/catchtap、rpx 字体与命中区、Slot 组合和辅助技术需合法 AppID 真机复核，旧 `round/bind:click` 消费者需迁移。下一项 Grid 已进入 `in-progress`。

## 16. Grid 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Grid 文档与安装包 `miniprogram_dist/grid/props.js`、`grid-item/props.js`、类型、WXML、WXSS 和 JS。TDesign 以 Grid + GridItem 暴露 14 个不重复 Props 和 GridItem `click`；PoemUI 不新增第二个 GridItem 组件，保留数据驱动单组件，并收敛为 14 Props、2 Events、0 Slots、0 Methods。
- 最终公开 Props 为 `items/column/gutter/border/align/disabled/loading/error/loadingText/errorText/emptyText/retryText/ariaLabel/reduceMotion`；Item schema 固定为 `{ label, description, value, icon, badge, theme, disabled, ariaLabel }`。删除 `hover`、根 `theme`、`showFooter`、`duration/easing` 和 footer Slot：反馈由 Button 自身承担，主题属于 Item，状态动效固定 500ms、低动效 1ms。`column=0` 表达局部横向滚动，值归一化保留 `0/false/空字符串`。
- loading/error/empty 使用同一持久布局层，通过 `opacity/transform/visibility` 过渡，不对 `height:auto` 动画，也不使用 `display:none` 瞬移；loading 组合 PUI Loading，error/empty 组合透明嵌入式 PUI Empty，retry 只发布请求，错误态必须等待父级真实回写。基础 WXML 为 `<pui-grid />`，演示数据通过 `items="{{entries}}"` 进入，不展示无关 `bind:*`。
- 官网重建为“基础用法 / 列数与间距 / 徽标与禁用 / 加载、空与错误”四段，真实组合 Button、Badge、Icon、Loading、Empty。点击“主题”真实回写 `click：主题 / 0 / pointer`；错误态 Retry 后保持错误并显示“已请求重试，等待父级更新”，没有 fake success。属性页使用源码默认空 items，重置后 ARIA 为“宫格导航”且 WXML 精确恢复 `<pui-grid />`。
- 浏览器捕捉到状态过渡 55ms 中间帧 `content opacity=0.519479 / error opacity=0.480521`，完成态分别为 0/1；`reduceMotion=true` 后状态层 transition 为 `0.001s`。API 完整展示 14 Props、2 Events、0 Slots，94 个单元格无 nowrap、ellipsis 或裁切。390px 下 document/body `375/375`、当前组件 `280/280`；`column=0` 的 Grid 为 `clientWidth=280 / scrollWidth=424`，溢出被限制在组件自身横向滚动，不产生页面级溢出。
- dark + border-off + shadow + frost + large-radius + gradient 下根 Surface 为 `rgba(39,39,42,.74)`、边框透明、圆角 14px、真实 shadow 与 `blur(18px) saturate(1.35)`，页面仍为 `375/375`；结束后恢复浅色标准组合，浏览器 warning/error 为 0。新增 `GRID.md`、`test-grid.js`、Ledger `PUI-FB-0068/0069`，并修复 Empty 对已删除 Image Props 的陈旧透传；Grid precheck 8/8、排除两个既有微信安装产物阻断后的其余全库 59/59 通过。
- `pack:check` 为 325900 bytes、解包 1791182 bytes、545 files、shasum `aca895c5590fc5b8a0b16464179acdde154b497d`、integrity `sha512-pQfFam71yseq1iEVcvjJ3omuPGudsFYrqhpwhHLsZdJhZO/HFDxQTdtmbWFT/j4QciCKKaRppktFs3eXILCD9Q==`，tar SHA256 `8ece1bbcb8ba817fe50618961b58b1360e05a781f800ab67bae3e4ab5e7eec34`。源码、dist、tarball 和示例 node_modules 的 Grid JS/JSON/WXML/WXSS SHA256 分别一致为 `ae3a94455ffa5bc85375b51809c143be966d648f5eb4cff0f7d40e3174f78b0e`、`b1ea6ae938d5be0d90a8c53c085e7efa69173ba8d1b447d9222c7201d4e62953`、`611e01cdf8c3ac5cba40aaaaa73058dcbaf5ae0c5eca52d7376f88789d318018`、`f1c5f4ac1eabed04853475628cec70762ad3cff8b718b7ed30897441757b2f9b`。
- 历史 PUI-FB-0012 引用缺失微信 `miniprogram_npm`，使 `feedback:generate/site:build/check/example:install` 外层前置失败；直接 `prepare-example.js`、catalog 与 dist 生成均通过。微信 CLI 仍为 Service Port disabled（exit 246），Grid 自主验收为 `accepted / pending-cli`；微信 scroll-view 手势、Button tap/catchtap、Badge/Empty Slot 样式隔离、rpx 间距和辅助技术需合法 AppID 真机复核。下一项 CountDown 已进入 `in-progress`。

## 17. CountDown 对照摘要

- 固定参考 TDesign `1.15.3` 官方 CountDown 文档与安装包 `miniprogram_dist/count-down/props.js`、`type.d.ts`、WXML、WXSS 和 JS。TDesign 公开 8 Props、2 Events 与 `start/pause/reset`；PoemUI 最终保留 11 Props、2 Events、1 default Slot、4 Methods。
- 最终 Props 为 `time/autoStart/paused/content/format/millisecond/size/theme/splitWithUnit/ariaLabel/reduceMotion`。删除 `finishText/customContent/pauseOnHidden/duration/easing`，删除重复的 `start/pause/reset` Events、`restart/getRemaining` 和 prefix/suffix Slots；保留 PoemUI 的声明式 paused、ARIA、统一低动效与真实 `getTime()`。
- 计时仍以 `targetTime - Date.now()` 为唯一运行真相。`autoStart` 只决定挂载、time 更新和 reset 后是否启动，运行中改为 false 不偷停；`paused=false` 只恢复由 paused 造成的暂停。自然归零固定先发布最后 change、再且仅发布一次 finish，初始化或 reset 到0不伪造完成。
- 基础 WXML 为 `<pui-count-down />`，零 `bind:*`。官网重建为“基础用法 / 主题与尺寸 / 单位与毫秒 / 控制与自定义内容”四区，Start/Pause/Reset/读取剩余均调用真实 PUI Button 和同一计时状态机；API 新增共享 Methods 分类并完整展示 11/2/1/4。
- 浏览器实测150秒演示显式复制 `time={{150000}}`，源码重置恢复0秒和自闭合 WXML；3秒 autoStart=false 启动后正确完成，运行中 autoStart=false 不暂停，paused 冻结和恢复正确，slot+`HH:mm:ss.SSS`+millisecond+large+round+unit 同时生效，reduceMotion 为1ms。
- 390px 下 document/body `375/375`、PreviewDevice `349/349`、代码区 `340/340`，API 六表均 `349/349`；桌面六表 `955/955`、clipped=0，全部文字自然换行。dark、border、shadow、frost、large-radius、gradient 逐项实测并恢复 light 标准组合，浏览器日志为空。
- 审计额外修复 time 属性上界仍停在2小时、round硬编码999px、原生与H5字号/行高漂移、合同文件名不满足纯大写规范，以及 Image/Tag/Grid reset专项对共享数组的脆弱字符串匹配。新增 `COUNTDOWN.md`、`test-count-down.js` 和 Ledger `PUI-FB-0070/0071`；CountDown专项和排除历史安装产物依赖后的其余全库门禁通过。
- `pack:check` 为 326569 bytes、解包 1791787 bytes、545 files、shasum `37f14dd1763359cb451c4c5411fa521fd3be60e5`、integrity `sha512-QERvy8M93YWRoE1k4yVvp6Zvyo651/4K67EEDUfs6kdoJbzlHKIIbaKkeVxiFeAd0WGhdD7ff3uz/63vs528UQ==`，tar SHA256 `d130f3e27cea3e9e6445c5cf23f4dc2b36cdb7a91e8dc5e28c91885de83cb827`；源码、dist、tarball和示例 node_modules 的 JS/JSON/WXML/WXSS SHA256 分别一致为 `4c3e9617f63fc1fa4913ed19f94da7e4b8249a3cd6116ffb992c85aab3e9e8ae`、`356076a5f7eadd08fdbb120b822968eb3d563862c43a22918de2db5c6f699e9e`、`a477dea5b4f6e1fcb3abadb0b2ab36445329aed7f30efbe9a8f7a0db4f44bcfd`、`1463984d6cd5d90cd99b8f304a54b52504823afc064069e130f49652f33e6705`。直接 `prepare-example.js`、catalog 和 dist 生成通过；历史 PUI-FB-0012 与 Dialog 测试仍依赖缺失的微信 `miniprogram_npm`，微信 CLI Service Port disabled（exit 246），因此自主验收为 `accepted / pending-cli`。微信后台节流、50ms刷新功耗、rpx字体回流、辅助技术和系统低动效需合法 AppID 真机复核；下一项 Table 已进入 `in-progress`。

## 18. Table 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Table 文档与安装包 `miniprogram_dist/table/props.js`、`type.d.ts`、WXML、WXSS 和 JS。TDesign 以列配置、数据、固定表头、横向滚动和 `cell-click/row-click/scroll` 为核心；PoemUI 最终收敛为 26 Props、7 Events、1 `empty` Slot、9 Methods。
- 最终 Props 为 `columns/data/rowKey/bordered/stripe/height/showHeader/emptyValue/selectable/selectedRowKeys/defaultSelectedRowKeys/multiple/selectOnRowClick/sortable/sort/defaultSort/customEmpty/disabled/loading/loadingText/error/errorText/retryText/emptyText/ariaLabel/reduceMotion`。删除 `items`、compact/size/stickyHeader、toolbar/footer、私有动效、重复选择事件、滚动别名和无真实消费方的 Slot；保留受控/非受控选择与排序、左右固定列、状态组合和真实查询/操作方法。
- 基础 WXML 为 `<pui-table />`，零 `bind:*`。官网重建为“基础用法 / 边线与固定列 / 选择与排序 / 加载、空与错误”四段，选择列继续组合 PUI Checkbox，状态组合 PUI Loading/Empty/Button，Retry 只发布请求并等待父级回写。
- 浏览器真实验证 `false/0` 行键、多选/单选、行点击选择、受控父级回写、checkbox 的 `input → change`、普通单元格 `cell-click → row-click`、排序 `asc → desc → none`、键盘排序来源、内部横滚、`scrollTo`、loading/error 优先级、默认/自定义 Empty、disabled、bordered/stripe/header/height、源码重置与非法 JSON 回退。修复选择列冒泡导致重复行点击、固定列覆盖排序命中区、桌面和 390px 页面级溢出、border-off 被全局边框层覆盖、真实动作区被 component-only 归一化误删，以及共享 500ms 动效覆盖组件 500ms 合同。
- 390px 下 document/body `375/375`、PreviewDevice `351/351`、Table `clientWidth=269 / scrollWidth=400`，实际横滚最大 131px 且只发生在组件内部；API 七表完整展示 26/7/1/9，桌面和窄屏均无 nowrap、ellipsis 或裁切。light/dark、border、shadow、frost、large-radius、gradient 与 180ms/1ms 均逐项实测，刷新持久化后恢复浅色标准组合，浏览器日志为空。
- 新增 `TABLE.md`、重写 `test-table.js`、Ledger `PUI-FB-0072/0073`。Table precheck 10/10、排除两个历史微信安装产物依赖后的其余全库 59/59 通过。`pack:check` 为 326536 bytes、解包 1790851 bytes、545 files、shasum `08551378de3c63d11385ed1cb588b9ce6023acdc`、integrity `sha512-cVmmhA8rU9nOvYtU6f4vgUcFmmN3qwGU940lUEemDUuUucSuxcIriTeUdcxKudpXgUEfnPQ2fICvzoQyzy6QaA==`，tar SHA256 `27e43b1a3e2e04fd428c900a9deb8b8b5026bc68da7359c09f96f8cabc8ddb16`；源码、dist、tarball 和示例 node_modules 的 JS/JSON/WXML/WXSS SHA256 分别一致为 `c7e7a0c6103d3f57a6c3cabd289022dfb7dfcc4f7d3e762b2637e8204ddf2286`、`79c0daa06ca599443c419dce9fdf3c244504210bc48c49b09f27f72540f274f4`、`c29d08d673e046450b6f7ce840ecc646a67f89b1c71dd3cde060c75cbadaf43d`、`e4659cb67f9321327358dc5a1f61027c0db3e8d1f14df89cf70bebdfb48e4218`。
- 历史 PUI-FB-0012 引用缺失微信 `miniprogram_npm`，使 `feedback:generate/site:build/check/example:install` 外层前置失败；直接 `prepare-example.js`、catalog、dist 和打包检查通过。微信 CLI 仍为 Service Port disabled（exit 246），Table 自主验收为 `accepted / pending-cli`；微信 scroll-view sticky/触摸惯性、fixed 列层叠、Checkbox tap/catchtap、rpx 字体回流、大数据性能和辅助技术需合法 AppID 真机复核。下一项 Swiper 已进入 `in-progress`。

## 19. Swiper 对照摘要

- 2026-07-24 为名称迁移重新联网读取 [TDesign Swiper 页面](https://tdesign.tencent.com/miniprogram/components/swiper) 与 [官方 swiper 源码目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/swiper)：两者均使用 `Swiper / swiper`。固定包仍为 `tdesign-miniprogram@1.15.3`，实际源码清单保持 `miniprogram_dist/swiper/{props.js,swiper.js,swiper.wxml,swiper.wxss,type.d.ts}` 和 `swiper-nav/{props.js,swiper-nav.js,swiper-nav.wxml,swiper-nav.wxss,type.d.ts}`；本次 npm 页面返回 403，未把无法读取的页面伪写成新包证据。
- 固定参考 TDesign `1.15.3` 官方 Swiper/SwiperNav 文档，以及安装包 `miniprogram_dist/swiper`、`miniprogram_dist/swiper-nav` 的 `props.js/type.d.ts/WXML/WXSS/JS`。TDesign 以 list/current、loop、autoplay、方向、间距、同屏数量和统一 navigation 为核心；PoemUI 最终收敛为 26 Props、7 Events、0 Slots、1 `swiper-slide` Generic、7 Methods。
- 2026-07-22 再次联网读取 <https://tdesign.tencent.com/qq-miniprogram/components/swiper>、<https://github.com/Tencent/tdesign-miniprogram> 与 `tdesign-miniprogram@1.15.3`；实际检查 `miniprogram_dist/swiper/{props.js,swiper.js,swiper.wxml,swiper.wxss,type.d.ts}` 和 `swiper-nav/{props.js,swiper-nav.js,swiper-nav.wxml,swiper-nav.wxss,type.d.ts}`。官网与固定包均用于本轮证据，公开 API 仍以 PoemUI 的真实实现为准。
- 最终 Props 为 `items/value/defaultValue/height/circular/autoplay/interval/duration/easingFunction/direction/previousMargin/nextMargin/displayMultipleItems/disableTouch/navigation/imageMode/customItem/disabled/loading/loadingText/error/errorText/retryText/emptyText/ariaLabel/reduceMotion`。删除字段 Key、indicator/showArrows/showCounter 六套平行开关、showTitle/showDescription、Header/Footer/default Slot、readonly、pauseOnTouch、skipHiddenItemLayout 和私有文案入口；保留严格原始 value、状态闭环、Generic、ARIA 与低动效。
- 基础 WXML 只包含 `items` 数据入口，零 `bind:*`。官网固定为“基础用法 / 自动播放与导航 / 方向与多项 / 加载、空与错误”四区；箭头组合真实 PUI IconButton，状态组合 PUI Loading/Empty/Button，Retry 只发布请求并等待父级更新。
- 浏览器真实验证严格 `0/false/空字符串`、受控/非受控、CUA 横向拖拽、disableTouch、自动播放及触摸暂停/恢复、dots/dots-bar/fraction、inside/outside/controls/minShowNum、横纵方向、displayMultipleItems、circular=false 边界、disabled、loading/error/empty/retry、坏图、Generic、select/next/prev/reset/getState、非法 JSON 和源码重置。修复 H5 箭头误带默认“按钮”文字、缓存 image-load 在 DOM 重建后覆盖 click/状态反馈、非 content 状态仍发布资源事件、Generic 复制缺注册、单行闭合 WXML 跳过80字符格式化，以及毛玻璃关闭时箭头仍固定 blur。
- 普通状态层为500ms、swiper为500ms，reduceMotion均为1ms且停止 autoplay。桌面 document `clientWidth=scrollWidth=1265`；393px PreviewDevice viewport `380/380`，组件裁切只发生在自身循环轨道。API 六表行数 `5/12/7/2/7/7`，无 Slot 空表，ellipsis/nowrap/clipped 均0；light/dark、border、shadow、frost、large-radius、gradient 均实点，日志为空。
- 新增 `SWIPER.md`、重写 `test-swiper.js`、Ledger `PUI-FB-0074/0075`；另新增全局 PUI-FB-0076，把微信 CLI 生成目录改为“存在即严格校验”，缺失时不再阻断 Node 合同且仍保留 pending-cli。`site:build`、`check`、precheck 11/11、`pack:check` 与 `example:install` 通过。源码、dist、示例 node_modules 三路 JS/JSON/WXML/WXSS SHA256 分别一致为 `312ca44eab1f7694856066e0084c8d0a6a756454587a8ade8a10012b2a97b419`、`52966f55bd6ddc6554a8395008b6cb3f953540af56ddee06f4f92dd86eb48761`、`2447245fb3cd3728f1deae8460a4ad4eb4a224f56dbb930727154274fb12192e`、`42d11b29ccaec13f5113304bc113e9c0faf01b38f330aa9d05cc19f2330d0ac2`。`pack:check` 最终包为 326759 bytes、解包 1790650 bytes、545 files、shasum `aca389a18a0d5ec65aef72ff34225a9780aafe33`、integrity `sha512-BF8iMZ21g3GE3yCseFWGUZIjuyXVIe5TESfZxFnIjb7RuAyEMSg0I3OM+LWcnR6LM1q2rcpl4Cmotz2SAcPCEg==`，tar SHA256 `0da374202516df9f470d90839f2325da2cdab66cce610a13015aa971cd594378`；tarball 解包的 Swiper 四件套与源码、dist、示例安装逐字节一致。
- 微信 CLI 因 IDE Service Port disabled 以 exit 246 退出；未手工复制 dist 冒充 `miniprogram_npm`，因此 Swiper 自主验收为 `accepted / pending-cli`。微信 swiper 惯性、循环边界、触摸与图片缓存时序、后台 autoplay、Generic 样式隔离、rpx 和辅助技术仍需合法 AppID 真机确认；下一项 Collapse 已进入 `in-progress`。
- 2026-07-22 官网复验发现概览泄露事件/方法诊断、状态按钮整段重绘且“重置”误归空态；已用 retained state layers 与可见默认 Props 深拷贝修复。390×844 实测 `0/false/空字符串`、中间帧、disabled、low motion、API 与深色毛玻璃大圆角；Ledger `PUI-FB-0242`。`site:build/check/pack:check/example:install` 与源码/dist/示例安装四件套一致性已通过；本项未运行微信 CLI，真机风险不变。

## 20. Collapse 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Collapse/CollapsePanel 文档，以及安装包对应的 `props.js/type.d.ts/WXML/WXSS/JS`。TDesign 由父级 7 Props/1 Event 与 Panel 8 Props/Slots 组合；PoemUI 保留数据驱动 `items` 和 `collapse-panel` Generic，最终收敛为 17 Props、2 Events、0 Slots、1 Generic、0 业务 Methods。
- 最终 Props 为 `items/value/defaultValue/theme/disabled/expandIcon/expandMutex/defaultExpandAll/customPanel/loading/loadingText/error/errorText/retryText/emptyText/ariaLabel/reduceMotion`；Events 为 `change/retry`。删除旧的根主题色、Header/Footer Slot、重复 `input/open/close` 事件、公开 `open/close/toggle/retry` 方法与私有 duration/easing；严格使用 `typeof:value` 标识，使数字 `0`、布尔 `false`、空字符串和字符串 `"0"` 不碰撞。受控 `value` 只接受数组，退出受控保留最后一次受控快照。
- 基础 WXML 为 `<pui-collapse items="{{sections}}"/>`，零 `bind:*`。官网固定为“基础用法 / 原始值与互斥 / 主题与自定义面板 / 加载、空与错误”四区；默认面板组合 PUI Cell，自定义面板走 Generic，状态组合 PUI Loading/Empty/Button，Retry 只发布请求并等待父级真实回写。
- 浏览器真实验证 `0/false/空字符串/"0"`、受控/非受控、退出受控、互斥、全展开、disabled、Enter/Space、default/card、Generic、`error > loading > content > empty`、retry 保持错误态、500ms 与 reduceMotion 1ms。375px 与 393px PreviewDevice 均无可见横向溢出；light/dark、border、shadow、frost、large-radius、gradient 全部实点并验证刷新持久化，随后恢复浅色标准组合。API 完整展示 17 Props、2 Events、0 Slots、1 Generic、0 Methods，长文本自然换行且无省略；浏览器日志为空。
- 新增 `COLLAPSE.md`、重写 `test-collapse.js`、Ledger `PUI-FB-0077/0078`。最终 `site:build`、`check`（precheck 12/12）、`pack:check`、`example:install` 全部通过。包为 327399 bytes、解包 1792632 bytes、545 files，shasum `c6c32832991ae25647733761f8ddea2b97e308d4`、integrity `sha512-VmjWF8sE4XV+5z6gGlhHa2BI3FKtvViy8Vwd2NsY8/dwIGIPO8pBexAecpiY/6hAtIHc8ZOJBOSehSQO2C/yVQ==`，tar SHA256 `86bb96089850ee93c4c7e5d24feefac2d988ba2024ae2a8284ae368518fa6704`。源码、dist、示例 node_modules 与 tarball 解包的 JS/JSON/WXML/WXSS SHA256 分别一致为 `b37bede2608ac242959c1f713059d995d80236e864a86da85181d5fecdffe125`、`55f42ec45115220d7d92408980f83fc5b39fe056989f96fbf7f52da8de63d8ae`、`02f3cb01f8d31f05ce56ee368bb490d703647a54600e415c50b89df79a7bdfad`、`d8d49dbb346031bc03bedde45314a299a20a3947998cefd219c418a0d08f5b1e`。
- 微信 CLI 因 IDE Service Port disabled 以 exit 246 退出；未开启用户本机安全设置，也未手工复制产物冒充成功，因此 Collapse 自主验收为 `accepted / pending-cli`。微信 selector query 测高、动态 Generic 内容、连续快速触摸、rpx 字体回流、读屏和系统低动效仍需合法 AppID 真机确认；下一项 Input 已进入 `in-progress`。

## 21. Input 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Input 文档、GitHub `packages/components/input` 与安装包 `props.js/type.d.ts/WXML/WXSS/JS`。PoemUI 不按数量追平，最终收敛为 30 Props、5 Events、7 Slots、4 Methods。
- 2026-07-27 为昵称尾部保存操作再次核验 [TDesign Input 官方文档](https://tdesign.tencent.com/miniprogram/components/input)、[官方仓库](https://github.com/Tencent/tdesign-miniprogram) 与固定 `tdesign-miniprogram@1.15.3` 安装包 `miniprogram_dist/input/{props.js,type.d.ts,input.wxml}`。固定包在 Clear 后投影 `suffix` Slot，官方示例也用 suffix 承载“发送验证码”；PoemUI 因此继续使用既有 `suffix="slot"` 作为可选右侧操作 API，不扩张重复的 right/action Prop，只新增共享 Trailing 轨保证 Clear、Loading、suffix 和 suffix-icon 的满宽尾部几何。
- 公开 Props 为 `value/defaultValue/name/label/placeholder/type/maxlength/maxcharacter/size/align/bordered/clearable/prefix/prefixIcon/suffix/suffixIcon/disabled/readonly/loading/focus/confirmType/status/tips/required/cursorSpacing/adjustPosition/holdKeyboard/confirmHold/ariaLabel/reduceMotion`。删除独立 password、error/invalid/errorMessage、custom* Slot Boolean、私有动效参数、重复 input/confirm 事件与 setValue/reset/getState；动效固定 500ms，低动效 1ms。
- 值合同使用 `value=null` 区分非受控，`0/false/空字符串` 都保持合法受控，受控退出保留最后已渲染值。`maxcharacter` 优先于 `maxlength`，ASCII=1、非 ASCII 和 emoji=2，Unicode 安全截断不拆代理对。普通输入只发 `change`，清空固定 `clear → change`，键盘确认发 `enter`。
- 基础 WXML 为 `<pui-input placeholder="请输入内容" />`，零 `bind:*`。概览重建为“基础用法 / 状态与提示 / 图标与清空 / 尺寸与类型”，删除方法、事件诊断和状态卡；根容器恢复透明，只由内层 field 承担 Surface。
- 2026-07-24 首页微信模拟器复验继续采用固定安装包 `input/input.wxml` 与 `input/input.wxss` 的平台根作为可复现参考：PoemUI 原生 control 补齐 `display:block`、`box-sizing:border-box`、零 margin/padding、透明 background 与零 border，同时继续直接消费文字/caret Token；placeholder 使用独立 Token class。Computer Use 的 AX 注值与逐键输入分别只覆盖过滤事件或原生像素，不能冒充同一路径真机通过，风险登记为 `PUI-FB-0292`。
- 浏览器真实验证输入、Enter、清空、受控回写与退出、`0/false/空字符串`、`AB中😀C` 的 5 加权边界、disabled/readonly/loading、error+tips、password、large/right/borderless、四类哨兵 Slot、180/1ms。修复 DOM 重建后恢复性 focus 覆盖 change/enter 反馈的真实事件顺序问题。
- 属性页同时暴露全局问题：任一 Prop 回写都会重建工作区并折叠 details。现以 `state.propGroupOpen` 按组件隔离保存 open/close，实测 status 改为 error 后外观分组仍展开且 tips 可继续输入；该修复已惠及后续所有组件。
- 375px PreviewDevice 作为严于 390px 的组件宽度补强，四区可滚动且无可见横向越界；API 完整显示 30/5/7/4，参数、类型、初值、可选值和说明全部进入可访问树。light/dark、border、shadow、frost、large-radius、gradient 均实点，验收后恢复浅色标准组合；本地与局域网地址均 HTTP 200。
- 新增 `INPUT.md`、重写 `test-input.js`、新增 Props 分组持久专项，Ledger 为 `PUI-FB-0079/0080/0081`。`site:build`、`check`（precheck 13/13）、`pack:check`、`example:install` 全部通过。最终包 328222 bytes、解包 1794513 bytes、545 files，shasum `21a230c3ca68c1da281a862592ebfb1dd53fa15b`、integrity `sha512-Z6nNrGwcaZ/fHUf592ChMst+WFddAEsst15iioL4r+lFE2DsZTO0YCZ211nRd3Y5KctseuMzE+kwtDrOOpvidQ==`，tar SHA256 `bb6712908a8a72aa24e52435db6de88a65cbd9048c0d6f0465c23e03159fbdd4`。
- 源码、`miniprogram_dist`、tarball 和示例 node_modules 四层 Input JS/JSON/WXML/WXSS SHA256 分别一致为 `f65f092deea412aee239bd258d63445da192a760bb6b274b53df14ab17abbe57`、`dacf45e8ec26006179aa941e44417eed5819360aea4d576b2230f937180c5424`、`19c6f86f908ba4eaaba0a3b8e8eb743323d1fb238d3f51f60b3fa61036f64390`、`1ec401a5560b9b4a2de6f763bdae425d7def193a3ff1ed686d4dfa8695b74420`。微信 CLI 因 Service Port disabled 以 exit 246 退出，未手工复制冒充成功，因此 Input 自主验收为 `accepted / pending-cli`；微信软键盘、safe-password/nickname/idcard、rpx 基线、Slot 宽度与读屏仍需合法 AppID 真机复核。下一项 Field 已进入 `in-progress`。

## 22. Field 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Form 文档的“基础表单 / FormItem Props / FormItem Slots”，以及安装包 `form-item/props.js/type.d.ts/JS/WXML/WXSS/form-model.js`。TDesign 的 `rules/showErrorMessage/validate` 依赖 Form relation；PoemUI 当前 Field 不具备该关系，因此只对齐真实可执行的 FormItem 组合主干，不机械复制假校验。
- 公开合同由旧 8 Props 收敛为 12 Props、0 Events、5 Slots、0 Methods：`name/label/help/message/status/required/requiredMarkPosition/labelAlign/contentAlign/labelWidth/arrow/reduceMotion`。删除只能降低外壳透明度却不能阻断 Slot 子控件的伪 `disabled`、重复 `description/error` 和 `orientation`；值、禁用、只读、加载、校验、提交和业务事件继续归真实子控件或 Form 所有。
- 2026-07-23 联网核对 [TDesign MiniProgram 官方仓库](https://github.com/Tencent/tdesign-miniprogram) 后，PoemUI 保持同一公开 API 边界但作出视觉取舍：Field 根使用 Cell 同源的唯一行级 Surface，默认 `labelAlign=left`；普通 Slot Input 透明嵌入，`top` 只保留给多行或长控件。WXML 仍只投影 default/label/help/message/extra 五类 Slot，箭头调用 PUI Icon；基础 WXML 为 Field + Input 最小组合且零 `bind:*`，复杂 Slot 只在专项状态中出现。
- 官网固定为“基础用法 / 标签与对齐 / 必填与帮助 / 校验反馈”四区；固定对齐和校验例不再继承无关 help，当前实例调用共享 PUI Input 并在 Props 调整后保留输入运行态。Field 行级 Surface 在 light/dark、border、frost、large-radius、gradient 下真实变化，`shadow=on` 仍不得添加外投影；Input 普通态保持透明，focus、readonly 与输入状态继续由真实 Input 表达。
- 浏览器真实调整全部 12 Props，验证五类 Slot、required 左右标记、top/left/right、contentAlign、240rpx、arrow、四类状态与 error alert。发现 H5 属性回写重建节点会让原有 transition 直接落到最终色，现保存上一 status 并在新节点运行同源 keyframe；default→error 实际 animationstart→animationend 为 173ms，reduceMotion 下 error→success 计算时长1ms且完成态正确。
- 2026-07-23 默认 Field 在 390px 浏览器下 `document 375/375`、Field `269/269`、嵌入 Input `147/147`、PreviewDevice ScrollArea `327/327`，没有页面级横向溢出；实际输入、top 切换、error、深浅色与重置均完成。API 12 Props/5 Slots 全文自然换行，专属区域 ellipsis/nowrap 均0。Ledger 追加 `PUI-FB-0287`，专项 `test-field.js` 锁定默认 left、唯一行级 Surface 与透明 Input。
- `site:build`、`check`、`pack:check`、`example:install` 均通过。最终包 329065 bytes、解包 1799117 bytes、545 files，shasum `34fa28f44fe0aca39de5bbd3c7f999c87c9a2c8e`、integrity `sha512-HpfswiPTTO8rLwMC5gCq6W1PlKv26CfGX8pjbK6UaS1Dd0OGjEzJqQMEd5x5DmyeFAgJL1ruSJFT0zCMR2zOGA==`，tar SHA256 `ae99db5030c50db07b24496639935f2e8a05482e4d8001aa7f2622dcbffecc20`。源码、dist、tarball、示例 node_modules 四层 JS/JSON/WXML/WXSS SHA256 分别一致为 `cc4d9afd80397774c0619ffad7527fb8b3a10d369e0970f1c529f6bd0f7ff0c7`、`dab5863f45171fa76233ffd427dcdab92b3884ca0eee2fb44f9836e46ac11cff`、`6bbdf5c6d912d3da814a704cea1421525cf1316ad5be075fb6847c34c4090382`、`d8b503efe07159c322436fe0d75cfd985ab3fca24aaff05cd32acd95b5e6565e`。
- 微信 CLI 因 IDE Service Port disabled 以 exit 246 退出，`miniprogram_npm` 未生成且未手工复制冒充成功，因此 Field 自主验收为 `accepted / pending-cli`。微信 rpx 标签列/箭头基线、五类 Slot 投影、WXSS 中间帧、读屏顺序与未来 Form relation 仍需合法 AppID 真机复核；下一项 Textarea 已进入 `in-progress`。

## 23. Textarea 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Textarea 文档，以及安装包 `miniprogram_dist/textarea/props.js`、`type.d.ts`、WXML 和 JS。TDesign 当前为 28 Props、6 Events、1 label Slot、0 Methods；PoemUI 不按数量追平，最终收敛为 30 Props、7 Events、3 Slots、4 Methods。
- 最终 Props 为 `value/defaultValue/name/label/placeholder/maxlength/maxcharacter/autosize/indicator/bordered/size/clearable/disabled/readonly/loading/focus/status/tips/required/confirmType/showConfirmBar/cursorSpacing/selectionStart/selectionEnd/adjustPosition/holdKeyboard/confirmHold/disableDefaultPadding/ariaLabel/reduceMotion`；Events 为 `change/clear/focus/blur/enter/line-change/keyboardheightchange`；Slots 为 `label/tips/extra`；Methods 为 `focus/blur/clear/getValue`。删除旧版重复自动高度、计数、错误、Slot开关、调试方法和私有动效；maxcharacter 优先于 maxlength，退控保留最后受控值。
- 基础 WXML 为 `<pui-textarea />`，零 `bind:*`。官网固定为“基础用法 / 字符计数 / 自动增高 / 状态与交互”四区；当前实例、固定示例、属性页、复制代码和兼容说明共用同一30/7/3/4合同，H5不伪造 line-change 或 keyboardheightchange。
- 浏览器实测全部30个 Props。`0/false/空字符串` 均是合法受控值，`parent` 退控继续保持；受控输入真实回写为“父级真实回写”。maxcharacter=8 将 `ab中😀xyz` 截为 `ab中😀xy` 并显示8/8，原生 maxlength 属性退出；autosize 2–5行从68px经过131.125px到140px，500ms完成，reduceMotion为1ms并在8ms内完成。清空固定 `clear → change`，focus=true 后 activeElement 为当前 textarea。
- 390x844 下 document/main `375/375`、PreviewDevice `349/349`、当前 Textarea `282/282`，无页面级横向溢出；分区标题实际间隔26px。API 四个 Props 表为6/6/6/12，并完整显示7 Events、3 Slots、4 Methods，ellipsis/nowrap/clipped均0。dark、border-off、shadow、frost、large-radius、gradient全部实点，字段得到透明边框、9px圆角、blur(18px)和双层阴影；最终恢复浅色标准组合，控制台日志为空。
- 新增 `TEXTAREA.md`、重写 `test-textarea.js`、Ledger `PUI-FB-0084/0085`，并更新共享 Loading 与原生平台根门禁。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger为85 records。最终包328997 bytes、解包1797132 bytes、545 files，shasum `bc9690987eec9b9d460106ae5cdf3d21eb64ab89`、integrity `sha512-CdJ887IbYfvyHB9vhP1r+dfokmmaFn4O/fxSlcl8j9t80zqwVY2DhO5vhCofVQZ8sv/TmRS1ZE7ei1kU2MEh9Q==`、tar SHA256 `e28f3fe2555f7dc5c450845ee00307558c8a63818bf67c6a2900264d682a8930`。
- 源码、`miniprogram_dist`、tarball和示例 node_modules 四层 JS/JSON/WXML/WXSS SHA256 分别一致为 `e94976fa1b39a02794a5e538781deeae26b5ccfcf67751fbac25302c5e597636`、`dacf45e8ec26006179aa941e44417eed5819360aea4d576b2230f937180c5424`、`eed57f74ba43fe5d0eaeb62692c67c68415d704c8f2214a993da38ba9ad0b54d`、`ceafac38a3a41dd312513d94cee141e30e3b47c9c7b813d0edb50e751250b8ad`。微信 CLI 因 Service Port disabled 以 exit 246 退出，`miniprogram_npm` 缺失且未手工冒充，因此 Textarea 自主验收为 `accepted / pending-cli`；微信 readonly-disabled 边界、auto-height/rpx软换行、确认栏、选区、键盘高度、line-change、输入法与读屏需合法 AppID 真机复核。下一项 Switch 已进入 `in-progress`。

## 24. Switch 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Switch 文档（页面更新于 2026-07-10），以及安装包 `miniprogram_dist/switch/props.js`、`type.d.ts`、WXML、WXSS 和 JS。TDesign 当前主干为8 Props、1 Event、0 Slots、0 Methods；PoemUI 不追求数量，最终收敛为11 Props、1 Event、0 Slots、0 Methods。
- 最终 Props 为 `value/defaultValue/customValue/label/icon/size/disabled/readonly/loading/ariaLabel/reduceMotion`；唯一 Event 为 `change`。删除旧版 checked/defaultChecked、外部标题说明、重复文字图标、布尔 Slot 开关、布局/校验/私有动效参数、click/input/slot-click 与6个实例方法。`0/false/空字符串` 都是合法受控原始值，退控保留最后渲染态，customValue 保持 string/number/boolean 原始类型。
- 基础 WXML 为 `<pui-switch />`，零 `bind:*`。官网固定为“基础开关 / 带文字与图标 / 开关状态 / 尺寸”四区；Switch 通过 Cell rightSlot 组合，状态和尺寸示例不再堆事件/方法诊断卡，属性、复制、WXML和兼容说明共用11/1/0/0合同。
- 浏览器真实调整全部11个 Props，完成受控/非受控、`0/false/空字符串`、controlled→uncontrolled、defaultValue、三尺寸、文字图标、disabled/readonly/loading、非法 JSON 保留、重置和复制。修复 Cell value 文本容器吞掉点击、缺失 easing 使 transition 回退0s、重建最终态触发反向过渡缩短，以及分区间距被后置规则压成8px。正常动画50ms/130ms分别为10.262px/17.5115px中间帧，500ms完成；reduceMotion为1ms。390px document/main `375/375`、Device `351px×622px`，分区间距为18px，页面无横向溢出；API 76个单元格无省略/nowrap/裁切。light/dark、border、shadow、frost、large-radius、gradient与果味全部实点并恢复浅色标准组合，别名路由正常，浏览器日志为空。
- 新增 `SWITCH.md`、重写 `test-switch.js`、Ledger `PUI-FB-0086/0087/0088/0089`，并将 Textarea/Switch 加入累计 precheck。`site:build`、完整 `check`（precheck 16/16）、`pack:check`、`example:install` 全部通过，Feedback Ledger为89 records。最终包328134 bytes、解包1791487 bytes、545 files，shasum `15ff539655de1ed677b92a626edfc5c9b1bb3076`、integrity `sha512-hnXSz/bUKHV1JS98h7cki3IM/xb8fSv6LEWDyLt0y/zghFgDXTNxPoiQTPoOl8YFW0K1mu7XLWay3+57jbEI4A==`、tar SHA256 `404e87ea7b287c42a54d463690e26572c9665cb6a9554d8a70559bfc369d2cbe`。
- 源码、`miniprogram_dist`、tarball和示例 node_modules 四层 JS/JSON/WXML/WXSS SHA256 分别一致为 `93cf8c0904cc704706ed5c536b254b80a7eac6f85f0d0d6e4a92bd500f92c1b2`、`2741d6a65c81b666a0c2bfc000aad91619246893407874def343126b9a8b99ca`、`0be052259f9adabab446e25ae2654c1e7a3614d7ff2dcb60532f9dfb51925c22`、`fad1e36cca862d910b96ddd28231fab0b363c674f4439c58150c25d0cfec34b0`。微信 CLI 因 IDE Service Port disabled 以 exit 246 退出，`miniprogram_npm` 缺失且未手工冒充，因此 Switch 自主验收为 `accepted / pending-cli`；微信 observer/setData时序、form-field、Cell Slot触摸冒泡、rpx几何、连续快点、transitionend、系统低动效与读屏需合法AppID真机复核。下一项 Checkbox 已进入 `in-progress`。

## 25. Checkbox / CheckboxGroup 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Checkbox 文档（页面更新于 2026-07-10）与安装包 Checkbox/CheckboxGroup 的 `props.js`、`type.d.ts`、JS、WXML 和 WXSS。PoemUI 最终公开 Checkbox 19 Props、1 Event、3 Slots、0 Methods；新增真实 CheckboxGroup 11 Props、1 Event、1 Slot、0 Methods。
- Checkbox 以 `checked/defaultChecked` 唯一负责选中所有权，`value` 只负责 `string/number/boolean` 原始身份；Group 以 `value/defaultValue/options/keys/max` 承担数组所有权、全选/半选、最大数和组级继承。删除旧 `value` 布尔别名、defaultValue、click/input、loading/custom、私有动效及实例方法，不用演示层冒充 Group。
- 基础 WXML 为零 `bind:*` 的 `<pui-checkbox-group options="{{releaseOptions}}" default-value="{{releaseDefaults}}"/>` 与 `<pui-checkbox/>`。官网固定为“纵向与横向 / 全选与半选 / 状态 / 图标与布局”四区；API 完整展示 Checkbox 19/1/3/0 和 Group 11/1/1/0。
- 浏览器真实验证单项 mark/content、受控父级回写、`0/false/空字符串`、半选点击、readonly/disabled/contentDisabled、icon none、横纵组合、全选/取消与 disabled selected 保留。修复 Group 同步选择器把内容节点计为选项、native indeterminate 默认动作回滚与陈旧闭包，以及演示分区间距被压成8px。CDP 实点45ms得到背景 `rgb(185,185,185)`、勾选 opacity `0.285064` 的500ms中间帧；reduceMotion为1ms。390px document `375/375`、Device `351×622`、viewport `338/338`、分区18px，无页面级横向溢出。light/dark、border、shadow、frost、large-radius、gradient和果味全部实点并恢复标准浅色组合；API全文无省略或裁切。
- 新增 `CHECKBOX.md`、重写 `test-checkbox.js`、Ledger `PUI-FB-0090/0091/0092/0093`，并将 Checkbox 加入累计 precheck。`site:build`、完整 `check`（precheck 17/17）、`pack:check`、`example:install` 全部通过，Feedback Ledger为93 records。最终包330935 bytes、解包1801347 bytes、549 files，shasum `28d78fe94f1cf655f83201115abea660c5221dd3`、integrity `sha512-U3Oqde3ZZzorofdzmsmVgbTrWfM/S9pfwSKwxjRAEbDmwb2I1jDLvK77jgyoXJxCiR5ORJ+V3wpGZ18TOodPQw==`、tar SHA256 `ec34ec58779868cd9813d3d0361fc4e3a9429860719f07bb648ff5c889199262`。
- Checkbox 源码、`miniprogram_dist`、tarball和示例 node_modules 四层 JS/JSON/WXML/WXSS SHA256 分别一致为 `7358f0d1a6d5fa1f8c84c469f935c3c8c56364053d1d18c1416e924f7a2e3594`、`dab5863f45171fa76233ffd427dcdab92b3884ca0eee2fb44f9836e46ac11cff`、`ef061fd6e734ee6c61de28e537d3e4aa1655b83f10193e88768d571109a20b06`、`0305084b1d6ee588a252eb2e2f18ca44f72a008e9d751fc3dd8c1715d97879ac`；Group 四件套分别为 `d82061a39132e0343f9a1d713a07edd5dab5dc5a3dd10342d76a81d29235bfb8`、`c12753170920cfcb98ae23d9df9e28bd39f0e4f5ed5c82ab9ea7cb104792e66e`、`2d15543a59a32ec4422b19343e3eff51c2dabea260cb55b66aebd51c1b738fbb`、`a7991fdfa25b99468cd9eb7917f17203b7f056946b95736b4fedfd9372b21fc6`。微信 CLI 因 IDE Service Port disabled 以 exit 246 退出，`miniprogram_npm` 缺失且未手工冒充，因此 Checkbox 自主验收为 `accepted / pending-cli`；微信 relation、wx://form-field、observer/setData、Slot、rpx几何、连续快点、系统低动效和读屏需合法AppID真机复核。下一项 Radio 已进入 `in-progress`。

## 26. Radio / RadioGroup 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Radio 文档（页面更新于 2026-07-10）与安装包 Radio/RadioGroup 的 `props.js`、`type.d.ts`、JS、WXML 和 WXSS。PoemUI 最终公开 Radio 18 Props、1 Event、4 Slots、0 Methods；新增真实 RadioGroup 13 Props、1 Event、1 Slot、0 Methods。
- Radio 以 `checked/defaultChecked` 唯一负责单项选中所有权，`value` 只负责 `string/number/boolean` 原始身份；Group 以 `value/defaultValue/options/keys/name` 承担组内唯一值、键映射、组名和继承。删除旧 `value` 布尔别名、重复事件、loading/empty/error/retry 假状态、实例方法和私有动效，不以演示层静态按钮冒充 Group。
- 基础 WXML 为零 `bind:*` 的 `<pui-radio-group options="{{releaseOptions}}" default-value="{{releaseDefault}}" />` 与 `<pui-radio />`。官网固定为“基础用法 / 原始值 / 组件状态 / 图标与内容”四区；API 完整展示 Radio 18/1/4/0 和 Group 13/1/1/0。
- 浏览器真实调整全部 18 Props，验证主项受控/非受控及退控连续性、allowUncheck、`0/false/空字符串` 严格身份、Group 选择、disabled/readonly/contentDisabled、line 图标、左右布局、边线和标签行数。现场发现静态 Radio 共用组件 `name` 导致浏览器原生分组互相取消，改为主项、真实组和固定示例分别使用稳定独立 name；原生 `borderless` 也从无效参数改为真实 Surface/边界切换。
- 500ms 动画在实际点击后 60ms 读到 dot opacity `0.229729` 与 scale `0.422297`，完成态正确；reduceMotion 为 1ms。390px 下 document `375/375`、PreviewDevice `349/349`、showcase `282/282`、viewport `338/338`，无页面级横向溢出。API 共 46 行，ellipsis/nowrap/clipped 均 0；light/dark、border、shadow、frost、large-radius 全部实点，关闭边框后仍保留 1px 盒模型，结束后恢复浅色标准组合，浏览器日志为空。
- 新增 `RADIO.md`、重写 `test-radio.js`、Ledger `PUI-FB-0094/0095/0096/0097`，并将 Radio 加入累计 precheck。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为 97 records。最终包 331618 bytes、解包 1803709 bytes、553 files，shasum `81f566e3459c7678a84f59888f0e1d2d55b07f6d`、integrity `sha512-v0QkP1Abq+F0j8na0xrysq6CAuTmTPTj6Um9SPNVKJcxF709HnCmNXMBF/m/VaWsrcvxYfLUrymqk0CAf95lgg==`、tar SHA256 `0b44047414a9c5090c8f2298e86a2cb27f1ef0bcb9e0a16f5e790b71c23d1274`。
- Radio 源码、`miniprogram_dist` 和示例 node_modules 三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `928cd255377a4f5cc5354c2ef6a6122d451e532852fa0a0f298f28d3d2e72317`、`dab5863f45171fa76233ffd427dcdab92b3884ca0eee2fb44f9836e46ac11cff`、`e9b8ed4e0af89823fdc791b7c796cfd7ca151fa1683ebfce90838adf1309c3ac`、`21d28380b4abaea1926724016e840dcfac9ae4895a0e224d83110dcc2eaa53d9`；Group 四件套分别为 `c6610b1089dd558e5bacec878840fb9bda5cef79822f8d1821e9a4f414c2bffa`、`e8a3ff238aaf13cb8a25cccf98823a2ed2e9d331ebdc62f4230ca694aff336f7`、`41499a66998c706021fae52449f1d399ef563a09253b2d50c649243258804c39`、`8e718ac00b083adddfcbaa0f1fbef3230d348cda9f7824ada53e41d722f69e4a`。微信 CLI 因 IDE Service Port disabled 以 exit 246 退出，`miniprogram_npm` 缺失且未手工冒充，因此 Radio 自主验收为 `accepted / pending-cli`；微信 relation、`wx://form-field`、observer/setData、Slot、rpx 几何、连续快点、系统低动效和读屏需合法 AppID 真机复核。下一项 Form 已进入 `in-progress`。

## 27. Form 对照摘要

- 固定参考 TDesign `1.15.3` Form 官方文档及安装包 `form/props.js`、`type.d.ts`、JS/WXML/WXSS、`form-item` 与 `form-model.js`。PoemUI 从固定字段页面生成器收敛为可组合 Form 父容器，公开合同固定为 7 Props、3 Events、1 default Slot、5 Methods。
- `data/rules` 是唯一受控数据与集中规则入口；Field 通过真实 relation 按 `name` 注册。规则覆盖 required、whitespace、长度、pattern、enum、number/boolean/email/url/telnumber/idcard 和同步/异步 validator；submit 固定 `validate → submit`，reset 只请求父级回写 initial/empty，不丢失 `0/false/空字符串`，校验通过也不冒充业务发布成功。
- 删除旧 `items/value/defaultValue/disabled/showActions/submitText/resetText` 固定生成器合同。Form 本体只渲染微信原生 `form + default Slot`；字段与提交/重置操作由消费者组合 PUI Field、Input、Switch、RadioGroup 和 Button。基础 WXML 零 `bind:*`，官网分为“基础用法 / 校验与反馈 / 组合字段”。
- 浏览器真实完成失败与通过提交、warning、受控父级回写、initial/empty reset、`0/false/空字符串`、全部 7 Props、复制、API 全文、390px、light/dark、边框/阴影/毛玻璃/大圆角/渐变和低动效。API 84 个表头与单元格最小 14px，无 ellipsis、nowrap 或裁切；Form/Field 根在所有外观模式保持透明，页面与 PreviewDevice 均无横向溢出。
- 新增 `FORM.md`、重写 `test-form.js`，更新 Field relation、示例、API、兼容说明、生成器和组合门禁，登记 Ledger `PUI-FB-0098/0099/0100`。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为 100 records。最终包 334614 bytes、解包 1815277 bytes、553 files，shasum `1d59defa11ce6a1ac2d19b8fbff56823817e09f2`、integrity `sha512-btMZVi8e/NRfxwxr4LXvJZB+XdmY9cajr/pTIy4giwJaoehpLwhRYDABBZDYn2MsIEgnc8IIqM2ajqCz7HZEfg==`、tar SHA256 `b360b7254142dcd57bc4b4fe3d2534ad9b3a811e0d801c1993ecc1431855ebff`。
- Form 源码、`miniprogram_dist`、tarball 和示例 node_modules 四层 JS/JSON/WXML/WXSS SHA256 分别一致为 `a2003fada32ce4639978f09eab812b1df00c3afeefe57ec67076a73954a30ce9`、`4ba0e8a99b0f13c6714f1f40333a9d477063c0c5d1fd4394c42a36ec66078b85`、`780fe0f595dacc105de670ee1b64b2e2543478fa20bb4fe84ccb100d74f938b9`、`f9b55dcc85067a11016242d6a6ca6514a67c03478b55cf93068fc41337085153`。微信 CLI 因 IDE Service Port disabled 以 exit 246 退出，`miniprogram_npm` 未生成且未手工冒充，因此 Form 自主验收为 `accepted / pending-cli`；微信 relation、动态 Field、原生 form 提交、`wx.pageScrollTo`、异步校验竞态、rpx 中间帧与读屏需合法 AppID 真机复核。下一项 Picker 已进入 `in-progress`。

## 28. Picker / PickerItem 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Picker 文档与安装包 Picker/PickerItem 的 Props、类型、JS/WXML/WXSS。TDesign 主要公开 `autoClose/cancelBtn/confirmBtn/header/itemHeight/keys/popupProps/title/usePopup/usingCustomNavbar/value/defaultValue/visible/visibleItemCount`，以及 `confirm/change/pick/cancel/visible-change/close`；PoemUI 不照搬子组件堆列方式，以 `columns` 数据统一表达单列、二维独立列和 `children` 级联树。
- 2026-07-27 重新请求 [TDesign Picker 官方页](https://tdesign.tencent.com/miniprogram/components/picker)、[官方 Picker 源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/picker) 和 npm `tdesign-miniprogram@1.15.3`；官方页本次请求超时、npm 页面返回 403，GitHub 源码可读。为固定可复现证据，另行解包 npm tarball 的 `miniprogram_dist/picker/{props.js,picker.js,picker.wxml,template.wxml,picker.wxss}`：其 toolbar 为左取消/右确认，且通过 Popup + content Slot 承载。PoemUI 不照搬其方向：用户明确要求默认 `type=default` 为 Popup Header 左 primary Check 圆形图标确认 / 右 default Close 圆形图标取消，`type=classic` 才保留底部两列；两种都保留原有草稿和事件顺序，DateTimePicker 透传同一 type 而不复制皮肤。
- 2026-07-27 为修正 Select 的系统选择器漂移，重新访问 TDesign Picker 官方页 <https://tdesign.tencent.com/qq-miniprogram/components/picker> 与官方仓库 <https://github.com/Tencent/tdesign-miniprogram>，并复核固定包 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/picker/props.js`、`type.d.ts`、`picker.js`、`picker.wxml`、`picker.wxss`、`picker.json`。固定源码的 Picker 可见层由 Popup + PickerItem 组合而非平台 `picker`。PoemUI 不把简单单选并入滚轮 Picker：Select 改为 PUI Button Trigger + PUI Popup + PUI Button Option，Picker 继续独占多列滚轮、草稿和确认合同。
- PoemUI 最终公开 26 Props、8 Events、0 Slots、6 Methods。新增 `type: 'default' | 'classic'`，非法值收敛为 `default`；`value` 与 `visible` 分别承担值和显隐受控权，滚动只改变草稿并发布 `pick`，确认固定为 `confirm → change（值变化时）→ visible-change → close`，取消固定为 `cancel → visible-change → close`；`0/false/空字符串` 都按严格身份保留。状态优先级固定为 `error > loading > empty > content`，Retry 不伪造清除 error。
- 原生端重建为真实 `picker-view/picker-view-column`，Popup/内联共用同一模板并组合 PUI Popup、Button、Icon、Loading、Empty。官网删除原生 `<select>` 冒充，重建点击、键盘、滚轮和 Pointer 拖动的 H5 滚轮，概览固定为“基础用法 / 多列与级联 / 状态与反馈 / 内联模式”，基础 WXML 零 `bind:*`。
- 浏览器真实完成 drag、ArrowDown、级联点击、受控值父级回写、受控 visible 取消、error 覆盖 loading、Retry、empty、内联、disabled/readonly 和 `0/false/空字符串`；API 六表行数为 `5/10/11/3/9/7`，193 个单元格均无省略、nowrap 或裁切。修复 Popup 插入即完成态、阴影/毛玻璃开关不生效，以及全站 390px 常规代码正文覆盖 PreviewDevice 的共享窄屏定位错误；标准动效 500ms，低动效 1ms。
- 390px 实测 PreviewDevice `351px × 622px`，代码正文 `351px × 240px` 且从设备下方正常流开始，document 横向溢出为 0。light/dark、border、shadow、frost、large-radius、gradient 均真实切换；深色果味面板为半透明 Surface、18px blur、20px 圆角和真实阴影，恢复浅色标准组合后为白色 Surface、无 blur/shadow、12px 圆角。
- 新增 `PICKER.md`、`test-picker.js` 与 Ledger `PUI-FB-0101/0102/0103/0104/0105`。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为 105 records。最终包 338687 bytes、解包 1833672 bytes、554 files，shasum `90340156f6a7eaa0eda77406a26e949633116922`、integrity `sha512-3bhZEFrbiPCtBLCSCrY7FEtKKWpTb+GewZnas4PmxBj+WyFcI8lMk5HfzxaysEskYMZnu0G+WYLIDVr2C1nvQg==`。
- Picker 源码、`miniprogram_dist` 和示例 node_modules 三层五件套逐字节一致：JS/JSON/WXML/WXSS/template SHA256 分别为 `a846a3943e3be30921197cdb88b4b1cc1c5f664192f66180af5c7f350c161687`、`f5589eb37a9ca8bd14252b8adf1f175d9e7a4b42814db50040433503effbfe41`、`f4e420a3adc6eaf2e9e5901114f3d60ce3078c24d364ed4cd8a566c872875a05`、`50a73429406110c5221337486cefea24f7a4982533dacb9c5a573533637516df`、`df06a30d42557a84bac1705c32345cf903124b94c3c2e38312e0dd6f7eb21d20`。微信 CLI 因 IDE Service Port disabled 以 exit 246 退出，`miniprogram_npm` 未生成且未手工冒充，因此 Picker 自主验收为 `accepted / pending-cli`；微信 `picker-view` 惯性、级联 setData、Popup relation、rpx 中间帧、触摸拖动、系统低动效与读屏需合法 AppID 真机复核。下一项 DateTimePicker 已进入 `in-progress`。

## 29. DateTimePicker 对照摘要

- 固定参考 TDesign `1.15.3` 官方 DateTimePicker 文档与安装包 `date-time-picker/props.js`、类型、JS/WXML/WXSS。借鉴 `mode/start/end/format/steps/showWeek`、Picker 组合、双受控显隐与草稿确认；拒绝函数型 `filter/formatter`、任意节点 Header、`popupProps` 穿透和机械追平。
- 2026-07-27 再次访问官方 DateTimePicker 页面/仓库并解包固定包 `miniprogram_dist/date-time-picker/date-time-picker.wxml`；固定源码仍只组合 Picker，因此 DateTimePicker 只公开透传 `type=default|classic`，不新增任何私有 Header、Footer 或 Surface。
- PoemUI 从两个系统 date/time picker 的 27 Props 分裂适配器重建为 PUI Picker 日期时间领域层，最终公开 22 Props、7 Events、0 Slots、6 Methods。默认 Header 左侧为 primary Check 圆形图标确认、标题居中、右侧为 default Close 圆形图标取消；classic 复用 Picker 底部两列。年/月/日/时/分/秒动态联动，闰年与月末合法，范围倒置交换，正整数步长保留边界，数字 `0` 为合法受控时间戳；确认固定 `confirm → change（值变化时）→ visible-change → close`，取消回滚草稿。
- 原生 WXML 只组合一个 `pui-picker`，不复制 Popup、Button、Loading、Empty 或 `picker-view`。基础用法为零 `bind:*` 的 `<pui-date-time-picker />`；官网固定为“基础用法 / 日期与时间精度 / 范围与步长 / 内联与状态”，删除旧浏览器 date/time input，并复用 Picker 的点击、键盘、wheel 和 Pointer drag。
- 浏览器真实点击月份、键盘调整日期、鼠标滚轮调整分钟、Pointer 拖动日期；确认完成受控父级回写，取消保留已提交值。`value=0` 被识别为受控并按 start 规整，disabled/readonly 阻断打开，usePopup=false 显示五列内联滚轮，reduceMotion 的 mask/track 均为 `0.001s`。现场修复 DateTimePicker 未进入 `edge-to-edge` 导致 Popup 落到长 showcase 底部的真实越界；修复后 layer 与 PreviewDevice viewport 同高 620px且 bottom 对齐。
- 390px 下 document `scrollWidth/clientWidth=375/375`；API 完整展示 21 Props、7 Events、6 Methods，6 张表共 40 行、170 个单元格，字号 14px，ellipsis/nowrap/横向裁切均为 0。light/dark、border、shadow、frost、large-radius、gradient 全部实点；深色组合得到半透明 Surface、18px blur、20px 顶部圆角与真实阴影，验收后恢复浅色标准组合，浏览器日志为空。
- 新增 `DATE-TIME-PICKER.md`、重写 `test-date-time-picker.js`、更新累计 precheck，并登记 Ledger `PUI-FB-0106/0107`。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为 107 records。最终包 340769 bytes、解包 1839252 bytes、554 files，shasum `232e809cfab220978eba67f6f448ea3273884695`、integrity `sha512-kVk4wXfzOTLQLihCBGtIRa2VUr2AxU5bhBh/enZ6tA5stcgw8AksEWmZX/tGnRBAttt12I45XZ48HDpBaonVgQ==`。
- 源码、`miniprogram_dist` 和示例 node_modules 三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `836eba3ca202ecd4f9c5d58f8cc1f36ee0fe334988fd95c63e7d4e474e746325`、`8a673bc60a4c3163c91f72b07f31d1e8647508e1f70e3e6d4c205aca0e3e31b8`、`70bb104d9075e7fcc8c54fa273339e8295aee9a2813c382cd6faf20f016356dc`、`9edbe4e61db34685f20bd4ee0ae7bf420622625bdb66c6b76ab58c7ce60f7bae`。微信 CLI 因 IDE Service Port disabled 退出，`miniprogram_npm` 未生成且未手工冒充，因此 DateTimePicker 自主验收为 `accepted / pending-cli`；微信 picker-view 惯性、动态列 setData、Popup relation、rpx 中间帧、触摸拖动、系统低动效和读屏需合法 AppID 真机复核。

## 30. Search 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Search 文档与安装包 `search/props.js`、类型、JS/WXML/WXSS。借鉴 `center/clearTrigger/maxlength/maxcharacter/shape`、右侧操作和 `change/clear/focus/blur/submit/action-click` 主干；不机械照搬 `resultList`、平台长尾输入参数或全部事件别名。
- PoemUI 最终公开 17 Props、6 Events、1 default Slot、0 Methods。值以 `value/defaultValue` 区分受控与非受控，严格保留 `0/false/空字符串` 并保证退控连续性；字符限制以 `maxcharacter` 优先，输入只发 `change`，清空固定 `clear → change`，取消不清值，Search 不内置结果列表或假异步状态。
- 原生 battle 发现 Search 错误监听 PUI Input 不会发布的 `input/confirm`，导致微信输入与确认链路断开；现已改为真实 `change/enter`，并由专项测试锁定父子事件合同。官网按“基础用法 / 搜索框形状 / 操作与长度 / 状态与受控”四区重建，所有可见输入与操作复用 PUI Input/Button/Icon，基础 WXML 为零 `bind:*` 的 `<pui-search />`。
- 浏览器真实完成输入、清空、Enter、取消、focus/blur、受控父级回写、`0/false/空字符串/null` 退控、`AB中😀C` 加权截断、round/center、focus 清空、disabled/readonly、180ms/1ms。390px 下 document `375/375`；API 六表行数 `5/6/5/5/7/2`，全部单元格 14px，ellipsis/nowrap/clipped 均为 0，真实上限完整显示为 `-1–10000` 与 `-1–20000`。
- light/dark、border、shadow、frost、large-radius、gradient 全部实点；深色组合得到半透明 Surface、18px blur、14px 大圆角、真实阴影、透明中性边界与渐变设备底，恢复浅色标准组合后无阴影/毛玻璃。浏览器日志为空。复制按钮与同源基础 WXML 存在；当前内置浏览器剪贴板权限未返回文本，页面按真实结果保持失败反馈，没有伪报成功。
- 新增 `SEARCH.md`、重写 `test-search.js`、更新组合与设计门禁，并登记 Ledger `PUI-FB-0108/0109`。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为 109 records。最终包 341934 bytes、解包 1844175 bytes、554 files，shasum `80fdf72dd25bebcc7f71e3bf8b74fcf3a5eda530`、integrity `sha512-U5ovKEGUbWkjjEniNIiAcxa2vbUcrT+38VXnI70Oy+2B6tbAHLVPq8O3b7ny/pPeijMMAIc2k851688xkpjmdQ==`。
- Search 源码、`miniprogram_dist` 和示例 node_modules 三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `d396e72932ea7114b08904def69a6b46d134c53cfa8c72f2c5dd3ec60c397561`、`dbb8ef90f2d75002f6cacf6008e4e8612570e6ac57099e601b3f427a00c01cdd`、`22922b494becf1bd0e325619106ddf27346fadb728791f7ba480bcfe3f3790c1`、`718a5f4b8bbeae94b30ba26ff74dca787a2f102bc84456e31d8faf777e26d9c7`。微信 CLI 因 IDE Service Port disabled 退出，`miniprogram_npm` 未生成且未手工冒充，因此 Search 自主验收为 `accepted / pending-cli`；微信软键盘确认、focus Prop、清空触摸顺序、rpx 中间帧、样式隔离、系统低动效和读屏需合法 AppID 真机复核。下一项 Stepper 已进入 `in-progress`。

## 31. Stepper 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Stepper 文档与安装包 `stepper/props.js`、类型、JS/WXML/WXSS。借鉴 `disableInput/integer/inputWidth/size/theme/min/max/step/value/defaultValue` 与 `focus/change/overlimit/blur` 主干；不机械照搬实现细节或扩大平台穿透面。
- 2026-07-27 再次访问官方 Stepper 页面/仓库并解包固定包 `miniprogram_dist/stepper/stepper.wxml`、`stepper.wxss`；组件内部固定三段轨保持不变，仅在小程序独立页的透明父布局中水平居中三组演示，避免把页面排版职责写回基础组件。
- PoemUI 最终公开 14 Props、4 Events、0 Slots、0 Methods。值以 `value/defaultValue` 区分受控与非受控，严格保留数字 `0` 并安全处理 `false/空字符串/非数字`；受控转非受控延续最后一次受控值。加减立即提交，输入只保存草稿，Enter 或失焦规整，失焦固定 `change → blur`；边界再次点击只发 `overlimit`。
- 原生 battle 发现 Stepper 错误监听 PUI Input 不会发布的 `input`，导致微信直接输入链路断开；现已改为真实 `change/enter/focus/blur`。源码与 H5 均组合 PUI Button/Icon/Input，不再公开重复 `input`、私有 `duration/easing`、默认 Slot 或实例方法；单位和业务状态由消费者相邻组合。
- 官网按“基础用法 / 主题与尺寸 / 步长与边界 / 状态与输入”四区重建，基础 WXML 为零 `bind:*` 的 `<pui-stepper />`。浏览器真实完成加减、输入草稿、Enter/blur、边界、disableInput、readonly、disabled、受控父级回写、`0/false/空字符串/null` 退控、小数步长、inputWidth、三主题和三尺寸。
- battle 现场还发现全站后置外观规则把 Stepper 固定 500ms 覆盖为 500ms；现已恢复组件作用域五项过渡。计算样式正常为五项 `0.18s`，reduceMotion 为五项 `0.001s`。390px 下 document `375/375`，开关前后 Stepper 几何固定 `150×46px`；light/dark、border、shadow、frost、large-radius、gradient 全部实点并恢复浅色标准组合。
- API 完整展示 14 Props 与 4 Events，两表含表头为 `15/5` 行、共 90 个单元格；所有可见正文为 14px、自然换行，ellipsis/nowrap/clipped 均为 0。新增 `STEPPER.md`、`test-stepper.js`，登记 Ledger `PUI-FB-0110/0111/0112`；`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为 112 records。最终包 343039 bytes、解包 1849931 bytes、554 files，shasum `270233a90b99279b9239efda6df70040a8780bf2`、integrity `sha512-CABSAHVIpuJYIpaqu+nUqRA+b2SWgM5jzKMsnQdmCOWmTPIqr8JAkPJQOAd9FLD2qCnvD1QGLC/VMPeG+50jgg==`。
- Stepper 源码、`miniprogram_dist` 和示例 node_modules 三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `9f05e209a40138ddc5cefff6a071b6c23200ae01d351430a394995b3dcbdf6fa`、`dbb8ef90f2d75002f6cacf6008e4e8612570e6ac57099e601b3f427a00c01cdd`、`f81284da3ff28346f16d0f29037bf902662d865d9518916b85446e966cc5a2b7`、`aa934e5e101b5e8407fcf522256c94e999779e73f149b0b9468449aaf3d4b24a`。微信 CLI 已拉起 IDE server，但项目的 `touristappid` 被当前开发者工具拒绝为不存在的 AppID，`miniprogram_npm` 未生成且未手工冒充，因此 Stepper 自主验收为 `accepted / pending-cli`；微信数字键盘、focus/blur 顺序、浮点/rpx、中间帧、样式隔离、系统低动效和读屏需合法 AppID 真机复核。下一项 Slider 已进入 `in-progress`。

## 32. Slider 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Slider 文档与安装包 `slider/props.js`、类型、JS/WXML/WXSS。借鉴 `value/defaultValue/min/max/step/disabled`、`change/dragstart/dragend` 的任务表达与分区文档；保留 PoemUI 微信原生 slider 的单值、横向、表单和连续 changing 能力，拒绝只在 H5 伪造 `range/vertical/marks/capsule`。
- PoemUI 最终公开 16 Props、2 Events、0 Slots、0 Methods。删除重复 `input`、默认 Slot、4 个调试方法和私有 `duration/easing`；value 以 null/undefined 区分受控与非受控，数字 0 合法，Boolean/空字符串/非有限值回退下界，退控延续最后已渲染值。
- 官网按“基础用法 / 边界与步长 / 颜色与表单 / 状态与受控”四区重建，全部使用真实 `input[type=range]`，每个实例有唯一可访问名称；基础 WXML 零 bind。浏览器在 390x844 完成真实输入、受控父级回写、null 退控、step=10、负数区间、min/max/blockSize、readonly/disabled、正常 500ms 与 reduceMotion 1ms。API 完整显示 16+2 行，全部单元格无 ellipsis/nowrap/hidden；三视图 Tabs 坐标和尺寸完全一致。
- light/dark、border、shadow、frost、large-radius、gradient 六项外观全部实点并恢复标准浅色；开关前后 PreviewDevice 与 input 宽度保持 `351px / 165.875px`，document 为 `375/375` 且 innerWidth=390。新增 PUI-FB-0113/0114；同时把 Picker 专项测试从依赖全文件任意 `source=drag` 改为锁定自身 Pointer `onStep(..., 'drag')`，消除跨组件误通过。
- `site:build`、完整 `check`、`pack:check`、`example:install` 通过；包 342906B/1848478B/554 files，shasum `27c49a82e73ed1473a3164570239f80c0473262c`，integrity `sha512-S2IC9Sa2Ui6xFkJmolEnpV2CaiwvE4tVGrxkZ2hSoGT5+KZlCmkItT0/d0YORheBjflO6Hn6nVbp30iYnG5gUw==`。源码、dist、示例安装三层 JS/JSON/WXML/WXSS 逐字节一致。微信 CLI 因 `touristappid` 不存在未生成 `miniprogram_npm`，Slider 自主验收为 `accepted / pending-cli`；真机触摸采样、form、rpx、颜色、样式隔离、系统低动效和读屏待合法 AppID 复核。下一项 Rate 已进入 `in-progress`。

## 33. Rate 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Rate 文档与安装包 `rate/props.js`、类型、JS/WXML/WXSS。借鉴 `allowHalf/color/count/disabled/gap/showText/size/texts/value/defaultValue` 和连续触摸评分主干；拒绝当前无法跨端证明的 `icon/iconPrefix/placement/variant`，保留 PoemUI 的 `readonly/ariaLabel/reduceMotion`。
- PoemUI 最终公开 13 Props、1 `change` Event、0 Slots、0 Methods。删除重复 `input`、默认 Slot 与私有 `duration/easing`；`value` 只以数字判定受控，数字 `0` 合法，Boolean、空字符串和非有限值不冒充评分，退控延续最后已渲染值；事件 detail 固定为 `{ value, source: 'tap' | 'drag' }`。
- 原生端新增真实 `touchstart/move/end/cancel` 拖动与点击抑制，半星从依赖容器背景色的遮罩改为两层 PUI Icon 裁切；颜色只接受微信 Canvas 可执行的 `#RGB/#RRGGBB/rgb(0–255)`。官网按“基础用法 / 半星与文案 / 尺寸与间距 / 状态与受控”四区重建，静态示例只读，当前实例真实点击、Pointer 拖动和父级回写，基础 WXML 为零 bind 的 `<pui-rate />`。
- 390x844 浏览器真实点击从 3.5 到 4.5，并用 Pointer path 从右向左拖到 1.5；验证受控 `0`、非法 `false`、null 退控、7 星、24px、0 gap、颜色、disabled/readonly、180ms/1ms。修复 56px 静态样例造成 PreviewDevice 横向溢出，以及全局 Surface 外观规则给透明 Rate 强加 220ms、圆角、阴影和毛玻璃；修复后 document `375/375`、PreviewDevice `338/338`。
- API 完整显示 13 Props 与 1 Event，共 68 个单元格，无 ellipsis、nowrap、hidden 或内容溢出；概览/API/属性/概览 Tabs 均为 `x=12,y=348,351×40px`。light/dark、border、shadow、frost、large-radius、gradient 全部实点；深色效果组合下 PreviewDevice 有真实效果，Rate 仍保持透明、0 圆角、无阴影与无 blur，验收后恢复浅色标准组合，浏览器日志为空。
- 新增 `RATE.md`、`test-rate.js` 与 Ledger `PUI-FB-0115/0116`。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为 116 records；源码、`miniprogram_dist`、示例 node_modules 三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `55ef94443bd9482a3ae30dd9fc47318139842f82b51e5176f6b3902750d72928`、`dab5863f45171fa76233ffd427dcdab92b3884ca0eee2fb44f9836e46ac11cff`、`7d3e0ab346616b57a6ce0aee28f34e989e2bf6fabf9438d572a9e4bb7dd5972b`、`a33945135ac45351a759b0ee6087e320f0066e10a67a3e7d922a3e46ee03d206`。
- 微信 CLI 已启动 IDE server，但项目 `touristappid` 被拒绝为不存在的 AppID（code 10），`miniprogram_npm` 未生成且未手工冒充。因此 Rate 按完整证据自主验收为 `accepted / pending-cli`；微信 touchmove 采样、rpx gap、Canvas 着色、样式隔离、slider 与内部按钮的读屏、系统低动效仍需合法 AppID 真机复核。下一项 Upload 已进入 `in-progress`。

## 34. Upload / Attachments 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Upload、Attachments 文档与安装包 Props、类型、JS/WXML/WXSS。借鉴文件列表、媒体选择、数量/大小/扩展名限制、添加/预览/移除/重试和 `files` 受控主干；拒绝把网络上传器塞进基础组件，不照搬 `requestMethod/config/draggable/transition/gridConfig/gutter/imageProps` 等无法跨端闭环的能力。
- PoemUI 最终公开 20 Props、8 Events、1 个 `add` Slot、0 Methods。只有 Array `files` 表达受控，`false/0/空字符串/null` 均不夺取状态；受控转非受控延续最后文件列表。平台选择完成后先校验数量、重复、扩展名和大小，合法项按 `add → change` 请求父级回写，拒绝项发布 `reject`；组件只展示消费者写回的 `ready/uploading/success/error/paused`，不伪造远端上传成功。
- 原生端重建为 `wx.chooseMedia/chooseMessageFile` 的真实选择桥、PUI Button/Icon/Image/Tag/Progress 组合和 list/grid 两种布局；每项预览、移除、错误重试与取消都有独立真实事件。官网按“基础用法 / 网格与媒体 / 文件状态 / 限制与禁用”四区重建，基础 WXML 为零 bind 的 `<pui-upload />`，默认添加入口仍由真实 file input 承担可访问与选择语义。
- 390x844 浏览器完成 Array 受控列表、max 截断、error Retry 保持错误并等待消费者、移除固定 `change → remove` 与父级回写、`false/0/空字符串/null` 退控边界、非法 JSON、四列网格、disabled、addBtn=false、customAdd、accept/multiple、预览被浏览器阻止时的真实 error 反馈，以及固定 500ms/低动效 1ms。受浏览器自动化边界限制，不能注入真实本地 File；未伪造选择成功，原生选择回调由专项 VM 合同覆盖并保留真机风险。
- API 完整显示 20 Props、8 Events、1 Slot，共 136 个单元格，全部至少 14px，ellipsis/nowrap/裁切为 0；三视图 Tabs 几何固定。390px 下页面无横向溢出，PreviewDevice 351px；light/dark、border、shadow、frost、large-radius、gradient 全部实点，Upload 根保持透明，文件与自定义添加 Surface 正确消费外观 Token，验收后恢复浅色标准组合，浏览器日志为空。
- 新增 `UPLOAD.md`、重写 `test-upload.js`，更新原生控件边界、共享子组件几何、API、H5 兼容、示例和设计合同，登记 Ledger `PUI-FB-0117/0118`。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为 118 records；包预验 343813 bytes、解包 1850007 bytes、554 files，shasum `4e6cc90a71610075559acba2db75e74ea8f8c85d`、integrity `sha512-MG7Zq4ibpc2eghCV7xZYhEZ8fWOTIkzqsHrdnHwG7/+V0ihzJJnphlQyswidNOVKCrLGuXlmSZAOeTxEKIICjw==`。
- Upload 源码、`miniprogram_dist` 和示例 node_modules 三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `2aca23d49643dc79f4091b0eb0410d3137226bd8833c98cbfc7810c35ced17b1`、`69d92644517e8c9d1cdd98a11aa17f09b3d4207d0d3d83c77280a82a291ed1a2`、`0dd79bf5334727d6189e15029437e23cdfd90d356eea5410d9aba8fd3f0959fa`、`dd768b63f779a4c0084668bbf46ef175e8eff43173079f06d584bd71e7003269`。微信 CLI 启动 IDE server 后因 `touristappid` 不存在报内部 code 10，`miniprogram_npm` 未生成且未手工冒充，因此 Upload 自主验收为 `accepted / pending-cli`；微信选择器权限/取消/超时、临时文件大小与 MIME、真机预览、rpx 网格、样式隔离、系统低动效和读屏需合法 AppID 真机复核。下一项 Calendar 已进入 `in-progress`。
- 2026-07-27 失败态回归重新访问 [TDesign Upload 官方页](https://tdesign.tencent.com/miniprogram/components/upload) 与 [官方源码目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/upload)，并固定读取 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/upload/{upload.wxml,upload.wxss,upload.js,props.js}`。TDesign 列表态以单一错误图标和失败说明代替进度，本轮结合 PoemUI 可恢复事件边界进一步收敛为中性文件卡、一处失败原因和右侧文字 Retry；移除重复失败 Tag、整卡红框与 `0%` Progress，独立页真实绑定 retry 但保持父级 `error` 不变。Ledger 为 `PUI-FB-0419`。

## 35. Calendar 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Calendar 文档与安装包 Props、类型、JS/WXML/WXSS。借鉴单选/范围/多选、日期边界、禁用规则、星期起始、受控值与弹层显隐；不照搬只服务 TDesign 内部结构的 class/style/popupProps，也不保留旧 PoemUI 的重复事件、Slot、实例方法和私有动效参数。
- 2026-07-27 再次访问官方 Calendar 页面/仓库并解包固定包 `miniprogram_dist/calendar/calendar.wxml`、`calendar-header.wxml`、`calendar.wxss`。微信运行态确认 PoemUI 的右箭头被 Flex 中的自定义 Button 宿主推离可见轨；现将月份栏固定为 `72rpx / 1fr / 72rpx`，两侧均为真实 `icon-only` PUI IconButton，H5 使用同义 `36px / 1fr / 36px`。
- PoemUI 最终公开 26 Props、7 Events、0 Slots、0 Methods。值与显隐分别支持严格受控/非受控及退控延续；日期只接受合法 `YYYY-MM-DD`、时间戳或对应数组，状态优先级固定为 `error > loading > content > empty`。`change` 先于自动关闭产生的 `visible-change`；范围或多选超限只触发 `limit`，不截断或伪造选择；Retry 只发布 `retry`，不假装恢复。
- 原生端重建为 42 格六周日期网格，组合 PUI Button、Icon、Loading、Empty，支持 month/year 导航、外月、周末/指定日期禁用、同日范围、上限、确认/取消、inline/popup 和 500ms/低动效 1ms。官网按“基础用法 / 范围与多选 / 日期限制 / 状态与反馈”四区重建；基础 WXML 为零 bind 的 `<pui-calendar />`，静态示例不可操作，当前实例真实回写。
- 390px 浏览器真实完成单选、范围、受控父级回写、退控、上/下月、确认、disabled、readonly、loading、error、Retry 保持错误、全禁用 empty、popup 遮罩点击、受控显隐、重新打开和 180/1ms。popup 自动切换 `edge-to-edge`，遮罩与 viewport 均为 `349×620px`；document `375/375px` 无页面级横向溢出。
- API 完整显示 26 Props、7 Events、0 Slots、0 Methods，`maxRange=0–3660`、`maxMultiple=0–366` 与源码一致，390px 使用自然换行卡片且无省略裁切；Tabs 几何稳定。light/dark、border、shadow、frost、large-radius、gradient 全部实点，深色组合下日历 Surface 为 14px 圆角、真实双层阴影和 `blur(18px) saturate(1.35)`，边框关闭只透明化边线并保留盒模型；验收后恢复浅色标准组合，浏览器日志为空。
- 新增 `CALENDAR.md`、`test-calendar.js` 与 Ledger `PUI-FB-0119/0120`；同步更新状态组合、共享子组件几何、PreviewDevice 布局、原生控件边界、API、H5 兼容和示例合同。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为 120 records；最终包预验 344298 bytes、解包 1851777 bytes、554 files，shasum `596104ff4ea2a949d45474f498ad7ce6839241a3`、integrity `sha512-D9zrwG4EB4hs+/3Uv/Py6f+jUXq53kLG/5yX+N2zjpm5an4LabWDBtSE7qfUBLS5V2k5JDLt+HQPXf1s3Hqkug==`。
- Calendar 源码、`miniprogram_dist` 和示例 node_modules 三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `506c977d866264019b5cdcfe0fbd1e7cca94d92b6f3fe9fc31db66ff5caaf8ad`、`0eea5ad6896d53fead29fb1048f2a1e39cc198fcafeefa21c2e64092061d05b5`、`32d03fcd7dce48429b68c3b2b2f5fa5c6a540132ceb611c3b0c95c3c481d4224`、`0bb99870f1b9e34e4cca505dc1c1811619014c5aad6ff82224758fa23d48fa34`。微信 CLI 启动 IDE server 后因 `touristappid` 不存在报内部 code 10，现有 `miniprogram_npm` 内无 Calendar 且未手工冒充，因此 Calendar 自主验收为 `accepted / pending-cli`；微信触摸网格、fixed 遮罩、rpx 排版、样式隔离、系统低动效与读屏需合法 AppID 真机复核。下一项 Navbar 已进入 `in-progress`。

## 36. Navbar 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Navbar 文档与安装包 `navbar/props.js`、类型、JS/WXML/WXSS。借鉴 `fixed/leftArrow/placeholder/safeAreaInsetTop/title/titleMaxLength/visible/zIndex` 与 left/title/capsule Slot 的结构思路；结合微信 `navigationStyle: "custom"` 仍保留右上系统胶囊的官方规则，改为真实读取菜单矩形而非手工复制 TDesign 的胶囊 Slot。
- PoemUI 最终公开 15 Props、1 `left-click` Event、3 Slots、0 Methods。新增默认 `capsule=true`，原生端只预留系统胶囊的对称几何，H5 只画不可交互镜像；默认不渲染 right Slot，只有 `capsule=false` 才允许消费者使用它。删除自动 `wx.navigateBack`、`delta`、左右 Icon/Text/loading/disabled 平行 Props、custom* 开关、right-click、input/change/open/close、show/hide、公开 height/actionWidth 和 duration/easing。返回只发布 `{ source:'left' }`，页面掌握真实路由。
- 原生端重建为三列 Grid：胶囊模式读取 `left/right/top/bottom/width/height`、`windowWidth/statusBarHeight`，左右用 `windowWidth-left` 对称轨保护标题，左操作以 `windowWidth-right` 为外边距在胶囊宽度镜像区居中，内容高度按胶囊相对状态栏上下等距计算；非胶囊模式使用等宽轨。窗口尺寸变化时重新测量。组合 PUI Button/Icon/Loading，支持 safe area、fixed/placeholder、transparent/bordered、声明式 visible、500ms 与 reduceMotion 1ms。官网按“基础用法 / 标题与组合 / 加载与禁用 / 透明导航”四区重建；基础 WXML 零 bind，H5 左操作也在 88px 镜像区居中，胶囊镜像不伪造系统操作。
- 390x844 浏览器需完成默认返回不跳转、left/title Slot、`capsule=true/false`、H5 胶囊不可交互、visible 父级回写、500ms 的中间帧与完成卸载、1ms 低动效、titleMaxLength 0/4、空标题、leftArrow=false、fixed=false/placeholder=true、安全区、loading、disabled。`capsule=true` 下不得出现 right Slot 的业务控件。
- API 完整显示 15 Props、1 Event、3 Slots、0 Methods；390px 下胶囊预留、标题、单元格与属性面板自然换行，document 无页面级横向溢出。
- light/dark、border、shadow、frost、large-radius、gradient 全部实点。深色组合下 Navbar 使用 `rgba(15,15,17,.9)` Surface、真实阴影和 `blur(14px) saturate(1.2)`；border-off 透明化底线，大圆角仍保持屏幕附着全宽 0 圆角。恢复浅色标准组合后白色 Surface、可见边线、无阴影/blur，浏览器日志为空。
- 合同、专项测试与 Ledger 在本轮同步更新；当前构建产物、哈希与发布包结果必须以本次验证记录为准，不能沿用本段历史数值。
- 微信 CLI 若因 `touristappid` 或无合法 AppID 无法生成 `miniprogram_npm`，不得手工冒充；微信真实胶囊矩形、fixed/安全区、rpx 三列、Slot 触摸、样式隔离、系统低动效与读屏仍需合法 AppID 真机复核。

## 37. Tabs / TabPanel 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Tabs 文档与安装包 `tabs/tab-panel` 的 Props、类型、JS/WXML/WXSS。借鉴 value/defaultValue、底线、等分、分隔、吸顶和 swipe 主干；PoemUI 保留 items 数据驱动，不照搬 stickyProps/bottomLineMode/动画调参或分裂 TabPanel 子组件。
- PoemUI 最终公开 12 Props、2 Events、1 default Slot、0 Methods。严格区分数字 `0`、字符串 `"0"`、`false` 与空字符串；同项点击只发 `click`，真实点击切换固定 `click → change`，swipe 只发 `change` 且 source=swipe；受控模式等待父级回写。默认 `spaceEvenly=true`、`split=true`，但等分只在四项及以下启用，超过四项固定为四个完整项加第五项半露的内部横滚轨道；line 为 96rpx 平面 Header、brand 短指示器，tag 为独立浅色标签；不照搬 card。删除根级 loading/error/empty/retry、prefix/extra、input、实例方法和私有动效/阈值/循环参数。
- 原生端重建单一指示器、局部横滚、固定72rpx手势阈值、不循环且跳过 disabled，并组合 PUI Button/Badge/Icon。内容状态归 default Slot 消费者用 PUI Loading/Empty/Button 真实处理。官网按“基础用法 / 标签样式 / 徽标与禁用 / 可横向浏览”四区重建，基础 WXML 含 items/defaultValue 且零 bind。
- 390x844 浏览器真实完成默认/同项/禁用点击、受控 `0/"0"/false/空字符串` 父级回写、CUA 横向拖动和 swipeable=false 门禁、line/tag、底线淡出、等分/分隔、sticky、ARIA 与 500/1ms。2026-07-23 重做默认视觉：document `375/375px`，line Header 为 `48px`、分隔为 `1px`、完成态指示器为 `16px × 3px`；基础点击“表单”切换对应内容，实际拖动横向样例切到“布尔值”。light/dark 与 border/shadow/frost/large-radius/gradient 的既有合同保持不变；line Header 不再把阴影或毛玻璃当作默认层级。
- API 六表行数为 `4/5/4/3/3/2`，完整显示12 Props、2 Events、1 Slot、0 Methods；93个单元格至少14px、自然换行且 ellipsis/nowrap/clipped 均0，概览/API Tabs 几何一致。battle 修复用法代码把演示初值误当源码默认值而漏掉 items/defaultValue，以及安装测试使用错误路径并静默跳过的真实缺陷。
- 新增 `TABS.md`、重写 `test-tabs.js`、Ledger `PUI-FB-0123/0124`，同步收紧设计组合与 Loading 覆盖门禁。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为124 records；最终包预验342709B/1839117B/554 files，shasum `17485d8e2b388c5175684597008d70fe250ec749`、integrity `sha512-N6NhOX+IPt+n+Aa34WPnYJEzn/taokWaQASuoC1o8OPbPHp3uHO4nttulu0tmamiIMaainWDOSG18e+C45QQ/g==`。
- Tabs 源码、`miniprogram_dist` 和示例 npm 安装三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `873cc7eb051379b9d7fa43856b5831441a0de20802fb52ad4db8b4cb8e81fa3c`、`c83b6f596357f948c31befcc01baaa16e5a7a74c73405cdfa091fc1bce87ee59`、`6b2dc8fb19942fe73ec205f33ff6b1bdc623b5efb36abd910a2e8417db117ac3`、`62d5cb204c5ede9ffffc21a5926810bf0cde4b2d762ebe053956a50d2a8c1d04`。微信 CLI 启动 IDE server 后因 `touristappid` 不存在报内部 code 10，现有 `miniprogram_npm` 内无 Tabs 且未手工冒充，因此 Tabs 自主验收为 `accepted / pending-cli`；微信 touchmove/scroll-view/sticky/rpx/SelectorQuery/连续快点/读屏与系统低动效仍需合法 AppID 真机复核。下一项 Tabbar 已进入 `in-progress`。

## 38. Tabbar / TabBarItem 对照摘要

- 2026-07-23 固定参考 [TDesign TabBar 官方文档](https://tdesign.tencent.com/miniprogram/components/tab-bar)、[官方源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/tab-bar) 与 `tdesign-miniprogram@1.15.3` 发布包：实际读取 `tab-bar/{props.js,type.d.ts,tab-bar.js,tab-bar.wxml,tab-bar.wxss}` 和 `tab-bar-item/{props.js,type.d.ts,tab-bar-item.js,tab-bar-item.wxml,tab-bar-item.wxss}`。借鉴 value/defaultValue、theme/shape、bordered/split、fixed/placeholder、安全区与层级主干；PoemUI 以 items 合并条目展示数据，不照搬 url/linkType 自动路由或 subTabBar。
- 公开合同保持 14 Props、2 Events、0 Slots、0 Methods；`split` 与 TDesign 默认一致为 `true`。严格区分 `0`、`"0"`、`false`、空字符串，事件为 `click → change`，受控模式等待父级回写。TDesign 还接受 Array value，但 PoemUI 明确保持一级目的地单选，只接受单个 String/Number/Boolean；数组、对象和函数不产生选中项，非法非受控初值回退第一个可用项。条目未声明 label 时按 text/title/序号回退；显式 `label: ''` 是纯图标合同，H5/WXML 均不渲染标签，并以 item.ariaLabel（缺失时“目的地 n”）保留辅助名称。
- 官网概览采用 TDesign 式连续用法分区，不使用 Sidebar 或场景选择器：依次为“基础用法 / 纯文字导航 / 纯图标导航 / 徽标与禁用 / 选中指示与悬浮”。每段是独立、真实可点击的 Tabbar；标题到示例 8px、段间 18px，基础 WXML 仍为零 `bind:*`，代码区稳定给出五个代表性 WXML。
- 浏览器实测：纯图标场景的可见 label 节点为 0，辅助名称为“首页/应用/消息/我的”；徽标场景真实显示 `0`、dot、`99+`，disabled 项不可用；点击“任务”使 active 改为“任务”，且显示 `click、change：\"messages\" → \"tasks\" · source=item`，证明父级受控回写。normal/tag 场景中的选中与非选中条目均透明，活动项只使用品牌色、文字权重和短横提示；不以背景或圆角伪装独立按钮。
- 390×844 实测 document 375px、PreviewDevice 351px、内部 viewport `620/620px`，无页面级横向溢出。深色模式切到浅色后 Tabbar 为白色背景、深色活动文字与中性边框；“一键果味”实测使 Tabbar 根为 `blur(14px) saturate(1.2)`、条目圆角 20px，随后已还原用户先前外观。控制台 warning/error 为 0。动效合同为 500ms，reduceMotion 为 1ms。
- 新增/更新 `TABBAR.md`、`test-tabbar.js`、`PUI-FB-0280`。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过；Ledger 为 271 records，`npm pack --dry-run` 为 518 files、297.0 kB、1.5 MB（shasum `d72cb990a507aa64cc8c411481afb13d9b5fab40`）。微信 CLI 实际启动 IDE server 后在 `touristappid` 权限查询返回 code 10，未生成也未伪造 `miniprogram_npm`。合法 AppID 真机仍需复核 fixed/placeholder、env 安全区、rpx 分隔、触摸、backdrop-filter、样式隔离、系统低动效和读屏。
- 2026-07-23 用户确认继续按 TDesign 对照收口：`split` 默认从 false 校正为 true；TDesign 的 Array value 不照搬，PoemUI 的 `value/defaultValue` 与条目 value 明确只接受 String/Number/Boolean。源码与 H5 对非法受控值保持无选中、非法非受控初值回退首个可用项；专项测试锁定这条合同，Ledger 见 `PUI-FB-0281`。

## 39. Steps / StepItem 对照摘要

- 固定参考 TDesign `1.15.3` 官方 Steps/StepItem 文档与安装包 `steps/props.js`、`step-item/props.js`、类型、JS/WXML/WXSS。借鉴 current/defaultCurrent、currentStatus、layout、sequence、theme、readonly 与 change 主干；PoemUI 以 items 合并 StepItem 内容，不照搬独立子组件、内容 Slot 或外部样式类。
- PoemUI 最终公开 12 Props、1 Event、0 Slots、0 Methods。严格区分数字 `0`、字符串 `"0"`、`false` 与空字符串；只在不同可用步骤被选择时发布一次 change，重复项、readonly、disabled 根与条目静默；受控模式等待父级回写。删除根级 loading/error/empty/retry、footer Slot、click/input、select/next/prev、标题截断、单项 loading 和私有动效调参。
- 原生端组合 PUI Button/Icon，空 items 不渲染假壳，全部禁用保持 currentIndex=-1；完成与错误分别使用语义 PUI `check` / `error-circle`，支持 horizontal/vertical、positive/reverse、default/dot、局部滚动和固定180/1ms。官网按“基础用法 / 方向与顺序 / 主题与状态 / 边界值与禁用”四区重建；场景导航是高对比 `tablist/tab/tabpanel`，当前项保留 PUI Icon、`aria-selected` 与 `aria-current`，基础 WXML 含真实 items/current/defaultCurrent 且零 bind。
- 390x844 浏览器真实完成受控父级回写、同项、键盘、disabled 根与条目、`0/"0"/false/空字符串`、item.status、横纵/正反序、default/dot、局部滚动、空 items、非法 JSON 和180/1ms。document `375/375px`，边界局部 scroller `293/502px`，分区后续上间距18px，最终新页面日志为空。
- API 完整显示12 Props和1 Event，共76个单元格；全部至少14px、自然换行且 ellipsis/nowrap/clipped 均0。概览/API/属性 Tabs 均为 `12,348,351×40px`；属性、组件引用和基础用法三处复制均进入真实成功态，基础代码 bind 数为0。
- light/dark、border、shadow、frost、large-radius、gradient 全部实点。深色效果组合与边框关闭前后 Steps 根保持 `293×44px`；border-off 只令中性边界透明且 22×22px 指示器盒模型不变，恢复浅色标准组合后 Esc 正确把焦点交还外观入口。
- 新增 `STEPS.md`、`test-steps.js` 与 Ledger `PUI-FB-0128/0129`；同步更新已过时的共享 Loading 几何清单、Tabbar 源码截取边界和 Steps PUI Icon 尺寸镜像。`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为129 records；最终包预验341758B/1830817B/554 files，shasum `1e42f8b22fe7c42a784709f3494a7d5866a72207`、integrity `sha512-EuOIPANs7uWn5/MCe7Wimg9ehI/zyYfJP5tq30iY4ufx7ML3EHeNSPLa/lncrK/4Semj6chWwwVeeat9MTN7ag==`。
- Steps 源码、`miniprogram_dist` 和示例 npm 安装三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `bd29d98927c288a4b003d666b16f5742e810ec2c6439edeb58530c2bc353595e`、`df3a4688a07e789c2f8db842b6170bc33825a9739c9be3ab4c9a083ceb67f4eb`、`8e762bee0ee4e70ee358c0cb756a76ccfef37bf8e671494f758e973139afd103`、`8ef299d1fadbda99d0f243f2baee0dd8903c33207dfc8c58fa13211b9b8496ac`。微信 CLI 启动 IDE server 后因 `touristappid` 不存在报内部 code 10，现有 `miniprogram_npm` 内无 Steps 且未手工冒充，因此 Steps 自主验收为 `accepted / pending-cli`；微信 Button 触摸、scroll-view 惯性、rpx 连接线、样式隔离、系统低动效和读屏仍需合法 AppID 真机复核。下一项 Indexes 已进入 `in-progress`。

## 40. Indexes / IndexesAnchor 对照摘要

- 2026-07-23 重新联网核验 [TDesign Indexes 官方页](https://tdesign.tencent.com/miniprogram/components/indexes) 与 [官方仓库 Indexes 目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/indexes)；固定参考 TDesign `1.15.3` 安装包的 `indexes/props.js`、`indexes/type.d.ts`、`indexes/index.js`、`indexes/index.wxml`、`indexes/index.wxss` 与 `indexes-anchor/props.js`。借鉴 current/defaultCurrent、indexList、showFullIndex、sticky/stickyOffset 与 select/change 主干；PoemUI 以 items 合并 Anchor 内容，不照搬独立子组件、页面级滚动或外部样式类。
- PoemUI 最终公开 20 Props、4 Events、0 Slots、0 Methods。分组 index 只接受非空 String 或有限 Number，严格区分数字 `0` 与字符串 `"0"`；侧栏操作固定 `select → change`，重复当前只发 select，手动滚动只发 change，条目独立发 item-click，retry 只通知父级。删除 value/defaultValue 别名、Header/Footer Slot、重复事件、命令式方法和私有 duration/easing。
- 原生端组合 PUI Cell/Badge/Button/Loading/Empty，状态优先级固定 `error > loading > content > empty`；空 items 不注入假分组。官网按“基础用法 / 索引显示 / 条目与状态 / 受控与边界”四区重建，基础 WXML 只含 items/current/aria-label 且零 bind。
- 390x844 浏览器真实完成侧栏 click、同项、条目 item-click、手动滚动、连续 Pointer 拖动、受控父级回写、数字0/字符串0、readonly/disabled、loading/error/retry/empty、非法 JSON、indexList、左右侧栏和180/1ms。连续拖动从 ★ 到 C 后 `source=touch`、`scrollTop=429`；document `375/375px`、PreviewDevice `349/349px`，分区间距26px，修复后页面无新增控制台错误。
- API 完整显示20 Props和4 Events，共130个单元格；全部至少14px、自然换行且 ellipsis/nowrap/clipped 均0。属性页20控件，组件引用、基础用法与工具栏复制均进入真实成功态，基础代码 bind 数为0。
- light/dark、border、shadow、frost、large-radius、gradient 全部实点。深色设备为 `#09090b`，Indexes Surface 得到真实阴影、`blur(14px) saturate(1.2)` 与24px圆角；border-off 仅透明化中性边界且1px盒模型不变。组件重置不污染外观，验收后恢复浅色标准组合。
- battle 现场修复 H5 查询错误 group data 属性、索引 Button 重复 sample 标识、受控事件在重渲染中丢失、滚动中间帧回写、连续拖动引用未定义 signal、Pointer/mouse 双注册和复制默认源缺失；同步将 Indexes 纳入共享 Empty/Loading 几何门禁。
- 2026-07-23 回归 battle 再发现共享 Button 最终规则把 `21×18px` 索引入口恢复成 `21×36px`，造成相邻点击热区重叠，且活动字符被覆盖成与白底相同的白色；真实点击 C 会选中 B。现以组件限定最终规则恢复原生 `42rpx × 36rpx` 镜像、包装 Grid 对齐和活动反色，并补齐 H5 短尾滚到底最后分组、隐藏状态 inert/Tab 退出与原生隐藏 Retry disabled 合同。Ledger `PUI-FB-0266/0267/0268`。
- 新增 `INDEXES.md`、`test-indexes.js` 与 Ledger `PUI-FB-0130/0131`；`site:build`、完整 `check`、`pack:check`、`example:install` 全部通过，Feedback Ledger 为131 records。
- Indexes 源码、`miniprogram_dist` 和示例 npm 安装三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `48c9dab5c1ad713b607f70c0a86241ecefa74d81315a8ac4acc7c8d5b62f5b82`、`3626425aeb6a2addef5862d25af70fb1357b310c20f9f4f52bb54632a3a4698a`、`6807e516f983aa92667966a579a5ae78ebb08709ad4183aad662f009a2612a97`、`9b0f54dd14e721f96852501282de08390bae2a93b25012f218b830af675850db`。微信 CLI 已启动 IDE server，但示例 `touristappid` 被拒绝为不存在的 AppID（内部 code 10）；现有 `miniprogram_npm` 内无 Indexes 且未手工冒充。微信 scroll-view 惯性、scroll-into-view、SelectorQuery、touchmove、sticky、rpx、样式隔离、系统低动效和读屏仍需合法 AppID 真机复核。下一项 Sidebar 已进入 `in-progress`。

2026-07-23 Indexes fixed 侧栏与 Cell 满宽回归：对照 TDesign 1.15.3，真实小程序侧栏默认 fixed 垂直居中；H5 只在 PreviewDevice 内做边界受限镜像；Cell 不再为浮动侧栏预留滚动 padding。新增 Ledger PUI-FB-0269/0270。

2026-07-27 小程序独立页复验后按 PoemUI 有界集合语义修正该取舍：Indexes 本身公开固定 `height` 并承担唯一集合 Surface，若索引栏继续 fixed 到页面视口，会覆盖同页后续示例且活动字母脱离组件边界；现小程序与 H5 都把索引栏限制在组件 body，并为 `56rpx + --pui-space-normal` 的索引轨预留内容安全区。该偏离不改变 `current/indexPosition/indexList` API，Ledger `PUI-FB-0409`。

## 41. Sidebar / SideBarItem 对照摘要

- 在线重新核验 TDesign SideBar 官方页 <https://tdesign.tencent.com/miniprogram/components/side-bar> 与官方仓库 <https://github.com/Tencent/tdesign-miniprogram>（2026-07-20）；固定可复现证据为 `tdesign-miniprogram@1.15.3` 安装包的 `side-bar`、`side-bar-item` 的 props、类型、JS 与 WXML。官网动态页面用于产品信息，固定包源码用于 API 判断。
- PoemUI 最终公开 24 Props：`items/value/defaultValue/theme/bordered/width/height/showGroupTitle/sticky/stickyOffset/showIcon/showDescription/showBadge/clickable/readonly/disabled/loading/loadingText/error/errorText/retryText/emptyText/ariaLabel/reduceMotion`；2 Events：`change/retry`；0 Slots；0 Methods。value 只接受 String/Number，严格区分数字 `0`、字符串 `"0"` 与空字符串，Boolean/Object/重复值跳过或保持未命中。
- 删除 Header/Footer、`customHeader/customFooter`、`duration/easing`、`click/select/input/scroll` 和五个实例方法；保留受控/非受控、分组、描述、card、局部 sticky 与集合状态。状态固定 `error > loading > content > empty`，retry 只请求父级，动效固定 500ms/1ms。
- 原生端与 H5 均组合 PUI Button/Badge/Icon/Loading/Empty；官网概览固定为左侧 Sidebar 与右侧消费者内容的全高工作区，点击导航项后右侧内容真实随 value 回写切换；基础 WXML 只含 items/value/aria-label 且零 bind。
- 390px 浏览器真实完成鼠标与 Enter 选择、受控父级回写、数字0→字符串0→空字符串、readonly/disabled/loading/error/retry/empty、非法 JSON、两段代码复制、API、1ms 低动效及六项外观。API 为5表、26行、126单元格，完整显示24/2/0/0并消除旧 `select/input`、`header/footer` 和实例方法文案；移动端截图无可见页面级横向溢出。
- battle 现场修复 API 类型被显示为 object、旧说明残留 `select/input`/Header/Footer/实例方法/false合法值，以及专项测试的 Sidebar API 截取边界；新增 `SIDEBAR.md`、`test-sidebar.js` 与 Ledger `PUI-FB-0132/0133`。同时以 `PUI-FB-0134` 和全局规则要求后续所有 battle 记录在线页面、查询日、固定版本和包内源码路径。
- `site:build`、完整 `check`、`pack:check`、`example:install`、`feedback:generate/check` 均通过；npm dry-run 为341.3kB/1.8MB/554 files，shasum `d5cb98733b5005ac9e0753186988e910f61d0e8d`。Sidebar 源码、`miniprogram_dist` 和示例 npm 安装三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `bbe03dce43987d9cb031c10bc2af47a64e26e508d71cb66303d9dd966ac1fcea`、`dad2b8dc44fe587bec0a131333bf66fd110e5981c97ac906e021592291189072`、`00d49e672c91d3edf17e0b8b2a26126a4b207eb9faa6941acc54481584fd3403`、`691b811c0fb8b824973e9e658e71c6dc98b5f3a083157534caa4286ee5b7718d`。
- 微信 CLI 成功启动 IDE server，但 `touristappid` 被拒绝为不存在 AppID（内部 code 10）；`miniprogram_npm` 未生成且未手工冒充。本项按全队列授权自主接受为 `accepted / pending-cli`。微信 scroll-view、sticky、rpx、触摸、样式隔离、系统低动效和读屏仍需合法 AppID 真机确认；下一项 BackTop 已进入 `in-progress`。

## 42. BackTop 对照摘要

- 在线重新核验 TDesign BackTop 官方页 <https://tdesign.tencent.com/miniprogram/components/back-top>、官方仓库 <https://github.com/Tencent/tdesign-miniprogram> 与 npm 发布页 <https://www.npmjs.com/package/tdesign-miniprogram>（2026-07-20）；固定可复现证据为 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/back-top/{props.js,type.d.ts,back-top.js,back-top.json,back-top.wxml,back-top.wxss}`。官网动态页用于产品用法语义，固定包源码用于 API 与事件顺序判断。
- TDesign 的六项核心 Props 为 `fixed/icon/scrollTop/text/theme/visibilityHeight`，四种 theme 为 `round/half-round/round-dark/half-round-dark`，并提供 `icon/default` Slot 和唯一 `to-top`。PoemUI 保留这条核心主干，并仅额外保留全库通用的 `ariaLabel/reduceMotion`；最终为 8 Props、1 Event、2 Slots、0 Methods。
- 删除旧 page/container 双目标、`target/targetTop/scrollDuration/right/bottom/size/safeAreaInsetBottom/zIndex/loading/disabled/duration/easing/customContent`、`click/input/change/backtop/reach/success/error/complete` 与 `backTop/scrollToTop` 方法。BackTop 只表达外部滚动位置驱动的回顶请求，业务状态由消费者在外部组合 PUI 反馈组件。
- 原生组件通过 Button 家族内部 FAB 组合 PUI Button；默认是 `arrow-up + primary + circle + iconOnly`。可见点击固定为 `to-top → wx.pageScrollTo`，普通/低动效时 pageScrollTo duration 分别为 500ms/0ms，页面 `onPageScroll` 是唯一的 `scrollTop` 回写来源。H5 概览已收敛为“基础用法 / 显示阈值”两个真实长列表，基础 WXML 仅为 `<pui-back-top scroll-top="{{pageScrollTop}}" />` 并保持零 `bind:*`。
- 浏览器实测改变 `scrollTop=300`、`fixed=false`、`text=返回顶部`、`half-round-dark` 后，PreviewDevice 局部滚动、可见态、静态文档流、文案与主题都实时重绘；dark 主题计算样式为 `#242424` 背景、白字和同色边界。点击当前可见 BackTop 将真实局部滚动容器归零。API/属性和基础代码已同源；393px PreviewDevice 与页面均无横向溢出，390px 响应式规则由专项合同锁定。API 单元格不使用 ellipsis/nowrap/crop。内置浏览器对程序化滚动产生的原生 scroll 回调存在桥接限制，未把该工具限制写成组件成功；微信 `onPageScroll` 回写、fixed 安全区与触摸仍保留真机风险。
- 修复 BackTop 源端引用未声明的 `--pui-color-primary`，以及 H5 通用 Button 规则将 `half-round-dark` 覆盖成浅色的真实回归；新增 `--pui-bg-inverse` / `--pui-text-on-inverse` 同名跨端 Token 并以 preview-stage 作用域在通用 Button 规则后重申 BackTop 四主题。新增 `BACKTOP.md`、`test-back-top.js` 与 Ledger `PUI-FB-0135/0136/0137`。`site:build`、完整 `check`、`pack:check`、`example:install`、Ledger generate/check 与源码/dist/示例安装校验通过后，BackTop 按全队列授权自主验收为 `accepted / pending-cli`；微信 CLI 若仍被 `touristappid` 拒绝，不手工伪造 `miniprogram_npm`，下一项为 Sticky。

## 43. Sticky 对照摘要

- 已联网核验 TDesign Sticky 官方页 <https://tdesign.tencent.com/miniprogram/components/sticky>、官方仓库 <https://github.com/Tencent/tdesign-miniprogram> 与 npm 发布页 <https://www.npmjs.com/package/tdesign-miniprogram>（2026-07-20）；固定可复现证据为 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/sticky/{props.js,type.d.ts,sticky.js,sticky.json,sticky.wxml,sticky.wxss}`。
- TDesign 固定公开 `container/disabled/offsetTop/zIndex`、默认 Slot 和唯一 `scroll`。PoemUI 仅保留这条定位主干：4 Props、1 Event、1 default Slot、0 Methods；删除 page/container scroll target、标题/背景、loading/error/retry、占位/安全区/视觉/动效调参与诊断方法。
- 原生 Sticky 以 page scroll + SelectorQuery 测量，达到 offset 后保留同高占位；可选 `container` 只能是返回 NodesRef 的函数，接近容器底部时回到原位置。`scroll` 在布局 `setData` 完成后发布 `{ scrollTop, isFixed }`。基础 WXML 只组合默认 Slot，零 `bind:*`；完整事件只写入 API。
- 官网以真实局部 CSS sticky 展示“基础用法 / 顶部偏移 / 容器边界与禁用”，不以事件文案或静态定位模拟。浏览器实际滚动验证默认吸顶、40px 偏移、容器末端回退与 disabled 普通流；Props 验证空字符串、false 与 `zIndex=0`，并修复此前 H5 将 0 夹紧为 1 的不一致。API 全文显示 4 Props、scroll、default Slot 与零 Methods；两个代码复制入口均真实成功。
- 393px PreviewDevice 无横向溢出，390px 响应式规则由专项合同锁定；dark 与 border/shadow/frost/large-radius/gradient 全部真实开关，随后恢复浅色标准组合。新增 `STICKY.md`、`test-sticky.js` 与 Ledger `PUI-FB-0138/0139/0140`。`site:build`、`check`、`pack:check`、`example:install` 和产物 SHA256 一致性通过。
- 微信 CLI 成功启动 IDE server 后因 `touristappid` 不存在报 code 10，未生成可验证的新 `miniprogram_npm`，因此按用户的全队列授权记录为 `accepted / pending-cli`。`onPageScroll`、SelectorQuery、fixed、rpx、样式隔离、触摸、系统低动效和读屏仍需合法 AppID 真机确认；下一项为 Loading。

## 44. Loading 对照摘要

- 已联网核验 TDesign Loading 官方页 <https://tdesign.tencent.com/miniprogram/components/loading>、官方仓库 <https://github.com/Tencent/tdesign-miniprogram> 与 npm 发布页 <https://www.npmjs.com/package/tdesign-miniprogram>（2026-07-20）；固定可复现证据为 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/loading/{props.js,type.d.ts,loading.js,loading.json,loading.wxml,loading.wxss}`。
- TDesign 公开 `delay/duration/fullscreen/indicator/inherit-color/layout/loading/pause/progress/reverse/size/text/theme`、`default/indicator/text` 三 Slot，未公开 Events 或实例方法。PoemUI 保留该主干并只增加全库通用的 `ariaLabel/reduceMotion`，最终为 15 Props、3 Slots、0 Events、0 Methods；删除旧的 `color/easing/showProgress/vertical` 及 `show/hide`，不再把内部阶段当作对外生命周期。
- 原生端是 `waiting → entering → visible → leaving → hidden` 的实际状态机：`delay=0…2000ms`，通常动效 `0…500ms`，低动效为 1ms；`progress=-1` 隐藏进度，`0` 与 `100` 均是有效值。WXML 真实组合 circular / 12 tick spinner / dots 与三类 Slot，WXSS 使用 opacity/transform 过渡，不用 `height:auto` 或 `display:none` 伪造转场。H5 按“基础用法 / 图标与文字 / 方向与进度 / 全屏与低动效”分区，基础代码零 `bind:*`，并在退场中保留同一 DOM 节点，修复了整段重绘吞掉 500ms 中间帧的真实偏差。
- 浏览器真实操作验证了主题、尺寸、indicator、`layout`、`progress=0/100`、`pause/reverse/fullscreen`、`loading=false/true`、`delay=1000ms`、500ms 退场和低动效；500ms 退场中实测仍连接的节点 opacity 为 `0.0692262`、transition duration 为 `0.4s`，完成后才卸载。API 完整显示 15 Props、3 Slots、0 Events/Methods，两个复制入口均回报真实成功；393px PreviewDevice 外层 `391/391`、viewport `380/380` 无横向溢出。dark、border off、shadow、frost、large-radius、gradient 全部实切后，全屏 Loading 实测为 dark backdrop、`blur(14px) saturate(1.2)` 与真实阴影，随后已恢复浅色标准组合。
- 新增 `LOADING.md`、`test-loading.js` 与 Ledger `PUI-FB-0141/0142`。`site:build`、完整 `check`、`pack:check`、`example:install`、Ledger generate/check 通过；Loading 源码、`miniprogram_dist` 与示例安装的 JS/JSON/WXML/WXSS SHA256 分别一致为 `82f55b6dab59b3875a23e0e6163df883f3997951e5f2ea11894b15e46579729f`、`4ba0e8a99b0f13c6714f1f40333a9d477063c0c5d1fd4394c42a36ec66078b85`、`cbe5d6b9cf53693802e878e737f6f86dfee3846d250be54bf4ede08b3885913e`、`e0b7edba82d69d2821137cbd9929b849dbef4ec9e434f88834c163e418efb29f`。
- 微信 CLI 能启动 IDE server，但在 `touristappid` 的权限查询返回内部 code 10、没有生成可验证的 `miniprogram_npm`；未手工伪造产物，故按用户的全队列授权为 `accepted / pending-cli`。真机仍需以合法 AppID 复核 rpx、Spinner 合成、全屏层级、安全区、复杂 Slot、读屏与系统低动效；下一项为 Toast。

## 45. Toast 对照摘要

- 已联网核验 TDesign Toast 官方页 <https://tdesign.tencent.com/miniprogram/components/toast>、官方仓库 <https://github.com/Tencent/tdesign-miniprogram> 与 npm 发布页 <https://www.npmjs.com/package/tdesign-miniprogram>（2026-07-20）；固定可复现证据为 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/toast/{props.js,type.d.ts,toast.js,toast.json,toast.wxml,toast.wxss}`。官网动态页用于产品用法语义，固定包源码用于 Props、Slot、事件和方法判断。
- TDesign 公开 `direction/duration/icon/message/overlayProps/placement/preventScrollThrough/showOverlay/theme/usingCustomNavbar`、`icon/message` Slot、`close` 和 `show/hide`。PoemUI 保留这条主干并只增加全库 `ariaLabel/reduceMotion`：12 Props、2 Slots、1 Event、2 Methods；删除 `visible/defaultVisible/showIcon/zIndex/motionDuration/easing`、默认 Slot、`input/change/open` 与 `close()` 方法别名。
- 原生 Toast 以 `rendered → entering → visible → leaving → hidden` 的真实状态机执行 `show(options)/hide()`：`duration=0` 持续显示；自动或手动 hide 都保留节点完成固定 500ms（低动效 1ms）退场，卸载后只发布一次 `close`。Overlay 仅由 `showOverlay/preventScrollThrough` 组合 PUI Overlay，不把遮罩或 close 写成业务成功。
- 官网已改为“基础用法 / 主题与图标 / 方向与位置 / 遮罩与滚动保护”四区，基础 WXML 为 `<pui-toast id="delivery-toast" />` 且零 `bind:*`；隐藏态保留真实 PUI Button。浏览器实点 Props 后 message、loading、column、top 与 Overlay 均真实回写；API 完整显示 12 Props、close、icon/message、show(options)/hide()，96 个 API 单元格无 `ellipsis/nowrap/hidden` 裁切；复制基础代码得到零 bind 的真实 WXML。
- 浏览器实测修复了两处偏差：旧 component-only 清理方法面板会留下空舞台；H5 漏注入 `--pui-toast-ease` 时计算 transition 为 `0s`。现标准 transition 为 opacity/transform 各 500ms，`reduceMotion=true` 为各 1ms；error 为 assertive，其余为 polite。390px 实测 `innerWidth=390`、document/body `375/375`、PreviewDevice `351px`，无页面级横向溢出；dark、border off、shadow、frost、large-radius、gradient 均已真实切换并恢复标准浅色。
- 新增 `TOAST.md`、`test-toast.js` 与 Ledger `PUI-FB-0143/0144/0145/0146`。`site:build`、完整 `check`、`pack:check`、`example:install`、Ledger generate/check 通过；源码、`miniprogram_dist`、npm tarball 安装的 JS/JSON/WXML/WXSS SHA256 分别一致为 `a610c7f82eb40ff5bc94fb4580fbeecfce26bc4ae1bc480d149b35fbc35ca94c`、`203a31b0ad951cf6752af20024ddb682bbd0984583748fcfaf27d89823d4cb86`、`e06d396a278bed829fc16f109ff58bdb47dab04b8ff36789c11bf4ee1eaf7b45`、`fe272c0a2ba69a3da75ccc1e0f43c2a3333f62f4233172f3d1ace1eb742acb66`。微信 CLI 仅因 `touristappid` 不存在报内部 code 10，未生成 Toast `miniprogram_npm` 且未手工冒充；按范围化自主验收记录为 `accepted / pending-cli`。真机仍需合法 AppID 复核 fixed/Overlay 触摸、rpx/安全区、Slot 投影、读屏、后台计时与系统低动效；下一项为 Dialog。

## 46. Dialog 对照摘要

- 已联网核验 TDesign Dialog 官方页 <https://tdesign.tencent.com/miniprogram/components/dialog>、官方仓库 <https://github.com/Tencent/tdesign-miniprogram> 与 npm 发布页 <https://www.npmjs.com/package/tdesign-miniprogram>（2026-07-20）；固定可复现证据为 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/dialog/{props.js,type.d.ts,dialog.js,dialog.json,dialog.wxml,dialog.d.ts,index.d.ts}`。动态页用于真实用法与演示结构，固定包源码用于 Props、事件顺序、Slot 和 close() 判断。
- TDesign 公开 14 项 `actions/buttonLayout/cancelBtn/closeBtn/closeOnOverlayClick/confirmBtn/content/overlayProps/preventScrollThrough/showOverlay/title/usingCustomNavbar/visible/zIndex`、`confirm/cancel/close/overlay-click/action`、`top/title/content/middle/actions/cancel-btn/confirm-btn` 和 `close()`。PoemUI 保留该主干并仅增加全库横向 `ariaLabel/reduceMotion`，最终为 16 Props、5 Events、7 Slots、1 Method；明确没有 default/header-left Slot，也不再拥有 loading/error/empty/retry 根级状态。
- 事件边界保持真实：Confirm 与 action 只上抛业务请求且不自动关闭；Cancel 固定 cancel→close；Close 按钮、close() 与允许关闭的遮罩请求 close，父级负责回写 visible=false。actions 存在时替代内建 cancel/confirm；按钮 disabled/loading 由 PUI Button 实际阻断。
- 原生 Dialog 通过 Popup 实际承接 `overlayProps/preventScrollThrough/usingCustomNavbar`，并补齐 Popup 的安全颜色映射；H5 以“基础用法 / 按钮与布局 / 具名插槽 / 遮罩与关闭”四区镜像，基础 WXML 为 `<pui-dialog id="delivery-dialog"/>`、零 `bind:*`。遮罩覆盖完整 PreviewDevice，隐藏后仍保留真实 PUI Button 入口；正常/低动效为 500ms/1ms，禁止 `height:auto` 或 `display:none` 瞬移。
- 浏览器实际验证 Close、Cancel、Confirm、action、具名 Slot、遮罩空白区、showOverlay=false、Props title/actions/reduceMotion、disabled/loading action 和重置；Confirm/action 保持可见，showOverlay=false 时 scrim=0。390px 下 Dialog 完整在视口且页面无横向溢出；dark、border、shadow、frost、large-radius、gradient 均实际读取计算样式后恢复标准浅色。API 135 个单元格无 ellipsis/nowrap/裁切，基础代码复制为零 bind。新增/更新 `DIALOG.md`、`test-dialog.js` 与 Ledger `PUI-FB-0006/0027/0147/0148`。
- `site:build`、完整 `check`、`pack:check`、`example:install`、Ledger generate/check 均已通过。源码、`miniprogram_dist`、npm 示例安装的 Dialog JS/JSON/WXML/WXSS SHA256 分别一致为 `2006b9be6c93234eac2bb5abb521117ae98410e72a5ac23b6c358069ac084a92`、`80449554a04320351da90ed1b7437fb8f3bca1a84942cb65cda4c921176318ce`、`024a83ec1d30c173d856730b42c8378007a28677c00b7734fcc2685ba039222e`、`aa197e9ac6ad389a891c01c60ecf9f436d9086b80c078edbe736871d45d9270e`。微信 CLI 已启动 IDE server，但 `touristappid` 权限查询返回内部 code 10，未生成本次 `miniprogram_npm`，绝不手工伪造；Popup 遮罩/catchtouchmove、rpx、安全区、复杂 Slot、读屏与系统低动效仍需合法 AppID 真机复核。按用户全队列授权，Dialog 为 `accepted / pending-cli`，本次停在 Dialog。

## 47. Progress 对照摘要

- 已联网核验 TDesign Progress 官方页 <https://tdesign.tencent.com/miniprogram/components/progress>、官方仓库 <https://github.com/Tencent/tdesign-miniprogram> 与 npm 发布页 <https://www.npmjs.com/package/tdesign-miniprogram>（2026-07-20）；固定可复现证据为 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/progress/{props.js,type.d.ts,progress.js,progress.json,progress.wxml,progress.d.ts}`。动态页用于用法结构，固定包源码用于 Props、Slot、Events 和 Methods 判断。
- TDesign 公开 `color/label/percentage/size/status/strokeWidth/theme/trackColor` 八项 Props、唯一 `label` Slot、0 Events、0 Methods。PoemUI 保留确定进度主干，只增加全库 `ariaLabel/reduceMotion`：最终为 10 Props、1 Slot、0 Events、0 Methods；拒绝 external classes、平台私有样式、未实现渐变对象和所有历史 value/indeterminate/业务状态别名。
- Progress 的唯一数据源是父级 `percentage`。原生以线形、饱满线形和 WXML 双半圆呈现，H5 分别以真实 width 与 SVG stroke-dashoffset 镜像；标准动效 500ms，reduceMotion/系统低动效为 1ms。100% 只是视觉默认 success，不发布完成事件、更不代表业务请求成功；未知进度由 Loading，错误/空态/重试由外部组合承担。
- 官网重建为“基础用法 / 三种形态 / 状态与颜色 / label Slot”四区；基础 WXML 仅 `<pui-progress id="delivery-progress"/>`，零 `bind:*`。H5 的推进操作只修改父级 Props；浏览器实点 `64%→74%`，现场读取 `pui-progress-value-line` 中间帧 running、结束目标值，继续验证 line/plump/circle、0/100、warning、label 字符串、低动效、dark 与边框/阴影/毛玻璃/大圆角开关并恢复默认。
- battle 现场发现并修复 metadata 未声明 WXML 已存在的 label Slot、Progress 专属合同遗漏强制“明确禁止 / 修改闭环”章节、plump 读数为不可读的22rpx、以及两端引用未定义 `--pui-text-on-primary`。API 现真实显示 10 Props、唯一 label Slot 和“default Slot 不存在”；新增 `PROGRESS.md`、`test-progress.js` 与 Ledger `PUI-FB-0149/0150`。
- `site:build`、完整 `check`、`pack:check`、`example:install`、Ledger generate/check 已通过。Progress 源码、`miniprogram_dist` 与示例安装三层 JS/JSON/WXML/WXSS SHA256 分别一致为 `5b203ba02857987f4558004eef83e3663415ca72230320b4185ec2f60aed3d92`、`dab5863f45171fa76233ffd427dcdab92b3884ca0eee2fb44f9836e46ac11cff`、`366a9c9d5a83d27cfc309730300c04ddb4ef9a956b0223fccd8d3c5c90bb5995`、`3f0d8507c9b49e24665fac774f91c60c4187c75605c2d5080012b3b175cb13e1`。微信 CLI 因 `touristappid` 不存在返回 code 10，Progress `miniprogram_npm` 未生成、未手工伪造；本项按范围化自主验收为 `accepted / pending-cli`，真机仍需合法 AppID 复核环形合成、rpx、长 Slot、读屏和系统低动效。

## 48. Skeleton 对照摘要

- 已联网访问 TDesign Skeleton 官方页 <https://tdesign.tencent.com/miniprogram/components/skeleton>、官方仓库 <https://github.com/Tencent/tdesign-miniprogram> 与 npm 发布页（2026-07-20）；固定可复现证据为 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/skeleton/{props.js,type.d.ts,skeleton.js,skeleton.wxml,skeleton.wxss}`。动态官网用于用法分区与产品语义，固定包源码用于公开能力判断。
- TDesign 固定包公开 `animation/delay/loading/rowCol/theme`，无公开 Events 或 Methods。PoemUI 只补全库横向 `ariaLabel/reduceMotion`，最终为 7 Props、1 个默认 Slot、0 Events、0 Methods；`rowCol=[]` 时以 avatar/image/paragraph/text 提供结构默认值，默认 Slot 只在 `loading=false` 回显就绪内容。
- 删除旧 avatar/尺寸/形状/间距/具名 placeholder、私有 duration/easing、show/hide 与 pulse/wave。Skeleton 不再承担 empty/error/retry/成功语义；基础 WXML 为 `<pui-skeleton />`，零 `bind:*`。
- 官网重建为“基础用法 / 占位布局 / 主题与动效 / 内容回显”四区，真实 PUI Button 只回写父级 loading；属性/API/compatibility/代码复制同源，API 显示 7 Props 和唯一 default Slot。浏览器实测 PUI Select、delay、合法/非法 rowCol、低动效、loading 往返、1000ms 等待与取消、深浅色和六项视觉开关；修复了 H5 compatibility 仍写 show/hide、placeholder Slot 与 pulse/wave 的公开漂移。
- 新增 `SKELETON.md`、`test-skeleton.js` 与 Ledger `PUI-FB-0151/0152`。375px PreviewDevice 设备宽、组件展示宽和滚动 viewport 均无横向溢出；内置浏览器不能独立设置页级 390px 视口，响应式专项合同覆盖该断点，目标手机浏览器仍保留最终确认。

## 49. Empty 对照摘要

- 已联网访问 TDesign Empty 官方页 <https://tdesign.tencent.com/miniprogram/components/empty>、[官方仓库](https://github.com/Tencent/tdesign-miniprogram) 与 [npm 发布页](https://www.npmjs.com/package/tdesign-miniprogram)（2026-07-20）；固定可复现证据为 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/empty/{props.js,type.d.ts,empty.js,empty.wxml,empty.wxss}`。动态官网用于空状态语义与演示分区，固定包源码用于公开 API 判断。
- TDesign 固定包公开 `description/icon/image` 三项 Props、`image/description/action` 三个具名 Slot、0 Events、0 Methods。PoemUI 保留同一结构主干，仅补全库横向 `ariaLabel/reduceMotion`，最终为 5 Props、3 Slots、0 Events、0 Methods；拒绝历史 `title/size/theme/imageMode/imageSize/action*`、默认 Slot、内部 Button、load/error/action 事件与实例方法。
- 图形严格为 `image → icon → image Slot`，Empty 根保持透明。图片由内部 PUI Image 处理真实加载和失败回退；错误/重试仍由父级状态区组合 Empty 与同级 PUI Button，点击只请求父级更新，不能伪造成功。
- 官网重建为“基础用法 / 图形内容 / 具名 Slot / 低动效”四区，基础 WXML 为 `<pui-empty description="暂无内容" />`，零 `bind:*`。真实浏览器点击 action Slot 的 Button 后父级说明实际回写；键盘清空 `description` 后基础 WXML 移除该 Prop；验证对象 icon、Image 成功和真实失败回退、500ms/1ms、代码复制、API/属性同源、light/dark 与边框/阴影/毛玻璃/大圆角/渐变。
- 390px 浏览器实测 `window.innerWidth=390`、document/body `375/375`、PreviewDevice `349/349`、图形网格 `282/282` 且单列重排；API 三表 31 个单元格完整显示、无省略或横向溢出。新增 `EMPTY.md`、`test-empty.js`、PUI-FB-0153/0154；同步修复 Grid、Collapse、Indexes、Sidebar 和全局状态组合测试仍断言已删除 `Empty bind:action` 的依赖回归。
- `site:build`、`check`、`pack:check`、`example:install` 和 Ledger generate/check 已通过；源码、dist、示例安装四件套 SHA256 已一致。微信 CLI 因示例 `touristappid` 不存在返回内部 code 10，未生成 `miniprogram_npm`、未手工伪造。按用户范围化授权，本项为 `accepted / pending-cli`；合法 AppID 真机仍需复核图片解码/域名、rpx、Slot 投影、样式隔离、读屏与系统低动效。

## 50. NoticeBar 对照摘要

- 已联网访问 [TDesign NoticeBar 官方页](https://tdesign.tencent.com/miniprogram/components/notice-bar)、[官方组件源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/notice-bar) 与 [npm 发布页](https://www.npmjs.com/package/tdesign-miniprogram)（2026-07-20）；为避免动态官网和 develop 分支漂移，固定可复现证据为实际下载的 `tdesign-miniprogram@1.15.3` 中 `miniprogram_dist/notice-bar/{props.js,type.d.ts,notice-bar.js,notice-bar.wxml}`。
- TDesign 的公开主干为 `content/direction/interval/marquee/operation/prefixIcon/suffixIcon/theme/visible/defaultVisible`，`vertical` 以 `change` 返回 `{ current, source }`，区域点击以 `click` 返回 `{ trigger }`，并有 `content/operation/prefix-icon/suffix-icon` 四个具名 Slot、0 Methods。PoemUI 保留该主干，按库横向语义仅增加 `ariaLabel/reduceMotion`，最终为 12 Props、2 Events、4 Slots、0 Methods；删除旧的 `icon/showIcon/closable/wrap/pauseOnTouch/disabled/duration/marqueeDuration/easing`、生命周期事件和实例方法。`defaultVisible=true` 是保留既有 `<pui-notice-bar />` 可见默认体验的有意差异，已登记，不伪称与 TDesign 默认值相同。
- 小程序端 horizontal 通过 SelectorQuery 实测真实溢出后才按 `speed/loop/delay` 做 12px 分段；vertical 用真实 swiper 按 `interval` 轮播。`visible` 非空即受控，点击只请求父级回写；默认 PUI Button 不再与外层 `catchtap` 重复触发 click。进入/离开固定 500ms，`reduceMotion` 压缩为 1ms，未使用 `height:auto` 或 `display:none` 瞬移。
- H5 以同节点 `requestAnimationFrame` 生命周期、DOM 宽度测量和同一事件合同镜像 WXML；预览分为基础、状态、滚动、内容区域和受控显隐，基础 WXML 不含 `bind:*`。浏览器在 390×844 真实操作确认 operation 父级写回、suffix-icon 受控隐藏、visible false/true、vertical 自动从第一条到第二条、进入中间帧 `opacity=0.810029/max-height=97.2034px`、低动效 `1ms`、代码复制和 API。长文本下页面 `375/375`、PreviewDevice `349/349`、NoticeBar `280/280`，671px 正文在 106px viewport 内真实溢出并产生负位移，未产生页面横向滚动；light/dark、边框、阴影、毛玻璃、大圆角和渐变均已实际切换。控制台为 0 warning/error。
- 新增 `NOTICEBAR.md`、`test-notice-bar.js` 与 PUI-FB-0155/0156/0157；并补齐共享属性面板的合法 JSON/数值错误边界（保留上次有效 Props，`aria-invalid`、`role=alert` 与真实错误文案），不再只显示红框。`site:build`、`check`、`pack:check`、`example:install`、Ledger generate/check 均通过；源码、dist、示例安装和实际 tarball 的 NoticeBar JS/JSON/WXML/WXSS SHA256 均逐字节一致。微信 CLI 用 `touristappid` 在权限阶段返回 code 10，未生成 `miniprogram_npm`，未手工伪造；按用户范围化授权为 `accepted / pending-cli`，保留合法 AppID 真机对 swiper、SelectorQuery、rpx 回流、样式隔离、触摸和系统低动效的风险。

## 51. Result 对照摘要

- 已联网访问 [TDesign Result 官方页](https://tdesign.tencent.com/miniprogram/components/result)、[官方组件源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/result) 与 [npm 发布页](https://www.npmjs.com/package/tdesign-miniprogram)（2026-07-20）；为避免动态官网与 develop 分支漂移，固定可复现证据为下载的 `tdesign-miniprogram@1.15.3` 中 `miniprogram_dist/result/{props.js,type.d.ts,result.js,result.wxml,result.wxss}`。
- TDesign 固定包公开 `description/icon/image/theme/title`、`image/title/description` 三个具名 Slot、0 Events、0 Methods。PoemUI 保留该展示主干，只补全库横向 `ariaLabel/reduceMotion`，最终为 7 Props、3 Slots、0 Events、0 Methods；拒绝历史双操作、Loading/Retry、私有动效、默认 Slot 和 `primary/secondary/load/error` 伪事件。`icon` 支持 Boolean/String/Object，`image → icon → image Slot` 为固定图形优先级。
- 小程序 Result 根保持透明，只组合 PUI Image 与 Icon；error 使用 `role=alert/aria-live=assertive`，其他主题为 polite status。动效固定 500ms，`reduceMotion` 压缩为1ms，不对 `height:auto` transition，也不使用 `display:none` 制造瞬移。页面业务重试、提交和跳转必须由父级组合 PUI Button 并自行回写。
- 官网按“基础用法 / 组件类型 / 具名 Slot”重建，基础 WXML 为 `<pui-result></pui-result>`、零 `bind:*`；对象 icon、图片优先、false/空字符串、Props 回写/重置、深浅色、六项外观开关和代码复制均在真实浏览器操作。API 显示7 Props与3 Slots，client/scroll=955/955，单元格无省略。390×844 实测 window=390，document/body/stage=375/375、PreviewDevice=349/349、Result=282/282，无横向溢出。
- battle 现场修复四组通用 H5 preview Surface 把透明 Result 根变为卡片并将动效覆盖为500ms的漂移；修复后根实测 `rgba(0,0,0,0)/0px/none/0.18s`，低动效为1ms。并修正共享 Loading 几何测试仍要求已移除 Result Loading 镜像的过期名单；没有为了通过测试把 Loading 假能力加回。
- 新增 `RESULT.md`、`test-result.js` 与 Ledger `PUI-FB-0158/0159/0160`。`site:build`、`check`、`pack:check`、`example:install`、Ledger generate/check 已通过；源码、dist、示例安装和真实 tarball 的 Result JS/JSON/WXML/WXSS 逐字节一致。微信 CLI 在 `touristappid` 权限阶段返回 code 10，未生成 `miniprogram_npm` 且未手工伪造；按用户范围化授权为 `accepted / pending-cli`，保留合法 AppID 对图片域名/解码、rpx、Slot 投影、样式隔离、500ms 中间帧、读屏和系统低动效的真机验收。

## 52. Popup 对照摘要

- 已联网访问 [TDesign Popup 官方页](https://tdesign.tencent.com/miniprogram/components/popup)、[官方 Popup 源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/popup)（2026-07-22）；npm 发布页在本次查询中返回 403，固定可复现证据继续使用已审计的 `tdesign-miniprogram@1.15.3` `miniprogram_dist/popup/{props.js,type.d.ts,popup.js,popup.wxml,popup.wxss}`。在线页用于产品信息，固定包用于可复现 API。
- TDesign 基础公开 `closeBtn/closeOnOverlayClick/content/duration/overlayProps/placement/preventScrollThrough/showOverlay/usingCustomNavbar/visible/defaultVisible/zIndex`、`visible-change`、`default/content/close-btn` 三个 Slot、0 Methods，未提供 `card` 或遮罩模糊 Prop。PoemUI 在此之上保留结构化 `showHeader/title/subtitle/showFooter`、横向 `ariaLabel/reduceMotion`，并明确扩展 `card`（默认卡片留白，false 贴边）和 `blurOverlay`（仅真实遮罩 backdrop blur），最终为 20 Props、1 Event、5 Slots、0 Methods；不把这两个视觉 Props 扩展为业务状态、事件或方法。
- 原生 Popup 重建为完整 layer、可选 mask、五向 Surface、可选 PUI Button 关闭轨道和退场保留；`visible` 非空为受控，`defaultVisible` 仅初始化非受控，关闭统一发布 `{ visible:false, trigger:'close-btn'|'overlay' }`。基础 WXML 固定为 `<pui-popup />`，零 `bind:*`。
- 2026-07-27 再次访问 TDesign 官方页与 develop 源码确认其仍只提供默认/`content`/`close-btn` 三个 Slot；PoemUI 为跨 Surface 复用 TopLoading 增加 `surface-top`，它是明确的设计系统增量而非照搬。该 Slot 只承接不占布局的顶边反馈，Surface 负责定位与圆角裁切，消费者负责真实请求状态。
- H5 收敛为 bare Surface：隐藏时按顶部、左侧、居中、右侧、底部显示五个真实打开入口，入口真实写入 `placement`；打开后实际点击遮罩、closeBtn、受控/非受控与 `closeOnOverlayClick=false` 均触发或阻断父级回写。Dialog、Picker、Sheet 同步改为只监听 `visible-change` 并自行管理内容和生命周期，不再依赖 Popup 私有 Header/状态/after-*。
- 浏览器实测 bottom 位置、500ms CSS transition、`reduceMotion=true` 的 `0.001s`、深色 Popup 的中性 Surface；阴影、毛玻璃、大圆角实际得到双层阴影、`blur(18px) saturate(1.35)`、24px 圆角。393px PreviewDevice 内部 `clientWidth/scrollWidth=391/391`，API 14 Props、1 Event、3 Slots 的全文自然换行，未使用省略。
- 新增 `POPUP.md`、`test-popup.js` 和 Ledger `PUI-FB-0163/0164`，并更新共享状态/Loading 覆盖测试，防止移除的业务状态被假能力重新加回。最终构建、安装产物与微信 CLI 的实际结果记录在开发进度 #90；微信真机固定遮罩、触摸穿透、rpx 中间帧、安全区、Slot 投影、样式隔离和读屏仍需合法 AppID 复核。

## 53. Popover 对照摘要

- 2026-07-20 已联网访问 [TDesign Popover 官方页](https://tdesign.tencent.com/miniprogram/components/popover)、[官方组件源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/popover) 和 npm 发布页；固定可复现证据为 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/popover/{props.js,type.d.ts,popover.js,popover.wxml,popover.wxss}`。
- TDesign 固定包公开 `close-on-click-outside/content/fixed/placement/show-arrow/theme/visible/defaultVisible` 与 `style/custom-style`，一个 `visible-change`，默认/`content` 两个 Slot，0 Methods。PoemUI 保留真实锚点、12 位置、六主题、受控/非受控、外部关闭和两个 Slot，横向补齐 `ariaLabel/reduceMotion`，最终为 10 Props、1 Event、2 Slots、0 Methods；拒绝 `style/custom-style` 这类逃逸入口，避免绕过 PUI Token。历史公开的 28 Props、tap/longpress/manual、Loading/Empty/Error/Retry、标题/页脚和 `open/close/toggle` 等伪业务合同全部删除。
- 原生端以同一 retained node 完成 500ms（低动效 1ms）入退场；`visible` 非空时严格等待父级回写，非受控只由 `defaultVisible` 初始化。真实 `visible-change` detail 只含 `{ visible }`，位置在同轴空间不足时翻转，`fixed` 读取视口坐标。H5 复用 PUI Button 作为入口，透明外部点击层仅承担组件交互根；没有手写假成功或只改提示文本。
- 浏览器实际点击入口、外部区域和 Props 面板，验证默认/受控/非受控、`false`、空 content、12 位置、主题、箭头、fixed、关闭开关、180ms/1ms、复制、深浅色及边框/阴影/毛玻璃/大圆角/渐变。现场修复两项真实漂移：属性页仍列出已删除的触发/状态/事件，以及旧 CSS 后置规则把内容设为不可见；同时将锚点和箭头距离改为 PUI Token，避免布局契约逃逸。iPhone SE 375px PreviewDevice 的 viewport 为 `373/373`，无内部横向溢出；独立 390px 网页 viewport 仍需真机/可设定移动模拟器复核，不能以桌面浏览器宿主宽度替代。
- 新增 `POPOVER.md`、`test-popover.js` 和 Ledger `PUI-FB-0165/0166/0167`；0167 记录并修复了删除原生 Loading 后共享覆盖名单仍要求 Popover H5 Loading 镜像的过期测试，未为绿灯恢复假状态。最终构建、安装产物与微信 CLI 的实际结果记录在开发进度 #194；微信 CLI 因示例 `touristappid` 不存在返回 code 10，未生成也未手工伪造 `miniprogram_npm`。真机仍需以合法 AppID 验收 rpx/SelectorQuery、fixed 视口碰撞、触摸外部关闭、Slot 投影、样式隔离、读屏与系统低动效。


## 54. DropdownMenu 对照摘要

- 2026-07-20 联网参考 [TDesign DropdownMenu](https://tdesign.tencent.com/miniprogram/components/dropdown-menu)、[官方 dropdown-menu 源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/dropdown-menu) 与固定 `tdesign-miniprogram@1.15.3`。实际读取发布包的 `dropdown-menu/{props.js,type.d.ts,dropdown-menu.js,dropdown-menu.wxml}` 和 `dropdown-item/{props.js,type.d.ts,dropdown-item.js,dropdown-item.wxml}`；父级提供遮罩、时长和层级，子级提供选值、multiple、confirm/reset。
- PoemUI 最终公开 8 Props：`items/value/defaultValue/closeOnClickOverlay/showOverlay/zIndex/ariaLabel/reduceMotion`；5 Events：`open/close/change/confirm/reset`；default/footer 两个 Slots；0 Methods。以一个 items 条目表达 TDesign DropdownItem 的筛选语义，不为容器拆分创建第二个公共包。
- 收敛旧 43 Props、多列 columns、显隐、请求状态、根 readonly/disabled、滚动、placement、样式逃生口、私有动效与实例方法。拒绝 `style/custom-style`、arrow-icon、options-columns 和已弃用 options-layout；固定 500ms，低动效为 1ms。
- H5 以共享 PUI Button/Icon/Empty 镜像真实触发器、选项和多选动作，完整遮罩仅保留浏览器桥接 button；单选 `change → close`，多选 `change`，重置 `change → reset`，确定 `confirm → close`。专项测试、真实浏览器、390px、主题和外观、产物一致性与微信 CLI 结果见进度第 197 行和 Ledger `PUI-FB-0173/0174/0175`。

## 56. Overlay 对照摘要

- 2026-07-20 已联网核验 [TDesign Overlay](https://tdesign.tencent.com/miniprogram/components/overlay)、[官方 Overlay 源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/overlay) 与固定 `tdesign-miniprogram@1.15.3`。实际读取发布包 `miniprogram_dist/overlay/{props.js,type.d.ts,overlay.js,overlay.wxml,overlay.wxss}`；固定包的根点击只发布 `click({ visible: !visible })`，并不保存非受控显隐值。
- PoemUI 收敛为 9 Props：`visible/backgroundColor/blur/duration/preventScrollThrough/usingCustomNavbar/zIndex/ariaLabel/reduceMotion`，唯一 `click({ visible:false })` Event、唯一 default Slot、零 Methods；基础 WXML 固定为 `<pui-overlay/>`，零 `bind:*`。Overlay 默认是半透明纯颜色遮罩；`blur=true` 单独请求 `--pui-overlay-blur`，Provider 的 `frostedGlass=true` 也自动应用同一 Token，二者取并集。删除旧 `defaultVisible`、位置、内边距、安全区、关闭策略、disabled、easing、after-*、实例方法和私有 Card/反馈面板，不用通用 `style/custom-style` 逃生口绕过 Token。
- 原生端以 retained fixed layer 完成 500ms opacity 进退场（低动效 1ms）；根只发出关闭请求，父级决定是否回写。`preventScrollThrough` 以 `catchtouchmove` 阻断，`usingCustomNavbar` 从胶囊与状态栏计算真实 top；H5 同一 PreviewDevice 以真实 PUI Button 打开、PUI Cell 作为 Slot，并通过遮罩桥接实际回写 Props。
- Chrome 390×844 真实实点：默认打开、Slot 冒泡关闭和父级回写；`duration=400` 的离场节点保留且 `pointer-events:none`，随后卸载；`usingCustomNavbar=true` 遮罩实际从 44px 示例导航栏下开始，活跃遮罩 CUA 滚动不带动页面；自定义 `rgba` 背景、reduceMotion `1ms`、light/dark、border、shadow、frost、large-radius、gradient 都真实切换并恢复标准组合。页面 document/client 为 375/375，无横向溢出；API 的 65 个单元格均无 ellipsis、nowrap 或滚动裁断。
- 新增 `OVERLAY.md`、`test-overlay.js` 与 Ledger `PUI-FB-0182`；同时修正 overview 专项测试仍把 Overlay 误称为“打开浮层”的过期触发器合同。`feedback:generate/check`、`site:build`、完整 `check`、`pack:check`、`example:install` 均通过。源码、`miniprogram_dist`、示例 npm 安装和 tarball 的 JS/JSON/WXML/WXSS SHA256 分别一致为 `93c596cb54e3f1c597fd6a05d9ea7be46752e085ee907a6948cf59c16f0222b6`、`356076a5f7eadd08fdbb120b822968eb3d563862c43a22918de2db5c6f699e9e`、`4abf24f6f0cd945e3929e4ee2dceb9b6a23544c69025225fc40182a034776249`、`71a9774d4c45b10ca93b022d8ee00db5a6dc2587b58d5c50d0e7741fb0973d9e`。
- 微信 CLI 已实际启动 IDE server，但示例 `touristappid` 在权限阶段被拒绝为不存在 AppID（code 10），因此本次没有生成也没有手工伪造 `miniprogram_npm`。合法 AppID 真机仍须核验 fixed 遮罩、胶囊距离、catchtouchmove、rpx/安全区、Slot 投影、样式隔离、读屏与系统低动效；按用户本 Goal 的范围化自主验收授权，本项标记为 `accepted / pending-cli`。

## 57. SwipeCell 对照摘要

- 2026-07-20 已联网核验 [TDesign SwipeCell](https://tdesign.tencent.com/miniprogram/components/swipe-cell)、[官方源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/swipe-cell) 与固定 `tdesign-miniprogram@1.15.3`。实际读取 `miniprogram_dist/swipe-cell/{props.js,type.d.ts,swipe-cell.js,swipe-cell.wxml,swipe-cell.wxs}`：公开 `disabled/left/opened/right`、`click/dragstart/dragend`、default/left/right Slot；内置 `open/close/closeOther` 不列为 API。
- PoemUI 收敛为 6 Props：`disabled/left/opened/right/ariaLabel/reduceMotion`；3 Events：`click({ action, source })/dragstart/dragend`；3 Slots：`default/left/right`；零 Methods。基础 WXML 为 `<pui-swipe-cell><pui-cell .../></pui-swipe-cell>`，零 `bind:*`。删除历史的 Cell 内容、默认展开、动作宽度/速度/关闭策略、loading/empty/error/retry、业务事件和公开命令。
- 原生端在 10px 后才判定方向，横向位移越过对应动作实际宽度 30% 才展开；数组项 style 内的 `width`（rpx/px）真实参与宽度与阈值。动作点击固定先发 click 意图再收起，内容轻点只收起；动效只过渡 transform，固定 500ms，低动效 1ms。
- H5 复用 PUI Button/Cell，以 Pointer Events 镜像 touch，并修复两项 battle 发现：构建站点未更新时属性页残留旧 22 Props；已归一化的 left/right 被二次按 Boolean/Array 解析，导致 `opened=true` 面板成功而预览错误收起。重新构建后真实 CUA 左滑打开 right（-68px）、右滑打开 left（68px），`opened=true/[true,false]` 分别打开右/左，disabled 阻断拖拽。收起动画 45ms 中间帧为 -35.3216px、结束为 0；低动效为 1ms。
- 390×844 下 document/body 无横向溢出；API 实显 6 Props、3 Events、3 Slots、0 Methods，全文无 ellipsis/nowrap/裁切。dark、shadow、frost、large-radius 实点后 Cell 读取暗色半透明 Surface、blur、shadow 与语义圆角，随后恢复标准偏好。完整门禁还发现并修复 SwipeCell 动作层未定义 `--text-inverse`，统一复用 `--pui-text-on-inverse`，并删除仍要求已移除 Loading 镜像的过期共享覆盖项。专项测试、Ledger、构建与安装产物的最终结果记录在开发进度 #199；Ledger 为 `PUI-FB-0183/0184/0185`。微信 CLI 若示例 `touristappid` 拒绝则不生成也不伪造 `miniprogram_npm`；合法 AppID 真机仍需验收触摸惯性、rpx 回流、Slot 投影、样式隔离、读屏和系统低动效。

## 58. Watermark 对照摘要

- 2026-07-20 已联网核对 [TDesign Watermark](https://tdesign.tencent.com/miniprogram/components/watermark)、[官方组件源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/watermark) 和 npm 发布页；为避免动态官网与 develop 分支漂移，固定可复现证据为实际读取的 `tdesign-miniprogram@1.15.3` 中 `miniprogram_dist/watermark/{props.js,type.d.ts,watermark.js,watermark.wxml,watermark.wxss,watermark.json}`。官方页面受访问策略限制时，不以页面失败替代事实，改以官方仓库和固定包交叉核验。
- 固定包公开 `alpha/content/height/isRepeat/layout/lineSpace/movable/moveInterval/offset/removable/rotate/watermarkContent/width/x/y/zIndex`、default/content 两个 Slot、0 Events、0 Methods。PoemUI 保留所有可真实执行的铺排主干，补齐横向 `ariaLabel/reduceMotion`，最终为 17 Props、2 Slots、0 Events、0 Methods；拒绝旧 `text/image/imageWidth/imageHeight/imageMode/gapX/gapY/offsetX/offsetY/opacity/fontSize/fontWeight/color/repeat/disabled/fullscreen/maxMarks/duration/easing`、旧图片/状态事件和 `refresh/getState`。固定包虽声明 `removable`，但没有可独立验证的防移除语义，PoemUI 不承诺无法兑现的安全能力。
- 原生端以真实根 `SelectorQuery` 尺寸、旋转包围盒 overscan 和矩形/六边形算法生成文本、图片或图文 mark；`isRepeat=false` 为一枚居中 mark，`movable` 按 `moveInterval` 真实重绘，固定可见过渡 500ms，`reduceMotion` 停止移动并压缩为 1ms。水印层始终 `pointer-events:none/aria-hidden`，Slot 内容保持可点击、输入与滚动；没有 loading、empty、error、retry、disabled、图片成功/失败或“已保护”假状态。
- H5 复用 PUI Cell 与 Button 的共享镜像，当前属性的 Slot Button 真实改写 `isRepeat`，不是状态提示。浏览器实测 JSON 图案重绘 81 枚、单枚为 1 枚、再次切换回重复恢复 81 枚；`offset:[0,0]` 在 282×188 单枚根精确为 141px/94px。现场修复 H5 对 `0` 使用 `||` 回退、Watermark 根继承通用 Surface，以及兼容说明误套通用事件文本；根现为 transparent/0px/none，Slot 内 Cell 承担主题、边框、阴影、毛玻璃和圆角。
- 390×844 下 document/body 横向溢出为 0。API 实显 17 Props、2 Slots、0 Events、0 Methods，所有字段自然换行，未检测到 ellipsis、nowrap 或裁切；light/dark、border、shadow、frost、large-radius 和 gradient 均真实切换，随后恢复标准组合。新增 `WATERMARK.md`、`test-watermark.js` 和 Ledger `PUI-FB-0186/0187`；最终门禁、安装产物和微信 CLI 结果记录在开发进度 #200。微信 CLI 若由示例 `touristappid` 拒绝，则不生成也不手工伪造 `miniprogram_npm`；合法 AppID 真机仍须验收 SelectorQuery/rpx、图片资源、Slot 投影、样式隔离、读屏和系统低动效。

## 59. ScrollArea / ScrollView 对照摘要

- 2026-07-20 联网核对 [TDesign ScrollView 官方源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/scroll-view)、[官方 WXML](https://github.com/Tencent/tdesign-miniprogram/blob/develop/packages/components/scroll-view/scroll-view.wxml)，并实际读取固定 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/scroll-view/{scroll-view.d.ts,scroll-view.js,scroll-view.wxml,scroll-view.wxss,scroll-view.json}`。当前官方与固定包都以原生纵向 `scroll-view`、`enhanced`、隐藏滚动条和 Slot 为根，固定包只声明 `scrollIntoView`，没有 Events 或公开 Methods。
- PoemUI 当前保留可实际兑现的 `height/scrollTop/scrollIntoView/gradientOverlay/gradientOverlayColor/gradientOverlaySize/contentPaddingBottom/ariaLabel`、唯一 default Slot、1 个 `scroll` Event、0 Methods。`scrollTop + scroll` 是 BackTop 与局部唯一滚动区形成受控闭环所需的最小 PoemUI 扩展；2026-07-27 按真实独立页裁切反馈增加唯一纵向安全区 `contentPaddingBottom`，默认 `10vh`，不扩张为四向 padding。仍拒绝 border、横向、阈值、滚动动画、disabled 和实例方法等第二套平台 API。
- 基础 WXML 固定为 `<pui-scroll-area><pui-cell .../></pui-scroll-area>`，不输出 `bind:*` 或默认 Props。原生端固定 `scroll-y/enhanced/show-scrollbar=false`，受控 `scrollTop` 直接驱动唯一视口，非空 `scrollIntoView` 继续投影目标 id；H5 同步真实数值位置与 Slot anchor 优先级，不保留“顶部/底部”按钮、状态文字或 CSS 伪动画。
- 真实浏览器先复现旧错误：点击“底部”后 `scrollTop` 仍为 0。修复后属性页实选 `scroll-area-build`，真实滚动位置为 `124px`；390×844 的真实滚轮输入为 `0→120px`，选择 publish 后被实际最大范围钳制为 `150px`，非法高度与空目标真实回退 `160px/0px`。当前 API 为 8 Props、1 Event、1 Slot、0 Methods；新增的 `contentPaddingBottom` 默认 `10vh`，与受控数值路径一起在 H5 与微信模拟器复核。light/dark 和 border/shadow/frost/large-radius/gradient 保持透明根与两层无交互固定渐变不产生 Surface，Slot 内 PUI Cell 承接主题 Surface。
- 2026-07-21 再次联网访问 [TDesign ScrollView 页面](https://tdesign.tencent.com/miniprogram/components/scroll-view)（HTTP 200）、[官方源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/scroll-view) 与固定包 `tdesign-miniprogram@1.15.3` 的同一组 `scroll-view` 文件，结论未漂移。现场发现 PoemUI 把 `height="0"` 归一化为 `1rpx`，H5 同步成 `1px`，违背公开“正数”合同；现两端统一回退 `320rpx/160px`，并删除未使用、会误导透明根合同的旧 `.scroll-area-demo` Surface 样式。
- 2026-07-26 针对 BackTop 受控回顶缺少位移动画再次读取官方当前 WXML：TDesign 仍固定 `scroll-y/enhanced/show-scrollbar=false` 并只传 `scrollIntoView`。PoemUI 按最新产品反馈在唯一原生视口内部固定开启 `scroll-with-animation=true`，H5 以原生 `scrollTo smooth/auto` 镜像；这是内部默认体验，不复制为 `scrollWithAnimation/duration/easing/reduceMotion` 公共 Props，也不改变 7 Props / 1 Event / 1 Slot / 0 Methods 的收敛边界。Ledger：`PUI-FB-0382`。
- 新增 `SCROLL-AREA.md`、`test-scroll-area.js` 和 Ledger `PUI-FB-0188/0189`。`feedback:generate/check`、`site:build`、完整 `check`、`pack:check`、`example:install` 通过，源码、`miniprogram_dist` 和示例安装的 JS/JSON/WXML/WXSS SHA256 完全一致。微信 CLI 已启动 IDE server，但示例 `touristappid` 在权限阶段返回 code 10，未生成也未手工伪造 `miniprogram_npm`；合法 AppID 真机仍需验收 enhanced scroll-view、rpx、动态 Slot/id、样式隔离、读屏、触摸惯性和系统低动效。
