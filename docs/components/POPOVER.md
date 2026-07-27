# Popover 组件语义合同

本文是 PoemUI Popover 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或 Token 前，必须完整阅读本文，并查询：

`npm run feedback:list -- --component popover`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 参考证据

- 2026-07-20 已联网核对 [TDesign Popover 官方文档](https://tdesign.tencent.com/miniprogram/components/popover) 与 [官方源码目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/popover)。
- 可复现的固定版本为 `tdesign-miniprogram@1.15.3`：`miniprogram_dist/popover/{props.js,type.d.ts,popover.js,popover.wxml,popover.wxss}`。
- TDesign 的 `style/custom-style` 是平台样式逃生口；PoemUI 不另建同义公开 Props，以既有主题 Token 和页面组合承担样式定制。

## 1. 组件定位

- Popover 在已有触发元素旁展示一段轻量说明或操作上下文。
- 它只负责锚点、位置、气泡主题、显隐请求和点击外部关闭；页面或业务组件负责内容加载、错误、重试、提交和结果反馈。
- 需要屏幕边缘面板使用 Popup、Sheet 或 ；不能把它们的生命周期或业务状态移入 Popover。

## 2. 固定结构与区域

```text
根（定位上下文）
├── default Slot：触发元素
├── 透明外部点击层（仅 visible && closeOnClickOutside）
└── 气泡 Surface（进入后可交互）
    └── content Slot + content 文本
```

- default Slot 始终是消费者的触发元素；Popover 不替它绑定 tap、longpress 或命令式开关。
- 气泡只在显隐退场期间保留挂载；外部点击层覆盖完整页面并只请求关闭，不建立业务结果。
- `fixed=true` 时小程序端在节点已挂载后测量触发元素和气泡，使用视口坐标；普通模式保留相对锚点定位。

## 3. PUI 组合与依赖

- Popover 自身是基础浮层，允许使用 `view`、透明点击层、SelectorQuery 和 CSS 箭头作为底层实现。
- 它不内置 Button、Loading、Empty、Cell、标题或页脚；消费者在 default/content Slot 中组合 PUI 组件。
- H5 的触发入口必须由 `buttonSample` 生成，不能为 Popover 私造裸按钮、假重试或静态状态卡。

## 4. Token、间距与排版

- 气泡内容使用 `--pui-panel-padding`、`--pui-font-size-body-medium`、`--pui-line-height-body-medium`、`--pui-radius-small`、主题 Surface/Border/Shadow/Frosted Token。
- 箭头与气泡同源消费 background/border Token；边框关闭只透明化中性边界，不能改变几何。
- `left/right` 及其 start/end 位置的气泡 Surface 默认宽度为 `360rpx`。挂载后组件以 SelectorQuery 测量锚点到该侧视口边缘的实际可用宽度，并仅通过内部 `--pui-popover-side-width` 收窄自身 Surface；它不会向 default/content Slot 穿透写宽度。显式 `left/right` 只要请求侧仍有物理可用宽度，就必须保留该侧并自然换行，不能因默认宽度不足跳到 `top/bottom`；只有请求侧为 0 才尝试同轴反向侧，两个方向都为 0 才回落上下。
- `left` 永远是 default Slot 锚点的物理左侧（锚点左缘减气泡宽度和间距），`right` 永远是物理右侧（锚点右缘加间距）；方向控制按钮的页面位置不改变此语义。
- 进入/退场固定 500ms，`reduceMotion` 与系统低动效压缩到 1ms；禁止动画 `height:auto` 或用 `display:none` 制造瞬移。
- WXSS 低动效只作用 Popover 自己的气泡时长 Token，不能以 `*` 改写 default/content Slot。

## 5. 内容、Slot 与组合边界

- 只有 default 与 `content` 两个 Slot。default 承担触发元素，`content` 在字符串 content 之前渲染，以便消费者组合 Cell、Tag、Button 等真实内容。
- `content` 为空且没有 content Slot 时允许展示空气泡，不伪造 Empty 或错误状态。
- Popover 只排列自己的气泡 Surface，不得覆盖 Slot 子组件的尺寸、padding、圆角或事件。

## 6. 状态与优先级

- 唯一状态是声明式显隐：`visible` 非空时受控，否则由 `defaultVisible` 初始化非受控状态。
- 组件没有 disabled、readonly、loading、empty、error、retry、标题或页脚状态；这些语义由消费者在 Slot 外或 Slot 内按业务链路组合。
- 气泡位置优先使用指定 placement；`left/right` 先保留请求方向并按实测侧宽收窄，低于最小可读宽度才同轴翻转，只有两侧都不足才回落到可见的 `top/bottom`。`fixed` 同时用收窄后的测量宽度计算坐标；测量失败保持指定方向，不把失败伪造成成功定位。

## 7. 交互、受控边界与事件

- 受控时，外部点击只发一次 `visible-change({ visible: false })`，父级决定何时回写；非受控时组件先更新内部状态，再发布同一事件。
- `closeOnClickOutside=false` 不渲染透明点击层，不应凭空关闭。
- 不公开 `open/close/toggle` 方法、触发模式、after 生命周期、input/change 或业务 retry；调用方通过 `visible` 和唯一事件完成链路。

## 8. 可访问性

- 气泡使用非模态 `role=dialog`，`aria-label` 优先读取 ariaLabel，再回退 content。
- default Slot 的 Button/Cell 由消费者提供其可访问名称；Popover 不把任意 Slot 强行改为 button。
- 退场节点 `aria-hidden=true` 且不可点；低动效只缩短动效，不改变关闭、焦点或事件合同。

## 9. H5 预览与跨端一致性

- H5 使用完整 PreviewDevice 的 `edge-to-edge` 父布局。关闭时保留真实 PUI “显示气泡”入口；显隐由父级 state 回写，不伪造组件实例方法。
- H5 镜像 default/content Slot、12 个位置、主题、箭头、外部点击、受控/非受控和 fixed 视觉语义；浏览器以 PreviewDevice 局部坐标近似微信视口测量。显示气泡的 PUI Button 始终位于 canvas 几何中心，不因 placement 漂移；`left/right` 及其 start/end 气泡使用受设备半宽约束的可读宽度，不能回退为 `auto + 90px` 的单列窄条。进入时先在同一 canvas 挂载起始气泡，下一帧只切 active；离开时先切 leaving，完整 duration 后才卸载。禁止阶段回调或点击分支落入 `renderStage()` 重绘，否则会吞掉真实中间帧。
- 微信 `SelectorQuery`、fixed 触发元素、触摸点击层、rpx、Slot 投影和样式隔离仍须合法 AppID 真机复核。
- 小程序 Popover 详情页始终只保留一个由 `popover-page__reference` 居中的“点击显示气泡” default Slot 锚点；“顶部/底部/左侧/右侧”只是改变该同一实例的 placement 并打开它，不能额外创建第二组 Popover 把方向控制按钮误作锚点。组件默认仍不接管 default Slot 对齐。

## 10. 响应式、主题与视觉配置

- 390px 下气泡最大宽度受 PreviewDevice 约束，内容自然换行且不让页面级横向滚动。
- light/dark、边框、阴影、毛玻璃、大圆角与渐变只经全局 Token 作用于气泡，不改变定位或外部点击边界。

## 11. 明确禁止

- 不恢复 title/reference/footer Slot、trigger、disabled、loading/error/empty/retry、宽高/offset/zIndex、可调 duration/easing 或命令式方法。
- 不把 Popover 变成局部 Popup、Sheet 或业务流程容器；不显示工程方法栏、事件日志或伪状态卡。
- 不用 H5 静态占位模拟外部点击、定位翻转、父级受控回写或内容 Slot。

## 12. 修改闭环

1. 同步审计 `popover/*`、`preview/app.js`、`preview/styles.css`、metadata、`_example`、API/兼容说明、dist 与 npm 示例安装产物。
2. 运行 `scripts/test-popover.js`、共享浮层/概览/原生控件边界测试、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`。
3. 浏览器验证外部点击、受控/非受控、false/空 content、12 位置、theme、fixed、动效、390px 和六项外观；记录 Ledger，并保留微信真机风险。

## 13. 等距与阴影资格

Popover 气泡是 compact 独立 Surface；`equalSpacing` 只映射面板四向 inset，触发器、箭头和 content Slot 内部不参与。外投影只属于气泡面板根并使用 `--pui-shadow-floating`，不能复用 Popup 的附着方向阴影。
