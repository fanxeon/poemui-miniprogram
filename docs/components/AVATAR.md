# Avatar 语义合同

## 1. 组件定位

Avatar 只负责展示人物、团队或对象的头像视觉，并在图片请求期间提供内部加载反馈、在图片不可用时提供可靠回退。它不是按钮、选择器、业务请求状态机或成功入口。

## 2. 公开合同

- Props：`src/text/alt/icon/shape/size/bordered/hideOnLoadFailed/lazy/loading/useSlot/ariaLabel/reduceMotion`。
- Events：`error`。
- Slots：`default`，仅在 `useSlot=true` 时接管回退内容。
- Methods：无业务实例方法。

回退优先级固定为：成功图片 > `useSlot` 默认 Slot > `icon` > `text/alt` 首字符 > `?`。非空 `src` 会立即由组件内部进入加载态并设置 `aria-busy=true`；真实 `load` 后结束加载并淡入图片，真实 `error` 后结束加载并显示回退，或在 `hideOnLoadFailed=true` 时完成短退场再卸载。`src` 变化会重置本次资源状态；已经失效的旧图片事件不得覆盖新地址。

## 3. 交互边界

- Avatar 根固定为图片语义，不发布 `click`，也不暴露 `clickable/disabled`。
- 头像需要点击时由消费者使用 PUI Button、Cell 等真实交互组件包裹；事件与 disabled/selected/业务请求 loading 归宿主。
- `loading=true` 强制保持 Avatar 内部的 PUI Loading，可用于持续等待或资源尚未确定的场景；Loading 的节点、叠层与 `aria-busy` 全部属于 Avatar，不允许页面在外部再拼一份 Spinner。
- `loading=false` 时，图片资源等待继续由组件内部根据 `src → load/error` 自动管理；页面不得维护重复的 `avatarLoading` 或用按钮伪造加载完成。
- `lazy` 只映射微信 image 的 `lazy-load`，决定资源何时开始请求，不接管或结束组件内部加载态。没有 `src` 且 `loading=false` 时直接显示回退。
- `load` 是内部绘制状态，不作为 Avatar 公共事件；需要完整资源生命周期时使用独立 Image。
- 不提供 `image` 别名、`imageProps` 或 `badgeProps` 全量透传；Badge 通过外层 `<pui-badge><pui-avatar /></pui-badge>` 组合。

## 4. 外观与动效

- `size` 只接受 `small/medium/large`，非法值回退 `medium`。
- `shape` 只接受 `circle/round/square`，非法值回退 `circle`。
- 图片淡入和失败退场固定消费 `--pui-duration-normal` 与 `--pui-ease-standard`，不再暴露重复的 `duration/easing`。
- `reduceMotion=true` 将内部过渡压缩为 1ms；H5 还必须响应 `prefers-reduced-motion`。
- 深浅色、边框、阴影、毛玻璃和大圆角只通过全局 Token 影响合适层级；`circle` 始终保持满圆。
- Avatar 是展示叶子，`shadow=on` 不得给它增加外投影；`bordered` 只增加语义边线，图片、回退与组合宿主的 Surface 仍各自负责。

## 5. H5 镜像与演示

- 必须使用真实 `<img>` 的 `load/error` 驱动图片显隐和回退，不得用按钮切换假失败。
- H5 `lazy=true` 必须映射为 `<img loading="lazy">`，否则使用 `eager`；缓存图片必须检查 `complete/naturalWidth`，不能只等待可能已经结束的事件。
- 概览按基础用法、懒加载/图片与回退、尺寸与形状、组合用法分区。
- 基础 WXML 只展示 `<pui-avatar text="P" />`，不得绑定事件。
- 图片失败专项示例只绑定 `error`；组合点击必须由外层 PUI Button 承担。
- 概览必须同时展示一个真实远程头像、一个 `loading=true` 持续加载头像和一个真实失败回退。
- API 表格完整展示 13 Props、1 Event、1 Slot，不得使用省略号或单行裁切。

## 6. TDesign 1.15.3 对照决定

- 2026-07-29 联网参考 [TDesign Avatar 官方文档](https://tdesign.tencent.com/miniprogram/components/avatar)、[官方仓库 Avatar 源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/avatar)，并固定读取 `tdesign-miniprogram@1.15.3` 安装包的 `miniprogram_dist/avatar/props.js`、`type.d.ts`、`avatar.js`、`avatar.wxml`、`avatar.wxss`。
- TDesign Avatar 源码为 9 Props：`alt/badgeProps/bordered/hideOnLoadFailed/icon/image/imageProps/shape/size`，公开文档展示 8 项并只公开 `error`；AvatarGroup 另有 `cascading/collapseAvatar/max/size`。
- TDesign 通过 `imageProps.lazy` 把懒加载传给内部 Image。PoemUI 不复制 `imageProps` 全量透传，只公开聚焦的 `lazy`；PoemUI 额外保留 `loading` 强制态，但其视觉实现仍封装在 Avatar 内部。同时保留更一致的 `src` 命名、简单 `text` 回退、显式 `useSlot`、`ariaLabel`、`square` 和 `reduceMotion`。
- 删除旧 `image` 别名、`clickable/disabled/click/load` 以及可配置 `duration/easing`。AvatarGroup 不是双方已有的共同组件，本轮不新增独立 npm 目录；组合头像只作为消费者组合范式展示。

## 7. 验收边界

- 验证无图、有效图、懒加载图、`loading=true` 持续态、失败图、hideOnLoadFailed、src 切换与旧事件隔离、text/alt/icon/slot 回退、三尺寸三形状、bordered、空字符串、reduceMotion。
- 验证外层 Button 点击与禁用门禁，证明 Avatar 本体不截获事件。
- 验证 390px、light/dark、边框、阴影、毛玻璃、大圆角、渐变和 API 全文。
- 微信 image 解码、rpx 抗锯齿、Slot 字体基线、辅助技术与系统低动效仍需合法 AppID 真机复核。

## 8. 明确禁止

- 禁止恢复 Avatar 自身 click/clickable/disabled，把展示节点重新伪装成不完整按钮。
- 禁止在页面层拼装第二份 Loading；公开 `loading` 只能驱动 Avatar 内部 Loading，不能用来伪造图片成功。
- 禁止用点击或静态文案模拟图片 load/error。
- 禁止增加 Badge/Image 全量透传或第二套尺寸、颜色、动效逃生口。
- 禁止为了组合头像新增没有真实源码、安装产物和专项测试的演示壳。

## 9. 修改闭环

后续修改前先运行 `npm run feedback:list -- --component avatar` 并阅读命中的原始 Ledger；同步检查 JS/JSON/WXML/WXSS、H5、metadata、API、示例、`miniprogram_dist` 和安装产物。完成后更新专项测试、Ledger、进度文档，并复核 390px、主题、外观开关与真实图片事件。
