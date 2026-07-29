# 小程序独立组件页内容验收矩阵

本文记录 2026-07-27 对首页中“布局 / 导航 / 表单组件 / 数据展示 / 反馈 / 高级”六个分区的内容修缮结果。`开始与规范 / 基础组件 / 浮层` 不在本轮范围。

## 统一验收标准

- 页面必须真实挂载自身 PUI 组件，不能用说明文字、静态截图或空分区冒充示例。
- 首屏优先展示用户能理解的代表任务；标题说明“解决什么问题”，不以“基础用法”、Props、Slot、受控值或事件日志作为视觉中心。
- 同页至少覆盖一个重要状态或关键边界；只有一个示例时，该示例必须同时承载核心交互与边界。
- 错误态的重新加载只提出请求，不能自动伪造数据恢复；完成、关闭和计时结束也不能被描述为业务成功。
- 标准页复用共享 Navbar、唯一 ScrollArea 和 `component-page-section`；ScrollArea、PullRefresh、VirtualList 由自身承担滚动，不再嵌套第二纵向滚动区。
- 同一操作区恰好有两个 PUI Button 时使用共享两列 Grid，按钮各自填满一列并以 `--pui-content-gap` 保留 `16rpx` 间距；Switch、Label、Icon 与文案等普通内容行不套用该规则。
- 不手写原生 Button/Input，不新增页面私有颜色或重复组件实现。

## 逐页内容矩阵

| 分区 | 页面 | 代表场景 | 重要状态或边界 |
| --- | --- | --- | --- |
| 布局 | AspectRatio | 封面图比例预览 | 1:1 / 16:9 与内容裁切 |
| 布局 | Direction | 中英文与阿拉伯文阅读方向 | LTR / RTL / Auto |
| 布局 | Grid | 组件分类入口 | 两列/三列、禁用项、加载失败与真实恢复 |
| 布局 | ScrollArea | 组件更新长列表 | 唯一滚动区、遮罩开关、sm/md/lg 尺寸增减 |
| 布局 | Sticky | “本月更新”分组标题与十条正文 | 足够滚动距离、顶部偏移与暂停吸顶 |
| 导航 | Navbar | 编辑页标题和左侧搜索/菜单 | 整条 Navbar 显隐、右侧胶囊安全区 |
| 导航 | NavigationMenu | 顶部目录与同层双栏分类 | 浮层互斥、加载失败与重新加载 |
| 导航 | Tabs | 四项内容分类 | 四项等分、超过四项露出半项、禁用项 |
| 导航 | Breadcrumb | 组件库当前位置 | 长路径与可返回层级 |
| 导航 | Tabbar | 首页/收藏/创建/我的 | Badge、纯图标、固定与安全区 |
| 导航 | Steps | 发布任务进度 | 前进、后退、完成、不可用步骤与横纵连线中心 |
| 导航 | BackTop | 长内容快速回顶 | 与同一 ScrollArea 共享 `scroll-top` |
| 导航 | Indexes | 按首字母找组件 | 十四个分组、可持续滚动、当前索引高对比居中与条目选择 |
| 导航 | SideBar | 组件分类工作区 | 左侧单选驱动右侧真实内容，并展示可理解的只读分类 |
| 表单 | Form | 填写组件资料 | 必填校验、草稿/公开选择、提交边界 |
| 表单 | Field | 组件名称字段 | 帮助信息与长度错误 |
| 表单 | Label | 字段标签 | 必填标记与冒号显示 |
| 表单 | Input | 输入组件名称 | 清除、确认、只读与禁用 |
| 表单 | InputOTP | 六位验证码 | 空格可见、完成输入、掩码与错误 |
| 表单 | Textarea | 填写组件说明 | 字数反馈、只读与错误 |
| 表单 | Search | 查找组件 | 清除、确认、圆角与禁用 |
| 表单 | Checkbox | 选择显示偏好 | CheckboxGroup 文案可见、多选上限、单项协议与禁用 |
| 表单 | Radio | 选择发布通道 | RadioGroup 文案可见、单选互斥与禁用 |
| 表单 | Switch | 开启通知 | 加载、只读与禁用 |
| 表单 | Select | 选择版本通道 | PUI Button Trigger、PUI Popup 选项层、只读与禁用 |
| 表单 | Picker | 滚动选择版本 | 打开、确认与取消 |
| 表单 | Combobox | 搜索并选择组件 | 结果选择、加载与禁用 |
| 表单 | Slider | 调整完成度 | 拖动中/确认、只读与禁用 |
| 表单 | Stepper | 调整数量 | 步长、输入限制、禁用与 minus/value/plus 连续几何 |
| 表单 | Rate | 内容评分 | 半星、只读与禁用 |
| 表单 | Calendar | 选择发布日期 | 周末不可选、确认与取消 |
| 表单 | DateTimePicker | 选择发布日期和时间 | 分钟步长、默认图标 Header 确认/取消、Classic 底部操作 |
| 表单 | Upload | 选择预览图片 | 待上传、上传中、失败；失败原因单一、右侧重试真实回执且不冒充服务器上传 |
| 数据展示 | Collapse | 常见问题集合 | 多项展开与单项互斥 |
| 数据展示 | Avatar | 用户头像 | 合法尺寸、形状与图片回退 |
| 数据展示 | Badge | 未读数量 | 0、封顶数量与提醒点 |
| 数据展示 | Bubble | 连续对话消息 | 分组圆角、长消息展开与反应 |
| 数据展示 | Card | 发布检查摘要 | Footer 操作与禁用卡片 |
| 数据展示 | Cell | 常用组件入口 | 导航与单项选择 |
| 数据展示 | Collapsible | 发布检查清单 | 展开/收起与只读内容 |
| 数据展示 | CountDown | 验证码等待时间 | 开始、暂停、归零与长时格式 |
| 数据展示 | Image | 品牌图片 | 加载、失败与重新读取 |
| 数据展示 | List | 员工资料 | 受限条目、加载失败、请求与真实恢复分离 |
| 数据展示 | SwipeCell | 消息快捷操作 | 滑动操作与禁用边界 |
| 数据展示 | Swiper | 产品亮点轮播 | 分页导航、加载错误与恢复 |
| 数据展示 | Table | 组件验收结果 | 固定列、横向查看、排序与多选 |
| 数据展示 | Tag | 状态与筛选标签 | 可关闭标签与单选筛选 |
| 反馈 | Alert | 草稿自动保存提醒 | 可关闭、长内容对齐与三种重要程度 |
| 反馈 | Dialog | 删除草稿确认 | 取消/关闭、内容状态、禁止遮罩关闭 |
| 反馈 | Empty | 收藏为空与搜索为空 | 清除筛选的恢复入口 |
| 反馈 | Loading | 准备组件目录 | 紧凑/纵向布局与明确进度 |
| 反馈 | NoticeBar | 服务更新公告 | 多条轮播、警告主题与关闭后恢复 |
| 反馈 | Progress | 资源下载进度 | 递增、重置、进行中与完成形态 |
| 反馈 | Result | 发布结果 | 成功结果、待处理结果与下一步 |
| 反馈 | Skeleton | 内容加载前轮廓 | 真实内容回显、头像与段落结构 |
| 反馈 | Toast | 保存草稿短反馈 | 处理中不提前成功、成功提示与自动结束 |
| 高级 | PullRefresh | 最近更新列表 | 顶部下拉、显式结束、超时；不伪造远端成功 |
| 高级 | VirtualList | 120 条组件资源 | 真实窗口滚动、单选/多选与禁用项 |
| 高级 | Watermark | 内部资料预览 | 排列、移动、水印下方按钮仍可操作 |

