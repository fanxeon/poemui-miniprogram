# Calendar 组件语义合同

本文是 PoemUI Calendar 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component calendar`

当前对照基线为 TDesign Mini Program 1.15.3 的 Calendar 文档与 npm 源码。参考不等于复制；公开合同只保留 PoemUI 能在微信原生端、H5、文档和测试中真实闭环的能力。

## 1. 组件定位

- Calendar 用于选择单日、日期范围或多个日期，可行内呈现，也可在完整视口遮罩中居中弹出。
- 它只管理日期选择、面板和显隐请求，不负责预约、库存、提交成功、网络请求或业务持久化。
- Props 固定为 `value/defaultValue/title/type/visible/defaultVisible/minDate/maxDate/disabledDates/disableWeekends/firstDayOfWeek/switchMode/showOutsideDays/allowSameDay/maxRange/maxMultiple/localeText/autoClose/usePopup/closeOnOverlayClick/disabled/readonly/loading/error/ariaLabel/reduceMotion`；Events 固定为 `change/limit/panel-change/visible-change/confirm/cancel/retry`；0 Slots、0 公开 Methods。

## 2. 固定结构与区域

```text
Calendar host(inline | popup)
├─ Overlay(popup only)
└─ Calendar(group)
   ├─ Header
   │  ├─ Title / Today PUI Button
   │  └─ Previous / Month / Next PUI Button
   ├─ Body
   │  ├─ Week + 42 date cells
   │  ├─ PUI Loading
   │  └─ PUI Empty(error | empty)
   └─ Footer(optional)
      └─ Cancel / Confirm PUI Button
