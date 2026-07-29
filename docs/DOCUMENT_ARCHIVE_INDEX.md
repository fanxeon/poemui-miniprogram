# PoemUI 文档归档索引

本文只负责导航已完成、被冻结或被后续事实源取代的执行记录；它不替代任何组件合同、Ledger、发布证明或源码。

## 当前权威文档

- 设计与跨端规则：`docs/UI_DESIGN_CONTRACT.md`、`docs/COMPONENT_RULES_INDEX.md`、`docs/SPACING.md`、`docs/H5_PREVIEW_COMPATIBILITY.md`。
- 组件语义：`docs/components/<COMPONENT>.md` 与 `docs/COMPONENT_API.md`；唯一生成目录为 `docs/COMPONENT_MATRIX.md`。
- 问题、决策与验收：`docs/COMPONENT_FEEDBACK.md`、`feedback/records/*.json`；`docs/COMPONENT_FEEDBACK_LEDGER.md` 是生成索引。
- 当前小程序页面：`miniprogram/app.json`、`metadata/components.js`、`docs/MINIPROGRAM_*.md`。
- 当前公开版本与发布：根 `package.json`、`README.md`、`docs/PUBLISH_AND_DEPLOY.md`、`docs/PUBLIC_BETA_NOTICE.md`、带注释的 Git Tag 与 npm Registry 回读。

发生冲突时，以“源码与专项测试 → 组件合同 → 原始 Ledger → 当前发布证据 → 归档记录”的顺序判断。

## 2026-07 已归档历史文档

| 原路径 | 归档路径 | 原因 | 当前替代事实源 |
| --- | --- | --- | --- |
| `docs/POEMUI_PUBLIC_BETA_LAUNCH_GOAL.md` | `docs/archive/2026-07/POEMUI_PUBLIC_BETA_LAUNCH_GOAL.md` | 0.1.0 首发 Goal 已结束，且不再描述 0.1.2 当前发布状态。 | `README.md`、`package.json`、`docs/PUBLISH_AND_DEPLOY.md`、`docs/PUBLIC_BETA_NOTICE.md` |
| `docs/MINIPROGRAM_REMAINING_SECTIONS_MIGRATION_PLAN.md` | `docs/archive/2026-07/MINIPROGRAM_REMAINING_SECTIONS_MIGRATION_PLAN.md` | 69 组件页面搬迁阶段已完成，当前目录已扩展。 | `miniprogram/app.json`、`metadata/components.js`、`docs/MINIPROGRAM_HOME.md` |
| `docs/STYLE_UTILITIES_TAB_PLAN.md` | `docs/archive/2026-07/STYLE_UTILITIES_TAB_PLAN.md` | 五类 Tab 与语义预览已经落地。 | `docs/STYLE_UTILITIES.md`、`docs/COMPONENT_RULES_INDEX.md`、源码与专项测试 |
| `docs/BAR_CHART_WAFFLE_COMPONENT_PLAN.md` | `docs/archive/2026-07/BAR_CHART_WAFFLE_COMPONENT_PLAN.md` | 初始立项与实现阶段已结束。 | 三份图表组件合同、H5 兼容合同、原始 Ledger |
| `docs/AREA_CHART_GRADIENT_COMPONENT_PLAN.md` | `docs/archive/2026-07/AREA_CHART_GRADIENT_COMPONENT_PLAN.md` | 0.1.2 图表动效统一实施已经完成。 | 三份图表组件合同、H5 兼容合同、原始 Ledger |
| `docs/ROADMAP.md` | `docs/archive/2026-07/ROADMAP.md` | 早期 P0–P3 路线快照已不反映当前版本和待办。 | `docs/COMPONENT_MATRIX.md`、`docs/COMPONENT_DEVELOPMENT_PROGRESS.md`、`docs/PUBLISH_AND_DEPLOY.md`、后续明确 Goal |
| `docs/COMPONENT_CATALOG.md` | `docs/archive/2026-07/COMPONENT_CATALOG.md` | 与按分区生成的 Matrix 重复维护同一组件状态、路径和 Props。 | `docs/COMPONENT_MATRIX.md`、`docs/COMPONENT_API.md` |

为保护历史 Ledger、旧外链和会话中已经写入的文件引用，以上七个原路径只保留最小跳转页，不再作为活跃入口；后续引用必须改用本索引给出的当前事实源或归档路径。

## 不归档的历史材料

- `docs/RELEASE_0.1.2_BATTLE_CHANGELOG.md`：仍是 0.1.2 可追溯发布证据，并被多条 Ledger 引用。
- `docs/COMPONENT_DETAIL_PAGE_UI_CHECKLIST_2026-07-28.md`：仍是逐组件 Battle 的历史验收索引，并被多条 Ledger 引用。
- `docs/EQUAL_SPACING_VISUAL_CONFIG_SPEC.md`、`docs/SHADOW_SWITCH_COMPONENT_PLAN.md`：虽然已实施，但它们仍提供全局外观治理的可复核约束。

## 维护规则

1. 只有已完成且不再承载当前合同的计划、阶段性 Goal、一次性审计快照才能归档。
2. 归档前必须列出当前替代事实源，并检查源码、测试、Ledger 与站内引用不依赖该文档作为唯一说明。
3. 不能把原始 Ledger、组件合同、生成 Ledger、发布证明或当前运行手册移入归档。
4. 新旧版本共存时，旧版本证据可保留，但不得让旧版本文字覆盖当前版本号、API 或验收结论。
