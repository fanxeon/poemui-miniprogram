# PoemUI 组件清单

> 本文件由 `metadata/components.js` 自动生成。修改组件状态、公开 Props 或官网目录时，请运行 `npm run site:build`。

当前 npm 包包含 71 个组件目录：`done` 71 个，`beta` 0 个，`experimental` 0 个。

- `done`：稳定发布组件，核心 API 与主交互已完成验证。
- `beta`：具有独立 WXML、WXSS、JS 实现的受控发布组件，主路径可用，复杂 API 按版本继续扩展。
- `experimental`：历史目录和兼容壳，允许安装以便迁移或试用，但不能视为稳定 API、真机验收或正式版本承诺。
- `planned` / `research`：设计规范或平台研究项，不是可安装组件。

## 开始与规范

| 组件/能力 | 状态 | 路径 | 当前交付边界 |
| --- | --- | --- | --- |
| Getting Started 快速开始 | done | `poemui-miniprogram@0.1.0 · npm 尚未发布` | 发布状态、安装、构建 npm、按需引用、主题配置、AI Skill、许可证 |
| ConfigProvider | done | `poemui-miniprogram/config-provider/config-provider` | `theme`、`shadow`、`frostedGlass`、`largeRadius`、`bordered`、`equalSpacing`、`useGlobalConfig`、`customClass`、`customStyle` |
| Theme Tokens | done | `poemui-miniprogram/theme/theme.wxss` | light、dark、frost/shadow/radius |
| Color 色彩 | done | `poemui-miniprogram/theme/theme.wxss` | light/dark、brand 1–10、success/warning/danger/info、8 组 accent、text/surface/border |
| Style Utilities | done | `poemui-miniprogram/theme/utilities.wxss` | 562 selectors、五个浏览分类、32 个精选色彩 utility、9 个背景渐变预设、32 个 dark variants、Grid 1–6 列、safe-area、reduce-motion |
| Spacing 间距 | done | `poemui-miniprogram/theme/utilities.wxss` | xxs/xs/sm/normal/lg/xl/xxl/3xl、margin/padding/gap、axis utilities |

## 基础组件

| 组件/能力 | 状态 | 路径 | 当前交付边界 |
| --- | --- | --- | --- |
| Button 按钮 | done | `poemui-miniprogram/button/button` | `theme`、`variant`、`surface`、`content`、`size`、`shape`、`block`、`icon`、`iconOnly`、`loading`、`loadingProps`、`disabled`、`openType`、`formType`、`lang`、`sessionFrom`、`sendMessageTitle`、`sendMessagePath`、`sendMessageImg`、`showMessageCard`、`appParameter`、`hoverClass`、`hoverStartTime`、`hoverStayTime`、`hoverStopPropagation`、`phoneNumberNoQuotaToast`、`activityType`、`entrancePath`、`needShowEntrance`、`ariaLabel`、`reduceMotion` |
| Divider 分割线 | done | `poemui-miniprogram/divider/divider` | `layout`、`align`、`content`、`showContent`、`dashed`、`decorative`、`ariaLabel` |
| Icon 图标 | done | `poemui-miniprogram/icon/icon` | `name`、`size`、`color`、`ariaLabel` |
| Typography 排版 | done | `poemui-miniprogram/theme/utilities.wxss` | display/headline/title/body/label/caption、font weight、truncate/clamp |

## 布局

