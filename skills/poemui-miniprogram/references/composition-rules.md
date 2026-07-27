# 组合规则

## 真实交互

- 受控 Prop 收到用户操作后先发事件，等待父级写回；不要在子组件内永久篡改受控值。
- 判断是否受控时检查 `null/undefined`，不能用 truthy 判断吞掉 `0`、`false` 或空字符串。
- 复制、上传、授权、登录、支付等平台动作只在真实 API 回调后展示结果。
- 每个异步动作都提供 loading、重复点击禁用、失败恢复和取消边界。

## PUI 优先

- 图标操作使用 PUI Button + PUI Icon，并提供 `aria-label`。
- 列表条目使用 Cell，集合使用 CellGroup；不要给每条 Cell 单独加卡片阴影。
- 空状态使用 Empty，加载使用 Loading/TopLoading，重试使用 Button。
- Popup、Dialog 等复合容器的业务内容继续组合 PUI 组件。

## 布局

- Header、Content、Footer 的主要分区使用统一 section gap。
- 390px 下保持可读、可点，不产生页面级横向滚动。
- 阴影只表达脱离内容流的独立 Surface；Cell、Tag、Badge、Icon 等叶子不因全局阴影获得外投影。
- 浮层遮罩覆盖真实视口，不能只覆盖组件附近。

## 修改原则

先保留正确实现，再做最小改动。不要复制 PoemUI 源码到业务工程；通过 npm 包和 `usingComponents` 使用。需要补组件能力时，明确影响范围并在组件库中修复，而不是在单页写私有分叉。
