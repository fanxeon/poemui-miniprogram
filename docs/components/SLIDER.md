# Slider 组件语义合同

本文是 PoemUI Slider 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component slider`

Props、事件的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

当前对照基线为 TDesign Mini Program 1.15.3 的 Slider 文档与 npm 源码。TDesign 提供 12 Props，覆盖单值/范围、横向/纵向、刻度、标签、极值和两种主题；PoemUI 继续以微信原生 `slider` 的横向单值手势、表单与平台性能为基础，不伪装其没有的范围、纵向或自绘刻度能力。

## 1. 组件定位

- Slider 用于在连续或等步长区间内通过拖动选择单个数值。
- 少量离散加减优先使用 Stepper；任意数字文本使用 Input；双端范围与纵向轨道在拥有真实微信实现前不属于当前组件。
- Slider 只表达数值请求，不保存业务进度、成功状态或表单提交结果。

## 2. 固定结构与区域

```text
Slider(group)
├─ Min(optional text)
├─ NativeSlider(wechat slider)
├─ Max(optional text)
└─ Value(optional output)
```

- 根始终保持单行、单轨、单拇指结构；只有 `showMinMax/showValue` 控制辅助文字。
- 原生 `slider` 是唯一交互根，不用透明 view、Canvas 或自绘 Pointer 层替代。
- Slider 没有 Slot；单位只由 `valueSuffix` 追加到可见值，复杂状态由消费者在相邻区域组合。

## 3. 原生能力与依赖边界

- 小程序必须继续使用微信原生 `slider`，真实透传 `name/min/max/step/value/disabled/activeColor/backgroundColor/block-size/blockColor`。
- H5 使用真实 `input[type=range]` 镜像同一横向单值合同，并增强方向键、Home 与 End；键盘增强不是微信 WXML 的虚假能力。
- `range/vertical/marks/theme= capsule` 需要自绘手势、测量和多指状态机；在建立独立真实实现与真机证据前明确拒绝，不得只在 H5 演示。

## 4. 数值与受控合同

- `value !== null && value !== undefined` 为受控模式，数字 `0` 是合法受控值；Boolean、空字符串、非有限数值统一回退安全下界。
- 非受控模式只在首次读取 `defaultValue`；从受控切回非受控时延续最后一次已渲染值。
- `max < min` 时上界收敛到下界；非法或非正 `step` 回退 1；数值始终按 `min + n × step` 规整并限制在边界内。
- 拖动中的受控请求不提前提交组件 data；父级通过 `changing/change` 回写 `value`。非受控拖动更新内部值。

## 5. 事件

- `changing` 对齐微信原生拖动中的连续变化，`previousValue` 是上一次真实请求值。
- `change` 对齐微信原生拖动结束，值真实变化时只发一次；`previousValue` 是本次拖动起点。
- 两个事件详情固定包含 `value/previousValue/source/controlled/min/max/step`，`source` 为 `drag`。
- Slider 不重复发布 `input`，也不提供 `setValue/reset/getValue/getState` 方法；声明式 `value/defaultValue` 是唯一写入和读取合同。

## 6. 状态与表单

- 锁定优先级为 `disabled > readonly > interactive`；两者都禁用原生拖动，readonly 额外保留只读语义。
- `name` 只透传微信原生表单字段名，不表示 Slider 自行提交表单。
- `color/trackColor` 仅接受 `#RGB/#RRGGBB/rgb(r,g,b)`；非法值回退当前主题中性色。
- `blockSize` 限制为微信原生允许的 12–28px/rpx 数值区间。

## 7. Token、动效与可读性

- 自定义外层、辅助文字和 H5 轨道过渡固定 500ms，消费 PUI 标准 easing；`reduceMotion` 压缩为 1ms，不公开 duration/easing。
- 微信原生拇指运动由平台手势负责；不得声称 CSS 能控制原生拖动中间帧。
- 边界值与当前值使用 PUI 字体和颜色 Token，允许自然伸展；不得用省略号隐藏完整数值或后缀。
- 外观设置可改变主题、边框、阴影、毛玻璃和圆角 Token，但不得改变数值、轨道长度、拇指尺寸或事件顺序。

## 8. H5 预览与文档

- 概览固定按“基础用法、边界与步长、颜色与表单、状态与受控”分区；不展示方法按钮、工程事件 Cell 或默认 Slot 组合。
- 基础 WXML 固定为 `<pui-slider />`，不得出现任何 `bind:*`；完整事件只进入 API Events。
- 当前属性实例必须真实支持 Pointer/鼠标拖动和键盘操作，并通过父级回写证明受控模式；静态修改提示文字不算交互。
- API 固定完整展示 16 Props、2 Events、0 Slots、0 Methods，允许换行但不得裁切或省略。

## 9. 响应式、主题与视觉配置

- 390px 下长边界值、后缀和 Slider 可换行或压缩轨道，但页面不得产生横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变背景必须真实切换；视觉开关前后 Slider 交互宽度与事件结果稳定。
- 标准预览使用 `shadow-safe` 父布局；Slider 不建立 edge-to-edge 或额外 Surface。

## 10. 明确禁止

- 禁止恢复 `input/change` 双提交事件、实例方法或私有 duration/easing。
- 禁止恢复默认 Slot 或把 Tag、状态文字塞进 Slider 根内。
- 禁止只在 H5 增加 range、vertical、marks、capsule 后宣称小程序支持。
- 禁止用 `display:none`、`height:auto` transition 或超过 500ms 的动效制造跳变。
- 禁止把业务进度、成功提示或表单结果写成 Slider 内部 fake state。

## 11. 修改闭环

1. 同步审计 `slider/`、`preview/app.js`、`preview/styles.css`、metadata、API、H5 兼容说明、`_example`、`miniprogram_dist` 与发布入口。
2. 运行 Slider 专项合同、原生控件边界、`site:build`、`check`、`pack:check`，并验证 390px、两种主题、全部视觉开关和 180/1ms。
3. 产物变化后运行 `example:install` 并检查源码、dist、示例安装和 npm tarball 一致；微信 CLI 失败时保留 `pending-cli`。
4. H5 通过不能替代微信原生 Slider 的触摸、表单、颜色、blockSize、样式隔离与辅助技术真机验证。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。
