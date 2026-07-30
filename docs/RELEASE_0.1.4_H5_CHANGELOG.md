# PoemUI 0.1.4 H5 组件镜像记录

> 状态：`production published`
>
> H5 是原生小程序组件的同用户语义镜像，不是实现真相源，也不证明微信平台能力已通过真机验收。

## 页面级记录

| H5 路由 | 组件 | 级别 | 原生语义来源 | 本版 H5 变化 | 运行态证据 | 微信端仍需验证 |
| --- | --- | --- | --- | --- | --- | --- |
| `#/components/action-sheet` | ActionSheet | L1 + L3 | `action-sheet/*`、`ACTION-SHEET.md` | 删除陈旧 ActionSheet 说明与重复样式；保持完整设备遮罩和底部 Surface | H5 合同扫描与组件专项 | 遮罩 blur、退场保留和安全区 |
| `#/components/pull-refresh` | PullRefresh | L1 + L3 | `pull-refresh/*`、`PULLREFRESH.md` | 根、内容轨改为透明布局层，不再受 border/shadow/frost 开关染成面板 | 计算 CSS 合同和专项测试 | 微信真实下拉手势和 scroll-view 合成 |
| `#/components/dropdown-menu` | DropdownMenu | L1 + L3 | `dropdown-menu/*`、`DROPDOWN-MENU.md` | 继续镜像真实展开层主题，禁止空主题强制浅色 | 组件专项与主题覆盖扫描 | 微信展开层定位、触摸与回弹 |
| `#/components/rate` | Rate | L1 | `rate/*`、`RATE.md` | 默认激活星色与小程序 warning 语义一致 | 专项测试 | 微信 Icon 半星裁切与真机颜色 |
| `#/components/donut-chart` | DonutChart | L5 | `donut-chart/*`、`DONUT-CHART.md` | 新增结构化 SVG 圆环、渐变弧段、中心摘要、Legend、数据切换与 replay | 390px 下 3→4 弧段真实切换；完整动画后渐变圆环可见；无横向溢出 | Canvas 2D DPR、字体、低端机动画 |
| `#/components/radar-chart` | RadarChart | L5 | `radar-chart/*`、`RADAR-CHART.md` | 新增 SVG 网格、轴线、双系列渐隐面积、节点、标签、Legend 与 replay | 390px 下 2 系列、5 标签、完整 ARIA、无横向溢出 | Canvas 标签换行、多系列性能 |
| `#/components/sortable-list` | SortableList | L5 | `sortable-list/*`、`SORTABLE-LIST.md` | 新增单集合 Surface、活动行状态过渡、Pointer/键盘排序与父级回写；不宣称兄弟行让位或落位回弹 | 390px 下 Pointer 与 Arrow 已真实改变顺序并恢复焦点 | 微信 touch 长按、变高行、自动滚动与触摸取消 |
| `#/components/tour` | Tour | L5 | `tour/*`、`TOUR.md` | 新增四块 Mask、目标框、自动 placement、Panel、步骤动作、焦点圈与失败关闭 | 打开、下一步、Esc 关闭、触发者焦点恢复；Panel 保持在 PreviewDevice；浅色 + frost + equal + shadow 组合通过 | SelectorQuery、胶囊安全区、触摸阻断、读屏 |
| `#/components/scroll-area`、`#/components/popup` | ScrollArea / Popup card | L1 + L3 | `scroll-area/*`、`popup/*`、`SCROLL-AREA.md`、`POPUP.md` | 新增与原生同名材质遮罩 Token；frosted 组件树和 Popup card 自动传递低 alpha 上下文，普通实底与公开自定义色不变 | 390px 下实底、浅/深色毛玻璃、Popup card 继承、显式自定义色及 console 均已验证 | enhanced scroll-view 叠层、真实 blur 合成和 iOS/Android 真机 |
| `#/updates` | 更新公告 | L0 + 应用镜像 | `miniprogram/common/services/update-announcements.js` | 新增独立更新公告页；Topbar 版本号改为共享 PUI Button，构建时生成同源数据，以一个连续 Surface 展示全部版本和组件级改动 | `scripts/test-release-notes.js` 对齐包内公告、云回读和 H5 数据；390px/深浅色/外观组合见下方运行态记录 | 小程序真实云读取与 iOS/Android 真机 Popup |

## 计算样式与几何证据

