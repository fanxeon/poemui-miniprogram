# PoemUI 组件语义合同

本目录保存每个 PoemUI 组件的长期设计与实现合同。它不替代 `COMPONENT_API.md`：API 文档回答“有哪些 Props、事件和方法”，组件语义合同回答“组件为什么这样分区、各区域如何组合、哪些结构绝对不能破坏”。

跨组件的微信运行时信息读取规则见 [微信平台信息接口兼容规则](../WECHAT_PLATFORM_API_COMPATIBILITY.md)。

本轮组件展示、外观和跨端共用规则的追溯入口见 [组件共用规则索引](../COMPONENT_RULES_INDEX.md)；外观开关逐组件资格见 [PoemUI 外观资格矩阵](../APPEARANCE_CONTRACT_MATRIX.md)。矩阵汇总组件级边界与证据，但不取代本目录的专属合同。

## Agent 使用规则

1. 每个组件最终都必须拥有一份对应的全大写组件合同，例如 `dialog` 对应 `DIALOG.md`、`input` 对应 `INPUT.md`。
2. 修改组件前必须先检查并完整阅读对应合同，再查询该组件的 Feedback Ledger 原始记录。
3. 旧组件尚无合同时，下一次发生实质修改前必须先审计真实源码、WXML/WXSS/JS/JSON、H5 镜像、API、示例、测试和 Ledger，再按 [合同模板](./CONTRACT_TEMPLATE.md) 建立合同；禁止批量生成未经审计的空壳文档。
4. 结构、Slot、Token、状态优先级、预览或跨端边界发生变化时，必须同步更新组件合同和专项测试。
5. 不得把临时截图结论、完整 Props 表或重复 API 塞进合同；只记录长期语义、已确认取舍和可执行约束。
6. 组件合同与真实源码冲突时不能静默选一边：先定位原因，再同步修正源码、合同、Ledger 和测试。

## 已建立合同

