# PoemUI 小程序“我的”页合同

本文约束示例小程序一级目的地 `pages/me/index`。它是 PoemUI 组件的真实消费页面，不是新的 npm 组件，也不复制到官网标准组件预览。

## 1. 页面目标

- 该一级目的地不是用户中心，不展示头像、昵称或其他本地身份资料，也不提供资料编辑与持久化。
- 页面只保留真实组件状态、服务与信息入口。正文以实测 `contentHeight` 作为最小高度；服务 CellGroup 在正常文档流中紧跟仪表盘，并由父级唯一 `--pui-section-gap` 保留较大的分区间距，不再用 `margin-top:auto` 把空白塞在两个 Surface 之间。内容超过可用高度时仍由页面唯一 ScrollArea 正常滚动。
- 服务列表上方使用一张 PUI Card 组合透明三列数据摘要与一个 PUI AreaChart。组件与高级数量来自 `scripts/generate-catalog.js` 生成的 `miniprogram/common/data/component-status.js`；样式数量直接读取同一生成链产出的 `miniprogram/common/data/style-utilities-catalog.js`。页面依次显示“组件 / 样式 / 高级”与当前真实数量，并只把前序/当前版本及 `71 → 74` 总量转为同一 AreaChart 系列；不得手写 `74 / 562 / 8`、按日期猜增量或放静态占位。
- 页面不展示、读取、缓存或复制 OpenID，也不读取历史 `poemui-user-profile` 本地键。旧本地值不主动删除，但已没有代码消费者。
- “更新公告”从诗上共享云环境的 `pui_updatelog` 读取并打开受控 PUI Popup；云端失败时依次回退缓存和包内同形公告，来源不得伪装。

## 2. PUI 组合

页面根使用 `pui-config-provider use-global-config`，结构固定为非 fixed PUI Navbar、唯一 PUI ScrollArea 与非 fixed PUI Tabbar。当前正文组合：

- `pui-card + 透明三列摘要 + pui-area-chart`：唯一仪表盘 Surface。Card 不显示标题或 description；Content 顶部使用同一行三等分透明数据块，依次以较强数字和次级标签展示“74 / 组件”“562 / 样式”“8 / 高级”，三项均在运行时读取生成型真相源。AreaChart 固定使用同一 `components` 系列展示公开 `0.1.0 = 71` 与当前 `0.1.2 = 74`，横轴不增加冗余 `v` 前缀，`size=small`、`duration=1000`、`showGrid=true`、`showXAxis=true`、`showDots=true`、`showLegend=false`，显式上限为当前真实总量。1000ms 是公开动效合同上限，只延长本页图表入场，不修改共享组件默认 500ms；低动效仍由组件压缩为 1ms。单系列无需重复图例，版本横轴、圆点、三列摘要与完整读屏名称共同表达变化。
- AreaChart 保持透明展示叶子，Card 是唯一 Surface；页面不得穿透修改曲线、渐变、圆点、网格或动画。该趋势只有两个有证据的发布版本点，禁止为了让曲线更丰富而虚构月份、健康度、使用量或尚不存在的版本。分类横向比较属于 BarChart 场景，不再在 Me 页保留分类展开、测量式高度动画或“查看更多 / 收起”。微信 Canvas 在浮层合成时可能越过普通 Surface，且宿主 `hidden` 仍可能留下原生绘制层；因此打开更新公告 Popup、商业授权 Dialog 或外观 Popup 时，页面用 `wx:if` 卸载图表，关闭后恢复，不让曲线穿透浮层，也不为此改写 AreaChart 绘制 API。
- 三列摘要只是 Card Content 内的页面编排，不建立第二个 Card、边框、背景、阴影或毛玻璃；数值使用 PUI title Token 与等宽数字，标签使用 PUI body-small/secondary Token，列间与图表间距只消费 `--pui-content-gap` / `--pui-space-xs`。AreaChart 对调用方传入的 `item.label` 原样显示，页面是否带版本前缀属于消费层文案决定，不扩张图表 API。
- `pui-cell-group + pui-cell`：授权、订单、更新公告、隐私协议与关于诗上五个服务入口；服务区在正常文档流中直接跟随仪表盘，二者只由父级标准 `--pui-section-gap` 分隔，不额外叠加 margin 或第二层容器。
- Navbar `left` Slot：使用共享 Flex/紧密 gap 组合两个 `extra-small + text + transparent + circle + iconOnly` PUI Button。第一项 `comment + open-type="contact"` 真实交给微信客服会话能力，平台失败通过 Button `error` 事件进入 PUI Toast；第二项 `menu` 打开与首页同源的外观 Popup。两项都由 `capsule=true` 的左侧胶囊镜像轨定位，右 Slot 保持为空，不增加页面私有偏移、底色、边框、外投影或悬浮入口。
- `pui-dialog`：点击“高级版商业授权”先打开受控确认框，明确告知即将离开小程序页面并进入 PoemUI 官网；取消与 Close 只回写 `visible=false`，确认后才调用 `wx.navigateTo` 进入注册在 `app.json` 的授权 WebView 页面。导航进行中 Confirm 使用自身 loading/disabled，失败恢复可操作并保留重试或取消路径。
- `pui-popup + pui-scroll-area + pui-tag + pui-icon + pui-top-loading + pui-button`：公告 Header、最大高度 `78vh` 的唯一滚动内容区、组件改动层级、Surface 顶边同步状态与全宽 Footer。Popup 必须设 `contentScrollable=false`，避免与内部 ScrollArea 竞争滚动。TopLoading 必须通过 Popup `surface-top` Slot 贴住面板顶边，不能放进 Content；它只在请求开始时进入 `loading`，真实云端成功后进入 `success`，缓存、本地回退或异常直接回到 `idle`。
- `pui-popup + appearance-settings`：Navbar 菜单打开与首页一致的 Bottom Card 外观面板，Header 左侧使用 primary 圆形 Refresh PUI Button 调用共享 `visualConfig.reset()` 并同步关闭页面渐变，右侧沿用 Popup 默认 Close；正文只挂共享 `appearance-settings`，不复制第二套开关或配置 Store。外观 Popup 与公告 Popup 互斥。
- `pui-toast`：只反馈真实平台回调、输入错误或明确的未开放状态。

