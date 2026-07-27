# Rate 组件语义合同

本文是 PoemUI Rate 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component rate`

当前对照基线为 TDesign Mini Program 1.15.3 的 Rate 文档与 npm 源码。参考不等于复制；公开合同只保留 PoemUI 能在微信原生端、H5、文档和测试中真实闭环的能力。

## 1. 组件定位

- Rate 用于提交一项 0 到 `count` 的星级评分，支持点击与连续拖动、整星与半星。
- 它只表达评分值请求，不负责评论、提交成功、业务结果或加载/空/错误/重试状态。
- Props 固定为 `value/defaultValue/count/size/gap/color/allowHalf/showText/texts/disabled/readonly/ariaLabel/reduceMotion`；Events 仅 `change`；0 Slots、0 Methods。

## 2. 固定结构与区域

```text
Rate(slider)
├─ Stars
│  └─ Star × count
│     ├─ Base PUI Icon
│     ├─ Clipped active PUI Icon
│     └─ Half/whole hit zones
└─ Text(optional)
```

- 星标、裁切层和触点属于 Rate 自身；文案只在 `showText=true` 时进入根。
- Tag、Cell、说明或提交 Button 必须作为兄弟组件组合，不进入 Rate 根。

## 3. PUI 组合与依赖

- 视觉必须使用内部 `pui-icon name="star"`，不得复制 SVG、字符星号或私有图标。
- 每颗星使用一个低透明度基础 Icon 与一个激活 Icon；半星仅裁切激活层宽度。
- H5 调用共享 `iconComponent` 镜像同一双层结构；组件自身命中区可使用平台原生交互根，不机械包裹 PUI Button。

## 4. Token、间距与排版

- `size` 限制为 24–96rpx，`gap` 限制为 0–32rpx；拖动位置换算必须消费同一 gap。
- 组件内间距、正文小号字体、主题文字色和标准 easing 使用 PUI Token，不增加第二套 Surface。
- 星色、裁切、文案和锁定态固定 500ms；`reduceMotion=true` 压缩为 1ms，不公开 `duration/easing`。

## 5. 内容、Slot 与组合边界

- `texts` 按评分向上取整映射；0 分或缺失项回退当前数值。
- Rate 不提供 Slot。复杂业务状态由消费者在相邻区域组合，并从同一父级评分值读取。
- 不得把兄弟 Tag、成功文字或提交反馈塞回组件，避免视觉状态与真实业务状态分裂。

## 6. 状态与优先级

- 交互优先级为 `disabled > readonly > interactive`；disabled 与 readonly 均阻断点击、拖动和 change，但语义独立。
- `count` 取整并限制为 1–10；评分限制在 `0..count`。`allowHalf=false` 时取整，开启时按 0.5 规整。
- `color` 只接受 `#RGB/#RRGGBB/rgb(r,g,b)` 且 rgb 通道必须为 0–255；非法值回退当前主题强调色。
- Rate 没有 loading、empty、error 或 retry，不为验收清单伪造不属于该输入组件的状态。

## 7. 交互、受控边界与事件

- `value !== null && value !== undefined` 时受控，数字 0 合法；父级回写前不确认受控视觉值。退控后保留最后一次受控渲染值。
- `defaultValue` 只初始化非受控状态；后续用户交互不被重复覆盖。
- 每颗星保留真实左右半星触点；横向移动超过 4px 后进入拖动，连续请求所在整星/半星，并抑制拖动后的重复 tap。
- 相同值不重复触发。`change.detail` 固定为 `{ value, source }`，`source` 仅为 `tap/drag`；不重复发布 `input`，不提供实例写方法。

## 8. 可访问性

- 根使用 slider 语义，并同步 `aria-label/valuemin/valuemax/valuenow/valuetext/disabled/readonly`。
- 可写命中区提供完整“n 星”名称；静态文档示例必须标为只读且不保留无响应的假按钮。
- 文案允许自然换行，不使用 ellipsis、nowrap 或固定高度裁掉完整评分信息。

## 9. H5 预览与跨端一致性

- H5 使用同一数值规整、颜色白名单、点击/Pointer 拖动、受控回写与 180ms/1ms 合同。
- 概览固定分为“基础用法 / 半星与文案 / 尺寸与间距 / 状态与受控”。基础 WXML 为 `<pui-rate></pui-rate>` 且零 `bind:*`。
- API 完整显示 13 Props、1 Event、0 Slots、0 Methods；不裁切任何表格文字。
- 标准预览使用 `shadow-safe` 父布局，不建立 edge-to-edge、私有手机壳或组件外 Surface。

## 10. 响应式、主题与视觉配置

- 390px 下 10 颗大尺寸星标允许组件内部自然换行或局部收敛，但不得制造页面级横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变背景必须可读；Rate 自身透明，不把全局视觉开关误解释为评分 Surface。
- 半星必须以双层 PUI Icon 裁切实现，不能用固定背景色遮右半边，否则毛玻璃、渐变和深色背景会露出色块。

## 11. TDesign 取舍与明确禁止

- 保留 TDesign 1.15.3 的 `allowHalf/color/count/disabled/gap/showText/size/texts/value/defaultValue`、单一 `change` 和触摸拖动主干。
- PoemUI 增加 `readonly/ariaLabel/reduceMotion`；拒绝会绕过 Icon 资源合同的 `icon/iconPrefix`、依赖临时提示浮层的 `placement`、以及当前单一 Star 资源无法真实支持的 outline/filled `variant`。
- 明确禁止恢复重复 `input`、默认 Slot、私有 `duration/easing`、背景遮罩半星、无响应静态按钮或 fake success。
- 明确禁止 `display:none` 瞬移、`height:auto` transition 和超过 500ms 的动效。

## 12. 修改闭环

1. 同步审计 `rate/`、PUI Icon 依赖、`index.js`、metadata、H5、Props、WXML、API、兼容说明、`_example`、`miniprogram_dist` 与 npm/微信安装产物。
2. 运行 `node scripts/test-rate.js`、原生控件边界、组件合同、`npm run site:build`、`npm run check` 和 `npm run pack:check`。
3. 浏览器真实点击、Pointer 拖动、键盘、受控/非受控、0/false/空字符串、disabled/readonly、180/1ms、390px、light/dark 与全部视觉开关。
4. 产物变化后运行 `npm run example:install` 并校验源码、dist、示例安装与 tarball；微信 CLI 失败时保留 `pending-cli`，不得手工冒充成功。

真机仍需复核微信 touchmove 采样、rpx/px gap 换算、Canvas Icon 着色、样式隔离、slider 与内部 button 的读屏朗读和系统低动效。任何不能满足本文的实现必须写入 Ledger，不得静默绕过。
