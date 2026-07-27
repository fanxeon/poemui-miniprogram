# 等距布局外观开关：组件级 Goal 规格

状态：**组件级实现已落地并通过源码、H5 几何、契约、构建与打包门禁；微信开发者工具/真机组合验收仍待用户设备确认。**

关联计划：[组件级阴影开关治理计划](./SHADOW_SWITCH_COMPONENT_PLAN.md)。本规格只定义新增的“间距相等”能力；它不改变阴影资格规则，也不把现有基础间距 Token 改成单一数值。

## 1. 用户结果与术语

外观菜单新增一个持久化 PUI Switch：**间距相等**。用户可在任意已挂载 `<pui-config-provider use-global-config>` 的页面随时开启或关闭它；设置跨页面同步，刷新后恢复，H5 官网预览同步提供相同行为。

本规格中的“相等”是 **Surface 主布局的等距**，不是将所有像素间距或控件内部几何改成同一个值。

对一个具有内容 Surface 的组件 `S`：

- `I(S)`：该 Surface 自己选择的安全内距（compact / normal / spacious）。
- `B(S)`：该 Surface 的直接结构块，例如 Header、Content、Footer，或 Content 内的设置行、卡片块。
- 开启等距模式后，`S` 的上下左右安全内距、相邻直接结构块间距、以及真实 Header/Content/Footer 分区间距都等于 `I(S)`。
- 组件内部的微观组合不属于 `B(S)`：例如 Cell 内标题到 Switch、Button 内 Icon 到文本、Header 标题与副标题、Tag/Badge 内边距、输入框内容 padding、Grid 单元格内部间距均保持各自合同。

因此，Popup 采用 normal Surface 时，外侧 inset 与设置行之间的 block gap 都是 `28rpx`；Popover 采用 compact Surface 时则都是 `20rpx`； 的 spacious 区可为 `36rpx`。不得把所有组件锁死到 `28rpx`。

## 2. 范围和明确例外

| 类别 | 等距模式行为 | 初始组件范围 |
| --- | --- | --- |
| 浮层 Surface | Header、Content、Footer 与 Content 的直接结构块使用 `I(S)`；遮罩、触发器、关闭按钮自身内部几何不变。 | Popup、Dialog、Sheet、ActionSheet、Popover、DropdownMenu、NavigationMenu |
| 普通独立 Surface | 组件拥有的卡片/分区/Slot 主布局使用 `I(S)`；Slot 子组件保留自身 padding。 | Card、Collapse、Collapsible、Upload 容器、Swiper 容器 |
| 展开面板 | 只改变真实展开面板的布局；Trigger/Input/内联模式不受影响。 | Combobox、Select、Picker、DateTimePicker、Calendar |
| 连续集合 | 集合根允许维持安全内距；行与行仍由分隔线、连续边界和选中态表达，不插入大 gap。 | List、Indexes、Table、VirtualList、CellGroup card 形态 |
| 展示叶子与控件 | 不参与。 | Cell、Field、Form、Empty、Result、Grid、Steps、Avatar、Tag、Badge、Icon、Progress、Skeleton、Button、Switch、Input |
| 页面/预览基础设施 | 不参与组件等距模式。 | PreviewDevice、站点 gutter、Navbar/Tabbar 安全区、页面画布、Overlay/Mask |

`CellGroup` 的普通 stack 不是自动等距目标：它本身没有独立 Surface inset。只有当宿主明确把它作为 Surface Content 的“设置行 stack”时，才通过组件级布局 variant 消费宿主的等距 block gap。不得用全局选择器把所有 CellGroup 的 `12rpx` 默认 gap 改成 `28rpx`。

## 3. 全局状态、存储和公开边界

### 3.1 `visualConfig`

在 `common/utils/visual-config.js` 的公开配置中新增：

```js
equalSpacing: false
```

- 默认关闭；`normalize`、`same`、`set`、`get`、`reset`、`restore`、`subscribe` 和 `getEffective` 均纳入该字段。
- `equalSpacing` 是布局偏好，不属于 effects：`effectsEnabled=false` 不得关闭或覆盖它。
- `standard / soft / glass` 预设不写入该字段；“果味”派生状态也不纳入该字段。用户可在任意预设之上独立开启等距模式。
- 当前存储版本保持 `1`，旧 `poemui-visual-config` 缺少字段时通过 `normalize(..., DEFAULT_CONFIG)` 回退为 `false`；不得因为增加一个布尔字段丢失用户原有主题、阴影、毛玻璃、圆角或边框设置。

### 3.2 ConfigProvider

- `pui-config-provider` 增加 `equalSpacing` Prop（默认 `false`）和全局配置读取分支。
- 开启时根类增加 `pui-spacing--equal`，关闭时为 `pui-spacing--normal`。
- 非全局 Provider 可通过 Prop 局部演示该模式；`useGlobalConfig` 时只读取 `visualConfig`。
- 不扩张 `themechange` 的主题语义：等距切换不是 theme change。需要观察真实外观设置的业务侧应订阅 `visualConfig`，而不是滥用主题事件。

