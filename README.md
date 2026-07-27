# PoemUI MiniProgram

PoemUI 是面向微信小程序原生开发的 UI 组件库，目标是通过 npm 安装、按需引入组件，并内置深浅色主题能力。工程结构和使用方式对标 `tdesign-miniprogram`：开发者安装包后，在页面 JSON 的 `usingComponents` 中指向包内组件路径。

> **受限 Beta / 发布状态（2026-07-28）**
> 当前公开版本为 `poemui-miniprogram@0.1.0`，源码位于
> [fanxeon/poemui-miniprogram](https://github.com/fanxeon/poemui-miniprogram)。
> 本地 tarball、构建成功或代码中的包名仍不能替代 Registry 回读和微信
> `build-npm`；完整稳定性与授权边界见 [受限 Beta 公告](docs/PUBLIC_BETA_NOTICE.md)。

参与组件、预览或设计规范开发前，请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)；AI 代理还必须遵守根目录 [AGENTS.md](AGENTS.md)。布局、组件复用与交互规则由 `npm run check` 自动验证。

## 安装

固定版本安装：

```bash
npm i poemui-miniprogram@0.1.0 -S --production
```

安装后在微信开发者工具中执行：

1. 工具 -> 构建 npm
2. 勾选“将 JS 编译成 ES5”
3. 在页面或全局 JSON 中引入组件

```json
{
  "usingComponents": {
    "pui-config-provider": "poemui-miniprogram/config-provider/config-provider",
    "pui-button": "poemui-miniprogram/button/button",
    "pui-cell": "poemui-miniprogram/cell/cell",
    "pui-tag": "poemui-miniprogram/tag/tag",
    "pui-input": "poemui-miniprogram/input/input",
    "pui-dialog": "poemui-miniprogram/dialog/dialog",
    "pui-direction": "poemui-miniprogram/direction/direction"
  }
}
```

主题 Token 必须在**应用级** `app.wxss` 引入一次；不要从任意组件的 `.wxss` 再导入。该入口含 `page` 默认 Token，微信只允许它出现在全局样式中：

```css
/* app.wxss */
@import "poemui-miniprogram/theme/utilities.wxss";
```

```xml
<pui-config-provider theme="dark">
  <pui-cell title="主题模式" description="跟随外层深色 token" clickable />
  <pui-button theme="primary" block>确认</pui-button>
</pui-config-provider>
```

## 主题模式

组件默认使用浅色主题 token。需要切换深浅色时，优先使用 `pui-config-provider` 包裹业务区域：

```xml
<pui-config-provider theme="auto">
  <pui-button theme="primary">跟随系统</pui-button>
</pui-config-provider>
```

`theme` 支持：

- `light`：浅色
- `dark`：深色
- `auto`：读取微信系统主题，系统切换时自动更新

PoemUI 的组件主视觉由 5 个布尔开关控制：

- `shadow`：控制阴影和发光
- `frosted-glass`：控制毛玻璃模糊，即 `backdrop-filter`
- `large-radius`：控制是否使用大圆角体系
- `bordered`：控制中性 Surface 与分割线边界；关闭时保留盒模型以及焦点、错误、选中等语义边界
- `equal-spacing`：仅让独立 Surface 的四向 inset、直接结构块 gap 和主要分区 gap 相等；不污染连续列表和控件内部微间距

`shadow` 与 `large-radius` 默认开启，`frosted-glass` 与 `equal-spacing` 默认关闭，`bordered` 默认关闭；首次恢复和 `visualConfig.reset()` 都使用这组大圆角、阴影、无中性边框的基线。已保存的本地偏好会优先恢复，不会因版本更新被静默改写。这些开关彼此独立。

如果某个组件没有被 provider 包裹，也可以直接传入 `color-scheme`：

```xml
<pui-button theme="primary" color-scheme="dark">深色按钮</pui-button>
```

## 视觉风格

PoemUI 默认采用黑白品牌主色、清晰边界和紧凑圆角。四个组件视觉开关可以通过 `ConfigProvider` 独立控制：

