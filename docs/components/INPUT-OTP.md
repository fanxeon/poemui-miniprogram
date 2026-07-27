# InputOTP 组件语义合同

本文是 PoemUI InputOTP 的长期设计与实现合同。修改源码、H5、示例、元数据或 Token 前必须查询：

`npm run feedback:list -- --component input-otp`

完整 Props、Events、Slots 与 Methods 以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位

- InputOTP 是分格验证码输入，不是普通 Input 的视觉变体，也不承担验证码校验、倒计时、远端验证或登录成功状态。
- 调用方持有 `value`；组件只采集、规整和回传验证码。

## 2. 固定结构与区域

- 固定渲染 `length` 个输入格和条件错误文案；length 规整为 1–8，格数变化不能残留旧格。
- 每一格是组件自身的输入交互根；错误区只在真实错误时出现，不建立第二层 Surface。

## 3. PUI 组合与依赖

- 输入格属于基础组件交互根，可使用平台 input；不额外嵌 PUI Input 造成双焦点和双边框。
- 调用方在外部组合 PUI Button、Loading、Result 等业务能力，组件内部不得伪造提交成功。

## 4. Token、间距与排版

- 格间距、边界、圆角、字体、焦点与错误色均消费 InputOTP Token；不能用页面私有尺寸压缩验证码格。
- 空输入格必须使用 `--pui-bg-muted` 保持可见；全局 `bordered=false` 只隐藏中性边界，不能让空格与页面背景融为一体。聚焦格恢复容器 Surface 并显示品牌边界，错误边界优先于普通状态。
- 默认动效 500ms、最大 1000ms，reduceMotion 为 1ms；不对 `height:auto` 动画。

## 5. 内容、Slot 与组合边界

- 无业务内容 Slot；`placeholder`、`mask` 与错误文案是组件公开内容，不允许用 Slot 覆盖格的焦点、值和可访问名称。
- type 仅接受 `text/number/digit/idcard/safe-password`，mask 映射平台 password 行为。

## 6. 状态与优先级

- disabled 阻断输入、粘贴、键盘改值和聚焦请求；error 只显示 `errorMessage` 或默认错误文案，不自行判定验证码是否正确。
- 空字符串是有效清空结果；0、false 等原始边界不能以 truthy 判断丢失。

## 7. 交互、受控边界与事件

- `value` 是唯一真相源：输入或粘贴从当前格连续填充，先发 `input → change`，填满后再发 `complete`；父级回写后才是最终视图。
- focus 只请求首个或实际目标格，focus/blur detail 返回真实 index；左右箭头与 Backspace 只移动或清理真实格。
- H5 必须经 `updateCurrentProp('value')` 走同一父级回写路径，禁止维护独立最终 cells。

## 8. 可访问性

- 每格具有顺序可理解的可访问名称、输入类型和错误关联；键盘操作不应越出 1–8 个真实格。
- 密码掩码不以不可读状态文字代替输入值，错误不能只靠颜色表达。

## 9. H5 预览与跨端一致性

- H5 的每格输入、粘贴、左右键和 Backspace 必须真实可操作，Overview 只展示输入与结果，不展示工程事件卡。
- 使用 `shadow-safe` PreviewDevice 父布局，禁止通过页面私有 margin 修复阴影裁切或用原生单输入框冒充多格 OTP。
- 系统一次性验证码自动填充、微信 password 键盘与读屏属于真机风险，H5 不得伪称覆盖。

## 10. 响应式、主题与视觉配置

- 390px 下格数、提示和错误文案必须在设备内收缩或换行，页面无横向溢出。
- light/dark、边框、阴影、毛玻璃与大圆角只使用全局 Token，不改变输入顺序、格数或父级回写。
- 边框关闭时仍以 muted Surface 表达输入命中区；这属于控件可识别性，不是额外 Card 或外阴影。

## 11. 明确禁止

- 不得把验证码校验、倒计时、登录、远端 loading/error/retry 或成功 toast 塞入组件。
- 不得以单个原生 input、静态格子、独立 H5 cells、fake complete 或 display:none 替代真实分格输入。

## 12. 修改闭环

1. 审计 `input-otp/` 四件套、metadata、H5、API、示例、dist 与安装产物。
2. 运行 `node scripts/test-input-otp.js`、Ledger generate/check、`site:build`、`check` 与 `pack:check`。
3. 浏览器验证输入、粘贴、受控回写、0/空值、disabled、错误、500ms/低动效、390px、深浅色和外观开关；保留真机输入法风险。
