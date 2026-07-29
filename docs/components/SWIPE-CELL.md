# SwipeCell 语义合同

开始本组件工作前先运行：`npm run feedback:list -- --component swipe-cell`，并阅读命中的原始 Ledger。

## 1. 组件定位

SwipeCell 是列表项的横向操作容器：用户拖动前景内容后查看左右两侧操作。它不拥有列表文案、加载、空态、错误态、重试或业务完成状态；这些均由 default、left、right Slot 的调用方组合。

联网参考：2026-07-20 访问 [TDesign SwipeCell 文档](https://tdesign.tencent.com/miniprogram/components/swipe-cell)、[官方源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/swipe-cell) 和 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/swipe-cell/{props.js,type.d.ts,swipe-cell.js,swipe-cell.wxml,swipe-cell.wxs}`。

## 2. 固定结构与区域

根节点只建立相对定位和裁切边界。左、右操作层绝对定位在前景内容下方；前景内容是唯一随手势做 `translate3d` 的节点。不可新增第二层 Card、内部 Cell、状态面板或方法按钮。

## 3. PUI 组合与依赖

数组 `left/right` 操作必须由内部 `pui-button` 渲染。default Slot 的基础示例使用 `pui-cell`，但 Cell 是消费者内容，不是 SwipeCell 的根 API。left/right Slot 内的内容由消费者使用 PoemUI 组件组合，组件不替其绑定或伪造事件。

## 4. Token、间距与排版

操作项默认宽度为内部 136rpx；数组项 `style` 中明确的 `width`（`rpx` 或 `px`）会参与实际动作宽度和展开阈值，对外仍不公开组件级 `actionWidth`。动作层高度跟随前景内容；前景只使用页面背景并让 Slot 内容承担自身 Surface。颜色、字体、圆角、阴影和毛玻璃均来自嵌入的 PUI 组件及全局 Token，不得为 SwipeCell 另建主题。

默认 Slot 的全宽布局由明确的 `pui-swipe-cell__content-inner` 容器承担；WXSS 禁止 `> *` 或任何通配选择器穿透调用方内容。

## 5. 内容、Slot 与组合边界

公开且仅公开 default、left、right 三个 Slot。数组动作与同侧 Slot 并列投影。`left/right` 的数组项对齐 TDesign 的 `text/icon/className/style/onClick` 数据形状；`onClick` 是消费者自己的数据字段，不替代公开事件。

## 6. 状态与优先级

`disabled=true` 阻断拖动和数组操作，但不删除 Slot 内容。没有动作时保持真实不可滑状态。`opened=true` 优先右侧，否则左侧；`opened=[left,right]` 分别控制两侧且右侧优先。手势或轻点引起的展开、收起只改变组件自身视觉状态，不发布不存在的 `input/change/open/close`。

## 7. 交互、受控边界与事件

触摸开始会收起同页其他 SwipeCell。横纵方向在 10px 阈值后确定；仅横向拖动会发布 `dragstart`，释放或取消发布 `dragend`。位移超过对应操作区宽度 30% 才打开；未达阈值收起。数组操作先发布 `click({ action, source })`，再收起；不将 click 视为业务成功。轻点前景内容只收起，不额外发布 click。

## 8. 可访问性

根节点是 `role=group`，使用 `ariaLabel`、`aria-expanded` 与 `aria-disabled` 表达状态。数组动作使用 PUI Button 并提供操作文字的辅助名称。Slot 内容由调用方提供其自身的语义与可访问名称。

## 9. H5 预览与跨端一致性

H5 Pointer Events 镜像小程序 touch 方向判定、30% 阈值、数组操作收起和三个事件。H5 的 `pui:swipe-cell-click`、`pui:swipe-cell-dragstart`、`pui:swipe-cell-dragend` 是浏览器镜像事件，分别承载公开 `click/dragstart/dragend`；不把 H5 特有事件写进小程序 API。

## 10. 响应式、主题与视觉配置

组件在 PreviewDevice 的 shadow-safe 区域展示；390px 下操作层被前景裁切且不能推动页面横向滚动。深浅色、边框、阴影、毛玻璃、大圆角和渐变只改变真实 PUI Surface 的视觉 Token，不改变动作宽度、手势阈值、展开方向或事件顺序。

## 11. 明确禁止

- 禁止恢复 title、description、Cell、Loading、错误或重试等根级内容 API。
- 禁止恢复 actionWidth、threshold、velocityThreshold、duration、easing 等私有手势调参。
- 禁止恢复 input、change、open、close、action 或公开 `open/close/toggle` 方法。
- 禁止用状态文案、方法按钮或静态位移冒充滑动、事件或业务成功。
- 禁止对 `height:auto` 过渡或用 `display:none` 制造展开/收起瞬移。

## 12. 修改闭环

修改 SwipeCell 时必须同步核对 JS/JSON/WXML/WXSS、metadata、H5 showcase 与 Pointer runtime、Props/WXML/API、示例、`miniprogram_dist`、专项合同测试、Feedback Ledger 和本合同。必须在真实浏览器验证左右拖动、30% 阈值、disabled、opened Boolean/数组、轻点收起、数组 click、dragstart/dragend、180ms/1ms、390px、主题与视觉开关；最终运行 site build、check、pack、示例安装与微信 build-npm，并记录合法 AppID 真机风险。

## 13. 2026-07-27 果味动作底板

SwipeCell 外壳承担圆角和裁切；动作 wrapper 在静止关闭时必须透明、无边框和阴影，只在 dragging/opened 后按 `default/primary/success/warning/danger` 着色，内部 PUI Button 必须 `surface="transparent"`。这样果味/毛玻璃不会提前透出底层颜色。

## 14. 2026-07-29 双侧动作层互斥

左右动作同时存在时，可见性必须由实时位移方向决定：`offset > 0` 只显示并允许点击 left，`offset < 0` 只显示并允许点击 right，`offset = 0` 两侧都隐藏。拖动跨过零点时立即切换可见侧；不得用根级 `dragging/opened` 同时激活两侧，否则相反方向的语义色、边框或圆角会从半透明前景与容器边缘露出。该规则只约束内部展示态，不新增 Prop、Event 或 Method。

小程序事实源为 `swipe-cell/swipe-cell.js` 的 `actionPosition`、WXML 的同侧 visible class 与 WXSS 的 `pointer-events` 门控。H5 后续统一同步时，`preview/app.js` 的 Pointer runtime 和 `preview/styles.css` 也必须按实时 translate 方向互斥显示两侧，并验证跨零拖动、深浅色、果味和 390px 无反向底板泄漏。

本轮于 2026-07-29 重新联网核对 TDesign 官方页面、develop 仓库目录及固定 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/swipe-cell/{props.js,type.d.ts,swipe-cell.js,swipe-cell.wxml,swipe-cell.wxs,swipe-cell.wxss}`。TDesign 固定包把左右动作放在 wrapper 两侧并随同一 wrapper 位移，使相反侧留在裁切区外；PoemUI 保留现有“动作层位于前景下方”的结构，但以方向互斥达到相同的单侧可见结果，不照搬其私有 WXS。
