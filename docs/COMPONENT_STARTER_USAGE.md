# PoemUI 开箱用法

> 本文件由 `metadata/component-starter-usage.js` 自动生成。Starter Usage 是复制后立即可见、可理解的最小调用，不等于组件运行时默认值，也不改变小程序独立组件页的展示状态。

## 开始与规范

### 配置提供器 `config-provider`

#### page.json

```json
{
  "usingComponents": {
    "pui-config-provider": "poemui-miniprogram/config-provider/config-provider"
  }
}
```

#### page.wxml

```xml
<pui-config-provider>
  <view>页面内容</view>
</pui-config-provider>
```

## 基础组件

### 按钮 `button`

#### page.json

```json
{
  "usingComponents": {
    "pui-button": "poemui-miniprogram/button/button"
  }
}
```

#### page.wxml

```xml
<pui-button theme="primary">按钮</pui-button>
```

### 分割线 `divider`

#### page.json

```json
{
  "usingComponents": {
    "pui-divider": "poemui-miniprogram/divider/divider"
  }
}
```

#### page.wxml

```xml
<pui-divider content="分区标题" show-content />
```

### 图标 `icon`

#### page.json

```json
{
  "usingComponents": {
    "pui-icon": "poemui-miniprogram/icon/icon"
  }
}
```

#### page.wxml

```xml
<pui-icon name="spark" size="40" />
```

## 布局

### 比例容器 `aspect-ratio`

#### page.json

```json
{
  "usingComponents": {
    "pui-aspect-ratio": "poemui-miniprogram/aspect-ratio/aspect-ratio"
  }
}
```

#### page.wxml

```xml
<pui-aspect-ratio ratio="16 / 9" background="var(--pui-bg-muted)">
  <view>16:9 内容</view>
</pui-aspect-ratio>
```

### 方向容器 `direction`

#### page.json

```json
{
  "usingComponents": {
    "pui-direction": "poemui-miniprogram/direction/direction"
  }
}
```

#### page.wxml

```xml
<pui-direction content="PoemUI Direction 内容" />
```

### 宫格 `grid`

#### page.json

```json
{
  "usingComponents": {
    "pui-grid": "poemui-miniprogram/grid/grid"
  }
}
```

#### page.wxml

```xml
<pui-grid items="{{gridItems}}" />
```

#### page.js

```js
Page({
  data: {
  "gridItems": [
    {
      "label": "组件",
      "value": "components",
      "icon": "component"
    },
    {
      "label": "指南",
      "value": "guides",
      "icon": "file-text"
    },
    {
      "label": "安装",
      "value": "install",
      "icon": "code"
    },
    {
      "label": "设置",
      "value": "settings",
      "icon": "settings"
    }
  ]
}
})
```

### 滚动容器 `scroll-area`

#### page.json

```json
{
  "usingComponents": {
    "pui-scroll-area": "poemui-miniprogram/scroll-area/scroll-area",
    "pui-cell": "poemui-miniprogram/cell/cell"
  }
}
```

#### page.wxml

```xml
<pui-scroll-area height="400rpx">
  <pui-cell title="第一项" description="滚动区域内容" />
  <pui-cell title="第二项" description="继续向下滚动" />
  <pui-cell title="第三项" description="观察边缘提示" />
  <pui-cell title="第四项" description="滚动区域底部" />
</pui-scroll-area>
```

### 粘性布局 `sticky`

#### page.json

```json
{
  "usingComponents": {
    "pui-sticky": "poemui-miniprogram/sticky/sticky",
    "pui-cell": "poemui-miniprogram/cell/cell"
  }
}
```

#### page.wxml

```xml
<pui-sticky offset-top="{{0}}">
  <pui-cell title="吸顶标题" description="随页面滚动保持可见" />
</pui-sticky>
```

## 导航

### 回到顶部 `back-top`

#### page.json

```json
{
  "usingComponents": {
    "pui-back-top": "poemui-miniprogram/back-top/back-top"
  }
}
```

#### page.wxml

```xml
<pui-back-top fixed="{{false}}" scroll-top="{{320}}" text="返回顶部" />
```

### 面包屑 `breadcrumb`

#### page.json

```json
{
  "usingComponents": {
    "pui-breadcrumb": "poemui-miniprogram/breadcrumb/breadcrumb"
  }
}
```

#### page.wxml

```xml
<pui-breadcrumb items="{{breadcrumbItems}}" default-value="breadcrumb" />
```

