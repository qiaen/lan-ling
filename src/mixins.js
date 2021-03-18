import * as Base from '@api/Base'
import Configs from '@configs/index'
import { mapGetters } from 'Vuex'

export default {
	data() {
		return {
			// 表单分页信息
			pageInfo: {
				// 当前查看的页码
				pageNo: 1,
				// 表总数量
				total: 0,
				// 每页数量，默认20
				pageSize: Configs.pageSize,
				// 分页组件支持的功能
				layout: Configs.pageLayout,
				// 可选择的分页数下拉选项
				sizes: Configs.pageSizes
			},
			// 接口系统枚举
			serviceEnums: {
				JOB_TYPE: [],
				HIVE_FILE_TYPE: [],
				DATASOURCE_TYPE: [],
				PULL_INCRE_TYPE: [],
				JOB_BU: [],
				DATASOURCE_DRIVER: []
			},
			// 通用加载状态
			xoading: {
				// 页面内主内容加载中，适用于主table
				main: false,
				JOB_TYPE: false,
				HIVE_FILE_TYPE: false,
				DATASOURCE_TYPE: false,
				PULL_INCRE_TYPE: false,
				JOB_BU: false,
				DATASOURCE_DRIVER: false,
				// 可用数据源
				availableDataSource: false,
				// 获取表
				sourceTables: false
			},
			// 可用数据源
			availableDataSource: [],
			// 数据源下的表，不同的用途用户标示位置作用，下面的key必须先声明后使用
			sourceTables: {
				access: [],
				export: []
			},
			// 主表被复选选中项目
			mainSelected: [],
			mainTable: []
		}
	},
	computed: {
		...mapGetters([
			// 服务器枚举信息
			'serviceEnum',
			// 是否打开任务登记
			'openCheckIn',
			// 用户信息
			'userInfo',
			// 数据源枚举，动态，从接口获取
			'dataSource',
			// 当前选中查看的任务信息
			'currtTaskRow'
		])
	},
	methods: {
		// 初始化请求主表内容
		init() {
			this.pageInfo.pageNo = 1
			this.get()
		},
		// 每页需要的数量变动
		sizeChange(val) {
			this.pageInfo.pageNo = 1
			this.pageInfo.pageSize = val
			this.init()
		},
		// 分页页码变动
		pageChange(val) {
			this.pageInfo.pageNo = val
			this.get()
		},
		// 根据type获取枚举
		getEnumsByType(type) {
			if (!type) {
				console.log(`mixins.js: 方法getEnumsByType没有缺少type参数`)
				return
			}
			if (this.serviceEnums[type].length > 2) { return }
			this.xoading[type] = true
			Base.getEnumsByType({ type }).then(res => {
				if (res.code === 0) {
					this.serviceEnums[type] = res.data
				} else {
					this.$message.error(res.message)
				}
				this.xoading[type] = false
			}).catch(err => {
				this.xoading[type] = false
			})
		},
		// 通过type获取可用数据源
		getAvailableDataSource(type) {
			this.xoading.availableDataSource = true
			Base.getAvailableDataSource({ type }).then(res => {
				if (res.code == 0) {
					this.$store.dispatch('SetDataSource', { type, value: res.data })
				} else {
					this.$message.error(res.message)
				}
				this.xoading.availableDataSource = false
			}).catch(err => {
				this.xoading.availableDataSource = false
			})
		},
		// 通过数据源ID, 表名获取表, type: 哪个地方获取
		getTablesBySourceId(type, id, tableName) {
			this.xoading.sourceTables = true
			Base.getTablesBySourceId({ id, tableName }).then(res => {
				if (res.code == 0) {
					this.sourceTables[type] = res.data
				} else {
					this.$message.error(res.message)
				}
				this.xoading.sourceTables = false
			}).catch(err => {
				this.xoading.sourceTables = false
			})
		},
		// 匹配枚举 返回label  this.matchEnum('PULL_INCRE_TYPE', 'day_all')
		matchEnum(type, key) {
			let enums = this.serviceEnum[type]
			let name = ''
			if (enums) {
				for (let item of enums) {
					if (item.value == key) {
						name = item.name
						break
					}
				}
			}
			return name
		},
		// 主表复选项变动
		mainSelectionChange(rows) {
			this.mainSelected = rows
		}
	}
}