| 组件/能力 | 状态 | 路径 | 当前交付边界 |
| --- | --- | --- | --- |
| Aspect Ratio | done | `poemui-miniprogram/aspect-ratio/aspect-ratio` | `ratio`、`bordered`、`radius`、`background`、`overflow`、`duration`、`easing`、`reduceMotion` |
| Direction 方向容器 | done | `poemui-miniprogram/direction/direction` | `direction`、`language`、`fallbackDirection`、`textAlign`、`display`、`content`、`useSlot`、`selectable`、`ariaLabel`、`duration`、`easing`、`reduceMotion`、`customClass`、`customStyle` |
| Grid 宫格 | done | `poemui-miniprogram/grid/grid` | `items`、`column`、`gutter`、`border`、`align`、`disabled`、`loading`、`error`、`loadingText`、`errorText`、`emptyText`、`retryText`、`ariaLabel`、`reduceMotion` |
| Scroll Area | done | `poemui-miniprogram/scroll-area/scroll-area` | `height`、`scrollTop`、`scrollIntoView`、`gradientOverlay`、`gradientOverlayColor`、`gradientOverlaySize`、`contentPaddingBottom`、`ariaLabel` |
| Sticky 粘性布局 | done | `poemui-miniprogram/sticky/sticky` | `container`、`disabled`、`offsetTop`、`zIndex` |

## 导航

| 组件/能力 | 状态 | 路径 | 当前交付边界 |
| --- | --- | --- | --- |
| BackTop 回到顶部 | done | `poemui-miniprogram/back-top/back-top` | `fixed`、`icon`、`scrollTop`、`text`、`theme`、`visibilityHeight`、`ariaLabel`、`reduceMotion` |
| Breadcrumb | done | `poemui-miniprogram/breadcrumb/breadcrumb` | `items`、`value`、`defaultValue`、`current`、`separator`、`separatorIcon`、`showIcon`、`size`、`wrap`、`maxLabelLength`、`currentClickable`、`customPrefix`、`customSuffix`、`disabled`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`ariaLabel`、`duration`、`easing`、`reduceMotion` |
| Indexes 索引 | done | `poemui-miniprogram/indexes/indexes` | `items`、`current`、`defaultCurrent`、`indexList`、`showFullIndex`、`height`、`sticky`、`stickyOffset`、`indexPosition`、`clickable`、`readonly`、`disabled`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`ariaLabel`、`reduceMotion` |
| Navbar 导航栏 | done | `poemui-miniprogram/navbar/navbar` | `title`、`titleMaxLength`、`leftArrow`、`leftBtn`、`rightBtn`、`fixed`、`placeholder`、`safeAreaInsetTop`、`capsule`、`visible`、`zIndex`、`loading`、`transparent`、`bordered`、`disabled`、`ariaLabel`、`reduceMotion` |
| Navigation Menu | done | `poemui-miniprogram/navigation-menu/navigation-menu` | `items`、`value`、`defaultValue`、`expandedValue`、`defaultExpandedValue`、`visible`、`defaultVisible`、`checkedValues`、`defaultCheckedValues`、`radioValues`、`defaultRadioValues`、`itemKey`、`labelKey`、`childrenKey`、`iconKey`、`mode`、`direction`、`placement`、`variant`、`size`、`block`、`scrollable`、`wrap`、`showHeader`、`showIcon`、`showDescription`、`showBadge`、`showIndicator`、`indicatorIcon`、`showGroup`、`showSeparator`、`showShortcut`、`closeOnSelect`、`closeOnCheck`、`closeOnOverlayClick`、`showOverlay`、`resetSubmenuOnClose`、`autoNavigate`、`customTrigger`、`customItem`、`customHeader`、`customContent`、`customFooter`、`customEmpty`、`disabled`、`readonly`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`panelWidth`、`maxHeight`、`offset`、`zIndex`、`ariaLabel`、`duration`、`easing`、`reduceMotion` |
| Sidebar | done | `poemui-miniprogram/sidebar/sidebar` | `items`、`value`、`defaultValue`、`theme`、`bordered`、`width`、`height`、`showGroupTitle`、`sticky`、`stickyOffset`、`showIcon`、`showDescription`、`showBadge`、`clickable`、`readonly`、`disabled`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`ariaLabel`、`reduceMotion` |
| Steps 步骤条 | done | `poemui-miniprogram/steps/steps` | `items`、`current`、`defaultCurrent`、`currentStatus`、`layout`、`sequence`、`theme`、`scrollable`、`readonly`、`disabled`、`ariaLabel`、`reduceMotion` |
| Tabbar 标签栏 | done | `poemui-miniprogram/tabbar/tabbar` | `items`、`value`、`defaultValue`、`theme`、`shape`、`bordered`、`split`、`fixed`、`placeholder`、`safeAreaInsetBottom`、`zIndex`、`disabled`、`ariaLabel`、`reduceMotion` |
| Tabs | done | `poemui-miniprogram/tabs/tabs` | `items`、`value`、`defaultValue`、`variant`、`showBottomLine`、`spaceEvenly`、`split`、`sticky`、`stickyOffset`、`swipeable`、`ariaLabel`、`reduceMotion` |

