# Card 组件语义合同

本文是 PoemUI Card 的长期设计与实现合同。修改源码、H5、示例、元数据或相关 Token 前必须查询：

`npm run feedback:list -- --component card`

完整 Props、Events、Slots 与 Methods 以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- Card 是承载一组相关内容、说明与动作的独立 Surface；它不是 CellGroup、弹层、表单提交器或业务状态机。
- 它仅提供结构与可选的 `click` 边界，保存、提交、加载、成功、失败与重试都由调用方的 Slot/页面处理。

## 2. 固定结构与区域

- 根为一个 Card Surface；Header、Content、Footer 是同层的条件区域。Header 仅在 `showHeader || title || description` 时存在，Content 始终存在，Footer 仅在 `showFooter=true` 时存在。
- Header 承载标题、说明与 `header` slot；Content 承载默认 slot；Footer 只承载 `footer` slot。未启用 Footer 时 H5 和 WXML 都不得保留“已关闭”等占位节点。

## 3. PUI 组合与依赖

- Card 内不私造业务操作；默认 slot 可组合真实 PUI Cell、Tag、Button、Icon 等组件。
- Footer 的业务 Button 仍是调用方的 PUI Button；Card Footer 使用 `catchtap` 保留它独立的 click 边界，不把它误报为 Card click。

## 4. Token、间距与排版

- 普通 Header、Content、Footer 都使用 `--pui-panel-padding`（28rpx / H5 14px）；compact 都使用 `--pui-panel-padding-compact`（20rpx / H5 10px）。
- Header 标题为 30rpx/42rpx，说明与标题使用紧密信息间距；有 Header/Footer 边界时只在对应区域绘制 1rpx token 分隔线。
- Card 的 `shadow` Prop 才决定是否消费卡片阴影。官网全局外观只提供可用的阴影、毛玻璃、边框、主题和圆角 Token，不能把 `shadow=false` 的 Card 变成有外投影。
- Card 是独立 Surface；`pui-spacing--equal` 仅统一 Card inset 与 Header/Content/Footer 结构 gap，不能把 Card 内的 Cell、Tag 或其他展示叶子变成独立阴影 Surface。

## 5. 内容、Slot 与组合边界

- 公开默认、`header`、`footer` 三个 Slot；空 Header/Footer 不用伪文案填充。
- 父级只负责 Slot 的内容与业务回写；Card 不得穿透改写子组件的尺寸、padding、圆角、禁用或事件。

## 6. 状态与优先级

- Card 没有 active、selected、readonly、loading、empty、error、retry 或成功状态。`disabled` 只阻断 Card 自身 tap，并保留 Footer 内子 Button 的独立事件。
- `padding` 非 `compact` 回退 `normal`；duration 非法回退 500ms、超过 1000ms 收敛，`reduceMotion=true` 固定 1ms。

## 7. 交互、受控边界与事件

- 仅 `clickable && !disabled` 时根为 `role=button` 并发布一次 `click({ source: 'card' })`；否则是静态 `role=region`。
- Card 没有受控/非受控值、实例方法或业务完成回调。Footer 的 Button click 属于调用方，不能借 H5 文案伪造成 Card 的保存成功。

## 8. 可访问性

- 根始终提供 `ariaLabel`，并同步 `aria-disabled`；可点击 Card 可通过 H5 键盘等价触发，原生端保留平台 tap 语义。
- Header/Content/Footer 只表达结构，不重复标题或制造无内容 landmark；调用方必须为 Footer 内纯图标操作提供可访问名称。

## 9. H5 预览与跨端一致性

- H5 复用 Card 同一 Header/Content/Footer 条件与 PUI Cell、Tag、Button 镜像；Overview 仅显示可理解的内容和实际可操作的 Footer Button，不显示 slot 诊断或“Footer 已关闭”占位。
- Props 面板必须真实改变 border、normal/compact padding、Header/Footer 显隐、clickable/disabled、shadow、duration 与 reduceMotion。Card click 与 Footer Button click 的运行态必须分开。
- H5 用 px 近似 rpx；原生 Footer 的 `catchtap`、Slot 投影、hover、读屏和样式隔离仍需真机确认。

## 10. 响应式、主题与视觉配置

- 390px 下 Card、Slot 内容与 Footer Button 必须在 PreviewDevice 内自然换行/收缩，不产生页面级横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角与渐变只改变对应视觉 Token；normal/compact 几何与三段结构保持不变。Card 可作为独立 Surface 使用外投影，内部 Cell、Tag 等展示叶子不得继承为外阴影。
- `equalSpacing` 在 Card 根上将 `--pui-card-section-gap` 重映射到当前 `--pui-card-inset`；`compact` 先把 inset 设为 compact Token，保证结构 gap 与该密度的四向内距相等。

## 11. 明确禁止

- 不得恢复 loading/error/empty/retry、submit/save/success Props 或 Events、实例方法、第二层 Card/Panel，或以提示文字冒充业务成功。
- 不得在 `showFooter=false` 时保留 H5 占位 Footer；不得让全局 `.preview-stage` 通用阴影选择器覆盖 Card 的 `shadow=false`。
- 不得用私有 px 间距替代 normal 14px/compact 10px 镜像 Token，也不得让 Footer 的 Button 冒泡触发 Card click。

## 12. 修改闭环

1. 审计 `card/` 四件套、入口、metadata、H5、API、兼容说明、示例、dist 与安装产物。
2. 运行 `node scripts/test-card.js`、Ledger generate/check、`site:build`、`check`、`pack:check`。
3. 浏览器验证 Header/Content/Footer、normal/compact、border/shadow、clickable/disabled、Card/Footer 事件隔离、500ms/1ms、390px、深浅色和外观开关；真机确认 Slot、hover、rpx 与读屏。

## 13. 2026-07-27 发布检查演示

独立页和 H5 用“发布前检查”表达 Card 的 Header、摘要、Footer Button 与 disabled 归档态；click 只展开父级真实检查内容，不展示 Slot 工程术语或假成功。见 `miniprogram/pages/components/card/`、`preview/app.js`、`PUI-FB-0432`。