```xml
<pui-config-provider
  theme="light"
  shadow="{{false}}"
  frosted-glass="{{false}}"
  large-radius="{{true}}"
  bordered="{{true}}"
  equal-spacing="{{false}}"
>
  <pui-button theme="primary">关闭阴影和毛玻璃</pui-button>
</pui-config-provider>
```

### 安装端全局视觉配置

微信小程序没有跨页面的全局 WXML 根节点。需要一键同步整个小程序时，在每个页面根使用一次 `use-global-config`，视觉状态只维护在安装包公开的 `visualConfig` Store 中：

```js
// app.js
const { visualConfig } = require('poemui-miniprogram');

App({
  onLaunch() {
    const result = visualConfig.restore();
    if (result.error) console.error('PoemUI 视觉配置恢复失败', result.error);
  },
});

// 设置页：所有已挂载的 Provider 会同步更新
visualConfig.set({ theme: 'auto', bordered: true });
visualConfig.applyPreset('soft'); // standard / soft / glass
visualConfig.setEffectsEnabled(false); // 暂停装饰效果，不删除单项选择
```

```xml
<!-- 每个 page.wxml 的根 -->
<pui-config-provider use-global-config>
  <view class="page">...</view>
</pui-config-provider>
```

`visualConfig.set()`、`applyPreset()`、`setEffectsEnabled()` 和 `reset()` 都返回 `{ config, changed, persisted, error }`，业务可以真实处理存储失败。`effectsEnabled=false` 只暂停阴影、毛玻璃和大圆角；主题、组件边框与 `equalSpacing` 保持独立，重新开启后恢复此前的单项选择。全局渐变开关只控制消费者页面背景，不会通过 Provider 扩散到 Button、Tag、Dialog 等组件 Surface；独立 `pui-bg-gradient-*` 则可显式挂在业务 View 或容器。

## 组件范围

当前 npm 包内包含 `71` 个可按需引入的小程序组件目录，分为明确的发布层级：

- `done`：API 与主要交互稳定，具有独立 WXML、WXSS、JS 实现、可传参数、事件与官网交互预览。
- `beta`：具有真实原生实现与受控发布边界，升级时仍可能出现非破坏性调整。

完整名单、当前状态和 Props 以自动生成的 [组件目录](./docs/COMPONENT_CATALOG.md) 为准。

`TopLoading`、`DynamicMessage`、`PullRefresh`、`VirtualList`、`Sticky`、`Watermark` 已完成独立原生实现与官网调参预览，分别覆盖卡片顶边请求进度、顶部非模态灵动通知、刷新状态机、固定行高窗口化渲染、WXSS 吸顶与按真实尺寸铺排的图文水印层。正式业务只应使用 `done` 和 `beta` 组件。PoemUI 参考 shadcn 的目录与组合思路，但不会承诺和 Web 实现逐项同构。

Icon 内置 17 类、220 个 `PoemUI Roundline` 单色 SVG 设计真相源；其中 219 个以锁定版 Lucide 为构形来源，用户自有的 `poemcoder-mark` 以登记的闭合轮廓进入同一生成链。`premium` 是映射既有 Lucide `crown` 的稳定公开语义名；`components / 组件` 分类收录 14 个确有辨识冲突、需要专属几何的图形，其余组件目录优先复用已有通用图标或锁定版 Lucide 直接来源。生成链路将圆线或登记实心轮廓转换为稳定私有码点和本地嵌入 WOFF2；H5 与小程序全部 `pui-icon name` 都使用同一 Icon Font 和 `currentColor`，支持 PUI CSS Token，不依赖远程字体、inline SVG、SVG image、CSS mask 或 Canvas。业务图片统一使用 `pui-image`。许可与归属见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)，生成规则见 [docs/ICONS.md](./docs/ICONS.md)。

