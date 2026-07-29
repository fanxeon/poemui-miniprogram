# DynamicMessage 灵动通知组件语义合同

本文是 PoemUI DynamicMessage 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或 Token 前，都必须完整阅读本文，并先运行：

`npm run feedback:list -- --component dynamic-message`

Props、Events、Methods 的完整清单以 `docs/COMPONENT_API.md` 为准；本文只记录长期语义和边界。

## 1. 组件定位

- DynamicMessage 是页面顶部、非模态、可原位更新的轻量实时通知，视觉借鉴 iOS 灵动岛的“紧凑起点 → 展开消息 → 收拢离场”，但不复制系统外观或冒充系统通知。
- 它适合上传、生成、同步、发布等从 loading 演进到 success/error 的短链路；Toast 负责单条瞬时反馈，NoticeBar 负责常驻公告，Dialog 负责阻塞确认。
- `show()` 只表示通知已展示，不代表业务成功；真实完成必须由业务调用 `update(key,{theme:'success'})`。

## 2. 固定结构与区域

```text
fixed top layer（无 Overlay、不阻断页面）
└── retained island surface
    ├── transient semantic edge flow（装饰、无语义）
    ├── PUI Loading 或 PUI Icon
    ├── title + message
    ├── PUI Button action（可选）
    └── PUI IconButton close（可选）
```

- 每条当前消息从挂载到退场始终复用同一个 Surface 节点；同 key 更新只替换内容和主题，不重播入场。
- 不同 key 按调用顺序排队；当前 `duration=0` 的持久任务必须由调用方 update/hide 后，下一条才显示。
- Surface 不使用 Overlay，不锁滚动、不抢焦点；左右 `28rpx` 安全边界与系统顶部安全区必须真实生效。

## 3. PUI 组合与依赖

- loading 主题必须复用 `pui-loading`，语义图标必须复用 `pui-icon`，动作与关闭必须复用 `pui-button`。
- Close 是圆形 PUI IconButton；Action 是文字 PUI Button。不得用字符 `×`、原生 button 或临时 SVG。
- H5 必须调用共享 Loading/Icon/Button 镜像帮助器，不得只给原生节点套 `.pui-*` 类名。

## 4. Token、间距与动效

- Surface 固定使用深色中性反色身份面，不属于 `primary` 主题：浅色模式下仍保持 `#09090b` 黑底与浅色正文，深色模式下继续作为独立高对比浮层。`theme` 只改变 Icon 色与从展开阶段开始的一次性单束流光；不能让 success/error 把整个通知染成大色块。
- 内距、gap、字号、行高和圆角使用 PUI Token；title/message 之间只用紧密信息间距。
- 进场不是整张卡片的一段线性缩放：先用 `180ms` 让只含 PUI Icon/Loading 与 title 的紧凑胶囊从顶部落下，再用 `320ms` 横向、纵向长成完整面板；message、Action、Close 在第二阶段淡入。
- 旧的左侧满高竖向 accent 与“整段边框依次换色”的伪流动都已废弃。当前结构必须由一个 `edge-flow` 裁切轨道和内部唯一 `edge-beam` 组成：轨道仅暴露小程序 `6rpx` / H5 `3px` 的顶部与右侧 L 形区域，单束对角渐变从顶部经过右上角继续向右侧移动。它在进入 `expanding` 时启动，独立播放 `1500ms`，允许在面板完成 `320ms` 展开后继续短暂经过 `visible`，随后自动清除；不能用整条上边/右边同时变色冒充移动，也不能循环、呼吸、改变布局或成为常驻彩边。
- 流光没有独立 Prop、事件或业务语义，必须与 Icon 共用当前主题的语义色变量：`loading=中性灰`、`info=信息蓝`、`success=成功绿`、`warning=警告橙`、`error（失败）=危险红`。不得把流光固定成绿色、primary 或白色，也不得用状态色整块染色 Surface；`aria-hidden=true`、`pointer-events:none`。`reduceMotion=true` 和系统低动效必须完全取消流光，而不是把它压缩成一次闪烁。
- `edge-flow` 是 Surface 内的绝对定位装饰兄弟层，Content、Action 与 Close 位于它之上；它只改变自身 `opacity/background-position`。启动、结束、关闭和低动效都不得改写、覆盖或卸载根 Surface 的 `background`、`backdrop-filter`、`box-shadow`，因此毛玻璃在流光结束后必须连续保留。
- `shadow` 与 `frostedGlass` 是 DynamicMessage 的组件私有三态开关：`null` 继承 ConfigProvider，`true` 强制当前通知开启，`false` 强制当前通知关闭。二者只改变 Surface 效果，不写入全局 `visualConfig`，也不改变边框、圆角、尺寸、状态色、流光路径或动画时序。
- 退场必须严格反向：先用 `320ms` 收起 message、Action、Close 和完整面板，回到只含 Icon 与 title 的紧凑胶囊；再用 `180ms` 让胶囊向上淡出，之后才能卸载节点并触发 `close`。
- 单次完整进场或退场仍固定为默认 `500ms`，公开交互动效上限合同仍为 `1000ms`；`1500ms` 只属于不可配置、不阻塞交互的一次性 edge-flow 装饰例外。`reduceMotion=true` 跳过可感知分段并压缩为 `1ms`，同时完全不启动流光。
- 禁止 transition `height:auto`、`display:none` 瞬移、把标题和正文一起缩放，或在收拢完成前销毁节点。宽高变化使用明确的 `max-width / min-height / max-height` 边界，文本在 Surface 展开期间单独淡入，保持可读。
- `duration` 是进入完成后的停留时间，支持 `0` 持久显示，不是 motion duration。

