# Table 组件语义合同

本文是 PoemUI Table 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component table`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

当前公开合同固定为 26 Props、7 Events、1 个 empty Slot 和 9 Methods；任何增删都必须重新完成 TDesign 对照、专项测试和真实浏览器 battle。

## 1. 组件定位

- Table 用于在小程序窄屏中浏览结构化行列数据，并在同一真实数据模型上提供横纵滚动、固定列、可选行与稳定排序。
- Table 不是自由页面容器、表单布局器或分页请求器。筛选、批量操作、请求成功与数据刷新由父级组合 Button、Input 等组件完成。
- Table 和 List 的边界：字段需要按列比较时使用 Table；以标题、说明和操作为主的单列信息使用 List/Cell。
- `table` 与 `shadcn-data-table` / `shadcn-table` 路由都映射同一个原生实现，不创建第二套适配组件。

## 2. 固定结构与区域

```text
Table(role=grid)
└─ Viewport
   ├─ ScrollView(horizontal; height>0 时 vertical)
   │  └─ Table content
   │     ├─ Header row（showHeader）
   │     │  ├─ Selection header（selectable）
   │     │  └─ Column headers
   │     └─ Data rows
   │        ├─ Selection cell（selectable）
   │        └─ Data cells
   ├─ Loading state
   ├─ Error state + Retry
   └─ Empty state / empty Slot
