# Cell 组件语义合同

本文是 PoemUI Cell 的长期设计与实现合同。任何 Agent 修改 Cell 源码、H5 镜像、示例、元数据、内部消费者或安装产物前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component cell`

完整 Props、Events 与 Slots 以 `docs/COMPONENT_API.md` 为准；本文规定长期语义、组合边界和 TDesign 对照决定。

## 1. 组件定位

- Cell 是统一 Field 行的只读形态，用于列表信息、页面入口和轻量选择；它复用 Field 的行级视觉内核，但不承接可编辑控件、Form relation 或校验反馈。
- 静态内容默认只声明 `title`；只有承担点击或选择职责时才启用 `clickable/selectable`。
- 复杂媒体、徽标、标签和尾部操作通过 Slot 组合 PUI Image/Icon/Badge/Tag/Button，不把子组件全部 Props 再透传一遍。
- Cell 不承担 loading 之外的数据请求状态；empty/error/retry 应由 List、页面或状态组件负责。

## 2. 固定结构

```text
view.pui-cell.pui-field-row--readonly
├── media Slot（可选，并列）
├── Image 或 leftIcon（可选）
├── main
│   ├── title + title Slot
│   ├── description + description Slot
│   ├── note + note Slot
│   └── default Slot
└── right
    ├── value + value Slot
    ├── rightIcon
    ├── right Slot（阻止根 click 冒泡）
    ├── Loading
    ├── selected Icon
    └── arrow