#### page.js

```js
Page({
  data: {
  "breadcrumbItems": [
    {
      "label": "首页",
      "value": "home",
      "icon": "home"
    },
    {
      "label": "组件",
      "value": "components"
    },
    {
      "label": "面包屑",
      "value": "breadcrumb"
    }
  ]
}
})
```

### 索引 `indexes`

#### page.json

```json
{
  "usingComponents": {
    "pui-indexes": "poemui-miniprogram/indexes/indexes"
  }
}
```

#### page.wxml

```xml
<pui-indexes items="{{contactGroups}}" height="720rpx" />
```

#### page.js

```js
Page({
  data: {
  "contactGroups": [
    {
      "index": "A",
      "items": [
        {
          "title": "Alice",
          "value": "alice"
        }
      ]
    },
    {
      "index": "B",
      "items": [
        {
          "title": "Bob",
          "value": "bob"
        }
      ]
    },
    {
      "index": "C",
      "items": [
        {
          "title": "Carol",
          "value": "carol"
        }
      ]
    }
  ]
}
})
```

### 导航栏 `navbar`

#### page.json

```json
{
  "usingComponents": {
    "pui-navbar": "poemui-miniprogram/navbar/navbar"
  }
}
```

#### page.wxml

```xml
<pui-navbar title="页面标题" />
```

### 导航菜单 `navigation-menu`

#### page.json

```json
{
  "usingComponents": {
    "pui-navigation-menu": "poemui-miniprogram/navigation-menu/navigation-menu"
  }
}
```

#### page.wxml

```xml
<pui-navigation-menu items="{{navigationItems}}" default-value="components" />
```

#### page.js

```js
Page({
  data: {
  "navigationItems": [
    {
      "label": "组件",
      "value": "components",
      "icon": "component"
    },
    {
      "label": "指南",
      "value": "guides",
      "icon": "file-text"
    },
    {
      "label": "关于",
      "value": "about",
      "icon": "info"
    }
  ]
}
})
```

### 侧边导航 `sidebar`

#### page.json

```json
{
  "usingComponents": {
    "pui-sidebar": "poemui-miniprogram/sidebar/sidebar"
  }
}
```

#### page.wxml

```xml
<pui-sidebar items="{{sidebarItems}}" default-value="basic" height="560rpx" />
```

#### page.js

```js
Page({
  data: {
  "sidebarItems": [
    {
      "label": "基础组件",
      "value": "basic",
      "icon": "component"
    },
    {
      "label": "表单组件",
      "value": "form",
      "icon": "edit"
    },
    {
      "label": "反馈组件",
      "value": "feedback",
      "icon": "bell"
    },
    {
      "label": "高级组件",
      "value": "advanced",
      "icon": "premium"
    }
  ]
}
})
```

### 步骤条 `steps`

#### page.json

```json
{
  "usingComponents": {
    "pui-steps": "poemui-miniprogram/steps/steps"
  }
}
```

#### page.wxml

```xml
<pui-steps items="{{stepItems}}" current="{{1}}" />
```

#### page.js

```js
Page({
  data: {
  "stepItems": [
    {
      "title": "创建项目",
      "value": "create"
    },
    {
      "title": "安装组件",
      "value": "install"
    },
    {
      "title": "开始使用",
      "value": "ready"
    }
  ]
}
})
```

### 标签栏 `tabbar`

#### page.json

```json
{
  "usingComponents": {
    "pui-tabbar": "poemui-miniprogram/tabbar/tabbar"
  }
}
```

#### page.wxml

```xml
<pui-tabbar items="{{tabbarItems}}" default-value="home" fixed="{{false}}" />
```

#### page.js

```js
Page({
  data: {
  "tabbarItems": [
    {
      "label": "首页",
      "value": "home",
      "icon": "home"
    },
    {
      "label": "安装",
      "value": "install",
      "icon": "code"
    },
    {
      "label": "我的",
      "value": "me",
      "icon": "profile"
    }
  ]
}
})
```

### 选项卡 `tabs`

#### page.json

```json
{
  "usingComponents": {
    "pui-tabs": "poemui-miniprogram/tabs/tabs"
  }
}
```

#### page.wxml

```xml
<pui-tabs items="{{tabItems}}" default-value="overview" />
```

#### page.js