```

- Viewport 是唯一状态切换和裁切边界；Table 根只承担 grid 语义、Surface 和全局视觉配置。
- `error/loading/content/empty` 四层持续挂载，通过固定 500ms/低动效 1ms 的 opacity、transform 与有界 max-height 过渡，不对 `height:auto` 动画，不用 `display:none` 制造瞬移。
- 表头在 ScrollView 中固定吸顶；只有 `height>0` 时产生纵向滚动，横向滚动始终局限在 Table 内部。
- 固定列只改变对应单元格的 sticky 定位和边界，不复制另一份表格。

## 3. PUI 组合与依赖

- 选择列必须组合 PUI Checkbox；标签列组合 PUI Tag；图标列与排序标记组合 PUI Icon。
- loading 必须组合 PUI Loading；默认 empty/error 必须组合透明嵌入式 PUI Empty；Retry 必须组合 PUI Button。
- 数据行、表头与单元格属于 Table 自身底层交互根，可以使用 `view` / `scroll-view`，不得为了消除平台根而再包 PUI Button。
- 禁止恢复私有 Checkbox mark、字符箭头、私有 Spinner、手写 Empty 或假成功反馈。

## 4. Token、间距与排版

- 根 Surface 使用 PUI glass surface、border、large radius、soft shadow 和 frosted filter Token；全局边框/阴影/毛玻璃/大圆角开关只改变视觉，不改变表格几何。
- 表头高度、行高、选择列宽、单元格 padding 和分隔线使用固定 PUI 语义 Token，不向调用者暴露 `headerHeight/rowHeight/compact` 魔法布局参数。
- 字号、行高、字重必须消费 `--pui-font-*` / `--pui-line-height-*` Token；H5 保持 1px≈2rpx 镜像。
- `columns[].width` 是列宽真相源；调用者需要横滚时显式给列宽，不再提供重复的 `minTableWidth`。
- `columns[].ellipsis=true` 只允许裁切普通次要单元格；API、错误、选择状态和表头不得靠省略号掩盖错误布局。

## 5. 内容、Slot 与组合边界

- 公开只保留 `empty` 具名 Slot，由 `customEmpty=true` 明确启用；默认状态继续使用 PUI Empty。
- 删除 header、footer 与 default 自由 Slot。筛选、摘要、批量操作和分页应放在 Table 外部的业务布局中，避免 Table 成为面板套面板。
- `columns` 保留数据驱动字段：键、标题、宽度、对齐、固定、排序、text/tag/icon、value/theme map、ellipsis 和 headerIcon。
- 单元格为 null、undefined 或空字符串时使用 `emptyValue`；数字0、布尔false和字符串空值边界不得被真假值回退吞掉。
- `rowKey` 支持点路径并保留原始类型；业务键必须唯一，缺失时才回退原始索引。

## 6. 状态与优先级

- 固定优先级为 `error > loading > content > empty`。error/loading 不清空父级 data，也不能把旧数据冒充请求成功。
- Retry 只触发 `retry` 请求，组件保持 error，直到父级真实更新 error/loading/data。
- `disabled` 阻止行/单元格点击、选择、排序、重试和写方法，保留当前数据与视觉解释。
- 行级 `disabled` 只阻止该行点击和选择；已有受控禁用行选择值不能被全选/清空可用行时误删。
- custom empty Slot 只在 empty 状态生效，不覆盖 error/loading。

## 7. 交互、受控边界与事件

- `selectedRowKeys !== null/undefined` 为受控选择；交互只按 `input → change` 请求父级回写。非受控仅在初始化和退控时读取最新 `defaultSelectedRowKeys`。
- `sort !== null/undefined` 为受控排序；表头按 `asc → desc → none` 请求 `sort-change`。非受控仅在初始化和退控时读取最新 `defaultSort`。
- Checkbox、行点按和方法共享同一选择写入路径；删除重复的 `selection-change` 与 `row-select`。
- 数据单元格点击先触发 `cell-click`，随后事件冒泡触发行级 `row-click`；Checkbox 选择不伪造成 cell-click。
- `row-click` 不需要额外 `clickable` 开关；disabled/loading/error/empty 时不发布。
- 对外保留一套最小方法：选择、排序、通用 `scrollTo`、retry 和只读 getter；删除可由 `scrollTo` 表达的左右滚动别名。

## 8. 可访问性

- 根使用 `role=grid` 和唯一 `ariaLabel`；行、列头和数据单元格分别使用 row/columnheader/gridcell。
- loading/error 同步 `aria-busy` / `aria-invalid`；选择行同步 `aria-selected/disabled`。
- 可排序表头必须暴露 `aria-sort`；H5 支持 Enter/Space，事件 source 区分 pointer/keyboard。
- Checkbox 必须有“全选表格行”或具体行号名称；空状态、错误和 Retry 保持完整可读文案。
- `reduceMotion` 只把固定过渡压缩为1ms，不改变滚动、排序或事件顺序。
- WXSS 通过 Table 根节点时长 Token 压缩自身状态、行和单元格过渡，禁止用 `*` 穿透 Checkbox、Tag、Icon 或 Empty 子组件。

## 9. H5 预览与跨端一致性

- 标准概览按“基础用法 / 边线与固定列 / 选择与排序 / 加载、空与错误”分区；第一组使用当前 Props，其他分区是可读的真实能力样例。
- 基础 WXML 必须是最小可用调用，只包含列与数据，不出现任何 `bind:*`、默认 Prop、工程日志或实例方法面板。
- H5 和原生共享 columns/data、受控/非受控、固定列、状态优先级、事件顺序与方法语义；单位按1px≈2rpx镜像。
- 概览选择、排序、Retry、滚动和方法必须真实改变同一运行态或父级 Props，禁止只更新提示文字。
- 预览使用 `shadow-safe` 父布局；横纵溢出只属于 Table viewport，页面级不得横向滚动。

## 10. 响应式、主题与视觉配置

- 390px 下表格保持可操作，选择列和固定列不遮盖滚动内容；超宽列只在 Table 内产生横滚。
- light/dark、border、shadow、frost、large-radius、gradient 必须逐项真实验证；固定单元格背景需与条纹、选中和深色状态一致。
- 边框关闭只透明化中性边界并保持盒模型；选中、焦点、错误和危险 Retry 的语义边界保留。
- 阴影安全内距不随开关变化；渐变只作用于页面/Stage/PreviewDevice，不进入 Table Surface。

## 11. TDesign 1.15.3 对照决定

- 固定参考官方 Table 文档和 `tdesign-miniprogram@1.15.3/miniprogram_dist/table` 的 `base-table-props.js`、类型、WXML、WXSS 与 JS。
- 借鉴并保留 columns/data/rowKey、bordered/stripe、height、showHeader、empty value、固定列、loading、empty Slot，以及 row/cell/scroll 的真实事件思路。
- PoemUI 保留受控选择、排序、error/retry、Tag/Icon 单元格、ARIA 与低动效，因为它们已有真实父级闭环且服务小屏数据操作。
- 不照搬 `rowspanAndColspan` 函数、external class、任意 CSS class 回调、footerSummary、loadingProps、tableLayout、verticalAlign 和 fixedRows；小程序数据传输与 PoemUI Token/组合合同不适合这些动态 DOM 式入口。
- 不以 Props 数量接近为目标；旧 39 Props 中的 items、compact、minTableWidth、stickyHeader、headerHeight、rowHeight、showSelectAll、selectionFixed、clickable、customHeader/customFooter、duration/easing 等被收敛。

## 12. 明确禁止

- 禁止恢复 `items` 数据别名、`clickable` 行事件开关、自由 header/footer/default Slot 或组件私有 duration/easing。
- 禁止恢复重复 `row-select/selection-change` 事件和 `scrollToLeft/scrollToRight` 方法。
- 禁止注入假行、假加载完成、假 Retry 成功或静态事件日志。
- 禁止把固定列实现为第二份表格，禁止让横滚扩张 document，禁止用 `display:none` 切状态。
- 禁止用 Table 内 Slot 承载筛选、分页、批量工具栏；这些属于外层业务布局。

## 13. 修改闭环

1. 同步审计 `table/` 四件套、内部 PUI 依赖、npm 入口、metadata、H5、Props/WXML/API、示例、`miniprogram_dist` 和安装产物。
2. 运行 `scripts/test-table.js`、语义/设计/布局/状态组合/API可读性合同，以及 `site:build/check/pack:check`。
3. 浏览器真实验证受控/非受控、0/false、行/单元格事件顺序、选择、排序、滚动、error/retry、180ms/1ms、390px、主题和全部外观。
4. 更新 Feedback Ledger、TDesign 对照清单、进度、API/H5兼容文档和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。

## 14. 2026-07-27 选择列一体化

选择 Checkbox 是 Table 内容的一部分：使用 `borderless`，选择列可 sticky 但不得带 `fixed-edge` 分隔线或独立 Surface。小程序与 H5 均须保持这一规则，见 `table/table.{js,wxml}`、`preview/styles.css`、`PUI-FB-0438`。
