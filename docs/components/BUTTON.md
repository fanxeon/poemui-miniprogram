# Button 组件语义合同

本文是 PoemUI Button 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component button`

Props 与事件的完整清单以 `docs/COMPONENT_API.md` 为准；本文只规定长期语义和边界。

## 1. 组件定位

- Button 用于触发一个即时操作，也可作为微信表单和 `open-type` 能力的入口。
- 导航条目、选择项等拥有独立交互语义的组件不应为了样式机械改成 Button。
- Button 不表达业务成功；点击、授权或提交后的结果由消费者和微信平台真实回调决定。

## 2. 固定结构与区域

```text
native button
├── Loading（loading 时可见）
├── icon region（非 loading，icon 属性或 icon slot）
├── content region（content 属性与默认 slot；iconOnly 时移除）
└── suffix region（suffix slot；iconOnly 时移除）
```

- 根节点固定为微信原生 `button`，负责可用性、表单和开放能力。
- `loading` 时隐藏图标内容但保留正文区域；Loading 是唯一加载指示器。
- 空的 icon/suffix 区域不得占据 gap。

## 3. PUI 组合与依赖

- 图标必须使用 PUI Icon，加载必须使用 PUI Loading。
- 微信原生 `button` 只允许作为 Button 自身的底层平台根；页面与复合组件优先使用 `pui-button`。
- H5 镜像必须调用共享 `buttonSample`，该 helper 默认进入完整 `pui-button-preview` 合同；不得只给原生按钮补 `.pui-button` 类名，也不得让组合调用漏掉 theme/variant 的最终级联。组合消费者若接受 Button 配置对象，必须允许全部五个 `variant` 值，而不是私自把 `transparent` 静默回退为 `base`。

## 4. Token、间距与排版

- 尺寸、圆角、颜色、边框、阴影、毛玻璃、字体和 gap 使用 PUI Token。`theme=default + variant=base` 固定为 `--pui-bg-muted` 弱填充、保留中性边界且无外投影/毛玻璃；`primary/danger + base` 才是独立实色操作 Surface。`variant=transparent` 是通用的无底色、无边界、无外投影变体，仍保留 Button 的尺寸、圆角和命中区。`surface=transparent` 只用于 Tabbar 等复合导航的透明交互轨道，Button 仍保留真实原生点击根，但不得泄露背景、边界、圆角、阴影或毛玻璃；其组件根必须显式覆盖微信原生 `background-color` 并清除 `::after` 边框，不能依赖父级跨组件选择器。Tabbar 固定组合两个 transparent 入口；`shape="normal"` 根同样透明，只有 `shape="round"` 承担独立 Surface，不能以页面私有样式代替。
- 默认动效读取共享 `--pui-duration-normal` 与 `--pui-ease-standard`，Button 不公开私有 `duration/easing`。
- `reduceMotion=true` 或系统低动效时，自定义过渡压缩到 `1ms`。

## 5. 内容、Slot 与组合边界

- 默认 slot 是基础内容入口；`content` 适合数据驱动内容，两者同时存在时按 WXML 自然顺序组合。
- `icon` slot 固定在正文之前；不提供 `iconPosition`。尾部图标或 Badge 使用 `suffix` slot。
- `iconOnly=true` 保留 `icon` 属性（内部渲染真实 `pui-icon`）或 `icon` slot，并从真实组件树移除默认内容与 suffix 区域；Button 运行时根和 Icon 区域共同占用 `--pui-button-size` 的单一居中轨道（根的 `width/min/max-width/height/flex` 由 Button 内部写入）、`gap=0`、`line-height=0`，不允许空 Slot、基线、平台原生宽度或默认 gap 造成偏心。它只适用于有明确 `ariaLabel` 的纯图标操作或导航，不能用 CSS 隐藏空轨道代替。
- `block=true` 表示占满父级可用轨道且允许在窄容器内收缩为 `min-width:0`；Button 根会同时写入 `width/max-width:100%` 与满宽 Flex 轨道，确保作为 Slot 内容时也不因组件宿主收缩。不得让默认最小宽度撑破 Grid、Tabbar 或其他等分布局。
- Button 只管理自身排列，不穿透覆盖 Icon、Loading、Badge 等子组件几何。
- 实色主要/危险 Button 中的内置单色 Icon 必须跟随反色语义；实现上通过 Icon Font 的 `currentColor` 和 Icon 根的 `color: inherit` 继承 Button 前景，不能把它重置为浅色画布上的正文黑色。该适配属于 Button + Icon 共享组合合同，不改变 Icon 的公共颜色 API，也不得由页面私有样式补丁完成。

## 6. 状态与优先级

- `loading` 与 `disabled` 都使根按钮不可交互，并清空实际生效的 `open-type/form-type`。
- `loading` 优先展示 Loading；disabled 视觉不能覆盖危险、焦点等必要语义边界。
- `theme` 只保留 `default/primary/danger`；成功和警告是反馈状态，不作为默认操作主题。
- `variant` 只保留 `base/outline/text/ghost/transparent`；`transparent` 是明确、通用的透明视觉名，`ghost` 保留为兼容变体；形状由 `shape` 唯一表达。
- `surface` 只保留 `default/transparent`；它不改变 theme、variant、禁用、点击、表单或开放能力。`surface=transparent` 的 disabled Button 仍不得重新获得默认 Button 卡片外观；它与 `variant=transparent` 不可混为同一职责。

## 7. 交互与事件

- 可交互点击只触发一次 `click`，detail 为原生 detail 加 `{ source: 'button' }`。该事件以 `bubbles:true, composed:true` 发出，确保 Button 被放进 Navbar 等复合组件的命名 Slot 时，消费者在 Button 上声明的 `bind:click` 仍能真实收到事件；这不为父组件新增或伪造业务事件。
- 平台事件逐项原样转发，不改写为成功，也不合并成通用假事件。
- 基础用法不得出现任何 `bind:*`；所有事件必须集中在 API 的 Events 区。只有讲解某个具体能力时，示例才绑定该能力必需的事件。
- `loading/disabled` 时必须阻断 `click`、表单和开放能力，避免重复提交。

## 8. 可访问性

- 可访问名称依次使用 `ariaLabel`、`content`、Loading 名称和“按钮”。
- H5 使用真实 HTML button 获得 Enter/Space、焦点和 disabled 语义；小程序使用原生 button。
- 纯图标按钮必须显式提供 `ariaLabel`，关键操作不得用省略隐藏。

## 9. H5 预览与跨端一致性

- Button 预览采用 `shadow-safe` 父布局，避免正常阴影被 PreviewDevice 裁切。
- 概览按“基础用法 / 组件类型 / 组件状态 / 组件样式”分区，不展示 Props 数量、事件日志或平台参数诊断卡。
- 首个分区不增加额外顶部空白；后续分区标题在共享内容 gap 之外追加 `--pui-preview-section-gap`，让连续按钮内容与下一标题保持清晰层级。
- 常规模式左侧的“组件引用 / 基础用法”代码段必须分别提供 PUI Copy IconButton；复制内容继续从 `makeUsageCode` 同源提取，不得维护 Button 私有代码字符串。
- Props 驱动按钮必须真实响应内容、主题、变体、尺寸、形状、块级、图标、加载、禁用和低动效。
- H5 可用真实 HTML form 验证 submit/reset；授权、客服、分享、手机号、直播、设置和拉起 App 只保留可检查属性，不伪造平台结果。
- 基础 Button 的外阴影必须只在自身有独立 Surface 资格时可见；若组合容器后接不透明 Surface，容器使用 `pui-preview-elevation-clearance` 预留 `--pui-preview-shadow-bleed`，不得被后续内容或 `overflow:hidden` 截断。
- 属性页兼容说明必须逐字列出当前 `default/primary/danger` 与 `base/outline/text/ghost/transparent`，不得保留已删除的主题或 `dashed`；`ghost` 是保留兼容值，不得阻止 `transparent` 成为明确的通用透明视觉入口。

## 10. 响应式、主题与视觉配置

- 390px 下按钮行允许自然换行，block 按钮保持可用，不得造成页面级横向溢出。
- light/dark 和边框、阴影、毛玻璃、大圆角开关必须作用到真实 Button 计算样式。
- light/dark 下主要/危险实色 Button 的正文与内置 Icon 都必须保持同一反色对比度；outline/text/ghost/transparent 不应用实色反色规则。
- `round/circle` 始终为满圆语义；大圆角配置不能破坏它们。
- 渐变只属于页面和 PreviewDevice 画布，不进入 Button Surface。

## 11. 明确禁止

- 禁止把全部 `bind:*` 写进基础 WXML、复制代码或概览演示。
- 禁止恢复 `round/ghost` 布尔别名、`iconPosition`、`dashed`、`success/warning` 按钮主题或私有 `duration/easing`。
- 禁止把完整 Loading API 透过 `loadingProps` 泄漏；只接受 `size/theme/text/ariaLabel`。
- 禁止在 H5 用提示文字冒充微信开放能力成功。
- 禁止用静态图片、字符图标或假 Spinner 替代 PUI Icon/Loading。

## 12. TDesign 1.15.3 对照决定

- TDesign 安装包真实声明 30 项 Button Props，PoemUI 为 31 项；`iconOnly` 是为真实纯图标 Button 内部轨道提供的 PoemUI 语义，`surface` 使 Tabbar 等复合导航不再依赖跨组件样式覆盖 Button 的可见 Surface，不能用属性数量判断成熟度。
- 不采用 TDesign 的 `light` 主题、`dashed` 变体、`ghost` Boolean、`tId`、`customDataset` 和表单 `type` 命名。轻量视觉统一由 `variant` 表达，表单动作使用 `formType`。
- `variant=transparent` 是 PoemUI 基于真实用户意图新增的第五个视觉变体：无底色、无边界、无外投影，但保留常规 Button 几何；TDesign 当前没有同名枚举。`surface=transparent` 仍是不同的复合容器边界能力，不是主题，也不等同于这个视觉变体；它只能在父级已承载唯一导航/选择 Surface 时使用，并额外移除 Button 自身圆角。
- PoemUI 额外显式提供 `ariaLabel` 与 `reduceMotion`；它们分别承接可访问名称和全局低动效合同。
- TDesign 的 Loading Props 基本完整透传；PoemUI 有意只保留 `size/theme/text/ariaLabel`，防止 Button 内部布局与 Loading 行为失控。
- TDesign 的 `tap` 与 PoemUI 的 `click` 都只在可交互状态触发；十一类微信平台事件保持原样转发。命名差异不应通过重复事件别名解决。
- 以后升级 TDesign 参考版本时，先在 Ledger 中解释新增/删除能力是否代表独立用户意图，不得自动同步属性。

## 13. 修改闭环

1. 同步审计 `button/`、依赖组件、metadata、H5、Props、WXML、API、示例、安装产物和 Ledger。
2. 更新 `scripts/test-button.js`，运行 `npm run site:build`、`npm run check` 与 `npm run pack:check`。
3. 在真实浏览器验证点击、表单、禁用、加载、Props、390px、深浅色和外观开关。
4. 涉及安装产物时同步 `_example`、`miniprogram_dist` 与微信 `miniprogram_npm`，并保留真机平台事件风险。

任何不能满足本文的实现必须在 Feedback Ledger 中说明原因，不得静默绕过。
