# PoemUI 组件 API 规范

PoemUI 的运行时边界是 WXML、WXSS、`Component.properties` 和 `triggerEvent`。它借鉴 shadcn/ui 的目录和组合方式，但不把 Web 专属交互伪装为微信小程序能力。

自动生成的 [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) 是属性名与 npm 引入路径的唯一清单；本文件说明 API 约定和目前已独立验收的组件行为。

## 发布层级

- `done`：API 与主要交互稳定，可用于生产。
- `beta`：具有独立原生实现、可传参属性、事件和官网调参预览；升级时仍可能出现非破坏性调整。
- `experimental`：仅保留目录和迁移入口，不是生产 API，不能据此文档推断能力。

组件状态以自动生成的 [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) 与 [COMPONENT_MATRIX.md](./COMPONENT_MATRIX.md) 为准。业务应只依赖 `done` 和 `beta`。

## 属性与事件约定

所有公开属性都以组件目录的 `properties` 为准。自定义样式逃生口为 `customClass`、`customStyle` 和 `colorScheme`；是否支持某个视觉属性不由名称猜测，必须以组件目录和目录页为准。

带 `value` / `visible` 的 beta 组件接受页面传值，并会在属性变化时同步。未传 `value` 或 `visible` 时可用 `defaultValue` / `defaultVisible` 初始化内部状态。`false`、`0` 和空字符串是合法值，不会被默认值覆盖。

事件使用小程序 `triggerEvent`：

| 事件 | `detail` |
| --- | --- |
| `input` / `change` | `{ value }`，选择类还会带 `checked` 或 `name` |
| `focus` / `blur` / `confirm` | 原生输入事件详情或当前输入值 |
| `open` / `close`、`show` / `hide` | `{ visible, source }`；来源如 `overlay`、`programmatic`、`tap`、`longpress`、`timeout` |
| `confirm` / `cancel` / `submit` | 由对应操作按钮触发 |

## Icon

`pui-icon` 是内置图标的唯一入口。`name` 对应 `assets/icons-src/manifest.json` 中的 220 个稳定 PoemUI 名称；其中 `components / 组件` 分类收录 14 个需要专属几何的组件图形，`abstract / 抽象` 收录用户自有的 `poemcoder-mark`，`premium` 是映射既有 Lucide `crown` 的公开语义名，其余组件目录优先复用已有通用图标。H5 与小程序都把 `name` 解析为同一份本地 Icon Font 字形，不存在 SVG、image、CSS mask 或 Canvas 运行时分支。业务图片必须使用 `pui-image`。Icon 是没有内容 slot 的展示叶子，适合被 `Button`、`Cell`、`Tag`、`Popup` 等组件组合。需要点击、禁用、选中或键盘操作时必须使用 `Button + Icon`，Icon 本身不伪装成不完整的交互控件。

官网图标资源库的每个资源卡是 PUI Button：点击后会回写当前 `name`，并通过真实剪贴板能力复制该图标名；复制结果复用 Toast 的 success/error 短暂提示。这不为 `pui-icon` 增加 `click` 事件。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `name` | `String` / `''` | 内置图标名；未知名称触发 `error` 并显示首字符回退。 |
| `size` | `Number` / `44` | 图标尺寸，单位 rpx；运行时限制在 8–256。 |
| `color` | `String` / `''` | 通过 Icon Font `currentColor` 支持安全 HEX、RGB(A)、HSL(A)、命名色与 `var(--pui-*)`；为空时继承深浅色主题正文色。 |
| `ariaLabel` | `String` / `''` | 独立语义图标的可访问名称；为空时按装饰图标处理并设置 `aria-hidden`，不会重复朗读父组件文字。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `load` | `{ name, source: "font" }` | name 解析到本地字体码点时触发一次。 |
| `error` | `{ name, error }` | 未知名称或字体映射缺失；组件显示首字符回退。 |

```xml
<pui-icon name="arrow-left" size="36" aria-label="返回" />
<pui-button icon="check-circle" bind:click="onConfirm">确认</pui-button>
```

小程序与 H5 都使用生成链路内嵌的同一份本地 WOFF2 字形，颜色由文字 `currentColor` 继承，因此 PUI Token、深浅色和实体颜色无需 Canvas 即可生效。SVG 文件只保留为字体生成和视觉审计真相源，不进入 `pui-icon` 运行时。

TDesign 1.15.3 的 Icon 公开 `name/color/prefix/size`、公共样式入口和 `click`，内置名称使用字体字形，图片 URL 使用 image 分支，`size` 接受多种 CSS 单位。PoemUI 只保留本地 Icon Font，固定 Number+rpx 尺寸，不公开 `prefix`、URL 或图片入口；同时按可访问性合同移除 Icon 自身 `click/disabled`，交互统一交给 Button。

## Cell

`pui-cell` 是统一 Field 行的只读形态，用于列表信息、入口和轻量选择。它与 `pui-field` 复用同一行级视觉内核，但保留 Cell 的导航、选择和媒体能力；Badge、Tag、Button 等复杂尾部内容通过 Slot 组合，不再把子组件主题、形状或加载文案重复暴露成 Cell Props。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `title` | `Any` / `''` | 主标题；`0` 和 `false` 会真实显示，title Slot 可在其后追加内容。 |
| `description` | `Any` / `''` | 标题下方的主要说明，支持自然换行。 |
| `value` | `Any` / `''` | 右侧辅助值；`0` 和 `false` 不以 falsy 判空。 |
| `note` | `Any` / `''` | 正文底部的次级补充信息。 |
| `image` | `String` / `''` | 左侧固定 `72rpx` 圆角缩略图，使用内部 Image 并转发真实 `load/error`。 |
| `leftIcon` / `rightIcon` | `Any` / `null` | 内部 Icon 名称；image 优先于 leftIcon，loading 时隐藏 rightIcon。 |
| `size` | `small \| medium \| large` / `medium` | 行高、内距和标题字号。 |
| `align` | `top \| middle \| bottom` / `middle` | 交叉轴对齐。 |
| `variant` | `default \| outline \| soft` / `default` | 默认、描边或弱背景表面。 |
| `bordered` / `hover` / `required` | `Boolean` / `true`、`false`、`false` | 底部分隔线、触摸反馈和必填星号。 |
| `arrow` | `Boolean` / `false` | 显示固定 chevron-right；自定义尾部使用 rightIcon 或 right Slot。 |
| `clickable` | `Boolean` / `false` | 启用根 click 与 button 语义；url 不会绕过该门禁。 |
| `selected` / `defaultSelected` | `Boolean \| null`、`Boolean` / `null`、`false` | selected 非 null 时受控并等待父级回写；非受控初值由 defaultSelected 提供。 |
| `selectable` / `allowUnselect` | `Boolean` / `false`、`true` | 启用 option 语义与选择图标；可限制已选项再次取消。 |
| `disabled` / `readonly` / `loading` | `Boolean` / `false` | disabled/loading 完全阻断；readonly 仍回传 blocked click，但不选择或导航。 |
| `url` | `String` / `''` | 交互门禁通过后调用真实微信导航 API 的目标地址。 |
| `jumpType` | `navigateTo \| redirectTo \| reLaunch \| switchTab` / `navigateTo` | 真实微信导航方式；不在 Cell 中承担 navigateBack。 |
| `ariaLabel` | `String` / `''` | 依次回退 title、description 和“单元格”。 |
| `duration` / `easing` / `reduceMotion` | `Number`、缓动枚举、`Boolean` / `500`、`standard`、`false` | 状态过渡限制 0–1000ms；低动效压缩为 1ms。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `click` | `{ value, selected, previousSelected, source, controlled, selectable, blocked, reason, url, jumpType }` | clickable/selectable 点按；readonly 仍回传 blocked，disabled/loading 不触发。 |
| `input` | 同 click 的选择详情 | 选择值改变时先触发；受控模式等待父级回写。 |
| `change` | 同 click 的选择详情 | 紧随 input，表示同一次选择请求。 |
| `load` / `error` | 内部 Image 详情加 `{ source: 'image', src }` | image 资源真实加载或失败。 |
| `navigate-success` / `navigate-fail` | 选择详情加 `{ status, result }` | 转发微信导航 API 的真实成功或失败回调，H5 不伪造。 |

| Slot | 说明 |
| --- | --- |
| `media` | 最左侧自定义媒体，与 image/leftIcon 显式并列。 |
| `title` / `description` / `value` / `note` | 在对应 Props 文本后追加组合内容。 |
| `default` | 正文末尾扩展内容。 |
| `right` | 最右侧独立操作；容器阻止根 Cell click，内部 Button 由消费者处理。 |

Cell 不公开业务实例方法。选择使用受控/非受控 Props，导航由点击触发；这避免 `select/toggle/navigate/getState` 与父级状态形成第二套写入通道。

基础用法：

```xml
<pui-cell title="单行标题" />
```

受控选择只绑定当前能力需要的事件：

```xml
<pui-cell
  title="可选择项目"
  selectable
  clickable
  selected="{{selected}}"
  bind:input="onCellInput"
/>
```

复杂尾部使用 PoemUI 组件组合：

```xml
<pui-cell title="安全检查" description="复杂状态通过 Slot 组合">
  <pui-tag slot="title" variant="outline">推荐</pui-tag>
  <pui-badge slot="value" count="2" standalone />
  <pui-button slot="right" size="small" variant="outline">检查</pui-button>
</pui-cell>
```

TDesign 1.15.3 公开 13 个 Cell Props、1 个 click 事件和 6 个内容 Slot。PoemUI 保留其 title/description/image/icon/align/arrow/bordered/hover/required/url/jumpType 主干，额外保留 value/note、三档尺寸与表面、受控选择、disabled/readonly/loading、可访问性和低动效；删除内部 Image/Badge 透传、Slot 显隐开关、navigateBack/delta、right-click、导航 start/complete 以及业务实例方法。

### 分组布局（CellGroup）

`pui-cell-group` 属于 Cell 体系的布局组件，不计入顶层组件目录或单独组件编号。它负责把多个 `pui-cell` 组织成一个有标题的语义分组；`card` 开启后由分组根统一提供圆角卡片、边界和连续行分隔，Cell 自身不再各自形成独立卡片。

引入路径：`poemui-miniprogram/cell/cell-group`。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `title` | `Any` / `''` | 分组标题，显示在 Cell 列表上方；`0` 和 `false` 会真实显示，也可由 title Slot 追加。 |
| `description` | `Any` / `''` | 标题下方的说明文字，支持自然换行。 |
| `card` | `Boolean` / `false` | 开启统一卡片 Surface、圆角和连续 Cell 布局；关闭时只提供分组与间距。 |
| `bordered` | `Boolean` / `true` | `card=true` 时控制卡片外边界；Cell 行内分隔仍由各 Cell 的 `bordered` 决定。 |
| `ariaLabel` | `String` / `''` | 分组辅助名称；为空时回退 `title` 或“单元格分组”。 |

| Slot | 说明 |
| --- | --- |
| `default` | 放置一个或多个 `pui-cell`。 |
| `title` / `description` | 在对应文本 Prop 后追加自定义内容。 |
| `header` | 在标题区追加其它说明或操作内容。 |

```xml
<pui-cell-group title="账号设置" description="修改后即时生效" card>
  <pui-cell title="通知设置" value="已开启" arrow />
  <pui-cell title="隐私设置" value="标准" arrow />
</pui-cell-group>
```

CellGroup 不处理 Cell 的 click、selected、loading 或业务状态；这些能力仍由组内 Cell 和父级真实回写承担。

H5 使用可聚焦的 `role=button/option/listitem`、真实图片事件和同一受控状态镜像；浏览器没有 `wx.navigateTo` 等 API，因此只保留参数和状态，不伪造 success。真实页面栈、tabBar 配置和导航失败原因仍需在目标小程序验证。

## Tag

`pui-tag` 用简短文字、可选 Icon 和语义外观标记属性、分类或状态。Tag 本体是展示节点；只有 `closable=true` 时出现组件自有 Close 根。需要点击、选中、加载或只读门禁时，应由外层 PUI Button、Cell 或专门的选择组件承担。

| 属性 | 类型 / 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- |
| `theme` | `String` / `default` | `default, primary, success, warning, danger` | 语义主题；非法值回退 `default`。 |
| `variant` | `String` / `light` | `light, outline, dark` | 轻背景、描边或实色变体；不改变展示型职责。 |
| `size` | `String` / `medium` | `small, medium, large` | 三档真实高度、内距和字号。 |
| `shape` | `String` / `square` | `square, round, mark` | 方圆角、胶囊或标记形；旧 `round` Boolean 已删除。 |
| `content` | `String` / `''` | — | 数据驱动字符串；普通静态文字优先使用默认 Slot。空字符串不回退成演示文案，字符串 `0` 会真实显示。 |
| `icon` | `String` / `''` | PoemUI Icon 名称 | 前置内部 Icon；不接受对象配置。 |
| `closable` | `Boolean` / `false` | `true, false` | 显示组件自有 Close 根；关闭只派发请求，不在组件内部隐藏标签。 |
| `disabled` | `Boolean` / `false` | `true, false` | 锁定 Close 并显示禁用外观；Tag 根没有 click 或选择状态。 |
| `maxWidth` | `String \| Number` / `''` | 非负 `px, rpx, %` 或数字 px | 安全最大宽度；非法、负数和注入式值忽略，文字省略时 Close 保持可见。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `close` | `{ source: 'close' }` | `closable=true` 且未禁用时由 Close 根触发一次；消费者应真实更新父级数据或显隐状态。 |

| Slot | 说明 |
| --- | --- |
| `default` | 普通静态文字或短组合内容；可与 `content` 并列，但不要重复传入同一文案。 |

基础用法不绑定事件：

```xml
<pui-tag>标签</pui-tag>
```

主题、形状和 Icon：

```xml
<pui-tag theme="success" variant="outline" icon="check-circle">已发布</pui-tag>
<pui-tag theme="warning" shape="round">待确认</pui-tag>
```

只有可关闭专项用法绑定 `close`；父级收到请求后真实移除对应数据：

```xml
<pui-tag
  wx:if="{{showDraftTag}}"
  theme="danger"
  closable
  bind:close="onDraftTagClose"
>草稿</pui-tag>
```

```js
Page({
  data: { showDraftTag: true },
  onDraftTagClose: function onDraftTagClose() {
    this.setData({ showDraftTag: false });
  },
});
```

Tag 不公开业务实例方法，也不发布根 `click`。相比 [TDesign 1.15.3 Tag](https://tdesign.tencent.com/miniprogram/components/tag) 的 8 Props、`click/close` 和多个内容入口，PoemUI 保留主题、变体、尺寸、形状、Icon、安全宽度与关闭主干，额外保留数据驱动 `content`；删除重复 `round`，不复制根 click、对象 Icon、extra-large、light-outline、关闭图标 Slot 或 external class。

H5 使用同样的 22/24/29px 三档尺寸、安全 maxWidth、28rpx/24rpx Close 几何和父级回写；Enter/Space 是浏览器键盘增强。微信真机的触摸反馈、rpx 取整、字体回流和读屏朗读仍需在合法 AppID 中复核。

## Accordion / Collapse

`pui-collapse` 是 Accordion / 多面板折叠的原生实现。它参考 TDesign Miniprogram 1.15.3 的 Collapse/CollapsePanel 主干，使用数组 `value/defaultValue`、`defaultExpandAll`、`expandMutex`、`expandIcon`、`default/card` 主题与单一 `change` 事件；PoemUI 以 `items` 和 `collapse-panel` Generic 适配安装包中的数据驱动组合。单触发器/单内容区由独立 `pui-collapsible` 承担。

内容节点始终保留，组件在渲染后测量像素高度并过渡 `max-height`、透明度与轻位移，不对 `height:auto` 动画，也不用 `display:none` 制造瞬移。状态优先级为 `error > loading > content > empty`，内部复用 PUI Empty、Loading 和 Button；Retry 只发布真实请求，不伪造恢复成功。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `items` | `Array` / `[]` | 每项支持 `{ label, value, description, note, icon, expandIcon, disabled, ariaLabel }`，并兼容 `header/content/headerLeftIcon/headerRightContent`。`value` 只接受 string、number、boolean，按类型和值去重。 |
| `value` | `Array \| null` / `null` | 数组表示受控展开值；点按只派发 `change`，父级回写前不改变。数字 `0`、布尔 `false`、空字符串和字符串 `"0"` 严格区分；非数组进入非受控模式。 |
| `defaultValue` | `Array \| null` / `null` | 非受控模式首次获得有效 items 时采用；支持异步迟到数据，初始化后不再覆盖用户操作。 |
| `theme` | `default \| card` / `default` | 连续分组或独立卡片结构主题。 |
| `disabled` | `Boolean` / `false` | 禁用全部面板和错误态重试；单项 `disabled` 只阻止自身。 |
| `expandIcon` | `Boolean` / `true` | 显示默认 PUI Icon 箭头；单项 `expandIcon=false` 可关闭自身箭头。 |
| `expandMutex` | `Boolean` / `false` | 只允许一项展开；受控与非受控值都会规整为首个有效条目。 |
| `defaultExpandAll` | `Boolean` / `false` | 非受控且没有数组 `defaultValue` 时，首次获得有效 items 后展开全部；互斥模式只展开第一项。 |
| `customPanel` | `Boolean` / `false` | 启用 `collapse-panel` Generic 接管每项内容；默认 Generic 为 PUI Cell。 |
| `loading` | `Boolean` / `false` | 以内部 PUI Loading 接管内容；错误态优先。 |
| `loadingText` | `String` / `加载中…` | Loading 的完整可见文案与辅助名称。 |
| `error` | `Boolean` / `false` | 以内部 PUI Empty 错误态接管内容；不会因 Retry 自动清除。 |
| `errorText` | `String` / `加载失败，请重试` | 错误态的完整可见文案与辅助名称。 |
| `retryText` | `String` / `重试` | 内部 PUI Button 文案；空字符串隐藏入口。 |
| `emptyText` | `String` / `暂无可展开内容` | 无有效 items 且非加载、错误时的 Empty 文案。 |
| `ariaLabel` | `String` / `折叠面板` | 根 group 的辅助名称；触发器同时暴露 expanded、disabled 和关联内容。 |
| `reduceMotion` | `Boolean` / `false` | 把固定 500ms 标准动效压缩为 1ms。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ value, item, index, expanded, source, controlled }` | 可用面板的展开值请求真实变化时触发；受控模式等待父级回写。 |
| `retry` | `{ source: 'retry', errorText }` | 错误态点按内部 PUI Button；组件保持错误态，直到父级真实更新。 |

Collapse 不公开业务实例方法，也不重复发布 `input/open/close`。数组 `value` 为受控模式；退出受控时从最后一次受控值继续。异步 items 首次从空数组变为有效数据时，非受控 `defaultValue/defaultExpandAll` 仍会正确初始化。

`collapse-panel` Generic 获得 `item/index/value/expanded/title/description/ariaLabel`；调用者可在组件 JSON 中映射业务面板，默认映射 PUI Cell。

```xml
<pui-collapse
  items="{{sections}}"
  value="{{expandedSections}}"
  expand-mutex
  bind:change="onCollapseChange"
/>
```

基础用法只需 `items`，不展示任何 `bind:*`；完整事件只在 API Events 与受控专项示例中出现。H5 预览使用同样的严格值、受控边界和状态优先级，并在浏览器中读取内容 `scrollHeight` 后更新像素 `max-height`。微信真机的 selector query 时序、rpx 取整、触摸反馈、Generic 安装映射和读屏朗读仍需在合法 AppID 中复核。

## SwipeCell

`pui-swipe-cell` 用于在列表项左右滑动后呈现操作。调用方负责默认内容和两侧 Slot；数组操作由内部 PUI Button 渲染。横向移动超过 10px 后才开始拖动，释放时越过对应操作区宽度的 30% 才展开；实时位移只显示同方向动作层，跨过零点时互斥切换，避免另一侧动作从容器边缘泄漏。轻点前景或数组操作后收起。它不承载 loading、empty、error、retry、业务成功或实例方法。

SwipeCell 有 6 个 Props、3 个 Events、3 个 Slots，没有公开 Methods。

| 属性 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `disabled` | `Boolean` | `false` | `true`, `false` | 禁用横向滑动和数组定义的操作；保留调用方的 Slot 内容与当前视觉状态。 |
| `left` | `SwipeActionItem[]` | `[{ text: '收藏', icon: 'star' }]` | `text`、`icon`、`className`、`style`、`onClick` | 向右滑动露出的数组操作；也可配合 `left` Slot 承载自定义操作。 |
| `opened` | `Boolean \| Boolean[]` | `false` | `true`、`false`、`[left, right]` | 初始或外部指定的展开态。Boolean 为 `true` 时优先右侧、右侧为空时左侧；数组分别指定左右，右侧优先。 |
| `right` | `SwipeActionItem[]` | `[{ text: '删除', icon: 'delete' }]` | `text`、`icon`、`className`、`style`、`onClick` | 向左滑动露出的数组操作；也可配合 `right` Slot 承载自定义操作。 |
| `ariaLabel` | `String` | `'待处理消息操作'` | 任意非空文字 | 根滑动区域的辅助名称，并同步展开和禁用状态。 |
| `reduceMotion` | `Boolean` | `false` | `true`, `false` | 将固定 500ms 的 `transform` 吸附过渡压缩为 1ms。 |

`SwipeActionItem` 的 `text`、`icon`、`className`、`style` 与 TDesign 对齐；`style` 内的 `width`（`rpx` 或 `px`）会同时决定该数组操作的显示宽度与 30% 展开阈值，未指定时为 136rpx。数组项点击通过 `click` 上抛原始对象。`onClick` 是调用方自身的数组字段，Slot 方案中的点击由 Slot 内业务组件自己处理。

| 事件 | 类型 | 说明 |
| --- | --- | --- |
| `click` | `{ action: SwipeActionItem, source: 'left' \| 'right' }` | 点击数组定义的操作项时触发；随后组件收起，但不将该动作解释为业务成功。 |
| `dragstart` | `无` | 横向移动首次超过 10px 时触发一次；纵向滚动不会触发。 |
| `dragend` | `无` | 横向拖动结束或取消时触发；展开态已经按 30% 阈值落定。 |

| Slot | 说明 |
| --- | --- |
| `default` | 前景内容，通常组合 `pui-cell`；SwipeCell 只负责位移和轻点收起。 |
| `left` | 左侧自定义操作，与 `left` 数组并列；内部交互由调用方负责。 |
| `right` | 右侧自定义操作，与 `right` 数组并列；内部交互由调用方负责。 |

基础用法只保留组件和内容，不绑定事件：

```xml
<pui-swipe-cell>
  <pui-cell title="待处理消息" description="左右滑动查看操作" left-icon="message" />
</pui-swipe-cell>
```

H5 用真实 Pointer Events 镜像小程序的 touchstart/touchmove/touchend/touchcancel，数组操作和拖动会分别派发同源 `click`、`dragstart`、`dragend` 浏览器事件；两端都只过渡 `transform`，拖动帧不使用 transition，`reduceMotion` 与系统低动效均为 1ms。

## Alert

`pui-alert` 用于页面内的非阻塞提示，内部使用 `Icon`，并允许在默认 slot 中组合 `Tag`、`Button` 或轻量说明。`visible` 显式传入后为受控模式：关闭入口只发出 `input`、`change`、`close` 请求，父级回写后才开始退场；未传 `visible` 时用 `defaultVisible` 初始化内部状态。节点会一直保留到 `opacity + transform` 退场完成，而不是通过 `wx:if` 直接跳变。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `theme` | `String` / `'default'` | `default`、`info`、`success`、`warning`、`danger`；非法值回退默认主题。 |
| `variant` | `String` / `'soft'` | `soft` 为轻量主题背景与中性正文；`tinted` 保留相同背景，标题/Icon 使用该 theme 的深色前景，说明与关闭入口使用同色系辅助前景；非法值回退 `soft`。 |
| `title`、`description` | `String` / `''` | 标题与辅助描述；复杂内容请放默认 slot。 |
| `closable` | `Boolean` / `false` | 是否显示右侧关闭入口。 |
| `visible`、`defaultVisible` | `Boolean \| null`、`Boolean` / `null`、`true` | 显式 `visible` 为受控值；`defaultVisible` 只在非受控初始化时生效，`false` 是明确关闭。 |
| `icon`、`showIcon`、`closeIcon` | `String`、`Boolean`、`String` / `''`、`true`、`'close'` | 主题图标可覆盖或关闭；关闭图标使用内部 `pui-icon`。 |
| `verticalAlign` | `String` / `'top'` | `top` 或 `center`；仅让 Icon、正文与关闭入口在 Alert 行内纵向对齐，不改变正文的水平对齐。 |
| `center` | `Boolean` / `false` | 垂直居中并居中文案。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`'standard'`、`false` | 出现和退场统一为 `0–1000ms`；低动效压缩为 `1ms`。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `input`、`change` | `{ visible, source }` | 调用 `open()` / `close()` 或点击关闭入口时请求显隐变化。 |
| `open`、`close` | `{ visible, source }` | 在 `input`、`change` 之后触发；来源为 `programmatic` 或 `close-button`。 |

实例方法为 `open()` 与 `close(source)`：

```xml
<pui-alert
  visible="{{alertVisible}}"
  title="发布检查已完成"
  description="关闭会回写页面状态后再播放退场帧。"
  theme="success"
  closable
  duration="500"
  bind:input="onAlertInput"
  bind:change="onAlertChange"
  bind:close="onAlertClose"
>
  <pui-tag theme="success" variant="outline">Alert + Tag slot</pui-tag>
</pui-alert>
```

## Aspect Ratio

`pui-aspect-ratio` 是媒体、封面和嵌入内容的比例容器。原生端以 `padding-top = 高 / 宽` 的 WXSS 百分比占位实现，而不是依赖浏览器专有的 `aspect-ratio`；默认 slot 始终铺满容器，可直接组合 `pui-icon`、`pui-tag`、`pui-image` 或业务内容。比例变化会过渡 `padding-top`，不使用无效的 `height: auto` 动画。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `ratio` | `String` / `'16 / 9'` | `宽 / 高`，同时接受 `:` 分隔，例如 `4:3`。任一侧为非数字或 `0` 时安全回退为 `16 / 9`。 |
| `bordered` | `Boolean` / `false` | 是否显示 token 化边框。 |
| `radius` | `String` / `'medium'` | `none`、`small`、`medium`、`large`；非法值回退 `medium`。 |
| `background` | `String` / `''` | 可传 `#RGB`、`#RRGGBB`、`#RRGGBBAA`、`transparent`、`currentColor` 或 `var(--token)`；非法值不写入内联样式。 |
| `overflow` | `Boolean` / `true` | `true` 裁切超出内容；`false` 允许 slot 的阴影、徽标等视觉内容外溢。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`'standard'`、`false` | 比例变化的过渡配置。时长规整为 `0–1000ms`，`reduceMotion` 强制为 `1ms`；`easing` 支持 `standard`、`ease`、`linear`、`ease-in`、`ease-out`、`ease-in-out`。 |

此组件是纯布局容器，不虚构点击或显隐事件；业务交互由 slot 内的真实 PoemUI 组件各自回传。示例：

```xml
<pui-aspect-ratio ratio="16 / 9" bordered duration="500" easing="standard">
  <view class="cover-content">
    <pui-icon name="image" size="56" />
    <pui-tag theme="primary" variant="outline">AspectRatio + Icon + Tag</pui-tag>
  </view>
</pui-aspect-ratio>
```

H5 镜像也使用相同的百分比占位和 `padding-top` 过渡，因此 Props 面板修改比例会立即触发真实可见的尺寸变化；浏览器的 `prefers-reduced-motion` 规则与小程序端的 `reduceMotion` 均会压缩动画。

## Button

`pui-button` 以微信原生 `button` 为根节点，负责即时操作、表单动作和平台 `open-type` 能力。日常使用只需要核心属性；微信开放能力单独归入高级分组。加载或禁用时会真实禁用根按钮并清空 `open-type` / `form-type`，避免重复提交和平台能力误触发。

### 基础用法

基础示例只展示 Button 本身，不预先声明业务并未使用的事件：

```xml
<pui-button theme="primary">主要按钮</pui-button>
```

### 核心 Props

| Prop | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `theme` | `String` / `'default'` | `default`、`primary`、`danger`；非法值回退 `default`。其中 `default + base` 固定使用 muted 弱填充，`primary/danger + base` 使用实色操作面。 |
| `variant` | `String` / `'base'` | `base`、`outline`、`text`、`ghost`、`transparent`；`transparent` 保留常规 Button 尺寸、圆角与命中区，只移除背景、边界和外投影。它不同于仅供 Tabbar 等组合容器使用、还会移除自身圆角的 `surface="transparent"`。 |
| `surface` | `String` / `'default'` | `default` 由 Button 承载自身操作表面；`transparent` 只用于 Tabbar 等复合导航的透明交互轨道，Button 保留交互根但不显示背景、边界、圆角、阴影或毛玻璃；Tabbar 固定同时使用 `variant="transparent"`，且仅 `shape="round"` 根承载独立 Surface。 |
| `content` | `String` / `''` | 可见文本；空值时可由默认 slot 提供内容。 |
| `size` | `String` / `'medium'` | `extra-small`、`small`、`medium`、`large`。 |
| `shape` | `String` / `'rectangle'` | `rectangle`、`square`、`round`、`circle`。 |
| `block` | `Boolean` / `false` | 是否占满父容器宽度。 |
| `icon` | `String \| null` / `null` | PoemUI Icon 名；空值时可使用 `icon` slot。 |
| `iconOnly` | `Boolean` / `false` | 只保留前置 Icon；真实移除默认内容和 suffix 区域，并让 Button 与 Icon 使用同一尺寸的居中轨道（无 gap、无基线偏移）。`icon` 会渲染内部 `pui-icon`，也可使用 `icon` slot；调用方仍需提供 ariaLabel。 |
| `loading` | `Boolean` / `false` | 显示内部 Loading，并禁用点击、表单和平台能力。 |
| `loadingProps` | `Object` / `{}` | 只接受 Loading 的 `size/theme/text/ariaLabel`；Button 自己负责动效与可用性边界。 |
| `disabled` | `Boolean` / `false` | 真实设置原生 `button.disabled` 并阻断 `click`。 |
| `ariaLabel` | `String` / `''` | 可访问名称；依次回退到 `content`、Loading 名称和“按钮”。 |
| `reduceMotion` | `Boolean` / `false` | 把 Button 与内部 Loading 动效压缩为 1ms；普通动效读取共享 Token。 |

### 表单与微信能力 Props

以下属性只在需要表单或微信开放能力时配置，不属于基础用法：

| Prop | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `openType` | `String` / `''` | 透传微信 `open-type`，包括 contact/share/getPhoneNumber/getRealtimePhoneNumber/getUserInfo/launchApp/openSetting/feedback/chooseAvatar/agreePrivacyAuthorization/phoneOneClickLogin 等基础库支持值。 |
| `formType` | `String` / `''` | `submit`、`reset` 或空；非法值清空。 |
| `lang` | `String` / `'en'` | `en`、`zh_CN`、`zh_TW`。 |
| `sessionFrom` | `String` / `''` | 客服会话来源。 |
| `sendMessageTitle` | `String` / `''` | 客服消息卡片标题。 |
| `sendMessagePath` | `String` / `''` | 客服消息卡片小程序路径。 |
| `sendMessageImg` | `String` / `''` | 客服消息卡片图片地址。 |
| `showMessageCard` | `Boolean` / `false` | 是否显示客服消息卡片。 |
| `appParameter` | `String` / `''` | `launchApp` 时向 App 传递的参数。 |
| `hoverClass` | `String` / `'pui-button--hover'` | 原生 hover class；显式空值映射为 `none`。 |
| `hoverStartTime` | `Number` / `20` | 按住后出现点击态的延迟，规整到 0–1000ms。 |
| `hoverStayTime` | `Number` / `70` | 松开后点击态保留时间，规整到 0–1000ms。 |
| `hoverStopPropagation` | `Boolean` / `false` | 透传原生同名属性。 |
| `phoneNumberNoQuotaToast` | `Boolean` / `true` | 手机号快速验证额度不足时是否展示平台提示。 |
| `activityType` | `Number \| String \| null` / `null` | 视频号直播入口活动类型；非法数字清空。 |
| `entrancePath` | `String` / `''` | 视频号直播入口路径。 |
| `needShowEntrance` | `Boolean` / `true` | 是否展示直播入口。 |

### Slots

- 默认 slot：按钮正文，可与 `content` 二选一使用。
- `icon`：在正文前提供自定义图标组合；简单图标优先用 `icon` 属性。
- `suffix`：正文后的补充内容，适合 Badge 或方向图标；消费者负责保持紧凑尺寸。

### Events

| 事件 | detail | 说明 |
| --- | --- | --- |
| `click` | 原生 detail + `{ source: 'button' }` | 仅在非 loading/disabled 时触发；以 `bubbles:true, composed:true` 透过复合组件与命名 Slot。 |
| `getuserinfo` | 平台原始 detail | 转发微信用户信息事件。 |
| `contact` | 平台原始 detail | 转发客服会话事件。 |
| `createliveactivity` | 平台原始 detail | 转发创建直播活动事件。 |
| `getphonenumber` | 平台原始 detail | 转发手机号事件。 |
| `getrealtimephonenumber` | 平台原始 detail | 转发实时手机号事件。 |
| `error` | 平台原始 detail | 转发平台能力失败信息，不改写为成功。 |
| `opensetting` | 平台原始 detail | 转发设置页结果。 |
| `launchapp` | 平台原始 detail | 转发拉起 App 结果。 |
| `chooseavatar` | 平台原始 detail | 转发头像选择结果。 |
| `agreeprivacyauthorization` | 平台原始 detail | 转发隐私授权结果。 |
| `phoneoneclicklogin` | 平台原始 detail | 转发手机号一键登录结果。 |

普通点击只绑定一个 `click`：

```xml
<pui-button theme="primary" bind:click="onButtonClick">保存</pui-button>
```

只有使用客服能力时，才绑定该能力相关事件：

```xml
<pui-button
  open-type="contact"
  bind:contact="onContact"
  bind:error="onContactError"
>
  联系客服
</pui-button>
```

H5 镜像使用真实 HTML `button` 与 `form` 验证 click/submit/reset，并把平台参数同步为 DOM 数据属性；客服、分享、授权、手机号、直播和拉起 App 只能由微信平台触发，官网不会伪造这些能力的成功回调。基础用法、当前效果和复制代码都不得一次性输出全部 `bind:*`。



H5 镜像用同一组内部 Button 渲染，组根默认全宽并消费单一集合阴影，点击只显示子 Button 的 `click` 运行态；不会将演示状态伪装成 ButtonGroup 的 `change`。`disabled`、方向、尺寸、外框、圆角、标签和低动效均由 Props 面板即时映射。

## Card

`pui-card` 用于把内容、说明和操作组织成一致的容器。它保留默认内容 slot，并提供 `header`、`header-right`、`footer` 命名 slot；`header-right` 是固定右侧轨道，最多承载三个紧凑操作。未提供该 slot 且 `menuItems` 非空时，Card 自动显示默认 `more` 圆形图标按钮，并用 Popover 打开组件级下拉菜单。`clickable` 只控制 Card 自身的点击事件；header/footer 使用 `catchtap` 保留子 Button 的独立事件。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `title`、`description` | `String` / `''` | 头部标题和辅助说明。任一存在时会显示 header 区。 |
| `showHeader`、`showFooter` | `Boolean` / `false`、`false` | `showHeader` 在无文案时保留 `header` slot；`showFooter` 渲染 footer 区及其命名 slot。 |
| `bordered`、`headerBordered`、`footerBordered` | `Boolean` / `true`、`true`、`true` | 控制外框、header 分隔线、footer 分隔线。 |
| `padding` | `String` / `'normal'` | `normal` 或 `compact`；非法值回退 `normal`，各分区采用一致内距。 |
| `shadow` | `Boolean` / `false` | 使用主题卡片阴影 token。 |
| `clickable`、`disabled` | `Boolean` / `false`、`false` | 仅当 `clickable && !disabled` 时 Card 自身可点并触发 `click`；`disabled` 不劫持 footer 内子 Button 的独立事件。 |
| `menuItems` | `Array` / `[]` | 默认 More 菜单条目；每项使用 `{ value, label, icon?, disabled?, danger? }`，最多展示 8 项。传入 `header-right` slot 时由消费者接管右侧轨道。 |
| `menuIcon` | `String` / `'more-horizontal'` | 默认菜单触发器的 PUI More 图标名称。 |
| `menuVisible` | `Boolean \| null` / `null` | `null` 为非受控模式；布尔值为受控模式，组件只发出可见性请求。 |
| `defaultMenuVisible` | `Boolean` / `false` | 非受控模式的初始菜单状态。 |
| `ariaLabel` | `String` / `'卡片'` | Card 语义名称。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`'standard'`、`false` | hover / disabled 视觉变化的动画配置；时长规整为 `0–1000ms`，低动效为 `1ms`。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `click` | `{ source: 'card' }` | 点按可点击且非禁用的 Card 内容区域。 |
| `menu-visible-change` | `{ visible, source }` | 默认菜单请求打开或关闭；受控模式由父级回写 `menuVisible`。 |
| `menu-select` | `{ value, label, index, item }` | 选择可用菜单项；组件关闭菜单，但不伪造后续业务结果。 |

| Slot | 说明 |
| --- | --- |
| 默认 Slot | Card 主内容。 |
| `header` | 标题左侧/下方的自定义 Header 内容。 |
| `header-right` | 固定右侧操作轨道，最多三个紧凑 Button/IconButton；存在时替代默认 More 菜单。 |
| `footer` | Footer 操作内容。 |

```xml
<pui-card
  title="发布检查"
  description="内容区可打开详情，footer 的保存动作独立回传。"
  show-footer
  clickable
  bind:click="onCardClick"
  bind:menu-select="onCardMenuSelect"
  menu-items="{{menuItems}}"
>
  <pui-tag slot="header" theme="primary" variant="outline">header slot</pui-tag>
  <pui-cell title="组件目录" value="ready" />
  <pui-button slot="footer" theme="primary" block bind:click="onSave">保存草稿</pui-button>
</pui-card>
```

H5 镜像沿用相同的 header/content/footer 条件和子 Button 事件边界：没有裸按钮伪造“展开”状态；Props 面板可实时验证可点击、禁用、边框、内距、阴影、命名 slot、时长和低动效。