```js
Page({
  data: {
  "tabItems": [
    {
      "label": "概览",
      "value": "overview"
    },
    {
      "label": "API",
      "value": "api"
    },
    {
      "label": "属性",
      "value": "props"
    }
  ]
}
})
```

## 表单组件

### 表单 `form`

#### page.json

```json
{
  "usingComponents": {
    "pui-form": "poemui-miniprogram/form/form",
    "pui-field": "poemui-miniprogram/field/field",
    "pui-input": "poemui-miniprogram/input/input",
    "pui-button": "poemui-miniprogram/button/button"
  }
}
```

#### page.wxml

```xml
<pui-form data="{{formData}}" rules="{{formRules}}">
  <pui-field name="name" label="组件名称">
    <pui-input name="name" value="{{formData.name}}" placeholder="请输入组件名称" />
  </pui-field>
  <pui-button theme="primary" form-type="submit" block>提交</pui-button>
</pui-form>
```

#### page.js

```js
Page({
  data: {
  "formData": {
    "name": ""
  },
  "formRules": {
    "name": [
      {
        "required": true,
        "message": "请输入组件名称"
      }
    ]
  }
}
})
```

### 字段容器 `field`

#### page.json

```json
{
  "usingComponents": {
    "pui-field": "poemui-miniprogram/field/field",
    "pui-input": "poemui-miniprogram/input/input"
  }
}
```

#### page.wxml

```xml
<pui-field label="组件名称" required>
  <pui-input placeholder="请输入组件名称" />
</pui-field>
```

### 标签 `label`

#### page.json

```json
{
  "usingComponents": {
    "pui-label": "poemui-miniprogram/label/label"
  }
}
```

#### page.wxml

```xml
<pui-label content="字段名称" required />
```

### 输入框 `input`

#### page.json

```json
{
  "usingComponents": {
    "pui-input": "poemui-miniprogram/input/input"
  }
}
```

#### page.wxml

```xml
<pui-input placeholder="请输入内容" />
```

### 验证码 `input-otp`

#### page.json

```json
{
  "usingComponents": {
    "pui-input-otp": "poemui-miniprogram/input-otp/input-otp"
  }
}
```

#### page.wxml

```xml
<pui-input-otp length="{{6}}" />
```

### 文本域 `textarea`

#### page.json

```json
{
  "usingComponents": {
    "pui-textarea": "poemui-miniprogram/textarea/textarea"
  }
}
```

#### page.wxml

```xml
<pui-textarea placeholder="请输入详细说明" maxlength="{{200}}" indicator />
```

### 搜索 `search`

#### page.json

```json
{
  "usingComponents": {
    "pui-search": "poemui-miniprogram/search/search"
  }
}
```

#### page.wxml

```xml
<pui-search placeholder="搜索组件" />
```

### 复选框 `checkbox`

#### page.json

```json
{
  "usingComponents": {
    "pui-checkbox": "poemui-miniprogram/checkbox/checkbox"
  }
}
```

#### page.wxml

```xml
<pui-checkbox content="同意服务协议" />
```

### 单选框 `radio`

#### page.json

```json
{
  "usingComponents": {
    "pui-radio": "poemui-miniprogram/radio/radio"
  }
}
```

#### page.wxml

```xml
<pui-radio content="选择此项" />
```

### 开关 `switch`

#### page.json

```json
{
  "usingComponents": {
    "pui-switch": "poemui-miniprogram/switch/switch"
  }
}
```

#### page.wxml

```xml
<pui-switch default-value="{{true}}" aria-label="启用功能" />
```

### 选择器 `select`

#### page.json

```json
{
  "usingComponents": {
    "pui-select": "poemui-miniprogram/select/select"
  }
}
```

#### page.wxml

```xml
<pui-select options="{{selectOptions}}" placeholder="请选择" />
```

#### page.js

```js
Page({
  data: {
  "selectOptions": [
    {
      "label": "选项一",
      "value": "one"
    },
    {
      "label": "选项二",
      "value": "two"
    },
    {
      "label": "选项三",
      "value": "three"
    },
    {
      "label": "选项四",
      "value": "four"
    }
  ]
}
})
```

### 选择器 `picker`

#### page.json

```json
{
  "usingComponents": {
    "pui-picker": "poemui-miniprogram/picker/picker"
  }
}
```

#### page.wxml

```xml
<pui-picker columns="{{pickerColumns}}" visible="{{true}}" title="请选择" />
```

#### page.js

