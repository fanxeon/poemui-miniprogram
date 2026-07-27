# PoemUI Component Feedback Ledger

Component Feedback Ledger 用来沉淀可复现问题、真实用户目标、设计决策、验证证据、遗留风险和 AI 可复用规则。它不是临时 TODO，也不是把 `COMPONENT_DEVELOPMENT_PROGRESS.md` 再抄一遍。

## 文件职责

- `feedback/schema.json`：记录格式合同。
- `feedback/records/*.json`：唯一可编辑的结构化事实源，一条文件对应一个问题。
- `.github/ISSUE_TEMPLATE/component-feedback.yml`：外部用户和维护者的标准信息入口；Issue 经复现后再进入 Ledger。
- `docs/COMPONENT_FEEDBACK_LEDGER.md`：自动生成的人类可读索引，不可手改。
- `scripts/query-feedback.js`：按组件、范围、状态、类型或标签查询。
- `scripts/test-feedback-ledger.js`：检查 schema、字段、引用路径、唯一 ID 和生成文件新鲜度。
- 根目录 `AGENTS.md`：约束本仓库所有 agent 必须查询和回写 Ledger。

## 什么时候记录

满足任一条件就应记录：

- 用户或真实浏览器/真机暴露了可复现问题。
- metadata、文档、H5、WXML、源码或安装产物之间不一致。
- 缺少用户完成任务所需的真实能力。
- 受控/非受控、`0`、`false`、空字符串、事件顺序或方法边界不明确。
- light/dark、390px、低动效、视觉开关、基础库或样式隔离存在风险。
- 做出了以后不应反复推翻的 API、交互或兼容决策。
- AI 容易选错组件、生成错误用法或把平台能力伪造成成功。

以下内容不要记录：尚未复现的猜测、没有决策价值的代码格式调整、纯过程状态、已经被另一条记录完整覆盖的重复描述。

GitHub Issue 是待核实的输入，不自动成为事实源。Agent 必须先复现、补齐证据并判断是否具有长期决策价值，再新增或更新 Ledger；不得把用户描述原样复制后直接标记 `resolved`。

## 类型与状态

类型固定为：

| type | 用途 |
| --- | --- |
| `bug` | 已有合同被真实实现违反 |
| `capability-gap` | 用户目标所需能力尚不存在 |
| `api-contract` | Props、事件、方法或受控边界问题 |
| `preview-parity` | H5、WXML、文档或示例不一致 |
| `visual-layout` | 390px、主题、动效、间距或布局问题 |
| `accessibility` | ARIA、键盘、可读性或低动效问题 |
| `compatibility` | 微信基础库、真机、样式隔离或构建差异 |
| `ai-usability` | AI 选型、生成或理解容易出错 |
| `design-decision` | 需要长期保留理由的设计取舍 |

状态使用 `open → investigating → planned → resolved`；无法支持可用 `wont-fix`，等待真机证据可用 `needs-device`。`acceptance` 与修复状态分离：`pending-user` 表示等待用户验收，`accepted` 只能由用户明确确认后填写，非 battle 决策可用 `not-required`。

## 必填事实

每条记录必须包含：

- 唯一 `PUI-FB-0001` 格式 ID、标题、组件/全局范围、类型、严重程度、状态和来源。
- `userGoal`、可重复执行的 `reproduction`、`expected`、`actual`。
- 至少一条文件、浏览器、测试、构建、用户报告或真机证据。
- `rootCause`；未定位时明确写“待确认”以及下一步，而不是猜测。
- `decision.outcome`、理由和被否决方案。
- 影响文件/依赖、测试命令、浏览器结果、真机风险。
- 简洁的 `ai.summary`、可执行的 `ai.rules` 和检索标签。

## Agent 工作流

开始工作：

```bash
npm run feedback:list -- --component style-utilities
npm run feedback:list -- --scope global
```

发现问题后复制最接近的现有记录，分配下一个未使用 ID，并保持“一条记录一个问题”。完成编辑后执行：

```bash
npm run feedback:generate
npm run feedback:check
```

完整组件修改仍必须执行项目要求的 `npm run site:build`、`npm run check`、`npm run pack:check`，以及需要的示例安装和微信构建。Ledger 检查不是组件回归的替代品。

## AI 使用原则

- AI 推荐组件前先查询 Ledger；默认优先没有 open/high 风险且已通过用户验收的实现。
- `resolved` 只代表已有修复和验证，不自动代表用户接受或真机通过。
- `ai.rules` 必须是可以指导生成代码或验收的短规则，不能写营销文案。
- 冲突时以当前真实源码、专项合同和更新日期较新的证据为准，同时修正过期记录。
