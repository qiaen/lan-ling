<template>
	<li class="checkin-access">
		<el-alert class="check-alert" title="在这里填写接入源信息，可以使用默认数据源，也可以到数据源管理自定义数据源" :closable="false" show-icon>
		</el-alert>
		<sline title="接入源信息" size="big" class="pt5"></sline>
		<el-form ref="form" :model="data" :rules="rules" size="small" label-width="115px">
			<el-form-item label="作业名称" prop="jobName">
				<el-input v-model="data.jobName" placeholder="请输入作业名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="所属业务方" prop="jobBu">
				<el-select class="width100" placeholder="请选择所属业务方" v-model="data.jobBu">
					<el-option v-for="item in serviceEnum.JOB_BU" :label="item.name" :value="item.value" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="数据源" prop="datasourceId">
				<div class="flex el-input el-input--small el-input-group el-input-group--prepend">
					<div style="width: 40px" class="el-input-group__prepend center shrink0 fc333">
						<i class="iconfont icon-mysql fsize13 pr5"></i>Mysql</div>
					<div class="flex1">
						<el-select @change="dataSourceChange" :loading="xoading.availableDataSource" filter class="width100" v-model="data.datasourceId" placeholder="请选择数据源" ref="dataSourceSelect" filterable>
							<el-option></el-option>
						</el-select>
					</div>
				</div>
			</el-form-item>
			<el-form-item label="表名称" prop="tableName">
				<div class="flex el-input el-input--small el-input-group el-input-group--append">
					<div class="flex1">
						<el-select @change="data.hiveTable = ''" :disabled="!data.datasourceId" @focus="getTablesBySource" :loading="xoading.sourceTables" class="width100" v-model="data.tableName" placeholder="请选择源头表" filterable>
							<el-option v-for="item in sourceTables.access" :label="item" :value="item" :key="item"></el-option>
						</el-select>
					</div>
					<!-- <div style="width: 16px" class="check-status check- el-input-group__append center shrink0">
						<i class="el-icon-success"></i>
						<i class="el-icon-loading"></i>
						<i class="el-icon-error"></i>
					</div> -->
				</div>
			</el-form-item>
			<el-form-item label="数据过滤" prop="whereClause">
				<el-input v-model="data.whereClause" placeholder="请输入where语句过滤条件（不包含where关键字），默认为空" clearable></el-input>
			</el-form-item>
			<el-form-item label="作业模式" prop="pullIncreType">
				<el-radio-group v-model="data.pullIncreType" @change="data.hiveTable = ''">
					<el-tooltip v-for="item in serviceEnum.PULL_INCRE_TYPE" :key="item.value" effect="dark" content="该模式占用资源较多，请根据需求场景谨慎选择！" :disabled="!['day_all','hour_all'].includes(item.value)" placement="top">
						<el-radio :label="item.value">{{item.name}}</el-radio>
					</el-tooltip>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="分隔键" prop="splitPk">
				<el-input v-model="data.splitPk" placeholder="请输入数据切割字段，不填默认按ID自增切割" clearable></el-input>
			</el-form-item>
			<el-form-item label="作业需求描述" prop="description">
				<el-input type="textarea" v-model="data.description" placeholder="请输入作业需求描述信息" clearable></el-input>
			</el-form-item>
		</el-form>
		<div class="center flex">
			<el-button type="primary" v-show="!data.id" size="small" @click="jump(1)">上一步</el-button>
			<el-button type="primary" size="small" @click="next(3)" :disabled="xoading.sourceTables">下一步</el-button>
		</div>
		<sline title="注意事项" size="big" class="pt5"></sline>
		<div class="remark">
			<h4>数据源说明</h4>
			<p>请保障配置的数据源与大数据集群网络环境连接正常，且数据源非业务主库信息，如网络不通、数据源非从库配置请联系运维、DBA进行配置处理。</p>
			<h4>作业模式说明</h4>
			<p>目前包含四种作业模式：小时增量、小时全量、按天增量、按天全量，注意小时全量需要考虑数据量大小，如果数据表千万级别，请走实时同步流程。</p>
		</div>
	</li>
</template>
<script>
import Mixins from '@/mixins'
export default {
	props: ['active', 'data'],
	inject: ['scrollTop'],
	name: 'checkin-access',
	mixins: [Mixins],
	data() {
		return {
			rules: {
				jobName: { required: true, message: '请填写作业名称', trigger: 'blur' },
				jobBu: { required: true, message: '请选择所属业务方', trigger: 'change' },
				datasourceId: { required: true, message: '请选择数据源', trigger: 'change' },
				tableName: { required: true, message: '请选择源头表', trigger: 'change' },
				pullIncreType: { required: true, message: '请选择作业模式', trigger: 'change' },
				description: { required: true, message: '请填写需求描述', trigger: 'blur' }
			}
		}
	},
	methods: {
		next(val) {
			this.$refs.form.validate(valid => {
				if (valid) {
					// 获取数据源名称
					this.$set(this.data, 'datasourceName', this.$refs.dataSourceSelect.selectedLabel)
					// 获取数据库名
					let dbName = ''
					let options = this.$refs.dataSourceSelect.options
					for (let d of options) {
						if (d.value === this.data.datasourceId) {
							dbName = d.$attrs.dbName
							break
						}
					}
					this.$set(this.data, 'datasourceDb', dbName)
					this.jump(val)
				} else {
					this.scrollTop()
				}
			})
		},
		jump(val) {
			this.$emit('update:active', val)
		},
		getTablesBySource() {
			this.getTablesBySourceId('access', this.data.datasourceId)
		},
		// 数据源名称变动
		dataSourceChange() {
			this.data.tableName = ''
		}
	},
	watch: {
		active(val, prev) {
			// 清空校验
			if (val == 1) {
				this.$refs.form.clearValidate()
			}
		}
	}
}
</script>
<style lang="less">
.checkin-access {
	.el-form {
		padding: 15px 7%;
	}
	.form-line {
		margin: 0 1.2%;
	}
	.el-input-group--prepend .el-select .el-input.is-focus .el-input__inner, .el-input-group--append .el-select .el-input.is-focus .el-input__inner {
		border-color: #409EFF;
	}
}
</style>