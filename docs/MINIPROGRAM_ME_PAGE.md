# PoemUI 小程序“我的”页合同

本文约束示例小程序一级目的地 `pages/me/index`。它是 PoemUI 组件的真实消费页面，不是新的 npm 组件，也不复制到官网标准组件预览。

## 1. 页面目标

- 该一级目的地不是用户中心，不展示头像、昵称或其他本地身份资料，也不提供资料编辑与持久化。
- 页面只保留真实组件状态、服务与信息入口。正文以实测 `contentHeight` 作为最小高度；服务 CellGroup 在正常文档流中紧跟仪表盘，并由父级唯一 `--pui-section-gap` 保留较大的分区间距，不再用 `margin-top:auto` 把空白塞在两个 Surface 之间。内容超过可用高度时仍由页面唯一 ScrollArea 正常滚动。
- 服务列表上方使用一张 PUI Card 组合透明四列数据摘要与一个全宽 PUI BarChart。组件、高级和本版新增数量来自 `scripts/generate-catalog.js` 生成的 `miniprogram/common/data/component-status.js`；样式数量直接读取同一生成链产出的 `miniprogram/common/data/style-utilities-catalog.js`。页面依次显示“组件 / 样式 / 高级 / 新增”与当前真实数量；BarChart 从公告 Schema v2 的固定 `categoryCounts` 快照读取数据，先按日期、再按语义版本从旧到新为每个有效公告版本建立独立 segment 与稳定颜色。`getting-started / 规范` 只在 Me 图表展示层过滤，公告九类 Schema、合计校验和组件总数不变。0.1.4 工作树显示 `v0.1.0 / v0.1.1 / v0.1.2 / v0.1.3 / v0.1.4` 五种颜色，高级类真实增量为 `5 + 3 + 0 + 0 + 4 = 12`，顶部“新增”为 `4`；历史公告不得动态读取当前分类值而篡改旧版本。
- 页面不展示、读取、缓存或复制 OpenID，也不读取历史 `poemui-user-profile` 本地键。旧本地值不主动删除，但已没有代码消费者。
- “更新公告”从诗上共享云环境的 `pui_updatelog` 读取并打开受控 PUI Popup；每条 Schema v2 公告必须包含 `componentCount` 与九项 `categoryCounts`，这些字段用于 BarChart 计算和一致性校验，不在公告 Popup 内重复展示。Popup 只呈现版本、日期、摘要与组件改动；云端失败时依次回退缓存和包内同形公告，来源不得伪装。

## 2. PUI 组合

页面根使用 `pui-config-provider use-global-config`，结构固定为非 fixed PUI Navbar、唯一 PUI ScrollArea 与 `fixed=true / placeholder=false` PUI Tabbar。ScrollArea 首帧高度由发布包 `common/utils/tabbar-page-layout` 同步扣除 Navbar、Tabbar 与底部安全区，页面不再通过 SelectorQuery 二次测量底栏。示例 App 在启动、重新进入前台和系统主题变化时通过唯一 `visualConfig` Store 同步当前系统 light/dark，AppearanceSettings 的深色开关因此与页面实际主题一致；页面不得复制私有 theme 状态。当前正文组合：