## Divider

`pui-divider` 是纯展示分隔符，适用于内容区块、列表和卡片内的节奏划分。它不会虚构点击或选择事件；横向模式可显示 `content` 或默认 slot，纵向模式只渲染线条。`showContent` 解决了“只有 slot、没有字符串 content”时默认 slot 被错误隐藏的问题。默认无内容时是一条连续横线，不会在中心留下空隙。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `layout` | `String` / `'horizontal'` | `horizontal` 或 `vertical`；非法值回退横向。纵向布局不渲染文字/slot。 |
| `align` | `String` / `'center'` | 横向内容为 `left`、`center`、`right`；非法值回退居中。 |
| `content` | `String` / `''` | 横向分隔线中的后备文字；若同时提供 slot，slot 内容优先。 |
| `showContent` | `Boolean` / `false` | 在 `content` 为空时仍渲染默认 slot，例如 `Tag`、`Icon + Tag` 等内部组件组合。 |
| `dashed` | `Boolean` / `false` | 是否使用虚线。 |
| `decorative`、`ariaLabel` | `Boolean`、`String` / `true`、`'分隔线'` | 视觉分隔默认对辅助技术隐藏；具有语义时传 `decorative="{{false}}"` 并提供标签。 |

Slots：

| 名称 | 说明 |
| --- | --- |
| `default` | 横向分割线中的自定义短内容；`content` 为空时需同时设置 `showContent`。 |

基础用法：

```xml
<pui-divider />
```

文字与对齐：

```xml
<pui-divider content="组件状态" align="left" />
```

自定义内容：

```xml
<pui-divider show-content dashed>
  <pui-tag theme="primary" variant="outline">自定义内容</pui-tag>
</pui-divider>
```

默认 slot 只在横向模式渲染；`content` 为空时需显式传 `show-content`。组件没有 Events 或实例方法。横向内容区域具备 `min-width: 0`、截断和单行保护，避免 390px 设备中长文字撑破容器。H5 镜像沿用线条/slot 条件、`role="separator"` 与真实方向语义，Props 调整即时反映布局，但不会把静态分隔符伪装成可交互控件。

## Badge

`pui-badge` 是附着在对象旁的纯展示数量、短文字或红点标记。默认 slot 或 `content` 是宿主内容，徽标固定在宿主右上角；没有宿主时自动以独立标记参与普通文档流。点击、禁用、选择和业务状态由 Button、Cell、Tabs、Tabbar 等宿主承担，Badge 自身不发布事件或实例方法。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `count` | `String \| Number \| null` / `0` | 徽标正文。数字和纯数字字符串参与零值与上限规则；空白、布尔值和对象不渲染；`null` 显式选择 `count` slot。 |
| `content` | `String` / `''` | 宿主短文本，不是 count 的别名；复杂宿主使用默认 slot。 |
| `dot` | `Boolean` / `false` | 显示红点并隐藏 count 或 count slot 正文。 |
| `maxCount` | `Number` / `99` | 正数上限，超过时显示 `${maxCount}+`；非法值回退 99。 |
| `showZero` | `Boolean` / `false` | 是否显示数字 `0` 或纯数字字符串 `'0'`。 |
| `theme` | `String` / `'danger'` | `danger/primary/success/warning/neutral`；非法值回退 `danger`。 |
| `variant` | `String` / `'solid'` | `solid/light/outline`；非法值回退 `solid`。 |
| `shape` | `String` / `'circle'` | `circle/square`；dot 始终保持圆形。 |
| `size` | `String` / `'medium'` | `small/medium/large`。 |
| `color` | `String` / `''` | 单一自定义主色；接受 hex、rgb/hsl、`transparent/currentColor` 和 `var(--token)`，危险或非法值忽略。 |
| `offset` | `[Number \| String, Number \| String]` / `[0,0]` | 右上角偏移 `[x,y]`；数字按 rpx 解释，也接受安全 rpx/px/em/rem/% 短长度，非法值回退 0。 |
| `ariaLabel` | `String` / `''` | 辅助名称；为空时按 dot、count slot 或正文回退，徽标正文固定以 polite status 播报。 |

Badge 没有组件事件；宿主的点击、选择、禁用和 loading 等状态由宿主组件自行发布和管理。

| slot | 说明 |
| --- | --- |
| 默认 slot | 被徽标附着的宿主内容；`content` 非空时由宿主短文本接管。 |
| `count` | `count=null && !dot` 时接管徽标正文，可组合 Icon 与极短文字。 |

```xml
<pui-badge count="128" max-count="99" aria-label="99 条以上未读消息">
  <pui-icon name="bell" size="44" />
</pui-badge>

<pui-badge count="{{null}}" theme="success" variant="light" aria-label="Pro 构建状态">
  <pui-button theme="default">构建</pui-button>
  <view slot="count"><pui-icon name="spark" size="20" /> Pro</view>
</pui-badge>
```

H5 镜像与 WXML 共享 12 项 Props、零值/上限/null Slot、固定右上角 offset 和自动独立布局语义。概览按“基础用法 / 红点与上限 / 尺寸与形状 / 主题与变体 / 组合用法”分区，不通过点击递增、生命周期提示或静态事件卡伪造原生能力。

## Bubble

`pui-bubble` 是单条消息的表面层：它负责正文、七种视觉变体、起止对齐、连续消息圆角、回应和长文折叠，不负责头像、发送者、时间、已读、会话存储、AI 传输或滚动容器。后者应由 Message、MessageScroller 或业务页面组合。`content` 优先于兼容别名 `text`；两者都为空且未启用默认 slot 时不会挂载空白气泡。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `content`、`text` | `String` / `''` | 正文与兼容回退；`content` 非空时优先。 |
| `variant` | `String` / `'default'` | `default/secondary/muted/tinted/outline/ghost/destructive`；非法值回退 default。 |
| `align`、`groupPosition` | `String` / `'start'`、`'single'` | 对齐为 `start/end`；连续圆角为 `single/first/middle/last`。 |
| `reactions` | `Array<Reaction>` / `[]` | 最多 12 项；保留 `0/false` 原始 value，支持 `label/text/emoji/count/active/disabled/ariaLabel`。组件只回传，不修改计数或 active。 |
| `reactionSide`、`reactionAlign` | `String` / `'bottom'`、`'end'` | 回应位于 `top/bottom`，内部按 `start/end` 对齐。 |
| `customContent`、`customReactions` | `Boolean` / `false` | 启用默认正文 slot 或 `reactions` 具名 slot；回应 slot 的业务事件由消费者自行绑定。 |
| `collapsible` | `Boolean` / `false` | 开启真实长文测量和内部 Button 展开入口；无溢出文本不会显示入口。 |
| `expanded` | `Boolean \| null` / `null` | Boolean 为受控；组件只发请求，父级回写后才改变。null/未传入为非受控。 |
| `defaultExpanded` | `Boolean` / `false` | 非受控模式只在首次初始化读取。 |
| `maxLines` | `Number` / `4` | 收起行数，规整为 1–12；文本使用隐藏测量节点得到完整和截断高度。 |
| `expandText`、`collapseText` | `String` / `'展开'`、`'收起'` | 内部 Button 的可见文案与辅助名称。 |
| `selectable` | `Boolean` / `true` | 默认正文是否允许长按选择；不改变 `longpress` 事件边界。 |
| `visible` | `Boolean` / `true` | 显式显隐门禁；关闭或正文清空时保留节点完成退场再卸载。 |
| `clickable`、`disabled` | `Boolean` / `false`、`false` | clickable 开启正文 click/longpress；disabled 阻止正文、回应和展开，显隐生命周期仍工作。 |
| `ariaLabel`、`ariaLive` | `String`、`String` / `''`、`'off'` | 辅助名称为空时回退正文/slot 说明；播报支持 `off/polite/assertive`。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`'standard'`、`false` | 显隐、折叠、颜色和按压动效；限制 0–1000ms，低动效压缩为 1ms。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `click`、`longpress` | `{ source, content, variant, align, expanded, visible }` | `clickable && !disabled` 时正文点击或长按。 |
| `reaction` | `{ index, item, value, active, source:'reaction' }` | 点击未禁用回应；不修改 `reactions`。 |
| `input`、`change` | `{ value, expanded, previousValue, source }` | 展开请求；受控模式等待父级回写。 |
| `expand`、`collapse` | 同上 | 展开或收起请求，由 toggle 或实例方法触发。 |
| `show`、`hide`、`after-show`、`after-hide` | 当前气泡快照 | `visible`、正文或 slot 门禁改变；after 事件在 0–1000ms 动效结束后触发。 |

| slot / 方法 | 说明 |
| --- | --- |
| 默认 slot | `customContent=true` 时接管正文，可组合 Icon、Tag、Cell 等内部组件。 |
| `reactions` | `customReactions=true` 时接管回应区；消费者负责自己的点击事件。 |
| `expand()`、`collapse()`、`toggle()` | 复用同一展开请求合同；受控模式仍须父级回写。 |

```xml
<pui-bubble
  id="delivery-bubble"
  content="源码、H5、文档和 npm 产物都需要逐项验收；这是一段会真实测量高度的长消息。"
  variant="secondary"
  align="start"
  group-position="single"
  reactions="{{bubbleReactions}}"
  collapsible
  expanded="{{bubbleExpanded}}"
  max-lines="3"
  clickable
  aria-label="组件交付状态消息"
  bind:click="onBubbleClick"
  bind:longpress="onBubbleLongpress"
  bind:reaction="onBubbleReaction"
  bind:input="onBubbleExpandedInput"
  bind:change="onBubbleExpandedChange"
  bind:expand="onBubbleExpand"
  bind:collapse="onBubbleCollapse"
/>
```

小程序文本折叠以两个隐藏 WXML 测量节点和 selector query 获得像素高度，再过渡 `max-height`，不对 `height:auto` 做无效 transition；slot 富内容没有稳定的平台行数语义，因此采用有界高度回退，复杂 slot 推荐由业务层控制 expanded。H5 镜像同步受控回写、回应原值、显隐保留节点、深浅色对比和 `prefers-reduced-motion`，不会伪造发送、已读、AI 生成或回应计数。

## Avatar

`pui-avatar` 用于展示头像图片，并在图片不可用或未传入时按 `useSlot`、`icon`、`text/alt` 的顺序提供真实回退。图片节点始终覆盖在回退内容之上：加载完成后淡入，加载失败时自然露出底层回退；`hideOnLoadFailed` 则会让整个节点完成短退场后隐藏。Avatar 是纯展示叶子，需要点击时由外层 PUI Button 或 Cell 承担。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `src` | `String` / `''` | 小程序支持的图片地址；地址变更会重新进入加载状态。 |
| `text`、`alt`、`icon` | `String` / `''` | `text/alt` 的首个非空字符作为文字回退；`icon` 使用内部 `pui-icon`；`alt` 同时作为无显式标签时的语义名称。 |
| `useSlot` | `Boolean` / `false` | 为真时渲染默认 slot，优先于内部 Icon 和文字回退，可组合 `pui-icon`、`pui-badge` 等内部组件。 |
| `shape`、`size` | `String` / `'circle'`、`'medium'` | `shape` 为 `circle`、`round`、`square`；`size` 为 `small`、`medium`、`large`；非法值分别回退默认。 |
| `bordered` | `Boolean` / `false` | 绘制与容器背景一致的头像边框及细轮廓。 |
| `hideOnLoadFailed` | `Boolean` / `false` | 图片失败时是否淡出并隐藏整个 Avatar；否则保留 Icon / 文本 / slot 回退。 |
| `lazy` | `Boolean` / `false` | 是否启用微信 image 的 `lazy-load`。只改变资源何时开始请求，不改变 Avatar 内部状态职责。 |
| `loading` | `Boolean` / `false` | 是否强制保持 Avatar 内部 PUI Loading 与 `aria-busy=true`；关闭后继续按真实 `src → load/error` 生命周期自动显示或结束等待态。 |
| `ariaLabel` | `String` / `''` | Avatar 的可访问名称；为空时依次回退 `alt`、`text`、`icon`、`'头像'`。 |
| `reduceMotion` | `Boolean` / `false` | 是否将固定的图片淡入与失败退场压缩为 `1ms`。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `error` | `{ src, ...imageDetail }` | 原生 `<image>` 加载失败；随后展示回退或按策略淡出隐藏。 |

| Slot | 说明 |
| --- | --- |
| `default` | `useSlot=true` 时接管未传图片或图片失败后的回退内容。 |

```xml
<pui-avatar text="P" />

<pui-avatar use-slot shape="square" aria-label="星光头像">
  <pui-icon name="spark" size="36" />
</pui-avatar>
```

H5 镜像使用真实浏览器 `<img>` 的 `load/error`，而不是“点击模拟加载失败”；其中 load 只更新内部图片淡入，公开 API 只回传 error。Props 面板修改图片、回退、slot 和形状会立即映射；浏览器的 `prefers-reduced-motion` 与小程序端 `reduceMotion` 都会压缩过渡。

## Image

`pui-image` 直接封装小程序原生 `<image>`，状态来自真实资源生命周期：传入 `src` 后先进入 loading，原生 `load` 后图片淡入，原生 `error` 后显示错误回退；空 `src` 显示 empty。`loading` 和 `error` 是外部覆盖状态，适合等待业务请求或主动展示错误；关闭 `error` 会重新请求当前图片地址。宽高只接受安全的 `rpx`、`px` 或百分比，组件不会把任意字符串拼入内联 WXSS。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `src` | `String` / `''` | 小程序支持的图片地址；变更后重新进入原生 loading。 |
| `mode` | `String` / `'aspectFill'` | 支持原生 `scaleToFill`、`aspectFit`、`aspectFill`、`widthFix`、`heightFix` 及九宫格位置模式；非法值回退 `aspectFill`。 |
| `width`、`height` | `String` / `''` | 仅接受非负 `rpx`、`px`、`%`；无效值忽略，容器保留最小尺寸。 |
| `shape` | `String` / `'rectangle'` | `rectangle`、`round`、`circle`；非法值回退 `rectangle`。 |
| `lazy` | `Boolean` / `false` | 透传原生 `lazy-load`。 |
| `webp` | `Boolean` / `false` | 透传微信原生 `webp` 解码能力。 |
| `showMenuByLongpress` | `Boolean` / `false` | 透传原生长按图片菜单。 |
| `loading`、`error` | `Boolean` / `false`、`false` | 外部覆盖 loading/error；优先级为 `error`、`loading`、`empty`、原生资源状态。 |
| `text` | `String` / `''` | loading、error、empty 的可见状态文案。 |
| `showSlot` | `Boolean` / `false` | 是否渲染默认覆盖 slot；Slot 事件完全属于消费者。 |
| `ariaLabel` | `String` / `''` | 可访问名称；为空时回退 `text` 或“图片”。 |
| `reduceMotion` | `Boolean` / `false` | 将固定 500ms 图片淡入压缩为 1ms。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `load` | `{ src, ...imageDetail }` | 原生 `<image>` 资源成功加载并开始淡入。 |
| `error` | `{ src, ...imageDetail }` | 原生 `<image>` 资源加载失败并显示错误回退。 |

```xml
<pui-image src="{{coverUrl}}" />
```

概览代码区还提供三段面向用法的 WXML：状态、裁切和覆盖内容。它们与基础用法共用同一个生成器，基础用法不混入事件绑定：

```xml
<pui-image src="{{coverUrl}}" loading text="封面加载中" />
<pui-image src="{{brokenCoverUrl}}" text="图片加载失败" />

<pui-image src="{{coverUrl}}" width="176rpx" height="176rpx" />
<pui-image src="{{coverUrl}}" mode="aspectFit" width="176rpx" height="176rpx" />

<pui-image src="{{coverUrl}}" width="176rpx" height="176rpx" shape="round" show-slot>
  <pui-tag theme="primary" variant="outline">封面</pui-tag>
</pui-image>
```

覆盖内容通过默认 Slot 组合；只有事件专项场景才绑定需要观察的资源事件：

```xml
<pui-image src="{{coverUrl}}" show-slot bind:error="onImageError">
  <pui-tag theme="primary" variant="outline">Image + Tag slot</pui-tag>
</pui-image>
```

Image 是展示叶子，不发布 `click`，也不提供 `clickable/disabled`；需要打开、选择或禁用图片时，应由外层 PUI Button 或 Cell 承担真实交互。H5 镜像直接监听浏览器 `<img>` 的 load/error，并用缓存 `complete/naturalWidth` 同步已完成资源；外部 `error/loading` 只覆盖可见状态，不伪造组件事件。`showMenuByLongpress` 映射为浏览器上下文菜单策略。`widthFix`、`heightFix` 的最终高度仍应以小程序原生 image 布局为准，H5 仅以 `object-fit: contain` 近似展示。

## Grid

`pui-grid` 是数据驱动的快捷入口，不是选择器或导航请求代理。它组合内部 Button、Icon、Badge、Loading 和 Empty；状态优先级固定为 `error > loading > content > empty`。每项支持 `{ label, description, value, icon, badge, theme, disabled, ariaLabel }`，并保留 `0`、`false`、空字符串等原始值。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `items` | `Array` / `[]` | 入口数据。字符串、数字、布尔值会规范为入口；对象缺 label 时安全回退“项目 N”。 |
| `column` | `Number` / `4` | 0 表示单行横向滚动；1–6 表示固定列网格，非法值回退 4。 |
| `gutter` | `Number` / `0` | 入口间距，单位 rpx，限制为 0–64。 |
| `border` | `Boolean` / `true` | 是否显示入口之间的中性分隔线；关闭不改变盒模型。 |
| `align` | `center \| left` / `center` | 入口图标和文案的内部对齐方式。 |
| `disabled` | `Boolean` / `false` | 禁用所有入口；单项可通过 `item.disabled` 禁用。 |
| `loading` | `Boolean` / `false` | 显示内部 PUI Loading；error=true 时错误态优先。 |
| `error` | `Boolean` / `false` | 显示内部 PUI Empty 错误态；重试不会自动清除。 |
| `loadingText` | `String` / `'加载中'` | Loading 本体显示的文案。 |
| `errorText` | `String` / `'加载失败'` | 错误态标题。 |
| `emptyText` | `String` / `'暂无入口'` | items 为空时的空状态标题。 |
| `retryText` | `String` / `'重试'` | 错误操作文案；空字符串隐藏操作。 |
| `ariaLabel` | `String` / `'宫格导航'` | 组容器的可访问名称。 |
| `reduceMotion` | `Boolean` / `false` | 将内容与状态层切换压缩为 1ms；默认时长固定 500ms。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `click` | `{ index, item, value, source }` | 点击非 disabled 的 Item；不改变组件选择状态。 |
| `retry` | `{ source }` | 错误态操作点击后触发；等待父级真实回写 error/loading/items。 |

```xml
<!-- 基础用法：不展示事件绑定 -->
<pui-grid items="{{entries}}" />
```

事件专项场景只绑定需要观察的事件：

```xml
<pui-grid
  items="{{entries}}"
  error="{{loadFailed}}"
  bind:click="onGridClick"
  bind:retry="onGridRetry"
/>
```

H5 与原生都保留 content/loading/error/empty 四层，以 500ms opacity/transform 切换；`reduceMotion` 为 1ms。错误重试只展示父级请求已经发出，绝不伪造成功。参考 TDesign 1.15.3 Grid/GridItem 后，PoemUI 采用 `column=0` 横向滚动与核心布局能力，但继续使用单个数据驱动组件，不增加独立 GridItem、图片透传、URL 导航、footer slot、顶层 hover/theme 或可变 duration/easing。

## ScrollArea

`pui-scroll-area` 对齐 TDesign `ScrollView`，是固定高度或有界自适应高度的原生纵向 `scroll-view` 薄封装。默认 slot 是唯一内容入口；父级可通过 `scrollTop` 受控定位，或给 slot 内节点设置 `id` 后通过 `scrollIntoView` 真实定位。组件固定启用增强滚动、隐藏滚动条并以平台原生动画平滑完成受控定位；该行为不额外公开动画开关或时长。可选的顶底渐变是透明、无交互的固定视觉层；透明内容轨默认提供 `10vh` 尾部安全区，保证最后内容可完整滚入可视区域。

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `height` | `String` | `'320rpx'` | 正数、`rpx`、`px`、`vh`、`'auto'` | 滚动区域高度。裸正数按 rpx 处理；`'auto'` 时内容自然增高到 `maxHeight` 后才滚动；`0`、负数、空值或非数字均回退 `'320rpx'`。 |
| `maxHeight` | `String` | `'320rpx'` | 正数、`rpx`、`px`、`vh` | 仅 `height='auto'` 时生效的高度上限。裸正数按 rpx 处理；空值、`'auto'`、`0`、负数或非法值回退 `'320rpx'`。 |
| `scrollTop` | `Number` | `0` | `≥ 0` | 受控纵向位置。用户滚动时通过 `scroll` 回写真值；父级写入 `0` 可让 BackTop 组合以平台原生动画真实回到局部滚动区顶部。 |
| `scrollIntoView` | `String` | `''` | slot 内节点的 `id` | 父级传入目标节点 id 后，由原生 `scroll-view` 定位；空字符串不请求定位。 |
| `gradientOverlay` | `Boolean` | `true` | `true`、`false` | 是否在真实滚动边缘显示渐变遮罩。顶部仅底层、底部仅顶层、中段两层、无溢出零层；不改变滚动、事件或定位。 |
| `gradientOverlayColor` | `String` | `''` | `#hex`、`rgb()`、`rgba()`、`var(--token)` | 顶底渐变使用的颜色。空值或非法值跟随 `--pui-scroll-area-gradient-overlay-color-context`（默认主题容器色，页面可指定画布色）；合法自定义色会同时用于顶部与底部。 |
| `gradientOverlaySize` | `String` | `'md'` | `'sm'`、`'md'`、`'lg'` | 顶底渐变的固定高度。`sm` 为 `40rpx / 20px`，`md`（既有默认）为 `64rpx / 32px`，`lg` 为 `88rpx / 44px`；非法值回退 `'md'`，不占用 Slot 空间。 |
| `contentPaddingBottom` | `String` | `'10vh'` | 非负裸数、`rpx`、`px`、`vh` | 内容尾部安全区。裸数按 rpx，`0` 可关闭；负数、表达式或非法值回退 `'10vh'`。绝对定位浮层展开时，父级可临时提高该值以让滚动高度包含面板空间。 |
| `ariaLabel` | `String` | `'滚动内容'` | 任意非空字符串 | 滚动区域的辅助名称；空值回退默认值。 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 要滚动的内容。推荐组合 `pui-cell`、`pui-list` 等；需要定位时，在目标节点上设置唯一 `id`。 |

基础用法不需要事件绑定：

官网概览为了让较长 slot 内容在固定设备预览中保持可读并填满 shadow-safe 可用高度，会显式使用 `height="1128rpx"`，并从 H5 与当前 WXML 共用的 18 项真实 PUI Cell Slot 内容清单渲染真实滚动区；它只是当前演示值，组件公开默认值仍为 `'320rpx'`。

```xml
<pui-scroll-area height="1128rpx">
  <view id="scroll-area-source"><pui-cell title="组件源码" description="JS、JSON、WXML、WXSS" /></view>
  <view id="scroll-area-props"><pui-cell title="公开 Props" description="高度、定位、遮罩开关和颜色" /></view>
  <view id="scroll-area-design"><pui-cell title="样式 Token" description="遮罩跟随主题容器色" /></view>
  <view id="scroll-area-preview"><pui-cell title="H5 镜像" description="使用真实 overflow-y:auto" /></view>
  <view id="scroll-area-build"><pui-cell title="构建产物" description="miniprogram_dist 与安装包" /></view>
  <view id="scroll-area-install"><pui-cell title="使用方式" description="父级按内容场景设置固定高度" /></view>
  <view id="scroll-area-publish"><pui-cell title="目标定位" description="将 slot 节点 id 写入 scrollIntoView" /></view>
  <view id="scroll-area-operation"><pui-cell title="手动滚动" description="手势、滚轮或键盘在区域内完成" /></view>
  <view id="scroll-area-accessibility"><pui-cell title="辅助名称" description="ariaLabel 用于标记滚动内容" /></view>
  <view id="scroll-area-slot"><pui-cell title="默认内容" description="直接投影调用方组合内容" /></view>
  <view id="scroll-area-height"><pui-cell title="高度边界" description="无效高度回退为 320rpx" /></view>
  <view id="scroll-area-sync"><pui-cell title="规则同步" description="原生与 H5 共享高度换算规则" /></view>
  <view id="scroll-area-viewport"><pui-cell title="设备视口" description="预览区域固定而内容可滚动" /></view>
  <view id="scroll-area-responsive"><pui-cell title="窄屏阅读" description="390px 下保持可读与可操作" /></view>
  <view id="scroll-area-theme"><pui-cell title="主题适配" description="Cell 与遮罩均跟随深浅色" /></view>
  <view id="scroll-area-surface"><pui-cell title="透明根容器" description="滚动区不额外创建 Surface" /></view>
  <view id="scroll-area-focus"><pui-cell title="焦点语义" description="Slot 保留自身焦点与读屏语义" /></view>
  <view id="scroll-area-review"><pui-cell title="交付复核" description="真实滚动与目标定位均需验证" /></view>
</pui-scroll-area>
```

`scrollIntoView="build-log"` 只在需要目标节点定位时由父级传入，非空时按原生规则优先于 `scrollTop`。需要短内容不被固定高度撑开、长内容局部滚动时，使用 `<pui-scroll-area height="auto" max-height="60vh">`；固定高度模式不会消费 `maxHeight`。`content-padding-bottom` 默认 `10vh`，普通页面不需要重复传入；浮层页面可在展开期间显式提高。`gradient-overlay` 默认为 `true`、`gradient-overlay-size` 默认为 `md`，因此基础 WXML 不需要重复传入；遮罩只在真实可滚动边缘显示：顶部仅底层、底部仅顶层、中段两层、无溢出零层。

Events：

- `scroll`：`{ scrollTop, scrollHeight }`。唯一原生滚动视口真实滚动时发布，用于受控位置回写、边缘状态和 BackTop 显隐。

ScrollArea 没有公开 Methods；它也没有 `disabled`、`readonly`、`loading`、`empty`、`error`、`retry` 或动画 Props。需要原生阈值、横向滚动或更多平台事件时，直接使用微信 `scroll-view`。

## Select

`pui-select` 以 PUI Button Trigger、PUI Popup 和 PUI Button 选项实现简单单选。传入 `value` 后为受控模式：用户选择只触发请求，父级回写后才改变标签；未传 `value` 时，`defaultValue` 仅在首次初始化使用。`0` 与 `false` 是不同且合法的 value，不会被空值覆盖。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `options` | `Array` / `[]` | 每项可传 `{ label, text, value, disabled }`；原始字符串/数字会转换为 label/value。缺省 label 回退序号。 |
| `value`、`defaultValue` | `any \| null`、`any` / `null`、`''` | 受控值与非受控初值；使用严格原始值比较，数字 `0`、布尔 `false` 与字符串值不碰撞。 |
| `placeholder`、`emptyText` | `String` / `'请选择'`、`'暂无可选项'` | 未选择和空 options 的可见文案；空 options 时禁用 Trigger。 |
| `disabled`、`readonly` | `Boolean` / `false`、`false` | 均阻止打开 Popup；disabled 同时降低可见度。 |
| `ariaLabel` | `String` / `'选择器'` | 选择器触发器的语义名称。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`'standard'`、`false` | 标签、禁用与背景状态过渡限制为 0–1000ms；低动效为 1ms。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `input`、`change` | `{ value, index, option, source: 'option' }` | 选择可用选项时触发。受控组件须回写 `value`。 |
| `cancel` | `{ value, index, source: 'overlay' \| 'close-btn' \| 'popup' }` | 用户通过 Popup 遮罩或关闭按钮退出，且值未被修改。 |

禁用选项仍完整展示，但对应的 PUI Button 不可操作，不会触发 `input/change` 或更改值：

```xml
<pui-select
  options="{{channels}}"
  value="{{channel}}"
  aria-label="发布渠道"
  bind:change="onChannelChange"
  bind:cancel="onChannelCancel"
/>
```

H5 镜像通过共享 PUI Button 与主题菜单复现同一选择路径，只允许选择可用项；点击将模拟父级对 `input/change` 的 `value` 回写，空选项、只读和禁用与 WXML 保持一致。

## Picker

`pui-picker` 是基于微信原生 `picker-view / picker-view-column` 的滚轮选择器，支持单列、二维独立列和 `children` 级联树。它与 `pui-select` 的职责不同：Select 负责简单单选 Trigger，Picker 负责多列、级联、草稿确认和 Popup/内联滚轮。传入 `value` 或 `visible` 后，对应状态由父级持有；滚动只更新草稿，确认后才请求提交值。

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `columns` | `PickerOption[] \| PickerOption[][]` | 组件分类级联树 | 单列数组、二维数组、带 `children` 的树 | 滚轮数据。每项默认读取 `label/value/children/disabled/icon`；原始标量可直接作为 label/value。 |
| `value` | `Array<string \| number \| boolean> \| null` | `null` | 任意严格原始值数组或 `null` | 受控提交值；`null` 或未传时使用非受控模式。`0`、`false` 和空字符串都是合法值。 |
| `defaultValue` | `Array<string \| number \| boolean>` | `['basic', 0]` | 任意严格原始值数组 | 仅首次初始化非受控提交值；不会覆盖后续滚轮和确认结果。 |
| `visible` | `boolean \| null` | `null` | `true`、`false`、`null` | Popup 受控显隐；父级必须处理 `visible-change` 并回写。内联模式忽略该值。 |
| `defaultVisible` | `boolean` | `false` | `true`、`false` | 仅首次初始化非受控 Popup 显隐。 |
| `title` | `string` | `'选择组件'` | 任意完整文本 | Header 标题；空字符串保留无标题布局。 |
| `type` | `'default' \| 'classic'` | `'default'` | `default`、`classic` | `default` 在 Popup Header 左侧使用 primary Check 圆形图标确认、右侧使用 default Close 圆形图标取消；`classic` 保留底部两列取消/确认。内联模式也跟随同一图标左右顺序。 |
| `cancelText` | `string` | `'取消'` | 任意完整文本 | `classic` 的 Footer 左侧取消文案；默认图标 Header 的可访问名称固定为“取消选择”。 |
| `confirmText` | `string` | `'确定'` | 任意完整文本 | `classic` 的 Footer 右侧确认文案；默认图标 Header 的可访问名称固定为“确认选择”。 |
| `showHeader` | `boolean` | `true` | `true`、`false` | 是否显示标题和操作区；关闭后由消费者调用方法提交或取消。 |
| `usePopup` | `boolean` | `true` | `true`、`false` | `true` 组合 PUI Popup；`false` 以内联 Surface 始终展示滚轮。 |
| `closeOnOverlayClick` | `boolean` | `true` | `true`、`false` | Popup 遮罩点击是否请求关闭；遮罩关闭不等同 cancel。 |
| `autoClose` | `boolean` | `true` | `true`、`false` | 确认或取消后是否自动请求关闭 Popup；内联模式不执行关闭。 |
| `keys` | `{ label?, value?, children?, disabled?, icon? }` | `{}` | 五个字符串字段映射 | 自定义数据键；空值和非法对象逐项回退默认键名。 |
| `visibleItemCount` | `number` | `5` | `3`、`5`、`7` | 可见行数；运行时限制为 3–7，并规整为奇数。 |
| `itemHeight` | `number` | `80` | `64–112`，步长建议 `8` | 每项高度，单位 rpx；超出范围会安全收敛。 |
| `disabled` | `boolean` | `false` | `true`、`false` | 阻止打开、滚动、确认、取消和重试，并降低整体可用性提示。 |
| `readonly` | `boolean` | `false` | `true`、`false` | 阻止打开、滚动、确认和重置；已打开 Popup 仍允许取消或关闭。 |
| `loading` | `boolean` | `false` | `true`、`false` | 使用 PUI Loading 替换滚轮，并阻止值操作。 |
| `loadingText` | `string` | `'选项加载中'` | 任意完整文本 | loading 状态的可见说明。 |
| `error` | `boolean` | `false` | `true`、`false` | 使用 PUI Empty 错误态替换滚轮；优先级高于 loading。 |
| `errorText` | `string` | `'选项加载失败'` | 任意完整文本 | error 状态的完整说明。 |
| `retryText` | `string` | `'重试'` | 任意完整文本或空字符串 | 非空且 error=true 时显示真实重试 Button；重试不会自动清除 error。 |
| `emptyText` | `string` | `'暂无可选项'` | 任意完整文本 | 无列、空列或某列没有可用项时的 PUI Empty 文案。 |
| `ariaLabel` | `string` | `'组件滚轮选择器'` | 任意非空辅助名称 | 根、Popup 和滚轮组选项的可访问名称；空值回退 title 或“滚轮选择器”。 |
| `reduceMotion` | `boolean` | `false` | `true`、`false` | 将固定 500ms Popup 与滚轮过渡压缩为 1ms。 |

| 事件 | `detail` | 触发条件与顺序 |
| --- | --- | --- |
| `visible-change` | `{ visible, source, controlled }` | `open/close/confirm/cancel/overlay` 请求 Popup 显隐时先触发；受控模式只请求父级回写。 |
| `open` | `{ visible: true, source, controlled }` | `visible-change(true)` 后触发；父级直接修改 visible 不重复发布。 |
| `pick` | `{ value, label, columns, source, controlled, column, index, option }` | 滚轮真实改变可用项后触发，只更新草稿，不触发 change。 |
| `confirm` | `{ value, label, columns, source, controlled }` | 点击确定或调用 `confirm()` 时先触发；即使值未改变也报告确认动作。 |
| `change` | `{ value, label, columns, source, controlled }` | confirm 后且草稿与已提交值不同时触发；受控模式等待父级回写。reset 也会发布默认值请求。 |
| `cancel` | `{ value, label, columns, source, controlled }` | 点击取消或调用 `cancel()` 时触发，detail 是未改变的已提交值；不触发 change。 |
| `close` | `{ visible: false, source, controlled }` | `visible-change(false)` 后触发；遮罩、确认、取消和方法来源保持可区分。 |
| `retry` | `{ source }` | error 状态点击重试或调用 `retry()` 时触发；error 保持不变，等待父级真实重载。 |

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `open()` | `boolean` | 请求打开 Popup；内联、禁用、只读或已打开时返回 false。 |
| `close(source?)` | `boolean` | 请求关闭 Popup；内联或已经关闭时返回 false。 |
| `confirm(source?)` | `boolean` | 提交当前草稿并按固定事件顺序发布；不可交互状态返回 false。 |
| `cancel(source?)` | `boolean` | 丢弃草稿并按策略关闭；disabled 时返回 false。 |
| `reset()` | `Array<Value> \| false` | 请求恢复 `defaultValue`；禁用、只读或 loading/error/empty 状态返回 false，受控模式只触发 change 并等待父级回写。 |
| `getValue()` | `Array<Value>` | 返回当前已提交值的安全数组副本，不返回未确认草稿。 |

Picker 没有公开 Slot。标题、操作和状态结构由固定 PUI 组合保障；业务说明应放在 Picker 外部的 Cell、Field 或 Form 中。

基础用法只传递数据和初值，不绑定事件全集：

```xml
<pui-picker
  columns="{{pickerColumns}}"
  default-value="{{pickerDefaultValue}}"
  title="选择组件"
  aria-label="组件滚轮选择器"
/>
```

受控业务只绑定当前路径需要的事件，例如打开、确认提交与取消回写：

```xml
<pui-button bind:click="openPicker">选择组件</pui-button>
<pui-picker
  id="componentPicker"
  columns="{{pickerColumns}}"
  value="{{pickerValue}}"
  visible="{{pickerVisible}}"
  bind:visible-change="onPickerVisibleChange"
  bind:change="onPickerChange"
  bind:cancel="onPickerCancel"
/>
```

确认事件固定为 `confirm → change（值变化时）→ visible-change → close`，取消固定为 `cancel → visible-change → close`。H5 以点击、键盘、滚轮和 Pointer 拖动镜像同一草稿合同，不使用原生 `<select>` 冒充多列 Picker。

## DateTimePicker

`pui-date-time-picker` 是基于 PUI Picker 的日期时间滚轮。它将年、月、日、时、分、秒转换为动态列，复用 Picker 的 Popup、草稿、确认和取消生命周期；可视月历与日期范围选择仍由 `Calendar + Popover` 组合承担。

### 22 Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `String \| Number \| Date \| null` | `null` | 任意可解析日期时间、时间戳（含 `0`）、`null` | 受控值。只要不是 `null/undefined` 就进入受控模式；确认和 reset 只发布请求，父级回写前不改变已提交值。 |
| `defaultValue` | `String \| Number \| Date \| null` | `null` | 任意可解析日期时间、时间戳（含 `0`）、`null` | 非受控初值，仅首次初始化读取；reset 以当前 defaultValue 为目标。 |
| `visible` | `Boolean \| null` | `null` | `true`, `false`, `null` | Popup 受控显隐。`false` 是明确的受控关闭值；内联模式忽略此项并始终可见。 |
| `defaultVisible` | `Boolean` | `false` | `true`, `false` | 非受控 Popup 的首次显隐状态。 |
| `mode` | `String \| Array<String>` | `'date'` | `year`, `month`, `date`, `hour`, `minute`, `second`, `[dateMode, timeMode]` | 决定日期或时间精度。数组合并日期与时间列；兼容别名 `time` 等同 `minute`，`datetime` 等同 `['date', 'minute']`。 |
| `start` | `String \| Number \| Date \| null` | `null` | 可解析日期时间、时间戳、`null` | 可选范围下界。与 end 倒置时自动交换；未传时使用当前时间前十年或当天起点。 |
| `end` | `String \| Number \| Date \| null` | `null` | 可解析日期时间、时间戳、`null` | 可选范围上界。与 start 倒置时自动交换；未传时使用当前时间后十年或当天终点。 |
| `format` | `String` | `''` | 含 `YYYY`, `MM`, `DD`, `HH`, `mm`, `ss` 的格式串 | 控制公开 value 的字符串格式；空值按当前 mode 自动选择完整格式。 |
| `steps` | `Object` | `{}` | `{ year, month, date, hour, minute, second }` | 每列正整数步长。范围边界始终保留，即使边界不能被步长整除。 |
| `showWeek` | `Boolean` | `false` | `true`, `false` | 在日列标签后显示周几，不改变该列的数值。 |
| `title` | `String` | `''` | 任意文本 | Picker Header 标题；也参与辅助名称回退。 |
| `type` | `'default' \| 'classic'` | `'default'` | `default`, `classic` | 透传给 PUI Picker。默认 Header 左侧是 primary Check 圆形图标确认、右侧是 default Close 圆形图标取消；`classic` 使用底部两列取消/确认。 |
| `cancelText` | `String` | `'取消'` | 任意文本 | `classic` Footer 左侧取消文案；默认图标 Header 的可访问名称固定为“取消选择”。 |
| `confirmText` | `String` | `'确定'` | 任意文本 | `classic` Footer 右侧确认文案；默认图标 Header 的可访问名称固定为“确认选择”。 |
| `showHeader` | `Boolean` | `true` | `true`, `false` | 是否显示 Picker Header。关闭后仍可通过实例方法 confirm/cancel。 |
| `usePopup` | `Boolean` | `true` | `true`, `false` | `true` 使用 Popup；`false` 直接显示内联滚轮。 |
| `autoClose` | `Boolean` | `true` | `true`, `false` | confirm/cancel 后是否请求关闭 Popup；不影响事件先后顺序。 |
| `closeOnOverlayClick` | `Boolean` | `true` | `true`, `false` | 点击 Popup 遮罩时是否请求关闭并丢弃未确认草稿。 |
| `disabled` | `Boolean` | `false` | `true`, `false` | 禁止打开、滚动、确认、取消和 reset。 |
| `readonly` | `Boolean` | `false` | `true`, `false` | 禁止打开、滚动、确认和 reset；已打开 Popup 仍允许关闭或取消。 |
| `ariaLabel` | `String` | `'日期时间选择器'` | 任意非空文本 | 组件及滚轮区域的辅助名称。 |
| `reduceMotion` | `Boolean` | `false` | `true`, `false` | 将 Picker 与 Popup 的 500ms 动效压缩为 1ms。 |

