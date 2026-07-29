# AreaChart 组件合同

## 1. 组件定位与公开边界

AreaChart 用共享零基线展示连续趋势。它是透明的只读 `display-leaf`，负责数据归一化、比例、曲线、面积渐变、参考线、横轴、图例、可访问摘要和入场动效；不请求数据、不提供 Tooltip、不管理仪表盘业务状态，也不自带 Card/Surface。调用路径为 `poemui-miniprogram/area-chart/area-chart`。

小程序使用原生 Canvas 2D 绘制图形；标签、图例和可访问名称仍由 WXML 输出。H5 使用共享数据合同的 SVG 镜像。两端不得以截图或静态图片冒充组件。

## 2. 参考来源与转译决定

本组件于 2026-07-28 参考 [shadcn/ui Area Chart](https://ui.shadcn.com/charts/area) 和固定主分支提交 `3150ac35a62e767eba39cc90730e9daeaa5be76f` 的 `chart-area-gradient.tsx`。保留其“实体强调色描边 + 5% 高透明度到 95% 低透明度的竖向填充 + 低对比横向参考线”视觉原则；不照搬 React、Recharts、Tooltip、桌面 Hover 或 shadcn Card 容器。

PoemUI 将填充不透明度收敛为同名 Token `--pui-chart-area-fill-start/end`，默认 `0.42 → 0.04`，让多个系列叠加时仍保持可读。面积图根始终透明，Surface 由消费者组合。

## 3. 数据结构

`items` 使用按横轴点组织的 `AreaChartItem[]`：

```js
[
  {
    key: 'jan',
    label: '1月',
    segments: [
      { key: 'desktop', label: '桌面端', value: 186, theme: 'blue' },
      { key: 'mobile', label: '移动端', value: 80, theme: 'teal' }
    ]
  }
]
```

同一个 segment `key` 在各点之间表示同一系列。单系列允许 `{ key, label, value, theme }` 简写。数值只接受非负有限值，非法值归零；缺失系列在该点补 `0`。主题白名单为 `neutral/violet/blue/teal/pink/amber`，省略时按 Blue、Teal、Violet 分配。

## 4. Props 与 Method

公开 13 个 Props：

- `items: AreaChartItem[] = []`
- `max: number = 0`，`0` 表示自动推导共享上限
- `curve: 'natural' | 'linear' | 'step' = 'natural'`
- `stacked: boolean = false`
- `size: 'small' | 'medium' | 'large' = 'medium'`
- `showGrid: boolean = true`
- `showXAxis: boolean = true`
- `showLegend: boolean = true`
- `showDots: boolean = false`
- `animated: boolean = true`
- `duration: number = 500`，运行时限制 `0–1000ms`
- `ariaLabel: string = '面积图'`
- `reduceMotion: boolean = false`

没有 Events 或 Slots。公开 `replay(): void`，只重播当前入场，不改变 `items/max/curve/stacked` 或业务数据。

## 5. 几何、渐变与动效

- 所有系列共用从 `0` 开始的比例；`stacked=false` 按单系列最大值推导，`stacked=true` 按同一点系列总和推导。
- `natural` 使用局部受限三次贝塞尔，控制点不得超过相邻端点纵向范围；`linear` 使用直线；`step` 使用阶梯线。
- 非堆叠面积回到同一零基线；堆叠面积回到前一系列上边界。
- 描边使用实体强调色并保持圆角连接；填充从 `--pui-chart-area-fill-start` 竖向渐变到 `--pui-chart-area-fill-end`。
- `animated=true` 默认在首次挂载淡入并轻微上移归位；H5 同时让实体描边从起点展开。`duration` 默认 500ms，`reduceMotion=true` 为 1ms 且取消级联延迟。
- `replay()` 与 H5 概览的低强调重播 IconButton 使用同一入场语义，不重新请求数据。H5 重播先挂载 `is-replay-reset` 关闭复位方向的 transition，把 `opacity / transform / stroke-dashoffset` 完整提交到初始帧；下一绘制帧才移除复位类并进入完成态，不能只清除完成类后等待约 32ms。

## 6. 外观资格

AreaChart 为 `display-leaf`：`shadow=none / frostedGlass=false / largeRadius=false / bordered=false / equalSpacing=false / gradient=false`。根必须透明、无边框、无阴影；全局外观只可通过深浅色和 Chart Token 改变图形可读性。

## 7. H5 与小程序边界

- 小程序必须使用 `<canvas type="2d">`、真实 DPR 和继承后的 Chart Token 色值；Canvas 不能写死为只支持浅色。
- H5 使用真实 SVG path、linearGradient、grid、x-axis 与 legend，不加载 Recharts，也不把 Canvas 截图塞进概览。
- 两端共享 `items/max/curve/stacked/size/show* / animated/duration/reduceMotion` 语义，使用同名 Token。
- 横轴原样显示调用方传入的 `item.label`，组件不自动追加 `v`、单位或其他业务前缀；消费页可以在版本上下文明确时使用 `0.1.0`，同时在 `ariaLabel` 中保留“版本 0.1.0”的完整语义。
- 独立页复用 ConfigProvider、Navbar、唯一 ScrollArea、Section 和 PUI Button；重播按钮通过 `selectComponent().replay()` 调用真实实例。
- 独立页和 H5 概览都提供页面拥有的“初始数据 ↔ 高波动数据”切换。两组数据保持相同月份和 series key，但把相邻峰谷与两系列交叉幅度显著拉开；父级完成 `items` 回写后调用真实 `replay()`。该切换是演示运行态，不是 AreaChart Prop，不进入复制 WXML，也不得改写调用方传入的默认 `items`。

## 8. 验收与禁止

专项测试必须覆盖：单/多系列、缺失系列、非法/零值、显式/自动 max、叠加/堆叠、三种曲线、共享零基线、三种尺寸、Grid/XAxis/Legend/Dots、浅深色 Token、默认 500ms、关闭动画、1ms 低动效、`replay()`、零 Events/Slots、H5 SVG 和小程序 Canvas 2D、透明 Surface 资格、发布产物一致性。

明确禁止逐点独立放大、用 Card 包进组件根、把 Tooltip/请求/版本统计塞入组件、使用静态图片冒充、仅切换根 `data-*` 而不验证真实渐变和描边。

演示不得使用几乎同形的数据或只修改个位数来证明动效。默认数据本身需要形成清晰峰谷，变化态还要同时包含明显上升、下降和系列交叉；“同数据重播”与“父级切换数据后重播”必须是两个可区分的真实操作。

微信 iOS/Android 真机的 Canvas DPR、系统低动效、读屏、横竖屏与弱视可读性未实测时必须保留 `pending-device`。

## 9. 修改闭环

修改前运行 `npm run feedback:list -- --component area-chart` 并阅读原始记录；实现后同步小程序、H5、metadata、合同、Ledger、专项测试、`miniprogram_dist` 与示例安装，依次运行 `npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check` 和 `npm run example:install`。不得把构建成功等同真机通过。

`replay()` 必须先提交 `entered=false`，再跨帧提交 `entered=true`；H5 必须用无 transition 的 `is-replay-reset` 完整提交初始帧，再跨两帧恢复 transition 与完成类，保证每次重播都真正触发完整动画。
