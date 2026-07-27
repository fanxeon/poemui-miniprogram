# 安装与构建

## 版本与来源

- 最低适配版本：`0.1.0`
- 当前验证版本：`0.1.0`
- 包名：`poemui-miniprogram`
- 组件根：`miniprogram_dist/`
- 公共 npm 或 GitHub 只有在真实注册表/远端可读取后才算可用。

不要因为仓库里的 `package.json` 已填写包名，就把 `npm install` 写成已发布能力。先运行：

```bash
npm view poemui-miniprogram version
```

只有命令返回目标版本，才使用：

```bash
npm install poemui-miniprogram@0.1.0 --save --production
```

未公开发布时，使用维护者提供并经 SHA/来源确认的本地 tarball；不要自行从未知 URL 下载。

## 微信工程识别

1. 读取根 `project.config.json`。
2. 若存在 `miniprogramRoot`，相对工程根解析；否则默认工程根。
3. 读取该根的 `app.json`。
4. npm 安装根通常由 `project.config.json.setting.packNpmRelationList` 决定，不要只凭目录名猜测。

## 构建 npm

安装后在微信开发者工具执行“工具 → 构建 npm”，或者使用可用 CLI：

```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm \
  --project "/absolute/path/to/miniprogram-project"
```

构建完成后必须同时核对：

- `node_modules/poemui-miniprogram/package.json` 的版本；
- `miniprogram_npm/poemui-miniprogram/` 是否存在；
- 页面 JSON 的组件路径是否能落到构建产物；
- 源包与 `miniprogram_npm` 的关键 JS/WXML/WXSS 是否一致。

CLI 成功不等于真机通过。至少继续检查模拟器控制台、页面实际交互和真机风险。
