# Toast 组件语义合同

本文是 PoemUI Toast 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component toast`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

- Toast 只承载一条短时、非阻塞的反馈，由页面在明确的业务节点调用 `show(options)`。
- 它适合提示“已保存”“正在处理”“输入有误”等瞬时状态；不承担确认、表单提交、可恢复错误或多消息队列。
- Dialog 负责确认，Empty/Result 负责持久状态；Toast 自动收起和 `close` 都不代表业务成功。

## 2. 固定结构与区域

- `rendered` 为真时才挂载固定层；提示本体始终使用同一个 `.pui-toast` 节点完成进入和退场。
- 默认固定层为 `.pui-toast-layer`；`showOverlay` 或 `preventScrollThrough` 时改由内部 `pui-overlay` 承载完整视口遮罩与滚动门禁。
- 本体包含内部 Loading 或 Icon、`icon` Slot、message 文本和 `message` Slot。没有默认 Slot，避免把任意复杂内容扩展成第二个反馈面板。

## 3. PUI 组合与依赖

- 必须复用 `pui-overlay`、`pui-loading` 与 `pui-icon`；遮罩、滚动阻断和主题图标不得在 Toast 内重写。
- Toast 自身的 fixed 提示节点是基础组件交互根，可直接使用 WXML `view`；不得额外包一层 Button、Cell 或装饰手机面板。
- H5 展示入口必须使用共享 `buttonSample`，不能用原生 button 或事件文本模拟 `show()/hide()`。

## 4. Token、间距与排版

- 内距、间距、圆角、阴影、毛玻璃和动效分别使用 `--pui-space-*`、`--pui-radius-*`、`--pui-glass-shadow`、`--pui-frosted-filter-soft` 与 `--pui-ease-standard`。
- 默认进入和退场均为固定 500ms；`reduceMotion` 压缩为 1ms。不得公开私有 duration/easing 调参，也不得对 `height:auto` 做过渡。
- 文本可自然换行并在 560rpx 内容宽度内折行；不得用省略号裁掉反馈主体。

## 5. 内容、Slot 与组合边界

- `icon` Slot 只补充图标区域；`message` Slot 只补充消息区域，可组合短 Tag 等 PoemUI 展示组件。
- 调用方应避免让 `message` Prop 与 `message` Slot 表达重复主文案。
- Toast 负责自身排列（`row/column`）与定位；Slot 不得穿透修改固定层、遮罩、计时或退场几何。

## 6. 状态与优先级

- 主题为 `loading` 且未提供 `icon` 时优先显示内部 Loading；提供 icon 时改用 Icon。其他主题可提供默认 Icon。
- `showOverlay` 负责可见遮罩；`preventScrollThrough` 负责触摸滚动门禁。二者任一为真时使用 Overlay，但不因此新增关闭行为。
- `duration=0` 保持显示；正数 duration 只在进入后安排自动 `hide()`。重复 `show()` 清除上一轮计时并应用新 options。

## 7. 交互、受控边界与事件

- Toast 是命令式组件：不公开 `visible/defaultVisible`，不存在受控回写、`input/change/open` 事件。
- `show(options)` 挂载后在下一帧激活；`hide()` 取消计时、开始退场；只有节点真正卸载后才触发一次 `close`。
- `close` 无业务 detail，不能被调用方视为保存、发布、网络请求或重试成功。

## 8. 可访问性

- 提示根使用 `role="status"`；error 为 `aria-live="assertive"`，其余为 polite。
- `ariaLabel` 依次回退 message、loading 文案和“提示”。内部图标拥有短语义名，纯装饰图标由调用方避免重复命名。
- Toast 没有键盘焦点入口；H5 的显示/隐藏按钮由 Button 提供可访问名称与键盘行为。

## 9. H5 预览与跨端一致性

- 官网概览按“基础用法 / 主题与图标 / 方向与位置 / 遮罩与滚动保护”分区；基础代码只有 `<pui-toast id="delivery-toast" />`，完整事件仅在 API。
- PreviewDevice 使用 `edge-to-edge`：Toast/Overlay 必须覆盖完整手机 viewport，隐藏时仍保留一个真实 PUI Button 触发入口，不能留下空舞台。
- H5 以同一节点的 opacity/transform 镜像 WXML/WXSS，并必须同时提供 `--pui-toast-duration` 和 `--pui-toast-ease:var(--ease-standard)`；网页的 `position:absolute` 只限制在 PreviewDevice 内，不冒充小程序 fixed 全页能力。

## 10. 响应式、主题与视觉配置

- 390px 下提示、四个展示分区和按钮不得造成页面级横向溢出；长 message 必须折行。
- light/dark、border、shadow、frost、largeRadius 与渐变均通过 ConfigProvider/全局 Token 生效；Overlay 与 Toast 本体不得创建另一套颜色或圆角系统。
- `reduceMotion` 和系统低动效必须压缩进退场，Loading 不得继续无限旋转。

## 11. 明确禁止

- 不得恢复 `visible/defaultVisible`、`showIcon`、`zIndex`、`motionDuration`、`easing`、默认 Slot、`input/change/open` 或 `close()` 方法别名。
- 不得以静态成功文字、事件日志或整段重绘伪造 `show()/hide()`、自动关闭或动画中间帧。
- 不得让遮罩点击自动隐藏 Toast，或将 `close` 宣传为业务成功。

## 12. 修改闭环

1. 同步审计 `toast/` 四件套、`metadata/components.js`、`preview/app.js`、`preview/styles.css`、API/H5 文档、示例和安装产物。
2. 运行 `node scripts/test-toast.js`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`；涉及微信产物时执行 `build-npm` 并核对四件套哈希。
3. 真实浏览器复核 show/hide、自动关闭、duration=0、主题/位置/方向、Overlay、低动效、390px、深浅色与六项外观；把新事实写入 Feedback Ledger，并保留合法 AppID 真机风险。