## 表单组件

| 组件/能力 | 状态 | 路径 | 当前交付边界 |
| --- | --- | --- | --- |
| Form 表单 | done | `poemui-miniprogram/form/form` | `data`、`rules`、`showErrorMessage`、`scrollToFirstError`、`resetType`、`ariaLabel`、`reduceMotion` |
| Field | done | `poemui-miniprogram/field/field` | `name`、`label`、`help`、`message`、`status`、`required`、`requiredMarkPosition`、`labelAlign`、`contentAlign`、`labelWidth`、`arrow`、`reduceMotion` |
| Label | done | `poemui-miniprogram/label/label` | `content`、`required`、`disabled`、`colon` |
| Input | done | `poemui-miniprogram/input/input` | `value`、`defaultValue`、`name`、`label`、`placeholder`、`type`、`maxlength`、`maxcharacter`、`size`、`align`、`bordered`、`clearable`、`prefix`、`prefixIcon`、`suffix`、`suffixIcon`、`disabled`、`readonly`、`loading`、`focus`、`confirmType`、`status`、`tips`、`required`、`cursorSpacing`、`adjustPosition`、`holdKeyboard`、`confirmHold`、`ariaLabel`、`reduceMotion` |
| Input OTP | done | `poemui-miniprogram/input-otp/input-otp` | `value`、`length`、`type`、`mask`、`focus`、`disabled`、`error`、`errorMessage` |
| Textarea | done | `poemui-miniprogram/textarea/textarea` | `value`、`defaultValue`、`name`、`label`、`placeholder`、`maxlength`、`maxcharacter`、`autosize`、`indicator`、`bordered`、`size`、`clearable`、`disabled`、`readonly`、`loading`、`focus`、`status`、`tips`、`required`、`confirmType`、`showConfirmBar`、`cursorSpacing`、`selectionStart`、`selectionEnd`、`adjustPosition`、`holdKeyboard`、`confirmHold`、`disableDefaultPadding`、`ariaLabel`、`reduceMotion` |
| Search 搜索 | done | `poemui-miniprogram/search/search` | `value`、`defaultValue`、`placeholder`、`clearable`、`clearTrigger`、`showCancel`、`cancelText`、`shape`、`center`、`maxlength`、`maxcharacter`、`disabled`、`readonly`、`focus`、`confirmType`、`ariaLabel`、`reduceMotion` |
| Checkbox | done | `poemui-miniprogram/checkbox/checkbox` | `checked`、`defaultChecked`、`value`、`label`、`content`、`icon`、`indeterminate`、`checkAll`、`block`、`borderless`、`contentDisabled`、`disabled`、`readonly`、`name`、`placement`、`maxLabelRow`、`maxContentRow`、`ariaLabel`、`reduceMotion` |
| Radio Group | done | `poemui-miniprogram/radio/radio` | `checked`、`defaultChecked`、`value`、`label`、`content`、`icon`、`allowUncheck`、`block`、`borderless`、`contentDisabled`、`disabled`、`readonly`、`name`、`placement`、`maxLabelRow`、`maxContentRow`、`ariaLabel`、`reduceMotion` |
| Switch | done | `poemui-miniprogram/switch/switch` | `value`、`defaultValue`、`customValue`、`label`、`icon`、`size`、`disabled`、`readonly`、`loading`、`ariaLabel`、`reduceMotion` |
| Select | done | `poemui-miniprogram/select/select` | `options`、`value`、`defaultValue`、`placeholder`、`disabled`、`readonly`、`emptyText`、`ariaLabel`、`duration`、`easing`、`reduceMotion` |
| Picker 选择器 | done | `poemui-miniprogram/picker/picker` | `columns`、`value`、`defaultValue`、`visible`、`defaultVisible`、`title`、`type`、`cancelText`、`confirmText`、`showHeader`、`usePopup`、`closeOnOverlayClick`、`autoClose`、`keys`、`visibleItemCount`、`itemHeight`、`disabled`、`readonly`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`ariaLabel`、`reduceMotion` |
| Combobox | done | `poemui-miniprogram/combobox/combobox` | `options`、`value`、`defaultValue`、`visible`、`defaultVisible`、`multiple`、`maxSelected`、`placeholder`、`clearable`、`showIcon`、`showDescription`、`showGroup`、`showCheck`、`closeOnSelect`、`customTrigger`、`customEmpty`、`customFooter`、`placement`、`size`、`shape`、`bordered`、`block`、`disabled`、`readonly`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`listHeight`、`ariaLabel`、`duration`、`easing`、`reduceMotion` |
| Slider | done | `poemui-miniprogram/slider/slider` | `value`、`defaultValue`、`min`、`max`、`step`、`color`、`trackColor`、`name`、`blockSize`、`disabled`、`readonly`、`showValue`、`showMinMax`、`valueSuffix`、`ariaLabel`、`reduceMotion` |
| Stepper 步进器 | done | `poemui-miniprogram/stepper/stepper` | `value`、`defaultValue`、`min`、`max`、`step`、`integer`、`inputWidth`、`size`、`theme`、`disabled`、`readonly`、`disableInput`、`ariaLabel`、`reduceMotion` |
| Rate 评分 | done | `poemui-miniprogram/rate/rate` | `value`、`defaultValue`、`count`、`size`、`gap`、`color`、`allowHalf`、`showText`、`texts`、`disabled`、`readonly`、`ariaLabel`、`reduceMotion` |
| Calendar | done | `poemui-miniprogram/calendar/calendar` | `value`、`defaultValue`、`title`、`type`、`visible`、`defaultVisible`、`minDate`、`maxDate`、`disabledDates`、`disableWeekends`、`firstDayOfWeek`、`switchMode`、`showOutsideDays`、`allowSameDay`、`maxRange`、`maxMultiple`、`localeText`、`autoClose`、`usePopup`、`closeOnOverlayClick`、`disabled`、`readonly`、`loading`、`error`、`ariaLabel`、`reduceMotion` |
| Date Picker | done | `poemui-miniprogram/date-time-picker/date-time-picker` | `value`、`defaultValue`、`visible`、`defaultVisible`、`mode`、`start`、`end`、`format`、`steps`、`showWeek`、`title`、`type`、`cancelText`、`confirmText`、`showHeader`、`usePopup`、`autoClose`、`closeOnOverlayClick`、`disabled`、`readonly`、`ariaLabel`、`reduceMotion` |
| Attachment | done | `poemui-miniprogram/upload/upload` | `files`、`defaultFiles`、`max`、`picker`、`mediaType`、`messageType`、`source`、`extensions`、`maxSize`、`addContent`、`addBtn`、`theme`、`columns`、`allowDuplicate`、`preview`、`removeBtn`、`customAdd`、`disabled`、`ariaLabel`、`reduceMotion` |

