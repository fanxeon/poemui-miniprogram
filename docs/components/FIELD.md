# Field 组件语义合同

本文是 PoemUI Field 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component field`

Props 与 Slots 的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

当前公开合同固定为 12 Props / 0 Events / 5 Slots / 0 Methods。任何增删都必须重新完成 TDesign 对照、专项测试和真实浏览器 battle。

## 1. 组件定位

- Field 是统一字段行的可编辑形态；Cell 是同一行内核的只读形态。Field 不拥有输入值、不执行提交；独立使用时展示显式 status/message，位于 Form 内时通过内部 relation 接收集中规则的真实校验结果。
- 默认 Slot 组合 Input、Select、Switch、Textarea 等真实 PUI 控件；Field 只管理标签、帮助、反馈、对齐与箭头。
- 外层 Form 按 name 注册 Field，并内部传递 required、showErrorMessage、reduceMotion 与校验消息；Field 仍不穿透 Slot 修改子控件值或状态 Props。

## 2. 固定结构

```text
Field(role=group, field-row editable)
└─ Wrap(Grid)
   ├─ Label Slot / label + required mark
   ├─ Controls
   │  ├─ default Slot
   │  ├─ Help Slot / help
   │  ├─ Message Slot / message
   │  └─ Extra Slot
   └─ PUI Icon(arrow, optional)
