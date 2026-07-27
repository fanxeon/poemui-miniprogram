# Combobox 组件语义合同

修改 Combobox 前必须查询 `npm run feedback:list -- --component combobox`；完整 Props、事件、Slot 与方法以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- `pui-combobox` 是预设选项的选择器，只管理选值和展开状态；单选、多选、分组、状态、Slot 与实例方法均在其职责内。
- `pui-search` 是独立搜索组件。筛选词、远端检索、创建条目、业务保存与搜索结果排序属于消费者；消费者筛选后把 `options` 传给 Combobox。
- 简单单选用 Select/Picker；不应借 Combobox 内嵌输入框伪造 Search 或业务检索。

## 结构与滚动

```text
Combobox(role=group)
├─ Trigger(role=combobox)
│  ├─ trigger Slot 或选中值 / 多选 Tag chips
│  └─ 清空 PUI Button（条件）+ Chevron Icon
└─ 常驻 Panel(role=presentation)
   └─ 固定高度 Panel inner
      └─ Error | Loading | 唯一 Listbox scroll-view | Empty
```

- `listHeight` 是 Panel 与唯一 `scroll-view` 的固定视口高度，默认 `480rpx`，规整范围 `160–800rpx`。内容多少、外置 Search 的筛选结果、空态和状态切换均不得改变已打开视口高度。
- Panel 节点始终存在，只过渡 `height`、透明度与轻位移；禁止 `display:none`、`height:auto`、SelectorQuery 测量高度或首开引导高度。
- `placement=bottom/top` 只改变纵向顺序与动效原点，不产生额外遮罩或滚动上下文。

## PUI 组合与状态

- 原生 WXML 固定组合 Tag、Button、Icon、Loading、Empty；H5 必须使用同名共享镜像助手。
- Error 的 retry 位于 Empty 后，且只发布请求；不得擅自清除错误或伪造恢复。
- 状态优先级固定为 `error > loading > content > empty`。disabled 阻断所有交互；readonly 可展开查看但阻断选值、清空和方法写入。

## 受控、交互与方法

- `value`、`visible` 以 `!== null/undefined` 判定受控；`0`、`false`、空字符串是有效值。
- 单选默认选择后关闭，多选默认保持展开；`closeOnSelect` 可覆盖。选项和 Trigger 保留组件自身交互根，不额外包普通 Button。
- `open/close/toggle/clear/reset/focus/select/deselect/retry` 真实可用；`focus()` 在本组件中只请求展开，不暗示输入框或软键盘。

## 外置 Search 组合

调用方以透明容器组合 `<pui-search>` 与 `<pui-combobox>`：Search 维护 query 并过滤选项，Combobox 接收过滤后的 `options`。二者不共享隐藏内部状态；页面/H5 需要各自真实回写 Search `change` 与 Combobox `select`。

## 主题、间距与验收

- Trigger 与 Panel 共同消费 `--pui-combobox-radius`；`shape=round` 只改变这套语义半径。可见搜索字段由嵌入 Input Field 承担唯一字段 Surface，展开 Panel 是唯一独立浮动 Surface；Combobox 根不得叠加第二层阴影、边框或毛玻璃。
- 等距模式只作用 Panel 的 Surface inset；不改变 Option、Tag、图标和控件内部微间距。
- 每个 Option 行固定消费内部 `--pui-combobox-option-inset-inline/block` 与 `--pui-combobox-option-gap`：左 Icon 起点和右侧 Check（或正文末端）到行边界使用同一横向 inset，Icon 与正文之间使用内容 gap。它们不是页面可覆写的私有补丁；消费者不得为首页或单个 Search 候选重写 padding/margin。
- 选中 Option 是列表内唯一出现背景的独立选择 Surface，必须显式跟随控制圆角：小程序端使用 `--pui-radius-medium`，H5 使用 `--pui-site-radius-control`。它不借用 `shape=round` 的 Panel 半径，也不能在果味/大圆角时保留直角或用页面样式补偿。
- H5 与小程序均须验证固定 `listHeight`、唯一滚动区、外置 Search 组合、390px、深浅色与全局视觉开关。真机的软键盘、scroll-view、读屏与触摸边界仍需单独验收。

## 明确禁止

- 不得把 Panel 的高度交给选项数量、异步状态或页面私有测量；`listHeight` 是唯一的打开视口依据。
- 不得用隐藏输入、静态选择提示或 Toast 伪造筛选、清空、展开和选值结果。
- 不得让 Search 与 Combobox 形成双重 Surface、双滚动容器或各自维护同一份选值状态。

## 修改闭环

- 变更前完整阅读本合同、`docs/UI_DESIGN_CONTRACT.md` 与 `docs/COMPONENT_FEEDBACK.md`，并执行 `npm run feedback:list -- --component combobox`。
- 同步小程序、H5 镜像、API、专项测试、Feedback Ledger、`miniprogram_dist`、示例安装和微信 npm 产物；最后验证固定高度、单一滚动上下文及深浅色/390px。
