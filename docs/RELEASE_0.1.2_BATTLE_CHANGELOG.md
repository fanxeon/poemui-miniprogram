# PoemUI 0.1.2 组件页 Battle 变更与跨端同步清单

本文记录 0.1.2 小程序独立组件页逐项 battle 中的每一次真实改动。它不是发布完成声明；H5、`miniprogram_dist`、npm、GitHub 与远端部署只有在对应条目逐项核销并通过发布门禁后才能标记完成。

每条记录必须包含：用户问题、行为变化、源码文件、专项验证、待同步面和真机风险。已同步但未验证的事项不能标记完成。

## AreaChart / BarChart / Waffle

### 2026-07-29：演示数据使用可辨识的高波动前后态

- 用户问题：图表重播已经触发，但初始数据与变化幅度不够大，动画不够明显。
- 页面层修复：AreaChart 的默认两系列改为连续明显峰谷，并新增另一组反向交叉的高波动数据；BarChart 删除“高级 +1”，改为四分类同时包含大幅上升与下降；Waffle 删除“新增 +1”，改为 `32 ↔ 86` 格切换。三个小程序独立页均由父级真实回写 `items`，回写提交后调用公开 `replay()`。
- H5 同步：`preview/app.js` 使用保留的 demo state 切换同义数据，复用全宽 PUI Button 和 PUI Icon；重播 IconButton 继续只负责同数据重播。运行态不进入 Props 或复制 WXML。`preview/styles.css` 仅增加透明的全宽操作轨，没有给 display-leaf 增加 Surface。
- 合同与事实源：三个组件合同、`scripts/test-area-chart.js`、`scripts/test-bar-chart.js`、`scripts/test-waffle.js`、`scripts/test-miniprogram-advanced-pages.js` 与 Ledger `PUI-FB-0506`。
- H5 运行验收：真实点击后三组件都出现新的可访问数值与非完成动画帧；AreaChart 两态合计值为 `292/378/374/426/434/398 → 394/378/442/442/452/488`，BarChart 为 `10/44/44/60 → 62/16/62/48`，Waffle 为 `32 → 86` 格。PreviewDevice 横向 overflow=0，浅色/深色可读；验收后恢复深色偏好。
- 小程序模拟器：微信开发者工具 Nightly `2.02.2607282` 的 iPhone 12/13 Pro 模拟器实点 AreaChart，按钮文案与曲线均完成真实回写；BarChart、Waffle 的模拟器逐项点击，以及 iOS/Android 真机的 Canvas 重绘、连续点击和系统低动效仍为 `pending-device`。
- 发布边界：本项不单独发布；npm/GitHub/远端 H5 等待 0.1.2 统一发布。

## Skeleton

### 2026-07-29：头像轮廓恢复为几何正圆

- 用户问题：Skeleton 的头像占位不是圆形。
- 根因与共享组件修复：独立页通过 `size="72rpx"` 同时写入宽高，但 `type="circle"` 旧样式仍固定 `min-height:96rpx`，计算盒模型被拉成 `72×96rpx` 椭圆；圆角还完全依赖继承的 `--pui-radius-round`。`skeleton/skeleton.wxss` 现保留 `96rpx` 默认等宽高，把最小高度改为 `0` 以允许 `size` 覆盖两轴，并将圆形几何固定为 `border-radius:50%`。不新增 Prop/Event/Method。
- 页面与 API：独立页继续通过 `rowCol=[{ type:"circle", size:"72rpx" }, ...]` 使用真实组件；页面没有新增私有 CSS，也不恢复已删除的 `avatar/avatarSize/avatarShape`。
- 固定对照：2026-07-29 重新访问 TDesign Skeleton 官方页和组件源码，并解包 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/skeleton/{props.js,type.d.ts,skeleton.js,skeleton.wxml,skeleton.wxss}`。固定源码的 circle 以等宽高和最终 `50%` fallback 表达正圆。
- 事实源：`skeleton/skeleton.wxss`、`scripts/test-skeleton.js`、`docs/components/SKELETON.md`、Ledger `PUI-FB-0505`。
- H5 同步与验收：`preview/styles.css` 已将 circle 收口为 `min-height:0 + border-radius:50%`，`preview/app.js#skeletonPreviewRows` 继续让 `size` 同步宽高。390px 实际将 `rowCol` 改为 `size=72rpx` 后，深色果味下计算几何为 `36×36px / border-radius:50%`，页面无横向溢出；专项测试同步通过。
- 小程序运行验收：微信开发者工具 Nightly 2.02.2607282 / iPhone 12/13 (Pro) 390px，浅色、深色及深色关闭 `largeRadius` 三种状态下，`size=72rpx` 的 circle 均保持正圆；按钮实际完成 `loading → content → loading` 双向父级回写。截图：`/tmp/poemui-skeleton-circle-light-390.png`、`/tmp/poemui-skeleton-circle-dark-390.png`、`/tmp/poemui-skeleton-circle-dark-standard-radius-390.png`。调试器 Errors=0；5 条 warning 分别来自灰度基础库、既有 Navbar selector、ScrollArea IntersectionObserver 与开发工具预加载资源，没有 Skeleton 新告警。
- 产物与门禁：Skeleton、反馈页和组件页专项，Feedback generate/check、`miniprogram:build`、本地 tar 安装、`PUI_VERIFY_DIST=1` 与根仓 scoped `git diff --check` 通过；微信 `build-npm=321ms`。JS/JSON/WXML/WXSS 在源码、`miniprogram_dist`、真实 `node_modules` 与 `miniprogram_npm` 四路 SHA-256 一致，依次为 `81aa89c8c77a785cc04ce567a743dd9105bc1df0435c8de742d110354bb9228d`、`356076a5f7eadd08fdbb120b822968eb3d563862c43a22918de2db5c6f699e9e`、`8e098d890ab1ffc7efd41ad1e547fa98f8ae6b2a92a074519f8fff2cc2707e12`、`84291032047c09929375f3930fcf430fdc9684a3d424de163f87450e289972f4`。
- 发布与设备边界：共享源码、H5 镜像和本地发布产物已进入 0.1.2 最终批次；iOS/Android 真机保持 `pending-device`。

## NoticeBar

### 2026-07-29：默认关闭按钮改为透明视觉

- 用户问题：NoticeBar 内部默认关闭按钮使用 `default/base` 后出现独立 muted 底，和公告主 Surface 抢层级。
- 共享组件：尾部按钮继续复用 PUI Button，保留 `small + circle + icon-only` 命中区、无障碍名称及唯一 wrapper click 路径，但删除 `theme="default"` / `variant="base"`，改为 `variant="transparent"`；按钮继承 NoticeBar 语义前景，不产生第二层背景、边框、阴影或毛玻璃。没有使用会移除圆角的 `surface="transparent"`。
- API 与页面：12 Props / 2 Events / 4 Slots / 0 Methods 不变；点击仍只发布 `click({ trigger: "suffix-icon" })`，独立页继续由父级真实回写 `visible=false`，无需页面 CSS。
- 固定对照：2026-07-29 重新访问 TDesign NoticeBar 官方页面与仓库，并解包 `tdesign-miniprogram@1.15.3` 的 `miniprogram_dist/notice-bar/{props.js,type.d.ts,notice-bar.js,notice-bar.wxml,notice-bar.wxss}`；固定源码把 suffix 作为图标区，不建立第二层 Button Surface。
- 事实源：`notice-bar/notice-bar.wxml`、`notice-bar/notice-bar.wxss`、`scripts/test-notice-bar.js`、`docs/components/NOTICEBAR.md`、Ledger `PUI-FB-0483`。
- H5 同步与验收：`preview/app.js` 的 suffix 已复用 `iconButtonSample`，固定 transparent/small/circle 与 NoticeBar 语义前景；`preview/styles.css` 保证图标按钮在透明 Surface 下仍为正圆。390px 深色果味实测为 `36×36px / 999px` 圆角、透明背景和边界；真实点击 Close 后公告卸载，点击“重新显示公告”恢复，页面无横向溢出。
- 小程序运行验收：微信开发者工具 Nightly 2.02.2607282 / iPhone 12/13 Pro 390px，浅色、深色和深色果味下 Close 均只有语义色图标、没有第二层圆底；浅色与果味分别实点 Close 后页面真实回写“公告已由页面隐藏”，再实点“重新显示公告”恢复。调试器 Errors=0；累计 6 条 warning 为灰度基础库、Navbar selector、IntersectionObserver、预加载与热重载既有基线，没有 NoticeBar 新错误。截图：`/tmp/poemui-notice-bar-transparent-light-390.png`、`/tmp/poemui-notice-bar-transparent-dark-390.png`、`/tmp/poemui-notice-bar-transparent-dark-fruit-390.png`。
- 产物与门禁：NoticeBar、反馈页、组件页与 62 页质量专项，Feedback generate/check、`miniprogram:build`、真实 tar 安装和根仓 `git diff --check` 通过；微信 `build-npm=329ms`。JS/JSON/WXML/WXSS 在源码、dist、node_modules、miniprogram_npm 四路 SHA-256 一致。嵌套仓 `git diff --check` 仍被本轮未修改的 `pages/index/index.json:2` 尾随空白阻断，未越界清理。
- 发布与设备边界：共享源码、H5 镜像和本地发布产物已进入 0.1.2 最终批次；iOS/Android 真机继续标记 `pending-device`。