## 数据展示

| 组件/能力 | 状态 | 路径 | 当前交付边界 |
| --- | --- | --- | --- |
| Accordion | done | `poemui-miniprogram/collapse/collapse` | `items`、`value`、`defaultValue`、`theme`、`disabled`、`expandIcon`、`expandMutex`、`defaultExpandAll`、`customPanel`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`ariaLabel`、`reduceMotion` |
| Avatar | done | `poemui-miniprogram/avatar/avatar` | `src`、`text`、`alt`、`icon`、`shape`、`size`、`bordered`、`hideOnLoadFailed`、`useSlot`、`ariaLabel`、`reduceMotion` |
| Badge | done | `poemui-miniprogram/badge/badge` | `count`、`content`、`dot`、`maxCount`、`showZero`、`theme`、`variant`、`shape`、`size`、`color`、`offset`、`ariaLabel` |
| Bubble | done | `poemui-miniprogram/bubble/bubble` | `content`、`text`、`variant`、`align`、`groupPosition`、`reactions`、`reactionSide`、`reactionAlign`、`customContent`、`customReactions`、`collapsible`、`expanded`、`defaultExpanded`、`maxLines`、`expandText`、`collapseText`、`selectable`、`visible`、`clickable`、`disabled`、`ariaLabel`、`ariaLive`、`duration`、`easing`、`reduceMotion` |
| Card | done | `poemui-miniprogram/card/card` | `title`、`description`、`showHeader`、`bordered`、`padding`、`showFooter`、`headerBordered`、`footerBordered`、`shadow`、`clickable`、`disabled`、`ariaLabel`、`duration`、`easing`、`reduceMotion` |
| Cell 单元格 | done | `poemui-miniprogram/cell/cell` | `title`、`description`、`value`、`note`、`image`、`leftIcon`、`rightIcon`、`size`、`align`、`variant`、`bordered`、`hover`、`required`、`arrow`、`clickable`、`selected`、`defaultSelected`、`selectable`、`allowUnselect`、`disabled`、`readonly`、`loading`、`url`、`jumpType`、`ariaLabel`、`duration`、`easing`、`reduceMotion` |
| Collapsible | done | `poemui-miniprogram/collapsible/collapsible` | `open`、`defaultOpen`、`label`、`content`、`customTrigger`、`customContent`、`icon`、`expandIcon`、`iconPosition`、`theme`、`bordered`、`block`、`disabled`、`readonly`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`ariaLabel`、`duration`、`easing`、`reduceMotion` |
| CountDown 倒计时 | done | `poemui-miniprogram/count-down/count-down` | `time`、`autoStart`、`paused`、`content`、`format`、`millisecond`、`size`、`theme`、`splitWithUnit`、`ariaLabel`、`reduceMotion` |
| Image 图片 | done | `poemui-miniprogram/image/image` | `src`、`mode`、`width`、`height`、`shape`、`lazy`、`webp`、`loading`、`error`、`text`、`showMenuByLongpress`、`showSlot`、`ariaLabel`、`reduceMotion` |
| List 列表 | done | `poemui-miniprogram/list/list` | `items`、`title`、`description`、`showHeader`、`customHeader`、`useSlot`、`showIcon`、`showDescription`、`showValue`、`showBadge`、`showArrow`、`clickable`、`bordered`、`divided`、`compact`、`showFooter`、`customFooter`、`customEmpty`、`disabled`、`loading`、`loadText`、`loadingText`、`finished`、`finishedText`、`error`、`errorText`、`emptyText`、`ariaLabel`、`duration`、`easing`、`reduceMotion` |
| SwipeCell 滑动单元格 | done | `poemui-miniprogram/swipe-cell/swipe-cell` | `disabled`、`left`、`opened`、`right`、`ariaLabel`、`reduceMotion` |
| Swiper | done | `poemui-miniprogram/swiper/swiper` | `items`、`value`、`defaultValue`、`height`、`circular`、`autoplay`、`interval`、`duration`、`easingFunction`、`direction`、`previousMargin`、`nextMargin`、`displayMultipleItems`、`disableTouch`、`navigation`、`imageMode`、`customItem`、`disabled`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`ariaLabel`、`reduceMotion` |
| Table | done | `poemui-miniprogram/table/table` | `columns`、`data`、`rowKey`、`bordered`、`stripe`、`height`、`showHeader`、`emptyValue`、`selectable`、`selectedRowKeys`、`defaultSelectedRowKeys`、`multiple`、`selectOnRowClick`、`sortable`、`sort`、`defaultSort`、`customEmpty`、`disabled`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`ariaLabel`、`reduceMotion` |
| Tag 标签 | done | `poemui-miniprogram/tag/tag` | `theme`、`variant`、`size`、`shape`、`content`、`icon`、`closable`、`disabled`、`maxWidth` |

