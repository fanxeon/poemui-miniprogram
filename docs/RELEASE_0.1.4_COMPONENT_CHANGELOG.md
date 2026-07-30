# PoemUI 0.1.4 组件级变更记录

> 状态：`published`
>
> 日期：2026-07-30
>
> 本文记录 0.1.4 相对 0.1.3 的组件级变化；公开安装命令固定为 `poemui-miniprogram@0.1.4`。npm Registry、Git Tag/GitHub Release、生产 H5 与共享云安装页均已完成发布后回读。

## 变更级别

| 级别 | 含义 | 版本语义 |
| --- | --- | --- |
| L0 | 只更新文档、Ledger 或证据 | docs |
| L1 | 不改变公共 API 的视觉或 Token 修复 | fix |
| L2 | 不改变公共能力的交互、焦点、滚动、手势或动效修复 | fix |
| L3 | 微信编译、样式隔离、主题继承、降级或跨端兼容修复 | fix |
| L4 | 默认行为兼容的可选公共能力 | feature |
| L5 | 新公开组件及其完整分发链 | feature |
| L6 | 需要迁移的破坏性变更 | breaking |

0.1.4 没有 L6 变更。

## 组件变更总表

| 组件 | 级别 | 用户可见变化 | 小程序真相源 | H5 镜像 | API / 兼容性 | Ledger | 已验证 | 未验证 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ActionSheet | L1 + L3 | 未显式指定主题时继承最近的 ConfigProvider，不再强制浅色；H5 清除陈旧实现 | `action-sheet/action-sheet.js` | `preview/app.js`、`preview/styles.css` | 公共 Props、Events、Slots 不变 | PUI-FB-0524 | 空主题类、显式 dark、源码/dist 专项 | 微信 iOS/Android 打开态与遮罩合成 |
| PullRefresh | L1 + L3 | 未显式指定主题时继承 Provider；H5 根与内容轨恢复透明，不再误获 Surface 效果 | `pull-refresh/pull-refresh.js` | `preview/styles.css` | 18 Props、7 Events、2 Slots 不变 | PUI-FB-0524 | 空主题类、透明根、专项测试 | 微信真机下拉手势、深色首帧 |
| DropdownMenu | L1 + L3 | 展开层与最近 Provider 保持同主题，不再因空主题值写入浅色类 | `dropdown-menu/dropdown-menu.js` | `preview/app.js`、`preview/styles.css` | 公共 API 不变 | PUI-FB-0524 | 空主题类、显式 dark、专项测试 | 微信真机展开定位与触摸 |
| Rate | L1 | 默认激活色改用 warning 语义 Token，显式安全颜色仍优先 | `rate/rate.js` | `preview/app.js`、`preview/styles.css` | 13 Props、1 Event 不变 | PUI-FB-0524 | 默认 Token、显式颜色、专项测试 | 微信真机半星着色与深色 GPU 合成 |
| Slider | L0 | 审计确认原生 slider 颜色必须解析为平台可接受实色；继续由 Theme Behavior 的实际 light/dark 结果选择主题色 | `slider/slider.js` | `preview/app.js` | 无变更 | PUI-FB-0524 | 主题分支、颜色白名单、专项测试 | 微信真机系统 auto 主题首帧 |
| DonutChart | L5 | 新增圆润渐变圆环、中心摘要、Legend、可重播入场和无障碍摘要 | `donut-chart/*`、`common/utils/donut-chart-data.js` | `#/components/donut-chart` | 新组件；默认 `animated=true`，公开 `replay()` | PUI-FB-0525 | 数据归一化、Canvas 合同、H5 SVG/数据切换/390px | 微信 Canvas 2D 真机字形与 DPR |
| RadarChart | L5 | 新增多维对比雷达图、渐隐面积、节点、Legend 与中心展开动画 | `radar-chart/*`、`common/utils/radar-chart-data.js` | `#/components/radar-chart` | 新组件；默认 `animated=true`，公开 `replay()` | PUI-FB-0526 | 维度/系列归一化、Canvas 合同、H5 SVG/390px | 微信 Canvas 长标签与多机型 DPR |
| SortableList | L5 | 新增连续集合排序、活动行状态过渡、禁用项、边缘自动滚动与受控顺序回写 | `sortable-list/*`、`common/utils/sortable-list-data.js` | `#/components/sortable-list` | 新组件；`animated / duration / reduceMotion` 只承诺活动行状态过渡，不承诺兄弟行让位或落位回弹 | PUI-FB-0527、PUI-FB-0530 | 单滚动所有权、Pointer 拖动、键盘排序、焦点恢复、390px | 微信真机长按、自动滚动与触摸取消 |
| Tour | L5 | 新增目标高亮、四向遮罩、自动位置、前后步骤、跳过/完成和焦点闭环 | `tour/*`、`common/utils/tour-data.js` | `#/components/tour` | 新组件；受控/非受控显隐与步骤 API | PUI-FB-0528 | 目标测量合同、H5 打开/下一步/Esc/焦点恢复/外观组合 | 微信 SelectorQuery、键盘/读屏与真机安全区 |
| H5 浮层阴影 Token | L1 + L3 | `data-shadow=on` 时浮层重新解析当前 `--shadow`，关闭时恢复 `none` | `common/style/theme.wxss` 为原生语义源 | `preview/styles.css` | 不新增组件 API | PUI-FB-0529 | Tour Panel 计算阴影开/关、CSS Token 扫描 | Safari/WebView 与微信 backdrop-filter 组合 |
| ScrollArea / Popup card | L1 + L3 | ScrollArea 位于毛玻璃或半透明 Popup card 内时，默认边缘提示改用同色相低 alpha 材质渐变，不再形成实色横带；普通实底和显式自定义颜色保持原行为 | `common/style/theme.wxss`、`popup/popup.wxss`、`scroll-area/*` | `preview/styles.css`、`#/components/scroll-area`、`#/components/popup` | 不新增 API；`gradientOverlayColor` 仍有最高优先级 | PUI-FB-0532 | light/dark、frost on/off、Popup card 继承、自定义色、390px 无横向溢出及专项测试 | 微信 enhanced scroll-view 叠层、真实 blur 合成与 iOS/Android 真机 |
| 应用级更新公告 | L0 + 应用镜像 | 0.1.4 公告写入共享云；H5 新增独立更新页与 Topbar 版本入口 | `miniprogram/common/services/update-announcements.js`、`pui_updatelog/pui-v0-1-4-20260730` | `#/updates`、`preview/release-notes-data.js` | 不新增 npm 组件 API；H5 数据由构建生成，不伪装实时云查询 | PUI-FB-0531 | 云端写前查重、写后唯一全文回读、双端内容契约测试 | 小程序当前 IDE 运行态、iOS/Android 真机 |

