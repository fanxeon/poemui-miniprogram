# Swiper 组件语义合同

本文是 PoemUI Swiper 的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component swiper`

Props、事件和方法的完整清单以 `docs/COMPONENT_API.md` 为准；本文不复制完整 API 表。

当前公开合同固定为 26 Props、7 Events、0 Slots、1 个 `swiper-slide` Generic 和 7 Methods；任何增删都必须重新完成 TDesign 对照、专项测试和真实浏览器 battle。

## 1. 组件定位

- Swiper 用于在有限视口中按顺序切换一组同层级内容，底层必须使用微信原生 `swiper`。
- Swiper 不是自由页面容器、相册请求器或业务状态面板。筛选、标题、Footer 和业务操作放在组件外组合。
- 默认条目适合图片、标题和简短说明；结构差异较大的条目使用 `swiper-slide` Generic，不再用 Header/Footer/Default Slot 扩张组件边界。
- `swiper` 与 `shadcn-swiper` 路由映射同一个原生实现，不创建第二套适配组件。

## 2. 固定结构与区域

```text
Swiper(role=region)
└─ Viewport
   ├─ Content layer
   │  ├─ native Swiper
   │  │  └─ Slides / swiper-slide Generic
   │  └─ Navigation（dots / dots-bar / fraction / controls）
   ├─ Loading layer
   ├─ Error layer + Retry
   └─ Empty layer