## 反馈

| 组件/能力 | 状态 | 路径 | 当前交付边界 |
| --- | --- | --- | --- |
| Alert | done | `poemui-miniprogram/alert/alert` | `theme`、`variant`、`title`、`description`、`closable`、`visible`、`defaultVisible`、`icon`、`showIcon`、`closeIcon`、`verticalAlign`、`center`、`duration`、`easing`、`reduceMotion` |
| Dialog | done | `poemui-miniprogram/dialog/dialog` | `visible`、`actions`、`buttonLayout`、`cancelBtn`、`closeBtn`、`closeOnOverlayClick`、`confirmBtn`、`content`、`overlayProps`、`preventScrollThrough`、`showOverlay`、`title`、`usingCustomNavbar`、`zIndex`、`ariaLabel`、`reduceMotion` |
| Empty | done | `poemui-miniprogram/empty/empty` | `description`、`icon`、`image`、`ariaLabel`、`reduceMotion` |
| Loading 加载 | done | `poemui-miniprogram/loading/loading` | `delay`、`duration`、`fullscreen`、`indicator`、`inheritColor`、`layout`、`loading`、`pause`、`progress`、`reverse`、`size`、`text`、`theme`、`ariaLabel`、`reduceMotion` |
| Notice Bar | done | `poemui-miniprogram/notice-bar/notice-bar` | `content`、`direction`、`interval`、`marquee`、`operation`、`prefixIcon`、`suffixIcon`、`theme`、`visible`、`defaultVisible`、`ariaLabel`、`reduceMotion` |
| Progress | done | `poemui-miniprogram/progress/progress` | `percentage`、`theme`、`label`、`size`、`status`、`strokeWidth`、`color`、`trackColor`、`ariaLabel`、`reduceMotion` |
| Result 结果页 | done | `poemui-miniprogram/result/result` | `description`、`icon`、`image`、`theme`、`title`、`ariaLabel`、`reduceMotion` |
| Skeleton | done | `poemui-miniprogram/skeleton/skeleton` | `animation`、`delay`、`loading`、`rowCol`、`theme`、`ariaLabel`、`reduceMotion` |
| Toast | done | `poemui-miniprogram/toast/toast` | `direction`、`duration`、`icon`、`message`、`overlayProps`、`placement`、`preventScrollThrough`、`showOverlay`、`theme`、`usingCustomNavbar`、`ariaLabel`、`reduceMotion` |

