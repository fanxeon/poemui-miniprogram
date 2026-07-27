# PoemUI Color 色彩规范

Color 是随 npm 发布的主题 Token 文档，不是一个名为 `pui-color` 的组件。真实入口是：

```css
@import "poemui-miniprogram/theme/theme.wxss";
```

源文件为 `common/style/theme.wxss`，发布构建会原样同步到 `miniprogram_dist/common/style/theme.wxss`；`theme/theme.wxss` 是稳定的消费入口。官网色板由构建脚本直接解析源文件，不能维护一份与 WXSS 脱节的手写色值。

## 主题模式

- `page` 与 `.pui-theme--light` 使用浅色 Token。
- `.pui-theme--dark` 使用深色 Token。
- `ConfigProvider theme="light | dark | auto"` 负责给真实小程序内容应用主题类。
- 阴影、毛玻璃和大圆角开关不会改变 Color Token 的值。

## 黑白品牌阶梯

PoemUI 的品牌主轴是中性黑白，不把信息蓝当作品牌主色。

| Token | Light | Dark | 用途 |
| --- | --- | --- | --- |
| `--pui-color-brand-1` | `#fafafa` | `#18181b` | 最弱品牌背景 |
| `--pui-color-brand-2` | `#f4f4f5` | `#27272a` | 弱背景 |
| `--pui-color-brand-3` | `#e4e4e7` | `#3f3f46` | 轻边框/按压层 |
| `--pui-color-brand-4` | `#d4d4d8` | `#52525b` | 禁用与分割层 |
| `--pui-color-brand-5` | `#a1a1aa` | `#71717a` | 中间阶梯 |
| `--pui-color-brand-6` | `#71717a` | `#a1a1aa` | 中间阶梯 |
| `--pui-color-brand-7` | `#52525b` | `#d4d4d8` | 次级前景 |
| `--pui-color-brand-8` | `#3f3f46` | `#e4e4e7` | 强前景 |
| `--pui-color-brand-9` | `#27272a` | `#f4f4f5` | 强动作 |
| `--pui-color-brand-10` | `#18181b` | `#fafafa` | 最强品牌前景 |
| `--pui-color-brand` | `#18181b` | `#fafafa` | 主要操作与选中态 |
| `--pui-color-brand-hover` | `#27272a` | `#e4e4e7` | 支持 hover 平台的反馈 |
| `--pui-color-brand-active` | `#09090b` | `#d4d4d8` | 触摸按压与激活 |
| `--pui-color-brand-light` | `#f4f4f5` | `#27272a` | 品牌弱背景 |
| `--pui-color-brand-focus` | `rgba(24,24,27,.14)` | `rgba(250,250,250,.16)` | 焦点环 |
| `--pui-color-brand-disabled` | `#d4d4d8` | `#52525b` | 品牌禁用态 |

浅色主要动作 `#18181b` 对页面白色的对比度为 `17.72:1`；深色主要动作 `#fafafa` 对页面 `#09090b` 为 `19.06:1`。

## 语义色

| 语义 | Light 前景 / 弱背景 | Dark 前景 / 弱背景 | 使用边界 |
| --- | --- | --- | --- |
| Success | `#16a34a` / `#f0fdf4` | `#4ade80` / `#14301e` | 成功图标、边框、状态强调 |
| Warning | `#d97706` / `#fffbeb` | `#fbbf24` / `#34270d` | 警告图标、边框、状态强调 |
| Danger | `#dc2626` / `#fef2f2` | `#f87171` / `#381919` | 错误、危险和破坏性操作 |
| Info | `#2563eb` / `#eff6ff` | `#60a5fa` / `#172554` | 信息图标、边框和链接强调 |

语义前景色不能默认承担浅色面上的小字号正文。语义浅色背景中的标题和说明优先使用 `--pui-text-primary` / `--pui-text-secondary`，语义色用于图标、边框、标签和关键短文本。按此组合，主文本与四种语义弱背景在浅色主题下均超过 `16:1`，深色主题下均超过 `13:1`。

## 精选强调色

快速样式额外提供 8 个主题感知的强调色。每个色相由三枚 Token 组成：基础前景/边框、饱和实色背景和柔和内容背景；浅色与深色主题分别取值，不依赖页面写死十六进制色。

