# PoemUI 导航分区小程序页面

## 目标

把已发布的九个导航组件迁移到真实微信小程序页面，同时保持首页目录、搜索、路由、共享详情页壳和组件公开 API 同步。页面是组件的真实消费者，不复制官网预览或维护第二套组件状态。

## 页面与真实交互

| 页面 | 真实交互边界 |
| --- | --- |
| Navbar | 当前页面的共享 Navbar 与独立示例都使用 `capsule=true` 保护微信原生胶囊。示例复用首页的 `leftBtn/rightBtn` 组件级双操作：两个按钮都位于左侧胶囊镜像轨，右侧不放业务内容；`visible` 由 PUI Switch 直接控制 Navbar 本体。 |
| NavigationMenu | 水平模式由组件自身根 Trigger 展开全屏浮层；垂直模式使用无 Overlay 的同层双栏工作区，并由组件根预留 Panel 阴影外扩区。两种模式分别回写 `visible/value/expanded-value/checked-values/radio-values`；最底部错误态展开时通过 ScrollArea `contentPaddingBottom` 提高尾部安全区，Retry 请求父级移除 `error`。 |
| Tabs | 四项显式等分；六项关闭等分，使用组件的半露项提示横向继续滑动；禁用项不改受控 value。 |
| Breadcrumb | 当前项、长路径和 retry 均由父级接收；路径状态不被组件私自改写。 |
| Tabbar | 文案、Badge、纯图标、`fixed/placeholder/safe-area-inset-bottom` 在同一页面中可观察。 |
| Steps | `change`、上一步、下一步都回写页面状态；两个操作为带 `16rpx` 间距的等分两列。纵向、完成和禁用示例只表达组件边界，横纵 connector 均与 indicator 中心对齐。 |
| BackTop | 监听页面唯一 ScrollArea 的真实 `scroll`；点击后把同一 `pageScrollTop` 回写为 0，并通过 ScrollArea 公开的 `scroll-top` 生效，不调用未公开实例方法。 |
| Indexes | 以十四个分组形成真实长列表；索引切换、条目点击和 retry 进入页面状态，右侧活动字母在 `42rpx × 36rpx` 轨内保持高对比反色与光学居中，内容避让索引轨；错误态不伪造数据恢复。 |
| SideBar | 左侧 `value` 回写驱动右侧消费者内容；第二个代表场景使用清楚的只读分类，不再以“恢复入口”工程术语作为用户示例。 |

## 统一页面壳

每一页都使用：

- `createComponentPage`：统一标题、默认 Props、外观 Provider、返回路由和动态高度测量。
- `component-page-navbar`：唯一详情页 Navbar 和外观入口。
- `pui-scroll-area`：唯一纵向滚动上下文，页面不创建原生 `scroll-view`。
- `component-page-section`：统一标题、说明和内容间距。
- `styles/navigation-pages.wxss`：只提供页面编排所需的布局 Token，不重写 PUI 组件表面。

Navbar 页面与 NavigationMenu 页面可以增加各自的透明编排样式，但不得改变组件内部 Surface、尺寸或交互根：

- Navbar 示例只保留一个左侧双操作 Navbar；`leftBtn/rightBtn` 都由组件渲染在左侧镜像轨，`capsule=true` 时不得使用右 Slot。显隐 Switch 与状态说明位于组件外，`visible=false` 后舞台仍保留 Navbar 的语义高度。
- NavigationMenu 不设置第二个“打开菜单”按钮。水平模式使用 `placement=bottom + showOverlay=true`，垂直模式只使用 `direction=vertical + showOverlay=false`，禁止把两套几何混在同一实例。
- 同页两个浮层实例必须互斥，并只让当前打开的实例进入高 z-index；垂直工作区保持在内容层，不能穿透浮层 Overlay。
- Error 示例不得永久 `visible=true`；Retry 只发布恢复请求，页面必须通过真实 Props 回写解除错误。

## 路由与首页合同

九条路由显式登记在 `miniprogram/app.json`，首页的 `NAVIGATION_COMPONENTS` 同时驱动导航分区、Search 候选和 Cell URL。保留独立页面而不是查询参数路由，是因为每个组件的 `usingComponents`、Slot、事件合同和父级状态编排不同；共享的是页面行为，不是把组件差异压平。

## 验证入口

```sh
node scripts/test-miniprogram-navigation-pages.js
node scripts/test-miniprogram-home.js
node scripts/test-miniprogram-component-pages.js
node scripts/test-miniprogram-component-page-quality.js
npm run feedback:generate
npm run feedback:check
npm run site:build
npm run check
npm run example:install
npm run pack:check
```

以上命令验证源码、路由、页面契约、目录生成、站点构建、示例安装和发布包一致性。逐页代表场景与关键边界见 `docs/MINIPROGRAM_COMPONENT_PAGE_ACCEPTANCE.md`。390px 模拟器、iOS/Android 真机、触摸惯性、系统安全区、读屏和深浅色组合在没有实测前均保留为未验证风险。
