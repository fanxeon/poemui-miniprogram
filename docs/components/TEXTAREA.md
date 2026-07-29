# Textarea 组件语义合同

本文是 PoemUI Textarea 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component textarea`

Props、Events、Slots 与 Methods 的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

当前公开合同固定为 29 Props / 6 Events / 3 Slots / 3 Methods；任何增删都必须重新完成 TDesign 对照、专项测试和真实浏览器 battle。

## 1. 组件定位

- Textarea 承接多行文本输入；单行内容使用 Input，完整字段说明与校验编排由 Form/Field 组合。
- 组件只管理真实输入值、字符上限、自动增高、状态提示和微信键盘桥接，不承担业务校验请求或提交成功。
- H5 是原生 WXML/WXSS 能力的浏览器镜像，不得只更新事件文字而不改变真实 textarea 与父级 Props。

## 2. 固定结构

```text
Textarea(role=group)
├─ Label Slot / label + required
├─ Field Surface
│  ├─ native textarea
│  └─ PUI Loading
├─ Tips Slot / tips + PUI Icon
├─ indicator
└─ Extra Slot
```

- Textarea 只能拥有一个可见 Field Surface；父级 Field/Form 不得再叠第二层边框、阴影或毛玻璃。
- Textarea 不提供内置 Clear；需要清空时由父级把受控 `value` 写回空字符串。Loading 固定复用 PUI Loading；禁止 raw button、字符图标或私有 Spinner。
- `label/tips="slot"` 是具名 Slot 的显式激活合同；extra Slot 直接投影，不增加布尔开关。

## 3. 值与字符上限

- `value !== null/undefined` 为受控；`0`、`false` 与空字符串都是合法受控值，并统一规整为显示字符串。
- 受控输入只发布请求，父级回写前保持提交值；但原生 `input` 回调不得返回旧值强制覆盖草稿，也不得把父级回写的同值 echo 再绑定给原生 textarea。组件以 `innerValue` 保存逻辑值、以 `renderValue` 隔离原生绑定：正常输入只更新逻辑值与计数，匹配当前原生草稿的父级 echo 不产生第二次组件 `setData`；只有真正不同的外部 value 才重写原生绑定。字符规整实际截断输入时仍返回规整值。controlled → uncontrolled 时继续最后一次受控渲染值，不重新读取 defaultValue。
- `defaultValue` 只在首次进入非受控状态时初始化，后续修改不得覆盖用户输入。
- `maxcharacter >= 0` 时优先于 `maxlength`。ASCII 按1计数，中文、其他非 ASCII 和 emoji 按2计数；两种限制都不得截断半个代理对。
- `indicator` 读取与 change 事件同源的 count/limit/countMode，不维护第二套计数。

## 4. 自动增高、状态与门禁

- `autosize=false` 固定默认4行；`true` 使用默认4–8行边界；`{ minRows, maxRows }` 显式接管行数，不再公开重复的 autoHeight/minRows/maxRows。
- `status` 只接受 `default/success/warning/error`；`error` 设置危险边界和 `aria-invalid`，但不擅改当前值。
- disabled、readonly、loading 都阻断输入、键盘确认和 `focus()`；loading 同时渲染内部 Loading，消费者负责真实异步结果。
- readonly 因微信原生 textarea 没有 readonly 属性而使用 native disabled 阻断编辑；根语义仍分开 `aria-readonly` 与 disabled/loading。
- size 固定 `small/medium/large`；bordered 关闭时只透明化中性边界并保留盒模型及状态边界。

## 5. 事件与方法

- 真实输入只发布 `change`，不再同时发布重复 `input/change`。
- 微信确认键只发布 `enter`；行高变化与 TDesign 共有语义对齐为 `line-change`；keyboardheightchange 只转发真实平台事件。
- 原生 `bindfocus` 后，`focused` 必须参与下一次 `focus` 绑定计算并保持为 `true`；只在真实 `bindblur`、显式 `blur()` 或锁定状态时释放，禁止同步状态时立即回写 `focus=false` 导致键盘收起。
- 方法只保留 `focus()/blur()/getValue()`；不公开 clear/setValue/reset/getState，声明式值更新与清空统一由父级 Props 完成。

## 6. 动效与可访问性

- 边界、背景、阴影、透明度和反馈区过渡固定 500ms、standard easing；reduceMotion 与 `prefers-reduced-motion` 压缩为1ms。
- 不公开 duration/easing，避免基础输入为视觉细节承载私有配置。
- 反馈区使用常驻 grid rows/opacity/transform 过渡，不使用 display:none，不对 height:auto 做无效 transition。
- 根提供 group、label、busy、disabled/read-only、invalid；原生 textarea 提供 required 与 label。

## 7. H5 演示

- 概览固定按“基础用法 / 字符计数 / 自动增高 / 状态与交互”分区，分区标题之间保留18px上间距。
- 基础 WXML 只输出非默认 Props，默认页面为 `<pui-textarea placeholder="请输入内容" />`，零 bind、零方法诊断卡、零工程状态面板。
- Props 调整必须真实作用于当前 HTML textarea；受控模式由站点父级回写，非受控模式保留独立 runtime，退控继续最后一次受控值。
- H5 可用 Cmd/Ctrl + Enter 测试 enter 桥接，但不得伪造微信确认栏、键盘高度或原生行高事件。
- H5 的静态自动增高示例也必须接入真实 input；它只局部更新 textarea 的 rows 与高度 Token，不重建 PreviewDevice 或整段演示 DOM。受控 echo 仅在 `control.value !== snapshot.value` 时写回 HTML textarea，与小程序“同值不重绑”语义一致。
- 390px 下标签、提示、计数、Loading 和 Slot 均可换行或收缩，不产生页面级横向溢出。

## 8. TDesign Mini Program 1.15.3 对照决定

- 固定参考 [TDesign Mini Program Textarea 官方页](https://tdesign.tencent.com/miniprogram/components/textarea)、[官方仓库](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/textarea) 与 `tdesign-miniprogram@1.15.3` 安装包中的 `miniprogram_dist/textarea/{props.js,type.d.ts,textarea.js,textarea.wxml,textarea.wxss}`；2026-07-28 回归时重新联网及解包核对。
- 对齐 `value/defaultValue/label/placeholder/maxlength/maxcharacter/autosize/indicator/bordered/disabled/readonly/focus/confirmType/showConfirmBar/cursorSpacing/selectionStart/selectionEnd/adjustPosition/holdKeyboard/confirmHold/disableDefaultPadding` 主干，以及 change/focus/blur/enter/line-change/keyboardheightchange 事件语义。
- 保留 PoemUI 的 name/size/status/tips/required/loading/ARIA/reduceMotion 与 extra Slot，因为它们已有真实组合、门禁和主题闭环；TDesign 1.15.3 同样没有 Textarea Clear，PoemUI 在 0.1.2 删除 clearable/clear/clear()，避免输入后动态插入操作轨改变文本宽度并触发 autosize 重测。
- 不照搬 `allowInputOverMax/autofocus/cursor/cursorColor/fixed/placeholderClass/placeholderStyle`等平台长尾参数；它们不属于 PoemUI 当前常用路径，不以 Props 数量接近为目标。
- 删除旧版 autoHeight/minRows/maxRows/showCount/clearIcon/customLabel/customExtra/customFooter/loadingText/error/invalid/errorMessage/duration/easing，及重复 input/confirm/linechange/reset 事件与 setValue/reset/getState 方法。
- TDesign 1.15.3 的 `onInput` 会调用内部 `updateValue → setData`；PoemUI 保持自己的受控父级回写合同，并进一步把逻辑 `innerValue` 与原生 `renderValue` 分离。正常输入可以差量更新逻辑值与计数，但不得重绑原生 value；匹配当前草稿的父级 echo 必须为零组件 `setData`，真实外部变更与字符截断才更新 `renderValue`。

## 9. 明确禁止

- 禁止恢复两套自动高度、两套计数开关、两套错误状态或布尔 Slot 开关。
- 禁止把 Enter 写成 confirm 事件，把 line-change 写回 linechange，或把输入同时冒充 input/change 两次业务请求。
- 禁止 H5 只更新提示文案、绕过父级回写，或重新在 Textarea 内插入 Clear 操作改变输入宽度。
- 禁止把逻辑 `innerValue` 直接重新绑定到原生 textarea，或在匹配当前草稿的父级 echo 上全量提交派生状态。
- 禁止 Form/Field 复合层再叠一层 Surface，或把微信键盘限制包装成 H5 假成功。

## 10. 修改闭环

1. 同步审计 `textarea/` 四件套、内部 PUI 依赖、npm 入口、metadata、H5、Props/WXML/API、示例、`miniprogram_dist` 和安装产物。
2. 运行 `scripts/test-textarea.js`、语义/设计/组合/API 可读性合同，以及 `site:build/check/pack:check`。
3. 浏览器真实验证受控/非受控、0/false/空字符串、字符上限、自动增高、焦点/Enter、平台事件边界、锁定状态、Slots、180ms/1ms、390px、主题和全部外观。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5 兼容文档和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。
