# Popup 组件语义合同

本文是 PoemUI Popup 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component popup`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

`pui-popup` 是从屏幕边缘或中心呈现内容的基础浮层。它负责显隐请求、遮罩、位置、滚动保护、层级、进退场和稳定的 Header / Content / Footer 几何；表单提交、请求状态、空/错误反馈及业务结果仍由调用方内容组合处理。

- Dialog、Sheet、Picker 等上层组件可以组合它，但必须保有自己的确认语义，不能把业务状态反向塞入 Popup。
- Popup 不是通知、确认框或页面容器；需要短暂提示使用 Toast，需要确认动作使用 Dialog。

## 2. 固定结构与区域

- 已挂载时结构固定为全屏 `layer`、可选 `mask`、Popup 内容 Surface，以及 Surface 顶边轨、可选 Header、Content、Footer 三段。`surface-top` 是 Surface 内第一个节点，不参与分区流。
- `layer` 覆盖完整宿主视口，只承担层级、指针边界与退场保留；Mask 色遮与 Popup Surface 分别在同一进入帧开始自己的过渡，不可把透明度放在 Layer 上压住 Blur 的合成。
- 内容 Surface 默认从 `bottom` 弹出，也支持 `top / left / right / center` 四个方向，并在进入/离开时仅转换 `opacity/transform`；退场结束后才卸载。`card=true`（默认）保留侧向 `--pui-space-step-12` 卡片安全距离；顶部 Surface 贴住视口顶部并去除顶部圆角，避免顶部留下可穿透间隙。`card=false` 只取消弹出边缘的外侧距离并保留 Content 的内部 padding，不能把贴边误做成无内容间距。
- `left/right` Surface 固定占据 `70vh` 高度与 `68vw` 宽度并垂直居中，Content 在该 Surface 内滚动；顶部且 `usingCustomNavbar=true` 时，Popup 从视口顶部覆盖 Navbar，并通过页面真实测得的 Navbar 高度加 `--pui-space-step-12` 预留有效内容起始空间，内容不会落入 Navbar 下方。
- 顶部 `card=true + usingCustomNavbar=true` 时，Popup 外层仅作为透明承载层，不绘制背景、边框、阴影或毛玻璃，并保持 `overflow:visible` 让内层 Surface 的 Token 阴影可见；内层 Surface 面板从真实 Navbar 底部加 `--pui-space-step-12` 开始，Header/Content 不再重复增加该段高度。`edge`、底部、左右和中心模式继续使用各自 Surface。
- Header 采用三列网格：左侧 `header-left` Slot、中间 `title/subtitle`、右侧常驻默认圆形关闭 Button 与可选 `close-btn` Slot。默认关闭 Button 是独立节点，不能嵌入命名 Slot 的 fallback，以免微信在 Content Slot 存在时吞掉它。`closeBtn` 默认 `true`，仅在调用方显式传入 `false` 时收起默认控件；左右轨道保留等宽空间，标题始终几何居中。
- Header 左右按钮顶部对齐，使用相同的上间距与左右轨道间距；常规左侧主要执行按钮使用 `primary/base`，右侧常驻关闭按钮使用 `default/base + circle + iconOnly` 的 muted 弱填充，直接消费 Button 的 icon-only 居中轨道，不以 `custom-style` 覆盖原生 Button 根。Picker 的 `type=default` 是受控例外：它以 `primary/base + circle + check + iconOnly` 确认操作占用左侧 `header-left`，以 `default/base + circle + close + iconOnly` 取消操作替换右侧 `close-btn`，两侧均保留固定轨道、图标居中和三列 Header 几何。标题和描述使用紧凑间距，不额外撑高 Header。Popup 不渲染拖拽手柄，也不接管拖拽关闭。
- `subtitle` 是 Header 标题区的单行辅助说明；宽度不足时使用省略号截断，不允许换行撑高 Header。描述内容需要完整读取时，应放入 Content Slot。
- `surface-top` 只承接贴合 Surface 顶边的非布局反馈，推荐组合 `pui-top-loading`。Popup Surface 必须提供 `position:relative + overflow:hidden`，让轨道从边框最上沿开始并被当前圆角裁切；不得把它放进 Content 后再用页面定位补偿。
- Content 是唯一可滚动区；Footer 仅在 `showFooter=true` 时渲染 `footer` Slot，主要动作由 Slot 内真实 PUI Button 承担。Footer 为 Slot Button 宿主提供 `flex:1 1 100%` 的满宽轨道；调用方为 Button 显式传入 `block` 后，Button 根也会写入满宽 Flex 几何，不能因微信 Slot 宿主收缩。

## 3. PUI 组合与依赖

- 默认关闭控件必须复用 `pui-button` 的圆形图标按钮合同，并有“关闭弹出层”可访问名称。
- Header 左侧动作和 Footer 主要动作由消费者组合 `pui-button`；官网镜像必须调用共享 `buttonSample`，不能在 Popup 内重新实现按钮、Icon 或 padding。
- Popup 的 Surface 使用 `--pui-panel-padding`，Header/Content/Footer 内部关联关系使用 `--pui-content-gap`；Slot 子组件保留自己的间距，Popup 只负责分区排列。
- 遮罩、Surface、内容滚动区是 Popup 的基础平台根，可使用原生 `view` / `scroll-view`；不得用原生 Button 伪造关闭操作。
- Loading、Empty、Result、Cell、Form 和业务 Button 属于消费者内容；Popup 本身不得内建或推断其业务状态。TopLoading 可由消费者投影到 `surface-top`，状态仍完全由消费者控制。

## 4. Token、间距与排版

- 内容 Surface 读取现有 PUI Surface、Border、Radius、Shadow、Frost 和排版 Token；不自定义第二套蓝灰浮层主题。
- Popup WXSS 不得导入 `common/style/theme.wxss`：该全局文件含 `page` 默认 Token，会触发微信组件 WXSS 的标签选择器编译错误。Token 由消费者 `app.wxss` 的 npm 主题入口和外层 `pui-config-provider` 继承；H5 保持同名 Token 镜像，不建立第二条主题链。
- `card=true` 时五向 Surface 均保留至少 `--pui-space-step-12` 的视口安全距离；`card=false` 时 Surface 贴合其弹出边缘，贴边的角为 0，远离边缘的角继续读取 `--pui-radius-xlarge`。`scroll-view` 只在内容自然超过最大高度时滚动。
- 动效由 `duration` 控制，默认 500ms，正常范围为 0–1000ms；`reduceMotion=true` 固定为 1ms。低动效只缩短 Popup 自己的 Mask 与 Surface；Slot 内 PUI 子组件各自遵循自己的低动效合同。`blurOverlay=true` 时 Blur 在 Layer 挂载时立即参与背景合成，不能等待色遮 opacity 完成后才出现；禁止给 `height:auto` 或 `display` 添加 transition。

## 5. 内容、Slot 与组合边界

- `default` Slot 是 Content 中的完整业务内容；`content` Slot 可以补充内容轨道；两者均由消费者负责具体组件组合和业务事件。
- `surface-top` Slot 是 Surface 顶边的唯一附着点；只接受不占布局高度的顶部反馈。推荐 `pui-top-loading`，不接受标题、操作栏、Cell 或第二个可见 Surface。
- `header-left` Slot 默认放置 Header 左侧圆形 PUI IconButton。Picker / DateTimePicker 的 `type=default` 在此放置 primary Check 图标确认 Button；`close-btn` Slot 用于替换右侧关闭控件时，调用方必须同时显式传入 `close-btn="{{false}}"` 收起默认 Button，并提供等价的可访问名称与关闭交互。Picker / DateTimePicker 的替换 Close Button 必须发布自身 `cancel`，不能冒充 Popup `visible-change`。
- `footer` Slot 是主要动作区；Popup 不接管动作结果，也不自动关闭，业务事件由 Slot 内 Button 和父级处理。Popup 不使用 WXSS 通配选择器改写 Slot 子节点；满宽、并排或比例布局由调用方的 PUI Button Props 或 Slot 内布局负责。
- `content` 字符串只在两个内容 Slot 都未由调用方提供可见内容时用作文本回退；不要把它与复杂 Slot 内容重复渲染。
- Popup 只安排内容内边距和可滚动边界，不得穿透改写 Slot 内 PUI Button、Cell、Loading、Empty 等组件的几何。
- `contentScrollable=true` 是默认值，由 Popup Content 自己承担唯一纵向滚动。调用方需要组合 PUI ScrollArea 时必须显式设为 `false`，此时 Popup Content 保留分区、内距和裁切但不再滚动，Slot 内只能保留一个同方向 ScrollArea；禁止两个滚动所有者同时启用。

## 6. 状态与优先级

- Popup 只有隐藏、进入、已进入、离开四个呈现阶段；没有 loading/error/empty/success 状态优先级。
- `visible` 非 `null/undefined` 时为受控；`defaultVisible` 仅初始化非受控状态。受控时点击关闭只发出请求，不擅自改变父级值。
- 遮罩仅在 `showOverlay=true` 时渲染；`overlayProps.backgroundColor` 仅接受安全 CSS 颜色值并覆盖默认遮罩色。`blurOverlay=true` 时遮罩真实读取 `--pui-popup-overlay-blur` 进行 backdrop blur；`showOverlay=false` 时它没有可作用的节点，也不得影响 Surface 或全局毛玻璃偏好。
- `preventScrollThrough=true` 时遮罩阻止触摸穿透；它不能阻止 Surface 内真实 `scroll-view` 滚动。

## 7. 交互、受控边界与事件

- 公开事件只有 `visible-change`，detail 固定为 `{ visible: false, trigger: 'close-btn' | 'overlay' }`；Popup 自身没有“打开”事件，因为打开由父级 `visible` 写入。
- `closeBtn` 点击和允许的遮罩点击都会先请求关闭；非受控模式先更新内部值再发布事件，受控模式等待父级回写。
- `closeOnOverlayClick=false` 时点击遮罩必须静默保留可见状态；Popup 没有 `open/close/submit/retry` 公开实例方法。

## 8. 可访问性

- Surface 使用 `role=dialog`；`showOverlay=true` 时使用 `aria-modal=true`，可访问名称优先取 `ariaLabel`。
- 关闭轨道在默认或 Slot 替换下都必须可被读屏识别。H5 增强可支持 Escape；小程序端合同只承诺触摸关闭。
- 不得用视觉关闭图标作为唯一说明，也不得将动画阶段或无关业务状态朗读给用户。

## 9. H5 预览与跨端一致性

- 标准预览必须采用 `edge-to-edge`，遮罩完整覆盖 `PreviewDevice` viewport；顶部、左侧、居中、右侧、底部五个真实 PUI Button 始终作为底层内容保留。点击后真实写入对应 `placement` 并在其上叠加同一 Popup 的遮罩与 Surface，不能通过替换 Stage 清空入口；关闭后可以重新选择位置打开。
- H5 与小程序均使用同一 Surface Top / Header / Content / Footer 结构；H5 `popupSample` 必须通过共享 `topLoadingPreviewMarkup` 镜像 `surface-top` 的节点与几何，不得在 Content 顶部画一条页面私有进度线。两端均不渲染 Popup 拖拽手柄；需要拖拽关闭、拖拽阈值和连续拖拽事件时使用 Sheet。
- 五向入口区域还必须提供一个由两项 PUI Cell 组成的配置 `CellGroup`：卡片 Switch 真实回写 `card`，毛玻璃遮罩 Switch 真实回写 `blurOverlay`。Popup 默认内容中的执行成员与关联文件也组成独立内容 `CellGroup`；两组不能合并，因为一组属于弹窗内容，另一组属于弹窗外的演示配置，不新增 Popup 公共 API；打开后仍可通过 Surface 的边缘 inset 与遮罩 `backdrop-filter` 观察实际结果。
- H5 使用同一个已挂载 Overlay 与 Surface 节点模拟进入、离开和滚动保护；进入阶段只切换 `is-active`，离开阶段先切回初始 opacity/transform，等待完整 `duration` 后才允许重建关闭入口。`top/bottom/left/right` 分别沿对应边缘位移，`center` 固定在几何中心并仅缩放/淡入，不能伪装成从底部上升。`left/right` 的 Content 必须在固定侧栏高度内 flex 滚动，Footer 始终贴住侧栏底部。禁止在阶段切换时调用整段 Stage 重建，否则 CSS transition 会因节点身份丢失而瞬移。`card` 必须真实改变五向 Surface 的视口 inset，`blurOverlay` 必须真实改变遮罩的 `backdrop-filter` 计算样式；不能只更新事件提示。H5 的低动效同样只缩短 Popup Mask 与 Surface，Slot 内 PUI 子组件沿用自身合同。
- 元素选择模式中，选择 Popup 的任一五向打开入口时，右侧上下文 Inspector 必须显示 `card / placement / showOverlay / blurOverlay` 等由父组件公开、会影响该操作结果的呈现 Props；选择遮罩时必须显示 `blurOverlay`。它们与完整属性页复用同一回写路径，不能因当前选中的是触发器或遮罩而被过滤。
- 基础示例保持最小安装调用且不写 `bind:*`；完整 `visible-change` 回写放入事件专项示例和 API。
- 浏览器不伪造微信 `catchtouchmove`、安全区或系统读屏成功；这些保留真机风险。

## 10. 响应式、主题与视觉配置

- 390px 下 Surface、关闭轨道和 Slot 内容不得造成页面级横向溢出；内容过长只能在 Popup 内容区局部滚动。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变均通过已有视觉 Token 作用于真实 Surface；关闭边框只透明化中性边线，不得改变浮层尺寸或状态边界。`blurOverlay` 是 Popup 显式遮罩效果，独立于全局毛玻璃开关，但仍必须在深浅色下使用同一中性 Token。
- Popup 本体不通过外观开关新增或移除业务控件；其几何在各外观下保持稳定。
- Popup 是等距与阴影治理的 reference Surface：默认消费 `--pui-surface-inset`、`--pui-surface-stack-gap`、`--pui-surface-section-gap`；`pui-spacing--equal` 只让 Popup 四向 inset 与 Header/Content/Footer 结构分区 gap 相等，不改变内容 Slot 内连续 Cell 行的微间距。
- Popup 的外投影必须按 `placement` 选择 `--pui-shadow-edge-top/bottom/left/right`；`center` 使用 `--pui-shadow-floating`。H5 与小程序不得继续把所有方向复用正向底部阴影。

## 11. 明确禁止

- 禁止把提交、confirm、loading、error、empty、retry、disabled 或业务成功伪装成 Popup 根级 API；`title/subtitle/showHeader/showFooter` 只描述结构，不代表业务状态。
- 禁止把 Sheet 的状态优先级、连续拖拽事件、拖拽阈值配置、拖拽手柄或底部 Footer 语义复制进 Popup；需要这些能力时使用 Sheet。
- 禁止公开 `input/change/open/close/overlay-click/after-*`、`open/close/submit/retry` 等重复显隐、诊断或业务能力。
- 禁止使用局部遮罩、静态状态文字、假事件或仅 H5 有效的私有属性冒充真实 WXML 能力。
- 禁止用 `display:none` 或直接 `wx:if` 在退场前卸载；禁止让 `preventScrollThrough` 阻断内容滚动。
- 禁止把依附 Popup 的 TopLoading 放入 Content、Header 或页面绝对定位宿主；它必须通过 `surface-top` 直接贴合 Surface 顶边。

## 12. 修改闭环

- 同步审计 `popup` 的 JS/JSON/WXML/WXSS、`metadata/components.js`、`preview/app.js`、`preview/styles.css`、`COMPONENT_API.md`、`H5_PREVIEW_COMPATIBILITY.md`、`_example`、`miniprogram_dist` 与 `index.js` 导出。
- 更新 `scripts/test-popup.js`、TDesign 对照清单、进度记录和 Feedback Ledger；然后运行 `site:build`、`check`、`pack:check`、`example:install`、反馈生成与检查。
- 必须浏览器实测显隐、遮罩、五向位置、受控/非受控、`false/0/空字符串/null` 边界、滚动保护、动效中间帧/低动效、390px、主题与六项外观。微信真机仍需合法 AppID 验证 fixed 遮罩、触摸穿透、rpx、安全区、Slot、样式隔离和读屏。
- 联网对照固定为 [TDesign Miniprogram Popup 文档](https://tdesign.tencent.com/miniprogram/components/popup)、[TDesign Popup 源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/popup) 和 `tdesign-miniprogram@1.15.3` 包内 `miniprogram_dist/popup/{props.js,type.d.ts,popup.wxml,popup.js}`；在线页面用于产品信息，固定包用于可复现 API，不照搬其内部实现。

## 13. 2026-07-27 Footer 与全局毛玻璃

Footer 是唯一的 `100%` 操作轨；消费者的 PUI Button 通过公开 `block` 能力占满该轨，Popup 不得用标签或通配选择器穿透 Slot。遮罩模糊取 `blurOverlay` 与 Provider `pui-frosted-glass--on` 的并集。证据：`popup/popup.wxss`、`preview/styles.css`、`scripts/test-popup.js`、`PUI-FB-0423`。

## 14. 2026-07-27 Surface 顶边反馈

Popup 公开 `surface-top` Slot 作为 Surface 内第一个节点，专门组合不占布局高度的 `pui-top-loading`。定位与圆角裁切属于 Popup Surface，加载状态属于消费者；Header、Content、Footer 的尺寸和间距不因轨道出现而改变。证据：`popup/popup.wxml`、`popup/popup.wxss`、`miniprogram/pages/me/index.wxml`、`preview/app.js`、`scripts/test-popup.js`、`PUI-FB-0450`。
