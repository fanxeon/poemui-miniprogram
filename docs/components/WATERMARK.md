# Watermark 水印组件语义合同

本文是 PoemUI Watermark 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或 Token 前，都必须完整阅读本文，并先运行：

`npm run feedback:list -- --component watermark`

Props、Slots 的完整清单以 `docs/COMPONENT_API.md` 为准；本文只记录长期语义和边界。

## 1. 组件定位

- Watermark 在调用方内容之上绘制重复或单枚的文本、图片或图文水印；它是展示层，不是权限、加密、下载限制或防截屏方案。
- 适合在文档预览、内部资料和内容区域中提示来源或使用范围；业务内容、权限校验和操作结果仍由调用方负责。
- 参考来源：2026-07-20 已联网核对 [TDesign Watermark](https://tdesign.tencent.com/miniprogram/components/watermark)、[官方源码目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/watermark) 和 npm 发布页；固定可复现证据为 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/watermark/{props.js,type.d.ts,watermark.js,watermark.wxml,watermark.wxss,watermark.json}`。在线页面受访问策略限制时，官方仓库内 README 仍作为产品用法证据，固定包源码是 API 事实源。

## 2. 固定结构与区域

```text
Watermark 根（relative）
├── content 字符串（可选）
├── content 具名 Slot（可选）
├── default Slot（调用方受保护内容）
└── pointer-events:none 水印层
    └── 重复或单枚 mark（文字/图片段）
```

- 水印层始终在 Slot 内容之上，但不截获任何点击、输入或滚动。
- `isRepeat=false` 只绘制一枚中心 mark；`rectangular/hexagonal` 只影响重复布局。
- 没有可渲染的 `watermarkContent` 时只保留内容区域，不伪造空态、错误态或成功态。

## 3. PUI 组合与依赖

- Watermark 自身不依赖 PUI Button、Loading、Empty 或业务反馈组件；默认/具名 Slot 由调用方按需组合 PUI Cell、Button、Icon 等。
- H5 示例中的受保护内容使用共享 `cellSample` 镜像 PUI Cell；Watermark 不包裹或改写 Slot 子组件几何。
- 水印层是组件自身的非交互绘制根，允许使用平台 `view/image/text`，不得为了演示额外创建 Button 或诊断操作条。

## 4. Token、间距与排版

- 文字颜色默认使用 `--pui-text-secondary`，深浅色随主题 Token 更新；自定义颜色只接受安全色值，不能注入 CSS 片段。
- 文字大小、行距、宽高、间距、偏移和旋转全部使用 Watermark Props 的 rpx 语义；H5 固定按 `1px≈2rpx` 镜像。
- 水印根透明、无私有 Surface、无边框、阴影或毛玻璃；这些视觉效果只属于调用方 Slot 内真实 PUI 组件。

## 5. 内容、Slot 与组合边界

- `watermarkContent` 是水印图案源，接受文字对象、图片对象或它们的数组；一枚 mark 可以垂直组合多行图文。
- `content`、具名 `content` Slot 与 default Slot 是被覆盖的业务内容，不是水印文本的别名。
- 父级只可编排 Slot 内容；不得穿透设置水印层的定位、透明度、旋转或图文尺寸。

## 6. 状态与优先级

- Watermark 没有 `loading/empty/error/retry/disabled` 公开状态，也没有“已保护”“资源成功”业务状态。
- 水印内容按 `watermarkContent` 的已声明段渲染；图片资源的最终解码结果由微信 Canvas/H5 图片平台处理，不转换为公开成功或错误事件。
- 重复节点使用内部安全上限避免极端密度造成页面失效；该保护不报告为业务成功或错误。

## 7. 交互、受控边界与事件

- 组件没有公开 Events 或 Methods；内容变化由调用方更新 Props，尺寸变化由组件自身重新测量和重绘。
- `movable=true` 只改变水印图案的位置，绝不移动、禁用或覆盖 default Slot 的业务内容。
- `moveInterval` 是下一次图案位置更新的等待时间；每次可见位移动画固定不超过 1000ms，`reduceMotion=true` 时停止移动并将过渡压缩为 1ms。

## 8. 可访问性

- 根使用 `role="group"` 和 `ariaLabel`；水印层 `aria-hidden="true"`，避免读屏重复朗读每枚水印。
- 默认 Slot 内的语义、焦点和键盘操作完全保留，Watermark 不建立焦点陷阱。
- 水印文字不可使用 `text-cut` 或省略号隐藏；长文本以自然换行呈现。

## 9. H5 预览与跨端一致性

- H5 使用真实 DOM 尺寸、ResizeObserver 和同一矩形/六边形铺排算法，跟随 Props 实时重绘；不以静态图片或事件提示文字冒充水印。
- H5 的图片段使用真实 `<img>`；它只呈现平台实际结果，不向不存在的原生 Event 虚构 load/error。
- Watermark 是普通内容 Surface，PreviewDevice 使用 `shadow-safe` 父布局；水印根本身透明，不能靠页面私有 margin 修复阴影或覆盖范围。

## 10. 响应式、主题与视觉配置

- 390px 下图案溢出必须被 Watermark 自身裁切，页面不得横向滚动。
- light/dark 影响默认文字 Token；边框、阴影、毛玻璃、大圆角和渐变不能改变水印布局、透明度或 Slot 几何。
- `reduceMotion` 与系统低动效都停止 `movable` 更新，并把现有过渡降为 1ms。

## 11. 明确禁止

- 不得恢复 `text/image/repeat/disabled/fullscreen/maxMarks/duration/easing` 等旧私有 API、ready/error/image-* 事件或 `refresh/getState` 方法。
- 不得宣称 Watermark 可完成鉴权、防下载、防截屏或“保护成功”。
- 不得把 `content` 当作水印文字，或将 Slot 内 PUI Cell/Button 设为 `pointer-events:none`、disabled 或不可聚焦。
- 不得为追平文档保留 TDesign 固定包中未被实现消费、也无法证明防删除语义的 `removable`。

## 12. 修改闭环

1. 同步审计 `watermark/` 四件套、`metadata/components.js`、`preview/app.js`、`preview/styles.css`、示例、API、H5 兼容说明、dist 与 npm 安装产物。
2. 运行 `scripts/test-watermark.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`。
3. 浏览器验证文字/图片/多行、矩形/六边形、单枚/重复、offset、alpha、movable/低动效、Slot 不拦截、390px、深浅色与外观开关；合法 AppID 真机继续验证 Canvas、图片域名、rpx 和样式隔离。