```

- 六周 42 格始终保留稳定几何；隐藏外月日期只清空内容并禁用，不缩短网格。
- `localeText.today/confirm/cancel/retry` 为空时对应操作不渲染；不增加另一套 `show*` Boolean。

## 3. PUI 组合与依赖

- 标题操作、月份导航、确认、取消和 Retry 使用 PUI Button；加载和空/错状态分别使用 PUI Loading 与 PUI Empty。
- 上一月/下一月固定使用两个 `icon-only` PUI IconButton，并由 `72rpx / minmax(0,1fr) / 72rpx` 三列轨道承载；不得依赖自定义组件宿主在 Flex 中自行分配宽度，避免右侧导航被推到可见区域外。
- 日期格和遮罩属于 Calendar 自身的底层交互根，可以使用平台原生节点；不得机械嵌套 PUI Button 改变 grid 与手势语义。
- H5 必须调用共享 Button、Loading、Empty 镜像，不复制图标、Spinner、状态卡或临时按钮皮肤。

## 4. Token、间距与排版

- Header、Body、Footer 使用 PUI 分区、面板和内容间距 Token；日期格使用语义字号、圆角、文字色和 Surface Token。
- 标题和 API 文本允许自然换行，不使用 ellipsis、nowrap、固定高度或 text-cut 裁掉信息。
- 组件显隐、内容/状态切换和日期反馈固定 500ms standard easing；`reduceMotion=true` 压缩为 1ms，不公开 `duration/easing`。
- WXSS 只通过根节点时长 Token 压缩内部动效，禁止以 `*` 跨越 Calendar 子组件边界。

## 5. 内容、Slot 与组合边界

- Calendar 不提供 Slot。业务标题补充、筛选说明、预约结果和提交操作应作为相邻组件组合。
- `localeText` 只覆盖 `today/confirm/cancel/loading/error/retry/empty`，不接受任意 HTML/WXML 或组件配置。
- 不得恢复 header/footer/default Slot、customHeader/customFooter Boolean 或把 Tag/Cell 诊断信息塞入日历根。

## 6. 状态与优先级

- 内容优先级固定为 `error > loading > content > empty`。错误 Retry 只发请求，不清除 `error`；Loading 不伪造完成。
- 交互门禁为 `disabled > loading/error > readonly > interactive`。`readonly` 只阻止日期选择，仍允许浏览面板、确认、取消和遮罩关闭。
- 日期只接受严格 `YYYY-MM-DD` 或有限时间戳；不存在日期、无效值和越界选择被过滤，min/max 反向时交换。
- `showOutsideDays=true` 时外月日期可选择并切换面板；关闭时外月格保留但不可选。

## 7. 交互、受控边界与事件

- `value !== null && value !== undefined` 时受控；空字符串是受控的“未选择”，数字时间戳 `0` 是合法受控日期输入。退控后保留最后受控渲染值。
- `defaultValue/defaultVisible` 只在首次挂载读取；`visible=false` 是合法受控关闭态，退控后继续最后显隐状态。
- 日期变化只发布一次 `change`，不重复发布 `select/input`。范围或多选超限只发 `limit`，不截断或伪造选择。
- 面板变化统一为 `panel-change`；显隐统一为 `visible-change`。确认与取消先发布自身事件，再按合同请求显隐。
- `autoClose` 只在单选完成、范围完成或确认时请求关闭；多选点按保持打开。

## 8. 可访问性

- 根使用 group 语义并同步 `aria-label/disabled/readonly/busy`；日期格同步完整日期、selected 与 disabled。
- 周标题仅辅助视觉排列；月份导航和操作 Button 必须有完整可访问名称。
- disabled 与 readonly 的差异不能只通过低透明度表达；深浅色下选择、今天、禁用和范围必须可辨识。

## 9. H5 预览与跨端一致性

- H5 使用同一严格日期规整、UTC 自然日范围计算、42 格网格、受控连续性和事件来源。
- 概览固定分为“基础用法 / 范围与多选 / 日期限制 / 状态与反馈”。基础 WXML 为 `<pui-calendar />` 且零 `bind:*`。
- `usePopup=true` 动态使用 edge-to-edge PreviewDevice 布局，遮罩覆盖完整 viewport；行内模式使用 shadow-safe。
- API 完整显示 26 Props、7 Events、0 Slots、0 Methods，不裁切任何表格文字。

## 10. 响应式、主题与视觉配置

- 390px 下 7 列日期仍可点击，Header 与 Footer 可自然换行，组件不得制造页面级横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变背景下必须可读；外观开关不改变日期数量、选择值或命中区。
- Popup 只建立一个组件 Surface；遮罩、纯布局 host 和 PreviewDevice 背景不得形成卡片套卡片。

## 11. TDesign 取舍与明确禁止

- 保留 TDesign 1.15.3 的 `allowSameDay/autoClose/firstDayOfWeek/localeText/maxDate/minDate/readonly/switchMode/title/type/usePopup/value/defaultValue/visible` 主干及 `change/confirm/panel-change/close` 的真实职责。
- 2026-07-27 再次访问官方 Calendar 页面与仓库，并解包 `tdesign-miniprogram@1.15.3` 核对 `calendar.wxml`、`calendar-header.wxml` 与 `calendar.wxss`；参考其左右对称导航操作区，PoemUI 继续使用 PUI IconButton 并以固定三列轨保证两侧箭头同时可见。
- PoemUI 使用统一 `visible-change` 替代重复 close/open，保留指定日期、周末、外月显示和选择上限，并增加 `disabled/loading/error/ariaLabel/reduceMotion`。
- 拒绝当前没有双端真实实现的格式化函数 Prop、customNavbar、confirm/title Slot，以及重复 `select/input/month-change/year-change/input-visible/open/close/today` 事件和公开实例写方法。
- 明确禁止 `display:none` 状态瞬移、`height:auto` transition、max-height 伪动画、超过 500ms 动效、局部遮罩和 fake success。

## 12. 修改闭环

1. 同步审计 `calendar/`、PUI Button/Loading/Empty、`index.js`、metadata、H5、Props、WXML、API、兼容说明、`_example`、`miniprogram_dist` 与 npm/微信安装产物。
2. 运行 `node scripts/test-calendar.js`、组合/原生控件边界、组件合同、`npm run site:build`、`npm run check` 和 `npm run pack:check`。
3. 浏览器真实点击日期与导航，验证范围/多选/上限、受控/非受控、0/false/空字符串、disabled/readonly/loading/error/empty/retry、180/1ms、390px、light/dark 与全部视觉开关。
4. 产物变化后运行 `npm run example:install` 并校验源码、dist、示例安装与 tarball；微信 CLI 失败时保留 `pending-cli`，不得手工冒充成功。

真机仍需复核微信触摸命中、fixed 遮罩、rpx 七列网格、样式隔离、系统低动效、读屏顺序和目标基础库对 WXML ARIA 的支持。任何不能满足本文的实现必须写入 Ledger，不得静默绕过。

## 13. 等距与阴影资格

Calendar 根是独立 Surface；`equalSpacing` 只调整 Header、Body、Footer 的直接分区和四向 inset，七列日期格、状态内容和按钮内部间距保持原合同。阴影只属于日历 Surface 根。
