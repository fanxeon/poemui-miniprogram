# PoemUI Icons

PoemUI 图标采用 `PoemUI Roundline` 风格。当前 220 个图标保留稳定的 PoemUI 名称、私有码点和 17 类目录：其中 219 个以 Lucide 的成熟构形和语义为底稿，统一调整圆线权重与光学细节；`poemcoder-mark` 是用户自有公司字标的登记轮廓，不属于 Lucide 派生资产。`premium` 是稳定公开语义名，映射既有 Lucide `crown` 的同一码点。

## 风格规则

1. 画布统一为 `24 x 24`。
2. 默认使用 `fill="none"` 和 `stroke="currentColor"`。
3. 主线宽统一为 `2.15`，兼顾小程序小尺寸清晰度和 iOS 风格的柔和重量。
4. 线端和转角统一使用 `round`。
5. 图标优先保证 20rpx 到 56rpx 下清晰，不能依赖复杂细节。
6. 视觉重心略向内收，避免贴边和小程序字体化后发虚。
7. 状态图标使用外框形态，操作图标使用开放形态。
8. 不再允许分类模板或通用图形兜底；每个 PoemUI 名称必须映射到明确的 Lucide 来源或经品牌合同登记的自有轮廓。
9. 圆环、头像头部和轨道节点等闭口圆形默认镂空；只有省略号、Radio 中心点、锚点等几何上属于点的微小圆保持实心。

## 来源与派生

生成脚本读取 `lucide-static/icon-nodes.json`，而不是抓取网页 SVG。每个图标在 `manifest.json` 中记录 `source`，生成的 SVG 顶部也保留来源注释。

- 上游：Lucide
- 开发依赖：`lucide-static@1.24.0`
- Lucide 许可：ISC
- Feather 派生部分：MIT
- 完整许可文本：`THIRD_PARTY_NOTICES.md`

PoemUI 的派生调整包括统一 2.15px 线宽、圆端点与圆连接、稳定的公开命名，以及 `caret`、`file-pdf` 等少量图标的光学或语义细化。

`poemcoder-mark` 的 `source` 固定为 `user-owned:poemcoder-mark`。它由用户提供的公司 Logo 位图提炼为五段闭合矢量轮廓，只复用本项目的生成与字体工具链，不受 Lucide 许可覆盖。

## 分类目录

源文件位于 `assets/icons-src/`，按照接近 TDesign 图标站的信息架构分成 17 类，共 220 个：

- `navigation`：方向、返回、菜单、页面切换
- `action`：新增、删除、复制、刷新、分享等高频命令
- `editing`：文本、排版、撤销、格式化
- `status`：成功、失败、警告、提示、加载
- `form`：输入、搜索、筛选、可见性、选择
- `file`：文件、文件夹、附件、归档
- `media`：图片、音视频、播放控制
- `communication`：消息、通知、邮件、电话
- `user`：账户、团队、身份、收藏
- `commerce`：购物、订单、支付、票券
- `device`：终端、网络、电量、打印
- `chart`：数据、趋势、统计、仪表盘
- `map`：位置、路线、地点、出行
- `development`：代码、接口、分支、终端、数据库
- `layout`：组件、容器、栅格、面板
- `components`：需要 PoemUI 专属几何的组件图形；包含 `button`、`divider`、`icon`、`popup`、`popover`、`sheet`、`action-sheet`、`dropdown-menu`、`overlay`、`badge`、`cell`、`swipe-cell`、`scroll-area`、`dialog`

组件分类采用减线几何：每枚最多 3 个可见图元，只保留组件主轮廓和必要的语义锚点。首轮“视口 + 面板 + 多行内容”的说明图式方案已被用户否决，不属于当前合同。Popup 以竖向手机轮廓作为后层，并由右下方较小的方形卡片覆盖手机下部；被卡片遮挡的手机右边与底边主动中断，不画穿透线。Popover 以尖角连接真实锚点，Sheet/ActionSheet 通过同一底部面板内是否存在操作行区分，Overlay 只表达覆盖框与透明焦点区。Badge 只表达宿主与右上角标；Cell 与 SwipeCell 共享单行外壳，分别使用右 Chevron、动作分隔与左滑 Chevron；ScrollArea 只留内容线和滚动条；Dialog 只留视口、居中对话框和标题线。

