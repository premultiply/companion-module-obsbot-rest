function createConfiguredHttpClient({
	baseURL,
	withCredentials = false,
	timeout,
	headers,
	useAuth = true,
	showToastOnError = true,
	returnRawResponse = false,
} = {}) {
	const axiosInstance = MF.create({
		baseURL,
		withCredentials,
		timeout,
		headers,
	})
	axiosInstance.interceptors.request.use(
		(config) => {
			if (useAuth) {
				const token = NF()
				if (token) {
					config.headers.Authorization = 'bearer ' + token
				}
			}
			return config
		},
		(error) => Promise.reject(error),
	)
	axiosInstance.interceptors.response.use(
		(response) => {
			if (returnRawResponse) return response
			const { data } = response
			return data
		},
		(error) => {
			if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
				console.log('Request timed out')
				error.isTimeout = true
				return Promise.reject(error)
			}
			const errorMessage = error.message
			let detailedMessage
			const { response } = error || {}
			if (response && response.data) {
				const { data } = response
				if (data.detail) {
					detailedMessage = data.detail + ` (${data.err_idx})`
				}
				if (data.err_idx !== void 0) {
					Wa.emit(Mo.ON_API_ERROR, data)
				}
			}
			if (showToastOnError) {
				if (detailedMessage) {
					console.error(detailedMessage)
				} else {
					window.$toast.error(errorMessage)
				}
			}
			return Promise.reject(error)
		},
	)
	return axiosInstance
}
