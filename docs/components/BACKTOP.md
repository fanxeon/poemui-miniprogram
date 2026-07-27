# BackTop 语义合同

本文是 PoemUI BackTop 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component back-top`

## 1. 组件定位

BackTop 是页面导航入口：它只根据外部滚动位置决定显隐，并请求回到页面顶部。页面滚动、列表容器、数据加载、错误反馈和业务完成状态属于消费者；不得把它扩展为可配置滚动引擎或状态容器。

BackTop 不内置 `loading / empty / error / retry`。业务页面需要反馈时，在 BackTop 外组合 PUI Loading、Empty、Result、Toast 或 Button，不能借回顶点击伪造请求成功。

## 2. TDesign 对照基线

- 在线参考：<https://tdesign.tencent.com/miniprogram/components/back-top>、<https://github.com/Tencent/tdesign-miniprogram> 与 <https://www.npmjs.com/package/tdesign-miniprogram>，于 2026-07-20 核验。官网为动态页面，作为产品信息来源；官方仓库确认其小程序组件库与 npm 分发路径。
- 固定参考 `tdesign-miniprogram@1.15.3`，tarball：<https://registry.npmjs.org/tdesign-miniprogram/-/tdesign-miniprogram-1.15.3.tgz>。
- 实际读取包内 `miniprogram_dist/back-top/{props.js,type.d.ts,back-top.js,back-top.json,back-top.wxml,back-top.wxss}`：公开 Props 为 `fixed/icon/scrollTop/text/theme/visibilityHeight`，主题为 `round/half-round/round-dark/half-round-dark`；WXML 有 `default/icon` Slot；点击路径发布 `to-top` 后调用 `wx.pageScrollTo`。
- PoemUI 保留 `ariaLabel/reduceMotion` 作为全库可访问性和低动效合同，保留内部 PUI Button 组合；拒绝旧 `target/targetTop/scrollDuration/right/bottom/size/safeAreaInsetBottom/zIndex/loading/disabled/duration/easing/customContent`、重复事件和实例方法。

## 3. 公共合同

### 3.1 Props

最终只公开：

`fixed / icon / scrollTop / text / theme / visibilityHeight / ariaLabel / reduceMotion`

- `scrollTop` 和 `visibilityHeight` 规整为非负数；`scrollTop >= visibilityHeight` 时显示。`scrollTop` 必须来自页面 `onPageScroll` 或消费者的真实滚动容器回写。
- `fixed=true` 固定至页面右下角并使用系统底部安全区；`false` 参与当前文档流。层级优先读取可选 `--pui-z-index-fixed`，未由安装端声明时回退 `1000`，保证入口位于普通页面内容之上、业务浮层之下。默认底部位置读取 `--pui-back-top-bottom-offset`，未提供时回退 `space-xl + safe-area`；存在底部 Tabbar 的 App Shell 必须用该语义变量组合 `--pui-tabbar-content-height + safe-area + 操作间距`，不得让 FAB 覆盖导航，也不得为此恢复公共 `bottom` Prop。
- `theme` 只接受 `round/half-round/round-dark/half-round-dark`，无效值回退 `round`。
- `round/half-round` 默认使用 primary FAB 表面；`round-dark/half-round-dark` 固定使用 `--pui-bg-inverse: #242424` 与 `--pui-text-on-inverse: #ffffff`。小程序和 H5 必须消费同名 Token，通用 Button 规则不能覆盖 BackTop 的主题语义。
- `text=''` 保持圆形 IconButton，并由 FAB 向内部 Button 传入 `iconOnly`，真实移除空内容轨道。`icon` 默认 `arrow-up`；调用方显式传入空字符串时可以完全由 `icon` Slot 提供可见内容。非空文字与 `half-round` 使用半圆内容尺寸。
- 显隐只过渡 `max-width/max-height/opacity/transform`，固定 500ms standard；`reduceMotion=true` 与系统低动效压缩为 1ms。不得对 `height:auto` 过渡或用 `display:none` 制造瞬移。

### 3.2 Event 顺序

- `to-top`：可见状态的点击发布 `{ scrollTop, source: 'tap' }`，然后调用 `wx.pageScrollTo({ scrollTop: 0, duration })`。
- `duration` 正常为 500ms，`reduceMotion=true` 时为 0；页面滚动完成后仍由 `onPageScroll` 回写 `scrollTop`。组件不发布 `success/error/complete`，也不会自行把 `scrollTop` 改成 0。

### 3.3 Slots 与 Methods

- `icon`：补充或替换 icon 属性的短图标内容。
- `default`：追加在 text 后的短内容，不接管点击、显隐或滚动。
- 0 Methods。`onTap` 是 WXML 内部处理函数，不得作为 `selectComponent()` 公共方法写入 API。

## 4. 结构与组合

