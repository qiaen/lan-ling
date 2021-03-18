<template>
	<li class="checkin-export">
		<el-alert class="check-alert" title="输出源信息必须是在公司安全网络提供的存储服务下进行，注意数据安全。" :closable="false" show-icon>
		</el-alert>
		<sline title="输出源信息" size="big" class="pt5"></sline>
		<el-form ref="form" :model="data" :rules="rules" size="small" label-width="115px">
			<el-form-item label="数据源" required>
				<div class="flex el-input el-input--small el-input-group el-input-group--prepend">
					<div style="width: 40px" class="el-input-group__prepend center shrink0 fc333">
						<i class="iconfont icon-hive fsize13 pr5"></i>Hive</div>
					<div class="flex1">
						<el-select v-model="data.hiveDb" class="width100" placeholder="请选择数据源">
							<el-option v-for="(item, key) in odsDataSource" :label="item" :value="item" :key="key"></el-option>
						</el-select>
					</div>
				</div>
			</el-form-item>
			<el-form-item label="目标表" prop="hiveTable">
				<div class="flex el-input el-input--small el-input-group el-input-group--append">
					<div class="flex1">
						<el-input @change.native="getHiveTables" placeholder="请输入目标表" v-model="data.hiveTable"></el-input>
					</div>
					<div @click="tapAppendBtn" style="width: 24px" :class="'check-status-' + hiveTableStatus" class="check-status el-input-group__append center shrink0 pointer">
						<span v-if="!showAKeyTable">
							<i v-if="loading.hiveTable" class="el-icon-loading"></i>
							<i v-else-if="hiveTableStatus == 0" class="el-icon-success"></i>
							<i v-else-if="hiveTableStatus == 1" class="el-icon-error"></i>
							<i v-else class="el-icon-more"></i>
						</span>
						<p v-if="showAKeyTable" class="fsize10">一键建表</p>
						<i v-if="!showAKeyTable" class="el-icon-i" :class="{'el-icon-loading':loading.hiveTable,'el-icon-refresh':!loading.hiveTable}"></i>
					</div>
				</div>
			</el-form-item>
			<el-form-item label="分区信息" prop="hivePartition">
				<!-- 分区字段，如果不填默认为pt = ${day} -->
				<el-input v-model="data.hivePartition" placeholder="请填写分区信息" clearable></el-input>
			</el-form-item>
			<el-form-item label="清洗规则" prop="writeMode">
				<el-select class="width100" v-model="data.writeMode" placeholder="请选择清洗规则">
					<el-option :label="item.name" :value="item.value" v-for="item in serviceEnum.MYSQL_WRITE_MODE" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="调度频率" prop="taskMode">
				<div>
					<el-radio-group v-model="data.taskMode" @change="changeTaskMode">
						<el-tooltip effect="dark" content="一次性任务只生成离当前最近的一个数据周期作业(天/小时)" placement="top">
							<el-radio :label="0">一次性任务</el-radio>
						</el-tooltip>
						<el-radio :label="1">周期性任务</el-radio>
					</el-radio-group>
				</div>
				<el-form-item label="Cron表达式" v-if="data.taskMode == 1" prop="cron" style="margin-bottom: 0px">
					<div class="flex el-input el-input--small el-input-group el-input-group--append cron-select">
						<div class="flex1">
							<el-input v-model="data.cron" class="width100" placeholder="请输入Cron表达式"></el-input>
						</div>
						<el-dropdown @command="selectCron" size="small" type="primary">
							<el-button type="primary">
								选择 Cron<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="item in serviceEnum.COMMON_CRON" :command="item.value" :key="item.value">{{item.name}}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
					<p>
						<a class="fcblue" target="blank" href="http://cron.qqe2.com/">Cron表达式在线生成工具</a>
					</p>
				</el-form-item>
			</el-form-item>
			<el-form-item label-width="0">
				<div class="flex width100">
					<el-form-item label="同步并发数" prop="speedChannel">
						<span slot="label">同步并发数
							<el-tooltip effect="dark" placement="top" popper-class="checkin-tooltip">
								<div slot="content">
									<el-table class="zm-table dark-table" :data="channelTable">
										<el-table-column prop="title" label="并发数" width="75"></el-table-column>
										<el-table-column prop="value" label="数量级别" width="220"></el-table-column>
									</el-table>
								</div>
								<i class="el-icon-info"></i>
							</el-tooltip>
						</span>
						<el-input-number v-model="data.speedChannel" :min="1" :max="10000" placeholder="清选择" controls-position="right" style="width: 105px"></el-input-number>
					</el-form-item>
					<el-form-item label-width="150px" class="can-error" label="允许同步错误数" prop="errorRecord">
						<el-input-number v-model="data.errorRecord" :min="0" :max="10000" placeholder="清选择" controls-position="right" style="width: 105px"></el-input-number>
					</el-form-item>
					<el-form-item label-width="70px" class="can-error" label="压缩" prop="isCompress">
						<el-radio-group v-model="data.isCompress">
							<el-radio :label="0">不压缩</el-radio>
							<el-radio :label="1">压缩</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
			</el-form-item>
		</el-form>
		<checkin-map :data="data" :active="active" :loading="loading" :passed.sync="passed"></checkin-map>
		<div class="center flex pt15">
			<el-button type="primary" size="small" :disabled="loading.hiveTable || loading.hiveColumn" @click="jump(2)">上一步</el-button>
			<el-button type="primary" size="small" :loading="loading.hiveTable || loading.hiveColumn" @click="next(4)">下一步</el-button>
		</div>
		<sline title="注意事项" size="big" class="pt5"></sline>
		<div class="remark">
			<h4>输出源信息说明</h4>
			<p>输出源信息必须是在公司安全网络提供的存储服务下进行，不允许将数据直接推数到第三方存储服务中。注意数据安全《中华人民共和国网络安全法》</p>
			<h4>清洗规则</h4>
			<p>清洗规则分为Append 和 Overwrite两种。Append表示数据追加，不会清理以前的数据，Overwrite表示每次会清理以前的数据。</p>
		</div>
		<!-- 一键建表 -->
		<checkin-table :dialog="dialog" @back="backAKeyTable" :data="data"></checkin-table>
	</li>