- `pui-card + 透明四列摘要 + pui-bar-chart + pui-tag`：唯一仪表盘 Surface。Card 不显示标题或 description；Content 顶部使用同一行四等分透明数据块，依次以较强数字和次级标签展示“74 / 组件”“562 / 样式”“8 / 高级”“3 / 新增”，四项均在运行时读取生成型真相源。BarChart 使用 `horizontal + stacked + small`，每一类别按公告时间轴生成 `version-0...n` 分段；`max=19`、`duration=1000`，只显示每行 Value。页面不传默认即为 false 的 Grid，并显式传 `showLegend=false` 关闭默认即为 true 的 Legend；顶部不再显示 `0 / max` 刻度，底部不再使用圆点/色块加文字的默认标识。
- BarChart 根自身 `width:100%`，随 Card Content 占满可用宽度；页面不得用私有 CSS 穿透或修改共享组件几何。每个有效版本使用稳定主题序列 `blue → teal → violet → amber → pink → neutral`，版本超过六个时才循环；当前三个版本分别使用 Blue/Teal/Violet。页面在图表 viewport 外组合真实 `size=small / shape=round` PUI Tag，文字消费对应 `--pui-chart-accent-*`，背景使用同色 `--pui-color-*-soft` 纯色 Surface，并显式移除默认 inset 框；Tag 只显示版本号，不使用 Chart 渐变。云端公告真实加载后必须按日期重算 items、max、版本 Tag 与 ariaLabel；后续版本不能被合并进“最新增量”。若公告统计不可用，才回退生成型 `component-status.js`。
- `规范` 不进入可见图表；其余八个业务类别先按“是否存在基线之后的正增量”稳定分组，有新增的类别置顶，同组继续保持公告原顺序。当前只有“高级”新增 `3`，因此默认四类为“高级 / 基础 / 布局 / 导航”；透明 small PUI Button 提供“查看更多 / 收起”。页面先保留完整条目并测量 BarChart 真实高度，再以 `--pui-duration-normal / --pui-ease-standard` 过渡 viewport 高度；收起结束后才卸载后四类，低动效为 `1ms`。这是消费者编排，不新增 BarChart Prop/Event/Method。
- 四列摘要只是 Card Content 内的页面编排，不建立第二个 Card、边框、背景、阴影或毛玻璃；数值使用 PUI title Token 与等宽数字，标签使用 PUI body-small/secondary Token。第四列在“新增”标签右侧组合 `20rpx` 的 PUI `sparkles` Icon，以最新版本 Violet accent 提示“新增”，Icon 为装饰语义，完整读屏名仍由数据块父级提供。四列 Grid 的列间距消费 `--pui-content-gap`，数值与标签消费 `--pui-space-xs`，“新增”与 Icon 消费更紧密的 `--pui-space-xxs`；摘要→图表、图表 viewport→版本 Tag、版本 Tag→展开操作均使用 `--pui-content-gap`，摘要自身不得再叠加 `margin-bottom`。八个类别 label、只含纯版本号的无框最小 PUI Tag、每行总值和完整 `ariaLabel` 共同表达当前规模、版本和折叠状态；Tag 不附加“已有 / 新增”，0 增量不得被伪造成增长。
- `pui-cell-group + pui-cell`：授权、订单、更新公告、隐私协议与关于诗上五个服务入口；服务区在正常文档流中直接跟随仪表盘，二者只由父级标准 `--pui-section-gap` 分隔，不额外叠加 margin 或第二层容器。
- Navbar `left` Slot：使用共享 Flex/紧密 gap 组合两个 `extra-small + text + transparent + circle + iconOnly` PUI Button。第一项 `comment + open-type="contact"` 真实交给微信客服会话能力，平台失败通过 Button `error` 事件进入 PUI Toast；第二项 `menu` 打开与首页同源的外观 Popup。两项都由 `capsule=true` 的左侧胶囊镜像轨定位，右 Slot 保持为空，不增加页面私有偏移、底色、边框、外投影或悬浮入口。
- `pui-dialog`：点击“高级版商业授权”先打开受控访问方式框，明确提示“桌面端浏览体验更佳”。Footer 使用 Dialog `actions` 组合“复制链接 / 直接访问”两个真实 PUI Button：复制调用 `wx.setClipboardData` 写入固定生产 URL，成功才关闭 Dialog，失败保留重试；直接访问调用 `wx.navigateTo` 进入注册在 `app.json` 的授权 WebView 页面。导航进行中两个动作同时 disabled，直接访问动作 loading；导航失败恢复双动作，Close 只回写 `visible=false`。
- `pui-popup + pui-scroll-area + pui-tag + pui-icon + pui-top-loading + pui-button`：公告 Header、`height=auto / maxHeight=60vh` 的唯一有界滚动内容区、组件改动层级、Surface 顶边同步状态与全宽 Footer。Popup 外层只设置扣除实测 Navbar 后的 `max-height`，不再固定成近全屏高度；短公告自然收紧，长公告超过 60vh 后才滚动。Popup 不直接渲染 `componentCount/categoryCounts`，避免和仪表盘图表重复；字段仍由 Service 校验并供图表消费。Popup 必须设 `contentScrollable=false`，避免与内部 ScrollArea 竞争滚动。TopLoading 必须通过 Popup `surface-top` Slot 贴住面板顶边，不能放进 Content；它只在请求开始时进入 `loading`，真实云端成功后进入 `success`，缓存、本地回退或异常直接回到 `idle`。
- `pui-popup + appearance-settings`：Navbar 菜单打开与首页一致的 Bottom Card 外观面板，Header 左侧使用 primary 圆形 Refresh PUI Button 调用共享 `visualConfig.reset()` 并同步关闭页面渐变，右侧沿用 Popup 默认 Close；正文只挂共享 `appearance-settings`，不复制第二套开关或配置 Store。外观 Popup 与公告 Popup 互斥。
- `pui-toast`：只反馈真实平台回调、输入错误或明确的未开放状态。

