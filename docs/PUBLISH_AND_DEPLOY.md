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

该流程会生成官网目录和 `miniprogram_dist/` 小程序运行时目录，按 metadata 当前清单校验组件四件套、公开 Props 与真实 `properties` 对齐，并检查最终 tarball 内容。当前公开版本为 `poemui-miniprogram@0.1.3`，包含 74 个组件与同版本 PoemUI Skill；npm Registry 的 `latest` 已回读为 `0.1.3`，tarball shasum 为 `3af715daca26d645cca647436467f65d64708ee0`。干净目录安装回读为 74 个组件目录、15 个 Skill 文件，退役 Tooltip 不在包中。`0.1.0` 是 71 个组件的历史快照，`0.1.1` 未曾发布；不得移动或重写既有 `v0.1.0` 事实。后续版本通过本地门禁后，由具备 npm 发布权限的账号执行：

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

### poemcoder.com 独立 H5 容器

生产 H5 固定挂载在 `https://poemcoder.com/poem-ui/docs/`，与承载 `/poem-ui` 产品落地页的 Next.js 容器分开运行。先完成 `npm run site:build`，再从仓库根构建静态镜像：

```bash
docker buildx build \
  --platform linux/amd64 \
  --file deploy/h5/Dockerfile \
  --tag poemui-h5:<release-tag> \
  --load \
  .
```

生产容器只监听宿主机 `127.0.0.1:3102`，容器端口为 `8080`；OpenResty 的 `/poem-ui/docs/` location 负责去掉前缀后转发。`/healthz` 是容器级健康检查，公网发布仍须逐项验证 HTML、CSS、JS、字体、hash 路由、390px、light/dark 和真实组件交互。服务器内存有限，禁止在远端构建 Node/Next 镜像；必须在本机生成 `linux/amd64` 镜像后传输。

2026-07-29 的 0.1.3 当前生产基线为
`poemui-h5:20260729-0.1.3-001`。活动容器 `poemui-h5` 仅绑定
`127.0.0.1:3102`，直接回滚点为停止状态的
`poemui-h5-rollback-20260729-0.1.2-002`；更早的回滚容器继续保留。
镜像为 `linux/amd64`，远端镜像 ID 为
`sha256:5cacfd439bd75bee945e9ac6dabd9f8cee3cacb3cdbcff0922c278ad101f7b82`。
远端 `3106` Canary 先通过健康检查和 `0.1.3` 资源回读，再切换生产；OpenResty
容器内 `openresty -t` 通过，公网 `/poem-ui/docs/`、`/poem-ui/docs/healthz`
与产品落地页 `/poem-ui` 均返回 200。公网 H5 的品牌、安装命令和 Skill 固定目录均为
`0.1.3`，复制安装命令真实回写“已复制”；产品落地页显示 74 个组件与 `0.1.3`。
浏览器显式设置 390px 后，两页 `innerWidth=390`、文档/Body `clientWidth=scrollWidth=375`，
无页面级横向溢出，console error/warning 为空。Next.js 产品页生产镜像为
`poemcoder-web-v2:20260729-poemui-0.1.3-r8`，直接回滚点为停止状态的
`poemcoder-web-v2-rollback-20260729-poemui-catalog-r7`；后台容器 ID、镜像与运行状态
在切换前后保持不变。以后发布不得复用这个状态描述代替当次远端只读审计、Canary、
健康检查和浏览器交互；npm Registry 是否发布必须独立回读，不能由 H5 版本推断。

## 发布后验收

1. 在一个干净目录执行 `npm pack`，检查 tarball 中存在 `miniprogram_dist/`，其内包含组件目录、`common/`、`theme/` 和 `assets/`，且不包含 `preview/`、`docs/`、`_example/` 与源码目录。
2. 用微信开发者工具打开 `_example/`，执行“构建 npm”，确认主题切换、Input、Switch、Button 和 Popup 均可操作。
3. 打开已部署官网，检查组件链接、参数调节、深浅色、阴影、毛玻璃、大圆角、渐变背景、iPhone SE 375px 和图标筛选。
4. 以 package version、官网 URL、发布 tag 和已知 beta 边界更新 `CHANGELOG.md`。
