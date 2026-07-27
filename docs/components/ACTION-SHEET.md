# ActionSheet 组件语义合同

本文是 PoemUI ActionSheet 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或 Token 前，必须完整阅读本文，并查询：

`npm run feedback:list -- --component action-sheet`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 参考证据

- 2026-07-20 已联网核对 [TDesign ActionSheet 官方文档](https://tdesign.tencent.com/miniprogram/components/action-sheet) 与 [官方源码目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/action-sheet)。
- 可复现的固定版本为 `tdesign-miniprogram@1.15.3`：`miniprogram_dist/action-sheet/{props.js,type.d.ts,action-sheet.js,action-sheet.wxml}`。
- TDesign 的 `popupProps`、`style` 与 `custom-style` 是浮层/平台样式逃生口；PoemUI 不公开这些绕过语义 Token 的同义入口，使用既有全局视觉配置和父级组合承担样式与层级。

## 1. 组件定位

- ActionSheet 是“当前情境的一组动作”的底部面板，不是通用业务容器、状态页或表单弹窗。
- 它只负责平铺动作、列表/宫格、宫格分页、显隐请求、取消关闭、选择和遮罩关闭。
- 业务加载、空数据解释、错误重试、提交、删除、分享和成功反馈必须由父级或默认 Slot 的消费者处理。

## 2. 固定结构与区域

```text
全屏浮层（仅显隐退场期间挂载）
├── 可选完整遮罩
└── 底部 Surface
    ├── 可选 description
    ├── list 动作列表 或 grid swiper 分页
    ├── default Slot（内置动作后）
    └── 可选取消入口
```

- 遮罩和面板覆盖组件所在的完整视口；不得用局部色块模拟遮罩。
- 全屏 Layer 只承担层级、指针边界和退场保留，不得声明 opacity 或视觉 transition。Mask 自己淡入，底部 Surface 自己执行 opacity/translateY；两者必须在 Layer 挂载后的同一进入帧启动，不能让共同父层的透明度造成遮罩先出现、面板后出现或 Blur 延迟合成。
- 默认 Slot 位于内置动作列表后，不提供 header、cancel 或额外命名 Slot。
- 面板只在进退场期间保留节点；动画只作用于 opacity/transform，不动画 `height:auto`，不使用 `display:none` 制造瞬移。

## 3. PUI 组合与依赖

- 动作命中区、取消入口和 swiper 是 ActionSheet 自身的底层交互根，可使用原生 `view` / `swiper`。
- 动作的 icon 与 suffixIcon 必须组合 PUI Icon；不得恢复临时字符图标。
- H5 的打开入口、动作项、取消与宫格翻页必须调用共享 `buttonSample` / `iconButtonSample`；遮罩按钮是组件自身浏览器交互根的唯一例外。
- 默认 Slot 由消费者组合 PUI Cell、Button、Tag、Form 等，不得让 ActionSheet 复制业务状态组件。

## 4. Token、间距与排版

- Surface、边界、阴影、毛玻璃和圆角使用全局 PUI Token；遮罩默认继承 ConfigProvider 的毛玻璃状态。`blurOverlay=true` 只为当前 ActionSheet 打开遮罩毛玻璃，`false` 强制保持纯半透明，未传则继承全局；边框开关只透明化中性边界，不改变盒模型。
- description 使用 `--pui-font-size-body-medium` 与 `--pui-line-height-body-medium`；动作文本自然换行，不能用截断掩盖内容。
- list 与 grid 消费 `--pui-panel-padding`、`--pui-space-*` 和对应语义圆角；取消按钮使用常规字重，不得强于动作主文案；底部安全区仅由底部 footer 使用 `env(safe-area-inset-bottom)`。
- 固定动效为 500ms，`reduceMotion` 与系统低动效为 1ms。Layer 不参与视觉透明度；Mask 与 Surface 分别消费同一个时长和 easing。
- WXSS 低动效只消费本组件继承的时长 Token；不得用 `*` 穿透默认 Slot 或 PUI 子组件。

## 5. 内容、Slot 与组合边界

- `items` 是平铺数组；元素为字符串、数字、布尔值或 `ActionSheetItem`，后者只含 `label`、`description`、`color`、`disabled`、`icon`、`suffixIcon`。默认动作只展示主文案和可选图标；`description` 仅在调用方显式提供时出现，不传不占第二行或额外间距。
- 运行时不丢弃 `0`、`false` 这类原始数组元素或对象附加字段；`selected.selected` 返回原始元素。
- 空 items 不自动渲染 Empty；父级可以通过默认 Slot 给出业务上下文，或直接不展示额外内容。
- 不支持分组数组、title、handle、customContent、customCancel、item loading/theme/close 等旧扩展字段。

## 6. 状态与优先级

- 唯一组件状态是受控或非受控的 `visible`；`defaultVisible` 只参与首次非受控初始化。
- 单项 `disabled=true` 只禁止该项的 selected/close 请求，不影响其余动作、取消或遮罩。
- ActionSheet 没有根级 disabled、readonly、loading、empty、error、retry、滚动、zIndex、安全区或时长/easing Props，因此也不存在这些状态优先级。

## 7. 交互、受控边界与事件

- 打开、遮罩关闭和动作选择统一通过 `visible-change({ visible })` 请求显隐；受控模式必须由父级回写，非受控模式先更新内部状态再发布事件。
- 动作选择顺序固定为 `selected({ selected, index }) → close({ trigger: 'select' }) → visible-change({ visible: false })`。
- 遮罩关闭顺序固定为 `close({ trigger: 'overlay' }) → visible-change({ visible: false })`。
- 取消固定按 `cancel() → close({ trigger: 'cancel' }) → visible-change({ visible: false })` 请求关闭；受控模式仍由父级根据 `visible-change` 回写显隐，取消本身不伪造业务结果。
- 不公开 `open/close/toggle/retry` 实例方法，且不恢复 `input/change/open/after-*`、item-click、overlay-click、scroll 等重复或业务化事件。

## 8. 可访问性

- 浮层根使用 `role=dialog`，`aria-label` 优先读取 ariaLabel，再回退 description。
- 遮罩显示时为模态；动作与取消都有可访问名称，disabled 条目设定 `aria-disabled=true` 并停止命中。
- 退场期间面板 `aria-hidden=true` 且不可交互；低动效不改变事件顺序或父级回写责任。

## 9. H5 预览与跨端一致性

- H5 使用 `edge-to-edge` PreviewDevice 父布局；透明 canvas 不能形成第二层手机或卡片 Surface。
- H5 以完整设备遮罩、底部 absolute Surface 和 opacity/translateY 镜像小程序 fixed 浮层；默认入口是真实 PUI Button。H5 不建立统一淡入父层，Mask 与 Surface 和小程序一样在稳定节点上同帧进入。
- 已挂载 canvas 的打开、关闭、遮罩、取消、选择和阶段计时只更新 class/ARIA；禁止落入 `renderStage()` 重建 Overlay/Surface，只有初次挂载或完整退场后才能重绘。
- 网页端以 PUI IconButton 切换宫格页，小程序端使用原生 swiper；二者都以 count 分页且不篡改 items。
- 微信自定义导航栏、安全区、swiper 手势、WXML slot 投影与对象 icon 适配仍需合法 AppID 真机复核。

## 10. 响应式、主题与视觉配置

- 390px 下 list 文案可换行，grid 四列和分页工具不应导致页面级横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变只经全局 Token 影响 ActionSheet Surface；不得改变遮罩范围、分页、动作顺序或显隐行为。
- `usingCustomNavbar` 仅传递小程序浮层环境信息；网页端没有伪造的视觉效果。

## 11. 明确禁止

- 不恢复标题、handle、分组、三段 Slot、命令式方法、根级 loading/error/empty/retry 或伪造业务成功。
- 不恢复 closeOnSelect、closeOnCancel、closeOnOverlayClick、duration/easing、zIndex、maxHeight、safeArea 等策略扩展 Props；取消关闭是固定的 PoemUI 默认交互，不由额外 Prop 改写。
- 不把 H5 动作项写成裸原生按钮，不创建页面局部遮罩，不用提示文字代替真实 selected/close/visible-change 回写。

## 12. 修改闭环

1. 同步审计 `action-sheet/*`、`preview/app.js`、`preview/styles.css`、metadata、`_example`、API/兼容说明、dist 与 npm 示例安装产物。
2. 运行 `scripts/test-action-sheet.js`、ContextMenu 回归、浮层/概览/原生控件边界测试、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`。
3. 浏览器验证 list/grid、count 分页、禁用项、`0/false`、受控/非受控、取消、遮罩、事件顺序、180ms/1ms、390px 与六项外观；记录 Ledger，并保留微信真机风险。

## 13. 等距与阴影资格

ActionSheet 的描述、列表 Body 和 Footer 是直接 Surface 分区；`equalSpacing` 只消费 Surface inset/section Token，列表行、图标、取消按钮内部间距保持原合同。外投影只作用于底部 Surface 根并固定使用 `--pui-shadow-edge-bottom`，不作用于 Mask 或行项目。
