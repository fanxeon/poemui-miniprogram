# PoemUI 小程序“我的”页合同

本文约束示例小程序一级目的地 `pages/me/index`。它是 PoemUI 组件的真实消费页面，不是新的 npm 组件，也不复制到官网标准组件预览。

## 1. 页面目标

- 页面只承载必要的账户资料和服务入口，不扩展头像上传、背景、签名或复杂个性化。
- 资料版头把 Avatar 与唯一的 PUI 昵称编辑区置于同一行；不再先展示不可编辑昵称、再重复渲染第二个输入区。Clear 与单图标保存按钮共同位于 Input 的尾部操作轨。保存按钮通过公共 `suffix="slot"` 组合，不在输入框下方复制第二个文案按钮；保存结果写入本地 `poemui-user-profile`，刷新和跨页面返回后恢复。
- 页面不展示、读取、缓存或复制 OpenID；资料 Store 只保存昵称。旧资料对象中可能残留的身份字段不再被读取，并会在下一次昵称保存时随资料对象收敛而退出。
- “更新公告”从诗上共享云环境的 `pui_updatelog` 读取并打开受控 PUI Popup；云端失败时依次回退缓存和包内同形公告，来源不得伪装。

## 2. PUI 组合

页面根使用 `pui-config-provider use-global-config`，结构固定为非 fixed PUI Navbar、唯一 PUI ScrollArea 与非 fixed PUI Tabbar。资料和服务区组合：

- `pui-card + pui-avatar + pui-input + pui-button`：头像与单一昵称编辑行。Avatar 是展示叶子，Input 以自身 `label="昵称"` 提供字段语义；不得再增加静态昵称标题或身份副标题。
- `pui-cell-group + pui-cell`：授权、订单、更新公告、隐私协议与关于诗上五个服务入口；整个服务区相对昵称资料卡额外使用一个 `--pui-section-gap`。它与正文的分区 gap 共同保留 Surface 投影安全空间，且在阴影关闭时仍保持同一几何，不以魔法数补空白。
- `pui-button open-type="contact"`：投影到 Navbar 最左侧公开 `left` Slot 的 `text + transparent + small + circle + iconOnly` 透明图标操作，真实交给微信客服会话能力；`capsule=true` 下由 Navbar 的左侧胶囊镜像轨定位，右 Slot 保持为空。它不显示灰底、边框或外投影，不占正文、不固定、不悬浮，也不以满宽文案按钮抢占服务列表层级。平台失败通过 Button `error` 事件进入 PUI Toast。
- `pui-popup + pui-scroll-area + pui-tag + pui-icon + pui-top-loading + pui-button`：公告 Header、最大高度 `78vh` 的唯一滚动内容区、组件改动层级、Surface 顶边同步状态与全宽 Footer。Popup 必须设 `contentScrollable=false`，避免与内部 ScrollArea 竞争滚动。TopLoading 必须通过 Popup `surface-top` Slot 贴住面板顶边，不能放进 Content；它只在请求开始时进入 `loading`，真实云端成功后进入 `success`，缓存、本地回退或异常直接回到 `idle`。
- `pui-toast`：只反馈真实平台回调、输入错误或明确的未开放状态。

页面不得手写原生 Button/Input、第二个 ScrollArea、独立图标字符或重复的 Tabbar 占位壳。昵称保存必须直接绑定 suffix Slot 中的 PUI IconButton，Input 只负责尾部排列，不代理保存结果。Card/CellGroup 是唯一可见 Surface，Avatar、Input、Button、Cell 不获得页面私有阴影。

## 3. 服务入口

| Cell | 真实动作 | 当前边界 |
| --- | --- | --- |
| 高级版商业授权 | Cell 显示“查阅详情”；当前点击以 PUI Toast 提示“授权详情正在准备中” | 没有后端和支付合同，不调用 `wx.requestPayment` |
| 我的订单 | PUI Toast 提示“订单服务尚未开放” | 没有订单数据源，不创建假列表或假路由 |
| 更新公告 | 受控 PUI Popup 陈列版本、日期和按组件分组的改动；打开时刷新共享云公告 | 共享环境 `poemcoder-1gkbkid139b08f45`，集合 `pui_updatelog`；失败时回退缓存/包内内容 |
| 用户私隐协议 | `wx.openPrivacyContract` | 依赖当前微信基础库与小程序隐私配置 |
| 关于诗上 | `wx.navigateToMiniProgram` 打开正式版 `wxa1b9a4d6549c6cd1` | 失败由平台回调显示 PUI Toast |
| 联系客服 | Navbar 最左侧 `left` Slot 中的透明圆形 PUI IconButton，以 `open-type="contact"` 打开微信客服会话 | 依赖小程序后台客服配置；失败由平台 `error` 事件显示 PUI Toast |

