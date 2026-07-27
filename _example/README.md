# PoemUI 示例小程序

该工程用于在微信开发者工具中验证 npm 安装、`usingComponents`、主题 Provider、表单事件与 Popup 事件。

从当前源码验证时：

1. 在仓库根目录执行 `npm run example:install`。该命令会先生成当前源码的 tarball，再无保存安装到 `_example/node_modules/`；微信开发者工具不能完整跟随 `file:..` 软链接，因此不要只在 `_example` 执行普通 `npm install`。
2. 用微信开发者工具打开 `_example/project.config.json` 所在目录。
3. 在工具中执行“构建 npm”，然后编译。构建入口是示例项目根 `package.json`，不要直接选择依赖包内的 `package.json`。

发布后的消费者不需要使用 `file:..`：将 `_example/package.json` 中的依赖替换为已发布版本，例如 `"poemui-miniprogram": "^0.1.0"`，再重新安装和构建 npm。
