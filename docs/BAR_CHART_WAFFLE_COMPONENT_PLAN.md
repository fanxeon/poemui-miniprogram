# BarChart 与 Waffle 组件实施计划

> 状态：源码、H5、产物与开发者工具 npm 构建已完成；真机 `pending-device`
> 范围：PoemUI 组件库、小程序组件独立页、H5 标准组件页、发布产物与合同闭环
> 立项日期：2026-07-28

## 1. 目标与非目标

本次在“高级”分区新增两个可发布的真实组件：

- `BarChart`：用于比较分类数值和表达“已有 + 新增”等分段增量。
- `Waffle`：用圆润点阵表达总量、占比和新增单元。

两个组件都使用原生 WXML `view`、Flex/Grid 与 CSS 渐变实现，不使用 Canvas、不引入图表插件、不以截图或静态 SVG 冒充运行时组件。它们是透明的数据展示叶子，不自带 Card、边框、阴影、毛玻璃或等距 Surface；消费者需要分组时组合 PUI Card。

本轮不实现通用 `Chart` 抽象、坐标轴系统、折线/饼图、手势缩放、Tooltip、数据请求、仪表盘业务数据源或云函数。历史 `shadcn-chart` 研究页不继续充当当前组件入口；公开目录改为 `BarChart` 与 `Waffle` 两个明确能力。

## 2. 共享数据合同

两个组件共用以下调用结构：

```js
[
  {
    key: 'form',
    label: '表单',
    segments: [
      { key: 'existing', label: '已有', value: 19, theme: 'neutral' },
      { key: 'added', label: '新增', value: 2, theme: 'violet' }
    ]
  }
]
```

- 单段数据允许使用 `{ key, label, value, theme }` 简写。
- `value` 仅接收非负有限数；非法值归零，合法的 `0` 必须保留。
- `key` 缺失或重复时生成稳定的内部渲染键，但不修改调用者原数据。
- 主题只允许 `neutral/violet/blue/teal/pink/amber`。共享数据工具保持 `neutral/violet` 通用回退；BarChart 作为独立视觉组件在调用归一化时关闭单段按分类轮换：单序列统一 Blue，多段才按 Blue/Teal/Violet 分配，显式合法主题始终优先。Waffle 继续使用共享通用回退，避免一次视觉调整无意改变另一组件。
- 不通过颜色单独表达含义；可见 label、数值和图例始终提供文字冗余。

共享归一化逻辑放入安装包运行时 `common/utils/chart-data.js`，小程序源组件与发布产物共同消费，避免两个组件形成不同数据口径。

## 3. BarChart 合同

### 3.1 Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `Array` | `[]` | 共享数据结构 |
| `orientation` | `horizontal \| vertical` | `horizontal` | 条形方向 |
| `mode` | `stacked \| grouped` | `stacked` | 分段堆叠或并列 |
| `max` | `Number` | `0` | 显式共享上限；`0` 表示从数据推导 |
| `size` | `small \| medium \| large` | `medium` | 条形厚度 |
| `showValue` | `Boolean` | `true` | 显示分类总值 |
| `showLegend` | `Boolean` | `true` | 显示出现过的分段图例 |
| `showGrid` | `Boolean` | `false` | 显示低对比参考线 |
| `ariaLabel` | `String` | `条形图` | 图表整体可访问名称 |
| `reduceMotion` | `Boolean` | `false` | 将过渡压缩至 1ms |
| `customClass/customStyle/colorScheme` | 公共 | — | PUI 通用边界 |

BarChart 不公开 Events、Methods 或 Slots。它是只读展示组件；数据更新由父级回写 `items/max`。

### 3.2 视觉与几何

- 默认横向布局；标签列可读，数值列不挤压图形。
- 所有分类共享同一零基线与最大值，禁止每行独立归一化造成误读。
- `showGrid=true` 的横向图表在比例轨下方显示真实 `0 → 共享上限` 端点。
- 条形为圆角胶囊，分段从低透明度渐变到实体强调色；数值终点保持清晰，不在终点变透明。
- 堆叠模式仅最外侧两端圆角，内部接缝保持连续；并列模式每段独立圆角。
- `small/medium/large` 对应 16/24/32rpx 厚度。
- 数据变化使用 `--pui-duration-normal` 与 `--pui-ease-standard`；低动效为 1ms。

## 4. Waffle 合同

