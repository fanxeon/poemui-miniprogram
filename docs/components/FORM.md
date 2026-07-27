# Form 组件语义合同

本文是 PoemUI Form 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或校验规则前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component form`

Props、事件、Slot 与方法完整清单以 `docs/COMPONENT_API.md` 为准。当前公开合同固定为 7 Props / 3 Events / 1 Slot / 5 Methods。

## 1. 组件定位

- Form 是受控数据的可组合父容器，负责 Field 注册、规则校验、提交顺序、重置请求和服务端消息回填。
- Form 不生成固定字段、输入框或操作按钮。消费者在默认 Slot 中组合 Field、Input、Select、Switch、RadioGroup 与 Button。
- `data` 始终由父级持有。输入组件先发布 change，父级回写 `data`；Form 不维护第二份字段状态，也不把校验通过冒充业务提交成功。

## 2. 固定结构与关系

```text
Form(native form, transparent)
└─ default Slot
   ├─ Field(name) ↔ Form child relation
   │  └─ PUI input control
   └─ PUI Button(formType=submit/reset)
```

- 原生根必须是微信 `<form>`，真实承接 `bindsubmit` 与 `bindreset`。
- Form 与 Field 建立真实 relation；Form 按 Field `name` 注册，向 Field 传递必填标记、错误显示开关、低动效和校验消息。
- Form 根只负责布局与语义 gap，必须透明、无 border/radius/shadow/frost/panel padding。可见 Surface 属于 Slot 内真实控件。
- Field 的独立公开合同仍为 12 Props / 0 Events / 5 Slots / 0 Methods；关系方法属于内部协议，不扩大 Field 公共 API。

## 3. 数据、规则与边界

- `data` 和 `rules` 非对象时按空对象处理；校验快照保留 `0`、`false` 和空字符串，不用 truthy 判断丢失受控边界。
- 每条规则只表达一个约束，支持 required、whitespace、min、max、len、pattern、enum、number、boolean、email、url、telnumber、idcard 与同步/异步 validator。
- 非 required 规则遇到空值时跳过；warning 保留在结果和 Field 反馈中，但不把 `valid` 改为 false。
- `trigger` 支持 all/change/blur/submit；非法值回退 all。未注册 Field 但存在 rules 的字段仍参与校验，避免静默漏检。
- validator 可以返回 true/false、错误字符串、`{ valid, message, type }` 或 Promise；拒绝与抛错必须形成真实错误消息。

## 4. 事件与父级回写

- `validate()` 完成后触发 validate；`submit()` 固定按 `validate → submit` 发布，无论通过与否都返回真实快照。
- submit 只报告是否可提交，不调用业务接口、不显示 fake success。消费者应在 `detail.valid` 为 true 后执行真实请求。
- reset 根据 initial/empty 生成下一份 data 并触发 reset；Form 不修改当前 `data` Prop。父级拒绝回写时视图保持不变。
- `clearValidate` 只清消息，`setValidateMessage` 只写服务端/业务反馈；两者都不改变字段数据。
- initial 是组件 attached 时的浅层安全快照；对象和数组字段复制一层，避免重置结果与当前容器共享顶层引用。

## 5. 状态与可访问性

- Form 自身没有 disabled、readonly、loading、empty、error 或 retry：这些能力属于具体输入控件、业务请求容器、Loading 与 Empty 的组合。
- required 来自规则并显示在关联 Field；`showErrorMessage=false` 隐藏文字但保留 error/warning 状态和校验结果。
- `scrollToFirstError=auto/smooth` 只在校验失败时定位第一个已注册 Field；低动效把 smooth 降为无动画。
- 根提供 role=form 和 ariaLabel；错误 Field 使用 invalid/alert，warning 使用 status。

## 6. 动效与布局

- Form/Field 反馈使用固定 500ms、standard easing；reduceMotion 与系统低动效压缩为 1ms。
- 禁止 `display:none` 制造状态瞬移，禁止对 `height:auto` 做 transition。
- 分区使用 `--pui-section-gap`，字段和操作内部使用标准内容 gap；390px 下字段、错误文字和双按钮允许自然收缩与换行，页面级横向溢出必须为 0。

## 7. H5 演示

- 概览固定分为“基础用法 / 校验与反馈 / 组合字段”。基础区使用真实 HTML form，并调用共享 Field、Input、Switch、Radio 与 Button 镜像。
- 当前 Input、Switch、Radio 的变化必须回写同一个 Props `data`，属性面板与预览同步；submit/reset 监听真实 DOM 事件。
- 基础 WXML 只展示 Form + Field + Input + Button 的最小结构，不绑定事件。完整 validate/submit/reset 只进入 API Events，业务示例按需绑定。
- 校验结果可说明“业务请求尚未执行”，不得宣告发布成功；light/dark 与 border/shadow/frost/large-radius/gradient 不得给 Form 根增加第二层 Surface。

## 8. TDesign Mini Program 1.15.3 对照决定

- 固定参考 TDesign 1.15.3 Form 的官方文档与 npm 安装包 `form/props.js`、`form/form.js`、`form/form-model.js`、WXML/WXSS 和类型定义。
- 对齐受控 data、rules、错误显示、首错滚动、重置策略、FormItem relation、validate/submit/reset/clearValidate/setValidateMessage 主干。
- 不照搬 colon、labelAlign、labelWidth、requiredMark/position、contentAlign：这些是 Field 的布局职责，放进 Form 会制造两个视觉事实源。
- 不照搬 `errorMessage` 受控对象和 `submitWithWarningMessage`：PoemUI 用 `setValidateMessage` 接收服务端消息，warning 始终不冒充 error，也不阻断真实结果报告。
- PoemUI 额外保留 ariaLabel 与 reduceMotion；重置始终以受控事件请求父级回写。

## 9. 明确禁止

- 禁止恢复 `items/value/defaultValue/disabled/showActions/submitText/resetText` 的固定表单生成器。
- 禁止在 Form WXML 内固定组合 Input 或 Button；示例可以组合，组件本体不拥有消费者字段与动作。
- 禁止 submit 通过后自动写成功文案、自动请求或修改 data。
- 禁止把所有 `bind:*` 塞进基础用法；事件全集只进入 API。
- 禁止在 H5 手写页面私有 input/switch/radio/button 皮肤，必须复用共享 PUI helper。

## 10. 修改闭环

1. 同步审计 `form/`、Field relation、metadata、H5、Props/WXML/API、示例、`miniprogram_dist` 和安装产物。
2. 运行 `scripts/test-form.js`、Field/Input 组合、原生控件边界、语义/设计/API 可读性合同，以及 `site:build/check/pack:check`。
3. 浏览器真实验证输入回写、校验失败/警告/通过、原生 submit/reset、showErrorMessage、首错定位、initial/empty、0/false/空字符串、390px、主题和全部外观。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5 兼容文档和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。
