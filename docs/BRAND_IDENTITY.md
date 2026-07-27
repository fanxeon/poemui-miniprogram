# PoemUI 品牌标记：月下成行

“月下成行”是 PoemUI 官网的唯一品牌标记，不是 `Icon` 组件的公开资源，也不替代任何操作图标。

## 公司字标的公开 Icon 资产

用户提供的公司书写字标属于公司身份资产，不替代 PoemUI 产品标记“月下成行”。用户已明确把它以公开名称 `poemcoder-mark` 收录到 `pui-icon`：

- 唯一生成入口是 `npm run icons:generate`，闭合轮廓真相源位于 `scripts/generate-icons.js` 的 `customIcons` 登记；禁止保留第二套品牌字体或页面私有字形。
- 生成 SVG 为 `assets/icons-src/abstract/poemcoder-mark.svg`，并由同一脚本同步进入 manifest、稳定码点表、`icon-font-map.js`、`icon-font-catalog.js`、H5/小程序 WOFF2 和发布镜像。
- 字形使用 `24×24` viewBox、五段闭合实心轮廓和一个反向内腔，删除原 PNG 的白色残边与扫描噪点；不把位图、Base64 图片或几千个自动描摹锚点塞入 SVG。
- SVG 与字体都使用 `currentColor`，共享字体族 `PoemUI Roundline`；稳定码点为 `U+E0DB`。96/56/32/20px 使用同一个字形，不维护小尺寸替代图。
- 旧名 `company-mark` 不保留为兼容别名；唯一公开调用名是 `poemcoder-mark`。
- `scripts/test-icon.js` 锁定名称、分类、来源、五段闭合轮廓、码点、manifest/map/catalog 和字体产物；没有用户最终视觉确认前 acceptance 保持 `pending-user`。

```xml
<pui-icon name="poemcoder-mark" size="56" aria-label="PoemCoder 公司标记" />
```

## 构形与含义

- 月牙表示一行诗结束后的停顿；它采用一大一小的偏移双弧形成饱满却收尖的月牙，位于诗行上方并保留至少 `1` 个 viewBox 单位的留白，而不画成阅读应用的插画场景。
- 三条不等长圆线表示诗行：长、短缩进、中等回收，表达节奏而不是菜单、文档或组件拼图。诗行整体略低于月牙，避免首行贴住月牙下缘。
- 标记在 `24×24` viewBox 中绘制；月牙的主/回收弧半径为 `5.35 / 6.08`，诗行使用 `2.15`、round cap，与 PoemUI Roundline 的光学重量一致。
- Topbar 的方形底仅是小程序/网页应用入口容器。裸标记可用于深浅反白的品牌位，不能另加阴影、渐变、毛玻璃、描边或第二层卡片。
- 网站图标同时提供 `preview/favicon.svg` 与 `preview/favicon.ico`：两者沿用同一双弧月牙和三行诗句。SVG 可按系统深浅色反白；ICO 作为不支持 SVG favicon 的静态回退，不得换用通用字母、月亮 Emoji 或 `pui-icon` 资源。

## 文案与可访问性

- 品牌名固定为 `PoemUI`。
- 副标题固定为 `月下成行 · 原生小程序组件库`；390px 可隐藏副标题，但品牌链接必须保留 `PoemUI 月下成行首页` 可访问名称。
- 页面标题使用 `PoemUI · 月下成行`，不以“诗歌、冥想、阅读器”等未经支持的产品定位替代组件库事实。

## 明确禁止

- 禁止回退为无内容色块、四菱形拼图、羽毛笔、书本、纸张、引号或“文档应用”图形。
- 禁止把“月下成行”加入 `pui-icon`；`poemcoder-mark` 是经用户明确登记的唯一公司字标例外，仍不得用作通用功能操作或替代 Button + Icon 的交互组合。
- 禁止在品牌底或标记本体上使用渐变、外阴影、玻璃和 3D 质感；深浅色仅通过 `--brand` 与 `--page` 反转。

## 验收

1. Topbar 在 light/dark、阴影、毛玻璃、大圆角和渐变偏好下，品牌本体始终为平面黑白且不改变尺寸或布局。
2. 390px 下品牌名称和标记完整可见，页面没有横向溢出；副标题若隐藏，链接仍有完整可访问名称。
3. `scripts/test-design-contracts.js` 必须锁定 SVG、品牌文案、Token 颜色与无渐变/投影边界。