## 新组件的职责边界

### DonutChart / RadarChart

- 都是透明展示叶子，不建立 Card，不拥有 loading、error、empty、Tooltip 或请求状态。
- 小程序以 Canvas 2D 绘制，H5 以结构化 SVG 镜像；两端共享数据归一化与用户语义，但不共享平台绘图实现。
- 动画默认开启，`reduceMotion` 压缩为 1ms；重播只重置入场，不改数据、不伪造业务结果。

### SortableList

- 只有集合根可作为连续 Surface；行项目不能因全局阴影开关变成独立卡片。
- 组件只发布排序意图。受控场景由父级回写 `items`，失败或拒绝不能显示“已保存”。
- 同一方向只有一个滚动所有者；边缘自动滚动必须操作该所有者。
- 用户已明确取消 PUI-FB-0530 的完整重排位移动效增强；该记录关闭为 `wont-fix / not-required`。当前顺序回写不得被描述为兄弟行让位、悬浮跟手或落位回弹。

### Tour

- 只拥有一个 Overlay、一个活动步骤和一条焦点链。
- 目标不存在或不可测量时失败关闭并发布错误，不能把面板挪到无关位置继续显示。
- `shadow/frostedGlass/equalSpacing` 只影响 Tour 的独立 Panel；遮罩、目标框和页面内容不获得 Surface 阴影。