## 4. 资料 Store 边界

`miniprogram/common/utils/user-profile.js` 是该页面唯一资料读写入口：

- `restore()`：只读取 `poemui-user-profile.nickname`，昵称缺失时使用 `PoemUI 用户`。
- `setNickname()`：去除首尾空白并限制 20 个 Unicode 字符，持久化对象只包含 `nickname`。
- Store 不公开身份字段或身份写入桥接，也不读取 `App.globalData` 和旧 `openid` 存储键。
- 存储失败必须返回失败结果；页面不能先显示保存成功。

该 Store 不是认证系统；后续若引入登录，必须使用独立服务端身份合同，不能重新把身份字段塞回本地昵称资料对象。

## 5. H5 同步边界

“我的”是示例小程序应用页面，不作为官网组件目录或 PreviewDevice 路由。H5 同步的是它消费的 Card、Avatar、Input、Button、Cell/CellGroup、Toast、Navbar、ScrollArea、Tabbar 与 ConfigProvider 的既有组件合同；不得为该页面再维护一套 H5 业务壳或伪造微信隐私合同和跨小程序跳转。

更新公告 Popup 继续消费 Popup、Tag、Icon、TopLoading 与 Button 的既有双端合同，但官网不复制该业务公告；客服入口的 Navbar 最左侧 `left` Slot 边界与 `text/transparent/small/circle/iconOnly` 几何继续由 Navbar/Button 双端合同覆盖，微信 `open-type="contact"` 不在 H5 伪造成功。多小程序共享公告的后端边界见 `docs/SHARED_MINIPROGRAM_CLOUD_SERVICE.md`。

## 6. 验收

```sh
node scripts/test-miniprogram-me-page.js
node scripts/test-miniprogram-tabbar-pages.js
node scripts/test-miniprogram-home.js
npm run check
```

开发者工具需使用 390×844 验证昵称输入/保存、OpenID 入口不存在、长内容滚动、五个服务 Cell、更新公告 Popup、Tabbar，以及浅色/深色和外观组合。隐私合同、跨小程序跳转、软键盘、读屏与 iOS/Android 真机必须单独验证；模拟器、Node 测试或编译成功不能替代真机。

2026-07-27 已在微信开发者工具 390px 模拟器完成昵称 Input 的组件级几何与真实事件链复核：Avatar 与带 `label="昵称"` 的唯一 Input 同行，静态昵称和“PoemUI 用户”副标题不存在；Field 340px、输入主轨 214px、Trailing 72px，Clear/保存宿主各 33px、间距 6px。真实点击 Input 改写昵称并点击 PUI Button `onTap` 后，PUI Toast 显示“昵称已保存”；随后通过页面 Store 回写恢复 `PoemUI 用户`。默认 `shadow=true` 时，资料 Input 与服务 CellGroup 使用两段 section 关系保留投影空白，截图分别为 `/tmp/poemui-me-inline-nickname-390.png` 与 `/tmp/poemui-me-shadow-clearance-390.png`。此结果不替代 iOS/Android 真机的中文输入法、键盘收起、双触摸区、读屏与深色/毛玻璃/大圆角组合验收。

同日更新公告完成独立滚动验收：390px 模拟器中的 PUI ScrollArea 为 `336×553px`，即当前视口 `78vh`；运行态临时追加第二条长公告并受控滚至 `scrollTop=700` 后，Header 保持顶部，Footer Button 的几何在滚动前后均为 `left=27 / top=772 / 336×45px`。临时公告已通过真实云端刷新移除，页面恢复 `announcementSource=cloud` 的唯一正式公告。