页面不得手写原生 Button/Input、第二个 ScrollArea、独立图标字符或重复的 Tabbar 占位壳。当前页面不得重新注册或渲染 Avatar、Input 或身份资料 Card；允许的唯一 Card 是组件状态仪表盘 Surface。Button、Cell 与透明 BarChart 不获得页面私有阴影。

## 3. 服务入口

| Cell | 真实动作 | 当前边界 |
| --- | --- | --- |
| 高级版商业授权 | Cell 显示“查阅详情”；点击打开受控 PUI Dialog，提示桌面端浏览体验更佳。用户可复制固定 `https://poemcoder.com/poem-ui`，或选择“直接访问”通过 `wx.navigateTo` 进入 `pages/license/index`，由微信 `<web-view>` 加载同一地址 | 只提供真实授权信息入口，不创建支付或订单；生产小程序主体/类目必须支持 WebView，并在后台把 `poemcoder.com` 配置为业务域名 |
| 我的订单 | PUI Toast 提示“订单服务尚未开放” | 没有订单数据源，不创建假列表或假路由 |
| 更新公告 | 受控 PUI Popup 陈列版本、日期和按组件分组的改动；打开时刷新共享云公告。统计字段不在 Popup 直接展示，只驱动仪表盘 BarChart | 共享环境 `poemcoder-1gkbkid139b08f45`，集合 `pui_updatelog`；失败时回退缓存/包内内容 |
| 用户私隐协议 | `wx.openPrivacyContract` | 依赖当前微信基础库与小程序隐私配置 |
| 关于诗上 | `wx.navigateToMiniProgram` 打开正式版 `wxa1b9a4d6549c6cd1` | 失败由平台回调显示 PUI Toast |
| 联系客服 / 外观 | Navbar 左侧唯一 Slot 中的双 PUI IconButton：客服以 `open-type="contact"` 打开微信客服会话，菜单打开共享外观 Popup | 客服依赖小程序后台配置；外观恢复调用共享 Store，不复制页面私有配置 |

## 4. 身份与存储边界

- `miniprogram/common/utils/user-profile.js` 已删除；页面 JS 不再包含昵称状态、恢复、校验、保存或 Avatar 文本派生。
- 页面 JSON 不注册 Avatar 或 Input；Card 只注册并用于组件状态仪表盘，WXML 不保留隐藏资料节点。
- 历史 `poemui-user-profile` 本地值不再读取；本次不主动清理用户设备存储。
- 后续若引入登录，必须建立独立服务端身份合同，不能恢复页面本地昵称 Store 冒充认证。

## 5. H5 同步边界