## SwipeCell

### 2026-07-29：双侧动作层按实时方向互斥显示

- 用户问题：向右滑开左侧“置顶”时，另一侧 danger 动作的红色圆角仍从容器右边缘露出；反向打开也存在同类风险。
- 根因与组件修复：旧 WXSS 用根级 `dragging/opened` 同时激活左右动作层。共享组件新增内部 `actionPosition`，由实时 `offset` 正负派生；WXML 只给同方向层挂 visible class，隐藏层同时 `opacity:0 / pointer-events:none / aria-hidden=true`。拖动跨零点立即切换，不等待释放。
- API：保持 6 Props、3 Events、3 Slots、0 Methods；独立页仍使用真实 left/right 数据和 `click` 父级回写，无页面 CSS 遮盖。
- 专项与事实源：`swipe-cell/`、`scripts/test-swipe-cell.js`、`docs/components/SWIPE-CELL.md`、Ledger `PUI-FB-0501`。专项锁定关闭、左右 opened、双向拖动与跨零互斥，并禁止根状态重新同时点亮两侧。
- H5 同步与验收：`preview/app.js` 的 Pointer runtime 与 `preview/styles.css` 已按实时 translate 方向互斥动作层；拖动时移除旧 opened 方向，跨零后隐藏侧使用 `opacity:0 / aria-hidden=true / transparent` 且过渡压缩为 1ms。390px 深色果味实际从右打开态跨零到左方向时只显示左侧 primary 动作，右侧 danger 层不可见，页面无横向溢出。
- 小程序运行验收：微信开发者工具 Nightly 2.02.2607282 / iPhone 12/13 (Pro) 390px，浅色与深色果味分别完成左滑、右滑和从右打开态跨零右滑；每次只有同侧“删除”或“置顶”，相反语义色/边框/圆角没有泄漏。点击置顶真实收起并由父级回写；禁用条目无响应。调试器为 0 errors；累计 12 条 warning 属于既有 Navbar selector、IntersectionObserver、Worker/热重载等基线。
- 产物与门禁：SwipeCell 与数据展示页专项、Feedback 生成/检查、`miniprogram:build`、本地 tar 安装、`PUI_VERIFY_DIST=1` 和 `git diff --check` 通过；微信 `build-npm=1537ms / warnings=[]`。JS/JSON/WXML/WXSS 在源码、dist、node_modules、miniprogram_npm 四路 SHA-256 一致。
- 发布与设备边界：共享源码、H5 镜像和本地发布产物已进入 0.1.2 最终批次；iOS/Android 真机保持 `pending-device`。

## Avatar

### 2026-07-29：懒加载和资源 Loading 收回组件内部

- 用户问题：Avatar 需要懒加载和加载态，而且资源加载态必须存在于组件内部，而不是由页面维护。
- API：新增 `lazy=false`，保留聚焦的 `loading=false` 强制态；当前为 13 Props / 1 error Event / 1 default Slot / 0 Methods。Loading 的节点和状态语义始终封装在 Avatar 内部。
- 原生实现：非空 src 自动显示内部 PUI Loading 与 `aria-busy`，真实 load/error 结束；`loading=true` 可持续保持内部等待态；src 变化重置，旧地址事件被丢弃；lazy 映射微信 image `lazy-load`。
- 页面：删除页面级 avatarLoading、状态文案和“结束加载”伪操作；概览固定包含一个 `loading=true` 持续态、用户提供的真实 COS 头像和真实 error 回退，切换按钮仍通过变更 src 重启资源生命周期。
- H5：新增真实 img runtime、缓存完成检查、lazy/eager 和 500ms/1ms hideOnLoadFailed；同步展示真实 COS 头像与 Avatar 内部持续 Loading。
- 事实源：`avatar/`、`preview/app.js`、Avatar 独立页、`docs/components/AVATAR.md`、`scripts/test-avatar.js`、Ledger `PUI-FB-0062/0063/0476`。
- 验收：H5 真实头像 naturalWidth=200，持续态内部 Loading 可见，失败图进入回退；390px API 13 Props 全文无裁切。微信模拟器真实头像/持续态/失败态分别为 `imageLoaded=true`、`showLoading=true`、`imageFailed=true`。
- 产物：专项、483 条 Feedback、`site:build`、`example:install`、`pack:check` 与合法 AppID 微信 npm 构建通过；五份 Avatar 四件套 SHA256 一致。全库 `check` 仅被本轮未修改的首页 `enableShareTimeline` 既有合同阻断。
- 发布边界：本项不单独发布 npm/GitHub/远端；继续等待 0.1.2 全部 battle 完成后统一发布。iOS/Android 真机、COS 域名策略和系统低动效仍为 `pending-device`。

## Card

### 2026-07-29：More 菜单脱离 Card 圆角裁切

- 用户问题：Card 的 More 下拉菜单不能完整展示。微信 390px 现状中 Card 根仅 `100px` 高，More 触发器位于 `591..628px`，三项菜单打开后被 Card 的 `overflow:hidden` 裁掉，只剩一条白色窄片。
- 共享组件：`card/card.wxml` 的内置 PUI Popover 固定启用 `fixed` 视口定位，继续复用其 `bottom-end`、碰撞判断、关闭和事件合同；没有减少菜单项、没有建立页面私有菜单，也没有扩张 Card 公共 API。
- H5：默认菜单由两项同步为与独立页一致的三项；Card 镜像 Surface 改为允许浮层越过内容边界，不再裁切绝对定位菜单。More 仍由共享 PUI IconButton 镜像生成，菜单项仍由共享 PUI Button 镜像生成。
- 运行验收：
  - 微信开发者工具 Nightly 2.02.2607282 / iPhone 12/13 Pro：三项“标记复核 / 分享清单 / 归档”完整可见；真实点击“标记复核”后菜单卸载，页面收到 `menu-select` 并回写“已选择菜单操作‘标记复核’”。
  - H5 390px 深色果味与浅色果味：菜单 `130px` 高，内容 `clientHeight=scrollHeight=128px`，三项命中点全部落在菜单内；菜单底部 `577.97px` 越过 Card 底部 `570.47px` 仍完整显示，`document/body=375/375`，控制台无 warning/error。验收后恢复原深色果味偏好。
- 合同与事实源：`card/card.wxml`、`preview/app.js`、`preview/styles.css`、`docs/components/CARD.md`、`docs/H5_PREVIEW_COMPATIBILITY.md`、`scripts/test-card.js`、Ledger `PUI-FB-0477`。
- 发布边界：本地 `site:build`、tar 安装与微信“构建 npm”已执行；npm Registry、GitHub 和远端 H5 继续等待全部组件 battle 完成后的 0.1.2 统一发布。iOS/Android 的 fixed 合成、屏幕边缘翻转、触摸与读屏仍为 `pending-device`。

## Bubble

### 2026-07-29：展开文案稳定锚定 Bubble 右下

- 用户问题：此前“展开”虽然处于满宽操作轨中，视觉上仍停在气泡中部偏右，没有真正贴齐右下。
- 根因：`pui-button` 自定义组件宿主会占满操作轨；只给内部 Button 根增加 `margin-left:auto`，或尝试收缩宿主，都不能稳定移动内部文案。
- 共享组件：`bubble/bubble.wxml` 直接使用 PUI Button 公开的 `block` 合同；`bubble/bubble.wxss` 保持满宽流式操作轨，并把 Text Button 内容显式右对齐。没有绝对定位，也没有新增页面私有按钮或改变公开 API。
- H5：`preview/app.js` / `preview/styles.css` 使用同义的满宽 toggle-row、block Button 与右对齐内容，展开/收起继续走真实 Bubble 状态机。
- 运行验收：微信开发者工具 iPhone 12/13 Pro 中真实点击“展开”后按钮变为“收起”，页面回写“长消息已展开”；H5 390px 深色果味和浅色果味下文案距 Surface 右侧 18px、操作轨距底部 9px，展开/收起后位置不漂移，PreviewDevice 横向 overflow=0，控制台无 warning/error。
- 合同与事实源：`docs/components/BUBBLE.md`、`scripts/test-bubble.js`、Ledger `PUI-FB-0480`。
- 发布与设备边界：本项只完成本地共享源码、H5 镜像、合同和产物同步；npm Registry、GitHub 与远端 H5 继续等待 0.1.2 全部 battle 完成后统一更新。iOS/Android 真机仍为 `pending-device`。

