# 小程序反馈分区页面合同

本文件记录 `miniprogram/pages/components/` 中反馈分区的页面级编排规则；组件自身 API 仍以 `docs/components/ALERT.md`、`EMPTY.md`、`LOADING.md`、`NOTICEBAR.md`、`PROGRESS.md`、`RESULT.md`、`SKELETON.md`、`TOAST.md` 为准。

## 范围

九个页面为 `Alert / Empty / Loading / NoticeBar / Progress / Result / Skeleton / Toast / Dialog`。每页必须组合：

- 页面根 `<pui-config-provider use-global-config>`；
- 共享 `component-page-navbar`，返回与外观 Popup 不得在页面重写；
- 由真实 Navbar 高度推导的唯一 `pui-scroll-area`；
- `component-page-section` 的标题、子标题、说明与默认 Slot。

页面不得新建原生 `button`、原生 `scroll-view`、私有主题/间距/外观状态，或把 H5 属性面板、工程事件日志搬入页面。

每页标题和说明改为用户任务语言：草稿提醒、删除确认、空收藏、目录加载、服务公告、下载进度、发布结果、内容占位和保存反馈。工程边界继续由交互实现与专项测试保证，不再抢占页面视觉中心。

## 真实交互边界

| 页面 | 页面负责的交互 | 明确不做 |
| --- | --- | --- |
| Alert | `change` 回写 `visible`，隐藏后重新显示 | 关闭不代表业务成功 |
| Empty | `action` Slot 的父级请求 | Empty 不发布 action/retry 事件 |
| Loading | 切换 `loading` 视觉状态 | 不伪造完成、失败或网络结果 |
| NoticeBar | `operation` click 的可见性回写 | 不把组件 click 当作自动关闭 |
| Progress | 改变明确的演示百分比 | 不把 100% 解释为业务完成 |
| Result | 页面操作调用真实返回导航 | Result 不拥有 actions/event |
| Skeleton | 父级切换占位与真实 Slot 内容 | 不承载请求/错误/重试 |
| Toast | 实例 `show(options)` 与 `close` 状态更新 | 自动关闭只表示提示结束 |
| Dialog | 父级回写 `visible`，处理 confirm/cancel/close/overlay-click；内容 Slot 组合状态 | 不把 Loading/Empty 或业务完成伪装为 Dialog Props |

## H5 同步

H5 已在 `preview/app.js` 和 `preview/styles.css` 维护八个同名组件镜像、动画与 PreviewDevice 合同。小程序页面不复制该实现；同步含义是两端都继续消费同名 PUI 组件、语义 Token、`visualConfig` 与组件合同。任何未来对页面示例语义、组件公开边界或视觉 Token 的修改必须同时检查 H5 镜像与 `docs/H5_PREVIEW_COMPATIBILITY.md`。

## 验收

```sh
node scripts/test-miniprogram-component-pages.js
node scripts/test-miniprogram-feedback-pages.js
node scripts/test-miniprogram-component-page-quality.js
node scripts/test-alert.js
node scripts/test-empty.js
node scripts/test-notice-bar.js
node scripts/test-progress.js
node scripts/test-result.js
node scripts/test-skeleton.js
node scripts/test-toast.js
node scripts/test-dialog.js
```

逐页场景与关键边界见 `docs/MINIPROGRAM_COMPONENT_PAGE_ACCEPTANCE.md`。还必须运行完整 `npm run check`、`npm run site:build`、`npm run example:install` 与 `npm run pack:check`。微信真机需要单独验证 390px 下长页面滚动、Toast/NoticeBar 触摸、rpx、读屏、系统低动效和视觉组合；构建或 H5 通过不替代真机证据。
