# PoemUI Utility-first 快速样式集

PoemUI 提供随 npm 发布的静态 WXSS 工具类，用于在微信小程序中快速完成布局和轻量视觉组合。真实入口：

```css
@import "poemui-miniprogram/theme/utilities.wxss";
```

公开入口会继续导入 `common/style/theme.wxss`，因此间距、字体、颜色、圆角、阴影与背景渐变都使用同一套 PoemUI Token。当前共 562 个选择器；小程序与 H5 的样式浏览统一归为“布局、尺寸、间距、字体、背景”五类，其中包括 32 个精选色彩 utility 和 32 个显式 `pui-dark-*` 条件变体：深色文字归字体，深色背景、边框和阴影归背景，溢出、动效、展示和辅助工具归布局；不再保留含义宽泛的“主题与行为”。它不是 WXML 组件，也没有运行时 Props、事件或 JIT 扫描器。

## 设计边界

- 使用 `pui-` 前缀，避免与页面业务 class 和其他组件库冲突。
- 只发布静态、可审计的 WXSS；不接受运行时拼接任意数值。
- 不提供负间距。页面安全边距不能被子项用负 margin 抵消。
- 不生成 `hover:`、`focus:`、断点前缀或浏览器 DOM 变体；触摸状态由真实组件负责。
- `hidden` 是明确的即时隐藏工具，不能用于需要进退场动画的组件节点。
- 工具类只处理布局和轻量视觉，不伪造 loading、disabled、selected、success 等业务状态。

## 语义预览合同

快速样式的目录与预览都必须由 `common/style/utilities.wxss` 的生成链产生，不能按页面截图手写第二套映射。`scripts/style-utilities-preview-schema.js` 为每个发布类声明：

| 字段 | 责任 |
| --- | --- |
| `previewKind` | 同一分类内的互斥语义，例如 width、height、padding-x、font-weight |
| `previewTarget` | 类应命中的真实对象：`layout / item / target / media / measure / outer / surface / items / text` |
| `previewSafety` | 普通有界、viewport 裁切、trace、安全区、定位包含或状态提示 |
| `previewTheme` | 当前预览使用默认主题或局部深色范围 |
| `previewScaffold` | 让单项 utility 可观察所需的最小基础结构，不能覆盖被测试属性 |

小程序与 H5 必须读取同一次生成的这份语义数据。小程序使用固定 `120rpx` 的单一“当前效果”预览，H5 使用固定 `64px` 的同义镜像；选中的 utility 只挂到 `previewTarget` 指定的节点，不再渲染 baseline/result 双栏或比较箭头。预览右侧必须提供 `default / text / small / circle / icon-only` 的 PUI Refresh IconButton：只清空当前分类的选择并恢复默认示例，不得影响其他分类；该次要回退动作不得升级为 primary 实底或增加常驻文案。小程序切换分类 Tab 时，父级在更新候选列表的同一次状态写入中将唯一目录 ScrollArea 的受控 `scrollTop` 归零，复用组件既有的平滑定位；不得重建滚动区或把消费者滚动职责塞进 Tabs。H5 同一次生成还必须从 `common/style/utilities.wxss` 产出限定在 `.utility-doc` 内的 `preview/style-utilities.css`，只做 `rpx→px` 镜像并删除 WXSS theme import；不能仅挂一个没有浏览器规则的 class 假装同步。H5 当前为五类独立示例区，不伪造小程序单目录回顶。页面、Navbar、Tabs、ScrollArea、目录、当前效果容器和其他基础设施根永远不是 utility 目标。`pui-fixed`、`pui-h-screen`、`pui-hidden`、safe-area 等会改变 viewport、定位或可见性的类必须在有界沙箱中裁切或留下 trace，不能逃出预览、改变目录几何或制造大片空白。

