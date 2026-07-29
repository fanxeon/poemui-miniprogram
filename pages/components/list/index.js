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
Page(createComponentPage({ title: 'List', data: { listItems: ITEMS.slice(0, 5), listLoading: false, listFinished: false, listError: false, listStatus: '选择一项资料继续查看。' }, methods: { onListClick: function (event) { var item = event && event.detail && event.detail.item; this.setData({ listStatus: '正在查看“' + ((item && item.title) || '资料') + '”。' }); }, onToggleListError: function () { clearTimeout(this._listTimer); this.setData({ listLoading: false, listError: true, listStatus: '资料列表加载失败，可重新加载。' }); }, onListLoad: function () { this.loadNextListBatch('load'); }, onListRetry: function () { this.loadNextListBatch('retry'); }, loadNextListBatch: function (source) { if (this.data.listLoading || this.data.listFinished) return; var self = this; clearTimeout(this._listTimer); this.setData({ listError: false, listLoading: true, listStatus: source === 'retry' ? '正在重新加载资料。' : '正在加载更多资料。' }); this._listTimer = setTimeout(function () { var nextCount = Math.min(ITEMS.length, self.data.listItems.length + 4); self.setData({ listItems: ITEMS.slice(0, nextCount), listLoading: false, listFinished: nextCount >= ITEMS.length, listStatus: nextCount >= ITEMS.length ? '全部资料已加载。' : '已加载更多资料。' }); }, 500); } }}));
