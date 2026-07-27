# Collapsible 组件语义合同

本文是 PoemUI Collapsible 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component collapsible`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文只固定不能被随意扩张的交互、状态和布局边界。

## 1. 组件定位

- Collapsible 解决单段辅助内容按需展开的问题：一个 Trigger 控制一个 Content，适合发布设置说明、表单补充信息和短小详情。
- 它不是 `Collapse` 的单项别名；多面板、互斥、`items/value` 集合状态由 Collapse/Accordion 承担，禁止向 Collapsible 引入它们。
- `open` 为 `Boolean` 时受父级控制；`null` 或未传时使用 `defaultOpen` 初始化内部状态。`disabled` 阻断动作，`readonly` 可阅读但不改变开合。

## 2. 固定结构与区域

```text
组件根
├── Trigger（组件自身 role=button 交互根）
│   └── trigger Slot 或 label / icon / 展开图标
└── Content（常驻 role=region 容器）
    └── default Slot 或 content / Loading / Empty / Error + Retry
```

- Trigger 与 Content 是稳定的两个区域；收起仅改变 Content 的可见高度、透明度与位移，不能删除 Content 节点或以 `display:none` 瞬移。
- Content 通过 selector query 读取真实内部高度；只有 Content 可裁切，根和 Trigger 不承担额外 Surface 或滚动上下文。
- `block=false` 只改变布局模式，不改变区域、事件或状态语义。

## 3. PUI 组合与依赖

- 默认 loading 必须调用 PUI Loading；默认 empty/error 必须调用 PUI Empty。Error 的 `retryText` 对应兄弟 PUI Button，且只在真实 `retry` 事件可用时展示。
- 默认 Slot 和 trigger Slot 由调用方组合 PUI Cell、Tag、Icon、Button 等组件；父级只管理所在区域，不能覆盖其子组件尺寸、padding、圆角或主题几何。
- Trigger 是组件自身的底层交互根，可以使用平台节点并补齐 `role=button`、键盘和 ARIA；不得为了静态消除原生根再嵌套一层 PUI Button。

## 4. Token、间距与排版

- 根、Trigger 和 Content 使用已有 Collapsible 语义 Token；`bordered` 只控制中性边界，不以外投影替代分隔或状态边界。
- Trigger 与 Content 的关系使用 `--pui-section-gap` 语义；内部内容组合按 `16rpx / 8px`，紧密图标文字按 `8rpx / 4px`，不得由页面私有 margin 堆出开合空白。
- 动效只使用 `--pui-collapsible-duration` 与 `--pui-collapsible-easing`：默认 `500ms`，最大 `1000ms`，`reduceMotion=true` 固定 `1ms`；禁止对 `height:auto` 写 transition。
- `theme` 仅接受 default/primary/success/warning/danger，`iconPosition` 仅接受 left/right；非法值回退 default/right。

## 5. 内容、Slot 与组合边界

- `trigger` 具名 Slot 接管 Trigger 正文；未启用时组件使用 `label`、`icon` 和 `expandIcon`。Slot 不能移除 Trigger 的展开语义或可访问名称。
- default Slot 在 `customContent=true` 时接管正文；否则 `content` 是普通正文。两者均位于同一 Content 容器，不能再套第二个 Card/Surface。
- `loading/error/empty` 属于 Content 的业务呈现；调用方自定义内容不等于可以删掉受控、禁用、只读或动效边界。

## 6. 状态与优先级

- Content 状态优先级固定为 `error > loading > content > empty`。error 同时为真时必须覆盖 loading 和内容；error 解除后按既有优先级恢复。
- `disabled` 阻断 Trigger、实例方法和 retry；`readonly` 只阻断开合写入，Trigger 仍可产生带 `blocked=true` 的 click 事实。
- `retryText` 为空时不渲染 Retry；Retry 只发出 `retry`，不伪造网络恢复、成功提示或父级状态回写。
- 开合中保持同一 Content 节点和测得高度；完成态由 `max-height` 的 `transitionend` 去重后发出，不能因 opacity 的 transitionend 提前完成。

## 7. 交互、受控边界与事件

- `open` 是严格受控值：Trigger 或 `open()/close()/toggle()` 只请求下一值并发出事件，父级写回前不提前改变视图；从受控退回非受控时重新以 `defaultOpen` 初始化。
- 非受控时，用户 Trigger 的事件顺序为 `click → input → change → open|close`；实例方法省略 click，重复目标状态不发事件。
- `after-open/after-close` 由对应 `max-height transitionend` 触发，`source=transitionend`；`retry()` 仅等同真实 Retry 点击。
- `duration` 在 0–1000ms 内截断，`easing` 仅接受公开枚举；低动效压缩为 1ms，但不改变事件、受控等待或状态优先级。

## 8. 可访问性

- Trigger 必须具有 `role=button`、准确 `aria-expanded`、禁用/只读语义与可访问名称；Content 为 `role=region`，使用 `ariaLabel`，空值回退 label 或“折叠内容”。
- 键盘 Enter/Space 与点击走同一请求路径，来源必须可辨；disabled 不可聚焦触发业务操作，readonly 不得伪装成可写。
- Error/Loading/Empty 使用真实 PUI 语义；不以不可见文案、状态 toast 或 `text-cut` 隐藏关键反馈。

## 9. H5 预览与跨端一致性

- H5 必须保留与 WXML 对应的单 Trigger、单 Content、受控等待、状态优先级和 `max-height、opacity、translateY` 动画；不能用整段 Stage 重绘、静态提示或只改 Props 模拟交互。
- 概览只保留真实触发入口、展开结果和必要的状态内容；方法、事件流水和工程诊断进入 API/属性，不作为概览内容。
- Collapsible 使用 `shadow-safe` PreviewDevice 父布局，按 14px 基础内距与 14px 阴影安全区工作；禁止通过页面私有 margin 修复阴影裁切。
- H5 通过同一 `open/defaultOpen` 真相源回写属性面板，保留离开节点直至 500ms 动画结束；平台 selector query 的精确高度测量与浏览器 `scrollHeight` 有差异时，必须记录而非伪称相同。

## 10. 响应式、主题与视觉配置

- 390px 下 Trigger、正文和 Retry 必须可换行、可点击且页面无横向溢出；Content 不能超出 PreviewDevice。
- light/dark 由主题 Token 提供文本、容器和边界；阴影、毛玻璃、大圆角、边框与渐变只影响真实 PUI Surface，不能令透明布局根新增卡片或让开合几何跳变。
- `bordered=false` 保留盒模型与焦点、错误、选中边界；`reduceMotion` 只改变时长，不改变组件尺寸、状态或事件顺序。

## 11. 明确禁止

- 不得把 Collapsible 扩张为 `items/value` 多面板、互斥或 Accordion API，也不得把 Collapse 的集合事件搬入本组件。
- 不得使用 `display:none`、`height:auto` transition、整 Stage 重建、假成功或只更新提示文字替代真实开合与完成态。
- 不得把 Loading、Empty、Error、Retry 私有重写成原生 Spinner、占位或静态按钮；不得在 disabled/readonly 下伪造状态写入。
- 不得给 `shadow-safe` 预览增加页面私有间距、第二层可见 Surface、局部遮罩或横向滚动。

## 12. 修改闭环

1. 审计 `collapsible/` JS/JSON/WXML/WXSS、依赖 PUI Empty/Loading/Button、`index.js`、metadata、`preview/app.js`、`preview/styles.css`、Props 面板、WXML/API/H5 说明、`_example` 与 `miniprogram_dist`。
2. 运行 `npm run feedback:list -- --component collapsible`、`node scripts/test-collapsible.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check` 与 `npm run pack:check`。
3. 浏览器实测默认、受控/非受控、disabled、readonly、loading/error/empty/retry、事件顺序、实例方法、500ms 中间帧/完成态、reduceMotion、390px、深浅色与外观开关；真机继续确认 selector height、transitionend、Slot 焦点和样式隔离。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。

## 13. 等距与阴影资格

Collapsible 在 `equalSpacing` 时将展开内容四向 inset 映射到 `--pui-surface-inset`；Trigger 和内容内部组合保持原有微间距。它属于连续内容集合根，不具备全局外投影资格：`shadow` 开启时根仍为 `box-shadow:none`；自身可消费毛玻璃背景，但不得由此叠加第二层 Surface。
