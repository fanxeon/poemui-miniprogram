# PoemUI Spacing

Spacing 是随 npm 发布的间距 Token 与 WXSS 工具类，不是独立的 `pui-spacing` 组件。真实入口：

## 独立 Surface 等距模式

ConfigProvider/visualConfig 的 `equalSpacing` 默认关闭，并通过 `pui-spacing--equal` 或 `pui-spacing--normal` 继承到组件树。它不是全局重排开关：不得改写 `--pui-space-*`、`--pui-content-gap`、`--pui-section-gap`，也不得污染连续列表行、控件内部微间距、展示叶子或 PreviewDevice 基础设施。

快速样式页的单一当前效果条与其目录属于同一直接任务链，固定使用紧密信息档位 `8rpx` 作为关联间距；它不是 Surface 的 Header/Content/Footer 分区，不能机械改成 `--pui-section-gap`。当前效果条固定 `120rpx` 且透明无 Surface，右侧恢复按钮占用独立网格轨道；utility 只作用于内部语义目标，不能让 margin、padding、gap、screen size 或 safe-area 类改变预览与目录的页面几何。

具备独立 Surface 资格的组件应只消费以下三个语义别名，并在等距模式把直接结构块与分区关系映射到同一 Surface inset：

- `--pui-surface-inset`：该 Surface 的四向内边距；
- `--pui-surface-stack-gap`：直接结构块之间的纵向 gap；
- `--pui-surface-section-gap`：Header/Content/Footer 等主要分区之间的 gap。

Popup 与外观设置列表是 reference implementation；Cell、Field、Empty、Result、Grid、Steps、Avatar、Tag、Badge、Icon、Progress、Skeleton 等非独立 Surface 不获得等距大间距。

```css
@import "poemui-miniprogram/theme/utilities.wxss";
```

`utilities.wxss` 已包含 `theme.wxss`。只需要 Token 时也可以单独引入 `poemui-miniprogram/theme/theme.wxss`。

## 间距阶梯

| 档位 | Token | 小程序值 | H5 镜像值 | 推荐用途 |
| --- | --- | --- | --- | --- |
| `xxs` | `--pui-space-xxs` | `4rpx` | `2px` | 图标与徽标的微间距 |
| `xs` | `--pui-space-xs` | `8rpx` | `4px` | 紧凑内联元素 |
| `sm` | `--pui-space-sm` | `12rpx` | `6px` | 控件内部、Tag 组合 |
| `normal` | `--pui-space-normal` | `20rpx` | `10px` | 默认组件内距和列表节奏 |
| `lg` | `--pui-space-lg` | `28rpx` | `14px` | 卡片、表单分区 |
| `xl` | `--pui-space-xl` | `40rpx` | `20px` | 页面安全边距和主要区块 |
| `xxl` | `--pui-space-xxl` | `56rpx` | `28px` | 大区块之间 |
| `3xl` | `--pui-space-3xl` | `72rpx` | `36px` | 空状态、首屏大节奏 |

H5 官网按 `1px≈2rpx` 展示同一 Token，只用于镜像验证；真实小程序仍以 rpx 和 WXSS 变量为准。

### 组件内部步进

公开页面和业务组合优先使用上表的语义档位。组件内部确实需要位于两个语义档位之间的精细几何时，统一消费 `--pui-space-step-1` 至 `--pui-space-step-36`：每一步为 `2rpx`，H5 镜像中的同名 `--pui-preview-space-step-*` 每一步为 `1px`。例如 `--pui-space-step-3 = 6rpx`、`--pui-space-step-12 = 24rpx`。

步进 Token 是组件实现层原语，不增加同名 utility class。它用于消除组件源码中的临时固定数值，不能代替语义档位成为业务页面的任意值入口。

## 面板内距合同

弹层、卡片、菜单和内容面板统一消费三档语义 Token，而不是在各组件里重复写临时数值：

| Token | 值 | 用途 |
| --- | --- | --- |
| `--pui-panel-padding-compact` | `20rpx` | Popover、小尺寸面板和紧凑分区 |
| `--pui-panel-padding` | `28rpx` | Card、Dialog、Popup、Sheet、菜单正文和常规面板 |
| `--pui-panel-padding-spacious` | `36rpx` |  标题区和强调型内容面板 |
| `--pui-section-gap` | `36rpx` | 同一表面内 Header、Content、Footer 等主要分区 |
| `--pui-content-gap` | `16rpx` | 面板内操作、图标、标题与正文的基础组合间距 |

面板可以把内距分配给 header/body/footer 子区，但不能让可读正文直接贴到表面边缘。消费者通过 slot 提供的内容仍由对应组件的内容区承担安全内距；明确声明为无样式布局原语的容器除外。

## 工具类命名

`normal` 使用无后缀形式：

- `pui-p` / `pui-px` / `pui-py`
- `pui-m` / `pui-mx` / `pui-my`
- `pui-gap`

其他档位增加后缀，例如 `pui-p-sm`、`pui-mt-lg`、`pui-gap-xl`。

### Padding

- 四向：`pui-p-{size}`
- 横向 / 纵向：`pui-px-{size}` / `pui-py-{size}`
- 单边：`pui-pt/pr/pb/pl-{size}`
- 四向、横纵轴和单边都提供显式 `-0` 重置类。

### Margin

