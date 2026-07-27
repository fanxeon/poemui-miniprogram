# 小程序数据展示分区页面合同

数据展示分区迁入 `Avatar / Badge / Card / Image / Tag / Cell / List / Collapse / Collapsible / Bubble / SwipeCell / CountDown / Swiper / Table` 共十四页。每页复用全局 Provider、共享 Navbar、唯一页面 ScrollArea 和透明 `component-page-section`。

- Avatar、Badge、Card、Image、Tag 保留图片回退、0 值、点击、图片状态和 close 的真实边界。
- Cell 使用真实 selectable/selected 语义；List 的 retry 不自动清除 error，只有页面确认资料恢复后才清除。Collapse/Collapsible 的展开状态由页面回写。
- Bubble 不伪造发送或已读；SwipeCell 只把动作意图交给页面；CountDown 归零不等于业务成功。
- Swiper 的 value 与 Table 的选择/排序由父级回写；Table 的横向滚动只属于 Table 自身。

```sh
node scripts/test-miniprogram-data-pages.js
node scripts/test-miniprogram-component-page-quality.js
node scripts/test-avatar.js
node scripts/test-badge.js
node scripts/test-card.js
node scripts/test-image.js
node scripts/test-tag.js
node scripts/test-cell.js
node scripts/test-list.js
node scripts/test-collapse.js
node scripts/test-collapsible.js
node scripts/test-bubble.js
node scripts/test-swipe-cell.js
node scripts/test-count-down.js
node scripts/test-swiper.js
node scripts/test-table.js
```

逐页场景与关键边界见 `docs/MINIPROGRAM_COMPONENT_PAGE_ACCEPTANCE.md`。390px 与真机仍需验证图片长按、SwipeCell 手势、CountDown 时钟、Swiper 惯性、Table 固定列和读屏。
