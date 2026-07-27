# Sticky 语义合同

本文是 PoemUI Sticky 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component sticky`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

Sticky 解决的是长页面中一小段既有内容需要在滚动时临时停留于顶部的问题。它只管理定位、同高占位和可选容器下边界；标题、背景、边界、加载、错误、重试、滚动容器和业务状态都属于默认 Slot 的消费者。

它不替代 Tabbar、Navbar、Indexes 或 ScrollArea，也不是通用页面滚动控制器。

## 2. TDesign 对照基线

- 在线参考：<https://tdesign.tencent.com/miniprogram/components/sticky>、<https://github.com/Tencent/tdesign-miniprogram> 与 <https://www.npmjs.com/package/tdesign-miniprogram>，于 2026-07-20 核验。
- 固定参考：`tdesign-miniprogram@1.15.3`，tarball 为 <https://registry.npmjs.org/tdesign-miniprogram/-/tdesign-miniprogram-1.15.3.tgz>。
- 实际读取包内 `miniprogram_dist/sticky/{props.js,type.d.ts,sticky.js,sticky.json,sticky.wxml,sticky.wxss}`：公开 `container/disabled/offsetTop/zIndex`、默认 Slot 和唯一 `scroll`；无公开实例方法。
- PoemUI 保留这一定位主干和内部页面滚动分发行为，拒绝旧页面/容器双目标、标题/说明、自定义内容、视觉外观、状态、动效、重复事件和命令式方法。

## 3. 固定结构与区域

结构稳定为两层：根节点负责 fixed 时的同高占位，内容节点承载唯一默认 Slot 并在达到偏移时使用 fixed。根节点和内容节点分别公开 `pui-class`、`pui-class-content` 外部样式类；两者都不应新增可见 Surface。

`container` 为函数时，内容到达该节点底部前退出 fixed 并向上平移；没有函数时只按页面滚动位置吸顶。页面既有 `onPageScroll` 必须由共享行为保留后再分发，不能覆盖消费者原处理函数。

## 4. PUI 组合与依赖

Sticky 是布局底层，不内置 Button、Cell、Icon、Loading 或 Empty。默认 Slot 示例优先组合 `pui-cell`；Slot 内的交互仍属于消费者，不得由 Sticky 抢占或伪造结果。

允许根节点使用 `view`，因为它是组件自身的定位实现根。不得为了演示再创建裸 Button、私有标题卡或状态提示条。

## 5. Token、内容与状态边界

Sticky 自身只使用布局声明，不拥有背景、边框、阴影、圆角、字体或动画 Token；这些由默认 Slot 的真实 PUI 组件和 ConfigProvider 消费。`disabled=true` 只恢复普通文档流，不禁用 Slot。

唯一 Slot 是默认 Slot。没有内置 title/description、named Slot、loading、empty、error、retry、受控值或状态优先级；业务页面需要这些能力时必须在 Slot 内组合相应 PUI 组件。

## 6. 交互、事件与可访问性

页面每次滚动后，Sticky 通过 selector query 测量并发布唯一 `scroll`，detail 为 `{ scrollTop, isFixed }`。没有公开方法；内部的测量函数不得写入 API 或示例按钮。

Sticky 不是焦点或点击控件，不创建额外 role、可访问名称或键盘入口；默认 Slot 中的组件各自承担这些语义。数值 `0` 的 `offsetTop` 和 `zIndex` 必须保留为合法值。

## 7. H5 预览与跨端一致性

概览采用 `edge-to-edge` 父布局，只保留一个基础用法，并让同一个真实局部滚动区域精确填满 PreviewDevice 的完整宽高。基础预览固定提供 50 项连续 Cell，确保具有足够长的真实滚动距离；局部滚动条隐藏且不得占用右侧 gutter，保证列表左右几何对称。滚动内容上下各保留一个 `--pui-preview-device-padding` 安全留白，正文 Cell 间距为 `0` 且不各自形成圆角卡片，Sticky Header 则使用 `--shadow-soft` 表达其脱离正文流后的层级。页面 Header 已经提供组件标题，因此设备内不再重复渲染“基础用法”标题，也不为滚动根增加第二层卡片外壳。不得为了枚举 `offsetTop/container/disabled` 再复制多个矮小滚动窗；全部公开 Props 仍由属性页控制并实时作用于这一份预览。

小程序独立页使用页面唯一 ScrollArea 的真实 `scroll` 事实驱动 Sticky，正文固定提供十条连续 Cell；这十条是原五条演示内容的双倍滚动预算，用于完整观察进入吸顶、保持和恢复文档流，不能缩回首屏即见底的短列表。偏移与暂停操作使用共享两列 PUI Button，不新增 Sticky 公共能力。

H5 使用局部滚动与 CSS `position: sticky` 呈现与 WXML fixed/占位一致的可见结果；H5 的容器输入仅映射当前演示中的真实边界区域。生成的 WXML 在该值非空时输出 `container="{{stickyContainer}}"`，并要求使用者在 `page.js` 提供返回 NodesRef 的函数，不能把字符串当作原生能力。

浏览器不替代微信对 `onPageScroll`、SelectorQuery、fixed、rpx、样式隔离和读屏的最终实现。

## 8. 响应式、主题与视觉配置

390px 下各展示段、默认 Slot 和 API 表格必须自然换行，不产生页面级横向溢出。light/dark、边框、阴影、毛玻璃、大圆角与渐变由 Slot 组件及全局 PreviewDevice 处理；Sticky 不保存第二份视觉状态，也不得以 private CSS 覆盖 Slot 的几何。

## 9. 明确禁止

- 禁止恢复 `scrollTarget/scrollTop/fullWidth/safeAreaInsetTop/placeholder/title/description/customContent/bordered/shadow/duration/easing/reduceMotion` 等旧公共 Props。
- 禁止恢复 `ready/change/fixed/unfixed/boundary/error`、`update/refresh/getState`、假事件状态或自动成功提示。
- 禁止把 `container` 字符串、选择器或 H5 CSS 专属能力宣称为小程序原生 Props。
- 禁止用 `height:auto` transition、`display:none` 瞬移或超过 500ms 的定制动效；当前组件不定义自有动画。

## 10. 修改闭环

每次修改都要同步审计 `sticky/{js,json,wxml,wxss}`、`metadata/components.js`、`preview/app.js`、`preview/styles.css`、API/H5 文档、`_example`、`miniprogram_dist` 和本合同；新增事实同步写入 Feedback Ledger。

必须运行 `node scripts/test-sticky.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`，并核验源码、dist、示例安装与存在时的微信 npm 产物一致。真机仍需使用合法 AppID 验证页面滚动、容器函数、SelectorQuery、rpx、样式隔离、触摸和读屏。

## 11. 2026-07-27 独立页 Navbar 偏移

组件页中的 `offsetTop` 必须由实测 `navbarHeight + 页面额外偏移` 组成；不得写死 Navbar 高度。通用测量回调位于 `miniprogram/utils/component-page.js`，Sticky 页面消费它，见 `PUI-FB-0424`。