“我的”是示例小程序应用页面，不作为官网组件目录或 PreviewDevice 路由。H5 同步的是它当前消费的 Card、BarChart、Button、Cell/CellGroup、Dialog、Popup、Tag、Icon、TopLoading、Toast、Navbar、ScrollArea、Tabbar 与 ConfigProvider 既有组件合同；不得为该页面再维护一套 H5 业务壳或伪造组件统计、头像昵称、微信隐私合同、WebView 或跨小程序跳转。Me 的八类过滤、逐版本分段和展开/收起都属于小程序业务页面，不复制到 H5；BarChart 公共镜像的 `0.04 → 0.42 + 实体终点线` 必须在最终汇总同步 `preview/styles.css` 的浅深六色横纵 Token 与 segment 样式，并做 390px 浅深色测试。商业授权信息的 H5 真相源就是生产落地页 `https://poemcoder.com/poem-ui`。

更新公告内容是明确的跨端例外：官网新增独立文档路由 `#/updates`，而不是复制 Me 页面或把公告塞回 Popup。Topbar 中 PoemUI 名称后的版本号必须由共享 `buttonSample` 渲染为低存在感 PUI Button，点击进入该路由；页面以一个连续 Surface 按版本陈列组件级改动，不建立逐条 Card。`scripts/generate-release-notes.js` 从 `miniprogram/common/services/update-announcements.js` 的包内同形公告生成 `preview/release-notes-data.js`，站点构建必须刷新该文件，因此 H5 与小程序 fallback 共用一份内容真相。H5 不调用 `wx.cloud.Cloud`、不读取小程序缓存，也不得把生成型镜像描述成浏览器实时云查询；生产云的最终完整文档以 `docs/evidence/cloud/pui-updatelog-v0.1.4-readback.json` 为可版本化写后回读证据，本机原始副本继续保存在 `.audit/cloud/`。Navbar 最左侧双操作 Slot 的 `extra-small/text/transparent/circle/iconOnly` 几何继续由 Navbar/Button 双端合同覆盖，微信 `open-type="contact"` 不在 H5 伪造成功。多小程序共享公告的后端边界见 `docs/SHARED_MINIPROGRAM_CLOUD_SERVICE.md`。

## 6. 验收

```sh
node scripts/test-miniprogram-me-page.js
node scripts/test-miniprogram-tabbar-pages.js
node scripts/test-miniprogram-home.js
npm run check
```

开发者工具需使用 390×844 验证头像、昵称和本地资料入口不存在；Navbar 左侧客服与菜单两个圆形操作完整命中，菜单打开首页同源外观 Popup，重置和关闭真实回写；仪表盘没有旧版头文案，图表上方同一行完整显示 `74 / 组件`、`562 / 样式`、`8 / 高级`、`3 / 新增 + sparkles`，四列与图表之间只存在父布局的单个 `content-gap`。唯一 BarChart 默认显示“高级 / 基础 / 布局 / 导航”，没有“规范”和顶部 `0 / 19` 刻度，也没有组件默认圆点图例；底部以三个无框、同色 soft 纯色底的最小圆角 PUI Tag 只标注 `v0.1.0 / v0.1.1 / v0.1.2`，不出现渐变、“已有 / 新增”。图表 viewport→Tag 与 Tag→操作也必须各自只有一个 `content-gap`。实点“查看更多”后平滑展开全部八类，实点“收起”后平滑恢复四类；高级行为 `5 + 3 + 0 = 8`，其余版本增量为 0，0 值不得获得假宽度。根宽等于 Card Content 可用宽度，且不存在 Waffle、AreaChart、嵌套 Surface 或 BarChart 业务 API。打开公告 Popup 时不出现组件总数或九类统计块，BarChart 继续保留且不得越过浮层；服务列表必须在标准 `section-gap` 后紧跟仪表盘，内容超过可用高度时由页面唯一 ScrollArea 滚动。五个服务 Cell、商业授权 Dialog 的 Close/复制链接/直接访问/失败恢复、WebView 页面、更新公告 Popup、外观 Popup、Tabbar，以及浅色/深色和外观组合均保持可用。客服会话、隐私合同、WebView 业务域名、跨小程序跳转、读屏、系统低动效与 iOS/Android 真机必须单独验证；模拟器、Node 测试或编译成功不能替代真机。

