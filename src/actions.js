export function setActions(self) {
	const actions = {}

	actions.rtmpPush = {
		name: 'RTMP Push',
		options: [
			{
				type: 'dropdown',
				label: 'Action',
				id: 'operation',
				default: '1',
				choices: [
					{ id: '1', label: 'Enable' },
					{ id: '0', label: 'Disable' },
				],
			},
			{
				type: 'dropdown',
				label: 'Stream',
				id: 'stream',
				default: '0',
				choices: [
					{ id: '0', label: 'Stream 1 (Main)' },
					{ id: '1', label: 'Stream 2 (Sub)' },
					{ id: '2', label: 'Stream 3 (Sub)' },
					{ id: '3', label: 'Stream 4 (Sub)' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand(
				`set_output?input=0&output=${action.options.stream}&rtmp_publish_enable=${action.options.operation}`,
			)
		},
	}

	actions.srtCaller = {
		name: 'SRT Caller',
		options: [
			{
				type: 'dropdown',
				label: 'Action',
				id: 'operation',
				default: '1',
				choices: [
					{ id: '1', label: 'Enable' },
					{ id: '0', label: 'Disable' },
				],
			},
			{
				type: 'dropdown',
				label: 'Stream',
				id: 'stream',
				default: '0',
				choices: [
					{ id: '0', label: 'Stream 1 (Main)' },
					{ id: '1', label: 'Stream 2 (Sub)' },
					{ id: '2', label: 'Stream 3 (Sub)' },
					{ id: '3', label: 'Stream 4 (Sub)' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand(
				`set_output?input=0&output=${action.options.stream}&srt_publish_enable=${action.options.operation}`,
			)
		},
	}

	actions.reboot = {
		name: 'Reboot',
		description: 'Reboots the device without any further confirmation',
		options: [],
		callback: async (action) => {
			await self.sendCommand('reboot')
		},
	}

	return actions
}
