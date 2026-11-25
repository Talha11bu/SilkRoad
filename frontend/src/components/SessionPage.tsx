import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AstrolabeIcon from '../resources/AstrolabeIcon';

import { useSessionWebSocket } from '../hooks/useSessionWebSocket';
import { exitSession } from '../api/sessionApi';
import type { SessionData } from '../types';

import { SessionModals } from './SessionPage/SessionModals';
import { SessionSidebar } from './SessionPage/SessionSidebar';
import { UserList } from './SessionPage/UserList';
import { MobileDrawer } from './SessionPage/MobileDrawer';
import { FilePanel } from './SessionPage/FilePanel';

export const SessionPage = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const [sessionData] = useState<SessionData | null>(() => {
		const data = location.state?.sessionData;
		return (data && data.success !== false) ? data : null;
	});

	const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);
	const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
	const [isExitModalOpen, setIsExitModalOpen] = useState(false);

	// Extract initial lists for the WebSocket hook
	const initialUsers = sessionData?.session?.users?.map(
		(u) => u.username
	) ?? [];
	const initialFiles = sessionData?.session?.files?.map(
		(f) => f.fileName
	) ?? [];

	const { users, files, disconnect } = useSessionWebSocket(
		sessionData?.session?.sessionId,
		initialUsers,
		initialFiles,
		() => setIsExpiredModalOpen(true)
	);

	const returnToBase = () => {
		localStorage.removeItem('silk_road_jwt');
		disconnect();
		navigate('/');
	};

	const isHost = sessionData?.clientUsername === sessionData?.session?.users?.[0]?.username;

	const handleExitSession = async () => {
		if (!sessionData) return;

		try {
			await exitSession(
				sessionData.session.sessionId,
				sessionData.clientUsername,
				!!isHost
			);
		} catch (error) {
			console.error('Error communicating exit to server:', error);
		} finally {
			returnToBase();
		}
	};

	// Full-screen modals (error / expired) render before layout
	if (!sessionData || isExpiredModalOpen) {
		return (
			<SessionModals
				isErrorOpen={!sessionData}
				isExpiredOpen={isExpiredModalOpen}
				isExitOpen={false}
				isHost={!!isHost}
				onNavigateHome={() => navigate('/')}
				onReturnToBase={returnToBase}
				onExitConfirm={handleExitSession}
				onExitCancel={() => setIsExitModalOpen(false)}
			/>
		);
	}

	return (
		<div className="min-h-screen md:h-screen bg-[var(--bg)] text-[var(--fg)] flex flex-col md:flex-row overflow-x-hidden">
			{/* Exit Confirmation Modal */}
			<SessionModals
				isErrorOpen={false}
				isExpiredOpen={false}
				isExitOpen={isExitModalOpen}
				isHost={!!isHost}
				onNavigateHome={() => navigate('/')}
				onReturnToBase={returnToBase}
				onExitConfirm={handleExitSession}
				onExitCancel={() => setIsExitModalOpen(false)}
			/>

			{/* MOBILE HEADER */}
			<div className="md:hidden flex items-center justify-between p-3 border-b border-[var(--border)] bg-[var(--bg)] z-20">
				<div className="flex items-center gap-2">
					<AstrolabeIcon size={18} mainColor="var(--fg)" accentColor="var(--accent)" />
					<span className="font-bold tracking-wider text-sm uppercase">
						silkroad
					</span>
				</div>
				<button
					onClick={() => setIsMobileDrawerOpen(true)}
					className="px-2 py-1 border border-[var(--border)] text-[var(--fg)] text-xs"
				>
					[users]
				</button>
			</div>

			{/* LEFT COLUMN: Sidebar */}
			<div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--bg)] flex flex-col p-4 overflow-y-auto">
				{/* Desktop Header */}
				<div className="hidden md:flex items-center gap-2 mb-6 shrink-0">
					<AstrolabeIcon size={20} mainColor="var(--fg)" accentColor="var(--accent)" />
					<span className="font-bold tracking-wider text-base uppercase">
						silkroad
					</span>
				</div>

				<SessionSidebar
					sessionId={sessionData.session.sessionId}
					password={sessionData.session.password}
					expiresAt={sessionData.session.expiresAt}
					timeLeftStr={sessionData.timeLeft}
					isHost={!!isHost}
					onExpire={() => setIsExpiredModalOpen(true)}
					onExit={() => setIsExitModalOpen(true)}
				/>

				{/* Desktop User List */}
				<div className="hidden md:flex flex-col flex-1 min-h-0">
					<p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-4 border-b border-white/10 pb-2 flex items-center justify-between">
						<span>Connected Agents</span>
						<span className="bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded text-[10px]">
							{users.length}
						</span>
					</p>
					<UserList
						users={users}
						clientUsername={sessionData.clientUsername}
					/>
				</div>
			</div>

			{/* RIGHT COLUMN: File Panel */}
			<div className="flex-1 w-full md:h-screen md:overflow-y-auto bg-[#050505] flex flex-col">
				<FilePanel
					sessionId={sessionData.session.sessionId}
					password={sessionData.session.password}
					files={files}
				/>
			</div>

			{/* MOBILE DRAWER */}
			<MobileDrawer
				isOpen={isMobileDrawerOpen}
				onClose={() => setIsMobileDrawerOpen(false)}
				users={users}
				clientUsername={sessionData.clientUsername}
			/>
		</div>
	);
};