页面不得手写原生 Button/Input、第二个 ScrollArea、独立图标字符或重复的 Tabbar 占位壳。当前页面不得重新注册或渲染 Avatar、Input 或身份资料 Card；允许的唯一 Card 是组件状态仪表盘 Surface。Button、Cell 与透明 AreaChart 不获得页面私有阴影。

## 3. 服务入口

| Cell | 真实动作 | 当前边界 |
| --- | --- | --- |
| 高级版商业授权 | Cell 显示“查阅详情”；点击打开受控 PUI Dialog，确认后通过 `wx.navigateTo` 进入 `pages/license/index`，由微信 `<web-view>` 加载 `https://poemcoder.com/poem-ui` | 只提供真实授权信息入口，不创建支付或订单；生产小程序后台必须把 `poemcoder.com` 配置为业务域名 |
| 我的订单 | PUI Toast 提示“订单服务尚未开放” | 没有订单数据源，不创建假列表或假路由 |
| 更新公告 | 受控 PUI Popup 陈列版本、日期和按组件分组的改动；打开时刷新共享云公告 | 共享环境 `poemcoder-1gkbkid139b08f45`，集合 `pui_updatelog`；失败时回退缓存/包内内容 |
| 用户私隐协议 | `wx.openPrivacyContract` | 依赖当前微信基础库与小程序隐私配置 |
| 关于诗上 | `wx.navigateToMiniProgram` 打开正式版 `wxa1b9a4d6549c6cd1` | 失败由平台回调显示 PUI Toast |
| 联系客服 / 外观 | Navbar 左侧唯一 Slot 中的双 PUI IconButton：客服以 `open-type="contact"` 打开微信客服会话，菜单打开共享外观 Popup | 客服依赖小程序后台配置；外观恢复调用共享 Store，不复制页面私有配置 |

## 4. 身份与存储边界

- `miniprogram/common/utils/user-profile.js` 已删除；页面 JS 不再包含昵称状态、恢复、校验、保存或 Avatar 文本派生。
- 页面 JSON 不注册 Avatar 或 Input；Card 只注册并用于组件状态仪表盘，WXML 不保留隐藏资料节点。
- 历史 `poemui-user-profile` 本地值不再读取；本次不主动清理用户设备存储。
- 后续若引入登录，必须建立独立服务端身份合同，不能恢复页面本地昵称 Store 冒充认证。

## 5. H5 同步边界

