# PoemUI 发布与部署

PoemUI 由两条独立产线组成：根目录是微信小程序 npm 组件包，`preview/` 是可静态部署的官网。不要把官网源文件塞进 npm 包，也不要把小程序组件当作浏览器组件运行。

## 发布 npm 组件包

首次发布前先确认 npm 包名归属。当前名称为 `poemui-miniprogram`；未登录时可检查其可用性：

```bash
npm view poemui-miniprogram version
```

若名称已被占用，发布前统一改为组织 scope，例如 `@your-org/poemui-miniprogram`，并同步替换 README、示例工程和官网中的引入路径。不要在发布后再改变包名。

本地发布前检查：

```bash
npm install
npm run prepublishOnly
```

该流程会生成官网目录和 `miniprogram_dist/` 小程序运行时目录，校验 71 个组件四件套、公开 Props 与真实 `properties` 对齐，并检查最终 tarball 内容。通过后，由具备 npm 发布权限的账号执行：

```bash
npm login
npm publish --access public
```

每次发布前更新 `package.json` 版本和 `CHANGELOG.md`。`done` 是稳定推荐层；`beta` 可以用于生产，但必须保留 beta 状态说明；`experimental` 不能包装成生产 API。

## 部署官网

官网是纯静态站，构建结果就是 `preview/`。本地运行：

```bash
npm run site:build
npm run site:dev
```

局域网测试：

```bash
HOST=0.0.0.0 PORT=4179 npm run site:dev
```

浏览器访问 `http://127.0.0.1:4179/`；局域网设备使用本机 IP 加同一端口。官网采用 `#/components/button` 这类 hash 路由，因此可直接部署到任意静态托管，无需服务端路由回退。

### Netlify

仓库内的 `netlify.toml` 已指定：

- build command：`npm run site:build`
- publish directory：`preview`

在 Netlify 新建 Git 仓库项目后，保留这两个配置即可。配置自定义域名与 HTTPS 后，再把该域名填入 npm 包的 `homepage` 字段。

### Vercel

仓库内的 `vercel.json` 已指定同一构建命令和 `preview` 输出目录。导入仓库后直接部署；不需要使用框架预设。自定义域名生效后，同样同步到 `package.json` 的 `homepage`。

## 发布后验收

1. 在一个干净目录执行 `npm pack`，检查 tarball 中存在 `miniprogram_dist/`，其内包含组件目录、`common/`、`theme/` 和 `assets/`，且不包含 `preview/`、`docs/`、`_example/` 与源码目录。
2. 用微信开发者工具打开 `_example/`，执行“构建 npm”，确认主题切换、Input、Switch、Button 和 Popup 均可操作。
3. 打开已部署官网，检查组件链接、参数调节、深浅色、阴影、毛玻璃、大圆角、渐变背景、iPhone SE 375px 和图标筛选。
4. 以 package version、官网 URL、发布 tag 和已知 beta 边界更新 `CHANGELOG.md`。
