/*eslint-disable*/
const zh_CN = {
  refresh: '刷新',
  filter: '筛选条件',
  create: '创建',
  save: '保存',
  cancel: '取消',
  delete: '删除',
  edit: '编辑',
  relation: '关联',
  copy: '复制',
  add: '添加',
  required: '该字段是必输的',
  createSuccess: '创建成功',
  editSuccess: '编辑成功',
  deleteSuccess: '删除成功',
  createFailed: '创建失败',
  editFailed: '编辑失败',
  deleteFailed: '删除失败',

  // 问题类型
  'issueType.title': '问题类型',
  'issueType.create': '添加问题类型',
  'issueType.name': '名称',
  'issueType.des': '描述',
  'issueType.scheme': '相关方案',
  'issueType.delete': '删除问题类型：',
  'issueType.action.delete': '删除问题类型',
  'issueType.delete.confirm': '请确认需要删除的问题类型。',
  'issueType.delete.noUse': '没有正在使用此类型的问题。',
  'issueType.delete.noUseTip': '注意：这个问题类型同时也会在所有字段配置、问题类型页面和状态机方案中被删除。',
  'issueType.delete.forbidden': '无法删除这个问题类型。',
  'issueType.delete.inUse': '当前有 {num} 个问题正在使用此类型。（你只能看到权限范围内的问题数量）',
  'issueType.delete.inUseTip': '注意：如果需要删除这个问题类型，需要将其与所有项目中的状态机，字段配置和字段页面方案解除关联。',
  'issueType.createDes': '在此输入问题类型的名称和描述，并为问题类型选择或上传一个图标，即可创建问题类型。',
  'issueType.label.name': '名称',
  'issueType.label.des': '描述',
  'issueType.label.icon': '图标',
  'issueType.label.color': '颜色',
  'issueType.name.check.exist': '问题类型名称已存在。',
  'error.issueType.update': '更新失败，请刷新后重试。',

  // 问题类型方案
  'issueTypeScheme.title': '问题类型方案',
  'issueTypeScheme.create': '添加方案',
  'issueTypeScheme.edit': '编辑方案',
  'issueTypeScheme.copy': '复制方案',
  'issueTypeScheme.name': '名称',
  'issueTypeScheme.des': '描述',
  'issueTypeScheme.type': '类型',
  'issueTypeScheme.project': '项目',
  'issueTypeScheme.delete': '删除问题类型：',
  'issueTypeScheme.delete.inUse': ' 项目正在使用这个方案。',
  'issueTypeScheme.delete.tip': '删除此方案后，这一项目将恢复为使用默认的全局问题类型方案。',
  'issueTypeScheme.delete.noUse': '没有项目使用这个方案。',
  'issueTypeScheme.action.delete': '删除问题类型方案',
  'issueTypeScheme.createDes': '在此输入问题类型方案的名称和描述，并选择需要的问题类型，即可创建问题类型方案。',
  'issueTypeScheme.label.name': '名称',
  'issueTypeScheme.label.des': '描述',
  'issueTypeScheme.label.default': '默认的问题类型',
  'issueTypeScheme.label.tips': '通过上下 #拖拽# 改变显示顺序。 同样你也可以从一个列表 #拖拽# 到另一个列表，来添加或移除类别。',
  'issueType.required': '问题类型必选！',
  'issueTypeScheme.name.check.exist': '问题类型方案名称已存在。',
  'issueTypeScheme.target': '问题类型用于当前方案',
  'issueTypeScheme.origin': '可用的问题类型',
  'issueTypeScheme.tip': '问题类型方案是将一些问题类型组合在一起，并关联给一个项目来使用，还可以指定问题类型在用户界面中显示的顺序。',

  // 关联问题类型方案  
  'relateIssueTypeScheme.title': '关联问题类型方案',
  'relateIssueTypeScheme.tip': '选择你需要的项目关联此问题类型方案。已有问题类型方案的项目将从当前使用方案更改为所选方案，部分问题因为设置需要进行合并匹配。',

  // 问题类型合并
  'relateMerge.title': '问题类型合并',
  'relateMerge.project': '项目',
  'relateMerge.currentType': '当前问题类型',
  'relateMerge.targetType': '目标问题类型',
  'relateMerge.effectCount': '影响的问题数',
  'relateMerge.currentTypeStatus': '当前问题类型状态',
  'relateMerge.targetTypeStatus': '目标问题类型状态',
  'relateMergeMatchFst.subTitle': '步骤1-确认当前问题类型',
  'relateMergeMatchFst.des': '项目中存在新方案中没有的问题类型，你需要将这些已有数据的问题移至另一个问题类型。',
  'relateMergeMatchSed.subTitle': '步骤2-选择目标问题类型',
  'relateMergeMatchSed.des': '请选择一个此项目中的其他问题类型进行合并，默认为你保留原有问题类型中的字段值，如果你去掉勾选项，原有问题类型的值将会被覆盖。',
  'relateMergeMatchTrd.subTitle': '步骤3-确认问题类型合并',
  'relateMergeMatchTrd.des': '你需要合并的当前问题类型是 {currentType} ，合并后的问题类型是 {targetType} ，请再次确认合并的内容。',
  'relateMergeUnMatch.subTitle': '步骤3-合并问题类型的状态',
  'relateMergeUnMatch.des': '你需要合并的问题类型中部分状态无法适用于目标问题类型，所以你必须选择一个目标问题类型中可用的状态进行过度。',

  //状态机方案
  'stateMachineScheme.title': '状态机方案',
  'stateMachineScheme.create': '添加状态机方案',
  'stateMachineScheme.name': '名称',
  'stateMachineScheme.des': '描述',
  'stateMachineScheme.project': '项目',
  'stateMachineScheme.issueType': '类型',
  'stateMachineScheme.stateMachine': '状态机',
  'stateMachineScheme.operation': '操作',
  'stateMachineScheme.createName': '请输入状态机方案名称',
  'stateMachineScheme.createDes': '请输入此状态机方案的详细描述',
  'stateMachineScheme.edit': '编辑状态机方案',
  'stateMachineScheme.manage': '项目管理流程方案',
  'stateMachineScheme.manageDes': '为项目ITSM生成了此Cloopm服务台IT支持状态流程方案',
  'stateMachineScheme.add': '添加状态机',
  'stateMachineScheme.next': '下一步',
  'stateMachineScheme.connect': '关联问题类型到状态机',
  'stateMachineScheme.connectIssueType': '问题类型',
  'stateMachineScheme.connectedStateMachine': '当前已关联的状态机',
  'stateMachineScheme.pre': '上一步',
  'stateMachineScheme.finish': '完成',
  'stateMachineScheme.cancel': '取消',
  'stateMachineScheme.delete': '删除状态机方案',
  'stateMachineScheme.deleteDesBefore': '确实要删除 ',
  'stateMachineScheme.deleteDesAfter': '注意：将会从所有项目中删除这个状态机方案。',
  'stateMachineScheme.conflictInfo': '此问题类型已经关联其他状态机。你如果需要更新此关联，之前的结果将会被覆盖。',
  // 自定义字段
  'customFields.title': '自定义字段',
  'customFields.create': '添加自定义字段',
  'customFields.edit': '编辑自定义字段',
  'customFields.name': '名称',
  'customFields.des': '描述',
  'customFields.type': '字段类型',
  'customFields.default': '默认值',
  'customFields.associate': '关联页面',
  'customFields.tips': '你可以添加更多的自定义字段，并添加到需要展示的页面中，以满足你的业务需求。',
  'customFields.delete': '删除字段: ',
  'customFields.action.delete': '删除字段',
  'customFields.delete.inUse': '当前有 {num} 个页面正在使用此字段。',
  'customFields.delete.inUseTip': '注意：将会从所有页面和项目中删除这个字段。',
  'customFields.radio': '单选框',
  'customFields.checkbox': '复选框',
  'customFields.time': '时间选择器',
  'customFields.datetime': '日期时间选择器',
  'customFields.number': '数字输入框',
  'customFields.input': '文本框（单行）',
  'customFields.text': '文本框（多行）',
  'customFields.single': '选择器（单选）',
  'customFields.multiple': '选择器（多选）',
  'customFields.cascade': '选择器（级联选择）',
  'customFields.url': 'URL',
  'customFields.label': '标签',
  'customFields.list.tip': '你可以添加更多的自定义字段，并添加到需要展示的页面中，以满足你的业务需求。',
  'customFields.screen.name': '页面名称',
  'customFields.associate.tip': '如果要显示新添加的字段，就必须将字段与页面关联。新字段将添加到页面末尾。',
  'customFields.dragList.tips': '请为该字段添加值，你可以通过上下 #拖拽# 改变显示顺序。',
  'customFields.associate.success': '关联成功',
  'customFields.associate.failed': '关联失败',
  'customFields.name.check.exist': '字段名称已存在',
  'customFields.undefined': '加载中...',
  'customFields.value.null': '请先设置字段值列表',
  'customFields.placeholder': '请选择',
  'customFields.useCurrentTime': '使用当前时间为默认值',
  'customFields.useCurrentDate': '使用当前日期和时间为默认值',
  'customFields.decimal': '小数输入',
  'customFields.urlError': 'URL格式不正确',
  'error.fieldOption.updateFieldOption.value.exist': '字段值重复',
  'dragList.invalid': '禁用',
  'dragList.active': '启用',
  'dragList.placeholder': '请输入名称',

  'fieldConfiguration.title': '字段配置',
  'fieldConfiguration.name': '名称',
  'fieldConfiguration.des': '描述',
  'fieldConfiguration.scheme': '字段配置方案',
  'fieldConfiguration.create': '添加字段配置',
  'fieldConfiguration.tip1':
    '字段配置为你提供了修改字段操作的功能，可以用于处理页面上的特殊字段。例如：可以设置某些字段在页面下是显示还是隐藏，或者字段是不是必须输入值。',
  'fieldConfiguration.tip2':
    '注意：字段配置必须在字段配置方案中关联问题类型才能使用，并且该字段配置方案需要被项目使用。',
  'fieldConfiguration.action.delete': '删除字段配置',
  'fieldConfiguration.eidt.name': '字段名称',
  'fieldConfiguration.edit.des': '描述',
  'fieldConfiguration.edit.page': '页面',
  'fieldConfiguration.edit.display': '显示',
  'fieldConfiguration.edit.required': '必输项',
  'fieldConfiguration.edit.title': '编辑字段配置',
  'fieldConfiguration.edit.tip1': '注意：列表中 #显示# 列为此字段在页面中是否显示，你可以把需要展示的字段勾选上； #必输项# 列为此字段在页面中是否是必输项，你可以把需要值的字段勾选上。',
  'fieldConfiguration.delete.inUseTip': '注意：将会从所有字段配置方案中删除这个配置。',

  // 优先级
  'priority.title': '优先级',
  'priority.create': '添加优先级',
  'priority.edit': '编辑优先级',
  'priority.name': '名称',
  'priority.des': '描述',
  'priority.color': '颜色',
  'priority.list.tip': '以下列表显示了你当前使用的优先级，按照从高到低的顺序排列，你也可以通过上下拖拽改变显示顺序。',
  'priority.create.name.placeholder': '请输入优先级名称',
  'priority.create.des.placeholder': '请输入此优先级的详细描述',
  'priority.create.color.error': '颜色已经存在',
  'priority.create.name.error': '名称已经存在',
  'priority.delete.title': '删除优先级',
  'priority.delete.unused.notice': '注意：将会从所有使用的事件单中删除这个优先级。',
  'priority.delete.used,notice':
    '注意：将会从所有使用的事件单中删除这个优先级。请你为受影响的事件单选择一个新的优先级。',
  'priority.delete.chooseNewPriority.placeholder': '请选择一个新的优先级',

  // 页面
  'page.title': '页面',
  'page.create': '添加页面',
  'page.name': '名称',
  'page.des': '描述',
  'page.scheme': '页面方案',
  'page.stateMachine': '状态机',
  'page.tip1': '页面是对字段的排列布局，也是状态机中创建、编辑或转换问题时显示的页面。',
  'page.tip2': '注意：',
  'page.tip3': '页面类型为 #创建# 或 #编辑# 的页面，可在页面方案中打包与问题类型进行 #创建# 或 #编辑# 的页面，可在页面方案中打包与问题类型进行关联。',
  'page.tip4': '需要编辑 #状态机转换# 显示的页面，请点击所属的 #状态机# 并进行编辑。',
  'page.tip.transfer': '状态机转换',
  'page.tip.stateMachine': '状态机',
  'page.create.title': '添加页面',
  'page.create.tip1': '通过上下 拖拽 改变显示顺序。 你也可以从一个列表 拖拽 到另一个列表，来添加或移除选项。',
  'page.create.tip2': '拖拽',
  'page.create.tip3': '改变显示顺序。 你也可以从一个列表',
  'page.create.tip4': '到另一个列表，来添加或移除选项。',
  'page.create.targetTitle': '全部字段',
  'page.create.originTitle': '此方案可用字段',
  'page.edit.title': '编辑页面',
  'page.action.delete': '删除页面',
  'page.delete.inUseTip': '注意：将会从所有页面方案和项目中删除这个页面。',

  // 问题类型页面方案
  'issueTypeScreenSchemes.title': '问题类型页面方案',
  'issueTypeScreenSchemes.create': '添加问题类型页面方案',
  'issueTypeScreenSchemes.edit': '修改问题类型页面方案',
  'issueTypeScreenSchemes.name': '名称',
  'issueTypeScreenSchemes.project': '项目',
  'issueTypeScreenSchemes.operation': '操作',
  'issueTypeScreenSchemes.list.tip1': '你创建的问题类型页面方案中可以选择 #页面方案# 关联指定的 #问题类型# 。然后再把问题类型页面方案关联到一个或多个项目上，这样可以在指定项目中设置某个类型的某个操作使用哪个 #页面方案# 以及哪个 #页面# 。',
  'issueTypeScreenSchemes.list.tip2': '注意: 只能删除没有使用到项目上的问题类型页面方案。',
  'issueTypeScreenSchemes.edit.sidebarTitle': '修改问题类型页面方案',
  'issueTypeScreenSchemes.create.tip1': '如果你要启用这个页面方案，需要通过问题类型页面方案将其与一个或多个问题类型关联，然后将问题类型页面方案关联到一个或多个项目。',
  'issueTypeScreenSchemes.create.tip2': '注意：页面方案只能添加一个类型同为为 #创建# 或 #编辑# 的页面。',
  'issueTypeScreenSchemes.create.nameLabel': '名称',
  'issueTypeScreenSchemes.create.namePlaceholder': '请输入问题类型页面方案名称',
  'issueTypeScreenSchemes.create.nameWarning': '方案名称不能为空！',
  'issueTypeScreenSchemes.create.desLabel': '描述',
  'issueTypeScreenSchemes.create.desPlaceholder': '请输入此问题类型页面方案的详细描述',
  'issueTypeScreenSchemes.association.title': '问题类型与页面方案关联',
  'issueTypeScreenSchemes.association.addBtn': '添加',
  'issueTypeScreenSchemes.association.issueType': '问题类型',
  'issueTypeScreenSchemes.association.pageScheme': '页面方案',
  'issueTypeScreenSchemes.association.operation': '操作',
  'issueTypeScreenSchemes.association.create.issueTypePlaceholder': '请选择问题类型',
  'issueTypeScreenSchemes.association.create.pageSchemePlaceholder': '请选择页面方案',
  'issueTypeScreenSchemes.association.create.issueTypeWarning': '问题类型不能为空！',
  'issueTypeScreenSchemes.association.create.pageSchemeWarning': '页面方案不能为空！',
  'issueTypeScreenSchemes.association.create.sidebarTitle': '添加问题类型与页面方案关联',
  'issueTypeScreenSchemes.association.edit.sidebarTitle': '编辑问题类型与页面方案关联',
  'issueTypeScreenSchemes.name.check.exist': '问题类型页面方案名称已存在',
  'issueTypeScreenSchemes.delete': '删除问题类型页面方案：',
  'issueTypeScreenSchemes.action.delete': '删除问题类型页面方案',
  'issueTypeScreenSchemes.delete.inUse': '当前有 {num} 个项目正在使用此问题类型页面方案。',
  'issueTypeScreenSchemes.delete.tip': '注意：将会从所有项目中删除这个问题类型页面方案。',

  'pageScheme.name': '名称',
  'pageScheme.des': '描述',
  'pageScheme.scheme': '问题类型页面方案',
  'pageScheme.title': '页面方案',
  'pageScheme.create': '添加页面方案',
  'pageScheme.tip1': '你可以为每个问题类型选择相应的页面打包成页面方案。页面方案被问题类型页面方案对关联问题类型上，再由问题类型关联到一个或多个项目上。',
  'pageScheme.tip2': '注意: 只能删除没有使用到问题类型页面方案上的页面方案。',
  'pageScheme.create.title': '添加页面方案',
  'pageScheme.create.tip1': '如果你要启用这个页面方案，需要通过问题类型页面方案将其与一个或多个问题类型关联，然后将问题类型页面方案关联到一个或多个项目。',
  'pageScheme.create.tip2': '注意：页面方案只能添加一个类型同为 #创建# 或 #编辑# 的页面。',
  'pageScheme.page': '默认页面',
  'pageScheme.create.related.name': '名称',
  'pageScheme.create.related.type': '页面类型',
  'pageScheme.create.related.title': '页面与页面类型关联',
  'pageScheme.create.related.add': '添加页面与页面类型关联',
  'pageScheme.create.related.edit': '编辑页面与页面类型关联',
  'pageScheme.create.related.page': '页面',
  'pageScheme.create.default': '默认',
  'pageScheme.create.create': '新建',
  'pageScheme.create.edit': '编辑',
  'error.pageScheme.name.exist': '名称已存在！',
  'pageScheme.edit.title': '编辑页面方案',
  'pageScheme.related.deleteTip': '确认删除？',
  'pageScheme.action.delete': '删除页面方案',
  'pageScheme.delete.inUseTip': '注意：将会从所有问题类型页面方案和项目中删除这个页面。',

  'fieldConfigScheme.title': '字段配置方案',
  'fieldConfigScheme.name': '名称',
  'fieldConfigScheme.des': '描述',
  'fieldConfigScheme.project': '项目',
  'fieldConfigScheme.create': '添加字段配置方案',
  'fieldConfigScheme.tip1': '字段配置方案是把字段配置和问题类型进行关联。字段配置方案可以关联多个项目，项目的问题类型会对应字段配置里面的字段设置。',
  'fieldConfigScheme.create.tip1': '字段配置方案是把字段配置和问题类型进行关联。字段配置方案可以关联多个项目，项目的问题类型会对应字段配置里面的字段设置。',
  'fieldConfigScheme.edit.title': '编辑字段配置方案',
  'fieldConfigScheme.create.related.title': '问题类型与字段配置关联',
  'fieldConfigScheme.create.related.issueType': '问题类型',
  'fieldConfigScheme.create.related.fieldConfig': '字段配置',
  'fieldConfigScheme.create.related.add': '添加问题类型与字段配置关联',
  'fieldConfigScheme.create.related.edit': '编辑问题类型与字段配置关联',
  'fieldConfigScheme.action.delete': '删除字段配置方案',
  'fieldConfigScheme.delete.inUseTip': '注意：将会从所有项目中删除这个字段配置方案。',
  'fieldConfigScheme.related.deleteTip': '确认删除？',

  //状态
  'state.name': '名称',
  'state.des': '描述',
  'state.stage': '阶段',
  'state.stateMachine': '状态机',
  'state.title': '状态',
  'state.create': '添加状态',
  'state.edit': '编辑状态',
  'state.delete': '删除状态',
  'state.delete.tip': '注意：删除后不可恢复，请先进行数据备份。',
  'state.name.required': '名称为必填项',
  'state.tips': '帮助识别问题所处的生命周期的某个阶段',
  'state.tips2': '开始处理问题时，从 #待处理# 到 #处理中# ，随后，当完成所有工作时，进入到 #完成# 阶段。',

  //状态机
  'stateMachine.name': '名称',
  'stateMachine.related': '关联方案',
  'stateMachine.title': '状态机',
  'stateMachine.create': '添加状态机',
  'stateMachine.edit': '编辑状态机',
  'stateMachine.tab.graph': '图形',
  'stateMachine.tab.text': '文本',
  'stateMachine.des': '描述',
  'stateMachine.state.delete': '删除状态',
  'stateMachine.transfer.delete': '删除转换',
  'stateMachine.state': '状态',
  'stateMachine.state.add': '添加状态',
  'stateMachine.transfer': '转换',
  'stateMachine.transfer.add': '添加转换',
  'stateMachine.transfer.display': '显示转换标签',
  'stateMachine.transfer.name': '转换名称',
  'stateMachine.transfer.des': '描述',
  'stateMachine.transfer.source': '起始状态',
  'stateMachine.transfer.target': '目标状态',
  'stateMachine.transfer.page': '页面',
  'stateMachine.list.tip': '如果要删除一个状态机，你必须把它从状态机方案中解除关联。',
  'stateMachine.transfer.edit': '编辑转换',
  'stateMachine.transfer.delete.tip': '请选择你需要删除的转换。',
  'stateMachine.delete': '删除状态机',
  'stateMachine.condition': '条件',
  'stateMachine.verification': '验证器',
  'stateMachine.processor': '后处理功能',
  'stateMachine.config': '配置',
  'stateMachine.condition.des': '条件可以控制哪些用户在什么情况下能够执行一个转换。如果条件不满足，则用户在查看问题的界面上将看不到转换按钮。',
  'stateMachine.condition.guide': '不知道从哪里开始？',
  'stateMachine.condition.link': '从这开始',
  'stateMachine.condition.add': '添加条件',
  'stateMachine.verification.des': '状态机验证器将在转换执行之前检查用户的输入是否有效。例如：校验可以保证在转换的页面上用户输入的值是否满足某些标准。如果校验不满足 ，转换的后处理功能将不被执行，并且这个问题将不会进行到转换的目标状态。',
  'stateMachine.validator.add': '添加验证器',
  'stateMachine.processor.des': '在一个转换被执行之后，系统会立即执行一些操作（因此称之为后处理功能），例如：更新一个问题的字段，生成一个问题的 修改记录。',
  'stateMachine.postposition.add': '添加后处理功能',
  'stateMachine.config.name': '名称',
  'stateMachine.config.des': '描述',
};
export default zh_CN;
