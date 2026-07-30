# PoemUI 0.1.4 未发布开发 Goal

> 状态：`in-progress / unreleased`
>
> 开始日期：2026-07-30
>
> 真相源：原生微信小程序组件源码、组件合同、专项测试与运行态证据优先；H5 只镜像相同用户语义，不反向决定小程序实现。

## 1. Goal

0.1.4 是一次“修复优先、补齐高级能力”的未发布开发批次，目标是：

1. 修复组件独立展示页在深色、浅色和全局外观组合下的主题继承问题，不通过页面逐个传 `color-scheme` 掩盖共享组件缺陷。
2. 清理 H5 与原生组件在 Surface、主题、动效、滚动和交互语义上的漂移。
3. 新增两个图表组件 `DonutChart`、`RadarChart`，以及两个高级交互组件 `SortableList`、`Tour`。
4. 对每个发生变化的组件记录变更级别、原生改动、H5 镜像、API 影响、证据和未验证风险。
5. 将 npm 包及所有本地版本口径统一更新到 `0.1.4`，生成并安装本地 tarball 验收，但不执行发布动作。
6. 补齐 SortableList 已公开 `animated / duration / reduceMotion` 对应的真实重排位移动画，确保小程序和 H5 不再瞬时换位。

本 Goal 的完成态是“源码、H5、合同、Ledger、文档、生成产物与本地 npm 包已经闭环，可进入人工发布决定”，不是 npm Registry、Git Tag、GitHub Release、体验版或生产 H5 已发布。

## 2. 强制边界

### 2.1 明确执行

- 修改真实组件源，再生成 `miniprogram_dist/`；不手工编辑生成目录。
- 小程序组件级修复同步到独立展示页、公开入口、metadata、H5 镜像、合同、测试和安装产物。
- 使用已打开的微信开发者工具热重载与清缓存，不反复关闭、重启或切换工具。
- 运行 H5 390px、light/dark、外观组合、计算样式、几何和真实交互验收。
- npm 包版本更新为 `0.1.4`，执行本地 `npm pack`、干净安装、示例安装与文件一致性检查。

### 2.2 明确不执行

- 不执行 `npm publish`。
- 不创建或移动 Git Tag，不创建 GitHub Release。
- 不上传体验版，不部署 H5 生产环境。
- 不写入生产共享云公告；本轮只更新包内公告与待发布文案，生产写入另行授权。
- 不把 `site:build`、静态类名、Token 声明或 tarball 生成成功冒充运行态验收。

## 3. 变更分级

每个变化进入 `docs/RELEASE_0.1.4_COMPONENT_CHANGELOG.md`，使用以下固定分级：

| 级别 | 名称 | 判断标准 | 版本语义 |
| --- | --- | --- | --- |
| L0 | 文档/证据 | 不改变运行态，只补合同、说明、Ledger 或测试证据 | `docs` |
| L1 | 视觉修复 | 不改变公共 API、事件和数据结构，修复 Token、主题、间距、Surface、排版或 H5 镜像 | `fix` |
| L2 | 行为修复 | 不新增公共能力，修复焦点、滚动、手势、开关、动效或事件时机 | `fix` |
| L3 | 兼容修复 | 修复微信编译、样式隔离、旧存储、降级或跨端一致性 | `fix` |
| L4 | 向后兼容能力 | 新增可选 Prop/Event/Slot/Method，默认行为保持兼容 | `feature` |
| L5 | 新组件 | 新增公开组件、路由、合同、H5 镜像和分发链 | `feature` |
| L6 | 破坏性变更 | 删除或改变既有公共 API/默认语义，需要迁移说明 | `breaking` |

同一组件可以有多个级别；只要出现 L6，必须在 `CHANGELOG.md` 单独列出迁移说明。本 Goal 默认不计划 L6。

## 4. 已确认基线与待验证风险

### 4.1 已由源码确认

| 组件 | 基线问题 | 目标层级 |
| --- | --- | --- |
| ActionSheet | 未显式传主题时仍写入 `pui-theme--light`，覆盖 ConfigProvider；H5 存在多代样式与陈旧说明 | L1 + L3 |
| PullRefresh | 未显式传主题时强制浅色；H5 把透明布局根错误画成带背景、边框、阴影和 blur 的 Surface | L1 + L3 |
| DropdownMenu | 未显式传主题时强制浅色，展开层可能与 Provider 主题分离 | L1 + L3 |