### 2026-07-29：展开不再回退估算高度重新判断

- 用户复看：点击展开时高度仍有一丝闪动；进一步把 `max-lines` 调到 4 后明确观察到“先收起再展开”，说明首轮验收漏掉点击后的同步首帧。
- 根因：受控 `expanded` 回写会再次执行 `syncState()` 并清空实测高度；H5 还会先输出 expanded DOM、再追加 `from collapsed` keyframe。更关键的是，小程序与 H5 的用户可见正文同时切换 `display:-webkit-box`、`-webkit-line-clamp` 和 `max-height`，平台会先按新的裁剪模型重排，再播放高度动画。前两项修复仍不能消除这次同步重排。
- 共享组件：Bubble 以正文、行数、variant、collapsible 和 customContent 模式生成测量 key；几何未变化时保留已提交的 collapsed/expanded 高度并跳过重复测量，内容变化才失效。旧 key 的异步测量不能覆盖新内容；非受控展开收口为一次同步提交。
- 可见动画：正文永久保持同一个 `display:block` 节点，只让 `clipStyle` 在两个实测像素端点间过渡；`-webkit-line-clamp` 只留在不可见的 clamped 测量节点。
- H5：删除后追加的 expand/collapse keyframe和可见正文的 line-clamp 状态切换。重建 DOM 时先用内联 `max-height` 固定在旧端点，下一帧只向目标端点过渡；最终收起态继续使用精确 `max-height`。
- 重新验收：390px 深色果味、`max-lines=4`、默认 500ms 下，75 帧展开从 `80px → 100px`、75 帧收起从 `100px → 80px`，双向错误方向帧均为 0；浅色同场景 70 帧展开也是 `80px → 100px`、反向帧 0，document `375/375`。可见正文计算样式为 `display:block`、空 line-clamp、`transition=max-height, opacity`，控制台 warning/error 均为 0；验收后恢复深色果味与收起态。
- 小程序二次复核：真实开发者工具首先证明上述修复仍不完整——隐藏 clamped 节点未可靠给出折叠高度，默认态没有展开入口；改用单行探针后，受控父级 echo 又把已测 `showToggle` 重置为 false，使展开后“收起”消失。共享组件现以 full + nowrap 单行探针计算端点，可见节点直接写 `max-height`，几何缓存同时保留 toggle；独立页正文补到四行以上。
- 微信重新验收：Nightly 2.02.2607282 / iPhone 12/13 Pro，构建 npm 302ms 完成。默认态稳定一行并显示“展开”；实点后完整展开、入口持续为“收起”、页面回写“长消息已展开”；再次实点恢复一行、“展开”和“长消息已收起”。调试器 Errors=0；既有 warning 与 Bubble 动画无关。模拟器未做逐合成帧采样，iOS/Android 真机仍为 `pending-device`。
- 事实源：`bubble/bubble.js`、`bubble/bubble.wxml`、`bubble/bubble.wxss`、`preview/app.js`、`preview/styles.css`、`scripts/test-bubble.js`、`docs/components/BUBBLE.md`、Ledger `PUI-FB-0502`。
- 发布与设备边界：本地共享源码、H5 镜像和微信 npm 已同步；远端 H5、npm Registry 与 GitHub 继续等待 0.1.2 统一发布，模拟器逐帧采样与 iOS/Android 真机帧时序仍为 `pending-device`。

## Textarea

### 2026-07-28：隔离父级同值 echo，停止 autosize 二次重绑

- 结论更正：Clear 完全删除后用户仍看到高度回缩，因此 Clear 不是闪动主因；删除 Clear 仍是与 TDesign 1.15.3 一致的 API 收敛，但不再作为高度修复证据。
- 根因证据：真实 `line-change` 只记录 `1 行 / 21px → 6 行 / 126px`，没有下降事件。页面 change 回写相同 value 后，旧组件 observer 会执行完整 `syncState/setData`，把 value、controlStyle、auto-height 与 focus 相关绑定再次提交给已完成原生测量的 textarea；视觉回缩发生在这次受控 WXML 重绑阶段。
- 组件实现：新增内部 `renderValue` 与差量 `setChangedData`。`innerValue` 继续保存逻辑值；正常 input 只更新逻辑值/计数并记录原生草稿，匹配草稿的父级 echo 不产生第二次子组件 `setData`，真正不同的外部 value 和字符截断仍会更新原生绑定。公共 API 不新增字段，保持 29 Props / 6 Events / 3 Slots / 3 Methods。
- 页面与 H5：独立页继续真实执行 change→value 回写，不做 debounce；主示例增加稳定运行态锚点。H5 已有 `control.value !== snapshot.value` 守卫，语义上同样不会把同值 echo 重写进 HTML textarea；Clear DOM、样式、路由与属性继续保持删除。
- 微信运行验收：DevTools Nightly 2.02.2607282 / iPhone 12/13 Pro 真实从单行输入 6 行，组件只有一次 `{innerValue,count}` 补丁，父级同值回写无 `renderValue` 补丁；30ms 采样 356 次，高度只从 `87px → 126px`，没有回落。父级随后写入不同值时 `renderValue` 正常更新，受控外部更新未被吞掉。
- 事实源：更新 Ledger `PUI-FB-0472`、`TEXTAREA.md`、API、H5 兼容、TDesign 对照、独立页 Checklist、进度与专项测试。状态为 `resolved / pending-user`；iOS/Android 真机软键盘、中文输入法 composition 与原生 autosize 分帧仍为 `pending-device`。

### 2026-07-28：受控 autosize 输入不再回退旧值

- 用户问题：Textarea 连续输入时高度闪动，怀疑同一输入链发生重复 `setData`。
- 根因：组件的受控 `onInput` 在发布 `change` 后返回 `previousValue`，微信原生 Textarea 先恢复旧文本；页面随即按事件执行一次父级 `setData` 回写新值，`auto-height` 因旧值、新值连续测量而收缩再展开。问题属于共享组件，不用页面 debounce 掩盖。
- 组件行为：`textarea/textarea.js` 的正常受控 input 返回 `undefined`，输入期间组件自身不 `setData`；只有 maxlength/maxcharacter 真实截断时才返回规整值。父级仍按既有受控合同真实回写。
- H5 镜像：`preview/app.js` 的静态 autosize 示例只更新当前 textarea 的 rows 与高度 Token，不重建 PreviewDevice；`preview/styles.css` 继续使用同一高度边界。
- 合同与事实源：更新 `docs/components/TEXTAREA.md`、TDesign 对照摘要、详情页 Checklist、`scripts/test-textarea.js` 与 Ledger `PUI-FB-0472`。2026-07-28 重新联网核对 TDesign 官方页面、官方仓库及固定 `tdesign-miniprogram@1.15.3` 安装源码。
- 当前验证：
  - 专项锁定正常受控输入回调新增 `setData=0`，模拟父级 value 回写后子组件状态同步 `setData=1`；字符截断仍返回规整值。
  - 微信开发者工具 iPhone 12/13 Pro `390×844`：浅色下从空值依次真实输入一行、三行、五行，深色下再次输入五行；页面 value、字符计数和自动高度连续更新，控制台无 error/warn。验收后恢复原本未持久化的浅色默认；微信构建 npm 为 `1053ms / warnings=[]`。
  - H5 390px：自动增高示例三行保持 `83px`，五行过渡完成后为 `125px`，Field/根分别为 `139/168px`，`document=375/375`，控制台无 warning/error。
  - `npm run check` 的完整 precheck（含 Textarea）通过；全库主 check 随后在未修改的首页分享基线停止：`首页必须显式开启朋友圈分享`。该失败不归因于 Textarea，也不包装成全量通过。
- 发布边界：源码、`miniprogram_dist`、真实小程序 node_modules 与微信 `miniprogram_npm` 的 Textarea JS 当前 SHA-256 一致；npm 0.1.2、GitHub 与远端 H5 仍等待全部组件 battle 完成后的统一发布。
- 真机风险：iOS/Android 软键盘、中文输入法 composition、原生 `auto-height` 分帧、光标/选区和后台恢复仍为 `pending-device`。

## DynamicMessage

### 2026-07-29：单束顶部→右侧流光与组件私有阴影/毛玻璃

