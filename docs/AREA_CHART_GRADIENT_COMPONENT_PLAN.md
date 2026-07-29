# AreaChart 与图表动效统一实施计划

> 日期：2026-07-28
> 目标版本：`0.1.2`
> 范围：AreaChart、BarChart、Waffle，小程序/H5、独立页、发布目录、合同、Ledger 与公告

## 目标

1. 新增真实 AreaChart：小程序 Canvas 2D、H5 SVG，共享数据与 Token，支持 natural/linear/step、叠加/堆叠、Grid/XAxis/Legend/Dots。
2. 将 shadcn Area Chart 的“实体描边 + 竖向渐变到透明”原则转译到 PUI Chart Token，不复制 React/Recharts/Card/Tooltip。
3. BarChart 条形、Waffle 单元和 AreaChart 面积统一使用精选 Chart Accent 与渐变语义。
4. 三组件统一公开 `animated=true`、`duration=500` 和 `replay()`；关闭动画直接显示完成态，低动效压缩到 1ms。
5. 把 `0.1.2` 增量从 BarChart/Waffle 两项扩展为 AreaChart/BarChart/Waffle 三项：`71 → 74`，高级分类 `5 → 8`。

## 动效合同

| 组件 | 默认入场 | 级联 | replay |
| --- | --- | --- | --- |
| AreaChart | 面积淡入上移归位；H5 描边从起点展开 | 系列 70ms，上限 210ms | 重播图形，不改数据 |
| BarChart | 从共享零基线伸展并由低透明转实体 | 分类/分段，上限 225ms | 重播条形，不改比例 |
| Waffle | 单元轻微上移缩放并恢复目标透明度 | 每格 14ms，上限 224ms | 重播点阵，不改数量/单位 |

`duration` 统一限制 `0–1000ms`。`reduceMotion=true` 时所有 transition 为 `1ms`、delay 为 `0ms`。入场仅表达组件出现，不代表请求完成或业务成功。

## 实现与验收

- 组件源码和 `common/utils/area-chart-data.js` 为小程序真相源；metadata 生成 H5 API、目录和发布状态。
- 新增 AreaChart 独立页，并在三图表页用真实 PUI Button 调用 `replay()`。
- 更新 appearance matrix：三者都是透明 `display-leaf`，不得获得 Surface 阴影、毛玻璃、边框或等距。
- 新增/更新三份组件合同、UI/H5/高级页规则、Ledger 与更新公告。
- 专项验证数据几何、默认动画/关闭/重播/低动效、浅深色和 390px；随后运行站点构建、完整检查、打包、示例安装和微信 DevTools build-npm。
- 微信真机未实际验证时保留 `pending-device`，不得用 H5、模拟器或构建成功替代。

## 2026-07-28 执行结果

- AreaChart 原生四件套、共享几何 helper、H5 SVG、独立页、metadata、合同、Ledger、
  专项测试与 `miniprogram_dist` 已完成；BarChart/Waffle 同步使用渐变 Token 和统一入场
  API。当前目录为 74 个可安装组件，H5 目录 80 条，小程序 Search 79 条。
- H5 真实 `390×844` 验证 AreaChart 的 2 个 area、2 条实体 line、2 组
  linearGradient、5%/95% stop 与 6 个横轴标签；深浅色实际使用各自 Blue/Teal Token，
  三图表根均透明、无阴影、无 filter，页面与 PreviewDevice 横向溢出为 0，日志为空。
- H5 重播读取到 Area opacity/dash 的中间值；Bar 首尾条同帧 scaleX 分别为
  `0.867835 / 0.618629`；Waffle 首末单元同帧 scale 分别为
  `0.965603 / 0.760885`，最后单元最终 opacity 为 `0.28`。这些结果证明重播和有限级联
  真实运行，不只是声明 CSS。
- 微信开发者工具复用现有实例，标准 `build-npm` 最终为 `872ms / warnings=[]`。
  `390×844 / DPR 3` 的 AreaChart 实例真实回读 2 个系列、6 个标签、
  `animated=true / duration=500`；Area、Bar、Waffle 的 `replay()` 均经历
  `entered=false → true`。AreaChart 截图为
  `/tmp/poemui-area-chart-miniprogram-390.png`。
- 三组件四件套与共享 `chart-data / area-chart-data / theme` 在 source、dist、示例安装、
  真实消费 node_modules 和微信 `miniprogram_npm` 五路逐字节一致。`site:build`、
  专项测试、`pack:check`、`example:install`、`feedback:generate/check` 与
  `git diff --check` 通过；微信 npm 验收所用本地 tar SHA-256 为
  `df982762444f2a6c313c78cf864c3150542c7abc5e75febb3fff26cf3ea3c819`。
- 完整 `npm run check` 的图表、目录、页面、外观和全局动效范围均通过，最终仍被既有
  H5 Search `search-clear` 私有原生按钮设计门禁阻断。该基线不属于本计划；iOS/Android
  真机、读屏和系统级低动效切换继续未验证。
