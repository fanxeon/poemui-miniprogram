# 组件选择

选择能完成任务的最少组合，不为展示数量堆叠组件。

| 用户任务 | 首选组合 |
| --- | --- |
| 主要或次要操作 | Button + Icon |
| 只读信息行 | Cell；集合使用 CellGroup |
| 可编辑单行信息 | Field / Input；不要用 Cell 模拟输入 |
| 表单反馈 | Field/Input + 真实校验状态；提交使用 Button |
| 空、错误和重试 | Empty + Button；加载使用 Loading 或 TopLoading |
| 轻量反馈 | Toast / NoticeBar / Alert |
| 页面顶部实时状态 | DynamicMessage |
| 边缘任务面板 | Popup；底部动作列表使用 ActionSheet |
| 模态确认 | Dialog |
| 选项和数值 | Select、Picker、Checkbox、Radio、Switch、Slider、Stepper、Rate |
| 长列表 | List / VirtualList；滚动边界使用 ScrollArea |
| 页面导航 | Navbar、Tabs、Tabbar、Sidebar、NavigationMenu |
| 状态和标记 | Badge、Tag、Progress、Result |
| 全局视觉 | ConfigProvider + `visualConfig` |

选择前读取安装版本的 `miniprogram_dist/index.js`，确认组件确实公开。不要因为 H5 目录或 metadata 出现名称，就假设 npm 包内可安装。

状态职责属于组件时使用组件公开 API；业务请求状态不属于组件时，由页面组合 Loading、Empty、Button 等承接，不要伪造父组件 Props。
