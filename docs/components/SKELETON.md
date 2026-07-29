# Skeleton 组件语义合同

本文是 PoemUI Skeleton 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component skeleton`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

- Skeleton 只预示尚未就绪内容的结构，由父级的 `loading` 真实回写。
- 适用于短时数据等待和已知内容轮廓；`delay` 只避免极短请求的视觉闪烁。
- 它不表示请求成功、失败、空结果或重试。进行中但没有内容轮廓时使用 Loading；业务反馈由 Empty、Result、Button 等外部组合。

## 2. 固定结构与区域

```text
pui-skeleton（透明布局根）
├─ placeholder（仅 mounted 时；status 语义；安全 rows/parts）
└─ content（始终有默认 Slot 的布局容器）
   └─ default Slot（仅 loading=false 可见）
```

- 根只负责同一网格中的占位与内容交叉淡入，不建立第二层 Surface。
- `rowCol=[]` 时按 `theme` 产生默认 rows；最多 12 行、每行最多 4 个 part。
- 占位的进入首帧与退场都在同一节点切换 opacity；不以 `display:none` 或 `height:auto` 伪造动画。

## 3. PUI 组合与依赖

- Skeleton 是展示叶子，不依赖内部 PUI 子组件；默认 Slot 中的就绪内容由消费者组合 PUI Cell、Tag、Button 等。
- WXML 的 view 是 Skeleton 自身的布局与无障碍根，允许作为底层实现。
- 不得在 Skeleton 内重复实现 Loading、Empty、Error、Retry、Cell 或假的事件反馈。

## 4. Token、间距与排版

- 小程序使用 `--pui-space-step-8`、`--pui-radius-small/medium`、`--pui-bg-muted`、`--pui-duration-normal` 与 `--pui-ease-standard`。
- 行与同行 part 的间距统一为 8rpx；不公开私有 row/column gap Props。
- `rowCol` 的 `type="circle"` 是几何不变量：默认宽高为 `96rpx`，但 `min-height:0` 必须允许 `size` 同时覆盖两轴；禁止用默认 `96rpx` 最小高度把较小的自定义圆拉成椭圆。圆角固定为 `50%`，不依赖跨组件继承的圆角 Token，也不随 `largeRadius` 改成圆角方块。
- 占位颜色只使用中性弱背景；它没有自身卡片背景、边框、阴影或排版文案。
- 交叉淡入固定 500ms，`reduceMotion` 为 1ms；循环动效只使用全局 normal duration，绝不超过 1000ms。

## 5. 内容、Slot 与组合边界

- 唯一的默认 Slot 承载真实的就绪内容，`loading=false` 时可见；没有具名 placeholder Slot。
- `rowCol` 是唯一的占位结构定制入口；单项仅接受受限的尺寸、边距和 `text/rect/circle` 类型。
- Skeleton 不穿透或重写 Slot 内 PUI 子组件的尺寸、内距、圆角、主题或交互。

## 6. 状态与优先级

- `loading=true`：尚未 mounted 时先等待 `delay`；到期后挂载，占位在下一帧变为 active。
- `loading=false`：内容立即进入可见态；若占位已挂载，保留到固定淡出结束再卸载。
- `delay` 期间取消时保持内容，不能闪出占位或制造业务结果。
- Skeleton 没有 disabled、readonly、selected、empty、error、retry 或成功状态；这些状态不能被私自加入其 Props 或预览。

## 7. 交互、受控边界与事件

- `loading` 是唯一的显隐控制来源，组件不维护非受控 loading，也不向父级写回。
- Skeleton 没有用户交互、公开 Events 或实例 Methods；内部计时不代表请求生命周期。
- H5 的“显示内容 / 重新显示占位”仅修改父级 Props，不能写状态日志、假成功文案或 `show/hide` 事件。

## 8. 可访问性

- 激活占位使用 `role=status`、`aria-live=polite` 与安全 `ariaLabel`；隐藏层设 `aria-hidden`。
- 就绪内容的可访问性由默认 Slot 内真实组件负责。
- `reduceMotion` 和系统 `prefers-reduced-motion` 同时停止 gradient/flashed 循环并把交叉淡入压缩为 1ms。
- Skeleton 不提供焦点、键盘操作或截断关键状态文字。

## 9. H5 预览与跨端一致性

- H5 与 WXML 同步 `loading`、`delay`、7 个公开 Props、安全 rowCol、四种 theme、三种 animation、默认 Slot 和固定 500ms/1ms 动效。
- 0.1.2 已把 `preview/styles.css` 的 `.pui-skeleton-preview__part--circle` 同步为 `min-height:0`、等宽高与 `border-radius:50%`，并由 `preview/app.js` 的 `skeletonPreviewRows()` 让 `size` 生成同一宽高。390px 深色果味下 `72rpx` 自定义尺寸实测为 `36×36px` 正圆。
- 官网按“基础用法 / 占位布局 / 主题与动效 / 内容回显”分区；基础 WXML 仅为 `<pui-skeleton />`，零 `bind:*`。
- 标准概览使用 `PreviewDevice` 的 `shadow-safe` 父布局。Skeleton 根透明，Slot 内真实 PUI 组件自身决定 Surface；不得用页面私有 margin 或卡片壳补阴影。
- 浏览器以 px 近似 rpx（1px≈2rpx）；微信的 WXML slot 投影、rpx 合成、读屏和系统低动效仍须真机确认，H5 不伪造这些平台结果。

## 10. 响应式、主题与视觉配置

- 390px 下每个分区和双列展示必须收敛为单列，不产生页面级横向溢出。
- Skeleton 使用全局 light/dark 中性 Token；border、shadow、frostedGlass、largeRadius 与 gradient 只由 Slot 中实际 PUI Surface 和 PreviewDevice 承接，不能给透明根添加第二层视觉壳。
- ConfigProvider 主题影响 Skeleton 的中性 token；不改变 `rowCol` 几何、计时或 Slot 显隐语义。

## 11. 明确禁止

- 禁止恢复 avatar、avatarSize、avatarShape、rowGap、columnGap、customPlaceholder、duration、animationDuration、easing 等历史公开 Props。
- 禁止恢复 `show/hide`、实例方法、具名 placeholder Slot、内部 success/error/empty/retry 或诊断状态面板。
- 禁止把 `gradient/flashed` 以外的动画名称、无限动效超过 500ms、`display:none` 瞬移或 `height:auto` transition 写入两端。
- 禁止把演示按钮、内容回显或计时器表述为真实网络请求成功。

## 12. 修改闭环

1. 同步审计 `skeleton/` 四件套、`miniprogram_dist/skeleton/`、`metadata/components.js`、`metadata/shadcn.js`、`preview/app.js`、`preview/styles.css`、API/H5 文档、示例和本合同。
2. 运行 `node scripts/test-skeleton.js`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`；产物涉及微信时再运行 Developer Tools `build-npm`。
3. 浏览器实际验证 loading 往返、delay 取消、theme/animation/rowCol/低动效、默认 Slot、light/dark、全部视觉开关和 390px；记录源码、dist、示例安装与微信产物的差异。
4. 更新 Skeleton 的 Feedback Ledger。真机必须保留 rpx、动画合成、复杂 Slot、读屏、样式隔离和系统低动效风险，不能因 H5 或构建通过而删除。

本次对照依据为 2026-07-29 再次在线访问的 [TDesign Skeleton 页面](https://tdesign.tencent.com/miniprogram/components/skeleton)、[官方组件源码](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/skeleton) 与重新解包的固定 `tdesign-miniprogram@1.15.3`。实际读取 `miniprogram_dist/skeleton/{props.js,type.d.ts,skeleton.js,skeleton.wxml,skeleton.wxss}`；固定源码的 circle 最终 fallback 为 `50%`，本合同只采用其圆形几何语义，不恢复 TDesign 的额外样式字段或 PoemUI 已删除的头像 Props。