## 自动验收入口

`scripts/test-miniprogram-component-page-quality.js` 对以上 61 页逐页检查真实组件挂载、页面壳、滚动所有权、空分区、原生控件和通用标题退化。各分区专项测试继续验证真实值回写和关键交互：

```sh
node scripts/test-miniprogram-component-page-quality.js
node scripts/test-miniprogram-layout-pages.js
node scripts/test-miniprogram-navigation-pages.js
node scripts/test-miniprogram-form-pages.js
node scripts/test-miniprogram-data-pages.js
node scripts/test-miniprogram-feedback-pages.js
node scripts/test-miniprogram-advanced-pages.js
```

## 数据图形页

旧 `shadcn-chart` H5 研究入口已经退出公开目录。AreaChart、BarChart 与 Waffle 均有原生组件、独立小程序路由、H5 真实镜像、合同与专项测试；AreaChart 小程序使用真实 Canvas 2D、H5 使用同数据合同 SVG，BarChart/Waffle 使用真实 View/Grid/DOM。三者必须使用真实 `items` 渲染，不得用静态图片、Canvas 空壳或仅 H5 页面冒充迁移完成。

## 尚需设备确认

自动门禁和开发者工具模拟器不能替代 iOS/Android 真机。键盘顶起、Picker/Calendar 遮罩、横向/纵向手势竞争、虚拟列表惯性、读屏、系统低动效和安全区仍需合法 AppID 真机验证。
