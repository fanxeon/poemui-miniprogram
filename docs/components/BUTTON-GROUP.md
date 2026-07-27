# ButtonGroup 组件语义合同

本文是 PoemUI ButtonGroup 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component button-group`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

- ButtonGroup 把一组直接相关、独立执行的 `pui-button` 收敛成一个连续操作组；默认占满可用宽度，让同级操作具有稳定的触达面积。
- 它不是单选、多选或分段选择器，不拥有 `value`、`change`、组级 `click`、loading、error 或 empty 语义；这些需求分别使用 RadioGroup、CheckboxGroup、Tabs 或由业务父级组合。
- 它只管理共同外轮廓、子按钮的连续分隔和组级禁用；每个 Button 的业务动作、平台事件与成功/失败仍由该 Button 的消费者处理。

## 2. 固定结构与区域

```text
ButtonGroup（role=group，唯一组级 Surface）
├── 默认 Slot：直接的 pui-button 子项
└── disabled 时的透明交互遮罩
```

- 根节点始终存在，横向默认 `display:flex + width:100%`；纵向仍是全宽列布局。
- 根负责边框、圆角、连续裁切和阴影；子 Button 去除自身外圆角、外边距和外投影，通过相邻 divider 表达边界。
- 禁用遮罩只在 `disabled=true` 时出现并以 `catchtap/catchtouchstart` 阻断所有 Slot 内触摸，不替代子 Button 的自身 disabled 合同。

## 3. PUI 组合与依赖

- 默认 Slot 必须直接组合 `pui-button`；H5 必须以共享 `buttonSample` 生成每一个同级 Button，并由同一个 `buttonGroupSample` 根包裹它们。
- ButtonGroup 的根是组件自身的基础布局根，可使用 `view` / HTML `div role=group`；不得再用 Card、Cell 或原生 button 作为第二层分组表面。
- Button 的 Icon、Loading、禁用、尺寸、ARIA、主题和平台能力仍由 Button 自己负责，组容器不得重画或穿透覆盖。

## 4. Token、间距与排版

- 根使用 `--pui-radius-medium`，round 使用 `--pui-radius-round`，中性边界使用 `--pui-border-color`；H5 镜像使用同名 preview radius/border Token。
- 默认全宽不通过页面私有 margin 实现。标准预览属于 `shadow-safe`，由 PreviewDevice viewport 内的 28px 共享安全区保护组根的 `--pui-shadow-card` 外投影。
- 组内直接 Button 不设 `gap` 或 margin：这是连续操作的语义，不是按钮堆叠。相邻项只使用 1rpx/1px divider；Button 内部图标与文案间距继续属于 Button 合同。
- 组根是集合根，允许在全局阴影开启时拥有单一外投影；子 Button 及其 divider 不得各自再获得阴影。

## 5. 内容、Slot 与组合边界

- 仅有默认 Slot。业务应将操作文本、Icon、`bind:click`、`data-*` 和单个 Button 的平台 Props 放在直接 `pui-button` 子项上。
- 非 Button 内容可以投影但不会被组容器伪装成可点击 Button，也不会得到 Button 的尺寸或事件；复杂工具栏应改用明确的 Flex/Cell/Toolbar 组合。
- 父级只能排列 ButtonGroup 与其他同级内容，不得以额外的内层 padding、Card 或阴影来弥补组根布局。

## 6. 状态与优先级

- ButtonGroup 不声明 content/loading/error/empty 状态；默认 Slot 始终是内容来源。
- `disabled` 是唯一组级状态，优先于所有子 Button 点击并阻断触摸；恢复 `disabled=false` 后遮罩移除，子 Button 恢复原有可操作性。
- 失败、取消、重试和成功反馈属于各子 Button 所在业务链路，不能用 ButtonGroup 的 Cell 文案或 H5 假成功代替。

## 7. 交互、受控边界与事件

- 没有受控/非受控选值和实例方法。`direction/block/size/shape/bordered/disabled` 是声明式视觉/交互边界，不产生组级事件。
- 非禁用时点击顺序完全遵循命中的 `pui-button`：Button 自身先执行并向消费者触发 `click`；组不合成第二个事件。
- 用户取消、业务失败或重试必须由子 Button 的消费者状态回写；ButtonGroup 不拦截、不重放也不宣告成功。

## 8. 可访问性

- 根必须保留 `role="group"`、`aria-label` 和反映真实禁用状态的 `aria-disabled`。
- 可聚焦与键盘/触摸动作属于每个 PUI Button；透明禁用遮罩在辅助树中为 `aria-hidden`。
- 不得用 `text-cut` 截断关键动作；390px 下子 Button 可压缩但必须保持 Button 的最小高度和可读文字。

## 9. H5 预览与跨端一致性

- H5 镜像真实 WXML：一个 `role=group` 根包裹三个共享 Button 镜像；点击只回写被点子 Button 的运行态，绝不伪造 ButtonGroup `change`。
- 普通预览使用 `shadow-safe`，不是 `edge-to-edge`；组件根必须位于唯一 `data-preview-scroll` 的 PreviewDevice viewport 内，不能用私有 overflow 或 margin 裁切阴影。
- 微信端的透明遮罩负责触摸阻断；H5 使用真实 disabled Buttons，浏览器状态不冒充微信平台能力。

## 10. 响应式、主题与视觉配置

- 390px 下组根仍为可用全宽，子项等分可用空间；不得向页面产生横向溢出。
- light/dark、bordered、shadow、frostedGlass、largeRadius 与渐变只通过 ConfigProvider/全局 Token 改变外观，不能改变全宽、顺序、divider 或禁用遮罩边界。
- 阴影关闭时仍保留 PreviewDevice 的 28px 安全区；阴影开启时只由组根消费外投影。

## 11. 明确禁止

- 禁止把 ButtonGroup 当作带 `value/change` 的选择控件。
- 禁止让 Button 在组内保留自身圆角、外阴影、margin 或彼此 gap。
- 禁止在 H5 用原生 button 或静态假组代替 `buttonSample` 组合。
- 禁止把组根缩成内容宽度、在 preview 外层补私有 padding，或让阴影被 overflow 裁切。
- 禁止用组级事件、Cell 状态文案或假成功覆盖子 Button 的真实业务结果。

## 12. 修改闭环

1. 同步审计 `button-group` 四件套、共享 Button、H5 `buttonGroupSample`、metadata、API、示例与生成器保留规则。
2. 更新本合同、`docs/COMPONENT_API.md`、H5 兼容文档、Feedback Ledger 与 ButtonGroup 专项合同测试。
3. 运行 `node scripts/test-button-group.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run example:install`、`npm run pack:check`；浏览器检查桌面与 390px、深浅色及全部外观开关。
4. 微信真机仍需以合法 AppID 复核 `styleIsolation:shared` 下 Slot Button、遮罩触摸和 rpx divider；不得以 H5 代替该证据。
