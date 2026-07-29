# ConfigProvider 组件语义合同

本文是 PoemUI ConfigProvider 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或视觉 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component config-provider`

Props、事件、Store 方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文只规定长期语义和边界。

## 1. 组件定位

- ConfigProvider 是页面或局部组件树的视觉 Token 边界，负责主题、中性边框、阴影、毛玻璃、语义圆角和独立 Surface 的等距模式。
- 单页局部配置直接传 Props；跨页面统一配置使用 npm 入口的 `visualConfig` Store，并在每个页面根挂载一次 `use-global-config` Provider。
- `visualConfig` 的首次和重置默认值为 light、阴影开启、大圆角开启、边框关闭、毛玻璃关闭、等距关闭；已有本地存储是用户偏好，恢复时不得被新的默认值静默覆盖。
- 小程序没有覆盖全部 Page 的 App 级 WXML 根；`App.onLaunch` 可以恢复 Store，并由消费者按产品决定同步系统主题，但仍不能替代每页 Provider。
- 渐变属于页面画布，不进入 ConfigProvider、Store 或组件 Surface。

## 2. 固定结构与区域

```text
view.pui-config-provider + theme/effect classes
└── default slot（消费者页面或组件子树）
```

- 根 `view` 是唯一结构层，只建立 Token 继承、文字颜色和业务根 class/style 边界。
- Provider 不增加可见 Surface、Header、Footer、状态面板或装饰容器。
- 默认 slot 始终存在；无内容时保持透明，不伪造示例内容。

## 3. PUI 组合与依赖

- Provider 本体不需要组合子组件；它依赖 `themeUtils` 解析 `light/dark/auto`，依赖 `visualConfig` 订阅跨页面配置。
- H5 演示必须用共享 Button、Cell、Tag 镜像证明 Token 真实传入子树，不得手写伪组件。
- 页面根可使用平台原生 `view`，但业务操作仍优先组合 PUI 组件。

## 4. Token、间距与排版

- 根节点使用 `pui-theme--light/dark`、`pui-shadow--on/off`、`pui-frosted-glass--on/off`、`pui-radius--large/normal`、`pui-border--on/off`、`pui-spacing--equal/normal`。
- Provider 自身透明、无边框、无阴影、无额外 padding；间距由页面布局和子组件负责。
- `pui-spacing--equal` 只改变具备独立 Surface 资格组件的 Surface inset、直接结构块 gap 和 Header/Content/Footer 分区 gap；不覆盖全局 `--pui-space-*`、页面 gap、连续列表行或控件内部微间距。组件应消费 `--pui-surface-inset`、`--pui-surface-stack-gap`、`--pui-surface-section-gap`。
- `bordered=false` 只透明化中性边界，必须保留盒模型以及焦点、错误、选中和危险状态边界。
- 大圆角重映射全部语义圆角档位，显式 `round/circle` 仍保持满圆。

## 5. 内容、Slot 与组合边界

- 仅提供默认 slot，承载需要继承视觉配置的完整子树。
- `customClass/customStyle` 只作用于 Provider 根；不得用它们穿透重写 Button、Cell、Dialog 等子组件几何。
- Provider 只传递 Token，不接管子组件的事件、loading、disabled、readonly、empty、error 或业务状态。

## 6. 状态与优先级

- `useGlobalConfig=true` 时，Store 的 `theme/effectsEnabled/shadow/frostedGlass/largeRadius/bordered/equalSpacing` 优先于同名局部视觉 Props。
- `effectsEnabled=false` 只暂停 shadow、frostedGlass、largeRadius 的有效值，不删除已保存选择；theme、bordered 与 equalSpacing 保持独立。31 个真实根组件和 Search/Combobox 内嵌 Input 的资格以 `docs/APPEARANCE_CONTRACT_MATRIX.md` 为唯一共享矩阵。
- `equalSpacing` 独立于 `effectsEnabled`、预设和果味组合；关闭 effects 不得关闭已保存的等距模式。
- Store 恢复、写入或预设失败必须通过返回值的 `error` 进入真实失败处理，不得 fake success。
- ConfigProvider 没有 loading、empty、error、retry 等内容状态；这些状态由真实子组件承担。

## 7. 交互、受控边界与事件

- Props 是声明式输入，没有内部受控/非受控双态；Store 是跨页面唯一共享写入源。
- `themechange` 仅在解析后的实际主题于 `light/dark` 之间变化时触发；只切换阴影、毛玻璃、圆角或边框不得重复触发。
- 事件 detail 固定包含 `theme/source/frostedGlass/shadow/largeRadius/bordered/equalSpacing/effectsEnabled/global`。
- `theme=auto` 监听 `wx.onThemeChange`，detached 时必须取消系统监听和 Store 订阅。
- 需要“每次进入都跟随系统”的消费者必须在 `app.json` 启用 `darkmode` 并提供 `themeLocation`，在 `App.onLaunch`、`App.onShow` 与 `App.onThemeChange` 读取 `common/utils/theme#getSystemTheme()` 或事件中的合法 `light/dark`，再写入唯一 `visualConfig` Store。系统派生写入应使用 `persist:false`，避免把运行时系统状态静默覆盖为用户持久偏好；所有外观菜单只订阅同一个 Store，禁止维护第二份深浅色状态。PoemUI 示例小程序以 `miniprogram/app.js` 为参考实现。