```

- Field 根通过内部 `field-row` 原语承担唯一行级 Surface；Cell 同样复用该原语但标记为只读态。两者共享背景、圆角、内距、主题、边框和低动效 Token，且始终无外投影；Form 根和内部纯布局节点仍透明。
- 默认 `labelAlign=left`，以固定标签列组织左标签、右控件；`top` 只用于多行或较长控件。默认 Slot 内 `pui-input` 在普通态退为透明，Field 不再形成“Cell 外壳 + 第二个输入框”的双层 Surface；透明只移除背景、边框、阴影和毛玻璃，Input 仍保留 `space-sm` 左右输入内距与 `radius-medium` 命中/焦点几何，不能把文字贴到 Field 边缘。focus、readonly 与输入自身状态边界仍由真实 Input 保留。
- `label/help/message="slot"` 是三个具名 Slot 的显式激活合同；extra 直接投影。

## 3. 布局与窄屏

- `labelAlign=left` 是默认的单行可编辑 Cell；`top` 使用纵向标签，`right` 使用右对齐固定标签列，`labelWidth` 按 80–360rpx 规整。
- `contentAlign` 只控制默认 Slot 的排列，不重写子控件宽度。
- 标签、帮助和反馈允许自然换行，禁止 text-cut、ellipsis、固定高度裁切。
- 390px 下横向标签、长帮助、错误反馈、箭头与 Input 必须保持 `min-width:0`，页面级无横向溢出。

## 4. 状态与真实边界

- `status` 只接受 `default/success/warning/error`，非法值回退 default。
- `status=error` 设置 Field 根 invalid 和 message alert 语义；其他状态使用 status 语义。
- 独立 required 只显示标记；位于 Form 内时，集中 rules 的 required 会通过内部关系合并为有效标记，真正约束仍由 Form 校验执行。
- Field 不公开 disabled/readonly/loading：Slot 容器无法可靠阻断未知子控件，暴露这些属性会形成假门禁。
- Field 没有 active、selected、empty、retry；这些状态不适用于字段布局容器，不得用静态占位伪造。

## 5. 事件、方法与父级回写

- Field 没有公开事件和实例方法。内部 relation 方法只服务 Form 注册与消息同步；change/focus/blur/clear/enter 属于真实子控件，validate/submit/reset 属于 Form。
- H5 的可编辑示例必须调用共享 `inputControlSample` 并真实更新 HTML input；不得只更新提示文字。
- 概览输入运行态在 Props 调整后继续保留；只有刷新/重置按站点统一合同清理。

## 6. 动效与可访问性

- help/message 的颜色和透明度过渡固定 500ms、standard easing；reduceMotion 与系统低动效压缩为 1ms。
- 官网 Props 更新会替换当前示例节点，H5 必须保存上一 `status` 并在新节点运行同源语义色 keyframe；只声明 transition 却直接落到最终色不算动效完成。
- 不公开 duration/easing，避免布局容器承载无业务意义的私有动效配置。
- 不使用 display:none 制造状态瞬移，不对 height:auto 做 transition。
- arrow 是装饰性 PUI Icon；`arrow=true` 不自动增加 click 语义。

## 7. H5 演示

- 概览固定按“基础用法 / 标签与对齐 / 必填与帮助 / 校验反馈”分区，分区标题之间使用18px语义间距。
- 基础 WXML 为 Field + Input 的最小组合，零 `bind:*`；事件只在业务需要的子控件示例中按需出现。
- Props 的 label/help/message/status/required/标记位置/对齐/宽度/arrow/reduceMotion 必须真实作用于首个当前配置示例。
- light/dark、border、frost、large-radius、gradient 作用于 Field 这一个行级 Surface；默认 Input 继续透明。`shadow=on` 不得给 Field 根或纯布局 wrap 添加外投影。
- Field 的 error/warning/success 以行级状态边界呈现；focus、readonly 与输入自身状态仍由真实子 Input 负责。

## 8. TDesign Mini Program 1.15.3 对照决定

- 固定参考 TDesign 1.15.3 FormItem 官方文档、npm 安装包 `form-item/props.js/type.d.ts/WXML/WXSS/JS/form-model.js`。
- 对齐 `arrow/contentAlign/help/label/labelAlign/labelWidth/name/requiredMark` 的用户可见主干。
- PoemUI 已建立真实 Form–Field relation，但仍不在 Field 重复公开 `rules/showErrorMessage`：规则和显示策略由父 Form 集中持有，避免两个事实源；内部 relation 只同步计算结果。
- PoemUI 用 `message/status` 承接独立消费者反馈，用内部 Form 消息承接集中校验结果；`requiredMarkPosition` 明确标记位置，并保留五类 Slot 与低动效。
- 2026-07-23 按 PoemUI 的移动设置页语义，Field 与 Cell 合并为同一内部 `field-row` 行内核：Field 是可编辑态、Cell 是只读态；不增加 API，默认 `labelAlign=left`，普通 Input 透明嵌入；这是一项有意的视觉取舍，不复制 TDesign 的默认 FormItem 外观。
- 删除旧版 `description/error/disabled/orientation`：help/message 消除重复反馈源，disabled 无法阻断 Slot 子控件，labelAlign 完整替代 orientation。

## 9. 明确禁止

- 禁止恢复只能降低外壳透明度、却不禁用子控件的 Field disabled。
- 禁止把内部 Form relation 误写成 Field 的公开 rules/validate，或用校验通过制造 fake success。
- 禁止 Field 出现第二层 Input Surface，或用手写 raw input 替代共享 Input helper。
- 禁止把所有子控件 bind 复制到基础用法；Field 自己没有事件。
- 禁止用箭头暗示可点击，却不给真实消费者入口与事件。

## 10. 修改闭环

1. 同步审计 `field/` 四件套、PUI Icon/Input 依赖、npm 入口、metadata、H5、Props/WXML/API、示例、`miniprogram_dist` 和安装产物。
2. 运行 `scripts/test-field.js`、Form/Field/Input 组合、语义/设计/API 可读性合同，以及 `site:build/check/pack:check`。
3. 浏览器真实验证输入、Props 全项、四个分区、五类 Slot、四类 status、500ms/1ms、390px、主题和全部外观。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5 兼容文档和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。

## 2026-07-27 独立页输入组合

Field 独立页默认内容必须继续使用真实 `pui-input`，并传递 `bordered=false` 作为透明嵌入变体；Field 行承担唯一 Surface，Input 仍拥有输入、焦点和值回写。实现见 `miniprogram/pages/components/field/index.wxml` 和 `PUI-FB-0430`。
