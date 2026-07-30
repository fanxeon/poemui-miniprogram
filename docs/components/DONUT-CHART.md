# DonutChart 组件语义合同

本文是 PoemUI DonutChart 的长期合同。修改前必须查询：

`npm run feedback:list -- --component donut-chart`

Props 与方法完整表以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

DonutChart 用于表达一组非负数值的组成、占比与总量，不用于展示时间趋势、精确坐标或可点击筛选。结构固定为透明根、Canvas 2D 图形区、可选中心读数和可选图例；无有效正值时只显示“暂无数据”。

## 2. 数据与视觉

- `items` 项包含稳定 `key / label / value / theme`。负数、非有限数规整为 0；重复 key 只在组件内部稳定去重。
- 多段圆环共用总量，`gapAngle` 只消耗可绘制角度，不能改变比例；单段圆环不人为加入断口。
- 原生端使用 Canvas 2D；弧段从低透明度渐进到强调色，并在终点保留实色圆点。H5 使用同一归一化与弧段几何的 SVG。
- 根是 `display-leaf`，始终透明、无边框、无外阴影、无毛玻璃、无 Surface 圆角或等距资格。图例微间距不是 Surface 间距。

## 3. 主题、动效与可访问性

颜色只读取 `--pui-chart-accent-*` 与 `--pui-chart-track`；空 `colorScheme` 必须继承 ConfigProvider，不能回退强制浅色。`animated=true` 默认 500ms，范围 0–1000ms；`reduceMotion` 压缩为 1ms。`replay()` 只重播旋转缩放淡入，不改写数据。

根使用 `role="img"` 与完整 `ariaLabel` 摘要；Canvas、图例和探针不重复进入读屏。中心文本允许换行，不能用超小字号塞入长内容。

## 4. H5 与响应式

标准预览使用 `shadow-safe` 父布局，但安全区只属于 PreviewDevice，不能转化为组件 margin。small/medium/large 在 H5 镜像 120/160/200px，小程序为 240/320/400rpx；390px 下图形不得横向溢出。深浅色必须使用同名 Token。

## 5. 明确禁止与修改闭环

- 禁止把 DonutChart 变成交互式筛选器、Tooltip 容器或业务加载/错误状态机。
- 禁止在 H5 用静态截图、另一套比例或固定浅色配色冒充镜像。
- 禁止因全局阴影、毛玻璃、大圆角、边框或等距开关给图表根增加 Surface。

修改需同步源码、数据工具、H5 SVG、元数据、独立页、API 文档、Ledger、专项测试、`miniprogram_dist`、本地安装，并验证 390px、light/dark、动效/低动效。
