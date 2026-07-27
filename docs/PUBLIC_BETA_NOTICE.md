# PoemUI 受限 Beta 与授权边界

> 状态日期：2026-07-27
> 当前包版本：`poemui-miniprogram@0.1.0`
> 公共 npm：尚未发布（以 npm Registry 实际可读取为准）
> 公共 GitHub：尚未绑定远端（以公开仓库可 clone 为准）
> H5 文档：已发布至 <https://poemcoder.com/poem-ui/docs/>
> 产品落地页：已发布至 <https://poemcoder.com/poem-ui>

## 对外公告

PoemUI 当前处于受限 Beta 与快速迭代期。组件 API、样式、文档和在线预览仍可能调整，相关服务也可能出现短时不可用，当前暂不提供正式 SLA。

Beta 期间，当前已经开放的组件与功能均可免费体验和评估，现阶段无需购买授权。未来独立发行的 PoemUI Pro 高级组件用于商业项目时需要购买商业授权，正式授权范围、价格和服务内容将在商业版发布前公布。

当前随 `poemui-miniprogram` 根包或公开仓库以 MIT 许可证交付的代码仍遵循 MIT，不会因未来 Pro 计划被追溯改为商业授权。未来 Pro 只适用于尚未进入 MIT Core、以独立包或独立授权渠道发行的新能力。

## 当前 Core / Pro 清单

### MIT Core（当前 0.1.0）

- `miniprogram_dist/` 当前公开入口中的 71 个包组件。
- Theme、Style Utilities、Icon 字体与 `visualConfig`。
- TopLoading、DynamicMessage 等当前已经进入根包的高级交互。
- H5 组件预览、API/WXML/兼容说明与仓库中的 PoemUI AI Skill。

### 未来 Pro（当前未交付）

- 当前没有已发布的 Pro 代码、支付入口或商业授权合同。
- 未来只有独立发行且未进入 MIT 根包的新组件、模板或服务可以进入 Pro。
- 价格、商用主体、授权范围、升级和支持边界均待正式版本发布前另行确认。

## 发布状态与验证口径

- “受限 Beta”是稳定性声明，不自动表示登录白名单或付费门禁。
- 本地构建、tarball、H5 镜像、微信模拟器和公共发布是不同证据。
- 公共 npm、GitHub、H5、公网落地页和微信正式版必须分别验收。
- 正式小程序码尚未提供时只保留明确留白，不生成假二维码。

## 许可证依据

- SPDX MIT License：<https://spdx.org/licenses/MIT.html>
- OSI FAQ：<https://opensource.org/faq>
