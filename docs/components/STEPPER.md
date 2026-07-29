# Stepper 组件语义合同

本文是 PoemUI Stepper 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component stepper`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

当前对照基线为 TDesign Mini Program 1.15.3 的 Stepper 文档与 npm 源码；参考其 11 Props / 4 Events 主干，但所有取舍仍以 PoemUI 的真实组合、事件闭环和移动端可用性为准。

## 1. 组件定位

- Stepper 用于在明确的最小值、最大值与步长约束内调整单个数值。
- 适用于数量、份数、次数等短数值；连续区间拖动使用 Slider，任意文本或复杂数字格式使用 Input。
- 单位、库存说明、校验提示与加载、空、错误、重试状态属于消费方内容，不进入 Stepper 内部，也不通过默认 Slot 伪装成组件能力。

## 2. 固定结构与区域

```text
Stepper(group)
├─ Minus(PUI Button + Icon)
├─ Value(PUI Input)
└─ Plus(PUI Button + Icon)
```

- 三个区域始终存在，保证数值变化、主题和禁用切换时几何稳定。
- 根只负责单一组合 Surface、主题、尺寸编排和裁切；不得在 Input 外再生成第二层输入框 Surface。
- Stepper 不渲染默认 Slot；单位和说明由业务层作为相邻内容组合。

## 3. PUI 组合与依赖

- 加减操作必须使用 PUI Button 的 IconButton 形态，图标由 PUI Icon 提供；输入必须使用 PUI Input。
- WXML 和 H5 镜像必须监听 PUI Input 的 `change / enter / focus / blur` 合同，不得监听不存在的子组件事件。
- 根可以让嵌入 Input 的 Surface 透明，但不得穿透覆盖 Button/Input 的高度、padding、字号或交互尺寸。
- 禁止用原生 `button`、字符 `+ / -` 或第二个原生输入框重做已有 PUI 能力。

## 4. Token、间距与排版

- 动效固定消费 `--pui-duration-normal` / `--pui-ease-standard`，默认 500ms；`reduceMotion` 为真时压缩为 1ms，不暴露私有 duration/easing。
- 颜色、边界、圆角、阴影、焦点与禁用态只消费 PUI 语义 Token。
- `inputWidth` 只控制中间输入区域宽度；尺寸枚举映射到 PUI Button/Input 的标准尺寸，不通过 `!important` 或魔法数改写子组件几何。
- 小程序自定义组件宿主也属于组合几何：Stepper 根固定为“两侧标准 Button 轨 + 中间 `inputWidth` 轨”的 `inline-grid`，WXML 必须按 `minus / value / plus` 顺序提供三个真实包装轨，并让 PUI Button/Input 宿主在各自轨内占满。禁止再用自定义组件宿主的 absolute `left/right` 坐标交换视觉顺序；该做法在真机可能只留下最后覆盖的加号。物理三轨只负责编排，不改写 Button/Input 的标准高度、padding 或字号。
- `normal / filled / outline` 只改变 Surface 关系，不改变控件尺寸、布局或事件语义。

## 5. 内容、Slot 与组合边界

- Stepper 没有 Slot。单位用 Tag/Text，说明用 Cell/Field 等相邻组件表达。
- 父级可以控制整个 Stepper 的布局位置，但不得给内部 Input 或 Button 建立第二套尺寸和圆角合同。
- 独立组件页中的 Stepper 作为唯一主控件时必须由页面透明布局根水平居中；居中只作用于页面父级，不改变 Stepper 自身宽度、三段固定轨或消费者默认布局。
- loading、empty、error、retry 不属于原子数值步进器；消费者需要时应组合 PUI Loading、Empty 或反馈组件，并负责真实恢复路径。

## 6. 状态与优先级

- 锁定优先级固定为 `disabled > readonly > disableInput > interactive`。
- `disabled` 和 `readonly` 均阻断输入、加减和边界请求；前者表达不可用，后者保留只读语义。
- `disableInput` 只锁定直接输入，加减仍可操作。
- 到达边界后加减按钮仍保留真实点击入口；再次向外调整只发 `overlimit`，不发 `change`，也不伪造数值变化。
- 非数字、空字符串、Boolean 和无穷值不是合法数值，统一规整到安全下界；`0` 始终是合法值。

## 7. 交互、受控边界与事件

- `value !== null && value !== undefined` 为受控模式；`0` 是受控值。受控请求只发事件，父级回写前显示值不提前提交。
- 非受控模式只在首次读取 `defaultValue`；从受控切回非受控时延续最后一次受控值。
- 加减操作立即提交一次 `change`。输入时只保留草稿，失焦或 Enter 时按边界与步长规整后提交一次 `change`；失焦路径固定为 `change` 在前、`blur` 在后。
- `change.detail` 固定包含 `value / previousValue / source / controlled`；`source` 为 `minus / plus / blur / enter`。
- `overlimit.detail` 固定包含 `type / value / min / max / controlled`；`type` 为 `minus / plus`。
- 值未变化时不发 `change`。Stepper 不重复暴露 `input` 事件，也没有实例方法。

## 8. 可访问性

- 根使用 group 语义和可访问名称，并分别声明 disabled/readonly。
- 加减按钮必须有动态可访问名称；边界时名称说明已到最小/最大值，不能只靠颜色表达。
- 输入焦点、错误边界和键盘行为由 PUI Input 承接；Enter 与失焦均走同一个提交规整器。
- 低动效只改变时长，不改变状态顺序或最终值。

## 9. H5 预览与跨端一致性

- H5 使用共享 `iconButtonSample` 和 `inputControlSample` 镜像 WXML 的 PUI 组合，不能手写页面级原生控件。
- 概览按“基础用法、主题与尺寸、步长与边界、状态与输入”分区；工程事件日志不进入概览。
- 基础 WXML 固定为最小调用 `<pui-stepper />`，不展示任何 `bind:*`；事件完整清单只进入 API。
- 标准预览使用 `shadow-safe` 父布局；Stepper 是普通内联表单组件，不建立 edge-to-edge 例外。
- H5 的输入草稿、Enter/blur 提交、边界事件和受控父级回写必须与小程序一致，不能只更新提示文案。

## 10. 响应式、主题与视觉配置

- 390px 下 Stepper 与相邻内容可以自然换行，但页面不得产生横向溢出。
- light/dark、边框、阴影、毛玻璃和大圆角由全局视觉配置驱动；开关只能改变视觉 Token，不能改变数值、焦点和布局宽度。
- 边框关闭时保留盒模型、焦点和边界状态；渐变只作用于页面和 PreviewDevice 画布，不进入 Stepper 内部。

## 11. 明确禁止

- 禁止把 PUI Input 的真实 `change` 误写成不存在的 `bind:input`。
- 禁止输入每敲一个字符就同时发 `input + change`。
- 禁止把边界按钮直接禁用到无法产生 `overlimit`。
- 禁止暴露 duration/easing、重复事件、默认 Slot 或业务单位来扩大基础 API。
- 禁止通过固定子组件高度、`!important` 或嵌套 Surface 拼出连接外观。
- 禁止用 loading/empty/error 文案或静态事件 Cell 冒充真实状态能力。

## 12. 修改闭环

1. 同步审计 `stepper/`、`preview/app.js`、`preview/styles.css`、metadata、API、H5 兼容说明、`_example`、`miniprogram_dist` 和发布入口。
2. 运行 Stepper 专项合同测试、PUI 组合边界、`site:build`、`check`、`pack:check`，并验证 390px、light/dark、视觉开关与低动效。
3. 产物变化后运行 `example:install` 并检查源码、dist、示例安装和 npm tarball 一致；微信 IDE 服务端口关闭时保留 `pending-cli`，不得伪造通过。
4. 新问题或设计取舍写入 Feedback Ledger；H5 通过不能替代真机键盘、焦点和微信安装产物验证。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。
