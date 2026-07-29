# Steps 组件语义合同

本文是 PoemUI Steps 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component steps`

当前对照基线为 TDesign Miniprogram 1.15.3 的 Steps / StepItem 文档与 npm 源码。参考不等于复制；Props、Events 与条目字段的完整清单以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- Steps 只表达流程的阶段、当前进度与可选步骤，不承担流程数据加载、请求失败、重试、提交或前后页导航。
- loading、empty、error、retry 应由页面组合 PUI Loading、Empty、Result、Button 等组件承接。
- Steps 不提供 footer Slot、业务动作或实例方法；调用者通过 `current/change` 完成唯一状态闭环。

## 2. 固定结构与区域

```text
Steps region
└─ Step list
   └─ Step × n(PUI Button)
      ├─ Indicator(PUI Icon / index / dot)
      ├─ Title
      ├─ Content(optional)
      ├─ Extra(optional)
      └─ Connector(except last visual item)
```

- items 为空时不渲染假空态、占位卡或虚构步骤。
- horizontal 与 vertical 只改变结构方向；sequence 只改变视觉顺序，不改变 items 的身份或事件值。
- theme=default 显示序号或 Icon；theme=dot 使用点状指示。

## 3. PUI 组合与依赖

- 每个可见步骤必须组合 PUI Button；item.icon、完成和错误状态使用 PUI Icon，其中完成固定为 `check`、错误固定为语义 `error-circle`，不得用裸字符或无语义的关闭符号替代。官网场景入口同样必须使用 PUI Icon；数字序号、dot 与连接线属于 Steps 自身进度语义，不能伪装为图标。
- 小程序每个 Step 使用覆盖整项的透明 PUI Button 作为唯一真实交互层；indicator、copy 与 connector 由 Steps 自身的视觉 body 承接，不再放入 Button 默认 Slot。水平 connector 从指示器半径外再留一个连接间隙，纵向 connector 的 x 轴固定落在 `44rpx` indicator 的 `22rpx` 中心；三者必须基于同一个 item 原点，禁止让 Button 内部内容轨道改变连线坐标。
- WXML 与 H5 不得手写另一套 Button、Icon 或字符图标；H5 必须调用 `buttonSample.defaultSlot` 与 `iconComponent`。
- 不依赖 PUI Loading/Empty；业务状态不属于 Steps。

## 4. Token、间距与排版

- 颜色、边界、间距、字号、行高和圆角必须使用 PUI Token；H5 按 `1px≈2rpx` 镜像。
- Steps 内部几何别名固定为：默认指示器 `44rpx`、中心 `22rpx`、连接间隙 `16rpx`、纵向条目间隙 `12rpx`；H5 分别镜像为 `22px / 11px / 8px / 6px`。页面不得覆盖这些内部别名修正单个截图。
- default 纵向线从“当前指示器底边 + 连接间隙”开始，到“下一指示器顶边 - 连接间隙”结束；dot 纵向线还必须计入自身 `20rpx` 尺寸和 `12rpx` offset。线宽通过 `translateX(-50%)` 精确居中到锚点，不能把完整 `44rpx` 尺寸当作中心坐标。
- horizontal 与 vertical、default 与 dot 必须共用同一组中心/间隙语义；修复一个方向时，专项测试必须同时锁定四种组合及 H5 的半比例镜像。
- 标题、内容与附加信息允许自然换行，不公开 `maxTitleLength`，不得通过组件 API 破坏原文。
- 状态动效固定为 `500ms + --pui-ease-standard`；`reduceMotion=true` 和系统低动效压缩为 1ms，不公开 duration/easing。
- 不对 `height:auto` 做 transition，不使用 `display:none` 制造状态瞬移，不重复播放入场动画。

## 5. 条目字段

- items 条目支持 `title/label`、`content/description`、`extra`、`value`、`icon`、`status`、`disabled`、`ariaLabel`。
- title 为空时按 label、序号回退；content 兼容 description；value 缺省时使用条目索引。
- status 只允许 `default/process/finish/error`；未显式指定时按当前步骤位置推导。
- 条目显式 status 只覆盖自身视觉，不改变 current/value 身份与其他条目的推导。

## 6. 状态与优先级

- 根状态只有正常、readonly、disabled；单项支持 disabled。
- currentStatus 只决定当前项的 `default/process/finish/error` 视觉。
- 受控 current 未命中、items 为空或全部禁用时保持无当前项，不偷偷改写为索引 0。
- 非受控 defaultCurrent 未命中时选择第一个可用项；全部禁用时保持 null。

## 7. 交互、受控边界与事件

- `current !== null/undefined` 为受控模式；选择不同步骤只发布一次 `change`，父级回写前不改变当前项。
- 非受控模式只在首次使用 defaultCurrent；从受控退回非受控时继承最后一次真实受控值。
- current 与 item.value 使用严格原始值比较；数字 `0`、字符串 `'0'`、`false` 与空字符串必须互不碰撞。
- 重复选择当前项不发布事件；readonly、disabled 根或 disabled 条目不发布事件。
- change detail 固定包含 `value/index/item/previousValue/previousIndex/source/controlled`。
- 不公开 click/input/retry、select/next/prev 实例方法或自动流程推进。

## 8. 可访问性

- 根使用 region，集合使用 list，每项使用 listitem 并同步 `aria-current`、`aria-disabled`。
- H5 步骤支持 Enter/Space，并把事件 source 标记为 keyboard；readonly/disabled 项不可触发选择。
- 当前、完成、错误、禁用和键盘焦点不能只靠颜色表达；图形、文字和 focus-visible 必须保留。

## 9. H5 预览与跨端一致性

- 概览使用左侧 PUI Button 场景选择器与右侧唯一真实 Steps view；场景固定为“基础用法 / 方向与顺序 / 主题与状态 / 边界值与禁用”，不得把四个实例纵向堆叠。场景入口是 `tablist/tab/tabpanel`：当前项必须同步 `aria-selected`、`aria-current` 与高对比 PUI Button 选中态，不能只靠弱背景或标题变化辨识。
- “主题与状态”场景要用 default indicator 呈现 PUI `check`、`error-circle` 和序号；dot 主题仍由真实 Props 单独验证，但不能在状态示例中把状态图形全部隐藏。
- 当前 Props 作用于基础场景；其他场景是可真实操作的固定合同样例，并分别维护自己的非受控运行态。切换场景必须替换右侧 Steps 的真实 Props/布局，不能只换标题或提示文字。
- H5 Steps 作为 PUI Button 默认 Slot 时必须取消通用 small Button 的固定高度/隐藏溢出约束，依据 Steps 自己的内容高度完整展示指标、标题、内容与 extra；不得通过裁切文字或降低字号假装适配窄屏。
- 390px 窄屏下场景选择器可响应式移到视图上方，真实 Steps 恢复全宽；这是内容可读性的窄屏重排，不得同时渲染多个场景或裁掉步骤内容。
- 基础 WXML 零 `bind:*`；完整 change 只进入 API Events，事件专项示例只展示最小绑定。
- H5 的受控演示必须通过真实属性回写，不能只改提示文字。

## 10. 响应式、主题与视觉配置

- 390px 下 horizontal 默认等分；scrollable=true 时步骤进入可触摸横向滚动，不能造成页面级横向溢出。
- vertical 允许标题、内容与附加信息自然增高，connector 随条目高度延伸。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变背景下保持单一透明布局根；Steps 自身不建立额外 Surface 或外投影，indicator/connector/focus 仅保留各自边界。
- 边框开关只影响中性 indicator/connector 边界，不改变尺寸、状态边界或焦点轮廓。

## 11. TDesign 取舍与明确禁止

- 保留 TDesign 1.15.3 的 current/defaultCurrent/currentStatus/layout/readonly/sequence/theme 主干。
- PoemUI 使用 items 合并 StepItem 的内容，额外保留 scrollable、disabled、ariaLabel、reduceMotion 四项产品合同。
- 不新增独立 StepItem 组件；当前数据驱动形态已经覆盖动态流程、严格值身份和 H5 属性面板。
- 禁止恢复 `maxTitleLength/showDescription/customFooter/loading/loadingText/error/errorText/retryText/emptyText/duration/easing`。
- 禁止恢复 `click/input/retry`、`select()/next()/prev()`、footer Slot、假空态、假重试或业务提交动作。

## 12. 修改闭环

1. 同步审计 `steps/`、PUI Button/Icon、`index.js`、metadata、H5、Props、WXML、API、兼容说明、`_example`、`miniprogram_dist` 与 npm/微信安装产物。
2. 运行 Steps 专项合同、组件组合/原生控件边界/语义合同、`npm run site:build`、`npm run check` 和 `npm run pack:check`。
3. 浏览器真实点击和键盘，验证 change、重复选择、受控父级回写、非受控连续性、0/`'0'`/false/空字符串、readonly/disabled、default/dot、horizontal/vertical、positive/reverse、scrollable、180/1ms、390px、light/dark 与全部视觉开关。
4. 产物变化后运行 `npm run example:install` 并校验源码、dist、示例安装与 tarball；微信 CLI 失败时保留 `pending-cli`，不得手工冒充成功。
5. 新事实写入 Steps Feedback Ledger；用户已授权本 Goal 后续组件由 Agent 在完整证据后自主验收。

真机仍需复核 rpx、横向手势、触摸反馈、样式隔离、系统低动效和目标基础库 ARIA 支持。任何不能满足本文的实现必须写入 Ledger，不得静默绕过。

## 2026-07-28 连线几何复核

用户在微信 Steps 独立页再次指出纵向连线锚点错误。审计确认旧 WXSS 用 `left: var(--pui-space-step-22)`，把 `44rpx` 指示器的完整尺寸当成中心，连线实际落在右边缘；旧专项测试也错误地把这两个值视为同义而产生假通过。现在小程序与 H5 都使用组件内部中心、尺寸、连接间隙、条目间隙和 dot offset 别名，横纵/default/dot 四种组合按同一公式计算，测试同时做数值几何和源码公式校验。见 `PUI-FB-0427`。
