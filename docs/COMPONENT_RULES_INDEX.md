# PoemUI 本轮组件共用规则索引

本文是 2026-07-24 小程序组件展示、外观治理与跨端修复的统一追溯入口。它回答“本轮改过哪些组件、哪些规则可复用、原生与 H5 应如何同步、页面不得绕开什么边界”。

它**不取代**源码、组件专属合同、`docs/COMPONENT_API.md` 或 Feedback Ledger：发生冲突时，按“真实源码与专项测试 → 专属合同 → 原始 Ledger → 本索引”的顺序核对。本索引不重述完整 Props 表，只记录稳定的跨组件规则。

## 1. 使用与维护规则

1. 修改下表范围中的组件前，先读本索引对应行、组件专属合同和列出的 Ledger 原始 JSON；随后以源码和专项测试确认当前事实。
2. 同一规则影响小程序与 H5 时，必须同时修改原生组件、`preview/app.js`、`preview/styles.css`、合同、专项测试和分发产物；不得只修页面截图。
3. 页面只负责状态编排、路由和业务回写。任何改变 Button、Navbar、Overlay、Tabbar、Input、Popup 或全局外观几何/表面的规则，都必须回到组件或共享 Token 层。
4. 本轮新增或调整一条可复用规则时，更新此索引的对应条目；若它是新的独立决策或缺陷，同时新增/更新 Ledger 原始记录，随后运行 `npm run feedback:generate && npm run feedback:check`。
5. “已验证”仅指条目列明的测试、浏览器或开发者工具证据；真机未实际确认时必须保留在组件 Ledger 的 `deviceRisks`，不能由构建成功替代。

## 2. 跨端规则总表

