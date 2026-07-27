# PoemUI 小程序剩余分区搬迁计划

> 状态：组件与规范页面迁移、Node 全量门禁与微信 npm 编译已完成；390px 仅完成代表页实测，逐页与真机验收仍待继续  
> 制定日期：2026-07-26  
> 适用工程：`/Users/fanx/Documents/poemUI 小程序组件库/miniprogram`  
> 完整目录真相源：`metadata/components.js`  
> 小程序路由真相源：`miniprogram/app.json`

## 1. 当前基线

PoemUI npm 当前有 69 个稳定组件目录。小程序 `app.json` 现已登记全部 69 个组件独立页，另有 5 个 `pages/guides/*` 规范页；开始与规范、基础组件、布局、导航、表单组件、数据展示、反馈、浮层与高级分区均可从首页和 Search 进入。

| 分区 | 稳定组件数 | 已有独立页 | 剩余组件页 |
| --- | ---: | ---: | ---: |
| 开始与规范 | 1 | 1 | 0 |
| 基础组件 | 3 | 3 | 0 |
| 布局 | 5 | 5 | 0 |
| 导航 | 9 | 9 | 0 |
| 表单组件 | 19 | 19 | 0 |
| 数据展示 | 14 | 14 | 0 |
| 反馈 | 9 | 9 | 0 |
| 浮层 | 6 | 6 | 0 |
| 高级 | 3 | 3 | 0 |
| **合计** | **69** | **69** | **0** |

除稳定组件页外，官网九分区中还有 5 个尚未进入小程序的规范页面：

- Getting Started；
- Theme Tokens；
- Color；
- Spacing；
- Typography。

Style Utilities 已由 `pages/styles/index` 承担，不重复建立第二个页面。Chart 当前仍是实验性文档能力，不属于 69 个稳定组件，也不在本轮组件搬迁中伪造成小程序组件。

### 1.1 当前阻断项

该阻断项已解决：`miniprogram/pages/index/index.js` 已按现有 WXML、专项测试、路由和视觉配置合同恢复；`scripts/test-miniprogram-home.js` 覆盖全部 69 个组件与 5 个规范页的真实 URL、Search 与外观行为。微信 npm 已通过已登录 AppID 构建；390px 代表页已实测，但不能以 Node 合同测试或代表页替代逐页/真机验收。

## 2. 搬迁目标

最终让九个官网分区在真实微信小程序中具有一致且可检索的入口：

1. 首页按用户任务显示分区。
2. Search 从同一份目录数据检索所有已迁移页面。
3. 每个稳定组件具有独立显式路由。
4. 页面复用统一基础设施，但保留组件自己的 Props、Slots、Events、Methods 和滚动所有权。
5. 示例可真实操作，父级状态真实回写。
6. 失败、取消、关闭、超时和重试具有真实下一步。
7. H5 继续作为并行镜像，不复制到小程序页面。
8. 每个分区具有专项测试、Feedback Ledger、文档、构建和微信验收记录。

## 3. 明确不做

- 不把 43 个页面压成一个查询参数动态页。
- 不在页面重新实现 npm 组件已有的 WXML、WXSS 或运行逻辑。
- 不搬运 H5 属性面板、事件日志、PreviewDevice 或工程诊断块。
- 不用静态文字、定时器或 mock 把请求、上传、刷新、校验、导航描述为成功。
- 不为保持统一外壳而嵌套两个拥有同方向滚动权的组件。
- 不把 Chart 文档页伪装成已发布的小程序 Chart 组件。
- 不用 `site:build`、`npm pack` 或 `build-npm` 代替 390px 模拟器和真机交互验收。
- 不清理、重置或覆盖当前 dirty worktree 中与本计划无关的用户改动。

## 4. 页面复用模型

### 4.1 共享行为，独立路由

普通组件页继续使用：

- `miniprogram/utils/component-page.js`
- `miniprogram/components/component-page-navbar/`
- `miniprogram/components/component-page-section/`
- `miniprogram/styles/component-page.wxss`
- `<pui-config-provider use-global-config>`

每个组件仍保留独立的：