2026-07-27 至 2026-07-28 的头像昵称排版截图只保留为历史证据；用户随后明确判定该页不是用户中心，所有资料版头规则已由 `PUI-FB-0459` 取代。

同日更新公告曾完成固定 `78vh` 独立滚动验收：390px 模拟器中的 PUI ScrollArea 为 `336×553px`；运行态临时追加第二条长公告并受控滚至 `scrollTop=700` 后，Header 与 Footer 保持固定。该历史几何已在 2026-07-29 被有界自适应合同取代，不能继续作为当前 Popup 高度依据；新合同需以短内容自然高度、长内容 `60vh` 上限与固定 Footer 重新验收。

2026-07-28 已为当前工作树版本 `0.1.1` 编写并实装更新公告：写前以 `version=v0.1.1` 查询为 0 条，随后向生产共享环境的 `pui_updatelog` 插入唯一 `_id=pui-v0-1-1-20260728`。本轮没有插入第二条同版本公告，而是把包内 fallback 与生产共享云的同一稳定文档共同压缩为“高级图表 / 导航 / 表单 / 展示与反馈 / 小程序”五组；写入请求 `8f382a5a-978d-40b7-b244-7989f586fce8` 修改 1 条，写后回读请求 `e7d485f7-6b24-4a70-af42-a78d0af92fb2` 返回 `total=1`。小程序 `390×844` 重新编译后真实回读 `latestAnnouncementVersion=v0.1.1 / announcementSource=cloud / announcementSyncError=''` 与五组新文案；Popup 首屏见 `/tmp/poemui-me-v011-announcement-compact-390.png`，受控滚至 `700` 后 Footer 仍为 `left=27 / top=772`，见 `/tmp/poemui-me-v011-announcement-scroll-390.png`。最新写后回读证据保存在 `.audit/cloud/pui-updatelog-v0.1.1-readback.json`。这证明共享云公告已实装，不代表 `0.1.1` 已发布到 npm Registry。

2026-07-28 商业授权链完成代码与 390px 运行态复核：点击入口后受控 PUI Dialog 正确显示“取消 / 前往查看”，确认后真实进入 `pages/license/index`，页面 data 固定为 `https://poemcoder.com/poem-ui`。当前 AppID 的 WebView 随后被微信拒绝并触发“页面打开失败 / 复制链接”恢复框，截图为 `/tmp/poemui-license-dialog-390.png` 与 `/tmp/poemui-license-webview-390.png`。这证明页面路由和失败闭环有效，但不证明生产网页已可在小程序内打开；仍需在微信公众平台确认当前账号不是个人类型，并把 `poemcoder.com` 配置为业务域名后复测真机。

2026-07-29 发布口径更新的生成事实仍为：`规范 1 / 基础 3 / 布局 5 / 导航 9 / 表单 19 / 数据展示 14 / 反馈 9 / 浮层 6 / 高级 8`，合计 74。`metadata/component-release-deltas.js` 以不可变的公共 `0.1.0` 发布快照提交 `8a52d10` 为前序，声明 `0.1.2` 新增 `area-chart / bar-chart / waffle`，所以生成结果为 `71 → 74 / +3`。当时“Me 只消费前序/当前总量、不折叠分类”的页面结论已被后续逐版本 BarChart 决定取代；数据真相源本身没有改变。

首次接入时的九类 BarChart Card、两点/三点 AreaChart 与短暂试做的 Waffle 均只作为历史证据。曾经的“三点全宽 AreaChart、无分类展开”决定又被后续“按类别与增量使用 BarChart”取代；当前合同以本文第 1、2、6 节的八类逐版本 BarChart 与四/八类平滑折叠为准。

