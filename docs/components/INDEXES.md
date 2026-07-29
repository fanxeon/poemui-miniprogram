# Indexes 语义合同

本文是 PoemUI Indexes 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component indexes`

## 1. 组件定位

Indexes 用于通讯录、城市、组件目录等长分组集合：正文按分组展示条目，侧栏让用户快速定位当前分组。组件负责分组规整、侧栏选择、滚动联动和条目请求；搜索、筛选、页面标题、统计、路由与数据请求属于消费者。

Indexes 是数据集合组件，因此允许使用 PUI Loading / Empty / Button 组合 loading、error、empty、retry；这些状态必须真实阻断交互，但 retry 只发布请求，不伪造加载成功。

## 2. TDesign 对照基线

- 固定参考 `tdesign-miniprogram@1.15.3` 的 Indexes / IndexesAnchor 文档和安装源码。
- 2026-07-28 已重新联网核验 [TDesign Indexes 官方页](https://tdesign.tencent.com/miniprogram/components/indexes) 与 [官方仓库 Indexes 目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/indexes)，并重新下载固定 `tdesign-miniprogram@1.15.3` 发布包；可复现 API 判断读取 `indexes/props.js`、`indexes/type.d.ts`、`indexes/indexes.js`、`indexes/indexes.wxml`、`indexes/indexes.wxss` 与 `indexes-anchor/props.js`。动态页面只用于产品语义，固定版本源码用于合同结论。
- TDesign Indexes 根公开 `current/defaultCurrent/indexList/showFullIndex/sticky/stickyOffset`，通过 `select/change` 区分侧栏选择和活动锚点变化；Anchor 只公开 `index`。
- TDesign 固定包在 touch 选择时于侧栏内侧显示 `96rpx` 当前索引提示。PoemUI 采用同一反馈语义，但提示必须被限制在自己的有界 body 内，不把侧栏改成页面级 fixed。
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
- `showFullIndex=false` 时侧栏显示 index 文本的首个字符，辅助名称、放大提示和事件仍保留完整原值；`true` 显示完整文本，并按当前最长索引扩大轨道宽度，最大可视轨为 `240rpx`。
- `height` 限制为 240–1200rpx，非法值与默认值都收敛到 `680rpx`；`stickyOffset` 限制为 0–240rpx；侧栏只接受 `left/right`。
- 侧栏可用高度固定为 body 高度减去上下各 `20rpx`。每项高度按索引数量动态计算且不超过 `36rpx`；默认 `680rpx` 必须完整容纳 A–Z，不得增加可见的第二条侧栏滚动条。调用者主动使用极低高度时应通过 `indexList` 提供精简索引，不能依赖侧栏内部再滚动。
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
- 侧栏索引是 Indexes 自身的连续手势交互根，不套通用 PUI Button；每项使用带 `role=button`、可访问名称和 disabled 语义的组件内部命中节点。`42rpx × 36rpx` 是单字符命中宽度与高度上限，不是长轨固定高度；真正的 Retry 操作继续复用 PUI Button。
- 索引文字使用独立 `line-height:1` 文本节点，由每项 Flex 轨双轴居中。选中底板以当前动态项高生成正圆，并与文字共同锚定包装轨的 `50% / 50%`。微信系统字体的可见笔画中心实测仍比圆心向左、向上不足 `1px`，因此文字统一消费组件语义变量 `--pui-indexes-label-optical-x: .5px / y: .25px`；rpx 在当前 390px 模拟器被取整，同值双轴补偿仍会造成纵向过量。该补偿只能作用于文字墨迹，不得移动圆、命中区或单独按 active/glyph 分叉。禁止继承整行 line-height、使用椭圆包装背景或活动态缩放做光学校正。独立页至少提供十二个分组形成可持续滚动范围，不能用六个短分组冒充索引联动验收。
- 轨道、条目和 sticky 标题共同消费同一个动态 `rail-width` 真相源。轨在右侧时标题与条目避让右轨；轨在左侧时两者一起避让左轨；隐藏轨时恢复正常内容宽度。
- 错误态必须在组件根内部保留 `space-xl + space-normal` 的底部安全间距；嵌入式 Empty 使用 `88rpx` 紧凑图形且不得叠加第二层 padding，使 Retry 在 `height=360rpx` 的有界区域内完整可见。不得由独立页增加私有 margin。
- loading 使用 PUI Loading；error/empty 使用嵌入式 PUI Empty；error 的 Action 只发布 retry。
- `items=[]` 且非 loading/error 时展示真实 Empty，不渲染假列表或诊断卡。
- Indexes 根是唯一覆盖整个集合的 Surface；body、直接 entry 与状态层必须透明。放大提示是手势期间临时脱离内容流的独立反馈 Surface，可以消费浮层阴影、毛玻璃与语义圆角。

## 5. 受控与事件规则

- `current !== null/undefined` 为受控；组件发布请求但等待父级回写，不提前改变活动值。
- 退控时承接最后一个有效受控 current；无效则选择第一个可用分组。
- 非受控 `defaultCurrent` 只在首次获得有效数据时读取一次。
- 受控未命中保持无活动项；不得回退索引 0。
- 受控 current 指向 disabled 分组时保持无活动项；不得给不可选分组绘制活动态。
- 程序化定位期间必须抑制滚动经过中间分组产生的伪 change；保护窗口必须覆盖完整 `500ms` 定位动画及 `120ms` 收敛余量，避免末端短尾把用户点选的 `T` 反向覆盖成最后一组 `U`。
- 用户开始触摸正文时可以中断上述程序定位保护并接管滚动。程序滚动首次经过目标组时不得提前结束 620ms 保护。
- 手动滚动发布 `change(source='scroll')` 后，受控页面把同一个 current 回写属于滚动回声；组件必须消费该回声但不得再次设置 `scrollIntoView`，避免抢滚动和吸附。外部主动修改为另一个 current 仍须真实定位。
- 用户手动滚动达到 `scrollTop + viewportHeight >= scrollHeight - 2` 时，必须将最后一个真实分组设为活动项；短尾内容不能因为最后一组无法滚到容器顶端而停留在倒数分组。H5 与原生使用同一边界。
- disabled 阻止侧栏选择、活动 current 变更、条目和 retry，但不能禁止用户物理滚动已有内容做只读浏览；readonly 只阻止 item-click，侧栏定位与滚动联动仍可用。
- 按住索引 `120ms` 后显示当前索引放大提示；一旦拖动立即显示并随命中项更新。右轨提示位于轨道左侧，左轨镜像到右侧；松手、取消、loading/error/disabled 或组件卸载时关闭。提示是 `aria-hidden`、`pointer-events:none` 的纯视觉反馈，不增加 Prop/Event/Slot/Method。
- 同一次触摸结束后 WebView 合成的 click 必须被短时去重，不能让一个手势重复发布 select。
- 非当前状态层不得留在辅助技术操作范围：H5 的隐藏内容/导航/状态层使用 `aria-hidden + inert`，隐藏滚动区 `tabindex=-1`；小程序正文与索引轨同步 `aria-hidden`，隐藏错误层的 Retry Button 同步 disabled。视觉隐藏不能替代交互隐藏。

## 6. H5 演示合同

概览固定四区：

1. 基础用法：默认索引与真实滚动联动。
2. 索引显示：完整索引、左侧位置与显式 indexList。
3. 条目与状态：Badge、禁用条目、loading/error/empty/retry。
4. 受控与边界：数字 0、字符串 `"0"`、readonly/disabled 和低动效。

- 基础 WXML 只包含 `items/current/aria-label`，不得展示任何 `bind:*`。
- 事件专项示例才展示必要 `bind:select/change/item-click/retry`。
- H5 必须复用 Cell/Badge/Button/Loading/Empty helper，不得手写私有状态图形或 raw button。
- H5 的共享 Button 全局规则之后必须保留 Indexes 限定覆盖，确保动态索引入口不重叠且活动字符在 light/dark 均可见。
- H5 拖动期间必须原位更新 active、scrollTop 和放大提示；不能在 pointerdown 首次命中后立即 `renderStage()` 替换持有 pointer capture 的轨道。pointerup/cancel/lostpointercapture 后再统一回写受控 Prop。
- H5 必须同步无侧栏滚动条、默认 A–Z 长轨、动态完整索引宽度、左右标题避让、scroll 回声、disabled 可读滚动、透明 body/state 和页面层 Retry 恢复链。
- 390px 页面不得横向溢出；侧栏、长标题和完整索引必须限制在组件内部。
- API 完整显示 20 Props、4 Events、0 Slots、0 Methods，所有文字自然换行且禁止省略号。

## 7. 明确禁止与禁止回退

- 禁止恢复 `value/defaultValue`、`showIndex/showGroupTitle`、`customHeader/customFooter`、`duration/easing`。
- 禁止恢复 `index-click/scroll-index/input/scroll/click` 重复事件或 `scrollTo/scrollToIndex/reset/measureGroups` 公共方法。
- 禁止把侧栏 select 与条目 item-click 混成同一个 select。
- 禁止用字符箭头、私有 badge、私有 Spinner/Empty 或只更新提示文字模拟交互。
- 禁止把页面搜索、筛选、标题、统计和 Footer 放回组件内部。
- 禁止给侧栏增加 `overflow-y:auto`；可见灰线、被裁活动项和未计入 scrollTop 的触摸坐标都属于同一错误实现。
- 禁止把手动 scroll 的受控回写重新解释为外部定位。

## 8. 真机风险

侧栏定位规则：真实小程序端以 Indexes 自身有界 body 为定位上下文，垂直居中且不覆盖组件外的后续内容；左右位置由 indexPosition 决定。官网 PreviewDevice 同样只能做设备边界内的有界视觉镜像，不得让侧栏跑出预览设备。

Cell 宽度规则：Indexes 内的 Cell 撑满扣除索引轨后的内容列；右侧或左侧索引出现时，条目和标题必须预留动态 `rail-width + --pui-space-normal`，避免 Badge、箭头、标题和操作命中区与字母轨重叠。真机上仍需确认触摸命中和读屏顺序。

H5 无法替代微信真机的长按阈值、touchend 合成 click、连续 touchmove、`scroll-view` 惯性、`scroll-into-view`、SelectorQuery、sticky、rpx 连接、样式隔离、系统低动效与读屏验收；合法 AppID 未完成前保持 `pending-device`。

0.1.2 battle 边界：本轮先完成共享小程序源码、真实独立页、专项测试、合同和 Ledger。H5 当前仍是旧的固定 `21px × 18px` 短轨实现，连续 pointer 拖动还会因首次受控回写重建 DOM 而丢失 capture；H5 同步时也必须把索引项收敛为组件自身语义交互根，以 unit line box 和动态正圆共享中心，不得继续维护通用 Button 包装。统一跨端发布阶段完成前不得声称 Indexes 跨端验收。

## 9. 修改闭环

修改 Indexes 时必须同步检查源码四件套、内部 PUI 依赖、metadata、H5 四区、Props/WXML/API、`_example`、`miniprogram_dist`、安装产物与 Ledger；补充专项合同测试，并完成 `site:build`、`check`、`pack:check`、`example:install` 及可用的微信 `build-npm`。真实问题必须写入结构化记录，真机未完成项继续保留在 `verification.deviceRisks`，不得用 H5 或 metadata done 代替设备验收。

## 2026-07-27 默认滚动预算

Indexes 默认 `height` 为 `680rpx`，独立页消费同一默认值；该高度提供真实长索引浏览空间，不新增页面私有滚动容器。H5 0.1.2 已同步动态长轨、自身语义交互根、长按放大提示和 pointer 拖动释放回写。证据：`indexes/indexes.js`、`miniprogram/pages/components/indexes/index.wxml`、`preview/app.js`、`preview/styles.css`、`PUI-FB-0428`。