“我的”是示例小程序应用页面，不作为官网组件目录或 PreviewDevice 路由。H5 同步的是它当前消费的 Card、AreaChart、Button、Cell/CellGroup、Dialog、Popup、Tag、Icon、TopLoading、Toast、Navbar、ScrollArea、Tabbar 与 ConfigProvider 既有组件合同；不得为该页面再维护一套 H5 业务壳或伪造组件统计、头像昵称、微信隐私合同、WebView 或跨小程序跳转。商业授权信息的 H5 真相源就是生产落地页 `https://poemcoder.com/poem-ui`。

更新公告和外观 Popup 继续消费 Popup、Tag、Icon、TopLoading、Button 与 AppearanceSettings 的既有双端合同，但官网不复制该业务页；Navbar 最左侧双操作 Slot 的 `extra-small/text/transparent/circle/iconOnly` 几何继续由 Navbar/Button 双端合同覆盖，微信 `open-type="contact"` 不在 H5 伪造成功。多小程序共享公告的后端边界见 `docs/SHARED_MINIPROGRAM_CLOUD_SERVICE.md`。

## 6. 验收

```sh
node scripts/test-miniprogram-me-page.js
node scripts/test-miniprogram-tabbar-pages.js
node scripts/test-miniprogram-home.js
npm run check
```

开发者工具需使用 390×844 验证头像、昵称和本地资料入口不存在；Navbar 左侧客服与菜单两个圆形操作完整命中，菜单打开首页同源外观 Popup，重置和关闭真实回写；仪表盘没有旧版头文案，图表上方同一行完整显示 `74 / 组件`、`562 / 样式`、`8 / 高级`，唯一 AreaChart 的横轴为 `0.1.0 / 0.1.2`、同一 Blue 系列为 `71 / 74`、入场时长为真实 `1000ms`、圆点与低对比网格可见，并且不存在 BarChart、分类展开按钮、嵌套 Surface 或虚构数据点。服务列表必须在标准 `section-gap` 后紧跟仪表盘，不得再次被推到底部；内容超过可用高度时由页面唯一 ScrollArea 滚动。五个服务 Cell、商业授权 Dialog 的取消/确认/失败恢复、WebView 页面、更新公告 Popup、外观 Popup、Tabbar，以及浅色/深色和外观组合均保持可用。客服会话、隐私合同、WebView 业务域名、跨小程序跳转、读屏、系统低动效与 iOS/Android 真机必须单独验证；模拟器、Node 测试或编译成功不能替代真机。

2026-07-27 至 2026-07-28 的头像昵称排版截图只保留为历史证据；用户随后明确判定该页不是用户中心，所有资料版头规则已由 `PUI-FB-0459` 取代。

同日更新公告完成独立滚动验收：390px 模拟器中的 PUI ScrollArea 为 `336×553px`，即当前视口 `78vh`；运行态临时追加第二条长公告并受控滚至 `scrollTop=700` 后，Header 保持顶部，Footer Button 的几何在滚动前后均为 `left=27 / top=772 / 336×45px`。临时公告已通过真实云端刷新移除，页面恢复 `announcementSource=cloud` 的唯一正式公告。

2026-07-28 已为当前工作树版本 `0.1.1` 编写并实装更新公告：写前以 `version=v0.1.1` 查询为 0 条，随后向生产共享环境的 `pui_updatelog` 插入唯一 `_id=pui-v0-1-1-20260728`。本轮没有插入第二条同版本公告，而是把包内 fallback 与生产共享云的同一稳定文档共同压缩为“高级图表 / 导航 / 表单 / 展示与反馈 / 小程序”五组；写入请求 `8f382a5a-978d-40b7-b244-7989f586fce8` 修改 1 条，写后回读请求 `e7d485f7-6b24-4a70-af42-a78d0af92fb2` 返回 `total=1`。小程序 `390×844` 重新编译后真实回读 `latestAnnouncementVersion=v0.1.1 / announcementSource=cloud / announcementSyncError=''` 与五组新文案；Popup 首屏见 `/tmp/poemui-me-v011-announcement-compact-390.png`，受控滚至 `700` 后 Footer 仍为 `left=27 / top=772`，见 `/tmp/poemui-me-v011-announcement-scroll-390.png`。最新写后回读证据保存在 `.audit/cloud/pui-updatelog-v0.1.1-readback.json`。这证明共享云公告已实装，不代表 `0.1.1` 已发布到 npm Registry。

