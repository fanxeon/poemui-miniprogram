# 组件级阴影开关治理计划

状态：组件级治理已覆盖浮层、展开面板、独立 Surface 与连续集合例外，并通过源码正反例/契约/构建门禁；真机与完整浏览器组合矩阵仍需用户设备确认。等距布局外观开关的独立实现与验收基线见 [EQUAL_SPACING_VISUAL_CONFIG_SPEC.md](./EQUAL_SPACING_VISUAL_CONFIG_SPEC.md)。

## 目标

将 `visualConfig.shadow` 固化为唯一的全局阴影总开关。组件是否消费阴影由其“独立可见 Surface”语义决定，而不是由页面或调用方临时补样式决定。小程序组件与 H5 镜像必须消费同名语义 Token，关闭阴影不得改变布局、间距、圆角、定位或交互结构。

事实来源：

- `common/style/theme.wxss`：全局阴影 Token 与 `pui-shadow--on/off` 映射。
- `config-provider/config-provider.js`：全局视觉配置订阅与 Provider 根类。
- `docs/UI_DESIGN_CONTRACT.md`：Surface 资格、外观与跨端预览约束。
- `docs/SPACING.md`：间距不得随外观开关改变的约束。

## 阴影资格矩阵

| 层级 | 组件 | 规则 | Token 方向 |
| --- | --- | --- | --- |
| 浮层 Surface | Popup、Dialog、Sheet、ActionSheet、Popover、DropdownMenu、Toast | 仅真实浮层内容根消费外阴影；Mask/Overlay、关闭按钮和触发器不消费。 | `--pui-glass-shadow`；紧凑浮层可用 `--pui-glass-shadow-soft` |
| 展开面板 | Combobox、Select、Picker、DateTimePicker、Calendar | 仅展开的选项、日期或选择面板消费外阴影；Input、Trigger、内联日历不因此获得外投影。 | `--pui-shadow-popup` / 浮层 Token |
| 独立集合 Surface | Card、List/Indexes 集合根、Table、VirtualList 外壳、Upload 文件 Surface、Swiper、Collapse/Collapsible 卡片形态 | 集合根优先是唯一可见 Surface；内部 Cell、行、项目透明且无外投影。Upload 遵循其专属合同的明确例外：Upload 根是透明布局，文件项是业务状态 Surface，阴影只落在文件项而不扩散到内部 Image/Tag/Progress/操作。 | `--pui-shadow-card` 或 `--pui-glass-shadow-soft` |
| 屏幕附着与浮动操作 | Navbar、Tabbar、FAB | Navbar 可按附着边使用极浅分层阴影；Tabbar 的默认 `shape="normal"` 是透明屏幕附着布局，不消费阴影或毛玻璃，只有 `shape="round"` 可作为独立浮动 Surface 使用 floating shadow；FAB 可使用品牌级阴影。开关不改变尺寸、固定定位或安全区。 | Navbar `--pui-shadow-edge-top`；Tabbar round `--pui-shadow-card`；FAB `--pui-shadow-brand` |
| 不具资格 | Cell、Field、Form、Empty、Result、Grid、Steps、Avatar、Tag、Badge、Icon、Progress、Skeleton，以及集合内部的单项 | 保持 `box-shadow: none`；选中/焦点 inset outline 与分隔线继续存在。 | 不消费外阴影 Token |
| 无边缘层 | Overlay、Mask、全屏 Loading 背景 | 不使用外阴影；通过遮罩、背景或 Blur 表达层级。 | 不消费外阴影 Token |

## 实施步骤

1. **建立真实消费清单**
   - 读取每个候选组件的 WXML、WXSS、JS、专属合同、metadata、H5 镜像和专项测试。
   - 标明“真实 Surface 根”“禁止阴影的内部节点”“当前 Token”“H5 对应节点”。
   - 先确认 Dialog、Sheet、Select、Picker、FAB 的实际根节点，不凭组件名称直接修改。

