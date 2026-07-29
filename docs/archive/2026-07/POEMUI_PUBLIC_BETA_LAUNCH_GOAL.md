> **归档状态：0.1.0 首发 Goal 的历史证据。** 当前发布事实以 `README.md`、`package.json`、`docs/PUBLISH_AND_DEPLOY.md`、`docs/PUBLIC_BETA_NOTICE.md`、`docs/COMPONENT_DEVELOPMENT_PROGRESS.md`、公开 Tag 与 Registry 回读为准。

# PoemUI 受限 Beta 上线、H5、npm、GitHub 与 AI Skill Goal

> 状态：Goal Mode 收尾中；公共 npm、GitHub、H5 与官网已交付，正式小程序材料和真机仍待外部流程
> 建立日期：2026-07-27
> 主项目：`/Users/fanx/Documents/poemUI 小程序组件库`
> 官网项目：`/Users/fanx/Documents/GitHub/poemcoder.com/poemcoder`
> 目标落地页：`https://poemcoder.com/poem-ui`
> 推荐 H5 地址：`https://poemcoder.com/poem-ui/docs/`
> 假定 npm 包名：`poemui-miniprogram`

## 0. 2026-07-28 执行快照

### 已完成并有运行证据

- PoemUI H5 已部署到 `https://poemcoder.com/poem-ui/docs/`。生产容器使用
  `poemui-h5:20260728-public-registry-r3`，仅监听 `127.0.0.1:3102`；直接回滚
  容器为 `poemui-h5-rollback-20260728-public-registry-r2`。健康检查、HTML、CSS、
  JS、`0.1.0-20260728-002` 缓存指纹、390px/更窄移动视口、light/dark、真实复制和
  浏览器 console 已验。
- PoemCoder `/poem-ui` 受限 Beta 落地页已部署到
  `https://poemcoder.com/poem-ui`，使用真实微信开发者工具截图、小程序码明确留白、
  npm/GitHub 待发布状态和 H5 真实 CTA；桌面、390px、light/dark、链接点击和 console 已验。
- `skills/poemui-miniprogram/` 已按标准 Skill 结构建立，并安装到当前 Codex Skill
  目录。`quick_validate.py`、真实小程序审计和安装验证脚本均通过。
- H5 “安装”已升级为“快速开始”，现在提供固定版本
  `npm install poemui-miniprogram@0.1.0`、公开 GitHub 与网络 Skill 动作；所有复制仍以
  真实剪贴板结果为准。公共 npm 地址完整展示为
  <https://www.npmjs.com/package/poemui-miniprogram>；生产 390px 实点复制已得到完全
  相同的剪贴板文本。
- `docs/PUBLIC_BETA_NOTICE.md` 已成为 MIT Core、当前免费受限 Beta 与未来独立
  PoemUI Pro 的公开边界。
- `npm run site:build`、`npm run check`、`npm run pack:check`、
  `npm run example:install` 已通过。真实 AppID 工程
  `/Users/fanx/Documents/poemUI 小程序组件库/miniprogram` 的微信
  `build-npm` 通过，`warnings=[]`；`miniprogram_dist`、示例安装包与真实
  `miniprogram_npm` 的 540 个运行文件逐文件 SHA-256 一致。
- 公共 npm `poemui-miniprogram@0.1.0` 已发布。Registry 回读的 tarball shasum 为
  `bd9a2468d771ff3d631d59c6096247fdccc83b7d`；全新目录安装成功，真实
  `miniprogram/` 已切换到公开固定版并再次完成微信 `build-npm`，安装包和微信产物
  540 个运行文件逐文件 SHA-256 一致。
- GitHub 仓库 <https://github.com/fanxeon/poemui-miniprogram> 已公开，默认分支为
  `codex/public-beta-0.1.0`。公开快照排除了开发者私有配置、云凭据、缓存和生成的
  `miniprogram_npm`；旧远端 `main` 保留，没有 force push。`v0.1.0` Tag 与
  GitHub Release 已发布，并从全新临时目录按 Tag clone 后通过发布专项合同和 Skill 路径校验。

