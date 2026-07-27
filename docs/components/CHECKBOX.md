# Checkbox / CheckboxGroup 组件语义合同

本文是 PoemUI Checkbox 与同包 CheckboxGroup 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据、Table 选择列或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component checkbox`

完整 API 清单以 `docs/COMPONENT_API.md` 为准；本文只记录长期语义、取舍和禁止事项。

本轮目标合同固定为：

- Checkbox：19 Props / 1 Event / 3 Slots / 0 Methods。
- CheckboxGroup：11 Props / 1 Event / 1 Slot / 0 Methods。

任何增删都必须重新完成 TDesign 对照、专项测试和真实浏览器 battle。

## 1. 组件定位

- Checkbox 表示一个可独立勾选的选项；`value` 是选项身份，不是 checked 的布尔别名。
- CheckboxGroup 负责多个 Checkbox 的数组值、最大选择数、全选/半选、父级 disabled/readonly/borderless 继承和唯一 change 请求。
- 单项状态只使用 `checked/defaultChecked`；组值只使用 `value/defaultValue`，禁止再次制造 value/checked 双受控优先级。
- 外部必填、错误、帮助和提交反馈由 Field/Form 负责，不进入 Checkbox 本体。

## 2. 固定结构

```text
Checkbox(role=checkbox)
├─ Mark
│  └─ PUI Icon
└─ Body
   ├─ default / label Slot
   └─ content Slot

CheckboxGroup
├─ default Slot（手动 Checkbox）
└─ options → Checkbox
```

- Checkbox 根是唯一点击与 checkbox 语义节点；mark/content 只作为同一根内的来源区，不建立第二个按钮。
- Icon 固定复用 PUI Icon；不使用字符勾号、私有图片节点或 Loading。
- CheckboxGroup 与子 Checkbox 必须通过真实 relation 协作，不能由 H5 假数组或文案冒充。

## 3. 值与全选合同

- 单项 `checked !== null/undefined` 为受控；受控交互只发 change，父级回写前视觉不提前变化。
- `defaultChecked` 只初始化非受控单项；后续修改不覆盖用户操作，controlled → uncontrolled 保留最后渲染值。
- `value` 接受 string/number/boolean，`0`、`false` 与空字符串都是合法且互不混淆的选项身份。
- Group `value !== null/undefined` 为受控数组；按“类型 + 值”严格去重，非法对象、数组、非有限数忽略。
- `max` 只限制新选择，不移除已有受控值；达到上限的请求静默拒绝，不伪造 change。
- `checkAll` 只在 Group 中生效：全选项根据可用子项计算 checked/indeterminate；点击半选请求补齐全部可用项，点击全选请求取消可用项，disabled 已选项保持。

## 4. 内容、图标与状态

- `label/content` 是主文案与说明；default/label/content Slot 都是真实消费者内容，不使用 custom* Boolean 开关。
- 小程序 WXML 必须把 `label/content` Prop 文本与对应具名 Slot 写成并列节点；微信具名 Slot 不支持 HTML 式 fallback children，禁止把 Prop 文本嵌入 `<slot>` 内导致 options 生成项只剩 Mark、正文为空。
- `icon` 支持 `circle/line/rectangle/none` 或 `[选中, 未选, 半选]` 三态 PUI Icon 名称/资源；非法值回退 circle。
- Mark 的未选轮廓使用不受全局 Surface 边框开关影响的 `--pui-control-outline-color`；`bordered=false` 可以移除容器中性边界，但不能让可选命中区消失。
- `block` 默认 true；`borderless` 默认 false，和 Group 继承方向一致，不再同时公开反向 bordered。
- `placement` 只支持 left/right；maxLabelRow/maxContentRow 使用合法正整数并允许消费者明确裁行。
- disabled 完全阻断；readonly 也静默阻断，不发布 blocked click；contentDisabled 只让正文区不触发，mark 仍可写。
- CheckboxGroup 的 disabled/readonly/borderless 作为默认值传给子项，子项显式值优先。

## 5. 事件与动效

- Checkbox 只公开 `change`，detail 固定包含 checked、previousChecked、value、label、indeterminate、checkAll、source、controlled。
- CheckboxGroup 只公开 `change`，detail 固定包含 value、previousValue、changedValue、checked、source、controlled、checkAll。
- 不公开 click/input 或 toggle/check/uncheck/reset 方法；声明式父级写回是唯一状态入口。
- mark、Icon、颜色和边界固定500ms standard easing；reduceMotion 与 H5 prefers-reduced-motion 固定1ms。
- 不公开 duration/easing，不使用 display:none、height:auto transition 或超过500ms的动画。

## 6. H5 与演示

- 概览固定按“纵向与横向 / 全选与半选 / 状态 / 图标与布局”四区，主要分区使用18px section gap。
- 基础 WXML优先展示真实 CheckboxGroup + options，零 bind；单项与事件只在专项示例/API按需展示。
- H5 使用真实 input[type=checkbox] 并设置 DOM indeterminate；Group 数组与全选必须真实回写，而不是统计提示文字。
- Table 等复合组件继续调用共享 checkboxSample；helper 只镜像单项 PUI Checkbox，不复制 Group 状态机。
- 390px 下长文案、横向组合、全选、API和外观菜单不得产生页面级横向溢出。

## 7. TDesign Mini Program 1.15.3 对照决定

- 固定参考官方 Checkbox/CheckboxGroup 文档、2026-07-10 页面版本和1.15.3安装源码。
- 对齐单项 checked/defaultChecked/value、label/content/icon、indeterminate/checkAll、block/borderless/contentDisabled、disabled/readonly/name/placement/max rows、三类 Slot和唯一change。
- 新增真实 CheckboxGroup，对齐 options/keys/max/value/defaultValue/name/borderless/disabled/readonly、default Slot和唯一change。
- 保留 PoemUI ariaLabel/reduceMotion，作为已有辅助语义和全局低动效合同。
- 删除旧 value 布尔别名、defaultIndeterminate、size/loading/invalid/required/customIcon/customContent、bordered、duration/easing、click/input和实例方法。

## 8. 明确禁止

- 禁止把 Checkbox `value` 再解释为布尔 checked；Group 中 `false/0/空字符串` 必须保留原始身份。
- 禁止用三个独立 Checkbox 加统计文案冒充 CheckboxGroup。
- 禁止恢复 click/input/change 三连事件、blocked click、布尔 Slot 开关或实例调试方法。
- 禁止给 Checkbox 增加业务 loading/invalid/required；这些由提交控件、Field/Form或父状态容器表达。
- 禁止 H5 只改 aria/提示而不更新真实 input.checked、indeterminate、Group value和父级 Props。

## 9. 修改闭环

1. 同步审计 Checkbox/Group 四件套、PUI Icon、relation、npm入口、metadata、H5、Props/WXML/API、示例、dist和安装产物。
2. 运行 `scripts/test-checkbox.js`、语义/设计/组合/API可读性合同，以及 `site:build/check/pack:check`。
3. 浏览器真实验证单项/组、0/false/空字符串、受控/非受控、max、全选半选、锁定、Slot、180/1ms、390px、主题和全部外观。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5兼容文档和真机风险。

任何不能满足本文的实现必须进入 Ledger，不得静默绕过。

## 2026-07-27 标记图标对齐

unchecked、checked、indeterminate 三态均使用 `pui-icon`；Checkbox 标记容器负责 28rpx 图标的 flex 居中和零行高，禁止字符替代。实现见 `checkbox/checkbox.wxml`、`checkbox/checkbox.wxss`、`PUI-FB-0431`。
