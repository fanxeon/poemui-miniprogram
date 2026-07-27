# Picker 组件语义合同

本文是 PoemUI Picker 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或滚轮交互前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component picker`

Props、事件和方法完整清单以 `docs/COMPONENT_API.md` 为准。当前公开合同固定为 26 Props / 8 Events / 0 Slots / 6 Methods。

## 1. 组件定位

- Picker 是基于微信原生 `picker-view / picker-view-column` 的单列、多列和级联滚轮选择器。
- Picker 不等于 Select。简单单选使用由 PUI Button + Popup 组成的 `pui-select`；需要多列、级联、草稿确认或内联滚轮时使用 `pui-picker`。
- 滚动只更新草稿并发布 `pick`；只有确认才提交值。取消必须丢弃草稿，不得伪造 `change`。

## 2. 固定结构与 PUI 组合

```text
Picker
├─ usePopup=true → PUI Popup
│  ├─ type=default → Header: primary Check IconButton / title / default Close IconButton
│  ├─ Content: Body
│  └─ type=classic → Footer: PUI Button(cancel) / PUI Button(confirm)
└─ usePopup=false → Inline Surface
   ├─ type=default → Toolbar(optional): primary Check IconButton / title / default Close IconButton
   ├─ type=classic → Toolbar(optional): PUI Button(cancel) / title / PUI Button(confirm)
   └─ Body
      ├─ picker-view + picker-view-column
      ├─ PUI Loading
      └─ PUI Empty(error/empty, optional retry Button)