```

- Props 文本与对应具名 Slot 是追加关系，不再需要 `custom*` 显隐开关。
- `image` 固定为 `72rpx`、`aspectFill`、round；需要其他形态时使用 media Slot 直接组合 Image。
- arrow 固定使用 chevron-right；自定义尾标使用 rightIcon 或 right Slot。
- Badge 不再是 Cell 内置透传能力；使用 value/right Slot 组合真实 PUI Badge。

## 3. 内容与原始值

- `title/description/value/note` 保留 `0` 和 `false`，只把 null、undefined 和空白字符串视为空。
- value 是右侧辅助值，note 是正文底部补充信息，两者职责不得互换。
- 长标题、说明、值与 Slot 必须自然换行或收缩，不能以省略号掩盖 390px 布局错误。
- 基础用法固定为 `<pui-cell title="单行标题" />`，不得在基础示例塞入 bind、选择、导航或 Slot。

## 4. 点击、选择与导航

- `disabled/loading` 完全阻断 click、选择和导航；`readonly` 仍回传一次 `blocked=true` 的 click，但不改变状态或导航。
- 受控 selected 只发出 `click → input → change` 请求并等待父级回写；非受控模式在 input 前更新内部状态。
- allowUnselect=false 时点击已选项只触发 click，detail.reason=`allow-unselect`。
- url 不能绕过 clickable/selectable 门禁。jumpType 只支持 navigateTo、redirectTo、reLaunch、switchTab。
- navigate-success/navigate-fail 必须来自真实微信 API 回调；不发 start/complete，不提供 navigateBack/delta，也不伪造 H5 成功。
- Cell 不公开 select/unselect/toggle/reset/navigate/getState 等业务实例方法；父级 Props 是唯一写入入口。

## 5. Slot 与事件边界

- media/title/description/value/note/default Slot 随根 Cell 点击语义正常冒泡。
- right Slot 外层使用 catchtap 只隔离根 click；内部 Button 的事件由消费者真实处理，不再额外派发含义模糊的 right-click。
- image 的 load/error 只增加 `{ source:'image', src }`，不重复业务 name。
- API Events 独立完整陈列；基础示例零 bind，事件专项示例只绑定当前能力需要的事件。

## 6. 视觉与 Token

- Field 与 Cell 共同复用内部 `field-row` 行内核：Cell 标记为只读态、Field 标记为可编辑态。size 只控制三档密度；align 只控制交叉轴；variant 只控制 default/outline/soft 表面。
- 全局阴影、毛玻璃、大圆角、边框与主题继续由 ConfigProvider Token 管理，Cell 不复制视觉总开关。
- Cell 是内容流中的行，不能获得外投影；`selected` 只保留 inset 品牌 outline，`bordered` 只保留 inset 分隔线。若连续 Cell 需要承载在 Surface 内，只允许 List、Indexes 等集合根拥有一次外阴影。
- bordered 只绘制底部分隔线并保持盒模型；selected 的品牌边界不得被全局 bordered=false 清除。
- 动画只过渡颜色、表面、边界、轻位移和尾标，默认 500ms、限制 0–1000ms；reduceMotion 压缩为 1ms。

### CellGroup 布局组件

- `cell/cell-group` 是 Cell 体系内部布局组件，不占用顶层组件目录编号，也不复制 Cell 的交互 API。
- `title` 与 `description` 位于 Cell 列表上方；`title/description/header` Slot 只在对应文本后追加内容。
- `card=true` 时，分组根承担一次圆角卡片 Surface、边界与溢出裁切，组内 Cell 透明、无独立圆角和阴影；`card=false` 时只提供垂直间距。
- `bordered` 只控制 card Surface 的外边界，组内 Cell 的 `bordered` 继续控制行分隔。
- 默认 Slot 应放置一个或多个真实 `pui-cell`，CellGroup 不处理 click、selected、loading、导航或业务回写。

## 7. H5 概览

- 固定分为“基础用法 / 多行与内容 / 状态与选择 / 组合内容”四段，后续标题使用共享 18px section gap。
- 第一项由当前 Props 实时驱动；固定项目只用于能力比较，不覆盖用户调参结果。
- 组合内容必须调用 badgeSample、tagSample、buttonSample；Loading 必须调用 loadingComponent。
- 选择必须真实改变 check Icon/ARIA/Props；right Slot Button 必须真实改变组合状态且不触发根 Cell。
- 图片必须使用浏览器真实 load/error；导航明确平台差异，不显示 fake success。

## 8. TDesign 1.15.3 对照决定

- TDesign 安装包公开 align/arrow/bordered/description/hover/image/jumpType/leftIcon/note/required/rightIcon/title/url 13 项 Props、click 事件，以及 left-icon/image/title/description/note/right-icon 6 个 Slot。
- PoemUI 复用其内容主干、固定圆形缩略图、固定 chevron、四类微信导航和按用法分区演示。
- PoemUI 额外保留 value、size/variant、受控选择、disabled/readonly/loading、ARIA 与低动效，因为这些能力已被 List/Indexes/NavigationMenu 等内部消费者真实使用。
- 删除 name、imageMode/imageSize/imageShape、badge/badgeDot/badgeTheme/badgeVariant、layout、arrowIcon、loadingText、delta、五个 custom Slot 开关，共 17 项冗余 Props；公开合同由 45 项收敛为 28 项。
- 事件由 10 项收敛为 7 项，公开业务实例方法由 6 项收敛为 0；不追求和 TDesign 数量相同，但每个差异都必须有 PoemUI 用户目标。

## 9. 响应式与外观

- 390px 下四段概览、Cell 内容、Slot、API 表格和属性控件均不得造成页面级横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角、渐变背景和低动效切换不得改变 Cell 的内容层级或交互门禁。
- selected、disabled、readonly、loading 必须在三档尺寸和三种表面下保持可读。
- right Slot 的 Button 在圆角/阴影/毛玻璃切换下保持自身 Button 几何，Cell 只管理排列。

## 10. 明确禁止

- 禁止恢复 Badge/Image 子组件的主题、形态、尺寸等透传 Props；复杂内容必须通过 Slot 组合。
- 禁止恢复 customMedia/customTitle/customDescription/customValue/customNote 显隐开关；文本和 Slot 保持追加关系。
- 禁止恢复 right-click、navigate start/complete 或业务实例方法制造第二套写入通道。
- 禁止让 url 绕过 clickable/selectable，或在 H5 伪造微信导航成功。
- 禁止在基础 WXML 中展示 bind、受控状态、导航和完整 Slot 组合。
- 禁止用省略号、固定高度或横向溢出来掩盖长内容问题。

## 11. 修改闭环

1. 同步审计 Cell 四件套、内部消费者、index.js、metadata、H5、API、示例、dist、安装产物和 Ledger。
2. 更新 `scripts/test-cell.js`，至少覆盖 28 Props、原始值、受控/非受控、事件顺序、门禁、导航真实回调、Slot 追加与无公开方法。
3. 回归 NavigationMenu 等使用 Cell 的依赖组件，确认 Badge 改为 Slot 后行为未退化。
4. 浏览器验证全部 Props、四段演示、复制、桌面/390px、深浅色和全部视觉开关。
5. 运行 site/check/pack；微信 CLI 不可用时保留 pending-cli，不把 H5 通过等同安装产物完成。

任何不能满足本文的实现必须记录进 Feedback Ledger，不得静默绕过。