### 共享云完成态与精确外部阻断

- 小程序共享云快速开始 Page 与 Skill 已通过微信 `wechatide` CLI 写入资源 AppID
  `wxa1b9a4d6549c6cd1` 的 `poemcoder-1gkbkid139b08f45` 环境，返回
  `matchedCount=1 / modifiedCount=1`。管理端回读确认 Page 包含固定 npm 命令、完整 npm
  地址与最小页面引用，Skill 包含 `0.1.0`、固定 GitHub Tag 安装方式和六项能力。真实 PoemUI
  消费端 `/pages/codex/index` 的 `codePageLoadState=ready`，并回读到三段 Page snippets
  与唯一 `poemui-miniprogram@0.1.0` Skill，证明页面消费的是共享云数据。
- `_example` 使用 `touristappid`，微信 CLI 报 `code 10 / 不存在此 AppID`，因此没有生成
  `_example/miniprogram/miniprogram_npm`；已改用真实 AppID 工程完成微信构建，
  但游客项目失败仍作为安装示例风险保留。
- 正式小程序码、微信审核/发布、iOS/Android 真机、PoemUI Pro 商业主体和法律条款仍需用户材料或外部流程。

## 1. Goal

在不制造 fake success、不覆盖现有 dirty worktree、不把构建误报为上线的前提下，完成 PoemUI 首轮受限 Beta 的完整公开交付：

1. 以已经准备上线的真实小程序为基线，收口小程序与 H5 的组件、设计规则、文档和交互一致性。
2. 将小程序组件库形成可追溯的 GitHub 发布版本，并完成公共 npm 首发与干净安装验证。
3. 开发供 Codex 等 AI 使用的 `poemui-miniprogram` Skill，让 AI 能正确安装、选择、组合和验证 PoemUI，而不是只生成静态 WXML。
4. 在 H5 新增“快速开始”一级分区，提供真实 npm 安装、微信构建、最小引用、AI Skill 和版本边界。
5. 将 PoemCoder 官网现有 `/poem-ui` “正在建设”页面升级为正式受限 Beta 落地页，加入真实文案、真实截图、小程序码留白和 H5 入口。
6. 将 H5 作为独立静态 Docker 服务接入远程 1Panel/OpenResty，在同域 `/poem-ui/docs/` 提供访问。
7. 在合适的信息层级发布“快速迭代、服务可能不稳定、受限 Beta、当前无需购买、未来 Pro 高级组件商业授权”的公开公告。

Goal 完成不等于小程序已经通过微信正式审核，也不等于 npm、GitHub、Docker 或域名中的任一单项成功。只有各交付面均通过对应真实验收，才能报告受限 Beta 上线完成。

## 2. 当前已确认基线

### 2.1 PoemUI

- npm 包名当前配置为 `poemui-miniprogram`，版本为 `0.1.0`，`publishConfig.access=public`。
- `main` 与 `miniprogram` 均指向 `miniprogram_dist`。
- `npm pack --dry-run` 已成功；本地 tarball 已在全新临时项目安装成功。
- 当前 npm 身份为 `poemcoder`；公共 Registry 已可回读
  `poemui-miniprogram@0.1.0` 的版本、integrity、shasum、repository 与 homepage。
- 小程序真实工程是 `miniprogram/`；`_example/` 仅用于安装链与历史示例，不得重新成为产品真相源。
- 小程序第三个 Tab 已有真实“安装”页面，并通过共享云集合 `pui-codepage` 读取快速开始与未来 Skill 数据。
- 小程序“我的”页已有“更新公告”和“高级版商业授权”入口；公告通过 `pui_updatelog` 读取，商业授权尚无支付、订单或授权后端。

### 2.2 H5

- H5 位于 `preview/`，是纯静态 HTML/CSS/JS。
- H5 使用 `./styles.css`、`./app.js` 等相对资源和 `#/...` Hash 路由，适合部署在 `/poem-ui/docs/` 子路径。
- 当前顶部导航已有“组件 / 图标 / Token / 样式集 / 安装”，但“安装”还没有承担完整的公开 Beta 快速开始、AI Skill、许可证与服务状态职责。