新增或修改 utility 时，生成测试必须确认全部类都有完整语义，小程序目录、H5 数据和 scoped CSS 逐项一致；两端都要以运行态计算样式确认 class 确实改变指定目标。预览目标的页面私有样式不得再次声明正在演示的同一 CSS 属性，例如文字预览根不得固定 `color` 覆盖 `pui-text-*`；默认效果应使用继承或只在未选择时挂 fallback utility。不能以“类名已列出”、状态里已有 class 或“构建成功”替代真实预览。

## Display、定位与层级

| 能力 | 工具类 |
| --- | --- |
| Display | `pui-block`、`pui-inline`、`pui-inline-block`、`pui-flex`、`pui-inline-flex`、`pui-grid-layout`、`pui-hidden` |
| 可见性 | `pui-visible`、`pui-invisible` |
| Box sizing | `pui-box-border`、`pui-box-content` |
| Position | `pui-static`、`pui-relative`、`pui-absolute`、`pui-fixed`、`pui-sticky` |
| Inset | `pui-inset-0`、`pui-inset-x-0`、`pui-inset-y-0`、`pui-top/right/bottom/left-0`、`pui-top/right/bottom/left-auto` |
| Z-index | `pui-z-auto`、`pui-z-0/10/20/30/40/50` |

`fixed` 和 `sticky` 受页面滚动容器与微信基础库影响；页面级固定导航、弹层和安全区优先使用已有 PoemUI 组件，而不是仅靠 utility 拼装交互。

## Flex

| 能力 | 工具类 |
| --- | --- |
| 方向 | `pui-flex-row/col/row-reverse/col-reverse` |
| 换行 | `pui-flex-wrap/nowrap/wrap-reverse` |
| 伸缩 | `pui-flex-1/auto/initial/none`、`pui-grow/grow-0`、`pui-shrink/shrink-0` |
| Basis | `pui-basis-0/auto/full/half/third/two-thirds/quarter/three-quarters` |
| Items | `pui-items-start/center/end/stretch/baseline` |
| Self | `pui-self-auto/start/center/end/stretch/baseline` |
| Justify | `pui-justify-start/center/end/between/around/evenly` |
| Content | `pui-content-start/center/end/between/around/evenly/stretch` |
| Order | `pui-order-first/last/none/1/2/3/4/5/6` |

## Grid

- 列：`pui-grid-cols-none`、`pui-grid-cols-1` 至 `pui-grid-cols-6`。
- 行：`pui-grid-rows-none`、`pui-grid-rows-1` 至 `pui-grid-rows-6`。
- 跨列：`pui-col-auto`、`pui-col-span-1` 至 `pui-col-span-6`、`pui-col-span-full`。
- 跨行：`pui-row-auto`、`pui-row-span-1` 至 `pui-row-span-6`、`pui-row-span-full`。
- 自动流：`pui-grid-flow-row/col/dense/row-dense/col-dense`。
- 自动轨道：`pui-auto-cols-auto/min/max/fr`、`pui-auto-rows-auto/min/max/fr`。
- Place：`pui-place-items-start/center/end/stretch`、`pui-place-content-start/center/end/between/around/evenly/stretch`。

所有 `fr` 轨道都使用 `minmax(0, 1fr)`，避免长文本把 390px 布局撑破。`min-content`、`max-content` 和复杂 sticky/grid 组合需要按目标微信基础库真机复核。

## Spacing

间距档位来自 `theme.wxss`：

| 名称 | Token | 默认值 |
| --- | --- | --- |
| `xxs` | `--pui-space-xxs` | `4rpx` |
| `xs` | `--pui-space-xs` | `8rpx` |
| `sm` | `--pui-space-sm` | `12rpx` |
| `normal` | `--pui-space-normal` | `20rpx` |
| `lg` | `--pui-space-lg` | `28rpx` |
| `xl` | `--pui-space-xl` | `40rpx` |
| `xxl` | `--pui-space-xxl` | `56rpx` |
| `3xl` | `--pui-space-3xl` | `72rpx` |

