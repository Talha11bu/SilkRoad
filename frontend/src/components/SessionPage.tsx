import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSessionWebSocket } from '../hooks/useSessionWebSocket';
import { exitSession } from '../api/sessionApi';
import type { SessionData } from '../types';

import { SessionModals } from './SessionPage/SessionModals';
import { SessionSidebar } from './SessionPage/SessionSidebar';
import { FilePanel } from './SessionPage/FilePanel';

export const SessionPage = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const [sessionData] = useState<SessionData | null>(() => {
		const data = location.state?.sessionData;
		return data && data.success !== false ? data : null;
	});

	const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);
	const [isExitModalOpen, setIsExitModalOpen] = useState(false);

	const initialUserCount = sessionData?.session?.userCount ?? 1;
	const initialFiles =
		sessionData?.session?.files?.map((f) => f.fileName) ?? [];

	const { userCount, files, disconnect } = useSessionWebSocket(
		sessionData?.session?.sessionId,
		initialUserCount,
		initialFiles,
		() => setIsExpiredModalOpen(true)
	);

	const returnToBase = () => {
		localStorage.removeItem('silk_road_jwt');
		disconnect();
		navigate('/');
	};

	const isHost = Boolean(sessionData?.host);

	const handleExitSession = async () => {
		if (!sessionData) return;

		try {
			await exitSession(sessionData.session.sessionId, isHost);
		} catch (error) {
			console.error('Error communicating exit to server:', error);
		} finally {
			returnToBase();
		}
	};

	if (!sessionData || isExpiredModalOpen) {
		return (
			<SessionModals
				isErrorOpen={!sessionData}
				isExpiredOpen={isExpiredModalOpen}
				isExitOpen={false}
				isHost={isHost}
				onNavigateHome={() => navigate('/')}
				onReturnToBase={returnToBase}
				onExitConfirm={handleExitSession}
				onExitCancel={() => setIsExitModalOpen(false)}
			/>
		);
	}

	return (
		<div className='min-h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col'>
			<SessionModals
				isErrorOpen={false}
				isExpiredOpen={false}
				isExitOpen={isExitModalOpen}
				isHost={isHost}
				onNavigateHome={() => navigate('/')}
				onReturnToBase={returnToBase}
				onExitConfirm={handleExitSession}
				onExitCancel={() => setIsExitModalOpen(false)}
			/>

			{/* TOP NAVBAR: Session Info */}
			<SessionSidebar
				sessionId={sessionData.session.sessionId}
				password={sessionData.session.password}
				expiresAt={sessionData.session.expiresAt}
				timeLeftStr={sessionData.timeLeft}
				userCount={userCount}
				isHost={isHost}
				onExpire={() => setIsExpiredModalOpen(true)}
				onExit={() => setIsExitModalOpen(true)}
			/>

			{/* MAIN AREA: File Upload & List */}
			<FilePanel
				sessionId={sessionData.session.sessionId}
				password={sessionData.session.password}
				files={files}
			/>
		</div>
	);
};