```js
Page({
  data: {
  "pickerColumns": [
    {
      "label": "选项一",
      "value": "one"
    },
    {
      "label": "选项二",
      "value": "two"
    },
    {
      "label": "选项三",
      "value": "three"
    },
    {
      "label": "选项四",
      "value": "four"
    }
  ]
}
})
```

### 组合框 `combobox`

#### page.json

```json
{
  "usingComponents": {
    "pui-combobox": "poemui-miniprogram/combobox/combobox"
  }
}
```

#### page.wxml

```xml
<pui-combobox options="{{comboboxOptions}}" placeholder="搜索组件" />
```

#### page.js

```js
Page({
  data: {
  "comboboxOptions": [
    {
      "label": "Button 按钮",
      "value": "button",
      "icon": "command"
    },
    {
      "label": "Popup 弹出层",
      "value": "popup",
      "icon": "layers"
    },
    {
      "label": "Tabs 选项卡",
      "value": "tabs",
      "icon": "component"
    },
    {
      "label": "Input 输入框",
      "value": "input",
      "icon": "edit"
    }
  ]
}
})
```

### 滑块 `slider`

#### page.json

```json
{
  "usingComponents": {
    "pui-slider": "poemui-miniprogram/slider/slider"
  }
}
```

#### page.wxml

```xml
<pui-slider default-value="{{40}}" show-value />
```

### 步进器 `stepper`

#### page.json

```json
{
  "usingComponents": {
    "pui-stepper": "poemui-miniprogram/stepper/stepper"
  }
}
```

#### page.wxml

```xml
<pui-stepper default-value="{{1}}" min="{{0}}" max="{{10}}" />
```

### 评分 `rate`

#### page.json

```json
{
  "usingComponents": {
    "pui-rate": "poemui-miniprogram/rate/rate"
  }
}
```

#### page.wxml

```xml
<pui-rate default-value="{{4}}" show-text />
```

### 日历 `calendar`

#### page.json

```json
{
  "usingComponents": {
    "pui-calendar": "poemui-miniprogram/calendar/calendar"
  }
}
```

#### page.wxml

```xml
<pui-calendar visible="{{true}}" title="选择日期" />
```

### 时间选择 `date-time-picker`

#### page.json

```json
{
  "usingComponents": {
    "pui-date-time-picker": "poemui-miniprogram/date-time-picker/date-time-picker"
  }
}
```

#### page.wxml

```xml
<pui-date-time-picker visible="{{true}}" title="选择日期" mode="date" />
```

### 上传 `upload`

#### page.json

```json
{
  "usingComponents": {
    "pui-upload": "poemui-miniprogram/upload/upload"
  }
}
```

#### page.wxml

```xml
<pui-upload add-content="选择文件" />
```

## 数据展示

### 折叠面板 `collapse`

#### page.json

```json
{
  "usingComponents": {
    "pui-collapse": "poemui-miniprogram/collapse/collapse"
  }
}
```

#### page.wxml

```xml
<pui-collapse items="{{collapseItems}}" default-value="{{['about']}}" />
```

#### page.js

```js
Page({
  data: {
  "collapseItems": [
    {
      "label": "什么是 PoemUI？",
      "value": "about",
      "description": "面向微信小程序的原生组件库。"
    },
    {
      "label": "如何安装？",
      "value": "install",
      "description": "通过 npm 安装后在开发者工具中构建 npm。"
    }
  ]
}
})
```

### 头像 `avatar`

#### page.json

```json
{
  "usingComponents": {
    "pui-avatar": "poemui-miniprogram/avatar/avatar"
  }
}
```

#### page.wxml

```xml
<pui-avatar text="PUI" aria-label="PoemUI 头像" />
```

### 徽标 `badge`

#### page.json

```json
{
  "usingComponents": {
    "pui-badge": "poemui-miniprogram/badge/badge",
    "pui-icon": "poemui-miniprogram/icon/icon"
  }
}
```

#### page.wxml

```xml
<pui-badge count="{{3}}">
  <pui-icon name="bell" size="44" />
</pui-badge>
```

### 消息气泡 `bubble`

#### page.json

```json
{
  "usingComponents": {
    "pui-bubble": "poemui-miniprogram/bubble/bubble"
  }
}
```

#### page.wxml

```xml
<pui-bubble content="这是一条 PoemUI 消息。" />
```

### 卡片 `card`

#### page.json