```

- 弹层必须调用 PUI Popup，并真实消费它的 `header-left`、`title`、`close-btn`、滚动 Content 与 Footer Slot；不得向 Popup 不存在的 `header` Slot 投递内容。确认/取消必须调用 PUI Button，选项图标必须调用 PUI Icon，状态必须调用 PUI Loading/Empty。
- `type` 只接受 `default | classic`，非法值安全回退 `default`。Popup 默认 `default`：确认进入 Header 左侧 `header-left`，为 `primary/base/circle + check` 的 PUI IconButton；取消替换 Header 右侧 `close-btn`，为 `default/base/circle + close` 的 PUI IconButton。二者都保留 Popup 三列 Header 的等宽轨道和可访问名称。`classic` 保留既有 Footer 两列的取消 / 确定。内联模式也跟随同一图标左右顺序。两种模式共享同一滚轮 Body、草稿与事件合同。
- `picker-view` 是组件自身的底层交互根，不为了消除平台节点额外嵌套 PUI Button。
- Popup 负责唯一弹层 Surface；Loading/Empty 作为嵌入状态保持透明，不增加第二层卡片。

## 3. 数据形态与严格值

- `columns` 接受三种形态：单列 `PickerOption[]`、二维独立列 `PickerOption[][]`、带 `children` 的级联树。
- `keys` 只映射 `label/value/children/disabled/icon`；非法或空映射回退默认键名。
- value 固定为数组，每列一个原始值。字符串、数字、布尔值使用严格相等；`0`、`false`、空字符串和字符串 `"0"` 不得碰撞。
- 选项 value 未提供时，对象项使用当前列索引，原始标量项使用自身值。label 缺失时才生成“选项 N”。
- 单项 disabled 不可停留；滚动命中禁用项时按移动方向寻找最近可用项，再反向回退。整列没有可用项时进入 empty。
- 最多解析 8 列，避免恶意或循环数据无限扩展；children 只接受数组。

## 4. 受控、草稿与事件顺序

- `value !== null/undefined` 为受控值；组件只发布下一份 value，等待父级回写。非受控模式只在首次挂载读取 `defaultValue`。
- `visible !== null/undefined` 为受控显隐；组件只发布请求，等待父级回写。非受控模式首次读取 `defaultVisible`。
- 打开时以已提交值创建草稿。滚动后固定发布 `pick`，detail 包含完整 value/label/columns、当前 column/index/option、source 和 controlled。
- 确认顺序固定为 `confirm → change（仅值变化时）→ visible-change → close`。`confirm` 即使值未变化也发布，`change` 不重复发布。
- 取消顺序固定为 `cancel → visible-change → close`，并恢复已提交草稿，不触发 change。
- 遮罩只负责 `visible-change → close`，不把关闭冒充取消或确认。
- `autoClose=false` 时确认和取消不自动关闭；`usePopup=false` 时显隐事件与 open/close 方法不生效，滚轮始终可见。

## 5. 状态与可访问性

- 状态优先级固定为 `error > loading > empty > content`。
- loading、error、empty、disabled、readonly 都阻断滚轮和 confirm；readonly 仍允许取消或关闭弹层。
- error 的 retry 只发布请求，不能自动清除 error 或显示 fake success。
- 根提供 group、ariaLabel、disabled/readonly；滚轮提供列级辅助名称，禁用项保留 disabled 语义。
- 标题为空时由 ariaLabel 或“滚轮选择器”提供可访问名称。

## 6. 尺寸、动效与布局

- `itemHeight` 运行时限制为 `64–112rpx`；`visibleItemCount` 只落在 `3/5/7`，偶数按最近可用奇数归一化。
- 微信原生 `picker-view` 的默认浅色 mask 必须显式透明化；当前选项由 `--selected` 类使用主题文字色、字重和透明度表达，避免深色 Popup 出现固定白色渐变块。
- 滚轮状态与 Popup 统一固定 500ms、standard easing；`reduceMotion=true` 将自定义过渡压缩为 1ms。
- 禁止 `display:none` 制造显隐瞬移，禁止对 `height:auto` 做 transition。
- Popup 必须覆盖完整 PreviewDevice viewport；390px 下 Header 左右操作、标题、Classic 双列和状态可以换行或滚动，但不得产生页面级横向溢出。
- Popup 模式固定使用 PUI Popup 的 card Surface、Header/Content/Footer 间距与 500ms/1ms 动效。`default` 使用 Popup Header 的三列几何，`classic` 使用 Footer；不得再用 Picker 私有 180ms 或页面私有标题栏。

## 7. H5 演示

- H5 不再使用 `<select>` 冒充 Picker；必须镜像可点击、键盘、滚轮和 Pointer 拖动的多列滚轮。
- 概览固定分为“基础用法 / 多列与级联 / 状态与反馈 / 内联模式”。当前 Props 真实驱动第一组；其余为同源能力示例。
- H5 受控 value/visible 在事件后执行真实父级回写；非受控状态保留在 Picker demo runtime，不建立第二份伪 Props。
- 基础 WXML 只展示 columns/defaultValue/title/ariaLabel 等必要配置，零 `bind:*`。完整事件进入 API Events；专项事件示例只绑定当前业务需要的事件。
- 错误重试只更新 retry 反馈，保持 error，直到父级真实修改 Props。

## 8. TDesign Mini Program 1.15.3 对照决定

- 固定参考 TDesign 1.15.3 Picker/PickerItem 的官方文档与 npm 安装包 `picker/props.js`、`picker-item/props.js`、类型、JS、WXML 和 WXSS。
- 2026-07-27 再次访问官方 Picker 页面与仓库，并解包 `tdesign-miniprogram@1.15.3` 核对 `miniprogram_dist/picker/picker.wxml`、`template.wxml` 与 `picker.wxss`；参考其 Popup 承载滚轮与完整操作区的任务关系，但 PoemUI 的可见 Surface 必须遵守本项目 PUI Popup 三分区合同。
- 借鉴 Popup/内联双形态、草稿确认、单列/多列/级联、值与显隐受控、可见项数和列高主干。
- PoemUI 使用数据驱动 `columns`，不公开 PickerItem 子组件；微信小程序消费者无需为每列声明额外组件，级联重算由 Picker 统一负责。
- `cancelBtn/confirmBtn/header/popupProps` 收敛为 `type/cancelText/confirmText/showHeader` 和固定 PUI Popup 合同，拒绝任意节点/任意 Popup Props 穿透破坏布局。
- `keys` 扩展 disabled/icon 映射；PoemUI 额外保留 loading/error/empty/retry、readonly、ariaLabel 和 reduceMotion。
- 不照搬 `usingCustomNavbar`：Picker 只位于当前页面/PreviewDevice 边界内，不拥有页面导航栏定位职责。

## 9. 明确禁止

- 禁止恢复旧 `options + 单个标量 value + 原生 <picker>` 的 Select 重复实现。
- 禁止在 H5 使用 `<select>`、静态列或只更新提示文字伪造滚轮、confirm 和父级回写。
- 禁止滚动即提交 change；禁止 cancel 修改已提交值。
- 禁止将全部 `bind:*` 写入基础用法。
- 禁止让 Popup、状态组件或内联外壳形成面板套面板。

## 10. 修改闭环

1. 同步审计 `picker/`、Popup/Button/Icon/Loading/Empty 依赖、metadata、H5、Props/WXML/API、示例、生成器保护、`miniprogram_dist` 和安装产物。
2. 运行 `scripts/test-picker.js`、原生控件边界、PUI 子组件组合、API 可读性和全局设计合同。
3. 浏览器真实验证点击、滚轮、Pointer 拖动、键盘、单列/多列/级联、0/false/空字符串、受控/非受控 value/visible、confirm/cancel/overlay、状态、低动效、390px、主题和全部外观。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5 兼容文档和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。

## 13. 等距与阴影资格

Picker 的 Popup Surface 由 Popup 合同治理；内联模式的 `pui-picker__surface` 只对 Header/Body 主分区使用 Surface inset/section Token。滚轮列和选项内部几何不变，阴影不下沉到列项。
