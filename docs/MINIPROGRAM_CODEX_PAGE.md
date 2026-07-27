# 小程序 Codex 一级页

## 页面目标

`pages/codex/index` 是小程序 Tabbar 第三个真实一级目的地，替换旧 `pages/explore/index` 空白占位页。它只承担 PoemUI 的快速接入和未来 AI Skill 入口，不扩张 Tabbar 组件的自动路由职责。

## 信息结构

页面固定为两个分区：

1. **快速开始**：展示仓库 README 同源的 npm 安装命令，以及最小 `usingComponents + WXML` 引用。
2. **让你的 AI 懂得用它**：当前只显示 `SKILL` 留白。Skill 未完成前不得提供下载、复制、成功状态或不可执行的示例内容。

Navbar 中只出现一次 `Codex` 标题。页面内容由唯一 PUI ScrollArea 承载，底部继续使用受控 PUI Tabbar。

## PUI 组合

- 页面根：`pui-config-provider use-global-config`
- 页面结构：PUI Navbar、ScrollArea、Tabbar 与共享 `component-page-section`
- 代码区：共享 `miniprogram/components/code-snippet` 组合 PUI Card、Button、Icon
- SKILL 留白：PUI Card + `pui-icon name="codex"`

代码区只允许一个原生横向 `scroll-view` 承担超长代码阅读；复制必须使用 `default / text / small / circle / icon-only` 的 PUI Button。成功时真实回写 `check + aria-live`，失败时回写 `error-circle`，不得用静态文案冒充剪贴板成功。

## Icon 与路由

第三项固定为：

```js
{ label: '', value: 'codex', icon: 'codex', ariaLabel: 'Codex' }
```

`codex` 不是页面猜测的字符串。它由 `scripts/generate-icons.js` 映射到锁定的 Lucide `bot`，再生成 SVG、manifest、稳定码点、本地 WOFF2、小程序字体目录与 H5 Icon 目录。路由固定为 `/pages/codex/index`；旧 `/pages/explore/index` 必须移除。

## H5 边界

该页是示例小程序的信息架构，不复制成官网组件页面。H5 只同步 `codex` 字体 glyph/Icon 资源；官网代码区继续使用既有 `previewCodeBlockSample`。这避免为应用页面伪造一套 H5 Tabbar。

## 验收

- 第三 Tab 显示真实 `codex` glyph，选中态仍由 Tabbar 短横承担。
- 两个代码区可以横向阅读、选择文本并分别复制准确内容。
- 复制成功与失败均有真实状态反馈。
- SKILL 区没有可点击假入口。
- 390px 下 Navbar、内容、代码区和 Tabbar 无页面横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角、等距和渐变不改变页面结构。
