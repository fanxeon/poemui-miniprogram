# 多小程序共享云服务方案

本文记录 PoemUI 与其他小程序共享公告、授权和订单等后端能力时的边界。PoemUI 当前已经获得诗上资源小程序生产云环境的共享访问授权，并将更新公告接入共享云数据库；本文同时约束后续 PUI 云集合的命名、读取、缓存与权限边界。

## 1. 能否共享

可以，但接入方式取决于小程序主体：

- **同主体微信小程序/公众号**：优先使用微信开发者工具云开发控制台的“环境共享”，由资源方环境授权调用方使用云函数和云数据库。腾讯云当前官方 FAQ 明确说明，该能力面向同主体应用。
- **不同主体，或需要同时服务 Web/App**：使用独立 CloudBase HTTP 访问服务或自有 HTTPS API。每个小程序分别配置合法 request 域名，服务端按可信登录结果校验 AppID、用户和权限；不能把云数据库管理员密钥放进客户端。

官方依据：

- [腾讯云 CloudBase 账号相关问题](https://cloud.tencent.com/document/product/876/57380)
- [腾讯云 CloudBase 产品概述](https://cloud.tencent.com/document/product/876/18431)

当前已确认资源方 AppID 为 `wxa1b9a4d6549c6cd1`，共享生产环境为 `poemcoder-1gkbkid139b08f45`。环境是否共享成功仍必须以调用方真实 `Cloud.init()` 和数据库读取结果验收，不能只以控制台出现环境名称代替运行态。

## 2. 推荐架构

```text
PoemUI 小程序 ─┐
其他小程序 ────┼─> 公告/授权/订单 API ─> 共享业务数据库
Web 管理后台 ──┘           │
                           └─> 按可信 AppID + 用户身份授权
```

- 公共公告可以共享同一集合，但必须保留 `product`、`audience`、`status` 和发布时间。
- 用户、授权和订单必须按可信 AppID、主体和用户身份分区，不得只信任客户端传入的 `appId/openid`。
- 管理写入只允许后台或受保护云函数；小程序只读取 `published` 公告。
- 多应用共用数据库不等于共用用户身份：不同小程序的 OpenID 不能直接互认；如需统一身份，应由服务端使用合法 UnionID 或账户绑定规则建立映射。

## 3. 公告数据合同

PoemUI 当前本地公告使用以下稳定字段，后续云接口保持同形：

```json
{
  "_id": "pui-v0-1-0-20260727",
  "product": "poemui",
  "version": "v0.1.0",
  "date": "2026-07-27",
  "title": "PoemUI v0.1.0 更新",
  "summary": "小程序入口、组件体验与快速样式完成一轮系统更新。",
  "componentCount": 71,
  "categoryCounts": [
    { "key": "getting-started", "label": "规范", "count": 1 },
    { "key": "foundation", "label": "基础", "count": 3 },
    { "key": "layout", "label": "布局", "count": 5 },
    { "key": "navigation", "label": "导航", "count": 9 },
    { "key": "form", "label": "表单", "count": 19 },
    { "key": "data", "label": "数据展示", "count": 14 },
    { "key": "feedback", "label": "反馈", "count": 9 },
    { "key": "overlay", "label": "浮层", "count": 6 },
    { "key": "advanced", "label": "高级", "count": 5 }
  ],
  "highlights": [
    {
      "component": "Popup",
      "icon": "popup",
      "title": "三段式浮层",
      "description": "统一 Header、唯一滚动 Content 与全宽 Footer。"
    }
  ],
  "status": "published",
  "schemaVersion": 2,
  "publishedAt": "2026-07-27T16:54:07+08:00"
}
```

客户端只消费 `_id/version/date/title/summary/componentCount/categoryCounts/highlights/status/schemaVersion`，并把 `_id` 归一化为页面 `id`。`componentCount` 是该公告版本的组件总数；`categoryCounts` 必须包含全部九类 `key/label/count`，类别 key 唯一、数量为非负整数且总和严格等于 `componentCount`。统计字段用于 Service 校验和 Me 页按类别/增量绘制 BarChart，不在公告 Popup 内直接展示。`highlights` 必须以 `component/icon/title/description` 突出组件名和组件改动，不再使用无主次的字符串数组。公告读取失败时回退最近一次缓存，再回退包内同形公告；Service 必须返回 `cloud/cache/local` 来源，不能把旧内容冒充刚从云端刷新。

## 4. 当前实现

- 资源 AppID：`wxa1b9a4d6549c6cd1`。
- 共享环境：`poemcoder-1gkbkid139b08f45`。
- 公告集合：`pui_updatelog`。以后 PoemUI 专属云集合统一使用 `pui_` 前缀，禁止创建无命名空间的通用集合。
- 安装一级页集合：`pui-codepage`。它使用 `product/pageKey/status/kind/schemaVersion/sortOrder/publishedAt/updatedAt` 共同字段，`kind=page` 只承载一条已发布页面结构，`kind=skill` 承载未来独立发布的 Skill。客户端仅查询 `product=poemui + pageKey=codex + status=published`，不使用包内页面文案回退；用户可见名称为“安装”，`codex` 仍是稳定内部 key。集合为 `READONLY`，首条 Page 文档已由管理端 `$set` 写后读回，并已由调用方小程序同条件读取到 1 条；管理端读回仍不能替代后续发布的客户端验收。
- 订单集合：`pui_order` 已创建为空集合；当前只完成集合存在性与空查询回读，订单 Schema、业务索引、只读查询云函数和“我的订单” Popup 尚未实现，不得把建库等同于订单链路完成。
- `miniprogram/common/services/update-announcements.js` 使用独立 `wx.cloud.Cloud` 实例连接共享环境，只查询 `status=published` 的公告，按日期在客户端排序并写入 `poemui-update-announcements` 缓存。包内公告的统计字段直接读取生成型 `component-status.js`；不得再手写另一份当前分类数量。
- `pages/me/index` 的“更新公告” Cell 打开受控 PUI Popup；Popup Header 显示版本，Content 关闭自身滚动并交给最大高度 `78vh` 的唯一 PUI ScrollArea，只以 PUI Tag + Icon 突出组件名和改动，Footer 使用全宽 PUI Button。`componentCount/categoryCounts` 不进入 Popup 可见层；同页 BarChart 按日期为每个有效公告版本建立分段，只在消费展示层过滤 `getting-started / 规范`，默认四类并可平滑展开全部八类。九类 Schema 与合计校验不因展示过滤而改变。
- 首条公告使用稳定 `_id=pui-v0-1-0-20260727`。云端写入与回读是发布证据；本地 fallback 只用于首次加载和断网，不取代云端验收。

## 5. 访问与发布规则

1. 小程序客户端只读 `published` 公告，不提供新增、修改或删除入口。
2. 公告发布由受保护的云控制台、管理后台或管理云函数完成；客户端不得携带管理员密钥。
3. 每次发布使用稳定 `_id` 和语义版本；修改已发布公告必须更新 `updatedAt`，需要撤回时改为非 `published`，不得由客户端自行过滤敏感草稿代替安全规则。
4. 用户、授权和订单仍未接入本次公告读取链；若后续建立集合，同样使用 `pui_` 前缀，并按可信 AppID、用户身份与服务端权限分区。
5. 配额、费用、日志、告警、备份和公告管理入口仍需独立治理；共享环境不代表所有业务数据可以默认互通。
6. `pui-codepage` 的 page/skill 发布同样只能由受保护的控制台、后台或管理云函数写入；客户端不读取草稿、归档或未通过 `published` 过滤的数据。未来接入集合安全规则时，必须保证客户端不能绕过发布过滤读取草稿。
7. 使用云工具更新已发布文档时必须使用 `$set`；禁止传裸对象，否则可能按替换语义丢失未列出的字段。写后必须以 `_id` 管理端读回完整文档，再以调用方小程序的同条件查询验证客户端可读。
8. 公告统计 Schema 固定为 v2；发布或修订公告时必须同步写入 `componentCount/categoryCounts`，并在写前校验九类合计。找不到历史分类证据时应明确标记待补证，不能静默生成与总数不相等的数据。

## 6. 运行态验收

1. `Cloud.init()` 必须使用 `resourceAppid/resourceEnv`，不得使用 PoemUI 自有环境冒充共享环境。
2. 数据库请求必须命中 `pui_updatelog`，成功结果标记 `source=cloud` 并写入缓存。
3. 断网或共享授权失败时 Popup 仍可读取缓存/包内公告，但必须保留非云端来源；错误不得导致空白 Popup。
4. 390×844 下验证版本、日期、组件标签、长说明、唯一滚动区与全宽 Footer；Popup 不得出现组件总数或九类统计块。Me 仪表盘 BarChart 必须从同一批公告数据得到按日期排列的逐版本分段，隐藏“规范”，默认显示四类并平滑展开/收起八类；浅色、深色和外观开关不得破坏层级。
5. 微信模拟器通过不等于 iOS/Android 真机通过；真机共享环境鉴权、权限规则与弱网恢复必须单独记录。
