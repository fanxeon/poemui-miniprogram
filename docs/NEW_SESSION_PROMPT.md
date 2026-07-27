# PoemUI 新会话启动提示词

把下面整段复制给新的 Agent。它不是对 `AGENTS.md` 的替代，而是确保新会话先找到项目事实源和目标组件合同。

```text
你正在继续开发 PoemUI 小程序组件库。请始终使用中文，并把仓库中的真实实现与合同当作事实源，不要依赖旧会话记忆或只根据截图打补丁。

在修改任何代码或 UI 前，必须依次完成：
1. 完整阅读仓库根目录 AGENTS.md。
2. 完整阅读 docs/COMPONENT_FEEDBACK.md。
3. 阅读 docs/UI_DESIGN_CONTRACT.md。
4. 若目标属于 TDesign 共有组件清单，完整阅读 docs/TDESIGN_COMPONENT_ALIGNMENT.md。
5. 阅读 docs/components/README.md。
6. 找到并完整阅读目标组件的专属语义合同 docs/components/<COMPONENT-ID-UPPER>.md。
7. 运行 npm run feedback:list -- --component <component-id>；涉及全局规则时再运行 npm run feedback:list -- --scope global，并打开命中的 feedback/records 原始 JSON。

每个 PoemUI 组件都必须有一份专属语义合同。若目标组件尚无合同，先审计真实源码、WXML/WXSS/JS/JSON、H5 镜像、API、元数据、示例、专项测试和 Ledger，再依据 docs/components/CONTRACT_TEMPLATE.md 建立合同，之后才能做实质修改。禁止批量创建未经审计的空壳合同。

实现时必须遵守：
- 页面、演示和复合组件优先复用现有 PUI 组件；底层平台根以外不得用原生控件或临时字符伪装已有能力。
- padding、margin、gap、字号、行高、圆角、边框、阴影和颜色必须使用 PUI Token 或标准布局类；缺少表达能力时新增语义 Token，并同步小程序与 H5。
- 删除无职责容器和重复信息，禁止面板套面板；390px 下必须可读、可操作且无横向溢出。
- H5 必须镜像真实 WXML/WXSS、真实事件与状态，不做静态假 UI、fake success 或只更新提示文案的伪交互。
- 每份组件合同必须明确 PreviewDevice 使用 `shadow-safe` 还是 `edge-to-edge` 父布局：普通 Surface 使用前者，屏幕附着或浮层使用后者；阴影安全区必须位于滚动裁切层内，禁止用组件私有 margin 补救。
- WXML 示例不得输出与组件默认值相同的 Props。
- 基础用法必须是完成最小任务所需的 WXML，不得出现任何 bind:*；完整事件只进入 API Events，只有事件专项示例绑定该能力必需的事件。
- light/dark、边框、阴影、毛玻璃、大圆角、渐变和低动效不得破坏布局、尺寸、可读性或状态边界。

组件语义合同至少要明确：组件定位、固定结构/区域、PUI 组合依赖、Token 与间距、内容与 Slot、状态优先级、受控/非受控与事件、可访问性、H5/小程序一致性、390px 与外观模式、明确禁止事项、修改闭环。

任何长期语义变化都必须同步：真实组件源码、H5 镜像、专属语义合同、相关全局文档、专项合同测试、Feedback Ledger、生成文档与安装产物。不能只改其中一处。

完成后运行目标组件专项测试、设计/布局/Token 检查、完整构建与要求的打包检查。最终报告必须列出：修改文件、验证命令、Ledger ID、尚未真机确认的风险。若任何规则无法满足，必须说明原因，不得静默绕过。

如果本次修改 Dialog，还必须先读 docs/components/DIALOG.md。默认 Cancel 是普通中性 PUI Button，不使用 outline；默认 Confirm 使用主色 Button，二者通过中性/主色建立层级。
```
