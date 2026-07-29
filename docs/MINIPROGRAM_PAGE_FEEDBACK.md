# 小程序组件详情页反馈分级合同

本文约束 `miniprogram/pages/components/` 的页面级反馈。组件详情页是 PUI 组件的真实消费者，不得用一行弱状态文字替代组件视觉、业务回写或恢复链路。

## 1. 四级反馈决策

每个事件处理器只选择一种主要反馈方式：

| 等级 | 适用场景 | 组件与位置 |
| --- | --- | --- |
| `none` | 展开、关闭、选中、开关、当前数值等已经由组件本体明确表达的变化 | 不增加第二份文案或通知 |
| `inline` | 持续、近场、可修复的信息，例如字段校验、上传失败、输入限制和组件内部 Empty/Retry | 留在对应控件或状态 Surface 内 |
| `Toast` | 不需要持续更新的一次性轻反馈，例如复制结果或单次命令完成 | 页面级 PUI Toast |
| `DynamicMessage` | 重要恢复、异步任务、同一任务的 loading → success/error、需要 Action 的警告或错误 | 页面顶部共享反馈宿主 |

- 不能因为 `.component-page__status` 不醒目，就把所有状态机械升级为 DynamicMessage。
- 高频 `input/change/changing/scroll/touchmove` 不得逐次触发 Toast 或 DynamicMessage。
- 组件本体已经显示 error、loading、selected、visible 或当前值时，页面不得再创建同义 `aria-live`。
- 一个真实结果只允许一个 live region；error 可以使用 assertive，其余默认 polite。

## 2. 共享宿主

需要 DynamicMessage 的详情页必须在唯一 ScrollArea 外挂载：

```xml
<component-page-feedback id="component-page-feedback" />
```

页面 JSON 注册：

```json
{
  "usingComponents": {
    "component-page-feedback": "/components/component-page-feedback/component-page-feedback"
  }
}
```

`component-page-feedback` 只组合发布包内 `pui-dynamic-message`，并透传 `click/action/close`。它不复制 DynamicMessage 状态机，也不扩张公共 npm API。

`createComponentPage` 提供：

- `showPageFeedback(options)`：返回 DynamicMessage 的真实 key；没有宿主时返回空字符串。
- `updatePageFeedback(key, patch)`：只在真实命中时返回 `true`。
- `hidePageFeedback(key)`：只在真实移除当前或排队消息时返回 `true`。

调用方必须使用稳定、可解释的任务 key。同一任务原位更新，不得为每个进度值创建新 key。

## 3. 真实结果边界

- Retry 仍是请求事件；组件不能自动宣布恢复。
- 页面必须先完成真实数据、error、loading 或 visible 回写，再显示 success。
- 本地恢复可以在 `setData` callback 后确认“已恢复”；网络、上传、发布等结果必须等待真实平台或服务回调。
- `show()` 只代表通知已展示，不代表业务成功。
- DynamicMessage Action 只发布用户意图，业务页面继续负责下一步和结果回写。

## 4. NavigationMenu 试点

- 根入口展开/关闭、分类选中、checkbox/radio 状态均由 NavigationMenu 本体表达，不再渲染 `navigation-page__status`。
- 错误仍由 NavigationMenu 的 PUI Empty + Retry 就地承接。
- 页面收到 Retry 后先真实清除 `error`；只有 `setData` 完成后，才以稳定 key `navigation-menu-recovery` 显示“目录已恢复”。
- 共享反馈宿主位于 ScrollArea 外，不参与 NavigationMenu Panel 的内容高度、裁切和滚动。

## 5. 验收

每次迁移至少验证：

1. 旧状态变量、WXML 节点和重复 `aria-live` 同时删除。
2. 宿主位于 ScrollArea 外，页面文档流高度不变化。
3. 宿主未挂载时 helper 返回真实失败值。
4. 高频事件不会积压队列。
5. DynamicMessage 与自定义 Navbar、Popup/Dialog、系统胶囊和安全区不重叠。
6. 390px、light/dark、低动效、VoiceOver/TalkBack 分开记录。

H5、npm、GitHub 与远端同步属于 0.1.2 最终发布批次；小程序独立页试点完成不代表这些发布面已经更新。