- [Dialog](./DIALOG.md)：中心模态的三区结构、间距、状态组合、生命周期、预览与跨端边界。
- [Button](./BUTTON.md)：精简操作 API、分区预览、事件集中展示、平台转发和跨端边界。
- [ButtonGroup](./BUTTON-GROUP.md)：连续相关操作、默认全宽、单一集合 Surface、子 Button 事件与组级禁用边界。
- [AspectRatio](./ASPECT-RATIO.md)：小程序百分比比例占位、默认 Slot、裁切策略与纯布局边界。
- [Direction](./DIRECTION.md)：局部双向阅读方向、语言解析、Provider 透明边界与完整退役条件。
- [ConfigProvider](./CONFIG-PROVIDER.md)：视觉 Token 继承、跨页面 Store、事件去噪和画布边界。
- [Icon](./ICON.md)：本地 Icon Font、稳定码点、currentColor/Token、数字 rpx 尺寸、图片分支、失败回退与展示叶子边界。
- [Divider](./DIVIDER.md)：连续默认线、内容与 Slot 显隐、横竖布局、语义和展示型边界。
- [Card](./CARD.md)：独立内容 Surface、三段条件结构、Slot 事件边界与阴影 Prop 语义。
- [Cell](./CELL.md)：精简信息行、Slot 组合、受控选择、真实导航与交互门禁。
- [Badge](./BADGE.md)：数量与红点展示、宿主组合、零值与上限、自动独立布局和无事件边界。
- [Bubble](./BUBBLE.md)：消息表面、连续分组、回应、受控展开、显隐与会话职责边界。
- [Alert](./ALERT.md)：页面内语义提示、受控显隐、关闭回写与连续退场边界。
- [Avatar](./AVATAR.md)：图片、Icon、文本与默认 Slot 回退、展示叶子边界和跨端资源事件。
- [Image](./IMAGE.md)：真实图片状态、安全尺寸、原生解码能力、覆盖 Slot 与展示叶子边界。
- [Tag](./TAG.md)：精简状态标记、形状与安全宽度、关闭请求和展示型交互边界。
- [Grid](./GRID.md)：数据驱动入口、横向滚动、状态组合、真实点击与父级重试边界。
- [CountDown](./COUNTDOWN.md)：目标时间倒计时、声明式暂停、精简事件方法和跨端计时边界。
- [Table](./TABLE.md)：小屏结构化数据、局部滚动、固定列、受控选择排序和状态闭环。
- [Swiper](./SWIPER.md)：原生 Swiper、单一 Navigation、受控切换、Generic 和状态闭环。
- [Collapse](./COLLAPSE.md)：严格原始值、受控多面板、default/card、Generic 和固定高度动效。
- [Collapsible](./COLLAPSIBLE.md)：单 Trigger/Content、受控开合、状态优先级与连续高度动画。
- [Input](./INPUT.md)：精简单行输入、受控连续性、加权字符、状态/Slot 组合和固定事件顺序。
- [InputOTP](./INPUT-OTP.md)：分格验证码、粘贴填充、真实 value 回写与平台输入边界。
- [Field](./FIELD.md)：透明字段布局、标签/帮助/反馈组合、PUI 子控件边界和零业务事件。
- [Label](./LABEL.md)：表单标签、必填标记、冒号与默认 Slot 的透明组合边界。
- [Textarea](./TEXTAREA.md)：精简多行输入、受控连续性、加权字符、自动增高、状态/Slot 组合与平台事件边界。
- [Switch](./SWITCH.md)：精简二元输入、原始自定义值、文字/图标、固定状态门禁与单一 change 事件。
- [Checkbox / CheckboxGroup](./CHECKBOX.md)：单项身份、数组多选、全选半选、真实 relation 与单一 change 事件。
- [Radio / RadioGroup](./RADIO.md)：单项身份、标量互斥选择、严格原始值、真实 relation 与单一 change 事件。
- [Form](./FORM.md)：受控数据、集中规则、真实 Field relation、提交/重置顺序与服务端消息回填。
- [Picker](./PICKER.md)：数据驱动滚轮、多列与级联、草稿确认、受控显隐和严格原始值边界。
- [DateTimePicker](./DATE-TIME-PICKER.md)：Picker 日期时间适配、精度模式、范围步长、格式、草稿确认与双受控边界。
- [Search](./SEARCH.md)：精简搜索输入、PUI Input/Button 组合、字符边界、清空顺序与业务结果外置。
- [Select](./SELECT.md)：原生 Picker 单选、受控回写、禁用项与 H5 菜单近似边界。
- [Combobox](./COMBOBOX.md)：可搜索选择、三重受控、PUI 输入组合、状态优先级与概览边界。
- [Stepper](./STEPPER.md)：边界数值调整、PUI Input/Button 组合、输入草稿提交、overlimit 与受控回写。
- [Slider](./SLIDER.md)：微信原生单滑块、连续拖动、受控回写、表单字段与单一提交事件。
- [Rate](./RATE.md)：点击与连续拖动评分、整星/半星、PUI Icon 裁切、受控回写与单一 change 事件。
- [Upload](./UPLOAD.md)：微信媒体/聊天文件选择、列表与网格、真实文件状态、校验与声明式回写。
- [Calendar](./CALENDAR.md)：严格日期、三种选择模式、双受控显隐、完整视口弹层、状态和精简事件边界。
- [Navbar](./NAVBAR.md)：页面顶部三列结构、声明式显隐、消费者导航、三 Slot 和精简事件边界。
- [Breadcrumb](./BREADCRUMB.md)：辅助路径导航、受控选择、内部横滚、状态优先级与不自动路由边界。
- [NavigationMenu](./NAVIGATION-MENU.md)：可展开导航、五重受控、PUI Button/Cell 组合、完整浮层与跨端导航边界。
- [Tabs](./TABS.md)：同层内容分类、严格原始值、单一测量指示器、自动横滚、精简事件和滑动边界。
- [Tabbar](./TABBAR.md)：应用一级目的地、严格原始值、Button/Badge/Icon 组合、固定占位、安全区和精简事件边界。
- [Steps](./STEPS.md)：流程阶段展示、严格原始值、状态推导、横纵/正反序和单一 change 事件边界。
- [Indexes](./INDEXES.md)：长分组集合、严格索引值、侧栏触摸定位、滚动联动和 Cell/Badge/Loading/Empty 组合边界。
- [Sidebar](./SIDEBAR.md)：垂直同层导航、严格 String/Number 值、分组与 Button/Badge/Icon/Loading/Empty 组合边界。
- [BackTop](./BACKTOP.md)：外部滚动位置、唯一回顶事件、四种主题、Button 组合与页面滚动边界。
- [FAB](./FAB.md)：Button 家族的圆形/扩展浮动操作表面、主题与父级定位边界。
- [Sticky](./STICKY.md)：页面滚动定位、同高占位、默认 Slot、容器函数边界与唯一 scroll 事件。
- [Loading](./LOADING.md)：声明式进行中反馈、延迟与退场、三种指示器、三 Slot 与无事件边界。
- [TopLoading](./TOP-LOADING.md)：页面或卡片顶部请求轨道、未知/精确进度、显式完成、防闪烁与低动效边界。
- [DynamicMessage](./DYNAMIC-MESSAGE.md)：顶部 retained 通知、同 key 原位更新、不同 key 队列、真实 Action/关闭与非模态边界。
- [AreaChart](./AREA-CHART.md)：共享零基线面积趋势、Canvas/SVG 双端、渐变填充、默认入场与透明展示叶子边界。
- [BarChart](./BAR-CHART.md)：共享零基线条形、分段增量、透明渐变、图例和透明展示叶子边界。
- [Waffle](./WAFFLE.md)：圆润点阵、显式有效单位、分段透明度、轮廓和透明展示叶子边界。
- [DonutChart](./DONUT-CHART.md)：圆润渐变圆环、中心摘要、图例、可重播入场和透明展示叶子边界。
- [RadarChart](./RADAR-CHART.md)：多维多系列轮廓、渐隐面积、节点、图例和透明展示叶子边界。
- [SortableList](./SORTABLE-LIST.md)：连续集合、单滚动所有权、拖拽排序、父级回写与焦点恢复边界。
- [Tour](./TOUR.md)：目标测量、四向遮罩、步骤受控、定位失败关闭和焦点闭环。
- [List](./LIST.md)：数据驱动连续信息行、正文与 Footer 双状态优先级、真实 load/retry 边界。
- [VirtualList](./VIRTUAL-LIST.md)：固定行高窗口、真实局部滚动、选择回写与状态边界。
- [Toast](./TOAST.md)：单条命令式反馈、Overlay、具名 Slot、自动收起与 close 边界。
- [Progress](./PROGRESS.md)：确定任务完成度、三种形态、唯一 label Slot、无事件和外部状态组合边界。
- [Skeleton](./SKELETON.md)：受控结构占位、安全行列、默认 Slot 回显、零事件/方法和跨端低动效边界。
- [Empty](./EMPTY.md)：空内容图形、说明与三种具名 Slot、零事件/方法和消费者业务动作边界。
- [NoticeBar](./NOTICEBAR.md)：页面内公告、横向跑马/纵向轮播、四个具名区域、受控显隐与精简事件边界。
- [Result](./RESULT.md)：结果状态展示、四种主题、图形优先级、三个具名区域与零事件/方法边界。
- [PullRefresh](./PULLREFRESH.md)：内置滚动容器、下拉刷新主干、受控展开、header/default Slot 与超时边界。
- [Popup](./POPUP.md)：基础浮层的显隐请求、完整遮罩、位置、滚动保护、三 Slot 与最小事件边界。
- [Sheet](./SHEET.md)：底部操作面板的 Header/Body/Footer、局部滚动、下拉关闭、状态优先级与保留入口预览边界。
- [Popover](./POPOVER.md)：锚点气泡、唯一显隐请求、12 向定位、双 Slot 和外部点击边界。
- [ActionSheet](./ACTION-SHEET.md)：情境动作列表、宫格分页、受控显隐、最小事件与默认内容边界。
- [DropdownMenu](./DROPDOWN-MENU.md)：并列筛选项、单选/多选事件顺序、完整遮罩、两个 Slot 与精简 API 边界。
- [Overlay](./OVERLAY.md)：受控全屏遮罩、唯一 click 请求、默认 Slot 与滚动/导航栏上下文边界。
- [SwipeCell](./SWIPE-CELL.md)：列表项横向操作、三 Slot、最小公开事件与手势/动效边界。
- [Watermark](./WATERMARK.md)：内容水印绘制、两 Slot、文本/图片铺排、动态位置和展示层边界。
- [ScrollArea](./SCROLL-AREA.md)：原生纵向增强滚动、目标 id 定位、默认 Slot 和薄封装边界。

后续组件按真实 battle 和“修改即迁移”顺序逐个补充，不为凑数量批量生成空壳文档。开始新会话时可直接使用 [PoemUI 新会话启动提示词](../NEW_SESSION_PROMPT.md)。