- `pages/components/<component>/index.js`
- `pages/components/<component>/index.json`
- `pages/components/<component>/index.wxml`
- `pages/components/<component>/index.wxss`

理由是各组件的 `usingComponents`、Slot、事件、状态和原生能力不同。共享的是页面生命周期、返回、外观和尺寸测量，不是把组件合同压平。

### 4.2 三类页面壳

#### A. 标准详情页

适用于普通展示、输入和浮层组件。结构固定为：

```text
ConfigProvider
├── component-page-navbar
└── pui-scroll-area
    └── component-page-section × N
```

页面只有一个纵向文档滚动上下文。

#### B. 滚动所有者页

适用于 ScrollArea、PullRefresh、VirtualList 等自身拥有主要纵向滚动的组件。结构固定为：

```text
ConfigProvider
├── component-page-navbar
└── 被测组件承担剩余高度
```

这类页面复用 Navbar、高度测量、外观和返回行为，但被测组件替代默认文档 ScrollArea。禁止在 PullRefresh 或 VirtualList 外再套同方向 `pui-scroll-area`。

#### C. 规范文档页

适用于 Getting Started、Theme Tokens、Color、Spacing 和 Typography。它们可以复用 Navbar、唯一 ScrollArea 和统一文档分区，但不得虚构不存在的 `<pui-color>`、`<pui-spacing>` 或 `<pui-typography>`。

## 5. 目录与路由真相源

当前完整分类来自 `metadata/components.js`，小程序路由来自 `miniprogram/app.json`。搬迁期不得再增加第二份手写搜索名单。

Phase 0 恢复首页后，应评估把页面目录数据收敛为：

```text
metadata/components.js
        ↓ 生成器 + 小程序展示映射
miniprogram/common/data/component-page-catalog.js
        ↓
首页分区 / Search / URL / 专项测试
```

展示映射只补充小程序特有的中文简介、Icon 和已迁移路由，不复制组件状态或 Props。若本轮不实施生成器，则继续以恢复后的 `index.js` 为唯一运行时目录，并由专项测试反查 `metadata` 与 `app.json`，禁止维护平行数组。

## 6. 总体执行顺序

| Goal | 内容 | 结果门禁 |
| --- | --- | --- |
| Goal 0 | 首页取证与恢复 | 26 个既有页面重新可浏览、搜索、跳转 |
| Goal 1 | 补齐反馈区 Dialog | 反馈区 9/9 |
| Goal 2 | 搬迁布局区 5 页 | 布局区 5/5 |
| Goal 3 | 搬迁高级区 3 页 | 高级稳定组件 3/3 |
| Goal 4A | 数据展示基础叶子 5 页 | Avatar/Badge/Card/Image/Tag |
| Goal 4B | 数据展示集合结构 4 页 | Cell/List/Collapse/Collapsible |
| Goal 4C | 数据展示复杂交互 5 页 | Bubble/SwipeCell/CountDown/Swiper/Table |
| Goal 5A | 表单结构与校验 3 页 | Form/Field/Label |
| Goal 5B | 文本与搜索 4 页 | Input/InputOTP/Textarea/Search |
| Goal 5C | 选择与数值 12 页 | Checkbox 至 Upload |
| Goal 6 | 开始与规范、Typography | 1 个组件页 + 5 个规范页 |
| Goal 7 | 全目录收口 | 69 个组件页、6 个规范入口、全门禁 |

每个 Goal 都必须独立通过专项测试和 Feedback Ledger，前一个 Goal 未通过时不得把后一个 Goal 的页面批量堆入 `app.json`。

## 7. Phase 0：首页取证与恢复

### 7.1 取证

1. 保存当前 dirty worktree 状态与首页文件大小、时间、哈希。
2. 检查 Git、编辑器 Local History、Codex rollout、系统快照和临时文件中是否存在 14:03 前的完整 `index.js`。
3. 不执行 `git reset`、`checkout --` 或覆盖整个目录。
4. 如果找到完整副本，只恢复 `miniprogram/pages/index/index.js`。
5. 如果没有可恢复副本，依据以下真实合同重建，并明确标注“重建”而非“恢复”：
   - `scripts/test-miniprogram-home.js`
   - `miniprogram/pages/index/index.wxml`
   - `miniprogram/pages/index/index.json`
   - `docs/MINIPROGRAM_HOME.md`
   - `docs/MINIPROGRAM_NAVIGATION_PAGES.md`
   - `docs/MINIPROGRAM_FEEDBACK_PAGES.md`

