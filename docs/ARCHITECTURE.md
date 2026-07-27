# PoemUI 小程序组件库架构

## 项目定位

PoemUI 面向微信小程序原生开发，不依赖 Vue、React 或跨端运行时。组件以微信自定义组件四件套发布：

- `.json`：组件声明与依赖组件
- `.wxml`：结构
- `.wxss`：样式
- `.js`：属性、状态、事件和边界逻辑

## npm 消费方式

对标 `tdesign-miniprogram` 的使用路径，包发布后用户可以这样引用：

```json
{
  "usingComponents": {
    "pui-button": "poemui-miniprogram/button/button"
  }
}
```

组件目录直接放在 npm 包根目录下，避免用户在 `dist`、`src`、`lib` 之间猜路径。

## 组件目录单一来源

`metadata/components.js` 是组件目录、状态和对外维护 Props 的单一来源。`npm run site:build` 先刷新 `miniprogram_dist/`，再生成目录产物，避免目录读取上一轮发布 Props；它会生成：

- `preview/components-data.js`：官网目录、状态和参数面板的数据来源。
- `docs/COMPONENT_CATALOG.md`：npm 引入路径与当前公开 Props 表。

`npm run check` 会读取每个小程序组件的真实 `properties`，拒绝生成出“官网展示了但组件不能传”的 Props。组件的 `.wxml/.wxss/.js` 仍是运行时实现的唯一来源；官网只是兼容镜像，不能反向替代小程序组件代码。

## 组件设计原则

1. 视觉 token 统一，不在组件里散落不可控颜色。
2. 组件必须覆盖默认、禁用、加载、点击、长文本等基础状态。
3. 事件命名保持微信小程序直觉，例如 `click`、`close`。
4. 组件属性要稳定、清晰，避免把业务概念塞进基础组件。
5. 每个重要组件必须有文档和示例页。

## 组件组合合同

PoemUI 业务型组件优先组合现有 PUI 原语，避免为同一种操作、图标或输入重复维护原生标签：

- 操作入口组合 `pui-button`，状态与装饰图形组合 `pui-icon`。
- 可编辑字段组合 `pui-input`；只有 Input、InputOTP、Textarea 等平台输入原语直接持有原生输入标签。
- Popup、Dialog、Sheet 等反馈容器继续组合 Button、Loading、Empty，而不是在组件内部复制按钮或状态实现。
- 组合调用必须使用子组件公开支持的 Props 值；不允许依赖非法枚举触发静默回退。比如 Button 只接收 `base/outline/text/ghost/transparent` 五种 `variant`。
- 原生 `button` 只由 Button 持有；原生 `image`、`picker` 等只留在对应平台能力原语中。
- WXML 中出现的每个 `pui-*` 子组件都必须在同目录 JSON 的 `usingComponents` 中声明。

`scripts/test-design-contracts.js` 会对全部发布组件执行上述检查，同时验证子组件枚举调用、最小字号和关键面板内距 Token。新增组件不能只在 H5 演示里拼出效果，必须先形成真实小程序组件合同，再由官网镜像。

## 主题策略

主题分两层：

- 语义层：组件自己的用途，例如 Button 的 `theme="primary"`。
- 颜色模式层：浅色、深色、跟随系统，例如 `ConfigProvider` 的 `theme="dark"`。

不要把这两层混在一个字段里。组件级强制颜色模式使用 `colorScheme`，避免和 Button 的语义 `theme` 冲突。

## 视觉风格层

PoemUI 的默认风格以黑白品牌主色、清晰表面层、可选毛玻璃、柔和阴影和大圆角为基础。`ConfigProvider` 负责输出：

- `pui-theme--light`
- `pui-theme--dark`
- `pui-frosted-glass--on/off`
- `pui-shadow--on/off`
- `pui-radius--large/normal`

视觉层有 3 个主开关：`shadow`、`frosted-glass`、`large-radius`。它们都不和 `theme` 混用。组件不需要知道外层开关的业务含义，只要引用表面层、阴影、毛玻璃和圆角 token。这样可以保证 H5 预览、小程序组件和未来更多组件共享同一套视觉语言。

## 后续组件顺序

第一阶段优先补齐高频基础能力：

1. Icon
2. Input
3. Textarea
4. Switch
5. Checkbox
6. Radio
7. Popup
8. Dialog
9. Toast
10. Empty

第二阶段再扩展复杂组件：

1. Tabs
2. Navbar
3. Search
4. Picker
5. Form
6. Upload
7. SwipeCell
8. Steps
9. Skeleton
10. Calendar