```json
{
  "usingComponents": {
    "pui-card": "poemui-miniprogram/card/card"
  }
}
```

#### page.wxml

```xml
<pui-card title="卡片标题" description="用于组织相关内容" show-header>
  <view>卡片内容</view>
</pui-card>
```

### 单元格 `cell`

#### page.json

```json
{
  "usingComponents": {
    "pui-cell": "poemui-miniprogram/cell/cell"
  }
}
```

#### page.wxml

```xml
<pui-cell title="组件标题" value="说明" arrow />
```

### 折叠内容 `collapsible`

#### page.json

```json
{
  "usingComponents": {
    "pui-collapsible": "poemui-miniprogram/collapsible/collapsible"
  }
}
```

#### page.wxml

```xml
<pui-collapsible label="查看详情" content="这里是可展开的内容。" default-open />
```

### 倒计时 `count-down`

#### page.json

```json
{
  "usingComponents": {
    "pui-count-down": "poemui-miniprogram/count-down/count-down"
  }
}
```

#### page.wxml

```xml
<pui-count-down time="{{3661000}}" split-with-unit />
```

### 图片 `image`

#### page.json

```json
{
  "usingComponents": {
    "pui-image": "poemui-miniprogram/image/image"
  }
}
```

#### page.wxml

```xml
<pui-image width="200rpx" height="200rpx" text="暂无图片" />
```

### 列表 `list`

#### page.json

```json
{
  "usingComponents": {
    "pui-list": "poemui-miniprogram/list/list"
  }
}
```

#### page.wxml

```xml
<pui-list items="{{listItems}}" show-icon show-description />
```

#### page.js

```js
Page({
  data: {
  "listItems": [
    {
      "title": "Button 按钮",
      "description": "触发用户操作",
      "leftIcon": "command"
    },
    {
      "title": "Input 输入框",
      "description": "输入文字内容",
      "leftIcon": "edit"
    },
    {
      "title": "Popup 弹出层",
      "description": "承载临时内容",
      "leftIcon": "layers"
    },
    {
      "title": "Tabs 选项卡",
      "description": "切换内容分类",
      "leftIcon": "component"
    }
  ]
}
})
```

### 滑动单元格 `swipe-cell`

#### page.json

```json
{
  "usingComponents": {
    "pui-swipe-cell": "poemui-miniprogram/swipe-cell/swipe-cell",
    "pui-cell": "poemui-miniprogram/cell/cell"
  }
}
```

#### page.wxml

```xml
<pui-swipe-cell right="{{swipeActions}}">
  <pui-cell title="向左滑动" description="显示可用操作" />
</pui-swipe-cell>
```

#### page.js

```js
Page({
  data: {
  "swipeActions": [
    {
      "text": "收藏",
      "value": "favorite",
      "icon": "star"
    },
    {
      "text": "删除",
      "value": "delete",
      "theme": "danger",
      "icon": "delete"
    }
  ]
}
})
```

### 轮播图 `swiper`

#### page.json

```json
{
  "usingComponents": {
    "pui-swiper": "poemui-miniprogram/swiper/swiper"
  }
}
```

#### page.wxml

```xml
<pui-swiper items="{{swiperItems}}" height="{{320}}" />
```

#### page.js

```js
Page({
  data: {
  "swiperItems": [
    {
      "value": "one",
      "title": "第一张",
      "description": "组件预览"
    },
    {
      "value": "two",
      "title": "第二张",
      "description": "交互状态"
    },
    {
      "value": "three",
      "title": "第三张",
      "description": "主题外观"
    }
  ]
}
})
```

### 表格 `table`

#### page.json

```json
{
  "usingComponents": {
    "pui-table": "poemui-miniprogram/table/table"
  }
}
```

#### page.wxml

```xml
<pui-table columns="{{tableColumns}}" data="{{tableData}}" />
```

#### page.js

```js
Page({
  data: {
  "tableColumns": [
    {
      "key": "name",
      "title": "组件"
    },
    {
      "key": "category",
      "title": "分类"
    },
    {
      "key": "status",
      "title": "状态"
    }
  ],
  "tableData": [
    {
      "id": 1,
      "name": "Button",
      "category": "基础",
      "status": "稳定"
    },
    {
      "id": 2,
      "name": "Popup",
      "category": "浮层",
      "status": "稳定"
    },
    {
      "id": 3,
      "name": "Tabs",
      "category": "导航",
      "status": "稳定"
    }
  ]
}
})
```