`pui-alert` 支持受控/非受控显隐、关闭回写、主题图标、默认 slot、`input`/`change`/`open`/`close` 事件与 `0–500ms` 退场动画；关闭不会再直接移除节点。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-aspect-ratio` 以 WXSS 百分比占位实现稳定比例，默认 slot 可组合 `Icon`、`Tag` 等内部组件；比例变化只过渡 `padding-top`，支持边框、圆角、背景、溢出策略、`0–500ms` 动画和低动效，避免将浏览器 `aspect-ratio` 当成小程序依赖。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-button-group` 默认全宽地排列多个 `pui-button`：它统一尺寸、分隔线、外形、集合根阴影和组级禁用遮罩，不伪造选择或 `change` 事件；业务应直接监听各子 Button 的 `click`。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-button` 以微信原生 `button` 为根节点，提供三类主题、五种变体/尺寸/形状、Icon/Loading、默认/icon/suffix slot、表单动作、完整 open-type 参数与平台事件转发；loading/disabled 会真实禁用并清空 open-type/form-type，H5 不伪造授权、分享或手机号结果。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-scroll-area` 对齐 TDesign `ScrollView`：在固定高度内提供原生纵向增强滚动与 `scrollIntoView` 目标定位，默认 slot 承载内容；边框、内距、横向滚动、坐标、阈值与事件继续由业务直接使用原生 `scroll-view` 表达。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-date-time-picker` 直接组合 PUI Picker，提供年到秒精度、动态月末与闰年、范围、步长、格式、值与显隐双受控、Popup/内联、确认/取消和低动效；可视月历与范围面板继续由 `Calendar + Popover` 组合。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-card` 支持 header/content/footer 具名 slot、`showHeader`、统一分区内距、可点击/禁用边界与低动效；Card `click` 和 footer 内子 Button 的 `click` 保持独立，不会互相伪造。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-divider` 提供横竖线、对齐、虚线、语义标签和 `showContent` 默认 slot；它可与 `Tag`、`Icon` 等内部组件组合，并在窄屏安全截断长文字。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-badge` 提供数字、文字、红点、上限、零值、安全颜色和状态语义，默认 slot 可组合 `Icon` 等组件；它只展示状态，不伪造计数操作。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-bubble` 提供七种消息表面、起止对齐、连续圆角、回应、受控展开、内容/回应 slot 和真实触摸/显隐事件；它只负责消息表面，不伪造发送、已读、会话或 AI 传输状态。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-checkbox` 提供受控/非受控选中与半选、mark/content 分区点击、三档尺寸与左右位置、内部 Icon/Loading、标签说明、icon/content/default slot、只读/加载/错误边界和 `click/input/change`；多个单项可以自由组合，但不会伪造尚未交付的 CheckboxGroup。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-collapsible` 是单触发器/单内容区的折叠原语，提供受控/非受控 `open`、trigger/default slot、内部 Icon/Loading/Empty、完整状态、真实 retry、selector query 高度动画、`after-open/after-close` 和五个实例方法；多面板编排继续由 `pui-collapse` 承担。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-combobox` 是独立可搜索组合输入，不复用 picker Select：支持 value/query/visible 三重受控、单选/多选、分组、创建、Tag 移除、上限、三类 slot、完整状态/事件/方法和 selector query 高度动画；retry、创建与 footer 操作均不伪造业务成功。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-avatar` 支持 `src/image` 图片、Icon/文本/默认 slot 回退，以及真实 `load`、`error`、`click` 事件；图片加载淡入、失败回退或淡出隐藏均受 0–500ms 低动效契约约束。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-image` 以原生资源生命周期提供 loading、loaded、error 和 empty，过滤 width/height 内联样式，支持覆盖 slot、长按菜单、真实 `load` / `error` / `click` 及低动效；H5 预览不再用手工切换伪造图片状态。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-grid` 是真实快捷入口：它支持固定列与横向滚动、内部 Button/Icon/Badge/Loading/Empty、error/loading/content/empty 以及 `click/retry`，但不伪造 selected 或请求成功。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md) 与 [GRID.md](./docs/components/GRID.md)。

`pui-select` 以小程序原生 `picker` 完成单选：受控值只请求父级回写，支持空选项、取消、只读、禁用项边界、语义和低动效；H5 预览不保留独立的伪选中值。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-picker` 以原生 `picker-view` 提供单列、多列与级联滚轮，支持 value/visible 双受控、草稿确认、Popup/内联、禁用项、loading/error/empty、真实 retry 和固定低动效；滚动不直接提交，取消不修改已提交值。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md) 与 [PICKER.md](./docs/components/PICKER.md)。