2. **统一 Token 语义**
   - 保持 `visualConfig.shadow` → `pui-shadow--on/off` → 阴影 Token 的单向链路。
   - `shadow=false` 时所有合资格 Token 归零；组件 Prop 只表达该组件是否具有投影资格，不能绕过全局关闭。
   - 不新增页面私有 shadow 值，不在页面 WXSS/H5 页面样式中写死 `box-shadow`。

3. **改造浮层与展开面板**
   - 逐项处理 Popup 组和下拉/选择面板组。
   - 确保 Shadow 只在 Surface 根生效，Overlay、Slot 内按钮和输入 Trigger 不产生重复投影。
   - 同步 `preview/app.js`、`preview/styles.css` 和共享 H5 helper；H5 不得以额外包装容器模拟小程序 Surface。

4. **改造集合容器并清除反例**
   - 处理 Card、集合根、表格、虚拟列表、上传、轮播、折叠容器。
   - Upload 不得被机械改成第二张总卡片：以 `docs/components/UPLOAD.md` 的透明根 + 文件项 Surface 合同为准，文件项是唯一具备业务 Surface 语义的节点。
   - 优先核查 Grid 与全屏 Loading：前者按全局合同应无外投影，后者没有可表达 elevation 的边缘。
   - 内部条目只保留分隔线、选中态或 inset outline。

5. **同步组件合同和文档**
   - 更新 `docs/UI_DESIGN_CONTRACT.md` 的资格表与反例边界（若审计发现不一致）。
   - 每个实际改动组件同步其 `docs/components/<COMPONENT>.md`、API/H5 兼容说明、Feedback Ledger 与进度记录。
   - 计划与实现记录中同时写明小程序根和 H5 根，避免双端漂移。

6. **新增契约测试**
   - 正例：阴影开启时至少验证一个普通独立 Surface 与一个浮层的计算 `box-shadow` 非 `none`；关闭时归零。
   - 反例：Cell、Field、Empty、Grid、Tag、Icon 等始终无外投影。
   - 验证 Provider、源码 Token 引用、H5 计算样式与组件结构，不只检查根 class。

7. **视觉与运行验收**
   - 矩阵：浅/深色 × 阴影开/关 × 边框开/关 × 毛玻璃开/关 × 大圆角开/关。
   - H5：桌面与 390px，检查浮层边界、集合根、屏幕附着组件和无阴影反例。
   - 小程序：使用热重载与清缓存复验；最后在真机确认 rpx、fixed 遮罩、安全区、样式隔离与触摸行为。
   - 阴影开关全过程不得改变间距、组件几何、预览安全边距或焦点路径。

8. **发布闭环**
   - 逐组件运行专项测试；最后运行 `feedback:generate`、`feedback:check`、完整 `check`、站点构建、示例安装与打包检查。
   - Ledger 中将已解决问题标记为 `resolved`；没有用户真机确认的结果保留 `pending-user` 与 device risks。

## 完成标准

- 组件的阴影资格、真实 WXSS 根与 H5 镜像根均有可追溯记录。
- 开关只改变合资格 Surface 的视觉投影，不改变任何布局几何。
- 小程序、H5、390px 与真机验证结果分别记录；未完成的真机项明确标注为未验证。

## 当前实现证据

- Provider 与 Store：`config-provider/config-provider.js`、`common/utils/visual-config.js`。
- Surface 语义：`common/style/theme.wxss`、`popup/popup.wxss`、`card/card.wxss`、`dialog/dialog.wxss`、`preview/styles.css`。
- 非独立 Surface 的 H5 反例约束：`preview/styles.css` 的 Non-elevated primitives 层与 `scripts/test-non-elevated-shadow-semantics.js`。
- 反馈与门禁：`feedback/records/pui-fb-0331-equal-spacing-surface-governance.json`、`scripts/test-equal-spacing-visual-config.js`、`npm run check`。
- H5 390px 运行证据：Popup 开启阴影时 computed `box-shadow` 非 `none`，关闭时归零；两种状态的 Popup 几何一致，内部 Cell 始终无外阴影；Select、Picker、DateTimePicker 展开 Surface 与阴影资格共用真实面板根；真实设备的 rpx、安全区与触摸行为仍标记为未验证。
