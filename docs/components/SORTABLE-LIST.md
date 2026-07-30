# SortableList 组件语义合同

本文是 PoemUI SortableList 的长期合同。修改前必须查询：

`npm run feedback:list -- --component sortable-list`

Props、事件和方法完整表以 `docs/COMPONENT_API.md` 为准。

> 0.1.4 发布边界：`animated / duration / reduceMotion` 控制活动行的缩放、透明度和背景过渡；跨过行中心后按当前实现提交新顺序，不承诺兄弟行 FLIP 让位、跟手悬浮或落位回弹。PUI-FB-0530 已按用户决定关闭，不作为当前组件合同或发布阻断。

## 1. 组件定位

SortableList 负责在一个连续列表内请求顺序变化，不负责保存、同步、撤销栈、跨列表拖放或业务成功提示。`items` 是父级真相源；拖动结束和 `move()` 只发布 `{from,to,items}`，消费者必须真实持久化并回写。

## 2. 结构与 PUI 组合

组件是一个集合根和唯一内部 `scroll-view`，直接子项固定组合 PUI Cell 与 PUI Icon 句柄。连续行不得拆成独立 Card，也不得逐行获得阴影、毛玻璃、大间距或等距 Surface。`height` 为组件滚动所有权边界；页面不得再穿透修改内部滚动。

集合根可使用主题 Surface、语义圆角和中性边框；阴影与毛玻璃资格为 none，`equalSpacing` 不改变行内距或分隔关系。`bordered=false` 只隐藏集合根中性边界，不改变尺寸。

## 3. 交互、状态与事件

- `dragFrom=handle` 时只有句柄长按启动；`item` 时整行长按启动。
- `disabledKeys` 与 `item.disabled` 禁止该项作为拖动源，但条目仍可读。
- 拖动中跨过行中心更新目标索引，接近唯一滚动区边缘时自动滚动。
- 顺序改变发布 `dragstart → dragging* → change`；触摸取消或 `cancel()` 发布 `cancel` 并恢复开始前顺序。
- `animated=false` 关闭重排过渡，`reduceMotion` 压缩为 1ms；二者不改变事件和排序结果。

### 3.1 当前动效边界

- `duration` 默认 `300ms`、上限 `1000ms`，只作用于活动行的 opacity、scale 和背景色过渡。
- `animated=false` 与 `reduceMotion=true` 都将过渡压缩为 `1ms`；事件、最终顺序和父级回写职责不变。
- 当前版本不承诺拖动行实时悬浮跟手、兄弟行几何让位或取消回弹，不得在文档和演示中把顺序切换描述为已具备这些动效。

## 4. 可访问性与 H5

根使用 list 语义，行使用 listitem，句柄提供“拖动排序 + 标题”的名称。H5 镜像必须同时支持 Pointer 拖动与句柄键盘操作；ArrowUp/ArrowDown 请求相邻移动，并保持焦点在同一稳定 key。小程序平台没有等价键盘拖动时必须通过 `move()` 提供可编程替代，不伪造已验证的键盘能力。

标准预览使用 `shadow-safe`；390px 下句柄保持 32px 以上命中区，正文自然换行，不能用 text-cut 隐藏关键标题。

## 5. 明确禁止与修改闭环

- 禁止组件自行写本地存储、网络接口或显示“保存成功”。
- 禁止创建第二滚动根、跨列表拖放或拖动期间劫持无关页面焦点。
- 禁止把每行变成独立 Surface。

修改需同步原生/H5 行为、元数据、独立页、API、Ledger、契约测试、产物与本地安装，并验证长列表、变高行、禁用项、取消、父级拒绝、边缘滚动、Pointer/键盘/`move()`、390px、主题和低动效。