### 7 Events

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `visible-change` | `{ visible, source, controlled }` | Popup 请求打开或关闭时触发；受控模式等待父级回写 visible。 |
| `open` | `{ visible: true, source, controlled }` | `visible-change(true)` 后触发。 |
| `pick` | `{ value, timestamp, parts, mode, source, controlled, column, unit, index }` | 点击、键盘、滚轮或拖动改变草稿列时触发；不会提交 change。 |
| `confirm` | `{ value, timestamp, parts, mode, source, controlled }` | 用户或实例方法确认当前草稿时最先触发。 |
| `change` | `{ value, timestamp, parts, mode, source, controlled }` | confirm 后草稿与已提交值不同时触发；reset 也会发布一次 change 请求。 |
| `cancel` | `{ value, timestamp, parts, mode, source, controlled }` | 取消并恢复已提交值时触发；不会触发 change。 |
| `close` | `{ visible: false, source, controlled }` | `visible-change(false)` 后触发。 |

### 6 Methods

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `open()` | `Boolean` | 请求打开 Popup；禁用、只读、内联或已打开时返回 false。 |
| `close(source?)` | `Boolean` | 请求关闭 Popup；内联或已关闭时返回 false。 |
| `confirm(source?)` | `Boolean` | 提交当前草稿；禁用或只读时返回 false。 |
| `cancel(source?)` | `Boolean` | 丢弃草稿并恢复已提交值；禁用时返回 false。 |
| `reset()` | `{ value, timestamp, parts, mode, source, controlled } \| false` | 请求恢复 defaultValue；受控模式只发布 change 并等待父级回写。禁用或只读时返回 false。 |
| `getValue()` | `{ value, timestamp, parts, mode, source, controlled }` | 返回当前已提交值，不返回尚未确认的草稿。 |

DateTimePicker 不公开 Slot。业务 Trigger、说明、状态和校验应在组件外部组合 Button、Cell、Field 或 Form。

基础用法只声明日期精度与初值，不展示事件全集：

```xml
<pui-date-time-picker
  default-value="2026-07-15"
  mode="date"
  title="选择日期"
/>
```

受控业务只绑定当前路径需要的显隐、提交和取消事件：

```xml
<pui-button bind:click="openPublishPicker">选择发布时间</pui-button>
<pui-date-time-picker
  id="publishPicker"
  value="{{publishAt}}"
  visible="{{publishPickerVisible}}"
  mode="{{publishPickerMode}}"
  steps="{{publishPickerSteps}}"
  bind:visible-change="onPublishPickerVisibleChange"
  bind:change="onPublishPickerChange"
  bind:cancel="onPublishPickerCancel"
/>
```

确认顺序固定为 `confirm → change（值变化时）→ visible-change → close`，取消顺序固定为 `cancel → visible-change → close`。H5 与小程序都使用同一滚轮模型；不再用两个 date/time 输入框模拟分裂提交。

## Sheet

`pui-sheet` 是可组合的底部操作面板。它复用 Popup 的遮罩和保留节点进退场，但独立负责真实下拉关闭、正文尺寸与滚动、三段 slot、内部 Button/Loading/Empty 以及 `error > loading > empty > content` 状态合同。传入 `visible` 后为受控模式，组件只发显隐请求，父级必须回写；未传时由 `defaultVisible` 和实例方法维护内部状态。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `visible` | `Boolean \| null` / `null` | `true/false` 为受控显隐；`null` / 未传时使用非受控模式。 |
| `defaultVisible` | `Boolean` / `false` | 仅首次初始化非受控显隐。 |
| `title`、`description`、`content` | `String` / `''` | 默认标题、说明和未传默认 slot 时的正文回退。 |
| `showHeader`、`showClose`、`showHandle` | `Boolean` / `true` | 默认标题行、右端 `default/base` 圆形图标 Button 关闭入口和拖拽柄；拖拽柄可脱离标题行独立显示。 |
| `draggable` | `Boolean` / `true` | 是否允许从把手向下拖动关闭。 |
| `dragThreshold` | `Number` / `120` | 距离阈值，运行时限制为 `40–480rpx`。 |
| `velocityThreshold` | `Number` / `0.6` | 速度阈值，运行时限制为 `0.1–3rpx/ms`。 |
| `closeOnOverlayClick`、`showOverlay` | `Boolean` / `true` | 遮罩显示与点击请求关闭策略；遮罩点击总会发 `overlay-click`。 |
| `customHeader` | `Boolean` / `false` | 使用 `header` slot 接管标题行。 |
| `showFooter`、`customFooter` | `Boolean` / `false` | 任一为 `true` 时渲染 `footer` slot 容器。 |
| `disabled` | `Boolean` / `false` | 阻止关闭按钮、遮罩、拖拽和 retry；实例 `open()/close()` 仍可调用。 |
| `loading`、`loadingText` | `Boolean`、`String` / `false`、`'内容加载中'` | 使用内部 Loading 显示正文加载态。 |
| `error`、`errorText`、`retryText` | `Boolean`、`String`、`String` / `false`、`'内容加载失败'`、`'重试'` | 使用内部 Empty/Button 显示错误与真实 retry 请求。 |
| `empty`、`emptyText` | `Boolean`、`String` / `false`、`'暂无内容'` | 显式空态；不猜测默认 slot 是否存在。 |
| `minHeight`、`height`、`maxHeight` | `Number` / `240`、`0`、`960` | 正文 rpx 尺寸；`height=0` 自适应，非零值受 `minHeight/maxHeight` 约束，溢出由 scroll-view 滚动。 |
| `zIndex`、`safeArea` | `Number`、`Boolean` / `1000`、`true` | 层级限制为 `1–12000`；可补充底部安全区。 |
| `ariaLabel` | `String` / `'底部面板'` | 面板辅助名称。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`'standard'`、`false` | 进退场、回弹和状态切换；时长限制 `0–1000ms`，低动效压缩为 `1ms`。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `input`、`change`、`open`、`close` | `{ visible, source, controlled }` | 显隐请求；`source` 可为 `programmatic`、`close`、`overlay` 或 `drag`。 |
| `overlay-click` | `{ source, close }` | 点击遮罩；`close` 表示本次策略是否请求关闭。 |
| `retry` | `{ source }` | error 状态点击重试或调用 `retry()`；只发请求，不清除 error。 |
| `drag-start` | `{ offset: 0, source: 'handle' }` | 有效触摸从把手开始。 |
| `dragging` | `{ offset, source: 'handle' }` | 向下拖动过程，offset 为 rpx。 |
| `drag-end` | `{ offset, velocity, close, cancelled, source: 'drag' }` | 触摸结束/取消并完成阈值判定。 |
| `scroll` | `{ scrollTop, scrollHeight, deltaY, source: 'content' }` | 正文 scroll-view 实际滚动。 |
| `after-open`、`after-close` | `{ visible, source }` | 0–1000ms 进场/退场完成；退场后才卸载。 |

实例方法为 `open(source?)`、`close(source?)` 和 `retry(source?)`。slot 为 `header`、默认正文和 `footer`：

```xml
<pui-sheet
  id="deliverySheet"
  visible="{{sheetVisible}}"
  title="组件操作"
  show-footer
  draggable
  height="360"
  error="{{sheetError}}"
  bind:input="onSheetInput"
  bind:change="onSheetChange"
  bind:drag-end="onSheetDragEnd"
  bind:scroll="onSheetScroll"
  bind:retry="onSheetRetry"
  bind:after-close="onSheetAfterClose"
>
  <pui-cell title="发布检查" description="Sheet + Cell + Tag" value="ready" />
  <pui-tag theme="primary" variant="outline">可发布</pui-tag>
  <view slot="footer">
    <pui-button size="small" variant="outline" bind:click="closeSheet">稍后</pui-button>
    <pui-button size="small" theme="primary" bind:click="continueSheet">继续</pui-button>
  </view>
</pui-sheet>
```

H5 使用 Pointer Events 和局部 overflow 镜像原生 touch/scroll-view，尺寸按 `1px≈2rpx` 映射；受控操作仍只经 Props 回写。两端都保留节点至退场完成，H5 额外响应 `prefers-reduced-motion`。footer、retry 和 drag 只回传消费者动作，不伪造保存或加载成功。

## Dialog

结构、间距、Slot、状态组合、预览与跨端边界必须同时遵守 [Dialog 组件语义合同](./components/DIALOG.md)。

`pui-dialog` 是由父级 `visible` 控制的中心模态。它组合 `pui-popup` 承担遮罩、层级和进退场，组合 PUI Button 承担内建操作；它不维护第二套显隐状态，也不把加载、空、错误或重试伪装成 Dialog 自身能力。此类内容应由调用方在 `content` slot 中组合 PUI Loading、Empty 与 Button。

Dialog 公开 17 个 Props、5 个 Events、8 个具名 Slots 和 `close()` 方法。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `visible` | `Boolean` / `false` | 唯一显隐真相源。`false` 是明确关闭；收到 `close` 后由父级回写 `false`。 |
| `actions` | `DialogButtonProps[]` / `[]` | 非空时渲染数组按钮，每项支持 `content`、`text`、`label`、`theme`、`variant`、`size`、`shape`、`icon`、`loading`、`disabled`、`ariaLabel`；点击只触发 `action({ index })`。 |
| `buttonLayout` | `'horizontal' \| 'vertical'` / `'horizontal'` | 默认按钮或数组动作的排列方式。 |
| `cancelBtn` | `String \| Number \| DialogButtonProps \| null` / `null` | 内建取消按钮。使用 PUI Button 的中性 `base` 样式；`null` 或 `false` 不渲染。 |
| `closeBtn` | `Boolean \| DialogCloseButtonProps` / `true` | 右上默认关闭入口；对象可设置 `icon`、`disabled` 与 `ariaLabel`。 |
| `closeOnOverlayClick` | `Boolean` / `false` | `true` 时遮罩点击固定按 `overlay-click → close({ trigger: 'overlay' })` 请求关闭。 |
| `confirmBtn` | `String \| Number \| DialogButtonProps \| null` / `null` | 内建确认按钮。默认主题为 `primary`；点击只触发 `confirm`，是否关闭由父级决定。 |
| `content` | `String` / `''` | 文本正文；与 `content` slot 并列时由调用方避免重复内容。 |
| `overlayProps` | `OverlayProps` / `{}` | 当前映射 `backgroundColor` 到 Popup 遮罩；其余字段不作虚假兼容承诺。 |
| `preventScrollThrough` | `Boolean` / `true` | 遮罩显示时阻止遮罩触摸事件向页面滚动穿透。 |
| `showOverlay` | `Boolean` / `true` | 是否渲染遮罩；不改变 Dialog 本体的受控显隐。 |
| `showFooter` | `Boolean` / `false` | 没有内建动作但需要 actions/cancel-btn/confirm-btn Slot 时显式挂载 Footer。 |
| `title` | `String` / `''` | 标题文字；Header 采用固定三列，使标题在有无 Close 时均保持几何居中。 |
| `usingCustomNavbar` | `Boolean` / `false` | 转发给 Popup 的自定义导航栏上下文标记。 |
| `zIndex` | `Number` / `11500` | 传给 Popup 的层级，运行时规整到 `1–12000`。 |
| `ariaLabel` | `String` / `''` | 辅助名称；空值依次回退 `title`、`'对话框'`。 |
| `reduceMotion` | `Boolean` / `false` | 将 Popup 进退场压缩到 `1ms`；正常动效固定为 `500ms`。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `confirm` | `无` | 内建确认按钮可用时触发；Dialog 不自动关闭。 |
| `cancel` | `无` | 内建取消按钮可用时先触发；随后固定触发 `close({ trigger: 'cancel' })`。 |
| `close` | `{ trigger: 'cancel' \| 'close-btn' \| 'overlay' \| 'programmatic' }` | 关闭请求发生时触发；父级据此回写 `visible=false`。 |
| `overlay-click` | `无` | 遮罩点按时先触发；只有 `closeOnOverlayClick=true` 才接续 `close`。 |
| `action` | `{ index }` | `actions` 中可用按钮点按时触发；不自动关闭。 |

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `close()` | `Boolean` | 发布 `close({ trigger: 'programmatic' })` 请求；父级回写 `visible=false` 后由 Popup 完成退场。已关闭时返回 `false`。 |

Dialog Surface 固定为 Header、Content、Footer 三个平级区域；复用 Popup 时清除 Popup Content 的重复 padding。Header 使用 `72rpx | minmax(0,1fr) | 72rpx` 三列 Grid，左侧可选 `header-left` 紧凑图标按钮（PUI Button 需声明 `icon-only`），右侧为默认圆形 Close。Footer 按一个或两个动作形成一列或两列全宽 Grid，左右、底部和按钮间距相等。超长内容只有 Content 可以内部滚动。

基础用法只声明组件本体，不展示事件全集：

```xml
<pui-dialog id="publish-dialog" />
```

实际受控回写可只绑定当前业务需要的事件：

```xml
<pui-dialog
  visible="{{publishDialogVisible}}"
  title="确认发布组件？"
  content="确认只发出业务事件，由页面完成发布。"
  cancel-btn="取消"
  confirm-btn="确认发布"
  close-btn
  bind:confirm="onPublishConfirm"
  bind:close="onPublishDialogClose"
/>
```

八个具名 Slot 为 `top`、`header-left`、`title`、`content`、`middle`、`actions`、`cancel-btn`、`confirm-btn`。其中 `header-left` 只承载一个声明 `icon-only` 的紧凑 PUI 圆形图标按钮；`content` 用于组合 Cell、Badge、Loading、Empty、Button 等现有 PUI 组件。`actions`、`cancel-btn`、`confirm-btn` 是操作区组合入口，Slot 内按钮的业务事件仍归消费者。

Popup 在关闭请求后保留节点至其真实退场完成；Dialog 不建立重复动画。H5 镜像同步 17 个 Props、上述事件顺序、四个分区示例和 500ms/1ms 动效；Escape 仅是浏览器辅助关闭入口，原生小程序不宣称 DOM focus trap 或硬件键盘能力。

## Direction

`pui-direction` 是作用于整个默认 slot 子树的阅读方向 Provider，不是横向/纵向布局属性。它把显式 `ltr` / `rtl` 或按语言解析的 `auto` 写入真实 WXML 根节点的 `direction`，并将逻辑 `start` / `end` 映射为当前方向下的物理文本对齐。Direction 不伪造 loading、empty 或 error，因为这些状态不属于阅读方向职责。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `direction` | `'ltr' \| 'rtl' \| 'auto'` / `'ltr'` | 显式阅读方向，或按语言自动解析；非法值回退到 `fallbackDirection`。 |
| `language` | `String` / `''` | `auto` 的显式 BCP 47 风格语言，例如 `ar-SA`、`fa-IR`、`zh-CN`；下划线会规整为连字符。 |
| `fallbackDirection` | `'ltr' \| 'rtl'` / `'ltr'` | `auto` 无法取得语言或 `direction` 非法时使用的方向。 |
| `textAlign` | `'start' \| 'end' \| 'left' \| 'right' \| 'center'` / `'start'` | start/end 随已解析方向转换；left/right/center 保持物理含义。 |
| `display` | `'block' \| 'inline-block' \| 'flex' \| 'inline-flex'` / `'block'` | Provider 根容器形态；非法值回退 block。 |
| `content` | `String` / `''` | `useSlot=false` 时渲染的回退文本。 |
| `useSlot` | `Boolean` / `true` | 是否渲染默认 slot；关闭后改为渲染 `content`。 |
| `selectable` | `Boolean` / `false` | 仅控制回退 `content` 文本的 `user-select`。 |
| `ariaLabel` | `String` / `'阅读方向容器'` | Provider 根节点的辅助名称。 |
| `duration` | `Number` / `500` | 方向真实变化时淡出/淡入的总时长，限制为 `0–1000ms`。 |
| `easing` | `String` / `'standard'` | `standard/ease/linear/ease-in/ease-out/ease-in-out`；非法值回退 standard。 |
| `reduceMotion` | `Boolean` / `false` | 将总动效压缩到 `1ms`。 |
| `customClass` | `String` / `''` | 追加到根节点的外部类名；同时公开 `custom-class` external class。 |
| `customStyle` | `String` / `''` | 追加到根节点的受信任内联样式。 |

四个事件共享 `{ requestedDirection, direction, previousDirection, language, languageSource, fallbackUsed, textAlign, display, source, error }` 详情：

| 事件 | 触发条件 |
| --- | --- |
| `resolve` | attached、相关 Props 变化或调用 `refresh()` 后，每次完成解析都触发。 |
| `ready` | 首次 attached 解析完成，只触发一次。 |
| `change` | 已解析方向确实从 ltr 变为 rtl 或反向变化；只改语言但方向未变时不触发。 |
| `after-change` | 方向变化的完整淡出/淡入总时长结束；`duration=0` 时与 change 同步触发。 |

实例方法为 `refresh(source?)`（重新读取语言并返回解析快照）、`getDirection()`（返回当前 ltr/rtl）和 `getState()`（返回当前请求值、语言来源、对齐、display 与 changing）。`auto` 的读取顺序是 `language` Prop、`wx.getAppBaseInfo().language`、`fallbackDirection`；不再调用已弃用的 `wx.getSystemInfoSync()`。

```xml
<pui-direction
  id="releaseDirection"
  direction="{{readingDirection}}"
  language="{{readingLanguage}}"
  text-align="start"
  display="block"
  bind:resolve="onDirectionResolve"
  bind:ready="onDirectionReady"
  bind:change="onDirectionChange"
  bind:after-change="onDirectionAfterChange"
>
  <pui-cell title="مرحبا بكم في PoemUI" description="Direction + Cell + Tag" value="RTL" />
  <pui-tag theme="primary" variant="outline">可组合默认 slot</pui-tag>
</pui-direction>
```

Direction 提供和 Radix/shadcn Direction Provider 同类的子树方向边界，但不会自动改写已有组件中的物理 `left/right` WXSS，也不会判断并翻转箭头、返回等方向性图标。组件若要完整 RTL，需要继续使用逻辑布局并显式处理方向性图形；H5 的 `dir`、`navigator.language` 和 CSS direction 只是对小程序 WXML/WXSS、微信语言 API 的可操作镜像。

## Switch

`pui-switch` 是精简的二元状态输入，不负责保存设置或宣告业务成功。公开合同为 11 Props、1 个 `change` 事件、0 Slot、0 Method；外部标题、说明、必填和校验反馈应通过 Cell、Field 或 Form 组合。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `value` | `string \| number \| boolean \| null` / `null` | 受控原始值，按 `customValue[0]/[1]` 解析；`false`、`0`、空字符串均可作为合法值。 |
| `defaultValue` | `string \| number \| boolean \| null` / `null` | 非受控原始初值，仅初始化一次；后续修改不覆盖用户操作。 |
| `customValue` | `[Value, Value]` / `[true, false]` | 两个互异的 string/number/boolean `[开启值, 关闭值]`；非法、非有限、对象或同值数组回退布尔值。 |
| `label` | `[String, String]` / `[]` | 轨道内 `[开启文字, 关闭文字]`；有内容时轨道真实扩宽。 |
| `icon` | `[String, String]` / `[]` | 拇指内 `[开启图标, 关闭图标]`，使用内部 PUI Icon。 |
| `size` | `'small' \| 'medium' \| 'large'` / `'medium'` | 三档真实宽高，不使用 scale 造成布局占位错位。 |
| `disabled`、`readonly`、`loading` | `Boolean` / `false` | 三者都完全阻断写操作且不触发 change；loading 使用内部 PUI Loading，readonly 保留独立语义。 |
| `ariaLabel` | `String` / `''` | switch 辅助名称；为空时回退“开关”。 |
| `reduceMotion` | `Boolean` / `false` | 将固定500ms轨道、拇指和文字过渡压缩为1ms。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ value, checked, previousValue, previousChecked, source: 'track', controlled }` | 可写轨道点击且值真实请求变化时触发一次；受控模式等待父级回写 `value`。disabled、readonly、loading 不触发。 |

```xml
<pui-switch />
```

带原始值与文字/图标的受控用法：

```xml
<pui-switch
  value="{{notificationValue}}"
  custom-value="{{notificationValues}}"
  label="{{['ON', 'OFF']}}"
  icon="{{['check', 'close']}}"
  bind:change="onSwitchChange"
/>
```

H5 使用真实 `<button role="switch">` 镜像 WXML `view role="switch"`。两端都以 transform 移动拇指、保留原始 customValue、服从父级回写，并以固定500ms或低动效1ms过渡；H5 额外响应 `prefers-reduced-motion`。

## Checkbox

`pui-checkbox` 表示一个声明式复选项，`pui-checkbox-group` 通过真实 relation 管理数组值、全选半选、最大选择数和父级状态继承。Checkbox 的 `value` 只表示 string/number/boolean 选项身份，不再兼任布尔选中别名。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `checked` | `Boolean \| null` / `null` | 单项受控选中值；交互只发布一次 change，父级回写前视觉不提前变化。 |
| `defaultChecked` | `Boolean` / `false` | 未传 checked 时仅初始化一次；controlled → uncontrolled 保留最后渲染值。 |
| `value` | `String \| Number \| Boolean` / `''` | 选项身份；数字0、布尔false和空字符串均为合法且互不混淆的值。 |
| `label`、`content` | `String` / `''` | 主标签与补充说明；同名 Slot 可接管可见内容。 |
| `icon` | `String \| [String, String, String]` / `'circle'` | circle、line、rectangle、none，或按“选中、未选、半选”提供三态 PUI Icon 名称。 |
| `indeterminate`、`checkAll` | `Boolean` / `false` | 半选视觉状态与 Group 全选项标识；全选项本身不会写入数组。 |
| `block` | `Boolean` / `true` | 占满可用宽度；false 可用于横向组。 |
| `borderless` | `Boolean \| null` / `null` | 无中性 Surface；null 时继承 CheckboxGroup。 |
| `contentDisabled` | `Boolean` / `false` | 只阻止正文区域触发，图形仍可请求 change。 |
| `disabled`、`readonly` | `Boolean \| null` / `null` | 静默阻止写交互；null 时继承 Group。不会发布 blocked click 或假 change。 |
| `name` | `String` / `''` | 表单字段与 H5 input 名称。 |
| `placement` | `'left' \| 'right'` / `'left'` | mark 位于正文左侧或右侧；非法值回退 left。 |
| `maxLabelRow`、`maxContentRow` | `Number` / `3`、`5` | 标签与说明最大行数；非正数分别回退3和5。 |
| `ariaLabel` | `String` / `''` | 辅助名称；为空时依次按 label、content、name、checkAll 回退。 |
| `reduceMotion` | `Boolean` / `false` | 将固定500ms图形、颜色和边界过渡压缩为1ms。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ checked, previousChecked, value, label, indeterminate, checkAll, source, controlled }` | mark 或 content 的值真实请求变化时触发一次；受控模式等待父级回写。disabled、readonly、contentDisabled 阻断路径静默。 |

| slot | 说明 |
| --- | --- |
| 默认 slot | 标签/说明后的补充内容。 |
| `label` | 接管主标签内容；label 文本仍可作为辅助名称回退。 |
| `content` | 接管补充说明；contentDisabled 仍只限制该正文区。 |

### CheckboxGroup

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `options` | `CheckboxOption[]` / `[]` | 标量或对象选项；对象支持 value/label/content/icon/checkAll/block/borderless/contentDisabled/disabled/readonly/placement/maxLabelRow/maxContentRow/ariaLabel。 |
| `value` | `Value[] \| null` / `null` | 受控数组；严格保留 string/number/boolean，父级回写前不提前改变。 |
| `defaultValue` | `Value[]` / `[]` | 非受控初值，仅初始化一次；退控保留最后渲染数组。 |
| `keys` | `{ value?, label?, content? }` / `{}` | 对象选项字段映射。 |
| `max` | `Number` / `0` | 最大选择数；0不限，达限的新增请求静默拒绝。 |
| `name` | `String` / `''` | 组级表单字段名。 |
| `borderless`、`disabled`、`readonly` | `Boolean` / `false` | 作为子项默认值；子 Checkbox 显式值优先。 |
| `ariaLabel` | `String` / `''` | 组容器辅助名称。 |
| `reduceMotion` | `Boolean` / `false` | 将组内过渡压缩为1ms。 |

Group 只公开一个 `change`：`{ value, previousValue, changedValue, checked, source, controlled, checkAll }`。达到 max、禁用、只读或值未变化时不触发。默认 Slot 用于手动组合 `pui-checkbox`。

```xml
<pui-checkbox-group
  options="{{releaseOptions}}"
  default-value="{{releaseDefaults}}"
/>
```

基础用法零 bind；需要响应选值时只在业务示例中为 Group 绑定一次 `bind:change`。H5 使用真实 `input[type=checkbox]` 和 DOM `indeterminate`，小程序由 relation 同步子项；两端共享严格原始值、max、全选半选、父级回写与500ms/1ms动效。

## Radio / Radio Group

`pui-radio` 是单个互斥选项，`pui-radio-group` 是独立分组容器。两者通过 relation 同步，不再让一个组件按 `options` 是否存在切换两套职责。`value` 只表示 `string/number/boolean` 原始身份；数字 `0`、布尔 `false` 与空字符串互不混淆。

### Radio Props

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `checked` | `Boolean \| null` / `null` | 单项受控选中值；交互只请求父级回写，`null` 为非受控。 |
| `defaultChecked` | `Boolean` / `false` | 非受控初值，仅初始化一次；退控保留最后渲染值。 |
| `value` | `String \| Number \| Boolean` / `false` | 选项原始身份，不参与单项 checked 判断。 |
| `label` | `String` / `''` | 主标签文本；`label` Slot 可接管可见内容。 |
| `content` | `String` / `''` | 补充说明文本；`content` Slot 可接管可见内容。 |
| `icon` | `String \| String[] \| null` / `null` | `circle/line/dot/slot/none`，或 `[选中图标, 未选图标]`；空值继承 Group。 |
| `allowUncheck` | `Boolean` / `false` | 再次触发已选项时允许取消。 |
| `block` | `Boolean` / `true` | 是否占满父容器宽度。 |
| `borderless` | `Boolean \| null` / `null` | 是否移除中性 Surface；空值继承 Group。 |
| `contentDisabled` | `Boolean` / `false` | 只阻止正文区域触发，图形仍可选择。 |
| `disabled` | `Boolean \| null` / `null` | 静默阻止全部写交互；空值继承 Group。 |
| `readonly` | `Boolean \| null` / `null` | 保留可读状态并静默阻止写交互；空值继承 Group。 |
| `name` | `String` / `''` | 表单字段名与辅助名称回退。 |
| `placement` | `'left' \| 'right' \| ''` / `''` | 图形位置；空值继承 Group。 |
| `maxLabelRow` | `Number` / `3` | 标签最大行数；非正数回退 3。 |
| `maxContentRow` | `Number` / `5` | 说明最大行数；非正数回退 5。 |
| `ariaLabel` | `String` / `''` | 辅助名称；为空时按 label、content、name 回退。 |
| `reduceMotion` | `Boolean` / `false` | 将固定 500ms 过渡压缩为 1ms。 |

Radio 只公开一个 `change`：`{ checked, previousChecked, value, label, source, controlled }`。只有选中状态真实请求变化时触发；disabled、readonly、正文锁定或重复选择不发布假事件。

Radio Slots：`default`、`label`、`content`、`icon`。默认 Slot 只追加内容，不参与选中值；`icon` 仅在 `icon="slot"` 时接管图形。

### RadioGroup Props

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `options` | `RadioOption[]` / `[]` | 标量或对象选项；对象支持 value/label/content/icon/allowUncheck/block/borderless/contentDisabled/disabled/readonly/placement/maxLabelRow/maxContentRow/ariaLabel。 |
| `value` | `Value \| null` / `null` | 受控标量；保留 string/number/boolean，父级回写前不提前改变。 |
| `defaultValue` | `Value \| null` / `null` | 非受控初值，仅初始化一次；退控保留最后渲染值。 |
| `keys` | `{ value?, label?, content? }` / `{}` | 对象选项字段映射。 |
| `name` | `String` / `''` | 组级表单字段名。 |
| `allowUncheck` | `Boolean` / `false` | 再次选择当前项时允许把组值变为 null。 |
| `icon` | `String \| String[]` / `'circle'` | 子 Radio 默认图形。 |
| `placement` | `'left' \| 'right'` / `'left'` | 子 Radio 默认图形位置。 |
| `borderless` | `Boolean` / `false` | 子 Radio 默认无边框状态。 |
| `disabled` | `Boolean` / `false` | 组级禁用并由子项继承。 |
| `readonly` | `Boolean` / `false` | 组级只读并由子项继承。 |
| `ariaLabel` | `String` / `''` | 组容器辅助名称。 |
| `reduceMotion` | `Boolean` / `false` | 将组内固定 500ms 过渡压缩为 1ms。 |

RadioGroup 只公开一个 `change`：`{ value, previousValue, option, index, source, controlled }`。重复当前项、禁用或只读时不触发；默认 Slot 用于手动组合 `pui-radio`。

```xml
<pui-radio-group
  options="{{releaseOptions}}"
  default-value="{{releaseDefault}}"
/>

<pui-radio label="稳定版" value="stable" />
```

基础用法零 bind；需要响应组选值时只在业务示例中为 Group 绑定一次 `bind:change`。H5 使用真实 `input[type=radio]`，小程序由 relation 同步子项；两端共享严格原始值、受控/非受控、状态继承、Slot 与 500ms/1ms 动效。表单校验、loading、empty、error、retry 由 Form、Field、Loading、Empty 等上层组件组合，不属于互斥选择控件。

## Collapsible

`pui-collapsible` 是单触发器、单内容区的折叠原语。它和 `pui-collapse` 的边界明确：Collapsible 管一个 `open`，适合详情、设置或局部说明；Collapse 管一组 `items/value`，适合 Accordion、多开和互斥面板。两者不共享含混的数组/布尔 API。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `open`、`defaultOpen` | `Boolean \| null`、`Boolean` / `null`、`false` | `open` 非空即受控；交互只请求父级回写。未传时由内部状态管理，`defaultOpen` 只在首次挂载或从受控退回非受控时生效。 |
| `label`、`content` | `String` / `'展开详情'`、`''` | 默认触发器文案与简单正文；复杂内容使用 slot。 |
| `customTrigger`、`customContent` | `Boolean` / `false` | 分别启用 `trigger` slot 和默认 slot；关闭时内容节点仍保留。 |
| `icon`、`expandIcon`、`iconPosition` | `String`、`Boolean`、`'left' \| 'right'` / `''`、`true`、`'right'` | 前导 Icon、展开箭头及箭头位置；非法位置回退 `right`。 |
| `theme`、`bordered`、`shadow`、`block` | `default \| primary \| success \| warning \| danger`、`Boolean`、`Boolean`、`Boolean` / `default`、`true`、`false`、`true` | 语义色、边框、展开态卡片阴影和块级宽度；`shadow=true` 只在 open 时消费 ConfigProvider 的有效阴影 Token，非法主题回退 default。 |
| `disabled`、`readonly` | `Boolean` / `false` | disabled 阻止 trigger、retry 和实例方法；readonly 保留展示并只回传 `blocked=true` 的 trigger click。 |
| `loading`、`loadingText` | `Boolean`、`String` / `false`、`'内容加载中…'` | 正文使用内部 Loading；trigger 仍可开合。 |
| `error`、`errorText`、`retryText` | `Boolean`、`String` / `false`、`'内容加载失败'`、`'重试'` | 错误优先于 loading；内部 Empty/Button 只触发 retry，不自行清除错误。空 retryText 隐藏入口。 |
| `emptyText` | `String` / `'暂无详情'` | 没有 content/default slot 时的内部 Empty 文案。 |
| `ariaLabel` | `String` / `''` | 根节点、触发器和内容区的语义名称；空值回退 label。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`'standard'`、`false` | 高度、透明度、位移与箭头过渡；时长规整到 `0–1000ms`，低动效为 `1ms`。 |

状态优先级为 `error > loading > content > empty`。内容容器不使用 `wx:if`、`display:none` 或 `height:auto`：每次内容/状态变化后通过 selector query 测量 `.pui-collapsible__content-inner`，以像素 `max-height`、透明度和轻位移完成平滑过渡。

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `click` | `{ open, value, previousOpen, source, controlled, blocked }` | 用户点击 trigger；readonly 仅发该事件并标记 blocked，disabled 不发。 |
| `input`、`change` | `{ open, value, previousOpen, source, controlled, blocked }` | open 请求真正变化时按顺序触发。 |
| `open`、`close` | 同上 | 分别跟在 change 后；source 是 `trigger` 或实例方法来源。 |
| `after-open`、`after-close` | `{ open, value, source: 'transitionend', controlled }` | 内容区真实 `max-height` transitionend，重复属性事件会去重。 |
| `retry` | `{ source: 'retry', open }` | error=true、非 disabled 且 retryText 非空时点击重试。 |

实例方法为 `open()`、`close()`、`toggle()`、`retry()` 和用于 slot/字体变化后重新测量的 `measure()`。前三个方法在目标状态没有变化时返回 `false` 且不生成事件；受控模式等待消费者把 `open` 回写。

| slot | 说明 |
| --- | --- |
| `trigger` | `customTrigger=true` 时接管触发器正文；外层 button 语义、禁用和开合逻辑仍由组件控制。 |
| 默认 slot | `customContent=true` 时接管内容区，可组合 `Cell`、`Tag`、`Button`、表单等。 |

```xml
<pui-collapsible
  id="releaseCollapsible"
  open="{{releaseOpen}}"
  custom-trigger
  custom-content
  theme="primary"
  shadow
  bind:input="onCollapsibleInput"
  bind:change="onCollapsibleChange"
  bind:after-open="onCollapsibleAfterOpen"
  bind:after-close="onCollapsibleAfterClose"
  bind:retry="onCollapsibleRetry"
>
  <view slot="trigger"><pui-icon name="command" />发布设置</view>
  <pui-cell title="视觉策略" value="ready" />
  <pui-button size="small" variant="outline">检查设置</pui-button>
</pui-collapsible>
```

H5 使用真实 `<button>`、常驻内容节点、`scrollHeight` 和 `transitionend`；小程序使用 `view role="button"`、selector query、像素 `max-height` 和 `bindtransitionend`。两端共享受控回写、状态门禁、事件顺序、动效上限与无伪恢复 retry。H5 的 `color-mix()` 只用于非关键预览柔和背景，小程序语义色由 WXSS token 提供，不把浏览器能力当作原生实现前提。

## Combobox

`pui-combobox` 是预设选项选择器，不是 `pui-select` 的别名，也不内置搜索。它只管理选值与面板显隐，支持分组、单选/多选、Tag 移除、状态反馈、slot 与实例方法。`pui-search` 是独立组件：调用方在外部筛选 options 后再传给 Combobox。Panel 使用默认 `480rpx` 的固定 `listHeight` 视口，内容、筛选结果和状态变化不改变高度；唯一滚动上下文是内部 option `scroll-view`。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `options` | `ComboboxOption[] \| ComboboxGroup[]` / `[]` | 平铺选项或 `{ label, options }` 分组；选项支持 `label/text/title`、原始 `value`、`description/content`、`icon`、`keywords`、`group`、`disabled`。重复 value 只保留首项，`0` 与 `false` 不会混淆。 |
| `value`、`defaultValue` | `Value \| Value[] \| null` / `null` | `value` 非空即受控；单选返回原始值，多选始终返回数组。`defaultValue` 只在首次初始化或从受控退回非受控时读取。 |
| `visible`、`defaultVisible` | `Boolean \| null`、`Boolean` / `null`、`false` | 受控/非受控面板显隐；受控模式等待页面处理 `visible-input` 后回写。 |
| `multiple`、`maxSelected` | `Boolean`、`Number` / `false`、`0` | 多选及上限；0 表示不限。达到上限只触发 `exceed`，不改变 value。 |
| `placeholder`、`clearable` | `String`、`Boolean` / `'请选择'`、`true` | trigger 提示文案、存在选值时是否显示内部清空 Button。 |
| `showIcon`、`showDescription`、`showGroup`、`showCheck` | `Boolean` / `true` | 控制 option/选值 Icon、说明、组标题和选中 check；不改变数据或选择语义。 |
| `closeOnSelect` | `Boolean \| null` / `null` | 显式控制选择后关闭；null 时单选默认关闭、多选默认保持打开。移除选项不会自动关闭。 |
| `customTrigger`、`customEmpty`、`customFooter` | `Boolean` / `false`、`false`、`false` | 分别启用 `trigger`、`empty`、`footer` 具名 slot；组件仍保留语义、状态机和开合动画。 |
| `placement` | `'bottom' \| 'top'` / `'bottom'` | 面板位于 trigger 下方或上方；小程序使用 flex 顺序映射，不依赖 Web 浮层定位库。 |
| `size`、`shape`、`bordered`、`block` | `'small' \| 'medium' \| 'large'`、`'rectangle' \| 'round'`、`Boolean`、`Boolean` / `'medium'`、`'rectangle'`、`true`、`true` | 触摸区尺寸、Trigger 的矩形/满圆形状、边框表面和块级/有界行内宽度；`round` 不改变 Panel 圆角。 |
| `disabled`、`readonly` | `Boolean` / `false` | disabled 完全阻断 trigger、选择、重试和方法；readonly 允许打开查看，但阻断选择、移除、清空与方法写入。 |
| `loading`、`loadingText` | `Boolean`、`String` / `false`、`'选项加载中…'` | 面板使用内部 Loading；仍允许关闭/重新打开，不允许选项操作。 |
| `error`、`errorText`、`retryText` | `Boolean`、`String`、`String` / `false`、`'选项加载失败'`、`'重试'` | error 优先于 loading；内部 Empty/Button 只派发 retry，不自行清错。空 retryText 隐藏入口。 |
| `emptyText` | `String` / `'暂无选项'` | 没有传入选项时的内部 Empty 文案。 |
| `listHeight` | `Number` / `480` | Panel 与唯一 option `scroll-view` 的固定高度，单位 rpx，限制为 160–800；H5 按约 `1px≈2rpx` 映射。 |
| `ariaLabel` | `String` / `'组合框'` | 根 group、combobox trigger、listbox 和 option 的辅助名称来源。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`'standard'`、`false` | 面板、chevron 与反馈过渡；时长限制 0–1000ms，低动效为 1ms。 |