| 色相 | Light 前景 / 实色 / 柔和 | Dark 前景 / 实色 / 柔和 |
| --- | --- | --- |
| Red | `#dc2626` / `#dc2626` / `#fef2f2` | `#f87171` / `#b91c1c` / `#2b1517` |
| Orange | `#c2410c` / `#ea580c` / `#fff7ed` | `#fb923c` / `#c2410c` / `#30180c` |
| Amber | `#b45309` / `#d97706` / `#fffbeb` | `#fbbf24` / `#b45309` / `#2b210c` |
| Emerald | `#047857` / `#059669` / `#ecfdf5` | `#34d399` / `#047857` / `#102a22` |
| Teal | `#0f766e` / `#0d9488` / `#f0fdfa` | `#2dd4bf` / `#0f766e` / `#0d2927` |
| Blue | `#2563eb` / `#2563eb` / `#eff6ff` | `#60a5fa` / `#1d4ed8` / `#172554` |
| Violet | `#7c3aed` / `#7c3aed` / `#f5f3ff` | `#a78bfa` / `#6d28d9` / `#251845` |
| Pink | `#be185d` / `#db2777` / `#fdf2f8` | `#f472b6` / `#be185d` / `#32152a` |

例如 Violet 对应 `--pui-color-violet`、`--pui-color-violet-solid`、`--pui-color-violet-soft`，并映射为 `pui-text-violet` / `pui-border-violet`、`pui-bg-violet`、`pui-bg-violet-soft`。强调色不能冒充业务状态；状态仍使用 Success、Warning、Danger、Info。实色背景不隐式设置前景色，正文 Surface 默认选择柔和背景并显式组合中性文字 Token。

## 中性色角色

| Token | 角色 |
| --- | --- |
| `--pui-text-primary` | 标题、正文和关键数值 |
| `--pui-text-secondary` | 描述、辅助信息和次级标签 |
| `--pui-text-placeholder` | 输入占位；不承担已提交内容 |
| `--pui-text-disabled` | 不可用文本；必须同时有交互禁用语义 |
| `--pui-text-inverse` | 品牌主色面上的反色文字 |
| `--pui-bg-page` | 页面根背景 |
| `--pui-bg-container` | Card、Cell、表单和弹层容器 |
| `--pui-bg-muted` | 次级分区和弱状态背景 |
| `--pui-bg-active` | 按压、选中和当前行背景 |
| `--pui-border-color` | 默认边框与分割线 |

## 小程序用法

```json
{
  "usingComponents": {
    "pui-config-provider": "poemui-miniprogram/config-provider/config-provider",
    "pui-card": "poemui-miniprogram/card/card",
    "pui-tag": "poemui-miniprogram/tag/tag"
  }
}
```

```css
@import "poemui-miniprogram/theme/theme.wxss";

.release-card {
  color: var(--pui-text-primary);
  background: var(--pui-bg-container);
  border: 1rpx solid var(--pui-border-color);
}

.release-card__primary {
  color: var(--pui-text-inverse);
  background: var(--pui-color-brand);
}

.release-card__success {
  color: var(--pui-text-primary);
  background: var(--pui-color-success-light);
  border: 1rpx solid var(--pui-color-success);
}
```

```xml
<pui-config-provider theme="auto">
  <pui-card custom-class="release-card" title="发布状态">
    <view class="release-card__primary">主要操作</view>
    <view class="release-card__success">
      <pui-tag theme="success">构建通过</pui-tag>
      <text>npm 与微信产物一致</text>
    </view>
  </pui-card>
</pui-config-provider>
```

## 兼容与禁止项

- 核心主题只使用小程序 WXSS 可消费的十六进制、`rgba()` 和 CSS 变量，不依赖 Canvas、混合模式或浏览器专属颜色函数。
- 组件内部优先使用语义 Token，不把固定业务色散落在各组件 WXSS。
- 禁止用 `opacity` 降低整个 disabled 容器来代替独立禁用色，否则会同时损害图片、文字和子组件对比度。
- `customStyle` / `customClass` 是业务逃生口，不应成为全局换肤主路径。
- H5 官网的 `palette`、`mode`、`showValues`、`compact` 只是文档筛选，不属于任何小程序组件 API。
- H5 官网的 `accent` 色板从构建产物读取同一组 Token；禁止在官网 CSS 维护第二份固定色值。
