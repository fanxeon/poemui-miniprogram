# Indexes 语义合同

本文是 PoemUI Indexes 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component indexes`

## 1. 组件定位

Indexes 用于通讯录、城市、组件目录等长分组集合：正文按分组展示条目，侧栏让用户快速定位当前分组。组件负责分组规整、侧栏选择、滚动联动和条目请求；搜索、筛选、页面标题、统计、路由与数据请求属于消费者。

Indexes 是数据集合组件，因此允许使用 PUI Loading / Empty / Button 组合 loading、error、empty、retry；这些状态必须真实阻断交互，但 retry 只发布请求，不伪造加载成功。

## 2. TDesign 对照基线

- 固定参考 `tdesign-miniprogram@1.15.3` 的 Indexes / IndexesAnchor 文档和安装源码。
- 2026-07-23 已重新联网核验 [TDesign Indexes 官方页](https://tdesign.tencent.com/miniprogram/components/indexes) 与 [官方仓库 Indexes 目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/indexes)；可复现 API 判断继续读取固定包的 `indexes/props.js`、`indexes/type.d.ts`、`indexes/index.js`、`indexes/index.wxml`、`indexes/index.wxss` 与 `indexes-anchor/props.js`。动态页面只用于用法语义，固定版本源码用于合同结论。
- TDesign Indexes 根公开 `current/defaultCurrent/indexList/showFullIndex/sticky/stickyOffset`，通过 `select/change` 区分侧栏选择和活动锚点变化；Anchor 只公开 `index`。
- PoemUI 保留已有 `items` 数据驱动模式与内部 Cell/Badge 组合，不新增必须手写 Anchor 子组件的第二套入口。
- PoemUI 保留嵌入式固定高度、左右侧栏、条目点击及集合状态；拒绝外部样式类、页面级 `wx.pageScrollTo` 和独立 Anchor relation。

## 3. 公共合同

### 3.1 Props

最终只公开：

`items / current / defaultCurrent / indexList / showFullIndex / height / sticky / stickyOffset / indexPosition / clickable / readonly / disabled / loading / loadingText / error / errorText / retryText / emptyText / ariaLabel / reduceMotion`

- `items` 分组字段：`index` 必填且仅支持 String/Number；`title`、`children/items`、`disabled` 可选。
- 条目字段：`label/title/text`、原始 `value`、`valueText`、`description`、`note`、`icon/leftIcon`、`rightIcon`、`image`、`badge/badgeDot/badgeMax`、`arrow`、`clickable`、`disabled`。
- `current/defaultCurrent/indexList` 对分组 index 使用严格身份比较；数字 `0` 与字符串 `"0"` 不碰撞。Boolean、对象、空字符串和空白字符串不是合法分组 index。
- `indexList=null` 时从有效分组派生侧栏；传数组时按严格身份筛选、排序侧栏，空数组明确隐藏侧栏。
- `showFullIndex=false` 时侧栏显示 index 文本的首个字符，辅助名称和事件仍保留完整原值；`true` 显示完整文本。
- `height` 限制为 240–1200rpx；`stickyOffset` 限制为 0–240rpx；侧栏只接受 `left/right`。
- 状态优先级固定 `error > loading > content > empty`。
- 动效固定 500ms standard；`reduceMotion` 和系统低动效压缩为 1ms。不得恢复 `duration/easing`。

### 3.2 Events

- `select`：用户点击或触摸滑过侧栏索引时发布；detail 为 `{ current, previousCurrent, index, group, groupIndex, source, controlled }`。重复当前项仍发布 select，便于重新定位，但不重复 change。
- `change`：活动分组真实改变时发布；detail 同上。侧栏操作固定 `select → change`；用户滚动只发布 `change(source='scroll')`。
- `item-click`：点击可用 Cell 条目时发布 `{ value, valueText, item, itemIndex, group, groupIndex, current, source }`；不重复发布 click/select。
- `retry`：错误态点击重试 Button 时发布 `{ source:'button' }`；组件不自动写入 loading 或数据。

### 3.3 Slots 与 Methods

- 0 Slots。Header、搜索、统计和 Footer 都在 Indexes 外由页面组合，避免组件承担页面框架。
- 0 Methods。定位由受控 `current` 或用户侧栏操作完成；禁止恢复 `scrollTo/scrollToIndex/reset/measureGroups` 公共方法。

## 4. 结构与组合

- 根只包含固定高度 body；不得恢复 Header/Footer Surface。
- 正文使用真实 `scroll-view`，每个条目组合 PUI Cell；徽标使用 PUI Badge，图标由 Cell 内部 PUI Icon 承接。
- Indexes 根是唯一集合 Surface：根承接边框、阴影、毛玻璃与语义圆角；直接 Cell 条目在小程序与 H5 都必须保持透明、无外层边框/圆角/阴影/毛玻璃，连续条目以 Cell 分割线连接，不能被全局视觉规则拉成带 gap 的悬浮卡片。`shadow-safe` 只保护根的阴影，不改变集合内部几何。
- 侧栏索引使用 PUI Button；组件通过内联组合约束将每个索引入口紧凑为 `42rpx × 36rpx`，H5 对应 `21px × 18px`。包装轨道和 Button 的几何必须完全重合，当前项文字必须继承包装轨道的反色，禁止全局 Button 尺寸或变体规则造成点击热区重叠、当前文字与底色同色。
- 小程序端不能只依赖跨组件 class 级联覆盖 Button tone；索引 Button 根必须显式 `color:inherit`，文字使用 Button `content` 轨并以 `--pui-space-sm` 做紧凑轨光学校正，确保活动包装轨的 inverse 文本在 light/dark 都真实居中。独立页至少提供十二个分组形成可持续滚动范围，不能用六个短分组冒充索引联动验收。
- loading 使用 PUI Loading；error/empty 使用嵌入式 PUI Empty；error 的 Action 只发布 retry。
- `items=[]` 且非 loading/error 时展示真实 Empty，不渲染假列表或诊断卡。

## 5. 受控与事件规则

- `current !== null/undefined` 为受控；组件发布请求但等待父级回写，不提前改变活动值。
- 退控时承接最后一个有效受控 current；无效则选择第一个可用分组。
- 非受控 `defaultCurrent` 只在首次获得有效数据时读取一次。
- 受控未命中保持无活动项；不得回退索引 0。
- 程序化定位期间必须抑制滚动经过中间分组产生的伪 change；保护窗口必须覆盖完整 `500ms` 定位动画及 `120ms` 收敛余量，避免末端短尾把用户点选的 `T` 反向覆盖成最后一组 `U`。
- 用户手动滚动达到 `scrollTop + viewportHeight >= scrollHeight - 2` 时，必须将最后一个真实分组设为活动项；短尾内容不能因为最后一组无法滚到容器顶端而停留在倒数分组。H5 与原生使用同一边界。
- disabled 阻止侧栏、滚动变更、条目和 retry；readonly 只阻止 item-click，侧栏定位与滚动联动仍可用。
- 非当前状态层不得留在键盘焦点序列中：H5 的隐藏内容/导航/状态层使用 `aria-hidden + inert`，隐藏滚动区 `tabindex=-1`；小程序隐藏错误层的 Retry Button 必须同步 disabled。视觉隐藏不能替代交互隐藏。

## 6. H5 演示合同

概览固定四区：

1. 基础用法：默认索引与真实滚动联动。
2. 索引显示：完整索引、左侧位置与显式 indexList。
3. 条目与状态：Badge、禁用条目、loading/error/empty/retry。
4. 受控与边界：数字 0、字符串 `"0"`、readonly/disabled 和低动效。

- 基础 WXML 只包含 `items/current/aria-label`，不得展示任何 `bind:*`。
- 事件专项示例才展示必要 `bind:select/change/item-click/retry`。
- H5 必须复用 Cell/Badge/Button/Loading/Empty helper，不得手写私有状态图形或 raw button。
- H5 的共享 Button 全局规则之后必须保留 Indexes 限定覆盖，确保 `21px × 18px` 索引入口不重叠且活动字符在 light/dark 均可见。
- 390px 页面不得横向溢出；侧栏、长标题和完整索引必须限制在组件内部。
- API 完整显示 20 Props、4 Events、0 Slots、0 Methods，所有文字自然换行且禁止省略号。

## 7. 明确禁止与禁止回退

- 禁止恢复 `value/defaultValue`、`showIndex/showGroupTitle`、`customHeader/customFooter`、`duration/easing`。
- 禁止恢复 `index-click/scroll-index/input/scroll/click` 重复事件或 `scrollTo/scrollToIndex/reset/measureGroups` 公共方法。
- 禁止把侧栏 select 与条目 item-click 混成同一个 select。
- 禁止用字符箭头、私有 badge、私有 Spinner/Empty 或只更新提示文字模拟交互。
- 禁止把页面搜索、筛选、标题、统计和 Footer 放回组件内部。

## 8. 真机风险

侧栏定位规则：真实小程序端以 Indexes 自身有界 body 为定位上下文，垂直居中且不覆盖组件外的后续内容；左右位置由 indexPosition 决定。官网 PreviewDevice 同样只能做设备边界内的有界视觉镜像，不得让侧栏跑出预览设备。

Cell 宽度规则：Indexes 内的 Cell 撑满扣除索引轨后的内容列；右侧或左侧索引出现时，滚动内容必须预留 `56rpx + --pui-space-normal`，避免 Badge、箭头和操作命中区与字母轨重叠。真机上仍需确认触摸命中和读屏顺序。

H5 无法替代微信真机的 `scroll-view` 惯性、`scroll-into-view`、SelectorQuery、touchmove 命中、sticky、rpx 连接、样式隔离、系统低动效与读屏验收；合法 AppID 未完成前保持 `pending-cli`。

## 9. 修改闭环

修改 Indexes 时必须同步检查源码四件套、内部 PUI 依赖、metadata、H5 四区、Props/WXML/API、`_example`、`miniprogram_dist`、安装产物与 Ledger；补充专项合同测试，并完成 `site:build`、`check`、`pack:check`、`example:install` 及可用的微信 `build-npm`。真实问题必须写入结构化记录，真机未完成项继续保留在 `verification.deviceRisks`，不得用 H5 或 metadata done 代替设备验收。

## 2026-07-27 默认滚动预算

Indexes 默认 `height` 为 `680rpx`，独立页与 H5 均消费同一默认值；该高度提供真实长索引浏览空间，不新增页面私有滚动容器。证据：`indexes/indexes.js`、`miniprogram/pages/components/indexes/index.wxml`、`preview/app.js`、`PUI-FB-0428`。
