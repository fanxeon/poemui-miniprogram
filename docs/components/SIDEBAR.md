# Sidebar 语义合同

本文是 PoemUI Sidebar 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component sidebar`

## 1. 组件定位

Sidebar 用于设置、工作台和分类目录中的垂直同层导航。组件负责规整平铺/分组条目、呈现选中态并发布值变化请求；页面标题、品牌 Header、Footer 操作、内容面板、路由和数据请求属于消费者。

Sidebar 是数据集合组件，因此允许使用 PUI Loading / Empty 组合 loading、error、empty、retry；这些状态必须真实阻断交互，但 retry 只发布请求，不伪造加载成功。

## 2. TDesign 对照基线

- 在线参考：<https://tdesign.tencent.com/miniprogram/components/side-bar> 与 <https://github.com/Tencent/tdesign-miniprogram>，2026-07-20 重新核验；官网动态页面用于产品信息，固定包源码用于可复现 API 证据。
- 固定参考 `tdesign-miniprogram@1.15.3` 的 SideBar / SideBarItem 文档与安装源码：`miniprogram_dist/side-bar/{props.js,type.d.ts,side-bar.js,side-bar.wxml}` 和 `miniprogram_dist/side-bar-item/{props.js,type.d.ts,side-bar-item.js,side-bar-item.wxml}`。
- TDesign SideBar 根只公开 `value/defaultValue` 与 `change`；SideBarItem 公开 `badgeProps/disabled/icon/label/value`。
- PoemUI 保留已有 `items` 数据驱动模式、平铺/分组数据、内部 Button/Badge/Icon 组合及集合状态，不新增必须手写 SideBarItem 子组件的第二套入口。
- PoemUI 保留嵌入式尺寸、分组标题、描述、card 外观与只读语义；拒绝页面 Header/Footer、重复选择事件、滚动事件、实例定位方法与外部动效参数。

## 3. 公共合同

### 3.1 Props

最终只公开：

`items / value / defaultValue / theme / bordered / width / height / showGroupTitle / sticky / stickyOffset / showIcon / showDescription / showBadge / clickable / readonly / disabled / loading / loadingText / error / errorText / retryText / emptyText / ariaLabel / reduceMotion`

- `items` 接受平铺条目或 `{ title/label, children/items, disabled }` 分组。
- 条目主合同对齐 SideBarItem：`label/title/text`、`value`、`icon`、`badgeProps`、`disabled`；PoemUI 扩展 `description/activeIcon/loading`，并兼容已有 `badge/badgeDot/badgeMax` 数据。
- 条目 `value` 只接受 String/Number；数字 `0`、字符串 `"0"` 与空字符串严格区分。Boolean、对象和重复值不是有效条目，规整时跳过；缺省 value 由有效条目的顺序生成字符串值。
- `value !== null/undefined` 为受控；`defaultValue` 只初始化非受控状态一次。无效受控值保持未命中，非受控无效初值回退首个可用条目。
- `theme` 只接受 `default/card`；`width` 限制为 160–480rpx，默认 `360rpx`，以保证同时启用图标、描述和徽标时仍有可读的文字空间；`height` 限制为 240–1200rpx，`stickyOffset` 限制为 0–240rpx。
- `clickable=false`、`readonly=true`、`disabled=true` 以及分组/条目 disabled/loading 都必须阻断 change；组件自身滚动仍保留，disabled 同时阻断 retry。
- 状态优先级固定 `error > loading > content > empty`。
- 动效固定 500ms standard；`reduceMotion` 和系统低动效压缩为 1ms。不得恢复 `duration/easing`。

### 3.2 Events

- `change`：选择不同可用条目时发布一次，detail 为 `{ value, previousValue, label, item, index, itemIndex, group, groupIndex, source, controlled }`；受控模式等待父级回写。重复当前项、无效项及所有阻断态静默。
- `retry`：错误态点击 PUI Empty Action 时发布 `{ source:'button' }`；组件不自动切换 loading 或写入数据。

### 3.3 Slots 与 Methods

- 0 Slots。品牌、标题和辅助操作在 Sidebar 外组合，避免组件承担页面框架。
- 0 Methods。选值与定位由 `value` 或用户选择完成；禁止恢复 `select/selectIndex/scrollTo/scrollToIndex/reset`。

## 4. 结构与组合

- 根只包含固定高度 body；不得恢复 Header/Footer Surface 或右侧内容面板。
- 导航内容使用真实 `scroll-view`；条目必须组合 PUI Button，徽标与图标分别组合 PUI Badge / Icon，单项 loading 由 Button 内部 Loading 承接。
- loading 使用 PUI Loading；error/empty 使用嵌入式 PUI Empty；error 的 Action 只发布 retry。
- `items=[]` 且非 loading/error 时展示真实 Empty，不渲染假导航或诊断卡。
- 分组标题只承担导航分组，sticky 不能逃出 Sidebar 的局部滚动容器。

## 5. 受控与事件规则

- 受控点击只发布 change，父级回写前不提前更新 active；非受控点击发布 change 后同步内部值。
- 退控时承接最后一个有效受控值；无效则选择首个可用条目。
- 非受控 `defaultValue` 只在首次获得有效数据时读取一次，迟到数据不得反复重置用户选择。
- 无效受控值保持未命中，不得擅自选中首项。
- `source` 只使用 `tap/keyboard`；H5 键盘 Enter/Space 与小程序点按遵守同一 change 合同。

## 6. H5 演示合同

概览固定为一个全高双栏工作区：左侧是 Sidebar 本体，右侧是消费者内容。选择左侧项目时，右侧标题、说明和 PUI Cell 内容必须随当前 `value` 真实切换；它用于证明 `change → 父级 value 回写 → 消费者内容更新`，不是 Sidebar 新增的 Slot、右侧内容 API 或业务面板职责。

分组、徽标、default/card、bordered、loading/error/empty/retry、受控/非受控、数字 `0`、字符串 `"0"`、空字符串、非法 false、readonly/disabled 与低动效继续由属性页和专项合同覆盖，不再在概览纵向堆叠为不可读的窄列。

独立小程序页的第二个代表场景固定展示“只读分类”：当前分类与内容仍清楚可见，但不响应切换。不得再用“恢复入口”“分类暂时无法读取”等工程状态作为页面主要示例；error/retry 能力留在 API、属性和专项合同中验证。

- 基础 WXML 只包含 `items/value/aria-label`，不得展示任何 `bind:*`。
- 事件专项示例才展示必要 `bind:change/retry`。
- H5 必须复用 Button/Badge/Icon/Loading/Empty helper，不得手写私有状态图形或 raw button。
- 390px 页面不得横向溢出；官网基础示例以 `360rpx × 1200rpx` 的 Sidebar 与右侧消费者内容组成完整工作区。长标签、描述、徽标和分组标题必须限制在组件内部。
- API 完整显示 24 Props、2 Events、0 Slots、0 Methods，所有文字自然换行且禁止省略号。

## 7. 明确禁止与禁止回退

- 禁止恢复 `customHeader/customFooter/duration/easing`。
- 禁止恢复 `click/select/input/scroll` 重复事件或五个实例方法。
- 禁止接受 Boolean/Object value 或用字符串化对象伪造稳定身份。
- 禁止用字符图标、私有 Badge、私有 Spinner/Empty 或只更新提示文字模拟交互。
- 禁止把页面 Header、Footer、事件诊断 Cell 或右侧内容面板放回组件概览。

## 8. 真机风险

H5 无法替代微信真机的 `scroll-view` 惯性、`scroll-into-view`、sticky、rpx、样式隔离、Button relation、系统低动效与读屏验收；合法 AppID 未完成前保持 `pending-cli`。

## 9. 修改闭环

修改 Sidebar 时必须同步检查源码四件套、内部 PUI 依赖、metadata、H5 四区、Props/WXML/API、`_example`、`miniprogram_dist`、安装产物与 Ledger；补充专项合同测试，并完成 `site:build`、`check`、`pack:check`、`example:install` 及可用的微信 `build-npm`。真实问题必须写入结构化记录，真机未完成项继续保留在 `verification.deviceRisks`，不得用 H5 或 metadata done 代替设备验收。

## 2026-07-27 选中图标规则

有左侧图标的选中项以 PUI `check` 替换该图标；右侧不再追加第二个 Check。此规则同时适用于小程序 WXML 和 H5 镜像，见 `sidebar/sidebar.wxml`、`preview/app.js`、`PUI-FB-0429`。