`pui-rate` 通过 PUI Icon 提供点击与连续拖动评分，支持整星/半星、受控值、文案、尺寸/间距和只读状态；公开事件仅 `change`，不内置业务提交或结果状态。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md) 与 [RATE.md](./docs/components/RATE.md)。

`pui-collapse` 作为 Accordion / 多面板折叠的原生实现，支持原始类型值、受控/非受控展开、单开、多开、内部 Loading/Empty/Button 状态、真实重试、低动效和 `header` / `footer` 插槽组合；动画通过小程序测量内容高度完成，不使用 `height:auto` 或条件渲染瞬移。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-swipe-cell` 是列表项的左右滑动操作容器：公开 `disabled/left/opened/right`，以 default/left/right Slot 组合内容，数组操作使用 PUI Button 并只发布 `click/dragstart/dragend`；固定 500ms 吸附可由低动效压缩为 1ms，不承载业务成功或根级状态。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md) 与 [SWIPE-CELL.md](./docs/components/SWIPE-CELL.md)。

`pui-count-down` 使用目标时间校正定时器漂移，支持 DD/HH/mm/ss/SSS、总小时/分钟/秒、声明式暂停、毫秒刷新、default/round/square、默认 Slot、change/finish 和 start/pause/reset/getTime。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md) 与 [CountDown 语义合同](./docs/components/COUNTDOWN.md)。

`pui-table` 提供真实横纵滚动、sticky 表头与左右固定列、原始类型行键、受控/非受控 Checkbox 选择和稳定排序，组合 Tag/Icon/Loading/Empty/Button，只保留必要的 empty Slot、7 个事件与 9 个方法；空数据不会生成演示行，固定列不会遮掉条纹或选中背景，固定 500ms 动效可由 reduceMotion 压缩为 1ms。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-calendar` 提供严格日期解析、单选/范围/多选、值与显隐双受控、行内/完整视口弹层、日期边界、外月/周末/指定日期禁用、选择上限、集中本地文案、内部 Button/Loading/Empty、7 个真实事件和固定 500ms/1ms 动效；不公开 Slot 或实例方法，limit 与 retry 不伪造业务结果。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md) 与 [CALENDAR.md](./docs/components/CALENDAR.md)。

