# NoticeBar 组件语义合同

本文是 PoemUI NoticeBar 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component notice-bar`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

- NoticeBar 是页面内持续可见的公告，不是临时浮层 Message/Toast。
- horizontal 用于单条公告，vertical 用于按间隔轮播的多条公告；业务跳转、关闭、确认、重试与成功结果都必须由父级决定。
- 组件不承担 loading、empty、error、readonly、disabled 或实例方法；这些状态应由页面组合真实 PUI 组件处理。

## 2. 固定结构与区域

```text
pui-notice-bar（status / error 时 alert 根）
├─ prefix-icon（PUI Button + Icon / 同名 Slot）
├─ content（horizontal text 或 vertical swiper + 同名 Slot）
├─ operation（PUI Button / 同名 Slot）
└─ suffix-icon（PUI Button + Icon / 同名 Slot）
```

- 根只承担公告布局、显隐和语义，不创建第二层卡片。
- horizontal 只在真实溢出时按 12px 小段跑马；vertical 必须使用 `content` 数组、原生 swiper 与 `interval`。
- 显隐只使用 max-height、min-height、padding、opacity、transform 的固定 500ms 过渡；`reduceMotion` 为 1ms。禁止 height:auto 或 display:none 瞬移。

## 3. PUI 组合与依赖

- 前后纯图标操作必须用 `pui-button` + `pui-icon`；默认 operation 同样使用 `pui-button`。
- 具名 Slot 内的业务动作由消费者继续使用 PUI Button、Cell、Tag、Loading、Empty 等组件组合。
- 禁止恢复原生 button、关闭专用按钮、custom* 开关、默认 Slot 或以静态事件文案代替真实点击与父级回写。

## 4. Token、间距与排版

- 小程序使用 `--pui-space-xs`、`--pui-space-sm`、`--pui-font-size-small`、`--pui-line-height-small`、`--pui-radius-large`、`--pui-duration-normal` 与 `--pui-ease-standard`。
- horizontal 正文保持单行并由 viewport 裁切，vertical 单项高度为 40rpx；内容过长不可挤压前后操作区。
- 根可使用主题色和 muted Surface，但外观开关只影响真实 Surface，不改变四区顺序、内容宽度或显隐几何。

## 5. 内容、Slot 与组合边界

- 具名 Slot 固定为 `prefix-icon`、`content`、`operation`、`suffix-icon`；没有 default Slot。
- `content` 属性和 content Slot 可共同存在，调用者避免重复；vertical 的属性内容必须是字符串数组，Slot 只补充可见内容，不替代 swiper 的数据源。
- `prefixIcon=false` 与 `suffixIcon=null` 只关闭默认图标；要定制内容时在同名 Slot 内组合真实 PUI 子组件。

## 6. 显隐、滚动与优先级

- `visible` 仅以 null/undefined 表示非受控；false 是有效的受控关闭值。受控时组件等待父级更新，不自行改写 Props。
- `defaultVisible` 只在非受控首次挂载时读取；从受控退回非受控时延续最后实际渲染状态。
- horizontal 的 marquee 仅在 `marquee` 有效、内容溢出、未启用低动效且 loop 非 0 时运行；vertical 不运行 marquee。
- error 为 assertive，其余主题为 polite；主题不会伪造错误处理或成功结果。

## 7. 交互、受控边界与事件

- 公开事件只有 `click` 与 vertical `change`。click detail 的 trigger 固定为 `prefix-icon`、`content`、`operation` 或 `suffix-icon`；vertical change detail 固定为 `{ current, source: 'swiper' }`。
- 点击 suffix-icon 不会自动关闭；父级若希望关闭，必须在 click 中把受控 `visible` 回写为 false。operation 同理不自动导航。
- 没有 input、open、close、operation、marqueestart、marqueeend 事件，也没有 open()、close()、restartMarquee() 方法。

## 8. 可访问性

- 根使用 status，error 使用 alert；ariaLabel 为空时按 content 与“通知”回退。
- 前后图标按钮各自有可访问名称，内容交互根和 operation 也必须可辨识；Slot 子树保留自身语义。
- `reduceMotion=true` 与系统低动效都停止跑马并将显隐压缩为 1ms，不删除正文或可操作区域。

## 9. H5 预览与跨端一致性

- H5 必须用共享 PUI Button/Icon 镜像前后图标和操作区，并真实测量 DOM 溢出；不得使用固定百分比或无限 CSS animation 冒充跑马。
- 官网按“基础用法 / 组件状态 / 滚动内容 / 内容区域 / 受控显隐”分区；基础 WXML 不出现 `bind:*`，完整事件只在 API 表说明。
- H5 的 suffix-icon 点击要真实回写本页 visible，operation 只回写父级请求描述，不伪造跳转或业务成功。

## 10. 响应式、主题与视觉配置

- 390px 下前后操作区不收缩，正文在可用 viewport 内裁切或轮播，页面与 PreviewDevice 不得出现横向溢出。
- light/dark 与边框、阴影、毛玻璃、大圆角、渐变必须在真实 Notice Surface 与 PUI 子按钮上可见；低动效不改变可访问名称或事件。
- 渐变只属于页面、Stage 或 PreviewDevice 画布，不能为 NoticeBar 再造一层装饰 Surface。

## 11. 明确禁止

- 禁止恢复 `icon/showIcon/customIcon/closable/wrap/pauseOnTouch/operationIcon/customContent/customOperation/disabled/duration/marqueeDuration/easing` 等历史公开 Props。
- 禁止恢复 default Slot、生命周期/跑马过程事件、关闭事件、input 事件、实例方法、自动关闭或业务成功文案。
- 禁止用原生 button 取代 PUI Button/Icon，禁止只更新提示文字来模拟 click/change，禁止将 H5 私有行为写为小程序能力。

## 12. 修改闭环

1. 同步审计 `notice-bar/` 四件套、所有 `pui-notice-bar` 消费者、`miniprogram_dist/notice-bar/`、metadata、H5 helper/styles、API/兼容文档、示例和本合同。
2. 运行 `node scripts/test-notice-bar.js`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`；涉及微信产物时运行 Developer Tools `build-npm`。
3. 浏览器实际验证 horizontal/vertical、真实溢出跑马、click trigger、vertical change、受控 false、退控、数组/空字符串/false 边界、500ms/1ms、light/dark、全部视觉开关与 390px。
4. 更新 NoticeBar Feedback Ledger；真机必须保留 swiper、SelectorQuery、rpx、Slot 投影、样式隔离、读屏和系统低动效风险。

本次对照依据为 2026-07-20 在线访问的 [TDesign NoticeBar 页面](https://tdesign.tencent.com/miniprogram/components/notice-bar)、[官方仓库](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/notice-bar) 与固定 `tdesign-miniprogram@1.15.3` 包内 `miniprogram_dist/notice-bar/{props.js,type.d.ts,notice-bar.js,notice-bar.wxml,notice-bar.wxss}`。