### 7.2 必须恢复的能力

- `BASE_COMPONENTS / NAVIGATION_COMPONENTS / FEEDBACK_COMPONENTS / OVERLAY_COMPONENTS`
- 26 个现有 URL
- 分区互斥展开
- 从全部分区生成的 Search 候选
- Search Overlay 与 Combobox 的真实开关、筛选和跳转
- 外观 Popup 与共享 `appearance-settings`
- Navbar 左右入口
- Tabbar 共享路由
- Navbar、Tabbar、窗口高度测量
- 分享给朋友与朋友圈载荷

### 7.3 Phase 0 完成条件

```sh
node scripts/test-miniprogram-home.js
node scripts/test-miniprogram-component-pages.js
node scripts/test-miniprogram-navigation-pages.js
node scripts/test-miniprogram-feedback-pages.js
node scripts/test-miniprogram-overlay-pages.js
```

随后必须在微信开发者工具重新编译并确认首页能显示、搜索和进入既有 26 页。只恢复静态数组但页面无法运行，不算完成。

## 8. Goal 1：补齐反馈区 Dialog

新增：

```text
miniprogram/pages/components/dialog/
├── index.js
├── index.json
├── index.wxml
└── index.wxss
```

真实示例至少覆盖：

1. 基础打开与关闭。
2. `confirm / cancel / close` 请求的父级回写。
3. 点击遮罩关闭与禁止点击遮罩关闭。
4. Header、Content、Footer 的真实内容边界。
5. 内容区组合 Loading/Empty/Button，但不把它们伪造成 Dialog 自身 Props。
6. 长内容只滚动 Dialog Content，Header/Footer 保持可见。

同步：

- `app.json`
- 首页反馈目录与 Search
- `scripts/test-miniprogram-feedback-pages.js`
- `scripts/test-miniprogram-component-pages.js`
- `docs/MINIPROGRAM_FEEDBACK_PAGES.md`
- `docs/components/DIALOG.md`
- Feedback Ledger

完成后反馈分区必须从 8/9 变为 9/9。

## 9. Goal 2：布局区 5 页

| 组件 | 路由 | 页面真实交互 | 重点风险 |
| --- | --- | --- | --- |
| AspectRatio | `aspect-ratio` | 切换比例、内容和 overflow；容器尺寸真实变化 | 窄屏宽高计算、媒体裁切 |
| Direction | `direction` | 受控切换 LTR/RTL/auto，展示文本和组合控件方向 | 不把文字内容反转；嵌套方向继承 |
| Grid | `grid` | 列数、gutter、点击、loading/error/retry | 390px 列宽、条目触摸、状态优先级 |
| ScrollArea | `scroll-area` | 页面主滚动区本身即被测组件，回写 scrollTop、scrollIntoView、渐变 | 禁止外套第二个纵向 ScrollArea |
| Sticky | `sticky` | 在页面唯一 ScrollArea 中滚动，真实观察 offset/disabled/container | sticky 宿主、Navbar offset、真机 WebView |

布局区共享样式只能提供页面编排，不得穿透修改组件尺寸、圆角、Surface 或滚动行为。

专项文件：

```text
scripts/test-miniprogram-layout-pages.js
docs/MINIPROGRAM_LAYOUT_PAGES.md
```

## 10. Goal 3：高级区 3 页

Chart 暂不进入本 Goal。

| 组件 | 页面壳 | 真实交互 | 明确禁止 |
| --- | --- | --- | --- |
| PullRefresh | 滚动所有者页 | 真下拉、refresh 请求、成功/失败/超时后的父级回写 | 定时器自动宣称刷新成功 |
| VirtualList | 滚动所有者页 | 真实长数据、可见窗口、选择、scrollTop、loading/error/retry | 用短列表冒充虚拟化 |
| Watermark | 标准详情页 | 文案、布局、旋转、重复、移动状态切换 | 水印遮挡页面操作或读屏 |