`pui-popup` 提供受控/非受控显隐、top/bottom/left/right/center 五向进退场、内部 Button/Loading/Empty、header/default/footer 与标题操作 slot、error > loading > content > empty、提交保护、遮罩/重试/动画完成事件和 0–500ms 低动效；关闭会保留节点完成退场，retry 与 submit 不伪造业务成功。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-popover` 是相对默认 Slot 触发元素定位的非模态气泡层，支持受控/非受控显隐、12 向定位、六种主题、箭头、外部点击关闭、default/content Slot、fixed 测量与 500ms/低动效；业务 Loading、Empty、错误、重试和操作由消费者组合。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

`pui-dialog` 是唯一的 Dialog 对话框入口：提供 40 个真实 Props，支持受控/非受控显隐、默认/数组/slot 动作、Header/Content/Footer 三区、header-left/title/content/actions 四类组合、loading/error/empty、完整进退场事件和 `0–500ms` 动画；`confirmLoading` 会锁定用户退出以防重复操作。Props、事件与方法见 [COMPONENT_API.md](./docs/COMPONENT_API.md)，不可破坏的结构与设计规则见 [Dialog 组件语义合同](./docs/components/DIALOG.md)。所有组件合同的建立与迁移规则见 [组件语义合同索引](./docs/components/README.md)，新 Agent 可使用 [新会话启动提示词](./docs/NEW_SESSION_PROMPT.md)。

`pui-direction` 是真实的子树阅读方向 Provider：支持 ltr/rtl/auto、显式/系统语言解析、fallback、逻辑文本对齐、四种容器形态、slot/content、完整解析生命周期与实例方法；它不会假装自动迁移旧物理 left/right 样式或翻转方向性图标。完整契约见 [COMPONENT_API.md](./docs/COMPONENT_API.md)。

完整组件规划见 [docs/COMPONENT_MATRIX.md](./docs/COMPONENT_MATRIX.md)，与 shadcn 目录的逐项映射、原生交互替代和限制见 [docs/SHADCN_COMPATIBILITY.md](./docs/SHADCN_COMPATIBILITY.md)，当前 npm 组件与公开 Props 见自动生成的 [docs/COMPONENT_CATALOG.md](./docs/COMPONENT_CATALOG.md)，API 规范见 [docs/COMPONENT_API.md](./docs/COMPONENT_API.md)。

## 快速样式集

PoemUI 提供面向微信小程序的 utility-first 快速样式层，覆盖 display、flex、1–6 列 grid、正向 spacing、尺寸、定位、溢出、字体、颜色、边框、圆角、阴影、可直接用于 View/容器的主题感知背景渐变、安全区和轻量 transition：

```css
@import "poemui-miniprogram/theme/utilities.wxss";
```

当前包含 562 个选择器、32 个精选色彩 utility 和 32 个 `pui-dark-*` 条件变体；精选色覆盖 red/orange/amber/emerald/teal/blue/violet/pink 的文字、实色背景、柔和背景和边框，并提供 `pui-bg-gradient-neutral/flowing-gold-pink/premium-black/cement-white/black-gold/light-gold/ai-mist-blue-violet/cyber-pink-blue/aurora-violet` 九个主题感知背景渐变，可直接挂在业务 View 或布局容器。尺寸阶梯为 `xxs`、`xs`、`sm`、`normal`、`lg`、`xl`、`xxl`、`3xl`。默认颜色类跟随 ConfigProvider Token，dark 变体只在深色主题范围内覆盖默认类。不提供任意值、运行时 JIT 或负间距，详细清单与平台边界见 [docs/STYLE_UTILITIES.md](./docs/STYLE_UTILITIES.md)。

## H5 预览站

本仓库提供可独立部署的静态 H5 官网，用于组件浏览、视觉验收和 API 讨论：

```bash
npm run site:build
npm run site:dev
```

然后访问 `http://127.0.0.1:4179/`。局域网调试可使用：

```bash
HOST=0.0.0.0 npm run site:dev
```

官网使用 hash 路由，因此静态托管无需服务器重写规则。Netlify 与 Vercel 配置已包含在仓库根目录；完整发布流程见 [docs/PUBLISH_AND_DEPLOY.md](./docs/PUBLISH_AND_DEPLOY.md)。

当前 H5 预览站覆盖完整组件规划清单，支持：

- 左侧组件目录搜索和分组浏览
- 每个组件独立预览页
- Props 参数实时调节
- WXML 引入代码生成
- 深浅色切换
- 阴影、毛玻璃、大圆角独立开关
- 设备尺寸预览
- Icon 图标库筛选
- H5 / WXML / WXSS 兼容说明

注意：H5 预览站不会直接复用 WXML。浏览器不支持 `rpx`、`wx:if`、`bindtap` 和小程序组件注册机制，预览站使用 `preview/styles.css` 维护镜像样式。详细规则见 [docs/H5_PREVIEW_COMPATIBILITY.md](./docs/H5_PREVIEW_COMPATIBILITY.md)。

## 开发校验

组件开发前必须查询 [问题与决策收集规范](./docs/COMPONENT_FEEDBACK.md) 和自动生成的 [Feedback Ledger](./docs/COMPONENT_FEEDBACK_LEDGER.md)。外部问题可使用 GitHub 的“PoemUI 组件问题与设计反馈”表单提交；可复现并具有长期价值的事实再进入结构化 Ledger。

```bash
npm run feedback:list -- --component button
npm run check
```

该命令会检查组件四件套文件、包入口、主题文件、官网生成物和公开 Props 与真实组件 `properties` 是否一致。发布前执行：

```bash
npm run prepublishOnly
```

它会重建官网目录、执行检查并进行 npm 打包预检，但不会执行 `npm publish`。
