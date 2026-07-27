# Result 组件语义合同

本文是 PoemUI Result 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component result`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

- Result 只呈现一次流程已经得到的结果状态，包括图形、标题和说明。
- 它适用于提交、校验、发布或支付等流程已完成后的反馈；下一步由页面或同级 PUI Button、Cell 承担，进行中使用 Loading，空态使用 Empty，失败重试由父级状态区承担。
- 它不负责导航、提交、重试、下载、成功判定、受控值、loading、empty、error、disabled、readonly、active 或 selected 状态。

## 2. 固定结构与区域

```text
pui-result（透明 status / alert 根）
├─ thumb
│  ├─ pui-image（image 非空）
│  ├─ pui-icon（否则 icon 有效）
│  └─ image Slot（否则）
├─ title（title 文本 + title Slot）
└─ description（description 文本 + description Slot）
```

- 图形严格按 `image → icon → image Slot` 选择；只有 `icon=false` 且 image 为空时才渲染 image Slot。
- title、description 为空时不保留可见文字；Slot 可以追加或替代同一区域内容。
- 根只承担纵向布局、语义和淡入，不建立卡片、边框、阴影或第二层背景。

## 3. PUI 组合与依赖

- 图片分支必须复用 `pui-image`，图标分支必须复用 `pui-icon`；`result.json` 只声明这两个内部依赖。
- Result 是展示型布局根，可以使用 `view/text/slot` 实现自身语义和排版。
- 消费者若在 Slot 中组合 Tag、Cell、Button，H5 必须复用对应 PUI 镜像助手；操作仍属于消费者，不迁回 Result。
- 禁止恢复内部 Button、Loading、原生 button、图片事件转发、默认 Slot 或私有业务回调。

## 4. Token、间距与排版

- 小程序使用 `--pui-space-xxl`、`--pui-space-normal`、`--pui-space-sm`、`--pui-font-size-title-medium`、`--pui-font-size-body-medium`、同名行高、`--pui-duration-normal` 与 `--pui-ease-standard`。
- 图形到 title 使用 normal 间距，title 到 description 使用 small 间距；H5 使用同名 Preview Token 的 1:2 近似值。
- 根保持透明；圆角、边框、阴影、毛玻璃与背景只属于内部实际 PUI Image、Slot 内容或父级 Surface。

## 5. 内容、Slot 与组合边界

- `image` Slot 只在 image 为空且 icon 关闭时显示；`title`、`description` Slot 追加或替代对应文本。
- 父级只管理自身流程、状态、操作与业务回写，不能穿透修改 Image/Icon/Slot 子组件的尺寸、内距、圆角、主题或交互几何。
- Result 没有默认 Slot；Tag、Cell 和 Button 只能进入职责明确的具名区域或作为同级组件。

## 6. 状态与优先级

- Result 自身没有 loading、empty、retry、selected、disabled、readonly、active 或业务成功状态。
- theme 只接受 `default`、`success`、`warning`、`error`；非法值回退 default，并决定默认图标与语义颜色。
- 图形优先级为 image、icon、image Slot；`image` 的资源加载和失败由内部 PUI Image 自己处理，不提升为 Result 事件。
- 父级的 `error > loading > content > empty` 状态机必须在父组件中决定；Result 只显示父级已经确认需要展示的结果。

## 7. 交互、受控边界与事件

- Result 没有受控/非受控状态、公开 Events 或实例 Methods。
- 同级 Button、Cell 或 Slot 内互动的 click、loading、disabled、事件顺序和父级回写完全由消费者合同决定；Result 不二次转发或伪造成功。
- 不得以 H5 的图片 DOM 事件、文字变更或动画完成冒充 Result 的业务事件。

## 8. 可访问性

- 非 error theme 的根使用 `role=status` 与 `aria-live=polite`；error 使用 `role=alert` 与 `aria-live=assertive`。
- `ariaLabel` 为空时按 title、description、`结果` 回退；图形容器不重复朗读，Image/Icon 或 Slot 保留自身真实辅助语义。
- Result 不可聚焦，也不提供键盘操作；Slot 内 PUI Button 等交互组件自行提供可访问名称与键盘能力。
- `reduceMotion=true` 与系统低动效都将 500ms 进入过渡压缩为 1ms，不截断关键标题或说明文字。

## 9. H5 预览与跨端一致性

- H5 使用共享 PUI Icon、PUI Image、Tag、Cell 镜像，严格保持 image/icon/slot 优先级和零 Events/Methods。
- 官网按“基础用法 / 组件类型 / 具名 Slot”分区；基础 WXML 是最小调用，不展示任何 `bind:*`。
- 标准概览使用 `PreviewDevice` 的 `shadow-safe` 父布局；Result 根透明，只有实际 Image、Slot 内容或父级状态区可成为 Surface，禁止通过页面私有 margin 修复阴影裁切。
- 浏览器 Image 加载只验证内部 Image 近似；微信图片 mode、Slot 投影、rpx、读屏和系统低动效仍需真机确认。

## 10. 响应式、主题与视觉配置

- 390px 下标题、说明和 Slot 可自然换行，页面与 PreviewDevice 不得横向溢出。
- light/dark 与边框、阴影、毛玻璃、大圆角、渐变由 ConfigProvider 和实际子 Surface 承接；透明根不因开关获得额外卡片壳。
- `shadow=on` 不得给 Result 根增加外投影；图形、具名 Slot 或父级流程 Surface 的视觉边界仍由各自合同承担。
- 全局主题不改变图形优先级、公开边界、500ms/1ms 动效或父级业务边界。

## 11. 明确禁止

- 禁止恢复 showVisual、imageMode、imageSize、customImage、primary/secondary 操作、actionsDisabled、actionLayout、size、duration、easing 等历史公开 Props。
- 禁止恢复 default/actions Slot、primary/secondary/load/error 事件、实例方法、内部操作 Button/Loading、假成功或静态事件反馈。
- 禁止用原生 img/button 代替 PUI Image/Button，禁止通过 `display:none`、`height:auto` transition 或超过 500ms 的动效伪造状态切换。
- 禁止把父级 loading/error/retry 或业务状态机迁入 Result，或因为 H5 能加载图片就宣称微信资源、事件和读屏已确认。

## 12. 修改闭环

1. 同步审计 `result/` 四件套、`miniprogram_dist/result/`、metadata、H5 helper/styles、API/兼容文档、示例、本合同和 TDesign 对照清单。
2. 运行 `node scripts/test-result.js`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`；涉及微信产物时运行 Developer Tools `build-npm`。
3. 浏览器实际验证四种 theme、image/icon/Slot 优先级、空字符串、对象 icon、180ms/1ms、light/dark、全部视觉开关与 390px。
4. 更新 Result 的 Feedback Ledger；真机必须保留 rpx、图片解码/域名、Slot 投影、样式隔离、读屏和系统低动效风险。

本次对照依据为 2026-07-20 在线访问的 [TDesign Result 页面](https://tdesign.tencent.com/miniprogram/components/result)、[官方仓库](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/result) 与固定 `tdesign-miniprogram@1.15.3` 包内 `miniprogram_dist/result/{props.js,type.d.ts,result.js,result.wxml,result.wxss}`。
