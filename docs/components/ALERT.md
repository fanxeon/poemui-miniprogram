# Alert 组件语义合同

本文是 PoemUI Alert 的长期设计与实现合同。修改前必须查询 `npm run feedback:list -- --component alert`；完整 Props、事件和方法以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- Alert 是页面内的短提示块，不是 Toast、Dialog 或业务状态机。
- 它呈现消费者状态；关闭、重试或网络完成不能被组件伪装成业务成功。

## 2. 固定结构与区域

- 根节点包含主内容区（Icon、标题/说明、默认 Slot）与可选关闭操作。
- Alert 没有 Header/Footer/Card 第二层 Surface；`verticalAlign` 只处理 Icon、正文与关闭操作的行内纵向对齐；兼容属性 `center` 同时开启纵向居中和正文居中。

## 3. PUI 组合与依赖

- Icon 使用 PUI Icon，关闭操作使用 PUI Button + Icon。
- H5 关闭按钮复用 `iconButtonSample`；不能手写相似原生图标按钮。

## 4. Token、间距与排版

- 容器使用已有 space、字体、边界和语义圆角 Token；左内距使用 `large`，Icon 与正文固定使用 `normal` 内容组合间距，主内容与关闭操作保持紧凑的 `small` 间距。
- `variant=soft` 使用轻量主题背景和既有中性文字；`variant=tinted` 保留相同的轻量主题背景，但标题/Icon 使用该 theme 的深色前景，说明/关闭入口使用同色系辅助前景；两者都必须消费共享 Token，不能写页面私有颜色。小程序内置 Icon 使用本地 Icon Font `currentColor`，Alert 直接传入同名 `--pui-alert-*-tinted-fg` Token，不再复制一份 JS 实体色表。
- Alert 是单一提示 Surface；阴影只由组件显式语义决定，不能为突出提示额外套卡。

## 5. 内容、Slot 与组合边界

- 默认 Slot 进入正文区域；父级只管理 Slot 内容，不得穿透覆盖 Alert 的内距、Icon 或关闭按钮几何。

## 6. 状态与优先级

- 主题只接受 default/info/success/warning/danger，Icon 为空时按主题选择默认图标。
- `variant` 只接受 `soft/tinted`，非法值回退 `soft`；`verticalAlign` 只接受 `top/center`，非法值回退 `top`。
- `showIcon=false` 不影响标题、说明、Slot 或关闭操作；隐藏态保留真实重新打开入口。

## 7. 交互、受控边界与事件

- `visible` 为 Boolean 时完全受控：close 发出 `input → change → close` 请求，父级回写后才隐藏；非受控只以 `defaultVisible` 初始化。
- H5 预览可以作为父级真实写回 Props，但不得用第二份 demo visibility 覆盖受控值。
- 退场保留同一节点，默认500ms、上限1000ms、reduceMotion为1ms。

## 8. 可访问性

- 根使用 `role=alert`；关闭按钮提供“关闭提示”名称。
- 低动效仍必须完成生命周期，关键状态和按钮文字不得使用 text-cut。

## 9. H5 预览与跨端一致性

- H5 镜像 WXML 的 Icon、正文、Slot、关闭、soft/tinted、行内纵向对齐、受控显隐和连续退场；不以静态提示文字伪造事件。
- Overview 使用 `shadow-safe`，仅保留提示和必要的重新打开入口；工程元数据进入 API/属性。
- 概览不得渲染 `input/change/close/open` 日志、visible/icon/center 实现标签或 Slot 术语；首次挂载必须下一帧进入，关闭后节点保留至动效完成。

## 10. 响应式、主题与视觉配置

- 390px、深浅色、边框、阴影、毛玻璃和大圆角下标题、说明、Slot 与关闭按钮不得溢出；tinted 的标题、说明、Icon 与关闭按钮必须保持主题级可读性。
- ConfigProvider 只改变视觉 Token，不改变 visible、事件或 API。

## 11. 明确禁止

- 禁止把 Alert 改成 Toast/Dialog、用 `display:none` 或替换 Stage 终止退场、以内部 demo 状态覆盖受控 Props。
- 禁止用关闭动作伪造业务成功或重复手写 PUI Icon/Button。

## 12. 修改闭环

1. 同步审计 JS/JSON/WXML/WXSS、H5、API、示例、metadata 与 `miniprogram_dist`。
2. 运行 `node scripts/test-alert.js`、`npm run feedback:generate`、`npm run feedback:check`、构建门禁，并实测 390px/主题/外观。
3. 更新 Feedback Ledger；合法 AppID 真机仍须验证 rpx、PUI Button 事件、Slot、读屏和系统低动效。