### 2.3 PoemCoder 官网与生产

- 落地页真实文件为：
  `/Users/fanx/Documents/GitHub/poemcoder.com/poemcoder/app/poem-ui/page.tsx`。
- 当前页面仍显示“正在建设”“暂不提供下载或演示入口”，与即将上线状态冲突。
- 官网由 1Panel 中的 `poemcoder-v2` Compose 管理。
- 当前生产 `web` 服务绑定 `127.0.0.1:3101`，使用本地构建 `linux/amd64` 镜像、远端 Canary、只重建 `web`、保留 `.env` 回滚备份的发布流程。
- 远程服务器容量、当前镜像、端口和 OpenResty 配置会变化，正式部署前必须重新只读审计，不能直接复用旧会话数值。

## 3. 不可突破的边界

1. 不生成假小程序码；正式码未提供时只保留固定尺寸留白和明确说明。
2. 不在 npm 公共发布成功前把 `npm install` 描述成已经可用。
3. 不在 GitHub 远端、仓库归属和认证未确认时声称源码已公开。
4. 不把本地 tarball 安装成功等同于公共 npm 安装成功。
5. 不把 H5 构建成功等同于远程 Docker、OpenResty 和公网路由成功。
6. 不把小程序模拟器或微信 `build-npm` 成功等同于 iOS/Android 真机验收。
7. 不在远程低规格服务器上执行 Next.js、PoemUI 或跨架构 Docker 重构建；镜像在本机生成并核验 `linux/amd64`。
8. 不把 H5 塞进现有 Next.js 官网镜像；H5 使用独立静态容器和独立回滚边界。
9. 不在 Skill 中复制一套会快速过期的完整组件 API；组件合同必须从真实版本和可追溯引用加载。
10. 不让 Skill 使用原生 Button、字符图标、静态假反馈或绕过 PUI 组件体系。
11. 不让公告制造假 SLA、假授权、假订单或假购买入口。
12. 不对已经按 MIT 发布的代码追溯增加商业使用限制。

## 4. 最终公开拓扑

```text
https://poemcoder.com/poem-ui
  └─ PoemCoder Next.js：PoemUI 产品落地页
       ├─ 小程序码固定留白
       ├─ 真实产品截图
       ├─ 受限 Beta 公告
       └─ CTA → /poem-ui/docs/#/foundation/button

https://poemcoder.com/poem-ui/docs/
  └─ 1Panel/OpenResty
       └─ 独立 poemui-docs 静态容器
            ├─ 组件
            ├─ 图标
            ├─ Token
            ├─ 样式集
            └─ 快速开始

npm Registry
  └─ poemui-miniprogram@0.1.0

GitHub
  └─ PoemUI 可追溯源码、发行 Tag 与 skills/poemui-miniprogram

微信小程序
  ├─ 真实组件与规范
  ├─ 安装 Tab：pui-codepage
  └─ 我的 → 更新公告：pui_updatelog
```

推荐将 H5 公开地址固定为 `/poem-ui/docs/`。若 Goal 启动时用户指定其他路径，应在任何发布前一次性同步修改落地页 CTA、OpenResty、Docker 健康检查、文档和验收脚本，禁止保留并行正式入口。

## 5. Phase 0：发布快照与许可证边界

### 5.1 冻结发布快照

1. 保护当前 PoemUI 与 PoemCoder 官网 dirty worktree，不 reset、checkout、覆盖或顺手格式化无关文件。
2. 对 PoemUI 当前源码、`miniprogram_dist`、真实 `miniprogram/`、H5、文档、云端内容合同和反馈 Ledger 建立发布清单。
3. 确认首发版本是否继续使用 `0.1.0`；若版本已进入其他渠道，按 SemVer 选择新的未发布版本。
4. 确认包名继续使用 `poemui-miniprogram`。只有登录后发现不可注册，才进入 scoped 包名决策，不静默改名。
5. 确认 GitHub 仓库归属和远端 URL。当前本地仓库没有可用 Git remote 时，不得自行猜测组织或用户名。