## 5. 内容与状态

- 主题固定为 `loading/info/success/warning/error`。loading 未传 icon 时使用 PUI Loading；其他主题使用默认 PUI Icon，也允许显式 icon 替换。
- title 与 message 均为空时仍保留可访问 fallback，但演示和业务调用不得展示无内容空壳。
- message 最多两行自然截断，title 单行；关键 action、状态和错误原因不得塞进被截断的 message。
- loading 默认 `duration=0`；更新为其他主题且未显式提供 duration 时使用组件默认停留时间。

## 6. Methods、队列与事件顺序

- `show(options)` 返回本条 key；相同 key 正在展示时等价于原位 update，不销毁节点。
- `update(key,patch)` 只更新当前或已排队的真实消息，命中返回 true；未知 key 返回 false，不创建假消息。
- `hide(key?)` 触发当前消息退场；若 key 指向排队消息，只从队列移除且不伪造 close。
- 用户点击 Surface 触发 `click`；Action 触发 `action`，组件不自动宣布成功；关闭按钮触发真实退场。
- `close` 只在节点退场完成后触发一次，detail 固定含 key、theme、reason；reason 为 `timeout/manual/programmatic`。

## 7. 可访问性

- Surface 使用 `role=status`；error 使用 assertive，其余使用 polite。
- Close 与 Action 都必须有可访问名称；图标与 Loading 不能替代整条通知的 `ariaLabel`。
- 非模态通知不建立焦点陷阱；页面滚动和原页面焦点保持可用。

## 8. H5 预览与跨端一致性

- PreviewDevice 使用 `edge-to-edge`；通知 fixed 语义在网页中限制为设备内 absolute，必须覆盖设备完整顶边上下文，而不是只覆盖局部分区。
- 概览底部提供一组真实 PUI Button：开始生成、更新进度、成功、失败、加入队列、关闭；上方保留可滚动业务内容证明通知不清空、不阻断预览。
- H5 必须真实验证同 key 更新、不同 key 队列、duration=0、动作事件、自动关闭、手动关闭、`compact → expanding → visible` 与 `collapsing → leave-compact → hidden` 中间帧，以及低动效。
- H5 与小程序必须同时验证：`compact` 无流光、`expanding` 启动唯一一束 `1500ms` 主题光束、面板在 `320ms` 后进入 `visible` 时同一光束不中断也不重启、计时结束后彩边清零，`collapsing/leave-compact` 立即清理未完成流光。loading/info/success/warning/error 五态必须分别回读中性灰/信息蓝/成功绿/警告橙/危险红；主题切换只更新当前语义色而不重播完整入场，同 key 完成态 update 不重建节点。
- `shadow/frostedGlass` 的 `null/true/false` 必须在属性面板、WXML 生成器和两端运行态同源。验证流光前、中、后根 Surface 的背景、滤镜和阴影计算值保持不变，证明装饰退场不会破坏毛玻璃。

## 9. 响应式、主题与视觉配置

- 390px 下左右安全边界一致，标题、消息、Action、Close 不得相互覆盖或导致页面级横向溢出。
- 通知中性深色身份在 light/dark 下都必须保持可读；`shadow/frostedGlass=null` 时跟随全局有效值，组件私有 `true/false` 可局部覆盖。border、largeRadius 与这些效果不得破坏紧凑几何。
- safeArea=true 时通过 `common/utils/platform-info#getWindowInfo()` 读取状态栏，并结合微信胶囊真实位置；读取失败才使用最小安全 fallback，不能硬编码某一机型，也不得恢复 `wx.getSystemInfoSync()`。

## 10. 明确禁止

- 不得将 DynamicMessage 做成 Toast 别名、Popup/Overlay 或静态顶部卡片。
- 不得用“已加入队列”“已成功”等文字替代真实队列、update 或业务结果。
- 不得同 key 重建节点、不同 key 相互覆盖、自动把 loading 变 success。
- 不得公开 motionDuration/easing/placement/overlay/preventScrollThrough；这些会破坏灵动通知的单一产品语义。

## 11. 修改闭环

1. 同步审计 `dynamic-message/` 四件套、metadata、H5、API、兼容说明、共享平台读取器、独立小程序页、示例与安装产物。
2. 运行 `node scripts/test-dynamic-message.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`。
3. 浏览器与合法 AppID 真机分别验证 retained node、同 key update、队列、duration=0、action/close 顺序、安全区、390px、深浅色、外观开关和低动效。
