# DateTimePicker 组件语义合同

本文是 PoemUI DateTimePicker 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或日期列算法前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component date-time-picker`

Props、事件和方法完整清单以 `docs/COMPONENT_API.md` 为准。DateTimePicker 是 Picker 的日期时间领域适配器，不是两个平台原生输入框的布局壳。

## 1. 组件定位

- DateTimePicker 把日期时间范围转换为可确认的滚轮列，并复用 Picker 的 Popup、草稿和事件生命周期。
- Picker 负责通用数据列；DateTimePicker 负责年、月、日、时、分、秒的合法联动、范围、步长、周几标签、解析和格式化。
- Calendar + Popover 继续承担可视月历和日期范围选择；DateTimePicker 只负责单个日期时间值，不伪造 range。
- 简单依赖系统原生面板的 date/time 输入属于业务页面选择，不再作为本组件的公开语义。

## 2. 固定结构与 PUI 组合

```text
DateTimePicker
└─ PUI Picker
   ├─ usePopup=true → Picker 默认 Popup Header（Check 图标左 / Close 图标右）或 Classic Footer + wheel Content
   └─ usePopup=false → Inline wheel Surface
      └─ picker-view columns: year/month/date/hour/minute/second
```

- DateTimePicker 必须直接组合 PUI Picker，不得复制 Popup、Button、Loading、Empty 或 `picker-view` 结构。
- DateTimePicker 公开并仅透传 Picker 的 `type='default' | 'classic'`，不复制 Popup、Button 或 Header 结构。默认类型的标题进入 Popup Header，左侧为 primary Check 圆形图标确认、右侧为 default Close 圆形图标取消；`classic` 使用 Picker 的底部等宽取消 / 确定操作区。
- 日期列只是一份传给 Picker 的数据模型；组件自身不增加第二层 Surface、标题栏、错误卡或清空按钮。
- 允许 DateTimePicker 监听 Picker 的公开事件并转换 detail；不得穿透调用 Picker 私有字段。

## 3. 日期模型、模式与范围

- `mode` 遵循 TDesign 语义：`year/month/date` 逐级包含年月日，`hour/minute/second` 逐级包含时分秒；数组 `[dateMode, timeMode]` 合并两组列。
- 为旧版迁移保留 `time → minute`、`datetime → [date, minute]` 输入别名，但生成代码和文档优先使用标准模式。
- `value/defaultValue/start/end` 接受时间戳或可解析字符串；数字 `0` 是合法值，不能被 truthy 判断丢弃。非法值回退到范围内的确定值，不把 `Invalid Date` 暴露到 UI。
- 默认范围是当前时间前后十年；合法倒置范围自动交换。任何草稿都必须裁切到 start/end。
- 日列必须随年份、月份和范围动态重算，闰年、月末及跨边界选择不得产生不存在的日期。
- `steps` 只接受各列正整数步长；边界值必须保留，即使它不与步长起点整除。`showWeek` 只扩展日列 label，不改变 value。

## 4. 值、格式与严格边界

- `value !== null/undefined` 为受控；组件只发布请求并等待父级回写。非受控模式仅首次读取 `defaultValue`。
- Popup 打开后维护独立草稿；滚动只发布 `pick`，确认才发布 `confirm` 和可能的 `change`，取消恢复已提交值。
- `format` 只控制公开 value 的字符串格式，支持 `YYYY/MM/DD/HH/mm/ss` 常用 Token；时间戳输入仍按 format 输出，避免同一组件因输入类型改变 detail 形态。
- time-only 模式的公开值只含时间，date-only 只含日期；组合模式同时包含日期和时间。缺失的低阶单位使用当前已解析值，不随滚轮重绘漂移。

## 5. 受控显隐、事件与方法

- `visible !== null/undefined` 为受控显隐；`defaultVisible` 只初始化非受控 Popup。内联模式始终可见且 open/close 不生效。
- 事件顺序与 Picker 一致：确认固定 `confirm → change（值变化时）→ visible-change → close`；取消固定 `cancel → visible-change → close`；遮罩只发布显隐与 close。
- `pick` detail 必须返回格式化 value、时间戳、当前列类型与完整 parts，不能只透传数组索引。
- `open/close/confirm/cancel/reset/getValue` 是唯一公开方法；reset 恢复 defaultValue，受控模式等待父级回写。
- disabled/readonly 阻止打开、滚动、确认和 reset；readonly 仍允许关闭已打开 Popup。

## 6. Slot、状态与可访问性

- DateTimePicker 不公开 Slot。固定滚轮结构由 Picker 保证，业务说明和 Trigger 应由外部 Cell、Field、Button 组合。
- 本地日期列同步生成，不暴露 loading/error/empty/retry；这些属于远程数据 Picker，而不是日期算法状态。
- 根和 Popup 的辅助名称由 ariaLabel/title 回退；各列名称必须可理解为年、月、日、时、分、秒。
- `reduceMotion=true` 继续将 Picker 的 500ms 动效压缩为 1ms。

## 7. H5 预览与跨端一致性

- H5 必须复用与 Picker 相同的滚轮交互和草稿模型，真实支持点击、键盘、wheel 和 Pointer 拖动。
- 禁止使用 `<input type=date/time>` 冒充 Popup、confirm/cancel 或多列联动；基础 WXML 零 `bind:*`。
- 概览按“基础用法 / 日期与时间精度 / 范围与步长 / 内联与状态”分区；当前 Props 真实驱动主示例，其余示例只展示同一能力，不堆方法诊断卡。
- DateTimePicker 属于屏幕浮层组件，PreviewDevice 使用 `edge-to-edge`；隐藏时必须保留外部 PUI Button 真实 Trigger。

## 8. Token、主题与响应式

- DateTimePicker 自身不新增私有 Surface Token，全部视觉来自 Picker、Popup、Button、Icon、Loading、Empty 和全局视觉配置。
- 390px 下组合模式允许滚轮横向压缩，但列值必须完整可辨、Popup 不越出设备、页面无横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变由共享组件与 PreviewDevice 统一处理；不得给日期面板建立固定浅色。

## 9. TDesign Mini Program 1.15.3 对照决定

- 固定参考官方 DateTimePicker 文档和 npm 安装包 `date-time-picker/props.js`、类型、JS/WXML/WXSS。
- 2026-07-27 再次访问官方 DateTimePicker 页面与仓库，并解包 `tdesign-miniprogram@1.15.3` 核对 `miniprogram_dist/date-time-picker/date-time-picker.wxml`；确认它只组合 Picker，PoemUI 同样只从 Picker 继承 Popup 修复，不复制第二份面板。
- 借鉴 `mode/start/end/format/steps/showWeek` 的领域合同，以及基于 Picker 的 Popup、显隐受控和草稿确认。
- `cancelBtn/confirmBtn/header` 收敛为 Picker 同名语义的 `type/cancelText/confirmText/showHeader`；拒绝任意节点和 `popupProps` 穿透。
- 不公开函数型 `filter/formatter`：小程序 WXML 无法可靠序列化函数，常见步长与周几标签由 `steps/showWeek` 明确表达。
- PoemUI 额外保留 `defaultVisible/readonly/closeOnOverlayClick/ariaLabel/reduceMotion`，但不恢复旧版两输入框的 placeholder、bordered、compact、showIcon、clearable、loading、invalid、私有 duration/easing 和 default Slot。

## 10. 明确禁止

- 禁止恢复两个原生 `<picker mode=date/time>` 或 H5 date/time input 的分裂提交模型。
- 禁止滚动日期列立即提交 change，或让取消保留未确认草稿。
- 禁止把不存在的日期、越界值、无效步长或 truthy 误判写入状态。
- 禁止复制 Picker 的 Popup/Wheel/状态实现，禁止在基础 WXML 展示事件全集。
- 禁止把 DateTimePicker 宣称为范围日历或系统原生面板像素级镜像。

## 11. 修改闭环

1. 同步审计 `date-time-picker/`、Picker 依赖、metadata、H5、Props/WXML/API、示例、生成器、`miniprogram_dist` 和安装产物。
2. 专项测试覆盖模式、闰年/月末、范围、步长、格式、时间戳 0、受控值/显隐、事件顺序、方法和 Picker 组合。
3. 浏览器真实验证点击、键盘、wheel、拖动、confirm/cancel、受控回写、390px、主题、全部外观与 1ms。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5 兼容说明和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。
