# 组件库本体工作流

## 事实源与变更层级

1. 真实小程序组件源、专项测试和运行态优先；其次是组件专属合同、原始 Ledger、全局索引和生成文档。
2. 页面业务状态、路由和父级回写属于页面；组件视觉、几何、Slot、事件或可复用行为属于组件；跨组件外观属于 Token/ConfigProvider。
3. 先核对 `miniprogram/` 是否为真实工程。组件源经 `npm run miniprogram:build` 生成 `miniprogram_dist/`，示例安装后才会有消费工程的 `miniprogram_npm`；三者都不是同一编辑入口。

## 修改前

- 完整读目标合同；若是 TDesign 对照清单内组件，再读 `docs/TDESIGN_COMPONENT_ALIGNMENT.md` 并按要求在线核对官方页面和固定版本源码。
- 查询组件 Ledger；涉及 `visualConfig`、Token、Surface、预览或多组件规则时查询 global Ledger，并读命中原始 JSON。
- 审计小程序 WXML/WXSS/JS/JSON、公开入口、H5 `preview/app.js` 与 `preview/styles.css`、元数据、示例、专项测试和既有产物。先记录当前行为与复现路径。
- 读取 `git status --short`，分别核对外层仓库与嵌套 `miniprogram/` 仓库的边界。既有改动不属于本次任务。

## 实现与同步

- 新增或改变公共 API 时，同步 properties、事件、方法、WXML、文档 API、最小示例、H5 运行态和契约测试；受控 API 先发事件，再由父级写回。
- 改变结构、间距、Slot、状态、动效、视觉 Token 或可访问性时，同步小程序、H5 真实镜像、组件合同、相关规则索引和专项测试。
- H5 必须组合共享 PUI helper，镜像真实组件树、默认值、状态和事件；不得用原生控件或截图替代，也不得把微信专属成功伪造为浏览器成功。
- WXML 用 `block wx:else` 或互斥分支承接循环；WXSS 保持组件选择器安全。修复上传/编译错误必须改源组件，重建产物，不可手改 `miniprogram_npm`。
- 仅当出现可独立追溯的问题、风险或决定时写 Ledger；一条记录只处理一个问题。修复后生成/检查 Ledger，`resolved` 不代表用户或真机已接受。

## 交付前

1. 重建 `miniprogram_dist`，以示例安装和真实 build-npm 核对受影响文件。
2. 跑目标专项、Token/布局/预览边界检查和相关完整门禁。
3. 验收 H5 的真实交互及计算样式/几何，不把静态 DOM、构建或根 class 切换称作视觉验收。
4. 开发者工具使用热重载和清缓存；不反复关闭、启动或切换工具。真机未做就写明 `未验证` 与具体风险。

## 最小门禁命令

按影响范围选择并记录实际结果：

```bash
npm run feedback:generate
npm run feedback:check
node scripts/test-<component>.js
npm run miniprogram:build
npm run site:build
npm run check
npm run example:install
npm run pack:check
```

没有触及组件库时，不要为了凑流程修改 Ledger、重建无关产物或运行无关全量检查。