### 标签 `tag`

#### page.json

```json
{
  "usingComponents": {
    "pui-tag": "poemui-miniprogram/tag/tag"
  }
}
```

#### page.wxml

```xml
<pui-tag theme="primary">标签</pui-tag>
```

## 反馈

### 提示 `alert`

#### page.json

```json
{
  "usingComponents": {
    "pui-alert": "poemui-miniprogram/alert/alert"
  }
}
```

#### page.wxml

```xml
<pui-alert theme="primary" title="提示" description="这里是需要关注的信息。" />
```

### 对话框 `dialog`

#### page.json

```json
{
  "usingComponents": {
    "pui-dialog": "poemui-miniprogram/dialog/dialog"
  }
}
```

#### page.wxml

```xml
<pui-dialog visible="{{true}}" title="确认操作" content="请确认是否继续。" show-footer />
```

### 空状态 `empty`

#### page.json

```json
{
  "usingComponents": {
    "pui-empty": "poemui-miniprogram/empty/empty"
  }
}
```

#### page.wxml

```xml
<pui-empty icon="inbox" description="暂无内容" />
```

### 加载 `loading`

#### page.json

```json
{
  "usingComponents": {
    "pui-loading": "poemui-miniprogram/loading/loading"
  }
}
```

#### page.wxml

```xml
<pui-loading text="加载中" />
```

### 通知栏 `notice-bar`

#### page.json

```json
{
  "usingComponents": {
    "pui-notice-bar": "poemui-miniprogram/notice-bar/notice-bar"
  }
}
```

#### page.wxml

```xml
<pui-notice-bar theme="warning" content="这是一条重要通知。" />
```

### 进度条 `progress`

#### page.json

```json
{
  "usingComponents": {
    "pui-progress": "poemui-miniprogram/progress/progress"
  }
}
```

#### page.wxml

```xml
<pui-progress percentage="{{64}}" label status="active" />
```

### 结果页 `result`

#### page.json

```json
{
  "usingComponents": {
    "pui-result": "poemui-miniprogram/result/result"
  }
}
```

#### page.wxml

```xml
<pui-result theme="success" title="操作完成" description="结果已经保存。" />
```

### 骨架屏 `skeleton`

#### page.json

```json
{
  "usingComponents": {
    "pui-skeleton": "poemui-miniprogram/skeleton/skeleton"
  }
}
```

#### page.wxml

```xml
<pui-skeleton loading />
```

### 轻提示 `toast`

#### page.json

```json
{
  "usingComponents": {
    "pui-toast": "poemui-miniprogram/toast/toast"
  }
}
```

#### page.wxml

```xml
<pui-toast id="starter-toast" />
```

#### page.js

```js
Page({
  onReady() {
    this.selectComponent('#starter-toast').show({ message: '操作完成' })
  }
})
```

## 浮层

### 动作面板 `action-sheet`

#### page.json

```json
{
  "usingComponents": {
    "pui-action-sheet": "poemui-miniprogram/action-sheet/action-sheet"
  }
}
```

#### page.wxml

```xml
<pui-action-sheet items="{{actionItems}}" visible="{{true}}" description="请选择操作" />
```

#### page.js

```js
Page({
  data: {
  "actionItems": [
    {
      "label": "编辑",
      "value": "edit",
      "icon": "edit"
    },
    {
      "label": "分享",
      "value": "share",
      "icon": "share"
    },
    {
      "label": "删除",
      "value": "delete",
      "icon": "delete",
      "theme": "danger"
    }
  ]
}
})
```

### 下拉菜单 `dropdown-menu`

#### page.json

```json
{
  "usingComponents": {
    "pui-dropdown-menu": "poemui-miniprogram/dropdown-menu/dropdown-menu"
  }
}
```

#### page.wxml

```xml
<pui-dropdown-menu items="{{dropdownItems}}" />
```

#### page.js

```js
Page({
  data: {
  "dropdownItems": [
    {
      "label": "排序",
      "value": "sort",
      "options": [
        {
          "label": "默认排序",
          "value": "default"
        },
        {
          "label": "最新发布",
          "value": "latest"
        }
      ]
    }
  ]
}
})
```

### 遮罩 `overlay`

#### page.json

```json
{
  "usingComponents": {
    "pui-overlay": "poemui-miniprogram/overlay/overlay"
  }
}
```

#### page.wxml

