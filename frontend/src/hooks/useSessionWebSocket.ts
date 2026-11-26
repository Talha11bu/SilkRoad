import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { WS_BASE } from '../config';
import type { SessionNotification } from '../types';

/**
 * Custom hook encapsulating the STOMP WebSocket lifecycle.
 * Tracks connected user count and session file names.
 */
export function useSessionWebSocket(
	sessionId: string | undefined,
	initialUserCount: number,
	initialFiles: string[],
	onSessionEnded: () => void
) {
	const [userCount, setUserCount] = useState<number>(initialUserCount);
	const [files, setFiles] = useState<string[]>(initialFiles);
	const stompClient = useRef<Client | null>(null);

	const onSessionEndedRef = useRef(onSessionEnded);
	useEffect(() => {
		onSessionEndedRef.current = onSessionEnded;
	}, [onSessionEnded]);

	useEffect(() => {
		if (!sessionId) return;

		const token = localStorage.getItem('silk_road_jwt');

		const client = new Client({
			brokerURL: `${WS_BASE}?token=${token}`,
			reconnectDelay: 5000,
			onConnect: () => {
				client.subscribe(`/topic/session/${sessionId}`, (message) => {
					if (message.body.includes('successfully ended')) {
						onSessionEndedRef.current();
						return;
					}

					try {
						const data: SessionNotification = JSON.parse(message.body);
						const parsedCount = Number.parseInt(data.payload, 10);

						switch (data.type) {
							case 'USER_JOINED':
								setUserCount((prev) =>
									Number.isNaN(parsedCount) ? prev + 1 : parsedCount
								);
								break;
							case 'USER_LEFT':
								setUserCount((prev) =>
									Number.isNaN(parsedCount)
										? Math.max(1, prev - 1)
										: Math.max(1, parsedCount)
								);
								break;
							case 'FILE_UPLOADED':
								setFiles((prev) => [...new Set([...prev, data.payload])]);
								break;
							case 'FILE_DELETED':
								setFiles((prev) => prev.filter((f) => f !== data.payload));
								break;
						}
					} catch {
						console.error('Failed to parse WebSocket message:', message.body);
					}
				});
			},
			onWebSocketError: (error) => {
				console.error('WebSocket Error:', error);
			},
		});

		client.activate();
		stompClient.current = client;

		return () => {
			if (stompClient.current) {
				stompClient.current.deactivate();
			}
		};
	}, [sessionId]);

	const disconnect = () => {
		if (stompClient.current) stompClient.current.deactivate();
	};

	return { userCount, files, disconnect };
}
