# VirtualList 组件语义合同

本文是 PoemUI VirtualList 的长期设计与实现合同。修改前必须查询：

`npm run feedback:list -- --component virtual-list`

完整 API 以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- VirtualList 是固定行高的窗口化列表，不是 List 的普通条目替代，也不承担远端分页完成语义。
- 它以真实滚动位置裁出可见项，保留总高度；items=[] 必须是真实空列表，不生成演示数据。

## 2. 固定结构与区域

- 固定为唯一滚动 viewport、顶部 spacer、可见项窗口、底部 spacer，以及可选 header/footer/empty 区。
- item 外层为组件自身 listitem，spacer 只承担高度，不能承载交互或第二滚动上下文。

## 3. PUI 组合与依赖

- 默认 item 内部复用 PUI Cell/Badge/Icon/Loading；customItem/header/footer/empty 由调用方 Slot 组合。
- 组件自身 listitem 和 viewport 可以使用基础平台根；父级不得改坏窗口、spacer、选择或滚动语义。

## 4. Token、间距与排版

- itemHeight 是固定行高真相源，visible/overscan 采用左闭右开区间；spacer 高度与总数严格对应。
- `scrollTo*` 动效不超过 1000ms，默认 500ms，reduceMotion 为 1ms；不得用静态 spacer 或 height:auto 动画。
- WXSS 只通过 VirtualList 根节点时长 Token 压缩自身列表项动效，禁止 `*` 或伪元素通配覆盖 Cell、Badge、Loading 或 Slot。

## 5. 内容、Slot 与组合边界

- `customItem/header/footer/empty` 只接管内容，不得破坏 viewport、itemHeight、窗口计算、选择或滚动父级。
- default item 保留原始 value、0/false、badge 与 disabled/loading，不能按 truthy 删除。

## 6. 状态与优先级

- 正文固定 `error > loading > content > empty`；Error Retry 只通知父级，不自动清 error、追加条目或伪造网络恢复。
- selectable、readonly、disabled 与单项 disabled/loading 独立阻断对应选择行为。

## 7. 交互、受控边界与事件

- value/defaultValue 支持单/多选原始 0/false；受控选择只请求父级回写。
- H5 viewport 的真实 scroll 必须调用 `paintVirtualListWindow` 更新窗口；滚动、选择和方法不能依赖整 Stage 重绘或提示文字。

## 8. 可访问性

- list/listitem 语义、可见项顺序、键盘选择和禁用状态必须对应真实窗口；spacer 不可获得焦点或读屏内容。

## 9. H5 预览与跨端一致性

- Overview 使用 `shadow-safe` PreviewDevice 父布局；真实滚动后首项/窗口数量必须改变，不能完整渲染数组冒充虚拟化。
- H5 与小程序同样保留唯一 viewport；scrollTo 精确细节、rpx 和惯性需要真机确认。

## 10. 响应式、主题与视觉配置

- 390px 下列表、Cell 内容和状态区在 viewport 内收缩，页面无横向溢出。
- light/dark 与外观开关仅影响 PUI 子组件和 Token，不改变窗口数学、spacer 或选择状态。

## 11. 明确禁止

- 不得完整渲染数组、静态 spacer、第二滚动容器、全 Stage 重绘或假滚动文字冒充虚拟列表。
- 不得把远端分页成功、自动追加、静态空项或私有原生 Cell/Badge 作为组件能力。

## 12. 修改闭环

1. 审计 `virtual-list/`、依赖 Cell/Badge/Loading、metadata、H5、API、示例、dist 与安装产物。
2. 运行 `node scripts/test-virtual-list.js`、Ledger generate/check、`site:build`、`check`、`pack:check`。
3. 浏览器实测真实滚动窗口、受控/非受控、0/false、状态、retry、方法、500ms/低动效、390px、主题与外观；真机确认 rpx 与惯性。
