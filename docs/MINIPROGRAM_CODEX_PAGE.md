# 小程序安装一级页

## 页面目标

`pages/codex/index` 是小程序 Tabbar 第三个真实一级目的地，替换旧 `pages/explore/index` 空白占位页。它只承担 PoemUI 的快速接入和未来 AI Skill 入口，不扩张 Tabbar 组件的自动路由职责。

除 Navbar、Tabbar 与请求状态外，页面正文只读取共享云开发集合 `pui-codepage` 的已发布文档；包内不保留安装命令、页面引用或 Skill 文案回退。云端不可用时必须展示失败和真实重试，不能把旧包内容伪装为刚同步的数据。

## 信息结构

已发布的 `kind=page` 文档固定提供两个分区：

1. **快速开始**：`content.quickStart` 提供标题、说明和 `snippets[]`；每个片段通过共享 `code-snippet` 真实复制当前云端代码。
2. **让你的 AI 懂得用它**：`content.skillSection` 提供标题、说明和空状态文案；同集合的已发布 `kind=skill` 文档按 `sortOrder` 展示。

Navbar 中只出现一次“安装”标题。左侧唯一 `left` Slot 以两个紧凑 PUI IconButton 展示 Info 与菜单：Info 打开受控 PUI Dialog 说明云端发布边界，菜单打开与首页同源的外观 Popup。内部路由与云端 `pageKey` 仍使用稳定的 `codex`，页面内容由唯一 PUI ScrollArea 承载，底部继续使用受控 PUI Tabbar。

## 云端数据合同

集合固定为 `pui-codepage`，资源 AppID 为 `wxa1b9a4d6549c6cd1`，共享环境为 `poemcoder-1gkbkid139b08f45`。客户端只查询：

```js
{ product: 'poemui', pageKey: 'codex', status: 'published' }
```

共同字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `_id` | String | 稳定文档 ID；不得由客户端生成或修改。 |
| `product` | String | 固定 `poemui`，用于共享环境的产品隔离。 |
| `pageKey` | String | 固定 `codex`，用于一级页隔离。 |
| `kind` | String | `page` 或 `skill`。 |
| `status` | String | `draft`、`published`、`archived`；客户端只读取 `published`。 |
| `schemaVersion` | Number | 当前为 `1`；破坏性演进时递增。 |
| `sortOrder` | Number | 非负整数排序，Skill 相同时按名称稳定排序。 |
| `publishedAt` / `updatedAt` | ISO String | 发布与更新审计时间。 |

`kind=page` 仅允许一条已发布记录，额外字段：

```json
{
  "content": {
    "quickStart": {
      "title": "快速开始",
      "subtitle": "安装与引用",
      "description": "从云端读取真实接入示例。",
      "snippets": [
        { "id": "install", "title": "安装依赖", "code": "npm i poemui-miniprogram@0.1.3 -S --production", "ariaLabel": "复制 npm 安装命令" }
      ]
    },
    "skillSection": {
      "title": "让你的 AI 懂得用它",
      "subtitle": "SKILL",
      "description": "已发布 Skill 由云端目录提供。",
      "emptyDescription": "暂无已发布的 Skill。"
    }
  }
}
```

`kind=skill` 字段为：`skillId`（稳定业务 ID）、`name`、`version`、`summary`、`icon`（已发布 PUI Icon 名称）、`capabilities[]`（最多六项）、`installation.title`、`installation.code` 与 `sortOrder`。当前 `poemui-miniprogram@0.1.3` 已在 npm 包内交付同版本 Skill，云端安装代码先固定安装该 npm 版本，再从 `node_modules/poemui-miniprogram/skills/poemui-miniprogram` 复制到 Codex Skill 目录；GitHub `v0.1.3` 目录只作为固定源码真相源。草稿和归档 Skill 不得下发到客户端；没有真实安装代码时省略 `installation.code`，页面不得虚构下载或复制入口。

## PUI 组合

- 页面根：`pui-config-provider use-global-config`
- 页面结构：PUI Navbar、ScrollArea、Tabbar 与共享 `component-page-section`
- Navbar 左 Slot：两个 `extra-small / text / transparent / circle / icon-only` PUI Button，使用共享 Flex 与紧密间距 utility；`info-circle` 打开 PUI Dialog，`menu` 打开外观 Popup，不手写字符图标、原生按钮或页面私有定位。
- Info：受控 PUI Dialog 的 Header 使用默认 Close，Content 说明“安装示例与 Skill 均从共享云端读取，仅展示已发布内容”，单个“知道了”Confirm 由 Dialog 默认全宽 Footer 承载；Close、遮罩与 Confirm 都只真实回写 `visible=false`。
- 外观：Bottom Card PUI Popup 复用首页的 Header/Overlay/间距合同，左侧 primary 圆形 Refresh 调用共享 `visualConfig.reset()` 并关闭渐变，正文只组合共享 `appearance-settings`。
- 代码区：共享 `miniprogram/components/code-snippet` 组合 PUI Card、Button、Icon；横向代码阅读 viewport 使用 `--pui-bg-muted`、`--pui-radius-small` 与 `--pui-content-gap`，浅色为淡灰底、深色自动跟随主题。
- 数据状态：PUI TopLoading、Loading、Empty 与全宽 PUI Button，分别处理同步中、请求失败、未发布 Page 和未发布 Skill
- Skill：PUI Card + Icon + Tag；Skill 安装代码只有云端真实提供时才组合共享 `code-snippet`

代码区只允许一个原生横向 `scroll-view` 承担超长代码阅读；复制必须使用 `default / text / small / circle / icon-only` 的 PUI Button。成功时真实回写 `check + aria-live`，失败时回写 `error-circle`，不得用静态文案冒充剪贴板成功。

## Icon 与路由

第三项固定为：

```js
{ label: '', value: 'codex', icon: 'code', ariaLabel: '安装' }
```

`codex` 是稳定的内部 route/data key，而非用户可见页面名。它由 `scripts/generate-icons.js` 映射到锁定的 Lucide `bot`，再生成 SVG、manifest、稳定码点、本地 WOFF2、小程序字体目录与 H5 Icon 目录。路由固定为 `/pages/codex/index`；旧 `/pages/explore/index` 必须移除。

## H5 边界

该页是示例小程序的信息架构，不复制成官网组件页面。本轮 Navbar 双 Slot、Info Dialog 与外观 Popup 只组合 Navbar/Button/Dialog/Popup/AppearanceSettings 已有共享能力，没有改变共享组件 API、Icon 字体或 H5 组件镜像；官网代码区继续使用既有 `previewCodeBlockSample`。这避免为应用页面伪造一套 H5 Tabbar、微信胶囊或未授权的云端入口。

## 验收

- 第三 Tab 的目的地 value 仍为 `codex`，图标使用通用 `code` glyph，选中态仍由 Tabbar 短横承担。
- Navbar 左侧只显示 Info 与菜单两个圆形 PUI IconButton；Info Dialog、外观 Popup、遮罩关闭、默认 Close、恢复默认和二者互斥均须真实回写。
- 页面只展示云端 `published` Page 与 Skill；草稿、归档、网络失败和空集合不能被包装成内容已同步。
- 云端 snippets 可以横向阅读、选择文本并分别复制准确内容；复制成功与失败均有真实状态反馈。
- 未发布 Skill 时使用云端 `emptyDescription`，没有可点击假入口。
- 390px 下 Navbar、内容、代码区和 Tabbar 无页面横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角、等距和渐变不改变页面结构。