修复原则统一为：显式 `colorScheme` 才产生局部主题类；空值必须通过 Theme Behavior 返回空类并继承最近的 ConfigProvider。

### 4.2 高风险、必须运行态验证

| 组件 | 风险 | 验证重点 |
| --- | --- | --- |
| Slider | 原生 `slider` 的颜色 Props 由 JS 默认值解析，空 `colorScheme` 下可能无法读取 Provider 的实际深色状态 | 深色轨道、激活色、滑块色、禁用态、局部覆盖 |
| Rate | 默认颜色与 Canvas/Icon 着色存在运行时主题解析路径 | 深色默认色、半星、拖动、禁用/只读、局部颜色 |
| AreaChart | Canvas fallback 与 CSS Probe 并存 | 首帧 Probe、深色 fallback、replay、低动效 |
| Popup / Sheet / Dialog / Popover / Calendar / Picker / Combobox / NavigationMenu | 多层 Surface、Overlay 和子组件容易出现局部浅色残留 | 打开态、遮罩、Header/Content/Footer、唯一滚动区 |
| ScrollArea / Skeleton / TopLoading / DynamicMessage / Swiper | 特殊渐变、骨架色、反色文字或固定材料不应被普通 Surface 规则误判 | Token 来源、渐变边界、反色可读性 |

待验证项不能在完成前直接标成缺陷；必须以真实计算样式、开发者工具运行态或专项测试取证。

## 5. 交付组件

### 5.1 DonutChart（L5）

用途：表达整体中的组成关系，不复制 AreaChart 的连续趋势职责，也不复制 Waffle 的离散点阵职责。

计划合同：

- `items` 作为唯一数据源，每项包含稳定 `key / label / value / theme`。
- 支持圆环厚度、起始角、间隔、中心总量/文案、Legend、数值格式和无障碍名称。
- 圆角弧段、低饱和实体端点与沿弧渐隐填充；不能只靠颜色传达数据。
- 默认 `animated=true / duration=500 / reduceMotion=false`，公开 `replay()`，时长限制为 `0–1000ms`，低动效为 `1ms`。
- 根是透明展示叶子，不获得 Card、阴影、毛玻璃、边框、等距、Tooltip 或请求状态。
- 小程序采用原生 Canvas 2D；H5 使用同数据合同的 SVG，不使用截图。

### 5.2 RadarChart（L5）

用途：比较多个对象在同一组维度上的相对形态；维度不足或标签不可读时失败关闭，不伪造数据。

计划合同：

- `indicators` 定义稳定维度、标签和上限，`series` 定义一个或多个数据系列。
- 低对比多边形网格、语义轴线、半透明渐隐面积、实体描边和圆润节点。
- 约束维度数量、长标签换行/收缩策略、390px 安全区和多系列 Legend。
- 默认中心展开入场，复用统一图表动画 API 和低动效合同。
- 根保持透明，不拥有 Tooltip、请求、空/错/加载或 Card Surface。
- 小程序 Canvas 2D 与 H5 SVG 使用同一归一化、比例和标签语义。

### 5.3 SortableList（L5）

用途：对有稳定 key 的列表执行真实排序意图，不负责业务持久化。

计划合同：

- `items / itemKey / disabledKeys / handle / reduceMotion` 构成最小 API。
- 长按进入拖动，可选拖动手柄；拖动结束发出 `change({ from, to, items })`，父级决定是否回写。
- 取消、失焦、越界或父级拒绝时恢复原顺序，不伪造保存成功。
- 同轴只有一个手势与滚动所有者；支持边缘自动滚动，不能用第二根滚动容器绕开竞争。
- 默认态是连续集合根，不把每行拆成独立阴影 Card；全局外观只影响适格集合根。
- H5 使用 Pointer 事件镜像相同受控语义、键盘顺序和焦点恢复。

### 5.4 Tour（L5）

用途：把多个真实页面目标组织成可控引导步骤，不拥有业务完成状态。

计划合同：

