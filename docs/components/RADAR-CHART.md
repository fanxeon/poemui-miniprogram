# RadarChart 组件语义合同

本文是 PoemUI RadarChart 的长期合同。修改前必须查询：

`npm run feedback:list -- --component radar-chart`

Props 与方法完整表以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

RadarChart 用于比较 3–8 个明确维度上的 1–4 组数据，不用于时间趋势、排名或精确表格阅读。`indicators` 必须给出稳定 key、label 与正 `max`；非法 max 回退 100。每个系列的值按相应维度规整到 `[0,max]`，缺失项为 0。少于三维或没有系列时显示明确空状态。

## 2. 固定结构与视觉

结构为透明根、Canvas 2D 图形区、隐藏颜色探针和可选图例。网格与轴线读取低对比 `--pui-chart-grid-line`；数据面从中心低透明度渐进至边缘，实色轮廓和可选端点保持辨认。原生端 Canvas 与 H5 SVG 必须消费同一归一化、角度和半径合同。

RadarChart 是 `display-leaf`：无边框、外阴影、毛玻璃、Surface 圆角或等距资格。全局外观只能通过主题 Token 和低动效改变视觉，不得增加容器。

## 3. 动效、可访问性与 H5

默认从中心缩放淡入 500ms，范围 0–1000ms；`reduceMotion` 为 1ms，`replay()` 不改写维度或系列。根使用 `role="img"` 和包括系列、维度及值的语义摘要，Canvas 与图例对读屏隐藏。

H5 使用 SVG polygon/line/circle 与主题渐变，保持同一 2–8 级网格、端点和数据范围。标准预览使用 `shadow-safe`；small/medium/large 对应 140/180/220px 与 280/360/440rpx。390px 下标签不得造成横向滚动。

## 4. 明确禁止与修改闭环

- 禁止自动改写各系列 max 以制造更夸张的图形。
- 禁止让 Tooltip、点击筛选、请求状态或图例选择侵入基础组件。
- 禁止 H5 与小程序采用不同数据结构或强制浅色。

修改需同步数据工具、原生组件、H5、独立页、元数据、API、Ledger、专项测试、产物与本地安装，并验证主题、390px、默认/低动效。
