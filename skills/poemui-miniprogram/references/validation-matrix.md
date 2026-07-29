# 验收矩阵

| 改动范围 | 至少验证 | 不能据此声称 |
| --- | --- | --- |
| 消费工程页面 | `inspect-project`、`verify-install`、页面真实交互、开发者工具 build-npm | 组件库源码或真机已验收 |
| 单组件 API/结构 | 专项测试、合同/API、WXML/WXSS 编译、H5 真实交互 | 跨端或真机全部通过 |
| Token/外观/Surface | 代表组件计算样式或几何、light/dark、相关开关组合、390px、H5 镜像 | 只因根 data/class 切换就称开关生效 |
| 浮层/滚动 | 唯一滚动区、遮罩覆盖、打开/关闭/焦点、390px 边界 | 静态截图或容器存在即正确 |
| 输入/受控事件 | focus、输入、clear、suffix、`0/false/''`、父级回写、失败恢复 | 仅可见 input 即可输入 |
| 小程序发布兼容 | 源码 WXML/WXSS 扫描、`miniprogram:build`、示例安装、真实 build-npm | 手改 `miniprogram_npm` 或构建成功即真机可用 |
| 微信平台能力 | success/fail/cancel、权限拒绝、开发者工具实际调用 | H5 或模拟回调成功等于真机能力 |

## 报告格式

按证据分开写：

1. **已验证**：命令、实际交互、截图/计算样式或构建产物，以及结果。
2. **未验证**：例如 iOS/Android 真机、真实网络/授权；说明风险而非写“应该可用”。
3. **已有工作区基线问题**：与本次改动无关的失败、dirty 文件或环境缺失，不把它归因为本次修复。

## 典型外观组合

涉及全局外观时至少覆盖默认、light/dark、shadow on/off、frost on/off、border on/off、large radius on/off、equal spacing on/off 与低动效；按实际组件裁剪无关组合，但要记录裁剪理由。

真机验收使用已打开的开发者工具热重载和清缓存。没有直接真机操作与观察证据时，结论固定为 `未验证`。