- 流光从整段边缘换色改为唯一 `edge-beam`：L 形裁切轨道只暴露顶部与右侧，小程序 `6rpx`、H5 `3px`；一束状态色对角渐变以 `1500ms` 从 `0 0` 连续移动到 `100% 100%`，从顶部经过右上角走向右侧。
- 根 Surface 与装饰生命周期彻底分离：流光只改变自身 `opacity/background-position`，结束、关闭和低动效都不改写通知根的背景、毛玻璃或阴影。H5 分帧实测流光前/中/后三项计算样式完全不变。
- API 从 10 Props 更新为 12 Props：新增 `shadow/frostedGlass: Boolean|null`。`null` 继承 ConfigProvider，`true/false` 只覆盖当前通知，不写入全局视觉 Store。属性面板提供“容器外观”三态分组，小程序独立页用 PUI CellGroup/Cell/Switch 提供两个真实开关。
- 修复 H5 从属性返回概览后 retained `dynamicCurrent` 与新 hidden DOM 不同步：重新绑定时恢复当前通知为 visible，继续停留计时，不重播入场或流光。
- 浏览器实测：光束位置约 `52% → 95% → 清零`；全局效果开启时局部 false 得到 `shadow/filter=none`，全局效果关闭时局部 true 仍得到 `0 18px 44px` 阴影与 `blur(14px)`。API 104 个单元格无裁切/省略；393px PreviewDevice 无横向溢出。
- 门禁：`site:build`、专项、Feedback 486 条、`pack:check`、`example:install`、真实安装核验通过。官方真实小程序 `build-npm=1176ms / warnings=[]`，五路四件套 SHA-256 一致。完整 check 仍被范围外既有首页分享合同阻断；`_example` 的 `touristappid` 仍返回 code 10。
- Ledger：更新 `PUI-FB-0498`，新增 `PUI-FB-0504`；真机上的 6rpx 光束强度、clip-path、局部毛玻璃/阴影合成与读屏仍为 `pending-device`。

### 2026-07-29：流光延长到 1500ms，但不拖慢通知本体

- 用户问题：加粗后的半圈轮廓已经清晰，但原动画仍绑定 `expanding=320ms`，完整运动太快。
- 实现：双端新增内部 transient edge-flow 状态和独立 `1500ms` 计时；面板继续以 `180ms + 320ms` 在 `500ms` 内完成，流光可跨入 visible，结束或关闭时自动清理。
- 颜色：流光与状态 Icon 共用语义色，固定映射为 loading 中性灰、info 信息蓝、success 成功绿、warning 警告橙、error（失败）危险红；通知 Surface 不随状态整块染色。
- API：不新增 Prop、Event 或 Method；这是固定装饰节奏，不放宽公共交互动效 `1000ms` 上限。
- 低动效：`reduceMotion` 与系统低动效不启动流光，不把 `1500ms` 压缩成闪烁。
- 验证：H5 实点 success 在 visible 中仍保留 `is-success is-edge-flowing`；error 在约 `923ms` 仍有流光、约 `2044ms` 已清理。源码、dist、示例安装、真实 node_modules 与微信 miniprogram_npm 四件套五路一致；真实小程序 `build-npm 1144ms / warnings=[]`。
- 事实源：`dynamic-message/dynamic-message.js`、`dynamic-message/dynamic-message.wxml`、`dynamic-message/dynamic-message.wxss`、`preview/app.js`、`preview/styles.css`、`docs/components/DYNAMIC-MESSAGE.md`、`scripts/test-dynamic-message.js`、Ledger `PUI-FB-0498`。

### 2026-07-28：删除竖向 accent，展开期播放圆角半圈流光

- 用户问题：原有 success 等主题在通知左侧长期显示一根满高直线，与胶囊和展开面板的圆角边框不一致。
- 组件行为：删除双端旧 accent；新增继承当前 Surface 圆角的 edge-flow，最终按复看反馈固定为小程序 `6rpx` / H5 `3px` 并强化中段内发光，只在 `expanding=320ms` 内以当前主题色从左上经顶部流向右上，完成态恢复中性边框。流光无语义、不参与点击、不循环；reduceMotion 与系统低动效完全取消。
- 颜色语义：组件默认仍是 `theme=info`；浅色模式中的黑底属于中性反色 Surface，不是 primary。只有独立页“开始生成”这一主要动作入口继续使用 primary Button。
- 公共合同：不新增或删除 Prop/Event/Method，不改变 show/update/hide、同 key retained update、FIFO、Action/Close、500ms 分段状态机和安全区。
- 源码与镜像：`dynamic-message/dynamic-message.wxml`、`dynamic-message/dynamic-message.wxss`、`preview/app.js`、`preview/styles.css`。
- 合同与专项：`docs/components/DYNAMIC-MESSAGE.md`、`docs/COMPONENT_API.md`、`docs/H5_PREVIEW_COMPATIBILITY.md`、`docs/UI_DESIGN_CONTRACT.md`、`scripts/test-dynamic-message.js`、Ledger `PUI-FB-0498`。
- 当前验证：
  - H5 实点进入 `expanding` 中间帧，合同锁定 `3px` edge-flow；浅色全页截图可见中性反色黑底与加粗上半圈。此前同轮开始、更新、成功、reduceMotion、`0.32s`、同 key 不重播、390px 无溢出、light/dark 与 error 日志均通过。
  - 微信开发者工具加粗前已在 iPhone 12/13 Pro `390×844 / DPR 3` 完成真实组件 click、同 key 更新、success、reduceMotion 与无旧 accent 验证；最终 `6rpx` 重装后官方 `build-npm=1727ms / warnings=[]`。自动化桥接随后统一返回 `Bad Request`，所以最终强度仍列为模拟器/真机待复看。
  - `example:install` 通过；JS/JSON/WXML/WXSS 的源码、dist、示例安装、真实 node_modules、微信 `miniprogram_npm` 五路 SHA-256 依次一致：`3daf06f47ca962d6fe3756f70f1dbc2cddf515bdece8d88ccc2f26016a306da8`、`dacf45e8ec26006179aa941e44417eed5819360aea4d576b2230f937180c5424`、`963316bbf7a8441b6d6077215f8b7352db0bd4a7a7021db562ca206c96f11677`、`30ec4beb46a7244733ed2da9fb7dc173305f03b6e544422cf4d61ffe008315ea`。
  - `pack:check` 通过：当前未发布 `0.1.1` 为 `559 files / 364.2 kB / shasum 1d548084e489daacdcfa92decac0009a2e0b3893`。完整 `npm run check` 的 precheck 通过，主 check 被范围外既有首页 `pageJson.enableShareTimeline` 缺失断言拦截；未把它算作本组件失败或冒充全绿。
- 发布边界：本项属于 0.1.2 公共组件更新；本地 H5、示例安装与真实微信 npm 产物已同步验证，npm Registry、GitHub 和远端部署仍等待最终发布批次。

## NavigationMenu

### 2026-07-28：页面反馈分级与 DynamicMessage 恢复结果

- 用户问题：独立页底部“目录已关闭”等小号次级状态文字识别度低；机械放大或全部替换为 DynamicMessage 又会重复组件已经明确表达的状态。
- 决策：全局采用 `none / inline / Toast / DynamicMessage` 四级反馈。NavigationMenu 作为首个试点，删除展开、关闭、选择、checkbox/radio 和错误示例的三处重复 `navigation-page__status`；Error + Retry 继续由组件就地表达，页面真实清除 error 后才显示“目录已恢复”的 DynamicMessage。
- 共享基础设施：
  - `miniprogram/components/component-page-feedback/`：组合 npm 安装端 `pui-dynamic-message`，透传 click/action/close，真实返回 show/update/hide。
  - `miniprogram/utils/component-page.js`：提供 `showPageFeedback / updatePageFeedback / hidePageFeedback`；宿主缺失时返回空 key/false，不伪造成功。
  - 宿主固定放在页面唯一 ScrollArea 外，不改变页面文档流、Panel 高度或裁切。
