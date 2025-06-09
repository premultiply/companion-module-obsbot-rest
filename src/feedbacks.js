import { combineRgb } from '@companion-module/base'

export function setFeedbacks(self) {
	const feedbacks = {}

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorGreen = combineRgb(0, 204, 0)
	const colorOrange = combineRgb(255, 102, 0)
	const colorBlue = combineRgb(0, 51, 204)
	const colorGrey = combineRgb(51, 51, 51)
	const colorPurple = combineRgb(255, 0, 255)
	const colorBlack = combineRgb(0, 0, 0)

	feedbacks.inputSignal = {
		type: 'boolean',
		name: 'Input Signal status',
		description: 'Indicates whether a valid input signal has been detected',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorGreen,
		},
		options: [],
		callback: function () {
			return (
				self.data.vi.framerate > 0 && self.data.vi.video_ok !== 0 && self.data.aitick > 0 && self.data.ai.audio_ok !== 0
			)
		},
	}

	feedbacks.streamUsed = {
		type: 'boolean',
		name: `Stream usage`,
		description: `Indicates whether the selected stream encoder is in use`,
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorGreen,
		},
		options: [
			{
				type: 'checkbox',
				label: 'Use',
				id: 'use',
				default: true,
			},
			{
				type: 'dropdown',
				label: 'Stream',
				id: 'stream',
				default: 0,
				choices: [
					{ id: 0, label: 'Stream 1 (Main)' },
					{ id: 1, label: 'Stream 2 (Sub)' },
					{ id: 2, label: 'Stream 3 (Sub)' },
					{ id: 3, label: 'Stream 4 (Sub)' },
				],
			},
		],
		callback: function (feedback) {
			return self.data.vi.venc[feedback.options.stream].no_use === (feedback.options.use ? 0 : 1)
		},
	}

	feedbacks.streamConnection = {
		type: 'boolean',
		name: `Stream connection status`,
		description: `Indicates whether the selected type of outgoing stream is connected, not connected or disabled`,
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorGreen,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Type',
				id: 'type',
				default: 'rtmp',
				choices: [
					{ id: 'rtmp', label: 'RTMP Push' },
					{ id: 'srt', label: 'SRT Caller' },
					{ id: 'hls', label: 'HLS Push' },
				],
			},
			{
				type: 'dropdown',
				label: 'Status',
				id: 'status',
				default: 0,
				choices: [
					{ id: 0, label: 'Connected' },
					{ id: -1, label: 'Not connected' },
					{ id: null, label: 'Disabled' },
				],
			},
			{
				type: 'dropdown',
				label: 'Stream',
				id: 'stream',
				default: 0,
				choices: [
					{ id: 0, label: 'Stream 1 (Main)' },
					{ id: 1, label: 'Stream 2 (Sub)' },
					{ id: 2, label: 'Stream 3 (Sub)' },
					{ id: 3, label: 'Stream 4 (Sub)' },
				],
			},
		],
		callback: function (feedback) {
			switch (feedback.options.type) {
				case 'rtmp':
					return self.data.vi.venc[feedback.options.stream].rtmp_status === feedback.options.status
				case 'srt':
					return self.data.vi.venc[feedback.options.stream].srt_publish_status === feedback.options.status
				case 'hls':
					return self.data.vi.venc[feedback.options.stream].hls_publish_status === feedback.options.status
			}
		},
	}

	return feedbacks
}
