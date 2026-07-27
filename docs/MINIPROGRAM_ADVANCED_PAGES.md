# 小程序高级分区页面合同

`PullRefresh / VirtualList / Watermark` 具有独立小程序路由。PullRefresh 与 VirtualList 是滚动所有者，外层不得再套同方向 ScrollArea；Watermark 使用标准详情页壳。

- PullRefresh 以最近更新列表演示本地刷新：refresh/timeout 由页面回写，刷新中提供显式结束入口，不声明服务器同步成功。
- VirtualList 使用 120 条有标题、分类和更新时间的资源数据、受控选择和 `scrollTop`，不以短列表冒充窗口化渲染。
- Watermark 以内部资料为代表场景；水印下方放置真实 PUI Button，用点击结果证明水印层不接管内容操作或读屏。

```sh
node scripts/test-miniprogram-advanced-pages.js
node scripts/test-miniprogram-component-page-quality.js
node scripts/test-pull-refresh.js
node scripts/test-virtual-list.js
node scripts/test-watermark.js
```

逐页场景与关键边界见 `docs/MINIPROGRAM_COMPONENT_PAGE_ACCEPTANCE.md`。`shadcn-chart` 仍是 H5 文档型例外，不创建小程序静态假路由。微信 390px 模拟器和 iOS/Android 真机仍需验证下拉手势、列表惯性、虚拟窗口、系统低动效和水印渲染。
