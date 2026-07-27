# AspectRatio 组件语义合同

本文是 PoemUI AspectRatio 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component aspect-ratio`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

- AspectRatio 用 WXSS 百分比占位为媒体、封面、视频占位或嵌入内容提供稳定比例，解决小程序页面不能依赖浏览器 `aspect-ratio` 的场景。
- 它是透明的布局能力，不是图片加载器、Card、状态容器或内容裁切提示组件；图片状态使用 PUI Image，内容分区使用 Card/Cell。
- 纯 CSS utility 已能覆盖基础库支持 `aspect-ratio` 的简单页面；需要跨基础库稳定占位、可变比例、Slot 和受控溢出时才使用本组件。

## 2. 固定结构与区域

```text
AspectRatio 根（宽度与比例占位）
└── 绝对定位 Content（默认 Slot）
```

- 根以 `padding-top` 表达比值并保持 `position:relative`；Content 始终绝对覆盖该比例框。
- `overflow=true` 时根裁切超出的 Slot 内容；`overflow=false` 才允许视觉溢出。二者都不是 loading/error/empty 状态。

## 3. PUI 组合与依赖

- 组件本身没有必须内置的 PUI 子组件；消费者在默认 Slot 中按真实需要组合 PUI Image、Icon、Tag、Button 或其他内容。
- H5 演示必须复用 `iconComponent` 与 `tagSample` 表达 Slot 组合，不能手写图标或 Tag；它们只展示可组合内容，不建立第二层 Surface。
- 比例根是布局基础节点，可以使用 `view` / HTML `div`；不得以原生图片、canvas 或静态截图冒充 Slot 内容。

## 4. Token、间距与排版

- 根宽度为 100%，默认安全背景为 `--pui-bg-muted`，可选中性边界为 `--pui-border-color`，圆角使用 `none/small/medium/large` 语义 Token。
- 组件不拥有内容 padding、文字排版或兄弟 gap；这些由 Slot 内容和其父级的 PUI Token 决定。
- AspectRatio 不是独立 elevation Surface，不得获得外阴影；H5 的 0/小/中/大圆角类必须逐一映射真实 WXSS Token。

## 5. 内容、Slot 与组合边界

- 只有默认 Slot；所有可见业务内容、媒体、操作和无障碍文本都由消费者提供。
- 父级可设置比例、边界、背景和溢出，但不得覆盖 Slot 内 PUI 子组件的尺寸、padding、圆角、事件或状态。
- `overflow=true` 的裁切是布局策略，绝不能在默认预览中显示“clipped content”等工程诊断文案；如果内容会被裁切，业务必须自行选择合适媒体布局。

## 6. 状态与优先级

- 不提供 loading/error/empty/disabled 状态，也没有重试或恢复事件。
- Slot 内容为唯一内容来源；其 Image 加载失败、业务取消或重试由 Slot 内对应 PUI 组件和业务父级处理，比例根不覆盖。

## 7. 交互、受控边界与事件

- 没有受控/非受控值、事件和实例方法。`ratio`、`bordered`、`radius`、`background`、`overflow` 与动效 Props 只声明布局外观。
- 比例变化只过渡 `padding-top`，时长默认 500ms、限制 0–1000ms；低动效为 1ms。非法比例稳定回退 16:9，不能产生 NaN 或高度跳变。
- 用户对 Slot 内按钮、图片或媒体的取消、失败、重试完全透传给 Slot 消费者；AspectRatio 不吸收或伪造结果。

## 8. 可访问性

- 根不是交互控件，不伪造 role 或键盘行为；消费者为 Slot 内的图片、按钮和文字提供正确的替代文本与名称。
- `overflow=true` 不能裁切关键可访问操作或必要状态；`overflow=false` 下消费者仍要保证焦点内容不超出业务父容器。
- 预览必须保持 12px 以上可读文本，不能使用裁切/省略隐藏比例信息。

## 9. H5 预览与跨端一致性

- H5 与 WXML 都用百分比 padding 占位，不能改用浏览器专有 `aspect-ratio` 伪装成跨端实现。
- 标准预览属于 `shadow-safe`，根位于唯一 PreviewDevice scroll viewport 内；它没有私有滚动容器，也不使用 `edge-to-edge`。
- H5 的圆角、边界、背景、overflow 和低动效必须和真实 WXSS 一致；预览仅展示真实 Slot 组合与比例，不输出“Default slot”“clipped content”等工程诊断。

## 10. 响应式、主题与视觉配置

- 390px 下比例根随可用宽度缩放，Slot 内容必须自行保持可读与可操作，页面不得横向溢出。
- light/dark、bordered、largeRadius、frostedGlass、shadow 与渐变只消费全局 Token；AspectRatio 不因阴影开关成为卡片，也不改变比例或 overflow 策略。

## 11. 明确禁止

- 禁止将浏览器 `aspect-ratio` 当作小程序真实实现。
- 禁止在组件内新增 loading/error/empty、按钮、图片状态或假成功。
- 禁止把裁切策略显示成工程标签，或用裁切遮住关键 Slot 内容。
- 禁止给纯布局根添加 Card、外阴影、私有内边距或多层面板。
- 禁止用错误的 H5 radius class 导致真实 `radius` Props 失效。

## 12. 修改闭环

1. 同步审计 `aspect-ratio` 四件套、H5 Showcase/CSS、metadata、API、样例、生成器保留规则及 style utility 的相邻边界。
2. 更新本合同、`docs/COMPONENT_API.md`、`docs/H5_PREVIEW_COMPATIBILITY.md`、Feedback Ledger 和 AspectRatio 专项测试。
3. 运行 `node scripts/test-aspect-ratio.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run example:install`、`npm run pack:check`；浏览器检查桌面与 390px、深浅色及全部外观开关。
4. 微信真机仍需以合法 AppID 验证百分比占位、WXSS `overflow`、Slot 投影和样式隔离；H5 不能代替该证据。