```xml
<pui-overlay visible="{{true}}" />
```

### 气泡浮层 `popover`

#### page.json

```json
{
  "usingComponents": {
    "pui-popover": "poemui-miniprogram/popover/popover",
    "pui-button": "poemui-miniprogram/button/button"
  }
}
```

#### page.wxml

```xml
<pui-popover default-visible content="Popover 内容">
  <pui-button variant="outline">打开 Popover</pui-button>
</pui-popover>
```

### 弹出层 `popup`

#### page.json

```json
{
  "usingComponents": {
    "pui-popup": "poemui-miniprogram/popup/popup"
  }
}
```

#### page.wxml

```xml
<pui-popup visible="{{true}}" content="Popup 内容" />
```

### 底部面板 `sheet`

#### page.json

```json
{
  "usingComponents": {
    "pui-sheet": "poemui-miniprogram/sheet/sheet"
  }
}
```

#### page.wxml

```xml
<pui-sheet visible="{{true}}" title="Sheet 标题" content="Sheet 内容" />
```

## 高级

### 面积图 `area-chart`

#### page.json

```json
{
  "usingComponents": {
    "pui-area-chart": "poemui-miniprogram/area-chart/area-chart"
  }
}
```

#### page.wxml

```xml
<pui-area-chart items="{{areaItems}}" />
```

#### page.js

```js
Page({
  data: {
  "areaItems": [
    {
      "label": "1 月",
      "value": 12
    },
    {
      "label": "2 月",
      "value": 18
    },
    {
      "label": "3 月",
      "value": 15
    },
    {
      "label": "4 月",
      "value": 26
    }
  ]
}
})
```

### 条形图 `bar-chart`

#### page.json

```json
{
  "usingComponents": {
    "pui-bar-chart": "poemui-miniprogram/bar-chart/bar-chart"
  }
}
```

#### page.wxml

```xml
<pui-bar-chart items="{{barItems}}" />
```

#### page.js

```js
Page({
  data: {
  "barItems": [
    {
      "label": "基础",
      "value": 18
    },
    {
      "label": "表单",
      "value": 20
    },
    {
      "label": "反馈",
      "value": 12
    },
    {
      "label": "高级",
      "value": 8
    }
  ]
}
})
```

### 圆环图 `donut-chart`

#### page.json

```json
{
  "usingComponents": {
    "pui-donut-chart": "poemui-miniprogram/donut-chart/donut-chart"
  }
}
```

#### page.wxml

```xml
<pui-donut-chart items="{{donutItems}}" />
```

#### page.js

```js
Page({
  data: {
  "donutItems": [
    {
      "key": "basic",
      "label": "基础",
      "value": 24,
      "theme": "blue"
    },
    {
      "key": "form",
      "label": "表单",
      "value": 18,
      "theme": "teal"
    },
    {
      "key": "advanced",
      "label": "高级",
      "value": 13,
      "theme": "violet"
    }
  ]
}
})
```

### 灵动通知 `dynamic-message`

#### page.json

```json
{
  "usingComponents": {
    "pui-dynamic-message": "poemui-miniprogram/dynamic-message/dynamic-message"
  }
}
```

#### page.wxml

```xml
<pui-dynamic-message id="starter-message" />
```

#### page.js

```js
Page({
  onReady() {
    this.selectComponent('#starter-message').show({
      theme: 'info',
      title: '更新提示',
      message: '组件数据已刷新。'
    })
  }
})
```

### 下拉刷新 `pull-refresh`

#### page.json

```json
{
  "usingComponents": {
    "pui-pull-refresh": "poemui-miniprogram/pull-refresh/pull-refresh",
    "pui-cell": "poemui-miniprogram/cell/cell"
  }
}
```

#### page.wxml

```xml
<pui-pull-refresh>
  <pui-cell title="下拉刷新" description="刷新结果由父级真实回写" />
  <pui-cell title="组件目录" value="78 个组件" />
</pui-pull-refresh>
```

### 雷达图 `radar-chart`

#### page.json

```json
{
  "usingComponents": {
    "pui-radar-chart": "poemui-miniprogram/radar-chart/radar-chart"
  }
}
```

#### page.wxml

```xml
<pui-radar-chart indicators="{{radarIndicators}}" series="{{radarSeries}}" />
```

#### page.js