### 5.2 Core 与 Pro

当前根包声明 MIT。MIT 允许获得软件的人使用、复制、修改、发布、分发、再许可和销售软件，因此：

- 已经放入 MIT npm 包或 MIT GitHub 仓库的组件，不能再通过公告追溯要求商业购买。
- 本次公开包必须明确为 **PoemUI Core / MIT**。
- 未来需要商业授权的高级组件必须以 **PoemUI Pro** 独立发行，使用独立包、独立仓库或独立受控下载和明确许可证。
- 仅在 metadata 中标记 `premium` 不足以形成许可证隔离；Pro 代码不能同时落入 MIT tarball 和 MIT 公共源码。
- 当前受限 Beta 可以让已开放能力全部免费体验，但不能承诺未来 Pro 永久免费。
- 正式商业条款、价格、主体、授权范围和售后边界需另行法务确认；本 Goal 不创建支付或订单系统。

发布前产出一份真实的 Core/Pro 清单。若当前所谓“高级组件”已经在 MIT 根包中，本次公告必须称其为“当前 MIT Beta 能力”，未来只能对新发行、未进入 MIT 的 Pro 能力收费。

许可证事实参考：

- SPDX MIT License：`https://spdx.org/licenses/MIT.html`
- OSI FAQ：开源许可证允许商业使用，`https://opensource.org/faq`

## 6. Phase 1：小程序与 H5 最终同步

以真实 `miniprogram/`、组件源码、专属合同和运行态为真相源，不以 metadata 的 `done` 代替审计。

### 6.1 同步范围

- 组件数量、名称、中文名、分组和排序。
- 已删除、合并或更名的组件。
- 最新高级组件：至少包括 TopLoading、DynamicMessage。
- Props、Events、Slots、Methods 和默认值。
- 受控/非受控、`0`、`false`、空字符串和空数组边界。
- Loading、Empty、Error、Retry 的真实职责边界。
- 500ms 默认动效、1000ms 上限与 reduceMotion。
- 深浅色、边框、阴影、毛玻璃、大圆角、等距和渐变。
- Style Utilities、Icon、Token 和组件组合规则。
- 小程序特有能力在 H5 的兼容说明；不得伪造微信平台成功。
- 安装页面、公告和 Skill 的跨端内容边界。

### 6.2 验收

- H5 每条正式组件路由可打开。
- 桌面与 390px 无页面级横向溢出。
- 真实点击、输入、拖动、展开、关闭、提交、重置和复制。
- Light/Dark 与外观开关使用真实计算样式验证。
- 浏览器 console 无新增 error/warning。
- WXML、API、兼容说明与真实实现一致。
- 完成后运行：

```bash
npm run site:build
npm run check
npm run pack:check
```

涉及安装产物时继续执行：

```bash
npm run example:install
/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm \
  --project "/Users/fanx/Documents/poemUI 小程序组件库/miniprogram"
```

不得使用 `_example` 冒充当前真实小程序页面工程。

## 7. Phase 2：GitHub 与 npm 首发

### 7.1 GitHub

1. 确认目标 GitHub owner/repository；建议仓库名与 npm 包一致。
2. 检查 `.gitignore`，排除密钥、`.env`、开发者工具私有配置、缓存、截图临时文件、云端管理凭证和不应提交的 `miniprogram_npm`。
3. 对将要公开的完整差异进行 secrets 扫描和第三方许可证检查。
4. 建立可追溯提交，推送发布分支与版本 Tag。
5. GitHub Release 记录：
   - npm 包名和版本；
   - Core/MIT 边界；
   - 小程序基础库和真机风险；
   - H5 地址；
   - Skill 路径；
   - 已知 Beta 风险。
6. 从全新目录 clone 公开仓库，验证文档、构建和 Skill 引用不依赖本机绝对路径。

### 7.2 npm

在用户完成 `npm login`、浏览器授权或 2FA 后：

```bash
npm whoami
npm run prepublishOnly
npm publish --dry-run --access public
npm publish --access public
```

发布前补齐：