## 浮层

| 组件/能力 | 状态 | 路径 | 当前交付边界 |
| --- | --- | --- | --- |
| ActionSheet 动作面板 | done | `poemui-miniprogram/action-sheet/action-sheet` | `align`、`blurOverlay`、`cancelText`、`count`、`description`、`items`、`showCancel`、`showOverlay`、`theme`、`usingCustomNavbar`、`visible`、`defaultVisible`、`ariaLabel`、`reduceMotion` |
| Dropdown Menu | done | `poemui-miniprogram/dropdown-menu/dropdown-menu` | `items`、`value`、`defaultValue`、`closeOnClickOverlay`、`showOverlay`、`zIndex`、`ariaLabel`、`reduceMotion` |
| Overlay 遮罩 | done | `poemui-miniprogram/overlay/overlay` | `visible`、`backgroundColor`、`blur`、`duration`、`preventScrollThrough`、`usingCustomNavbar`、`zIndex`、`ariaLabel`、`reduceMotion` |
| Popover | done | `poemui-miniprogram/popover/popover` | `visible`、`defaultVisible`、`content`、`placement`、`showArrow`、`theme`、`closeOnClickOutside`、`fixed`、`ariaLabel`、`reduceMotion` |
| Popup 弹出层 | done | `poemui-miniprogram/popup/popup` | `closeBtn`、`showHeader`、`title`、`subtitle`、`showFooter`、`contentScrollable`、`closeOnOverlayClick`、`content`、`card`、`duration`、`overlayProps`、`placement`、`preventScrollThrough`、`showOverlay`、`blurOverlay`、`usingCustomNavbar`、`visible`、`defaultVisible`、`zIndex`、`ariaLabel`、`reduceMotion` |
| Sheet | done | `poemui-miniprogram/sheet/sheet` | `visible`、`defaultVisible`、`title`、`description`、`content`、`showHeader`、`showClose`、`showHandle`、`draggable`、`dragThreshold`、`velocityThreshold`、`closeOnOverlayClick`、`showOverlay`、`customHeader`、`showFooter`、`customFooter`、`disabled`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`empty`、`emptyText`、`minHeight`、`height`、`maxHeight`、`zIndex`、`safeArea`、`ariaLabel`、`duration`、`easing`、`reduceMotion` |