组件目录不等于专属图标待办清单。语义已清楚且不会和相邻目录冲突时直接复用现有图标：Avatar/Card/Image/List/Collapse/Collapsible/Bubble/CountDown/Table 使用 `user/panel-top/image/list-bullet/rows/chevron-down/message/clock/table`。缺少通用名称但 Lucide 已有成熟构形时只增加直接来源：Tag → `tag`、Swiper → `gallery-horizontal`、Direction → `arrow-left-right`。只有 Badge、Cell、SwipeCell、ScrollArea、Dialog 进入 `opticalAdjustments` 的专属几何。
- `abstract`：智能、Codex、灵感、玻璃、品牌氛围；`codex` 使用清晰的小尺寸 Bot 构形表达 AI 编程入口，`poemcoder-mark` 是用户自有公司字标

完整清单由 `assets/icons-src/manifest.json` 维护，不在文档中手工重复。

## 命名规则

- 使用小写 kebab-case。
- 方向放在后面，例如 `chevron-right`、`arrow-left`。
- 状态外框使用后缀，例如 `success-circle`、`warning-triangle`。
- 避免业务词，例如不要把 `home` 命名为 `dashboard-home`。

## 跨端组件

`pui-icon` 将全部 220 个 `name` 映射为同一份本地 Icon Font 字形，不依赖远程字体或 CDN。小程序通过 `icon/icon-font-map.js` 解析字形，Icon 资源页读取 `icon/icon-font-catalog.js`；H5 从生成目录读取相同 `codepoint` 并加载与小程序逐字节一致的字体 CSS：

```xml
<pui-icon name="check" size="36" />
<pui-icon name="close" size="32" color="var(--pui-text-secondary)" />
<pui-icon name="poemcoder-mark" size="56" aria-label="PoemCoder 公司标记" />
```

1. 运行 `npm run icons:generate` 会从锁定版本的 Lucide 节点与登记的 `poemcoder-mark` 自有轮廓同步生成 220 个 SVG、`manifest.json`、不含 SVG body/path 的官网字体目录、`icon/icon-font-map.js`、`icon/icon-font-catalog.js`、`icon/icon-font.wxss`、`preview/icon-font.css` 与 `assets/component-icons-preview.svg`。
2. 生成器将 24×24 的 2.15/1.35 圆头描边纯矢量展开为封闭轮廓，再生成 1024 UPM 的本地 WOFF2；字体使用 nonzero 轮廓方向保留闭口圆形内腔，不会把小图栅格化后再描摹。
3. `assets/icon-codepoints.json` 是稳定码点登记表：现有名称保持 Unicode Private Use Area 码点不变，新增名称只从 `nextCodepoint` 继续分配，禁止因排序改变既有字形。
4. `name` 只解析字体字形。未传 `color` 时继承主题文字色，传入实体色或 `var(--pui-*)` 时通过 `currentColor` 生效。
5. 字体映射失败会触发真实 `error`；name 映射成功发出 `{ name, source: "font" }`。业务图片或多彩图形必须使用 `pui-image`。

## 小程序兼容原则

内置 glyph 不能依赖远程字体 CDN。发布包必须包含生成的 `icon-font.wxss`、字体映射、字体目录和稳定码点表；H5 必须加载同一 data URI。运行时禁止 `icon-map.js`、inline SVG、CSS mask/image、小程序 SVG DOM 和 Canvas 图标分支。

## 质量门禁

`npm run check` 会验证数量、分类、磁盘文件、组件映射、稳定码点唯一性、WOFF2 头/字节数/SHA256、Lucide 或自有来源、上游版本、SVG 来源注释、Roundline 样式、`poemcoder-mark` 五段闭合轮廓，以及 59 个镂空圆和 25 个语义实心点的轮廓拓扑。升级 `lucide-static` 或轮廓工具后必须重新生成，并完成字体字形与 SVG 对照、H5、微信开发者工具桌面端与 390px 视觉验收。
