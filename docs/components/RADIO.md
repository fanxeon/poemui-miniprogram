# Radio / RadioGroup 组件语义合同

本文是 PoemUI Radio 与同包 RadioGroup 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据、Form 组合或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component radio`

完整 API 清单以 `docs/COMPONENT_API.md` 为准；本文只记录长期语义、取舍和禁止事项。

本轮目标合同固定为：

- Radio：18 Props / 1 Event / 4 Slots / 0 Methods。
- RadioGroup：13 Props / 1 Event / 1 Slot / 0 Methods。

任何增删都必须重新完成 TDesign 对照、专项测试和真实浏览器 battle。

## 1. 组件定位

- Radio 表示一个单选项；`value` 是选项身份，`checked/defaultChecked` 是独立单项状态。
- RadioGroup 负责一组 Radio 的唯一标量值、options/keys、allowUncheck、父级状态继承和唯一 change 请求。
- 加载、空、错误、必填和校验属于业务容器或 Field/Form，不进入 Radio/RadioGroup 本体。
- 单项和组分别发布；禁止用一个 options 开关让 Radio 在运行时改变组件身份。

## 2. 固定结构

```text
Radio(role=radio)
├─ Mark
│  └─ PUI Icon / Dot / icon Slot
└─ Body
   ├─ default / label Slot
   └─ content Slot

RadioGroup(role=radiogroup)
├─ default Slot（手动 Radio）
└─ options → Radio
```

- Radio 的 mark/content 是同一单选项的两个来源区，不建立 click/input/select 等第二事件真相源。
- Group 与子 Radio 必须通过真实 relation 协作；H5 与示例不得手工拼选中 class 冒充发布组件。
- Icon 固定复用 PUI Icon 或 CSS Dot；禁止字符圆点、私有 Loading、Badge 和错误面板进入本体。

## 3. 值与受控合同

- 单项 `checked !== null/undefined` 为受控；受控交互只发 change，父级回写前视觉不提前变化。
- `defaultChecked` 只初始化非受控单项；controlled → uncontrolled 保留最后渲染状态，不重读默认值。
- `value` 接受 string/number/boolean，`0`、`false`、空字符串与字符串 `'0'` 都是合法且互不混淆的身份。
- Group `value !== null/undefined` 为受控；`defaultValue` 只初始化，退控保留最后渲染值。
- 当前项再次点击只有 `allowUncheck=true` 才请求 `null`；否则静默保持，不伪造 change。
- options 与 Slot 子项共用同一状态机，重复原始值按“类型 + 值”保留首项，非法对象与非有限数忽略。

## 4. 内容、图标与状态

- `label/content` 是主文案与说明；default/label/content/icon Slot 都是真实消费者内容，不使用 custom* Boolean 开关。
- 小程序 WXML 必须把 `label/content` Prop 文本与对应具名 Slot 写成并列节点；微信具名 Slot 不支持 HTML 式 fallback children，禁止把 Prop 文本嵌入 `<slot>` 内导致 options 生成项只剩 Mark、正文为空。
- `icon` 支持 `circle/line/dot/slot/none` 或 `[选中, 未选]` 两个 PUI Icon 名称；非法值回退 circle。
- Mark 的未选轮廓使用不受全局 Surface 边框开关影响的 `--pui-control-outline-color`；`bordered=false` 可以移除容器中性边界，但不能让单选命中区消失。
- `block` 默认 true；`borderless` 默认 false，并可从 Group 继承；不再同时公开反向 bordered。
- `placement` 只支持 left/right；maxLabelRow/maxContentRow 使用合法正整数。
- disabled 与 readonly 静默阻断；contentDisabled 只锁正文，mark 仍可选。
- Group 的 disabled/readonly/borderless/icon/placement/allowUncheck 是子项默认值，子项显式状态优先。

## 5. 事件与动效

- Radio 只公开 `change`，detail 固定包含 checked、previousChecked、value、label、source、controlled。
- RadioGroup 只公开 `change`，detail 固定包含 value、previousValue、option、index、source、controlled。
- 不公开 click/item-click/input/select/unselect/retry，也不公开 select/clear/reset/getValue/check/uncheck/toggle/retry 方法。
- mark、Icon、圆点、颜色和边界固定500ms standard easing；reduceMotion 与 H5 系统低动效固定1ms。
- 不公开 duration/easing，不使用 display:none、height:auto transition 或超过500ms的动画。

## 6. H5 与演示

- 概览固定按“基础用法 / 原始值 / 组件状态 / 图标与内容”四区，主要分区使用18px section gap。
- 基础 WXML 展示真实 RadioGroup + options，零 bind；事件只进入 API Events 或事件专项示例。
- H5 使用真实 input[type=radio]；同组 name、checked、disabled、父级值和 change 必须真实回写。
- 390px 下横向选项安全换行，长文案、API 和全部外观不得产生页面级横向溢出。

## 7. TDesign Mini Program 1.15.3 对照决定

- 固定参考官方 Radio/RadioGroup 文档、2026-07-10 页面版本和1.15.3安装源码。
- 对齐 Radio checked/defaultChecked/value、label/content/icon、allowUncheck、block/contentDisabled、disabled/readonly/name/placement/max rows、四类 Slot和唯一change。
- 新增真实 RadioGroup，对齐 options/keys/value/defaultValue/name/allowUncheck/icon/placement/borderless/disabled/readonly、default Slot和唯一change。
- 保留 PoemUI ariaLabel/reduceMotion；Radio 公开 borderless 以支持父子覆盖。
- 删除旧 options 双模式、description/direction/align/size/variant/bordered/loading/invalid/required/error/custom*、私有动效、七类重复事件和八个实例方法。

## 8. 明确禁止

- 禁止把 Radio `value` 再解释为 Boolean checked；Group 中 `false/0/空字符串` 必须保留原始身份。
- 禁止把 options、loading/error/empty、Badge、方法面板重新塞回 Radio 单项。
- 禁止恢复 click/input/select/unselect 等重复事件、blocked click、布尔 Slot 开关或实例调试方法。
- 禁止 H5 只更新提示文字而不更新真实 input.checked、Group value和父级 Props。

## 9. 修改闭环

1. 同步审计 Radio/Group 四件套、PUI Icon、relation、npm入口、metadata、H5、Props/WXML/API、示例、dist和安装产物。
2. 运行 `scripts/test-radio.js`、语义/设计/组合/API可读性合同，以及 `site:build/check/pack:check`。
3. 浏览器真实验证单项/组、0/false/空字符串、受控/非受控、allowUncheck、锁定、Slot、180/1ms、390px、主题和全部外观。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5兼容文档和真机风险。

任何不能满足本文的实现必须进入 Ledger，不得静默绕过。