状态优先级为 `error > loading > content > empty`；error/loading 时不会响应 option。面板节点始终保留，以 `listHeight` 作为确定的固定视口，并过渡 `height`、透明度和轻位移；不使用 `display:none`、`height:auto`、SelectorQuery 或首开测量兜底。Option 行的左右 inset、Icon→正文 gap 和末端 Check 均由 Combobox 内部语义 Token 统一控制，不公开页面级 padding Prop。

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `click` | `{ visible, previousVisible, source: 'trigger', readonly }` | 非 disabled 的 trigger 点击；readonly 仍可打开查看。 |
| `visible-input`、`visible-change` | `{ visible, value, previousVisible, source, controlled }` | trigger、面板关闭入口或显隐方法请求变化。 |
| `open`、`close` | 同显隐详情 | 跟在 visible-change 后；source 保留真实入口。 |
| `after-open`、`after-close` | `{ visible, value, source: 'transitionend', controlled }` | 面板真实 `height` transitionend；重复完成事件会去重。 |
| `input`、`change` | `{ value, previousValue, option, index, selected, multiple, source, controlled }` | 选择、移除、清空或 reset 请求 value 变化。 |
| `select`、`remove` | 同选择详情 | 单项进入或离开当前选择；重复单选不伪造事件。 |
| `clear` | `{ value, previousValue, source, multiple, controlled }` | 清空 Button 或 `clear()` 真正清除已有选择。 |
| `exceed` | `{ maxSelected, option, source }` | 多选或创建超过上限。 |
| `reset` | `{ value, visible, source, *Controlled }` | `reset()` 请求恢复两类 default 值。 |
| `retry` | `{ source: 'retry', visible }` | error=true、非 disabled 且 retryText 非空。 |
| `scroll` | `{ scrollTop, scrollHeight, source: 'scroll' }` | option `scroll-view` 的真实滚动。 |

实例方法为 `open()`、`close()`、`toggle()`、`focus()`、`clear()`、`reset()`、`select(value)`、`deselect(value)`、`retry()`。`focus()` 只请求展开，不暗示软键盘；`select(value)` 从全量 options 查找，并遵守 disabled、loading/error、禁用项与 maxSelected；受控 value/visible 均只请求父级回写。

| slot | 说明 |
| --- | --- |
| `trigger` | `customTrigger=true` 时接管 trigger 正文，可组合 Icon/Tag；外层 combobox 语义与显隐仍由组件管理。 |
| `empty` | `customEmpty=true` 时接管 empty 状态，可组合 Cell/Button 引导。 |
| `footer` | `customFooter=true` 时渲染于面板底部；slot 内 Button 不会被伪装成提交或选择。 |

```xml
<pui-combobox
  id="frameworkCombobox"
  options="{{frameworkOptions}}"
  value="{{frameworkValue}}"
  visible="{{frameworkVisible}}"
  multiple
  max-selected="3"
  list-height="480"
  custom-footer
  bind:visible-input="onComboboxVisibleInput"
  bind:input="onComboboxInput"
  bind:change="onComboboxChange"
  bind:select="onComboboxSelect"
  bind:remove="onComboboxRemove"
  bind:exceed="onComboboxExceed"
  bind:after-open="onComboboxAfterOpen"
  bind:after-close="onComboboxAfterClose"
  bind:reset="onComboboxReset"
  bind:retry="onComboboxRetry"
>
  <view slot="footer">
    <pui-tag variant="outline">Combobox + Tag</pui-tag>
    <pui-button size="small">应用选择</pui-button>
  </view>
</pui-combobox>
```

若需要搜索，调用方在上方组合 `<pui-search value="{{frameworkQuery}}" bind:change="onSearchChange" />`，再将筛选后的 `frameworkOptions` 传给 Combobox。H5 使用固定高度局部滚动与 `transitionend` 镜像同一合同；小程序使用 Tag、Button、scroll-view 与 WXSS token。两端都不把 retry 或 footer 点击冒充业务保存成功。

## 已验收的表单与反馈组件

| 组件 | 关键属性 | 关键事件 |
| --- | --- | --- |
| `Input` | 受控/非受控值、原生键盘参数、尺寸/对齐、Icon/slot、清空/加载/错误、语义与动效 | `input`、`change`、`clear`、`focus`、`blur`、`confirm`；5 个实例方法 |
| `Textarea` | 29 Props：受控/非受控值、双字符上限、autosize、尺寸/状态、键盘参数、`label/tips/extra` slot 与固定动效 | `change/focus/blur/enter/line-change/keyboardheightchange`；3 个实例方法 |
| `Search` | 17 Props：值与字符上限、清空策略、取消操作、形状/居中、禁用/只读、焦点/键盘与低动效；1 个默认 Slot；0 Methods | `change`、`clear`、`search`、`cancel`、`focus`、`blur`；清空固定 `clear → change` |
| `Switch` | `value`、`checked`、`defaultValue`、`size`、`loading`、`disabled` | `change` |
| `Checkbox` | `value`、`checked`、选中/半选默认值、标签/说明、位置/尺寸、状态、slot、动效 | `click`、`input`、`change`；4 个实例方法 |
| `Combobox` | options/value/visible、单/多选、分组、固定滚动视口、三类 slot、状态/动效 | visible/input/change/select/remove/exceed/retry/scroll；9 个实例方法 |
| `Radio / RadioGroup` | Radio 18 Props / 1 Event / 4 Slots；RadioGroup 13 Props / 1 Event / 1 Slot | 独立 relation、严格原始标量、受控回写、父级状态继承；0 Method |
| `Stepper` | `value`、`defaultValue`、`min`、`max`、`step`、`integer`、`disableInput`、动效 | `input`、`change`、`focus`、`blur` |
| `Slider` | 16 Props：受控/非受控、表单、边界/步长、只读/禁用、数值辅助与低动效 | `changing`、`change`；无 Slot 或实例方法 |
| `Rate` | 13 Props：受控/非受控、星数/尺寸/间距、半星/文案、只读/禁用与低动效 | `change`；无 Slot 或实例方法 |
| `Upload` | `files`、`defaultFiles`、数量/来源、列表/网格、校验、预览/删除 | `change`、`add`、`remove`、`preview`、`retry`、`cancel`、`reject`、`error` |
| `Loading` | 环形/圆点、延迟、全屏、进度、暂停/反向、显隐动效 | `show`、`hide` |
| `Progress` | 10 Props：确定 percentage、line/plump/circle、状态/颜色、唯一 label Slot、ARIA 与低动效 | 无 Events 或实例方法 |
| `Tabs` | items/value/defaultValue、variant/size、滚动/指示器/吸顶/滑动、状态/slot/动效 | `click`、`input`、`change`、`retry`、`animationend`；实例方法 |
| `Toast` | 主题、位置、停留时间、Overlay、具名 Slot 与语义 | `close`；`show(options)`、`hide()` |
| `Dialog` | 16 Props：`visible`、内容与按钮、遮罩与层级、语义与低动效；7 个具名 Slot | `confirm`、`cancel`、`close`、`overlay-click`、`action`；`close()` |

## Input

### Input：TDesign 对照后的 31 Props

`pui-input` 是对微信原生 `input` 的单一状态与组合层。`value` 非 `null/undefined` 时进入受控模式：用户输入和清空只发出请求，父级回写前保持当前值；退控后继续最后一次受控渲染值。未传 `value` 时由 `defaultValue` 仅初始化一次。空字符串、数字 `0` 和布尔 `false` 都是合法受控值并规整为显示字符串。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `value`、`defaultValue` | `String \| Number \| null` / `null`、`''` | 受控值与仅初始化使用的非受控初值。输入事件始终输出字符串。 |
| `name`、`label`、`placeholder` | `String` / `''`、`''`、`'请输入'` | 表单名、字段标签与空值提示。 |
| `type` | `String` / `'text'` | `text/number/idcard/digit/safe-password/password/nickname`；非法类型回退 text，密码统一由 type 表达。 |
| `maxlength`、`maxcharacter` | `Number` / `-1`、`-1` | Unicode 字符上限与加权字符上限；后者启用时优先，ASCII=1、非 ASCII 与 emoji=2，均不会截断半个代理对。 |
| `size`、`align` | `String` / `'medium'`、`'left'` | `small/medium/large` 与 `left/center/right`；非法值分别回退 medium/left。 |
| `bordered`、`clearable` | `Boolean` / `true`、`false` | 是否显示中性边界；clearable 启用内部 PoemUI Button/Icon 清空操作。 |
| `clearTrigger` | `String` / `'focus'` | `focus/always`；普通 Input 默认只在真实聚焦、有值且可交互时显示 Clear，非法值回退 focus。 |
| `prefix`、`prefixIcon`、`suffix`、`suffixIcon` | `String` / `''` | 前置短文本、前置 Icon、后置短文本和最右 Icon；对应值为 `slot` 时启用同名 Slot。 |
| `disabled/readonly/loading` | `Boolean` / `false` | 三者都阻断用户输入、清空、聚焦与确认；loading 组合内部 Loading 并设置 busy 语义。 |
| `focus`、`confirmType` | `Boolean`、`String` / `false`、`'done'` | 请求原生焦点；确认类型支持 `done/go/next/search/send`。 |
| `status`、`tips` | `String` / `'default'`、`''` | 状态为 `default/success/warning/error`；提示值为 `slot` 时启用 tips Slot，error 同时设置 invalid 语义。 |
| `required`、`ariaLabel` | `Boolean`、`String` / `false`、`''` | 必填标记与可访问名称；名称为空时回退 label/placeholder/输入框。 |
| `cursorSpacing` | `Number` / `0` | 直接映射微信原生键盘间距；H5 没有等价软键盘合同。 |
| `adjustPosition/holdKeyboard/confirmHold` | `Boolean` / `true/false/false` | 直接映射微信键盘位置、失焦保留和确认后保留能力。 |
| `reduceMotion` | `Boolean` / `false` | 边框、背景、阴影和透明度固定 500ms；低动效压缩为 1ms。 |

| 事件 | detail | 说明 |
| --- | --- | --- |
| `change` | `{ value, previousValue, source, controlled, name, cursor?, keyCode? }` | 每次真实输入请求；受控模式等待父级回写，不重复发布 input。 |
| `clear` | 同 change，`source='clear' \| 'method-clear'` | 清空顺序固定为 `clear → change`，不冒充表单提交。 |
| `focus`、`blur` | `{ value, source, controlled, name, detail }` | 原生焦点事件与原始 detail。 |
| `enter` | `{ value, source:'enter', controlled, name, detail }` | 微信键盘确认，disabled/readonly/loading 不触发。 |

| Slot | 激活方式 | 说明 |
| --- | --- | --- |
| `label` | `label="slot"` | 接管字段标签；required 星号仍由 Input 管理。 |
| `prefix` | `prefix="slot"` | 接管输入前置短文本区域。 |
| `prefix-icon` | `prefix-icon="slot"` | 接管输入前置图标区域。 |
| `suffix` | `suffix="slot"` | 接管右侧后置内容；可组合一个紧凑 PUI IconButton 作为保存、验证或复制操作。它与 Clear、Loading、suffix-icon 共用尾部操作轨，按钮事件仍由消费者直接绑定。 |
| `suffix-icon` | `suffix-icon="slot"` | 接管最右侧图标区域。 |
| `tips` | `tips="slot"` | 接管状态提示，颜色跟随 status。 |
| `extra` | 直接传入 | 输入框下方的消费者扩展内容，不参与值与事件计算。 |

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `focus()`、`blur()` | `Boolean` | 请求原生聚焦/失焦；不可交互时 focus 返回 false。 |
| `clear()` | `Object \| false` | 请求清空并按 `clear → change` 发布；受控模式仍等待父级回写。 |
| `getValue()` | `String` | 读取当前实际渲染值。 |

基础用法保持最小，不绑定所有事件：

```xml
<pui-input placeholder="请输入内容" />
```

事件专项用法只绑定业务需要的事件：

```xml
<pui-input
  value="{{componentName}}"
  name="componentName"
  label="组件名称"
  clearable
  bind:change="onComponentNameChange"
  bind:clear="onComponentNameClear"
  bind:enter="onComponentNameEnter"
/>
```

小程序没有与 HTML `readonly` 完全相同且跨基础库稳定的单行输入属性，因此原生端锁定 input 保证只读值不会被键盘临时改写；H5 执行同一写入门禁。浏览器的 `type=number/password`、自动聚焦只用于近似微信 `digit/safe-password/focus`，键盘外观、昵称授权、安全密码能力、软键盘保持和页面上推仍以微信真机为准。

## Form

### Form：可组合父容器与真实规则校验

`pui-form` 使用微信原生 `form` 作为透明根容器，通过真实 Form–Field relation 注册字段。它只读取父级受控 `data`、执行集中规则、发布校验/提交/重置结果，不生成固定 Input、Button 或业务成功状态。

| 属性 | 类型 / 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- |
| `data` | `Object` / `{}` | 任意字段对象 | 当前受控数据；`0`、`false`、空字符串均被保留。输入值必须由子控件 change 后经父级真实回写。 |
| `rules` | `Object` / `{}` | 字段名到规则数组 | 每条规则表达一个 required/whitespace/min/max/len/pattern/enum/number/boolean/email/url/telnumber/idcard/validator 约束，可带 message/type/trigger。 |
| `showErrorMessage` | `Boolean` / `true` | `true, false` | 是否在关联 Field 显示消息文字；关闭后校验状态、errors/warnings 与 invalid 结果仍保留。 |
| `scrollToFirstError` | `String` / `''` | `'', auto, smooth` | 校验失败时定位第一个已注册 Field；smooth 在低动效下自动降为无动画。 |
| `resetType` | `String` / `'initial'` | `initial, empty` | 原生 reset 的数据生成策略；只触发父级回写请求，不修改当前 data Prop。 |
| `ariaLabel` | `String` / `'表单'` | 任意非空文字 | 原生 form 根的可访问名称。 |
| `reduceMotion` | `Boolean` / `false` | `true, false` | Field 反馈与首错定位使用固定500ms；开启后压缩为1ms/无滚动动画。 |

| 事件 | 详情 | 说明 |
| --- | --- | --- |
| `validate` | `{ valid, errors, warnings, data, fields, firstError, trigger }` | 每次 validate/submit 完成后先触发；错误和警告按字段保留完整消息数组。 |
| `submit` | 同 validate 最终快照 | 原生 submit 或 `submit()` 固定在 validate 后触发；通过只表示可继续业务请求，不代表请求成功。 |
| `reset` | `{ data, fields, type, controlled: true }` | 原生 reset 或 `reset()` 生成下一份 initial/empty 数据，等待父级回写。 |

| Slot | 说明 |
| --- | --- |
| `default` | 组合 Field 与真实 Input、Select、Switch、RadioGroup 等控件；提交和重置由消费者使用 PUI Button 组合。 |

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `validate(options?)` | `Promise<Object>` | 按 fields/trigger 校验当前受控 data，更新关联 Field，并触发 validate。 |
| `submit(options?)` | `Promise<Object>` | 以 submit 触发器校验，固定发布 validate → submit；不代替业务提交。 |
| `reset(options?)` | `Object` | 按 fields 与 initial/empty 生成下一份 data，清除对应消息并触发 reset。 |
| `clearValidate(fields?)` | `void` | 清除全部或指定 Field 的校验反馈，不改变 data。 |
| `setValidateMessage(messages)` | `Object` | 写入服务端/业务 error 或 warning 消息，不改变 data。 |

基础用法只展示必要结构，不把事件全集写入 WXML：

```xml
<pui-form data="{{formData}}" rules="{{formRules}}">
  <pui-field name="name" label="组件名称">
    <pui-input value="{{formData.name}}" placeholder="请输入组件名称" />
  </pui-field>
  <pui-button form-type="submit">提交</pui-button>
</pui-form>
```

需要响应数据与结果时，只绑定当前业务需要的事件：

```xml
<pui-form
  data="{{formData}}"
  rules="{{formRules}}"
  bind:validate="onFormValidate"
  bind:submit="onFormSubmit"
  bind:reset="onFormReset"
>
  <pui-field name="name" label="组件名称">
    <pui-input value="{{formData.name}}" bind:change="onNameChange" />
  </pui-field>
  <pui-button form-type="reset">重置</pui-button>
  <pui-button form-type="submit">提交</pui-button>
</pui-form>
```

TDesign Mini Program 1.15.3 Form 同时承载 label/requiredMark 等布局默认项。PoemUI 将这些视觉职责留在 Field，Form 只保留受控数据、集中规则、校验顺序与父级回写；warning 不阻断 valid，但完整进入结果。H5 使用真实 HTML form 和共享 PUI Field/Input/Switch/Radio/Button 镜像，不伪造平台提交或业务成功。

## Field

### Field：TDesign FormItem 对照后的 12 Props

`pui-field` 是统一 Field 行的可编辑形态：`pui-cell` 复用同一行级视觉内核作为只读态。Field 将标签、真实 PUI 控件、帮助、校验反馈和右侧箭头组织在同一条任务路径中。它不拥有字段值，也不伪造 disabled、readonly、loading、change、validate 或 submit；这些能力属于默认 Slot 内的 Input/Select/Switch 等控件或外层 Form。嵌入的 `pui-input` 在普通态会退为透明，避免两层输入框。

| 属性 | 类型 / 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- |
| `name` | `String` / `''` | — | 字段标识，用于业务数据或 Form 定位；Field 自身不读写该值。 |
| `label` | `String` / `''` | 任意文字、`slot` | 字段标签；值为 `slot` 时由 label 具名 Slot 接管。 |
| `help` | `String` / `''` | 任意文字、`slot` | 长期帮助文本；值为 `slot` 时由 help 具名 Slot 接管，不表示校验失败。 |
| `message` | `String` / `''` | 任意文字、`slot` | 当前状态或校验反馈；值为 `slot` 时由 message 具名 Slot 接管。 |
| `status` | `String` / `'default'` | `default, success, warning, error` | 控制 message 的语义颜色；error 同时设置根 invalid 与反馈 alert 语义。不会擅自修改 Slot 子控件状态。 |
| `required` | `Boolean` / `false` | `true, false` | 显示必填标记；不会替代 Form 规则或子控件 required。 |
| `requiredMarkPosition` | `String` / `'left'` | `left, right` | 必填标记位于标签左侧或右侧。 |
| `labelAlign` | `String` / `'left'` | `top, left, right` | 默认左标签、右控件，形成可编辑 Cell；`top` 用于多行或较长的控件，`right` 右对齐标签列。 |
| `contentAlign` | `String` / `'left'` | `left, right` | 默认 Slot 控件区域的水平对齐；满宽 Input 仍按自身宽度占满可用空间。 |
| `labelWidth` | `Number` / `160` | `80–360` | `labelAlign=left/right` 时的标签列宽，单位 rpx；非法值回退 160。 |
| `arrow` | `Boolean` / `false` | `true, false` | 在右侧组合 PUI Icon 箭头；不因此增加或伪造 Field 点击事件。 |
| `reduceMotion` | `Boolean` / `false` | `true, false` | 帮助与反馈颜色过渡固定 500ms；开启后压缩为 1ms。 |

| Slot | 激活方式 | 说明 |
| --- | --- | --- |
| `default` | 直接传入 | 字段控件；推荐组合 pui-input、pui-select、pui-switch 等真实 PUI 控件。 |
| `label` | `label="slot"` | 接管标签内容；required 标记仍由 Field 管理。 |
| `help` | `help="slot"` | 接管帮助内容，不改变 status。 |
| `message` | `message="slot"` | 接管反馈内容；颜色与可访问角色继续跟随 status。 |
| `extra` | 直接传入 | 反馈区后的消费者扩展内容；Field 不解释其状态或事件。 |

Field 没有公开事件和实例方法。基础用法保持最小，事件只绑定到真正产生交互的子控件：

```xml
<pui-field label="组件名称">
  <pui-input placeholder="请输入组件名称" />
</pui-field>
```

错误反馈必须让 Field 与子控件各自承担真实职责：Field 展示说明，Input 展示输入边界，父级只绑定业务需要的 change。

```xml
<pui-field
  name="packageName"
  label="npm 包名"
  message="包名已存在"
  status="error"
  required
>
  <pui-input
    value="{{packageName}}"
    name="packageName"
    placeholder="请输入 npm 包名"
    status="error"
    required
    bind:change="onPackageNameChange"
  />
</pui-field>
```

TDesign Mini Program 1.15.3 FormItem 公开 `arrow/contentAlign/help/label/labelAlign/labelWidth/name/requiredMark/rules/showErrorMessage`，并通过父 Form 关系提供规则与校验方法。PoemUI 对齐前八类用户可见布局语义，并已建立真实 Form–Field relation；rules/showErrorMessage 仍由父 Form 集中持有，Field 只接收内部计算结果，避免重复事实源。PoemUI 额外保留 message/status、必填标记位置、五类 Slot 和固定低动效，以承接独立组合与真实反馈。旧版 `description/error/disabled/orientation` 已移除：前两项合并为 help/message，disabled 无法可靠禁用 Slot 子控件，orientation 被 labelAlign 完整替代。

## Label

`pui-label` 为表单控件提供可组合的文字标签、必填标记和冒号格式；它不管理关联控件的值、校验、事件或实例方法。

| 属性 | 类型 / 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- |
| `content` | `String` / `''` | 任意文字 | 标签内容；空字符串时只渲染默认 Slot。 |
| `required` | `Boolean` / `false` | `true, false` | 是否显示危险色必填标记；不替代 Field/Form 或 Slot 控件自身的校验。 |
| `disabled` | `Boolean` / `false` | `true, false` | 将标签文字切换为禁用色；不会擅自禁用默认 Slot 内控件。 |
| `colon` | `Boolean` / `false` | `true, false` | 在非空 `content` 后显示全角冒号。 |

| Slot | 说明 |
| --- | --- |
| `default` | 标签关联的任意组合内容，推荐使用 PUI Input、Select、Switch 等控件。 |

Label 没有公开事件和实例方法。基础用法只保留标签与关联控件：

```xml
<pui-label content="显示名称" required>
  <pui-input placeholder="请输入名称" />
</pui-label>
```

H5 镜像使用同一 Label + PUI Input 组合，`disabled` 只表达 Label 自身的文字状态；关联控件是否禁用必须由调用方显式传入。Label 是透明布局根，不建立第二层 Surface，也不使用嵌套 HTML `label` 改写小程序 Slot 语义。

## Textarea

`pui-textarea` 是微信原生 `textarea` 的受控与组合层。它只管理真实多行输入、字符上限、自动增高、状态提示与键盘桥接，不承担 Form 校验或提交成功。当前公共合同为 29 Props / 6 Events / 3 Slots / 3 Methods。

`value !== null/undefined` 时进入受控模式；`0`、`false` 和空字符串均为合法受控值。受控交互只发布请求；组件将逻辑值与原生渲染值分离，父级回写与当前原生草稿相同的 value 时不再次重绑 textarea，真正不同的外部 value 才覆盖输入。受控切为非受控时继续最后一次受控值，`defaultValue` 只初始化一次。

| 属性 | 类型 | 默认值 | 可选值 / 边界 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `String \| Number \| Boolean \| null` | `null` | — | 受控值；非 null/undefined 时由父级真实回写。 |
| `defaultValue` | `String \| Number \| Boolean` | `''` | — | 非受控初值，只在首次初始化时读取。 |
| `name` | `String` | `''` | — | 表单字段名，同时进入事件详情。 |
| `label` | `String` | `''` | 普通文字、`slot` | 标签文字；`slot` 激活 label Slot。 |
| `placeholder` | `String` | `'请输入'` | — | 空值提示。 |
| `maxlength` | `Number` | `-1` | `-1–10000` | UTF-16 长度上限；不会保留半个 emoji 代理对。 |
| `maxcharacter` | `Number` | `-1` | `-1–20000` | 加权字符上限；ASCII=1，中文、非 ASCII 与 emoji=2。启用时优先于 maxlength。 |
| `autosize` | `Boolean \| { minRows, maxRows }` | `false` | 行数分别规整到 `1–20`、`1–40` | true 使用默认4–8行自动增高；对象显式接管行数。 |
| `indicator` | `Boolean` | `false` | `true, false` | 显示与 change 事件同源的 count/limit。 |
| `bordered` | `Boolean` | `true` | `true, false` | 是否显示中性边界；关闭后仍保留盒模型和状态边界。 |
| `size` | `String` | `medium` | `small, medium, large` | 文本、行高与内距尺寸。 |
| `disabled` | `Boolean` | `false` | `true, false` | 禁用输入、确认与 focus()。 |
| `readonly` | `Boolean` | `false` | `true, false` | 只读语义；小程序端通过 native disabled 阻断编辑。 |
| `loading` | `Boolean` | `false` | `true, false` | 显示 PUI Loading 并阻断写入；不伪造异步结果。 |
| `focus` | `Boolean` | `false` | `true, false` | 请求原生 textarea 聚焦。 |
| `status` | `String` | `default` | `default, success, warning, error` | 状态边界、提示颜色与可访问语义。 |
| `tips` | `String` | `''` | 普通文字、`slot` | 状态提示；`slot` 激活 tips Slot。 |
| `required` | `Boolean` | `false` | `true, false` | 显示必填标记并设置 required 语义，不执行校验。 |
| `confirmType` | `String` | `done` | `done, go, next, search, send` | 微信键盘右下角按钮类型。 |
| `showConfirmBar` | `Boolean` | `true` | `true, false` | 是否显示微信键盘上方完成栏。 |
| `cursorSpacing` | `Number` | `0` | `>=0` | 光标与键盘间距，直接映射原生能力。 |
| `selectionStart` | `Number` | `-1` | `>=-1` | 聚焦时选区起点。 |
| `selectionEnd` | `Number` | `-1` | `>=-1` | 聚焦时选区终点。 |
| `adjustPosition` | `Boolean` | `true` | `true, false` | 键盘弹起时是否自动上推页面。 |
| `holdKeyboard` | `Boolean` | `false` | `true, false` | 聚焦后点击页面时是否保持键盘。 |
| `confirmHold` | `Boolean` | `false` | `true, false` | 点击键盘确认键后是否保持键盘。 |
| `disableDefaultPadding` | `Boolean` | `true` | `true, false` | 是否去掉 iOS 原生默认内边距。 |
| `ariaLabel` | `String` | `''` | — | 辅助名称；为空时回退 label、placeholder、文本域。 |
| `reduceMotion` | `Boolean` | `false` | `true, false` | 把固定500ms过渡压缩为1ms，不改变值或事件顺序。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ value, previousValue, count, limit, countMode, truncated, source, controlled, name, detail }` | 原生输入请求改变时触发；不再重复发布 input。 |
| `focus` | 值详情加原生 detail | 原生 textarea 实际获得焦点时触发。 |
| `blur` | 值详情加原生 detail | 原生 textarea 实际失去焦点时触发。 |
| `enter` | 值详情加原生 detail | 点击微信键盘确认键时触发；不与 Form submit 混用。 |
| `line-change` | 值详情加 `{ lineCount, height, heightRpx }` | 原生 textarea 行数或高度实际变化时触发。 |
| `keyboardheightchange` | `{ value, height, duration, source:'keyboard', name, detail }` | 微信键盘高度变化时转发；H5 不伪造。 |

| Slot | 激活方式 | 说明 |
| --- | --- | --- |
| `label` | `label="slot"` | 接管标签内容；required 星号仍由 Textarea 管理。 |
| `tips` | `tips="slot"` | 接管状态提示；颜色和角色继续跟随 status。 |
| `extra` | 直接提供 | 文本域下方扩展内容，不参与值、计数或事件计算。 |

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `focus()` | `Boolean` | 请求原生聚焦；disabled、readonly、loading 时返回 false。 |
| `blur()` | `Boolean` | 请求原生失焦，不改变值。 |
| `getValue()` | `String` | 读取当前真实渲染值，不触发事件。 |

基础用法保持最小，不展示任何 `bind:*`：

```xml
<pui-textarea placeholder="请输入内容" />
```

只有业务需要接收输入和键盘确认时才绑定事件：

```xml
<pui-textarea
  value="{{releaseNote}}"
  label="发布说明"
  maxcharacter="160"
  autosize="{{ { minRows: 3, maxRows: 6 } }}"
  indicator
  bind:change="onReleaseNoteChange"
  bind:enter="onReleaseNoteEnter"
/>
```

H5 使用真实 HTML textarea 镜像输入、焦点和受控父级回写；同值 echo 先比较当前 DOM value，不做第二次赋值。Textarea 不提供内置 Clear，需要清空时由父级把受控 value 写回空字符串。Cmd/Ctrl + Enter 只作为 enter 的浏览器测试桥接。浏览器没有微信确认栏、键盘抬升策略、原生 line-change 与 keyboardheightchange，因此官网明确记录差异而不伪造事件。反馈壳使用 grid rows/opacity/transform 常驻过渡，不对 height:auto 做无效 transition。

TDesign Mini Program 1.15.3 Textarea 公开 28 Props / 6 Events / 1 Slot / 0 Methods，且没有 Clear 能力。PoemUI 对齐其常用值、字符、autosize、indicator、边界、键盘与事件主干，保留已形成真实闭环的 size/status/tips/required/loading/ARIA/reduceMotion；不照搬 allowInputOverMax、autofocus、cursor、cursorColor、fixed、placeholderClass、placeholderStyle 等平台长尾参数，也不恢复旧版 clearable/clear/clear()、重复别名、调试方法和重复事件。
## Search

`pui-search` 直接组合 PUI Input、Button 和 Icon，只负责查询文本与确认/取消意图。业务结果、历史记录、加载和错误状态应在组件外组合，组件不会伪造检索成功。

### Search：TDesign 对照后的 17 Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `String \| Number \| Boolean \| null` | `null` | 任意文本化值、`null` | 受控查询值。`0`、`false` 和空字符串都是合法受控值；输入和清空等待父级回写。 |
| `defaultValue` | `String \| Number \| Boolean` | `'Input'` | 任意文本化值 | 非受控初值，仅首次初始化读取；controlled → uncontrolled 时继续最后一次受控值。 |
| `placeholder` | `String` | `'搜索组件'` | 任意文本 | 输入为空时的提示；也参与辅助名称回退。 |
| `clearable` | `Boolean` | `true` | `true`, `false` | 非空且可写时是否提供 PUI 图标清空按钮。 |
| `clearTrigger` | `String` | `'always'` | `always`, `focus` | 清空按钮持续显示或仅在输入框聚焦时显示。 |
| `showCancel` | `Boolean` | `true` | `true`, `false` | 是否显示右侧 PUI 取消按钮。 |
| `cancelText` | `String` | `'取消'` | 任意短文本 | 右侧取消操作文字；点击不会自行清空查询。 |
| `shape` | `String` | `'square'` | `square`, `round` | 字段形状；round 通过 Input 的语义圆角 Token 始终保持胶囊圆角。主题、边框与普通圆角随 ConfigProvider 切换；显式 round 不会被大圆角开关降级。 |
| `center` | `Boolean` | `false` | `true`, `false` | 是否让输入文本居中；不改变取消与 Slot 位置。 |
| `maxlength` | `Number` | `-1` | `-1–10000` | Unicode code point 上限；`-1` 表示不限。 |
| `maxcharacter` | `Number` | `-1` | `-1–20000` | 加权字符上限，ASCII 按 1、非 ASCII 和 emoji 按 2；启用时优先于 maxlength。 |
| `disabled` | `Boolean` | `false` | `true`, `false` | 禁止输入、清空、确认和取消，并保留 disabled 语义。 |
| `readonly` | `Boolean` | `false` | `true`, `false` | 只读展示当前查询，禁止写操作，并保留 readonly 语义。 |
| `focus` | `Boolean` | `false` | `true`, `false` | 声明式请求内部 PUI Input 聚焦。 |
| `confirmType` | `String` | `'search'` | `done`, `go`, `next`, `search`, `send` | 微信键盘确认键类型；非法值回退 search。 |
| `ariaLabel` | `String` | `'组件搜索'` | 任意非空文本 | Search 根与输入字段的辅助名称。 |
| `reduceMotion` | `Boolean` | `false` | `true`, `false` | 将固定 500ms standard 状态过渡压缩为 1ms。 |

### 6 Events

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ value, previousValue, source: 'input' \| 'clear', controlled, detail }` | 真实输入或清空请求改变时触发；不再重复发布 input。 |
| `clear` | 与 change 相同，`source='clear'` | 非空且可写时先触发；随后发布同一次 change，顺序固定为 `clear → change`。 |
| `search` | `{ value, previousValue, source: 'confirm', controlled, detail }` | 点击微信键盘确认键时触发；不生成业务结果。 |
| `cancel` | `{ value, previousValue, source: 'cancel', controlled, detail }` | 点击右侧取消操作时触发；当前值保持不变。 |
| `focus` | 当前值详情，`source='focus'` | 内部 PUI Input 实际获得焦点时触发。 |
| `blur` | 当前值详情，`source='blur'` | 内部 PUI Input 实际失去焦点时触发。 |

### 1 Slot

| Slot | 说明 |
| --- | --- |
| `default` | 取消按钮后的自定义短操作；不承接结果列表、Loading、Empty 或 Error。 |

Search 不公开实例方法。基础用法保持最小 WXML 且零 `bind:*`：

```xml
<pui-search />
```

受控页面只绑定当前业务需要的事件：

```xml
<pui-search
  value="{{componentSearch}}"
  placeholder="搜索组件"
  show-cancel
  bind:change="onComponentSearchChange"
  bind:search="onComponentSearch"
  bind:cancel="onComponentSearchCancel"
/>
```

`onComponentSearchChange` 必须把 `event.detail.value` 回写给 `componentSearch`；清空固定先发 `clear` 再发 `change`。TDesign 的 action、submit 语义在 PoemUI 中分别使用 cancel、search；结果列表保持在业务层，不耦合到基础输入组件。

## Stepper

`pui-stepper` 直接组合 PUI Button、Icon 与 Input，用于在明确边界内调整单个数量。单位、库存说明、Loading、Empty、Error 和 Retry 均由消费方在组件外组合，Stepper 不伪造业务状态。

### Stepper：TDesign 对照后的 14 Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `Number \| String \| null` | `null` | 有限数值、可解析数字字符串、`null` | 受控数值；`0` 是合法值，Boolean 与空字符串规整到安全下界。 |
| `defaultValue` | `Number \| String` | `2` | 有限数值或可解析数字字符串 | 非受控初值，仅首次初始化读取；controlled → uncontrolled 时延续最后一次受控值。 |
| `min` | `Number` | `0` | 任意有限数值 | 安全下界；非法值回退 `0`。 |
| `max` | `Number` | `10` | 大于等于 min 的有限数值 | 安全上界；非法或小于 min 时收敛到 min。 |
| `step` | `Number` | `1` | 正数 | 加减步长与输入规整单位；取绝对值，非法或 `0` 回退 `1`。 |
| `integer` | `Boolean` | `true` | `true`, `false` | 是否使用整数输入与整数步长；关闭后最多保留 8 位小数。 |
| `inputWidth` | `Number` | `120` | `80–480rpx` | 中间 PUI Input 宽度；不改写子组件高度、padding 和字号。 |
| `size` | `String` | `'medium'` | `small`, `medium`, `large` | PUI Button/Input 的标准尺寸档位。 |
| `theme` | `String` | `'normal'` | `normal`, `filled`, `outline` | 单一 Surface 的常规、填充和描边关系；不改变数值合同。 |
| `disabled` | `Boolean` | `false` | `true`, `false` | 禁用输入、加减和越界请求，并保留 disabled 语义。 |
| `readonly` | `Boolean` | `false` | `true`, `false` | 只读展示当前值，阻断全部写请求。 |
| `disableInput` | `Boolean` | `false` | `true`, `false` | 只锁定直接输入；加减与 overlimit 仍可使用。 |
| `ariaLabel` | `String` | `'库存数量'` | 任意非空文本 | Stepper group 与内部输入字段的辅助名称。 |
| `reduceMotion` | `Boolean` | `false` | `true`, `false` | 将固定 500ms standard 状态过渡压缩为 1ms。 |