2026-07-28 用户进一步移除 Card description 版头，并要求把组件、样式、高级三项真实数量放到图表上方。当前页面从 `component-status.js` 读取 `74 / 8`，从 `style-utilities-catalog.js` 读取 `562`，三列透明编排不增加第二层 Surface；该数据摘要决定仍由 `PUI-FB-0488` 记录，最终图表类型与三版本语义由 `PUI-FB-0510` 承接。

2026-07-29 为 0.1.2 新增稳定公告 `_id=pui-v0-1-2-20260729`。包内 fallback 与生产共享云使用同一字段结构，五组内容为“高级图表 / 导航与表单 / 展示与反馈 / 浮层 / 小程序”；云端必须先按 `_id` 查重，再插入或更新，并在写后回读唯一文档。0.1.0 与此前 0.1.1 公告继续作为历史记录保留，最新 Cell 由日期排序选择 0.1.2。

同日按用户反馈把 AreaChart 延长到 `duration=1000` 并上提服务集合；当前三点 AreaChart 继续使用该页面层时长覆盖，共享默认仍是 500ms，系统低动效仍压缩为 1ms。服务 CellGroup 删除 `margin-top:auto` 的决定继续有效，仪表盘与服务集合仍只使用 `--pui-section-gap`。旧两点截图 `/tmp/poemui-me-duration-layout-light-390.png`、`/tmp/poemui-me-duration-layout-dark-fruity-390.png` 只作为历史几何证据。

同轮旧两点 AreaChart 的微信开发者工具截图 `/tmp/poemui-me-metrics-light-390.png`、`/tmp/poemui-me-metrics-dark-fruity-390.png` 只保留为历史证据。当前三点 AreaChart 已在 SDK 3.17.0 / iPhone 12/13 (Pro) / 390×844 实测：运行态为 `0.1.0=71 / 0.1.1=74 / 0.1.2=74`、`max=74`、`duration=1000`，图表根 `left=25/top=169/340×145` 与 Card Content 同宽；浅色截图 `/tmp/poemui-me-area-chart-three-versions-light-390.png`，深色果味截图 `/tmp/poemui-me-area-chart-three-versions-dark-fruity-390.png`。公告 Popup、商业授权 Dialog、外观 Popup 分别打开时 Canvas 节点均卸载，关闭后恢复；控制台过滤 `invalid page.json / enableShareTimeline / warning / error / exception / fail` 无命中。模拟器通过不替代 iOS/Android 真机，后者继续 `pending-device`。

2026-07-29 的 0.1.2 发布同步已完成共享云与微信体验版回读。生产环境 `poemcoder-1gkbkid139b08f45` 的 `pui_updatelog` 按稳定 `_id=pui-v0-1-2-20260729` 写入并回读为唯一记录，字段为 `version=v0.1.2 / date=2026-07-29 / status=published`，五组内容与包内 fallback 一致；审计副本见 `.audit/cloud/pui-updatelog-v0.1.2-readback.json`。本段中此前上传的两点 AreaChart 与随后未上传的三点 AreaChart 都只作历史发布证据；最新 BarChart 方案的体验版上传结果见本文末尾。iOS/Android 真机仍为 `pending-device`。

2026-07-30 已为 0.1.4 工作树写入生产共享云公告。写前 `version=v0.1.4` 查询为 0 条；写后稳定 `_id=pui-v0-1-4-20260730` 按 `version=v0.1.4 + status=published` 唯一命中 1 条，九类合计与 `componentCount=78` 一致，五项重点与包内 fallback/H5 生成页同形。Node SDK 首次误用 `set({data: document})` 产生了不符合客户端合同的嵌套字段，已立即在同一稳定 ID 上用 `set(document)` 完整覆盖，并按 `_id` 全文回读确认最终文档不存在残留嵌套；最终写入请求为 `19fb10c1be1_2`，可版本化证据见 `docs/evidence/cloud/pui-updatelog-v0.1.4-readback.json`，本机原始副本见 `.audit/cloud/`。公告的 `published` 只表示客户端可读取，不代表 `poemui-miniprogram@0.1.4` 已发布到 npm。

