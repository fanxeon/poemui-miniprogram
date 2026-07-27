# CountDown 语义合同

## 1. 组件定位

CountDown 用于展示从给定毫秒数归零的剩余时间。它是一个可暂停、重置和读取的计时展示组件，不是业务状态机：组件只发布时间变化与自然结束，登录、抢购、提交或刷新等后续动作必须由父级真实处理。

## 2. 公开合同

- Props：`time/autoStart/paused/content/format/millisecond/size/theme/splitWithUnit/ariaLabel/reduceMotion`。
- Events：`change/finish`。
- Slots：默认 Slot，仅在 `content="slot"` 时接管可见内容；计时仍在组件内部继续。
- Methods：`start()/pause()/reset()/getTime()`。

时间快照固定包含 `{time,days,hours,minutes,seconds,milliseconds,totalHours,totalMinutes,totalSeconds,formatted}`。`time=0`、`autoStart=false`、`paused=false` 和空格式字面量都是有效输入，不得用真假值回退吞掉。

## 3. 时钟与状态

- 运行时保存 `targetTime`，每次 tick 使用 `targetTime - Date.now()` 重算剩余时间，不按定时器次数递减。
- 非毫秒模式向上取整到下一秒，避免归零前提前显示 `00`；`format` 含 `SSS` 时自动使用毫秒刷新。
- `autoStart` 只决定挂载、time 更新和 reset 后是否启动，不是持续运行策略；运行中把它改为 false 不得突然暂停。
- `paused` 是声明式暂停控制。true 立即冻结当前剩余时间；恢复 false 时只恢复由该属性造成的暂停，即使运行期间 autoStart 已改为 false 也不偷停。初始 autoStart=false 的时钟不会因 paused 从 true 改回 false 而自行启动。
- 自然归零时先派发最后一次 `change`，再派发一次 `finish`。挂载 time=0 或 reset 到 0 不伪造 finish。
- `start()`/`pause()` 在状态不允许时返回 false；`reset()` 返回规整后的初始毫秒数；`getTime()` 返回实时校正后的剩余毫秒数。

## 4. 显示与动效

- `format` 支持 `DD/HH/mm/ss/SSS` 和字面量；未出现更高位 token 时，`HH/mm/ss` 分别表达总小时、总分钟和总秒。
- `splitWithUnit=true` 只给数字 token 追加天、时、分、秒、毫秒，字面量仍保留。
- `theme` 仅支持 `default/round/square`；`size` 仅支持 `small/medium/large`，非法值回退默认。
- 数字变化使用固定 500ms；`reduceMotion` 或系统低动效压缩为 1ms。不得重新公开 duration/easing，也不得以 display:none 或 height:auto transition 制造状态跳变。
- `role=timer` 与 ariaLabel 必须始终包含可读的剩余时间。

## 5. H5 镜像与演示

- 概览固定按“基础用法 / 主题与尺寸 / 单位与毫秒 / 控制与自定义内容”分区。
- 基础 WXML 只展示完成任务所需 Props，零 `bind:*`；change/finish 只进入 API Events 与事件专项示例。
- Start、Pause、Reset、读取剩余必须调用共享 PUI Button，并真实调用同一 H5 时钟；状态文本展示真实方法结果，不以静态提示冒充操作。
- `content="slot"` 的演示组合真实默认 Slot；H5 不恢复已删除的 prefix/suffix 或完成文案捷径。
- API 完整展示 11 Props、2 Events、1 Slot、4 Methods，所有表格文字自然换行且禁止省略号。

## 6. TDesign 1.15.3 对照决定

- 参考官方 CountDown 文档与 `tdesign-miniprogram@1.15.3` 安装包的 props、WXML/WXSS、类型和实现源码。
- 借鉴 `autoStart/content/format/millisecond/size/splitWithUnit/theme/time`、`change/finish` 与 `start/pause/reset` 主干，以及 `default/round/square` 主题语义。
- PoemUI 保留声明式 `paused`、`ariaLabel`、`reduceMotion` 和 `getTime()`，用于父级控制、无障碍、统一动效和真实剩余时间读取。
- 不照搬独立 content 文案约束；PoemUI 的 `content="slot"` 明确启用默认 Slot，保持小程序组合能力。

## 7. 明确禁止

- 禁止恢复 `finishText/customContent/pauseOnHidden/duration/easing`、prefix/suffix Slot、`start/pause/reset` 生命周期事件或 `restart()/getRemaining()`。
- 禁止在基础示例绑定全部事件，或让 `autoStart=false` 充当运行中的暂停命令。
- 禁止用 setInterval 次数累减、虚构 finish、静态成功文案或 H5 专属能力代替真实计时。
- 禁止把业务按钮、抢购结果或请求状态塞入 CountDown 内部。

## 8. 验收与真机风险

- 验证 time 0/负值/上界、autoStart、paused、毫秒、格式总量语义、三种主题、三种尺寸、单位、Slot 和方法返回值。
- 验证 change→finish 顺序、finish 单次、reset 不伪造 finish、后台节流恢复后的目标时间校正和 1ms 低动效。
- 验证 390px、light/dark、边框、阴影、毛玻璃、大圆角、渐变、API 全文与无页面级横向溢出。
- 微信真机仍需复核后台/前台调度、50ms 毫秒刷新功耗、系统低动效、辅助技术播报频率和长时倒计时精度。

## 9. 修改闭环

后续修改前先运行 `npm run feedback:list -- --component count-down` 并阅读命中的原始 Ledger；同步检查四件套、H5、metadata、API、示例、专项测试、`miniprogram_dist` 与安装产物。完成后更新 Ledger、进度文档并复跑完整门禁。

## 10. 2026-07-27 单位防挤压

`splitWithUnit` 的数字与日/时/分/秒单位构成不可拆分行内组：segments 不换行、单位 `nowrap`、各段不收缩。小程序和 H5 必须同步，见 `count-down/count-down.wxss`、`preview/styles.css`、`PUI-FB-0436`。