### 4 Events

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ value, previousValue, source: 'minus' \| 'plus' \| 'blur' \| 'enter', controlled }` | 加减立即提交；输入只在失焦或 Enter 后规整并提交。值未变化时不触发。 |
| `overlimit` | `{ type: 'minus' \| 'plus', value, min, max, controlled }` | 已到边界后继续向外调整时触发；不伴随 change。 |
| `focus` | `{ value, source: 'focus', controlled, detail }` | 内部 PUI Input 实际获得焦点时触发。 |
| `blur` | `{ value, source: 'blur', controlled, detail }` | 内部 PUI Input 失焦时触发；草稿变化时顺序固定为 `change → blur`。 |

Stepper 不公开 Slot 或实例方法。基础用法保持最小 WXML 且零 `bind:*`：

```xml
<pui-stepper />
```

受控页面只绑定当前业务需要的事件；单位作为相邻组件组合：

```xml
<pui-stepper value="{{stockCount}}" max="20" bind:change="onStockCountChange" />
<pui-tag theme="primary" variant="outline">件</pui-tag>
```

`onStockCountChange` 必须把 `event.detail.value` 回写给 `stockCount`。直接输入先保留草稿，只有 Enter 或失焦才按 `min + n * step` 规整并提交；失焦路径固定先 `change` 后 `blur`。TDesign 的 `disableInput / inputWidth / integer / max / min / size / step / theme / value / defaultValue` 主干已保留，PoemUI 增加真实 readonly、ARIA 和低动效合同，同时不复制重复 input 事件。

## Rate

### Rate：TDesign 对照后的 13 Props

`pui-rate` 提供可点击、可连续拖动的星级评分。显式传入 `value` 后为受控模式，交互只发出一次 `change` 请求并等待父级回写；未传 `value` 时，`defaultValue` 只初始化一次，受控退回非受控时保留最后一次渲染值。`allowHalf` 开启后，每颗星拆成真实左右触点并以 0.5 为步进；半星由双层 PUI Icon 裁切，不依赖背景色遮罩。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `value`、`defaultValue` | `Number \| null`、`Number` / `null`、`0` | 受控值与仅首次生效的非受控初值；`0` 是合法受控值。 |
| `count`、`size`、`gap` | `Number` / `5`、`40`、`8` | 星数限制为 1–10，图标尺寸为 24–96rpx，间距为 0–32rpx；间距同时参与拖动位置换算。 |
| `color` | `String` / `''` | 激活色仅接受 `#RGB`、`#RRGGBB` 或通道为 0–255 的 `rgb(r,g,b)`；空值与非法值回退当前深浅色主题强调色。 |
| `allowHalf`、`showText`、`texts` | `Boolean`、`Boolean`、`Array` / `false`、`false`、`[]` | 半星、评分文案及其映射；文案按评分向上取整索引。 |
| `disabled`、`readonly` | `Boolean`、`Boolean` / `false`、`false` | 均阻断评分请求；readonly 保留当前评分的展示语义。 |
| `ariaLabel` | `String` / `'评分'` | 评分组的语义名称。 |
| `reduceMotion` | `Boolean` / `false` | 将固定 500ms standard 星色、裁切、文案与禁用态过渡压缩为 1ms。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ value, source: 'tap' \| 'drag' }` | 点击或拖动使请求值真实变化时触发；相同值、disabled 与 readonly 不触发。 |

基础用法不绑定事件：

```xml
<pui-rate></pui-rate>
```

受控评分只绑定实际需要的 `change`：

```xml
<pui-rate
  value="{{componentRating}}"
  count="5"
  allow-half
  show-text
  texts="{{ratingTexts}}"
  aria-label="组件可用性评分"
  bind:change="onComponentRatingChange"
></pui-rate>
<pui-tag theme="warning" variant="outline">已评价</pui-tag>
```

`onComponentRatingChange` 应回写 `event.detail.value`。H5 镜像按相同左右触点生成组件自身的真实 button，并用 Pointer Events 映射拖动；受控交互只通过 Props 父级回写。Rate 无 Slot 或实例方法，Tag、Cell 与提交 Button 作为兄弟组件组合。

TDesign MiniProgram 1.15.3 的 `gap`、单一 `change` 与拖动主干被保留；`icon/iconPrefix` 会绕过 PoemUI Icon 资源合同，`placement` 依赖临时提示浮层，`variant` 在当前单一 Star 资源下不能形成真实 outline/filled 双图形，因此不公开。PoemUI 额外保留 `readonly/ariaLabel/reduceMotion`。

## Attachment / Upload

`pui-upload` 从微信媒体或聊天文件选择器取得本地文件，并以列表或网格展示消费者回写的真实状态。它不执行远端上传：选择成功只会加入 `ready` 文件，业务层必须在 `add/retry` 后启动真实任务，再通过 `files[].status/progress/message/url` 回写。

文件字符串或对象会规整为 `{ id, path, url, name, type, extension, size, sizeText, duration, status, statusText, progress, message, canPreview }`。`status` 支持 `ready/uploading/success/error/paused`，`progress` 规整为 0–100；这些值必须来自消费者的真实上传任务，组件只负责用内部 `Tag/Progress` 呈现。

### Upload：TDesign 对照后的 20 Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `files` | `Array \| null` | `null` | 文件字符串或对象数组 | 只有 Array 才进入受控模式；选择和移除等待父级回写。`0/false/空字符串/null` 均按非受控处理。 |
| `defaultFiles` | `Array` | `[]` | 文件字符串或对象数组 | 仅首次初始化非受控列表。 |
| `max` | `Number` | `3` | 1–9，步长 1 | 最大文件数；组件源码默认 9，官网演示初值为 3。 |
| `picker` | `String` | `media` | `media`, `message` | 分别调用 `wx.chooseMedia` 与 `wx.chooseMessageFile`。 |
| `mediaType` | `Array` | `["image"]` | `image`, `video` | media 选择器允许的类型；非法或空数组回退图片。 |
| `messageType` | `String` | `all` | `all`, `image`, `video`, `file` | 聊天文件选择器类型。 |
| `source` | `String` | 空字符串 | 空字符串, `album`, `camera` | media 来源；空值允许相册与相机。 |
| `extensions` | `Array` | `[]` | 小写/数字扩展名 | 可带或不带点；平台返回后再次校验。 |
| `maxSize` | `Number` | `0` | 0–2147483648 字节 | 单文件上限；0 表示不限制。 |
| `addContent` | `String` | `添加附件` | 任意文本 | 默认内部 PUI Button 文案。 |
| `addBtn` | `Boolean` | `true` | `true`, `false` | 是否显示添加入口。 |
| `theme` | `String` | `list` | `list`, `grid` | 完整信息列表或紧凑网格。 |
| `columns` | `Number` | `3` | 2–4，步长 1 | grid 列数；list 不消费。 |
| `allowDuplicate` | `Boolean` | `false` | `true`, `false` | 是否允许新选择与当前列表具有相同 path/url。 |
| `preview` | `Boolean` | `true` | `true`, `false` | 是否提供图片、视频或本地文档平台预览。 |
| `removeBtn` | `Boolean` | `true` | `true`, `false` | 是否显示内部删除 PUI Button。 |
| `customAdd` | `Boolean` | `false` | `true`, `false` | 启用 `add` Slot；Slot 点击仍调用同一个平台选择器。 |
| `disabled` | `Boolean` | `false` | `true`, `false` | 阻断选择、预览、移除与重试。 |
| `ariaLabel` | `String` | `附件选择` | 任意非空文本 | 附件组辅助名称。 |
| `reduceMotion` | `Boolean` | `false` | `true`, `false` | 把固定 500ms 文件项与状态过渡压缩为 1ms。 |

### Events

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ files, previousFiles, source: "add" \| "remove", ... }` | 有效选择或移除使文件列表真实请求变化时先触发。 |
| `add` | `{ files, previousFiles, addedFiles, rejectedFiles, picker, source: "add" }` | 至少一个文件通过校验时紧随 change；不表示远端上传成功。 |
| `remove` | `{ files, previousFiles, file, index, source: 'remove' }` | 删除一个有效附件。 |
| `preview` | `{ file, index, source: 'preview' }` | 调用图片、视频或本地文档平台预览前。 |
| `retry` | `{ file, index, files, source: 'file' }` | 错误文件重试；只请求消费者启动真实任务。 |
| `cancel` | `{ source }` | 用户取消系统选择器。 |
| `reject` | `{ rejectedFiles: [{ file, reason }], extensions, maxSize, max, source }` | 类型、扩展名、大小、重复或上限拒绝；reason 为 `type/extension/size/duplicate/max`。 |
| `error` | 平台错误字段及 `{ source, file?, index? }` | 选择能力不可用、无有效返回或平台预览失败。 |

### Slots

| Slot | 启用条件 | 用途 |
| --- | --- | --- |
| `add` | `customAdd=true` | 接管添加入口可见内容；点击仍走相同平台选择能力。 |

Upload 不公开实例方法。空列表就是可添加状态；整体 Loading/Empty/Error 应由消费者在外部组合，单文件 `uploading/error/paused/success` 由 `files` 回写。

基础用法只展示最小调用，不绑定任何事件：

```xml
<pui-upload></pui-upload>
```

受控上传流程只绑定真实需要的事件：

```xml
<pui-upload
  files="{{attachmentFiles}}"
  picker="message"
  message-type="all"
  extensions="{{attachmentExtensions}}"
  max-size="{{5242880}}"
  max="3"
  add-content="添加组件附件"
  aria-label="选择组件附件"
  bind:change="onAttachmentChange"
  bind:add="onAttachmentAdd"
  bind:retry="onAttachmentRetry"
  bind:reject="onAttachmentReject"
  bind:error="onAttachmentError"
/>
```

`onAttachmentChange` 应将 `event.detail.files` 回写给 `attachmentFiles`。业务层在 `add/retry` 后启动真实上传任务。H5 镜像使用真实 `<input type="file">` 和 Blob URL，执行同样的类型、扩展名、大小、重复与数量校验。

TDesign MiniProgram 1.15.3 的添加入口、文件列表、grid/list、数量、类型、重复、预览和删除主干被保留；PoemUI 用 `picker/messageType/source` 明确两个微信选择器，并保留字节级 `maxSize`、`extensions`、语义和低动效。`requestMethod/config/draggable/transition/gridConfig/gutter/imageProps` 会把业务上传、平台穿透或复杂排序塞入原子选择组件，当前不公开。

## Loading

`pui-loading` 用于表示页面或操作正在处理。它只反馈“仍在等待”，不表达请求成功、失败或重试。`loading=true` 时会先等待 `delay`，再挂载并进入；改为 `false` 时完成不超过 500ms 的退场再卸载，不使用 `display:none` 瞬移。`circular`、`spinner`、`dots` 共享这一合同；低动效下保留静态指示器。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `delay` | `Number` / `0` | 显示前延迟，限制为 0–2000ms；期间改为 `loading=false` 会取消显示。 |
| `duration` | `Number` / `500` | 指示器周期和进退场时长，限制为 0–1000ms；低动效时固定为 1ms。 |
| `fullscreen` | `Boolean` / `false` | 固定铺满页面并阻断遮罩区域触摸；背景、毛玻璃和阴影使用全局视觉 token。 |
| `indicator` | `Boolean` / `true` | 是否显示环形/圆点指示器；关闭后仍可显示文字、进度和 slot。 |
| `inheritColor` | `Boolean` / `false` | `true` 时跟随父级文字色；否则使用 PUI 品牌色 Token，不公开页面私有色值入口。 |
| `layout` | `String` / `'horizontal'` | `horizontal` 或 `vertical`；非法值回退横向。 |
| `loading` | `Boolean` / `true` | 由父级请求显示或退场；退场结束后才卸载 WXML 节点。 |
| `pause`、`reverse` | `Boolean`、`Boolean` / `false`、`false` | 暂停或反向播放当前指示器，不改变 `loading` 状态。 |
| `progress` | `Number` / `-1` | `-1` 不显示；`0–100` 显示真实数值，边界外规整到范围内。 |
| `size` | `String` / `'36rpx'` | 预设 `small`、`medium`、`large`，或 `rpx` / `px`；运行时分别限制为 16–128rpx、8–64px。 |
| `text` | `String` / `''` | 指示器旁的可见文字；复杂业务状态可放 Slot。 |
| `theme` | `String` / `'circular'` | `circular`、`spinner` 或 `dots`；非法值回退环形。 |
| `ariaLabel` | `String` / `''` | 状态语义；为空时依次回退文字、进度文案和“加载中”。 |
| `reduceMotion` | `Boolean` / `false` | 将进退场压缩为 1ms，并把环形/圆点改为静态指示。 |

Loading 不公开 Events 或实例方法：显示与隐藏只是父级 `loading` 属性的视觉结果，不能被包装成业务完成信号。

| Slot | 说明 |
| --- | --- |
| `default` | 追加在文字后的简短业务状态，例如 `pui-tag`；不表达请求成功或失败。 |
| `indicator` | 追加或替换指示器附近的内容；不改变 `loading`、`delay` 或动画状态。 |
| `text` | 追加或替换文字区域内容；与 `text` 属性并列时应避免重复文案。 |

```xml
<pui-loading />
```

完整事件不需要出现在基础用法中，因为当前合同没有公开事件。需要把文字、进度或 Slot 连接到真实请求状态时，页面只回写 `loading`；成功、失败和重试由外层业务组件另行表达。Button 的 `loadingProps` 只传递 `size/theme/text/ariaLabel`，并继续由 Button 自身阻断重复点击。

## Toast

`pui-toast` 用于一条短时反馈。页面通过实例 `show(options)` 展示、通过 `hide()` 收起；Toast 不公开 `visible/defaultVisible`，也不把自动关闭伪装成业务成功。隐藏时会保留节点完成固定 180ms 退场，再触发 `close`。

### Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `direction` | `String` | `row` | `row`、`column` | 图标与文字的排列方向；非法值回退为 `row`。 |
| `duration` | `Number` | `2000` | `0`–`60000` | 展示后的自动收起等待时间（毫秒）；`0` 表示保持显示，直到调用 `hide()`。 |
| `icon` | `String` | 空字符串 | 图标名 | 显式图标优先于主题默认图标与 Loading。 |
| `message` | `String` | 空字符串 | — | 默认提示文字；可与 `message` Slot 并列，由调用方避免重复文案。 |
| `overlayProps` | `Object \| null` | `null` | `backgroundColor`、`zIndex`、`duration`、`preventScrollThrough` | 遮罩的安全外观与滚动保护配置；`zIndex` 限制为 `1`–`12000`，`duration` 限制为 `0`–`500ms`。 |
| `placement` | `String` | `middle` | `top`、`middle`、`bottom` | 提示在当前页面或 PreviewDevice 内的停靠位置。 |
| `preventScrollThrough` | `Boolean` | `false` | `true`、`false` | 阻断遮罩后的滚动；开启时即使 `showOverlay=false` 也会挂载透明遮罩桥接层。 |
| `showOverlay` | `Boolean` | `false` | `true`、`false` | 是否展示遮罩；背景色读取 `overlayProps.backgroundColor` 或默认半透明中性色。 |
| `theme` | `String` | 空字符串 | `loading`、`success`、`warning`、`error` | 内建语义主题；`loading` 在没有显式 `icon` 时组合 PUI Loading。 |
| `usingCustomNavbar` | `Boolean` | `false` | `true`、`false` | 传递小程序自定义导航栏环境，不改变公开事件或计时边界。 |
| `ariaLabel` | `String` | 空字符串 | — | 无障碍名称；依次回退到 `message`、loading 的“加载中”或“提示”。 |
| `reduceMotion` | `Boolean` | `false` | `true`、`false` | 将固定进入与退场动效压缩为 `1ms`；不改变计时或事件顺序。 |

### Events

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `close` | 无 | `hide()` 或 `duration` 自动收起完成固定退场、节点实际卸载后触发；不表示业务操作成功。 |

### Slots

| Slot | 说明 |
| --- | --- |
| `icon` | 补充或替代内部 Icon/Loading 区域；不改变主题、计时或关闭边界。 |
| `message` | 追加提示正文，例如短 Tag；调用方避免与 `message` 属性重复。 |

### Methods

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `show(options?)` | `void` | 合并提供的 Toast Props，挂载并在下一帧进入；`duration>0` 时进入完成后安排自动 `hide()`。 |
| `hide()` | `void` | 取消等待计时并进入退场；节点卸载后触发 `close`。 |

## Progress

`pui-progress` 是只读的确定进度显示。父级以 `percentage` 真实回写任务完成度；组件不发布任务事件、不提供实例方法，也不把视觉动画轮次或达到 100% 伪造成业务完成。未知进度请使用 `pui-loading`，业务错误、空内容与重试应在 Progress 外部组合。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `percentage` | `Number` / `0` | 唯一进度值，限制为 0–100，保留最多两位小数。 |
| `theme` | `String` / `'line'` | `line`、`plump` 或 `circle`。 |
| `label` | `Boolean \| String` / `true` | true 显示百分比，false 或空字符串隐藏，字符串显示自定义文字。 |
| `size` | `Number` / `160` | 环形外径，限制为 80–320rpx；其他形态忽略。 |
| `status` | `String` / `''` | `active`、`success`、`warning`、`error`；为空时 100 自动为 success，其余为 active。 |
| `strokeWidth` | `Number` / `12` | 线条粗细，限制为 4–48rpx，环形不超过外径三分之一。 |
| `color`、`trackColor` | `String` / `''` | 前景与轨道颜色，仅接受安全十六进制、rgb/hsl、`transparent`、`currentColor` 或 Token。 |
| `ariaLabel` | `String` / `'进度'` | progressbar 辅助名称，组件附加当前可见文字。 |
| `reduceMotion` | `Boolean` / `false` | 将固定 500ms 视觉过渡压缩为 1ms，不改变数值或业务状态。 |

Progress 有 10 个 Props、1 个具名 `label` Slot、0 Events、0 Methods。`label` Slot 只补充可见读数，不改变 percentage；没有默认 Slot。

```xml
<pui-progress percentage="{{deliveryProgress}}" />
```

线形与饱满线形使用真实宽度过渡，环形使用纯 WXML 双半圆裁切和 transform；H5 用 SVG `stroke-dashoffset` 镜像弧长。三种形态都只反映父级实际传入的值。

## Skeleton

`pui-skeleton` 只表达尚未就绪内容的结构，`loading` 必须由父级真实回写。它不把动画、计时或内容出现当成请求成功，不内置空态、错误态或重试。`loading=true` 可通过 `delay` 避免极短请求闪烁；占位进入和内容回显使用固定 500ms 交叉淡入，低动效压缩为 1ms。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `animation` | `String` / `'none'` | `gradient`、`flashed` 或 `none`；仅占位部分循环，内容不附加动画。 |
| `delay` | `Number` / `0` | loading=true 后延迟挂载占位，限制为 0–2000ms；不再作为 CSS animation-delay。 |
| `loading` | `Boolean` / `true` | 受控占位状态；false 显示默认 Slot 内容。 |
| `rowCol` | `Array` / `[]` | 空数组按 `theme` 生成布局。数字表示一行数量，对象表示一行，数组表示同行多列；最多 12 行、每行 4 列。单元支持安全的 `width`、`height`、`size`、`margin`、`marginLeft`、`marginRight` 和 `type`（`text`、`rect`、`circle`）。 |
| `theme` | `String` / `'text'` | 空 `rowCol` 的默认结构：`avatar`、`image`、`paragraph` 或 `text`。 |
| `ariaLabel` | `String` / `'内容加载中'` | 占位激活时 `role=status` 的辅助名称。 |
| `reduceMotion` | `Boolean` / `false` | 将固定 500ms 交叉淡入压缩为 1ms，并停止 gradient/flashed 循环。 |

Skeleton 有 7 个 Props、1 个默认 Slot、0 Events、0 Methods。默认 Slot 只在 `loading=false` 时可见；它是就绪内容，不是自定义占位模板。

```xml
<pui-skeleton />
```

需要自定义结构时直接传 `row-col`；需要显示业务内容时将 Cell、Tag 等 PoemUI 组件放入默认 Slot，并由父级将 `loading` 设为 `false`。H5 以同一份安全行列规则把 rpx 约换算为 1:2 px，在同一节点上切换透明度；预览按钮只回写 `loading`，不生成任何成功、失败或生命周期事件。

## Empty

`pui-empty` 用于列表、筛选、搜索或权限范围内没有可展示内容的场景。它只负责图形、说明和下一步入口的位置：图形按 `image → icon → image Slot` 决定，下一步由 `action` Slot 内的真实 `pui-button` 交给父级处理。它没有组件 Events 或实例 Methods。

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `description` | `String` | `'暂无组件数据'` | 任意文本、空字符串 | 空状态说明；空字符串不会伪造业务文案，复杂内容可由 `description` Slot 组合。 |
| `icon` | `String \| { name?: string; size?: number; color?: string }` | `'inbox'` | 图标名，或含 `name`、`size`、`color` 的对象 | 仅在 `image` 为空时生效；对象的 `size` 限制为 `24–320rpx`，非法字段安全回退。 |
| `image` | `String` | `''` | 图片地址、空字符串 | 非空时优先于 `icon`，内部真实复用 `pui-image` 的加载、失败与回退能力。 |
| `ariaLabel` | `String` | `'组件列表空状态'` | 任意文本、空字符串 | `role=status` 的辅助名称；空白时依次回退 `description` 与“空状态”。 |
| `reduceMotion` | `Boolean` | `false` | `true`, `false` | 固定 500ms 进入过渡压缩为 1ms；不改变内容优先级和 Slot 行为。 |

### Slots

| Slot | 说明 |
| --- | --- |
| `image` | `image` 与 `icon` 都为空时提供图形；其优先级低于两个 Props。 |
| `description` | 追加或替代说明区域；调用者避免与 `description` 重复。 |
| `action` | 下一步入口；在其中组合真实 `pui-button`，由父级处理点击、loading、disabled 与业务回写。 |

### Events 与 Methods

Empty 没有公开 Events 或实例 Methods。图片 load/error 属于内部 `pui-image`，不能冒充为 Empty 事件；`action` Slot 中 Button 的点击也只属于消费者。

```xml
<pui-empty description="暂无内容" />
```

需要下一步时由消费者组合：

```xml
<pui-empty description="没有匹配的组件" icon="inbox">
  <pui-button slot="action" size="small" icon="refresh" bind:click="onRetry">
    重新筛选
  </pui-button>
</pui-empty>
```

H5 以同一优先级组合 PUI Icon、PUI Image 与 Slot 内 PUI Button；图片实际加载失败由 Image 自己显示回退。H5 不产生 Empty 的假 `load`、`error` 或 `action` 日志，演示按钮只回写父级说明。

## NoticeBar

`pui-notice-bar` 用于在页面内持续展示公告。它支持横向单条公告、纵向多条轮播、真实溢出跑马和四个具名内容区域；它不等同于 Message、Toast 或消息队列，也不推断任何业务成功。

### Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `content` | `String \| Array` | `'PoemUI 组件库已完成官网预览更新。'` | 文本、文本数组、空字符串 | 横向模式显示一条文本；纵向模式将数组中的每项作为真实 swiper 条目。``null``、``undefined`` 与空项不会生成虚假公告。 |
| `direction` | `String` | `horizontal` | `horizontal`、`vertical` | 横向单条公告或纵向多条轮播；只有 `vertical` 使用真实 swiper 和 `change` 事件。 |
| `interval` | `Number` | `2000` | `0` 及正整数 | 纵向轮播间隔（毫秒）；非法值回退 `2000`，负数规整为 `0`。 |
| `marquee` | `Boolean \| Object` | `false` | `false`、`true`、`{ speed, loop, delay }` | 横向内容真实溢出时的跑马配置；`speed` 为 `10`–`200`，`loop<0` 表示无限循环，`delay` 为 `0`–`10000ms`。 |
| `operation` | `String` | 空字符串 | 文本、空字符串 | 默认操作区域文字；点击只发出 `click({ trigger: 'operation' })`，不推断提交、关闭或跳转。 |
| `prefixIcon` | `Boolean \| String \| Object` | `true` | `true`、`false`、图标名、`{ name }` | 前置图标；`true` 使用 theme 默认图标，`false` 隐藏默认图标并仍允许 `prefix-icon` Slot。 |
| `suffixIcon` | `Boolean \| String \| Object \| null` | `null` | `true`、`false`、图标名、`{ name }`、`null` | 尾部图标；默认不显示，点击只发出 `click({ trigger: 'suffix-icon' })`。 |
| `theme` | `String` | `info` | `info`、`success`、`warning`、`error` | 决定默认前置图标、语义角色与颜色；非法值回退 `info`。 |
| `visible` | `Boolean \| null` | `null` | `true`、`false`、`null` | 受控显隐；`null` 表示非受控并继续使用 `defaultVisible` 的首次初值。 |
| `defaultVisible` | `Boolean` | `true` | `true`、`false` | 非受控显隐的首次初值；挂载后的属性变化不重置用户运行态。 |
| `ariaLabel` | `String` | 空字符串 | 任意文本、空字符串 | 无障碍名称；空值依次回退 content 与“通知”。error 使用 `alert/assertive`，其余主题使用 `status/polite`。 |
| `reduceMotion` | `Boolean` | `false` | `true`、`false` | 将 500ms 显隐与跑马段动画压缩为 `1ms`；不改变内容、轮播或事件来源。 |

### Events

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ current, source: 'swiper' }` | 仅 `direction="vertical"` 的真实 swiper 切换时触发；`current` 是当前条目索引。 |
| `click` | `{ trigger: 'prefix-icon' \| 'content' \| 'operation' \| 'suffix-icon' }` | 点击对应区域时触发一次；组件不推断跳转、关闭或业务成功，由父级处理。 |

### Slots

NoticeBar 提供 `prefix-icon`、`content`、`operation`、`suffix-icon` 四个具名 Slot；没有默认 Slot 和实例方法。

| Slot | 说明 |
| --- | --- |
| `prefix-icon` | 通知前置图标区域；属性为 `false` 时不渲染默认图标，具名 Slot 可提供自定义内容。 |
| `content` | 公告正文区域；与 `content` 属性并列时由调用方避免重复内容。 |
| `operation` | 公告操作区域；业务动作由 Slot 内真实 PUI Button 或父级 `click` 处理。 |
| `suffix-icon` | 通知尾部图标区域；例如由父级通过 `click` 实现关闭或跳转。 |

## Result

`pui-result` 只呈现一次流程已经得到的结果状态；它不提供操作、加载、重试、受控值、事件或实例方法。下一步由页面或同级 PUI Button、Cell、Loading、Empty 组合承担，不能由 Result 伪造成功。

### Result：TDesign 对照后的 7 Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `description` | `String` | `'组件源码、官网预览和 npm 产物已完成同步。'` | 任意文本、空字符串 | 结果说明；为空时不渲染说明区域。可用同名 Slot 追加或替代。 |
| `icon` | `Boolean \| String \| Object` | `true` | `true`、`false`、图标名、`{ name, size, color }` | `true` 按 theme 使用默认图标，`false` 让出图形区域给 `image` Slot；对象的 `size` 限制在 24–320rpx。 |
| `image` | `String` | `''` | 图片地址、空字符串 | 图形优先级最高；传入后展示内部 `pui-image`，不把图片加载结果提升为 Result 事件。 |
| `theme` | `String` | `'success'` | `default`、`success`、`warning`、`error` | 决定默认图标和语义颜色；非法值回退 `default`。 |
| `title` | `String` | `'发布检查通过'` | 任意文本、空字符串 | 结果标题；为空时不渲染标题区域。可用同名 Slot 追加或替代。 |
| `ariaLabel` | `String` | `'组件发布结果'` | 任意文本、空字符串 | 无障碍名称；空值依次回退 title、description 和“结果”。error 使用 `alert/assertive`，其余主题使用 `status/polite`。 |
| `reduceMotion` | `Boolean` | `false` | `true`、`false` | 固定 500ms 入场在低动效下压缩为 1ms；不提供 duration 或 easing 私有调参。 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `image` | 当 `image` 为空且 `icon=false` 时替代图形区域；不会覆盖显式 image 或默认图标。 |
| `title` | 追加或替代标题内容。 |
| `description` | 追加或替代说明内容；后续操作应由同级组件或页面容器承担。 |

Result 没有 Events 或 Methods。它本身也没有 active、selected、disabled、readonly、loading、empty、error、retry 或受控/非受控值；这些状态属于流程页面与对应的 PUI 组件。

基础用法保持最小可用 WXML，不绑定事件：

```xml
<pui-result
  theme="success"
  title="发布检查通过"
  description="组件源码、官网预览和 npm 产物已完成同步。"
  aria-label="组件发布结果"
/>
```

具名 Slot 示例：

```xml
<pui-result icon="{{false}}" aria-label="自定义结果内容">
  <pui-icon slot="image" name="component" size="96" />
  <pui-tag slot="title" theme="primary" variant="outline">自定义标题</pui-tag>
  <pui-cell slot="description" title="下一步" value="由页面处理" />
</pui-result>
```

H5 镜像与 WXML 共享 image → icon → image Slot 优先级、四个 theme、三个具名 Slot、语义和 180ms/1ms 入场。网页端会以真实 `<img>` 表示 `image`，但图片 load/error 属于 `pui-image` 的能力，不伪造 Result 的 `load/error` 事件；微信图片 mode 等最终行为以小程序端为准。

## Navbar

`pui-navbar` 是页面顶部标题、返回意图与微信原生胶囊安全区容器。当前公开合同参考 TDesign Mini Program 1.15.3，但不会替消费者自动执行 `wx.navigateBack`：Navbar 只发布意图，页面掌握真实导航和业务结果。默认返回组合 PUI Button + Icon，加载标题组合 PUI Loading；`navigationStyle: "custom"` 下默认预留微信右上原生胶囊，不在该区域放置业务操作。

### Navbar：TDesign 对照后的 17 Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `title` | `String` | `'组件详情'` | 任意文本、空字符串 | 标题文字；复杂标题应使用 `title` Slot 并省略该 Prop，避免并列内容。 |
| `titleMaxLength` | `Number` | `0` | 大于等于 `0` 的整数 | 标题字符上限；`0` 表示不主动截断，窄屏仍以单行视觉裁切保护布局。 |
| `leftArrow` | `Boolean` | `true` | `true`, `false` | 显示默认返回箭头；点击只触发 `left-click`，不自动修改路由。 |
| `leftBtn` | `NavbarAction \| null` | `null` | `{ icon, ariaLabel }` | 内建左侧第一图标操作；与 `rightBtn` 任一存在时替代默认返回和 `left` Slot，点击触发 `leftBtn`。 |
| `rightBtn` | `NavbarAction \| null` | `null` | `{ icon, ariaLabel }` | 内建左侧第二图标操作；点击触发 `rightBtn`。 |
| `fixed` | `Boolean` | `true` | `true`, `false` | 固定在小程序页面顶部；H5 只在 PreviewDevice 内模拟。 |
| `placeholder` | `Boolean` | `true` | `true`, `false` | `fixed=true` 时补回导航栏及安全区占用高度；非固定时不生效。 |
| `safeAreaInsetTop` | `Boolean` | `true` | `true`, `false` | 使用顶部安全区；胶囊模式优先读取 `wx.getWindowInfo().statusBarHeight`，读取失败回退 `env(safe-area-inset-top)`，不写死机型高度。 |
| `capsule` | `Boolean` | `true` | `true`, `false` | 默认读取菜单完整矩形、窗口宽度和状态栏高度，建立标题对称轨、左操作镜像区与纵向内容高度；PUI 不绘制或绑定微信胶囊。仅 `false` 时才渲染 `right` Slot。 |
| `visible` | `Boolean` | `true` | `true`, `false` | 受控呈现状态；退场保留节点到固定动效完成，不额外发布重复显隐事件。 |
| `zIndex` | `Number` | `1000` | `1–12000` | 固定导航层级，运行时安全限制到有效范围。 |
| `loading` | `Boolean` | `false` | `true`, `false` | 在默认标题前组合 PUI Loading；只表达外部真实加载状态。 |
| `transparent` | `Boolean` | `false` | `true`, `false` | 使用透明背景并关闭 Navbar 自身阴影和毛玻璃，不改变尺寸与占位。 |
| `bordered` | `Boolean` | `false` | `true`, `false` | 默认不渲染底线；显式开启才显示中性底部分割线。 |
| `disabled` | `Boolean` | `false` | `true`, `false` | 禁用默认返回并阻止 Slot 区域指针交互；标题仍保持可读。 |
| `ariaLabel` | `String` | `'组件详情导航栏'` | 任意非空文本 | `navigation` 根的辅助名称；空值按标题和“导航栏”回退。 |
| `reduceMotion` | `Boolean` | `false` | `true`, `false` | 将固定 500ms standard 进退场压缩为 1ms，并透传给内部 Loading/Button。 |

### 3 Events

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `left-click` | `{ source: 'left' }` | 默认返回箭头存在且 Navbar 未禁用时触发；不会自动调用微信导航 API。 |
| `leftBtn` | `{ source: 'leftBtn' }` | 配置 `leftBtn` 且 Navbar 未禁用时触发；页面可直接使用 `bind:leftBtn`。 |
| `rightBtn` | `{ source: 'rightBtn' }` | 配置 `rightBtn` 且 Navbar 未禁用时触发；页面可直接使用 `bind:rightBtn`。 |

### 3 Slots

| Slot | 说明 |
| --- | --- |
| `left` | 未配置 `leftBtn/rightBtn` 时，默认返回箭头之后的左侧消费者内容；业务事件由 Slot 内组件处理。 |
| `title` | 自定义标题内容；使用时应省略 `title`，避免与文字标题并列。 |
| `right` | 仅 `capsule=false` 时渲染的右侧消费者区域；默认原生胶囊模式不渲染它。 |

Navbar 不公开实例方法。基础用法只声明完成页面标题任务所需的属性，不绑定任何事件：

```xml
<pui-navbar title="组件详情" left-arrow placeholder aria-label="组件详情导航栏" />
```

默认 `capsule=true` 的右侧必须留给微信系统胶囊。页面需要两个左侧图标入口时传入 `left-btn/right-btn` 并直接监听 `bind:leftBtn/bind:rightBtn`；若页面不是自定义导航栏且确有右侧消费者内容，可显式传 `capsule="{{false}}"` 并由 Slot 内真实 PoemUI Button 自行闭环；Navbar 仍不发布 `right-click`。

```xml
<pui-navbar
  title="Poem UI"
  left-btn="{{navbarLeftBtn}}"
  right-btn="{{navbarRightBtn}}"
  bind:leftBtn="onOpenSearch"
  bind:rightBtn="onOpenAppearance"
/>
```

H5 在 PreviewDevice 内局部模拟 fixed 和不可交互胶囊镜像，原生仍固定到真实小程序页面并保留系统胶囊。两端都使用固定 500ms/1ms 进退场；`visible` 变化只表达父级写入后的呈现结果。Navbar 不定义 empty/error/retry，它们应由页面内容区的 Loading、Empty 或 Result 承担。

## Tabs

`pui-tabs` 用于同一层级内容之间切换。它以 `items` 作为唯一选项数据源，内部组合 PUI Button、Badge 与 Icon；默认 Slot 承载当前内容面板。参考 TDesign Miniprogram 1.15.3 后，PoemUI 保留 Tabs 的选择、底线、等分、分隔、吸顶和滑动能力，删除了加载/错误/重试、动画调参、实例方法和演示开关等非核心 API。

| 参数 | 类型 | 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `TabItem[]` | `[]` | `{ label, value, icon?, badge?, description?, ariaLabel?, disabled? }[]` | 选项数据；`value` 严格保留字符串、数字、布尔值和空字符串，`badge=0` 也保留。 |
| `value` | `string \| number \| boolean \| null` | `null` | 任意原始值或 `null` | 受控当前值；父级回写前不提前切换。`null` 退出受控并延续最后已渲染值。 |
| `defaultValue` | `string \| number \| boolean \| null` | `null` | 任意原始值或 `null` | 非受控首次初值；后续 items 更新不覆盖用户选择。 |
| `variant` | `string` | `'line'` | `line, tag` | line 使用品牌色短底线；tag 使用浅色标签面并突出当前项；两者共享相同选择语义。 |
| `showBottomLine` | `boolean` | `true` | `true, false` | 是否显示唯一活动指示器；关闭时节点平滑淡出，不改变 Header 高度。 |
| `spaceEvenly` | `boolean` | `true` | `true, false` | 仅在 `items≤4` 时生效：`true` 等分并允许文字省略，`false` 使用横向阅读轨道。`items>4` 固定显示四个完整项和第五项的一半，提示可继续横滚；横滚只发生在组件内部。 |
| `split` | `boolean` | `true` | `true, false` | 是否显示相邻 Tab 的中性分隔线；tag 样式以标签间距替代分隔线。 |
| `sticky` | `boolean` | `false` | `true, false` | 是否让 Header 在所属滚动容器内吸顶。 |
| `stickyOffset` | `number` | `0` | `0–400rpx` | 吸顶 Header 的顶部偏移；非法值安全收敛。 |
| `swipeable` | `boolean` | `true` | `true, false` | 是否允许内容面板水平滑动切换；固定 72rpx 阈值，跳过禁用项且不循环。 |
| `ariaLabel` | `string` | `''` | 任意完整文本 | region 与 tablist 的辅助名称；空白值回退“选项卡”。 |
| `reduceMotion` | `boolean` | `false` | `true, false` | 把固定 500ms standard 指示器和 Surface 动效压缩为 1ms。 |

items 全部禁用、空数组或受控值未命中时保持无活动项，不伪造选择。Tabs 不内置 loading、empty、error 或 retry：这些状态属于当前内容面板，应由消费者组合 PUI Loading、Empty、Button 等组件真实处理。

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `click` | `{ value, previousValue, index, item, source: 'tap', controlled }` | 点击可用 Tab 时触发；重复点击当前项仍触发 click，但不重复触发 change。 |
| `change` | `{ value, previousValue, index, item, source: 'tap' \| 'swipe', controlled }` | 点击或水平滑动请求切换到另一可用项时触发一次；受控模式等待父级回写。 |

Tabs 只公开默认 Slot，没有公开实例方法。基础用法保持最小调用，不展示事件全集：

```xml
<pui-tabs items="{{tabItems}}" default-value="base">
  <pui-cell title="基础组件" description="当前分类内容" />