- `steps / visible / current / closeOnOverlay / showSkip / reduceMotion` 为核心受控 API。
- 每步包含稳定 `target / title / content / placement`；组合 PUI Overlay、Popover、Button 与 Icon。
- 支持上一步、下一步、跳过、完成和关闭事件；父级回写 `visible/current`。
- 目标缺失、不可测量或越界时发出错误事件并停止，不能将浮层放到错误位置继续假装成功。
- 一个 Overlay、一个活动步骤、一个焦点链；关闭后恢复触发者。
- 小程序使用 SelectorQuery 测量，H5 镜像相同定位、焦点与 390px 边界。

## 6. 分阶段执行

### Phase A：计划、事实源与测试基线

1. 读取全局 UI 合同、组件合同、TDesign 对照清单和相关 Ledger 原始 JSON。
2. 建立本文件、组件级变更表和 H5 变更表。
3. 固定 0.1.3 基线测试结果与工作区状态，区分既有失败。
4. 增加主题继承的失败用例：禁止组件在空 `colorScheme` 时主动写浅色类。

退出条件：计划、范围、风险、分级和证据格式可检索；失败测试准确复现共享缺陷。

### Phase B：原生主题继承修复

1. 修复 ActionSheet、PullRefresh、DropdownMenu 的 Theme Behavior 使用。
2. 实测 Slider、Rate、AreaChart 的 Provider 继承；只有取证成立才修改公共实现。
3. 扫描全部公开组件的根类、原生颜色 Props、Canvas Probe 和独立展示页。
4. 对浮层打开态和特殊材料组件运行深浅色矩阵。

退出条件：全部公开组件都有“通过 / 修复 / 不适用 / 待真机”的组件级记录；没有页面补丁替代共享修复。

### Phase C：H5 主题与 Surface 同步

1. PullRefresh 恢复透明布局根，不再获得独立 Surface 效果。
2. ActionSheet 删除陈旧 CSS 和失效说明，只保留一套与当前原生合同一致的实现。
3. 同步 DropdownMenu、Slider、Rate、AreaChart 及审计发现的真实差异。
4. 扩展 H5 主题测试到真实展开层、实际 Surface、文字、弱文字、边界、Overlay 和特殊材料。

退出条件：390px 下 light/dark 与外观组合无横向溢出；代表组件计算样式与组件资格一致。

### Phase D：DonutChart

按单组件闭环完成：API 准入 → 默认态 → 源码四件套 → 独立页 → H5 → 合同 → Ledger → 专项测试 → dist/安装产物 → 运行态验收。

### Phase E：RadarChart

按单组件闭环完成，重点验证维度上限、长标签、多系列、390px 和低动效。

### Phase F：SortableList

按单组件闭环完成，重点验证受控回写、取消恢复、滚动竞争、拖动越界和 H5 Pointer/键盘路径。

PUI-FB-0530 重新打开本阶段的 L2 动效补丁：

1. 保持稳定节点顺序，活动行实时跟随，兄弟行按实测高度 transform 让位。
2. 松手后先落位再清理临时状态；取消、越界和父级拒绝使用可逆回退。
3. 复用现有 `animated / duration / reduceMotion`，不新增 API；默认时长对齐全局 500ms，低动效 1ms。
4. H5 不再以 `renderStage()` 重建列表冒充动画；键盘 Arrow 和 `move()` 与 Pointer 共用落位语义。
5. 补齐变高行、边缘滚动、连续跨多行、取消、父级拒绝、焦点和真机风险证据。

### Phase G：Tour

按单组件闭环完成，重点验证目标测量失败关闭、浮层边界、步骤受控回写、焦点恢复和唯一 Overlay。

### Phase H：版本、公告、文档与分发

1. 更新根 `package.json`、lockfile、版本子入口、README、Starter Usage 和 npm 包内 Skill 的工作树版本口径到 `0.1.4`；公开 Registry 安装命令在实际发布前继续使用 `0.1.3`，本地 0.1.4 通过 tarball 安装验收。
2. 更新 `metadata/components.js`、release delta、组件数量、目录、搜索、路由和高级分区。
3. 新增四份组件专属合同，并更新实际修改过的既有组件合同。
4. 更新：
   - `CHANGELOG.md`
   - `docs/RELEASE_0.1.4_COMPONENT_CHANGELOG.md`
   - `docs/RELEASE_0.1.4_H5_CHANGELOG.md`
   - `docs/H5_PREVIEW_COMPATIBILITY.md`
   - `docs/UI_DESIGN_CONTRACT.md`
   - `docs/COMPONENT_RULES_INDEX.md`
   - `docs/COMPONENT_DEVELOPMENT_PROGRESS.md`
