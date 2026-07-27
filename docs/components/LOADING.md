# Loading 语义合同

本文是 PoemUI Loading 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component loading`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

Loading 只表达“正在处理”，不表达某一业务已经成功、失败、为空或可重试。调用方以 `loading` 声明是否展示，并把具体业务结果、错误和重试入口放在组件外层组合。

它不是 Button 的成功反馈、页面状态机或任务进度控制器；进度数字是可选的视觉信息，不产生完成事件。

## 2. TDesign 对照基线

- 在线参考：<https://tdesign.tencent.com/miniprogram/components/loading>、<https://github.com/Tencent/tdesign-miniprogram> 与 <https://www.npmjs.com/package/tdesign-miniprogram>，于 2026-07-20 核验。
- 固定参考：`tdesign-miniprogram@1.15.3`，tarball 为 <https://registry.npmjs.org/tdesign-miniprogram/-/tdesign-miniprogram-1.15.3.tgz>。
- 实际读取包内 `miniprogram_dist/loading/{props.js,type.d.ts,loading.js,loading.json,loading.wxml,loading.wxss}`：公开 `delay/duration/fullscreen/indicator/inherit-color/layout/loading/pause/progress/reverse/size/text/theme`，命名 Slot 为 `indicator/text` 并保留默认 Slot；没有公开 Events 或实例方法。
- PoemUI 保留上述主干，补充全库统一的 `ariaLabel/reduceMotion`。不恢复旧的 `color/easing/showProgress/vertical`、`show/hide` 事件或命令式可见性方法。

## 3. 固定结构与区域

根节点只在 Loading 需要保留退场帧时挂载，内部依次为可选指示器、可选文本、默认 Slot 与可选进度。`fullscreen=true` 时根节点覆盖当前页面；非全屏根保持透明，不制造额外 Surface。

`indicator` Slot 位于内置指示器之后，`text` Slot 位于内置文本之后，默认 Slot 位于文本后。调用方可组合 `pui-tag` 等真实 PUI 组件，Loading 不接管 Slot 的交互或结果。

## 4. 状态与动画边界

内部只维护 waiting、entering、visible、leaving、hidden 五个渲染阶段：`delay` 结束后挂载，退出先以 opacity/scale 完成退场，再卸载。阶段仅服务渲染，不派发成功、失败或生命周期事件。

所有显隐与循环单次时长默认 500ms、限制在 0–1000ms；`reduceMotion` 使显隐时长为 1ms 并停止循环。禁止对 `height:auto` 过渡、用 `display:none` 跳过退场，或把阶段变化写成业务结果。

## 5. PUI 组合、Token 与可访问性

Loading 的 WXML 自身可使用 `view`，因为它是基础组件的交互与动画根。官网示例的显隐控制必须调用共享 `buttonSample`，代码、示例和复合组件应通过共享 `loadingComponent` 复用镜像，不能手写裸 spinner。

尺寸、颜色、间距、圆角、阴影、毛玻璃、文字与主题都读取 PUI Token；`inheritColor` 只继承调用处文字颜色。根节点为 `role=status`、`aria-live=polite`，名称优先 `ariaLabel`，再取文本或进度；只在可见阶段向辅助技术暴露。

## 6. H5 预览与跨端一致性

概览按“基础用法 / 图标与文字 / 方向与进度 / 全屏与低动效”分区。第一段用 PUI Button 真正切换 `loading` Props，其他段用于可见结构对照；不展示伪事件 Cell、伪成功文案或不存在的错误/重试操作。

H5 以相同阶段、三种 `theme`、`layout`、延迟、暂停、反向、进度、全屏与低动效呈现 WXML/WXSS 能力。浏览器不能替代微信对 rpx、样式隔离、页面 fixed、slot 投影和读屏的最终验证。

## 7. 响应式与视觉配置

390px 下四段示例、文字、默认 Slot 和 API 表格必须自然换行，不产生页面级横向溢出。深浅色、边框、阴影、毛玻璃、大圆角与渐变由真实 Loading 及 PreviewDevice 共享 Token 消费；Loading 不保存第二份站点外观状态。

## 8. 明确禁止

- 禁止公开 `color`、`easing`、`showProgress`、`vertical`、`show/hide` 事件、假进度完成事件或实例 `show()/hide()`。
- 禁止把 `loading=false` 或退出完成解释成业务成功，也不得内置 error、empty、retry、disabled、readonly 或 selected 状态。
- 禁止用静态占位、假事件、超过 500ms 动效、`height:auto` transition 或 `display:none` 瞬移替代真实渲染状态。

## 9. 修改闭环

每次修改都要同步审计 `loading/{js,json,wxml,wxss}`、`metadata/components.js`、`preview/app.js`、`preview/styles.css`、API/H5 文档、`_example`、`miniprogram_dist` 和本合同；新增事实同步写入 Feedback Ledger。

必须运行 `node scripts/test-loading.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`，并核验源码、dist、示例安装与存在时的微信 npm 产物一致。真机仍需使用合法 AppID 验证全屏覆盖、rpx、样式隔离、Slot、动画和读屏。
