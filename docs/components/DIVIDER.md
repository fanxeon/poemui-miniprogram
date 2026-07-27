# Divider 组件语义合同

本文是 PoemUI Divider 的长期设计与实现合同。任何 Agent 修改 Divider 源码、H5 镜像、示例、元数据或安装产物前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component divider`

完整 Props 与 Slots 以 `docs/COMPONENT_API.md` 为准；本文规定长期语义、组合边界和 TDesign 对照决定。

## 1. 组件定位

- Divider 是可承载短文字或默认 Slot 的展示型分割线，用于表达内容区块的层级与节奏。
- Divider 不承担点击、禁用、只读、选中、loading、empty、error、retry、动画、事件或实例方法。

## 2. 固定结构

```text
view.pui-divider[role=separator]
├── line.before（仅横向）
├── content（仅横向且 content/showContent 生效）
│   └── default slot，content 为后备文字
└── line.after（横向第二段或纵向唯一线条）
```

- 默认横向且无内容时，两段线条必须连续，不得因根节点 gap 留出视觉断口。
- 内容间距只属于 `.pui-divider__content`；无内容时不能产生 margin、gap 或空节点。
- 纵向模式只渲染唯一线条，忽略 `content/showContent/align`，不得显示空内容容器。
- 非法 `layout/align` 分别回退 `horizontal/center`，不能把无效字符串写进类名。

## 3. 内容与 Slot

- `content` 是默认 Slot 的后备短文字；调用者提供 Slot 时由小程序 Slot 语义自然覆盖后备内容。
- `showContent=true` 允许在 `content` 为空时显式挂载默认 Slot，解决小程序组件无法可靠侦测 Slot 是否存在的问题。
- 基础用法必须是 `<pui-divider />`；文字、对齐、虚线和 Slot 各自进入专项示例，基础代码不堆叠能力。
- 内容单行收缩且不得撑破 390px；如果业务需要段落说明，应放在 Divider 外部，不把长文塞进分割线。

## 4. 视觉与 Token

- 线色使用专属 `--pui-divider-color`，文字使用 `--pui-text-placeholder`，内容间距使用 `--pui-space-normal`。它在浅色与深色均为 `#a1a1aa`，让 1px 细线在两种页面底色中都能第一眼辨识；它表达内容层级，不属于可关闭的 Surface 边界，边框总开关关闭时仍必须可见。
- 横向默认宽度 100%；纵向固定 `1rpx × 32rpx`。不得增加 Surface、padding、圆角、阴影或毛玻璃。
- `dashed` 只改变线型，不改变盒模型、长度、内容间距或对齐。
- left/right 对齐只缩短内容一侧的短线，不通过绝对定位或魔法偏移移动文字。

## 5. 可访问性

- 根节点使用 `role=separator` 并声明与真实布局一致的 `aria-orientation`。
- `decorative=true` 是默认值，此时 `aria-hidden=true`；纯视觉节奏不应制造重复朗读。
- 具有结构语义时传 `decorative="{{false}}"` 并提供清楚的 `ariaLabel`。
- Divider 不可聚焦、不绑定点击，也不伪造键盘交互。

## 6. H5 预览

- 概览固定分为“基础用法 / 文字与对齐 / 布局与线型”，后续分区使用共享 section gap。
- 第一项由当前 Props 驱动；固定示例只帮助比较，不覆盖 Props 的真实作用。
- H5 必须镜像原生的 line/content 条件、默认 Slot、对齐、虚线、语义与回退；不得用工程状态 Cell 包装静态线条。
- 纵向示例与 PUI Tag 等真实内容组合，但 Divider 自身不得获得卡片背景、边框或圆角。
- 复制代码调用统一 WXML 真相源，只输出非默认 Props，基础默认代码零 `bind:*`。

## 7. 响应式与外观

- 390px 下所有分区、代码和属性必须无页面级横向溢出；Divider 内容允许自身单行收缩。
- light/dark 通过 `--pui-divider-color` 与文字 Token 更新线条和文字；边框总开关关闭不得令 Divider 透明或改变其几何。
- 阴影、毛玻璃、大圆角、渐变和低动效不得改变 Divider 几何；组件没有私有动画，也不需要 `reduceMotion` Prop。
- disabled、readonly、loading、empty、error、retry、受控/非受控、事件顺序和实例方法对 Divider 均为不适用，禁止为满足演示清单伪造状态。

## 8. TDesign 1.15.3 对照决定

- 2026-07-23 已联网读取 [TDesign Divider 官方页](https://tdesign.tencent.com/miniprogram/components/divider)、[TDesign 小程序仓库](https://github.com/Tencent/tdesign-miniprogram)，并通过 NPM 固定包 `tdesign-miniprogram@1.15.3` 读取 `miniprogram_dist/divider/{props.js,divider.wxml,divider.wxss}`。官方页面可访问但动态正文未被抓取；API 取舍以固定包源码为准。
- TDesign Divider 安装包公开 `align/content/dashed/layout`，并提供命名 `content` Slot；公共层另有 class/style 能力。
- PoemUI 保留同名四项核心能力，额外保留 `showContent` 以解决默认 Slot 显隐的确定性问题，保留 `decorative/ariaLabel` 作为显式可访问合同。
- PoemUI 继续使用默认 Slot，不为对齐外部库强制改成命名 Slot；当前默认 Slot 已稳定服务 Tag、Icon 等组合，改名只会制造破坏性迁移。
- 拒绝 `lineColor`、任意外部 class 或重复 style API；主题线色和长度由 Divider 的布局与 Token 合同统一管理。
- 参考 TDesign 的连续默认线、内容两侧间距、横竖布局与分区演示，但不复制其内部公共基类或 API 数量。

## 9. 明确禁止

- 禁止在根节点恢复无条件 gap，导致无内容 Divider 中心断开。
- 禁止给 Divider 增加 click、disabled、loading、状态文案或假反馈。
- 禁止把纵向 Divider 包进组件私有 Surface 来模拟内容区域。
- 禁止在基础 WXML 中展示 Slot、虚线、对齐或任何 `bind:*`。
- 禁止让 H5 与 WXML 使用不同的内容显隐、线段数量或 ARIA 方向语义。

## 10. 修改闭环

1. 同步审计 Divider 四件套、metadata、H5、API、示例、生成器保护、dist、安装产物和 Ledger。
2. 更新 `scripts/test-divider.js`，至少覆盖默认连续线、横竖/对齐回退、内容/Slot 显隐、虚线、ARIA 和基础 WXML。
3. 浏览器验证所有 Props、复制、桌面/390px、深浅色及全部视觉开关。
4. 运行 site/check/pack；微信 CLI 不可用时保留 pending-cli，不能把 H5 通过等同安装产物完成。

任何不能满足本文的实现必须记录进 Feedback Ledger，不得静默绕过。