</pui-tabs>
```

需要受控值时只绑定 `change` 并真实回写；需要识别重复点击时再额外绑定 `click`。H5 使用 DOM Rect 测量同一指示器、Pointer Events 镜像 touch 手势；最终滚动惯性、吸顶、rpx 测量和触摸反馈仍以微信真机为准。

## Breadcrumb

`pui-breadcrumb` 是可组合路径导航。路径操作复用内部 Button，图标、加载和错误/空态分别复用 Icon 与 Loading；prefix/suffix 具名 slot 可组合 Tag、Badge 或业务操作。推荐用 `value/defaultValue`：传入 `value` 时点击只请求父级回写，未传时 `defaultValue` 仅初始化一次。历史 `current` 索引仍可作为受控兼容入口，但优先级低于 `value`，不应与 `value` 同时驱动。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `items` | `Array` / `[]` | 每项支持 `{ label, title, value, icon, ariaLabel, disabled, current }`，也兼容字符串；未传 value 时使用索引，value=0 会保留。空数组进入真实 empty。 |
| `value`、`defaultValue` | `any \| null` / `null`、`null` | 受控值与仅首次生效的非受控初值；两者都未传时依次选择 `item.current`、最后一个可用项。受控值不在 items 中时保持无当前项。 |
| `current` | `Number` / `-1` | 旧版受控索引入口；`value` 非空时忽略 current。越界时保持无当前项，不伪造回退。 |
| `separator`、`separatorIcon` | `String` / `'/'`、`''` | separatorIcon 非空时优先使用内部 Icon；否则显示文本分隔符。 |
| `showIcon` | `Boolean` / `true` | 是否显示每项的内部 Icon，不影响 ariaLabel。 |
| `size` | `String` / `'medium'` | small/medium/large；非法值回退 medium。 |
| `wrap` | `Boolean` / `true` | true 时多行换行；false 时使用横向 scroll-view，避免 390px 等窄屏撑破容器。 |
| `maxLabelLength` | `Number` / `0` | 0 不主动截断；正数按字符截断并保留完整 ariaLabel，WXSS 仍提供单行省略兜底。 |
| `currentClickable` | `Boolean` / `false` | 当前页默认不可重复点击；开启后同值点击只触发 click，不触发 input/change。 |
| `customPrefix`、`customSuffix` | `Boolean` / `false` | 渲染 prefix/suffix 具名 slot；slot 内部消费者事件不会伪造成 Breadcrumb click/change。 |
| `disabled` | `Boolean` / `false` | 阻止全部路径与 retry 操作；独立 item.disabled 只阻止对应路径。 |
| `loading`、`loadingText` | `Boolean`、`String` / `false`、`'路径加载中'` | 使用内部 Loading 替换路径内容。 |
| `error`、`errorText`、`retryText` | `Boolean`、`String`、`String` / `false`、`'路径加载失败'`、`'重试'` | error 优先于 loading；retry 只发出请求，消费者决定何时写回 loading 或成功数据。 |
| `emptyText` | `String` / `'暂无路径'` | items 为空且无 error/loading 时的内部 Icon 空态。 |
| `ariaLabel` | `String` / `'面包屑导航'` | navigation 根节点的辅助名称；活动项使用 `aria-current=page`。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`'standard'`、`false` | 颜色、表面与状态过渡限制 0–1000ms；低动效压缩为 1ms，并透传内部 Loading。 |

状态优先级固定为 `error > loading > content > empty`；`defaultValue` 只在非受控首次有数据时使用，因此异步空数组挂载不会提前消耗初值。

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `click` | `{ value, index, item, previousValue, previousIndex, source }` | 点击可用且非当前项；currentClickable=true 时同值点击也会触发。 |
| `input`、`change` | `{ value, index, item, previousValue, previousIndex, source }` | 点击或实例方法请求切换到不同路径。受控模式等待父级回写。 |
| `retry` | `{ source: 'retry' }` | error 状态点击内部重试 Button。 |

实例方法：`select(value)`、`selectIndex(index)` 复用相同点击/切换合同；`reset()` 仅在非受控模式恢复首次选择规则，受控模式返回 `false`。

```xml
<pui-breadcrumb
  items="{{breadcrumbItems}}"
  value="{{breadcrumbValue}}"
  separator-icon="chevron-right"
  wrap="{{false}}"
  custom-prefix
  custom-suffix
  aria-label="组件文档路径"
  duration="500"
  bind:input="onBreadcrumbInput"
  bind:change="onBreadcrumbChange"
  bind:click="onBreadcrumbClick"
  bind:retry="onBreadcrumbRetry"
>
  <pui-tag slot="prefix" theme="primary" variant="outline">Docs</pui-tag>
  <pui-button slot="suffix" variant="text" shape="square" icon="more-horizontal" aria-label="路径更多操作" />
</pui-breadcrumb>
```

H5 使用 `overflow-x:auto` 镜像小程序 `scroll-view` 的 nowrap 模式，并共享同一受控/非受控、当前项、独立禁用、状态优先级和事件规则。浏览器按钮以 `aria-current=page` 表示当前页；最终滚动惯性和触摸反馈仍以微信端为准。

## Tabbar

`pui-tabbar` 是应用一级目的地的底部导航。每项复用内部 Button，图标和徽标分别复用 Icon、Badge；`badge=0` 与 dot 都会真实保留。传入 `value` 时为受控模式，点击按 `click → change` 请求父级回写；未传时 `defaultValue` 仅初始化一次。组件不承担页面 loading、empty、error、retry 或自动路由，业务状态与路由守卫由目的地页面处理。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `items` | `Array` / `[]` | 每项支持 `{ label/text/title, value, icon, activeIcon, badge, badgeDot, badgeMaxCount, badgeColor, disabled, ariaLabel }`；条目 value 只接受字符串、数字或布尔值，缺失或非法值回退条目索引。未声明 label 时按 text/title/序号回退，显式 `label: ''` 表示纯图标项且应提供 ariaLabel。value=0、badge=0 均保留。空数组不渲染假导航或空状态。 |
| `value`、`defaultValue` | `String \| Number \| Boolean \| null` / `null`、`null` | 受控值与仅首次使用的非受控初值；Tabbar 一次只选择一个目的地，不接受数组、对象或函数。两者都未传时选择第一个非 disabled 项。数字 `0`、字符串 `'0'`、`false` 与空字符串严格区分；非法受控值或未命中的值保持无选中，非法非受控初值回退第一个非 disabled 项。 |
| `theme` | `String` / `'normal'` | 活动项主题：normal 使用底部指示器，tag 使用弱背景；非法值回退 normal。 |
| `shape` | `String` / `'normal'` | 导航容器形状：normal 贴合页面边缘，round 使用页面留白和语义大圆角；非法值回退 normal。 |
| `bordered`、`split` | `Boolean` / `false`、`true` | 默认不渲染顶部边界；显式 bordered 才显示中性顶线。split 使用上下收口的中性短分隔，不把每项画成整高 Cell，不改变尺寸。 |
| `fixed`、`placeholder` | `Boolean` / `true`、`false` | fixed 固定到视口底部；placeholder 仅在 fixed 时补回 112rpx 内容高度、round 留白和安全区。 |
| `safeAreaInsetBottom` | `Boolean` / `true` | 原生标签栏与 placeholder 都使用 `env(safe-area-inset-bottom)`。 |
| `zIndex` | `Number` / `1000` | fixed 层级限制 1–12000。 |
| `disabled` | `Boolean` / `false` | 阻止全部目的地选择；item.disabled 只锁定对应项，不发布 click/change。 |
| `ariaLabel` | `String` / `'底部标签栏'` | navigation 根节点辅助名称；每项提供选中和徽标语义。 |
| `reduceMotion` | `Boolean` / `false` | 把固定 `500ms + --pui-ease-standard` 活动态和表面过渡压缩为 1ms。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `click` | `{ value, index, item, previousValue, previousIndex, source: 'item', controlled }` | 点击可用目的地时总是触发；重复点击当前项只触发 click。 |
| `change` | `{ value, index, item, previousValue, previousIndex, source: 'item', controlled }` | 请求切换到不同目的地时紧随 click 触发一次；受控模式等待父级回写。 |

```xml
<pui-tabbar
  items="{{tabbarItems}}"
  default-value="home"
  fixed="{{false}}"
  aria-label="应用主导航"
/>
```

事件专项用法只绑定实际需要的事件：

```xml
<pui-tabbar
  items="{{tabbarItems}}"
  value="{{tabbarValue}}"
  bind:click="onTabbarClick"
  bind:change="onTabbarChange"
/>
```

H5 将 fixed 限定在手机预览容器；小程序端固定到页面视口并使用真实 `env(safe-area-inset-bottom)`。两端共享严格 value、徽标、独立禁用、click→change 与固定 500ms/1ms 事件和动效边界。

## Steps

`pui-steps` 用于表达流程当前位置与各节点状态。每项操作复用内部 Button，图标复用 Icon；组件不承担数据加载、错误、重试、提交或前后页动作。传入 `current` 时为受控模式，选择不同步骤只请求父级回写；未传时 `defaultCurrent` 仅初始化一次。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `items` | `StepItem[]` / `[]` | 每项支持 `title/label`、`content/description`、`extra`、`value`、`icon`、`status`、`disabled`、`ariaLabel`，也兼容字符串/数字；value 缺省时使用索引，空数组不渲染假空态。 |
| `current` | `String \| Number \| Boolean \| null` / `null` | 非 null/undefined 时为受控当前值；与 item.value 严格比较，数字 `0`、字符串 `'0'`、`false` 与空字符串互不碰撞，未命中时保持无当前项。 |
| `defaultCurrent` | `String \| Number \| Boolean` / `0` | 非受控模式仅首次使用；未命中时选择第一个可用步骤，全部禁用时保持 null。受控切回非受控时承接最后一次真实受控值。 |
| `currentStatus` | `'default' \| 'process' \| 'finish' \| 'error'` / `'process'` | 当前项的推导状态；item.status 显式值优先，非法显式值按 default 处理。 |
| `layout` | `'horizontal' \| 'vertical'` / `'horizontal'` | 步骤排列方向；纵向内容允许自然增高。 |
| `sequence` | `'positive' \| 'reverse'` / `'positive'` | 视觉顺序；reverse 只反向展示，事件 value/index 与 items 原身份不变。 |
| `theme` | `String` / `'default'` | default 显示序号/Icon 圆点，dot 使用紧凑节点；item.icon、finish/error Icon 仍可覆盖节点内容。 |
| `scrollable` | `Boolean` / `false` | 仅在 horizontal 生效；固定最小项宽并使用横向 scroll-view，避免多步骤撑破 390px 容器。 |
| `readonly` | `Boolean` / `false` | 保留完整视觉状态但阻止全部步骤选择，不发布 change。 |
| `disabled` | `Boolean` / `false` | 禁用全部步骤；item.disabled 只锁定对应项，均不发布 change。 |
| `ariaLabel` | `String` / `'步骤进度'` | region 根节点辅助名称；当前项使用 `aria-current=step`，各项包含完成、进行、错误或未开始语义。 |
| `reduceMotion` | `Boolean` / `false` | 将固定 500ms + standard 的节点、连线与颜色过渡压缩为 1ms。 |

未显式设置 item.status 时，当前项之前为 finish、当前项使用 currentStatus、之后为 default；显式状态只覆盖自身视觉语义，不改变 current/value 身份。Steps 没有 loading、empty、error、retry 状态；页面按真实数据请求组合相应 PUI 反馈组件。

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ value, index, item, previousValue, previousIndex, source, controlled }` | 点击或键盘选择不同可用步骤；受控模式等待父级回写，重复选择、readonly、disabled 与禁用项静默。 |

Steps 不提供 Slot 或实例方法。业务动作放在相邻 PUI Button/ButtonGroup，加载和异常使用 PUI Loading/Empty/Result。

基础用法只保留必要数据，不绑定任何事件：

```xml
<pui-steps items="{{stepItems}}" />
```

受控事件专项用法只绑定 `change`：

```xml
<pui-steps
  items="{{stepItems}}"
  current="{{stepCurrent}}"
  bind:change="onStepsChange"
/>
```

H5 使用 `overflow-x:auto` 镜像原生 scroll-view，并共享同一严格值、受控/非受控、状态推导、正反序、独立禁用和 change 边界。小程序横滚惯性、触摸反馈、rpx 和 ARIA 最终以微信端为准。

## BackTop

`pui-back-top` 由外部 `scrollTop` 决定是否显示。可见时点击先发布 `to-top`，随后调用真实 `wx.pageScrollTo({ scrollTop: 0 })`；页面再通过 `onPageScroll` 回写新位置。它不维护第二份滚动状态，也不把平台回调伪造成组件成功或失败事件。

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `fixed` | `Boolean` | `true` | `true, false` | `true` 固定在页面右下角并读取系统底部安全区；`false` 作为普通文档流内容。 |
| `icon` | `String` | `'arrow-up'` | Icon 名称，`''` | 默认向上箭头；内部使用 primary 圆形 IconButton，显式空值时可由 `icon` Slot 替换。 |
| `scrollTop` | `Number` | `320` | `≥ 0` | 外部页面当前纵向位置。它是唯一可见性数据源，运行时规整为非负数。 |
| `text` | `String` | `''` | 任意短文本 | 空字符串保持圆形图标按钮；默认 Slot 可在文字后追加短内容。 |
| `theme` | `String` | `'round'` | `round, half-round, round-dark, half-round-dark` | 与 TDesign BackTop 对照的四种形状与深色表面。 |
| `visibilityHeight` | `Number` | `200` | `≥ 0` | `scrollTop` 达到此阈值后显示。 |
| `ariaLabel` | `String` | `'回到顶部'` | 任意非空文本 | 内部 PUI Button 的可访问名称。 |
| `reduceMotion` | `Boolean` | `false` | `true, false` | 将显隐过渡压缩为 `1ms`，并将真实页面回顶动画时长设为 `0`。 |

| 事件 | detail | 说明 |
| --- | --- | --- |
| `to-top` | `{ scrollTop, source: 'tap' }` | 可见状态点击时触发一次，固定早于 `wx.pageScrollTo`。滚动后的 `scrollTop` 仍必须由页面真实回写。 |

| Slot | 说明 |
| --- | --- |
| `icon` | 补充或替换 icon 属性的图标内容；点击仍由 BackTop 管理。 |
| `default` | 追加在 text 后的短内容；不接管显隐、滚动或 `to-top`。 |

BackTop 不公开实例方法，也不内置 `loading / empty / error / retry`：它只是页面导航入口，业务加载和失败反馈应由页面组合 PUI Loading、Empty、Result 或 Toast 处理。

```xml
<pui-back-top scroll-top="{{pageScrollTop}}" />
```

H5 官网使用 PreviewDevice 内的局部滚动区镜像页面滚动，默认镜像 primary 圆形 FAB 与 `arrow-up`；点击后真实滚回该区域顶部并把位置同步到 Props 面板。小程序 App Shell 存在 Tabbar 时通过 `--pui-back-top-bottom-offset` 组合 `--pui-tabbar-content-height` 和安全区，不能覆盖底部导航。H5 不会改变文档页，也不会伪造微信页面 API 的结果。固定定位、安全区、系统回顶动画和无障碍最终以微信端为准。

## Indexes

`pui-indexes` 用于通讯录、城市、组件目录等长分组集合。正文条目组合 PUI Cell/Badge，侧栏组合 PUI Button，集合状态组合 PUI Loading/Empty。搜索、筛选、页面标题和统计由消费者放在 Indexes 外部组合。

侧栏每个索引入口使用紧凑的 PUI Button（`42rpx × 36rpx`）；当前项以高对比反色显示。用户滚动到列表底部时，即使最后一组内容短到无法贴住容器顶部，也会把最后一个分组设为当前项。loading/error/empty 等未显示状态不会保留可操作的隐藏按钮或焦点。

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `IndexesGroup[]` | 内置分组示例 | — | 分组支持 `index/letter/title/children/items/disabled`；条目支持 `label/title/text/value/valueText/description/note/icon/leftIcon/rightIcon/image/badge/badgeDot/badgeMax/arrow/clickable/disabled`。index 只接受非空且无首尾空白的 String 或有限 Number，重复值保留第一组。 |
| `current` | `String \| Number \| null` | `'★'` | 严格命中的分组 index，`null` | 受控当前分组；数字 `0` 与字符串 `"0"` 使用 `Object.is` 区分。无效受控值保持未命中，不自动回退。 |
| `defaultCurrent` | `String \| Number \| null` | `null` | 严格命中的可用分组 index，`null` | 非受控初值，仅在首次获得有效数据时读取；无效或禁用时选择第一个可用分组。 |
| `indexList` | `Array<String \| Number> \| null` | `null` | 有效分组 index 数组，`[]`，`null` | `null` 从 items 派生，数组按严格身份筛选与排序，`[]` 明确隐藏侧栏。 |
| `showFullIndex` | `Boolean` | `false` | `true, false` | `false` 只显示 index 的首个 Unicode 字符，`true` 显示完整 index；事件始终保留原值。 |
| `height` | `Number` | `640` | `240–1200` | 内部 `scroll-view` 高度，单位 rpx；H5 按 `1px≈2rpx` 镜像。 |
| `sticky` | `Boolean` | `true` | `true, false` | 是否使用平台原生 sticky 固定分组标题。 |
| `stickyOffset` | `Number` | `0` | `0–240` | 粘性标题距滚动容器顶部的偏移，单位 rpx。 |
| `indexPosition` | `String` | `'right'` | `left, right` | 侧边索引导航的位置。 |
| `clickable` | `Boolean` | `true` | `true, false` | 是否允许可用条目触发 `item-click`；不影响侧栏定位与手动滚动。 |
| `readonly` | `Boolean` | `false` | `true, false` | 只读时阻止 `item-click`，但保留侧栏定位与滚动联动。 |
| `disabled` | `Boolean` | `false` | `true, false` | 禁用侧栏定位、滚动变更、条目操作、retry 和所有事件，但保留内容可读。 |
| `loading` | `Boolean` | `false` | `true, false` | 展示共享 PUI Loading 并阻止交互；error 优先级更高。 |
| `loadingText` | `String` | `'索引加载中'` | — | Loading 状态文案。 |
| `error` | `Boolean` | `false` | `true, false` | 展示共享 PUI Empty 错误状态；状态优先级为 `error > loading > content > empty`。 |
| `errorText` | `String` | `'索引加载失败'` | — | 错误状态标题。 |
| `retryText` | `String` | `'重新加载'` | — | 错误态 Action 文案；空字符串不渲染 Action。retry 只发布请求，不自动改变 error/loading/items。 |
| `emptyText` | `String` | `'暂无索引数据'` | — | items 为空或没有有效分组时的 PUI Empty 文案。 |
| `ariaLabel` | `String` | `'PoemUI 组件索引'` | — | 根 region 与滚动内容的辅助名称；侧栏使用独立 navigation 语义。 |
| `reduceMotion` | `Boolean` | `false` | `true, false` | 将固定 500ms standard 定位与状态过渡压缩为 1ms，并关闭原生 `scroll-with-animation`。 |

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `select` | `{ current, previousCurrent, index, group, groupIndex, source, controlled }` | 点击或触摸滑过侧栏索引时先触发；重复当前索引仍发 select，但不重复发 change。 |
| `change` | 同 `select` | 活动分组真实改变时触发；侧栏操作固定 `select → change`，用户手动滚动只发 `source='scroll'` 的 change。 |
| `item-click` | `{ value, valueText, item, itemIndex, group, groupIndex, current, source }` | 点击可用 Cell 条目时触发；readonly、disabled、集合状态层与禁用条目静默。 |
| `retry` | `{ source: 'button' }` | 错误态 Action 请求父级重试；组件保持 error，直到父级真实更新状态。 |

Indexes 不公开 Slot 和实例方法。页面 Header/Footer 放在组件外部组合，程序化定位通过受控 `current` 完成。

```xml
<pui-indexes
  items="{{groups}}"
  current="{{activeIndex}}"
  aria-label="城市索引"
/>
```

H5 官网使用局部 `overflow-y:auto`、DOM offset、Pointer Events 和固定 500ms requestAnimationFrame 镜像；小程序使用真实 `scroll-view`、`scroll-into-view`、SelectorQuery、touch 与 WXSS sticky。两端都使用容器底部边界处理短尾分组；H5 隐藏状态层使用 `aria-hidden + inert` 并退出 Tab 序列。惯性、连续 touchmove 命中、sticky、rpx 与读屏最终以微信真机为准。

Indexes 侧栏在真实小程序页面中默认 fixed 浮动并垂直居中；官网仅在 PreviewDevice 内做边界受限的 fixed 镜像，不能把官网页面滚动或组件外的浮层冒充为真实页面定位。

## Sidebar

`pui-sidebar` 用于工作台、设置页和分类目录中的垂直同层导航。固定参考 `tdesign-miniprogram@1.15.3` 的 SideBar / SideBarItem：PoemUI 以单个 `items` 数据入口承接 Item 的 `label/value/icon/badgeProps/disabled`，并保留分组、描述、集合状态和内部 PUI 组合。页面 Header、Footer、内容面板、路由和请求由消费者在组件外组合。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `items` | `Array` / `[]` | 接受平铺条目或 `{ title/label, children/items, disabled }` 分组。条目主字段为 `label/title/text`、String/Number `value`、`icon`、`badgeProps`、`disabled`；PoemUI 扩展 `description/activeIcon/loading`，并兼容 `badge/badgeDot/badgeMax`。Boolean、对象与重复 value 会被跳过。 |
| `value`、`defaultValue` | `String \| Number \| null` / `null`、`null` | 受控值与只初始化一次的非受控初值；数字 `0`、字符串 `"0"` 与空字符串严格区分。无效受控值保持未命中，非受控无效初值回退首项，退控承接最后有效受控值。 |
| `theme`、`bordered` | `String`、`Boolean` / `'default'`、`true` | default 为贴边导航，card 使用当前圆角、阴影和毛玻璃 token；bordered 控制侧边线或卡片边界。 |
| `width`、`height` | `Number` / `360`、`640` | 组件宽度限制为 160–480rpx；默认 360rpx 可容纳默认的图标、描述与徽标组合。总高度限制为 240–1200rpx。 |
| `showGroupTitle`、`sticky`、`stickyOffset` | `Boolean`、`Boolean`、`Number` / `true`、`true`、`0` | 控制分组标题、局部 sticky 和 0–240rpx 顶部偏移；标题关闭时以 max-height/opacity 平滑收起。 |
| `showIcon`、`showDescription`、`showBadge` | `Boolean` / `true` | 控制条目内部组合；`badge=0` 和 `badgeDot` 均会保留。 |
| `clickable`、`readonly` | `Boolean` / `true`、`false` | 阻止条目 change 但保留局部滚动；分组和条目自身 disabled/loading 只锁定对应范围。 |
| `disabled` | `Boolean` / `false` | 禁用条目与重试，并保留当前可见状态。 |
| `loading`、`loadingText` | `Boolean`、`String` / `false`、`'加载中'` | 展示内部 Loading 状态并阻止选择。 |
| `error`、`errorText`、`retryText` | `Boolean`、`String`、`String` / `false`、`'加载失败'`、`'重新加载'` | error 优先于 loading；重试只触发 `retry`，不伪造成功。错误态即使潜在 loading 尚未清除也可重试；空 retryText 隐藏入口。 |
| `emptyText` | `String` / `'暂无导航项'` | 无有效条目且没有 error/loading 时的内部 Empty 文案。 |
| `ariaLabel` | `String` / `'侧边导航'` | navigation 根节点与滚动内容的辅助名称。 |
| `reduceMotion` | `Boolean` / `false` | 表面、标题、状态和条目固定 500ms standard；低动效压缩为 1ms 并关闭 `scroll-with-animation`。 |

状态优先级固定为 `error > loading > content > empty`。状态层和内容滚动区保留在渲染树中，通过 opacity/transform 切换；程序化定位只来自受控 value 回写并使用 `scroll-into-view`。

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ value, previousValue, label, item, index, itemIndex, group, groupIndex, source, controlled }` | 选择不同可用条目；受控模式等待父级回写，重复当前项和阻断态静默。 |
| `retry` | `{ source: 'button' }` | error 状态点击内部重试 Button。 |

Sidebar 不公开 Slot 和实例方法。品牌、标题、辅助操作及右侧内容都在组件外组合；选值和定位只通过 `value/defaultValue` 与真实用户操作完成。

```xml
<pui-sidebar
  items="{{groups}}"
  value="{{activeValue}}"
  aria-label="工作区导航"
/>
```

基础示例不绑定事件；只有业务需要父级回写或错误重试时，才在事件专项用法中声明 `bind:change` / `bind:retry`。H5 官网使用局部 `overflow-y:auto` 和固定 500ms requestAnimationFrame 定位，不移动官网文档页；小程序使用真实 `scroll-view`、`scroll-into-view` 与 WXSS sticky。`width/height/stickyOffset` 在 H5 按 `1px≈2rpx` 近似，最终惯性、sticky 与触摸手感以微信端为准。

## List

`pui-list` 是可组合的数据列表与分页状态容器。默认条目复用内部 `Cell`，数量提示复用 `Badge`，加载、空态和尾部操作分别复用 `Loading`、`Empty`、`Button`；`header`、默认、`footer`、`empty` slot 可交给消费者组合。`items=[]` 会进入真实空态，不生成演示数据；`load` / `retry` 只通知消费者发起请求，不会在组件内部伪造成功或追加条目。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `items` | `Array` / `[]` | 字符串或对象数组。对象支持 `title/label/text`、原始类型 `value`、`valueText`、`description`、`note`、`image`、`leftIcon/icon`、`rightIcon`、`badge/badgeDot/badgeMax/badgeColor`、`arrow`、`required`、`align`、`clickable`、`disabled`、`loading`；`badge=0` 和 `value=false/0` 均保留。已有非空列表尾部追加 items 时，新条目使用 List 的动效参数展开；首次渲染、同长度替换和移除不重播入场。 |
| `title`、`description` | `String` / `''` | 默认 header 的标题与说明。 |
| `showHeader`、`customHeader` | `Boolean` / `false` | 显示默认 header，或启用 `header` 具名 slot；customHeader 优先。 |
| `useSlot` | `Boolean` / `false` | 用默认 slot 完全接管内容区；此时消费者自行管理 slot 内条目及事件。 |
| `showIcon`、`showDescription`、`showValue`、`showBadge`、`showArrow` | `Boolean` / `true` | 控制默认 Cell 组合的各展示层；条目自身 `arrow=false` 仍会关闭箭头。 |
| `clickable` | `Boolean` / `true` | 控制默认条目点击；单项 `clickable=false`、`disabled`、`loading` 会独立阻止 click。 |
| `bordered`、`divided`、`compact` | `Boolean` / `true`、`true`、`false` | 外框、条目分隔线和紧凑密度；均使用全局视觉与间距 token。 |
| `showFooter`、`customFooter` | `Boolean` / `true`、`false` | 控制保留节点的尾部区域；customFooter 启用 `footer` slot，消费者事件不会伪造成 List load/retry。 |
| `customEmpty` | `Boolean` / `false` | 无条目且没有 error/loading 时使用 `empty` slot。 |
| `disabled` | `Boolean` / `false` | 阻止默认条目、默认 footer 和实例方法；消费者 slot 的内部交互仍由消费者自行禁用。 |
| `loading`、`loadText`、`loadingText` | `Boolean`、`String` / `false`、`'加载更多'`、`'加载中'` | 无内容时展示 Loading；已有内容时保留列表，由 footer 展示 loading。 |
| `finished`、`finishedText` | `Boolean`、`String` / `false`、`'没有更多了'` | footer 进入只读结束状态并阻止再次 load。 |
| `error`、`errorText` | `Boolean`、`String` / `false`、`'加载失败，点击重试'` | 无内容时展示错误 Empty，footer 提供 retry；error 优先于尚未清除的 loading，重试不会被该 loading 锁死。 |
| `emptyText` | `String` / `'暂无列表数据'` | 默认 Empty 文案。 |
| `ariaLabel` | `String` / `'列表'` | 根 list 的辅助名称。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`'ease-out'`、`false` | 内容、状态、footer、尾部新增条目与视觉表面的 0–1000ms 过渡；低动效压缩为 1ms。 |

无内容时状态优先级固定为 `error > loading > empty`；已有 items 或默认 slot 时内容持续可见，footer 再按 `error > loading > finished > ready` 表达分页状态。内容、三种状态层和 footer 都保留在渲染树中，以 `max-height + opacity + transform` 平滑切换，不通过 `display:none` 瞬移。只有已有非空 `items` 继续增长时才展开新增尾项；空列表收到首批内容、同长度替换、移除与重复同步不播放。该展开是 `items` 变化后的纯视觉结果，不新增 `expanded`、`animate` 或动画完成事件，也不会改变 `load/retry` 的业务所有权；`useSlot=true` 时消费者自行管理 Slot 内节点和动效。

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `click` | `{ value, valueText, item, index, source: 'tap' }` | 点击可用默认条目。 |
| `load` | `{ source: 'tap' \| 'method', itemCount }` | ready footer 点击或 `loadMore()`；只请求消费者加载。 |
| `retry` | `{ source: 'tap' \| 'method', itemCount }` | error footer 点击或 `retry()`；只请求消费者重试。 |

实例方法：`loadMore()` 在 ready 状态触发 load；`retry()` 只在 error 状态触发 retry。disabled、loading、finished 或不匹配的状态返回 `false`。

```xml
<pui-list
  id="deliveryList"
  items="{{items}}"
  title="组件交付清单"
  show-header
  custom-empty
  loading="{{loading}}"
  error="{{error}}"
  finished="{{finished}}"
  bind:click="onListClick"
  bind:load="onListLoad"
  bind:retry="onListRetry"
>
  <view slot="empty"><pui-icon name="inbox" /> 暂无组件</view>
</pui-list>
```

H5 官网使用 px 镜像相同的 Cell/Badge/Button/Empty/Loading 组合和状态优先级；小程序端使用 WXML/WXSS、rpx 与组件事件。H5 的 load/retry 反馈仅展示事件详情，不自动计时成功，也不追加假条目。

## CountDown

`pui-count-down` 使用 `targetTime + Date.now()` 重算剩余值，不依赖定时器调用次数递减，因此卡顿或后台节流后会按真实目标时间校正。非毫秒显示向上取整到下一秒；`format` 含 `SSS` 时自动启用毫秒刷新。

### Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `time` | `Number` | `0` | `0–31536000000` | 总时长，单位 ms；负数归零，超过 365 天按上界处理，0 是有效完成态。 |
| `autoStart` | `Boolean` | `true` | `true, false` | 挂载、time 更新与 reset 后是否自动开始；运行中改为 false 不会暂停。 |
| `paused` | `Boolean` | `false` | `true, false` | 声明式暂停。true 冻结实时剩余值；恢复 false 时继续由该属性造成的暂停。 |
| `content` | `String` | `default` | `default, slot` | 默认渲染格式化数字；slot 使用默认 Slot 接管可见内容，内部计时仍继续。 |
| `format` | `String` | `HH:mm:ss` | `DD, HH, mm, ss, SSS 与字面量` | 最长 80 字符；未出现更高位 token 时，HH/mm/ss 分别表示总小时/总分钟/总秒。 |
| `millisecond` | `Boolean` | `false` | `true, false` | 使用约 50ms 刷新；format 含 SSS 时自动生效。 |
| `size` | `String` | `medium` | `small, medium, large` | 控制数字块与文字字号；非法值回退 medium。 |
| `theme` | `String` | `default` | `default, round, square` | 默认文本、圆形数字块或方形数字块；非法值回退 default。 |
| `splitWithUnit` | `Boolean` | `false` | `true, false` | 给数字 token 追加天、时、分、秒、毫秒单位，format 字面量仍保留。 |
| `animation` | `String` | `pulse` | `pulse, roll` | 数字变化风格；pulse 为兼容渐隐入场，roll 只垂直滚动变化的 DD/HH/mm/ss 数字位，SSS 直接刷新。 |
| `ariaLabel` | `String` | `倒计时` | `—` | `role=timer` 的辅助名称，组件会追加当前格式化剩余时间。 |
| `reduceMotion` | `Boolean` | `false` | `true, false` | 将选中的 pulse/roll 固定 500ms 过渡压缩为 1ms，不改变计时精度或 animation 值。 |

### Events

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | 时间快照 | 真实剩余时间发生变化；自然归零时先派发最后一次 change。 |
| `finish` | 时间快照 | 运行中的倒计时自然归零后派发一次；time=0 初始化或 reset 不触发。 |

时间快照为 `{time,days,hours,minutes,seconds,milliseconds,totalHours,totalMinutes,totalSeconds,formatted}`。

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 仅 `content="slot"` 时显示；消费者负责由 change 回写自定义文本。 |

### Methods

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `start()` | `Boolean` | 从当前剩余时间启动；已运行、已完成或 paused=true 时返回 false。 |
| `pause()` | `Boolean` | 按真实当前时间冻结；剩余值实际变化时派发 change，未运行时返回 false。 |
| `reset()` | `Number` | 恢复 time 初值，并根据 autoStart/paused 决定是否启动；不伪造 finish。 |
| `getTime()` | `Number` | 返回按目标时间实时校正后的剩余毫秒数。 |

基础用法保持最小调用，不展示事件绑定：

```xml
<pui-count-down time="{{15000}}" format="mm:ss" />
```

数字滚动风格只需增加一个展示 Prop，不改变事件与实例方法：

```xml
<pui-count-down time="{{15000}}" format="mm:ss" animation="roll" />
```

只有需要响应自然变化时才绑定对应事件：

```xml
<pui-count-down
  time="{{15000}}"
  bind:change="onCountDownChange"
  bind:finish="onCountDownFinish"
/>
```

H5 使用同一目标时间算法，并只更新 PreviewDevice 内的计时节点，不以 50ms 频率重绘官网与 Props 面板。浏览器后台调度与微信设备不同，但恢复后均按目标时间校正。

## Table

`pui-table` 是面向小屏数据展示的真实横纵滚动表格。列宽、表头、数据行、固定列和选择列都使用 WXML/WXSS 渲染；空 `data` 不注入演示行。内部复用 `Checkbox`、`Tag`、`Icon`、`Loading`、`Empty`、`Button`，公开面只保留一个 `empty` Slot。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `columns` | `Array` / `[]` | 列配置。支持 `key/dataIndex`、`title/label`、`width`（96–640rpx）、`align`、`fixed: left/right`、`sortable`、`type: text/tag/icon`、`valueMap`、`themeMap`、`theme`、`ellipsis`、`headerIcon`。空列进入真实 empty。 |
| `data` | `Array` / `[]` | 行数据。原始行可使用第一列展示，0/false 不会被吞掉；空数组进入真实 Empty。 |
| `rowKey` | `String` / `'id'` | 行键字段，支持点路径。保留字符串、数字、布尔等原始类型；缺失时才回退原始索引。重复键的渲染 id 仍按行索引隔离。 |
| `bordered`、`stripe` | `Boolean` / `true`、`false` | 外框/行分隔和交替行背景；均使用主题 token，不改变表格结构。 |
| `height` | `Number` / `0` | 局部滚动视口高度，单位 rpx；0 表示按内容自然撑开。横向宽度只由列宽与选择列决定。 |
| `showHeader`、`emptyValue` | `Boolean`、`String` / `true`、`'—'` | 显隐列标题；null/undefined/空字符串单元格使用 emptyValue，0 和 false 保持可见。 |
| `selectable` | `Boolean` / `false` | 显示内部 Checkbox 选择列并启用选择事件和方法。 |
| `selectedRowKeys`、`defaultSelectedRowKeys` | `Array \| null`、`Array` / `null`、`[]` | 受控值与非受控初值。受控交互只请求父级回写；数据变化会过滤已不存在的键，从受控退回非受控时使用最新 defaultSelectedRowKeys。 |
| `multiple`、`selectOnRowClick` | `Boolean` / `true`、`false` | 多选时提供全选；点按行可同时请求选择。选择列始终固定在左侧，独立 Checkbox 始终可用。 |
| `sortable` | `Boolean` / `false` | 为未显式 `sortable=false` 的列开启 `asc → desc → none` 循环；列自身 `sortable=true` 可单独启用。 |
| `sort`、`defaultSort` | `Object \| null`、`Object` / `null`、`{}` | 受控与非受控排序 `{ key, order }`；order 接受 asc/desc 及 ascending/descending。从受控退回非受控时使用最新 defaultSort；排序稳定，相等值保持原始行序。 |
| `customEmpty` | `Boolean` / `false` | 空状态改由 `empty` Slot 接管；false 时复用内部 Empty。 |
| `disabled` | `Boolean` / `false` | 阻止行点击、选择、排序、重试及会改变状态的实例方法，保留当前展示。 |
| `loading`、`loadingText` | `Boolean`、`String` / `false`、`'表格加载中'` | 内部 Loading 状态；不发起请求、不伪造完成。 |
| `error`、`errorText`、`retryText` | `Boolean`、`String`、`String` / `false`、`'表格加载失败'`、`'重试'` | error 为最高优先级，组合 Empty 和 Button；重试只通知消费者。 |
| `emptyText` | `String` / `'暂无数据'` | 无列或无行时的默认 Empty 文案。 |
| `ariaLabel` | `String` / `'数据表格'` | grid 根节点辅助名称；列头、行、选择、排序同步暴露语义，loading/error 分别同步 `aria-busy` / `aria-invalid`。 |
| `reduceMotion` | `Boolean` / `false` | 将固定 500ms 状态、行反馈和排序图标过渡压缩为 1ms。 |

状态优先级固定为 `error > loading > content > empty`。内容和三个状态层保留节点，以 `max-height + opacity + transform` 平滑切换；error/loading 不会把旧数据冒充为新请求结果。

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `cell-click` | `{ row, col, rowIndex, colIndex, columnKey, value, source: 'cell' }` | 点按可用单元格；随后继续触发行级逻辑。 |
| `row-click` | `{ row, index, key, selected, source: 'row' }` | 点按任意可用数据行；与选择开关相互独立。 |
| `input`、`change` | `{ value, selectedRowKeys, selectedRows, selected, key, row, index, source }` | 任意选择请求，固定按 input → change；受控模式等待父级回写。 |
| `sort-change` | `{ key, order, sort, source }` | 表头或方法请求排序；清除时 sort 为 null、order 为空。 |
| `scroll` | `{ scrollLeft, scrollTop, scrollWidth, scrollHeight, deltaX, deltaY, source }` | 原生 scroll-view 实际滚动。 |
| `retry` | `{ source, rowCount }` | error 状态点击 Button 或调用 retry()；仅请求消费者重试。 |

`empty` Slot 只在 `customEmpty=true` 且表格为空时显示。

实例方法：`selectAll(selected?)`、`clearSelection()`、`toggleRow(key, selected?)`、`sortBy(key, order?)`、`clearSort()`、`scrollTo({left, top})`、`retry()`、`getSelection()`、`getSort()`。禁用或状态边界不满足时写操作返回 `false`；`scrollTo` 返回实际规整目标。

```xml
<pui-table
  columns="{{columns}}"
  data="{{rows}}"
  stripe
