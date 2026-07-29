# Breadcrumb 组件语义合同

修改 Breadcrumb 源码、H5、API 或示例前必须先运行 `npm run feedback:list -- --component breadcrumb`。

## 1. 组件定位

- Breadcrumb 是辅助路径导航，不替代 Navbar、Tabbar 或业务路由；它只请求调用方更新选择，不自行跳转或伪造成功。
- TDesign Mini Program 官方页面、仓库及固定 `tdesign-miniprogram@1.15.3` 安装包均没有同名 Breadcrumb；本组件以 PoemUI 四件套为真相源，不硬凑 API。

## 2. 固定结构与区域

```text
Breadcrumb(navigation)
├─ error / loading / empty（三态之一）
└─ content：prefix Slot + 内部横向 ScrollView 路径列表 + suffix Slot
```

- 状态优先级为 `error > loading > content > empty`；`wrap=false` 是默认值，优先让整条路径在内部单行展示，空间不足时只允许内部 ScrollView 横滚。调用方显式开启 `wrap` 才进入多行路径。
- 路径项使用 PUI Button，分隔符只作不可交互装饰。

## 3. PUI 组合与依赖

- 路径项、Retry、suffix 操作复用 PUI Button；图标/分隔图标复用 PUI Icon；loading 复用 PUI Loading。
- H5 复用相同镜像，路径项是组件自身交互根，不得以页面私有原生按钮替代。

## 4. Token、间距与排版

- 字号、高度、分隔符、间距、圆角、颜色和 500ms/1ms 动效均消费 PUI Token。
- 错误态固定使用“状态图标 / 可换行消息 / Retry”三轨布局；消息占剩余宽度，Retry 保持右侧可见且与消息垂直对齐，禁止让按钮挤入文案或漂到路径中间。
- `maxLabelLength` 是主动内容截断；状态、错误和 API 文字不得借省略号隐藏。

## 5. 内容、Slot 与组合边界

- 仅 `prefix`、`suffix` 两个具名 Slot；路由、权限和标题属于外层。
- `customPrefix/customSuffix` 只控制 Slot 容器，不增加平行文本、图标或业务回调 Props。

## 6. 状态与优先级

- disabled 阻止路径和 Retry 请求；loading/error/empty 不保留可点路径；Retry 只发布请求，等待父级清除 error。
- reduceMotion 压缩为 1ms，不改变状态、事件顺序或横滚。

## 7. 交互、受控边界与事件

- `value` 非空时为值受控；`current >= 0` 只在 value 未传时兼容受控；其余由 `defaultValue` 初始化为非受控路径。
- 当前项默认不可再次选择；`currentClickable=true` 才允许请求操作。
- 点击顺序为 `click`，仅值变化时为 `input → change`；Retry 只发 `retry`。`0`、`false`、空字符串为合法路径值。

## 8. 可访问性

- 根为 navigation，路径使用 list/listitem，当前项为 `aria-current=page`。
- 路径、Retry、suffix 都有名称；禁用与状态仍保持可读。

## 9. H5 预览与跨端一致性

- 概览通过 component-only 离线归一化，不显示原始值、事件顺序、Slot 术语、运行态 Cell 或方法面板。
- 概览固定分为“基础路径、图标与前后扩展、长路径横向滚动、换行与标签截断”四组；每组路径项共享同一个选择合同并维护独立真实状态，禁止用无回写按钮拼出静态示意。
- 属性页当前 Props 作用于“图标与前后扩展”组；其余三组使用受约束的教学数据，分别说明最小结构、nowrap 内部横滚和 wrap + maxLabelLength。
- 390px 实点选择“组件”后活动项从“Breadcrumb”变为“组件”，无诊断节点且 document/body 均为375px。

## 10. 响应式、主题与视觉配置

- wrap 可换行；nowrap 只内部横滚，禁止页面级溢出。外观开关只改变视觉。
- Breadcrumb 不是 Card，不得因阴影开关获得外投影。

## 11. 明确禁止

- 禁止自动路由、假 Retry 成功、事件日志、方法按钮、平台专有成功提示。
- 禁止恢复重复 value/index 别名、私有 duration/easing、自由 default Slot，或以 CSS 隐藏工程诊断。

## 12. 修改闭环

- 同步检查 `breadcrumb/` 四件套、metadata、H5、API、示例、dist 与安装产物。
- 运行 `node scripts/test-breadcrumb.js`、Ledger、site build、check、pack check；产物变化后运行 example install。
- 真机仍需验证 ScrollView 惯性、rpx、Slot 隔离、Button tap、读屏和低动效。
