# ScrollArea 滚动容器语义合同

本文是 PoemUI ScrollArea 的长期语义合同。修改源码、H5 镜像、示例、元数据或文档前，必须先运行：

`npm run feedback:list -- --component scroll-area`

完整 Props 与 Slot 以 `docs/COMPONENT_API.md` 为准；本文只记录不能被随意扩张的长期边界。

## 1. 组件定位

- ScrollArea 是固定高度或有界自适应高度的原生纵向 `scroll-view` 薄封装，用于在默认 Slot 内滚动已有内容、受控回写纵向位置并按目标节点 id 定位；`gradientOverlay` 是 PoemUI 明确提供的固定阅读过渡层，`contentPaddingBottom` 为所有滚动内容提供统一尾部安全区。
- 它对齐 TDesign `ScrollView`，不把浏览器或微信原生 `scroll-view` 的全部参数再复制成一套 PoemUI API；`gradientOverlay/gradientOverlayColor/gradientOverlaySize` 是本组件的最小视觉扩展，不映射为平台滚动参数、事件或方法。
- 2026-07-20 已联网核对 [TDesign ScrollView 源码目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/scroll-view)、[当前 WXML](https://github.com/Tencent/tdesign-miniprogram/blob/develop/packages/components/scroll-view/scroll-view.wxml) 与固定包 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/scroll-view/{scroll-view.d.ts,scroll-view.js,scroll-view.wxml,scroll-view.wxss,scroll-view.json}`。固定包只声明 `scrollIntoView`，并固定 `scroll-y/enhanced/show-scrollbar=false`。

## 2. 固定结构与区域

```text
透明定位根（固定高度，或自然增高到 maxHeight；无 Surface）
├── 原生 scroll-view（纵向、enhanced、隐藏滚动条、role=region）
│   └── 内容轨（default Slot + 尾部安全区 + 边缘探针）
├── 顶部渐变层（仅 gradientOverlay=true 且内容已滚离顶部；当前上下文色 → transparent）
└── 底部渐变层（仅 gradientOverlay=true 且仍可继续向下滚动；transparent → 当前上下文色）
```

- 透明定位根只提供固定/有界自适应高度和绝对定位上下文；不得拥有背景、内距、边框、圆角、阴影、毛玻璃或裁切。
- 原生 `scroll-view` 是唯一滚动上下文；`scrollTop` 与 `scrollIntoView` 只传递给它。`scrollTop` 规整为非负数；`scrollIntoView` 非空时按微信原生优先级覆盖数值定位。组件内部固定开启原生 `scroll-with-animation`，因此父级受控定位默认平滑完成，但不会把该平台开关重新提升为公共 Prop。
- 顶底渐变层是与原生滚动视口同级的固定层，不能放进 Slot 或滚动内容中；底部保留一个透明、不可交互的内部边缘探针以判断是否仍有后续内容。二者始终 `pointer-events:none` 且 `aria-hidden=true`。
- Slot 内内容、id、焦点和业务交互全部归调用方所有；内容轨只增加尾部安全区，不重排 Slot 子项或创建 Surface。

## 3. PUI 组合与依赖

- ScrollArea 本体不依赖 Button、Loading、Empty 或业务反馈组件。
- 调用方优先在 Slot 内组合 PUI Cell、List、Tag、Button 等；H5 概览使用共享 `cellSample` 镜像真实内容项。
- 根是基础滚动交互层，允许平台 `scroll-view`；不得为演示额外增加顶部、底部或重试 Button。

## 4. Token、间距与排版

- 透明定位根仅有定位、盒模型、宽度和由 `height` 得到的高度，不拥有背景、边框、圆角、阴影、毛玻璃、内距或私有动画。
- `height` 使用正数、rpx、px、vh 或 `auto` 表达；`0`、负数、空值与非数字统一回退默认 `320rpx`，H5 按 `1px≈2rpx` 镜像裸数/rpx、原样保留 px/vh，并对应回退 `160px`。`height="auto"` 时根和唯一原生视口随 Slot 自然增高，达到 `maxHeight` 后才产生局部滚动；`maxHeight` 默认 `320rpx`，只接受同一组正数尺寸，`auto` 与非法值回退默认上限。固定 `height` 时忽略 `maxHeight`，避免两套边界竞争。
- `gradientOverlaySize` 只允许 `sm`、`md`、`lg`：`sm` 使用 `--pui-scroll-area-gradient-overlay-size-sm`（`40rpx / 20px`），`md` 使用 `--pui-scroll-area-gradient-overlay-size-md`（`64rpx / 32px`，既有默认），`lg` 使用 `--pui-scroll-area-gradient-overlay-size-lg`（`88rpx / 44px`）。非法值统一回退 `md`；顶/底不额外消耗 Slot 空间、padding 或 margin。
- `contentPaddingBottom` 默认 `10vh`，统一保证最后一项能够继续滚到遮罩与屏幕底部之上；接受非负裸数（按 rpx）、`rpx`、`px` 或 `vh`，`0` 可显式关闭，负数、CSS 表达式和非法值回退 `10vh`。该 padding 只落在透明内容轨，不能让根或视口产生第二层 Surface。
- `gradientOverlayColor` 只接受 `#hex`、`rgb()`、`rgba()` 或 `var(--token)`。空值与非法值回退 `--pui-scroll-area-gradient-overlay-color-context`：普通实底上下文解析为 `--pui-bg-container`；`pui-frosted-glass--on` 与 `Popup card` 等半透明 Surface 必须将其重绑定为 `--pui-scroll-area-gradient-overlay-material-color`（浅色 `rgba(255,255,255,.32)`、深色 `rgba(24,24,27,.32)`），以柔和遮蔽边缘内容而不在合成后的玻璃面板上覆盖纯白/纯深色横带。该材质 Token 只是遮罩色，不给 ScrollArea 根增加背景、滤镜或 Surface。深色主题必须在深色 `--pui-bg-container` 后同时重绑定实底与材质色；合法自定义颜色仍优先并同时作用于两个方向。
- 内容间距、分隔和 Surface 由 Slot 内真实 PUI 组件或调用方页面 Token 管理。

## 5. 内容、Slot 与组合边界

- 只有 default Slot；Slot 投影到唯一透明内容轨中，保持原顺序和几何，内容轨只负责 `contentPaddingBottom` 与底部边缘探针。
- 需要定位时，调用方为 Slot 内目标节点给出唯一 `id`，父级将同一个字符串写入 `scrollIntoView`。
- 不以任意四向 padding、`bordered`、内置空态或静态占位替代调用方的组合责任；公开的 `contentPaddingBottom` 只解决最后内容可完整滚入视口的纵向安全区。

## 6. 状态与优先级

- ScrollArea 没有 active、selected、disabled、readonly、loading、empty、error、retry 或成功状态。
- `gradientOverlay=false` 优先移除两层遮罩；`true`（默认）仅在真实可滚动边缘渲染对应层：顶部只显示底部、底部只显示顶部、中段同时显示、无溢出时均不显示。内部滚动只发布最小 `scrollTop/scrollHeight`，边缘观察结果不另发事件。颜色无效时仅回退上下文色，尺寸无效时仅回退 `md`，均不产生错误提示或状态。
- 没有目标 id、目标不存在或内容不足以滚动时，保持原生静默行为；不得显示伪错误、伪完成或状态提示。
- 滚动条固定隐藏，但真实滚动仍然可用。

## 7. 交互、受控边界与事件

- `scrollTop` 是受控纵向位置：父级更新它后，原生滚动视口以平台动画完成定位；用户滚动时组件通过 `scroll` 发布真实 `{ scrollTop, scrollHeight }`，父级可据此回写同一值并驱动 BackTop。小程序端必须把“等于本次用户事件位置”的回写识别为回声：它只用于父级状态，不能重新下发原生 `scroll-top` 抢占 enhanced 滚动的惯性；真正不同的父级目标仍会定位。若 BackTop 从用户位置请求初始 target（通常为 `0`），组件须重放当前位置后再下发目标，保证同值 target 也能真实回顶。该路径不得触发根样式全量 `setData`、重新测量或重建渐变观察器。H5 保持原生 passive scroll 只同步遮罩边缘，遵守同一“用户手势不被回写重启”的边界。
- 当父级 Tabs 切换后会替换同一 ScrollArea 中的长目录数据时，父级应在同一次状态更新中把受控 `scrollTop` 写回 `0`，复用现有平滑定位链路显示新分类首项；不得重建 ScrollArea、制造第二个滚动区，或要求 Tabs 反向控制消费者滚动。`pages/styles/index` 是该组合规则的参考实现。
- `scrollIntoView` 是目标节点定位值：父级更新它后，原生滚动视口以同一平台动画完成定位；非空目标按微信原生规则优先于 `scrollTop`。
- `gradientOverlay`、`gradientOverlayColor` 与 `gradientOverlaySize` 是父级直接控制的纯视觉 Props，不写回、不触发事件，也不会改变 `scrollTop`、目标定位或 Slot 内容。
- `contentPaddingBottom` 是父级可覆盖的布局 Prop，默认 `10vh`；绝对定位浮层不会自动参与滚动高度，消费者可在浮层展开时把该值提高到面板所需高度，关闭后恢复默认值。
- `scroll` 事件：当用户滚动时触发，detail 包含 `scrollTop` 和 `scrollHeight`；用于 back-top 等需要滚动坐标的场景。
- ScrollArea 没有公开 Methods，也不拥有阈值、横向滚动、可配置滚动动画或禁用包装 API。平滑定位是组件内部固定行为，不增加 `scrollWithAnimation` 或 `duration` Prop。
- 业务若需要横向滚动、手势事件或平台专有参数，直接使用微信 `scroll-view`；不得再将它们塞回 ScrollArea。

## 8. 可访问性

- 原生滚动视口固定 `role="region"` 并使用 `ariaLabel`；空标签回退“滚动内容”。
- 顶底渐变层必须 `aria-hidden=true`、不接收指针、焦点或键盘操作；不得遮挡 Slot 的可点击、可输入或可读屏内容。
- Slot 内的读屏语义、Tab 焦点和键盘操作不被 ScrollArea 改写。
- 不以状态文字、不可见 blocker 或 DOM 复制破坏内容可达性。

## 9. H5 预览与跨端一致性

- H5 必须使用真实 `overflow-y:auto` 容器，固定隐藏浏览器滚动条；不能用静态列表、位置提示或动画伪造滚动。
- H5 父级 Props 改写与当前位置不同的 `scrollTop` 后通过真实 `scrollTo({ behavior:'smooth' })` 更新同一 `overflow-y:auto` 容器的位置；与原生当前值相同（允许 1px 浮点误差）的回写是用户手势回声，必须跳过，不能重启浏览器惯性。`scrollIntoView` 非空时在同一滚动容器内找到同名 `data-scroll-area-anchor` 并按原生优先级平滑定位。系统 `prefers-reduced-motion` 时改为 `auto`，不伪造中间位置或完成事件。
- H5 使用同样的透明定位根、唯一 `overflow-y:auto` 视口、透明内容轨和两层 fixed sibling overlay；固定高度直接映射，`height="auto"` 时视口继承根的 `maxHeight` 并在超过上限后真实滚动。内容轨按同一规则消费默认 `10vh` 的 `contentPaddingBottom`。以真实 `scrollTop/clientHeight/scrollHeight` 同步“顶部仅底层、底部仅顶层、中段两层、无溢出零层”。`gradientOverlay=false` 必须移除 DOM 遮罩，颜色校验、`sm/md/lg` 尺寸映射、上下文色回退、`pointer-events:none` 与 `aria-hidden` 必须与小程序一致；普通上下文从当前 `--surface-solid` 解析，毛玻璃 App Shell、局部 ConfigProvider 与 Popup card 则和小程序一样切换到同名半透明材质色。验收必须滚动到遮罩可见后读取实际渐变起始色，不能只检查主题或 frost 属性。
- H5 与小程序端必须共同拒绝零或负高度，不能将 `0` 算成可见但不可用的 `1px/1rpx` 滚动区。
- 官网概览为避免 622px PreviewDevice 中只出现一个 160px 小窗，明确以 `height="1128rpx"`（H5 `564px`）和 18 项真实 PUI Cell Slot 内容填满 `shadow-safe` 的可用预览高度并演示滚动。该值会出现在当前效果 WXML 中，且不改变组件公开默认值 `320rpx`。重置恢复该演示值，属性/API 仍显示真实默认值。
- 小程序独立页继续由被测 ScrollArea 承担唯一滚动上下文；Slot 顶部组合 PUI Cell + Switch 控制 `gradientOverlay`，并用两个等分 PUI Button 在 `sm / md / lg` 三档间调整 `gradientOverlaySize`。这些控件只改公开视觉 Props，不创建第二滚动区、不改变当前位置，也不扩张组件事件或方法。
- Popup 等父组件若默认拥有同方向滚动，必须先通过父组件公开能力关闭父级滚动，再让一个 ScrollArea 成为唯一滚动所有者。更新公告是 reference consumer：Popup `contentScrollable=false`，内部 ScrollArea 使用 `height="auto" + maxHeight="60vh"`，短内容自然收紧，长内容超过上限后才滚动，固定 Footer 不进入滚动区。
- ScrollArea 使用 `shadow-safe` PreviewDevice 父布局；根透明，PUI Cell 的 Surface 留给真实 Slot 子组件，不得通过页面私有 margin 修复阴影裁切。

## 10. 响应式、主题与视觉配置

- 390px 下滚动容器宽度始终不超过可用视口，Slot 内容必须 `min-width:0` 且页面不产生横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和全局渐变只作用于 Slot 内真实 PUI 组件或 PreviewDevice，不得令透明 ScrollArea 根产生第二层 Surface。默认遮罩色跟随当前 Surface 材质：普通实底使用浅色 `#fff` / 深色 `#18181b`，半透明或毛玻璃 Surface 使用同色相、`.32` alpha 的材质遮罩；页面壳仍可将上下文 Token 指向自己的画布 Token，使无边 Navbar 与滚动视口连续。主题切换时实底和材质色都必须在当前作用域重新解析，不得继承切换前的浅色计算值。遮罩高度仅由 `gradientOverlaySize` 的三档 Token 决定，不使用全局页面渐变，也不继承阴影、滤镜或圆角；显式 `gradientOverlayColor` 始终高于上下文默认值。
- ScrollArea 不声明 CSS 进退场动画；受控位置变化使用平台原生平滑滚动。H5 在系统低动效下立即定位；小程序端使用微信 `scroll-with-animation` 的平台行为，不公开第二套时长或 easing。

## 11. 明确禁止

- 不得恢复任意四向 `padding`、`bordered/scrollY/scrollX/showScrollbar/scrollLeft/scrollWithAnimation/upperThreshold/lowerThreshold/disabled/reduceMotion` 等旧包装 Props；`contentPaddingBottom` 是唯一公开内容安全区，不能扩张成四向布局系统。内部固定的 `scroll-with-animation=true` 不是调用方 API。不得把 `gradientOverlaySize` 扩张为任意数值、方向、滚动阈值或动画 API，尺寸只能保持 `sm/md/lg` 三档。
- 除真实 `scroll` 外不得恢复 `scrolltoupper/scrolltolower` 等平台事件；不得恢复 `scrollTo()/scrollToTop()` 方法、顶部/底部演示按钮或自定义计时器伪造的滚动动画。H5 只镜像平台原生 smooth/auto 行为。
- 不得以空态、错误态、重试、禁用遮罩或状态文字掩盖没有公开这些能力的事实。
- 不得给 ScrollArea 透明定位根添加背景、边框、圆角、阴影、毛玻璃、`overflow:hidden` 或额外内层 Surface；不得把遮罩放入 Slot、作为第二个 scroll-view，或用可点击遮罩阻断内容。

## 12. 修改闭环

1. 审计 `scroll-area/` 四件套、`metadata/components.js`、`preview/app.js`、`preview/styles.css`、示例、API、H5 兼容说明、dist 与 npm 安装产物。
2. 运行 `scripts/test-scroll-area.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`。
3. 浏览器验证默认 Slot 手动滚动、`scrollIntoView` 父级回写、空目标、非法高度、遮罩默认/关闭/自定义色与 `sm/md/lg` 高度、390px、深浅色和外观开关；合法 AppID 真机继续验证增强滚动、rpx、目标 id、固定遮罩合成、样式隔离和读屏。