- `repository`
- `homepage`
- `bugs`
- 明确的 author/copyright holder
- 最新版本与 CHANGELOG
- 正确组件数量和发布边界

发布后必须在全新临时目录执行：

```bash
npm init -y
npm install poemui-miniprogram@0.1.0 --production
```

随后把公共包接入真实 `miniprogram/`，执行微信 `build-npm`，核对公共 npm、`miniprogram_npm` 与发布版本的一致性。只有这一链路通过，H5 和 Skill 才能把安装命令标记为“可用”。

## 8. Phase 3：PoemUI AI Skill

### 8.1 Skill 目标

建立一个面向“使用 PoemUI 开发原生微信小程序”的公开 Skill，推荐名称：

```text
poemui-miniprogram
```

它应在用户提出以下任务时触发：

- 使用 PoemUI 新建或改造微信小程序页面。
- 选择 PoemUI 组件完成表单、导航、反馈、浮层、数据展示或高级交互。
- 将原生 Button/Input/Icon 等页面实现迁移到 PUI。
- 使用 Style Utilities、Token、ConfigProvider 和全局外观配置。
- 排查 PoemUI 安装、`usingComponents`、微信 `build-npm` 或组件路径。
- 根据 WXML/API/组件合同实现真实事件和父级回写。

Skill 不是 PoemUI 维护者 Battle Skill，也不负责发布 npm、修改生产服务器或替用户创建商业授权。

### 8.2 文件结构

Skill 必须使用标准结构，不能添加无意义 README、CHANGELOG 或重复快速手册：

```text
skills/poemui-miniprogram/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── scripts/
│   ├── inspect-project.mjs
│   └── verify-install.mjs
└── references/
    ├── installation.md
    ├── component-selection.md
    ├── composition-rules.md
    ├── styling-and-theme.md
    ├── platform-boundaries.md
    └── examples.md
```

### 8.3 Progressive disclosure

`SKILL.md` 保持简洁，只写核心工作流：

1. 审计目标小程序的 `app.json`、页面 JSON/WXML/WXSS/JS 和现有组件。
2. 检测 PoemUI 版本和安装路径。
3. 按用户目标选择最少组件组合。
4. 读取对应版本的组件合同和必要 reference。
5. 生成 `usingComponents`、WXML、页面状态与事件回写。
6. 使用 Token/Style Utilities，不手写重复组件。
7. 运行静态校验和微信构建。
8. 明确模拟器、H5 和真机的验证边界。

详细组件选择、组合规则、平台差异和示例放入 `references/`，避免每次触发都加载整个 PoemUI API。

### 8.4 Skill 真相源

Skill 必须从固定发布版本建立，而不是读取“当前主分支最新”：

- `package.json`
- npm 发布版本
- 根 `index.js` 与 `miniprogram_dist/index.js`
- `metadata/components.js`
- `docs/UI_DESIGN_CONTRACT.md`
- `docs/components/*.md`
- `docs/COMPONENT_API.md`
- `docs/H5_PREVIEW_COMPATIBILITY.md`
- `docs/STYLE_UTILITIES.md`
- `common/style/utilities.wxss`
- 真实 `miniprogram/pages/components/` 和规范页

Skill reference 必须记录适配的最低和已验证 PoemUI 版本。遇到安装版本更高或更低时先比较合同，不得默认兼容。

### 8.5 Skill 的强制行为

- 优先组合 PUI Button、Cell、CellGroup、Icon、Loading、Empty、Popup、Toast 等现有能力。
- 不在页面层手写原生 `button/input/select/textarea` 替代已有 PUI。
- 不使用字符 Icon。
- 不生成 fake success、假事件、假支付、假订单或只改提示文字的伪交互。
- 受控 Props 必须等待父级回写；`0`、`false` 和空字符串不可被 truthy 判断吞掉。
- 微信能力只调用真实平台 API，并处理 success/fail/cancel。
- 所有页面根按需要组合 `pui-config-provider use-global-config`。
- 使用 PUI Token 和 Style Utilities，390px 不得横向溢出。
- 动效默认 500ms、上限 1000ms，reduceMotion 压缩到 1ms。
- 修改后执行与范围相称的合同测试、npm 构建和 DevTools 验证。
- 无法完成真机验证时明确标记 `pending-device`。

