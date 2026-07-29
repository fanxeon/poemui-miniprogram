# NavigationMenu 组件语义合同

本文是 PoemUI NavigationMenu 的长期设计与实现合同。修改源码、H5、示例、元数据或 Token 前，必须完整阅读本文，并查询：

`npm run feedback:list -- --component navigation-menu`

完整 Props、事件、Slot 与方法以 `docs/COMPONENT_API.md` 为准；本文不重复 60 项参数表。

## 1. 组件定位

- NavigationMenu 管理同一上下文中的可展开导航、菜单项、子菜单、勾选与单选状态；它不是站点左侧目录、页面路由器或普通 ButtonGroup。
- 默认根入口是 PUI Button，默认项目是 PUI Cell，徽标、图标、Loading、Empty 均复用 PUI；消费者业务导航、保存和远端刷新仍在组件外完成。
- 简单同层切换用 Tabs/Tabbar/Sidebar；任意表单选择不应滥用 NavigationMenu。

## 2. 固定结构与区域

```text
Navigation(role=navigation)
├─ root trigger viewport / menubar
│  └─ Button + optional Badge / indicator
└─ retained Layer（打开期间）
   ├─ Overlay（条件）
   └─ Panel(role=menu)
      ├─ Header：back / title / close
      ├─ Body：content | loading | error | empty
      └─ footer Slot（条件）
```

- Panel 与 Overlay 必须在进入、离开和子菜单切换期间保留节点；完成退场才可卸载。不得用 `display:none`、整 Stage 重绘或局部色块伪造遮罩。
- 状态优先级固定为 `error > loading > content > empty`。内容区只有一张 Panel Surface；嵌入 Empty 透明，不建立第二张卡。

## 3. PUI 组合、内容与 Slot

- 默认 Trigger 只能由 `buttonSample` / PUI Button 组合 Badge 与 Icon；位于 Trigger suffix 的 Badge 必须镜像原生空宿主的静态内联布局，不能继续绝对定位到菜单根或被 Trigger 裁切。默认 Item 只能由 `cellSample` / PUI Cell 组合，组件自定义 generic 才能替换对应内容。
- 默认 Header 的可用 back 与 close 必须使用 PUI 的实底圆形 IconButton：小程序为 `pui-button variant="base" shape="circle" size="small" icon-only`，H5 为 `iconButtonSample`。两者均固定 `56rpx / 28px`、中性实底和高对比图标；小程序 Header 的左右轨固定为按钮同宽，操作轨顶部对齐，Close 的顶部与右侧共同消费 `--pui-panel-padding-compact`，标题轨独立垂直居中。根层 `canBack=false` 时不渲染禁用按钮，只保留同尺寸、不可交互且无 Surface 的空轨平衡三列标题，禁止出现半透明幽灵控件、透明 text 变体或裸 `×`/箭头字形。
- `header/default/footer/empty` 是消费者组合区域。自定义 Slot 不得绕过 Layer、焦点、关闭、状态优先级或受控回写，也不得覆盖 Button/Cell/Badge 的几何。
- `direction="vertical"` 是左侧 Root rail + 右侧 Panel 的同层工作区：Panel 不能仍在 Root 下方展开并留下空白右列。该模式为保证可读内容区固定占满父级可用宽度；`panelWidth=0` 时右侧自动占用余量，传入值时在余量内收窄。
- 垂直工作区的两列间距必须由 `offset + space-normal` 共同组成；默认 390px 下为 `6px + 10px = 16px`，为右侧 Panel 的左侧投影预留完整安全区。Panel 的 entered 完成态必须归零为 `translateX(0) scale(1)`，不得残留入场位移或缩放。Root rail 的 Badge/Indicator 统一进入 Button 右侧尾轨；不得让 rail、后续状态文字或父级滚动裁切覆盖 Panel 阴影，也不得用页面私有 margin 补救。
- 页面底部的水平浮层属于绝对定位内容，不会自然撑高父级 ScrollArea；消费者应在展开期间通过 ScrollArea `contentPaddingBottom` 预留面板高度，关闭后恢复默认 `10vh`。
- Error 使用 PUI Empty 后的同级 Retry Button；retry 仅发出请求，必须等待 Props 回写，不能自动假定恢复。
- 小程序独立页不为 visible、value、expandedValue、checkedValues 或 radioValues 增加“已展开/已关闭/已选择”等重复状态文字；这些结果由组件本体表达。只有页面真实回写 error 恢复完成后，才可通过 ScrollArea 外的共享 `component-page-feedback` 显示 DynamicMessage，且不得覆盖 Error + Retry 的近场恢复入口。

