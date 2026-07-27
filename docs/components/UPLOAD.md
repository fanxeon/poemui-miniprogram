# Upload 组件语义合同

本文是 PoemUI Upload（导航名称 Attachment）的长期设计与实现合同。任何 Agent 修改源码、H5 镜像、示例、元数据或相关 Token 前，都必须完整阅读本文，并查询：

`npm run feedback:list -- --component upload`

当前对照基线为 TDesign Mini Program 1.15.3 的 Upload / Attachments 文档与 npm 源码。参考不等于复制；公开合同只保留 PoemUI 能在微信原生端、H5、文档和测试中真实闭环的能力。

## 1. 组件定位

- Upload 用于从微信媒体或聊天文件选择器取得本地文件，并以列表或网格展示消费者提供的真实文件状态。
- 选择成功只代表文件加入列表；组件不执行远端上传、不调用业务接口、不伪造上传成功。
- Props 固定为 `files/defaultFiles/max/picker/mediaType/messageType/source/extensions/maxSize/addContent/addBtn/theme/columns/allowDuplicate/preview/removeBtn/customAdd/disabled/ariaLabel/reduceMotion`；Events 固定为 `change/add/remove/preview/retry/cancel/reject/error`；1 个 `add` Slot；0 个公开 Methods。

## 2. 固定结构与区域

```text
Upload(group)
├─ Files(list | grid)
│  └─ File × n
│     ├─ PUI Image | PUI Icon
│     ├─ Name / size / PUI Tag / PUI Progress
│     └─ Preview / Retry / remove PUI Button
└─ Add trigger(optional)
   └─ PUI Button | add Slot
```

- 空列表直接保留真实添加入口，不叠加大块 Empty；`addBtn=false` 时允许只读展示已有附件。
- `uploading/error/paused/success` 是单文件状态；全局 loading/empty/error/retry 由消费者在 Upload 外组合。

## 3. PUI 组合与依赖

- 默认入口与三类操作使用 PUI Button；文件缩略图、类型、状态和进度分别组合 PUI Image/Icon/Tag/Progress。
- H5 必须调用共享 Button/Icon/Image/Tag/Progress 镜像；浏览器 file input 只作为透明的平台能力桥接层。
- 不复制 Empty、Loading、图标字符、进度条或原生按钮皮肤。

## 4. Token、间距与排版

- list 与 grid 共用 PUI 内容、列表、控件内部间距和语义圆角 Token；`columns` 限制为 2–4。
- 文件名和错误消息允许列表内部单行裁切，但 API、状态说明和可操作名称必须完整可读。
- 失败文件只保留一处带 PUI Icon 的原因区，不再叠加失败 Tag、0% Progress 和整卡红色边界；Retry 使用右侧可见文字按钮，不能退化为掉到下一行的无文案图标块。
- 文件项、状态和进度固定 500ms；`reduceMotion=true` 压缩为 1ms，不公开 `duration/easing`。

## 5. 内容、Slot 与组合边界

- 唯一 `add` Slot 由 `customAdd=true` 启用，并位于真实可选择入口中；Slot 点击仍调用同一个平台选择器。
- 不提供 default/files/empty/error Slot。业务说明、整体状态和自定义文件详情应作为相邻组件组合，不进入 Upload 根。
- 文件 schema 固定规整为 `{ id, path, url, name, type, extension, size, sizeText, duration, status, statusText, progress, message, canPreview }`。

## 6. 状态与优先级

- `disabled` 阻断选择、预览、移除和重试；选择器打开期间 `choosing` 阻断重复操作。
- 文件 `status` 只接受 `ready/uploading/success/error/paused`；非法值回退 `ready`，成功文件进度为 100。
- `max` 限制为 1–9，`maxSize` 为非负字节数；`allowDuplicate=false` 时新选择中与现有列表相同 path/url 的文件进入 reject。
- 当前列表为空就是组件的 empty 状态；文件 `error` 显示真实消息与 Retry，Retry 只发请求，不修改文件状态。
- `error` 不显示进度条：失败是离散结果，不用 `0%` 或最后进度重复表达。整张文件 Surface 保持中性，危险色只作用于失败原因；Retry 是恢复操作，使用中性 Button，不误用危险或主要上传操作语义。

## 7. 交互、受控边界与事件