## 高级

| 组件/能力 | 状态 | 路径 | 当前交付边界 |
| --- | --- | --- | --- |
| Chart | experimental | `文档能力` | 文档能力 |
| DynamicMessage 灵动通知 | done | `poemui-miniprogram/dynamic-message/dynamic-message` | `theme`、`title`、`message`、`icon`、`actionText`、`closable`、`duration`、`safeArea`、`ariaLabel`、`reduceMotion` |
| PullRefresh 下拉刷新 | done | `poemui-miniprogram/pull-refresh/pull-refresh` | `disabled`、`enableBackToTop`、`enablePassive`、`loadingBarHeight`、`loadingProps`、`loadingTexts`、`lowerThreshold`、`maxBarHeight`、`refreshTimeout`、`scrollIntoView`、`showScrollbar`、`successDuration`、`upperThreshold`、`usingCustomNavbar`、`value`、`defaultValue`、`ariaLabel`、`reduceMotion` |
| TopLoading 顶部加载 | done | `poemui-miniprogram/top-loading/top-loading` | `state`、`progress`、`delay`、`minimumVisible`、`successDuration`、`duration`、`ariaLabel`、`reduceMotion` |
| VirtualList 虚拟列表 | done | `poemui-miniprogram/virtual-list/virtual-list` | `items`、`value`、`defaultValue`、`multiple`、`selectable`、`allowUnselect`、`itemKey`、`height`、`itemHeight`、`overscan`、`scrollTop`、`scrollWithAnimation`、`upperThreshold`、`lowerThreshold`、`showScrollbar`、`bordered`、`showIndex`、`showDescription`、`showValue`、`showItemIcon`、`showItemBadge`、`activeIcon`、`customHeader`、`customFooter`、`customEmpty`、`customItem`、`clickable`、`readonly`、`disabled`、`loading`、`loadingText`、`error`、`errorText`、`retryText`、`emptyText`、`ariaLabel`、`duration`、`easing`、`reduceMotion` |
| Watermark 水印 | done | `poemui-miniprogram/watermark/watermark` | `alpha`、`content`、`height`、`isRepeat`、`layout`、`lineSpace`、`movable`、`moveInterval`、`offset`、`rotate`、`watermarkContent`、`width`、`x`、`y`、`zIndex`、`ariaLabel`、`reduceMotion` |

## 发布边界

正式发布只承诺 `done` 与 `beta` 组件。官网中的 `experimental` 页面用于追踪迁移进度；它们不应被用于生产业务。

## H5 预览边界

H5 站点用于 API 调参与视觉评审。`done` 与 `beta` 页面应映射到对应的小程序组件属性和事件；`experimental` 页面只用于目录与迁移说明，不能替代微信开发者工具真机验收。
