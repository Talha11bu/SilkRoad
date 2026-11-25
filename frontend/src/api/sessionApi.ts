/**
 * API functions for session lifecycle operations (create, join, rejoin, exit).
 */
import { API_BASE } from '../config';
import type { SessionResponse } from '../types';

/** Creates a new anonymous session. Returns the full session response with JWT. */
export async function createSession(
	password: string,
	durationMinutes: number
): Promise<SessionResponse> {
	const res = await fetch(`${API_BASE}/sessions/create`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			password,
			duration: `PT${durationMinutes}M`,
		}),
	});

	if (!res.ok) throw new Error('Host unreachable or server error.');

	const data: SessionResponse = await res.json();
	if (!data.success) throw new Error('Failed to create session.');

	return data;
}

/** Joins an existing session by ID and password. */
export async function joinSession(
	sessionId: string,
	password: string
): Promise<SessionResponse> {
	const res = await fetch(`${API_BASE}/sessions/join`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			sessionId: sessionId.trim(),
			password,
		}),
	});

	if (!res.ok)
		throw new Error(
			'Invalid Session ID, Incorrect Password, or Host Unreachable.'
		);

	const data: SessionResponse = await res.json();
	if (!data.success) throw new Error('Server rejected the handshake.');

	return data;
}

/** Attempts to rejoin a session using an existing JWT token. */
export async function rejoinSession(
	token: string
): Promise<SessionResponse | null> {
	try {
		const res = await fetch(`${API_BASE}/sessions/rejoin`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!res.ok) return null;

		const data: SessionResponse = await res.json();
		if (!data.success) return null;

		return data;
	} catch {
		return null;
	}
}

/** Ends or leaves a session using the participant's JWT token. */
export async function exitSession(
	sessionId: string,
	isHost: boolean
): Promise<void> {
	const token = localStorage.getItem('silk_road_jwt');
	if (!token) return;

	const endpoint = isHost
		? `${API_BASE}/sessions/${sessionId}`
		: `${API_BASE}/sessions/${sessionId}/leave`;

	await fetch(endpoint, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` },
	});
}
