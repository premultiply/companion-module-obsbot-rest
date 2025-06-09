import { combineRgb } from '@companion-module/base'

export function setPresets(self) {
	var presets = []

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorGreen = combineRgb(0, 204, 0)
	const colorOrange = combineRgb(255, 102, 0)
	const colorBlue = combineRgb(0, 51, 204)
	const colorGrey = combineRgb(51, 51, 51)
	const colorPurple = combineRgb(255, 0, 255)
	const colorBlack = combineRgb(0, 0, 0)

	presets['inputStatus'] = {
		type: 'button',
		category: 'System',
		name: 'Input Status',
		style: {
			text: 'Input\\n\\nVideo:\\n$(generic-module:vi_format)\\n\\nAudio:\\n$(generic-module:ai_format)',
			size: '7',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'inputSignal',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorGreen,
				},
			},
			{
				feedbackId: 'inputSignal',
				options: {},
				style: {
					color: colorWhite,
					bgcolor: colorRed,
				},
				isInverted: true,
			},
		],
	}

	self.data.vi.venc.forEach((item, index) => {
		presets[`stream${index}_format`] = {
			type: 'button',
			category: 'System',
			name: `Stream ${index + 1}: Encoding Format`,
			style: {
				text: `Stream ${index + 1}\\n\\n$(generic-module:stream${index}_codec)\\n$(generic-module:stream${index}_bitrate) kBit/s\\n$(generic-module:stream${index}_format)`,
				size: '7',
				color: colorWhite,
				bgcolor: colorBlack,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'streamUsed',
					options: {
						use: true,
						stream: index,
					},
					style: {
						color: colorWhite,
						bgcolor: colorGreen,
					},
				},
				{
					feedbackId: 'streamUsed',
					options: {
						use: false,
						stream: index,
					},
					style: {
						color: colorWhite,
						bgcolor: colorGrey,
					},
				},
			],
		}
	})

	presets['reboot'] = {
		type: 'button',
		category: 'System',
		name: 'Reboot Device (Hold for 2s)',
		style: {
			text: 'Reboot\\n↺',
			size: '18',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		options: {
			relativeDelay: false,
		},
		steps: [
			{
				down: [],
				up: [],
				2000: {
					options: { runWhileHeld: true },
					actions: [
						{
							actionId: 'reboot',
							options: {},
						},
					],
				},
			},
		],
		feedbacks: [],
	}

	const streamTypes = [
		{ id: 'rtmp', label: 'RTMP Push' },
		{ id: 'srt', label: 'SRT Caller' },
		{ id: 'hls', label: 'HLS Push' },
	]

	streamTypes.forEach((streamType) => {
		self.data.vi.venc.forEach((_, index) => {
			presets[`stream${index}_${streamType.id}_status`] = {
				type: 'button',
				category: 'Stream Connection',
				name: `Stream ${index + 1}: ${streamType.label} Connection Status`,
				style: {
					text: `Stream ${index + 1}\\n\\n${streamType.label}\\n\\n$(generic-module:stream${index}_${streamType.id}_status)`,
					size: '7',
					color: colorWhite,
					bgcolor: colorBlack,
				},
				steps: [
					{
						down: [],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'streamConnection',
						options: {
							type: streamType.id,
							status: 0,
							stream: index,
						},
						style: {
							color: colorWhite,
							bgcolor: colorGreen,
						},
					},
					{
						feedbackId: 'streamConnection',
						options: {
							type: streamType.id,
							status: -1,
							stream: index,
						},
						style: {
							color: colorWhite,
							bgcolor: colorRed,
						},
					},
					{
						feedbackId: 'streamConnection',
						options: {
							type: streamType.id,
							status: null,
							stream: index,
						},
						style: {
							color: colorGrey,
							bgcolor: colorBlack,
						},
					},
				],
			}
		})
	})

	return presets
}
