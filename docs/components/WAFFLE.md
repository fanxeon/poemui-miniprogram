# Waffle 组件合同

## 1. 组件定位与公开边界

Waffle 用圆润点阵表达总量、占比与新增单元。它是透明的只读展示叶子，不请求数据、不管理业务状态、不提供点阵点击或 Tooltip，也不自带 Card/Surface。调用路径为 `poemui-miniprogram/waffle/waffle`。

组件使用 WXML `view` 与 CSS Grid，不使用 Canvas、图片或图表插件。

## 2. 数据结构

`items` 与 BarChart 共用 `ChartItem[]` 和 `common/utils/chart-data.js`。仅接受非负有限值，主题白名单为 `neutral/violet/blue/teal/pink/amber`。颜色必须与可见 label、数值和图例共同表达含义。

## 3. Props

公开 13 个 Props：

- `items: ChartItem[] = []`
- `columns: number = 10`，规整到 4–12
- `groupColumns: number = 0`，`0` 表示不额外分组；正值在同一行内每隔 N 格增加组边界间距，不改变列数和数量
- `shape: 'rounded' | 'circle' | 'square' = 'rounded'`
- `size: 'small' | 'medium' | 'large' = 'medium'`
- `unit: number = 1`
- `maxCells: number = 100`，规整到 1–200
- `showValue: boolean = true`
- `showLegend: boolean = true`
- `animated: boolean = true`
- `duration: number = 500`，运行时限制 `0–1000ms`
- `ariaLabel: string = '组件点阵图'`
- `reduceMotion: boolean = false`

没有 Events 或 Slots。公开 `replay(): void`，只重播当前点阵入场，不改变数量、分段、`effectiveUnit` 或主题。

## 4. 数量、缩放与渐变

- 单元数按 `ceil(value/effectiveUnit)` 计算。
- 当总量超过 `maxCells` 时，`effectiveUnit = max(unit, ceil(total/maxCells))`；组件必须显示“1 格 = N”，禁止静默缩放。该说明独立于 `showValue`，关闭逐项数值也不能隐藏缩放事实。
- 每个 segment 使用实体色到半透明色的圆润单元渐变，并从目标 opacity `1` 逐步衰减到最低 `0.28`；新 segment 重新从实体色和 opacity `1` 开始。
- 低透明单元保留 `--pui-chart-fade-outline` 内描边，确保浅色、深色与渐变背景可辨认。
- `small/medium/large` 为 20/24/28rpx。`circle` 永远为圆，`square` 永远无圆角；`rounded` 消费 `--pui-chart-cell-radius`，普通 8rpx、大圆角 12rpx。
- `animated=true` 默认让单元按视觉顺序上移缩放淡入，每格 14ms、总延迟最多 224ms；关闭动画立即显示目标透明度。`duration` 默认 500ms，`reduceMotion=true` 为 1ms 且移除 delay。
- H5 重播必须先用 `is-replay-reset` 关闭点阵复位方向的 transition，将每格完整提交到 `opacity:0 / translateY(3px) / scale(.76)`，再跨帧恢复 transition 与级联 delay；不能只让 500ms 反向过渡运行约两帧就折返。

## 5. 外观资格

Waffle 为 `display-leaf`：`shadow=none / frostedGlass=false / bordered=false / equalSpacing=false`。`largeRadius` 只映射 `rounded` 单元的专用半径 Token，不能给根创建 Surface 或改变 circle/square。

## 6. H5 镜像与预览

H5 使用同名 Props、相同有效单位、单元渐变、透明度、轮廓、默认级联入场、`replay()` 和 500ms/1ms 动效，并进入标准 PreviewDevice `shadow-safe` 布局。概览必须包含正常总量与超限缩放两个真实 DOM 场景。

正常总量示例必须由父级在 `32` 格初始态与 `86` 格高波动态之间真实切换，并在回写 `items` 后调用 `replay()`；两态保持相同 item/segment key，使数量增长、分段边界和级联入场同时可见。旧的“新增 +1”在 10 列点阵中感知过弱，禁止恢复。该运行态不进入公开 Props 或复制 WXML；超限缩放示例继续独立证明 `effectiveUnit`。

## 7. 验收

专项测试必须覆盖：非法/零值、unit、maxCells、缩放提示、4–12 列、三种形状、三种尺寸、主题回退、每 segment 透明度重启、最低轮廓、默认动画/关闭/`replay()`/500ms/1ms、空数据、可访问摘要、零 Events/Slots、透明 Surface 资格、小程序/H5/发布产物一致性。微信真机未实测时保持 `pending-device`。

## 8. 明确禁止

- 禁止让最低透明单元完全消失，或在超限时静默改变每格单位。
- 禁止只靠颜色表达已有/新增，也禁止把每格改成可点击业务控件。
- 禁止给组件根增加 Card、阴影、毛玻璃、边框或等距 Surface。
- 禁止用 Canvas、图片或写死点阵替代 `items` 的真实数据渲染。
- 禁止用单格 `+1` 证明点阵变化动画；演示前后至少跨越多行，并保留文字总量与分段图例，不能只靠新增颜色判断变化。

## 9. 修改闭环

修改前运行 `npm run feedback:list -- --component waffle` 并阅读原始记录；实现后同步小程序、H5、metadata、合同、Ledger、专项测试、`miniprogram_dist` 与示例安装，依次运行 `npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check` 和 `npm run example:install`。真机未验不得标记为真机通过。

`replay()` 必须先提交 `entered=false`，再跨帧提交 `entered=true`；H5 必须通过无 transition 的 `is-replay-reset` 完整提交点阵初始帧，再重加完成类，保证点阵重播可见。