命名规则：

- Margin：`pui-m/mx/my/mt/mr/mb/ml-{size}`。
- Padding：`pui-p/px/py/pt/pr/pb/pl-{size}`。
- Gap：`pui-gap-{size}`、`pui-gap-x-{size}`、`pui-gap-y-{size}`。
- `normal` 省略后缀，例如 `pui-p`、`pui-mx`、`pui-gap-y`。
- `0` 支持四向、轴向和单边；margin 额外支持 `auto` 与 `pui-mx-auto` / `pui-my-auto`。

完整节奏与布局规则见 [SPACING.md](./SPACING.md)。

## Sizing、比例和溢出

| 能力 | 工具类 |
| --- | --- |
| Width | `pui-w-0/auto/full/screen/half/third/two-thirds/quarter/three-quarters` |
| Height | `pui-h-0/auto/full/screen/half/third/two-thirds/quarter/three-quarters` |
| Min | `pui-min-w-0/full/screen`、`pui-min-h-0/full/screen` |
| Max | `pui-max-w-none/full/screen`、`pui-max-h-none/full/screen` |
| 兼容别名 | `pui-full-width`、`pui-full-height` |
| Aspect | `pui-aspect-square`、`pui-aspect-video` |
| Overflow | `pui-overflow-visible/hidden/auto/scroll` 及 `pui-overflow-x-*`、`pui-overflow-y-*` |
| Object fit | `pui-object-contain/cover/fill/none/scale-down` |
| Object position | `pui-object-center/top/right/bottom/left` |

需要原生比例占位和动态比例时优先使用 `pui-aspect-ratio`；utility 的 `aspect-ratio` 只适合目标基础库已经支持该属性的简单页面。

## 字体与文本

- 角色：`pui-text-display/headline/title-lg/title-md/title-sm/body-lg/body-md/body-sm/label/caption`。
- 字族：`pui-font-sans/mono`。
- 字重：`pui-font-regular/medium/semibold/bold/heavy`。
- 颜色：`pui-text-primary/secondary/placeholder/disabled/inverse/brand/success/warning/danger/info/transparent`，以及精选 `pui-text-red/orange/amber/emerald/teal/blue/violet/pink`。
- 对齐：`pui-text-left/center/right/start/end`。
- 行高：`pui-leading-none/tight/normal/relaxed`。
- 字距：`pui-tracking-tight/normal/wide`。
- 大小写与装饰：`pui-uppercase/lowercase/capitalize/normal-case`、`pui-underline/line-through/no-underline`、`pui-italic/not-italic`。
- 空白：`pui-whitespace-normal/nowrap/pre/pre-line/pre-wrap`。
- 溢出：`pui-text-cut`（单行裁切并显示省略号）、兼容别名 `pui-text-truncate`、`pui-text-clamp-2`、`pui-text-break`。`pui-text-cut` 只用于允许省略的次要单行信息，不能用来掩盖布局错误或裁掉关键操作文案。
- 数字：`pui-tabular-nums`。

完整角色规范见 [TYPOGRAPHY.md](./TYPOGRAPHY.md)。

## 背景、边框、圆角与阴影

- 背景：`pui-bg-transparent/page/container/muted/active/brand` 以及 `success/warning/danger/info` 与对应 `-light`；精选色提供 `pui-bg-{hue}` 实色面和 `pui-bg-{hue}-soft` 柔和面。
- 边框：`pui-border`、`pui-border-0/x/y/t/r/b/l`、`pui-border-solid/dashed/dotted`。
- 边框色：`pui-border-brand/success/warning/danger/info/transparent`，以及 `pui-border-red/orange/amber/emerald/teal/blue/violet/pink`。
- 圆角：`pui-radius-none/sm/md/lg/xl/xxl/full/round`，依次读取 `0 / 12 / 16 / 24 / 32 / 40 / 999rpx` 的主题层级。
- 阴影：`pui-shadow-brand/glow/card/none`。
- 透明度：`pui-opacity-0/25/50/75/100`。

