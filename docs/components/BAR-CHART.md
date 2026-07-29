# BarChart 组件合同

## 1. 组件定位与公开边界

BarChart 用共享零基线比较分类数值与分段增量。它是透明的只读展示叶子，只负责数据归一化、比例、条形、数值、图例和可访问摘要，不请求数据、不管理业务状态、不提供 Tooltip，也不自带 Card/Surface。调用路径为 `poemui-miniprogram/bar-chart/bar-chart`。

本组件使用 WXML `view`、Flex/Grid 和 WXSS 渐变实现，不使用 Canvas 或图表插件。历史 `shadcn-chart` 研究页不得作为本组件 API 来源。

## 2. 数据结构

`items` 使用 `ChartItem[]`：每项包含 `key/label/segments`，每个 segment 包含 `key/label/value/theme`。单段数据允许把 `value/theme` 直接写在 item。仅接受非负有限值；非法值归零，合法 `0` 保留。主题白名单为 `neutral/violet/blue/teal/pink/amber`。调用方显式传入的合法 `theme` 始终优先；省略主题时，BarChart 的单序列分类统一使用 `blue`，只有同一分类包含多个 segment 时才按 `blue → teal → violet` 分配。颜色因此表达“同一指标 / 分段构成”，不再把每个普通分类误画成不同语义。

## 3. Props

公开 12 个 Props：

- `items: ChartItem[] = []`
- `orientation: 'horizontal' | 'vertical' = 'horizontal'`
- `mode: 'stacked' | 'grouped' = 'stacked'`
- `max: number = 0`，`0` 表示自动推导共享上限
- `size: 'small' | 'medium' | 'large' = 'medium'`
- `showValue: boolean = true`
- `showLegend: boolean = true`
- `showGrid: boolean = false`
- `animated: boolean = true`
- `duration: number = 500`，运行时限制 `0–1000ms`
- `ariaLabel: string = '条形图'`
- `reduceMotion: boolean = false`

没有 Events 或 Slots。公开 `replay(): void`，只从共享零基线重播当前条形入场，不改变 `items/max`。父级仍通过更新 `items/max` 驱动真实数据变化。

## 4. 几何、渐变与可读性

- 横向、纵向和所有分类共享同一零基线与最大值，禁止逐项独立放大。
- `stacked` 的上限按分类总和推导；`grouped` 按单段最大值推导。
- `showGrid=true` 时，横向布局在同一比例轨下方显示 `0` 与共享上限两个端点；`0` 必须是真实比例起点，不能以页面文案或私有坐标轴伪造。纵向布局继续以同一底边零基线和水平参考线表达比例，不额外挤压分类标签。
- 条形沿数值方向使用与 AreaChart 填充同义的低透明渐变：零基线端为 `0.04`，数据端为 `0.42`；数据端再用 `2rpx` 实体 `--pui-chart-accent` 内描边锁定真实长度。横向与纵向分别使用 90deg/0deg Token 和右侧/顶部终点线，不能靠高饱和实体渐变制造重量。
- 单序列默认统一 Blue；多段数据才使用 Blue、Teal、Violet。浅深色都读取既有 Chart Token，不新增页面私有色值。多段增量的首段默认 Blue、第二段默认 Teal，调用方仍可通过合法 `theme` 覆盖。
- `showGrid` 的参考线必须读取专用 `--pui-chart-grid-line`，其对比度低于 Waffle 单元格使用的 `--pui-chart-fade-outline`；弱化网格不能联动削弱 Waffle 描边。
- `small/medium/large` 为 16/24/32rpx；形状保持胶囊。
- 颜色不是唯一信息：分类、总值与图例都有文字。
- `animated=true` 默认让条形从共享零基线伸展，并按分类/分段级联至最多 225ms；关闭动画立即显示完成态。`duration` 默认 500ms；`reduceMotion=true` 为 1ms 且移除 delay。
- `replay()` 只重播入场，不代表数据加载或业务成功。
- H5 重播必须先用 `is-replay-reset` 关闭条形复位方向的 transition，将横向 `scaleX(0)` / 纵向 `scaleY(0)` 完整提交，再跨帧恢复入场；只清除完成类并等待约 32ms 会在 500ms 反向 transition 尚未复位时折返，肉眼几乎无变化。

