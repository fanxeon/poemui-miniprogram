# Image 语义合同

## 1. 组件定位

Image 负责安全加载和展示图片资源，并对空地址、加载中、加载失败和成功四种真实状态提供稳定反馈。它不是按钮、选择器、文件上传器或业务重试器。

## 2. 公开合同

- Props：`src/mode/width/height/shape/lazy/webp/loading/error/text/showMenuByLongpress/showSlot/ariaLabel/reduceMotion`。
- Events：`load/error`，只对应微信原生 image 资源事件。
- Slots：`default`，仅在 `showSlot=true` 时作为图片覆盖内容。
- Methods：无业务实例方法。

状态优先级固定为：外部 `error` > 外部 `loading` > 空 `src` > 原生资源 loading/loaded/error。外部状态只表达调用者真实请求状态，不产生 load/error 假事件；关闭外部 error 后会重新挂载当前 `src`。

## 3. 展示与交互边界

- Image 根固定为图片语义，不发布 `click`，也不暴露 `clickable/disabled`。
- 图片需要点击、选择、禁用或 loading 门禁时，由消费者使用 PUI Button、Cell 等真实交互宿主包裹。
- `showSlot` 只控制覆盖内容，Slot 事件属于消费者；Image 不截获、转写或伪造 Slot 回调。
- 业务 retry 必须由外层 PUI Button 发起真实请求；Image 只在新的 `src` 或外部 error 释放后重新加载。

## 4. 图片能力与安全边界

- `mode` 只接受微信 image 的 14 个稳定模式，非法值回退 `aspectFill`。
- `width/height` 只接受非负 `rpx/px/%`；非法值忽略，保留 120rpx 最小盒模型。
- `shape` 只接受 `rectangle/round/circle`，非法值回退 `rectangle`。
- `lazy`、`webp`、`showMenuByLongpress` 直接映射微信原生 image 能力；H5 只能做相应的浏览器近似并明确差异。
- `src` 变更后重新进入原生 loading；缓存完成也必须触发同一可见完成态，不能依赖 listener 必定先挂载。

## 5. 状态、外观与动效

- 空、loading、error 状态复用 PoemUI Icon/Loading 视觉语义，不使用静态成功文案或状态切换按钮。
- 图片淡入和按资源状态切换固定使用 `--pui-duration-normal` 与 `--pui-ease-standard`，不暴露重复 `duration/easing`。
- `reduceMotion=true` 将内部淡入压缩为 1ms；H5 同时响应 `prefers-reduced-motion`。
- 深浅色、边框和大圆角通过全局 Token 作用于 Image 的真实媒体盒；Image 是媒体展示叶子，`shadow` 与 `frostedGlass` 不得给根节点增加外投影或第二层玻璃 Surface；`circle` 始终保持满圆。

## 6. H5 镜像与演示

- 必须使用真实 `<img>` 的 load/error 驱动状态，不得提供“加载成功/加载失败”伪按钮。
- 概览按基础用法、加载与失败、裁切模式、形状与覆盖内容分区；工程事件日志和内部状态 Cell 不进入标准概览。
- 常规模式代码正文固定展示“组件引用 / 基础用法 / 加载与失败 / 裁切模式 / 形状与覆盖内容”五段；后三段分别从同一 `makeUsageCode` 真相源生成，使用现有 PUI Copy IconButton，禁止维护第二份手写 WXML。
- 基础 WXML 只展示完成图片任务所需的最小调用，不绑定事件；失败示例只提供失败地址给真实 `<img>`，不能通过状态文字或定时器伪造失败。
- API 表格完整展示 14 Props、2 Events、1 Slot，不得省略号、nowrap 或固定高度裁切。

## 7. TDesign 1.15.3 对照决定

- 2026-07-20 联网参考 [TDesign Image 官方页](https://tdesign.tencent.com/miniprogram/components/image)、[官方仓库 Image 源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/image)，并固定实际读取 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/image/{props.js,type.d.ts,image.js,image.wxml,image.wxss,image-info.json}`。官网用于产品分区，固定包用于可复现 API。
- TDesign Image 为 11 Props：`error/height/lazy/loading/mode/shape/showMenuByLongpress/src/tId/webp/width`，公开 `load/error` 与 `loading/error` Slots。
- PoemUI 保留安全字符串尺寸、外部 loading/error Boolean、统一状态文案、覆盖 Slot、ARIA 和低动效；新增真实微信 `webp`，拒绝调试 `tId`、任意尺寸和 external class。
- 删除旧 `clickable/disabled/click` 与可配置 `duration/easing`；不把 TDesign 的 loading/error 字符串或具名 Slot 机械复制成第二套状态内容入口。

## 8. 验收边界

- 验证空 src、有效图片、失败图片、外部 loading/error 及释放重载、缓存资源、十四种 mode 回退、安全/非法尺寸、三种 shape、lazy/webp/长按菜单、覆盖 Slot、空字符串和 reduceMotion。
- 验证外层 Button 点击与禁用门禁，证明 Image 本体不截获事件。
- 验证代码正文五段均从同一 WXML 生成器产生，复制操作使用真实剪贴板结果；浏览器 `<img>` 必须在 `load/error` 后更新可见 loading/loaded/error，缓存完成以 `complete/naturalWidth` 同步，外部 error/loading 仍只覆盖显示。
- 验证 390px、light/dark、边框、阴影、毛玻璃、大圆角、渐变和 API 全文。
- 微信 webp 解码、lazy-load 触发边界、长按菜单、widthFix/heightFix 布局、rpx 抗锯齿、辅助技术和系统低动效仍需合法 AppID 真机复核。

## 9. 明确禁止

- 禁止恢复 Image 自身 click/clickable/disabled，把展示节点伪装成不完整按钮。
- 禁止用按钮、定时器或只更新提示文字来伪造 load/error/retry。
- 禁止恢复私有 duration/easing、任意 CSS 尺寸或调试 ID 透传。
- 禁止让默认 Slot 冒充图片资源状态或覆盖 load/error 的真实优先级。

## 10. 修改闭环

后续修改前先运行 `npm run feedback:list -- --component image` 并阅读命中的原始 Ledger；同步检查 JS/JSON/WXML/WXSS、H5、metadata、API、示例、`miniprogram_dist` 和安装产物。完成后更新专项测试、Ledger、进度文档，并复核 390px、主题、外观开关与真实资源事件。
