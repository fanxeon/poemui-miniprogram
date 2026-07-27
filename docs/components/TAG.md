# Tag 语义合同

## 1. 组件定位

Tag 用简短文字、可选 Icon 和语义外观标记属性、分类或状态。它不是按钮、选择器、CheckTag 或业务状态机；除可关闭标签的 Close 根外，Tag 本体不承担点击、选中、加载或提交。

## 2. 公开合同

- Props：`theme/variant/size/shape/content/icon/closable/disabled/maxWidth`。
- Events：`close`，只在可关闭且未禁用时由 Close 根触发。
- Slots：`default`，用于普通静态文字或可组合的短内容。
- Methods：无业务实例方法。

普通静态标签优先使用默认 Slot；`content` 只为表格、菜单等数据驱动父组件提供字符串入口。两者可并列渲染，但消费者应避免重复传入同一文字。

## 3. 交互边界

- Tag 根不发布 `click`，也不公开 `selected/active/loading/readonly`。需要点击、选中或异步门禁时，使用外层 PUI Button、Cell 或专门的选择组件。
- `closable=true` 只显示组件自有 Close 交互根；`close` 是删除请求，不在组件内部擅自隐藏自身。
- `disabled=true` 只锁定 Close 并显示禁用外观，不制造 click/close 反馈。
- H5 演示可由真实父级状态响应 close 后移除并重新挂载标签，但必须明确这属于父级回写。

## 4. 内容、尺寸与安全边界

- `theme` 只接受 `default/primary/success/warning/danger`，非法值回退 `default`。
- `variant` 只接受 `light/outline/dark`，非法值回退 `light`。
- `size` 只接受 `small/medium/large`，非法值回退 `medium`。
- `shape` 只接受 `square/round/mark`，非法值回退 `square`；不再保留重复的 `round` Boolean。
- `icon` 是 PUI Icon 名称字符串，不接受无法由 PoemUI Icon 兑现的对象配置。
- `maxWidth` 接受非负数字或非负 `px/rpx/%` 字符串；数字按 px 解释，非法、负数和注入式值忽略。限制生效时文字自然省略，Close 仍保持可操作。
- 空字符串、字符串 `0` 都按真实内容处理；空内容不会被 H5 私自替换成“标签”。
- 运行时只观察公开外观输入并回写派生 class/style/icon；禁止用 `**` 观察器覆盖内部派生 data，否则 `updateClass()` 的 `setData` 会在真实小程序挂载时自触发循环。

## 5. 外观与组合

- Tag 使用语义 Token 表达颜色、字号、间距、边界、毛玻璃与圆角，不创建页面私有样式体系；它是展示叶子，禁止外投影，outline/highlight 只能使用 inset 边界。
- `variant=light` 是带底色的语义标签：官网预览使用 PoemUI 的 `brand/success/warning/danger` Token 混合出可识别的浅色填充；`outline` 保持透明边界，`dark` 使用实色对比，不把三者混成同一种外观。
- `round` 形状始终满圆；`square/mark` 跟随全局大圆角 Token 的语义映射。
- Close 固定镜像 28rpx 容器与 24rpx Icon，保持双轴居中和键盘可用；它是 Tag 自有交互根，不再套 PUI Button。
- 组合在 Cell、Table、Combobox 等父组件中时，父级只负责排列和数据，不能覆盖 Tag 的尺寸、padding 或 Close 几何。

## 6. H5 镜像与演示

- H5 必须完整镜像 9 Props、Close 键盘操作、disabled 门禁、安全 maxWidth 和父级 close 回写。
- 概览按“基础用法 / 主题与变体 / 尺寸与形状 / 可关闭与长文本”分区，不堆放工程事件日志或方法卡。
- 主题与变体演示按 Tag 内容宽度自然换行，水平与垂直间距分别消费布局 Token；不同排列行的兄弟容器也必须保留独立的垂直间距，不得贴合成一条连续文字带；不得用窄固定网格轨道压缩带 Icon 的标签文本。只有明确传入 `maxWidth` 的长文本示例允许省略。
- 基础 WXML 只展示默认 Slot 的最小调用，不绑定事件；close 绑定只进入可关闭专项示例和 API Events。
- API 表格完整展示 9 Props、1 Event、1 Slot，不得省略号、nowrap 或固定高度裁切。

## 7. TDesign 1.15.3 对照决定

- 参考官方 Tag 文档与 `tdesign-miniprogram@1.15.3` 的 `tag/props.js`、`type.d.ts`、WXML/WXSS 和实现源码。
- TDesign Tag 公开 `closable/disabled/icon/maxWidth/shape/size/theme/variant` 8 Props、`click/close` 两个 Events，并提供默认、icon、closable 内容入口。
- PoemUI 保留同一外观和关闭主干，额外保留数据驱动 `content`；Icon 固定为 PoemUI 名称字符串，尺寸保持三档，变体保持 light/outline/dark。
- PoemUI 不复制根 `click`、对象 Icon、额外大尺寸、light-outline、关闭图标 Slot 或 external class；这些能力会制造与 Button/Icon/全局样式入口重复的合同。

## 8. 验收边界

- 验证五种 theme、三种 variant、三种 size、三种 shape、Icon、默认 Slot、content 的空字符串与 `0`、安全/非法 maxWidth。
- 验证 closable 的触摸/Enter/Space、disabled 门禁、父级移除与重新挂载，以及 close 只触发一次。
- 验证公开 Prop 变化只触发一次派生状态同步，内部 `rootClass/maxWidthStyle/resolvedIcon` 回写不会再次进入观察器。
- 验证 390px、light/dark、边框、阴影、毛玻璃、大圆角、渐变和 API 全文。
- 微信真机触摸反馈、样式隔离、rpx 取整、字体回流、读屏对 Close 的朗读仍需合法 AppID 复核。

## 9. 明确禁止

- 禁止恢复重复 `round` Prop；形状只能由 `shape` 表达。
- 禁止给 Tag 根增加 click/selected/loading/readonly 或伪业务状态。
- 禁止把 Close 包进 PUI Button，或让 disabled Close 继续派发事件。
- 禁止直接把未校验的 maxWidth 拼入 style。
- 禁止恢复 `**` 全量观察器或让内部派生 data 的 `setData` 重新触发 `updateClass()`。
- 禁止在 H5 用 Toast、提示文字或静态占位冒充父级真实回写。

## 10. 修改闭环

后续修改前先运行 `npm run feedback:list -- --component tag` 并阅读命中的原始 Ledger；同步检查 JS/JSON/WXML/WXSS、H5、metadata、API、示例、`miniprogram_dist` 和安装产物。完成后更新专项测试、Ledger、进度文档，并复核 390px、主题、外观开关与真实 Close 事件。
