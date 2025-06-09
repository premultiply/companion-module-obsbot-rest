import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'

import { setVariables, checkVariables } from './variables.js'
import { setActions } from './actions.js'
import { setFeedbacks } from './feedbacks.js'
import { setPresets } from './presets.js'
import { ConfigFields } from './config.js'

import WebSocket from 'ws'
import Queue from 'queue-fifo'

class ObsbotRestCameraInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.pollID = null
	}

	async init(config) {
		this.data = this.emptyCache()

		this.config = config

		this.initWebSocket()

		this.init_variables()
		//this.init_actions()
		//this.init_feedbacks()
		//this.init_presets()

		this.checkVariables()

		this.queue = new Queue()

		this.controller = new AbortController()

		//this.updateStatus(InstanceStatus.Connecting)

		this.enablePolling()
	}

	// Cleanup when the module gets deleted or disabled.
	async destroy() {
		this.disablePolling()
		this.controller.abort()
		if (this.ws) {
			this.ws.close(1000)
			delete this.ws
		}
		this.updateStatus(InstanceStatus.Disconnected)
	}

	// Update module after a config change
	async configUpdated(config) {
		this.disablePolling()
		this.controller.abort()
		this.updateStatus(InstanceStatus.Disconnected, 'Config changed')

		this.init(config)
	}

	enablePolling() {
		clearInterval(this.pollID)
		this.pollID = setInterval(() => this.pullData(), 1000)
		this.log('debug', 'Polling enabled with 1s interval')
	}

	disablePolling() {
		clearInterval(this.pollID)
		this.pollID = null
		this.log('debug', 'Polling disabled')
	}

	emptyCache() {
		return {
			record: {
				control: { recording: 'off' },
				bitrate: { bitrate: 60000000, bitrateLevel: 'high' },
				encoder: { encoder: 'h264' },
				resolution: { resolution: '1920X1080P50' },
			},
			'ndi-rtsp': {
				control: { control: 'ndi' },
				bitrate: { bitrateLevel: 'high' },
				encoder: { encoder: 'h264' },
				resolution: { resolution: '1920X1080P50' },
			},
			hdmi: {
				output: {
					resolution: { resolution: '1920X1080P50' },
				},
			},
			usb: {
				mode: { mode: 'uvc' },
			},
			audio: {
				input: {
					source: { source: 'buildIn' },
					volume: { volume: 80 },
					mute: { enable: false },
					enc: { enable: true, level: 'weak' },
					agc: { enable: true },
				},
			},
			ai: {
				workmode: { mode: 'none' },
				trackspeed: { speed: 'standard' },
				gesturecontrol: {
					lockedtarget: { enable: false },
					recording: { enable: false },
					zoom: { enable: false },
					zoomfactor: { factor: 1 },
					dynamiczoom: { enable: false },
					dynamiczoomdirection: { direction: 'forward' },
				},
			},
			image: {
				hdr: {
					control: { control: 'off' },
				},
				af: {
					mode: { mode: 'mf' },
					trackmode: { mode: 'face' },
					motorposition: { position: 74 },
					windowcenter: { x: 0.5, y: 0.5 },
				},
				exposure: {
					mode: { mode: 'auto' },
					auto: {
						mode: { mode: 'face' },
						compensation: { evbias: 0 },
						isorange: { isomin: 100, isomax: 6400 },
						lock: { enable: false },
					},
					manual: {
						shuttertime: { shutter: '1/30' },
						iso: { iso: 100 },
					},
					antiflick: {
						mode: { mode: 'off' },
					},
				},
				whitebalance: {
					config: { mode: 'manual', temperature: 4000 },
				},
				style: {
					mode: { mode: 'standard', brightness: 50, contrast: 50, hue: 50, saturation: 50, sharpness: 50 },
				},
			},
			ptz: {
				gimbalinvert: { enable: false },
				zoom: { enable: 4 },
				preset: {
					presetList: [
						{ id: 0, pitch: 1.64, yaw: -53.3, roll: 0, ratio: 1.51, name: 'UDE=' },
						{ id: 1, pitch: -8.38, yaw: 4.29, roll: 0, ratio: 2, name: 'SGFsYm5haA==' },
						{ id: 2, pitch: -12.8, yaw: 11.9, roll: 0, ratio: 1, name: 'U3RlaHRpcw==' },
						{ id: 3, pitch: 8.93, yaw: 149, roll: 0, ratio: 1, name: 'UDQ=' },
					],
				},
			},
			status: {
				preset_cnt: [
					{
						id: 0,
						name: 'UDE=',
					},
					{
						id: 1,
						name: 'SGFsYm5haA==',
					},
					{
						id: 2,
						name: 'U3RlaHRpcw==',
					},
					{
						id: 3,
						name: 'UDQ=',
					},
				],
				ratio: 4.0,
				iszoom: false,
				target: 0,
				capture: false,
				record: false,
				af_mode: 3,
				mf_position: 74,
				is_active: true,
				ndi_available: true,
				rtmp_info: {
					rtmp_status: 0,
				},
				sdcard: {
					status: 2,
					total: 15929475072,
					available: 15713042432,
					sdcard_speed: 2,
					avail_time: 2095,
					format: 2,
				},
				device_status: {
					is_gimbal_online: true,
					is_ai_online: true,
					is_battery_online: true,
					is_lens_online: true,
					is_tof_online: true,
					is_sensor_ok: true,
					is_media_ok: true,
					is_ble_ok: true,
					is_usbwifi_attached: false,
					is_poe_attached: true,
					is_hdmi_attached: false,
					is_35mm_attached: false,
					is_remote_attached: false,
					is_charge: true,
					battery_cap: 89,
					battery_temperature: 23748,
					battery_temperature_status: 0,
					cpu_temperature: 0,
					cpu_temperature_status: 0,
					lens_temperature: 42,
					lens_temperature_status: 0,
				},
			},
		}
	}

	initWebSocket() {
		this.updateStatus(InstanceStatus.Connecting)

		const url = `ws://${this.config.host}:${this.config.port}/ws/`

		if (this.ws) {
			this.ws.close(1000)
			delete this.ws
		}
		this.ws = new WebSocket(url)

		this.ws.on('open', () => {
			this.updateStatus(InstanceStatus.Ok)
			this.log('debug', `Connection opened`)
			if (this.config.reset_variables) {
				this.updateVariables()
			}
		})
		this.ws.on('close', (code) => {
			this.log('debug', `Connection closed with code ${code}`)
			this.updateStatus(InstanceStatus.Disconnected, `Connection closed with code ${code}`)
		})

		this.ws.on('message', this.messageReceivedFromWebSocket.bind(this))

		this.ws.on('error', (data) => {
			this.log('error', `WebSocket error: ${data}`)
		})
	}

	messageReceivedFromWebSocket(data) {
		this.log('debug', `Message received: ${data}`)

		let msgValue = null
		if (Buffer.isBuffer(data)) {
			data = data.toString()
		}

		if (typeof data === 'object') {
			msgValue = data
		} else {
			try {
				msgValue = JSON.parse(data)
			} catch (e) {
				msgValue = data
			}
		}
	}

	async sendCommand(cmd) {
		this.log('debug', 'sendCommand()')

		const t = AbortSignal.timeout(5000)

		const options = {
			signal: AbortSignal.any([t, this.controller.signal]),
		}

		const start = Date.now()
		try {
			await this.getAPI(cmd, options)

			this.updateStatus(InstanceStatus.Ok)
		} catch (error) {
			switch (error.name) {
				case 'TimeoutError':
					this.updateStatus(
						InstanceStatus.ConnectionFailure,
						'Timeout - Check configuration and connection to the device',
					)
					this.data = this.emptyCache()
				case 'AbortError':
					break
				default:
					this.log('error', String(error))
			}
		} finally {
			const dt = Date.now() - start
			this.log('debug', `...returned after ${dt}ms.`)

			this.checkVariables()
			this.checkFeedbacks()
		}
	}

	async pullData() {
		this.log('debug', 'pullData()')

		if (this.queue.isEmpty()) {
			//this.queue.enqueue('record')
			//this.queue.enqueue('record/control')
			this.queue.enqueue('record/bitrate')
			this.queue.enqueue('record/encoder')
			this.queue.enqueue('record/resolution')
			this.queue.enqueue('ndi-rtsp/control')
			this.queue.enqueue('ndi-rtsp/bitrate')
			this.queue.enqueue('ndi-rtsp/encoder')
			this.queue.enqueue('ndi-rtsp/resolution')
			this.queue.enqueue('hdmi/output/resolution')
			this.queue.enqueue('usb/mode')
			this.queue.enqueue('audio/input/source')
			this.queue.enqueue('audio/input/volume')
			this.queue.enqueue('audio/input/mute')
			this.queue.enqueue('audio/input/enc')
			this.queue.enqueue('audio/input/agc')
			this.queue.enqueue('ai/workmode')
			this.queue.enqueue('ai/trackspeed')
			this.queue.enqueue('ai/gesturecontrol/lockedtarget')
			this.queue.enqueue('ai/gesturecontrol/recording')
			this.queue.enqueue('ai/gesturecontrol/zoom')
			this.queue.enqueue('ai/gesturecontrol/zoomfactor')
			this.queue.enqueue('ai/gesturecontrol/dynamiczoom')
			this.queue.enqueue('ai/gesturecontrol/dynamiczoomdirection')
			this.queue.enqueue('image/hdr/control')
			//this.queue.enqueue('image/af/mode')
			this.queue.enqueue('image/af/trackmode')
			//this.queue.enqueue('image/af/motorposition')
			this.queue.enqueue('image/af/windowcenter')
			this.queue.enqueue('image/exposure/mode')
			this.queue.enqueue('image/exposure/auto/mode')
			this.queue.enqueue('image/exposure/auto/compensation')
			this.queue.enqueue('image/exposure/auto/isorange')
			this.queue.enqueue('image/exposure/auto/lock')
			this.queue.enqueue('image/exposure/manual/shuttertime')
			this.queue.enqueue('image/exposure/manual/iso')
			this.queue.enqueue('image/exposure/antiflick/mode')
			this.queue.enqueue('image/whitebalance/config')
			this.queue.enqueue('image/style/mode')
			this.queue.enqueue('ptz/gimbalinvert')
			//this.queue.enqueue('ptz/zoom')
			this.queue.enqueue('ptz/preset')
		}

		const t = AbortSignal.timeout(950)

		const options = {
			signal: AbortSignal.any([t, this.controller.signal]),
		}

		const start = Date.now()
		try {
			await this.getAPI(this.queue.dequeue(), options)

			this.updateStatus(InstanceStatus.Ok)
		} catch (error) {
			switch (error.name) {
				case 'TimeoutError':
					this.updateStatus(
						InstanceStatus.ConnectionFailure,
						'Timeout - Check configuration and connection to the camera',
					)
					this.data = this.emptyCache()
				case 'AbortError':
					break
				default:
					this.log('error', String(error))
			}
		} finally {
			const dt = Date.now() - start
			this.log('debug', `...returned after ${dt}ms.`)

			this.checkVariables()
			this.checkFeedbacks()

			if (!this.controller.signal.aborted && !this.queue.isEmpty()) {
				this.pollID = setTimeout(() => this.pullData(), 10)
			}
		}
	}

	async getAPI(cmd, options) {
		const url = `http://${this.config.host}:${this.config.port}/camera/sdk/${cmd}`
		this.log('debug', 'GET ' + url)

		const response = await fetch(url, options)
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status} ${response.statusText}`)
		}

		const data = await response.json()
		this.log('debug', `Response: ${JSON.stringify(data)}`)

		return data
	}

	// Return config fields for web config
	getConfigFields() {
		return ConfigFields
	}

	// ##########################
	// #### Instance Actions ####
	// ##########################
	init_actions() {
		this.setActionDefinitions(setActions(this))
	}

	// ############################
	// #### Instance Feedbacks ####
	// ############################
	init_feedbacks() {
		this.setFeedbackDefinitions(setFeedbacks(this))
	}

	// ############################
	// #### Instance Variables ####
	// ############################
	init_variables() {
		this.setVariableDefinitions(setVariables(this))
	}

	// Update Values
	checkVariables() {
		checkVariables(this)
	}

	// ##########################
	// #### Instance Presets ####
	// ##########################
	init_presets() {
		this.setPresetDefinitions(setPresets(this))
	}
}

runEntrypoint(ObsbotRestCameraInstance)
