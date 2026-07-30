# PullRefresh 组件语义合同

任何 Agent 修改 PullRefresh 前，必须完整阅读本文，并查询：

`npm run feedback:list -- --component pull-refresh`

## 1. 组件定位

`pui-pull-refresh` 是承载局部滚动内容的下拉刷新容器。它负责顶部拖拽、滚动门禁、刷新请求与超时收口；网络请求、数据替换与业务成功由消费者处理。

## 2. 固定结构与区域

- 根节点必须是可纵向滚动的原生 `scroll-view`，不得依赖页面外部 `scrollTop` 才能工作。
- 根内顺序固定为 `header` 具名 Slot、可收放的刷新提示轨道、默认 Slot 内容。
- 提示轨道仅在下拉/刷新/完成期间占据高度；内容只做一次 `translateY`，不得以双重位移制造假下拉。

## 3. PUI 组合与依赖

- loading 状态必须复用 `pui-loading`，并透传 `loadingProps` 中真实可支持的外观字段。
- 普通提示使用文本；不得在组件内部额外拼装业务 Button、Result、Empty 或假成功状态。

## 4. Token、间距与排版

- 提示文字、轨道高度、位移和回弹使用 PUI Token；正常回弹不超过 1000ms，低动效为 1ms。
- 仅轨道与内容使用 transform/height；禁止 transition `height:auto` 或 `display:none` 造成瞬移。

## 5. 内容、Slot 与组合边界

- 默认 Slot 是实际可滚动业务内容；`header` Slot 位于内容之前。
- 不提供 `indicator` Slot、业务操作 Slot 或通用状态 Slot；消费者若要控制结果，应更新数据或离开该容器组合反馈组件。

## 6. 状态与优先级

- `value` 非 `null` 时受控，`defaultValue` 只初始化非受控状态；两者表示刷新轨道是否展开。
- 手势仅在内部滚动位置为顶部、单指、纵向向下且 `disabled=false` 时开始。
- 下拉不足阈值回弹；达到阈值后按 `change(true) → refresh` 请求刷新。消费者把 `value` 回写为 `false` 或非受控超时后，显示完成提示并收起。
- `refreshTimeout` 触发 `timeout` 和收起请求，不得把它描述为请求成功。

## 7. 交互、受控边界与事件

- 公开事件仅为 `change`、`dragstart`、`dragging`、`dragend`、`refresh`、`scrolltolower`、`timeout`，与 TDesign PullDownRefresh 主干一致。
- 不公开 `finish/reset/refresh` 实例方法、`input`、`pull-*`、`ready` 或业务成功/失败事件；调用方以 Props 回写完成刷新。
- `disabled` 只禁止用户拖拽，不应使内部滚动或 Slot 内容失效。

## 8. 可访问性

- 根滚动区域必须有 `aria-label` 与 `aria-disabled`；提示轨道使用 `role=status`、`aria-live=polite`。
- 完成、超时和刷新文字必须来自 `loadingTexts`，不使用视觉图标作为唯一状态信息。

## 9. H5 预览与跨端一致性

- H5 必须使用可滚动容器与真实 Pointer/Touch Events 镜像下拉，验证滚动顶部、横向手势、pointercancel、disabled、value/defaultValue、timeout 与低动效；非顶部或非向下的触摸必须保留给局部原生滚动。
- `scrollIntoView` 在小程序填写默认 Slot 内真实 id；H5 演示提供 `pull-refresh-record-01` 至 `pull-refresh-record-07` 作为可验证的局部定位锚点，不另造平台专属 Props。
- H5 只在 PreviewDevice 内近似 `scroll-view`；不得把浏览器滚动、Promise 或定时成功写入小程序合同。

## 10. 响应式、主题与视觉配置

- 标准预览使用 `shadow-safe`，不额外建立卡片套卡片；390px 下内容、轨道与 Slot 不得撑出 PreviewDevice。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变由 PreviewDevice 与真实 Surface Token 控制，不改变拖拽几何。

## 11. 明确禁止

- 禁止用外部 `scrollTop` Prop 替代真实内部滚动容器。
- 禁止 `finish(true/false)`、自动网络成功、Retry Button、Loading/Empty/Result 状态壳和事件日志冒充组件能力。
- 禁止将 header/默认 Slot 改成诊断卡、原生私有 Button 或静态占位。

## 12. 修改闭环

- 修改前后同步 JS/JSON/WXML/WXSS、metadata、H5、基础 WXML、API、示例、安装产物、专项测试与 Feedback Ledger。
- 必须实测手势、受控/非受控、timeout、390px、主题、视觉开关、正常/低动效；微信真机滚动惯性、下拉命中、rpx 与读屏保留合法 AppID 风险。
- 联网对照固定为 [TDesign Miniprogram PullDownRefresh 文档](https://tdesign.tencent.com/miniprogram/components/pull-down-refresh)、[TDesign 源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/pull-down-refresh) 与 `tdesign-miniprogram@1.15.3` 包内 `miniprogram_dist/pull-down-refresh`；参考其公开合同，不复制其实现细节。

## 13. 0.1.4 主题与 Surface 修复

- 空 `colorScheme` 必须继承最近的 ConfigProvider，不得生成 `pui-theme--light`；显式 `light/dark` 仍可局部覆盖。
- PullRefresh 根、内部滚动区和内容轨都是滚动/布局基础设施，必须透明、无边框、无阴影、无毛玻璃；业务 Surface 由默认 Slot 消费者提供。
- H5 也必须保持同一资格，不能因全局 border/shadow/frost 开关把刷新容器画成第二张面板。