## 版本与安装边界

- 根包版本、lockfile、生成的 `version.js` 和本地 tarball 为 `0.1.4`。
- README、H5 快速开始与 PoemUI Skill 的公开安装命令统一使用固定版本 `0.1.4`。
- 用户已授权 npm、GitHub 与生产 H5 发布，并明确排除微信小程序上传；每个平台必须在发布后独立回读，云公告 `published` 不能替代 Registry、Tag/Release 或生产站点证据。

## 交付证据

- `npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install` 与最终 `prepublishOnly` 均通过；组件目录为 `78` 个，H5 公开路由为 `84` 个。
- `poemui-miniprogram@0.1.4` 已公开发布。npm Registry 回读 `latest=0.1.4`、shasum `f182c4c42ab3882859526f159e56a347e320521d`、integrity `sha512-YMLEGO/n+baqeBjkdLLvQVgDjWuvlmripgL1bCB4e+xCPf39HxVyLy/vJxZkKE0tZCnRNsv+jEOrT3ERrxbwiw==`。
- Registry tarball 已安装到全新临时目录，回读版本 `0.1.4`、78 个组件目录与 15 个 Skill 文件；退役 Tooltip、ButtonGroup 均不在安装包中。
- Git 分支 `codex/public-beta-0.1.4` 已推送；`v0.1.4` 的 peeled commit 为 `0d6f443b91fa5df6d84f236c46269eb19987d13d`，公开 GitHub Release 已回读为非 Draft、非 Prerelease。
- 微信开发者工具复用现有 IDE 服务对真实 `miniprogram/` 执行标准 `build-npm`；本次 ScrollArea 材质修复后复跑耗时 `1249ms`、`warnings: []`，没有开关或重启开发者工具。
- DonutChart、RadarChart、SortableList、Tour 的 JS/JSON/WXML/WXSS 已在源码、`miniprogram_dist`、真实小程序 `node_modules` 与微信 `miniprogram_npm` 四路逐文件 SHA-256 一致。
- 共享生产环境 `poemcoder-1gkbkid139b08f45` 的 `pui_updatelog` 已按稳定 `_id=pui-v0-1-4-20260730` 写入；写前同版本 0 条，写后 `version/status` 唯一命中 1 条，九类合计 78。完整可版本化回读见 `docs/evidence/cloud/pui-updatelog-v0.1.4-readback.json`。H5 `#/updates` 由 `scripts/generate-release-notes.js` 生成同源数据，并由 `scripts/test-release-notes.js` 对齐云端最终文档。
- `pui-codepage` 已发布 0.1.4 安装命令与同版本 Skill，并归档 0.1.3 Skill。首次事务的 `{ data: ... }` 语义错误由发布断言拦截，随后全量事务修复；最终一条 Page、一条 Skill 为 published，三个目标文档均无嵌套 `data`。证据见 `docs/evidence/cloud/pui-codepage-v0.1.4-readback.json`。
- ScrollArea 材质上下文在 390px H5 运行态完成实底、浅色毛玻璃、深色毛玻璃、Popup card 与显式 `gradientOverlayColor` 五条路径验证；浏览器 console error/warning 为 0。该证据不替代微信真机。

## 验收状态说明

本文中的“已验证”只覆盖列出的自动化、H5 运行态和微信开发者工具 `build-npm` 证据。SortableList 的排序结果不得被表述为兄弟行让位或落位动画；这些能力不属于 0.1.4 合同。未执行的 iOS/Android 真机项始终保持“未验证”，不能由 H5、Node 测试、模拟器或构建结果替代。
