# List 组件语义合同

本文是 PoemUI List 的长期设计与实现合同。修改前必须查询：

`npm run feedback:list -- --component list`

完整 API 以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- List 是数据驱动的连续信息行，不是任意 Card 堆叠或虚拟列表；大量固定行高数据使用 VirtualList。
- 请求、分页与业务完成由父级持有，List 只呈现条目、状态与请求事件。

## 2. 固定结构与区域

- 根由可选 Header、正文、可选 Footer 组成；正文条目是 PUI Cell，Footer 是独立操作区。
- 内容状态仅替换正文，Footer 状态单独计算，不能因 Footer 错误删除已有条目。

## 3. PUI 组合与依赖

- 默认条目复用 PUI Cell，trailing 徽标/加载复用 Badge/Loading，Footer 的 load/retry 复用 PUI Button。
- header/default/footer/empty 是调用方 Slot；父级不得覆盖 Cell、Badge、Loading、Button 的尺寸与圆角。

## 4. Token、间距与排版

- 条目、分隔、Header、Footer 使用 List 与 Cell 的语义 Token；同组关系为 16rpx/8px，紧密信息为 8rpx/4px。
- 状态/条目/Footer 过渡使用 max-height、opacity、transform，默认 500ms、最大 1000ms、reduceMotion 为 1ms。

## 5. 内容、Slot 与组合边界

- `header/default/footer/empty` 只接管对应内容区，不改变 List 的状态优先级、选择和 Footer 请求语义。
- `badge=0`、dot、原始 value 都是有效内容，不能因空值判断被过滤。

## 6. 状态与优先级

- 有内容时正文固定为 content；空内容时正文为 `error > loading > empty`。
- Footer 固定为 `error > loading > finished > ready`，所以已有内容的加载错误必须保留条目与 Retry Footer。
- disabled、单项 disabled/loading 与 clickable 分别阻断对应操作，禁止全局误锁。

## 7. 交互、受控边界与事件

- `load/retry` 只发布请求，等待父级回写 loading/error/items/finished；不得定时追加假条目、自动清错或伪造成功。
- 条目事件保留真实 value/index/source；键盘 Enter/Space 与点击走同一路径。

## 8. 可访问性

- 条目沿用 PUI Cell 语义，Footer Button 具备名称、禁用与 loading 语义；状态内容不以颜色或省略号隐藏关键信息。

## 9. H5 预览与跨端一致性

- H5 必须真实回写父级状态并保留 PUI 子组件组合，Overview component-only 不显示工程事件卡。
- 使用 `shadow-safe` PreviewDevice 父布局，不能通过私有 margin、裸 button 或静态状态文案伪造加载。

## 10. 响应式、主题与视觉配置

- 390px 下标题、描述、value 与徽标只在组件内收缩或换行，页面无横向溢出。
- light/dark 与外观开关只改变 Token 外观，不改变条目、Footer 和状态优先级。

## 11. 明确禁止

- 不得把 List 改为 Card 集合、VirtualList、业务分页器或自行完成的远端请求。
- 不得以假追加、fake success、display:none 瞬移、静态占位或私有原生 Button 替代真实 PUI 组合。

## 12. 修改闭环

1. 审计 `list/`、依赖 Cell/Badge/Loading/Button、metadata、H5、API、示例、dist 与安装产物。
2. 运行 `node scripts/test-list.js`、Ledger generate/check、`site:build`、`check`、`pack:check`。
3. 实测内容/空/加载/错误/retry/Footer、disabled、事件、500ms/低动效、390px、深浅色与外观；真机确认 Slot 与 rpx。

## 13. 2026-07-27 连续列表演示

独立页和 H5 默认示例应提供足以滚动浏览的连续条目，并保留一个禁用项和真实 Footer 状态；不以 Card 网格或假加载完成代替。证据：`miniprogram/pages/components/list/index.js`、`preview/app.js`、`PUI-FB-0434`。

## 14. 2026-07-28 加载更多闭环

List 本体继续只发布 `load/retry`；独立页与 H5 演示父级必须在事件后真实回写 `loading=true`，完成后追加条目并更新 `finished/error`。默认动效为 500ms，不能只改事件文案或在 List 内自动成功。

## 15. 2026-07-29 尾部追加展开与 API 边界

- 已有非空 `items` 尾部真实追加条目时，只让新增索引进入 `max-height + opacity + transform` 展开；首次渲染、同长度替换、移除和仅状态变化不得重播。
- 展开继续消费既有 `duration / easing / reduceMotion`，不新增 `expanded`、`animate`、`after-expand` 或另一套动效参数。动画只表达 DOM 已由父级追加，绝不代表请求成功。
- `load/retry` 的事件与父级回写合同不变；`useSlot=true` 的默认 Slot 是消费者 DOM，List 不包裹或猜测其条目增量，Slot 内动效由消费者负责。
- 小程序独立页不得传入不存在的 `retryText`；默认 Footer 的可见 Retry 文案复用 `errorText`。若未来需要拆分错误说明和操作文案，必须先完成公共 API 决策，不能让演示静默使用无效 Prop。
- 2026-07-29 对照确认 TDesign 小程序 `1.15.3` 没有与 PoemUI 数据分页 List 同名同责的公开包；官方 Cell/CellGroup 负责连续信息行，Footer 负责静态页脚，均不提供分页追加或展开事件。因此本项不虚构 TDesign List API，只参考 `cell/{props.js,type.d.ts,cell.js,cell.wxml,cell.wxss}` 与 `footer/{props.js,type.d.ts,footer.js,footer.wxml,footer.wxss}` 的组合边界。
- H5 最终汇总需在 `preview/app.js` 记录前一批 item 数，并只给新增尾项挂进入 class；`preview/styles.css` 镜像同名时长、缓动和 1ms 低动效。专项测试必须覆盖首次不播、追加只播新增项、重复渲染不重播、Slot 不越权和 `load/retry` 仍只发请求。