- 页面源码：`miniprogram/pages/components/navigation-menu/index.js`、`index.wxml`、`index.json`。
- 合同与门禁：`docs/MINIPROGRAM_PAGE_FEEDBACK.md`、`docs/UI_DESIGN_CONTRACT.md`、`docs/components/NAVIGATION-MENU.md`、`scripts/test-miniprogram-page-feedback.js`、`scripts/test-miniprogram-navigation-pages.js`、Ledger `PUI-FB-0497`。
- 当前验证：
  - `node scripts/test-miniprogram-page-feedback.js`、`node scripts/test-miniprogram-navigation-pages.js`、相关 JS 语法检查、`npm run feedback:check`、`git diff --check` 与 `npm run pack:check` 通过；dry-run 仍为未发布的 `0.1.1`，559 files / 363.8 kB，本轮没有提前改版本或发布。
  - 微信开发者工具 iPhone 12/13 (Pro) `390×844`：页面调用 `showPageFeedback()` 真实返回稳定 key `runtime-proof`，顶部完整显示 PUI DynamicMessage 的 success Icon、标题“目录已恢复”和说明；宿主位于 ScrollArea 外，消息没有被页面滚动区裁切。截图：`/tmp/poemui-navigation-menu-feedback-runtime.png`。
  - 错误 Panel 的真实 Retry 按钮可被点击；页面专项测试锁定 `setData({ errorMenuError:false })` callback 完成后才调用稳定 key `navigation-menu-recovery`，不会在请求动作发生时提前宣布成功。
  - 完整 `npm run check` 已执行到 H5 设计合同，随后被本轮未修改的既有 `search-clear` 私有 raw button 边界拦截；该失败不归因于页面反馈试点，也不包装成全量通过。
- 待同步：H5 详情页反馈分级、npm/GitHub 与远端部署继续留在 0.1.2 最终批次，本条不代表发布完成。
- 真机风险：iOS/Android 自定义 Navbar 与系统安全区、VoiceOver/TalkBack 单次播报、低动效和连续通知性能仍待真机确认。

### 2026-07-28：横向根入口按可读宽度自适应

- 用户问题：横向根入口不能在“所有项目强制压缩”与“无条件横向滚动”之间硬选；直接对整条内容做裁切又会让最后一个 PUI Button 只显示半块。
- 目标行为：保留横向排列和现有 `scrollable` API。放得下时完整入口等宽铺满；项目数量超过可读最小宽度时才在 Trigger viewport 内横向滚动。父容器负责边界裁切，不能用遮罩盖住文字；Panel/Overlay 不得进入该裁切层。
- 小程序源码：
  - `navigation-menu/navigation-menu.js`：根 class 明确输出 `scrollable / fixed` 布局状态。
  - `navigation-menu/navigation-menu.wxml`：为默认 PUI Button 与 generic Trigger 增加真实宿主 class；仅在 `horizontal && scrollable && !wrap` 时启用 `scroll-x`；Layer 保持为 ScrollView 的兄弟。
  - `navigation-menu/navigation-menu.wxss`：Trigger viewport 是唯一 `overflow:hidden` 边界；`scrollable=true` 的 host 使用 `208rpx` 可读最小轨，放得下时 flex-grow 等宽、放不下时禁止收缩并产生局部滚动；`scrollable=false` 使用 `flex:1 1 0`；`wrap=true` 使用同一最小轨换行；默认与 generic 组件宿主都填满 host。
  - `miniprogram/pages/components/navigation-menu/index.js`、`index.wxml`：默认 horizontal 示例继续使用 3 个可读入口；完整 5 项保留在 vertical 双栏，并通过运行态临时注入 horizontal 完成滚动验收。
  - `scripts/test-navigation-menu.js`、`scripts/test-miniprogram-navigation-pages.js`：锁定自适应开关、`208rpx` 最小轨、strict equal、组件宿主填充、Layer 兄弟关系、后缀不收缩和三项/五项数据边界。
- 文档与事实源：更新 `docs/components/NAVIGATION-MENU.md`、`docs/COMPONENT_API.md` 与 Ledger `PUI-FB-0467`。
- H5 同步与验收：
  - `preview/app.js` 的根 Trigger 继续复用完整 PUI Button host，并保留默认与自定义 Trigger、Badge 和 Indicator 尾轨。
  - `preview/styles.css` 已统一为“可用时等宽、低于 104px 可读宽度时局部横滚、fixed 严格等宽、wrap 换行”；vertical Panel 完成态显式清除横向入场位移。
  - Chrome 390px 深色果味实测四项 scrollable Trigger 均为 104px，容器 `clientWidth=269px / scrollWidth=441px`，产生组件内部滚动而页面 `scrollWidth=clientWidth`；没有旧的整页横向溢出或遮罩错位。
- 发布边界：版本已统一调整为 `0.1.2`；npm、GitHub 与远端 H5 的最终核对在本批次发布完成后回写。
- 当前验证：
  - `node scripts/test-navigation-menu.js`、`node scripts/test-miniprogram-navigation-pages.js`、`npm run feedback:check`、`git diff --check` 通过。
  - `npm run miniprogram:build` 已生成 74 个组件目录；合法 AppID 的微信 `build-npm` 本轮为 `1017ms / warnings=[]`。
  - 源码、`miniprogram_dist`、真实 node_modules 与 `miniprogram_npm` 的 JS/JSON/WXML/WXSS 四路逐字节一致，SHA-256 分别为 `29138d4259935c5c9889e58aace9798779c67457dcceee2f9de6573ff85595d1`、`0bc4c28ff624d4413c8e179706b15e1e5994d490375473142610d127c0ad846f`、`e0018ff97db14d7265ee6d005a164ad0e5eb40932ce2dba804f7cdddf96018ae`、`14b30ae5973d38b51958d14d3bf3ffbf08c7c4920f20b1989fba465d4b6368c6`。
  - DevTools 390×844 三项：viewport/track=`362/360px`，3 个 host 均为 `117.328px`，最右 `372.984px < track right 375px`，`scrollWidth=360px / scrollLeft=0`。
  - DevTools 390×844 五项：运行态把同一示例临时切换为完整 5 项，host 均为 `108px`、`scrollWidth=550px`；真实 ScrollViewContext 将 `scrollLeft 0 → 188px`，末项移动至 `269..377px`，父容器边界保持 `14..376px`。
  - DevTools 390×844 fixed 五项：同一数据将 `scrollable=false` 后根 class 为 `fixed`，5 个 host 均为 `69.594px`、`scrollWidth=360px`；标题只在 Button 内容轨省略，Badge/Indicator 仍可见。
  - 三项、自适应五项与 fixed 五项截图：`/tmp/poemui-navigation-menu-adaptive-3-fixed-390.png`、`/tmp/poemui-navigation-menu-adaptive-5-start-390.png`、`/tmp/poemui-navigation-menu-adaptive-5-scrolled-final-390.png`、`/tmp/poemui-navigation-menu-fixed-5-390.png`。
  - 此前实际点击组件分类与 Close，父级依次回写展开、关闭。
  - `npm run pack:check` 通过：当前工作树仍为未发布的 `0.1.1`，559 files / 363.7 kB；0.1.2 版本号只在全部 battle 与跨端同步完成后统一更新。
  - 完整 `npm run check` 的 precheck、NavigationMenu 之前的组件/页面/包结构门禁均通过，随后在本轮未修改的 H5 `search-clear` 私有 raw button 边界停止；该既有阻断不冒充全绿，也不归因于 NavigationMenu。
- 真机风险：iOS/Android 的手势惯性、边界回弹、自定义组件 host flex、Badge Slot、长标题省略、触摸命中和读屏仍需确认。

### 2026-07-28：双栏尾轨、Panel 完成态与 Header Close 对齐

- 用户问题：双栏左侧 Badge/展开图标没有落到右侧尾轨；右侧 Panel 贴近 rail，左投影不完整；Header Close 也没有稳定右对齐，顶部和右侧留白不相等。
- 根因：vertical Panel 的入场选择器特异性高于通用 entered 选择器，打开完成后仍保留 `translateX(-16rpx) scale(.985)`；旧 gap 只有 `offset + space-sm = 12px`。Button suffix 未使用 auto 尾轨，Header 又以 `64rpx` 轨容纳 `56rpx` 按钮并使用不同的纵横 padding。
- 小程序修复：`navigation-menu/navigation-menu.wxss` 为 vertical entered 明确写入 `translateX(0) scale(1)`；两栏改为 `offset + space-normal = 16px`；vertical Button suffix 使用 `margin-left:auto`；Header 使用 `56rpx / 1fr / 56rpx`、操作顶部对齐和四向 `--pui-panel-padding-compact`，Close 的上/右均为 `20rpx / 10px`，标题独立居中。
- 专项与事实源：同步 `scripts/test-navigation-menu.js`、`docs/components/NAVIGATION-MENU.md`、`docs/COMPONENT_DEVELOPMENT_PROGRESS.md`、详情页 Checklist 与 Ledger `PUI-FB-0467`。
- 390px 运行态：修复前 rail/Layer/Panel 左边为 `14/178.03125/170.03125px`，证明 Panel 仍残留 `-8px` 入场位移；修复后 rail 右边为 `166.03125px`，Layer 与 Panel 左边同为 `182.03125px`，净距为 `16px`。Badge、Indicator、dot 的 suffix 右边统一为 `158.03125px`；Close 相对 Header 内边界的上/右间距为 `10.5/10px`，0.5px 差值来自 rpx 半像素取整。浅色与深色阴影均截图复核，Close 和根 Trigger 的 PUI Button 事件使父级 `visible true→false→true`。
- 构建产物：微信 `build-npm=1016ms / warnings=[]`；JS/JSON/WXML/WXSS 四路 SHA-256 依次为 `29138d4259935c5c9889e58aace9798779c67457dcceee2f9de6573ff85595d1`、`0bc4c28ff624d4413c8e179706b15e1e5994d490375473142610d127c0ad846f`、`e0018ff97db14d7265ee6d005a164ad0e5eb40932ce2dba804f7cdddf96018ae`、`14b30ae5973d38b51958d14d3bf3ffbf08c7c4920f20b1989fba465d4b6368c6`。
- 待同步：H5、npm/GitHub 和远端继续随 0.1.2 最终批次统一处理；本条不得被解释为已发布。
- 真机风险：iOS/Android 的 rpx 取整、Panel 阴影合成、Button Slot 尾轨和 Header 命中区仍待真机确认。