- 窄屏验收使用 390×844 能力视口；浏览器框架下文档 `clientWidth=375`，所有四个新页面均保持 `scrollWidth=clientWidth`，没有页面级横向溢出。
- DonutChart 在动画完成后呈现完整渐变弧段；切换数据后 SVG 弧段由 3 个变为 4 个，ARIA 摘要同步更新。
- RadarChart 渲染 5 个维度标签和 2 个系列，图形与 Legend 由同一结构化 Props 生成。
- SortableList 同时完成键盘与 Pointer 两条真实排序链；状态文案只说明父级已回写 `items`，不宣称持久化成功。现有证据只证明顺序和焦点，不证明兄弟行让位或落位动画。
- Tour 打开时生成四块遮罩，目标、Panel 和根都受 PreviewDevice 边界约束；Esc 后恢复触发按钮焦点。
- 在 `light + frostedGlass + equalSpacing + shadow` 组合下，Tour Mask/Panel 的 `backdrop-filter` 为 10px，Panel 分区 gap 为 14px，阴影为实际 rgba 值；关闭 shadow 后计算值恢复 `none`。
- 更新公告页在 390×844 下从 Topbar `0.1.4` PUI Button 真实进入 `#/updates`，直接刷新仍保留路由、当前公告与外观偏好；当前版本包含 5 项组件级变动，共渲染 5 个版本，console error/warning 为 0。
- 390px 的 document/body `clientWidth=scrollWidth=375`；equal 模式下当前版本四向 inset 与直接结构 gap 同为 `14px`，normal 模式保持 `14px` inset 并把 gap 恢复为 `8px`。
- 浅色毛玻璃模式的公告 Surface 计算为 `rgba(255,255,255,.78) + blur(14px) saturate(1.2)`；关闭阴影后 `box-shadow:none`。深色初始 Surface 同样可读且无横向溢出。1440×900 下页面与唯一连续公告 Surface 均收敛为 `860px` 宽。
- ScrollArea 在浅色实底下的默认上下文保持 `#ffffff`，开启毛玻璃后为 `rgba(255,255,255,.32)`；深色毛玻璃为 `rgba(24,24,27,.32)`。Popup card 计算背景为同主题 `.72` alpha，向后代传递 `.32` 材质上下文；显式 `gradientOverlayColor=#fef3c7` 时计算渐变仍以该色为起点，证明公共 API 优先级未被全局外观覆盖。

## H5 降级与禁止事项

- DonutChart/RadarChart 使用 SVG 是浏览器平台镜像；小程序仍以 Canvas 2D 为真相源，不能把 SVG DOM 反向写入 WXML。
- SortableList 用 Pointer Events 和键盘 Arrow 增强可访问性；微信使用 touch 手势，不虚构浏览器键盘为小程序原生能力。
- Tour 用 `getBoundingClientRect()` 测量；微信使用 SelectorQuery。两端都必须在目标缺失时失败关闭。
- H5 站点的品牌、固定安装代码、Skill 链接和更新页统一显示 `0.1.4`；npm Registry 已回读 `latest=0.1.4`，GitHub `v0.1.4` Tag 与公开 Release 也已独立回读。
- H5 更新页不是云管理后台：它只展示构建时从小程序公告真相源生成的数据。云端 `pui_updatelog` 的唯一 0.1.4 文档已经写入并全文回读，但 H5 不把本地生成内容标成“实时云同步”。
- H5 通过不等于微信开发者工具或 iOS/Android 真机通过。

## 发布边界

用户已授权 0.1.4 生产 H5 发布，明确排除微信小程序上传。2026-07-30 已在本机完成 `linux/amd64` 镜像构建，并在生产主机先以独立 Canary 端口回读后切换：

- 文档站活动容器：`poemui-h5:20260730-0.1.4-001`，绑定 `127.0.0.1:3102 → 8080`，容器健康状态为 `healthy`；直接回滚点为停止状态的 `poemui-h5-rollback-20260729-0.1.3-001`。
- 产品落地页活动容器：`poemcoder-web-v2:20260730-poemui-0.1.4-r1`，绑定 `127.0.0.1:3101 → 3000`；直接回滚点为停止状态的 `poemcoder-web-v2-rollback-20260729-poemui-0.1.3-r8`。
- OpenResty 容器内 `openresty -t` 通过。公网 `/poem-ui/docs/`、公告数据资源和 `/poem-ui` 均返回 HTTP 200；文档站回读 `0.1.4-20260730-002` 资源指纹与“PoemUI v0.1.4 更新”，落地页回读 78 个组件、npm `0.1.4` 和 `v0.1.4` Skill 链接。
- Chrome 显式 390×844 验收两页 `innerWidth=390`，document/body 均为 `clientWidth=scrollWidth=375`，无横向溢出、console error/warning 为 0。生产 DonutChart 的“切换圆环图演示数据”真实点击后按钮由“切换高波动数据”变为“恢复初始数据”。

这些证据只证明 H5 与产品落地页已生产发布；npm Registry 与 Git Tag/GitHub Release 已沿独立链路回读，微信小程序上传不在本轮范围。
