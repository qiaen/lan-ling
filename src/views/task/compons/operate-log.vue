<!-- 查看日志 -->
<template>
	<el-dialog :title="'查看日志 - ' + data.actionSid" :visible.sync="dialog.log" class="zm-dialog operate-log" width="90%" @closed="logInfo = ''" append-to-body>
		<section class="fc333 fsize13" style="min-height: 200px" :class="{fcred: hasErr}" v-loading="loading.log">
			<code v-html="logInfo || ''"></code>
		</section>
		<span slot="footer" class="dialog-footer">
			<el-button @click="dialog.log = false" size="small">关 闭</el-button>
			<el-button :loading="loading.log" type="primary" icon="el-icon-refresh" @click="get" size="small">刷新</el-button>
		</span>
	</el-dialog>
</template>
<script>
import * as Schedule from '@api/Schedule'
export default {
	props: ['data', 'dialog'],
	name: 'checkin-log',
	data() {
		return {
			loading: {
				log: false
			},
			// 日志信息
			logInfo: '',
			// 日志是否有误，有误则显示红色字体
			hasErr: false
		}
	},
	methods: {
		get() {
			this.loading.log = true
			this.hasErr = false
			Schedule.getLog({
				actionIds: [this.data.actionId],
				actionSids: [this.data.actionSid]
			}).then(res => {
				this.loading.log = false
				if (res.code == 0) {
					let data = res.data || {}
					let info = data.logInfo || ''
					this.logInfo = info ? info.replace(/<br\/>/g, '\n') : '暂无日志'
					window.requestAnimationFrame(() => {
						let dom = document.querySelector('.operate-log')
						dom.scrollTop = dom.scrollHeight
						dom = null
					})
				} else {
					this.hasErr = true
					this.logInfo = '加载失败！' + res.message
				}
			}).catch(err => {
				this.hasErr = true
				this.loading.log = false
				this.logInfo = '加载失败！' + err
			})
		}
	},
	watch: {
		'dialog.log'(val) {
			if (val) {
				this.get()
			}
		}
	}
}
</script>
<style lang="less">
.operate-log {
	code {
		white-space: pre-wrap;
		word-wrap: break-word;
		font-family: Consolas;
	}
}
</style>