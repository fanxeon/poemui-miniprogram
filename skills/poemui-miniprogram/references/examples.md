# 示例

## 最小页面

`page.json`：

```json
{
  "usingComponents": {
    "pui-config-provider": "poemui-miniprogram/config-provider/config-provider",
    "pui-button": "poemui-miniprogram/button/button",
    "pui-icon": "poemui-miniprogram/icon/icon"
  }
}
```

`page.wxml`：

```xml
<pui-config-provider use-global-config>
  <pui-button
    theme="primary"
    loading="{{submitting}}"
    disabled="{{submitting}}"
    bind:click="submit"
  >
    <pui-icon name="check" />
    保存
  </pui-button>
</pui-config-provider>
```

`page.js`：

```js
Page({
  data: { submitting: false },
  async submit() {
    if (this.data.submitting) return;
    this.setData({ submitting: true });
    try {
      await saveRecord();
      wx.showToast({ title: '已保存', icon: 'success' });
    } catch (error) {
      wx.showToast({ title: '保存失败，请重试', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
```

`saveRecord()` 必须是真实业务动作；示例中的函数名不是成功占位。接入时替换为项目已有 API，并保留失败恢复。

## 受控 Switch

```xml
<pui-switch checked="{{enabled}}" bind:change="onEnabledChange" />
```

```js
Page({
  data: { enabled: false },
  onEnabledChange(event) {
    const next = event.detail.value;
    this.setData({ enabled: next });
  },
});
```

确认真实事件字段后再使用，不从其他组件猜 `event.detail` 结构。
