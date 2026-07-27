# Bubble 组件语义合同

本文是 PoemUI Bubble 的长期设计与实现合同。修改前必须查询 `npm run feedback:list -- --component bubble`；完整 Props、事件和方法以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- Bubble 是单条消息的表面层，不是会话、发送或 AI 传输容器。
- 头像、发送者、时间、已读、存储、网络发送、AI 传输和滚动由 Message/业务层组合。

## 2. 固定结构与区域

- 根按 start/end 对齐；shell 承载消息 Surface 与可选 reactions，groupPosition 只调整连续消息圆角。
- 不新增 Card、列表壳或会话阴影伪造层级。

## 3. PUI 组合与依赖

- Reaction 与展开操作必须复用 PUI Button；正文 Surface 是允许的组件自身交互根。
- H5 自身交互根可使用平台按钮，但不得绕过 Button 镜像重写 reactions/toggle。

## 4. Token、间距与排版

- 消息内距、正文行高、回应 gap 和连续圆角使用现有 space/font/radius Token。
- Bubble 是消息 Surface；不得额外增加 Card、外阴影或页面私有 margin。

## 5. 内容、Slot 与组合边界

- `content` 优先于 `text`；两者为空且没有 customContent 时不挂载空白气泡。
- 默认内容、默认 reactions、内容 Slot 与 reactions Slot 均保留消费者组合职责，父级不得覆盖子 Button 几何。

## 6. 状态与优先级

- 共有 default/secondary/muted/tinted/outline/ghost/destructive；浅深色和 active reaction 必须保持足够对比。
- `visible` 进退场保留节点直到结束；默认500ms、上限1000ms、reduceMotion为1ms。

## 7. 交互、受控边界与事件

- Reaction 保留 `0`、`false` 等原始 value，只回传事件，不修改计数、active 或会话数据。
- `expanded` 为 Boolean 时受控：请求只发布 `input → change → expand/collapse`，等待父级回写；非受控仅用 `defaultExpanded` 初始化。
- 折叠通过实测高度和像素 `max-height` 动画，不能对 `height:auto` 过渡。

## 8. 可访问性

- 正文 Surface、回应与展开按钮均需可访问名称；disabled 同时阻断正文、回应和展开。
- 低动效仍完成 show/hide 与 after-show/after-hide，长文可换行但不造成页面横向滚动。

## 9. H5 预览与跨端一致性

- H5 镜像七种 variant、受控展开、回应、click/longpress 与显隐生命周期；动效走公共 `previewMotionDuration`，不得引用别的组件私有 helper。
- Overview 使用 `shadow-safe`，只保留消息组合、正文、回应与展开结果；工程方法、事件/阶段诊断在进入实时 DOM 前移出。

## 10. 响应式、主题与视觉配置

- 390px、深浅色、边框、阴影、毛玻璃和大圆角下长文、回应和内部 Button 不得页面级溢出。
- ConfigProvider 仅影响视觉 Token，不改变消息、回应或展开值。

## 11. 明确禁止

- 禁止把 Bubble 扩展为会话壳、伪造发送/已读/AI 成功、以 `display:none` 造成显隐或折叠瞬移。
- 禁止让 H5 依赖 Badge 等其他组件的私有预览 helper，或在概览显示工程诊断。

## 12. 修改闭环

1. 同步审计 JS/JSON/WXML/WXSS、H5、API、示例、metadata 与 `miniprogram_dist`。
2. 运行 `node scripts/test-bubble.js`、`npm run feedback:generate`、`npm run feedback:check`、构建门禁，并实测 390px/主题/外观。
3. 更新 Feedback Ledger；合法 AppID 真机仍须验证长按、selector query测量、rpx、Slot、读屏和系统低动效。
