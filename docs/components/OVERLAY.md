# Overlay 组件语义合同

本文是 PoemUI Overlay 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component overlay`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

- Overlay 是页面级、可组合的遮罩原语：隔离背景并让父级决定显隐。
- 它不承担 Popup、Dialog 的内容面板、位置、关闭按钮、业务状态或任务结果。
- 需要内容布局时由默认 Slot 的消费者负责；需要可关闭浮层时由父级处理 `click({ visible: false })` 后回写。

## 2. 固定结构与区域

```text
受控 rendered layer（fixed，完整页面或 PreviewDevice 边界）
└─ default Slot（消费者内容，可组合 Cell、Button 等）
```

- 根层本身是唯一遮罩 Surface 与点击根；不再创建 mask/content 两套事件层，也不包裹私有弹层 Surface。
- `visible=false` 时先保持同一根节点完成 opacity 退场，再卸载；默认 Slot 的几何由调用方管理。

## 3. PUI 组合与依赖

- Overlay 自身是小程序底层交互根，可使用原生 `view`；H5 只允许遮罩桥接使用具名原生 `button`。
- 默认 Slot 应组合现有 PUI Cell、Button、Icon、Loading 或 Empty；Overlay 不重画这些子组件。
- 禁止在 Overlay 内重新引入 Card 弹层、关闭入口、Spinner、错误/重试或第二个背景 Surface。

## 4. Token、间距与排版

- 遮罩默认使用 `backgroundColor` 的安全值或主题半透明遮罩色，默认不模糊背景。根层的有效模糊遵循 `blur=true || Provider.frostedGlass=true`：调用方可用公开 `blur` API 单独请求 `--pui-overlay-blur`；Provider 子树开启全局毛玻璃时也自动获得同一 Token。二者都关闭时必须保持纯颜色遮罩，不能以页面私有滤镜替代。透明度过渡使用 `--pui-overlay-duration` 与 `--pui-ease-standard`。
- Overlay 不拥有 position、padding、safe area 或内容字体 Token；这些属于页面和默认 Slot。
- `zIndex` 只改变根层级，不得改变 Slot 尺寸或页面间距。

## 5. 内容、Slot 与组合边界

- 仅有 default Slot。它是遮罩上的真实消费者内容，不是第二套 `content` API。
- Slot 中点按沿 WXML 根的 `bind:tap` 冒泡，和遮罩空白处一样发出唯一 `click`；调用方需要阻止冒泡或细分业务操作时应在 Slot 内实现。
- Overlay 不穿透覆盖 Slot 子组件的圆角、内边距、阴影、毛玻璃或状态。

## 6. 状态与优先级

- Overlay 只表达 `visible`；不支持 active、selected、disabled、readonly、loading、empty、error、retry 或业务成功状态。
- `visible=true` 先挂载再进入；`visible=false` 先退出再卸载。没有 after-open/after-close 对外事件，因此动画完成不得被假状态文案替代。

## 7. 交互、受控边界与事件

- `visible` 始终由父级受控，没有 `defaultVisible` 或实例 `open/close/toggle`。
- 可见根被点按时固定触发 `click({ visible: false })`；Overlay 不自行改写自身 data，父级可选择回写或保持显示。
- `preventScrollThrough=true` 时根以 `catchtouchmove` 阻断底层触摸滚动；它不是内容滚动或手势 API。

## 8. 可访问性

- 根使用 button 角色与 `ariaLabel`；H5 遮罩桥接 button 必须有同一可访问名称。
- 退出态必须不可点且 `aria-hidden=true`；低动效将过渡压缩为 1ms。

## 9. H5 预览与跨端一致性

- H5 使用同一受控状态、完整 PreviewDevice 内 absolute 遮罩、实际 wheel/touchmove 阻断和 click 回写；不伪造原生生命周期或业务结果。
- 已挂载遮罩在打开、关闭与阶段计时中只更新 active/ARIA；禁止在 entering/leaving 阶段调用 `renderStage()` 替换根层，只有初次挂载和退场完成才可重绘。
- 演示采用 `edge-to-edge`：透明页面背景、真实 PUI Button 触发入口和居中的展示级 `Hi PoemCoder` 默认 Slot；独立页与 H5 概览均不为该文案建立 Cell、Card 或按钮面板。文案固定消费 `--pui-text-on-inverse`，保证两种主题下均能在默认深色遮罩上阅读。
- `usingCustomNavbar=true` 时 H5 示例页保留 44px 自定义导航栏并让遮罩从其下方开始；微信端由胶囊与状态栏真实距离计算，未可用时回退 0。

## 10. 响应式、主题与视觉配置

- 390px 下遮罩完整覆盖 PreviewDevice，Slot 内容使用自身 max-width 且不产生页面级横向溢出。
- light/dark 影响默认遮罩下的真实 PUI Slot；全局 `frostedGlass` 与本地 `blur` 都只改变遮罩根的背景采样，不改变 Slot、事件或布局责任。`frostedGlass` 关闭后仍允许 `blur=true` 的单独 Overlay 保持模糊；border、shadow、large radius 与 gradient 不改变 Overlay 几何。

## 11. 明确禁止

- 禁止恢复 defaultVisible、position、padding、safeArea、closeOnClick、content-click、disabled、easing、after-* 或实例方法。
- 禁止用静态提示、假成功或内部状态代替父级 `visible` 回写。
- 禁止让 H5 产生小程序没有的关闭策略、位置、浏览器系统导航栏或业务状态。

## 12. 修改闭环

1. 同步审计 `overlay/` 四件套、`metadata/components.js`、`preview/app.js`、`preview/styles.css`、`_example`、API、H5 兼容说明与安装产物。
2. 运行 `node scripts/test-overlay.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`。
3. 实测受控 true/false、click 回写、Slot 冒泡、滚动阻断、300ms/1ms、390px、主题与全部视觉开关；同步 Ledger，并保留微信 fixed、胶囊距离、Slot 投影和读屏真机风险。

TDesign 对照固定为 `tdesign-miniprogram@1.15.3` 的官方 Overlay 文档、源码和包内 `miniprogram_dist/overlay`：公开主干是 `visible/backgroundColor/duration/preventScrollThrough/usingCustomNavbar/zIndex` 与 `click({ visible: !visible })`。PoemUI 保留可验证的 `ariaLabel/reduceMotion`，并在 Overlay 已可见时规范化 click 详情为 `{ visible: false }`；新增 `blur` 是调用方的显式视觉扩展，固定消费 `--pui-overlay-blur`，同时与 Provider 的 `frostedGlass` 取并集，不照搬 `style/custom-style` 通用逃生口。
