# 快速样式 Tab：示例优先浏览计划

## 目标

将 `pages/styles/index` 从“复制 utility 类名”的目录，升级为用户可直接理解和观察的样式示例页；所有公开 utility 仍可被完整检索，但页面的首要动作是查看真实组合效果。

## 导航与入口

- Navbar 必须和首页使用同一组 `pui-navbar left-btn/right-btn`：左侧 `search`，右侧 `menu`。
- `leftBtn` 打开受控的“搜索样式” Overlay：PUI Search 过滤完整目录，结果显示类名、所属分类和用途；选择结果只更新当前 Tab 与示例，不复制到剪贴板。
- `rightBtn` 打开首页同合同的底部外观 Popup，并复用 `appearance-settings`；搜索 Overlay 与外观 Popup 必须互斥。

## 五个分类

| Key | 用户分类 | 覆盖 utility | 首个真实示例 |
| --- | --- | --- | --- |
| `layout` | 布局 | display、flex、grid、对齐、定位、层级 | 三列内容区与对齐方式 |
| `size` | 尺寸 | width、height、min/max、aspect | 有界测量轨道中的宽高与比例 |
| `spacing` | 间距 | margin、padding、gap、safe-area | 外层、Surface 与直接结构块的节奏 |
| `typography` | 字体与内容 | 文字角色、字重、颜色、行高、空白、裁切 | 标题、说明和长文本裁切 |
| `background` | 背景 | `pui-bg-*`、`pui-bg-gradient-*`、border、radius、shadow、opacity、深色 Surface | 可直接挂在 View 的背景容器 |

生成器必须把 562 个发布类完整且唯一归入上述五类；溢出、object、position、interaction 和 transition 归入布局，深色文字归入字体，深色 Surface 归入背景。

## 页面结构

1. Navbar 是唯一标题；首屏直接出现 PUI Tabs、`120rpx` 单一当前效果预览和两列目录。
2. 当前效果预览固定透明且无面板，目录以 `8rpx` 关联间距紧随其后；页面只保留一个 ScrollArea。
3. 每个发布类由生成 Schema 声明 `previewKind / previewTarget / previewSafety / previewTheme / previewScaffold`，当前效果只把类挂到真实适格目标。
4. 预览右侧使用 `default / text / small / circle / icon-only` 的 PUI Refresh IconButton；它是低存在感的次要回退动作，不使用 primary 实底或常驻文案。恢复只清空当前分类，不清空其他分类的组合选择。
5. 同类选择按 `group:previewKind` 互斥，可再次取消；不同语义可组合。点击不触发 `wx.setClipboardData` 或成功 Toast。
6. viewport、fixed、hidden、safe-area 等结果必须有界裁切或留下 trace，不能改变页面、Tabs、预览条或目录几何。
7. 切换分类 Tab 时，页面在替换候选数据的同一次受控更新中把唯一目录 ScrollArea 的 `scrollTop` 写为 `0`，由组件既有平滑定位回到新分类首项；不重建 ScrollArea，也不扩张 Tabs API。

## H5 与验收

- H5 Style Utilities 加载同一次生成的 `preview/style-utilities-data.js` 与 scoped `preview/style-utilities.css`，同步五类、语义目标、安全策略、真实计算样式、单一当前效果和分类级恢复。
- H5 当前使用独立的五类示例区而不是小程序 Tabs + 单目录 ScrollArea，因此不伪造同构回顶；若以后收敛为单目录分类切换，必须复用同一“父级受控位置归零、滚动组件不重挂载”规则。
- 以专项契约锁定 Navbar 的双事件绑定、搜索 Overlay、Popup 互斥、五类完整覆盖、无剪贴板调用、搜索选择更新示例。
- 验证小程序 390px、H5 390px、浅深色和外观开关；真机未运行时明确标记未验证。

## 阶段一实施记录

- 目录生成器已按上述五类重新归类，并继续以发布 `utilities.wxss` 为唯一来源。
- 小程序已接入双按钮 Navbar、搜索 Overlay、外观 Popup、五类 Tabs 与“查看示例”条目；没有保留剪贴板或 Toast 分支。
- H5 分类浏览器和属性枚举同步为五类。细调阶段只调整每类示例和移动端几何，不改变本计划规定的分类、搜索和外观入口合同。

## 阶段二语义预览实施记录

- 已新增单一语义分类器，并由目录生成器同时产出小程序和 H5 的 562 条预览数据。
- 小程序已取消把所有选中类拼到共享预览根的实现，改为九类目标路由和固定 `120rpx` 当前效果预览；旧的前后对比结构已废弃。
- 页面几何不再测量 preview DOM；`120rpx` 预览、`8rpx` 关联间距与 `520rpx` 目录最小视口形成稳定预算。
- H5 分类样例同步输出相同的 target、safety、theme 数据属性，结果 class 只命中适格目标；生成的 scoped CSS 覆盖全部 562 类并把 `rpx` 按 1:2 转为 px。