## 8. 可访问性

- Provider 不创建新的交互角色或焦点节点；可访问名称、键盘和状态语义由 slot 子组件负责。
- light/dark 下正文与 Surface 必须保持可读对比度。
- 边框关闭不能移除键盘焦点、错误、选中或危险状态的必要视觉边界。

## 9. H5 预览与跨端一致性

- ConfigProvider 预览使用 `shadow-safe` 父布局，让子树阴影完整显示；Provider 本体仍保持透明。
- H5 的局部模式直接读取 Props；`useGlobalConfig=true` 时读取官网同源外观设置，局部视觉 Props暂停生效，镜像 Store 优先级。
- 常规模式基础 WXML只展示最小 Provider 包裹，不出现 `bind:*`；Store 恢复、预设和错误处理进入 API/属性文档。
- H5 不执行真实 `wx.onThemeChange` 或 `wx` storage；该平台差异必须明确保留，不得伪造微信回调成功。

## 10. 响应式、主题与视觉配置

- 390px 下演示分区、Tag、Button、Cell 和代码必须自然换行，不产生页面级横向溢出。
- local/global 两种来源都要验证 light/dark、border、shadow、frostedGlass、largeRadius；站点渐变只改变画布。
- 全局设置变化不得改变 PreviewDevice 尺寸、Provider padding 或组件布局。

## 11. 明确禁止

- 禁止声称只在 `app.js` 配置一次即可自动包裹所有页面。
- 禁止把渐变、业务状态或任意 TDesign 国际化配置塞进视觉 Store。
- 禁止让 `useGlobalConfig=true` 时局部视觉 Props继续覆盖 Store。
- 禁止在基础 WXML 中展示 `bind:themechange`、Store 初始化或完整事件代码。
- 禁止因参考 TDesign 而直接引入 `globalConfig/themeVars`；新增这类能力前必须证明 PoemUI 的独立用户目标和小程序闭环。

## 12. TDesign 1.15.3 对照决定

- TDesign ConfigProvider 公开 `globalConfig/themeVars`（加公共 `style/custom-style`），主要解决组件文案国际化、通用配置和主题变量覆盖；其源码通过全局响应式 Store 分发 locale/themeVars。
- PoemUI ConfigProvider 的核心目标是主题与视觉效果的一致继承，并以 `visualConfig` 提供持久化、预设和跨页面订阅。两者用户任务只部分重叠，不能按同名组件机械对齐 API。
- 保留 TDesign 值得借鉴的“单一 Provider + Store 分发”结构；拒绝无产品需求的国际化配置树和任意变量对象，继续由语义 Token 维护视觉稳定性。
- PoemUI 公开 9 个真实 Props、1 个事件和默认 Slot；公开数量不是成熟度目标。

## 13. 修改闭环

1. 同步审计 `config-provider/`、`common/utils/visual-config.js`、主题 Token、metadata、H5、API、README、示例、dist、安装产物和 Ledger。
2. 更新 `scripts/test-config-provider.js`，运行 `npm run site:build`、`npm run check` 与 `npm run pack:check`。
3. 浏览器验证 local/global 优先级、事件说明、基础复制代码、390px、深浅色和六项视觉边界。
4. 真机继续验证多 Page 同时订阅、storage 异常、启动/回前台/系统切换三条主题同步链、auto 系统主题回调和 WXSS 样式隔离。

任何不能满足本文的实现必须在 Feedback Ledger 中说明原因，不得静默绕过。

当前外观设置补充：Provider 公共 Store 字段固定包含 `theme / effectsEnabled / shadow / frostedGlass / largeRadius / bordered / equalSpacing`；渐变及其预设属于 H5 消费者页面画布，不进入组件 Surface。`effectsEnabled=false` 只暂停 shadow、frostedGlass、largeRadius 的有效值，恢复后使用原持久化单项。该字段与 `setEffectsEnabled()` 继续是开发者 API，但小程序/H5 的用户外观菜单不再渲染总开关；菜单初始化会把旧的暂停状态迁移为开启，保留三个单项。31 个真实根组件和 Search/Combobox 内嵌 Input 的资格统一以 [外观资格矩阵](../APPEARANCE_CONTRACT_MATRIX.md) 为准。
