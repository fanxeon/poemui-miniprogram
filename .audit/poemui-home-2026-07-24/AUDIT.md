# PoemUI 真实微信小程序首页验收

日期：2026-07-24  
范围：微信开发者工具 RC 2.02.2607161，iPhone 12/13 (Pro) 模拟器，`pages/index/index`

## 结论

当前首页的工程结构与主要交互闭环成立，但视觉验收不通过。它可以作为继续修复的内测版本，不能作为正式首页交付。

## 流程证据

1. `01-home-default.png`：默认首页。品牌、文案、基础组件列表和底部导航可见；Navbar 标题与左侧搜索入口在视觉上不可见，品牌内容贴近原生胶囊区域。
2. `02-search-open.png`：搜索展开。搜索框和关闭动作可见，三个组件保持完整。
3. `03-search-filtered.png`：输入 Divider 后只剩 Divider，过滤逻辑有效；输入值在可见输入框中不可读。
4. `04-search-cleared.png`：清空后恢复 Button、Divider、Icon。
5. `05-search-closed.png`：关闭搜索后恢复默认内容。
6. `06-components-collapsed.png`：Collapsible 真实收起。
7. `07-disabled-tabbar-unchanged.png`：点击 disabled 任务项后仍停留首页；任务图标不可识别。

## 主要问题

### P1：Navbar 视觉失效

- 可访问树包含“Poem UI”和“搜索”，但默认截图中两者均不可见。
- 品牌区顶端与微信原生胶囊处于同一视觉高度附近，不能确认 Navbar 已正确占据独立首行。
- 相关代码：`miniprogram/pages/index/index.wxml`、`miniprogram_dist/navbar/navbar.js`、`miniprogram_dist/navbar/navbar.wxss`。

### P1：搜索值不可感知

- 可访问树中的输入值为 `Divider`，过滤结果也只剩 Divider。
- 可见输入框未显示可读的 `Divider` 文本，属于功能成功但视觉反馈失败。
- 相关代码：`miniprogram/pages/index/index.wxml`、`miniprogram_dist/search/search.wxss`、`miniprogram_dist/input/input.wxss`。

### P1：任务 Tabbar 图标名无效

- 页面声明 `icon: 'list'`，但 PUI Icon map 只有 `list-bullet` 与 `list-number`，没有 `list`。
- 模拟器中间 Tabbar 项因此没有可识别的任务图标。
- 相关代码：`miniprogram/pages/index/index.js`、`miniprogram_dist/icon/icon-map.js`。

### P1：开发者工具运行时 AppID 未闭环

- 源码 `miniprogram/project.config.json` 为 `wx23aa017375535746`。
- 当前开发者工具模拟器 URL 仍显示 `wx43ddf4043949a652`。
- 不能把当前模拟器运行结果当作目标 AppID 已确认。

## 已通过

- 搜索展开、过滤、清空、关闭均有真实状态变化。
- Collapsible 可真实展开与收起。
- disabled Tabbar 不触发页面切换，首页保持 `aria-selected`。
- 品牌 Logo、固定文案和三个基础组件信息项清楚。
- 390pt 模拟器截图未见横向溢出。

## 验证边界

- 当前内容不足以产生真实滚动距离，因此未验证触摸惯性、渐变遮罩滚动状态和唯一滚动上下文的真机表现。
- 未切换深色、边框、阴影、毛玻璃、大圆角等全局视觉状态。
- 未完成微信真机的原生胶囊、安全区、读屏、点击热区与触摸测试。
- 截图不能证明完整无障碍合规。