PullRefresh 的业务请求由页面提供真实、可观察的演示数据变化。若没有真实外部请求，必须明确写成“本地列表刷新演示”，不能显示“服务器同步成功”。

专项文件：

```text
scripts/test-miniprogram-advanced-pages.js
docs/MINIPROGRAM_ADVANCED_PAGES.md
```

## 11. Goal 4：数据展示区 14 页

### 11.1 Goal 4A：基础叶子

| 组件 | 最小真实示例 |
| --- | --- |
| Avatar | 图片、文字回退、加载失败、尺寸和形状 |
| Badge | 数字、0、dot、maxCount、与 Button/Icon 组合 |
| Card | Header/Content/Footer、点击、禁用、边界和外观 |
| Image | 真实本地图片、lazy、loading/error、长按能力边界 |
| Tag | 主题、尺寸、Icon、关闭回写、disabled |

### 11.2 Goal 4B：集合结构

| 组件 | 最小真实示例 |
| --- | --- |
| Cell | 单行、多行、选择、导航、媒体、disabled/loading |
| List | 数据列表、Header/Footer、loading/finished/error/empty |
| Collapse | 单开/多开、受控 value、loading/error/retry |
| Collapsible | 展开/收起、Slot、受控 open、状态边界 |

Cell 的真实微信导航必须使用当前工程存在的路由；不能填写不存在的 URL 后只展示点击文字。

### 11.3 Goal 4C：复杂交互

| 组件 | 最小真实示例 |
| --- | --- |
| Bubble | 消息方向、分组、反应、长按、展开/收起 |
| SwipeCell | 左右滑、阈值、打开态、点击操作、禁用 |
| CountDown | start/pause/reset、归零、低动效 |
| Swiper | 手势切换、受控 value、导航、loading/error/retry |
| Table | 横向局部滚动、选择、排序、固定列、状态和 Methods |

专项文件：

```text
scripts/test-miniprogram-data-pages.js
docs/MINIPROGRAM_DATA_PAGES.md
```

每个子 Goal 必须独立更新同一专项测试和文档，不等 14 页全部完成后才补合同。

## 12. Goal 5：表单组件区 19 页

表单区必须按用户任务拆成三组，不一次批量生成 19 个空壳。

### 12.1 Goal 5A：结构与校验

| 组件 | 最小真实示例 |
| --- | --- |
| Form | data/rules、submit、reset、服务端消息模拟入口、首错滚动 |
| Field | Label、帮助、required、状态消息、Input Slot |
| Label | required、disabled、colon、与真实字段关联 |

Form 的提交成功只能在真实 `validate()` 通过并由页面收到 `submit` 后显示“本地校验通过”；不得描述为数据已保存到服务器。

### 12.2 Goal 5B：文本与搜索

| 组件 | 最小真实示例 |
| --- | --- |
| Input | 受控值、clear、focus/blur、前后缀、状态和原生键盘 |
| InputOTP | 自动跳格、粘贴、遮罩、完成和错误 |
| Textarea | autosize、字数、clear、选择区间和键盘 |
| Search | change、clear、confirm、cancel、focus 与结果消费者 |

不得在 Input、Textarea 或 Search 页面额外手写原生输入框。

### 12.3 Goal 5C：选择与数值

| 组件 | 最小真实示例 |
| --- | --- |
| Checkbox | 单项、全选、不确定态、禁用和 CheckboxGroup |
| Radio | 严格单选、允许取消、禁用和 RadioGroup |
| Switch | 自定义值、loading、readonly、disabled |
| Select | 受控值、空值、readonly、disabled |
| Picker | 打开、滚轮草稿、确认、取消、reset、状态 |
| Combobox | 搜索、多选、maxSelected、分组、error/retry |
| Slider | min/max/step、实时值、提交值、readonly |
| Stepper | min/max/step、输入、整数和禁用边界 |
| Rate | 半星、文本、readonly、disabled |
| Calendar | 单选/范围/多选、月份导航、限制日期和关闭 |
| DateTimePicker | 日期/时间模式、确认、取消、范围和步长 |
| Upload | 真实微信选择文件、预览、删除、大小/类型失败 |