## 4. Token 与组件实现合同

不得覆写 `--pui-space-*`、`--pui-content-gap` 或 `--pui-section-gap` 的原有语义；这些 Token 仍服务控件、文本、紧密组合和默认布局。新增的只能是 **Surface 布局别名**：

| Token | normal 模式 | equal 模式 | 使用边界 |
| --- | --- | --- | --- |
| `--pui-surface-inset` | 当前组件选择的 compact / normal / spacious panel padding | 不变 | Surface 四向安全内距 |
| `--pui-surface-stack-gap` | 当前组件正常的结构块 gap | 等于当前组件的 `--pui-surface-inset` | Content 内直接 block sibling |
| `--pui-surface-section-gap` | 当前组件正常的 Header/Content/Footer 分区 gap | 等于当前组件的 `--pui-surface-inset` | 三段或多段 Surface 分区 |

实现方式不是在 Provider 上把所有后代的 `gap` 改写，而是每个合资格组件在自己的根节点声明 Surface 私有别名，并为祖先 `.pui-spacing--equal` 提供显式覆盖。例如 Popup 的 root 可声明 `--pui-popup-inset`、`--pui-popup-stack-gap`、`--pui-popup-section-gap`，其 `pui-spacing--equal` 分支只令后两项引用 `--pui-popup-inset`。

这样 compact/spacious 组件能正确随自身 inset 变化，也避免 CSS 自定义属性在父级过早解析后，错误继承另一个 Surface 的数值。每个组件的等距选择器必须与 ConfigProvider 的 `styleIsolation: 'shared'` 及真实 WXML 层级一起验证；不得假设跨自定义组件选择器天然可穿透。

## 5. Popup 与外观设置列表的基准实现

当前外观 Popup 的真实结构是 `Popup Content → CellGroup → Cell → Switch`，其默认几何为 Popup `28rpx` 内容 padding、CellGroup `12rpx` sibling gap、Cell `20rpx` 横向内容 padding。该默认层级继续作为 normal 模式，不伪称已经等距。

等距模式的目标结构：

1. Popup Surface 以自己的 `--pui-popup-inset` 提供四向边界。
2. Header、Content、Footer 改由统一 Surface layout 排列，避免 Header/Content 的双重 padding 叠加制造幽灵空白。
3. Content 的“设置行 stack”显式使用 `--pui-popup-stack-gap`；开启后等于 `--pui-popup-inset`。
4. Cell 的文字、Switch 与内部 affordance 继续使用 Cell 自己的 Token；不得为凑等距删掉 Cell 内容 padding 或扩大 Switch 周围的内部 gap。
5. 顶部、最后一行、左右边界和相邻设置行的 **Cell 外框** 距离都以 Popup inset 为准；若屏幕高度不足，只有 Popup Content 滚动，不压缩等距值。

外观菜单在首页和组件独立页不能继续复制多份 WXML 逻辑。Goal 内应建立一个 `miniprogram/components/appearance-settings` 组合组件：它复用 PUI CellGroup、Cell、Switch，集中渲染 global visualConfig 的项目（包括 `equalSpacing`）；页面专属的渐变偏好以显式 Prop/Event 保留在页面侧，不能被误写入 visualConfig。

## 6. H5 镜像合同

H5 与小程序共享字段名和语义，而不是只在官网增加一个静态 Switch：

- `preview/index.html` 的 App Shell 新增 `data-spacing="normal|equal"`，默认 `normal`。
- `preview/app.js` 的 `poemui-preview-preferences` 白名单、默认值、恢复、持久化、外观菜单、果味推导与 reset 路径全部显式处理 `equalSpacing`；果味仍保持独立。
- H5 Provider 镜像在 equal 模式加入 `pui-spacing--equal`，对应 Popup、Dialog、Sheet、Card 等镜像根使用同名 Surface 布局别名。
- 所有 H5 外观控制仍通过 `switchPreviewMarkup` 与 PUI Switch 镜像渲染；`preview/index.html` 只保留 Mount，不复制平台 Switch DOM。
- H5 以 `1px≈2rpx` 镜像小程序：normal Popup 的 28rpx 等于 14px，compact 20rpx 等于 10px，spacious 36rpx 等于 18px。

## 7. 文档、Ledger 与测试

实施每个组件前必须更新其专属合同；实际变更后同步：

- `docs/UI_DESIGN_CONTRACT.md`：新增 Surface 等距模式定义、资格表和连续列表/叶子例外。
- `docs/SPACING.md`：声明基础 spacing 阶梯不被覆写，等距模式只使用 Surface 布局别名。
- `docs/components/POPUP.md` 及实际修改组件的合同：记录 normal/equal 两种主布局，不复制页面私有说明。
- Feedback Ledger：单独记录“等距模式”这一可复现设计决策、影响范围、H5/小程序证据及真机风险；生成 Ledger 后运行检查。

