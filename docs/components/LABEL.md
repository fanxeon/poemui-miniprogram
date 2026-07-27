# Label 组件语义合同

修改 Label 源码、H5、API 或示例前必须先运行 `npm run feedback:list -- --component label`。

## 1. 组件定位

- Label 是为表单控件提供文字标签、必填标记和冒号的透明组合根；它不拥有字段值、校验、提交或业务状态。
- TDesign Mini Program 官方组件概览、官方仓库及固定 `tdesign-miniprogram@1.15.3` 安装包均没有同名 Label；PoemUI 四件套是唯一 API 真相源，不伪造对照能力。

## 2. 固定结构与区域

```text
Label（透明 flex 根）
├─ content 文本（可为空）
├─ colon（仅 content 非空且 colon=true）
├─ required 标记（required=true）
└─ default Slot（调用方关联控件）
```

- `disabled` 仅改变 Label 自身文字色；默认 Slot 始终由调用方自行管理。

## 3. PUI 组合与依赖

- Label 本体没有内部 PUI 依赖；默认 Slot 推荐组合 PUI Input、Select、Switch 等控件。
- 官网示例必须通过共享 `inputControlSample` 镜像关联输入，不能手写第二套原生输入框。

## 4. Token、间距与排版

- 根使用 PUI 文本色、禁用色、danger 色、字号、行高与 spacing Token；H5 按 `1px≈2rpx` 镜像。
- Label 是透明布局根，不得自行建立 Surface、边框、阴影、毛玻璃或额外外边距。

## 5. 内容、Slot 与组合边界

- 仅默认 Slot；`content=''` 时仍保留 Slot，不以“Label”假文案占位。
- 必填星号是展示语义，不替代 Field/Form 或 Slot 控件的 `required`、校验与错误反馈。

## 6. 状态与优先级

- 没有 loading、empty、error、retry、selected、active、readonly 或受控/非受控状态机。
- `required` 和 `disabled` 可以同时成立：星号仍显示，文本按禁用色呈现；两者不改变 Slot 控件的状态。

## 7. 交互、受控边界与事件

- Label 没有公开 Events 或 Methods，也不应标为 tap/click/input 组件。
- 默认 Slot 内控件的输入、点击和父级回写完全归调用方；官网演示不得将这些事件冒充为 Label 事件。

## 8. 可访问性

- 小程序端保留文本与 Slot 组合，不以 HTML `<label for>` 重写 WXML Slot 语义。
- 调用方负责实际控件名称、焦点、禁用和校验公告；必填标记保持可读的危险色对比。

## 9. H5 预览与跨端一致性

- 概览使用 `shadow-safe` PreviewDevice 与 component-only 归一化；只保留 Label 和真实 PUI Input Slot，不显示 Slot、事件或状态诊断卡。
- 390×844 实测 content、colon、required、disabled 属性回写；disabled 只弱化 Label，输入保持由调用方控制，重置恢复默认且页面无横向溢出。

## 10. 响应式、主题与视觉配置

- 文本与 Slot 需允许收缩和换行；390px 禁止页面级横向溢出。
- 深浅色、边框、阴影、毛玻璃和大圆角只影响嵌入控件或页面环境，不能让 Label 根变成独立 Card 或获得外投影。

## 11. 明确禁止

- 禁止给 Label 增加 tap/click/input、受控 value、校验结果、loading/error/retry、实例方法或假成功。
- 禁止自动禁用、读取或修改默认 Slot 内控件；禁止使用嵌套 HTML label 或第二层 Surface 改写小程序组合语义。

## 12. 修改闭环

- 同步检查 `label/` 四件套、`index.js`、metadata、H5、API、示例、dist 与安装产物。
- 运行 `node scripts/test-label.js`、Ledger、site build、check、pack check；产物变化后运行 example install。
- 真机仍需以合法 AppID 验证 rpx、Slot 投影、样式隔离、文本回流、读屏与真实控件关联体验。