Upload 页面不得伪造上传到服务器成功。没有真实上传后端时，只验证微信本地文件选择、列表受控回写、预览和移除，并明确标注“未上传到服务器”。

专项文件：

```text
scripts/test-miniprogram-form-pages.js
docs/MINIPROGRAM_FORM_PAGES.md
```

## 13. Goal 6：开始与规范和 Typography

### 13.1 ConfigProvider 组件页

真实展示：

- 页面级主题切换；
- 阴影、毛玻璃、大圆角、边框和等距；
- `useGlobalConfig` 与局部覆盖边界；
- 刷新后的真实本地持久化；
- 不复制另一份 `visualConfig` Store。

### 13.2 五个规范页

| 页面 | 内容真相源 | 小程序表达 |
| --- | --- | --- |
| Getting Started | README、发布文档、真实 npm 配置 | 安装、构建 npm、按需引用、Provider 示例 |
| Theme Tokens | `common/style/theme.wxss` | 当前主题 Token 与组件组合 |
| Color | 同一主题 Token | brand/semantic/neutral，不手写第二套色值 |
| Spacing | theme/utilities | 8 档间距和真实工具类 |
| Typography | theme/utilities | 字号、行高、字重、截断与换行 |

规范页不是组件页，不进入 `pages/components/`。建议路由：

```text
pages/guides/getting-started/index
pages/guides/theme-tokens/index
pages/guides/color/index
pages/guides/spacing/index
pages/guides/typography/index
```

首页可以显示“开始与规范”和“基础组件”两个分区；Search 必须能检索这些页面，但搜索结果需要区分“规范”和“组件”，不得把文档能力伪装成可安装组件。

## 14. 每个 Goal 的标准实施步骤

1. 运行 `pre-task` 与 `handoff`。
2. 保存 dirty worktree 基线，不处理无关文件。
3. 完整阅读目标组件专属合同。
4. 查询目标组件与 global Feedback Ledger。
5. 核对真实源码四件套、metadata、H5、API、示例和现有测试。
6. 只新增本 Goal 的首页目录、路由和页面。
7. 建立真实父级状态和失败/恢复路径。
8. 新增或更新分区专项测试。
9. 更新组件页通用测试、首页测试和外观矩阵。
10. 新增或更新 Ledger，保持 `acceptance=pending-user`，除非有明确范围化授权。
11. 更新分区文档、首页文档和交付进度。
12. 运行构建、安装、打包和微信 npm 构建。
13. 在 390px 模拟器逐页实点。
14. 把未完成真机项写入 `deviceRisks`。

## 15. 测试与质量门禁

### 15.1 页面通用合同

每个标准页面必须验证：

- ConfigProvider；
- 共享 Navbar；
- 动态剩余高度；
- 唯一页面滚动上下文；
- `component-page-section`；
- 没有页面级原生 `button`；
- 没有页面私有主题、魔法色值或重复 Surface；
- `app.json` 路由；
- 首页目录和 Search URL；
- 页面方法真实存在并回写状态。

### 15.2 组件专项

每个组件继续运行自身 `scripts/test-<component>.js`。页面专项不能替代组件合同测试，组件测试也不能替代页面路由和父级交互。

### 15.3 分区专项

最终应存在：

```text
test-miniprogram-feedback-pages.js
test-miniprogram-layout-pages.js
test-miniprogram-navigation-pages.js
test-miniprogram-form-pages.js
test-miniprogram-data-pages.js
test-miniprogram-overlay-pages.js
test-miniprogram-advanced-pages.js
test-miniprogram-guide-pages.js
```

### 15.4 全量门禁

```sh
npm run feedback:generate
npm run feedback:check
npm run site:build
npm run check
npm run example:install
npm run pack:check
git diff --check
```

涉及安装产物时：

```sh
/Applications/wechatwebdevtools.app/Contents/MacOS/cli islogin
/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm \
  --project "/Users/fanx/Documents/poemUI 小程序组件库/miniprogram"
```

