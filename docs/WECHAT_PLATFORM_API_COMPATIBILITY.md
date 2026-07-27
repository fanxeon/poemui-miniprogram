# 微信平台信息接口兼容规则

PoemUI 不再调用已弃用的 `wx.getSystemInfoSync()`。运行时信息由 `common/utils/platform-info.js` 统一读取，读取失败时返回空对象，由消费组件维持已声明的安全默认值。

| 需要的信息 | 官方接口 | 当前消费者 |
| --- | --- | --- |
| 窗口宽高、状态栏、安全区 | `wx.getWindowInfo()` | Navbar、Icon、Overlay、Popover、Rate、Sheet、SwipeCell、Tabs、VirtualList、Watermark 与小程序页面高度计算 |
| 设备平台 | `wx.getDeviceInfo()` | 历史本地 navigation-bar 兼容分支 |
| 语言、主题、SDK 信息 | `wx.getAppBaseInfo()` | Direction、主题解析 |

`wx.getSystemSetting()` 与 `wx.getAppAuthorizeSetting()` 只在组件确实需要系统设置或授权状态时调用；当前组件库没有读取它们的业务需求，不得为了替代旧接口而无意义调用。

后续组件需要平台信息时只能调用共享工具，不得恢复 `wx.getSystemInfoSync()` fallback。修改后必须运行 `scripts/test-platform-info.js` 和相关组件专项测试，并由微信开发者工具确认控制台不再输出弃用告警。
