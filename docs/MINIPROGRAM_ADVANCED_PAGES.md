# 小程序高级分区页面合同

`AreaChart / BarChart / DynamicMessage / PullRefresh / TopLoading / VirtualList / Waffle / Watermark` 具有独立小程序路由。PullRefresh 与 VirtualList 是滚动所有者，外层不得再套同方向 ScrollArea；其余组件使用标准详情页壳。

- AreaChart 使用原生 Canvas 2D 展示连续趋势，页面可真实切换曲线、叠加/堆叠并调用 `replay()`。
- BarChart 以共享零基线展示组件分类数量及已有/新增分段，页面按钮只更新真实 `items` 或 `mode`。
- Waffle 以圆润点阵展示组件总量，超过 `maxCells` 时必须显示“1 格 = N”；页面按钮只更新真实 `items` 或 `shape`。
- AreaChart、BarChart、Waffle 都默认启用 500ms 入场并公开 `replay()`；低动效压缩到 1ms，入场不代表数据加载成功。
- PullRefresh 以最近更新列表演示本地刷新：refresh/timeout 由页面回写，刷新中提供显式结束入口，不声明服务器同步成功。
- VirtualList 使用 120 条有标题、分类和更新时间的资源数据、受控选择和 `scrollTop`，不以短列表冒充窗口化渲染。
- Watermark 以内部资料为代表场景；水印下方放置真实 PUI Button，用点击结果证明水印层不接管内容操作或读屏。

```sh
node scripts/test-miniprogram-advanced-pages.js
node scripts/test-miniprogram-component-page-quality.js
node scripts/test-pull-refresh.js
node scripts/test-virtual-list.js
node scripts/test-watermark.js
node scripts/test-bar-chart.js
node scripts/test-waffle.js
```

逐页场景与关键边界见 `docs/MINIPROGRAM_COMPONENT_PAGE_ACCEPTANCE.md`。旧 `shadcn-chart` 研究路由已由 AreaChart、BarChart 与 Waffle 三个真实组件替代，不再作为公开目录例外。微信 390px 模拟器和 iOS/Android 真机仍需验证下拉手势、列表惯性、虚拟窗口、Canvas DPR、图形可读性、系统低动效和水印渲染。