```js
Page({
  data: {
  "radarIndicators": [
    {
      "key": "api",
      "label": "API",
      "max": 100
    },
    {
      "key": "theme",
      "label": "主题",
      "max": 100
    },
    {
      "key": "motion",
      "label": "动效",
      "max": 100
    },
    {
      "key": "a11y",
      "label": "无障碍",
      "max": 100
    },
    {
      "key": "docs",
      "label": "文档",
      "max": 100
    }
  ],
  "radarSeries": [
    {
      "key": "current",
      "label": "当前版本",
      "values": [
        88,
        92,
        78,
        84,
        90
      ],
      "theme": "violet"
    }
  ]
}
})
```

### 排序列表 `sortable-list`

#### page.json

```json
{
  "usingComponents": {
    "pui-sortable-list": "poemui-miniprogram/sortable-list/sortable-list"
  }
}
```

#### page.wxml

```xml
<pui-sortable-list items="{{sortableItems}}" />
```

#### page.js

```js
Page({
  data: {
  "sortableItems": [
    {
      "key": "install",
      "title": "安装组件",
      "description": "构建 npm 并注册组件",
      "icon": "download"
    },
    {
      "key": "theme",
      "title": "配置主题",
      "description": "挂载 ConfigProvider",
      "icon": "palette"
    },
    {
      "key": "verify",
      "title": "完成验收",
      "description": "同步 H5 与契约测试",
      "icon": "check-circle"
    }
  ]
}
})
```

### 顶部加载 `top-loading`

#### page.json

```json
{
  "usingComponents": {
    "pui-top-loading": "poemui-miniprogram/top-loading/top-loading"
  }
}
```

#### page.wxml

```xml
<pui-top-loading state="loading" progress="{{64}}" />
```

### 功能引导 `tour`

#### page.json

```json
{
  "usingComponents": {
    "pui-tour": "poemui-miniprogram/tour/tour"
  }
}
```

#### page.wxml

```xml
<pui-tour steps="{{tourSteps}}" default-visible="{{true}}" />
```

#### page.js

```js
Page({
  data: {
  "tourSteps": [
    {
      "key": "start",
      "selector": "#tour-start-target",
      "title": "开始使用",
      "content": "从这个入口开始。",
      "placement": "bottom"
    }
  ]
}
})
```

### 虚拟列表 `virtual-list`

#### page.json

```json
{
  "usingComponents": {
    "pui-virtual-list": "poemui-miniprogram/virtual-list/virtual-list"
  }
}
```

#### page.wxml

```xml
<pui-virtual-list items="{{virtualItems}}" height="{{560}}" item-height="{{112}}" />
```

#### page.js

```js
Page({
  data: {
  "virtualItems": [
    {
      "value": "component-1",
      "title": "组件 1",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-2",
      "title": "组件 2",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-3",
      "title": "组件 3",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-4",
      "title": "组件 4",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-5",
      "title": "组件 5",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-6",
      "title": "组件 6",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-7",
      "title": "组件 7",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-8",
      "title": "组件 8",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-9",
      "title": "组件 9",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-10",
      "title": "组件 10",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-11",
      "title": "组件 11",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-12",
      "title": "组件 12",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-13",
      "title": "组件 13",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-14",
      "title": "组件 14",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-15",
      "title": "组件 15",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-16",
      "title": "组件 16",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-17",
      "title": "组件 17",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-18",
      "title": "组件 18",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-19",
      "title": "组件 19",
      "description": "可滚动的虚拟列表条目"
    },
    {
      "value": "component-20",
      "title": "组件 20",
      "description": "可滚动的虚拟列表条目"
    }
  ]
}
})
```

### 组件点阵图 `waffle`

#### page.json

```json
{
  "usingComponents": {
    "pui-waffle": "poemui-miniprogram/waffle/waffle"
  }
}
```

#### page.wxml

```xml
<pui-waffle items="{{waffleItems}}" />
```

#### page.js

```js
Page({
  data: {
  "waffleItems": [
    {
      "label": "稳定组件",
      "value": 58,
      "theme": "primary"
    },
    {
      "label": "新增组件",
      "value": 16,
      "theme": "success"
    }
  ]
}
})
```

### 水印 `watermark`

#### page.json

```json
{
  "usingComponents": {
    "pui-watermark": "poemui-miniprogram/watermark/watermark"
  }
}
```

#### page.wxml

```xml
<pui-watermark content="PoemUI">
  <view>受水印保护的页面内容</view>
</pui-watermark>
```