## Search

### 2026-07-28：取消操作收口为紧凑文字层级

- 用户问题：取消按钮过大，和搜索字段争夺主层级。复核发现此前未提交方案虽然从 `text/small` 改成 `transparent/extra-small`，但 Button 的 transparent 变体仍继承 extra-small 的 `88rpx（44px）` 最小宽度；Ledger 把 `44×32px` 写成已解决并不成立。
- 共享组件：
  - `search/search.wxml`、`search/search.js`：取消继续复用真实 PUI Button，改为 `text + surface-transparent + extra-small`；secondary tone 与 medium 字重通过 Button 公开 `custom-style` 变量传入。运行态复核发现 Button 内部虽已 `min-width:0`，自定义组件宿主仍被横向布局拉至 `184px`，且 `auto/fit-content/min-content` 均不能收缩；最终按取消文案字符权重选择 `compact / regular / wide / xwide` 宿主宽度，不增加补偿容器。
  - 取消文案同时进入 Button 的 `content` 与 `aria-label`，DevTools 辅助树必须读作“取消”，不再是泛化“按钮”。
  - `search/search.wxss`：四级语义宽度为 `68/104/144/176rpx`，默认“取消”在 390px 下目标宽度 `34px`；删除取消按钮内部根的父级几何规则以及私有内距、颜色、背景、边界与阴影补丁。
  - `button/button.wxss` 未修改；现有 `.pui-button--text` 已提供 `min-width:0` 和 `--pui-space-xs` 左右内距，extra-small 继续提供 `64rpx（32px）` 高度。
- 页面闭环：`miniprogram/pages/components/search/index.js`、`index.wxml` 无需改动。Search 组件只发布 cancel，页面消费者收到后真实回写 `searchValue=''` 与“已取消搜索，显示完整目录”，组件不伪造清空或成功。
- 合同与事实源：更新 `docs/components/SEARCH.md`、`docs/TDESIGN_COMPONENT_ALIGNMENT.md`、详情页 Checklist、`scripts/test-search.js` 与 Ledger `PUI-FB-0473`。TDesign `1.15.3` 的右侧 action 是独立大号文字 view；PoemUI 只借鉴右侧操作能力，不照搬该视觉尺寸或原生交互根。
- H5 同步与验收：
  - `preview/app.js` 的 Search 已复用 `buttonSample` 的 transparent/extra-small/surface-transparent 合同、secondary tone、medium 字重与真实 cancel 路由。
  - `preview/styles.css` 删除取消操作的最小宽度与左右 padding，并以 Search 作用域覆盖通用 extra-small 最小命中宽度。390px 深色果味计算样式为 `26×32px / min-width:0 / padding:0 / transparent`，低于旧 `44px` 且页面无横向溢出。
  - Cancel 继续只发布事件，不在组件内部清空受控值；消费者是否清空仍是业务层所有权。`node scripts/test-search.js` 锁定组件端与 H5 镜像合同。
- 当前验证：
  - `node scripts/test-search.js`、`node scripts/test-miniprogram-form-pages.js` 与安装核验通过；`npm run miniprogram:build` 生成 74 个组件目录，最终标准微信 `build-npm=1187ms / warnings=[]`。
  - 源码、`miniprogram_dist`、示例安装、真实小程序 node_modules 与微信 `miniprogram_npm` 的 Search 四件套在最终门禁中逐项核对。
  - 微信开发者工具 iPhone 12/13 (Pro) `390×844`：默认 compact 宿主与真实 Button 均为 `35×33px`，内部 `min-width=0`、左右 padding `4px`、字号 `13px`、字重 `500`；浅色为 secondary `rgb(82,82,91)`，透明背景/边界且无阴影、毛玻璃；辅助树读作“取消”。
  - 深色果味与深色边框开启时仍为 `35×33px`，文字切换为 `rgb(212,212,216)`，背景、边界、shadow、backdrop-filter 继续为空；验收后已恢复浅色标准组合。
  - 真实点击输入并键入 `Tabs` 后页面回写“准备查找 Tabs”；真实点击取消后值清空并回写“已取消搜索，显示完整目录”。清空控制台后重跑同链路，新增 `0 error / 0 warning`；清理前基础库、Navbar 选择器和 IntersectionObserver 提示属于既有运行噪音。
- 真机风险：iOS/Android 触摸命中、软键盘、长取消文案、读屏与系统字体缩放保持 `pending-device`。

## Select / Picker

### 2026-07-29：标题到选项只保留一个 Surface inset

- 用户问题：Select 和 Picker 弹层的标题与选项之间留白过大，怀疑间距 Token 作祟。
- 根因：Popup 默认同时提供 `--pui-surface-section-gap=36rpx` 与 Content `--pui-surface-inset=28rpx`；Select 的 Options 又重复增加 `--pui-panel-padding=28rpx`，标题到首组选项形成 `36+28+28=92rpx` 结构空白。Picker 虽无第三层 padding，也叠了 `36+28=64rpx`。问题属于共享组件，不由独立页 CSS 掩盖。
- 小程序修复：
  - Select/Picker 各自新增内部 `--pui-*-title-options-gap`，通过 Popup `custom-style` 映射到 `--pui-popup-section-gap`。
  - 普通模式把 section gap 归零，由 Popup Content padding 单独提供一个 `28rpx` inset；`equalSpacing` 移除 Content 顶部 padding 后，才恢复一个 `--pui-surface-inset` section gap。
  - Select Options 的自有 padding 归零；Picker 的默认 5 行、`itemHeight`、mask、惯性和中心选中几何不变。
- TDesign 对照：2026-07-29 访问官方 Picker 页面与仓库，并解包固定 `tdesign-miniprogram@1.15.3` 的 `picker/{props.js,type.d.ts,picker.js,picker.wxml,template.wxml,picker.wxss}`；其 `116rpx` Toolbar 后直接进入 Main，且默认可见项仍为 5。当前官方仓库没有独立 Select 目录，PoemUI Select 保持自身 Button + Popup 简单单选合同。
- 合同与事实源：更新 `SELECT.md`、`PICKER.md`、全局 UI 合同、TDesign 对照、详情页 Checklist、`scripts/test-select.js`、`scripts/test-picker.js`，新增 Ledger `PUI-FB-0499`。
- H5 同步与验收：
  - `preview/app.js` 的 Select 菜单与 Picker 面板保持 Header→Options/Wheel 单一结构，没有补偿 wrapper；候选项均为 4 项。
  - `preview/styles.css` 让普通与 equalSpacing 都只保留一个 Surface inset。390px 深色果味等距下，Picker Panel 为 `padding:14px / gap:14px` 且 Header/Footer 为 `padding:0`；Select Menu 为 `padding:14px / gap:14px`。
  - Picker Header 实测为 `36px / 1fr / 36px` 三列并保留 `8px` 操作间距；Select Trigger 与当前选项在 largeRadius 下均为 `20px` 圆角。两者打开、选择/确认均无横向溢出。