</template>
<script>
import Enum from '@configs/enum'
import Mixins from '@/mixins'
import * as Task from '@api/Task'
// 源头表目标表映射
const checkinMap = () => import('./checkin-map')
// 一键建表
const checkinTable = () => import('./checkin-table')
export default {
	props: ['active', 'data', 'oldData'],
	inject: ['scrollTop'],
	name: 'checkin-export',
	mixins: [Mixins],
	components: { checkinMap, checkinTable },
	data() {
		let checkHiveTable = (rule, value, callback) => {
			this.checkHiveTable().then(res => {
				callback()
			}).catch(err => {
				callback(new Error(err))
			})
		}
		return {
			dialog: {
				createTable: false
			},
			// 数据源下拉
			odsDataSource: Enum.odsDataSource,
			// 0:成功，1:失败，3:待校验
			hiveTableStatus: '3',
			loading: {
				hiveTable: false,
				columnName: false,
				hiveColumn: false
			},
			rules: {
				hiveTable: { required: true, validator: checkHiveTable, trigger: 'blur' },
				writeMode: { required: true, message: '请选择清洗规则', trigger: 'change' },
				hivePartition: { required: false, message: '请填写分区信息', trigger: 'blur' },
				cron: { required: false, message: '请填写Cron表达式', trigger: 'blur' },
				taskMode: { required: true, message: '请选择调度频率', trigger: 'change' },
				speedChannel: { required: true, message: '请选择同步并发数', trigger: 'change' },
				errorRecord: { required: true, message: '请选择允许同步错误数', trigger: 'change' },
				isCompress: { required: true, message: '请选择是否压缩', trigger: 'change' }
			},
			// 比较连线是否匹配，如果连线不为0，并且连线，源表，目标表数量一致，则通过
			passed: false,
			// 是否提示用户hive无内容，只有在下一步提示
			showHiveTableWarning: false,
			// 是否需要一键建表
			showAKeyTable: false,
			// 并发数提示表格
			channelTable: [{
				title: '1',
				value: '1千万以下'
			}, {
				title: '2',
				value: '大于1千万，小于2千万'
			}, {
				title: '6',
				value: '大于2千万，小于3千万'
			}, {
				title: '8',
				value: '大于3千万，小于8千万'
			}, {
				title: '10',
				value: '8千万以上'
			}]
		}
	},
	methods: {

		// 从一键建表返回
		backAKeyTable(val) {
			this.dialog.createTable = false
			if (val) {
				this.$refs.form.validate(valid => {})
			}
		},
		// 点击目标表后的按钮
		tapAppendBtn() {
			if (this.showAKeyTable) {
				if (!this.data.hiveTable) {
					this.scrollTop()
					this.$message.warning('请先输入目标表名！')
				} else {
					this.dialog.createTable = true
				}
			} else {
				this.getHiveTables()
			}
		},
		// 从已知的cron中选择
		selectCron(item) {
			this.data.cron = item
		},
		// 校验hive表是否存在可用
		checkHiveTable() {
			let data = this.data
			let p = {
				hiveDb: data.hiveDb,
				pullIncreType: data.pullIncreType,
				tableName: data.hiveTable
			}

			if (!p.tableName) {
				this.hiveTableStatus = 1
				this.scrollTop()
				return Promise.reject('请输入目标表')
			}
			this.loading.hiveTable = true
			return new Promise((resolve, reject) => {
				Task.checkHiveTable(p).then(res => {
					this.loading.hiveTable = false
					if (res.code == 0) {
						this.hiveTableStatus = 0
						resolve()
						this.showAKeyTable = false
						// 校验成功，如果没有目标源表，就去请求
						if (!this.data.hiveColumn.length) {
							this.getHiveTables()
						}
					} else {
						this.hiveTableStatus = 1
						this.data.hiveColumn = []
						reject(res.message)
						// 如果接口提示需要手动建表则显示按钮，文字与后端协商不会变动
						this.showAKeyTable = res.message.indexOf('表不存在') > -1
						this.scrollTop()
					}

				}).catch(err => {
					this.loading.hiveTable = false
					this.hiveTableStatus = 1
					this.data.hiveColumn = []
					reject(err)
				})
			})
		},
		// 进入下一步前校验表单，源头表，目标表，连线等是否一致
		next(val) {
			this.showHiveTableWarning = true
			this.$refs.form.validate(valid => {
				if (valid) {
					// 如果目标表在加载中，不做任何操作
					if (this.loading.hiveColumn) { return }
					if (!this.data.columnName.length) {
						return this.$message.warning('源头表无数据，请回到上一步重新选择！')
					}
					if (!this.data.hiveColumn.length) {
						return this.$message.warning('目标表无数据，请重新填写！')
					}
					if (this.passed) {
						val && this.jump(val)
					} else {
						this.$message.warning('源头表与目标表字段映射不一致！')
					}
				} else {
					this.scrollTop()
				}
			})
		},
		jump(val) {
			this.$emit('update:active', val)
		},
		// 调度频率改变修改cron校验规则
		changeTaskMode() {
			this.rules.cron.required = this.data.taskMode == 1
		},
		// 获取字段映射数据源表
		getDataTables() {
			let data = this.data
			if (!data.datasourceId || !data.tableName) { return }
			this.loading.columnName = true
			Task.getDataTables({
				id: data.datasourceId,
				tableName: data.tableName
			}).then(res => {
				if (res.code == 0) {
					this.data.columnName = res.data
				} else {
					this.data.columnName = []
				}
				this.loading.columnName = false
			}).catch(err => {
				this.data.columnName = []
				this.loading.columnName = false
			})
		},
		// 获取字段映射数据源表
		getHiveTables() {
			if (!this.data.hiveTable || this.loading.hiveColumn || this.loading.hiveTable) { return }
			this.loading.hiveTable = this.loading.hiveColumn = true
			Task.getHiveTables({
				hiveDb: this.data.hiveDb,
				pullIncreType: this.data.pullIncreType,
				tableName: this.data.hiveTable
			}).then(res => {
				// 接口不稳定，如果请求中进入到第4部，不做任何操作，一般不会出现
				if (this.active == 4) { return }
				if (res.code == 0) {
					this.data.hiveColumn = res.data
					// 只有在点击下一步的时候提示此消息
					if (this.showHiveTableWarning && !res.data.length) {
						this.$message.warning('目标表无数据，无法继续此操作！')
					}
				} else {
					this.data.hiveColumn = []
					this.$message.error(res.message)
				}
				this.loading.hiveTable = this.showHiveTableWarning = this.loading.hiveColumn = false
			}).catch(err => {
				this.data.hiveColumn = []
				this.loading.hiveTable = this.showHiveTableWarning = this.loading.hiveColumn = false
				this.$message.error(err)
			})
		},
		// 获取表名
		getHiveTableName() {
			let d = this.data
			if (this.loading.hiveTable) { return }
			this.loading.hiveTable = true
			this.showAKeyTable = false
			Task.getHiveTableName({
				hiveDb: d.hiveDb,
				pullIncreType: d.pullIncreType,
				tableName: d.tableName
			}).then(res => {
				this.loading.hiveTable = false
				if (res.code == 0) {
					this.data.hiveTable = res.data
					this.$refs.form.validate(valid => {})
				} else {
					this.$message.error(res.message)
				}
			}).catch(err => {
				this.loading.hiveTable = false
				this.$message.error(err)
			})
		}
	},
	watch: {
		active(val, prev) {
			// 从接入源进入到输出源
			if (val == 3 && prev == 2) {
				// 比对原数据和编辑后的数据
				let old = this.oldData
				let now = this.data
				// 如果没有目标表，才获取，变动 hiveDb ，pullIncreType ，tableName 时，hiveTable设为空
				if (!now.hiveTable) {
					this.getHiveTableName()
				}
				this.scrollTop()
			}
			// 清空校验
			if (val == 1) {
				this.$refs.form.clearValidate()
			}
			// 进入到最后一步
			if (val == 4 && prev == 3) {
				this.scrollTop(0)
			}
			if (val == 3) {
				// 重置cron是否必填
				this.changeTaskMode()
			}
		},
		'data.tableName'(val, prev) {
			prev != ' ' && this.getDataTables()
		}
	}
}
</script>
<style lang="less">
.checkin-export {
	.el-form {
		padding: 15px 7% 0 7%;
	}
	.form-line {
		margin-left: 1.2%;
	}
	.zm-table tbody td {
		height: 34px;
	}
	.cron-select {
		.el-input-group__prepend {
			width: 120px;
		}
		.el-button {
			border-radius: 0 3px 3px 0;
		}
	}
	.el-input-group--prepend .el-select .el-input.is-focus .el-input__inner, .el-input-group--append .el-select .el-input.is-focus .el-input__inner {
		border-color: #409EFF;
	}
}

// 目标表校验
.check-status {
	font-size: 16px;
	.el-icon-i {
		display: none;
	}
	&:hover .el-icon-i {
		display: block;
	}
	&:hover>span {
		display: none;
	}
	// 校验成功
	&-0 {
		background-color: #13ce66;
		color: #fff;
		border-color: #13ce66;
	}
	// 校验失败
	&-1 {
		background-color: #ff4949;
		color: #fff;
		border-color: #ff4949;
	}
}
</style>