### 8.6 可重复脚本

`inspect-project.mjs` 只做只读检测：

- 当前目录是否为微信小程序；
- `miniprogramRoot`；
- `package.json` 与安装的 PoemUI 版本；
- 页面引用和缺失组件；
- 是否存在并行手写 PUI 源码；
- 是否存在待构建的 npm 产物。

`verify-install.mjs` 验证：

- 包安装位置；
- 公开入口与常用组件四件套；
- Style Utilities 和 Theme 资源；
- 页面 JSON 引用路径；
- 包版本与 Skill 适配版本。

脚本不得自动登录 npm、修改生产项目、执行发布或覆盖用户文件。

### 8.7 初始化与验证

实现时必须使用 `skill-creator` 的 `init_skill.py` 初始化，再生成 `agents/openai.yaml`，最后运行：

```bash
quick_validate.py skills/poemui-miniprogram
```

还需完成至少以下真实使用用例：

1. 新建一个由 CellGroup、Input、Switch、Button 组成的设置表单。
2. 用 Popup 组合 Header/Content/Footer，保持真实受控 visible 回写。
3. 用 Loading/Empty/Error/Retry 组成异步列表，不伪造请求成功。
4. 使用 Style Utilities 和 ConfigProvider 实现深浅色与全局外观。
5. 在错误包路径、未构建 npm、版本不兼容时给出真实恢复步骤。

最终将 Skill 安装到当前 Codex 的 Skill 目录进行一次真实自用验证，但 GitHub 仓库中的版本仍是公开真相源。没有通过安装、触发、资源读取和产物验证前，不在 H5 提供“已安装”状态。

## 9. Phase 4：H5 “快速开始”一级分区

将当前“安装”入口升级为用户可理解的“快速开始”，内部至少包含：

1. **安装 PoemUI**
   - npm 安装命令；
   - 支持的 Node/微信开发者工具边界；
   - 首次微信“构建 npm”。
2. **引用第一个组件**
   - `usingComponents`；
   - 最小 WXML；
   - 页面 JS 的真实事件回写；
   - 必要 WXSS。
3. **主题与快速样式**
   - ConfigProvider；
   - Theme/Style Utilities 引入；
   - 深浅色和全局外观的真实边界。
4. **让 AI 使用 PoemUI**
   - Skill 名称、版本、能力和适配的 PoemUI 版本；
   - GitHub 源地址；
   - 经过验证的 Skill 安装方式；
   - 可复制的最小任务示例；
   - 明确 AI 仍需运行测试和真机验收。
5. **Beta 与许可证**
   - 受限 Beta 公告；
   - Core/MIT；
   - 未来 Pro 商业授权边界；
   - 反馈与 Issue 入口。

所有复制按钮必须复用 PUI Button/Icon 组合并基于真实剪贴板结果显示成功或失败。没有公开 npm 或 Skill 时对应入口展示真实“尚未发布”，不得复制不可执行命令。

## 10. Phase 5：PoemCoder `/poem-ui` 落地页

替换当前“正在建设”页面，保留 PoemCoder 官网整体导航、Sidebar 和主题体系。

### 10.1 页面结构

1. Hero：
   - PoemUI 正式名称与“原生微信小程序组件库”定位；
   - 受限 Beta 状态；
   - “浏览 H5 组件”和“小程序码”主要入口；
   - npm 尚未公开时不展示“立即安装”假 CTA。
2. 价值主张：
   - 原生小程序；
   - 真实交互和跨端合同；
   - PUI 自有组件组合；
   - Style Utilities；
   - AI Skill。
3. 真实能力截图：
   - 小程序首页；
   - 组件详情；
   - Style Utilities；
   - H5 组件预览；
   - 深浅色或高级组件。
4. 组件能力分区：
   - 基础、布局、导航、表单、数据展示、反馈、浮层、高级。
5. 小程序入口：
   - 固定比例小程序码留白；
   - 文案明确“正式小程序码发布后替换”；
   - 不渲染伪二维码图案。