- 当前验证：
  - `node scripts/test-select.js`、`node scripts/test-picker.js`、`node scripts/test-miniprogram-form-pages.js`、Feedback 481 条与根仓 `git diff --check` 通过；嵌套仓仍由本轮未修改的 `pages/index/index.json:2` 尾随空白阻断，未归因于 Select/Picker。
  - `npm run miniprogram:build` 生成 74 个组件目录；本地 tarball 安装到真实 `miniprogram/node_modules` 后核验通过，合法 AppID 微信 `build-npm=1377ms / warnings=[]`。
  - Select、Picker 源码、dist、真实 node_modules、`miniprogram_npm` 四件套 SHA-256 逐项一致；Picker `template.wxml` 四路同为 `2d19ab93c85bf41cbf7c2a1b372d31e341d932c40fb15b5ff15ffd40fb2d302a`。
  - 微信开发者工具 iPhone 12/13 Pro `390×844`：Select 在浅色普通、浅色等距与深色等距下展开，标题到首项保持同一紧凑 inset；点击候选版后父级回写“当前发布通道：候选版”。
  - Picker 在浅色/深色等距下保留默认 5 行和中心选中；实际拖动后确认，父级回写“当前选择：开发版”。验收后恢复浅色、非等距外观。
  - 截图：`/tmp/poemui-select-title-options-fixed-390.png`、`/tmp/poemui-select-title-options-equal-390.png`、`/tmp/poemui-select-title-options-dark-equal-390.png`、`/tmp/poemui-picker-title-options-equal-390.png`、`/tmp/poemui-picker-title-options-dark-equal-390.png`。
  - DevTools 最终为 Errors=0、问题面板=0；6 条既有警告来自灰度基础库、此前 Textarea/Navbar 选择器、IntersectionObserver 与预加载资源，没有本轮 Select/Picker 新错误。
- 真机风险：iOS/Android 的 Popup 自定义属性继承、rpx 取整、Picker mask/惯性、触摸命中与读屏保持 `pending-device`。

## List

### 2026-07-29：父级追加后的尾部条目平滑展开

- 用户问题：List 点击加载更多后虽然已有页面级 `loading → items/finished` 回写，但新增条目会瞬间撑开，没有展开过渡；同时要求谨慎处理公共 API。
- 共享组件：
  - `list/list.js`：记录上一批 `items.length`，只标记既有非空列表尾部真实增加的索引；首次渲染、同长度替换、移除和仅状态变化均不触发。
  - `list/list.wxml`、`list/list.wxss`：新增尾项以 `max-height + opacity + transform` 展开，时长、缓动和低动效继续读取现有 `duration / easing / reduceMotion`。
  - 公共 API 仍为 31 Props、3 Events、4 Slots、2 Methods；不新增 `expanded`、`animate`、动画完成事件或第二套动效参数。动画只表示父级已经写入新增数据，不代表请求成功，`load/retry` 仍只发布请求。
- 页面与 API：
  - `miniprogram/pages/components/list/index.wxml` 删除不存在的 `retry-text`，改用真实 `error-text` 同时表达失败与下一步；页面继续由既有 Timer 模拟消费者请求并真实追加 5→9 项。
  - `useSlot=true` 的默认 Slot 不受 List 增量识别；消费者自管 Slot 内 DOM 与动效，组件不增加包装层猜测业务结构。
- TDesign 对照：2026-07-29 访问官方 Cell、Footer 页面与源码；固定 `tdesign-miniprogram@1.15.3` 安装包没有同名同责的数据分页 List，只包含 Cell/CellGroup 连续行与静态 Footer。本项读取 `cell/{props.js,type.d.ts,cell.js,cell.wxml,cell.wxss}` 和 `footer/{props.js,type.d.ts,footer.js,footer.wxml,footer.wxss}` 后保留 PoemUI 自身分页合同，不虚构 TDesign List API。
- 合同与事实源：更新 `docs/components/LIST.md`、`docs/COMPONENT_API.md`、详情页 Checklist、`scripts/test-list.js`，新增 Ledger `PUI-FB-0500`。
- H5 同步与验收：
  - `preview/app.js` 保存前一批 List 数量，只给真实新增尾项挂进入 class；首次内容、同长度重绘和 Slot 不误播。
  - `preview/styles.css` 镜像 max-height/opacity/transform、同名 duration/easing，并同时把 transition 与 animation 的低动效压缩为 1ms。
  - 390px 实际从 9 项点击“加载更多”，先进入 loading 且保持 9 项，约 560ms 后变为 11 项；只存在 2 个 `.is-appended`，计算动画名为 `pui-list-preview-item-reveal`、时长 500ms，页面无横向溢出。
- 当前验证：
  - `node scripts/test-list.js`、`node scripts/test-miniprogram-data-pages.js`、JS 语法检查、`feedback:generate/check` 与 `miniprogram:build` 通过；真实 tar 安装后的 `verify-install` 通过。
  - 微信 CLI 首轮 `build-npm=1247ms / warnings=[]`；补齐“空列表收到首批内容不误播”边界后，运行中的 IDE 再完成 `build-npm=316ms`。List 的 JS/JSON/WXML/WXSS 在源码、dist、真实 node_modules 与 `miniprogram_npm` 四路一致，SHA-256 依次为 `6afddeef433c9aff5993b35e27b00c0812b6320220696707a33c80b74c5e4939`、`3626425aeb6a2addef5862d25af70fb1357b310c20f9f4f52bb54632a3a4698a`、`26fd090b24a6ce5fed67545cfdc0561c00e13387242445441fef1a2502f6c0f9`、`9e8e28dd2a5d9395fcb6fa316c72e0b14d8a972f1239248bef4753cd73ea38dd`。
  - 微信开发者工具 Nightly 2.02.2607282 / iPhone 12/13 (Pro) `390px`：首屏 5 项，点击加载更多后父级真实进入 loading 并追加为 9 项/finished；模拟失败后点击错误 Footer，真实恢复到 9 项/finished。
  - 浅色、深色及 `shadow + frost + largeRadius + bordered` 组合下，List 保持唯一 Surface、完整滚动和可读性。截图：`/tmp/poemui-list-initial-light-390.png`、`/tmp/poemui-list-loaded-light-390.png`、`/tmp/poemui-list-dark-border-frost-radius-shadow-390.png`。
  - 最终 Errors=0；5 条 warning 来自灰度基础库、既有 Navbar 选择器、IntersectionObserver 与预加载资源，没有本轮 List 新错误。
- 真机风险：iOS/Android 的批量节点动画合成、长文案高度、快速连续追加、滚动锚点、系统低动效与读屏仍为 `pending-device`。

## CountDown

### 2026-07-29：新增逐位数字滚动风格

- 用户问题：现有数字变化会让整段数值重复播放透明度与位移入场，视觉接近闪烁；需要另一套真正的数字滚动风格，并要求公共 API 清楚、计时行为不分叉。
- 共享组件与 API：
  - `count-down/count-down.js` 新增 `animation="pulse|roll"`，默认 `pulse` 保持 0.1.1 兼容，非法值回退 pulse。没有恢复 `duration/easing`，Events、Slot、Methods 与 `targetTime` 状态机不变。
  - `roll` 在每次真实显示值变化时按数字位比较前后帧，只给变化的 `DD/HH/mm/ss` 位保留旧/新 glyph 并挂 reel 动效；未变化位静止。`SSS` 在 50ms 刷新中直接更新，避免不断重启 500ms 卷轴。
  - `count-down/count-down.wxml`、`count-down.wxss` 在原有 value 裁切层内增加 digits/reel/glyph，单位继续位于固定数字盒外。卷轴使用 `translateY(0 → -50%)` 与固定 500ms，`reduceMotion` 压缩到 1ms。
- 页面闭环：`miniprogram/pages/components/count-down/` 默认使用 roll，并通过两个真实 PUI Button 控制暂停/继续及 `pulse ↔ roll`。切换只回写展示 Prop，不重置剩余时间；finish 仍只表示等待结束，不宣称验证码或业务成功。
- TDesign 对照：2026-07-29 重访官方 CountDown 页面与源码目录，并解包固定 `tdesign-miniprogram@1.15.3` 的 `count-down/{props.js,type.d.ts,count-down.js,count-down.wxml,count-down.wxs,count-down.wxss}`。TDesign 没有逐位滚动 API；PoemUI 保留自身单一展示扩展，不虚构对齐项。
- 合同与事实源：更新 `docs/components/COUNTDOWN.md`、`docs/COMPONENT_API.md`、`docs/H5_PREVIEW_COMPATIBILITY.md`、TDesign 对照、详情页 Checklist、进度文档、metadata、CountDown/数据展示页专项测试，新增 Ledger `PUI-FB-0503`。
- H5 同步与验收：
  - `preview/app.js` 已加入 animation 默认值、属性控件、WXML 生成、pulse/roll 归一化与逐位前后帧；展示风格切换不重建 CountDown 计时状态。
  - `preview/styles.css` 镜像 value 裁切、digits/reel/glyph、500ms/1ms 与 SSS 直更，Slot 不进入内部数字动效结构；`preview/components-data.js` 由 metadata 重生成。
  - 390px 深色果味实际选择 `roll` 后，根为 `is-animation-roll`，变化位存在单一 reel；合成帧计算 `animation-name=pui-count-down-preview-digit-roll-a` 且中间帧 transform 不为端点，页面无横向溢出。