必须回读真实 AppID、耗时和 warnings，并检查新增组件确实出现在：

```text
miniprogram/miniprogram_npm/poemui-miniprogram/<component>/
```

## 16. 390px 与真机验收矩阵

每个 Goal 至少检查：

| 维度 | 验收内容 |
| --- | --- |
| 路由 | 首页进入、Navbar 返回、直接打开页面后的首页回退 |
| 尺寸 | 390×844，无页面级横向溢出 |
| 滚动 | 页面滚动唯一；组件内部滚动有明确边界 |
| 主题 | light/dark |
| 外观 | bordered、shadow、frostedGlass、largeRadius、equalSpacing |
| 状态 | 默认、受控、disabled、readonly、loading、error、empty |
| 动效 | 默认 500ms 语义与系统低动效 1ms |
| 输入 | 键盘、焦点、清空、确认、取消 |
| 浮层 | 遮罩、滚动保护、关闭、层级和安全区 |
| 可访问性 | ariaLabel、状态播报、纯图标名称、读屏顺序 |

微信模拟器通过仍不等于 iOS/Android 真机通过。原生文件选择、键盘、惯性滚动、safe-area、fixed、sticky、读屏和系统低动效必须保留真机风险，直到真实设备确认。

## 17. Feedback Ledger 与文档同步

每个 Goal 至少建立一条分区迁移记录，内容包括：

- 用户目标；
- 搬迁前缺口；
- 页面与路由证据；
- 真实交互边界；
- 共享页面壳决策；
- 被拒绝的假 UI 或重复实现；
- 专项测试；
- 构建结果；
- 模拟器和真机风险。

同步文档：

```text
docs/MINIPROGRAM_HOME.md
docs/COMPONENT_DEVELOPMENT_PROGRESS.md
docs/MINIPROGRAM_<SECTION>_PAGES.md
docs/components/<COMPONENT>.md
docs/COMPONENT_FEEDBACK_LEDGER.md  # 只由生成器更新
```

## 18. Dirty worktree 与提交边界

- 开始每个 Goal 前保存 `git status --short`。
- 只修改当前 Goal 明确列出的文件。
- 不 reset、checkout、删除或格式化无关改动。
- 生成文件与源码分开核对来源。
- 若用户要求提交，按 Goal 精确暂存目标文件，不把现有大量无关 untracked 文件一并提交。
- 每个提交应只包含一个可独立回滚的分区或子分区。

## 19. 全部搬迁完成的定义

只有同时满足以下条件，才能声明小程序组件目录搬迁完成：

- [x] 69 个稳定组件均有真实独立页。
- [x] 5 个补充规范页完成，Style Utilities 继续复用现有第二 Tab。
- [ ] Chart 保持明确的实验文档边界，或另行完成真实组件立项。
- [x] 首页九分区和 Search 读取同一目录真相。
- [x] `app.json`、页面目录、Search 与 metadata 无孤儿或缺失路由。
- [x] 所有页面使用正确的标准页、滚动所有者页或规范文档页模型。
- [x] 每个页面至少有一个真实入口、真实状态回写和可观察结果。
- [x] 没有静态假成功、伪上传、伪刷新、伪导航或伪业务完成。
- [x] 分区专项、组件专项和完整 `npm run check` 通过。
- [x] `site:build`、`example:install`、`pack:check` 通过。
- [x] 微信合法 AppID `build-npm` 成功且新增目录真实生成。
- [ ] 390px 模拟器完成逐页验收。
- [x] iOS/Android 未完成项明确保留为未验证，不混入已通过结论。
- [x] Ledger、分区文档、首页文档和进度文档同步。

## 20. 下一步建议

当前 Goal 的下一步：

1. 在 390px 模拟器逐页验证全部新页的路由、滚动、键盘、遮罩、手势和深浅色；
2. 在 iOS 与 Android 真机复核文件选择、键盘、惯性滚动、safe-area、fixed/sticky、读屏和系统低动效；
3. 将逐页/真机结论回写对应 Ledger `deviceRisks`，不以代表页或构建成功替代。