| 范围 | 小程序组件级规则 | H5 同步规则 | 页面不得做什么 | 追溯 |
| --- | --- | --- | --- | --- |
| `Button` / `Icon` | `iconOnly` 根、图标区和 Icon 共用等尺寸居中轨；空文字不占 gap。`default + base` 是 muted 弱填充、保留中性边界、无外投影。`variant=transparent` 保留常规几何但无底色/边界/外投影；`surface=transparent` 仅用于复合容器且额外去圆角。 | 所有图标操作经 `iconButtonSample`，普通 Button 经 `buttonSample`；disabled、ARIA、透明面与图标居中必须镜像。 | 用 Emoji/裸 Button、页面私有负 margin、透明 Button 残留浏览器底色或用 Popup 私有 CSS 改关闭按钮。 | `BUTTON.md`；PUI-FB-0322、0324、0328。 |
| `Input` / `Textarea` / `Search` | 原生 focus 在真实 blur、显式 blur、disabled/readonly 或卸载前必须保持；组件同步不得把正在输入的 focus 写回 false。Input 主轨可伸缩，Clear/Loading/suffix/suffix-icon 共用贴右 Trailing；`suffix="slot"` 可组合一个紧凑 PUI IconButton。 | `inputControlSample` 与标准镜像输出同名 Trailing，覆盖 Clear + suffix 操作并存；重绘后恢复焦点/光标，禁止在父级手写 input 或在 Input 下方复制保存按钮。 | 为解决错位给 Search 写绝对定位；新增与 suffix 重复的 right/action Prop；或因 state 同步让输入一聚焦即失焦。 | `INPUT.md`、`TEXTAREA.md`、`SEARCH.md`；PUI-FB-0314、0319、0442。 |
| `Combobox` | 只管理选值与显隐；Panel 是默认 480rpx、160–800rpx 可调的固定视口，内部只有唯一选项滚动区。 | 搜索以独立 `pui-search` 组合，调用方过滤 `options` 后传入；H5 与小程序同用 `listHeight`。 | 在 Combobox 内恢复 Input/query/filter/create、内容测量、首开高度兜底，或把 Search 写成页面私有 input。 | `COMBOBOX.md`；PUI-FB-0354。 |
| `Navbar` | 页面顶部遵循真实胶囊几何；左右动作是独立 Button + Icon。双按钮事件直接公开为 `bind:leftBtn`、`bind:rightBtn`，不依赖 Slot 冒泡猜测来源。 | 双动作的 aria、可点击区域、深浅色与外观菜单入口同源；不把浏览器假胶囊当作小程序坐标。 | 在详情页复制一套 Navbar、穿透 Slot 监听，或用百分比轨道伪造胶囊布局。 | `NAVBAR.md`；PUI-FB-0291、0311、0325、0327、0329。 |
| `Tabbar` | 全部 item（包括 disabled 未激活项）使用透明 Button surface；仅激活项提供状态色。带文案项保留标准指示器位置；`label=''` 的纯图标项使用 `--pui-space-normal` 抬升短横。 | 每个 item 仍经 PUI Button 镜像；默认与 disabled 的背景、边界、阴影均透明。纯图标 H5 指示器与图标底部间距实测为 7px。 | 用首页样式给某一 tab 清底色，或用页面 margin 单独移动下划线。 | `TABBAR.md`；PUI-FB-0293、0303、0304、0308、0310、0313、0334。 |
| 一级 Tabbar 目的地与应用标识 | `item.icon/activeIcon` 必须来自当前 Icon manifest，再注册真实页面路由；Codex 目的地使用通用 `code`，其正文仅读取 `pui-codepage` 的 `product=poemui/pageKey=codex/status=published` page/skill 文档，页面不得维护安装或 Skill 文案回退。首页品牌名旁使用 PUI Tag 展示 `poemui-miniprogram/version` 轻量子入口；构建脚本从 `package.json.version` 生成该入口，禁止加载组件总入口或维护第二份版本字符串。账户页只保存昵称，不展示或读取 OpenID；低频客服入口使用 Navbar 最左侧 `left` Slot 内的 `text/transparent/small/circle/iconOnly` PUI Button，保留真实 `openType=contact` 和失败反馈，按钮不得显示灰底、边框或外投影。`capsule=true` 下右 Slot 不渲染，`leftBtn` 也不能替代需要平台开放能力的真实 Button。未交付能力明确禁用或提示，不提供假数据、假按钮或空白占位壳。 | Icon 生成链同步同名 glyph；小程序应用级目的地不伪造成 H5 组件预览，只同步它消费的 Navbar/Button 合同；微信客服会话不在浏览器伪造。 | 只换 items 字符串而不检查 Icon manifest；在页面硬编码版本或为版本加载组件总入口；将 draft/archived Skill 或包内内容伪装为云端发布；恢复 OpenID 本地兼容读取；给客服按钮增加灰色 Surface、把客服放进 capsule 模式的右 Slot、改成普通 `leftBtn` 点击、原生按钮、满宽主操作或遮挡内容的悬浮入口；保留语义过期空白路由；伪造支付、订单、SKILL 下载、复制或成功状态。 | `MINIPROGRAM_HOME.md`、`MINIPROGRAM_CODEX_PAGE.md`、`MINIPROGRAM_ME_PAGE.md`、`NAVBAR.md`、`TABBAR.md`；PUI-FB-0293、0339、0420、0421、0448、0451、0454。 |
| 应用级更新公告 | “更新公告”是我的页真实 Cell，点击打开受控 PUI Popup；Header 展示版本，Content 关闭 Popup 自滚动并由最大 `78vh` 的唯一 PUI ScrollArea 承担滚动，以 Tag + Icon 突出 `component/title/description`，Content 顶部使用受控 TopLoading 表达真实云请求，Footer 使用全宽 PUI Button。只有云端成功进入 success，缓存、本地回退或异常回到 idle。Service 通过独立 `wx.cloud.Cloud` 读取诗上共享环境 `pui_updatelog`，成功缓存，失败回退缓存/包内同形数据并保留来源。所有 PUI 云集合使用 `pui_` 前缀。 | H5 不复制应用业务页，但必须同步 Popup `contentScrollable` 与 ScrollArea 正 `vh` 高度合同，以及 Popup/Tag/Icon/TopLoading/Button 的组件镜像。多应用共享云服务时，同主体使用环境共享；跨主体使用独立 HTTPS/CloudBase HTTP 服务并按可信 AppID 鉴权。 | 同时启用 Popup Content 和内部 ScrollArea 两个纵向滚动所有者；在页面手写浮层或 Spinner；把缓存/包内回退说成云端成功；用无主次字符串替代组件改动；客户端携带管理员密钥。 | `MINIPROGRAM_ME_PAGE.md`、`SHARED_MINIPROGRAM_CLOUD_SERVICE.md`、`POPUP.md`、`SCROLL-AREA.md`、`TOP-LOADING.md`；PUI-FB-0421、0440、0447。 |
| `Icon` / 组件详情页 | Icon 是展示叶子，不因阴影/等距成为 Surface；资源网格中的图标放大两个 size，并在下方展示名称。语义别名若需要和特定文本场景做光学对齐，校正必须进入唯一图标生成链；`premium` 独立上移，通用 `crown` 不变。详情页复用共享 Navbar 与外观 Popup。 | 搜索、图标卡、复制反馈复用 Input/Button/Icon/Toast helper；名称、尺寸、轮廓光学校正和复制结果由同一 WOFF2/真实状态同步。 | 用页面 SVG 或文字图标绕过 `pui-icon`，将 Icon 卡变成独立阴影容器，复制详情页外观设置 WXML，或用页面 margin、定位、transform 二次修补字形基线。 | `ICON.md`；PUI-FB-0294、0306、0312、0320、0325、0449。 |
| `Popup` / 外观设置 | Popup 是唯一可见 Surface：Header/Content/Footer 同层；Content 是唯一滚动区，默认关闭按钮属于 Header。共享 `appearance-settings` 负责外观 Cell 列表，Popup 只负责浮层结构。`blurOverlay` 仍是 Popup 的独立遮罩 API。 | Popup 真正镜像 Header、唯一滚动区、遮罩、关闭与外观 Cell；开关不改变 Popup 几何。 | 在 CellGroup 外再套 Card/标题，复制首页和详情页两份外观 WXML，或把内容滚动放到 Popup 外。 | `POPUP.md`、`SPACING.md`；PUI-FB-0309、0316、0317、0320、0321。 |
| `Overlay` | 默认是半透明纯颜色遮罩。有效模糊为 `blur=true || Provider.frostedGlass=true`：局部 API 与全局毛玻璃都消费 `--pui-overlay-blur`；二者关闭时没有 `backdrop-filter`。它不改变 Slot、click 回写、滚动阻断、zIndex 或几何。独立页的 Slot 演示固定为居中的展示级 `Hi PoemCoder`，不为文案建立 Cell/Card/操作面板。 | App Shell `data-frost` 与组件 Props `blur` 取并集；同一遮罩层计算 filter，不另建 H5 视觉壳；H5 独立页镜像同一居中文字。 | 删除 `blur` API、只跟随全局、只听局部 Prop，在页面用私有 `backdrop-filter` 补丁，或把展示文案重新塞进卡片面板。 | `OVERLAY.md`、`H5_PREVIEW_COMPATIBILITY.md`；PUI-FB-0299、0300、0335、0353。 |
| `ConfigProvider` / `visualConfig` / 外观入口 | 每个页面根挂 `<pui-config-provider use-global-config>`。公共字段为 `theme/effectsEnabled/shadow/frostedGlass/largeRadius/bordered/equalSpacing`，持久化只走 `restore/set/applyPreset/setEffectsEnabled/reset/subscribe`。`effectsEnabled` 是开发者 API/预设内部闸门，不进入用户菜单；共享外观 UI 将旧暂停状态迁移为开启并保留三项原值。渐变只属页面画布。 | App Shell 同步 `data-theme/shadow/frost/radius/border/spacing`；七项菜单、恢复、reset、果味和 Switch 都使用共享组件镜像，H5 同样不渲染总效果开关。 | 复制第二份全局配置、把 gradient 写入 visualConfig、只在 `app.js` 声称已包裹所有页面、重新暴露含糊的总效果 Switch，或让 effects 关闭等距模式。 | `CONFIG-PROVIDER.md`、`EQUAL_SPACING_VISUAL_CONFIG_SPEC.md`；PUI-FB-0309、0331、0333、0456。 |
| 独立 `Surface` 的阴影与等距 | `equalSpacing` 只作用于独立 Surface：其四向 inset、直接结构块 gap、Header/Content/Footer 分区 gap 共同使用该 Surface 的 inset。阴影只授予 Card、Popup、Sheet、ActionSheet、Popover、Dropdown、NavigationMenu、展开面板等独立 Surface。 | 用同名 Surface Token 和同一资格表；H5 不能只声明 Token 而不让真实镜像 Surface 消费。 | 覆写全局 `--pui-space-*`、`--pui-content-gap`、`--pui-section-gap`；给 Cell、Field、Empty、Result、Grid、Steps、Avatar、Tag、Badge、Icon、Progress、Skeleton 或 PreviewDevice 加阴影/大间距。 | `SPACING.md`、`SHADOW_SWITCH_COMPONENT_PLAN.md`；PUI-FB-0331。 |
| 连续集合与展开容器 | CellGroup/List/表格等连续集合只保留集合根语义，不拆成大间距卡片；Collapse/Collapsible/Combobox/Select/Picker/Calendar/Upload/Swiper 等有独立面板时才消费相应 Surface 别名。 | 保持同一根 Surface；连续行仍用原列表节奏，预览基础设施保持透明。 | 将等距模式扩散到控件内部、连续行或展示叶子，或以多层容器弥补错误间距。 | `EQUAL_SPACING_VISUAL_CONFIG_SPEC.md`；PUI-FB-0331。 |
| `TopLoading` / `DynamicMessage` | TopLoading 只依附当前 Surface 顶边，以 `state + progress` 接收父级真实任务状态；只有显式 success 才显示完成。DynamicMessage 通过 key 保留节点原位更新，不同 key 排队；页面内容保持可操作，Action 只交付意图。 | H5 复用同一 500ms/1ms 状态机、默认主题 Icon、PUI Loading/Button/Icon 组合与退场后事件；TopLoading 不占布局，DynamicMessage 不建立遮罩。 | 用定时器伪造请求完成、把 `progress=100` 自动等同成功、同 key 重建节点、用 Toast/静态文字冒充消息更新，或通知出现时清空/锁定预览内容。 | `TOP-LOADING.md`、`DYNAMIC-MESSAGE.md`；对应组件专项测试与 Ledger。 |
| `Style Utilities` 语义预览 | 562 个发布类由生成 Schema 声明 kind/target/safety/theme/scaffold；32 个精选色彩 utility 固定为 8 色相的文字、实色背景、柔和背景和边框，全部读取 light/dark Token。小程序完整目录逐项可选。固定 `120rpx` 单一当前效果只在适格目标挂 class，右侧恢复只清空当前分类；分类 Tab 切换时父级同步把唯一 ScrollArea 的受控 `scrollTop` 归零；viewport/fixed/hidden/safe-area 有界裁切或 trace。预览目标不得由页面私有规则重写正在演示的属性，默认效果使用继承或未选择时的 fallback utility。 | 加载同次生成的 data 与 scoped CSS；精选色变量从生成的 theme 数据注入，不维护第二份 H5 色板。字体分类逐项提供 8 个文字色，背景分类逐项提供 8 个实色、8 个柔和背景和 8 个边框色，全部由共享 hue 列表生成；`64px` 单一当前效果可由示例按钮更新并由恢复按钮清空。当前 H5 是独立五类示例区，不伪造小程序单目录回顶。 | 恢复 baseline/result 双栏或比较箭头；只给精选色做少数代表预览；把 utility 拼到页面、Tabs、ScrollArea、目录、当前效果容器或文档卡根；页面私有 `color/background/border` 覆盖目标 utility；用 hue utility 冒充 success/warning/danger/info；给实色背景隐式猜文字色；逐端手写类别判断；只有 data/class 字符串但没有 H5 CSS。 | `STYLE_UTILITIES.md`、`STYLE_UTILITIES_TAB_PLAN.md`；PUI-FB-0375、0384、0396、0398、0399、0402、0403。 |
| WXSS 发布兼容 | 发布组件禁止 `*`、`> *`、`*::before/after`，也禁止组件 WXSS 导入含 `page`、标签、ID 或属性选择器的全局样式。`common/style/theme.wxss` 只能由消费者 `app.wxss` 经 `theme/utilities.wxss` 或 `theme/theme.wxss` 入口导入；组件从 Provider/全局级联继承 Token。 | H5 使用同名 Token 镜像，不复制小程序 WXSS 导入链，也不能借浏览器选择器创建小程序端不存在的结构或行为。 | 在组件 source 或 `miniprogram_npm` 手工导入/修复全局主题，保留通配选择器，或以手工复制 npm 产物掩盖上传错误。 | `UI_DESIGN_CONTRACT.md`、`POPUP.md`；PUI-FB-0300、0316、0323、0332、0340。 |
| 实际小程序工程与发布产物 | 当前可运行工程唯一是 `miniprogram/`；源组件经 `npm run miniprogram:build` 生成 `miniprogram_dist/`，再由示例安装和微信开发者工具“构建 npm”验证。 | H5 只作视觉与交互镜像，不替代小程序编译、分发或真机证据。 | 手工编辑 `miniprogram_npm`、把 `_example` 当作产品工程，或用构建通过宣称真机已验收。 | `miniprogram/`、`scripts/generate-miniprogram-dist.js`；PUI-FB-0290、0323。 |