## 4. 状态、受控与事件

- `value`、`expandedValue`、`visible`、`checkedValues`、`radioValues` 各自以 `null/undefined` 判定受控；`0`、`false`、空字符串等原始值必须保持类型和去重身份。
- 受控请求先发事件、等待父级写回；非受控使用对应 default。最多 12 个根、每层 50 项、全树 100 项、深度 3 层是为可用性设置的硬边界。
- disabled 阻断写入和动作，readonly 保留可查看但阻断选择；checkbox/radio、submenu、back、close、scroll 与实例方法遵循 API 中既定事件顺序。H5 不得把真实小程序导航 API 的成功伪造为网页成功。

## 5. 动效、可访问性与响应式

- Layer/Panel/内容双 pane 只过渡受测的 transform、opacity 和尺寸，默认 500ms、最大 1000ms；`reduceMotion` 与系统低动效均为 1ms。
- WXSS 必须通过根节点的时长 Token 传递低动效，禁止以 `*` 覆盖 Trigger、Cell、Badge 或消费者 Slot。
- 根为 navigation，Trigger 容器为 menubar，Panel 为 menu；Cell 键盘 Enter/Space 必须走同一选择路径并标记 `source=keyboard`。
- 390px 下 horizontal 根入口采用自适应宽度。Trigger viewport 是唯一 `overflow:hidden` 的裁切边界，Panel/Overlay 必须作为它的兄弟层保持可见。`scrollable=true && wrap=false` 时，每个真实 `trigger-host` 以 `208rpx` 为可读最小宽度：总宽放得下时共同等分铺满，超过容器时只在 Trigger viewport 内横向滚动；屏幕边界可裁切尚未滚入的项目，但不得用不透明遮罩盖住文字。`scrollable=false` 时所有 host 使用 `flex:1 1 0; min-width:0` 严格等分，只允许 Button 内部标题单行省略。`wrap=true` 时按同一 `208rpx` 最小轨换行，不建立横向滚动。默认 PUI Button 与自定义 `navigation-trigger` 的组件宿主都必须填满 host；Badge/Indicator 后缀不可被文字挤出。vertical 模式只保留自身纵向 ScrollView、满宽单列 Trigger 与完整 Badge。
- Overlay 必须使用 fixed 四向 `0` 覆盖真实页面 viewport；H5 由 PreviewDevice 自身的 containing block 与裁切边界限制为完整设备 viewport。禁止通过负 top/bottom 魔法数拼出只覆盖组件附近的半透明带。

## 6. H5 与跨端边界

- 标准概览采用 `edge-to-edge`，Layer 覆盖完整 PreviewDevice viewport；隐藏态保留真实 Trigger，不能留下空舞台。
- 官网通过 `component-only` 归一化移除实现标签、方法按钮、事件日志和 after 状态；概览只呈现用户可理解的 Trigger、Panel 与操作结果。方法和完整事件只进 API、示例和测试。
- 小程序使用 tap、scroll-view、fixed 遮罩与微信导航 API；H5 使用局部滚动、真实 PUI 组合和保留节点。rpx、安全区、读屏和微信导航回调仍需真机确认。

## 7. 明确禁止

- 禁止将 NavigationMenu 退化成 raw button 菜单，或以常驻工程方法卡替代真实入口。
- 禁止以 `autoNavigate` 在 H5 虚构导航成功，或由 retry/checkbox/footer 冒充业务保存。
- 禁止把 Layer 变为第二个 PreviewDevice、局部遮罩或页面滚动容器。

## 8. 修改闭环

1. 同步审计 `navigation-menu/` 四件套、Button/Cell/Badge/Icon/Loading/Empty 依赖、metadata、H5、API、示例、安装产物与 `miniprogram_dist`。
2. 运行 `node scripts/test-navigation-menu.js`，覆盖原始值、树上限、五重受控、submenu、状态、动效、导航边界及 PUI 组合。
3. 实测 390px 根入口、展开/关闭、submenu/back、checkbox/radio、loading/error/retry、500ms 中间帧、1ms、深浅色和外观开关；真机风险必须保留在 Ledger。

任何不能满足本文的实现必须在 Ledger 说明，不能静默绕过。

## 13. 等距与阴影资格

NavigationMenu 的展开 Panel 是独立 Surface；`equalSpacing` 只影响 Panel 直接结构和安全内距，触发轨道、连续菜单项及 Overlay 不参与。外投影只作用于 Panel 根。
