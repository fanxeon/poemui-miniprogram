# FAB 组件语义合同

FAB（Floating Action Button）是 Button 家族的内部复合原语，用于承载圆形或带短文案的浮动操作表面。它不新增目录编号、独立路由或 metadata 条目，发布路径位于 `button/fab`，供 BackTop 等复合组件复用。

## 1. 组件定位

- FAB 只负责操作表面的形状、主题、尺寸、图标、加载和禁用语义；固定、静态、吸附和滚动定位由父组件负责。
- `content=''` 表示圆形 FAB，并必须向内部 Button 传入 `iconOnly`，真实移除空内容与后缀轨道，确保图标双轴居中；非空 `content` 表示带短文案的圆角扩展 FAB。长内容必须由消费者控制，不能用 FAB 伪装信息卡。
- `theme` 支持 `default / primary / danger / inverse`；`inverse` 是深色浮层或深色主题所需的反色表面，不扩展基础 Button 的公共主题 API。
- 不内置业务成功、请求状态、页面滚动、自动关闭或方法；点击只转发真实 `click` 事件。

## 2. 结构与跨端实现

- 唯一交互根是 `pui-button`，禁止裸 `button`、字符图标和第二层可见 Surface。
- 小程序 `fab.wxml` 只组合 PUI Button 与两个默认/图标 Slot；H5 必须通过 `fabSample` 调用共享 `buttonSample`。
- FAB 本身不设置 `position`。BackTop 的固定/文档流定位、显隐过渡和滚动回写仍由 BackTop 拥有。
- 阴影、圆角、毛玻璃、边框和深浅色必须继续消费全局 Token；父级预览按 `shadow-safe` 或 `edge-to-edge` 决定安全内距。

## 3. 预览与验收

- BackTop 的基础用法必须在真实局部滚动容器中回写 `scrollTop`，阈值达到后显示 FAB，点击后真实滚回 0；不能只更新提示文字。
- 390px 下圆形和扩展形态都不能造成页面级横向溢出；FAB 文案自然换行，不得用省略号裁掉关键操作。
- light/dark、shadow、frosted glass、large radius 与 reduceMotion 均必须通过共享视觉合同验证。
- 真机仍需确认 `wx.pageScrollTo`、fixed 视口、安全区、样式隔离和读屏表现。

## 4. 修改闭环

修改 FAB 或依赖它的复合组件后，先运行 `npm run feedback:list -- --component back-top` 与 `npm run feedback:list -- --scope global`，再至少运行 `node scripts/test-fab.js`、`node scripts/test-back-top.js`、`npm run feedback:generate`、`npm run feedback:check`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`，并核验源码、`miniprogram_dist`、示例安装和微信 `miniprogram_npm` 的一致性。**明确禁止**把固定定位、业务成功或裸 Button 重新塞回 FAB；微信 CLI 无法生成安装产物时必须记录真实原因，不得手工复制冒充通过。