/>
```

H5 使用局部 `overflow:auto` 与 CSS sticky 镜像原生 `scroll-view + position:sticky`，尺寸按 `1px≈2rpx` 映射。固定单元格继承当前条纹/选中行背景。两端都保留原始类型行键、稳定排序、受控回写、固定列和真实 scroll；小程序最终滚动惯性、字体回流与 sticky 支持仍以目标基础库和真机为准。

## Calendar

`pui-calendar` 是可行内使用或居中弹出的原生日期选择器。组件严格解析 `YYYY-MM-DD` 和时间戳，使用稳定的 42 格六周网格，并组合 PUI Button、Loading 和 Empty。当前公开合同参考 TDesign Mini Program 1.15.3，但只保留 PoemUI 两端能够真实闭环的能力。

### Calendar：TDesign 对照后的 26 Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `String \| Number \| String[] \| Number[] \| null` | `null` | 严格日期、时间戳、日期数组、`null` | 受控选择值；`single` 输出单值，`range/multiple` 输出数组。传入后交互只发布建议值并等待父级回写。 |
| `defaultValue` | `String \| Number \| String[] \| Number[] \| null` | `null` | 严格日期、时间戳、日期数组、`null` | 非受控初值，仅首次挂载读取；从受控切回非受控时延续最后一次受控值。 |
| `title` | `String` | `'选择日期'` | 任意文本、空字符串 | 日历标题，允许自然换行，不使用省略号裁切。 |
| `type` | `String` | `'single'` | `single`, `range`, `multiple` | 单日、日期范围或多日期选择；非法值回退 `single`。 |
| `visible` | `Boolean \| null` | `null` | `true`, `false`, `null` | 受控显隐值；`false` 合法，关闭请求等待父级回写。 |
| `defaultVisible` | `Boolean` | `true` | `true`, `false` | 未传 `visible` 时的非受控初始显隐，只在首次挂载读取。 |
| `minDate` | `String \| Number \| null` | `null` | 严格日期、时间戳、`null` | 可选日期下界；与 `maxDate` 反向时两者自动交换。 |
| `maxDate` | `String \| Number \| null` | `null` | 严格日期、时间戳、`null` | 可选日期上界，同时限制前后面板导航。 |
| `disabledDates` | `Array<String \| Number>` | `[]` | 严格日期或时间戳数组 | 指定不可选择日期；不存在日期和无效值被忽略。 |
| `disableWeekends` | `Boolean` | `false` | `true`, `false` | 是否禁止选择星期六和星期日。 |
| `firstDayOfWeek` | `Number` | `0` | `0–6`，步长 `1` | 周首日；`0` 为星期日，`1` 为星期一，超出范围时安全限制。 |
| `switchMode` | `String` | `'month'` | `month`, `year` | 前后入口每次移动一个月或十二个月。 |
| `showOutsideDays` | `Boolean` | `true` | `true`, `false` | 是否显示六周网格中的相邻月份日期；显示的外月日期遵循相同选择规则。 |
| `allowSameDay` | `Boolean` | `false` | `true`, `false` | `range` 是否允许起止为同一天；关闭时再次点同日会重新开始范围。 |
| `maxRange` | `Number` | `0` | `0–3660` | `range` 最多包含的自然日数量；`0` 表示不限，超限只触发 `limit`。 |
| `maxMultiple` | `Number` | `0` | `0–366` | `multiple` 最多选择数量；`0` 表示不限，超限不截断当前值。 |
| `localeText` | `CalendarLocaleText` | `{}` | `{ today, confirm, cancel, loading, error, retry, empty }` | 集中覆盖可见文案；`today/confirm/cancel/retry` 传空字符串时隐藏对应 Button。 |
| `autoClose` | `Boolean` | `false` | `true`, `false` | 单选完成、范围完成或确认时请求关闭；多选日期点按不会擅自关闭。 |
| `usePopup` | `Boolean` | `false` | `true`, `false` | 是否使用覆盖完整视口的居中遮罩弹层；关闭时为行内日历。 |
| `closeOnOverlayClick` | `Boolean` | `true` | `true`, `false` | 弹层模式点击遮罩是否请求 `visible=false`。 |
| `disabled` | `Boolean` | `false` | `true`, `false` | 阻止日期、导航、确认、取消、遮罩和 Retry 等全部写交互。 |
| `readonly` | `Boolean` | `false` | `true`, `false` | 阻止日期选择，但仍允许浏览月份、确认和关闭；不通过降低整体透明度掩盖内容。 |
| `loading` | `Boolean` | `false` | `true`, `false` | 显示内部 PUI Loading 并锁定日期与导航；不伪造请求完成。 |
| `error` | `Boolean` | `false` | `true`, `false` | 显示内部 PUI Empty 错误态；优先级高于 `loading`，Retry 等待消费者回写。 |
| `ariaLabel` | `String` | `'日期选择'` | 任意非空文本 | 日历 group 根节点辅助名称；日期同步 selected/disabled 语义。 |
| `reduceMotion` | `Boolean` | `false` | `true`, `false` | 将固定 500ms standard 进退场和状态过渡压缩为 1ms。 |

状态优先级固定为 `error > loading > content > empty`。Calendar 不公开 Slot 或实例方法。

### 7 Events

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `change` | `{ value, values, date, source: 'date' }` | 日期点按使选择请求真实变化时触发一次；受控模式等待父级回写 `value`。 |
| `limit` | `{ type: 'range' \| 'multiple', max, value, source: 'date' }` | 范围天数或多选数量超过上限时触发；当前选择保持不变。 |
| `panel-change` | `{ month, year, monthIndex, source: 'previous' \| 'next' \| 'today' }` | 前后导航或“今天”入口真实改变当前月份时触发；不会暗自选择日期。 |
| `visible-change` | `{ visible, source: 'select' \| 'confirm' \| 'cancel' \| 'overlay' \| 'component' }` | 弹层或行内主体请求显隐时触发；受控模式等待父级回写 `visible`。 |
| `confirm` | `{ value, values, source: 'button' }` | 确认 Button 点击时触发；`autoClose=true` 时随后请求关闭。 |
| `cancel` | `{ source: 'button' }` | 取消 Button 点击时先触发，随后请求关闭；不会改变日期值。 |
| `retry` | `{ source: 'button', month }` | 错误态 Retry 点击时触发；组件保持 `error`，等待消费者重新请求并回写。 |

基础用法不绑定任何事件：

```xml
<pui-calendar />
```

范围限制也只声明当前能力，不把全部 `bind:*` 塞进示例：

```xml
<pui-calendar
  type="range"
  min-date="2026-07-01"
  max-date="2026-08-31"
  disabled-dates="{{holidays}}"
  max-range="14"
/>
```

H5 使用等价六周 DOM grid，`usePopup=true` 时遮罩覆盖完整 PreviewDevice；受控交互由预览父级真实回写。两端都保留节点完成固定 500ms 退出，`prefers-reduced-motion` 与 `reduceMotion` 压缩为 1ms。小程序最终触摸、fixed、rpx、样式隔离和读屏表现仍需真机确认。

## Slider

`pui-slider` 直接复用微信原生 `slider` 的横向单拇指手势与表单能力。它不以 H5 自绘表象冒充小程序不具备的范围、纵向、刻度或胶囊轨道。

### Slider：TDesign 对照后的 16 Props

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `value` | `Number \| null` | `null` | 有限数值、`null` | 受控数值；数字 `0` 合法，Boolean、空字符串和非有限数值回退安全下界。 |
| `defaultValue` | `Number` | `64` | 任意有限数值 | 非受控初值，仅首次初始化读取；controlled → uncontrolled 时延续最后一次受控值。 |
| `min` | `Number` | `0` | 任意有限数值 | 安全下界；非法值回退 `0`。 |
| `max` | `Number` | `100` | 大于等于 min 的有限数值 | 安全上界；非法或小于 min 时收敛到 min。 |
| `step` | `Number` | `1` | 正数 | 从 min 起计算的吸附步长；取绝对值，非法或 `0` 回退 `1`。 |
| `color` | `String` | `''` | `#RGB`, `#RRGGBB`, `rgb(r,g,b)` | 微信原生激活轨颜色；非法值回退当前主题前景色。 |
| `trackColor` | `String` | `''` | `#RGB`, `#RRGGBB`, `rgb(r,g,b)` | 微信原生背景轨颜色；非法值回退当前主题中性轨道色。 |
| `name` | `String` | `'releaseProgress'` | 任意表单字段名、空字符串 | 透传微信原生 slider 的表单字段名；组件不自行提交表单。 |
| `blockSize` | `Number` | `28` | `12–28` | 微信原生滑块尺寸；超出范围时安全限制。 |
| `disabled` | `Boolean` | `false` | `true`, `false` | 禁用原生拖动与全部数值请求，并保留 disabled 语义。 |
| `readonly` | `Boolean` | `false` | `true`, `false` | 只读展示当前值，原生滑块以 disabled 门禁承接并保留 readonly 语义。 |
| `showValue` | `Boolean` | `true` | `true`, `false` | 是否显示当前规整数值；完整内容允许自然伸展，不使用省略号。 |
| `showMinMax` | `Boolean` | `true` | `true`, `false` | 是否在轨道两侧显示最小值和最大值。 |
| `valueSuffix` | `String` | `'%'` | 任意短文本、空字符串 | 只追加到可见值和 aria-valuetext，不进入事件、表单值或数值规整。 |
| `ariaLabel` | `String` | `'发布进度'` | 任意非空文本 | Slider 与 H5 range input 的辅助名称。 |
| `reduceMotion` | `Boolean` | `false` | `true`, `false` | 将固定 500ms standard 自定义过渡压缩为 1ms；不改写微信原生手势。 |

### 2 Events

| 事件 | `detail` | 触发条件 |
| --- | --- | --- |
| `changing` | `{ value, previousValue, source: 'drag', controlled, min, max, step }` | 微信原生拖动中的连续请求；`previousValue` 是上一次真实请求值。 |
| `change` | `{ value, previousValue, source: 'drag', controlled, min, max, step }` | 松手且值相对本次拖动起点真实变化时触发一次；不再重复发布 input。 |

Slider 不公开 Slot 或实例方法。基础用法保持最小 WXML 且零 `bind:*`：

```xml
<pui-slider />
```

受控页面只绑定当前业务需要的事件：

```xml
<pui-slider
  value="{{releaseProgress}}"
  step="5"
  show-value
  value-suffix="%"
  bind:changing="onReleaseProgressChanging"
  bind:change="onReleaseProgressChange"
/>
```

`changing` 或 `change` 的处理器必须把 `event.detail.value` 回写给 `releaseProgress`。H5 使用真实 `input[type=range]`：浏览器 `input` 映射 `changing`，浏览器 `change` 映射唯一 `change`；方向键、Home、End 是官网可访问性增强。TDesign 的 range、vertical、marks 和 capsule 依赖自绘手势，当前 PoemUI 为保留微信原生 Slider 的真实能力明确不支持，而不是只在 H5 演示。

## Popup

`pui-popup` 是承载任意内容的基础浮层，提供可选 Header、Content、Footer 三段结构，并负责显隐请求、遮罩、位置、滚动保护、层级与进退场。表单、保存、加载、空/错误状态和业务结果由调用方在 Slot 中组合 PUI 组件处理。

### Props

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `closeBtn` | `Boolean` / `true` | Header 右侧默认常驻的圆形关闭 Button；仅显式传入 `false` 时隐藏默认控件。使用 `close-btn` Slot 替换时必须同时传入 `false`。 |
| `showHeader` | `Boolean` / `false` | 是否渲染三列 Header；左侧保留 `header-left` Slot，中间显示 `title` 与 `subtitle`，右侧承载关闭控件。 |
| `title` | `String` / `''` | Header 中间的主标题；允许空字符串，不伪造默认标题。 |
| `subtitle` | `String` / `''` | Header 中间的辅助说明；允许空字符串，超过标题区宽度时保持单行并以省略号截断。 |
| `showFooter` | `Boolean` / `false` | 是否渲染 Footer；主要动作由 `footer` Slot 内的真实 PUI Button 提供。 |
| `contentScrollable` | `Boolean` / `true` | 是否由 Popup Content 自己承担纵向滚动。组合内部 PUI ScrollArea 时设为 `false`，避免同方向双滚动所有者。 |
| `closeOnOverlayClick` | `Boolean` / `true` | 遮罩点击是否请求关闭；为 `false` 时不发布事件也不改变显隐。 |
| `content` | `String` / `''` | 内容 Slot 均未提供可见内容时的文本回退。 |
| `card` | `Boolean` / `true` | 是否保留浮层与视口之间的 `24rpx` 卡片安全距离。默认 `true`；设为 `false` 后 Surface 贴合当前弹出边缘，内容分区内边距不变。 |
| `duration` | `Number` / `500` | 进入与离开时长，运行时限制为 `0–1000ms`。 |
| `overlayProps` | `OverlayProps` / `{}` | 当前只安全映射 `backgroundColor` 到遮罩。 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'center'` / `'bottom'` | Popup 的进入位置；默认从底部弹出，非法值回退 `bottom`。 |
| `preventScrollThrough` | `Boolean` / `true` | 遮罩以 `catchtouchmove` 阻止触摸穿透；内容滚动不受影响。 |
| `showOverlay` | `Boolean` / `true` | 是否渲染覆盖宿主视口的遮罩。 |
| `blurOverlay` | `Boolean` / `false` | 是否为已渲染的遮罩启用真实 `backdrop-filter` 模糊；仅影响遮罩，不改变 Popup Surface 或全局毛玻璃偏好。 |
| `usingCustomNavbar` | `Boolean` / `false` | 自定义导航栏平台上下文；只调整 top 位置的安全起点。 |
| `visible`、`defaultVisible` | `Boolean \| null` / `null`、`Boolean` / `false` | 受控值与非受控初值。受控关闭请求必须由父级回写 `visible=false`。 |
| `zIndex` | `Number` / `11500` | 层级，运行时限制为 `1–12000`。 |
| `ariaLabel` | `String` / `'弹出层'` | `dialog` 根节点辅助名称。 |
| `reduceMotion` | `Boolean` / `false` | 将自定义进退场压缩为 `1ms`。 |

### Slots 与事件

| 名称 | 说明 |
| --- | --- |
| 默认 slot | Content 中的完整业务内容；可组合 PUI Cell、Form、Loading、Empty 和 Button。 |
| `content` | Content 区域的具名补充内容；与默认 Slot、`content` 属性并列时由调用方避免重复。 |
| `surface-top` | Popup Surface 顶边的非布局内容；推荐放置 `pui-top-loading`，由 Popup 提供定位上下文与圆角裁切。 |
| `header-left` | Header 左侧操作区；调用方应放入圆形 PUI IconButton，并自行处理该业务动作。 |
| `close-btn` | Header 右侧自定义关闭区；替换默认圆形关闭控件时，同时传入 `closeBtn=false`，并提供等价的可访问名称与关闭交互。 |
| `footer` | Footer 主要动作区；调用方放入真实 PUI Button，Popup 不自动提交、关闭或伪造业务成功。 |
| `visible-change` | `{ visible: false, trigger: 'close-btn' \| 'overlay' }`。默认关闭按钮或允许关闭的遮罩请求关闭时触发；Popup 没有 `open/close/submit/retry` 方法或事件。 |

```xml
<pui-popup visible="{{true}}" content="Popup 内容" />
```

这是复制后立即可见的 Starter Usage，不改变 Popup 默认关闭的运行时安全值，也不展示 `bind:*`。结构化调用可以这样组合，Footer 动作由父级处理：

```xml
<pui-popup show-header title="分配执行动作" subtitle="动作和状态由父级管理" show-footer visible="{{popupVisible}}" bind:visible-change="onPopupVisibleChange">
  <pui-button slot="header-left" theme="primary" variant="base" shape="circle" size="small" icon="user-add" aria-label="选择执行成员" bind:click="onSelectMember" />
  <view slot="content"><pui-cell title="执行成员" value="未选择" arrow /></view>
  <pui-button slot="footer" block theme="primary" bind:click="onSubmitPopup">分配执行动作</pui-button>
</pui-popup>
```

需要贴边或模糊遮罩时，只声明实际改变的 Props：

```xml
<pui-popup card="{{false}}" blur-overlay />
```

Popup 关闭时保留节点至 `opacity + transform` 退场结束；H5 以同一节点镜像，`prefers-reduced-motion` 与 `reduceMotion` 都压缩 Popup 自己的 Mask 与 Surface 为 `1ms`，不穿透覆盖 Slot 内 PUI 子组件的动效合同。遮罩只安全镜像 `overlayProps.backgroundColor`，并在 `blur-overlay=true` 时使用 `--pui-popup-overlay-blur`；Blur 在 Layer 挂载时与 Popup Surface 同步参与合成，不能等待色遮 opacity 结束才开始。`preventScrollThrough=true` 时阻止遮罩上的 wheel/touchmove，小程序端以 `catchtouchmove` 实现。Header→Content 只消费一次 `--pui-content-gap`，不再叠加 Surface section gap 与 Content 顶部 panel padding；无 Header 时 Content 仍保留完整 panel padding。Footer 内 Button 的动作结果、是否关闭以及失败恢复均由父级真实处理；Footer 提供满宽承载轨并拉伸直接 PUI Button 宿主，满宽 Footer Button 仍由调用方显式传入 `block`。顶部 `using-custom-navbar` Popup 会消费页面测得的 Navbar 高度并从视口顶部覆盖，左右 Popup 固定为 `70vh × 68vw`；顶部 `card=true + using-custom-navbar=true` 时外层承载层透明、无边框、无阴影和无毛玻璃且 `overflow:visible`，内层 Surface 从测得 Navbar 底部加一个 Token 间距开始并展示 `--pui-glass-shadow`，Header/Content 不重复补偿。

Popup 保持基础浮层职责，不公开拖拽手柄、拖拽阈值或拖拽关闭事件；若需要完整的拖拽事件、状态优先级和底部面板语义，应使用 Sheet。

## Popover

`pui-popover` 在触发元素旁展示轻量内容。它只处理锚点、位置、主题和声明式显隐；加载、错误、重试、提交及业务结果由调用方在 Slot 中组合 PUI 组件。

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `visible` | `Boolean \| null` | `null` | `true, false, null` | 非空即受控；外部点击只请求父级回写。 |
| `defaultVisible` | `Boolean` | `false` | `true, false` | 仅初始化非受控显隐。 |
| `content` | `String` | `这是相对触发元素显示的轻量说明。` | — | 气泡中的文本内容；空字符串合法，不伪造 Empty。 |
| `placement` | `String` | `top` | `top, left, right, bottom, top-left, top-right, bottom-left, bottom-right, left-top, left-bottom, right-top, right-bottom` | 相对锚点的方向；空间不足时同轴翻转。 |
| `showArrow` | `Boolean` | `true` | `true, false` | 是否显示与气泡同色的箭头。 |
| `theme` | `String` | `dark` | `dark, light, brand, success, warning, error` | 气泡语义主题。 |
| `closeOnClickOutside` | `Boolean` | `true` | `true, false` | 显示时是否渲染透明外部点击层并请求关闭。 |
| `fixed` | `Boolean` | `false` | `true, false` | fixed 触发元素场景使用视口测量坐标。 |
| `ariaLabel` | `String` | `组件说明气泡层` | — | 非模态 dialog 的辅助名称。 |
| `reduceMotion` | `Boolean` | `false` | `true, false` | 将固定 500ms 进退场压缩为 1ms。 |

事件：

- `visible-change`：`{ visible: boolean }`。非受控模式先更新内部显隐；受控模式由父级收到事件后回写 `visible`。

Slot：默认 Slot 是触发元素；`content` 是气泡内的组合内容。二者都可以组合 PUI Button、Cell、Tag、Loading 或 Empty，但这些业务状态不属于 Popover 自身。没有实例方法。

```xml
<pui-popover content="更多操作">
  <pui-button variant="outline" icon="more-horizontal">更多操作</pui-button>
</pui-popover>
```

基础用法刻意不含 `bind:*`。需要受控关闭时，只监听 API 中唯一的 `visible-change` 并由页面回写 `visible`。H5 以 PreviewDevice 内的坐标近似微信 fixed 测量；小程序的 SelectorQuery、触摸点击层、rpx 和 Slot 投影仍应在合法 AppID 真机复核。

## ActionSheet

`pui-action-sheet` 从底部展示一组与当前情境相关的操作。它只管理动作呈现、分页、显隐请求与选择事件；业务加载、错误、空态、提交结果和取消后的流程由父级负责。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `align` | `center \| left` / `center` | 列表动作的水平对齐；宫格始终居中。 |
| `blurOverlay` | `Boolean \| null` / `null` | `null` / 未传时继承全局毛玻璃；`true` 强制当前遮罩模糊，`false` 强制纯半透明遮罩。 |
| `cancelText` | `String` / `''` | 取消按钮文案；空值回退为“取消”。 |
| `count` | `Number` / `8` | 每个宫格页展示的动作数；仅 `theme="grid"` 生效。非正数回退为 `8`。 |
| `description` | `String` / `''` | 面板顶部的补充说明。 |
| `items` | `Array<string \| number \| boolean \| ActionSheetItem>` / `[]` | 平铺动作列表。`ActionSheetItem` 包含 `label`、可选的 `description`、`color`、`disabled`、`icon` 和 `suffixIcon`；运行时会原样回传已选动作，`0`、`false` 不会被丢弃。 |
| `showCancel` | `Boolean` / `true` | 是否显示底部取消入口。 |
| `showOverlay` | `Boolean` / `true` | 是否显示背景遮罩。 |
| `theme` | `list \| grid` / `list` | 列表型或带分页的宫格型动作面板。 |
| `usingCustomNavbar` | `Boolean` / `false` | 标记小程序使用自定义导航栏，传递给底部浮层环境。 |
| `visible` | `Boolean \| null` / `null` | 显式 `true/false` 时受控；`null` / 未传时使用内部状态。 |
| `defaultVisible` | `Boolean` / `false` | 仅初始化非受控显隐。 |
| `ariaLabel` | `String` / `动作面板` | dialog 的辅助名称。 |
| `reduceMotion` | `Boolean` / `false` | 将固定 500ms 进退场压缩为 1ms。 |

事件：

- `visible-change`：`{ visible }`。显隐请求发生时触发；受控模式由父级回写。
- `cancel`：无参数。点击取消按钮时先触发，随后请求关闭。
- `close`：`{ trigger: 'overlay' | 'select' | 'cancel' }`。请求关闭时触发。
- `selected`：`{ selected, index }`。点按可用动作时触发；顺序固定为 `selected → close({ trigger: 'select' }) → visible-change({ visible: false })`。

只有默认 Slot，用于在内置动作列表后追加消费者内容。没有组件实例方法；需要命令式行为时由父级维护 `visible`。

基础用法保持最小、零 `bind:*`：

```xml
<pui-action-sheet items="{{actionSheetItems}}" />
```

H5 以 PreviewDevice 内的完整遮罩、底部 Surface 与 180ms/1ms opacity/translateY 镜像小程序 fixed 层；遮罩默认继承外观菜单的毛玻璃状态，并支持 `blurOverlay` 局部覆盖；宫格分页以可点按的 PUI IconButton 翻页近似原生 swiper。微信浮层、安全区、swiper 触摸与图标对象投影仍需真机确认。


## DropdownMenu

`pui-dropdown-menu` 是页面筛选菜单。一个 `items` 条目对应 TDesign 的一个 `DropdownItem`：它管理自己的单选或多选选项；菜单本身不承担网络请求、业务提交或滚动控制。默认触发器、选项和确认区均组合 PoemUI Button、Icon、Empty。

### 参数

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `items` | `Array` | 两个筛选项（状态、排序） | `[]` 或 `{ key, label, options, disabled, multiple }` 数组 | 每个筛选项必须有稳定 `key`；`options` 为 `{ label, value, disabled }` 数组。原始 `0`、`false`、空字符串均为有效 value。 |
| `value` | `Object \| null` | `null` | `null` 或以 item key 保存的对象 | 显式传入即受控；组件只发出 change 请求，父级负责回写。多选值是数组。 |
| `defaultValue` | `Object` | `{ status: 0, sort: ['new'] }` | 以 item key 保存的对象 | 仅初始化非受控状态；不与受控 `value` 混用。 |
| `closeOnClickOverlay` | `Boolean` | `true` | `true, false` | 有遮罩时，点击遮罩是否关闭当前菜单。 |
| `showOverlay` | `Boolean` | `true` | `true, false` | 是否渲染完整页面遮罩。关闭后没有遮罩点击来源。 |
| `zIndex` | `Number` | `11600` | `1–12000` | 菜单浮层的层级；非法值收敛至该范围。 |
| `ariaLabel` | `String` | `组件筛选菜单` | 任意非空文本 | 触发器组和菜单面板的辅助名称。 |
| `reduceMotion` | `Boolean` | `false` | `true, false` | `true` 时进入、退出和遮罩动效压缩为 1ms；否则固定 500ms。 |

### Events

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `open` | `Event` | 点击“状态”触发器 | `{ index, item, source }` | 菜单准备展示时发出；`source` 为 `trigger` 或键盘来源。 |
| `close` | `Event` | 选择单项后触发 | `{ index, item, source }` | 请求关闭时发出；source 为 `select`、`overlay`、`confirm`、`switch` 或 `trigger`。 |
| `change` | `Event` | 单选状态从 `0` 改为 `false` | `{ value, index, item, option, source }` | 选值建议。单选顺序为 `change → close`；多选只发 `change` 并保持面板打开。 |
| `confirm` | `Event` | 多选“排序”点击确定 | `{ value, index, item }` | 多选确认请求；随后按 `confirm → close` 关闭。 |
| `reset` | `Event` | 多选“排序”点击重置 | `{ value, index, item }` | 多选清空请求；顺序为 `change → reset`，面板保持打开。 |

### Slots

| 参数 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| 默认 Slot | 内容 | 一条 `Cell` | 任意 PoemUI 内容 | 位于选项区之后，用于消费者补充说明或入口；不会被转译成菜单事件。 |
| `footer` | 内容 | 页面操作 Button | 任意 PoemUI 内容 | 位于内置多选“重置 / 确定”区之前，承载页面自己的后续操作。 |

DropdownMenu 没有公开实例方法，也不提供 `visible`、`defaultVisible`、`loading`、`error`、`retry`、`readonly`、`disabled`、`placement`、自定义动效或滚动 Props；换言之，它不提供 loading、error、retry。需要请求状态时由页面以 Loading、Empty、Cell 等现有组件组合；不要把网络成功状态伪装成 DropdownMenu 行为。

基础用法保持最小可用 WXML，不绑定事件：

```xml
<pui-dropdown-menu
  items="{{filterItems}}"
  default-value="{{defaultFilters}}"
/>
```

需要父级受控回写或记录关闭来源时，只绑定当前能力必需的事件：

```xml
<pui-dropdown-menu
  items="{{filterItems}}"
  value="{{filterValue}}"
  bind:change="onDropdownChange"
  bind:close="onDropdownClose"
  bind:confirm="onDropdownConfirm"
  bind:reset="onDropdownReset"
>
  <pui-cell title="补充说明" description="默认 Slot 的页面内容" />
  <pui-button slot="footer" size="small" bind:click="onPageAction">页面操作</pui-button>
</pui-dropdown-menu>
```

TDesign 1.15.3 将 DropdownMenu 的遮罩、时长、层级放在父组件，将选值、单选/多选和确认/重置放在 DropdownItem。PoemUI 保持一个可组合的 `items` 入口来表达同一层级关系，避免引入第二个只为容器拆分而存在的公共包。H5 在 PreviewDevice 内以完整遮罩和 500ms `opacity/transform` 镜像真实 WXML/WXSS；`reduceMotion` 为 1ms。390px 下触发器、选项、默认 Slot 和 footer 均在同一设备边界内自然换行；微信 fixed 遮罩、Slot 投影与读屏仍需真机确认。

## Overlay

`pui-overlay` 是可组合的全屏遮罩基础组件。它只负责背景隔离、受控显隐、默认 Slot 与点击请求；不拥有弹层位置、内容内边距、关闭策略、业务状态、生命周期事件或实例方法。可见遮罩根收到点按时只发出 `{ visible: false }`，由父级决定是否回写 `visible=false`。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `visible` | `Boolean` / `false` | 唯一显隐来源。Overlay 从不持有非受控副本；父级在 `click` 后决定是否回写 `false`。 |
| `backgroundColor` | `String` / `''` | 遮罩背景色。空值使用主题默认遮罩色；含分号、花括号或标签字符的危险值被忽略。 |
| `duration` | `Number` / `500` | 透明度进退场时长，规整到 `0–1000ms`。 |
| `preventScrollThrough` | `Boolean` / `true` | 通过 `catchtouchmove` 阻止触摸滚动穿透到底层页面。 |
| `usingCustomNavbar` | `Boolean` / `false` | `true` 时以微信胶囊与状态栏的实际距离作为遮罩根的 top；无可用平台信息时安全回退 `0`。 |
| `blur` | `Boolean` / `false` | `true` 时在遮罩根应用 `--pui-overlay-blur`，让调用方单独选择背景模糊。Provider 的 `frostedGlass=true` 也会自动应用同一模糊；只有两者均为 `false` 时保持仅颜色遮罩。 |
| `zIndex` | `Number` / `11000` | 遮罩根层级，规整到 `1–12000`。 |
| `ariaLabel` | `String` / `关闭遮罩` | 遮罩根的辅助名称。 |
| `reduceMotion` | `Boolean` / `false` | `true` 时将透明度过渡压缩为 `1ms`。 |

Overlay 有 9 个 Props、1 个 Event、1 个 Slot，没有公开 Methods。

- `click`：`{ visible: false }`。可见遮罩根（包括默认 Slot 中的点按冒泡）收到点按时触发；组件不会自行修改 `visible`。

默认 Slot 承载遮罩上的消费者内容。它不提供 `content-click` 的第二事件边界；调用方需要在内容内部阻止冒泡或处理业务动作时，应由 Slot 内实际 PUI 组件和页面逻辑承担。

基础用法不包含事件绑定：

```xml
<pui-overlay />
```

受控页面只订阅当前所需的 `click`，然后真实回写父级状态：

```xml
<pui-overlay
  visible="{{overlayVisible}}"
  blur
  prevent-scroll-through
  bind:click="onOverlayClick"
>
  <pui-cell title="页面正在聚焦" />
</pui-overlay>
```

关闭时节点在透明度退场完成前保留，且没有 `display:none` 或 `height:auto` 过渡。H5 仅在 PreviewDevice 内用 absolute、wheel/touchmove 阻断近似原生 fixed 与 `catchtouchmove`；`usingCustomNavbar` 在 H5 的示例页面有明确的 44px 自定义导航栏上下文。390px 下遮罩、Slot 内容和 API 表格均不应产生页面级横向溢出；微信 fixed 层、胶囊距离、Slot 投影与读屏仍需真机复核。

## TopLoading

`pui-top-loading` 是依附当前 Card 或业务 Surface 顶边的请求进度轨道。它不占正文布局高度，也不根据定时器、进度值或请求结束自行推断成功：未知总量使用双轨变换，精确进度保留 `0–100`，只有父级显式回写 `state="success"` 才进入成功色完成态；失败或取消统一回写 `idle` 并真实退场。

TopLoading 有 8 个 Props，没有 Events、Slots 或公开 Methods。

| 属性 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `state` | `String` | `idle` | `idle, loading, success` | 唯一状态机。`idle` 隐藏，`loading` 按 progress 选择未知或精确轨道，`success` 显式完成。 |
| `progress` | `Number \| null` | `null` | `null, 0–100` | `null` 为未知总量；有效数字限制到 `0–100`，其中 `0` 是合法精确进度。 |
| `delay` | `Number` | `220` | `0–5000ms` | loading 持续达到该时间后才挂载轨道，避免短任务闪烁。 |
| `minimumVisible` | `Number` | `500` | `0–60000ms` | 已显示 loading 在进入 success 前的最短可见时间；取消和失败不借此伪装成功。 |
| `successDuration` | `Number` | `700` | `0–60000ms` | 显式成功态保持时间，随后播放退场。 |
| `duration` | `Number` | `500` | `0–1000ms` | 透明度、transform 与进度变化的统一动效时长。 |
| `ariaLabel` | `String` | `加载进度` | — | 进度根的可访问名称；精确进度同步 `aria-valuenow`。 |
| `reduceMotion` | `Boolean` | `false` | `true, false` | 保留状态与时序语义，将视觉动效压缩到 `1ms`。 |

```xml
<pui-card title="组件发布检查">
  <pui-top-loading
    state="{{taskState}}"
    progress="{{taskProgress}}"
    aria-label="组件发布检查进度"
  />
  <pui-cell title="npm 组件产物" />
</pui-card>
```

父级应在真实任务开始时写入 `loading`，已知总量时持续更新 progress；真实完成写入 `success`，失败或取消写回 `idle`。组件没有 `start/finish/fail` 方法，也不会发出业务成功事件。

## DynamicMessage

`pui-dynamic-message` 是页面顶部的非模态灵动通知。它的深色身份面属于中性反色 Surface，不是 `primary`，因此浅色模式下仍保持黑底高对比。通知先以 PUI Icon/Loading + 标题的紧凑胶囊从顶部出现，再长成完整消息面板；进入展开阶段时，一束对应主题色的对角渐变在小程序 `6rpx` / H5 `3px` 的顶部与右侧轨道中连续移动 `1500ms`，不是让整段边框依次换色。流光与 Icon 共用语义色：loading 中性灰、info 信息蓝、success 成功绿、warning 警告橙、error（失败）危险红。面板本体仍在 `500ms` 内完成并可操作；流光结束只移除装饰层状态，根 Surface 的背景、毛玻璃和阴影不会被覆盖或重建。关闭时先反向收回胶囊，再向上退出。它保留同一个通知节点完成 `loading → info/success/error` 原位更新；不同 key 按调用顺序排队。通知不使用遮罩、不锁页面滚动，Action 只把用户意图交给父级，组件不会伪造业务完成。

DynamicMessage 有 12 个 Props、3 个 Events、3 个公开 Methods，没有 Slots。

| 属性 | 类型 | 演示初值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `theme` | `String` | `info` | `loading, info, success, warning, error` | 默认消息主题；实例 `show/update` 可按消息覆盖。 |
| `title` | `String` | 空字符串 | — | 默认主标题；单行显示，过长时在组件边界内截断。 |
| `message` | `String` | 空字符串 | — | 默认补充说明；保持紧凑且不会撑破通知宽度。 |
| `icon` | `String` | 空字符串 | — | 自定义 PUI Icon 名；为空时使用主题图标，loading 使用 PUI Loading。 |
| `actionText` | `String` | 空字符串 | — | 可选动作文字；为空时不展示 Action Button。 |
| `closable` | `Boolean` | `true` | `true, false` | 是否展示 PUI 圆形关闭 IconButton。 |
| `duration` | `Number` | `3000` | `0–60000ms` | 入场完成后的停留时间；`0` 持续显示。loading 未显式传值时默认为 `0`。 |
| `safeArea` | `Boolean` | `true` | `true, false` | 结合微信状态栏与胶囊下缘计算顶部偏移。 |
| `shadow` | `Boolean \| null` | `null` | `true, false, null` | 组件私有阴影开关：`null` 继承 ConfigProvider，`true` 强制开启，`false` 强制关闭；不写入全局外观。 |
| `frostedGlass` | `Boolean \| null` | `null` | `true, false, null` | 组件私有毛玻璃开关：`null` 继承 ConfigProvider，`true` 强制开启，`false` 强制关闭；只改变通知 Surface，不影响流光层。 |
| `ariaLabel` | `String` | 空字符串 | — | 整条通知的可访问名称；为空时回退标题、说明或主题语义。 |
| `reduceMotion` | `Boolean` | `false` | `true, false` | 不改变 retained node、队列、事件和关闭原因；正常进场为 `180ms` 胶囊 + `320ms` 面板，退场反向执行，低动效压缩到 `1ms`。 |

事件：

| 事件 | Detail | 说明 |
| --- | --- | --- |
| `click` | `{ key, theme }` | 点按当前通知 Surface 时触发；不代表动作完成或通知关闭。 |
| `action` | `{ key, theme }` | 点按可选 PUI Action Button 时触发；父级负责真实后续动作与回写。 |
| `close` | `{ key, theme, reason: "timeout" \| "manual" \| "programmatic" }` | 当前通知完成退场并卸载后触发一次；未展示的排队消息被移除时不触发。 |

方法：

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `show(options)` | `String` | 展示消息并返回 key；当前同 key 原位 patch，不同 key 入队。loading 未显式传 duration 时持续显示。 |
| `update(key, patch)` | `Boolean` | 原位更新当前或排队消息；命中返回 `true`，未知 key 返回 `false`，不创建假消息。 |
| `hide(key?)` | `Boolean` | 当前消息真实退场；指定排队 key 时只移出队列。没有匹配消息时返回 `false`。 |

```xml
<pui-dynamic-message
  id="buildMessage"
  bind:action="onBuildMessageAction"
  bind:close="onBuildMessageClose"
/>
```

```js
const message = this.selectComponent('#buildMessage')
const key = message.show({
  key: 'build',
  theme: 'loading',
  title: '正在生成组件',
  duration: 0
})