自动化最低覆盖：

1. `visualConfig`：旧存储恢复、默认 `false`、`set/reset/subscribe`、预设与 `effectsEnabled` 独立性。
2. ConfigProvider：global/non-global 根类和有效配置；切换 equal 不触发伪 theme change。
3. Token 与源码：合资格 Surface 只用 Surface 布局别名；连续列表和展示叶子没有被等距选择器污染。
4. H5：开关、持久化、PUI Switch ARIA、深浅色、390px；用 `getBoundingClientRect` 断言 Popup/代表 Card 的首项、末项、左右边界、相邻 block gap 相等。
5. 小程序：设置 Toggle 立即回写、页面导航后恢复、Popup 唯一滚动区、rpx/安全区、触摸与读屏；最后真机确认。

当前专项运行态证据还包括 `scripts/test-appearance-settings.js`：共享 `appearance-settings` 的 `equalSpacing` 立即写回、与果味/标准预设独立、挂载/卸载订阅均有断言；首页与详情页结构测试继续确认两页只挂载这一共享组件。

## 8. Goal 执行顺序与完成门槛

1. 先实现配置模型、Provider 根类、H5 偏好模型和专项测试，不改组件视觉。
2. 建立 `appearance-settings` 组合组件，并让首页/详情页都使用它；验证 Toggle 的跨页持久化。
3. 先完成 Popup + CellGroup 设置行 stack 的双端等距闭环，作为 reference implementation。
4. 按“浮层 → 展开面板 → 独立 Surface → 连续集合例外”逐组件迁移；每一组同步 H5、合同、Ledger 与专项测试。
5. 最后运行完整 `check`、站点构建、反馈生成/检查、示例安装和打包检查，并执行 H5 390px 与小程序真机验收。

完成不等于出现一个 Switch。只有在下列条件同时满足时才算完成：

- `equalSpacing` 可持久化、跨页面恢复、可即时关闭恢复 normal 布局；
- 代表性的 Popup、Dialog/Sheet、Card 与展开面板真实遵守其自身 inset 的等距关系；
- 连续列表、展示叶子、控件内部间距和 PreviewDevice 几何没有被破坏；
- H5 与小程序都有计算/布局证据，真机未确认项明确保留为未验证。

## 9. 当前实施状态

已落地：`visualConfig.equalSpacing`（旧存储兼容、持久化与 effects 独立）、ConfigProvider `pui-spacing--equal/normal`、三项 Surface 别名、Popup/Card/Dialog/Sheet//ActionSheet/Popover/DropdownMenu/NavigationMenu/Collapse/Collapsible/Combobox/Picker/Calendar 的组件级等距规则；小程序端各组件 equal 分支会把私有 section/stack alias 重映射到自身 inset，避免误用 normal section gap；Upload 保持透明根，仅把文件 Surface 集合的直接 stack gap 重映射到自身 inset，Swiper 维持单一 Viewport Surface 而不伪造额外分区间距；共享 `miniprogram/components/appearance-settings`、H5 `data-spacing` 与菜单/PUI Switch 镜像、专项契约测试、Ledger 与站点/示例/打包门禁。

已验证：同一微信开发者工具热重载窗口完成首页 → Icon → 首页的多页面恢复，并执行“清除文件缓存”后再次确认外观菜单中的“间距相等”保持开启。H5 390×844 计算几何已完成 Popup/Card/Dialog/Sheet/Combobox/Select/Picker/DateTimePicker/Upload 样本：Popup Header→Scroll 与 Scroll→Footer 均为 14px，关闭后恢复 0px；Card Header/Content/Footer 相邻 gap 与三段左右 inset 均为 14px；Dialog 分区与 body gap 均为 14px；Sheet Header→Body、Body→Footer 均为 14px，关闭后恢复原有 gap/padding；Combobox root 与 panel-inner gap/inset 均为 14px；Select 菜单相邻选项 gap 与四向 inset 均为 14px，左右边界距 PreviewDevice viewport 均为 39px；Picker 与 DateTimePicker 浮层面板的 Header→Wheels 为 14px、四向 inset 为 14px；Upload 文件 Surface 集合 gap 为 14px，文件项内部 padding 保持 7px，关闭后 gap 恢复 8px；这些样本均无横向溢出。小程序 Select 保持平台原生 Picker，不伪造自定义面板。其余迁移组件已完成 390px 代表根巡检与专项合同测试，但未逐项完成边界断言。仍需用户设备确认 Popup 的 rpx/安全区/触摸、系统胶囊与真机读屏；真机结果不能由静态测试或浏览器替代。
