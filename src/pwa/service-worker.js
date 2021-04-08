// This is the code piece that GenerateSW mode can't provide for us.
// This code listens for the user's confirmation to update the app.
self.addEventListener('message', e => {
	if (e.data) {
		if (e.data === 'skipWaiting') {
			self.skipWaiting()
		}
	}
})

// eslint-disable-next-line no-undef
workbox.clientsClaim()

// The precaching code provided by Workbox. You don't need to change this part.
self.__precacheManifest = [].concat(self.__precacheManifest || [])
// eslint-disable-next-line no-undef
workbox.precaching.suppressWarnings()
// eslint-disable-next-line no-undef
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})