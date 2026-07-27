# Icon 组件语义合同

本文是 PoemUI Icon 的长期设计与实现合同。任何 Agent 修改 Icon 源码、图标资产、H5 资源库、示例、元数据或安装产物前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component icon`

完整 Props 与 Events 以 `docs/COMPONENT_API.md` 为准；本文规定长期语义、组合边界和 TDesign 对照决定。

## 1. 组件定位

- Icon 是本地 Icon Font 的展示叶子，只负责内置图形、尺寸、颜色、字体映射状态和可访问名称。业务图片属于 `pui-image`。
- Icon 不承担点击、禁用、只读、选中、loading、empty、retry 或业务状态机；交互入口必须组合 PUI Button + Icon。
- `name` 只使用 PoemUI 稳定名称，不接受图片 URL、SVG path 或任意字体类名。

## 2. 固定结构

```text
view.pui-icon[role=img]
├── text.pui-icon__glyph（内置 name → 本地 Icon Font）
└── text fallback（未知名称或字体映射缺失）
```

- 根节点保持 inline-flex 和正方形，不增加 Surface、padding、边框、阴影或毛玻璃。
- 尺寸只由 `size` 决定并限制为 8–256rpx；禁止 `small/medium/large` 字符串或 CSS 单位混入原生 API。
- 未知名称或字体映射缺失必须显示稳定回退并触发真实 `error`，不得假装成功。

## 3. 资源与生成

- 218 个公开名称来自 `assets/icons-src/manifest.json`。SVG 只作为设计与字体生成真相源；稳定码点、WOFF2、`icon-font-map.js`、`icon-font-catalog.js`、`icon-font.wxss` 与 H5 `icon-font.css` 由 `scripts/generate-icons.js` 统一生成，禁止手改生成物。
- 小程序 `pui-icon` 运行时只能导入 `icon-font-map.js`；H5 共享 `iconComponent` 只能读取生成目录中的 `codepoint` 并渲染同一字体字形。两端均不得导入 SVG path map、内联 SVG、image、CSS mask 或 Canvas 作为 `pui-icon` 渲染分支。
- `components / 组件` 分类收录当前 14 个需要 PoemUI 专属几何的名称：`button`、`divider`、`icon`、`popup`、`popover`、`sheet`、`action-sheet`、`dropdown-menu`、`overlay`、`badge`、`cell`、`swipe-cell`、`scroll-area`、`dialog`。它们和全部图标共享唯一生成链路，不维护页面私有名单。
- 新组件目录先判断语义是否已被成熟图形覆盖，禁止机械地为每个组件重画同名图标。Avatar/Card/Image/List/Collapse/Collapsible/Bubble/CountDown/Table 直接复用现有 `user/panel-top/image/list-bullet/rows/chevron-down/message/clock/table`；Tag、Swiper、Direction 分别引入锁定版 Lucide `tag/gallery-horizontal/arrow-left-right` 并留在通用语义分类；只有存在目录辨识冲突的 Badge、Cell、SwipeCell、ScrollArea、Dialog 新增专属几何。
- `assets/component-icons-preview.svg` 是生成脚本输出的黑白辨识稿，同格展示 56/32/20px，用于复核 Popup/Popover、Popup/Overlay、Sheet/ActionSheet、Icon/component、Divider/minus，以及 Cell/SwipeCell、Dialog/Overlay 的成对差异；它不是运行时资源。
- 用户否决首轮复杂稿后，组件分类采用“先轮廓、后锚点”的减线合同：单枚图标最多 3 个可见 SVG 图元，禁止同时堆叠完整视口框、组件框和多行内容。`scripts/test-icon.js` 锁定 14 项各自的图元数量，防止后续又退回复杂说明图。
- 浮层家族的第二版几何固定为：Popup 使用后方竖向手机轮廓和右下方覆盖其下部的较小方形卡片，手机边线在遮挡处中断；Popover 使用带尖角的面板和真实锚点；Sheet 使用浅底部任务面板与拖手；ActionSheet 复用同一面板并只增加一条操作行；DropdownMenu 只保留 Trigger、下箭头、展开面板和一条选项线；Overlay 只保留外层覆盖框与中央透明焦点区。
- 新增专属几何固定为：Badge 只保留宿主轮廓和右上实心角标；Cell 为单行外壳、短文字线和右 Chevron；SwipeCell 复用单行外壳，以动作分隔和左滑 Chevron 区分；ScrollArea 为视口、单条内容线和右侧滚动条；Dialog 为视口、居中对话框和单条标题线。
- 资产固定为 24×24 viewBox、2.15 圆线、round linecap/linejoin。生成链路先把描边转成封闭轮廓，再生成本地 WOFF2；码点由 `assets/icon-codepoints.json` 在 Unicode Private Use Area 中稳定分配，不得因排序或新增图标改写既有码点。
- 字体轮廓采用 nonzero 绕向：圆环、头像头部、轨道节点等半径大于半描边宽度的闭口圆形必须保留方向相反的外轮廓和内轮廓，不能被字体填成实心。省略号、Radio 中心点、Popover 锚点等半径不大于半描边宽度的语义点保持实心，避免小尺寸针孔。`scripts/test-icon-font-outlines.js` 对当前 59 个镂空圆与 25 个语义点执行全量门禁。
- WOFF2 以同一 data URI 同步写入 `icon/icon-font.wxss` 与 `preview/icon-font.css`，随 npm 和 H5 本地交付，不依赖远程字体、CDN 或运行时下载；原始 SVG 只用于字体生成、资源审计和辨识对照。
- 公司书写字标属于独立品牌字体资产，由 `scripts/generate-company-mark.js` 输出到 `assets/company-mark/`，不计入本组件的 218 个名称、码点表或 WOFF2。需要呈现公司字标时使用其独立 SVG / CSS / WXSS；不得为此恢复 Icon 的 SVG、图片或 Canvas 运行时分支。

## 4. 颜色与深浅色

- 内置 `name` 字形使用 `currentColor`。未传 `color` 时根节点必须使用 `color: inherit`，继承页面正文或 Button 等组合宿主的当前前景色；不得在 Icon 根重新写死正文 Token，否则实色 Button 会出现黑底黑图标。传入安全 HEX、RGB(A)、HSL(A)、命名色或 `var(--pui-*)` 时直接写入根文字颜色，深浅色 Token 可实时解析。
- 小程序与 H5 都渲染同一 WOFF2 的字体字形，并使用 `currentColor`；不存在跨端 SVG/字体两套视觉运行时。
- 品牌图、业务图片和多彩图形默认使用 `pui-image`；经品牌合同登记的单色公司字标可以使用独立 `PoemUI Company Mark` 字体，但不得借 `pui-icon` 恢复图片、SVG 或 Canvas 着色分支。

## 5. 事件

- 内置 `name` 成功解析到字体码点后触发一次 `load: { name, source: "font" }`；同名的尺寸或颜色变化不重复伪造资源加载。
- `error` 只覆盖 `unknown-icon` 与 `font-glyph-unavailable`。
- Icon 不公开 `click`。资源卡选择、复制、关闭、返回等操作统一由 PUI Button 承担。
- 同一未知名称的 observer 同步不得重复发出相同 error；名称恢复有效后允许未来新的未知名称再报告。

## 6. 可访问性

- `ariaLabel` 非空时根节点使用 `role=img` 与该名称。
- `ariaLabel` 为空时根节点设置 `aria-hidden`；Button、Cell、Tag 等父组件的文字或 ariaLabel 是唯一朗读来源。
- 不允许给 `role=img` 绑定点击而没有键盘等价操作；这也是移除 Icon click 的根本原因。

## 7. H5 预览与资源筛选

- 概览按“基础用法 / 尺寸与颜色 / 图标资源”分区，后续分区标题使用共享 section gap。
- 资源搜索必须复用 PUI Input，分类与资源卡必须复用 PUI Button，卡内图形必须调用共享 `iconComponent`。
- 点击资源卡先回写 `name` Prop，再通过共享的真实剪贴板路径复制对应图标名，并复用 `pui-toast` 的 H5 镜像以 success/error 短暂提示；这属于官网资源库按钮行为，不为 `pui-icon` 增加 click API。搜索和分类只筛选资源，不伪造组件 API。
- 未知 name、空 name、Token/实体 color、8/256 边界和 ariaLabel 必须真实反映在当前预览。
- 基础 WXML 必须显式包含 name，自闭合且零 bind；不得因演示初值过滤而复制出空 Icon。

## 8. 响应式与视觉开关

- 390px 下搜索、分类、资源卡和 API 全文必须无页面级横向溢出；分类条允许自身横向滚动。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变只改变资源卡与页面画布；Icon 叶子自身不获得 Surface 或布局变化。
- 低动效不需要 Icon 私有 Prop；资源卡的 Button 反馈使用共享 Button 动效合同。

## 9. TDesign 1.15.3 对照决定

- TDesign Icon 安装包公开 `name/color/prefix/size`，内置名称使用字体字形，图片 URL 使用 image 分支；公共层另有 style/custom-style、ARIA 与 click，`size` 支持 Number 或带 px/rpx 的字符串。
- PoemUI 只保留 `name/color/size/ariaLabel`，尺寸固定 Number+rpx；拒绝 `prefix`、URL 和图片分支，字体家族与码点是内部生成合同。
- 拒绝 Icon `click/disabled`：Icon 是展示叶子，操作必须组合 Button，避免不可聚焦的伪按钮和重复状态 API。
- 不追求 TDesign 的图标数量或远程字体 URL；PoemUI 使用本地嵌入 WOFF2、稳定名称和稳定码点实现离线交付。

## 10. 明确禁止

- 禁止恢复 Icon 自身的 `click`、`disabled` 或其他伪交互状态；业务操作必须组合 PUI Button。
- 禁止把 `name` 解释为图片 URL，也禁止恢复 `src`；图片资源只能通过 `pui-image` 进入。
- 禁止恢复 H5 inline SVG、CSS mask/image，或小程序 image/Canvas 旧分支。
- 禁止在 Icon 独立资源页显示无效的元素选择/机型/刷新工具；概览只保留同源复制入口。
- 禁止用 CSS 覆盖 `[hidden]` 后仍让无效控件可见，390px copy-only 工具栏必须保持单行语义高度。

## 11. 修改闭环

1. 同步审计 Icon 四件套、生成脚本、manifest/217 个 SVG、metadata、H5、API、示例、所有内部调用、dist、安装产物和 Ledger。
2. 更新 `scripts/test-icon.js` 与 `scripts/test-icon-font-outlines.js`，至少覆盖 API 收敛、尺寸边界、未知名称去重、字体目录/码点/WOFF2 完整性、闭口圆形内外绕向、语义实心点边界、跨端字体 CSS 同源、Token 颜色、基础 WXML 和非法字符串尺寸扫描。
3. 浏览器验证资源筛选、Props 回写、复制、字体加载、390px、深浅色与五项视觉设置。
4. 运行 site/check/pack；微信 CLI 不可用时必须保留 pending-cli，不能把源码和 H5 当成安装产物完成。

任何不能满足本文的实现必须记录进 Feedback Ledger，不得静默绕过。
