# 小程序布局分区页面合同

`AspectRatio / Direction / Grid / ScrollArea / Sticky` 均位于 `miniprogram/pages/components/`，有独立路由、共享 Navbar、全局 ConfigProvider 与真实父级状态。

- AspectRatio：父级切换 ratio 与 overflow，Slot 内容随真实比例容器改变。
- Direction：父级控制 `ltr / rtl / auto` 与语言，不反转文本内容。
- Grid：页面控制列数、gutter 与 error；retry 只提出重新加载请求，另一个明确的恢复动作在内容真正准备好后清除 error。
- ScrollArea：被测 ScrollArea 是页面唯一滚动区域，以十二条真实更新记录形成可验证长内容；同一 Slot 顶部通过 PUI Switch 控制 `gradientOverlay`，通过两列“减小遮罩 / 增大遮罩”按钮在 `sm / md / lg` 三个公开档位间调整 `gradientOverlaySize`，尺寸到达边界后禁用对应按钮。组件默认以 `contentPaddingBottom=10vh` 保护所有页面的最后内容，父级只在绝对定位浮层展开时临时提高该值。控制只改公开视觉 Props，真实 `scrollTop` 继续由同一个组件回写。
- Sticky：当前组件内部依据页面滚动定位；页面将唯一 ScrollArea 的真实 scroll 事件转发到该定位逻辑，避免伪造 CSS fixed。演示正文由五条扩充为十条，保证滚动距离足以反复观察进入吸顶、保持和恢复文档流。
- 页面中恰好两个并列操作统一使用共享两列 Grid，两个 PUI Button 各自通栏并以 `--pui-content-gap` 保留 `16rpx` 间距；Switch+文案等普通内容行继续使用 Flex，不被操作布局误伤。

```sh
node scripts/test-miniprogram-layout-pages.js
node scripts/test-miniprogram-component-page-quality.js
node scripts/test-aspect-ratio.js
node scripts/test-direction.js
node scripts/test-grid.js
node scripts/test-scroll-area.js
node scripts/test-sticky.js
```

逐页场景与关键边界见 `docs/MINIPROGRAM_COMPONENT_PAGE_ACCEPTANCE.md`。390px、深浅色、Sticky 在微信 WebView 中的定位与真实设备惯性滚动仍需真机验证。
