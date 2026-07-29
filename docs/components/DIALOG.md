# Dialog 组件语义合同

本文是 PoemUI Dialog 的长期设计与实现合同。任何 Agent 修改 `dialog/`、Popup 依赖、H5、示例、元数据或 Token 前，必须查询：

`npm run feedback:list -- --component dialog`

完整 API 以 `docs/COMPONENT_API.md` 为准；本文固定不可漂移的产品与实现边界。

## 1. 组件定位与公开边界

- Dialog 是父级 `visible` 控制的中心模态，用于确认、选择或承载关键内容；Popup 是唯一遮罩、滚动保护、层级与进退场承载者。
- Dialog 公开 17 个 Props、5 个 Events、8 个具名 Slots 和唯一 `close()` 方法；完整名称以 API 表为准，不能由旧版宽泛 API 推断。
- Dialog 不维护第二套显隐状态或动画定时器。它没有 defaultVisible、input/change/open/after-open/after-close/retry、loading/empty/error 或私有动效 Props。
- 业务请求状态必须在 content Slot 中组合 PUI Loading、Empty、Button；`visible=false` 后父级必须真实回写，组件只请求 close。

## 2. 固定结构与区域

```text
Popup Layer
└── Dialog Surface
    ├── top Slot
    ├── Header：空左轨 / title / Close
    ├── Content：content 文本与 content Slot
    ├── middle Slot
    └── Footer：actions / cancel-btn / confirm-btn（仅有真实动作时挂载）
```

- Header 是 `72rpx | minmax(0,1fr) | 72rpx` 三列 Grid（H5 36px）；空左轨保留，标题几何居中。
- Surface 只有一个；Header/Content/Footer 不得各套卡片。Surface 自然增高到视口上限，Header/Footer 固定，只有 Content 内滚动。

## 3. PUI 组合与依赖

- Close 必须复用 PUI Button + PUI Icon，circle/small，默认名称“关闭对话框”；禁止绝对定位或字符图标。
- 内建 cancel/confirm 与 actions 均使用真实 PUI Button；复杂内容优先组合 Cell、Badge、Loading、Empty、Button、Form 等现有组件。
- Popup 负责 Overlay、zIndex、preventScrollThrough、usingCustomNavbar、reduceMotion 与进退场；Dialog 不重写第二个遮罩或动画。

## 4. Token、间距与排版

- Dialog 复用 Popup Surface 但清除 Popup Content 的重复 padding；Header、Content 与 Footer 直接使用 Dialog 的 `--pui-dialog-action-spacing`（28rpx/14px），Footer 左右、底部和按钮间距相等，Content 组合使用 `--pui-dialog-content-gap`（16rpx/8px）。
- Close 尺寸为 `--pui-dialog-close-size`（72rpx/36px）；主题、边框、阴影、毛玻璃和语义圆角均消费全局 Token，circle 在大圆角下保持满圆。

## 5. 内容、Slot 与组合边界

- 全部具名 Slots 是 top/header-left/title/content/middle/actions/cancel-btn/confirm-btn；无 default Slot。`header-left` 最多承载一个声明 `icon-only` 的紧凑圆形 PUI 图标按钮，禁止普通文本按钮撑开平衡轨道。
- content 文本与 content Slot 可并列，调用方避免重复；actions 非空时取代内建 cancel/confirm。空 Footer 不占高度、不产生幽灵分区。
- Slot 只能组合内容，不能覆盖 Header 三列、Content 滚动边界、Footer 动作区或 Popup 的遮罩层级。

## 6. 状态与优先级

- Dialog 不拥有 loading/error/empty/retry；业务状态由 content Slot 组合，禁止伪装成 Dialog Props。
- Button 的 loading/disabled 只阻断自身事件，不自动关闭、不假报成功。Confirm/Action 默认保持 Dialog 开启。
- 隐藏时遮罩和面板保留到 Popup 离场结束，再卸载；不能 display:none 造成瞬移。

