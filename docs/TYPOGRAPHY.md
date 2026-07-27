# PoemUI Typography

Typography 是随 npm 发布的字体 Token 与 WXSS 工具类，不是独立的 `pui-typography` 组件。真实入口：

```css
@import "poemui-miniprogram/theme/utilities.wxss";
```

`utilities.wxss` 已包含 `theme.wxss`。如果页面只需要 Token，不使用工具类，也可以只引入：

```css
@import "poemui-miniprogram/theme/theme.wxss";
```

## 字体角色

| 角色 | 工具类 | 字号 / 行高 | 默认字重 | 用途 |
| --- | --- | --- | --- | --- |
| Display | `pui-text-display` | `64rpx / 80rpx` | `800` | 核心数字、极少量展示信息 |
| Headline | `pui-text-headline` | `48rpx / 64rpx` | `700` | 页面大标题 |
| Title Large | `pui-text-title-lg` | `40rpx / 56rpx` | `700` | 一级区块标题 |
| Title Medium | `pui-text-title-md` | `36rpx / 50rpx` | `600` | 卡片标题 |
| Title Small | `pui-text-title-sm` | `32rpx / 46rpx` | `600` | 列表分组标题 |
| Body Large | `pui-text-body-lg` | `32rpx / 46rpx` | `400` | 导语与重点正文 |
| Body Medium | `pui-text-body-md` | `28rpx / 40rpx` | `400` | 默认正文 |
| Body Small | `pui-text-body-sm` | `26rpx / 38rpx` | `400` | 辅助正文 |
| Label | `pui-text-label` | `26rpx / 36rpx` | `500` | 字段和操作标签 |
| Caption | `pui-text-caption` | `24rpx / 34rpx` | `400` | 时间、单位与短说明 |

Title Small 与 Body Large 可以共享相同字号和行高，但语义和默认字重不同。不要只看字号选择角色。

## Token

### 字族

- `--pui-font-family-sans`：系统无衬线字体栈，优先使用 Apple / Windows / 中文系统字体。
- `--pui-font-family-mono`：用于代码、版本和需要等宽阅读的值。H5 官网通过本地 WOFF2 以独立字体族名 `PoemUI JetBrains Mono` 自托管 JetBrains Mono，避免与系统安装字体或旧缓存碰撞，并以 Menlo / Consolas 等系统字体回退；小程序安装包不携带字体资源，直接使用系统等宽栈。代码阅读区关闭连字，正文不得低于 Body Medium `14px / 20px`。
- 语义 `<code>` 受浏览器默认 `monospace` 规则影响；放在 PUI 代码 Surface 内时必须显式 `font-family: inherit`，并验收 `pre → code → 实际语法节点` 三层计算字体，不能只检查外层容器。

PoemUI 不在 npm 小程序包中内置远程字体文件。H5 官网单独自托管 JetBrains Mono Regular WOFF2，避免依赖访问第三方字体 CDN；不同设备的回退字体仍可能不同，核心布局不能依赖逐字像素一致。

H5 官网使用同名 Token 按 `1px≈2rpx` 镜像整套字体角色，并把 `--pui-font-family-sans` 作为唯一页面字体栈。组件预览 CSS 不得重新写死字号、行高或数字字重；Caption `24rpx/34rpx`（H5 `12px/17px`）是最小可见角色。

### 字重

- `--pui-font-weight-regular: 400`
- `--pui-font-weight-medium: 500`
- `--pui-font-weight-semibold: 600`
- `--pui-font-weight-bold: 700`
- `--pui-font-weight-heavy: 800`

对应工具类：`pui-font-regular`、`pui-font-medium`、`pui-font-semibold`、`pui-font-bold`、`pui-font-heavy`。

### 字间距

- `--pui-letter-spacing-tight: -0.02em`：Display、Headline 和主要 Title。
- `--pui-letter-spacing-normal: 0`：默认正文和标签。
- `--pui-letter-spacing-wide: 0.04em`：短 Caption。

中文长正文不要使用 wide；全大写英文标签也不能靠过大字间距制造层级。

## 兼容别名

旧版 Token 保留并映射到正文层级：

- `--pui-font-size-small` → `--pui-font-size-body-small`
- `--pui-font-size-medium` → `--pui-font-size-body-medium`
- `--pui-font-size-large` → `--pui-font-size-body-large`
- `--pui-line-height-small` → `--pui-line-height-body-small`
- `--pui-line-height-medium` → `--pui-line-height-body-medium`
- `--pui-line-height-large` → `--pui-line-height-body-large`
- `--pui-font-size-mini` → `--pui-font-size-caption`
- `--pui-line-height-mini` → `--pui-line-height-caption`

新代码优先使用角色 Token 或角色工具类，旧别名只用于向后兼容。

## 文本颜色与溢出

文本颜色工具类：

- `pui-text-primary`
- `pui-text-secondary`
- `pui-text-placeholder`
- `pui-text-disabled`
- `pui-text-inverse`

溢出与数字：

- `pui-text-cut`：单行裁切并显示省略号；`pui-text-truncate` 保留为兼容别名。只用于允许省略的次要信息，关键操作和状态不得依赖裁切。
- `pui-text-clamp-2`：两行省略。
- `pui-text-break`：长链接、哈希和无空格文本强制换行。
- `pui-tabular-nums`：支持时使用等宽数字。

省略前必须给元素或父容器明确宽度，并允许 flex/grid 子项 `min-width: 0`。两行省略依赖 `-webkit-line-clamp`；旧基础库不支持时仍会通过 `overflow` 和 `word-break` 保持容器安全，但不保证恰好两行。

## WXML 示例

```xml
<pui-card title="发布摘要">
  <view class="pui-text-headline pui-text-primary">原生组件，真实交付</view>
  <view class="pui-text-body-md pui-text-secondary">
    正文使用固定角色 Token，不随页面临时放大缩小。
  </view>
  <view class="pui-flex pui-items-center pui-gap-sm">
    <text class="pui-text-label">构建状态</text>
    <pui-tag theme="success" variant="outline">passed</pui-tag>
  </view>
  <view class="pui-text-caption pui-text-secondary pui-text-cut">
    很长的说明会在单行边界内真实省略。
  </view>
  <pui-cell title="版本" value="0.1.0" />
</pui-card>
```

## 使用边界

1. Caption 是 `24rpx` 的全库可读下限；Body Small 与 Label 提升到 `26rpx`，不为塞入更多信息继续缩小。
2. 核心状态不能只靠字重区分，同时使用位置、明确文案和文本颜色 Token。
3. Display 与 Headline 只用于短文本；长标题降级到 Title，正文降级到 Body。
4. H5 官网按 `1px≈2rpx` 展示相同 Token；HTML 标题标签的语义不是 WXML 实现前提。
5. Typography 没有显隐或切换动画；阴影、毛玻璃和大圆角不改变字体指标，深浅色只改变文本颜色。
6. `npm run check` 会扫描全部组件、示例和 H5 镜像：小程序固定字号低于 `24rpx`、H5 固定字号低于 `12px` 会直接阻断交付。
7. `pui-leading-none/tight/normal/relaxed` 读取主题中的比例行高 Token，不在 Utilities 中重复维护数字。

设计角色参考 [TDesign Design Token](https://tdesign.tencent.com/starter/docs/vue/design-token) 的 display/headline/title/body 分层，以及 [shadcn/ui Typography](https://ui.shadcn.com/docs/components/base/typography) 的开放样式组合方式；具体数值、类名和小程序兼容策略均以 PoemUI 本文档为准。