## 3. 本轮规则之间的优先级

Popup 的顶部请求反馈属于组件级结构：调用方把 `pui-top-loading` 投影到公开 `surface-top` Slot，Popup Surface 提供定位上下文与圆角裁切，状态仍由页面真实请求回写。不得把轨道放进 Content，再由页面私有 `position:relative` 或负位移伪装成顶边。

```text
页面业务状态 / 路由
        ↓ 只负责组合与真实回写
组件公开 API（如 Overlay.blur、Navbar leftBtn/rightBtn）
        ↓ 与全局状态按各组件合同合并
ConfigProvider / visualConfig / 语义 Token
        ↓ 继承给页面根的真实 PUI 组件树
组件 WXML + WXSS / H5 同源镜像
        ↓
miniprogram_dist → 示例安装 → miniprogram_npm → 开发者工具 / 真机
```

`Overlay.blur` 是当前最明确的合并范例：局部 API 不被全局 `frostedGlass` 覆盖；二者以“或”计算有效效果。`equalSpacing` 与 `effectsEnabled` 则相反，必须保持独立，不能被效果总开关关闭。

## 4. 验收与产物清单

每次触及上述规则，至少按影响范围运行：

```bash
npm run feedback:generate
npm run feedback:check
npm run miniprogram:build
node scripts/test-<component>.js
npm run site:build
npm run check
npm run example:install
npm run pack:check
```