## 5. 外观资格

BarChart 为 `display-leaf`：`shadow=none / frostedGlass=false / largeRadius=false / bordered=false / equalSpacing=false`。根必须保持透明、无边框、无阴影；全局外观只可通过深浅色和 Token 改变强调色/轨道可读性。

## 6. H5 镜像与预览

H5 使用同名 Props、单序列 Blue / 多段 Blue-Teal-Violet 默认分配、共享零基线、可见 `0 → max` 端点、同名 `--pui-chart-grid-line`、默认级联入场、`replay()` 与同一 500ms/1ms 动效语义，并进入标准 PreviewDevice `shadow-safe` 布局。概览不得使用静态图片或 Canvas 假图。API/属性/WXML 由 metadata 同源生成。

0.1.2 小程序逐组件阶段已经在 `common/style/theme.wxss` 与 `bar-chart/bar-chart.wxss` 落地 `0.04 → 0.42 + 实体终点线`。H5 最终汇总必须同步 `preview/styles.css` 中 light/dark 六组横向/纵向 `--pui-chart-gradient-*`，并给 `.pui-bar-chart-preview__segment` 增加同义方向的 inset 终点线；`preview/app.js` 的主题映射、横纵实例与显式版本色不应改变。同步测试必须锁定六色、两方向、浅深色、透明根、无外投影、390px 图例和值可读；在完成前不得把 H5 标为已同步。

小程序的 `grouped` 分支必须使用不生成实体节点的 `<block wx:else>` 包住 segment 循环；禁止把 `wx:else` 与 `wx:for` 放在同一个节点上。该约束只收紧微信 WXML 编译兼容性，不增加布局节点，也不改变 H5 的 DOM 几何与视觉结果。

独立页与 H5 概览必须以页面拥有的两组数据演示更新：初始态和高波动态保持相同分类/segment key，但至少包含一组从短条变长条和一组从长条变短条。父级写回 `items` 后调用真实 `replay()`；旧的“高级 +1”不具备可辨识幅度，禁止恢复。数据切换不是公开 Prop，不进入复制 WXML。

## 7. 验收

专项测试必须覆盖：非法/零值、重复 key、显式主题优先、单序列统一 Blue、多段 Blue/Teal/Violet、六色浅深主题的 `0.04 → 0.42` 横纵渐变与实体终点线、专用低对比网格 Token、显式/自动 max、stacked/grouped、横纵方向、`showGrid` 的真实 `0 → max` 端点、尺寸、空数据、图例、可访问摘要、默认动画/关闭/`replay()`/500ms/1ms、零 Events/Slots、透明 Surface 资格、WXML 条件循环兼容门禁、小程序/H5/发布产物一致性。微信真机未实测时保持 `pending-device`。

## 8. 明确禁止

- 禁止用 Canvas、静态图片、SVG 截图或页面写死宽度冒充组件。
- 禁止逐行使用不同最大值、让数值终点透明或只靠颜色表达新增。
- 禁止给组件根增加 Card、阴影、毛玻璃、边框或等距 Surface。
- 禁止把数据请求、版本统计、Tooltip 或业务状态塞入组件。
- 禁止用 `+1` 或所有分类近似等长的数据证明条形更新动画；演示必须让共享比例下的长度差一眼可辨，同时保留相同 key 来表达真实数据更新而非换组件。

## 9. 修改闭环

修改前运行 `npm run feedback:list -- --component bar-chart` 并阅读原始记录。0.1.2 逐组件阶段先同步小程序共享源码、消费者页面、合同、Ledger 与专项测试，并记录 H5 精确待同步位置；`preview/app.js`、`preview/styles.css`、完整 H5/全库/打包/发布门禁在全部小程序 Battle 后统一执行。真机未验不得标记为真机通过。

`replay()` 必须先提交 `entered=false`，再跨帧提交 `entered=true`；连续点击需要清理旧 Timer / RAF。H5 额外使用无 transition 的 `is-replay-reset` 提交真实零基线帧，不能被同一渲染批次或反向过渡吞掉。
