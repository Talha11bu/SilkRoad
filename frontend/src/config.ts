/** Central configuration constants for the SilkRoad frontend. */

export const API_BASE =
	import.meta.env?.BUN_PUBLIC_API_URL || 'http://localhost:8080';
export const WS_BASE =
	import.meta.env?.BUN_PUBLIC_WS_URL || 'ws://localhost:8080/ws';
