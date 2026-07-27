# Input 组件语义合同

本文是 PoemUI Input 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component input`

Props、Events、Slots 与 Methods 的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

当前公开合同固定为 30 Props / 5 Events / 7 Slots / 4 Methods；任何增删都必须重新完成 TDesign 对照、专项测试和真实浏览器 battle。

## 1. 组件定位

- Input 承接少量单行文字、数字、身份信息、密码或昵称输入；多行内容使用 Textarea，带完整字段说明与校验编排时由 Form/Field 组合。
- 组件只管理真实输入值、输入状态、标签/Icon/后缀/提示组合和微信键盘桥接，不承担业务校验请求或成功状态。
- H5 是原生 WXML/WXSS 能力的浏览器镜像，不得只更新事件提示文字而不改变真实 input、父级 Props 或焦点。

## 2. 固定结构

```text
Input(role=group)
├─ Label Slot / label + required
├─ Field Surface
│  ├─ prefix-icon Slot / PUI Icon
│  ├─ prefix Slot / text
│  ├─ native input
│  └─ Trailing
│     ├─ PUI Button(clear)
│     ├─ PUI Loading
│     ├─ suffix Slot / text / PUI action
│     └─ suffix-icon Slot / PUI Icon
├─ tips Slot / tips
└─ extra Slot
```

- Input 只能拥有一个可见 Field Surface；父级 Form、Field、Search 等不得再叠第二层边框、阴影或毛玻璃。
- 原生 `<input>` 的文本色与光标色必须直接消费 `--pui-text-primary`，placeholder 通过独立 `placeholder-class` 消费 `--pui-text-placeholder`。不能依赖 `color: inherit` 穿过小程序自定义组件和原生控件边界；颜色静态存在也不能替代实际输入像素验收。
- Clear 固定复用 PUI Button + PUI Icon，Loading 固定复用 PUI Loading；禁止 raw button、字符图标或私有 Spinner。
- 原生 input 必须作为可收缩的主轴剩余区；Clear、Loading、suffix 与 suffix-icon 进入同一个不越界的 Trailing 轨，Trailing 以 `margin-left:auto` 贴齐 Field 最右侧。Clear 与 suffix 操作同时存在时仍按该顺序并排，不得因前缀、文字长度或消费者按钮挤出 Field。
- `label/prefix/prefixIcon/suffix/suffixIcon/tips="slot"` 是具名 Slot 的显式激活合同；extra Slot 直接投影，不增加开关 Prop。
- `suffix="slot"` 同时是 Input 的可选右侧操作 API。消费者可以放入一个紧凑 PUI IconButton，例如保存、验证或复制；Input 不代理该按钮事件、不推断业务成功，也不新增与 suffix 重叠的 `right/action/showAction` Prop。

## 3. 值与长度

- `value !== null/undefined` 为受控；`0`、`false` 与空字符串都是合法受控值，并统一规整为显示字符串。
- 受控输入、清空只发布请求，父级回写前保持当前值；controlled → uncontrolled 时继续最后一次受控渲染值，不重新读取 defaultValue。
- `defaultValue` 只在首次进入非受控状态时初始化，后续修改不得覆盖用户输入。
- `maxcharacter >= 0` 时优先于 `maxlength`。ASCII 按1计数，中文、其他非 ASCII 和 emoji 按2计数；两种限制都不得截断半个代理对。

## 4. 状态、外观与门禁

- `status` 只接受 `default/success/warning/error`；error 设置危险边界和 `aria-invalid`，但不擅改值。
- disabled、readonly、loading 都阻断输入、清空、键盘确认和 `focus()`；loading 同时渲染内部 Loading，消费者负责真实异步结果。
- size 固定 `small/medium/large`，align 固定 `left/center/right`；bordered 关闭时只透明化中性边界并保留盒模型及状态边界。
- Field 圆角通过内部语义变量 `--pui-input-field-radius` 读取默认 `--pui-radius-medium`。Search 等复合组件只能通过该变量传递已定义的语义 Token，不能用跨组件选择器直接重写 Field 的高度、padding、背景、边框或圆角。
- Input Field 是 Search/Combobox 的唯一可见字段 Surface：它可以消费 `shadow-card`、`frostedGlass`、`largeRadius` 和 `bordered`；Search/Combobox 外壳不得再叠加第二层阴影、背景、边框或毛玻璃。Stepper 的嵌入式 Input 保持透明，由 Stepper 外壳承担 Surface。
- password 不是独立布尔 Prop，而是 `type="password"`；避免两套来源冲突。

## 5. 事件与方法

- 真实输入只发布 `change`，不再同时发布重复 `input/change`。
- 清空顺序固定为 `clear → change`，两事件共享同一 detail；空值、锁定状态不发布伪事件。
- 微信确认键只发布 `enter`，不与 Form submit 混用；focus/blur 只来自原生输入焦点链。
- 原生 `bindfocus` 后，`focused` 必须参与下一次 `focus` 绑定计算并保持为 `true`；只在真实 `bindblur`、显式 `blur()` 或锁定状态时释放，禁止同步状态时立即回写 `focus=false` 导致键盘收起。
- 方法只保留 `focus()/blur()/clear()/getValue()`；不公开 setValue/reset，声明式值更新统一由父级 Props 完成。

## 6. 动效与可访问性

- 边界、背景、阴影和透明度过渡固定 500ms、standard easing；reduceMotion 与 `prefers-reduced-motion` 压缩为1ms。
- 不公开 duration/easing，避免基础输入为视觉细节承载私有配置。
- 根提供 group、label、busy、disabled、invalid；原生 input 提供 required 与 label。关键标签、提示不得用省略号裁切。

## 7. H5 演示

- 概览固定按“基础用法 / 状态与提示 / 图标与清空 / 尺寸与类型”分区，分区标题之间保留清晰的18px上间距。
- 基础 WXML 只输出非默认 Props，默认页面为 `<pui-input placeholder="请输入内容" />`，零 bind、零方法诊断卡、零工程状态面板。
- Props 调整必须真实作用于当前 HTML input；受控模式由站点父级回写，非受控模式保留独立 runtime，退控继续最后一次受控值。
- 390px 下标签、提示、Icon、清空 Button、Loading、Slot 和计数均可换行或收缩，不产生页面级横向溢出。
- H5 的 `inputControlSample` 与标准 Input 概览都必须输出同名 Trailing 轨，并至少覆盖一次 Clear 与 suffix IconButton 同时存在的真实组合。
- H5 原生 input 同样直接消费 `--text`；两端都必须以实际输入值的计算色验证深浅色，不得只检查 placeholder。

## 8. TDesign Mini Program 1.15.3 对照决定

- 固定参考 TDesign Mini Program 1.15.3 Input 的 props、type、WXML、JS 和官方分区演示。
- 2026-07-27 复核官方文档与固定安装包 `tdesign-miniprogram@1.15.3`：TDesign 同样在 Clear 之后投影 suffix Slot，官方示例用其承载“发送验证码”。PoemUI 因此复用既有 suffix API，不增加重复 right/action Prop，只用共享 Trailing 轨收敛多尾部操作几何。
- 对齐 `value/defaultValue/name/label/placeholder/type/maxlength/maxcharacter/size/align/bordered/clearable/prefix/prefixIcon/suffix/suffixIcon/disabled/readonly/focus/confirmType/status/tips` 主干，以及 `change/clear/focus/blur/enter` 事件语义。
- 保留 PoemUI 的 required、常用微信键盘参数、ARIA、loading、reduceMotion 与 extra Slot，因为这些已有真实组合与门禁闭环。
- 不照搬全部平台长尾参数，不以 Props 数量接近为目标；不恢复重复 password/error/invalid、自定义 Slot 开关、私有 duration/easing 或重复 input 事件。

## 9. 明确禁止

- 禁止恢复 password、error、invalid、errorMessage、customLabel/customPrefix/customSuffix/customExtra、duration、easing、setValue。
- 禁止把 Enter 写成 confirm 事件，或把输入同时冒充 input 与 change 两次业务请求。
- 禁止 H5 只更新提示文案、绕过父级回写、使用 raw clear button，或用 HTML maxlength 掩盖事件层边界。
- 禁止 Form/Field/Search 等复合组件穿透覆盖 Input 的几何与 Surface。

## 10. 修改闭环

1. 同步审计 `input/` 四件套、内部 PUI 依赖、npm 入口、metadata、H5、Props/WXML/API、示例、`miniprogram_dist` 和安装产物。
2. 运行 `scripts/test-input.js`、语义/设计/组合/API 可读性合同，以及 `site:build/check/pack:check`。
3. 浏览器真实验证受控/非受控、0/false/空字符串、maxlength/maxcharacter、清空顺序、焦点/Enter、disabled/readonly/loading、四类 status、Slots、500ms/1ms、390px、主题和全部外观。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5 兼容文档和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。
