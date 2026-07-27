# PoemUI Design Tokens

PoemUI 的样式基础来自 `common/style/theme.wxss`。组件只能引用 token，不直接写业务色。

完整色值、语义用途、对比度边界和 WXML/WXSS 示例见 [COLOR.md](./COLOR.md)。

完整字体角色、字号/行高/字重、工具类与溢出策略见 [TYPOGRAPHY.md](./TYPOGRAPHY.md)。

完整间距阶梯、margin/padding/gap 工具类与布局边界见 [SPACING.md](./SPACING.md)。

## 颜色模式

当前内置：

- `pui-theme--light`
- `pui-theme--dark`

默认 token 同时挂在 `page` 上，未使用 `ConfigProvider` 时使用浅色。

## 核心 Token

### 品牌与功能色

PoemUI 参考 TDesign 的主题色、功能色、中性色分层方式，但品牌主色不使用蓝色，而以黑白中性色为主轴。

- `--pui-color-brand-1` 到 `--pui-color-brand-10`
- `--pui-color-brand`
- `--pui-color-brand-hover`
- `--pui-color-brand-active`
- `--pui-color-brand-focus`
- `--pui-color-brand-disabled`
- `--pui-color-brand-light`
- `--pui-color-brand-gradient-end`
- `--pui-color-success`
- `--pui-color-warning`
- `--pui-color-danger`
- `--pui-color-info`

品牌色规则：

- 浅色模式：`brand` 为接近黑色的主动作色。
- 深色模式：`brand` 为白色主动作色。
- 信息蓝只作为 `info` 语义色，不作为 PoemUI 品牌主色。

### 文本

- `--pui-text-primary`
- `--pui-text-secondary`
- `--pui-text-placeholder`
- `--pui-text-disabled`
- `--pui-text-inverse`

### 背景

- `--pui-bg-page`
- `--pui-bg-container`
- `--pui-bg-muted`
- `--pui-bg-active`

### 表面层

- `--pui-glass-surface`
- `--pui-glass-surface-strong`
- `--pui-glass-tint`
- `--pui-glass-border`
- `--pui-glass-highlight`
- `--pui-glass-shadow`
- `--pui-glass-shadow-soft`

### 阴影与毛玻璃

- `--pui-shadow-card`
- `--pui-shadow-brand`
- `--pui-shadow-glow`
- `--pui-shadow-none`
- `--pui-frosted-filter`
- `--pui-frosted-filter-soft`

### 形状与动效

- `--pui-radius-small`
- `--pui-radius-medium`
- `--pui-radius-large`
- `--pui-radius-xlarge`
- `--pui-radius-xxlarge`
- `--pui-radius-round`
- `--pui-duration-fast`
- `--pui-duration-normal`

`large-radius` 必须整体重映射 `small/medium/large/xlarge/xxlarge` 语义圆角。普通模式依次为 `12/16/24/32/40rpx`，大圆角模式依次为 `18/28/40/48/56rpx`；H5 使用 `6/8/12/16/20px → 9/14/20/24/28px` 镜像。`round/circle` 是显式形状，不参与该缩放。

### 间距

- `--pui-space-xxs`
- `--pui-space-xs`
- `--pui-space-sm`
- `--pui-space-normal`
- `--pui-space-lg`
- `--pui-space-xl`
- `--pui-space-xxl`
- `--pui-space-3xl`
- `--pui-panel-padding-compact` / `--pui-panel-padding` / `--pui-panel-padding-spacious`
- `--pui-section-gap`：同一表面内主要语义分区，默认 `36rpx`。
- `--pui-content-gap`：同一内容区内直接关联元素，默认 `16rpx`。
- `--pui-space-step-1` 至 `--pui-space-step-36`：组件内部 `2rpx` 步进原语；业务页面仍优先使用语义档位。

### 字体

- `--pui-font-family-sans` / `--pui-font-family-mono`（H5 代码优先自托管 JetBrains Mono，小程序使用 Menlo / Consolas 系统回退，并关闭代码阅读区连字）
- `--pui-font-size-caption` / `label`
- `--pui-font-size-body-small` / `medium` / `large`
- `--pui-font-size-title-small` / `medium` / `large`
- `--pui-font-size-headline` / `display`
- 对应的 `--pui-line-height-*`
- 比例行高 `--pui-line-height-none` / `tight` / `normal` / `relaxed`
- `--pui-font-weight-regular` / `medium` / `semibold` / `bold` / `heavy`
- `--pui-letter-spacing-tight` / `normal` / `wide`

## 规则

1. 新组件必须先确认是否已有 token 可用。
2. 新组件优先使用品牌、功能、中性色 token，而不是单独写固定颜色。
3. 深色模式不能简单反转颜色，要保证文本、禁用态、分割线、点击态都有独立 token。
4. 阴影在深色模式要弱化，优先使用背景层级表达空间关系。
5. 组件的 `customStyle` 只作为逃生口，不作为主题主路径。
6. 需要支持 `ConfigProvider` 的 3 个视觉主开关：`shadow`、`frosted-glass`、`large-radius`。
7. `frosted-glass` 只控制模糊滤镜，不要和阴影或圆角状态写死为同一个状态。
