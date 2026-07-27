# Grid 语义合同

## 1. 组件定位

Grid 用于组织快捷操作和功能入口。它不是选择器、菜单路由器或业务请求状态机：入口点击只发布动作意图，Grid 不维护 selected/active，也不替消费者完成导航或重试。

## 2. 公开合同

- Props：`items/column/gutter/border/align/disabled/loading/error/loadingText/errorText/emptyText/retryText/ariaLabel/reduceMotion`。
- Events：`click/retry`。
- Slots：无。入口内容由稳定的 item schema 驱动，复杂自由布局应使用 List、Cell 或业务容器。
- Methods：无业务实例方法。

`items` 每项支持 `label/description/value/icon/badge/theme/disabled/ariaLabel`。字符串、数字和布尔值也可直接作为入口；`value` 的 `0/false/''` 与空 label/icon 必须原样保留。

## 3. 布局与交互

- `column=1–6` 渲染固定列；`column=0` 渲染单行横向 `scroll-view`，不得把 0 当成默认值 4。
- `gutter` 以 rpx 表达并限制 0–64；H5 固定按 `1px≈2rpx` 镜像。
- `align` 只控制入口内部的 center/left 对齐；`theme` 属于 item，而不是整组顶层外观。
- Item 使用内部 PUI Button，Badge 包裹 Icon；disabled Item 与根 disabled 均真实阻断 click。
- Grid 根和 Item 是连续入口布局，不获得外投影；`border=true` 只以 inset 分隔线区分入口，loading/error/empty 状态容器可负责背景与边线但不把每个条目提升为卡片。
- click detail 固定为 `{index,item,value,source}`，不改变任何选中态。

## 4. 状态与重试

- 状态优先级固定为 `error > loading > content > empty`。
- loading 使用共享 PUI Loading，并把 loadingText 交给 Loading 本体，不在父层重复拼文字。
- error/empty 使用共享 PUI Empty；父状态容器是唯一 Surface，嵌入 Empty 必须透明。
- `retryText=''` 隐藏错误操作。点击重试只发布 `{source}`，Grid 保持 error，直到父级真实回写 error/loading/items。
- 内容、loading、error、empty 层始终保留，以 500ms opacity/transform 切换；`reduceMotion` 与系统低动效压缩为 1ms，不使用 `display:none`、状态 `wx:if` 或 `height:auto` transition。

## 5. H5 镜像与演示

- 概览按“基础用法 / 列数与间距 / 徽标与禁用 / 加载、空与错误”分区。
- 基础 WXML 只展示 `items="{{entries}}"` 等完成任务所需属性，不绑定事件；click/retry 进入 API Events 和专项示例。
- 当前 Props 的入口真实可点击；点击结果由演示父级回写可见 Tag。错误重试保持错误态，只显示“已请求重试，等待父级更新”。
- API 完整展示 14 Props、2 Events、0 Slots、0 Methods，文字允许自然换行且禁止省略号。

## 6. TDesign 1.15.3 对照决定

- 参考官方 Grid 文档与 `tdesign-miniprogram@1.15.3` 安装包的 `grid/grid-item` props、类型、WXML/WXSS 和实现源码。
- TDesign Grid 公开 6 Props，GridItem 公开 8 Props 并负责 click/导航；PoemUI 保持单个数据驱动 Grid 包，避免消费者为常见入口重复声明父子组件。
- 借鉴 `column=0` 横向滚动、column/gutter/border/align 和 Item 的 icon/badge/description/disabled 主干。
- 不复制 GridItem 独立包、image/imageProps、jumpType/url、完整 badgeProps 或顶层 hover/theme；图片入口与真实导航分别由 Image/Cell 等组件承担。
- PoemUI 增加可交付页面需要的 loading/error/empty/retry 与低动效，但重试始终是父级请求，不制造假成功。

## 7. 明确禁止

- 禁止恢复 `showFooter/footer slot`、顶层 `theme/hover` 或可变 `duration/easing`。
- 禁止增加 selected/active/readonly/受控值；选择任务应使用 Checkbox、Radio、ToggleGroup 或 Tabs。
- 禁止在 H5 手写非 PUI Button、Badge、Loading、Empty，或让错误重试自动清除 error。
- 禁止把 `0/false/''` 当无值替换，也禁止让固定展示数据污染源码默认 Props。
- 禁止用 `wx:if`/`display:none` 卸载四类主状态制造瞬移。

## 8. 验收与真机风险

- 验证默认、column 0/1–6、gutter 边界、border、align、根/单项 disabled、badge、description 与五种 item theme。
- 验证 loading/error/empty 优先级、retryText 空值、click/retry 顺序、0/false/空字符串和 1ms 低动效。
- 验证 390px、横向局部滚动、light/dark、边框、阴影、毛玻璃、大圆角、渐变和 API 全文。
- 微信真机仍需复核 scroll-view 惯性、rpx 分隔线、Button 触摸反馈、Badge 定位、辅助技术与系统低动效。

## 9. 修改闭环

后续修改前先运行 `npm run feedback:list -- --component grid` 并阅读命中的原始 Ledger；同步检查四件套、内部依赖、H5、metadata、API、示例、专项测试、`miniprogram_dist` 与安装产物。完成后更新 Ledger、进度文档并复跑完整门禁。