- 当前验证：
  - CountDown 组件专项、数据展示页专项、组件页与 62 页质量门禁、JS 语法、Feedback 与范围 diff 检查通过；`miniprogram:build`、真实 tar 安装校验与 `PUI_VERIFY_DIST=1` 通过。
  - 微信 CLI `build-npm=1299ms / warnings=[]`。CountDown 的 JS/JSON/WXML/WXSS 在源码、dist、真实 node_modules 与 `miniprogram_npm` 四路一致，SHA-256 依次为 `3643e8831697da342dfa1a64473f4888a238e15d512e7c9694685fdeeacaf660`、`356076a5f7eadd08fdbb120b822968eb3d563862c43a22918de2db5c6f699e9e`、`40495a54db080bc381a9b6486770d4d0f7405d912a1bfe76ca2af1e6f945367c`、`89b5c764de5cc492c4be321aab23e225dc8f7e2ff5a6fd6008f1f55dd6ac4946`。
  - 微信开发者工具 Nightly 2.02.2607282 / iPhone 12/13 (Pro) `390px`：roll 从 `01:00 → 00:59`；运行中切换 pulse 时继续到 `00:46`，切回 roll 继续到 `00:41`，没有重置。暂停后 `00:35` 连续 1.6 秒不变。
  - 浅色、深色及 `shadow + frost + largeRadius + bordered` 组合下数字、单位、圆形主题和操作区无溢出或裁切；清空历史记录后复跑控制台为 `Errors=0 / Warnings=0`。截图：`/tmp/poemui-countdown-390-light.jpeg`、`/tmp/poemui-countdown-390-dark.jpeg`。
- 真机风险：iOS/Android 的 rpx 字形裁切、动画合成、后台节流、50ms 毫秒刷新、系统低动效与辅助技术播报保持 `pending-device`。

## Indexes

### 2026-07-28：长轨、拖动放大提示与滚动所有权

- 用户问题：右侧索引出现灰色滚动条并侵入活动项；长按滑动时缺少当前索引放大反馈。复核同时发现手动滚动的受控 current 回写会再次触发 `scrollIntoView`，左侧/完整索引没有共享避让几何，disabled 禁止了只读滚动，`height=360rpx` 错误态仍被 `192rpx` Empty 图形挤到底边。
- 组件行为：
  - `indexes/indexes.js`：按 `height - 40rpx` 和真实索引数量计算有界轨道，每项上限 `36rpx`；默认 `680rpx` 完整容纳 A–Z。完整索引计算动态 rail width，非法 height 回退与公共默认统一为 `680rpx`。
  - `indexes/indexes.js`、`indexes/indexes.wxml`：touchstart 选择，按住 `120ms` 或发生 touchmove 时在轨道内侧显示完整当前索引；左右位置镜像，touchend/cancel/状态切换关闭，并去重触摸后的合成 click。不增加公共 Prop/Event。
  - `indexes/indexes.js`：手动 scroll 来源的受控回写不再二次定位；程序滚动保护保持完整 `500+120ms`，正文手势可主动接管；disabled 继续阻止事件但允许物理滚读。
  - `indexes/indexes.wxss`：删除字母轨 `overflow-y:auto`；标题与条目共同消费动态 rail width；body、entry、state 透明，只有根是集合 Surface；放大提示是唯一临时浮层 Surface。
  - `indexes/indexes.wxml`、`indexes/indexes.wxss`：复验发现通用 PUI Button 的整行 line box 会把活动字形压到圆形下半部，因此字母入口改为 Indexes 自身的 `view role=button` 交互根；独立 `line-height:1` 文本与动态项高正圆共同锚定包装中心。截图像素复核又确认系统字体墨迹中心比圆心向左、向上不足 `1px`；rpx 在当前 390px 模拟器中被取整，同值双轴补偿仍造成纵向过量，最终使用组件语义 `x=.5px / y=.25px` 光学补偿，但圆和命中区不移动。Retry 仍使用 PUI Button。
  - `indexes/indexes.wxml`、`indexes/indexes.wxss`：error/empty 使用 `88rpx` 紧凑 PUI Empty 图形和组件自有底部安全距；隐藏正文/轨道同步辅助语义。
- 页面闭环：
  - `miniprogram/pages/components/indexes/index.js`、`index.wxml`：错误示例不再永久 `error=true`。页面收到 retry 后真实进入 loading，校验并恢复本地分组数据；无有效数据时回到 error，组件自身不伪造成功。
- 测试与文档：
  - `scripts/test-indexes.js`：新增完整 A–Z 几何、首/中/尾触摸、放大提示、同项去重、touchend/cancel、合成 click、完整索引/左轨、invalid height、受控 scroll 回声、620ms 保护、disabled 滚读和 retry 所有权。
  - `scripts/test-miniprogram-navigation-pages.js`：用可控定时器验证页面 `error → loading → content`。
  - 更新 `docs/components/INDEXES.md`、组件详情 Checklist、进度文档和 Ledger。
- H5 同步与验收：
  - Pointer 按住 120ms 后原位显示放大提示；拖动期间只更新 active、scrollTop 与提示，释放后再统一回写，保持同一 pointer capture。
  - A–Z 长轨、动态 rail width、左右标题避让、disabled 可读滚动和透明 body/state 已同步；索引项使用自身 `span role=button`，不再套通用 Button。
  - 390px 实测轨道 `28×90px`、索引项 `21×18px`，活动字母使用 flex 正中；长按 A 出现 A 提示，拖到 C 时提示和正文同步到 C，释放后提示关闭且 current=C。页面 `scrollWidth=clientWidth`，无横向溢出。
- 当前验证：
  - `node scripts/test-indexes.js`、`node scripts/test-miniprogram-navigation-pages.js`、JS 语法检查与 `git diff --check`：通过；发布产物门禁和全量 `check` 结果以本节最终命令回写为准。
  - 微信开发者工具 iPhone 12/13 (Pro) `390×844`：组件根/body 为 `362×355px / 360×353px`，14 项实际轨为 `29×262px`、每项 `21×18px`，首尾均落在轨道内且 `overflow-y:visible`，未出现第二条滚动条。
  - 用户再次指出活动字形仍未居中后，重新截图确认旧 A 字形落在活动底板下半部；移除通用 Button 后底板成为动态正圆，但 B 墨迹仍向左上不足 `1px`。最终 `x=.5px / y=.25px` 光学补偿在 390×844 iPhone 12/13 Pro 运行时将正圆与 B 墨迹两轴残差压到不超过 `0.3px`。证据为 `/tmp/poemui-indexes-center-before-crop.png`、`/tmp/poemui-indexes-center-final-b-verified.png`。
  - 实际拖动索引使受控页面从 A 回写为 B，并显示 `45×45px` 的 B 提示；提示右边 `317px` 小于轨道左边 `336px`，且完整落在 body 内。内部 hold 路径在 `180ms` 时显示 P，touchend/cancel 后关闭；截图为 `/tmp/poemui-indexes-0.1.2-drag-preview.png`。
  - 错误态 `360rpx` body 实测 `187px` 高，Retry 底边距为 `39.5px`；实际点击 PUI Retry 后页面恢复为 `error=false / loading=false / 14 groups / 组件索引已重新加载`。同一真实运行时还捕获到 `error → loading → content` 中间态。
  - 深色果味下根实际为 `rgba(24,24,27,.88)`、`blur(13px) saturate(1.5)` 与主题阴影；body、entry、state 均为透明/无外阴影。原始浅色外观状态已恢复。清理验收过程日志后，当前 Indexes 页面控制台无 warning/error。
  - 截图证据：`/tmp/poemui-indexes-0.1.2-light.png`、`/tmp/poemui-indexes-0.1.2-error-gap.png`、`/tmp/poemui-indexes-0.1.2-recovered.png`、`/tmp/poemui-indexes-0.1.2-dark-fruit.png`。
  - `PUI_VERIFY_DIST=1 node scripts/test-indexes.js` 与页面专项通过；`example:install`、`miniprogram:build`、微信构建 npm（`1158ms / warnings=[]`）和 `pack:check` 通过，dry-run 为 `559 files / 363.8kB / shasum 30b7bb06213c3a00a8e2e2e8fdab8b60bf4bc049`。源码、dist、示例安装、真实小程序 node_modules 和微信 `miniprogram_npm` 的 Indexes JS/JSON/WXML/WXSS 五路 SHA-256 分别一致。
  - 完整 `npm run check` 在进入 Indexes 之前被既有 Search 设计合同拦截：`search-clear must compose the reusable PUI Icon Button mirror instead of a private raw button`。该失败不归因于 Indexes，也未包装成全量通过。
- 真机风险：iOS/Android 的长按阈值、连续 touchmove、合成 click、惯性滚动、sticky、读屏、字体放大和毛玻璃合成保持 `pending-device`。
