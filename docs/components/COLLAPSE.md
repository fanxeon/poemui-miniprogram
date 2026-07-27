# Collapse 组件语义合同

本文是 PoemUI Collapse 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component collapse`

Props 与事件的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

当前公开合同固定为 17 Props、2 Events、0 Slots、1 个 `collapse-panel` Generic 和 0 Methods；任何增删都必须重新完成 TDesign 对照、专项测试和真实浏览器 battle。

## 1. 组件定位

- Collapse 管理一组可展开面板，适合 Accordion、FAQ 和分段详情；单 trigger + 单 content 使用 Collapsible。
- 组件只管理面板值、展开状态、结构主题和整体加载边界，不承担业务 Header、Footer、筛选、保存或请求成功状态。
- 数据由 items 进入；结构不同的面板通过 `collapse-panel` Generic 组合，不恢复自由 Header/Footer Slot。

## 2. 固定结构

```text
Collapse(role=group)
├─ Error: PUI Empty + Retry Button
├─ Loading: PUI Loading
├─ Empty: PUI Empty
└─ Content
   └─ Items
      ├─ Trigger(role=button) + PUI Icon
      └─ Persistent Content Region
         ├─ text description
         └─ collapse-panel Generic
```

- 状态优先级固定为 `error > loading > content > empty`。
- Trigger 是 Collapse 自有交互根，原生使用 `view[role=button]`，H5 使用 `div[role=button]`；不得为了消除平台根再套 PUI Button。
- 内容节点持续挂载，原生用 selector query、H5 用 scrollHeight 测量真实高度。

## 3. 数据与严格值

- item schema 固定为 `{ label, value, description, note, icon, expandIcon, disabled, ariaLabel }`。
- 为迁移 TDesign CollapsePanel，兼容 `header/content/headerLeftIcon/headerRightContent`；这些是 item 字段别名，不增加并行 Props。
- value 只接受有限 number、string、boolean；按 `typeof + value` 去重与匹配。数字0、布尔false、空字符串、字符串"0"必须是四个独立值。
- value/defaultValue 只接受数组。value 为数组时受控；null 或其他类型进入非受控。
- controlled → uncontrolled 时从最后一次受控值继续；defaultValue/defaultExpandAll 只初始化一次，并支持异步迟到 items。

## 4. 主题、Generic 与组合

- theme 只保留 TDesign 对齐的 `default/card`：default 是连续分组，card 是独立 Surface。
- expandIcon 控制默认箭头，item.expandIcon 可关闭单项箭头；箭头固定使用 PUI Icon。
- customPanel=true 时启用 `collapse-panel` Generic，向其传递 item/index/value/expanded/title/description/ariaLabel；默认 Generic 为 PUI Cell。
- Generic 只接管内容，不得绕过父级的展开、禁用、状态、ARIA 与事件合同。
- 默认状态复用 PUI Loading/Empty/Button；嵌入式 Empty 透明，不形成第二层 Surface。

## 5. 状态与交互门禁

- disabled 阻止全部 Trigger 与 Retry；item.disabled 只阻止自身 Trigger。
- error/loading 时不渲染可交互面板。Retry 只派发 retry，父级真实更新 error/loading/items 前必须保持错误态。
- expandMutex 规整受控、默认和内部值，只保留第一个有效项。
- defaultExpandAll 只在没有数组 defaultValue 时生效；互斥模式只展开第一项。

## 6. 事件与方法

- 只公开 `change/retry`。change.detail 固定包含 `value/item/index/expanded/source/controlled`。
- 不发布与 change 重复的 input/open/close；展开与收起由 expanded 表达。
- 不公开 open/close/toggle/retry 等业务方法，避免绕过受控边界或形成第二套事件路径。
- H5 Enter/Space 是官网键盘增强，source=keyboard；小程序不伪造桌面键盘事件。

## 7. 动效与可访问性

- 展开、收起、箭头和轻位移固定 500ms、standard easing；reduceMotion 与 `prefers-reduced-motion` 压缩为1ms。
- 禁止对 height:auto、max-height:none 动画，禁止 display:none 或条件移除内容节点制造瞬移。
- 根暴露 group、ariaLabel、busy、disabled；Trigger 暴露 expanded/disabled，Content 通过 aria-label 与 aria-hidden 对齐。
- 关键标题和说明允许自然换行，不得用省略号掩盖布局错误。

## 8. H5 演示

- 概览固定按“基础用法 / 多开与互斥 / 卡片与 Generic / 加载、空与错误”分区。
- 基础 WXML 只输出 items，零 bind、零默认 Prop、零事件诊断卡。
- 面板展开必须局部更新 DOM 并保留同一内容节点；状态、主题与 Generic 演示通过同一 Props 真相源更新。
- 受控 Props 演示由站点父级真实回写；非受控值存在 demo runtime 中，不能混为一份状态。
- H5 预览在初始渲染时必须调用 `syncCollapsePreviewHeights(true, props)` 设置展开面板的正确高度，避免 max-height:0 导致内容不可见。
- 390px 下标题、note、操作组和状态文案可换行且不得造成页面级横向溢出。

## 9. TDesign 1.15.3 对照决定

- 固定参考 TDesign Miniprogram 1.15.3 Collapse/CollapsePanel 的 properties、type、WXML、WXSS 与 JS。
- 保留 `value/defaultValue/defaultExpandAll/disabled/expandIcon/expandMutex/theme/change` 主干。
- TDesign 的 CollapsePanel 拆分形态映射为 items + Generic；PoemUI 保留 loading/error/retry、严格原始值、ARIA 和 reduceMotion，因为已有真实父级闭环。
- 不照搬 `height:auto` 动画；不把 panel 的 header/content 各自扩成根组件 Props；不以 Props 数量接近为目标。

## 10. 明确禁止

- 禁止恢复 primary/success/warning/danger 主题、customHeader/customFooter、duration/easing。
- 禁止恢复 input/open/close 或公开业务实例方法。
- 禁止用 String(value) 比较、真假值默认或 JSON 字符串化身份吞掉0/false/空字符串。
- 禁止用 raw button、字符箭头、私有 Spinner/Empty 或 fake retry。
- 禁止让 card 主题、外观开关或 Generic 改变展开值与内容高度真相。

## 11. 修改闭环

1. 同步审计 `collapse/` 四件套、内部 PUI 依赖、npm 入口、metadata、H5、Props/WXML/API、示例、`miniprogram_dist` 和安装产物。
2. 运行 `scripts/test-collapse.js`、语义/设计/状态组合/API 可读性合同，以及 `site:build/check/pack:check`。
3. 浏览器真实验证受控/非受控、0/false/空字符串、单开/多开、键盘、disabled、error/retry、Generic、180ms/1ms、390px、主题和全部外观。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5 兼容文档和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。

## 13. 等距与阴影资格

Collapse 仅在 `card` 形态把独立 item 集合的主布局 gap 映射到 Surface inset；普通连续形态不插入大 gap。Item 根保留 Surface 阴影，触发器、内容和状态子组件不获得额外外投影。