- 只有 `Array.isArray(files)` 时进入受控模式；`false/0/空字符串/null` 均不冒充受控列表。受控转非受控后保留最后渲染列表。
- `defaultFiles` 只初始化一次。非受控交互更新内部列表；受控交互等待父级通过 `files` 回写。
- 有效选择固定 `reject（若有）→ change → add`；移除固定 `change → remove`。取消只发 `cancel`，平台失败只发 `error`。
- `change.detail` 固定含 `{ files, previousFiles, source }`；`source` 仅为 `add/remove`。相同列表不重复发布。
- `preview` 在调用真实微信预览 API 前触发；`retry` 只表达消费者应重启真实上传任务。

## 8. 可访问性

- 根使用 group 语义并同步 `aria-label/disabled/busy`；列表项与操作按钮提供完整文件名。
- grid/list、状态、进度与操作顺序必须可理解；纯图标按钮必须有可访问名称。
- 静态文档样例不得保留无响应的 file input、删除或 Retry 假按钮。

## 9. H5 预览与跨端一致性

- H5 使用真实 `input[type=file]`、File 和 Blob URL 镜像微信选择与预览近似；浏览器选择只加入 `ready` 文件，不伪造远端上传。
- 概览固定分为“基础用法 / 网格与媒体 / 文件状态 / 限制与禁用”。基础 WXML 为 `<pui-upload></pui-upload>` 且零 `bind:*`。
- 当前实例承担真实文件选择、预览、移除、Retry 与父级回写；静态比较样例只读且不保留假入口。
- API 完整显示 20 Props、8 Events、1 Slot、0 Methods，不裁切表格文字。

## 10. 响应式、主题与视觉配置

- 390px 下 list 操作可以换行，grid 仍保持 2–4 列内部布局，不能制造页面级横向溢出。
- light/dark、边框、阴影、毛玻璃、大圆角和渐变背景必须可读；Upload 根是透明布局，文件项与添加入口才是 Surface。
- `equalSpacing` 不把透明 Upload 根变成第二张卡片；仅把文件 Surface 集合的直接 stack gap 映射到当前 `--pui-surface-inset`，文件项内部的缩略图、文字、Tag、Progress 和操作间距保持原合同。
- 全局效果开关不得改变文件数量、列数、交互命中或组件外框尺寸。

## 11. TDesign 取舍与明确禁止

- 保留 TDesign 1.15.3 的 `addBtn/addContent/allowUploadDuplicateFile/disabled/files/defaultFiles/max/mediaType/preview/removeBtn/source/theme` 主干，以及 Upload/Attachments 的列表、网格和文件状态表达；PoemUI 以 `picker/messageType/source` 明确微信两个选择器及相册/相机来源。
- PoemUI 保留字节级 `maxSize`、扩展名校验、`ariaLabel/reduceMotion`，用简单 `columns` 替代会穿透尺寸的 `gridConfig/gutter/imageProps`。
- 拒绝在组件中执行上传的 `requestMethod`、平台配置大对象 `config`、拖动排序 `draggable/transition` 和全量 Image Props 穿透；这些能力只有双端真实合同与排序事件完成后才能重新评估。
- 明确禁止恢复重复 `input`、`choose-start/end`、`clear/exceed/file-load/file-error`、全局 loading/error Props、default/files/empty/error Slot、公开实例方法或私有 `duration/easing`。

## 12. 修改闭环

1. 同步审计 `upload/`、全部 PUI 子组件、`index.js`、metadata、H5、Props、WXML、API、兼容说明、`_example`、`miniprogram_dist` 与 npm/微信安装产物。
2. 运行 `node scripts/test-upload.js`、组合/原生控件边界、组件合同、`npm run site:build`、`npm run check` 和 `npm run pack:check`。
3. 浏览器真实选择合法/非法/重复/超限文件、预览、移除、Retry、受控/非受控、0/false/空字符串、disabled、180/1ms、390px、light/dark 与全部视觉开关。
4. 产物变化后运行 `npm run example:install` 并校验源码、dist、示例安装与 tarball；微信 CLI 失败时保留 `pending-cli`，不得手工冒充成功。

真机仍需复核 `wx.chooseMedia/wx.chooseMessageFile` 权限、取消与返回结构、图片/视频/文档预览、Blob 差异、rpx 网格、样式隔离、读屏和系统低动效。任何不能满足本文的实现必须写入 Ledger，不得静默绕过。