2026-07-28 商业授权链完成代码与 390px 运行态复核：点击入口后受控 PUI Dialog 正确显示“取消 / 前往查看”，确认后真实进入 `pages/license/index`，页面 data 固定为 `https://poemcoder.com/poem-ui`。当前 AppID 的 WebView 随后被微信拒绝并触发“页面打开失败 / 复制链接”恢复框，截图为 `/tmp/poemui-license-dialog-390.png` 与 `/tmp/poemui-license-webview-390.png`。这证明页面路由和失败闭环有效，但不证明生产网页已可在小程序内打开；仍需在微信公众平台确认当前账号不是个人类型，并把 `poemcoder.com` 配置为业务域名后复测真机。

2026-07-29 发布口径更新：生成器从组件 metadata 得出 `规范 1 / 基础 3 / 布局 5 / 导航 9 / 表单 19 / 数据展示 14 / 反馈 9 / 浮层 6 / 高级 8`，合计 74。`metadata/component-release-deltas.js` 以不可变的公共 `0.1.0` 发布快照提交 `8a52d10` 为前序，声明 `0.1.2` 新增 `area-chart / bar-chart / waffle`，所以生成结果为 `71 → 74 / +3`；没有把未曾发布到 Registry 的 `0.1.1` 伪装成公开版本点。分类明细继续供目录生成和 BarChart 独立页使用；当前 Me 页只消费前序/当前版本及总量，不再合并、排序或折叠分类。该统计只描述目录数量与已声明的版本差集，不宣称运行健康度、使用量或云端监控。

首次接入时的九类 BarChart Card 与后续四类折叠/八类展开方案均只作为历史证据，截图 `/tmp/poemui-me-bar-chart-390.png`、`/tmp/poemui-me-bar-chart-dark-390.png` 与 `/tmp/poemui-me-v011-delta-collapsed-390.png` 不代表当前实现。2026-07-28 用户最终要求 Me 页改用 AreaChart；当前合同因此收敛为唯一 `71 → 74` 版本趋势、无重复标题、无分类展开操作。最终 390×844 几何、截图、滚动与微信 npm 构建结果以本轮最新验收记录为准；这些仍是模拟器证据，不替代 iOS/Android 真机。

2026-07-28 用户进一步移除 Card description 版头，并要求把组件、样式、高级三项真实数量放到图表上方。当前页面从 `component-status.js` 读取 `74 / 8`，从 `style-utilities-catalog.js` 读取 `562`，三列透明编排不增加第二层 Surface；0.1.2 发布时横轴标签固定为 `0.1.0 / 0.1.2`。该消费层优化不修改 Card 或 AreaChart 公共 API，Ledger 为 `PUI-FB-0488`。

2026-07-29 为 0.1.2 新增稳定公告 `_id=pui-v0-1-2-20260729`。包内 fallback 与生产共享云使用同一字段结构，五组内容为“高级图表 / 导航与表单 / 展示与反馈 / 浮层 / 小程序”；云端必须先按 `_id` 查重，再插入或更新，并在写后回读唯一文档。0.1.0 与此前 0.1.1 公告继续作为历史记录保留，最新 Cell 由日期排序选择 0.1.2。

同日继续按用户反馈延长动画并上提服务集合：Me 页通过 AreaChart 公开 Prop 显式传入 `duration=1000`，微信 390×844 运行树实际输出 `--pui-chart-duration:1000ms`；共享组件默认仍为 500ms，系统低动效仍压缩为 1ms。服务 CellGroup 删除 `margin-top:auto` 后，仪表盘实测 `left=14 / top=101 / 362×224px`，服务集合为 `left=14 / top=343 / 362×272px`，两者实际保持唯一 `18px` 的 `--pui-section-gap`。浅色与深色果味截图分别为 `/tmp/poemui-me-duration-layout-light-390.png`、`/tmp/poemui-me-duration-layout-dark-fruity-390.png`；这些仍是开发者工具证据，真机为 `pending-device`。

同轮微信开发者工具 390×844 浅色实测 Card 为 `left=14 / top=101 / 362×224px`，摘要行为 `left=25 / top=112 / 340×49px`，AreaChart 为 `left=25 / top=169 / 340×145px`；三列与横轴完整可见，截图 `/tmp/poemui-me-metrics-light-390.png`。深色果味根类真实进入 `theme-dark / frost-on / shadow-on / radius-large / border-off`，截图 `/tmp/poemui-me-metrics-dark-fruity-390.png`；验收后已恢复浅色默认。外观 Popup 打开时 Canvas 节点退出而摘要行保留，关闭后图表恢复。模拟器通过不替代 iOS/Android 真机，后者继续 `pending-device`。