需要在微信开发者工具中使用已有热重载；源/`miniprogram_dist`/示例安装/真实 `miniprogram_npm` 的受影响文件应校验一致。不要反复重启、关闭开发者工具，也不要手工复制 npm 目录。

H5 至少验证：light/dark、默认与每个相关外观组合、390px 无横向溢出，以及真实计算样式或几何。小程序至少验证：开关即时生效、跨页面恢复、浮层唯一滚动区和开发者工具编译；iOS/Android 真机未实际完成时必须在最终报告和 Ledger 中写为“未验证”。

## 5. 当前索引覆盖与未覆盖范围

- 本索引覆盖本轮 `PUI-FB-0290` 至 `PUI-FB-0335` 中与组件展示、Navbar/Tabbar、输入焦点、Popup/Overlay、外观、等距/阴影、WXSS 编译和产物链直接相关的共用规则。
- 其中 `PUI-FB-0329` 的 Navbar 双按钮设备验收状态仍为 `needs-device`；`PUI-FB-0335` 的 Overlay 真机 `backdrop-filter` 性能、fixed、触摸阻断和读屏仍未验证。
- 组件 API 的完整字段、未在本轮改动的历史能力、以及未来新增组件规则，继续以各自专属合同和原始 Ledger 为准，不能由本索引推断或扩展。
