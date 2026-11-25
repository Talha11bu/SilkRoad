/**
 * Shared TypeScript interfaces aligned with the Spring Boot backend models.
 */

/** A file entity as serialized by the backend. */
export interface SessionFile {
	id: number;
	fileName: string;
	r2Key: string;
}

/** The Session entity as serialized by the backend. */
export interface SessionState {
	sessionId: string;
	password: string;
	createdAt: string;
	expiresAt: string;
	userCount: number;
	files: SessionFile[];
}

/**
 * Unified response shape for create, join, and rejoin endpoints.
 */
export interface SessionResponse {
	success: boolean;
	token: string;
	session: SessionState;
	timeLeft: string;
	host: boolean;
}

export type SessionData = SessionResponse;

/** WebSocket notification payload from /topic/session/{sessionId}. */
export interface SessionNotification {
	type: 'USER_JOINED' | 'USER_LEFT' | 'FILE_UPLOADED' | 'FILE_DELETED';
	sessionId: string;
	payload: string;
}
