---
name: poemui-miniprogram
description: 开发、迁移、审计或验收 PoemUI 原生微信小程序界面与组件库本体。适用于安装 poemui-miniprogram、配置 usingComponents、选择和组合 PUI 组件、修复组件级 UI/交互问题、接入 ConfigProvider 和 visualConfig、同步 H5 镜像与小程序产物、排查 build-npm/WXML/WXSS 兼容，并完成 390px、反馈 Ledger 与真实运行边界验证。
---

# PoemUI 小程序组件开发

以当前工作树、已安装包和真实运行环境为准。先判定任务模式，再按对应流程执行；H5、构建或截图都不能替代真机证据。

## 先做范围审计

1. 不改任何文件前确认仓库根、目标小程序根、当前分支与 dirty worktree；已有改动都是用户资产，不得 reset、checkout、手工覆盖生成目录或无关格式化。
2. 运行 `node <skill-dir>/scripts/inspect-project.mjs <project-root>`，读取 `project.config.json`、`app.json`、目标页面四件套、`package.json`、`miniprogram_dist` 和真实 `miniprogram_npm`。
3. 区分目标：
   - **消费工程**：只通过 npm 包、`usingComponents` 和公开 API 使用 PoemUI。
   - **组件库本体**：改动组件、Token、全局外观、组件合同或 H5 镜像。
   - **UI battle/故障**：先由截图、复现路径和真实代码定位共享层或页面层；共享规则必须回到组件或 Token，不能在单页打补丁。
4. 先读 [组件选型](references/component-selection.md)。消费工程继续读相关安装、组合和主题资料；组件库本体或 battle 必须继续读 [组件库工作流](references/library-workflow.md)、[UI 治理](references/ui-governance.md) 与 [质量准入门禁](references/quality-gates.md)。

## 消费工程流程

1. 确认包版本、公开入口和构建根；不一致时读 [安装与构建](references/installation.md)，不猜路径或发布状态。
2. 读取安装版本对应组件的 WXML、JS、JSON、WXSS、API 与合同，再用最少的 PUI 组合实现任务。
3. 修改页面 JSON、WXML、JS、WXSS。遵守 [组合规则](references/composition-rules.md) 和 [样式与主题](references/styling-and-theme.md)。
4. 对受控值做父级回写，保留 `0`、`false`、空字符串和空数组；异步和平台能力必须处理 loading、重复点击、success、fail、cancel 与恢复。
5. 运行 `node <skill-dir>/scripts/verify-install.mjs <project-root>`、工程专项测试和微信开发者工具“构建 npm”。用已有热重载和清缓存，不反复开关或重启开发者工具。

## 组件库本体与 UI battle 流程

1. 完整阅读 `AGENTS.md`、`docs/UI_DESIGN_CONTRACT.md`、`docs/COMPONENT_FEEDBACK.md`、`docs/components/README.md`，以及目标的 `docs/components/<COMPONENT-ID-UPPER>.md`；没有合同先基于源码、H5、API、示例、测试和 Ledger 建立它。
2. 执行 `npm run feedback:list -- --component <component-id>`；全局规则再执行 `npm run feedback:list -- --scope global`，并打开命中 `feedback/records/*.json` 原始记录。涉及全局/跨组件规则时同时读 `docs/COMPONENT_RULES_INDEX.md`。
3. 修改前逐项通过五道门禁：**API 准入、默认态质量、组件职责与状态资格、单一 Surface/滚动/焦点所有权、删除闭环**。任一项不成立就缩小或重做方案，不能靠页面补丁、兼容别名或文档解释放行。
4. 将问题归类为组件 API、结构/布局、Token/外观、页面编排或平台兼容。先修唯一正确层；页面只负责业务状态、路由和父级回写。
5. 改变输入反馈、手势、浮层进退、材料、排版或动效时，先以真实小程序源码、专属合同、原始 Ledger 与专项测试确认现有行为，再同步 H5 镜像、相关全局文档、专项测试和分发链；不要把外部设计经验直接写成新的 PoemUI 规则，也不要手改 `miniprogram_dist` 或真实工程的 `miniprogram_npm`。
6. 有长期可复用的缺陷、API 边界或设计决定时新增/更新一个 Ledger 原始记录，随后运行 `npm run feedback:generate && npm run feedback:check`。
7. 按 [验收矩阵](references/validation-matrix.md) 选择专项测试、H5、390px、外观组合、构建、示例安装、打包和真机验证；每个结论只能使用同等级证据，报告必须分开列出已验证、未验证和已有基线问题。

## 不可突破的边界

- 复用 PUI Button、Input、Icon、Cell、Loading、Empty、Popup 等已有能力；页面和复合层不用原生控件、字符图标或私有复制品绕开组件。
- 不做静态假 UI、假订单/支付/上传/复制成功、假事件或只改提示文案的伪交互；真实平台结果才可呈现成功。
- 使用 PUI Token 与 Utility，不用页面私有魔法数重写尺寸、间距、圆角、阴影、色彩或焦点。390px 不得有页面级横向溢出。
- 跨页外观只通过 npm 入口的 `visualConfig` 和每页根 `<pui-config-provider use-global-config>`；不复制第二份全局 Store。
- 小程序组件 WXSS 不用 `*`、标签、ID、属性选择器或全局样式导入；WXML 不在同一节点组合 `wx:else` 与 `wx:for`。
- 动效默认 `500ms`、上限 `1000ms`，低动效为 `1ms`；不要用 `height:auto` 或 `display:none` 冒充平滑动画。

## 按需读取资料

- [UI 治理](references/ui-governance.md)：Surface 资格、等距/阴影、外观开关、Overlay、Navbar、Tabbar、Input、浮层与预览约束。
- [质量准入门禁](references/quality-gates.md)：API 是否应该新增、默认态是否可交付、状态资格、Surface/滚动/焦点所有权、彻底删除和证据等级。
- [组件库工作流](references/library-workflow.md)：合同、Ledger、跨端同步、生成产物和 Git 边界。
- [验收矩阵](references/validation-matrix.md)：何时跑哪些命令，以及 H5/小程序/真机分别证明什么。
- [平台边界](references/platform-boundaries.md)：微信能力、模拟器和真机风险。
- [示例](references/examples.md)：最小可运行页面与受控值回写。

当前验证包版本是 `poemui-miniprogram@0.1.3`；遇到其他版本，先比较实际 `package.json`、入口、组件目录和合同再修改。

维护本 Skill 后运行 `node <skill-dir>/scripts/check-skill.mjs`；它只验证 Skill 的结构、引用和不可遗漏的治理入口，不替代真实组件验收。