// 真实任务有新状态时复用同一个 key。
message.update(key, {
  theme: 'success',
  title: '组件已生成',
  duration: 3000
})
```

进退场固定使用 `500ms`，低动效为 `1ms`；离场期间节点继续保留，完成后才发出 close。微信安全区、原生字体回流、触摸命中、读屏与系统级低动效仍需合法 AppID 真机复核。

## PullRefresh

`pui-pull-refresh` 是自带内部滚动区的下拉刷新容器。它只负责手势、刷新请求与超时收口，不执行网络请求，也不把超时或轨道收起伪造成业务成功。`value` 非 `null` 时由父级控制；达到阈值后，父级按 `change(true) → refresh` 接收请求，并在真实工作完成后回写 `value=false`。

PullRefresh 有 18 Props、7 个 Events、2 个 Slots，没有公开 Methods。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `value`、`defaultValue` | `Boolean \| null`、`Boolean` / `null`、`false` | `value` 非 `null` 时受控；`defaultValue` 只初始化一次刷新轨道状态。 |
| `disabled` | `Boolean` / `false` | 禁止用户下拉，但不阻断内部滚动和 Slot 内容。 |
| `loadingBarHeight`、`maxBarHeight` | `Number` / `50`、`80` | 刷新触发高度与最大可见轨道高度，单位 rpx；运行时 max 不小于 loadingBarHeight。 |
| `loadingTexts` | `String[]` / `['下拉刷新','松手刷新','正在刷新','刷新完成']` | 依次对应 pulling、ready、loading、轨道收起前的完成提示；最后一项不表示业务成功。 |
| `loadingProps` | `Object` / `{}` | 透传给内部 `pui-loading` 的真实可支持字段，例如 `theme`、`size`、`text`。 |
| `refreshTimeout`、`successDuration` | `Number` / `3000`、`500` | 超时后触发 timeout 与关闭请求；轨道完成提示保持时间，单位 ms。 |
| `upperThreshold`、`lowerThreshold` | `Number` / `50`、`50` | 内部 scroll-view 到达上下边界的距离，单位 px。 |
| `showScrollbar`、`enableBackToTop`、`enablePassive`、`usingCustomNavbar` | `Boolean` / `true`、`true`、`false`、`false` | 传递内部 scroll-view 的滚动条、返回顶部、被动事件和自定义导航栏语义。 |
| `scrollIntoView` | `String` / `''` | 内部 scroll-view 要定位到的子节点 id；H5 演示可填 `pull-refresh-record-01` 至 `pull-refresh-record-07` 验证局部定位。 |
| `ariaLabel`、`reduceMotion` | `String`、`Boolean` / `下拉刷新区域`、`false` | 根滚动区辅助名称；低动效把回弹压缩为 `1ms`。 |

事件：

- `dragstart`、`dragging`、`dragend`：分别回传真实触摸开始、位移 `{ distance, percent, status }` 与结束 `{ distance, refresh }`；横向、向上、非顶部与 cancel 不会请求刷新。
- `change`：`{ value, source, controlled }`；刷新请求为 `true`，超时收起请求为 `false`。
- `refresh`：`{ value: true, source, controlled }`；固定在 `change(true)` 后触发，只表示业务应开始刷新。
- `scrolltolower`：内部 `scroll-view` 到达 lowerThreshold 时转发原生 detail。
- `timeout`：`{ timeout, source: 'timeout', controlled }`；表示等待过久，绝不表示数据刷新成功。

`header` Slot 位于刷新提示轨道之后、默认 Slot 之前；默认 Slot 是实际可滚动的业务内容。不提供 `indicator` Slot、`finish/reset/refresh` 实例方法或业务成功/失败事件；同一次 value=true 周期不会重复触发 refresh。

```xml
<pui-pull-refresh>
  <pui-cell title="组件目录" description="默认 slot 可组合 PoemUI 内容" />
  <pui-cell title="发布检查" description="下拉后由父级回写 value" />
</pui-pull-refresh>
```

小程序根节点就是内部 `scroll-view`，以自身滚动位置判断顶部；横向移动、向上移动、touchcancel、非顶部滚动和 disabled 都不会刷新。提示轨道 absolute 定位，正文只做一次 translateY；拖拽中关闭 transition，释放后正常回弹为 `500ms`，低动效为 `1ms`。H5 用真实局部 overflow 与 Pointer/Touch Events 镜像该能力，只有从顶部开始的向下手势才接管刷新，其他手势保持局部原生滚动；`scrollIntoView` 会定位到真实的演示锚点。390px 下内容、轨道与 Slot 都保持在手机镜像内。

## VirtualList

`pui-virtual-list` 是固定行高的大数据窗口化列表。它根据真实 `scrollTop` 只渲染可视区与 overscan 区间，并用上下 spacer 保持完整滚动高度；不支持动态行高，也不会为空 `items` 生成演示数据。默认条目组合内部 Cell、Badge、Icon、Loading，整体状态组合 Empty、Loading。

| 属性 | 类型 / 默认值 | 说明 |
| --- | --- | --- |
| `items` | `Array` / `[]` | 每项支持 `label/title/text`、`description/subtitle`、`value`、`valueText/trailing/note`、`icon`、`badge/badgeDot`、`disabled`、`loading`。 |
| `value`、`defaultValue` | `any \| any[] \| null` / `null`、`null` | `value` 非 null 时受控；defaultValue 只初始化非受控选择。multiple 决定标量或数组。 |
| `multiple`、`selectable`、`allowUnselect` | `Boolean` / `false`、`true`、`false` | 单/多选、是否允许用户选择、单选再次点按是否清空；多选始终逐项切换。 |
| `itemKey` | `String` / `value` | 选择与 `scrollToKey()` 的点路径；缺失、null 或空字符串回退全量索引。业务应保证 key 唯一，`0/false` 不丢失。 |
| `height`、`itemHeight` | `Number` / `480`、`88` | 视口和固定行高，分别限制 `160–1200rpx`、`48–240rpx`。 |
| `overscan` | `Number` / `3` | 可视区前后额外渲染行数，限制 `0–20`。 |
| `scrollTop` | `Number` / `0` | 外部滚动位置，单位 px；实例方法可对相同位置重新下发滚动命令。 |
| `scrollWithAnimation` | `Boolean` / `true` | 实例定位是否平滑；reduceMotion 会关闭。小程序使用原生滚动动画，H5 使用 duration/easing。 |
| `upperThreshold`、`lowerThreshold` | `Number` / `50`、`50` | 距顶部/底部多少 px 触发 upper/lower 与 reach 事件。 |
| `showScrollbar`、`bordered` | `Boolean` / `true`、`true` | 原生/H5 滚动条与容器边线。 |
| `showIndex`、`showDescription`、`showValue` | `Boolean` / `true`、`true`、`false` | 全量索引、说明和 `valueText` 尾值。 |
| `showItemIcon`、`showItemBadge`、`activeIcon` | `Boolean`、`Boolean`、`String` / `true`、`true`、`check` | 内部 Icon、Badge（含 `badge=0`/dot）与已选图标。 |
| `customHeader`、`customFooter`、`customEmpty` | `Boolean` / `false` | 启用 `header`、`footer`、`empty` 命名 slot；header/footer 位于固定滚动视口外。 |
| `customItem` | `Boolean` / `false` | 启用 `componentGenerics` 的 `virtual-item`；未指定泛型时回退内部 Cell。 |
| `clickable`、`readonly`、`disabled` | `Boolean` / `true`、`false`、`false` | clickable 控制 item-click；readonly 允许点击但阻止用户选择；disabled 阻止用户点击/retry，不封锁实例方法与滚动。 |
| `loading`、`loadingText` | `Boolean`、`String` / `false`、`列表加载中` | 内部 Loading 状态。 |
| `error`、`errorText`、`retryText` | `Boolean`、`String`、`String` / `false`、`列表加载失败`、`重试` | 内部错误 Empty 与真实 retry 入口；不自动清除 error。 |
| `emptyText` | `String` / `暂无数据` | 空数组且未启用 customEmpty 时的内部 Empty 文案。 |
| `ariaLabel` | `String` / `虚拟列表` | 根列表的辅助名称。 |
| `duration`、`easing`、`reduceMotion` | `Number`、`String`、`Boolean` / `500`、`standard`、`false` | 选择/状态过渡限制 `0–1000ms`；H5 实例滚动同样使用该时长，低动效压缩为 `1ms` 并关闭平滑滚动。 |

事件：

- `item-click`：`{ item, index, key, value, selected, source }`；readonly/selectable=false 仍保留真实点击边界。
- `input` / `change` / `selection-change`：`{ value, previousValue, item, index, key, selected, multiple, controlled, source }`；受控模式等待消费者回写。
- `scroll`：`{ scrollTop, scrollLeft, scrollHeight, deltaX, deltaY, visibleStart, visibleEnd, renderStart, renderEnd, total, source }`；区间均使用左闭右开索引。
- `scrolltoupper` / `scrolltolower` 与 `reach-start` / `reach-end`：`{ scrollTop, total, source }`。
- `scroll-to`：实例定位详情，包含真实 `scrollTop`、窗口区间、`animated/source`，按索引定位时额外包含 `index/key/align`。
- `retry`：`{ error: true, source: 'action' }`，只通知消费者重新加载。
- `reset`：在 `input/change/selection-change` 后附加当前重置值。

实例方法：`select(key, source?)`、`clearSelection(source?)`、`reset(source?)`、`scrollToIndex(index, alignOrOptions?, animate?)`、`scrollToKey(key, align?, animate?)`、`scrollToOffset(offset, animate?)`、`scrollToTop(animate?)`、`getVisibleRange()`。`align` 支持 `auto/start/center/end`。

```xml
<!-- page.json 同时注册 virtual-list-item 泛型组件 -->
<pui-virtual-list
  id="deliveryVirtualList"
  generic:virtual-item="virtual-list-item"
  items="{{virtualItems}}"
  value="{{selectedKeys}}"
  multiple
  item-key="value"
  height="520"
  item-height="96"
  overscan="3"
  custom-header
  custom-footer
  custom-empty
  custom-item
  bind:item-click="onVirtualItemClick"
  bind:input="onVirtualInput"
  bind:selection-change="onVirtualSelectionChange"
  bind:scroll="onVirtualScroll"
  bind:reach-end="onVirtualReachEnd"
  bind:retry="onVirtualRetry"
>
  <view slot="header"><pui-cell title="组件交付记录" /><pui-tag>{{virtualItems.length}} items</pui-tag></view>
  <view slot="empty"><pui-icon name="inbox" /> 暂无交付记录</view>
  <view slot="footer"><pui-button bind:click="clearSelection">清空选择</pui-button></view>
</pui-virtual-list>
```

小程序使用原生 `scroll-view`、`scroll-top`、`scrolltoupper/scrolltolower` 和 rpx；H5 仅在局部 viewport 使用 overflow 与 px 镜像。两端的窗口计算、原始 key、受控选择、`error > loading > content > empty` 和 retry 无伪恢复合同一致。小程序 `scroll-with-animation` 由平台执行约 500ms 原生过渡；H5 自定义滚动严格使用 `0–1000ms` token。390px 下 header/footer、尾值、Badge、索引和选择图标必须在固定行内截断而不撑破视口。

## Sticky 粘性布局

`Sticky` 让默认 Slot 在页面滚动时停留在顶部。它通过 selector query 保留固定时的同高占位；传入容器函数时，内容不会越过该容器底部。

### Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `container` | `() => NodesRef \| null` | `null` | 返回外部容器节点的函数。Sticky 接近该容器底部时恢复原位置；不接受选择器字符串。 |
| `disabled` | `Boolean` | `false` | 停用吸顶，默认 Slot 仍保留其自身的交互能力。 |
| `offsetTop` | `Number \| String` | `0` | 吸顶时距离页面顶部的偏移，单位 px。 |
| `zIndex` | `Number` | `99` | 吸顶内容层级。 |

### Events、Slots 与方法

| 名称 | detail / 返回值 | 说明 |
| --- | --- | --- |
| `scroll` | `{ scrollTop: number, isFixed: boolean }` | 每次页面滚动测量后触发。 |

默认 Slot 是唯一 Slot，用于放置要吸顶的内容。Sticky 不公开实例方法，也没有 loading、empty、error、retry、受控值或可配置动画。

默认 Slot 是唯一内容入口；Sticky 不渲染内置标题、说明或命名 Slot。`disabled=true` 只停用吸顶，不会阻断 Slot 中 Button、Cell 等消费者交互。

```xml
<pui-sticky offset-top="40">
  <pui-cell
    title="章节导航"
    description="默认 Slot 会在页面滚动时吸顶"
    left-icon="pin"
    bordered="{{false}}"
  />
</pui-sticky>
```

基础用法保持零 `bind:*`。需要接收 `scroll` 时，只在事件专项代码中绑定它。页面模式会复用并保留页面原有 `onPageScroll`；container 必须来自 page.js 中返回 NodesRef 的函数。H5 只滚动官网手机镜像，最终 fixed 定位、selector query、页面滚动链路和真机读屏仍以小程序运行时为准。

## Watermark 水印

`Watermark` 根据根节点真实尺寸绘制文本、图片或图文组合水印。重复模式会按照旋转后的包围盒增加预铺排，单枚模式保持中心定位；水印层始终 `pointer-events: none`，不会拦截 default Slot 内的 Cell、Button 或表单交互。它是展示提示，不提供鉴权、防下载、防截屏或“保护成功”能力。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `alpha` | `Number` | `1` | 每枚水印透明度，限制 `0–1`；不影响被覆盖内容 |
| `content` | `String` | `''` | 水印层下方的文本内容，不是水印图案 |
| `height` | `Number` | `160` | 每枚水印图案最小高度，单位 rpx，限制 `32–720` |
| `isRepeat` | `Boolean` | `true` | 是否按真实容器尺寸重复绘制；`false` 时只绘制一枚 |
| `layout` | `String` | `'rectangular'` | 重复布局：`rectangular / hexagonal` |
| `lineSpace` | `Number` | `16` | 同一图案内图文段的纵向间距，单位 rpx，限制 `0–160` |
| `movable` | `Boolean` | `false` | 是否周期性改变图案位置；不移动 default Slot 内容 |
| `moveInterval` | `Number` | `3000` | 下一次位置更新的等待时间（ms），限制 `400–60000`；不是动画时长 |
| `offset` | `Number[]` | `[]` | 图案起点或单枚中心偏移 `[x, y]`，单位 rpx；`0` 被原样保留 |
| `rotate` | `Number` | `-22` | 旋转角度，限制在 `-90–90` |
| `watermarkContent` | `WatermarkText | WatermarkImage | Array<…>` | `null` | 图案源。文字对象支持 `text/fontColor/fontFamily/fontSize/fontWeight`；图片对象支持 `url/isGrayscale` |
| `width` | `Number` | `240` | 每枚图案宽度，单位 rpx，限制 `80–720` |
| `x` / `y` | `Number` | `24 / 24` | 重复图案水平/垂直间距，单位 rpx，限制 `0–480` |
| `zIndex` | `Number` | `1` | 水印层级，限制 `0–12000`；水印层不接管指针或触摸 |
| `ariaLabel` | `String` | `'水印区域'` | 被覆盖内容区域的辅助名称；水印层本身 `aria-hidden` |
| `reduceMotion` | `Boolean` | `false` | 停止 `movable` 更新，并把已有位置过渡压缩为 `1ms` |

Watermark 没有 Events 或公开 Methods。`content` Slot 用于水印层下方的补充内容，default Slot 是被水印覆盖的业务内容；`pui-class`、`pui-class-layer`、`pui-class-mark` 可分别扩展根、水印层和每枚图案的样式。

```xml
<pui-watermark
  content="内部资料"
  alpha="0.16"
  width="240"
  height="160"
  x="24"
  y="24"
  layout="rectangular"
  watermark-content="{{watermarkContent}}"
  rotate="-22"
  z-index="1"
  aria-label="内部资料保护区"
>
  <pui-cell title="受保护内容" description="水印层不会拦截内部操作" />
</pui-watermark>
```

```js
Page({
  data: {
    watermarkContent: [
      { text: '内部资料', fontSize: 24, fontWeight: 'bold' },
      { url: '/assets/brand.png', isGrayscale: true },
    ],
  },
});
```

小程序与 H5 都随真实容器尺寸重绘，并在极端密度下使用内部节点上限保护页面；该保护不转换为公开成功或错误状态。图片资源由平台实际渲染，最终域名、解码、字体和 rpx 行为仍以合法 AppID 的真机为准。

## Swiper 轮播图

`Swiper` 基于微信原生 `swiper`，不会用 `scroll-view` 或 CSS 滚动吸附模拟轮播。`value` 使用每项固定 `value` 字段的原始标量，数字 `0`、布尔 `false`、空字符串和字符串 `"0"` 都是合法且互不混淆的值。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `SwiperItem[]` | `[]` | 固定 item schema 的轮播数据，最多100项；标量直接同时作为 value 与 title |
| `value` | `any / null` | `null` | 当前项原始值；非 `null/undefined` 时受控 |
| `defaultValue` | `any / null` | `null` | 非受控初值；不存在时采用第一项 |
| `height` | `Number` | `360` | 视口高度，单位 rpx，限制 `160–1200` |
| `circular` | `Boolean` | `true` | 多于一项时是否循环 |
| `autoplay` | `Boolean` | `false` | 是否自动切换；状态异常、禁用或低动效时停止 |
| `interval` | `Number` | `5000` | 自动播放间隔，限制 `1000–60000ms` |
| `duration` | `Number` | `500` | 原生 swiper 项切换时长，限制 `0–1000ms`；状态层固定 500ms |
| `easingFunction` | `String` | `'default'` | `default / linear / easeInCubic / easeOutCubic / easeInOutCubic` |
| `direction` | `String` | `'horizontal'` | `horizontal / vertical` |
| `previousMargin` | `Number` | `0` | 前一项露出距离，单位 rpx，限制 `0–240` |
| `nextMargin` | `Number` | `0` | 后一项露出距离，单位 rpx，限制 `0–240` |
| `displayMultipleItems` | `Number` | `1` | 同屏项数，限制 `1–5` 且不超过真实项数 |
| `disableTouch` | `Boolean` | `false` | 仅关闭手势，仍允许 Navigation controls、分页和实例方法 |
| `navigation` | `Boolean / SwiperNavigation` | `true` | 统一控制分页类型、位置、controls 与最小显示数量；false 全部隐藏 |
| `imageMode` | `String` | `'aspectFill'` | 透传内部 Image 支持的微信图片模式 |
| `customItem` | `Boolean` | `false` | 启用 `componentGenerics` 的 `swiper-slide` |
| `disabled` | `Boolean` | `false` | 禁用全部交互、自动播放和 retry |
| `loading` | `Boolean` | `false` | 显示内部 Loading，停止轮播 |
| `loadingText` | `String` | `'轮播加载中'` | 加载说明 |
| `error` | `Boolean` | `false` | 显示错误 Empty，优先于 loading/content/empty |
| `errorText` | `String` | `'轮播加载失败'` | 错误说明 |
| `retryText` | `String` | `'重试'` | retry Button 文案；空字符串隐藏操作 |
| `emptyText` | `String` | `'暂无轮播内容'` | 空数组说明，不生成演示项 |
| `ariaLabel` | `String` | `''` | 根轮播可访问名称，空值回退“轮播图” |
| `reduceMotion` | `Boolean` | `false` | 将 swiper 与状态过渡压缩到 `1ms` 并停止自动播放 |

`SwiperItem` 固定为 `{ value, title, description, image, icon, tag, tagTheme, theme, disabled, ariaLabel }`。对象未提供 `value` 时才回退索引；默认条目依次组合 Image 或 Icon、Tag、标题和说明。`theme/tagTheme` 支持 `default/primary/success/warning/danger`。

`SwiperNavigation` 固定为 `{ type, position, showControls, minShowNum }`：`type` 支持 `dots/dots-bar/fraction`，`position` 支持 `inside/outside`，`showControls` 显示内部 PUI IconButton，`minShowNum` 默认2。

| 事件 | detail | 说明 |
| --- | --- | --- |
| `click` | `value/index/item/active/source` | 点击真实条目；禁用项静默 |
| `input` | `value/previousValue/index/previousIndex/item/source/controlled` | swipe、Navigation、autoplay 或方法请求切换时先触发 |
| `change` | 与 input 相同 | 紧随 input 表示同一次切换请求 |
| `animationfinish` | `value/index/item/source` | 原生 swiper 动画结束 |
| `image-load` | 原生图片 detail + `value/index/item` | 内部 Image 资源真实加载完成 |
| `image-error` | 原生图片 detail + `value/index/item` | 内部 Image 资源真实加载失败 |
| `retry` | `source/errorText` | 只通知消费者重新请求，不改写 error |

| 实例方法 | 返回值 | 说明 |
| --- | --- | --- |
| `select(value)` | `Boolean` | 按严格原始值选择 |
| `next()` | `Boolean` | 请求下一项 |
| `prev()` | `Boolean` | 请求上一项 |
| `reset()` | `Boolean` | 请求恢复 `defaultValue` 或第一项 |
| `retry()` | `Boolean` | 在可重试错误态派发 retry |
| `getValue()` | `any` | 返回当前原始值 |
| `getState()` | `Object` | 返回值、索引、受控、数量、状态、方向、自动播放和禁用快照 |

Swiper 不公开 Slot；标题、Footer、状态摘要和业务操作在组件外组合。`customItem=true` 时，通过 `componentGenerics` 给每个条目传入 `item/index/value/active/title/description`。未指定 Generic 时回退内部 Card。

```xml
<pui-swiper items="{{slides}}" />
```

受控模式必须由页面在 `input/change` 中真实回写 `value`；拒绝回写时，原生 swiper 会回到受控项。H5 使用 Pointer Events、像素 transform 和循环克隆项镜像该合同，按 `1px≈2rpx` 映射高度与 margin；浏览器方向键是官网增强，不作为小程序依赖。

## NavigationMenu

`pui-navigation-menu` 是触摸优先的分层导航。它保留 `mode="navigation"` 与 `mode="menubar"` 两种导航呈现模式，但不再作为两个可安装、可搜索的独立组件公开。微信小程序没有可靠 hover 与全局桌面快捷键，因此两种模式都使用可点按根项、固定高度面板和钻取式子菜单，不伪造桌面指针语义。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `items` | `NavigationMenuItem[]` | `[]` | 根项最多 12 个；每层最多 50 项、全树最多 100 项、最多 3 层。 |
| `value` | `any / null` | `null` | 当前选值；非 `null/undefined` 时受控，保留 `0/false`。 |
| `defaultValue` | `any / null` | `null` | 非受控选值初值。 |
| `expandedValue` | `any / null` | `null` | 当前展开根项；非 `null/undefined` 时受控。 |
| `defaultExpandedValue` | `any / null` | `null` | 非受控展开初值；无效时回退首个可用的含子项根项。 |
| `visible` | `Boolean / null` | `null` | 面板显隐；非 `null/undefined` 时受控。 |
| `defaultVisible` | `Boolean` | `false` | 非受控显隐初值。 |
| `checkedValues` | `any[] / null` | `null` | checkbox 项值；非 `null/undefined` 时受控并严格去重。 |
| `defaultCheckedValues` | `any[]` | `[]` | 非受控复选初值。 |
| `radioValues` | `Record<string, any> / null` | `null` | 各 `radioGroup` 当前值；非 `null/undefined` 时受控。 |
| `defaultRadioValues` | `Record<string, any>` | `{}` | 非受控单选初值。 |
| `itemKey` | `String` | `'value'` | 对象项原始值字段。 |
| `labelKey` | `String` | `'label'` | 可见标签字段。 |
| `childrenKey` | `String` | `'children'` | 子菜单字段；仍兼容 `submenu/menu`。 |
| `iconKey` | `String` | `'icon'` | 内部 Icon 名称字段。 |
| `mode` | `navigation / menubar` | `'navigation'` | 导航链接或持续命令菜单语义。 |
| `direction` | `horizontal / vertical` | `'horizontal'` | `horizontal` 时根项横向排列且 Panel 按 placement 上下展开；`vertical` 时根项为左侧 rail，Panel 在右侧同层展开。 |
| `placement` | `bottom / top` | `'bottom'` | 仅 horizontal 时控制 Panel 相对根项的上下位置；vertical 保持左右同层结构。 |
| `variant` | `default / outline / soft` | `'default'` | 根触发器容器表面。 |
| `size` | `small / medium / large` | `'medium'` | 根项和内部 Cell 密度。 |
| `block` | `Boolean` | `true` | horizontal 时占满父级可用宽度；vertical 为保留右侧 Panel 内容区，始终占满可用宽度。 |
| `scrollable` | `Boolean` | `true` | horizontal 且未开启 `wrap` 时采用自适应轨道：放得下则等宽铺满，低于每项 `208rpx` 可读宽度时在 Trigger viewport 内横向滚动；设为 `false` 时严格等宽并只省略过长标题。vertical 根 rail 溢出时控制局部纵向 scroll-view。 |
| `wrap` | `Boolean` | `false` | horizontal 根项是否按最小轨换行；false 时保持单行等分，不建立横向滚动。 |
| `showHeader` | `Boolean` | `true` | 显示面板标题、返回与关闭区。 |
| `showIcon` | `Boolean` | `true` | 显示根项和菜单项内部 Icon。 |
| `showDescription` | `Boolean` | `true` | 显示根项/分组/菜单项说明。 |
| `showBadge` | `Boolean` | `true` | 显示根项与菜单项 Badge。 |
| `showIndicator` | `Boolean` | `true` | 显示展开、checkbox 与 radio 指示。 |
| `indicatorIcon` | `String` | `'chevron-down'` | 根展开指示的内部 Icon。 |
| `showGroup` | `Boolean` | `true` | 显示分组 heading/description。 |
| `showSeparator` | `Boolean` | `true` | 显示分组与条目分隔线。 |
| `showShortcut` | `Boolean` | `true` | 显示说明性 shortcut；不会监听硬件快捷键。 |
| `closeOnSelect` | `Boolean` | `true` | action/link 选中后关闭面板。 |
| `closeOnCheck` | `Boolean` | `false` | checkbox/radio 更新后关闭面板。 |
| `closeOnOverlayClick` | `Boolean` | `true` | 点按遮罩是否请求关闭。 |
| `showOverlay` | `Boolean` | `true` | 渲染透明度过渡的 fixed 遮罩。 |
| `resetSubmenuOnClose` | `Boolean` | `true` | 退场完成后重置到根层。 |
| `autoNavigate` | `Boolean` | `false` | 是否调用真实微信导航 API；默认只派发请求。 |
| `customTrigger` | `Boolean` | `false` | 用 `navigation-trigger` component generic 渲染根项。 |
| `customItem` | `Boolean` | `false` | 用 `navigation-item` component generic 渲染当前菜单项。 |
| `customHeader` | `Boolean` | `false` | 使用 `header` slot 接管标题区。 |
| `customContent` | `Boolean` | `false` | 使用默认 slot 接管 content 状态。 |
| `customFooter` | `Boolean` | `false` | 渲染 `footer` slot。 |
| `customEmpty` | `Boolean` | `false` | 使用 `empty` slot 接管空态。 |
| `disabled` | `Boolean` | `false` | 阻断根触发、面板操作、retry 与写方法。 |
| `readonly` | `Boolean` | `false` | 保留展示与滚动，阻断展开、选值、勾选和 reset。 |
| `loading` | `Boolean` | `false` | 显示内部 Loading；状态优先级低于 error。 |
| `loadingText` | `String` | `'导航加载中'` | 加载态说明。 |
| `error` | `Boolean` | `false` | 显示内部 Empty + Button 错误态。 |
| `errorText` | `String` | `'导航加载失败'` | 错误说明。 |
| `retryText` | `String` | `'重试'` | retry Button 文案。 |
| `emptyText` | `String` | `'暂无导航内容'` | 无当前菜单项时的空态说明。 |
| `panelWidth` | `Number` | `0` | 面板宽度，单位 rpx，`0` 表示根容器宽；限制 `0–1200`。 |
| `maxHeight` | `Number` | `560` | 固定内容视口高度，单位 rpx，限制 `240–960`。 |
| `offset` | `Number` | `12` | 面板与根触发器距离，单位 rpx，限制 `0–96`。 |
| `zIndex` | `Number` | `1000` | 弹层层级，限制 `1–12000`。 |
| `ariaLabel` | `String` | `'导航菜单'` | 根 navigation 与面板辅助名称。 |
| `duration` | `Number` | `500` | 面板、状态和子菜单过渡，限制 `0–1000ms`。 |
| `easing` | `String` | `'standard'` | `standard/ease/linear/ease-in/ease-out/ease-in-out`。 |
| `reduceMotion` | `Boolean` | `false` | 将自定义过渡压缩为 `1ms`。 |

`NavigationMenuItem` 支持 `value/label/description/icon/badge/badgeDot/type/theme/radioGroup/disabled/loading/hidden/separatorBefore/close/url/openType/delta/children`。`type` 为 `action/link/checkbox/radio/submenu/separator`；含 children 时强制为 submenu。分组对象使用 `{ heading, description, separatorBefore, items }`。所有非 separator 值按“类型 + 值”全树去重，数字 `0`、布尔 `false` 与字符串 `'false'` 互不覆盖。

| 事件 | detail | 说明 |
| --- | --- | --- |
| `click` | `value/item/expanded/hasChildren/source` | 根项真实点按。 |
| `item-click` | `value/type/item/depth/path/source` | 根直接项或当前层条目点按。 |
| `input` / `change` / `select` | `value/previousValue/item/source/controlled/changed` | action/link 选值请求；同值仍表达真实选择。 |
| `expanded-input` / `expanded-change` | `expandedValue/previousExpandedValue/item/source/controlled/changed` | 根展开值请求。 |
| `visible-input` / `visible-change` | `visible/previousVisible/expandedValue/source/controlled` | 面板显隐请求。 |
| `open` / `close` | 同 visible detail | 显隐请求同步事件。 |
| `after-open` / `after-close` | `visible/expandedValue/path/source` | 真实 0–1000ms 进退场完成；关闭后 path 是退场前路径。 |
| `checked-input` / `checked-change` | `checkedValues/previousCheckedValues/value/checked/item/source/controlled` | checkbox 状态请求。 |
| `radio-input` / `radio-change` | `radioValues/previousRadioValues/group/value/item/source/controlled/changed` | radio 分组状态请求。 |
| `submenu-open` / `submenu-close` | `depth/path/item/source` | 双 pane 钻取或返回开始。 |
| `navigate` | `value/item/url/openType/delta/source/auto/started` | 导航请求；`autoNavigate=false` 时止于此事件。 |
| `navigate-success` | navigate detail + `result` | 仅来自微信导航 API 的真实 success 回调。 |
| `navigate-error` | navigate detail + `error` | 微信导航失败或 API 不可用。 |
| `overlay-click` | `source/close/expandedValue` | 遮罩真实点按。 |
| `retry` | `expandedValue/path/source` | 只通知消费者重新请求，不清除 error。 |
| `scroll` | 原生 scroll detail + `source/path?` | 根 scroll-view 或面板 scroll-view 的真实滚动。 |
| `reset` | `value/expandedValue/checkedValues/radioValues/source` | reset 请求 default* 后的汇总事件。 |

| 实例方法 | 返回值 | 说明 |
| --- | --- | --- |
| `open(value?)` | `Boolean / detail` | 展开指定或当前根项并请求显示。 |
| `close()` | `Boolean / detail` | 请求关闭。 |
| `toggle(value?)` | `Boolean / detail` | 切换指定或当前根项。 |
| `select(value)` | `Boolean / detail` | 按严格原始值执行 action/link/checkbox/radio/submenu。 |
| `openSubmenu(value)` | `Boolean` | 按严格原始值进入 submenu。 |
| `back()` | `Boolean` | 返回上一级。 |
| `reset()` | `Boolean` | 请求恢复 value/expanded/checked/radio 的 default* 并回到根层。 |
| `retry()` | `Boolean` | error 态派发 retry。 |
| `getValue()` | `any` | 返回当前选值。 |
| `getState()` | `Object` | 返回五组状态、path/depth 与 stateType 快照。 |

`header/default/footer/empty` slot 与 `navigation-trigger/navigation-item` generics 都只能由消费者显式开启。generic 默认分别回退内部 Button 与 Cell；默认内容层还组合 Badge、Icon、Loading、Empty，未注入任何静态业务结果。

```xml
<!-- page.json 注册 pui-navigation-menu / pui-button / pui-cell / pui-tag。 -->
<pui-navigation-menu
  id="deliveryNavigationMenu"
  items="{{navigationItems}}"
  value="{{navigationValue}}"
  expanded-value="{{navigationExpandedValue}}"
  visible="{{navigationVisible}}"
  checked-values="{{navigationCheckedValues}}"
  radio-values="{{navigationRadioValues}}"
  mode="menubar"
  custom-footer
  bind:input="onNavigationInput"
  bind:expanded-input="onNavigationExpandedInput"
  bind:visible-input="onNavigationVisibleInput"
  bind:checked-input="onNavigationCheckedInput"
  bind:radio-input="onNavigationRadioInput"
  bind:navigate="onNavigationNavigate"
  bind:navigate-success="onNavigationSuccess"
  bind:navigate-error="onNavigationError"
>
  <view slot="footer"><pui-tag variant="outline">消费者 footer</pui-tag></view>
</pui-navigation-menu>
```

页面必须在五类 `*-input` 中真实回写对应受控 Props。`autoNavigate=true` 只在小程序端调用 `wx.navigateTo/redirectTo/switchTab/reLaunch/navigateBack`；H5 调试站会保留当前文档路由并明确显示 `navigate-error` 平台边界，绝不伪造 `navigate-success`。四个状态层和子菜单出入双 pane 均常驻到过渡完成，固定 `maxHeight` 避免 `height:auto` 跳变；H5 尺寸按 `1px≈2rpx` 映射。

## 主题与样式工具

`ConfigProvider` 支持 `theme="light | dark | auto"`，并通过 `shadow`、`frosted-glass`、`large-radius`、`bordered`、`equal-spacing` 控制组件树视觉。单页可以直接传 Props；跨页面统一时，从包入口读取 `visualConfig`，在 `App.onLaunch` 调用 `restore()`，并让每个页面根使用 `use-global-config` 订阅同一 Store。`effectsEnabled=false` 只暂停阴影、毛玻璃和大圆角，主题、边框与等距模式保持独立；全局渐变开关属于消费者页面背景，不是 Provider Prop；独立 `pui-bg-gradient-*` 可显式挂在业务 View 或容器。

### ConfigProvider Props

| 参数 | 类型 | 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| `theme` | `String` | `light` | `light, dark, auto` | 当前组件树主题；`auto` 跟随微信系统主题。开启全局模式后读取 `visualConfig.theme`。 |
| `shadow` | `Boolean` | `false` | `true, false` | 为支持的子树 Surface 启用语义阴影 Token，不改变尺寸和布局。 |
| `frosted-glass` | `Boolean` | `false` | `true, false` | 为支持的子树 Surface 启用半透明与毛玻璃 Token，不增加第二层面板。 |
| `large-radius` | `Boolean` | `false` | `true, false` | 重映射全部语义圆角档位；显式 `round/circle` 保持满圆。 |
| `bordered` | `Boolean` | `true` | `true, false` | 控制中性边界；关闭时保留盒模型及焦点、错误、选中和危险状态边界。 |
| `equal-spacing` | `Boolean` | `false` | `true, false` | 让具备独立 Surface 资格的结构块使用同一组 Surface inset/gap；不污染控件内部微间距和连续列表行。开启全局模式后读取 `visualConfig.equalSpacing`。 |
| `use-global-config` | `Boolean` | `false` | `true, false` | 订阅包入口公开的 `visualConfig`；开启后 Store 配置优先于局部视觉 Props。 |
| `custom-class` | `String` | 空字符串 | — | 附加到 Provider 根节点的业务 class；优先使用语义 Token。 |
| `custom-style` | `String` | 空字符串 | — | 附加到 Provider 根节点的行内样式；只用于明确的页面根布局。 |

### ConfigProvider Events

| 事件 | detail | 说明 |
| --- | --- | --- |
| `bind:themechange` | `{ theme, source, frostedGlass, shadow, largeRadius, bordered, equalSpacing, effectsEnabled, global }` | 解析后的实际主题在 `light/dark` 之间变化后触发；只切换阴影、毛玻璃、圆角、边框或等距不会重复触发。 |

### ConfigProvider Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 需要继承当前主题与视觉 Token 的页面或组件子树。 |

基础用法不需要绑定事件，也不需要重复声明默认值：

```xml
<pui-config-provider>
  <view>页面内容</view>
</pui-config-provider>
```

TDesign 1.15.3 的同名组件主要公开 `globalConfig/themeVars`，用于全局文案、通用组件配置和主题变量覆盖。PoemUI 借鉴其“Provider + Store”分发结构，但保留语义 Token 视觉职责，不机械引入国际化配置树或任意变量对象。

```js
// app.js
const { visualConfig } = require('poemui-miniprogram');

App({
  onLaunch() {
    const restored = visualConfig.restore();
    if (restored.error) console.warn('PoemUI 视觉配置恢复失败', restored.error);
  },
});

// 任意设置页：写入后所有已挂载的 use-global-config Provider 同步更新
visualConfig.set({ theme: 'auto', bordered: true });
visualConfig.applyPreset('soft');
visualConfig.setEffectsEnabled(false);
```

```xml
<!-- 每个页面根；小程序没有覆盖全部页面的单一 App WXML 根 -->
<pui-config-provider use-global-config>
  <view>当前页面内容</view>
</pui-config-provider>
```

页面级 utility-first 样式层从 `poemui-miniprogram/theme/utilities.wxss` 引入，当前包含 562 个选择器，覆盖 display/flex/grid、8 档正向 spacing、尺寸、定位、溢出、字体、背景、边框、圆角、阴影、九个主题感知 `pui-bg-gradient-*` 背景工具、安全区和 120/500ms 轻量 transition；其中 32 个精选色彩 utility 提供 red/orange/amber/emerald/teal/blue/violet/pink 的文字、实色背景、柔和背景和边框，AI 雾蓝紫、赛博粉蓝与极光紫可与金色、中性预设一起筛选使用。`pui-text-cut` 提供受控的单行省略，`pui-text-truncate` 保留为兼容别名，32 个 `pui-dark-*` 文本、背景、边框和阴影条件变体只在 `pui-theme--dark` 范围内覆盖默认类。实色强调背景不隐式决定文字色；背景渐变可直接挂在消费者 View 或布局容器，不能穿透覆盖组件 Surface 或伪造业务状态。

Style Utilities 是静态 WXSS 交付物，不是组件：它没有 Props、事件或实例方法，也不提供运行时 JIT、任意值、负间距、hover/focus 变体。官网的 `category/themeView/scale/layout/columns/align/fullWidth/wrap/shadow` 只是由 PoemUI Button/Card/Icon/Tag 构成的文档筛选器；`pui-hidden` 只用于明确的即时隐藏，动画组件必须继续保留节点并遵守自身的 0–1000ms 与 `reduceMotion` 合同。完整类名、组合示例和微信基础库边界见 [STYLE_UTILITIES.md](./STYLE_UTILITIES.md)。

## 平台边界

H5 官网是预览镜像，不会执行 WXML、WXSS 或 `Component()`；浏览器中的参数面板用于讨论和验收视觉与交互，最终行为以微信开发者工具和真机为准。具体替代与限制见 [H5_PREVIEW_COMPATIBILITY.md](./H5_PREVIEW_COMPATIBILITY.md) 与 [SHADCN_COMPATIBILITY.md](./SHADCN_COMPATIBILITY.md)。