同日更新公告 Schema 升级为 v2：生产云的 `pui-v0-1-0-20260727 / pui-v0-1-1-20260728 / pui-v0-1-2-20260729` 均按稳定 ID 原位增加 `componentCount/categoryCounts`，写后回读全部为 `updated=1`、九类齐全且分类合计等于总数；审计副本见 `.audit/cloud/pui-updatelog-schema-v2-counts-readback.json`。微信开发者工具 SDK 3.17.0 / 390×844 真实回读 `source=cloud`，浅色首屏完整显示 `74` 与九类 `1/3/5/9/19/14/9/6/8`，滚至 `y=760` 后 Footer 仍固定 `left=27/top=772`，深色果味同样可读；截图为 `/tmp/poemui-me-announcement-counts-light-390.png`、`/tmp/poemui-me-announcement-counts-light-scroll-390.png`、`/tmp/poemui-me-announcement-counts-dark-fruity-390.png`。iOS/Android 真机继续 `pending-device`。

2026-07-29 最新用户决定取代上述“三点 AreaChart”和“Popup 可见统计区”历史方案：`componentCount/categoryCounts` 继续保留在 Schema v2、共享云、缓存和包内 fallback 中，但只作为一致性校验与仪表盘数据源；公告 Popup 不再展示总数或九类列表。Me 仪表盘改为全宽水平堆叠 PUI BarChart，为 `v0.1.0 / v0.1.1 / v0.1.2` 每个有效版本建立独立颜色，消费层隐藏“规范”，默认四类并可平滑展开全部八类。该变更不修改 BarChart 公共 API，也不复制 H5 Me 业务页；当前行为由 `PUI-FB-0513/0515` 约束，旧 AreaChart/Waffle 和九类两段 BarChart 记录只作历史追溯。

同轮微信开发者工具 SDK 3.17.0 / iPhone 12/13 (Pro) / 390×844 回读 `announcementSource=cloud / announcementSyncError=''`，BarChart 九类 items、`max=19` 与 aria 均正确；根几何为 `left=25/top=169/340×420`，与 Card Content 同宽。浅色截图为 `/tmp/poemui-me-category-increment-bar-light-390.png`，dark+shadow+frost+largeRadius 为 `/tmp/poemui-me-category-increment-bar-dark-fruity-390.png`。Popup 浅色与深色截图 `/tmp/poemui-me-announcement-no-counts-light-390.png`、`/tmp/poemui-me-announcement-no-counts-dark-fruity-390.png` 均无统计节点，并真实显示生产云的新 BarChart 说明；受控滚到 500 后 Footer 仍为 `left=27/top=772/336×45`。生产云按稳定 ID 原位更新，写后回读 requestId 为 `83f02eb5-1f14-4081-acec-f4fb6e15b785`；验收后恢复原空视觉存储与浅色默认。控制台过滤 warning/error/deprecated/getSystemInfoSync/invalid page.json/enableShareTimeline 无命中。模拟器证据不替代 iOS/Android 真机，后者继续 `pending-device`。

同日 13:26 通过微信开发者工具重新上传体验版 `2.1.0`。开发者工具后台日志记录 `startUploadTaskWithProxyFunc`、提交任务 `async_4625654498471067657`、`parseError 0ms` 与 `progressSuccess`，证明当前 BarChart、公告隐藏统计区和首页 JSON 修复已进入新的体验版代码包；这不等于 npm、Git、H5 或正式小程序发布。