### 4.1 Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `Array` | `[]` | 共享数据结构 |
| `columns` | `Number` | `10` | 每行单元数，限制 4–12 |
| `groupColumns` | `Number` | `0` | 大分组列数；`0` 表示不额外分组 |
| `shape` | `rounded \| circle \| square` | `rounded` | 点阵单元形状 |
| `size` | `small \| medium \| large` | `medium` | 单元尺寸 |
| `unit` | `Number` | `1` | 每个单元代表的数值 |
| `maxCells` | `Number` | `100` | 渲染上限，限制 1–200 |
| `showValue` | `Boolean` | `true` | 显示分类总值；超限后的缩放单位始终显示 |
| `showLegend` | `Boolean` | `true` | 显示文字图例 |
| `ariaLabel` | `String` | `组件点阵图` | 图表整体可访问名称 |
| `reduceMotion` | `Boolean` | `false` | 将过渡压缩至 1ms |
| `customClass/customStyle/colorScheme` | 公共 | — | PUI 通用边界 |

Waffle 不公开 Events、Methods 或 Slots。

### 4.2 视觉与几何

- 默认 10 列圆润方块；`small/medium/large` 对应 20/24/28rpx。
- 每个分段从实体色逐步衰减到最低透明度；最低透明单元保留轻微描边，在浅色、深色和渐变页面背景上都可辨认。
- 新分段从实体强调色重新开始，并通过图例和“+N”文字显式区分新增量。
- 数量超过 `maxCells` 时计算可见 `effectiveUnit`，图表必须显示“1 格 = N”，禁止静默压缩。
- `circle` 始终为完整圆形；`square` 不跟随大圆角；`rounded` 使用独立 Chart 单元圆角 Token。

## 5. Token 与外观资格

新增小程序/H5 同名语义 Token：

- `--pui-chart-accent-violet/blue/teal/pink/amber/neutral`
- `--pui-chart-gradient-* / --pui-chart-gradient-vertical-*`
- `--pui-chart-fade-start`
- `--pui-chart-fade-middle`
- `--pui-chart-fade-end`
- `--pui-chart-fade-outline`
- `--pui-chart-grid-line`
- `--pui-chart-track`
- `--pui-chart-cell-radius`

浅色 Violet 使用 `#7c3aed`，深色使用 `#a78bfa`；其他色来自现有精选 accent Token。透明度梯度由语义 Token 控制，不在组件内另建主题。

外观资格固定为：

| 组件 | Surface | shadow | frostedGlass | largeRadius | bordered | equalSpacing |
| --- | --- | --- | --- | --- | --- | --- |
| BarChart | display-leaf | none | false | false | false | false |
| Waffle | display-leaf | none | false | `rounded` 单元仅消费专用圆角 Token | false | false |

全局阴影、毛玻璃、边框与等距开关不得给图表根创建容器；深浅色、大圆角和页面渐变只通过 Token/背景上下文影响可读性。

## 6. 小程序实现

1. 新建 `bar-chart/` 与 `waffle/` 原生四件套。
2. 新建共享 `common/utils/chart-data.js`，集中完成数据、主题、数值、图例和可访问摘要归一化。
3. 在 `metadata/components.js` 将两个组件加入 Advanced、release set、详情、API Props/Slots/Events/Methods，并生成 npm 总入口和 `miniprogram_dist`。
4. 新建 `miniprogram/pages/components/bar-chart/` 与 `waffle/` 独立页，复用 ConfigProvider、Navbar、ScrollArea、Section、PUI Button/Card；页面按钮只负责父级数据更新，组件本身保持只读。
5. 更新 `miniprogram/app.json`、首页 Advanced 列表与搜索索引。
6. 不手工修改 `miniprogram_npm`；完成源码/dist/示例安装后只使用微信开发者工具构建 npm。

## 7. H5 同步

1. 在标准组件页实现真实 DOM 镜像，与原生共享 Props、数据归一化、颜色、尺寸、图例和低动效语义。
2. 两个路由都进入统一 `PreviewDevice` 的 `shadow-safe` 布局，支持概览/API/属性、代码复制与当前 Props 回写。
3. 移除 `shadcn-chart` 作为“未发布 Chart 文档页”的公开例外；若保留外部兼容说明，只指向两个已实现组件，不再提供可误认的静态图表页面。
4. 验证 390px、light/dark、页面渐变，以及 shadow/frost/border/radius/equalSpacing 开关不污染图表根。

## 8. 文档、Ledger 与测试

- 新增 `docs/components/BAR-CHART.md`、`docs/components/WAFFLE.md`。
- 同步 `UI_DESIGN_CONTRACT.md`、`H5_PREVIEW_COMPATIBILITY.md`、`MINIPROGRAM_ADVANCED_PAGES.md`、`COMPONENT_RULES_INDEX.md`、进度与生成型目录/API/矩阵。
- 新增两个 Ledger 原始记录：一条描述“历史 Chart 静态例外不能冒充真实组件”，一条描述“渐变到透明仍需保证终点和最低透明单元可读”。
- 新增 `scripts/test-bar-chart.js`、`scripts/test-waffle.js`，覆盖数据边界、共享比例、单位缩放、主题白名单、零值、低动效、无事件/方法/Surface、H5 同步、安装入口。
- 更新外观资格矩阵与 PreviewDevice 路由覆盖测试。

