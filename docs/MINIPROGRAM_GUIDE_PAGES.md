# 小程序开始与规范页面合同

“开始与规范”分区包含一个可安装组件 `ConfigProvider` 和五个规范页：开始使用、主题 Token、颜色、间距、字体排版。

- ConfigProvider 页根部只用 `useGlobalConfig` 订阅现有 `visualConfig`；局部演示只覆盖子树，不复制或写入第二份全局 Store。
- 五个规范页不进入 `pages/components/`，使用 `pages/guides/*` 路由；首页和 Search 以“规范 ·”标识搜索结果，不能伪装为可安装组件。
- 内容真相分别来自 `package.json`、`common/style/theme.wxss` 和 `common/style/utilities.wxss`。页面不手写色值、字体栈或第二套 Token。
- 开始使用页跳转到已有的 `/pages/styles/index` 快速样式路由；它不虚构安装或构建成功状态。

```sh
npm run test:miniprogram:guide-pages
node scripts/test-config-provider.js
node scripts/test-miniprogram-home.js
```

390px 微信模拟器与 iOS/Android 真机尚需确认局部 Provider 的主题边界、长 Token 文本换行、深浅色对比和快速样式跳转回退。