6. H5 入口：
   - CTA 固定指向 `/poem-ui/docs/#/foundation/button`；
   - H5 未健康前不公开 CTA。
7. Beta 与授权说明。
8. 反馈入口和 GitHub/npm 状态。

### 10.2 截图要求

- 截图必须来自真实小程序开发者工具和真实 H5。
- 先清理临时调试状态、账号信息和敏感数据。
- 桌面截图展示 H5 的文档/预览关系；移动截图优先 390px。
- 图片进入官网 `public/images/poem-ui/`，使用明确 alt。
- 不用静态设计稿冒充运行态。
- 对 landing page 做桌面、390px、light/dark 和无横向溢出验收。

## 11. Phase 6：受限 Beta 公告

### 11.1 单一事实源

Goal 中新增 `docs/PUBLIC_BETA_NOTICE.md` 作为公开文案真相源，再同步到：

1. H5 快速开始顶部的 PUI NoticeBar/Alert；
2. PoemCoder `/poem-ui` 落地页状态区；
3. 小程序“我的 → 更新公告”的 `pui_updatelog` 已发布记录；
4. 小程序“安装”页的云端 `pui-codepage` Beta 说明；
5. GitHub Release 与 npm README 的 Beta 边界。

公告不需要在每个组件预览重复出现，也不使用 Toast 这种不可持续阅读的反馈。

### 11.2 建议正式文案

#### 标题

```text
PoemUI 受限 Beta 公告
```

#### 正文

```text
PoemUI 当前处于受限 Beta 与快速迭代期。组件 API、样式、文档和在线预览仍可能调整，相关服务也可能出现短时不可用，当前暂不提供正式 SLA。

Beta 期间，当前已经开放的组件与功能均可免费体验和评估，现阶段无需购买授权。未来独立发行的 PoemUI Pro 高级组件用于商业项目时需要购买商业授权，正式授权范围、价格和服务内容将在商业版发布前公布。

已经按 MIT 发布的 PoemUI Core 与对应历史版本继续遵循 MIT，不作追溯限制。欢迎通过公开反馈入口提交问题、兼容差异和真实使用场景。
```

### 11.3 文案边界

- “受限 Beta”目前是发布状态和稳定性声明，不自动等于登录白名单或付费门禁。
- “现在都不需要购买”只适用于当前已经开放的 Beta 能力。
- “未来高级版商业授权”只适用于独立发行且未进入 MIT Core 的 Pro 能力。
- 没有订单/支付/授权后端时，商业授权入口只展示信息和联系渠道，不创建价格、订单或支付成功状态。
- 正式商业文本发布前需要主体和法务复核；本 Goal 的技术实现不能代替法律意见。

## 12. Phase 7：H5 Docker 与 SSH 上线

### 12.1 部署形式

使用独立 `poemui-docs` Compose，由 1Panel 纳管：

```text
poemui-docs
  └─ 静态 Nginx 容器
       └─ preview/ 构建产物
```

原则：

- 本机完成 `site:build` 和 `linux/amd64` 镜像构建。
- 远程只加载已经核验的镜像，不在服务器重新构建。
- 容器只绑定 `127.0.0.1:<待审计空闲端口>`。
- OpenResty 为唯一公网入口。
- `/poem-ui/docs` 301 到 `/poem-ui/docs/`。
- OpenResty 将 `/poem-ui/docs/` 前缀剥离后代理到静态容器。
- HTML/CSS/JS 使用 no-cache 或短缓存；字体、图片等静态资源使用可控缓存。
- 提供真实健康检查，至少验证 `/`、`styles.css`、`app.js`。

### 12.2 发布顺序

1. 只读审计远程容器、端口、磁盘、内存、OpenResty 和回滚基线。
2. 本机构建、检查镜像架构与文件内容。
3. SSH 上传并加载镜像。
4. 启动仅回环监听的 Canary。
5. 验证首页、Hash 路由、资源、字体和 390px。
6. 备份 OpenResty 和 Compose 配置。
7. 增加 `/poem-ui/docs/` 路由并执行 `openresty -t`。
8. Reload OpenResty。
9. 验证公网 200、资源 MIME、缓存、深浅色、复制和浏览器日志。
10. H5 健康后才部署带公开 CTA 的 PoemCoder 落地页。

