import { Regex } from '@companion-module/base'

export const ConfigFields = [
	{
		type: 'textinput',
		id: 'host',
		label: 'IP address / Hostname',
		width: 5,
		default: '192.168.1.168',
		regex: Regex.HOSTNAME,
	},
	{
		type: 'number',
		id: 'port',
		label: 'HTTP port (default: 80)',
		width: 4,
		default: 80,
		regex: Regex.PORT,
	},
]