## 精选强调色

PoemUI 不复制完整的色阶矩阵，而是选择 8 个在中性黑白体系中更稳定的强调色。每个色相只公开四种直接可用的 utility，避免页面随意挑选相近色值造成漂移：

| 色相 | 文字 | 实色背景 | 柔和背景 | 边框 |
| --- | --- | --- | --- | --- |
| Red | `pui-text-red` | `pui-bg-red` | `pui-bg-red-soft` | `pui-border-red` |
| Orange | `pui-text-orange` | `pui-bg-orange` | `pui-bg-orange-soft` | `pui-border-orange` |
| Amber | `pui-text-amber` | `pui-bg-amber` | `pui-bg-amber-soft` | `pui-border-amber` |
| Emerald | `pui-text-emerald` | `pui-bg-emerald` | `pui-bg-emerald-soft` | `pui-border-emerald` |
| Teal | `pui-text-teal` | `pui-bg-teal` | `pui-bg-teal-soft` | `pui-border-teal` |
| Blue | `pui-text-blue` | `pui-bg-blue` | `pui-bg-blue-soft` | `pui-border-blue` |
| Violet | `pui-text-violet` | `pui-bg-violet` | `pui-bg-violet-soft` | `pui-border-violet` |
| Pink | `pui-text-pink` | `pui-bg-pink` | `pui-bg-pink-soft` | `pui-border-pink` |

`pui-bg-{hue}` 是饱和实色面，不会自动决定文字颜色；调用者必须显式组合可读前景。承载普通标题与正文时优先使用 `-soft` 柔和背景，再组合 `pui-text-primary` / `pui-text-secondary`。这些色相表达装饰和轻量强调，不替代 `success / warning / danger / info` 业务语义；错误、警告和成功状态仍必须使用语义类与组件状态。

## 背景渐变

- `pui-bg-gradient-neutral`：中性默认。
- `pui-bg-gradient-flowing-gold-pink`：流金粉。
- `pui-bg-gradient-premium-black`：高级黑。
- `pui-bg-gradient-cement-white`：水泥白。
- `pui-bg-gradient-black-gold`：黑金。
- `pui-bg-gradient-light-gold`：浅金。
- `pui-bg-gradient-ai-mist-blue-violet`：AI 雾蓝紫。
- `pui-bg-gradient-cyber-pink-blue`：赛博粉蓝。
- `pui-bg-gradient-aurora-violet`：极光紫。

所有预设自动读取 light/dark 的同名 Token，可直接写入任意业务 `view` 或布局容器的 `class`。例如 `class="pui-bg-gradient-black-gold pui-p-lg"`。它们只改变该节点背景，不改变间距、尺寸、圆角、层级或文字 Token；也不会隐式扩散到任何 PUI 组件内部 Surface。若需给 PUI 组件外观着色，应在其外层业务容器挂 class，而不是穿透覆盖 Button、Cell、Tag、Card 或 Popup Content。

`pui-border-solid` 只设置 `border-style: solid`，需要与 `pui-border` 或方向边框类组合才能得到可见宽度和 Token 颜色；它不会私自写死宽度或颜色。`dashed/dotted` 遵循同一组合规则。

这些类全部使用主题 Token。`ConfigProvider` 的主题、阴影和大圆角开关会改变 Token，不会改变布局类本身。

组件内部位于公开 spacing 档位之间的精细布局使用 `2rpx` 步进 Token；它们不生成额外 utility class，也不允许业务侧借此恢复任意值。全部发布组件、生成器和 H5 预览由布局合同测试阻止固定间距与圆角回流。

## 深色模式与 `pui-dark-*`

普通颜色类本身会读取当前主题 Token，因此放在 `ConfigProvider theme="dark"` 下时会自动切换。需要像 Tailwind `dark:` 一样只在深色主题覆盖某一项时，组合默认类与 WXSS 安全命名的 `pui-dark-*`：

