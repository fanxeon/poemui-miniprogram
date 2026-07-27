# Search 组件语义合同

本文是 PoemUI Search 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或输入组合前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component search`

Props、Events 与 Slot 的完整清单以 `docs/COMPONENT_API.md` 为准。当前公开合同固定为 17 Props / 6 Events / 1 Slot / 0 Methods；任何增删都必须重新完成 TDesign 对照、专项测试和真实浏览器 battle。

## 1. 组件定位

- Search 是单一搜索字段与右侧操作的组合组件；业务结果、历史记录、筛选器和请求状态由消费者在组件外组合。
- Search 直接复用 PUI Input、Button 和 Icon，不维护第二套输入、清空或焦点实现。
- Search 只发布查询意图，不伪造远端检索、结果数量或成功提示。

## 2. 固定结构

```text
Search(role=search)
├─ PUI Input
│  ├─ PUI Icon(search)
│  ├─ native input
│  └─ PUI Button(clear)
├─ PUI Button(cancel, optional)
└─ default Slot(optional action)
```

- Search/Input 只能形成一个可见字段 Surface；Search 根只负责横向布局，不得叠加第二层背景、边框、阴影或毛玻璃。Search 的阴影资格由嵌入 Input Field 承担，清空按钮仍是透明的 PUI IconButton。
- 小程序端 Search 宿主与内部根均占满调用者可用宽度并允许收缩（`width/max-width:100%`、`min-width:0`）；内部 PUI Input 宿主在横向行中占用剩余空间。消费者不应依赖跨组件 WXSS 选择器修复宿主宽度。
- 清空必须继续由 Input 的 PUI Button + PUI Icon 承担；取消固定使用 PUI Button。
- 默认 Slot 只承接取消按钮后的自定义操作，不承接结果列表或状态面板。

## 3. 值、字符与受控边界

- `value !== null/undefined` 为受控；`0`、`false` 与空字符串都是合法受控值，并统一规整为字符串。
- 受控输入和清空只发布事件请求，父级回写前保持当前值；controlled → uncontrolled 时继续最后一次受控渲染值。
- `defaultValue` 只在首次非受控初始化时读取，后续变化不覆盖用户输入。
- `maxcharacter >= 0` 优先于 `maxlength`；ASCII 按 1、非 ASCII 和 emoji 按 2 计数，截断不得拆开代理对。
- `clearTrigger=focus` 只在聚焦时显示清空操作；`always` 在非空且可交互时持续显示。

## 4. 形状、状态与输入组合

- `shape` 只接受 `square/round`；`center` 只改变输入文字对齐，不移动右侧操作。`shape="round" + center` 仍占满调用者分配的可用宽度，“居中”绝不表示把 Search 缩为私有固定宽度。round 经 Input 的 `--pui-input-field-radius` 消费已定义的 `--pui-radius-round`，不能引用未定义的 `--pui-radius-full`。
- Search 的 Input 必须保持 `bordered=true`，由 ConfigProvider 的 `--pui-border-color` 决定边框是否可见；主题、边框与普通圆角随全局外观即时切换。显式 round 是满圆胶囊语义，和 Button 的 round/circle 一样不因“大圆角”开关降为方形。
- 当 Search 与 Combobox 纵向组合时，二者必须由同一个父级轨道分配宽度和左右 inset；不得只给 Search 加额外 `max-width` 或私有横向 margin，否则圆形 Search 的边界会与选择器不齐。
- disabled 与 readonly 均阻断输入、清空、确认和取消；readonly 保留独立语义，不伪装成 disabled。
- `focus` 是声明式聚焦请求，实际焦点能力由 PUI Input 与微信平台决定。
- `confirmType` 只接受 `done/go/next/search/send`，非法值回退 `search`。

## 5. 事件合同

- 真实输入只发布 `change`，不重复发布同义 `input/change`。
- 清空顺序固定为 `clear → change`；两事件共享空值、前值、`source=clear` 与受控标记。空值和锁定状态不发布伪事件。
- 微信确认键发布 `search`；内部必须监听 PUI Input 的公开 `enter`，禁止监听不存在的 `confirm`。
- `focus/blur` 返回当前值；取消只发布 `cancel`，不擅自清空或伪造搜索结果。
- Search 不公开实例方法；声明式值和焦点由 Props 管理，避免复制 Input 的方法 API。

## 6. 动效与可访问性

- 字段、焦点和取消操作固定使用 500ms standard easing；`reduceMotion=true` 压缩为 1ms，不公开私有 duration/easing。
- 根固定 `role=search`，提供可访问名称、disabled 与 readonly；输入与操作继承同一语义。
- 不使用 `display:none` 制造字段状态瞬移，不对 `height:auto` 做 transition。

## 7. H5 演示

- 概览固定按“基础用法 / 搜索框形状 / 操作与长度 / 状态与受控”分区，标题间距遵循统一 section gap。
- 基础 WXML 为 `<pui-search />`，零 `bind:*`；事件全集只进入 API Events。
- 所有可见输入必须调用 `inputControlSample`，取消必须调用 `buttonSample`；不得手写 raw input、清空按钮或业务结果块。
- Props 调整必须真实作用于 HTML input；受控模式经父级 Props 回写，非受控模式保留 runtime，清空、Enter、焦点和取消必须真实触发。
- 390px 下 round/square、长取消文字、Slot、清空按钮均可收缩或换行，不产生页面级横向溢出。

## 8. TDesign Mini Program 1.15.3 对照决定

- 固定参考官方 Search 文档和 npm 安装包 `search/props.js`、类型、JS/WXML/WXSS。
- 借鉴 `center/clearTrigger/maxlength/maxcharacter/shape`、右侧操作、`change/clear/focus/blur/submit/action-click` 主干，以及“基础、形状、状态”分区。
- PoemUI 将 `action/action-click/submit` 收敛为已有且更直接的 `showCancel/cancelText/cancel/search`；保留 `defaultValue/readonly/ariaLabel/reduceMotion` 的真实闭环。
- 不照搬 `resultList`：搜索结果是业务数据，不应耦合进基础输入；不照搬 type/leftIcon 和光标、键盘位移、placeholder 样式等平台长尾透传。
- 不恢复重复 `input` 事件、私有 duration/easing 或实例方法。

## 9. 明确禁止

- 禁止监听 PUI Input 不会发出的 `input/confirm`；组合事件必须以子组件公开合同为准。
- 禁止清空只更新提示文案、不更新真实值，或受控模式绕过父级回写。
- 禁止在 Search 内置组件目录、结果列表、Empty/Loading/Error 卡或假请求状态。
- 禁止给 Search 根创建第二个 Surface，或穿透覆盖 PUI Button/Icon 的几何。
- 禁止在基础 WXML 展示事件全集。

## 10. 修改闭环

1. 同步审计 `search/` 四件套、Input/Button 依赖、metadata、H5、Props/WXML/API、示例、生成器、`miniprogram_dist` 和安装产物。
2. 专项测试覆盖受控/非受控、0/false/空字符串、字符上限、清空顺序、确认、焦点、取消、形状、状态与 PUI 组合。
3. 浏览器真实验证输入、清空、Enter、cancel、退控、390px、API 全文、light/dark、全部外观和 1ms。
4. 更新 Feedback Ledger、TDesign 清单、进度、API/H5 兼容说明和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。
