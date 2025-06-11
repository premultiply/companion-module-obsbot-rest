export function setVariables(self) {
	return [
		{ variableId: 'exposureMode', name: 'Exposure mode' },
		{ variableId: 'focusMode', name: 'Focus mode' },
		{ variableId: 'focusPosition', name: 'Focus position' },
		{ variableId: 'zoomPosition', name: 'Zoom position' },
	]
}
export function checkVariables(self) {
	self.setVariableValues({
		exposureMode: self.data.image?.exposure?.mode?.mode,
		focusMode: self.data.image?.af?.mode?.mode,
		//focusMode: self.status?.af_mode,
		focusPosition: self.status?.mf_position,
		zoomPosition: self.status?.ratio?.toFixed(2) + 'x',
	})
}