## 7. 交互、受控边界与事件

- Cancel 固定按 `cancel → close({ trigger: 'cancel' })` 触发；Confirm 仅 confirm；Action 仅 action({index})；`close()` 发 close({trigger:'programmatic'})，已关闭返回 false。
- Overlay 固定先 overlay-click；仅 closeOnOverlayClick=true 才接 close({trigger:'overlay'})。所有 close 都等待父级 visible 回写。
- Popup 动效默认 500ms、最大 1000ms、reduceMotion/系统低动效为 1ms；不得 height:auto transition。
- Dialog 与 Popup 的 WXSS 不得以 `*` 穿透 actions 或任一 Slot；子组件各自接收自己的低动效配置。

## 8. 可访问性

- Dialog/Overlay 焦点、Escape、关闭和焦点恢复由 Popup 真实管理；Close 和所有动作具备可访问名称、禁用与 loading 语义。
- Content 超出时只在 Content 内滚动，Header/Footer 始终可读且可操作；不能用不可见 blocker 或状态 toast 掩盖关闭路径。

## 9. H5 预览与跨端一致性

- Overview 分“基础用法 / 按钮与布局 / 具名插槽 / 遮罩与关闭”；基础 WXML 零 bind:*，完整事件进入 API/专项示例。
- 所有入口使用 PUI Button；遮罩覆盖整个 PreviewDevice viewport，隐藏时没有黑幕或持续增长舞台。
- 使用 `edge-to-edge` PreviewDevice 父布局：内容触发区按安全内距排布，浮层舞台 inset:0 覆盖完整 viewport，不能用缩小遮罩换取留白。
- bindPreviewRuntime 必须挂载 Dialog 状态机；开闭、Escape、Overlay 与定时只更新同一 Layer/Scrim/Surface，禁止中途 renderStage 重建。

## 10. 响应式、主题与视觉配置

- 390px 下触发入口、Surface、Content、Footer、代码与 API 表格可操作且无页面横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变按全局 Token 作用；渐变只作用于页面/PreviewDevice 背景，不能成为 Dialog 第二 Surface。
- `equalSpacing` 只在 Dialog Surface 根重映射 action、section 和 content gap 到 `--pui-surface-inset`；Header 三列、Close 尺寸、Content 唯一滚动区和 Slot 内部微间距保持不变。

## 11. 明确禁止

- 不得恢复旧版 40 Props、defaultVisible、原生滚动/动画参数或 Dialog 自有请求状态；`header-left` 不得扩张为任意内容区。
- 不得用第二遮罩、绝对定位 Close、display:none、height:auto transition、静态成功提示或整 Stage 重绘掩盖真实显隐。
- 不得把页面请求状态、历史兼容 Slot、预览诊断字段伪装为 Dialog 公开能力。

## 12. 修改闭环

1. 审计 dialog 四件套、Popup 依赖、npm 入口、metadata、H5、示例、API、dist 与安装产物。
2. 更新 `scripts/test-dialog.js`，覆盖 Props/Events/Slots/close、0/false/空字符串、事件顺序、Popup 转发与无伪状态；运行 Ledger generate/check、site build、check、pack check 和示例安装。
3. 浏览器验证基础、actions、Slots、遮罩、Props 回写、500ms 中间帧/完成态、低动效、390px、主题与外观；真机确认平台焦点、滚动保护、rpx 和样式隔离。

## 13. 2026-07-27 Popup 同源结构

Dialog Header 与 Popup 使用同源的三轨、112rpx 最小高度和分区 padding；Footer 按真实动作数为一列或两列全宽 Grid。遮罩透过 Popup/Overlay 合并全局毛玻璃语义。实现位于 `dialog/dialog.{js,wxml,wxss}`、`popup/popup.wxss`、`preview/*`，见 `PUI-FB-0433`。
