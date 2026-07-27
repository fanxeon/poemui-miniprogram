# Direction 组件语义合同

本文是 PoemUI Direction 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component direction`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

- Direction 是局部阅读方向 Provider：为默认 Slot 子树提供 `ltr`、`rtl` 或按语言解析的 `auto` 方向与逻辑文本对齐。
- 它适用于确有双向文本、阿拉伯语/希伯来语等内容子树的业务；不适合当作横纵排版、图标翻转或现有物理 `left/right` WXSS 的自动迁移器。
- 当前仓库没有除示例外的业务消费者。新增使用前必须先确认实际国际化需求；若准备退役，必须完整移除公开入口、示例、H5、API、产物和测试，不能只隐藏目录。

## 2. 固定结构与区域

```text
Direction 根（dir、text-align、display、aria）
├── useSlot=true：默认 Slot 子树
└── useSlot=false：文本 Content
```

- 根节点始终存在；Slot 与回退 `content` 互斥。
- 根只负责方向继承、逻辑对齐、display 与短暂方向变化淡入淡出，不建立 Card、状态面板或操作区；H5 镜像同样透明、无边框、无 padding、无圆角和无外阴影。

## 3. PUI 组合与依赖

- Direction 自身不强制内置 PUI 子组件；默认 Slot 中可组合 Cell、Button、Tag、Icon 等真实业务组件。
- H5 演示若需要表现组合，必须调用 `cellSample`、`buttonSample`、`tagSample` 和 `iconComponent`，不能以手写控件替代；Button 必须进入完整 `pui-button-preview` 镜像合同。
- 根是 Provider 基础节点，可使用 `view` / HTML `div`；不允许为展示方向额外套 Card、Cell 或私有信息面板。

## 4. Token、间距与排版

- 根不拥有面板 padding、外阴影、边框、圆角或固定字体；这些属于业务 Slot 的组件合同。
- 方向变化只使用 opacity 与 0–1000ms/低动效 1ms Token 化过渡；默认总时长 500ms，由淡出和淡入两个等分阶段组成。不得对 `height:auto`、左右物理位置或图标做伪动画。
- 文本与 Slot 的兄弟间距由消费者决定，Provider 不穿透修改子组件几何。

## 5. 内容、Slot 与组合边界

- `useSlot=true` 时只投影默认 Slot；`useSlot=false` 才显示 `content`。二者不可并列或重复渲染。
- 父组件可声明语言、方向、逻辑对齐与容器显示方式；不得承诺自动将既有 `left/right` 改为逻辑样式，也不得自动翻转箭头、返回等方向性图标。

## 6. 状态与优先级

- 不提供 loading/error/empty/disabled、业务取消、失败或重试状态；它们由 Slot 消费者管理。
- 解析结果优先级固定为显式合法 direction、显式/系统语言的 auto 解析、fallbackDirection。方向真的改变时才进入短暂 changing，再恢复稳定根结构。

## 7. 交互、受控边界与事件

- `direction/language/fallbackDirection` 是声明式输入，组件持续解析而不维护业务值；事件严格区分每次 `resolve`、仅首次 `ready`、真实方向变化的 `change` 与动画结束的 `after-change`。
- `refresh()` 重新解析；`getDirection()/getState()` 只读当前快照。`duration=0` 时 `after-change` 与 `change` 同步。
- Slot 内用户取消、失败、重试和恢复不被 Provider 改写、吞掉或伪造成方向事件。

## 8. 可访问性

- 根保留 `aria-label`，由浏览器 `dir` / 小程序 direction 表达阅读顺序；内容是否可选择遵循真实 `selectable` 边界。
- Slot 内的交互控件仍按各自 PUI 合同提供名称和焦点；Provider 不制造额外的 keyboard 操作或工程方法按钮。
- 不得裁切双向文字、关键动作或文字基线差异。

## 9. H5 预览与跨端一致性

- H5 用 `dir`、CSS direction 和 `navigator.language` 镜像 WXML/WXSS 与微信语言读取顺序；它不能宣称等价于微信系统语言或完整 RTL 生态。
- 标准预览使用 `shadow-safe`，不是 `edge-to-edge`，并且只能有一个 PreviewDevice 内部 scroll viewport。
- H5 只展示用户可理解的方向效果与必要的操作结果；方法按钮、解析日志和“native mirror”等工程诊断必须留在 API/属性，不得污染概览。
- Slot 内基础 Button 后若紧接不透明 Cell/Surface，H5 组合容器必须以 `pui-preview-elevation-clearance` 预留 `--pui-preview-shadow-bleed`，且透明 Provider/Slot 根保持 `overflow:visible`；不得让后续内容覆盖 Button 外阴影。

## 10. 响应式、主题与视觉配置

- 390px 下双向文本、Slot Button 和 Cell 必须自然换行且无横向溢出。
- light/dark、border、shadow、frostedGlass、largeRadius 与渐变由 Slot 的 PUI 组件与全局 Token 决定；透明 Provider 根不得因任何外观开关生成 Surface。

## 11. 明确禁止

- 禁止把 Direction 宣称为全库 RTL 解决方案、物理样式迁移器或图标自动翻转器。
- 禁止给透明 Provider 根补 Card、外阴影、内边距、边框或伪状态。
- 禁止在概览堆叠方法、解析事件、内部语言来源等工程诊断。
- 禁止在未确认的业务国际化需求下继续扩展 API；无消费者的组件退役必须完整删除，不能留死路由。

## 12. 修改闭环

1. 同步审计 `direction` 四件套、解析顺序、H5、metadata、API、示例、专项测试、产物与真实消费者。
2. 更新本合同、相关 API/H5 文档与 Feedback Ledger；若退役，更新公开入口、目录、生成器、示例、文档、测试和全部生成物。
3. 保留时运行 `node scripts/test-direction.js`，并执行 `npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run example:install`、`npm run pack:check`；浏览器验证 390px、主题、低动效与双向文本。
4. 微信真机必须用合法 AppID 复核系统语言、文字 shaping、图标、Slot、样式隔离和辅助技术；H5 不可替代。
