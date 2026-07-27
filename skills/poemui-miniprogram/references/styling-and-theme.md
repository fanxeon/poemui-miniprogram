# 样式和主题

## 页面根

需要跨页面统一外观时，每个页面根组合：

```json
{
  "usingComponents": {
    "pui-config-provider": "poemui-miniprogram/config-provider/config-provider"
  }
}
```

```xml
<pui-config-provider use-global-config>
  <!-- 页面内容 -->
</pui-config-provider>
```

小程序没有单一 WXML App 根，不能声称只在 `app.js` 包一次即可影响所有页面。

## 全局配置

从 npm 入口使用 `visualConfig` 的 `restore / set / applyPreset / setEffectsEnabled / reset / subscribe`。公共字段只有：

`theme / effectsEnabled / shadow / frostedGlass / largeRadius / bordered / equalSpacing`

不要直接写 Provider 内部 class，也不要复制第二份 Store。

## Style Utilities

在 `app.wxss` 或页面 WXSS 引入：

```css
@import "poemui-miniprogram/theme/theme.wxss";
@import "poemui-miniprogram/theme/utilities.wxss";
```

使用包内真实类名；先读取安装版本的 `common/style/utilities.wxss`，不要靠 Tailwind 记忆猜类名。组件尺寸、间距、颜色、圆角和阴影优先使用 PUI Token/Utility；确实缺少语义时在组件库补充跨端 Token。

外观验证要读取代表节点的真实计算结果或微信样式结果，不能只检查根 class 已切换。
