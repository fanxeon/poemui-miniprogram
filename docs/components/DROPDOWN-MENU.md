# DropdownMenu 组件语义合同

本文是 PoemUI DropdownMenu 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component dropdown-menu`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

- DropdownMenu 是页面内并列筛选入口；每个 `items` 元素对应一个单选或多选筛选项。
- 它只处理选值建议、显隐通知与多选确认/重置，不处理请求中、请求失败、业务提交、排序结果或页面滚动。
- 需要网络状态时由页面以 Loading、Empty、Cell 等组件组合；需要独立锚点菜单时使用 Popover，而不是扩充 DropdownMenu。

## 2. 固定结构与区域

```text
透明根（覆盖完整 PreviewDevice / 小程序可见区域）
├─ trigger bar（每个 items 条目一个 PUI Button）
└─ 已挂载 layer
   ├─ 可选完整遮罩（唯一遮罩关闭根）
   └─ menu panel
      ├─ options（PUI Button + PUI Icon）或 PUI Empty
      ├─ 默认 Slot
      └─ footer Slot + 多选的重置 / 确定
```

- trigger bar 不是第二张卡片；panel 是唯一浮起 Surface，遮罩覆盖完整可见区域。
- 默认 Slot 位于选项之后；footer Slot 在内置多选动作之前，用于消费者自身业务入口。
- 单选选择后关闭；多选保持展开，只有确定会关闭。

## 3. PUI 组合与依赖

- 触发器、选项、重置、确定与 footer 示例必须复用 PUI Button；箭头与选中标记复用 PUI Icon；没有选项时复用 PUI Empty。
- 默认 Slot 与 footer Slot 可以组合 Cell、Button、Form 等现有 PUI 组件，组件不得解释其业务结果。
- 遮罩 `view` 是小程序组件自身允许的底层交互根；H5 仅可使用带名称的原生 button 作为浏览器遮罩桥接。
- 禁止重新引入 Badge、Loading、Error、Retry、Header、第二套 trigger、私有选择控件或伪业务成功反馈。

## 4. 数据、受控边界与事件顺序

- `items` 条目固定使用 `key`、`label`、`options`、`disabled`、`multiple`；option 只使用 `label`、`value`、`disabled`。未知展示字段不构成组件 API。
- `value` 显式传入时受控，DropdownMenu 绝不自行写回；`defaultValue` 只初始化非受控状态。`0`、`false`、空字符串与多选数组必须原样比较和回传。
- 再次点击当前已展开的 trigger 为 `close(source: trigger)`；单选为 `change → close`；多选为 `change`；重置为 `change → reset`；确定为 `confirm → close`。禁用 item 或 option 静默阻断。
- DropdownMenu 不公开 `visible/defaultVisible`，打开与关闭由触发器和遮罩行为产生；页面需要外部控制时应以自身状态决定是否渲染组件，而不是恢复实例方法。

## 5. 动效、Token 与布局

- 只过渡 opacity 与 transform，固定 500ms；`reduceMotion` 和系统低动效均压缩为 1ms。禁止过渡 `height:auto` 或使用 `display:none` 制造瞬移。
- 小程序和 H5 统一消费 PUI color、space、radius、border、shadow 与字体 Token；面板最多占可见高度，选项区独立滚动。
- H5 PreviewDevice 的布局根透明，不能再用 canvas/card 包裹面板；border、shadow、frosted glass、large radius、light/dark 与 gradient 只改变真实 Surface 外观，不改变事件或几何责任。
- 已挂载的 layer 在打开、遮罩关闭、确定和 Footer 操作时只更新 active/ARIA；禁止在 entering/leaving 阶段以 `renderStage()` 替换 panel。多选的选值/重置可更新静态选项内容，但不能打断正在离开的节点。

## 6. 可访问性与响应式

- trigger bar 使用 menubar 语义，面板使用 menu，单选项使用 menuitemradio，多选项使用 menuitemcheckbox；辅助名称优先使用 `ariaLabel`。
- H5 的完整遮罩在 active 时与 panel 同时接收真实鼠标、触摸和键盘动作；隐藏/退出态的 layer、遮罩与选项必须全部不可点，不能只让键盘路径可关闭。
- 390px 下触发器、选项、Slot 和 footer 允许自然换行，禁止页面级横向滚动与关键信息省略。

## 7. TDesign 对照取舍

- 对照 TDesign MiniProgram 1.15.3：父级提供 `closeOnClickOverlay`、`showOverlay`、`zIndex` 和固定 500ms 动效，子级提供 value/defaultValue、multiple、options、confirm/reset。
- PoemUI 以一个 `items` 数组保留上述父/子语义，并固定 500ms 以符合全库动效 Token；不引入为容器拆分而存在的第二个公共 `dropdown-item` 包。
- 不照搬 TDesign 的 `style/custom-style`、自定义 arrow-icon、options-columns 与过时 options-layout，避免跨端私有样式入口和过度 API。

## 8. 明确禁止

- 禁止恢复 columns、title、placeholder、visible、placement、宽高/偏移/滚动、loading/error/retry、readonly、根 disabled、custom Trigger/Header、时长/easing 或实例方法。
- 禁止用静态文案模拟 change、confirm、reset、close；H5 必须实际选中、回写、关闭并保留真实动效中间帧。
- 禁止让 H5 提供小程序没有的请求成功、自动重试、浮层外遮罩或浏览器专属业务能力。

## 9. 修改闭环

1. 同步审计 `dropdown-menu/` 四件套、`metadata/components.js`、`preview/app.js`、`preview/styles.css`、`_example`、`docs/COMPONENT_API.md`、`docs/H5_PREVIEW_COMPATIBILITY.md` 与安装产物。
2. 运行 `node scripts/test-dropdown-menu.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`。
3. 实测单选/多选、受控/非受控、`0/false/''`、禁用、空选项、事件顺序、遮罩策略、180ms/1ms、390px、主题与六项外观；同步 Ledger，并保留合法 AppID 真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。

## 13. 等距与阴影资格

DropdownMenu 展开面板是独立 Surface；`equalSpacing` 只调整 Panel、Options Body 与 Footer 的分区，Trigger、选项行和原生桥接不被全局 gap 覆盖。阴影只属于展开 Panel。
