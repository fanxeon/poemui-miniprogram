var createComponentPage = require('../../../utils/component-page');
var ITEMS = [
  { title: '入职指南', description: '第一天需要完成的准备', value: 'start', icon: 'file-text' },
  { title: '团队通讯录', description: '查找同事和工作小组', value: 'contacts', icon: 'users' },
  { title: '本周排班', description: '查看本周的协作安排', value: 'schedule', icon: 'calendar' },
  { title: '设备申请', description: '提交办公设备需求', value: 'equipment', icon: 'package' },
  { title: '费用报销', description: '跟踪待处理的报销单', value: 'expense', icon: 'receipt' },
  { title: '学习计划', description: '继续本月的课程安排', value: 'learning', icon: 'file-text' },
  { title: '安全培训', description: '完成必修安全课程', value: 'security', icon: 'shield-check' },
  { title: '请假记录', description: '查看已经提交的休假', value: 'leave', icon: 'clock' },
  { title: '薪酬证明', description: '仅本人可查看', value: 'salary', icon: 'lock', disabled: true }
];
Page(createComponentPage({ title: 'List', data: { listItems: ITEMS, listError: false, listStatus: '选择一项资料继续查看。' }, methods: { onListClick: function (event) { var item = event && event.detail && event.detail.item; this.setData({ listStatus: '正在查看“' + ((item && item.title) || '资料') + '”。' }); }, onToggleListError: function () { this.setData({ listError: true, listStatus: '资料列表加载失败，可重新加载。' }); }, onListRetry: function () { this.setData({ listStatus: '正在重新加载，当前错误状态保持可见。' }); }, onRestoreList: function () { this.setData({ listError: false, listStatus: '资料列表已恢复。' }); } }}));