### 12.3 回滚

- H5 回滚只切回上一个 `POEMUI_IMAGE_TAG` 或移除新增 location，不重启 admin、MySQL 或其他产品。
- 落地页回滚只恢复上一版 `WEB_IMAGE_TAG`。
- 保留每次切换前的 Compose/OpenResty 配置和镜像标签。
- 回滚后重新验证 `/poem-ui`、其他官网核心路由和 H5 入口状态。

## 13. Phase 8：最终验收矩阵

| 交付面 | 必须通过 |
| --- | --- |
| 小程序 | 真实工程构建、安装/公告页面、390px、light/dark、关键交互；真机未验项明确保留 |
| H5 | 全路由、真实交互、API/WXML、快速开始、Skill、Beta 公告、390px、light/dark、console |
| npm | 登录身份、prepublishOnly、正式 publish、公共 Registry 回读、干净安装、微信 build-npm |
| GitHub | 公开远端、无 secrets、可 clone、版本 Tag、Release、Skill 路径可读 |
| Skill | quick_validate、安装、自用触发、引用真实版本、五类使用用例、错误恢复 |
| 落地页 | 真实截图、二维码留白、H5 CTA、Beta/授权文案、桌面/390px、light/dark |
| Docker | AMD64、Canary、回环端口、OpenResty 校验、健康检查、公网 200、回滚 |
| 文档 | 发布、安装、许可证、部署、Skill、风险和 Obsidian 工作流全部同步 |

## 14. Goal 执行顺序

必须按以下顺序推进，不能因为某个页面已经可见就提前宣布完成：

1. 发布快照、包名、GitHub 目标和 Core/Pro 边界。
2. 小程序/H5 同步审计与修复。
3. 完整本地门禁与真实小程序 npm 构建。
4. GitHub 可追溯版本。
5. npm 首发与公共安装闭环。
6. Skill 初始化、实现、验证和自用。
7. H5 快速开始与 Beta 公告。
8. PoemCoder 落地页、真实截图和二维码留白。
9. H5 独立 Docker Canary 与公网接入。
10. H5 健康后发布新版落地页。
11. 全链公网、公共 npm、GitHub、小程序和 Skill 验收。
12. 更新文档、Feedback Ledger、发布记录与 Obsidian 工作流。

## 15. 需要用户介入的真实边界

Goal 可自主完成代码、文档、构建、浏览器、Docker Canary 和回滚准备，但以下事项无法伪造：

1. npm 登录、浏览器授权和 2FA。
2. GitHub 目标 owner/repository 或创建新仓库的明确归属。
3. 正式小程序码文件。
4. 微信正式审核/发布和 iOS/Android 真机结果。
5. PoemUI Pro 的最终商业主体、价格和法律条款。

遇到这些事项时应完成所有不依赖该输入的工作，并把阻断精确收敛到单个用户动作；不得停在泛泛的“等待确认”。

## 16. Goal Mode 启动提示词

```text
进入 Goal Mode，目标是完整执行：
/Users/fanx/Documents/poemUI 小程序组件库/docs/POEMUI_PUBLIC_BETA_LAUNCH_GOAL.md

这不是再次审计或只写计划。保护两个仓库的 dirty worktree，按文档 Phase 0–8 持续交付真实小程序/H5 同步、GitHub、npm、PoemUI AI Skill、H5 快速开始、受限 Beta 公告、PoemCoder /poem-ui 落地页、独立 H5 Docker 和公网验收。

不得使用 fake success。构建不等于部署，本地 tarball 不等于公共 npm，模拟器不等于真机，静态 Skill 卡片不等于 Skill 可用，二维码留白不等于正式小程序码。只有 npm 登录/2FA、GitHub 归属、正式小程序码、微信正式审核和 Pro 法律条款等确实需要用户权限或材料的节点才停下请求精确输入；其余工作持续推进到可交付结果。
```