2026-07-29 后续 BarChart 复看再次取代上述九类两段运行态：当前 Me 只显示八个业务类别，按公告日期为 `v0.1.0 / v0.1.1 / v0.1.2` 建立 Blue/Teal/Violet 分段，默认四类并可平滑展开八类。微信 SDK 3.17.0 / iPhone 12/13 (Pro) / 390×844 下折叠 Card 为 `362×332px`、图表 `340×210px`、服务区 `top=451px`，展开图表为 `340×378px`；受控慢速复核在 `210→378px` 中抓到 `341.875px` 中间高度，结束后恢复源码 500ms 与四类折叠态。浅色、深色果味截图见 `/tmp/poemui-me-bar-version-collapsed-light-390.png`、`/tmp/poemui-me-bar-version-expanded-light-390-v2.png`、`/tmp/poemui-me-bar-version-collapsed-dark-fruity-390.png`、`/tmp/poemui-me-bar-version-expanded-dark-fruity-390.png`。生产共享云 0.1.2 说明仍是旧“九类/两段”文案；本地 fallback 已更新，本轮遵守逐组件规则没有远端写入或重传体验版。

同轮页面级精简继续以当前用户决定取代旧图例呈现：Me 显式关闭 BarChart Legend，保持 Grid 默认关闭，在图表外组合三个 `size=small / shape=round` 的真实 PUI Tag 并用对应 Chart Token 上色；Tag 只显示版本号。分类按基线后是否有正增量稳定分组，当前折叠态为“高级 / 基础 / 布局 / 导航”。微信开发者工具 SDK 3.17.0 / iPhone 12/13 (Pro) / 390×844 实点完成四→八→四类，浅色与深色均无顶部 `0 / 19`、默认圆点图例或横向溢出；截图见 `/tmp/poemui-me-version-tags-light-collapsed-390.png`、`/tmp/poemui-me-version-tags-light-expanded-390.png`、`/tmp/poemui-me-version-tags-dark-collapsed-390.png`。Console 为 0 error；7 条 warning 来自基础库、既有安装产物、性能路径和开发者工具内部 preload，不归因于本轮 Me 页面改动。验收后恢复浅色和折叠态；iOS/Android 真机继续为 `pending-device`。

随后顶部摘要扩为四列并收口间距职责：第四项“新增”读取 `componentStatus.incrementTotal=3`，不写死展示值；摘要与图表共同进入透明 `dashboard-content`，由该父布局唯一消费 `--pui-content-gap`，摘要删除旧 `margin-bottom`。同一微信 390×844 环境实测摘要组/图表均宽 `340px`，四列各 `79px`、列间 `8px`，摘要 `bottom=161px`、图表 `top=169px`，两者间距正好 `8px`。浅色与深色截图为 `/tmp/poemui-me-four-metrics-light-390.png`、`/tmp/poemui-me-four-metrics-dark-390.png`；四列、版本 Tag、查看更多与服务列表均无裁切，验收后恢复浅色折叠态。Ledger 更新 `PUI-FB-0488`；iOS/Android 真机继续为 `pending-device`。

最后一轮页面级精修将三个版本 Tag 从 Chart 渐变改为 Blue/Teal/Violet 同色系 `--pui-color-*-soft` 纯色底，保留 accent 文字并以 `box-shadow:none` 去除默认 inset 框；共享 Tag 与 BarChart 默认/API 不变。随后按用户反馈把 `sparkles` 从数值 `3` 右侧移到“新增”标签右侧，并从 `28rpx` 缩小为 `20rpx`，标签与 Icon 使用 `--pui-space-xxs`。微信开发者工具 390×844 浅/深色折叠态截图更新为 `/tmp/poemui-me-label-icon-light-390.png`、`/tmp/poemui-me-label-icon-dark-390.png`；实测摘要→图表、图表 viewport→Tag、Tag→展开操作均为 `8px`，并实点完成展开→收起后恢复浅色折叠态。清空旧页面 Console 后单独 `reLaunch` Me 并等待 4 秒，结果为 `0 error / 4 warning`；四条分别是自动热重载、既有安装产物 Dialog/Navbar selector 与 IntersectionObserver 慢路径，不含本轮页面脚本异常。Ledger 更新 `PUI-FB-0488/PUI-FB-0513`；iOS/Android 真机继续为 `pending-device`。