- 组件根负责 fixed/static 定位和显隐；唯一交互根复用 Button 家族的 `pui-fab`（其内部唯一交互根仍是 `pui-button`），不得退回裸 `button`、字符图标或独立 Loading 壳。
- JSON 只声明 `pui-fab`。FAB 负责圆形/扩展表面、Icon、禁用语义和主题 Token；BackTop 不再复制 Button 尺寸或穿透覆盖通用 Button 合同。
- FAB 不拥有定位：BackTop 继续决定 fixed/static、右下安全区和显隐动效，父级滚动容器继续拥有 `scrollTop`。
- BackTop 只请求回顶，不能自行篡改外部滚动状态。页面滚动继续由 `wx.pageScrollTo + onPageScroll` 闭环；局部 ScrollArea 消费者应把同一个受控 `scrollTop` 同时传给 ScrollArea 与 BackTop，用户滚动时由 `scroll` 回写，点击 `to-top` 时写入 `0`，由 ScrollArea 内部固定的 `scroll-top + scroll-with-animation` 平滑执行真实定位。
- `fixed` 仅影响定位，不能改变 `scrollTop` 所有权、事件顺序或可访问名称。
- 全局边框、阴影、毛玻璃、大圆角、深浅色依旧通过 Token 和 Button 消费；BackTop 不保存第二份外观状态。

## 5. H5 演示合同

概览固定两个列表区：

1. 基础用法：可真实滚动的局部容器与当前 Props 实例。
2. 显示阈值：阈值与外部滚动位置的可见性关系。

- 基础 WXML 只输出 `<pui-back-top scroll-top="{{pageScrollTop}}" />` 及当前非默认 Props，零 `bind:*`；`to-top` 仅进入 API Events 或专项事件示例。
- H5 点击必须真实滚动 PreviewDevice 内局部容器至 0，并将新位置写回 Props 面板；不能只改提示文字，也不得滚动官网文档页。
- H5 用 `fabSample`（内部复用 `buttonSample`）和 `cellSample`，不手写原生 Button、Spinner、事件状态卡或另一份滚动状态。
- H5 只保留两个真实列表：基础用法使用 18 个 Cell 并绑定局部滚动回写，显示阈值使用 12 个 Cell 表达阈值关系；两个列表都必须形成明显滚动距离，不得以“精简”为由退回接近一屏的短列表，也不再额外堆叠形状、主题或 FAB 诊断舞台。
- 两个列表的 Cell 内容区必须在 frame 内水平居中；局部滚动条不得占用横向布局宽度使 Cell 左偏。FAB 不居中，继续保持 BackTop 的右下浮动语义。fixed FAB 的右、下边距由 frame 内距与列表内容内距相加得到，使其始终落在 Cell 的视觉边界内，不越出编辑预览范围。
- BackTop 是普通组件预览，必须使用 PreviewDevice 的 `shadow-safe` 父布局；两个分区标题也必须消费共享设备内距，并与 frame 内内容保持同一条水平基线。
- H5 的 BackTop theme 规则必须在共享 Button 外观规则之后以明确作用域重申；不能只切根主题数据属性、让 dark 选项仍显示为浅色按钮。
- 390px 下两个列表、长 text、API 表格与四种主题不得造成页面级横向溢出；API 文字自然换行，禁止省略号、`nowrap`、固定高度裁切。

## 6. 明确禁止与禁止回退

- 禁止恢复 page/container 双目标、targetTop、右/下偏移、size、zIndex、安全区开关、loading/disabled、公开 duration/easing 或 customContent 布尔开关。
- 禁止恢复 `click/input/change/backtop/reach/success/error/complete` 或 `backTop/scrollToTop` 公共方法。
- 禁止在隐藏状态发布事件、伪造页面 API 回调，或直接在组件内把外部 `scrollTop` 写为 0。
- 禁止在基础 WXML 展示所有 `bind:*`，或把工程事件诊断 Cell 伪装成组件内容。

## 7. 真机风险

H5 无法替代微信真机对 `wx.pageScrollTo`、fixed 视口、安全区、rpx、Button 点击区域、样式隔离、系统低动效和读屏的最终表现。使用合法 AppID 时，需在真实长页验证 `to-top → pageScrollTo → onPageScroll` 的顺序与回写。

## 8. 修改闭环

每次修改 BackTop 前先运行 `npm run feedback:list -- --component back-top` 并阅读命中的原始记录；涉及全局预览规则时同时查询 `npm run feedback:list -- --scope global`。完成后必须更新本合同、API、H5 兼容说明、示例和进度记录，运行 `node scripts/test-back-top.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`，并在涉及安装产物时核验源码、`miniprogram_dist`、示例安装和微信 `miniprogram_npm` 四处一致。微信 CLI 无法生成产物时，必须记录原因与真机风险，不得手工复制冒充通过。
