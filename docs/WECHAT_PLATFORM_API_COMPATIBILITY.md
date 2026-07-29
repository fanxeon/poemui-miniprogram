# 微信平台信息接口兼容规则

PoemUI 不再调用已弃用的 `wx.getSystemInfoSync()`。运行时信息由 `common/utils/platform-info.js` 统一读取，读取失败时返回空对象，由消费组件维持已声明的安全默认值。

| 需要的信息 | 官方接口 | 当前消费者 |
| --- | --- | --- |
| 窗口宽高、状态栏、安全区、Canvas DPR | `wx.getWindowInfo()` | Navbar、Icon、Overlay、Popover、Rate、Sheet、SwipeCell、Tabs、VirtualList、Watermark、AreaChart、DynamicMessage 与小程序页面高度/rpx 换算 |
| 设备平台 | `wx.getDeviceInfo()` | 历史本地 navigation-bar 兼容分支 |
| 语言、主题、SDK 信息 | `wx.getAppBaseInfo()` | Direction、主题解析 |

`wx.getSystemSetting()` 与 `wx.getAppAuthorizeSetting()` 只在组件确实需要系统设置或授权状态时调用；当前组件库没有读取它们的业务需求，不得为了替代旧接口而无意义调用。

后续组件需要平台信息时只能调用共享工具，不得恢复 `wx.getSystemInfoSync()` fallback。修改后必须运行 `scripts/test-platform-info.js` 和相关组件专项测试，并由微信开发者工具确认控制台不再输出弃用告警。

## 系统深浅色同步

微信官方 DarkMode 合同要求 `app.json` 声明 `darkmode:true` 才能从系统信息获得 `theme` 并触发主题切换事件；启用 DarkMode 时同时通过 `themeLocation` 提供包含 `light/dark` 的变量文件。PoemUI 示例小程序在 `miniprogram/app.json` 启用该能力，并使用当前 `wx.getAppBaseInfo()` 的共享封装读取主题，不恢复已弃用的聚合接口。

`miniprogram/app.js` 在 `onLaunch` 先恢复 `visualConfig`，随后在 `onLaunch/onShow` 读取当前系统主题，并在 `onThemeChange` 使用事件中的合法 `light/dark`。三条路径都写入唯一 Store，`persist:false` 保证系统运行态不会覆盖用户保存记录；页面根 `use-global-config` Provider 与共享 AppearanceSettings 通过订阅同步显示，不能复制页面私有 theme 状态。该入口同步不替代每页 Provider，也不改变 npm Store 的公开默认值。

官方依据：[DarkMode 适配指南](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/darkmode.html)、[`wx.getAppBaseInfo()`](https://developers.weixin.qq.com/miniprogram/dev/api/base/system/wx.getAppBaseInfo.html)、[`wx.onThemeChange`](https://developers.weixin.qq.com/miniprogram/dev/api/base/app/app-event/wx.onThemeChange.html)。

2026-07-29 的回归审计补充覆盖 `area-chart/area-chart.js` 的 Canvas DPR、`dynamic-message/dynamic-message.js` 的顶部安全区，以及 `miniprogram/pages/styles/index.js` 的 rpx 换算。三处均复用 `platform-info`；专项门禁不再维护易漏的手工文件清单，而是自动遍历 74 个发布组件、`common/` 与真实小程序 `common/components/pages/utils` 运行时源码。

## 微信开发者工具内部 preload 警告边界

Nightly 2.02.2607282 / 基础库 3.17.0 的 Chromium Console 会对 `127.0.0.1:<port>/__dev__/WAAutoService.js` 与 `WAServiceMainContext.js` 输出 “preloaded using link preload but not used” 警告。这两个 URL、preload 标签和本机资源服务器属于微信开发者工具 appservice，不由 PoemUI 的 WXML、页面 JS、npm 产物或工程配置创建。

遇到该警告必须先清空 Console 后重编译，并区分 DevTools Console 与小程序运行时 console。不得通过关闭 `compileHotReLoad`、删除 `lazyCodeLoading: requiredComponents`、修改生成目录或过滤全部 warning 冒充修复；这些操作不能为工具内部 preload 补写 `as` 属性，反而会损失真实诊断。项目路径、`pages/` 或 `miniprogram_npm/` 指向的警告仍需单独审计，不能与此环境边界混为一谈。
