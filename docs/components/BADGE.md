# Badge 组件语义合同

本文是 PoemUI Badge 的长期设计与实现合同。任何 Agent 修改 Badge 源码、H5 镜像、示例、元数据、内部消费者或安装产物前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component badge`

完整 Props 与 Slots 以 `docs/COMPONENT_API.md` 为准；本文规定长期语义、组合边界和 TDesign 对照决定。

## 1. 组件定位

- Badge 是附着在对象旁的数量、短文字或红点提示，是纯展示叶子组件，不是 Button、受控显隐容器或业务状态机。
- 需要点击时由 Button、Cell、Tabs、Tabbar 等真实宿主承担交互和禁用语义；Badge 不公开 click、disabled 或实例方法。
- Badge 不承担 loading、empty、error、retry。业务状态应由宿主或 Loading/Empty 等组件表达。
- Marker 已归并为 Badge；不得恢复独立 Marker 包、目录或 API 身份。

## 2. 固定结构

```text
view.pui-badge-wrap
├── content
│   ├── content Prop 文本，或
│   └── default Slot 宿主内容
└── badge
    ├── dot，或
    ├── count 格式化内容，或
    └── count Slot（count=null）
```

- 有宿主内容时，徽标固定附着在右上角；只渲染徽标时自动回到普通文档流，不再要求 `standalone` 开关。
- `content` 是宿主短文本的便捷入口，不是 count 的别名；复杂宿主通过默认 Slot 组合 PUI Icon、Button 或其他组件。
- 自定义徽标正文使用 `count` Slot，并以 `count="{{null}}"` 显式选择；不再暴露 `useContentSlot`。

## 3. 数量与边界

- `count` 公开类型为 `string | number | null`；数字和纯数字字符串参与零值与上限规则，普通字符串原样展示。
- 数字 `0` 默认隐藏，`showZero=true` 时显示；字符串空白、undefined 和不支持的布尔值均视为空。
- `count=null` 只表示由 count Slot 接管，不回退到别名或假默认内容。
- 正数 `maxCount` 控制 `${maxCount}+`；非法值回退 99。dot 优先于 count 与 count Slot，始终只显示圆点。
- 基础用法固定为 `<pui-badge count="3"><pui-icon name="bell" /></pui-badge>`，不得绑定任何事件。

## 4. API 边界

- 公开 Props 固定为 `count/content/dot/maxCount/showZero/theme/variant/shape/size/color/offset/ariaLabel` 12 项。
- 公开 Slots 固定为 `default/count` 2 项。
- 公开 Events 与业务实例 Methods 均为 0。
- 删除 `value/text` 内容别名、`visible`、`textColor/borderColor/bordered`、`position/standalone/useContentSlot`、`clickable/disabled`、`ariaLive`、`duration/easing/reduceMotion`。
- 公共 `customClass/customStyle/colorScheme` 继续由主题 Behavior 提供，不计入组件专属 Props。

## 5. 视觉与 Token

- theme 支持 danger/primary/success/warning/neutral；variant 支持 solid/light/outline；shape 支持 circle/square；size 支持 small/medium/large。
- color 是 TDesign 对照后保留的单一自定义色入口，只覆盖徽标主色；不再暴露独立前景色和边框色。
- offset 固定为 `[x,y]`，接受安全 number 或带 rpx/px/em/rem/% 单位的短长度；数字按 rpx 解释，非法值回退 0。
- 全局边框、阴影、毛玻璃、大圆角与主题由 ConfigProvider Token 管理；Badge 不复制视觉总开关。
- Badge 不维护显隐状态机；计数更新只改变展示内容。全局低动效不得改变尺寸、定位或可读性。

## 6. H5 概览

- 固定分为“基础用法 / 红点与上限 / 尺寸与形状 / 主题与变体 / 组合用法”五段，分区标题使用共享 18px section gap。
- 第一项由当前 Props 实时驱动；固定项目只用于能力比较，不覆盖用户调参结果。
- 组合用法必须调用共享 Badge 镜像，并通过 PUI Cell、Button、Icon 组合，不手写私有徽标。
- H5 必须和 WXML 共享 count=0、空字符串、null Slot、maxCount、dot、颜色、offset 与自动独立布局语义。
- Badge 没有 active/selected/disabled/readonly/loading/error 等自身状态；battle 必须验证这些职责由宿主组合承接，而非向 Badge 重新添加 Props。

## 7. TDesign 1.15.3 对照决定

- TDesign 安装包公开 color/content/count/dot/maxCount/offset/shape/showZero/size 9 项 Props、0 Events，并提供默认内容与 count Slot。
- PoemUI 对齐其纯展示定位、count 规则、默认内容、count Slot、右上角覆盖和无事件合同。
- PoemUI 额外保留 theme 与 variant，服务现有语义 Token 和 shadcn Badge 视觉；额外保留 ariaLabel，明确微信辅助语义。
- PoemUI size 继续支持 small/medium/large，以兼容 Tabs、Tabbar、NavigationMenu 等内部真实组合。
- 不照搬 ribbon/triangle/bubble 等装饰形状；这些不属于 PoemUI 克制的通用徽标需求。
- 公开合同由 27 Props、5 Events 收敛为 12 Props、0 Events；差异按真实组合需求保留，不追求数量机械相同。

## 8. 响应式与外观

- 390px 下五段概览、长 count、offset、API 表格和属性控件均不得造成页面级横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变背景不得破坏 Badge 与宿主的几何关系。
- dot 始终保持圆形；显式 circle 也始终保持满圆，不受大圆角开关改变。
- 长文字 count 应由 maxCount 或业务短文案控制；组件可限制自身最大宽度，但不得撑破宿主或页面。

## 9. 明确禁止

- 禁止恢复 count/content/value/text 多重内容优先级；content 只能表示宿主文本。
- 禁止恢复 Badge 自身 click、disabled、visible、show/hide 生命周期或显隐实例方法。
- 禁止恢复四角 position；标准附着位置固定右上角，特殊布局由宿主结构和 offset 处理。
- 禁止为 count Slot增加 `useContentSlot`；使用 count=null 作为唯一显式入口。
- 禁止在基础 WXML 中展示 bind 或调试性状态文字。
- 禁止在 H5 通过点击递增计数、显示事件卡或伪造业务成功。

## 10. 修改闭环

1. 同步审计 Badge 四件套、内部消费者、index.js、metadata、H5、API、示例、dist、安装产物和 Ledger。
2. 更新 `scripts/test-badge.js`，至少覆盖 12 Props、0 Events、0 Methods、0/空字符串/null Slot、上限、dot、自动独立布局、安全颜色/偏移和内部消费者迁移。
3. 回归 Grid、Radio、Indexes、List、Sidebar、Tabs、Tabbar、NavigationMenu、DropdownMenu、VirtualList 等 Badge 消费者。
4. 浏览器验证全部 Props、五段演示、复制、桌面/390px、深浅色和全部视觉开关。
5. 运行 site/check/pack；微信 CLI 不可用时保留 pending-cli，不把 H5 通过等同安装产物完成。

任何不能满足本文的实现必须记录进 Feedback Ledger，不得静默绕过。