- 四向：`pui-m-{size}`
- 横向 / 纵向：`pui-mx-{size}` / `pui-my-{size}`
- 单边：`pui-mt/mr/mb/ml-{size}`
- 四向、横纵轴和单边都提供显式 `-0` 重置类。
- `pui-mx-auto` 用于水平居中；`pui-my-auto` 和四个单边 `-auto` 用于 flex/grid 剩余空间分配。

### Gap

- `pui-gap-0`
- `pui-gap-{size}`
- `pui-gap-x-0` / `pui-gap-x-{size}`
- `pui-gap-y-0` / `pui-gap-y-{size}`

Gap 用于 flex/grid 子项之间的节奏；它不能替代容器自己的 padding。

PoemUI 不提供负间距工具类。不要通过负 margin 抵消父容器内距，也不要把多个局部偏移叠加成无法维护的布局。

## WXML 示例

```xml
<pui-card title="发布节奏">
  <view class="pui-p-lg">
    <view class="pui-flex pui-items-center pui-flex-wrap pui-gap-sm">
      <pui-tag variant="outline">源码</pui-tag>
      <pui-tag variant="outline">预览</pui-tag>
      <pui-tag theme="success" variant="outline">npm</pui-tag>
    </view>
    <view class="pui-flex pui-flex-col pui-gap-xs pui-mt-sm">
      <pui-cell title="站点构建" value="passed" />
      <pui-cell title="微信构建" value="passed" />
    </view>
  </view>
</pui-card>
```

## 布局规则

1. 页面、卡片、列表、表单和弹层必须保留明确 padding，不能让内容贴边。
2. 同一层级优先使用一个 gap 管理兄弟节点，不同时叠加子项 margin。
3. flex/grid 子项需要 `min-width: 0` 才能在 390px 下配合间距正常收缩。
4. xxs/xs 用于微间距，sm/normal 用于组件，lg/xl 用于布局，xxl/3xl 用于大区块；不要为了“更紧凑”随意跨级。
5. 阴影、毛玻璃、大圆角和深浅色不能改写间距 Token。
6. Spacing 没有显隐或切换动画；动画组件只复用 spacing 布局，不用 transition 改变布局真相。
7. Card、Popup、Dialog、Popover、Sheet、ActionSheet、Calendar、DropdownMenu、Combobox、NavigationMenu 必须引用面板语义 Token；`npm run check` 会阻止回退到无统一内距的实现。
8. 全部发布组件、两个组件生成器和官网预览的 `padding`、`margin`、`gap`、`top/right/bottom/left/inset` 与 `border-radius` 必须引用 `--pui-*` Token；动态 Props 生成的用户值除外。
9. 头像堆叠、回应浮层等重叠布局必须使用 Grid、定位或正常文档流表达，不允许通过负 margin 绕过间距合同。
10. 同一表面内 Header、Content、Footer 等主要分区使用 `--pui-section-gap`（`36rpx / 18px`）；面板安全内距与操作区使用 `--pui-panel-padding`（`28rpx / 14px`），不能混淆分区和区内关系。
11. Dialog Footer 的左右、底部和按钮间距共同消费 `--pui-dialog-action-spacing`，默认别名为 `--pui-panel-padding`；Header↔Content、Content↔Footer 使用 `--pui-dialog-section-spacing`，默认别名为 `--pui-section-gap`。
12. Dialog close 属于 Header 右列，通过 Surface padding 自然获得上、右安全内距；按钮尺寸使用 `--pui-dialog-close-size`，默认别名为 `--pui-space-step-36`（`72rpx`，H5 为 `36px`），禁止移到 Header 外绝对定位。
13. Content 直接子元素使用 `--pui-content-gap`（`16rpx / 8px`）；Slot 子组件保留自己的 padding，父组件不能穿透覆盖。
14. H5 `PreviewDevice` 外框 padding 为 0，唯一滚动 viewport 内挂共享父布局。普通组件的 `shadow-safe` 由 `--pui-preview-device-padding:14px` 加 `--pui-preview-shadow-bleed:14px` 得到 `28px` 四向安全区；屏幕附着/浮层组件使用 `edge-to-edge:0`。直接演示根固定消费 `--pui-preview-content-gap:8px` 且不得叠加首项 margin。
15. 透明、无边框、无背景、无阴影的纯分组根允许 `padding:0`；PROP 元信息、字段、兼容项、代码等真正可见的 Surface 必须各自消费 panel/spacious padding，禁止通过外层空壳补偿。
16. 官网页面 gutter 使用独立 `--pui-site-*` Token，不能冒充组件面板内距；断点可以切换站点 gutter，但不得改变 `PreviewDevice` 的 panel/content 节奏。

宽高、图标尺寸、滑块轨迹和动画位移属于组件几何合同，不伪装成 spacing Token；其中表达容器留白或定位内距的部分仍必须消费 PUI 间距原语。

`npm run check` 中的 `test-layout-contracts.js` 会扫描全部 81 个发布组件、生成模板和 `preview/styles.css`；`test-spacing-token-contract.js` 进一步扫描全部源码 WXSS 与官网 spacing 声明，并锁定 PreviewDevice、站点 gutter、透明分组根和可见 PROP Surface 的语义边界。两者共同阻止固定 `rpx/px`、负间距、旧 `--pui-spacing-*` 名称以及未定义步进 Token 回流；`pui-sr-only` 的 `-1rpx` 仅作为无障碍裁切例外。

间距分层参考 [TDesign Design Token](https://tdesign.tencent.com/starter/docs/vue/design-token) 的尺寸 Token 方法；具体 rpx 数值、工具类命名和微信端边界均以 PoemUI 本文档为准。
