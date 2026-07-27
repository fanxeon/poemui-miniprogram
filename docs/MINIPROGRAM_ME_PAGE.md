# PoemUI 小程序“我的”页合同

本文约束示例小程序一级目的地 `pages/me/index`。它是 PoemUI 组件的真实消费页面，不是新的 npm 组件，也不复制到官网标准组件预览。

## 1. 页面目标

- 页面只承载必要的账户资料和服务入口，不扩展头像上传、背景、签名或复杂个性化。
- 用户可通过 PUI Input 修改昵称；保存结果写入本地 `poemui-user-profile`，刷新和跨页面返回后恢复。
- OpenID 只从真实登录链注入的 `App.globalData.openid/openId` 或兼容存储读取。页面不得自行计算、随机生成或写死 OpenID。
- 页面没有真实 OpenID 时显示“尚未获取，请先完成登录”，复制 Cell 必须禁用；存在真实值时只展示脱敏文本，复制仍写入完整值。

## 2. PUI 组合

页面根使用 `pui-config-provider use-global-config`，结构固定为非 fixed PUI Navbar、唯一 PUI ScrollArea 与非 fixed PUI Tabbar。资料和服务区组合：

- `pui-card + pui-avatar + pui-input + pui-button`：昵称摘要和编辑。
- `pui-cell-group + pui-cell`：OpenID 与四个服务入口。
- `pui-toast`：只反馈真实平台回调、输入错误或明确的未开放状态。

页面不得手写原生 Button/Input、第二个 ScrollArea、独立图标字符或重复的 Tabbar 占位壳。Card/CellGroup 是唯一可见 Surface，Avatar、Input、Button、Cell 不获得页面私有阴影。

## 3. 服务入口

| Cell | 真实动作 | 当前边界 |
| --- | --- | --- |
| OpenID | `wx.setClipboardData` 写入完整 OpenID；成功/失败由平台回调决定 | 无真实 OpenID 时不可点击 |
| 购买高级版授权 | PUI Toast 提示“高级版授权尚未开放” | 没有后端和支付合同，不调用 `wx.requestPayment` |
| 我的订单 | PUI Toast 提示“订单服务尚未开放” | 没有订单数据源，不创建假列表或假路由 |
| 用户私隐协议 | `wx.openPrivacyContract` | 依赖当前微信基础库与小程序隐私配置 |
| 关于诗上 | `wx.navigateToMiniProgram` 打开正式版 `wxa1b9a4d6549c6cd1` | 失败由平台回调显示 PUI Toast |

## 4. 资料 Store 边界

`miniprogram/common/utils/user-profile.js` 是该页面唯一资料读写入口：

- `restore()`：App 登录态 OpenID 优先于本地兼容值，昵称缺失时使用 `PoemUI 用户`。
- `setNickname()`：去除首尾空白并限制 20 个 Unicode 字符，写入昵称时保留 OpenID。
- `setOpenId()`：为后续真实登录链提供桥接，写入 OpenID 时保留昵称。
- 存储失败必须返回失败结果；页面不能先显示保存成功。

该 Store 不是认证系统。真实 OpenID 获取仍必须由后续登录/后端能力注入，不能在小程序前端推导。

## 5. H5 同步边界

“我的”是示例小程序应用页面，不作为官网组件目录或 PreviewDevice 路由。H5 同步的是它消费的 Card、Avatar、Input、Button、Cell/CellGroup、Toast、Navbar、ScrollArea、Tabbar 与 ConfigProvider 的既有组件合同；不得为该页面再维护一套 H5 业务壳或伪造浏览器 OpenID、微信隐私合同和跨小程序跳转。

## 6. 验收

```sh
node scripts/test-miniprogram-me-page.js
node scripts/test-miniprogram-tabbar-pages.js
node scripts/test-miniprogram-home.js
npm run check
```

开发者工具需使用 390×844 验证昵称输入/保存、无 OpenID 禁用态、长内容滚动、四个 Cell、Tabbar，以及浅色/深色和外观组合。隐私合同、跨小程序跳转、剪贴板权限、软键盘、读屏与 iOS/Android 真机必须单独验证；模拟器、Node 测试或编译成功不能替代真机。
