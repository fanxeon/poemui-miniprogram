# Progress 组件语义合同

本文是 PoemUI Progress 的长期设计与实现合同。修改前必须查询：

`npm run feedback:list -- --component progress`

完整 API 以 `docs/COMPONENT_API.md` 为准。

## 1. 组件定位与公开边界

- Progress 只展示父级已知的确定任务完成度，不推进任务、不报告业务成功，也不承载请求状态。
- 未知进度、业务 loading/error/retry 由父级组合 PUI Loading、Empty、Result、Button；100% 视觉 success 不能等同任务成功。

## 2. 固定结构与区域

- line/plump 由轨道、已完成条和可选读数组成；circle 由轨道、双半圆进度和可选中心读数组成。
- `label` 控制可见读数，唯一 `label` Slot 只附着读数；没有 default Slot、Events 或 Methods。

## 3. PUI 组合与依赖

- success/warning/error 图标必须复用 `pui-icon`；进度本体保持只读，不内嵌 Button、Loading、Empty 或业务反馈壳。
- H5 的推进/重置入口使用共享 PUI Button，仅修改父级 percentage Props。

## 4. Token、间距与排版

- percentage 为 0–100；size 为 80–320rpx，strokeWidth 为 4–48rpx，环形 stroke 不超过外径三分之一；无效值回退安全边界。
- 色彩使用安全 Token，非法 color/trackColor 不得注入 style。进度变化默认 500ms，reduceMotion 1ms，使用全局 duration/easing Token。
- Progress 是展示叶子，轨道、圆环与读数禁止外投影；预览使用 `shadow-safe` 父布局而非页面私有 margin。

## 5. 内容、Slot 与组合边界

- 只有 `label` Slot，适合极短 PUI Icon/Tag 补充；`label=false` 或空字符串时读数和 Slot 同时隐藏。
- 父级负责任务上下文、业务状态和 Retry；Slot 不能把 Progress 变为长说明、操作或状态容器。

## 6. 状态与优先级

- 合法显式 status 优先；否则 percentage=100 推导 success，其余为 active。status 只改颜色/Icon。
- 没有 loading、empty、error、retry、paused、indeterminate、disabled、readonly 或受控/非受控状态。

## 7. 交互、受控边界与事件

- percentage 完全由父级持有；组件不缓存初值、不自行递增、不派发 change/complete/animationend、无实例方法。
- H5 演示只通过父级回写生成视觉变化，不能借提示文字或动效完成伪造业务成功。

## 8. 可访问性

- 根为 `role=progressbar`，包含 0/100 上下界、当前值、aria-valuetext 和由 ariaLabel/可见读数组成的名称。
- label 隐藏和低动效不得删除数值读屏语义或标记 busy。

## 9. H5 预览与跨端一致性

- H5 line/plump 使用真实宽度变化，circle 以 SVG stroke-dashoffset 镜像 WXML；SVG 不是新公开能力。
- Overview 以基础用法/形态/状态与颜色/label Slot 分区，基础 WXML 零 bind:*；使用 `shadow-safe`，禁止私有 margin、裸按钮或静态占位。

## 10. 响应式、主题与视觉配置

- 390px 下 Progress、读数、Button 和 Slot 自然收缩或换行，页面没有横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变由全局 Token 提供，不改变 percentage、状态推导或 500ms/1ms 合同。

## 11. 明确禁止

- 禁止恢复 value 别名、indeterminate、业务 loading/error/empty/retry、私有 duration/easing、循环动画、change/complete/animationend 或 getProgress()。
- 禁止用 100%、动画完成、fake success、静态占位或组件内计时器宣称任务完成；禁止把 label Slot 当长说明容器。

## 12. 修改闭环

1. 审计 `progress/`、Icon 依赖、metadata、H5、API、示例、dist 与安装产物；2026-07-20 TDesign 对照固定为 `tdesign-miniprogram@1.15.3`。
2. 运行 `node scripts/test-progress.js`、Ledger generate/check、`site:build`、`check`、`pack:check` 与示例安装检查。
3. 浏览器验证 0/100/无效值、形态、label、500ms/低动效、390px、主题与外观；真机确认圆环合成、rpx、Slot 与读屏。
