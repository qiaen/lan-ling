<script>
export default {
	name: 'ServiceWorkerUpdatePopup',
	data() {
		return {
			refreshing: false,
			notificationText: '新版本已就绪，点击立即体验～～',
			refreshButtonText: ' 刷新',
			registration: null
		}
	},
	created() {
		// Listen for swUpdated event and display refresh notification as required.
		document.addEventListener('swUpdated', this.showRefreshUI, { once: true })
		// Refresh all open app tabs when a new service worker is installed.
		if (navigator.serviceWorker) {
			navigator.serviceWorker.addEventListener('controllerchange', () => {
				if (this.refreshing) return
				this.refreshing = true
				window.location.reload()
			})
		}
	},
	methods: {
		showRefreshUI(e) {
			// Display a notification inviting the user to refresh/reload the app due
			// to an app update being available.
			// The new service worker is installed, but not yet active.
			// Store the ServiceWorkerRegistration instance for later use.
			const h = this.$createElement
			this.registration = e.detail
			this.$notify.info({
				title: '客官上新了',
				message: h('div', { class: 'sw-update-popup' }, [
					this.notificationText,
					h('br'),
					h('button', {
						class: 'el-button el-button--success el-button--small mt10',
						on: {
							click: e => {
								e.preventDefault()
								this.refreshApp()
							}
						}
					}, [h('i', {
						class: 'el-icon-refresh'
					}, this.refreshButtonText)])
				]),
				position: 'bottom-right',
				duration: 0
			})
		},
		refreshApp() {
			// Protect against missing registration.waiting.
			if (!this.registration || !this.registration.waiting) return
			this.registration.waiting.postMessage('skipWaiting')
		}
	},
	// created() {
	// 	this.showRefreshUI({ detail: null })
	// }
}
</script>
<style lang="less">
.sw-update-popup>button {}
</style>