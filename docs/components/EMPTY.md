# Empty 组件语义合同

本文是 PoemUI Empty 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component empty`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

## 1. 组件定位

- Empty 只表达“这里没有可展示内容”，并提供图形、说明和由消费者决定的下一步入口位置。
- 它适用于列表、搜索、筛选、权限范围与局部内容区域的空结果；进行中使用 Loading，确定失败与重试由父级状态区组合 Empty 加 PUI Button。
- 它不负责请求成功、错误、重试、默认业务跳转、操作锁定或图片事件透传；这些是父级或内部 PUI Image 的职责。

## 2. 固定结构与区域

```text
pui-empty（透明 status 根）
├─ visual
│  ├─ pui-image（image 非空）
│  ├─ pui-icon（否则 icon 有效）
│  └─ image Slot（否则）
├─ description（description 文本 + description Slot）
└─ actions（action Slot）
```

- 图形严格按 `image → icon → image Slot` 选择；说明与操作区保持稳定的布局容器，不以 `display:none` 制造动效瞬移。
- 根只承担纵向布局、语义和淡入，不建立卡片、边框、阴影或第二层背景。
- `action` 区为空时不应留下可见间距；父级状态区可以在 Empty 后放置自己的 PUI Button，但不把按钮能力收回 Empty。

## 3. PUI 组合与依赖

- 图片分支必须复用 `pui-image`，图标分支必须复用 `pui-icon`；`action` Slot 中的操作必须由消费者使用 `pui-button` 组合。
- Empty 是展示型布局根，可以使用 `view/text/slot` 实现自身语义和排版。
- 禁止恢复内部默认 Button、原生 button、图片事件转发、默认 Slot 或私有业务回调。

## 4. Token、间距与排版

- 小程序使用 `--pui-space-normal`、`--pui-space-sm`、`--pui-space-xxl`、`--pui-font-size-medium`、`--pui-line-height-medium`、`--pui-text-secondary`、`--pui-duration-normal` 与 `--pui-ease-standard`。
- 图形与说明使用 normal 间距，说明与 action 使用 xxlarge 分区间距，action 内使用 small gap；H5 使用同名 Preview Token 的 1:2 近似值。
- 根保持透明；圆角、边框、阴影、毛玻璃与背景只属于内部实际 PUI Image、Slot 内容或父级状态 Surface。

## 5. 内容、Slot 与组合边界

- `image` Slot 只在 image/icon 都为空时显示；`description` Slot 追加或替代说明；`action` Slot 承接下一步入口。
- 父级只管理自己的状态布局、可见按钮与业务回写，不能穿透修改 Image/Icon/Button 的尺寸、内距、圆角、主题或交互几何。
- Empty 没有默认 Slot。Tag、Cell 等补充内容应进入有明确职责的具名区域，不能靠默认 Slot 增加未知结构。

## 6. 状态与优先级

- Empty 自身没有 loading、error、retry、selected、disabled、readonly 或成功状态。
- 图形优先级为 image、icon、image Slot；说明为空时仍保持可访问名称回退，不伪造标题。
- 父级的 `error > loading > content > empty` 状态机必须在父组件中决定；错误态的重试按钮是 Empty 的兄弟或 action Slot 内容，点击后只请求父级更新。

## 7. 交互、受控边界与事件

- Empty 没有受控/非受控状态、公开 Events 或实例 Methods。
- `action` Slot 中 Button 的 click、loading、disabled、事件顺序和父级回写完全由消费者合同决定；Empty 不二次转发或伪造 action。
- `pui-image` 的 load/error 属于 Image 组件；Empty 不监听后再发布同名事件。

## 8. 可访问性

- 根使用 `role=status`；`ariaLabel` 为空时按 description、`空状态` 回退。
- 图形容器不重复朗读；Image/Icon 或 Slot 内容分别保留自身真实辅助语义。
- Empty 不可聚焦，也不提供键盘操作；action Slot 内 PUI Button 自行提供可访问名称与键盘能力。
- `reduceMotion=true` 与系统低动效都将 500ms 进入过渡压缩为 1ms，不截断关键说明文字。

## 9. H5 预览与跨端一致性

- H5 使用共享 PUI Icon、PUI Image、PUI Button 镜像，严格保持 image/icon/slot 优先级和零 Events/Methods。
- 官网按“基础用法 / 图形内容 / 具名 Slot / 低动效”分区；基础 WXML 为 `<pui-empty description="暂无内容" />`，不展示任何 `bind:*`。
- 标准概览使用 `PreviewDevice` 的 `shadow-safe` 父布局；Empty 根透明，只有实际 Image、Slot Button 或父级状态区可成为 Surface。
- 浏览器 Image 加载失败只验证内部 Image 回退，不宣称为微信的 Empty error 事件；Slot 投影、rpx、读屏和系统低动效仍需真机确认。

## 10. 响应式、主题与视觉配置

- 390px 下说明、Slot 和 action 可自然换行，页面与 PreviewDevice 不得横向溢出。
- light/dark 与边框、阴影、毛玻璃、大圆角、渐变由 ConfigProvider 和实际子 Surface 承接；透明根不因开关获得额外卡片壳。
- `shadow=on` 不得给 Empty 根增加外投影；图形、action Slot 或父级状态 Surface 的视觉边界仍由各自合同承担。
- 全局主题不改变图形优先级、说明、Slot、500ms/1ms 动效或父级业务边界。

## 11. 明确禁止

- 禁止恢复 title、size、theme、imageMode、imageSize、customImage、actionText、actionIcon、showAction、actionLoading、actionDisabled、duration、easing 等历史公开 Props。
- 禁止恢复 default Slot、Empty 的 action/load/error 事件、实例方法、内部重试 Button、假成功或静态事件反馈。
- 禁止用原生 img/button 代替 PUI Image/Button，禁止通过 `display:none`、`height:auto` transition 或超过 500ms 的动效伪造状态切换。
- 禁止把父级 error/retry 的状态机迁入 Empty，或因为 H5 能加载图片就宣称微信资源、事件和读屏已确认。

## 12. 修改闭环

1. 同步审计 `empty/` 四件套、所有 `pui-empty` 消费者、`miniprogram_dist/empty/`、metadata、H5 helper/styles、API/兼容文档、示例和本合同。
2. 运行 `node scripts/test-empty.js`、`npm run site:build`、`npm run check`、`npm run pack:check`、`npm run example:install`；涉及微信产物时运行 Developer Tools `build-npm`。
3. 浏览器实际验证图形优先级、空字符串、对象 icon、真实 Image 成功/失败、action Slot 的父级回写、180ms/1ms、light/dark、全部视觉开关与 390px。
4. 更新 Empty 的 Feedback Ledger；真机必须保留 rpx、图片解码/域名、Slot 投影、样式隔离、读屏和系统低动效风险。

本次对照依据为 2026-07-20 在线访问的 [TDesign Empty 页面](https://tdesign.tencent.com/miniprogram/components/empty)、[官方仓库](https://github.com/Tencent/tdesign-miniprogram) 与固定 `tdesign-miniprogram@1.15.3` 包内 `miniprogram_dist/empty/{props.js,type.d.ts,empty.js,empty.wxml,empty.wxss}`。
