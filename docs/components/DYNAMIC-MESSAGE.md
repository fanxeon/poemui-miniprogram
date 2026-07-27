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
    ├── theme accent
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

- Surface 使用深色中性身份色，主题只改变窄 accent 与 Icon 色；不能让 success/error 把整个通知染成大色块。
- 内距、gap、字号、行高和圆角使用 PUI Token；title/message 之间只用紧密信息间距。
- 进场不是整张卡片的一段线性缩放：先用 `180ms` 让只含 PUI Icon/Loading 与 title 的紧凑胶囊从顶部落下，再用 `320ms` 横向、纵向长成完整面板；message、Action、Close 与主题 accent 只在第二阶段淡入。
- 退场必须严格反向：先用 `320ms` 收起 message、Action、Close 和完整面板，回到只含 Icon 与 title 的紧凑胶囊；再用 `180ms` 让胶囊向上淡出，之后才能卸载节点并触发 `close`。
- 单次完整进场或退场仍固定为默认 `500ms`，上限合同 `1000ms`；`reduceMotion=true` 跳过可感知分段并压缩为 `1ms`。
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

## 9. 响应式、主题与视觉配置

- 390px 下左右安全边界一致，标题、消息、Action、Close 不得相互覆盖或导致页面级横向溢出。
- 通知中性深色身份在 light/dark 下都必须保持可读；全局阴影开关只影响浮层投影，border、frost、largeRadius 不得破坏紧凑几何。
- safeArea=true 时优先读取微信胶囊和状态栏真实位置；读取失败才使用最小安全 fallback，不能硬编码某一机型。

## 10. 明确禁止

- 不得将 DynamicMessage 做成 Toast 别名、Popup/Overlay 或静态顶部卡片。
- 不得用“已加入队列”“已成功”等文字替代真实队列、update 或业务结果。
- 不得同 key 重建节点、不同 key 相互覆盖、自动把 loading 变 success。
- 不得公开 motionDuration/easing/placement/overlay/preventScrollThrough；这些会破坏灵动通知的单一产品语义。

## 11. 修改闭环

1. 同步审计 `dynamic-message/` 四件套、metadata、H5、API、兼容说明、独立小程序页、示例与安装产物。
2. 运行 `node scripts/test-dynamic-message.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`。
3. 浏览器与合法 AppID 真机分别验证 retained node、同 key update、队列、duration=0、action/close 顺序、安全区、390px、深浅色、外观开关和低动效。