5. 更新包内更新公告 fallback，按组件列出变化；不写生产云集合。
6. 更新 Feedback Ledger 原始 JSON，运行生成与检查。

退出条件：用户可以从组件名反查原生变化、H5 变化、级别、API 兼容性、证据和未验证项。

### Phase I：生成物和完整验收

按以下顺序运行并记录：

```bash
npm run feedback:generate
npm run feedback:check
npm run miniprogram:build
npm run site:build
npm run check
npm run pack:check
npm run example:install
git diff --check
```

再执行：

- 四个新组件及主题修复专项测试。
- tarball 干净目录安装、公开入口与四件套 SHA 一致性检查。
- 微信开发者工具使用热重载、清缓存和真实 `build-npm`；不重启工具。
- H5 真实浏览器：390px、light/dark、阴影、毛玻璃、边框、大圆角、等距和低动效组合。
- 浮层打开/关闭、唯一滚动区、焦点恢复；图表 replay；排序取消/提交；Tour 缺失目标与完成链路。

退出条件：所有本地可执行门禁闭环；iOS/Android 真机未做时保留明确 `pending-device`，不得伪装通过。

## 7. 组件级更新记录格式

`docs/RELEASE_0.1.4_COMPONENT_CHANGELOG.md` 每行至少包含：

| 组件 | 级别 | 用户可见变化 | 小程序真相源 | H5 镜像 | API/兼容性 | Ledger | 已验证 | 未验证 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

`docs/RELEASE_0.1.4_H5_CHANGELOG.md` 每个 H5 组件页至少记录：

- 路由与组件 ID。
- 镜像的小程序结构和默认值来源。
- 本版删除的陈旧 CSS/DOM/说明。
- 真实交互、计算样式、几何和 390px 证据。
- 与微信平台不同但用户语义相同的降级实现。
- 不能由 H5 证明的小程序与真机风险。

## 8. 完成判定

只有同时满足以下条件才可将 Goal 标为完成：

- 已确认的主题继承缺陷已在共享组件层修复。
- 全部公开组件完成主题审计并有组件级结果。
- 四个新组件不是静态演示壳，原生与 H5 均有真实 API、交互、合同、Ledger 和测试。
- npm 包口径为 `0.1.4`，本地 tarball 和安装产物已验证。
- 组件级与 H5 变更文档可以按组件追溯。
- 相关专项、完整门禁和运行态证据均已记录。
- 发布动作保持为零；最终状态明确写为 `0.1.4 ready locally / unpublished`。

## 9. 阶段性执行结果与重新打开项（2026-07-30）

- 主题继承修复、新增四个组件、小程序独立页、H5 真实镜像、组件合同、Ledger 和 0.1.4 更新文档均已落地。
- `site:build`、完整 `check`、`pack:check`、`example:install`、干净 tarball 安装和 Feedback 生成/检查均已通过。
- 真实小程序目录复用现有微信开发者工具服务完成 `build-npm`：`2226ms / warnings=[]`；四个新组件的源码、dist、真实 node_modules 与微信 miniprogram_npm 四路四件套逐文件一致。
- H5 已在 390px 下完成 DonutChart 数据切换与动画、RadarChart 多系列、SortableList Pointer/键盘排序、Tour 打开/推进/Esc/焦点恢复和外观组合验证。
- 以上构建与运行态证据属于 PUI-FB-0530 动画补丁前基线。源码审计确认 SortableList 当前只有活动态 transition，小程序直接重排数组、H5 提交时重建 Stage，重排位移动画尚未完成；0.1.4 因此重新标记为 `in-progress / unpublished`。
- PUI-FB-0530 完成后必须重新运行 SortableList 专项、H5 390px 交互、完整 `check`、dist、pack、示例/干净安装和微信 `build-npm`，旧包哈希不能证明新补丁。
- 仍未执行 npm 发布、Git Tag/Release、体验版上传、生产 H5 部署或生产云数据写入。
- iOS/Android 真机的 Canvas DPR、触摸排序、SelectorQuery、安全区和读屏仍为 `pending-device`。
