# TopLoading 顶部加载组件语义合同

本文是 PoemUI TopLoading 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或 Token 前，都必须完整阅读本文，并先运行：

`npm run feedback:list -- --component top-loading`

Props 的完整清单以 `docs/COMPONENT_API.md` 为准；本文只记录长期语义和边界。

## 1. 组件定位

- TopLoading 是依附当前 Card、Panel 或业务 Surface 顶边的轻量进度轨道，不是页面级 Loading、普通 Progress 或成功提示。
- `progress=null` 表示未知总量的不确定加载；合法的 `0` 必须保留为精确起点，不能被当成空值。
- 只有调用方显式设置 `state=success` 才展示完成态；失败和取消必须直接回到 `idle`，组件不得根据“loading 结束”猜测成功。
- 设计证据来自 Zaio 的 `/Users/fanx/Desktop/project Zaio v2/zaio-p1-mvp/frontend/src/components/CardRequestProgress.vue`；PoemUI 只吸收顶部轨道、延迟显示、最短可见时间和显式完成语义，不复制业务请求状态。

## 2. 固定结构与区域

```text
调用方 Surface（position:relative）
└── TopLoading（absolute top）
    └── 4rpx track
        ├── 两条 transform indeterminate bar
        └── 或单条 determinate/success bar
```

- 组件 host 绝对贴合父 Surface 顶边，不占据内容流高度，也不扩大父容器。
- 轨道固定为 `4rpx`，由调用方 Surface 自身裁切到圆角；TopLoading 不建立第二个 Card、边框、阴影或毛玻璃。
- 依附 Popup 时必须投影到 Popup 的 `surface-top` Slot；Popup 提供定位上下文与圆角裁切，不能将轨道放进 Content 再由页面补 `position:relative`。
- `mounted` 与 `active` 分离，同一个节点完成进入、进度更新、成功和退场，不使用 `display:none` 瞬时销毁。

## 3. PUI 组合与依赖

- TopLoading 是基础绘制组件，不依赖 Button、Icon、Loading 或 Progress；不得为了复用名称而嵌套一个更重的 Progress。
- H5 演示必须把它组合进真实 PUI Card 镜像；触发、完成、失败/取消和重试操作使用共享 PUI Button。
- H5 Popup 镜像使用同一个 `topLoadingPreviewMarkup` 作为 `surface-top` Slot 镜像，轨道定位相对 Popup Surface，不复制页面私有线条。
- 业务标题、正文、状态说明和重试不属于 TopLoading，全部由调用方 Surface 组合。

## 4. Token、间距与动效

- 轨道底色、加载色、完成色分别使用 `--pui-bg-active`、`--pui-color-brand`、`--pui-color-success`。
- 所有进入、退场、进度与不确定态动效默认 `500ms`，上限 `1000ms`，曲线使用 `--pui-ease-standard`；`reduceMotion=true` 时统一压缩为 `1ms`。
- 不确定态只动画 `transform`；禁止动画 `width`、`left` 或 `height:auto`。
- `delay`、`minimumVisible`、`successDuration` 是请求反馈计时，不是 CSS 动画时长；它们不得突破 `duration<=1000ms` 的动效合同。

## 5. 状态与优先级

- `idle`：取消等待计时；若节点已可见，先播放真实退场再卸载。
- `loading`：经过 `delay` 后挂载；若已可见则原位更新，不能重播进场。
- `success`：显式填满并切换成功色；已显示的 loading 必须先满足 `minimumVisible`，然后保留 `successDuration` 再退场。
- loading 在 `delay` 内结束时不得闪现；success 直接到达时允许挂载并显示明确完成反馈。
- `progress` 只影响 loading 轨道；success 永远是 100%，idle 不渲染进度。

## 6. 交互、事件和实例方法

- TopLoading 无点击、Events、Methods 或 Slots；它不阻断父 Surface 的触摸、滚动和键盘交互。
- 状态完全由 Props 驱动，不触发 input/change，也不把退场完成包装成业务事件。
- 调用方必须在请求失败或取消时写入 `idle`，在真实成功后写入 `success`。

## 7. 可访问性

- 可见根使用 `role="progressbar"`、0–100 边界和 polite live region。
- 精确进度与 success 提供 `aria-valuenow`；不确定态不伪造百分比。
- `ariaLabel` 回退到“加载中”“加载进度 n%”或“加载完成”。

## 8. H5 预览与跨端一致性

- 官网概览只展示一个满宽 PUI Card：卡片顶部是真实轨道，卡片内容显示当前请求任务，底部使用 PUI Button 触发未知进度、精确进度、成功、失败/取消。
- PreviewDevice 使用 `shadow-safe`；阴影安全区属于统一设备父布局，组件本身不增加私有 margin。
- H5 必须复现 delay、minimumVisible、同节点进退场、0/null 边界和 reduced motion，不得用静态彩条或提示文字冒充组件。

## 9. 响应式、主题与视觉配置

- 390px 下轨道宽度只取决于父 Surface，不造成页面横向溢出。
- light/dark 随全局 Token；border、shadow、frost、largeRadius 只影响父 Card，不得改变 4rpx 轨道或创建额外 Surface。
- 渐变背景不得覆盖进度色；TopLoading 自身不消费页面渐变。

## 10. 明确禁止

- 不得把 TopLoading 合并为 Loading/Progress 的别名，或把“停止加载”自动解释为成功。
- 不得公开 error/retry/text/icon/overlay/fullscreen；这些属于父级业务组合。
- 不得用 `display:none`、动画 width/left、销毁重建或只改状态文案伪造动效。
- 不得让 `minimumVisible` 阻止失败/取消及时退场。

## 11. 修改闭环

1. 同步审计 `top-loading/` 四件套、metadata、H5、API、兼容说明、独立小程序页、示例与安装产物。
2. 运行 `node scripts/test-top-loading.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`。
3. 浏览器与合法 AppID 真机分别验证 delay、0/null、精确更新、显式 success、失败/取消、快速重入、390px、深浅色和低动效。
