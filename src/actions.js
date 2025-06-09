export function setActions(self) {
	const actions = {}

	actions.ptMove = {
		name: 'Pan/Tilt - Move',
		options: [
			{
				type: 'dropdown',
				label: 'Direction',
				id: 'dir',
				default: '11',
				choices: [
					{ id: '11', label: 'Stop' },
					{ id: '21', label: '➡ Right' },
					{ id: '01', label: '⬅ Left' },
					{ id: '10', label: '⬆ Up' },
					{ id: '12', label: '⬇ Down' },
					{ id: '20', label: '⬈ Up Right' },
					{ id: '00', label: '⬉ Up Left' },
					{ id: '02', label: '⬋ Down Left' },
					{ id: '22', label: '⬊ Down Right' },
				],
			},
		],
		callback: async (action) => {
			if (action.options.dir === '11') {
				// Stop
				await self.sendCommand('/gimbal_speed', 'POST', { pitch: 0, yaw: 0, roll: 0, stop: true })
				//if (self.speedChangeEmitter.listenerCount('ptSpeed')) self.speedChangeEmitter.removeAllListeners('ptSpeed')
			} else {
				let arr = Array.from(action.options.dir)
				let yaw = (parseInt(arr[0]) - 1) * 1
				let pitch = (parseInt(arr[1]) - 1) * 1
				await self.sendCommand('/gimbal_speed', 'POST', { pitch, yaw, roll: 0, stop: false })
				//await self.getPTZ('PTS' + cmdSpeed(pan * self.pSpeed + SPEED_OFFSET) + cmdSpeed(tilt * self.tSpeed + SPEED_OFFSET),)
				// if (action.options.liveSpeed) {
				// 	self.speedChangeEmitter.removeAllListeners('ptSpeed').then(
				// 		self.speedChangeEmitter.on('ptSpeed', async () => {
				// 			await self.getPTZ(
				// 				'PTS' + cmdSpeed(pan * self.pSpeed + SPEED_OFFSET) + cmdSpeed(tilt * self.tSpeed + SPEED_OFFSET),
				// 			)
				// 		}),
				// 	)
				// }
			}
		},
	}

	return actions
}