## 9. 验收门禁

1. 组件专项测试与共享数据测试。
2. `npm run feedback:generate`、`npm run feedback:check`。
3. `npm run site:build`、完整 `npm run check`。
4. `npm run miniprogram:build`、`npm run pack:check`、`npm run example:install`。
5. 比较源组件、`miniprogram_dist`、示例安装包的四件套与共享 helper 哈希。
6. H5 浏览器实测 390px、light/dark、五项外观组合、动画和几何。
7. 微信开发者工具保持当前实例，使用热重载、清缓存和构建 npm；不反复启停。
8. 真机未完成前必须保留 `pending-device`，不得由 H5 或构建成功替代。

## 10. 完成定义

只有当两个组件都具备真实 npm 源码、真实小程序独立页、真实 H5 镜像、API/属性/复制、合同、Ledger、专项测试、发布产物与示例安装闭环时，才可标记源码交付完成。微信 iOS/Android 真机、读屏与系统低动效若没有实际设备证据，继续明确标为未验证。

## 11. 2026-07-28 执行结果

- 已完成：两个原生组件、共享数据 helper、两个独立页、高级目录、H5 标准页、73 个组件/79 个公开入口 metadata、专属合同、全局规则、Ledger `PUI-FB-0460/0461`、外观矩阵和专项测试。
- 已验证：H5 390×844、light/dark、阴影/毛玻璃/边框/大圆角/等距组合，页面与 PreviewDevice 横向溢出为 0；组件根保持透明、无边框、无阴影、无 blur。Waffle 实测 opacity `1→0.28`、1px inset outline，`showValue=false` 后缩放单位仍可见。
- 已验证：`site:build`、`pack:check`、`example:install`；源、`miniprogram_dist`、示例安装、微信 `miniprogram_npm` 的两个组件四件套、共享 helper 与主题 Token 聚合 SHA-256 均为 `8c880cc6e9a4fd47c77ae6ac527d4d22929bf0a3fa9c2124d02bf8304f9b22e4`。微信开发者工具最终 `build-npm` 耗时 985ms，warnings 为空。
- 完整 `npm run check` 的本轮相关前半段与手工续跑后半段均通过；总命令仍被已有工作区 Search H5 `search-clear` 私有按钮门禁阻断，该问题不属于本计划，不能表述为全绿。
- 未验证：微信自动化运行时没有就绪，虽然 simulator 打开页命令返回成功，但无法读取页面节点或截图；iOS/Android 真机、读屏、系统低动效和弱视可读性仍为 `pending-device`。

## 12. 2026-07-28 Me 页后续消费

- 原计划不在“新增组件”范围内实现仪表盘业务数据源；后续用户单独确认 Me 页使用 BarChart 后，页面消费范围才扩展为真实组件目录统计，不改变 BarChart 的只读展示叶子合同。
- `scripts/generate-catalog.js` 以 `metadata/components.js` 的目录分组与 `packageComponents` 交集生成 `miniprogram/common/data/component-status.js`。源数据仍是九个目录、73 个发布组件、最大分类 19、基线 0；Me 消费层不把“规范”作为组件分类单独展示，而是把其中 1 个真实组件并入“基础”，得到八个可见分类且总数仍为 73。
- BarChart 组件级默认色收敛为“单序列统一 Blue，多段 Blue/Teal/Violet”，调用方显式合法主题仍优先；横向 `showGrid` 增加可见 `0 → max` 端点，并以专用低对比 Token 弱化参考线。Me 页只组合一张 PUI Card 与透明 BarChart，去掉重复标题，并从发布 metadata 和版本差集生成 `0.1.0 71 → 0.1.1 73`：高级分类以 Blue `5` + Teal `2` 呈现。默认四项优先保留本版有变化的分类，透明超小号 PUI Button 通过实测高度和共享动效 Token 在“查看更多 / 收起”间切换全部八项。H5 只同步真实组件镜像，不复制小程序业务页。
- 本后续由 Ledger `PUI-FB-0463/0464` 追溯；微信真机未验证前继续保留 `pending-device`。

## 13. AreaChart 后续版本口径

本计划只记录 BarChart 与 Waffle 首次落地时的两组件里程碑。随后确认的
`docs/AREA_CHART_GRADIENT_COMPONENT_PLAN.md` 在同一 `0.1.1` 中新增 AreaChart，并将当前
工作树版本差集统一修订为 `area-chart / bar-chart / waffle`、`71 → 74 / +3`、高级分类
`5 → 8`、公开组件与规范入口 `74 + 5 = 79`。三个图表共同公开默认启用的
`animated=true`、`duration=500` 与 `replay()`；当前合同、生成统计和验收以 AreaChart
计划及三个组件专属合同为准，不能继续把本节之前的 `73 / +2` 里程碑当作当前版本事实。
