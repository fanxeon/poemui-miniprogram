# Select 组件语义合同

本文是 PoemUI Select 的长期设计与实现合同。修改前必须查询：

`npm run feedback:list -- --component select`

完整 API 以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- Select 是由 PUI Button Trigger、PUI Popup 与 PUI Button 选项组成的单值选择组件；可搜索、多选、分组与创建属于 Combobox。
- 它只请求并呈现一个选择值，不承载业务保存、远端成功或多级联动。

## 2. 固定结构与区域

- 固定为一个 PUI Button Trigger、选中文本、PUI Chevron Icon 和底部 PUI Popup；空值显示 placeholder，空 options 显示 emptyText。
- Popup 内每个选项都是 PUI Button，选中项组合 PUI Check Icon；组件不创建第二套私有 Button 或系统 picker。

## 3. PUI 组合与依赖

- Trigger 与 Option 必须复用 PUI Button，Chevron/Check 必须复用 PUI Icon，选项层必须复用 PUI Popup。
- H5 可见 Trigger、Option 与菜单必须经共享 PUI Button/Icon/Surface 镜像；浏览器原生 select 只能作为不可见值桥接，不能成为最终 UI。

## 4. Token、间距与排版

- Trigger 使用字段 Surface 的主题、边界、圆角、文字和间距 Token，不额外增加 Card。
- Trigger/Popup/菜单过渡默认 500ms、最大 1000ms、reduceMotion 为 1ms；禁用和只读只改变语义状态，不改变盒模型。

## 5. 内容、Slot 与组合边界

- options 是唯一选项来源；Select 不拥有搜索、分组、创建或默认 Slot 承载的业务内容。
- option 的 label/value/disabled 保留原始值，父级不能以展示文本替换 value。

## 6. 状态与优先级

- `value !== null/undefined` 受控；`0` 和 `false` 是合法原始值。未传 value 时 defaultValue 只首次初始化。
- 空 options、disabled、readonly 均阻断打开和选择；禁用 option 不得发 input/change。readonly 不是 disabled，但同样不写入。

## 7. 交互、受控边界与事件

- 成功选择固定 `input → change`，detail 保留 value/index/option/source=option；通过遮罩或关闭按钮退出只发 cancel，不修改值。
- H5 选择必须经 `updateCurrentProp('value')` 父级回写，不持有第二份最终选值。

## 8. 可访问性

- Trigger 使用 ariaLabel 与可见值形成名称，disabled/readonly 同步可访问状态；Popup 使用 dialog 语义，选项集合使用 listbox 语义。

## 9. H5 预览与跨端一致性

- Overview 采用 `shadow-safe`，component-only 去除当前选择诊断，只保留可操作 Trigger 与真实展开菜单。
- H5 与小程序都展示 PUI 选项菜单，不宣称是微信系统滚轮；浏览器 Popover 与微信 Popup 的定位、焦点恢复差异在兼容说明中保留。

## 10. 响应式、主题与视觉配置

- 390px 下 Trigger 与菜单在 PreviewDevice 内收缩，document/body 无横向溢出。
- light/dark、边框、阴影、毛玻璃与大圆角消费全局 Token，不改变 value、禁用或事件顺序。
- `equalSpacing` 只作用于 H5 的真实展开 `.pui-select-menu` Surface：菜单四向 inset 与选项结构 gap 使用 Surface 别名；微信端 Popup 使用同一面板/控件间距 Token。Trigger、选项内部 Icon/文字 gap 与受控事件不受影响。

## 11. 明确禁止

- 不得把 Select 改成浏览器原生 select、系统 picker、滚轮 Picker、Combobox、多选、搜索或带保存成功提示的菜单。
- 不得用静态选择文案、独立 H5 值或 fake success 代替真实父级回写。

## 12. 修改闭环

1. 审计 `select/`、metadata、H5、API、示例、dist 与安装产物。
2. 运行 `node scripts/test-select.js`、Ledger generate/check、`site:build`、`check`、`pack:check`。
3. 实测受控/非受控、0/false、空项、禁用、readonly、打开/选择/取消、390px、主题与外观；真机确认 Popup 层级、rpx、触摸、取消和读屏。
