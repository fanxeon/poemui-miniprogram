---
name: poemui-miniprogram
description: 使用 PoemUI 开发、迁移或排查原生微信小程序界面。适用于安装 poemui-miniprogram、配置 usingComponents、选择和组合 PUI 组件、迁移页面层原生 Button/Input/Icon、接入 ConfigProvider/Style Utilities/Token、实现真实事件与父级回写，以及排查微信 build-npm、组件路径和版本兼容问题。
---

# PoemUI Miniprogram

以目标小程序的真实代码和已安装 PoemUI 版本为准，生成可运行的 WXML、JSON、JS 与 WXSS。不要把静态演示、H5 镜像或模拟器结果当成微信真机能力。

## 工作流

1. 审计目标工程的 `project.config.json`、`app.json`、目标页面四件套、`package.json`、`miniprogram_npm` 和已有组件。先运行：

   ```bash
   node scripts/inspect-project.mjs <project-root>
   ```

2. 确认安装版本和公开路径。版本、入口或构建产物不一致时，先读 [安装与构建](references/installation.md)，不要猜测路径。
3. 按用户任务选择最少的组件组合。需要选型时读 [组件选择](references/component-selection.md)。
4. 读取目标版本中对应组件的 WXML/JS/合同/API；不要从最新主分支覆盖已安装版本的合同。
5. 修改页面 JSON、WXML、JS、WXSS。遵守 [组合规则](references/composition-rules.md) 与 [样式和主题](references/styling-and-theme.md)。
6. 对受控值实现父级回写；保留 `0`、`false`、空字符串和空数组；平台能力处理 `success`、`fail`、`cancel`。
7. 运行：

   ```bash
   node scripts/verify-install.mjs <project-root>
   ```

   再执行项目合同测试和微信开发者工具“构建 npm”。
8. 报告源码、构建、模拟器和真机的独立结果。未做真机验证时明确写 `pending-device`。

## 强制边界

- 页面和复合组件优先组合 PUI Button、Cell、CellGroup、Icon、Loading、Empty、Popup、Toast 等已有能力。
- 页面层不得用原生 `button`、`input`、`textarea` 或字符图标重复实现已有 PUI 能力。
- 不生成 fake success、假支付、假订单、假事件或只更新提示文字的伪交互。
- 页面根需要共享视觉时使用 `<pui-config-provider use-global-config>`；不要复制第二份全局外观 Store。
- 使用 PoemUI Token 与 Style Utilities；390px 不产生页面级横向溢出。
- 动效默认 500ms、上限 1000ms；`reduceMotion` 压缩为 1ms。
- 微信专属能力、H5 镜像与真机边界见 [平台边界](references/platform-boundaries.md)。
- 需要最小可运行组合时读 [示例](references/examples.md)。

## 版本合同

本 Skill 的最低适配版本与当前验证版本均为 `poemui-miniprogram@0.1.0`。公共 npm 与
`https://github.com/fanxeon/poemui-miniprogram` 是当前网络安装真相源；遇到其他版本，
先比较 `package.json`、公开入口、组件目录和合同，再继续修改。
