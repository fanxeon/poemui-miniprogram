# Bubble 组件语义合同

本文是 PoemUI Bubble 的长期设计与实现合同。修改前必须查询 `npm run feedback:list -- --component bubble`；完整 Props、事件和方法以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- Bubble 是单条消息的表面层，不是会话、发送或 AI 传输容器。
- 头像、发送者、时间、已读、存储、网络发送、AI 传输和滚动由 Message/业务层组合。

## 2. 固定结构与区域

- 根按 start/end 对齐；shell 承载消息 Surface 与可选 reactions，groupPosition 只调整连续消息圆角。
- 不新增 Card、列表壳或会话阴影伪造层级。

## 3. PUI 组合与依赖

- Reaction 与展开操作必须复用 PUI Button；正文 Surface 是允许的组件自身交互根。
- H5 自身交互根可使用平台按钮，但不得绕过 Button 镜像重写 reactions/toggle。

## 4. Token、间距与排版

- 消息内距、正文行高、回应 gap 和连续圆角使用现有 space/font/radius Token。
- Bubble 是消息 Surface；不得额外增加 Card、外阴影或页面私有 margin。

## 5. 内容、Slot 与组合边界

- `content` 优先于 `text`；两者为空且没有 customContent 时不挂载空白气泡。
- 默认内容、默认 reactions、内容 Slot 与 reactions Slot 均保留消费者组合职责，父级不得覆盖子 Button 几何。

## 6. 状态与优先级

- 共有 default/secondary/muted/tinted/outline/ghost/destructive；浅深色和 active reaction 必须保持足够对比。
- `visible` 进退场保留节点直到结束；默认500ms、上限1000ms、reduceMotion为1ms。

## 7. 交互、受控边界与事件

- Reaction 保留 `0`、`false` 等原始 value，只回传事件，不修改计数、active 或会话数据。
- `expanded` 为 Boolean 时受控：请求只发布 `input → change → expand/collapse`，等待父级回写；非受控仅用 `defaultExpanded` 初始化。
- 折叠通过实测高度和像素 `max-height` 动画，不能对 `height:auto` 过渡。

## 8. 可访问性

- 正文 Surface、回应与展开按钮均需可访问名称；disabled 同时阻断正文、回应和展开。
- 低动效仍完成 show/hide 与 after-show/after-hide，长文可换行但不造成页面横向滚动。

## 9. H5 预览与跨端一致性

- H5 镜像七种 variant、受控展开、回应、click/longpress 与显隐生命周期；动效走公共 `previewMotionDuration`，不得引用别的组件私有 helper。
- Overview 使用 `shadow-safe`，只保留消息组合、正文、回应与展开结果；工程方法、事件/阶段诊断在进入实时 DOM 前移出。

## 10. 响应式、主题与视觉配置

- 390px、深浅色、边框、阴影、毛玻璃和大圆角下长文、回应和内部 Button 不得页面级溢出。
- ConfigProvider 仅影响视觉 Token，不改变消息、回应或展开值。

## 11. 明确禁止

- 禁止把 Bubble 扩展为会话壳、伪造发送/已读/AI 成功、以 `display:none` 造成显隐或折叠瞬移。
- 禁止让 H5 依赖 Badge 等其他组件的私有预览 helper，或在概览显示工程诊断。

## 12. 修改闭环

1. 同步审计 JS/JSON/WXML/WXSS、H5、API、示例、metadata 与 `miniprogram_dist`。
2. 运行 `node scripts/test-bubble.js`、`npm run feedback:generate`、`npm run feedback:check`、构建门禁，并实测 390px/主题/外观。
3. 更新 Feedback Ledger；合法 AppID 真机仍须验证长按、selector query测量、rpx、Slot、读屏和系统低动效。

## 13. 2026-07-28 展开操作锚点

折叠/展开按钮固定在 Bubble Surface 的右下方：操作轨占满可用宽度，并复用 PUI Button 的 `block` 能力；Text Button 内容必须显式右对齐。小程序自定义组件宿主本身可能占满操作轨，不能只给 Button 内部根设置 `margin-left:auto` 或尝试收缩宿主。不得因内容宽度、主题或毛玻璃回到左侧或中间。

## 14. 2026-07-29 展开高度稳定性

- 默认文本在首次挂载后分别测量完整正文和 `nowrap` 单行探针，以“真实单行高度 × `maxLines`”计算收起端点；不得依赖隐藏 `line-clamp` 节点在微信渲染层返回稳定高度。只要正文、行数、变体和内容模式没有变化，受控或非受控展开都必须复用这组已提交几何，不能回退到 `2400rpx` 估算值后再次测量。
- 正文、`maxLines`、variant、`collapsible` 或 customContent 模式变化时，旧测量失效；异步返回的旧 key 测量不得覆盖新内容。
- 非受控展开只允许一次同步状态提交，禁止先单独写 `expandedState`、再执行完整 `syncState` 形成两次渲染。
- 用户可见的正文裁剪节点必须始终保持同一个 `display:block` 节点，展开与收起只能直接写入已经实测的像素 `max-height`；小程序不得再通过依赖 CSS 自定义属性间接传递当前高度，也不得在点击时同时切换 `display:-webkit-box`、`-webkit-line-clamp` 和高度，否则平台会先按新的行裁剪模型重排，再播放高度动画，形成“先缩起来再展开”。
- 小程序 Bubble 的隐藏测量节点也不得使用 `-webkit-line-clamp`；完整高度与单行高度必须分别测量。H5 使用真实计算行高和 `scrollHeight` 得出同义端点。
- `showToggle` 是测量几何的派生结果。几何 key 未变化时，受控父级回写 `expanded` 必须保留已经测得的 toggle 可见性；禁止先重置为 `false` 又因缓存命中跳过测量，造成展开后“收起”入口消失。
- H5 首次真实测量后必须将 collapsed/expanded 像素值保存到 Bubble runtime；后续展开/收起重渲染直接使用已测值，不得重新从字符数量估算。
- H5 重建展开态 DOM 时，正文必须先以内联 `max-height` 固定在上一个已提交端点，下一帧再过渡到目标端点；禁止先绘制展开结果、再追加 `from collapsed` 的 keyframe，避免出现“先收起再展开”。
- 过渡结束后只清理临时内联高度和运动 class；最终收起态仍由精确 `max-height` 接管，不能把可见正文重新交给 line-clamp。