```xml
<pui-config-provider theme="{{theme}}">
  <view class="pui-bg-container pui-dark-bg-muted pui-text-primary pui-dark-text-success pui-border pui-dark-border-brand pui-radius-lg">
    深色主题下使用 muted 表面、success 文字和 brand 边框
  </view>
</pui-config-provider>
```

`pui-dark-*` 只在 `.pui-theme--dark` 范围内生效，浅色模式不会提前覆盖默认类。32 个变体包括：

- 文本：`pui-dark-text-primary/secondary/placeholder/disabled/inverse/brand/success/warning/danger/info`。
- 背景：`pui-dark-bg-page/container/muted/active/brand`，以及 `success/warning/danger/info` 和对应 `-light`。
- 边框：`pui-dark-border`、`pui-dark-border-brand/success/warning/danger/info/transparent`。
- 阴影：`pui-dark-shadow-card/none`。

推荐由 `ConfigProvider` 管理主题范围。直接在普通 WXML 容器使用 `pui-theme--dark` 也可生效，但不能用 dark utility 伪造组件自己的 selected、disabled、loading 或 success 业务状态。

## 安全区、辅助和轻量动效

- 安全区 padding：`pui-pt/pr/pb/pl-safe`、`pui-px-safe`、`pui-py-safe`。
- 安全区定位：`pui-top/right/bottom/left-safe`。
- 可访问隐藏：`pui-sr-only`；它保留语义节点，不等于 `display:none`。
- 指针：`pui-pointer-events-none/auto`。
- 文本选择：`pui-select-none/text`。
- Transition：`pui-transition`、`pui-transition-colors/opacity/transform/none`。
- Duration：`pui-duration-fast` 为 `500ms`，`pui-duration-normal` 为 `500ms`。

系统 `prefers-reduced-motion: reduce` 下，utility transition 自动压缩为 `1ms`。组件自身仍必须遵守各自的 `duration/easing/reduceMotion` 合同，不能用 utility 覆盖业务动画状态机。

## 组合示例

```xml
<view class="pui-grid-layout pui-grid-cols-3 pui-gap-sm pui-p-lg pui-bg-page pui-dark-bg-muted pui-border pui-border-solid pui-dark-border pui-radius-lg">
  <pui-cell custom-class="pui-col-span-2 pui-min-w-0" title="源码" value="ready" />
  <pui-tag custom-class="pui-self-center" theme="success" variant="outline">npm</pui-tag>
</view>

<view class="pui-relative pui-mt-lg pui-p-lg pui-bg-container pui-border pui-border-solid pui-radius-md">
  <view class="pui-absolute pui-top-0 pui-right-0 pui-px-xs pui-py-xxs pui-bg-brand pui-text-inverse pui-radius-full">NEW</view>
  <text class="pui-text-title-sm">真实页面内容</text>
</view>

<view class="pui-bg-gradient-black-gold pui-p-lg pui-radius-lg">
  <text class="pui-text-title-sm pui-text-primary">黑金内容容器</text>
</view>

<view class="pui-bg-blue-soft pui-border pui-border-solid pui-border-blue pui-p-lg pui-radius-lg">
  <text class="pui-text-blue pui-font-semibold">蓝色强调</text>
  <text class="pui-text-secondary">柔和背景适合承载普通内容。</text>
</view>
```

官网 `#/foundation/style-utilities` 使用 PoemUI Button、Card、Icon、Tag 组成同一套五类可点击浏览器；“背景”可筛选九个可直接挂给容器的背景预设，并提供 compare/current/light/dark 四种主题视图、布局/列数/对齐/间距组合和三个视觉开关的真实 H5 镜像。H5 按 `1px≈2rpx` 展示；最终交付真相始终是 npm 中的 WXSS 文件。