```

- Viewport 是唯一 Surface、裁切与状态切换边界，不增加 Header/Footer/Extra 面板。
- `error/loading/content/empty` 四层持续挂载，通过固定 500ms、低动效 1ms 的 opacity/transform 过渡，不对 `height:auto` 动画，不用 `display:none` 制造瞬移。
- `duration` 只控制 swiper 项切换，状态层固定使用 PUI motion Token；二者不能互相覆盖。
- H5 使用 Pointer Events、transform 和循环克隆项镜像原生 swiper，不用 scroll-snap 或横向滚动列表冒充。

## 3. PUI 组合与依赖

- 默认条目组合 PUI Image、Icon 和 Tag；纯图标控制按钮固定调用 PUI IconButton（PUI Button + Icon 镜像），不得让空文字节点占据 gap。
- loading 必须组合 PUI Loading；默认 empty/error 必须组合透明嵌入式 PUI Empty；Retry 使用 Empty 的 PUI Button Action。
- Swiper、Slide 与分页命中区属于 Swiper 自身底层交互根，可以使用平台原生节点；不得为了消除原生节点再包无意义 Button。
- Image 只透传其当前真实合同：`src/mode/width/height/shape/ariaLabel/reduceMotion` 和资源事件；禁止恢复已删除的 `clickable/duration/easing`。

## 4. 数据、Generic 与内容边界

- `items` 固定对象 schema 为 `{ value, title, description, image, icon, tag, tagTheme, theme, disabled, ariaLabel }`；不再公开 `itemKey/titleKey/descriptionKey/imageKey` 字段别名。
- 标量项直接把标量同时作为原始 value 和可见 title，必须保留 `0`、`false` 与空字符串的类型和值。
- 对象未提供 value 时才回退索引；标题缺失时回退序号，不用真假值判断吞掉0或false。
- `customItem=true` 时启用 `swiper-slide` Generic，并传入 `item/index/value/active/title/description`；默认 Generic 仍为 PUI Card。
- 删除 Header、Footer 与 Default Slot。业务标题、说明、状态摘要和额外操作一律在 Swiper 外组合。

## 5. Navigation 合同

- `navigation=false` 隐藏分页和控制；`true` 使用默认 dots。
- Object 固定支持 `{ type, position, showControls, minShowNum }`：`type=dots|dots-bar|fraction`，`position=inside|outside`，`showControls` 控制两侧 PUI IconButton，`minShowNum` 控制至少多少项才出现导航。
- 不再暴露 `indicatorDots/indicatorColor/indicatorActiveColor/indicatorPosition/showArrows/showCounter` 六套平行开关；主题颜色来自 PUI Token。
- 分页和 controls 共享同一导航配置与 current 真相源，不得各自维护索引。
- 小程序 WXML 的 fraction 与非 fraction 分页固定使用相邻、各自完整的 `wx:if` 分支；不得让带 `wx:for` 的节点以 `wx:else` 跟随 `<block wx:if>`，以保证微信上传编译器也能解析。

## 6. 状态、自动播放与门禁

- 固定优先级为 `error > loading > content > empty`。状态异常与 `disabled/reduceMotion` 时停止自动播放。
- `autoplay=false` 为克制默认；启用后触摸开始自动暂停、结束恢复，不再把内部安全行为暴露为 `pauseOnTouch`。
- `disableTouch` 只关闭手势，仍允许 Navigation controls、分页和实例方法；`disabled` 阻止全部点击、切换、Retry 与写方法。
- 删除 `readonly`：Swiper 没有可编辑字段，展示锁定由 `disableTouch` 表达，整体不可用由 `disabled` 表达。
- Retry 只发布请求并保持 error，直到父级真实更新 error/loading/items。

## 7. 受控边界、事件与方法

- `value !== null/undefined` 为受控；所有切换只按 `input → change` 请求父级回写。非受控初始化和退控分别读取 defaultValue 与最新受控值。
- value 采用严格相等，数字0、布尔false、空字符串和字符串"0"不得混淆。
- `click` 只表达真实条目点击；disabled 条目静默。删除高频、低业务价值的 `transition` 事件。
- `animationfinish`、`image-load/image-error` 只转发真实原生结果，不由 H5 定时器伪造资源成功。
- H5 因 Props 或演示动作重建 DOM 时，同一 `type/index/src` 的缓存图片不得重复发布资源事件；只有 items 真正变化才重置资源报告，非 content 状态不发布图片事件。
- 方法只保留 `select/next/prev/reset/retry/getValue/getState`；删除可由 value 或 select 表达的 `selectIndex`。

## 8. Token、间距与排版

- Viewport 使用 PUI Surface、border、large radius、soft shadow 和 frosted filter Token；全局视觉开关只改变外观，不改变尺寸、索引或 transform 几何。
- `equalSpacing` 对 Swiper 保持单一 Viewport Surface 的边界：由于没有 Header/Content/Footer 或并列结构块，不新增外层 padding/gap，也不把 Slide、分页或控制按钮拆成大间距卡片；内部 Generic/Slide 继续消费自身内容 Token。
- 高度和前后露出距离按 `1px≈2rpx` 镜像；调用者数值经过安全范围规整。
- 标题允许单行裁切、说明最多两行，因为它们是 Slide 内次要摘要；API、状态、事件与操作文案禁止省略。
- 控制按钮、分页和文字安全区必须避开彼此；390px 和多项展示时仍需可点击。

## 9. 可访问性

- 根使用 `role=region`、`aria-roledescription=swiper` 和唯一 `ariaLabel`；每个 Slide 暴露序号、总数、当前态和禁用态。
- loading/error 同步 `aria-busy/aria-invalid`；Navigation 分页使用 tablist/tab 语义，fraction 使用 status。
- H5 视口支持方向键，事件 source 区分 keyboard；小程序不伪造原生不存在的键盘能力。
- `reduceMotion` 把 swiper 与状态过渡压缩到1ms并停止自动播放，不改变事件顺序或当前值。

## 10. H5 预览与演示

- 标准概览固定按“基础用法 / 自动播放与导航 / 方向与多项 / 加载、空与错误”分区。
- 基础 WXML 只包含 `items` 数据入口，零 `bind:*`、零默认 Prop、零工程日志。
- 概览中的 Swipe、Navigation、方法、受控回写、自动播放和 Retry 必须连接同一真实运行态；不得只改提示文字。
- `customItem=true` 的复制代码必须在同一 `usingComponents` 中注册 `swiper-slide` 对应 alias；基础 WXML 同样经过80字符软上限和每行最多3属性的共享格式器。
- 实例方法和事件诊断只进入 API/属性 battle，不作为默认预览内容卡。
- 概览不得渲染 `input/change/animationfinish`、图片资源结果、`getState()` 或“父级已回写”等工程状态文字；轮播切换、分页、受控回写和状态层本身才是可见结果。
- 概览状态按钮改变真实父级 Props 后，必须复用已挂载的四层节点完成 `500ms` 过渡；不得以 `renderStage()` 整段重建跳过中间帧。
- 工具栏和属性页的“重置”必须深拷贝可见演示的三项默认 `items` 与 Navigation；不得复用仅供代码生成比对的空数组 source defaults，更不得把默认概览重置为空态。
- 预览使用 `shadow-safe` 父布局；transform 与前后 margin 不得造成页面级横向溢出。

## 11. TDesign 1.15.3 对照决定

- 2026-07-24 本次名称迁移重新联网访问官方 [Swiper 页面](https://tdesign.tencent.com/miniprogram/components/swiper) 与 [源码目录](https://github.com/Tencent/tdesign-miniprogram/tree/develop/packages/components/swiper)。两处均使用 Swiper / swiper；npm 固定版本页面本次返回 403，因此未将动态页面结果替代既有的 `tdesign-miniprogram@1.15.3` 包内源码证据，也未借此改动 API。
- 2026-07-22 实际联网查询官方 Swiper 页面 <https://tdesign.tencent.com/qq-miniprogram/components/swiper>、官方仓库 <https://github.com/Tencent/tdesign-miniprogram> 与 npm 发布包 `tdesign-miniprogram@1.15.3`；官网页面用于示例和产品信息，固定包用于可复现 API。
- 实际读取固定包的 `miniprogram_dist/swiper/props.js`、`swiper.js`、`swiper.wxml`、`swiper.wxss`、`type.d.ts`，以及 `miniprogram_dist/swiper-nav/props.js`、`swiper-nav.js`、`swiper-nav.wxml`、`swiper-nav.wxss`、`type.d.ts`。
- 借鉴 `autoplay/current/direction/duration/easingFunction/height/interval/list/loop/navigation/margins/displayMultipleItems`，以及 SwiperNav 的 `dots/dots-bar/fraction/showControls/minShowNum` 单一配置思路。
- PoemUI 保留原始 value 受控/非受控、error/retry、disabled、Generic、ARIA 与低动效，因为它们已有真实父级闭环并适合数据驱动组件。
- 不照搬 `imageProps` 任意对象、external class、六向分页定位和 `snapToEdge`；这些入口会绕过 PoemUI Image/Token 或增加低频平台细节。
- 不以 Props 数量接近为目标；旧 42 Props 中字段别名、平台优化、分页颜色、显示文案、自由 Slot、readonly 和内部触摸暂停开关均被收敛。

## 12. 明确禁止

- 禁止恢复四个字段 Key Props、Header/Footer/Default Slot、`readonly/pauseOnTouch/skipHiddenItemLayout` 或六个分页平行开关。
- 禁止恢复 `transition` 事件、`selectIndex` 方法、私有 Spinner/Empty、字符箭头或 fake image-load。
- 禁止使用 scroll-snap、scroll-view 或静态 transform 冒充真实轮播。
- 禁止让循环克隆项重复发布 click/load 或污染受控 value。
- 禁止让自动播放在 error/loading/disabled/reduceMotion 或页面已离开时继续运行。
- 禁止在概览追加事件日志、方法读取结果或只为诊断而存在的重置/读取按钮。

## 13. 修改闭环

1. 同步审计 `swiper/` 四件套、内部 PUI 依赖、npm 入口、metadata、H5、Props/WXML/API、示例、`miniprogram_dist` 和安装产物；正式名称只允许 `Swiper / swiper / pui-swiper`，自定义 Generic 固定为 `swiper-slide`，原生 `<swiper-item>` 不得替换。
2. 运行 `scripts/test-swiper.js`、语义/设计/布局/状态组合/API 可读性合同，以及 `site:build/check/pack:check`。
3. 浏览器真实验证受控/非受控、0/false/空字符串、Swipe/Navigation/方法、事件顺序、自动播放、循环中间帧、error/retry、180/300ms与1ms、390px、主题和全部外观。
4. 更新 Feedback Ledger、TDesign 对照清单、进度、API/H5兼容文档和真机风险。

任何不能满足本文的实现必须在 Ledger 中说明原因，不得静默绕过。

## 14. 2026-07-27 图片底板与错误行

独立页与 H5 默认项使用同一组图片数据；error 层中的 Empty 与 Retry 垂直排列，Retry 是独立全宽 PUI Button。Retry 只请求页面回写，不能自动清错；远程图片域名仍须在真机按下载域名策略验证。见 `miniprogram/pages/components/swiper/index.js`、`swiper/swiper.wxss`、`preview/*`、`PUI-FB-0437`。
