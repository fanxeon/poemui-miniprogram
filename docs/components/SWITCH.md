# Switch 组件语义合同

本文是 PoemUI Switch 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据、全站外观菜单或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component switch`

Props 与 Events 的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

当前公开合同固定为 11 Props / 1 Event / 0 Slot / 0 Method；任何增删都必须重新完成 TDesign 对照、专项测试和真实浏览器 battle。

## 1. 组件定位

- Switch 只控制一个独立功能的开启或关闭；多选使用 Checkbox，成组单选使用 Radio。
- 组件只管理真实二元值和切换请求，不保存设置、不执行提交，也不宣告业务成功。
- 外部标题、说明、必填与校验反馈由 Cell、Field 或 Form 组合，不能重新塞回 Switch 本体。

## 2. 固定结构

```text
Switch(role=switch)
├─ label[checked/un-checked]
└─ Thumb
   ├─ PUI Loading
   └─ PUI Icon
```

- 根节点就是唯一触摸目标和 switch 语义节点，不增加 label/body/content 第二交互区。
- loading 固定复用 PUI Loading，icon 固定复用 PUI Icon；禁止字符图标、私有 Spinner 或默认 Slot。
- Switch 不提供 Slot。复杂说明与操作必须由 Cell/Field/页面作为兄弟结构组合。

## 3. 值合同

- `value !== null/undefined` 为受控；`0`、`false` 与空字符串都是合法受控值。
- 受控点击只发布 change 请求，父级回写前拇指不得提前移动。
- `defaultValue` 只初始化非受控状态；后续修改不得覆盖用户切换。controlled → uncontrolled 时继续最后一次受控渲染值。
- `customValue` 固定为 `[开启值, 关闭值]`，仅接受两个不同的 string/number/boolean；非法、同值、非有限数或对象安全回退为 `[true, false]`。

## 4. 内容、状态与尺寸

- `label` 和 `icon` 都是 `[开启, 关闭]` 二元数组，与 TDesign 同名语义对齐；任一端缺失时只隐藏对应内容，不伪造占位。
- label 存在时轨道使用真实扩宽尺寸；不得用 scale 改变视觉而保留错误占位。
- size 固定为 small/medium/large，非法值回退 medium。
- disabled、readonly、loading 都阻断切换且不发布假 change；loading 同时显示内部 PUI Loading。
- readonly 保留独立虚线和 `aria-readonly` 语义，不能冒充 disabled；H5 和小程序都不可写。

## 5. 事件与动效

- 仅公开 `change`。detail 固定包含 value、checked、previousValue、previousChecked、source、controlled。
- 不再公开 click/input/slot-click；轨道触摸不是三次业务动作，消费者只处理一次 change。
- 不公开 toggle/check/uncheck/reset/getValue/getState；声明式值更新统一由父级 Props 完成。
- 轨道、拇指与文字过渡固定 500ms、standard easing；reduceMotion 与 H5 `prefers-reduced-motion` 压缩为1ms。
- 不公开 duration/easing，不使用 display:none、height:auto transition 或超过500ms的动画。

## 6. H5 演示与全站复用

- 概览固定按“基础开关 / 带文字与图标 / 开关状态 / 尺寸”分区，标题之间使用统一18px分区间距。
- 基础 WXML 只展示 `<pui-switch />`，不写 bind，不放事件/方法诊断卡。
- 状态和尺寸示例通过 PUI Cell 组合；不把标题、说明或静态状态块重新实现进 Switch。
- H5 使用真实 `button[role=switch]` 镜像 WXML 根，受控值必须真实回写 Props，非受控值保留独立 runtime。
- 全站外观菜单和“一键果味”继续调用共享 `switchPreviewMarkup`，但外部文字属于站点组合参数，不是 Switch 的 label Prop 或 Slot。
- 390px 下四个分区、Cell、轨道文字和外观菜单都不得产生页面级横向溢出。

## 7. TDesign Mini Program 1.15.3 对照决定

- 固定参考 TDesign Mini Program 1.15.3 Switch 的官方 Props/Events、源码与“基础开关 / 带描述开关 / 自定义颜色 / 开关状态 / 尺寸”演示。
- 对齐 `value/defaultValue/customValue/label/icon/size/disabled/loading` 和唯一 change 事件。
- 保留 PoemUI 的 readonly、ariaLabel、reduceMotion，因为它们已有真实门禁、辅助语义和全局低动效合同。
- 自定义颜色继续通过 PUI Token 和全局外观设置完成，不新增组件私有 color Prop。
- 删除旧版 checked/defaultChecked/name/description/activeText/inactiveText/showText/activeIcon/inactiveIcon/customLabel/customThumb/customContent/placement/block/invalid/required/duration/easing，以及所有 Slot、重复事件和实例方法。

## 8. 明确禁止

- 禁止恢复 checked/value 双受控入口、defaultChecked/defaultValue 双默认入口或 click/input/change 三连事件。
- 禁止把外部标题、描述、操作按钮和错误提示做进 Switch 本体。
- 禁止为调试重新公开实例方法、事件状态卡或 Slot 点击事件。
- 禁止 H5 只更新提示文字而不改变真实 `aria-checked`、拇指位置和父级 Props。
- 禁止修改共享 Switch 镜像时破坏外观菜单的持久化、键盘、Esc、焦点恢复、深浅色或果味推导。

## 9. 修改闭环

1. 同步审计 `switch/` 四件套、PUI Icon/Loading、npm 入口、metadata、H5、Props/WXML/API、示例、`miniprogram_dist` 和安装产物。
2. 运行 `scripts/test-switch.js`、语义/设计/组合/API 可读性合同，以及 `site:build/check/pack:check`。
3. 浏览器真实验证受控/非受控、0/false/空字符串、文字/图标、三尺寸、锁定状态、change、500ms/1ms、390px、主题、全局外观菜单和全部视觉开关。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5 兼容文档和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。
