# Sheet 组件语义合同

本文是 PoemUI Sheet 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component sheet`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

`pui-sheet` 是组合 `pui-popup` 的底部操作面板。它负责底部进退场、标题区、正文局部滚动、可选 Footer、下拉关闭和 `error > loading > empty > content` 的正文状态；提交、保存、请求成功和关闭后的业务去向必须由消费者决定。

- 它适合承载一组连续的表单、Cell 或操作；短暂消息使用 Toast，二次确认使用 Dialog。
- Popup 只负责通用浮层，Sheet 不把自身 Header、Footer、拖拽和正文状态倒灌给 Popup。

## 2. 固定结构与区域

- 已显示时由底层 Popup layer、可选 Overlay、Sheet Surface、Header、Body 和可选 Footer 组成；Sheet 始终从底边进入和离开。
- Header 包含绝对定位的可选拖拽柄，以及 `header` Slot 或默认标题行；拖拽柄不参与标题行的文档流。标题行使用标题区 + 固定 `72rpx` Header end 轨，关闭 Button 必须贴该轨右端。
- Body 是唯一可滚动/切换状态的区域；Footer 不收缩，固定在 Body 之后，只有 `showFooter || customFooter` 时存在。Header、Body、Footer 都是占满 Surface 宽度的直接分区。
- `error > loading > empty > content` 是唯一状态优先级。状态转换不得把 Footer、Header 或整个 Sheet 替换掉。

## 3. PUI 组合与依赖

- 必须组合 `pui-popup`、`pui-button`、`pui-loading`、`pui-empty`；默认关闭和 retry 均由真实 PUI Button 承担。默认关闭固定为 `theme=default`、`variant=base`、`shape=circle`、`size=small`、`icon=close`、`iconOnly=true`，不得退化为裸 `×` 或 `text` Button。
- 默认正文和示例应组合 Cell、Tag、Button 等已有 PUI 组件；H5 必须调用 `buttonSample`、`cellSample`、`emptySample`、`loadingComponent` 镜像这些能力。
- 拖拽柄、遮罩、Sheet Surface 和滚动容器属于组件自身平台根，允许使用原生 `view/scroll-view` 或浏览器事件桥接；不得为此再嵌套普通 PUI Button。

## 4. Token、间距与排版

- Sheet 是 Popup-backed Surface：Popup 的默认 Content 只作为零内距、纵向 flex 的承载层，禁止再叠加 `--pui-popup-panel-padding`，也不得遗漏 `flex-direction:column` 使 Header、Body、Footer 落入同一横向轨道；Sheet Header、Body、Footer 各自消费一次自己的 Surface inset，三段之间不增加第二层卡片。
- Sheet Header 的外侧顶、左、右 inset 固定别名为 `--pui-sheet-header-inset: var(--pui-surface-inset)`，与 Popup Header 的 `--pui-popup-panel-padding` 同源；默认标题行直接消费该 inset。拖拽柄以居中的绝对定位触摸区浮在顶边，不占用 Header 文档流，也不得改变标题或关闭 Button 的 Popup 对齐线。
- Header/Content/Footer 的主要分区距离遵从 `--pui-section-gap` 的语义；Footer 有满宽 action track，单一主要 PUI Button 必须由该轨拉伸到可用宽度，正文滚动不应吞掉 Footer。
- 拖拽柄是独立交互提示，默认 `showHandle=true`；它必须使用 `--pui-text-placeholder`（H5 为 `--subtle`），不得使用会被全局 `bordered=false` 透明化的边界 Token。
- 正常动效默认 500ms，范围 0–1000ms；`reduceMotion` 为 1ms。禁止对 `height:auto` 或 `display` 做 transition。
- WXSS 低动效仅通过 Sheet 自己的时长 Token 生效，禁止以 `*` 穿透 Header、Body、Footer 或消费者 Slot。

## 5. 内容、Slot 与组合边界

- `header` Slot 在 `customHeader=true` 时接管默认标题行；默认 Slot 是正文；`footer` Slot 是主要动作区。
- `content` 仅作为未提供默认 Slot 时的文字回退。消费者可在默认 Slot 组合 Form、Cell、Tag 和 Button，Sheet 不得重写它们的尺寸、padding、圆角或业务事件。
- Footer 只组织消费者动作，不自动关闭，也不把“继续/稍后”伪造成业务成功；组件只提供满宽轨，不穿透覆盖 Footer Slot 内部 Button、Form 或其他消费者节点。

## 6. 状态与优先级

- `visible` 为 `null/undefined` 时使用 `defaultVisible` 和 `open()/close()` 的非受控状态；`true/false` 时只发请求，由父级回写。
- 关闭后保留 Popup/Sheet 节点直到退场完成；disabled 阻止关闭按钮、遮罩、拖拽和 retry，不阻止实例 `open()/close()`。
- 错误态的 PUI Empty 与 Retry Button 是 Body 内兄弟节点；retry 只通知消费者，不自动清除 error 或伪造加载成功。

## 7. 交互、受控边界与事件

- 显隐请求顺序为 `input → change → open/close`，随后在实际动画完成后发送 `after-open/after-close`；触发来源必须保留 `programmatic / close / overlay / drag`。
- 遮罩点击先通知 `overlay-click`，只有 `closeOnOverlayClick && !disabled` 时才请求关闭。
- 从拖拽柄向下拖动持续发 `dragging`，结束时依据距离或速度发 `drag-end` 并决定是否请求关闭；正文实际滚动才发 `scroll`。

## 8. 可访问性

- Surface 使用 `role=dialog`，有遮罩时为 `aria-modal=true`，名称优先 `ariaLabel`、其次 title。
- 关闭、retry 和拖拽柄均有可访问名称；关闭/禁用不应让不可操作的控件获得焦点。
- H5 可以增强 Pointer 和键盘，但不能声称已替代微信读屏、触摸穿透或安全区的真机验证。

## 9. H5 预览与跨端一致性

- 标准预览使用 `edge-to-edge`：底层的“打开底部面板”PUI Button 始终存在，打开后只在其上叠加透明、绝对定位的完整 viewport layer。Overlay 覆盖整个 PreviewDevice，Sheet 从底边升起；不得用打开态的独立 Host 背景或整段替换预览清空入口上下文。
- H5 使用同一已挂载 Host/Surface 承担进入、离开和拖拽；离场完成后才卸载 layer。Body 是局部滚动区，Footer 必须保持在 Surface 底部。
- H5 的 Pointer Events/局部 overflow 是原生 touch/scroll-view 的近似；`minHeight/height/maxHeight/dragThreshold` 按 `1px≈2rpx` 映射，不伪造微信平台能力。

## 10. 响应式、主题与视觉配置

- 390px 下入口、遮罩、Sheet、正文状态和 Footer 均不得造成页面级横向溢出；内容只能在 Body 内滚动。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变通过既有视觉 Token 作用于真实 Sheet Surface；透明 Host/Stage 不建立第二层背景、边框或阴影。
- 外观切换不得改变 Sheet 的底部贴边定位、Footer 固定关系或可用点击区域。

## 11. 明确禁止

- 禁止打开时替换掉触发入口或把 PreviewDevice 清空为一块局部底板。
- 禁止把 Host/Canvas 当作可见卡片；只有遮罩和 Sheet Surface 可以不透明。
- 禁止把 Footer 放进可滚动 Body、用 `display:none` 跳过退场、或以事件提示文字代替真实显隐、拖拽、重试和滚动。
- 禁止将消费者请求状态或 Footer 动作伪装成 Sheet 自动保存/成功。

## 12. 修改闭环

1. 同步审计 `sheet` JS/JSON/WXML/WXSS、Popup 依赖、`index.js`、metadata、H5、API、兼容说明、示例与 `miniprogram_dist`。
2. 更新 `scripts/test-sheet.js`、本合同、进度记录和 Feedback Ledger，运行 `feedback:generate/check`、`site:build`、`check`、`pack:check`。
3. 浏览器实际验证默认/disabled、受控与非受控、0/false/空字符串边界、遮罩/关闭/retry/拖拽/正文滚动、动效中间帧与低动效、390px、深浅色和外观开关。合法 AppID 真机仍需验证遮罩合成、触摸、rpx、安全区、Slot、样式隔离和读屏。

本轮在线对照记录为 2026-07-22 的 [TDesign Popup 文档](https://tdesign.tencent.com/miniprogram/components/popup) 和 [TDesign Popup 源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/popup)，同时依据现有 `tdesign-miniprogram@1.15.3` 包内 Popup 文件核对基础浮层的 `visible/defaultVisible`、遮罩、placement 和 `visible-change` 边界。TDesign 没有独立 Sheet；PoemUI Sheet 的 Header/Body/Footer、下拉和状态合同是基于本仓库真实源码的上层组合，不照搬 Popup API。

## 13. 等距与阴影资格

Sheet 复用 Popup 的独立 Surface 资格；`equalSpacing` 只调整 Header、Body、Footer 的直接分区，拖拽柄、状态组件和消费者 Slot 内部间距保持不变。外投影只属于 Sheet Surface 根，并固定使用 `--pui-shadow-edge-bottom`，因为 Sheet 贴住底部。
